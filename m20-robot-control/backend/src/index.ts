import express from 'express';
import { WebSocketServer, WebSocket } from 'ws';
import { createServer } from 'http';
import { TCPClient, DEFAULT_IP, TCP_PORT } from './tcp-client';
import { UDPServer, UDP_PORT } from './udp-server';
import { getRobotService } from './services/robot';
import {
  buildHeartbeatMessage,
  buildMotionCommandMessage,
  buildLEDControlMessage,
  buildDeviceControlMessage
} from './protocol/messages';
import { WSRequest, WSResponse, MotionCommand, LEDStatus, DeviceControl } from './types';

const HTTP_PORT = 3000;
const WS_PATH = '/ws';

class RobotControlServer {
  private app: express.Application;
  private server: ReturnType<typeof createServer>;
  private wss: WebSocketServer;
  private tcpClient: TCPClient;
  private udpServer: UDPServer;
  private robotService: ReturnType<typeof getRobotService>;
  private clients: Set<WebSocket> = new Set();
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private simulationMode: boolean = false;
  private simulationData: any = null;

  constructor() {
    this.app = express();
    this.server = createServer(this.app);
    this.wss = new WebSocketServer({ server: this.server, path: WS_PATH });
    this.tcpClient = new TCPClient(DEFAULT_IP, TCP_PORT);
    this.udpServer = new UDPServer(UDP_PORT);
    this.robotService = getRobotService();

    this.setupRoutes();
    this.setupWebSocket();
    this.setupTCP();
    this.setupUDP();
  }

  private setupRoutes(): void {
    this.app.get('/health', (req, res) => {
      res.json({ status: 'ok', simulation: this.simulationMode });
    });
  }

  private setupWebSocket(): void {
    this.wss.on('connection', (ws) => {
      console.log('[WS] Client connected');
      this.clients.add(ws);

      ws.on('message', (data) => {
        try {
          const message = JSON.parse(data.toString()) as WSRequest;
          this.handleMessage(ws, message);
        } catch (e) {
          console.error('[WS] Invalid message:', e);
        }
      });

      ws.on('close', () => {
        console.log('[WS] Client disconnected');
        this.clients.delete(ws);
      });

      ws.on('error', (err) => {
        console.error('[WS] Error:', err);
      });
    });
  }

  private setupTCP(): void {
    this.tcpClient.on('data', (data) => {
      const parsed = this.robotService.parseStatusMessage(data);
      if (parsed) {
        this.broadcastStatus(parsed);
      }
    });

    this.tcpClient.on('close', () => {
      this.stopHeartbeat();
      this.broadcastStatus({ deviceInfo: null });
    });

    this.tcpClient.on('error', (err) => {
      console.error('[TCP] Error:', err);
      this.broadcastError('connection', err.message);
    });
  }

  private setupUDP(): void {
    this.udpServer.on('message', (data, rinfo) => {
      const parsed = this.robotService.parseStatusMessage(data);
      if (parsed) {
        this.broadcastStatus(parsed);
      }
    });
  }

  private async handleMessage(ws: WebSocket, message: WSRequest): Promise<void> {
    const { action, payload, requestId } = message;

    try {
      switch (action) {
        case 'connect':
          await this.handleConnect(ws, payload, requestId);
          break;
        case 'disconnect':
          await this.handleDisconnect(ws, requestId);
          break;
        case 'motion':
          await this.handleMotion(ws, payload, requestId);
          break;
        case 'led':
          await this.handleLED(ws, payload, requestId);
          break;
        case 'device':
          await this.handleDevice(ws, payload, requestId);
          break;
        case 'simulation':
          this.handleSimulation(ws, payload, requestId);
          break;
        case 'getDeviceInfo':
          await this.handleGetDeviceInfo(ws, requestId);
          break;
        default:
          this.sendResponse(ws, action, false, { error: 'Unknown action' }, requestId);
      }
    } catch (e) {
      const error = e as Error;
      this.sendResponse(ws, action, false, { error: error.message }, requestId);
    }
  }

  private async handleConnect(ws: WebSocket, payload: any, requestId: string): Promise<void> {
    const { ipAddress, tcpPort, udpPort } = payload;

    if (this.simulationMode) {
      this.sendResponse(ws, 'connect', true, { message: 'Connected (simulation mode)' }, requestId);
      this.broadcastSimulationData();
      return;
    }

    this.robotService.setAddress(ipAddress || DEFAULT_IP);
    await this.tcpClient.connect();
    this.startHeartbeat();
    this.sendResponse(ws, 'connect', true, { message: 'Connected successfully' }, requestId);
  }

  private async handleDisconnect(ws: WebSocket, requestId: string): Promise<void> {
    if (this.simulationMode) {
      this.sendResponse(ws, 'disconnect', true, { message: 'Disconnected (simulation mode)' }, requestId);
      return;
    }

    this.tcpClient.disconnect();
    this.stopHeartbeat();
    this.sendResponse(ws, 'disconnect', true, { message: 'Disconnected' }, requestId);
  }

