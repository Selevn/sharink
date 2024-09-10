export interface DatabaseInterface<T, K, M> {
    create(id: K, value: T): Promise<boolean>

    update(id: K, value: M): Promise<boolean>

    delete(id: K): Promise<boolean>

    read(id: K): Promise<T | null>
}