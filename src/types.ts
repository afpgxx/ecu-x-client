export interface EngineState {
  rpm: number;
  tps: number;
  map: number;
  iat: number;
  ect: number;
  ign: number;
  inj: number;
  afr: number;
  battery: number;
}

export interface MapCell {
  row: number;
  col: number;
  value: number;
}

export enum MapMode {
  FUEL = 'FUEL',
  SPARK = 'SPARK',
  AFR = 'AFR'
}

export interface IdleLimitState {
  // Top Grid
  idleRpmCold: number;
  idleReturnCold: number;
  idleRpmHot: number;
  idleReturnHot: number;
  enterExitSensitivity: number;
  accelEnrichPercent: number;
  maxRpm: number;
  vvtOpenRpm: number;
  
  // Auto Clutch
  autoClutchInjVe: boolean;
  autoClutchIgnDegree: boolean;
  autoClutchData: number[]; // 8 values

  // Spare
  spareData: number[]; // 9 values

  // Config Bits
  limitNoInj: boolean;
  limitNoIgn: boolean;
  spare1: boolean;
  spare2: boolean;
  spare3: boolean;
  spare4: boolean;
}
