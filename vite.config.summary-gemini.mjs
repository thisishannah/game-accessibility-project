import { defineConfig, loadEnv } from "vite";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const key = env.NEXT_PUBLIC_GEMINI_API_KEY || env.GEMINI_API_KEY || "";
  return {
    define: {
      "process.env.NEXT_PUBLIC_GEMINI_API_KEY": JSON.stringify(key)
    },
    build: {
      lib: {
        entry: resolve(__dirname, "src/summaryGeminiSdk.js"),
        name: "SummaryGeminiSdk",
        fileName: () => "summary-gemini-sdk-final",
        formats: ["iife"]
      },
      outDir: resolve(__dirname, "dist"),
      emptyOutDir: false,
      rollupOptions: {
        output: {
          entryFileNames: "summary-gemini-sdk-final.js",
          extend: true
        }
      }
    }
  };
});
