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
    Actúa como un perito forense experto en Lingüística, Psicología Cognitiva y Criminalística.
    Analiza la evidencia proporcionada (archivos y texto) para detectar manipulación, gaslighting, contradicciones y presión psicológica.
    
    Aplica rigurosamente la metodología de los 30 indicadores forenses.
    Calcula el "Triángulo de Mentira Textual" (Hecho, Tiempo, Emoción) y aplica la fórmula de puntuación forense.
    
    Proporciona un resultado en formato JSON estricto con la siguiente estructura:
    {
      "credibilityScore": number (0-100),
      "riskLevel": "bajo" | "medio" | "alto" | "crítico",
      "summary": "Resumen técnico pericial",
      "triangleScores": { "fact": number, "time": number, "emotion": number },
      "indicators": [{ "category": "string", "severity": number (1-5), "evidence": "string" }],
      "heatmap": [{ "category": "string", "value": number (0-100) }]
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
