import { SensorData as SensorDataType } from '../../types';

interface SensorDataProps {
  sensors: SensorDataType | null;
}

export function SensorData({ sensors }: SensorDataProps) {
  if (!sensors) {
    return (
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4">传感器数据</h3>
        <p className="text-gray-500 text-center py-8">
          等待数据...
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold mb-4">传感器数据</h3>

      <div className="grid grid-cols-2 gap-4">
        {/* LIDAR */}
        <div className="col-span-2">
          <p className="text-sm font-medium text-gray-700 mb-2">激光雷达</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500">前距离</p>
              <p className="text-lg font-semibold">{sensors.lidarFront.toFixed(2)} m</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500">后距离</p>
              <p className="text-lg font-semibold">{sensors.lidarBack.toFixed(2)} m</p>
            </div>
          </div>
        </div>

        {/* IMU */}
        <div className="col-span-2">
          <p className="text-sm font-medium text-gray-700 mb-2">姿态角度 (IMU)</p>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500">Roll</p>
              <p className="text-lg font-semibold">{(sensors.imuRoll * 180 / Math.PI).toFixed(1)}°</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500">Pitch</p>
              <p className="text-lg font-semibold">{(sensors.imuPitch * 180 / Math.PI).toFixed(1)}°</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500">Yaw</p>
              <p className="text-lg font-semibold">{(sensors.imuYaw * 180 / Math.PI).toFixed(1)}°</p>
            </div>
          </div>
        </div>

        {/* Temperature */}
        <div className="col-span-2">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500">温度</p>
            <p className="text-lg font-semibold">{sensors.temperature.toFixed(1)} °C</p>
          </div>
        </div>
      </div>
    </div>
  );
}
