/**
 * "Mi proceso" con Tabs de shadcn/ui. Avanza solo cada pocos segundos con una
 * barra de progreso; se detiene en cuanto el visitante elige un paso.
 */
import { useEffect, useRef, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export interface ProcessStep {
  id: string;
  title: string;
  text: string;
  tools: string[];
}

interface Props {
  steps: ProcessStep[];
  interval?: number;
}

export default function ProcessTabs({ steps, interval = 6000 }: Props) {
  const [active, setActive] = useState(steps[0]?.id ?? '');
  const [auto, setAuto] = useState(true);
  const [paused, setPaused] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) setAuto(false);
    const node = rootRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry?.isIntersecting ?? false), {
      threshold: 0.3,
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const running = auto && visible && !paused;

  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(() => {
      const index = steps.findIndex((step) => step.id === active);
      setActive(steps[(index + 1) % steps.length]?.id ?? active);
    }, interval);
    return () => window.clearTimeout(timer);
  }, [running, active, steps, interval]);

  const activeIndex = steps.findIndex((step) => step.id === active);

  return (
    <div
      ref={rootRef}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <Tabs
        value={active}
        onValueChange={(value) => {
          setActive(value);
          setAuto(false);
        }}
        className="gap-6"
      >
        <TabsList
          variant="line"
          className="grid h-auto w-full grid-cols-5 gap-4 overflow-x-auto rounded-none border-b border-line p-0 [scrollbar-width:none] group-data-[orientation=horizontal]/tabs:h-auto"
        >
          {steps.map((step, index) => (
            <TabsTrigger
              key={step.id}
              value={step.id}
              className="group/step relative h-auto min-w-24 flex-col items-start gap-1 rounded-none border-0 px-0 pt-0 pb-4 text-left whitespace-normal data-[state=active]:bg-transparent data-[state=active]:shadow-none after:hidden"
            >
              <span className="font-mono text-[11px] text-subtle transition-colors group-data-[state=active]/step:text-accent">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="font-serif text-base font-normal text-muted transition-colors group-hover/step:text-fg group-data-[state=active]/step:text-fg sm:text-lg">
                {step.title}
              </span>
              {/* Barra de progreso del paso */}
              <span className="absolute inset-x-0 -bottom-px h-0.5 overflow-hidden bg-transparent" aria-hidden="true">
                <span
                  key={`${step.id}-${active}-${running}`}
                  className="block h-full origin-left bg-accent"
                  style={{
                    transform: index < activeIndex ? 'scaleX(1)' : index === activeIndex && !running ? 'scaleX(1)' : 'scaleX(0)',
                    animation:
                      index === activeIndex && running ? `process-fill ${interval}ms linear forwards` : undefined,
                  }}
                />
              </span>
            </TabsTrigger>
          ))}
        </TabsList>

        {steps.map((step, index) => (
          <TabsContent
            key={step.id}
            value={step.id}
            className="grid gap-6 data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-bottom-2 md:grid-cols-[auto_1fr] md:items-start md:gap-10"
          >
            <span className="text-outline font-serif text-7xl leading-none font-light italic sm:text-8xl" aria-hidden="true">
              {String(index + 1).padStart(2, '0')}
            </span>
            <div>
              <h4 className="font-serif text-2xl font-normal text-fg sm:text-3xl">{step.title}</h4>
              <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-pretty text-muted">{step.text}</p>
              <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Herramientas">
                {step.tools.map((tool) => (
                  <li key={tool} className="tag">
                    {tool}
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
