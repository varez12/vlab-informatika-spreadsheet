import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
    Grid, HelpCircle, BookOpen, Play, Pause, Lightbulb, ChevronDown,
    Type, CaseSensitive, FileText, ArrowUpCircle, ArrowDownCircle, Sparkles, AlertCircle
} from 'lucide-react';

// ============================================================
// MODUL: FORMULA TEKS (UPPER, LOWER, PROPER, TEXT)
// Versi Real - Input Sintaks Formula Sebenarnya
// ============================================================

const FormulaInput = ({ value, onChange, placeholder, isValid, errorMessage }) => (
    <div className="relative">
        <div className="flex items-center bg-slate-900 rounded-xl overflow-hidden border-2 border-slate-700 focus-within:border-purple-500 transition-all">
            <span className="text-purple-400 font-bold text-lg px-3 font-serif italic">fx</span>
            <input
                type="text"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="flex-1 bg-transparent text-white font-mono text-sm py-3 pr-4 outline-none placeholder:text-slate-500"
            />
        </div>
        {!isValid && errorMessage && (
            <div className="flex items-center gap-2 mt-2 text-red-400 text-xs">
                <AlertCircle size={12} />
                <span>{errorMessage}</span>
            </div>
        )}
    </div>
);

const TextFormulaLab = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get('tab');

    const [activeTab, setActiveTab] = useState(tabParam || 'UPPER');

    useEffect(() => {
        if (tabParam) {
            setActiveTab(tabParam);
        }
    }, [tabParam]);

    // Animation State
    const [isAnimating, setIsAnimating] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [animationSteps, setAnimationSteps] = useState([]);
    const [playbackSpeed, setPlaybackSpeed] = useState(500);

    const [highlightedCells, setHighlightedCells] = useState([]);
    const [result, setResult] = useState(null);
    const [tempResult, setTempResult] = useState(null);
    const [formulaError, setFormulaError] = useState('');

    // Sample Data - Daftar Karyawan
    const employeeData = [
        ['No', 'Nama Lengkap', 'Jabatan', 'Gaji', 'Tgl Masuk'],
        ['1', 'budi santoso', 'staff IT', '5000000', '45292'],
        ['2', 'DEWI LESTARI', 'manager HR', '8500000', '44562'],
        ['3', 'andi WIJAYA pratama', 'supervisor', '6500000', '45000'],
        ['4', 'siti NURhayati', 'admin keuangan', '4500000', '44927'],
        ['5', 'rahmat hidayat', 'kepala divisi', '9000000', '44197']
    ];

    // Formula input state
    const [formulaInput, setFormulaInput] = useState('=UPPER(B2)');

    // Update formula when tab changes
    useEffect(() => {
        const defaultFormulas = {
            'UPPER': '=UPPER(B2)',
            'LOWER': '=LOWER(B2)',
            'PROPER': '=PROPER(B2)',
            'TEXT': '=TEXT(D2;"Rp #.##0")'
        };
        setFormulaInput(defaultFormulas[activeTab] || '=UPPER(B2)');
        setFormulaError('');
    }, [activeTab]);

    // Parse cell reference like "B2"
    const parseCell = (cellRef) => {
        const colMap = { 'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4 };
        const match = cellRef.trim().match(/^([A-E])(\d+)$/i);
        if (!match) return null;

        const [_, col, row] = match;
        const colIdx = colMap[col.toUpperCase()];
        const rowIdx = parseInt(row) - 1;

        if (rowIdx >= 0 && rowIdx <= 5 && employeeData[rowIdx]) {
            return {
                row: rowIdx,
                col: colIdx,
                value: employeeData[rowIdx][colIdx],
                ref: `${col.toUpperCase()}${row}`
            };
        }
        return null;
    };

    // Parse the formula input
    const parseFormula = () => {
        const formula = formulaInput.trim();

        if (activeTab === 'TEXT') {
            // Match TEXT formula: =TEXT(cell;"format")
            const match = formula.match(/^=TEXT\(([A-E]\d+)\s*;\s*"([^"]+)"\)$/i);
            if (!match) {
                return { valid: false, error: 'Format: =TEXT(sel;"format"). Contoh: =TEXT(D2;"Rp #.##0")' };
            }

            const [_, cellRef, format] = match;
            const cell = parseCell(cellRef);
            if (!cell) {
                return { valid: false, error: `Sel ${cellRef} tidak valid. Gunakan range A1-E6.` };
            }

            return { valid: true, funcName: 'TEXT', cell, format };
        } else {
            // Match UPPER/LOWER/PROPER formula: =FUNCTION(cell)
            const match = formula.match(/^=(\w+)\(([A-E]\d+)\)$/i);
            if (!match) {
                return { valid: false, error: `Format: =${activeTab}(sel). Contoh: =${activeTab}(B2)` };
            }

            const [_, funcName, cellRef] = match;

            if (funcName.toUpperCase() !== activeTab) {
                return { valid: false, error: `Gunakan fungsi ${activeTab} untuk tab ini` };
            }

            const cell = parseCell(cellRef);
            if (!cell) {
                return { valid: false, error: `Sel ${cellRef} tidak valid. Gunakan range A1-E6.` };
            }

            return { valid: true, funcName: funcName.toUpperCase(), cell };
        }
    };

    // --- ENGINE SIMULASI ---
    const generateSteps = () => {
        let steps = [];
        let finalRes = "";

        const parsed = parseFormula();
        if (!parsed.valid) {
            setFormulaError(parsed.error);
            return { steps: [], finalRes: '#ERROR!' };
        }

        setFormulaError('');
        const { cell, format } = parsed;
        const text = cell.value;

        try {
            if (activeTab === 'UPPER') {
                steps.push({
                    desc: `Membaca formula: ${formulaInput}`,
                    highlight: [],
                    res: '...'
                });

                steps.push({
                    desc: `Mengambil teks dari sel ${cell.ref}: "${text}"`,
                    highlight: [`r${cell.row}-c${cell.col}`],
                    res: text
                });

                // Show character conversion
                let converted = "";
                const chars = text.split('');
                for (let i = 0; i < Math.min(chars.length, 6); i++) {
                    const char = chars[i];
                    const upper = char.toUpperCase();
                    converted += upper;
                    if (char !== upper) {
                        steps.push({
                            desc: `Karakter "${char}" → "${upper}"`,
                            highlight: [`r${cell.row}-c${cell.col}`],
                            res: converted + (i < chars.length - 1 ? '...' : '')
                        });
                    }
                }

                if (chars.length > 6) {
                    steps.push({
                        desc: `Memproses ${chars.length - 6} karakter lainnya...`,
                        highlight: [`r${cell.row}-c${cell.col}`],
                        res: text.toUpperCase()
                    });
                }

                finalRes = text.toUpperCase();
                steps.push({
                    desc: `Hasil UPPER: Semua huruf menjadi KAPITAL`,
                    highlight: [`r${cell.row}-c${cell.col}`],
                    res: finalRes
                });
            }
            else if (activeTab === 'LOWER') {
                steps.push({
                    desc: `Membaca formula: ${formulaInput}`,
                    highlight: [],
                    res: '...'
                });

                steps.push({
                    desc: `Mengambil teks dari sel ${cell.ref}: "${text}"`,
                    highlight: [`r${cell.row}-c${cell.col}`],
                    res: text
                });

                let converted = "";
                const chars = text.split('');
                for (let i = 0; i < Math.min(chars.length, 6); i++) {
                    const char = chars[i];
                    const lower = char.toLowerCase();
                    converted += lower;
                    if (char !== lower) {
                        steps.push({
                            desc: `Karakter "${char}" → "${lower}"`,
                            highlight: [`r${cell.row}-c${cell.col}`],
                            res: converted + (i < chars.length - 1 ? '...' : '')
                        });
                    }
                }

                if (chars.length > 6) {
                    steps.push({
                        desc: `Memproses ${chars.length - 6} karakter lainnya...`,
                        highlight: [`r${cell.row}-c${cell.col}`],
                        res: text.toLowerCase()
                    });
                }

                finalRes = text.toLowerCase();
                steps.push({
                    desc: `Hasil LOWER: Semua huruf menjadi kecil`,
                    highlight: [`r${cell.row}-c${cell.col}`],
                    res: finalRes
                });
            }
            else if (activeTab === 'PROPER') {
                steps.push({
                    desc: `Membaca formula: ${formulaInput}`,
                    highlight: [],
                    res: '...'
                });

                steps.push({
                    desc: `Mengambil teks dari sel ${cell.ref}: "${text}"`,
                    highlight: [`r${cell.row}-c${cell.col}`],
                    res: text
                });

                const words = text.split(' ');
                let properResult = [];

                words.forEach((word, i) => {
                    const properWord = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
                    properResult.push(properWord);
                    steps.push({
                        desc: `Kata "${word}" → "${properWord}"`,
                        highlight: [`r${cell.row}-c${cell.col}`],
                        res: properResult.join(' ')
                    });
                });

                finalRes = properResult.join(' ');
                steps.push({
                    desc: `Hasil PROPER: Setiap kata diawali huruf kapital`,
                    highlight: [`r${cell.row}-c${cell.col}`],
                    res: finalRes
                });
            }
            else if (activeTab === 'TEXT') {
                const value = parseFloat(text);

                steps.push({
                    desc: `Membaca formula: ${formulaInput}`,
                    highlight: [],
                    res: '...'
                });

                steps.push({
                    desc: `Mengambil nilai dari sel ${cell.ref}: ${value}`,
                    highlight: [`r${cell.row}-c${cell.col}`],
                    res: value
                });

                steps.push({
                    desc: `Format yang digunakan: "${format}"`,
                    highlight: [`r${cell.row}-c${cell.col}`],
                    res: '...'
                });

                // Process format
                let formatted = "";
                const formatLower = format.toLowerCase();

                if (formatLower.includes('rp') || formatLower.includes('#')) {
                    // Currency/Number format
                    const prefix = format.match(/^[^#0]*/)?.[0] || '';
                    formatted = prefix + value.toLocaleString('id-ID');
                    steps.push({
                        desc: `Menerapkan format angka dengan pemisah ribuan`,
                        highlight: [`r${cell.row}-c${cell.col}`],
                        res: formatted
                    });
                }
                else if (formatLower.includes('dd') || formatLower.includes('mm') || formatLower.includes('yyyy')) {
                    // Date format - convert Excel serial to date
                    const excelDate = new Date((value - 25569) * 86400 * 1000);
                    const day = excelDate.getDate().toString().padStart(2, '0');
                    const month = (excelDate.getMonth() + 1).toString().padStart(2, '0');
                    const year = excelDate.getFullYear();
                    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
                    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

                    if (formatLower === 'dd-mm-yyyy') {
                        formatted = `${day}-${month}-${year}`;
                    } else if (formatLower === 'mmmm yyyy') {
                        formatted = `${months[excelDate.getMonth()]} ${year}`;
                    } else if (formatLower === 'dddd') {
                        formatted = days[excelDate.getDay()];
                    } else {
                        formatted = `${day}/${month}/${year}`;
                    }
                    steps.push({
                        desc: `Mengkonversi nomor seri ${value} ke format tanggal`,
                        highlight: [`r${cell.row}-c${cell.col}`],
                        res: formatted
                    });
                }
                else if (formatLower.includes('%')) {
                    formatted = (value * 100).toFixed(0) + '%';
                    steps.push({
                        desc: `Menerapkan format persentase`,
                        highlight: [`r${cell.row}-c${cell.col}`],
                        res: formatted
                    });
                }
                else {
                    formatted = value.toString();
                }

                finalRes = formatted;
                steps.push({
                    desc: `Hasil TEXT: Angka diformat menjadi teks`,
                    highlight: [`r${cell.row}-c${cell.col}`],
                    res: finalRes
                });
            }
        } catch (e) {
            finalRes = "#ERROR!";
            console.error(e);
        }

        return { steps, finalRes };
    };

    const startAnimation = () => {
        const { steps, finalRes } = generateSteps();
        if (steps.length === 0) return;

        setAnimationSteps(steps);
        setResult(finalRes);
        setTempResult("...");
        setCurrentStep(0);
        setIsAnimating(true);
    };

    // Calculate result on formula change
    useEffect(() => {
        if (!isAnimating) {
            const parsed = parseFormula();
            if (parsed.valid) {
                const { cell, format } = parsed;
                setHighlightedCells([`r${cell.row}-c${cell.col}`]);

                let res;
                const text = cell.value;

                switch (activeTab) {
                    case 'UPPER':
                        res = text.toUpperCase();
                        break;
                    case 'LOWER':
                        res = text.toLowerCase();
                        break;
                    case 'PROPER':
                        res = text.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
                        break;
                    case 'TEXT':
                        const value = parseFloat(text);
                        const formatLower = format?.toLowerCase() || '';
                        if (formatLower.includes('rp') || formatLower.includes('#')) {
                            const prefix = format.match(/^[^#0]*/)?.[0] || '';
                            res = prefix + value.toLocaleString('id-ID');
                        } else if (formatLower.includes('dd') || formatLower.includes('mm') || formatLower.includes('yyyy')) {
                            const excelDate = new Date((value - 25569) * 86400 * 1000);
                            const day = excelDate.getDate().toString().padStart(2, '0');
                            const month = (excelDate.getMonth() + 1).toString().padStart(2, '0');
                            const year = excelDate.getFullYear();
                            const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
                            const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

                            if (formatLower === 'dd-mm-yyyy') {
                                res = `${day}-${month}-${year}`;
                            } else if (formatLower === 'mmmm yyyy') {
                                res = `${months[excelDate.getMonth()]} ${year}`;
                            } else if (formatLower === 'dddd') {
                                res = days[excelDate.getDay()];
                            } else {
                                res = `${day}/${month}/${year}`;
                            }
                        } else if (formatLower.includes('%')) {
                            res = (value * 100).toFixed(0) + '%';
                        } else {
                            res = value.toLocaleString('id-ID');
                        }
                        break;
                    default:
                        res = text;
                }
                setResult(res);
                setFormulaError('');
            } else {
                setHighlightedCells([]);
                setResult('#ERROR!');
                setFormulaError(parsed.error);
            }
        }
    }, [formulaInput, activeTab]);

    useEffect(() => {
        let timer;
        if (isAnimating) {
            if (currentStep < animationSteps.length) {
                timer = setTimeout(() => {
                    const stepData = animationSteps[currentStep];
                    setHighlightedCells(stepData.highlight);
                    setTempResult(stepData.res);
                    setCurrentStep(prev => prev + 1);
                }, playbackSpeed);
            } else {
                setIsAnimating(false);
            }
        }
        return () => clearTimeout(timer);
    }, [isAnimating, currentStep, animationSteps, playbackSpeed]);

    const tabs = ['UPPER', 'LOWER', 'PROPER', 'TEXT'];

    const getFormulaInfo = () => {
        switch (activeTab) {
            case 'UPPER': return {
                title: "UPPER - Huruf Kapital",
                desc: "Mengubah semua huruf dalam teks menjadi huruf KAPITAL.",
                syntax: "=UPPER(text)",
                example: "=UPPER(B2) atau =UPPER(C3)",
                icon: <ArrowUpCircle className="w-5 h-5" />,
                challenge: "Ketik =UPPER(C2) untuk mengubah jabatan menjadi kapital. Coba juga =UPPER(B3) untuk nama lain."
            };
            case 'LOWER': return {
                title: "LOWER - Huruf Kecil",
                desc: "Mengubah semua huruf dalam teks menjadi huruf kecil.",
                syntax: "=LOWER(text)",
                example: "=LOWER(B2) atau =LOWER(B3)",
                icon: <ArrowDownCircle className="w-5 h-5" />,
                challenge: "Coba =LOWER(B3) untuk mengubah 'DEWI LESTARI' menjadi huruf kecil semua."
            };
            case 'PROPER': return {
                title: "PROPER - Huruf Judul",
                desc: "Mengubah huruf pertama setiap kata menjadi kapital.",
                syntax: "=PROPER(text)",
                example: "=PROPER(B2) atau =PROPER(C4)",
                icon: <Sparkles className="w-5 h-5" />,
                challenge: "Ketik =PROPER(B4) untuk merapikan 'andi WIJAYA pratama' menjadi format nama yang benar."
            };
            case 'TEXT': return {
                title: "TEXT - Format Angka",
                desc: "Mengubah angka menjadi teks dengan format tertentu.",
                syntax: '=TEXT(value;"format_text")',
                example: '=TEXT(D2;"Rp #.##0") atau =TEXT(E2;"dd-mm-yyyy")',
                icon: <FileText className="w-5 h-5" />,
                challenge: 'Coba =TEXT(E2;"dd-mm-yyyy") untuk mengubah nomor seri tanggal. Atau =TEXT(D3;"Rp #.##0") untuk format gaji.'
            };
            default: return {
                title: activeTab,
                desc: "Fungsi teks spreadsheet.",
                syntax: "=FORMULA()",
                example: "",
                icon: <Type className="w-5 h-5" />,
                challenge: ""
            };
        }
    };

    const formatExamples = [
        { format: 'Rp #.##0', desc: 'Format mata uang Indonesia', example: 'Rp 5.000.000' },
        { format: '#.##0', desc: 'Format angka dengan pemisah ribuan', example: '5.000.000' },
        { format: 'dd-mm-yyyy', desc: 'Format tanggal standar', example: '15-01-2024' },
        { format: 'mmmm yyyy', desc: 'Format bulan dan tahun', example: 'Januari 2024' },
        { format: 'dddd', desc: 'Format nama hari', example: 'Senin' },
        { format: '0%', desc: 'Format persentase', example: '50%' }
    ];

    return (
        <div className="flex flex-col h-full w-full bg-slate-50 font-sans text-slate-800 p-4 md:p-8 overflow-y-auto text-left custom-scrollbar">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">

                {/* LEFT COLUMN: VISUALIZATION */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-purple-600 text-white p-6 rounded-2xl shadow-md border-b-4 border-purple-700">
                        <h2 className="flex items-center gap-2 font-bold text-lg mb-2">
                            <span className="text-purple-200">{getFormulaInfo().icon}</span>
                            {getFormulaInfo().title}
                        </h2>
                        <p className="text-sm opacity-90 mb-4 leading-relaxed">{getFormulaInfo().desc}</p>
                        <div className="space-y-2">
                            <div className="bg-purple-800/40 p-3 rounded-xl font-mono text-xs border border-white/10 tracking-wider">
                                <span className="text-purple-300">Sintaks:</span> {getFormulaInfo().syntax}
                            </div>
                            <div className="bg-purple-800/40 p-3 rounded-xl font-mono text-xs border border-white/10 tracking-wider">
                                <span className="text-purple-300">Contoh:</span> {getFormulaInfo().example}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative">
                        {isAnimating && (
                            <div className="absolute top-4 right-4 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold animate-pulse flex items-center gap-2 z-10">
                                <Play size={10} className="fill-current" /> Simulasi Berjalan...
                            </div>
                        )}

                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <Grid size={14} /> Data Karyawan
                            </h2>
                            <div className="text-[10px] text-slate-400 font-mono">
                                Range: A1:E6
                            </div>
                        </div>

                        <div className="overflow-x-auto rounded-lg border border-slate-200 mb-6 shadow-sm">
                            <table className="w-full border-collapse text-sm text-center">
                                <thead>
                                    <tr className="bg-slate-100 text-slate-500">
                                        <th className="border border-slate-200 p-1 w-10 text-[10px] bg-slate-50 font-bold"></th>
                                        {['A', 'B', 'C', 'D', 'E'].map(l => (
                                            <th key={l} className="border border-slate-200 p-1 font-bold">{l}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {employeeData.map((row, rIdx) => (
                                        <tr key={rIdx}>
                                            <td className={`border border-slate-200 p-1 text-[10px] bg-slate-50 font-bold ${rIdx === 0 ? 'text-slate-800' : 'text-slate-400'}`}>{rIdx + 1}</td>
                                            {row.map((cell, cIdx) => (
                                                <td
                                                    key={cIdx}
                                                    className={`border border-slate-200 p-2 transition-all duration-300 text-xs ${highlightedCells.includes(`r${rIdx}-c${cIdx}`)
                                                            ? 'bg-yellow-100 border-yellow-500 font-bold text-yellow-900 ring-2 ring-yellow-400 ring-inset scale-95 rounded'
                                                            : rIdx === 0
                                                                ? 'bg-slate-100 font-bold text-slate-700'
                                                                : 'bg-white'
                                                        }`}
                                                >
                                                    {cIdx === 3 && rIdx > 0
                                                        ? parseInt(cell).toLocaleString('id-ID')
                                                        : cIdx === 4 && rIdx > 0
                                                            ? cell
                                                            : cell
                                                    }
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Cell Reference Guide */}
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-[10px] text-slate-500">
                            <span className="font-bold">Referensi:</span>{' '}
                            A = No | B = Nama | C = Jabatan | D = Gaji | E = Tgl Masuk (serial)
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md border-t-4 border-purple-500 overflow-hidden text-center relative transition-all">
                        {isAnimating && (
                            <div className="h-1 bg-slate-100 w-full absolute top-0 left-0">
                                <div className="h-full bg-purple-500 transition-all duration-300 ease-linear" style={{ width: `${((currentStep) / animationSteps.length) * 100}%` }}></div>
                            </div>
                        )}

                        <div className="p-8 bg-purple-50/20 flex flex-col items-center justify-center min-h-[140px]">
                            {isAnimating ? (
                                <div className="space-y-2 animate-in fade-in zoom-in duration-300">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Proses Kalkulasi</span>
                                    <div className="text-lg font-medium text-slate-600">
                                        {animationSteps[currentStep]?.desc || "Memulai..."}
                                    </div>
                                    <div className="text-sm font-mono text-slate-400 mt-2">
                                        Hasil: {tempResult}
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <span className="text-[10px] font-bold text-purple-700 uppercase tracking-widest block mb-2">Hasil Formula</span>
                                    <div className={`text-3xl md:text-4xl font-mono font-black drop-shadow-sm break-all px-4 ${result === '#ERROR!' ? 'text-red-500' : 'text-slate-900'}`}>{result}</div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: CONTROLS */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm sticky top-4 overflow-y-auto max-h-[85vh] custom-scrollbar text-left flex flex-col h-full">
                        <div className="flex flex-col gap-3 mb-6">
                            <span className="text-[10px] font-bold text-slate-300 uppercase mb-2 block tracking-widest">Pilih Fungsi</span>
                            <div className="flex gap-1.5 flex-wrap">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        disabled={isAnimating}
                                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all border ${activeTab === tab
                                                ? 'bg-purple-600 border-purple-700 text-white shadow-md scale-105'
                                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50'
                                            }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest mb-3 block">
                                Ketik Formula
                            </label>
                            <FormulaInput
                                value={formulaInput}
                                onChange={(e) => setFormulaInput(e.target.value)}
                                placeholder={activeTab === 'TEXT' ? '=TEXT(D2;"Rp #.##0")' : `=${activeTab}(B2)`}
                                isValid={!formulaError}
                                errorMessage={formulaError}
                            />
                            <p className="text-[10px] text-slate-400 mt-2 italic">
                                {activeTab === 'TEXT'
                                    ? 'Format: =TEXT(sel;"format"). Gunakan tanda kutip untuk format.'
                                    : `Format: =${activeTab}(sel). Contoh: =${activeTab}(B2)`
                                }
                            </p>
                        </div>

                        <button
                            onClick={startAnimation}
                            disabled={isAnimating || !!formulaError}
                            className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-all mb-6 ${isAnimating || formulaError
                                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                    : 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg hover:shadow-purple-500/30'
                                }`}
                        >
                            {isAnimating ? <Pause size={16} /> : <Play size={16} />}
                            {isAnimating ? 'Menjalankan...' : 'Jalankan Simulasi'}
                        </button>

                        {/* Formula Preview */}
                        <div className="bg-slate-900 p-4 rounded-xl mb-6">
                            <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-2">Formula Bar</div>
                            <div className="font-mono text-lg text-white break-all">{formulaInput}</div>
                        </div>

                        {/* TEXT Format Examples */}
                        {activeTab === 'TEXT' && (
                            <div className="bg-gradient-to-br from-violet-50 to-purple-50 p-4 rounded-xl border border-purple-200 mb-6">
                                <h4 className="text-purple-800 text-[10px] font-bold mb-3 uppercase tracking-wider flex items-center gap-2">
                                    <CaseSensitive size={14} /> Format yang Tersedia
                                </h4>
                                <div className="space-y-2 text-[10px]">
                                    {formatExamples.map((fmt, i) => (
                                        <div key={i} className="flex items-start gap-2 bg-white p-2 rounded-lg border border-purple-100">
                                            <code className="font-mono text-purple-700 font-bold whitespace-nowrap">"{fmt.format}"</code>
                                            <span className="text-slate-500">→ {fmt.example}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* BOX TANTANGAN PRAKTIKUM */}
                        <div className="bg-yellow-50 p-5 rounded-xl border border-yellow-200 shadow-sm mb-6">
                            <h4 className="text-yellow-800 text-[11px] font-bold mb-2 flex items-center gap-2 uppercase tracking-wider">
                                <Lightbulb size={16} className="text-yellow-600" /> Tantangan Praktikum
                            </h4>
                            <p className="text-[11px] text-yellow-700 leading-relaxed font-medium">
                                {getFormulaInfo().challenge}
                            </p>
                        </div>

                        {/* Info Rumus */}
                        <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
                            <h4 className="text-purple-800 text-[10px] font-bold mb-2 uppercase tracking-wider flex items-center gap-2">
                                <BookOpen size={14} /> Cara Menulis Formula
                            </h4>
                            <ul className="text-[10px] text-purple-700 space-y-1.5 list-disc list-inside">
                                <li>Selalu awali dengan tanda <code className="bg-purple-100 px-1 rounded">=</code></li>
                                <li>Tulis nama fungsi: <code className="bg-purple-100 px-1 rounded">{activeTab}</code></li>
                                {activeTab === 'TEXT' ? (
                                    <>
                                        <li>Buka kurung, tulis sel dan format: <code className="bg-purple-100 px-1 rounded">(D2;"format")</code></li>
                                        <li>Gunakan tanda kutip untuk format text</li>
                                    </>
                                ) : (
                                    <li>Buka kurung dan tulis referensi sel: <code className="bg-purple-100 px-1 rounded">(B2)</code></li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TextFormulaLab;
