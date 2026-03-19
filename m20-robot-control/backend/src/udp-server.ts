import * as dgram from 'dgram';
import { EventEmitter } from 'events';

export const UDP_PORT = 30000;

export class UDPServer extends EventEmitter {
  private server: dgram.Socket | null = null;
  private port: number;
  private running: boolean = false;

  constructor(port: number = UDP_PORT) {
    super();
    this.port = port;
  }

  start(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.running) {
        resolve();
        return;
      }

      this.server = dgram.createSocket('udp4');

      this.server.on('error', (err) => {
        console.error('[UDP] Server error:', err.message);
        this.emit('error', err);
        reject(err);
      });

      this.server.on('message', (msg, rinfo) => {
        // console.log(`[UDP] Received ${msg.length} bytes from ${rinfo.address}:${rinfo.port}`);
        this.emit('message', msg, rinfo);
      });

      this.server.on('listening', () => {
        this.running = true;
        const address = this.server!.address();
        console.log(`[UDP] Server listening on ${address.address}:${address.port}`);
        this.emit('listening');
        resolve();
      });

      this.server.bind(this.port);
    });
  }

  stop(): void {
    if (this.server) {
      this.server.close();
      this.server = null;
      this.running = false;
    }
  }

  isRunning(): boolean {
    return this.running;
  }
}
