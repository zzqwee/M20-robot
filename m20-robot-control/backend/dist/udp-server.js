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
exports.UDPServer = exports.UDP_PORT = void 0;
const dgram = __importStar(require("dgram"));
const events_1 = require("events");
exports.UDP_PORT = 30000;
class UDPServer extends events_1.EventEmitter {
    constructor(port = exports.UDP_PORT) {
        super();
        this.server = null;
        this.running = false;
        this.port = port;
    }
    start() {
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
                const address = this.server.address();
                console.log(`[UDP] Server listening on ${address.address}:${address.port}`);
                this.emit('listening');
                resolve();
            });
            this.server.bind(this.port);
        });
    }
    stop() {
        if (this.server) {
            this.server.close();
            this.server = null;
            this.running = false;
        }
    }
    isRunning() {
        return this.running;
    }
}
exports.UDPServer = UDPServer;
//# sourceMappingURL=udp-server.js.map