#!/usr/bin/env python3
"""
CINEEUROPA — Scraper automático de noticias de cine europeo.
Ejecutado por GitHub Actions 3x al día.
Genera data.json con contenido fresco de 7 fuentes especializadas.
"""

import json
import os
import re
import hashlib
from datetime import datetime, timedelta
from pathlib import Path

# ─── Intentar importar dependencias opcionales ───
try:
    import feedparser
    HAS_FEEDPARSER = True
except ImportError:
    HAS_FEEDPARSER = False

try:
    import requests
    from bs4 import BeautifulSoup
    HAS_REQUESTS = True
except ImportError:
    HAS_REQUESTS = False


# ─── CONFIGURACIÓN DE FUENTES ───
SOURCES = [
    {
        "name": "Cineuropa",
        "url": "https://cineuropa.org",
        "rss": "https://cineuropa.org/es/rss/",
        "lang": "es",
        "category": "FESTIVALES",
    },
    {
        "name": "A Sala Llena",
        "url": "https://asalallena.com.ar",
        "rss": "https://asalallena.com.ar/feed/",
        "category": "CRÍTICAS",
    },
    {
        "name": "Otros Cines",
        "url": "https://otroscines.com",
        "rss": "https://otroscines.com/feed/",
        "category": "PLATAFORMAS",
    },
    {
        "name": "Escribiendo Cine",
        "url": "https://escribiendocine.com",
        "rss": "https://escribiendocine.com/feed/",
        "category": "FESTIVALES",
    },
    {
        "name": "El Antepenúltimo Mohicano",
        "url": "https://elantepenultimomohicano.com",
        "rss": "https://elantepenultimomohicano.com/feed/",
        "category": "FESTIVALES",
    },
    {
        "name": "Fotogramas",
        "url": "https://www.fotogramas.es",
        "rss": "https://www.fotogramas.es/rss/",
        "category": "ESTRENOS",
    },
    {
        "name": "Kinotico",
        "url": "https://kinotico.es",
        "rss": "https://kinotico.es/feed/",
        "category": "FESTIVALES",
    },
]

# Palabras clave para detectar cine europeo
EURO_KEYWORDS = [
    "europeo", "europea", "europa", "festival", "cannes", "venecia", "berlín",
    "berlinale", "locarno", "karlovy", "san sebastián", "málaga", "sitges",
    "bafici", "d'a", "mubi", "filmin", "sorrentino", "almodóvar", "haneke",
    "audiard", "kaurismäki", "schanelec", "panahi", "petzold", "varda",
    "godard", "italiano", "francesa", "francés", "alemán", "alemana",
    "español", "española", "británico", "británica", "escandinav",
    "nórdic", "estreno", "plataforma", "streaming", "cine de autor",
    "oso de oro", "león de oro", "palma de oro", "goya", "bafta", "efa",
    "thessaloniki", "series mania", "oscar", "premios", "nominad",
    "herzog", "martel", "rosi", "çatak", "mungiu", "lanthimos",
    "ceylan", "östlund", "vinterberg", "trier", "zvyagintsev",
]

# Meses en español
MESES = {
    1: "ENE", 2: "FEB", 3: "MAR", 4: "ABR", 5: "MAY", 6: "JUN",
    7: "JUL", 8: "AGO", 9: "SEP", 10: "OCT", 11: "NOV", 12: "DIC"
}

DIAS = {
    0: "LUN", 1: "MAR", 2: "MIÉ", 3: "JUE", 4: "VIE", 5: "SÁB", 6: "DOM"
}


# Imágenes de respaldo temáticas (cine) de Unsplash
FALLBACK_IMAGES = [
    "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&q=80",
    "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&q=80",
    "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&q=80",
    "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&q=80",
    "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=800&q=80",
    "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800&q=80",
    "https://images.unsplash.com/photo-1595769816263-9b910be24d5f?w=800&q=80",
    "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80",
    "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=800&q=80",
    "https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?w=800&q=80",
    "https://images.unsplash.com/photo-1460881680858-30d872d5b430?w=800&q=80",
    "https://images.unsplash.com/photo-1532635241-17e820acc59f?w=800&q=80",
]

_img_idx = 0
def get_fallback_image() -> str:
    """Return a cycling fallback cinema image."""
    global _img_idx
    img = FALLBACK_IMAGES[_img_idx % len(FALLBACK_IMAGES)]
    _img_idx += 1
    return img


