import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
    headers: {
      "Content-Security-Policy": "img-src 'self' data: https:;",
    },
  },
  base: '/',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: './index.html'
    }
  },
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
