import {CacheServiceInterface} from "@/domain/interfaces/cache-service.interface";
import {ScrapperInterface} from "@/domain/interfaces";
import {CacheEntity, Link, RequestEntity} from "@/domain/types";
import {IdGeneratorService} from "@/domain/id-generator.service";

export class MasterService {
    constructor(
        private readonly cacheService: CacheServiceInterface,
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

            this.cacheService.set(hash, {
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
        if (await this.cacheService.has(hash)) {
            return this.cacheService.get(hash);
        } else {
            return null;
        }
    };
}