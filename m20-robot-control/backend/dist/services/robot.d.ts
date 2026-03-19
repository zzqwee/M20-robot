import { DeviceInfo, BatteryStatus, SensorData, LEDStatus } from '../types';
export declare class RobotService {
    private ipAddress;
    private tcpPort;
    private udpPort;
    constructor(ipAddress?: string, tcpPort?: number, udpPort?: number);
    setAddress(ipAddress: string): void;
    getAddress(): string;
    getTcpPort(): number;
    getUdpPort(): number;
    parseDeviceInfo(data: any): DeviceInfo;
    parseBatteryStatus(data: any): BatteryStatus;
    parseSensorData(data: any): SensorData;
    parseLEDStatus(data: any): LEDStatus;
    parseStatusMessage(buffer: Buffer): {
        deviceInfo?: DeviceInfo;
        battery?: BatteryStatus;
        sensors?: SensorData;
        led?: LEDStatus;
    } | null;
}
export declare function getRobotService(ipAddress?: string): RobotService;
//# sourceMappingURL=robot.d.ts.map