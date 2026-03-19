"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ws_1 = require("ws");
const http_1 = require("http");
const tcp_client_1 = require("./tcp-client");
const udp_server_1 = require("./udp-server");
const robot_1 = require("./services/robot");
const messages_1 = require("./protocol/messages");
const HTTP_PORT = 3000;
const WS_PATH = '/ws';
class RobotControlServer {
    constructor() {
        this.clients = new Set();
        this.heartbeatInterval = null;
        this.simulationMode = false;
        this.simulationData = null;
        this.app = (0, express_1.default)();
        this.server = (0, http_1.createServer)(this.app);
        this.wss = new ws_1.WebSocketServer({ server: this.server, path: WS_PATH });
        this.tcpClient = new tcp_client_1.TCPClient(tcp_client_1.DEFAULT_IP, tcp_client_1.TCP_PORT);
        this.udpServer = new udp_server_1.UDPServer(udp_server_1.UDP_PORT);
        this.robotService = (0, robot_1.getRobotService)();
        this.setupRoutes();
        this.setupWebSocket();
        this.setupTCP();
        this.setupUDP();
    }
    setupRoutes() {
        this.app.get('/health', (req, res) => {
            res.json({ status: 'ok', simulation: this.simulationMode });
        });
    }
    setupWebSocket() {
        this.wss.on('connection', (ws) => {
            console.log('[WS] Client connected');
            this.clients.add(ws);
            ws.on('message', (data) => {
                try {
                    const message = JSON.parse(data.toString());
                    this.handleMessage(ws, message);
                }
                catch (e) {
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
    setupTCP() {
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
    setupUDP() {
        this.udpServer.on('message', (data, rinfo) => {
            const parsed = this.robotService.parseStatusMessage(data);
            if (parsed) {
                this.broadcastStatus(parsed);
            }
        });
    }
    async handleMessage(ws, message) {
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
        }
        catch (e) {
            const error = e;
            this.sendResponse(ws, action, false, { error: error.message }, requestId);
        }
    }
    async handleConnect(ws, payload, requestId) {
        const { ipAddress, tcpPort, udpPort } = payload;
        if (this.simulationMode) {
            this.sendResponse(ws, 'connect', true, { message: 'Connected (simulation mode)' }, requestId);
            this.broadcastSimulationData();
            return;
        }
        this.robotService.setAddress(ipAddress || tcp_client_1.DEFAULT_IP);
        await this.tcpClient.connect();
        this.startHeartbeat();
        this.sendResponse(ws, 'connect', true, { message: 'Connected successfully' }, requestId);
    }
    async handleDisconnect(ws, requestId) {
        if (this.simulationMode) {
            this.sendResponse(ws, 'disconnect', true, { message: 'Disconnected (simulation mode)' }, requestId);
            return;
        }
        this.tcpClient.disconnect();
        this.stopHeartbeat();
        this.sendResponse(ws, 'disconnect', true, { message: 'Disconnected' }, requestId);
    }
    async handleMotion(ws, payload, requestId) {
        if (this.simulationMode) {
            console.log('[Simulation] Motion command:', payload);
            this.sendResponse(ws, 'motion', true, { message: 'Motion command sent (simulation)' }, requestId);
            return;
        }
        const message = (0, messages_1.buildMotionCommandMessage)(payload);
        await this.tcpClient.send(message);
        this.sendResponse(ws, 'motion', true, { message: 'Motion command sent' }, requestId);
    }
    async handleLED(ws, payload, requestId) {
        if (this.simulationMode) {
            console.log('[Simulation] LED command:', payload);
            this.sendResponse(ws, 'led', true, { message: 'LED command sent (simulation)' }, requestId);
            return;
        }
        const message = (0, messages_1.buildLEDControlMessage)(payload);
        await this.tcpClient.send(message);
        this.sendResponse(ws, 'led', true, { message: 'LED command sent' }, requestId);
    }
    async handleDevice(ws, payload, requestId) {
        if (this.simulationMode) {
            console.log('[Simulation] Device command:', payload);
            this.sendResponse(ws, 'device', true, { message: 'Device command sent (simulation)' }, requestId);
            return;
        }
        const message = (0, messages_1.buildDeviceControlMessage)(payload);
        await this.tcpClient.send(message);
        this.sendResponse(ws, 'device', true, { message: 'Device command sent' }, requestId);
    }
    handleSimulation(ws, payload, requestId) {
        this.simulationMode = payload.enabled;
        if (this.simulationMode) {
            console.log('[Simulation] Simulation mode enabled');
            this.startSimulation();
        }
        else {
            console.log('[Simulation] Simulation mode disabled');
            this.stopSimulation();
        }
        this.sendResponse(ws, 'simulation', true, { enabled: this.simulationMode }, requestId);
    }
    async handleGetDeviceInfo(ws, requestId) {
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
    sendResponse(ws, action, success, payload, requestId) {
        const response = {
            type: 'response',
            action,
            success,
            payload,
            requestId
        };
        ws.send(JSON.stringify(response));
    }
    broadcastStatus(data) {
        const message = {
            type: 'status',
            data,
            timestamp: new Date().toISOString()
        };
        this.clients.forEach((client) => {
            if (client.readyState === ws_1.WebSocket.OPEN) {
                client.send(JSON.stringify(message));
            }
        });
    }
    broadcastError(type, error) {
        const message = {
            type: 'error',
            errorType: type,
            error,
            timestamp: new Date().toISOString()
        };
        this.clients.forEach((client) => {
            if (client.readyState === ws_1.WebSocket.OPEN) {
                client.send(JSON.stringify(message));
            }
        });
    }
    startHeartbeat() {
        if (this.heartbeatInterval) {
            return;
        }
        this.heartbeatInterval = setInterval(async () => {
            if (this.tcpClient.isConnected()) {
                try {
                    const message = (0, messages_1.buildHeartbeatMessage)();
                    await this.tcpClient.send(message);
                }
                catch (e) {
                    console.error('[Heartbeat] Failed to send:', e);
                }
            }
        }, 1000);
    }
    stopHeartbeat() {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
            this.heartbeatInterval = null;
        }
    }
    startSimulation() {
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
    broadcastSimulationData() {
        if (this.simulationMode && this.simulationData) {
            this.broadcastStatus(this.simulationData);
        }
    }
    stopSimulation() {
        if (this.simulationData?.interval) {
            clearInterval(this.simulationData.interval);
        }
        this.simulationData = null;
    }
    async start() {
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
//# sourceMappingURL=index.js.map