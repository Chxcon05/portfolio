# Portafolio · Gabriel Chacón

Portafolio personal hecho con **Astro 7**, **Tailwind CSS 4** y **TypeScript estricto**, con despliegue automático en **GitHub Pages**.

## Desarrollo

Requisitos: Node.js 22.23.4 o superior (el CI usa Node 24).

```bash
npm install
npm run dev       # http://localhost:4321
npm run check     # chequeo de tipos (astro check)
npm run build     # genera ./dist
npm run preview   # sirve ./dist
```

## Agregar un proyecto

Edita `src/data/projects.ts` y añade un objeto al array `projects`:

```ts
{
  slug: 'mi-proyecto',
  title: 'Mi proyecto',
  description: 'Qué problema resuelve, en una o dos frases.',
  category: 'frontend',              // 'fullstack' | 'frontend' | 'mobile' | 'other'
  stack: ['Astro', 'TypeScript'],
  repo: 'https://github.com/Chxcon05/mi-proyecto',
  demo: 'https://mi-proyecto.vercel.app', // opcional: sin demo no se muestra el botón
  image: 'projects/mi-proyecto.webp',     // opcional: archivo en public/projects/
  mockup: 'dashboard',               // mockup CSS que se usa si no hay imagen
  year: 2026,
}
```

Los filtros y contadores se generan solos a partir de las categorías usadas.

Datos personales y enlaces: `src/data/site.ts` (para mostrar LinkedIn, rellena `linkedin`).
Stack técnico: `src/data/stack.ts`.

## Despliegue en GitHub Pages

1. Crea un repositorio en GitHub y sube el proyecto a la rama `main`.
   - Si el repo se llama `Chxcon05.github.io`, el sitio queda en `https://chxcon05.github.io/`.
   - Con cualquier otro nombre (p. ej. `portfolio`), queda en `https://chxcon05.github.io/portfolio/`.
2. En el repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Cada `push` a `main` ejecuta `.github/workflows/deploy.yml`: chequea tipos, compila y publica.

No hace falta tocar `astro.config.mjs` según el nombre del repo: el workflow toma `site` y `base`
de `actions/configure-pages` y los pasa como variables `SITE` y `BASE`.
