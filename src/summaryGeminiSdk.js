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
 * GA 안정 경로: Generative Language API v1.
 * @see RequestOptions.apiVersion in @google/generative-ai ("v1" | "v1beta")
 */
const GEMINI_REQUEST_OPTIONS = { apiVersion: "v1" };

/**
 * @param {string} promptText — 분석할 데이터(텍스트 또는 이미 직렬화된 본문)
 * @param {string} [modelName]
 * @param {string} [projectInstructions] — instructions.txt 등 (맨 앞에 붙임, systemInstruction 미사용)
 * @returns {Promise<string>}
 */
async function summaryGeminiGenerate(promptText, modelName, projectInstructions) {
  const key = typeof API_KEY === "string" ? API_KEY.trim() : "";
  if (!key) {
    throw new Error(
      "NEXT_PUBLIC_GEMINI_API_KEY가 비어 있습니다. .env에 설정한 뒤 프로젝트 루트에서 npm run build:summary-gemini 를 실행하세요."
    );
  }
  const genAI = new GoogleGenerativeAI(key);
  const instr = typeof projectInstructions === "string" ? projectInstructions.trim() : "";
  const dataPart = promptText != null ? String(promptText) : "";
  const fullPrompt = instr
    ? instr + "\n\n[분석할 데이터]:\n" + dataPart
    : dataPart;
  const modelOpts = {
    // id는 정확히 gemini-1.5-flash(기본). "models/..." 입력은 normalize에서 제거.
    model: normalizeGeminiModelName(modelName),
    generationConfig: { temperature: 0.35, maxOutputTokens: 8192 }
  };
  const model = genAI.getGenerativeModel(modelOpts, GEMINI_REQUEST_OPTIONS);
  const result = await model.generateContent(fullPrompt);
  const text = result.response.text();
  if (!text || !String(text).trim()) {
    throw new Error("Gemini 응답에 본문이 없습니다.");
  }
  return String(text);
}

if (typeof window !== "undefined") {
  window.__summaryGeminiGenerate = summaryGeminiGenerate;
}