def is_spanish(text: str, url: str = "") -> bool:
    """Check if text appears to be in Spanish (not English). Strict filter."""
    # If the URL contains /en/ it's English content
    if "/en/" in url:
        return False

    text_lower = text.lower()

    # Strong English indicators — if ANY of these appear, it's English
    english_markers = [
        " the ", " is ", " are ", " was ", " were ", " has ", " have ",
        " which ", " about ", " their ", " this ", " that ", " with ",
        " from ", " into ", " been ", " being ", " will ", " would ",
        " could ", " should ", " might ", " also ", " its ", " than ",
        "interview:", "review:", "exclusive:", "films /",
    ]
    for marker in english_markers:
        if marker in f" {text_lower} ":
            return False

    # Spanish indicators
    spanish_words = [
        " de ", " del ", " en ", " la ", " el ", " las ", " los ",
        " con ", " por ", " una ", " un ", " para ", " que ", " más ",
        " sus ", " cine ", " película ", " festival ", " estreno ",
        " director ", " premio ", " jurado ",
    ]
    es_count = sum(1 for w in spanish_words if w in f" {text_lower} ")

    return es_count >= 2


def generate_id(title: str) -> str:
    """Generate a unique ID from the title."""
    return hashlib.md5(title.encode()).hexdigest()[:12]


def format_date_es(dt: datetime) -> str:
    """Format a date in Spanish like 'JUE 5 MAR 2026'."""
    dia_semana = DIAS.get(dt.weekday(), "")
    mes = MESES.get(dt.month, "")
    return f"{dia_semana} {dt.day} {mes} {dt.year}"


def is_european_cinema(title: str, summary: str = "") -> bool:
    """Check if an article is related to European cinema."""
    text = (title + " " + summary).lower()
    return any(kw in text for kw in EURO_KEYWORDS)


def categorize_article(title: str, summary: str = "", default_cat: str = "FESTIVALES") -> str:
    """Auto-categorize articles based on content."""
    text = (title + " " + summary).lower()

    if any(w in text for w in ["mubi", "filmin", "netflix", "hbo", "prime video", "streaming", "plataforma"]):
        return "PLATAFORMAS"
    if any(w in text for w in ["estreno", "cartelera", "llega a cines", "se estrena"]):
        return "ESTRENOS"
    if any(w in text for w in ["crítica", "reseña", "review", "puntuación", "estrellas"]):
        return "CRÍTICAS"
    if any(w in text for w in ["argentina", "bafici", "buenos aires", "fiesta del cine"]):
        return "ARGENTINA"
    if any(w in text for w in ["festival", "berlinale", "cannes", "venecia", "competencia", "sección oficial", "premios"]):
        return "FESTIVALES"

    return default_cat


def extract_image_from_html(html_content: str) -> str:
    """Extract the first image URL from HTML content."""
    if not html_content:
        return ""

    # Try regex first (doesn't need BeautifulSoup)
    img_match = re.search(r'<img[^>]+src=["\']([^"\']+)["\']', html_content)
    if img_match:
        url = img_match.group(1)
        # Skip tiny tracking pixels and icons
        if "pixel" not in url and "icon" not in url and "logo" not in url:
            return url

    # Try with BeautifulSoup if available
    if HAS_REQUESTS:
        try:
            soup = BeautifulSoup(html_content, "html.parser")
            img = soup.find("img", src=True)
            if img:
                src = img["src"]
                if "pixel" not in src and "icon" not in src:
                    return src
        except Exception:
            pass

    return ""


