import {
  CacheEntity,
  CacheEntityUpdate,
  CacheEntityWithId,
  CacheID,
} from "@/domain/types";
import { DatabaseInterface, LoggerInterface } from "@/domain/interfaces";
import { MongoClient, Db, Collection } from "mongodb";
import { env } from "@/common/utils/envConfig";
import { ConsoleLogger } from "@/common/utils/logger";

export class MongoDatabaseRepository
  implements DatabaseInterface<CacheEntityWithId, CacheID, CacheEntityUpdate>
{
  client: MongoClient;
  db: Db | undefined;
  collection: Collection<CacheEntityWithId> | undefined;
  _logger: LoggerInterface;
  constructor() {
    this.client = new MongoClient(
      `mongodb://${env.MONGO_LOGIN}:${env.MONGO_PASSWORD}@${env.MONGO_HOST}:${env.MONGO_PORT}`
    );

    this.client.connect().then(() => {
      this.db = this.client.db(env.MONGO_DB_NAME);

      this.collection = this.db.collection<CacheEntityWithId>(
        env.MONGO_COLLECTION_NAME
      );
      this.collection.createIndex({ id: 1 });
    });
    this._logger = new ConsoleLogger("MongoRepository");
  }

  async create(id: string, value: CacheEntity): Promise<boolean> {
    this._logger.log(`Creating ${id}`);
    return !!(await this.collection?.insertOne({ id, ...value }))!.insertedId;
  }

  async delete(id: string): Promise<boolean> {
    this._logger.log(`Deleting ${id}`);
    return (await this.collection?.deleteOne({ id }))!.deletedCount === 1;
  }

  async read(id: CacheID): Promise<CacheEntityWithId | null> {
    this._logger.log(`Reading ${id}`);
    return (await this.collection?.findOne({ id })) || null;
  }

  async update(id: CacheID, value: CacheEntityUpdate): Promise<boolean> {
    this._logger.log(`Updating ${id} with ${value}`);
    return (
      ((
        await this.collection?.updateOne(
          { id },
          {
            $set: {
              [`links.${value.origin}`]: value.link,
            },
          }
        )
      )?.matchedCount || 0) > 0
    );
  }
}
