import React from 'react';
import { MapTable } from './MapTable';
import { MapTable1D } from './MapTable1D';
import { OtherOptionsView } from './OtherOptionsView';
import { SettingsView } from './SettingsView';
import { ParametersView } from './ParametersView';

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
  otherOptionsParams: any;
  setOtherOptionsParams: React.Dispatch<React.SetStateAction<any>>;
  otherOptionsGrids: any;
  setOtherOptionsGrids: React.Dispatch<React.SetStateAction<any>>;
  parametersData: any;
  setParametersData: React.Dispatch<React.SetStateAction<any>>;
  settingsData: any;
  setSettingsData: React.Dispatch<React.SetStateAction<any>>;
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
  otherOptionsParams,
  setOtherOptionsParams,
  otherOptionsGrids,
  setOtherOptionsGrids,
  parametersData,
  setParametersData,
  settingsData,
  setSettingsData,
}) => {
  // Helper functions to reduce duplication
  const handle2DCellChange = (setter: React.Dispatch<React.SetStateAction<number[][]>>) => (row: number, col: number, val: number) => {
    setter(prev => {
      const newData = prev.map(r => r.slice());
      newData[row][col] = val;
      return newData;
    });
  };

  const handle2DBulkChange = (setter: React.Dispatch<React.SetStateAction<number[][]>>) => (changes: {row: number, col: number, value: number}[]) => {
    setter(prev => {
      const newData = prev.map(r => r.slice());
      changes.forEach(({row, col, value}) => {
        newData[row][col] = value;
      });
      return newData;
    });
  };

  const handle1DCellChange = (setter: React.Dispatch<React.SetStateAction<number[]>>) => (_: number, idx: number, val: number) => {
    setter(prev => {
      const arr = prev.slice();
      arr[idx] = val;
      return arr;
    });
  };

  const handle1DBulkChange = (setter: React.Dispatch<React.SetStateAction<number[]>>) => (changes: {col: number, value: number}[]) => {
    setter(prev => {
      const arr = prev.slice();
      changes.forEach(({col, value}) => {
        arr[col] = value;
      });
      return arr;
    });
  };

  // 燃油MAP表格
  if (activeTab === t.tabs_fuelMap) {
    return (
      <div className="flex-1 overflow-hidden relative p-1">
        <MapTable 
          rpmPoints={RPM_POINTS}
          loadPoints={LOAD_POINTS}
          data={fuelMapData}
          activeRpm={engineState.rpm}
          activeLoad={engineState.tps}
          value={0}
          onCellChange={handle2DCellChange(setFuelMapData)}
          onBulkChange={handle2DBulkChange(setFuelMapData)}
        />
      </div>
    );
  }

  // 燃油前馈
  if (activeTab === t.tabs_fuelAdvance) {
    return (
      <div className="flex-1 overflow-hidden relative p-1">
        <MapTable 
          rpmPoints={RPM_POINTS}
          loadPoints={LOAD_POINTS}
          data={fuelAdvanceData}
          activeRpm={engineState.rpm}
          activeLoad={engineState.tps}
          value={0}
          onCellChange={handle2DCellChange(setFuelAdvanceData)}
          onBulkChange={handle2DBulkChange(setFuelAdvanceData)}
        />
      </div>
    );
  }

  // 点火提前角
  if (activeTab === t.tabs_ignitionAngle) {
    return (
      <div className="flex-1 overflow-hidden relative p-1">
        <MapTable 
          rpmPoints={RPM_POINTS}
          loadPoints={LOAD_POINTS}
          data={ignitionAngleData}
          activeRpm={engineState.rpm}
          activeLoad={engineState.tps}
          value={0}
          onCellChange={handle2DCellChange(setIgnitionAngleData)}
          onBulkChange={handle2DBulkChange(setIgnitionAngleData)}
        />
      </div>
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
        onCellChange={handle1DCellChange(setDwellTimeData)}
        onBulkChange={handle1DBulkChange(setDwellTimeData)}
      />
    );
  }

  // AFR目标
  if (activeTab === t.tabs_afr) {
    return (
      <div className="flex-1 overflow-hidden relative p-1">
        <MapTable 
          rpmPoints={RPM_POINTS}
          loadPoints={LOAD_POINTS}
          data={afrTargetData}
          activeRpm={engineState.rpm}
          activeLoad={engineState.tps}
          value={0}
          onCellChange={handle2DCellChange(setAfrTargetData)}
          onBulkChange={handle2DBulkChange(setAfrTargetData)}
        />
      </div>
    );
  }

  // ECT燃油补偿
  if (activeTab === t.tabs_ectCompFuel) {
    return (
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
          onCellChange={handle2DCellChange(setEctCompFuelData)}
          onBulkChange={handle2DBulkChange(setEctCompFuelData)}
        />
      </div>
    );
  }

  // ECT点火补偿
  if (activeTab === t.tabs_ectCompIgn) {
    return (
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
          onCellChange={handle2DCellChange(setEctCompIgnData)}
          onBulkChange={handle2DBulkChange(setEctCompIgnData)}
        />
      </div>
    );
  }

  // MAP补偿
  if (activeTab === t.tabs_mapComp) {
    return (
      <div className="flex-1 overflow-hidden relative p-1">
        <MapTable 
          rpmPoints={RPM_POINTS}
          loadPoints={LOAD_POINTS}
          data={mapCompData}
          activeRpm={engineState.rpm}
          activeLoad={engineState.tps}
          value={0}
          onCellChange={handle2DCellChange(setMapCompData)}
          onBulkChange={handle2DBulkChange(setMapCompData)}
        />
      </div>
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
        onCellChange={handle1DCellChange(setIdleLimitData)}
        onBulkChange={handle1DBulkChange(setIdleLimitData)}
      />
    );
  }

  // 其他选项
  if (activeTab === t.tabs_otherOptions) {
    return <OtherOptionsView 
      params={otherOptionsParams}
      grids={otherOptionsGrids}
      onParamsChange={setOtherOptionsParams}
      onGridsChange={setOtherOptionsGrids}
    />;
  }
  
  // 设置信息
  if (activeTab === t.tabs_settingsInfo) {
    return <SettingsView 
      data={settingsData}
      onDataChange={setSettingsData}
    />;
  }
  
  // 参数
  if (activeTab === t.tabs_parameters) {
    return <ParametersView 
      data={parametersData}
      onDataChange={setParametersData}
    />;
  }

  // 默认占位
  return <div className="flex-1 flex items-center justify-center text-gray-400 text-lg">功能待实现</div>;
};

export default TabContentView;