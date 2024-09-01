import {ScrapperInterface} from "@/domain/interfaces";
import {RequestEntity, Link} from "../types";
import { YMApi } from "ym-api-meowed";

export class YandexMusicScrapper implements ScrapperInterface {

    private readonly api: YMApi;

    constructor() {
        this.api = new YMApi();
        this.api.init({
            access_token: "y0_AgAEA7qhdQC8AAG8XgAAAAEO2pILAAAxzVjxVkFNwIZidKdsgoZdzXGz0Q",
            uid: 1130000014442684
        });
    }

    async getTrack(entity: RequestEntity): Promise<Link> {
        const result = await this.api.searchTracks(`${entity.name} ${entity.author}`);
        return `https://music.yandex.ru/album/${result.tracks.results[0].albums[0].id}/track/${result.tracks.results[0].id}`;
    }
}