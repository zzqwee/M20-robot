import { EventEmitter } from 'events';
export declare const TCP_PORT = 30001;
export declare const DEFAULT_IP = "192.168.10.104";
export declare class TCPClient extends EventEmitter {
    private client;
    private ipAddress;
    private port;
    private connected;
    constructor(ipAddress?: string, port?: number);
    connect(): Promise<void>;
    disconnect(): void;
    send(data: Buffer): Promise<void>;
    isConnected(): boolean;
    setAddress(ipAddress: string): void;
    getAddress(): string;
}
//# sourceMappingURL=tcp-client.d.ts.map