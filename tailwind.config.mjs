/**
 * Configuración de Tailwind CSS v4 en formato JS.
 * Se carga desde src/styles/global.css con `@config`.
 *
 * Los colores apuntan a variables CSS (definidas en global.css) para que el
 * tema oscuro (por defecto) y el claro compartan las mismas clases:
 * `bg-bg`, `text-fg`, `border-line`, `text-accent`, etc.
 *
 * @type {import('tailwindcss').Config}
 */
export default {
  content: ['./src/**/*.{astro,html,ts,js,md,mdx}'],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        elevated: 'var(--elevated)',
        line: 'var(--line)',
        'line-strong': 'var(--line-strong)',
        fg: 'var(--fg)',
        muted: 'var(--muted)',
        subtle: 'var(--subtle)',
        accent: 'var(--accent)',
        'accent-fg': 'var(--accent-fg)',
        'accent-2': 'var(--accent-2)',
        'accent-2-fg': 'var(--accent-2-fg)',
        // Alias de los tokens de shadcn/ui hacia la paleta del sitio
        foreground: 'var(--fg)',
        background: 'var(--surface)',
        'muted-foreground': 'var(--muted)',
        input: 'var(--line-strong)',
        ring: 'var(--accent)',
        popover: 'var(--surface)',
        'popover-foreground': 'var(--fg)',
        primary: 'var(--accent)',
        'primary-foreground': 'var(--accent-fg)',
        secondary: 'var(--elevated)',
        'secondary-foreground': 'var(--fg)',
        'accent-foreground': 'var(--accent-fg)',
        destructive: '#e5484d',
      },
      fontFamily: {
        sans: ['"Geist Variable"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['"Fraunces Variable"', 'ui-serif', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono Variable"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      maxWidth: {
        page: '72rem',
      },
      letterSpacing: {
        tightest: '-0.045em',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        ping: {
          '75%, 100%': { transform: 'scale(2.2)', opacity: '0' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) both',
        ping: 'ping 1.6s cubic-bezier(0, 0, 0.2, 1) infinite',
        marquee: 'marquee 38s linear infinite',
        'spin-slow': 'spin 22s linear infinite',
      },
    },
  },
};
