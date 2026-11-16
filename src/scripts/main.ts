/**
 * Interacciones del sitio, sin dependencias:
 * tema (con revelado circular), copiar correo + aviso, filtro de proyectos,
 * menú móvil, sección activa en la navbar, aparición al hacer scroll, año del
 * footer, barra de progreso, foco de luz en tarjetas, efecto magnético,
 * palabra rotativa del hero, hora local y paleta de comandos (Ctrl/⌘ + K).
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

/**
 * Alterna el tema. Si el navegador soporta View Transitions, el tema nuevo
 * se revela con un círculo que crece desde el punto (x, y).
 */
function toggleTheme(x = window.innerWidth / 2, y = 0): void {
  const next: Theme = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  if (prefersReducedMotion || !document.startViewTransition) {
    setTheme(next);
    return;
  }
  const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
  const transition = document.startViewTransition(() => setTheme(next));
  transition.ready
    .then(() => {
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 550, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', pseudoElement: '::view-transition-new(root)' },
      );
    })
    .catch(() => {
      /* si la transición se interrumpe, el tema ya quedó aplicado */
    });
}

function initTheme(): void {
  // Páginas con tema fijo (p. ej. /show): no tocar la preferencia guardada
  if (root.dataset.forceTheme) return;
  const current = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  setTheme(current);
  document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]').forEach((button) => {
    button.addEventListener('click', (event) => {
      const rect = button.getBoundingClientRect();
      const x = event.clientX || rect.left + rect.width / 2;
      const y = event.clientY || rect.top + rect.height / 2;
      toggleTheme(x, y);
    });
  });
}

/* ---------------------------------- Aviso ---------------------------------- */

let toastTimer: number | undefined;

function showToast(text: string): void {
  const toast = document.querySelector<HTMLElement>('[data-toast]');
  const label = toast?.querySelector<HTMLElement>('[data-toast-text]');
  if (!toast || !label) return;
  label.textContent = text;
  toast.classList.add('is-shown');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove('is-shown'), 2200);
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
      showToast('Correo copiado al portapapeles');

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

/* ---------------------------- Barra de progreso ---------------------------- */

function initScrollProgress(): void {
  const bar = document.querySelector<HTMLElement>('[data-scroll-progress]');
  if (!bar) return;
  let ticking = false;
  const update = (): void => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const progress = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
    bar.style.transform = `scaleX(${progress})`;
    ticking = false;
  };
  update();
  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    },
    { passive: true },
  );
}

/* ------------------------- Foco de luz en tarjetas ------------------------- */

