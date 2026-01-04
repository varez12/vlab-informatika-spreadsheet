import React, { useState, useEffect, useRef } from 'react';
import { Cpu, ArrowRight, FileText, Database, Layers, ArrowDown, Grid } from 'lucide-react';

const PengalamatanMemori = () => {
    // SYSTEM STATE
    const START_SEGMENT = 0x20;
    const ROWS_TO_DISPLAY = 10;
    const COLS_PER_ROW = 16;

    const [memory, setMemory] = useState(Array(ROWS_TO_DISPLAY * COLS_PER_ROW).fill(null));
    const [regSegment, setRegSegment] = useState(START_SEGMENT);
    const [regOffset, setRegOffset] = useState(0);

    // UI STATE
    const [editorText, setEditorText] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    // Initial Setup
    useEffect(() => {
        setMemory(Array(ROWS_TO_DISPLAY * COLS_PER_ROW).fill(null));
    }, []);

    // Helper: Number to Hex
    const toHex = (num, pads = 4) => num.toString(16).toUpperCase().padStart(pads, '0');
    const toBin = (char) => char.charCodeAt(0).toString(2).padStart(8, '0');

    const handleInput = (e) => {
        const val = e.target.value;
        const char = val.slice(-1);
        const inputType = e.nativeEvent.inputType;

        if (inputType === 'insertText' || inputType === 'insertCompositionText') {
            processKeystroke(char);
        }
        setEditorText(val);
    };

    const processKeystroke = (char) => {
        setIsTyping(true);

        const currentRowIndex = regSegment - START_SEGMENT;
        const linearIndex = (currentRowIndex * COLS_PER_ROW) + regOffset;

        if (linearIndex >= memory.length) {
            alert("Memori Penuh! Reset untuk mulai lagi.");
            setIsTyping(false);
            return;
        }

        const newMemory = [...memory];
        newMemory[linearIndex] = toBin(char);
        setMemory(newMemory);

        setTimeout(() => {
            if (regOffset < 15) {
                setRegOffset(prev => prev + 1);
            } else {
                setRegOffset(0);
                setRegSegment(prev => prev + 1);
            }
            setIsTyping(false);
        }, 100);
    };

    const handleReset = () => {
        setMemory(Array(ROWS_TO_DISPLAY * COLS_PER_ROW).fill(null));
        setRegSegment(START_SEGMENT);
        setRegOffset(0);
        setEditorText("");
    };

    return (
        <div className="h-screen bg-slate-900 p-6 md:p-8 pt-28 font-mono text-slate-200 overflow-y-auto">

            {/* Header */}
            <div className="max-w-[1400px] mx-auto mb-8 flex justify-between items-center border-b border-slate-700 pb-6">
                <div>
                    <h1 className="text-3xl font-black text-green-400 tracking-tight mb-2 flex items-center gap-3">
                        <Grid className="animate-pulse" /> SIMULASI MEMORI REAL
                    </h1>
                    <p className="text-slate-400 font-medium">Mode Pengalamatan: Segment:Offset</p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-slate-800 px-4 py-2 rounded border border-slate-600 text-xs">
                        <span className="text-slate-500">FORMAT:</span> <span className="text-blue-400 font-bold">BINARY (8-BIT)</span>
                    </div>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* 1. USER SPACE (EDITOR) */}
                <div className="flex flex-col gap-4">
                    <div className="bg-slate-800 p-1 rounded-xl border border-slate-600 shadow-xl h-full flex flex-col">
                        <div className="bg-slate-900/50 p-3 rounded-t-lg border-b border-slate-700 flex justify-between items-center">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <FileText size={14} /> USER APP
                            </span>
                        </div>
                        <div className="flex-1 relative p-4">
                            <textarea
                                value={editorText}
                                onChange={handleInput}
                                placeholder="Ketik data untuk disimpan ke memori..."
                                className="w-full h-full bg-transparent text-slate-200 font-mono resize-none focus:outline-none placeholder:text-slate-600"
                            />
                            <div className="absolute bottom-2 right-4 text-[10px] text-slate-500 font-mono">
                                LEN: {editorText.length}
                            </div>
                        </div>
                        <div className="p-3 border-t border-slate-700 bg-slate-900/30">
                            <button
                                onClick={handleReset}
                                className="text-[10px] font-bold text-red-400 hover:text-red-300 uppercase tracking-wider"
                            >
                                [ RESET MEMORY ]
                            </button>
                        </div>
                    </div>
                </div>

                {/* 2. SYSTEM SPACE (CPU REGISTERS) */}
                <div className="flex flex-col justify-start gap-4">
                    <div className="bg-slate-800 rounded-xl border border-slate-600 shadow-xl relative overflow-hidden">
                        <div className="bg-gradient-to-r from-orange-900/20 to-slate-800 p-4 border-b border-slate-600 flex justify-between items-center">
                            <div className="flex items-center gap-2 text-orange-400">
                                <Cpu size={20} />
                                <h2 className="text-sm font-bold uppercase tracking-wider">CPU REGISTERS</h2>
                            </div>
                            <div className="text-[10px] bg-black/30 px-2 py-1 rounded text-orange-500/70 font-mono">x86 REAL MODE</div>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Segment Register */}
                            <div className="relative group">
                                <div className="flex justify-between items-end mb-1">
                                    <label className="text-[10px] text-orange-400/80 font-bold uppercase tracking-widest">DS (Data Segment)</label>
                                    <span className="text-[10px] text-slate-500 font-mono">Row Index</span>
                                </div>
                                <div className="bg-black p-3 rounded border-l-4 border-orange-500 font-mono text-xl text-white flex justify-between items-center shadow-inner">
                                    <span>{toHex(regSegment)}</span>
                                    <span className="text-[10px] text-slate-600">HEX</span>
                                </div>
                            </div>

                            {/* Offset Register */}
                            <div className="relative group">
                                <div className="flex justify-between items-end mb-1">
                                    <label className="text-[10px] text-green-400/80 font-bold uppercase tracking-widest">BX (Base Offset)</label>
                                    <span className="text-[10px] text-slate-500 font-mono">Col Index</span>
                                </div>
                                <div className={`bg-black p-3 rounded border-l-4 border-green-500 font-mono text-2xl text-green-400 flex justify-between items-center shadow-inner transition-all ${isTyping ? 'bg-green-900/20' : ''}`}>
                                    <span>{toHex(regOffset)}</span>
                                    <span className="text-[10px] text-slate-600">HEX</span>
                                </div>
                                <div className="absolute -right-2 top-8">
                                    {isTyping && <span className="text-xs font-bold text-green-400 animate-ping">+1</span>}
                                </div>
                            </div>
                        </div>

                        <div className="text-center">
                            <span className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1">Physical Address Calculation</span>
                            <div className="font-mono text-sm text-slate-300 flex items-center justify-center gap-2">
                                <span className="text-orange-400">{toHex(regSegment)}</span>
                                <span>+</span>
                                <span className="text-green-400">{toHex(regOffset)}</span>
                                <span>=</span>
                                <span className="text-white font-bold border-b-2 border-white">{toHex(regSegment + regOffset)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 text-[10px] text-slate-400 space-y-2">
                        <p><span className="text-orange-400 font-bold">SEGMENT</span> menentukan Baris (Baris memori).</p>
                        <p><span className="text-green-400 font-bold">OFFSET</span> menentukan Kolom (0-F).</p>
                        <p>Jika kolom penuh (F), otomatis pindah ke baris berikutnya.</p>
                    </div>
                </div>

                {/* 3. PHYSICAL MEMORY (RAM MATRIX) */}
                <div className="flex flex-col gap-4">
                    <div className="bg-slate-800 rounded-xl border border-slate-600 shadow-xl flex flex-col h-full relative overflow-hidden">
                        <div className="bg-slate-900 p-3 border-b border-slate-700 flex justify-between items-center">
                            <div className="flex items-center gap-2 text-slate-400">
                                <Layers size={18} />
                                <h2 className="text-sm font-bold uppercase tracking-wider">RAM MATRIX</h2>
                            </div>
                            <span className="text-[10px] font-mono text-slate-600">2D VIEW</span>
                        </div>

                        <div className="flex-1 overflow-auto bg-black/40 p-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr>
                                        <th className="p-1 px-2 text-left text-[9px] text-slate-600 font-mono border-b border-slate-700 sticky left-0 bg-slate-900 z-20">ADDR</th>
                                        {Array.from({ length: 16 }).map((_, i) => (
                                            <th key={i} className="p-1 text-center text-[9px] text-green-500/50 font-mono border-b border-slate-700 min-w-[30px]">
                                                {i.toString(16).toUpperCase()}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {Array.from({ length: ROWS_TO_DISPLAY }).map((_, rowIndex) => {
                                        const segmentVal = START_SEGMENT + rowIndex;
                                        const isCurrentRow = segmentVal === regSegment;

                                        return (
                                            <tr key={rowIndex} className={`hover:bg-white/5 ${isCurrentRow ? 'bg-orange-500/5' : ''}`}>
                                                {/* Segment Header */}
                                                <td className="p-1 px-2 text-left font-mono text-[10px] border-r border-slate-700/50 text-orange-500/80 font-bold sticky left-0 bg-slate-900/95 z-10">
                                                    {toHex(segmentVal)}:
                                                </td>

                                                {/* Binary Cells */}
                                                {Array.from({ length: 16 }).map((_, colIndex) => {
                                                    const linearIdx = (rowIndex * 16) + colIndex;
                                                    const cellData = memory[linearIdx];
                                                    const isActive = isCurrentRow && colIndex === regOffset;

                                                    return (
                                                        <td key={colIndex} className="p-0.5 relative">
                                                            <div className={`
                                                                h-6 w-full min-w-[45px] text-[8px] font-mono flex items-center justify-center rounded transition-all duration-100
                                                                ${isActive
                                                                    ? 'bg-blue-600 text-white shadow-lg scale-110 z-10 font-bold border border-blue-400'
                                                                    : cellData
                                                                        ? 'bg-slate-700 text-blue-200 border border-slate-600'
                                                                        : 'bg-transparent text-slate-800 border border-slate-800/50'}
                                                            `}>
                                                                {cellData || "........"}
                                                            </div>
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        <div className="bg-slate-900/80 p-2 text-[10px] text-center text-slate-500 border-t border-slate-700 backdrop-blur">
                            Gunakan Scroll Horizontal untuk melihat kolom F
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default PengalamatanMemori;
