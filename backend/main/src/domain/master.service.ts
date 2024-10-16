import { KAFKA_TOPICS } from "sharink-lib";

import { CacheServiceInterface } from "@/domain/interfaces/cache-service.interface";
import { DatabaseInterface } from "@/domain/interfaces";
import {
  CacheEntity,
  CacheEntityUpdate,
  CacheID,
  KafkaRequest,
  KafkaResponse,
  Link,
  RequestEntity,
  Track,
  TrackPage,
} from "@/domain/types";
import { IdGeneratorService } from "@/domain/id-generator.service";
import { LoggerInterface } from "@/domain/interfaces/logger.interface";
import { ConsoleLogger } from "@/common/utils/logger";
import { MicroserviceInterface } from "@/domain/interfaces/microservice.interface";
import { TrackPageServiceInterface } from "./interfaces/track-page-service.interface";

export class MasterService {
  _logger: LoggerInterface;

  constructor(
    private readonly databaseService: DatabaseInterface<
      CacheEntity,
      CacheID,
      CacheEntityUpdate
    >,
    private readonly cacheService: CacheServiceInterface<
      CacheEntity,
      CacheID,
      CacheEntityUpdate
    >,
    private readonly microservice: MicroserviceInterface<
      KafkaRequest,
      KafkaResponse
    >,
    private readonly trackPageService: TrackPageServiceInterface
  ) {
    this._logger = new ConsoleLogger(`MasterService`);

    this.microservice.init(this.handleTrackLinksUpdate.bind(this));
  }

  private async handleTrackLinksUpdate(data: KafkaResponse): Promise<void> {
    this._logger.log(`Updating ${data.id} in cache and database`);

    this.cacheService.update(data.id, {
      origin: data.service,
      link: data.link,
    });

    this.databaseService.update(data.id, {
      origin: data.service,
      link: data.link,
    });
  }

  async copyTrack(entity: RequestEntity): Promise<Link> {
    this._logger.log(`Copy track ${entity.name}-${entity.author} started`);
    const hash = IdGeneratorService.generateHash(entity);

    const trackExist = await this.cacheService.has(hash);
    if (trackExist) {
      this._logger.log(
        `Hash already have track ${entity.name}-${entity.author}: ${hash}`
      );

      return hash;
    }

    this._logger.log(`Hash does not exists ${entity.name}-${entity.author}`);

    const track = {
      name: entity.name,
      author: entity.author,
      cover: entity.cover,
      type: entity.entity,
      origin: entity.origin,
      links: { yandex: "", youtube: "", spotify: "" },
    };

    const isCacheServiceHealthy = await this.cacheService.healthCheck();
    if (isCacheServiceHealthy) {
      await this.cacheService.set(hash, track);

      this._logger.log(`Cache service data dummy set`);
    } else {
      this._logger.warn(`Cache service healthcheck failed`);
    }

    await this.databaseService.create(hash, track);

    this._logger.log(`Database service data dummy set`);

    const kafkaRequest: KafkaRequest = {
      id: hash,
      name: entity.name,
      author: entity.author,
      entity: entity.entity,
    };

    await this.microservice.send(
      [KAFKA_TOPICS.YANDEX, KAFKA_TOPICS.YOUTUBE],
      kafkaRequest
    );

    return hash;
  }

  async getTrack(id: Link): Promise<Track | null> {
    const hash = id;
    if (
      (await this.cacheService.healthCheck()) &&
      (await this.cacheService.has(hash))
    ) {
      this._logger.log(`Cache service hash ${id} found`);

      return this.cacheService.get(hash);
    }

    this._logger.log(`Cache service hash ${id} not found - looking into db`);

    const databaseResult = await this.databaseService.read(id);
    if (databaseResult) {
      this._logger.log(`Database hash ${id} found`);
      this.cacheService.set(id, databaseResult);

      return databaseResult;
    } else {
      this._logger.log(`Database hash ${id} not found`);

      return null;
    }
  }

  async getTrackPage(id: Link): Promise<TrackPage | null> {
    const track = await this.getTrack(id);
    if (!track) {
      return null;
    }

    const page = this.trackPageService.getTrackPage(track);

    return page;
  }
}
