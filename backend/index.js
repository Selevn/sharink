import YTMusic from "ytmusic-api"
import { YMApi } from "ym-api-meowed";


const ytmusic = new YTMusic()
await ytmusic.initialize(/* Optional: Custom cookies */)


const name = "Why'd you only call me when you're high"
const actor = "Arctic Monkeys"

export const youtubeSongsFinder = async (name, actor) => {
    const songs = await ytmusic.searchSongs(`${name} ${actor}`)
    const correctActor = songs.filter(item => actor.toLowerCase() === item.artist.name.toLowerCase())
    return 'https://music.youtube.com/watch?v=' + correctActor[0].videoId
}

export const yandexSongsFinder = async (name, actor) => {
    const api = new YMApi();
    await api.init({ access_token: "y0_AgAEA7qhdQC8AAG8XgAAAAEO2pILAAAxzVjxVkFNwIZidKdsgoZdzXGz0Q", uid: 1130000014442684 });
    const result = await api.searchTracks(`${name} ${actor}`);
    return `https://music.yandex.ru/album/${result.tracks.results[0].albums[0].id}/track/${result.tracks.results[0].id}`;
}

export const spotifySongsFinder = async (name, actor) => {
    async function getProfile(accessToken) {
        let accessToken = localStorage.getItem('access_token');

        const response = await fetch('https://api.spotify.com/v1/me', {
            headers: {
                Authorization: 'Bearer ' + accessToken
            }
        });

        const data = await response.json();
}

yandexSongsFinder('След', 'Рано').then(res => console.log(res))

