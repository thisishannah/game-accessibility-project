/**
 * 로컬 정적 서버 (결과 페이지 등)
 * 실행: npm run build:summary-gemini 후 npm start → http://localhost:8080/summary.html
 */
require("dotenv").config();
const path = require("path");
const express = require("express");

const app = express();
const PORT = Number(process.env.PORT) || 8080;

app.use(express.json({ limit: "2mb" }));
app.use(express.static(path.join(__dirname)));

app.listen(PORT, function () {
  console.log("Smile Play Ally — 로컬 서버: http://localhost:" + PORT);
  console.log("예: http://localhost:" + PORT + "/summary.html");
  console.log("AI 분석: summary.html 전문가 영역에서 Gemini API 키를 입력한 뒤 실행합니다.");
});
