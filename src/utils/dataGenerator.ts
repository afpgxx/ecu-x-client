import { 
    LOAD_POINTS, 
    RPM_POINTS, 
    ECT_COMP_TEMP_POINTS, 
    ECT_COMP_RPM_POINTS
    ECT_COMP_RPM_POINTS, 
} from '../constants';
import { IdleLimitState } from '../types';

// Generate a realistic-looking VE (Volumetric Efficiency) Map
export const generateMapData = (randomize = false) => {
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

export const MAP_DATA = generateMapData();

// 生成点火角度表数据（示例值）
export const generateIgnitionData = () => {
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
export const generateFuelAdvanceData = () => {
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
export const generateAfrData = () => {
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
export const generateEctIgnData = () => {
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
export const generateMapCompData = () => {
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

// 生成怠速/限转数据（复杂对象）
export const generateIdleLimitState = (): IdleLimitState => ({
  idleRpmCold: 1500,
  idleReturnCold: 1800,
  idleRpmHot: 1300,
  idleReturnHot: 1600,
  enterExitSensitivity: 5,
  accelEnrichPercent: 10,
  maxRpm: 12000,
  vvtOpenRpm: 6000,
  autoClutchInjVe: false,
  autoClutchIgnDegree: false,
  autoClutchData: Array(8).fill(0),
  spareData: Array(9).fill(0),
  limitNoInj: true,
  limitNoIgn: false,
  spare1: false,
  spare2: false,
  spare3: false,
  spare4: false
});

