import {
  Name,
  Author,
  Cover,
  LinkServices,
  Link,
  EntityType,
} from "sharink-lib";

export type CacheID = string;

export type CacheEntity = {
  name: Name;
  author: Author;
  cover: Cover;
  type: EntityType;
  origin: LinkServices;
  links: Record<LinkServices, Link>;
};

export type CacheEntityUpdate = {
  origin: LinkServices;
  link: Link;
};

export type CacheEntityWithId = CacheEntity & {
  id: CacheID;
};

export type Track = CacheEntity;
