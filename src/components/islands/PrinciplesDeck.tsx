/**
 * Mazo 3D con los principios de trabajo (CardSwap de React Bits).
 * Las tarjetas rotan solas, se pausan con el cursor y se pueden arrastrar.
 */
import type { CSSProperties } from 'react';
import { Accessibility, Braces, PenTool, TestTube } from 'lucide-react';
import CardSwap, { Card } from '@/components/reactbits/CardSwap';

const icons = { pen: PenTool, braces: Braces, test: TestTube, a11y: Accessibility };

export interface Principle {
  icon: keyof typeof icons;
  title: string;
  text: string;
}

interface Props {
  principles: Principle[];
}

const cardStyle: CSSProperties = { background: 'var(--surface)', color: 'var(--fg)' };

export default function PrinciplesDeck({ principles }: Props) {
  return (
    <div className="relative h-[330px] w-full sm:h-[360px]">
      <CardSwap width={340} height={230} cardDistance={44} verticalDistance={48} delay={4500} pauseOnHover draggable>
        {principles.map(({ icon, title, text }, index) => {
          const Icon = icons[icon];
          return (
            <Card key={title} style={cardStyle} className="border border-line-strong">
              <div className="flex h-full flex-col p-5">
                <div className="flex items-center justify-between">
                  <span className="grid size-9 place-items-center rounded-sm border border-line bg-elevated text-accent">
                    <Icon size={17} aria-hidden="true" />
                  </span>
                  <span className="font-mono text-[11px] text-subtle">
                    {String(index + 1).padStart(2, '0')} / {String(principles.length).padStart(2, '0')}
                  </span>
                </div>
                <h4 className="mt-auto font-serif text-2xl leading-tight font-normal text-fg">{title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-pretty text-muted">{text}</p>
              </div>
            </Card>
          );
        })}
      </CardSwap>
    </div>
  );
}
