export default {
  // 通用
  common_save: 'Speichern',
  common_open: 'Öffnen',
  common_download: 'Herunterladen',
  common_upload: 'Hochladen',
  common_refresh: 'Daten aktualisieren',
  common_close: 'Schließen',
  common_cancel: 'Abbrechen',
  common_confirm: 'Bestätigen',
  common_delete: 'Löschen',
  common_edit: 'Bearbeiten',
  common_add: 'Hinzufügen',
  common_search: 'Suchen',
  common_reset: 'Zurücksetzen',
  common_settings: 'Einstellungen',
  common_confirmExit: 'Möchten Sie die Anwendung wirklich schließen?',
  
  // Über
  about_description: 'Professionelles ECU-Einspritzverwaltungssystem für Motor-Tuning und Echtzeit-Überwachung. Unterstützt mehrere Tuning-Karten, Sensorkalibrierung und Datenvisualisierung.',

  // 標題欄
  titleBar_appName: 'ECU Einspritzverwaltungssystem',
  titleBar_connected: 'Verbunden',
  titleBar_disconnected: 'Getrennt',

  // 選單欄
  menu_file: 'Datei',
  menu_data: 'Daten',
  menu_selectPort: 'Port wählen',
  menu_learnTps: 'TPS lernen',
  menu_importToCurrent: 'In Aktuelle importieren',
  menu_copyDataTo: 'Daten kopieren nach',
  menu_copyToAll: 'Aktuelle Daten in alle kopieren...',
  menu_testInjector: 'Injektor testen',
  menu_afr: 'AFR',
  menu_afr_record: 'AFR aufzeichnen',
  menu_afr_adjust: 'AFR-Einspritzanpassung',
  menu_help: 'Hilfe',
  menu_help_login: 'Anmelden',
  menu_help_setColor: 'Farbe einstellen',
  menu_help_manual: 'Software-Handbuch',
  menu_help_operation: 'Typische Bedienung',
  menu_help_about: 'Über',

  // Datenmenü
  data_readCurrent: 'Aktuelle lesen',
  data_sendCurrent: 'Aktuelle senden',
  data_readAll: 'Alle lesen',
  data_sendAll: 'Alle senden',
  data_restoreFactory: 'Werkseinstellungen',

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

  data_add1: '+ 1',
  data_sub1: '- 1',
  data_add01: '+ 0.1',
  data_sub01: '- 0.1',
  data_add001: '+ 0.01',
  data_sub001: '- 0.01',
  data_autoSmooth: 'Auto-Glätten',

  // 工具列
  toolbar_burn: 'Schreiben',
  toolbar_startSimulation: 'Simulation starten',
  toolbar_stopSimulation: 'Simulation stoppen',

  // 感測器
  sensors_title: 'Sensoren',
  sensors_realtime: 'Echtzeit',
  sensors_ect: 'Kühlmitteltemperatur',
  sensors_iat: 'Ansauglufttemperatur',
  sensors_map: 'Druck',
  sensors_ign: 'Zündwinkel',
  sensors_inj: 'Einspritzung',
  sensors_battery: 'Spannung',
  sensors_tps: 'Drosselklappe',
  sensors_rpm: 'Drehzahl',
  sensors_afr: 'Luft-Kraftstoff-Verhältnis',

  // 控制器
  controllers_title: 'Echtzeitsteuerung',
  controllers_enabled: 'Aktiviert',
  controllers_disabled: 'Deaktiviert',
  controllers_tableDisabledMsg: 'Die Tabellenbearbeitung ist deaktiviert, wenn die Controller aktiv sind',
  controllers_idleControl: 'Leerlaufsteuerung',
  controllers_ignitionControl: 'Zündwinkelsteuerung',
  controllers_fuelControl: 'Kraftstoffmengensteuerung',
  controllers_modeSelect: 'Modus auswählen',

  // 標籤頁
  tabs_fuelMap: 'Kraftstoffmenge',
  tabs_fuelAdvance: 'Einspritzvorverstellung',
  tabs_ignitionAngle: 'Zündwinkel',
  tabs_dwellTime: 'Ladezeit',
  tabs_afr: 'Luft-Kraftstoff-Verhältnis',
  tabs_ectCompFuel: 'Zylindertemperaturkompensation (Kraftstoff)',
  tabs_ectCompIgn: 'Zylindertemperaturkompensation (Zündung)',
  tabs_mapComp: 'Ansaugdruckkompensation',
  tabs_idleLimit: 'Leerlauf und Geschwindigkeitsbegrenzung',
  tabs_otherOptions: 'Weitere Optionen',
  tabs_parameters: 'Parameter',
  tabs_settingsInfo: 'Einstellungen und Informationen',

  // 狀態列
  statusBar_ecuSync: 'ECU-Synchronisierung',
  statusBar_throttle: 'Drosselklappe',
  statusBar_pressure: 'Druck',
  statusBar_coolantTemp: 'Kühlmitteltemperatur',
  statusBar_usbDriver: 'FTDI USB-Treiber',
  statusBar_baudRate: '115200 Baudrate',

  // 設定頁面
  settings_title: 'Systemeinstellungen',
  settings_language: 'Spracheinstellungen',
  settings_connection: 'Verbindungseinstellungen',
  settings_display: 'Anzeigeeinstellungen',
  settings_about: 'Über',
  settings_languageHint: 'Oberflächensprache auswählen',

  // 參數頁面
  parameters_title: 'Parameterkonfiguration',
  parameters_engineParams: 'Motorparameter',
  parameters_sensorParams: 'Sensorparameter',
  parameters_calibration: 'Kalibrierungsparameter',

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
  otherOptions_title: 'Weitere Optionen',
  otherOptions_advanced: 'Erweiterte Einstellungen',
  otherOptions_diagnostic: 'Diagnoseoptionen',

  // 地圖表格
  mapTable_table1Active: 'Tabelle 1',
  mapTable_table2: 'Tabelle 2',
  mapTable_unit: 'Einheit',
  mapTable_percentage: 'Prozent (%)',
  mapTable_rawValue: 'Rohwert',
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
  params_limiters: 'Begrenzer',

  // Parameters Page - Outputs
  params_outputs: 'Ausgänge',
  
  // Parameterseite - Unterregisterkarten
  params_tab_afrVoltage: 'AFR-Spannungs-Beziehung',
  params_tab_iatVoltage: 'IAT-Spannungs-Beziehung',
  params_tab_ectVoltage: 'ECT-Spannungs-Beziehung',
  params_tab_pressureVoltage: 'MAP-Spannungs-Beziehung',
  params_tab_tpsSettings: 'TPS-Einstellungen',
  params_tab_rpmSettings: 'RPM-Einstellungen',
};