def scrape_rss(source: dict) -> list:
    """Scrape articles from an RSS feed."""
    if not HAS_FEEDPARSER:
        print(f"  ⚠ feedparser no disponible, saltando {source['name']}")
        return []

    articles = []
    try:
        print(f"  📡 Leyendo RSS de {source['name']}...")
        feed = feedparser.parse(source["rss"])

        if feed.bozo and not feed.entries:
            print(f"  ⚠ RSS inválido para {source['name']}: {feed.bozo_exception}")
            return []

        for entry in feed.entries[:15]:  # Max 15 per source
            title = entry.get("title", "").strip()
            if not title:
                continue

            summary = entry.get("summary", entry.get("description", "")).strip()
            # Clean HTML from summary
            summary_text = re.sub(r"<[^>]+>", "", summary).strip()
            if len(summary_text) > 300:
                summary_text = summary_text[:297] + "..."

            link = entry.get("link", source["url"])

            # Parse date
            published = entry.get("published_parsed") or entry.get("updated_parsed")
            if published:
                try:
                    dt = datetime(*published[:6])
                except Exception:
                    dt = datetime.now()
            else:
                dt = datetime.now()

            # Extract image
            image = ""
            # Try media content
            media = entry.get("media_content", [])
            if media and isinstance(media, list):
                image = media[0].get("url", "")

            # Try media thumbnail
            if not image:
                thumb = entry.get("media_thumbnail", [])
                if thumb and isinstance(thumb, list):
                    image = thumb[0].get("url", "")

            # Try enclosures
            if not image:
                enclosures = entry.get("enclosures", [])
                for enc in enclosures:
                    if "image" in enc.get("type", ""):
                        image = enc.get("href", enc.get("url", ""))
                        break

            # Try summary HTML
            if not image:
                image = extract_image_from_html(summary)

            # Check relevance and language
            if not is_spanish(title + " " + summary_text, link):
                continue
            if not is_european_cinema(title, summary_text):
                continue

            # Fallback image if none found
            if not image:
                image = get_fallback_image()

            cat = categorize_article(title, summary_text, source["category"])

            articles.append({
                "id": generate_id(title),
                "title": title,
                "source": source["name"],
                "date": format_date_es(dt),
                "date_iso": dt.isoformat(),
                "venue": "",
                "image": image,
                "cat": cat,
                "excerpt": summary_text,
                "url": link,
            })

        print(f"  ✅ {source['name']}: {len(articles)} artículos relevantes")

    except Exception as e:
        print(f"  ❌ Error con {source['name']}: {e}")

    return articles


def scrape_html_fallback(source: dict) -> list:
    """Fallback: scrape articles directly from HTML if RSS fails."""
    if not HAS_REQUESTS:
        return []

    articles = []
    try:
        print(f"  🌐 Scraping HTML de {source['name']}...")
        headers = {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
        }
        resp = requests.get(source["url"], headers=headers, timeout=15)
        resp.raise_for_status()
        soup = BeautifulSoup(resp.text, "html.parser")

        # Generic article extraction
        for article_tag in soup.find_all(["article", "div"], class_=re.compile(r"post|article|entry|item"))[:10]:
            title_tag = article_tag.find(["h1", "h2", "h3", "h4"], recursive=True)
            if not title_tag:
                continue

            title = title_tag.get_text(strip=True)
            if not title or not is_european_cinema(title):
                continue

            link_tag = title_tag.find("a", href=True) or article_tag.find("a", href=True)
            link = ""
            if link_tag:
                link = link_tag["href"]
                if link.startswith("/"):
                    link = source["url"].rstrip("/") + link

            img_tag = article_tag.find("img", src=True)
            image = img_tag["src"] if img_tag else ""
            if image and image.startswith("/"):
                image = source["url"].rstrip("/") + image
            if not image:
                image = get_fallback_image()

            excerpt_tag = article_tag.find(["p", "div"], class_=re.compile(r"excerpt|summary|desc"))
            excerpt = excerpt_tag.get_text(strip=True) if excerpt_tag else ""

            # Skip English articles
            if not is_spanish(title + " " + excerpt, link):
                continue

            cat = categorize_article(title, excerpt, source["category"])

            articles.append({
                "id": generate_id(title),
                "title": title,
                "source": source["name"],
                "date": format_date_es(datetime.now()),
                "date_iso": datetime.now().isoformat(),
                "venue": "",
                "image": image,
                "cat": cat,
                "excerpt": excerpt[:300],
                "url": link or source["url"],
            })

        print(f"  ✅ {source['name']} (HTML): {len(articles)} artículos")

    except Exception as e:
        print(f"  ❌ Error HTML {source['name']}: {e}")

    return articles


def deduplicate(articles: list) -> list:
    """Remove duplicate articles based on similar titles."""
    seen_titles = set()
    unique = []

    for article in articles:
        # Normalize title for comparison
        normalized = re.sub(r"[^a-záéíóúñ0-9]", "", article["title"].lower())[:50]
        if normalized not in seen_titles:
            seen_titles.add(normalized)
            unique.append(article)

    return unique


