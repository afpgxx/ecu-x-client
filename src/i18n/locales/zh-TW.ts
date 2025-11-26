export default {
  // 通用
  common_save: '儲存',
  common_open: '開啟',
  common_download: '下載',
  common_upload: '上傳',
  common_refresh: '重新整理資料',
  common_close: '關閉',
  common_cancel: '取消',
  common_confirm: '確認',
  common_delete: '刪除',
  common_edit: '編輯',
  common_add: '新增',
  common_search: '搜尋',
  common_reset: '重設',
  common_settings: '設定',

  // 標題欄
  titleBar_appName: 'ECU電噴管理系統',
  titleBar_version: 'v1.0',
  titleBar_connected: '已連線',
  titleBar_disconnected: '未連線',

  // 選單欄
  menu_file: '檔案',
  menu_edit: '編輯',
  menu_view: '檢視',
  menu_ecu: 'ECU',
  menu_dataLog: '資料紀錄',
  menu_tools: '工具',
  menu_window: '視窗',
  menu_help: '說明',

  // 工具列
  toolbar_burn: '燒錄',
  toolbar_startSimulation: '開始模擬',
  toolbar_stopSimulation: '停止模擬',

  // 感測器
  sensors_title: '感測器',
  sensors_realtime: '即時',
  sensors_ect: '水溫',
  sensors_iat: '進氣溫度',
  sensors_map: '壓力',
  sensors_ign: '點火角',
  sensors_inj: '噴油',
  sensors_battery: '電壓',
  sensors_tps: '節氣門',
  sensors_rpm: '轉速',
  sensors_afr: '空燃比',

  // 控制器
  controllers_title: '即時調節控制',
  controllers_enabled: '已啟用',
  controllers_disabled: '已停用',
  controllers_idleControl: '怠速調節',
  controllers_ignitionControl: '點火角度調節',
  controllers_fuelControl: '噴油量調節',
  controllers_modeSelect: '模式選擇',

  // 標籤頁
  tabs_fuelMap: '噴油量',
  tabs_fuelAdvance: '噴油提前角',
  tabs_ignitionAngle: '點火角度',
  tabs_dwellTime: '儲能時間',
  tabs_afr: '空燃比',
  tabs_ectCompFuel: '缸溫補償噴油',
  tabs_ectCompIgn: '缸溫補償點火',
  tabs_mapComp: '進氣壓力補償',
  tabs_idleLimit: '怠速與限速',
  tabs_otherOptions: '其它選項',
  tabs_parameters: '參數',
  tabs_settingsInfo: '設定與資訊',

  // 狀態列
  statusBar_ecuSync: 'ECU 同步',
  statusBar_throttle: '節氣門',
  statusBar_pressure: '壓力',
  statusBar_coolantTemp: '水溫',
  statusBar_usbDriver: 'FTDI USB 驅動程式',
  statusBar_baudRate: '115200 鮑率',

  // 設定頁面
  settings_title: '系統設定',
  settings_language: '語言設定',
  settings_connection: '連線設定',
  settings_display: '顯示設定',
  settings_about: '關於',
  settings_languageHint: '選擇介面語言',

  // 參數頁面
  parameters_title: '參數配置',
  parameters_engineParams: '引擎參數',
  parameters_sensorParams: '感測器參數',
  parameters_calibration: '校準參數',

  // 参数页面 - 基础参数
  params_basicEngine: '基礎參數',
  params_displacement: '發動機排量',
  params_cylinders: '氣缸數量',
  params_stroke: '衝程類型',
  params_revLimit: '最高轉速限制',
  params_targetIdle: '怠速目標',
  
  // 参数页面 - 触发信号
  params_trigger: '觸發信號',
  params_triggerMode: '觸發模式',
  params_offset: '觸發角度偏置',
  params_noiseFilter: '信號濾波',
  params_syncCycle: '啟動同步圈數',
  
  // 参数页面 - 喷油系统
  params_injection: '噴油系統',
  params_flowRate: '噴油嘴流量',
  params_deadTime: '死區時間',
  params_fuelPres: '燃油壓力',
  params_loadSource: '主負載信號',
  
  // 参数页面 - 传感器校准
  params_calibration: '傳感器校準',
  params_mapSensor: 'MAP 傳感器',
  params_tpsMinAdc: 'TPS 關閉電壓',
  params_tpsMaxAdc: 'TPS 全開電壓',
  params_iatBiasRes: 'IAT 偏置電阻',
  params_autoCalibTps: '自動校準 TPS',
  
  // 参数页面 - 单位
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
  otherOptions_title: '其它選項',
  otherOptions_advanced: '進階設定',
  otherOptions_diagnostic: '診斷選項',

  // 其它選項頁面
  otherOptions_throttleMin: '節氣門電壓(最小)',
  otherOptions_throttleMax: '節氣門電壓(最大)',
  otherOptions_idleMinInjCold: '怠速最小噴油量(冷車)',
  otherOptions_idleMinInjHot: '怠速最小噴油量(熱車)',
  otherOptions_idleAutoAngle: '怠速自動調節角度(±°)',
  otherOptions_idleAutoInj: '怠速自動調節噴油(±ms)',
  
  otherOptions_idleSteps: '怠速電機總步數',
  otherOptions_fanTemp: '開啟風扇溫度',
  otherOptions_o2Work: '氧傳感器工作(缸溫電壓)',
  otherOptions_o2Delay: '氧傳感器延時工作',
  otherOptions_o2Rpm: '氧傳感器工作轉速',
  otherOptions_o2Inj: '氧傳感器調節噴油',
  
  otherOptions_startEnrichRpm: '啟動加噴轉速',
  otherOptions_idleHoleMax: '怠速孔最大值',
  otherOptions_idleHoleMin: '怠速孔最小值',
  otherOptions_idleHoleMaxAdj: '怠速孔最大調節值',

  otherOptions_tab_tempIdle: '溫度-怠速電機關係',
  otherOptions_tab_startEnrich: '啟動加噴',
  otherOptions_tab_iatComp: '進氣溫度補償噴油',
  otherOptions_tab_mapComp: '進氣壓力補償怠速電機',
  otherOptions_tab_extAdj: '外部調節',

  // 地圖表格
  mapTable_table1Active: '表 1 (啟用)',
  mapTable_table2: '表 2',
  mapTable_unit: '單位',
  mapTable_percentage: '百分比 (%)',
  mapTable_rawValue: '原始值',
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
  
  // 其它選項 - 表格列
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

  // 新增參數類別
  params_limiters: '限速保護',
  params_outputs: '輸出設定',
  
  // 參數頁面 - 子標籤
  params_tab_afrVoltage: '空燃比-電壓關係',
  params_tab_iatVoltage: '空氣溫度-電壓關係',
  params_tab_ectVoltage: '冷卻液溫度-電壓關係',
  params_tab_pressureVoltage: '進氣壓力-電壓關係',
  params_tab_tpsSettings: 'TPS設定',
  params_tab_rpmSettings: 'RPM設定',
};
