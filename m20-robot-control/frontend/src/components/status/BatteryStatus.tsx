import { BatteryStatus as BatteryStatusType, ChargeStatus } from '../../types';

interface BatteryStatusProps {
  battery: BatteryStatusType | null;
}

const chargeStatusMap: Record<ChargeStatus, string> = {
  [ChargeStatus.Discharging]: '放电中',
  [ChargeStatus.Charging]: '充电中',
  [ChargeStatus.Full]: '已充满',
  [ChargeStatus.NotInstalled]: '未安装'
};

export function BatteryStatus({ battery }: BatteryStatusProps) {
  if (!battery) {
    return (
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4">电池状态</h3>
        <p className="text-gray-500 text-center py-8">
          等待数据...
        </p>
      </div>
    );
  }

  const getLevelColor = (level: number) => {
    if (level > 60) return 'bg-green-500';
    if (level > 20) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const isLowBattery = battery.leftLevel < 20 || battery.rightLevel < 20;

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">电池状态</h3>
        {isLowBattery && (
          <span className="px-3 py-1 rounded-full text-sm bg-red-100 text-red-700">
            电量低
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Left Battery */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">左侧电池</p>
          <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${getLevelColor(battery.leftLevel)}`}
              style={{ width: `${battery.leftLevel}%` }}
            />
          </div>
          <div className="flex justify-between text-xs">
            <span>{battery.leftLevel}%</span>
            <span>{battery.leftVoltage.toFixed(1)}V</span>
          </div>
        </div>

        {/* Right Battery */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">右侧电池</p>
          <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${getLevelColor(battery.rightLevel)}`}
              style={{ width: `${battery.rightLevel}%` }}
            />
          </div>
          <div className="flex justify-between text-xs">
            <span>{battery.rightLevel}%</span>
            <span>{battery.rightVoltage.toFixed(1)}V</span>
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-500 mt-4 text-center">
        {chargeStatusMap[battery.chargeStatus]}
      </p>
    </div>
  );
}
