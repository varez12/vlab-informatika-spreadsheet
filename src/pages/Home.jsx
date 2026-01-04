import React from 'react';
import { Link } from 'react-router-dom';
import {
    FileSpreadsheet,
    FileText,
    Gamepad2,
    Monitor,
    ArrowRight,
    Activity,
    Calculator,
    Cpu,
    FolderOpen,
    Zap,
    Scissors,
    Code2
} from 'lucide-react';

const ModuleCard = ({ to, title, description, icon: Icon, color }) => (
    <Link
        to={to}
        className="group relative overflow-hidden bg-white rounded-2xl shadow-lg border border-slate-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 p-5 flex flex-col h-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-label={`${title}: ${description}`}
    >
        <div className={`absolute top-0 right-0 w-28 h-28 bg-gradient-to-br ${color} opacity-10 rounded-bl-[80px] -mr-8 -mt-8 transition-transform group-hover:scale-110`} aria-hidden="true" />

        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white shadow-md mb-3 group-hover:scale-110 transition-transform`} aria-hidden="true">
            <Icon size={22} aria-hidden="true" />
        </div>

        <h3 className="text-lg font-bold text-slate-800 mb-1.5 group-hover:text-blue-600 transition-colors leading-tight">
            {title}
        </h3>

        <p className="text-slate-600 text-xs leading-relaxed mb-4 flex-grow">
            {description}
        </p>

        <div className="flex items-center text-xs font-bold text-slate-500 group-hover:text-blue-600 transition-all" aria-hidden="true">
            Buka Modul <ArrowRight size={14} className="ml-1.5 group-hover:translate-x-1 transition-all" />
        </div>
    </Link>
);

const Home = () => {
    const modules = [
        {
            to: "/excel",
            title: "Excel Formula",
            description: "Simulasi fungsi spreadsheet, rumus matematika, dan analisis data Microsoft Excel.",
            icon: FileSpreadsheet,
            color: "from-green-500 to-emerald-600"
        },
        {
            to: "/mailmerge",
            title: "Word Lab",
            description: "Kuasai pengolah kata, mail merge, dan layout dokumen profesional.",
            icon: FileText,
            color: "from-blue-500 to-indigo-600"
        },
        {
            to: "/integrasi-office",
            title: "Integrasi Office",
            description: "Simulasi Cut, Copy, Paste antar aplikasi Word dan Excel.",
            icon: Scissors,
            color: "from-cyan-500 to-teal-600"
        },
        {
            to: "/hardware",
            title: "Hardware 3D",
            description: "Jelajahi komponen komputer dalam tampilan 3D interaktif.",
            icon: Monitor,
            color: "from-purple-500 to-pink-600"
        },
        {
            to: "/explorer",
            title: "File Explorer",
            description: "Simulasi Windows File Explorer: kelola file dan folder.",
            icon: FolderOpen,
            color: "from-amber-500 to-orange-600"
        },
        {
            to: "/biner",
            title: "Konversi Bilangan",
            description: "Konversi Biner, Oktal, Desimal, dan Heksadesimal.",
            icon: Calculator,
            color: "from-rose-500 to-red-600"
        },
        {
            to: "/blockly",
            title: "Blockly IoT",
            description: "Simulasi pemrograman visual untuk LED dan Buzzer.",
            icon: Cpu,
            color: "from-indigo-500 to-violet-600"
        },
        {
            to: "/blockly-maze",
            title: "Blockly Game",
            description: "Belajar logika pemrograman melalui game labirin.",
            icon: Gamepad2,
            color: "from-orange-500 to-red-600"
        },
        {
            to: "/gerbang-logika",
            title: "Gerbang Logika",
            description: "Simulasi gerbang logika AND, OR, NOT, XOR, dll.",
            icon: Zap,
            color: "from-sky-500 to-blue-600"
        },
        {
            to: "/pemrosesan-data",
            title: "CPU Simulation",
            description: "Simulasi proses Input-Process-Output di CPU.",
            icon: Code2,
            color: "from-slate-500 to-gray-700"
        },
    ];

    return (
        <div className="h-[calc(100vh-4rem)] bg-[#f8fafc] overflow-y-auto">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-700 via-indigo-800 to-slate-900 text-white pt-12 pb-20 px-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[10px] font-bold uppercase tracking-widest mb-4">
                        <Activity size={12} className="text-green-400" /> V-Lab Informatika v1.0
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tight leading-tight">
                        Laboratorium Virtual <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-300">
                            Informatika SMP
                        </span>
                    </h1>
                    <p className="text-sm md:text-base text-blue-100 max-w-xl mx-auto leading-relaxed">
                        Platform pembelajaran interaktif untuk menguasai Aplikasi Perkantoran, Algoritma Pemrograman, dan Pengenalan Perangkat Keras.
                    </p>
                </div>
            </div>

            {/* Modules Grid */}
            <div className="max-w-7xl mx-auto px-4 md:px-6 -mt-12 relative z-20 pb-12">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                    {modules.map((mod, idx) => (
                        <ModuleCard key={idx} {...mod} />
                    ))}
                </div>
            </div>

            {/* Footer */}
            <div className="max-w-7xl mx-auto px-6 pb-8 text-center">
                <p className="text-slate-400 text-xs">
                    &copy; 2026 SMP Negeri 1 Baturetno - V-Lab Informatika
                </p>
            </div>
        </div>
    );
};

export default Home;
