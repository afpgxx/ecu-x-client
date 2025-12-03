import React from 'react';
import { MapTable } from './MapTable';
import { MapTable1D } from './MapTable1D';
import { OtherOptionsView } from './OtherOptionsView';
import { SettingsView } from './SettingsView';
import { ParametersView } from './ParametersView';
import { Minus, Plus } from 'lucide-react';

// Props 类型
interface TabContentViewProps {
  activeTab: string;
  t: any;
  engineState: any;
  fuelMapData: number[][];
  setFuelMapData: React.Dispatch<React.SetStateAction<number[][]>>;
  fuelAdvanceData: number[][];
  setFuelAdvanceData: React.Dispatch<React.SetStateAction<number[][]>>;
  ignitionAngleData: number[][];
  setIgnitionAngleData: React.Dispatch<React.SetStateAction<number[][]>>;
  dwellTimeData: number[];
  setDwellTimeData: React.Dispatch<React.SetStateAction<number[]>>;
  afrTargetData: number[][];
  setAfrTargetData: React.Dispatch<React.SetStateAction<number[][]>>;
  ectCompFuelData: number[][];
  setEctCompFuelData: React.Dispatch<React.SetStateAction<number[][]>>;
  ectCompIgnData: number[][];
  setEctCompIgnData: React.Dispatch<React.SetStateAction<number[][]>>;
  mapCompData: number[][];
  setMapCompData: React.Dispatch<React.SetStateAction<number[][]>>;
  idleLimitData: number[];
  setIdleLimitData: React.Dispatch<React.SetStateAction<number[]>>;
}

const RPM_POINTS = [800, 1200, 1600, 2000, 2400, 2800, 3200, 3600, 4000, 4400, 4800, 5200, 5600, 6000, 6400, 6800, 7200, 7600, 8000];
const LOAD_POINTS = [100, 90, 80, 70, 60, 50, 40, 30, 20, 10, 0];
const DWELL_RPM_POINTS = [
  800, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000, 
  5500, 6000, 6500, 7000, 7500, 8000, 8500, 9000, 9500, 10000, 
  10500, 11000, 11500, 12000, 12500, 13000, 13500, 14000, 14500, 15000
];
const ECT_COMP_TEMP_POINTS = [126, 112, 98, 84, 70, 56, 42, 28, 14, 0, -14];
const ECT_COMP_RPM_POINTS = DWELL_RPM_POINTS;
const IDLE_LIMIT_RPM_POINTS = [0, 500, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000];

