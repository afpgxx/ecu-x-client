import React, { useState } from 'react';
import { useI18n } from '../i18n/I18nContext';

// 参数页：电压-参数关系表（1D数据表）
export const ParametersView: React.FC = () => {
    const { t } = useI18n();
    const [activeTab, setActiveTab] = useState(0);

    // 子标签定义
    const tabs = [
        { id: 0, label: t.params_tab_afrVoltage },
        { id: 1, label: t.params_tab_iatVoltage },
        { id: 2, label: t.params_tab_ectVoltage },
        { id: 3, label: t.params_tab_pressureVoltage },
        { id: 4, label: t.params_tab_tpsSettings },
        { id: 5, label: t.params_tab_rpmSettings },
    ];

    // 空燃比-电压关系表数据（AFR: 18 -> 9）
    const afrHeaders = [18, 17, 16, 15, 14, 13, 12, 11, 10, 9];
    const afrData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // 初始值为0

    // 空气温度-电压关系表（IAT TEMP: -14°C -> 56°C，间隔7°C）
    const iatHeaders = [-14, -7, 0, 7, 14, 21, 28, 35, 42, 49, 56];
    const iatData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    // 冷却液温度-电压关系表（ECT TEMP: -14°C -> 126°C，间隔14°C）
    const ectHeaders = [-14, 0, 14, 28, 42, 56, 70, 84, 98, 112, 126];
    const ectData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    // 进气压力-电压关系（0~120 KPa，步进12）
    const pressureHeaders = [0,12,24,36,48,60,72,84,96,108,120];
    const pressureData = Array(pressureHeaders.length).fill(0);

    // TPS设置（No.1~No.14，对应0,0.5,3,6,12,...,100%）
    const tpsHeaders = Array.from({length:14}, (_,i) => i+1);
    const tpsPercents = [0,0.5,3,6,12,20,30,40,50,60,70,80,90,100];

    // RPM设置（No.1~No.30，对应500,1000,...,15000）
    const rpmHeaders = Array.from({length:30}, (_,i) => i+1);
    const rpmValues = [
        500,1000,1500,2000,2500,3000,3500,4000,4500,5000,
        5500,6000,6500,7000,7500,8000,8500,9000,9500,10000,
        10500,11000,11500,12000,12500,13000,13500,14000,14500,15000
    ];

    // 渲染当前激活的表格
    const renderActiveTable = () => {
        let xLabel = '';
        let yLabel = 'Voltage';
        let headers: number[] = [];
        let data: number[] = [];

        switch (activeTab) {
            case 0: // AFR
                xLabel = 'AFR';
                headers = afrHeaders;
                data = afrData;
                break;
            case 1: // IAT TEMP
                xLabel = 'IAT TEMP';
                headers = iatHeaders;
                data = iatData;
                break;
            case 2: // ECT TEMP
                xLabel = 'ECT TEMP';
                headers = ectHeaders;
                data = ectData;
                break;
            case 3: // Pressure
                xLabel = 'Pressure';
                headers = pressureHeaders;
                data = pressureData;
                break;
            case 4: // TPS 设置
                xLabel = 'No.';
                headers = tpsHeaders;
                // 数据行显示百分比，但行标题为 TPS(%)，Voltage 行改为 TPS(%)
                yLabel = 'TPS(%)';
                data = tpsPercents;
                break;
            case 5: // RPM 设置
                xLabel = 'No.';
                headers = rpmHeaders;
                yLabel = 'Rpm';
                data = rpmValues;
                break;
        }

        return (
            <div className="flex flex-col w-full h-full bg-[#16181c] text-[11px] select-none overflow-hidden">
                {/* 表头行（X轴标签） */}
                <div className="flex w-full border-b border-gray-700 bg-[#2d323a]">
                    <div className="w-32 flex-shrink-0 p-1 flex items-center justify-center border-r border-gray-700 bg-[#1e2126] text-gray-400 font-bold">
                        {xLabel}
                    </div>
                    <div className="flex-1 overflow-x-auto scrollbar-thin">
                        <div className="flex h-full">
                            {headers.map((val, i) => (
                                <div
                                    key={i}
                                    className="flex-1 min-w-[64px] flex items-center justify-center font-bold bg-[#2d323a] text-white border-r border-gray-700 last:border-0 py-1"
                                >
                                    {activeTab === 0 ? val 
                                      : activeTab === 3 ? `${val} KPa` 
                                      : (activeTab === 4 || activeTab === 5) ? `No.${val}`
                                      : `${val}°C`}
                                </div>
                            ))}
                            {/* Oem Datum 列 */}
                            <div className="w-24 flex-shrink-0 flex items-center justify-center font-bold bg-[#1e2126] text-gray-400 border-l border-gray-700 py-1">
                                Oem Datum
                            </div>
                        </div>
                    </div>
                </div>

                {/* 数据行 */}
                <div className="flex w-full border-b border-gray-700">
                    <div className="w-32 flex-shrink-0 flex items-center justify-center border-r border-gray-700 bg-[#2d323a] text-gray-300 font-bold h-10">
                        {yLabel}
                    </div>
                    <div className="flex-1 overflow-x-auto scrollbar-thin">
                        <div className="flex h-full">
                            {data.map((cellValue, i) => (
                                <div
                                    key={i}
                                    className="flex-1 min-w-[64px] flex items-center justify-center bg-[#111316] text-white font-bold border-r border-gray-700 last:border-0 cursor-pointer hover:bg-[#1a1d24] h-10"
                                >
                                    {cellValue}
                                </div>
                            ))}
                            {/* Oem Datum 数据 */}
                            <div className="w-24 flex-shrink-0 flex items-center justify-center bg-[#111316] text-gray-500 font-bold border-l border-gray-700 h-10">
                                0
                            </div>
                        </div>
                    </div>
                </div>

                {/* 空白填充区域 */}
                <div className="flex-1 bg-[#16181c]"></div>
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full bg-[#16181c] select-none">
            {/* 子标签栏 */}
            <div className="flex gap-1 p-1 bg-[#1e2126] border-b border-gray-700">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-3 py-1 text-xs font-bold rounded transition-all ${
                            activeTab === tab.id
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'bg-[#2d323a] text-gray-400 hover:bg-[#383c44] hover:text-white'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* 表格内容区 */}
            <div className="flex-1 overflow-hidden">
                {renderActiveTable()}
            </div>
        </div>
    );
};