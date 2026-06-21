/* ════════════════════════════════════════════════════════════════
   HADALUZ · script.js
   Toda la lógica: router de vistas, catálogo, carrito, favoritos,
   modal de producto, partículas, cursor mágico, sonidos y easter eggs.
   ════════════════════════════════════════════════════════════════ */
'use strict';

/* ─────────────────────────────────────────────
   1. DATOS · categorías y productos
   ───────────────────────────────────────────── */
const CATEGORIAS = [
  { id:'vestidos',   nombre:'Vestidos Encantados',        emoji:'👗' },
  { id:'alas',       nombre:'Alas',                       emoji:'🦋' },
  { id:'coronas',    nombre:'Coronas',                    emoji:'👑' },
  { id:'zapatos',    nombre:'Zapatos Mágicos',            emoji:'👠' },
  { id:'accesorios', nombre:'Accesorios del Bosque',      emoji:'🍄' },
  { id:'joyas',      nombre:'Joyas Élficas',              emoji:'💎' },
  { id:'capas',      nombre:'Capas de Luna',              emoji:'🌙' },
  { id:'primavera',  nombre:'Colección Primavera Encantada', emoji:'🌸' },
];

// Generadores de ilustraciones SVG por tipo (parametrizadas por color)
// ── Helpers de ilustración ─────────────────────────────────
// Aclara (p>0) u oscurece (p<0) un color hex para dar volumen/sombras satinadas.
function shade(hex, p){
  const n = parseInt(hex.slice(1), 16);
  const r = (n>>16)&255, g = (n>>8)&255, b = n&255;
  const f = t => Math.max(0, Math.min(255, Math.round(p<0 ? t*(1+p) : t+(255-t)*p)));
  return '#' + ((1<<24) + (f(r)<<16) + (f(g)<<8) + f(b)).toString(16).slice(1);
}
// IDs únicos por SVG para que los gradientes/filtros no choquen entre productos.
let _uid = 0;
const U = () => 'a' + (++_uid).toString(36);

// Destello/chispa de 4 puntas (twinkle).
const spk = (x,y,s,c,o=1) => `<path transform="translate(${x} ${y})" d="M0 ${-s} Q${s*.18} ${-s*.18} ${s} 0 Q${s*.18} ${s*.18} 0 ${s} Q${-s*.18} ${s*.18} ${-s} 0 Q${-s*.18} ${-s*.18} 0 ${-s}Z" fill="${c}" opacity="${o}"/>`;
const dot = (x,y,r,c,o=1) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" opacity="${o}"/>`;
const diamond = (x,y,s,c,o=1) => `<path d="M${x} ${y-s} L${x+s} ${y} L${x} ${y+s} L${x-s} ${y}Z" fill="${c}" opacity="${o}"/>`;
// Florcita de 5 pétalos con centro.
const flower = (x,y,r,pc,cc) => {
  let p = '';
  for(let i=0;i<5;i++){ const a=i/5*Math.PI*2; p += `<circle cx="${(x+Math.cos(a)*r).toFixed(1)}" cy="${(y+Math.sin(a)*r).toFixed(1)}" r="${(r*.62).toFixed(1)}" fill="${pc}"/>`; }
  return p + `<circle cx="${x}" cy="${y}" r="${(r*.55).toFixed(1)}" fill="${cc}"/>`;
};
// Mariposita discreta.
const fly = (x,y) => `<g transform="translate(${x} ${y})" opacity=".8"><path d="M0 0 C-6 -6 -10 -2 -7 3 C-5 6 -1 4 0 0Z" fill="#ff9ed8"/><path d="M0 0 C6 -6 10 -2 7 3 C5 6 1 4 0 0Z" fill="#cdb8ff"/><line x1="0" y1="-2" x2="0" y2="4" stroke="#7a4f80" stroke-width="1"/></g>`;
// Sombra de piso difuminada (efecto flotando).
const floor = u => `<ellipse cx="70" cy="128" rx="32" ry="6.5" fill="#7a4f80" opacity=".15" filter="url(#bl${u})"/>`;
// Halo pastel suave detrás del objeto para separarlo del fondo blanco.
const halo = c => `<ellipse cx="70" cy="74" rx="50" ry="50" fill="${c}" opacity=".10"/>`;
// Polvo mágico discreto alrededor (estrellitas, chispas, mariposa).
const magic = () => `${spk(24,30,4,'#ffd24a',.85)}${spk(116,40,3,'#fff',.8)}${spk(108,98,3.4,'#ff5bb5',.7)}${dot(20,68,1.6,'#cdb8ff',.85)}${dot(122,72,1.6,'#8fd8ff',.85)}${spk(30,106,2.6,'#fff',.7)}${fly(114,22)}`;

