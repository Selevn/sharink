import {ZodError} from "zod";

export const zodErrorConverter = (error: ZodError) : string => {
    const errorStrings = error.errors.map(item => {
        if(item.code === 'invalid_type'){
            return `Invalid type: ${item.path[0]} expected ${item.expected}, received: ${item.received}`
        } else {
            return error.message;
        }
    })
    return `Validation errors: ${errorStrings.join('; ')}`
}