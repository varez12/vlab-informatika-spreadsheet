import { Link } from 'react-router-dom';
import { FileSpreadsheet, Gamepad2, ArrowRight, GraduationCap, ChevronRight, LayoutTemplate } from 'lucide-react';

function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900 selection:bg-indigo-100 selection:text-indigo-900">
      <div className="max-w-5xl mx-auto px-6 py-20 lg:py-32">

        {/* Header / Hero */}
        <header className="mb-20 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold text-[10px] uppercase tracking-wider">
            <GraduationCap size={14} />
            <span>Virtual Laboratory v2.0</span>
          </div>

          <div className="space-y-4 max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-[1.1]">
              Master Keterampilan <br className="hidden md:block" />
              <span className="text-indigo-600">Digital Modern.</span>
            </h1>
            <p className="text-lg text-zinc-500 leading-relaxed font-medium">
              Platform simulasi interaktif untuk mendalami logika pemrograman dan pengolahan data spreadsheet secara praktis dan visual.
            </p>
          </div>
        </header>

        {/* Module Grid */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* Module: Spreadsheet */}
          <Link to="/excel" className="group relative bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 flex flex-col justify-between min-h-[280px]">
            <div>
              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <FileSpreadsheet className="text-emerald-600 w-6 h-6" strokeWidth={1.5} />
              </div>
              <h2 className="text-xl font-bold mb-2 group-hover:text-emerald-700 transition-colors">Spreadsheet Lab</h2>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Pelajari anatomi formula Excel seperti VLOOKUP, INDEX-MATCH dengan simulasi visual.
              </p>
            </div>

            <div className="flex items-center gap-2 mt-8 text-xs font-bold uppercase tracking-widest text-zinc-400 group-hover:text-emerald-600 transition-colors">
              Mulai Belajar <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Module: Logic Game */}
          <Link to="/game" className="group relative bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 flex flex-col justify-between min-h-[280px]">
            <div>
              <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <Gamepad2 className="text-indigo-600 w-6 h-6" strokeWidth={1.5} />
              </div>
              <h2 className="text-xl font-bold mb-2 group-hover:text-indigo-700 transition-colors">Logic Game Lab</h2>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Asah logika algoritma dengan memprogram robot melalui rintangan labirin dan luar angkasa.
              </p>
            </div>

            <div className="flex items-center gap-2 mt-8 text-xs font-bold uppercase tracking-widest text-zinc-400 group-hover:text-indigo-600 transition-colors">
              Mainkan Sekarang <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Module: Mail Merge (Full Width) */}
          <Link to="/mailmerge" className="md:col-span-2 group relative bg-zinc-900 p-8 md:p-10 rounded-3xl shadow-2xl hover:-translate-y-1 transition-all duration-500 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-[100px] opacity-20 -mr-20 -mt-20 group-hover:opacity-30 transition-opacity"></div>

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
              <div className="max-w-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-indigo-500/20 rounded-lg">
                    <LayoutTemplate className="text-indigo-400 w-5 h-5" />
                  </div>
                  <span className="text-indigo-400 font-bold text-xs uppercase tracking-widest">Advanced Skill</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Mail Merge Simulator</h2>
                <p className="text-zinc-400 text-sm md:text-base leading-relaxed mb-6">
                  Simulasi end-to-end penggabungan data massal dari Excel ke Word. Pahami konsep database dan generate dokumen otomatis.
                </p>
                <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-zinc-900 rounded-xl font-bold text-sm hover:bg-zinc-100 transition-colors">
                  Buka Simulator <ArrowRight size={16} />
                </div>
              </div>

              {/* Abstract Visual */}
              <div className="hidden md:flex gap-4 opacity-50 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700">
                <div className="w-24 h-32 bg-indigo-600/20 border border-indigo-500/30 rounded-lg -rotate-6 transform translate-y-4"></div>
                <div className="w-24 h-32 bg-emerald-600/20 border border-emerald-500/30 rounded-lg rotate-3"></div>
              </div>
            </div>
          </Link>

        </div>

        {/* Footer */}
        <footer className="mt-20 pt-8 border-t border-zinc-200 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
            © 2024 V-Lab Informatika
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-zinc-400 hover:text-zinc-900 transition-colors text-xs font-bold">About</a>
            <a href="#" className="text-zinc-400 hover:text-zinc-900 transition-colors text-xs font-bold">Guide</a>
          </div>
        </footer>

      </div>
    </div>
  );
}

export default Home;