import React, { useState, useEffect, useRef } from 'react';
import { 
  Save, FolderOpen, Settings,
  Cpu, Play, Pause, RefreshCw,
  Download, X, Minus, Square, Plus, Globe, Copy
} from 'lucide-react';
import { VerticalBar } from './components/VerticalBar';
import { Gauge } from './components/Gauge';
import { ToggleSwitch } from './components/common/ToggleSwitch';
import { Logo } from './components/Logo';
import { EngineState } from './types';
import { useI18n } from './i18n/I18nContext';
import { Language } from './i18n';
import { APP_VERSION } from './version';
import CryptoJS from 'crypto-js';
import TabContentView from './components/TabContentView';

// --- Encryption Key for Data Protection ---
const SECRET_KEY = "MySuperSecretKey123!"; // Change this to a strong key in production

// --- Data Generation Constants ---
const RPM_POINTS = [800, 1200, 1600, 2000, 2400, 2800, 3200, 3600, 4000, 4400, 4800, 5200, 5600, 6000, 6400, 6800, 7200, 7600, 8000];
const LOAD_POINTS = [100, 90, 80, 70, 60, 50, 40, 30, 20, 10, 0];

// --- Dwell Time Data (RPM vs Time) ---
const DWELL_RPM_POINTS = [
  800, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000, 
  5500, 6000, 6500, 7000, 7500, 8000, 8500, 9000, 9500, 10000, 
  10500, 11000, 11500, 12000, 12500, 13000, 13500, 14000, 14500, 15000
];
// Fill with 8.81 as per screenshot UI hint
const DWELL_DATA_POINTS = new Array(DWELL_RPM_POINTS.length).fill(8.81);

// --- ECT Compensation Data (2D: RPM x Temp) ---
// Y-Axis: Temp from 126 down to -14
const ECT_COMP_TEMP_POINTS = [126, 112, 98, 84, 70, 56, 42, 28, 14, 0, -14];
// X-Axis: Re-use DWELL_RPM_POINTS (800-15000)
const ECT_COMP_RPM_POINTS = DWELL_RPM_POINTS;

// Generate 2D data filled with 12.8
const ECT_COMP_2D_DATA: number[][] = [];
for (let i = 0; i < ECT_COMP_TEMP_POINTS.length; i++) {
  const row = new Array(ECT_COMP_RPM_POINTS.length).fill(12.8);
  ECT_COMP_2D_DATA.push(row);
}

// Generate a realistic-looking VE (Volumetric Efficiency) Map
const generateMapData = (randomize = false) => {
  const data: number[][] = [];
  for (let i = 0; i < LOAD_POINTS.length; i++) {
    const row: number[] = [];
    const loadFactor = LOAD_POINTS[i] / 100; // 1.0 to 0.0
    
    for (let j = 0; j < RPM_POINTS.length; j++) {
      const rpmFactor = RPM_POINTS[j] / 8000; // 0.1 to 1.0
      let ve = 5.0;
      ve += loadFactor * 4.0;
      const rpmCurve = Math.sin(rpmFactor * Math.PI);
      ve += rpmCurve * 2.5;
      ve += (j * 0.05) - (i * 0.02);
      
      if (randomize) {
         ve += (Math.random() * 2) - 1; // Add random noise
      }
      
      row.push(Math.max(2, Number(ve.toFixed(2))));
    }
    data.push(row);
  }
  return data;
};

const MAP_DATA = generateMapData();

// 生成点火角度表数据（示例值）
const generateIgnitionData = () => {
  const data: number[][] = [];
  for (let i = 0; i < LOAD_POINTS.length; i++) {
    const row: number[] = [];
    for (let j = 0; j < RPM_POINTS.length; j++) {
      const baseAngle = 10 + (j * 0.5) - (i * 0.3);
      row.push(Number(Math.max(5, Math.min(40, baseAngle)).toFixed(1)));
    }
    data.push(row);
  }
  return data;
};

