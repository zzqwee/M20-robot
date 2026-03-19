import { useEffect, useState } from 'react';
import { ConnectionPanel } from './components/device/ConnectionPanel';
import { DeviceInfo } from './components/device/DeviceInfo';
import { MotionControl } from './components/control/MotionControl';
import { LEDControl } from './components/control/LEDControl';
import { DeviceToggle } from './components/control/DeviceToggle';
import { BatteryStatus } from './components/status/BatteryStatus';
import { SensorData } from './components/status/SensorData';
import { useRobot } from './hooks/useRobot';
import { api } from './services/api';
import { WSStatus } from './types';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const {
    connection,
    deviceInfo,
    battery,
    sensors,
    simulationMode,
    isConnected,
    initConnection,
    handleConnect,
    handleDisconnect,
    handleSimulation
  } = useRobot();

  useEffect(() => {
    initConnection();

    // Listen for status updates
    const handleStatus = (data: WSStatus | any) => {
      if (data.type === 'status') {
        // Status is already handled in useRobot hook
      }
    };

    api.on('*', handleStatus as any);

    return () => {
      api.off('*', handleStatus);
    };
  }, [initConnection]);

  const handleSimulationToggle = async () => {
    await handleSimulation(!simulationMode);
  };

  return (
    <div className="min-h-screen pb-8">
      {/* Navbar */}
      <nav className="glass-navbar fixed top-0 left-0 right-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-800">M20 机器狗控制</h1>

          <div className="flex items-center gap-4">
            {/* Simulation Toggle */}
            <button
              onClick={handleSimulationToggle}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                simulationMode
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {simulationMode ? '模拟模式' : '模拟模式'}
            </button>

            {/* Navigation */}
            <button
              onClick={() => setCurrentPage('dashboard')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                currentPage === 'dashboard' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              仪表盘
            </button>
            <button
              onClick={() => setCurrentPage('control')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                currentPage === 'control' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              控制
            </button>
            <button
              onClick={() => setCurrentPage('settings')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                currentPage === 'settings' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              设置
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-24 px-6 max-w-7xl mx-auto">
        {currentPage === 'dashboard' && (
          <div className="space-y-6 fade-in">
            {/* Connection */}
            <ConnectionPanel
              ipAddress={connection.ipAddress}
              status={connection.status}
              onConnect={handleConnect}
              onDisconnect={handleDisconnect}
            />

            {/* Device Info and Battery - side by side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DeviceInfo deviceInfo={deviceInfo} />
              <BatteryStatus battery={battery} />
            </div>

            {/* Sensors */}
            <SensorData sensors={sensors} />
          </div>
        )}

        {currentPage === 'control' && (
          <div className="space-y-6 fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <MotionControl disabled={!isConnected && !simulationMode} />
              <LEDControl disabled={!isConnected && !simulationMode} />
            </div>

            <DeviceToggle disabled={!isConnected && !simulationMode} />
          </div>
        )}

        {currentPage === 'settings' && (
          <div className="space-y-6 fade-in">
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold mb-4">设置</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">模拟数据模式</p>
                    <p className="text-sm text-gray-500">不连接真实机器狗，使用模拟数据</p>
                  </div>
                  <button
                    onClick={handleSimulationToggle}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      simulationMode
                        ? 'bg-primary text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {simulationMode ? '已开启' : '开启'}
                  </button>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-medium">连接信息</p>
                  <div className="mt-2 space-y-1 text-sm text-gray-600">
                    <p>IP地址: {connection.ipAddress}</p>
                    <p>TCP端口: 30001</p>
                    <p>UDP端口: 30000</p>
                    <p>WebSocket: ws://localhost:3000/ws</p>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-medium">版本信息</p>
                  <p className="text-sm text-gray-600 mt-1">M20 机器狗控制应用 v1.0.0</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
