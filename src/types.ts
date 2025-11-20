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