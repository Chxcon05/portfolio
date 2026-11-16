/**
 * Titular de contacto: "Hablemos de" + una pestaña con palabras que rotan
 * (RotatingText de React Bits). La línea de arriba nunca cambia de ancho y la
 * pestaña vive en su propia línea, así el formulario de al lado no se mueve.
 */
import RotatingText from '@/components/reactbits/RotatingText';

interface Props {
  label: string;
  words: string[];
}

export default function ContactHeadline({ label, words }: Props) {
  return (
    <span className="block">
      <span className="block">{label}</span>
      <span className="mt-3 flex">
        <RotatingText
          texts={words}
          mainClassName="inline-flex overflow-hidden rounded-md bg-accent px-3 pb-1.5 text-accent-fg italic shadow-[5px_5px_0_0_var(--fg)] sm:px-4"
          splitLevelClassName="overflow-hidden pb-1"
          staggerFrom="last"
          staggerDuration={0.025}
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '-120%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 400 }}
          rotationInterval={2400}
          pauseOnHover
        />
      </span>
    </span>
  );
}
