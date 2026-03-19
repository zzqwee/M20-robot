# Quickstart: M20机器狗控制应用

**Date**: 2026-03-18

## 环境要求

- Node.js 18+
- npm 9+
- Git

## 安装步骤

### 1. 克隆项目

```bash
cd /path/to/your/workspace
```

### 2. 安装依赖

#### 后端安装

```bash
cd backend
npm install
```

#### 前端安装

```bash
cd frontend
npm install
```

## 启动应用

### 1. 启动后端服务

```bash
cd backend
npm run dev
```

后端服务将运行在 `http://localhost:3000`

### 2. 启动前端应用

```bash
cd frontend
npm run dev
```

前端应用将运行在 `http://localhost:5173`

### 3. 访问应用

打开浏览器访问: http://localhost:5173

## 快速使用指南

### 方式一: 连接真实机器狗

1. 确保机器狗与电脑在同一局域网内
2. 在连接面板输入机器狗IP地址（默认: 192.168.10.104）
3. 点击"连接"按钮
4. 等待连接成功后即可查看设备信息和控制

### 方式二: 使用模拟数据模式

1. 点击右上角"模拟数据"开关
2. 系统将显示模拟的设备信息和控制界面
3. 可用于UI测试和功能演示

## 项目结构

```
m20-robot-control/
├── backend/          # 后端服务
│   └── src/
│       ├── index.ts          # 入口
│       ├── tcp-client.ts     # TCP客户端
│       ├── udp-server.ts     # UDP服务器
│       └── protocol/         # 协议处理
│
└── frontend/         # 前端应用
    └── src/
        ├── components/      # UI组件
        ├── pages/          # 页面
        ├── hooks/          # 逻辑Hooks
        └── services/       # 服务层
```

## 常用命令

### 后端

```bash
npm run dev      # 开发模式启动
npm run build    # 构建生产版本
npm run start    # 运行生产版本
```

### 前端

```bash
npm run dev      # 开发模式启动 (端口5173)
npm run build    # 构建生产版本
npm run preview  # 预览生产版本
```

## 故障排除

### 连接失败

1. 检查机器狗IP是否正确
2. 确保在同一局域网
3. 检查机器狗TCP/UDP服务是否开启

### 前端无法访问

1. 检查端口5173是否被占用
2. 尝试清除浏览器缓存

---

**文档版本**: V1.0
**编制日期**: 2026-03-18
