import {Redis} from "ioredis";
import {env} from "@/common/utils/envConfig";
import {CacheServiceInterface} from "@/domain/interfaces/cache-service.interface";
import {CacheEntity, CacheEntityUpdate, CacheID} from "@/domain/types";
import {LoggerInterface} from "@/domain/interfaces/logger.interface";
import {ConsoleLogger} from "@/common/utils/logger";

export class RedisRepository implements CacheServiceInterface<CacheEntity, CacheID, CacheEntityUpdate> {
    _redis;
    _logger: LoggerInterface;

    constructor() {
        this._redis = new Redis(
            env.REDIS_PORT,
            env.REDIS_HOST,
            {
                password: env.REDIS_PASSWORD,
            }
        );
        this._logger = new ConsoleLogger('RedisRepository')
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
        this._logger.log(`Got data by id: ${id}`)
        return JSON.parse(data!) as CacheEntity;
    }

    async has(id: CacheID): Promise<boolean> {
        const res = Boolean(await this._redis.exists(id));
        this._logger.log(`Data by id: ${id} existence: ${res}`)
        return res
    }

    async set(id: CacheID, value: CacheEntity): Promise<boolean> {
        await this._redis.set(id, JSON.stringify(value), "EX", env.REDIS_TTL);
        this._logger.log(`Set data with id: ${id}`)
        return true
    }

    async update(id: CacheID, value: CacheEntityUpdate): Promise<boolean> {
        const data = await this.get(id);
        data.links[value.origin] = value.link;
        return await this.set(id, data)
    }
}