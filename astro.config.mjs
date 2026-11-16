// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

/**
 * GitHub Pages:
 * - El workflow (.github/workflows/deploy.yml) inyecta SITE y BASE a partir de
 *   `actions/configure-pages`, así el mismo código funciona tanto en
 *   `https://chxcon05.github.io/` (repo Chxcon05.github.io) como en
 *   `https://chxcon05.github.io/<repo>/` (cualquier otro nombre de repo).
 * - En local no hace falta nada: se usa la raíz "/".
 */
const site = process.env.SITE || 'https://chxcon05.github.io';
const base = process.env.BASE || '/';

// https://astro.build/config
export default defineConfig({
  site,
  base,
  output: 'static',
  trailingSlash: 'ignore',

  build: {
    assets: '_assets',
  },

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [react()],
});