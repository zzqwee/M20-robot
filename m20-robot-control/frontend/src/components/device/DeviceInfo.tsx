import { DeviceInfo as DeviceInfoType, DeviceStatus } from '../../types';

interface DeviceInfoProps {
  deviceInfo: DeviceInfoType | null;
}

const statusMap: Record<DeviceStatus, string> = {
  [DeviceStatus.Normal]: '正常',
  [DeviceStatus.Standby]: '待机',
  [DeviceStatus.Sleeping]: '休眠中',
  [DeviceStatus.Charging]: '充电中',
  [DeviceStatus.Error]: '异常'
};

export function DeviceInfo({ deviceInfo }: DeviceInfoProps) {
  if (!deviceInfo) {
    return (
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4">设备信息</h3>
        <p className="text-gray-500 text-center py-8">
          等待连接设备...
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold mb-4">设备信息</h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-3">
          <div>
            <p className="text-xs text-gray-500">设备型号</p>
            <p className="font-medium">{deviceInfo.model}</p>
          </div>

          <div>
            <p className="text-xs text-gray-500">设备版本</p>
            <p className="font-medium">{deviceInfo.version}</p>
          </div>

          <div>
            <p className="text-xs text-gray-500">序列号</p>
            <p className="font-medium text-sm">{deviceInfo.serialNumber}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-xs text-gray-500">设备状态</p>
            <p className="font-medium">
              {statusMap[deviceInfo.status] || '未知'}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500">IP地址</p>
            <p className="font-medium">{deviceInfo.ipAddress}</p>
          </div>

          <div>
            <p className="text-xs text-gray-500">MAC地址</p>
            <p className="font-medium text-sm">{deviceInfo.macAddress}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
