/**
 * Stack técnico agrupado por categorías.
 * `icon` debe coincidir con una clave de `iconMap` en src/components/Stack.astro.
 */
export type StackIcon =
  | 'code'
  | 'braces'
  | 'atom'
  | 'layers'
  | 'rocket'
  | 'wind'
  | 'smartphone'
  | 'zap'
  | 'server'
  | 'terminal'
  | 'shield'
  | 'cpu'
  | 'coffee'
  | 'database'
  | 'leaf'
  | 'container'
  | 'git'
  | 'test'
  | 'figma'
  | 'globe';

export interface StackItem {
  name: string;
  note?: string;
  icon: StackIcon;
}

export interface StackGroup {
  id: string;
  title: string;
  description: string;
  items: StackItem[];
}

export const stackGroups: StackGroup[] = [
  {
    id: 'frontend',
    title: 'Frontend',
    description: 'Donde paso la mayor parte del tiempo.',
    items: [
      { name: 'TypeScript', note: 'strict', icon: 'braces' },
      { name: 'JavaScript', icon: 'code' },
      { name: 'React', note: 'hooks · TanStack Query', icon: 'atom' },
      { name: 'Next.js', note: 'App Router', icon: 'layers' },
      { name: 'Astro', icon: 'rocket' },
      { name: 'Tailwind CSS', icon: 'wind' },
      { name: 'React Native', note: 'Expo', icon: 'smartphone' },
      { name: 'Vite', icon: 'zap' },
    ],
  },
  {
    id: 'backend',
    title: 'Backend',
    description: 'APIs y lógica de negocio.',
    items: [
      { name: 'Node.js', icon: 'server' },
      { name: 'Express', note: 'REST', icon: 'terminal' },
      { name: 'JWT · Zod', note: 'auth y validación', icon: 'shield' },
      { name: 'Python', icon: 'cpu' },
      { name: 'Java', icon: 'coffee' },
    ],
  },
  {
    id: 'data-devops',
    title: 'Bases de datos & DevOps',
    description: 'Persistencia, pruebas y despliegue.',
    items: [
      { name: 'PostgreSQL', note: 'Prisma', icon: 'database' },
      { name: 'MongoDB', note: 'Mongoose', icon: 'leaf' },
      { name: 'Oracle', note: 'PL/SQL', icon: 'database' },
      { name: 'Docker', note: 'Compose', icon: 'container' },
      { name: 'Git & GitHub', icon: 'git' },
      { name: 'Vitest · Playwright', icon: 'test' },
      { name: 'Vercel', icon: 'globe' },
      { name: 'Figma', icon: 'figma' },
    ],
  },
];