// 生成燃油前馈数据（示例值）
const generateFuelAdvanceData = () => {
  const data: number[][] = [];
  for (let i = 0; i < LOAD_POINTS.length; i++) {
    const row: number[] = [];
    for (let j = 0; j < RPM_POINTS.length; j++) {
      row.push(Number((1.0 + Math.random() * 0.5).toFixed(2)));
    }
    data.push(row);
  }
  return data;
};

// 生成AFR目标表数据
const generateAfrData = () => {
  const data: number[][] = [];
  for (let i = 0; i < LOAD_POINTS.length; i++) {
    const row: number[] = [];
    const loadFactor = LOAD_POINTS[i] / 100;
    for (let j = 0; j < RPM_POINTS.length; j++) {
      const afr = loadFactor > 0.7 ? 12.5 : loadFactor > 0.4 ? 13.8 : 14.7;
      row.push(Number((afr + (Math.random() - 0.5) * 0.3).toFixed(1)));
    }
    data.push(row);
  }
  return data;
};

// 生成ECT点火补偿数据
const generateEctIgnData = () => {
  const data: number[][] = [];
  for (let i = 0; i < ECT_COMP_TEMP_POINTS.length; i++) {
    const row = new Array(ECT_COMP_RPM_POINTS.length).fill(0);
    for (let j = 0; j < row.length; j++) {
      row[j] = Number((5 - i * 0.5 + (Math.random() - 0.5)).toFixed(1));
    }
    data.push(row);
  }
  return data;
};

// 生成MAP补偿数据
const generateMapCompData = () => {
  const data: number[][] = [];
  for (let i = 0; i < LOAD_POINTS.length; i++) {
    const row: number[] = [];
    for (let j = 0; j < RPM_POINTS.length; j++) {
      row.push(Number((1.0 + (Math.random() - 0.5) * 0.2).toFixed(2)));
    }
    data.push(row);
  }
  return data;
};

