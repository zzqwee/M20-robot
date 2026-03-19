import { ASDUMessage, MotionCommand, LEDStatus, DeviceControl } from '../types';
export declare const MSG_HEARTBEAT: {
    type: number;
    command: number;
};
export declare const MSG_MOTION_CONTROL: {
    type: number;
    command: number;
};
export declare const MSG_MOTION_STATE: {
    type: number;
    command: number;
};
export declare const MSG_GAIT_SWITCH: {
    type: number;
    command: number;
};
export declare const MSG_LED_CONTROL: {
    type: number;
    command: number;
};
export declare const MSG_DEVICE_STATUS: {
    type: number;
    command: number;
};
export declare const MSG_MOTION_STATUS: {
    type: number;
    command: number;
};
export declare const MSG_BASIC_STATUS: {
    type: number;
    command: number;
};
export declare function getNextSequence(): number;
export declare function buildHeartbeatMessage(): Buffer;
export declare function buildMotionCommandMessage(cmd: MotionCommand): Buffer;
export declare function buildLEDControlMessage(led: LEDStatus): Buffer;
export declare function buildDeviceControlMessage(control: DeviceControl): Buffer;
export declare function parseResponseMessage(buffer: Buffer): ASDUMessage | null;
//# sourceMappingURL=messages.d.ts.map