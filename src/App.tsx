import React, { useState } from 'react';
import { Activity, Briefcase, FileWarning, DollarSign, Calendar, Info, Loader2, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AnalysisResult {
  company: string;
  totalJobs: number;
  officialJobs: number;
  repostedJobs: number;
  contractValueMillions: number;
  daysSinceAward: number;
  cgiPercent: number;
  operationalHealthScore: number;
}

export default function App() {
  const [company, setCompany] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState('');

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company: company.trim() }),
      });

      if (!res.ok) {
        throw new Error('Analysis failed');
      }

      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred during analysis.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-cyber-dark)] text-white font-sans p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="space-y-4 text-center flex flex-col items-center">
          <img src="/logo.png" alt="Ghostrunners" className="h-32 md:h-48 lg:h-56 object-contain filter drop-shadow-[0_0_15px_var(--color-cyber-yellow)] mb-2" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
          <p className="text-gray-400 max-w-2xl mx-auto font-mono text-sm mt-4 glitch-text-1">
            ANALYZES REQUISITION DATA AND RECENT PUBLIC CONTRACT AWARDS. 
            CALCULATES GHOST INDEX (CGI) AND OPERATIONAL HEALTH SCORE.
                                DISCLAIMER: PERCENTAGES MIGHT BE 1%-5% FROM REALITY, SO TAKE THE INFOMATION WITH A GRAIN OF SALT.
          </p>
        </header>

        <form onSubmit={handleAnalyze} className="max-w-3xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row gap-4 items-stretch group">
            <div className="relative flex-grow cyber-input-wrap">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-[var(--color-cyber-yellow)] group-focus-within:text-[var(--color-cyber-blue)] transition-colors" />
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="ENTER TARGET CORP..."
                className="w-full pl-12 pr-4 py-5 h-full bg-[var(--color-cyber-gray)] text-[var(--color-cyber-yellow)] border-2 border-[var(--color-cyber-yellow)] rounded-none focus:outline-none focus:border-[var(--color-cyber-blue)] focus:shadow-[0_0_15px_var(--color-cyber-blue)] transition-all uppercase font-mono text-lg placeholder-gray-600"
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading || !company.trim()}
              className="px-10 py-5 bg-[var(--color-cyber-yellow)] text-black font-bold uppercase tracking-wider text-xl rounded-none hover:bg-[var(--color-cyber-blue)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center cyber-btn whitespace-nowrap shadow-[4px_4px_0_0_var(--color-cyber-red)] hover:shadow-[2px_2px_0_0_var(--color-cyber-red)] active:shadow-none active:translate-x-1 active:translate-y-1"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <span className="glitch-text-2">EXECUTE</span>}
            </button>
          </div>
          {error && <p className="text-[var(--color-cyber-red)] text-sm mt-4 text-center font-mono uppercase bg-black/50 p-2 border border-[var(--color-cyber-red)] glitch-text-3">{error}</p>}
        </form>

        <AnimatePresence>
          {result && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Core Metrics */}
                <div className="bg-[var(--color-cyber-gray)] p-6 rounded-none border-2 border-[var(--color-cyber-blue)] space-y-2 relative glitch-border cyber-panel">
                  <div className="flex items-center space-x-2 text-[var(--color-cyber-blue)] mb-4">
                    <Activity className="w-6 h-6" />
                    <h3 className="font-bold text-sm tracking-widest uppercase font-mono glitch-text-3">Operational Health</h3>
                  </div>
                  <div className="text-6xl font-bold tracking-tighter text-white font-mono glitch-text-4">
                    {result.operationalHealthScore}
                    <span className="text-2xl text-[var(--color-cyber-blue)] font-normal ml-2">/100</span>
                  </div>
                  <p className="text-sm text-gray-400 mt-2 font-mono uppercase">
                    SYS.SCORE BASED ON JOB VITALITY & REV SIGNALS.
                  </p>
                </div>

                <div className="bg-[var(--color-cyber-dark)] text-white p-6 rounded-none border-2 border-[var(--color-cyber-red)] space-y-2 relative overflow-hidden cyber-panel">
                  <div className="flex items-center space-x-2 text-[var(--color-cyber-red)] mb-4 z-10 relative">
                    <Info className="w-6 h-6" />
                    <h3 className="font-bold text-sm tracking-widest uppercase font-mono glitch-text-1">Corp Ghost Index (CGI)</h3>
                  </div>
                  <div className="text-6xl font-bold tracking-tighter text-[var(--color-cyber-red)] font-mono z-10 relative drop-shadow-[0_0_10px_var(--color-cyber-red)] glitch-text-2">
                    {result.cgiPercent}%
                  </div>
                  <p className="text-sm text-gray-400 mt-2 z-10 relative font-mono uppercase">
                    PROBABILITY OF STALE/GHOST REQUISITIONS.
                  </p>
                  
                  {/* Decorative background element based on risk */}
                  <div 
                    className={`absolute -bottom-10 -right-10 w-48 h-48 rounded-full blur-3xl opacity-20 ${
                      result.cgiPercent > 50 ? 'bg-[var(--color-cyber-red)]' : 'bg-[var(--color-cyber-blue)]'
                    }`}
                  />
                </div>
              </div>

              {/* Data Matrix Breakdown */}
              <div className="bg-[var(--color-cyber-gray)] rounded-none border-2 border-[var(--color-cyber-yellow)] overflow-hidden cyber-panel mt-6">
                <div className="px-6 py-4 border-b-2 border-[var(--color-cyber-yellow)] bg-black/40">
                  <h4 className="font-bold uppercase tracking-widest text-[var(--color-cyber-yellow)] font-mono glitch-text-4">Job Source Breakdown</h4>
                </div>
                <div className="grid grid-cols-2 divide-x-2 divide-[var(--color-cyber-yellow)] border-b-2 border-[var(--color-cyber-yellow)]">
                  <div className="p-6 space-y-1 bg-black/20 hover:bg-black/40 transition-colors">
                    <div className="flex items-center space-x-2 text-[var(--color-cyber-blue)] mb-2">
                      <Briefcase className="w-5 h-5" />
                      <span className="text-sm font-bold uppercase tracking-widest font-mono">Official Careers Site</span>
                    </div>
                    <div className="text-3xl font-bold text-white font-mono">{result.officialJobs.toLocaleString()}</div>
                    <p className="text-xs text-gray-500 font-mono uppercase">Openings on official portal</p>
                  </div>
                  <div className="p-6 space-y-1 bg-black/20 hover:bg-black/40 transition-colors">
                    <div className="flex items-center space-x-2 text-[var(--color-cyber-red)] mb-2">
                      <FileWarning className="w-5 h-5" />
                      <span className="text-sm font-bold uppercase tracking-widest font-mono">Suspected Ghost Reposts</span>
                    </div>
                    <div className="text-3xl font-bold text-[var(--color-cyber-red)] font-mono">{result.repostedJobs.toLocaleString()}</div>
                    <p className="text-xs text-gray-500 font-mono uppercase">{((result.repostedJobs / Math.max(result.totalJobs, 1)) * 100).toFixed(1)}% OF TOTAL OPENINGS</p>
                  </div>
                </div>
                <div className="px-6 py-4 border-b-2 border-[var(--color-cyber-yellow)] bg-black/40">
                  <h4 className="font-bold uppercase tracking-widest text-[var(--color-cyber-yellow)] font-mono glitch-text-2">Data Matrix Breakdown</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 divide-y-2 md:divide-y-0 md:divide-x-2 divide-[var(--color-cyber-yellow)]">
                  <div className="p-6 space-y-1 bg-black/20 hover:bg-black/40 transition-colors">
                    <div className="flex items-center space-x-2 text-gray-400 mb-2">
                      <Briefcase className="w-5 h-5" />
                      <span className="text-sm font-bold uppercase tracking-widest font-mono">Estimated Total</span>
                    </div>
                    <div className="text-3xl font-bold text-white font-mono">{result.totalJobs.toLocaleString()}</div>
                  </div>
                  <div className="p-6 space-y-1 bg-black/40 hover:bg-black/60 transition-colors">
                    <div className="flex items-center space-x-2 text-[var(--color-cyber-blue)] mb-2">
                      <DollarSign className="w-5 h-5" />
                      <span className="text-sm font-bold uppercase tracking-widest font-mono">Recent Contract</span>
                    </div>
                    <div className="text-3xl font-bold text-[var(--color-cyber-blue)] font-mono drop-shadow-[0_0_5px_var(--color-cyber-blue)]">
                      ${result.contractValueMillions}M
                    </div>
                    <div className="text-xs text-gray-500 flex items-center space-x-1 mt-1 font-mono uppercase">
                      <Calendar className="w-4 h-4" />
                      <span>{result.daysSinceAward} DAYS AGO</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <footer className="text-center mt-12 py-4">
          <p className="text-gray-500 font-mono text-xs uppercase tracking-widest">
            &copy; 2026 Team Gecko
          </p>
        </footer>
      </div>
    </div>
  );
}
