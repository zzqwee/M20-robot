import { TCP_PORT, DEFAULT_IP } from '../tcp-client';
import { UDP_PORT } from '../udp-server';
import {
  DeviceInfo,
  DeviceStatus,
  BatteryStatus,
  SensorData,
  LEDStatus,
  ChargeStatus
} from '../types';
import { parseResponseMessage } from '../protocol/messages';

export class RobotService {
  private ipAddress: string;
  private tcpPort: number;
  private udpPort: number;

  constructor(ipAddress: string = DEFAULT_IP, tcpPort: number = TCP_PORT, udpPort: number = UDP_PORT) {
    this.ipAddress = ipAddress;
    this.tcpPort = tcpPort;
    this.udpPort = udpPort;
  }

  setAddress(ipAddress: string): void {
    this.ipAddress = ipAddress;
  }

  getAddress(): string {
    return this.ipAddress;
  }

  getTcpPort(): number {
    return this.tcpPort;
  }

  getUdpPort(): number {
    return this.udpPort;
  }

  parseDeviceInfo(data: any): DeviceInfo {
    const basicStatus = data.BasicStatus || {};
    const devStatus = data.DeviceStatus || {};

    return {
      model: devStatus.Version || 'M20',
      version: devStatus.Version || 'STD',
      serialNumber: devStatus.SN || 'Unknown',
      status: devStatus.Run || DeviceStatus.Normal,
      ipAddress: this.ipAddress,
      macAddress: devStatus.MAC || '00:00:00:00:00:00',
      gateway: devStatus.Gateway,
      subnetMask: devStatus.NetMask,
      dns: devStatus.DNS,
      clock: devStatus.Time ? new Date(devStatus.Time) : undefined
    };
  }

  parseBatteryStatus(data: any): BatteryStatus {
    const battery = data.BatteryStatus || {};

    return {
      leftVoltage: battery.VoltageLeft || 0,
      rightVoltage: battery.VoltageRight || 0,
      leftLevel: battery.BatteryLevelLeft || 0,
      rightLevel: battery.BatteryLevelRight || 0,
      chargeStatus: battery.ChargeStatus || ChargeStatus.Discharging
    };
  }

  parseSensorData(data: any): SensorData {
    const uss = data.USS || {};
    const imu = data.IMU || {};

    return {
      lidarFront: uss.DisFront || 0,
      lidarBack: uss.DisBack || 0,
      imuRoll: imu.Roll || 0,
      imuPitch: imu.Pitch || 0,
      imuYaw: imu.Yaw || 0,
      temperature: 25  // Default value, not always available
    };
  }

  parseLEDStatus(data: any): LEDStatus {
    const devStatus = data.DeviceStatus || {};

    return {
      front: devStatus.LightFront || 0,
      back: devStatus.LightBack || 0
    };
  }

  parseStatusMessage(buffer: Buffer): {
    deviceInfo?: DeviceInfo;
    battery?: BatteryStatus;
    sensors?: SensorData;
    led?: LEDStatus;
  } | null {
    const asdu = parseResponseMessage(buffer);
    if (!asdu) {
      return null;
    }

    const result: any = {};
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

// Singleton instance
let robotService: RobotService | null = null;

export function getRobotService(ipAddress?: string): RobotService {
  if (!robotService) {
    robotService = new RobotService(ipAddress);
  } else if (ipAddress) {
    robotService.setAddress(ipAddress);
  }
  return robotService;
}
