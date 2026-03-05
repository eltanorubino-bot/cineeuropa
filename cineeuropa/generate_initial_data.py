#!/usr/bin/env python3
"""Generate initial data.json from the static data in the HTML."""
import json
from datetime import datetime

data = {
    "last_updated": datetime.now().isoformat(),
    "news": [
        {"id":"a1","title":"Yellow Letters de Ilker Çatak gana el Oso de Oro en la Berlinale 2026","source":"Cineuropa","date":"JUE 5 MAR 2026","date_iso":"2026-03-05T12:00:00","venue":"Berlinale — Berlín","image":"https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&q=80","cat":"FESTIVALES","excerpt":"El film del director germano-turco se impuso en la competencia oficial de la 76ª Berlinale, confirmando a Çatak como una de las voces más potentes del cine europeo contemporáneo.","url":"https://cineuropa.org"},
        {"id":"a2","title":"Cannes 2026: selección oficial el 9 de abril — Park Chan-wook presidente del jurado","source":"Cineuropa","date":"MIÉ 4 MAR 2026","date_iso":"2026-03-04T12:00:00","venue":"Cannes — Francia","image":"https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?w=800&q=80","cat":"FESTIVALES","excerpt":"La 79ª edición del festival revelará su programación oficial en una conferencia de prensa en París.","url":"https://cineuropa.org"},
        {"id":"a3","title":"BAFICI 26: 298 películas de 44 países con 112 estrenos mundiales","source":"A Sala Llena","date":"MIÉ 4 MAR 2026","date_iso":"2026-03-04T10:00:00","venue":"Buenos Aires — Argentina","image":"https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&q=80","cat":"ARGENTINA","excerpt":"El festival porteño se celebra del 1 al 13 de abril con una programación ambiciosa que incluye retrospectivas, competencia internacional y secciones paralelas.","url":"https://asalallena.com.ar"},
        {"id":"a4","title":"D'A Barcelona 2026 suma a Lucrecia Martel, Hong Sangsoo y Valérie Donzelli","source":"Kinotico","date":"LUN 3 MAR 2026","date_iso":"2026-03-03T12:00:00","venue":"D'A Film Festival — Barcelona","image":"https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&q=80","cat":"FESTIVALES","excerpt":"122 films, 27 estrenos mundiales y 55 obras dirigidas por mujeres en la edición más ambiciosa del festival barcelonés.","url":"https://kinotico.es"},
        {"id":"a5","title":"MUBI en marzo: Gianfranco Rosi y Jafar Panahi encabezan la cartelera","source":"Otros Cines","date":"LUN 3 MAR 2026","date_iso":"2026-03-03T10:00:00","venue":"Plataforma","cat":"PLATAFORMAS","excerpt":"Pompeya: Bajo las Nubes y Fue solo un accidente. Ciclos de Verhoeven y Wiseman.","url":"https://otroscines.com","image":"https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&q=80"},
        {"id":"a6","title":"Angela Schanelec y Brameshuber brillan en la competencia de Berlinale","source":"A Sala Llena","date":"SÁB 1 MAR 2026","date_iso":"2026-03-01T12:00:00","venue":"Berlinale — Berlín","cat":"FESTIVALES","excerpt":"Schanelec y Brameshuber fueron destacadas como lo mejor de la sección oficial.","url":"https://asalallena.com.ar","image":"https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=800&q=80"},
        {"id":"a7","title":"Filmin en marzo: Valor sentimental, La voz de Hind y más","source":"Otros Cines","date":"VIE 28 FEB 2026","date_iso":"2026-02-28T12:00:00","venue":"Plataforma","cat":"PLATAFORMAS","excerpt":"Cine político, documentales y cine de autor europeo llegan a la plataforma.","url":"https://otroscines.com","image":""},
        {"id":"a8","title":"D'A 2026: Un Impulso Colectivo, el oasis del cine español independiente","source":"El Antepenúltimo Mohicano","date":"MIÉ 25 FEB 2026","date_iso":"2026-02-25T12:00:00","venue":"D'A — Barcelona","cat":"FESTIVALES","excerpt":"Selección audaz de nuevas voces del cine español contemporáneo.","url":"https://elantepenultimomohicano.com","image":""},
        {"id":"a9","title":"La Fiesta del Cine 2026 convocó a 430.000 personas en tres días","source":"Otros Cines","date":"MIÉ 26 FEB 2026","date_iso":"2026-02-26T12:00:00","venue":"Argentina","cat":"ARGENTINA","excerpt":"La séptima edición con entradas a $4.000 fue un éxito masivo de convocatoria.","url":"https://otroscines.com","image":""},
        {"id":"a10","title":"Todos los ganadores de los Actor Awards 2026","source":"Escribiendo Cine","date":"DOM 2 MAR 2026","date_iso":"2026-03-02T12:00:00","venue":"Ceremonia","cat":"FESTIVALES","excerpt":"La ceremonia de premios reveló sus ganadores con sorpresas.","url":"https://escribiendocine.com","image":""},
        {"id":"a11","title":"Oscar 2026: la ceremonia será el 15 de marzo en el Dolby Theatre","source":"Escribiendo Cine","date":"SÁB 1 MAR 2026","date_iso":"2026-03-01T10:00:00","venue":"Los Ángeles","cat":"FESTIVALES","excerpt":"La Academia entregará los premios con varias películas europeas nominadas.","url":"https://escribiendocine.com","image":""},
        {"id":"a12","title":"Werner Herzog, Petzold y Mumenthaler encabezan el D'A 2026","source":"El Antepenúltimo Mohicano","date":"JUE 20 FEB 2026","date_iso":"2026-02-20T12:00:00","venue":"D'A — Barcelona","cat":"FESTIVALES","excerpt":"Grandes nombres del cine de autor europeo y latinoamericano.","url":"https://elantepenultimomohicano.com","image":""}
    ],
    "releases": [
        {"title":"Calle Málaga","director":"Maryam Touzani","country":"Marruecos / España","day":"6","month":"MAR","platform":"CINES","rating":7.7,"url":"https://www.fotogramas.es"},
        {"title":"Fue solo un accidente","director":"Jafar Panahi","country":"Irán","day":"6","month":"MAR","platform":"MUBI","rating":8.0,"url":"https://mubi.com"},
        {"title":"La Grazia","director":"Paolo Sorrentino","country":"Italia","day":"13","month":"MAR","platform":"CINES","rating":7.9,"url":"https://www.fotogramas.es"},
        {"title":"Amarga Navidad","director":"Pedro Almodóvar","country":"España","day":"20","month":"MAR","platform":"CINES","rating":8.2,"url":"https://www.fotogramas.es"},
        {"title":"Pompeya: Bajo las Nubes","director":"Gianfranco Rosi","country":"Italia","day":"27","month":"MAR","platform":"MUBI","rating":8.1,"url":"https://mubi.com"},
        {"title":"El síndrome Rembrandt","director":"Pierre Schoeller","country":"Francia","day":"—","month":"ABR","platform":"CINES","rating":7.5,"url":"https://www.fotogramas.es"}
    ],
    "festivals": [
        {"name":"Festival de Málaga","dates":"6 — 15 Mar 2026","status":"En curso","live":True,"city":"Málaga, España","desc":"Cine en español y mercado MAFIZ. Sección oficial y Zonazine.","url":"https://festivaldemalaga.com","color":"#C0392B","edition":"29ª edición","jury":""},
        {"name":"Thessaloniki Doc","dates":"5 — 15 Mar 2026","status":"En curso","live":True,"city":"Tesalónica, Grecia","desc":"38 títulos en competencia documental.","url":"https://www.filmfestival.gr","color":"#2C3E50","edition":"28ª edición","jury":""},
        {"name":"D'A Barcelona","dates":"19 — 29 Mar 2026","status":"Próximo","live":False,"city":"Barcelona, España","desc":"122 films · 27 estrenos mundiales · 55 films dirigidos por mujeres","url":"https://dafilmfestival.com","color":"#8E44AD","edition":"15ª edición","jury":"Hansen-Løve, Petzold, Martel, Sangsoo"},
        {"name":"Series Mania","dates":"20 — 27 Mar 2026","status":"Próximo","live":False,"city":"Lille, Francia","desc":"Festival europeo de series de televisión.","url":"https://seriesmania.com","color":"#16A085","edition":"8ª edición","jury":""},
        {"name":"BAFICI","dates":"1 — 13 Abr 2026","status":"Próximo","live":False,"city":"Buenos Aires, Argentina","desc":"298 films · 44 países · 112 estrenos mundiales","url":"https://festivales.buenosaires.gob.ar/bafici","color":"#E67E22","edition":"27ª edición","jury":""},
        {"name":"Festival de Cannes","dates":"12 — 23 May 2026","status":"Selección 9 Abr","live":False,"city":"Cannes, Francia","desc":"La cita más importante del cine mundial. Selección oficial el 9 de abril.","url":"https://www.festival-cannes.com","color":"#D4AF37","edition":"79ª edición","jury":"Presidente: Park Chan-wook"},
        {"name":"Mostra de Venecia","dates":"27 Ago — 6 Sep 2026","status":"Próximo","live":False,"city":"Venecia, Italia","desc":"La mostra más antigua del mundo.","url":"https://www.labiennale.org","color":"#1A5276","edition":"83ª edición","jury":""}
    ],
    "platforms": [
        {"name":"MUBI","highlight":"Gianfranco Rosi + Jafar Panahi","films":["Fue solo un accidente (Panahi)","Pompeya: Bajo las Nubes (Rosi)","Programa triple Verhoeven","Los Estados Unidos de Wiseman"]},
        {"name":"Filmin","highlight":"Cine político y de autor","films":["Valor sentimental","La voz de Hind","Mr. Nobody contra Putin","Ciudad sin sueño"]},
        {"name":"HBO Max","highlight":"Series europeas de marzo","films":["Portobello (Italia)","Como agua para chocolate S2"]},
        {"name":"Prime Video","highlight":"Cuando el Cielo se Equivoca","films":["Cuando el Cielo se Equivoca (5 Mar)"]}
    ],
    "reviews": [
        {"title":"Yellow Letters","director":"Ilker Çatak","score":8.5,"badge":"Oso de Oro","text":"Cuestiona la identidad y la pertenencia con elegancia formal extraordinaria."},
        {"title":"Meine Frau weint","director":"Angela Schanelec","score":8.3,"badge":"Berlinale","text":"Rigor formal y humanismo austero en una obra luminosa."},
        {"title":"London","director":"Sebastian Brameshuber","score":8.1,"badge":"Berlinale","text":"Cine austríaco en estado de gracia. Uno de los grandes títulos del año."},
        {"title":"Fue solo un accidente","director":"Jafar Panahi","score":8.0,"badge":"MUBI","text":"La experiencia en prisión se convierte en un dilema moral extraordinario."}
    ],
    "trailers": [
        {"title":"Yellow Letters","sub":"Ilker Çatak","thumb":"https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&q=80","dur":"2:22","ytId":"dQw4w9WgXcQ"},
        {"title":"Amarga Navidad","sub":"Pedro Almodóvar","thumb":"https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80","dur":"2:31","ytId":"dQw4w9WgXcQ"},
        {"title":"Pompeya: Bajo las Nubes","sub":"Gianfranco Rosi","thumb":"https://images.unsplash.com/photo-1518676590747-1e3dcf5a0e32?w=800&q=80","dur":"2:12","ytId":"dQw4w9WgXcQ"},
        {"title":"La Grazia","sub":"Paolo Sorrentino","thumb":"https://images.unsplash.com/photo-1460881680858-30d872d5b430?w=800&q=80","dur":"2:45","ytId":"dQw4w9WgXcQ"}
    ]
}

with open("data.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"✅ data.json generado ({len(data['news'])} noticias)")
