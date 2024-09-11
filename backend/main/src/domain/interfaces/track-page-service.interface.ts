import { TrackPage, Track } from "../types";

export interface TrackPageServiceInterface {
  getTrackPage(track: Track): TrackPage;
}
