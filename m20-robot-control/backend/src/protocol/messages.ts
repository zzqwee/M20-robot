import { ASDUMessage, MotionCommand, LEDStatus, DeviceControl } from '../types';
import { buildHeader } from './header';

// Message types
export const MSG_HEARTBEAT = { type: 100, command: 100 };
export const MSG_MOTION_CONTROL = { type: 2, command: 21 };
export const MSG_MOTION_STATE = { type: 2, command: 22 };
export const MSG_GAIT_SWITCH = { type: 2, command: 23 };
export const MSG_LED_CONTROL = { type: 1101, command: 2 };
export const MSG_DEVICE_STATUS = { type: 1002, command: 5 };
export const MSG_MOTION_STATUS = { type: 1002, command: 4 };
export const MSG_BASIC_STATUS = { type: 1002, command: 6 };

let sequenceNum = 0;

export function getNextSequence(): number {
  return ++sequenceNum;
}

export function buildHeartbeatMessage(): Buffer {
  const asdu: ASDUMessage = {
    type: MSG_HEARTBEAT.type,
    command: MSG_HEARTBEAT.command,
    time: new Date().toISOString().replace('T', ' ').substring(0, 19),
    items: {}
  };

  const data = JSON.stringify({ PatrolDevice: asdu });
  const dataBuffer = Buffer.from(data, 'utf8');

  const header = buildHeader(
    MSG_HEARTBEAT.type,
    MSG_HEARTBEAT.command,
    dataBuffer.length,
    getNextSequence()
  );
  return Buffer.concat([header, dataBuffer]);
}

export function buildMotionCommandMessage(cmd: MotionCommand): Buffer {
  const asdu: ASDUMessage = {
    type: MSG_MOTION_CONTROL.type,
    command: MSG_MOTION_CONTROL.command,
    time: new Date().toISOString().replace('T', ' ').substring(0, 19),
    items: {
      X: cmd.x,
      Y: cmd.y,
      Yaw: cmd.yaw
    }
  };

  const data = JSON.stringify({ PatrolDevice: asdu });
  const dataBuffer = Buffer.from(data, 'utf8');

  const header = buildHeader(
    MSG_MOTION_CONTROL.type,
    MSG_MOTION_CONTROL.command,
    dataBuffer.length,
    getNextSequence()
  );
  return Buffer.concat([header, dataBuffer]);
}

export function buildLEDControlMessage(led: LEDStatus): Buffer {
  const asdu: ASDUMessage = {
    type: MSG_LED_CONTROL.type,
    command: MSG_LED_CONTROL.command,
    time: new Date().toISOString().replace('T', ' ').substring(0, 19),
    items: {
      LightFront: led.front,
      LightBack: led.back
    }
  };

  const data = JSON.stringify({ PatrolDevice: asdu });
  const dataBuffer = Buffer.from(data, 'utf8');

  const header = buildHeader(
    MSG_LED_CONTROL.type,
    MSG_LED_CONTROL.command,
    dataBuffer.length,
    getNextSequence()
  );
  return Buffer.concat([header, dataBuffer]);
}

export function buildDeviceControlMessage(control: DeviceControl): Buffer {
  const asdu: ASDUMessage = {
    type: 1101,
    command: 3,
    time: new Date().toISOString().replace('T', ' ').substring(0, 19),
    items: {
      'Video:Front': control.cameraFront ? 1 : 0,
      'Video:Back': control.cameraBack ? 1 : 0,
      'Lidar:Front': control.lidarFront ? 1 : 0,
      'Lidar:Back': control.lidarBack ? 1 : 0,
      'GPS': control.gps ? 1 : 0
    }
  };

  const data = JSON.stringify({ PatrolDevice: asdu });
  const dataBuffer = Buffer.from(data, 'utf8');

  const header = buildHeader(1101, 3, dataBuffer.length, getNextSequence());
  return Buffer.concat([header, dataBuffer]);
}

export function parseResponseMessage(buffer: Buffer): ASDUMessage | null {
  try {
    const headerLength = 16;
    if (buffer.length < headerLength) {
      return null;
    }

    const dataStart = headerLength;
    const dataBuffer = buffer.slice(dataStart);
    const jsonStr = dataBuffer.toString('utf8');

    const parsed = JSON.parse(jsonStr);
    return parsed.PatrolDevice || parsed;
  } catch (e) {
    console.error('Failed to parse response message:', e);
    return null;
  }
}
