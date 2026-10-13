import React, { useEffect, useRef, useState, useCallback } from 'react';

interface PolicyEntry {
  account: string;
  concept: string;
  debe: string;
  haber: string;
  isDebit: boolean;
}

const HERO_ENTRIES: PolicyEntry[] = [
  { account: '510-001', concept: 'Sueldos y Salarios', debe: '$9,000.00', haber: '$0.00', isDebit: true },
  { account: '510-002', concept: 'Horas Extraordinarias', debe: '$900.00', haber: '$0.00', isDebit: true },
  { account: '510-003', concept: 'Prima Dominical', debe: '$300.00', haber: '$0.00', isDebit: true },
  { account: '110-001', concept: 'Bancos / Liquidación', debe: '$0.00', haber: '$8,899.51', isDebit: false },
  { account: '210-001', concept: 'Retención ISR Art 96', debe: '$0.00', haber: '$1,117.82', isDebit: false },
  { account: '210-002', concept: 'Retención IMSS Obrero', debe: '$0.00', haber: '$182.67', isDebit: false },
];

const TOP_BAR_FULL_TEXT =
  'REFORMA LFT 1 MAYO 2026 · ART 132 FR XXXIV OBLIGATORIO 1-ENE-2027 · Validado en 3 despachos reales · OCTUBRE 2026';

