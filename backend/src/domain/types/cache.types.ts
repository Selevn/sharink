import {Name, Author, Cover, LinkServices, Link} from "@/domain/types/base.types";

export type CacheID = string;

export type CacheEntity = {
    name: Name,
    author: Author,
    cover: Cover,
    links: Record<LinkServices, Link>,
}