interface ElectronAPI {
  minimizeWindow: () => void;
  maximizeWindow: () => void;
  closeWindow: () => void;
  listPorts: () => Promise<any[]>;
  openPort: (path: string, baudRate: number) => Promise<string>;
  closePort: () => Promise<string>;
  writeSerial: (data: string) => Promise<string>;
  onSerialData: (callback: (data: any) => void) => () => void;
  onWindowStateChange: (callback: (state: string) => void) => () => void;
}

interface Window {
  electronAPI: ElectronAPI;
}
