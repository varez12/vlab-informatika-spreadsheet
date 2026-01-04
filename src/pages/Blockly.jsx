import React, { useState, useEffect, useRef } from 'react';
import {
    Play,
    RotateCcw,
    Lightbulb,
    Layers,
    Cpu,
    Code,
    X,
    Plus,
    Trash2,
    Zap,
    Activity,
    Eye,
    Volume2,
    VolumeX,
    Infinity,
    Moon,
    Sun,
    Square,
    ZoomIn,
    Search,
    Menu
} from 'lucide-react';

// Konfigurasi Blok Tersedia
const BLOCK_TYPES = {
    START: { id: 'start', label: 'Mulai Program', color: 'bg-yellow-500', type: 'event' },
    LOOP_5: { id: 'loop_5', label: 'Ulangi 5 Kali', color: 'bg-pink-500', type: 'control' },
    FOREVER: { id: 'forever', label: 'Selamanya', color: 'bg-pink-600', type: 'control' },
    IF_OFF: { id: 'if_off', label: 'Jika Lampu Mati', color: 'bg-blue-500', type: 'logic' },
    IF_DARK: { id: 'if_dark', label: 'Jika Gelap', color: 'bg-indigo-500', type: 'logic' },
    LED_ON: { id: 'led_on', label: 'Nyalakan Lampu', color: 'bg-green-500', type: 'action' },
    LED_OFF: { id: 'led_off', label: 'Matikan Lampu', color: 'bg-red-500', type: 'action' },
    BUZZER_ON: { id: 'buzzer_on', label: 'Bunyi Buzzer', color: 'bg-purple-500', type: 'action' },
    BUZZER_OFF: { id: 'buzzer_off', label: 'Diam', color: 'bg-slate-500', type: 'action' },
    WAIT: { id: 'wait', label: 'Tunggu 1 Detik', color: 'bg-orange-400', type: 'action' }
};

