import { GoogleGenAI } from "@google/genai";

let ai: GoogleGenAI | null = null;

const getAI = () => {
  if (!ai) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured. Please set it in your environment variables.");
    }
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
};

export interface AnalysisResult {
  resumenEjecutivo: {
    explicacion: string;
    nivelRiesgo: 'Bajo' | 'Medio' | 'Alto' | 'Crítico';
    hallazgosPrincipales: string[];
  };
  analisisTecnico: {
    agente: string;
    observaciones: string;
    evidencia: string;
    anomalias: string;
    correlaciones: string;
  }[];
  contradicciones: string[];
  conclusionesProbabilisticas: {
    nivelConfianza: 'Alta Confianza' | 'Media Confianza' | 'Baja Confianza';
    porcentaje: number;
    conclusion: string;
    justificacion: string;
  }[];
  recomendacionesEstrategicas: string[];
}

export async function analyzeEvidence(files: File[], textInput: string): Promise<AnalysisResult> {
  const prompt = `
    OPERA COMO UN CONSEJO CORPORATIVO DE INTELIGENCIA FORENSE compuesto por especialistas de máximo nivel.
    Cada agente especializado (documental, lingüístico, cronológico, visual, OSINT) debe analizar profundamente la evidencia aportada, debatir internamente, validar evidencia cruzada y producir un informe extremadamente robusto, técnico, estratégico y profesional.
    El objetivo es superar el estándar común de análisis y entregar resultados dignos de un laboratorio de inteligencia avanzada.

    Debes proporcionar SIEMPRE el resultado en STRICT JSON con esta estructura exacta y en lenguaje técnico/corporativo:
    {
      "resumenEjecutivo": {
        "explicacion": "string detallado (análisis global)",
        "nivelRiesgo": "Bajo" | "Medio" | "Alto" | "Crítico",
        "hallazgosPrincipales": ["string", "string"]
      },
      "analisisTecnico": [ // Mínimo 5 agentes (Agente Documental, Agente Lingüístico, etc.)
        {
          "agente": "Ej. Agente Lingüístico",
          "observaciones": "string",
          "evidencia": "string",
          "anomalias": "string",
          "correlaciones": "string"
        }
      ],
      "contradicciones": ["inconsistencia 1", "vacío 2", "anomalía 3"],
      "conclusionesProbabilisticas": [
        {
          "nivelConfianza": "Alta Confianza" | "Media Confianza" | "Baja Confianza",
          "porcentaje": number, // Ej: 92
          "conclusion": "string",
          "justificacion": "string"
        }
      ],
      "recomendacionesEstrategicas": ["recomendacion 1", "recomendacion 2"]
    }
  `;

  const contents: any[] = [{ text: prompt }];

  if (textInput) {
    contents.push({ text: `EVIDENCIA A ANALIZAR (TEXTO/CONTEXTO):\n${textInput}` });
  }

  for (const file of files) {
    const base64Data = await fileToBase64(file);
    contents.push({
      inlineData: {
        mimeType: file.type,
        data: base64Data,
      },
    });
  }

  const aiInstance = getAI();
  const response = await aiInstance.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: { parts: contents },
    config: {
      responseMimeType: "application/json",
    },
  });

  return JSON.parse(response.text || "{}");
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = error => reject(error);
  });
}
