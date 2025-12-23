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
  common_confirmExit: 'Are you sure you want to close the application?',
  
  // About
  about_description: 'Professional ECU Injection Management System for engine tuning and real-time monitoring. Supports multiple tuning maps, sensor calibration, and data visualization.',

  // Title Bar
  titleBar_appName: 'ECU Injection Management System',
  titleBar_connected: 'Connected',
  titleBar_disconnected: 'Disconnected',

  // Menu Bar
  menu_file: 'File',
  menu_data: 'Data',
  menu_selectPort: 'Select Port',
  menu_learnTps: 'Learn TPS',
  menu_importToCurrent: 'Import to Current',
  menu_copyDataTo: 'Copy Data To',
  menu_copyToAll: 'Copy current data to all...',
  menu_testInjector: 'Test Injector',
  menu_afr: 'AFR',
  menu_afr_record: 'Record AFR',
  menu_afr_adjust: 'AFR Injection Adjustment',
  menu_help: 'Help',
  menu_help_login: 'Login',
  menu_help_setColor: 'Set Color',
  menu_help_manual: 'Software User Manual',
  menu_help_operation: 'Software Typical Operation',
  menu_help_about: 'About',

  // Data Menu
  data_readCurrent: 'Read Current',
  data_sendCurrent: 'Send Current',
  data_readAll: 'Read All',
  data_sendAll: 'Send All',
  data_restoreFactory: 'Restore Factory Data',

  // Idle & Limit
  idleLimit_idleRpmCold: 'Idle RPM Cold',
  idleLimit_idleReturnCold: 'Idle Return Cold',
  idleLimit_idleRpmHot: 'Idle RPM Hot',
  idleLimit_idleReturnHot: 'Idle Return Hot',
  idleLimit_enterExitSensitivity: 'Enter/Exit Sensitivity',
  idleLimit_accelEnrichPercent: 'Accel Enrich %',
  idleLimit_maxRpm: 'Max RPM',
  idleLimit_vvtOpenRpm: 'VVT Open RPM',
  idleLimit_autoClutch: 'Auto Clutch',
  idleLimit_spare: 'Spare',
  idleLimit_configBits: 'Config Bits',
  idleLimit_spare1: 'Spare 1',
  idleLimit_spare2: 'Spare 2',
  idleLimit_spare3: 'Spare 3',
  idleLimit_spare4: 'Spare 4',

  data_add1: 'Add 1',
  data_sub1: 'Subtract 1',
  data_add01: 'Add 0.1',
  data_sub01: 'Subtract 0.1',
  data_add001: 'Add 0.01',
  data_sub001: 'Subtract 0.01',
  data_autoSmooth: 'Auto Smooth',

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
  controllers_tableDisabledMsg: 'Table editing is disabled while controllers are active',
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
  mapTable_table1Active: 'Table 1',
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
  lang_es: 'Español',
  lang_pt: 'Português',
  lang_id: 'Bahasa Indonesia',
  lang_vi: 'Tiếng Việt',
  lang_tr: 'Türkçe',
  lang_ar: 'العربية',

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

  // Additional parameter categories
  params_limiters: 'Limiters',
  params_outputs: 'Outputs',
  
  // Parameters Page - Sub Tabs
  params_tab_afrVoltage: 'AFR-Voltage Relationship',
  params_tab_iatVoltage: 'IAT-Voltage Relationship',
  params_tab_ectVoltage: 'ECT-Voltage Relationship',
  params_tab_pressureVoltage: 'MAP-Voltage Relationship',
  params_tab_tpsSettings: 'TPS Settings',
  params_tab_rpmSettings: 'RPM Settings',
  
  // Remote Tuning
  menu_remote: 'الضبط البعيد',
  remote_title: 'اتصال الضبط البعيد',
  remote_serverAddress: 'عنوان الخادم',
  remote_roomId: 'معرّف الغرفة (معرّف الجلسة)',
  remote_role: 'الدور',
  remote_ecuRole: 'وحدة التحكم (في الموقع)',
  remote_expertRole: 'خبير (بعيد)',
  remote_connect: 'الاتصال',
  remote_disconnect: 'قطع الاتصال',
  remote_status_connected: 'الحالة: متصل',
  remote_status_disconnected: 'الحالة: غير متصل',
  remote_connectionFailed: 'خطأ في الاتصال البعيد',
  remote_connectedSuccess: 'متصل بخادم بعيد',
  remote_disconnectedNotify: 'تم قطع الاتصال البعيد',
};
