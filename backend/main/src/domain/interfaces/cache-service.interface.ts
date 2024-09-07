import {CacheID, CacheEntity} from "@/domain/types";

export interface CacheServiceInterface {
    set(id: CacheID, value: CacheEntity): Promise<boolean>

    has(id: CacheID): Promise<boolean>

    get(id: CacheID): Promise<CacheEntity>
}