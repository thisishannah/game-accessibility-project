/**
 * 결과 페이지용 Gemini 브라우저 SDK (Vite 빌드 시 NEXT_PUBLIC_GEMINI_API_KEY 주입)
 */
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

const DEFAULT_GEMINI_MODEL = "gemini-1.5-flash";

/**
 * SDK는 model 필드에 id만 기대합니다. "models/..." 접두사가 붙으면 404가 날 수 있습니다.
 * @param {string} [name]
 * @returns {string}
 */
function normalizeGeminiModelName(name) {
  const raw = typeof name === "string" ? name.trim() : "";
  if (!raw) {
    return DEFAULT_GEMINI_MODEL;
  }
  const id = raw.replace(/^models\/+/i, "").trim();
  return id || DEFAULT_GEMINI_MODEL;
}

/**
 * gemini-1.5-flash 등은 Generative Language API v1 엔드포인트에 항상 없을 수 있어,
 * SDK 기본(최신 안정)이 v1을 쓰는 환경에서는 404가 납니다. v1beta를 명시합니다.
 * @see RequestOptions.apiVersion in @google/generative-ai
 */
const GEMINI_REQUEST_OPTIONS = { apiVersion: "v1beta" };

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
    model: normalizeGeminiModelName(modelName),
    generationConfig: { temperature: 0.35, maxOutputTokens: 8192 }
  };
  if (SiText) {
    modelOpts.systemInstruction = SiText;
  }
  const model = genAI.getGenerativeModel(modelOpts, GEMINI_REQUEST_OPTIONS);
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
