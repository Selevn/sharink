import {OpenAPIRegistry} from "@asteasolutions/zod-to-openapi";
import express, {type Request, type Response, type Router} from "express";
import {string, z} from "zod";

import {createApiResponse} from "@/api-docs/openAPIResponseBuilders";
import {ServiceResponse} from "@/common/models/serviceResponse";
import {handleServiceResponse} from "@/common/utils/httpHandlers";
import {MasterService} from "@/domain";
import {CacheService} from "@/domain/cache.service";
import {YandexMusicScrapper} from "@/domain/scrappers/yandex-music.scrapper";
import {YoutubeMusicScrapper} from "@/domain/scrappers/youtube-music.scrapper";

export const soundsLinkGetterRegistry = new OpenAPIRegistry();
export const soundsLinkGetterRouter: Router = express.Router();

soundsLinkGetterRegistry.registerPath({
    method: "post",
    path: "/create",
    tags: ["Get sounds link"],
    responses: createApiResponse(z.string(), "Success"),
});

soundsLinkGetterRegistry.registerPath({
    method: "get",
    path: "/get/{id}",
    parameters: [{
        name: 'id',
        in: 'path',
    }],
    tags: ["Get sounds by link"],
    responses: createApiResponse(z.any(), "Success"),
});

const masterService = new MasterService(
    new CacheService(),
    new YandexMusicScrapper(),
    new YoutubeMusicScrapper()
)

soundsLinkGetterRouter.post("/create", async (_req: Request, res: Response) => {
    const body = _req.body

    const id = await masterService.copyTrack({
        name: body.name,
        author: body.author,
        cover: body.cover
    })
    const serviceResponse = ServiceResponse.success("Id generated", {
        id
    });
    return handleServiceResponse(serviceResponse, res);
});

soundsLinkGetterRouter.get("/get/:id", async (_req: Request, res: Response) => {
    const id = _req.params.id;
    const serviceResponse = ServiceResponse.success("Service is healthy", await masterService.getTrack(id));
    return handleServiceResponse(serviceResponse, res);
});
