import path from "path";
import solid from "solid-start/vite";
import unocssPlugin from "unocss/vite";
import { defineConfig } from "vite";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    unocssPlugin(),
    solid(),
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  esbuild: {
    legalComments: "none",
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./src"),
    },
  },
});
