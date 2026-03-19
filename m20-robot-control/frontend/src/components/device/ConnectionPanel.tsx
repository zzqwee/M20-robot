import { useState } from 'react';
import { ConnectionStatus } from '../../types';

interface ConnectionPanelProps {
  ipAddress: string;
  status: ConnectionStatus;
  onConnect: (ip: string) => void;
  onDisconnect: () => void;
}

export function ConnectionPanel({ ipAddress, status, onConnect, onDisconnect }: ConnectionPanelProps) {
  const [inputIp, setInputIp] = useState(ipAddress);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!inputIp.trim()) {
      setError('请输入IP地址');
      return;
    }

    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipRegex.test(inputIp)) {
      setError('请输入有效的IP地址');
      return;
    }

    try {
      await onConnect(inputIp);
    } catch (err) {
      setError(err instanceof Error ? err.message : '连接失败');
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case ConnectionStatus.Connected:
        return <span className="status-badge status-connected">已连接</span>;
      case ConnectionStatus.Connecting:
        return <span className="status-badge status-connecting">连接中...</span>;
      case ConnectionStatus.Error:
        return <span className="status-badge status-error">连接失败</span>;
      default:
        return <span className="status-badge status-disconnected">未连接</span>;
    }
  };

  const isConnecting = status === ConnectionStatus.Connecting;

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">设备连接</h3>
        {getStatusBadge()}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            机器狗IP地址
          </label>
          <input
            type="text"
            value={inputIp}
            onChange={(e) => setInputIp(e.target.value)}
            placeholder="192.168.10.104"
            disabled={status === ConnectionStatus.Connected || isConnecting}
            className="input-field"
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        <div className="flex gap-3">
          {status === ConnectionStatus.Connected ? (
            <button
              type="button"
              onClick={onDisconnect}
              className="btn-secondary flex-1"
            >
              断开连接
            </button>
          ) : (
            <button
              type="submit"
              disabled={isConnecting}
              className="btn-primary flex-1 disabled:opacity-50"
            >
              {isConnecting ? '连接中...' : '连接'}
            </button>
          )}
        </div>
      </form>

      <p className="text-xs text-gray-500 mt-4">
        默认IP: 192.168.10.104
      </p>
    </div>
  );
}
