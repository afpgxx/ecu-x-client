import React, { useState, useEffect, useRef } from 'react';

interface MapTableProps {
  rpmPoints: number[];
  loadPoints: (number|null)[]; // This represents the Y-axis rows (could be Load, TPS, or Temp or IDLE)
  data: number[][];
  activeRpm: number;
  activeLoad: number; // This represents the Y-axis active value
  yAxisUnit?: string; // e.g., "%", "kPa", "°C"
  cornerLabel?: string; // e.g., "负荷/转速"
  decimals?: number; // 小数点位数，默认为1
  value: number; // 默认为0
  min?: number;
  max?: number;
  onCellChange: (row: number, col: number, newValue: number) => void;
  onBulkChange?: (changes: {row: number, col: number, value: number}[]) => void;
  onEditingChange?: (cell: {row: number; col: number; value: number} | null) => void;
  // 外部强制进入编辑（用于工具栏修改后保持/恢复编辑态）
  forceEditing?: { row: number; col: number } | null;
  // 当为 true 时，输入框失焦时不要把当前值写回（用于避免工具栏修改与 blur 冲突）
  suppressBlur?: boolean;
}

type SelectionState = 
  | { type: 'row'; index: number }
  | { type: 'col'; index: number }
  | { type: 'range'; startRow: number; startCol: number; endRow: number; endCol: number }
  | null;

// Helper to map value to Heatmap Color (Blue -> Green -> Yellow -> Red)
const getHeatmapColor = (value: number, min: number, max: number) => {
  if (isNaN(value)) return 'hsl(0, 0%, 85%)'; // Light gray for NaN
  // Handle flat data (min === max) to avoid division by zero or weird colors
  if (min === max) return 'hsl(220, 70%, 85%)'; // A pleasant light blue/purple for uniform data

  const ratio = Math.max(0, Math.min(1, (value - min) / (max - min)));
  // Hue mapping: Blue(240) -> Cyan(180) -> Green(120) -> Yellow(60) -> Red(0)
  // We map 240 (Low) to 0 (High)
  const hue = (1 - ratio) * 240; 
  return `hsl(${hue}, 85%, 60%)`; 
};

