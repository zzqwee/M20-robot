# Data Model: M20机器狗控制应用

**Date**: 2026-03-18

## 实体定义

### 1. 设备连接 (DeviceConnection)

| 字段 | 类型 | 说明 | 必填 |
|------|------|------|------|
| ipAddress | string | 机器狗IP地址 | 是 |
| port | number | TCP端口号，默认30001 | 是 |
| udpPort | number | UDP端口号，默认30000 | 是 |
| status | ConnectionStatus | 连接状态 | 是 |
| lastConnected | Date | 最后连接时间 | 否 |

### 2. 设备信息 (DeviceInfo)

| 字段 | 类型 | 说明 | 必填 |
|------|------|------|------|
| model | string | 设备型号 | 是 |
| version | string | 设备版本 | 是 |
| serialNumber | string | 设备序列号 | 是 |
| status | DeviceStatus | 设备状态 | 是 |
| ipAddress | string | IP地址 | 是 |
| macAddress | string | MAC地址 | 是 |
| gateway | string | 网关地址 | 否 |
| subnetMask | string | 子网掩码 | 否 |
| dns | string | DNS地址 | 否 |
| clock | Date | 设备时钟 | 否 |

### 3. 运动指令 (MotionCommand)

| 字段 | 类型 | 说明 | 范围 |
|------|------|------|------|
| x | number | X轴速度 (前进/后退) | -1.0 ~ 1.0 m/s |
| y | number | Y轴速度 (左移/右移) | -1.0 ~ 1.0 m/s |
| yaw | number | Yaw角速度 (左转/右转) | -1.0 ~ 1.0 rad/s |

### 4. 电池状态 (BatteryStatus)

| 字段 | 类型 | 说明 | 必填 |
|------|------|------|------|
| leftVoltage | number | 左侧电池电压 (V) | 是 |
| rightVoltage | number | 右侧电池电压 (V) | 是 |
| leftLevel | number | 左侧电量百分比 | 是 |
| rightLevel | number | 右侧电量百分比 | 是 |
| chargeStatus | ChargeStatus | 充放电状态 | 是 |

### 5. 传感器数据 (SensorData)

| 字段 | 类型 | 说明 | 必填 |
|------|------|------|------|
| lidarFront | number | 前激光雷达距离 (m) | 是 |
| lidarBack | number | 后激光雷达距离 (m) | 是 |
| imuRoll | number | Roll角 (rad) | 是 |
| imuPitch | number | Pitch角 (rad) | 是 |
| imuYaw | number | Yaw角 (rad) | 是 |
| temperature | number | 温度 (℃) | 是 |

### 6. LED状态 (LEDStatus)

| 字段 | 类型 | 说明 | 必填 |
|------|------|------|------|
| front | LEDMode | 前灯模式 | 是 |
| back | LEDMode | 后灯模式 | 是 |

## 枚举类型

### ConnectionStatus (连接状态)

```typescript
enum ConnectionStatus {
  Disconnected = 'disconnected',
  Connecting = 'connecting',
  Connected = 'connected',
  Error = 'error'
}
```

### DeviceStatus (设备状态)

```typescript
enum DeviceStatus {
  Normal = 0,      // 正常
  Standby = 1,     // 待机
  Sleeping = 2,    // 休眠中
  Charging = 3,    // 充电中
  Error = 4        // 异常
}
```

### ChargeStatus (充放电状态)

```typescript
enum ChargeStatus {
  Discharging = 0,  // 放电
  Charging = 1,    // 充电
  Full = 2,        // 充满
  NotInstalled = 3 // 未安装
}
```

### LEDMode (LED模式)

```typescript
enum LEDMode {
  Off = 0,         // 关闭
  On = 1,          // 点亮
  Blink = 2        // 闪烁
}
```

### GaitType (步态类型)

```typescript
enum GaitType {
  Basic = 0x1001,      // 基础
  Stairs = 0x1003,    // 楼梯
  Flat = 0x3002,       // 平地(敏捷)
  StairsAgile = 0x3003 // 楼梯(敏捷)
}
```

## 数据流

```
用户操作 → 前端组件 → WebSocket → 后端服务 → TCP → 机器狗
                                    ↓
                              UDP接收 ← 状态上报
                                    ↓
                              协议解析
                                    ↓
                              WebSocket → 前端Store → UI更新
```

## 状态管理

使用Zustand或React Context进行状态管理：

```typescript
interface RobotState {
  // 连接状态
  connection: DeviceConnection;

  // 设备信息
  deviceInfo: DeviceInfo | null;

  // 电池状态
  battery: BatteryStatus | null;

  // 传感器数据
  sensors: SensorData | null;

  // LED状态
  led: LEDStatus;

  // 模拟模式
  simulationMode: boolean;
}
```

---

**文档版本**: V1.0
**编制日期**: 2026-03-18
