import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    Menu, X, Home, Cpu, Hash, FileSpreadsheet,
    Code2, Box, ChevronDown, MonitorPlay
} from 'lucide-react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeSubmenu, setActiveSubmenu] = useState(null);
    const location = useLocation();

    const navItems = [
        { label: 'Beranda', path: '/', icon: <Home size={18} /> },
        {
            label: 'Sistem Komputer',
            icon: <Cpu size={18} />,
            subItems: [
                { label: 'Hardware 3D', path: '/hardware' },
                { label: 'Pemrosesan Data (CPU)', path: '/pemrosesan-data' },
                { label: 'Pengalamatan Memori (RAM)', path: '/pengalamatan-memori' },
                { label: 'File Explorer (Windows)', path: '/explorer' },
            ]
        },
        {
            label: 'Konversi Bilangan',
            icon: <Hash size={18} />,
            subItems: [
                { label: 'Biner (Basis 2)', path: '/biner' },
                { label: 'Oktal (Basis 8)', path: '/oktal' },
                { label: 'Heksadesimal (Basis 16)', path: '/heksadesimal' },
            ]
        },
        {
            label: 'Aplikasi Perkantoran',
            icon: <FileSpreadsheet size={18} />,
            subItems: [
                { label: 'Integrasi Office (Cut/Paste)', path: '/integrasi-office' },
                { label: 'Microsoft Word (Mail Merge)', path: '/mailmerge' },
                { label: 'Microsoft Word (Paragraf)', path: '/word-paragraph' },
                { label: 'Microsoft Word (Layout)', path: '/word-layout' },
                { label: 'Microsoft Word (Tabulator)', path: '/word-tabulator' },
                { label: 'Microsoft Excel (Formula Dasar)', path: '/excel-basic' },
                { label: 'Microsoft Excel (Formula Teks)', path: '/excel-text' },
                { label: 'Microsoft Excel (Lookup)', path: '/excel' },
                { label: 'Microsoft Excel (Sorting)', path: '/excel-sort' },
                { label: 'Microsoft Excel (Chart)', path: '/excel-chart' },
            ]
        },
        {
            label: 'Logika & Koding',
            icon: <Code2 size={18} />,
            subItems: [
                { label: 'Blockly Simulator (IoT)', path: '/blockly' },
                { label: 'Blockly Maze (Game)', path: '/blockly-maze' },
                { label: 'Gerbang Logika', path: '/gerbang-logika' },
            ]
        },
    ];

    const toggleSubmenu = (index) => {
        setActiveSubmenu(activeSubmenu === index ? null : index);
    };

    return (
        <nav className="bg-slate-900 text-white shadow-lg z-50 sticky top-0" role="navigation" aria-label="Main navigation">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between h-16">
                    {/* Logo/Brand */}
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="relative flex items-center justify-center">
                                <img src="/logo-vlab.png" alt="Logo" className="w-12 h-12 object-contain" />
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-xl font-black italic tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200 leading-none filter drop-shadow-lg">
                                V-LAB
                            </span>
                            <span className="text-[10px] font-bold text-blue-300 tracking-[0.3em] leading-none ml-0.5">
                                INFORMATIKA
                            </span>
                        </div>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-1">
                        {navItems.map((item, index) => (
                            <div key={index} className="relative group">
                                {item.subItems ? (
                                    <button
                                        className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-slate-800 ${item.subItems.some(sub => sub.path === location.pathname) ? 'text-blue-400 bg-slate-800' : 'text-slate-300'
                                            }`}
                                        aria-haspopup="true"
                                        aria-expanded="false"
                                        aria-label={`${item.label} menu`}
                                    >
                                        {item.icon}
                                        {item.label}
                                        <ChevronDown size={14} className="opacity-70 group-hover:rotate-180 transition-transform duration-200" />
                                    </button>
                                ) : (
                                    <Link
                                        to={item.path}
                                        className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-slate-800 ${location.pathname === item.path ? 'text-blue-400 bg-slate-800' : 'text-slate-300'
                                            }`}
                                    >
                                        {item.icon}
                                        {item.label}
                                    </Link>
                                )}

                                {/* Desktop Dropdown */}
                                {item.subItems && (
                                    <div className="absolute left-0 mt-0 w-56 bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 origin-top-left transform translate-y-2 group-hover:translate-y-0">
                                        <div className="py-1">
                                            {item.subItems.map((sub, subIdx) => (
                                                <Link
                                                    key={subIdx}
                                                    to={sub.path}
                                                    className={`block px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 border-l-4 border-transparent hover:border-blue-500 transition-all ${location.pathname === sub.path ? 'bg-blue-50 text-blue-700 border-blue-500 font-medium' : ''
                                                        }`}
                                                >
                                                    {sub.label}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-slate-300 hover:text-white p-2"
                            aria-label={isOpen ? 'Close menu' : 'Open menu'}
                            aria-expanded={isOpen}
                            aria-controls="mobile-menu"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div id="mobile-menu" className="md:hidden bg-slate-900 border-t border-slate-800 pb-4 animate-in slide-in-from-top-4 duration-200" role="menu">
                    <div className="px-2 pt-2 space-y-1">
                        {navItems.map((item, index) => (
                            <div key={index}>
                                {item.subItems ? (
                                    <div className="space-y-1">
                                        <button
                                            onClick={() => toggleSubmenu(index)}
                                            className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:bg-slate-800 hover:text-white`}
                                        >
                                            <div className="flex items-center gap-2">
                                                {item.icon}
                                                {item.label}
                                            </div>
                                            <ChevronDown
                                                size={16}
                                                className={`transition-transform duration-200 ${activeSubmenu === index ? 'rotate-180' : ''}`}
                                            />
                                        </button>
                                        {/* Mobile Submenu */}
                                        {activeSubmenu === index && (
                                            <div className="pl-10 pr-2 space-y-1 border-l-2 border-slate-800 ml-4">
                                                {item.subItems.map((sub, subIdx) => (
                                                    <Link
                                                        key={subIdx}
                                                        to={sub.path}
                                                        onClick={() => setIsOpen(false)}
                                                        className={`block px-3 py-2 rounded-md text-sm transition-colors ${location.pathname === sub.path
                                                            ? 'text-blue-400 bg-slate-800/50 font-medium'
                                                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                                                            }`}
                                                    >
                                                        {sub.label}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <Link
                                        to={item.path}
                                        onClick={() => setIsOpen(false)}
                                        className={`flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium ${location.pathname === item.path
                                            ? 'text-blue-400 bg-slate-800'
                                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                            }`}
                                    >
                                        {item.icon}
                                        {item.label}
                                    </Link>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