const ART = {
  // VESTIDO · corpiño satinado, capas de tul, pliegues, mangas, moño dorado, perlas, flores, cristales
  vestidos:(c1,c2)=>{const u=U();const dk=shade(c1,-.28),lt=shade(c1,.4),au='#ffd24a';return `<svg viewBox="0 0 140 140" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${lt}"/><stop offset=".55" stop-color="${c1}"/><stop offset="1" stop-color="${shade(c2,-.15)}"/></linearGradient><linearGradient id="bod${u}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${lt}"/><stop offset="1" stop-color="${shade(c1,-.22)}"/></linearGradient><filter id="bl${u}"><feGaussianBlur stdDeviation="2.4"/></filter></defs>${floor(u)}${halo(c1)}<path d="M40 60 Q70 132 100 60 Q104 92 96 112 Q70 124 44 112 Q36 92 40 60Z" fill="${c2}" opacity=".4"/><path d="M44 58 Q70 126 96 58 Q100 88 92 108 Q70 120 48 108 Q40 88 44 58Z" fill="${c1}" opacity=".55"/><path d="M48 50 Q38 54 40 64 Q46 60 52 58Z" fill="${c1}" opacity=".7"/><path d="M92 50 Q102 54 100 64 Q94 60 88 58Z" fill="${c1}" opacity=".7"/><path d="M52 46 Q70 38 88 46 L86 70 Q70 76 54 70Z" fill="url(#bod${u})"/><path d="M54 70 Q70 76 86 70 L98 116 Q70 128 42 116Z" fill="url(#g${u})"/><path d="M60 74 L54 114" stroke="${dk}" stroke-width="1.5" opacity=".35"/><path d="M70 76 L70 120" stroke="${dk}" stroke-width="1.5" opacity=".3"/><path d="M80 74 L86 114" stroke="${dk}" stroke-width="1.5" opacity=".35"/><path d="M58 72 Q64 96 60 116" stroke="#fff" stroke-width="3" opacity=".4" fill="none"/><rect x="53" y="69" width="34" height="5" rx="2.5" fill="${au}"/><path d="M70 71 L60 65 Q56 71 60 77Z" fill="${au}"/><path d="M70 71 L80 65 Q84 71 80 77Z" fill="${au}"/><circle cx="70" cy="71" r="3" fill="#fff2c0"/><circle cx="62" cy="48" r="1.8" fill="#fff"/><circle cx="70" cy="46" r="2" fill="#fff"/><circle cx="78" cy="48" r="1.8" fill="#fff"/>${flower(64,88,4,'#fff','#ffd24a')}${flower(80,100,4.5,'#fff',c2)}${spk(72,104,3,'#fff',.9)}${diamond(58,100,3,'#fff',.85)}${magic()}</svg>`;},

  // ALAS · cuatro alas iridiscentes translúcidas, venas, ocelos, bordes luminosos, destellos
  alas:(c1,c2)=>{const u=U();return `<svg viewBox="0 0 140 140" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="iri${u}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffe1f3"/><stop offset=".35" stop-color="${c1}"/><stop offset=".7" stop-color="${c2}"/><stop offset="1" stop-color="#d4f6ea"/></linearGradient><radialGradient id="oc${u}"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="${shade(c2,-.1)}"/></radialGradient><filter id="bl${u}"><feGaussianBlur stdDeviation="2.4"/></filter></defs>${floor(u)}${halo(c1)}<path d="M70 64 C30 24 14 40 16 64 C18 86 44 84 70 64Z" fill="url(#iri${u})" opacity=".9" stroke="#fff" stroke-width="1.4" stroke-opacity=".7"/><path d="M70 64 C110 24 126 40 124 64 C122 86 96 84 70 64Z" fill="url(#iri${u})" opacity=".9" stroke="#fff" stroke-width="1.4" stroke-opacity=".7"/><path d="M70 70 C42 78 28 96 36 112 C44 124 64 110 70 78Z" fill="url(#iri${u})" opacity=".82" stroke="#fff" stroke-width="1.2" stroke-opacity=".6"/><path d="M70 70 C98 78 112 96 104 112 C96 124 76 110 70 78Z" fill="url(#iri${u})" opacity=".82" stroke="#fff" stroke-width="1.2" stroke-opacity=".6"/><path d="M68 64 C46 50 34 56 26 66" stroke="#fff" stroke-width="1.3" fill="none" opacity=".7"/><path d="M72 64 C94 50 106 56 114 66" stroke="#fff" stroke-width="1.3" fill="none" opacity=".7"/><path d="M66 76 C50 84 42 96 40 108" stroke="#fff" stroke-width="1.1" fill="none" opacity=".6"/><path d="M74 76 C90 84 98 96 100 108" stroke="#fff" stroke-width="1.1" fill="none" opacity=".6"/><circle cx="40" cy="56" r="6" fill="url(#oc${u})" opacity=".9"/><circle cx="100" cy="56" r="6" fill="url(#oc${u})" opacity=".9"/><circle cx="46" cy="96" r="4.5" fill="url(#oc${u})" opacity=".85"/><circle cx="94" cy="96" r="4.5" fill="url(#oc${u})" opacity=".85"/><ellipse cx="70" cy="72" rx="3.2" ry="13" fill="${shade(c2,-.3)}"/><circle cx="70" cy="58" r="3.4" fill="${shade(c2,-.3)}"/><circle cx="70" cy="64" r="1.4" fill="#fff"/><circle cx="70" cy="70" r="1.4" fill="#fff"/><circle cx="70" cy="76" r="1.4" fill="#fff"/>${spk(18,60,3.5,'#fff',.9)}${spk(122,60,3.5,'#fff',.9)}${magic()}</svg>`;},

  // CORONA · banda dorada, gemas facetadas, perlas, hojas doradas, luna y estrellas
  coronas:(c1,c2)=>{const u=U();const g1='#ffd24a';return `<svg viewBox="0 0 140 140" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="au${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff3c4"/><stop offset=".5" stop-color="#ffd24a"/><stop offset="1" stop-color="#e0a02e"/></linearGradient><radialGradient id="gem${u}"><stop offset="0" stop-color="#fff"/><stop offset=".5" stop-color="${c1}"/><stop offset="1" stop-color="${shade(c1,-.3)}"/></radialGradient><filter id="bl${u}"><feGaussianBlur stdDeviation="2.4"/></filter></defs>${floor(u)}${halo(c1)}<path d="M28 92 L34 50 L52 74 L70 40 L88 74 L106 50 L112 92Z" fill="url(#au${u})" stroke="#e0a02e" stroke-width="1"/><rect x="28" y="90" width="84" height="12" rx="5" fill="url(#au${u})" stroke="#e0a02e" stroke-width="1"/><path d="M32 94 h76" stroke="#fff" stroke-width="2" opacity=".6"/><circle cx="34" cy="48" r="5.5" fill="url(#gem${u})"/>${diamond(70,38,7,'#fff',.95)}<path d="M70 33 L74 40 L70 47 L66 40Z" fill="${c2}" opacity=".7"/><circle cx="106" cy="48" r="5.5" fill="url(#gem${u})"/><path d="M70 78 L80 92 L70 108 L60 92Z" fill="url(#gem${u})" stroke="#fff" stroke-width="1"/><path d="M60 92 L80 92 M70 78 L70 108" stroke="#fff" stroke-width="1" opacity=".7"/><circle cx="44" cy="96" r="2.4" fill="#fff"/><circle cx="56" cy="96" r="2.4" fill="#fff"/><circle cx="84" cy="96" r="2.4" fill="#fff"/><circle cx="96" cy="96" r="2.4" fill="#fff"/><path d="M30 78 Q22 70 26 60 Q34 66 32 78Z" fill="${g1}" opacity=".9"/><path d="M110 78 Q118 70 114 60 Q106 66 108 78Z" fill="${g1}" opacity=".9"/><path d="M52 60 a5 5 0 1 0 4 8 a4 4 0 1 1 -4 -8Z" fill="#fff" opacity=".9"/>${spk(88,58,3.5,'#fff',.9)}${spk(70,24,3,g1,.9)}${magic()}</svg>`;},

  // ZAPATO · bailarina satinada, suela brillante, tira con hebilla, moño, flor, cristales
  zapatos:(c1,c2)=>{const u=U();const dk=shade(c1,-.28);return `<svg viewBox="0 0 140 140" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${shade(c1,.4)}"/><stop offset="1" stop-color="${shade(c1,-.18)}"/></linearGradient><linearGradient id="sole${u}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="${c2}"/></linearGradient><filter id="bl${u}"><feGaussianBlur stdDeviation="2.4"/></filter></defs>${floor(u)}${halo(c1)}<path d="M30 98 Q40 106 70 106 Q96 106 104 98 Q104 92 96 92 L38 92 Q30 92 30 98Z" fill="url(#sole${u})"/><path d="M34 92 Q34 64 56 62 Q64 78 92 80 Q102 82 102 92 Q102 96 96 96 L40 96 Q34 96 34 92Z" fill="url(#g${u})" stroke="${dk}" stroke-width="1" stroke-opacity=".4"/><path d="M40 76 Q56 70 70 78" stroke="#fff" stroke-width="3" fill="none" opacity=".5"/><path d="M58 64 Q60 78 72 80" stroke="${dk}" stroke-width="3.5" fill="none" opacity=".7"/><rect x="62" y="70" width="6" height="6" rx="1.5" fill="#e8eefc" stroke="#b9c4dd"/><g transform="translate(56 60)"><path d="M0 0 L-13 -8 Q-18 0 -13 8Z" fill="${c2}"/><path d="M0 0 L13 -8 Q18 0 13 8Z" fill="${c2}"/><circle r="3.5" fill="${shade(c2,-.2)}"/><circle r="1.6" fill="#fff"/></g>${flower(92,84,4,'#fff','#ffd24a')}${diamond(46,86,3,'#fff',.9)}${spk(100,88,3,'#fff',.85)}${magic()}</svg>`;},

  // ACCESORIO · hongo encantado kawaii, lunares perlados, satén, carita, brillo
  accesorios:(c1,c2)=>{const u=U();return `<svg viewBox="0 0 140 140" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="cap${u}" cx=".4" cy=".3"><stop offset="0" stop-color="${shade(c1,.4)}"/><stop offset="1" stop-color="${shade(c1,-.15)}"/></radialGradient><linearGradient id="st${u}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff7ef"/><stop offset="1" stop-color="#f0ddc4"/></linearGradient><filter id="bl${u}"><feGaussianBlur stdDeviation="2.4"/></filter></defs>${floor(u)}${halo(c1)}<path d="M40 110 Q44 100 48 110 M52 110 Q56 98 60 110 M80 110 Q84 100 88 110" stroke="${c2}" stroke-width="3" fill="none" stroke-linecap="round" opacity=".7"/><path d="M58 110 Q56 86 62 78 L78 78 Q84 86 82 110Z" fill="url(#st${u})" stroke="#e6cfa8" stroke-width="1"/><path d="M30 80 Q34 46 70 44 Q106 46 110 80 Q70 92 30 80Z" fill="url(#cap${u})" stroke="${shade(c1,-.25)}" stroke-width="1" stroke-opacity=".4"/><circle cx="54" cy="64" r="6" fill="#fff" opacity=".95"/><circle cx="78" cy="60" r="7" fill="#fff" opacity=".95"/><circle cx="92" cy="72" r="4.5" fill="#fff" opacity=".95"/><circle cx="42" cy="76" r="4" fill="#fff" opacity=".9"/><path d="M40 64 Q52 52 70 52" stroke="#fff" stroke-width="3" fill="none" opacity=".5"/><circle cx="64" cy="88" r="1.4" fill="${shade(c1,-.4)}"/><circle cx="76" cy="88" r="1.4" fill="${shade(c1,-.4)}"/><path d="M68 91 Q70 93 72 91" stroke="${shade(c1,-.4)}" stroke-width="1" fill="none"/><circle cx="60" cy="90" r="2" fill="#ff9ec0" opacity=".55"/><circle cx="80" cy="90" r="2" fill="#ff9ec0" opacity=".55"/>${spk(108,52,3.4,'#ffd24a',.9)}${flower(30,98,3.5,'#fff',c2)}${magic()}</svg>`;},

  // JOYA · gema colgante facetada, cadena dorada, facetas y brillo
  joyas:(c1,c2)=>{const u=U();return `<svg viewBox="0 0 140 140" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="gem${u}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff"/><stop offset=".45" stop-color="${c1}"/><stop offset="1" stop-color="${shade(c2,-.22)}"/></linearGradient><linearGradient id="ch${u}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff3c4"/><stop offset="1" stop-color="#ffd24a"/></linearGradient><filter id="bl${u}"><feGaussianBlur stdDeviation="2.4"/></filter></defs>${floor(u)}${halo(c1)}<path d="M40 40 Q70 58 100 40" stroke="url(#ch${u})" stroke-width="2.4" fill="none"/><circle cx="40" cy="40" r="2.2" fill="#ffd24a"/><circle cx="100" cy="40" r="2.2" fill="#ffd24a"/><circle cx="70" cy="56" r="4" fill="url(#ch${u})"/><path d="M70 62 L92 78 L70 116 L48 78Z" fill="url(#gem${u})" stroke="#fff" stroke-width="1.2" stroke-opacity=".8"/><path d="M48 78 L92 78 M70 62 L70 116 M58 70 L70 78 L82 70 M48 78 L70 116 L92 78" stroke="#fff" stroke-width="1" opacity=".55" fill="none"/><path d="M64 70 L70 76 L62 84Z" fill="#fff" opacity=".7"/>${spk(70,90,4,'#fff',.9)}${spk(48,64,3,'#ffd24a',.85)}${spk(96,70,3,'#fff',.8)}${magic()}</svg>`;},

  // CAPA · manto con forro, pliegues, broche luna, constelación de estrellas
  capas:(c1,c2)=>{const u=U();return `<svg viewBox="0 0 140 140" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${shade(c1,.3)}"/><stop offset=".5" stop-color="${c1}"/><stop offset="1" stop-color="${shade(c2,-.2)}"/></linearGradient><filter id="bl${u}"><feGaussianBlur stdDeviation="2.4"/></filter></defs>${floor(u)}${halo(c1)}<path d="M44 38 Q70 30 96 38 L112 116 Q70 130 28 116Z" fill="url(#g${u})"/><path d="M52 40 Q70 52 88 40 L84 60 Q70 68 56 60Z" fill="${shade(c1,.45)}" opacity=".6"/><path d="M58 50 L48 112 M70 56 L70 122 M82 50 L92 112" stroke="${shade(c2,-.25)}" stroke-width="1.5" opacity=".3"/><path d="M44 38 Q70 56 96 38" stroke="#fff" stroke-width="2" fill="none" opacity=".5"/><path d="M64 40 a6 6 0 1 0 5 9 a4.6 4.6 0 1 1 -5 -9Z" fill="#ffd24a"/>${spk(56,74,3,'#fff',.95)}${spk(80,86,3.4,'#fff',.95)}${spk(66,98,2.6,'#fff',.9)}${spk(88,66,2.4,'#fff',.85)}<line x1="56" y1="74" x2="66" y2="98" stroke="#fff" stroke-width=".6" opacity=".5"/><line x1="66" y1="98" x2="80" y2="86" stroke="#fff" stroke-width=".6" opacity=".5"/><circle cx="50" cy="90" r="1.4" fill="#fff" opacity=".8"/><circle cx="92" cy="100" r="1.4" fill="#fff" opacity=".8"/>${magic()}</svg>`;},

  // PRIMAVERA · flor multicapa con centro dorado, rocío perlado y hojas
  primavera:(c1,c2)=>{const u=U();return `<svg viewBox="0 0 140 140" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="pet${u}" cx=".5" cy=".3"><stop offset="0" stop-color="#fff"/><stop offset=".6" stop-color="${c1}"/><stop offset="1" stop-color="${shade(c1,-.18)}"/></radialGradient><radialGradient id="pet2${u}" cx=".5" cy=".3"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="${c2}"/></radialGradient><filter id="bl${u}"><feGaussianBlur stdDeviation="2.4"/></filter></defs>${floor(u)}${halo(c1)}<path d="M70 104 Q50 104 40 90 Q58 86 70 100Z" fill="#9be9bf" opacity=".9"/><path d="M70 104 Q90 104 100 90 Q82 86 70 100Z" fill="#9be9bf" opacity=".9"/><g>${[0,1,2,3,4,5,6,7].map(i=>`<ellipse cx="70" cy="46" rx="11" ry="20" fill="url(#pet2${u})" opacity=".7" transform="rotate(${i*45} 70 70)"/>`).join('')}</g><g>${[0,1,2,3,4].map(i=>`<ellipse cx="70" cy="44" rx="13" ry="22" fill="url(#pet${u})" transform="rotate(${i*72} 70 70)"/>`).join('')}</g><circle cx="70" cy="70" r="13" fill="#ffd24a"/>${[0,1,2,3,4,5].map(i=>{const a=i/6*6.2832;return `<circle cx="${(70+Math.cos(a)*6).toFixed(1)}" cy="${(70+Math.sin(a)*6).toFixed(1)}" r="1.8" fill="#e0962a"/>`;}).join('')}<circle cx="70" cy="70" r="2" fill="#fff7d0"/><circle cx="58" cy="52" r="2.2" fill="#fff" opacity=".9"/><circle cx="84" cy="56" r="2" fill="#fff" opacity=".85"/>${magic()}</svg>`;},
};