function initSpotlight(): void {
  if (!window.matchMedia('(pointer: fine)').matches) return;
  document.querySelectorAll<HTMLElement>('[data-spotlight]').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${event.clientX - rect.left}px`);
      card.style.setProperty('--my', `${event.clientY - rect.top}px`);
    });
  });
}

/* ------------------------------ Efecto magnético ------------------------------ */

function initMagnetic(): void {
  if (prefersReducedMotion || !window.matchMedia('(pointer: fine)').matches) return;
  document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((element) => {
    element.addEventListener('pointermove', (event) => {
      const rect = element.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      element.style.translate = `${dx * 0.25}px ${dy * 0.25}px`;
    });
    element.addEventListener('pointerleave', () => {
      element.style.translate = '';
    });
  });
}

/* ----------------------------- Palabra rotativa ----------------------------- */

function initWordRotator(): void {
  const rotator = document.querySelector<HTMLElement>('[data-word-rotator]');
  if (!rotator || prefersReducedMotion) return;
  const words = Array.from(rotator.children) as HTMLElement[];
  if (words.length < 2) return;
  let index = 0;
  window.setInterval(() => {
    if (document.hidden) return;
    const current = words[index];
    index = (index + 1) % words.length;
    const next = words[index];
    if (!current || !next) return;
    current.classList.remove('is-active');
    current.classList.add('is-leaving');
    next.classList.remove('is-leaving');
    next.classList.add('is-active');
    window.setTimeout(() => current.classList.remove('is-leaving'), 450);
  }, 2600);
}

/* ---------------------------- Hora en Costa Rica ---------------------------- */

function initClock(): void {
  const clocks = document.querySelectorAll<HTMLElement>('[data-clock]');
  if (clocks.length === 0) return;
  const format = new Intl.DateTimeFormat('es-CR', {
    timeZone: 'America/Costa_Rica',
    hour: 'numeric',
    minute: '2-digit',
  });
  const tick = (): void => {
    const now = format.format(new Date());
    clocks.forEach((clock) => {
      clock.textContent = now;
      clock.setAttribute('datetime', new Date().toISOString());
    });
  };
  tick();
  window.setInterval(tick, 15_000);
}

/* ----------------------------- Paleta de comandos ----------------------------- */

function initCommandPalette(): void {
  const dialog = document.querySelector<HTMLDialogElement>('[data-palette]');
  const input = dialog?.querySelector<HTMLInputElement>('[data-cmd-input]');
  if (!dialog || !input) return;

  const items = Array.from(dialog.querySelectorAll<HTMLElement>('[data-cmd-item]'));
  const groups = Array.from(dialog.querySelectorAll<HTMLElement>('[data-cmd-group]'));
  const empty = dialog.querySelector<HTMLElement>('[data-cmd-empty]');
  items.forEach((item, index) => (item.id = `cmd-${index}`));

  // En Mac el atajo se muestra como ⌘K
  if (/Mac|iPhone|iPad/.test(navigator.platform)) {
    document.querySelectorAll<HTMLElement>('[data-palette-kbd]').forEach((kbd) => (kbd.textContent = '⌘K'));
  }

  let visible = items;
  let active = 0;

  const normalize = (text: string): string => text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

  const setActive = (index: number): void => {
    if (visible.length === 0) {
      input.removeAttribute('aria-activedescendant');
      return;
    }
    active = (index + visible.length) % visible.length;
    items.forEach((item) => item.setAttribute('aria-selected', 'false'));
    const current = visible[active];
    if (!current) return;
    current.setAttribute('aria-selected', 'true');
    input.setAttribute('aria-activedescendant', current.id);
    current.scrollIntoView({ block: 'nearest' });
  };

  const filter = (): void => {
    const terms = normalize(input.value).split(/\s+/).filter(Boolean);
    visible = items.filter((item) => {
      const haystack = normalize(item.dataset.cmdSearch ?? '');
      const match = terms.every((term) => haystack.includes(term));
      item.hidden = !match;
      return match;
    });
    groups.forEach((group) => {
      group.hidden = !group.querySelector('[data-cmd-item]:not([hidden])');
    });
    if (empty) empty.hidden = visible.length > 0;
    setActive(0);
  };

  const open = (): void => {
    if (dialog.open) return;
    input.value = '';
    filter();
    dialog.showModal();
    input.focus();
  };

  const close = (): void => {
    if (dialog.open) dialog.close();
  };

  const run = (item: HTMLElement): void => {
    const { cmdAction: action, cmdValue: value } = item.dataset;
    close();
    if (action === 'nav' && value) {
      document.querySelector(value)?.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      history.replaceState(null, '', value);
    } else if (action === 'copy') {
      document.querySelector<HTMLButtonElement>('[data-copy-email]')?.click();
    } else if (action === 'go' && value) {
      window.location.href = value;
    } else if (action === 'theme') {
      toggleTheme();
    } else if (action === 'link' && value) {
      if (value.startsWith('mailto:')) window.location.href = value;
      else window.open(value, '_blank', 'noopener,noreferrer');
    }
  };

  input.addEventListener('input', filter);
  input.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActive(active + 1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActive(active - 1);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const current = visible[active];
      if (current) run(current);
    }
  });

  items.forEach((item) => {
    item.addEventListener('click', () => run(item));
    item.addEventListener('pointermove', () => {
      const index = visible.indexOf(item);
      if (index !== -1 && index !== active) setActive(index);
    });
  });

  // Clic en el fondo cierra
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) close();
  });

  document.querySelectorAll<HTMLElement>('[data-palette-open]').forEach((button) => {
    button.addEventListener('click', open);
  });

  document.addEventListener('keydown', (event) => {
    const target = event.target as HTMLElement | null;
    const typing = target?.closest('input, textarea, [contenteditable="true"]') && target !== input;
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      if (dialog.open) close();
      else open();
    } else if (event.key === '/' && !typing && !dialog.open) {
      event.preventDefault();
      open();
    }
  });
}

/* -------------------------------- Globo 3D -------------------------------- */

function initGlobe(): void {
  const container = document.querySelector<HTMLElement>('[data-globe]');
  // Solo en pantallas grandes (en móvil el contenedor está oculto)
  if (!container || !window.matchMedia('(min-width: 1024px)').matches) return;
  import('./globe')
    .then(({ mountGlobe }) => mountGlobe(container, prefersReducedMotion))
    .catch(() => {
      /* sin WebGL: el hero se ve igual, solo sin globo */
    });
}

/* ---------------------------- Esfera de etiquetas ---------------------------- */

function initTagSphere(): void {
  const sphere = document.querySelector<HTMLElement>('[data-tag-sphere]');
  if (!sphere) return;
  const tags = Array.from(sphere.querySelectorAll<HTMLElement>('span'));
  if (tags.length === 0) return;

  // Distribución uniforme (Fibonacci) sobre la esfera unitaria
  const golden = Math.PI * (3 - Math.sqrt(5));
  const points = tags.map((_, i) => {
    const y = 1 - (i / (tags.length - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    return { x: Math.cos(golden * i) * r, y, z: Math.sin(golden * i) * r };
  });

  let angleX = 0.35;
  let angleY = 0;
  let speedX = 0;
  let speedY = prefersReducedMotion ? 0 : 0.004;
  const baseSpeed = speedY;
  let dragging = false;
  let lastX = 0;
  let lastY = 0;
  let visible = false;
  let frame = 0;

  const draw = (): void => {
    const radius = sphere.clientWidth * 0.4;
    const cosX = Math.cos(angleX);
    const sinX = Math.sin(angleX);
    const cosY = Math.cos(angleY);
    const sinY = Math.sin(angleY);
    points.forEach((point, i) => {
      // rotación en Y y luego en X
      const x1 = point.x * cosY + point.z * sinY;
      const z1 = -point.x * sinY + point.z * cosY;
      const y2 = point.y * cosX - z1 * sinX;
      const z2 = point.y * sinX + z1 * cosX;
      const scale = 0.62 + ((z2 + 1) / 2) * 0.58; // más grande al frente
      const tag = tags[i];
      if (!tag) return;
      tag.style.transform = `translate(-50%, -50%) translate3d(${x1 * radius}px, ${y2 * radius}px, 0) scale(${scale})`;
      tag.style.opacity = String(0.25 + ((z2 + 1) / 2) * 0.75);
      tag.style.zIndex = String(Math.round((z2 + 1) * 100));
      tag.style.filter = z2 < -0.4 ? 'blur(0.6px)' : '';
    });
  };

  const loop = (): void => {
    frame = 0;
    angleY += speedY;
    angleX += speedX;
    if (!dragging) {
      speedY += (baseSpeed - speedY) * 0.03; // vuelve suavemente a la velocidad base
      speedX *= 0.94;
    }
    draw();
    const moving = Math.abs(speedY) > 0.0001 || Math.abs(speedX) > 0.0001;
    if (visible && !document.hidden && (moving || dragging)) frame = requestAnimationFrame(loop);
  };
  const play = (): void => {
    if (!frame) frame = requestAnimationFrame(loop);
  };

  sphere.addEventListener('pointerdown', (event) => {
    dragging = true;
    lastX = event.clientX;
    lastY = event.clientY;
    sphere.setPointerCapture(event.pointerId);
    play();
  });
  sphere.addEventListener('pointermove', (event) => {
    if (!dragging) return;
    speedY = (event.clientX - lastX) * 0.006;
    speedX = -(event.clientY - lastY) * 0.006;
    lastX = event.clientX;
    lastY = event.clientY;
  });
  const release = (): void => {
    dragging = false;
  };
  sphere.addEventListener('pointerup', release);
  sphere.addEventListener('pointercancel', release);

  new IntersectionObserver(([entry]) => {
    visible = entry?.isIntersecting ?? false;
    if (visible) play();
  }).observe(sphere);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && visible) play();
  });

  draw();
}

/* ------------------------- Inclinación 3D en proyectos ------------------------- */

function initTilt(): void {
  if (prefersReducedMotion || !window.matchMedia('(pointer: fine)').matches) return;
  document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.setProperty('--ry', `${px * 14}deg`);
      card.style.setProperty('--rx', `${-py * 10}deg`);
      card.style.setProperty('--gx', `${(px + 0.5) * 100}%`);
      card.style.setProperty('--gy', `${(py + 0.5) * 100}%`);
    });
    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
    });
  });
}

/* ------------------------------ Compositor de mensaje ------------------------------ */

function initComposer(): void {
  const form = document.querySelector<HTMLFormElement>('[data-composer]');
  if (!form) return;
  const email = form.dataset.email ?? '';
  const nameInput = form.querySelector<HTMLInputElement>('input[name="name"]');
  const message = form.querySelector<HTMLTextAreaElement>('textarea[name="message"]');
  const subject = form.querySelector<HTMLElement>('[data-composer-subject]');
  const count = form.querySelector<HTMLElement>('[data-composer-count]');
  const copyButton = form.querySelector<HTMLButtonElement>('[data-composer-copy]');
  const topics = Array.from(form.querySelectorAll<HTMLInputElement>('input[name="topic"]'));
  if (!nameInput || !message) return;

  const build = (): { subject: string; body: string } => {
    const topic = topics.find((input) => input.checked)?.value ?? 'Contacto';
    const name = nameInput.value.trim();
    const text = message.value.trim();
    return {
      subject: name ? `${topic} — ${name}` : topic,
      body: [text || '(Escribe aquí tu mensaje)', name ? `\n— ${name}` : ''].join('\n').trim(),
    };
  };

  const update = (): void => {
    if (subject) subject.textContent = build().subject;
    if (count) count.textContent = `${message.value.length} / ${message.maxLength}`;
  };

  topics.forEach((input) =>
    input.addEventListener('change', () => {
      if (input.dataset.placeholder) message.placeholder = input.dataset.placeholder;
      update();
    }),
  );
  nameInput.addEventListener('input', update);
  message.addEventListener('input', update);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const { subject: mailSubject, body } = build();
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(body)}`;
    showToast('Abriendo tu app de correo…');
  });

  copyButton?.addEventListener('click', async () => {
    const { subject: mailSubject, body } = build();
    const ok = await copyText(`Para: ${email}\nAsunto: ${mailSubject}\n\n${body}`);
    showToast(ok ? 'Mensaje copiado: pégalo donde prefieras' : 'No se pudo copiar el mensaje');
  });

  update();
}

initTheme();
initCopyEmail();
initProjectFilter();
initMobileMenu();
initNavbar();
initReveal();
initYear();
initScrollProgress();
initSpotlight();
initMagnetic();
initWordRotator();
initClock();
initCommandPalette();
initGlobe();
initTagSphere();
initTilt();
initComposer();
