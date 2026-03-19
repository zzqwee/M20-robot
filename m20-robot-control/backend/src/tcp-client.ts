import * as net from 'net';
import { EventEmitter } from 'events';

export const TCP_PORT = 30001;
export const DEFAULT_IP = '192.168.10.104';

export class TCPClient extends EventEmitter {
  private client: net.Socket | null = null;
  private ipAddress: string;
  private port: number;
  private connected: boolean = false;

  constructor(ipAddress: string = DEFAULT_IP, port: number = TCP_PORT) {
    super();
    this.ipAddress = ipAddress;
    this.port = port;
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.connected && this.client) {
        resolve();
        return;
      }

      this.client = new net.Socket();

      this.client.connect(this.port, this.ipAddress, () => {
        this.connected = true;
        console.log(`[TCP] Connected to ${this.ipAddress}:${this.port}`);
        this.emit('connect');
        resolve();
      });

      this.client.on('error', (err) => {
        console.error('[TCP] Connection error:', err.message);
        this.connected = false;
        this.emit('error', err);
        reject(err);
      });

      this.client.on('close', () => {
        this.connected = false;
        console.log('[TCP] Connection closed');
        this.emit('close');
      });

      this.client.on('data', (data) => {
        this.emit('data', data);
      });
    });
  }

  disconnect(): void {
    if (this.client) {
      this.client.end();
      this.client = null;
      this.connected = false;
    }
  }

  send(data: Buffer): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.client || !this.connected) {
        reject(new Error('Not connected'));
        return;
      }

      this.client.write(data, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  isConnected(): boolean {
    return this.connected;
  }

  setAddress(ipAddress: string): void {
    this.ipAddress = ipAddress;
  }

  getAddress(): string {
    return this.ipAddress;
  }
}
