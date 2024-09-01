import {CacheEntity, CacheID} from "@/domain/types/cache.types";
import {CacheServiceInterface} from "@/domain/interfaces/cache-service.interface";

export class CacheService implements CacheServiceInterface {

    private readonly _storage: Map<CacheID, CacheEntity>;

    constructor() {
        this._storage = new Map();
    }

    set(id: CacheID, value: CacheEntity): boolean {
        this._storage.set(id, value);
        return true
    }

    has(id: CacheID): boolean {
        return this._storage.has(id);
    }

    get(id: CacheID): CacheEntity {
        return this._storage.get(id) as CacheEntity
    }
}