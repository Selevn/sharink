import { Hash, RequestEntity } from "sharink-lib";

export class IdGeneratorService {
  public static GenerateId() {
    return Math.random().toString(36).substr(2, 9);
  }

  public static generateHash(entity: RequestEntity): Hash {
    return Buffer.from(entity.name + entity.author, "utf8").toString("base64");
  }
}
