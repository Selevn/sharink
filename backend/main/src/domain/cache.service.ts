import {CacheEntity, CacheID} from "@/domain/types/cache.types";
import {CacheServiceInterface} from "@/domain/interfaces/cache-service.interface";

export class CacheService implements CacheServiceInterface {

    private readonly _storage: Map<CacheID, CacheEntity>;

    constructor() {
        this._storage = new Map();
    }

    async set(id: CacheID, value: CacheEntity): Promise<boolean> {
        this._storage.set(id, value);
        return true
    }

    async has(id: CacheID): Promise<boolean> {
        return this._storage.has(id);
    }

    async get(id: CacheID): Promise<CacheEntity> {
        return this._storage.get(id) as CacheEntity
    }
}