def load_existing_data(data_file: Path) -> dict:
    """Load existing data.json if available."""
    if data_file.exists():
        try:
            with open(data_file, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            pass
    return {}


def merge_articles(existing: list, new: list, max_articles: int = 50) -> list:
    """Merge new articles with existing ones, keeping the most recent."""
    existing_ids = {a["id"] for a in existing}
    merged = list(existing)

    for article in new:
        if article["id"] not in existing_ids:
            merged.append(article)
            existing_ids.add(article["id"])

    # Sort by date (newest first)
    merged.sort(key=lambda a: a.get("date_iso", ""), reverse=True)

    # Keep only the most recent
    return merged[:max_articles]


# ─── Static data that doesn't change often ───
STATIC_FESTIVALS = [
    {
        "name": "Festival de Málaga",
        "dates": "6 — 15 Mar 2026",
        "status": "En curso",
        "live": True,
        "city": "Málaga, España",
        "desc": "Cine en español y mercado MAFIZ. Sección oficial y Zonazine.",
        "url": "https://festivaldemalaga.com",
        "color": "#C0392B",
        "edition": "29ª edición",
        "jury": "",
    },
    {
        "name": "Thessaloniki Doc",
        "dates": "5 — 15 Mar 2026",
        "status": "En curso",
        "live": True,
        "city": "Tesalónica, Grecia",
        "desc": "38 títulos en competencia documental.",
        "url": "https://www.filmfestival.gr",
        "color": "#2C3E50",
        "edition": "28ª edición",
        "jury": "",
    },
    {
        "name": "D'A Barcelona",
        "dates": "19 — 29 Mar 2026",
        "status": "Próximo",
        "live": False,
        "city": "Barcelona, España",
        "desc": "122 films · 27 estrenos mundiales · 55 films dirigidos por mujeres",
        "url": "https://dafilmfestival.com",
        "color": "#8E44AD",
        "edition": "15ª edición",
        "jury": "Hansen-Løve, Petzold, Martel, Sangsoo",
    },
    {
        "name": "Series Mania",
        "dates": "20 — 27 Mar 2026",
        "status": "Próximo",
        "live": False,
        "city": "Lille, Francia",
        "desc": "Festival europeo de series de televisión.",
        "url": "https://seriesmania.com",
        "color": "#16A085",
        "edition": "8ª edición",
        "jury": "",
    },
    {
        "name": "BAFICI",
        "dates": "1 — 13 Abr 2026",
        "status": "Próximo",
        "live": False,
        "city": "Buenos Aires, Argentina",
        "desc": "298 films · 44 países · 112 estrenos mundiales",
        "url": "https://festivales.buenosaires.gob.ar/bafici",
        "color": "#E67E22",
        "edition": "27ª edición",
        "jury": "",
    },
    {
        "name": "Festival de Cannes",
        "dates": "12 — 23 May 2026",
        "status": "Selección 9 Abr",
        "live": False,
        "city": "Cannes, Francia",
        "desc": "La cita más importante del cine mundial. Selección oficial el 9 de abril.",
        "url": "https://www.festival-cannes.com",
        "color": "#D4AF37",
        "edition": "79ª edición",
        "jury": "Presidente: Park Chan-wook",
    },
    {
        "name": "Mostra de Venecia",
        "dates": "27 Ago — 6 Sep 2026",
        "status": "Próximo",
        "live": False,
        "city": "Venecia, Italia",
        "desc": "La mostra más antigua del mundo.",
        "url": "https://www.labiennale.org",
        "color": "#1A5276",
        "edition": "83ª edición",
        "jury": "",
    },
]

STATIC_RELEASES = [
    {"title": "Calle Málaga", "director": "Maryam Touzani", "country": "Marruecos / España", "day": "6", "month": "MAR", "platform": "CINES", "rating": 7.7, "url": "https://www.fotogramas.es"},
    {"title": "Fue solo un accidente", "director": "Jafar Panahi", "country": "Irán", "day": "6", "month": "MAR", "platform": "MUBI", "rating": 8.0, "url": "https://mubi.com"},
    {"title": "La Grazia", "director": "Paolo Sorrentino", "country": "Italia", "day": "13", "month": "MAR", "platform": "CINES", "rating": 7.9, "url": "https://www.fotogramas.es"},
    {"title": "Amarga Navidad", "director": "Pedro Almodóvar", "country": "España", "day": "20", "month": "MAR", "platform": "CINES", "rating": 8.2, "url": "https://www.fotogramas.es"},
    {"title": "Pompeya: Bajo las Nubes", "director": "Gianfranco Rosi", "country": "Italia", "day": "27", "month": "MAR", "platform": "MUBI", "rating": 8.1, "url": "https://mubi.com"},
    {"title": "El síndrome Rembrandt", "director": "Pierre Schoeller", "country": "Francia", "day": "—", "month": "ABR", "platform": "CINES", "rating": 7.5, "url": "https://www.fotogramas.es"},
]

STATIC_PLATFORMS = [
    {"name": "MUBI", "highlight": "Gianfranco Rosi + Jafar Panahi", "films": ["Fue solo un accidente (Panahi)", "Pompeya: Bajo las Nubes (Rosi)", "Programa triple Verhoeven", "Los Estados Unidos de Wiseman"]},
    {"name": "Filmin", "highlight": "Cine político y de autor", "films": ["Valor sentimental", "La voz de Hind", "Mr. Nobody contra Putin", "Ciudad sin sueño"]},
    {"name": "HBO Max", "highlight": "Series europeas de marzo", "films": ["Portobello (Italia)", "Como agua para chocolate S2"]},
    {"name": "Prime Video", "highlight": "Cuando el Cielo se Equivoca", "films": ["Cuando el Cielo se Equivoca (5 Mar)"]},
]

STATIC_REVIEWS = [
    {"title": "Yellow Letters", "director": "Ilker Çatak", "score": 8.5, "badge": "Oso de Oro", "text": "Cuestiona la identidad y la pertenencia con elegancia formal extraordinaria."},
    {"title": "Meine Frau weint", "director": "Angela Schanelec", "score": 8.3, "badge": "Berlinale", "text": "Rigor formal y humanismo austero en una obra luminosa."},
    {"title": "London", "director": "Sebastian Brameshuber", "score": 8.1, "badge": "Berlinale", "text": "Cine austríaco en estado de gracia. Uno de los grandes títulos del año."},
    {"title": "Fue solo un accidente", "director": "Jafar Panahi", "score": 8.0, "badge": "MUBI", "text": "La experiencia en prisión se convierte en un dilema moral extraordinario."},
]

STATIC_TRAILERS = [
    {"title": "Yellow Letters", "sub": "Ilker Çatak", "thumb": "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&q=80", "dur": "2:22", "ytId": "dQw4w9WgXcQ"},
    {"title": "Amarga Navidad", "sub": "Pedro Almodóvar", "thumb": "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80", "dur": "2:31", "ytId": "dQw4w9WgXcQ"},
    {"title": "Pompeya: Bajo las Nubes", "sub": "Gianfranco Rosi", "thumb": "https://images.unsplash.com/photo-1518676590747-1e3dcf5a0e32?w=800&q=80", "dur": "2:12", "ytId": "dQw4w9WgXcQ"},
    {"title": "La Grazia", "sub": "Paolo Sorrentino", "thumb": "https://images.unsplash.com/photo-1460881680858-30d872d5b430?w=800&q=80", "dur": "2:45", "ytId": "dQw4w9WgXcQ"},
]


def main():
    print("═" * 50)
    print("🎬 CINEEUROPA — Scraper automático")
    print(f"📅 {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("═" * 50)

    data_file = Path(__file__).parent / "data.json"

    # Load existing data
    existing_data = load_existing_data(data_file)
    existing_news = existing_data.get("news", [])

    # Scrape all sources
    all_articles = []
    for source in SOURCES:
        articles = scrape_rss(source)
        if not articles:
            articles = scrape_html_fallback(source)
        all_articles.extend(articles)

    print(f"\n📊 Total artículos scrapeados: {len(all_articles)}")

    # Deduplicate
    all_articles = deduplicate(all_articles)
    print(f"📊 Después de deduplicar: {len(all_articles)}")

    # Merge with existing
    merged_news = merge_articles(existing_news, all_articles)
    print(f"📊 Total en data.json: {len(merged_news)}")

    # Build final data
    data = {
        "last_updated": datetime.now().isoformat(),
        "news": merged_news,
        "releases": STATIC_RELEASES,
        "festivals": STATIC_FESTIVALS,
        "platforms": STATIC_PLATFORMS,
        "reviews": STATIC_REVIEWS,
        "trailers": STATIC_TRAILERS,
    }

    # Save
    with open(data_file, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"\n✅ data.json guardado ({data_file.stat().st_size / 1024:.1f} KB)")
    print("═" * 50)


if __name__ == "__main__":
    main()
