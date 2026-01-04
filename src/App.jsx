import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Excel from './pages/Excel';
import MailMerger from './pages/MailMerger';
import WordParagraph from './pages/WordParagraph';
import WordPageLayout from './pages/WordPageLayout';
import WordTabulator from './pages/WordTabulator';
import BlocklyPage from './pages/Blockly';
import BlocklyMaze from './pages/BlocklyMaze';
import ExcelChart from "./pages/ExcelChart";
import Hardware3D from './pages/Hardware';
import ExcelSort from './pages/ExcelSort';
import Biner from './pages/Biner';
import Oktal from './pages/Oktal';
import Heksadesimal from './pages/Heksadesimal';
import PemrosesanData from './pages/PemrosesanData';
import PengalamatanMemori from './pages/PengalamatanMemori';
import IntegrasiOffice from './pages/IntegrasiOffice';
import Explorer from './pages/Explorer';
import GerbangLogika from './pages/GerbangLogika';

// Create a wrapper component to use the router hooks
const AppContent = () => {
  const [activeTab, setActiveTab] = useState('excel-sort');
  const location = useLocation();

  // We essentially want the Navbar everywhere now, or at least the user requested it.
  // We will simply render the Navbar always.
  // Checks for specific pages were preventing Navbar from showing.

  return (
    <div className="h-screen bg-gray-50 flex flex-col font-sans text-gray-900 overflow-hidden">
      <Navbar />

      <div className="flex-1 overflow-hidden relative flex flex-col">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/excel-sort" element={<ExcelSort />} />
          <Route path="/excel-chart" element={<ExcelChart />} />
          <Route path="/word-tabulator" element={<WordTabulator />} />
          {/* Blockly Simulations */}
          <Route path="/blockly" element={<BlocklyPage />} />
          <Route path="/blockly-maze" element={<BlocklyMaze />} />

          <Route path="/hardware" element={<Hardware3D />} />
          <Route path="/biner" element={<Biner />} />
          <Route path="/oktal" element={<Oktal />} />
          <Route path="/heksadesimal" element={<Heksadesimal />} />
          <Route path="/pemrosesan-data" element={<PemrosesanData />} />
          <Route path="/pengalamatan-memori" element={<PengalamatanMemori />} />
          <Route path="/integrasi-office" element={<IntegrasiOffice />} />
          <Route path="/explorer" element={<Explorer />} />
          <Route path="/gerbang-logika" element={<GerbangLogika />} />

          {/* Legacy routes if needed */}
          <Route path="/excel" element={<Excel />} />
          <Route path="/mailmerge" element={<MailMerger />} />
          <Route path="/word-paragraph" element={<WordParagraph />} />
          <Route path="/word-layout" element={<WordPageLayout />} />
        </Routes>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
