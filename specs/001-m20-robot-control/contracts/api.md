# API Contracts: M20机器狗控制应用

**Date**: 2026-03-18

## 前端-后端通信协议 (WebSocket)

### 连接

```
WebSocket URL: ws://localhost:3000/ws
```

### 消息格式

请求消息:
```json
{
  "type": "request",
  "action": "connect" | "disconnect" | "motion" | "led" | "device",
  "payload": { ... },
  "requestId": "uuid"
}
```

响应消息:
```json
{
  "type": "response",
  "action": "connect" | "disconnect" | "motion" | "led" | "device",
  "success": true | false,
  "payload": { ... },
  "requestId": "uuid"
}
```

状态上报消息:
```json
{
  "type": "status",
  "data": {
    "deviceInfo": { ... },
    "battery": { ... },
    "sensors": { ... },
    "led": { ... }
  },
  "timestamp": "ISO8601"
}
```

---

## 接口清单

### 1. 连接控制

#### 1.1 连接设备

**请求**:
```json
{
  "type": "request",
  "action": "connect",
  "payload": {
    "ipAddress": "192.168.10.104",
    "tcpPort": 30001,
    "udpPort": 30000
  },
  "requestId": "req-001"
}
```

**响应**:
```json
{
  "type": "response",
  "action": "connect",
  "success": true,
  "payload": {
    "message": "Connected successfully"
  },
  "requestId": "req-001"
}
```

#### 1.2 断开连接

**请求**:
```json
{
  "type": "request",
  "action": "disconnect",
  "payload": {},
  "requestId": "req-002"
}
```

---

### 2. 运动控制

#### 2.1 发送运动指令

**请求**:
```json
{
  "type": "request",
  "action": "motion",
  "payload": {
    "x": 0.5,
    "y": 0,
    "yaw": 0
  },
  "requestId": "req-003"
}
```

**参数说明**:
| 参数 | 类型 | 范围 | 说明 |
|------|------|------|------|
| x | number | -1.0 ~ 1.0 | X轴速度 (前进为正) |
| y | number | -1.0 ~ 1.0 | Y轴速度 (左移为正) |
| yaw | number | -1.0 ~ 1.0 | 角速度 (左转为正) |

#### 2.2 停止运动

**请求**:
```json
{
  "type": "request",
  "action": "motion",
  "payload": {
    "x": 0,
    "y": 0,
    "yaw": 0
  },
  "requestId": "req-004"
}
```

---

### 3. LED控制

#### 3.1 设置LED

**请求**:
```json
{
  "type": "request",
  "action": "led",
  "payload": {
    "front": 1,
    "back": 0
  },
  "requestId": "req-005"
}
```

**参数说明**:
| 参数 | 类型 | 值 | 说明 |
|------|------|------|------|
| front | number | 0=关闭, 1=点亮, 2=闪烁 | 前灯模式 |
| back | number | 0=关闭, 1=点亮, 2=闪烁 | 后灯模式 |

---

### 4. 设备控制

#### 4.1 开关设备

**请求**:
```json
{
  "type": "request",
  "action": "device",
  "payload": {
    "cameraFront": true,
    "cameraBack": false,
    "microphone": true,
    "lidarFront": true
  },
  "requestId": "req-006"
}
```

---

### 5. 状态查询

#### 5.1 获取设备信息

**请求**:
```json
{
  "type": "request",
  "action": "getDeviceInfo",
  "payload": {},
  "requestId": "req-007"
}
```

**响应**:
```json
{
  "type": "response",
  "action": "getDeviceInfo",
  "success": true,
  "payload": {
    "deviceInfo": {
      "model": "山猫M20",
      "version": "STD",
      "serialNumber": "M20-20260101-001",
      "status": 0,
      "ipAddress": "192.168.10.104",
      "macAddress": "00:11:22:33:44:55"
    }
  },
  "requestId": "req-007"
}
```

---

## 模拟模式API

### 开启模拟模式

**请求**:
```json
{
  "type": "request",
  "action": "simulation",
  "payload": {
    "enabled": true
  },
  "requestId": "req-008"
}
```

---

**文档版本**: V1.0
**编制日期**: 2026-03-18
