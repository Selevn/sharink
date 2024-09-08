export interface DatabaseInterface<T, K> {
    create(id: K, value: T): Promise<boolean>

    delete(id: K): Promise<boolean>

    read(id: K): Promise<T | null>
}