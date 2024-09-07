import {Redis} from "ioredis";
import {env} from "@/common/utils/envConfig";
import {CacheServiceInterface} from "@/domain/interfaces/cache-service.interface";
import {CacheEntity, CacheID} from "@/domain/types";

export class CacheRepository implements CacheServiceInterface{
    _redis;
    constructor() {
        this._redis = new Redis({
            host: 'localhost',
            port: env.REDIS_PORT,
            //password: env.REDIS_PASSWORD,
        });
    }

    async get(id: CacheID): Promise<CacheEntity> {
        const data = await this._redis.get(id);
        return JSON.parse(data!) as CacheEntity;
    }

    async has(id: CacheID): Promise<boolean> {
        return Boolean(await this._redis.exists(id));
    }

    async set(id: CacheID, value: CacheEntity): Promise<boolean> {
        await this._redis.set(id, JSON.stringify(value));
        return true
    }
}