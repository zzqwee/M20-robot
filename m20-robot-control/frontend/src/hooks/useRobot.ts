import { useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { useRobotStore } from '../stores/robotStore';
import { ConnectionStatus, WSStatus } from '../types';

export function useRobot() {
  const {
    state,
    connect,
    disconnect,
    setSimulationMode,
    updateFromStatus
  } = useRobotStore();

  useEffect(() => {
    // Listen for status updates
    const handleStatus = (data: WSStatus | any) => {
      if (data.type === 'status') {
        updateFromStatus(data.data);
      }
    };

    api.on('*', handleStatus as any);

    return () => {
      api.off('*', handleStatus as any);
    };
  }, [updateFromStatus]);

  const initConnection = useCallback(async () => {
    try {
      await api.connect();
    } catch (e) {
      console.error('Failed to connect to WebSocket:', e);
    }
  }, []);

  const handleConnect = useCallback(async (ipAddress: string) => {
    await connect(ipAddress);
  }, [connect]);

  const handleDisconnect = useCallback(async () => {
    await disconnect();
  }, [disconnect]);

  const handleSimulation = useCallback(async (enabled: boolean) => {
    await setSimulationMode(enabled);
  }, [setSimulationMode]);

  return {
    connection: state.connection,
    deviceInfo: state.deviceInfo,
    battery: state.battery,
    sensors: state.sensors,
    led: state.led,
    simulationMode: state.simulationMode,
    isConnected: state.connection.status === ConnectionStatus.Connected,
    initConnection,
    handleConnect,
    handleDisconnect,
    handleSimulation
  };
}
