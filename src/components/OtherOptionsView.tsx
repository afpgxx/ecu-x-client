import React, { useState, useEffect, useRef } from 'react';
import { useI18n } from '../i18n/I18nContext';
import { ParamRow } from './ParamRow';

interface OtherOptionsViewProps {
  params: {
    throttleMin: number; throttleMax: number; idleMinInjCold: number; idleMinInjHot: number;
    idleAutoAngle: number; idleAutoInj: number; idleSteps: number; fanTemp: number;
    o2Work: number; o2Delay: number; o2Rpm: number; o2Inj: number;
    startEnrichRpm: number; idleHoleMax: number; idleHoleMin: number; idleHoleMaxAdj: number;
  };
  grids: {
    tempIdle: { stepTime: number[]; injVe: number[] };
    startEnrich: { delayed: number[]; injVeAdd: number[]; notStartedAdd: number[] };
    iatComp: { injVeComp: number[] };
    mapComp: { motorStep: number[] };
    extAdj: { injAdjPct: number[]; ignAdjDeg: number[] };
  };
  onParamsChange: (params: any) => void;
  onGridsChange: (grids: any) => void;
}

type SelectionState = 
  | { type: 'row'; index: number }
  | { type: 'col'; index: number }
  | { type: 'range'; startRow: number; startCol: number; endRow: number; endCol: number }
  | null;

