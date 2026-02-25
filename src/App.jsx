import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Phone, ArrowRight, MousePointer2, Check, Languages } from 'lucide-react';
import { translations, getStoredLocale, setStoredLocale, getTranslation } from './translations';
import GlassSurface from './components/GlassSurface';

gsap.registerPlugin(ScrollTrigger);

// Performance: reduce scroll-driven work on (especially mobile) devices
ScrollTrigger.config({
  limitCallbacks: true,
  ignoreMobileResize: true,
});
// Optional: uncomment if scroll still lags on iOS — uses JS-based scroll (smoother but different feel)
// ScrollTrigger.normalizeScroll(true);

const isMobileOrTouch = () =>
  typeof window !== 'undefined' &&
  (window.matchMedia('(max-width: 768px)').matches || 'ontouchstart' in window);

// --- LANGUAGE CONTEXT ---

const LanguageContext = createContext(null);

function useTranslation() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useTranslation must be used within LanguageProvider');
  return ctx;
}

function LanguageProvider({ children }) {
  const [locale, setLocaleState] = useState(getStoredLocale);

  const setLocale = (next) => {
    if (next !== 'en' && next !== 'nl') return;
    setLocaleState(next);
    setStoredLocale(next);
  };

  const t = (key) => getTranslation(locale, key);

  useEffect(() => {
    document.title = getTranslation(locale, 'meta.title');
  }, [locale]);

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

// --- NAVBAR & HERO ---

const Navbar = () => {
  const containerRef = useRef(null);
  const { t, locale, setLocale } = useTranslation();
  const [scrolled, setScrolled] = useState(false);

  const navItems = [
    { key: 'nav.features', href: '#features' },
    { key: 'nav.philosophy', href: '#philosophy' },
    { key: 'nav.protocol', href: '#protocol' },
    { key: 'nav.pricing', href: '#pricing' },
  ];

  useEffect(() => {
    const st = ScrollTrigger.create({
      start: 'top -50',
      end: 99999,
      onToggle: (self) => setScrolled(self.isActive),
    });
    return () => st.kill();
  }, []);

  return (
    <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <div ref={containerRef} className="relative w-full max-w-5xl pointer-events-auto rounded-[2rem]">
        {/* Glass background layer — fades in on scroll */}
        <div
          className={`absolute inset-0 rounded-[2rem] overflow-hidden transition-opacity duration-300 ${scrolled ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
          <GlassSurface
            width="100%"
            height="100%"
            borderRadius={32}
            brightness={50}
            opacity={0.93}
            blur={11}
            backgroundOpacity={0.1}
            saturation={1}
            borderWidth={0.07}
            distortionScale={-180   }
            style={{ boxShadow: '0 4px 30px rgba(0,0,0,0.06)' }}
          />
        </div>

        {/* Nav content */}
        <nav className={`relative z-10 flex items-center justify-between px-6 py-4 transition-colors duration-300 ${scrolled ? 'text-dark' : 'text-primary'}`}>
          <div className="font-heading font-bold tracking-tight text-xl link-lift cursor-pointer text-inherit">
            {t('nav.brand')}
          </div>
          
          <div className="hidden md:flex gap-8 font-heading text-sm font-medium text-inherit">
            {navItems.map(({ key, href }) => (
              <a key={key} href={href} className="link-lift cursor-pointer hover:text-accent transition-colors">
                {t(key)}
              </a>
            ))}
          </div>
          
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setLocale(locale === 'en' ? 'nl' : 'en')}
              className="flex items-center gap-2 font-heading text-sm font-medium text-inherit hover:text-accent transition-colors bg-transparent border-none cursor-pointer px-3 py-2 rounded-full hover:bg-primary/10"
              title={locale === 'en' ? 'Switch to Dutch' : 'Switch to English'}
              aria-label={locale === 'en' ? 'Switch to Dutch' : 'Switch to English'}
            >
              <Languages size={18} />
              <span>{locale === 'en' ? 'NL' : 'EN'}</span>
            </button>
            <button className="bg-accent text-background px-6 py-2.5 rounded-full font-heading font-bold text-sm btn-magnetic flex items-center gap-2 border-none">
              <span>{t('nav.whatsapp')}</span>
              <Phone size={16} />
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
};

const Hero = () => {
  const heroRef = useRef(null);
  const { t } = useTranslation();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.hero-reveal',
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.15,
          ease: 'power3.out',
          delay: 0.2,
        }
      );
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="relative w-full h-[100dvh] flex items-end pb-24 px-6 md:px-16 overflow-hidden bg-dark">
      <div className="absolute inset-0 z-0 bg-dark">
        <img 
          src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&q=80" 
          alt={t('hero.imageAlt')} 
          className="w-full h-full object-cover opacity-60 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/80 to-primary/20 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-dark/95 to-transparent"></div>
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-start gap-6">
        <h1 className="flex flex-col text-primary leading-[0.9]">
          <span className="hero-reveal font-heading font-bold text-4xl md:text-6xl tracking-tight uppercase">
            {t('hero.title1')}
          </span>
          <span className="hero-reveal font-drama italic text-[6rem] md:text-[10rem] tracking-tighter pr-4 -mt-4 md:-mt-8 text-primary drop-shadow-xl">
            {t('hero.title2')}
          </span>
        </h1>
        
        <p className="hero-reveal font-data text-primary/80 max-w-md text-sm md:text-base leading-relaxed">
          {t('hero.subtitle')}
        </p>

        <div className="hero-reveal mt-4">
          <button className="bg-accent text-background px-8 py-4 rounded-full font-heading font-bold text-lg btn-magnetic flex items-center gap-3 border-none">
            <span>{t('hero.cta')}</span>
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
};


// --- FEATURE COMPONENTS ---

const DiagnosticShuffler = () => {
    const { t, locale } = useTranslation();
    const rawCards = t('features.diagnosticShuffler.cards') || [];
    const [cards, setCards] = useState(() => rawCards.map((c, i) => ({ ...c, id: i })));
    const containerRef = useRef(null);

    useEffect(() => {
        const next = getTranslation(locale, 'features.diagnosticShuffler.cards') || [];
        setCards(next.map((c, i) => ({ ...c, id: i })));
    }, [locale]);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        let intervalId = null;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    intervalId = setInterval(() => {
                        setCards(prev => {
                            const newCards = [...prev];
                            const last = newCards.pop();
                            newCards.unshift(last);
                            return newCards;
                        });
                    }, 3000);
                } else {
                    if (intervalId) clearInterval(intervalId);
                    intervalId = null;
                }
            },
            { threshold: 0.2 }
        );
        observer.observe(el);
        return () => {
            observer.disconnect();
            if (intervalId) clearInterval(intervalId);
        };
    }, []);

    const ds = t('features.diagnosticShuffler') || {};

    return (
        <div ref={containerRef} className="h-full flex flex-col justify-between p-8">
            <div>
                <h3 className="font-heading font-bold text-xl mb-2">{ds.title}</h3>
                <p className="font-data text-xs text-dark/60 uppercase tracking-widest">{ds.subtitle}</p>
            </div>
            
            <div className="relative h-48 w-full mt-8 flex items-end justify-center perspective-1000">
                {cards.map((card, index) => {
                    const translateY = index * 12;
                    const scale = 1 - (index * 0.05);
                    const zIndex = 3 - index;
                    const opacity = 1 - (index * 0.2);
                    
                    return (
                        <div 
                            key={card.id}
                            className={`absolute w-full max-w-[240px] rounded-[1.5rem] p-6 flex flex-col items-center justify-center border border-dark/10 shadow-lg transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${card.color}`}
                            style={{
                                transform: `translateY(-${translateY}px) scale(${scale})`,
                                zIndex,
                                opacity
                            }}
                        >
                            <span className="font-data text-xs opacity-80 mb-1">{card.label}</span>
                            <span className="font-heading font-bold text-4xl">{card.value}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const TelemetryTypewriter = () => {
    const { t } = useTranslation();
    const tt = t('features.telemetryTypewriter') || {};
    const fullText = tt.fullText || '';
    const [text, setText] = useState("");
    const containerRef = useRef(null);
    const iRef = useRef(0);
    const isVisibleRef = useRef(false);
    const [restart, setRestart] = useState(0);

    useEffect(() => {
        iRef.current = 0;
    }, [fullText]);

    useEffect(() => {
        const el = containerRef.current;
        if (!el || !fullText) return;
        let intervalId = null;
        const observer = new IntersectionObserver(
            ([entry]) => {
                isVisibleRef.current = entry.isIntersecting;
                if (!entry.isIntersecting) {
                    if (intervalId) clearInterval(intervalId);
                    intervalId = null;
                    return;
                }
                const intervalMs = isMobileOrTouch() ? 100 : 50;
                intervalId = setInterval(() => {
                    const i = iRef.current;
                    if (i <= fullText.length) {
                        setText(fullText.slice(0, i));
                        iRef.current = i + 1;
                    } else {
                        clearInterval(intervalId);
                        intervalId = null;
                        setTimeout(() => {
                            iRef.current = 0;
                            setText("");
                            setRestart(r => r + 1);
                        }, 5000);
                    }
                }, intervalMs);
            },
            { threshold: 0.2 }
        );
        observer.observe(el);
        return () => {
            observer.disconnect();
            if (intervalId) clearInterval(intervalId);
        };
    }, [fullText]);

    useEffect(() => {
        if (!fullText || restart === 0 || !isVisibleRef.current) return;
        const el = containerRef.current;
        if (!el) return;
        let intervalId = null;
        const intervalMs = isMobileOrTouch() ? 100 : 50;
        intervalId = setInterval(() => {
            const i = iRef.current;
            if (i <= fullText.length) {
                setText(fullText.slice(0, i));
                iRef.current = i + 1;
            } else {
                clearInterval(intervalId);
                intervalId = null;
                setTimeout(() => {
                    iRef.current = 0;
                    setText("");
                    setRestart(r => r + 1);
                }, 5000);
            }
        }, intervalMs);
        return () => { if (intervalId) clearInterval(intervalId); };
    }, [fullText, restart]);

    return (
        <div ref={containerRef} className="h-full flex flex-col p-8">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="font-heading font-bold text-xl mb-2">{tt.title}</h3>
                    <p className="font-data text-xs text-dark/60 uppercase tracking-widest">{tt.subtitle}</p>
                </div>
                <div className="flex items-center gap-2 bg-dark/5 px-3 py-1.5 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
                    <span className="font-data text-[10px] font-bold tracking-wider">{tt.liveFeed}</span>
                </div>
            </div>
            
            <div className="bg-dark text-primary p-6 rounded-[1.5rem] flex-grow font-data text-sm leading-relaxed overflow-hidden relative border border-primary/10 flex flex-col">
                <div className="opacity-40 text-xs mb-4 select-none border-b border-primary/20 pb-2 shrink-0">
                    {tt.systemLine1}<br/>
                    {tt.systemLine2}<br/>
                    {tt.systemLine3}
                </div>
                <p className="flex-grow">
                    {text}
                    <span className="inline-block w-2 h-4 bg-accent ml-1 animate-pulse align-middle"></span>
                </p>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent h-[10%] animate-[scan_4s_linear_infinite] pointer-events-none"></div>
            </div>
            <style>{`
                @keyframes scan {
                    0% { top: -10%; }
                    100% { top: 110%; }
                }
            `}</style>
        </div>
    );
};

const ProtocolScheduler = () => {
    const { t } = useTranslation();
    const ps = t('features.protocolScheduler') || {};
    const days = ps.days || ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const gridRef = useRef(null);
    const cursorRef = useRef(null);
    const btnRef = useRef(null);
    const timelineRef = useRef(null);
    const observerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ repeat: -1, repeatDelay: 1, paused: true });
            timelineRef.current = tl;

            tl.set(cursorRef.current, { x: 50, y: 150, opacity: 0 });

            tl.to(cursorRef.current, { x: -30, y: 0, opacity: 1, duration: 1, ease: "power2.inOut" })
              .to(cursorRef.current, { scale: 0.8, duration: 0.1 })
              .to('.cell-2', { backgroundColor: '#E63B2E', color: '#F5F3EE', duration: 0.2 }, "<")
              .to(cursorRef.current, { scale: 1, duration: 0.1 })

              .to(cursorRef.current, { x: 130, y: 0, duration: 0.8, ease: "power2.inOut", delay: 0.3 })
              .to(cursorRef.current, { scale: 0.8, duration: 0.1 })
              .to('.cell-6', { backgroundColor: '#E63B2E', color: '#F5F3EE', duration: 0.2 }, "<")
              .to(cursorRef.current, { scale: 1, duration: 0.1 })

              .to(cursorRef.current, { x: 50, y: 60, duration: 0.8, ease: "power2.inOut", delay: 0.3 })
              .to(cursorRef.current, { scale: 0.8, duration: 0.1 })
              .to(btnRef.current, { scale: 0.95, duration: 0.1 }, "<")
              .to(btnRef.current, { scale: 1, duration: 0.1 })
              .to(cursorRef.current, { scale: 1, duration: 0.1 })

              .to(cursorRef.current, { opacity: 0, duration: 0.5, delay: 0.5 })

              .set('.cell-2', { backgroundColor: 'rgba(17, 17, 17, 0.05)', color: '#111111' })
              .set('.cell-6', { backgroundColor: 'rgba(17, 17, 17, 0.05)', color: '#111111' });

            const el = gridRef.current;
            if (el) {
                const observer = new IntersectionObserver(
                    ([entry]) => {
                        if (timelineRef.current) {
                            if (entry.isIntersecting) timelineRef.current.play();
                            else timelineRef.current.pause();
                        }
                    },
                    { threshold: 0.2 }
                );
                observerRef.current = observer;
                observer.observe(el);
                if (el.getBoundingClientRect().top < window.innerHeight) tl.play();
            }
        }, gridRef);
        return () => {
            timelineRef.current = null;
            if (observerRef.current) {
                observerRef.current.disconnect();
                observerRef.current = null;
            }
            ctx.revert();
        };
    }, []);

    return (
        <div className="h-full flex flex-col p-8">
            <div className="mb-8 shrink-0">
                <h3 className="font-heading font-bold text-xl mb-2">{ps.title}</h3>
                <p className="font-data text-xs text-dark/60 uppercase tracking-widest">{ps.subtitle}</p>
            </div>
            
            <div ref={gridRef} className="flex-grow flex flex-col items-center justify-center relative">
                <div 
                    ref={cursorRef} 
                    className="absolute z-20 pointer-events-none text-dark filter drop-shadow-md"
                    style={{ left: '50%', top: '30%', transform: 'translate(-50%, -50%)' }}
                >
                    <MousePointer2 fill="#111111" stroke="white" strokeWidth="2" size={28} className="rotate-[-20deg]" />
                </div>

                <div className="w-full max-w-[280px]">
                    <div className="flex justify-between mb-2 px-1">
                        <span className="font-heading font-bold text-sm">{ps.nextWeek}</span>
                        <span className="font-data text-xs text-accent">{ps.eveningWknd}</span>
                    </div>
                    
                    <div className="grid grid-cols-7 gap-2 mb-6">
                        {days.map((day, i) => (
                            <div 
                                key={i} 
                                className={`cell-${i} aspect-square rounded-lg flex items-center justify-center font-data text-xs font-bold transition-colors bg-dark/5 text-dark border border-dark/10`}
                            >
                                {day}
                            </div>
                        ))}
                    </div>
                    
                    <button ref={btnRef} className="w-full py-3 rounded-xl bg-dark text-primary font-heading font-bold text-sm">
                        {ps.confirmSlots}
                    </button>
                </div>
            </div>
        </div>
    );
};

const Features = () => {
    const { t } = useTranslation();
    return (
        <section id="features" className="py-32 px-6 md:px-16 bg-background relative z-10">
            <div className="max-w-6xl mx-auto">
                <div className="mb-16">
                    <h2 className="font-heading font-bold text-4xl tracking-tight mb-4">{t('features.title')}</h2>
                    <p className="font-data text-dark/60 max-w-lg">{t('features.subtitle')}</p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="bg-background card-radius border border-dark/10 shadow-sm h-[400px] overflow-hidden group hover:border-dark/20 transition-colors">
                        <DiagnosticShuffler />
                    </div>
                    <div className="bg-background card-radius border border-dark/10 shadow-sm h-[400px] overflow-hidden group hover:border-dark/20 transition-colors">
                        <TelemetryTypewriter />
                    </div>
                    <div className="bg-background card-radius border border-dark/10 shadow-sm h-[400px] overflow-hidden group hover:border-dark/20 transition-colors">
                        <ProtocolScheduler />
                    </div>
                </div>
            </div>
        </section>
    );
};


// --- PHILOSOPHY ---

const Philosophy = () => {
    const textRef = useRef(null);
    const bgRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const mobile = isMobileOrTouch();
            // Parallax background — on mobile use scrub: 2 to update less often and reduce scroll lag
            gsap.to(bgRef.current, {
                yPercent: mobile ? 15 : 30,
                ease: 'none',
                scrollTrigger: {
                    trigger: textRef.current,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: mobile ? 2 : true
                }
            });

            // Reveal text
            const words = gsap.utils.toArray('.reveal-word');
            gsap.fromTo(words, 
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    stagger: 0.05,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: textRef.current,
                        start: 'top 80%',
                    }
                }
            );
        }, textRef);
        return () => ctx.revert();
    }, []);

    const { t } = useTranslation();
    const phrase1 = t('philosophy.phrase1') || '';
    const phrase2Words = t('philosophy.phrase2Words') || [];
    const imageAlt = t('philosophy.imageAlt') || '';

    return (
        <section ref={textRef} id="philosophy" className="relative w-full py-40 px-6 md:px-16 bg-dark text-primary overflow-hidden card-radius mx-2 md:mx-4 my-8">
            <div className="absolute inset-0 z-0 opacity-10 pointer-events-none overflow-hidden">
                <img 
                    ref={bgRef}
                    src="https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&q=80" 
                    alt={imageAlt} 
                    className="w-full h-[130%] object-cover -top-[15%]"
                />
            </div>
            
            <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col gap-12">
                <p className="font-heading text-lg md:text-xl text-primary/60 max-w-2xl leading-relaxed">
                    {phrase1.split(' ').map((word, i) => (
                        <span key={i} className="reveal-word inline-block mr-2">{word}</span>
                    ))}
                </p>
                <h2 className="font-drama italic text-5xl md:text-7xl leading-tight">
                    {phrase2Words.map((item, i) => (
                        <span 
                            key={i} 
                            className={`reveal-word inline-block mr-3 md:mr-4 ${item.accent ? 'text-accent' : 'text-primary'}`}
                        >
                            {item.text}
                        </span>
                    ))}
                </h2>
            </div>
        </section>
    );
};


// --- PROTOCOL (STICKY STACKING) ---

const ProtocolCard = ({ stepLabel, step, title, desc, animType, index, total }) => {
    return (
        <div className={`protocol-card sticky top-0 w-full h-[100dvh] flex items-center justify-center p-6 bg-background origin-top card-${index}`}>
            <div className="w-full max-w-6xl h-[80vh] md:h-[70vh] bg-primary rounded-[3rem] border border-dark/10 p-8 md:p-16 flex flex-col md:flex-row gap-12 shadow-2xl relative overflow-hidden">
                
                <div className="flex-1 flex flex-col justify-center z-10 relative">
                    <span className="font-data text-accent font-bold text-lg mb-6">{stepLabel} {step}</span>
                    <h2 className="font-heading font-bold text-5xl md:text-7xl tracking-tight mb-6 text-dark">{title}</h2>
                    <p className="font-data text-dark/70 text-base md:text-lg max-w-md leading-relaxed">{desc}</p>
                </div>
                
                <div className="flex-1 relative flex items-center justify-center bg-dark/5 rounded-[2rem] overflow-hidden">
                    {animType === 'geometric' && (
                        <div className="w-64 h-64 border-4 border-dark/20 rounded-full flex items-center justify-center animate-[spin_20s_linear_infinite]">
                            <div className="w-48 h-48 border-4 border-dark/40 rounded-full flex items-center justify-center border-dashed">
                                <div className="w-32 h-32 border-4 border-accent rounded-sm rotate-45 animate-[spin_10s_linear_infinite_reverse]"></div>
                            </div>
                        </div>
                    )}
                    
                    {animType === 'laser' && (
                        <div className="w-full h-full p-8 flex flex-col justify-center gap-4 relative">
                            {Array.from({length: 6}).map((_, i) => (
                                <div key={i} className="w-full h-2 bg-dark/10 rounded-full overflow-hidden relative"></div>
                            ))}
                            <div className="absolute top-0 bottom-0 left-0 w-1 bg-accent shadow-[0_0_15px_#E63B2E] animate-[scanLine_3s_ease-in-out_infinite_alternate]"></div>
                        </div>
                    )}
                    
                    {animType === 'waveform' && (
                        <svg className="w-full h-full text-accent p-8 drop-shadow-xl" viewBox="0 0 100 50" preserveAspectRatio="none">
                            <path 
                                d="M 0 25 L 20 25 L 25 10 L 35 45 L 45 5 L 55 35 L 60 25 L 100 25" 
                                fill="none" 
                                stroke="currentColor" 
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="dash-anim"
                            />
                        </svg>
                    )}
                </div>
            </div>
            
            <style>{`
                @keyframes scanLine {
                    0% { left: 10%; }
                    100% { left: 90%; }
                }
                .dash-anim {
                    stroke-dasharray: 200;
                    stroke-dashoffset: 200;
                    animation: dash 3s linear infinite;
                }
                @keyframes dash {
                    to { stroke-dashoffset: 0; }
                }
            `}</style>
        </div>
    );
};

const Protocol = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const cards = gsap.utils.toArray('.protocol-card');
            const mobile = isMobileOrTouch();
            // filter: blur() is very expensive on mobile and causes scroll lag — skip on touch/mobile
            const scrubVal = mobile ? 1.5 : true;

            cards.forEach((card, index) => {
                if (index === cards.length - 1) return;

                ScrollTrigger.create({
                    trigger: card,
                    start: 'top top',
                    endTrigger: '.protocol-wrapper',
                    end: 'bottom bottom',
                    pin: true,
                    pinSpacing: false,
                });

                gsap.to(card, {
                    scale: 0.9,
                    opacity: 0.5,
                    ...(mobile ? {} : { filter: 'blur(10px)' }),
                    ease: 'none',
                    scrollTrigger: {
                        trigger: cards[index + 1],
                        start: 'top bottom',
                        end: 'top top',
                        scrub: scrubVal,
                    }
                });
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    const { t } = useTranslation();
    const protocolData = t('protocol') || {};
    const steps = protocolData.steps || [];
    const stepLabel = protocolData.stepLabel || 'STEP';

    return (
        <section id="protocol" className="protocol-wrapper relative w-full bg-background" ref={containerRef}>
            <div className="pt-32 pb-16 px-6 md:px-16 max-w-6xl mx-auto">
                <h2 className="font-heading font-bold text-4xl tracking-tight mb-4">{protocolData.title}</h2>
                <p className="font-data text-dark/60 max-w-lg">{protocolData.subtitle}</p>
            </div>
            
            <div className="relative w-full pb-[10vh]">
                {steps.map((s, i) => (
                    <ProtocolCard key={i} stepLabel={stepLabel} {...s} index={i} total={steps.length} />
                ))}
            </div>
        </section>
    );
};


// --- PRICING ---

const Pricing = () => {
    const { t } = useTranslation();
    const pricingData = t('pricing') || {};
    const plans = pricingData.plans || [];
    const optimalPath = pricingData.optimalPath || 'OPTIMAL PATH';

    return (
        <section id="pricing" className="py-32 px-6 md:px-16 bg-background relative z-10">
            <div className="max-w-6xl mx-auto">
                <div className="mb-16 text-center">
                    <h2 className="font-heading font-bold text-4xl tracking-tight mb-4">{pricingData.title}</h2>
                    <p className="font-data text-dark/60 max-w-lg mx-auto">{pricingData.subtitle}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                    {plans.map((plan, i) => (
                        <div 
                            key={i} 
                            className={`p-8 rounded-[2.5rem] border ${
                                plan.isPopular 
                                    ? 'bg-primary border-accent/20 shadow-2xl scale-100 md:scale-105 z-10 ring-4 ring-dark/5' 
                                    : 'bg-background border-dark/10 shadow-sm hover:border-dark/20'
                            } transition-colors duration-300`}
                        >
                            {plan.isPopular && (
                                <div className="mb-4">
                                    <span className="bg-accent text-background text-[10px] font-data font-bold px-3 py-1 rounded-full tracking-widest uppercase">
                                        {optimalPath}
                                    </span>
                                </div>
                            )}
                            <h3 className="font-heading font-bold text-2xl mb-2 text-dark">{plan.name}</h3>
                            <p className="font-data text-xs text-dark/60 mb-6 h-8">{plan.desc}</p>
                            
                            <div className="mb-8">
                                <span className="font-heading font-bold text-5xl">{plan.price}</span>
                                <span className="font-data text-sm text-dark/50 ml-2">{plan.unit}</span>
                            </div>
                            
                            <ul className="mb-8 space-y-4">
                                {plan.features.map((feature, j) => (
                                    <li key={j} className="flex items-start gap-3">
                                        <Check size={18} className={plan.isPopular ? 'text-accent mt-0.5' : 'text-dark/40 mt-0.5'} />
                                        <span className="font-data text-sm text-dark/80">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            
                            <button 
                                className={`w-full py-4 rounded-full font-heading font-bold text-sm transition-transform hover:scale-[1.02] ${
                                    plan.isPopular 
                                        ? 'bg-accent text-background hover:bg-accent/90' 
                                        : 'bg-dark/5 text-dark hover:bg-dark hover:text-primary'
                                }`}
                            >
                                {plan.cta}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};


// --- FOOTER ---

const Footer = () => {
    const { t } = useTranslation();
    const footer = t('footer') || {};
    return (
        <footer className="bg-dark text-primary rounded-t-[4rem] pt-24 pb-8 px-6 md:px-16 mt-20 relative overflow-hidden">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-12 mb-20">
                <div className="flex-1">
                    <h2 className="font-heading font-bold text-3xl tracking-tight mb-4 text-primary">{footer.brand}</h2>
                    <p className="font-data text-sm text-primary/60 max-w-sm leading-relaxed mb-8">
                        {footer.tagline}
                    </p>
                    
                    <button className="bg-primary/10 hover:bg-primary/20 text-primary px-6 py-3 rounded-full font-heading font-bold text-sm transition-colors flex items-center gap-2">
                        <span>{footer.contactSupport}</span>
                        <ArrowRight size={16} />
                    </button>
                </div>
                
                <div className="flex gap-12 md:gap-24 font-data text-sm">
                    <div className="flex flex-col gap-4">
                        <span className="font-bold text-primary/40 uppercase tracking-widest mb-2">{footer.navigation}</span>
                        <a href="#features" className="hover:text-accent transition-colors link-lift">{footer.features}</a>
                        <a href="#philosophy" className="hover:text-accent transition-colors link-lift">{footer.philosophy}</a>
                        <a href="#protocol" className="hover:text-accent transition-colors link-lift">{footer.protocol}</a>
                        <a href="#pricing" className="hover:text-accent transition-colors link-lift">{footer.pricing}</a>
                    </div>
                    
                    <div className="flex flex-col gap-4">
                        <span className="font-bold text-primary/40 uppercase tracking-widest mb-2">{footer.legal}</span>
                        <a href="#" className="hover:text-accent transition-colors link-lift">{footer.termsOfService}</a>
                        <a href="#" className="hover:text-accent transition-colors link-lift">{footer.privacyPolicy}</a>
                        <a href="#" className="hover:text-accent transition-colors link-lift">{footer.cookieProtocol}</a>
                    </div>
                </div>
            </div>
            
            <div className="max-w-6xl mx-auto pt-8 border-t border-primary/10 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="font-data text-xs text-primary/40">
                    &copy; {new Date().getFullYear()} {footer.copyright}
                </p>
                
                <div className="flex items-center gap-3 bg-primary/5 px-4 py-2 rounded-full border border-primary/10">
                    <div className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                    </div>
                    <span className="font-data text-xs font-bold tracking-wider text-primary/80 uppercase">
                        {footer.systemOperational}
                    </span>
                </div>
            </div>
        </footer>
    );
};


// --- MAIN APP ---

function App() {
  return (
    <LanguageProvider>
      <div className="bg-background text-dark min-h-screen">
        <Navbar />
        <Hero />
        <Features />
        <Philosophy />
        <Protocol />
        <Pricing />
        <Footer />
      </div>
    </LanguageProvider>
  );
}

export default App;