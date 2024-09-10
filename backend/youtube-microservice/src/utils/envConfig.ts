import dotenv from "dotenv";
import { cleanEnv, host, port } from "envalid";

dotenv.config();

export const env = cleanEnv(process.env, {
  KAFKA_HOST: host({devDefault: 'localhost', default: 'kafka'}),
  KAFKA_PORT: port({devDefault: 9092, default: 9092}),
});
