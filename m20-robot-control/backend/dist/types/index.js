"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GaitType = exports.LEDMode = exports.ChargeStatus = exports.DeviceStatus = exports.ConnectionStatus = void 0;
// Connection types
var ConnectionStatus;
(function (ConnectionStatus) {
    ConnectionStatus["Disconnected"] = "disconnected";
    ConnectionStatus["Connecting"] = "connecting";
    ConnectionStatus["Connected"] = "connected";
    ConnectionStatus["Error"] = "error";
})(ConnectionStatus || (exports.ConnectionStatus = ConnectionStatus = {}));
var DeviceStatus;
(function (DeviceStatus) {
    DeviceStatus[DeviceStatus["Normal"] = 0] = "Normal";
    DeviceStatus[DeviceStatus["Standby"] = 1] = "Standby";
    DeviceStatus[DeviceStatus["Sleeping"] = 2] = "Sleeping";
    DeviceStatus[DeviceStatus["Charging"] = 3] = "Charging";
    DeviceStatus[DeviceStatus["Error"] = 4] = "Error";
})(DeviceStatus || (exports.DeviceStatus = DeviceStatus = {}));
var ChargeStatus;
(function (ChargeStatus) {
    ChargeStatus[ChargeStatus["Discharging"] = 0] = "Discharging";
    ChargeStatus[ChargeStatus["Charging"] = 1] = "Charging";
    ChargeStatus[ChargeStatus["Full"] = 2] = "Full";
    ChargeStatus[ChargeStatus["NotInstalled"] = 3] = "NotInstalled";
})(ChargeStatus || (exports.ChargeStatus = ChargeStatus = {}));
var LEDMode;
(function (LEDMode) {
    LEDMode[LEDMode["Off"] = 0] = "Off";
    LEDMode[LEDMode["On"] = 1] = "On";
    LEDMode[LEDMode["Blink"] = 2] = "Blink";
})(LEDMode || (exports.LEDMode = LEDMode = {}));
var GaitType;
(function (GaitType) {
    GaitType[GaitType["Basic"] = 4097] = "Basic";
    GaitType[GaitType["Stairs"] = 4099] = "Stairs";
    GaitType[GaitType["Flat"] = 12290] = "Flat";
    GaitType[GaitType["StairsAgile"] = 12291] = "StairsAgile";
})(GaitType || (exports.GaitType = GaitType = {}));
//# sourceMappingURL=index.js.map