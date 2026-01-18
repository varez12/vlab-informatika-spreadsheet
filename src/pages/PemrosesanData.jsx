import React, { useState, useEffect, useRef } from 'react';
import { Keyboard, Cpu, Monitor, Zap, ArrowRight, Play, RotateCcw, Activity, BookOpen, Trophy, Pause, FastForward, Rewind } from 'lucide-react';
import QuizMode, { cpuQuizQuestions } from '../components/QuizMode';

const PemrosesanData = () => {
    // State management
    const [inputText, setInputText] = useState("");
    const [outputText, setOutputText] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [activeKey, setActiveKey] = useState(null);
    const [processingStage, setProcessingStage] = useState('idle'); // idle, transport-input, processing, transport-output, done
    const [processDetail, setProcessDetail] = useState('char'); // char, ascii, binary
    const [currentData, setCurrentData] = useState({ char: '', ascii: '', binary: '' });
    const [showQuiz, setShowQuiz] = useState(false); // Quiz State

    // Animation Controls
    const [playbackSpeed, setPlaybackSpeed] = useState(1); // 0.5, 1, 2
    const [isPaused, setIsPaused] = useState(false);
    const [animationTime, setAnimationTime] = useState(0); // Progress of animation
    const requestRef = useRef();
    const startTimeRef = useRef();
    const [currentStep, setCurrentStep] = useState(0); // 0-4 for granular control

    // References for scrolling
    const monitorRef = useRef(null);

    // Keyboard layout (simplified)
    const keyboardRows = [
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
        ['Z', 'X', 'C', 'V', 'B', 'N', 'M', 'SPACE', 'BACKSPACE']
    ];

    // Helper: Convert char to binary
    const toBinary = (char) => {
        if (char === 'SPACE') return '00100000';
        return char.charCodeAt(0).toString(2).padStart(8, '0');
    };

    // Handle Input
    // Unified Animation Engine
    useEffect(() => {
        let timer;
        if (isProcessing && !isPaused) {
            // Speed Multiplier: 1 = Normal (2000ms total), 0.5 = Slow (4000ms), 2 = Fast (1000ms)
            const baseStepTime = 800 / playbackSpeed;

            // Step Logic
            const advanceStep = () => {
                setCurrentStep(prev => prev + 1);
            };

            // Stage 0: Transport Input (0ms) - Start
            if (currentStep === 0) {
                setProcessingStage('transport-input');
                timer = setTimeout(advanceStep, baseStepTime);
            }
            // Stage 1: Arrive at CPU (800ms)
            else if (currentStep === 1) {
                setProcessingStage('processing');
                setProcessDetail('char');
                setActiveKey(null);
                timer = setTimeout(advanceStep, 600 / playbackSpeed);
            }
            // Stage 2: To ASCII (1400ms)
            else if (currentStep === 2) {
                setProcessDetail('ascii');
                timer = setTimeout(advanceStep, 600 / playbackSpeed);
            }
            // Stage 3: To Binary (2000ms)
            else if (currentStep === 3) {
                setProcessDetail('binary');
                timer = setTimeout(advanceStep, 800 / playbackSpeed); // Processing Done
            }
            // Stage 4: Transport Output (2800ms)
            else if (currentStep === 4) {
                setProcessingStage('transport-output');
                timer = setTimeout(advanceStep, baseStepTime);
            }
            // Stage 5: Arrive at Monitor (3600ms) - Finish
            else if (currentStep === 5) {
                if (currentData.char === '⌫') { // Backspace
                    setOutputText(prev => prev.slice(0, -1));
                } else if (currentData.char === '␣') { // Space
                    setOutputText(prev => prev + ' ');
                } else {
                    setOutputText(prev => prev + currentData.char);
                }

                // Reset
                setProcessingStage('idle');
                setIsProcessing(false);
                setCurrentData({ char: '', binary: '' });
                setCurrentStep(0);
            }
        }
        return () => clearTimeout(timer);
    }, [isProcessing, isPaused, currentStep, playbackSpeed, currentData.char]);

    // Handle Input Trigger
    const handleInput = (key) => {
        if (isProcessing) return; // Block input

        setActiveKey(key);
        setIsProcessing(true);
        setIsPaused(false);
        setCurrentStep(0); // Start animation sequence

        // Prepare data immediately
        let charDisplay = key;
        let charCode = key;
        if (key === 'SPACE') {
            charDisplay = '␣';
            charCode = ' ';
        } else if (key === 'BACKSPACE') {
            charDisplay = '⌫';
            charCode = '';
        }

        setCurrentData({
            char: charDisplay,
            ascii: key === 'BACKSPACE' ? '' : (charCode ? charCode.toString().charCodeAt(0) : 0),
            binary: key === 'BACKSPACE' ? 'DELETE' : toBinary(charCode || key)
        });
    };

    // Auto-scroll monitor
    useEffect(() => {
        if (monitorRef.current) {
            monitorRef.current.scrollTop = monitorRef.current.scrollHeight;
        }
    }, [outputText]);

    // Handle Physical Keyboard
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (isProcessing) return;

            const key = e.key.toUpperCase();
            if (/^[A-Z]$/.test(key)) {
                handleInput(key);
            } else if (e.key === ' ') {
                handleInput('SPACE');
            } else if (e.key === 'Backspace') {
                handleInput('BACKSPACE');
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isProcessing]);

    return (
        <div className="h-[calc(100vh-4rem)] bg-slate-50 p-6 md:p-8 font-jakarta pb-40 overflow-y-auto">
            {/* Header */}
            <div className="max-w-7xl mx-auto mb-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Alur Pemrosesan Data</h1>
                        <p className="text-slate-500 font-medium mt-1">Simulasi Input - Proses - Output (IPO)</p>
                    </div>
                    <div className="bg-white px-4 py-2 rounded-xl border-2 border-slate-100 shadow-sm flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${isProcessing ? 'bg-orange-500 animate-pulse' : 'bg-emerald-500'}`}></div>
                        <span className="text-xs font-bold text-slate-600 uppercase">
                            {isProcessing ? 'SISTEM SIBUK' : 'SIAP MENERIMA DATA'}
                        </span>
                    </div>
                    <button
                        onClick={() => setShowQuiz(true)}
                        className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-slate-900 rounded-xl border-2 border-yellow-500 shadow-sm flex items-center gap-2 font-bold transition-all text-sm uppercase tracking-wider"
                    >
                        <Trophy size={16} /> Kuis
                    </button>
                </div>
            </div>
            {/* CONTROL PANEL */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t-4 border-indigo-500 p-4 z-50 shadow-[0_-5px_20px_rgba(0,0,0,0.1)] transition-transform duration-300 transform translate-y-0 flex justify-center gap-4 items-center">
                <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
                    <button
                        onClick={() => setPlaybackSpeed(0.5)}
                        className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${playbackSpeed === 0.5 ? 'bg-indigo-600 text-white shadow' : 'text-slate-500 hover:bg-white'}`}
                    >
                        0.5x
                    </button>
                    <button
                        onClick={() => setPlaybackSpeed(1)}
                        className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${playbackSpeed === 1 ? 'bg-indigo-600 text-white shadow' : 'text-slate-500 hover:bg-white'}`}
                    >
                        1x
                    </button>
                    <button
                        onClick={() => setPlaybackSpeed(2)}
                        className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${playbackSpeed === 2 ? 'bg-indigo-600 text-white shadow' : 'text-slate-500 hover:bg-white'}`}
                    >
                        2x
                    </button>
                </div>

                <div className="w-px h-8 bg-slate-300"></div>

                <button
                    onClick={() => isProcessing && setIsPaused(!isPaused)}
                    disabled={!isProcessing}
                    className={`flex items-center gap-2 px-6 py-2 rounded-xl font-bold text-white shadow-lg transition-all active:scale-95 ${!isProcessing ? 'bg-slate-300 cursor-not-allowed' :
                        isPaused ? 'bg-green-500 hover:bg-green-600' : 'bg-orange-500 hover:bg-orange-600'
                        }`}
                >
                    {isPaused ? <Play size={20} fill="currentColor" /> : <Pause size={20} fill="currentColor" />}
                    {isPaused ? 'Lanjutkan' : 'Jeda'}
                </button>

                <div className="w-px h-8 bg-slate-300"></div>

                <div className="text-xs font-mono text-slate-400">
                    Step: {currentStep}/5
                </div>
            </div>

            {/* Main Stage */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 relative items-stretch">
                {/* Explanation Footer */}
                <div className="max-w-7xl mx-auto mt-12 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                    <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <span className="bg-indigo-100 p-2 rounded-lg text-indigo-600"><Monitor size={20} /></span>
                        Penjelasan Proses (IPOS)
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="relative pl-6 border-l-4 border-indigo-200">
                            <div className="absolute -left-2.5 top-0 w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold">1</div>
                            <h4 className="font-bold text-slate-800 mb-2">INPUT (Masukan)</h4>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Saat kamu menekan tombol di <strong>Keyboard</strong>, keyboard mengirimkan sinyal elektronik ke komputer. Tombol 'A' yang kamu tekan belum berupa huruf di layar, melainkan sinyal listrik.
                            </p>
                        </div>

                        <div className="relative pl-6 border-l-4 border-orange-200">
                            <div className="absolute -left-2.5 top-0 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold">2</div>
                            <h4 className="font-bold text-slate-800 mb-2">PROCESS (Pemrosesan)</h4>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                <strong>Processor (CPU)</strong> menerima sinyal dan mengubahnya menjadi angka menggunakan standar <strong>ASCII</strong> (misal 'A' = 65). Lalu angka tersebut diubah menjadi <strong>Biner</strong> (bahasa mesin 0 dan 1) agar bisa diproses.
                                <br />
                                <span className="inline-block mt-1 text-xs font-mono bg-orange-50 text-orange-700 px-2 py-1 rounded">Contoh: 'A' → 65 → 01000001</span>
                            </p>
                        </div>

                        <div className="relative pl-6 border-l-4 border-teal-200">
                            <div className="absolute -left-2.5 top-0 w-5 h-5 bg-teal-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold">3</div>
                            <h4 className="font-bold text-slate-800 mb-2">OUTPUT (Keluaran)</h4>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Hasil pemrosesan dikirim ke <strong>Monitor</strong>.
                                Monitor mengubah data biner tadi menjadi titik-titik cahaya (pixel) yang membentuk gambar huruf 'A' yang bisa kamu baca.
                            </p>
                        </div>
                    </div>
                </div>



            </div>

            <style>{`
                @keyframes item-move-right {
                    0% { left: 0; opacity: 0; transform: scale(0.5); }
                    10% { opacity: 1; transform: scale(1); }
                    90% { opacity: 1; transform: scale(1); }
                    100% { left: 100%; opacity: 0; transform: scale(0.5); }
                }
            `}</style>
            {/* Quiz Mode */}
            {
                showQuiz && (
                    <QuizMode
                        moduleId="cpu"
                        moduleName="Pemrosesan Data (CPU)"
                        questions={cpuQuizQuestions}
                        onClose={() => setShowQuiz(false)}
                    />
                )
            }
        </div >
    );
};

export default PemrosesanData;
