import {Redis} from "ioredis";
import {env} from "@/common/utils/envConfig";
import {CacheServiceInterface} from "@/domain/interfaces/cache-service.interface";
import {CacheEntity, CacheID} from "@/domain/types";

export class RedisRepository implements CacheServiceInterface<CacheEntity, CacheID> {
    _redis;

    constructor() {
        this._redis = new Redis(
            env.REDIS_PORT,
            env.REDIS_HOST,
            {
                password: env.REDIS_PASSWORD,
            }
        );
    }

    async healthCheck(): Promise<boolean> {
        try {
            return await Promise.race(
                [new Promise<boolean>(async (res) => {
                    res(await this._redis.ping() === 'PONG')
                }), new Promise<boolean>((res) => {
                    setTimeout(() => {
                        res(false)
                    }, 1000)
                })])
        } catch (error) {
            return false;
        }
    }

    async get(id: CacheID): Promise<CacheEntity> {
        const data = await this._redis.get(id);
        return JSON.parse(data!) as CacheEntity;
    }

    async has(id: CacheID): Promise<boolean> {
        return Boolean(await this._redis.exists(id));
    }

    async set(id: CacheID, value: CacheEntity): Promise<boolean> {
        await this._redis.set(id, JSON.stringify(value), "EX", env.REDIS_TTL);
        return true
    }
}