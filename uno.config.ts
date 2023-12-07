import { defineConfig, presetIcons, presetTypography, presetUno } from "unocss";
import transformerVariantGroup from "@unocss/transformer-variant-group";

export default defineConfig({
  presets: [
    presetUno(),
    presetTypography(),
    presetIcons({
      collections: {
        custom: {
          "notifications-dot":
            '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><circle cx="12" cy="12" r="2"></circle><path fill="currentColor" d="M5 19q-.425 0-.712-.288T4 18q0-.425.288-.712T5 17h1v-7q0-2.075 1.25-3.687T10.5 4.2v-.7q0-.625.438-1.062T12 2q.625 0 1.063.438T13.5 3.5v.7q2 .5 3.25 2.113T18 10v7h1q.425 0 .713.288T20 18q0 .425-.288.713T19 19H5Zm7-7.5ZM12 22q-.825 0-1.412-.587T10 20h4q0 .825-.587 1.413T12 22Zm-4-5h8v-7q0-1.65-1.175-2.825T12 6q-1.65 0-2.825 1.175T8 10v7Z"/></svg>',
        },
      },
    }),
  ],
  theme: {
    transitionDuration: {
      DEFAULT: "200ms",
    },
  },
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
