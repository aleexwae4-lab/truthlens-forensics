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
  credibilityScore: number;
  riskLevel: 'bajo' | 'medio' | 'alto' | 'crítico';
  summary: string;
  triangleScores: {
    fact: number;
    time: number;
    emotion: number;
  };
  indicators: {
    category: string;
    severity: number;
    evidence: string;
  }[];
  heatmap: {
    category: string;
    value: number;
  }[];
}

export async function analyzeEvidence(files: File[], textInput: string): Promise<AnalysisResult> {
  const prompt = `
    Actúa como un Perito Forense experto en SCAN (Scientific Content Analysis) y Psicología Cognitiva.
    Analiza la evidencia buscando indicadores de engaño, manipulación, gaslighting y carga cognitiva.
    
    CRITERIOS DE ANÁLISIS:
    1. Distanciamiento lingüístico (uso de pronombres, pasividad).
    2. Cambios de tiempo verbal (del pasado al presente al mentir).
    3. Omisión de detalles críticos vs. exceso de detalles irrelevantes.
    4. Indicadores de manipulación emocional y victimización.
    5. Inconsistencias cronológicas y espaciales.

    Proporciona un resultado en formato JSON estricto con la siguiente estructura:
    {
      "credibilityScore": number (0-100),
      "riskLevel": "bajo" | "medio" | "alto" | "crítico",
      "summary": "Resumen técnico pericial detallado",
      "triangleScores": { "fact": number, "time": number, "emotion": number },
      "indicators": [{ "category": "string", "severity": number (1-5), "evidence": "string" }],
      "heatmap": [
        { "category": "Veracidad", "value": number },
        { "category": "Manipulación", "value": number },
        { "category": "Estrés", "value": number }
      ]
    }
  `;

  const contents: any[] = [{ text: prompt }];

  if (textInput) {
    contents.push({ text: `Texto adicional: ${textInput}` });
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