export const TabContentView: React.FC<TabContentViewProps> = ({
  activeTab,
  t,
  engineState,
  fuelMapData,
  setFuelMapData,
  fuelAdvanceData,
  setFuelAdvanceData,
  ignitionAngleData,
  setIgnitionAngleData,
  dwellTimeData,
  setDwellTimeData,
  afrTargetData,
  setAfrTargetData,
  ectCompFuelData,
  setEctCompFuelData,
  ectCompIgnData,
  setEctCompIgnData,
  mapCompData,
  setMapCompData,
  idleLimitData,
  setIdleLimitData,
}) => {
  // 燃油MAP表格
  if (activeTab === t.tabs_fuelMap) {
    return (
      <>
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
        <div className="flex-1 overflow-hidden relative p-1">
          <MapTable 
            rpmPoints={RPM_POINTS}
            loadPoints={LOAD_POINTS}
            data={fuelMapData}
            activeRpm={engineState.rpm}
            activeLoad={engineState.tps}
            value={0}
            onCellChange={(row, col, val) => {
              setFuelMapData(prev => {
                const newData = prev.map(r => r.slice());
                newData[row][col] = val;
                return newData;
              });
            }}
          />
        </div>
      </>
    );
  }

  // 燃油前馈
  if (activeTab === t.tabs_fuelAdvance) {
    return (
      <>
        <div className="h-9 bg-[#1e2126] border-b border-gray-700 flex items-center px-3 shrink-0">
          <span className="text-xs text-gray-400">燃油前馈表</span>
        </div>
        <div className="flex-1 overflow-hidden relative p-1">
          <MapTable 
            rpmPoints={RPM_POINTS}
            loadPoints={LOAD_POINTS}
            data={fuelAdvanceData}
            activeRpm={engineState.rpm}
            activeLoad={engineState.tps}
            value={0}
            onCellChange={(row, col, val) => {
              setFuelAdvanceData(prev => {
                const newData = prev.map(r => r.slice());
                newData[row][col] = val;
                return newData;
              });
            }}
          />
        </div>
      </>
    );
  }

  // 点火提前角
  if (activeTab === t.tabs_ignitionAngle) {
    return (
      <>
        <div className="h-9 bg-[#1e2126] border-b border-gray-700 flex items-center px-3 shrink-0">
          <span className="text-xs text-gray-400">点火提前角表</span>
        </div>
        <div className="flex-1 overflow-hidden relative p-1">
          <MapTable 
            rpmPoints={RPM_POINTS}
            loadPoints={LOAD_POINTS}
            data={ignitionAngleData}
            activeRpm={engineState.rpm}
            activeLoad={engineState.tps}
            value={0}
            onCellChange={(row, col, val) => {
              setIgnitionAngleData(prev => {
                const newData = prev.map(r => r.slice());
                newData[row][col] = val;
                return newData;
              });
            }}
          />
        </div>
      </>
    );
  }

  // 驻留时间
  if (activeTab === t.tabs_dwellTime) {
    return (
      <MapTable1D 
        headers={DWELL_RPM_POINTS}
        data={dwellTimeData}
        activeValue={engineState.rpm} 
        xLabel="RPM"
        yLabel="TIME"
        colorMode="dark"
        onCellChange={(_, idx, val) => {
          setDwellTimeData(prev => {
            const arr = prev.slice();
            arr[idx] = val;
            return arr;
          });
        }}
      />
    );
  }

  // AFR目标
  if (activeTab === t.tabs_afr) {
    return (
      <>
        <div className="h-9 bg-[#1e2126] border-b border-gray-700 flex items-center px-3 shrink-0">
          <span className="text-xs text-gray-400">AFR目标表</span>
        </div>
        <div className="flex-1 overflow-hidden relative p-1">
          <MapTable 
            rpmPoints={RPM_POINTS}
            loadPoints={LOAD_POINTS}
            data={afrTargetData}
            activeRpm={engineState.rpm}
            activeLoad={engineState.tps}
            value={0}
            onCellChange={(row, col, val) => {
              setAfrTargetData(prev => {
                const newData = prev.map(r => r.slice());
                newData[row][col] = val;
                return newData;
              });
            }}
          />
        </div>
      </>
    );
  }

  // ECT燃油补偿
  if (activeTab === t.tabs_ectCompFuel) {
    return (
      <>
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
            data={ectCompFuelData}
            activeRpm={engineState.rpm}
            activeLoad={engineState.ect}
            yAxisUnit="°C"
            cornerLabel="± 2°"
            value={0}
            onCellChange={(row, col, val) => {
              setEctCompFuelData(prev => {
                const newData = prev.map(r => r.slice());
                newData[row][col] = val;
                return newData;
              });
            }}
          />
        </div>
      </>
    );
  }

  // ECT点火补偿
  if (activeTab === t.tabs_ectCompIgn) {
    return (
      <>
        <div className="h-9 bg-[#1e2126] border-b border-gray-700 flex items-center px-3 shrink-0">
          <span className="text-xs text-gray-400">ECT点火补偿表</span>
        </div>
        <div className="flex-1 overflow-hidden relative p-1">
          <MapTable
            rpmPoints={ECT_COMP_RPM_POINTS}
            loadPoints={ECT_COMP_TEMP_POINTS}
            data={ectCompIgnData}
            activeRpm={engineState.rpm}
            activeLoad={engineState.ect}
            yAxisUnit="°C"
            cornerLabel="± 2°"
            value={0}
            onCellChange={(row, col, val) => {
              setEctCompIgnData(prev => {
                const newData = prev.map(r => r.slice());
                newData[row][col] = val;
                return newData;
              });
            }}
          />
        </div>
      </>
    );
  }

  // MAP补偿
  if (activeTab === t.tabs_mapComp) {
    return (
      <>
        <div className="h-9 bg-[#1e2126] border-b border-gray-700 flex items-center px-3 shrink-0">
          <span className="text-xs text-gray-400">MAP补偿表</span>
        </div>
        <div className="flex-1 overflow-hidden relative p-1">
          <MapTable 
            rpmPoints={RPM_POINTS}
            loadPoints={LOAD_POINTS}
            data={mapCompData}
            activeRpm={engineState.rpm}
            activeLoad={engineState.tps}
            value={0}
            onCellChange={(row, col, val) => {
              setMapCompData(prev => {
                const newData = prev.map(r => r.slice());
                newData[row][col] = val;
                return newData;
              });
            }}
          />
        </div>
      </>
    );
  }

  // 怠速/限转
  if (activeTab === t.tabs_idleLimit) {
    return (
      <MapTable1D 
        headers={IDLE_LIMIT_RPM_POINTS}
        data={idleLimitData}
        activeValue={engineState.rpm} 
        xLabel="RPM"
        yLabel="LIMIT"
        colorMode="dark"
        onCellChange={(_, idx, val) => {
          setIdleLimitData(prev => {
            const arr = prev.slice();
            arr[idx] = val;
            return arr;
          });
        }}
      />
    );
  }

  // 其它选项
  if (activeTab === t.tabs_otherOptions) {
    return <OtherOptionsView />;
  }
  
  // 设置信息
  if (activeTab === t.tabs_settingsInfo) {
    return <SettingsView />;
  }
  
  // 参数
  if (activeTab === t.tabs_parameters) {
    return <ParametersView />;
  }

  // 默认占位
  return <div className="flex-1 flex items-center justify-center text-gray-400 text-lg">功能待实现</div>;
};

export default TabContentView;