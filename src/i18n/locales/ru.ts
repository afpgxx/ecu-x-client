export default {
  // 通用
  common_save: 'Сохранить',
  common_open: 'Открыть',
  common_download: 'Скачать',
  common_upload: 'Загрузить',
  common_refresh: 'Обновить данные',
  common_close: 'Закрыть',
  common_cancel: 'Отмена',
  common_confirm: 'Подтвердить',
  common_delete: 'Удалить',
  common_edit: 'Редактировать',
  common_add: 'Добавить',
  common_search: 'Поиск',
  common_reset: 'Сбросить',
  common_settings: 'Настройки',

  // 標題欄
  titleBar_appName: 'Система управления ECU впрыском топлива',
  titleBar_version: 'v1.0',
  titleBar_connected: 'Подключено',
  titleBar_disconnected: 'Не подключено',

  // 選單欄
  menu_file: 'Файл',
  menu_edit: 'Редактировать',
  menu_view: 'Вид',
  menu_ecu: 'ECU',
  menu_dataLog: 'Журнал данных',
  menu_tools: 'Инструменты',
  menu_window: 'Окно',
  menu_help: 'Справка',

  // 工具列
  toolbar_burn: 'Записать',
  toolbar_startSimulation: 'Начать симуляцию',
  toolbar_stopSimulation: 'Остановить симуляцию',

  // 感測器
  sensors_title: 'Датчики',
  sensors_realtime: 'В реальном времени',
  sensors_ect: 'Температура охлаждающей жидкости',
  sensors_iat: 'Температура всасываемого воздуха',
  sensors_map: 'Давление',
  sensors_ign: 'Угол зажигания',
  sensors_inj: 'Впрыск',
  sensors_battery: 'Напряжение',
  sensors_tps: 'Дроссельная заслонка',
  sensors_rpm: 'Обороты',
  sensors_afr: 'Соотношение воздух-топливо',

  // 控制器
  controllers_title: 'Управление в реальном времени',
  controllers_enabled: 'Включено',
  controllers_disabled: 'Отключено',
  controllers_idleControl: 'Регулировка холостого хода',
  controllers_ignitionControl: 'Регулировка угла зажигания',
  controllers_fuelControl: 'Регулировка количества топлива',
  controllers_modeSelect: 'Выбор режима',

  // 標籤頁
  tabs_fuelMap: 'Количество топлива',
  tabs_fuelAdvance: 'Опережение впрыска',
  tabs_ignitionAngle: 'Угол зажигания',
  tabs_dwellTime: 'Время накопления энергии',
  tabs_afr: 'Соотношение воздух-топливо',
  tabs_ectCompFuel: 'Температурная компенсация (топливо)',
  tabs_ectCompIgn: 'Температурная компенсация (зажигание)',
  tabs_mapComp: 'Компенсация давления воздуха',
  tabs_idleLimit: 'Холостой ход и ограничение скорости',
  tabs_otherOptions: 'Другие опции',
  tabs_parameters: 'Параметры',
  tabs_settingsInfo: 'Настройки и информация',

  // 狀態列
  statusBar_ecuSync: 'Синхронизация ECU',
  statusBar_throttle: 'Дроссель',
  statusBar_pressure: 'Давление',
  statusBar_coolantTemp: 'Температура охлаждающей жидкости',
  statusBar_usbDriver: 'Драйвер FTDI USB',
  statusBar_baudRate: '115200 бод',

  // 設定頁面
  settings_title: 'Системные настройки',
  settings_language: 'Настройки языка',
  settings_connection: 'Настройки подключения',
  settings_display: 'Настройки отображения',
  settings_about: 'О программе',
  settings_languageHint: 'Выберите язык интерфейса',

  // 參數頁面
  parameters_title: 'Конфигурация параметров',
  parameters_engineParams: 'Параметры двигателя',
  parameters_sensorParams: 'Параметры датчиков',
  parameters_calibration: 'Параметры калибровки',

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
  otherOptions_title: 'Другие опции',
  otherOptions_advanced: 'Расширенные настройки',
  otherOptions_diagnostic: 'Параметры диагностики',

  // 地圖表格
  mapTable_table1Active: 'Таблица 1 (активна)',
  mapTable_table2: 'Таблица 2',
  mapTable_unit: 'Единица измерения',
  mapTable_percentage: 'Процент (%)',
  mapTable_rawValue: 'Исходное значение',
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
};
