import { extendZodWithOpenApi  } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { commonValidations } from "@/common/utils/commonValidation";

extendZodWithOpenApi(z);

export type Create = z.infer<typeof CreateSchema>;
export const CreateSchema = z.object({
    name: z.string().max(1024).openapi({ description: 'Name of the sound', example: 'Sound Name' }),
    author: z.string().max(1024).openapi({ description: 'Author of the sound', example: 'Author Name' }),
    cover: z.string().max(2048).openapi({ description: 'URL for the cover image', example: 'https://example.com/cover.jpg' })
}).openapi('Object');

// Input Validation for 'GET get/:id' endpoint
export const GetSchemaRequest = z.object({
    params: z.object({ id: commonValidations.id }),
});