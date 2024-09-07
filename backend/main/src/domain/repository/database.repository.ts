import {CacheEntity, CacheEntityWithId, CacheID} from "@/domain/types";
import {DatabaseInterface} from "@/domain/interfaces";
import {
MongoClient, Db, Collection
} from "mongodb";
import {env} from "@/common/utils/envConfig";

export class MongoDatabaseRepository implements DatabaseInterface<CacheEntityWithId,CacheID>{

    client: MongoClient;
    db: Db | undefined;
    collection: Collection<CacheEntityWithId> | undefined;

    constructor() {

        this.client = new MongoClient(`mongodb://${env.MONGO_LOGIN}:${env.MONGO_PASSWORD}@${env.MONGO_HOST}:${env.MONGO_PORT}`);

        this.client.connect().then(()=>{
            this.db = this.client.db(env.MONGO_DB_NAME);

            this.collection = this.db.collection<CacheEntityWithId>(env.MONGO_COLLECTION_NAME);
            this.collection.createIndex({id: 1})
        });
    }

    async create(id: string, value: CacheEntity): Promise<boolean> {
        return !!(await this.collection?.insertOne({id, ...value}))!.insertedId
    }

    async delete(id: string): Promise<boolean> {
        return (await this.collection?.deleteOne({id}))!.deletedCount === 1;
    }

    async read(id: CacheID): Promise<CacheEntityWithId | null> {
        return (await this.collection?.findOne({id})) || null;
    }
}