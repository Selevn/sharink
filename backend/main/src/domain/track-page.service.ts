import Handlebars from "handlebars";
import path from "path";
import fs from "fs";

import { TrackPageServiceInterface } from "./interfaces";
import { TrackPage, Track } from "./types";

export class TrackPageService implements TrackPageServiceInterface {
  constructor() {
    Handlebars.registerHelper("musicServiceLogo", (serviceName: string) => {
      switch (serviceName) {
        case "yandex": {
          return "https://yastatic.net/s3/doc-binary/src/mediaservices/yandex_music_ru_whitebg.svg";
        }
        case "spotify": {
          return "https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Full_Logo_RGB_Green.png";
        }
        case "youtube": {
          return "https://services.linkfire.com/logo_youtubemusic_onlight.svg";
        }
        default: {
          return "";
        }
      }
    });
  }

  getTrackPage(track: Track): TrackPage {
    const filePath = path.join(__dirname, "templates", "track-page.hbs");
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const page = Handlebars.compile(fileContent)(track);

    return page;
  }
}
