// Connection types
export enum ConnectionStatus {
  Disconnected = 'disconnected',
  Connecting = 'connecting',
  Connected = 'connected',
  Error = 'error'
}

export enum DeviceStatus {
  Normal = 0,
  Standby = 1,
  Sleeping = 2,
  Charging = 3,
  Error = 4
}

export enum ChargeStatus {
  Discharging = 0,
  Charging = 1,
  Full = 2,
  NotInstalled = 3
}

export enum LEDMode {
  Off = 0,
  On = 1,
  Blink = 2
}

export enum GaitType {
  Basic = 0x1001,
  Stairs = 0x1003,
  Flat = 0x3002,
  StairsAgile = 0x3003
}

// Device connection
export interface DeviceConnection {
  ipAddress: string;
  tcpPort: number;
  udpPort: number;
  status: ConnectionStatus;
  lastConnected?: Date;
}

// Device info
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

// Motion command
export interface MotionCommand {
  x: number;    // -1.0 ~ 1.0 m/s
  y: number;    // -1.0 ~ 1.0 m/s
  yaw: number;  // -1.0 ~ 1.0 rad/s
}

// Battery status
export interface BatteryStatus {
  leftVoltage: number;
  rightVoltage: number;
  leftLevel: number;
  rightLevel: number;
  chargeStatus: ChargeStatus;
}

// Sensor data
export interface SensorData {
  lidarFront: number;
  lidarBack: number;
  imuRoll: number;
  imuPitch: number;
  imuYaw: number;
  temperature: number;
}

// LED status
export interface LEDStatus {
  front: LEDMode;
  back: LEDMode;
}

// Device control
export interface DeviceControl {
  cameraFront: boolean;
  cameraBack: boolean;
  microphone: boolean;
  lidarFront: boolean;
  lidarBack: boolean;
  gps: boolean;
}

// Protocol message types
export interface ProtocolHeader {
  headerFlag: number;      // 2 bytes
  dataLength: number;      // 2 bytes
  protocolType: number;    // 1 byte (0=JSON, 1=XML)
  messageType: number;     // 2 bytes
  commandCode: number;     // 2 bytes
  sequenceNum: number;     // 2 bytes
  reserved: Buffer;        // 3 bytes
}

export interface ASDUMessage {
  type: number;
  command: number;
  time: string;
  items: Record<string, any>;
}

// WebSocket message types
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
