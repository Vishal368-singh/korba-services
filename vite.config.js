import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/gis-images": {
        target: "https://weather.mlinfomap.com",
        changeOrigin: true,

        rewrite: (path) => path.replace(/^\/gis-images/, ""),
      },
    },
  },
});
