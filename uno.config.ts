import { defineConfig, presetIcons, presetTypography, presetUno } from "unocss";
import transformerVariantGroup from "@unocss/transformer-variant-group";

export default defineConfig({
  presets: [presetUno(), presetTypography(), presetIcons()],
  transformers: [transformerVariantGroup()],
  preflights: [
    {
      getCSS: () => `
        @keyframes slideDown {
          from {
            height: 0;
          }
          to {
            height: var(--kb-collapsible-content-height);
          }
        }
        @keyframes slideUp {
          from {
            height: var(--kb-collapsible-content-height);
          }
          to {
            height: 0;
          }
        }
      `,
    },
  ],
});
