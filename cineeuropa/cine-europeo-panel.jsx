import { useState, useEffect, useRef } from "react";
import {
  Film, Calendar, Star, Play, Monitor, Newspaper, ChevronRight,
  Clock, MapPin, ExternalLink, TrendingUp, Award, Search, Menu,
  X, ArrowRight, Globe, Bookmark, Eye, ArrowUpRight, Heart, Share2
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════
   CINEEUROPA — Panel de Cine Europeo en Argentina
   Estilo inspirado en zero.eu: editorial, modular, colorido
   ═══════════════════════════════════════════════════════════════════ */

// ── Palette ──────────────────────────────────────────────────────
const C = {
  bg: "#F5F0EB",
  white: "#FFFFFF",
  black: "#1A1A1A",
  text: "#2D2D2D",
  textLight: "#6B6B6B",
  textMuted: "#9A9A9A",
  accent1: "#E63946",   // Red — Festivales
  accent2: "#457B9D",   // Blue — Plataformas
  accent3: "#2A9D8F",   // Teal — Estrenos
  accent4: "#E9C46A",   // Gold — Críticas
  accent5: "#F4A261",   // Orange — Trailers
  accent6: "#264653",   // Dark teal — Nav
  pink: "#FF6B8A",
  purple: "#8338EC",
  lime: "#B5E48C",
  coral: "#FF7F50",
  border: "#E5DFD8",
};

const CATEGORY_COLORS = {
  Festivales: C.accent1,
  Plataformas: C.accent2,
  Argentina: C.accent3,
  Estrenos: C.accent3,
  Críticas: C.accent4,
  Trailers: C.accent5,
};

// ── Data ─────────────────────────────────────────────────────────
const NEWS = [
  { id: 1, title: "Cannes 2026 anuncia su selección oficial con fuerte presencia de cine rumano", source: "Cineuropa", date: "28 Feb", image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&q=80", category: "Festivales", excerpt: "La 79ª edición del Festival de Cannes revela una programación audaz con tres films rumanos en competencia oficial.", hot: true },
  { id: 2, title: "Mubi adquiere los derechos del nuevo film de Alice Rohrwacher", source: "Screen Daily", date: "25 Feb", image: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800&q=80", category: "Plataformas", excerpt: "La cineasta italiana regresa con una fábula rural que promete ser una de las películas del año." },
  { id: 3, title: "El BAFICI confirma retrospectiva completa de Chantal Akerman", source: "Otros Cines", date: "22 Feb", image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&q=80", category: "Argentina", excerpt: "El festival porteño dedicará una sección especial a la obra integral de la cineasta belga." },
  { id: 4, title: "Berlinale 2026: el Oso de Oro va para el cine portugués", source: "Cahiers du Cinéma", date: "20 Feb", image: "https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?w=800&q=80", category: "Festivales", excerpt: "Miguel Gomes conquista el máximo galardón con su nueva obra sobre la memoria colonial." },
  { id: 5, title: "Criterion Channel estrena colección de Nuevo Cine Griego", source: "The Film Stage", date: "18 Feb", image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&q=80", category: "Plataformas", excerpt: "Lanthimos, Tsangari y una nueva generación de cineastas griegos protagonizan la selección de marzo." },
  { id: 6, title: "Venecia anuncia jurado presidido por Wim Wenders", source: "Variety", date: "15 Feb", image: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=800&q=80", category: "Festivales", excerpt: "El director alemán liderará la selección de la competencia oficial de la Mostra 2026." },
  { id: 7, title: "Jessica Hausner prepara su próximo film con Isabelle Huppert", source: "IndieWire", date: "12 Feb", image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&q=80", category: "Argentina", excerpt: "La directora austríaca confirma rodaje en Viena para su séptimo largometraje." },
  { id: 8, title: "El cine español arrasa en las nominaciones a los European Film Awards", source: "El Cultural", date: "10 Feb", image: "https://images.unsplash.com/photo-1542204625-ca960ca44635?w=800&q=80", category: "Festivales", excerpt: "Cuatro películas españolas figuran entre las principales categorías de los premios europeos." },
];

const RELEASES = [
  { id: 1, title: "La Chimera", director: "Alice Rohrwacher", country: "🇮🇹 Italia", date: "6 Mar", platform: "Cines", rating: 8.1, poster: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&q=80", color: C.accent1 },
  { id: 2, title: "The Zone of Interest", director: "Jonathan Glazer", country: "🇬🇧 Reino Unido", date: "13 Mar", platform: "Cines + MUBI", rating: 8.4, poster: "https://images.unsplash.com/photo-1460881680858-30d872d5b430?w=400&q=80", color: C.accent2 },
  { id: 3, title: "Anatomie d'une chute", director: "Justine Triet", country: "🇫🇷 Francia", date: "20 Mar", platform: "Cines", rating: 8.6, poster: "https://images.unsplash.com/photo-1518676590747-1e3dcf5a0e32?w=400&q=80", color: C.accent3 },
  { id: 4, title: "Perfect Days", director: "Wim Wenders", country: "🇩🇪 Alemania", date: "27 Mar", platform: "Cines", rating: 8.3, poster: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=400&q=80", color: C.purple },
  { id: 5, title: "Do Not Expect Too Much from the End of the World", director: "Radu Jude", country: "🇷🇴 Rumania", date: "3 Abr", platform: "MUBI", rating: 7.8, poster: "https://images.unsplash.com/photo-1542204625-ca960ca44635?w=400&q=80", color: C.accent5 },
  { id: 6, title: "Io Capitano", director: "Matteo Garrone", country: "🇮🇹 Italia", date: "10 Abr", platform: "Cines", rating: 7.9, poster: "https://images.unsplash.com/photo-1595769816263-9b910be24d5f?w=400&q=80", color: C.coral },
];

const FESTIVALS = [
  { id: 1, name: "BAFICI", city: "Buenos Aires", dates: "9—20 Abr", status: "Próximo", color: C.accent3, emoji: "🇦🇷", desc: "Festival de Cine Independiente de Buenos Aires" },
  { id: 2, name: "Cannes", city: "Francia", dates: "12—23 May", status: "Próximo", color: C.accent4, emoji: "🇫🇷", desc: "79ª edición · Selección oficial anunciada" },
  { id: 3, name: "Karlovy Vary", city: "Rep. Checa", dates: "27 Jun—5 Jul", status: "Inscripción abierta", color: C.accent1, emoji: "🇨🇿", desc: "El festival más importante de Europa Central" },
  { id: 4, name: "Locarno", city: "Suiza", dates: "5—15 Ago", status: "Próximo", color: C.accent2, emoji: "🇨🇭", desc: "Leopardo de Oro · Piazza Grande" },
  { id: 5, name: "Venecia", city: "Italia", dates: "2—12 Sep", status: "Próximo", color: C.purple, emoji: "🇮🇹", desc: "83ª Mostra · Jurado: Wim Wenders" },
  { id: 6, name: "San Sebastián", city: "España", dates: "18—26 Sep", status: "Próximo", color: C.accent5, emoji: "🇪🇸", desc: "Concha de Oro · Sección Zabaltegi" },
];

const PLATFORMS = [
  { name: "MUBI", newCount: 4, highlight: "Nuevo Cine Rumano", color: "#0099FF", films: ["Close", "EO", "Tótem"] },
  { name: "Criterion", newCount: 7, highlight: "Retrospectiva Varda", color: "#000000", films: ["Cléo de 5 a 7", "Sin techo ni ley"] },
  { name: "BFI Player", newCount: 3, highlight: "Ciclo Ken Loach", color: "#E94E1B", films: ["Sorry We Missed You", "I, Daniel Blake"] },
  { name: "Filmin", newCount: 5, highlight: "Especial cine nórdico", color: "#FF6B35", films: ["The Worst Person in the World", "Triangle of Sadness"] },
];

const REVIEWS = [
  { title: "Anatomie d'une chute", director: "Justine Triet", score: 8.6, count: 89, badge: "Palme d'Or", text: "Un thriller judicial que disecciona una relación con precisión quirúrgica." },
  { title: "The Zone of Interest", director: "Jonathan Glazer", score: 8.4, count: 72, badge: "Grand Prix", text: "Una obra radical sobre la banalidad del mal." },
  { title: "Perfect Days", director: "Wim Wenders", score: 8.3, count: 61, badge: "Best Actor", text: "Wenders encuentra la belleza en la rutina diaria con delicadeza y humanismo." },
  { title: "La Chimera", director: "Alice Rohrwacher", score: 8.1, count: 47, badge: "Cannes 2023", text: "Una fábula luminosa sobre el saqueo del pasado." },
];

const TRAILERS = [
  { title: "La Chimera", thumb: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&q=80", dur: "2:34", views: "1.2M" },
  { title: "Anatomie d'une chute", thumb: "https://images.unsplash.com/photo-1518676590747-1e3dcf5a0e32?w=600&q=80", dur: "2:18", views: "3.4M" },
  { title: "The Zone of Interest", thumb: "https://images.unsplash.com/photo-1460881680858-30d872d5b430?w=600&q=80", dur: "1:52", views: "5.1M" },
  { title: "Perfect Days", thumb: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=600&q=80", dur: "2:45", views: "2.8M" },
];

// ── Pill / Tag ───────────────────────────────────────────────────
function Tag({ children, color = C.accent1, small, filled }) {
  return (
    <span style={{
      display: "inline-block",
      fontSize: small ? 9 : 11,
      fontWeight: 700,
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      color: filled ? "#fff" : color,
      background: filled ? color : `${color}18`,
      padding: small ? "2px 6px" : "3px 10px",
      borderRadius: 20,
      lineHeight: 1.4,
    }}>
      {children}
    </span>
  );
}

// ── Score Circle ─────────────────────────────────────────────────
function ScoreCircle({ score, size = 48 }) {
  const r = (size - 6) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 10) * circ;
  const color = score >= 8.5 ? C.accent3 : score >= 8 ? C.accent4 : C.accent5;
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={`${color}25`} strokeWidth={3} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={3}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s ease" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.3, fontWeight: 800, color }}>
        {score}
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════
//  MAIN APP
// ═════════════════════════════════════════════════════════════════
export default function CineEuropeoPanel() {
  const [activeSection, setActiveSection] = useState("inicio");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredCard, setHoveredCard] = useState(null);
  const containerRef = useRef(null);

  const sections = [
    { id: "inicio", label: "Inicio" },
    { id: "noticias", label: "Noticias" },
    { id: "estrenos", label: "Estrenos AR" },
    { id: "festivales", label: "Festivales" },
    { id: "plataformas", label: "Plataformas" },
    { id: "criticas", label: "Críticas" },
    { id: "trailers", label: "Trailers" },
  ];

  const scrollTo = (id) => {
    setActiveSection(id);
    const el = document.getElementById(`s-${id}`);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const now = new Date();
  const dateStr = now.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  // ── Shared styles ──────────────────────────────────────────────
  const card = (extra = {}) => ({
    background: C.white,
    borderRadius: 16,
    overflow: "hidden",
    cursor: "pointer",
    transition: "transform 0.25s ease, box-shadow 0.25s ease",
    ...extra,
  });
  const cardHover = { transform: "translateY(-4px)", boxShadow: "0 12px 32px rgba(0,0,0,0.08)" };

  const sectionHeader = (color) => ({
    display: "flex", alignItems: "center", gap: 12, marginBottom: 28,
  });
  const sectionDot = (color) => ({
    width: 12, height: 12, borderRadius: "50%", background: color, flexShrink: 0,
  });
  const sectionTitle = {
    fontSize: 28, fontWeight: 800, color: C.black, letterSpacing: "-0.02em", lineHeight: 1,
  };

  const wrap = {
    maxWidth: 1320, margin: "0 auto", padding: "48px 28px",
  };

  // ── HEADER ─────────────────────────────────────────────────────
  const Header = () => (
    <header style={{
      position: "sticky", top: 0, zIndex: 100,
      background: "rgba(245,240,235,0.92)", backdropFilter: "blur(16px)",
      borderBottom: `1px solid ${C.border}`,
    }}>
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 28px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => scrollTo("inicio")}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: C.accent1, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Film size={16} style={{ color: "#fff" }} />
          </div>
          <span style={{ fontSize: 18, fontWeight: 900, color: C.black, letterSpacing: "-0.03em" }}>
            cine<span style={{ color: C.accent1 }}>europa</span>
          </span>
        </div>

        {/* Nav */}
        <nav style={{ display: "flex", gap: 2 }}>
          {sections.map(s => (
            <button key={s.id} onClick={() => scrollTo(s.id)} style={{
              background: activeSection === s.id ? C.black : "transparent",
              color: activeSection === s.id ? "#fff" : C.textLight,
              border: "none", borderRadius: 24, padding: "7px 16px",
              fontSize: 13, fontWeight: 600, cursor: "pointer",
              transition: "all 0.2s ease",
            }}>
              {s.label}
            </button>
          ))}
        </nav>

        {/* Search */}
        <button onClick={() => setSearchOpen(true)} style={{
          background: C.white, border: `1px solid ${C.border}`,
          borderRadius: 24, padding: "7px 16px", cursor: "pointer",
          display: "flex", alignItems: "center", gap: 6,
          fontSize: 13, color: C.textMuted,
        }}>
          <Search size={14} /> Buscar
        </button>
      </div>
    </header>
  );

  // ── HERO ───────────────────────────────────────────────────────
  const Hero = () => (
    <div id="s-inicio" style={{ ...wrap, paddingTop: 56, paddingBottom: 40 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>
        {dateStr}
      </div>
      <h1 style={{ fontSize: 56, fontWeight: 900, color: C.black, lineHeight: 1.05, margin: "0 0 16px 0", letterSpacing: "-0.03em", maxWidth: 700 }}>
        Lo mejor del<br />cine europeo,<br /><span style={{ color: C.accent1 }}>en Argentina.</span>
      </h1>
      <p style={{ fontSize: 17, color: C.textLight, lineHeight: 1.6, maxWidth: 520, margin: "0 0 32px 0" }}>
        Noticias, estrenos, festivales y críticas. Actualizado desde Cineuropa, Screen Daily, Cahiers du Cinéma, Variety y más.
      </p>

      {/* Quick stats */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {[
          { n: "12", label: "noticias hoy", color: C.accent1 },
          { n: "4", label: "estrenos en marzo", color: C.accent3 },
          { n: "2", label: "festivales activos", color: C.accent4 },
          { n: "19", label: "nuevos en streaming", color: C.accent2 },
        ].map((s, i) => (
          <div key={i} style={{
            background: C.white, borderRadius: 14, padding: "14px 20px",
            display: "flex", alignItems: "center", gap: 12,
            border: `1px solid ${C.border}`,
          }}>
            <span style={{ fontSize: 28, fontWeight: 900, color: s.color, fontFamily: "monospace" }}>{s.n}</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: C.textLight, textTransform: "uppercase", letterSpacing: "0.04em" }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Breaking news ribbon */}
      <div style={{
        marginTop: 28, padding: "14px 20px", background: C.accent1,
        borderRadius: 14, display: "flex", alignItems: "center", gap: 12,
        color: "#fff",
      }}>
        <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", padding: "3px 8px", background: "rgba(255,255,255,0.2)", borderRadius: 6 }}>Ahora</span>
        <span style={{ fontSize: 14, fontWeight: 600, flex: 1 }}>{NEWS[0].title}</span>
        <ArrowRight size={16} />
      </div>
    </div>
  );

  // ── NEWS ───────────────────────────────────────────────────────
  const NewsSection = () => (
    <div id="s-noticias" style={wrap}>
      <div style={sectionHeader(C.accent1)}>
        <div style={sectionDot(C.accent1)} />
        <h2 style={sectionTitle}>Noticias</h2>
        <span style={{ marginLeft: "auto", fontSize: 13, fontWeight: 600, color: C.accent1, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
          Ver todas <ArrowRight size={14} />
        </span>
      </div>

      {/* Masonry-style modular grid — zero.eu inspired */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gridTemplateRows: "auto auto", gap: 16 }}>
        {/* Big featured card */}
        <div
          style={{ ...card(), gridColumn: "1 / 3", gridRow: "1 / 3", ...(hoveredCard === "n-feat" ? cardHover : {}) }}
          onMouseEnter={() => setHoveredCard("n-feat")}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div style={{ position: "relative", aspectRatio: "16/10", overflow: "hidden" }}>
            <img src={NEWS[0].image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease", transform: hoveredCard === "n-feat" ? "scale(1.04)" : "scale(1)" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 55%)" }} />
            <div style={{ position: "absolute", top: 16, left: 16 }}>
              <Tag filled color={CATEGORY_COLORS[NEWS[0].category]}>{NEWS[0].category}</Tag>
            </div>
            {NEWS[0].hot && (
              <div style={{ position: "absolute", top: 16, right: 16 }}>
                <Tag filled color={C.pink}>🔥 Hot</Tag>
              </div>
            )}
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: 24 }}>
              <h3 style={{ fontSize: 24, fontWeight: 800, color: "#fff", margin: "0 0 8px 0", lineHeight: 1.25, letterSpacing: "-0.01em" }}>{NEWS[0].title}</h3>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", margin: "0 0 12px 0", lineHeight: 1.5 }}>{NEWS[0].excerpt}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "rgba(255,255,255,0.5)" }}>
                <span style={{ fontWeight: 700, color: "rgba(255,255,255,0.7)" }}>{NEWS[0].source}</span>
                <span>·</span>
                <span>{NEWS[0].date}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Side cards — stacked */}
        {NEWS.slice(1, 3).map((item, i) => (
          <div
            key={item.id}
            style={{ ...card(), display: "flex", flexDirection: "column", ...(hoveredCard === `n-${item.id}` ? cardHover : {}) }}
            onMouseEnter={() => setHoveredCard(`n-${item.id}`)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div style={{ position: "relative", height: 140, overflow: "hidden" }}>
              <img src={item.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s", transform: hoveredCard === `n-${item.id}` ? "scale(1.06)" : "scale(1)" }} />
              <div style={{ position: "absolute", top: 10, left: 10 }}>
                <Tag filled color={CATEGORY_COLORS[item.category]}>{item.category}</Tag>
              </div>
            </div>
            <div style={{ padding: 16, flex: 1, display: "flex", flexDirection: "column" }}>
              <h4 style={{ fontSize: 15, fontWeight: 700, color: C.black, margin: "0 0 8px 0", lineHeight: 1.3, flex: 1 }}>{item.title}</h4>
              <div style={{ fontSize: 11, color: C.textMuted }}>
                <span style={{ fontWeight: 700, color: C.textLight }}>{item.source}</span> · {item.date}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Second row — horizontal cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginTop: 16 }}>
        {NEWS.slice(3, 7).map(item => (
          <div
            key={item.id}
            style={{ ...card({ padding: 16 }), ...(hoveredCard === `n2-${item.id}` ? cardHover : {}) }}
            onMouseEnter={() => setHoveredCard(`n2-${item.id}`)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <Tag small color={CATEGORY_COLORS[item.category]}>{item.category}</Tag>
            <h4 style={{ fontSize: 14, fontWeight: 700, color: C.black, margin: "10px 0 8px 0", lineHeight: 1.35 }}>{item.title}</h4>
            <p style={{ fontSize: 12, color: C.textMuted, margin: "0 0 12px 0", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{item.excerpt}</p>
            <div style={{ fontSize: 10, color: C.textMuted, fontWeight: 600 }}>{item.source} · {item.date}</div>
          </div>
        ))}
      </div>
    </div>
  );

  // ── RELEASES ───────────────────────────────────────────────────
  const ReleasesSection = () => (
    <div id="s-estrenos" style={wrap}>
      <div style={sectionHeader(C.accent3)}>
        <div style={sectionDot(C.accent3)} />
        <h2 style={sectionTitle}>Estrenos en Argentina</h2>
        <Tag color={C.accent3}>Marzo — Abril 2026</Tag>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {RELEASES.map(film => (
          <div
            key={film.id}
            style={{ ...card(), ...(hoveredCard === `r-${film.id}` ? cardHover : {}) }}
            onMouseEnter={() => setHoveredCard(`r-${film.id}`)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div style={{ position: "relative", aspectRatio: "16/10", overflow: "hidden" }}>
              <img src={film.poster} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s", transform: hoveredCard === `r-${film.id}` ? "scale(1.06)" : "scale(1)" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent 50%)" }} />
              {/* Score badge */}
              <div style={{ position: "absolute", top: 12, right: 12 }}>
                <ScoreCircle score={film.rating} size={44} />
              </div>
              {/* Date pill at bottom */}
              <div style={{ position: "absolute", bottom: 12, left: 12, background: film.color, padding: "5px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", gap: 5 }}>
                <Calendar size={12} /> {film.date}
              </div>
            </div>
            <div style={{ padding: 16 }}>
              <h4 style={{ fontSize: 17, fontWeight: 800, color: C.black, margin: "0 0 2px 0" }}>{film.title}</h4>
              <div style={{ fontSize: 13, color: C.textLight, marginBottom: 10 }}>{film.director}</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12, color: C.textMuted }}>{film.country}</span>
                <Tag small color={film.color}>{film.platform}</Tag>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ── FESTIVALS ──────────────────────────────────────────────────
  const FestivalsSection = () => (
    <div id="s-festivales" style={wrap}>
      <div style={sectionHeader(C.accent4)}>
        <div style={sectionDot(C.accent4)} />
        <h2 style={sectionTitle}>Festivales</h2>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {FESTIVALS.map(f => (
          <div
            key={f.id}
            style={{
              ...card({ padding: 0 }),
              borderLeft: `5px solid ${f.color}`,
              ...(hoveredCard === `f-${f.id}` ? cardHover : {}),
            }}
            onMouseEnter={() => setHoveredCard(`f-${f.id}`)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div style={{ padding: 20 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ fontSize: 28 }}>{f.emoji}</span>
                <Tag small color={f.color}>{f.status}</Tag>
              </div>
              <h4 style={{ fontSize: 20, fontWeight: 800, color: C.black, margin: "0 0 4px 0" }}>{f.name}</h4>
              <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 10 }}>{f.desc}</div>
              <div style={{ display: "flex", gap: 16, fontSize: 12, color: C.textLight }}>
                <span style={{ display: "flex", alignItems: "center", gap: 4, fontWeight: 600 }}><Calendar size={12} /> {f.dates}</span>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}><MapPin size={12} /> {f.city}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mini timeline */}
      <div style={{ marginTop: 28, background: C.white, borderRadius: 16, padding: 24 }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: C.textMuted, marginBottom: 16 }}>Timeline 2026</div>
        <div style={{ position: "relative", height: 48, display: "flex", alignItems: "center" }}>
          <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 2, background: C.border, borderRadius: 1 }} />
          {FESTIVALS.map((f, i) => (
            <div key={f.id} style={{ position: "absolute", left: `${8 + i * 17}%`, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{ width: 14, height: 14, borderRadius: "50%", background: f.color, border: `3px solid ${C.bg}`, zIndex: 1, boxShadow: `0 0 0 2px ${f.color}40` }} />
              <span style={{ fontSize: 10, fontWeight: 700, color: f.color, whiteSpace: "nowrap", marginTop: 2 }}>{f.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ── PLATFORMS ───────────────────────────────────────────────────
  const PlatformsSection = () => (
    <div id="s-plataformas" style={wrap}>
      <div style={sectionHeader(C.accent2)}>
        <div style={sectionDot(C.accent2)} />
        <h2 style={sectionTitle}>Plataformas</h2>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {PLATFORMS.map(p => (
          <div
            key={p.name}
            style={{ ...card({ padding: 0 }), ...(hoveredCard === `p-${p.name}` ? cardHover : {}) }}
            onMouseEnter={() => setHoveredCard(`p-${p.name}`)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            {/* Color bar top */}
            <div style={{ height: 5, background: p.color }} />
            <div style={{ padding: 20, textAlign: "center" }}>
              <div style={{ fontSize: 20, fontWeight: 900, color: C.black, marginBottom: 2 }}>{p.name}</div>
              <div style={{ fontSize: 36, fontWeight: 900, color: p.color, fontFamily: "monospace", margin: "8px 0" }}>+{p.newCount}</div>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: C.textMuted, marginBottom: 14 }}>nuevos esta semana</div>
              <div style={{ padding: "10px 0", borderTop: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.text, marginBottom: 8 }}>{p.highlight}</div>
                {p.films.map((f, i) => (
                  <div key={i} style={{ fontSize: 11, color: C.textMuted, lineHeight: 1.8 }}>{f}</div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ── REVIEWS ────────────────────────────────────────────────────
  const ReviewsSection = () => (
    <div id="s-criticas" style={wrap}>
      <div style={sectionHeader(C.accent4)}>
        <div style={sectionDot(C.accent4)} />
        <h2 style={sectionTitle}>Críticas</h2>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
        {REVIEWS.map((r, i) => (
          <div
            key={i}
            style={{ ...card({ padding: 24, display: "flex", gap: 20, alignItems: "flex-start" }), ...(hoveredCard === `rev-${i}` ? cardHover : {}) }}
            onMouseEnter={() => setHoveredCard(`rev-${i}`)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <ScoreCircle score={r.score} size={56} />
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <h4 style={{ fontSize: 17, fontWeight: 800, color: C.black, margin: 0 }}>{r.title}</h4>
                <Tag small color={C.accent4}>{r.badge}</Tag>
              </div>
              <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 8 }}>{r.director} · {r.count} críticas</div>
              <p style={{ fontSize: 13, color: C.textLight, margin: 0, lineHeight: 1.55, fontStyle: "italic" }}>"{r.text}"</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ── TRAILERS ───────────────────────────────────────────────────
  const TrailersSection = () => (
    <div id="s-trailers" style={wrap}>
      <div style={sectionHeader(C.accent5)}>
        <div style={sectionDot(C.accent5)} />
        <h2 style={sectionTitle}>Trailers</h2>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
        {TRAILERS.map((t, i) => (
          <div
            key={i}
            style={{ ...card(), position: "relative", ...(hoveredCard === `t-${i}` ? cardHover : {}) }}
            onMouseEnter={() => setHoveredCard(`t-${i}`)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div style={{ position: "relative", aspectRatio: "16/9", overflow: "hidden" }}>
              <img src={t.thumb} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s", transform: hoveredCard === `t-${i}` ? "scale(1.05)" : "scale(1)" }} />
              <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.25)", display: "flex", alignItems: "center", justifyContent: "center", opacity: hoveredCard === `t-${i}` ? 1 : 0, transition: "opacity 0.3s" }}>
                <div style={{ width: 60, height: 60, borderRadius: "50%", background: C.accent5, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }}>
                  <Play size={24} fill="#fff" style={{ color: "#fff", marginLeft: 3 }} />
                </div>
              </div>
              {/* Duration pill */}
              <div style={{ position: "absolute", bottom: 10, right: 10, background: "rgba(0,0,0,0.7)", padding: "3px 8px", borderRadius: 6, fontSize: 11, fontWeight: 700, color: "#fff" }}>
                {t.dur}
              </div>
            </div>
            <div style={{ padding: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h4 style={{ fontSize: 15, fontWeight: 700, color: C.black, margin: 0 }}>{t.title}</h4>
              <span style={{ fontSize: 11, color: C.textMuted, display: "flex", alignItems: "center", gap: 4 }}><Eye size={12} /> {t.views}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ── FOOTER ─────────────────────────────────────────────────────
  const Footer = () => (
    <footer style={{ borderTop: `1px solid ${C.border}`, padding: "32px 28px", maxWidth: 1320, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <div>
          <span style={{ fontSize: 16, fontWeight: 900, color: C.black }}>cine<span style={{ color: C.accent1 }}>europa</span></span>
          <div style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>Tu guía del cine europeo en Argentina</div>
        </div>
        <div style={{ fontSize: 11, color: C.textMuted }}>
          Fuentes: Cineuropa · Screen Daily · Cahiers du Cinéma · Variety · Otros Cines · The Film Stage
        </div>
      </div>
    </footer>
  );

  // ── SEARCH OVERLAY ─────────────────────────────────────────────
  const SearchOverlay = () => searchOpen && (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(245,240,235,0.95)", backdropFilter: "blur(20px)", display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: 140 }}
      onClick={() => setSearchOpen(false)}
    >
      <div style={{ width: "100%", maxWidth: 560, padding: "0 28px" }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 20px", background: C.white, borderRadius: 16, boxShadow: "0 8px 32px rgba(0,0,0,0.08)", border: `2px solid ${C.accent1}` }}>
          <Search size={20} style={{ color: C.accent1 }} />
          <input
            autoFocus
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Buscar películas, festivales, directores..."
            style={{ flex: 1, background: "none", border: "none", outline: "none", color: C.black, fontSize: 17, fontWeight: 500, fontFamily: "inherit" }}
          />
          <button onClick={() => setSearchOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: C.textMuted }}>
            <X size={18} />
          </button>
        </div>
        <div style={{ textAlign: "center", marginTop: 14, fontSize: 12, color: C.textMuted }}>ESC para cerrar</div>
      </div>
    </div>
  );

  // ── RENDER ─────────────────────────────────────────────────────
  return (
    <div style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", background: C.bg, color: C.text, minHeight: "100vh", maxHeight: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <SearchOverlay />
      <Header />
      <main ref={containerRef} style={{ flex: 1, overflowY: "auto", overflowX: "hidden", scrollBehavior: "smooth" }}>
        <Hero />
        <NewsSection />
        <ReleasesSection />
        <FestivalsSection />
        <PlatformsSection />
        <ReviewsSection />
        <TrailersSection />
        <Footer />
      </main>
    </div>
  );
}