// Catálogo (id, nombre, categoría, precio, precio viejo, colores, talles, tag, descripción)
const PRODUCTOS = [
  { id:1,  cat:'vestidos',  nombre:'Vestido Rocío de Aurora', precio:24900, viejo:null,  tag:'nuevo',    colores:['#ff9ed8','#cdb8ff','#c7ecff'], talles:['XS','S','M','L'], rating:5, desc:'Tul de luz de luna que cambia de tono con la primera estrella de la noche.', largo:'Tejido a mano con hilos de rocío y tul de magnolia, este vestido se ilumina suavemente al caer el sol. La falda en capas flota con cada paso como si bailaras sobre el viento. Ideal para bailes de luciérnagas y noches de luna llena.' },
  { id:2,  cat:'alas',      nombre:'Alas de Cristal Iridiscente', precio:18900, viejo:26900, tag:'vendido', colores:['#c7ecff','#cdb8ff','#b3f5d1'], talles:['Única'], rating:5, desc:'Alas livianas como un suspiro, con reflejos arcoíris según la luz.', largo:'Estructura de pétalo translúcido con venas iridiscentes que destellan en mil colores. Tan livianas que olvidás que las llevás puestas. Sujeción de seda de araña encantada, suave y resistente.' },
  { id:3,  cat:'coronas',   nombre:'Corona de Estrellas Dormidas', precio:15900, viejo:null, tag:'limitada', colores:['#ffe27a','#ff9ed8','#cdb8ff'], talles:['Única'], rating:4, desc:'Estrellas que titilan apenas las rozás. Edición de la lluvia de estrellas.', largo:'Cada estrellita fue recogida de una lluvia de meteoros y engarzada en alambre de luz. Brilla con un resplandor cálido en la oscuridad. Solo 100 piezas existen en todo el reino.' },
  { id:4,  cat:'zapatos',   nombre:'Zapatillas de Pétalo Saltarín', precio:21900, viejo:null, tag:'nuevo', colores:['#ffd4ee','#b3f5d1','#c7ecff'], talles:['34','35','36','37','38','39'], rating:5, desc:'Suela de musgo que amortigua cada salto entre hongos.', largo:'Confeccionadas con pétalos prensados y suela de musgo elástico, hacen que caminar por el bosque sea como flotar. No dejan huella para no molestar a las flores dormidas.' },
  { id:5,  cat:'accesorios',nombre:'Sombrerito de Hongo Encantado', precio:9900,  viejo:13900, tag:'vendido', colores:['#ff7ec9','#cdb8ff','#b3f5d1'], talles:['Única'], rating:4, desc:'Un hongo amigo que te acompaña y refugia de la lluvia de polen.', largo:'Recolectado con permiso de los gnomos del claro, este sombrerito vivo crece un poquito cada luna. Repele el polen molesto y guarda secretos si se lo pedís bajito.' },
  { id:6,  cat:'joyas',     nombre:'Collar de Lágrima de Hada', precio:27900, viejo:null, tag:'limitada', colores:['#c7ecff','#cdb8ff','#ffd4ee'], talles:['Única'], rating:5, desc:'Un cristal que guarda una lágrima de alegría cristalizada.', largo:'Dentro del cristal late una lágrima de pura alegría que brilla más fuerte cuando sos feliz. Cadena de hilo de luna. Una joya que cuenta tu estado de ánimo.' },
  { id:7,  cat:'capas',     nombre:'Capa Manto de Vía Láctea', precio:32900, viejo:null, tag:'nuevo', colores:['#cdb8ff','#7a4f80','#c7ecff'], talles:['S','M','L'], rating:5, desc:'Una porción del cielo nocturno sobre tus hombros, con estrellas reales.', largo:'Tejida con un retazo de cielo nocturno, esta capa lleva constelaciones que se mueven lentamente. Abriga como un abrazo de luna y te vuelve casi invisible entre las sombras del bosque.' },
  { id:8,  cat:'primavera', nombre:'Conjunto Brote de Magnolia', precio:28900, viejo:39900, tag:'vendido', colores:['#ffd4ee','#b3f5d1','#ff9ed8'], talles:['XS','S','M','L'], rating:5, desc:'Top y falda que florecen con pétalos frescos cada primavera.', largo:'Parte de la Colección Primavera Encantada. Los pétalos del conjunto se renuevan solos cada estación, soltando un aroma dulce a magnolia. Incluye broche de abejita amiga.' },
  { id:9,  cat:'vestidos',  nombre:'Vestido Niebla de Amanecer', precio:22900, viejo:null, tag:null, colores:['#ffe9f6','#c7ecff','#cdb8ff'], talles:['XS','S','M','L','XL'], rating:4, desc:'Gasa tan fina como la niebla del bosque al despertar.', largo:'Capas de gasa color amanecer que se mueven con la brisa más suave. Liviano, fresco y perfecto para revolotear entre flores recién abiertas.' },
  { id:10, cat:'alas',      nombre:'Alas de Mariposa Lunar', precio:20900, viejo:null, tag:'nuevo', colores:['#cdb8ff','#ff9ed8','#c7ecff'], talles:['Única'], rating:5, desc:'Patrón de mariposa nocturna que brilla en la penumbra.', largo:'Inspiradas en las mariposas que solo salen de noche, estas alas tienen patrones fosforescentes que se cargan con la luz del día y brillan suavemente al anochecer.' },
  { id:11, cat:'joyas',     nombre:'Anillo Capullo de Rocío', precio:11900, viejo:null, tag:null, colores:['#b3f5d1','#c7ecff','#ffd4ee'], talles:['5','6','7','8'], rating:4, desc:'Una gota de rocío eterna engarzada en plata de hoja.', largo:'Una perfecta gota de rocío atrapada para siempre en plata trabajada en forma de hoja. Refresca el dedo en días calurosos y nunca se evapora.' },
  { id:12, cat:'coronas',   nombre:'Diadema Trenza de Hiedra', precio:13900, viejo:18900, tag:'vendido', colores:['#b3f5d1','#ffd4ee','#cdb8ff'], talles:['Única'], rating:5, desc:'Hiedra viva trenzada con florcitas que nunca se marchitan.', largo:'Hiedra del bosque trenzada por manos de hada, con florcitas encantadas que florecen eternamente. Se adapta sola a tu cabeza y huele a primavera.' },
  { id:13, cat:'zapatos',   nombre:'Botitas de Musgo Abrazador', precio:24900, viejo:null, tag:'nuevo', colores:['#b3f5d1','#cdb8ff','#7a4f80'], talles:['34','35','36','37','38'], rating:4, desc:'Forradas en musgo tibio para las noches frías del bosque.', largo:'Botitas forradas con musgo que conserva el calor de un rayito de sol. Suela de corteza flexible. Tus pies van a estar abrigados aunque pises la escarcha.' },
  { id:14, cat:'capas',     nombre:'Capa Bruma de Plata', precio:29900, viejo:null, tag:'limitada', colores:['#c7ecff','#cdb8ff','#ffe9f6'], talles:['S','M','L'], rating:5, desc:'Tejida con bruma plateada que te difumina entre la niebla.', largo:'Edición limitada hilada con bruma de los lagos encantados. Te vuelve etérea, como si formaras parte de la niebla misma. Cierre con broche de luna creciente.' },
  { id:15, cat:'accesorios',nombre:'Bolsito Bellota Mágica', precio:8900, viejo:null, tag:null, colores:['#ffd4ee','#b3f5d1','#cdb8ff'], talles:['Única'], rating:4, desc:'Más grande por dentro: guarda todo tu polvo de hadas.', largo:'Una bellota encantada que por dentro tiene espacio infinito. Guardá tu varita, polvo de hadas, pétalos de la suerte y lo que se te ocurra. Correa de raíz trenzada.' },
  { id:16, cat:'primavera', nombre:'Vestido Lluvia de Cerezo', precio:26900, viejo:null, tag:'nuevo', colores:['#ffd4ee','#ff9ed8','#ffe9f6'], talles:['XS','S','M','L'], rating:5, desc:'Pétalos de cerezo que caen suavemente sin tocar el suelo jamás.', largo:'De la Colección Primavera Encantada: un vestido rodeado de pétalos de cerezo flotantes que te siguen a todas partes. Romántico, dulce y lleno de movimiento.' },
];

