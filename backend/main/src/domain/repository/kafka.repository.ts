import { Consumer, KafkaClient, Producer } from "kafka-node";
import { ConsoleLogger } from "@/common/utils/logger";
import { LoggerInterface } from "@/domain/interfaces/logger.interface";
import { MicroserviceInterface } from "@/domain/interfaces/microservice.interface";
import { env } from "@/common/utils/envConfig";
import { KAFKA_TOPICS } from "sharink-lib";

export class KafkaRepository<T, K> implements MicroserviceInterface<T, K> {
  _client: KafkaClient;
  _consumer: Consumer | undefined;
  _producer: Producer | undefined;
  _logger: LoggerInterface;

  constructor() {
    this._logger = new ConsoleLogger("Kafka");

    this._client = new KafkaClient({
      kafkaHost: `${env.KAFKA_HOST}:${env.KAFKA_PORT}`,
    });
  }

  init(handler: (data: K) => void): void {
    const topicExistence = new Promise((resolve, reject) => {
      this._client.topicExists(Object.values(KAFKA_TOPICS), (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });

    const topicCreate = new Promise((resolve, reject) => {
      this._client.createTopics(
        Object.values(KAFKA_TOPICS).map((item) => ({
          topic: item,
          partitions: 1,
          replicationFactor: 1,
        })),
        (err) => {
          if (err) reject(err);
          else resolve(true);
        }
      );
    });

    const initClients = () => {
      this._consumer = new Consumer(
        this._client,
        [{ topic: KAFKA_TOPICS.MASTER, partition: 0 }],
        { autoCommit: true }
      );

      this._producer = new Producer(this._client);

      this._consumer.on("message", (data) => {
        this._logger.log(`Received message: ${data.key}-${data.value}`);
        handler(JSON.parse(data.value.toString()) as K);
      });
    };

    topicExistence
      .then(() => {
        this._logger.log(`Topics were already initialized.`);
        initClients();
      })
      .catch(() => {
        this._logger.log(`Topics weren't initialize. Creating...`);
        topicCreate
          .then(() => {
            this._logger.log(`Topics created!`);
            initClients();
          })
          .catch((err) => {
            this._logger.log(`Topics creation error: ${err.message}`);
          });
      });
  }

  send(routes: string[], data: T): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this._producer!.send(
        routes.map((item) => ({
          topic: item,
          partition: 0,
          messages: [JSON.stringify(data)],
        })),
        (err, data) => {
          if (err) reject(err);
          else resolve(data);
        }
      );
    });
  }
}
