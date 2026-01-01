import React, { useState } from 'react';
import {
    CornerDownLeft,
    Trash2,
    CheckCircle,
    MoveHorizontal,
    MousePointer2,
    Minimize,
    Maximize,
    Scaling
} from 'lucide-react';

const WordTabulator = () => {
    // State
    const [activeTabType, setActiveTabType] = useState('left'); // 'left' | 'center' | 'right'
    const [tabStops, setTabStops] = useState([
        { id: 1, pos: 3, type: 'left' },
        { id: 2, pos: 10, type: 'center' }
    ]);
    const [lines, setLines] = useState([
        "Nama\t: Budi Santoso",
        "Kelas\t: VI (Enam)",
        "Hobi\t: Coding React"
    ]);
    const [activeLineIndex, setActiveLineIndex] = useState(0);
    const [activeTab, setActiveTab] = useState('Home');
    const [cursorPosition, setCursorPosition] = useState(0);
    const [toast, setToast] = useState(null);

    // Constants
    const CM_TO_PX = 37.8; // ~96 DPI / 2.54
    const MARGIN_LEFT_CM = 2.54;
    const MARGIN_LEFT_PX = MARGIN_LEFT_CM * CM_TO_PX;
    const DOC_WIDTH_PX = 794; // A4 width

    const showMessage = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    };

    // Cycle Tab Type
    const cycleTabType = () => {
        const types = ['left', 'center', 'right'];
        const nextIdx = (types.indexOf(activeTabType) + 1) % types.length;
        setActiveTabType(types[nextIdx]);
        showMessage(`Tipe Tab: ${types[nextIdx].toUpperCase()}`);
    };

    // Ruler Click Handler
    const handleRulerClick = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const clickX = e.clientX - rect.left;

        // Calculate pos relative to Margin
        const rawPosCm = (clickX - MARGIN_LEFT_PX) / CM_TO_PX;
        const posCm = Math.round(rawPosCm * 2) / 2; // snap 0.5

        if (posCm < 0) return; // Ignore margin clicks

        // Check if removing
        const existing = tabStops.find(t => Math.abs(t.pos - posCm) < 0.25);
        if (existing) {
            setTabStops(tabStops.filter(t => t.id !== existing.id));
            showMessage("🗑️ Tab Stop Dihapus");
        } else {
            const newTab = {
                id: Date.now(),
                pos: posCm,
                type: activeTabType
            };
            setTabStops([...tabStops, newTab].sort((a, b) => a.pos - b.pos));
            showMessage(`✅ Tab ${activeTabType} di ${posCm}cm`);
        }
    };

    const handleLineChange = (val, idx) => {
        const newLines = [...lines];
        newLines[idx] = val;
        setLines(newLines);
    };

    const handleKeyDown = (e, idx) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const currentLine = lines[idx];
            const before = currentLine.slice(0, cursorPosition);
            const after = currentLine.slice(cursorPosition);

            const newLines = [...lines];
            newLines[idx] = before;
            newLines.splice(idx + 1, 0, after);
            setLines(newLines);
            setActiveLineIndex(idx + 1);
            setCursorPosition(0);
        } else if (e.key === 'Backspace') {
            // If empty line and not first, delete line
            if (lines[idx] === "" && lines.length > 1) {
                e.preventDefault();
                const newLines = lines.filter((_, i) => i !== idx);
                setLines(newLines);
                setActiveLineIndex(idx - 1);
                setCursorPosition(lines[idx - 1].length);
            } else if (cursorPosition > 0) {
                // Manually handle backspace to keep sync with hidden input if needed?
                // Actually, native input handles backspace fine for value, BUT we need invalidation.
                // HOWEVER, since we capture onChange, relying on native backspace might be safer.
                // BUT: native backspace on hidden aligned input might not work perfectly with our tabs?
                // Let's stick to native behavior via onChange for simple text.
                // WAIT: Tab is a special char. If we type TAB, we preventDefault, so we manually insert \t.
                // So for Backspace, if we are deleting a \t, we might want manual control?
                // Native input is fine. We only need preventDefault if we do custom logic.
                // User says "Tab button not appropriate", implies insertion point.
                // Let's ONLY fix Tab here. Let native handle Backspace unless it's line merge.
            }
        } else if (e.key === 'Tab') {
            e.preventDefault();
            const currentLine = lines[idx];
            const before = currentLine.slice(0, cursorPosition);
            const after = currentLine.slice(cursorPosition);

            const newLines = [...lines];
            newLines[idx] = before + "\t" + after;
            setLines(newLines);
            setCursorPosition(cursorPosition + 1);
        } else if (e.key === 'ArrowUp' && idx > 0) {
            setActiveLineIndex(idx - 1);
        } else if (e.key === 'ArrowDown' && idx < lines.length - 1) {
            setActiveLineIndex(idx + 1);
        }
    };

    // Icons
    const TabIconSVG = ({ type }) => {
        if (type === 'left') return <svg width="12" height="12" viewBox="0 0 12 12"><polyline points="2,0 2,10 10,10" fill="none" stroke="black" strokeWidth="2" /></svg>;
        if (type === 'center') return <svg width="12" height="12" viewBox="0 0 12 12"><line x1="6" y1="0" x2="6" y2="10" stroke="#000" strokeWidth="2" /><line x1="2" y1="10" x2="10" y2="10" stroke="#000" strokeWidth="2" /></svg>;
        if (type === 'right') return <svg width="12" height="12" viewBox="0 0 12 12"><polyline points="10,0 10,10 2,10" fill="none" stroke="black" strokeWidth="2" /></svg>;
        return null;
    }

    // Caret Component
    const Caret = () => (
        <span className="inline-block w-[1.5px] h-[1.2em] bg-black animate-pulse align-text-bottom -mb-[3px] -ml-[0.5px]"></span>
    );

    const renderLine = (text, idx) => {
        const segments = text.split('\t');

        let charCount = 0; // Track cumulative length

        return (
            <div className="relative h-[24px] w-full flex items-center group font-serif text-[15px]">
                {/* Visual Segments */}
                {segments.map((seg, i) => {
                    let style = {};
                    if (i === 0) {
                        style = { left: 0, textAlign: 'left' };
                    } else {
                        const tabStop = tabStops[i - 1];
                        if (tabStop) {
                            let transform = 'none';
                            if (tabStop.type === 'center') transform = 'translateX(-50%)';
                            if (tabStop.type === 'right') transform = 'translateX(-100%)';

                            style = {
                                left: `${(tabStop.pos) * CM_TO_PX}px`,
                                position: 'absolute',
                                transform,
                                whiteSpace: 'nowrap'
                            };
                        } else {
                            style = { left: `${(i * 1.25) * CM_TO_PX}px`, position: 'absolute' };
                        }
                    }

                    // Cursor Logic
                    const start = charCount;
                    const end = charCount + seg.length; // Range [start, end]
                    // Special case: cursor at the very end of segment (end position)

                    // Is cursor potentially in this segment?
                    // We need to handle if cursor is exactly at 'end'. 
                    // If it's the last segment, yes. 
                    // If it's not the last, providing it's not at the START of next?

                    // Improved logic: 
                    // Render cursor in this segment IF:
                    // 1. It is within (start < pos < end)
                    // 2. It is at START (pos == start)
                    // 3. It is at END (pos == end) AND it is the last segment 
                    //    OR user just hit tab so we want to show it here? No, if Tab hit, cursor is at 'start' of next.

                    const isLastSegment = i === segments.length - 1;
                    const isCursorInSegment = activeLineIndex === idx && (
                        (cursorPosition >= start && cursorPosition < end) ||
                        (cursorPosition === end && isLastSegment)
                    );

                    let content = seg;
                    if (isCursorInSegment) {
                        const relativePos = cursorPosition - start;
                        content = (
                            <>
                                {seg.slice(0, relativePos)}
                                <Caret />
                                {seg.slice(relativePos)}
                            </>
                        );
                    }

                    charCount += seg.length + 1; // +1 for the tab char

                    return (
                        <span key={i} className="absolute text-slate-900 pointer-events-none whitespace-pre" style={style}>
                            {content}
                        </span>
                    );
                })}

                {/* Hidden Input */}
                {activeLineIndex === idx && (
                    <input
                        className="absolute inset-0 w-full opacity-0 cursor-text"
                        value={text}
                        onChange={(e) => {
                            handleLineChange(e.target.value, idx);
                            setCursorPosition(e.target.selectionStart);
                        }}
                        onKeyDown={(e) => handleKeyDown(e, idx)}
                        onSelect={(e) => setCursorPosition(e.target.selectionStart)}
                        onClick={(e) => setCursorPosition(e.target.selectionStart)}
                        onKeyUp={(e) => setCursorPosition(e.target.selectionStart)}
                        autoFocus
                    />
                )}
                {/* Click area */}
                {activeLineIndex !== idx && (
                    <div className="absolute inset-0 cursor-text" onClick={() => setActiveLineIndex(idx)}></div>
                )}
            </div>
        );
    };

    return (
        <div className="h-[calc(100vh-4rem)] bg-slate-200 font-sans text-slate-800 flex flex-col overflow-hidden relative">

            {/* TOAST */}
            {toast && (
                <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[300] bg-slate-900 text-white px-8 py-3 rounded-full shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 border border-slate-700">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">{toast}</span>
                </div>
            )}

            {/* RIBBON (MATCHING WordParagraph.jsx STYLE) */}
            <div className="bg-[#f3f3f3] border-b border-slate-300 select-none shrink-0 font-sans">
                {/* Tabs */}
                <div className="flex bg-[#e1e1e1] px-4 text-[11px] text-slate-700">
                    {['File', 'Home', 'Insert', 'Design', 'Layout'].map(tab => (
                        <div
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 cursor-pointer transition-all ${activeTab === tab ? 'bg-[#f3f3f3] font-bold text-indigo-700 border-t-2 border-indigo-600' : 'hover:bg-slate-300'}`}
                        >
                            {tab}
                        </div>
                    ))}
                </div>

                {/* Ribbon Content */}
                <div className="p-2 flex items-center gap-2 bg-[#f3f3f3] min-h-[90px] border-b border-slate-200">
                    {activeTab === 'Home' ? (
                        <>
                            {/* Tabulator Tools Group */}
                            <div className="flex flex-col items-center px-6 border-r border-slate-300 gap-1">
                                <div className="flex gap-4">
                                    <button
                                        onClick={cycleTabType}
                                        className="w-12 h-10 border border-slate-300 bg-white rounded flex flex-col items-center justify-center hover:bg-slate-50 transition-colors shadow-sm"
                                        title="Ubah Tipe Tab (Klik)"
                                    >
                                        <div className="scale-150 mb-1"><TabIconSVG type={activeTabType} /></div>
                                        <span className="text-[9px] text-slate-500 uppercase font-bold">{activeTabType}</span>
                                    </button>
                                </div>
                                <span className="text-[10px] font-bold text-slate-600 mt-0.5">Tab Selector</span>
                            </div>

                            {/* Instructions Group */}
                            <div className="flex flex-col justify-center px-4 text-xs text-slate-600 space-y-1">
                                <p className="flex items-center gap-2"><MousePointer2 size={14} className="text-indigo-600" /> <b>Klik Ruler</b> untuk tambah tab.</p>
                                <p className="flex items-center gap-2"><MoveHorizontal size={14} className="text-indigo-600" /> Tekan <b>TAB</b> untuk loncat.</p>
                                <p className="flex items-center gap-2"><Trash2 size={14} className="text-red-500" /> <b>Klik Icon Tab</b> di ruler untuk hapus.</p>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-slate-400 italic text-xs">
                            Fitur tab "{activeTab}" tidak aktif di simulasi ini. Klik "Home".
                        </div>
                    )}
                </div>
            </div>

            {/* DOCUMENT AREA with ATTACHED RULER */}
            <div className="bg-[#a0a0a0] p-4 md:p-8 flex justify-center flex-1 overflow-auto">
                <div
                    className="bg-white shadow-2xl relative flex flex-col"
                    style={{ width: `${DOC_WIDTH_PX}px`, minHeight: '1000px' }}
                >

                    {/* RULER BAR (Sticky at top of paper) */}
                    <div className="h-[30px] bg-slate-100 border-b border-slate-300 relative select-none w-full shrink-0">
                        {/* Ruler Container matching Margins */}

                        {/* Margin Zone Gray (Left) */}
                        <div className="absolute top-0 bottom-0 left-0 bg-slate-300 z-10 border-r border-slate-400" style={{ width: `${MARGIN_LEFT_PX}px` }}>
                            {/* Tab Select Indicator overlay */}
                            <div
                                className="absolute top-0 left-0 w-full h-full flex items-center justify-center cursor-pointer hover:bg-slate-200"
                                onClick={cycleTabType}
                                title="Ganti Tipe Tab"
                            >
                                <div className="scale-125 opacity-50"><TabIconSVG type={activeTabType} /></div>
                            </div>
                        </div>

                        {/* Margin Zone Gray (Right) */}
                        <div className="absolute top-0 bottom-0 right-0 bg-slate-300 z-10 border-l border-slate-400" style={{ width: `${MARGIN_LEFT_PX}px` }}></div>

                        {/* Active Ruler Area */}
                        <div
                            className="absolute top-0 bottom-0 left-0 right-0 cursor-crosshair overflow-hidden"
                            onClick={handleRulerClick}
                        >
                            {/* Ticks */}
                            {Array.from({ length: 30 }).map((_, i) => {
                                const posCm = i * 0.5;
                                const isCm = i % 2 === 0;
                                const leftPx = MARGIN_LEFT_PX + (posCm * CM_TO_PX);
                                return (
                                    <div
                                        key={i}
                                        className={`absolute bottom-0 border-l border-slate-500 ${isCm ? 'h-3' : 'h-1.5'}`}
                                        style={{ left: `${leftPx}px` }}
                                    >
                                        {isCm && (
                                            <span className="absolute -top-3 -left-1 text-[9px] text-slate-600 font-sans">{posCm}</span>
                                        )}
                                    </div>
                                );
                            })}

                            {/* User Tab Stops */}
                            {tabStops.map(tab => (
                                <div
                                    key={tab.id}
                                    className="absolute bottom-0 w-4 h-4 -ml-2 z-20 hover:scale-125 transition-transform flex items-end justify-center cursor-pointer"
                                    style={{ left: `${MARGIN_LEFT_PX + (tab.pos * CM_TO_PX)}px` }}
                                    title="Klik untuk hapus"
                                >
                                    <TabIconSVG type={tab.type} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* EDITABLE CONTENT */}
                    <div
                        className="flex-1 font-serif text-[15px] leading-relaxed relative"
                        style={{
                            paddingTop: `${MARGIN_LEFT_PX / 2}px`, // Top margin
                            paddingLeft: `${MARGIN_LEFT_PX}px`,
                            paddingRight: `${MARGIN_LEFT_PX}px`,
                            paddingBottom: '96px'
                        }}
                    >
                        {/* Guide Line for Left Margin (Optional) */}
                        <div className="absolute top-0 bottom-0 border-l border-dashed border-slate-200 pointer-events-none" style={{ left: `${MARGIN_LEFT_PX}px` }}></div>

                        {lines.map((line, idx) => (
                            <div key={idx}>
                                {renderLine(line, idx)}
                            </div>
                        ))}

                    </div>

                </div>
            </div>

            {/* FOOTER (MATCHING WordParagraph.jsx) */}
            <footer className="bg-indigo-700 text-white px-6 py-2 flex items-center justify-between text-[9px] font-black uppercase tracking-[0.3em] shrink-0 border-t border-indigo-600">
                <div className="flex gap-8">
                    <span className="flex items-center gap-2 font-mono">Page 1 of 1</span>
                    <span className="flex items-center gap-2 font-mono">Tab Stops: {tabStops.length}</span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="flex items-center gap-2 font-mono">Active Tab: {activeTabType.toUpperCase()}</span>
                    <div className="w-px h-3 bg-white/20 mx-2"></div>
                    <Scaling size={12} className="opacity-50" />
                    <span>85%</span>
                </div>
            </footer>
        </div>
    );
};

export default WordTabulator;
