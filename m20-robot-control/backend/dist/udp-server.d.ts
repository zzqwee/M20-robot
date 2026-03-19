import { EventEmitter } from 'events';
export declare const UDP_PORT = 30000;
export declare class UDPServer extends EventEmitter {
    private server;
    private port;
    private running;
    constructor(port?: number);
    start(): Promise<void>;
    stop(): void;
    isRunning(): boolean;
}
//# sourceMappingURL=udp-server.d.ts.map