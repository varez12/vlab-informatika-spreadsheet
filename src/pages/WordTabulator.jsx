import React, { useState, useRef, useEffect } from 'react';
import {
    CornerDownLeft,
    Trash2,
    CheckCircle,
    MoveHorizontal,
    MousePointer2,
    Minimize,
    Maximize,
    Scaling,
    Info,
    X
} from 'lucide-react';

const WordTabulator = () => {
    // State
    const [activeTabType, setActiveTabType] = useState('left'); // 'left' | 'center' | 'right'
    const [tabStops, setTabStops] = useState([
        { id: 1, pos: 1.5, type: 'left' },    // Left tab di 1.5cm untuk data
        { id: 2, pos: 3, type: 'center' },    // Center tab di 3cm untuk tanda tangan kiri
        { id: 3, pos: 7, type: 'center' }     // Center tab di 7cm untuk tanda tangan kanan
    ]);
    const [lines, setLines] = useState([
        "Nama\t: Budi Santoso",
        "Kelas\t: VI (Enam)",
        "Alamat\t: Jl. Merdeka No. 10",
        "",
        "",
        "\t\tMengetahui,\tMenyetujui,",
        "\t\tKepala Sekolah\tWali Kelas",
        "",
        "",
        "\t\tAhmad Yani, M.Pd\tSiti Rahayu, S.Pd"
    ]);
    const [activeLineIndex, setActiveLineIndex] = useState(0);
    const [activeTab, setActiveTab] = useState('Home');
    const [cursorPosition, setCursorPosition] = useState(0);
    const [toast, setToast] = useState(null);

    // Refs for Scroll Sync
    const docContainerRef = useRef(null);
    const verticalRulerRef = useRef(null);

    // Sync Vertical Ruler Scroll with Document
    const handleDocScroll = () => {
        if (docContainerRef.current && verticalRulerRef.current) {
            verticalRulerRef.current.scrollTop = docContainerRef.current.scrollTop;
        }
    };

    // Constants
    const CM_TO_PX = 37.8; // ~96 DPI / 2.54
    const MARGIN_LEFT_CM = 1; // Reduced for mobile
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

        // Calculate pos in cm (ruler active area starts at 0, not at margin)
        const rawPosCm = clickX / CM_TO_PX;
        const posCm = Math.round(rawPosCm * 2) / 2; // snap to 0.5cm

        if (posCm < 0) return; // Ignore invalid clicks

        // Check if removing existing tab stop (within 0.5cm tolerance)
        const existing = tabStops.find(t => Math.abs(t.pos - posCm) < 0.5);
        if (existing) {
            setTabStops(tabStops.filter(t => t.id !== existing.id));
            showMessage("🗑️ Tab Stop Dihapus");
        } else {
            // Add new tab stop
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
        if (type === 'left') return <svg width="8" height="8" viewBox="0 0 12 12"><polyline points="2,0 2,10 10,10" fill="none" stroke="black" strokeWidth="2" /></svg>;
        if (type === 'center') return <svg width="8" height="8" viewBox="0 0 12 12"><line x1="6" y1="0" x2="6" y2="10" stroke="#000" strokeWidth="2" /><line x1="2" y1="10" x2="10" y2="10" stroke="#000" strokeWidth="2" /></svg>;
        if (type === 'right') return <svg width="8" height="8" viewBox="0 0 12 12"><polyline points="10,0 10,10 2,10" fill="none" stroke="black" strokeWidth="2" /></svg>;
        return null;
    }

    // Caret Component
    const Caret = () => (
        <span className="inline-block w-[1.5px] h-[1.2em] bg-black animate-pulse align-text-bottom -mb-[3px] -ml-[0.5px]"></span>
    );

    const renderLine = (text, idx) => {
        const segments = text.split('\t');

        let charCount = 0; // Track cumulative length

        // Default tab spacing in cm (smaller for mobile compatibility)
        const DEFAULT_TAB_SPACING = 1.5;

        // Sort tab stops by position
        const sortedTabs = [...tabStops].sort((a, b) => a.pos - b.pos);

        return (
            <div className="relative h-[24px] w-full flex items-center group font-serif text-[15px]">
                {/* Visual Segments */}
                {segments.map((seg, i) => {
                    let leftPos = 0;
                    let transform = 'none';

                    if (i === 0) {
                        // First segment always starts at 0
                        leftPos = 0;
                    } else {
                        // For segments after the first, find corresponding tab stop
                        // i=1 uses sortedTabs[0], i=2 uses sortedTabs[1], etc.
                        const tabIndex = i - 1;

                        if (tabIndex < sortedTabs.length) {
                            // There's a tab stop available for this segment
                            const tabStop = sortedTabs[tabIndex];
                            leftPos = tabStop.pos * CM_TO_PX;
                            if (tabStop.type === 'center') transform = 'translateX(-50%)';
                            if (tabStop.type === 'right') transform = 'translateX(-100%)';
                        } else {
                            // No more tab stops - use default spacing
                            // Calculate position based on last tab stop or default
                            if (sortedTabs.length > 0) {
                                // Continue from last tab stop position
                                const lastTabPos = sortedTabs[sortedTabs.length - 1].pos;
                                const extraSegments = tabIndex - sortedTabs.length + 1;
                                leftPos = (lastTabPos + extraSegments * DEFAULT_TAB_SPACING) * CM_TO_PX;
                            } else {
                                // No tab stops at all - pure default spacing
                                leftPos = i * DEFAULT_TAB_SPACING * CM_TO_PX;
                            }
                        }
                    }

                    const style = {
                        left: `${leftPos}px`,
                        position: 'absolute',
                        transform,
                        whiteSpace: 'nowrap'
                    };

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



                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-slate-400 italic text-xs">
                            Fitur tab "{activeTab}" tidak aktif di simulasi ini. Klik "Home".
                        </div>
                    )}
                </div>
            </div>

            {/* MAIN CONTENT: Vertical Ruler + Document Area */}
            <div className="flex flex-1 overflow-hidden">
                {/* VERTICAL RULER (Fixed at far left) */}
                <div className="w-[20px] bg-[#f0f0f0] border-r border-slate-300 relative select-none shrink-0 overflow-hidden">
                    {/* Tab Selector Corner Box at top */}
                    <div
                        className="absolute top-0 left-0 right-0 h-[24px] bg-[#f0f0f0] border-b border-slate-300 flex items-center justify-center cursor-pointer hover:bg-[#e0e0e0] transition-colors z-10"
                        onClick={cycleTabType}
                        title={`Tipe Tab: ${activeTabType.toUpperCase()} (Klik untuk ganti)`}
                    >
                        <TabIconSVG type={activeTabType} />
                    </div>

                    {/* Vertical Ruler Content (starts from top, ignoring horizontal ruler) */}
                    <div
                        ref={verticalRulerRef}
                        className="absolute top-[24px] left-0 right-0 bottom-0 overflow-hidden"
                    >
                        <div className="relative w-full h-full mt-4 md:mt-8">
                            {/* Top Margin (Gray) */}
                            <div className="absolute top-0 left-0 right-0 bg-[#d4d4d4]" style={{ height: `${MARGIN_LEFT_PX}px` }}></div>

                            {/* Bottom Margin (Gray) */}
                            <div className="absolute bottom-0 left-0 right-0 bg-[#d4d4d4]" style={{ height: `${MARGIN_LEFT_PX}px` }}></div>

                            {/* Active Vertical Ruler (White) */}
                            <div
                                className="absolute left-0 right-0 bg-white"
                                style={{ top: `${MARGIN_LEFT_PX}px`, bottom: `${MARGIN_LEFT_PX}px` }}
                            >
                                {/* Vertical Ticks */}
                                {Array.from({ length: 56 }).map((_, i) => {
                                    const posCm = i * 0.5;
                                    const isCm = i % 2 === 0;
                                    const topPx = posCm * CM_TO_PX;

                                    return (
                                        <div key={i} className="absolute left-0 right-0" style={{ top: `${topPx}px` }}>
                                            {isCm ? (
                                                <>
                                                    <div className="absolute right-0 h-[1px] w-[6px] bg-slate-500"></div>
                                                    {posCm > 0 && (
                                                        <span className="absolute right-[8px] text-[8px] text-slate-500 font-sans" style={{ transform: 'translateY(-50%)' }}>
                                                            {posCm}
                                                        </span>
                                                    )}
                                                </>
                                            ) : (
                                                <div className="absolute right-0 h-[1px] w-[3px] bg-slate-400"></div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* DOCUMENT AREA with Horizontal Ruler */}
                <div
                    ref={docContainerRef}
                    onScroll={handleDocScroll}
                    className="bg-[#e5e7eb] flex-1 flex flex-col overflow-auto custom-scrollbar"
                >
                    {/* Horizontal Ruler - attached to document */}
                    <div className="shrink-0 sticky top-0 z-10 bg-[#f0f0f0] border-b border-slate-300 flex justify-center pl-4 pr-4 md:pl-8 md:pr-8">
                        <div
                            className="h-[24px] relative select-none overflow-hidden"
                            style={{ width: `${DOC_WIDTH_PX}px` }}
                        >
                            {/* Left Margin (Gray) */}
                            <div className="absolute top-0 bottom-0 left-0 bg-[#d4d4d4]" style={{ width: `${MARGIN_LEFT_PX}px` }}></div>

                            {/* Right Margin (Gray) */}
                            <div className="absolute top-0 bottom-0 right-0 bg-[#d4d4d4]" style={{ width: `${MARGIN_LEFT_PX}px` }}></div>

                            {/* White ruler area */}
                            <div
                                className="absolute top-0 bottom-0 bg-white cursor-crosshair"
                                style={{ left: `${MARGIN_LEFT_PX}px`, right: `${MARGIN_LEFT_PX}px` }}
                                onClick={handleRulerClick}
                            >
                                {/* Ruler Ticks */}
                                {Array.from({ length: 32 }).map((_, i) => {
                                    const posCm = i * 0.5;
                                    const isCm = i % 2 === 0;
                                    const leftPx = posCm * CM_TO_PX;

                                    return (
                                        <div key={i} className="absolute top-0 bottom-0" style={{ left: `${leftPx}px` }}>
                                            {isCm ? (
                                                <>
                                                    <div className="absolute bottom-0 w-[1px] h-[6px] bg-slate-500"></div>
                                                    {posCm > 0 && (
                                                        <span className="absolute bottom-[2px] text-[8px] text-slate-500 font-sans" style={{ transform: 'translateX(-50%)' }}>
                                                            {posCm}
                                                        </span>
                                                    )}
                                                </>
                                            ) : (
                                                <div className="absolute bottom-0 w-[1px] h-[3px] bg-slate-400"></div>
                                            )}
                                        </div>
                                    );
                                })}

                                {/* Tab Stops */}
                                {tabStops.map(tab => (
                                    <div
                                        key={tab.id}
                                        className="absolute bottom-0 w-4 h-4 -ml-2 z-20 hover:scale-125 transition-transform flex items-end justify-center cursor-pointer"
                                        style={{ left: `${tab.pos * CM_TO_PX}px` }}
                                        title="Klik untuk hapus"
                                    >
                                        <TabIconSVG type={tab.type} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Document Paper */}
                    <div className="flex-1 p-4 md:p-8 flex justify-center">
                        <div
                            className="bg-white shadow-[0_0_30px_rgba(0,0,0,0.2)] relative flex flex-col border border-slate-300"
                            style={{ width: `${DOC_WIDTH_PX}px`, minHeight: '29.7cm' }}
                        >
                            {/* EDITABLE CONTENT */}
                            <div
                                className="flex-1 font-serif text-[15px] leading-relaxed relative"
                                style={{
                                    paddingTop: `${MARGIN_LEFT_PX}px`,
                                    paddingLeft: `${MARGIN_LEFT_PX}px`,
                                    paddingRight: `${MARGIN_LEFT_PX}px`,
                                    paddingBottom: '96px'
                                }}
                            >
                                {/* Guide Line for Left Margin */}
                                <div className="absolute top-0 bottom-0 border-l border-dashed border-slate-200 pointer-events-none" style={{ left: `${MARGIN_LEFT_PX}px` }}></div>

                                {lines.map((line, idx) => (
                                    <div key={idx}>
                                        {renderLine(line, idx)}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* FOOTER STATUS BAR */}
            <footer className="bg-[#f3f3f3] text-regal-blue px-2 py-1 flex items-center justify-between text-[11px] font-sans border-t border-[#d6d6d6] shrink-0 select-none text-slate-600">
                <div className="flex gap-4 px-2">
                    <span className="flex items-center gap-1 hover:bg-[#e0e0e0] px-1 rounded cursor-default">Page 1 of 1</span>
                    <span className="flex items-center gap-1 hover:bg-[#e0e0e0] px-1 rounded cursor-default">Tab Stops: {tabStops.length}</span>
                    <span className="hidden md:flex items-center gap-1 hover:bg-[#e0e0e0] px-1 rounded cursor-default">Active: {activeTabType.toUpperCase()}</span>
                </div>
                <div className="flex items-center gap-2 px-4">
                    <Scaling size={12} className="text-slate-500" />
                    <span className="font-mono text-xs">100%</span>
                </div>
            </footer>

            {/* FLOATING HELP BUTTON */}
            <div className="fixed bottom-6 right-6 z-40 group">
                <button
                    className="w-14 h-14 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
                    title="Bantuan"
                >
                    <Info size={24} />
                </button>
                {/* Tooltip Popup */}
                <div className="absolute bottom-full right-0 mb-3 w-64 bg-slate-900 text-white text-xs rounded-lg p-4 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <p className="font-bold text-indigo-300 mb-2">Cara Menggunakan Tab:</p>
                    <p className="mb-1.5 flex items-center gap-2"><MousePointer2 size={12} /> <b>Klik Ruler</b> → tambah tab stop</p>
                    <p className="mb-1.5 flex items-center gap-2"><MoveHorizontal size={12} /> Tekan <b>TAB</b> → loncat ke tab</p>
                    <p className="flex items-center gap-2"><Trash2 size={12} className="text-red-400" /> <b>Klik Icon Tab</b> → hapus tab</p>
                </div>
            </div>
        </div>
    );
};

export default WordTabulator;



