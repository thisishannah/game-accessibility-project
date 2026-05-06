/**
 * 결과 페이지용 Gemini 브라우저 SDK (Vite 빌드 시 NEXT_PUBLIC_GEMINI_API_KEY 주입)
 *
 * 주의: getGenerativeModel 옵션에 systemInstruction 절대 넣지 않음(400 방지).
 * 지침은 finalPrompt 문자열 앞부분에만 합침.
 */
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

/** 프로젝트 고정 모델 id(접두사 없이). */
const GEMINI_MODEL_ID = "gemini-1.5-flash";

/**
 * GA 안정 경로: Generative Language API v1.
 * @see RequestOptions.apiVersion in @google/generative-ai ("v1" | "v1beta")
 */
const GEMINI_REQUEST_OPTIONS = { apiVersion: "v1" };

/**
 * @param {string} promptText — 실제 분석 질문·데이터 본문
 * @param {string} [_ignoredModelName] — 호환용(무시). 모델은 항상 gemini-1.5-flash.
 * @param {string} [instructionPlainText] — instructions.txt 등 일반 문자열
 * @returns {Promise<string>}
 */
async function summaryGeminiGenerate(promptText, _ignoredModelName, instructionPlainText) {
  const key = typeof API_KEY === "string" ? API_KEY.trim() : "";
  if (!key) {
    throw new Error(
      "NEXT_PUBLIC_GEMINI_API_KEY가 비어 있습니다. .env에 설정한 뒤 프로젝트 루트에서 npm run build:summary-gemini 를 실행하세요."
    );
  }
  const genAI = new GoogleGenerativeAI(key);
  const instructionText =
    typeof instructionPlainText === "string" ? instructionPlainText.trim() : "";
  const questionBody = promptText != null ? String(promptText) : "";

  const finalPrompt = instructionText
    ? "[Instruction]\n" + instructionText + "\n\n" + questionBody
    : questionBody;

  const modelOpts = {
    model: GEMINI_MODEL_ID,
    generationConfig: { temperature: 0.35, maxOutputTokens: 8192 }
  };
  const model = genAI.getGenerativeModel(modelOpts, GEMINI_REQUEST_OPTIONS);
  const result = await model.generateContent(finalPrompt);
  const text = result.response.text();
  if (!text || !String(text).trim()) {
    throw new Error("Gemini 응답에 본문이 없습니다.");
  }
  return String(text);
}

if (typeof window !== "undefined") {
  window.__summaryGeminiGenerate = summaryGeminiGenerate;
}