const moneda = n => '$' + n.toLocaleString('es-AR');
const artFor = p => {
  const [c1,c2] = p.colores;
  return ART[p.cat](c1, c2 || c1);
};

/* ─────────────────────────────────────────────
   2. ESTADO · carrito y favoritos (en memoria)
   ───────────────────────────────────────────── */
let carrito = [];        // {id, qty, talle, color}
let favoritos = [];      // [id]
let filtroCat = 'todos';
let busqueda = '';
let orden = 'destacado';

/* ─────────────────────────────────────────────
   3. UTILIDADES de DOM
   ───────────────────────────────────────────── */
const $  = (s, c=document) => c.querySelector(s);
const $$ = (s, c=document) => [...c.querySelectorAll(s)];

function toast(msg){
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._t);
  t._t = setTimeout(()=>t.classList.remove('show'), 2200);
}

function popBadge(el){ el.classList.add('pop'); setTimeout(()=>el.classList.remove('pop'),250); }

/* ─────────────────────────────────────────────
   4. ROUTER · muestra/oculta vistas por hash
   ───────────────────────────────────────────── */
const RUTAS = ['inicio','catalogo','nosotros','contacto','login','registro'];

function navegar(ruta){
  if(!RUTAS.includes(ruta)) ruta = 'inicio';
  $$('.view').forEach(v => v.hidden = (v.dataset.view !== ruta));
  $$('.nav__link').forEach(l => l.classList.toggle('active', l.dataset.routeLink === ruta));
  window.scrollTo({ top:0, behavior:'smooth' });
  $('#nav')?.classList.remove('open');
  $('.nav')?.classList.remove('open');
  $('#hamburger')?.classList.remove('open');
  observarReveals();
}

function rutaActual(){ return (location.hash.replace('#/','') || 'inicio'); }
window.addEventListener('hashchange', ()=> navegar(rutaActual()));

// Cualquier elemento con data-go="ruta" navega
document.addEventListener('click', e=>{
  const go = e.target.closest('[data-go]');
  if(go){ location.hash = '#/' + go.dataset.go; }
});

/* ─────────────────────────────────────────────
   5. RENDER · categorías
   ───────────────────────────────────────────── */
