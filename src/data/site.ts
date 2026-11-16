/**
 * Datos personales y enlaces del portafolio.
 * Cambia aquí cualquier dato y se actualizará en todo el sitio.
 */
export interface SocialLink {
  label: string;
  href: string;
  icon: 'github' | 'linkedin' | 'mail';
}

export interface SiteConfig {
  name: string;
  shortName: string;
  role: string;
  company: string;
  companyUrl?: string;
  location: string;
  timezone: string;
  availability: string;
  github: string;
  email: string;
  /** Deja `undefined` para no mostrar LinkedIn. Ej.: 'https://www.linkedin.com/in/tu-usuario' */
  linkedin?: string;
  title: string;
  description: string;
  about: string[];
}

export const site: SiteConfig = {
  name: 'Gabriel Chacón',
  shortName: 'gc',
  role: 'Desarrollador Front-end',
  company: 'CRAISA',
  location: 'Costa Rica',
  timezone: 'GMT-6',
  availability: 'Disponible para colaborar',
  github: 'Chxcon05',
  email: 'gchaconchavarria310@gmail.com',
  linkedin: undefined,
  title: 'Gabriel Chacón · Desarrollador Front-end',
  description:
    'Desarrollador front-end en Costa Rica. Construyo interfaces con TypeScript, React y Astro, y las APIs con Node.js y PostgreSQL que las sostienen.',
  about: [
    'Soy Gabriel, desarrollador front-end en CRAISA, Costa Rica. Me gusta tomar un diseño de Figma o un proceso que hoy vive en hojas de cálculo y convertirlo en una interfaz clara, rápida y fácil de mantener.',
    'Trabajo sobre todo con TypeScript, React y Astro. Cuando el proyecto lo necesita, también construyo la API y el modelo de datos con Node.js, Express y PostgreSQL, para entender el producto de punta a punta.',
  ],
};

export const githubUrl = `https://github.com/${site.github}`;

export const socialLinks: SocialLink[] = [
  { label: 'GitHub', href: githubUrl, icon: 'github' },
  ...(site.linkedin ? [{ label: 'LinkedIn', href: site.linkedin, icon: 'linkedin' as const }] : []),
  { label: 'Correo', href: `mailto:${site.email}`, icon: 'mail' },
];

export const navLinks = [
  { label: 'Proyectos', href: '#proyectos' },
  { label: 'Stack', href: '#stack' },
  { label: 'Sobre mí', href: '#sobre-mi' },
  { label: 'Contacto', href: '#contacto' },
] as const;
