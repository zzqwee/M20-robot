import { useState, useCallback } from 'react';
import { api } from '../../services/api';

interface MotionControlProps {
  disabled?: boolean;
}

export function MotionControl({ disabled }: MotionControlProps) {
  const [activeDirection, setActiveDirection] = useState<string | null>(null);

  const sendMotion = useCallback(async (x: number, y: number, yaw: number) => {
    try {
      await api.sendMotionCommand({ x, y, yaw });
    } catch (e) {
      console.error('Motion command failed:', e);
    }
  }, []);

  const handleDirection = (direction: string) => {
    setActiveDirection(direction);

    let x = 0, y = 0, yaw = 0;
    const speed = 0.5;

    switch (direction) {
      case 'forward':
        x = speed;
        break;
      case 'backward':
        x = -speed;
        break;
      case 'left':
        y = speed;
        break;
      case 'right':
        y = -speed;
        break;
      case 'turnLeft':
        yaw = speed;
        break;
      case 'turnRight':
        yaw = -speed;
        break;
    }

    sendMotion(x, y, yaw);

    // Reset after a short delay
    setTimeout(() => {
      setActiveDirection(null);
      sendMotion(0, 0, 0);
    }, 200);
  };

  const handleStop = () => {
    setActiveDirection(null);
    sendMotion(0, 0, 0);
  };

  const buttonClass = (isActive: boolean) =>
    `w-14 h-14 rounded-xl font-semibold transition-all duration-150 flex items-center justify-center ${
      isActive
        ? 'bg-primary text-white scale-95'
        : 'bg-white text-gray-700 hover:bg-primary-light hover:text-white'
    } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`;

  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold mb-4">运动控制</h3>

      <div className="flex flex-col items-center gap-4">
        {/* Direction pad */}
        <div className="grid grid-cols-3 gap-2">
          <div />
          <button
            onClick={() => handleDirection('forward')}
            disabled={disabled}
            className={buttonClass(activeDirection === 'forward')}
          >
            ↑
          </button>
          <div />

          <button
            onClick={() => handleDirection('left')}
            disabled={disabled}
            className={buttonClass(activeDirection === 'left')}
          >
            ←
          </button>
          <button
            onClick={handleStop}
            disabled={disabled}
            className={`w-14 h-14 rounded-xl font-bold transition-all ${
              activeDirection === null
                ? 'bg-red-500 text-white'
                : 'bg-white text-gray-700 hover:bg-red-100'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            ■
          </button>
          <button
            onClick={() => handleDirection('right')}
            disabled={disabled}
            className={buttonClass(activeDirection === 'right')}
          >
            →
          </button>

          <div />
          <button
            onClick={() => handleDirection('backward')}
            disabled={disabled}
            className={buttonClass(activeDirection === 'backward')}
          >
            ↓
          </button>
          <div />
        </div>

        {/* Rotation */}
        <div className="flex gap-4 mt-2">
          <button
            onClick={() => handleDirection('turnLeft')}
            disabled={disabled}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeDirection === 'turnLeft'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 hover:bg-primary-light hover:text-white'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            ↺ 左转
          </button>
          <button
            onClick={() => handleDirection('turnRight')}
            disabled={disabled}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeDirection === 'turnRight'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 hover:bg-primary-light hover:text-white'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            右转 ↻
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-2">
          点击方向按钮控制机器狗移动
        </p>
      </div>
    </div>
  );
}
