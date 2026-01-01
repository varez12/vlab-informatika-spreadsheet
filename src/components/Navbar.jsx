import { Link, useLocation } from 'react-router-dom';
import { Home, FileSpreadsheet, Gamepad2, Menu, FileText, ChevronDown, ChevronRight, ChevronUp, Beaker, Monitor } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

function Navbar() {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [expandedMobile, setExpandedMobile] = useState(null);
    const [openSubmenu, setOpenSubmenu] = useState(null); // For Desktop nested menus

    const isActive = (path) => location.pathname === path;

    const toggleMobileSub = (path) => {
        setExpandedMobile(expandedMobile === path ? null : path);
    };

    const navItems = [
        { path: '/', label: 'Beranda', icon: <Home size={18} /> },
        {
            path: '/excel', label: 'Excel Lab', icon: <FileSpreadsheet size={18} />,
            subItems: [
                {
                    label: 'Formula Pencarian',
                    path: '#', // Non-clickable parent
                    nestedItems: [
                        { label: 'VLOOKUP', path: '/excel?tab=VLOOKUP' },
                        { label: 'HLOOKUP', path: '/excel?tab=HLOOKUP' },
                        { label: 'MATCH', path: '/excel?tab=MATCH' },
                        { label: 'INDEX', path: '/excel?tab=INDEX' },
                        { label: 'CHOOSE', path: '/excel?tab=CHOOSE' },
                    ]
                },
                {
                    label: 'Advanced Functions', path: '#',
                    nestedItems: [
                        { label: 'SUMIF', path: '/excel?tab=SUMIF' },
                        { label: 'SUMIFS', path: '/excel?tab=SUMIFS' },
                        { label: 'COUNTIF', path: '/excel?tab=COUNTIF' },
                        { label: 'COUNTIFS', path: '/excel?tab=COUNTIFS' },
                    ]
                },
                { label: 'Visualisasi Data (Grafik)', path: '/excel-chart' },
            ]
        },
        {
            path: '/mailmerge', label: 'Word Lab', icon: <FileText size={18} />,
            subItems: [
                { label: 'Layout Kertas', path: '/word-layout' },
                { label: 'Perataan Paragraf', path: '/word-paragraph' },
                { label: 'Tabulasi (Penggaris)', path: '/word-tabulator' },
                { label: 'Mail Merge', path: '/mailmerge' },
            ]
        },
        { path: '/game', label: 'Game Lab', icon: <Gamepad2 size={18} /> },
    ];

    return (
        <nav className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo/Brand */}
                    <div className="flex items-center gap-3">
                        <div className="relative group">
                            <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-lg blur opacity-40 group-hover:opacity-100 transition duration-500"></div>
                            <div className="relative flex items-center justify-center">
                                <img src="/logo-vlab.png" alt="Logo" className="w-12 h-12 object-contain drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-black italic tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200 leading-none filter drop-shadow-lg">
                                V-LAB
                            </span>
                            <span className="text-[10px] font-bold text-blue-300 tracking-[0.3em] leading-none ml-0.5">
                                INFORMATIKA
                            </span>
                        </div>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex space-x-1 lg:space-x-4">
                        {navItems.map((item) => (
                            <div key={item.label} className="relative group/main">
                                <Link
                                    to={item.subItems ? '#' : item.path}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${isActive(item.path)
                                        ? 'bg-white text-blue-700 shadow-md scale-105'
                                        : 'text-blue-100 hover:bg-blue-600/50 hover:text-white'
                                        }`}
                                >
                                    {item.icon}
                                    {item.label}
                                    {item.subItems && <ChevronDown size={14} className="opacity-70 group-hover/main:rotate-180 transition-transform" />}
                                </Link>

                                {/* Desktop Dropdown */}
                                {item.subItems && (
                                    <div className="absolute top-full left-0 w-56 pt-2 hidden group-hover/main:block z-50">
                                        <div className="bg-white rounded-xl shadow-xl animate-in fade-in slide-in-from-top-2 border border-blue-100 py-1">
                                            {item.subItems.map((sub, idx) => (
                                                <div key={idx} className="relative group/sub">
                                                    {sub.nestedItems ? (
                                                        // Sub-menu with nested items
                                                        <>
                                                            <button className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 font-bold flex justify-between items-center group-hover/sub:bg-blue-50">
                                                                {sub.label}
                                                                <ChevronRight size={14} className="opacity-50" />
                                                            </button>

                                                            {/* Nested Dropdown (Right Side) */}
                                                            <div className="absolute top-0 left-full w-48 pl-2 hidden group-hover/sub:block">
                                                                <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-blue-100 py-1">
                                                                    {sub.nestedItems.map((nested) => (
                                                                        <Link
                                                                            key={nested.label}
                                                                            to={nested.path}
                                                                            className="block px-4 py-2 text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-700 font-medium transition-colors"
                                                                        >
                                                                            {nested.label}
                                                                        </Link>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        // Regular Sub-item
                                                        <Link
                                                            to={sub.path}
                                                            className="block px-4 py-2 text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-700 font-medium transition-colors"
                                                        >
                                                            {sub.label}
                                                        </Link>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 rounded-lg text-blue-200 hover:bg-blue-600/50 focus:outline-none"
                        >
                            <Menu size={24} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {
                isOpen && (
                    <div className="md:hidden bg-indigo-900/95 backdrop-blur-md px-4 pt-2 pb-6 space-y-2 border-t border-white/10 shadow-inner h-[calc(100vh-4rem)] overflow-y-auto">
                        {navItems.map((item) => (
                            <div key={item.label}>
                                <div className="flex items-center justify-between">
                                    <Link
                                        to={item.subItems ? '#' : item.path}
                                        onClick={() => !item.subItems && setIsOpen(false)}
                                        className={`flex-1 flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${isActive(item.path)
                                            ? 'bg-white/10 text-white border border-white/20'
                                            : 'text-blue-200 hover:bg-white/5 hover:text-white'
                                            }`}
                                    >
                                        {item.icon}
                                        {item.label}
                                    </Link>
                                    {item.subItems && (
                                        <button
                                            onClick={() => toggleMobileSub(item.label)}
                                            className="p-3 text-blue-200 hover:text-white"
                                        >
                                            {expandedMobile === item.label ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                        </button>
                                    )}
                                </div>

                                {/* Mobile Submenu */}
                                {item.subItems && expandedMobile === item.label && (
                                    <div className="ml-4 mt-1 pl-4 border-l border-white/10 space-y-1">
                                        {item.subItems.map((sub, idx) => (
                                            <div key={idx}>
                                                {sub.nestedItems ? (
                                                    <div className="space-y-1 mt-1 mb-2">
                                                        <span className="block px-4 py-1 text-xs font-bold text-blue-400 uppercase tracking-widest opacity-80">
                                                            {sub.label}
                                                        </span>
                                                        {sub.nestedItems.map((nested) => (
                                                            <Link
                                                                key={nested.label}
                                                                to={nested.path}
                                                                onClick={() => setIsOpen(false)}
                                                                className="block px-4 py-2 text-sm text-blue-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                                                            >
                                                                {nested.label}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <Link
                                                        to={sub.path}
                                                        onClick={() => setIsOpen(false)}
                                                        className="block px-4 py-2 text-sm text-blue-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                                                    >
                                                        {sub.label}
                                                    </Link>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )
            }
        </nav >
    );
}

export default Navbar;