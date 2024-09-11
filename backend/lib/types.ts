export type Name = string;
export type Author = string;
export type Cover = string;

export type Hash = string;

export type LinkServices = "yandex" | "youtube" | "spotify";
export type EntityType = "track" | "author" | "album";
export type Link = string;

export type RequestEntity = {
  name: Name;
  author: Author;
  cover: Cover;
  entity: EntityType;
  origin: LinkServices;
};

export type ScrapEntity = Pick<RequestEntity, "name" | "author">;

export type KafkaRequest = {
  id: Hash;
  name: Name;
  author: Author;
  entity: EntityType;
};

export type KafkaResponse = {
  id: Hash;
  service: LinkServices;
  link: Link;
  entity: EntityType;
};
