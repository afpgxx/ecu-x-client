export default {
  // 通用
  common_save: '保存',
  common_open: '打开',
  common_download: '下载',
  common_upload: '上传',
  common_refresh: '刷新数据',
  common_close: '关闭',
  common_cancel: '取消',
  common_confirm: '确认',
  common_delete: '删除',
  common_edit: '编辑',
  common_add: '添加',
  common_search: '搜索',
  common_reset: '重置',
  common_settings: '设置',

  // 标题栏
  titleBar_appName: 'ECU电喷管理系统',
  titleBar_version: 'v1.0',
  titleBar_connected: '已连接',
  titleBar_disconnected: '未连接',

  // 菜单栏
  menu_file: '文件',
  menu_edit: '编辑',
  menu_view: '视图',
  menu_ecu: 'ECU',
  menu_dataLog: '数据日志',
  menu_tools: '工具',
  menu_window: '窗口',
  menu_help: '帮助',

  // 工具栏
  toolbar_burn: '烧录',
  toolbar_startSimulation: '开始模拟',
  toolbar_stopSimulation: '停止模拟',

  // 传感器
  sensors_title: '传感器',
  sensors_realtime: '实时',
  sensors_ect: '水温',
  sensors_iat: '进气温',
  sensors_map: '压力',
  sensors_ign: '点火角',
  sensors_inj: '喷油',
  sensors_battery: '电压',
  sensors_tps: '节气门',
  sensors_rpm: '转速',
  sensors_afr: '空燃比',

  // 控制器
  controllers_title: '实时调节控制',
  controllers_enabled: '已启用',
  controllers_disabled: '已禁用',
  controllers_idleControl: '怠速调节',
  controllers_ignitionControl: '点火角度调节',
  controllers_fuelControl: '喷油量调节',
  controllers_modeSelect: '模式选择',

  // 标签页
  tabs_fuelMap: '喷油量',
  tabs_fuelAdvance: '喷油提前角',
  tabs_ignitionAngle: '点火角度',
  tabs_dwellTime: '储能时间',
  tabs_afr: '空燃比',
  tabs_ectCompFuel: '缸温补偿喷油',
  tabs_ectCompIgn: '缸温补偿点火',
  tabs_mapComp: '进气压力补偿',
  tabs_idleLimit: '怠速与限速',
  tabs_otherOptions: '其它选项',
  tabs_parameters: '参数',
  tabs_settingsInfo: '设置与信息',

  // 状态栏
  statusBar_ecuSync: 'ECU 同步',
  statusBar_throttle: '节气门',
  statusBar_pressure: '压力',
  statusBar_coolantTemp: '水温',
  statusBar_usbDriver: 'FTDI USB 驱动',
  statusBar_baudRate: '115200 波特率',

  // 设置页面
  settings_title: '系统设置',
  settings_language: '语言设置',
  settings_connection: '连接设置',
  settings_display: '显示设置',
  settings_about: '关于',
  settings_languageHint: '选择界面语言',

  // 参数页面
  parameters_title: '参数配置',
  parameters_engineParams: '发动机参数',
  parameters_sensorParams: '传感器参数',
  parameters_calibration: '校准参数',
  
  // 参数页面 - 基础参数
  params_basicEngine: '基础参数',
  params_displacement: '发动机排量',
  params_cylinders: '气缸数量',
  params_stroke: '冲程类型',
  params_revLimit: '最高转速限制',
  params_targetIdle: '怠速目标',
  
  // 参数页面 - 触发信号
  params_trigger: '触发信号',
  params_triggerMode: '触发模式',
  params_offset: '触发角度偏置',
  params_noiseFilter: '信号滤波',
  params_syncCycle: '启动同步圈数',
  
  // 参数页面 - 喷油系统
  params_injection: '喷油系统',
  params_flowRate: '喷油嘴流量',
  params_deadTime: '死区时间',
  params_fuelPres: '燃油压力',
  params_loadSource: '主负载信号',
  
  // 参数页面 - 传感器校准
  params_calibration: '传感器校准',
  params_mapSensor: 'MAP 传感器',
  params_tpsMinAdc: 'TPS 关闭电压',
  params_tpsMaxAdc: 'TPS 全开电压',
  params_iatBiasRes: 'IAT 偏置电阻',
  params_autoCalibTps: '自动校准 TPS',
  
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

  // 其它选项
  otherOptions_title: '其它选项',
  otherOptions_advanced: '高级设置',
  otherOptions_diagnostic: '诊断选项',

  // 其它选项页面
  otherOptions_throttleMin: '节气门电压(最小)',
  otherOptions_throttleMax: '节气门电压(最大)',
  otherOptions_idleMinInjCold: '怠速最小喷油量(冷车)',
  otherOptions_idleMinInjHot: '怠速最小喷油量(热车)',
  otherOptions_idleAutoAngle: '怠速自动调节角度(±°)',
  otherOptions_idleAutoInj: '怠速自动调节喷油(±ms)',
  
  otherOptions_idleSteps: '怠速电机总步数',
  otherOptions_fanTemp: '开启风扇温度',
  otherOptions_o2Work: '氧传感器工作(缸温电压)',
  otherOptions_o2Delay: '氧传感器延时工作',
  otherOptions_o2Rpm: '氧传感器工作转速',
  otherOptions_o2Inj: '氧传感器调节喷油',
  
  otherOptions_startEnrichRpm: '启动加喷转速',
  otherOptions_idleHoleMax: '怠速孔最大值',
  otherOptions_idleHoleMin: '怠速孔最小值',
  otherOptions_idleHoleMaxAdj: '怠速孔最大调节值',

  otherOptions_tab_tempIdle: '温度-怠速电机关系',
  otherOptions_tab_startEnrich: '启动加喷',
  otherOptions_tab_iatComp: '进气温度补偿喷油',
  otherOptions_tab_mapComp: '进气压力补偿怠速电机',
  otherOptions_tab_extAdj: '外部调节',

  // 地图表格
  mapTable_table1Active: '表 1 (激活)',
  mapTable_table2: '表 2',
  mapTable_unit: '单位',
  mapTable_percentage: '百分比 (%)',
  mapTable_rawValue: '原始值',
  mapTable_lambda: 'Lambda',

  // 语言名称
  lang_zh_CN: '简体中文',
  lang_zh_TW: '繁體中文',
  lang_en: 'English',
  lang_ja: '日本語',
  lang_th: 'ไทย',
  lang_ko: '한국어',
  lang_ru: 'Русский',
  lang_de: 'Deutsch',
  lang_fr: 'Français',

  // 其它选项 - 网格行
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

  // 新增参数类别
  params_limiters: '限速保护',
  params_outputs: '输出设置',
  
  // 参数页面 - 子标签
  params_tab_afrVoltage: '空燃比-电压关系',
  params_tab_iatVoltage: '空气温度-电压关系',
  params_tab_ectVoltage: '冷却液温度-电压关系',
  params_tab_pressureVoltage: '进气压力-电压关系',
  params_tab_tpsSettings: 'TPS设置',
  params_tab_rpmSettings: 'RPM设置',
};
