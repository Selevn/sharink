import { KafkaClient, Producer, Consumer } from "kafka-node"
import dotenv from "dotenv"
import { env } from "@/utils/envConfig.js"
import { YandexMusicScrapper } from "@/yandex-search.service.js"
import { KAFKA_TOPICS, KafkaRequest, KafkaResponse } from "sharink-lib"

dotenv.config()

const yandexService = new YandexMusicScrapper()

const client = new KafkaClient({
  kafkaHost: `${env.KAFKA_HOST}:${env.KAFKA_PORT}`,
})
/*

client.createTopics([{
  topic: KAFKA_TOPICS.MASTER,
  replicationFactor: 1,
  partitions: 1
}, {
  topic: KAFKA_TOPICS.YANDEX,
  replicationFactor: 1,
  partitions: 1
}], (err, data) => {
  if (err) {
    console.log(err)
  } else {
    console.log(data)
  }
})
*/

console.log("KAFKA_TOPICS.YANDEX", KAFKA_TOPICS.YANDEX)

const producer = new Producer(client)
const consumer = new Consumer(
  client,
  [{ topic: KAFKA_TOPICS.YANDEX, partition: 0 }],
  { autoCommit: true }
)

// Producer: Sending messages
producer.on("ready", () => {
  console.log("Producer is ready")
})

producer.on("error", (err) => {
  console.error("Producer error:", err)
})

// Consumer: Receiving messages
consumer.on("message", (message) => {
  console.log("Received message:", message)
  const kafkaRequest = JSON.parse(message.value.toString()) as KafkaRequest
  yandexService.getTrack(kafkaRequest).then((trackLink) => {
    console.log(`Received track:`, trackLink)
    const response: KafkaResponse = {
      id: kafkaRequest.id,
      service: "yandex",
      link: trackLink,
      entity: kafkaRequest.entity,
    }
    console.log(`Response:`, response)
    producer.send(
      [
        {
          topic: KAFKA_TOPICS.MASTER,
          partition: 0,
          messages: [JSON.stringify(response)],
        },
      ],
      (err, data) => {
        if (err) {
          console.error("Error sending back message:", err)
        } else {
          console.log("Message sent back:", data)
        }
      }
    )
  })
})

consumer.on("error", (err) => {
  console.error("Consumer error:", err)
})
