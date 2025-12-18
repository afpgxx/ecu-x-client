import React, { useEffect, useRef , useState } from 'react';

interface MapTable1DProps {
  headers: number[]; // X轴值（例如 RPM）
  data: number[];    // 行数据值
  activeValue: number; // 当前高亮值（例如当前 RPM）
  xLabel: string;    // X轴标签
  yLabel: string;    // 行头标签
  colorMode?: 'heatmap' | 'dark'; // 颜色模式：热力图 或 深色统一样式
  onCellChange: (row: number, col: number, value: number) => void; // 可选的单元格变更回调
  onBulkChange?: (changes: { col: number; value: number }[]) => void; // （整行批量更改回调
  onEditingChange?: (cell: {row:number;col:number;value:number} | null) => void;
  forceEditing?: { row:number; col:number } | null;
  suppressBlur?: boolean;
  recentToolbarUpdatesRef?: React.RefObject<Map<string, number>>;
  min?: number;      // 最小值
  max?: number;      // 最大值
}

// Helper to map value to Heatmap Color (Blue -> Green -> Yellow -> Red)
const getHeatmapColor = (value: number, min: number, max: number) => {
  if (isNaN(value)) return 'hsl(0, 0%, 85%)'; // Light gray for NaN
  if (max === min) return 'hsl(120, 60%, 45%)'; // Default Green if flat data
  
  const ratio = Math.max(0, Math.min(1, (value - min) / (max - min)));
  const hue = (1 - ratio) * 240; 
  return `hsl(${hue}, 85%, 60%)`; 
};