// 生成怠速/限转数据（1D表格）
const IDLE_LIMIT_RPM_POINTS = [0, 500, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000];
const generateIdleLimitData = () => {
  return IDLE_LIMIT_RPM_POINTS.map((_, i) => Number((850 + i * 50).toFixed(0)));
};

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
    afr: 14.7,
    battery: 12.2
  });

  // 各个tab的独立数据状态
  const [fuelMapData, setFuelMapData] = useState<number[][]>(MAP_DATA); // 燃油MAP
  const [fuelAdvanceData, setFuelAdvanceData] = useState<number[][]>(generateFuelAdvanceData()); // 燃油前馈
  const [ignitionAngleData, setIgnitionAngleData] = useState<number[][]>(generateIgnitionData()); // 点火提前角
  const [dwellTimeData, setDwellTimeData] = useState<number[]>(DWELL_DATA_POINTS); // 驻留时间
  const [afrTargetData, setAfrTargetData] = useState<number[][]>(generateAfrData()); // AFR目标
  const [ectCompFuelData, setEctCompFuelData] = useState<number[][]>(ECT_COMP_2D_DATA); // ECT燃油补偿
  const [ectCompIgnData, setEctCompIgnData] = useState<number[][]>(generateEctIgnData()); // ECT点火补偿
  const [mapCompData, setMapCompData] = useState<number[][]>(generateMapCompData()); // MAP补偿
  const [idleLimitData, setIdleLimitData] = useState<number[]>(generateIdleLimitData()); // 怠速/限转
  
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
  const [ecuConnected] = useState(true);
  const [masterSwitch, setMasterSwitch] = useState(true);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const activeTab = MAIN_TABS[activeTabIndex] || MAIN_TABS[0];
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showFileMenu, setShowFileMenu] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isMaximized, setIsMaximized] = useState(false);
  
  // Controller values
  const [idleValue, setIdleValue] = useState(850);
  const [ignitionValue, setIgnitionValue] = useState(15.5);
  const [fuelValue, setFuelValue] = useState(2.5);
  const [modeValue, setModeValue] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isImporting = useRef(false);

  const simInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
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
            setFuelMapData(ensureNumber2DArray(JSON.parse(JSON.stringify(data.maps.fuelMap))));
          }
          if (data.maps.fuelAdvance) setFuelAdvanceData(ensureNumber2DArray(JSON.parse(JSON.stringify(data.maps.fuelAdvance))));
          if (data.maps.ignitionAngle) setIgnitionAngleData(ensureNumber2DArray(JSON.parse(JSON.stringify(data.maps.ignitionAngle))));
          if (data.maps.dwellTime) setDwellTimeData(ensureNumberArray(JSON.parse(JSON.stringify(data.maps.dwellTime))));
          if (data.maps.afrTarget) setAfrTargetData(ensureNumber2DArray(JSON.parse(JSON.stringify(data.maps.afrTarget))));
          if (data.maps.ectCompFuel) setEctCompFuelData(ensureNumber2DArray(JSON.parse(JSON.stringify(data.maps.ectCompFuel))));
          if (data.maps.ectCompIgn) setEctCompIgnData(ensureNumber2DArray(JSON.parse(JSON.stringify(data.maps.ectCompIgn))));
          if (data.maps.mapComp) setMapCompData(ensureNumber2DArray(JSON.parse(JSON.stringify(data.maps.mapComp))));
          if (data.maps.idleLimit) setIdleLimitData(ensureNumberArray(JSON.parse(JSON.stringify(data.maps.idleLimit))));
          
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
          setFuelMapData(ensureNumber2DArray(JSON.parse(JSON.stringify(data))));
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
      
      setFuelMapData(generateMapData(true)); // Randomize map data
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
        return () => {
          ipcRenderer.removeListener('window-state-change', handleWindowStateChange);
        };
      } catch (error) {
        console.error('Failed to setup IPC listener', error);
      }
    }
  }, []);

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

      }, 50); // 20Hz update
    } else {
      if (simInterval.current) clearInterval(simInterval.current);
    }
    return () => { if (simInterval.current) clearInterval(simInterval.current); };
  }, [isSimulating]);

  const ControllerBlock = ({ 
    label, 
    value, 
    onChange, 
    unit = '', 
    step = 1, 
    decimals = 0,
    min,
    max
  }: { 
    label: string; 
    value: number; 
    onChange: (val: number) => void;
    unit?: string; 
    step?: number;
    decimals?: number;
    min?: number;
    max?: number;
  }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [inputValue, setInputValue] = useState(value.toFixed(decimals));
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      setInputValue(value.toFixed(decimals));
    }, [value, decimals]);

    const handleIncrement = () => {
      const newVal = value + step;
      if (max === undefined || newVal <= max) {
        onChange(Number(newVal.toFixed(decimals)));
      }
    };

    const handleDecrement = () => {
      const newVal = value - step;
      if (min === undefined || newVal >= min) {
        onChange(Number(newVal.toFixed(decimals)));
      }
    };

    const handleWheel = (e: React.WheelEvent) => {
      e.preventDefault();
      if (e.deltaY < 0) {
        handleIncrement();
      } else {
        handleDecrement();
      }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
    };

    const handleInputBlur = () => {
      const parsed = parseFloat(inputValue);
      if (!isNaN(parsed)) {
        let newVal = parsed;
        if (min !== undefined) newVal = Math.max(min, newVal);
        if (max !== undefined) newVal = Math.min(max, newVal);
        onChange(Number(newVal.toFixed(decimals)));
      } else {
        setInputValue(value.toFixed(decimals));
      }
      setIsEditing(false);
    };

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        handleInputBlur();
      } else if (e.key === 'Escape') {
        setInputValue(value.toFixed(decimals));
        setIsEditing(false);
      }
    };

    return (
      <div 
        className="bg-[#0d0f11] rounded border border-gray-700 relative p-1.5 flex flex-col overflow-hidden"
        onWheel={handleWheel}
      >
        <div className="flex justify-between items-center mb-1 absolute top-1 right-1 left-1 px-1 z-10">
          <button 
            onClick={handleIncrement}
            className="w-4 h-4 rounded-full bg-[#252830] hover:bg-[#30343d] flex items-center justify-center text-gray-400 shadow active:scale-95 transition-transform border border-gray-600"
          >
            <Plus size={8} />
          </button>
          <button 
            onClick={handleDecrement}
            className="w-4 h-4 rounded-full bg-[#252830] hover:bg-[#30343d] flex items-center justify-center text-gray-400 shadow active:scale-95 transition-transform border border-gray-600"
          >
            <Minus size={8} />
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center pt-2">
          <div className="flex items-baseline translate-y-1">
            {isEditing ? (
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                onKeyDown={handleInputKeyDown}
                className="font-digital text-gray-200 tracking-tighter bg-transparent border-none outline-none text-center"
                style={{ fontSize: 'clamp(1.5rem, 3vw, 1.875rem)', width: 'clamp(6rem, 12vw, 8rem)' }}
                autoFocus
              />
            ) : (
              <span 
                  className="font-digital text-gray-200 tracking-tighter drop-shadow-[0_0_5px_rgba(255,255,255,0.1)] cursor-pointer"
                  style={{ fontSize: 'clamp(1.5rem, 3vw, 1.875rem)' }}
                  onClick={() => setIsEditing(true)}
              >
                {unit === '%' ? (value >= 0 ? '+' : '') : ''}{value.toFixed(decimals)}
              </span>
            )}
            {unit && !isEditing && <span className="text-gray-500 text-[9px] font-bold ml-1">{unit}</span>}
          </div>
        </div>
        <div className="text-center text-[9px] text-gray-500 font-bold uppercase tracking-widest border-t border-gray-800 pt-0.5 truncate">{label}</div>
      </div>
    );
  };

  // --- View Renderer ---
  const renderContent = () => {
    return (
      <TabContentView
        key={dataVersion}
        activeTab={activeTab}
        t={t}
        engineState={engineState}
        fuelMapData={fuelMapData}
        setFuelMapData={setFuelMapData}
        fuelAdvanceData={fuelAdvanceData}
        setFuelAdvanceData={setFuelAdvanceData}
        ignitionAngleData={ignitionAngleData}
        setIgnitionAngleData={setIgnitionAngleData}
        dwellTimeData={dwellTimeData}
        setDwellTimeData={setDwellTimeData}
        afrTargetData={afrTargetData}
        setAfrTargetData={setAfrTargetData}
        ectCompFuelData={ectCompFuelData}
        setEctCompFuelData={setEctCompFuelData}
        ectCompIgnData={ectCompIgnData}
        setEctCompIgnData={setEctCompIgnData}
        mapCompData={mapCompData}
        setMapCompData={setMapCompData}
        idleLimitData={idleLimitData}
        setIdleLimitData={setIdleLimitData}
        otherOptionsParams={otherOptionsParams}
        setOtherOptionsParams={setOtherOptionsParams}
        otherOptionsGrids={otherOptionsGrids}
        setOtherOptionsGrids={setOtherOptionsGrids}
        parametersData={parametersData}
        setParametersData={setParametersData}
        settingsData={settingsData}
        setSettingsData={setSettingsData}
      />
    );
  };

  const renderTabControls = () => {
    if (activeTab === t.tabs_fuelMap) {
      return (
        <div className="flex items-center gap-3 ml-auto py-0.5">
          <div className="flex items-center justify-center bg-black/30 rounded p-0.5 border border-gray-700">
              <button className="w-6 h-5 flex items-center justify-center hover:bg-gray-700 text-gray-400 rounded-sm text-xs"><Minus size={12}/></button>
              <input className="w-12 h-5 bg-transparent text-center text-xs font-mono text-white border-none focus:ring-0" defaultValue="1.0" />
              <button className="w-6 h-5 flex items-center justify-center hover:bg-gray-700 text-gray-400 rounded-sm text-xs"><Plus size={12}/></button>
          </div>
          <div className="h-4 w-[1px] bg-gray-700"></div>
          <select className="bg-[#2d323a] text-xs text-gray-300 border border-gray-600 rounded px-2 py-0.5 outline-none">
              <option>{t.mapTable_percentage}</option>
              <option>{t.mapTable_rawValue}</option>
              <option>{t.mapTable_lambda}</option>
          </select>
          <div className="flex gap-2 ml-2">
            <button className="px-3 py-0.5 bg-red-600 text-white text-[10px] font-bold rounded-full">{t.mapTable_table1Active}</button>
            <button className="px-3 py-0.5 bg-gray-800 text-gray-500 border border-gray-600 text-[10px] font-bold rounded-full">{t.mapTable_table2}</button>
          </div>
        </div>
      );
    }
    if (activeTab === t.tabs_ectCompFuel) {
       return (
        <div className="flex items-center gap-3 ml-auto py-0.5">
          <div className="flex items-center justify-center bg-black/30 rounded p-0.5 border border-gray-700">
              <button className="w-6 h-5 flex items-center justify-center hover:bg-gray-700 text-gray-400 rounded-sm text-xs"><Minus size={12}/></button>
              <input className="w-12 h-5 bg-transparent text-center text-xs font-mono text-white border-none focus:ring-0" defaultValue="0.1" />
              <button className="w-6 h-5 flex items-center justify-center hover:bg-gray-700 text-gray-400 rounded-sm text-xs"><Plus size={12}/></button>
          </div>
          <div className="h-4 w-[1px] bg-gray-700"></div>
          <select className="bg-[#2d323a] text-xs text-gray-300 border border-gray-600 rounded px-2 py-0.5 outline-none">
             <option>{t.mapTable_unit}</option>
          </select>
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
        <div
          className="relative"
          onMouseEnter={() => setShowFileMenu(true)}
          onMouseLeave={() => setShowFileMenu(false)}
        >
          <button
            className="px-3 py-1 text-[11px] hover:bg-[#2d323a] text-gray-400 hover:text-white rounded-sm transition-colors"
            onClick={() => setShowFileMenu(v => !v)}
          >
            {t.menu_file}
          </button>
          {showFileMenu && (
            <div className="absolute mt-1 bg-[#2d323a] border border-gray-600 rounded shadow-lg z-50 min-w-[140px]">
              <button className="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-700 transition-colors" onClick={handleImportButtonClick}>{t.common_open}</button>
              <button className="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-700 transition-colors" onClick={handleSaveMapData}>{t.common_save}</button>
            </div>
          )}
        </div>
        {/* 其它菜单按钮 */}
        <button className="px-3 py-1 text-[11px] hover:bg-[#2d323a] text-gray-400 hover:text-white rounded-sm transition-colors" onClick={() => setShowAbout(true)}>{t.menu_edit}</button>
        <button className="px-3 py-1 text-[11px] hover:bg-[#2d323a] text-gray-400 hover:text-white rounded-sm transition-colors">{t.menu_view}</button>
        <button className="px-3 py-1 text-[11px] hover:bg-[#2d323a] text-gray-400 hover:text-white rounded-sm transition-colors">{t.menu_ecu}</button>
        <button className="px-3 py-1 text-[11px] hover:bg-[#2d323a] text-gray-400 hover:text-white rounded-sm transition-colors">{t.menu_dataLog}</button>
        <button className="px-3 py-1 text-[11px] hover:bg-[#2d323a] text-gray-400 hover:text-white rounded-sm transition-colors">{t.menu_tools}</button>
        <button className="px-3 py-1 text-[11px] hover:bg-[#2d323a] text-gray-400 hover:text-white rounded-sm transition-colors">{t.menu_window}</button>
        <button className="px-3 py-1 text-[11px] hover:bg-[#2d323a] text-gray-400 hover:text-white rounded-sm transition-colors" onClick={() => setShowAbout(true)}>{t.menu_help}</button>
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
            <button className="p-1.5 hover:bg-gray-700 rounded text-gray-400 hover:text-green-400" title={t.common_download}><Download size={18} /></button>
            <button className="p-1.5 hover:bg-gray-700 rounded text-gray-400 hover:text-orange-400" title={t.toolbar_burn}><Cpu size={18} /></button>
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
                  <VerticalBar label={t.sensors_ect} value={engineState.ect} unit="°C" min={0} max={120} warningThreshold={110} color="bg-yellow-500" />
                  <VerticalBar label={t.sensors_iat} value={engineState.iat} unit="°C" min={0} max={80} warningThreshold={60} color="bg-sky-400" />
                  <VerticalBar label={t.sensors_map} value={engineState.map} unit="kPa" min={0} max={250} color="bg-emerald-500" />
                  <VerticalBar label={t.sensors_ign} value={engineState.ign} unit="°" min={0} max={60} color="bg-indigo-500" />
                  <VerticalBar label={t.sensors_inj} value={engineState.inj} unit="ms" min={0} max={20} color="bg-rose-500" />
                  <VerticalBar label={t.sensors_battery} value={engineState.battery} unit="V" min={8} max={16} color="bg-amber-500" />
               </div>
            </div>

            {/* 2. Digital Controllers (Center) */}
            <div className="bg-[#16181c] rounded-lg border border-gray-700/50 p-2 shadow-xl flex flex-col gap-2 overflow-hidden" style={{ flex: '0.35 1 0%' }}>
               <div className="flex items-center justify-between bg-[#111316] p-2 rounded border border-gray-800 shrink-0">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t.controllers_title}</span>
                  <ToggleSwitch
                    checked={masterSwitch}
                    onChange={setMasterSwitch}
                    size="sm"
                  />
                  <span className={`text-[10px] font-bold ${masterSwitch ? 'text-white' : 'text-gray-600'}`}>
                    {masterSwitch ? t.controllers_enabled : t.controllers_disabled}
                  </span>
               </div>

               <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-2 min-h-0">
                  <ControllerBlock 
                    label={t.controllers_idleControl} 
                    value={idleValue} 
                    onChange={setIdleValue}
                    unit="RPM" 
                    step={10}
                    decimals={0}
                    min={500}
                    max={2000}
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
                  />
                  <ControllerBlock 
                    label={t.controllers_modeSelect} 
                    value={modeValue} 
                    onChange={setModeValue}
                    step={1}
                    decimals={0}
                    min={0}
                    max={5}
                  />
               </div>
            </div>

            {/* 3. Analog Gauges (Right) */}
            <div className="bg-[#16181c] rounded-lg border border-gray-700/50 p-2 shadow-xl flex items-center justify-evenly relative overflow-hidden" style={{ flex: '0.4 1 0%' }}>
               <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40 pointer-events-none"></div>
               <div className="w-[32%] h-full" style={{ maxHeight: 'min(220px, 25vh)' }}>
                  <Gauge label={t.sensors_rpm} value={engineState.rpm} min={0} max={9000} unit="RPM x1000" dangerStart={7500} majorTicks={9} />
               </div>
               <div className="w-[32%] h-full" style={{ maxHeight: 'min(220px, 25vh)' }}>
                  <Gauge label={t.sensors_tps} value={engineState.tps} min={0} max={100} unit="%" majorTicks={5} />
               </div>
               <div className="w-[32%] h-full" style={{ maxHeight: 'min(220px, 25vh)' }}>
                  <Gauge label={t.sensors_afr} value={engineState.afr} min={10} max={20} unit="AFR" majorTicks={5} />
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
            <div className="flex-1 flex justify-end min-w-[200px]">
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
          ${notification.type === 'success' ? 'bg-emerald-900/90 border-emerald-500 text-emerald-100' : 'bg-red-900/90 border-red-500 text-red-100'}`}
        >
          <div className={`w-2 h-2 rounded-full ${notification.type === 'success' ? 'bg-emerald-400' : 'bg-red-400'}`}></div>
          <span className="text-sm font-medium whitespace-pre-line">{notification.message}</span>
        </div>
      )}
    </div>
  );
};

export default App;