import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  envDir: "./env",
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    // open: true, // auto open browser
  },
});
