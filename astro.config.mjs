// @ts-check
import { defineConfig } from "astro/config"
import { satteri } from "@astrojs/markdown-satteri"

import tailwindcss from "@tailwindcss/vite"

import { tableLabels } from "./src/lib/table-labels.mjs"

// https://astro.build/config
export default defineConfig({
  site: "https://imayankkumar.com",
  markdown: {
    processor: satteri({ hastPlugins: [tableLabels] }),
  },
  vite: {
    plugins: [tailwindcss()],
  },
})
