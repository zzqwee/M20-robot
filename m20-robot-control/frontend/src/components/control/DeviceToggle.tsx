import { useState } from 'react';
import { api } from '../../services/api';

interface DeviceToggleProps {
  disabled?: boolean;
}

interface DeviceState {
  cameraFront: boolean;
  cameraBack: boolean;
  microphone: boolean;
  lidarFront: boolean;
  lidarBack: boolean;
  gps: boolean;
}

export function DeviceToggle({ disabled }: DeviceToggleProps) {
  const [devices, setDevices] = useState<DeviceState>({
    cameraFront: false,
    cameraBack: false,
    microphone: false,
    lidarFront: true,
    lidarBack: true,
    gps: true
  });
  const [loading, setLoading] = useState(false);

  const handleToggle = async (key: keyof DeviceState) => {
    if (disabled || loading) return;

    const newDevices = { ...devices, [key]: !devices[key] };
    setLoading(true);

    try {
      await api.sendDeviceControl({
        cameraFront: newDevices.cameraFront,
        cameraBack: newDevices.cameraBack,
        microphone: newDevices.microphone,
        lidarFront: newDevices.lidarFront,
        lidarBack: newDevices.lidarBack,
        gps: newDevices.gps
      });
      setDevices(newDevices);
    } catch (e) {
      console.error('Device control failed:', e);
    } finally {
      setLoading(false);
    }
  };

  const ToggleSwitch = ({
    label,
    enabled,
    onClick
  }: {
    label: string;
    enabled: boolean;
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`flex items-center justify-between w-full p-3 rounded-lg transition-all ${
        enabled ? 'bg-primary-light/20' : 'bg-gray-50'
      } ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <span className="font-medium">{label}</span>
      <div
        className={`w-12 h-6 rounded-full transition-all ${
          enabled ? 'bg-primary' : 'bg-gray-300'
        }`}
      >
        <div
          className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
            enabled ? 'translate-x-6' : 'translate-x-0.5'
          } mt-0.5`}
        />
      </div>
    </button>
  );

  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold mb-4">设备开关</h3>

      <div className="space-y-2">
        <ToggleSwitch
          label="前置摄像头"
          enabled={devices.cameraFront}
          onClick={() => handleToggle('cameraFront')}
        />
        <ToggleSwitch
          label="后置摄像头"
          enabled={devices.cameraBack}
          onClick={() => handleToggle('cameraBack')}
        />
        <ToggleSwitch
          label="麦克风"
          enabled={devices.microphone}
          onClick={() => handleToggle('microphone')}
        />
        <ToggleSwitch
          label="前激光雷达"
          enabled={devices.lidarFront}
          onClick={() => handleToggle('lidarFront')}
        />
        <ToggleSwitch
          label="后激光雷达"
          enabled={devices.lidarBack}
          onClick={() => handleToggle('lidarBack')}
        />
        <ToggleSwitch
          label="GPS定位"
          enabled={devices.gps}
          onClick={() => handleToggle('gps')}
        />
      </div>
    </div>
  );
}
