import React, { useState, useEffect, useRef } from 'react';
import { 
  Save, FolderOpen, Settings, Activity, 
  Cpu, Play, Pause, 
  Download, X, Minus, Square, Plus
} from 'lucide-react';
import { VerticalBar } from './components/VerticalBar';
import { Gauge } from './components/Gauge';
import { MapTable } from './components/MapTable';
import { MapTable1D } from './components/MapTable1D';
import { OtherOptionsView } from './components/OtherOptionsView';
import { SettingsView } from './components/SettingsView';
import { ParametersView } from './components/ParametersView';
import { EngineState } from './types';

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

const MAIN_TABS = [
  '喷油量', '喷油提前角', '点火角度', '储能时间',
  '空燃比', '缸温补偿喷油', '缸温补偿点火', '进气压力补偿',
  '怠速与限速', '其它选项', '参数', '设置与信息'
];

// Generate a realistic-looking VE (Volumetric Efficiency) Map
const generateMapData = () => {
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
      row.push(Math.max(2, Number(ve.toFixed(2))));
    }
    data.push(row);
  }
  return data;
};

const INITIAL_MAP_DATA = generateMapData();

const App: React.FC = () => {
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

  const [mapData, setMapData] = useState<number[][]>(INITIAL_MAP_DATA);
  const [isSimulating, setIsSimulating] = useState(false);
  const [ecuConnected, setEcuConnected] = useState(true);
  const [masterSwitch, setMasterSwitch] = useState(true);
  const [activeTab, setActiveTab] = useState('喷油量'); // Default tab

  const simInterval = useRef<ReturnType<typeof setInterval> | null>(null);

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

  // Sim loop
  useEffect(() => {
    if (isSimulating) {
      let time = 0;
      simInterval.current = setInterval(() => {
        time += 0.05;
        
        // 1. Update Engine State
        setEngineState(prev => {
          const baseRpm = 4000 + Math.sin(time) * 3500;
          const noise = Math.random() * 50;
          const rpm = Math.max(800, Math.min(8500, baseRpm + noise));
          const tps = Math.max(0, Math.min(100, (Math.sin(time) + 0.8) * 50));
          const map = 20 + (tps * 0.8) + (Math.random() * 2);
          const targetAfr = tps > 80 ? 11.5 : tps > 40 ? 13.2 : 14.7;
          const afr = targetAfr + (Math.random() * 0.2 - 0.1);

          return {
            rpm,
            tps,
            map,
            iat: 30 + Math.sin(time * 0.1) * 5,
            ect: 88 + Math.sin(time * 0.05) * 3,
            ign: 40 - (map * 0.2) + (rpm / 1000), 
            inj: (map * rpm) / 50000,
            afr,
            battery: 13.8 + Math.random() * 0.1
          };
        });

        // 2. Simulate Map Data Fluctuation (Every cell updates slightly)
        setMapData(prevData => {
           return prevData.map((row, rIdx) => 
              row.map((val, cIdx) => {
                 // Create a wave effect based on position and time + random noise
                 const wave = Math.sin(time * 2 + rIdx + cIdx) * 0.05;
                 const noise = (Math.random() - 0.5) * 0.1;
                 // Anchor it loosely to the initial data so it doesn't drift away
                 const baseVal = INITIAL_MAP_DATA[rIdx][cIdx];
                 return baseVal + wave + noise;
              })
           );
        });

      }, 50);
    } else {
      if (simInterval.current) clearInterval(simInterval.current);
      setEngineState(prev => ({...prev, rpm: 850, tps: 0, map: 30, inj: 1.2, ign: 15}));
      setMapData(INITIAL_MAP_DATA); // Reset map
    }
    return () => { if (simInterval.current) clearInterval(simInterval.current); };
  }, [isSimulating]);

  const ControllerBlock = ({ label, value, unit = '', large = false }: { label: string, value: string, unit?: string, large?: boolean }) => (
    <div className={`bg-[#0d0f11] rounded border border-gray-700 relative p-1.5 flex flex-col overflow-hidden ${large ? 'col-span-1' : ''}`}>
       <div className="flex justify-between items-center mb-1 absolute top-1 right-1 left-1 px-1 z-10">
          <button className="w-4 h-4 rounded-full bg-[#252830] hover:bg-[#30343d] flex items-center justify-center text-gray-400 shadow active:scale-95 transition-transform border border-gray-600">
             <Plus size={8} />
          </button>
          <button className="w-4 h-4 rounded-full bg-[#252830] hover:bg-[#30343d] flex items-center justify-center text-gray-400 shadow active:scale-95 transition-transform border border-gray-600">
             <Minus size={8} />
          </button>
       </div>
       <div className="flex-1 flex items-center justify-center pt-2">
          <div className="flex items-baseline translate-y-1">
             <span className={`font-digital text-gray-200 tracking-tighter drop-shadow-[0_0_5px_rgba(255,255,255,0.1)] ${large ? 'text-4xl' : 'text-3xl'}`}>
                {value}
             </span>
             {unit && <span className="text-gray-500 text-[9px] font-bold ml-1">{unit}</span>}
          </div>
       </div>
       <div className="text-center text-[9px] text-gray-500 font-bold uppercase tracking-widest border-t border-gray-800 pt-0.5 truncate">{label}</div>
    </div>
  );

  // --- View Renderer ---
  const renderContent = () => {
    if (activeTab === '其它选项') {
      return <OtherOptionsView />;
    }
    if (activeTab === '设置与信息') {
      return <SettingsView />;
    }
    if (activeTab === '参数') {
      return <ParametersView />;
    }
    if (activeTab === '储能时间') {
      return (
        <MapTable1D 
          headers={DWELL_RPM_POINTS}
          data={DWELL_DATA_POINTS}
          activeValue={engineState.rpm} 
          xLabel="RPM"
          yLabel="TIME"
        />
      );
    }
    if (activeTab === '缸温补偿喷油') {
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
                 <option>Unit</option>
              </select>
            </div>
            <div className="flex gap-2">
               {/* Placeholder for additional tools */}
            </div>
          </div>
          <div className="flex-1 overflow-hidden relative p-1">
            <MapTable 
              rpmPoints={ECT_COMP_RPM_POINTS}
              loadPoints={ECT_COMP_TEMP_POINTS}
              data={ECT_COMP_2D_DATA}
              activeRpm={engineState.rpm}
              activeLoad={engineState.ect}
              yAxisUnit="°C"
              cornerLabel="± 2°"
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
                  <option>百分比 (%)</option>
                  <option>原始值</option>
                  <option>Lambda</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-0.5 bg-red-600 text-white text-[10px] font-bold rounded-full">表 1 (激活)</button>
              <button className="px-3 py-0.5 bg-gray-800 text-gray-500 border border-gray-600 text-[10px] font-bold rounded-full">表 2</button>
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
          <Activity size={14} className="text-orange-500" />
          <span className="text-xs font-medium text-gray-400 tracking-wide">ProTuner ECU 工作室 v3.0 - Supra_基础图谱_v2.cal</span>
        </div>
        <div className="flex items-center gap-6" style={{ WebkitAppRegion: 'no-drag' } as any}>
          <div className={`flex items-center gap-2 text-[10px] font-bold uppercase ${ecuConnected ? 'text-emerald-500' : 'text-red-500'}`}>
             <div className={`w-2 h-2 rounded-full ${ecuConnected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
             {ecuConnected ? '已连接: USB-CAN' : '未连接'}
          </div>
          <div className="flex items-center gap-4 text-gray-500">
            <Settings size={14} className="hover:text-white cursor-pointer" />
            <Minus size={16} className="hover:text-white cursor-pointer hover:bg-gray-700 rounded" onClick={() => handleWindowControl('window-minimize')} />
            <Square size={14} className="hover:text-white cursor-pointer hover:bg-gray-700 rounded" onClick={() => handleWindowControl('window-maximize')} />
            <X size={16} className="hover:text-red-500 cursor-pointer hover:bg-red-900/50 rounded" onClick={() => handleWindowControl('window-close')} />
          </div>
        </div>
      </div>

      {/* --- Menu Bar --- */}
      <div className="h-8 bg-[#1e2126] flex items-center px-2 gap-1 shrink-0 border-b border-black">
         {['文件', '编辑', '视图', 'ECU', '数据日志', '工具', '窗口', '帮助'].map(item => (
           <button key={item} className="px-3 py-1 text-[11px] hover:bg-[#2d323a] text-gray-400 hover:text-white rounded-sm transition-colors">
             {item}
           </button>
         ))}
      </div>

      {/* --- Toolbar --- */}
      <div className="h-12 bg-[#23272e] flex items-center px-4 gap-3 shrink-0 border-b border-gray-800 shadow-md">
         <div className="flex items-center gap-1 pr-3 border-r border-gray-700">
            <button className="p-1.5 hover:bg-gray-700 rounded text-gray-400 hover:text-blue-400" title="打开"><FolderOpen size={18} /></button>
            <button className="p-1.5 hover:bg-gray-700 rounded text-gray-400 hover:text-blue-400" title="保存"><Save size={18} /></button>
         </div>
         <div className="flex items-center gap-1 pr-3 border-r border-gray-700">
            <button className="p-1.5 hover:bg-gray-700 rounded text-gray-400 hover:text-green-400" title="下载"><Download size={18} /></button>
            <button className="p-1.5 hover:bg-gray-700 rounded text-gray-400 hover:text-orange-400" title="烧录"><Cpu size={18} /></button>
         </div>
         <div className="flex items-center gap-2">
            <button 
               onClick={() => setIsSimulating(!isSimulating)}
               className={`flex items-center gap-2 px-4 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-all border
               ${isSimulating ? 'bg-orange-600 border-orange-500 text-white shadow-lg shadow-orange-900/50' : 'bg-gray-700 border-gray-600 hover:bg-gray-600'}`}
            >
               {isSimulating ? <Pause size={14} /> : <Play size={14} />}
               {isSimulating ? '停止模拟' : '开始模拟'}
            </button>
         </div>
      </div>

      {/* --- Main Workspace --- */}
      <div className="flex-1 p-2 flex flex-col gap-2 overflow-hidden">
         
         {/* Top Dashboard Row (40% Height) */}
         <div className="flex-[0.45] min-h-[220px] flex gap-2 shrink-0">
            
            {/* 1. Sensor Bars Panel */}
            <div className="flex-[0.25] min-w-[200px] bg-[#16181c] rounded-lg border border-gray-700/50 p-3 shadow-xl flex flex-col">
               <div className="text-[10px] text-gray-500 font-bold mb-2 uppercase flex justify-between">
                  <span>传感器</span>
                  <span className="text-blue-500">实时</span>
               </div>
               <div className="flex-1 grid grid-cols-6 gap-2">
                  <VerticalBar label="水温" value={engineState.ect} unit="°C" min={0} max={120} warningThreshold={110} color="bg-yellow-500" />
                  <VerticalBar label="进气温" value={engineState.iat} unit="°C" min={0} max={80} warningThreshold={60} color="bg-sky-400" />
                  <VerticalBar label="压力" value={engineState.map} unit="kPa" min={0} max={250} color="bg-emerald-500" />
                  <VerticalBar label="点火角" value={engineState.ign} unit="°" min={0} max={60} color="bg-indigo-500" />
                  <VerticalBar label="喷油" value={engineState.inj} unit="ms" min={0} max={20} color="bg-rose-500" />
                  <VerticalBar label="电压" value={engineState.battery} unit="V" min={8} max={16} color="bg-amber-500" />
               </div>
            </div>

            {/* 2. Digital Controllers (Center) */}
            <div className="flex-[0.35] bg-[#16181c] rounded-lg border border-gray-700/50 p-2 shadow-xl flex flex-col gap-2 overflow-hidden">
               <div className="flex items-center justify-between bg-[#111316] p-2 rounded border border-gray-800 shrink-0">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">实时调节控制</span>
                  <div 
                    className="flex items-center gap-2 cursor-pointer" 
                    onClick={() => setMasterSwitch(!masterSwitch)}
                  >
                    <span className={`text-[10px] font-bold ${masterSwitch ? 'text-white' : 'text-gray-600'}`}>
                      {masterSwitch ? '已启用' : '已禁用'}
                    </span>
                    <div className={`w-8 h-4 rounded-full p-0.5 transition-colors duration-300 ${masterSwitch ? 'bg-green-600' : 'bg-gray-700'}`}>
                      <div className={`w-3 h-3 bg-white rounded-full shadow-md transform transition-transform duration-300 ${masterSwitch ? 'translate-x-4' : 'translate-x-0'}`}></div>
                    </div>
                  </div>
               </div>

               <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-2 min-h-0">
                  <ControllerBlock label="怠速调节" value="850" unit="RPM" />
                  <ControllerBlock label="点火角度调节" value="15.5" unit="DEG" />
                  <ControllerBlock label="喷油量调节" value="+2.5" unit="%" />
                  <ControllerBlock label="模式选择" value="0" />
               </div>
            </div>

            {/* 3. Analog Gauges (Right) */}
            <div className="flex-[0.4] bg-[#16181c] rounded-lg border border-gray-700/50 p-2 shadow-xl flex items-center justify-evenly relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40 pointer-events-none"></div>
               <div className="w-[32%] h-full max-h-[220px]">
                  <Gauge label="转速" value={engineState.rpm} min={0} max={9000} unit="RPM x1000" dangerStart={7500} majorTicks={9} />
               </div>
               <div className="w-[32%] h-full max-h-[220px]">
                  <Gauge label="节气门" value={engineState.tps} min={0} max={100} unit="%" majorTicks={5} />
               </div>
               <div className="w-[32%] h-full max-h-[220px]">
                  <Gauge label="空燃比" value={engineState.afr} min={10} max={20} unit="AFR" majorTicks={5} />
               </div>
            </div>

         </div>

         {/* Middle Tab Bar (Updated) */}
         <div className="flex gap-1 px-1 shrink-0 overflow-x-auto">
            {MAIN_TABS.map((tab, i) => (
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
                <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> ECU 同步</span>
                <span>节气门: <span className="text-gray-300">{engineState.tps.toFixed(1)}%</span></span>
                <span>压力: <span className="text-gray-300">{engineState.map.toFixed(0)}kPa</span></span>
                <span>水温: <span className="text-gray-300">{engineState.ect.toFixed(2)}°C</span></span>
             </div>
             <div className="flex gap-4">
                <span>FTDI USB 驱动</span>
                <span>115200 波特率</span>
             </div>
         </div>

      </div>
    </div>
  );
};

export default App;