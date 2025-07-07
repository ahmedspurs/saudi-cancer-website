import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  optimizeDeps: {
    noDiscovery: true,
    include: ["file-saver", "lodash", "primevue"], // Add this
  },
  server: {
    port: 3000,
  },
});
