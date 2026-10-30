import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { amenities, facts, faqs, heroImage, photos, WHATSAPP_DISPLAY, WHATSAPP_URL } from "@/content/site";

const TITLE = "Golondrinas Campo · Casa de campo en Brandsen";
const DESC =
  "Casa de campo en Brandsen, Buenos Aires, para hasta 8 huéspedes: pileta, laguna, cancha de tenis y mucho verde. Consultá disponibilidad por WhatsApp.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

const nav = [
  { href: "#experiencia", label: "Experiencia" },
  { href: "#galeria", label: "Galería" },
  { href: "#comodidades", label: "Comodidades" },
  { href: "#ubicacion", label: "Ubicación" },
  { href: "#preguntas", label: "Preguntas" },
];

function BookLink({ variant = "primary", children = "Consultar disponibilidad" }: { variant?: "primary" | "light"; children?: React.ReactNode }) {
  return (
    <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className={variant === "light" ? "btn-light" : "btn-primary"}>
      {children}
      <span aria-hidden>→</span>
      <span className="sr-only">(se abre WhatsApp en una pestaña nueva)</span>
    </a>
  );
}

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("is-visible")),
      { threshold: 0.15 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on);
    return () => window.removeEventListener("scroll", on);
  }, []);
  const solid = scrolled || open;
  return (
    <header className={`fixed inset-x-0 top-0 z-40 transition-colors duration-500 ${solid ? "bg-background/95 text-foreground shadow-sm backdrop-blur" : "text-on-photo"}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
        <a href="#inicio" className="font-display text-2xl tracking-wide">Golondrinas <em>Campo</em></a>
        <nav aria-label="Principal" className="hidden items-center gap-8 lg:flex">
          {nav.map((n) => (
            <a key={n.href} href={n.href} className="eyebrow opacity-80 transition-opacity hover:opacity-100">{n.label}</a>
          ))}
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className={`eyebrow rounded-full border px-5 py-2.5 transition-colors ${solid ? "border-primary hover:bg-primary hover:text-primary-foreground" : "border-on-photo/60 hover:bg-on-photo hover:text-foreground"}`}>Reservar</a>
        </nav>
        <button className="eyebrow lg:hidden" aria-expanded={open} aria-controls="menu-movil" onClick={() => setOpen(!open)}>
          {open ? "Cerrar" : "Menú"}
        </button>
      </div>
      {open && (
        <nav id="menu-movil" aria-label="Móvil" className="border-t bg-background px-6 pb-8 pt-4 lg:hidden">
          <ul className="flex flex-col gap-5">
            {nav.map((n) => (
              <li key={n.href}><a href={n.href} onClick={() => setOpen(false)} className="font-display text-3xl">{n.label}</a></li>
            ))}
          </ul>
          <div className="mt-8"><BookLink /></div>
        </nav>
      )}
    </header>
  );
}

function Lightbox({ index, onClose, onNav }: { index: number; onClose: () => void; onNav: (d: number) => void }) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNav(1);
      if (e.key === "ArrowLeft") onNav(-1);
    };
    window.addEventListener("keydown", k);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", k); document.body.style.overflow = ""; };
  }, [onClose, onNav]);
  const p = photos[index]!;
  return (
    <div role="dialog" aria-modal="true" aria-label="Galería de fotos" className="fixed inset-0 z-50 flex items-center justify-center bg-overlay/95 p-4 text-on-photo animate-in fade-in" onClick={onClose}>
      <img src={p.src} alt={p.alt} className="max-h-[85vh] max-w-full object-contain" onClick={(e) => e.stopPropagation()} />
      <button autoFocus onClick={onClose} className="eyebrow absolute right-5 top-5 p-2" aria-label="Cerrar galería">Cerrar ✕</button>
      <button onClick={(e) => { e.stopPropagation(); onNav(-1); }} className="absolute left-2 top-1/2 -translate-y-1/2 p-4 text-4xl font-display md:left-6" aria-label="Foto anterior">‹</button>
      <button onClick={(e) => { e.stopPropagation(); onNav(1); }} className="absolute right-2 top-1/2 -translate-y-1/2 p-4 text-4xl font-display md:right-6" aria-label="Foto siguiente">›</button>
      <p className="eyebrow absolute bottom-6 left-1/2 -translate-x-1/2">{index + 1} / {photos.length}</p>
    </div>
  );
}

function Index() {
  useReveal();
  const [lb, setLb] = useState<number | null>(null);
  const close = useCallback(() => setLb(null), []);
  const navLb = useCallback((d: number) => setLb((i) => (i === null ? i : (i + d + photos.length) % photos.length)), []);

  return (
    <>
      <a href="#experiencia" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-background focus:p-3">Saltar al contenido</a>
      <Header />
      <main>
        {/* Hero */}
        <section id="inicio" className="relative flex min-h-[100svh] items-end overflow-hidden text-on-photo">
          <img src={heroImage} alt="Vista de Golondrinas Campo, casa de campo en Brandsen" className="animate-slow-zoom absolute inset-0 h-full w-full object-cover" fetchPriority="high" />
          <div className="hero-shade absolute inset-0" />
          <div className="relative mx-auto w-full max-w-7xl px-6 pb-20 md:px-10 md:pb-28">
            <p className="eyebrow mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">Brandsen · Provincia de Buenos Aires</p>
            <h1 className="max-w-4xl text-6xl leading-[0.95] md:text-8xl lg:text-9xl animate-in fade-in slide-in-from-bottom-6 duration-1000">
              Golondrinas <em className="font-light">Campo</em>
            </h1>
            <p className="mt-6 max-w-xl text-lg md:text-xl animate-in fade-in duration-1000 delay-300 fill-mode-both">
              Donde el día se mide en sol, agua y silencio. Una casa abierta al verde para volver a lo simple.
            </p>
            <div className="mt-10 animate-in fade-in duration-1000 delay-500 fill-mode-both"><BookLink variant="light" /></div>
          </div>
        </section>

        {/* Experiencia */}
        <section id="experiencia" className="mx-auto grid max-w-7xl gap-16 px-6 py-28 md:grid-cols-12 md:px-10 md:py-40">
          <div className="reveal md:col-span-5">
            <p className="eyebrow text-accent">La experiencia</p>
            <h2 className="mt-5 text-5xl leading-tight md:text-6xl">Tiempo lento, <em>cielo amplio</em>.</h2>
          </div>
          <div className="reveal space-y-6 text-lg leading-relaxed text-muted-foreground md:col-span-6 md:col-start-7">
            <p>
              Las Golondrinas es una casa de campo en Brandsen pensada para descansar y disfrutar en familia o con amigos. Pileta grande, una laguna con peces, canchas para jugar y amplios espacios verdes que invitan a quedarse afuera hasta que cae el sol.
            </p>
            <p>Parrilla, fogón y juegos para chicos completan una escapada que combina tranquilidad y entretenimiento, a poca distancia de la ciudad.</p>
            <dl className="grid grid-cols-4 gap-4 border-t pt-8">
              {facts.map((f) => (
                <div key={f.label}>
                  <dt className="eyebrow order-2 text-[0.6rem]">{f.label}</dt>
                  <dd className="font-display text-4xl text-foreground md:text-5xl">{f.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Galería */}
        <section id="galeria" className="bg-secondary/60 py-28 md:py-36">
          <div className="mx-auto max-w-7xl px-6 md:px-10">
            <div className="reveal mb-12 flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="eyebrow text-accent">Galería</p>
                <h2 className="mt-4 text-5xl md:text-6xl">Postales de la casa</h2>
              </div>
              <p className="max-w-sm text-muted-foreground">Tocá cualquier foto para verla en grande.</p>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:grid-rows-2 md:gap-4">
              {photos.slice(0, 5).map((p, i) => (
                <button
                  key={p.src}
                  onClick={() => setLb(i)}
                  aria-label={`Ampliar ${p.alt}`}
                  className={`reveal group relative overflow-hidden ${i === 0 ? "col-span-2 row-span-2 aspect-square md:aspect-auto" : "aspect-[4/3]"}`}
                >
                  <img src={p.thumb} alt={p.alt} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </button>
              ))}
            </div>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-8">
              <button onClick={() => setLb(0)} className="btn-primary">Ver todas las fotos</button>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="eyebrow underline underline-offset-8 hover:text-accent">Consultar por WhatsApp</a>
            </div>
          </div>
        </section>

        {/* Comodidades */}
        <section id="comodidades" className="mx-auto max-w-7xl px-6 py-28 md:px-10 md:py-40">
          <div className="reveal max-w-2xl">
            <p className="eyebrow text-accent">Comodidades</p>
            <h2 className="mt-4 text-5xl md:text-6xl">Para quedarse <em>todo el día</em> afuera</h2>
            <p className="mt-6 text-muted-foreground">Principales comodidades de la casa. Consultá el detalle completo por WhatsApp.</p>
          </div>
          <ul className="mt-16 grid gap-px overflow-hidden border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {amenities.map((a, i) => (
              <li key={a.title} className="reveal bg-background p-8 transition-colors hover:bg-card">
                <span className="font-display text-xl text-sage">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-6 text-2xl">{a.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{a.text}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Ubicación */}
        <section id="ubicacion" className="relative overflow-hidden bg-primary text-primary-foreground">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-28 md:grid-cols-2 md:px-10 md:py-36">
            <div className="reveal">
              <p className="eyebrow text-sage">Ubicación</p>
              <h2 className="mt-4 text-5xl md:text-6xl">Brandsen, <em>campo bonaerense</em></h2>
              <p className="mt-6 max-w-md text-lg opacity-80">
                En el partido de Brandsen, provincia de Buenos Aires: llanura, arboledas y cielos abiertos. Podés agrandar el mapa a pantalla completa para explorar la zona.
              </p>
            </div>
            <div className="reveal overflow-hidden">
              <iframe
                title="Mapa con la ubicación de Golondrinas Campo en Brandsen, Buenos Aires"
                src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d790.6088139826368!2d-58.14758880553103!3d-34.997140110517!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1ses!2sar!4v1793368884225!5m2!1ses!2sar"
                className="h-80 w-full md:h-96"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
              <p className="mt-3 text-xs opacity-60">Abrí el mapa a pantalla completa para ver la zona en detalle.</p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="preguntas" className="mx-auto max-w-4xl px-6 py-28 md:px-10 md:py-40">
          <div className="reveal text-center">
            <p className="eyebrow text-accent">Preguntas frecuentes</p>
            <h2 className="mt-4 text-5xl md:text-6xl">Antes de venir</h2>
          </div>
          <div className="mt-14 divide-y border-y">
            {faqs.map((f) => (
              <details key={f.q} className="reveal group py-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-display text-2xl [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span aria-hidden className="text-accent transition-transform duration-300 group-open:rotate-45">+</span>
                </summary>
                <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden text-center text-on-photo">
          <img src={photos[2]!.src} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-overlay/55" />
          <div className="reveal relative px-6">
            <p className="eyebrow">Tu próxima escapada</p>
            <h2 className="mx-auto mt-5 max-w-3xl text-5xl leading-tight md:text-7xl">Vení a escuchar <em>el campo</em>.</h2>
            <div className="mt-10"><BookLink variant="light" /></div>
          </div>
        </section>
      </main>

      <footer className="bg-background">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-14 md:flex-row md:items-center md:justify-between md:px-10">
          <div>
            <p className="font-display text-3xl">Golondrinas <em>Campo</em></p>
            <p className="mt-2 text-sm text-muted-foreground">Casa de campo · Brandsen, Buenos Aires, Argentina</p>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground">
              WhatsApp {WHATSAPP_DISPLAY}
            </a>
          </div>
          <nav aria-label="Pie de página" className="flex flex-wrap gap-6">
            {nav.map((n) => <a key={n.href} href={n.href} className="eyebrow text-muted-foreground hover:text-foreground">{n.label}</a>)}
          </nav>
          <BookLink>Reservar por WhatsApp</BookLink>
        </div>
        <p className="border-t py-6 text-center text-xs text-muted-foreground">© {new Date().getFullYear()} Golondrinas Campo · Reservas por WhatsApp {WHATSAPP_DISPLAY}</p>
      </footer>

      {lb !== null && <Lightbox index={lb} onClose={close} onNav={navLb} />}
    </>
  );
}
