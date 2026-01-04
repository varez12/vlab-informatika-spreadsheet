import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
    ArrowUpDown,
    Filter,
    Search,
    Info,
    X,
    Check,
    LayoutGrid,
    FileSpreadsheet,
    Settings2,
    ChevronDown,
    ListFilter
} from 'lucide-react';

const ExcelSort = () => {
    // --- STATE DATA ---
    const initialData = [
        { id: 1, nama: 'Budi Santoso', kelas: '8A', nilai: 85, status: 'Lulus' },
        { id: 2, nama: 'Ani Wijaya', kelas: '7B', nilai: 92, status: 'Lulus' },
        { id: 3, nama: 'Citra Lestari', kelas: '8A', nilai: 78, status: 'Remedial' },
        { id: 4, nama: 'Dedi Kurniawan', kelas: '9C', nilai: 88, status: 'Lulus' },
        { id: 5, nama: 'Euis Dahlia', kelas: '7B', nilai: 95, status: 'Lulus' },
        { id: 6, nama: 'Fajar Pratama', kelas: '9C', nilai: 65, status: 'Remedial' },
    ];

    // --- UI STATE ---
    const [isFilterModeActive, setIsFilterModeActive] = useState(true);
    const [activeTab, setActiveTab] = useState('Data');
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [openFilterMenu, setOpenFilterMenu] = useState(null); // Menunjuk kolom mana yang terbuka filternya

    // --- LOGIC STATE ---
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [activeFilters, setActiveFilters] = useState({
        nama: [],
        kelas: [],
        status: []
    });

    // Get Unique Values for Filter Menus
    const uniqueValues = useMemo(() => {
        return {
            nama: [...new Set(initialData.map(item => item.nama))].sort(),
            kelas: [...new Set(initialData.map(item => item.kelas))].sort(),
            status: [...new Set(initialData.map(item => item.status))].sort()
        };
    }, []);

    // --- LOGIKA UTAMA: SORT & FILTER ---
    const filteredAndSortedData = useMemo(() => {
        let result = [...initialData];

        // 1. Filtering Logic (Multi-column)
        Object.keys(activeFilters).forEach(key => {
            if (activeFilters[key].length > 0) {
                result = result.filter(item => activeFilters[key].includes(item[key]));
            }
        });

        // 2. Sorting Logic
        if (sortConfig.key !== null) {
            result.sort((a, b) => {
                const valA = a[sortConfig.key];
                const valB = b[sortConfig.key];
                if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
                if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return result;
    }, [sortConfig, activeFilters]);

    // --- HANDLERS ---
    const toggleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
        setSortConfig({ key, direction });
    };

    const handleFilterToggle = (column, value) => {
        setActiveFilters(prev => {
            const currentValues = prev[column];
            if (currentValues.includes(value)) {
                return { ...prev, [column]: currentValues.filter(v => v !== value) };
            } else {
                return { ...prev, [column]: [...currentValues, value] };
            }
        });
    };

    const clearFilter = (column) => {
        setActiveFilters(prev => ({ ...prev, [column]: [] }));
    };

    // Close menus on outside click
    const menuRef = useRef();
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpenFilterMenu(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // --- ZOOM STATE ---
    const [zoom, setZoom] = useState(100);

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)] bg-[#F3F2F1] font-sans text-slate-800 overflow-y-auto">


            {/* --- RIBBON HEADER --- */}
            <header className="bg-[#217346] text-white p-2 flex items-center justify-between shadow-md z-30">
                <div className="flex items-center gap-3 px-2">
                    <div className="bg-white/20 p-1 rounded">
                        <FileSpreadsheet size={18} />
                    </div>
                    <h1 className="text-sm font-semibold tracking-wide uppercase">Fitur Sort dan Filter</h1>
                </div>
                <div className="text-[10px] font-mono opacity-70 hidden md:block"></div>
            </header>

            {/* --- EXCEL NAVIGATION & RIBBON --- */}
            <nav className="bg-white border-b border-slate-200 z-20">
                <div className="flex text-sm px-4 bg-white border-b border-slate-100">
                    {['File', 'Home', 'Insert', 'Page Layout', 'Formulas', 'Data', 'View'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 border-b-2 transition-all ${activeTab === tab ? 'border-[#217346] text-[#217346] font-bold' : 'border-transparent text-slate-600 hover:bg-slate-50'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="p-2 flex items-center gap-4 bg-slate-50 overflow-x-auto border-b border-slate-200">
                    {/* Group: Sort & Filter */}
                    <div className="flex items-center border-r border-slate-300 pr-4 ml-2">
                        <div className="flex flex-col items-center group">
                            <div className="flex gap-2">
                                <button
                                    onClick={() => toggleSort('nama')}
                                    className="flex flex-col items-center p-2 rounded hover:bg-slate-200 text-slate-700"
                                >
                                    <ArrowUpDown size={20} className="text-[#217346]" />
                                    <span className="text-[10px] font-medium mt-1">Sort</span>
                                </button>
                                <button
                                    onClick={() => setIsFilterModeActive(!isFilterModeActive)}
                                    className={`flex flex-col items-center p-2 rounded transition-all ${isFilterModeActive ? 'bg-green-100 ring-1 ring-green-600 shadow-inner' : 'hover:bg-slate-200'}`}
                                >
                                    <Filter size={20} className="text-[#217346]" />
                                    <span className="text-[10px] font-medium mt-1">Filter</span>
                                </button>
                            </div>
                            <span className="text-[9px] text-slate-400 font-bold uppercase mt-1">Sort & Filter</span>
                        </div>
                    </div>


                </div>
            </nav>

            {/* --- WORKSPACE --- */}
            {/* Removed padding (p-4) and gap (gap-4) as requested to remove "red line" space */}
            <main className="flex flex-col relative bg-[#E6E6E6] flex-1 overflow-hidden">

                {/* --- FORMULA BAR (Replaces Title) --- */}
                <div className="bg-white border-b border-slate-300 flex items-center p-1.5 gap-2 z-10 shadow-sm sticky top-0">
                    {/* Name Box */}
                    <div className="w-10 h-6 bg-white border border-slate-300 flex items-center justify-center text-xs font-medium text-slate-700 shadow-inner relative group cursor-default">
                        {selectedRow ? `A${selectedRow.id + 1}` : 'A1'}
                        <div className="absolute inset-0 ring-1 ring-transparent group-hover:ring-slate-400 rounded-sm pointer-events-none"></div>
                    </div>

                    {/* Divider & Icons */}
                    <div className="flex items-center gap-1.5 text-slate-400 px-1 border-r border-slate-300 mr-1">
                        <X size={12} className="hover:bg-slate-200 hover:text-red-500 rounded cursor-pointer transition-colors" />
                        <Check size={12} className="hover:bg-slate-200 hover:text-green-500 rounded cursor-pointer transition-colors" />
                        <span className="font-serif italic font-bold text-xs text-slate-600 cursor-pointer hover:bg-slate-200 px-1 rounded transition-colors">fx</span>
                    </div>

                    {/* Formula Input */}
                    <div className="flex-1 h-6 relative">
                        <input
                            type="text"
                            readOnly
                            value={
                                activeFilters.kelas.length > 0
                                    ? `=FILTER(Data; Kelas="${activeFilters.kelas.join(",")}")`
                                    : sortConfig.key
                                        ? `=SORT(Data; "${sortConfig.key}"; ${sortConfig.direction})`
                                        : selectedRow
                                            ? selectedRow.nama
                                            : ''
                            }
                            placeholder="Ketik formula di sini..."
                            className="w-full h-full border-none focus:ring-0 text-xs font-mono text-slate-800 bg-transparent"
                        />
                    </div>

                    {/* Clear Filters Integrated */}
                    {Object.entries(activeFilters).some(([_, v]) => v.length > 0) && (
                        <button
                            onClick={() => setActiveFilters({ nama: [], kelas: [], status: [] })}
                            className="px-2 py-0.5 bg-red-50 text-red-600 border border-red-200 rounded text-[10px] font-bold hover:bg-red-100 transition-colors flex items-center gap-1 shadow-sm"
                        >
                            <X size={10} /> Clear
                        </button>
                    )}
                </div>

                <div className="flex-1 overflow-auto custom-scrollbar relative">
                    {/* --- GRID TABLE (EXCEL STYLE) --- */}
                    {/* Applied Zoom Transform */}
                    <div className="bg-[#E6E6E6] relative" ref={menuRef}>
                        <div
                            className="bg-white shadow-xl origin-top-left transition-transform duration-200 ease-out inline-block min-w-full"
                            style={{ transform: `scale(${zoom / 100})`, width: `${100 * (100 / zoom)}%` }} // Adjust width to compensate scale
                        >
                            <table className="w-full text-sm border-collapse table-fixed cursor-default bg-white">
                                <colgroup>
                                    <col className="w-10 bg-[#F4F5F6]" /> {/* Row Index */}
                                    <col className="w-64" /> {/* A */}
                                    <col className="w-28" /> {/* B */}
                                    <col className="w-20" /> {/* C */}
                                    <col className="w-32" /> {/* D */}
                                    <col /> {/* E (Auto) */}
                                </colgroup>
                                <thead className="bg-[#E6E6E6] sticky top-0 z-20 shadow-sm">
                                    {/* SYSTEM HEADERS (A, B, C...) */}
                                    <tr>
                                        <th className="h-6 border border-slate-300 bg-[#E6E6E6] relative">
                                            <div className="absolute inset-0 flex items-center justify-center opacity-40">
                                                <svg width="10" height="10" viewBox="0 0 10 10">
                                                    <path d="M10 10 L0 10 L10 0 Z" fill="#666" />
                                                </svg>
                                            </div>
                                        </th>
                                        <th className="border border-slate-300 bg-[#E6E6E6] text-slate-700 font-normal hover:bg-[#D4D4D4] transition-colors relative group">
                                            A
                                            <div className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-green-500"></div>
                                        </th>
                                        <th className="border border-slate-300 bg-[#E6E6E6] text-slate-700 font-normal hover:bg-[#D4D4D4] transition-colors relative group">
                                            B
                                            <div className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-green-500"></div>
                                        </th>
                                        <th className="border border-slate-300 bg-[#E6E6E6] text-slate-700 font-normal hover:bg-[#D4D4D4] transition-colors relative group">
                                            C
                                            <div className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-green-500"></div>
                                        </th>
                                        <th className="border border-slate-300 bg-[#E6E6E6] text-slate-700 font-normal hover:bg-[#D4D4D4] transition-colors relative group">
                                            D
                                            <div className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-green-500"></div>
                                        </th>
                                        <th className="border border-slate-300 bg-[#E6E6E6] text-slate-700 font-normal hover:bg-[#D4D4D4] transition-colors">E</th>
                                    </tr>
                                    {/* SEMANTIC HEADERS (Row 1) */}
                                    <tr>
                                        <th className="h-8 border border-slate-300 bg-[#F8F9FA] text-slate-500 font-mono text-center text-xs">1</th>
                                        <th className="border border-slate-300 relative px-2 py-1 bg-white text-left align-middle group">
                                            <div className="flex items-center justify-between pointer-events-none">
                                                <span className="font-bold text-slate-700 text-xs">Nama Siswa</span>
                                                {isFilterModeActive && (
                                                    <button
                                                        onClick={() => setOpenFilterMenu(openFilterMenu === 'nama' ? null : 'nama')}
                                                        className={`pointer-events-auto p-0.5 rounded border shadow-sm ${activeFilters.nama.length > 0 ? 'bg-green-50 border-green-500' : 'bg-slate-100 border-slate-300 hover:bg-slate-200'}`}
                                                    >
                                                        <ChevronDown size={12} className="text-slate-600" />
                                                    </button>
                                                )}
                                            </div>
                                            {/* Filter Dropdown Nama */}
                                            {openFilterMenu === 'nama' && <FilterMenu column="nama" options={uniqueValues.nama} activeFilters={activeFilters.nama} onToggle={handleFilterToggle} onClear={() => clearFilter('nama')} />}
                                        </th>
                                        <th className="border border-slate-300 relative px-2 py-1 bg-white text-left align-middle group">
                                            <div className="flex items-center justify-between pointer-events-none">
                                                <span className="font-bold text-slate-700 text-xs">Kelas</span>
                                                {isFilterModeActive && (
                                                    <button
                                                        onClick={() => setOpenFilterMenu(openFilterMenu === 'kelas' ? null : 'kelas')}
                                                        className={`pointer-events-auto p-0.5 rounded border shadow-sm ${activeFilters.kelas.length > 0 ? 'bg-green-50 border-green-500' : 'bg-slate-100 border-slate-300 hover:bg-slate-200'}`}
                                                    >
                                                        <ChevronDown size={12} className="text-slate-600" />
                                                    </button>
                                                )}
                                            </div>
                                            {/* Filter Dropdown Kelas */}
                                            {openFilterMenu === 'kelas' && <FilterMenu column="kelas" options={uniqueValues.kelas} activeFilters={activeFilters.kelas} onToggle={handleFilterToggle} onClear={() => clearFilter('kelas')} />}
                                        </th>
                                        <th className="border border-slate-300 relative px-2 py-1 bg-white text-center align-middle group">
                                            <div className="flex items-center justify-center gap-2">
                                                <span className="font-bold text-slate-700 uppercase text-xs">Nilai</span>
                                            </div>
                                        </th>
                                        <th className="border border-slate-300 relative px-2 py-1 bg-white text-left align-middle group">
                                            <div className="relative flex items-center w-full pointer-events-none">
                                                <span className="font-bold text-slate-700 text-xs pl-2">Status</span>
                                                {isFilterModeActive && (
                                                    <button
                                                        onClick={() => setOpenFilterMenu(openFilterMenu === 'status' ? null : 'status')}
                                                        className={`pointer-events-auto absolute right-0 p-0.5 rounded border shadow-sm ${activeFilters.status.length > 0 ? 'bg-green-50 border-green-500' : 'bg-slate-100 border-slate-300 hover:bg-slate-200'}`}
                                                    >
                                                        <ChevronDown size={12} className="text-slate-600" />
                                                    </button>
                                                )}
                                            </div>
                                            {/* Filter Dropdown Status */}
                                            {openFilterMenu === 'status' && <FilterMenu column="status" options={uniqueValues.status} activeFilters={activeFilters.status} onToggle={handleFilterToggle} onClear={() => clearFilter('status')} />}
                                        </th>
                                        {/* Empty Column for visual balance mapped to E but data only goes to D? data has Nama, Kelas, Nilai, Status (4 cols). So A B C D. E is empty. */}
                                        <th className="border border-slate-300 bg-white"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredAndSortedData.length > 0 ? filteredAndSortedData.map((row, idx) => (
                                        <tr
                                            key={row.id}
                                            onClick={() => setSelectedRow(row)}
                                            className={`hover:bg-blue-50 cursor-pointer ${selectedRow?.id === row.id ? 'bg-blue-100 ring-2 ring-inset ring-blue-500 z-10 relative' : ''}`}
                                        >
                                            <td className="h-6 border border-slate-200 bg-[#E6E6E6]/50 text-center font-mono text-[10px] text-slate-500">{idx + 2}</td>
                                            <td className="border border-slate-200 px-2 h-6 align-middle font-medium text-xs">{row.nama}</td>
                                            <td className="border border-slate-200 px-2 h-6 align-middle text-center text-slate-600 text-xs">{row.kelas}</td>
                                            <td className="border border-slate-200 px-2 h-6 align-middle text-center text-xs">
                                                <span className={`inline-block w-8 text-center font-bold ${row.nilai >= 75 ? 'text-green-700' : 'text-red-600'}`}>
                                                    {row.nilai}
                                                </span>
                                            </td>
                                            <td className="border border-slate-200 px-2 h-6 align-middle text-left pl-4">
                                                <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${row.status === 'Lulus' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    {row.status === 'Lulus' ? <Check size={10} /> : <X size={10} />}
                                                    {row.status.toUpperCase()}
                                                </div>
                                            </td>
                                            {/* Empty E Col Data */}
                                            <td className="border border-slate-200"></td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="6" className="h-64 border border-slate-200 text-center bg-slate-50">
                                                <div className="flex flex-col items-center justify-center opacity-40">
                                                    <Search size={64} className="mb-4" />
                                                    <p className="text-lg font-bold italic">#VALUE!: Tidak ada data yang sesuai</p>
                                                    <p className="text-xs">Coba hapus beberapa filter untuk menampilkan data.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                    {/* Empty Rows Padding */}
                                    {[...Array(Math.max(0, 14 - filteredAndSortedData.length))].map((_, i) => (
                                        <tr key={`empty-${i}`}>
                                            <td className="h-6 border border-slate-200 bg-[#E6E6E6]/50 text-center font-mono text-[10px] text-slate-300 italic">{filteredAndSortedData.length + i + 2}</td>
                                            <td className="border border-slate-200 h-6"></td>
                                            <td className="border border-slate-200 h-6"></td>
                                            <td className="border border-slate-200 h-6"></td>
                                            <td className="border border-slate-200 h-6"></td>
                                            <td className="border border-slate-200 h-6"></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>


                        </div>
                    </div>
                </div>
                {/* --- STATUS BAR (FIXED BOTTOM) --- */}
                <div className="bg-[#217346] text-white px-4 py-1.5 flex items-center justify-between text-[10px] select-none shadow-sm border-t border-[#1e6b41] z-30 shrink-0 relative">
                    <div className="flex items-center gap-4">
                        <div className="font-bold uppercase tracking-wider">READY</div>
                        <div className="flex items-center gap-1 opacity-80 hover:opacity-100 cursor-pointer">
                            <FileSpreadsheet size={10} />
                            <span>Page 1 of 1</span>
                        </div>
                        <div className="opacity-80">
                            {filteredAndSortedData.length} records found
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 mr-2 opacity-80">
                            <button className="p-0.5 hover:bg-white/20 rounded" title="Normal View"><LayoutGrid size={12} /></button>
                            <button className="p-0.5 hover:bg-white/20 rounded" title="Page Layout"><Settings2 size={12} /></button>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={() => setZoom(Math.max(50, zoom - 10))} className="hover:bg-white/20 rounded p-0.5"> - </button>
                            <input type="range" min="50" max="200" value={zoom} onChange={(e) => setZoom(Number(e.target.value))} className="w-24 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer accent-white" />
                            <button onClick={() => setZoom(Math.min(200, zoom + 10))} className="hover:bg-white/20 rounded p-0.5"> + </button>
                            <span className="w-8 text-right font-mono">{zoom}%</span>
                        </div>
                    </div>
                </div>
            </main>

            {/* --- STATUS BAR (NEW!) --- */}


            {/* --- FLOATING HELP BUTTON --- */}
            <button
                onClick={() => setIsDrawerOpen(true)}
                className="fixed bottom-6 right-6 w-14 h-14 bg-[#217346] text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-40 group"
            >
                <Info size={24} />
                <span className="absolute -top-10 right-0 bg-black/80 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Bantuan Lab</span>
            </button>

            {/* --- DRAWER PANDUAN --- */}
            {
                isDrawerOpen && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex justify-end">
                        <div className="w-full max-w-sm bg-white h-full shadow-2xl flex flex-col animate-slide-left">
                            <div className="p-6 bg-[#217346] text-white flex justify-between items-center">
                                <div>
                                    <h3 className="text-xl font-black italic">DRAWER PANDUAN</h3>
                                    <p className="text-[10px] opacity-70">Topik: Sort & AutoFilter</p>
                                </div>
                                <button onClick={() => setIsDrawerOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                <div className="space-y-2">
                                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Tujuan Praktik</h4>
                                    <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                                        <p className="text-sm text-blue-900 leading-relaxed">
                                            Siswa mampu menggunakan fitur **Filter** untuk menyaring data spesifik dan fitur **Sort** untuk mengurutkan data berdasarkan kriteria tertentu.
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Langkah Teknis</h4>
                                    <div className="space-y-3">
                                        {[
                                            { t: "Aktifkan Filter", d: "Klik ikon Filter di tab Ribbon agar panah muncul di judul kolom." },
                                            { t: "Pilih Kriteria", d: "Klik panah pada kolom 'Kelas', lalu beri centang pada '8A'." },
                                            { t: "Multi-Filter", d: "Klik panah pada kolom 'Status', lalu centang 'Lulus'." },
                                            { t: "Analisis", d: "Perhatikan Baris Status di bawah untuk melihat jumlah data tersaring." }
                                        ].map((step, i) => (
                                            <div key={i} className="flex gap-4">
                                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold text-xs border border-green-200">{i + 1}</span>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-800">{step.t}</p>
                                                    <p className="text-xs text-slate-500 leading-snug">{step.d}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                                    <p className="text-[11px] text-amber-800 leading-relaxed italic">
                                        <strong>Tips Informatika:</strong> Sorting membantu kamu melihat ranking (Nilai), sedangkan Filtering membantu kamu fokus pada grup tertentu (Kelas).
                                    </p>
                                </div>
                            </div>

                            <div className="p-6 border-t bg-slate-50">
                                <button
                                    onClick={() => setIsDrawerOpen(false)}
                                    className="w-full py-3 bg-[#217346] text-white rounded font-black uppercase tracking-tighter hover:bg-[#1a5c38] transition-all shadow-md"
                                >
                                    Kembali Ke Lab
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            <style>{`
        @keyframes slide-left {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-left {
          animation: slide-left 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
        </div >
    );
};

// --- SUB-COMPONENT: FILTER MENU ---
const FilterMenu = ({ column, options, activeFilters, onToggle, onClear }) => {
    return (
        <div className="absolute top-full right-0 mt-1 w-48 bg-white border border-slate-300 shadow-2xl rounded-md z-50 text-left animate-in fade-in zoom-in duration-75">
            <div className="p-2 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Filter {column}</span>
                <button onClick={onClear} className="text-[10px] text-blue-600 hover:underline">Clear</button>
            </div>
            <div className="max-h-48 overflow-y-auto p-1">
                {options.map(opt => (
                    <label key={opt} className="flex items-center gap-2 px-3 py-1.5 hover:bg-blue-50 rounded cursor-pointer group">
                        <div className={`w-4 h-4 border rounded flex items-center justify-center transition-colors ${activeFilters.includes(opt) ? 'bg-[#217346] border-[#217346]' : 'border-slate-300 bg-white group-hover:border-[#217346]'}`}>
                            {activeFilters.includes(opt) && <Check size={10} className="text-white" />}
                        </div>
                        <input
                            type="checkbox"
                            className="hidden"
                            checked={activeFilters.includes(opt)}
                            onChange={() => onToggle(column, opt)}
                        />
                        <span className="text-xs text-slate-700">{opt}</span>
                    </label>
                ))}
            </div>
            <div className="p-2 bg-slate-50 border-t border-slate-100 text-[9px] text-slate-400 italic">
                Klik di luar untuk menutup menu
            </div>
        </div>
    );
}

export default ExcelSort;