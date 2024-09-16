import express, { type Express } from "express";
import helmet from "helmet";
import { pino } from "pino";

import { openAPIRouter } from "@/api-docs/openAPIRouter";
import { healthCheckRouter } from "@/api/healthCheck/healthCheckRouter";
import errorHandler from "@/common/middleware/errorHandler";
import rateLimiter from "@/common/middleware/rateLimiter";
import requestLogger from "@/common/middleware/requestLogger";
import { soundsLinkGetterRouter } from "@/api/sounds-getter/sounds-getter.router";

const logger = pino({ name: "server start" });
const app: Express = express();

app.use((req, res, next) => {
  console.log(req.path);
  next();
});

// Set the application to trust the reverse proxy
app.set("trust proxy", true);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        "img-src": [
          "'self'",
          "https://avatars.yandex.net",
          "https://yastatic.net",
          "https://services.linkfire.com",
          "https://open.spotifycdn.com",
          "https://storage.googleapis.com",
        ], //todo: add here youtube and spotify
      },
    },
  })
);
app.use(rateLimiter);

// Request logging
app.use(requestLogger);

// Routes
app.use("/health-check", healthCheckRouter);
app.use("/", soundsLinkGetterRouter);
//app.use("/", );

// Swagger UI
app.use(openAPIRouter);

// Error handlers
app.use(errorHandler());

export { app, logger };
