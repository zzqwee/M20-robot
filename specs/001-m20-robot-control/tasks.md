# Tasks: M20机器狗控制应用

**Feature**: M20机器狗控制应用
**Generated**: 2026-03-18
**Spec**: [spec.md](./spec.md)
**Plan**: [plan.md](./plan.md)

## Summary

- **Total Tasks**: 48
- **User Stories**: 7
- **Parallelizable Tasks**: 15

## Implementation Strategy

**MVP Scope**: User Story 1 (设备连接与信息查看) - 核心功能，支持连接机器狗并查看设备信息

**增量交付**:
1. Phase 1-2: 项目初始化和基础设施
2. Phase 3: US1 设备连接与信息查看 (P1)
3. Phase 4: US2 运动控制 (P1)
4. Phase 5: US3 LED灯光控制 (P2)
5. Phase 6: US4 电池状态监控 (P2)
7. Phase 7: US6 模拟数据模式 (P2)
8. Phase 8: US5 传感器数据读取 (P3)
9. Phase 9: US7 摄像头和麦克风控制 (P3)
10. Phase 10: 整合测试与优化

---

## Phase 1: 项目初始化 (Setup)

- [x] T001 Create project directory structure `m20-robot-control/` in project root
- [x] T002 Initialize backend with `package.json` and TypeScript config in `m20-robot-control/backend/`
- [x] T003 Initialize frontend with Vite + React + TypeScript in `m20-robot-control/frontend/`
- [x] T004 Configure frontend Vite to use port 5173 in `m20-robot-control/frontend/vite.config.ts`
- [x] T005 Install backend dependencies: express, ws, typescript, ts-node, @types/node in `m20-robot-control/backend/`
- [x] T006 Install frontend dependencies: react, react-dom, tailwindcss, postcss, autoprefixer in `m20-robot-control/frontend/`
- [x] T007 Configure TailwindCSS in `m20-robot-control/frontend/tailwind.config.js`
- [x] T008 Create global styles with FrostyGlass theme variables in `m20-robot-control/frontend/src/styles/globals.css`

---

## Phase 2: 基础设施 (Foundational)

- [x] T009 Create TypeScript type definitions in `m20-robot-control/backend/src/types/index.ts`
- [x] T010 [P] Create frontend TypeScript types mirroring backend in `m20-robot-control/frontend/src/types/index.ts`
- [x] T011 Implement M20 protocol header parser in `m20-robot-control/backend/src/protocol/header.ts`
- [x] T012 [P] Implement message type definitions in `m20-robot-control/backend/src/protocol/messages.ts`
- [x] T013 Create WebSocket server in `m20-robot-control/backend/src/index.ts`
- [x] T014 Create API service layer in `m20-robot-control/frontend/src/services/api.ts`
- [x] T015 Create robot state store in `m20-robot-control/frontend/src/stores/robotStore.ts`

---

## Phase 3: US1 - 设备连接与信息查看 (P1)

**Goal**: 用户能够配置IP并连接机器狗，查看设备基本信息

**Independent Test**: 用户输入IP地址后点击连接，系统显示连接状态，成功后展示设备详细信息卡片

- [x] T016 [US1] Implement TCP client connection in `m20-robot-control/backend/src/tcp-client.ts`
- [x] T017 [US1] Implement UDP server for status receiving in `m20-robot-control/backend/src/udp-server.ts`
- [x] T018 [P] [US1] Create device info response parser in `m20-robot-control/backend/src/services/robot.ts`
- [x] T019 [US1] Create connection panel component in `m20-robot-control/frontend/src/components/device/ConnectionPanel.tsx`
- [x] T020 [P] [US1] Create device info display component in `m20-robot-control/frontend/src/components/device/DeviceInfo.tsx`
- [x] T021 [US1] Create useRobot hook in `m20-robot-control/frontend/src/hooks/useRobot.ts`
- [x] T022 [US1] Implement WebSocket message handling for connect/disconnect in `m20-robot-control/backend/src/index.ts`
- [x] T023 [US1] Build connection flow UI in Dashboard page in `m20-robot-control/frontend/src/pages/Dashboard.tsx`

**Independent Test Criteria**:
- 输入有效IP点击连接后显示"连接成功"
- 显示设备型号、版本、序列号、IP地址、MAC地址

---

## Phase 4: US2 - 运动控制 (P1)

**Goal**: 用户能够通过方向按钮控制机器狗移动和旋转

**Independent Test**: 用户在运动控制面板点击方向按钮，机器狗按预期方向移动

- [x] T024 [US2] Implement motion command builder in `m20-robot-control/backend/src/services/robot.ts`
- [x] T025 [P] [US2] Create motion control protocol message (Type=2, Command=21) in `m20-robot-control/backend/src/protocol/messages.ts`
- [x] T026 [US2] Create motion control component in `m20-robot-control/frontend/src/components/control/MotionControl.tsx`
- [x] T027 [US2] Create useMotionControl hook in `m20-robot-control/frontend/src/hooks/useMotionControl.ts`
- [x] T028 [US2] Implement WebSocket motion command handling in `m20-robot-control/backend/src/index.ts`
- [x] T029 [US2] Add motion control to Control page in `m20-robot-control/frontend/src/pages/Control.tsx`

**Independent Test Criteria**:
- 点击"前进"按钮发送x轴正向速度指令
- 点击"停止"按钮发送速度为0的指令

