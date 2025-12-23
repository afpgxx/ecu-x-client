export default {
  // 通用
  common_save: 'Enregistrer',
  common_open: 'Ouvrir',
  common_download: 'Télécharger',
  common_upload: 'Téléverser',
  common_refresh: 'Actualiser les données',
  common_close: 'Fermer',
  common_cancel: 'Annuler',
  common_confirm: 'Confirmer',
  common_delete: 'Supprimer',
  common_edit: 'Modifier',
  common_add: 'Ajouter',
  common_search: 'Rechercher',
  common_reset: 'Réinitialiser',
  common_settings: 'Paramètres',
  common_confirmExit: 'Êtes-vous sûr de vouloir fermer l\'application ?',
  
  // À propos
  about_description: 'Système professionnel de gestion d\'injection ECU pour le réglage moteur et la surveillance en temps réel. Prend en charge plusieurs cartes de réglage, l\'étalonnage des capteurs et la visualisation des données.',

  // 標題欄
  titleBar_appName: 'Système de gestion d\'injection ECU',
  titleBar_connected: 'Connecté',
  titleBar_disconnected: 'Déconnecté',

  // 選單欄
  menu_file: 'Fichier',
  menu_data: 'Données',
  menu_selectPort: 'Sélectionner le port',
  menu_learnTps: 'Apprentissage TPS',
  menu_importToCurrent: 'Importer vers actuel',
  menu_copyDataTo: 'Copier les données vers',
  menu_copyToAll: 'Copier les données actuelles vers tous...',
  menu_testInjector: 'Test injecteur',
  menu_afr: 'AFR',
  menu_afr_record: 'Enregistrer AFR',
  menu_afr_adjust: 'Ajustement injection AFR',
  menu_help: 'Aide',
  menu_help_login: 'Connexion',
  menu_help_setColor: 'Définir la couleur',
  menu_help_manual: 'Manuel du logiciel',
  menu_help_operation: 'Opération typique',
  menu_help_about: 'À propos',

  // Menu de données
  data_readCurrent: 'Lire actuel',
  data_sendCurrent: 'Envoyer actuel',
  data_readAll: 'Tout lire',
  data_sendAll: 'Tout envoyer',
  data_restoreFactory: 'Rétablir usine',

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
  data_autoSmooth: 'Lissage auto',

  // 工具列
  toolbar_burn: 'Écrire',
  toolbar_startSimulation: 'Démarrer la simulation',
  toolbar_stopSimulation: 'Arrêter la simulation',

  // 感測器
  sensors_title: 'Capteurs',
  sensors_realtime: 'Temps réel',
  sensors_ect: 'Température du liquide de refroidissement',
  sensors_iat: 'Température de l\'air d\'admission',
  sensors_map: 'Pression',
  sensors_ign: 'Angle d\'allumage',
  sensors_inj: 'Injection',
  sensors_battery: 'Tension',
  sensors_tps: 'Papillon',
  sensors_rpm: 'Régime moteur',
  sensors_afr: 'Rapport air-carburant',

  // 控制器
  controllers_title: 'Contrôle en temps réel',
  controllers_enabled: 'Activé',
  controllers_disabled: 'Désactivé',
  controllers_tableDisabledMsg: 'La modification de tableau est désactivée lorsque les contrôleurs sont actifs',
  controllers_idleControl: 'Contrôle du ralenti',
  controllers_ignitionControl: 'Contrôle de l\'angle d\'allumage',
  controllers_fuelControl: 'Contrôle de la quantité de carburant',
  controllers_modeSelect: 'Sélection du mode',

  // 標籤頁
  tabs_fuelMap: 'Quantité de carburant',
  tabs_fuelAdvance: 'Avance à l\'injection',
  tabs_ignitionAngle: 'Angle d\'allumage',
  tabs_dwellTime: 'Temps de charge',
  tabs_afr: 'Rapport air-carburant',
  tabs_ectCompFuel: 'Compensation température cylindre (carburant)',
  tabs_ectCompIgn: 'Compensation température cylindre (allumage)',
  tabs_mapComp: 'Compensation de pression d\'admission',
  tabs_idleLimit: 'Ralenti et limitation de vitesse',
  tabs_otherOptions: 'Autres options',
  tabs_parameters: 'Paramètres',
  tabs_settingsInfo: 'Paramètres et informations',

  // 狀態列
  statusBar_ecuSync: 'Synchronisation ECU',
  statusBar_throttle: 'Papillon',
  statusBar_pressure: 'Pression',
  statusBar_coolantTemp: 'Température du liquide de refroidissement',
  statusBar_usbDriver: 'Pilote FTDI USB',
  statusBar_baudRate: '115200 bauds',

  // 設定頁面
  settings_title: 'Paramètres système',
  settings_language: 'Paramètres de langue',
  settings_connection: 'Paramètres de connexion',
  settings_display: 'Paramètres d\'affichage',
  settings_about: 'À propos',
  settings_languageHint: 'Sélectionner la langue de l\'interface',

  // 參數頁面
  parameters_title: 'Configuration des paramètres',
  parameters_engineParams: 'Paramètres du moteur',
  parameters_sensorParams: 'Paramètres des capteurs',
  parameters_calibration: 'Paramètres de calibration',

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
  otherOptions_title: 'Autres options',
  otherOptions_advanced: 'Paramètres avancés',
  otherOptions_diagnostic: 'Options de diagnostic',

  // 地圖表格
  mapTable_table1Active: 'Tableau 1',
  mapTable_table2: 'Table 2',
  mapTable_unit: 'Unité',
  mapTable_percentage: 'Pourcentage (%)',
  mapTable_rawValue: 'Valeur brute',
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
  lang_es: 'Español',
  lang_pt: 'Português',
  lang_id: 'Bahasa Indonesia',
  lang_vi: 'Tiếng Việt',
  lang_tr: 'Türkçe',
  lang_ar: 'العربية',

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

  // 新增的參數類別
  params_limiters: 'Limiteurs',
  params_outputs: 'Sorties',
  
  // Page Paramètres - Sous-onglets
  params_tab_afrVoltage: 'Relation AFR-Tension',
  params_tab_iatVoltage: 'Relation IAT-Tension',
  params_tab_ectVoltage: 'Relation ECT-Tension',
  params_tab_pressureVoltage: 'Relation MAP-Tension',
  params_tab_tpsSettings: 'Paramètres TPS',
  params_tab_rpmSettings: 'Paramètres RPM',
  
  // Réglage à distance
  menu_remote: 'Réglage à distance',
  remote_title: 'Connexion de réglage à distance',
  remote_serverAddress: 'Adresse du serveur',
  remote_roomId: 'ID de salle (Session ID)',
  remote_role: 'Rôle',
  remote_ecuRole: 'ECU (sur site)',
  remote_expertRole: 'Expert (à distance)',
  remote_connect: 'Connecter',
  remote_disconnect: 'Déconnecter',
  remote_status_connected: 'Statut : Connecté',
  remote_status_disconnected: 'Statut : Déconnecté',
  remote_connectionFailed: 'Erreur de connexion à distance',
  remote_connectedSuccess: 'Connecté au serveur distant',
  remote_disconnectedNotify: 'Connexion à distance déconnectée',
};
