export interface CacheServiceInterface<T, K> {
    healthCheck(): Promise<boolean>

    set(id: K, value: T): Promise<boolean>

    has(id: K): Promise<boolean>

    get(id: K): Promise<T>
}