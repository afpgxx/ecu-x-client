export default {
  // Common
  common_save: 'Save',
  common_open: 'Open',
  common_download: 'Download',
  common_upload: 'Upload',
  common_refresh: 'Refresh Data',
  common_close: 'Close',
  common_cancel: 'Cancel',
  common_confirm: 'Confirm',
  common_delete: 'Delete',
  common_edit: 'Edit',
  common_add: 'Add',
  common_search: 'Search',
  common_reset: 'Reset',
  common_settings: 'Settings',

  // Title Bar
  titleBar_appName: 'ECU Injection Management System',
  titleBar_version: 'v1.0',
  titleBar_connected: 'Connected',
  titleBar_disconnected: 'Disconnected',

  // Menu Bar
  menu_file: 'File',
  menu_edit: 'Edit',
  menu_view: 'View',
  menu_ecu: 'ECU',
  menu_dataLog: 'Data Log',
  menu_tools: 'Tools',
  menu_window: 'Window',
  menu_help: 'Help',

  // Toolbar
  toolbar_burn: 'Burn',
  toolbar_startSimulation: 'Start Simulation',
  toolbar_stopSimulation: 'Stop Simulation',

  // Sensors
  sensors_title: 'Sensors',
  sensors_realtime: 'Realtime',
  sensors_ect: 'Coolant',
  sensors_iat: 'Intake',
  sensors_map: 'Pressure',
  sensors_ign: 'Ignition',
  sensors_inj: 'Injection',
  sensors_battery: 'Battery',
  sensors_tps: 'Throttle',
  sensors_rpm: 'RPM',
  sensors_afr: 'AFR',

  // Controllers
  controllers_title: 'Real-time Control',
  controllers_enabled: 'Enabled',
  controllers_disabled: 'Disabled',
  controllers_idleControl: 'Idle Control',
  controllers_ignitionControl: 'Ignition Control',
  controllers_fuelControl: 'Fuel Control',
  controllers_modeSelect: 'Mode Select',

  // Tabs
  tabs_fuelMap: 'Fuel Map',
  tabs_fuelAdvance: 'Fuel Advance',
  tabs_ignitionAngle: 'Ignition Angle',
  tabs_dwellTime: 'Dwell Time',
  tabs_afr: 'AFR',
  tabs_ectCompFuel: 'ECT Comp Fuel',
  tabs_ectCompIgn: 'ECT Comp Ign',
  tabs_mapComp: 'MAP Compensation',
  tabs_idleLimit: 'Idle & Limit',
  tabs_otherOptions: 'Other Options',
  tabs_parameters: 'Parameters',
  tabs_settingsInfo: 'Settings & Info',

  // Status Bar
  statusBar_ecuSync: 'ECU Sync',
  statusBar_throttle: 'Throttle',
  statusBar_pressure: 'Pressure',
  statusBar_coolantTemp: 'Coolant',
  statusBar_usbDriver: 'FTDI USB Driver',
  statusBar_baudRate: '115200 Baud',

  // Settings Page
  settings_title: 'System Settings',
  settings_language: 'Language',
  settings_connection: 'Connection',
  settings_display: 'Display',
  settings_about: 'About',
  settings_languageHint: 'Select interface language',

  // Parameters Page
  parameters_title: 'Parameters',
  parameters_engineParams: 'Engine Parameters',
  parameters_sensorParams: 'Sensor Parameters',
  parameters_calibration: 'Calibration',
  
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

  // Other Options
  otherOptions_title: 'Other Options',
  otherOptions_advanced: 'Advanced',
  otherOptions_diagnostic: 'Diagnostic',

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

  // Map Table
  mapTable_table1Active: 'Table 1 (Active)',
  mapTable_table2: 'Table 2',
  mapTable_unit: 'Unit',
  mapTable_percentage: 'Percentage (%)',
  mapTable_rawValue: 'Raw Value',
  mapTable_lambda: 'Lambda',

  // Language Names
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
};
