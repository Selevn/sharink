import dotenv from "dotenv";
import { cleanEnv, num, str, testOnly, host, port } from "envalid";

dotenv.config();

export const env = cleanEnv(process.env, {
  YA_ACCESS_TOKEN: str({ devDefault: testOnly("test") }),
  YA_UID: num({ devDefault: testOnly(1000) }),

  KAFKA_HOST: host({devDefault: 'localhost', default: 'kafka'}),
  KAFKA_PORT: port({devDefault: 9092, default: 9092}),
});
