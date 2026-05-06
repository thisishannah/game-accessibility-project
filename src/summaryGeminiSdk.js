/**
 * 결과 페이지용 Gemini 브라우저 SDK (Vite 빌드 시 NEXT_PUBLIC_GEMINI_API_KEY 주입)
 */
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

/**
 * @param {string} promptText
 * @param {string} [modelName]
 * @param {string} [systemInstruction] — 프로젝트 instructions.txt 등 시스템 지시문
 * @returns {Promise<string>}
 */
async function summaryGeminiGenerate(promptText, modelName, systemInstruction) {
  const key = typeof API_KEY === "string" ? API_KEY.trim() : "";
  if (!key) {
    throw new Error(
      "NEXT_PUBLIC_GEMINI_API_KEY가 비어 있습니다. .env에 설정한 뒤 프로젝트 루트에서 npm run build:summary-gemini 를 실행하세요."
    );
  }
  const genAI = new GoogleGenerativeAI(key);
  const SiText = typeof systemInstruction === "string" ? systemInstruction.trim() : "";
  const modelOpts = {
    model: modelName || "gemini-1.5-flash",
    generationConfig: { temperature: 0.35, maxOutputTokens: 8192 }
  };
  if (SiText) {
    modelOpts.systemInstruction = SiText;
  }
  const model = genAI.getGenerativeModel(modelOpts);
  const result = await model.generateContent(promptText);
  const text = result.response.text();
  if (!text || !String(text).trim()) {
    throw new Error("Gemini 응답에 본문이 없습니다.");
  }
  return String(text);
}

if (typeof window !== "undefined") {
  window.__summaryGeminiGenerate = summaryGeminiGenerate;
}
