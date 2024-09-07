import {CacheServiceInterface} from "@/domain/interfaces/cache-service.interface";
import {DatabaseInterface, ScrapperInterface} from "@/domain/interfaces";
import {CacheEntity, CacheID, Link, RequestEntity} from "@/domain/types";
import {IdGeneratorService} from "@/domain/id-generator.service";

export class MasterService {
    constructor(
        private readonly databaseService: DatabaseInterface<CacheEntity, CacheID>,
        private readonly cacheService: CacheServiceInterface<CacheEntity, CacheID>,
        private readonly yandexScrapper: ScrapperInterface,
        private readonly youtubeInterface: ScrapperInterface,
    ) {
    }

    async copyTrack(entity: RequestEntity): Promise<Link> {
        const hash = IdGeneratorService.generateHash(entity);
        if (!await this.cacheService.has(hash)) {
            const yandexResult = this.yandexScrapper.getTrack(entity);
            const youtubeResult = this.youtubeInterface.getTrack(entity);
            const [yandexLink, youtubeLink] = (await Promise.allSettled([
                yandexResult, youtubeResult
            ])).map(item => item.status === 'fulfilled' ? item.value : '')

            console.log(youtubeLink, yandexLink);

            if(await this.cacheService.healthCheck()){
                this.cacheService.set(hash, {
                    name: entity.name,
                    author: entity.author,
                    cover: entity.cover,
                    links:
                        {yandex: yandexLink, youtube: youtubeLink, spotify: ''}
                })
            }

            this.databaseService.create(hash, {
                name: entity.name,
                author: entity.author,
                cover: entity.cover,
                links:
                    {yandex: yandexLink, youtube: youtubeLink, spotify: ''}

            })
        }

        return hash
    };

    async getTrack(id: Link): Promise<CacheEntity | null> {
        const hash = id;
        if (await this.cacheService.healthCheck() && await this.cacheService.has(hash)) {
            return this.cacheService.get(hash);
        } else {
            return await this.databaseService.read(id);

            /*
            const databaseResult = await this.databaseService.read(id);

            if(databaseResult){
                return databaseResult;
            } else {
                return null;
            }*/
        }
    };
}