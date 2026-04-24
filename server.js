/**
 * 로컬 정적 서버 + Gemini 프록시 (.env의 GEMINI_API_KEY 사용, 브라우저에 키 노출 방지)
 * 실행: npm start → http://localhost:8080/summary.html
 */
require("dotenv").config();
const path = require("path");
const express = require("express");

const app = express();
const PORT = Number(process.env.PORT) || 8080;
const MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash";

app.use(express.json({ limit: "2mb" }));
app.use(express.static(path.join(__dirname)));

app.post("/api/gemini", async function (req, res) {
  const apiKey =
    process.env.GEMINI_API_KEY ||
    process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
    "";
  if (!apiKey || !String(apiKey).trim()) {
    return res.status(500).json({
      error:
        "서버 .env에 GEMINI_API_KEY(또는 NEXT_PUBLIC_GEMINI_API_KEY)가 없습니다."
    });
  }
  const prompt = req.body && req.body.prompt;
  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ error: "prompt(문자열)가 필요합니다." });
  }
  const model = (req.body && req.body.model) || MODEL;
  const url =
    "https://generativelanguage.googleapis.com/v1beta/models/" +
    encodeURIComponent(model) +
    ":generateContent?key=" +
    encodeURIComponent(apiKey);

  try {
    const gRes = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.35, maxOutputTokens: 8192 }
      })
    });
    const data = await gRes.json().catch(function () {
      return {};
    });
    if (!gRes.ok) {
      const msg = (data.error && data.error.message) || gRes.status + " " + gRes.statusText;
      return res.status(502).json({ error: msg || "Gemini API 오류" });
    }
    const parts = data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts;
    const text = parts ? parts.map(function (p) { return p.text || ""; }).join("") : "";
    if (!text.trim()) {
      return res.status(502).json({ error: "Gemini 응답에 본문이 없습니다." });
    }
    return res.json({ text: text, model: model });
  } catch (e) {
    return res.status(500).json({ error: e.message || String(e) });
  }
});

app.listen(PORT, function () {
  console.log("Smile Play Ally — 로컬 서버: http://localhost:" + PORT);
  console.log("예: http://localhost:" + PORT + "/summary.html");
});
