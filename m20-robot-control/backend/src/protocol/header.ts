import { ProtocolHeader } from '../types';

export const HEADER_FLAG = 0xEB90;

export function parseHeader(buffer: Buffer): ProtocolHeader | null {
  if (buffer.length < 16) {
    return null;
  }

  const headerFlag = buffer.readUInt16BE(0);
  if (headerFlag !== HEADER_FLAG) {
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

export function buildHeader(
  messageType: number,
  commandCode: number,
  dataLength: number,
  sequenceNum: number,
  protocolType: number = 0  // 0 = JSON
): Buffer {
  const buffer = Buffer.alloc(16);

  buffer.writeUInt16BE(HEADER_FLAG, 0);      // Header flag
  buffer.writeUInt16BE(dataLength, 2);       // Data length
  buffer.writeUInt8(protocolType, 4);         // Protocol type
  buffer.writeUInt16BE(messageType, 5);       // Message type
  buffer.writeUInt16BE(commandCode, 7);       // Command code
  buffer.writeUInt16BE(sequenceNum, 9);       // Sequence number
  // Reserved bytes (11-13) are already 0

  return buffer;
}

export function findHeaderStart(buffer: Buffer): number {
  for (let i = 0; i <= buffer.length - 2; i++) {
    if (buffer.readUInt16BE(i) === HEADER_FLAG) {
      return i;
    }
  }
  return -1;
}
