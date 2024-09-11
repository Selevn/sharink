import Handlebars from "handlebars";
import path from "path";
import fs from "fs";

import { TrackPageServiceInterface } from "./interfaces";
import { TrackPage, Track } from "./types";

export class TrackPageService implements TrackPageServiceInterface {
  getTrackPage(track: Track): TrackPage {
    const filePath = path.join(__dirname, "templates", "track-page.hbs");
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const page = Handlebars.compile(fileContent)(track);

    return page;
  }
}
