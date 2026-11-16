/**
 * Nombre del hero con dos efectos al pasar el cursor:
 * - DecryptedText (React Bits): las letras se "descifran".
 * - HoverCard (shadcn/ui): tarjeta de perfil con foto de GitHub y enlaces.
 */
import { ArrowUpRight, Briefcase, MapPin } from 'lucide-react';
import DecryptedText from '@/components/reactbits/DecryptedText';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

interface Props {
  name: string;
  role: string;
  company: string;
  location: string;
  github: string;
  projects: number;
}

export default function HeroName({ name, role, company, location, github, projects }: Props) {
  const githubUrl = `https://github.com/${github}`;
  return (
    <HoverCard openDelay={120} closeDelay={120}>
      <HoverCardTrigger asChild>
        <a
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="relative font-medium text-fg decoration-accent decoration-2 underline-offset-4 hover:underline"
        >
          <DecryptedText
            text={name}
            animateOn="hover"
            speed={45}
            maxIterations={12}
            characters="ABCDEFGHIJKLMNOPQRSTUVWXYZáéíóú01<>/{}#*"
            scrambleColor="var(--accent)"
          />
        </a>
      </HoverCardTrigger>
      <HoverCardContent align="start" sideOffset={10} className="w-80">
        <div className="flex gap-4">
          <img
            src={`${githubUrl}.png?size=112`}
            alt=""
            width={56}
            height={56}
            loading="lazy"
            className="size-14 shrink-0 rounded-md border border-line-strong bg-elevated object-cover"
          />
          <div className="min-w-0">
            <p className="font-serif text-xl leading-tight text-fg">{name}</p>
            <p className="mt-0.5 font-mono text-xs text-accent">@{github}</p>
            <p className="mt-3 flex items-center gap-1.5 text-sm text-muted">
              <Briefcase size={14} aria-hidden="true" />
              {role} · {company}
            </p>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
              <MapPin size={14} aria-hidden="true" />
              {location}
            </p>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-dashed border-line-strong pt-3 font-mono text-xs">
          <span className="text-subtle">
            <span className="text-fg">{String(projects).padStart(2, '0')}</span> proyectos públicos
          </span>
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-fg transition-colors hover:text-accent"
          >
            Ver GitHub <ArrowUpRight size={13} aria-hidden="true" />
          </a>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
