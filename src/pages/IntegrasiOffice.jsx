import React, { useState, useEffect } from 'react';
import { Scissors, Copy, Clipboard, FileText, Grid, ArrowRight, Trash2, CheckCircle2, AlertCircle, X, MousePointer2 } from 'lucide-react';

const IntegrasiOffice = () => {
    // State for Applications
    const [wordSelection, setWordSelection] = useState(null);
    const [excelSelection, setExcelSelection] = useState(null);

    // Clipboard Buffer State
    const [clipboard, setClipboard] = useState({ content: null, type: null, source: null });

    // Context Menu State
    const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, type: null, targetId: null });

    // Word Document State (Simulated Paragraphs)
    const [wordContent, setWordContent] = useState([
        { id: 1, text: "Laporan Penjualan Bulan Januari" },
        { id: 2, text: "Berikut adalah data penjualan produk unggulan kami:" },
        { id: 3, text: "Nasi Goreng Spesial - Rp 25.000" },
        { id: 4, text: "Es Teh Manis - Rp 5.000" }
    ]);

    // Excel Spreadsheet State (Grid A1:C4)
    const [excelContent, setExcelContent] = useState(
        Array(4).fill().map(() => Array(3).fill(""))
    );

    // Close context menu on global click
    useEffect(() => {
        const handleClick = () => {
            if (contextMenu.visible) setContextMenu({ ...contextMenu, visible: false });
        };
        window.addEventListener('click', handleClick);
        return () => window.removeEventListener('click', handleClick);
    }, [contextMenu]);

    // Handle Context Menu (Right Click)
    const handleContextMenu = (e, type, id) => {
        e.preventDefault(); // Prevent browser default menu

        // Auto-select item being clicked
        if (type === 'word') setWordSelection(id);
        if (type === 'excel') setExcelSelection(id);

        // Show menu at mouse position
        setContextMenu({
            visible: true,
            x: e.pageX,
            y: e.pageY,
            type,
            targetId: id
        });
    };

    // Actions
    const handleCopy = () => {
        if (wordSelection) {
            const item = wordContent.find(w => w.id === wordSelection);
            setClipboard({ content: item.text, type: 'text', source: 'word' });
        }
    };

    const handleCut = () => {
        if (wordSelection) {
            const item = wordContent.find(w => w.id === wordSelection);
            setClipboard({ content: item.text, type: 'text', source: 'word' });
            // Simulate Cut: Remove from source immediately
            setWordContent(prev => prev.filter(w => w.id !== wordSelection));
            setWordSelection(null);
        }
    };

    // Standard Paste: Everything in one cell
    const handlePaste = () => {
        if (clipboard.content && excelSelection) {
            const [r, c] = excelSelection;
            const newGrid = [...excelContent];
            newGrid[r] = [...newGrid[r]];
            newGrid[r][c] = clipboard.content;
            setExcelContent(newGrid);
            setContextMenu(prev => ({ ...prev, visible: false }));
        }
    };

    // Paste Special: Text to Columns
    const handlePasteSpecial = () => {
        if (clipboard.content && excelSelection) {
            const [r, c] = excelSelection;
            const newGrid = [...excelContent];
            newGrid[r] = [...newGrid[r]];

            if (clipboard.content.includes(" - ")) {
                const parts = clipboard.content.split(" - ");
                newGrid[r][c] = parts[0];
                if (c + 1 < newGrid[r].length) newGrid[r][c + 1] = parts[1];
            } else {
                newGrid[r][c] = clipboard.content;
            }

            setExcelContent(newGrid);
            setContextMenu(prev => ({ ...prev, visible: false }));
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-50 font-sans text-slate-800 overflow-hidden relative">

            {/* CUSTOM CONTEXT MENU */}
            {contextMenu.visible && (
                <div
                    className="absolute z-50 bg-white border border-slate-200 rounded-lg shadow-xl py-1 min-w-[200px] animate-in fade-in zoom-in-95 duration-100 origin-top-left"
                    style={{ top: contextMenu.y, left: contextMenu.x }}
                    onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside menu content
                >
                    <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-slate-400 tracking-wider border-b border-slate-100 mb-1">
                        {contextMenu.type === 'word' ? 'Word Options' : 'Excel Options'}
                    </div>
                    {contextMenu.type === 'word' && (
                        <>
                            <button
                                onClick={() => { handleCut(); setContextMenu(prev => ({ ...prev, visible: false })); }}
                                className="w-full text-left px-4 py-2 text-sm flex items-center gap-3 hover:bg-slate-50 text-slate-700"
                            >
                                <Scissors size={14} className="text-red-500" /> Cut
                            </button>
                            <button
                                onClick={() => { handleCopy(); setContextMenu(prev => ({ ...prev, visible: false })); }}
                                className="w-full text-left px-4 py-2 text-sm flex items-center gap-3 hover:bg-slate-50 text-slate-700"
                            >
                                <Copy size={14} className="text-blue-500" /> Copy
                            </button>
                        </>
                    )}
                    {contextMenu.type === 'excel' && (
                        <>
                            <button
                                onClick={() => { handlePaste(); setContextMenu(prev => ({ ...prev, visible: false })); }}
                                disabled={!clipboard.content}
                                className={`w-full text-left px-4 py-2 text-sm flex items-center gap-3 ${!clipboard.content ? 'text-slate-300 cursor-not-allowed' : 'hover:bg-slate-50 text-slate-700'}`}
                            >
                                <Clipboard size={14} className={clipboard.content ? "text-green-600" : "text-slate-300"} /> Paste
                            </button>
                            <button
                                onClick={() => { handlePasteSpecial(); setContextMenu(prev => ({ ...prev, visible: false })); }}
                                disabled={!clipboard.content}
                                className={`w-full text-left px-4 py-2 text-sm flex items-center gap-3 border-t border-slate-100 ${!clipboard.content ? 'text-slate-300 cursor-not-allowed' : 'hover:bg-slate-50 text-slate-700'}`}
                            >
                                <FileText size={14} className={clipboard.content ? "text-purple-600" : "text-slate-300"} /> Paste Special (Split)
                            </button>
                        </>
                    )}
                </div>
            )}

            {/* HEADER */}
            <div className="bg-white border-b border-slate-200 p-4 flex items-center justify-between shadow-sm z-10">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-600 p-2 rounded-lg text-white">
                        <Grid size={20} />
                    </div>
                    <div>
                        <h1 className="font-bold text-lg text-slate-800">Integrasi Aplikasi Perkantoran</h1>
                        <p className="text-xs text-slate-500">Simulasi Cut, Copy, Paste antar Dokumen</p>
                    </div>
                </div>

                {/* Info Hint */}
                <div className="flex items-center gap-2 text-xs bg-yellow-50 text-yellow-800 px-4 py-2 rounded-full border border-yellow-200 font-bold shadow-sm animate-pulse">
                    <MousePointer2 size={16} /> Tips: Klik Kanan pada dokumen untuk menu aksi!
                </div>
            </div>

            {/* MAIN WORKSPACE */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 p-6 overflow-hidden">

                {/* LEFT: WORD PROCESSOR */}
                <div className="flex flex-col h-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden ring-4 ring-transparent hover:ring-blue-50 transition-all">
                    <div className="bg-blue-50/50 p-3 border-b border-blue-100 flex items-center justify-between">
                        <span className="text-xs font-bold text-blue-700 flex items-center gap-2 uppercase tracking-wide">
                            <FileText size={14} /> Dokumen Word (Sumber)
                        </span>
                    </div>
                    <div
                        className="p-8 space-y-4 font-serif text-slate-700 leading-relaxed overflow-y-auto flex-1 cursor-default select-none"
                        onContextMenu={(e) => e.preventDefault()} // Block default context menu on container
                    >
                        {wordContent.length === 0 && (
                            <div className="text-center text-slate-400 italic text-sm py-10">Dokumen Kosong</div>
                        )}
                        {wordContent.map(para => (
                            <div
                                key={para.id}
                                onClick={() => setWordSelection(para.id)}
                                onContextMenu={(e) => handleContextMenu(e, 'word', para.id)}
                                className={`p-3 rounded-lg border transition-all cursor-context-menu relative group text-sm md:text-base
                            ${wordSelection === para.id ? 'bg-blue-100 border-blue-300 ring-2 ring-blue-200' : 'bg-transparent border-transparent hover:bg-slate-50 hover:border-slate-200'}
                        `}
                            >
                                {para.text}
                            </div>
                        ))}
                    </div>
                </div>

                {/* RIGHT: SPREADSHEET */}
                <div className="flex flex-col h-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden ring-4 ring-transparent hover:ring-green-50 transition-all">
                    <div className="bg-green-50/50 p-3 border-b border-green-100 flex items-center justify-between">
                        <span className="text-xs font-bold text-green-700 flex items-center gap-2 uppercase tracking-wide">
                            <Grid size={14} /> Spreadsheet Excel (Tujuan)
                        </span>
                    </div>
                    <div className="p-6 overflow-auto flex-1 bg-slate-50/30 select-none">
                        <div className="inline-block min-w-full" onContextMenu={(e) => e.preventDefault()}>
                            <div className="flex">
                                <div className="w-10"></div>
                                {['A', 'B', 'C'].map(col => (
                                    <div key={col} className="w-32 text-center text-[10px] font-bold text-slate-400 py-1 bg-slate-100 border border-slate-200 mx-[1px] rounded-t-sm">{col}</div>
                                ))}
                            </div>
                            {excelContent.map((row, rIdx) => (
                                <div key={rIdx} className="flex">
                                    <div className="w-10 text-center text-[10px] font-bold text-slate-400 py-3 bg-slate-100 border border-slate-200 my-[1px] flex items-center justify-center rounded-l-sm">{rIdx + 1}</div>
                                    {row.map((cell, cIdx) => (
                                        <div
                                            key={cIdx}
                                            onClick={() => setExcelSelection([rIdx, cIdx])}
                                            onContextMenu={(e) => handleContextMenu(e, 'excel', [rIdx, cIdx])}
                                            className={`w-32 h-12 border border-slate-200 bg-white mx-[1px] my-[1px] flex items-center px-2 text-xs transition-all cursor-cell
                                        ${excelSelection && excelSelection[0] === rIdx && excelSelection[1] === cIdx ? 'ring-2 ring-green-500 z-10 shadow-md border-green-500' : 'hover:bg-slate-50'}
                                    `}
                                        >
                                            {cell}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* BOTTOM: CLIPBOARD VISUALIZATION */}
            <div className="h-48 bg-slate-900 border-t border-slate-800 p-6 flex items-center gap-8 text-white relative overflow-hidden shadow-2xl z-20">
                {/* Background Gradients */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                <div className="w-48 shrink-0 hidden md:block">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <Clipboard size={16} /> Clipboard Buffer
                    </h3>
                    <p className="text-[10px] text-slate-500 leading-relaxed">
                        Area penyimpanan sementara (Memori) saat kamu melakukan Copy atau Cut. Data akan hilang jika komputer mati atau kamu meng-copy data baru.
                    </p>
                </div>

                {/* BUFFER VISUALIZATION */}
                <div className="flex-1 bg-slate-800/50 rounded-xl border border-slate-700/50 p-4 flex items-center justify-center relative min-h-[100px] border-dashed">
                    {clipboard.content ? (
                        <div className="animate-in zoom-in duration-300 flex items-center gap-4">
                            <div className="bg-white text-slate-900 px-4 py-3 rounded-lg shadow-lg font-medium text-sm max-w-md truncate border-l-4 border-blue-500 flex items-center gap-3">
                                {clipboard.content}
                            </div>
                            <ArrowRight className="text-slate-600 animate-pulse hidden md:block" />
                            <div className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-1 rounded hidden md:block">
                                Type: {clipboard.type} <br /> Source: {clipboard.source}
                            </div>
                            <button onClick={() => setClipboard({ content: null, type: null, source: null })} className="ml-4 p-2 hover:bg-slate-700 rounded-full text-slate-400 hover:text-red-400 transition-colors" title="Clear Buffer">
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ) : (
                        <div className="text-slate-600 text-sm italic flex items-center gap-2">
                            <AlertCircle size={16} /> Buffer Kosong (Belum ada data di-copy)
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default IntegrasiOffice;
