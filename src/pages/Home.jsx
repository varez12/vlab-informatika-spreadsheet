import React from 'react';
import { Link } from 'react-router-dom';
import { FileSpreadsheet, FileText, Gamepad2, Monitor, ArrowRight, Activity, BookOpen, Calculator } from 'lucide-react';

const ModuleCard = ({ to, title, description, icon: Icon, color }) => (
    <Link
        to={to}
        className="group relative overflow-hidden bg-white rounded-2xl shadow-lg border border-slate-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 p-6 flex flex-col h-full"
    >
        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${color} opacity-10 rounded-bl-[100px] -mr-10 -mt-10 transition-transform group-hover:scale-110`} />

        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white shadow-md mb-4 group-hover:scale-110 transition-transform`}>
            <Icon size={24} />
        </div>

        <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
            {title}
        </h3>

        <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-grow">
            {description}
        </p>

        <div className="flex items-center text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-600 to-slate-400 group-hover:from-blue-600 group-hover:to-indigo-600 transition-all">
            Buka Modul <ArrowRight size={16} className="ml-2 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
        </div>
    </Link>
);

const Home = () => {
    return (
        <div className="min-h-screen bg-[#f8fafc] pb-20">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-700 via-indigo-800 to-slate-900 text-white pt-24 pb-32 px-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold uppercase tracking-widest mb-6 animate-in slide-in-from-bottom-5">
                        <Activity size={12} className="text-green-400" /> V-Lab Informatika v1.0
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight leading-tight animate-in slide-in-from-bottom-10 fade-in duration-700">
                        Laboratorium Virtual <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-300">
                            Informatika SMP
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed animate-in slide-in-from-bottom-10 fade-in duration-1000 delay-100">
                        Platform pembelajaran interaktif untuk menguasai Aplikasi Perkantoran, Algoritma Pemrograman, dan Pengenalan Perangkat Keras.
                    </p>
                </div>
            </div>

            {/* Modules Grid */}
            <div className="max-w-7xl mx-auto px-6 -mt-20 relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in slide-in-from-bottom-20 fade-in duration-1000 delay-300">

                    <ModuleCard
                        to="/excel"
                        title="Excel Lab"
                        description="Pelajari fungsi spreadsheet, rumus matematika, dan analisis data dengan simulasi interaktif Microsoft Excel."
                        icon={FileSpreadsheet}
                        color="from-green-500 to-emerald-600"
                    />

                    <ModuleCard
                        to="/mailmerge"
                        title="Word Lab"
                        description="Kuasai pengolah kata, mail merge, dan layout dokumen profesional seperti di Microsoft Word."
                        icon={FileText}
                        color="from-blue-500 to-indigo-600"
                    />

                    <ModuleCard
                        to="/hardware"
                        title="Hardware 3D"
                        description="Jelajahi komponen komputer (CPU, RAM, GPU) dalam tampilan 3D interaktif yang detail."
                        icon={Monitor}
                        color="from-purple-500 to-pink-600"
                    />

                    <ModuleCard
                        to="/game"
                        title="Game Lab"
                        description="Belajar logika pemrograman dasar melalui game visual blockly yang menyenangkan."
                        icon={Gamepad2}
                        color="from-orange-500 to-red-600"
                    />

                </div>
            </div>

            {/* Footer / Info */}
            <div className="max-w-7xl mx-auto px-6 mt-16 text-center">
                <p className="text-slate-400 text-sm">
                    &copy; 2026 SMP Negeri 1 Baturetno - V-Lab Informatika. Dibuat dengan React & Tailwind.
                </p>
            </div>
        </div>
    );
};

export default Home;
