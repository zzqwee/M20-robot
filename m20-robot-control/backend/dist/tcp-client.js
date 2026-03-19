"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.TCPClient = exports.DEFAULT_IP = exports.TCP_PORT = void 0;
const net = __importStar(require("net"));
const events_1 = require("events");
exports.TCP_PORT = 30001;
exports.DEFAULT_IP = '192.168.10.104';
class TCPClient extends events_1.EventEmitter {
    constructor(ipAddress = exports.DEFAULT_IP, port = exports.TCP_PORT) {
        super();
        this.client = null;
        this.connected = false;
        this.ipAddress = ipAddress;
        this.port = port;
    }
    connect() {
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
    disconnect() {
        if (this.client) {
            this.client.end();
            this.client = null;
            this.connected = false;
        }
    }
    send(data) {
        return new Promise((resolve, reject) => {
            if (!this.client || !this.connected) {
                reject(new Error('Not connected'));
                return;
            }
            this.client.write(data, (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    }
    isConnected() {
        return this.connected;
    }
    setAddress(ipAddress) {
        this.ipAddress = ipAddress;
    }
    getAddress() {
        return this.ipAddress;
    }
}
exports.TCPClient = TCPClient;
//# sourceMappingURL=tcp-client.js.map