  private async handleMotion(ws: WebSocket, payload: MotionCommand, requestId: string): Promise<void> {
    if (this.simulationMode) {
      console.log('[Simulation] Motion command:', payload);
      this.sendResponse(ws, 'motion', true, { message: 'Motion command sent (simulation)' }, requestId);
      return;
    }

    const message = buildMotionCommandMessage(payload);
    await this.tcpClient.send(message);
    this.sendResponse(ws, 'motion', true, { message: 'Motion command sent' }, requestId);
  }

  private async handleLED(ws: WebSocket, payload: LEDStatus, requestId: string): Promise<void> {
    if (this.simulationMode) {
      console.log('[Simulation] LED command:', payload);
      this.sendResponse(ws, 'led', true, { message: 'LED command sent (simulation)' }, requestId);
      return;
    }

    const message = buildLEDControlMessage(payload);
    await this.tcpClient.send(message);
    this.sendResponse(ws, 'led', true, { message: 'LED command sent' }, requestId);
  }

  private async handleDevice(ws: WebSocket, payload: DeviceControl, requestId: string): Promise<void> {
    if (this.simulationMode) {
      console.log('[Simulation] Device command:', payload);
      this.sendResponse(ws, 'device', true, { message: 'Device command sent (simulation)' }, requestId);
      return;
    }

    const message = buildDeviceControlMessage(payload);
    await this.tcpClient.send(message);
    this.sendResponse(ws, 'device', true, { message: 'Device command sent' }, requestId);
  }

  private handleSimulation(ws: WebSocket, payload: { enabled: boolean }, requestId: string): void {
    this.simulationMode = payload.enabled;

    if (this.simulationMode) {
      console.log('[Simulation] Simulation mode enabled');
      this.startSimulation();
    } else {
      console.log('[Simulation] Simulation mode disabled');
      this.stopSimulation();
    }

    this.sendResponse(ws, 'simulation', true, { enabled: this.simulationMode }, requestId);
  }

  private async handleGetDeviceInfo(ws: WebSocket, requestId: string): Promise<void> {
    if (this.simulationMode) {
      this.sendResponse(ws, 'getDeviceInfo', true, {
        deviceInfo: {
          model: 'M20 Pro',
          version: 'STD',
          serialNumber: 'SIMU-001',
          status: 0,
          ipAddress: '192.168.10.104',
          macAddress: '00:11:22:33:44:55'
        }
      }, requestId);
      return;
    }

    // In real mode, device info comes from UDP status updates
    this.sendResponse(ws, 'getDeviceInfo', true, { message: 'Waiting for device info...' }, requestId);
  }

  private sendResponse(ws: WebSocket, action: string, success: boolean, payload: any, requestId: string): void {
    const response: WSResponse = {
      type: 'response',
      action,
      success,
      payload,
      requestId
    };
    ws.send(JSON.stringify(response));
  }

  private broadcastStatus(data: any): void {
    const message = {
      type: 'status',
      data,
      timestamp: new Date().toISOString()
    };

    this.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  }

  private broadcastError(type: string, error: string): void {
    const message = {
      type: 'error',
      errorType: type,
      error,
      timestamp: new Date().toISOString()
    };

    this.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  }

  private startHeartbeat(): void {
    if (this.heartbeatInterval) {
      return;
    }

    this.heartbeatInterval = setInterval(async () => {
      if (this.tcpClient.isConnected()) {
        try {
          const message = buildHeartbeatMessage();
          await this.tcpClient.send(message);
        } catch (e) {
          console.error('[Heartbeat] Failed to send:', e);
        }
      }
    }, 1000);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  private startSimulation(): void {
    this.simulationData = {
      deviceInfo: {
        model: 'M20 Pro',
        version: 'STD',
        serialNumber: 'SIMU-001',
        status: 0,
        ipAddress: '192.168.10.104',
        macAddress: '00:11:22:33:44:55'
      },
      battery: {
        leftVoltage: 24.5,
        rightVoltage: 24.3,
        leftLevel: 85,
        rightLevel: 82,
        chargeStatus: 0
      },
      sensors: {
        lidarFront: 2.5,
        lidarBack: 3.0,
        imuRoll: 0.01,
        imuPitch: 0.02,
        imuYaw: 0.0,
        temperature: 28
      },
      led: {
        front: 0,
        back: 0
      }
    };

    // Broadcast simulation data periodically
    this.simulationData.interval = setInterval(() => {
      this.broadcastSimulationData();
    }, 2000);
  }

  private broadcastSimulationData(): void {
    if (this.simulationMode && this.simulationData) {
      this.broadcastStatus(this.simulationData);
    }
  }

  private stopSimulation(): void {
    if (this.simulationData?.interval) {
      clearInterval(this.simulationData.interval);
    }
    this.simulationData = null;
  }

  public async start(): Promise<void> {
    await this.udpServer.start();
    this.server.listen(HTTP_PORT, () => {
      console.log(`[Server] HTTP server running on http://localhost:${HTTP_PORT}`);
      console.log(`[Server] WebSocket server running on ws://localhost:${HTTP_PORT}${WS_PATH}`);
    });
  }
}

// Start server
const server = new RobotControlServer();
server.start().catch(console.error);
