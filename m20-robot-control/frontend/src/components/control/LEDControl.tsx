import { useState } from 'react';
import { api } from '../../services/api';
import { LEDMode } from '../../types';

interface LEDControlProps {
  disabled?: boolean;
}

export function LEDControl({ disabled }: LEDControlProps) {
  const [frontMode, setFrontMode] = useState<LEDMode>(LEDMode.Off);
  const [backMode, setBackMode] = useState<LEDMode>(LEDMode.Off);
  const [loading, setLoading] = useState(false);

  const handleLEDChange = async (front: LEDMode, back: LEDMode) => {
    if (disabled || loading) return;

    setLoading(true);
    try {
      await api.sendLEDControl({ front, back });
      setFrontMode(front);
      setBackMode(back);
    } catch (e) {
      console.error('LED control failed:', e);
    } finally {
      setLoading(false);
    }
  };

  const modeButtons = [
    { mode: LEDMode.Off, label: '关闭', color: 'bg-gray-200' },
    { mode: LEDMode.On, label: '点亮', color: 'bg-yellow-400' },
    { mode: LEDMode.Blink, label: '闪烁', color: 'bg-yellow-300 animate-pulse' }
  ];

  const renderModeSelector = (
    label: string,
    currentMode: LEDMode,
    onChange: (mode: LEDMode) => void
  ) => (
    <div>
      <p className="text-sm font-medium text-gray-700 mb-2">{label}</p>
      <div className="flex gap-2">
        {modeButtons.map(({ mode, label, color }) => (
          <button
            key={mode}
            onClick={() => onChange(mode)}
            disabled={disabled || loading}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              currentMode === mode
                ? 'bg-primary text-white'
                : `bg-white ${color} text-gray-700 hover:opacity-80`
            } ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold mb-4">LED灯光控制</h3>

      <div className="space-y-4">
        {renderModeSelector('前灯', frontMode, (mode) => handleLEDChange(mode, backMode))}
        {renderModeSelector('后灯', backMode, (mode) => handleLEDChange(frontMode, mode))}
      </div>

      <p className="text-xs text-gray-500 mt-4">
        控制机器狗前后的LED灯
      </p>
    </div>
  );
}
