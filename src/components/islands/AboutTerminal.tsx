/**
 * Ventana de terminal que "escribe" el perfil como un objeto de TypeScript.
 * Usa TextType (React Bits); empieza cuando la ventana entra en pantalla.
 */
import TextType from '@/components/reactbits/TextType';

interface Props {
  code: string;
}

export default function AboutTerminal({ code }: Props) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-md border border-line-strong bg-bg/70">
      <div className="flex items-center gap-3 border-b border-line px-4 py-2.5">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="size-2.5 rounded-full bg-line-strong" />
          <span className="size-2.5 rounded-full bg-line-strong" />
          <span className="size-2.5 rounded-full bg-accent" />
        </span>
        <span className="font-mono text-xs text-subtle">~/sobre-mi/gabriel.ts</span>
        <span className="ml-auto rounded-sm border border-line px-1.5 font-mono text-[10px] text-subtle">TS</span>
      </div>
      <div className="relative flex-1 p-4 sm:p-5">
        {/* Texto completo para lectores de pantalla y sin JavaScript */}
        <pre className="sr-only">{code}</pre>
        <div aria-hidden="true" className="font-mono text-[12.5px] leading-relaxed whitespace-pre-wrap text-fg sm:text-[13.5px]">
          <TextType
            as="span"
            text={[code]}
            typingSpeed={22}
            initialDelay={300}
            loop={false}
            startOnVisible
            showCursor
            cursorCharacter="▋"
            cursorColor="var(--accent)"
            className="whitespace-pre-wrap"
          />
        </div>
      </div>
    </div>
  );
}
