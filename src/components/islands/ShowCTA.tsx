/**
 * Cierre de la página principal: titular con brillo (React Bits · ShinyText) y acciones con
 * Button y Badge de shadcn/ui.
 */
import { ArrowUpRight, CodeXml, Mail } from 'lucide-react';
import ShinyText from '@/components/reactbits/ShinyText';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Props {
  email: string;
  githubUrl: string;
  github: string;
  availability: string;
  homeUrl: string;
}

export default function ShowCTA({ email, githubUrl, github, availability, homeUrl }: Props) {
  return (
    <div className="flex flex-col items-center text-center">
      <Badge variant="outline" className="gap-2 rounded-full border-line-strong px-3 py-1 font-mono text-[11px] text-muted">
        <span className="size-1.5 rounded-full bg-accent" />
        {availability}
      </Badge>

      <h2 className="mt-8 font-serif text-6xl leading-[0.95] font-normal tracking-[-0.04em] sm:text-8xl lg:text-[9rem]">
        <ShinyText text="Hablemos." color="#8e8374" shineColor="#f4ede1" speed={3} />
      </h2>
      <p className="mt-6 max-w-xl text-lg leading-relaxed text-pretty text-muted">
        Si llegaste hasta aquí, ya viste cómo trabajo. Cuéntame qué quieres construir.
      </p>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <a href={`mailto:${email}`} className={cn(buttonVariants({ size: 'lg' }), 'h-12 rounded-full px-6 text-base')}>
          <Mail aria-hidden="true" />
          Escríbeme
        </a>
        <a
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            buttonVariants({ variant: 'outline', size: 'lg' }),
            'h-12 rounded-full border-line-strong bg-transparent px-6 text-base text-fg hover:bg-elevated hover:text-fg',
          )}
        >
          <CodeXml aria-hidden="true" />@{github}
          <ArrowUpRight aria-hidden="true" />
        </a>
      </div>

      <a
        href={homeUrl}
        className="mt-10 inline-flex items-center gap-2 font-mono text-xs tracking-[0.12em] text-subtle uppercase transition-colors hover:text-fg"
      >
        Ver la versión clásica (con formulario de contacto)
        <ArrowUpRight size={14} aria-hidden="true" />
      </a>
    </div>
  );
}
