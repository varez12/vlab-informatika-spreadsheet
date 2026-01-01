import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Table, Grid, List, HelpCircle, ArrowRight, MousePointer2, Info,
  Settings2, Edit3, Lightbulb, Play, RotateCcw, ArrowUp, RotateCw,
  RotateCcw as RotateLeft, Repeat, Trash2, CheckCircle2, Flag, Bot,
  Trophy, Star, ChevronRight, Split, GitBranch, Layers, Zap, Target,
  Navigation, BookOpen, X, Sparkles, Cpu, Code2, AlertCircle, LayoutGrid, Home, Code, Menu, ChevronDown
} from 'lucide-react';

// ============================================================
// MODUL 1: SPREADSHEET LAB (VERSI PALING LENGKAP & DETAIL)
// ============================================================
const SpreadsheetLab = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const tabParam = searchParams.get('tab');

  const [activeTab, setActiveTab] = useState(tabParam || 'VLOOKUP');

  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);
  const [highlightedCells, setHighlightedCells] = useState([]);
  const [result, setResult] = useState(null);

  const verticalData = [
    ['ID', 'Menu', 'Harga', 'Stok'],
    ['K01', 'Nasi Goreng', '15000', '10'],
    ['K02', 'Mie Ayam', '12000', '15'],
    ['K03', 'Es Teh', '5000', '50'],
    ['K04', 'Soto Ayam', '13000', '8']
  ];

  const horizontalData = [
    ['Bulan', 'Jan', 'Feb', 'Mar', 'Apr'],
    ['Omzet', '200k', '250k', '210k', '300k']
  ];

  const chooseData = [['Diskon 5%', 'Diskon 10%', 'Diskon 15%']];

  const [inputs, setInputs] = useState({
    vlookupValue: 'K02', vlookupCol: '2', vlookupRange: 'FALSE',
    hlookupValue: 'Mar', hlookupRow: '2', hlookupRange: 'FALSE',
    matchValue: 'Es Teh', matchArray: 'B1:B5', matchType: '0',
    indexRow: '3', indexCol: '2',
    chooseIndex: '1',
    countifCriteria: '>10',
    sumifCriteria: '>10000',
    countifsCrit1: '>5000', countifsCrit2: '<15',
    sumifsCrit1: '>10000', sumifsCrit2: '<15'
  });

  const getMatchOptions = () => {
    if (inputs.matchArray?.includes('A')) return verticalData.slice(1).map(r => r[0]);
    if (inputs.matchArray?.includes('B')) return verticalData.slice(1).map(r => r[1]);
    if (inputs.matchArray?.includes('C')) return verticalData.slice(1).map(r => r[2]);
    return [];
  };

  const evaluateCriteria = (value, criteria) => {
    const numVal = parseFloat(value);
    if (criteria.startsWith('>=')) return numVal >= parseFloat(criteria.slice(2));
    if (criteria.startsWith('<=')) return numVal <= parseFloat(criteria.slice(2));
    if (criteria.startsWith('>')) return numVal > parseFloat(criteria.slice(1));
    if (criteria.startsWith('<')) return numVal < parseFloat(criteria.slice(1));
    return value.toString().toLowerCase() === criteria.toLowerCase();
  };

  const runSimulation = () => {
    let cells = [];
    let res = "";
    try {
      if (activeTab === 'VLOOKUP') {
        const rowIndex = verticalData.findIndex(row => row[0] === inputs.vlookupValue);
        const colIdx = parseInt(inputs.vlookupCol);
        if (rowIndex !== -1 && colIdx >= 1 && colIdx <= 4) {
          cells = [`v-r${rowIndex}-c0`, `v-r${rowIndex}-c${colIdx - 1}`];
          res = verticalData[rowIndex][colIdx - 1];
        } else res = rowIndex === -1 ? "#N/A" : "#REF!";
      }
      else if (activeTab === 'HLOOKUP') {
        const colIndex = horizontalData[0].findIndex(col => col === inputs.hlookupValue);
        const rowIdx = parseInt(inputs.hlookupRow);
        if (colIndex !== -1 && rowIdx >= 1 && rowIdx <= 2) {
          cells = [`h-r0-c${colIndex}`, `h-r${rowIdx - 1}-c${colIndex}`];
          res = horizontalData[rowIdx - 1][colIndex];
        } else res = colIndex === -1 ? "#N/A" : "#REF!";
      }
      else if (activeTab === 'MATCH') {
        const colToSearch = inputs.matchArray?.includes('A') ? 0 : inputs.matchArray?.includes('C') ? 2 : 1;
        const rowIndex = verticalData.findIndex(row => row[colToSearch].toString().toLowerCase() === inputs.matchValue.toLowerCase());
        if (rowIndex !== -1) { cells = [`v-r${rowIndex}-c${colToSearch}`]; res = rowIndex + 1; } else res = "#N/A";
      }
      else if (activeTab === 'INDEX') {
        const r = parseInt(inputs.indexRow) - 1;
        const c = parseInt(inputs.indexCol) - 1;
        if (verticalData[r] && verticalData[r][c] !== undefined) { cells = [`v-r${r}-c${c}`]; res = verticalData[r][c]; } else res = "#REF!";
      }
      else if (activeTab === 'CHOOSE') {
        const idx = parseInt(inputs.chooseIndex) - 1;
        if (chooseData[0][idx]) { cells = [`c-r0-c${idx}`]; res = chooseData[0][idx]; } else res = "#VALUE!";
      }
      else if (activeTab === 'COUNTIF') {
        let count = 0;
        verticalData.slice(1).forEach((row, i) => {
          if (evaluateCriteria(row[3], inputs.countifCriteria)) { count++; cells.push(`v-r${i + 1}-c3`); }
        });
        res = count;
      }
      else if (activeTab === 'SUMIF') {
        let sum = 0;
        verticalData.slice(1).forEach((row, i) => {
          if (evaluateCriteria(row[2], inputs.sumifCriteria)) { sum += parseFloat(row[2]); cells.push(`v-r${i + 1}-c2`); }
        });
        res = sum;
      }
      else if (activeTab === 'COUNTIFS') {
        let count = 0;
        verticalData.slice(1).forEach((row, i) => {
          if (evaluateCriteria(row[2], inputs.countifsCrit1) && evaluateCriteria(row[3], inputs.countifsCrit2)) {
            count++; cells.push(`v-r${i + 1}-c2`, `v-r${i + 1}-c3`);
          }
        });
        res = count;
      }
      else if (activeTab === 'SUMIFS') {
        let sum = 0;
        verticalData.slice(1).forEach((row, i) => {
          if (evaluateCriteria(row[2], inputs.sumifsCrit1) && evaluateCriteria(row[3], inputs.sumifsCrit2)) {
            sum += parseFloat(row[3]); cells.push(`v-r${i + 1}-c2`, `v-r${i + 1}-c3`);
          }
        });
        res = sum;
      }
    } catch (e) { res = "#ERROR!"; }
    setHighlightedCells(cells);
    setResult(res);
  };

  useEffect(() => { runSimulation(); }, [activeTab, inputs]);

  const tabs = ['VLOOKUP', 'HLOOKUP', 'MATCH', 'INDEX', 'CHOOSE', 'COUNTIF', 'SUMIF', 'COUNTIFS', 'SUMIFS'];

  const getFormulaInfo = () => {
    switch (activeTab) {
      case 'VLOOKUP': return { title: "Vertical Lookup", desc: "Mencari data ke bawah pada kolom pertama, lalu mengambil nilai di baris yang sama pada kolom tertentu.", syntax: "=VLOOKUP(nilai_dicari; tabel; nomor_kolom; [range_lookup])", challenge: "Ganti col_index_num menjadi 3. Perhatikan bagaimana highlight berpindah ke kolom Harga." };
      case 'HLOOKUP': return { title: "Horizontal Lookup", desc: "Mencari data ke samping pada baris pertama, lalu mengambil nilai di kolom yang sama pada baris tertentu.", syntax: "=HLOOKUP(nilai_dicari; tabel; nomor_baris; [range_lookup])", challenge: "Ubah lookup_value menjadi 'Apr'. Tabel akan mencari omzet untuk bulan April secara horizontal." };
      case 'MATCH': return { title: "Match Function", desc: "Mencari posisi atau nomor urut suatu nilai di dalam daftar atau rentang sel.", syntax: "=MATCH(nilai_dicari; rentang_data; 0)", challenge: "Ganti lookup_array ke 'Kolom Menu'. Posisi data akan berubah sesuai urutan di kolom B." };
      case 'INDEX': return { title: "Index Function", desc: "Mengambil nilai dari sebuah sel berdasarkan koordinat nomor baris dan nomor kolom.", syntax: "=INDEX(rentang_tabel; nomor_baris; nomor_kolom)", challenge: "Masukkan baris 1 dan kolom 2. Komputer akan mengambil teks 'Menu' karena itu header baris 1." };
      case 'CHOOSE': return { title: "Choose Function", desc: "Memilih satu nilai dari daftar pilihan berdasarkan angka urut (index) yang diberikan.", syntax: "=CHOOSE(indeks; pilihan1; pilihan2; ...)", challenge: "Ubah index_num menjadi 3. Komputer akan otomatis memilih 'Diskon 15%' dari pilihan tersedia." };
      case 'COUNTIF': return { title: "Countif Function", desc: "Menghitung jumlah sel yang memenuhi satu kriteria atau syarat tertentu.", syntax: "=COUNTIF(rentang; kriteria)", challenge: "Ganti kriteria menjadi '<15'. Berapa sel yang memenuhi syarat stok di bawah 15?" };
      case 'SUMIF': return { title: "Sumif Function", desc: "Menjumlahkan nilai dalam rentang yang memenuhi satu kriteria atau syarat tertentu.", syntax: "=SUMIF(rentang; kriteria; [rentang_jumlah])", challenge: "Coba kriteria '<=12000'. Sistem akan menjumlahkan harga semua menu yang tidak lebih dari 12rb." };
      case 'COUNTIFS': return { title: "Countifs Function", desc: "Menghitung jumlah sel berdasarkan banyak kriteria sekaligus (Kriteria 1 DAN Kriteria 2).", syntax: "=COUNTIFS(r1; k1; r2; k2; ...)", challenge: "Set kriteria harga >12000 dan stok >10. Hitung berapa menu mahal yang stoknya masih aman." };
      case 'SUMIFS': return { title: "Sumifs Function", desc: "Menjumlahkan nilai sel berdasarkan banyak kriteria sekaligus (Syarat 1 DAN Syarat 2).", syntax: "=SUMIFS(rentang_jumlah; r1; k1; r2; k2; ...)", challenge: "Ubah kriteria stok menjadi '>5'. Sistem akan menjumlahkan stok menu yang memenuhi kedua syarat." };
      default: return { title: activeTab, desc: "Fungsi referensi dan statistik spreadsheet.", syntax: "Formula", challenge: "Bereksperimenlah dengan parameter input." };
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-50 font-sans text-slate-800 p-4 md:p-8 overflow-y-auto text-left custom-scrollbar">
      <header className="h-24 mb-6 border-b border-slate-200 flex flex-col justify-center shrink-0">
        <div className="flex items-center gap-2 mb-1 pr-16 md:pr-0">
          <Settings2 className="text-green-600 w-7 h-7 shrink-0" />
          <h1 className="text-xl md:text-2xl font-bold uppercase tracking-tight text-slate-900 truncate">Spreadsheet Pro</h1>
        </div>
        <p className="text-slate-500 text-xs md:text-sm italic font-medium opacity-80">Anatomi formula pencarian data dan statistik bersyarat secara mendalam.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-green-600 text-white p-6 rounded-2xl shadow-md border-b-4 border-green-700">
            <h2 className="flex items-center gap-2 font-bold text-lg mb-2"><BookOpen className="w-5 h-5 text-green-200" /> {getFormulaInfo().title}</h2>
            <p className="text-sm opacity-90 mb-4 leading-relaxed">{getFormulaInfo().desc}</p>
            <div className="bg-green-800/40 p-4 rounded-xl font-mono text-xs border border-white/10 select-all tracking-wider">
              {getFormulaInfo().syntax}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Grid size={14} /> Worksheet View</h2>
            <div className="overflow-x-auto rounded-lg border border-slate-200 mb-6 shadow-sm">
              <table className="w-full border-collapse text-sm text-center">
                <thead>
                  <tr className="bg-slate-100 text-slate-500">
                    <th className="border border-slate-200 p-1 w-10 text-[10px] bg-slate-50 font-bold"></th>
                    {['A', 'B', 'C', 'D'].map(l => <th key={l} className="border border-slate-200 p-1 font-bold">{l}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {verticalData.map((row, rIdx) => (
                    <tr key={rIdx}>
                      <td className="border border-slate-200 p-1 text-[10px] text-slate-400 bg-slate-50 font-bold">{rIdx + 1}</td>
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className={`border border-slate-200 p-2 transition-all duration-300 ${highlightedCells.includes(`v-r${rIdx}-c${cIdx}`) ? 'bg-yellow-100 border-yellow-500 font-bold text-yellow-900 ring-2 ring-yellow-400 ring-inset' : 'bg-white'}`}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {activeTab === 'CHOOSE' && (
              <div className="mt-4 overflow-x-auto">
                <p className="text-[10px] text-slate-500 mb-1 italic font-medium">Data Lepas: Range A14:C14</p>
                <table className="border-collapse text-sm min-w-full">
                  <tbody>
                    <tr>
                      <td className="border border-slate-200 p-1 text-center text-[10px] text-slate-400 bg-slate-50 font-bold w-10">14</td>
                      {chooseData[0].map((cell, cIdx) => (
                        <td key={cIdx} className={`border border-slate-200 p-2 text-center transition-all duration-300 ${highlightedCells.includes(`c-r0-c${cIdx}`) ? 'bg-purple-100 border-purple-500 ring-2 ring-purple-400 ring-inset font-bold text-purple-900' : 'bg-white text-slate-400'}`}>{cell}</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-md border-t-4 border-green-500 overflow-hidden text-center">
            <div className="bg-slate-900 px-4 py-3 flex items-center gap-3 overflow-x-auto border-b border-slate-800 text-left">
              <span className="italic font-serif text-green-400 font-bold text-lg">fx</span>
              <div className="font-mono text-sm text-slate-300 whitespace-nowrap">
                {activeTab === 'VLOOKUP' && `=VLOOKUP("${inputs.vlookupValue}"; A1:D5; ${inputs.vlookupCol}; ${inputs.vlookupRange})`}
                {activeTab === 'HLOOKUP' && `=HLOOKUP("${inputs.hlookupValue}"; A10:E11; ${inputs.hlookupRow}; ${inputs.hlookupRange})`}
                {activeTab === 'MATCH' && `=MATCH("${inputs.matchValue}"; ${inputs.matchArray}; 0)`}
                {activeTab === 'INDEX' && `=INDEX(A1:D5; ${inputs.indexRow}; ${inputs.indexCol})`}
                {activeTab === 'CHOOSE' && `=CHOOSE(${inputs.chooseIndex}; A14; B14; C14)`}
                {activeTab === 'COUNTIF' && `=COUNTIF(D2:D5; "${inputs.countifCriteria}")`}
                {activeTab === 'SUMIF' && `=SUMIF(C2:C5; "${inputs.sumifCriteria}"; C2:C5)`}
                {activeTab === 'COUNTIFS' && `=COUNTIFS(C2:C5; "${inputs.countifsCrit1}"; D2:D5; "${inputs.countifsCrit2}")`}
                {activeTab === 'SUMIFS' && `=SUMIFS(D2:D5; C2:C5; "${inputs.sumifsCrit1}"; D2:D5; "${inputs.sumifsCrit2}")`}
              </div>
            </div>
            <div className="p-10 bg-green-50/20">
              <span className="text-[10px] font-bold text-green-700 uppercase tracking-widest block mb-2">Output Terkalkulasi</span>
              <div className="text-6xl font-mono font-black text-slate-900 drop-shadow-sm">{result}</div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm sticky top-4 overflow-y-auto max-h-[85vh] custom-scrollbar text-left">
            <div className="flex gap-1.5 mb-8 flex-wrap">
              {tabs.map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`px-2.5 py-1.5 rounded-full text-[9px] font-bold transition-all ${activeTab === tab ? 'bg-green-600 text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>{tab}</button>
              ))}
            </div>

            <h3 className="text-xs font-bold text-slate-400 uppercase mb-4 flex items-center gap-2 border-b border-slate-50 pb-2"><Edit3 size={14} /> Konfigurasi Argumen</h3>

            <div className="space-y-6">
              {activeTab === 'VLOOKUP' && (
                <>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-tighter">lookup_value:</label>
                    <select value={inputs.vlookupValue} onChange={(e) => setInputs({ ...inputs, vlookupValue: e.target.value })} className="w-full p-2 bg-blue-50 border border-blue-200 rounded-md text-sm font-bold appearance-none outline-none">
                      {verticalData.slice(1).map(r => <option key={r[0]} value={r[0]}>{r[0]}</option>)}
                    </select>
                    <p className="text-[9px] text-slate-400 mt-1 italic leading-tight">Nilai kunci yang ingin dicari di kolom pertama tabel (ID).</p>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-tighter">col_index_num:</label>
                    <input type="number" value={inputs.vlookupCol} onChange={(e) => setInputs({ ...inputs, vlookupCol: e.target.value })} className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md text-sm font-mono focus:ring-2 ring-green-500 outline-none" />
                    <p className="text-[9px] text-slate-400 mt-1 italic leading-tight">Nomor kolom data yang ingin diambil (1 s.d 4).</p>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-tighter">range_lookup:</label>
                    <select value={inputs.vlookupRange} onChange={(e) => setInputs({ ...inputs, vlookupRange: e.target.value })} className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md text-sm font-bold uppercase outline-none">
                      <option value="FALSE">FALSE (Sama Persis)</option>
                      <option value="TRUE">TRUE (Mendekati)</option>
                    </select>
                    <p className="text-[9px] text-slate-400 mt-1 italic">Pilih FALSE untuk pencarian data yang identik.</p>
                  </div>
                </>
              )}
              {activeTab === 'HLOOKUP' && (
                <>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-tighter">lookup_value:</label>
                    <select value={inputs.hlookupValue} onChange={(e) => setInputs({ ...inputs, hlookupValue: e.target.value })} className="w-full p-2 bg-emerald-50 border border-emerald-200 rounded-md text-sm font-bold outline-none">
                      {horizontalData[0].slice(1).map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                    <p className="text-[9px] text-slate-400 mt-1 italic leading-tight">Nilai kunci di baris pertama tabel horizontal (Bulan).</p>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-tighter">row_index_num:</label>
                    <input type="number" value={inputs.hlookupRow} onChange={(e) => setInputs({ ...inputs, hlookupRow: e.target.value })} className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md text-sm font-mono focus:ring-2 ring-green-500 outline-none" />
                    <p className="text-[9px] text-slate-400 mt-1 italic leading-tight">Nomor baris hasil yang ingin diambil (1:Bulan, 2:Omzet).</p>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-tighter">range_lookup:</label>
                    <select value={inputs.hlookupRange} onChange={(e) => setInputs({ ...inputs, hlookupRange: e.target.value })} className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md text-sm font-bold uppercase outline-none">
                      <option value="FALSE">FALSE (Sama Persis)</option>
                      <option value="TRUE">TRUE (Mendekati)</option>
                    </select>
                  </div>
                </>
              )}
              {activeTab === 'MATCH' && (
                <>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-tighter">lookup_array:</label>
                    <select value={inputs.matchArray} onChange={(e) => setInputs({ ...inputs, matchArray: e.target.value })} className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md text-sm font-bold outline-none">
                      <option value="A1:A5">A1:A5 (Kolom ID)</option>
                      <option value="B1:B5">B1:B5 (Kolom Menu)</option>
                      <option value="C1:C5">C1:C5 (Kolom Harga)</option>
                    </select>
                    <p className="text-[9px] text-blue-600 mt-1 italic font-semibold leading-tight">Rentang sel atau daftar tempat komputer mencari data.</p>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-tighter">lookup_value:</label>
                    <select value={inputs.matchValue} onChange={(e) => setInputs({ ...inputs, matchValue: e.target.value })} className="w-full p-2 bg-amber-50 border border-amber-200 rounded-md text-sm font-bold appearance-none outline-none">
                      {getMatchOptions().map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                    <p className="text-[9px] text-slate-400 mt-1 italic leading-tight">Data yang ingin diketahui nomor urut barisnya.</p>
                  </div>
                </>
              )}
              {activeTab === 'INDEX' && (
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-tighter">row_num:</label>
                    <input type="number" value={inputs.indexRow} onChange={(e) => setInputs({ ...inputs, indexRow: e.target.value })} className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md text-sm font-mono focus:ring-2 ring-green-500 outline-none" />
                    <p className="text-[9px] text-slate-400 mt-1 italic leading-tight">Nomor koordinat baris dalam tabel (1 s.d 5).</p>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-tighter">column_num:</label>
                    <input type="number" value={inputs.indexCol} onChange={(e) => setInputs({ ...inputs, indexCol: e.target.value })} className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md text-sm font-mono focus:ring-2 ring-green-500 outline-none" />
                    <p className="text-[9px] text-slate-400 mt-1 italic leading-tight">Nomor koordinat kolom dalam tabel (1 s.d 4).</p>
                  </div>
                </div>
              )}
              {activeTab === 'CHOOSE' && (
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-tighter">index_num:</label>
                  <input type="number" value={inputs.chooseIndex} onChange={(e) => setInputs({ ...inputs, chooseIndex: e.target.value })} className="w-full p-2 bg-purple-50 border border-purple-200 rounded-md text-sm font-bold outline-none" />
                  <p className="text-[9px] text-slate-400 mt-1 italic leading-tight">Pilih nomor urut data (1-3) dari pilihan di baris 14.</p>
                </div>
              )}
              {activeTab === 'COUNTIF' && (
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-tighter">Kriteria Stok (D2:D5):</label>
                  <select value={inputs.countifCriteria} onChange={(e) => setInputs({ ...inputs, countifCriteria: e.target.value })} className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md text-sm font-bold outline-none">
                    <option value=">10">Stok &gt; 10</option>
                    <option value="<15">Stok &lt; 15</option>
                    <option value=">=15">Stok &gt;= 15</option>
                  </select>
                  <p className="text-[9px] text-slate-400 mt-1 italic leading-tight">Menghitung jumlah sel yang memenuhi kriteria angka.</p>
                </div>
              )}
              {activeTab === 'SUMIF' && (
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-tighter">Kriteria Harga (C2:C5):</label>
                  <select value={inputs.sumifCriteria} onChange={(e) => setInputs({ ...inputs, sumifCriteria: e.target.value })} className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md text-sm font-bold outline-none">
                    <option value=">10000">Harga &gt; 10rb</option>
                    <option value="<=12000">Harga &lt;= 12rb</option>
                  </select>
                  <p className="text-[9px] text-slate-400 mt-1 italic leading-tight">Menjumlahkan harga jika syarat nilai terpenuhi.</p>
                </div>
              )}
              {activeTab === 'COUNTIFS' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Syarat 1 (Harga):</label>
                    <select value={inputs.countifsCrit1} onChange={(e) => setInputs({ ...inputs, countifsCrit1: e.target.value })} className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md text-sm font-bold outline-none">
                      <option value=">5000">Harga &gt; 5rb</option>
                      <option value=">12000">Harga &gt; 12rb</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Syarat 2 (Stok):</label>
                    <select value={inputs.countifsCrit2} onChange={(e) => setInputs({ ...inputs, countifsCrit2: e.target.value })} className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md text-sm font-bold outline-none">
                      <option value="<15">Stok &lt; 15</option>
                      <option value=">10">Stok &gt; 10</option>
                    </select>
                  </div>
                  <p className="text-[9px] text-slate-400 mt-1 italic">Menghitung jika KEDUA syarat terpenuhi sekaligus.</p>
                </div>
              )}
              {activeTab === 'SUMIFS' && (
                <div className="space-y-4 text-left">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-tighter">Syarat 1 (Harga):</label>
                    <select value={inputs.sumifsCrit1} onChange={(e) => setInputs({ ...inputs, sumifsCrit1: e.target.value })} className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md text-sm font-bold outline-none">
                      <option value=">10000">Harga &gt; 10rb</option>
                      <option value=">5000">Harga &gt; 5rb</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-tighter">Syarat 2 (Stok):</label>
                    <select value={inputs.sumifsCrit2} onChange={(e) => setInputs({ ...inputs, sumifsCrit2: e.target.value })} className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md text-sm font-bold outline-none">
                      <option value="<15">Stok &lt; 15</option>
                      <option value=">5">Stok &gt; 5</option>
                    </select>
                  </div>
                  <p className="text-[9px] text-slate-400 mt-1 italic leading-tight">Menjumlahkan Stok jika kriteria harga dan stok tercapai.</p>
                </div>
              )}
            </div>

            {/* BOX TANTANGAN PRAKTIKUM */}
            <div className="mt-8 pt-6 border-t border-slate-100">
              <div className="bg-yellow-50 p-5 rounded-xl border border-yellow-200 shadow-sm">
                <h4 className="text-yellow-800 text-[11px] font-bold mb-2 flex items-center gap-2 uppercase tracking-wider">
                  <Lightbulb size={16} className="text-yellow-600" /> Tantangan Praktikum
                </h4>
                <p className="text-[11px] text-yellow-700 leading-relaxed font-medium">
                  {getFormulaInfo().challenge}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpreadsheetLab;