import { useState, useCallback } from 'react';
import {
  ConnectionStatus,
  DeviceConnection,
  DeviceInfo,
  BatteryStatus,
  SensorData,
  LEDStatus,
  LEDMode
} from '../types';
import { api } from '../services/api';

export interface RobotState {
  connection: DeviceConnection;
  deviceInfo: DeviceInfo | null;
  battery: BatteryStatus | null;
  sensors: SensorData | null;
  led: LEDStatus;
  simulationMode: boolean;
}

const initialState: RobotState = {
  connection: {
    ipAddress: '192.168.10.104',
    tcpPort: 30001,
    udpPort: 30000,
    status: ConnectionStatus.Disconnected
  },
  deviceInfo: null,
  battery: null,
  sensors: null,
  led: {
    front: LEDMode.Off,
    back: LEDMode.Off
  },
  simulationMode: false
};

export function useRobotStore() {
  const [state, setState] = useState<RobotState>(initialState);

  const connect = useCallback(async (ipAddress: string) => {
    setState((prev) => ({
      ...prev,
      connection: { ...prev.connection, ipAddress, status: ConnectionStatus.Connecting }
    }));

    try {
      await api.connectToRobot(ipAddress);
      setState((prev) => ({
        ...prev,
        connection: { ...prev.connection, status: ConnectionStatus.Connected }
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        connection: { ...prev.connection, status: ConnectionStatus.Error }
      }));
      throw error;
    }
  }, []);

  const disconnect = useCallback(async () => {
    try {
      await api.disconnectFromRobot();
    } finally {
      setState((prev) => ({
        ...prev,
        connection: { ...prev.connection, status: ConnectionStatus.Disconnected },
        deviceInfo: null,
        battery: null,
        sensors: null
      }));
    }
  }, []);

  const setSimulationMode = useCallback(async (enabled: boolean) => {
    await api.setSimulationMode(enabled);
    setState((prev) => ({ ...prev, simulationMode: enabled }));
  }, []);

  const updateFromStatus = useCallback((data: any) => {
    setState((prev) => {
      const newState = { ...prev };

      if (data.deviceInfo) {
        newState.deviceInfo = data.deviceInfo;
      }

      if (data.battery) {
        newState.battery = data.battery;
      }

      if (data.sensors) {
        newState.sensors = data.sensors;
      }

      if (data.led) {
        newState.led = data.led;
      }

      return newState;
    });
  }, []);

  const setConnectionStatus = useCallback((status: ConnectionStatus) => {
    setState((prev) => ({
      ...prev,
      connection: { ...prev.connection, status }
    }));
  }, []);

  return {
    state,
    connect,
    disconnect,
    setSimulationMode,
    updateFromStatus,
    setConnectionStatus
  };
}
