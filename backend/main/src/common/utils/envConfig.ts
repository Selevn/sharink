import dotenv from "dotenv";
import { cleanEnv, host, num, port, str, testOnly } from "envalid";

dotenv.config();

export const env = cleanEnv(process.env, {
  NODE_ENV: str({ devDefault: testOnly("test"), choices: ["development", "production", "test"] }),
  HOST: host({ devDefault: testOnly("localhost") }),
  PORT: port({ devDefault: testOnly(3000) }),
  CORS_ORIGIN: str({ devDefault: testOnly("http://localhost:3000") }),
  COMMON_RATE_LIMIT_MAX_REQUESTS: num({ devDefault: testOnly(1000) }),
  COMMON_RATE_LIMIT_WINDOW_MS: num({ devDefault: testOnly(1000) }),
  YA_ACCESS_TOKEN: str({ devDefault: testOnly("test") }),
  YA_UID: num({ devDefault: testOnly(1000) }),
  REDIS_PORT: num({ devDefault: testOnly(6379) }),
  REDIS_PASSWORD: str({ devDefault: testOnly("pass") }),
  REDIS_USER: str({ devDefault: testOnly("pass") }),
  REDIS_HOST: str({ devDefault: testOnly("pass") }),
  REDIS_TTL: num({ devDefault: testOnly(3600) }),

  MONGO_PORT: num({ devDefault: testOnly(6379) }),
  MONGO_PASSWORD: str({ devDefault: testOnly("pass") }),
  MONGO_LOGIN: str({ devDefault: testOnly("pass") }),
  MONGO_HOST: str({ devDefault: testOnly("pass") }),
  MONGO_DB_NAME: str({ devDefault: testOnly("pass") }),
  MONGO_COLLECTION_NAME: str({ devDefault: testOnly("pass") }),
});
