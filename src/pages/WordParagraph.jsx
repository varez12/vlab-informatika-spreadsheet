import React, { useState } from 'react';
import {
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    Bold,
    Italic,
    Underline,
    Info,
    CheckCircle,
    FileText,
    Minimize,
    Layout
} from 'lucide-react';

const WordParagraph = () => {
    const [alignment, setAlignment] = useState('text-justify');
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderline, setIsUnderline] = useState(false);

    // Zoom State
    const [zoom, setZoom] = useState(100);

    const [activeTab, setActiveTab] = useState('Home');
    const [toast, setToast] = useState(null);

    const showMessage = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    };

    const handleAlign = (alignClass, name) => {
        setAlignment(alignClass);
        showMessage(`✅ Perataan "${name}" Diterapkan!`);
    };

    const toggleStyle = (style, setter, name) => {
        setter(!style);
        // showMessage(`✅ Gaya "${name}" ${!style ? 'Aktif' : 'Non-aktif'}!`);
    };

    return (
        <div className="h-[calc(100vh-4rem)] bg-slate-200 font-sans text-slate-800 flex flex-col overflow-hidden">

            {/* TOAST */}
            {toast && (
                <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[300] bg-slate-900 text-white px-8 py-3 rounded-full shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 border border-slate-700">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">{toast}</span>
                </div>
            )}

            {/* RIBBON */}
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
                            {/* Font Group (Active) */}
                            <div className="flex flex-col items-center px-4 border-r border-slate-300">
                                <div className="flex gap-1 mb-2">
                                    <button
                                        onClick={() => toggleStyle(isBold, setIsBold, 'Bold')}
                                        className={`p-1 border rounded transition-all ${isBold ? 'bg-indigo-100 border-indigo-300 text-indigo-700 shadow-inner' : 'border-transparent hover:bg-slate-200 text-slate-700'}`}
                                        title="Bold (Ctrl+B)"
                                    >
                                        <Bold size={16} />
                                    </button>
                                    <button
                                        onClick={() => toggleStyle(isItalic, setIsItalic, 'Italic')}
                                        className={`p-1 border rounded transition-all ${isItalic ? 'bg-indigo-100 border-indigo-300 text-indigo-700 shadow-inner' : 'border-transparent hover:bg-slate-200 text-slate-700'}`}
                                        title="Italic (Ctrl+I)"
                                    >
                                        <Italic size={16} />
                                    </button>
                                    <button
                                        onClick={() => toggleStyle(isUnderline, setIsUnderline, 'Underline')}
                                        className={`p-1 border rounded transition-all ${isUnderline ? 'bg-indigo-100 border-indigo-300 text-indigo-700 shadow-inner' : 'border-transparent hover:bg-slate-200 text-slate-700'}`}
                                        title="Underline (Ctrl+U)"
                                    >
                                        <Underline size={16} />
                                    </button>
                                </div>
                                <span className="text-[10px] font-medium text-slate-600">Font</span>
                            </div>

                            {/* Paragraph Group (Active) */}
                            <div className="flex flex-col items-center px-4 relative">
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleAlign('text-left', 'Align Left')}
                                        className={`p-2 rounded hover:bg-slate-200 border ${alignment === 'text-left' ? 'bg-indigo-100 border-indigo-300 text-indigo-700' : 'border-transparent text-slate-700'}`}
                                        title="Align Left"
                                    >
                                        <AlignLeft size={20} />
                                    </button>
                                    <button
                                        onClick={() => handleAlign('text-center', 'Center')}
                                        className={`p-2 rounded hover:bg-slate-200 border ${alignment === 'text-center' ? 'bg-indigo-100 border-indigo-300 text-indigo-700' : 'border-transparent text-slate-700'}`}
                                        title="Center"
                                    >
                                        <AlignCenter size={20} />
                                    </button>
                                    <button
                                        onClick={() => handleAlign('text-right', 'Align Right')}
                                        className={`p-2 rounded hover:bg-slate-200 border ${alignment === 'text-right' ? 'bg-indigo-100 border-indigo-300 text-indigo-700' : 'border-transparent text-slate-700'}`}
                                        title="Align Right"
                                    >
                                        <AlignRight size={20} />
                                    </button>
                                    <button
                                        onClick={() => handleAlign('text-justify', 'Justify')}
                                        className={`p-2 rounded hover:bg-slate-200 border ${alignment === 'text-justify' ? 'bg-indigo-100 border-indigo-300 text-indigo-700' : 'border-transparent text-slate-700'}`}
                                        title="Justify"
                                    >
                                        <AlignJustify size={20} />
                                    </button>
                                </div>
                                <span className="text-[10px] font-bold text-slate-600 mt-2">Paragraph</span>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-slate-400 italic text-xs">
                            Fitur tab "{activeTab}" tidak aktif di simulasi ini. Klik "Home".
                        </div>
                    )}
                </div>
            </div>

            {/* DOCUMENT AREA */}
            <div className="bg-[#e5e7eb] p-4 md:p-8 flex justify-center flex-1 overflow-auto relative custom-scrollbar">

                {/* Scale wrapper to fit view if paper is huge */}
                <div className="origin-top transition-transform duration-200 ease-out py-8" style={{ transform: `scale(${zoom / 100})` }}>
                    <div
                        className="bg-white shadow-[0_0_50px_rgba(0,0,0,0.5)] font-serif text-xs md:text-sm leading-relaxed text-slate-900 border border-slate-300 relative"
                        style={{
                            width: '21cm',
                            minHeight: '29.7cm',
                            padding: '2.54cm'
                        }}
                    >

                        <h1 className="text-xl font-bold mb-6 text-center text-slate-900 uppercase">Laporan Kegiatan Sekolah</h1>

                        <div
                            className={`space-y-4 text-sm text-slate-900 transition-all duration-300 
                            ${alignment} 
                            ${isBold ? 'font-bold' : ''} 
                            ${isItalic ? 'italic' : ''} 
                            ${isUnderline ? 'underline underline-offset-4' : ''}
                        `}
                        >

                            <p>
                                Pada hari Senin tanggal 15 Januari 2024, SD Negeri 1 Suka Belajar telah melaksanakan kegiatan "Pekan Literasi Digital". Kegiatan ini bertujuan untuk mengenalkan dasar-dasar teknologi informasi kepada siswa sejak dini, termasuk penggunaan perangkat lunak pengolah kata seperti Microsoft Word.
                            </p>

                            <p>
                                Seluruh siswa kelas 6 mengikuti pelatihan simulasi tata letak dokumen. Mereka belajar bagaimana mengatur perataan teks agar dokumen terlihat rapi dan profesional. Perataan kiri (Align Left) biasanya digunakan untuk surat resmi standar. Perataan tengah (Center) digunakan untuk judul. Perataan kanan (Align Right) sering dipakai untuk tanggal atau tanda tangan di pojok kanan bawah.
                            </p>

                            <p>
                                Sedangkan perataan Justify (Rata Kanan-Kiri) adalah format yang paling sering digunakan dalam buku atau laporan formal karena memberikan kesan blok teks yang rapi dan teratur di kedua sisi margin. Kemampuan mengatur paragraf ini sangat penting sebagai fondasi keterampilan administrasi digital mereka di masa depan.
                            </p>

                            <p>
                                Kegiatan diakhiri dengan praktik langsung di laboratorium komputer sekolah. Para siswa sangat antusias mencoba berbagai fitur ribbon layouting. Diharapkan program ini dapat mencetak generasi yang tidak hanya mahir menggunakan gadget, tetapi juga produktif dalam menggunakan alat-alat perkantoran digital.
                            </p>

                        </div>

                        <div className="mt-12 pt-8 border-t border-slate-100 flex justify-between items-end text-[10px] text-slate-500 italic">
                            <span>Dokumen Simulasi V-Lab</span>
                            <span>Halaman 1 dari 1</span>
                        </div>

                    </div>
                </div>
            </div>

            {/* FOOTER */}
            {/* FOOTER STATUS BAR */}
            <footer className="bg-[#f3f3f3] text-regal-blue px-2 py-1 flex items-center justify-between text-[11px] font-sans border-t border-[#d6d6d6] shrink-0 select-none text-slate-600">
                <div className="flex gap-4 px-2">
                    <span className="flex items-center gap-1 hover:bg-[#e0e0e0] px-1 rounded cursor-default"><FileText size={12} className="text-blue-600" /> Page 1 of 1</span>
                    <span className="flex items-center gap-1 hover:bg-[#e0e0e0] px-1 rounded cursor-default decoration-dotted underline decorate-slate-400">Word Count: 142</span>
                    <span className="hidden md:flex items-center gap-1 hover:bg-[#e0e0e0] px-1 rounded cursor-default">English (US)</span>
                </div>

                <div className="flex items-center gap-4 px-4">
                    {/* View Modes */}
                    <div className="hidden md:flex gap-1 mr-4 border-r border-slate-300 pr-4">
                        <button className="p-1 hover:bg-[#c6c6c6] rounded bg-[#d6d6d6] active:bg-slate-400 transition-colors" title="Print Layout"><Layout size={14} /></button>
                        <button className="p-1 hover:bg-[#c6c6c6] rounded transition-colors" title="Web Layout"><Minimize size={14} /></button>
                    </div>

                    {/* Zoom Controls */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setZoom(z => Math.max(z - 10, 50))}
                            className="text-slate-500 hover:bg-[#d0d0d0] rounded px-2 font-bold transition-all active:scale-95"
                        >-</button>

                        <div className="flex items-center gap-2 w-32 group">
                            <input
                                type="range"
                                min="50"
                                max="200"
                                value={zoom}
                                onChange={(e) => setZoom(parseInt(e.target.value))}
                                className="w-full h-1 bg-slate-300 rounded-lg appearance-none cursor-pointer accent-slate-600 group-hover:accent-blue-600 transition-all"
                            />
                            <div className="w-[1px] h-3 bg-slate-400"></div>
                        </div>

                        <button
                            onClick={() => setZoom(z => Math.min(z + 10, 200))}
                            className="text-slate-500 hover:bg-[#d0d0d0] rounded px-2 font-bold transition-all active:scale-95"
                        >+</button>

                        <span className="w-10 text-right font-mono text-xs">{zoom}%</span>
                    </div>
                </div>
            </footer>

        </div>
    );
};

export default WordParagraph;

