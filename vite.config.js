import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// G2 Império — Vite config
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    sourcemap: false,
  },
});
