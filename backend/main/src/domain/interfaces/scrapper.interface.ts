import {RequestEntity, Link} from "@/domain/types";

export interface ScrapperInterface {
    getTrack(entity: RequestEntity): Promise<Link>
}