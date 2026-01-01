import React, { useState, useEffect } from 'react';
import {
  Play, RotateCcw, ArrowUp, RotateCw, RotateCcw as RotateLeft,
  Repeat, Trash2, CheckCircle2, Flag, Bot,
  Trophy, Star, ChevronRight, Split, GitBranch,
  Layers, Zap, Target, Navigation, Info, BookOpen, X, Sparkles,
  Cpu, Code2, AlertCircle, Lightbulb, Rocket, Compass
} from 'lucide-react';
import BlocklyRocket from './BlocklyRocket';

const Blockly = () => {
  const [gameMode, setGameMode] = useState(null); // 'maze' or 'bird'

  const levels = [
    { id: 1, name: "Garis Lurus", maze: [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [1, 1, 1, 1, 1], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]], start: { x: 0, y: 2, dir: 0 }, target: { x: 4, y: 2 }, hint: "Bantu robot maju. Gunakan 'Ulangi sampai' agar efisien!" },
    { id: 2, name: "Belokan Pertama", maze: [[0, 0, 0, 0, 0], [0, 0, 1, 1, 1], [0, 0, 1, 0, 0], [1, 1, 1, 0, 0], [0, 0, 0, 0, 0]], start: { x: 0, y: 3, dir: 0 }, target: { x: 4, y: 1 }, hint: "Belokkan robot sebelum menabrak dinding!" },
    { id: 3, name: "Tangga Logika", maze: [[0, 0, 0, 1, 1], [0, 0, 1, 1, 0], [0, 1, 1, 0, 0], [1, 1, 0, 0, 0], [0, 0, 0, 0, 0]], start: { x: 0, y: 3, dir: 0 }, target: { x: 4, y: 0 }, hint: "Ada pola tangga. Gunakan perulangan!" },
    { id: 4, name: "Sensor Dasar", maze: [[0, 0, 1, 1, 1], [0, 0, 1, 0, 0], [1, 1, 1, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]], start: { x: 0, y: 2, dir: 0 }, target: { x: 4, y: 0 }, hint: "Pakai blok 'Jika ada jalan' untuk mendeteksi belokan." },
    { id: 5, name: "Labirin U", maze: [[1, 1, 1, 1, 1], [1, 0, 0, 0, 1], [1, 0, 1, 0, 1], [1, 0, 1, 0, 1], [1, 1, 1, 0, 0]], start: { x: 2, y: 2, dir: 3 }, target: { x: 0, y: 4 }, hint: "Kombinasikan Jika dan Belok!" },
    { id: 6, name: "Zig-Zag Menengah", maze: [[1, 1, 0, 0, 0], [0, 1, 1, 0, 0], [0, 0, 1, 1, 0], [0, 0, 0, 1, 1], [0, 0, 0, 0, 1]], start: { x: 0, y: 0, dir: 1 }, target: { x: 4, y: 4 }, hint: "Gunakan logika If di dalam Repeat." },
    { id: 7, name: "Persimpangan T", maze: [[1, 1, 1, 1, 1], [0, 0, 1, 0, 0], [0, 0, 1, 0, 0], [0, 0, 1, 0, 0], [0, 0, 1, 0, 0]], start: { x: 2, y: 4, dir: 3 }, target: { x: 0, y: 0 }, hint: "Kapan robot harus berhenti maju dan mulai belok?" },
    { id: 8, name: "Algoritma Efisien", maze: [[1, 0, 0, 0, 0], [1, 1, 1, 1, 1], [0, 0, 0, 0, 1], [1, 1, 1, 1, 1], [1, 0, 0, 0, 0]], start: { x: 0, y: 4, dir: 3 }, target: { x: 0, y: 0 }, hint: "Gunakan 'Jika... lainnya' untuk jalur buntu." },
    { id: 9, name: "Pencarian Jejak", maze: [[1, 1, 1, 0, 0], [1, 0, 1, 0, 0], [1, 1, 1, 1, 1], [0, 0, 1, 0, 1], [0, 0, 1, 1, 1]], start: { x: 4, y: 4, dir: 2 }, target: { x: 0, y: 0 }, hint: "Hati-hati, jalur ini cukup menjebak!" },
    { id: 10, name: "The Grand Master", maze: [[1, 1, 1, 1, 1], [1, 0, 0, 0, 1], [1, 1, 1, 1, 1], [0, 0, 0, 0, 1], [1, 1, 1, 1, 1]], start: { x: 0, y: 4, dir: 0 }, target: { x: 0, y: 0 }, hint: "Level terakhir! Gabungkan Repeat, If, and Else." }
  ];

  const [currentLevelIdx, setCurrentLevelIdx] = useState(() => {
    const saved = localStorage.getItem('blockly_level');
    return saved ? parseInt(saved, 10) : 0;
  });
  const currentLevel = levels[currentLevelIdx];
  const [robotPos, setRobotPos] = useState(currentLevel.start);
  const [program, setProgram] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState(currentLevel.hint);
  const [score, setScore] = useState(() => {
    const savedScore = localStorage.getItem('blockly_score');
    return savedScore ? parseInt(savedScore, 10) : 0;
  });

  const availableBlocks = [
    { id: 'move', label: 'gerak maju', subLabel: 'move()', icon: <ArrowUp size={20} />, color: 'from-purple-600 to-purple-700 shadow-[0_4px_0_#6b21a8]' },
    { id: 'turnLeft', label: 'belok kiri', subLabel: 'turnLeft()', icon: <RotateLeft size={20} />, color: 'from-purple-600 to-purple-700 shadow-[0_4px_0_#6b21a8]' },
    { id: 'turnRight', label: 'belok kanan', subLabel: 'turnRight()', icon: <RotateCw size={20} />, color: 'from-purple-600 to-purple-700 shadow-[0_4px_0_#6b21a8]' },
    { id: 'repeatUntil', label: 'ulangi sampai', subLabel: 'repeat(goal)', icon: <Repeat size={20} />, color: 'from-emerald-500 to-emerald-600 shadow-[0_4px_0_#059669]' },
    { id: 'ifPathAhead', label: 'jika jalan di depan', subLabel: 'if(path)', icon: <Split size={20} />, color: 'from-blue-500 to-blue-600 shadow-[0_4px_0_#2563eb]' },
    { id: 'ifElsePath', label: 'jika jalan... lainnya...', subLabel: 'if(path) else', icon: <GitBranch size={20} />, color: 'from-blue-500 to-blue-600 shadow-[0_4px_0_#2563eb]' },
  ];

  useEffect(() => {
    resetSim();
    setProgram([]);
    localStorage.setItem('blockly_level', currentLevelIdx.toString());
    localStorage.setItem('blockly_score', score.toString());
  }, [currentLevelIdx, score]);

  const resetProgress = () => {
    if (window.confirm('Yakin ingin mereset progress? Semua level dan skor akan kembali ke awal.')) {
      localStorage.removeItem('blockly_level');
      localStorage.removeItem('blockly_score');
      setCurrentLevelIdx(0);
      setScore(0);
      window.location.reload();
    }
  };

  const addBlock = (blockId) => {
    if (isRunning) return;
    const block = availableBlocks.find(b => b.id === blockId);
    setProgram([...program, { ...block, instanceId: Date.now() }]);
  };

  const removeBlock = (index) => {
    if (isRunning) return;
    const newProgram = [...program];
    newProgram.splice(index, 1);
    setProgram(newProgram);
  };

  const resetSim = () => {
    setRobotPos(currentLevel.start);
    setIsRunning(false);
    setCurrentStep(-1);
    setStatus('idle');
    setMessage(currentLevel.hint);
  };

  const checkPath = (pos, direction) => {
    let checkX = pos.x; let checkY = pos.y;
    if (direction === 0) checkX++; else if (direction === 1) checkY++; else if (direction === 2) checkX--; else if (direction === 3) checkY--;
    if (checkX < 0 || checkX >= 5 || checkY < 0 || checkY >= 5) return false;
    return currentLevel.maze[checkY][checkX] === 1;
  };

  const runProgram = async () => {
    if (program.length === 0 || isRunning) return;
    setIsRunning(true); setStatus('running');
    let currentRobot = { ...currentLevel.start };
    const hasLoop = program.some(b => b.id === 'repeatUntil');
    let iterations = 0;
    while (iterations < 80) {
      iterations++;
      for (let i = 0; i < program.length; i++) {
        if (program[i].id === 'repeatUntil') continue;
        setCurrentStep(i); const block = program[i];
        if (block.id === 'ifElsePath') {
          if (!checkPath(currentRobot, currentRobot.dir)) { i += 1; continue; }
        }
        if (block.id === 'ifPathAhead') {
          if (!checkPath(currentRobot, currentRobot.dir)) { i++; continue; }
        }
        await new Promise(r => setTimeout(r, 400));
        let nextX = currentRobot.x; let nextY = currentRobot.y;
        if (block.id === 'move') {
          if (currentRobot.dir === 0) nextX++; else if (currentRobot.dir === 1) nextY++; else if (currentRobot.dir === 2) nextX--; else if (currentRobot.dir === 3) nextY--;
          if (nextX < 0 || nextX >= 5 || nextY < 0 || nextY >= 5 || currentLevel.maze[nextY][nextX] === 0) {
            setStatus('crash'); setMessage("Robot menabrak tembok!"); setIsRunning(false); return;
          }
          currentRobot.x = nextX; currentRobot.y = nextY;
        } else if (block.id === 'turnRight') currentRobot.dir = (currentRobot.dir + 1) % 4;
        else if (block.id === 'turnLeft') currentRobot.dir = (currentRobot.dir + 3) % 4;
        setRobotPos({ ...currentRobot });
        if (currentRobot.x === currentLevel.target.x && currentRobot.y === currentLevel.target.y) {
          setStatus('success'); const levelScore = Math.max(10, 100 - (program.length * 5));
          setScore(prev => prev + levelScore); setMessage(`Sukses! +${levelScore} Poin.`);
          setIsRunning(false); return;
        }
      }
      if (!hasLoop) break;
    }
    setIsRunning(false);
  };



  if (gameMode === 'bird') {
    return <BlocklyRocket onBack={() => setGameMode(null)} />;
  }

  // MISSION SELECTOR SCREEN
  if (!gameMode) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-[#0b1021] flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
        <div className="absolute top-0 inset-x-0 h-96 bg-indigo-600/20 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="max-w-4xl w-full z-10">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter mb-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
              PILIH MISI
            </h1>
            <p className="text-slate-400 font-bold text-lg uppercase tracking-widest">Space Academy v2.0</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 px-4">
            {/* MISSION 1: MAZE */}
            <button
              onClick={() => setGameMode('maze')}
              className="group relative bg-slate-800/50 backdrop-blur-md border-2 border-slate-700 hover:border-cyan-400 rounded-3xl p-8 transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(34,211,238,0.2)] text-left"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl"></div>
              <div className="bg-cyan-900/30 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 border border-cyan-500/30 group-hover:bg-cyan-500 group-hover:text-white transition-colors">
                <Bot size={32} className="text-cyan-400 group-hover:text-white" />
              </div>
              <h3 className="text-2xl font-black text-white italic mb-2">MISI 1: MAZE RUNNER</h3>
              <p className="text-slate-400 text-sm font-medium mb-6 leading-relaxed">
                Pandu robot melewanti labirin menggunakan logika dasar: langkah, belokan, dan loop.
              </p>
              <div className="inline-flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-widest bg-cyan-900/30 px-3 py-1 rounded-lg border border-cyan-500/20">
                <Cpu size={14} /> Logic Grid
              </div>
            </button>

            {/* MISSION 2: FLIGHT */}
            <button
              onClick={() => setGameMode('bird')}
              className="group relative bg-slate-800/50 backdrop-blur-md border-2 border-slate-700 hover:border-purple-400 rounded-3xl p-8 transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(168,85,247,0.2)] text-left"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl"></div>
              <div className="bg-purple-900/30 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 border border-purple-500/30 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                <Compass size={32} className="text-purple-400 group-hover:text-white" />
              </div>
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-black text-white italic mb-2">MISI 2: SPACE FLIGHT</h3>
                <span className="bg-amber-500 text-black text-[10px] font-bold px-2 py-0.5 rounded uppercase">Baru</span>
              </div>
              <p className="text-slate-400 text-sm font-medium mb-6 leading-relaxed">
                Terbangkan pesawat menggunakan sudut navigasi dan koordinat. Awas asteroid!
              </p>
              <div className="inline-flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-widest bg-purple-900/30 px-3 py-1 rounded-lg border border-purple-500/20">
                <Navigation size={14} /> Angular Logic
              </div>
            </button>
          </div>

          <div className="mt-12 text-center">
            <p className="text-slate-600 text-xs font-bold uppercase tracking-widest">Pilih misi untuk memulai pelatihan</p>
          </div>
        </div>
      </div>
    );
  }

  return (

    <div className="flex flex-col h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-900 via-[#0b1021] to-[#1a1625] font-sans text-slate-200 overflow-hidden relative selection:bg-cyan-500/30">

      {/* SUCCESS MODAL OVERLAY */}
      {status === 'success' && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-gradient-to-b from-slate-800 to-indigo-900 border-2 border-indigo-500/50 p-8 rounded-[2rem] shadow-2xl flex flex-col items-center text-center max-w-sm w-full relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 inset-x-0 h-32 bg-indigo-500/20 blur-3xl rounded-full -mt-16 pointer-events-none"></div>

            <div className="mb-4 relative">
              <div className="absolute inset-0 animate-ping bg-amber-400 rounded-full opacity-20"></div>
              <Trophy size={64} className="text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)] relative z-10" />
            </div>

            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-2 drop-shadow-md">
              Mission Complete!
            </h2>
            <p className="text-indigo-200 font-medium mb-6">
              Hebat! Algoritamu berhasil membawa robot ke tujuan.
            </p>

            <div className="bg-black/30 rounded-xl p-4 w-full mb-6 border border-white/10">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs uppercase font-bold text-slate-400">Score Earned</span>
                <span className="font-mono font-black text-amber-400 text-xl">+{Math.max(10, 100 - (program.length * 5))}</span>
              </div>
              <div className="w-full bg-slate-700/50 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-400 h-full w-[80%]"></div>
              </div>
            </div>

            {currentLevelIdx < levels.length - 1 ? (
              <button
                onClick={() => setCurrentLevelIdx(prev => prev + 1)}
                className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl font-black text-white text-lg hover:scale-[1.02] active:scale-95 transition-all shadow-lg border-b-4 border-emerald-800 uppercase tracking-widest flex items-center justify-center gap-2 group"
              >
                Level Selanjutnya <ChevronRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <div className="p-4 bg-indigo-500/20 border border-indigo-500/30 rounded-xl text-indigo-200 text-sm font-bold">
                🎉 Selamat! Kamu telah menamatkan semua level!
              </div>
            )}
          </div>
        </div>
      )}

      {/* Game Status Bar */}
      <div className="h-20 bg-slate-900/80 backdrop-blur-md border-b border-indigo-500/20 px-4 md:px-8 flex justify-between items-center z-50 flex-shrink-0 shadow-lg">
        <div className="flex items-center gap-4 md:gap-6">
          <div className="bg-indigo-600 p-2.5 rounded-xl shadow-lg border border-indigo-400/30 hidden md:block">
            <Cpu size={24} className="text-white" />
          </div>
          <div>
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-0.5 block">Current Mission</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-white italic tracking-tighter shadow-black drop-shadow-sm">LEVEL {currentLevel.id}</span>
              <span className="text-slate-400 font-bold uppercase hidden md:inline-block border-l border-slate-700 pl-2 ml-2">{currentLevel.name}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 md:gap-6">
          <div className="flex flex-col items-end mr-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Score</span>
            <div className="flex items-center gap-2">
              <Trophy size={18} className="text-amber-500" />
              <span className="font-mono font-black text-2xl text-white tracking-tight">{score}</span>
            </div>
          </div>

          <button onClick={resetProgress} className="p-3 bg-rose-900/40 hover:bg-rose-900/60 text-rose-400 border border-rose-800/50 rounded-xl transition-all shadow-sm active:scale-95" title="Reset Semua Progress">
            <Trash2 size={20} />
          </button>
          <div className="w-px h-8 bg-white/10 mx-2"></div>
          <button onClick={resetSim} className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-600 rounded-xl transition-all shadow-sm active:scale-95" title="Reset Level Ini">
            <RotateCcw size={20} />
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden p-3 md:p-6 gap-6 relative">

        {/* Background Grid Pattern */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>

        {/* LEFT COLUMN: GAME PREVIEW & CONTROLS */}
        <section className="order-1 lg:order-2 flex-none lg:flex-1 flex flex-col gap-4 min-h-[400px] lg:min-h-0 z-10">
          <div className="flex-1 bg-slate-800/40 backdrop-blur-xl rounded-[2.5rem] border border-white/10 p-4 md:p-6 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl ring-1 ring-white/5 group">

            {/* Environment Decor */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] -ml-32 -mb-32 pointer-events-none"></div>

            <div className="absolute top-4 left-6 flex items-center gap-2 opacity-60">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
              <span className="text-xs font-bold uppercase tracking-widest text-slate-300">Live Simulation</span>
            </div>

            <div className="w-full max-w-[280px] md:max-w-[320px] aspect-square p-2 relative">
              <div className="absolute inset-0 bg-indigo-500/5 rounded-[2.5rem] transform rotate-3 scale-95 opacity-50"></div>
              <div className="grid grid-cols-5 grid-rows-5 gap-2 md:gap-3 bg-slate-900/90 p-3 md:p-4 rounded-[2rem] shadow-2xl ring-1 ring-white/10 w-full h-full relative z-10">
                {currentLevel.maze.map((row, y) => row.map((cell, x) => {
                  const isTarget = x === currentLevel.target.x && y === currentLevel.target.y;
                  const isRobot = robotPos.x === x && robotPos.y === y;
                  return (
                    <div key={`${x}-${y}`} className={`relative rounded-xl transition-all duration-300 aspect-square flex items-center justify-center ${cell === 1
                      ? 'bg-slate-700/50 shadow-inner border border-white/5'
                      : 'bg-slate-950/50 border border-transparent'
                      }`}>
                      {/* Grid Lines for Path */}
                      {cell === 1 && <div className="absolute inset-2 border border-white/5 rounded-lg opacity-30"></div>}

                      {isTarget && (
                        <div className="relative w-full h-full flex items-center justify-center">
                          <div className="absolute inset-0 bg-red-500/20 blur-md rounded-full animate-pulse"></div>
                          <Target size={24} className="text-red-400 relative z-10 drop-shadow-[0_0_8px_rgba(248,113,113,0.8)] md:w-7 md:h-7" strokeWidth={2.5} />
                        </div>
                      )}

                      {isRobot && (
                        <div className="absolute z-20 transition-all duration-500 ease-spring" style={{ transform: `rotate(${robotPos.dir * 90}deg)` }}>
                          <div className="relative">
                            <div className="absolute -inset-1 bg-cyan-400 blur-sm rounded-full opacity-40"></div>
                            <div className="text-3xl md:text-4xl filter drop-shadow-lg">🚀</div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }))}
              </div>
            </div>

            {/* Status Feedback */}
            <div className={`mt-4 px-5 py-2.5 rounded-2xl border flex items-center gap-3 font-bold text-[10px] md:text-xs uppercase tracking-widest transition-all duration-300 w-full max-w-[320px] shadow-lg flex-shrink-0 ${status === 'success' ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300' :
              status === 'crash' ? 'bg-rose-500/20 border-rose-500/50 text-rose-300 animate-shake' : 'bg-slate-900/50 border-white/10 text-slate-400'
              }`}>
              {status === 'crash' && <AlertCircle size={16} />}
              {status === 'success' && <CheckCircle2 size={16} />}
              {status === 'running' && <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>}
              <span className="truncate flex-1 text-center">{message}</span>
            </div>
          </div>

          {/* RUN BUTTON */}
          <button
            onClick={runProgram}
            disabled={isRunning || program.length === 0}
            className="h-16 w-full bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white rounded-2xl font-black text-sm md:text-base flex items-center justify-center gap-4 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] active:scale-[0.98] disabled:bg-none disabled:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all border-b-4 border-blue-900 uppercase tracking-[0.15em] relative overflow-hidden group z-10"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <Play size={24} fill="currentColor" className="group-hover:scale-110 transition-transform" />
            {isRunning ? 'SYSTEM RUNNING...' : 'EKSEKUSI PROGRAM'}
          </button>
        </section>

        {/* MIDDLE COLUMN: WORKSPACE */}
        <section className="order-2 lg:order-3 flex-none lg:flex-[1.4] flex flex-col md:flex-row gap-4 min-h-[500px] lg:min-h-0 z-10">

          {/* TOOLBOX */}
          <aside className="w-full md:w-48 bg-slate-800/60 backdrop-blur-xl rounded-v-xl md:rounded-[2rem] border border-white/10 flex flex-col overflow-hidden shadow-2xl flex-shrink-0">
            <div className="p-4 border-b border-white/5 bg-white/5 text-center">
              <h3 className="text-xs font-black text-cyan-400 uppercase tracking-widest">Command Center</h3>
            </div>
            <div className="flex-1 overflow-x-auto md:overflow-y-auto p-3 flex md:flex-col gap-3 custom-scrollbar">
              {availableBlocks.map(block => (
                <button
                  key={block.id}
                  onClick={() => addBlock(block.id)}
                  disabled={isRunning}
                  className={`min-w-[140px] md:min-w-0 w-full group relative overflow-hidden bg-gradient-to-br ${block.color} p-3 rounded-2xl border-2 border-white/10 hover:border-white/40 shadow-lg active:scale-95 transition-all text-left flex items-center gap-3 flex-shrink-0`}
                >
                  <div className="bg-black/20 p-2 rounded-lg group-hover:bg-black/10 transition-colors">
                    {block.icon}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] md:text-xs font-black text-white uppercase leading-tight tracking-wide drop-shadow-md">
                      {block.label}
                    </span>
                    <span className="text-[8px] md:text-[9px] font-mono text-white/70 normal-case opacity-0 group-hover:opacity-100 transition-opacity">
                      {block.subLabel}
                    </span>
                  </div>
                </button>
              ))}

              <div className="mt-4 p-3 bg-indigo-900/30 rounded-xl border border-indigo-500/30">
                <div className="flex items-center gap-2 mb-2 text-indigo-300">
                  <Lightbulb size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Mission Hint</span>
                </div>
                <p className="text-[11px] text-indigo-200 leading-relaxed font-medium">
                  {currentLevel.hint}
                </p>
              </div>
            </div>
          </aside>

          {/* CODE EDITOR WORKSPACE */}
          <aside className="flex-1 bg-slate-900/80 backdrop-blur-xl rounded-[2rem] border-2 border-white/10 flex flex-col overflow-hidden shadow-inner relative group">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] opacity-10 pointer-events-none"></div>

            <div className="p-4 border-b border-white/5 bg-white/[0.02] flex justify-between items-center relative z-10">
              <div>
                <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                  <Code2 size={16} className="text-purple-400" /> Main Algorithm
                </h3>
                <p className="text-[10px] text-slate-500 font-mono mt-1">{program.length} Blocks Used</p>
              </div>
              <button
                onClick={() => setProgram([])}
                className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-[10px] font-bold rounded-lg border border-rose-500/30 flex items-center gap-2 transition-all"
                title="Clear All"
              >
                <Trash2 size={14} /> Clear
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar relative z-10">
              {program.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-4 opacity-50">
                  <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center border-2 border-dashed border-slate-600">
                    <Bot size={32} />
                  </div>
                  <p className="text-xs font-bold uppercase tracking-widest">Drag commands here</p>
                </div>
              )}

              {program.map((block, idx) => {
                const isIndented = program.some((b, i) => b.id === 'repeatUntil' && i < idx) || (idx > 0 && (program[idx - 1].id === 'ifPathAhead' || program[idx - 1].id === 'ifElsePath'));
                const isActive = currentStep === idx;

                return (
                  <div key={block.instanceId} className="relative group/block animate-in slide-in-from-left-2 duration-300">
                    {/* Connector Line for Indentation */}
                    {isIndented && (
                      <div className="absolute left-[-12px] top-[-10px] bottom-6 w-4 border-l-2 border-b-2 border-slate-700/50 rounded-bl-xl pointer-events-none"></div>
                    )}

                    <div className={`
                        relative flex items-center gap-3 p-3 rounded-md shadow-sm transition-all duration-200
                        bg-gradient-to-r ${block.color} 
                        ${isActive ? 'ring-2 ring-white scale-[1.02] brightness-125 z-10' : 'opacity-90 hover:opacity-100 hover:translate-x-1'}
                      `} style={{ marginLeft: isIndented ? '24px' : '0' }}>

                      <div className="flex items-center justify-center w-6 h-6 bg-black/20 rounded-lg text-white/50 text-[10px] font-mono font-bold">
                        {idx + 1}
                      </div>

                      <div className="text-white/90">
                        {block.icon}
                      </div>

                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="font-bold text-xs text-white uppercase tracking-wide drop-shadow-md truncate">
                          {block.label}
                        </span>
                        <span className="text-[9px] font-mono text-white/80 normal-case truncate">
                          {block.subLabel}
                        </span>
                      </div>

                      <button
                        onClick={() => removeBlock(idx)}
                        className="opacity-0 group-hover/block:opacity-100 p-1.5 bg-black/20 hover:bg-black/40 rounded-lg text-white transition-all"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Spacer block to allow scrolling past bottom */}
              <div className="h-12"></div>
            </div>
          </aside>
        </section>

        {/* SECTION 3: RULES & SCORING (BOTTOM on Mobile) */}
        <section className="order-3 lg:order-1 flex-none lg:flex-[0.6] bg-[#0f1219]/60 backdrop-blur-md rounded-[2rem] border border-white/5 flex flex-col overflow-hidden shadow-2xl min-h-[250px] lg:min-h-0">
          <div className="p-4 border-b border-white/5 bg-blue-600/10 flex items-center gap-3">
            <BookOpen size={18} className="text-blue-400" />
            <h3 className="text-[10px] md:text-[11px] font-black text-white uppercase tracking-widest">Aturan Misi</h3>
          </div>

          <div className="flex-1 p-4 space-y-4 overflow-y-auto custom-scrollbar">
            <div className="bg-white/5 border border-white/10 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-2">
                <Trophy size={14} className="text-amber-400" />
                <span className="text-[9px] font-black text-white uppercase tracking-tighter">Sistem Penilaian:</span>
              </div>
              <ul className="text-slate-400 text-[9px] leading-relaxed font-medium list-disc ml-3 space-y-1">
                <li>Skor Maksimal: <b className="text-white">100 Poin</b>.</li>
                <li>Setiap blok mengurangi <b className="text-rose-400">-5 Poin</b>.</li>
                <li>Semakin sedikit blok, semakin tinggi nilaimu!</li>
              </ul>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb size={12} className="text-amber-400" />
                <span className="text-[9px] font-black text-white uppercase tracking-tighter">Tips:</span>
              </div>
              <p className="text-slate-400 text-[8px] font-bold italic leading-tight uppercase">
                Gunakan logika yang efisien untuk mendapatkan skor 100!
              </p>
            </div>
          </div>
        </section>

      </main>

      {/* Global Styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.1); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.3); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(99, 102, 241, 0.5); }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake { animation: shake 0.4s ease-in-out; }
      ` }} />
    </div>
  );
};

export default Blockly;