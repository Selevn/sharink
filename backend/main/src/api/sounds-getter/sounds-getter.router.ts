import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Request, type Response, type Router } from "express";
import { z, ZodError } from "zod";
import { KafkaRequest, KafkaResponse } from "sharink-lib";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { handleServiceResponse } from "@/common/utils/httpHandlers";
import { MasterService } from "@/domain";
import {
  Create,
  CreateSchema,
  GetSchemaRequest,
} from "@/domain/models/request-response.model";
import { zodErrorConverter } from "@/common/utils/zod-error.converter";
import { RedisRepository } from "@/domain/repository/redis.repository";
import { MongoDatabaseRepository } from "@/domain/repository/database.repository";
import { KafkaRepository } from "@/domain/repository/kafka.repository";
import { TrackPageService } from "@/domain/track-page.service";

export const soundsLinkGetterRegistry = new OpenAPIRegistry();
export const soundsLinkGetterRouter: Router = express.Router();

soundsLinkGetterRegistry.registerPath({
  method: "post",
  path: "/create",
  tags: ["Get sounds link"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: CreateSchema,
        },
      },
    },
  },
  responses: createApiResponse(z.string(), "Success"),
});

soundsLinkGetterRegistry.registerPath({
  method: "get",
  path: "/track/{id}",
  request: { params: GetSchemaRequest.shape.params },
  tags: ["Get track by link"],
  responses: createApiResponse(z.any(), "Success"),
});

soundsLinkGetterRegistry.registerPath({
  method: "get",
  path: "/track/{id}/page",
  request: { params: GetSchemaRequest.shape.params },
  tags: ["Get track page by link"],
  responses: createApiResponse(z.any(), "Success"),
});

const masterService = new MasterService(
  new MongoDatabaseRepository(),
  new RedisRepository(),
  new KafkaRepository<KafkaRequest, KafkaResponse>(),
  new TrackPageService()
);

soundsLinkGetterRouter.post("/create", async (_req: Request, res: Response) => {
  let data: Create;
  try {
    data = CreateSchema.parse(_req.body);
  } catch (e) {
    const serviceResponse = ServiceResponse.failure(
      "Bad request",
      {
        message: zodErrorConverter(e as ZodError),
      },
      400
    );
    return handleServiceResponse(serviceResponse, res);
  }

  const id = await masterService.copyTrack({
    name: data.name,
    author: data.author,
    cover: data.cover,
    origin: "yandex",
    entity: "track",
  });

  const serviceResponse = ServiceResponse.success("Id generated", {
    id,
  });

  return handleServiceResponse(serviceResponse, res);
});

soundsLinkGetterRouter.get(
  "/track/:id",
  async (_req: Request, res: Response) => {
    const id = _req.params.id;
    const serviceResponse = ServiceResponse.success(
      "Track found",
      await masterService.getTrack(id)
    );

    return handleServiceResponse(serviceResponse, res);
  }
);

soundsLinkGetterRouter.get(
  "/track/:id/page",
  async (_req: Request, res: Response) => {
    const id = _req.params.id;

    const trackPage = await masterService.getTrackPage(id);
    if (trackPage) {
      return res.status(200).send(trackPage);
    }

    return res.status(404).send();
  }
);
