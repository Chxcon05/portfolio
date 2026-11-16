/**
 * Bandas de texto cuya velocidad responde a la del scroll
 * (React Bits · ScrollVelocity). Bajar rápido las acelera.
 */
import ScrollVelocity from '@/components/reactbits/ScrollVelocity';

interface Props {
  rows: string[];
}

export default function ShowVelocity({ rows }: Props) {
  return (
    <ScrollVelocity
      texts={rows}
      velocity={55}
      className="px-4 font-serif text-5xl font-normal tracking-[-0.03em] text-fg/90 italic sm:text-7xl lg:text-8xl"
      separator={<span className="mx-6 font-sans text-3xl not-italic text-accent sm:text-5xl">✦</span>}
    />
  );
}
