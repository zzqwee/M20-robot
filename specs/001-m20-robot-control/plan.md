# Implementation Plan: M20机器狗控制应用

**Branch**: `001-m20-robot-control` | **Date**: 2026-03-18 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-m20-robot-control/spec.md`

## Summary

开发一款连接M20/M20 Pro机器狗的Web应用系统，采用前后端分离架构。前端使用React + TypeScript开发，UI采用Apple FrostyGlass风格（毛玻璃效果），运行端口5173。后端提供TCP/UDP通信服务与机器狗交互，支持设备信息获取、运动控制、LED/摄像头/麦克风控制、传感器数据读取、电池状态监控以及模拟数据模式。

## Technical Context

**Language/Version**: TypeScript 5.x / Python 3.11
**Primary Dependencies**: React 18, Vite, Node.js TCP/UDP socket (Node.js原生), TailwindCSS
**Storage**: 浏览器本地存储 (localStorage) 用于保存配置
**Testing**: Vitest (前端), pytest (后端)
**Target Platform**: Web浏览器 (PC端)
**Project Type**: Web应用 (前端 + 后端服务)
**Performance Goals**: 运动控制指令延迟<100ms，状态更新频率2Hz
**Constraints**: 需要与机器狗在同一局域网内通信
**Scale/Scope**: 单用户Web控制界面，约10个页面组件

## Constitution Check

*本项目为全新项目，无现有代码库约束*

## Project Structure

### Documentation (this feature)

```text
specs/001-m20-robot-control/
├── spec.md              # 需求规范文档
├── plan.md              # 实施计划 (本文档)
├── research.md          # 技术研究文档
├── data-model.md        # 数据模型
├── quickstart.md        # 快速开始指南
├── contracts/           # 接口协议定义
└── tasks.md             # 任务清单
```

### Source Code (repository root)

```text
m20-robot-control/
├── backend/                     # 后端通信服务
│   ├── src/
│   │   ├── index.ts             # 服务入口
│   │   ├── tcp-client.ts        # TCP客户端 (发送控制指令)
│   │   ├── udp-server.ts        #UDP服务器 (接收状态上报)
│   │   ├── protocol/           # 协议解析
│   │   │   ├── header.ts        # 协议头部解析
│   │   │   └── messages.ts      # 消息类型定义
│   │   └── services/
│   │       └── robot.ts         # 机器人控制服务
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                    # 前端应用
│   ├── src/
│   │   ├── main.tsx            # 应用入口
│   │   ├── App.tsx             # 主组件
│   │   ├── components/          # UI组件
│   │   │   ├── common/          # 通用组件
│   │   │   │   ├── FrostedCard.tsx    # 毛玻璃卡片
│   │   │   │   ├── StatusBadge.tsx     # 状态徽章
│   │   │   │   └── ControlButton.tsx  # 控制按钮
│   │   │   ├── layout/         # 布局组件
│   │   │   │   ├── Navbar.tsx         # 导航栏
│   │   │   │   └── Sidebar.tsx        # 侧边栏
│   │   │   ├── device/         # 设备相关
│   │   │   │   ├── DeviceInfo.tsx     # 设备信息
│   │   │   │   └── ConnectionPanel.tsx # 连接面板
│   │   │   ├── control/         # 控制相关
│   │   │   │   ├── MotionControl.tsx  # 运动控制
│   │   │   │   ├── LEDControl.tsx    # LED控制
│   │   │   │   └── DeviceToggle.tsx  # 设备开关
│   │   │   └── status/         # 状态显示
│   │   │       ├── BatteryStatus.tsx # 电池状态
│   │   │       └── SensorData.tsx    # 传感器数据
│   │   ├── pages/              # 页面
│   │   │   ├── Dashboard.tsx   # 仪表盘
│   │   │   ├── Control.tsx     # 控制页面
│   │   │   └── Settings.tsx    # 设置页面
│   │   ├── hooks/              # 自定义Hooks
│   │   │   ├── useRobot.ts             # 机器人连接
│   │   │   ├── useMotionControl.ts     # 运动控制
│   │   │   └── useSimulation.ts        # 模拟数据
│   │   ├── services/           # 服务层
│   │   │   ├── api.ts          # API通信
│   │   │   └── simulator.ts    # 模拟器
│   │   ├── stores/             # 状态管理
│   │   │   └── robotStore.ts   # 机器人状态
│   │   ├── types/              # 类型定义
│   │   │   └── index.ts
│   │   └── styles/             # 样式
│   │       └── globals.css     # 全局样式
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
└── README.md                   # 项目说明
```

**Structure Decision**: 前后端分离架构
- backend/: Node.js TypeScript后端，处理TCP/UDP通信
- frontend/: React + TypeScript前端，Vite构建，端口5173

## Phase 0: Research

### 技术选型研究

**决策**: 采用Node.js作为后端运行时

| 选项 | 决策 | 理由 |
|------|------|------|
| 后端语言 | Node.js | 前端同构TypeScript，协议处理方便，TCP/UDP支持完善 |
| 前端框架 | React 18 | 社区成熟，组件化开发，生态丰富 |
| 构建工具 | Vite | 快速启动，热更新，符合现代开发体验 |
| 样式方案 | TailwindCSS | 快速开发，支持自定义主题 |
| 通信方式 | WebSocket | 前后端实时通信，前端通过WebSocket与后端交互 |

### 协议研究

根据M20软件开发指南文档：
- **UDP端口**: 30000 (接收状态上报)
- **TCP端口**: 30001 (发送控制指令)
- **协议格式**: 16字节头部 + JSON/XML ASDU
- **消息类型**:
  - 心跳指令: Type=100, Command=100
  - 运动控制: Type=2, Command=21
  - LED控制: Type=1101, Command=2
  - 设备状态: Type=1002, Command=5
  - 电池状态: Type=1002, Command=5
  - 运控状态: Type=1002, Command=4

### M20协议关键参数

| 参数 | 说明 | 取值范围 |
|------|------|----------|
| X轴速度 | 前进/后退 | -1.0 ~ 1.0 m/s |
| Y轴速度 | 左移/右移 | -1.0 ~ 1.0 m/s |
| Yaw角速度 | 左转/右转 | -1.0 ~ 1.0 rad/s |
| 运动指令频率 | 建议发送频率 | 20Hz |

---

**实施计划版本**: V1.0
**编制日期**: 2026-03-18
