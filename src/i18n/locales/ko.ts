export default {
  // 통용
  common_save: '저장',
  common_open: '열기',
  common_download: '다운로드',
  common_upload: '업로드',
  common_refresh: '데이터 새로고침',
  common_close: '닫기',
  common_cancel: '취소',
  common_confirm: '확인',
  common_delete: '삭제',
  common_edit: '편집',
  common_add: '추가',
  common_search: '검색',
  common_reset: '재설정',
  common_settings: '설정',
  
  // 정보
  about_description: '엔진 튜닝 및 실시간 모니터링을 위한 전문 ECU 분사 관리 시스템. 다양한 튜닝 맵, 센서 보정 및 데이터 시각화를 지원합니다.',

  // 標題欄
  titleBar_appName: 'ECU 연료분사 관리 시스템',
  titleBar_connected: '연결됨',
  titleBar_disconnected: '연결 안 됨',

  // 選單欄
  menu_file: '파일',
  menu_data: '데이터',
  menu_selectPort: '포트 선택',
  menu_learnTps: 'TPS 학습',
  menu_importToCurrent: '현재로 가져오기',
  menu_copyDataTo: '데이터 복사 대상',
  menu_copyToAll: '현재 데이터를 모두에게 복사...',
  menu_testInjector: '인젝터 테스트',
  menu_afr: 'AFR',
  menu_afr_record: 'AFR 기록',
  menu_afr_adjust: 'AFR 분사 조정',
  menu_help: '도움말',
  menu_help_login: '로그인',
  menu_help_setColor: '색상 설정',
  menu_help_manual: '소프트웨어 매뉴얼',
  menu_help_operation: '일반적인 작업',
  menu_help_about: '정보',

  // 데이터 메뉴
  data_readCurrent: '현재 값 읽기',
  data_sendCurrent: '현재 값 보내기',
  data_readAll: '모두 읽기',
  data_sendAll: '모두 보내기',
  data_restoreFactory: '공장 초기화',

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
  data_autoSmooth: '자동 다듬기',

  // 工具列
  toolbar_burn: '쓰기',
  toolbar_startSimulation: '시뮬레이션 시작',
  toolbar_stopSimulation: '시뮬레이션 중지',

  // 感測器
  sensors_title: '센서',
  sensors_realtime: '실시간',
  sensors_ect: '수온',
  sensors_iat: '흡기 온도',
  sensors_map: '압력',
  sensors_ign: '점화각',
  sensors_inj: '연료분사',
  sensors_battery: '전압',
  sensors_tps: '스로틀',
  sensors_rpm: '회전수',
  sensors_afr: '공연비',

  // 控制器
  controllers_title: '실시간 조정 제어',
  controllers_enabled: '활성화됨',
  controllers_disabled: '비활성화됨',
  controllers_idleControl: '공회전 조정',
  controllers_ignitionControl: '점화각 조정',
  controllers_fuelControl: '연료분사량 조정',
  controllers_modeSelect: '모드 선택',

  // 標籤頁
  tabs_fuelMap: '연료분사량',
  tabs_fuelAdvance: '연료분사 진각',
  tabs_ignitionAngle: '점화각',
  tabs_dwellTime: '축적 시간',
  tabs_afr: '공연비',
  tabs_ectCompFuel: '실린더 온도 보정 (연료)',
  tabs_ectCompIgn: '실린더 온도 보정 (점화)',
  tabs_mapComp: '흡기압력 보정',
  tabs_idleLimit: '공회전 및 속도 제한',
  tabs_otherOptions: '기타 옵션',
  tabs_parameters: '매개변수',
  tabs_settingsInfo: '설정 및 정보',

  // 狀態列
  statusBar_ecuSync: 'ECU 동기화',
  statusBar_throttle: '스로틀',
  statusBar_pressure: '압력',
  statusBar_coolantTemp: '수온',
  statusBar_usbDriver: 'FTDI USB 드라이버',
  statusBar_baudRate: '115200 보드레이트',

  // 設定頁面
  settings_title: '시스템 설정',
  settings_language: '언어 설정',
  settings_connection: '연결 설정',
  settings_display: '표시 설정',
  settings_about: '정보',
  settings_languageHint: '인터페이스 언어 선택',

  // 參數頁面
  parameters_title: '매개변수 구성',
  parameters_engineParams: '엔진 매개변수',
  parameters_sensorParams: '센서 매개변수',
  parameters_calibration: '보정 매개변수',

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
  otherOptions_title: '기타 옵션',
  otherOptions_advanced: '고급 설정',
  otherOptions_diagnostic: '진단 옵션',

  // 地圖表格
  mapTable_table1Active: '표 1',
  mapTable_table2: '테이블 2',
  mapTable_unit: '단위',
  mapTable_percentage: '백분율 (%)',
  mapTable_rawValue: '원시 값',
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

  // 추가된 매개변수 카테고리
  params_limiters: '리미터',
  params_outputs: '출력',
  
  // 매개변수 페이지 - 하위 탭
  params_tab_afrVoltage: 'AFR-전압 관계',
  params_tab_iatVoltage: 'IAT-전압 관계',
  params_tab_ectVoltage: 'ECT-전압 관계',
  params_tab_pressureVoltage: 'MAP-전압 관계',
  params_tab_tpsSettings: 'TPS 설정',
  params_tab_rpmSettings: 'RPM 설정',
};
