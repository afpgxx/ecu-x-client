// MAP补偿专用进气压力坐标（KPa）
export const MAP_COMP_KPA_POINTS = [120, 108, 96, 84, 72, 60, 48, 36, 24, 12, 0];
// --- Encryption Key for Data Protection ---
export const SECRET_KEY = "MySuperSecretKey123!"; // Change this to a strong key in production

// --- Data Generation Constants ---
export const RPM_POINTS = [500, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000, 5500, 6000, 6500, 7000, 7500, 8000, 8500, 9000, 9500, 10000, 10500, 11000, 11500, 12000, 12500, 13000, 13500, 14000, 14500, 15000];
// 新版纵坐标，最后一项用 null 代表 IDLE，渲染时特殊处理
export const LOAD_POINTS = [100, 90, 80, 70, 60, 50, 40, 30, 20, 12, 6, 3, 0.5, null];

// --- Dwell Time Data (RPM vs Time) ---
export const DWELL_RPM_POINTS = [
  500, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000, 
  5500, 6000, 6500, 7000, 7500, 8000, 8500, 9000, 9500, 10000, 
  10500, 11000, 11500, 12000, 12500, 13000, 13500, 14000, 14500, 15000
];
// Fill with 8.81 as per screenshot UI hint
export const DWELL_DATA_POINTS = new Array(DWELL_RPM_POINTS.length).fill(8.81);

// --- ECT Compensation Data (2D: RPM x Temp) ---
// Y-Axis: Temp from 126 down to -14
export const ECT_COMP_TEMP_POINTS = [126, 112, 98, 84, 70, 56, 42, 28, 14, 0, -14];
// X-Axis: Re-use DWELL_RPM_POINTS (800-15000)
export const ECT_COMP_RPM_POINTS = DWELL_RPM_POINTS;

// Generate 2D data filled with 12.8
export const ECT_COMP_2D_DATA: number[][] = [];
for (let i = 0; i < ECT_COMP_TEMP_POINTS.length; i++) {
  const row = new Array(ECT_COMP_RPM_POINTS.length).fill(12.8);
  ECT_COMP_2D_DATA.push(row);
}

// --- Idle Limit Data ---
export const IDLE_LIMIT_RPM_POINTS = [0, 500, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000];
