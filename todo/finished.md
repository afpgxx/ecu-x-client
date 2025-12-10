- [x] 创建统一主题配置文件 `src/theme.ts`，包含颜色、字体、间距等设定。(2025-11-26)
- [x] 调整储能时间表格（Dwell Time）的单元格样式，使用统一深色样式（白色文字、#111316 背景、蓝色激活态标签），与其它选项页面一致。(2025-11-26)
- [x] **抽离 ToggleSwitch 组件**：创建 `src/components/common/ToggleSwitch.tsx`，统一管理开关组件，支持两种尺寸（sm/md），带 ON/OFF 标签和平滑动画。已在 App.tsx 和 SettingsView.tsx 中使用。(2025-11-26)
- [x] **主题系统重构**：将 theme.ts 改为 `src/theme.css`，使用 CSS 变量（--bg-panel 等）和工具类（theme-bg-panel 等），方便直接使用类名而非内联样式。MapTable1D 已迁移到新主题系统。(2025-11-26)
- [x] **更新 agents.md**：新增主题使用指南，说明 CSS 变量、主题类和通用组件库（ToggleSwitch），要求新功能优先使用主题样式以保持一致性。(2025-11-26)

# Finished Tasks

- [x] Updated agents.md with Todo Workflow rules. (2025-11-26)
- [x] Implemented 6 sub-items structure in ParametersView.tsx (Basic Engine, Trigger, Injection, Calibration, Limiters, Outputs). (2025-11-26)
- [x] Refactored Parameters page into two main tables (A: Engine/Trigger/Injection, B: Calibration/Limiters/Outputs), kept dark style and i18n. (2025-11-26)
- [x] **完全重构参数页面**：实现了基于图片 1-3 的 1D 数据表视图，包含 3 个子标签（空燃比-电压关系、空气温度-电压关系、冷却液温度-电压关系），每个表格都包含可编辑的电压数据行和对应的参数列头，支持横向滚动和 Oem Datum 列。已添加所有 9 种语言的 i18n 支持。(2025-11-26)
- [x] **样式修复**：将参数页面子标签激活态颜色从红色改为蓝色（bg-blue-600），表格文字颜色从绿色改为白色，与"其它选项"页面风格统一。(2025-11-26)
- [x] **新增 3 个子标签**：进气压力-电压关系（0~120 KPa，步进 12），TPS 设置（No.1~No.14，0~100%），RPM 设置（No.1~No.30，500~15000）。全部支持横向滚动与 Oem Datum 列，i18n 已覆盖 9 种语言。(2025-11-26)
- [x] - [x] **更新 agents.md**：修正图片处理协议说明为“若无法查看，再请求用户发送图片”。(2025-11-26)
- [x] **MapTable 交互增强**：实现了点击空白处取消选中、按住鼠标拖拽选中区域、选中区域后直接输入进行批量编辑、Ctrl+C/V 复制粘贴功能。(2025-11-26)
- [x] **App 布局优化**：统一了所有 Map Tab 上方的控制栏样式，实现了输入框组在屏幕绝对居中，Table 1/2 切换按钮及 No.1-4 按钮靠右对齐的布局。(2025-11-26)

```

```
