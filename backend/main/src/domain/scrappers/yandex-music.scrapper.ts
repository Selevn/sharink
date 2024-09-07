import {ScrapperInterface} from "@/domain/interfaces";
import {RequestEntity, Link} from "../types";
import { YMApi } from "ym-api-meowed";
import {env} from "@/common/utils/envConfig";

export class YandexMusicScrapper implements ScrapperInterface {

    private readonly api: YMApi;

    constructor() {
        this.api = new YMApi();
        this.api.init({
            access_token: env.YA_ACCESS_TOKEN,
            uid: env.YA_UID
        });
    }

    async getTrack(entity: RequestEntity): Promise<Link> {
        const result = await this.api.searchTracks(`${entity.name} ${entity.author}`);
        return `https://music.yandex.ru/album/${result.tracks.results[0].albums[0].id}/track/${result.tracks.results[0].id}`;
    }
}