function renderCategorias(){
  const grid = $('#catGrid');
  grid.innerHTML = CATEGORIAS.map(c=>{
    const n = PRODUCTOS.filter(p=>p.cat===c.id).length;
    return `<button class="cat" data-cat="${c.id}">
      <div class="cat__emoji">${c.emoji}</div>
      <div class="cat__name">${c.nombre}</div>
      <div class="cat__count">${n} ${n===1?'tesoro':'tesoros'}</div>
    </button>`;
  }).join('');
  $$('.cat', grid).forEach(b=> b.addEventListener('click', ()=>{
    filtroCat = b.dataset.cat;
    location.hash = '#/catalogo';
    setTimeout(()=>{ sincronizarChips(); renderCatalogo(); }, 50);
  }));
}

/* ─────────────────────────────────────────────
   6. RENDER · tarjeta de producto
   ───────────────────────────────────────────── */
function tarjeta(p){
  const cat = CATEGORIAS.find(c=>c.id===p.cat);
  const tagHtml = p.tag ? `<span class="tag tag--${p.tag}">${p.tag==='nuevo'?'✦ Nuevo':p.tag==='vendido'?'★ Más vendido':'♦ Edición limitada'}</span>` : '';
  const esFav = favoritos.includes(p.id);
  const swatches = p.colores.map(c=>`<span class="swatch" style="background:${c}"></span>`).join('');
  const precio = p.viejo
    ? `<b>${moneda(p.precio)}</b><s>${moneda(p.viejo)}</s>`
    : `<b>${moneda(p.precio)}</b>`;
  return `<article class="card" data-id="${p.id}">
    <div class="card__media" data-open="${p.id}">
      ${tagHtml}
      <button class="fav ${esFav?'on':''}" data-fav="${p.id}" aria-label="Favorito">${esFav?'💖':'🤍'}</button>
      ${artFor(p)}
    </div>
    <div class="card__info">
      <span class="card__cat">${cat.nombre}</span>
      <h3 class="card__name" data-open="${p.id}">${p.nombre}</h3>
      <div class="card__swatches">${swatches}</div>
      <div class="card__price">${precio}</div>
      <div class="card__actions">
        <button class="btn btn--glossy" data-add="${p.id}">🛍️ Agregar</button>
      </div>
    </div>
  </article>`;
}

/* ─────────────────────────────────────────────
   7. RENDER · destacados, catálogo y filtros
   ───────────────────────────────────────────── */
function renderDestacados(){
  const dest = PRODUCTOS.filter(p=>p.tag).slice(0,4);
  $('#featuredGrid').innerHTML = dest.map(tarjeta).join('');
}

function sincronizarChips(){
  const cont = $('#catChips');
  const chips = [{id:'todos',nombre:'✦ Todo'}, ...CATEGORIAS.map(c=>({id:c.id,nombre:c.emoji+' '+c.nombre}))];
  cont.innerHTML = chips.map(c=>`<button class="chip ${c.id===filtroCat?'on':''}" data-chip="${c.id}">${c.nombre}</button>`).join('');
  $$('.chip', cont).forEach(b=> b.addEventListener('click', ()=>{
    filtroCat = b.dataset.chip; sincronizarChips(); renderCatalogo();
  }));
}

function renderCatalogo(){
  let lista = PRODUCTOS.slice();
  if(filtroCat!=='todos') lista = lista.filter(p=>p.cat===filtroCat);
  if(busqueda){
    const q = busqueda.toLowerCase();
    lista = lista.filter(p=> p.nombre.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q));
  }
  if(orden==='precio-asc')  lista.sort((a,b)=>a.precio-b.precio);
  if(orden==='precio-desc') lista.sort((a,b)=>b.precio-a.precio);
  if(orden==='nombre')      lista.sort((a,b)=>a.nombre.localeCompare(b.nombre));
  if(orden==='destacado')   lista.sort((a,b)=> (b.tag?1:0)-(a.tag?1:0));

  $('#catalogGrid').innerHTML = lista.map(tarjeta).join('');
  $('#catalogEmpty').hidden = lista.length>0;
  observarReveals();
}

/* ─────────────────────────────────────────────
   8. RENDER · reseñas del home
   ───────────────────────────────────────────── */
const RESENAS = [
  { t:'Compré las Alas de Cristal y todas en el claro me preguntan dónde las conseguí. ¡Brillan precioso!', a:'Estela Florcita', r:'hada de los nenúfares', e:'🧚‍♀️' },
  { t:'El Vestido Rocío de Aurora cambia de color al atardecer. Es literalmente magia. No me lo saco más.', a:'Lila Susurro', r:'hada del viento', e:'🦋' },
  { t:'Mi Corona de Estrellas titila cuando estoy contenta. Llegó en un empaque de pétalo divino.', a:'Pétalo Lunar', r:'hada del rocío', e:'🌸' },
];
function renderResenas(){
  $('#homeReviews').innerHTML = RESENAS.map(x=>`
    <div class="review">
      <div class="review__stars">★★★★★</div>
      <p class="review__text">“${x.t}”</p>
      <div class="review__author"><span class="review__ava">${x.e}</span><div><b>${x.a}</b><small>${x.r}</small></div></div>
    </div>`).join('');
}

/* ─────────────────────────────────────────────
   9. CARRITO
   ───────────────────────────────────────────── */
function agregarCarrito(id, talle=null, color=null){
  const p = PRODUCTOS.find(x=>x.id===id);
  if(!talle) talle = p.talles[0];
  if(!color) color = p.colores[0];
  const existente = carrito.find(i=>i.id===id && i.talle===talle && i.color===color);
  if(existente) existente.qty++;
  else carrito.push({ id, qty:1, talle, color });
  actualizarCarrito();
  popBadge($('#cartBadge'));
  sonido('add');
  toast('✦ ' + p.nombre + ' fue al canasto');
}

function cambiarQty(idx, delta){
  carrito[idx].qty += delta;
  if(carrito[idx].qty<=0) carrito.splice(idx,1);
  actualizarCarrito();
}
function quitarCarrito(idx){ carrito.splice(idx,1); actualizarCarrito(); }

function totalesCarrito(){
  const subtotal = carrito.reduce((s,i)=> s + PRODUCTOS.find(p=>p.id===i.id).precio * i.qty, 0);
  const envio = subtotal===0 ? 0 : (subtotal>=25000 ? 0 : 3500);
  return { subtotal, envio, total: subtotal+envio };
}

function actualizarCarrito(){
  const cont = $('#cartItems');
  const count = carrito.reduce((s,i)=>s+i.qty,0);
  $('#cartBadge').textContent = count;

  if(carrito.length===0){
    cont.innerHTML = `<div class="drawer__empty"><span>🧺</span>Tu canasto está vacío.<br>¡El bosque está lleno de tesoros esperándote!</div>`;
    $('#cartFoot').style.display = 'none';
  } else {
    $('#cartFoot').style.display = 'block';
    cont.innerHTML = carrito.map((i,idx)=>{
      const p = PRODUCTOS.find(x=>x.id===i.id);
      return `<div class="cartitem">
        <div class="cartitem__media">${artFor({...p,colores:[i.color, p.colores[1]||i.color]})}</div>
        <div class="cartitem__info">
          <div class="cartitem__name">${p.nombre}</div>
          <div class="cartitem__meta">Talle ${i.talle} · <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${i.color};vertical-align:middle"></span></div>
          <div class="cartitem__bottom">
            <div class="qty">
              <button data-minus="${idx}" aria-label="Quitar uno">−</button>
              <span>${i.qty}</span>
              <button data-plus="${idx}" aria-label="Agregar uno">+</button>
            </div>
            <div class="cartitem__price">${moneda(p.precio*i.qty)}</div>
          </div>
          <button class="cartitem__remove" data-remove="${idx}">eliminar</button>
        </div>
      </div>`;
    }).join('');
  }
  const { subtotal, envio, total } = totalesCarrito();
  $('#cartSubtotal').textContent = moneda(subtotal);
  $('#cartShip').textContent = envio===0 ? '¡Gratis! ✦' : moneda(envio);
  $('#cartTotal').textContent = moneda(total);
}

