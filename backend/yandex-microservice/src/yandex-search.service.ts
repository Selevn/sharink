import { YMApi } from "ym-api-meowed";
import {env} from "@/utils/envConfig.js";
import {Link, ScrapEntity} from '@/lib.js'

export class YandexMusicScrapper {

    private readonly api: YMApi;

    constructor() {
        this.api = new YMApi();
        this.api.init({
            access_token: env.YA_ACCESS_TOKEN,
            uid: env.YA_UID
        });
    }

    async getTrack(entity: ScrapEntity): Promise<Link> {
        const result = (await this.api.searchTracks(`${entity.name} ${entity.author}`))!;
        console.log(`results`,result.tracks.results)
        return `https://music.yandex.ru/album/${result.tracks.results[0]!.albums[0]!.id}/track/${result.tracks.results[0]!.id}`;
    }
}