const Blockly = () => {
    // --- State Management ---
    const [workspace, setWorkspace] = useState([BLOCK_TYPES.START]);
    const [isRunning, setIsRunning] = useState(false);
    const [stopRequested, setStopRequested] = useState(false);
    const [activeBlockIndex, setActiveBlockIndex] = useState(-1);
    const [ledStatus, setLedStatus] = useState(false);
    const [buzzerStatus, setBuzzerStatus] = useState(false);
    const [isDark, setIsDark] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [zoomLevel, setZoomLevel] = useState(100);
    const [viewMode, setViewMode] = useState('software');
    const [currentLoopCount, setCurrentLoopCount] = useState(0);
    const [showSidebar, setShowSidebar] = useState(false); // Mobile sidebar toggle

    // --- Audio Engine (Web Audio API) ---
    const audioCtxRef = useRef(null);
    const oscillatorRef = useRef(null);

    const startBeep = () => {
        try {
            if (!audioCtxRef.current) {
                audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
            }

            if (audioCtxRef.current.state === 'suspended') {
                audioCtxRef.current.resume();
            }

            if (oscillatorRef.current) return;

            const osc = audioCtxRef.current.createOscillator();
            const gain = audioCtxRef.current.createGain();

            osc.type = 'square'; // Suara khas buzzer elektronik
            osc.frequency.setValueAtTime(880, audioCtxRef.current.currentTime); // Nada A5

            gain.gain.setValueAtTime(0.05, audioCtxRef.current.currentTime); // Volume rendah agar tidak mengejutkan

            osc.connect(gain);
            gain.connect(audioCtxRef.current.destination);

            osc.start();
            oscillatorRef.current = osc;
        } catch (e) {
            console.error("Audio not supported", e);
        }
    };

    const stopBeep = () => {
        if (oscillatorRef.current) {
            oscillatorRef.current.stop();
            oscillatorRef.current.disconnect();
            oscillatorRef.current = null;
        }
    };

    // Sinkronisasi status buzzer dengan suara nyata
    useEffect(() => {
        if (buzzerStatus) {
            startBeep();
        } else {
            stopBeep();
        }
        return () => stopBeep();
    }, [buzzerStatus]);

    // --- Logic & Simulation Engine ---

    const executeAction = async (index, block) => {
        if (stopRequested) return;
        setActiveBlockIndex(index);
        switch (block.id) {
            case 'led_on': setLedStatus(true); break;
            case 'led_off': setLedStatus(false); break;
            case 'buzzer_on': setBuzzerStatus(true); break;
            case 'buzzer_off': setBuzzerStatus(false); break;
            case 'wait': await new Promise(r => setTimeout(r, 1000)); break;
            default: break;
        }
        await new Promise(r => setTimeout(r, 400));
    };

    const runSimulation = async () => {
        if (isRunning) return;

        // Resume audio context on user interaction (browser security)
        if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
            audioCtxRef.current.resume();
        }

        setIsRunning(true);
        setStopRequested(false);
        setCurrentLoopCount(0);

        const runSequence = async () => {
            let idx = 0;
            while (idx < workspace.length && !stopRequested) {
                const block = workspace[idx];
                setActiveBlockIndex(idx);

                if (block.id === 'start') {
                    idx++;
                }
                else if (block.id === 'if_off') {
                    await new Promise(r => setTimeout(r, 400));
                    if (!ledStatus) idx++;
                    else idx += 2;
                }
                else if (block.id === 'if_dark') {
                    await new Promise(r => setTimeout(r, 400));
                    if (isDark) idx++;
                    else idx += 2;
                }
                else if (block.id === 'loop_5') {
                    const subBlocks = workspace.slice(idx + 1);
                    if (subBlocks.length === 0) idx++;
                    else {
                        for (let count = 1; count <= 5; count++) {
                            if (stopRequested) break;
                            setCurrentLoopCount(count);
                            for (let j = 0; j < subBlocks.length; j++) {
                                if (stopRequested) break;
                                await executeAction(idx + 1 + j, subBlocks[j]);
                            }
                        }
                        return;
                    }
                }
                else if (block.id === 'forever') {
                    const subBlocks = workspace.slice(idx + 1);
                    if (subBlocks.length === 0) return;
                    while (!stopRequested) {
                        for (let j = 0; j < subBlocks.length; j++) {
                            if (stopRequested) break;
                            await executeAction(idx + 1 + j, subBlocks[j]);
                        }
                    }
                    return;
                }
                else {
                    await executeAction(idx, block);
                    idx++;
                }
                await new Promise(r => setTimeout(r, 100));
            }
        };

        await runSequence();

        setActiveBlockIndex(-1);
        setIsRunning(false);
        setStopRequested(false);
        setCurrentLoopCount(0);
        setBuzzerStatus(false);
        setLedStatus(false);
    };

    const stopSimulation = () => {
        setStopRequested(true);
        setLedStatus(false);
        setBuzzerStatus(false);
        stopBeep();
    };

    const addBlock = (blockType) => {
        if (isRunning) return;
        setWorkspace([...workspace, blockType]);
    };

    const removeBlock = (index) => {
        if (isRunning || index === 0) return;
        const newWs = [...workspace];
        newWs.splice(index, 1);
        setWorkspace(newWs);
    };

    const resetWorkspace = () => {
        if (isRunning) return;
        setWorkspace([BLOCK_TYPES.START]);
        setLedStatus(false);
        setBuzzerStatus(false);
        setActiveBlockIndex(-1);
    };

    const renderBlock = (block, uniqueKey, index, isPalette = false) => {
        const isActive = activeBlockIndex === index;

        return (
            <div
                key={uniqueKey}
                onClick={() => isPalette ? addBlock(block) : null}
                className={`
          relative flex items-center p-3 mb-2 rounded-lg cursor-pointer transition-all duration-300
          ${block.color} text-white font-medium shadow-md border-b-4 border-black/20
          ${isPalette ? 'hover:scale-105 active:scale-95' : 'w-full'}
          ${isActive ? 'ring-4 ring-white animate-pulse scale-105 z-10 shadow-[0_0_20px_rgba(255,255,255,0.5)]' : ''}
        `}
                style={{ transform: !isPalette ? `scale(${zoomLevel / 100})` : 'none', transformOrigin: 'left' }}
            >
                <div className="mr-3 opacity-80">
                    {block.type === 'control' && <Layers size={18} />}
                    {block.type === 'action' && <Plus size={18} />}
                    {block.type === 'event' && <Play size={18} />}
                    {block.type === 'logic' && <Zap size={18} />}
                </div>
                <div className="flex flex-col">
                    <span className="text-[8px] opacity-60 uppercase font-black tracking-widest leading-none mb-0.5">{block.type}</span>
                    <span className="text-sm md:text-base select-none leading-none">{block.label}</span>
                </div>

                {!isPalette && index !== 0 && (
                    <button
                        onClick={(e) => { e.stopPropagation(); removeBlock(index); }}
                        className="ml-auto p-1 hover:bg-black/10 rounded"
                    >
                        <Trash2 size={14} />
                    </button>
                )}

                {!isPalette && (
                    <div className="absolute -bottom-2 left-8 w-6 h-3 bg-inherit rounded-b-full border-b-4 border-black/10"></div>
                )}
            </div>
        );
    };

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-50 text-slate-900 font-sans overflow-hidden">

            {/* MAIN CONTENT */}
            <main className="flex-1 flex flex-col overflow-hidden">

                {/* COMPACT TOOLBAR */}
                <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shadow-sm z-30 flex-shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="bg-indigo-600 p-2 rounded-lg text-white">
                            <Cpu size={20} />
                        </div>
                        <div>
                            <h1 className="font-bold text-sm text-slate-800">Blockly IoT Simulator</h1>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">LED & Buzzer Control</p>
                        </div>
                    </div>

                    <nav className="hidden md:flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200">
                        <button
                            onClick={() => setViewMode('software')}
                            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-[10px] font-black transition-all uppercase ${viewMode === 'software' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:bg-slate-200'}`}
                        >
                            <Layers size={12} /> Coding
                        </button>
                        <button
                            onClick={() => setViewMode('hardware')}
                            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-[10px] font-black transition-all uppercase ${viewMode === 'hardware' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:bg-slate-200'}`}
                        >
                            <Cpu size={12} /> Hardware
                        </button>
                    </nav>

                    <div className="flex items-center gap-2">
                        {isRunning ? (
                            <button
                                onClick={stopSimulation}
                                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs transition-all shadow-lg animate-pulse"
                            >
                                <Square size={14} fill="currentColor" /> STOP
                            </button>
                        ) : (
                            <button
                                onClick={runSimulation}
                                className="flex items-center gap-2 px-6 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white font-black text-xs transition-all shadow-lg"
                            >
                                <Play size={14} fill="currentColor" /> JALANKAN
                            </button>
                        )}
                    </div>
                </div>

                {/* WORKSPACE CONTAINER */}
                <div className="flex-1 flex overflow-hidden relative">

                    {/* Mobile Sidebar Toggle Button */}
                    <button
                        onClick={() => setShowSidebar(true)}
                        className="md:hidden fixed bottom-24 left-4 z-40 w-12 h-12 bg-indigo-600 text-white rounded-xl shadow-lg flex items-center justify-center"
                    >
                        <Plus size={24} />
                    </button>

                    {/* Mobile Overlay */}
                    {showSidebar && (
                        <div
                            onClick={() => setShowSidebar(false)}
                            className="md:hidden fixed inset-0 bg-black/50 z-40"
                        />
                    )}

                    {/* SIDEBAR PALETTE - Drawer on mobile, static on desktop */}
                    <aside className={`
                        fixed md:relative inset-y-0 left-0 z-50
                        w-72 md:w-80 bg-white border-r border-slate-200 
                        p-4 md:p-6 flex flex-col gap-6 md:gap-8 shadow-lg md:shadow-sm overflow-y-auto
                        transform transition-transform duration-300 ease-out
                        ${showSidebar ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                    `}>

                        <div className="flex flex-col gap-6">
                            <div>
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                                    <Layers size={12} className="text-pink-500" /> Kontrol Alur
                                </h3>
                                <div className="space-y-1">
                                    {renderBlock(BLOCK_TYPES.LOOP_5, `p-loop5`, 0, true)}
                                    {renderBlock(BLOCK_TYPES.FOREVER, `p-forever`, 0, true)}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                                    <Zap size={12} className="text-blue-500" /> Logika Sensor
                                </h3>
                                <div className="space-y-1">
                                    {renderBlock(BLOCK_TYPES.IF_OFF, `p-ifoff`, 0, true)}
                                    {renderBlock(BLOCK_TYPES.IF_DARK, `p-ifdark`, 0, true)}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                                    <Cpu size={12} className="text-green-500" /> Aksi Output
                                </h3>
                                <div className="space-y-1">
                                    {renderBlock(BLOCK_TYPES.LED_ON, `p-on`, 0, true)}
                                    {renderBlock(BLOCK_TYPES.LED_OFF, `p-off`, 0, true)}
                                    {renderBlock(BLOCK_TYPES.BUZZER_ON, `p-bon`, 0, true)}
                                    {renderBlock(BLOCK_TYPES.BUZZER_OFF, `p-boff`, 0, true)}
                                    {renderBlock(BLOCK_TYPES.WAIT, `p-wait`, 0, true)}
                                </div>
                            </div>
                        </div>

                        <div className="mt-auto border-t pt-4 md:pt-6">
                            {/* Mobile Close Button */}
                            <button
                                onClick={() => setShowSidebar(false)}
                                className="md:hidden w-full mb-3 py-2 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold uppercase flex items-center justify-center gap-2"
                            >
                                <X size={14} /> Tutup Menu
                            </button>
                            <div className="mb-4 flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Environment</span>
                                <button
                                    onClick={() => setIsDark(!isDark)}
                                    className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black transition-all ${isDark ? 'bg-indigo-600 text-white' : 'bg-yellow-400 text-yellow-900'}`}
                                >
                                    {isDark ? <><Moon size={12} /> GELAP</> : <><Sun size={12} /> TERANG</>}
                                </button>
                            </div>
                            <button
                                onClick={resetWorkspace}
                                className="w-full py-3 bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-xl transition-all text-[10px] font-black uppercase tracking-[0.1em] border border-slate-200"
                            >
                                Bersihkan Papan
                            </button>
                        </div>
                    </aside>

                    {/* WORKSPACE AREA */}
                    <section className={`flex-1 relative overflow-hidden transition-all duration-700 ${viewMode === 'hardware' ? 'bg-slate-900' : 'bg-slate-100'}`}>

                        {/* LIVE MINI MONITOR */}
                        {viewMode === 'software' && (
                            <div className="absolute top-8 right-8 z-20 flex flex-col gap-4 pointer-events-none">
                                <div className="bg-white/90 backdrop-blur shadow-2xl p-5 rounded-[2rem] border-2 border-slate-200 flex flex-col items-center gap-4 min-w-[120px]">
                                    <div className="flex items-center gap-2 px-2 py-0.5 bg-slate-100 rounded-full">
                                        <Activity size={10} className="text-indigo-600" />
                                        <span className="text-[9px] font-black text-slate-500 uppercase">Live Output</span>
                                    </div>

                                    <div className="flex flex-col items-center gap-1">
                                        <div className={`w-10 h-10 rounded-full transition-all duration-500 ${ledStatus ? 'bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.6)]' : 'bg-slate-200 shadow-inner'}`}></div>
                                        <span className="text-[8px] font-black text-slate-400">LED</span>
                                    </div>

                                    <div className="flex flex-col items-center gap-1">
                                        <div className={`w-10 h-10 rounded-lg transition-all duration-300 flex items-center justify-center ${buzzerStatus ? 'bg-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.6)] animate-pulse' : 'bg-slate-200'}`}>
                                            <Volume2 size={16} className={buzzerStatus ? 'text-white' : 'text-slate-400'} />
                                        </div>
                                        <span className="text-[8px] font-black text-slate-400">BUZZER</span>
                                    </div>
                                </div>

                                {isRunning && (
                                    <div className="bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl border border-white/20 flex flex-col gap-1 items-center">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-red-500 animate-ping"></div>
                                            <span className="text-[10px] font-black tracking-widest uppercase">Running</span>
                                        </div>
                                        {currentLoopCount > 0 && <span className="text-[9px] font-bold text-pink-400 uppercase italic tracking-tighter">Loop: {currentLoopCount} / 5</span>}
                                    </div>
                                )}
                            </div>
                        )}

                        {viewMode === 'software' && (
                            <div className="h-full w-full overflow-auto p-12 flex justify-center">
                                <div className="w-full max-w-lg min-h-fit bg-white border-2 border-slate-200 rounded-[3.5rem] p-12 shadow-2xl relative mb-20 self-start">
                                    <div className="absolute top-10 left-1/2 -translate-x-1/2 w-32 h-2 bg-slate-100 rounded-full"></div>

                                    <div className="mt-10 space-y-1">
                                        {workspace.map((block, idx) => renderBlock(block, `ws-${idx}-${block.id}`, idx))}
                                    </div>

                                    {workspace.length === 1 && (
                                        <div className="mt-20 text-center p-16 border-4 border-dashed border-slate-100 rounded-[3rem] bg-slate-50/50">
                                            <p className="text-slate-300 text-sm font-black uppercase tracking-[0.2em] leading-loose">
                                                Tambahkan blok perintah<br />untuk memulai simulasi
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {viewMode === 'hardware' && (
                            <div className="h-full flex flex-col items-center justify-center relative">
                                <div className={`absolute inset-0 transition-opacity duration-1000 ${isDark ? 'bg-indigo-950/60 opacity-100' : 'bg-transparent opacity-0 pointer-events-none'}`}></div>

                                <div className="flex gap-16 items-center z-10 scale-110">
                                    <div className="flex flex-col items-center gap-6">
                                        <div className="relative">
                                            <div className={`w-40 h-40 rounded-full blur-[80px] transition-all duration-700 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${ledStatus ? 'bg-green-400 opacity-50 scale-150' : 'bg-transparent opacity-0'}`}></div>
                                            <div className="relative bg-slate-800 border-[8px] border-slate-700 p-10 rounded-[4rem] shadow-2xl flex flex-col items-center">
                                                <div className={`w-16 h-24 rounded-t-full border-t-2 border-x-2 transition-all duration-500 ${ledStatus ? 'bg-green-500 border-green-300 shadow-[0_0_60px_rgba(34,197,94,1)]' : 'bg-slate-700 border-slate-600'}`}></div>
                                                <div className="w-20 h-6 bg-slate-600 rounded-md -mt-1 shadow-inner"></div>
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-black text-slate-400 tracking-[0.3em] uppercase">LED Module</span>
                                    </div>

                                    <div className="flex flex-col items-center gap-6">
                                        <div className="relative">
                                            {buzzerStatus && (
                                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                                    <div className="w-32 h-32 border-2 border-purple-500/30 rounded-full animate-ping"></div>
                                                </div>
                                            )}
                                            <div className={`relative bg-slate-800 border-[8px] border-slate-700 p-10 rounded-full shadow-2xl flex items-center justify-center transition-transform ${buzzerStatus ? 'animate-[bounce_0.2s_infinite]' : ''}`}>
                                                <div className="w-24 h-24 bg-slate-900 rounded-full border-4 border-slate-700 flex items-center justify-center shadow-inner">
                                                    <div className="w-8 h-8 bg-slate-800 rounded-full border-2 border-slate-700"></div>
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-black text-slate-400 tracking-[0.3em] uppercase">Buzzer</span>
                                    </div>
                                </div>

                                <div className="mt-20 flex gap-8 z-10">
                                    <div className={`px-8 py-3 rounded-2xl text-[10px] font-black tracking-widest shadow-xl border-2 transition-all ${ledStatus ? 'bg-green-600 border-green-400 text-white' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>
                                        LED: {ledStatus ? 'ON' : 'OFF'}
                                    </div>
                                    <div className={`px-8 py-3 rounded-2xl text-[10px] font-black tracking-widest shadow-xl border-2 transition-all ${buzzerStatus ? 'bg-purple-600 border-purple-400 text-white' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>
                                        ALARM: {buzzerStatus ? 'ON' : 'OFF'}
                                    </div>
                                </div>
                            </div>
                        )}

                    </section>
                </div>
            </main>

            {/* FOOTER BAR */}
            <footer className="bg-white border-t border-slate-200 px-8 py-3 flex items-center justify-between z-40">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`}></div>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Informatika Sim-Engine v4.2</span>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3 bg-slate-50 px-4 py-1.5 rounded-full border border-slate-200">
                        <ZoomIn size={12} className="text-slate-400" />
                        <input
                            type="range" min="60" max="140" value={zoomLevel}
                            onChange={(e) => setZoomLevel(e.target.value)}
                            className="w-24 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                        />
                        <span className="text-[10px] font-mono text-slate-400 w-8">{zoomLevel}%</span>
                    </div>
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] italic underline underline-offset-4 decoration-indigo-200">Audio Enabled Engine</p>
                </div>
            </footer>

            {/* BANTUAN TRIGGER - Bottom Right */}
            <button
                onClick={() => setIsDrawerOpen(true)}
                className="fixed bottom-24 right-8 px-4 py-3 bg-indigo-600 text-white rounded-2xl shadow-2xl flex items-center gap-2 hover:scale-105 active:scale-95 transition-all z-50 text-xs font-black uppercase tracking-wider"
            >
                <Lightbulb size={16} /> Panduan Blok
            </button>

            {/* DRAWER BANTUAN - From Right */}
            <div className={`fixed inset-y-0 right-0 w-[380px] bg-white shadow-2xl z-[60] transform transition-transform duration-500 ease-out border-l border-slate-200 ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="h-full flex flex-col">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-indigo-50">
                        <div>
                            <h2 className="font-black text-lg text-slate-800 uppercase tracking-tight">Panduan Blok</h2>
                            <p className="text-[10px] text-slate-500 font-bold">Penjelasan setiap blok perintah</p>
                        </div>
                        <button onClick={() => setIsDrawerOpen(false)} className="p-2 hover:bg-white rounded-xl transition-colors"><X size={20} /></button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {/* Control Blocks */}
                        <div className="bg-pink-50 p-4 rounded-xl border border-pink-100">
                            <h4 className="text-[10px] font-black text-pink-600 uppercase tracking-widest mb-3 flex items-center gap-2"><Layers size={12} /> Kontrol Alur</h4>
                            <div className="space-y-2 text-xs text-slate-600">
                                <p><b className="text-pink-500">Ulangi 5 Kali:</b> Menjalankan blok di bawahnya sebanyak 5 kali.</p>
                                <p><b className="text-pink-600">Selamanya:</b> Menjalankan blok di bawahnya tanpa berhenti (loop tak terbatas).</p>
                            </div>
                        </div>

                        {/* Logic Blocks */}
                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                            <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-3 flex items-center gap-2"><Zap size={12} /> Logika Sensor</h4>
                            <div className="space-y-2 text-xs text-slate-600">
                                <p><b className="text-blue-500">Jika Lampu Mati:</b> Cek apakah LED sedang OFF. Jika ya, jalankan blok selanjutnya.</p>
                                <p><b className="text-indigo-500">Jika Gelap:</b> Cek environment. Gunakan tombol Terang/Gelap di sidebar untuk mengubahnya.</p>
                            </div>
                        </div>

                        {/* Action Blocks */}
                        <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                            <h4 className="text-[10px] font-black text-green-600 uppercase tracking-widest mb-3 flex items-center gap-2"><Cpu size={12} /> Aksi Output</h4>
                            <div className="space-y-2 text-xs text-slate-600">
                                <p><b className="text-green-500">Nyalakan Lampu:</b> Mengubah status LED menjadi ON (hijau).</p>
                                <p><b className="text-red-500">Matikan Lampu:</b> Mengubah status LED menjadi OFF.</p>
                                <p><b className="text-purple-500">Bunyi Buzzer:</b> Membunyikan alarm (ada suara nyata!).</p>
                                <p><b className="text-slate-500">Diam:</b> Mematikan buzzer.</p>
                                <p><b className="text-orange-500">Tunggu 1 Detik:</b> Jeda eksekusi selama 1 detik.</p>
                            </div>
                        </div>

                        {/* Audio Info */}
                        <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                            <h4 className="text-[10px] font-black text-purple-500 uppercase tracking-widest mb-2 flex items-center gap-2"><Volume2 size={12} /> Info Suara</h4>
                            <p className="text-xs leading-relaxed text-purple-700">Buzzer memiliki suara nyata! Pastikan volume perangkat Anda aktif untuk mendengar efek 'pip'.</p>
                        </div>
                    </div>

                    <div className="p-6 border-t border-slate-100">
                        <button onClick={() => setIsDrawerOpen(false)} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-colors">Tutup Panduan</button>
                    </div>
                </div>
            </div>

            {isDrawerOpen && <div onClick={() => setIsDrawerOpen(false)} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50"></div>}
        </div>
    );
};

export default Blockly;