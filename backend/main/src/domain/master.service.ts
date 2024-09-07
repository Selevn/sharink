import {CacheServiceInterface} from "@/domain/interfaces/cache-service.interface";
import {DatabaseInterface, ScrapperInterface} from "@/domain/interfaces";
import {CacheEntity, CacheID, Link, RequestEntity} from "@/domain/types";
import {IdGeneratorService} from "@/domain/id-generator.service";
import {LoggerInterface} from "@/domain/interfaces/logger.interface";
import {ConsoleLogger} from "@/common/utils/logger";

export class MasterService {
    _logger: LoggerInterface;
    constructor(
        private readonly databaseService: DatabaseInterface<CacheEntity, CacheID>,
        private readonly cacheService: CacheServiceInterface<CacheEntity, CacheID>,
        private readonly yandexScrapper: ScrapperInterface,
        private readonly youtubeInterface: ScrapperInterface,
    ) {
        this._logger = new ConsoleLogger(`MasterService`)
    }

    async copyTrack(entity: RequestEntity): Promise<Link> {
        this._logger.log(`Copy track ${entity.name}-${entity.author} started`)
        const hash = IdGeneratorService.generateHash(entity);
        if (!await this.cacheService.has(hash)) {
            this._logger.log(`Hash does not exists ${entity.name}-${entity.author}`)

            const yandexResult = this.yandexScrapper.getTrack(entity);
            const youtubeResult = this.youtubeInterface.getTrack(entity);
            const [yandexLink, youtubeLink] = (await Promise.allSettled([
                yandexResult, youtubeResult
            ])).map(item => item.status === 'fulfilled' ? item.value : '')

            if(await this.cacheService.healthCheck()){
                this.cacheService.set(hash, {
                    name: entity.name,
                    author: entity.author,
                    cover: entity.cover,
                    links:
                        {yandex: yandexLink, youtube: youtubeLink, spotify: ''}
                })
                this._logger.log(`Cache service data set`)
            } else {
                this._logger.warn(`Cache service healthcheck failed`)
            }

            this.databaseService.create(hash, {
                name: entity.name,
                author: entity.author,
                cover: entity.cover,
                links:
                    {yandex: yandexLink, youtube: youtubeLink, spotify: ''}

            })
            this._logger.log(`Database service data set`)
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

            if(databaseResult){
                this._logger.log(`Database hash ${id} found`)
                return databaseResult;
            } else {
                this._logger.log(`Database hash ${id} not found`)
                return null;
            }
        }
    };
}