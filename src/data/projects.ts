/**
 * Proyectos del portafolio.
 *
 * Para agregar uno nuevo basta con añadir un objeto al array `projects`.
 * - `image` (opcional): ruta relativa dentro de /public, p. ej. 'projects/mi-app.webp'.
 *   Si no hay imagen se dibuja un mockup en CSS según `mockup`.
 * - `demo` (opcional): si no existe, la tarjeta no muestra el botón de Live Demo.
 * - `featured`: ocupa dos columnas en escritorio.
 */

export const categories = {
  fullstack: 'Full Stack',
  frontend: 'Frontend',
  mobile: 'Móvil',
  other: 'Python & Java',
} as const;

export type Category = keyof typeof categories;

export type MockupVariant = 'dashboard' | 'report' | 'store' | 'learning' | 'weather' | 'mobile' | 'chat' | 'desktop';

export interface Project {
  /** Identificador único (kebab-case) */
  slug: string;
  title: string;
  /** Qué problema resuelve, en una o dos frases */
  description: string;
  category: Category;
  stack: string[];
  repo: string;
  demo?: string;
  image?: string;
  imageAlt?: string;
  mockup: MockupVariant;
  year: number;
  featured?: boolean;
  /** Notas cortas que aparecen bajo la descripción en tarjetas destacadas */
  highlights?: string[];
}

const gh = (repo: string): string => `https://github.com/Chxcon05/${repo}`;

export const projects: Project[] = [
  {
    slug: 'gestion-craisa',
    title: 'CRAISA · Gestión de leads',
    description:
      'Prototipo que centraliza las consultas comerciales que llegan por distintos canales, les da seguimiento con bitácora y próxima acción, y entrega a Mercadeo y Ventas un dashboard y exportación a Excel.',
    category: 'fullstack',
    stack: ['TypeScript', 'React 19', 'Tailwind CSS', 'Express 5', 'Prisma', 'PostgreSQL', 'Zod', 'Playwright'],
    repo: gh('Gestion_CRAISA'),
    mockup: 'dashboard',
    year: 2026,
    featured: true,
    highlights: [
      'Monorepo con esquemas Zod compartidos entre web y API',
      'Roles: administrador, mercadeo y vendedor',
      'Pruebas con Vitest, Supertest y Playwright',
    ],
  },
  {
    slug: 'costmaster',
    title: 'CostMaster',
    description:
      'Contabilidad de costos para pymes: prorratea costos indirectos entre productos, calcula el punto de equilibrio y genera reportes en PDF y Excel con alertas de margen.',
    category: 'fullstack',
    stack: ['Astro', 'Tailwind CSS', 'Chart.js', 'Express', 'PostgreSQL', 'JWT'],
    repo: gh('CostMater'),
    mockup: 'report',
    year: 2026,
  },
  {
    slug: 'videochamba',
    title: 'VideoCHAMBA',
    description:
      'Tienda de videojuegos con catálogo, carrito y checkout, autenticación con JWT y un panel de administración para gestionar juegos y subir imágenes.',
    category: 'fullstack',
    stack: ['Next.js', 'TypeScript', 'MongoDB', 'JWT', 'Tailwind CSS'],
    repo: gh('VideoCHAMBA'),
    mockup: 'store',
    year: 2025,
  },
  {
    slug: 'educacion-vial',
    title: 'Educación Vial',
    description:
      'App para aprender normas de tránsito: lecciones, quiz, reconocimiento de señales y un asistente conversacional, implementada a partir de un diseño en Figma.',
    category: 'frontend',
    stack: ['React', 'TypeScript', 'Vite', 'Radix UI', 'Tailwind CSS'],
    repo: gh('educacion-vial'),
    mockup: 'learning',
    year: 2026,
  },
  {
    slug: 'weatherwise',
    title: 'WeatherWise',
    description:
      'Consulta el clima actual y el pronóstico de varios días por ciudad, con búsqueda y conversión de unidades a partir de una API meteorológica.',
    category: 'frontend',
    stack: ['Next.js', 'TypeScript', 'React Query', 'Jotai', 'Tailwind CSS'],
    repo: gh('weatherwise'),
    mockup: 'weather',
    year: 2024,
  },
  {
    slug: 'foro-videojuegos',
    title: 'Foro de Videojuegos',
    description:
      'App móvil para crear hilos y comentar sobre videojuegos, con registro, inicio de sesión y consumo de una API REST.',
    category: 'mobile',
    stack: ['React Native', 'Expo', 'JavaScript'],
    repo: gh('React-Native'),
    mockup: 'mobile',
    year: 2025,
  },
  {
    slug: 'vialbot',
    title: 'VialBot',
    description:
      'Chatbot de consola que responde dudas sobre la ley de tránsito de Costa Rica: detecta la intención por palabras clave y busca la mejor respuesta por similitud de texto.',
    category: 'other',
    stack: ['Python', 'difflib', 'JSON'],
    repo: gh('IA'),
    mockup: 'chat',
    year: 2026,
  },
  {
    slug: 'zoo-oracle',
    title: 'ZooOracle',
    description:
      'Aplicación de escritorio para administrar animales y cuidadores de un zoológico, con modelo orientado a objetos y acceso a datos con el patrón DAO sobre Oracle.',
    category: 'other',
    stack: ['Java', 'Swing', 'Oracle', 'PL/SQL', 'JDBC'],
    repo: gh('ZooOracle'),
    mockup: 'desktop',
    year: 2026,
  },
];

/** Categorías que realmente tienen proyectos, en el orden definido arriba. */
export const usedCategories = (Object.keys(categories) as Category[]).filter((key) =>
  projects.some((project) => project.category === key),
);
