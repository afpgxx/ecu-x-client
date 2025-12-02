import React, { useState, useEffect, useRef } from 'react';
import { 
  Save, FolderOpen, Settings,
  Cpu, Play, Pause, RefreshCw,
  Download, X, Minus, Square, Plus, Globe
} from 'lucide-react';
import { VerticalBar } from './components/VerticalBar';
import { Gauge } from './components/Gauge';
import { MapTable } from './components/MapTable';
import { MapTable1D } from './components/MapTable1D';
import { OtherOptionsView } from './components/OtherOptionsView';
import { SettingsView } from './components/SettingsView';
import { ParametersView } from './components/ParametersView';
import { ToggleSwitch } from './components/common/ToggleSwitch';
import { Logo } from './components/Logo';
import { EngineState } from './types';
import { useI18n } from './i18n/I18nContext';
import { Language } from './i18n';
import { APP_VERSION } from './version';
import CryptoJS from 'crypto-js';

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

  const [mapData, setMapData] = useState<number[][]>(MAP_DATA);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isSweeping, setIsSweeping] = useState(false);
  const [ecuConnected] = useState(true);
  const [masterSwitch, setMasterSwitch] = useState(true);
  const [activeTab, setActiveTab] = useState(MAIN_TABS[0]); // 使用数组第一项而不是直接访问 t
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  
  // Controller values
  const [idleValue, setIdleValue] = useState(850);
  const [ignitionValue, setIgnitionValue] = useState(15.5);
  const [fuelValue, setFuelValue] = useState(2.5);
  const [modeValue, setModeValue] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const simInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleCellChange = (row: number, col: number, newValue: number) => {
    setMapData(prev => {
      const newData = prev.map(r => r.slice());
      newData[row][col] = newValue;
      return newData;
    });
  };

  const handleSaveMapData = () => {
    const json = JSON.stringify(mapData);
    const encrypted = CryptoJS.AES.encrypt(json, SECRET_KEY).toString();
    const blob = new Blob([encrypted], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "myMapData.ECUDATA";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportMapData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const encrypted = event.target?.result as string;
        const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);
        const data = JSON.parse(decrypted);
        if (Array.isArray(data)) {
          setMapData(data);
        } else {
          alert("文件格式不正确");
        }
      } catch {
        alert("解密或解析失败");
      }
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
      
      setMapData(generateMapData(true)); // Randomize map data
      setIsSweeping(false);
    }, 1000);
  };

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
        setMapData(prevData => {
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
                className="font-digital text-gray-200 text-3xl tracking-tighter bg-transparent border-none outline-none text-center w-24"
                autoFocus
              />
            ) : (
              <span 
                  className="font-digital text-gray-200 tracking-tighter drop-shadow-[0_0_5px_rgba(255,255,255,0.1)] text-3xl cursor-pointer"
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
    if (activeTab === t.tabs_otherOptions) {
      return <OtherOptionsView />;
    }
    if (activeTab === t.tabs_settingsInfo) {
      return <SettingsView />;
    }
    if (activeTab === t.tabs_parameters) {
      return <ParametersView />;
    }
    if (activeTab === t.tabs_dwellTime) {
      return (
        <MapTable1D 
          headers={DWELL_RPM_POINTS}
          data={DWELL_DATA_POINTS}
          activeValue={engineState.rpm} 
          xLabel="RPM"
          yLabel="TIME"
          colorMode="dark" /* 使用深色统一样式，保持与其它表格一致 */
        />
      );
    }
    if (activeTab === t.tabs_ectCompFuel) {
      return (
        <>
          {/* Standard Map Toolbar */}
          <div className="h-9 bg-[#1e2126] border-b border-gray-700 flex items-center px-3 justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-black/30 rounded p-0.5 border border-gray-700">
                  <button className="w-6 h-5 flex items-center justify-center hover:bg-gray-700 text-gray-400 rounded-sm text-xs"><Minus size={12}/></button>
                  <input className="w-12 bg-transparent text-center text-xs font-mono text-white border-none focus:ring-0" defaultValue="0.1" />
                  <button className="w-6 h-5 flex items-center justify-center hover:bg-gray-700 text-gray-400 rounded-sm text-xs"><Plus size={12}/></button>
              </div>
              <div className="h-4 w-[1px] bg-gray-700"></div>
              <select className="bg-[#2d323a] text-xs text-gray-300 border border-gray-600 rounded px-2 py-0.5 outline-none">
                 <option>{t.mapTable_unit}</option>
              </select>
            </div>
          </div>
          <div className="flex-1 overflow-hidden relative p-1">
            <MapTable
              rpmPoints={ECT_COMP_RPM_POINTS}
              loadPoints={ECT_COMP_TEMP_POINTS}
              data={mapData}
              activeRpm={engineState.rpm}
              activeLoad={engineState.ect}
              yAxisUnit="°C"
              cornerLabel="± 2°"
              value={0}
              onCellChange={handleCellChange}
         />
          </div>
        </>
      );
    }
    
    // Default: Map View
    return (
      <>
        {/* Standard Map Toolbar */}
        <div className="h-9 bg-[#1e2126] border-b border-gray-700 flex items-center px-3 justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-black/30 rounded p-0.5 border border-gray-700">
                  <button className="w-6 h-5 flex items-center justify-center hover:bg-gray-700 text-gray-400 rounded-sm text-xs"><Minus size={12}/></button>
                  <input className="w-12 bg-transparent text-center text-xs font-mono text-white border-none focus:ring-0" defaultValue="1.0" />
                  <button className="w-6 h-5 flex items-center justify-center hover:bg-gray-700 text-gray-400 rounded-sm text-xs"><Plus size={12}/></button>
              </div>
              <div className="h-4 w-[1px] bg-gray-700"></div>
              <select className="bg-[#2d323a] text-xs text-gray-300 border border-gray-600 rounded px-2 py-0.5 outline-none">
                  <option>{t.mapTable_percentage}</option>
                  <option>{t.mapTable_rawValue}</option>
                  <option>{t.mapTable_lambda}</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-0.5 bg-red-600 text-white text-[10px] font-bold rounded-full">{t.mapTable_table1Active}</button>
              <button className="px-3 py-0.5 bg-gray-800 text-gray-500 border border-gray-600 text-[10px] font-bold rounded-full">{t.mapTable_table2}</button>
            </div>
        </div>

        {/* The Grid */}
        <div className="flex-1 overflow-hidden relative p-1">
            <MapTable 
            rpmPoints={RPM_POINTS}
            loadPoints={LOAD_POINTS}
            data={mapData}
            activeRpm={engineState.rpm}
            activeLoad={engineState.tps}
            value={0}
            onCellChange={handleCellChange}
          />
        </div>
      </>
    );
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
            <Square size={14} className="hover:text-white cursor-pointer hover:bg-gray-700 rounded" onClick={() => handleWindowControl('window-maximize')} />
            <X size={16} className="hover:text-red-500 cursor-pointer hover:bg-red-900/50 rounded" onClick={() => handleWindowControl('window-close')} />
          </div>
        </div>
      </div>

      {/* --- Menu Bar --- */}
      <div className="h-8 bg-[#1e2126] flex items-center px-2 gap-1 shrink-0 border-b border-black">
         {[t.menu_file, t.menu_edit, t.menu_view, t.menu_ecu, t.menu_dataLog, t.menu_tools, t.menu_window, t.menu_help].map(item => (
           <button 
             key={item} 
             className="px-3 py-1 text-[11px] hover:bg-[#2d323a] text-gray-400 hover:text-white rounded-sm transition-colors"
             onClick={() => {
               if (item === t.menu_help) setShowAbout(true);
             }}
           >
             {item}
           </button>
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
      <div className="flex-1 p-2 flex flex-col gap-2 overflow-hidden">
         
         {/* Top Dashboard Row (40% Height) */}
         <div className="min-h-[220px] flex gap-2 shrink-0" style={{ flex: '0.45 1 0%' }}>
            
            {/* 1. Sensor Bars Panel */}
            <div className="min-w-[200px] bg-[#16181c] rounded-lg border border-gray-700/50 p-3 shadow-xl flex flex-col" style={{ flex: '0.25 1 0%' }}>
               <div className="text-[10px] text-gray-500 font-bold mb-2 uppercase flex justify-between">
                  <span>{t.sensors_title}</span>
                  <span className="text-blue-500">{t.sensors_realtime}</span>
               </div>
               <div className="flex-1 grid grid-cols-6 gap-2">
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
               <div className="w-[32%] h-full max-h-[220px]">
                  <Gauge label={t.sensors_rpm} value={engineState.rpm} min={0} max={9000} unit="RPM x1000" dangerStart={7500} majorTicks={9} />
               </div>
               <div className="w-[32%] h-full max-h-[220px]">
                  <Gauge label={t.sensors_tps} value={engineState.tps} min={0} max={100} unit="%" majorTicks={5} />
               </div>
               <div className="w-[32%] h-full max-h-[220px]">
                  <Gauge label={t.sensors_afr} value={engineState.afr} min={10} max={20} unit="AFR" majorTicks={5} />
               </div>
            </div>

         </div>

         {/* Middle Tab Bar (Updated) */}
         <div className="flex gap-1 px-1 shrink-0 overflow-x-auto">
            {MAIN_TABS.map((tab) => (
               <button 
                  key={tab} 
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-1.5 rounded-t-md text-xs font-bold border-t border-x transition-colors whitespace-nowrap
                  ${activeTab === tab 
                     ? 'bg-blue-600 border-blue-500 text-white' 
                     : 'bg-[#23272e] border-gray-700 text-gray-400 hover:bg-[#2d323a]'}`}
               >
                  {tab}
               </button>
            ))}
         </div>

         {/* Bottom Content Area (Switches between Views) */}
         <div className="flex-1 bg-[#16181c] rounded-b-lg rounded-tr-lg border border-gray-700 flex flex-col overflow-hidden shadow-2xl">
             {renderContent()}
         </div>

         {/* Status Bar */}
         <div className="h-6 bg-[#111316] border-t border-gray-800 flex items-center justify-between px-4 text-[10px] font-mono text-gray-500 select-none shrink-0">
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
    </div>
  );
};

export default App;