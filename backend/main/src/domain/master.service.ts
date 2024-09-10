import {CacheServiceInterface} from "@/domain/interfaces/cache-service.interface";
import {DatabaseInterface, ScrapperInterface} from "@/domain/interfaces";
import {
    CacheEntity,
    CacheEntityUpdate,
    CacheID,
    KAFKA_TOPICS,
    KafkaRequest,
    KafkaResponse,
    Link,
    RequestEntity
} from "@/domain/types";
import {IdGeneratorService} from "@/domain/id-generator.service";
import {LoggerInterface} from "@/domain/interfaces/logger.interface";
import {ConsoleLogger} from "@/common/utils/logger";
import {MicroserviceInterface} from "@/domain/interfaces/microservice.interface";

export class MasterService {
    _logger: LoggerInterface;

    constructor(
        private readonly databaseService: DatabaseInterface<CacheEntity, CacheID, CacheEntityUpdate>,
        private readonly cacheService: CacheServiceInterface<CacheEntity, CacheID, CacheEntityUpdate>,
        private readonly microservice: MicroserviceInterface<KafkaRequest, KafkaResponse>,
    ) {
        this._logger = new ConsoleLogger(`MasterService`)
        this.microservice.init(this.handleTrack.bind(this))
    }

    private async handleTrack(data: KafkaResponse): Promise<void> {
        this._logger.log(`Updating ${data.id} in cache and database`)
        this.cacheService.update(data.id, {origin: data.service, link: data.link})
        this.databaseService.update(data.id, {origin: data.service, link: data.link})
    }

    async copyTrack(entity: RequestEntity): Promise<Link> {
        this._logger.log(`Copy track ${entity.name}-${entity.author} started`)
        const hash = IdGeneratorService.generateHash(entity);
        if (!await this.cacheService.has(hash)) {
            this._logger.log(`Hash does not exists ${entity.name}-${entity.author}`)

            if (await this.cacheService.healthCheck()) {
                await this.cacheService.set(hash, {
                    name: entity.name,
                    author: entity.author,
                    cover: entity.cover,
                    type: entity.entity,
                    origin: entity.origin,
                    links: {yandex: '', youtube: '', spotify: ''}
                })
                this._logger.log(`Cache service data dummy set`)
            } else {
                this._logger.warn(`Cache service healthcheck failed`)
            }

            await this.databaseService.create(hash, {
                name: entity.name,
                author: entity.author,
                cover: entity.cover,
                type: entity.entity,
                origin: entity.origin,
                links:
                    {yandex: '', youtube: '', spotify: ''}
            })
            this._logger.log(`Database service data dummy set`)

            const kafkaRequest: KafkaRequest = {
                id: hash,
                name: entity.name,
                author: entity.author,
                entity: entity.entity
            }
            await this.microservice.send([KAFKA_TOPICS.YANDEX, KAFKA_TOPICS.YOUTUBE], kafkaRequest)

        } else {
            this._logger.log(`Hash already have track ${entity.name}-${entity.author}: ${hash}`)
        }

        return hash
    };

    async getTrack(id: Link): Promise<CacheEntity | null> {
        const hash = id;
        if (await this.cacheService.healthCheck() && await this.cacheService.has(hash)) {
            this._logger.log(`Cache service hash ${id} found`)
            return this.cacheService.get(hash);
        } else {
            this._logger.log(`Cache service hash ${id} not found - looking into db`)
            const databaseResult = await this.databaseService.read(id);

            if (databaseResult) {
                this._logger.log(`Database hash ${id} found`)
                this.cacheService.set(id, databaseResult);
                return databaseResult;
            } else {
                this._logger.log(`Database hash ${id} not found`)
                return null;
            }
        }
    };
}