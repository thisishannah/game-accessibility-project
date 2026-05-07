/**
 * 결과 페이지용 Gemini 브라우저 SDK (IIFE 빌드)
 *
 * 주의: getGenerativeModel 옵션에 systemInstruction 절대 넣지 않음(400 방지).
 * 지침은 finalPrompt 문자열 앞부분에만 합침.
 *
 * API 키는 빌드/런타임 환경 변수에 두지 않고, 호출 시 인자로만 전달합니다.
 */
import { GoogleGenerativeAI } from "@google/generative-ai";

/** 프로젝트 기본 모델 id(접두사 없이; 앞의 models/는 사용 시 제거). */
const GEMINI_MODEL_ID = "gemini-2.5-flash";

/** REST용 model 파라미터는 id만 허용. models/ 로 시작하면 제거. */
function stripModelsModelPrefix(name) {
  return String(name == null ? "" : name)
    .trim()
    .replace(/^models\/+/i, "")
    .trim();
}

/**
 * GA 안정 경로: Generative Language API v1.
 * @see RequestOptions.apiVersion in @google/generative-ai ("v1" | "v1beta")
 */
const GEMINI_REQUEST_OPTIONS = { apiVersion: "v1" };

/**
 * @param {string} apiKey — Google AI Studio / Gemini API 키(호출부에서만 전달)
 * @param {string} promptText — 실제 분석 질문·데이터 본문
 * @param {string} [modelName] — 호출부 모델명(선택). 비면 GEMINI_MODEL_ID. models/ 접두사는 제거.
 * @param {string} [instructionPlainText] — instructions.txt 등 일반 문자열
 * @returns {Promise<string>}
 */
async function summaryGeminiGenerate(apiKey, promptText, modelName, instructionPlainText) {
  const key = typeof apiKey === "string" ? apiKey.trim() : "";
  if (!key) {
    throw new Error("Gemini API 키가 비어 있습니다. 분석 전에 API 키를 입력해 주세요.");
  }
  const genAI = new GoogleGenerativeAI(key);
  const instructionText =
    typeof instructionPlainText === "string" ? instructionPlainText.trim() : "";
  const questionBody = promptText != null ? String(promptText) : "";

  const finalPrompt = instructionText
    ? "[Instruction]\n" + instructionText + "\n\n" + questionBody
    : questionBody;

  const resolvedModel =
    stripModelsModelPrefix(modelName) ||
    stripModelsModelPrefix(GEMINI_MODEL_ID) ||
    GEMINI_MODEL_ID;

  const modelOpts = {
    model: resolvedModel,
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

/**
 * AI 요약(접근성 분석)용 사용자 프롬프트 본문 조립.
 * @param {object} combined — { participantData, observerComment?, observerReportForm?, outputFormatMarkdown? }
 */
function buildAccessibilitySummaryUserPrompt(combined) {
  const c = combined && typeof combined === "object" ? combined : {};
  const participantData = c.participantData != null ? c.participantData : {};
  const observerComment =
    c.observerComment != null && String(c.observerComment).trim().length > 0
      ? String(c.observerComment).trim()
      : "";
  const observerForm =
    c.observerReportForm && typeof c.observerReportForm === "object" ? c.observerReportForm : {};
  const outputFmt =
    typeof c.outputFormatMarkdown === "string" && c.outputFormatMarkdown.trim().length > 0
      ? c.outputFormatMarkdown.trim()
      : "";

  let testJsonBlock;
  try {
    testJsonBlock = JSON.stringify(participantData, null, 2);
  } catch (e) {
    testJsonBlock = '{"error":"participantData JSON 직렬화 실패"}';
  }

  let observerFormBlock;
  try {
    observerFormBlock = JSON.stringify(observerForm, null, 2);
  } catch (e2) {
    observerFormBlock = "{}";
  }

  let observerSection;
  if (observerComment) {
    observerSection =
      "### [관찰자 현장 코멘트 — 최우선 반영]\n" +
      "아래는 요약 화면에서 관찰자가 **직접 입력·저장한** 현장 소견입니다. 설문 수치만으로는 드러나지 않는 맥락(보조기기, 피로, 조명, 정서, 과제 이해, 실수 패턴 등)이 포함될 수 있습니다.\n\n" +
      "---\n" +
      observerComment +
      "\n---\n\n" +
      "**분석 지시 (필수):**\n" +
      "- 아래 세 개의 출력 섹션 전부에서 이 코멘트를 **측정 JSON과 동등 이상의 가중치**로 통합하세요.\n" +
      "- 수치와 코멘트가 충돌해 보이면 **코멘트의 현장 설명을 우선** 채택하고, 수치는 그에 맞게 재해석·한계를 밝히세요.\n" +
      "- 코멘트에만 등장하는 요인은 섹션 2·3에 **반드시 구체 시나리오·권장안**으로 명시하세요.\n\n";
  } else {
    observerSection =
      "### [관찰자 현장 코멘트]\n" +
      "(비어 있음. participantData와 구조화된 관찰자 리포트 폼만 사용하세요.)\n\n";
  }

  const intro =
    "너는 세계 최고의 게임 접근성 컨설턴트야. 'Smile Play Ally' 프로젝트의 데이터를 분석해야 해.\n\n" +
    "## 입력 데이터\n\n" +
    "### [참여자 측정·프로필 통합 객체 (participantData)]\n" +
    "참여자 JSON 불러오기·세션에 저장된 **측정값·user_data·프로필**입니다.\n\n" +
    testJsonBlock +
    "\n\n" +
    observerSection +
    "### [관찰자 리포트 구조화 필드 (전용 양식·AT~AV 계열)]\n" +
    observerFormBlock +
    "\n\n### [참고]\n" +
    "현장 코멘트 블록이 있으면 해석과 권고의 **주요 근거**로 삼고, 구조화 필드는 보조 맥락으로 결합하세요.\n\n";

  return intro + (outputFmt ? outputFmt : "");
}

/**
 * 참여자 데이터 + 관찰자 코멘트 등 **하나의 객체**로 AI 분석을 요청합니다.
 * @param {string} apiKey
 * @param {object} combinedPayload — buildAccessibilitySummaryUserPrompt 에 넘길 객체
 * @param {string} [modelName]
 * @param {string} [instructionPlainText]
 * @returns {Promise<string>}
 */
async function generateSummary(apiKey, combinedPayload, modelName, instructionPlainText) {
  const promptText = buildAccessibilitySummaryUserPrompt(combinedPayload);
  return summaryGeminiGenerate(apiKey, promptText, modelName, instructionPlainText);
}

if (typeof window !== "undefined") {
  window.__summaryGeminiGenerate = summaryGeminiGenerate;
  window.generateSummary = generateSummary;
  window.buildAccessibilitySummaryUserPrompt = buildAccessibilitySummaryUserPrompt;
}
