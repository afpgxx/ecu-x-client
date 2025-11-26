export default {
  // 通用
  common_save: 'บันทึก',
  common_open: 'เปิด',
  common_download: 'ดาวน์โหลด',
  common_upload: 'อัปโหลด',
  common_refresh: 'รีเฟรชข้อมูล',
  common_close: 'ปิด',
  common_cancel: 'ยกเลิก',
  common_confirm: 'ยืนยัน',
  common_delete: 'ลบ',
  common_edit: 'แก้ไข',
  common_add: 'เพิ่ม',
  common_search: 'ค้นหา',
  common_reset: 'รีเซ็ต',
  common_settings: 'การตั้งค่า',
  
  // เกี่ยวกับ
  about_description: 'ระบบจัดการ ECU ฉีดน้ำมันเชื้อเพลิงระดับมืออาชีพสำหรับการปรับแต่งเครื่องยนต์และการตรวจสอบแบบเรียลไทม์ รองรับแผนที่การปรับแต่งหลายรูปแบบ การปรับเทียบเซ็นเซอร์ และการแสดงภาพข้อมูล',

  // 標題欄
  titleBar_appName: 'ระบบจัดการ ECU ฉีดเชื้อเพลิง',
  titleBar_version: 'v1.0',
  titleBar_connected: 'เชื่อมต่อแล้ว',
  titleBar_disconnected: 'ไม่ได้เชื่อมต่อ',

  // 選單欄
  menu_file: 'ไฟล์',
  menu_edit: 'แก้ไข',
  menu_view: 'มุมมอง',
  menu_ecu: 'ECU',
  menu_dataLog: 'บันทึกข้อมูล',
  menu_tools: 'เครื่องมือ',
  menu_window: 'หน้าต่าง',
  menu_help: 'ช่วยเหลือ',

  // 工具列
  toolbar_burn: 'เขียนข้อมูล',
  toolbar_startSimulation: 'เริ่มการจำลอง',
  toolbar_stopSimulation: 'หยุดการจำลอง',

  // 感測器
  sensors_title: 'เซ็นเซอร์',
  sensors_realtime: 'เรียลไทม์',
  sensors_ect: 'อุณหภูมิน้ำ',
  sensors_iat: 'อุณหภูมิอากาศ',
  sensors_map: 'ความดัน',
  sensors_ign: 'มุมจุดระเบิด',
  sensors_inj: 'ฉีดเชื้อเพลิง',
  sensors_battery: 'แรงดันไฟฟ้า',
  sensors_tps: 'ลิ้นเร่ง',
  sensors_rpm: 'รอบเครื่องยนต์',
  sensors_afr: 'อัตราส่วนอากาศ-เชื้อเพลิง',

  // 控制器
  controllers_title: 'การควบคุมแบบเรียลไทม์',
  controllers_enabled: 'เปิดใช้งาน',
  controllers_disabled: 'ปิดใช้งาน',
  controllers_idleControl: 'ควบคุมรอบเดินเบา',
  controllers_ignitionControl: 'ควบคุมมุมจุดระเบิด',
  controllers_fuelControl: 'ควบคุมปริมาณเชื้อเพลิง',
  controllers_modeSelect: 'เลือกโหมด',

  // 標籤頁
  tabs_fuelMap: 'ปริมาณเชื้อเพลิง',
  tabs_fuelAdvance: 'มุมล่วงหน้าเชื้อเพลิง',
  tabs_ignitionAngle: 'มุมจุดระเบิด',
  tabs_dwellTime: 'เวลาสะสมพลังงาน',
  tabs_afr: 'อัตราส่วนอากาศ-เชื้อเพลิง',
  tabs_ectCompFuel: 'ค่าชดเชยอุณหภูมิสูบ (เชื้อเพลิง)',
  tabs_ectCompIgn: 'ค่าชดเชยอุณหภูมิสูบ (จุดระเบิด)',
  tabs_mapComp: 'ค่าชดเชยความดันอากาศ',
  tabs_idleLimit: 'รอบเดินเบาและจำกัดความเร็ว',
  tabs_otherOptions: 'ตัวเลือกอื่นๆ',
  tabs_parameters: 'พารามิเตอร์',
  tabs_settingsInfo: 'การตั้งค่าและข้อมูล',

  // 狀態列
  statusBar_ecuSync: 'ECU ซิงค์',
  statusBar_throttle: 'ลิ้นเร่ง',
  statusBar_pressure: 'ความดัน',
  statusBar_coolantTemp: 'อุณหภูมิน้ำ',
  statusBar_usbDriver: 'ไดรเวอร์ FTDI USB',
  statusBar_baudRate: '115200 บอดเรต',

  // 設定頁面
  settings_title: 'การตั้งค่าระบบ',
  settings_language: 'การตั้งค่าภาษา',
  settings_connection: 'การตั้งค่าการเชื่อมต่อ',
  settings_display: 'การตั้งค่าการแสดงผล',
  settings_about: 'เกี่ยวกับ',
  settings_languageHint: 'เลือกภาษาอินเทอร์เฟซ',

  // 參數頁面
  parameters_title: 'การกำหนดค่าพารามิเตอร์',
  parameters_engineParams: 'พารามิเตอร์เครื่องยนต์',
  parameters_sensorParams: 'พารามิเตอร์เซ็นเซอร์',
  parameters_calibration: 'พารามิเตอร์การสอบเทียบ',

  // Parameters Page - Basic Engine
  params_basicEngine: 'Basic Engine',
  params_displacement: 'Displacement',
  params_cylinders: 'Cylinders',
  params_stroke: 'Stroke',
  params_revLimit: 'Rev Limit',
  params_targetIdle: 'Target Idle',
  
  // Parameters Page - Trigger
  params_trigger: 'Trigger',
  params_triggerMode: 'Trigger Mode',
  params_offset: 'Offset',
  params_noiseFilter: 'Noise Filter',
  params_syncCycle: 'Sync Cycle',
  
  // Parameters Page - Injection
  params_injection: 'Injection',
  params_flowRate: 'Flow Rate',
  params_deadTime: 'Dead Time',
  params_fuelPres: 'Fuel Pres',
  params_loadSource: 'Load Source',
  
  // Parameters Page - Calibration
  params_calibration: 'Calibration',
  params_mapSensor: 'MAP Sensor',
  params_tpsMinAdc: 'Min ADC',
  params_tpsMaxAdc: 'Max ADC',
  params_iatBiasRes: 'Bias Res',
  params_autoCalibTps: 'Auto Calibrate TPS',
  
  // Parameters Page - Units
  params_unit_cc: 'cc',
  params_unit_rpm: 'RPM',
  params_unit_stroke: 'Stroke',
  params_unit_degree: '°',
  params_unit_level: 'Level',
  params_unit_cycle: 'Cycle',
  params_unit_ccmin: 'cc/min',
  params_unit_ms: 'ms',
  params_unit_kpa: 'kPa',
  params_unit_v: 'V',
  params_unit_ohm: 'Ω',

  // 其它選項
  otherOptions_title: 'ตัวเลือกอื่นๆ',
  otherOptions_advanced: 'การตั้งค่าขั้นสูง',
  otherOptions_diagnostic: 'ตัวเลือกการวินิจฉัย',
  
  // Other Options Page
  otherOptions_throttleMin: 'Throttle Voltage (Min)',
  otherOptions_throttleMax: 'Throttle Voltage (Max)',
  otherOptions_idleMinInjCold: 'Idle Min Inj (Cold)',
  otherOptions_idleMinInjHot: 'Idle Min Inj (Hot)',
  otherOptions_idleAutoAngle: 'Idle Auto Angle (±°)',
  otherOptions_idleAutoInj: 'Idle Auto Inj (±ms)',
  
  otherOptions_idleSteps: 'Idle Motor Steps',
  otherOptions_fanTemp: 'Fan On Temp',
  otherOptions_o2Work: 'O2 Work (ECT Volt)',
  otherOptions_o2Delay: 'O2 Delay',
  otherOptions_o2Rpm: 'O2 Work RPM',
  otherOptions_o2Inj: 'O2 Adjust Inj',
  
  otherOptions_startEnrichRpm: 'Start Enrich RPM',
  otherOptions_idleHoleMax: 'Idle Hole Max',
  otherOptions_idleHoleMin: 'Idle Hole Min',
  otherOptions_idleHoleMaxAdj: 'Idle Hole Max Adj',

  otherOptions_tab_tempIdle: 'Temp-Idle Motor',
  otherOptions_tab_startEnrich: 'Start Enrichment',
  otherOptions_tab_iatComp: 'IAT Comp Inj',
  otherOptions_tab_mapComp: 'MAP Comp Idle',
  otherOptions_tab_extAdj: 'External Adjust',

  // 地圖表格
  mapTable_table1Active: 'ตาราง 1 (ใช้งาน)',
  mapTable_table2: 'ตาราง 2',
  mapTable_unit: 'หน่วย',
  mapTable_percentage: 'เปอร์เซ็นต์ (%)',
  mapTable_rawValue: 'ค่าดิบ',
  mapTable_lambda: 'Lambda',

  // 語言名稱
  lang_zh_CN: '简体中文',
  lang_zh_TW: '繁體中文',
  lang_en: 'English',
  lang_ja: '日本語',
  lang_th: 'ไทย',
  lang_ko: '한국어',
  lang_ru: 'Русский',
  lang_de: 'Deutsch',
  lang_fr: 'Français',

  // Other Options Grid Rows
  otherOptions_row_stepTime: 'Step/Time',
  otherOptions_row_injVe: 'INJ VE(ms)',
  otherOptions_row_delayed: 'Delayed(Second)',
  otherOptions_row_injVeAdd: 'INJ VE Add(ms)',
  otherOptions_row_notStartedAdd: 'Not Started Add(ms)',
  otherOptions_row_injVeComp: 'INJ VE(±ms)',
  otherOptions_row_iat: 'IAT',
  otherOptions_row_ect: 'ECT',
  otherOptions_row_motorStep: 'Motor(±STEP)',
  otherOptions_row_injAdjPct: 'Inj Adj[±PCT]',
  otherOptions_row_ignAdjDeg: 'Ign Adj[±°]',

  // Parameters Page - Limiters
  params_limiters: 'ตัวจำกัด',
  params_outputs: 'เอาต์พุต',
  
  // Parameters Page - Sub Tabs
  params_tab_afrVoltage: 'ความสัมพันธ์ AFR-แรงดัน',
  params_tab_iatVoltage: 'ความสัมพันธ์ IAT-แรงดัน',
  params_tab_ectVoltage: 'ความสัมพันธ์ ECT-แรงดัน',
  params_tab_pressureVoltage: 'ความสัมพันธ์ MAP-แรงดัน',
  params_tab_tpsSettings: 'การตั้งค่า TPS',
  params_tab_rpmSettings: 'การตั้งค่า RPM',
};
