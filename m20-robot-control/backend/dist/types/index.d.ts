export declare enum ConnectionStatus {
    Disconnected = "disconnected",
    Connecting = "connecting",
    Connected = "connected",
    Error = "error"
}
export declare enum DeviceStatus {
    Normal = 0,
    Standby = 1,
    Sleeping = 2,
    Charging = 3,
    Error = 4
}
export declare enum ChargeStatus {
    Discharging = 0,
    Charging = 1,
    Full = 2,
    NotInstalled = 3
}
export declare enum LEDMode {
    Off = 0,
    On = 1,
    Blink = 2
}
export declare enum GaitType {
    Basic = 4097,
    Stairs = 4099,
    Flat = 12290,
    StairsAgile = 12291
}
export interface DeviceConnection {
    ipAddress: string;
    tcpPort: number;
    udpPort: number;
    status: ConnectionStatus;
    lastConnected?: Date;
}
export interface DeviceInfo {
    model: string;
    version: string;
    serialNumber: string;
    status: DeviceStatus;
    ipAddress: string;
    macAddress: string;
    gateway?: string;
    subnetMask?: string;
    dns?: string;
    clock?: Date;
}
export interface MotionCommand {
    x: number;
    y: number;
    yaw: number;
}
export interface BatteryStatus {
    leftVoltage: number;
    rightVoltage: number;
    leftLevel: number;
    rightLevel: number;
    chargeStatus: ChargeStatus;
}
export interface SensorData {
    lidarFront: number;
    lidarBack: number;
    imuRoll: number;
    imuPitch: number;
    imuYaw: number;
    temperature: number;
}
export interface LEDStatus {
    front: LEDMode;
    back: LEDMode;
}
export interface DeviceControl {
    cameraFront: boolean;
    cameraBack: boolean;
    microphone: boolean;
    lidarFront: boolean;
    lidarBack: boolean;
    gps: boolean;
}
export interface ProtocolHeader {
    headerFlag: number;
    dataLength: number;
    protocolType: number;
    messageType: number;
    commandCode: number;
    sequenceNum: number;
    reserved: Buffer;
}
export interface ASDUMessage {
    type: number;
    command: number;
    time: string;
    items: Record<string, any>;
}
export interface WSRequest {
    type: 'request';
    action: 'connect' | 'disconnect' | 'motion' | 'led' | 'device' | 'simulation' | 'getDeviceInfo';
    payload: any;
    requestId: string;
}
export interface WSResponse {
    type: 'response';
    action: string;
    success: boolean;
    payload: any;
    requestId: string;
}
export interface WSStatus {
    type: 'status';
    data: {
        deviceInfo?: DeviceInfo;
        battery?: BatteryStatus;
        sensors?: SensorData;
        led?: LEDStatus;
    };
    timestamp: string;
}
//# sourceMappingURL=index.d.ts.map