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

- [x] **VerticalBar Refinement**: Adjusted layout, scale markers, and range values for the 6 sensor bars to match reference images. (2025-11-26)
- [x] **ControllerBlock Redesign**: Refactored 4 controller blocks to be horizontal, changed font to digital (DSEG7), and adjusted layout/spacing. (2025-11-26)
- [x] **Table Selection Logic**: Modified MapTable and MapTable1D so clicking the corner selects all, and clicking a cell deselects previous ranges. (2025-11-26)
- [x] **Data Banking**: Implemented 4 independent data banks for main tables (Fuel, Ign, etc.) and single bank for compensation tables. Updated Toolbar UI and logic to support banking. (2025-11-26)
- [x] **Serial Port Communication**: Implemented Electron IPC handlers for serial port listing, opening, closing, and writing. Added frontend logic to connect and send data. (2025-11-26)
- [x] **Controller Reset**: Added a reset button to the ControllerBlock section. (2025-11-26)
- [x] **LED Font Update**: Updated the digital font to be bold. (2025-11-26)
- [x] **Tab Labels**: Added "Table 1" and "Table 2" labels to "Other Options", "Parameters", and "Settings" tabs. (2025-11-26)
- [x] **Idle & Limit View Redesign**: Completely refactored the "Idle & Limit" tab to match the reference image, including Top Grid, Auto Clutch table, Spare table, and Config Bits. Implemented complex state management and i18n support. (2025-11-26)
- [x] **Table Editing Shortcuts**: Implemented A/Z, S/X, D/C shortcuts for incrementing/decrementing cell values in MapTable and MapTable1D. (2025-11-26)
- [x] **Decimal Formatting**: Updated table display to show up to 2 decimal places dynamically. (2025-11-26)
- [x] **Menu Logic**: Updated conditional rendering for No.1-No.4 submenus. (2025-11-26)
- [x] **工具栏快捷键**：实现了读取当前(Ctrl+E)、发送当前(Enter)、读取全部(Ctrl+R)、发送全部(Ctrl+T)的快捷键功能，并绑定了工具栏按钮事件。解决了 Enter 键与表格编辑的冲突。(2025-11-26)
- [x] **退出确认**：在关闭窗口时增加了确认提示框，防止误操作。已更新所有 9 种语言的翻译文件。(2025-11-26)
- [x] **菜单布局优化**：调整了 Data 菜单的布局，使用 Flexbox 将快捷键提示靠右对齐，提升了视觉整洁度。(2025-12-19)
- [x] **表格导航优化**：实现了 Excel 风格的键盘导航（Tab/Enter/方向键），支持在 MapTable 和 MapTable1D 中移动焦点，并在移动前自动保存数据。(2025-12-19)
- [x] **本地 USB 测试支持**：创建了 `scripts/mock-ecu.js` 模拟脚本和测试指南，支持通过虚拟串口进行无硬件测试。修复了串口列表不显示虚拟端口的问题，增加了手动输入端口功能。(2025-12-19)
