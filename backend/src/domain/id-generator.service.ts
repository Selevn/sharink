import {RequestEntity} from "@/domain/types/entity.types";
import {Hash} from "@/domain/types/base.types";

export class IdGeneratorService {
    public static GenerateId(){
        return Math.random().toString(36).substr(2, 9);
    }

    public static generateHash(entity: RequestEntity): Hash {
        return Buffer.from(entity.name+entity.author,'utf8').toString('base64')
    }
}