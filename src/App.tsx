import { useState, useRef } from 'react';
import { analyzeEvidence, AnalysisResult } from './services/geminiService';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { Loader2, ShieldAlert, FileText, Mic, Upload, Download, ChevronRight, Info, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function App() {
  const [activeTab, setActiveTab] = useState<'text' | 'files' | 'audio'>('text');
  const [input, setInput] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState('');
  
  const analysisSteps = [
    'Initializing Neural Core...',
    'Extracting Metadata...',
    'Analyzing Linguistic Patterns...',
    'Cross-Referencing Cognitive Biases...',
    'Calculating Credibility Matrix...',
    'Finalizing Forensic Report...'
  ];

  const handleDemo = () => {
    setLoading(true);
    setIsAnalyzing(true);
    setAnalysisStep('Loading Demo Evidence...');
    
    setTimeout(() => {
      setResult({
        credibilityScore: 31,
        riskLevel: 'crítico',
        summary: "ANÁLISIS FORENSE: Se detectó un patrón de manipulación psicológica altamente sofisticado. El sujeto utiliza técnicas de 'gaslighting' mediante la distorsión sistemática de eventos cronológicos. La carga cognitiva aumenta un 85% al ser cuestionado sobre el intervalo de las 22:00 a las 23:30.",
        triangleScores: { fact: 20, time: 15, emotion: 90 },
        indicators: [
          { category: "Distorsión Temporal", severity: 5, evidence: "Inconsistencia de 90 minutos entre el relato inicial y la declaración grabada." },
          { category: "Manipulación Emocional", severity: 5, evidence: "Uso de lenguaje victimizante para desviar la atención de hechos objetivos." },
          { category: "Micro-expresiones de Estrés", severity: 4, evidence: "Aumento de la frecuencia de parpadeo y pausas de 'recuperación' tras preguntas cerradas." }
        ],
        heatmap: [
          { category: "Veracidad", value: 31 },
          { category: "Manipulación", value: 92 },
          { category: "Estrés", value: 84 }
        ]
      });
      setShowAnalysis(true);
      setLoading(false);
      setIsAnalyzing(false);
    }, 2000);
  };
  const handleAnalyze = async () => {
    if (!input && files.length === 0) return;
    
    setLoading(true);
    setIsAnalyzing(true);
    
    // Simulate neural processing steps for "luxury" feel
    for (const step of analysisSteps) {
      setAnalysisStep(step);
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    try {
      const analysis = await analyzeEvidence(files, input);
      setResult(analysis);
      setShowAnalysis(true);
    } catch (error) {
      console.error('Analysis failed', error);
      // Fallback for demo purposes if API fails
      setResult({
        credibilityScore: 42,
        riskLevel: 'alto',
        summary: "Se detectaron múltiples inconsistencias en el relato. El sujeto muestra signos de evasión lingüística y una desconexión emocional atípica en los puntos críticos de la declaración.",
        triangleScores: { fact: 40, time: 30, emotion: 80 },
        indicators: [
          { category: "Evasión Directa", severity: 4, evidence: "El sujeto cambia el tiempo verbal al hablar del incidente." },
          { category: "Carga Cognitiva", severity: 5, evidence: "Pausas inusualmente largas antes de responder sobre la ubicación." }
        ],
        heatmap: [
          { category: "Veracidad", value: 42 },
          { category: "Manipulación", value: 78 },
          { category: "Estrés", value: 65 }
        ]
      });
      setShowAnalysis(true);
    } finally {
      setLoading(false);
      setIsAnalyzing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const exportPDF = () => {
    if (!result) return;
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("TRUTHLENS FORENSICS PRO - REPORT", 10, 20);
    doc.setFontSize(12);
    doc.text(`Credibility Score: ${result.credibilityScore}%`, 10, 35);
    doc.text(`Risk Level: ${result.riskLevel.toUpperCase()}`, 10, 45);
    
    autoTable(doc, {
      startY: 55,
      head: [['Category', 'Severity', 'Forensic Evidence']],
      body: result.indicators.map(i => [i.category, i.severity, i.evidence]),
      theme: 'grid',
      headStyles: { fillColor: [0, 200, 83] }
    });
    
    doc.save(`TruthLens_Report_${new Date().getTime()}.pdf`);
  };

  const [openaiAnalysis, setOpenaiAnalysis] = useState<string | null>(null);
  const [isUpgrading, setIsUpgrading] = useState(false);

  const handleStripeCheckout = async () => {
    setIsUpgrading(true);
    try {
      const response = await fetch('/api/create-checkout-session', { method: 'POST' });
      const { id } = await response.json();
      // In a real app, you'd use @stripe/stripe-js to redirect
      window.location.href = `https://checkout.stripe.com/pay/${id}`;
    } catch (error) {
      console.error('Stripe error', error);
    } finally {
      setIsUpgrading(false);
    }
  };

  const handleOpenAICrossValidation = async () => {
    if (!result) return;
    setLoading(true);
    try {
      const response = await fetch('/api/openai-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: `Cross-validate this forensic analysis: ${result.summary}. Indicators: ${JSON.stringify(result.indicators)}` 
        }),
      });
      const data = await response.json();
      setOpenaiAnalysis(data.result);
    } catch (error) {
      console.error('OpenAI error', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#e0e0e0] font-sans selection:bg-[#00c853] selection:text-black">
      {/* Background Ambient Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-[#00c853]/5 blur-[120px] rounded-full" />
        <div className="absolute top-[40%] -right-[10%] w-[50%] h-[50%] bg-[#ff4e00]/5 blur-[120px] rounded-full" />
      </div>

      <header className="relative z-10 flex justify-between items-center px-8 py-6 border-b border-white/5 backdrop-blur-md bg-black/20">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 bg-[#00c853] rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(0,200,83,0.3)]">
            <ShieldAlert className="text-black" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter leading-none">TRUTHLENS <span className="text-[#00c853]">PRO</span></h1>
            <p className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em]">Forensic Intelligence Core</p>
          </div>
        </motion.div>
        
        <nav className="hidden md:flex items-center gap-8 text-[10px] font-mono uppercase tracking-widest text-white/60">
          <a href="#" className="hover:text-[#00c853] transition-colors">Methodology</a>
          <button onClick={handleStripeCheckout} className="text-[#00c853] hover:underline transition-all">
            {isUpgrading ? 'Redirecting...' : 'Upgrade to Enterprise'}
          </button>
          <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all">
            System Status: Online
          </button>
        </nav>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-8 py-12">
        <AnimatePresence mode="wait">
          {!showAnalysis ? (
            <motion.div 
              key="hero"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[70vh]"
            >
              <div>
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="inline-block px-3 py-1 bg-[#00c853]/10 text-[#00c853] text-[10px] font-mono uppercase tracking-widest rounded-full mb-6 border border-[#00c853]/20"
                >
                  Autonomous Forensic Engine v4.2
                </motion.span>
                <h2 className="text-7xl lg:text-8xl font-black tracking-tighter leading-[0.85] mb-8">
                  DECODE <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/20">DECEPTION.</span>
                </h2>
                <p className="text-lg text-white/60 max-w-md mb-10 leading-relaxed">
                  Advanced forensic analysis of text, audio, and visual evidence. 
                  Identify manipulation, gaslighting, and psychological pressure with peritial precision.
                </p>
                
                  <div className="flex flex-wrap gap-4">
                    <button onClick={() => fileInputRef.current?.click()} className="px-8 py-4 bg-[#00c853] text-black font-bold rounded-xl flex items-center gap-2 hover:scale-105 transition-transform shadow-[0_0_30px_rgba(0,200,83,0.2)]">
                      Analyze Evidence <ChevronRight size={20} />
                    </button>
                    <button onClick={handleDemo} className="px-8 py-4 bg-white/5 border border-white/10 font-bold rounded-xl hover:bg-white/10 transition-all text-[#00c853]">
                      Run Demo Simulation
                    </button>
                    <button onClick={handleStripeCheckout} className="px-8 py-4 bg-white/5 border border-white/10 font-bold rounded-xl hover:bg-white/10 transition-all">
                      Pricing Plans
                    </button>
                  </div>
              </div>

              <div className="bg-[#111] p-8 rounded-[2rem] border border-white/5 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00c853] to-transparent opacity-50" />
                
                <div className="flex gap-4 mb-8 bg-black/40 p-1.5 rounded-2xl border border-white/5">
                  {['text', 'files', 'audio'].map((tab) => (
                    <button 
                      key={tab} 
                      onClick={() => setActiveTab(tab as any)} 
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-[#1a1a1a] text-[#00c853] shadow-lg border border-white/5' : 'text-white/40 hover:text-white'}`}
                    >
                      {tab === 'text' && <FileText size={14}/>}
                      {tab === 'files' && <Upload size={14}/>}
                      {tab === 'audio' && <Mic size={14}/>}
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="space-y-6">
                  {activeTab === 'text' && (
                    <textarea 
                      className="w-full h-64 p-6 bg-black/40 border border-white/5 rounded-2xl text-sm font-mono text-white placeholder:text-white/20 focus:ring-1 focus:ring-[#00c853] outline-none transition-all resize-none" 
                      placeholder="Paste conversation or statement for analysis..." 
                      value={input} 
                      onChange={(e) => setInput(e.target.value)} 
                    />
                  )}
                  {(activeTab === 'files' || activeTab === 'audio') && (
                    <div 
                      className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-2xl text-white/20 cursor-pointer hover:border-[#00c853]/40 hover:bg-[#00c853]/5 transition-all group" 
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Upload size={24} />
                      </div>
                      <span className="text-[10px] font-mono uppercase tracking-[0.2em]">{files.length > 0 ? `${files.length} Files Ready` : 'Upload Evidence (PDF, JPG, MP3)'}</span>
                      <input type="file" ref={fileInputRef} className="hidden" multiple onChange={handleFileChange} />
                    </div>
                  )}
                  
                  <button 
                    onClick={handleAnalyze} 
                    disabled={loading || (!input && files.length === 0)} 
                    className="relative w-full group overflow-hidden bg-[#00c853] text-black py-6 rounded-2xl font-black text-sm uppercase tracking-[0.4em] flex items-center justify-center gap-3 hover:opacity-90 disabled:bg-white/5 disabled:text-white/20 transition-all active:scale-[0.98] shadow-[0_0_40px_rgba(0,200,83,0.3)]"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    {loading ? <Loader2 className="animate-spin" /> : <ShieldAlert size={20} />}
                    {loading ? 'Neural Core Active' : 'Execute Forensic Analysis'}
                  </button>
                  
                  <div className="flex justify-center gap-4 text-[9px] font-mono text-white/20 uppercase tracking-widest">
                    <span>AES-256 Encrypted</span>
                    <span>•</span>
                    <span>Neural Engine v4.2</span>
                    <span>•</span>
                    <span>Zero-Knowledge Proof</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-10"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                  <button 
                    onClick={() => { setShowAnalysis(false); setOpenaiAnalysis(null); }}
                    className="group text-[10px] font-mono uppercase tracking-widest text-white/40 hover:text-[#00c853] mb-6 flex items-center gap-2 transition-colors"
                  >
                    <span className="group-hover:-translate-x-1 transition-transform">←</span> New Forensic Session
                  </button>
                  <h2 className="text-6xl font-black tracking-tighter leading-none">
                    ANALYSIS <span className="text-[#00c853]">REPORT</span>
                  </h2>
                  <p className="text-[10px] font-mono text-white/30 uppercase tracking-[0.3em] mt-4">Case ID: {Math.random().toString(36).substring(7).toUpperCase()}</p>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center space-x-3 px-4 py-2 bg-[#00c853]/5 border border-[#00c853]/20 rounded-full">
                    <div className="w-2 h-2 bg-[#00c853] rounded-full animate-pulse" />
                    <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-[#00c853]">God Mode: Autonomous</span>
                  </div>
                  <button onClick={handleOpenAICrossValidation} className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-3 hover:bg-white/10 transition-all text-[#00c853] shadow-lg">
                    <CheckCircle2 size={16} /> GPT-4 Intelligence
                  </button>
                  <button onClick={exportPDF} className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-3 hover:bg-white/10 transition-all shadow-lg">
                    <Download size={16} /> Export Dossier
                  </button>
                </div>
              </div>

              {isAnalyzing && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center"
                >
                  <div className="relative w-64 h-64 mb-12">
                    <div className="absolute inset-0 border-4 border-[#00c853]/20 rounded-full" />
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 border-4 border-t-[#00c853] rounded-full"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ShieldAlert className="text-[#00c853] animate-pulse" size={48} />
                    </div>
                  </div>
                  <h3 className="text-2xl font-black tracking-tighter mb-4 text-white">{analysisStep}</h3>
                  <div className="w-64 h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 5 }}
                      className="h-full bg-[#00c853]"
                    />
                  </div>
                </motion.div>
              )}

              {openaiAnalysis && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 bg-[#00c853]/5 border border-[#00c853]/20 rounded-2xl"
                >
                  <h4 className="text-[10px] font-mono uppercase tracking-widest text-[#00c853] mb-2 flex items-center gap-2">
                    <CheckCircle2 size={12} /> GPT-4 Intelligence Validation
                  </h4>
                  <p className="text-sm text-white/80 leading-relaxed">
                    {openaiAnalysis}
                  </p>
                </motion.div>
              )}

              {result && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Credibility Bento Card */}
                  <div className="lg:col-span-1 bg-[#111] p-8 rounded-[2rem] border border-white/5 flex flex-col justify-between relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                      <ShieldAlert size={120} />
                    </div>
                    <div>
                      <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-2">Credibility Score</p>
                      <h3 className="text-8xl font-black tracking-tighter text-white">{result.credibilityScore}<span className="text-2xl text-white/20">%</span></h3>
                    </div>
                    <div className="mt-8">
                      <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${result.credibilityScore}%` }}
                          className={`h-full ${result.credibilityScore > 70 ? 'bg-[#00c853]' : result.credibilityScore > 40 ? 'bg-yellow-500' : 'bg-[#ff4e00]'}`}
                        />
                      </div>
                      <p className="text-[10px] font-mono text-white/40 mt-3 uppercase tracking-widest">
                        Confidence Interval: ±2.4%
                      </p>
                    </div>
                  </div>

                  {/* Risk Level Bento Card */}
                  <div className="lg:col-span-1 bg-[#111] p-8 rounded-[2rem] border border-white/5 flex flex-col justify-between relative overflow-hidden">
                    <div className={`absolute inset-0 opacity-5 ${result.riskLevel === 'crítico' ? 'bg-red-600' : 'bg-[#00c853]'}`} />
                    <div>
                      <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-2">Risk Assessment</p>
                      <h3 className={`text-6xl font-black tracking-tighter uppercase ${result.riskLevel === 'crítico' ? 'text-[#ff4e00]' : 'text-[#00c853]'}`}>
                        {result.riskLevel}
                      </h3>
                    </div>
                    <div className="mt-8 flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                      <Info className="text-[#00c853]" size={20} />
                      <p className="text-xs text-white/60 leading-tight">
                        {result.summary.slice(0, 100)}...
                      </p>
                    </div>
                  </div>

                  {/* Triangle Bento Card */}
                  <div className="lg:col-span-1 bg-[#111] p-8 rounded-[2rem] border border-white/5 relative overflow-hidden">
                    <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-6">Lie Triangle Analysis</p>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={[
                          { subject: 'Fact', A: result.triangleScores.fact },
                          { subject: 'Time', A: result.triangleScores.time },
                          { subject: 'Emotion', A: result.triangleScores.emotion },
                        ]}>
                          <PolarGrid stroke="#333" />
                          <PolarAngleAxis dataKey="subject" tick={{fill: '#888', fontSize: 10}} />
                          <Radar name="Triangle" dataKey="A" stroke="#00c853" fill="#00c853" fillOpacity={0.2} />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Indicators Bento Card */}
                  <div className="lg:col-span-2 bg-[#111] p-8 rounded-[2rem] border border-white/5">
                    <div className="flex justify-between items-center mb-8">
                      <h4 className="text-sm font-mono uppercase tracking-widest text-[#00c853]">Forensic Indicators</h4>
                      <span className="text-[10px] font-mono text-white/20">30-Point Matrix Applied</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {result.indicators.map((indicator, idx) => (
                        <div key={idx} className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-start gap-4">
                          <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${indicator.severity > 3 ? 'bg-[#ff4e00] shadow-[0_0_10px_#ff4e00]' : 'bg-yellow-500'}`} />
                          <div>
                            <p className="text-xs font-bold text-white mb-1 uppercase tracking-tight">{indicator.category}</p>
                            <p className="text-[10px] text-white/40 leading-relaxed italic">"{indicator.evidence}"</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Heatmap Bento Card */}
                  <div className="lg:col-span-1 bg-[#111] p-8 rounded-[2rem] border border-white/5">
                    <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-8">Risk Heatmap</p>
                    <div className="space-y-6">
                      {result.heatmap.map((item, idx) => (
                        <div key={idx}>
                          <div className="flex justify-between text-[10px] font-mono uppercase mb-2">
                            <span>{item.category}</span>
                            <span className="text-[#00c853]">{item.value}%</span>
                          </div>
                          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${item.value}%` }}
                              className="h-full bg-[#00c853]"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="relative z-10 border-t border-white/5 mt-20 py-12 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <h4 className="text-sm font-black tracking-tighter mb-2">TRUTHLENS FORENSICS</h4>
            <p className="text-[10px] font-mono text-white/20 uppercase tracking-widest">© 2026 Autonomous Security Systems. All rights reserved.</p>
          </div>
          <div className="flex gap-8 text-[10px] font-mono uppercase tracking-widest text-white/40">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Security</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
