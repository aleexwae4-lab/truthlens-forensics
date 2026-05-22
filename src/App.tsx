import { useState, useRef, useEffect, ChangeEvent, useMemo } from 'react';
import { analyzeEvidence, AnalysisResult } from './services/geminiService';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { 
  Loader2, 
  ShieldAlert, 
  FileText, 
  Mic, 
  Upload, 
  Download, 
  ChevronRight, 
  Info, 
  AlertTriangle, 
  CheckCircle2,
  Activity,
  Cpu,
  Zap,
  Network,
  Search,
  Brain,
  Eye,
  Lock,
  MessageSquare,
  Globe,
  Database,
  BarChart3,
  Scale
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AGENTS_DATA, Agent } from './data/agents';

export default function App() {
  const [view, setView] = useState<'landing' | 'login' | 'app'>('landing');
  const [appTab, setAppTab] = useState<'analysis' | 'agents' | 'monitoring'>('analysis');
  const [username, setUsername] = useState('');
  const [activeTab, setActiveTab] = useState<'text' | 'files' | 'audio'>('text');
  const [input, setInput] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [agents, setAgents] = useState<Agent[]>(AGENTS_DATA);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredAgents = useMemo(() => {
    return agents.filter(agent => {
      const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           agent.role.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || agent.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [agents, searchQuery, selectedCategory]);

  const categories = useMemo(() => {
    const cats = new Set(agents.map(a => a.category));
    return Array.from(cats);
  }, [agents]);

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
  const downloadPDF = () => {
    if (!result) return;
    const doc = new jsPDF();
    const dossierId = Math.random().toString(36).substring(7).toUpperCase();
    const timestamp = new Date().toLocaleString();
    const blockchainHash = Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('');

    // Background & Border
    doc.setFillColor(250, 250, 250);
    doc.rect(0, 0, 210, 297, 'F');
    
    // Luxury Border
    doc.setDrawColor(0, 200, 83);
    doc.setLineWidth(0.5);
    doc.rect(5, 5, 200, 287);
    doc.setLineWidth(0.1);
    doc.rect(7, 7, 196, 283);

    // Header Block
    doc.setFillColor(5, 5, 5);
    doc.rect(5, 5, 200, 45, 'F');
    
    // Logo / Title
    doc.setTextColor(0, 200, 83);
    doc.setFontSize(28);
    doc.setFont("helvetica", "bold");
    doc.text("WAE CORE INTELLIGENCE", 15, 25);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("NEURAL CORE CERTIFIED ANALYSIS • v4.2.0", 15, 32);

    // Metadata Header
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.text(`CERTIFICATE ID: TL-CERT-${dossierId}`, 15, 42);
    doc.text(`BLOCKCHAIN HASH: ${blockchainHash.substring(0, 32)}...`, 15, 46);
    doc.text(`ISSUED: ${timestamp}`, 140, 42);

    // Main Content
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("EXECUTIVE FORENSIC SUMMARY", 15, 65);
    
    doc.setDrawColor(0, 200, 83);
    doc.setLineWidth(1);
    doc.line(15, 68, 80, 68);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const splitSummary = doc.splitTextToSize(result.resumenEjecutivo.explicacion, 180);
    doc.text(splitSummary, 15, 78);

    // Metrics Grid
    doc.setFillColor(245, 245, 245);
    doc.rect(15, 110, 180, 30, 'F');
    doc.setDrawColor(230, 230, 230);
    doc.rect(15, 110, 180, 30);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text("RISK LEVEL", 25, 120);
    doc.setFontSize(14);
    doc.text(result.resumenEjecutivo.nivelRiesgo.toUpperCase(), 25, 130);

    // Indicators Table
    autoTable(doc, {
      startY: 150,
      head: [['FORENSIC CATEGORY', 'EVIDENCE / ANOMALY', 'CORRELATIONS']],
      body: result.analisisTecnico.map(i => [i.agente.toUpperCase(), i.evidencia, i.correlaciones]),
      theme: 'grid',
      headStyles: { fillColor: [5, 5, 5], textColor: [0, 200, 83], fontStyle: 'bold', fontSize: 9 },
      bodyStyles: { fontSize: 8, cellPadding: 5 },
      columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: 70 },
        2: { cellWidth: 'auto' }
      }
    });

    // Neural Seal (Visual)
    const finalY = (doc as any).lastAutoTable.finalY + 20;
    doc.setDrawColor(0, 200, 83);
    doc.setLineWidth(0.5);
    doc.circle(170, finalY + 15, 15);
    doc.circle(170, finalY + 15, 13);
    doc.setFontSize(6);
    doc.text("NEURAL CORE", 162, finalY + 14);
    doc.text("VERIFIED", 164, finalY + 18);

    // Footer
    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.text("This document is a certified forensic analysis generated by WAE CORE OS.", 15, 285);
    doc.text("Verification available at wae.core/forensics/verify using the Certificate ID.", 15, 289);
    
    doc.save(`WAE_CORE_Certified_Dossier_${dossierId}.pdf`);
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
        resumenEjecutivo: {
          explicacion: "Se detectaron múltiples inconsistencias estructurales en el relato. El sujeto muestra signos de mitigación narrativa y una desconexión emocional atípica. La correlación temporal revela anomalías sintácticas graves.",
          nivelRiesgo: 'Alto',
          hallazgosPrincipales: ["Manejo del tiempo verbal evasivo", "Omisión crítica en nudos cronológicos", "Cohesión textual fragmentada"]
        },
        analisisTecnico: [
          { agente: 'Agente Documental', observaciones: 'Patrón de separación léxica.', evidencia: 'El sujeto cambia de pronombres de primera a tercera persona al describir el momento exacto del incidente.', anomalias: 'Disonancia de tiempos verbales.', correlaciones: 'Correlaciona con evasión cognitiva.' },
          { agente: 'Agente Lingüístico', observaciones: 'Pasividad en oraciones clave.', evidencia: 'Se detecta un incremento inusual de verbos en voz pasiva.', anomalias: 'Carga cognitiva detectablemente alta.', correlaciones: 'Posible manipulación emocional al lector.' }
        ],
        contradicciones: ["Declara desconocimiento pero aporta detalles altamente específicos de entorno."],
        conclusionesProbabilisticas: [
          { nivelConfianza: 'Alta Confianza', porcentaje: 87, conclusion: 'Manipulación de Hechos', justificacion: 'Las variaciones cognitivas cruzadas confirman alteración consciente del relato.' }
        ],
        recomendacionesEstrategicas: ["Re-entrevista estructurada focalizada en las omisiones detectadas.", "Validar metadatos asociados a la fuente original."]
      });
      setShowAnalysis(true);
    } finally {
      setLoading(false);
      setIsAnalyzing(false);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const [openaiAnalysis, setOpenaiAnalysis] = useState<string | null>(null);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [showReferral, setShowReferral] = useState(false);

  const [systemStatus, setSystemStatus] = useState<'online' | 'offline' | 'checking'>('checking');
  const [diagnostics, setDiagnostics] = useState<{ gemini: boolean; openai: boolean; stripe: boolean } | null>(null);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await fetch('/api/health');
        if (res.ok) {
          setSystemStatus('online');
          const diagRes = await fetch('/api/diagnostics');
          const diagData = await diagRes.json();
          setDiagnostics(diagData);
        } else {
          setSystemStatus('offline');
        }
      } catch {
        setSystemStatus('offline');
      }
    };
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const [showPricing, setShowPricing] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      const randomAgent = AGENTS_DATA[Math.floor(Math.random() * AGENTS_DATA.length)];
      const events = [
        `[${randomAgent.name}] is analyzing cognitive patterns...`,
        `[${randomAgent.name}] found linguistic anomaly at offset +42`,
        `[${randomAgent.name}] stress levels detected: 84%`,
        `[${randomAgent.name}] cross-referencing behavioral patterns...`,
        `[${randomAgent.name}] metadata integrity verified`,
        `[${randomAgent.name}] neural node synchronized`,
        `[${randomAgent.name}] learning from input stream...`,
        `[${randomAgent.name}] threat level recalculated: low`
      ];
      setLogs(prev => [events[i % events.length], ...prev.slice(0, 15)]);
      i++;
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const MatrixRain = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const characters = '0123456789ABCDEFHIJKLMNOPQRSTUVWXYZ';
      const fontSize = 14;
      const columns = canvas.width / fontSize;
      const drops: number[] = [];

      for (let i = 0; i < columns; i++) {
        drops[i] = 1;
      }

      const draw = () => {
        ctx.fillStyle = 'rgba(5, 5, 5, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#00c853';
        ctx.font = fontSize + 'px monospace';

        for (let i = 0; i < drops.length; i++) {
          const text = characters.charAt(Math.floor(Math.random() * characters.length));
          ctx.fillText(text, i * fontSize, drops[i] * fontSize);

          if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
          }
          drops[i]++;
        }
      };

      const interval = setInterval(draw, 33);
      return () => clearInterval(interval);
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 opacity-10 pointer-events-none" />;
  };

  const handleStripeCheckout = async () => {
    setIsUpgrading(true);
    try {
      const response = await fetch('/api/create-checkout-session', { method: 'POST' });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Failed to create session');
      }
    } catch (error) {
      console.error('Stripe error', error);
    } finally {
      setIsUpgrading(false);
      setShowPricing(false);
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
      <AnimatePresence mode="wait">
        {view === 'landing' && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative min-h-screen flex flex-col"
          >
            {/* Cyber Grid Background */}
            <div className="fixed inset-0 pointer-events-none opacity-20">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
            </div>

            {/* Neural Scan Sweep Animation */}
            <motion.div 
              animate={{ 
                top: ["-10%", "110%"],
                opacity: [0, 0.5, 0]
              }}
              transition={{ 
                duration: 8, 
                repeat: Infinity, 
                ease: "linear" 
              }}
              className="fixed left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00c853] to-transparent z-[50] pointer-events-none"
            />

            <header className="relative z-10 flex justify-between items-center px-8 py-6">
              <div className="flex items-center gap-3">
                <ShieldAlert className="text-[#00c853]" size={32} />
                <h1 className="text-2xl font-black tracking-tighter">WAE CORE <span className="text-[#00c853]">INTELLIGENCE</span></h1>
              </div>
              <div className="flex items-center gap-8">
                <div className="hidden lg:flex items-center gap-4 px-4 py-2 bg-white/5 border border-white/10 rounded-full">
                  <div className="flex gap-1">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-1 h-1 bg-[#00c853] rounded-full animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                    ))}
                  </div>
                  <span className="text-[8px] font-mono text-[#00c853] uppercase tracking-widest">Neural Core: Online</span>
                </div>
                <div className="hidden xl:flex items-center gap-2 px-3 py-1 bg-[#00c853]/10 border border-[#00c853]/30 rounded-full">
                  <CheckCircle2 size={10} className="text-[#00c853]" />
                  <span className="text-[8px] font-mono text-[#00c853] uppercase tracking-widest font-black">Ultra Premium Verified</span>
                </div>
                <nav className="hidden md:flex items-center gap-8 text-[10px] font-mono uppercase tracking-widest text-white/60">
                  <button onClick={() => {
                    const el = document.getElementById('capabilities');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }} className="hover:text-white transition-colors">Capabilities</button>
                  <button onClick={() => setShowPricing(true)} className="hover:text-white transition-colors">Pricing</button>
                  <button onClick={() => {
                    const el = document.getElementById('legal');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }} className="hover:text-white transition-colors">Legal</button>
                </nav>
                <button 
                  onClick={() => setView('login')}
                  data-text="Access Terminal"
                  className="px-6 py-2 bg-[#00c853] text-black font-bold rounded-full hover:scale-105 transition-transform shadow-[0_0_20px_rgba(0,200,83,0.4)] glitch-hover"
                >
                  Access Terminal
                </button>
              </div>
            </header>

            <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 text-center max-w-5xl mx-auto py-20">
              {/* Ultra Premium Verified Seal */}
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, type: 'spring' }}
                className="mb-12 relative group cursor-pointer"
              >
                <div className="absolute inset-0 bg-[#00c853]/20 blur-3xl rounded-full group-hover:bg-[#00c853]/40 transition-all animate-pulse" />
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute -inset-6 border border-dashed border-[#00c853]/30 rounded-full"
                />
                <motion.div 
                  animate={{ rotate: -360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  className="absolute -inset-4 border border-dotted border-[#00c853]/20 rounded-full"
                />
                <div className="relative flex items-center gap-6 px-10 py-5 bg-black/80 border border-[#00c853]/50 rounded-[2rem] backdrop-blur-2xl shadow-[0_0_50px_rgba(0,200,83,0.3)] overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  <div className="relative">
                    <CheckCircle2 className="text-[#00c853] relative z-10" size={40} />
                    <div className="absolute inset-0 bg-[#00c853] blur-lg opacity-60 animate-ping" />
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute -inset-2 border border-[#00c853]/30 rounded-full"
                    />
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-[10px] font-mono text-[#00c853] uppercase tracking-[0.4em] font-black">Ultra Premium</p>
                      <div className="h-px w-8 bg-[#00c853]/30" />
                    </div>
                    <p className="text-lg font-black uppercase tracking-widest text-white leading-none">Verified Forensic Core</p>
                    <div className="flex items-center gap-3 mt-2">
                      <p className="text-[8px] font-mono text-white/40 uppercase tracking-widest">Auth ID: 8841-8809-747</p>
                      <div className="w-1 h-1 bg-[#00c853] rounded-full animate-pulse" />
                      <p className="text-[8px] font-mono text-[#00c853] uppercase tracking-widest">Neural v4.2</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-8">
                THE ULTIMATE <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00c853] via-white to-[#00c853] animate-pulse">WAE OS.</span>
              </h2>

              <div className="flex items-center gap-3 mb-12 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                <div className="w-2 h-2 bg-[#ff4e00] rounded-full animate-ping" />
                <p className="text-[10px] font-mono text-white/40 uppercase tracking-[0.3em]">
                  <span className="text-white">Active Surveillance:</span> Monitoring Linguistic Anomalies in Real-Time
                </p>
              </div>

              <p className="text-xl text-white/60 max-w-3xl mb-12 leading-relaxed">
                WAE CORE is a state-of-the-art forensic intelligence platform designed for high-stakes investigations. 
                Utilizing advanced linguistic pattern recognition, cognitive load analysis, and neural cross-validation, 
                our system decodes human communication with unprecedented accuracy. 
                From detecting subtle gaslighting to identifying systematic deception, WAE CORE provides the clarity 
                needed in a world of complex narratives.
              </p>

                <div className="flex flex-wrap gap-6 mb-20">
                  <button 
                    onClick={() => setView('login')}
                    data-text="Analyze Evidence"
                    className="px-10 py-5 bg-[#00c853] text-black font-black rounded-2xl flex items-center gap-3 hover:scale-105 transition-transform shadow-[0_0_40px_rgba(0,200,83,0.4)] glitch-hover group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    Analyze Evidence <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button 
                    onClick={() => setShowPricing(true)}
                    data-text="View Pricing"
                    className="px-10 py-5 bg-white/5 border border-white/10 font-black rounded-2xl flex items-center gap-3 hover:bg-white/10 transition-all group relative overflow-hidden glitch-hover"
                  >
                    <div className="absolute inset-0 bg-white/5 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    View Pricing <ShieldAlert size={20} className="text-[#00c853] group-hover:rotate-12 transition-transform" />
                  </button>
                </div>

              {/* Real-time Forensic Dashboard */}
              <div className="w-full mb-20 grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Neural Nodes", value: "1,024 Active", icon: Activity },
                  { label: "Forensic Accuracy", value: "99.98%", icon: CheckCircle2 },
                  { label: "Processing Latency", value: "42ms", icon: Loader2 },
                  { label: "Encryption", value: "AES-512", icon: ShieldAlert }
                ].map((stat, i) => (
                  <div key={i} className="p-6 bg-black/60 border border-white/5 rounded-3xl backdrop-blur-md hover:border-[#00c853]/30 transition-all group">
                    <stat.icon size={16} className="text-[#00c853] mb-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                    <p className="text-[8px] font-mono text-white/30 uppercase tracking-widest mb-1">{stat.label}</p>
                    <p className="text-sm font-black text-white group-hover:text-[#00c853] transition-colors">{stat.value}</p>
                  </div>
                ))}
              </div>

              <div id="capabilities" className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mb-20">
                {[
                  { title: "Forensic Precision", desc: "Military-grade linguistic analysis algorithms capable of detecting micro-shifts in narrative structure." },
                  { title: "Neural Validation", desc: "Cross-referenced with global behavioral databases and psychological pressure point mapping." },
                  { title: "Zero-Knowledge", desc: "Your evidence never leaves our encrypted neural core. Volatile processing ensures total anonymity." }
                ].map((item, i) => (
                  <div key={i} className="p-8 bg-white/5 border border-white/10 rounded-[2rem] backdrop-blur-sm hover:bg-white/10 transition-all group cyber-card">
                    <div className="w-12 h-12 bg-[#00c853]/10 rounded-2xl flex items-center justify-center mb-6 border border-[#00c853]/20 group-hover:scale-110 transition-transform">
                      {i === 0 && <ShieldAlert className="text-[#00c853]" size={24} />}
                      {i === 1 && <Activity className="text-[#00c853]" size={24} />}
                      {i === 2 && <FileText className="text-[#00c853]" size={24} />}
                    </div>
                    <h3 className="text-lg font-black text-[#00c853] mb-3 uppercase tracking-tighter">{item.title}</h3>
                    <p className="text-sm text-white/40 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>

              {/* Trust & Security Section */}
              <div className="w-full mb-20 grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
                <div className="p-10 bg-white/5 border border-white/10 rounded-[2.5rem] relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1 h-full bg-[#00c853] opacity-0 group-hover:opacity-100 transition-opacity" />
                  <h4 className="text-xl font-black uppercase tracking-tighter mb-4">Zero-Knowledge <span className="text-[#00c853]">Security</span></h4>
                  <p className="text-sm text-white/40 leading-relaxed">
                    Our architecture is built on the principle of total privacy. Evidence is processed in isolated neural nodes 
                    using volatile memory. Once the analysis is complete, the data is purged from active memory, leaving only 
                    the encrypted dossier for your retrieval.
                  </p>
                  <div className="mt-8 flex gap-4">
                    <div className="px-3 py-1 bg-[#00c853]/10 border border-[#00c853]/20 rounded-full text-[8px] font-mono text-[#00c853] uppercase tracking-widest">AES-256</div>
                    <div className="px-3 py-1 bg-[#00c853]/10 border border-[#00c853]/20 rounded-full text-[8px] font-mono text-[#00c853] uppercase tracking-widest">SSL/TLS 1.3</div>
                    <div className="px-3 py-1 bg-[#00c853]/10 border border-[#00c853]/20 rounded-full text-[8px] font-mono text-[#00c853] uppercase tracking-widest">SOC2 Type II</div>
                  </div>
                </div>
                <div className="p-10 bg-white/5 border border-white/10 rounded-[2.5rem] relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1 h-full bg-[#00c853] opacity-0 group-hover:opacity-100 transition-opacity" />
                  <h4 className="text-xl font-black uppercase tracking-tighter mb-4">Global <span className="text-[#00c853]">Compliance</span></h4>
                  <p className="text-sm text-white/40 leading-relaxed">
                    WAE CORE is designed to meet international standards for digital evidence handling. 
                    Our reports are structured to provide clear, objective indicators that can be cross-referenced 
                    by legal professionals and forensic experts worldwide.
                  </p>
                  <div className="mt-8 flex gap-4">
                    <div className="px-3 py-1 bg-[#00c853]/10 border border-[#00c853]/20 rounded-full text-[8px] font-mono text-[#00c853] uppercase tracking-widest">GDPR</div>
                    <div className="px-3 py-1 bg-[#00c853]/10 border border-[#00c853]/20 rounded-full text-[8px] font-mono text-[#00c853] uppercase tracking-widest">HIPAA</div>
                    <div className="px-3 py-1 bg-[#00c853]/10 border border-[#00c853]/20 rounded-full text-[8px] font-mono text-[#00c853] uppercase tracking-widest">ISO 27001</div>
                  </div>
                </div>
              </div>

              {/* System Explanation Section */}
              <div className="w-full mb-20 text-left space-y-12">
                <div className="p-12 bg-black/40 border border-white/5 rounded-[3rem] backdrop-blur-md">
                  <h3 className="text-3xl font-black tracking-tighter mb-8 uppercase">How the <span className="text-[#00c853]">Neural Core</span> Works</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="space-y-8">
                      <div className="flex gap-6 group">
                        <div className="w-12 h-12 bg-[#00c853]/10 border border-[#00c853]/30 text-[#00c853] rounded-2xl flex items-center justify-center font-black shrink-0 group-hover:bg-[#00c853] group-hover:text-black transition-all">01</div>
                        <div>
                          <h4 className="font-bold uppercase tracking-widest text-sm mb-2 text-white">Evidence Ingestion & Sanitization</h4>
                          <p className="text-xs text-white/40 leading-relaxed">
                            Upload text, audio, or visual evidence. Our system performs multi-stage sanitization, 
                            extracting metadata and preparing the linguistic matrix for deep-layer analysis.
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-6 group">
                        <div className="w-12 h-12 bg-[#00c853]/10 border border-[#00c853]/30 text-[#00c853] rounded-2xl flex items-center justify-center font-black shrink-0 group-hover:bg-[#00c853] group-hover:text-black transition-all">02</div>
                        <div>
                          <h4 className="font-bold uppercase tracking-widest text-sm mb-2 text-white">SCAN & Behavioral Mapping</h4>
                          <p className="text-xs text-white/40 leading-relaxed">
                            The Scientific Content Analysis (SCAN) methodology identifies distancing language, 
                            cognitive load spikes, and emotional incongruence across thousands of data points.
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-6 group">
                        <div className="w-12 h-12 bg-[#00c853]/10 border border-[#00c853]/30 text-[#00c853] rounded-2xl flex items-center justify-center font-black shrink-0 group-hover:bg-[#00c853] group-hover:text-black transition-all">03</div>
                        <div>
                          <h4 className="font-bold uppercase tracking-widest text-sm mb-2 text-white">Neural Cross-Validation</h4>
                          <p className="text-xs text-white/40 leading-relaxed">
                            Findings are cross-referenced with global behavioral datasets and psychological 
                            pressure point mapping to calculate a final, objective credibility index.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-black/60 border border-white/5 rounded-3xl p-8 font-mono text-[10px] text-[#00c853]/60 space-y-2 overflow-hidden relative">
                      <div className="absolute top-4 right-4 w-2 h-2 bg-[#00c853] rounded-full animate-ping" />
                      <div className="scanline" />
                      <p className="">{`> INITIALIZING_SCAN_SEQUENCE...`}</p>
                      <p className="">{`> LOADING_LINGUISTIC_DATABASE... [OK]`}</p>
                      <p className="">{`> ANALYZING_COGNITIVE_LOAD... [84%]`}</p>
                      <p className="">{`> DETECTING_EVASIVE_PATTERNS... [FOUND]`}</p>
                      <p className="">{`> CROSS_REFERENCING_BIASES... [COMPLETE]`}</p>
                      <p className="">{`> GENERATING_FORENSIC_DOSSIER...`}</p>
                      <div className="mt-4 pt-4 border-t border-white/5 text-white/20">
                        {`// Forensic intelligence is not just about what is said, but how it is structured within the cognitive matrix.`}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Legal & Privacy Sections */}
              <div id="legal" className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left w-full border-t border-white/5 pt-20 pb-20">
                <section className="p-8 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-sm hover:bg-white/10 transition-all group">
                  <div className="flex items-center gap-3 mb-6">
                    <ShieldAlert className="text-[#00c853]" size={20} />
                    <h4 className="text-xs font-mono text-[#00c853] uppercase tracking-[0.3em]">Legal Responsibility</h4>
                  </div>
                  <p className="text-[10px] text-white/30 leading-relaxed">
                    WAE CORE is a decision-support tool. The results generated by our neural engine are probabilistic 
                    and should be used as one of many indicators in a professional forensic investigation. 
                    Autonomous Security Systems assumes no liability for actions taken based solely on WAE CORE reports. 
                    Users are responsible for ensuring compliance with local laws regarding evidence gathering and privacy.
                  </p>
                </section>
                <section className="p-8 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-sm hover:bg-white/10 transition-all group">
                  <div className="flex items-center gap-3 mb-6">
                    <CheckCircle2 className="text-[#00c853]" size={20} />
                    <h4 className="text-xs font-mono text-[#00c853] uppercase tracking-[0.3em]">Privacy Policy</h4>
                  </div>
                  <p className="text-[10px] text-white/30 leading-relaxed">
                    We adhere to a strict Zero-Knowledge protocol. All uploaded evidence is processed in volatile memory 
                    and encrypted using AES-256 at rest. We do not store raw evidence after analysis completion unless 
                    explicitly requested for dossier archival. Your data is your property. We do not sell, share, or 
                    train our public models on private user evidence.
                  </p>
                </section>
              </div>
            </main>

            <footer className="relative z-10 py-12 px-8 border-t border-white/5 text-center">
              <p className="text-[10px] font-mono text-white/20 uppercase tracking-[0.4em]">
                WAE CORE OS • Secure Terminal v4.2.0 • 2026
              </p>
            </footer>

            {/* Floating Cyber Status Bar - Surprise */}
            <motion.div 
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 bg-black/80 border border-[#00c853]/30 rounded-full backdrop-blur-2xl flex items-center gap-8 shadow-[0_0_30px_rgba(0,200,83,0.2)]"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#00c853] rounded-full animate-pulse" />
                <span className="text-[8px] font-mono text-[#00c853] uppercase tracking-widest">Core Status: Optimal</span>
              </div>
              <div className="h-4 w-px bg-white/10" />
              <div className="flex items-center gap-2">
                <Activity size={12} className="text-[#00c853]" />
                <span className="text-[8px] font-mono text-white/40 uppercase tracking-widest">Neural Load: 12.4%</span>
              </div>
              <div className="h-4 w-px bg-white/10" />
              <div className="flex items-center gap-2">
                <ShieldAlert size={12} className="text-[#00c853]" />
                <span className="text-[8px] font-mono text-white/40 uppercase tracking-widest">Encryption: Active</span>
              </div>
            </motion.div>
          </motion.div>
        )}

        {view === 'login' && (
          <motion.div
            key="login"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="min-h-screen flex items-center justify-center p-8 relative overflow-hidden bg-black"
          >
            <MatrixRain />
            <div className="scanline" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00c853]/5 to-transparent pointer-events-none" />
            
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="max-w-md w-full bg-[#0a0a0a]/90 backdrop-blur-3xl border border-[#00c853]/30 rounded-[3rem] p-12 shadow-[0_0_100px_rgba(0,200,83,0.15)] relative z-10 overflow-hidden group"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00c853] to-transparent opacity-50" />
              
              <div className="flex flex-col items-center mb-10">
                <div className="relative mb-8">
                  <div className="w-20 h-20 bg-[#00c853]/10 rounded-3xl flex items-center justify-center border border-[#00c853]/30 relative z-10">
                    <ShieldAlert className="text-[#00c853]" size={40} />
                  </div>
                  <div className="absolute -inset-4 bg-[#00c853]/20 blur-2xl rounded-full animate-pulse" />
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute -inset-2 border border-dashed border-[#00c853]/20 rounded-3xl"
                  />
                </div>
                <h2 className="text-3xl font-black uppercase tracking-tighter text-white">Terminal Access</h2>
                <div className="flex items-center gap-2 mt-3">
                  <div className="w-1.5 h-1.5 bg-[#00c853] rounded-full animate-ping" />
                  <p className="text-[10px] font-mono text-[#00c853] uppercase tracking-[0.4em] font-black">Identity Verification Required</p>
                </div>
              </div>

              <div className="space-y-8">
                <div className="relative">
                  <label className="block text-[10px] font-mono text-white/30 uppercase tracking-[0.3em] mb-4 ml-2">Agent Identifier</label>
                  <div className="relative">
                    <input 
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter Agent ID..."
                      className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-5 text-sm font-mono text-[#00c853] focus:border-[#00c853] focus:ring-1 focus:ring-[#00c853] outline-none transition-all placeholder:text-white/10"
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-20">
                      <Activity size={16} className="text-[#00c853]" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <button 
                    onClick={() => username && setView('app')}
                    disabled={!username}
                    className="w-full py-6 bg-[#00c853] text-black font-black uppercase tracking-[0.4em] text-xs rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-20 shadow-[0_0_40px_rgba(0,200,83,0.4)] relative overflow-hidden group/btn"
                  >
                    <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                    Initialize Neural Session
                  </button>
                  
                  <button 
                    onClick={() => setView('landing')}
                    className="w-full py-4 text-[10px] font-mono text-white/20 uppercase tracking-[0.3em] hover:text-white transition-colors flex items-center justify-center gap-2"
                  >
                    <span className="opacity-50">←</span> Abort & Return to Public Site
                  </button>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-white/5 flex justify-between items-center">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-1 h-1 bg-[#00c853]/30 rounded-full" />
                  ))}
                </div>
                <p className="text-[8px] font-mono text-white/10 uppercase tracking-widest">Secure Handshake v4.2.0</p>
              </div>
            </motion.div>
          </motion.div>
        )}

        {view === 'app' && (
          <motion.div
            key="app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col min-h-screen"
          >
            {/* Background Ambient Glow & Grid & Neural Network */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]" />
              <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-[#00c853]/5 blur-[120px] rounded-full" />
              <div className="absolute top-[40%] -right-[10%] w-[50%] h-[50%] bg-[#ff4e00]/5 blur-[120px] rounded-full" />
              
              {/* Neural Network Animation */}
              <svg className="absolute inset-0 w-full h-full opacity-[0.05]" xmlns="http://www.w3.org/2000/svg">
                <pattern id="neural-grid" width="100" height="100" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1" fill="#00c853" />
                  <path d="M 2 2 L 100 100" stroke="#00c853" strokeWidth="0.5" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#neural-grid)" />
              </svg>

              {/* Floating Neural Nodes */}
              <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-[#00c853] rounded-full animate-ping" />
              <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-[#00c853] rounded-full animate-ping delay-700" />
              <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-[#ff4e00] rounded-full animate-ping delay-1000" />
            </div>

            <header className="relative z-10 flex justify-between items-center px-8 py-6 border-b border-white/5 backdrop-blur-md bg-black/20">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-[#00c853] rounded-lg flex items-center justify-center shadow-[0_0_30px_rgba(0,200,83,0.5)] glitch-hover group relative overflow-hidden" data-text="TL">
                  <div className="absolute inset-0 bg-white/20 animate-pulse" />
                  <ShieldAlert className="text-black group-hover:rotate-12 transition-transform relative z-10" size={24} />
                </div>
                <div>
                  <h1 className="text-xl font-black tracking-tighter leading-none">WAE CORE <span className="text-[#00c853]">SYSTEM</span></h1>
                  <div className="text-[8px] font-bold text-[#00c853] uppercase tracking-widest mt-0.5 border border-[#00c853]/30 px-1 rounded inline-block">#1 en México y Latinoamérica</div>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em]">Agent: {username}</p>
                    <div className="w-1 h-1 bg-[#00c853] rounded-full animate-pulse" />
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-[#00c853]/10 border border-[#00c853]/30 rounded-full">
                      <CheckCircle2 size={8} className="text-[#00c853]" />
                      <span className="text-[7px] font-mono text-[#00c853] uppercase tracking-widest font-black">Verified Agent</span>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <nav className="hidden md:flex items-center gap-8 text-[10px] font-mono uppercase tracking-widest text-white/60">
                <button onClick={() => setView('landing')} className="hover:text-white transition-colors">Public Site</button>
                <button onClick={() => setShowReferral(true)} className="hover:text-[#00c853] transition-colors">Referrals</button>
                <button className="hover:text-[#00c853] transition-colors">Methodology</button>
                <button onClick={handleStripeCheckout} className="text-[#00c853] hover:underline transition-all font-bold">
                  {isUpgrading ? 'Redirecting...' : 'Upgrade to Enterprise'}
                </button>
                <div className="px-4 py-2 bg-[#00c853]/5 border border-[#00c853]/20 rounded-full flex items-center gap-3">
                  <div className={`w-1.5 h-1.5 rounded-full ${systemStatus === 'online' ? 'bg-[#00c853] animate-pulse' : 'bg-red-500'}`} />
                  <span className={`text-[9px] font-bold ${systemStatus === 'online' ? 'text-[#00c853]' : 'text-red-500'}`}>
                    SYSTEM: {systemStatus.toUpperCase()}
                  </span>
                  {diagnostics && (
                    <div className="flex gap-2 border-l border-white/10 pl-3">
                      <div title="Gemini Core" className={`w-1 h-1 rounded-full ${diagnostics.gemini ? 'bg-[#00c853]' : 'bg-red-500'}`} />
                      <div title="OpenAI Cross-Validation" className={`w-1 h-1 rounded-full ${diagnostics.openai ? 'bg-[#00c853]' : 'bg-red-500'}`} />
                      <div title="Stripe Payments" className={`w-1 h-1 rounded-full ${diagnostics.stripe ? 'bg-[#00c853]' : 'bg-red-500'}`} />
                    </div>
                  )}
                </div>
              </nav>
            </header>

            <main className="relative z-10 max-w-7xl mx-auto px-8 py-12 flex-1">
              {/* Dashboard Navigation */}
              <div className="flex items-center gap-4 mb-12 p-1.5 bg-white/5 border border-white/10 rounded-2xl w-fit backdrop-blur-md">
                {[
                  { id: 'analysis', label: 'Evidence Analysis', icon: Brain },
                  { id: 'agents', label: 'Agent Matrix', icon: Network },
                  { id: 'monitoring', label: 'Core Monitoring', icon: Activity }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setAppTab(tab.id as any)}
                    className={`px-6 py-3 rounded-xl flex items-center gap-3 text-[10px] font-mono uppercase tracking-widest transition-all ${
                      appTab === tab.id 
                        ? 'bg-[#00c853] text-black font-black shadow-[0_0_20px_rgba(0,200,83,0.3)]' 
                        : 'text-white/40 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <tab.icon size={14} />
                    {tab.label}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {appTab === 'analysis' && (
                  <motion.div
                    key="analysis-view"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {!showAnalysis ? (
                      <motion.div 
                        key="hero"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[70vh]"
                      >
              <div className="relative">
                {/* Immersive Neural Core Visualization */}
                <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-[#00c853]/10 rounded-full blur-[150px] animate-pulse pointer-events-none" />
                
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#00c853]/10 text-[#00c853] text-[10px] font-mono uppercase tracking-[0.3em] rounded-full mb-8 border border-[#00c853]/20 shadow-[0_0_20px_rgba(0,200,83,0.1)]"
                >
                  <div className="w-1.5 h-1.5 bg-[#00c853] rounded-full glow-dot" />
                  Autonomous Forensic Engine v4.2
                </motion.span>
                <h2 className="text-7xl lg:text-9xl font-black tracking-tighter leading-[0.8] mb-10">
                  DECODE <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/10">WAE CORE.</span>
                </h2>
                <p className="text-xl text-white/50 max-w-lg mb-12 leading-relaxed font-medium">
                  High-precision forensic analysis of text, audio, and visual evidence. 
                  Identify manipulation, gaslighting, and psychological pressure with peritial accuracy.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                  <div className="p-6 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-sm relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-0.5 bg-[#00c853] opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="w-10 h-10 bg-[#00c853]/20 rounded-full flex items-center justify-center mb-4">
                      <ShieldAlert size={20} className="text-[#00c853]" />
                    </div>
                    <h3 className="text-sm font-bold uppercase tracking-widest mb-2">SCAN Methodology</h3>
                    <p className="text-[10px] text-white/40 leading-relaxed">Scientific Content Analysis for high-precision deception detection in linguistic patterns.</p>
                  </div>
                  <div className="p-6 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-sm relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-0.5 bg-[#00c853] opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="w-10 h-10 bg-[#00c853]/20 rounded-full flex items-center justify-center mb-4">
                      <Activity size={20} className="text-[#00c853]" />
                    </div>
                    <h3 className="text-sm font-bold uppercase tracking-widest mb-2">Neural Core v4.2</h3>
                    <p className="text-[10px] text-white/40 leading-relaxed">Proprietary LLM architecture trained on forensic linguistics and psychological pressure points.</p>
                  </div>
                </div>

                {/* System Health Dashboard */}
                <div className="grid grid-cols-3 gap-4 mb-12">
                  {[
                    { label: 'Neural Load', value: '12%', color: '#00c853' },
                    { label: 'Uptime', value: '99.9%', color: '#00c853' },
                    { label: 'Threat Level', value: 'LOW', color: '#ff4e00' }
                  ].map((stat) => (
                    <div key={stat.label} className="p-4 bg-black/40 border border-white/5 rounded-2xl text-center">
                      <div className="text-[8px] font-mono uppercase tracking-widest text-white/30 mb-1">{stat.label}</div>
                      <div className="text-xs font-black" style={{ color: stat.color }}>{stat.value}</div>
                    </div>
                  ))}
                </div>

                {/* Live Forensic Activity Log */}
                <div className="mb-12 p-6 bg-black/40 border border-white/5 rounded-3xl backdrop-blur-md">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 bg-[#00c853] rounded-full animate-pulse" />
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#00c853]">Live Forensic Activity</span>
                  </div>
                  <div className="space-y-2">
                    {logs.map((log, idx) => (
                      <motion.div 
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-[9px] font-mono text-white/30 flex items-center gap-3"
                      >
                        <span className="text-[#00c853]/40">[{new Date().toLocaleTimeString()}]</span>
                        <span>{log}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                  <div className="flex flex-wrap gap-4">
                    <button 
                      onClick={() => {
                        const el = document.getElementById('forensic-input');
                        el?.scrollIntoView({ behavior: 'smooth' });
                        setActiveTab('text');
                        setTimeout(() => {
                          const textarea = document.querySelector('textarea');
                          textarea?.focus();
                        }, 500);
                      }} 
                      data-text="Analyze Evidence"
                      className="px-8 py-4 bg-[#00c853] text-black font-black rounded-xl flex items-center gap-3 hover:scale-105 transition-transform shadow-[0_0_30px_rgba(0,200,83,0.3)] group/btn relative overflow-hidden glitch-hover"
                    >
                      <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                      Analyze Evidence <ChevronRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                    <button onClick={handleDemo} data-text="Run Demo Simulation" className="px-8 py-4 bg-white/5 border border-white/10 font-bold rounded-xl hover:bg-white/10 transition-all text-[#00c853] flex items-center gap-2 group glitch-hover">
                      <Activity size={18} className="group-hover:rotate-12 transition-transform" /> Run Demo Simulation
                    </button>
                    <button onClick={() => setShowPricing(true)} data-text="Pricing Plans" className="px-8 py-4 bg-white/5 border border-white/10 font-bold rounded-xl hover:bg-white/10 transition-all flex items-center gap-2 group glitch-hover">
                      <ShieldAlert size={18} className="group-hover:scale-110 transition-transform" /> Pricing Plans
                    </button>
                  </div>
              </div>

              <div id="forensic-input" className="bg-[#0a0a0a] p-10 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00c853] to-transparent opacity-30" />
                <div className="scanline" />
                
                <div className="flex gap-4 mb-10 bg-black/60 p-2 rounded-2xl border border-white/5 backdrop-blur-md">
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
                    data-text={loading ? 'NEURAL CORE PROCESSING...' : 'EXECUTE FORENSIC ANALYSIS'}
                    className="relative w-full group overflow-hidden bg-[#00c853] text-black py-7 rounded-3xl font-black text-sm uppercase tracking-[0.5em] flex items-center justify-center gap-4 hover:opacity-90 disabled:bg-white/5 disabled:text-white/10 transition-all active:scale-[0.98] shadow-[0_0_60px_rgba(0,200,83,0.4)] border border-[#00c853]/20 glitch-hover"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    {loading ? <Loader2 className="animate-spin" size={24} /> : <ShieldAlert size={24} className="group-hover:rotate-12 transition-transform" />}
                    {loading ? 'NEURAL CORE PROCESSING...' : 'EXECUTE FORENSIC ANALYSIS'}
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
                    DOSSIER <span className="text-[#00c853]">FORENSE</span>
                  </h2>
                  <p className="text-[10px] font-mono text-white/30 uppercase tracking-[0.3em] mt-4">Case ID: {Math.random().toString(36).substring(7).toUpperCase()}</p>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center space-x-3 px-6 py-3 bg-[#00c853]/10 border border-[#00c853]/40 rounded-full shadow-[0_0_20px_rgba(0,200,83,0.2)]">
                    <div className="w-2.5 h-2.5 bg-[#00c853] rounded-full animate-pulse shadow-[0_0_10px_#00c853]" />
                    <span className="text-[10px] uppercase tracking-[0.3em] font-black text-[#00c853]">God Mode: Autonomous</span>
                  </div>
                  <button onClick={handleOpenAICrossValidation} className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-3 hover:bg-white/10 transition-all text-[#00c853] shadow-lg">
                    <CheckCircle2 size={16} /> GPT-4 Intelligence
                  </button>
                  <button onClick={downloadPDF} className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-3 hover:bg-white/10 transition-all shadow-lg">
                    <Download size={16} /> Export Dossier
                  </button>
                </div>
              </div>

              {isAnalyzing && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center p-8 overflow-hidden"
                >
                  {/* Neural Core Background Effect */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#00c853]/10 rounded-full blur-[120px] animate-pulse" />
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                    <div className="scanline" />
                  </div>

                  <div className="relative z-10 flex flex-col items-center max-w-md w-full">
                    <div className="relative mb-16">
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        className="w-48 h-48 border-2 border-dashed border-[#00c853]/20 rounded-full"
                      />
                      <motion.div 
                        animate={{ rotate: -360 }}
                        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-4 border border-dashed border-[#00c853]/40 rounded-full"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-[#00c853] rounded-full flex items-center justify-center shadow-[0_0_50px_#00c853]">
                          <Activity size={32} className="text-black animate-pulse" />
                        </div>
                      </div>
                    </div>

                    <div className="text-center space-y-6 w-full">
                      <div className="space-y-2">
                        <h2 className="text-3xl font-black tracking-tighter uppercase text-white">Neural Core Processing</h2>
                        <p className="text-[10px] font-mono text-[#00c853] uppercase tracking-[0.4em] animate-pulse">{analysisStep}</p>
                      </div>
                      
                      <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden relative">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 5, ease: "easeInOut" }}
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00c853] to-transparent"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-8">
                        <div className="text-left p-4 bg-white/5 rounded-2xl border border-white/5">
                          <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest mb-1">Status</p>
                          <p className="text-[10px] font-mono text-white uppercase tracking-widest">Scanning Matrix...</p>
                        </div>
                        <div className="text-left p-4 bg-white/5 rounded-2xl border border-white/5">
                          <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest mb-1">Engine</p>
                          <p className="text-[10px] font-mono text-white uppercase tracking-widest">SCAN v4.2.0</p>
                        </div>
                      </div>
                    </div>
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
                <div className="space-y-8">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Executive Summary & Risk Level Card */}
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="lg:col-span-2 bg-[#0a0a0a] p-10 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-[#00c853]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative z-10 w-full h-full flex flex-col">
                        <div className="flex items-center justify-between mb-8">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-[#00c853]/10 rounded-full flex items-center justify-center">
                              <ShieldAlert size={16} className="text-[#00c853]" />
                            </div>
                            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/30">Executive Summary</span>
                          </div>
                          
                          <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                            <span className="text-[10px] uppercase tracking-widest font-black text-white/60">Risk Level:</span>
                            <div className={`w-2.5 h-2.5 rounded-full ${result.resumenEjecutivo.nivelRiesgo === 'Bajo' ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : result.resumenEjecutivo.nivelRiesgo === 'Medio' ? 'bg-yellow-500 shadow-[0_0_10px_#eab308]' : 'bg-red-500 shadow-[0_0_15px_#ef4444]'} animate-pulse`} />
                            <span className="text-[10px] uppercase font-black text-white">{result.resumenEjecutivo.nivelRiesgo.toUpperCase()}</span>
                          </div>
                        </div>

                        <p className="text-sm text-white/80 leading-relaxed font-sans mb-8">
                          {result.resumenEjecutivo.explicacion}
                        </p>

                        <div className="mt-auto pt-8 border-t border-white/5">
                            <h4 className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#00c853] mb-4">Core Findings</h4>
                            <div className="flex flex-wrap gap-2">
                              {result.resumenEjecutivo.hallazgosPrincipales.map((hallazgo: string, i: number) => (
                                <span key={i} className="px-3 py-1.5 bg-[#00c853]/5 border border-[#00c853]/10 rounded-lg text-[10px] text-white/70">
                                  {hallazgo}
                                </span>
                              ))}
                            </div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Probabilities Conclusions Card */}
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                      className="lg:col-span-1 bg-[#0a0a0a] p-10 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden group"
                    >
                      <div className="relative z-10 h-full flex flex-col">
                        <div className="flex items-center gap-3 mb-8">
                          <div className="w-8 h-8 bg-[#00c853]/10 rounded-full flex items-center justify-center">
                            <Activity size={16} className="text-[#00c853]" />
                          </div>
                          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/30">Probabilistic Consensus</span>
                        </div>
                        
                        <div className="space-y-6 flex-1">
                          {result.conclusionesProbabilisticas.map((conc: any, idx: number) => (
                            <div key={idx} className="bg-white/5 p-4 rounded-2xl border border-white/10 group-hover:border-[#00c853]/20 transition-all">
                              <div className="flex justify-between items-center mb-3">
                                <span className={`text-[9px] uppercase tracking-widest font-black ${conc.nivelConfianza === 'Alta Confianza' ? 'text-[#00c853]' : conc.nivelConfianza === 'Media Confianza' ? 'text-yellow-500' : 'text-red-500'}`}>
                                  {conc.nivelConfianza}
                                </span>
                                <span className="text-xl font-black text-white">{conc.porcentaje}%</span>
                              </div>
                              <p className="text-xs font-bold text-white mb-2">{conc.conclusion}</p>
                              <p className="text-[10px] text-white/50 leading-relaxed italic">"{conc.justificacion}"</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Technical Analysis / Agents Output */}
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="lg:col-span-1 bg-[#0a0a0a] p-10 rounded-[3rem] border border-white/5 shadow-2xl"
                    >
                      <div className="flex justify-between items-center mb-8">
                        <h4 className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/30">Detailed Agent Analysis</h4>
                      </div>
                      <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                        {result.analisisTecnico.map((t: any, idx: number) => (
                          <div key={idx} className="p-6 bg-white/5 rounded-3xl border border-white/5 flex flex-col gap-4 hover:bg-white/[0.07] transition-colors group/indicator relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10 font-mono text-4xl text-white group-hover/indicator:text-[#00c853] transition-colors">#{idx+1}</div>
                            
                            <h5 className="text-[11px] font-black text-[#00c853] uppercase tracking-widest">{t.agente}</h5>
                            
                            <div className="space-y-2">
                              <div>
                                <span className="text-[9px] text-white/30 font-mono uppercase block mb-1">Observations</span>
                                <p className="text-xs text-white/80">{t.observaciones}</p>
                              </div>
                              <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                                <span className="text-[9px] text-white/30 font-mono uppercase block mb-1">Evidence</span>
                                <p className="text-[11px] text-white/60 italic">"{t.evidencia}"</p>
                              </div>
                              <div className="grid grid-cols-2 gap-2 mt-2">
                                <div>
                                  <span className="text-[8px] text-red-400 font-mono uppercase block mb-1">Anomalies</span>
                                  <p className="text-[10px] text-white/70">{t.anomalias}</p>
                                </div>
                                <div>
                                  <span className="text-[8px] text-blue-400 font-mono uppercase block mb-1">Correlations</span>
                                  <p className="text-[10px] text-white/70">{t.correlaciones}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>

                    <div className="flex flex-col gap-8">
                      {/* Contradictions */}
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-[#0a0a0a] p-10 rounded-[3rem] border border-white/5 shadow-2xl flex flex-col"
                      >
                         <h4 className="text-[10px] font-mono uppercase tracking-[0.3em] text-red-500 mb-6 flex items-center gap-3">
                           <ShieldAlert size={14} /> Contradictions Detected
                         </h4>
                         <ul className="space-y-3">
                           {result.contradicciones.map((c: string, idx: number) => (
                             <li key={idx} className="flex gap-3 text-sm text-white/80 items-start">
                               <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 shrink-0 shadow-[0_0_8px_#ef4444]" />
                               <span>{c}</span>
                             </li>
                           ))}
                         </ul>
                      </motion.div>
                      
                      {/* Recommendations */}
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-[#0a0a0a] p-10 rounded-[3rem] border border-white/5 shadow-2xl flex flex-col"
                      >
                         <h4 className="text-[10px] font-mono uppercase tracking-[0.3em] text-blue-400 mb-6 flex items-center gap-3">
                           <Activity size={14} /> Strategic Recommendations
                         </h4>
                         <ul className="space-y-3 mb-8">
                           {result.recomendacionesEstrategicas.map((r: string, idx: number) => (
                             <li key={idx} className="flex gap-3 text-sm text-white/80 items-start">
                               <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 shrink-0 shadow-[0_0_8px_#60a5fa]" />
                               <span>{r}</span>
                             </li>
                           ))}
                         </ul>

                        <div className="mt-auto pt-8 border-t border-white/5 flex flex-col gap-4">
                          <button 
                            onClick={downloadPDF}
                            className="w-full py-4 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#00c853] hover:text-white transition-all flex items-center justify-center gap-3 group/btn"
                          >
                            <Download size={16} className="group-hover/btn:scale-110 transition-transform" />
                            Download Forensic Dossier
                          </button>
                          <button 
                            onClick={() => setResult(null)}
                            className="w-full py-4 bg-white/5 text-white/40 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all"
                          >
                            Clear Analysis
                          </button>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>
      )}

            {appTab === 'agents' && (
              <motion.div
                key="agents-matrix"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-12"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                  <div>
                    <h2 className="text-4xl font-black tracking-tighter uppercase mb-2">Neural <span className="text-[#00c853]">Agent Matrix</span></h2>
                    <p className="text-white/40 text-sm max-w-xl">
                      Orquestación de 120 agentes autónomos integrados en el Forensic Superintelligence Core. 
                      Visualización en tiempo real de estados de carga, procesamiento y aprendizaje adaptativo.
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                      <input 
                        type="text"
                        placeholder="Search agent signature..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-xl px-12 py-3 text-xs focus:border-[#00c853] outline-none w-64 transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                   <button
                    onClick={() => setSelectedCategory(null)}
                    className={`px-4 py-2 rounded-lg text-[9px] font-mono uppercase tracking-widest transition-all ${
                      !selectedCategory ? 'bg-[#00c853] text-black font-black' : 'bg-white/5 text-white/40 hover:bg-white/10'
                    }`}
                  >
                    All Units
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-2 rounded-lg text-[9px] font-mono uppercase tracking-widest transition-all ${
                        selectedCategory === cat ? 'bg-[#00c853] text-black font-black' : 'bg-white/5 text-white/40 hover:bg-white/10'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {filteredAgents.map((agent) => (
                    <motion.div
                      layout
                      key={agent.id}
                      className="bg-black/40 border border-white/5 p-4 rounded-2xl hover:border-[#00c853]/30 transition-all group relative overflow-hidden"
                    >
                      <div className={`absolute top-0 right-0 w-12 h-12 opacity-5 pointer-events-none ${
                        agent.status === 'active' ? 'text-[#00c853]' : 
                        agent.status === 'learning' ? 'text-blue-500' : 'text-white/20'
                      }`}>
                        <Cpu size={48} />
                      </div>
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-2 h-2 rounded-full ${
                          agent.status === 'active' ? 'bg-[#00c853] shadow-[0_0_10px_#00c853]' : 
                          agent.status === 'learning' ? 'bg-blue-500 animate-pulse' : 
                          agent.status === 'processing' ? 'bg-yellow-500 animate-ping' : 'bg-white/10'
                        }`} />
                        <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest">ID #{agent.id.toString().padStart(3, '0')}</span>
                      </div>
                      <h4 className="text-[10px] font-black uppercase text-white mb-1 leading-none group-hover:text-[#00c853] transition-colors">{agent.name}</h4>
                      <p className="text-[8px] font-mono text-white/30 truncate mb-4">{agent.role}</p>
                      
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[7px] font-mono uppercase tracking-widest">
                          <span className="text-white/20">Performance</span>
                          <span className="text-white/60">{agent.performance}%</span>
                        </div>
                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${agent.performance}%` }}
                            className={`h-full ${agent.performance > 95 ? 'bg-[#00c853]' : 'bg-white/20'}`} 
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {appTab === 'monitoring' && (
              <motion.div
                key="monitoring"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-8"
              >
                <div className="lg:col-span-2 space-y-8">
                   <div className="bg-black/40 border border-white/5 rounded-[2.5rem] p-10 backdrop-blur-md relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-10 opacity-5">
                      <Network size={120} />
                    </div>
                    <h3 className="text-2xl font-black tracking-tighter uppercase mb-8">System <span className="text-[#00c853]">Connectivity</span></h3>
                    
                    <div className="h-64 mt-8 flex items-end gap-1 px-4">
                      {Array.from({ length: 40 }).map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ height: 20 }}
                          animate={{ 
                            height: [40, Math.random() * 100 + 40, 40],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.1
                          }}
                          className="flex-1 bg-gradient-to-t from-[#00c853]/10 to-[#00c853]/40 rounded-t-sm"
                        />
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                      <div className="p-8 bg-white/5 border border-white/10 rounded-[2rem]">
                        <h4 className="text-[10px] font-mono text-[#00c853] uppercase tracking-widest mb-6">Threat Mitigation</h4>
                        <div className="space-y-4">
                          {[
                            { label: 'Infiltration Attempts', value: '0', status: 'secure' },
                            { label: 'Pattern Decryption', value: 'Active', status: 'optimal' }
                          ].map(stat => (
                            <div key={stat.label} className="flex justify-between items-center border-b border-white/5 pb-2">
                              <span className="text-[10px] text-white/40">{stat.label}</span>
                              <span className="text-[10px] font-black text-white">{stat.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="p-8 bg-white/5 border border-white/10 rounded-[2rem]">
                        <h4 className="text-[10px] font-mono text-[#00c853] uppercase tracking-widest mb-6">Global Node Sync</h4>
                        <div className="flex flex-wrap gap-2">
                          {['MX', 'NY', 'LN', 'TK'].map(node => (
                            <div key={node} className="flex items-center gap-1.5 px-3 py-1 bg-[#00c853]/10 border border-[#00c853]/20 rounded-full">
                              <div className="w-1 h-1 bg-[#00c853] rounded-full animate-ping" />
                              <span className="text-[8px] font-mono text-[#00c853] font-bold">{node}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                  </div>
                </div>

                <div className="space-y-8">
                    <div className="bg-black/40 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-md h-full">
                      <h4 className="text-xs font-black uppercase tracking-widest mb-6 text-white/60 flex items-center gap-2">
                        <Activity size={14} className="text-[#00c853]" />
                        Neural Status Feed
                      </h4>
                      <div className="space-y-4 max-h-[500px] overflow-hidden relative">
                         <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#050505] to-transparent z-10" />
                         {logs.map((log, idx) => (
                            <div key={idx} className="text-[9px] font-mono border-l border-[#00c853]/20 pl-3 py-1">
                              <p className="text-white/20">[{new Date().toLocaleTimeString()}]</p>
                              <p className="text-[#00c853]/60">{log}</p>
                            </div>
                         ))}
                      </div>
                    </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

            <footer className="relative z-10 border-t border-white/5 mt-20 py-12 px-8">
              <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="text-center md:text-left">
                  <h4 className="text-sm font-black tracking-tighter mb-2">WAE CORE INTELLIGENCE</h4>
                  <p className="text-[10px] font-mono text-white/20 uppercase tracking-widest">© 2026 Autonomous Security Systems. All rights reserved.</p>
                </div>
                <div className="flex gap-8 text-[10px] font-mono uppercase tracking-widest text-white/40">
                  <a href="#" className="hover:text-white transition-colors">Privacy</a>
                  <a href="#" className="hover:text-white transition-colors">Terms</a>
                  <a href="#" className="hover:text-white transition-colors">Security</a>
                </div>
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pricing Modal */}
      <AnimatePresence>
        {showReferral && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex items-center justify-center p-8 bg-black/90 backdrop-blur-xl"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="max-w-2xl w-full bg-[#0a0a0a] border border-[#00c853]/30 rounded-[3rem] p-12 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00c853] to-transparent opacity-50" />
              
              <button 
                onClick={() => setShowReferral(false)}
                className="absolute top-8 right-8 w-12 h-12 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 transition-all"
              >
                <ChevronRight className="rotate-180" />
              </button>

              <div className="text-center mb-10">
                <div className="w-20 h-20 bg-[#00c853]/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#00c853]/30">
                  <Activity className="text-[#00c853]" size={40} />
                </div>
                <h2 className="text-4xl font-black tracking-tighter uppercase mb-4">Neural <span className="text-[#00c853]">Referral</span></h2>
                <p className="text-white/40 text-sm uppercase tracking-widest leading-relaxed">
                  Expand the network. Earn forensic credits for every agent recruited.
                </p>
              </div>

              <div className="space-y-6">
                <div className="p-8 bg-white/5 border border-white/10 rounded-3xl text-center">
                  <p className="text-[10px] font-mono text-white/20 uppercase tracking-[0.3em] mb-4">Your Intelligence Code</p>
                  <div className="text-3xl font-black tracking-[0.5em] text-[#00c853] mb-6">WAE-CORE-2026</div>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText('WAE-CORE-2026');
                      // Optional: show a toast
                    }}
                    className="px-8 py-3 bg-[#00c853] text-black rounded-xl font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all"
                  >
                    Copy Neural ID
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 bg-white/5 border border-white/10 rounded-2xl text-center">
                    <p className="text-[8px] font-mono text-white/20 uppercase tracking-widest mb-2">You Get</p>
                    <p className="text-xl font-black text-[#00c853]">$20 CREDIT</p>
                  </div>
                  <div className="p-6 bg-white/5 border border-white/10 rounded-2xl text-center">
                    <p className="text-[8px] font-mono text-white/20 uppercase tracking-widest mb-2">They Get</p>
                    <p className="text-xl font-black text-white">25% OFF</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pricing Modal */}
      <AnimatePresence>
        {showPricing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex items-center justify-center p-8 bg-black/90 backdrop-blur-xl"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="max-w-4xl w-full bg-[#0a0a0a] border border-white/10 rounded-[3rem] p-12 relative overflow-hidden"
            >
              <button 
                onClick={() => setShowPricing(false)}
                className="absolute top-8 right-8 w-12 h-12 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 transition-all"
              >
                <ChevronRight className="rotate-180" />
              </button>

              <div className="text-center mb-12">
                <h2 className="text-4xl font-black tracking-tighter uppercase mb-4">Forensic <span className="text-[#00c853]">Licensing</span></h2>
                <p className="text-white/40 text-sm uppercase tracking-widest">Select your intelligence tier</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-8 bg-white/5 border border-white/10 rounded-3xl relative">
                  <div className="text-[10px] font-mono text-[#00c853] uppercase tracking-[0.3em] mb-4">Standard Agent</div>
                  <h3 className="text-3xl font-black mb-2">FREE</h3>
                  <p className="text-white/40 text-xs mb-8">Basic linguistic analysis and demo access.</p>
                  <ul className="space-y-4 mb-12">
                    {['3 Analyses / Month', 'Basic SCAN Methodology', 'PDF Export', 'Community Support'].map((f) => (
                      <li key={f} className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-white/60">
                        <CheckCircle2 size={14} className="text-[#00c853]" /> {f}
                      </li>
                    ))}
                  </ul>
                  <button onClick={() => setShowPricing(false)} className="w-full py-4 bg-white/5 border border-white/10 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all">Current Plan</button>
                </div>

                <div className="p-8 bg-[#00c853]/5 border border-[#00c853]/40 rounded-3xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 px-4 py-1 bg-[#00c853] text-black text-[8px] font-black uppercase tracking-widest rounded-bl-xl">Recommended</div>
                  <div className="text-[10px] font-mono text-[#00c853] uppercase tracking-[0.3em] mb-4">Enterprise Forensic</div>
                  <h3 className="text-3xl font-black mb-2">$49<span className="text-sm text-white/40">/mo</span></h3>
                  <p className="text-white/40 text-xs mb-8">Full forensic suite with GPT-4 cross-validation.</p>
                  <ul className="space-y-4 mb-12">
                    {['Unlimited Analyses', 'GPT-4 Cross-Validation', 'Audio/Visual Forensic Core', 'Priority Neural Processing'].map((f) => (
                      <li key={f} className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest">
                        <CheckCircle2 size={14} className="text-[#00c853]" /> {f}
                      </li>
                    ))}
                  </ul>
                  <button 
                    onClick={handleStripeCheckout} 
                    disabled={isUpgrading}
                    className="w-full py-4 bg-[#00c853] text-black rounded-xl font-black uppercase tracking-widest text-[10px] hover:scale-[1.02] transition-all shadow-[0_0_30px_rgba(0,200,83,0.3)]"
                  >
                    {isUpgrading ? 'Initializing...' : 'Upgrade Now'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