/* ─────────────────────────────────────────────
   10. FAVORITOS
   ───────────────────────────────────────────── */
function toggleFav(id){
  const i = favoritos.indexOf(id);
  if(i>=0){ favoritos.splice(i,1); }
  else { favoritos.push(id); sonido('add'); }
  $('#favBadge').textContent = favoritos.length;
  popBadge($('#favBadge'));
  // refrescar corazones visibles
  $$(`[data-fav="${id}"]`).forEach(b=>{
    const on = favoritos.includes(id);
    b.classList.toggle('on', on);
    b.textContent = on ? '💖' : '🤍';
  });
  actualizarFavoritos();
}

function actualizarFavoritos(){
  const cont = $('#favItems');
  if(favoritos.length===0){
    cont.innerHTML = `<div class="drawer__empty"><span>💭</span>Todavía no marcaste favoritos.<br>Tocá el corazón de un tesoro que te guste.</div>`;
    return;
  }
  cont.innerHTML = favoritos.map(id=>{
    const p = PRODUCTOS.find(x=>x.id===id);
    return `<div class="cartitem">
      <div class="cartitem__media">${artFor(p)}</div>
      <div class="cartitem__info">
        <div class="cartitem__name">${p.nombre}</div>
        <div class="cartitem__meta">${moneda(p.precio)}</div>
        <div class="cartitem__bottom">
          <button class="btn btn--glossy" data-add="${p.id}" style="padding:7px 14px;font-size:.82rem">Agregar 🛍️</button>
          <button class="cartitem__remove" data-fav="${p.id}">quitar 💔</button>
        </div>
      </div>
    </div>`;
  }).join('');
}

/* ─────────────────────────────────────────────
   11. MODAL DE PRODUCTO (galería, zoom, talles, reseñas, relacionados)
   ───────────────────────────────────────────── */
let pmEstado = { id:null, talle:null, color:null };

function abrirProducto(id){
  const p = PRODUCTOS.find(x=>x.id===id);
  if(!p) return;
  pmEstado = { id, talle:p.talles[0], color:p.colores[0] };
  const cat = CATEGORIAS.find(c=>c.id===p.cat);
  $('#pmTitleBar').textContent = p.nombre.toLowerCase().replace(/\s+/g,'-') + '.exe';

  const tallesHtml = p.talles.map((t,i)=>`<button class="pm__size ${i===0?'active':''}" data-size="${t}">${t}</button>`).join('');
  const coloresHtml = p.colores.map((c,i)=>`<button class="pm__color ${i===0?'active':''}" style="background:${c}" data-color="${c}"></button>`).join('');
  const precio = p.viejo ? `<b>${moneda(p.precio)}</b><s>${moneda(p.viejo)}</s>` : `<b>${moneda(p.precio)}</b>`;
  const estrellas = '★'.repeat(p.rating) + '☆'.repeat(5-p.rating);
  const tagHtml = p.tag ? `<span class="tag tag--${p.tag}" style="position:static;display:inline-block;margin-bottom:8px">${p.tag==='nuevo'?'✦ Nuevo':p.tag==='vendido'?'★ Más vendido':'♦ Edición limitada'}</span>` : '';

  // miniaturas: variamos color para simular galería
  const thumbs = p.colores.map((c,i)=>`<button class="pm__thumb ${i===0?'active':''}" data-thumb="${i}">${artFor({...p,colores:[c,p.colores[(i+1)%p.colores.length]]})}</button>`).join('');

  // relacionados de la misma categoría
  const rel = PRODUCTOS.filter(x=>x.cat===p.cat && x.id!==id).slice(0,4);
  const relHtml = rel.length ? `<div class="pm__related"><h3>✿ Tesoros que combinan</h3><div class="pm__relgrid">${rel.map(tarjeta).join('')}</div></div>` : '';

  // reseñas inventadas del producto
  const resPm = [
    {a:'Hada del Trébol', s:5, t:'Llegó volando en una hoja. La calidad es de otro mundo, brilla justo como en la foto.'},
    {a:'Brisa de Sauce', s:4, t:'Hermoso de verdad. Le pondría 5 estrellas pero quería que brillara un poquito más fuerte.'},
  ];
  const resHtml = `<div class="pm__reviews"><h3>💬 Reseñas (${p.rating}.0)</h3>${resPm.map(r=>`
    <div class="review" style="margin-bottom:10px"><div class="review__stars">${'★'.repeat(r.s)}${'☆'.repeat(5-r.s)}</div><p class="review__text">“${r.t}”</p><div class="review__author"><span class="review__ava">🧚</span><div><b>${r.a}</b><small>compra verificada</small></div></div></div>`).join('')}</div>`;

  $('#pmBody').innerHTML = `
    <div class="pm__gallery">
      <div class="pm__main" id="pmMain">${artFor(p)}<span class="pm__zoomhint">🔍 pasá el mouse para zoom</span></div>
      <div class="pm__thumbs">${thumbs}</div>
    </div>
    <div class="pm__detail">
      ${tagHtml}
      <span class="pm__cat">${cat.nombre}</span>
      <h2 class="pm__name">${p.nombre}</h2>
      <div class="pm__rating">${estrellas}<small>(${p.rating}.0 · basado en reseñas de hadas)</small></div>
      <div class="pm__price">${precio}</div>
      <p class="pm__desc">${p.largo}</p>

      <div class="pm__label">Talle <a class="link" id="pmGuideLink" style="font-size:.82rem">📏 Guía de talles</a></div>
      <div class="pm__sizes">${tallesHtml}</div>

      <div class="pm__label">Color</div>
      <div class="pm__colors">${coloresHtml}</div>

      <div class="pm__buy">
        <button class="btn btn--glossy btn--full" id="pmAdd">🛍️ Agregar al carrito</button>
        <button class="fav ${favoritos.includes(id)?'on':''}" data-fav="${id}" style="position:static;width:48px;height:48px;flex-shrink:0">${favoritos.includes(id)?'💖':'🤍'}</button>
      </div>

      <details class="pm__sizeguide" id="pmGuide">
        <summary>📏 Guía de talles encantada</summary>
        <table>
          <tr><th>Talle</th><th>Altura de hada</th><th>Envergadura de alas</th></tr>
          <tr><td>XS / 34</td><td>hasta 8 cm</td><td>12 cm</td></tr>
          <tr><td>S / 36</td><td>8–10 cm</td><td>15 cm</td></tr>
          <tr><td>M / 37</td><td>10–12 cm</td><td>18 cm</td></tr>
          <tr><td>L / 38</td><td>12–14 cm</td><td>21 cm</td></tr>
          <tr><td>XL / 39</td><td>14 cm o más</td><td>24 cm</td></tr>
        </table>
      </details>
    </div>
    ${resHtml}
    ${relHtml}
  `;

  // listeners internos del modal
  $('#pmAdd').addEventListener('click', ()=>{ agregarCarrito(id, pmEstado.talle, pmEstado.color); });
  $$('.pm__size').forEach(b=> b.addEventListener('click', ()=>{
    $$('.pm__size').forEach(x=>x.classList.remove('active')); b.classList.add('active'); pmEstado.talle=b.dataset.size;
  }));
  $$('.pm__color').forEach(b=> b.addEventListener('click', ()=>{
    $$('.pm__color').forEach(x=>x.classList.remove('active')); b.classList.add('active'); pmEstado.color=b.dataset.color;
    $('#pmMain').innerHTML = artFor({...p,colores:[b.dataset.color, p.colores[1]||b.dataset.color]}) + '<span class="pm__zoomhint">🔍 pasá el mouse para zoom</span>';
    activarZoom();
  }));
  $$('.pm__thumb').forEach(b=> b.addEventListener('click', ()=>{
    $$('.pm__thumb').forEach(x=>x.classList.remove('active')); b.classList.add('active');
    const i = +b.dataset.thumb;
    $('#pmMain').innerHTML = artFor({...p,colores:[p.colores[i], p.colores[(i+1)%p.colores.length]]}) + '<span class="pm__zoomhint">🔍 pasá el mouse para zoom</span>';
    activarZoom();
  }));
  $('#pmGuideLink').addEventListener('click', ()=> $('#pmGuide').open = true);

  activarZoom();
  // relacionados clicables
  observarReveals();

  $('#productModal').classList.add('open');
  $('#productModal').setAttribute('aria-hidden','false');
  document.body.style.overflow = 'hidden';
}

