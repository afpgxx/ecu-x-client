// 主题配置（统一颜色、字体、间距等基础设定）
// 所有注释使用简体中文

export const theme = {
  colors: {
    bgRoot: '#1a1d21',
    bgPanel: '#1e2126',
    bgPanelAlt: '#16181c',
    bgHeader: '#2d323a',
    bgCell: '#111316',
    textPrimary: '#ffffff',
    textSecondary: '#c0c4cc',
    textMuted: '#8b8f98',
    accentBlue: '#2563eb', // blue-600
    border: '#374151', // gray-700
  },
  fonts: {
    base: 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
    mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    sizeXs: '11px',
    sizeSm: '12px',
    sizeBase: '14px',
  },
  spacing: {
    xs: 4,
    sm: 6,
    md: 8,
    lg: 12,
  },
};

export type AppTheme = typeof theme;
