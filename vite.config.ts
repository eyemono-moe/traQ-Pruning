import solid from "solid-start/vite";
import unocssPlugin from "unocss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [unocssPlugin(), solid({ ssr: false })],
});
