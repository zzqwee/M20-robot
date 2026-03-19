"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HEADER_FLAG = void 0;
exports.parseHeader = parseHeader;
exports.buildHeader = buildHeader;
exports.findHeaderStart = findHeaderStart;
exports.HEADER_FLAG = 0xEB90;
function parseHeader(buffer) {
    if (buffer.length < 16) {
        return null;
    }
    const headerFlag = buffer.readUInt16BE(0);
    if (headerFlag !== exports.HEADER_FLAG) {
        return null;
    }
    return {
        headerFlag,
        dataLength: buffer.readUInt16BE(2),
        protocolType: buffer.readUInt8(4),
        messageType: buffer.readUInt16BE(5),
        commandCode: buffer.readUInt16BE(7),
        sequenceNum: buffer.readUInt16BE(9),
        reserved: buffer.slice(11, 14)
    };
}
function buildHeader(messageType, commandCode, dataLength, sequenceNum, protocolType = 0 // 0 = JSON
) {
    const buffer = Buffer.alloc(16);
    buffer.writeUInt16BE(exports.HEADER_FLAG, 0); // Header flag
    buffer.writeUInt16BE(dataLength, 2); // Data length
    buffer.writeUInt8(protocolType, 4); // Protocol type
    buffer.writeUInt16BE(messageType, 5); // Message type
    buffer.writeUInt16BE(commandCode, 7); // Command code
    buffer.writeUInt16BE(sequenceNum, 9); // Sequence number
    // Reserved bytes (11-13) are already 0
    return buffer;
}
function findHeaderStart(buffer) {
    for (let i = 0; i <= buffer.length - 2; i++) {
        if (buffer.readUInt16BE(i) === exports.HEADER_FLAG) {
            return i;
        }
    }
    return -1;
}
//# sourceMappingURL=header.js.map