export const OtherOptionsView: React.FC<OtherOptionsViewProps> = ({ params, grids, onParamsChange, onGridsChange }) => {
   const { t } = useI18n();
   
   const subTabs = [
      t.otherOptions_tab_tempIdle,
      t.otherOptions_tab_startEnrich,
      t.otherOptions_tab_iatComp,
      t.otherOptions_tab_mapComp,
      t.otherOptions_tab_extAdj
   ];
   const [activeSubTab, setActiveSubTab] = useState(subTabs[0]);
   const [extAdjMode, setExtAdjMode] = useState<'TPS' | 'RPM'>('TPS');
   const [editingCell, setEditingCell] = useState<{row: number, col: number} | null>(null);
   const [inputValue, setInputValue] = useState('');
   const [selection, setSelection] = useState<SelectionState>(null);
   const [isDragging, setIsDragging] = useState(false);
   const dragStart = useRef<{row: number, col: number} | null>(null);
   const inputRef = useRef<HTMLInputElement>(null);

   const updateParam = (key: keyof typeof params, val: number) => {
     onParamsChange({ ...params, [key]: val });
   };

   // Grid Data Logic - 必须在顶部定义以便其他函数使用
   const getGridData = () => {
     if (activeSubTab === t.otherOptions_tab_startEnrich) {
       return {
         cols: ['-14°C', '0°C', '14°C', '28°C', '42°C', '56°C', '70°C', '84°C', '98°C', '112°C', '126°C'],
         rows: [
           { label: t.otherOptions_row_delayed, values: grids.startEnrich.delayed },
           { label: t.otherOptions_row_injVeAdd, values: grids.startEnrich.injVeAdd },
           { label: t.otherOptions_row_notStartedAdd, values: grids.startEnrich.notStartedAdd },
         ],
         gridKey: 'startEnrich'
       };
     }
     if (activeSubTab === t.otherOptions_tab_iatComp) {
       return {
         cols: ['-14°C', '-7°C', '0°C', '7°C', '14°C', '21°C', '28°C', '35°C', '42°C', '49°C', '56°C'],
         rows: [
           { label: t.otherOptions_row_injVeComp, values: grids.iatComp.injVeComp },
         ],
         gridKey: 'iatComp'
       };
     }
     if (activeSubTab === t.otherOptions_tab_mapComp) {
       const cols = [];
       for(let i=0; i<=120; i+=12) cols.push(`${i} KPa`);
       return {
         cols,
         rows: [
           { label: t.otherOptions_row_motorStep, values: grids.mapComp.motorStep }
         ],
         gridKey: 'mapComp'
       };
     }
     if (activeSubTab === t.otherOptions_tab_extAdj) {
       // 根据 extAdjMode 生成不同的列数据
       let cols;
       if (extAdjMode === 'RPM') {
         // RPM 模式：从 1000 到 15000，公差为 1000 的等差数列
         cols = Array.from({ length: 15 }, (_, i) => `${(i + 1) * 1000}`);
       } else {
         // TPS 模式：原有的百分比列
         cols = ['0%', '0.5%', '3%', '6%', '12%', '20%', '30%', '40%', '50%', '60%', '70%', '80%', '90%', '100%', 'ALL'];
       }
       return {
         cols,
         rows: [
           { label: t.otherOptions_row_injAdjPct, values: grids.extAdj.injAdjPct },
           { label: t.otherOptions_row_ignAdjDeg, values: grids.extAdj.ignAdjDeg },
         ],
         gridKey: 'extAdj'
       };
     }
     // Default: Temp-Idle Motor
     return {
       cols: ['-14°C', '0°C', '14°C', '28°C', '42°C', '56°C', '70°C', '84°C', '98°C', '112°C', '126°C'],
       rows: [
         { label: t.otherOptions_row_stepTime, values: grids.tempIdle.stepTime },
         { label: t.otherOptions_row_injVe, values: grids.tempIdle.injVe },
       ],
       gridKey: 'tempIdle'
     };
   };

   const { cols, rows, gridKey } = getGridData() as any;

   // 拖拽结束事件
   useEffect(() => {
      const handleGlobalMouseUp = () => {
         setIsDragging(false);
         dragStart.current = null;
      };
      window.addEventListener('mouseup', handleGlobalMouseUp);
      return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
   }, []);

   // 输入框获得焦点时选中全部
   useEffect(() => {
      if (editingCell && inputRef.current) {
         inputRef.current.focus();
         inputRef.current.select();
      }
   }, [editingCell]);

   // 处理全局键盘事件（复制、粘贴、快捷键调整等）
   useEffect(() => {
      const handleKeyDown = async (e: KeyboardEvent) => {
         if (!selection || editingCell) return;

         // 复制: Ctrl+C
         if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
            e.preventDefault();
            let text = '';
            const currentRows = rows as any[];
            
            if (selection.type === 'row') {
               text = currentRows[selection.index].values.map((v: number) => v.toFixed(2)).join('\t');
            } else if (selection.type === 'col') {
               text = currentRows.map((row: any) => row.values[selection.index].toFixed(2)).join('\n');
            } else if (selection.type === 'range') {
               const minR = Math.min(selection.startRow, selection.endRow);
               const maxR = Math.max(selection.startRow, selection.endRow);
               const minC = Math.min(selection.startCol, selection.endCol);
               const maxC = Math.max(selection.startCol, selection.endCol);
               
               const rowTexts = [];
               for (let r = minR; r <= maxR; r++) {
                  rowTexts.push(currentRows[r].values.slice(minC, maxC + 1).map((v: number) => v.toFixed(2)).join('\t'));
               }
               text = rowTexts.join('\n');
            }
            
            try {
               await navigator.clipboard.writeText(text);
            } catch (err) {
               console.error('复制失败', err);
            }
         }

         // 粘贴: Ctrl+V
         if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
            e.preventDefault();
            try {
               const text = await navigator.clipboard.readText();
               if (!text) return;
               
               const changes: {row: number, col: number, value: number}[] = [];
               
               if (selection.type === 'row') {
                  let values = text.split('\t').map(s => parseFloat(s.trim()));
                  if (values.length === 1 && text.includes('\n')) {
                     values = text.split(/\r?\n/).map(s => parseFloat(s.trim()));
                  }
                  
                  values.forEach((val, idx) => {
                     if (idx < cols.length && !isNaN(val)) {
                        changes.push({ row: selection.index, col: idx, value: val });
                     }
                  });
               } else if (selection.type === 'col') {
                  let values = text.split(/\r?\n/).map(s => parseFloat(s.trim()));
                  if (values.length <= 1 && text.includes('\t')) {
                     values = text.split('\t').map(s => parseFloat(s.trim()));
                  }

                  values.forEach((val, idx) => {
                     if (idx < rows.length && !isNaN(val)) {
                        changes.push({ row: idx, col: selection.index, value: val });
                     }
                  });
               } else if (selection.type === 'range') {
                  const minR = Math.min(selection.startRow, selection.endRow);
                  const minC = Math.min(selection.startCol, selection.endCol);
                  
                  const rowTexts = text.split(/\r?\n/);
                  rowTexts.forEach((rowStr, rOffset) => {
                    const colVals = rowStr.split('\t');
                    colVals.forEach((colStr, cOffset) => {
                      const val = parseFloat(colStr.trim());
                      const targetR = minR + rOffset;
                      const targetC = minC + cOffset;
                      
                      if (!isNaN(val) && targetR < rows.length && targetC < cols.length) {
                        changes.push({ row: targetR, col: targetC, value: val });
                      }
                    });
                  });
               }

               if (changes.length > 0) {
                  applyBulkChanges(changes);
               }
            } catch (err) {
               console.error('粘贴失败', err);
            }
         }

         // 快捷键调整: A/Z (+/- 1), S/X (+/- 0.1), D/C (+/- 0.01)
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
                  if (r >= 0 && r < rows.length && c >= 0 && c < cols.length) {
                     let val = rows[r].values[c] + delta;
                     val = Number(val.toFixed(2));
                     changes.push({ row: r, col: c, value: val });
                  }
               };

               if (selection.type === 'row') {
                  for (let c = 0; c < cols.length; c++) applyDelta(selection.index, c);
               } else if (selection.type === 'col') {
                  for (let r = 0; r < rows.length; r++) applyDelta(r, selection.index);
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
                  applyBulkChanges(changes);
               }
            }
         }

         // 按 Enter 开始编辑
         if (e.key === 'Enter' && !editingCell && selection) {
            e.preventDefault();
            let r: number | undefined, c: number | undefined;
            if (selection.type === 'row') { r = selection.index; c = 0; }
            else if (selection.type === 'col') { r = 0; c = selection.index; }
            else if (selection.type === 'range') {
               r = Math.min(selection.startRow, selection.endRow);
               c = Math.min(selection.startCol, selection.endCol);
            }
            
            if (r !== undefined && c !== undefined && r < rows.length && c < cols.length) {
               setEditingCell({ row: r, col: c });
               setInputValue(rows[r].values[c].toString());
            }
         }

         // 直接输入数字开始编辑
         if (!editingCell && selection && !e.ctrlKey && !e.metaKey && !e.altKey && e.key.length === 1 && /^[0-9.-]$/.test(e.key)) {
            let r: number | undefined, c: number | undefined;
            if (selection.type === 'row') { r = selection.index; c = 0; }
            else if (selection.type === 'col') { r = 0; c = selection.index; }
            else if (selection.type === 'range') {
               r = Math.min(selection.startRow, selection.endRow);
               c = Math.min(selection.startCol, selection.endCol);
            }
            
            if (r !== undefined && c !== undefined && r < rows.length && c < cols.length) {
               e.preventDefault();
               setEditingCell({ row: r, col: c });
               setInputValue(e.key);
            }
         }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
   }, [selection, editingCell, rows, cols]);

   // 应用批量修改
   const applyBulkChanges = (changes: {row: number, col: number, value: number}[]) => {
      const newGrids = { ...grids };
      const gridData = (grids[gridKey as keyof typeof grids] as any);
      const rowKeys = Object.keys(gridData);
      
      // 按行分组，逐行更新
      const changesByRow = new Map<number, Map<number, number>>();
      changes.forEach(({ row, col, value }) => {
         if (!changesByRow.has(row)) changesByRow.set(row, new Map());
         changesByRow.get(row)!.set(col, value);
      });

      changesByRow.forEach((colMap, rowIndex) => {
         const currentRowKey = rowKeys[rowIndex];
         if (currentRowKey) {
            const currentArray = gridData[currentRowKey];
            const newArray = [...currentArray];
            colMap.forEach((value, colIndex) => {
               newArray[colIndex] = value;
            });
            (newGrids[gridKey as keyof typeof grids] as any)[currentRowKey] = newArray;
         }
      });
      
      onGridsChange(newGrids);
   };

   const handleCellChange = (rowIndex: number, colIndex: number, value: number) => {
     const newGrids = { ...grids };
     const rowKey = Object.keys(grids[gridKey as keyof typeof grids])[rowIndex];
     const currentArray = (grids[gridKey as keyof typeof grids] as any)[rowKey];
     const newArray = [...currentArray];
     newArray[colIndex] = value;
     (newGrids[gridKey as keyof typeof grids] as any) = {
       ...(grids[gridKey as keyof typeof grids] as any),
       [rowKey]: newArray
     };
     onGridsChange(newGrids);
   };

   const saveCurrentEdit = () => {
      if (!editingCell) return;
      const parsed = parseFloat(inputValue);
      if (!isNaN(parsed)) {
         // 检查是否需要批量更新
         if (selection) {
            const changes: {row: number, col: number, value: number}[] = [];
            
            if (selection.type === 'row' && selection.index === editingCell.row) {
               // 更新整行
               for (let c = 0; c < cols.length; c++) {
                  changes.push({ row: selection.index, col: c, value: parsed });
               }
            } else if (selection.type === 'col' && selection.index === editingCell.col) {
               // 更新整列
               for (let r = 0; r < rows.length; r++) {
                  changes.push({ row: r, col: selection.index, value: parsed });
               }
            } else if (selection.type === 'range') {
               // 更新范围
               const minR = Math.min(selection.startRow, selection.endRow);
               const maxR = Math.max(selection.startRow, selection.endRow);
               const minC = Math.min(selection.startCol, selection.endCol);
               const maxC = Math.max(selection.startCol, selection.endCol);
               
               if (editingCell.row >= minR && editingCell.row <= maxR && 
                   editingCell.col >= minC && editingCell.col <= maxC) {
                  for (let r = minR; r <= maxR; r++) {
                     for (let c = minC; c <= maxC; c++) {
                        changes.push({ row: r, col: c, value: parsed });
                     }
                  }
               } else {
                  changes.push({ row: editingCell.row, col: editingCell.col, value: parsed });
               }
            } else {
               // 单单元格更新（回退）
               changes.push({ row: editingCell.row, col: editingCell.col, value: parsed });
            }
            
            if (changes.length > 0) {
               applyBulkChanges(changes);
            }
         } else {
            // 单单元格更新
            handleCellChange(editingCell.row, editingCell.col, parsed);
         }
      }
   };

   const handleInputBlur = () => {
      saveCurrentEdit();
      setEditingCell(null);
   };

   const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
         e.preventDefault();
         saveCurrentEdit();
         // 向下移动
         if (editingCell) {
            const nextRow = editingCell.row + 1;
            if (nextRow < rows.length) {
               setEditingCell({ row: nextRow, col: editingCell.col });
               setInputValue(rows[nextRow][editingCell.col].values[editingCell.col].toString());
            } else {
               setEditingCell(null);
            }
         }
      } else if (e.key === 'Tab') {
         e.preventDefault();
         saveCurrentEdit();
         // 向右移动
         if (editingCell) {
            const nextCol = editingCell.col + 1;
            if (nextCol < cols.length) {
               setEditingCell({ row: editingCell.row, col: nextCol });
               setInputValue(rows[editingCell.row].values[nextCol].toString());
            } else {
               const nextRow = editingCell.row + 1;
               if (nextRow < rows.length) {
                  setEditingCell({ row: nextRow, col: 0 });
                  setInputValue(rows[nextRow].values[0].toString());
               } else {
                  setEditingCell(null);
               }
            }
         }
      } else if (e.key === 'Escape') {
         setEditingCell(null);
      } else if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
         // 方向键导航
         if (editingCell) {
            e.preventDefault();
            saveCurrentEdit();
            
            let nextRow = editingCell.row;
            let nextCol = editingCell.col;

            if (e.key === 'ArrowUp') nextRow = Math.max(0, nextRow - 1);
            if (e.key === 'ArrowDown') nextRow = Math.min(rows.length - 1, nextRow + 1);
            if (e.key === 'ArrowLeft') nextCol = Math.max(0, nextCol - 1);
            if (e.key === 'ArrowRight') nextCol = Math.min(cols.length - 1, nextCol + 1);

            if (nextRow !== editingCell.row || nextCol !== editingCell.col) {
               setEditingCell({ row: nextRow, col: nextCol });
               setInputValue(rows[nextRow].values[nextCol].toString());
            }
         }
      }

      // 快捷键微调: A/Z (+/- 1), S/X (+/- 0.1), D/C (+/- 0.01)
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
               newVal = Number(newVal.toFixed(2));
               setInputValue(newVal.toString());
               if (editingCell) {
                  handleCellChange(editingCell.row, editingCell.col, newVal);
               }
            }
         }
      }
   };

   const handleCellMouseDown = (rIdx: number, cIdx: number, e: React.MouseEvent) => {
      if (e.button !== 0) return;
      if (editingCell?.row === rIdx && editingCell?.col === cIdx) return;

      e.stopPropagation();
      setIsDragging(true);
      dragStart.current = { row: rIdx, col: cIdx };
      setEditingCell(null);
   };

   const handleCellMouseEnter = (rIdx: number, cIdx: number) => {
      if (isDragging && dragStart.current) {
         setSelection({
            type: 'range',
            startRow: dragStart.current.row,
            startCol: dragStart.current.col,
            endRow: rIdx,
            endCol: cIdx
         });
      }
   };

   // Determine the top-left header label based on active tab
   let topLeftHeader = t.otherOptions_row_ect;
   if (activeSubTab === t.otherOptions_tab_iatComp) topLeftHeader = t.otherOptions_row_iat;
   if (activeSubTab === t.otherOptions_tab_mapComp) topLeftHeader = 'MAP';
   if (activeSubTab === t.otherOptions_tab_extAdj) topLeftHeader = extAdjMode;

   return (
      <div className="flex flex-col h-full bg-[#16181c] p-1 gap-1 overflow-y-auto">
         {/* Top Section: 3 Parameter Blocks */}
         <div className="flex gap-1 shrink-0">
            {/* Block 1 */}
            <div className="flex-1 border border-gray-700 flex flex-col bg-[#1e2126]">
               <div className="flex-1 flex flex-col">
                  <ParamRow label={t.otherOptions_throttleMin} value={params.throttleMin} unit="V" onChange={(v) => updateParam('throttleMin', v)} min={0} max={99999} decimals={0} />
                  <ParamRow label={t.otherOptions_throttleMax} value={params.throttleMax} unit="V" onChange={(v) => updateParam('throttleMax', v)} min={0} max={99999} decimals={0} />
                  <ParamRow label={t.otherOptions_idleMinInjCold} value={params.idleMinInjCold} unit="ms" onChange={(v) => updateParam('idleMinInjCold', v)} min={0} max={99999} decimals={0} />
                  <ParamRow label={t.otherOptions_idleMinInjHot} value={params.idleMinInjHot} unit="ms" onChange={(v) => updateParam('idleMinInjHot', v)} min={0} max={99999} decimals={0} />
                  <ParamRow label={t.otherOptions_idleAutoAngle} value={params.idleAutoAngle} unit="∠°" onChange={(v) => updateParam('idleAutoAngle', v)} min={-30} max={99999} decimals={0} />
                  <ParamRow label={t.otherOptions_idleAutoInj} value={params.idleAutoInj} unit="ms" onChange={(v) => updateParam('idleAutoInj', v)} min={0} max={99999} decimals={0} />
               </div>
            </div>
            {/* Block 2 */}
            <div className="flex-1 border border-gray-700 flex flex-col bg-[#1e2126]">
               <div className="flex-1 flex flex-col">
                  <ParamRow label={t.otherOptions_idleSteps} value={params.idleSteps} unit="STEP" onChange={(v) => updateParam('idleSteps', v)} min={0} max={99999} decimals={0} />
                  <ParamRow label={t.otherOptions_fanTemp} value={params.fanTemp} unit="°C" onChange={(v) => updateParam('fanTemp', v)} min={-273.15} max={99999} decimals={0} />
                  <ParamRow label={t.otherOptions_o2Work} value={params.o2Work} unit="V" onChange={(v) => updateParam('o2Work', v)} min={0} max={99999} decimals={0} />
                  <ParamRow label={t.otherOptions_o2Delay} value={params.o2Delay} unit="Second" onChange={(v) => updateParam('o2Delay', v)} min={0} max={99999} decimals={0} />
                  <ParamRow label={t.otherOptions_o2Rpm} value={params.o2Rpm} unit="RPM" onChange={(v) => updateParam('o2Rpm', v)} min={0} max={99999} decimals={0} />
                  <ParamRow label={t.otherOptions_o2Inj} value={params.o2Inj} unit="%" onChange={(v) => updateParam('o2Inj', v)} min={0} max={99999} decimals={0} />
               </div>
            </div>
            {/* Block 3 */}
            <div className="flex-1 border border-gray-700 flex flex-col bg-[#1e2126]">
               <div className="flex-1 flex flex-col">
                  <ParamRow label={t.otherOptions_startEnrichRpm} value={params.startEnrichRpm} unit="RPM" onChange={(v) => updateParam('startEnrichRpm', v)} min={0} max={99999} decimals={0} />
                  <ParamRow label={t.otherOptions_idleHoleMax} value={params.idleHoleMax} unit="STEP" onChange={(v) => updateParam('idleHoleMax', v)} min={0} max={99999} decimals={0} />
                  <ParamRow label={t.otherOptions_idleHoleMin} value={params.idleHoleMin} unit="STEP" onChange={(v) => updateParam('idleHoleMin', v)} min={0} max={99999} decimals={0} />
                  <ParamRow label={t.otherOptions_idleHoleMaxAdj} value={params.idleHoleMaxAdj} unit="STEP" onChange={(v) => updateParam('idleHoleMaxAdj', v)} min={0} max={99999} decimals={0} />
                  <ParamRow label="0" value={0} unit="0" highlighted={false} decimals={0} />
                  <ParamRow label="0" value={0} unit="0" highlighted={false} decimals={0} />
               </div>
            </div>
         </div>

         {/* Middle Section: Sub Tabs */}
         <div className="flex items-center justify-between bg-[#16181c] mt-1 shrink-0">
            <div className="flex gap-1 overflow-x-auto">
               {subTabs.map(tab => (
                  <button
                     key={tab}
                     onClick={() => setActiveSubTab(tab)}
                     className={`px-2 py-1 text-[12px] font-bold border border-gray-700 whitespace-nowrap transition-colors
                        ${activeSubTab === tab 
                           ? 'bg-blue-600 text-white border-blue-500' 
                           : 'bg-[#23272e] text-gray-400 hover:bg-[#2d323a]'}`}
                  >
                     {tab}
                  </button>
               ))}
            </div>
            
            {/* Checkboxes for External Adjust */}
            {activeSubTab === t.otherOptions_tab_extAdj && (
               <div className="flex items-center gap-4 px-2 text-xs text-gray-300">
                  <label className="flex items-center gap-1 cursor-pointer select-none">
                     <input 
                        type="checkbox" 
                        checked={extAdjMode === 'TPS'} 
                        onChange={() => setExtAdjMode('TPS')}
                        className="accent-blue-600"
                     />
                     TPS
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer select-none">
                     <input 
                        type="checkbox" 
                        checked={extAdjMode === 'RPM'} 
                        onChange={() => setExtAdjMode('RPM')}
                        className="accent-blue-600"
                     />
                     RPM
                  </label>
               </div>
            )}
         </div>

         {/* Bottom Section: Data Grid */}
         <div className="flex-1 border border-gray-700 overflow-auto bg-[#1e2126]">
            <div className="min-w-max">
               <div className="flex h-8 text-sm border-b border-gray-700">
                  <div 
                     className="w-40 bg-[#2d323a] border-r border-gray-700 text-gray-400 flex items-center justify-center font-bold sticky left-0 z-10 cursor-pointer hover:bg-[#3a4048]"
                     onClick={() => {
                        setSelection({ type: 'range', startRow: 0, startCol: 0, endRow: rows.length - 1, endCol: cols.length - 1 });
                        setEditingCell(null);
                     }}
                  >
                     {topLeftHeader}
                  </div>
                  {cols.map((col: any, i: number) => {
                     const isSelected = selection?.type === 'col' && selection.index === i;
                     return (
                        <div 
                           key={i} 
                           className={`flex-1 min-w-[60px] bg-[#2d323a] border-r border-gray-700 flex items-center justify-center font-bold cursor-pointer transition-colors
                           ${isSelected ? 'bg-blue-900/70 text-blue-200' : 'text-gray-400 hover:bg-[#3a4048]'}`}
                           onClick={() => setSelection(prev => (prev?.type === 'col' && prev.index === i) ? null : { type: 'col', index: i })}
                           onDoubleClick={() => setSelection(null)}
                        >
                           {col}
                        </div>
                     );
                  })}
               </div>
               {rows.map((row: any, rIndex: number) => {
                  const isRowSelected = selection?.type === 'row' && selection.index === rIndex;
                  return (
                     <div key={rIndex} className="flex h-8 text-sm border-b border-gray-700 last:border-0">
                        <div 
                           className={`w-40 bg-[#2d323a] border-r border-gray-700 flex items-center justify-center font-bold sticky left-0 z-10 truncate px-1 cursor-pointer transition-colors
                           ${isRowSelected ? 'bg-blue-900/70 text-blue-200' : 'text-gray-400 hover:bg-[#3a4048]'}`}
                           title={row.label}
                           style={{ fontSize: '0.875rem' }}
                           onClick={() => setSelection(prev => (prev?.type === 'row' && prev.index === rIndex) ? null : { type: 'row', index: rIndex })}
                           onDoubleClick={() => setSelection(null)}
                        >
                           {row.label}
                        </div>
                        {row.values.map((val: number, cIndex: number) => {
                           const isCellSelected = 
                              (selection?.type === 'row' && selection.index === rIndex) ||
                              (selection?.type === 'col' && selection.index === cIndex) ||
                              (selection?.type === 'range' && 
                               rIndex >= Math.min(selection.startRow, selection.endRow) && 
                               rIndex <= Math.max(selection.startRow, selection.endRow) &&
                               cIndex >= Math.min(selection.startCol, selection.endCol) && 
                               cIndex <= Math.max(selection.startCol, selection.endCol));
                           
                           const isEditing = editingCell && editingCell.row === rIndex && editingCell.col === cIndex;
                           
                           return (
                              <div 
                                key={cIndex} 
                                className={`flex-1 min-w-[60px] text-white font-bold flex items-center justify-center border-r border-gray-700 cursor-pointer transition-colors
                                ${isEditing ? 'bg-orange-600' : isCellSelected ? 'bg-blue-900/50 text-blue-100' : 'bg-[#111316] hover:bg-gray-800'}`}
                                onMouseDown={(e) => handleCellMouseDown(rIndex, cIndex, e)}
                                onMouseEnter={() => handleCellMouseEnter(rIndex, cIndex)}
                                onClick={() => {
                                   if (!isEditing) {
                                      setEditingCell({ row: rIndex, col: cIndex });
                                      setInputValue(val.toString());
                                      setSelection(null);
                                   }
                                }}
                              >
                                 {isEditing ? (
                                    <input
                                      ref={inputRef}
                                      type="text"
                                      className="w-full h-full bg-orange-600 text-white text-center outline-none font-bold"
                                      value={inputValue}
                                      onChange={(e) => setInputValue(e.target.value)}
                                      onBlur={handleInputBlur}
                                      onKeyDown={handleInputKeyDown}
                                    />
                                 ) : (
                                    val
                                 )}
                              </div>
                           );
                        })}
                     </div>
                  );
               })}

            </div>
         </div>
      </div>
   );
};