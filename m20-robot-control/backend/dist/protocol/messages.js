"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MSG_BASIC_STATUS = exports.MSG_MOTION_STATUS = exports.MSG_DEVICE_STATUS = exports.MSG_LED_CONTROL = exports.MSG_GAIT_SWITCH = exports.MSG_MOTION_STATE = exports.MSG_MOTION_CONTROL = exports.MSG_HEARTBEAT = void 0;
exports.getNextSequence = getNextSequence;
exports.buildHeartbeatMessage = buildHeartbeatMessage;
exports.buildMotionCommandMessage = buildMotionCommandMessage;
exports.buildLEDControlMessage = buildLEDControlMessage;
exports.buildDeviceControlMessage = buildDeviceControlMessage;
exports.parseResponseMessage = parseResponseMessage;
const header_1 = require("./header");
// Message types
exports.MSG_HEARTBEAT = { type: 100, command: 100 };
exports.MSG_MOTION_CONTROL = { type: 2, command: 21 };
exports.MSG_MOTION_STATE = { type: 2, command: 22 };
exports.MSG_GAIT_SWITCH = { type: 2, command: 23 };
exports.MSG_LED_CONTROL = { type: 1101, command: 2 };
exports.MSG_DEVICE_STATUS = { type: 1002, command: 5 };
exports.MSG_MOTION_STATUS = { type: 1002, command: 4 };
exports.MSG_BASIC_STATUS = { type: 1002, command: 6 };
let sequenceNum = 0;
function getNextSequence() {
    return ++sequenceNum;
}
function buildHeartbeatMessage() {
    const asdu = {
        type: exports.MSG_HEARTBEAT.type,
        command: exports.MSG_HEARTBEAT.command,
        time: new Date().toISOString().replace('T', ' ').substring(0, 19),
        items: {}
    };
    const data = JSON.stringify({ PatrolDevice: asdu });
    const dataBuffer = Buffer.from(data, 'utf8');
    const header = (0, header_1.buildHeader)(exports.MSG_HEARTBEAT.type, exports.MSG_HEARTBEAT.command, dataBuffer.length, getNextSequence());
    return Buffer.concat([header, dataBuffer]);
}
function buildMotionCommandMessage(cmd) {
    const asdu = {
        type: exports.MSG_MOTION_CONTROL.type,
        command: exports.MSG_MOTION_CONTROL.command,
        time: new Date().toISOString().replace('T', ' ').substring(0, 19),
        items: {
            X: cmd.x,
            Y: cmd.y,
            Yaw: cmd.yaw
        }
    };
    const data = JSON.stringify({ PatrolDevice: asdu });
    const dataBuffer = Buffer.from(data, 'utf8');
    const header = (0, header_1.buildHeader)(exports.MSG_MOTION_CONTROL.type, exports.MSG_MOTION_CONTROL.command, dataBuffer.length, getNextSequence());
    return Buffer.concat([header, dataBuffer]);
}
function buildLEDControlMessage(led) {
    const asdu = {
        type: exports.MSG_LED_CONTROL.type,
        command: exports.MSG_LED_CONTROL.command,
        time: new Date().toISOString().replace('T', ' ').substring(0, 19),
        items: {
            LightFront: led.front,
            LightBack: led.back
        }
    };
    const data = JSON.stringify({ PatrolDevice: asdu });
    const dataBuffer = Buffer.from(data, 'utf8');
    const header = (0, header_1.buildHeader)(exports.MSG_LED_CONTROL.type, exports.MSG_LED_CONTROL.command, dataBuffer.length, getNextSequence());
    return Buffer.concat([header, dataBuffer]);
}
function buildDeviceControlMessage(control) {
    const asdu = {
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
    const header = (0, header_1.buildHeader)(1101, 3, dataBuffer.length, getNextSequence());
    return Buffer.concat([header, dataBuffer]);
}
function parseResponseMessage(buffer) {
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
    }
    catch (e) {
        console.error('Failed to parse response message:', e);
        return null;
    }
}
//# sourceMappingURL=messages.js.map