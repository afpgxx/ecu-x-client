import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Save, FolderOpen, Settings,
  Play, Pause, RefreshCw,
  X, Minus, Square, Plus, Globe, Copy, ChevronRight, ChevronDown,
  UploadCloud, DownloadCloud, RotateCcw
} from 'lucide-react';
import { VerticalBar } from './components/VerticalBar';
import { Gauge } from './components/Gauge';
import { ToggleSwitch } from './components/common/ToggleSwitch';
import { Logo } from './components/Logo';
import { EngineState, IdleLimitState } from './types';
import { useI18n } from './i18n/I18nContext';
import { Language } from './i18n';
import { APP_VERSION } from './version';
import CryptoJS from 'crypto-js';
import TabContentView from './components/TabContentView';

import { ControllerBlock } from './components/ControllerBlock';
import { 
  SECRET_KEY, 
  DWELL_DATA_POINTS, 
  ECT_COMP_2D_DATA
} from './constants';
import { 
  generateMapData, 
  MAP_DATA, 
  generateIgnitionData, 
  generateFuelAdvanceData, 
  generateAfrData, 
  generateEctIgnData, 
  generateMapCompData, 
  generateIdleLimitState 
} from './utils/dataGenerator';

const App: React.FC = () => {
  const { language, setLanguage, t } = useI18n();
  
  // 辅助函数：获取语言名称
  const getLangName = (lang: Language): string => {
    const key = `lang_${lang.replace('-', '_')}` as keyof typeof t;
    return t[key] as string || lang;
  };
  
  const MAIN_TABS = [
    t.tabs_fuelMap,
    t.tabs_fuelAdvance,
    t.tabs_ignitionAngle,
    t.tabs_dwellTime,
    t.tabs_afr,
    t.tabs_ectCompFuel,
    t.tabs_ectCompIgn,
    t.tabs_mapComp,
    t.tabs_idleLimit,
    t.tabs_otherOptions,
    t.tabs_parameters,
    t.tabs_settingsInfo,
  ];

  const [engineState, setEngineState] = useState<EngineState>({
    rpm: 0,
    tps: 0,
    map: 100,
    iat: 25,
    ect: 85,
    ign: 10,
    inj: 0,
    afr: 0,
    battery: 12.2
  });

  // Helper to create 4 banks of data
  const createBanks = <T,>(data: T): T[] => Array(4).fill(0).map(() => JSON.parse(JSON.stringify(data)));

  // 各个tab的独立数据状态
  const [fuelMapData, setFuelMapData] = useState<number[][][]>(createBanks(MAP_DATA)); // 燃油MAP (4 banks)
  const [fuelAdvanceData, setFuelAdvanceData] = useState<number[][][]>(createBanks(generateFuelAdvanceData())); // 燃油前馈 (4 banks)
  const [ignitionAngleData, setIgnitionAngleData] = useState<number[][][]>(createBanks(generateIgnitionData())); // 点火提前角 (4 banks)
  const [dwellTimeData, setDwellTimeData] = useState<number[][]>(createBanks(DWELL_DATA_POINTS)); // 驻留时间 (4 banks)
  const [afrTargetData, setAfrTargetData] = useState<number[][][]>(createBanks(generateAfrData())); // AFR目标 (4 banks)
  const [idleLimitData, setIdleLimitData] = useState<IdleLimitState[]>(createBanks(generateIdleLimitState())); // 怠速/限转 (4 banks)

  // Single bank tables (No buttons)
  const [ectCompFuelData, setEctCompFuelData] = useState<number[][]>(ECT_COMP_2D_DATA); // ECT燃油补偿
  const [ectCompIgnData, setEctCompIgnData] = useState<number[][]>(generateEctIgnData()); // ECT点火补偿
  const [mapCompData, setMapCompData] = useState<number[][]>(generateMapCompData()); // MAP补偿
  
  // 数据版本号，用于强制重置组件状态
  const [dataVersion, setDataVersion] = useState(0);

  // OtherOptions 数据状态
  const [otherOptionsParams, setOtherOptionsParams] = useState({
    throttleMin: 0, throttleMax: 0, idleMinInjCold: 0, idleMinInjHot: 0, idleAutoAngle: 0, idleAutoInj: 0,
    idleSteps: 0, fanTemp: 0, o2Work: 0, o2Delay: 0, o2Rpm: 0, o2Inj: 0,
    startEnrichRpm: 0, idleHoleMax: 0, idleHoleMin: 0, idleHoleMaxAdj: 0
  });
  
  const [otherOptionsGrids, setOtherOptionsGrids] = useState({
    tempIdle: { stepTime: Array(11).fill(0), injVe: Array(11).fill(0) },
    startEnrich: { delayed: Array(11).fill(0), injVeAdd: Array(11).fill(0), notStartedAdd: Array(11).fill(0) },
    iatComp: { injVeComp: Array(11).fill(0) },
    mapComp: { motorStep: Array(11).fill(0) },
    extAdj: { injAdjPct: Array(15).fill(0), ignAdjDeg: Array(15).fill(0) }
  });

  // ParametersView 数据状态
  const [parametersData, setParametersData] = useState({
    afrVoltage: Array(10).fill(0),
    iatVoltage: Array(11).fill(0),
    ectVoltage: Array(11).fill(0),
    pressureVoltage: Array(11).fill(0),
    tpsSettings: [0,0.5,3,6,12,20,30,40,50,60,70,80,90,100],
    rpmSettings: [500,1000,1500,2000,2500,3000,3500,4000,4500,5000,5500,6000,6500,7000,7500,8000,8500,9000,9500,10000,10500,11000,11500,12000,12500,13000,13500,14000,14500,15000]
  });

  // SettingsView 数据状态
  const [settingsData, setSettingsData] = useState({
    ecuSettings: {
      passwordEnabled: false,
      maxPowerAt100: false,
      ignoreThrottleVoltage: false,
      noMapProcessing: false,
      spare: false
    },
    afrControl: {
      enabled: true,
      useOemSensor: true
    },
    spareTable1: Array(6).fill(0),
    spareTable2: Array(9).fill(0)
  });
  
  const [isSimulating, setIsSimulating] = useState(false);
  const [isSweeping, setIsSweeping] = useState(false);
  const [ecuConnected, setEcuConnected] = useState(false);
  const [masterSwitch, setMasterSwitch] = useState(true);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const activeTab = MAIN_TABS[activeTabIndex] || MAIN_TABS[0];
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [isMaximized, setIsMaximized] = useState(false);
  
  // Serial Port State
  const [ports, setPorts] = useState<any[]>([]);
  const [selectedPort, setSelectedPort] = useState<string>('');

  // Controller values
  const [idleValue, setIdleValue] = useState(850);
  const [ignitionValue, setIgnitionValue] = useState(15.5);
  const [fuelValue, setFuelValue] = useState(2.5);
  const [modeValue, setModeValue] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isImporting = useRef(false);

  const simInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 2000);
  };

  const handleSaveMapData = () => {
    // 整合所有数据表
    const allData = {
      version: APP_VERSION,
      timestamp: new Date().toISOString(),
      maps: {
        fuelMap: fuelMapData,
        fuelAdvance: fuelAdvanceData,
        ignitionAngle: ignitionAngleData,
        dwellTime: dwellTimeData,
        afrTarget: afrTargetData,
        ectCompFuel: ectCompFuelData,
        ectCompIgn: ectCompIgnData,
        mapComp: mapCompData,
        idleLimit: idleLimitData,
      },
      controllers: {
        idleValue,
        ignitionValue,
        fuelValue,
        modeValue,
      },
      otherOptions: {
        params: otherOptionsParams,
        grids: otherOptionsGrids
      },
      parameters: parametersData,
      settings: settingsData
    };
    
    const json = JSON.stringify(allData);
    const encrypted = CryptoJS.AES.encrypt(json, SECRET_KEY).toString();
    const blob = new Blob([encrypted], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const filename = `ECU_Tuning_${new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)}.ECUDATA`;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportMapData = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isImporting.current) return;
    const file = e.target.files?.[0];
    if (!file) return;

    isImporting.current = true;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const encrypted = event.target?.result as string;
        const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);
        const data = JSON.parse(decrypted);
        
        // 辅助函数：确保数组中的值都是数字
        const ensureNumberArray = (arr: any[]): number[] => {
          return arr.map(v => {
            if (v === null || v === undefined) return 0;
            if (typeof v === 'string') {
              const parsed = parseFloat(v);
              return isNaN(parsed) ? 0 : parsed;
            }
            if (typeof v === 'number') {
              return isNaN(v) ? 0 : v;
            }
            return 0;
          });
        };
        
        const ensureNumber2DArray = (arr: any[][]): number[][] => {
          return arr.map(row => ensureNumberArray(row));
        };
        
        // 检查是否为新格式（包含所有数据）
        if (data.maps && typeof data.maps === 'object') {
          // 新格式：导入所有数据（创建深拷贝并确保数字类型）
          if (data.maps.fuelMap) {
            setFuelMapData(createBanks(ensureNumber2DArray(JSON.parse(JSON.stringify(data.maps.fuelMap)))));
          }
          if (data.maps.fuelAdvance) setFuelAdvanceData(createBanks(ensureNumber2DArray(JSON.parse(JSON.stringify(data.maps.fuelAdvance)))));
          if (data.maps.ignitionAngle) setIgnitionAngleData(createBanks(ensureNumber2DArray(JSON.parse(JSON.stringify(data.maps.ignitionAngle)))));
          if (data.maps.dwellTime) setDwellTimeData(createBanks(ensureNumberArray(JSON.parse(JSON.stringify(data.maps.dwellTime)))));
          if (data.maps.afrTarget) setAfrTargetData(createBanks(ensureNumber2DArray(JSON.parse(JSON.stringify(data.maps.afrTarget)))));
          if (data.maps.ectCompFuel) setEctCompFuelData(ensureNumber2DArray(JSON.parse(JSON.stringify(data.maps.ectCompFuel))));
          if (data.maps.ectCompIgn) setEctCompIgnData(ensureNumber2DArray(JSON.parse(JSON.stringify(data.maps.ectCompIgn))));
          if (data.maps.mapComp) setMapCompData(ensureNumber2DArray(JSON.parse(JSON.stringify(data.maps.mapComp))));
          if (data.maps.idleLimit) setIdleLimitData(createBanks(JSON.parse(JSON.stringify(data.maps.idleLimit))));
          
          // 导入控制器参数
          if (data.controllers) {
            if (data.controllers.idleValue !== undefined) setIdleValue(Number(data.controllers.idleValue));
            if (data.controllers.ignitionValue !== undefined) setIgnitionValue(Number(data.controllers.ignitionValue));
            if (data.controllers.fuelValue !== undefined) setFuelValue(Number(data.controllers.fuelValue));
            if (data.controllers.modeValue !== undefined) setModeValue(Number(data.controllers.modeValue));
          }
          
          // 导入OtherOptions数据（创建深拷贝并确保数字类型）
          if (data.otherOptions) {
            if (data.otherOptions.params) {
              const params = JSON.parse(JSON.stringify(data.otherOptions.params));
              // 确保所有参数都是数字
              Object.keys(params).forEach(key => {
                params[key] = Number(params[key]);
              });
              setOtherOptionsParams(params);
            }
            if (data.otherOptions.grids) {
              const grids = JSON.parse(JSON.stringify(data.otherOptions.grids));
              // 确保所有网格数据都是数字数组
              Object.keys(grids).forEach(gridKey => {
                Object.keys(grids[gridKey]).forEach(rowKey => {
                  grids[gridKey][rowKey] = ensureNumberArray(grids[gridKey][rowKey]);
                });
              });
              setOtherOptionsGrids(grids);
            }
          }
          
          // 导入Parameters数据（创建深拷贝并确保数字类型）
          if (data.parameters) {
            const params = JSON.parse(JSON.stringify(data.parameters));
            Object.keys(params).forEach(key => {
              if (Array.isArray(params[key])) {
                params[key] = ensureNumberArray(params[key]);
              }
            });
            setParametersData(params);
          }
          
          // 导入Settings数据（创建深拷贝并确保数字类型）
          if (data.settings) {
            const settings = JSON.parse(JSON.stringify(data.settings));
            if (settings.spareTable1) settings.spareTable1 = ensureNumberArray(settings.spareTable1);
            if (settings.spareTable2) settings.spareTable2 = ensureNumberArray(settings.spareTable2);
            setSettingsData(settings);
          }
          
          // 递增版本号以强制重置所有组件（必须在alert之前）
          setDataVersion(prev => {
            const newVersion = prev + 1;
            return newVersion;
          });
          
          // 使用setTimeout确保状态更新后再显示alert
          setTimeout(() => {
            showNotification(`成功导入数据\n版本: ${data.version || '未知'}\n时间: ${data.timestamp ? new Date(data.timestamp).toLocaleString('zh-CN') : '未知'}`, 'success');
          }, 100);
        } else if (Array.isArray(data)) {
          // 旧格式：只导入燃油MAP（创建深拷贝并确保数字类型）
          setFuelMapData(createBanks(ensureNumber2DArray(JSON.parse(JSON.stringify(data)))));
          setDataVersion(prev => prev + 1);
          
          setTimeout(() => {
            showNotification("成功导入燃油MAP数据（旧格式）", 'success');
          }, 100);
        } else {
          showNotification("文件格式不正确", 'error');
        }
      } catch (error) {
        console.error(error);
        showNotification("解密或解析失败，请检查文件是否正确", 'error');
      } finally {
        isImporting.current = false;
        // 重置文件输入，允许再次导入相同文件
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    };
    reader.onerror = () => {
      isImporting.current = false;
      showNotification("读取文件失败", 'error');
    };
    reader.readAsText(file);
  };

  // Helper to handle Electron window controls
  const handleWindowControl = (action: string) => {
    if (action === 'window-close') {
      if (!window.confirm(t.common_confirmExit)) {
        return;
      }
    }

    if ((window as any).require) {
      try {
        const { ipcRenderer } = (window as any).require('electron');
        ipcRenderer.send(action);
      } catch (error) {
        console.log('Electron IPC not available');
      }
    } else {
      console.log(`Simulated window action: ${action}`);
    }
  };

  // Function to refresh data with Sweep animation
  const handleRefresh = () => {
    // Prevent spamming
    if (isSweeping) return;
    setIsSweeping(true);
    // Stop simulation if running
    if (isSimulating) setIsSimulating(false);

    // 1. Reset to Zero first (归零)
    setEngineState({
      rpm: 0,
      tps: 0,
      map: 0,
      iat: 0,
      ect: 0,
      ign: 0,
      inj: 0,
      afr: 10, // AFR min is usually 10
      battery: 8
    });

    // 2. Sweep Max (Pointer goes to full scale) (扫描到整个量程)
    setTimeout(() => {
      setEngineState({
        rpm: 9000,
        tps: 100,
        map: 250,
        iat: 80,
        ect: 120,
        ign: 60,
        inj: 20,
        afr: 20,
        battery: 16
      });
    }, 400);

    // 3. Fall back to target Value (倒回具体值)
    setTimeout(() => {
      setEngineState({
        rpm: Math.floor(Math.random() * 8000) + 800,
        tps: Math.floor(Math.random() * 100),
        map: Math.floor(Math.random() * 200) + 20,
        iat: Math.floor(Math.random() * 50) + 20,
        ect: Math.floor(Math.random() * 60) + 60,
        ign: Math.floor(Math.random() * 30) + 5,
        inj: Number((Math.random() * 15).toFixed(1)),
        afr: Number((12 + Math.random() * 3).toFixed(1)),
        battery: Number((12 + Math.random() * 2).toFixed(1))
      });
      
      setFuelMapData(createBanks(generateMapData(true))); // Randomize map data
      setIsSweeping(false);
    }, 1000);
  };

  // Listen for window state changes from Electron
  useEffect(() => {
    if ((window as any).require) {
      try {
        const { ipcRenderer } = (window as any).require('electron');
        const handleWindowStateChange = (_event: any, state: string) => {
          setIsMaximized(state === 'maximized');
        };
        ipcRenderer.on('window-state-change', handleWindowStateChange);

        // Serial Data Listener
        const handleSerialData = (_event: any, dataString: string) => {
          try {
            const data = JSON.parse(dataString);
            // Update engine state from serial data if not simulating
            if (!isSimulating) {
              setEngineState(prev => ({ ...prev, ...data }));
            }
          } catch (e) {
            console.error('Failed to parse serial data:', e);
          }
        };
        ipcRenderer.on('serial-data', handleSerialData);

        // Get initial ports
        ipcRenderer.invoke('serial-list').then((portList: any[]) => {
          setPorts(portList);
        });

        return () => {
          ipcRenderer.removeListener('window-state-change', handleWindowStateChange);
          ipcRenderer.removeListener('serial-data', handleSerialData);
        };
      } catch (error) {
        console.error('Failed to setup IPC listener', error);
      }
    }
  }, [isSimulating]);

  // Connect Port
  const handleConnectPort = async (portPath: string) => {
    if (!portPath) return;
    try {
      const { ipcRenderer } = (window as any).require('electron');
      await ipcRenderer.invoke('serial-open', portPath, 115200);
      setSelectedPort(portPath);
      setEcuConnected(true);
      showNotification(`已连接到 ${portPath}`, 'success');
    } catch (err) {
      setEcuConnected(false);
      showNotification(`连接失败: ${err}`, 'error');
    }
  };

  // Send Current Data
  const handleSendCurrentData = async () => {
    try {
      const { ipcRenderer } = (window as any).require('electron');
      
      // Determine data to send based on active tab
      let dataToSend: any = null;
      const bankIndex = activeSubTable - 1;

      switch (activeTabIndex) {
        case 0: dataToSend = { type: 'FUEL_MAP', bank: activeSubTable, data: fuelMapData[bankIndex] }; break;
        case 1: dataToSend = { type: 'FUEL_ADVANCE', bank: activeSubTable, data: fuelAdvanceData[bankIndex] }; break;
        case 2: dataToSend = { type: 'IGNITION_ANGLE', bank: activeSubTable, data: ignitionAngleData[bankIndex] }; break;
        case 3: dataToSend = { type: 'DWELL_TIME', bank: activeSubTable, data: dwellTimeData[bankIndex] }; break;
        case 4: dataToSend = { type: 'AFR_TARGET', bank: activeSubTable, data: afrTargetData[bankIndex] }; break;
        case 5: dataToSend = { type: 'ECT_COMP_FUEL', data: ectCompFuelData }; break;
        case 6: dataToSend = { type: 'ECT_COMP_IGN', data: ectCompIgnData }; break;
        case 7: dataToSend = { type: 'MAP_COMP', data: mapCompData }; break;
        case 8: dataToSend = { type: 'IDLE_LIMIT', bank: activeSubTable, data: idleLimitData[bankIndex] }; break;
        case 9: dataToSend = { type: 'OTHER_OPTIONS', data: { params: otherOptionsParams, grids: otherOptionsGrids } }; break;
        case 10: dataToSend = { type: 'PARAMETERS', data: parametersData }; break;
        case 11: dataToSend = { type: 'SETTINGS', data: settingsData }; break;
      }

      if (dataToSend) {
        await ipcRenderer.invoke('serial-write', JSON.stringify(dataToSend));
        showNotification('数据发送成功', 'success');
      }
    } catch (err) {
      showNotification('发送失败，请检查连接', 'error');
    }
  };

  // Read Current Data
  const handleReadCurrentData = async () => {
    try {
      const { ipcRenderer } = (window as any).require('electron');
      const command = { 
        type: 'READ_CURRENT', 
        tabIndex: activeTabIndex, 
        subTable: activeSubTable 
      };
      await ipcRenderer.invoke('serial-write', JSON.stringify(command));
      showNotification('正在读取当前数据...', 'info');
    } catch (err) {
      showNotification('读取失败，请检查连接', 'error');
    }
  };

  // Read All Data
  const handleReadAllData = async () => {
    try {
      const { ipcRenderer } = (window as any).require('electron');
      await ipcRenderer.invoke('serial-write', JSON.stringify({ type: 'READ_ALL' }));
      showNotification('正在读取所有数据...', 'info');
    } catch (err) {
      showNotification('读取失败，请检查连接', 'error');
    }
  };

  // Send All Data
  const handleSendAllData = async () => {
    try {
      const { ipcRenderer } = (window as any).require('electron');
      await ipcRenderer.invoke('serial-write', JSON.stringify({ type: 'SEND_ALL_DATA' }));
      showNotification('正在发送所有数据...', 'info');
    } catch (err) {
      showNotification('发送失败，请检查连接', 'error');
    }
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';

      // Enter - Send Current (Only if not in input and not handled by child components like MapTable)
      if (e.key === 'Enter' && !isInput && !e.defaultPrevented) {
        e.preventDefault();
        handleSendCurrentData();
      }

      // Ctrl + E - Read Current
      if (e.ctrlKey && (e.key === 'e' || e.key === 'E')) {
        e.preventDefault();
        handleReadCurrentData();
      }

      // Ctrl + R - Read All
      if (e.ctrlKey && (e.key === 'r' || e.key === 'R')) {
        e.preventDefault();
        handleReadAllData();
      }

      // Ctrl + T - Send All
      if (e.ctrlKey && (e.key === 't' || e.key === 'T')) {
        e.preventDefault();
        handleSendAllData();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }); // Re-bind on every render to capture latest state/functions

  // Sim loop with Jitter
  useEffect(() => {
    if (isSimulating) {
      let time = 0;
      simInterval.current = setInterval(() => {
        time += 0.05;
        
        // 1. Update Engine State with realistic jitter
        setEngineState(() => {
          // Base sine wave movement
          const baseRpm = 4000 + Math.sin(time) * 3500;
          // Add significant random noise (jitter)
          const jitter = (Math.random() - 0.5) * 150; 
          
          const rpm = Math.max(800, Math.min(8500, baseRpm + jitter));
          const tps = Math.max(0, Math.min(100, (Math.sin(time) + 0.8) * 50 + (Math.random() - 0.5) * 5));
          const map = 20 + (tps * 0.8) + (Math.random() * 5); // Noisy MAP
          const targetAfr = tps > 80 ? 11.5 : tps > 40 ? 13.2 : 14.7;
          const afr = targetAfr + (Math.random() * 0.4 - 0.2); // Noisy AFR

          return {
            rpm,
            tps,
            map,
            iat: 30 + Math.sin(time * 0.1) * 2 + Math.random(),
            ect: 88 + Math.sin(time * 0.05) * 1 + Math.random() * 0.5,
            ign: 40 - (map * 0.2) + (rpm / 1000) + (Math.random() * 2 - 1), 
            inj: (map * rpm) / 50000 + (Math.random() * 0.5),
            afr,
            battery: 13.8 + (Math.random() * 0.4 - 0.2)
          };
        });

        // 2. Simulate Map Data Fluctuation
        // Optimization: Disable map data simulation to prevent UI freezing
        /*
        setFuelMapData(prevData => {
           return prevData.map((row, rIdx) => 
              row.map((_, cIdx) => {
                 const wave = Math.sin(time * 2 + rIdx + cIdx) * 0.05;
                 const noise = (Math.random() - 0.5) * 0.2; // Increased noise
                 const baseVal = MAP_DATA[rIdx][cIdx];
                 return baseVal + wave + noise;
              })
           );
        });
        */

      }, 100); // 10Hz update (Reduced from 20Hz to prevent freezing)
    } else {
      if (simInterval.current) clearInterval(simInterval.current);
    }
    return () => { if (simInterval.current) clearInterval(simInterval.current); };
  }, [isSimulating]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setActiveMenu(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);



  // --- View Renderer ---
  // Memoized editing change handler to avoid creating new function each render
  const handleEditingChange = useCallback((cell: {row:number;col:number;value:number} | null) => {
    setEditingCell(cell);
    // 保存最近一次非空编辑单元格，便于工具栏按钮在输入失焦时仍能使用
    if (cell) lastEditingRef.current = cell;
  }, []);

  // 保存最近一次编辑单元格（防止输入框失焦后 editingCell 变为 null 导致工具栏无法作用）
  const lastEditingRef = useRef<{row:number;col:number;value:number} | null>(null);

  const makeBankSetter = <T,>(setter: React.Dispatch<React.SetStateAction<T[]>>, index: number) => {
    return (valueOrFn: any) => {
      setter(prev => {
        const newBanks = [...prev];
        const currentBank = newBanks[index];
        const newValue = typeof valueOrFn === 'function' ? valueOrFn(currentBank) : valueOrFn;
        newBanks[index] = newValue;
        return newBanks;
      });
    };
  };

  const renderContent = () => {
    const bankIndex = activeSubTable - 1;
    const isTableDisabled = masterSwitch;

    return (
      <div className="relative w-full h-full flex flex-col">
        {isTableDisabled && (
          <div className="absolute inset-0 bg-[#16181c]/80 z-50 flex items-center justify-center backdrop-blur-[1px]">
             <div className="bg-[#23272e] border border-gray-600 px-6 py-4 rounded-lg shadow-2xl text-center transform scale-110">
                <div className="text-orange-500 font-bold text-lg mb-1 flex items-center justify-center gap-2">
                  <Settings size={20} />
                  <span>{t.controllers_enabled}</span>
                </div>
                <p className="text-gray-400 text-xs">{t.controllers_tableDisabledMsg || "Table editing is disabled while controllers are active"}</p>
             </div>
          </div>
        )}
        <div className={`flex-1 flex flex-col overflow-hidden ${isTableDisabled ? 'pointer-events-none opacity-40 grayscale-[0.5]' : ''}`}>
          <TabContentView
            key={dataVersion}
            activeTab={activeTab}
            t={t}
            engineState={engineState}
            fuelMapData={fuelMapData[bankIndex]}
            setFuelMapData={makeBankSetter(setFuelMapData, bankIndex)}
            fuelAdvanceData={fuelAdvanceData[bankIndex]}
            setFuelAdvanceData={makeBankSetter(setFuelAdvanceData, bankIndex)}
            ignitionAngleData={ignitionAngleData[bankIndex]}
            setIgnitionAngleData={makeBankSetter(setIgnitionAngleData, bankIndex)}
            dwellTimeData={dwellTimeData[bankIndex]}
            setDwellTimeData={makeBankSetter(setDwellTimeData, bankIndex)}
            afrTargetData={afrTargetData[bankIndex]}
            setAfrTargetData={makeBankSetter(setAfrTargetData, bankIndex)}
            ectCompFuelData={ectCompFuelData}
            setEctCompFuelData={setEctCompFuelData}
            ectCompIgnData={ectCompIgnData}
            setEctCompIgnData={setEctCompIgnData}
            mapCompData={mapCompData}
            setMapCompData={setMapCompData}
            idleLimitData={idleLimitData[bankIndex]}
            setIdleLimitData={makeBankSetter(setIdleLimitData, bankIndex)}
            otherOptionsParams={otherOptionsParams}
            setOtherOptionsParams={setOtherOptionsParams}
            otherOptionsGrids={otherOptionsGrids}
            setOtherOptionsGrids={setOtherOptionsGrids}
            parametersData={parametersData}
            setParametersData={setParametersData}
            settingsData={settingsData}
            setSettingsData={setSettingsData}
            onEditingChange={handleEditingChange}
            onForceEditing={forceEditing}
            suppressBlur={suppressBlur}
            recentToolbarUpdatesRef={recentToolbarUpdatesRef}
          />
        </div>
      </div>
    );
  };

  const [activeTable, setActiveTable] = useState<1 | 2>(1);
  const [activeSubTable, setActiveSubTable] = useState<1 | 2 | 3 | 4>(1);
  const [editingCell, setEditingCell] = useState<{row:number;col:number;value:number} | null>(null);
  const [forceEditing, setForceEditing] = useState<{row:number;col:number} | null>(null);
  const [suppressBlur, setSuppressBlur] = useState<boolean>(false);
  const recentToolbarUpdatesRef = useRef<Map<string, number>>(new Map());
  const [editValue, setEditValue] = useState<string>('1.0');
  const committedEditValueRef = useRef<string>('1.0');
  const [editMode, setEditMode] = useState<'percentage'|'raw'>('percentage');

  // 当切换 tab 时，清除所有编辑状态
  useEffect(() => {
    setEditingCell(null);
    lastEditingRef.current = null;
    setForceEditing(null);
    setSuppressBlur(false);
    recentToolbarUpdatesRef.current.clear();
  }, [activeTabIndex]);

  const renderTabControls = () => {
    const mapTabs = [
      t.tabs_fuelMap,
      t.tabs_fuelAdvance,
      t.tabs_ignitionAngle,
      t.tabs_dwellTime,
      t.tabs_afr,
      t.tabs_ectCompFuel,
      t.tabs_ectCompIgn,
      t.tabs_mapComp,
      t.tabs_idleLimit,
      t.tabs_otherOptions,
      t.tabs_parameters,
      t.tabs_settingsInfo,
    ];

    if (mapTabs.includes(activeTab)) {
      const isMapTable = activeTabIndex <= 8; // Indices 0-7 are map tables, 8 is IdleLimit

      const IDLE_LIMIT_SCALAR_FIELDS = [
        'idleRpmCold', 'idleReturnCold',
        'idleRpmHot', 'idleReturnHot',
        'enterExitSensitivity', 'accelEnrichPercent',
        'maxRpm', 'vvtOpenRpm'
      ];

      return (
        <div className="flex items-center w-full py-0.5 pointer-events-none">
          {isMapTable && (
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center gap-3 pointer-events-auto">
                <div className="flex items-center justify-center bg-black/30 rounded p-0.5 border border-gray-700">
                <button className="w-6 h-5 flex items-center justify-center hover:bg-gray-700 text-gray-400 rounded-sm text-xs" onMouseDown={() => {
                    const target = editingCell || lastEditingRef.current;
                    if (!target) { return; }
                    // 读取当前数据表中的实时值（基于 activeTabIndex）
                    let cur = 0;
                    const bankIndex = activeSubTable - 1;
                    switch (activeTabIndex) {
                      case 0:
                        cur = fuelMapData[bankIndex][target.row][target.col];
                        break;
                      case 1:
                        cur = fuelAdvanceData[bankIndex][target.row][target.col];
                        break;
                      case 2:
                        cur = ignitionAngleData[bankIndex][target.row][target.col];
                        break;
                      case 4:
                        cur = afrTargetData[bankIndex][target.row][target.col];
                        break;
                      case 5:
                        cur = ectCompFuelData[target.row][target.col];
                        break;
                      case 6:
                        cur = ectCompIgnData[target.row][target.col];
                        break;
                      case 7:
                        cur = mapCompData[target.row][target.col];
                        break;
                      case 3:
                        cur = dwellTimeData[bankIndex][target.col];
                        break;
                      case 8: // IdleLimit
                        const idleData = idleLimitData[bankIndex];
                        if (target.row === 0) {
                          // @ts-ignore
                          cur = idleData[IDLE_LIMIT_SCALAR_FIELDS[target.col]] as number;
                        } else if (target.row === 1) {
                          cur = idleData.autoClutchData[target.col];
                        } else if (target.row === 2) {
                          cur = idleData.spareData[target.col];
                        }
                        break;
                      default:
                        cur = 0;
                        break;
                    }
                    let next = cur;
                    const val = parseFloat(editValue) || 0;
                    if (editMode === 'percentage') {
                      next = cur - cur * (val / 100);
                    } else {
                      next = cur - val;
                    }
                    // 根据当前激活 tabIndex 更新对应的数据集（支持 2D 和 1D）
                    const updateCellValue = (row: number, col: number, value: number) => {
                      switch (activeTabIndex) {
                        case 0: // fuelMap
                          setFuelMapData(prev => { 
                            const newBanks = [...prev];
                            const newBank = newBanks[bankIndex].map(r => r.slice());
                            newBank[row][col] = value;
                            newBanks[bankIndex] = newBank;
                            return newBanks;
                          });
                          break;
                        case 1: // fuelAdvance
                          setFuelAdvanceData(prev => { 
                            const newBanks = [...prev];
                            const newBank = newBanks[bankIndex].map(r => r.slice());
                            newBank[row][col] = value;
                            newBanks[bankIndex] = newBank;
                            return newBanks;
                          });
                          break;
                        case 2: // ignitionAngle
                          setIgnitionAngleData(prev => { 
                            const newBanks = [...prev];
                            const newBank = newBanks[bankIndex].map(r => r.slice());
                            newBank[row][col] = value;
                            newBanks[bankIndex] = newBank;
                            return newBanks;
                          });
                          break;
                        case 4: // afr
                          setAfrTargetData(prev => { 
                            const newBanks = [...prev];
                            const newBank = newBanks[bankIndex].map(r => r.slice());
                            newBank[row][col] = value;
                            newBanks[bankIndex] = newBank;
                            return newBanks;
                          });
                          break;
                        case 5: // ectCompFuel
                          setEctCompFuelData(prev => { const d = prev.map(r => r.slice()); d[row][col] = value; return d; });
                          break;
                        case 6: // ectCompIgn
                          setEctCompIgnData(prev => { const d = prev.map(r => r.slice()); d[row][col] = value; return d; });
                          break;
                        case 7: // mapComp
                        case 8: // IdleLimit
                          setIdleLimitData(prev => {
                            const newBanks = [...prev];
                            const newData = { ...newBanks[bankIndex] };
                            if (row === 0) {
                              // @ts-ignore
                              newData[IDLE_LIMIT_SCALAR_FIELDS[col]] = value;
                            } else if (row === 1) {
                              const newArr = [...newData.autoClutchData];
                              newArr[col] = value;
                              newData.autoClutchData = newArr;
                            } else if (row === 2) {
                              const newArr = [...newData.spareData];
                              newArr[col] = value;
                              newData.spareData = newArr;
                            }
                            newBanks[bankIndex] = newData;
                            return newBanks;
                          });
                          break;
                          setMapCompData(prev => { const d = prev.map(r => r.slice()); d[row][col] = value; return d; });
                          break;
                        case 3: // dwellTime (1D)
                          setDwellTimeData(prev => { 
                            const newBanks = [...prev];
                            const newBank = newBanks[bankIndex].slice();
                            newBank[col] = value;
                            newBanks[bankIndex] = newBank;
                            return newBanks;
                          });
                          break;
                        default:
                          break;
                      }
                    };

                    updateCellValue(target.row, target.col, next);
                    recentToolbarUpdatesRef.current.set(`${target.row},${target.col}`, Date.now());
                    // 在执行修改时，抑制 child 的 blur 写入，然后恢复编辑
                    setSuppressBlur(true);
                    setForceEditing({ row: target.row, col: target.col });
                    setTimeout(() => { setForceEditing(null); setSuppressBlur(false); }, 200);
                  }}><Minus size={12}/></button>
                <input 
                  className="w-12 h-5 bg-transparent text-center text-xs font-mono text-white border-none focus:ring-0" 
                  value={editValue} 
                  onChange={(e) => setEditValue(e.target.value)}
                  onFocus={() => {
                    committedEditValueRef.current = editValue;
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const val = parseFloat(editValue);
                      if (!isNaN(val)) {
                        committedEditValueRef.current = editValue;
                        e.currentTarget.blur();
                      }
                    } else if (e.key === 'Escape') {
                      setEditValue(committedEditValueRef.current);
                      e.currentTarget.blur();
                    }
                  }}
                  onBlur={() => {
                    setEditValue(committedEditValueRef.current);
                  }}
                />
                <button className="w-6 h-5 flex items-center justify-center hover:bg-gray-700 text-gray-400 rounded-sm text-xs" onMouseDown={() => {
                  const target = editingCell || lastEditingRef.current;
                  if (!target) { return; }
                  // 从当前数据读取最新值（基于 activeTabIndex）
                  let cur = 0;
                  const bankIndex = activeSubTable - 1;
                  switch (activeTabIndex) {
                    case 0:
                      cur = fuelMapData[bankIndex][target.row][target.col];
                      break;
                    case 1:
                      cur = fuelAdvanceData[bankIndex][target.row][target.col];
                      break;
                    case 2:
                      cur = ignitionAngleData[bankIndex][target.row][target.col];
                      break;
                    case 4:
                      cur = afrTargetData[bankIndex][target.row][target.col];
                      break;
                    case 5:
                      cur = ectCompFuelData[target.row][target.col];
                      break;
                    case 6:
                      cur = ectCompIgnData[target.row][target.col];
                      break;
                    case 7:
                      cur = mapCompData[target.row][target.col];
                      break;
                    case 3:
                      cur = dwellTimeData[bankIndex][target.col];
                      break;
                    default:
                      cur = 0;
                      break;
                  }
                  let next = cur;
                  const val = parseFloat(editValue) || 0;
                  if (editMode === 'percentage') {
                    next = cur + cur * (val / 100);
                  } else {
                    next = cur + val;
                  }
                  // 根据当前激活 tab 更新对应的数据集（支持 2D 和 1D）
                  const updateCellValue = (row: number, col: number, value: number) => {
                    switch (activeTabIndex) {
                      case 0: // fuelMap
                        setFuelMapData(prev => { 
                          const newBanks = [...prev];
                          const newBank = newBanks[bankIndex].map(r => r.slice());
                          newBank[row][col] = value;
                          newBanks[bankIndex] = newBank;
                          return newBanks;
                        });
                        break;
                      case 1: // fuelAdvance
                        setFuelAdvanceData(prev => { 
                          const newBanks = [...prev];
                          const newBank = newBanks[bankIndex].map(r => r.slice());
                          newBank[row][col] = value;
                          newBanks[bankIndex] = newBank;
                          return newBanks;
                        });
                        break;
                      case 2: // ignitionAngle
                        setIgnitionAngleData(prev => { 
                          const newBanks = [...prev];
                          const newBank = newBanks[bankIndex].map(r => r.slice());
                          newBank[row][col] = value;
                          newBanks[bankIndex] = newBank;
                          return newBanks;
                        });
                        break;
                      case 3: // dwellTime (1D)
                        setDwellTimeData(prev => { 
                          const newBanks = [...prev];
                          const newBank = newBanks[bankIndex].slice();
                          newBank[col] = value;
                          newBanks[bankIndex] = newBank;
                          return newBanks;
                        });
                        break;
                      case 4: // afr
                        setAfrTargetData(prev => { 
                          const newBanks = [...prev];
                          const newBank = newBanks[bankIndex].map(r => r.slice());
                          newBank[row][col] = value;
                          newBanks[bankIndex] = newBank;
                          return newBanks;
                        });
                        break;
                      case 5: // ectCompFuel
                        setEctCompFuelData(prev => { const d = prev.map(r => r.slice()); d[row][col] = value; return d; });
                        break;
                      case 6: // ectCompIgn
                        setEctCompIgnData(prev => { const d = prev.map(r => r.slice()); d[row][col] = value; return d; });
                        break;
                      case 7: // mapComp
                        setMapCompData(prev => { const d = prev.map(r => r.slice()); d[row][col] = value; return d; });
                        break;
                      default:
                        break;
                    }
                  };

                  updateCellValue(target.row, target.col, next);
                  recentToolbarUpdatesRef.current.set(`${target.row},${target.col}`, Date.now());
                  setSuppressBlur(true);
                  setForceEditing({ row: target.row, col: target.col });
                  setTimeout(() => { setForceEditing(null); setSuppressBlur(false); }, 200);
                }}><Plus size={12}/></button>
            </div>
            <div className="h-4 w-[1px] bg-gray-700"></div>
            <select className="bg-[#2d323a] text-xs text-gray-300 border border-gray-600 rounded px-2 py-0.5 outline-none h-6" value={editMode === 'percentage' ? t.mapTable_percentage : t.mapTable_rawValue} onChange={(e) => setEditMode(e.target.value === t.mapTable_percentage ? 'percentage' : 'raw')}>
              <option>{t.mapTable_percentage}</option>
              <option>{t.mapTable_rawValue}</option>
            </select>
          </div>
          )}
          <div className="flex gap-2 ml-auto shrink-0 pointer-events-auto">
            <button 
              onClick={() => setActiveTable(1)}
              className={`px-3 py-0.5 text-[10px] font-bold rounded-full border transition-colors ${
                activeTable === 1 
                  ? 'bg-red-600 text-white border-red-600' 
                  : 'bg-gray-800 text-gray-500 border-gray-600 hover:bg-gray-700'
              }`}
            >
              {t.mapTable_table1Active}
            </button>
            <button 
              onClick={() => setActiveTable(2)}
              className={`px-3 py-0.5 text-[10px] font-bold rounded-full border transition-colors ${
                activeTable === 2 
                  ? 'bg-red-600 text-white border-red-600' 
                  : 'bg-gray-800 text-gray-500 border-gray-600 hover:bg-gray-700'
              }`}
            >
              {t.mapTable_table2}
            </button>
            <div className="flex gap-1 ml-2">
              {(isMapTable || activeTabIndex === 8) && ![5, 6, 7].includes(activeTabIndex) && [1, 2, 3, 4].map((num) => (
                <button
                  key={num}
                  onClick={() => setActiveSubTable(num as 1 | 2 | 3 | 4)}
                  className={`px-2 py-0.5 border text-[10px] font-bold rounded transition-colors ${
                    activeSubTable === num
                      ? 'bg-blue-600 text-white border-blue-500'
                      : 'bg-gray-800 text-gray-400 border-gray-600 hover:bg-gray-700'
                  }`}
                >
                  No.{num}
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#1a1d21] text-gray-300 font-sans overflow-hidden">
      
      {/* --- Title Bar --- */}
      <div className="h-8 bg-[#111316] flex items-center justify-between px-4 border-b border-gray-800 select-none shrink-0" style={{ WebkitAppRegion: 'drag' } as any}>
        <div className="flex items-center gap-3">
          <Logo size={16} className="text-orange-500" />
          <span className="text-xs font-medium text-gray-400 tracking-wide">{t.titleBar_appName} {APP_VERSION}</span>
        </div>
        <div className="flex items-center gap-6" style={{ WebkitAppRegion: 'no-drag' } as any}>
          <div className={`flex items-center gap-2 text-[10px] font-bold uppercase ${ecuConnected ? 'text-emerald-500' : 'text-red-500'}`}>
             <div className={`w-2 h-2 rounded-full ${ecuConnected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
             {ecuConnected ? `${t.titleBar_connected}: USB-CAN` : t.titleBar_disconnected}
          </div>
          <div className="flex items-center gap-4 text-gray-500">
            {/* Language Selector */}
            <div className="relative">
              <button 
                onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                className="flex items-center gap-1 hover:text-white cursor-pointer text-[10px] font-medium px-2 py-0.5 rounded hover:bg-gray-700"
              >
                <Globe size={12} />
                <span>{getLangName(language)} / Language</span>
              </button>
              {showLanguageMenu && (
                <div className="absolute top-full right-0 mt-1 bg-[#2d323a] border border-gray-600 rounded shadow-lg z-50 min-w-[140px]">
                  {(['zh-CN', 'zh-TW', 'en', 'ja', 'th', 'ko', 'ru', 'de', 'fr'] as Language[]).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => { setLanguage(lang); setShowLanguageMenu(false); }}
                      className={`w-full text-left px-3 py-1.5 text-xs hover:bg-gray-700 transition-colors ${
                        language === lang ? 'bg-blue-600 text-white' : 'text-gray-300'
                      }`}
                    >
                      {getLangName(lang)}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Settings size={14} className="hover:text-white cursor-pointer" />
            <Minus size={16} className="hover:text-white cursor-pointer hover:bg-gray-700 rounded" onClick={() => handleWindowControl('window-minimize')} />
            {isMaximized ? (
              <Copy size={14} className="hover:text-white cursor-pointer hover:bg-gray-700 rounded" style={{ transform: 'scaleX(-1)' }} onClick={() => handleWindowControl('window-maximize')} />
            ) : (
              <Square size={14} className="hover:text-white cursor-pointer hover:bg-gray-700 rounded" onClick={() => handleWindowControl('window-maximize')} />
            )}
            <X size={16} className="hover:text-red-500 cursor-pointer hover:bg-red-900/50 rounded" onClick={() => handleWindowControl('window-close')} />
          </div>
        </div>
      </div>

      {/* --- Menu Bar --- */}
      <div className="h-8 bg-[#1e2126] flex items-center px-2 gap-1 shrink-0 border-b border-black">
        {/* 文件菜单，带下拉 */}
        {[
          { key: 'file', label: t.menu_file },
          { key: 'data', label: t.menu_data },
          { key: 'selectPort', label: t.menu_selectPort },
          { key: 'learnTps', label: t.menu_learnTps },
          { key: 'copyDataTo', label: t.menu_copyDataTo },
          { key: 'testInjector', label: t.menu_testInjector },
          { key: 'afr', label: t.menu_afr },
          { key: 'help', label: t.menu_help },
        ].map((item) => (
          <div key={item.key} className="relative">
            <button
              className={`px-3 py-1 text-[11px] rounded-sm transition-colors ${
                activeMenu === item.key 
                  ? 'bg-[#2d323a] text-white' 
                  : 'hover:bg-[#2d323a] text-gray-400 hover:text-white'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                setActiveMenu(activeMenu === item.key ? null : item.key);
              }}
            >
              {item.label}
            </button>
            {activeMenu === item.key && (
              <div 
                className={`absolute mt-1 left-0 bg-[#2d323a] border border-gray-600 rounded shadow-lg z-50 py-1 ${
                  item.key === 'selectPort' ? 'min-w-[112px]' : 
                  item.key === 'copyDataTo' ? 'min-w-[168px]' : 
                  'min-w-[140px]'
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                {item.key === 'file' && (
                  <>
                    <button className="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-700 transition-colors text-gray-300 hover:text-white" onClick={() => { handleImportButtonClick(); setActiveMenu(null); }}>{t.common_open}</button>
                    <button className="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-700 transition-colors text-gray-300 hover:text-white" onClick={() => { handleSaveMapData(); setActiveMenu(null); }}>{t.common_save}</button>
                    <div className="relative group">
                      <button className="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-700 transition-colors text-gray-300 hover:text-white flex items-center justify-between">
                        <span>{t.menu_importToCurrent}</span>
                        <ChevronRight size={12} />
                      </button>
                      <div className="absolute left-full top-0 ml-0.5 bg-[#2d323a] border border-gray-600 rounded shadow-lg min-w-[160px] py-1 hidden group-hover:block">
                        {/* 只有前5个tab (0-4) 有多张子表 (No.1-No.4) */}
                        {activeTabIndex <= 4 ? (
                          [1, 2, 3, 4].map(num => (
                            <button 
                              key={num}
                              className="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-700 transition-colors text-gray-300 hover:text-white"
                              onClick={() => {
                                setActiveMenu(null);
                              }}
                            >
                              {activeTab} No.{num}
                            </button>
                          ))
                        ) : (
                          <button 
                            className="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-700 transition-colors text-gray-300 hover:text-white"
                            onClick={() => {
                              setActiveMenu(null);
                            }}
                          >
                            {activeTab}
                          </button>
                        )}
                      </div>
                    </div>
                  </>
                )}
                {item.key === 'data' && (
                  <>
                    <button className="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-700 transition-colors text-gray-300 hover:text-white" onClick={() => { handleReadCurrentData(); setActiveMenu(null); }}>{t.data_readCurrent}</button>
                    <button className="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-700 transition-colors text-gray-300 hover:text-white" onClick={() => { handleSendCurrentData(); setActiveMenu(null); }}>{t.data_sendCurrent}</button>
                    <button className="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-700 transition-colors text-gray-300 hover:text-white" onClick={() => { handleReadAllData(); setActiveMenu(null); }}>{t.data_readAll}</button>
                    <button className="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-700 transition-colors text-gray-300 hover:text-white" onClick={() => { handleSendAllData(); setActiveMenu(null); }}>{t.data_sendAll}</button>
                    <button className="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-700 transition-colors text-gray-300 hover:text-white" onClick={() => setActiveMenu(null)}>{t.data_restoreFactory}</button>
                    <div className="h-[1px] bg-gray-600 my-1 mx-2"></div>
                    <button className="w-full flex justify-between items-center px-3 py-1.5 text-xs hover:bg-gray-700 transition-colors text-gray-300 hover:text-white" onClick={() => setActiveMenu(null)}>
                      <span>{t.data_add1}</span>
                      <span className="text-gray-500">A</span>
                    </button>
                    <button className="w-full flex justify-between items-center px-3 py-1.5 text-xs hover:bg-gray-700 transition-colors text-gray-300 hover:text-white" onClick={() => setActiveMenu(null)}>
                      <span>{t.data_sub1}</span>
                      <span className="text-gray-500">Z</span>
                    </button>
                    <button className="w-full flex justify-between items-center px-3 py-1.5 text-xs hover:bg-gray-700 transition-colors text-gray-300 hover:text-white" onClick={() => setActiveMenu(null)}>
                      <span>{t.data_add01}</span>
                      <span className="text-gray-500">S</span>
                    </button>
                    <button className="w-full flex justify-between items-center px-3 py-1.5 text-xs hover:bg-gray-700 transition-colors text-gray-300 hover:text-white" onClick={() => setActiveMenu(null)}>
                      <span>{t.data_sub01}</span>
                      <span className="text-gray-500">X</span>
                    </button>
                    <button className="w-full flex justify-between items-center px-3 py-1.5 text-xs hover:bg-gray-700 transition-colors text-gray-300 hover:text-white" onClick={() => setActiveMenu(null)}>
                      <span>{t.data_add001}</span>
                      <span className="text-gray-500">D</span>
                    </button>
                    <button className="w-full flex justify-between items-center px-3 py-1.5 text-xs hover:bg-gray-700 transition-colors text-gray-300 hover:text-white" onClick={() => setActiveMenu(null)}>
                      <span>{t.data_sub001}</span>
                      <span className="text-gray-500">C</span>
                    </button>
                    <div className="h-[1px] bg-gray-600 my-1 mx-2"></div>
                    <button className="w-full flex justify-between items-center px-3 py-1.5 text-xs hover:bg-gray-700 transition-colors text-gray-300 hover:text-white" onClick={() => setActiveMenu(null)}>
                      <span>{t.data_autoSmooth}</span>
                      <span className="text-gray-500">I</span>
                    </button>
                  </>
                )}
                {item.key === 'copyDataTo' && (
                  <>
                    {[1, 2, 3, 4].map(num => (
                      <button 
                        key={num}
                        disabled={activeSubTable === num}
                        className={`w-full text-left px-3 py-1.5 text-xs transition-colors ${
                          activeSubTable === num 
                            ? 'text-gray-600 cursor-not-allowed' 
                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        }`}
                        onClick={() => {
                          setActiveMenu(null);
                        }}
                      >
                        No.{num}
                      </button>
                    ))}
                    <div className="h-[1px] bg-gray-600 my-1 mx-2"></div>
                    <button 
                      className="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-700 transition-colors text-gray-300 hover:text-white"
                      onClick={() => {
                        setActiveMenu(null);
                      }}
                    >
                      {t.menu_copyToAll}
                    </button>
                  </>
                )}
                {item.key === 'afr' && (
                  <>
                    <button className="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-700 transition-colors text-gray-300 hover:text-white" onClick={() => setActiveMenu(null)}>{t.menu_afr_record}</button>
                    <button className="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-700 transition-colors text-gray-300 hover:text-white" onClick={() => setActiveMenu(null)}>{t.menu_afr_adjust}</button>
                  </>
                )}
                {item.key === 'help' && (
                  <>
                    <button className="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-700 transition-colors text-gray-300 hover:text-white" onClick={() => setActiveMenu(null)}>{t.menu_help_login}</button>
                    <button className="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-700 transition-colors text-gray-300 hover:text-white" onClick={() => setActiveMenu(null)}>{t.menu_help_setColor}</button>
                    <button className="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-700 transition-colors text-gray-300 hover:text-white" onClick={() => setActiveMenu(null)}>{t.menu_help_manual}</button>
                    <button className="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-700 transition-colors text-gray-300 hover:text-white" onClick={() => setActiveMenu(null)}>{t.menu_help_operation}</button>
                    <button className="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-700 transition-colors text-gray-300 hover:text-white" onClick={() => { setShowAbout(true); setActiveMenu(null); }}>{t.menu_help_about}</button>
                  </>
                )}
                {item.key === 'selectPort' && (
                  <div className="p-1.5 min-w-[112px]">
                     <div className="relative">
                        <select 
                          className="w-full bg-[#16181c] text-gray-300 text-xs border border-gray-600 rounded pl-2 pr-7 py-1 appearance-none outline-none focus:border-blue-500 cursor-pointer"
                          onClick={(e) => e.stopPropagation()}
                          value={selectedPort}
                          onChange={(e) => handleConnectPort(e.target.value)}
                        >
                           <option value="">{t.menu_selectPort}</option>
                           {ports.map((p) => (
                             <option key={p.path} value={p.path}>
                               {p.path}
                             </option>
                           ))}
                        </select>
                        <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                     </div>
                  </div>
                )}
                {item.key !== 'file' && item.key !== 'data' && item.key !== 'help' && item.key !== 'selectPort' && item.key !== 'copyDataTo' && item.key !== 'afr' && (
                  <div className="px-3 py-1.5 text-xs text-gray-500 italic">No options</div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* --- Toolbar --- */}
      <div className="h-12 bg-[#23272e] flex items-center px-4 gap-3 shrink-0 border-b border-gray-800 shadow-md">
         <div className="flex items-center gap-1 pr-3 border-r border-gray-700">
          <button className="p-1.5 hover:bg-gray-700 rounded text-gray-400 hover:text-blue-400" title={t.common_open}
            onClick={handleImportButtonClick}
          ><FolderOpen size={18} /></button>
          <button className="p-1.5 hover:bg-gray-700 rounded text-gray-400 hover:text-blue-400" title={t.common_save}
            onClick={handleSaveMapData}
          ><Save size={18} /></button>
          <input
            type="file"
            accept=".ECUDATA"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleImportMapData}
          />
         </div>
         <div className="flex items-center gap-1 pr-3 border-r border-gray-700">
            <button className="flex items-center gap-1.5 px-2 py-1 hover:bg-gray-700 rounded text-gray-300 hover:text-white transition-colors" onClick={handleReadCurrentData}>
               <UploadCloud size={18} className="text-yellow-300" />
               <span className="text-xs font-medium">{t.data_readCurrent}</span>
            </button>
            <button className="flex items-center gap-1.5 px-2 py-1 hover:bg-gray-700 rounded text-gray-300 hover:text-white transition-colors" onClick={handleSendCurrentData}>
               <DownloadCloud size={18} className="text-green-400" />
               <span className="text-xs font-medium">{t.data_sendCurrent}</span>
            </button>
            <button className="flex items-center gap-1.5 px-2 py-1 hover:bg-gray-700 rounded text-gray-300 hover:text-white transition-colors" onClick={handleReadAllData}>
               <UploadCloud size={18} className="text-pink-300" />
               <span className="text-xs font-medium">{t.data_readAll}</span>
            </button>
            <button className="flex items-center gap-1.5 px-2 py-1 hover:bg-gray-700 rounded text-gray-300 hover:text-white transition-colors" onClick={handleSendAllData}>
               <DownloadCloud size={18} className="text-red-400" />
               <span className="text-xs font-medium">{t.data_sendAll}</span>
            </button>
            <button className="flex items-center gap-1.5 px-2 py-1 hover:bg-gray-700 rounded text-gray-300 hover:text-white transition-colors">
               <RotateCcw size={18} className="text-orange-400" />
               <span className="text-xs font-medium">{t.common_reset}</span>
            </button>
         </div>
         <div className="flex items-center gap-2">
            <button 
               onClick={handleRefresh}
               className="flex items-center gap-2 px-4 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-all border bg-gray-700 border-gray-600 hover:bg-gray-600 hover:text-white text-gray-300"
            >
               <RefreshCw size={14} className={isSweeping ? 'animate-spin' : ''} />
               {t.common_refresh}
            </button>
            <button 
               onClick={() => setIsSimulating(!isSimulating)}
               className={`flex items-center gap-2 px-4 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-all border
               ${isSimulating ? 'bg-orange-600 border-orange-500 text-white shadow-lg shadow-orange-900/50' : 'bg-gray-700 border-gray-600 hover:bg-gray-600'}`}
            >
               {isSimulating ? <Pause size={14} /> : <Play size={14} />}
               {isSimulating ? t.toolbar_stopSimulation : t.toolbar_startSimulation}
            </button>
         </div>
      </div>

      {/* --- Main Workspace --- */}
      <div className="flex-1 p-2 flex flex-col gap-0 overflow-hidden">
         
         {/* Top Dashboard Row (40% Height) */}
         <div className="flex gap-2 shrink-0 mb-2" style={{ minHeight: '180px', maxHeight: '25vh' }}>
            
            {/* 1. Sensor Bars Panel */}
            <div className="min-w-[200px] bg-[#16181c] rounded-lg border border-gray-700/50 p-3 shadow-xl flex flex-col" style={{ flex: '0.25 1 0%' }}>
               <div className="text-[10px] text-gray-500 font-bold mb-2 uppercase flex justify-between">
                  <span>{t.sensors_title}</span>
                  <span className="text-blue-500">{t.sensors_realtime}</span>
               </div>
               <div className="flex-1 grid grid-cols-6 gap-1 sm:gap-2">
                  <VerticalBar label={t.sensors_ect} value={engineState.ect} unit="°C" min={-14} max={126} warningThreshold={110} color="bg-yellow-500" />
                  <VerticalBar label={t.sensors_iat} value={engineState.iat} unit="°C" min={-14} max={56} warningThreshold={60} color="bg-sky-400" />
                  <VerticalBar label={t.sensors_map} value={engineState.map} unit="kPa" min={0} max={120} color="bg-emerald-500" />
                  <VerticalBar label={t.sensors_ign} value={engineState.ign} unit="°" min={-10} max={60} color="bg-indigo-500" />
                  <VerticalBar label={t.sensors_inj} value={engineState.inj} unit="ms" min={0} max={16} color="bg-rose-500" />
                  <VerticalBar label={t.sensors_battery} value={engineState.battery} unit="V" min={0} max={16} color="bg-amber-500" />
               </div>
            </div>

            {/* 2. Digital Controllers (Center) */}
            <div className="bg-[#16181c] rounded-lg border border-gray-700/50 p-2 shadow-xl flex flex-col gap-2 overflow-hidden" style={{ flex: '0.35 1 0%' }}>
               <div className="flex items-center justify-between bg-[#111316] p-2 rounded border border-gray-800 shrink-0">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t.controllers_title}</span>
                  <ToggleSwitch
                    checked={masterSwitch}
                    onChange={setMasterSwitch}
                    size="md"
                  />
                  <button 
                    onClick={() => {
                      setIdleValue(850);
                      setIgnitionValue(15.5);
                      setFuelValue(2.5);
                      setModeValue(0);
                    }}
                    className="ml-2 px-2 py-1 flex items-center gap-1 rounded hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
                    title={t.common_reset}
                  >
                    <RotateCcw size={15} />
                    <span className="text-[15px] font-bold">{t.common_reset}</span>
                  </button>
                  <span className={`text-[10px] font-bold ${masterSwitch ? 'text-white' : 'text-gray-600'}`}>
                    {masterSwitch ? t.controllers_enabled : t.controllers_disabled}
                  </span>
               </div>

               <div className="flex-1 grid grid-cols-[1.3fr_1fr_1fr_0.7fr] grid-rows-1 gap-2 min-h-0">
                  <ControllerBlock 
                    label={t.controllers_idleControl} 
                    value={idleValue} 
                    onChange={setIdleValue}
                    unit="RPM" 
                    step={10}
                    decimals={0}
                    min={500}
                    max={2000}
                    disabled={!masterSwitch}
                  />
                  <ControllerBlock 
                    label={t.controllers_ignitionControl} 
                    value={ignitionValue} 
                    onChange={setIgnitionValue}
                    unit="DEG" 
                    step={0.5}
                    decimals={1}
                    min={0}
                    max={60}
                    disabled={!masterSwitch}
                  />
                  <ControllerBlock 
                    label={t.controllers_fuelControl} 
                    value={fuelValue} 
                    onChange={setFuelValue}
                    unit="%" 
                    step={0.5}
                    decimals={1}
                    min={-50}
                    max={50}
                    disabled={!masterSwitch}
                  />
                  <ControllerBlock 
                    label={t.controllers_modeSelect} 
                    value={modeValue} 
                    onChange={setModeValue}
                    step={1}
                    decimals={0}
                    min={0}
                    max={5}
                    disabled={!masterSwitch}
                  />
               </div>
            </div>

            {/* 3. Analog Gauges (Right) */}
            <div className="bg-[#16181c] rounded-lg border border-gray-700/50 p-2 shadow-xl flex items-center justify-evenly relative overflow-hidden" style={{ flex: '0.4 1 0%' }}>
               <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40 pointer-events-none"></div>
               <div className="w-[32%] h-full" style={{ maxHeight: 'min(220px, 25vh)' }}>
                  <Gauge label={t.sensors_rpm} value={engineState.rpm} min={0} max={15000} unit="RPM" variant="rpm" />
               </div>
               <div className="w-[32%] h-full" style={{ maxHeight: 'min(220px, 25vh)' }}>
                  <Gauge label={t.sensors_tps} value={engineState.tps} min={0} max={100} unit="%" variant="tps" />
               </div>
               <div className="w-[32%] h-full" style={{ maxHeight: 'min(220px, 25vh)' }}>
                  <Gauge label={t.sensors_afr} value={engineState.afr} min={9} max={18} unit="AFR" variant="afr" />
               </div>
            </div>

         </div>

         {/* Middle Tab Bar (Updated) */}
         <div className="flex flex-wrap gap-1 px-1 shrink-0 z-10 relative items-center">
            {MAIN_TABS.map((tab, index) => (
               <button 
                  key={tab} 
                  onClick={() => setActiveTabIndex(index)}
                  className={`px-6 py-1.5 rounded-t-md text-xs font-bold border-t border-x transition-colors whitespace-nowrap
                  ${activeTab === tab 
                     ? 'bg-blue-600 border-blue-500 text-white' 
                     : 'bg-[#23272e] border-gray-700 text-gray-400 hover:bg-[#2d323a]'}`}
               >
                  {tab}
               </button>
            ))}
            
            {/* Tab Controls (Moved from TabContentView) */}
            <div className="flex-1 flex justify-end min-w-[400px]">
               {renderTabControls()}
            </div>
         </div>

         {/* Bottom Content Area (Switches between Views) */}
         <div className="flex-1 bg-[#16181c] rounded-b-lg rounded-tr-lg border border-gray-700 flex flex-col overflow-hidden shadow-2xl -mt-[1px] z-0 relative">
             {renderContent()}
         </div>

         {/* Status Bar */}
         <div className="h-6 bg-[#111316] border-t border-gray-800 flex items-center justify-between px-4 text-[10px] font-mono text-gray-500 select-none shrink-0 mt-2">
             <div className="flex gap-6">
                <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> {t.statusBar_ecuSync}</span>
                <span>{t.statusBar_throttle}: <span className="text-gray-300">{engineState.tps.toFixed(1)}%</span></span>
                <span>{t.statusBar_pressure}: <span className="text-gray-300">{engineState.map.toFixed(0)}kPa</span></span>
                <span>{t.statusBar_coolantTemp}: <span className="text-gray-300">{engineState.ect.toFixed(2)}°C</span></span>
             </div>
             <div className="flex gap-4">
                <span>{t.statusBar_usbDriver}</span>
                <span>{t.statusBar_baudRate}</span>
             </div>
         </div>

      </div>

      {/* 关于弹窗 */}
      {showAbout && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={() => setShowAbout(false)}>
          <div className="bg-[#2d323a] rounded-lg border border-gray-600 shadow-2xl p-8 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex flex-col items-center gap-6">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-700 rounded-2xl flex items-center justify-center shadow-lg">
                <Logo size={48} className="text-white" />
              </div>
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-2">{t.titleBar_appName}</h2>
                <p className="text-gray-400 text-sm">{APP_VERSION}</p>
              </div>
              <div className="w-full border-t border-gray-700 pt-4">
                <p className="text-gray-400 text-xs text-center leading-relaxed">
                  {t.about_description}
                </p>
              </div>
              <button 
                onClick={() => setShowAbout(false)}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition-colors"
              >
                {t.common_close}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-10 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded shadow-lg z-[100] flex items-center gap-3 border animate-in fade-in slide-in-from-top-4 duration-200
          ${notification.type === 'success' ? 'bg-emerald-900/90 border-emerald-500 text-emerald-100' : notification.type === 'info' ? 'bg-blue-900/90 border-blue-500 text-blue-100' : 'bg-red-900/90 border-red-500 text-red-100'}`}
        >
          <div className={`w-2 h-2 rounded-full ${notification.type === 'success' ? 'bg-emerald-400' : notification.type === 'info' ? 'bg-blue-400' : 'bg-red-400'}`}></div>
          <span className="text-sm font-medium whitespace-pre-line">{notification.message}</span>
        </div>
      )}
    </div>
  );
};

export default App;