export default function App() {
  // 1. Barra superior norma: typewriter 1 vez
  const [topBarText, setTopBarText] = useState('');
  const [showTopBarCursor, setShowTopBarCursor] = useState(true);

  // 2. Hero: tarjeta póliza escribe sola línea por línea con cursor mono + pop sello + tick
  const [heroStep, setHeroStep] = useState(0);
  // Steps:
  // 0: initial
  // 1: header visible
  // 2: table header visible
  // 3..8: rows 0..5 typing/visible
  // 9: total balanceado visible
  // 10: stamp pop + tick sound
  const [heroTypedChars, setHeroTypedChars] = useState(0);
  const [showHeroFinalCursor, setShowHeroFinalCursor] = useState(false);

  // 3. Matriz de riesgo: reveal al scroll fila por fila (120ms stagger, 16px slide-in)
  const riskMatrixRef = useRef<HTMLDivElement | null>(null);
  const [visibleRiskRows, setVisibleRiskRows] = useState<boolean[]>([false, false, false, false]);
  const [mitigatedHighlight, setMitigatedHighlight] = useState(false);

  // 4. Comparativa Antes vs Chekdor: shake en roja + count-down 195 -> 12 en verde
  const comparisonRef = useRef<HTMLDivElement | null>(null);
  const [shakeBefore, setShakeBefore] = useState(false);
  const [chekdorHoursText, setChekdorHoursText] = useState('195 hrs / mes');
  const [chekdorDoneRing, setChekdorDoneRing] = useState(false);

  // 5. Arquitectura 3 capas: línea SVG punteada que se dibuja y cambia a sólida
  const architectureRef = useRef<HTMLDivElement | null>(null);
  const [pipelineDraw, setPipelineDraw] = useState(false);
  const [pipelineMidActive, setPipelineMidActive] = useState(false);
  const [pipelineSolid, setPipelineSolid] = useState(false);

  // 6. Ejemplo Juan Pérez: count-up de 0 a $8,899.51 (800ms) + doble línea contable sincronizada
  const juanPerezRef = useRef<HTMLDivElement | null>(null);
  const [netoLiquidoDisplay, setNetoLiquidoDisplay] = useState('$0.00');
  const [doubleLineSynced, setDoubleLineSynced] = useState(false);

  // Pipe D|123|... sagrado: 1 sola vez al entrar en viewport
  const pipeSampleRef = useRef<HTMLDivElement | null>(null);
  const [pipeRevealed, setPipeRevealed] = useState(false);
  const [copiedPipe, setCopiedPipe] = useState(false);

  // Modal de solicitud de despacho piloto / información legal
  const [pilotModalOpen, setPilotModalOpen] = useState(false);
  const [legalModalType, setLegalModalType] = useState<'privacidad' | 'terminos' | null>(null);
  const [pilotForm, setPilotForm] = useState({
    despacho: '',
    contador: '',
    correo: '',
    versionContpaqi: 'CONTPAQi v17',
    empleados: '25 - 100 empleados',
  });
  const [pilotSubmitted, setPilotSubmitted] = useState(false);

  // Sintetizador sutil Web Audio API para tick contable
  const playSubtleClick = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1150, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(360, ctx.currentTime + 0.042);
      gain.gain.setValueAtTime(0.065, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.042);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.046);
    } catch {
      // Silencio seguro si el navegador bloquea audio sin gesto previo
    }
  }, []);

  // 1. Barra superior typewriter (1 sola vez)
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setTopBarText(TOP_BAR_FULL_TEXT);
      setShowTopBarCursor(false);
      return;
    }

    let index = 0;
    let timer: number;
    const startTimeout = window.setTimeout(() => {
      const step = () => {
        if (index <= TOP_BAR_FULL_TEXT.length) {
          setTopBarText(TOP_BAR_FULL_TEXT.slice(0, index));
          index += 1;
          timer = window.setTimeout(step, 14);
        } else {
          window.setTimeout(() => {
            setShowTopBarCursor(false);
          }, 800);
        }
      };
      step();
    }, 220);

    return () => {
      window.clearTimeout(startTimeout);
      window.clearTimeout(timer);
    };
  }, []);

  // 2. Hero: secuencia de escritura línea por línea con cursor mono
  const runHeroSequence = useCallback((withSound = true) => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setHeroStep(10);
      setHeroTypedChars(999);
      setShowHeroFinalCursor(false);
      return () => {};
    }

    const timeouts: number[] = [];
    setHeroStep(0);
    setHeroTypedChars(0);
    setShowHeroFinalCursor(false);

    // Header & Column Headers
    timeouts.push(window.setTimeout(() => setHeroStep(1), 180));
    timeouts.push(window.setTimeout(() => setHeroStep(2), 340));

    // 6 líneas de asientos contables tecleadas con cursor mono
    let elapsed = 480;
    HERO_ENTRIES.forEach((entry, idx) => {
      const stepNum = idx + 3; // 3..8
      const fullLineLength = `${entry.account} ${entry.concept}`.length;
      timeouts.push(
        window.setTimeout(() => {
          setHeroStep(stepNum);
          setHeroTypedChars(0);
        }, elapsed)
      );

      // Tecleo rápido por caracteres de la línea activa
      const charCountSteps = 6;
      const stepDuration = 28;
      for (let c = 1; c <= charCountSteps; c++) {
        const charsToShow = Math.ceil((fullLineLength * c) / charCountSteps);
        timeouts.push(
          window.setTimeout(() => {
            setHeroTypedChars(charsToShow);
          }, elapsed + c * stepDuration)
        );
      }

      elapsed += charCountSteps * stepDuration + 85;
    });

    // Línea Total Balanceado
    timeouts.push(
      window.setTimeout(() => {
        setHeroStep(9);
      }, elapsed + 60)
    );

    // Sello ✓ CUADRA (0.00 DIF) hace pop scale 0.9 -> 1 + tick
    timeouts.push(
      window.setTimeout(() => {
        setHeroStep(10);
        setShowHeroFinalCursor(true);
        if (withSound) {
          playSubtleClick();
        }
      }, elapsed + 260)
    );

    // Ocultar cursor final después de confirmar cuadre
    timeouts.push(
      window.setTimeout(() => {
        setShowHeroFinalCursor(false);
      }, elapsed + 1850)
    );

    return () => {
      timeouts.forEach((t) => window.clearTimeout(t));
    };
  }, [playSubtleClick]);

  useEffect(() => {
    const cleanup = runHeroSequence(true);
    return cleanup;
  }, [runHeroSequence]);

  // 3. Matriz de riesgo: IntersectionObserver fila por fila (120ms stagger, 16px slide-in)
  useEffect(() => {
    const el = riskMatrixRef.current;
    if (!el) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setVisibleRiskRows([true, true, true, true]);
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            [0, 1, 2, 3].forEach((idx) => {
              window.setTimeout(() => {
                setVisibleRiskRows((prev) => {
                  const next = [...prev];
                  next[idx] = true;
                  return next;
                });
              }, idx * 120);
            });

            // La verde última (Fila 4 MITIGADO) hace highlight al terminar
            window.setTimeout(() => {
              setMitigatedHighlight(true);
            }, 4 * 120 + 140);

            obs.unobserve(el);
          }
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // 4. Comparativa Antes vs Chekdor: shake en roja y count-down 195 -> 12 en verde
  useEffect(() => {
    const el = comparisonRef.current;
    if (!el) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setChekdorHoursText('8 – 12 hrs / mes');
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShakeBefore(true);

            let current = 195;
            const target = 12;
            const duration = 700;
            const steps = 20;
            const intervalTime = duration / steps;
            const decrement = (195 - target) / steps;

            const interval = window.setInterval(() => {
              current -= decrement;
              if (current <= target) {
                window.clearInterval(interval);
                setChekdorHoursText('8 – 12 hrs / mes');
                setChekdorDoneRing(true);
                window.setTimeout(() => setChekdorDoneRing(false), 1200);
              } else {
                setChekdorHoursText(`${Math.round(current)} hrs / mes`);
              }
            }, intervalTime);

            obs.unobserve(el);
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // 5. Arquitectura 3 capas: línea SVG punteada que se dibuja con stroke-dashoffset y al final cambia a sólida
  useEffect(() => {
    const el = architectureRef.current;
    if (!el) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setPipelineDraw(true);
      setPipelineMidActive(true);
      setPipelineSolid(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setPipelineDraw(true);

            window.setTimeout(() => {
              setPipelineMidActive(true);
            }, 600);

            window.setTimeout(() => {
              setPipelineSolid(true);
            }, 1400);

            obs.unobserve(el);
          }
        });
      },
      { threshold: 0.35 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // 6. Ejemplo Juan Pérez $8,899.51: count-up de 0 a 8,899.51 con easing 800ms + doble línea contable sincronizada
  useEffect(() => {
    const el = juanPerezRef.current;
    if (!el) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setNetoLiquidoDisplay('$8,899.51');
      setDoubleLineSynced(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const targetVal = 8899.51;
            const duration = 800;
            const startTime = performance.now();

            const animateCount = (now: number) => {
              const elapsed = now - startTime;
              const progress = Math.min(elapsed / duration, 1);
              // Easing easeOutCubic
              const eased = 1 - Math.pow(1 - progress, 3);
              const currentVal = eased * targetVal;

              setNetoLiquidoDisplay(
                '$' +
                  currentVal.toLocaleString('es-MX', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
              );

              if (progress < 1) {
                requestAnimationFrame(animateCount);
              } else {
                setNetoLiquidoDisplay('$8,899.51');
                setDoubleLineSynced(true);
              }
            };

            requestAnimationFrame(animateCount);
            obs.unobserve(el);
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Pipe D|123|... se revela 1 única vez sin repetirse jamás
  useEffect(() => {
    const el = pipeSampleRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setPipeRevealed(true);
            obs.unobserve(el);
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Descarga real de póliza muestra (.txt con UTF-8 BOM)
  const downloadSamplePolicy = () => {
    const sampleText =
      '\uFEFF' +
      'D|123|15/10/2026|510-001|0|Sueldos Juan Perez|9000.00|0.00|\r\n' +
      'D|123|15/10/2026|510-002|0|Horas Extra Juan Perez|900.00|0.00|\r\n' +
      'D|123|15/10/2026|510-003|0|Prima Dominical Juan Perez|300.00|0.00|\r\n' +
      'D|123|15/10/2026|110-001|0|Neto Liquidado Juan Perez|0.00|8899.51|\r\n' +
      'D|123|15/10/2026|210-001|0|Retencion ISR Art 96|0.00|1117.82|\r\n' +
      'D|123|15/10/2026|210-002|0|Retencion IMSS Obrero|0.00|182.67|\r\n';

    const blob = new Blob([sampleText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'POLIZA_CONTPAQI_CHEKDOR_MUESTRA.TXT';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyPipeSample = () => {
    const raw =
      'D|123|15/10/2026|510-001|0|Sueldos Juan Perez|9000.00|0.00|\n' +
      'D|123|15/10/2026|510-002|0|Horas Extra Juan Perez|900.00|0.00|\n' +
      'D|123|15/10/2026|110-001|0|Neto Juan Perez|0.00|8899.51|';
    navigator.clipboard?.writeText(raw).catch(() => {});
    setCopiedPipe(true);
    window.setTimeout(() => setCopiedPipe(false), 1800);
  };

  const handlePilotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPilotSubmitted(true);
    playSubtleClick();
  };

  return (
    <div className="bg-surface font-sans text-ink antialiased min-h-screen">
      {/* 1. BARRA SUPERIOR ÚNICA Y NAVEGACIÓN */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface/95 border-b border-border-base">
        {/* Barra superior de norma única con pulse sutil y typewriter 1 vez */}
        <div className="w-full bg-surface-low border-b border-border-base px-4 md:px-8 py-1.5">
          <div className="max-w-[1120px] mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap py-0.5">
              <span className="w-2 h-2 rounded-full bg-terracota shrink-0 animate-subtle-pulse" />
              <span className="font-mono text-[11px] md:text-[12px] tracking-wide text-ink-muted uppercase inline-flex items-center min-h-[18px]">
                <span>{topBarText}</span>
                {showTopBarCursor && <span className="mono-cursor" />}
              </span>
            </div>
            <span className="font-mono text-[11px] font-semibold text-terracota tracking-wider uppercase shrink-0 hidden sm:inline-block ml-4 animate-badge-blink">
              Norma Activa
            </span>
          </div>
        </div>

        {/* Navegación principal */}
        <div className="max-w-[1120px] mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <a className="flex items-center gap-2.5" href="#">
            <span className="font-serif text-2xl font-bold tracking-tight text-ink">Chekdor</span>
            <span className="font-mono text-[10px] tracking-wider uppercase px-2 py-0.5 bg-terracota-light text-terracota-dark border border-terracota/30 rounded font-semibold">
              Registro &amp; Póliza LFT
            </span>
          </a>
          <nav className="hidden lg:flex items-center gap-7 text-[14px] text-ink-muted">
            <a className="hover:text-ink transition-colors" href="#problema">
              Problema
            </a>
            <a className="hover:text-ink transition-colors" href="#solucion">
              Solución
            </a>
            <a className="hover:text-ink transition-colors" href="#comparativa">
              Comparativa
            </a>
            <a className="hover:text-ink transition-colors" href="#integracion">
              Integración
            </a>
            <a className="hover:text-ink transition-colors" href="#faq">
              FAQ
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <a
              className="inline-flex items-center justify-center bg-terracota hover:bg-terracota-dark text-white text-[13px] font-semibold px-4 py-2 border border-terracota rounded shadow-[1px_1px_0px_#1a1a1a] transition-colors whitespace-nowrap"
              href="#contacto"
            >
              Validar mi despacho
            </a>
          </div>
        </div>
      </header>

      <main className="w-full pt-28">
        {/* 2. HERO SECTION */}
        <section className="w-full border-b border-border-base py-12 md:py-16">
          <div className="max-w-[1120px] mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* Columna izquierda: H1 limpio y contundente */}
              <div className="lg:col-span-7 flex flex-col pt-1">
                <h1 className="font-serif text-[38px] md:text-[50px] leading-[1.08] font-bold text-ink tracking-tight mb-5">
                  Sistema de registro electrónico de jornada y generación de póliza contable que cuadra e importa en CONTPAQi.
                </h1>
                <p className="text-[17px] leading-relaxed text-ink-muted mb-7 max-w-[620px]">
                  Chekdor no es PAC, no timbra, no dispersa. Registra jornada con NFC inmutable hash SHA256, calcula ISR 2026 e IMSS 13 conceptos, entrega pipe | UTF-8 BOM que importa a la primera. Elimina 150-195h/mes de recaptura.
                </p>
                <div className="flex flex-wrap items-center gap-3.5 mb-8">
                  <a
                    className="inline-flex items-center justify-center bg-terracota hover:bg-terracota-dark text-white font-medium text-[14px] px-5 py-3 rounded border border-terracota shadow-[2px_2px_0px_#1a1a1a] transition-all"
                    href="#contacto"
                  >
                    Validar importabilidad en mi despacho
                  </a>
                  <a
                    className="inline-flex items-center justify-center bg-surface-pure hover:bg-surface-low text-ink font-medium text-[14px] px-5 py-3 rounded border border-border-base transition-colors"
                    href="#ejemplo-real"
                  >
                    Ver ejemplo Juan Pérez $8,899.51
                  </a>
                </div>
                <div className="border-t border-border-base pt-3.5">
                  <p className="font-mono text-[11px] leading-normal text-ink-muted">
                    Chekdor no constituye asesoría legal ni fiscal. No es PAC, no timbra, no dispersa nómina, no genera finiquitos ni NOM-035.
                  </p>
                </div>
              </div>

              {/* Columna derecha: Tarjeta POLIZA_DIARIO_20261015.TXT que se teclea línea por línea con cursor mono + pop de sello */}
              <div className="lg:col-span-5 w-full">
                <div className="bg-surface-low border border-border-base rounded p-4 md:p-5 shadow-[2px_2px_0px_#1a1a1a]">
                  {/* Header póliza */}
                  <div
                    className={`flex items-center justify-between border-b border-border-base pb-2.5 mb-3 font-mono text-[12px] transition-opacity duration-200 ${
                      heroStep >= 1 ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <span className="text-ink font-semibold flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-terracota">description</span>
                      <span>POLIZA_DIARIO_20261015.TXT</span>
                      {heroStep === 1 && <span className="mono-cursor" />}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-ink-muted uppercase text-[10px]">UTF-8 BOM · RAW</span>
                      <button
                        type="button"
                        onClick={() => runHeroSequence(true)}
                        title="Repetir tecleo de póliza y verificación"
                        className="text-[10px] font-mono text-terracota hover:text-terracota-dark border border-terracota/30 bg-terracota-light/60 px-1.5 py-0.5 rounded transition-colors cursor-pointer"
                      >
                        ↻
                      </button>
                    </div>
                  </div>

                  {/* Tabla de asientos tecleados línea por línea */}
                  <div className="space-y-1.5 font-mono text-[12px]">
                    <div
                      className={`flex justify-between items-center text-ink-muted py-1 border-b border-border-base text-[10px] uppercase tracking-wider font-semibold transition-opacity duration-200 ${
                        heroStep >= 2 ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      <span>Cuenta &amp; Concepto</span>
                      <div className="flex gap-4">
                        <span className="w-16 text-right">Debe</span>
                        <span className="w-16 text-right">Haber</span>
                      </div>
                    </div>

                    {HERO_ENTRIES.map((entry, idx) => {
                      const stepForLine = idx + 3; // 3..8
                      const isVisible = heroStep >= stepForLine;
                      const isCurrentlyTyping = heroStep === stepForLine;
                      const fullLabel = `${entry.account} ${entry.concept}`;
                      const displayedLabel = isCurrentlyTyping
                        ? fullLabel.slice(0, heroTypedChars)
                        : fullLabel;
                      const showAmounts = !isCurrentlyTyping || heroTypedChars >= fullLabel.length;

                      return (
                        <div
                          key={entry.account}
                          className={`flex justify-between items-center text-ink py-0.5 transition-all duration-200 ${
                            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'
                          }`}
                        >
                          <span className="truncate inline-flex items-center">
                            <span>{displayedLabel}</span>
                            {isCurrentlyTyping && <span className="mono-cursor" />}
                          </span>
                          <div
                            className={`flex gap-4 tabular-nums transition-opacity duration-150 ${
                              showAmounts ? 'opacity-100' : 'opacity-0'
                            }`}
                          >
                            <span
                              className={`w-16 text-right ${
                                entry.isDebit ? 'font-semibold text-ink' : 'text-ink-muted'
                              }`}
                            >
                              {entry.debe}
                            </span>
                            <span
                              className={`w-16 text-right ${
                                !entry.isDebit ? 'font-semibold text-ink' : 'text-ink-muted'
                              }`}
                            >
                              {entry.haber}
                            </span>
                          </div>
                        </div>
                      );
                    })}

                    {/* Total con doble línea contable */}
                    <div
                      className={`border-t-2 border-b-2 border-ink pt-2 pb-1.5 mt-2.5 flex justify-between items-center font-bold transition-all duration-200 ${
                        heroStep >= 9 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'
                      }`}
                    >
                      <span className="text-ink inline-flex items-center">
                        <span>TOTAL BALANCEADO</span>
                        {heroStep === 9 && <span className="mono-cursor" />}
                      </span>
                      <div className="flex gap-4 tabular-nums">
                        <span className="w-16 text-right text-ink">$10,200.00</span>
                        <span className="w-16 text-right text-ink">$10,200.00</span>
                      </div>
                    </div>
                  </div>

                  {/* Sello Cuadra animado con pop scale 0.9 -> 1 + tick de audio */}
                  <div
                    className={`mt-3.5 flex items-center justify-between bg-status-green-bg border border-status-green-border p-2.5 rounded text-status-green transition-all duration-300 ${
                      heroStep >= 10 ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
                    }`}
                    style={{
                      transitionTimingFunction: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    }}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[18px]">verified</span>
                      <span className="font-mono text-[11px] font-bold uppercase tracking-wider">
                        ✓ CUADRA (0.00 DIF)
                      </span>
                    </div>
                    <span className="font-mono text-[11px] text-status-green/80 flex items-center">
                      <span>HASH: 3f8a9...b14</span>
                      {showHeroFinalCursor && <span className="mono-cursor mono-cursor-dark" />}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. CONTEXTO LEGAL Y MATRIZ DE RIESGO (REVEAL AL SCROLL FILA POR FILA CON INTERSECTIONOBSERVER) */}
        <section className="w-full py-12 md:py-16 bg-surface" id="problema">
          <div className="max-w-[1120px] mx-auto px-4 md:px-8">
            <div className="bg-status-red-bg/70 border border-status-red-border rounded p-6 md:p-8 shadow-[2px_2px_0px_#1a1a1a]">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-status-red-border pb-4">
                <div>
                  <span className="font-mono text-[11px] uppercase tracking-wider text-status-red font-bold">
                    Urgencia Regulatoria Federal
                  </span>
                  <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#7F1D1D] mt-1">
                    Sin registro electrónico, multa por trabajador.
                  </h2>
                </div>
                <span className="font-mono text-[11px] bg-surface-pure text-status-red border border-status-red-border px-3 py-1 rounded uppercase tracking-wider font-semibold shadow-[1px_1px_0px_#7F1D1D]">
                  Solución probatoria art. 132 LFT
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Exposición Legal */}
                <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
                  <div className="space-y-3.5 text-[14px] text-[#450A0A] leading-relaxed">
                    <p>
                      <strong className="font-semibold text-[#7F1D1D]">
                        DOF 1 mayo 2026 art 132 fr XXXIV:
                      </strong>{' '}
                      Obliga a los patrones a registrar electrónicamente la jornada laboral garantizando integridad, inalterabilidad y trazabilidad completa. Entrada en vigor obligatoria el{' '}
                      <strong className="text-[#7F1D1D]">1-ene-2027</strong>.
                    </p>
                    <p>
                      <strong className="font-semibold text-[#7F1D1D]">
                        Multa art 994 fr IV Bis:
                      </strong>{' '}
                      Sanciones directas de{' '}
                      <span className="font-bold underline decoration-[#DC2626]">
                        $28,285 a $565,700 MXN
                      </span>{' '}
                      por cada trabajador sin registro normativo. En una inspección a un cliente con 10 trabajadores, la exposición oscila de{' '}
                      <strong>$282,000 a $5.6M MXN</strong>.
                    </p>
                    <p className="text-[13px] border border-status-red-border bg-surface-pure/70 px-3 py-2 rounded text-[#7F1D1D]">
                      <strong>Art 804:</strong> Conservar 1 año + 1 fiscal. |{' '}
                      <strong>Art 805:</strong> Presunción legal a favor del trabajador ante falta de registro. |{' '}
                      <strong>Art 784 fr VIII:</strong> Carga probatoria total e inexcusable al patrón.
                    </p>
                  </div>
                  <div className="bg-surface-pure border border-status-red-border p-3 rounded font-mono text-[11px] text-[#7F1D1D]">
                    <span className="block text-[10px] text-ink-muted uppercase tracking-wider mb-1 font-sans">
                      Estructura de fehaciencia jurídica:
                    </span>
                    <code>
                      marcaje = id + timestamp ISO8601 UTC + SHA256 + device_id, inmutable append-only RLS
                    </code>
                  </div>
                </div>

                {/* Tabla Matriz de Riesgo con Reveal escalonado de 4 filas (16px desde abajo, 120ms stagger) */}
                <div className="lg:col-span-6">
                  <div
                    ref={riskMatrixRef}
                    className="bg-surface-pure border border-status-red-border rounded overflow-hidden"
                  >
                    <div className="bg-[#FEE2E2] px-4 py-2 border-b border-status-red-border flex items-center justify-between font-mono text-[11px] text-status-red font-bold uppercase">
                      <span>Supuesto en Auditoría STPS</span>
                      <span>Consecuencia / Riesgo</span>
                    </div>
                    <div className="divide-y divide-status-red-border text-[13px]">
                      {/* Fila 1: ALTO */}
                      <div
                        className={`p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 transition-all duration-300 ease-out ${
                          visibleRiskRows[0]
                            ? 'opacity-100 translate-y-0'
                            : 'opacity-0 translate-y-4'
                        }`}
                      >
                        <div>
                          <p className="font-semibold text-ink">1. Sin registro electrónico</p>
                          <p className="text-ink-muted text-[12px]">
                            Violación directa art 132 fr XXXIV
                          </p>
                        </div>
                        <span className="font-mono text-[10px] bg-status-red-bg border border-[#DC2626] text-[#DC2626] px-2 py-0.5 font-bold uppercase tracking-wider rounded shrink-0 self-start sm:self-auto">
                          ALTO · Multa $28k-$565k/trab
                        </span>
                      </div>

                      {/* Fila 2: CRÍTICO */}
                      <div
                        className={`p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-[#FFF5F5] transition-all duration-300 ease-out ${
                          visibleRiskRows[1]
                            ? 'opacity-100 translate-y-0'
                            : 'opacity-0 translate-y-4'
                        }`}
                      >
                        <div>
                          <p className="font-semibold text-ink">2. Cuaderno manual / Excel</p>
                          <p className="text-ink-muted text-[12px]">
                            Inadmisible; presunción en contra art 805
                          </p>
                        </div>
                        <span className="font-mono text-[10px] bg-[#7F1D1D] text-white px-2 py-0.5 font-bold uppercase tracking-wider rounded shrink-0 self-start sm:self-auto">
                          CRÍTICO · Descarte Laboral
                        </span>
                      </div>

                      {/* Fila 3: MEDIO */}
                      <div
                        className={`p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 transition-all duration-300 ease-out ${
                          visibleRiskRows[2]
                            ? 'opacity-100 translate-y-0'
                            : 'opacity-0 translate-y-4'
                        }`}
                      >
                        <div>
                          <p className="font-semibold text-ink">3. Reloj digital sin UTC / Hash</p>
                          <p className="text-ink-muted text-[12px]">
                            Manipulable, carece de fehaciencia
                          </p>
                        </div>
                        <span className="font-mono text-[10px] bg-[#FEF3C7] border border-[#D97706] text-[#B45309] px-2 py-0.5 font-bold uppercase tracking-wider rounded shrink-0 self-start sm:self-auto">
                          MEDIO · No Prueba Plena
                        </span>
                      </div>

                      {/* Fila 4: MITIGADO verde + highlight */}
                      <div
                        className={`p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-status-green-bg transition-all duration-300 ease-out rounded-b ${
                          visibleRiskRows[3]
                            ? 'opacity-100 translate-y-0'
                            : 'opacity-0 translate-y-4'
                        } ${mitigatedHighlight ? 'emerald-highlight-flash' : ''}`}
                      >
                        <div>
                          <p className="font-semibold text-status-green">
                            4. Con Chekdor NFC + RLS
                          </p>
                          <p className="text-status-green/80 text-[12px]">
                            UID único, Hash SHA256 inalterable
                          </p>
                        </div>
                        <span className="font-mono text-[10px] bg-[#DCFCE7] border border-[#22C55E] text-status-green px-2 py-0.5 font-bold uppercase tracking-wider rounded shrink-0 self-start sm:self-auto">
                          MITIGADO · Prueba Plena
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. COMPARADOR "ANTES VS CHEKDOR" (SHAKE EN ROJA Y ANIMACIÓN DE TIEMPO 195 -> 12) */}
        <section
          className="w-full py-12 md:py-16 bg-surface-low border-y border-border-base"
          id="comparativa"
        >
          <div className="max-w-[1120px] mx-auto px-4 md:px-8">
            <div className="mb-8">
              <span className="font-mono text-[11px] uppercase tracking-wider text-terracota font-bold">
                Diagnóstico &amp; Métricas Comparadas
              </span>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-ink mt-1">
                Operativa habitual frente al estándar Chekdor.
              </h2>
              <p className="text-[15px] text-ink-muted mt-1 max-w-[700px]">
                Medición de horas invertidas, captura de incidencias, errores de cuadre y riesgo de descarte probatorio en despachos contables.
              </p>
            </div>

            <div
              ref={comparisonRef}
              className="bg-surface-pure border border-border-base rounded overflow-hidden shadow-[2px_2px_0px_#1a1a1a]"
            >
              <div className="grid grid-cols-1 md:grid-cols-12 bg-surface-low border-b border-border-base font-mono text-[11px] font-bold uppercase py-3 px-4 md:px-6">
                <div className="md:col-span-4 text-ink-muted">Parámetro Operativo</div>
                <div className="md:col-span-4 text-status-red mt-1 md:mt-0">
                  Antes (Flujo Manual / Recaptura)
                </div>
                <div className="md:col-span-4 text-status-green mt-1 md:mt-0">Con Chekdor</div>
              </div>

              <div className="divide-y divide-border-base text-[13px] md:text-[14px]">
                {/* Fila 1 con Micro-shake en roja y transición de tiempo 195 -> 12 en verde */}
                <div className="grid grid-cols-1 md:grid-cols-12 p-4 md:px-6 md:py-4 gap-2 md:gap-4 items-start">
                  <div className="md:col-span-4 font-semibold text-ink">
                    Horas invertidas al mes
                    <span className="block font-normal text-[12px] text-ink-muted">
                      Despacho típico con 30 clientes
                    </span>
                  </div>
                  <div
                    className={`md:col-span-4 text-[#7F1D1D] bg-[#FFF5F5] p-2.5 rounded border border-status-red-border/60 transition-transform ${
                      shakeBefore ? 'shake-active' : ''
                    }`}
                  >
                    <span className="font-mono font-bold text-[14px] inline-block">
                      150 – 195 hrs / mes
                    </span>
                    <p className="text-[12px] text-ink-muted mt-1 leading-snug">
                      Normalización manual, Excel rotos y reclamos constantes de quincena.
                    </p>
                  </div>
                  <div
                    className={`md:col-span-4 text-status-green bg-status-green-bg p-2.5 rounded border border-status-green-border/70 transition-all duration-300 ${
                      chekdorDoneRing ? 'ring-2 ring-status-green-border' : ''
                    }`}
                  >
                    <span className="font-mono font-bold text-[14px] inline-block tabular-nums">
                      {chekdorHoursText}
                    </span>
                    <p className="text-[12px] text-ink-muted mt-1 leading-snug">
                      Revisión por excepción y descarga directa de póliza lista para importar.
                    </p>
                  </div>
                </div>

                {/* Fila 2 */}
                <div className="grid grid-cols-1 md:grid-cols-12 p-4 md:px-6 md:py-4 gap-2 md:gap-4 items-start">
                  <div className="md:col-span-4 font-semibold text-ink">
                    Incidencias y horas extra
                    <span className="block font-normal text-[12px] text-ink-muted">
                      Turnos mixtos, retardos, domingos
                    </span>
                  </div>
                  <div className="md:col-span-4 text-[#7F1D1D] bg-[#FFF5F5] p-2.5 rounded border border-status-red-border/60">
                    <span className="font-mono font-bold text-[12px] uppercase">
                      Cuadernos y WhatsApp
                    </span>
                    <p className="text-[12px] text-ink-muted mt-1 leading-snug">
                      Fotos ilegibles, audios con justificaciones a destiempo y fórmulas #VALOR!
                    </p>
                  </div>
                  <div className="md:col-span-4 text-status-green bg-status-green-bg p-2.5 rounded border border-status-green-border/70">
                    <span className="font-mono font-bold text-[12px] uppercase">
                      Tag NFC USB sin app
                    </span>
                    <p className="text-[12px] text-ink-muted mt-1 leading-snug">
                      Acercar tag físico. Marca temporal ISO8601 automática y cálculo determinista.
                    </p>
                  </div>
                </div>

                {/* Fila 3 */}
                <div className="grid grid-cols-1 md:grid-cols-12 p-4 md:px-6 md:py-4 gap-2 md:gap-4 items-start">
                  <div className="md:col-span-4 font-semibold text-ink">
                    Errores de recaptura y centavos
                    <span className="block font-normal text-[12px] text-ink-muted">
                      Integración a CONTPAQi / NOI
                    </span>
                  </div>
                  <div className="md:col-span-4 text-[#7F1D1D] bg-[#FFF5F5] p-2.5 rounded border border-status-red-border/60">
                    <span className="font-mono font-bold text-[12px] uppercase">
                      42 campos manuales / trab
                    </span>
                    <p className="text-[12px] text-ink-muted mt-1 leading-snug">
                      Rechazos por desbalance de $0.01, dobles BOM o cuentas mal tecleadas.
                    </p>
                  </div>
                  <div className="md:col-span-4 text-status-green bg-status-green-bg p-2.5 rounded border border-status-green-border/70">
                    <span className="font-mono font-bold text-[12px] uppercase">
                      Póliza pipe UTF-8 BOM
                    </span>
                    <p className="text-[12px] text-ink-muted mt-1 leading-snug">
                      Cuadrada a $0.00 exacto con catálogo del cliente y validación pre-descarga.
                    </p>
                  </div>
                </div>

                {/* Fila 4 */}
                <div className="grid grid-cols-1 md:grid-cols-12 p-4 md:px-6 md:py-4 gap-2 md:gap-4 items-start">
                  <div className="md:col-span-4 font-semibold text-ink">
                    Riesgo ante inspección STPS
                    <span className="block font-normal text-[12px] text-ink-muted">
                      Carga probatoria art 784 LFT
                    </span>
                  </div>
                  <div className="md:col-span-4 text-[#7F1D1D] bg-[#FFF5F5] p-2.5 rounded border border-status-red-border/60">
                    <span className="font-mono font-bold text-[12px] uppercase">
                      Inadmisible laboralmente
                    </span>
                    <p className="text-[12px] text-ink-muted mt-1 leading-snug">
                      Presunción contra el patrón (art 805) y multas de $28k a $565k por trabajador.
                    </p>
                  </div>
                  <div className="md:col-span-4 text-status-green bg-status-green-bg p-2.5 rounded border border-status-green-border/70">
                    <span className="font-mono font-bold text-[12px] uppercase">
                      Prueba plena inmutable
                    </span>
                    <p className="text-[12px] text-ink-muted mt-1 leading-snug">
                      Hash SHA256 inalterable y trazabilidad exacta conforme al art 132 fr XXXIV.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. ARQUITECTURA EN 3 CAPAS (CON LÍNEA CONECTORA SVG QUE SE DIBUJA Y CAMBIA A SÓLIDA) */}
        <section className="w-full py-12 md:py-16 bg-surface" id="solucion">
          <div className="max-w-[1120px] mx-auto px-4 md:px-8">
            <div className="mb-8">
              <span className="font-mono text-[11px] uppercase tracking-wider text-terracota font-bold">
                Ingeniería Local Determinista
              </span>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-ink mt-1">
                Arquitectura en 3 capas.
              </h2>
              <p className="text-[15px] text-ink-muted mt-1">
                De la terminal física al archivo listo para Pólizas &gt; Importar en CONTPAQi sin intervención manual.
              </p>
            </div>

            {/* Contenedor con línea conectora SVG horizontal entre capas */}
            <div ref={architectureRef} className="relative mb-6">
              {/* Línea SVG conectora para vista de escritorio */}
              <div className="hidden md:block absolute top-[28px] left-[16%] right-[16%] pointer-events-none z-10">
                <svg
                  className="w-full h-4 overflow-visible"
                  fill="none"
                  preserveAspectRatio="none"
                  viewBox="0 0 1000 16"
                >
                  {/* Guía de fondo sutil */}
                  <path d="M 0 8 L 1000 8" stroke="#E7E5E4" strokeWidth="2" />
                  {/* Trazo punteado que se dibuja con stroke-dashoffset y al final cambia a sólida */}
                  <path
                    d="M 0 8 L 1000 8"
                    stroke={pipelineSolid ? '#166534' : '#C65D3A'}
                    strokeDasharray={pipelineSolid ? 'none' : '8 6'}
                    strokeDashoffset={pipelineDraw ? 0 : 1000}
                    strokeWidth="2.5"
                    style={{
                      transition:
                        'stroke-dashoffset 1.35s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.35s ease',
                    }}
                  />
                  {/* Nodos indicadores en las 3 capas */}
                  <circle
                    cx="0"
                    cy="8"
                    fill="#C65D3A"
                    r="5"
                    stroke="#C65D3A"
                    strokeWidth="2.5"
                  />
                  <circle
                    cx="500"
                    cy="8"
                    fill={pipelineMidActive ? '#C65D3A' : '#FFF8F2'}
                    r="5"
                    stroke={pipelineMidActive ? '#C65D3A' : '#E7E5E4'}
                    strokeWidth="2.5"
                    style={{ transition: 'stroke 0.35s ease, fill 0.35s ease' }}
                  />
                  <circle
                    cx="1000"
                    cy="8"
                    fill={pipelineSolid ? '#166534' : '#FFF8F2'}
                    r="5"
                    stroke={pipelineSolid ? '#166534' : '#E7E5E4'}
                    strokeWidth="2.5"
                    style={{ transition: 'stroke 0.35s ease, fill 0.35s ease' }}
                  />
                </svg>
              </div>

              {/* 3 Columnas de capas */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-0">
                {/* Capa 1 */}
                <div className="bg-surface-pure border border-border-base rounded flex flex-col justify-between shadow-[2px_2px_0px_#1a1a1a]">
                  <div>
                    <div className="bg-surface-low border-b border-border-base p-4 flex items-center justify-between">
                      <span className="font-mono text-[11px] uppercase font-bold text-ink">
                        Capa 1: Captura
                      </span>
                      <span className="material-symbols-outlined text-terracota text-[20px]">
                        contactless
                      </span>
                    </div>
                    <div className="p-4 space-y-3">
                      <h3 className="font-serif text-[18px] font-bold text-ink">
                        Tag NFC NTAG213 sin app
                      </h3>
                      <p className="text-[13px] text-ink-muted leading-relaxed">
                        Hardware tag adhesivo con UID de fábrica único, lector USB HID 13.56MHz sin batería y sin exigir instalar apps en el teléfono del trabajador.
                      </p>
                      <p className="text-[13px] text-ink font-medium leading-relaxed">
                        Marca: acerca el tag → registra ID + timestamp UTC + hash SHA256 + device_id. Inmutable append-only conforme al art. 132 LFT.
                      </p>
                    </div>
                  </div>
                  <div className="p-3.5 bg-surface-low border-t border-border-base font-mono text-[11px]">
                    <span className="block text-[10px] text-ink-muted uppercase mb-1">
                      Snippet payload RAW:
                    </span>
                    <pre className="leading-tight text-ink overflow-x-auto whitespace-pre-wrap">{`marcajes {
  id: 1042,
  trabajador_id: 'EMP-08',
  timestamp: '2026-10-12T13:05:22.123Z',
  hash: 'a3f7…9c1',
  dispositivo: 'USB-01'
}`}</pre>
                  </div>
                </div>

                {/* Capa 2 */}
                <div className="bg-surface-pure border border-border-base rounded flex flex-col justify-between shadow-[2px_2px_0px_#1a1a1a]">
                  <div>
                    <div className="bg-surface-low border-b border-border-base p-4 flex items-center justify-between">
                      <span className="font-mono text-[11px] uppercase font-bold text-ink">
                        Capa 2: Cálculo
                      </span>
                      <span className="material-symbols-outlined text-terracota text-[20px]">
                        memory
                      </span>
                    </div>
                    <div className="p-4 space-y-3">
                      <h3 className="font-serif text-[18px] font-bold text-ink">
                        @chekdor/motor 12,267 líneas
                      </h3>
                      <p className="text-[13px] text-ink-muted leading-relaxed">
                        0 dependencias externas. Compilado con tipos estrictos deterministas:
                      </p>
                      <ul className="space-y-2 text-[13px] text-ink">
                        <li className="flex items-start gap-1.5">
                          <span className="material-symbols-outlined text-[16px] text-terracota mt-0.5 shrink-0">
                            check_circle
                          </span>
                          <span>
                            <strong>ISR art. 96:</strong> Tarifa 2026 mensualizada + subsidio al empleo.
                          </span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="material-symbols-outlined text-[16px] text-terracota mt-0.5 shrink-0">
                            check_circle
                          </span>
                          <span>
                            <strong>Horas extra art. 68:</strong> Dobles y triples con tope de 3h/día x 3 veces.
                          </span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="material-symbols-outlined text-[16px] text-terracota mt-0.5 shrink-0">
                            check_circle
                          </span>
                          <span>
                            <strong>IMSS art. 27:</strong> 13 conceptos integrados con respaldo local.
                          </span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="material-symbols-outlined text-[16px] text-terracota mt-0.5 shrink-0">
                            check_circle
                          </span>
                          <span>
                            <strong>Prima dominical art. 71:</strong> Exención exacta hasta 1 SM ($278.80).
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="p-3.5 bg-surface-low border-t border-border-base font-mono text-[11px]">
                    <span className="text-[10px] text-ink-muted uppercase block">Validación:</span>
                    <p className="text-status-green font-semibold mt-0.5">
                      ✓ 199 pruebas unitarias aprobadas
                    </p>
                  </div>
                </div>

                {/* Capa 3 */}
                <div className="bg-surface-pure border border-border-base rounded flex flex-col justify-between shadow-[2px_2px_0px_#1a1a1a]">
                  <div>
                    <div className="bg-surface-low border-b border-border-base p-4 flex items-center justify-between">
                      <span className="font-mono text-[11px] uppercase font-bold text-ink">
                        Capa 3: Exportación
                      </span>
                      <span className="material-symbols-outlined text-terracota text-[20px]">
                        output
                      </span>
                    </div>
                    <div className="p-4 space-y-3">
                      <h3 className="font-serif text-[18px] font-bold text-ink">
                        @chekdor/serializadores
                      </h3>
                      <p className="text-[13px] text-ink-muted leading-relaxed">
                        9 layouts listos para exportación directa sin edición posterior:
                      </p>
                      <ul className="space-y-2 text-[13px] text-ink">
                        <li className="flex items-start gap-1.5">
                          <span className="material-symbols-outlined text-[16px] text-terracota mt-0.5 shrink-0">
                            check_circle
                          </span>
                          <span>
                            <strong>CONTPAQi Contabilidad:</strong> Formato pipe (|) sin encabezado con UTF-8 BOM.
                          </span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="material-symbols-outlined text-[16px] text-terracota mt-0.5 shrink-0">
                            check_circle
                          </span>
                          <span>
                            <strong>Nóminas &amp; ERPs:</strong> CONTPAQi Nóminas, Aspel NOI y SAE.
                          </span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="material-symbols-outlined text-[16px] text-terracota mt-0.5 shrink-0">
                            check_circle
                          </span>
                          <span>
                            <strong>Layout SAT:</strong> 20 campos Receptor validados.
                          </span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="material-symbols-outlined text-[16px] text-terracota mt-0.5 shrink-0">
                            check_circle
                          </span>
                          <span>
                            <strong>Intercambio:</strong> CSV configurable por catálogo.
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="p-3.5 bg-surface-low border-t border-border-base font-mono text-[11px]">
                    <span className="text-[10px] text-ink-muted uppercase block">
                      Compatibilidad comprobada:
                    </span>
                    <p className="text-ink font-semibold mt-0.5">
                      CONTPAQi v14, v15, v16 &amp; v17
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Barra de estado que muestra Exportación Determinista: Conforme cuando la línea cambia a sólida */}
            <div
              className={`bg-surface-low border p-4 rounded flex flex-col md:flex-row items-center justify-between gap-3 font-mono text-[12px] transition-all duration-500 ${
                pipelineSolid ? 'border-status-green-border' : 'border-border-base'
              }`}
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-status-green" />
                <span className="text-ink font-semibold">Validado en 3 despachos reales</span>
                <span className="text-ink-muted">·</span>
                <span className="text-status-green">20/20 campos SAT verificados</span>
                <span className="text-ink-muted">·</span>
                <span className="text-status-green">DEBE = HABER 10,200 = 10,200</span>
              </div>
              <span
                className={`font-mono text-[10px] uppercase border px-2.5 py-1 rounded shrink-0 transition-all duration-300 ${
                  pipelineSolid
                    ? 'bg-status-green-bg text-status-green border-status-green-border font-bold shadow-[1px_1px_0px_#166534]'
                    : 'bg-surface-pure text-ink-muted border-border-base'
                }`}
              >
                Exportación Determinista: Conforme
              </span>
            </div>
          </div>
        </section>

        {/* 6. EJEMPLO REAL VERIFICABLE: JUAN PÉREZ LÓPEZ ($8,899.51) CON COUNT-UP SINCRONIZADO */}
        <section
          className="w-full py-12 md:py-16 bg-surface-low border-y border-border-base"
          id="ejemplo-real"
        >
          <div className="max-w-[1120px] mx-auto px-4 md:px-8">
            <div className="mb-8">
              <span className="font-mono text-[11px] uppercase tracking-wider text-terracota font-bold">
                Verificación Matemática de Campo
              </span>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-ink mt-1">
                Ejemplo real verificable: Juan Pérez López
              </h2>
              <p className="text-[15px] text-ink-muted mt-1">
                $600.00 diario · 6 horas extra · 2 domingos laborados. Cálculo exacto del 1 al 15 de octubre de 2026 contrastado contra la póliza importada.
              </p>
            </div>

            <div
              ref={juanPerezRef}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
            >
              {/* Liquidación Fiscal */}
              <div className="lg:col-span-6 bg-surface-pure border border-border-base rounded p-5 shadow-[2px_2px_0px_#1a1a1a]">
                <div className="border-b border-border-base pb-2.5 mb-4 flex justify-between items-center">
                  <h3 className="font-mono text-[12px] uppercase font-bold text-ink">
                    Liquidación Fiscal Quincenal
                  </h3>
                  <span className="font-mono text-[11px] text-ink-muted">
                    LFT 2026 / SAT ANEXO 8
                  </span>
                </div>
                <table className="w-full font-mono text-[12px] border-collapse">
                  <thead className="text-ink-muted text-[10px] uppercase border-b border-border-base">
                    <tr>
                      <th className="py-1 text-left">Concepto</th>
                      <th className="py-1 text-right">Monto</th>
                      <th className="py-1 text-right">Gravado / Exento</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-base">
                    <tr>
                      <td className="py-2 text-ink font-medium">Sueldo Base (15d x $600)</td>
                      <td className="py-2 text-right tabular-nums text-ink font-semibold">
                        $9,000.00
                      </td>
                      <td className="py-2 text-right tabular-nums text-ink-muted">100% Gravado</td>
                    </tr>
                    <tr>
                      <td className="py-2 text-ink font-medium">Horas Extra Dobles (6 hrs)</td>
                      <td className="py-2 text-right tabular-nums text-ink font-semibold">
                        $900.00
                      </td>
                      <td className="py-2 text-right tabular-nums text-ink-muted">
                        $450.00 G | $450.00 E
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 text-ink font-medium">Prima Dominical (2 domingos)</td>
                      <td className="py-2 text-right tabular-nums text-ink font-semibold">
                        $300.00
                      </td>
                      <td className="py-2 text-right tabular-nums text-ink-muted">
                        $73.72 G | $226.28 E
                      </td>
                    </tr>
                    <tr className="bg-surface-low font-bold">
                      <td className="py-2 text-ink">TOTAL PERCEPCIONES BRUTAS</td>
                      <td className="py-2 text-right tabular-nums text-ink">$10,200.00</td>
                      <td className="py-2 text-right tabular-nums text-ink-muted">
                        Grav: $9,523.72
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 text-status-red font-medium">
                        Retención ISR Art. 96 (Tarifa 2026)
                      </td>
                      <td className="py-2 text-right tabular-nums text-status-red font-semibold">
                        -$1,117.82
                      </td>
                      <td className="py-2 text-right tabular-nums text-ink-muted">
                        Deducción de Ley
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 text-status-red font-medium">
                        Cuota Obrero IMSS (13 conceptos)
                      </td>
                      <td className="py-2 text-right tabular-nums text-status-red font-semibold">
                        -$182.67
                      </td>
                      <td className="py-2 text-right tabular-nums text-ink-muted">
                        Deducción de Ley
                      </td>
                    </tr>
                    <tr className="border-t-2 border-b-2 border-ink bg-surface-low">
                      <td className="py-2.5 font-bold text-ink uppercase">NETO LÍQUIDO A PAGAR</td>
                      <td className="py-2.5 text-right tabular-nums font-bold text-status-green text-[15px]">
                        {netoLiquidoDisplay}
                      </td>
                      <td className="py-2.5 text-right font-mono text-[10px] text-ink-muted uppercase">
                        Efectivo / Banco
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className="mt-4 p-3 bg-surface-low border border-border-base rounded text-[12px] text-ink-muted leading-relaxed">
                  <strong>Fundamento Prima Dominical:</strong> Exención limitada estrictamente a 1 Salario Mínimo General vigente conforme al Art. 71 de la LFT y Art. 93 fr. XIV LISR ($278.80 MXN acumulado por 2 eventos).
                </div>
              </div>

              {/* Póliza Contraparte con doble línea contable sincronizada al llegar a $8,899.51 / 10,200 = 10,200 */}
              <div className="lg:col-span-6 bg-surface-pure border border-border-base rounded p-5 shadow-[2px_2px_0px_#1a1a1a]">
                <div className="border-b border-border-base pb-2.5 mb-4 flex justify-between items-center">
                  <h3 className="font-mono text-[12px] uppercase font-bold text-ink">
                    PÓLIZA DE DIARIO CONTPAQi (15-OCT-2026)
                  </h3>
                  <span className="font-mono text-[11px] text-status-green font-semibold">
                    ESTRUCTURA PIPE (|)
                  </span>
                </div>

                <div className="space-y-3 font-mono text-[12px]">
                  <div>
                    <span className="text-[10px] font-bold text-ink-muted uppercase block mb-1">
                      Cargos (Debe):
                    </span>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center bg-surface-low px-2 py-1 rounded">
                        <span className="text-ink">510-001 Sueldos y Salarios</span>
                        <span className="font-bold tabular-nums">$9,000.00</span>
                      </div>
                      <div className="flex justify-between items-center bg-surface-low px-2 py-1 rounded">
                        <span className="text-ink">510-002 Horas Extras Dobles</span>
                        <span className="font-bold tabular-nums">$900.00</span>
                      </div>
                      <div className="flex justify-between items-center bg-surface-low px-2 py-1 rounded">
                        <span className="text-ink">510-003 Prima Dominical</span>
                        <span className="font-bold tabular-nums">$300.00</span>
                      </div>
                      <div className="flex justify-between items-center px-2 py-1 border-t border-border-base font-bold text-ink">
                        <span>SUMA DEBE</span>
                        <span className="tabular-nums">$10,200.00</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-ink-muted uppercase block mb-1">
                      Abonos (Haber):
                    </span>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center bg-surface-low px-2 py-1 rounded">
                        <span className="text-ink">110-001 Bancos / Liquidación Nómina</span>
                        <span className="font-bold tabular-nums text-status-green">
                          {netoLiquidoDisplay}
                        </span>
                      </div>
                      <div className="flex justify-between items-center bg-surface-low px-2 py-1 rounded">
                        <span className="text-ink">210-001 Retención ISR Art 96</span>
                        <span className="font-bold tabular-nums">$1,117.82</span>
                      </div>
                      <div className="flex justify-between items-center bg-surface-low px-2 py-1 rounded">
                        <span className="text-ink">210-002 IMSS Retención Obrera</span>
                        <span className="font-bold tabular-nums">$182.67</span>
                      </div>
                      <div className="flex justify-between items-center px-2 py-1 border-t border-border-base font-bold text-ink">
                        <span>SUMA HABER</span>
                        <span className="tabular-nums">$10,200.00</span>
                      </div>
                    </div>
                  </div>

                  {/* Doble línea contable sincronizada cuando termina el count-up */}
                  <div
                    className={`bg-status-green-bg border border-status-green-border p-2.5 rounded flex items-center justify-between text-status-green font-bold transition-all duration-300 ${
                      doubleLineSynced ? 'emerald-highlight-flash' : ''
                    }`}
                    style={
                      doubleLineSynced
                        ? {
                            borderTopWidth: '2px',
                            borderTopColor: '#166534',
                            borderBottomWidth: '4px',
                            borderBottomStyle: 'double',
                            borderBottomColor: '#166534',
                          }
                        : undefined
                    }
                  >
                    <span>DEBE $10,200.00 = HABER $10,200.00</span>
                    <span className="font-mono text-[11px] uppercase tracking-wider">
                      ✓ CUADRA A CERO
                    </span>
                  </div>

                  <div className="border-t border-border-base pt-2 space-y-1 text-[11px] text-ink-muted">
                    <p>
                      • <strong>Cuotas patronales ($2,218.65):</strong> Generadas de forma autónoma en póliza de provisión contable separada.
                    </p>
                    <p>
                      • <strong>Fix auditado:</strong> <code>guarderias_descuento</code> no suma a patronal corregido. Costo patronal liquidado:{' '}
                      <strong>$11,101.19</strong>.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-surface-pure border border-border-base p-3.5 rounded font-mono text-[12px] text-ink">
              <code>
                function calcNomina(&#123; sbc, dias, extra, dominical &#125;) &#123; return &#123; neto, isr, imss, poliza &#125;; &#125; // 12,267 líneas, 0 dependencias externas, determinista
              </code>
            </div>
          </div>
        </section>

        {/* 7. CÓMO IMPORTA EN CONTPAQi & CHECKLIST PRE-DESCARGA */}
        <section className="w-full py-12 md:py-16 bg-surface" id="integracion">
          <div className="max-w-[1120px] mx-auto px-4 md:px-8">
            <div className="mb-8">
              <span className="font-mono text-[11px] uppercase tracking-wider text-terracota font-bold">
                Integración Nativa Sin Fricción
              </span>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-ink mt-1">
                Cómo importa en CONTPAQi.
              </h2>
              <p className="text-[15px] text-ink-muted mt-1">
                Flujo de importación directa a través de archivos de texto delimitados por pipe (|) en UTF-8 con marca BOM única.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Pasos de Importación y Snippet Pipe Sagrado */}
              <div className="lg:col-span-6 space-y-4">
                <div className="border border-border-base p-4 rounded bg-surface-low shadow-[1px_1px_0px_#1a1a1a]">
                  <span className="font-mono text-[10px] text-terracota font-bold uppercase">
                    Paso 1 · Generación Exacta
                  </span>
                  <h3 className="font-semibold text-ink text-[15px] mt-0.5">
                    Archivo de texto con UTF-8 BOM estricto
                  </h3>
                  <p className="text-[13px] text-ink-muted mt-1 leading-snug">
                    Chekdor genera el archivo <code>poliza_2026-10-15.txt</code> delimitado por tuberías (|), sin renglón inicial de encabezado textual que truene el procesador de CONTPAQi.
                  </p>
                </div>

                <div className="border border-border-base p-4 rounded bg-surface-low shadow-[1px_1px_0px_#1a1a1a]">
                  <span className="font-mono text-[10px] text-terracota font-bold uppercase">
                    Paso 2 · Estructura por línea
                  </span>
                  <h3 className="font-semibold text-ink text-[15px] mt-0.5">
                    Estructura canónica de movimiento contable
                  </h3>
                  <div className="mt-2 bg-surface-pure border border-border-base p-2 rounded font-mono text-[11px] text-ink overflow-x-auto whitespace-nowrap">
                    Tipo | Num | Fecha | Cuenta | Depto | Concepto | Debe | Haber
                  </div>
                </div>

                <div className="border border-border-base p-4 rounded bg-surface-low shadow-[1px_1px_0px_#1a1a1a]">
                  <span className="font-mono text-[10px] text-terracota font-bold uppercase">
                    Paso 3 · Importación en 2 clics
                  </span>
                  <h3 className="font-semibold text-ink text-[15px] mt-0.5">
                    Cero errores de parseo en menú nativo
                  </h3>
                  <p className="text-[13px] text-ink-muted mt-1 leading-snug">
                    Dentro de CONTPAQi Contabilidad: vaya a{' '}
                    <strong>Pólizas &gt; Importar</strong> &gt; Seleccione el archivo generado. La importación concluye con estatus exitoso en menos de 1 segundo.
                  </p>
                </div>

                {/* Snippet Pipe Plano (Sagrado: se muestra 1 sola vez sin re-animarse jamás) */}
                <div
                  ref={pipeSampleRef}
                  className={`bg-surface-low border border-border-base p-4 rounded font-mono text-[11px] transition-opacity duration-500 ${
                    pipeRevealed ? 'opacity-100' : 'opacity-95'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-ink-muted uppercase">
                      Muestra de archivo de texto generado (.txt):
                    </span>
                    <button
                      type="button"
                      onClick={copyPipeSample}
                      className="text-[10px] font-mono text-terracota hover:underline cursor-pointer"
                    >
                      {copiedPipe ? '✓ Copiado' : 'Copiar muestra'}
                    </button>
                  </div>
                  <div className="space-y-0.5 text-ink overflow-x-auto whitespace-pre leading-relaxed">
                    {`D|123|15/10/2026|510-001|0|Sueldos Juan Perez|9000.00|0.00|
D|123|15/10/2026|510-002|0|Horas Extra Juan Perez|900.00|0.00|
D|123|15/10/2026|110-001|0|Neto Juan Perez|0.00|8899.51|`}
                  </div>
                </div>
              </div>

              {/* Checklist de Validación Pre-Descarga */}
              <div className="lg:col-span-6 bg-surface-pure border border-border-base rounded p-5 shadow-[2px_2px_0px_#1a1a1a]">
                <div className="border-b border-border-base pb-2.5 mb-4 flex justify-between items-center">
                  <h3 className="font-mono text-[12px] uppercase font-bold text-ink">
                    Checklist de Validación Pre-Descarga
                  </h3>
                  <span className="font-mono text-[10px] bg-status-green-bg text-status-green border border-status-green-border px-2 py-0.5 rounded font-bold uppercase">
                    5 Filtros Activos
                  </span>
                </div>

                <div className="space-y-2.5 mb-6">
                  <div className="flex items-start gap-2.5 p-2.5 bg-status-green-bg border border-status-green-border/60 rounded">
                    <span className="material-symbols-outlined text-status-green text-[18px] shrink-0 mt-0.5">
                      check_circle
                    </span>
                    <div>
                      <p className="font-semibold text-ink text-[13px]">
                        Cuentas contables no vacías y con máscara válida
                      </p>
                      <p className="text-[12px] text-ink-muted">
                        Cotejo automático contra el catálogo asignado de cada empresa.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2.5 bg-status-green-bg border border-status-green-border/60 rounded">
                    <span className="material-symbols-outlined text-status-green text-[18px] shrink-0 mt-0.5">
                      check_circle
                    </span>
                    <div>
                      <p className="font-semibold text-ink text-[13px]">
                        DEBE = HABER con tolerancia $0.00 estricta
                      </p>
                      <p className="text-[12px] text-ink-muted">
                        El serializador bloquea el archivo si existe $0.01 de discrepancia.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2.5 bg-status-green-bg border border-status-green-border/60 rounded">
                    <span className="material-symbols-outlined text-status-green text-[18px] shrink-0 mt-0.5">
                      check_circle
                    </span>
                    <div>
                      <p className="font-semibold text-ink text-[13px]">
                        Sin doble BOM ni caracteres de control inválidos
                      </p>
                      <p className="text-[12px] text-ink-muted">
                        Previene fallos de lectura en codificación ANSI / UTF-8 heredadas.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2.5 bg-status-green-bg border border-status-green-border/60 rounded">
                    <span className="material-symbols-outlined text-status-green text-[18px] shrink-0 mt-0.5">
                      check_circle
                    </span>
                    <div>
                      <p className="font-semibold text-ink text-[13px]">
                        Sin fila de encabezados textuales que rompan parser
                      </p>
                      <p className="text-[12px] text-ink-muted">
                        Elimina cabeceras humanas; inicia directamente en el renglón de movimiento.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2.5 bg-status-green-bg border border-status-green-border/60 rounded">
                    <span className="material-symbols-outlined text-status-green text-[18px] shrink-0 mt-0.5">
                      check_circle
                    </span>
                    <div>
                      <p className="font-semibold text-ink text-[13px]">
                        Formato de fecha estricto DD/MM/AAAA
                      </p>
                      <p className="text-[12px] text-ink-muted">
                        Inmune a desconfiguraciones regionales de Windows o del servidor.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Flexibilidad de Catálogo */}
                <div className="border-t border-border-base pt-4">
                  <span className="font-mono text-[11px] uppercase font-bold text-ink block mb-2">
                    Flexibilidad por Catálogo de Despacho:
                  </span>
                  <div className="space-y-1.5 font-mono text-[11px] bg-surface-low p-3 rounded border border-border-base">
                    <div className="flex justify-between text-ink">
                      <span>• Cliente A (Manufactura):</span>
                      <span className="font-semibold">Cuenta 510-001 → Sueldos</span>
                    </div>
                    <div className="flex justify-between text-ink">
                      <span>• Cliente B (Servicios):</span>
                      <span className="font-semibold">Cuenta 6000-01-001 → Sueldos</span>
                    </div>
                    <div className="flex justify-between text-ink">
                      <span>• Cliente C (Constructora):</span>
                      <span className="font-semibold">Cuenta 5000-001-001 → Sueldos</span>
                    </div>
                  </div>
                  <p className="text-[12px] text-ink-muted mt-2 leading-relaxed">
                    Mismo concepto de ley, tres cuentas distintas. Chekdor respeta la estructura contable de cada uno de los clientes de tu despacho.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 8. FLUJO "CÓMO EMPEZAR EN 3 PASOS" */}
        <section className="w-full py-12 md:py-16 bg-surface-low border-b border-border-base">
          <div className="max-w-[1120px] mx-auto px-4 md:px-8">
            <div className="mb-8">
              <span className="font-mono text-[11px] uppercase tracking-wider text-terracota font-bold">
                Implementación Rápida
              </span>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-ink mt-1">
                Cómo empezar en 3 pasos.
              </h2>
              <p className="text-[15px] text-ink-muted mt-1">
                Sin proyectos extensos de TI. Puesta en marcha inmediata para despachos y centros de trabajo.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Paso 1 */}
              <div className="bg-surface-pure border border-border-base rounded p-5 flex flex-col justify-between shadow-[2px_2px_0px_#1a1a1a]">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-[11px] font-bold text-terracota uppercase">
                      PASO 01
                    </span>
                    <span className="material-symbols-outlined text-ink-muted text-[20px]">
                      account_tree
                    </span>
                  </div>
                  <h3 className="font-serif text-[18px] font-bold text-ink mb-2">
                    Mapeo de catálogo
                  </h3>
                  <p className="text-[13px] text-ink-muted leading-relaxed">
                    Envíe su catálogo de cuentas (.xls o reporte exportado de CONTPAQi) para configurar el mapeo específico de sus clientes (510-001 / 6000-01-001).
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-border-base font-mono text-[11px] text-ink font-medium">
                  Tiempo estimado: 20 minutos
                </div>
              </div>

              {/* Paso 2 */}
              <div className="bg-surface-pure border border-border-base rounded p-5 flex flex-col justify-between shadow-[2px_2px_0px_#1a1a1a]">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-[11px] font-bold text-terracota uppercase">
                      PASO 02
                    </span>
                    <span className="material-symbols-outlined text-ink-muted text-[20px]">
                      usb
                    </span>
                  </div>
                  <h3 className="font-serif text-[18px] font-bold text-ink mb-2">
                    Conexión del lector USB
                  </h3>
                  <p className="text-[13px] text-ink-muted leading-relaxed">
                    Conecte el lector USB HID NFC en recepción o taller (sin software adicional, plug-and-play listo para marcar en 5 minutos con tags adhesivos).
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-border-base font-mono text-[11px] text-ink font-medium">
                  Cero drivers o configuración local
                </div>
              </div>

              {/* Paso 3 */}
              <div className="bg-surface-pure border border-border-base rounded p-5 flex flex-col justify-between shadow-[2px_2px_0px_#1a1a1a]">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-[11px] font-bold text-terracota uppercase">
                      PASO 03
                    </span>
                    <span className="material-symbols-outlined text-ink-muted text-[20px]">
                      file_download
                    </span>
                  </div>
                  <h3 className="font-serif text-[18px] font-bold text-ink mb-2">
                    Póliza directa a CONTPAQi
                  </h3>
                  <p className="text-[13px] text-ink-muted leading-relaxed">
                    Al cierre de quincena, descargue el archivo de póliza .txt e impórtelo directamente en CONTPAQi Contabilidad sin tocar una sola celda de Excel.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-border-base font-mono text-[11px] text-ink font-medium">
                  Cuadre automático a $0.00
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 9. SECCIÓN FAQ PARA CONTADORES (INSTANTÁNEAS, CERO ANIMACIÓN) */}
        <section className="w-full py-12 md:py-16 bg-surface" id="faq">
          <div className="max-w-[1120px] mx-auto px-4 md:px-8">
            <div className="mb-8">
              <span className="font-mono text-[11px] uppercase tracking-wider text-terracota font-bold">
                Respuestas Técnicas
              </span>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-ink mt-1">
                Preguntas frecuentes de despachos y contadores.
              </h2>
              <p className="text-[15px] text-ink-muted mt-1">
                Detalles sobre interoperabilidad, aspectos fiscales, validez de juicio laboral y control de cuentas.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Q1 */}
              <div className="bg-surface-pure border border-border-base rounded p-5 shadow-[1px_1px_0px_#1a1a1a]">
                <h3 className="font-serif text-[17px] font-bold text-ink mb-2">
                  ¿Chekdor sustituye a CONTPAQi Contabilidad o Aspel NOI?
                </h3>
                <p className="text-[13px] text-ink-muted leading-relaxed">
                  No. Chekdor no timbra ni dispersa fondos. Se enfoca estrictamente en registrar la jornada legal y generar el archivo de póliza de diario listo para importar en su sistema contable actual sin recaptura.
                </p>
              </div>

              {/* Q2 */}
              <div className="bg-surface-pure border border-border-base rounded p-5 shadow-[1px_1px_0px_#1a1a1a]">
                <h3 className="font-serif text-[17px] font-bold text-ink mb-2">
                  ¿Qué sucede si el catálogo de cuentas de mi cliente usa una nomenclatura distinta?
                </h3>
                <p className="text-[13px] text-ink-muted leading-relaxed">
                  Cada cliente cuenta con su propia plantilla de mapeo de cuentas personalizable (ej. 510-001, 6000-01-001, 5000-001-001). Chekdor jamás inventa cuentas contables y respeta la estructura de su catálogo.
                </p>
              </div>

              {/* Q3 */}
              <div className="bg-surface-pure border border-border-base rounded p-5 shadow-[1px_1px_0px_#1a1a1a]">
                <h3 className="font-serif text-[17px] font-bold text-ink mb-2">
                  ¿Los trabajadores necesitan un smartphone o instalar una app móvil?
                </h3>
                <p className="text-[13px] text-ink-muted leading-relaxed">
                  No. Se utiliza un tag físico NFC NTAG213 adhesivo y un lector USB conectado a cualquier computadora en el lugar de trabajo. No requiere teléfono, plan de datos ni memoria de los empleados.
                </p>
              </div>

              {/* Q4 */}
              <div className="bg-surface-pure border border-border-base rounded p-5 shadow-[1px_1px_0px_#1a1a1a]">
                <h3 className="font-serif text-[17px] font-bold text-ink mb-2">
                  ¿Cómo garantiza la validez probatoria ante una inspección de la STPS o juicio laboral?
                </h3>
                <p className="text-[13px] text-ink-muted leading-relaxed">
                  Cada marcaje registra ID, timestamp UTC, device_id y firma hash SHA256 inmutable con políticas RLS de solo lectura. Cumple con todos los requisitos de inalterabilidad y fehaciencia exigidos por el Art. 132 fr. XXXIV de la LFT.
                </p>
              </div>

              {/* Q5 */}
              <div className="bg-surface-pure border border-border-base rounded p-5 shadow-[1px_1px_0px_#1a1a1a]">
                <h3 className="font-serif text-[17px] font-bold text-ink mb-2">
                  ¿Qué validaciones realiza el sistema antes de permitirme descargar la póliza?
                </h3>
                <p className="text-[13px] text-ink-muted leading-relaxed">
                  Ejecuta 5 controles rigurosos: cuadre estricto DEBE=HABER (tolerancia $0.00), catálogo de cuentas no vacías, fecha DD/MM/AAAA válida, sin renglones iniciales de texto y codificación UTF-8 con BOM único para evitar rechazos en CONTPAQi.
                </p>
              </div>

              {/* Q6 */}
              <div className="bg-surface-pure border border-border-base rounded p-5 shadow-[1px_1px_0px_#1a1a1a]">
                <h3 className="font-serif text-[17px] font-bold text-ink mb-2">
                  ¿Cómo se manejan las cuotas patronales del IMSS?
                </h3>
                <p className="text-[13px] text-ink-muted leading-relaxed">
                  Las cuotas patronales se calculan y generan en una póliza contable complementaria independiente para no mezclar la liquidación neta quincenal con la provisión mensual de seguridad social patronal.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 10. PILOTO & LLAMADO A LA ACCIÓN */}
        <section
          className="w-full py-12 md:py-16 bg-surface-low border-t border-border-base"
          id="contacto"
        >
          <div className="max-w-[1120px] mx-auto px-4 md:px-8">
            {/* Tarjeta Piloto Físico Celaya */}
            <div className="bg-surface-pure border border-border-base rounded p-5 md:p-6 mb-8 shadow-[2px_2px_0px_#1a1a1a]">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3 border-b border-border-base pb-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-terracota text-[22px]">
                    developer_board
                  </span>
                  <h3 className="font-semibold text-ink text-[15px] uppercase tracking-wide">
                    Roadmap Fase 1 Validación Oct-Nov 2026
                  </h3>
                </div>
                <span className="font-mono text-[10px] bg-terracota-light text-terracota-dark border border-terracota/30 px-2.5 py-0.5 rounded font-bold uppercase">
                  Fase en Curso
                </span>
              </div>
              <p className="text-[14px] text-ink leading-relaxed">
                Entrega de paquete físico con memoria USB que contiene 2 archivos deterministas (póliza de diario delimitada por pipe + CSV de incidencias y desglose) junto con hoja de validación a 2 despachos contables seleccionados en{' '}
                <strong className="text-ink">Allende 16</strong> y{' '}
                <strong className="text-ink">Pasaje Las Fuentes 311</strong>, Celaya, Guanajuato.
              </p>
              <div className="mt-3.5 flex flex-wrap gap-4 font-mono text-[11px] text-ink-muted pt-2.5 border-t border-border-base">
                <span>• Métrica de éxito: Importó a la primera sin errores de parseo</span>
                <span>• Registro de versión CONTPAQi evaluada</span>
                <span>• Ahorro de tiempo documentado en horas hombre</span>
              </div>
            </div>

            {/* Caja de Acción Piloto */}
            <div className="bg-surface-pure border border-terracota rounded p-6 md:p-8 shadow-[3px_3px_0px_#C65D3A]">
              <div className="max-w-[820px]">
                <span className="font-mono text-[11px] uppercase tracking-wider text-terracota font-bold">
                  Programa para Despachos Contables 2026-2027
                </span>
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-ink mt-1 mb-3">
                  Adelante a sus clientes a la reforma LFT y elimine la recaptura quincenal.
                </h2>
                <p className="text-[15px] text-ink-muted leading-relaxed mb-6">
                  Participe como despacho piloto. Reciba el lector USB HID NFC, configuración de catálogo para sus clientes y el motor de importación validado para CONTPAQi.
                </p>
                <div className="flex flex-wrap items-center gap-3.5 mb-6">
                  <button
                    type="button"
                    onClick={() => {
                      setPilotSubmitted(false);
                      setPilotModalOpen(true);
                    }}
                    className="inline-flex items-center justify-center bg-terracota hover:bg-terracota-dark text-white font-medium text-[14px] px-6 py-3 rounded border border-terracota shadow-[2px_2px_0px_#1a1a1a] transition-colors cursor-pointer"
                  >
                    Quiero ser despacho piloto — $1,299/mes (hasta 100 empleados)
                  </button>
                  <button
                    type="button"
                    onClick={downloadSamplePolicy}
                    className="inline-flex items-center justify-center bg-surface-pure hover:bg-surface-low text-ink font-medium text-[14px] px-5 py-3 rounded border border-border-base transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px] mr-1.5 text-ink-muted">
                      download
                    </span>
                    Descargar póliza muestra (pipe .txt)
                  </button>
                </div>

                {/* Contacto directo Omar Vieyra */}
                <div className="border-t border-border-base pt-4 flex flex-col md:flex-row md:items-center justify-between gap-3 font-mono text-[12px] text-ink-muted">
                  <div>
                    <p>
                      Contacto directo: <strong className="text-ink">Omar Vieyra</strong> ·{' '}
                      <a className="text-terracota hover:underline" href="mailto:omar@chekdor.mx">
                        omar@chekdor.mx
                      </a>
                    </p>
                    <p className="text-[11px] text-ink-muted">Celaya, Guanajuato, México</p>
                  </div>
                  <div className="text-left md:text-right">
                    <span className="inline-block bg-surface-low px-2 py-1 rounded border border-border-base text-[10px] uppercase font-mono">
                      Sin dispersión bancaria · Sin finiquitos · NOM-035 off
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER COMPLETO Y FORMAL */}
      <footer className="w-full bg-surface-low border-t border-border-base">
        <div className="max-w-[1120px] mx-auto px-4 md:px-8 py-10">
          {/* Aviso Legal & Alcance Operativo */}
          <div className="border border-border-base bg-surface-pure p-5 rounded mb-8">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-terracota text-[18px]">
                verified_user
              </span>
              <h4 className="font-mono text-[11px] uppercase tracking-wider text-ink font-bold">
                Aviso Legal &amp; Alcance Operativo
              </h4>
            </div>
            <p className="text-[13px] text-ink-muted leading-relaxed">
              Chekdor no constituye asesoría legal ni fiscal. No es PAC, no timbra CFDI de nómina, no dispersa fondos bancarios y no emite finiquitos ni NOM-035. Marca registrada en trámite. Derechos reservados 2026. Licencia local y exportación determinista.
            </p>
          </div>

          {/* Links de navegación footer */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-4 border-t border-border-base font-mono text-[12px] text-ink-muted">
            <div>
              <p>© 2026 Chekdor Sistema Determinista. Todos los derechos reservados.</p>
            </div>
            <div className="flex flex-wrap items-center gap-5">
              <button
                type="button"
                onClick={() => setLegalModalType('privacidad')}
                className="hover:text-ink transition-colors cursor-pointer"
              >
                Aviso de Privacidad
              </button>
              <button
                type="button"
                onClick={() => setLegalModalType('terminos')}
                className="hover:text-ink transition-colors cursor-pointer"
              >
                Términos y Condiciones
              </button>
              <a className="hover:text-ink transition-colors" href="#solucion">
                Documentación Técnica
              </a>
              <button
                type="button"
                onClick={() => {
                  setPilotSubmitted(false);
                  setPilotModalOpen(true);
                }}
                className="text-terracota hover:underline cursor-pointer"
              >
                Contacto Despachos
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* MODAL DE VALIDACIÓN PILOTO PARA DESPACHOS */}
      {pilotModalOpen && (
        <div className="fixed inset-0 z-50 bg-ink/50 flex items-center justify-center p-4">
          <div className="bg-surface-pure border border-ink rounded max-w-lg w-full p-6 shadow-[4px_4px_0px_#1a1a1a]">
            <div className="flex items-center justify-between border-b border-border-base pb-3 mb-4">
              <div>
                <span className="font-mono text-[10px] uppercase text-terracota font-bold">
                  Fase 1 · Celaya &amp; Bajío
                </span>
                <h3 className="font-serif text-xl font-bold text-ink">
                  Registro de Despacho Piloto
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setPilotModalOpen(false)}
                className="font-mono text-xs text-ink-muted hover:text-ink px-2 py-1 border border-border-base rounded cursor-pointer"
              >
                ESC / Cerrar
              </button>
            </div>

            {pilotSubmitted ? (
              <div className="space-y-4">
                <div className="bg-status-green-bg border border-status-green-border p-4 rounded text-status-green">
                  <p className="font-mono text-xs font-bold uppercase mb-1">
                    ✓ Solicitud de Validación Registrada
                  </p>
                  <p className="text-[13px] text-ink">
                    Se ha generado la orden de paquete piloto para{' '}
                    <strong>{pilotForm.despacho || 'su despacho'}</strong> ({pilotForm.versionContpaqi}). Omar Vieyra enviará el archivo de prueba ajustado a su catálogo de cuentas a{' '}
                    <span className="font-mono">{pilotForm.correo}</span>.
                  </p>
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={downloadSamplePolicy}
                    className="bg-surface-low hover:bg-border-base text-ink font-mono text-xs px-4 py-2 rounded border border-border-base cursor-pointer"
                  >
                    Descargar POLIZA_MUESTRA.TXT
                  </button>
                  <button
                    type="button"
                    onClick={() => setPilotModalOpen(false)}
                    className="bg-terracota hover:bg-terracota-dark text-white font-mono text-xs px-4 py-2 rounded border border-terracota cursor-pointer"
                  >
                    Entendido
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handlePilotSubmit} className="space-y-3.5 text-[13px]">
                <div>
                  <label className="block font-mono text-[11px] uppercase text-ink-muted mb-1">
                    Nombre del Despacho Contable
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Despacho Contable Vieyra & Asociados"
                    value={pilotForm.despacho}
                    onChange={(e) => setPilotForm({ ...pilotForm, despacho: e.target.value })}
                    className="w-full bg-surface-pure border border-border-base focus:border-terracota outline-none px-3 py-2 rounded text-ink"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-mono text-[11px] uppercase text-ink-muted mb-1">
                      Contador Responsable
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="C.P. Nombre Apellido"
                      value={pilotForm.contador}
                      onChange={(e) => setPilotForm({ ...pilotForm, contador: e.target.value })}
                      className="w-full bg-surface-pure border border-border-base focus:border-terracota outline-none px-3 py-2 rounded text-ink"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[11px] uppercase text-ink-muted mb-1">
                      Correo de Contacto
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="contador@despacho.mx"
                      value={pilotForm.correo}
                      onChange={(e) => setPilotForm({ ...pilotForm, correo: e.target.value })}
                      className="w-full bg-surface-pure border border-border-base focus:border-terracota outline-none px-3 py-2 rounded text-ink"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-mono text-[11px] uppercase text-ink-muted mb-1">
                      Versión CONTPAQi
                    </label>
                    <select
                      value={pilotForm.versionContpaqi}
                      onChange={(e) =>
                        setPilotForm({ ...pilotForm, versionContpaqi: e.target.value })
                      }
                      className="w-full bg-surface-pure border border-border-base focus:border-terracota outline-none px-3 py-2 rounded text-ink font-mono text-xs"
                    >
                      <option>CONTPAQi v17</option>
                      <option>CONTPAQi v16</option>
                      <option>CONTPAQi v15</option>
                      <option>CONTPAQi v14</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-mono text-[11px] uppercase text-ink-muted mb-1">
                      Volumen a Evaluar
                    </label>
                    <select
                      value={pilotForm.empleados}
                      onChange={(e) => setPilotForm({ ...pilotForm, empleados: e.target.value })}
                      className="w-full bg-surface-pure border border-border-base focus:border-terracota outline-none px-3 py-2 rounded text-ink font-mono text-xs"
                    >
                      <option>1 - 25 empleados</option>
                      <option>25 - 100 empleados ($1,299/mes)</option>
                      <option>+100 empleados (Multi-RFC)</option>
                    </select>
                  </div>
                </div>
                <div className="pt-2 flex items-center justify-between gap-3">
                  <a
                    href="mailto:omar@chekdor.mx?subject=Quiero%20ser%20despacho%20piloto%20Chekdor"
                    className="font-mono text-[11px] text-terracota hover:underline"
                  >
                    O escribir directo a omar@chekdor.mx
                  </a>
                  <button
                    type="submit"
                    className="bg-terracota hover:bg-terracota-dark text-white font-semibold px-5 py-2.5 rounded border border-terracota shadow-[2px_2px_0px_#1a1a1a] cursor-pointer"
                  >
                    Solicitar Kit Piloto USB
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL DE AVISO DE PRIVACIDAD / TÉRMINOS */}
      {legalModalType && (
        <div className="fixed inset-0 z-50 bg-ink/50 flex items-center justify-center p-4">
          <div className="bg-surface-pure border border-ink rounded max-w-lg w-full p-6 shadow-[4px_4px_0px_#1a1a1a]">
            <div className="flex items-center justify-between border-b border-border-base pb-3 mb-4">
              <h3 className="font-serif text-lg font-bold text-ink">
                {legalModalType === 'privacidad'
                  ? 'Aviso de Privacidad · Chekdor'
                  : 'Términos de Uso y Alcance Técnico'}
              </h3>
              <button
                type="button"
                onClick={() => setLegalModalType(null)}
                className="font-mono text-xs text-ink-muted hover:text-ink px-2 py-1 border border-border-base rounded cursor-pointer"
              >
                Cerrar
              </button>
            </div>
            <div className="text-[13px] text-ink-muted space-y-3 leading-relaxed">
              {legalModalType === 'privacidad' ? (
                <>
                  <p>
                    Chekdor opera bajo arquitectura local y políticas de retención estrictamente apegadas al Art. 804 y Art. 132 fr. XXXIV de la Ley Federal del Trabajo.
                  </p>
                  <p>
                    Los registros de marcaje NFC (UID de fábrica, marca de tiempo UTC ISO8601 y hash SHA256) no recolectan datos biométricos sensibles (huella dactilar ni reconocimiento facial), simplificando el cumplimiento de la LFPDPPP en centros de trabajo.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    El software @chekdor/motor y @chekdor/serializadores provee cálculo determinista local y exportación de archivos de texto (.txt / .csv) con codificación UTF-8 con BOM para importación en sistemas contables.
                  </p>
                  <p>
                    Chekdor no es PAC, no timbra CFDI de nómina, no dispersa recursos bancarios y no sustituye la revisión final del contador público responsable de cada contribuyente.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
