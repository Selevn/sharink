import {ScrapperInterface} from "@/domain/interfaces";
import {RequestEntity, Link} from "../types";
import YTMusic from "ytmusic-api"

export class YoutubeMusicScrapper implements ScrapperInterface {
    private readonly api: YTMusic;

    constructor() {
        this.api = new YTMusic()
        this.api.initialize()
    }

    async getTrack({name, author}: RequestEntity): Promise<Link> {
        const songs = await this.api.searchSongs(`${name} ${author}`)
        const correctActor = songs.filter(item => author.toLowerCase() === item.artist.name.toLowerCase())
        return 'https://music.youtube.com/watch?v=' + correctActor[0].videoId
    }
}