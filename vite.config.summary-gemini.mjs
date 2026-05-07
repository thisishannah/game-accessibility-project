import { defineConfig } from "vite";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/summaryGeminiSdk.js"),
      name: "SummaryGeminiSdk",
      fileName: () => "sdk-v2-bridge-special",
      formats: ["iife"]
    },
    outDir: resolve(__dirname, "dist"),
    emptyOutDir: false,
    rollupOptions: {
      output: {
        entryFileNames: "sdk-v2-bridge-special.js",
        extend: true
      }
    }
  }
});
