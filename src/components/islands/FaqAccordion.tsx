/** Preguntas frecuentes con el Accordion de shadcn/ui. */
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export interface Faq {
  question: string;
  answer: string;
}

interface Props {
  items: Faq[];
}

export default function FaqAccordion({ items }: Props) {
  return (
    <Accordion type="single" collapsible defaultValue="faq-0" className="w-full">
      {items.map((item, index) => (
        <AccordionItem key={item.question} value={`faq-${index}`} className="border-line">
          <AccordionTrigger className="gap-6 rounded-none py-4 font-serif text-lg font-normal text-fg hover:text-accent hover:no-underline [&>svg]:text-accent">
            <span className="flex items-baseline gap-3">
              <span className="font-mono text-[11px] text-subtle">{String(index + 1).padStart(2, '0')}</span>
              {item.question}
            </span>
          </AccordionTrigger>
          <AccordionContent className="pl-8 text-[15px] leading-relaxed text-pretty text-muted">
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
