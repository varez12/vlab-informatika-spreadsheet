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
    FileText
} from 'lucide-react';

const WordParagraph = () => {
    const [alignment, setAlignment] = useState('text-justify');
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderline, setIsUnderline] = useState(false);

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
            <div className="bg-[#a0a0a0] p-4 md:p-8 flex justify-center flex-1 overflow-y-auto">
                {/* 3cm margin approx 113px, using custom padding */}
                <div
                    className="bg-white w-full max-w-[800px] shadow-2xl min-h-[1000px] font-serif leading-relaxed animate-in fade-in duration-500 origin-top"
                    style={{ padding: '3cm' }}
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

            {/* FOOTER */}
            <footer className="bg-indigo-700 text-white px-6 py-2 flex items-center justify-between text-[9px] font-black uppercase tracking-[0.3em] shrink-0 border-t border-indigo-600">
                <div className="flex gap-8">
                    <span className="flex items-center gap-2 font-mono">Page 1 of 1</span>
                    <span className="flex items-center gap-2 font-mono">Margin: 3cm</span>
                    <span className="flex items-center gap-2 font-mono">Size: 11pt</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className={`p-0.5 rounded ${isBold ? 'bg-white/20' : ''}`}><Bold size={10} /></div>
                    <div className={`p-0.5 rounded ${isItalic ? 'bg-white/20' : ''}`}><Italic size={10} /></div>
                    <div className={`p-0.5 rounded ${isUnderline ? 'bg-white/20' : ''}`}><Underline size={10} /></div>
                    <div className="w-px h-3 bg-white/20"></div>
                    <span>Global Simulation Mode</span>
                </div>
            </footer>

        </div>
    );
};

export default WordParagraph;
