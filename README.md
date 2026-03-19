# M20 Robot Control

M20 机器人控制系统，包含后端服务和前端界面。

## 项目结构

```
m20-robot-control/
├── backend/          # 后端服务 (Node.js + TypeScript)
│   ├── src/          # 源代码
│   ├── dist/         # 编译输出
│   └── package.json
└── frontend/         # 前端界面 (React + Vite + TailwindCSS)
    ├── src/          # 源代码
    ├── dist/         # 构建输出
    └── package.json
```

## 功能特性

- TCP 通信：与 M20 机器人建立 TCP 连接
- WebSocket：实时数据推送
- Web 控制界面：现代化的控制面板

## 快速开始

### 后端

```bash
cd m20-robot-control/backend
npm install
npm run dev    # 开发模式
npm run build  # 编译
npm start      # 生产模式
```

### 前端

```bash
cd m20-robot-control/frontend
npm install
npm run dev     # 开发服务器
npm run build   # 构建
npm run preview # 预览构建结果
```

## 技术栈

**后端:**
- Node.js
- Express
- WebSocket (ws)
- TypeScript

**前端:**
- React 18
- Vite
- TailwindCSS
- TypeScript

## License

MIT
