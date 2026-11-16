/**
 * Firma gigante del footer con VariableProximity (React Bits): cada letra gana
 * peso y se pinta de verde según la cercanía del cursor. En reposo hace una ola
 * suave, así nunca queda estática (también en pantallas táctiles).
 */
import { useRef } from 'react';
import VariableProximity from '@/components/reactbits/VariableProximity';

interface Props {
  name: string;
}

export default function FooterName({ name }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  return (
    <div ref={containerRef} className="cursor-default">
      <VariableProximity
        label={name}
        containerRef={containerRef}
        fromFontVariationSettings="'wght' 300, 'opsz' 144"
        toFontVariationSettings="'wght' 900, 'opsz' 60"
        fromColor="color-mix(in oklab, var(--fg) 12%, transparent)"
        toColor="var(--accent)"
        radius={260}
        falloff="gaussian"
        lift={0.04}
        idleWave
      />
    </div>
  );
}
