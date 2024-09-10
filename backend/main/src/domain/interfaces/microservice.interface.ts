export interface MicroserviceInterface<T, K> {
    init(handler: (data: K)=>void): void;
    send(routes: string[], data:T): Promise<boolean>;
}