---

## Phase 5: US3 - LED灯光控制 (P2)

**Goal**: 用户能够控制机器狗LED灯的开关和闪烁

**Independent Test**: 用户点击LED控制按钮，机器狗灯光按预期变化

- [x] T030 [US3] Implement LED command builder in `m20-robot-control/backend/src/services/robot.ts`
- [x] T031 [P] [US3] Create LED control protocol message (Type=1101, Command=2) in `m20-robot-control/backend/src/protocol/messages.ts`
- [x] T032 [US3] Create LED control component in `m20-robot-control/frontend/src/components/control/LEDControl.tsx`
- [x] T033 [US3] Implement WebSocket LED command handling in `m20-robot-control/backend/src/index.ts`
- [x] T034 [US3] Add LED control to Control page in `m20-robot-control/frontend/src/pages/Control.tsx`

**Independent Test Criteria**:
- 点击"开灯"发送LED点亮指令
- 点击"闪烁"发送LED闪烁指令

---

## Phase 6: US4 - 电池状态监控 (P2)

**Goal**: 用户能够实时查看机器狗电池状态

**Independent Test**: 电池信息显示与实际一致，电量低时显示警告

- [x] T035 [US4] Implement battery status parser in `m20-robot-control/backend/src/services/robot.ts`
- [x] T036 [P] [US4] Create battery status component in `m20-robot-control/frontend/src/components/status/BatteryStatus.tsx`
- [x] T037 [US4] Create battery display in Dashboard page in `m20-robot-control/frontend/src/pages/Dashboard.tsx`
- [x] T038 [US4] Implement UDP status parsing for battery data in `m20-robot-control/backend/src/udp-server.ts`

**Independent Test Criteria**:
- 显示左右电池电压和电量百分比
- 电量低于20%时显示警告

---

## Phase 7: US6 - 模拟数据模式 (P2)

**Goal**: 用户无需连接真实机器狗即可查看所有页面功能

**Independent Test**: 开启模拟模式后所有页面显示模拟数据

- [x] T039 [US6] Create simulator service in `m20-robot-control/frontend/src/services/simulator.ts`
- [x] T040 [US6] Create useSimulation hook in `m20-robot-control/frontend/src/hooks/useSimulation.ts`
- [x] T041 [US6] Add simulation toggle to Settings page in `m20-robot-control/frontend/src/pages/Settings.tsx`
- [x] T042 [US6] Implement simulation data flow in robot store in `m20-robot-control/frontend/src/stores/robotStore.ts`
- [x] T043 [US6] Add simulation mode indicator in Navbar component in `m20-robot-control/frontend/src/components/layout/Navbar.tsx`

**Independent Test Criteria**:
- 开启模拟模式后显示模拟设备信息
- 运动控制显示UI反馈但不发送真实指令

---

## Phase 8: US5 - 传感器数据读取 (P3)

**Goal**: 用户能够查看机器狗传感器实时数据

**Independent Test**: 传感器数据定期更新

- [x] T044 [US5] Implement sensor data parser in `m20-robot-control/backend/src/services/robot.ts`
- [x] T045 [P] [US5] Create sensor data component in `m20-robot-control/frontend/src/components/status/SensorData.tsx`
- [x] T046 [US5] Add sensor data display to Dashboard page in `m20-robot-control/frontend/src/pages/Dashboard.tsx`
- [x] T047 [US5] Implement UDP sensor data parsing in `m20-robot-control/backend/src/udp-server.ts`

**Independent Test Criteria**:
- 显示激光雷达距离数据
- 显示IMU姿态角度数据

---

## Phase 9: US7 - 摄像头和麦克风控制 (P3)

**Goal**: 用户能够控制摄像头和麦克风的开关

**Independent Test**: 点击控制按钮后状态正确显示

- [x] T048 [US7] Create device toggle component in `m20-robot-control/frontend/src/components/control/DeviceToggle.tsx`
- [x] T049 [US7] Add device toggle to Control page in `m20-robot-control/frontend/src/pages/Control.tsx`

**Independent Test Criteria**:
- 点击"开启摄像头"后状态显示开启

---

## Phase 10: 整合与优化

- [ ] T050 Integrate all components with FrostyGlass styling
- [ ] T051 Test end-to-end flow with real robot (when available)
- [ ] T052 Performance optimization - motion control latency <100ms
- [ ] T053 Final UI polish and bug fixes

---

## Dependency Graph

```
Phase 1 (Setup)
  └─ All tasks must complete before Phase 2

Phase 2 (Foundational)
  ├─ T009-T012: Protocol & Types
  └─ T013-T015: Core infrastructure
       └─ Required for all User Stories

Phase 3 (US1 - 设备连接)
  └─ Requires Phase 2 complete

Phase 4 (US2 - 运动控制)
  └─ Requires Phase 2, can parallel with US1

Phase 5-9 (US3-US7)
  └─ Each requires Phase 2, can parallel with each other
```

## Parallel Opportunities

| Tasks | Description |
|-------|-------------|
| T010, T012 | Frontend types and protocol messages |
| T018, T024, T030, T035, T044 | Backend service parsers |
| T019, T020, T026, T032, T036 | Frontend components |
| T043-T049 | UI components for remaining stories |

---

**Tasks Version**: V1.0
**Generated**: 2026-03-18
