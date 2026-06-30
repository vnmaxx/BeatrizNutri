import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Em desenvolvimento, encaminha /api para o backend Express na porta 3001
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        interno: resolve(__dirname, "interno.html"),
      },
    },
  },
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:3001",
    },
  },
});