export const MapTable1D: React.FC<MapTable1DProps> = ({
  headers,
  data,
  activeValue,
  xLabel,
  yLabel,
  colorMode = 'heatmap',
  onCellChange,
  onBulkChange,
  onEditingChange,
  forceEditing,
  suppressBlur,
  recentToolbarUpdatesRef,
  min = 0,
  max = 999.99, // Default max to a large number
}) => {
  const activeRef = useRef<HTMLDivElement>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [, setOriginalValue] = useState<number>(0);
  const [selection, setSelection] = useState<'all' | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Find active column index based on closest value
  const activeColIndex = headers.reduce((prev, curr, i) => 
    Math.abs(curr - activeValue) < Math.abs(headers[prev] - activeValue) ? i : prev, 0
  );

  // Auto-scroll to active cell
  useEffect(() => {
    if (activeRef.current) {
      // Changed to 'auto' and 'nearest' to prevent jittering
      activeRef.current.scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'nearest' });
    }
  }, [activeColIndex]);

  useEffect(() => {
    if (editingIndex !== null && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
    // 通知父组件当前正在编辑的单元格
    if (typeof onEditingChange === 'function') {
      if (editingIndex === null) onEditingChange(null);
      else onEditingChange({ row: 0, col: editingIndex, value: data[editingIndex] });
    }
  }, [editingIndex, onEditingChange, data]);

  // 处理外部 forceEditing（恢复编辑状态）
  useEffect(() => {
    if (forceEditing && (forceEditing.col !== undefined)) {
      setEditingIndex(forceEditing.col);
      setInputValue(Number(data[forceEditing.col].toFixed(2)).toString());
    }
  }, [forceEditing, data]);

  // 当数据更新时，如果当前有激活编辑单元格，保持输入框中显示的值与数据同步（除非用户正在输入）
  useEffect(() => {
    if (editingIndex !== null) {
      setInputValue(Number(data[editingIndex].toFixed(2)).toString());
    }
  }, [data]);

  // Handle Copy/Paste for Selection
  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      if (selection !== 'all' || editingIndex !== null) return;

      // Copy: Ctrl+C
      if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        e.preventDefault();
        const text = data.map(v => v.toFixed(colorMode === 'heatmap' ? 1 : 0)).join('\t');
        try {
          await navigator.clipboard.writeText(text);
        } catch (err) {
          console.error('Failed to copy', err);
        }
      }

      // Paste: Ctrl+V
      if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
        e.preventDefault();
        try {
          const text = await navigator.clipboard.readText();
          if (!text) return;
          
          let values = text.split('\t').map(s => parseFloat(s.trim()));
          if (values.length === 1 && text.includes('\n')) {
              values = text.split(/\r?\n/).map(s => parseFloat(s.trim()));
          }

          const changes: {col: number, value: number}[] = [];
          values.forEach((val, idx) => {
              if (idx < headers.length && !isNaN(val)) {
                  let finalVal = val;
                  if (min !== undefined) finalVal = Math.max(min, finalVal);
                  if (max !== undefined) finalVal = Math.min(max, finalVal);
                  changes.push({ col: idx, value: finalVal });
              }
          });

          if (changes.length > 0 && onBulkChange) {
              onBulkChange(changes);
          }
        } catch (err) {
          console.error('Failed to paste', err);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selection, editingIndex, data, colorMode, min, max, onBulkChange, headers.length]);

  const saveChange = (index: number, val: number) => {
      let finalVal = val;
      if (isNaN(finalVal)) finalVal = data[index];
      if (min !== undefined) finalVal = Math.max(min, finalVal);
      if (max !== undefined) finalVal = Math.min(max, finalVal);

      if (selection === 'all' && onBulkChange) {
          const changes = headers.map((_, i) => ({ col: i, value: finalVal }));
          onBulkChange(changes);
      } else {
          // 在写回前检查最近是否由工具栏更新以避免冲突
          const key = `${0},${index}`;
          const recent = recentToolbarUpdatesRef?.current?.get(key);
          const now = Date.now();
          if (recent && (now - recent) < 300) {
            // 最近由工具栏修改，跳过写回以避免覆盖
          } else {
            onCellChange(0, index, finalVal);
          }
      }
  };

  const handleCommit = (index: number, val: number) => {
      saveChange(index, val);
      if (!suppressBlur) setEditingIndex(null);
  };

  return (
    <div className="flex flex-col w-full h-full select-none overflow-hidden theme-bg-panel-alt text-xs">
      
      {/* Header Row (X-Axis Labels) */}
      <div className="flex w-full theme-bg-header theme-border border-b">
        <div 
          className="w-24 flex-shrink-0 p-1 flex items-center justify-center font-bold theme-bg-panel-alt theme-text-muted theme-border border-r cursor-pointer"
          onClick={() => setSelection(null)}
        >
          {xLabel}
        </div>
        <div className="flex-1 overflow-hidden">
            <div className="flex w-full h-full">
                {headers.map((val, i) => (
                <div 
                    key={i}
                    className={`flex-1 flex items-center justify-center font-bold transition-colors duration-150 last:border-0 theme-border border-r theme-text-primary ${
                      i === activeColIndex ? 'theme-bg-accent-blue' : 'theme-bg-header'
                    }`}
                >
                    {val}
                </div>
                ))}
            </div>
        </div>
      </div>

      {/* Data Row */}
      <div className="flex-1 flex flex-col overflow-y-auto scrollbar-thin">
        <div className="flex w-full h-12">
           
           {/* Row Label */}
            <div 
              className={`w-24 flex-shrink-0 flex items-center justify-center font-bold theme-border border-r border-b cursor-pointer hover:bg-gray-700
              ${selection === 'all' ? 'bg-blue-900/50 text-blue-200' : 'theme-bg-header theme-text-secondary'}`}
              onClick={() => {
                setSelection('all');
                setEditingIndex(0);
                setInputValue(Number(data[0].toFixed(2)).toString());
              }}
            >
              {yLabel}
           </div>

           {/* 数据单元格 */}
           <div className="flex-1 flex">
                {data.map((cellValue, i) => {
                const isActive = i === activeColIndex;
                const isSelected = selection === 'all';
                const bg = colorMode === 'heatmap'
                  ? getHeatmapColor(cellValue, min, max)
                  : 'var(--bg-cell)';
                return (
                  <div
                    key={i}
                    ref={isActive ? activeRef : null}
                    className={`flex-1 flex items-center justify-center font-bold cursor-pointer theme-border border-r border-b relative ${
                      isActive ? 'z-10 shadow-lg' : ''
                    } ${colorMode === 'dark' ? 'theme-text-primary' : ''}`}
                    style={{
                      backgroundColor: bg,
                      color: colorMode === 'heatmap' ? '#000' : undefined,
                      fontSize: 15,
                    }}
                    onClick={() => {
                      setSelection(null);
                      setEditingIndex(i);
                      setInputValue(Number(cellValue.toFixed(2)).toString());
                      setOriginalValue(cellValue);
                    }}
                  >
                    {isActive && <div className="absolute inset-0 border-2 border-white pointer-events-none"></div>}
                    {isSelected && !isActive && <div className="absolute inset-0 bg-blue-500/30 pointer-events-none border border-blue-400/50"></div>}
                    
                    {editingIndex === i ? (
                      <input
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={e => setInputValue(e.target.value)}
                        onBlur={() => handleCommit(i, parseFloat(inputValue))}
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            handleCommit(i, parseFloat(inputValue));
                          } else if (e.key === 'Tab') {
                            e.preventDefault();
                            saveChange(i, parseFloat(inputValue));
                            const nextIndex = i + 1;
                            if (nextIndex < headers.length) {
                                setEditingIndex(nextIndex);
                                setInputValue(Number(data[nextIndex].toFixed(2)).toString());
                                setOriginalValue(data[nextIndex]);
                            } else {
                                setEditingIndex(null);
                            }
                          } else if (e.key === 'Escape') {
                            // 按ESC时不保存，直接退出编辑
                            setEditingIndex(null);
                          } else if (['ArrowLeft', 'ArrowRight'].includes(e.key)) {
                            // Directional Navigation
                            e.preventDefault();
                            saveChange(i, parseFloat(inputValue));
                            
                            let nextIndex = i;
                            if (e.key === 'ArrowLeft') nextIndex = Math.max(0, i - 1);
                            if (e.key === 'ArrowRight') nextIndex = Math.min(headers.length - 1, i + 1);

                            if (nextIndex !== i) {
                              setEditingIndex(nextIndex);
                              setInputValue(Number(data[nextIndex].toFixed(2)).toString());
                              setOriginalValue(data[nextIndex]);
                            }
                          }

                          // Shortcuts
                          if (!e.ctrlKey && !e.metaKey && !e.altKey) {
                            const key = e.key.toUpperCase();
                            let delta = 0;
                            if (key === 'A') delta = 1;
                            else if (key === 'Z') delta = -1;
                            else if (key === 'S') delta = 0.1;
                            else if (key === 'X') delta = -0.1;
                            else if (key === 'D') delta = 0.01;
                            else if (key === 'C') delta = -0.01;

                            if (delta !== 0) {
                               e.preventDefault();
                               const currentVal = parseFloat(inputValue);
                               if (!isNaN(currentVal)) {
                                   let newVal = currentVal + delta;
                                   if (min !== undefined) newVal = Math.max(min, newVal);
                                   if (max !== undefined) newVal = Math.min(max, newVal);
                                   newVal = Number(newVal.toFixed(2));
                                   setInputValue(newVal.toString());
                                   
                                   if (selection === 'all' && onBulkChange) {
                                      const changes = headers.map((_, idx) => ({ col: idx, value: newVal }));
                                      onBulkChange(changes);
                                   } else {
                                      onCellChange(0, i, newVal);
                                   }
                               }
                            }
                          }
                        }}
                        className="w-full h-full px-0.5 py-0.5 rounded-md border-2 border-blue-500 focus:border-orange-500 text-right text-base font-mono text-blue-200 shadow-inner outline-none transition-all duration-150 select-all ring-0 focus:bg-[#23272e] focus:text-white-300"
                        style={{ fontSize : 17, backgroundColor: bg, textAlign: 'center', fontVariantNumeric: 'tabular-nums' }}
                      />
                    ) : (
                      Number(cellValue.toFixed(2)).toString()
                    )}
                  </div>
                );
              })}
           </div>
        </div>
        
          {/* 空白填充区 */}
          <div 
            className="flex-1 theme-bg-panel-alt"
            onClick={() => setSelection(null)}
          ></div>
      </div>
    </div>
  );
};