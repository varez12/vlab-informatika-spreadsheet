import React, { useState, useEffect, useRef } from 'react';
import {
    Play,
    RotateCcw,
    ChevronRight,
    ChevronLeft,
    CheckCircle2,
    AlertCircle,
    HelpCircle,
    Code2,
    Navigation,
    Building2,
    Trash2,
    Fuel,
    Info,
    X,
    MoreHorizontal,
    Rocket // NEW ICON
} from 'lucide-react';

// --- ASSETS & ICONS ---
// Replaced custom SVG with Lucide Rocket for consistent rotation
const PlaneIcon = Rocket; // Alias for easy swap

// --- LEVEL CONFIGURATION (INDONESIAN INSTRUCTIONS, ENGLISH CODE) ---
const levels = [
    {
        id: 1,
        title: "Level 1: Arah Dasar",
        desc: "Atur arah (heading) ke 0 untuk terbang ke Timur.",
        hint: "Gunakan `heading(0)`",
        start: { x: 20, y: 50 },
        goal: { x: 80, y: 50 },
        toolbox: ['Heading']
    },
    {
        id: 2,
        title: "Level 2: Belok Utara",
        desc: "Terbang ke Utara (Atas) untuk mencapai bandara.",
        hint: "Gunakan `heading(90)`",
        start: { x: 50, y: 80 },
        goal: { x: 50, y: 20 },
        toolbox: ['Heading']
    },
    {
        id: 3,
        title: "Level 3: Logika Dasar",
        desc: "Jika tidak ada bahan bakar, ambil dulu (Timur). JIKA SUDAH, terbang ke Utara.",
        hint: "Gunakan `if (no fuel) ... else ...`",
        start: { x: 20, y: 80 },
        goal: { x: 80, y: 20 },
        fuel: { x: 80, y: 80 },
        toolbox: ['Heading', 'IfElse']
    },
    {
        id: 4,
        title: "Level 4: Koordinat X",
        desc: "Terbang ke Timur sampai X > 80, lalu belok Selatan (270).",
        hint: "Cek `x < 80`",
        start: { x: 20, y: 20 },
        goal: { x: 80, y: 80 },
        toolbox: ['Heading', 'IfElse_X']
    },
    {
        id: 5,
        title: "Level 5: Koordinat Y",
        desc: "Turun ke bawah sampai Y < 80, lalu terbang Barat (180).",
        hint: "Cek `y < 80`",
        start: { x: 80, y: 20 },
        goal: { x: 20, y: 80 },
        toolbox: ['Heading', 'IfElse_Y']
    },
    {
        id: 6,
        title: "Level 6: Rute Mahir",
        desc: "Navigasi menggunakan berbagai titik jalur.",
        hint: "Gabungkan logika",
        start: { x: 10, y: 90 },
        goal: { x: 90, y: 10 },
        toolbox: ['Heading', 'IfElse_X', 'IfElse_Y']
    },
    {
        id: 7,
        title: "Level 7: Zig Zag",
        desc: "Terbang zig-zag menghindari zona bahaya.",
        hint: "Gunakan `if (y < 50)`",
        start: { x: 20, y: 80 },
        goal: { x: 80, y: 20 },
        toolbox: ['Heading', 'IfElse_Y']
    },
    {
        id: 8,
        title: "Level 8: Logika Ganda",
        desc: "Jika tidak ada bahan bakar, ambil (Barat). Jika X < 50, terbang Selatan.",
        hint: "Gabungkan `no fuel` dan `x`",
        start: { x: 80, y: 20 },
        goal: { x: 20, y: 80 },
        fuel: { x: 20, y: 20 },
        toolbox: ['Heading', 'IfElse', 'IfElse_X']
    },
    {
        id: 9,
        title: "Level 9: Koordinat & Bensin",
        desc: "Ambil bensin dulu! Hati-hati dengan batas Y.",
        hint: "Prioritas: Bensin -> Y",
        start: { x: 50, y: 50 },
        goal: { x: 90, y: 90 },
        fuel: { x: 10, y: 50 },
        toolbox: ['Heading', 'IfElse', 'IfElse_Y']
    },
    {
        id: 10,
        title: "Level 10: Pilot Handal",
        desc: "Ujian Akhir: Ambil bensin di (80,20) lalu mendarat di (20,80).",
        hint: "Gunakan `And` (x > 50 && no fuel)",
        start: { x: 20, y: 20 },
        goal: { x: 20, y: 80 },
        fuel: { x: 80, y: 20 },
        toolbox: ['Heading', 'IfElse_Complex'] // Special Block
    }
];