// Zoom de imagen al mover el mouse
function activarZoom(){
  const main = $('#pmMain'); if(!main) return;
  main.onmouseenter = ()=> main.classList.add('zoom');
  main.onmouseleave = ()=>{ main.classList.remove('zoom'); main.querySelector('svg').style.transformOrigin='center'; };
  main.onmousemove = e=>{
    const r = main.getBoundingClientRect();
    const x = (e.clientX-r.left)/r.width*100, y=(e.clientY-r.top)/r.height*100;
    const svg = main.querySelector('svg'); if(svg) svg.style.transformOrigin = `${x}% ${y}%`;
  };
}

function cerrarModal(){
  $('#productModal').classList.remove('open');
  $('#productModal').setAttribute('aria-hidden','true');
  document.body.style.overflow = '';
}

/* ─────────────────────────────────────────────
   12. DRAWERS · abrir / cerrar
   ───────────────────────────────────────────── */
function abrirDrawer(sel){
  $('#overlay').hidden = false;
  $(sel).classList.add('open');
  $(sel).setAttribute('aria-hidden','false');
  document.body.style.overflow='hidden';
}
function cerrarTodo(){
  $('#overlay').hidden = true;
  $$('.drawer').forEach(d=>{ d.classList.remove('open'); d.setAttribute('aria-hidden','true'); });
  document.body.style.overflow='';
}

/* ─────────────────────────────────────────────
   13. DELEGACIÓN GLOBAL de clicks (add, fav, abrir, qty…)
   ───────────────────────────────────────────── */
document.addEventListener('click', e=>{
  const add = e.target.closest('[data-add]');
  if(add){ agregarCarrito(+add.dataset.add); return; }

  const fav = e.target.closest('[data-fav]');
  if(fav){ toggleFav(+fav.dataset.fav); return; }

  const open = e.target.closest('[data-open]');
  if(open){ abrirProducto(+open.dataset.open); return; }

  const minus = e.target.closest('[data-minus]'); if(minus){ cambiarQty(+minus.dataset.minus,-1); return; }
  const plus  = e.target.closest('[data-plus]');  if(plus){ cambiarQty(+plus.dataset.plus,+1); return; }
  const rem   = e.target.closest('[data-remove]');if(rem){ quitarCarrito(+rem.dataset.remove); return; }

  if(e.target.closest('[data-close]') || e.target.id==='overlay'){ cerrarTodo(); cerrarModal(); }
});

/* ─────────────────────────────────────────────
   14. PARTÍCULAS · destellos, mariposas, hojas (canvas)
   ───────────────────────────────────────────── */
function iniciarParticulas(){
  const c = $('#fx'), ctx = c.getContext('2d');
  let w, h, parts = [];
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const N = reduce ? 14 : (innerWidth<600 ? 22 : 46);

  function size(){ w=c.width=innerWidth; h=c.height=innerHeight; }
  size(); addEventListener('resize', size);

  const tipos = ['✨','⭐','🦋','🍃','🌸','💫','🎀'];
  for(let i=0;i<N;i++) parts.push(nueva(true));

  function nueva(init){
    const tipo = tipos[Math.floor(Math.random()*tipos.length)];
    return {
      tipo,
      x: Math.random()*w,
      y: init ? Math.random()*h : -20,
      vy: 0.25 + Math.random()*0.8,
      vx: (Math.random()-0.5)*0.5,
      size: 12 + Math.random()*16,
      rot: Math.random()*360,
      vr: (Math.random()-0.5)*1.5,
      sway: Math.random()*Math.PI*2,
      op: 0.5 + Math.random()*0.5,
    };
  }

  function frame(){
    ctx.clearRect(0,0,w,h);
    parts.forEach((p,i)=>{
      p.sway += 0.01;
      p.y += p.vy;
      p.x += p.vx + Math.sin(p.sway)*0.4;
      p.rot += p.vr;
      ctx.save();
      ctx.globalAlpha = p.op;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot*Math.PI/180);
      ctx.font = p.size + 'px serif';
      ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.fillText(p.tipo, 0, 0);
      ctx.restore();
      if(p.y > h+30){ parts[i] = nueva(false); }
    });
    requestAnimationFrame(frame);
  }
  frame();
}

/* ─────────────────────────────────────────────
   15. CURSOR PERSONALIZADO + estela de brillo
   ───────────────────────────────────────────── */
function iniciarCursor(){
  if(matchMedia('(pointer:coarse)').matches) return; // táctil: cursor normal
  const star = document.createElement('div');
  star.className = 'cursor-star'; star.textContent = '✦';
  document.body.appendChild(star);
  const glow = $('#glow');
  let lastSpark = 0;

  addEventListener('mousemove', e=>{
    star.style.left = e.clientX+'px'; star.style.top = e.clientY+'px';
    glow.style.left = e.clientX+'px'; glow.style.top = e.clientY+'px';
    // estelita de brillo cada tanto
    const now = Date.now();
    if(now-lastSpark > 60){
      lastSpark = now;
      const s = document.createElement('div');
      s.className='spark';
      s.textContent = ['✨','⭐','·','˚','✦'][Math.floor(Math.random()*5)];
      s.style.left = e.clientX+(Math.random()*16-8)+'px';
      s.style.top  = e.clientY+(Math.random()*16-8)+'px';
      document.body.appendChild(s);
      setTimeout(()=>s.remove(), 800);
    }
  });
  addEventListener('mousedown', ()=> star.style.transform='translate(-50%,-50%) scale(1.6)');
  addEventListener('mouseup',   ()=> star.style.transform='translate(-50%,-50%) scale(1)');
  // botones agrandan el cursor
  $$('button,a,.cat,.card').forEach(()=>{});
  document.addEventListener('mouseover', e=>{
    if(e.target.closest('button,a,[data-open],[data-go]')) star.textContent='✿';
    else star.textContent='✦';
  });
}

/* ─────────────────────────────────────────────
   16. SONIDOS SUAVES OPCIONALES (WebAudio, sin archivos)
   ───────────────────────────────────────────── */
let audioOn = false, audioCtx = null;
function sonido(tipo){
  if(!audioOn) return;
  try{
    audioCtx = audioCtx || new (window.AudioContext||window.webkitAudioContext)();
    const notas = tipo==='add' ? [880,1318] : [660,990];
    notas.forEach((f,i)=>{
      const o = audioCtx.createOscillator(), g = audioCtx.createGain();
      o.type='sine'; o.frequency.value=f;
      g.gain.setValueAtTime(0, audioCtx.currentTime);
      g.gain.linearRampToValueAtTime(0.05, audioCtx.currentTime+0.01+i*0.06);
      g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime+0.4+i*0.06);
      o.connect(g).connect(audioCtx.destination);
      o.start(audioCtx.currentTime+i*0.06); o.stop(audioCtx.currentTime+0.5+i*0.06);
    });
  }catch(_){}
}

/* ─────────────────────────────────────────────
   17. SCROLL REVEAL
   ───────────────────────────────────────────── */
