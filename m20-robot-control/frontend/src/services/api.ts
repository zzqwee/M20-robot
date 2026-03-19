import { WSRequest, WSResponse, WSStatus, MotionCommand, LEDStatus, DeviceControl } from '../types';

type MessageHandler = (data: WSResponse | WSStatus) => void;

class APIService {
  private ws: WebSocket | null = null;
  private handlers: Map<string, MessageHandler[]> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        resolve();
        return;
      }

      const wsUrl = `ws://${window.location.host}/ws`;
      console.log('[API] Connecting to WebSocket:', wsUrl);

      try {
        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
          console.log('[API] WebSocket connected');
          this.reconnectAttempts = 0;
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            this.handleMessage(data);
          } catch (e) {
            console.error('[API] Failed to parse message:', e);
          }
        };

        this.ws.onclose = () => {
          console.log('[API] WebSocket disconnected');
          this.attemptReconnect();
        };

        this.ws.onerror = (error) => {
          console.error('[API] WebSocket error:', error);
          reject(error);
        };
      } catch (e) {
        reject(e);
      }
    });
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  private handleMessage(data: WSResponse | WSStatus): void {
    const handlers = this.handlers.get('*') || [];

    if (data.type === 'response') {
      const responseHandlers = this.handlers.get(data.action) || [];
      handlers.push(...responseHandlers);
    }

    handlers.forEach((handler) => handler(data));
  }

  on(action: string, handler: MessageHandler): void {
    const handlers = this.handlers.get(action) || [];
    handlers.push(handler);
    this.handlers.set(action, handlers);
  }

  off(action: string, handler: MessageHandler): void {
    const handlers = this.handlers.get(action) || [];
    const index = handlers.indexOf(handler);
    if (index > -1) {
      handlers.splice(index, 1);
    }
  }

  private send(message: WSRequest): Promise<WSResponse> {
    return new Promise((resolve, reject) => {
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
        reject(new Error('WebSocket not connected'));
        return;
      }

      const requestId = `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      message.requestId = requestId;

      const handler = (data: WSResponse | WSStatus) => {
        if (data.type === 'response' && data.requestId === requestId) {
          this.off('*', handler);
          if (data.success) {
            resolve(data);
          } else {
            reject(new Error(data.payload?.error || 'Request failed'));
          }
        }
      };

      this.on('*', handler);
      this.ws.send(JSON.stringify(message));

      // Timeout after 10 seconds
      setTimeout(() => {
        this.off('*', handler);
        reject(new Error('Request timeout'));
      }, 10000);
    });
  }

  async connectToRobot(ipAddress: string): Promise<void> {
    await this.send({
      type: 'request',
      action: 'connect',
      payload: { ipAddress, tcpPort: 30001, udpPort: 30000 },
      requestId: ''
    });
  }

  async disconnectFromRobot(): Promise<void> {
    await this.send({
      type: 'request',
      action: 'disconnect',
      payload: {},
      requestId: ''
    });
  }

  async sendMotionCommand(cmd: MotionCommand): Promise<void> {
    await this.send({
      type: 'request',
      action: 'motion',
      payload: cmd,
      requestId: ''
    });
  }

  async sendLEDControl(led: LEDStatus): Promise<void> {
    await this.send({
      type: 'request',
      action: 'led',
      payload: led,
      requestId: ''
    });
  }

  async sendDeviceControl(control: DeviceControl): Promise<void> {
    await this.send({
      type: 'request',
      action: 'device',
      payload: control,
      requestId: ''
    });
  }

  async setSimulationMode(enabled: boolean): Promise<void> {
    await this.send({
      type: 'request',
      action: 'simulation',
      payload: { enabled },
      requestId: ''
    });
  }

  async getDeviceInfo(): Promise<void> {
    await this.send({
      type: 'request',
      action: 'getDeviceInfo',
      payload: {},
      requestId: ''
    });
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('[API] Max reconnect attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

    console.log(`[API] Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);

    setTimeout(() => {
      this.connect().catch(console.error);
    }, delay);
  }
}

// Singleton instance
export const api = new APIService();