// ... imports ...

const BlocklyRocket = ({ onBack }) => {
    // --- STATE ---
    const [levelIdx, setLevelIdx] = useState(0);
    const [program, setProgram] = useState([]); // Dynamic Array instead of Slots!
    const [plane, setPlane] = useState({ x: 0, y: 0, heading: 0 });
    const [path, setPath] = useState([]); // Visual Trail
    const [hasFuel, setHasFuel] = useState(false);
    const [status, setStatus] = useState('idle'); // idle, running, success, crash
    const [message, setMessage] = useState("");
    const [activeBlockId, setActiveBlockId] = useState(null); // Highlighting

    const currentLevel = levels[levelIdx];

    // --- INIT ---
    // Reset Everything (including Code) when Level Changes
    useEffect(() => {
        setProgram([]); // Clear workspace ONLY on level change
        resetLevel();
    }, [levelIdx]);

    // Reset Game State (Plane, Fuel, Status) - Used for Retry/Reset
    const resetLevel = () => {
        setPlane({ ...currentLevel.start, heading: 0 });
        setPath([]); // Reset Trail
        setHasFuel(false);
        setStatus('idle');
        setMessage("");
        setActiveBlockId(null);
    };

    // --- INTERPRETER ENGINE ---
    useEffect(() => {
        let interval;
        // NOTE: We moved logic to the detailed simulation loop below using requestAnimationFrame
        return () => clearInterval(interval);
    }, [status]);

    // --- BETTER SIMULATION LOOP USING REF ---
    const stateRef = useRef({ plane: { x: 0, y: 0, heading: 0 }, hasFuel: false, trailTick: 0 });

    // Sync Ref with Level Start
    useEffect(() => {
        stateRef.current = { plane: { ...currentLevel.start, heading: 0 }, hasFuel: false, trailTick: 0 };
    }, [currentLevel, status]); // Reset on status change to idle

    useEffect(() => {
        let animFrame;

        const tick = () => {
            if (status !== 'running') return;

            // 1. GET CURRENT STATE
            const { plane: p, hasFuel: f, trailTick: t } = stateRef.current;
            let currentX = p.x;
            let currentY = p.y;
            let currentFuel = f;

            // 2. INTERPRETER (Determine Heading)
            let heading = 0; // Default

            // Basic Interpreter Strategy:
            // Scan blocks. Functional blocks modify the heading. 
            // Logic blocks choose which branch to take.

            // Note: Since our UI is linear list, "IfElse" needs internal data for "Then" and "Else" values
            // We'll store simple values in the block data

            if (program.length > 0) {
                // Execute blocks sequentially - Last one wins or logic prevails
                // Simplified for this prototype: We execute all, top to bottom.

                program.forEach(block => {
                    if (block.type === 'Heading') {
                        heading = block.value;
                    }
                    else if (block.type.startsWith('IfElse')) {
                        let conditionMet = false;

                        // EVAL CONDITION
                        if (block.condition === 'no_fuel') conditionMet = !currentFuel;
                        if (block.condition === 'x_lt_80') conditionMet = currentX < 80;
                        if (block.condition === 'y_lt_80') conditionMet = currentY < 80; // Y is < 80 (top is 0)
                        if (block.condition === 'x_lt_50') conditionMet = currentX < 50;
                        if (block.condition === 'y_lt_50') conditionMet = currentY < 50;

                        // COMPLEX (AND)
                        if (block.condition === 'x_gt_50_and_no_fuel') conditionMet = (currentX > 50 && !currentFuel);

                        // APPLY LOGIC
                        if (conditionMet) {
                            heading = block.thenValue;
                        } else {
                            heading = block.elseValue;
                        }
                    }
                });
            }

            // 3. PHYSICS
            const rad = (heading * Math.PI) / 180;
            const speed = 0.25; // SLOWER SPEED (0.25 vs 1.0)
            currentX += Math.cos(rad) * speed;
            currentY -= Math.sin(rad) * speed; // Y is inverted in Canvas

            // Update Trail (every 10 frames to save perf)
            if (t % 5 === 0) { // More frequent dots for slow speed
                setPath(prev => [...prev, { x: currentX, y: currentY }]);
            }

            // 4. COLLISIONS & EVENTS

            // Fuel
            if (currentLevel.fuel && !currentFuel) {
                const dx = currentX - currentLevel.fuel.x;
                const dy = currentY - currentLevel.fuel.y;
                if (Math.sqrt(dx * dx + dy * dy) < 5) {
                    currentFuel = true;
                }
            }

            // Walls
            if (currentX < 0 || currentX > 100 || currentY < 0 || currentY > 100) {
                setStatus('crash');
                setMessage("Pesawat lari dari radar!");
                return;
            }

            // Goal
            const distGoal = Math.sqrt(Math.pow(currentX - currentLevel.goal.x, 2) + Math.pow(currentY - currentLevel.goal.y, 2));
            if (distGoal < 5) {
                if (currentLevel.fuel && !currentFuel) {
                    setStatus('crash');
                    setMessage("Anda lupa mengisi bahan bakar!");
                    return;
                }
                setStatus('success');
                setMessage("Target Tercapai! Kerja bagus.");
                return;
            }

            // UPDATE REFS & STATE
            stateRef.current = { plane: { x: currentX, y: currentY, heading }, hasFuel: currentFuel, trailTick: t + 1 };
            setPlane({ x: currentX, y: currentY, heading });
            setHasFuel(currentFuel); // For UI render

            animFrame = requestAnimationFrame(tick);
        };

        if (status === 'running') {
            animFrame = requestAnimationFrame(tick);
        }
        return () => cancelAnimationFrame(animFrame);
    }, [status, program, currentLevel]);


    // --- HELPERS ---
    const addBlock = (type) => {
        const uid = Date.now() + Math.random();
        let newBlock = { uid, type };

        if (type === 'Heading') {
            newBlock.label = 'heading';
            newBlock.value = 0;
        } else if (type === 'IfElse') {
            newBlock.label = 'if (no fuel)';
            newBlock.condition = 'no_fuel';
            newBlock.thenValue = 0; // Default headings
            newBlock.elseValue = 0; // Default 0 (Player must set it)
        } else if (type === 'IfElse_X') {
            newBlock.label = 'if (x < 80)';
            newBlock.condition = 'x_lt_80';
            newBlock.thenValue = 0;
            newBlock.elseValue = 0;
        } else if (type === 'IfElse_Y') {
            newBlock.label = 'if (y < 80)';
            newBlock.condition = 'y_lt_80';
            newBlock.thenValue = 0;
            newBlock.elseValue = 0;
        } else if (type === 'IfElse_Complex') {
            newBlock.label = 'if (x > 50 and no fuel)';
            newBlock.condition = 'x_gt_50_and_no_fuel';
            newBlock.thenValue = 0;
            newBlock.elseValue = 0;
        }

        setProgram(prev => [...prev, newBlock]);
    };

    const updateBlock = (uid, field, val) => {
        setProgram(prev => prev.map(b => b.uid === uid ? { ...b, [field]: parseInt(val) } : b));
    };

    const removeBlock = (uid) => {
        setProgram(prev => prev.filter(b => b.uid !== uid));
    };

    const clearWorkspace = () => {
        setProgram([]);
        resetLevel();
    };

    // --- RENDER ---
    return (
        <div className="flex flex-col h-full w-full bg-slate-50 font-sans overflow-hidden absolute inset-0">
            {/* TOP BAR */}
            <div className="h-14 bg-white border-b flex items-center justify-between px-4 lg:px-6 shadow-sm shrink-0 z-20">
                <div className="flex items-center gap-3">
                    <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full text-slate-500"><ChevronLeft size={20} /></button>
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-2 rounded-lg text-white shadow-lg">
                        <Code2 size={18} />
                    </div>
                    <div className="hidden sm:block">
                        <h1 className="font-black text-slate-800 tracking-tight leading-none text-base">Blockly<span className="text-blue-600">Rocket</span></h1>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Kelas Koding</span>
                    </div>
                </div>

                <div className="flex gap-2">
                    {levels.map((l, i) => (
                        <button key={i}
                            onClick={() => setLevelIdx(i)}
                            className={`h-2 rounded-full transition-all ${i === levelIdx ? 'bg-blue-600 w-8' : 'bg-slate-300 w-2 hover:bg-slate-400'}`}
                            title={l.title}
                        />
                    ))}
                </div>
            </div>

            {/* MAIN CONTENT SPLIT */}
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">

                {/* LEFT: SIMULATION */}
                <div className="lg:w-[45%] w-full h-[45%] lg:h-full bg-slate-100 p-2 lg:p-4 flex flex-col gap-2 lg:gap-4 border-r border-slate-200 shrink-0">
                    {/* RADAR SCREEN */}
                    <div className="flex-1 bg-slate-900 rounded-2xl lg:rounded-3xl relative overflow-hidden shadow-2xl border-4 border-slate-800 ring-1 ring-white/20 group min-h-0">
                        {/* Grid & CRT Effect */}
                        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none"
                            style={{ backgroundImage: 'linear-gradient(#4f46e5 1px, transparent 1px), linear-gradient(90deg, #4f46e5 1px, transparent 1px)', backgroundSize: '10% 10%' }}
                        />
                        <div className="absolute inset-0 z-50 pointer-events-none bg-[radial-gradient(circle,transparent_50%,rgba(0,0,0,0.4)_120%)]" />

                        {/* GAME ENTITIES */}
                        <div className="absolute inset-0 z-10 text-white">
                            {/* GOAL (Airport) */}
                            <div className="absolute transition-all duration-500" style={{ left: `${currentLevel.goal.x}%`, top: `${currentLevel.goal.y}%`, transform: 'translate(-50%,-50%)' }}>
                                <div className="w-8 h-8 lg:w-12 lg:h-12 bg-blue-500/20 rounded-full animate-ping absolute inset-0" />
                                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-blue-600 rounded-xl border-2 border-white/50 shadow-[0_0_20px_#2563eb] flex items-center justify-center">
                                    <Building2 className="text-white w-4 h-4 lg:w-6 lg:h-6" />
                                </div>
                            </div>

                            {/* TRAIL */}
                            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-50 overflow-visible">
                                <polyline
                                    points={path.map(p => `${p.x} ${p.y}`).join(', ')}
                                />
                            </svg>
                            {path.map((p, i) => (
                                <div key={i} className="absolute w-1 h-1 bg-indigo-400 rounded-full" style={{ left: `${p.x}%`, top: `${p.y}%`, transform: 'translate(-50%,-50%)' }} />
                            ))}

                            {/* FUEL */}
                            {currentLevel.fuel && !hasFuel && (
                                <div className="absolute transition-all duration-500 animate-bounce" style={{ left: `${currentLevel.fuel.x}%`, top: `${currentLevel.fuel.y}%`, transform: 'translate(-50%,-50%)' }}>
                                    <div className="w-6 h-6 lg:w-8 lg:h-8 bg-amber-500 rounded-lg border-2 border-amber-200 shadow-xl flex items-center justify-center">
                                        <Fuel className="text-white w-3 h-3 lg:w-5 lg:h-5" />
                                    </div>
                                </div>
                            )}

                            {/* PLANE */}
                            <div className="absolute z-30"
                                style={{
                                    left: `${plane.x}%`,
                                    top: `${plane.y}%`,
                                    transform: `translate(-50%,-50%) rotate(${plane.heading}deg)`, // Apply Rotation
                                    transition: 'transform 0.1s linear' // Smooth rotation only
                                }}
                            >
                                <div className="relative">
                                    <div className="w-8 h-8 lg:w-10 lg:h-10 bg-indigo-600 rounded-lg shadow-2xl flex items-center justify-center border border-indigo-400">
                                        <PlaneIcon className="text-white w-4 h-4 lg:w-6 lg:h-6 transform -rotate-90" />
                                    </div>
                                    {/* Trail Effect on Plane itself? No, we have dots. */}
                                </div>
                            </div>
                        </div>

                        {/* HUD TOP LEFT */}
                        <div className="absolute top-2 left-2 lg:top-4 lg:left-4 z-40 space-y-2">
                            <div className="bg-black/40 backdrop-blur-sm border border-white/10 p-2 lg:p-3 rounded-xl text-[10px] lg:text-xs font-mono text-cyan-400 shadow-xl">
                                <div className="flex gap-2 lg:gap-4">
                                    <span>X: {Math.round(plane.x)}</span>
                                    <span>Y: {Math.round(plane.y)}</span>
                                </div>
                                <div className="h-px bg-white/10 my-1" />
                                <div className={`flex items-center gap-2 ${hasFuel ? 'text-green-400' : 'text-slate-500'}`}>
                                    <Fuel size={12} /> {hasFuel ? 'PENUH' : 'KOSONG'}
                                </div>
                            </div>
                        </div>

                        {/* LEVEL TITLE OVERLAY (When Idle) */}
                        {status === 'idle' && (
                            <div className="absolute top-4 right-4 z-40 bg-white/10 backdrop-blur px-3 py-1 rounded-full border border-white/20">
                                <span className="text-xs font-black text-white uppercase tracking-widest">{currentLevel.title}</span>
                            </div>
                        )}

                        {/* STATUS MESSAGE */}
                        {(status === 'crash' || status === 'success') && (
                            <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 lg:p-8 text-center animate-in zoom-in duration-300">
                                <div className="bg-slate-800 border-2 border-white/10 rounded-3xl p-6 lg:p-8 max-w-sm shadow-2xl">
                                    {status === 'success' ? (
                                        <>
                                            <div className="w-16 h-16 lg:w-20 lg:h-20 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-[0_0_30px_#22c55e]">
                                                <CheckCircle2 size={32} className="text-white" />
                                            </div>
                                            <h2 className="text-2xl lg:text-3xl font-black text-white italic tracking-tighter mb-2">MISI SUKSES!</h2>
                                            <p className="text-slate-400 mb-6 text-sm">{message}</p>
                                            <button onClick={() => setLevelIdx(prev => Math.min(prev + 1, levels.length - 1))} className="w-full py-3 lg:py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold tracking-widest shadow-lg transform active:scale-95 transition-all">
                                                LEVEL BERIKUTNYA
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <div className="w-16 h-16 lg:w-20 lg:h-20 bg-rose-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-[0_0_30px_#f43f5e]">
                                                <AlertCircle size={32} className="text-white" />
                                            </div>
                                            <h2 className="text-2xl lg:text-3xl font-black text-white italic tracking-tighter mb-2">MAYDAY! MAYDAY!</h2>
                                            <p className="text-slate-400 mb-6 text-sm">{message}</p>
                                            <button onClick={resetLevel} className="w-full py-3 lg:py-4 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold tracking-widest shadow-lg transform active:scale-95 transition-all">
                                                COBA LAGI
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* MISSION HINT (Removed from Overlay to prevent obstruction) */}
                        {/* No content here, moved below */}

                    </div>

                    {/* MISSION OBJECTIVE (Safe Zone) */}
                    <div className="bg-indigo-900/90 backdrop-blur border-l-4 border-indigo-500 p-3 rounded-r-xl shadow-lg shrink-0">
                        <h4 className="text-[10px] font-bold text-indigo-300 uppercase mb-1 flex items-center gap-2">
                            <Info size={12} /> Misi Saat Ini
                        </h4>
                        <p className="text-xs text-white leading-relaxed">{currentLevel.desc} <span className="opacity-50 font-mono ml-2 text-[10px] bg-black/20 px-1 rounded">{currentLevel.hint}</span></p>
                    </div>

                    {/* CONTROLS */}
                    <div className="flex gap-3 h-14 lg:h-16 shrink-0">
                        <button onClick={status === 'running' ? resetLevel : () => setStatus('running')}
                            className={`flex-[3] rounded-2xl font-black text-sm lg:text-lg tracking-widest shadow-lg flex items-center justify-center gap-2 transition-all 
                            ${status === 'running' ? 'bg-rose-100 text-rose-600 border-2 border-rose-200' : 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:brightness-110 active:scale-95'}`}>
                            {status === 'running' ? <><RotateCcw size={24} /> BATALKAN</> : <><Play fill="currentColor" size={24} /> JALANKAN</>}
                        </button>
                        <button onClick={clearWorkspace} className="flex-1 bg-slate-200 hover:bg-rose-100 hover:text-rose-600 text-slate-500 rounded-2xl flex items-center justify-center transition-all border-2 border-transparent hover:border-rose-200" title="Hapus Semua">
                            <Trash2 size={28} strokeWidth={2.5} />
                        </button>
                    </div>
                </div>

                {/* RIGHT: EDITOR */}
                <div className="lg:w-[55%] w-full h-[55%] lg:h-full flex flex-col bg-slate-50 relative shrink-0">
                    {/* TOOLBOX (Left Strip) */}
                    <div className="absolute left-0 top-0 bottom-0 w-24 lg:w-32 bg-slate-200 border-r border-slate-300 flex flex-col p-2 gap-2 overflow-y-auto z-10 shadow-inner">
                        <span className="text-[10px] font-bold text-slate-400 uppercase text-center mb-1">Alat</span>

                        {currentLevel.toolbox.includes('Heading') && (
                            <button onClick={() => addBlock('Heading')} className="bg-purple-600 text-white p-3 rounded-lg shadow-md text-[10px] lg:text-xs font-bold text-left hover:scale-105 transition-all active:scale-95 border-l-4 border-purple-800">
                                Heading...
                            </button>
                        )}
                        {currentLevel.toolbox.includes('IfElse') && (
                            <button onClick={() => addBlock('IfElse')} className="bg-blue-600 text-white p-3 rounded-lg shadow-md text-[10px] lg:text-xs font-bold text-left hover:scale-105 transition-all active:scale-95 border-l-4 border-blue-800">
                                if (no fuel)...
                            </button>
                        )}
                        {currentLevel.toolbox.includes('IfElse_X') && (
                            <button onClick={() => addBlock('IfElse_X')} className="bg-blue-600 text-white p-3 rounded-lg shadow-md text-[10px] lg:text-xs font-bold text-left hover:scale-105 transition-all active:scale-95 border-l-4 border-blue-800">
                                if (x &lt; 80)...
                            </button>
                        )}
                        {currentLevel.toolbox.includes('IfElse_Y') && (
                            <button onClick={() => addBlock('IfElse_Y')} className="bg-blue-600 text-white p-3 rounded-lg shadow-md text-[10px] lg:text-xs font-bold text-left hover:scale-105 transition-all active:scale-95 border-l-4 border-blue-800">
                                if (y &lt; 80)...
                            </button>
                        )}
                        {currentLevel.toolbox.includes('IfElse_Complex') && (
                            <button onClick={() => addBlock('IfElse_Complex')} className="bg-rose-600 text-white p-3 rounded-lg shadow-md text-[10px] lg:text-xs font-bold text-left hover:scale-105 transition-all active:scale-95 border-l-4 border-rose-800">
                                if (x &gt; 50 and no fuel)...
                            </button>
                        )}
                    </div>

                    {/* WORKSPACE (Main Area) */}
                    <div className="flex-1 ml-24 lg:ml-32 p-4 overflow-y-auto bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed">
                        {program.length === 0 ? (
                            <div className="h-full flex items-center justify-center opacity-30 flex-col gap-2">
                                <MoreHorizontal size={48} className="text-slate-400" />
                                <p className="font-bold text-slate-600 uppercase text-sm">Workspace Kosong</p>
                                <p className="text-xs text-slate-500">Tambah blok dari menu alat</p>
                            </div>
                        ) : (
                            <div className="space-y-1 pb-20">
                                {/* 0.5 gap for "Stack" feel */}
                                {program.map((block, i) => (
                                    <div key={block.uid} className={`relative group animate-in slide-in-from-left-4 duration-300`} style={{ zIndex: 100 - i }}>
                                        {/* BLOCK RENDER */}
                                        {block.type === 'Heading' ? (
                                            <div className="bg-purple-600 text-white p-3 lg:p-4 rounded-xl shadow-lg border-l-4 border-purple-800 flex items-center gap-2 max-w-full lg:w-72 relative">
                                                <span className="font-mono font-bold text-sm">heading</span>
                                                <input
                                                    type="number"
                                                    value={block.value}
                                                    onChange={(e) => updateBlock(block.uid, 'value', e.target.value)}
                                                    className="bg-purple-800/50 rounded px-2 w-16 text-right font-mono outline-none focus:ring-2 ring-white/50 py-1"
                                                />
                                                <span className="text-[10px] opacity-70">deg</span>

                                                {/* IN-BLOCK DELETE */}
                                                <button onClick={() => removeBlock(block.uid)} className="absolute right-2 top-1/2 -translate-y-1/2 text-white/20 hover:text-white hover:bg-white/20 p-1.5 rounded-full transition-all">
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="bg-blue-600 text-white rounded-xl shadow-lg border-l-4 border-blue-800 max-w-full lg:w-80 overflow-hidden flex flex-col relative">
                                                {/* IN-BLOCK DELETE */}
                                                <button onClick={() => removeBlock(block.uid)} className="absolute right-2 top-2 text-white/20 hover:text-white hover:bg-white/20 p-1.5 rounded-full transition-all z-10">
                                                    <X size={16} />
                                                </button>

                                                {/* Header */}
                                                <div className="p-3 flex items-center gap-2 bg-blue-700/50 border-b border-blue-500/30">
                                                    <span className="font-mono font-bold text-sm">{block.label}</span>
                                                </div>
                                                {/* Body */}
                                                <div className="p-3 space-y-3 bg-blue-600">
                                                    <div className="flex items-center gap-2 pl-2">
                                                        <span className="text-[10px] uppercase font-bold opacity-70 w-8">do</span>
                                                        <div className="bg-black/20 rounded-lg flex items-center px-2 py-1 flex-1">
                                                            <span className="text-[10px] mr-2 text-blue-200">heading</span>
                                                            <input
                                                                type="number"
                                                                value={block.thenValue}
                                                                onChange={(e) => updateBlock(block.uid, 'thenValue', e.target.value)}
                                                                className="bg-transparent text-white w-full text-right font-mono outline-none text-sm"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 pl-2">
                                                        <span className="text-[10px] uppercase font-bold opacity-70 w-8">else</span>
                                                        <div className="bg-black/20 rounded-lg flex items-center px-2 py-1 flex-1">
                                                            <span className="text-[10px] mr-2 text-blue-200">heading</span>
                                                            <input
                                                                type="number"
                                                                value={block.elseValue}
                                                                onChange={(e) => updateBlock(block.uid, 'elseValue', e.target.value)}
                                                                className="bg-transparent text-white w-full text-right font-mono outline-none text-sm"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlocklyRocket;
