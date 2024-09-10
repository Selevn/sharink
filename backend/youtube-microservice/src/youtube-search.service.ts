import YTMusic from "ytmusic-api"
import {Link, ScrapEntity, KafkaRequest} from 'sharink-lib'

export class YoutubeMusicScrapper {
    private readonly api: YTMusic;

    constructor() {
        this.api = new YTMusic()
        this.api.initialize()
    }

    async getTrack({name, author}: KafkaRequest): Promise<Link> {
        const songs = await this.api.searchSongs(`${name} ${author}`)
        const correctActor = songs.filter(item => author.toLowerCase() === item.artist.name.toLowerCase())
        return 'https://music.youtube.com/watch?v=' + correctActor[0]?.videoId
    }
}