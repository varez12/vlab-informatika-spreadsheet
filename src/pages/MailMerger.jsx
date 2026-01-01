import React, { useState } from 'react';
import {
  FileText,
  Table as TableIcon,
  UserPlus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Mail,
  CheckCircle,
  Database,
  ArrowRightLeft,
  MousePointer2,
  Info,
  Layers,
  Settings,
  Search,
  FileSpreadsheet,
  Monitor,
  Layout,
  Square,
  X,
  ChevronDown
} from 'lucide-react';

const App = () => {
  // --- STATE UTAMA ---
  const [activeTab, setActiveTab] = useState('word-ui');
  const [wordTab, setWordTab] = useState('Design');

  // Data Excel Sesuai Template SKL (Analisis Data)
  const [recipients, setRecipients] = useState([
    {
      id: 1,
      nama: 'ADITYA PRATAMA',
      nis: '212207001',
      nisn: '0112345678',
      pai: 88, ppkn: 85, bi: 87, mtk: 82, ipa: 84, ips: 86, sbdp: 90, pjok: 89, bjawa: 85
    },
    {
      id: 2,
      nama: 'SITI AMINAH',
      nis: '212207002',
      nisn: '0112345679',
      pai: 92, ppkn: 88, bi: 90, mtk: 85, ipa: 87, ips: 89, sbdp: 92, pjok: 88, bjawa: 87
    },
    {
      id: 3,
      nama: 'BUDI SETIAWAN',
      nis: '212207003',
      nisn: '0112345680',
      pai: 85, ppkn: 82, bi: 84, mtk: 80, ipa: 82, ips: 83, sbdp: 88, pjok: 87, bjawa: 82
    },
  ]);

  const [isDataConnected, setIsDataConnected] = useState(false);
  const [isFieldInserted, setIsFieldInserted] = useState(false);
  const [isPreviewOn, setIsPreviewOn] = useState(false);
  const [hasKopBorder, setHasKopBorder] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [showRecipientsMenu, setShowRecipientsMenu] = useState(false);
  const [showFieldMenu, setShowFieldMenu] = useState(false);
  const [showBorderDialog, setShowBorderDialog] = useState(false);
  const [dialogTab, setDialogTab] = useState('Borders'); // Borders, Page Border, Shading
  const [selectedStyle, setSelectedStyle] = useState('double');
  const [selectedWidth, setSelectedWidth] = useState('3pt');
  const [activeBorder, setActiveBorder] = useState('bottom');
  const [toast, setToast] = useState(null);

  const showMessage = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleConnectData = () => {
    setIsDataConnected(true);
    setShowRecipientsMenu(false);
    showMessage("✅ File 'Data_Kelulusan_2023.xlsx' Terhubung!");
  };

  const handleInsertField = () => {
    if (!isDataConnected) {
      showMessage("❌ Hubungkan data dulu!");
      return;
    }
    setIsFieldInserted(true);
    setShowFieldMenu(false);
    showMessage("✅ Field Mail Merge Berhasil Dipasang");
  };

  const togglePreview = () => {
    if (!isFieldInserted) {
      showMessage("❌ Pasang field dulu!");
      return;
    }
    setIsPreviewOn(!isPreviewOn);
  };

  const handleApplyBorder = () => {
    setHasKopBorder(true);
    setShowBorderDialog(false);
    showMessage("✅ Garis Kop Surat Berhasil Diterapkan!");
  };

  // --- SUB-COMPONENTS ---

  const BordersAndShadingDialog = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-[2px] z-[200] flex items-center justify-center p-4">
      <div className="bg-[#f0f0f0] w-full max-w-[580px] rounded shadow-2xl border border-slate-400 overflow-hidden text-slate-800 font-sans animate-in zoom-in-95 duration-200">
        <div className="bg-white px-3 py-2 flex justify-between items-center border-b border-slate-300">
          <span className="text-xs font-medium">Borders and Shading</span>
          <button onClick={() => setShowBorderDialog(false)} className="hover:bg-red-500 hover:text-white p-1 rounded-sm">
            <X className="w-3 h-3" />
          </button>
        </div>

        <div className="p-4">
          {/* TABS INTERAKTIF */}
          <div className="flex gap-1 mb-[-1px]">
            {['Borders', 'Page Border', 'Shading'].map((tab) => (
              <button
                key={tab}
                onClick={() => setDialogTab(tab)}
                className={`px-5 py-2 text-xs transition-all border-t border-x rounded-t-sm ${dialogTab === tab
                    ? 'bg-white border-slate-300 font-bold z-10'
                    : 'bg-slate-200 border-transparent text-slate-500 hover:bg-slate-100'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="bg-white border border-slate-300 p-5 min-h-[350px]">
            {dialogTab === 'Borders' ? (
              <div className="grid grid-cols-12 gap-6 animate-in fade-in duration-300">
                <div className="col-span-3 border-r pr-4">
                  <p className="text-[11px] font-bold text-slate-600 mb-3">Setting:</p>
                  <div className="space-y-1.5">
                    {['None', 'Box', 'Shadow', '3-D', 'Custom'].map((label) => (
                      <button key={label} className={`w-full flex flex-col items-center justify-center p-2 border transition-colors ${label === 'Custom' ? 'bg-blue-50 border-blue-400 ring-1 ring-blue-200' : 'border-transparent hover:bg-slate-50'}`}>
                        <div className="w-7 h-7 border border-slate-300 bg-slate-50 mb-1 flex items-center justify-center">
                          {label !== 'None' && <div className="w-5 h-5 border border-slate-800"></div>}
                        </div>
                        <span className="text-[10px]">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="col-span-4 flex flex-col">
                  <p className="text-[11px] font-bold text-slate-600 mb-2">Style:</p>
                  <div className="border border-slate-400 h-32 overflow-y-auto bg-white p-1 mb-4">
                    <div onClick={() => setSelectedStyle('solid')} className={`p-2 border-b cursor-pointer hover:bg-slate-50 ${selectedStyle === 'solid' ? 'bg-blue-100' : ''}`}><div className="h-[2px] bg-slate-800 w-full"></div></div>
                    <div onClick={() => setSelectedStyle('double')} className={`p-2 border-b cursor-pointer hover:bg-slate-50 ${selectedStyle === 'double' ? 'bg-blue-100' : ''}`}><div className="h-[4px] border-y border-slate-800 w-full"></div></div>
                  </div>
                  <p className="text-[11px] font-bold text-slate-600 mb-1">Width:</p>
                  <select className="w-full border border-slate-400 p-1 text-[11px] outline-none" value={selectedWidth} onChange={(e) => setSelectedWidth(e.target.value)}>
                    <option value="1.5pt">1 1/2 pt</option>
                    <option value="3pt">3 pt</option>
                    <option value="4.5pt">4 1/2 pt</option>
                  </select>
                </div>

                <div className="col-span-5 flex flex-col justify-between">
                  <div>
                    <p className="text-[11px] font-bold text-slate-600 mb-3">Preview:</p>
                    <div className="flex gap-4">
                      <div className="flex flex-col gap-2 justify-center opacity-30"><button className="p-1 border border-slate-300 bg-slate-100"><Square className="w-4 h-4" /></button></div>
                      <div className="flex-1 aspect-square bg-slate-50 border border-slate-200 relative p-6 flex items-center justify-center">
                        <div className="w-full h-full bg-white border border-slate-300 relative">
                          {activeBorder === 'bottom' && (
                            <div className="absolute bottom-0 left-0 w-full bg-slate-900" style={{ height: selectedStyle === 'double' ? '4px' : '2px' }}></div>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 justify-center">
                        <button onClick={() => setActiveBorder(activeBorder === 'bottom' ? '' : 'bottom')} className={`p-1 border shadow-inner transition-all ${activeBorder === 'bottom' ? 'bg-blue-100 border-blue-500' : 'bg-slate-100 border-slate-300 hover:bg-white'}`}><Square className="w-4 h-4" /></button>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-6">
                    <button onClick={handleApplyBorder} className="px-8 py-1.5 bg-white border border-slate-400 text-xs shadow-sm font-medium hover:bg-slate-50 active:bg-slate-200">OK</button>
                    <button onClick={() => setShowBorderDialog(false)} className="px-8 py-1.5 bg-white border border-slate-400 text-xs shadow-sm font-medium hover:bg-slate-50 active:bg-slate-200">Cancel</button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400 italic animate-in fade-in duration-300">
                Konten untuk {dialogTab} tidak tersedia dalam simulasi ini.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const WordRibbon = () => (
    <div className="bg-[#f3f3f3] border-b border-slate-300 select-none shrink-0 font-sans">
      <div className="flex bg-[#e1e1e1] px-4 text-[11px] text-slate-700">
        {['File', 'Home', 'Insert', 'Design', 'Layout', 'References', 'Mailings', 'Review', 'View'].map(tab => (
          <div key={tab} onClick={() => setWordTab(tab)} className={`px-4 py-2 cursor-pointer transition-all ${wordTab === tab ? 'bg-[#f3f3f3] font-bold text-indigo-700 border-t-2 border-indigo-600' : 'hover:bg-slate-300'}`}>
            {tab}
          </div>
        ))}
      </div>
      <div className="p-3 flex items-center gap-1 bg-[#f3f3f3] min-h-[100px] border-b border-slate-200">
        {wordTab === 'Design' ? (
          <div className="flex-1 flex justify-end items-center pr-6">
            <div className="flex flex-col items-center cursor-pointer group" onClick={() => setShowBorderDialog(true)}>
              <div className={`p-2 rounded border transition-all ${hasKopBorder ? 'bg-indigo-50 border-indigo-300 text-indigo-600' : 'border-transparent text-slate-600 group-hover:bg-slate-200'}`}><Square className="w-9 h-9" /></div>
              <span className="text-[10px] mt-1 font-bold text-slate-600 uppercase tracking-tighter">Page Borders</span>
            </div>
          </div>
        ) : wordTab === 'Mailings' ? (
          <div className="flex gap-6 pl-4 animate-in fade-in">
            <div className="flex flex-col items-center border-r pr-6 border-slate-200 relative">
              <div onClick={() => setShowRecipientsMenu(!showRecipientsMenu)} className={`flex flex-col items-center p-2 rounded hover:bg-slate-200 cursor-pointer ${isDataConnected ? 'text-indigo-600' : 'text-slate-600'}`}>
                <Database className="w-8 h-8" /><span className="text-[10px] mt-1 font-medium leading-none">Select<br />Recipients</span>
              </div>
              {showRecipientsMenu && (
                <div className="absolute top-[75px] left-0 w-48 bg-white shadow-2xl border border-slate-200 rounded z-50 py-1">
                  <div onClick={handleConnectData} className="px-3 py-2 hover:bg-indigo-50 text-[11px] cursor-pointer flex items-center gap-2"><FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Use an Existing List...</div>
                </div>
              )}
            </div>
            <div className="flex flex-col items-center border-r pr-6 border-slate-200 relative">
              <div onClick={() => setShowFieldMenu(!showFieldMenu)} className={`flex flex-col items-center p-2 rounded hover:bg-slate-200 cursor-pointer ${isFieldInserted ? 'text-indigo-600' : 'text-slate-600'}`}>
                <Layers className="w-8 h-8" /><span className="text-[10px] mt-1 font-medium leading-none">Insert Merge<br />Field</span>
              </div>
              {showFieldMenu && (
                <div className="absolute top-[75px] left-0 w-56 bg-white shadow-2xl border border-slate-200 rounded z-50 py-1 grid grid-cols-2">
                  {['Nama', 'NIS', 'NISN', 'Nilai_PAI', 'Nilai_PPKn', 'Nilai_BI', 'Nilai_MTK', 'Nilai_IPA'].map(f => (
                    <div key={f} onClick={handleInsertField} className="px-3 py-2 hover:bg-indigo-50 text-[10px] cursor-pointer font-bold">{f}</div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-4">
                <div onClick={togglePreview} className={`flex flex-col items-center p-2 rounded cursor-pointer transition-all ${isPreviewOn ? 'bg-indigo-100 text-indigo-700 shadow-inner ring-1 ring-indigo-200' : 'hover:bg-slate-200 text-slate-600'}`}>
                  <Monitor className="w-8 h-8" /><span className="text-[10px] mt-1 font-bold leading-none">Preview<br />Results</span>
                </div>
                {isPreviewOn && (
                  <div className="flex items-center gap-1 bg-white p-1 rounded border border-slate-300 shadow-sm h-fit self-center">
                    <button onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))} className="p-1 hover:bg-slate-100 rounded"><ChevronLeft className="w-4 h-4" /></button>
                    <span className="text-[10px] font-black px-2 text-indigo-600">{currentIndex + 1}</span>
                    <button onClick={() => setCurrentIndex(Math.min(recipients.length - 1, currentIndex + 1))} className="p-1 hover:bg-slate-100 rounded"><ChevronRight className="w-4 h-4" /></button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-300 text-xs italic">Menu simulasi sedang tidak aktif. Klik "Design" atau "Mailings".</div>
        )}
      </div>
    </div>
  );

  const DocumentArea = () => {
    const person = recipients[currentIndex];

    const calculateAverage = (p) => {
      const scores = [p.pai, p.ppkn, p.bi, p.mtk, p.ipa, p.ips, p.sbdp, p.pjok, p.bjawa];
      const sum = scores.reduce((a, b) => a + b, 0);
      return (sum / scores.length).toFixed(2);
    };

    return (
      <div className="bg-[#a0a0a0] p-4 md:p-8 flex justify-center flex-1 overflow-y-auto">
        <div className="bg-white w-full max-w-[700px] shadow-2xl p-12 min-h-[1000px] font-serif relative animate-in fade-in duration-700 leading-tight">

          {/* KOP SURAT SESUAI PDF */}
          <div className={`text-center mb-6 relative ${hasKopBorder ? 'pb-6' : 'pb-4'}`}>
            <h1 className="text-lg font-bold uppercase text-slate-900">Pemerintah Kabupaten Wonogiri</h1>
            <h1 className="text-lg font-bold uppercase text-slate-900">Dinas Pendidikan dan Kebudayaan</h1>
            <h2 className="text-xl font-bold uppercase text-slate-900">SD Negeri 1 Suka Belajar</h2>
            <p className="text-[11px] font-sans mt-1">Jl. Raya Solo - Baturetno, Baturetno Kode Pos 57673, Telepon (0273) 465065</p>
            <p className="text-[11px] font-sans">e-mail: sdsukabelajar@yahoo.co.id, website: www.sdsukabelajar.sch.id</p>

            {hasKopBorder && (
              <div className="absolute bottom-0 left-0 w-full flex flex-col gap-[1px] animate-in slide-in-from-left duration-700">
                <div className="w-full h-[1px] bg-slate-900"></div>
                <div className="w-full h-[3px] bg-slate-900"></div>
              </div>
            )}
            {!hasKopBorder && <div className="absolute bottom-0 left-0 w-full h-[1px] bg-slate-100"></div>}
          </div>

          {/* JUDUL SURAT */}
          <div className="text-center mb-6">
            <h3 className="text-base font-bold uppercase underline">Surat Keterangan Lulus Sekolah Dasar</h3>
            <p className="text-base font-bold uppercase mt-1">Tahun Pelajaran 2022/2023</p>
            <p className="text-sm mt-1">Nomor: 800.1/2022</p>
          </div>

          <p className="text-sm mb-4 text-justify">Yang bertanda tangan di bawah ini Kepala Sekolah Dasar Suka Belajar Kecamatan Baturetno Kabupaten Wonogiri Provinsi Jawa Tengah, menerangkan bahwa:</p>

          {/* IDENTITAS */}
          <div className="ml-8 mb-6 text-sm space-y-1">
            <div className="grid grid-cols-12">
              <span className="col-span-4">Nama</span><span className="col-span-1">:</span>
              <span className="col-span-7 font-bold">{isPreviewOn ? person.nama : '<<Nama>>'}</span>
            </div>
            <div className="grid grid-cols-12">
              <span className="col-span-4">Nomor Induk Siswa</span><span className="col-span-1">:</span>
              <span className="col-span-7">{isPreviewOn ? person.nis : '<<NIS>>'}</span>
            </div>
            <div className="grid grid-cols-12">
              <span className="col-span-4">NISN</span><span className="col-span-1">:</span>
              <span className="col-span-7">{isPreviewOn ? person.nisn : '<<NISN>>'}</span>
            </div>
            <div className="grid grid-cols-12">
              <span className="col-span-4">Sekolah</span><span className="col-span-1">:</span>
              <span className="col-span-7 font-bold uppercase">SD Negeri 1 Suka Belajar</span>
            </div>
          </div>

          <div className="text-center mb-6">
            <p className="text-lg font-bold border-2 border-slate-900 inline-block px-8 py-1">LULUS</p>
          </div>

          <p className="text-sm mb-4">dari sekolah dasar, setelah memenuhi seluruh kriteria sesuai dengan peraturan perundang-undangan, dengan rincian nilai sebagai berikut:</p>

          {/* TABEL NILAI */}
          <table className="w-full text-xs border-collapse border border-slate-900 mb-6">
            <thead>
              <tr className="bg-slate-50 uppercase font-bold text-center">
                <th className="border border-slate-900 py-1 w-12">No.</th>
                <th className="border border-slate-900 py-1">Mata Pelajaran</th>
                <th className="border border-slate-900 py-1 w-24">Nilai</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-slate-100 font-bold"><td className="border border-slate-900 px-2 py-1 italic" colSpan="3">Kelompok A</td></tr>
              {[
                { n: 1, m: 'Pendidikan Agama dan Budi Pekerti', v: 'pai' },
                { n: 2, m: 'Pendidikan Pancasila dan Kewarganegaraan', v: 'ppkn' },
                { n: 3, m: 'Bahasa Indonesia', v: 'bi' },
                { n: 4, m: 'Matematika', v: 'mtk' },
                { n: 5, m: 'Ilmu Pengetahuan Alam', v: 'ipa' },
                { n: 6, m: 'Ilmu Pengetahuan Sosial', v: 'ips' },
              ].map(item => (
                <tr key={item.n}>
                  <td className="border border-slate-900 text-center py-1">{item.n}</td>
                  <td className="border border-slate-900 px-2 py-1">{item.m}</td>
                  <td className="border border-slate-900 text-center py-1 font-bold">{isPreviewOn ? person[item.v] : `<<${item.v}>>`}</td>
                </tr>
              ))}
              <tr className="bg-slate-100 font-bold"><td className="border border-slate-900 px-2 py-1 italic" colSpan="3">Kelompok B</td></tr>
              {[
                { n: 1, m: 'Seni Budaya dan Prakarya', v: 'sbdp' },
                { n: 2, m: 'Pendidikan Jasmani, Olahraga, dan Kesehatan', v: 'pjok' },
                { n: 3, m: 'Muatan Lokal (a. Bahasa Jawa)', v: 'bjawa' },
              ].map(item => (
                <tr key={item.n}>
                  <td className="border border-slate-900 text-center py-1">{item.n}</td>
                  <td className="border border-slate-900 px-2 py-1">{item.m}</td>
                  <td className="border border-slate-900 text-center py-1 font-bold">{isPreviewOn ? person[item.v] : `<<${item.v}>>`}</td>
                </tr>
              ))}
              <tr className="font-bold">
                <td className="border border-slate-900 text-center py-2" colSpan="2 text-right pr-4 uppercase italic">Rata-Rata</td>
                <td className="border border-slate-900 text-center py-2 text-indigo-700 underline">{isPreviewOn ? calculateAverage(person) : '<<Avg>>'}</td>
              </tr>
            </tbody>
          </table>

          <p className="text-sm mb-12 text-justify">Demikian Surat Keterangan ini untuk dipergunakan sebagaimana mestinya, dan hanya berlaku sampai diterbitkannya Ijazah Tahun Pelajaran 2022/2023.</p>

          {/* TANDA TANGAN */}
          <div className="flex justify-end pr-8">
            <div className="text-center">
              <p className="text-sm">Wonogiri, 8 Juni 2023</p>
              <p className="text-sm font-bold mt-1">Kepala Sekolah,</p>
              <div className="h-20 w-44 mx-auto my-3 border border-dashed border-slate-100 flex items-center justify-center text-[10px] text-slate-200">Stempel & Tanda Tangan</div>
              <p className="font-bold underline text-sm uppercase">Muh. Khoirul Anwar, M.Pd.</p>
              <p className="text-[11px] font-sans">NIP. 19700817 199001 1 001</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-[calc(100vh-4rem)] bg-slate-200 font-sans text-slate-800 flex flex-col overflow-hidden">
      {showBorderDialog && <BordersAndShadingDialog />}

      {toast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[300] bg-slate-900 text-white px-8 py-3 rounded-full shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 border border-slate-700">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">{toast}</span>
        </div>
      )}

      {/* Internal Module Header (Simplified) */}
      <header className="bg-white border-b border-slate-300 px-6 py-2 flex items-center justify-between shadow-sm shrink-0 z-10">
        <div className="flex items-center gap-2">
          <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">SKL Mail Merge Module</span>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl gap-1 ring-1 ring-slate-200">
          <button onClick={() => setActiveTab('word-ui')} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'word-ui' ? 'bg-white text-indigo-600 shadow-md ring-1 ring-slate-100' : 'text-slate-400 hover:text-slate-600'}`}>💻 Editor</button>
          <button onClick={() => setActiveTab('simulator')} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'simulator' ? 'bg-white text-indigo-600 shadow-md ring-1 ring-slate-100' : 'text-slate-400 hover:text-slate-600'}`}>📊 Data Excel</button>
        </div>
      </header>

      <main className="flex-1 flex flex-col overflow-hidden">
        {activeTab === 'word-ui' ? (
          <div className="flex-1 flex flex-col overflow-hidden animate-in fade-in duration-500">
            <WordRibbon />
            <DocumentArea />
          </div>
        ) : (
          <div className="p-10 max-w-7xl mx-auto w-full animate-in slide-in-from-right-10 duration-500 overflow-y-auto">
            <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden">
              <div className="p-8 bg-[#f8fafc] border-b flex items-center justify-between">
                <div>
                  <h2 className="font-black text-slate-900 flex items-center gap-4 uppercase text-sm tracking-[0.2em]">
                    <div className="p-2 bg-emerald-100 rounded-xl"><FileSpreadsheet className="w-6 h-6 text-emerald-600" /></div>
                    Database Kelulusan 2022/2023
                  </h2>
                </div>
                <button
                  onClick={() => { setRecipients([...recipients, { id: Date.now(), nama: 'SISWA BARU', nis: '-', nisn: '-', pai: 0, ppkn: 0, bi: 0, mtk: 0, ipa: 0, ips: 0, sbdp: 0, pjok: 0, bjawa: 0 }]); showMessage("✅ Data Excel Berhasil Diperbarui!"); }}
                  className="bg-slate-900 text-white px-8 py-4 rounded-3xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-2xl active:scale-95"
                >
                  <UserPlus className="w-4 h-4 inline mr-2" /> Add Record
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-[11px] text-left font-sans">
                  <thead className="bg-[#f1f5f9] text-slate-500 font-black uppercase">
                    <tr>
                      <th className="px-6 py-4 border-r border-slate-200">No</th>
                      <th className="px-6 py-4 border-r border-slate-200">Nama Lengkap</th>
                      <th className="px-6 py-4 border-r border-slate-200">NIS/NISN</th>
                      <th className="px-4 py-4 text-center">PAI</th>
                      <th className="px-4 py-4 text-center">PKN</th>
                      <th className="px-4 py-4 text-center">BI</th>
                      <th className="px-4 py-4 text-center">MTK</th>
                      <th className="px-4 py-4 text-center">IPA</th>
                      <th className="px-4 py-4 text-center">IPS</th>
                      <th className="px-4 py-4 text-center">SBDP</th>
                      <th className="px-4 py-4 text-center">PJOK</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recipients.map((r, index) => (
                      <tr key={r.id} className="hover:bg-indigo-50/50 transition-all group">
                        <td className="px-6 py-4 font-bold text-slate-400 border-r border-slate-50">{index + 1}</td>
                        <td className="px-6 py-4 font-bold text-slate-800 border-r border-slate-50 uppercase">{r.nama}</td>
                        <td className="px-6 py-4 font-mono text-slate-500 border-r border-slate-50">{r.nis} / {r.nisn}</td>
                        <td className="px-4 py-4 text-center">{r.pai}</td>
                        <td className="px-4 py-4 text-center">{r.ppkn}</td>
                        <td className="px-4 py-4 text-center font-bold text-indigo-600">{r.bi}</td>
                        <td className="px-4 py-4 text-center">{r.mtk}</td>
                        <td className="px-4 py-4 text-center">{r.ipa}</td>
                        <td className="px-4 py-4 text-center">{r.ips}</td>
                        <td className="px-4 py-4 text-center">{r.sbdp}</td>
                        <td className="px-4 py-4 text-center">{r.pjok}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-indigo-700 text-white px-6 py-2 flex items-center justify-between text-[9px] font-black uppercase tracking-[0.3em] shrink-0 border-t border-indigo-600">
        <div className="flex gap-8">
          <span className="flex items-center gap-2"><div className={`w-2 h-2 rounded-full ${isDataConnected ? 'bg-emerald-400' : 'bg-slate-400'}`}></div>Linked</span>
          <span className="flex items-center gap-2"><div className={`w-2 h-2 rounded-full ${isFieldInserted ? 'bg-emerald-400' : 'bg-slate-400'}`}></div>Mapping</span>
          <span className="flex items-center gap-2 font-mono">{hasKopBorder ? 'Design: Official SKL' : 'Design: Standard'}</span>
        </div>
        <div className="flex items-center gap-3">
          <span>V-Lab Suite</span>
          <div className="w-px h-3 bg-white/20"></div>
          <span>CT Concept: Automation & Abstraction</span>
        </div>
      </footer>
    </div>
  );
};

export default App;