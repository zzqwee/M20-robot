import { ProtocolHeader } from '../types';
export declare const HEADER_FLAG = 60304;
export declare function parseHeader(buffer: Buffer): ProtocolHeader | null;
export declare function buildHeader(messageType: number, commandCode: number, dataLength: number, sequenceNum: number, protocolType?: number): Buffer;
export declare function findHeaderStart(buffer: Buffer): number;
//# sourceMappingURL=header.d.ts.map