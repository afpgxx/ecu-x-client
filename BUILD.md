# 打包说明

## 安装依赖
首先确保已安装 electron-builder：
```bash
npm install --save-dev electron-builder
```

## 打包命令

### 开发测试打包（不生成安装包）
```bash
npm run pack
```

### 打包当前平台
```bash
npm run dist
```

### 打包 Windows 平台
```bash
npm run dist:win
```
生成文件：
- `.exe` 安装程序（NSIS）
- 支持 x64 和 ia32 架构

### 打包 macOS 平台
```bash
npm run dist:mac
```
生成文件：
- `.dmg` 磁盘镜像
- `.zip` 压缩包

### 打包 Linux 平台
```bash
npm run dist:linux
```
生成文件：
- `.AppImage` 通用格式
- `.deb` Debian/Ubuntu
- `.rpm` RedHat/Fedora

### 打包所有平台
```bash
npm run dist:all
```

## 输出目录
打包后的文件在 `release/` 目录下。

## 图标准备
需要在 `build/` 目录下放置应用图标：

- **Windows**: `icon.ico` (256x256)
- **macOS**: `icon.icns` (512x512)
- **Linux**: `icon.png` (512x512)

可使用在线工具转换：
- https://www.icoconverter.com/
- https://iconverticons.com/

## 注意事项

1. **跨平台打包限制**：
   - macOS 只能在 macOS 上打包
   - Windows 和 Linux 可以在任意平台打包（需配置相应工具）

2. **首次打包**：
   - 会下载平台相关的依赖，可能需要较长时间
   - 确保网络连接稳定

3. **代码签名**：
   - Windows 需要代码签名证书
   - macOS 需要 Apple Developer 账号
   - 可在 package.json 的 build 配置中添加证书信息

## 配置说明

打包配置位于 `package.json` 的 `build` 字段：

- `appId`: 应用唯一标识
- `productName`: 应用显示名称
- `directories.output`: 输出目录
- `files`: 需要打包的文件
- `win/mac/linux`: 各平台特定配置
