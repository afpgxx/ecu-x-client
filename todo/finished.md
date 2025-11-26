- [x] 创建统一主题配置文件 `src/theme.ts`，包含颜色、字体、间距等设定。(2025-11-26)
- [x] 调整储能时间表格（Dwell Time）的单元格样式，使用统一深色样式（白色文字、#111316背景、蓝色激活态标签），与其它选项页面一致。(2025-11-26)
# Finished Tasks

- [x] Updated agents.md with Todo Workflow rules. (2025-11-26)
- [x] Implemented 6 sub-items structure in ParametersView.tsx (Basic Engine, Trigger, Injection, Calibration, Limiters, Outputs). (2025-11-26)
- [x] Refactored Parameters page into two main tables (A: Engine/Trigger/Injection, B: Calibration/Limiters/Outputs), kept dark style and i18n. (2025-11-26)
- [x] **完全重构参数页面**：实现了基于图片1-3的1D数据表视图，包含3个子标签（空燃比-电压关系、空气温度-电压关系、冷却液温度-电压关系），每个表格都包含可编辑的电压数据行和对应的参数列头，支持横向滚动和Oem Datum列。已添加所有9种语言的i18n支持。(2025-11-26)
- [x] **样式修复**：将参数页面子标签激活态颜色从红色改为蓝色（bg-blue-600），表格文字颜色从绿色改为白色，与"其它选项"页面风格统一。(2025-11-26)
- [x] **新增3个子标签**：进气压力-电压关系（0~120 KPa，步进12），TPS设置（No.1~No.14，0~100%），RPM设置（No.1~No.30，500~15000）。全部支持横向滚动与Oem Datum列，i18n已覆盖9种语言。(2025-11-26)
- [x] **更新agents.md**：修正图片处理协议说明为“若无法查看，再请求用户发送图片”。(2025-11-26)
