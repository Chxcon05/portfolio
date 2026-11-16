/**
 * Antepone el `base` de Astro a una ruta de /public.
 * Necesario en GitHub Pages cuando el sitio vive en /<repo>/.
 *
 * withBase('favicon.svg') -> '/favicon.svg' o '/mi-repo/favicon.svg'
 */
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL;
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  return `${normalizedBase}${path.replace(/^\/+/, '')}`;
}
