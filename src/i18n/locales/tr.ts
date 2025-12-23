export default {
  // Common
  common_save: 'Kaydet',
  common_open: 'Aç',
  common_download: 'İndir',
  common_upload: 'Yükle',
  common_refresh: 'Veriyi Yenile',
  common_close: 'Kapat',
  common_cancel: 'İptal',
  common_confirm: 'Onayla',
  common_delete: 'Sil',
  common_edit: 'Düzenle',
  common_add: 'Ekle',
  common_search: 'Ara',
  common_reset: 'Sıfırla',
  common_settings: 'Ayarlar',
  common_confirmExit: 'Uygulamayı kapatmak istediğinizden emin misiniz?',
  
  // About
  about_description: 'Motor ayarı ve gerçek zamanlı izleme için Profesyonel ECU Enjeksiyon Yönetim Sistemi. Çoklu ayar haritalarını, sensör kalibrasyonunu ve veri görselleştirmeyi destekler.',

  // Title Bar
  titleBar_appName: 'ECU Enjeksiyon Yönetim Sistemi',
  titleBar_connected: 'Bağlandı',
  titleBar_disconnected: 'Bağlantı Kesildi',

  // Menu Bar
  menu_file: 'Dosya',
  menu_data: 'Veri',
  menu_selectPort: 'Port Seç',
  menu_learnTps: 'TPS Öğren',
  menu_importToCurrent: 'Mevcuta İçe Aktar',
  menu_copyDataTo: 'Veriyi Şuraya Kopyala',
  menu_copyToAll: 'Mevcut veriyi tümüne kopyala...',
  menu_testInjector: 'Enjektör Testi',
  menu_afr: 'AFR',
  menu_afr_record: 'AFR Kaydet',
  menu_afr_adjust: 'AFR Enjeksiyon Ayarı',
  menu_help: 'Yardım',
  menu_help_login: 'Giriş',
  menu_help_setColor: 'Renk Ayarla',
  menu_help_manual: 'Yazılım Kullanım Kılavuzu',
  menu_help_operation: 'Yazılım Tipik İşlemleri',
  menu_help_about: 'Hakkında',

  // Data Menu
  data_readCurrent: 'Mevcut Oku',
  data_sendCurrent: 'Mevcut Gönder',
  data_readAll: 'Tümünü Oku',
  data_sendAll: 'Tümünü Gönder',
  data_restoreFactory: 'Fabrika Ayarlarına Dön',

  // Idle & Limit
  idleLimit_idleRpmCold: 'Rölanti RPM Soğuk',
  idleLimit_idleReturnCold: 'Rölanti Dönüş Soğuk',
  idleLimit_idleRpmHot: 'Rölanti RPM Sıcak',
  idleLimit_idleReturnHot: 'Rölanti Dönüş Sıcak',
  idleLimit_enterExitSensitivity: 'Giriş/Çıkış Hassasiyeti',
  idleLimit_accelEnrichPercent: 'Hızlanma Zenginleştirme %',
  idleLimit_maxRpm: 'Maks RPM',
  idleLimit_vvtOpenRpm: 'VVT Açık RPM',
  idleLimit_autoClutch: 'Otomatik Debriyaj',
  idleLimit_spare: 'Yedek',
  idleLimit_configBits: 'Yapılandırma Bitleri',
  idleLimit_spare1: 'Yedek 1',
  idleLimit_spare2: 'Yedek 2',
  idleLimit_spare3: 'Yedek 3',
  idleLimit_spare4: 'Yedek 4',

  data_add1: 'Ekle 1',
  data_sub1: 'Çıkar 1',
  data_add01: 'Ekle 0.1',
  data_sub01: 'Çıkar 0.1',
  data_add001: 'Ekle 0.01',
  data_sub001: 'Çıkar 0.01',
  data_autoSmooth: 'Otomatik Yumuşat',

  // Toolbar
  toolbar_burn: 'Yaz',
  toolbar_startSimulation: 'Simülasyonu Başlat',
  toolbar_stopSimulation: 'Simülasyonu Durdur',

  // Sensors
  sensors_title: 'Sensörler',
  sensors_realtime: 'Gerçek Zamanlı',
  sensors_ect: 'Soğutma Suyu',
  sensors_iat: 'Emme Havası',
  sensors_map: 'Basınç',
  sensors_ign: 'Ateşleme',
  sensors_inj: 'Enjeksiyon',
  sensors_battery: 'Akü',
  sensors_tps: 'Gaz Kelebeği',
  sensors_rpm: 'RPM',
  sensors_afr: 'AFR',

  // Controllers
  controllers_title: 'Gerçek Zamanlı Kontrol',
  controllers_enabled: 'Etkin',
  controllers_disabled: 'Devre Dışı',
  controllers_tableDisabledMsg: 'Kontrolcüler etkinken tablo düzenleme devre dışıdır',
  controllers_idleControl: 'Rölanti Kontrolü',
  controllers_ignitionControl: 'Ateşleme Kontrolü',
  controllers_fuelControl: 'Yakıt Kontrolü',
  controllers_modeSelect: 'Mod Seçimi',

  // Tabs
  tabs_fuelMap: 'Yakıt Haritası',
  tabs_fuelAdvance: 'Yakıt Avansı',
  tabs_ignitionAngle: 'Ateşleme Açısı',
  tabs_dwellTime: 'Bekleme Süresi',
  tabs_afr: 'AFR',
  tabs_ectCompFuel: 'ECT Yakıt Telafisi',
  tabs_ectCompIgn: 'ECT Ateşleme Telafisi',
  tabs_mapComp: 'MAP Telafisi',
  tabs_idleLimit: 'Rölanti & Limit',
  tabs_otherOptions: 'Diğer Seçenekler',
  tabs_parameters: 'Parametreler',
  tabs_settingsInfo: 'Ayarlar & Bilgi',

  // Status Bar
  statusBar_ecuSync: 'ECU Senk',
  statusBar_throttle: 'Gaz Kelebeği',
  statusBar_pressure: 'Basınç',
  statusBar_coolantTemp: 'Soğutma Suyu',
  statusBar_usbDriver: 'FTDI USB Sürücüsü',
  statusBar_baudRate: '115200 Baud',

  // Settings Page
  settings_title: 'Sistem Ayarları',
  settings_language: 'Dil',
  settings_connection: 'Bağlantı',
  settings_display: 'Görünüm',
  settings_about: 'Hakkında',
  settings_languageHint: 'Arayüz dilini seçin',

  // Parameters Page
  parameters_title: 'Parametreler',
  parameters_engineParams: 'Motor Parametreleri',
  parameters_sensorParams: 'Sensör Parametreleri',
  parameters_calibration: 'Kalibrasyon',
  
  // Parameters Page - Basic Engine
  params_basicEngine: 'Temel Motor',
  params_displacement: 'Hacim',
  params_cylinders: 'Silindirler',
  params_stroke: 'Strok',
  params_revLimit: 'Devir Limiti',
  params_targetIdle: 'Hedef Rölanti',
  
  // Parameters Page - Trigger
  params_trigger: 'Tetikleyici',
  params_triggerMode: 'Tetikleyici Modu',
  params_offset: 'Ofset',
  params_noiseFilter: 'Gürültü Filtresi',
  params_syncCycle: 'Senk Döngüsü',
  
  // Parameters Page - Injection
  params_injection: 'Enjeksiyon',
  params_flowRate: 'Akış Hızı',
  params_deadTime: 'Ölü Zaman',
  params_fuelPres: 'Yakıt Basıncı',
  params_loadSource: 'Yük Kaynağı',
  
  // Parameters Page - Calibration
  params_calibration: 'Kalibrasyon',
  params_mapSensor: 'MAP Sensörü',
  params_tpsMinAdc: 'Min ADC',
  params_tpsMaxAdc: 'Maks ADC',
  params_iatBiasRes: 'Bias Direnci',
  params_autoCalibTps: 'Otomatik TPS Kalibre Et',
  
  // Parameters Page - Units
  params_unit_cc: 'cc',
  params_unit_rpm: 'RPM',
  params_unit_stroke: 'Strok',
  params_unit_degree: '°',
  params_unit_level: 'Seviye',
  params_unit_cycle: 'Döngü',
  params_unit_ccmin: 'cc/dak',
  params_unit_ms: 'ms',
  params_unit_kpa: 'kPa',
  params_unit_v: 'V',
  params_unit_ohm: 'Ω',

  // Other Options
  otherOptions_title: 'Diğer Seçenekler',
  otherOptions_advanced: 'Gelişmiş',
  otherOptions_diagnostic: 'Tanısal',

  // Other Options Page
  otherOptions_throttleMin: 'Gaz Kelebeği Voltajı (Min)',
  otherOptions_throttleMax: 'Gaz Kelebeği Voltajı (Maks)',
  otherOptions_idleMinInjCold: 'Rölanti Min Enj (Soğuk)',
  otherOptions_idleMinInjHot: 'Rölanti Min Enj (Sıcak)',
  otherOptions_idleAutoAngle: 'Rölanti Oto Açı (±°)',
  otherOptions_idleAutoInj: 'Rölanti Oto Enj (±ms)',
  
  otherOptions_idleSteps: 'Rölanti Motor Adımları',
  otherOptions_fanTemp: 'Fan Açma Sıcaklığı',
  otherOptions_o2Work: 'O2 Çalışma (ECT Volt)',
  otherOptions_o2Delay: 'O2 Gecikme',
  otherOptions_o2Rpm: 'O2 Çalışma RPM',
  otherOptions_o2Inj: 'O2 Ayar Enj',
  
  otherOptions_startEnrichRpm: 'Başlangıç Zenginleştirme RPM',
  otherOptions_idleHoleMax: 'Rölanti Delik Maks',
  otherOptions_idleHoleMin: 'Rölanti Delik Min',
  otherOptions_idleHoleMaxAdj: 'Rölanti Delik Maks Ayar',

  otherOptions_tab_tempIdle: 'Sıcaklık-Rölanti Motoru',
  otherOptions_tab_startEnrich: 'Başlangıç Zenginleştirme',
  otherOptions_tab_iatComp: 'IAT Telafi Enj',
  otherOptions_tab_mapComp: 'MAP Telafi Rölanti',
  otherOptions_tab_extAdj: 'Harici Ayar',

  // Map Table
  mapTable_table1Active: 'Tablo 1',
  mapTable_table2: 'Tablo 2',
  mapTable_unit: 'Birim',
  mapTable_percentage: 'Yüzde (%)',
  mapTable_rawValue: 'Ham Değer',
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
  otherOptions_row_stepTime: 'Adım/Zaman',
  otherOptions_row_injVe: 'ENJ VE(ms)',
  otherOptions_row_delayed: 'Gecikmeli(Saniye)',
  otherOptions_row_injVeAdd: 'ENJ VE Ekle(ms)',
  otherOptions_row_notStartedAdd: 'Başlamadı Ekle(ms)',
  otherOptions_row_injVeComp: 'ENJ VE(±ms)',
  otherOptions_row_iat: 'IAT',
  otherOptions_row_ect: 'ECT',
  otherOptions_row_motorStep: 'Motor(±ADIM)',
  otherOptions_row_injAdjPct: 'Enj Ayar[±PCT]',
  otherOptions_row_ignAdjDeg: 'Ateş Ayar[±°]',

  // Additional parameter categories
  params_limiters: 'Sınırlayıcılar',
  params_outputs: 'Çıkışlar',
  
  // Parameters Page - Sub Tabs
  params_tab_afrVoltage: 'AFR-Voltaj İlişkisi',
  params_tab_iatVoltage: 'IAT-Voltaj İlişkisi',
  params_tab_ectVoltage: 'ECT-Voltaj İlişkisi',
  params_tab_pressureVoltage: 'MAP-Voltaj İlişkisi',
  params_tab_tpsSettings: 'TPS Ayarları',
  params_tab_rpmSettings: 'RPM Ayarları',
};
