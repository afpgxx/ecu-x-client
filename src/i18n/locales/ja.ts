export default {
  // 通用
  common_save: '保存',
  common_open: '開く',
  common_download: 'ダウンロード',
  common_upload: 'アップロード',
  common_refresh: 'データを更新',
  common_close: '閉じる',
  common_cancel: 'キャンセル',
  common_confirm: '確認',
  common_delete: '削除',
  common_edit: '編集',
  common_add: '追加',
  common_search: '検索',
  common_reset: 'リセット',
  common_settings: '設定',
  
  // について
  about_description: 'エンジンチューニングとリアルタイム監視のためのプロフェッショナルECU噴射管理システム。複数のチューニングマップ、センサー校正、データ可視化をサポート。',

  // 標題欄
  titleBar_appName: 'ECU燃料噴射管理システム',
  titleBar_connected: '接続済み',
  titleBar_disconnected: '未接続',

  // 選單欄
  menu_file: 'ファイル',
  menu_data: 'データ',
  menu_selectPort: 'ポート選択',
  menu_learnTps: 'TPS学習',
  menu_importToCurrent: '現在へインポート',
  menu_copyDataTo: 'データのコピー先',
  menu_copyToAll: '現在のデータをすべてにコピー...',
  menu_testInjector: 'インジェクターテスト',
  menu_afr: '空燃比',
  menu_afr_record: '空燃比記録',
  menu_afr_adjust: '空燃比噴射調整',
  menu_help: 'ヘルプ',
  menu_help_login: 'ログイン',
  menu_help_setColor: '色設定',
  menu_help_manual: 'ソフトウェアマニュアル',
  menu_help_operation: '一般的な操作',
  menu_help_about: 'バージョン情報',

  // データメニュー
  data_readCurrent: '現在値を読込',
  data_sendCurrent: '現在値を送信',
  data_readAll: '全データを読込',
  data_sendAll: '全データを送信',
  data_restoreFactory: '工場出荷時設定',
  data_add1: '+ 1',
  data_sub1: '- 1',
  data_add01: '+ 0.1',
  data_sub01: '- 0.1',
  data_add001: '+ 0.01',
  data_sub001: '- 0.01',
  data_autoSmooth: '自動スムージング',

  // 工具列
  toolbar_burn: '書き込み',
  toolbar_startSimulation: 'シミュレーション開始',
  toolbar_stopSimulation: 'シミュレーション停止',

  // 感測器
  sensors_title: 'センサー',
  sensors_realtime: 'リアルタイム',
  sensors_ect: '水温',
  sensors_iat: '吸気温度',
  sensors_map: '圧力',
  sensors_ign: '点火角',
  sensors_inj: '燃料噴射',
  sensors_battery: '電圧',
  sensors_tps: 'スロットル',
  sensors_rpm: '回転数',
  sensors_afr: '空燃比',

  // 控制器
  controllers_title: 'リアルタイム調整制御',
  controllers_enabled: '有効',
  controllers_disabled: '無効',
  controllers_idleControl: 'アイドル調整',
  controllers_ignitionControl: '点火角度調整',
  controllers_fuelControl: '燃料噴射量調整',
  controllers_modeSelect: 'モード選択',

  // 標籤頁
  tabs_fuelMap: '燃料噴射量',
  tabs_fuelAdvance: '燃料噴射進角',
  tabs_ignitionAngle: '点火角度',
  tabs_dwellTime: '蓄積時間',
  tabs_afr: '空燃比',
  tabs_ectCompFuel: 'シリンダー温度補正（燃料）',
  tabs_ectCompIgn: 'シリンダー温度補正（点火）',
  tabs_mapComp: '吸気圧力補正',
  tabs_idleLimit: 'アイドルと速度制限',
  tabs_otherOptions: 'その他のオプション',
  tabs_parameters: 'パラメータ',
  tabs_settingsInfo: '設定と情報',

  // 狀態列
  statusBar_ecuSync: 'ECU 同期',
  statusBar_throttle: 'スロットル',
  statusBar_pressure: '圧力',
  statusBar_coolantTemp: '水温',
  statusBar_usbDriver: 'FTDI USB ドライバー',
  statusBar_baudRate: '115200 ボーレート',

  // 設定頁面
  settings_title: 'システム設定',
  settings_language: '言語設定',
  settings_connection: '接続設定',
  settings_display: '表示設定',
  settings_about: 'について',
  settings_languageHint: 'インターフェース言語を選択',

  // 參數頁面
  parameters_title: 'パラメータ設定',
  parameters_engineParams: 'エンジンパラメータ',
  parameters_sensorParams: 'センサーパラメータ',
  parameters_calibration: 'キャリブレーションパラメータ',

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
  otherOptions_title: 'その他のオプション',
  otherOptions_advanced: '詳細設定',
  otherOptions_diagnostic: '診断オプション',

  // 地圖表格
  mapTable_table1Active: '表 1',
  mapTable_table2: 'テーブル 2',
  mapTable_unit: '単位',
  mapTable_percentage: 'パーセンテージ (%)',
  mapTable_rawValue: '生の値',
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

  // 新増的參數類別
  params_limiters: 'リミッター',
  params_outputs: '出力設定',
  
  // パラメータページ - サブタブ
  params_tab_afrVoltage: '空燃比-電圧関係',
  params_tab_iatVoltage: '吸気温度-電圧関係',
  params_tab_ectVoltage: '冷却水温度-電圧関係',
  params_tab_pressureVoltage: '吸気圧力-電圧関係',
  params_tab_tpsSettings: 'TPS設定',
  params_tab_rpmSettings: 'RPM設定',
};
