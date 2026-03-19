"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RobotService = void 0;
exports.getRobotService = getRobotService;
const tcp_client_1 = require("../tcp-client");
const udp_server_1 = require("../udp-server");
const types_1 = require("../types");
const messages_1 = require("../protocol/messages");
class RobotService {
    constructor(ipAddress = tcp_client_1.DEFAULT_IP, tcpPort = tcp_client_1.TCP_PORT, udpPort = udp_server_1.UDP_PORT) {
        this.ipAddress = ipAddress;
        this.tcpPort = tcpPort;
        this.udpPort = udpPort;
    }
    setAddress(ipAddress) {
        this.ipAddress = ipAddress;
    }
    getAddress() {
        return this.ipAddress;
    }
    getTcpPort() {
        return this.tcpPort;
    }
    getUdpPort() {
        return this.udpPort;
    }
    parseDeviceInfo(data) {
        const basicStatus = data.BasicStatus || {};
        const devStatus = data.DeviceStatus || {};
        return {
            model: devStatus.Version || 'M20',
            version: devStatus.Version || 'STD',
            serialNumber: devStatus.SN || 'Unknown',
            status: devStatus.Run || types_1.DeviceStatus.Normal,
            ipAddress: this.ipAddress,
            macAddress: devStatus.MAC || '00:00:00:00:00:00',
            gateway: devStatus.Gateway,
            subnetMask: devStatus.NetMask,
            dns: devStatus.DNS,
            clock: devStatus.Time ? new Date(devStatus.Time) : undefined
        };
    }
    parseBatteryStatus(data) {
        const battery = data.BatteryStatus || {};
        return {
            leftVoltage: battery.VoltageLeft || 0,
            rightVoltage: battery.VoltageRight || 0,
            leftLevel: battery.BatteryLevelLeft || 0,
            rightLevel: battery.BatteryLevelRight || 0,
            chargeStatus: battery.ChargeStatus || types_1.ChargeStatus.Discharging
        };
    }
    parseSensorData(data) {
        const uss = data.USS || {};
        const imu = data.IMU || {};
        return {
            lidarFront: uss.DisFront || 0,
            lidarBack: uss.DisBack || 0,
            imuRoll: imu.Roll || 0,
            imuPitch: imu.Pitch || 0,
            imuYaw: imu.Yaw || 0,
            temperature: 25 // Default value, not always available
        };
    }
    parseLEDStatus(data) {
        const devStatus = data.DeviceStatus || {};
        return {
            front: devStatus.LightFront || 0,
            back: devStatus.LightBack || 0
        };
    }
    parseStatusMessage(buffer) {
        const asdu = (0, messages_1.parseResponseMessage)(buffer);
        if (!asdu) {
            return null;
        }
        const result = {};
        const items = asdu.items || {};
        // Device status (Type=1002, Command=5)
        if (asdu.type === 1002 && asdu.command === 5) {
            result.deviceInfo = this.parseDeviceInfo(items);
            result.battery = this.parseBatteryStatus(items);
            result.led = this.parseLEDStatus(items);
        }
        // Motion status (Type=1002, Command=4)
        if (asdu.type === 1002 && asdu.command === 4) {
            result.sensors = this.parseSensorData(items);
        }
        // Basic status (Type=1002, Command=6)
        if (asdu.type === 1002 && asdu.command === 6) {
            result.deviceInfo = this.parseDeviceInfo(items);
        }
        return result;
    }
}
exports.RobotService = RobotService;
// Singleton instance
let robotService = null;
function getRobotService(ipAddress) {
    if (!robotService) {
        robotService = new RobotService(ipAddress);
    }
    else if (ipAddress) {
        robotService.setAddress(ipAddress);
    }
    return robotService;
}
//# sourceMappingURL=robot.js.map