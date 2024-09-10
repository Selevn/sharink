export interface CacheServiceInterface<T, K, M> {
    healthCheck(): Promise<boolean>

    set(id: K, value: T): Promise<boolean>

    update(id: K, value: M): Promise<boolean>

    has(id: K): Promise<boolean>

    get(id: K): Promise<T>
}