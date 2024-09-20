import { Link, LinkServices, Track } from "./index";

export type CacheID = string;

export type CacheEntity = Track & {
  links: Record<LinkServices, Link>;
};

export type CacheEntityUpdate = {
  origin: LinkServices;
  link: Link;
};

export type CacheEntityWithId = CacheEntity & {
  id: CacheID;
};