let io;
function observarReveals(){
  io = io || new IntersectionObserver(entries=>{
    entries.forEach(en=>{ if(en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { threshold:0.12 });
  $$('.reveal:not(.in)').forEach(el=>{
    if(el.closest('.view')?.hidden) return;
    io.observe(el);
  });
}

/* ─────────────────────────────────────────────
   18. EASTER EGGS 🥚🧚
   ───────────────────────────────────────────── */
function lluviaDeHadas(){
  const emojis = ['🧚‍♀️','🧚','✨','🦋','🌸','⭐','🎀','💖'];
  for(let i=0;i<40;i++){
    const s = document.createElement('div');
    s.textContent = emojis[Math.floor(Math.random()*emojis.length)];
    s.style.cssText = `position:fixed;z-index:10002;pointer-events:none;left:${Math.random()*100}vw;top:-40px;font-size:${20+Math.random()*24}px;transition:transform 2.6s ease-in,opacity 2.6s`;
    document.body.appendChild(s);
    requestAnimationFrame(()=>{ s.style.transform=`translateY(${innerHeight+80}px) rotate(${Math.random()*720-360}deg)`; s.style.opacity='0'; });
    setTimeout(()=>s.remove(), 2700);
  }
  sonido('fav');
}

function iniciarEasterEggs(){
  // 1) Tocar el logo 5 veces → lluvia de hadas
  let logoClicks = 0, logoTimer;
  $('[data-egg="logo"]').addEventListener('click', e=>{
    logoClicks++;
    clearTimeout(logoTimer);
    logoTimer = setTimeout(()=>logoClicks=0, 1200);
    if(logoClicks>=5){ logoClicks=0; e.preventDefault(); lluviaDeHadas(); toast('🧚 ¡Despertaste a las hadas escondidas!'); }
  });

  // 2) El texto del footer dispara la lluvia también
  $('[data-egg="footer"]').addEventListener('click', ()=>{ lluviaDeHadas(); toast('✦ ¡Encontraste las hadas escondidas!'); });

  // 3) Código secreto del bosque: escribir "hada"
  let buffer = '';
  addEventListener('keydown', e=>{
    if(!/^[a-zA-ZáéíóúñÁÉÍÓÚÑ]$/.test(e.key)) return;
    buffer = (buffer + e.key.toLowerCase()).slice(-4);
    if(buffer==='hada'){ lluviaDeHadas(); toast('🌟 Dijiste la palabra mágica: ¡hada!'); }
    if(buffer.slice(-4)==='luz '.trim() && buffer==='luz') {}
  });

  // 4) Konami code → modo arcoíris
  const konami = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let kPos = 0;
  addEventListener('keydown', e=>{
    if(e.key === konami[kPos] || e.key.toLowerCase() === konami[kPos]){
      kPos++;
      if(kPos===konami.length){ kPos=0; document.body.classList.toggle('rainbow'); lluviaDeHadas(); toast('🌈 ¡Modo arcoíris encantado!'); }
    } else kPos = 0;
  });
}

/* ─────────────────────────────────────────────
   19. FORMULARIOS (newsletter, contacto, login, registro)
   ───────────────────────────────────────────── */
const esEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

function iniciarFormularios(){
  // Newsletter
  $('#newsBtn').addEventListener('click', ()=>{
    const v = $('#newsEmail').value.trim();
    const msg = $('#newsMsg');
    if(!esEmail(v)){ msg.textContent='✦ Dejanos un correo válido, hadita'; return; }
    msg.textContent='🎉 ¡Listo! Ya sos parte del círculo de hadas';
    $('#newsEmail').value=''; lluviaDeHadas(); sonido('add');
  });

  // Contacto
  $('#contactBtn').addEventListener('click', ()=>{
    const msg = $('#contactMsg');
    if(!$('#cName').value.trim() || !esEmail($('#cMail').value.trim()) || !$('#cMsg').value.trim()){
      msg.textContent='✦ Completá nombre, correo válido y mensaje'; return;
    }
    msg.textContent='🪲✨ ¡La luciérnaga ya voló con tu mensaje! Te respondemos pronto';
    ['#cName','#cMail','#cSubject','#cMsg'].forEach(s=>$(s).value=''); sonido('add');
  });

  // Login
  $('#loginBtn').addEventListener('click', ()=>{
    const msg = $('#loginMsg');
    if(!esEmail($('#logMail').value.trim()) || $('#logPass').value.length<4){
      msg.textContent='✦ Revisá tu correo y contraseña'; return;
    }
    msg.textContent='✨ ¡Bienvenida de nuevo al bosque!'; sonido('add');
    setTimeout(()=>location.hash='#/inicio', 900);
  });

  // Registro
  $('#registerBtn').addEventListener('click', ()=>{
    const msg = $('#registerMsg');
    if(!$('#regName').value.trim()){ msg.textContent='✦ Decinos tu nombre de hada'; return; }
    if(!esEmail($('#regMail').value.trim())){ msg.textContent='✦ Necesitamos un correo válido'; return; }
    if($('#regPass').value.length<4){ msg.textContent='✦ Tu hechizo secreto necesita 4+ caracteres'; return; }
    if(!$('#regTerms').checked){ msg.textContent='✦ Aceptá los encantamientos del bosque'; return; }
    msg.textContent='🌸 ¡Cuenta creada! Ya brillás con nosotras'; lluviaDeHadas(); sonido('add');
    setTimeout(()=>location.hash='#/inicio', 1100);
  });
}

/* ─────────────────────────────────────────────
   20. CHECKOUT (simulado)
   ───────────────────────────────────────────── */
function iniciarCheckout(){
  $('#checkoutBtn').addEventListener('click', ()=>{
    if(carrito.length===0){ toast('Tu canasto está vacío 🧺'); return; }
    const { total } = totalesCarrito();
    lluviaDeHadas();
    toast('✨ ¡Compra hechizada por ' + moneda(total) + '! Gracias por brillar');
    carrito = [];
    actualizarCarrito();
    setTimeout(cerrarTodo, 1400);
  });
}

/* ─────────────────────────────────────────────
   21. TOOLBAR del catálogo (buscar / ordenar)
   ───────────────────────────────────────────── */
function iniciarToolbar(){
  $('#searchInput').addEventListener('input', e=>{ busqueda = e.target.value; renderCatalogo(); });
  $('#sortSelect').addEventListener('change', e=>{ orden = e.target.value; renderCatalogo(); });
}

/* ─────────────────────────────────────────────
   22. TOPBAR (carrito, favoritos, sonido, menú móvil)
   ───────────────────────────────────────────── */
function iniciarTopbar(){
  $('#openCart').addEventListener('click', ()=> abrirDrawer('#cartDrawer'));
  $('#openFavs').addEventListener('click', ()=> abrirDrawer('#favDrawer'));
  $('#soundToggle').addEventListener('click', e=>{
    audioOn = !audioOn;
    e.currentTarget.classList.toggle('on', audioOn);
    if(audioOn){ sonido('add'); toast('🔊 Sonidos mágicos activados'); }
    else toast('🔈 Sonidos en silencio');
  });
  $('#hamburger').addEventListener('click', e=>{
    $('.nav').classList.toggle('open');
    const open = $('.nav').classList.contains('open');
    e.currentTarget.classList.toggle('open', open);
    e.currentTarget.setAttribute('aria-expanded', open);
  });
  $$('.nav__link').forEach(l=> l.addEventListener('click', ()=> $('.nav').classList.remove('open')));

  // cerrar modal/drawers con Escape
  addEventListener('keydown', e=>{ if(e.key==='Escape'){ cerrarTodo(); cerrarModal(); } });
}

/* ─────────────────────────────────────────────
   23. PANTALLA DE CARGA
   ───────────────────────────────────────────── */
function iniciarLoader(){
  const fill = $('.loader__fill');
  let p = 0;
  const iv = setInterval(()=>{
    p += Math.random()*22;
    fill.style.width = Math.min(p,100)+'%';
    if(p>=100){
      clearInterval(iv);
      setTimeout(()=> $('#loader').classList.add('hide'), 350);
    }
  }, 180);
}

/* ─────────────────────────────────────────────
   24. ARRANQUE
   ───────────────────────────────────────────── */
function init(){
  // render inicial
  renderCategorias();
  renderDestacados();
  renderResenas();
  sincronizarChips();
  renderCatalogo();
  actualizarCarrito();
  actualizarFavoritos();

  // sistemas
  iniciarTopbar();
  iniciarToolbar();
  iniciarFormularios();
  iniciarCheckout();
  // MODO LIGERO: partículas (canvas) y cursor mágico desactivados por rendimiento.
  // Si querés reactivarlos en una compu más potente, descomentá estas dos líneas:
  // iniciarParticulas();
  // iniciarCursor();
  iniciarEasterEggs();
  iniciarLoader();

  // router según hash
  navegar(rutaActual());
  observarReveals();

  // saludo en consola para curiosos 🧚
  console.log('%c✦ Hadaluz ✦','font-size:22px;color:#ff5bb5;font-weight:bold');
  console.log('%cBienvenida al bosque mágico. Probá tocar el logo 5 veces, o escribí "hada"… 🧚','color:#cdb8ff;font-size:13px');
}

document.addEventListener('DOMContentLoaded', init);