export const MapTable: React.FC<MapTableProps> = ({
  rpmPoints,
  loadPoints,
  data,
  activeRpm,
  activeLoad,
  yAxisUnit,
  cornerLabel = 'TPS',
  decimals = 1,
  value = 0,
  min = 0,
  max = 16,
  onCellChange,
  onBulkChange,
  onEditingChange,
  forceEditing,
  // @ts-ignore
  recentToolbarUpdatesRef,
}) => {
  const activeRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState('');
  const [editingCell, setEditingCell] = useState<{row: number, col: number} | null>(null);
  const [selection, setSelection] = useState<SelectionState>(null);
  const [isDragging, setIsDragging] = useState(false);
  const justFinishedDrag = useRef(false);
  const dragStart = useRef<{row: number, col: number} | null>(null);
  const isTypingRef = useRef(false);

  // Notify parent when editing cell changes
  useEffect(() => {
    if (typeof onEditingChange === 'function') {
      if (editingCell) {
        const r = editingCell.row;
        const c = editingCell.col;
        const val = (data && data[r] && typeof data[r][c] === 'number') ? data[r][c] : 0;
        try { onEditingChange({ row: r, col: c, value: val }); } catch (e) { /* ignore */ }
      } else {
        try { onEditingChange(null); } catch (e) { /* ignore */ }
      }
    }
  }, [editingCell, data, onEditingChange]);

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
      dragStart.current = null;
      // Delay resetting justFinishedDrag to allow click event to fire first
      setTimeout(() => { justFinishedDrag.current = false; }, 50);
    };
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, []);

  useEffect(() => {
    setInputValue((value ?? 0).toFixed(decimals));
  }, [value, decimals]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleCellMouseDown = (rIdx: number, cIdx: number, e: React.MouseEvent) => {
    // Only left click
    if (e.button !== 0) return;
    // If clicking inside the input of the currently editing cell, ignore
    if (editingCell?.row === rIdx && editingCell?.col === cIdx) return;

    e.stopPropagation(); // Prevent container click from clearing selection
    setIsDragging(true);
    justFinishedDrag.current = false;
    dragStart.current = { row: rIdx, col: cIdx };
    // Do NOT set selection here immediately to allow simple click to edit without selection
    // 如果外部抑制 blur，则不要清除 editingCell
    // @ts-ignore
    if (typeof suppressBlur !== 'undefined' && suppressBlur) return;
    setEditingCell(null);
  };

  const handleCellMouseEnter = (rIdx: number, cIdx: number) => {
    if (isDragging && dragStart.current) {
      justFinishedDrag.current = true;
      setSelection({ 
        type: 'range', 
        startRow: dragStart.current.row, 
        startCol: dragStart.current.col, 
        endRow: rIdx, 
        endCol: cIdx 
      });
    }
  };

  const saveCurrentEdit = () => {
    if (!editingCell) return;
    const parsed = parseFloat(inputValue);
    let newVal = parsed;
    if (!isNaN(parsed)) {
      if (min !== undefined) newVal = Math.max(min, newVal);
      if (max !== undefined) newVal = Math.min(max, newVal);
      
      // Check for bulk update
      if (selection && onBulkChange) {
        const changes: {row: number, col: number, value: number}[] = [];
        
        if (selection.type === 'row' && selection.index === editingCell.row) {
          // Update entire row
          for (let c = 0; c < rpmPoints.length; c++) {
            changes.push({ row: selection.index, col: c, value: newVal });
          }
        } else if (selection.type === 'col' && selection.index === editingCell.col) {
          // Update entire column
          for (let r = 0; r < loadPoints.length; r++) {
            changes.push({ row: r, col: selection.index, value: newVal });
          }
        } else if (selection.type === 'range') {
          // Update range
          const minR = Math.min(selection.startRow, selection.endRow);
          const maxR = Math.max(selection.startRow, selection.endRow);
          const minC = Math.min(selection.startCol, selection.endCol);
          const maxC = Math.max(selection.startCol, selection.endCol);
          
          // Only if editing cell is within range (it should be)
          if (editingCell.row >= minR && editingCell.row <= maxR && 
              editingCell.col >= minC && editingCell.col <= maxC) {
             for (let r = minR; r <= maxR; r++) {
               for (let c = minC; c <= maxC; c++) {
                 changes.push({ row: r, col: c, value: newVal });
               }
             }
          } else {
             changes.push({ row: editingCell.row, col: editingCell.col, value: newVal });
          }
        } else {
          // Single cell update (fallback)
          changes.push({ row: editingCell.row, col: editingCell.col, value: newVal });
        }
        
        if (changes.length > 0) {
           onBulkChange(changes);
        }
      } else {
        // Single cell update
        onCellChange(editingCell.row, editingCell.col, newVal);
      }
    } else {
      // Invalid input, revert
      onCellChange(editingCell.row, editingCell.col, (data && data[editingCell.row] && data[editingCell.row][editingCell.col]) || 0);
    }
  };

  const handleInputBlur = () => {
    // 如果外部要求 suppress blur 写入，则直接退出编辑，不写回数据
    // 该场景用于工具栏修改与 blur 的互斥情况
    // @ts-ignore
    if (typeof suppressBlur !== 'undefined' && suppressBlur) {
      // 如果 suppressBlur 生效，跳过 blur 时的写回和退出编辑
      return;
    }
      // 如果最近 toolbar 已对该单元格进行了写入（避免 race），则跳过 blur 的写回
      try {
        if (editingCell && recentToolbarUpdatesRef && recentToolbarUpdatesRef.current) {
          const key = `${editingCell.row},${editingCell.col}`;
          const t = recentToolbarUpdatesRef.current.get(key);
          if (t && (Date.now() - t) < 500) {
              // 最近由 toolbar 更新，忽略 blur 写回并保持编辑（让 forceEditing 恢复）
              return;
            }
        }
      } catch (e) { /* ignore */ }
    
    saveCurrentEdit();
    setEditingCell(null);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveCurrentEdit();
      // Move Down
      if (editingCell) {
          const nextRow = editingCell.row + 1;
          if (nextRow < loadPoints.length) {
              setEditingCell({ row: nextRow, col: editingCell.col });
              setInputValue(Number(data[nextRow][editingCell.col].toFixed(2)).toString());
          } else {
              setEditingCell(null);
          }
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      saveCurrentEdit();
      // Move Right
      if (editingCell) {
          const nextCol = editingCell.col + 1;
          if (nextCol < rpmPoints.length) {
              setEditingCell({ row: editingCell.row, col: nextCol });
              setInputValue(Number(data[editingCell.row][nextCol].toFixed(2)).toString());
          } else {
              // Wrap to next row
              const nextRow = editingCell.row + 1;
              if (nextRow < loadPoints.length) {
                  setEditingCell({ row: nextRow, col: 0 });
                  setInputValue(Number(data[nextRow][0].toFixed(2)).toString());
              } else {
                  setEditingCell(null);
              }
          }
      }
    } else if (e.key === 'Escape') {
      // @ts-ignore
      if (typeof suppressBlur !== 'undefined' && suppressBlur) return;
      setEditingCell(null);
    } else if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      // Directional Navigation
      if (editingCell) {
        e.preventDefault();
        saveCurrentEdit();
        
        let nextRow = editingCell.row;
        let nextCol = editingCell.col;

        if (e.key === 'ArrowUp') nextRow = Math.max(0, nextRow - 1);
        if (e.key === 'ArrowDown') nextRow = Math.min(loadPoints.length - 1, nextRow + 1);
        if (e.key === 'ArrowLeft') nextCol = Math.max(0, nextCol - 1);
        if (e.key === 'ArrowRight') nextCol = Math.min(rpmPoints.length - 1, nextCol + 1);

        if (nextRow !== editingCell.row || nextCol !== editingCell.col) {
          setEditingCell({ row: nextRow, col: nextCol });
          setInputValue(Number(data[nextRow][nextCol].toFixed(2)).toString());
        }
      }
    }

    // Shortcuts for single cell editing
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
               newVal = Number(newVal.toFixed(Math.max(decimals, 2)));
               setInputValue(Number(newVal.toFixed(2)).toString());
               if (editingCell) {
                   onCellChange(editingCell.row, editingCell.col, newVal);
               }
           }
        }
    }
  };
  // Find closest indices for highlighting
  // For RPM (X-axis)
  const activeColIndex = rpmPoints.reduce((prev, curr, i) => 
    Math.abs(curr - activeRpm) < Math.abs(rpmPoints[prev] - activeRpm) ? i : prev, 0
  );

  // For Y-axis (Load/Temp/etc)
  const activeRowIndex = React.useMemo(() => {
    if (activeLoad === undefined) return -1;
    let minDiff = Infinity;
    let minIdx = -1;
    for (let i = 0; i < loadPoints.length; i++) {
      const val = loadPoints[i];
      if (typeof val !== 'number') continue;
      const diff = Math.abs(val - activeLoad);
      if (diff < minDiff) {
        minDiff = diff;
        minIdx = i;
      }
    }
    return minIdx;
  }, [loadPoints, activeLoad]);

  // Auto-scroll logic
  useEffect(() => {
    if (activeRef.current) {
      // Changed to 'auto' and 'nearest' to prevent jittering/shaking during rapid updates
      activeRef.current.scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'nearest' });
    }
  }, [activeRowIndex, activeColIndex]);

  // Focus input when editingCell changes
  useEffect(() => {
    if (editingCell && inputRef.current) {
      inputRef.current.focus();
      if (isTypingRef.current) {
        // If initiated by typing, place cursor at end and do NOT select all
        // This prevents the next keystroke from overwriting the first one
        inputRef.current.selectionStart = inputRef.current.value.length;
        inputRef.current.selectionEnd = inputRef.current.value.length;
        isTypingRef.current = false;
      } else {
        inputRef.current.select();
      }
    }
  }, [editingCell]);

  // 外部强制进入编辑态：当 forceEditing 改变且不为 null 时，设置 editingCell 并同步输入值
  useEffect(() => {
    // @ts-ignore
    if (typeof forceEditing !== 'undefined' && forceEditing !== null) {
      const r = forceEditing.row;
      const c = forceEditing.col;
      const val = (data && data[r] && typeof data[r][c] === 'number') ? data[r][c] : 0;
      
      if (r >= 0 && c >= 0 && r < loadPoints.length && c < rpmPoints.length) {
        setEditingCell({ row: r, col: c });
        setInputValue(Number(val.toFixed(2)).toString());
      }
    }
  }, [forceEditing, data, decimals, loadPoints.length, rpmPoints.length]);

  // 当外部数据发生变化且当前正在编辑某单元格时，更新输入框的值以反映最新数据
  useEffect(() => {
    if (!editingCell) return;
    const r = editingCell.row;
    const c = editingCell.col;
    const val = (data && data[r] && typeof data[r][c] === 'number') ? data[r][c] : 0;
    const formatted = Number(val.toFixed(2)).toString();
    // 如果用户正在输入，则不要覆盖输入（避免打字时被重置）
    if (!isTypingRef.current && inputValue !== formatted) {
      setInputValue(formatted);
    }
  }, [data, editingCell, decimals]);

  // Handle Copy/Paste for Selection
  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      if (!selection || editingCell) return;

      // Copy: Ctrl+C
      if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        e.preventDefault();
        let text = '';
        if (selection.type === 'row') {
          text = data[selection.index].map(v => v.toFixed(decimals)).join('\t');
        } else if (selection.type === 'col') {
          text = data.map(row => row[selection.index].toFixed(decimals)).join('\n');
        } else if (selection.type === 'range') {
          const minR = Math.min(selection.startRow, selection.endRow);
          const maxR = Math.max(selection.startRow, selection.endRow);
          const minC = Math.min(selection.startCol, selection.endCol);
          const maxC = Math.max(selection.startCol, selection.endCol);
          
          const rows = [];
          for (let r = minR; r <= maxR; r++) {
            rows.push(data[r].slice(minC, maxC + 1).map(v => v.toFixed(decimals)).join('\t'));
          }
          text = rows.join('\n');
        }
        
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
          
          const changes: {row: number, col: number, value: number}[] = [];
          
          if (selection.type === 'row') {
             // Try tab separated first
             let values = text.split('\t').map(s => parseFloat(s.trim()));
             // Fallback to newline if single value found (maybe copied from column)
             if (values.length === 1 && text.includes('\n')) {
                 values = text.split(/\r?\n/).map(s => parseFloat(s.trim()));
             }
             
             values.forEach((val, idx) => {
                 if (idx < rpmPoints.length && !isNaN(val)) {
                     let finalVal = val;
                     if (min !== undefined) finalVal = Math.max(min, finalVal);
                     if (max !== undefined) finalVal = Math.min(max, finalVal);
                     changes.push({ row: selection.index, col: idx, value: finalVal });
                 }
             });
          } else if (selection.type === 'col') {
             // Column: expect newlines
             let values = text.split(/\r?\n/).map(s => parseFloat(s.trim()));
             if (values.length <= 1 && text.includes('\t')) {
                 values = text.split('\t').map(s => parseFloat(s.trim()));
             }

             values.forEach((val, idx) => {
                 if (idx < loadPoints.length && !isNaN(val)) {
                     let finalVal = val;
                     if (min !== undefined) finalVal = Math.max(min, finalVal);
                     if (max !== undefined) finalVal = Math.min(max, finalVal);
                     changes.push({ row: idx, col: selection.index, value: finalVal });
                 }
             });
          } else if (selection.type === 'range') {
             const minR = Math.min(selection.startRow, selection.endRow);
             const minC = Math.min(selection.startCol, selection.endCol);
             
             const rows = text.split(/\r?\n/);
             rows.forEach((rowStr, rOffset) => {
               const cols = rowStr.split('\t');
               cols.forEach((colStr, cOffset) => {
                 const val = parseFloat(colStr.trim());
                 const targetR = minR + rOffset;
                 const targetC = minC + cOffset;
                 
                 if (!isNaN(val) && targetR < loadPoints.length && targetC < rpmPoints.length) {
                   let finalVal = val;
                   if (min !== undefined) finalVal = Math.max(min, finalVal);
                   if (max !== undefined) finalVal = Math.min(max, finalVal);
                   changes.push({ row: targetR, col: targetC, value: finalVal });
                 }
               });
             });
          }

          if (changes.length > 0 && onBulkChange) {
              onBulkChange(changes);
          }
        } catch (err) {
          console.error('Failed to paste', err);
        }
      }

      // Shortcuts: A/Z (+/- 1), S/X (+/- 0.1), D/C (+/- 0.01)
      if (!editingCell && selection && !e.ctrlKey && !e.metaKey && !e.altKey) {
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
           const changes: {row: number, col: number, value: number}[] = [];
           
           const applyDelta = (r: number, c: number) => {
              if (r >= 0 && r < data.length && c >= 0 && c < data[0].length) {
                 let val = data[r][c] + delta;
                 if (min !== undefined) val = Math.max(min, val);
                 if (max !== undefined) val = Math.min(max, val);
                 val = Number(val.toFixed(Math.max(decimals, 2))); 
                 changes.push({ row: r, col: c, value: val });
              }
           };

           if (selection.type === 'row') {
              for (let c = 0; c < data[0].length; c++) applyDelta(selection.index, c);
           } else if (selection.type === 'col') {
              for (let r = 0; r < data.length; r++) applyDelta(r, selection.index);
           } else if (selection.type === 'range') {
              const minR = Math.min(selection.startRow, selection.endRow);
              const maxR = Math.max(selection.startRow, selection.endRow);
              const minC = Math.min(selection.startCol, selection.endCol);
              const maxC = Math.max(selection.startCol, selection.endCol);
              for (let r = minR; r <= maxR; r++) {
                 for (let c = minC; c <= maxC; c++) {
                    applyDelta(r, c);
                 }
              }
           }

           if (changes.length > 0) {
              if (onBulkChange) {
                  onBulkChange(changes);
              } else if (changes.length === 1 && onCellChange) {
                  onCellChange(changes[0].row, changes[0].col, changes[0].value);
              }
           }
        }
      }

      // Enter to Edit
      if (e.key === 'Enter' && !editingCell) {
          e.preventDefault();
          let r: number | undefined, c: number | undefined;
          if (selection.type === 'row') { r = selection.index; c = 0; }
          else if (selection.type === 'col') { r = 0; c = selection.index; }
          else if (selection.type === 'range') { 
              r = Math.min(selection.startRow, selection.endRow); 
              c = Math.min(selection.startCol, selection.endCol); 
          }
          
          if (r !== undefined && c !== undefined) {
             setEditingCell({ row: r, col: c });
             setInputValue(Number(data[r][c].toFixed(2)).toString());
          }
      }

      // Direct typing to edit (Numbers, minus, dot)
      if (!editingCell && !e.ctrlKey && !e.metaKey && !e.altKey && e.key.length === 1 && /^[0-9.-]$/.test(e.key)) {
          let r: number | undefined, c: number | undefined;
          if (selection.type === 'row') { r = selection.index; c = 0; }
          else if (selection.type === 'col') { r = 0; c = selection.index; }
          else if (selection.type === 'range') { 
              r = Math.min(selection.startRow, selection.endRow); 
              c = Math.min(selection.startCol, selection.endCol); 
          }
          
          if (r !== undefined && c !== undefined) {
             e.preventDefault();
             isTypingRef.current = true;
             setEditingCell({ row: r, col: c });
             setInputValue(e.key);
          }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selection, editingCell, data, decimals, min, max, onBulkChange, rpmPoints.length, loadPoints.length]);

  return (
    <div className="flex flex-col w-full h-full bg-gray-900 text-[11px] select-none overflow-hidden font-mono">
      
      {/* Header Row (X-Axis / RPM) */}
      <div className="flex w-full border-b border-gray-700 bg-gray-800">
        {/* Corner Label */}
        <div 
          className="w-12 flex-shrink-0 p-1 flex items-center justify-center border-r border-gray-700 bg-gray-800 text-gray-500 font-bold text-[14px] leading-tight text-center cursor-pointer"
          onClick={() => {
            setSelection({ type: 'range', startRow: 0, startCol: 0, endRow: loadPoints.length - 1, endCol: rpmPoints.length - 1 });
            setEditingCell({ row: 0, col: 0 });
            setInputValue(data[0][0].toFixed(decimals));
          }}
        >
          {cornerLabel}
        </div>
        
        {/* X-Axis Values */}
        <div className="flex-1 overflow-hidden">
            <div className="flex w-full h-full">
                {rpmPoints.map((rpm, i) => {
                  const isSelected = selection?.type === 'col' && selection.index === i;
                  return (
                    <div 
                        key={i} 
                        className={`flex-1 min-w-[42px] flex items-center justify-center font-bold transition-colors duration-150 border-r border-gray-700 last:border-0 cursor-pointer hover:bg-gray-700
                        ${i === activeColIndex ? 'bg-red-600 text-white' : isSelected ? 'bg-blue-900/50 text-blue-200' : 'bg-gray-800 text-gray-400'}`}
                        style={{ fontSize: 14 }}
                        onClick={() => setSelection(prev => (prev?.type === 'col' && prev.index === i) ? null : { type: 'col', index: i })}
                        onDoubleClick={() => setSelection(null)}
                    >
                        {rpm}
                    </div>
                  );
                })}
            </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 flex overflow-y-auto overflow-x-hidden scrollbar-thin">
        
        {/* Y-Axis Column */}
        <div className="flex flex-col w-12 flex-shrink-0 border-r border-gray-700 bg-gray-800">
          {loadPoints.map((val, i) => {
            const isSelected = selection?.type === 'row' && selection.index === i;
            let label = '';
            // MAP补偿表（KPa）不加百分号，且0.5显示为0
            if (yAxisUnit === 'KPa') {
              if (typeof val === 'number' && val === 0.5) label = '0';
              else if (typeof val === 'number') label = `${val}`;
              else label = '';
            } else if (yAxisUnit === '℃') {
              // 温度补偿表，温度值+℃
              if (typeof val === 'number') label = `${val}℃`;
              else label = '';
            } else if (yAxisUnit === '%') {
              // TPS/负荷表，显示%或IDLE
              if (val === null || val === undefined) label = 'IDLE';
              else if (typeof val === 'number' && val <= 0.5) label = '0.5%';
              else if (typeof val === 'number') label = `${val}%`;
            } else {
              // 没有指定unit时，显示IDLE（用于未来扩展）
              if (val === null || val === undefined) label = 'IDLE';
              else if (typeof val === 'number' && val <= 0.5) label = '0.5%';
              else if (typeof val === 'number') label = `${val}%`;
            }
            return (
              <div 
                key={i} 
                className={`flex-1 min-h-[24px] flex items-center justify-center font-bold transition-colors duration-150 border-b border-gray-700 text-[14px] cursor-pointer hover:bg-gray-700
                ${i === activeRowIndex ? 'bg-red-600 text-white' : isSelected ? 'bg-blue-900/50 text-blue-200' : 'text-gray-400'}`}
                onClick={() => setSelection(prev => (prev?.type === 'row' && prev.index === i) ? null : { type: 'row', index: i })}
                onDoubleClick={() => setSelection(null)}
              >
                {label}
              </div>
            );
          })}
        </div>

        {/* Data Grid */}
        <div 
          className="flex-1 flex flex-col w-full"
          onClick={(e) => {
            if (justFinishedDrag.current) return;
            if (e.target === e.currentTarget) setSelection(null);
          }}
        >
           {data.map((row, rIdx) => (
             <div key={rIdx} className="flex-1 flex min-h-[24px]">
                {row.map((cellValue, cIdx) => {
                    const isActive = rIdx === activeRowIndex && cIdx === activeColIndex;
                    let isSelected = false;
                    if (selection) {
                        if (selection.type === 'row') isSelected = selection.index === rIdx;
                        else if (selection.type === 'col') isSelected = selection.index === cIdx;
                        else if (selection.type === 'range') {
                            const minR = Math.min(selection.startRow, selection.endRow);
                            const maxR = Math.max(selection.startRow, selection.endRow);
                            const minC = Math.min(selection.startCol, selection.endCol);
                            const maxC = Math.max(selection.startCol, selection.endCol);
                            isSelected = rIdx >= minR && rIdx <= maxR && cIdx >= minC && cIdx <= maxC;
                        }
                    }
                    
                    const bg = getHeatmapColor(cellValue, min, max);
                    const isEditing = editingCell && editingCell.row === rIdx && editingCell.col === cIdx;
                    
                    return (
                        <div
                            key={cIdx}
                            ref={isActive ? activeRef : null}
                            className={`flex-1 min-w-[42px] flex items-center justify-center text-gray-900 font-bold border-r border-b border-black/10 cursor-pointer relative
                            ${isActive ? 'z-10' : 'opacity-90 hover:opacity-100'}`}
                            style={{ backgroundColor: isEditing ? '#ff8800' : bg }}
                            onMouseDown={(e) => handleCellMouseDown(rIdx, cIdx, e)}
                            onMouseEnter={() => handleCellMouseEnter(rIdx, cIdx)}
                        >
                            {/* Active Selection Highlight Border */}
                            {isActive && <div className="absolute inset-0 border-2 border-white pointer-events-none shadow-lg z-20"></div>}
                            
                            {/* Row/Col Selection Overlay */}
                            {isSelected && !isActive && <div className="absolute inset-0 bg-blue-600/50 pointer-events-none border-2 border-blue-300/80 z-10"></div>}

                            {editingCell && editingCell.row === rIdx && editingCell.col === cIdx ? (
                              <input
                                ref={inputRef}
                                type="text"
                                value={inputValue}
                                onChange={handleInputChange}
                                onBlur={handleInputBlur}
                                onKeyDown={handleInputKeyDown}
                                autoFocus
                                className="w-full h-full font-bold px-0.5 py-0.5 rounded-md border-2 border-blue-500 focus:border-orange-500 text-right text-base font-mono text-blue-200 shadow-inner outline-none transition-all duration-150 select-all ring-0 focus:bg-[#23272e] focus:text-orange-300"
                                style={{ fontSize: 14, color: 'black', minWidth: 42, textAlign: 'center', fontVariantNumeric: 'tabular-nums', backgroundColor: bg }}
                              />
                          ) : (
                            <span 
                              className={`flex-1 min-w-[42px] flex items-center justify-center text-gray-900 font-bold border-r border-black/10 cursor-pointer relative
                                ${isActive ? 'z-10' : 'opacity-90 hover:opacity-100'}`}
                              style={{ fontSize: 14 }}
                              onClick={() => {
                                if (justFinishedDrag.current) return;
                                setSelection(null);
                                setEditingCell({ row: rIdx, col: cIdx });
                                setInputValue(Number(cellValue.toFixed(2)).toString());
                              }}
                            >
                              {Number(cellValue.toFixed(2)).toString()}
                            </span>
                          )}
                        </div>
                    );
                })}
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};