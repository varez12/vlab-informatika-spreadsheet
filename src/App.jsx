import React, { useState, useEffect } from 'react';
import { Table, Grid, List, HelpCircle, ArrowRight, MousePointer2, Info, Settings2, Edit3, Lightbulb, ChevronDown } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('VLOOKUP');
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
    vlookupValue: 'K02',
    vlookupCol: '2',
    vlookupRange: 'FALSE',
    hlookupValue: 'Mar',
    hlookupRow: '2',
    hlookupRange: 'FALSE',
    matchValue: 'Es Teh',
    matchArray: 'B1:B5',
    matchType: '0',
    indexRow: '3',
    indexCol: '2',
    chooseIndex: '1'
  });

  // Helper to get options for MATCH based on selected array
  const getMatchOptions = () => {
    if (inputs.matchArray.includes('A')) return verticalData.slice(1).map(r => r[0]);
    if (inputs.matchArray.includes('B')) return verticalData.slice(1).map(r => r[1]);
    if (inputs.matchArray.includes('C')) return verticalData.slice(1).map(r => r[2]);
    return [];
  };

  const runSimulation = () => {
    let cells = [];
    let res = "";

    try {
      if (activeTab === 'VLOOKUP') {
        const colIdx = parseInt(inputs.vlookupCol);
        const rowIndex = verticalData.findIndex(row => row[0] === inputs.vlookupValue);
        
        if (isNaN(colIdx) || colIdx < 1 || colIdx > 4) {
          res = "#REF!";
        } else if (rowIndex !== -1) {
          cells = [`v-r${rowIndex}-c0`, `v-r${rowIndex}-c${colIdx - 1}`];
          res = verticalData[rowIndex][colIdx - 1];
        } else {
          res = "#N/A";
        }
      } 
      else if (activeTab === 'HLOOKUP') {
        const rowIdx = parseInt(inputs.hlookupRow);
        const colIndex = horizontalData[0].findIndex(col => col === inputs.hlookupValue);
        
        if (isNaN(rowIdx) || rowIdx < 1 || rowIdx > 2) {
          res = "#REF!";
        } else if (colIndex !== -1) {
          cells = [`h-r0-c${colIndex}`, `h-r${rowIdx - 1}-c${colIndex}`];
          res = horizontalData[rowIdx - 1][colIndex];
        } else {
          res = "#N/A";
        }
      }
      else if (activeTab === 'MATCH') {
        let colToSearch = 1; 
        if (inputs.matchArray.includes('A')) colToSearch = 0;
        if (inputs.matchArray.includes('C')) colToSearch = 2;
        
        const rowIndex = verticalData.findIndex(row => row[colToSearch].toString().toLowerCase() === inputs.matchValue.toLowerCase());
        
        if (rowIndex !== -1) {
          cells = [`v-r${rowIndex}-c${colToSearch}`];
          res = rowIndex + 1;
        } else {
          res = "#N/A";
        }
      }
      else if (activeTab === 'INDEX') {
        const r = parseInt(inputs.indexRow) - 1;
        const c = parseInt(inputs.indexCol) - 1;
        if (!isNaN(r) && !isNaN(c) && verticalData[r] && verticalData[r][c] !== undefined) {
          cells = [`v-r${r}-c${c}`];
          res = verticalData[r][c];
        } else {
          res = "#REF!";
        }
      }
      else if (activeTab === 'CHOOSE') {
        const idx = parseInt(inputs.chooseIndex) - 1;
        if (!isNaN(idx) && chooseData[0][idx]) {
          cells = [`c-r0-c${idx}`];
          res = chooseData[0][idx];
        } else {
          res = "#VALUE!";
        }
      }
    } catch (e) {
      res = "#ERROR!";
    }

    setHighlightedCells(cells);
    setResult(res);
  };

  useEffect(() => {
    runSimulation();
  }, [activeTab, inputs]);

  const colLetters = ['A', 'B', 'C', 'D', 'E', 'F'];

  const getDynamicTips = () => {
    switch(activeTab) {
      case 'VLOOKUP': return "Pilih ID dari dropdown. Perhatikan bagaimana highlight berpindah secara vertikal sesuai baris ID yang dipilih.";
      case 'HLOOKUP': return "Gunakan dropdown untuk memilih Bulan. HLOOKUP akan mencari secara horizontal pada baris pertama.";
      case 'MATCH': return "Ganti 'lookup_array' dan lihat bagaimana daftar pilihan di 'lookup_value' berubah otomatis secara dinamis.";
      case 'INDEX': return "INDEX bekerja dengan koordinat. Masukkan angka baris dan kolom untuk menunjuk sel tertentu.";
      case 'CHOOSE': return "Ganti index_num (1-3) untuk memilih diskon yang tersedia di baris 14.";
      default: return "Eksperimen dengan parameter formula untuk melihat hasil real-time.";
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-800 p-4 md:p-8">
      <header className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-green-600 p-2 rounded-lg shadow-sm">
              <Settings2 className="text-white w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">V-Lab Informatika: <span className="text-green-600">Spreadsheet Lab</span></h1>
          </div>
          <p className="text-slate-500 text-sm italic">Simulasi interaktif algoritma pencarian data spreadsheet.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Grid className="w-4 h-4" /> Spreadsheet View
            </h2>
            
            {/* Tabel Vertikal */}
            <div className="overflow-x-auto rounded-lg border border-slate-200 mb-6 shadow-sm">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="border border-slate-200 p-1 w-10 text-[10px] text-slate-400 bg-slate-50"></th>
                    {verticalData[0].map((_, i) => (<th key={i} className="border border-slate-200 p-1 text-center font-normal text-slate-500 bg-slate-50 w-32">{colLetters[i]}</th>))}
                  </tr>
                </thead>
                <tbody>
                  {verticalData.map((row, rIdx) => (
                    <tr key={rIdx}>
                      <td className="border border-slate-200 p-1 text-center text-[10px] text-slate-400 bg-slate-50 font-bold">{rIdx + 1}</td>
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className={`border border-slate-200 p-2 transition-all duration-300 ${highlightedCells.includes(`v-r${rIdx}-c${cIdx}`) ? 'bg-yellow-100 border-yellow-500 ring-2 ring-yellow-400 ring-inset font-bold text-yellow-900' : 'bg-white'} ${rIdx === 0 ? 'font-bold bg-slate-50/50 text-slate-600' : ''}`}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Tabel Horizontal */}
            <div className="overflow-x-auto rounded-lg border border-slate-200 mb-6 shadow-sm">
              <table className="border-collapse text-sm min-w-full">
                <tbody>
                   <tr className="bg-slate-100">
                    <th className="border border-slate-200 p-1 w-10 text-[10px] text-slate-400 bg-slate-50"></th>
                    {horizontalData[0].map((_, i) => (<th key={i} className="border border-slate-200 p-1 text-center font-normal text-slate-500 bg-slate-50">{colLetters[i]}</th>))}
                  </tr>
                  {horizontalData.map((row, rIdx) => (
                    <tr key={rIdx}>
                      <td className="border border-slate-200 p-1 text-center text-[10px] text-slate-400 bg-slate-50 font-bold">{rIdx + 10}</td>
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className={`border border-slate-200 p-2 min-w-[80px] transition-all duration-300 ${highlightedCells.includes(`h-r${rIdx}-c${cIdx}`) ? 'bg-emerald-100 border-emerald-500 ring-2 ring-emerald-400 ring-inset font-bold text-emerald-900' : 'bg-white'} ${rIdx === 0 ? 'font-bold bg-slate-50/50 text-slate-600' : ''}`}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Tabel CHOOSE */}
            <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
              <MousePointer2 className="w-3 h-3 text-purple-500" /> Opsi CHOOSE (A14:C14)
            </h2>
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="border-collapse text-sm min-w-full">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="border border-slate-200 p-1 w-10 text-[10px] text-slate-400 bg-slate-50"></th>
                    {chooseData[0].map((_, i) => (<th key={i} className="border border-slate-200 p-1 text-center font-normal text-slate-500 bg-slate-50">{colLetters[i]}</th>))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-slate-200 p-1 text-center text-[10px] text-slate-400 bg-slate-50 font-bold">14</td>
                    {chooseData[0].map((cell, cIdx) => (
                      <td key={cIdx} className={`border border-slate-200 p-2 min-w-[100px] text-center transition-all duration-300 ${highlightedCells.includes(`c-r0-c${cIdx}`) ? 'bg-purple-100 border-purple-500 ring-2 ring-purple-400 ring-inset font-bold text-purple-900' : 'bg-white text-slate-400'}`}>{cell}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md border-t-4 border-green-500 overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center gap-2 overflow-x-auto">
              <span className="italic font-serif text-slate-400 font-bold text-lg">fx</span>
              <div className="h-6 w-[1px] bg-slate-300 mx-2 flex-shrink-0"></div>
              <div className="font-mono text-sm text-slate-700 whitespace-nowrap py-1">
                {activeTab === 'VLOOKUP' && `=VLOOKUP("${inputs.vlookupValue}"; A1:D5; ${inputs.vlookupCol}; ${inputs.vlookupRange})`}
                {activeTab === 'HLOOKUP' && `=HLOOKUP("${inputs.hlookupValue}"; A10:E11; ${inputs.hlookupRow}; ${inputs.hlookupRange})`}
                {activeTab === 'MATCH' && `=MATCH("${inputs.matchValue}"; ${inputs.matchArray}; ${inputs.matchType})`}
                {activeTab === 'INDEX' && `=INDEX(A1:D5; ${inputs.indexRow}; ${inputs.indexCol})`}
                {activeTab === 'CHOOSE' && `=CHOOSE(${inputs.chooseIndex}; A14; B14; C14)`}
              </div>
            </div>
            <div className="p-8 flex flex-col items-center justify-center bg-green-50/20">
               <span className="text-[10px] font-bold text-green-700 uppercase mb-2 tracking-widest">Output Terkalkulasi</span>
               <div className="text-4xl md:text-5xl font-mono font-black text-slate-900 drop-shadow-sm">{result}</div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 sticky top-4">
            <div className="flex gap-2 mb-8 flex-wrap">
              {['VLOOKUP', 'HLOOKUP', 'MATCH', 'INDEX', 'CHOOSE'].map((tab) => (
                <button 
                  key={tab} 
                  onClick={() => setActiveTab(tab)} 
                  className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition-all ${activeTab === tab ? 'bg-green-600 text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <h3 className="text-xs font-bold text-slate-400 uppercase mb-4 flex items-center gap-2">
              <Edit3 className="w-3 h-3"/> Edit Argumen Formula
            </h3>

            <div className="space-y-6">
              {activeTab === 'VLOOKUP' && (
                <>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">lookup_value:</label>
                    <div className="relative">
                      <select 
                        value={inputs.vlookupValue} 
                        onChange={(e) => setInputs({...inputs, vlookupValue: e.target.value})} 
                        className="w-full p-2 bg-blue-50 border border-blue-200 rounded-md text-sm font-bold text-blue-800 appearance-none focus:ring-2 ring-green-500 outline-none"
                      >
                        {verticalData.slice(1).map(r => <option key={r[0]} value={r[0]}>{r[0]}</option>)}
                      </select>
                      <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 text-blue-400 pointer-events-none" />
                    </div>
                    <p className="text-[9px] text-slate-400 mt-1 italic leading-tight">Keterangan: Daftar ID dari kolom A.</p>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">col_index_num:</label>
                    <input type="number" value={inputs.vlookupCol} onChange={(e) => setInputs({...inputs, vlookupCol: e.target.value})} className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md text-sm font-mono focus:ring-2 ring-green-500 outline-none" />
                    <p className="text-[9px] text-slate-400 mt-1 italic leading-tight">Keterangan: Nomor kolom hasil (1-4).</p>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">range_lookup:</label>
                    <input type="text" value={inputs.vlookupRange} onChange={(e) => setInputs({...inputs, vlookupRange: e.target.value})} className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md text-sm font-mono focus:ring-2 ring-green-500 outline-none" />
                  </div>
                </>
              )}

              {activeTab === 'HLOOKUP' && (
                <>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">lookup_value:</label>
                    <div className="relative">
                      <select 
                        value={inputs.hlookupValue} 
                        onChange={(e) => setInputs({...inputs, hlookupValue: e.target.value})} 
                        className="w-full p-2 bg-emerald-50 border border-emerald-200 rounded-md text-sm font-bold text-emerald-800 appearance-none focus:ring-2 ring-green-500 outline-none"
                      >
                        {horizontalData[0].slice(1).map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                      <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 text-emerald-400 pointer-events-none" />
                    </div>
                    <p className="text-[9px] text-slate-400 mt-1 italic leading-tight">Keterangan: Daftar Bulan dari baris 10.</p>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">row_index_num:</label>
                    <input type="number" value={inputs.hlookupRow} onChange={(e) => setInputs({...inputs, hlookupRow: e.target.value})} className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md text-sm font-mono focus:ring-2 ring-green-500 outline-none" />
                    <p className="text-[9px] text-slate-400 mt-1 italic leading-tight">Keterangan: Baris ke-2 untuk data Omzet.</p>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">range_lookup:</label>
                    <input type="text" value={inputs.hlookupRange} onChange={(e) => setInputs({...inputs, hlookupRange: e.target.value})} className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md text-sm font-mono focus:ring-2 ring-green-500 outline-none" />
                  </div>
                </>
              )}

              {activeTab === 'MATCH' && (
                <>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">lookup_array:</label>
                    <select value={inputs.matchArray} onChange={(e) => setInputs({...inputs, matchArray: e.target.value, matchValue: e.target.value.includes('A') ? 'K01' : e.target.value.includes('B') ? 'Nasi Goreng' : '15000'})} className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md text-sm">
                      <option value="A1:A5">A1:A5 (ID)</option>
                      <option value="B1:B5">B1:B5 (Menu)</option>
                      <option value="C1:C5">C1:C5 (Harga)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">lookup_value:</label>
                    <div className="relative">
                      <select 
                        value={inputs.matchValue} 
                        onChange={(e) => setInputs({...inputs, matchValue: e.target.value})} 
                        className="w-full p-2 bg-amber-50 border border-amber-200 rounded-md text-sm font-bold text-amber-800 appearance-none focus:ring-2 ring-green-500 outline-none"
                      >
                        {getMatchOptions().map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                      <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 text-amber-400 pointer-events-none" />
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'INDEX' && (
                <>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">row_num:</label>
                    <input type="number" value={inputs.indexRow} onChange={(e) => setInputs({...inputs, indexRow: e.target.value})} className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md text-sm font-mono focus:ring-2 ring-green-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">column_num:</label>
                    <input type="number" value={inputs.indexCol} onChange={(e) => setInputs({...inputs, indexCol: e.target.value})} className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md text-sm font-mono focus:ring-2 ring-green-500 outline-none" />
                  </div>
                </>
              )}

              {activeTab === 'CHOOSE' && (
                <>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">index_num:</label>
                    <input type="number" value={inputs.chooseIndex} onChange={(e) => setInputs({...inputs, chooseIndex: e.target.value})} className="w-full p-2 bg-purple-50 border border-purple-200 rounded-md text-sm font-bold text-purple-800 focus:ring-2 ring-purple-500 outline-none" />
                  </div>
                </>
              )}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100">
               <div className="bg-slate-900 p-5 rounded-xl border-l-4 border-yellow-400 shadow-lg">
                 <h4 className="text-white text-[11px] font-bold mb-2 flex items-center gap-2">
                   <Lightbulb className="w-3 h-3 text-yellow-400" /> Tantangan Eksperimen
                 </h4>
                 <p className="text-[10px] text-slate-300 leading-relaxed">
                   {getDynamicTips()}
                 </p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
