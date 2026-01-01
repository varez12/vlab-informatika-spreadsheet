import React, { useState, useEffect } from 'react';
import {
    BarChart3,
    PieChart as PieChartIcon,
    Table,
    Plus,
    Trash2,
    CheckCircle,
    FileSpreadsheet,
    Grid,
    TrendingUp,
    MousePointer2,
    Info
} from 'lucide-react';

const ExcelChart = () => {
    // --- STATE ---

    // Grid Data: 10 rows x 5 cols
    const ROWS = 15;
    const COLS = 5; // A B C D E
    const COL_HEADERS = ['A', 'B', 'C', 'D', 'E'];

    // Initial Data populated in the grid
    const [gridData, setGridData] = useState(() => {
        const d = {};
        // Headers
        d['A1'] = 'Bulan'; d['B1'] = 'Penjualan';
        // Values
        d['A2'] = 'Januari'; d['B2'] = '50';
        d['A3'] = 'Februari'; d['B3'] = '80';
        d['A4'] = 'Maret'; d['B4'] = '65';
        d['A5'] = 'April'; d['B5'] = '90';
        return d;
    });

    const [selection, setSelection] = useState(['A1', 'B5']); // Start, End cells of selection
    const [activeCell, setActiveCell] = useState(null);
    const [activeTab, setActiveTab] = useState('Home');

    // Chart State
    const [chartData, setChartData] = useState([]);
    const [chartType, setChartType] = useState(null); // null, 'column', 'pie'
    const [step, setStep] = useState(1); // 1: Input/Select, 2: Insert Tab, 3: Choose Chart, 4: Done

    const [toast, setToast] = useState(null);
    const showMessage = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    };

    // --- LOGIC ---

    // Parse selection to get data for chart
    useEffect(() => {
        // Simple logic: Extract data from the assumed table structure (Label Col A, Value Col B)
        // In a real app, this would parse the specific range 'selection'
        // For simulation, we just pull the rows that have data in A and B within the known range
        const data = [];
        let hasHeader = false;

        // Hardcoded extraction for simulation stability, looking at rows 2-10
        for (let r = 1; r <= 10; r++) {
            const label = gridData[`A${r}`];
            const val = gridData[`B${r}`];

            if (r === 1 && label && val) hasHeader = true; // Just detection

            if (r > 1 && label && val && !isNaN(val)) {
                data.push({ id: r, label, value: Number(val) });
            }
        }
        setChartData(data);
    }, [gridData, selection]);

    const handleCellChange = (cell, val) => {
        setGridData({ ...gridData, [cell]: val });
    };

    // Range Selection Simulation (Click Start, Shift+Click End)
    const handleCellClick = (cell, e) => {
        if (e.shiftKey) {
            setSelection([selection[0], cell]); // Expand selection
            if (step === 1) setStep(2); // Progress to step 2 if selecting
        } else {
            setSelection([cell, cell]); // Reset selection
            setActiveCell(cell);
        }
    };

    const handleChartInsert = (type) => {
        if (activeTab !== 'Insert') {
            showMessage("⚠️ Buka tab 'Insert' terlebih dahulu!");
            return;
        }
        if (chartData.length === 0) {
            showMessage("⚠️ Tidak ada data numerik yang dipilih!");
            return;
        }

        setChartType(type);
        setStep(4);
        showMessage(`✅ Grafik ${type === 'column' ? 'Batang' : 'Lingkaran'} Dibuat!`);
    };

    // --- RENDERERS ---

    const renderColumnChart = () => {
        if (!chartData.length) return null;
        const maxValue = Math.max(...chartData.map(d => d.value)) * 1.1 || 100;
        return (
            <svg width="100%" height="300" className="animate-in fade-in zoom-in duration-500">
                {chartData.map((item, i) => {
                    const h = (item.value / maxValue) * 200;
                    const x = 50 + (i * 60);
                    const y = 250 - h;
                    return (
                        <g key={i}>
                            <rect x={x} y={y} width="40" height={h} fill="#4f46e5" rx="2" className="hover:fill-indigo-400 cursor-pointer transition-colors" />
                            <text x={x + 20} y={y - 5} textAnchor="middle" fontSize="10" fontWeight="bold">{item.value}</text>
                            <text x={x + 20} y={265} textAnchor="middle" fontSize="10">{item.label}</text>
                        </g>
                    );
                })}
                <line x1="40" y1="250" x2="400" y2="250" stroke="#cbd5e1" strokeWidth="2" />
                <text x="250" y="290" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#475569">Grafik Penjualan</text>
            </svg>
        );
    };

    const renderPieChart = () => {
        if (!chartData.length) return null;
        const total = chartData.reduce((a, b) => a + b.value, 0);
        let accContent = 0;
        const colors = ['#4f46e5', '#8b5cf6', '#ec4899', '#f43f5e', '#10b981'];

        return (
            <svg width="100%" height="300" viewBox="0 0 300 300" className="animate-in fade-in zoom-in duration-500">
                <g transform="translate(150,150)">
                    {chartData.map((item, i) => {
                        const val = (item.value / total) * 360;
                        const startA = accContent;
                        const endA = startA + val;
                        accContent += val;

                        // calc large arc flag
                        const largeArc = val > 180 ? 1 : 0;

                        // Cartesians
                        const r = 100;
                        const x1 = r * Math.cos(Math.PI * startA / 180);
                        const y1 = r * Math.sin(Math.PI * startA / 180);
                        const x2 = r * Math.cos(Math.PI * endA / 180);
                        const y2 = r * Math.sin(Math.PI * endA / 180);

                        const d = `M 0 0 L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;

                        return (
                            <path key={i} d={d} fill={colors[i % colors.length]} stroke="white" strokeWidth="2" className="hover:opacity-80 transition-opacity" />
                        );
                    })}
                </g>
                {/* Legend */}
                {chartData.map((item, i) => (
                    <g key={i} transform={`translate(10, ${10 + i * 15})`}>
                        <rect width="10" height="10" fill={colors[i % colors.length]} rx="2" />
                        <text x="15" y="8" fontSize="8" fill="#333">{item.label}: {item.value}</text>
                    </g>
                ))}
            </svg>
        )
    }

    return (
        <div className="h-[calc(100vh-4rem)] bg-slate-100 font-sans text-slate-800 flex flex-col overflow-hidden relative">

            {/* TOAST */}
            {toast && (
                <div className="fixed top-32 left-1/2 -translate-x-1/2 z-[500] bg-slate-900 text-white px-6 py-2 rounded-full shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
                    <CheckCircle size={16} className="text-emerald-400" />
                    <span className="text-xs font-bold">{toast}</span>
                </div>
            )}

            {/* GUIDE PANEL floating */}
            <div className="absolute top-4 right-4 z-40 bg-white p-4 rounded-lg shadow-lg border border-indigo-100 w-64 animate-in slide-in-from-right-10">
                <h4 className="text-xs font-black uppercase text-indigo-600 mb-2 flex items-center gap-2">
                    <Info size={14} /> Panduan Langkah
                </h4>
                <div className="space-y-2">
                    <div className={`p-2 rounded text-xs flex items-center gap-2 transition-colors ${step === 1 ? 'bg-indigo-50 border border-indigo-200 text-indigo-800 font-bold' : 'text-slate-400'}`}>
                        <div className="w-5 h-5 rounded-full bg-white border border-current flex items-center justify-center shrink-0">1</div>
                        <span>Blok Data (Klik A1, Tekan Shift+Klik B5)</span>
                    </div>
                    <div className={`p-2 rounded text-xs flex items-center gap-2 transition-colors ${step === 2 && activeTab !== 'Insert' ? 'bg-indigo-50 border border-indigo-200 text-indigo-800 font-bold' : (step > 2 ? 'text-green-600' : 'text-slate-400')}`}>
                        <div className="w-5 h-5 rounded-full bg-white border border-current flex items-center justify-center shrink-0">2</div>
                        <span>Klik Tab <b>INSERT</b></span>
                    </div>
                    <div className={`p-2 rounded text-xs flex items-center gap-2 transition-colors ${step === 2 && activeTab === 'Insert' ? 'bg-indigo-50 border border-indigo-200 text-indigo-800 font-bold' : (step > 3 ? 'text-green-600' : 'text-slate-400')}`}>
                        <div className="w-5 h-5 rounded-full bg-white border border-current flex items-center justify-center shrink-0">3</div>
                        <span>Pilih Jenis Grafik</span>
                    </div>
                </div>
            </div>

            {/* RIBBON */}
            <div className="bg-[#f3f3f3] border-b border-slate-300 select-none shrink-0 font-sans z-30">
                <div className="flex bg-[#e1e1e1] px-2 text-[11px]">
                    {['File', 'Home', 'Insert', 'Page Layout', 'Data', 'View'].map(tab => (
                        <div
                            key={tab}
                            onClick={() => { setActiveTab(tab); if (step === 2 && tab === 'Insert') setStep(3); }}
                            className={`px-4 py-1.5 cursor-pointer border-t-2 transition-colors ${activeTab === tab ? 'bg-[#f3f3f3] font-bold text-green-700 border-green-600' : 'border-transparent text-slate-600 hover:bg-slate-300'}`}
                        >
                            {tab}
                        </div>
                    ))}
                </div>

                <div className="p-1 px-4 flex items-center gap-1 bg-[#f3f3f3] h-[90px]">
                    {activeTab === 'Insert' ? (
                        <>
                            {/* Charts Group */}
                            <div className="flex px-2 border-r border-slate-300 h-full py-1 gap-2">
                                <div onClick={() => handleChartInsert('column')} className="flex flex-col items-center justify-center px-3 hover:bg-slate-200 rounded cursor-pointer group">
                                    <BarChart3 className="text-slate-600 group-hover:text-green-600 mb-1" size={24} />
                                    <span className="text-[9px] font-medium text-slate-600">Column</span>
                                    <div className="text-[8px] text-slate-400">▼</div>
                                </div>
                                <div onClick={() => handleChartInsert('pie')} className="flex flex-col items-center justify-center px-3 hover:bg-slate-200 rounded cursor-pointer group">
                                    <PieChartIcon className="text-slate-600 group-hover:text-green-600 mb-1" size={24} />
                                    <span className="text-[9px] font-medium text-slate-600">Pie</span>
                                    <div className="text-[8px] text-slate-400">▼</div>
                                </div>
                            </div>
                            <div className="h-full flex items-end ml-2 pb-1">
                                <span className="text-[10px] text-slate-400 font-medium">Charts</span>
                            </div>
                        </>
                    ) : (
                        <div className="text-slate-400 italic text-xs ml-4">Klik 'Insert' untuk melihat opsi grafik.</div>
                    )}
                </div>
            </div>

            {/* WORKSPACE - SPLIT */}
            <div className="flex flex-1 overflow-hidden">

                {/* LEFT: GRID (SPREADSHEET) */}
                <div className="w-1/2 bg-white flex flex-col border-r border-slate-300 text-sm overflow-auto">
                    {/* Headers */}
                    <div className="flex sticky top-0 bg-slate-100 z-20 border-b border-slate-300 font-bold text-slate-500">
                        <div className="w-8 border-r border-slate-300 flex items-center justify-center bg-slate-200">◢</div>
                        {COL_HEADERS.map(col => (
                            <div key={col} className="w-24 border-r border-slate-300 flex items-center justify-center py-1">{col}</div>
                        ))}
                    </div>

                    {/* Rows */}
                    {Array.from({ length: ROWS }).map((_, rIdx) => {
                        const rowNum = rIdx + 1;
                        return (
                            <div key={rowNum} className="flex border-b border-slate-200 hover:bg-slate-50">
                                {/* Row Header */}
                                <div className="w-8 border-r border-slate-300 bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-500 shrink-0">
                                    {rowNum}
                                </div>
                                {/* Cells */}
                                {COL_HEADERS.map((col, cIdx) => {
                                    const cellId = `${col}${rowNum}`;
                                    // Selection Logic: naive
                                    // Check if cell is in range selection
                                    // E.g. A1 to B5.
                                    // Hacky simulation: Just check bounds if simple

                                    // Simple check: Is this cell inside the bounding box of selection[0] and selection[1]?
                                    const s1 = selection[0] || 'A1';
                                    const s2 = selection[1] || 'A1';

                                    // Convert A1 to coords (0,0)
                                    const getCoords = (cid) => ({ c: cid.charCodeAt(0) - 65, r: parseInt(cid.substring(1)) });
                                    const c1 = getCoords(s1);
                                    const c2 = getCoords(s2);
                                    const curr = getCoords(cellId);

                                    const minC = Math.min(c1.c, c2.c); const maxC = Math.max(c1.c, c2.c);
                                    const minR = Math.min(c1.r, c2.r); const maxR = Math.max(c1.r, c2.r);

                                    const isSelected = curr.c >= minC && curr.c <= maxC && curr.r >= minR && curr.r <= maxR;

                                    return (
                                        <div
                                            key={cellId}
                                            className={`w-24 border-r border-slate-200 relative ${isSelected ? 'bg-indigo-100 border border-indigo-500 z-10' : ''}`}
                                            onClick={(e) => handleCellClick(cellId, e)}
                                        >
                                            <input
                                                className="w-full h-full px-2 py-1 bg-transparent outline-none cursor-cell text-xs"
                                                value={gridData[cellId] || ''}
                                                onChange={(e) => handleCellChange(cellId, e.target.value)}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>

                {/* RIGHT: CHART CANVAS */}
                <div className="flex-1 bg-slate-200 flex flex-col p-8 items-center justify-center relative">
                    <div className="absolute inset-0 bg-[#f8fafc] opacity-50 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                    {/* Placeholder or Chart */}
                    <div className="bg-white p-6 shadow-xl w-full max-w-md min-h-[350px] flex flex-col items-center justify-center border border-slate-300 relative">
                        {chartType ? (
                            <>
                                <h3 className="w-full text-center text-lg font-bold text-slate-800 mb-4">{chartData[0]?.label || 'Grafik'} vs Nilai</h3>
                                {chartType === 'column' ? renderColumnChart() : renderPieChart()}
                            </>
                        ) : (
                            <div className="text-center text-slate-400">
                                <BarChart3 size={64} className="mx-auto mb-4 opacity-20" />
                                <p className="text-sm">Area Grafik</p>
                                <p className="text-xs mt-2 text-indigo-500 font-bold bg-indigo-50 px-3 py-1 rounded inline-block">
                                    Ikuti panduan di pojok kanan atas
                                </p>
                            </div>
                        )}
                    </div>
                </div>

            </div>

            {/* FOOTER */}
            <div className="bg-green-700 h-6 w-full flex items-center px-4 text-[10px] text-white font-mono justify-between z-30">
                <div className="flex gap-4">
                    <span>READY</span>
                    {selection[0] && <span>Selection: {selection[0]}:{selection[1]}</span>}
                </div>
            </div>
        </div>
    );
};

export default ExcelChart;
