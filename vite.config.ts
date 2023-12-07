import path from "path";
import solid from "solid-start/vite";
import unocssPlugin from "unocss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [unocssPlugin(), solid()],
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./src"),
    },
  },
});
