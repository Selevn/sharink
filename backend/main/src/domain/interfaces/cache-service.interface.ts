import {CacheID, CacheEntity} from "@/domain/types";

export interface CacheServiceInterface {
    set(id: CacheID, value: CacheEntity): boolean

    has(id: CacheID): boolean

    get(id: CacheID): CacheEntity
}