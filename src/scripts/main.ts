/**
 * Interacciones del sitio, sin dependencias:
 * tema, copiar correo, filtro de proyectos, menú móvil,
 * sección activa en la navbar, aparición al hacer scroll y año del footer.
 */

type Theme = 'dark' | 'light';

const root = document.documentElement;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------------------------------- Tema ---------------------------------- */

function setTheme(theme: Theme): void {
  root.setAttribute('data-theme', theme);
  try {
    localStorage.setItem('theme', theme);
  } catch {
    /* almacenamiento no disponible: el tema solo dura esta visita */
  }
  document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]').forEach((button) => {
    button.setAttribute('aria-label', theme === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro');
  });
}

function initTheme(): void {
  const current = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  setTheme(current);
  document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]').forEach((button) => {
    button.addEventListener('click', () => {
      setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    });
  });
}

/* ------------------------------ Copiar correo ------------------------------ */

async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* se intenta el método alternativo */
  }
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  let ok = false;
  try {
    ok = document.execCommand('copy');
  } catch {
    ok = false;
  }
  textarea.remove();
  return ok;
}

function initCopyEmail(): void {
  const live = document.getElementById('copy-status');

  document.querySelectorAll<HTMLButtonElement>('[data-copy-email]').forEach((button) => {
    const email = button.dataset.copyEmail ?? '';
    const label = button.querySelector<HTMLElement>('[data-copy-label]');
    const defaultLabel = label?.textContent ?? '';
    let timer: number | undefined;

    button.addEventListener('click', async () => {
      const ok = await copyText(email);
      if (!ok) {
        window.location.href = `mailto:${email}`;
        return;
      }
      button.dataset.copied = 'true';
      if (label) label.textContent = 'Copiado';
      if (live) live.textContent = `Correo ${email} copiado al portapapeles`;

      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        delete button.dataset.copied;
        if (label) label.textContent = defaultLabel;
        if (live) live.textContent = '';
      }, 2000);
    });
  });
}

/* ---------------------------- Filtro de proyectos --------------------------- */

function initProjectFilter(): void {
  const group = document.querySelector<HTMLElement>('[data-filter-group]');
  if (!group) return;

  const buttons = Array.from(group.querySelectorAll<HTMLButtonElement>('[data-filter]'));
  const cards = Array.from(document.querySelectorAll<HTMLElement>('[data-project]'));
  const counter = document.querySelector<HTMLElement>('[data-project-count]');

  const apply = (filter: string): void => {
    let visible = 0;
    cards.forEach((card) => {
      const match = filter === 'all' || card.dataset.category === filter;
      card.hidden = !match;
      if (match) {
        visible += 1;
        card.classList.add('is-visible');
        if (!prefersReducedMotion) {
          card.animate(
            [
              { opacity: 0, transform: 'translateY(8px)' },
              { opacity: 1, transform: 'none' },
            ],
            { duration: 380, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', delay: Math.min(visible - 1, 6) * 40, fill: 'backwards' },
          );
        }
      }
    });

    buttons.forEach((button) => {
      const active = button.dataset.filter === filter;
      button.setAttribute('aria-pressed', String(active));
    });

    if (counter) counter.textContent = String(visible).padStart(2, '0');
  };

  buttons.forEach((button) => {
    button.addEventListener('click', () => apply(button.dataset.filter ?? 'all'));
  });
}

/* --------------------------------- Menú móvil -------------------------------- */

function initMobileMenu(): void {
  const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const menu = document.querySelector<HTMLElement>('[data-menu]');
  if (!toggle || !menu) return;

  const setOpen = (open: boolean): void => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    menu.hidden = !open;
  };

  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      toggle.focus();
    }
  });
  window.matchMedia('(min-width: 768px)').addEventListener('change', (event) => {
    if (event.matches) setOpen(false);
  });
}

/* ------------------------ Navbar: scroll y sección activa ------------------------ */

function initNavbar(): void {
  const nav = document.querySelector<HTMLElement>('[data-navbar]');
  if (nav) {
    const onScroll = (): void => {
      nav.dataset.scrolled = String(window.scrollY > 12);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-nav-link]'));
  const sections = links
    .map((link) => document.querySelector<HTMLElement>(link.hash))
    .filter((section): section is HTMLElement => section !== null);

  if (!('IntersectionObserver' in window) || sections.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((link) => {
          if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'true');
          else link.removeAttribute('aria-current');
        });
      });
    },
    { rootMargin: '-45% 0px -50% 0px' },
  );
  sections.forEach((section) => observer.observe(section));
}

/* ---------------------------- Aparición al hacer scroll ---------------------------- */

function initReveal(): void {
  const elements = document.querySelectorAll<HTMLElement>('[data-reveal]');
  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    elements.forEach((element) => element.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
  );
  elements.forEach((element) => observer.observe(element));
}

/* ----------------------------------- Año ----------------------------------- */

function initYear(): void {
  const year = String(new Date().getFullYear());
  document.querySelectorAll<HTMLElement>('[data-year]').forEach((element) => {
    element.textContent = year;
  });
}

initTheme();
initCopyEmail();
initProjectFilter();
initMobileMenu();
initNavbar();
initReveal();
initYear();
