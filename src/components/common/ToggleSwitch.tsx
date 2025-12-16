import React from 'react';

// 注释：统一的开关组件，带平滑动画效果
interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  showLabel?: boolean; // 是否显示 ON/OFF 文字
  size?: 'sm' | 'md'; // 尺寸
  className?: string;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked,
  onChange,
  showLabel = true,
  size = 'md',
  className = ''
}) => {
  const sizeClasses = size === 'sm' 
    ? { container: 'w-8 h-4', toggle: 'w-3 h-3', translate: 'translate-x-4' }
    : { container: 'w-16 h-5', toggle: 'w-4 h-4', translate: 'translate-x-11' };

  return (
    <div 
      className={`flex items-center gap-2 cursor-pointer ${className}`}
      onClick={() => onChange(!checked)}
    >
      {showLabel && (
        <span className={`text-[10px] font-bold ${checked ? 'text-white' : 'text-gray-600'}`}>
          {checked ? 'ON' : 'OFF'}
        </span>
      )}
      <div className={`${sizeClasses.container} rounded-full p-0.5 transition-colors duration-300 ${checked ? 'bg-green-600' : 'bg-gray-700'}`}>
        <div className={`${sizeClasses.toggle} bg-white rounded-full shadow-md transform transition-transform duration-300 ${checked ? sizeClasses.translate : 'translate-x-0'}`}></div>
      </div>
    </div>
  );
};
