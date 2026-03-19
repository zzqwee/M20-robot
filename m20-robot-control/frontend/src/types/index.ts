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
  clock?: string;
}

// Motion command
export interface MotionCommand {
  x: number;
  y: number;
  yaw: number;
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

// Robot state
export interface RobotState {
  connection: DeviceConnection;
  deviceInfo: DeviceInfo | null;
  battery: BatteryStatus | null;
  sensors: SensorData | null;
  led: LEDStatus;
  simulationMode: boolean;
}
