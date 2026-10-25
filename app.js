/* Laska Corporate — maquette v8.
   Un seul site pour deux publics : praticiens et établissements. Un seul menu, le même pour tous :
   aucun profil à choisir, rien ne change tout seul (v8). Le bouton principal dépend seulement de la page.
   Chaque fonction de rendu correspond à un futur composant React / Next.js.
   v4 : couche de mouvement dans motion.js / motion.css ; ici, les transitions de vue (pages, formulaires). */

/* ───────────── Utilitaires ───────────── */
const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const plural = (n, word) => `${n} ${word}${n > 1 ? 's' : ''}`;
/* Le point final des titres reprend la pastille corail du logo. */
const dot = text => text.replace(/([.?!])$/, '<span class="dot">$1</span>');

const icons = {
  arrow:'<path d="M4 12h16m-6-6 6 6-6 6"/>', back:'<path d="M20 12H4m6-6-6 6 6 6"/>',
  check:'<path d="m5 12 4 4L19 6"/>', chevron:'<path d="m9 5 7 7-7 7"/>', down:'<path d="m6 9 6 6 6-6"/>', plus:'<path d="M12 5v14M5 12h14"/>',
  phone:'<path d="m8 3 3 5-3 3a15 15 0 0 0 5 5l3-3 5 3c-1 5-4 6-9 3S2 10 3 6c1-3 2-4 5-3Z"/>',
  mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/>',
  pin:'<path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2.5"/>',
  calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  shield:'<path d="M12 3 4 6v6c0 5 8 9 8 9s8-4 8-9V6Z"/><path d="m8 12 3 3 5-6"/>',
  people:'<circle cx="9" cy="8" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3m0-16a3 3 0 0 1 0 6m3 3a6 6 0 0 1 3 5v2"/>',
  doctor:'<path d="M6 3v4a5 5 0 0 0 10 0V3M4 3h4m6 0h4M11 12v3a5 5 0 0 0 10 0v-2"/><circle cx="21" cy="11" r="2"/>',
  hospital:'<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M10 21v-5h4v5m-2-15v5m-2.5-2.5h5M8 13h1m6 0h1"/>',
  heart:'<path d="M20 5c-3-3-7-1-8 2-1-3-5-5-8-2-4 4 1 10 8 15 7-5 12-11 8-15Z"/>',
  file:'<path d="M14 3H5v18h14V8Zm0 0v6h5M8 13h8m-8 4h5"/>',
  search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
  globe:'<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/>',
  menu:'<path d="M4 7h16M4 12h16M4 17h10"/>', close:'<path d="m6 6 12 12M6 18 18 6"/>',
  swap:'<path d="M7 4 3 8l4 4M3 8h14m0 12 4-4-4-4m4 4H7"/>',
  list:'<path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01"/>', map:'<path d="m9 4-6 2v14l6-2 6 2 6-2V4l-6 2-6-2Zm0 0v14m6-12v14"/>',
  chat:'<path d="M21 11a9 9 0 0 1-9 9H4l-1 1V11a9 9 0 0 1 18 0Z"/><path d="M7 10h10m-10 4h6"/>',
  bolt:'<path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"/>', badge:'<circle cx="12" cy="9" r="6"/><path d="m8.5 14-1.5 7 5-3 5 3-1.5-7"/>',
  diploma:'<path d="M4 5h16v11H4z"/><path d="M8 9h8M8 12h5"/><path d="m15 16 1 5 2-1.5 2 1.5 1-5"/>',
  share:'<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4"/>',
  link:'<path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/>',
  print:'<path d="M6 9V3h12v6M6 18H4v-7h16v7h-2"/><path d="M6 14h12v7H6z"/>',
  /* Espace candidat */
  user:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  home:'<path d="M3 11 12 4l9 7"/><path d="M5 10v10h5v-6h4v6h5V10"/>',
  eye:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
  eyeOff:'<path d="m3 3 18 18M10.6 5.1A10 10 0 0 1 12 5c6 0 10 7 10 7a17 17 0 0 1-3.2 3.9M6.6 6.6C3.8 8.4 2 12 2 12s4 7 10 7a9.7 9.7 0 0 0 5.4-1.6M9.9 9.9a3 3 0 0 0 4.2 4.2"/>',
  logout:'<path d="M15 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4M10 17l5-5-5-5M15 12H3"/>',
  euro:'<path d="M18 7a7 7 0 1 0 0 10M4 10h10M4 14h10"/>',
  pen:'<path d="m15 5 4 4L8 20H4v-4Z"/><path d="m13 7 4 4"/>',
  bell:'<path d="M6 16v-5a6 6 0 0 1 12 0v5l2 2H4Z"/><path d="M10 21h4"/>',
  briefcase:'<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18"/>',
  receipt:'<path d="M6 3h12v18l-3-2-3 2-3-2-3 2Z"/><path d="M9 8h6M9 12h6M9 16h3"/>',
  help:'<circle cx="12" cy="12" r="9"/><path d="M9.6 9.4a2.5 2.5 0 1 1 3.4 2.4c-.6.3-1 .8-1 1.5v.6M12 17.2v.1"/>',
  gift:'<rect x="3" y="8" width="18" height="13" rx="1"/><path d="M12 8v13M3 12h18M12 8c-2-4-6-4-6-1s6 1 6 1Zm0 0c2-4 6-4 6-1s-6 1-6 1Z"/>'
};
const icon = (name, cls = '') => `<svg class="icon ${cls}" viewBox="0 0 24 24" aria-hidden="true">${icons[name] || icons.heart}</svg>`;
/* Logo Laska Corporate | Médical. La tête de loup et la croix sont tracées en SVG d’après le fichier officiel
   (coordonnées relevées sur l’image) ; le texte reprend l’image d’origine (assets/logo-texte.png).
   Le tracé « wolf-trace » sert de masque : à la première visite, le contour se dessine puis la croix apparaît. */
const WOLF = 'M399 432 399 2 694 295 373 610 667 894 667 1017 765 1105 822 1105 920 1017 920 894 1214 610 893 295 1188 2 1188 432 1149 470 1289 612 975 918 975 1038 848 1169 739 1169 612 1038 612 918 298 612 438 470ZM468 154 610 295 468 434ZM1119 154 977 295 1119 434Z';
const CROSS = 'M757 499h75v108h107v75H832v107h-75V682H650v-75h107Z';
const TRACE = 'M434 470V40L652 295 336 611 640 906V1028L760 1137H827L947 1028V906L1251 611 935 295 1153 40V470';
const wolfMark = (cls = 'logo-mark', trace = '') => `<svg class="${cls}" viewBox="290 -6 1008 1182" aria-hidden="true">${trace ? `<mask id="${trace}" maskUnits="userSpaceOnUse" x="200" y="-80" width="1200" height="1340"><path class="wolf-trace" d="${TRACE}" pathLength="1" fill="none" stroke="#fff" stroke-width="140" stroke-linejoin="miter" stroke-miterlimit="8"/></mask>` : ''}<path class="wolf" fill="currentColor" fill-rule="evenodd" d="${WOLF}"/><path class="wolf-cross" fill="currentColor" d="${CROSS}"/></svg>`;
const logo = (place = 'head') => `<a class="logo" href="#/" aria-label="Laska Corporate, Médical : accueil">${wolfMark('logo-mark', place === 'head' ? 'wolf-trace' : '')}<img class="logo-text" src="assets/logo-texte.png" alt="" width="378" height="102"></a>`;
const btn = (label, href, kind = 'primary', symbol = 'arrow', attrs = '') => `<a class="btn btn-${kind}" href="${href}" ${attrs}>${label}${symbol ? icon(symbol) : ''}</a>`;
const checkList = list => `<ul class="check-list">${list.map(t => `<li>${icon('check')}<span>${t}</span></li>`).join('')}</ul>`;
const PHONE = '01 84 80 36 96', TEL = 'tel:+33184803696';

/* ───────────── Données (issues du site actuel, figées pour la maquette) ─────────────
   Spécialités, départements et pays : référentiels du CRM (crm.js). Les offres ne gardent que des codes :
   rang de la spécialité dans CRM.specialties, code du département ; les noms viennent du CRM. */
const specialties = CRM.specialties;
/* [référence, spécialité (rang), département (code), période, type de créneau] */
const sourceOffers = [
  ['MU/69/1',0,'69','Octobre 2026','Garde 24 h'],['MU/72/1',0,'72','Octobre 2026','Journée 12 h'],
  ['MG/22/2',1,'22','Octobre 2026','Journée 10 h'],['AR/67/1',2,'67','Octobre – Novembre 2026','Journée 10 h'],
  ['MU/69/2',0,'69','Octobre 2026','Garde 24 h'],['AR/31/1',2,'31','Octobre – Novembre 2026','Journée 10 h'],
  ['PARA/25/1',8,'25','Octobre 2026','Journée 10 h'],['MG/85/1',1,'85','Octobre 2026','Journée 10 h'],
  ['RAD/67/1',6,'67','Octobre – Novembre 2026','Journée 10 h'],['AR/13/1',2,'13','Octobre – Novembre 2026','Journée 12 h'],
  ['MG/13/1',1,'13','Novembre 2026','Journée 10 h'],['PED/49/2',5,'49','Novembre 2026','Journée 10 h'],
  ['MG/54/1',1,'54','Novembre 2026','Journée 10 h'],['CARD/13/1',4,'13','Novembre 2026','Journée 10 h'],
  ['GER/22/1',3,'22','Novembre 2026','Journée 10 h'],['MU/21/1',0,'21','Novembre 2026','Garde 24 h'],
  ['GER/25/1',3,'25','Novembre 2026','Journée 10 h'],['MU/21/2',0,'21','Novembre 2026','Garde 24 h'],
  ['PSY/31/1',7,'31','Novembre – Décembre 2026','À préciser']
];
/* Créneaux datés de chaque offre. EXEMPLES pour la maquette, à remplacer par les vraies dates.
   « MM-JJ » : un créneau du type de l’offre ; « MM-JJ|Type » : un créneau d’un autre type. */
const sourceSlots = {
  'MU/69/1':['10-24','10-25','10-31|Journée 12 h'], 'MU/72/1':['10-20','10-21','10-28|Nuit 12 h'], 'MG/22/2':['10-19','10-22','10-26'],
  'AR/67/1':['10-27','10-28','11-03','11-04'], 'MU/69/2':['10-18','10-26'], 'AR/31/1':['10-29','11-05','11-12'],
  'PARA/25/1':['10-21','10-22','10-23'], 'MG/85/1':['10-26','10-27','10-28','10-29','10-30'], 'RAD/67/1':['10-30','11-06','11-13'],
  'AR/13/1':['10-24','11-07|Journée 10 h','11-21'], 'MG/13/1':['11-02','11-03','11-04','11-05'], 'PED/49/2':['11-09','11-16','11-23'],
  'MG/54/1':['11-10','11-17','11-24'], 'CARD/13/1':['11-12','11-13','11-19','11-20'], 'GER/22/1':['11-02','11-09','11-16'],
  'MU/21/1':['11-07','11-14','11-21','11-28|Journée 12 h'], 'GER/25/1':['11-04','11-18'], 'MU/21/2':['11-01','11-15','11-29'], 'PSY/31/1':[]
};
/* Conditions de chaque offre. EXEMPLES pour la maquette, à remplacer par les vraies conditions de chaque établissement.
   Le nom de l’établissement reste confidentiel : seul son type est affiché. */
const CDI_OFFERS = ['GER/22/1', 'PED/49/2', 'PSY/31/1'];
const STRUCTURE = {0: 'Centre hospitalier', 1: 'Centre de santé', 2: 'Clinique privée', 3: 'EHPAD', 4: 'Clinique privée', 5: 'Centre hospitalier', 6: 'Clinique privée', 7: 'Centre hospitalier spécialisé', 8: 'Centre hospitalier'};
const PAY = {'Garde 24 h': '1 300 € brut la garde de 24 h', 'Journée 12 h': '780 € brut la journée de 12 h', 'Journée 10 h': '650 € brut la journée de 10 h', 'Nuit 12 h': '780 € brut la nuit de 12 h'};
const details = (ref, sp, hours) => {
  const cdi = CDI_OFFERS.includes(ref);
  return {contract: cdi ? 'CDI' : 'Intérim', structure: STRUCTURE[sp], pay: cdi ? 'Selon la grille de l’établissement et votre expérience' : sp === 8 ? '260 € brut la journée de 10 h' : PAY[hours] || 'Selon le créneau', perks: cdi ? ['Aide à l’installation', 'Accompagnement des démarches'] : ['Logement fourni', 'Transport pris en charge']};
};
const offers = sourceOffers.map(([ref,sp,num,period,hours]) => ({...details(ref, sp, hours),
  ref: ref.startsWith('PSY') ? 'À venir' : ref, id: ref.replaceAll('/','-'), sp, specialty: specialties[sp], dept: deptName(num), num, period, hours, soon: ref.startsWith('PSY'),
  /* Ville de l’établissement : EXEMPLE (la préfecture du département) ; en production, la ville réelle, lue dans le CRM. */
  city: deptCity(num), place: `${deptCity(num)} · ${deptName(num)} (${num})`,
  slots: (sourceSlots[ref] || []).map(s => { const [md, type] = s.split('|'); return {date: `2026-${md}`, type: type || hours}; })
}));
/* Dates en français : « 24 oct. », « 1er novembre », « du 27 octobre au 4 novembre 2026 ». */
const asDate = iso => new Date(`${iso}T12:00:00`);
const fmtDate = (iso, opts) => new Intl.DateTimeFormat('fr-FR', opts).format(asDate(iso));
const dayMonth = (iso, long = false) => { const d = asDate(iso).getDate(); return `${d === 1 ? '1er' : d} ${fmtDate(iso, {month: long ? 'long' : 'short'})}`; };
const longDate = iso => `${fmtDate(iso, {weekday: 'long'})} ${dayMonth(iso, true)}`;
const year = iso => asDate(iso).getFullYear();
const sameMonth = (a, b) => a.slice(0, 7) === b.slice(0, 7);
function slotRange(o, long = false) {
  if (!o.slots.length) return o.period;
  const a = o.slots[0].date, b = o.slots.at(-1).date;
  if (a === b) return long ? `Le ${dayMonth(a, true)} ${year(b)}` : `${dayMonth(a)} ${year(b)}`;
  if (long) return sameMonth(a, b) ? `Du ${asDate(a).getDate() === 1 ? '1er' : asDate(a).getDate()} au ${dayMonth(b, true)} ${year(b)}` : `Du ${dayMonth(a, true)} au ${dayMonth(b, true)} ${year(b)}`;
  return sameMonth(a, b) ? `${asDate(a).getDate() === 1 ? '1er' : asDate(a).getDate()} – ${dayMonth(b)} ${year(b)}` : `${dayMonth(a)} – ${dayMonth(b)} ${year(b)}`;
}
const slotCount = n => `${n} créneau${n > 1 ? 'x' : ''}`;
/* Espaces insécables entre un nombre et son unité (24 h, 1 300 €) : « 24 » et « h » ne sont jamais séparés. */
const units = t => String(t).replace(/(\d) (?=h\b|€)/g, '$1 ').replace(/(\d) (?=\d{3}\b)/g, '$1 ');
const slotTypes = o => units(o.slots.length ? [...new Set(o.slots.map(s => s.type))].join(' · ') : o.hours);
const slotKey = s => `${s.date}|${s.type}`;
/* Mois couverts par une offre (« 2026-11 ») : ceux de ses créneaux, sinon ceux de sa période annoncée. */
const MONTH_NAMES = ['janvier','fevrier','mars','avril','mai','juin','juillet','aout','septembre','octobre','novembre','decembre'];
function offerMonths(o) {
  if (o.slots.length) return [...new Set(o.slots.map(s => s.date.slice(0, 7)))];
  const y = (o.period.match(/\d{4}/) || ['2026'])[0], t = normalized(o.period);
  return MONTH_NAMES.map((m, i) => t.includes(m) ? `${y}-${String(i + 1).padStart(2, '0')}` : '').filter(Boolean);
}
const monthLabel = ym => { const [y, m] = ym.split('-'); return `${['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'][Number(m) - 1]} ${y}`; };
const periodOptions = () => [...new Set(offers.flatMap(offerMonths))].sort().map(ym => ({value: ym, label: monthLabel(ym), meta: offerCount(offers.filter(o => offerMonths(o).includes(ym)).length)}));
const firstDate = o => o.slots[0]?.date || '9999';
const TODAY = new Date().toISOString().slice(0, 10);
/* Départements où des offres sont ouvertes : options du choix multiple. */
const deptOptions = () => [...new Map(offers.map(o => [o.num, o.dept])).entries()].sort(([a], [b]) => a.localeCompare(b)).map(([num, dept]) => ({value: num, label: `${dept} (${num})`, hint: deptCity(num), meta: offerCount(offers.filter(o => o.num === num).length)}));
const offerCount = n => `${n} offre${n > 1 ? 's' : ''}`;
const MAIL = 'contact@laskacorp.com', MAIL_ETAB = 'affairesmedicales@laskacorp.com';
/* Préfectures des départements où des offres sont ouvertes (lat, lon). */
const deptGeo = {'69':[45.76,4.84],'72':[48.0,0.2],'22':[48.51,-2.76],'67':[48.57,7.65],'31':[43.6,1.44],'25':[47.24,6.02],'85':[46.67,-1.43],'13':[43.3,5.37],'49':[47.47,-0.55],'54':[48.69,6.18],'21':[47.32,5.04]};
const allSpecialties = [...CRM.specialties, 'Autre spécialité'];
const countries = [...CRM.countries, 'Autre pays'];
const briefSpecialties = [['Médecine d’urgence','Urgences'],['Médecine générale','Médecine générale'],['Anesthésie-réanimation','Anesthésie'],['Gériatrie','Gériatrie'],['Pédiatrie','Pédiatrie'],['Paramédical','Paramédical'],['Autre spécialité','Autre']];
/* Contrats d’une demande de renfort. Intérim et vacation : des créneaux datés ; CDD et CDI : une date de prise de poste. */
const contracts = ['Intérim','Vacation','CDI','CDD'];
const SHORT_CONTRACTS = ['Intérim','Vacation'];
const isShortContract = c => SHORT_CONTRACTS.includes(c);

const practitionerFAQ = [
  ['Mon diplôme a été obtenu à l’étranger. Puis-je être accompagné ?','Oui. Nous étudions votre diplôme et votre parcours pour vous orienter vers les démarches adaptées à votre situation : reconnaissance du diplôme, autorisation d’exercice ou épreuves de vérification des connaissances selon les cas.'],
  ['L’accompagnement est-il payant ?','L’accompagnement Laska Corporate est gratuit pour les praticiens. Vous pouvez créer votre dossier sans engagement.'],
  ['Puis-je commencer depuis mon pays d’origine ?','Oui. Vous pouvez commencer vos démarches depuis l’étranger. Indiquez simplement que vous résidez hors de France dans le formulaire.'],
  ['Combien de temps prennent les démarches ?','Le délai dépend de votre spécialité, de votre diplôme et de l’administration chargée du dossier. Votre interlocuteur vous informe à chaque étape.'],
  ['Quel niveau de français faut-il avoir ?','Un niveau permettant d’exercer en sécurité est nécessaire. Nous faisons le point avec vous lors de l’étude de votre dossier.']
];
const employerFAQ = [
  ['Puis-je demander un remplacement urgent ?',`Oui. Indiquez vos créneaux dans votre demande : nous vous proposons des profils dès qu’une compatibilité est identifiée. Pour échanger directement, appelez le ${PHONE} ou écrivez à ${MAIL_ETAB}.`],
  ['Comment les profils sont-ils vérifiés ?','Le diplôme d’origine et la situation du dossier auprès de l’Ordre concerné sont contrôlés avant la mise en relation. Les démarches d’autorisation d’exercice sont suivies.'],
  ['Quels contrats proposez-vous ?','L’intérim et la vacation répondent à un besoin ponctuel : gardes, remplacements, renfort saisonnier. Le CDD et le CDI, à un recrutement sur une durée définie ou durable. Vous choisissez le contrat dans votre demande : des créneaux pour l’intérim et la vacation, une date de prise de poste pour le CDD et le CDI.'],
  ['Accompagnez-vous les EHPAD et les cabinets ?','Oui. Laska Corporate accompagne les hôpitaux publics, cliniques privées, EHPAD, centres de santé et cabinets.']
];
const faq = items => `<div class="faq-list">${items.map(([q,a]) => `<details><summary><span>${q}</span>${icon('plus')}</summary><p>${a}</p></details>`).join('')}</div>`;

/* ───────────── État ───────────── */
const state = {
  filter:{specs:[],depts:[],months:[],fav:false,status:'all'}, view:'list', sort:'date',
  elig:{step:0}, /* réponses du questionnaire « Suis-je éligible ? » */
  brief:{specialties:[],contract:''},
  picks:{}, /* créneaux choisis sur une fiche d’offre, par offre */
  candidate:{values:{},success:false}, employer:{values:{},success:false}, contact:{values:{},success:false}
};
let route = '/', offerId = '', query = '';

/* Côté de la page : 'etab' sur les pages des établissements, 'pro' sur celles des praticiens et des offres, '' ailleurs.
   Il n’y a plus de « profil » à choisir ni à mémoriser : ce côté adapte seulement le bouton principal, le texte WhatsApp et le rappel. */
const ETAB_ROUTES = ['/etablissements', '/besoin'], PRO_ROUTES = ['/praticiens', '/postuler', '/eligibilite', '/offres', '/offre', '/avis', '/espace'];
const pageSide = () => ETAB_ROUTES.includes(route) ? 'etab' : PRO_ROUTES.includes(route) ? 'pro' : '';
/* Transitions de vue. kind : 'route' (changement de page) ou 'form' (formulaire envoyé). Les noms partagés sont posés
   par motion.css selon le type. */
function transition(fn, {kind = 'route'} = {}) {
  const html = document.documentElement;
  if (!document.startViewTransition || matchMedia('(prefers-reduced-motion: reduce)').matches) { fn(); clearShared(); return; }
  html.dataset.vt = kind;
  const vt = document.startViewTransition(fn);
  vt.finished.finally(() => { delete html.dataset.vt; clearShared(); });
}
/* Éléments partagés entre deux pages (numéro et titre d’une offre). Posés au clic, retirés après la transition. */
const vtName = (el, name) => { if (el) el.style.viewTransitionName = name; };
function clearShared() { $$('[style*="view-transition-name"]').forEach(el => el.style.viewTransitionName = ''); }

/* ───────────── Carte de France en points ───────────── */
const FR = [[51.05,2.38],[50.95,2.6],[50.8,3.1],[50.5,3.6],[50.3,4.1],[50.15,4.85],[49.95,4.8],[49.8,4.9],[49.55,5.4],[49.5,5.9],[49.45,6.4],[49.2,6.8],[49.15,7.4],[49.05,8.2],[48.75,8.05],[48.3,7.75],[47.9,7.6],[47.6,7.55],[47.45,7.0],[47.25,6.9],[46.95,6.45],[46.55,6.1],[46.2,5.95],[46.15,6.3],[46.4,6.55],[46.2,6.8],[45.95,7.0],[45.65,6.85],[45.3,7.15],[45.1,6.95],[44.85,6.75],[44.45,6.9],[44.15,7.6],[43.85,7.5],[43.6,7.15],[43.45,6.9],[43.2,6.65],[43.1,6.15],[43.2,5.6],[43.35,5.2],[43.4,4.75],[43.5,4.2],[43.4,3.65],[43.2,3.2],[42.95,3.05],[42.5,3.15],[42.45,2.7],[42.4,2.2],[42.5,1.75],[42.6,1.45],[42.7,0.75],[42.8,0.3],[42.85,-0.25],[42.95,-0.75],[43.05,-1.3],[43.35,-1.78],[43.65,-1.45],[44.2,-1.3],[44.65,-1.25],[45.1,-1.15],[45.55,-1.1],[45.95,-1.15],[46.25,-1.25],[46.4,-1.75],[46.8,-2.1],[47.15,-2.2],[47.25,-2.55],[47.5,-2.75],[47.55,-3.2],[47.75,-3.85],[47.85,-4.35],[48.05,-4.7],[48.35,-4.8],[48.6,-4.6],[48.7,-4.0],[48.8,-3.4],[48.65,-2.8],[48.6,-2.1],[48.65,-1.6],[48.85,-1.6],[49.2,-1.6],[49.6,-1.9],[49.7,-1.6],[49.65,-1.25],[49.4,-1.15],[49.35,-0.55],[49.3,-0.1],[49.45,0.15],[49.7,0.2],[49.85,0.6],[49.95,1.2],[50.2,1.6],[50.6,1.6],[50.9,1.65]];
const CORSE = [[43.0,9.4],[42.7,9.45],[42.35,9.55],[41.95,9.4],[41.4,9.25],[41.55,8.85],[41.9,8.65],[42.25,8.6],[42.6,8.75],[42.75,9.25]];
const project = ([lat, lon]) => [(lon + 5.3) * 0.69 * 60, (51.4 - lat) * 60];
const inside = (pt, poly) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [xi, yi] = poly[i], [xj, yj] = poly[j]; if ((yi > pt[1]) !== (yj > pt[1]) && pt[0] < (xj - xi) * (pt[1] - yi) / (yj - yi) + xi) c = !c; } return c; };
/* La carte se dessine en vague depuis la Méditerranée : les points sont regroupés par distance à ce point d’origine,
   et chaque pastille se pose quand la vague l’atteint (--pd). */
const MAP_ORIGIN = project([42.2, 5.2]), BAND = 40;
const waveDelay = (x, y) => Math.round(Math.hypot(x - MAP_ORIGIN[0], y - MAP_ORIGIN[1]) / BAND * 60 + 280);
let mapDots = '';
function dotsGrid() {
  if (mapDots) return mapDots;
  const polys = [FR.map(project), CORSE.map(project)], bands = Array.from({length: 15}, () => []);
  for (let y = 6; y < 610; y += 11) for (let x = 6; x < 620; x += 11) {
    const ox = (Math.round(y / 11) % 2) * 5.5, cx = x + ox;
    if (polys.some(p => inside([cx, y], p))) bands[Math.min(14, Math.floor(Math.hypot(cx - MAP_ORIGIN[0], y - MAP_ORIGIN[1]) / BAND))].push(`<circle cx="${cx.toFixed(1)}" cy="${y}" r="2.6"/>`);
  }
  return (mapDots = bands.map((b, i) => b.length ? `<g class="dot-band" style="--b:${i}">${b.join('')}</g>` : '').join(''));
}
const countByDept = list => list.reduce((c, o) => (c[o.num] = (c[o.num] || 0) + 1, c), {});
const pinLabel = (dept, num, n) => `${dept} (${num}), ${deptCity(num)} : ${n ? offerCount(n) : 'aucune offre pour ces critères'}`;
/* list : offres affichées ; selected : département filtré. */
/* selected : départements choisis (tableau). */
function franceMap({list = offers, selected = [], label = 'Carte des offres par département'} = {}) {
  const counts = countByDept(list);
  const pins = Object.entries(deptGeo).map(([num, geo]) => {
    const n = counts[num] || 0, [x, y] = project(geo), o = offers.find(o => o.num === num);
    return `<a class="pin ${n ? '' : 'pin-off'} ${selected.includes(num) ? 'pin-on' : ''}" href="#/offres?departement=${num}" data-dept="${num}" data-name="${esc(o.dept)}" data-count="${n}" aria-label="${esc(pinLabel(o.dept, num, n))}" transform="translate(${x.toFixed(1)} ${y.toFixed(1)})" style="--pd:${waveDelay(x, y)}ms">
      <g class="pin-inner"><circle class="pin-hit" r="30"/><circle class="pin-halo" r="30"/><circle class="pin-body" r="19"/><text class="pin-code" y="5">${num}</text><g class="pin-badge" transform="translate(15 -15)"><g class="badge-in ${n ? '' : 'is-zero'}"><circle r="10"/><text y="4.2">${n}</text></g></g></g></a>`;
  }).join('');
  return `<figure class="france-map" data-intro><svg viewBox="0 0 620 610" role="group" aria-label="${label}"><g class="map-dots">${dotsGrid()}</g><g class="map-pins">${pins}</g></svg><div class="map-tip" aria-hidden="true"></div><figcaption>${icon('pin')}Chaque pastille est un département où une offre est ouverte.</figcaption></figure>`;
}
/* Met la carte à jour sans la redessiner : les pastilles changent d’état en douceur. */
function updateMap(fig, list, selected = []) {
  const counts = countByDept(list);
  $$('.pin', fig).forEach(pin => {
    const num = pin.dataset.dept, n = counts[num] || 0, badge = $('.badge-in', pin);
    pin.dataset.count = n; pin.classList.toggle('pin-off', !n); pin.classList.toggle('pin-on', selected.includes(num));
    pin.setAttribute('aria-label', pinLabel(pin.dataset.name, num, n));
    badge.classList.toggle('is-zero', !n); if (n) $('text', badge).textContent = n;
  });
}
function bindMap(root = document, onPick) {
  $$('.france-map', root).forEach(fig => {
    if (fig.dataset.bound) return; fig.dataset.bound = '1';
    /* Infobulle : courte attente la première fois, instantanée quand on passe d’une pastille à l’autre. */
    const tip = $('.map-tip', fig); let hiddenAt = 0;
    const hide = () => { tip.classList.remove('is-on'); hiddenAt = performance.now(); };
    $$('.pin', fig).forEach(pin => {
      const show = () => { const r = pin.getBoundingClientRect(), f = fig.getBoundingClientRect(); const n = +pin.dataset.count;
        tip.innerHTML = `<strong>${esc(pin.dataset.name)} <span>${pin.dataset.dept}</span></strong>${esc(deptCity(pin.dataset.dept))} · ${n ? offerCount(n) : 'aucune offre ici pour ces critères'}`;
        tip.style.left = `${r.left - f.left + r.width / 2}px`; tip.style.top = `${r.top - f.top}px`;
        tip.classList.toggle('is-instant', performance.now() - hiddenAt < 350); tip.classList.add('is-on'); };
      pin.addEventListener('pointerenter', show); pin.addEventListener('focus', show);
      pin.addEventListener('pointerleave', hide); pin.addEventListener('blur', hide);
      if (onPick) pin.addEventListener('click', e => { e.preventDefault(); onPick(pin.dataset.dept); });
    });
  });
}

/* ───────────── En-tête, menu, pied de page ─────────────
   Un seul menu, le même pour tous et sur toutes les pages : plus d’interrupteur de profil ni de changement automatique. */
const NAV = [['Offres d’emploi', '/offres'], ['Praticiens', '/praticiens'], ['Établissements', '/etablissements'], ['Avis', '/avis'], ['Contact', '/contact']];
/* Bouton principal selon la page, jamais selon un mode : pages praticiens et offres → Créer mon dossier ; pages établissements
   → Décrire mon besoin ; accueil et pages neutres → aucun (les deux portes suffisent).
   Candidat connecté : aucun bouton orange, sur aucune page ; « Mon espace » (espaceButton) en tient lieu partout. */
function headerCta() {
  if (espaceUser()) return '';
  const side = pageSide();
  if (side === 'etab' && route !== '/besoin') return `<a class="btn btn-coral header-cta" href="#/besoin">${icon('people')}Décrire mon besoin</a>`;
  if (side === 'pro' && !['/postuler', '/espace'].includes(route)) return `<a class="btn btn-coral header-cta" href="#/postuler">${icon('file')}Créer mon dossier</a>`;
  return '';
}
function header() {
  /* Pages sans entrée de menu : on allume la rubrique à laquelle elles appartiennent. */
  const active = {'/offre': '/offres', '/postuler': '/praticiens', '/eligibilite': '/praticiens', '/besoin': '/etablissements'}[route] || route;
  /* Barre de services (ordinateur) : téléphone et Espace candidat, en haut à droite (les horaires sont dans l’Aide et au survol du numéro). Elle s’efface au défilement :
     seule la ligne principale reste collée en haut. Sur téléphone : menu, bouton « Aide » et avatar une fois connecté. */
  const top = `<div class="header-top"><div class="container header-top-inner"><a class="top-link" href="${TEL}" title="Du lundi au vendredi, de 9 h à 18 h" aria-label="Appeler Laska Corporate au ${PHONE}, du lundi au vendredi de 9 h à 18 h">${icon('phone')}${PHONE}</a>${espaceButton()}</div></div>`;
  return `<header class="site-header">${top}<div class="container header-inner">${logo()}
    <nav class="nav" id="navigation" aria-label="Navigation principale">
      ${NAV.map(([n,p], k) => `<a href="#${p}" style="--n:${k + 1}" ${active === p ? 'aria-current="page"' : ''}>${n}${active === p ? '<span class="nav-dot" aria-hidden="true"></span>' : ''}</a>`).join('')}
      <div class="nav-actions" style="--n:${NAV.length + 1}"><a class="btn btn-coral" href="#/postuler">${icon('file')}Je suis praticien : créer mon dossier</a><a class="btn btn-outline" href="#/besoin">${icon('people')}Je recrute : décrire mon besoin</a></div>
      <a class="nav-espace" href="#/espace" style="--n:${NAV.length + 2}" ${route === '/espace' ? 'aria-current="page"' : ''}>${icon('user')}${espaceUser() ? 'Mon espace candidat' : 'Espace candidat'}</a>
      <a class="nav-phone" href="${TEL}" style="--n:${NAV.length + 3}">${icon('phone')}${PHONE}</a>
    </nav>
    ${headerCta()}${espaceButton()}
    <button type="button" class="header-help" popovertarget="help-panel" aria-haspopup="dialog">${icon('chat')}<span>Aide</span></button>
    <button class="menu-button" aria-expanded="false" aria-controls="navigation" id="menu-button"><span>Menu</span>${icon('menu')}</button>
  </div></header>`;
}

function footer() {
  return `<footer class="site-footer">${wolfMark('footer-wolf')}<div class="container">
    <p class="footer-claim">${dot('Une place pour chaque talent.')}</p>
    <div class="footer-route" aria-hidden="true"><span></span></div>
    <div class="footer-grid">
      <div class="footer-col"><h3>${icon('doctor')}Praticiens</h3><a href="#/offres">Trouver une offre</a><a href="#/postuler">Créer mon dossier</a><a href="#/eligibilite">Suis-je éligible ?</a><a href="#/avis">Avis des praticiens</a><a href="#/espace">Espace candidat</a><a href="#/praticiens?faq=1">Questions fréquentes</a></div>
      <div class="footer-col"><h3>${icon('hospital')}Établissements</h3><a href="#/besoin">Décrire mon besoin</a><a href="#/etablissements">Recruter avec Laska Corporate</a><a href="mailto:${MAIL_ETAB}">${MAIL_ETAB.replace('@', '<wbr>@')}</a><a href="#/etablissements?faq=1">Questions fréquentes</a></div>
      <div class="footer-col"><h3>Laska Corporate</h3><a href="#/engagement">Notre engagement</a><a href="#/contact">Nous contacter</a></div>
      <div class="footer-col footer-contact"><h3>On se parle ?</h3><a class="footer-tel" href="${TEL}">${PHONE}</a><a href="mailto:${MAIL}">${MAIL.replace('@', '<wbr>@')}</a><address>6 rue d’Armaillé, 75017 Paris</address></div>
    </div>
    <div class="footer-bottom">${logo('foot')}<span>© 2026 Laska Corporate</span><div><a href="#/mentions-legales">Mentions légales</a><a href="#/mentions-legales?section=confidentialite">Confidentialité</a></div></div>
  </div></footer>`;
}

function breadcrumb(items) {
  return `<nav class="breadcrumb" aria-label="Fil d’Ariane"><a href="#/">Accueil</a>${items.map(([t,h]) => `${icon('chevron')}${h ? `<a href="${h}">${t}</a>` : `<span aria-current="page">${t}</span>`}`).join('')}</nav>`;
}

/* ───────────── Briques partagées ───────────── */
function countFor(specs = [], depts = []) {
  return offers.filter(o => (!specs.length || specs.includes(String(o.sp))) && (!depts.length || depts.includes(o.num))).length;
}
/* Recherche d’offres : les spécialités du CRM qui ont au moins une offre. */
const specOptions = () => specialties.map((s, i) => ({value: String(i), label: s, n: offers.filter(o => o.sp === i).length})).filter(o => o.n).map(({value, label, n}) => ({value, label, meta: offerCount(n)}));
/* Bouton de validation des listes : il annonce le résultat (« Voir les 5 offres »). */
const seeLabel = n => n ? `Voir ${n === 1 ? 'l’offre' : `les ${n} offres`}` : 'Aucune offre : voir les solutions';
const setDone = (root, n) => $$('.multi-done', root).forEach(b => b.textContent = n ? `Voir ${n === 1 ? 'l’offre' : `les ${n} offres`}` : 'Aucune offre');
function searchFields(prefix) {
  return `${multiSelect({id: `${prefix}-specialty`, name: 'specs', label: 'Vos spécialités', icon: 'doctor', options: specOptions(), selected: prefix === 'filter' ? state.filter.specs : [], placeholder: 'Toutes les spécialités', noun: ['spécialité', 'spécialités']})}
  ${multiSelect({id: `${prefix}-dept`, name: 'depts', label: 'Départements', icon: 'pin', options: deptOptions(), selected: prefix === 'filter' ? state.filter.depts : [], placeholder: 'Tous les départements', noun: ['département', 'départements']})}`;
}
/* Liste déroulante à choix multiple : un bouton qui ouvre une fenêtre de cases à cocher (Popover API, au-dessus
   de tout, fermée par Échap ou un clic à côté). Chaque changement émet « multichange » avec les valeurs choisies.
   En Next.js : un composant <MultiSelect> (ou le Listbox multiple de la bibliothèque d’interface retenue). */
function multiSelect({id, name, label, icon: ic = '', options, selected = [], placeholder, noun, required = false, full = false}) {
  return `<div class="field multi ${full ? 'full' : ''}" data-multi-name="${name}" data-placeholder="${esc(placeholder)}" data-one="${noun[0]}" data-many="${noun[1]}">
    <span class="multi-label" id="${id}-label">${label}${required ? ' <span class="req" aria-hidden="true">*</span>' : ''}</span>
    <button type="button" class="multi-toggle" id="${id}" popovertarget="${id}-panel" aria-labelledby="${id}-label ${id}-value" aria-haspopup="true">${ic ? icon(ic) : ''}<span class="multi-value" id="${id}-value">${esc(multiSummary(options, selected, placeholder, noun))}</span>${icon('down', 'multi-caret')}</button>
    <div class="multi-panel" id="${id}-panel" popover role="group" aria-labelledby="${id}-label">
      <div class="multi-head"><strong>${label}</strong><span>Plusieurs choix possibles</span><button type="button" class="multi-close" popovertarget="${id}-panel" popovertargetaction="hide" aria-label="Fermer la liste">${icon('close')}</button></div>
      <div class="multi-options">${options.map((o, i) => `<label class="multi-option"><input type="checkbox" name="${name}" value="${esc(o.value)}" data-multi data-label="${esc(o.label)}" ${required ? 'data-required-group' : ''} ${selected.includes(o.value) ? 'checked' : ''}><span class="multi-text">${esc(o.label)}${o.hint ? `<em>${esc(o.hint)}</em>` : ''}</span>${o.meta ? `<small>${o.meta}</small>` : ''}</label>`).join('')}</div>
      <div class="multi-foot"><button type="button" class="reset-link multi-clear">Tout effacer</button><button type="button" class="btn btn-primary multi-done" popovertarget="${id}-panel" popovertargetaction="hide">Valider</button></div>
    </div></div>`;
}
/* Compteurs des listes : chaque option annonce combien d’offres elle donnerait avec les autres choix en cours.
   Une option à 0 est grisée (elle reste cochable : la page Offres propose alors des solutions). */
function refreshCounts(root, f) {
  const fits = (o, x) => (!x.specs.length || x.specs.includes(String(o.sp))) && (!x.depts.length || x.depts.includes(o.num)) && (!x.months?.length || offerMonths(o).some(m => x.months.includes(m)));
  for (const key of ['specs', 'depts', 'months']) $$(`.multi[data-multi-name="${key}"] input[data-multi]`, root).forEach(i => {
    const n = offers.filter(o => fits(o, {...f, [key]: [i.value]})).length, opt = i.closest('.multi-option'), small = $('small', opt);
    opt.classList.toggle('is-zero', !n); if (small) small.textContent = n ? offerCount(n) : 'aucune offre';
  });
}
function multiSummary(options, selected, placeholder, [one, many]) {
  const chosen = options.filter(o => selected.includes(o.value));
  return !chosen.length ? placeholder : chosen.length === 1 ? chosen[0].label : chosen.length === 2 ? `${chosen[0].label}, ${chosen[1].label}` : `${chosen.length} ${many}`;
}
const multiValues = root => $$('input[data-multi]:checked', root).map(i => i.value);
function setMultiValues(root, values) { $$('input[data-multi]', root).forEach(i => i.checked = values.includes(i.value)); refreshMulti(root); }
function refreshMulti(root) {
  const options = $$('input[data-multi]', root).map(i => ({value: i.value, label: i.dataset.label}));
  $('.multi-value', root).textContent = multiSummary(options, multiValues(root), root.dataset.placeholder, [root.dataset.one, root.dataset.many]);
  root.classList.toggle('has-value', multiValues(root).length > 0);
}
function bindMulti(root = document) {
  $$('.multi', root).forEach(m => {
    if (m.dataset.bound) return; m.dataset.bound = '1';
    const toggle = $('.multi-toggle', m), panel = $('.multi-panel', m);
    refreshMulti(m);
    /* La fenêtre suit son bouton : dessous s’il y a la place, sinon au-dessus. */
    const place = () => {
      if (innerWidth < 620) { Object.assign(panel.style, {left: '0px', right: '0px', top: 'auto', bottom: '0px', width: '100%', maxHeight: '78vh'}); panel.dataset.side = 'sheet'; return; }
      panel.style.right = 'auto';
      const r = toggle.getBoundingClientRect(), w = Math.max(r.width, 340), below = innerHeight - r.bottom - 12, above = r.top - 12;
      panel.style.width = `${Math.min(w, innerWidth - 24)}px`; panel.style.left = `${Math.max(12, Math.min(r.left, innerWidth - w - 12))}px`;
      if (below < 260 && above > below) { panel.style.top = 'auto'; panel.style.bottom = `${innerHeight - r.top + 6}px`; panel.style.maxHeight = `${Math.min(420, above)}px`; panel.dataset.side = 'top'; }
      else { panel.style.bottom = 'auto'; panel.style.top = `${r.bottom + 6}px`; panel.style.maxHeight = `${Math.min(420, below)}px`; panel.dataset.side = 'bottom'; }
    };
    const follow = () => requestAnimationFrame(place);
    panel.addEventListener('beforetoggle', e => {
      if (e.newState === 'open') { place(); addEventListener('scroll', follow, {passive: true}); addEventListener('resize', follow); }
      else { removeEventListener('scroll', follow); removeEventListener('resize', follow); }
    });
    panel.addEventListener('toggle', e => { toggle.setAttribute('aria-expanded', e.newState === 'open'); if (e.newState === 'open') $('input', panel)?.focus({preventScroll: true}); });
    const emit = () => { refreshMulti(m); m.dispatchEvent(new CustomEvent('multichange', {bubbles: true, detail: {name: m.dataset.multiName, values: multiValues(m)}})); };
    panel.addEventListener('change', emit);
    $('.multi-clear', m).addEventListener('click', () => { $$('input[data-multi]', m).forEach(i => i.checked = false); emit(); $('input', panel)?.focus(); });
    $('.multi-done', m).addEventListener('click', () => requestAnimationFrame(() => toggle.focus()));
  });
}
/* La fenêtre est hors du formulaire dans l’arbre visuel, mais ses cases y restent : les valeurs sont envoyées normalement. */
/* Spécialités dans l’ordre utile : celles qui recrutent le plus d’abord, « Autre spécialité » en dernier. */
const specialtyChoices = () => {
  const demand = s => offers.filter(o => o.specialty === s).length;
  return [...allSpecialties].filter(s => s !== 'Autre spécialité').sort((a, b) => demand(b) - demand(a) || a.localeCompare(b, 'fr')).concat('Autre spécialité').map(s => ({value: s, label: s}));
};
/* Choix multiple tout visible : des puces à cocher, sans liste déroulante. Les plus demandées d’abord ;
   « + N autres spécialités » déplie le reste sur place. Chaque puce est une vraie case à cocher. */
function chipPicker({name, legend, options, selected = [], top = options.length, required = false, dark = false, note = 'Plusieurs choix possibles', more = 'spécialités'}) {
  const opt = (o, i) => `<label class="pick" style="--c:${i}"><input type="checkbox" name="${name}" value="${esc(o.value)}" data-multi data-error-label="${esc(legend)}" ${required ? 'data-required-group' : ''} ${selected.includes(o.value) ? 'checked' : ''}><span>${esc(o.label)}</span></label>`;
  const first = options.slice(0, top), rest = options.slice(top), open = rest.some(o => selected.includes(o.value));
  return `<fieldset class="field full picker ${dark ? 'is-dark' : ''}" id="${name}-group"><legend>${legend}${required ? ' <span class="req" aria-hidden="true">*</span>' : ''}${note ? ` <span class="legend-note">${note}</span>` : ''}</legend>
    <div class="picks">${first.map(opt).join('')}${rest.length ? `<span class="picks-more" ${open ? '' : 'hidden'}>${rest.map((o, i) => opt(o, i + top)).join('')}</span><button type="button" class="pick-toggle" aria-expanded="${open}" data-more="${rest.length}" data-noun="${more}">${open ? 'Voir moins' : `+ ${rest.length} autres ${more}`}</button>` : ''}</div></fieldset>`;
}
/* Mini-brief établissement : spécialités (toutes disponibles) et contrat, puis le formulaire arrive prérempli. */
function quickBrief(prefix) {
  const b = state.brief;
  return `<form class="quick-brief" id="${prefix}-brief" aria-label="Préparer ma demande de renfort">
    ${chipPicker({name: 'briefSpecs', legend: 'Quels renforts cherchez-vous ?', options: specialtyChoices(), selected: b.specialties, top: 6, dark: true})}
    <fieldset><legend>Pour quel contrat ?</legend><div class="chips">${contracts.map((c, i) => `<button type="button" class="chip" style="--c:${i + briefSpecialties.length}" data-brief="contract" data-value="${esc(c)}" aria-pressed="${b.contract === c}">${c}</button>`).join('')}</div></fieldset>
    <div class="brief-foot"><button type="submit" class="btn btn-coral">Continuer ma demande${icon('arrow')}</button><span class="brief-hint">${icon('clock')}<span data-brief-hint>${briefHint()}</span></span></div>
  </form>`;
}
function briefHint() {
  const b = state.brief, done = (b.specialties.length ? 1 : 0) + (b.contract ? 1 : 0);
  return done === 2 ? `Ensuite : ${b.contract && !isShortContract(b.contract) ? 'la date de prise de poste' : 'vos créneaux'} et vos coordonnées.` : done === 1 ? 'Encore un choix, ou continuez.' : 'Quelques clics suffisent.';
}
function bindBrief(root = document) {
  $$('.quick-brief', root).forEach(form => {
    form.addEventListener('click', e => {
      const chip = e.target.closest('[data-brief]'); if (!chip) return;
      const key = chip.dataset.brief, val = chip.dataset.value;
      state.brief[key] = state.brief[key] === val ? '' : val;
      $$(`[data-brief="${key}"]`, form).forEach(c => c.setAttribute('aria-pressed', c.dataset.value === state.brief[key]));
      $('[data-brief-hint]', form).textContent = briefHint();
    });
    form.addEventListener('change', e => {
      if (e.target.name !== 'briefSpecs') return;
      state.brief.specialties = $$('[name="briefSpecs"]:checked', form).map(i => i.value);
      $('[data-brief-hint]', form).textContent = briefHint();
    });
    form.addEventListener('submit', e => {
      e.preventDefault();
      const v = state.employer.values;
      if (state.brief.specialties.length) v.specialties = [...state.brief.specialties];
      if (state.brief.contract) v.contract = state.brief.contract;
      state.employer.success = false; v.wizardSeen = v.wizardReady = false;
      /* Spécialités et contrat déjà choisis : la demande s’ouvre directement sur les dates. */
      location.hash = v.specialties?.length && v.contract ? '/besoin?etape=2' : '/besoin';
    });
  });
}
function offerCard(o) {
  return `<article class="offer-card ${o.soon ? 'is-soon' : ''}" data-dept="${o.num}" data-offer="${o.id}">
    <div class="card-top"><span class="status ${o.soon ? 'soon' : ''}">${o.soon ? 'À venir' : 'Disponible'}</span>${favButton(o)}<span class="dept-num" aria-hidden="true">${o.num}</span></div>
    <h3><a href="#/offre/${o.id}" class="stretched">${o.specialty}</a></h3>
    <p class="offer-place">${icon('pin')}${o.place}</p>
    <div class="offer-meta"><span>${icon('calendar')}${slotRange(o)}</span><span>${icon('clock')}${o.slots.length ? `${slotCount(o.slots.length)} · ${slotTypes(o)}` : 'Dates à venir'}</span><span>${icon('badge')}${o.contract}</span><span class="ref">${icon('file')}Réf. ${o.ref}</span></div>
    <span class="card-go" aria-hidden="true">${icon('arrow')}</span></article>`;
}

/* Parcours praticien : une vraie séquence, d’où la numérotation. */
const journeySteps = [
  ['diploma','Étude de votre dossier','Votre spécialité, votre diplôme, votre projet. Un conseiller vous rappelle sous 48 h.'],
  ['shield','Démarches d’exercice','Reconnaissance du diplôme, épreuves de vérification des connaissances ou autorisation d’exercice, selon votre cas.'],
  ['people','Mise en relation','Des offres compatibles avec votre situation et votre région.'],
  ['heart','Prise de poste','Un accompagnement qui continue après votre arrivée.']
];
/* La ligne pointillée est tracée par motion.js au fil du défilement : chaque étape s’allume quand elle l’atteint. */
function journey() {
  return `<div class="journey-wrap"><span class="journey-track" aria-hidden="true"><span class="journey-fill"></span></span><ol class="journey">${journeySteps.map(([ic,t,d],i) => `<li class="journey-step"><span class="journey-marker"><span>${i + 1}</span></span><div>${icon(ic)}<h3>${t}</h3><p>${d}</p></div></li>`).join('')}<li class="journey-end" aria-hidden="true"><span></span>France</li></ol></div>`;
}
const employerSteps = [
  ['file','Décrivez votre besoin','La spécialité, le contrat et le délai souhaité. Une seule demande suffit.'],
  ['shield','Recevez des profils vérifiés','Diplôme d’origine contrôlé et situation auprès de l’Ordre suivie.'],
  ['people','Rencontrez vos candidats','Nous organisons la mise en relation et restons à vos côtés.']
];
/* Étapes établissement : une vraie séquence, reliée par le pointillé ; le chiffre se remplit à l’arrivée. */
function steps(list) {
  return `<ol class="steps">${list.map(([ic,t,d],i) => `<li><span class="step-n" data-n="${i + 1}" aria-hidden="true">${i + 1}</span><h3>${t}</h3><p>${d}</p></li>`).join('')}</ol>`;
}
function cta({title, text, label, href, alt = true}) {
  return `<section class="cta-band"><div class="container"><div class="cta-inner"><div><h2>${dot(title)}</h2><p>${text}</p></div><div class="actions">${btn(label, href, 'coral')}${alt ? `<a class="tel-link" href="${TEL}">${icon('phone')}<span><small>Plutôt par téléphone ?</small>${PHONE}</span></a>` : ''}</div></div></div></section>`;
}
const promise = items => `<ul class="promise">${items.map(([ic,t]) => `<li>${icon(ic)}${t}</li>`).join('')}</ul>`;

/* ───────────── Accueil : deux portes, toujours ─────────────
   Le visiteur ouvre la porte qui le concerne. Rien n’est mémorisé, rien ne change tout seul. */
function doorPro() {
  const total = countFor();
  return `<article class="door door-pro door-half">
    <div class="door-body">
      <h2 class="door-title">Votre prochain poste <em>en France</em><span class="dot">.</span></h2>
      <img class="door-avatar" src="assets/medecin-avatar.jpg" alt="" width="240" height="240">
      <p class="lead"><strong>Médecins et professionnels de santé</strong>&nbsp;: trouvez une offre et avancez avec un conseiller, du diplôme à la prise de poste.</p>
      <form class="hero-search" id="home-search" role="search" aria-label="Trouver une offre">${searchFields('home')}<button class="btn btn-primary" type="submit"><span id="home-count">Voir les ${total} offres</span>${icon('arrow')}</button></form>
      ${promise([['check','Gratuit pour les praticiens'],['clock','Réponse sous 48 h'],['globe','Depuis la France ou l’étranger']])}
      <a class="elig-teaser" href="#/eligibilite">${icon('diploma')}<span><strong>Puis-je exercer en France ?</strong>Faites le point en 3 questions</span>${icon('arrow')}</a>
    </div>
  </article>`;
}
/* Porte établissement : un seul bouton. La pré-demande (spécialités, contrat) est sur la page Établissements. */
function doorEtab() {
  return `<article class="door door-etab door-half">
    <div class="door-body">
      <h2 class="door-title">Du renfort pour <em>vos équipes</em><span class="dot">.</span></h2>
      <img class="door-avatar" src="assets/equipe-avatar.jpg" alt="" width="240" height="240">
      <p class="lead"><strong>Hôpitaux, cliniques, EHPAD, centres de santé</strong>&nbsp;: des professionnels aux profils vérifiés, en intérim, en vacation, en CDD ou en CDI.</p>
      <div class="door-actions"><a class="btn btn-coral" href="#/besoin">Décrire mon besoin${icon('arrow')}</a><a class="text-link" href="#/etablissements">Comment ça marche${icon('arrow')}</a></div>
      ${promise([['shield','Profils vérifiés'],['people','Un interlocuteur dédié'],['bolt','Remplacements urgents']])}
      <p class="urgent">${icon('bolt')}<span>Besoin urgent ?</span><a href="${TEL}"><strong>${PHONE}</strong></a><span aria-hidden="true">·</span><button type="button" data-callback>Être rappelé</button></p>
    </div>
  </article>`;
}
function homeHero() {
  return `<section class="split-hero is-open"><h1 class="sr-only">Laska Corporate, le recrutement médical pour les professionnels et les établissements de santé</h1>
    <div class="container"><div class="split-grid">${doorPro()}${doorEtab()}</div></div></section>`;
}

/* Index des spécialités : survoler (ou parcourir au clavier) une spécialité montre sur la carte où elle recrute,
   avec le nombre de missions par département ; survoler un département éclaire les spécialités qui y recrutent. */
function specialtyIndex() {
  const items = specialties.map((s, i) => ({s, i, list: offers.filter(o => o.sp === i)})).filter(x => x.list.length).sort((a, b) => b.list.length - a.list.length || a.i - b.i);
  return `<ul class="sp-index">${items.map(({s, i, list}) => `<li><a href="#/offres?specialite=${i}" data-sp="${i}" data-depts="${[...new Set(list.map(o => o.num))].join(' ')}"><span class="sp-name">${s}</span><span class="sp-n" aria-hidden="true">${list.length}</span><span class="sr-only"> : ${offerCount(list.length)}</span></a></li>`).join('')}</ul>`;
}
/* Carte de l’accueil : dessinée seulement là où elle s’affiche. Sur téléphone, ses 1 400 points ne serviraient à rien
   (la liste des spécialités la remplace) ; si l’écran s’élargit, elle est ajoutée sur place. */
const MAP_MQ = matchMedia('(min-width: 861px)');
MAP_MQ.addEventListener('change', () => {
  const slot = $('.missions-map'); if (!MAP_MQ.matches || !slot || slot.firstElementChild) return;
  slot.innerHTML = franceMap(); const section = slot.closest('.missions'); bindMap(section); bindIndex(section);
});
function bindIndex(root = document) {
  const index = $('.sp-index', root), fig = $('.missions-map .france-map', root); if (!index || !fig) return;
  const links = $$('[data-sp]', index);
  const showSpecialty = sp => { updateMap(fig, sp === '' ? offers : offers.filter(o => o.sp === Number(sp))); links.forEach(a => a.classList.toggle('is-dim', sp !== '' && a.dataset.sp !== sp)); index.classList.toggle('is-picking', sp !== ''); fig.classList.toggle('is-picking', sp !== ''); };
  const showDept = num => links.forEach(a => a.classList.toggle('is-dim', !!num && !a.dataset.depts.split(' ').includes(num)));
  links.forEach(a => { a.addEventListener('pointerenter', () => showSpecialty(a.dataset.sp)); a.addEventListener('focus', () => showSpecialty(a.dataset.sp)); });
  index.addEventListener('pointerleave', () => showSpecialty('')); index.addEventListener('focusout', e => { if (!index.contains(e.relatedTarget)) showSpecialty(''); });
  $$('.pin', fig).forEach(pin => { pin.addEventListener('pointerenter', () => showDept(pin.dataset.dept)); pin.addEventListener('pointerleave', () => showDept('')); pin.addEventListener('focus', () => showDept(pin.dataset.dept)); pin.addEventListener('blur', () => showDept('')); });
}
function missionsSection() {
  const depts = new Set(offers.map(o => o.num)).size;
  return `<section class="section missions"><div class="container missions-grid">
    <div class="missions-copy"><h2 aria-label="${offers.length} offres, ${depts} départements."><span class="count" data-count-to="${offers.length}">${offers.length}</span> offres, <span class="count" data-count-to="${depts}">${depts}</span> départements<span class="dot">.</span></h2><p class="section-lead">Choisissez une spécialité ou un département pour voir ses offres.</p>
      ${specialtyIndex()}
      ${btn('Toutes les offres', '#/offres', 'outline')}<a class="text-link missions-depts" href="#/offres?filtres=1">${icon('pin')}Voir les offres par département</a></div>
    <div class="missions-map">${MAP_MQ.matches ? franceMap() : ''}</div>
  </div></section>`;
}
function belief() {
  return `<section class="belief"><div class="container belief-inner"><p class="belief-quote">La compétence n’a pas de frontière<span class="dot">.</span></p><div class="belief-side"><figure class="belief-photo"><img src="assets/praticienne.jpg" alt="" width="1100" height="733" loading="lazy"></figure><p>C’est la conviction qui guide Laska Corporate, pour chaque praticien et chaque établissement.</p><a class="text-link" href="#/engagement">Notre engagement${icon('arrow')}</a></div></div></section>`;
}
function proSections() {
  return `${missionsSection()}
  <section class="section section-paper"><div class="container"><div class="section-head"><h2>${dot('Du diplôme à la prise de poste.')}</h2><a class="text-link" href="#/praticiens">L’accompagnement${icon('arrow')}</a></div>${journey()}</div></section>`;
}
function verifySection() {
  return `<section class="section verify"><div class="container verify-grid"><figure class="verify-photo"><img src="assets/praticienne.jpg" alt="Praticienne en blouse blanche" width="1100" height="733" loading="lazy"></figure>
    <div><h2>${dot('Ce que nous vérifions pour vous.')}</h2><p class="verify-lead">Avant chaque mise en relation&nbsp;:</p>
    ${checkList(['Le diplôme d’origine du professionnel','Sa situation auprès de l’Ordre concerné','Le suivi de ses démarches d’autorisation d’exercice'])}
    <div class="sector-line"><span>Nous accompagnons</span>${['Hôpitaux publics','Cliniques privées','EHPAD','Centres de santé','Cabinets'].map(s => `<span class="tag">${s}</span>`).join('')}</div></div></div></section>`;
}
function home() {
  /* « Ils nous font confiance. » : des témoignages extraits des avis (le bloc complet des avis est sur la page Praticiens et sur #/avis). */
  return homeHero() + proSections() + temoignagesSection() + belief();
}

/* ───────────── Pages publics ───────────── */
/* Sous-pages : le fil d’Ariane situe la page (plus d’étiquette au-dessus du titre). */
function subHero({crumb, title, lead, actions, photo, alt, note, side = ''}) {
  return `<section class="sub-hero"><div class="container">${breadcrumb([[crumb]])}<div class="sub-grid"><div class="sub-copy"><h1>${title}</h1><p class="lead">${lead}</p>${actions}${note || ''}</div>${side || `<figure class="sub-photo"><img src="assets/${photo}" alt="${alt}" width="1100" height="733" fetchpriority="high"></figure>`}</div></div></section>`;
}
function practitioners() {
  return subHero({crumb:'Praticiens', title:`Exercez en France, <em>accompagné</em><span class="dot">.</span>`, lead:'Diplôme, autorisations, mission : un conseiller vous aide à chaque étape. Gratuitement.', actions:`<div class="actions">${btn('Créer mon dossier','#/postuler','coral')}${btn('Suis-je éligible ?','#/eligibilite','outline','')}</div><a class="text-link elig-link" href="#/offres">Voir les offres${icon('arrow')}</a>`, note:promise([['check','Gratuit'],['clock','Réponse sous 48 h'],['globe','Depuis la France ou l’étranger']]), photo:'medecin.jpg', alt:'Médecin en blouse blanche, bras croisés'})
  + `<section class="section section-paper"><div class="container"><div class="section-head"><h2>${dot('Un parcours clair, à votre rythme.')}</h2></div>${journey()}
    <details class="journey-details"><summary>Voir les démarches en détail ${icon('plus')}</summary><div class="details-body">${checkList(['Étude de votre diplôme et de votre parcours','Orientation vers la procédure de reconnaissance adaptée','Mise en relation avec des offres compatibles','Suivi de l’autorisation d’exercice','Accompagnement à la prise de poste'])}</div></details></div></section>
  ${avisSection()}
  <section class="section" id="faq"><div class="container faq-layout"><div><h2>Vos questions, nos réponses<span class="dot">.</span></h2><a class="text-link" href="#/contact">Poser une autre question${icon('arrow')}</a></div>${faq(practitionerFAQ)}</div></section>
  ${cta({title:'Faisons le premier pas.', text:'Cinq étapes courtes, et votre conseiller vous rappelle sous 48 h.', label:'Créer mon dossier', href:'#/postuler'})}`;
}
function employers() {
  /* Tarifs encore à préciser : repliés sous une phrase (la page reste courte, surtout sur téléphone). */
  const pricingOpen = !!(PRICING.interim || PRICING.cdi || PRICING.delay);
  return subHero({crumb:'Établissements', title:`Du renfort pour <em>vos équipes</em><span class="dot">.</span>`, lead:'Intérim, vacation, CDI ou CDD. Des professionnels de santé aux profils vérifiés, adaptés à votre besoin.', actions:'', side:`<div class="brief-card"><p class="brief-card-title">${icon('file')}Préparez votre demande</p>${quickBrief('etab')}<a class="urgent" href="${TEL}">${icon('bolt')}Besoin urgent ? <strong>${PHONE}</strong></a></div>`, note:promise([['badge','Intérim, vacation, CDI, CDD'],['shield','Profils vérifiés'],['people','Un interlocuteur dédié']])})
  + `<section class="section section-paper"><div class="container"><div class="section-head"><h2>${dot('Un besoin. Une équipe à vos côtés.')}</h2></div>${steps(employerSteps)}</div></section>
  ${verifySection()}
  <section class="section section-paper"><div class="container contract-grid">
    <article class="contract"><span class="contract-tag">Intérim · Vacation</span><h3>${dot('Un besoin ponctuel.')}</h3><p>Remplacements, gardes, vacations, renfort saisonnier. Indiquez vos créneaux : nous proposons des profils dès qu’une compatibilité est identifiée.</p></article>
    <article class="contract contract-dark"><span class="contract-tag">CDI · CDD</span><h3>${dot('Un recrutement dans la durée.')}</h3><p>Un professionnel rejoint votre équipe, pour une durée définie ou sur le long terme, à la date que vous choisissez. Nous l’accompagnons dans ses démarches.</p></article>
  </div></section>
  <section class="section pricing"><div class="container"><div class="section-head"><h2>${dot('Tarifs et délais.')}</h2><p class="section-lead">${pricingOpen ? 'Ce qu’il faut savoir avant de nous confier une demande.' : 'Les tarifs dépendent du contrat et de la durée : un conseiller vous les présente sous 24 h ouvrées, sans engagement.'}</p></div>
    ${pricingOpen ? '' : `<details class="journey-details pricing-fold"><summary>Voir ce qui est compris ${icon('plus')}</summary><div class="details-body">`}<div class="pricing-grid">
      <article class="price-card"><h3>Intérim et vacation</h3><div class="price">${PRICING.interim || todo('tarif de la mise à disposition', 'Par exemple : par garde, par journée, ou en pourcentage.')}</div>${checkList(['Profils vérifiés : diplôme et situation auprès de l’Ordre','Remplacements urgents','Un interlocuteur dédié'])}</article>
      <article class="price-card"><h3>CDI et CDD</h3><div class="price">${PRICING.cdi || todo('honoraires de recrutement', 'Par exemple : forfait ou pourcentage du salaire annuel.')}</div>${checkList(['Profils vérifiés avant présentation','Suivi des démarches d’autorisation d’exercice','Accompagnement après l’arrivée'])}</article>
      <article class="price-card price-delay"><h3>Délais</h3><div class="price">${PRICING.delay || todo('délai moyen avant un premier profil')}</div><p>Une seule demande suffit pour commencer, sans engagement. Pour un besoin urgent, appelez le <a class="text-link" href="${TEL}">${PHONE}</a>.</p></article>
    </div>${pricingOpen ? '' : '</div></details>'}</div></section>
  <section class="section" id="faq"><div class="container faq-layout"><div><h2>Recruter, en toute clarté<span class="dot">.</span></h2><a class="text-link" href="#/contact">Une autre question ?${icon('arrow')}</a></div>${faq(employerFAQ)}</div></section>
  ${cta({title:'Parlons de votre prochain renfort.', text:'Une seule demande pour commencer. Un conseiller vous rappelle sous 24 h ouvrées, sans engagement.', label:'Décrire mon besoin', href:'#/besoin'})}`;
}
function engagement() {
  return `<section class="engagement-hero"><div class="container">${breadcrumb([['Notre engagement']])}<h1>Ouvrir les portes<span class="dot">.</span><br><em>Reconnaître les talents</em><span class="dot">.</span></h1><p class="lead">L’origine d’un diplôme ou une différence ne définit pas une compétence.</p></div></section>
  <div class="container"><div class="engagement-banner"><img src="assets/praticienne.jpg" alt="Praticienne en tenue médicale" width="1100" height="733" loading="lazy"><div class="editorial-copy"><h2>${dot('Une place pour chaque parcours.')}</h2><p>Nous accompagnons les professionnels de santé vers l’exercice en France, avec rigueur et attention. Et nous aidons les établissements à trouver les renforts dont leurs équipes ont besoin.</p></div></div></div>
  <section class="section"><div class="container"><ul class="principle-list">${[['La compétence d’abord','Un métier et un parcours, au-delà de l’origine du diplôme.'],['Des démarches suivies','Reconnaissance du diplôme et autorisations d’exercice, sans raccourci.'],['Une relation humaine','Un interlocuteur qui connaît votre situation.']].map(([t,d]) => `<li class="principle"><h2>${dot(t + '.')}</h2><p>${d}</p></li>`).join('')}</ul></div></section>
  <section class="section section-mint"><div class="container inclusion-line"><div><h2>${dot('Le même engagement pour tous.')}</h2><p>Laska Corporate accompagne aussi le recrutement de personnes porteuses de trisomie 21. La même attention aux compétences et au suivi.</p></div>${btn('En parler avec nous','#/contact','outline','')}</div></section>`;
}

/* ───────────── Offres ───────────── */
function offerRow(o) {
  return `<article class="offer-row ${o.soon ? 'is-soon' : ''}" data-dept="${o.num}" data-offer="${o.id}" data-flip="${o.id}"><span class="row-num" aria-hidden="true">${o.num}</span>
    <div class="row-main"><h2><a href="#/offre/${o.id}" class="stretched">${o.specialty}</a></h2><p><span class="row-place" title="${esc(o.place)}">${icon('pin')}${o.city} (${o.num})<span class="sr-only">, ${o.dept}</span></span><span class="sep"></span>${o.contract}<span class="sep"></span><span class="ref">Réf. ${o.ref}</span></p></div>
    <div class="row-when">${icon('calendar')}<span>${slotRange(o)}<small>${o.slots.length ? `${slotCount(o.slots.length)} · ${slotTypes(o)}` : 'Dates à venir'}</small></span></div>
    <span class="status ${o.soon ? 'soon' : ''}">${o.soon ? 'À venir' : 'Disponible'}</span>
    ${favButton(o)}<span class="row-go" aria-hidden="true">${icon('arrow')}</span></article>`;
}
function offersPage() {
  return `<section class="page-heading"><div class="container">${breadcrumb([['Offres d’emploi']])}<h1>${dot('Trouvez l’offre qui vous correspond.')}</h1><p class="lead">Votre spécialité, votre région. Les résultats se mettent à jour pendant que vous choisissez.</p></div></section>
  <section class="offers-section"><div class="container">
    <button type="button" class="btn btn-outline filter-open" id="filter-open" aria-expanded="false" aria-controls="filter-form">${icon('search')}<span>Filtrer les offres<span id="filter-n"></span></span>${icon('down', 'filter-caret')}</button>
    <form class="filter-bar" id="filter-form" role="search" aria-label="Rechercher une offre"><div class="filter-fields">${searchFields('filter')}${multiSelect({id: 'filter-month', name: 'months', label: 'Période', icon: 'calendar', options: periodOptions(), selected: state.filter.months, placeholder: 'Toutes les périodes', noun: ['mois', 'mois']})}</div>
      <div class="filter-status" role="group" aria-label="Disponibilité des offres"><span class="filter-thumb" aria-hidden="true"></span>${[['all','Toutes'],['open','Disponibles'],['soon','À venir']].map(([v,t]) => `<button type="button" class="filter-chip" data-status="${v}" aria-pressed="false">${t}<span data-count="${v}"></span></button>`).join('')}</div>
      <button type="button" class="btn btn-primary filter-apply" data-filter-close>Voir les offres</button></form>
    <div class="results-head"><p id="results-count" role="status" aria-live="polite"></p><button type="button" class="reset-link" id="reset-filters">${icon('close')}Tout effacer</button>
      <button type="button" class="fav-filter" id="fav-filter" aria-pressed="${state.filter.fav}">${icon('heart')}Offres gardées <span data-fav-count>${favList().length}</span></button>
      <label class="sort-field" for="sort">Trier<select id="sort"><option value="date" ${state.sort === 'date' ? 'selected' : ''}>Dates les plus proches</option><option value="dept" ${state.sort === 'dept' ? 'selected' : ''}>Par département</option><option value="spec" ${state.sort === 'spec' ? 'selected' : ''}>Par spécialité</option></select></label>
      <div class="view-toggle" role="group" aria-label="Affichage"><button type="button" data-view="list" aria-pressed="${state.view === 'list'}">${icon('list')}Liste</button><button type="button" data-view="map" aria-pressed="${state.view === 'map'}">${icon('map')}Carte</button></div></div>
    <div class="offers-layout view-${state.view}"><div id="offer-results"></div><aside class="offers-map" aria-label="Carte des résultats"><div id="map-slot"></div></aside></div>
    <div class="offer-note"><div><h2>${dot('Pas encore la bonne offre ?')}</h2><p>Confiez-nous votre projet : nous vous prévenons dès qu’une offre vous correspond.</p></div>${btn('Créer mon dossier','#/postuler','coral')}</div>
  </div></section>`;
}
function filtered() {
  const f = state.filter;
  const favs = favList();
  const base = offers.filter(o => (!f.specs.length || f.specs.includes(String(o.sp))) && (!f.depts.length || f.depts.includes(o.num)) && (!f.months.length || offerMonths(o).some(m => f.months.includes(m))) && (!f.fav || favs.includes(o.id)));
  const order = {date: (a, b) => firstDate(a).localeCompare(firstDate(b)), dept: (a, b) => a.num.localeCompare(b.num) || firstDate(a).localeCompare(firstDate(b)), spec: (a, b) => a.specialty.localeCompare(b.specialty, 'fr') || firstDate(a).localeCompare(firstDate(b))}[state.sort];
  return {base, list: base.filter(o => f.status === 'all' || (f.status === 'soon' ? o.soon : !o.soon)).sort(order)};
}
function updateResults(writeURL = true) {
  const f = state.filter, {base, list} = filtered(), any = f.specs.length > 0 || f.depts.length > 0 || f.months.length > 0 || f.fav || f.status !== 'all';
  const M = writeURL ? window.LaskaMotion : null;
  const countHTML = `<strong>${list.length}</strong> offre${list.length > 1 ? 's' : ''} ${any ? 'trouvée' + (list.length > 1 ? 's' : '') : 'ouverte' + (list.length > 1 ? 's' : '')}`;
  M ? M.roll($('#results-count'), countHTML, true) : $('#results-count').innerHTML = countHTML;
  for (const [key, n] of [['all', base.length], ['open', base.filter(o => !o.soon).length], ['soon', base.filter(o => o.soon).length]]) M ? M.roll($(`[data-count="${key}"]`), String(n)) : $(`[data-count="${key}"]`).textContent = n;
  $$('[data-status]').forEach(b => b.setAttribute('aria-pressed', b.dataset.status === f.status));
  moveThumb();
  $('#reset-filters').hidden = !any;
  setDone($('#filter-form'), list.length); refreshCounts($('#filter-form'), f);
  const nf = f.specs.length + f.depts.length + f.months.length + (f.status !== 'all') + f.fav;
  $('#filter-n').textContent = nf ? ` (${nf})` : ''; $('[data-filter-close]').textContent = list.length ? seeLabel(list.length) : 'Aucune offre : voir les solutions';
  const alts = [];
  if (!list.length) {
    const match = (o, specs, depts) => (!specs.length || specs.includes(String(o.sp))) && (!depts.length || depts.includes(o.num));
    if (f.specs.length && f.depts.length) {
      const a = offers.filter(o => match(o, f.specs, [])).length, b = offers.filter(o => match(o, [], f.depts)).length;
      if (a) alts.push(['all-depts', `${seeLabel(a)} de cette spécialité dans toute la France`]);
      if (b) alts.push(['all-specs', `${seeLabel(b)} de ${f.depts.length > 1 ? 'ces départements' : 'ce département'}, toutes spécialités`]);
    }
    if (f.status !== 'all' && base.length) alts.push(['all-status', `${seeLabel(base.length)}, disponibles ou à venir`]);
    if (f.months.length) { const n = offers.filter(o => match(o, f.specs, f.depts)).length; if (n) alts.push(['all-months', `${seeLabel(n)}, toutes périodes`]); }
    if (f.fav && !favList().length) alts.length = 0;
  }
  $('#fav-filter')?.setAttribute('aria-pressed', f.fav);
  const paint = () => $('#offer-results').innerHTML = list.length ? `<div class="offer-list">${list.map(offerRow).join('')}</div>` : `<div class="empty-state">${icon('search')}<h2>${f.fav && !favList().length ? 'Vous n’avez pas encore gardé d’offre.' : 'Aucune offre pour ces critères.'}</h2>${f.fav && !favList().length ? `<p>Touchez ${icon('heart')} sur une offre pour la retrouver ici, dans ce navigateur.</p>` : ''}${alts.length ? `<div class="empty-alts">${alts.map(([k, l]) => `<button type="button" class="btn btn-outline" data-alt="${k}">${l}${icon('arrow')}</button>`).join('')}</div>` : ''}<p>Essayez un autre département ou retirez un filtre. Vous pouvez aussi créer votre dossier : nous vous prévenons dès qu’une offre correspond.</p><div class="actions"><button type="button" class="btn btn-outline" id="empty-reset">Voir toutes les offres${icon('arrow')}</button>${btn('Créer mon dossier','#/postuler','coral','')}</div></div>`;
  M ? M.flip($('#offer-results'), paint) : paint();
  $('#empty-reset')?.addEventListener('click', resetFilters);
  const fig = $('#map-slot .france-map');
  if (fig) updateMap(fig, list, f.depts);
  else {
    $('#map-slot').innerHTML = franceMap({list, selected: f.depts, label:'Carte des résultats par département'});
    /* Toucher un département l’ajoute au filtre (ou le retire) ; la liste déroulante suit. */
    bindMap($('#map-slot'), num => { const d = state.filter.depts; state.filter.depts = d.includes(num) ? d.filter(x => x !== num) : [...d, num]; setMultiValues(deptMulti(), state.filter.depts); updateResults(); });
  }
  if (writeURL) history.replaceState(null, '', '#/offres' + filterQuery());
}
/* Pastille glissante sous le filtre de disponibilité actif. */
function moveThumb() {
  const on = $('[data-status][aria-pressed="true"]'), thumb = $('.filter-thumb'); if (!on || !thumb) return;
  thumb.style.width = `${on.offsetWidth}px`; thumb.style.transform = `translateX(${on.offsetLeft - 4}px)`;
}
const deptMulti = () => $('#filter-dept')?.closest('.multi');
const specMulti = () => $('#filter-specialty')?.closest('.multi');
const monthMulti = () => $('#filter-month')?.closest('.multi');
function resetFilters() { state.filter = {specs:[], depts:[], months:[], fav:false, status:'all'}; setMultiValues(specMulti(), []); setMultiValues(deptMulti(), []); setMultiValues(monthMulti(), []); updateResults(); }
function bindOffers() {
  const p = new URLSearchParams(query);
  state.filter = {specs: (p.get('specialite') || '').split(',').filter(i => i !== '' && specialties[Number(i)]), depts: (p.get('departement') || '').split(',').filter(d => deptGeo[d]), months: (p.get('periode') || '').split(',').filter(m => /^\d{4}-\d{2}$/.test(m)), fav: p.get('gardees') === '1', status: ['open','soon'].includes(p.get('etat')) ? p.get('etat') : 'all'};
  bindMulti($('#filter-form')); setMultiValues(specMulti(), state.filter.specs); setMultiValues(deptMulti(), state.filter.depts); setMultiValues(monthMulti(), state.filter.months); updateResults(false);
  const sync = () => { state.filter.specs = multiValues(specMulti()); state.filter.depts = multiValues(deptMulti()); state.filter.months = multiValues(monthMulti()); updateResults(); };
  specMulti().addEventListener('multichange', sync);
  monthMulti().addEventListener('multichange', sync);
  $('#sort').addEventListener('change', e => { state.sort = e.target.value; updateResults(); });
  $('#fav-filter').addEventListener('click', () => { state.filter.fav = !state.filter.fav; updateResults(); });
  deptMulti().addEventListener('multichange', sync);
  $('#filter-form').addEventListener('submit', e => { e.preventDefault(); sync(); });
  $$('[data-status]').forEach(b => b.addEventListener('click', () => { state.filter.status = b.dataset.status; sync(); }));
  $('#reset-filters').addEventListener('click', resetFilters);
  /* Téléphone : les résultats d’abord ; « Filtrer les offres » ouvre les filtres, « Voir les N offres » les referme. */
  const fo = $('#filter-open'), ff = $('#filter-form');
  const showFilters = open => { ff.classList.toggle('is-open', open); fo.setAttribute('aria-expanded', open); if (open) $('.multi-toggle', ff)?.focus(); };
  fo.addEventListener('click', () => showFilters(!ff.classList.contains('is-open')));
  if (p.get('filtres') && matchMedia('(max-width: 860px)').matches) { ff.classList.add('is-open'); fo.setAttribute('aria-expanded', 'true'); }
  $('[data-filter-close]', ff).addEventListener('click', () => { showFilters(false); fo.focus(); fo.scrollIntoView({block: 'nearest'}); });
  $('#offer-results').addEventListener('click', e => {
    const alt = e.target.closest('[data-alt]')?.dataset.alt; if (!alt) return;
    if (alt === 'all-depts') { state.filter.depts = []; setMultiValues(deptMulti(), []); }
    if (alt === 'all-specs') { state.filter.specs = []; setMultiValues(specMulti(), []); }
    if (alt === 'all-status') state.filter.status = 'all';
    if (alt === 'all-months') { state.filter.months = []; setMultiValues(monthMulti(), []); }
    updateResults(); $('#results-count').focus?.();
  });
  $$('[data-view]').forEach(b => b.addEventListener('click', () => { state.view = b.dataset.view; $$('[data-view]').forEach(x => x.setAttribute('aria-pressed', x === b)); $('.offers-layout').className = `offers-layout view-${state.view}`; }));
  /* La pastille suit le filtre actif ; elle se recale quand les polices ou la largeur changent. */
  const status = $('.filter-status'), ro = new ResizeObserver(moveThumb); ro.observe(status);
  requestAnimationFrame(() => requestAnimationFrame(() => status.classList.add('is-ready')));
  document.addEventListener('laska:before-render', () => ro.disconnect(), {once: true});
}

/* Créneaux d’une offre : le praticien coche ceux qui l’intéressent ; ils suivent dans sa candidature. */
const pickText = n => n ? `${slotCount(n)} choisi${n > 1 ? 's' : ''}, joint${n > 1 ? 's' : ''} à votre candidature.` : 'Choisissez vos créneaux : ils seront joints à votre candidature.';
function slotTile(o, s, {name = '', attrs = '', checked = false} = {}) {
  const d = asDate(s.date);
  return `<label class="slot-pick"><input type="checkbox" ${name ? `name="${name}"` : ''} value="${slotKey(s)}" ${attrs} ${checked ? 'checked' : ''}><span class="slot-day"><b>${d.getDate()}</b>${fmtDate(s.date, {month: 'short'})}</span><span class="slot-info"><strong>${longDate(s.date)}</strong>${s.type}</span><span class="slot-tick" aria-hidden="true">${icon('check')}</span></label>`;
}
function slotPicker(o) {
  if (!o.slots.length) return `<h2>Les dates</h2><p>Les dates de cette offre seront publiées à son ouverture (${o.period.toLowerCase()}). Demandez à être informé : votre conseiller vous les communique en premier.</p>`;
  const picked = state.picks[o.id] || [];
  return `<h2 id="slots-title">Les créneaux</h2><p>Cochez ceux qui vous intéressent. Vous pourrez les ajuster avec votre conseiller.</p>
    <fieldset class="slot-picks" data-offer="${o.id}" aria-labelledby="slots-title"><legend class="sr-only">Créneaux de cette offre</legend>${o.slots.map(s => slotTile(o, s, {attrs: 'data-slot-pick', checked: picked.includes(slotKey(s))})).join('')}</fieldset>`;
}
function bindPicks(root = document) {
  const box = $('.slot-picks[data-offer]', root); if (!box) return;
  box.addEventListener('change', () => { const v = $$('input[data-slot-pick]:checked', box).map(i => i.value); state.picks[box.dataset.offer] = v; saveDraft(); const out = $('#apply-picks', root); if (out) out.textContent = pickText(v.length); });
}
function offerDetail() {
  const o = offers.find(x => x.id === offerId); if (!o) return notFound();
  const apply = o.soon ? 'Être informé' : 'Je postule';
  const similar = offers.filter(x => x.id !== o.id && (x.sp === o.sp || x.num === o.num)).slice(0, 3);
  return `<section class="detail-hero"><span class="detail-num" aria-hidden="true">${o.num}</span><div class="container">${breadcrumb([['Offres d’emploi', '#/offres' + filterQuery()], [o.specialty]])}
    <div class="detail-head"><div class="card-top"><span class="status ${o.soon ? 'soon' : ''}">${o.soon ? 'À venir' : 'Disponible'}</span><div class="detail-actions">${favButton(o, 'fav-lg')}<button type="button" class="share-btn" data-share="${o.id}">${icon('share')}<span>Partager</span></button></div></div><h1>${o.specialty}<span class="dot">.</span></h1></div>
    <dl class="detail-facts">${[['pin','Lieu',`${o.city}<small>${o.dept} (${o.num})</small>`],['badge','Contrat',o.contract],['euro','Rémunération',units(o.pay)],['calendar','Dates',`${slotRange(o, true)}<small>${o.slots.length ? `${slotCount(o.slots.length)} · ${slotTypes(o)}` : 'Dates à venir'}</small>`]].map(([i,t,d]) => `<div>${icon(i)}<dt>${t}</dt><dd>${d}</dd></div>`).join('')}</dl></div></section>
  <div class="container detail-layout"><div class="detail-copy">
    ${slotPicker(o)}
    <h2>Les conditions</h2>
    <dl class="conditions">
      <div>${icon('badge')}<dt>Contrat</dt><dd>${o.contract}${explain(contractKey(o.contract))}</dd></div>
      <div>${icon('hospital')}<dt>Établissement</dt><dd>${o.structure}<small>Nom communiqué par votre conseiller, l’offre est confidentielle.</small></dd></div>
      <div>${icon('heart')}<dt>Avantages</dt><dd><span class="perks">${o.perks.map(p => `<span class="tag">${p}</span>`).join('')}</span></dd></div>
    </dl>
    ${sampleNote('Conditions d’exemple pour la maquette : à remplacer par celles de chaque établissement.')}
    <h2>Après votre candidature</h2>
    <ol class="mini-steps"><li><strong>Sous 48 h</strong>Un conseiller vous rappelle.</li><li><strong>Ensemble</strong>Point sur votre diplôme et votre situation d’exercice.</li><li><strong>Ensuite</strong>Présentation de la mission et de la suite.</li></ol>
    <details class="journey-details"><summary>Une question sur cette offre ? ${icon('plus')}</summary><div class="details-body"><p>Nous vous répondons en précisant l’offre concernée.</p><a class="text-link" href="#/contact?offre=${o.id}">Poser ma question${icon('arrow')}</a></div></details>
    <p class="detail-ref">${icon('file')}<span>Référence de l’offre : <strong>${o.ref}</strong></span>${o.soon ? '' : `<button type="button" class="reset-link" data-copy="${o.ref}">${icon('link')}Copier</button>`}</p>
  </div>
  <aside class="apply-card"><h2>${dot(o.soon ? 'Soyez informé en premier.' : 'Un premier contact suffit.')}</h2><p>Vos coordonnées et votre spécialité. Votre conseiller s’occupe de la suite.</p>${o.slots.length ? `<p class="apply-picks" id="apply-picks" aria-live="polite">${pickText((state.picks[o.id] || []).length)}</p>` : ''}${btn(apply, `#/postuler/${o.id}`, 'coral')}${promise([['check','Gratuit'],['clock','Réponse sous 48 h']])}<div class="apply-help"><span>Besoin d’aide ?</span><a class="text-link" href="${TEL}">${icon('phone')}${PHONE}</a><button type="button" class="text-link" data-callback>Être rappelé</button></div></aside></div>
  ${similar.length ? `<section class="section section-paper"><div class="container"><div class="section-head"><h2>${dot('Offres proches.')}</h2><a class="text-link" href="#/offres">Toutes les offres${icon('arrow')}</a></div><div class="offer-grid">${similar.map(offerCard).join('')}</div></div></section>` : ''}
  <div class="mobile-apply"><span>${o.specialty}<small>${o.city} · Gratuit</small></span>${btn(apply, `#/postuler/${o.id}`, 'coral')}</div>`;
}

/* ───────────── Formulaires ───────────── */
/* cond : obligatoire seulement quand son bloc est affiché (voir syncConditionals). */
function field(name, label, {type = 'text', required = true, cond = false, requiredWhen = '', help = '', placeholder = '', options = null, full = false, value = '', autocomplete = '', attrs = '', code = ''} = {}) {
  const req = required ? ' required' : cond ? ' data-cond-required' : requiredWhen ? ` data-required-when="${esc(requiredWhen)}"` : '';
  if (type === 'date') return dateField({id: name, label, value, required, reqAttr: required ? '' : req, help, full, attrs, mark: required || cond || !!requiredWhen});
  if (type === 'tel') return phoneField(name, label, {required, help, value, code, full});
  const input = options
    ? `<select id="${name}" name="${name}"${req} ${attrs}><option value="">Choisissez</option>${options.map(o => `<option value="${esc(o)}" ${String(value) === String(o) ? 'selected' : ''}>${esc(o)}</option>`).join('')}</select>`
    : type === 'textarea'
    ? `<textarea id="${name}" name="${name}"${req} maxlength="${name === 'message' ? 1000 : 500}" placeholder="${placeholder}" ${attrs}>${esc(value)}</textarea>`
    : `<input id="${name}" name="${name}" type="${type}"${req} value="${esc(value)}" placeholder="${placeholder}" ${autocomplete ? `autocomplete="${autocomplete}"` : ''} ${type === 'email' ? 'spellcheck="false" autocapitalize="off"' : ''} ${attrs}>`;
  return `<div class="field ${full ? 'full' : ''}"><label for="${name}">${label}${required || cond || requiredWhen ? ' <span class="req" aria-hidden="true">*</span>' : ''}</label>${input}${help ? `<small id="${name}-help">${help}</small>` : ''}</div>`;
}
/* ───────────── Champ date Laska Corporate ─────────────
   Le calendrier natif du navigateur ne se règle pas (couleurs, langue, taille des cases) et varie d’un appareil
   à l’autre. Ici : un bouton qui affiche la date en toutes lettres (« sam. 24 octobre 2026 »), et un calendrier
   en français, grandes cases, mois et année en accès direct, dates impossibles grisées, utilisable au clavier
   (flèches, Page précédente/suivante, Début/Fin, Échap), en feuille au bas de l’écran sur téléphone.
   La vraie valeur reste dans un champ date caché (nom, min, max, obligatoire) : formulaire et validation inchangés.
   En Next.js : un composant <DatePicker> (react-day-picker, par exemple) stylé avec ces règles. */
const MONTHS = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
const WEEKDAYS = [['lu','lundi'],['ma','mardi'],['me','mercredi'],['je','jeudi'],['ve','vendredi'],['sa','samedi'],['di','dimanche']];
const isoOf = (y, m, d) => `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
const dateLabel = iso => { const t = `${fmtDate(iso, {weekday: 'short'})} ${dayMonth(iso, true)} ${year(iso)}`; return t[0].toUpperCase() + t.slice(1); };
function dateField({id, name = id, label, value = '', required = false, reqAttr = '', help = '', full = false, attrs = '', mark = false}) {
  return `<div class="field date-field ${full ? 'full' : ''}"><label for="${id}">${label}${mark ? ' <span class="req" aria-hidden="true">*</span>' : ''}</label>
    <button type="button" class="date-btn ${value ? 'has-value' : ''}" id="${id}" popovertarget="${id}-cal" aria-haspopup="dialog" ${help ? `aria-describedby="${id}-help"` : ''}>${icon('calendar')}<span class="date-text">${value ? dateLabel(value) : 'Choisir une date'}</span>${icon('down', 'date-caret')}</button>
    <input type="date" class="sr-only" id="${id}-value" name="${name}" value="${value}" tabindex="-1" aria-hidden="true" data-picker="${id}" ${required ? 'required' : ''} ${reqAttr} ${attrs}>
    <div class="date-pop" id="${id}-cal" popover role="dialog" aria-label="${esc(label)} : choisir une date"></div>${help ? `<small id="${id}-help">${help}</small>` : ''}</div>`;
}
function calendarHTML(input, y, m, focusIso) {
  const now = new Date(), min = input.min, max = input.max, sel = input.value;
  const minY = min ? year(min) : now.getFullYear() - 50, maxY = max ? year(max) : now.getFullYear() + 3;
  const first = (new Date(y, m, 1).getDay() + 6) % 7, days = new Date(y, m + 1, 0).getDate();
  const out = iso => (min && iso < min) || (max && iso > max);
  const prevOff = min && isoOf(y, m, 1) <= min, nextOff = max && isoOf(y, m, days) >= max;
  const title = input.closest('.field').querySelector('label').textContent.replace('*', '').trim();
  let cells = '';
  for (let i = 0; i < first; i++) cells += '<span class="cal-blank"></span>';
  for (let d = 1; d <= days; d++) {
    const iso = isoOf(y, m, d), off = out(iso);
    cells += `<button type="button" class="cal-day ${iso === TODAY ? 'is-today' : ''} ${iso === sel ? 'is-selected' : ''}" data-day="${iso}" aria-label="${dateLabel(iso)}${iso === TODAY ? ', aujourd’hui' : ''}" aria-pressed="${iso === sel}" tabindex="${iso === focusIso ? 0 : -1}" ${off ? 'disabled' : ''}>${d}</button>`;
  }
  return `<div class="cal-top"><strong>${esc(title)}</strong><button type="button" class="cal-close" aria-label="Fermer le calendrier">${icon('close')}</button></div>
    <div class="cal-head"><button type="button" class="cal-nav" data-cal-step="-1" aria-label="Mois précédent" ${prevOff ? 'disabled' : ''}>${icon('back')}</button>
      <select data-cal-month aria-label="Mois">${MONTHS.map((n, i) => `<option value="${i}" ${i === m ? 'selected' : ''}>${n}</option>`).join('')}</select>
      <select data-cal-year aria-label="Année">${Array.from({length: maxY - minY + 1}, (_, i) => maxY - i).map(yy => `<option ${yy === y ? 'selected' : ''}>${yy}</option>`).join('')}</select>
      <button type="button" class="cal-nav" data-cal-step="1" aria-label="Mois suivant" ${nextOff ? 'disabled' : ''}>${icon('arrow')}</button></div>
    <div class="cal-grid">${WEEKDAYS.map(([s, l]) => `<abbr class="cal-wd" title="${l}">${s}</abbr>`).join('')}${cells}</div>
    <div class="cal-foot"><button type="button" class="reset-link" data-cal-clear ${sel ? '' : 'hidden'}>Effacer</button><button type="button" class="btn btn-outline" data-cal-today ${out(TODAY) ? 'disabled' : ''}>Aujourd’hui</button></div>`;
}
function bindDates(root = document) {
  $$('.date-field', root).forEach(field => {
    if (field.dataset.bound) return; field.dataset.bound = '1';
    const btn = $('.date-btn', field), input = $('input[type=date]', field), pop = $('.date-pop', field);
    let y, m;
    const clamp = iso => (input.min && iso < input.min) ? input.min : (input.max && iso > input.max) ? input.max : iso;
    const draw = focusIso => {
      pop.innerHTML = calendarHTML(input, y, m, focusIso);
      const target = pop.querySelector(`[data-day="${focusIso}"]:not(:disabled)`) || pop.querySelector('.cal-day:not(:disabled)');
      if (target) target.tabIndex = 0;
      return target;
    };
    const show = iso => { const d = asDate(iso); y = d.getFullYear(); m = d.getMonth(); return draw(iso); };
    const pick = iso => {
      input.value = iso || '';
      btn.classList.toggle('has-value', !!iso); $('.date-text', btn).textContent = iso ? dateLabel(iso) : 'Choisir une date';
      input.dispatchEvent(new Event('input', {bubbles: true})); input.dispatchEvent(new Event('change', {bubbles: true}));
      if (!input.getAttribute('aria-invalid')) btn.removeAttribute('aria-invalid');
      pop.hidePopover(); btn.focus();
    };
    /* La fenêtre suit son bouton ; sur téléphone, elle devient une feuille au bas de l’écran. */
    const place = () => {
      if (innerWidth < 620) { Object.assign(pop.style, {left: '0px', right: '0px', top: 'auto', bottom: '0px', width: '100%'}); pop.dataset.side = 'sheet'; return; }
      const r = btn.getBoundingClientRect(), w = 352, below = innerHeight - r.bottom - 12;
      Object.assign(pop.style, {right: 'auto', width: `${w}px`, left: `${Math.max(12, Math.min(r.left, innerWidth - w - 12))}px`});
      if (below < 430 && r.top > below) { pop.style.top = 'auto'; pop.style.bottom = `${innerHeight - r.top + 6}px`; pop.dataset.side = 'top'; }
      else { pop.style.bottom = 'auto'; pop.style.top = `${r.bottom + 6}px`; pop.dataset.side = 'bottom'; }
    };
    const follow = () => requestAnimationFrame(place);
    pop.addEventListener('beforetoggle', e => {
      if (e.newState === 'open') { show(clamp(input.value || TODAY)); place(); addEventListener('scroll', follow, {passive: true}); addEventListener('resize', follow); }
      else { removeEventListener('scroll', follow); removeEventListener('resize', follow); }
    });
    pop.addEventListener('toggle', e => { btn.setAttribute('aria-expanded', e.newState === 'open'); if (e.newState === 'open') (pop.querySelector('.cal-day[tabindex="0"]') || pop.querySelector('select'))?.focus(); });
    pop.addEventListener('click', e => {
      const t = e.target.closest('button'); if (!t || t.disabled) return;
      if (t.dataset.day) pick(t.dataset.day);
      else if (t.dataset.calStep) { m += Number(t.dataset.calStep); if (m < 0) { m = 11; y--; } if (m > 11) { m = 0; y++; } draw(clamp(isoOf(y, m, 1))); pop.querySelector(`[data-cal-step="${t.dataset.calStep}"]`)?.focus(); }
      else if (t.hasAttribute('data-cal-today')) pick(TODAY);
      else if (t.hasAttribute('data-cal-clear')) pick('');
      else if (t.classList.contains('cal-close')) { pop.hidePopover(); btn.focus(); }
    });
    pop.addEventListener('change', e => {
      if (e.target.matches('[data-cal-month]')) m = Number(e.target.value);
      if (e.target.matches('[data-cal-year]')) y = Number(e.target.value);
      draw(clamp(isoOf(y, m, 1))); pop.querySelector(e.target.matches('[data-cal-month]') ? '[data-cal-month]' : '[data-cal-year]')?.focus();
    });
    /* Clavier : flèches (jour, semaine), Page précédente / suivante (mois), Début / Fin (semaine). */
    pop.addEventListener('keydown', e => {
      const day = e.target.closest('.cal-day'); if (!day) return;
      const moves = {ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7};
      const d = asDate(day.dataset.day);
      if (moves[e.key] !== undefined) d.setDate(d.getDate() + moves[e.key]);
      else if (e.key === 'PageUp' || e.key === 'PageDown') d.setMonth(d.getMonth() + (e.key === 'PageUp' ? -1 : 1));
      else if (e.key === 'Home' || e.key === 'End') d.setDate(d.getDate() - ((d.getDay() + 6) % 7) + (e.key === 'End' ? 6 : 0));
      else return;
      e.preventDefault();
      const iso = clamp(isoOf(d.getFullYear(), d.getMonth(), d.getDate()));
      (show(iso) || day).focus();
    });
  });
}
/* Choix courts : boutons radio visibles plutôt qu’une liste déroulante. */
function pills(name, label, options, value = '', {required = true, full = true} = {}) {
  return `<fieldset class="field pills-field ${full ? 'full' : ''}" id="${name}-group"><legend>${label}${required ? ' <span class="req" aria-hidden="true">*</span>' : ''}</legend><div class="pills">${options.map((o, i) => `<label class="pill"><input type="radio" name="${name}" id="${name}-${i}" value="${esc(o)}" ${value === o ? 'checked' : ''} ${required ? 'required' : ''}><span>${esc(o)}</span></label>`).join('')}</div></fieldset>`;
}
/* Bloc affiché selon une réponse ; rule = « nom:valeur ». */
const when = (rule, on, content, cls = '') => `<div class="cond-block ${cls}" data-when="${esc(rule)}" ${on ? '' : 'hidden'}>${content}</div>`;
/* Dépôt de fichier (CV, justificatif) : on clique ou on glisse. Le fichier reste dans le navigateur (simulation). */
/* Pièces : PDF ou photo (sur téléphone, le choix propose l’appareil photo). Rien n’est obligatoire au premier contact. */
const DOC_FILES = {ext: 'pdf,jpg,jpeg,png,heic,heif,webp', accept: 'application/pdf,.pdf,image/*'};
const LATER = 'Pas de fichier sous la main ? Envoyez-le plus tard, par WhatsApp ou par email.';
function uploadField(id, label, v, {help, ext = 'pdf', accept = 'application/pdf,.pdf', required = false, cond = false, requiredWhen = '', multiple = false, empty = 'Choisir un fichier', missing = 'Ajoutez ce document.'} = {}) {
  const name = v[`${id}Name`], error = v[`${id}Error`];
  return `<div class="field full upload-field"><label for="${id}">${label}${required || cond || requiredWhen ? ' <span class="req" aria-hidden="true">*</span>' : ''}</label><label class="upload-area" for="${id}">${icon('file')}<span><strong id="${id}-name" data-empty="${esc(empty)}">${name ? esc(name) : error ? 'Fichier refusé' : esc(empty)}</strong><small id="${id}-help" data-help="${esc(help)}">${name ? 'Fichier prêt. Il ne sera pas envoyé (simulation).' : esc(help)}</small></span></label><input id="${id}" name="${id}" type="file" accept="${accept}" ${multiple ? 'multiple' : ''} class="sr-only" data-ext="${ext}" data-missing="${esc(missing)}" ${required ? 'required' : ''} ${cond ? 'data-cond-required' : ''} ${requiredWhen ? `data-required-when="${esc(requiredWhen)}"` : ''} ${error ? 'data-invalid-file="true"' : ''}><button class="reset-link" data-clear="${id}" type="button" ${name || error ? '' : 'hidden'}>Retirer le fichier</button></div>`;
}
/* Choix long (situation) : des cartes à bouton radio, avec un titre et une phrase d’explication.
   « needs » annonce ce qui sera demandé ensuite (date, copie), pour qu’il n’y ait pas de surprise. */
function choiceCards(name, legend, options, value = '', {msg = 'Choisissez une réponse.', intro = ''} = {}) {
  return `<fieldset class="field full choice-field" id="${name}-group"><legend>${legend} <span class="req" aria-hidden="true">*</span></legend>${intro}<div class="choice-cards">${options.map((o, i) => `<label class="choice-card" style="--c:${i}"><input type="radio" name="${name}" id="${name}-${i}" value="${esc(o.value)}" ${value === o.value ? 'checked' : ''} required data-group-msg="${esc(msg)}" aria-labelledby="${name}-${i}-title" aria-describedby="${name}-${i}-text"><span class="choice-mark" aria-hidden="true"></span><span class="choice-body"><strong id="${name}-${i}-title">${esc(o.value)}</strong><span id="${name}-${i}-text">${esc(o.text)}${o.needs ? `<em>${icon('file')}${o.needs}</em>` : ''}</span></span></label>`).join('')}</div></fieldset>`;
}
/* « C’est quoi ? » : une explication courte qui s’ouvre au toucher (jamais au survol), à côté du mot à comprendre.
   Définitions simples, à faire valider par Laska Corporate (voir README). */
const CONTRACT_DEFS = [
  ['interim', 'Intérim', 'L’intérim, c’est quoi ?', 'Vous êtes salarié de Laska Corporate, qui vous paie, et vous travaillez quelques jours ou quelques semaines dans un établissement.'],
  ['vacation', 'Vacation', 'La vacation, c’est quoi ?', 'L’établissement vous paie directement, à la demi-journée ou à la garde, pour un besoin ponctuel.'],
  ['cdd', 'CDD', 'Le CDD, c’est quoi ?', 'Un contrat avec l’établissement, avec une date de fin fixée à l’avance.'],
  ['cdi', 'CDI', 'Le CDI, c’est quoi ?', 'Un poste stable dans l’établissement, sans date de fin.']
];
const EXPLAIN = {
  evc: ['Les EVC, c’est quoi ?', 'Les épreuves de vérification des connaissances : l’examen national que passent les praticiens diplômés hors de l’Union européenne pour pouvoir exercer en France.'],
  autorisation: ['L’autorisation d’exercice, c’est quoi ?', 'La décision du ministère de la Santé qui vous permet d’exercer votre métier en France. Elle vient après les EVC et une période de travail encadrée dans un établissement.'],
  rpps: ['Le RPPS, c’est quoi ?', 'Le numéro qui identifie chaque professionnel de santé en France. L’Ordre de votre profession vous le donne à votre inscription.'],
  afgsu: ['L’AFGSU, c’est quoi ?', 'L’attestation de formation aux gestes et soins d’urgence : une formation courte, de deux ou trois jours, demandée par les établissements.'],
  contrats: ['Intérim, vacation, CDD, CDI : quelle différence ?', `<dl class="explain-list">${CONTRACT_DEFS.map(([, t, , d]) => `<div><dt>${t}</dt><dd>${d}</dd></div>`).join('')}</dl>`],
  ...Object.fromEntries(CONTRACT_DEFS.map(([k, , q, d]) => [k, [q, d]]))
};
const contractKey = c => CONTRACT_DEFS.find(([, t]) => t === c)?.[0];
let explainN = 0;
function explain(key, cls = '') {
  const e = EXPLAIN[key]; if (!e) return '';
  const id = `explain-${key}-${++explainN}`;
  return `<div class="explain ${cls}"><button type="button" class="explain-btn" aria-expanded="false" aria-controls="${id}" data-explain>${icon('help')}<span>${e[0]}</span></button><div class="explain-text" id="${id}" hidden>${e[1]}</div></div>`;
}
document.addEventListener('click', e => {
  const b = e.target.closest('[data-explain]'); if (!b) return;
  const box = document.getElementById(b.getAttribute('aria-controls')), open = b.getAttribute('aria-expanded') !== 'true';
  b.setAttribute('aria-expanded', open); if (box) box.hidden = !open;
});
const consentField = () => `<p class="privacy-note">${icon('shield')}<span>Vos informations servent uniquement à traiter cette demande. <a href="#/mentions-legales?section=confidentialite">Utilisation de mes données</a></span></p>`;
/* Situation du praticien : quatre cas. Les trois derniers demandent une date ; les deux derniers, une copie du justificatif. */
const SITUATIONS = [
  {value: 'Sans EVC', text: 'Épreuves de vérification des connaissances (EVC) non validées et absence d’autorisation d’exercice à ce jour.'},
  {value: 'EVC validées, sans autorisation d’exercice', text: 'Épreuves de vérification des connaissances (EVC) réussies, mais autorisation d’exercice non encore obtenue.', needs: 'Date de réussite à indiquer, preuve facultative'},
  {value: 'EVC validées avec autorisation d’exercice', text: 'Épreuves de vérification des connaissances (EVC) réussies et autorisation d’exercice obtenue.', needs: 'Date à indiquer ; copies si vous les avez'},
  {value: 'Diplôme français ou européen', text: 'Titulaire d’un diplôme de docteur en médecine délivré en France ou dans un État membre de l’Union européenne (UE).', needs: 'Date à indiquer ; copies si vous les avez'}
];
const [SIT_NONE, SIT_EVC, SIT_AUTH, SIT_EU] = SITUATIONS.map(s => s.value);
/* Pour chaque situation : la date demandée, la pièce obligatoire s’il y en a une, et une pièce facultative
   (preuve de réussite aux EVC, ou attestation RPPS quand l’exercice est possible). */
const SIT_PROOF = {
  [SIT_EVC]: {date: ['evcDate', 'EVC validées le', 'La date de publication de vos résultats.'], extra: ['evcDoc', 'Preuve de réussite aux EVC', 'Joindre la preuve', 'Par exemple la publication des résultats ou le courrier de réussite. PDF, JPG ou PNG, 10 Mo maximum.']},
  [SIT_AUTH]: {date: ['authDate', 'Autorisation obtenue le', 'La date indiquée sur votre autorisation d’exercice.'], doc: ['authDoc', 'Copie de l’autorisation d’exercice', 'Joindre l’autorisation', 'Joignez une copie de votre autorisation d’exercice.', 'PDF, JPG ou PNG, 10 Mo maximum. Vous pouvez aussi la glisser ici.'], extra: ['authRppsDoc', 'Attestation RPPS', 'Joindre l’attestation', 'Votre attestation d’inscription au RPPS, si vous l’avez déjà. PDF, JPG ou PNG, 10 Mo maximum.']},
  [SIT_EU]: {date: ['diplomaDate', 'Diplôme obtenu le', 'La date indiquée sur votre diplôme.'], doc: ['diplomaDoc', 'Copie du diplôme', 'Joindre le diplôme', 'Joignez une copie de votre diplôme.', 'PDF, JPG ou PNG, 10 Mo maximum. Vous pouvez aussi le glisser ici.'], extra: ['euRppsDoc', 'Attestation RPPS', 'Joindre l’attestation', 'Votre attestation d’inscription au RPPS, si vous l’avez déjà. PDF, JPG ou PNG, 10 Mo maximum.']}
};
const FROM_DATE = 'À partir d’une date';
const CONTRACT_WISHES = ['Intérim', 'CDI', 'CDD', 'Vacation'];

/* Candidature à une offre : les créneaux cochés sur la fiche sont repris ici et restent modifiables. */
function slotChoice(o) {
  const picked = state.picks[o.id] || [];
  return `<fieldset class="field full slot-choice" id="slotChoice-group"><legend>Vos créneaux pour cette offre <span class="req" aria-hidden="true">*</span></legend><small id="slotChoice-help">Cochez au moins un créneau.</small><div class="slot-picks is-compact">${o.slots.map(s => slotTile(o, s, {name: 'slotChoice', attrs: 'data-multi data-required-group', checked: picked.includes(slotKey(s))})).join('')}</div></fieldset>`;
}
/* Dossier praticien : cinq étapes, une par écran (v8), dans l’ordre du traitement. Les pièces et les souhaits
   sont facultatifs. Quand le praticien postule à une offre, ses disponibilités sont les créneaux cochés : on ne lui
   redemande pas « Dès maintenant / À partir d’une date ». Chaque étape : {title, html, optional, lead}. */
const REGIONS = ['Partout en France', 'Île-de-France', 'Auvergne-Rhône-Alpes', 'Provence-Alpes-Côte d’Azur', 'Occitanie', 'Nouvelle-Aquitaine', 'Grand Est', 'Hauts-de-France', 'Bretagne', 'Pays de la Loire', 'Normandie', 'Bourgogne-Franche-Comté', 'Centre-Val de Loire', 'Corse', 'Outre-mer'];
const LANGUAGES = ['Français', 'Anglais', 'Arabe', 'Espagnol', 'Portugais', 'Allemand', 'Italien', 'Autre langue'];
function candidateStages(s, o) {
  const v = s.values, f = (n, l, opt = {}) => field(n, l, {...opt, value: v[n] || ''});
  v.specialties ||= v.specialty ? [v.specialty] : [];
  if (!v.residence && v.abroad !== undefined) v.residence = v.abroad ? 'Hors de France' : 'En France';
  /* Brouillons d’une version précédente : ancienne situation effacée, ancien choix de contrat converti. */
  if (v.stage && !SITUATIONS.some(x => x.value === v.stage)) v.stage = '';
  if (!Array.isArray(v.contractWish)) v.contractWish = v.contractWish === 'Les deux' ? ['Intérim', 'CDI'] : v.contractWish ? [v.contractWish] : [];
  const withSlots = !!o?.slots.length;
  const proof = sit => {
    const {date, doc, extra} = SIT_PROOF[sit], files = DOC_FILES;
    return when(`stage:${sit}`, v.stage === sit, `<div class="auth-block is-required"><p class="auth-title">${icon(doc ? 'badge' : 'calendar')}<span><strong>${esc(sit)}</strong>${doc ? 'Indiquez la date. Les copies sont facultatives : joignez-les maintenant ou plus tard.' : 'Indiquez la date de réussite. La preuve est facultative.'}</span></p><div class="form-grid">${f(date[0], date[1], {type:'date', required:false, cond:true, full:true, attrs:`max="${TODAY}"`, help:date[2]})}${doc ? uploadField(doc[0], `${doc[1]} <span class="field-note">facultatif</span>`, v, {...files, help:`PDF ou photo, 10 Mo maximum. ${LATER}`, empty:doc[2]}) : ''}${uploadField(extra[0], `${extra[1]} <span class="field-note">facultatif</span>`, v, {...files, help:extra[3].replace('PDF, JPG ou PNG', 'PDF ou photo'), empty:extra[2]})}</div></div>`, 'cond-panel');
  };
  return [
    {title: 'Vous', html: `
      ${f('firstName','Prénom',{autocomplete:'given-name'})}${f('lastName','Nom',{autocomplete:'family-name'})}
      ${f('email','Email',{type:'email',autocomplete:'email',full:true,placeholder:'nom@exemple.com'})}
      ${f('phone','Téléphone',{type:'tel',full:true,code:v.phoneCode,help:'Votre conseiller vous appelle à ce numéro sous 48 h.'})}
      ${pills('residence','Où vivez-vous aujourd’hui ?',['En France','Hors de France'],v.residence)}`},
    {title: 'Votre métier', html: `
      ${chipPicker({name: 'specialties', legend: 'Vos spécialités', options: specialtyChoices(), selected: v.specialties, top: 9, required: true})}
      ${when('specialties:Autre spécialité', v.specialties.includes('Autre spécialité'), f('specialtyOther','Quelle autre spécialité ?',{required:false,cond:true,full:true}))}
      ${f('country','Pays du diplôme',{options:countries,full:true})}
      ${when('country:Autre pays', v.country === 'Autre pays', f('countryOther','Quel pays ?',{required:false,cond:true,full:true}))}`},
    {title: 'Votre situation', html: `
      ${choiceCards('stage', 'Votre situation aujourd’hui', SITUATIONS, v.stage, {msg: 'Choisissez votre situation.', intro: `<div class="explain-row">${explain('evc')}${explain('autorisation')}</div>`})}
      ${proof(SIT_EVC)}${proof(SIT_AUTH)}${proof(SIT_EU)}
      ${uploadField('cv','Votre CV <span class="field-note">facultatif</span>', v, {...DOC_FILES, multiple:true, help:`PDF ou photos (plusieurs possibles), 10 Mo maximum. ${LATER}`, empty:'Joindre mon CV ou le prendre en photo'})}`},
    {title: withSlots ? 'Vos créneaux' : 'Vos disponibilités', html: withSlots
      ? slotChoice(o) + `<p class="slots-sync">${icon('calendar')}<span>Vos disponibilités sont les créneaux cochés : ce sont ceux de la fiche de l’offre, et ce que vous changez ici y est aussi changé.</span></p>`
      : pills('availability','Quand pouvez-vous commencer ?',['Dès maintenant',FROM_DATE],v.availability) + when(`availability:${FROM_DATE}`, v.availability === FROM_DATE, f('availableFrom','Disponible à partir du',{type:'date',required:false,cond:true,full:true,attrs:`min="${TODAY}"`}), 'cond-panel')},
    {title: 'Pour aller plus loin', optional: true, lead: 'Ces réponses aident votre conseiller à vous proposer les bonnes offres. Vous pouvez aussi passer cette étape.', html: `
      ${chipPicker({name: 'regions', legend: 'Où souhaitez-vous exercer ?', options: REGIONS.map(r => ({value: r, label: r})), selected: v.regions || [], top: 7, more: 'régions'})}
      ${chipPicker({name: 'contractWish', legend: 'Quel contrat recherchez-vous ?', options: CONTRACT_WISHES.map(c => ({value: c, label: c})), selected: v.contractWish})}
      ${explain('contrats', 'full')}
      ${chipPicker({name: 'languages', legend: 'Langues parlées', options: LANGUAGES.map(r => ({value: r, label: r})), selected: v.languages || []})}`}
  ];
}

/* Créneaux en série : une période (du… au…) et les jours concernés, au lieu d’ajouter chaque date une par une. */
const WEEKDAY_NAMES = ['lundi','mardi','mercredi','jeudi','vendredi','samedi','dimanche'];
function rangeCount(r) {
  if (!r.from || !r.to || r.to < r.from || !r.days?.length) return 0;
  let n = 0; const d = asDate(r.from), end = asDate(r.to);
  for (let i = 0; d <= end && i < 400; i++, d.setDate(d.getDate() + 1)) if (r.days.includes((d.getDay() + 6) % 7 + 1)) n++;
  return n;
}
function daysLabel(days = []) {
  const sorted = [...days].sort((a, b) => a - b), key = sorted.join('');
  if (key === '1234567') return 'tous les jours';
  if (key === '12345') return 'du lundi au vendredi';
  if (key === '67') return 'le week-end';
  const names = sorted.map(d => `${WEEKDAY_NAMES[d - 1]}s`);
  return names.length === 1 ? `les ${names[0]}` : `les ${names.slice(0, -1).join(', ')} et ${names.at(-1)}`;
}
const rowCount = r => r.kind === 'range' ? rangeCount(r) : 1;
function rangeText(r) {
  if (!r.from || !r.to) return 'Choisissez le début et la fin de la période.';
  if (r.to < r.from) return 'La fin doit être après le début.';
  if (!r.days?.length) return 'Choisissez au moins un jour.';
  return `Soit ${slotCount(rangeCount(r))} : ${daysLabel(r.days)}.`;
}
function slotLine(r) {
  if (r.kind === 'range') { if (!r.from || !r.to) return 'Période à compléter'; const d1 = asDate(r.from).getDate(), start = sameMonth(r.from, r.to) ? (d1 === 1 ? '1er' : d1) : dayMonth(r.from, true); return `Du ${start} au ${dayMonth(r.to, true)} ${year(r.to)}, ${daysLabel(r.days)} · ${esc(r.type)} (${slotCount(rangeCount(r))})`; }
  return r.date ? `${dateLabel(r.date)} · ${esc(r.type)}` : 'Date à choisir';
}
const SLOT_TYPES = ['Garde 24 h','Journée 10 h','Journée 12 h','Nuit 12 h'];
function slotRow(r, si, ri, name, count) {
  const type = `<div class="field slot-type"><label for="slot-${si}-${ri}-type">Créneau</label><select id="slot-${si}-${ri}-type" name="slot-${si}-${ri}-type" data-slot="${si}:${ri}:type">${SLOT_TYPES.map(t => `<option ${t === r.type ? 'selected' : ''}>${t}</option>`).join('')}</select></div>`;
  const remove = count > 1 ? `<button type="button" class="slot-remove" data-slot-remove="${si}:${ri}" aria-label="Retirer ${r.kind === 'range' ? 'la période' : 'la date'} ${ri + 1} (${esc(name)})">${icon('close')}</button>` : '';
  if (r.kind !== 'range') return `<li class="slot-row ${r.fresh ? 'is-new' : ''}">${dateField({id: `slot-${si}-${ri}-date`, label: 'Date', value: r.date, required: true, attrs: `data-slot="${si}:${ri}:date" data-error-label="${esc(name)} : choisissez la date${count > 1 ? ` n° ${ri + 1}, ou retirez cette ligne` : ', ou cochez « Dates à définir »'}" min="${TODAY}"`})}${type}${remove}</li>`;
  return `<li class="slot-row is-range ${r.fresh ? 'is-new' : ''}">
    ${dateField({id: `slot-${si}-${ri}-from`, label: 'Du', value: r.from, required: true, attrs: `data-slot="${si}:${ri}:from" data-error-label="${esc(name)} : début de la période" min="${TODAY}"`})}
    ${dateField({id: `slot-${si}-${ri}-to`, label: 'Au', value: r.to, required: true, attrs: `data-slot="${si}:${ri}:to" data-after="slot-${si}-${ri}-from-value" data-error-label="${esc(name)} : fin de la période" min="${r.from || TODAY}"`})}
    ${type}${remove}
    <fieldset class="field range-days"><legend>Quels jours ?</legend><div class="day-picks">${WEEKDAYS.map(([s, l], k) => `<label class="day-pick"><input type="checkbox" name="slot-${si}-${ri}-days" value="${k + 1}" data-slot="${si}:${ri}:days" data-multi data-required-group data-group-msg="Choisissez au moins un jour." data-error-label="${esc(name)} : jours de la période" ${r.days?.includes(k + 1) ? 'checked' : ''}><span><span class="sr-only">${l}</span><span aria-hidden="true">${s}</span></span></label>`).join('')}</div><p class="range-count" aria-live="polite">${rangeText(r)}</p></fieldset>
  </li>`;
}
/* Étape 2 de la demande : des créneaux (intérim, vacation) ou une date de prise de poste (CDI, CDD), par spécialité. */
const specLabel = (v, spec) => spec === 'Autre spécialité' ? (v.specialtyOther?.trim() || 'Autre spécialité') : spec;
const datesTitle = v => v.contract && !isShortContract(v.contract) ? 'Prise de poste' : 'Vos dates';
function slotsArea(v) {
  const specs = v.specialties || [];
  if (!specs.length || !v.contract) return `<p class="slots-empty">${icon('calendar')}<span><strong>Pour quand ?</strong>${!specs.length && !v.contract ? 'Choisissez d’abord une spécialité et le type de contrat : vous indiquerez ensuite vos dates.' : !specs.length ? 'Choisissez d’abord une spécialité : vous indiquerez ensuite vos dates pour chacune.' : 'Choisissez d’abord le type de contrat : des créneaux pour l’intérim et la vacation, une date de prise de poste pour le CDI et le CDD.'}</span></p>`;
  return isShortContract(v.contract) ? slotsList(v, specs) : startArea(v, specs);
}
/* CDI, CDD : une seule date, « À partir du », pour chaque spécialité (ou « à définir »). */
function startArea(v, specs) {
  v.startFrom ||= {}; v.startFlex ||= {};
  return `<p class="slots-intro"><strong>À partir de quand ?</strong>La date à laquelle le professionnel peut prendre son poste (${esc(v.contract)}).</p>` + specs.map((spec, si) => {
    const name = specLabel(v, spec), flex = !!v.startFlex[spec];
    return `<fieldset class="slot-group start-group" data-si="${si}"><legend><span class="slot-spec">${esc(name)}</span><span class="slot-count">${flex ? 'Date à définir' : v.startFrom[spec] ? 'Date choisie' : 'Date à choisir'}</span></legend>
      ${flex ? '' : dateField({id: `start-${si}`, label: 'À partir du', value: v.startFrom[spec] || '', required: true, full: true, attrs: `data-start="${si}" data-error-label="${esc(name)} : date de prise de poste" min="${TODAY}"`})}
      <div class="slot-actions"><label class="choice-inline"><input type="checkbox" data-start-flex="${si}" ${flex ? 'checked' : ''}>Date à définir avec Laska Corporate</label></div>
    </fieldset>`;
  }).join('');
}
/* Intérim, vacation : des dates précises ou des périodes. */
function slotsList(v, specs) {
  v.slots ||= {}; v.slotFlex ||= {};
  return `<p class="slots-intro"><strong>Pour quand ?</strong>Des dates précises, ou une période : par exemple tous les samedis de novembre.</p>` + specs.map((spec, si) => {
    const rows = (v.slots[spec] ||= [{kind: 'date', date: '', type: SLOT_TYPES[0]}]), flex = !!v.slotFlex[spec];
    rows.forEach(r => { if (!SLOT_TYPES.includes(r.type)) r.type = SLOT_TYPES[0]; });
    const name = specLabel(v, spec), total = rows.reduce((n, r) => n + rowCount(r), 0);
    return `<fieldset class="slot-group" data-si="${si}"><legend><span class="slot-spec">${esc(name)}</span><span class="slot-count">${flex ? 'Dates à définir' : slotCount(total)}</span></legend>
      ${flex ? '' : `<ol class="slot-list">${rows.map((r, ri) => slotRow(r, si, ri, name, rows.length)).join('')}</ol>`}
      <div class="slot-actions">${flex ? '' : `<span class="slot-adds"><button type="button" class="reset-link slot-add" data-slot-add="${si}" data-kind="date">${icon('plus')}Ajouter une date</button><button type="button" class="reset-link slot-add" data-slot-add="${si}" data-kind="range">${icon('calendar')}Ajouter une période</button></span>`}<label class="choice-inline"><input type="checkbox" data-slot-flex="${si}" ${flex ? 'checked' : ''}>Dates à définir avec Laska Corporate</label></div>
    </fieldset>`;
  }).join('');
}
/* Demande de renfort : trois étapes, une par écran (v8). Le téléphone est conseillé : c’est le plus rapide pour
   un rappel sous 24 h ouvrées. */
function employerStages(s) {
  const v = s.values, f = (n, l, o = {}) => field(n, l, {...o, value: v[n] || ''});
  v.specialties ||= [];
  if (v.contract && !contracts.includes(v.contract)) v.contract = '';
  return [
    {title: 'Votre besoin', html: `
      ${chipPicker({name: 'specialties', legend: 'Spécialités recherchées', options: specialtyChoices(), selected: v.specialties, top: 9, required: true})}
      ${when('specialties:Autre spécialité', v.specialties.includes('Autre spécialité'), f('specialtyOther','Quelle autre spécialité ?',{required:false,cond:true,full:true}))}
      ${pills('contract','Type de contrat',contracts,v.contract)}
      ${explain('contrats', 'full')}`},
    {title: datesTitle(v), html: `<div class="slots-area" id="slots-area">${slotsArea(v)}</div>`},
    {title: 'Vos coordonnées', html: `
      ${f('organization','Établissement',{autocomplete:'organization',full:true,placeholder:'Ex. Centre hospitalier de…'})}${f('contactName','Votre nom',{autocomplete:'name'})}${f('email','Email professionnel',{type:'email',autocomplete:'email'})}
      ${f('phone','Téléphone <span class="field-note">conseillé</span>',{type:'tel',required:false,full:true,code:v.phoneCode,help:'Le plus rapide : un conseiller vous rappelle sous 24 h ouvrées.'})}
      <details class="optional-details full" ${v.extraMessage || v.structure ? 'open' : ''}><summary>${icon('plus')}<span>Ajouter des précisions</span><em>Facultatif</em></summary><div class="details-body form-grid">${f('structure','Type de structure',{required:false,options:['Hôpital public','Clinique privée','EHPAD','Centre de santé','Cabinet médical','Autre'],full:true})}${f('extraMessage','Votre précision',{type:'textarea',required:false,full:true,placeholder:'Rythme, contexte ou précisions sur les créneaux…',help:'500 caractères maximum.'})}</div></details>`}
  ];
}
function progressRing() {
  return `<div class="progress" aria-live="polite"><svg viewBox="0 0 44 44" aria-hidden="true"><circle cx="22" cy="22" r="19"/><circle class="progress-bar" cx="22" cy="22" r="19" pathLength="100"/></svg><span class="progress-text" id="progress-text"></span></div>`;
}
/* Récapitulatif avant envoi : chaque partie relue d’un coup d’œil, avec « Modifier » qui ramène au bon endroit.
   Il sert aussi, en lecture seule, dans la confirmation (« Revoir ce que vous avez envoyé », imprimable). */
/* Adresse probablement mal tapée (suggestion ignorée dans le formulaire) : on le redit au récapitulatif. */
const mailCheck = mail => { const better = emailSuggestion(mail || ''); return esc(mail || '') + (better ? `<span class="review-warn">Vérifiez : vouliez-vous dire ${esc(better)} ?</span>` : ''); };
function review(kind, o, {readonly = false} = {}) {
  const v = state[kind].values;
  const rows = list => list.filter(([, val]) => val).map(([k, val]) => `<div><dt>${k}</dt><dd>${val}</dd></div>`).join('');
  /* « Modifier » ramène à l’étape du formulaire (data-edit) et au champ concerné (data-edit-focus). */
  const block = (title, [step, focus], list) => { const body = rows(list); return `<section class="review-block"><div class="review-head"><h3>${title}</h3>${readonly ? '' : `<button type="button" class="review-edit" data-edit="${step}" data-edit-focus="${focus}">${icon('file')}Modifier<span class="sr-only"> : ${title}</span></button>`}</div>${body ? `<dl>${body}</dl>` : '<p class="review-empty">Rien de précisé.</p>'}</section>`; };
  const specName = x => x === 'Autre spécialité' ? (v.specialtyOther?.trim() || x) : x;
  const specs = (v.specialties || []).map(specName).map(esc).join(', ');
  let blocks;
  if (kind === 'employer') {
    const short = isShortContract(v.contract);
    const dates = (v.specialties || []).map(sp => [esc(specName(sp)), short
      ? (v.slotFlex?.[sp] ? 'Dates à définir avec Laska Corporate' : `<ul class="review-list">${(v.slots?.[sp] || []).map(r => `<li>${slotLine(r)}</li>`).join('')}</ul>`)
      : (v.startFlex?.[sp] ? 'Date à définir avec Laska Corporate' : v.startFrom?.[sp] ? `À partir du ${dateLabel(v.startFrom[sp]).toLowerCase()}` : '')]);
    blocks = block('Votre besoin', [1, 'specialties-group'], [['Spécialités', specs], ['Contrat', esc(v.contract || '')]])
      + block(datesTitle(v), [2, 'slots-area'], dates)
      + block('Vos coordonnées', [3, 'organization'], [['Établissement', esc(v.organization || '')], ['Votre nom', esc(v.contactName || '')], ['Email', mailCheck(v.email)], ['Téléphone', esc(phoneText(v.phone, v.phoneCode))], ['Type de structure', esc(v.structure || '')], ['Précision', esc(v.extraMessage || '')]]);
  } else {
    const picks = o ? (state.picks[o.id] || []).slice().sort().map(k => { const [date, type] = k.split('|'); return `<li>${dateLabel(date)} · ${esc(type)}</li>`; }).join('') : '';
    const offerLine = o ? `${esc(o.specialty)}, ${esc(o.place)} · réf. ${o.ref}` : '';
    const proof = SIT_PROOF[v.stage] || {}, sitDate = proof.date && v[proof.date[0]], sitDoc = proof.doc && v[`${proof.doc[0]}Name`], sitExtra = proof.extra && v[`${proof.extra[0]}Name`];
    blocks = block('Vous', [1, 'firstName'], [['Nom', esc(`${v.firstName || ''} ${v.lastName || ''}`.trim())], ['Email', mailCheck(v.email)], ['Téléphone', esc(phoneText(v.phone, v.phoneCode))], ['Lieu de vie', esc(v.residence || '')]])
      + block('Votre métier', [2, 'specialties-group'], [['Spécialités', specs], ['Pays du diplôme', esc(v.country === 'Autre pays' ? (v.countryOther || '') : (v.country || ''))]])
      + block('Votre situation', [3, 'stage-group'], [['Situation', esc(v.stage || '')], [proof.date?.[1] || '', sitDate ? dateLabel(sitDate) : ''], [proof.doc?.[1] || '', sitDoc ? esc(sitDoc) : proof.doc ? 'À envoyer plus tard' : ''], [proof.extra?.[1] || '', sitExtra ? esc(sitExtra) : ''], ['CV', v.cvName ? esc(v.cvName) : 'À envoyer plus tard']])
      + (o?.slots.length
        ? block('Vos créneaux', [4, 'slotChoice-group'], [['Offre', offerLine], ['Créneaux', picks ? `<ul class="review-list">${picks}</ul>` : '']])
        : block('Vos disponibilités', [4, 'availability-group'], [['Début', v.availability === FROM_DATE && v.availableFrom ? `À partir du ${dateLabel(v.availableFrom).toLowerCase()}` : esc(v.availability || '')], ['Offre', offerLine]]))
      + block('Pour aller plus loin', [5, 'regions-group'], [['Où', esc((v.regions || []).join(', '))], ['Contrats', esc([].concat(v.contractWish || []).join(', '))], ['Langues', esc((v.languages || []).join(', '))]]);
  }
  if (readonly) return `<div class="review is-readonly">${blocks}</div>`;
  /* Lexique : Créer mon dossier → Envoyer mon dossier ; Je postule → Envoyer ma candidature ; Décrire mon besoin ou Être informé → Envoyer ma demande. */
  const send = kind === 'employer' || o?.soon ? 'Envoyer ma demande' : o ? 'Envoyer ma candidature' : 'Envoyer mon dossier';
  return `<div class="review" data-review="${kind}"><h2 tabindex="-1">${dot('Vérifiez avant d’envoyer.')}</h2><p class="review-lead">Tout est juste ? Envoyez. Sinon, touchez « Modifier » à côté de la partie à corriger.</p>${blocks}
    <div class="review-actions"><button type="button" class="btn btn-coral btn-full" data-send="${kind}">${send}${icon('arrow')}</button><button type="button" class="reset-link" data-edit="last">${icon('back')}Revenir au formulaire</button></div></div>`;
}
/* Confirmation : c’est envoyé, ce qui se passe ensuite, et rien d’autre à faire. */
function success(kind) {
  const s = state[kind], v = s.values, o = kind === 'contact' ? null : offers.find(x => x.id === offerId), call = phoneText(v.phone, v.phoneCode);
  const heading = kind === 'contact' ? 'Votre message est envoyé.' : kind === 'employer' || o?.soon ? 'Votre demande est envoyée.' : o ? 'Votre candidature est envoyée.' : 'Votre dossier est envoyé.';
  const lead = kind === 'contact' ? 'Notre équipe vous répond par email sous 24 h ouvrées.' : kind === 'employer' ? (call ? `Un conseiller vous rappelle sous 24 h ouvrées au ${esc(call)}.` : `Un conseiller vous répond par email sous 24 h ouvrées, à ${esc(v.email || 'votre adresse')}.`) : `${o?.soon ? 'Nous vous prévenons dès que cette offre ouvre. ' : ''}Votre conseiller vous appelle sous 48 h${call ? ` au ${esc(call)}` : ''}.`;
  const next = kind === 'employer' ? [['Sous 24 h ouvrées', `Un conseiller vous ${call ? 'rappelle' : 'écrit'} pour préciser le besoin et les dates.`],['Ensuite','Vous recevez des profils vérifiés.'],['Enfin','Nous organisons la rencontre.']] : kind === 'contact' ? [] : [['Sous 48 h','Votre conseiller vous appelle.'],['Ensemble','Vous complétez votre dossier : pièces et démarches.'],['Ensuite','Vous recevez des offres qui vous correspondent.']];
  const what = kind === 'employer' || o?.soon ? 'demande' : kind === 'contact' ? 'message' : o ? 'candidature' : 'dossier';
  const docsLater = kind === 'candidate' && !v.cvName ? `<p class="success-later">${icon('file')}<span>Votre CV n’est pas encore joint : envoyez-le quand vous voulez, <a class="text-link" href="${waLink()}" target="_blank" rel="noopener">par WhatsApp</a> ou <a class="text-link" href="mailto:${MAIL}">par email</a>. Votre conseiller le rattache à votre ${what}.</span></p>` : '';
  return `<div class="success-state"><div class="success-symbol"><svg viewBox="0 0 52 52" aria-hidden="true"><circle cx="26" cy="26" r="24"/><path d="m15 27 7 7 15-16"/></svg></div><h2 tabindex="-1">${dot(heading)}</h2>
    <p class="success-lead"><strong>${lead}</strong> Vous n’avez rien d’autre à faire.</p>${docsLater}
    ${s.ref ? `<div class="success-ref">${icon('file')}<p>Votre référence : <strong>${s.ref}</strong><small>Notez-la : elle figure aussi dans l’email de confirmation.</small></p><button type="button" class="reset-link" data-copy="${s.ref}">${icon('link')}Copier</button></div>` : ''}
    ${next.length ? `<ol class="mini-steps">${next.map(([a,b], k) => `<li style="--k:${k}"><strong>${a}</strong>${b}</li>`).join('')}</ol>` : ''}
    ${kind !== 'contact' ? `<details class="sent-recap"><summary>Revoir ce que vous avez envoyé ${icon('plus')}</summary><div class="details-body">${review(kind, o, {readonly: true})}</div></details>` : ''}
    ${sampleNote(`Maquette : rien n’est réellement envoyé. En service réel, un email de confirmation part à ${v.email ? esc(v.email) : 'votre adresse'}.`)}
    <div class="actions">${kind !== 'contact' ? `<button type="button" class="btn btn-outline" data-print>${icon('print')}Imprimer ou enregistrer en PDF</button>` : ''}${btn('Retour à l’accueil','#/','primary','')}${MAQUETTE ? `<button class="reset-link" type="button" data-restart="${kind}">Recommencer la simulation</button>` : ''}</div></div>`;
}
/* Après un changement d’écran dans la carte du formulaire : remonter en haut de la carte, focus sur le titre. */
function focusCard(sel) {
  /* On ne fait défiler que si le haut de la carte est caché ou trop bas (téléphone : l’en-tête de la page est au-dessus). */
  const card = $('.form-card'), top = card?.getBoundingClientRect().top;
  if (card && (top < 80 || top > innerHeight * .35)) window.scrollTo({top: Math.max(0, top + scrollY - 88), behavior: 'instant'});
  $(sel)?.focus({preventScroll: true});
}
/* « Modifier » : retour au formulaire, à la bonne partie. */
function goToField(id) {
  const t = id ? document.getElementById(id) : $('#application-form'); if (!t) return;
  t.closest('details')?.setAttribute('open', '');
  window.scrollTo({top: Math.max(0, t.getBoundingClientRect().top + scrollY - 140), behavior: 'instant'});
  (t.matches('input, select, textarea, button') ? t : t.querySelector('input:not([type=hidden]):not(.sr-only), button, select, textarea'))?.focus({preventScroll: true});
}
/* ───────────── Formulaires en étapes (v8) ─────────────
   Une étape par écran : « Étape 2 sur 5 », une barre d’avancement, Continuer et Retour. L’étape est dans l’adresse
   (?etape=2, puis ?etape=recap) : le bouton Retour du téléphone fonctionne. Toutes les étapes sont dans la page mais
   seule l’étape en cours est visible ; validate() ignore les champs masqués, il ne vérifie donc que cette étape.
   Avant le récapitulatif, toutes les étapes sont revérifiées : la première incomplète s’affiche, avec ses erreurs. */
const formStages = kind => kind === 'employer' ? employerStages(state.employer) : candidateStages(state.candidate, offers.find(x => x.id === offerId));
const stepHash = (kind, step) => `#${kind === 'employer' ? '/besoin' : `/postuler${offerId ? '/' + offerId : ''}`}${step === 1 ? '' : `?etape=${step}`}`;
let stepAfter = null; /* après un changement d’étape : champ à atteindre (focus) ou erreurs à montrer (errors) */
function goStep(kind, step, {replace = false, focus = '', errors = false} = {}) {
  stepAfter = {focus, errors};
  const hash = stepHash(kind, step), from = Number($('#application-form')?.dataset.step) || 0;
  if (replace || hash === location.hash) history.replaceState(history.state, '', hash);
  else history.pushState({wizard: kind, prev: from}, '', hash);
  navigate();
}
/* Étape demandée par l’adresse. Le récapitulatif n’est montré que si toutes les étapes ont été vérifiées. */
function currentStep(kind, total) {
  const e = new URLSearchParams(query).get('etape');
  if (e === 'recap') return state[kind].values.wizardReady ? 'recap' : total;
  return Math.min(Math.max(1, parseInt(e, 10) || 1), total);
}
/* Saisie retrouvée après un rechargement : dit sur place (plus de message éphémère), avec « Tout effacer ». */
const draftNote = kind => restored[kind] ? `<div class="draft-note" role="status">${icon('clock')}<p>Nous avons gardé ce que vous aviez commencé à remplir.</p><button type="button" class="reset-link" data-draft-clear="${kind}">Tout effacer</button><button type="button" class="draft-close" data-draft-keep="${kind}" aria-label="Fermer ce message">${icon('close')}</button></div>` : '';
function wizard(kind, stages, n, o) {
  const s = state[kind], st = stages[n - 1], total = stages.length, seen = !!s.values.wizardSeen;
  const next = seen ? 'Revenir au récapitulatif' : n === total ? 'Vérifier avant d’envoyer' : 'Continuer';
  return `${draftNote(kind)}
    ${o && n === 1 ? `<div class="application-offer"><span class="row-num" aria-hidden="true">${o.num}</span><p><strong>${o.specialty}</strong>${o.place} · ${slotRange(o)}</p><a class="text-link" href="#/offre/${o.id}">Voir l’offre</a></div>` : ''}
    <div class="wizard-head"><p class="wizard-count">Étape ${n} sur ${total}${st.optional ? ' · facultative' : ''}</p><h2 id="form-title" tabindex="-1">${st.title}</h2>
      <div class="wizard-bar" role="progressbar" aria-label="Avancement" aria-valuemin="1" aria-valuemax="${total}" aria-valuenow="${n}" aria-valuetext="Étape ${n} sur ${total}"><span style="--p:${Math.round(n / total * 100)}%"></span></div>
      ${st.lead ? `<p class="wizard-lead">${st.lead}</p>` : `<p class="muted small"><span class="req">*</span> obligatoire</p>`}</div>
    <form id="application-form" novalidate data-kind="${kind}" data-step="${n}" data-steps="${total}" aria-labelledby="form-title"><div id="form-errors"></div>
      ${stages.map((x, i) => `<section class="form-stage" data-stage="${i + 1}" ${i + 1 === n ? '' : 'hidden'}><div class="form-grid">${x.html}</div></section>`).join('')}
      ${n === 1 ? consentField() : ''}
      <div class="form-actions wizard-actions">${n > 1 ? `<button type="button" class="btn btn-outline wizard-back" data-step-back>${icon('back')}Retour</button>` : ''}${st.optional && !seen ? '<button type="button" class="reset-link wizard-skip" data-step-skip>Passer cette étape</button>' : ''}<button type="submit" class="btn btn-primary wizard-next">${next}${icon('arrow')}</button></div>
    </form>`;
}
/* Une étape est-elle complète ? On la rend visible le temps de la vérifier, sans rien afficher. */
function stageIssues(form, k) {
  const stages = $$('.form-stage', form), was = stages.map(x => x.hidden);
  stages.forEach((x, i) => x.hidden = i !== k - 1);
  const n = findIssues(form).length;
  stages.forEach((x, i) => x.hidden = was[i]);
  return n;
}
function application(employer = false) {
  const kind = employer ? 'employer' : 'candidate', s = state[kind], o = offers.find(x => x.id === offerId);
  s.values.offerId = o?.id || '';
  const stages = formStages(kind), step = currentStep(kind, stages.length);
  const crumbs = employer ? [['Établissements','#/etablissements'],['Décrire mon besoin']] : o ? [['Offres d’emploi','#/offres' + filterQuery()],[o.specialty, `#/offre/${o.id}`],[o.soon ? 'Être informé' : 'Je postule']] : [['Praticiens','#/praticiens'],['Créer mon dossier']];
  const title = employer ? 'Trouvons votre renfort.' : o ? 'Cette offre vous intéresse ?' : 'Démarrons votre dossier.';
  /* Mauvais formulaire ? Le renvoi vers l’autre reste dans la colonne de gauche, hors de la carte à remplir. */
  const otherWay = `<div class="form-help form-other"><span>${employer ? 'Vous êtes praticien ?' : 'Vous recrutez ?'}</span><a class="text-link" href="${employer ? '#/postuler' : '#/besoin'}">${icon('swap')}${employer ? 'Créer mon dossier' : 'Décrire mon besoin'}</a></div>`;
  /* Aides : à gauche sur ordinateur, sous la carte sur téléphone (form-after). */
  const helps = `<div class="form-help"><span>Vous préférez appeler ?</span><a class="text-link" href="${TEL}">${icon('phone')}${PHONE}</a></div>${employer ? `<div class="form-help"><span>Ou écrire :</span><a class="text-link" href="mailto:${MAIL_ETAB}">${icon('mail')}${MAIL_ETAB}</a></div>` : ''}${o ? '' : otherWay}`;
  const lead = employer ? 'Trois étapes courtes, puis vous relisez tout avant d’envoyer. Un conseiller vous rappelle sous 24 h ouvrées.' : `${stages.length === 5 ? 'Cinq' : stages.length} étapes courtes, puis vous relisez tout avant d’envoyer. Votre conseiller complète le dossier avec vous.`;
  return `<div class="container">${breadcrumb(crumbs)}</div><section class="form-page"><div class="container form-layout">
    <aside class="form-intro"><h1>${dot(title)}</h1><p class="lead">${lead}</p>
      <figure class="form-photo"><img src="assets/${employer ? 'equipe.jpg' : 'consultation.jpg'}" alt="" width="1100" height="733" loading="lazy"><figcaption>${icon(employer ? 'shield' : 'clock')}<span><strong>${employer ? 'Des profils vérifiés' : 'Un retour sous 48 h'}</strong>${employer ? 'Intérim, vacation, CDI, CDD' : 'Gratuit et sans engagement'}</span></figcaption></figure>
      ${helps}</aside>
    <div class="form-card">${s.success ? success(kind) : step === 'recap' ? review(kind, o) : wizard(kind, stages, step, o)}</div>
    <div class="form-after">${helps}</div>
  </div></section>`;
}
/* Deux adresses : les établissements écrivent au service des affaires médicales. */
const mailChannel = (who, on) => `<a class="channel ${on ? 'is-match' : ''}" href="mailto:${who === 'etab' ? MAIL_ETAB : MAIL}" data-mail="${who}">${icon('mail')}<span><small>${who === 'etab' ? 'Établissements' : 'Praticiens et autres demandes'}</small><strong>${who === 'etab' ? MAIL_ETAB : MAIL}</strong></span></a>`;
function contact() {
  const v = state.contact.values, f = (n, l, o = {}) => field(n, l, {...o, value: v[n] || ''});
  const o = offers.find(x => x.id === new URLSearchParams(query).get('offre'));
  if ((v.offerId || '') !== (o?.id || '')) state.contact.success = false;
  v.offerId = o?.id || '';
  if (!v.topicTouched) v.topic = o ? 'Je suis praticien' : '';
  const etab = v.topic === 'Je recrute';
  return `<section class="page-heading"><div class="container">${breadcrumb([['Contact']])}<h1>${dot('On se parle ?')}</h1><p class="lead">Notre équipe vous répond sous 24 h ouvrées.</p></div></section>
  <div class="container contact-layout"><div class="form-card">${state.contact.success ? success('contact') : `${draftNote('contact')}<div class="form-head"><div><h2 id="form-title">Votre message</h2><p class="muted small"><span class="req">*</span> Champs obligatoires</p></div>${progressRing()}</div>
    ${o ? `<div class="application-offer"><span class="row-num" aria-hidden="true">${o.num}</span><p>À propos de <strong>${o.specialty}</strong>${o.place} · Réf. ${o.ref}</p></div>` : ''}
    <form id="contact-form" novalidate data-kind="contact" aria-labelledby="form-title"><div id="form-errors"></div><div class="form-grid">${pills('topic','Votre demande concerne',['Je suis praticien','Je recrute','Autre sujet'],v.topic)}<div class="topic-check" id="topic-check" role="status"></div>${f('contactName','Votre nom',{autocomplete:'name',full:true})}${f('email','Email',{type:'email',autocomplete:'email',full:true})}${f('message','Comment pouvons-nous vous aider ?',{type:'textarea',full:true,placeholder:'Votre question ou votre besoin…',help:'10 caractères minimum.'})}</div>${consentField()}
    <div class="form-actions"><button type="submit" class="btn btn-primary btn-full">Envoyer mon message${icon('arrow')}</button></div></form>`}</div>
  <aside class="contact-channels"><a class="channel channel-dark" href="${TEL}">${icon('phone')}<span><small>Plutôt par téléphone ?</small><strong>${PHONE}</strong>Lundi – vendredi, 9 h – 18 h</span></a><button type="button" class="channel channel-call" data-callback>${icon('phone')}<span><small>Être rappelé</small><strong>Laissez votre numéro</strong>Nous vous appelons au moment choisi</span></button><a class="channel" href="${waLink()}" target="_blank" rel="noopener">${icon('chat')}<span><small>WhatsApp</small><strong>Écrire sur WhatsApp</strong>Pratique depuis l’étranger</span></a>${etab ? mailChannel('etab', true) + mailChannel('pro', false) : mailChannel('pro', !!v.topic) + mailChannel('etab', false)}<div class="channel">${icon('pin')}<span><small>Notre adresse</small><strong>6 rue d’Armaillé</strong>75017 Paris</span></div></aside></div>`;
}
function notFound() {
  return `<section class="not-found container"><p class="nf-num" aria-hidden="true">404</p><h1>${dot('Retrouvons votre chemin.')}</h1><p class="lead">Cette page n’existe pas ou plus.</p><div class="actions">${btn('Retour à l’accueil','#/')}${btn('Voir les offres','#/offres','outline')}</div></section>`;
}

function legal(){return `<section class="page-heading"><div class="container">${breadcrumb([['Informations légales']])}<h1>Des informations en toute transparence<span class="dot">.</span></h1><p class="lead">Mentions légales et protection de vos données.</p></div></section><div class="container legal-layout"><nav class="legal-nav" aria-label="Sommaire des informations légales"><strong>Sur cette page</strong><a href="#/mentions-legales?section=editeur">L’éditeur du site</a><a href="#/mentions-legales?section=confidentialite">Vos données personnelles</a><a href="#/mentions-legales?section=droits">Vos droits</a><a href="#/mentions-legales?section=cookies">Cookies et traceurs</a></nav><article class="legal-copy"><h2 id="editeur">Mentions légales</h2><h3>L’éditeur</h3><dl class="legal-facts"><div><dt>Raison sociale</dt><dd>LASKA CORPORATE, société par actions simplifiée (SAS)</dd></div><div><dt>Capital social</dt><dd>${todo('montant du capital social')}</dd></div><div><dt>Immatriculation</dt><dd>RCS de Paris, SIREN 983 374 398</dd></div><div><dt>TVA intracommunautaire</dt><dd>FR29 983 374 398 <small>(calculé à partir du SIREN, à confirmer)</small></dd></div><div><dt>Siège social</dt><dd>6 rue d’Armaillé, 75017 Paris</dd></div><div><dt>Téléphone</dt><dd><a href="tel:+33184803696">+33 1 84 80 36 96</a></dd></div><div><dt>Email</dt><dd><a href="mailto:contact@laskacorp.com">contact@laskacorp.com</a> · établissements : <a href="mailto:${MAIL_ETAB}">${MAIL_ETAB}</a></dd></div></dl><h3>Directeur de la publication</h3><p>Mohamed Amine Hachicha, Président de LASKA CORPORATE.</p><h3>Hébergement</h3><dl class="legal-facts"><div><dt>Site</dt><dd>Vercel Inc., 440 N Barranca Avenue #4133, Covina, CA 91723, États-Unis <small>(hébergeur du site actuel, à confirmer pour la version publiée)</small></dd></div><div><dt>Données des formulaires</dt><dd>Supabase, région Union européenne (Francfort, Allemagne) <small>(annoncé sur le site actuel, à confirmer)</small></dd></div></dl><h3>Crédits</h3><p>Logo : LASKA CORPORATE. Polices : Manrope et DM Sans (licence SIL Open Font). Photographies d’illustration : Unsplash, elles ne représentent pas l’équipe Laska Corporate.</p><h3>Accessibilité</h3><p>Ce site vise le niveau AA des règles d’accessibilité (RGAA). Une difficulté pour utiliser une page ? Écrivez à <a href="mailto:contact@laskacorp.com">contact@laskacorp.com</a> ou appelez le <a href="tel:+33184803696">01 84 80 36 96</a> : nous vous apportons l’information autrement.</p><h3>Propriété intellectuelle</h3><p>Les textes, graphismes, logo et éléments du site appartiennent à LASKA CORPORATE ou à leurs ayants droit. Les photographies d’illustration de cette maquette proviennent d’Unsplash et ne représentent pas l’équipe Laska Corporate.</p><h2 id="confidentialite">Vos données personnelles</h2><p>Les informations ci-dessous reprennent les principes annoncés sur le site Laska Corporate. Les formulaires de cette maquette fonctionnent uniquement en simulation : aucun envoi, stockage sur serveur ou dépôt de fichier n’est effectué.</p><h3>Qui est responsable ?</h3><p>LASKA CORPORATE, 6 rue d’Armaillé, 75017 Paris. Pour toute question : <a href="mailto:contact@laskacorp.com">contact@laskacorp.com</a>.</p><h3>Le dossier praticien</h3><p>Ces informations servent à étudier votre profil et à vous accompagner. Quand vous postulez à une offre, sa référence est gardée avec votre dossier.</p><p>Le dossier demande :</p><ul class="legal-list"><li>vos coordonnées, avec votre téléphone et l’indicatif de votre pays ;</li><li>votre lieu de vie ;</li><li>vos spécialités et le pays de votre diplôme ;</li><li>votre situation (EVC, autorisation d’exercice, ou diplôme français ou européen) et sa date ;</li><li>vos disponibilités.</li></ul><p>Le reste est facultatif au premier contact : le CV, la copie de l’autorisation ou du diplôme, la preuve de réussite aux EVC, l’attestation RPPS et vos souhaits (régions, contrats, langues). Vous pouvez les envoyer plus tard.</p><p>Base annoncée : mesures précontractuelles prises à votre demande. Durée de conservation annoncée : 2 ans à compter du dernier échange, sauf poursuite active du dossier.</p><h3>La demande d’un établissement</h3><p>Les informations sur l’établissement, son contact et le besoin de recrutement servent à répondre à la demande de renfort. Base annoncée : intérêt légitime. Durée de conservation annoncée : 3 ans à compter du dernier échange.</p><h3>Les avis des praticiens</h3><p>Le formulaire d’avis recueille vos nom et prénom, votre spécialité, votre pays d’exercice, votre note et votre texte. Votre avis n’est publié qu’après relecture par notre équipe, et seulement avec votre prénom, l’initiale de votre nom, votre spécialité et votre pays ; il peut être repris comme témoignage sur la page d’accueil. Base : votre consentement, donné en cochant la case du formulaire. Vous pouvez le retirer à tout moment en écrivant à <a href="mailto:contact@laskacorp.com">contact@laskacorp.com</a> : votre avis est alors retiré du site. Durée de conservation : ${todo('durée de conservation des avis')}</p><h3>Le formulaire de contact</h3><p>Les coordonnées, le sujet et le message servent à traiter la demande. Base annoncée : intérêt légitime. Durée de conservation annoncée : 12 mois, sauf poursuite dans le cadre d’un dossier.</p><h3>Accès et hébergement</h3><p>Le site actuel indique un accès limité aux personnes habilitées chez Laska Corporate et un hébergement des données collectées via Supabase dans l’Union européenne, à Francfort. L’hébergement réel devra être confirmé pour la version publiée.</p><h2 id="droits">Vos droits</h2><p>Vous pouvez demander l’accès, la rectification, l’effacement, la limitation, l’opposition ou la portabilité de vos données en écrivant à <a href="mailto:contact@laskacorp.com">contact@laskacorp.com</a>. Le site annonce une réponse sous un mois. Vous pouvez également adresser une réclamation à la <a href="https://www.cnil.fr/" target="_blank" rel="noopener">CNIL</a>.</p><h2 id="cookies">Cookies et traceurs</h2><p>Cette maquette n’utilise aucun outil d’analyse ni cookie publicitaire. Elle garde seulement dans votre navigateur les offres que vous mettez de côté et, pour la démonstration, les avis saisis et l’Espace candidat. Les informations saisies dans les formulaires sont gardées dans cet onglet du navigateur (stockage de session) pour ne pas être perdues en cas de rechargement ; elles disparaissent quand vous fermez l’onglet. Les fichiers ne sont jamais gardés.</p><p class="small">Contenu proposé pour la maquette, à faire valider avant publication.</p></article></div>`;}

/* ───────────── Validation et formulaires ───────────── */
function normalized(s) { return String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[’']/g, ''); }
function filterQuery() {
  const p = new URLSearchParams(), f = state.filter;
  if (f.specs.length) p.set('specialite', f.specs.join(',')); if (f.depts.length) p.set('departement', f.depts.join(',')); if (f.months?.length) p.set('periode', f.months.join(',')); if (f.fav) p.set('gardees', '1'); if (f.status !== 'all') p.set('etat', f.status);
  return p.size ? '?' + p.toString().replaceAll('%2C', ',') : '';
}
/* Enregistre le formulaire dans l’état. Les cases d’un même groupe (data-multi) donnent une liste ;
   les créneaux (data-slot) et les fichiers sont gérés à part. */
function saveForm(form, kind) {
  const v = state[kind].values, groups = {};
  for (const el of form.elements) {
    if (!el.name || el.type === 'submit' || el.type === 'button' || el.type === 'file' || el.dataset.slot || el.dataset.start) continue;
    if (el.hasAttribute('data-multi')) { groups[el.name] ||= []; if (el.checked) groups[el.name].push(el.value); continue; }
    if (el.type === 'radio') { if (el.checked) v[el.name] = el.value; continue; }
    v[el.name] = el.type === 'checkbox' ? el.checked : el.value;
  }
  Object.assign(v, groups);
}
const fileState = (form, el) => { const v = state[form.dataset.kind]?.values || {}; return {name: v[`${el.id}Name`], error: v[`${el.id}Error`], why: v[`${el.id}ErrorMsg`]}; };
const isGroup = el => el.type === 'radio' || el.hasAttribute('data-multi');
/* Champs obligatoires visibles, regroupés par nom (un groupe de boutons ou de cases = un champ). */
function requiredGroups(form) {
  const names = new Map();
  for (const el of form.elements) if (el.name && (el.required || el.hasAttribute('data-required-group')) && !el.closest('[hidden]') && !names.has(el.name)) names.set(el.name, el);
  return [...names.values()];
}
const isDone = (form, el) => isGroup(el) ? !!form.querySelector(`[name="${el.name}"]:checked`) : el.type === 'file' ? !!fileState(form, el).name : !!el.value.trim();
function updateProgress(form) {
  const ring = $('.progress-bar'), text = $('#progress-text'); if (!ring || !text) return;
  const groups = requiredGroups(form), done = groups.filter(el => isDone(form, el)).length;
  ring.style.strokeDashoffset = 100 - (groups.length ? done / groups.length * 100 : 0);
  text.innerHTML = done === groups.length ? `${icon('check')}<span>Prêt</span>` : `<strong>${done}/${groups.length}</strong><span>obligatoires</span>`;
  ring.closest('.progress').classList.toggle('is-done', done === groups.length);
}
/* Ce qui manque ou ne va pas dans les champs visibles du formulaire, sans rien afficher. */
function findIssues(form) {
  const issues = [], seen = new Set();
  for (const el of form.elements) {
    if (!el.name || el.type === 'submit' || el.type === 'button' || el.closest('[hidden]') || seen.has(el.name)) continue;
    let message = '';
    const wrap = el.closest('.field'), group = isGroup(el);
    const label = el.dataset.errorLabel || (wrap?.querySelector(':scope > legend, :scope > .multi-label') || wrap?.querySelector('label'))?.textContent.replace('*', '').trim() || el.name;
    if (group) { seen.add(el.name); if ((el.required || el.hasAttribute('data-required-group')) && !form.querySelector(`[name="${el.name}"]:checked`)) message = el.dataset.groupMsg || (el.type === 'radio' ? 'Choisissez une réponse.' : el.name === 'slotChoice' ? 'Choisissez au moins un créneau.' : 'Choisissez au moins une spécialité.'); }
    else if (el.type === 'file') { const f = fileState(form, el); if (f.error || el.dataset.invalidFile) message = f.why ? f.why.replace(/<[^>]+>/g, '') : `Choisissez un fichier ${el.dataset.ext.includes('jpg') ? 'PDF, JPG ou PNG' : 'PDF'} de moins de 10 Mo, ou retirez-le.`; else if (el.required && !f.name) message = el.dataset.missing || 'Ajoutez ce document.'; }
    else if (el.type === 'checkbox') { if (el.required && !el.checked) message = el.dataset.missing || 'Cochez cette case pour continuer.'; }
    else if (el.required && !el.value.trim()) message = el.type === 'date' ? 'Choisissez une date.' : 'Complétez ce champ.';
    else if (el.type === 'date' && el.value && el.min && el.value < el.min) message = 'Choisissez une date à venir.';
    else if (el.type === 'date' && el.value && el.max && el.value > el.max) message = 'Cette date ne peut pas être dans le futur.';
    else if (el.dataset.after && el.value && el.value < (document.getElementById(el.dataset.after)?.value || '')) message = 'La fin doit être après le début.';
    else if (el.type === 'email' && el.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value)) message = 'Indiquez une adresse complète, par exemple nom@exemple.fr.';
    else if (el.type === 'tel' && el.value) message = phoneProblem(el.value, phoneCodeOf(el));
    else if (el.name === 'message' && el.value.trim().length < 10) message = 'Précisez votre demande en 10 caractères minimum.';
    else if (el.dataset.min && el.value.trim().length < Number(el.dataset.min)) message = el.dataset.minMsg || `Écrivez au moins ${el.dataset.min} caractères.`;
    if (message) issues.push({el, wrap, group, label, message, target: group ? (wrap.querySelector('.multi-toggle') || wrap.querySelector('input')) : el.dataset.picker ? document.getElementById(el.dataset.picker) : el});
  }
  return issues;
}
function validate(form) {
  form.querySelectorAll('.error-text').forEach(e => e.remove());
  form.querySelectorAll('[aria-invalid]').forEach(e => { e.removeAttribute('aria-invalid'); const help = e.closest('.field')?.querySelector('small[id]'); help ? e.setAttribute('aria-describedby', help.id) : e.removeAttribute('aria-describedby'); });
  form.querySelectorAll('.field.has-error').forEach(e => { e.classList.remove('has-error'); e.removeAttribute('aria-describedby'); });
  $('#form-errors', form).innerHTML = '';
  const issues = findIssues(form);
  for (const {el, wrap, group, message} of issues) {
    const error = document.createElement('p'); error.className = 'error-text'; error.id = el.name + '-error'; error.innerHTML = `${icon('close')}${message}`; wrap?.append(error);
    if (group) { wrap.classList.add('has-error'); wrap.setAttribute('aria-describedby', error.id); }
    else { el.setAttribute('aria-invalid', 'true'); el.setAttribute('aria-describedby', error.id); if (el.dataset.picker) document.getElementById(el.dataset.picker)?.setAttribute('aria-invalid', 'true'); }
  }
  if (!issues.length) return true;
  issues.forEach((x, i) => { if (!x.target.id) x.target.id = `error-target-${i}`; });
  $('#form-errors', form).innerHTML = `<div class="error-summary" tabindex="-1" role="alert"><p>${issues.length === 1 ? 'Une information à vérifier :' : `${issues.length} informations à vérifier :`}</p><ul>${issues.map(x => `<li><a href="#${x.target.id}" data-error-focus="${x.target.id}">${esc(x.label)}</a></li>`).join('')}</ul></div>`;
  for (const {target} of issues) { const d = target.closest('details'); if (d) d.open = true; }
  $('#form-errors .error-summary', form).focus();
  form.querySelectorAll('[data-error-focus]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); document.getElementById(a.dataset.errorFocus)?.focus(); }));
  return false;
}
/* Blocs conditionnels : affichés selon une réponse ; leurs champs ne sont obligatoires que visibles. */
const ruleOn = (form, rule) => {
  const i = rule.indexOf(':'), name = rule.slice(0, i), els = $$(`[name="${name}"]`, form), picked = el => el.type === 'radio' || el.type === 'checkbox' ? el.checked : !!el.value;
  return rule.slice(i + 1).split('|').some(val => val === '' ? !els.some(picked) : els.some(el => picked(el) && el.value === val));
};
function syncConditionals(form) {
  $$('[data-when]', form).forEach(block => block.hidden = !ruleOn(form, block.dataset.when));
  /* Une étape masquée du formulaire ne compte pas : seuls les blocs conditionnels masqués rendent un champ facultatif. */
  $$('[data-cond-required]', form).forEach(i => i.required = !i.closest('[hidden]:not(.form-stage)'));
  $$('[data-required-when]', form).forEach(i => i.required = !i.closest('[hidden]:not(.form-stage)') && ruleOn(form, i.dataset.requiredWhen));
  $$('[data-req-rule]', form).forEach(b => b.classList.toggle('is-required', ruleOn(form, b.dataset.reqRule)));
}
/* Un champ corrigé perd son message d’erreur tout de suite, sans attendre un nouvel envoi. */
function clearError(el) {
  const field = el?.closest?.('.field'); if (!field) return;
  if (isGroup(el)) { if (field.classList.contains('has-error') && field.querySelector(`[name="${el.name}"]:checked`)) { field.classList.remove('has-error'); field.removeAttribute('aria-describedby'); field.querySelector('.error-text')?.remove(); } return; }
  if (el.getAttribute('aria-invalid') !== 'true' || !el.value.trim() || !el.checkValidity()) return;
  if (el.name === 'message' && el.value.trim().length < 10) return;
  if (el.type === 'tel' && phoneProblem(el.value, phoneCodeOf(el))) return;
  if (el.dataset.min && el.value.trim().length < Number(el.dataset.min)) return;
  el.removeAttribute('aria-invalid'); field.querySelector('.error-text')?.remove();
  if (el.dataset.picker) document.getElementById(el.dataset.picker)?.removeAttribute('aria-invalid');
  const help = field.querySelector('small[id]'); help ? el.setAttribute('aria-describedby', help.id) : el.removeAttribute('aria-describedby');
}
/* Fichiers : choix ou glisser-déposer, contrôle du type et du poids, retrait. */
function bindFiles(form, s) {
  $$('input[type=file]', form).forEach(file => {
    const id = file.id, field = file.closest('.field'), area = $('.upload-area', field), nameEl = $(`#${id}-name`, field), helpEl = $(`#${id}-help`, field), clear = $(`[data-clear="${id}"]`, field), exts = file.dataset.ext.split(',');
    const set = (name, error) => { s.values[`${id}Name`] = name; s.values[`${id}Error`] = error; };
    const clean = () => { file.removeAttribute('aria-invalid'); field.querySelector('.error-text')?.remove(); const help = field.querySelector('small[id]'); if (help) file.setAttribute('aria-describedby', help.id); };
    file.addEventListener('change', () => {
      const list = [...file.files]; if (!list.length) return;
      const problem = list.map(f => fileProblem(f, exts)).find(Boolean) || '', valid = !problem, names = list.map(f => f.name).join(', '), bytes = list.reduce((n, f) => n + f.size, 0), mb = bytes < 102400 ? 'moins de 0,1 Mo' : `${(bytes / 1048576).toLocaleString('fr-FR', {maximumFractionDigits: 1})} Mo`;
      set(valid ? names : '', !valid); s.values[`${id}ErrorMsg`] = problem;
      if (!valid) { file.value = ''; file.dataset.invalidFile = 'true'; nameEl.textContent = 'Fichier refusé'; helpEl.innerHTML = problem; }
      else { delete file.dataset.invalidFile; nameEl.textContent = names; helpEl.textContent = `${list.length > 1 ? `${list.length} fichiers prêts` : 'Fichier prêt'} (${mb}). ${list.length > 1 ? 'Ils ne seront pas envoyés' : 'Il ne sera pas envoyé'} (simulation).`; clean(); }
      clear.hidden = false; updateProgress(form);
    });
    ['dragenter', 'dragover'].forEach(t => area.addEventListener(t, e => { e.preventDefault(); area.classList.add('is-drag'); }));
    ['dragleave', 'drop'].forEach(t => area.addEventListener(t, e => { e.preventDefault(); area.classList.remove('is-drag'); }));
    area.addEventListener('drop', e => { const files = e.dataTransfer?.files; if (files?.length) { file.files = files; file.dispatchEvent(new Event('change', {bubbles: true})); } });
    clear.addEventListener('click', () => { file.value = ''; delete file.dataset.invalidFile; set('', false); nameEl.textContent = nameEl.dataset.empty; helpEl.textContent = helpEl.dataset.help; clean(); clear.hidden = true; updateProgress(form); });
  });
}
/* Créneaux de la demande établissement : ajout, retrait, « dates à définir », par spécialité. */
function bindSlots(form, s) {
  const v = s.values, area = $('#slots-area', form); if (!area) return;
  const spec = si => v.specialties[Number(si)];
  const paint = focusSel => {
    area.innerHTML = slotsArea(v); bindDates(area);
    Object.values(v.slots || {}).flat().forEach(r => delete r.fresh);
    syncConditionals(form); updateProgress(form); saveDraft();
    if (focusSel) $(focusSel, form)?.focus();
  };
  const write = t => {
    const [si, ri, key] = t.dataset.slot.split(':'), row = v.slots[spec(si)][Number(ri)];
    row[key] = key === 'days' ? $$(`[name="${t.name}"]:checked`, form).map(i => Number(i.value)) : t.value;
    if (key === 'from') { const to = document.getElementById(`slot-${si}-${ri}-to-value`); if (to) to.min = t.value || TODAY; }
    /* Compte en direct : la ligne et le total de la spécialité. */
    const group = $(`.slot-group[data-si="${si}"]`, form), li = t.closest('.slot-row');
    if (row.kind === 'range' && li) $('.range-count', li).textContent = rangeText(row);
    if (group && !v.slotFlex[spec(si)]) $('.slot-count', group).textContent = slotCount(v.slots[spec(si)].reduce((n, r) => n + rowCount(r), 0));
  };
  form.addEventListener('input', e => { if (e.target.dataset.slot) write(e.target); });
  form.addEventListener('change', e => {
    const t = e.target;
    if (t.name === 'specialties' || t.name === 'specialtyOther' || t.name === 'contract') { paint(); const title = $('[data-dates-title]', form); if (title) title.textContent = datesTitle(v); }
    if (t.dataset.slot) write(t);
    if (t.dataset.start) { v.startFrom[spec(t.dataset.start)] = t.value; const count = $('.slot-count', t.closest('.slot-group')); if (count) count.textContent = t.value ? 'Date choisie' : 'Date à choisir'; saveDraft(); }
    if (t.dataset.startFlex !== undefined) { v.startFlex[spec(t.dataset.startFlex)] = t.checked; paint(`[data-start-flex="${t.dataset.startFlex}"]`); }
    if (t.dataset.slotFlex !== undefined) { v.slotFlex[spec(t.dataset.slotFlex)] = t.checked; paint(`[data-slot-flex="${t.dataset.slotFlex}"]`); }
  });
  form.addEventListener('multichange', e => { if (e.detail.name === 'specialties') { v.specialties = e.detail.values; paint(); } });
  form.addEventListener('click', e => {
    const add = e.target.closest('[data-slot-add]'), remove = e.target.closest('[data-slot-remove]');
    if (add) {
      const si = add.dataset.slotAdd, rows = v.slots[spec(si)], range = add.dataset.kind === 'range', type = rows.at(-1)?.type || SLOT_TYPES[0];
      /* Une ligne de date encore vide n’est jamais laissée derrière (elle bloquerait l’envoi) : une période la remplace,
         une nouvelle date commence par elle. */
      const empty = rows.findIndex(r => r.kind === 'date' && !r.date);
      const item = range ? {kind: 'range', from: '', to: '', days: [1, 2, 3, 4, 5, 6, 7], type, fresh: true} : {kind: 'date', date: '', type, fresh: true};
      if (empty < 0) rows.push(item); else if (range) rows.splice(empty, 1, item);
      const at = empty < 0 ? rows.length - 1 : empty;
      paint(`#slot-${si}-${at}-${range ? 'from' : 'date'}`);
    }
    if (remove) {
      const [si, ri] = remove.dataset.slotRemove.split(':'), sp = spec(si), [gone] = v.slots[sp].splice(Number(ri), 1);
      paint(`[data-slot-add="${si}"]`);
      toast(gone.kind === 'range' ? 'Période retirée.' : `Date ${gone.date ? `du ${dayMonth(gone.date)} ` : ''}retirée.`, {icon: 'close', action: {label: 'Annuler', run: () => { v.slots[sp].splice(Number(ri), 0, {...gone, fresh: true}); paint(`#slot-${si}-${ri}-${gone.kind === 'range' ? 'from' : 'date'}`); }}});
    }
  });
}
function bindForm(form, kind) {
  if (!form) return; const s = state[kind];
  const onChange = () => { saveForm(form, kind); if (kind !== 'contact') s.values.wizardReady = false; syncConditionals(form); updateProgress(form); saveDraft(); };
  form.addEventListener('input', onChange); form.addEventListener('change', onChange);
  syncConditionals(form);
  bindMulti(form); bindFiles(form, s); bindDates(form);
  if (kind === 'employer') bindSlots(form, s);
  /* Les créneaux cochés dans la candidature restent ceux de la fiche d’offre, et inversement. */
  if (kind === 'candidate') form.addEventListener('change', e => { if (e.target.name === 'slotChoice' && s.values.offerId) state.picks[s.values.offerId] = $$('[name="slotChoice"]:checked', form).map(i => i.value); });
  /* Contact : l’adresse qui correspond au sujet est mise en avant. */
  if (kind === 'contact') {
    /* Sujet incohérent avec ce que dit le message : on le signale, on propose de corriger. */
    const box = $('#topic-check', form);
    const check = () => {
      const topic = form.querySelector('[name="topic"]:checked')?.value || '', said = topic === 'Je recrute' ? 'etab' : topic === 'Je suis praticien' ? 'pro' : '';
      const fromMessage = messageSide($('#message', form).value);
      let text = '', fixes = [];
      if (!s.values.topicOk && fromMessage && fromMessage !== said) {
        text = fromMessage === 'etab' ? 'Votre message parle d’un recrutement.' : 'Votre message semble venir d’un praticien.';
        fixes = [[fromMessage, fromMessage === 'etab' ? 'Choisir « Je recrute »' : 'Choisir « Je suis praticien »'], ['keep', 'Non, c’est correct']];
      }
      box.innerHTML = text ? `${icon('swap')}<div><p>${text}</p><div class="topic-fixes">${fixes.map(([v, l], i) => `<button type="button" class="${i ? 'reset-link' : 'btn btn-outline'}" data-topic-fix="${v}">${l}</button>`).join('')}</div></div>` : '';
    };
    box.addEventListener('click', e => {
      const b = e.target.closest('[data-topic-fix]'); if (!b) return;
      const v = b.dataset.topicFix;
      if (v === 'keep') { s.values.topicOk = true; check(); return; }
      const radio = $$('[name="topic"]', form).find(r => r.value === (v === 'etab' ? 'Je recrute' : 'Je suis praticien'));
      if (!radio.checked) { radio.checked = true; radio.dispatchEvent(new Event('change', {bubbles: true})); }
      check(); radio.focus();
    });
    let typing;
    form.addEventListener('input', e => { if (e.target.id === 'message') { clearTimeout(typing); typing = setTimeout(check, 500); } });
    form.addEventListener('change', e => { if (e.target.name === 'topic') { s.values.topicOk = false; check(); } });
    check();
    const mark = e => {
      if (e?.target.name !== 'topic') return;
      s.values.topicTouched = true;
      const who = e.target.value === 'Je recrute' ? 'etab' : 'pro', mine = $(`[data-mail="${who}"]`), other = $(`[data-mail="${who === 'etab' ? 'pro' : 'etab'}"]`);
      mine.classList.add('is-match'); other.classList.remove('is-match');
      if (mine.nextElementSibling !== other) other.before(mine);
    };
    form.addEventListener('change', mark);
  }
  form.addEventListener('input', e => clearError(e.target));
  form.addEventListener('change', e => clearError(e.target));
  form.addEventListener('change', e => {
    const t = e.target;
    if (t.type === 'email') {
      if (t.value !== t.value.trim()) { t.value = t.value.trim(); saveForm(form, kind); }
      const better = emailSuggestion(t.value);
      fieldHint(t, better ? `Vouliez-vous dire <strong>${esc(better)}</strong> ?` : '', better ? {label: 'Oui, corriger', run: () => { t.value = better; t.dispatchEvent(new Event('input', {bubbles: true})); t.dispatchEvent(new Event('change', {bubbles: true})); }} : null);
    }
    if (t.closest('.phone-field') && fixPhone(t.closest('.phone-field'))) { saveForm(form, kind); clearError($('input[type=tel]', t.closest('.phone-field'))); }
  });
  form.addEventListener('submit', e => {
    e.preventDefault(); saveForm(form, kind); if (!validate(form)) return;
    if (kind === 'contact') { restored.contact = false; s.success = true; s.ref = newRef(); saveDraft(); transition(() => { render(false); focusCard('.success-state h2'); }, {kind: 'form'}); return; }
    const n = Number(form.dataset.step), total = Number(form.dataset.steps);
    restored[kind] = false;
    if (n < total && !s.values.wizardSeen) { saveDraft(); goStep(kind, n + 1); return; }
    for (let k = 1; k <= total; k++) if (stageIssues(form, k)) { saveDraft(); goStep(kind, k, {errors: true}); return; }
    s.values.wizardReady = s.values.wizardSeen = true; saveDraft(); goStep(kind, 'recap');
  });
  /* « Partout en France » exclut les régions, et inversement. */
  if (kind === 'candidate') form.addEventListener('change', e => {
    if (e.target.name !== 'regions' || !e.target.checked) return;
    const all = e.target.value === 'Partout en France';
    $$('[name="regions"]', form).forEach(i => { if (i !== e.target && (all || i.value === 'Partout en France')) i.checked = false; });
    saveForm(form, kind); saveDraft();
  });
  updateProgress(form);
}
/* ───────────── Erreurs humaines : prévenir, signaler, réparer ─────────────
   Le site s’adresse à des personnes pressées, souvent peu à l’aise avec l’informatique. Chaque erreur probable
   (mauvais espace, mauvaise adresse, mauvais formulaire, email mal tapé, mauvais fichier, filtre trop strict,
   suppression involontaire, saisie perdue) reçoit une aide sur place et une façon simple de revenir en arrière.
   Rien n’est bloquant : le visiteur garde toujours la main. */

/* Messages éphémères, seulement en réponse à une action (« Annuler »…). 10 s, et ils restent tant que la souris ou le clavier est dessus.
   Un changement de page les ferme (navigate). */
function toast(message, {action = null, icon: ic = 'check', timeout = 10000} = {}) {
  let zone = document.querySelector('.toast-zone');
  if (!zone) { zone = document.createElement('div'); zone.className = 'toast-zone'; zone.setAttribute('aria-live', 'polite'); document.body.append(zone); }
  zone.querySelectorAll('.toast').forEach(t => t.remove());
  const el = document.createElement('div'); el.className = 'toast'; el.dataset.born = Date.now();
  el.innerHTML = `${icon(ic)}<p>${message}</p>${action ? `<button type="button" class="toast-action">${action.label}</button>` : ''}<button type="button" class="toast-close" aria-label="Fermer ce message">${icon('close')}</button>`;
  zone.append(el);
  let timer;
  const leave = () => { clearTimeout(timer); el.classList.add('is-leaving'); setTimeout(() => el.remove(), 220); };
  const arm = () => { clearTimeout(timer); timer = setTimeout(leave, timeout); };
  el.addEventListener('pointerenter', () => clearTimeout(timer)); el.addEventListener('pointerleave', arm);
  el.addEventListener('focusin', () => clearTimeout(timer)); el.addEventListener('focusout', arm);
  $('.toast-close', el).addEventListener('click', leave);
  if (action) $('.toast-action', el).addEventListener('click', () => { leave(); action.run(); });
  arm();
}
/* Question courte avant une action probablement erronée : deux réponses claires, la plus probable en premier. */
function askChoice({title, text, choices}) {
  const d = document.createElement('dialog'); d.className = 'guard'; d.setAttribute('aria-labelledby', 'guard-title');
  d.innerHTML = `<div class="guard-body">${icon('swap')}<h2 id="guard-title">${title}</h2><p>${text}</p><div class="guard-actions">${choices.map((c, i) => `<button type="button" class="btn ${i ? 'btn-outline' : 'btn-primary'}" data-choice="${i}">${c.label}</button>`).join('')}</div><button type="button" class="guard-close" aria-label="Fermer">${icon('close')}</button></div>`;
  document.body.append(d);
  d.addEventListener('click', e => {
    const b = e.target.closest('[data-choice]');
    if (b) { d.close(); choices[Number(b.dataset.choice)].run(); }
    else if (e.target.closest('.guard-close') || e.target === d) d.close();
  });
  d.addEventListener('close', () => d.remove());
  d.showModal();
}

/* Adresse email : les fautes de frappe les plus courantes (gmial.com, hotmail.fe, .con, @ oublié…). */
const MAIL_DOMAINS = ['gmail.com','hotmail.com','hotmail.fr','outlook.com','outlook.fr','yahoo.com','yahoo.fr','live.fr','live.com','orange.fr','free.fr','sfr.fr','laposte.net','icloud.com','wanadoo.fr','msn.com','aol.com'];
function editDistance(a, b) {
  const row = Array.from({length: b.length + 1}, (_, j) => j);
  for (let i = 1; i <= a.length; i++) { let prev = row[0]; row[0] = i; for (let j = 1; j <= b.length; j++) { const tmp = row[j]; row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1)); prev = tmp; } }
  return row[b.length];
}
function emailSuggestion(raw) {
  const v = raw.trim();
  if (!v.includes('@')) { const m = /^(.+?)[.\s]+((?:gmail|hotmail|yahoo|outlook|orange|free|live|icloud|laposte|wanadoo)\.[a-z]{2,4})$/i.exec(v); return m ? `${m[1]}@${m[2]}`.toLowerCase() : ''; }
  const m = /^([^\s@]+)@([^\s@]+)$/.exec(v); if (!m) return '';
  let d = m[2].toLowerCase().replace(/,/g, '.').replace(/\.(con|cmo|ocm|vom|xom|comm|coom|cpm)$/, '.com').replace(/\.(ft|fe|frr|rf)$/, '.fr').replace(/\.(nte|met|ner)$/, '.net');
  if (!d.includes('.')) d = MAIL_DOMAINS.find(x => x.startsWith(`${d}.`)) || d;
  if (!MAIL_DOMAINS.includes(d)) { let best = '', score = 9; for (const x of MAIL_DOMAINS) { const s = editDistance(d, x); if (s < score) { score = s; best = x; } } if (best && score <= (d.length > 8 ? 2 : 1)) d = best; }
  const fixed = `${m[1]}@${d}`;
  return fixed.toLowerCase() !== v.toLowerCase() ? fixed : '';
}
/* ───────────── Téléphone avec indicatif ─────────────
   Une liste d’indicatifs (France d’abord, puis par ordre alphabétique) et le numéro sans l’indicatif.
   Erreurs prévues : indicatif retapé dans le numéro (+216…) → la liste se règle d’elle-même ; 0 de tête en trop
   → retiré (sauf Italie, où il fait partie du numéro) ; numéro français mal compté → message précis.
   En Next.js : un composant <PhoneInput> (libphonenumber-js pour la validation par pays). */
const DIAL_CODES = [['France', '33'], ...[['Algérie', '213'], ['Allemagne', '49'], ['Arabie saoudite', '966'], ['Belgique', '32'], ['Bénin', '229'], ['Burkina Faso', '226'], ['Cameroun', '237'], ['Canada, États-Unis', '1'], ['Comores', '269'], ['Congo', '242'], ['Côte d’Ivoire', '225'], ['Djibouti', '253'], ['Égypte', '20'], ['Émirats arabes unis', '971'], ['Espagne', '34'], ['Gabon', '241'], ['Guinée', '224'], ['Haïti', '509'], ['Irak', '964'], ['Iran', '98'], ['Italie', '39'], ['Jordanie', '962'], ['Liban', '961'], ['Libye', '218'], ['Luxembourg', '352'], ['Madagascar', '261'], ['Mali', '223'], ['Maroc', '212'], ['Maurice', '230'], ['Mauritanie', '222'], ['Niger', '227'], ['Pays-Bas', '31'], ['Portugal', '351'], ['Qatar', '974'], ['RD Congo', '243'], ['Roumanie', '40'], ['Royaume-Uni', '44'], ['Russie', '7'], ['Sénégal', '221'], ['Suisse', '41'], ['Syrie', '963'], ['Tchad', '235'], ['Togo', '228'], ['Tunisie', '216'], ['Turquie', '90'], ['Ukraine', '380']].sort((a, b) => a[0].localeCompare(b[0], 'fr'))];
const dialName = code => DIAL_CODES.find(([, c]) => c === code)?.[0] || '';
const phonePlaceholder = code => code === '33' ? '06 12 34 56 78' : code === 'autre' ? '+1 514 555 0123' : 'Numéro, sans l’indicatif';
function phoneField(name, label, {id = name, required = true, help = '', value = '', code = '', full = true} = {}) {
  code ||= '33';
  return `<div class="field phone-field ${full ? 'full' : ''}"><label for="${id}">${label}${required ? ' <span class="req" aria-hidden="true">*</span>' : ''}</label>
    <div class="phone-row"><select id="${id}-code" name="${name}Code" data-phone-code aria-label="Indicatif du pays" autocomplete="tel-country-code">${DIAL_CODES.map(([n, c]) => `<option value="${c}" ${c === code ? 'selected' : ''}>${esc(n)} +${c}</option>`).join('')}<option value="autre" ${code === 'autre' ? 'selected' : ''}>Autre indicatif</option></select>
    <input id="${id}" name="${name}" type="tel" inputmode="tel" autocomplete="tel-national" spellcheck="false" value="${esc(value)}" placeholder="${phonePlaceholder(code)}" ${required ? 'required' : ''}></div>${help ? `<small id="${id}-help">${help}</small>` : ''}</div>`;
}
const phoneCodeOf = input => input.closest('.phone-field')?.querySelector('[data-phone-code]')?.value || '33';
/* Indicatif tapé au début du numéro (+216, 00216) : le plus long qui correspond à la liste. */
function typedCode(raw) {
  const m = raw.replace(/[\s.\-()]/g, '').match(/^(?:\+|00)(\d+)/); if (!m) return '';
  return DIAL_CODES.map(([, c]) => c).filter(c => m[1].startsWith(c)).sort((a, b) => b.length - a.length)[0] || '';
}
/* Numéro espacé : à la française pour +33, par paires depuis la fin sinon. */
function tidyPhone(raw, code = '33') {
  if (code === 'autre') return raw.trim();
  let d = raw.replace(/[^\d+]/g, '');
  if (/^(\+|00)/.test(d)) { const typed = typedCode(d); if (typed !== code) return raw.trim(); d = d.replace(/^(\+|00)/, '').slice(code.length); }
  if (code === '33') { if (/^[1-9]\d{8}$/.test(d)) d = `0${d}`; return /^0\d{9}$/.test(d) ? d.replace(/(\d{2})(?=\d)/g, '$1 ') : raw.trim(); }
  if (code !== '39') d = d.replace(/^0+/, '');
  return d.replace(/\B(?=(\d{2})+(?!\d))/g, ' ');
}
function phoneProblem(raw, code = '33') {
  const d = raw.replace(/\D/g, ''); if (!d) return '';
  if (code === 'autre') return d.length < 8 ? 'Indiquez le numéro complet, avec l’indicatif : par exemple +1 514 555 0123.' : '';
  if (code === '33') { const n = d.replace(/^(0033|33)(?=\d{9}$)/, ''); return (n.length === 10 && n[0] === '0') || n.length === 9 ? '' : 'Un numéro français compte 10 chiffres, par exemple 06 12 34 56 78.'; }
  return d.length < 6 || d.length > 14 ? `Vérifiez le numéro : il semble ${d.length < 6 ? 'incomplet' : 'trop long'}.` : '';
}
/* Le numéro tel qu’on le relit et qu’on l’appelle : « +216 22 12 34 56 », « +33 6 12 34 56 78 ». */
function phoneText(num = '', code = '33') {
  if (!num) return '';
  if (code === 'autre' || num.trim().startsWith('+')) return num.trim();
  return `+${code || '33'} ${(code || '33') === '39' ? num.trim() : num.trim().replace(/^0+/, '')}`;
}
/* Après une saisie : indicatif reconnu dans le numéro, puis mise en forme. Rend true si quelque chose a changé. */
function fixPhone(box) {
  const input = $('input[type=tel]', box), select = $('[data-phone-code]', box); if (!input || !select) return false;
  let changed = false;
  const typed = typedCode(input.value);
  if (typed && typed !== select.value) { select.value = typed; changed = true; fieldHint(input, `Indicatif <strong>+${typed}</strong> (${esc(dialName(typed))}) choisi d’après votre numéro.`); }
  input.placeholder = phonePlaceholder(select.value);
  if (input.value.trim()) { const tidy = tidyPhone(input.value, select.value); if (tidy !== input.value) { input.value = tidy; changed = true; } }
  return changed;
}
/* Un conseil sous un champ, avec un bouton pour l’appliquer. */
function fieldHint(input, html, fix = null) {
  const field = input.closest('.field'); field.querySelector('.field-hint')?.remove();
  if (!html) return;
  const p = document.createElement('p'); p.className = 'field-hint'; p.setAttribute('role', 'status');
  p.innerHTML = `${icon('chat')}<span>${html}</span>${fix ? `<button type="button" class="hint-fix">${fix.label}</button>` : ''}`;
  field.append(p);
  if (fix) $('.hint-fix', p).addEventListener('click', () => { fix.run(); p.remove(); input.focus(); });
}
/* Fichier refusé : dire pourquoi, avec la marche à suivre. */
function fileProblem(f, exts) {
  const ext = f.name.split('.').pop().toLowerCase(), mb = (f.size / 1048576).toLocaleString('fr-FR', {maximumFractionDigits: 1}), name = esc(f.name);
  if (!exts.includes(ext)) {
    if (['doc','docx','odt','pages','rtf','txt'].includes(ext)) return `« ${name} » est un document de traitement de texte. Enregistrez-le en PDF (menu Fichier, puis Enregistrer sous, format PDF), ou prenez-le en photo.`;
    if (ext === 'heic') return `« ${name} » est une photo d’iPhone (format HEIC). ${exts.includes('jpg') ? 'Envoyez plutôt une capture d’écran de la photo, ou exportez-la en JPG.' : 'Ici, il faut un PDF.'}`;
    if (['jpg','jpeg','png','webp','gif'].includes(ext)) return `« ${name} » est une image. Ici, il faut un PDF.`;
    return `« ${name} » n’est pas dans un format accepté. Choisissez un ${exts.includes('jpg') ? 'PDF ou une photo' : 'PDF'}.`;
  }
  if (f.size > 10 * 1048576) return `« ${name} » pèse ${mb} Mo, la limite est 10 Mo. Prenez-le plutôt en photo, ou envoyez-le plus tard par WhatsApp.`;
  return '';
}
/* Saisie gardée dans l’onglet (stockage de session) : un rechargement ou une fausse manœuvre ne fait rien perdre.
   Les fichiers ne sont pas gardés. Tout disparaît à la fermeture de l’onglet. */
const DRAFT = 'laska-brouillon', FILE_KEY = /^(cv|authDoc|diplomaDoc|evcDoc|authRppsDoc|euRppsDoc)(Name|Error|ErrorMsg)$/;
let draftTimer; const restored = {};
function saveDraft() {
  clearTimeout(draftTimer);
  draftTimer = setTimeout(() => {
    const keep = k => state[k].success ? {} : Object.fromEntries(Object.entries(state[k].values).filter(([key]) => !FILE_KEY.test(key)));
    try { sessionStorage.setItem(DRAFT, JSON.stringify({candidate: keep('candidate'), employer: keep('employer'), contact: keep('contact'), picks: state.picks})); } catch {}
  }, 250);
}
function loadDraft() {
  try {
    const d = JSON.parse(sessionStorage.getItem(DRAFT) || 'null'); if (!d) return;
    for (const k of ['candidate', 'employer', 'contact']) if (d[k] && Object.keys(d[k]).some(x => !['offerId', 'topic', 'topicTouched', 'topicOk', 'slots', 'slotFlex', 'startFrom', 'startFlex', 'phoneCode'].includes(x))) { Object.assign(state[k].values, d[k]); restored[k] = true; }
    Object.assign(state.picks, d.picks || {});
  } catch {}
}
/* Message de contact : à qui semble-t-il s’adresser ? (mots courants, sans accents ni apostrophes) */
const PRO_SIGNS = ['mon diplome','mes diplomes','ma candidature','postuler','je postule','mon cv','autorisation dexercice','mon autorisation','evc','equivalence','je suis medecin','je suis infirmi','je suis pharmacien','je suis praticien','je suis dentiste','je suis kine','je suis sage-femme','mon dossier','je cherche un poste','je cherche du travail','je cherche un emploi','exercer en france','travailler en france','etre recrute'];
const ETAB_SIGNS = ['renfort','recruter','nous recrutons','notre etablissement','notre service','notre clinique','notre hopital','notre ehpad','notre centre','notre equipe','notre structure','nous cherchons','nous recherchons','remplacant','remplacement','poste a pourvoir','postes a pourvoir','gardes a pourvoir','nos patients','manque de medecin','manque de personnel','besoin de medecin','besoin dun medecin','besoin de personnel'];
function messageSide(text) {
  const t = normalized(text), hits = list => list.filter(w => t.includes(w)).length, pro = hits(PRO_SIGNS), etab = hits(ETAB_SIGNS);
  return pro > etab ? 'pro' : etab > pro ? 'etab' : '';
}

/* ───────────── Rendu et liaisons ───────────── */
function bindHeader() {
  const mb = $('#menu-button');
  mb.addEventListener('click', () => { const open = mb.getAttribute('aria-expanded') !== 'true'; mb.setAttribute('aria-expanded', open); mb.innerHTML = `<span>${open ? 'Fermer' : 'Menu'}</span>${icon(open ? 'close' : 'menu')}`; $('#navigation').classList.toggle('open', open); document.body.classList.toggle('menu-open', open); });
}
/* Délégation globale : « + N autres » dans les listes de choix. */
document.addEventListener('click', e => {
  const more = e.target.closest('.pick-toggle'); if (!more) return;
  const list = more.previousElementSibling, open = list.hidden;
  list.hidden = !open; more.setAttribute('aria-expanded', open); more.textContent = open ? 'Voir moins' : `+ ${more.dataset.more} autres ${more.dataset.noun || 'spécialités'}`;
  if (open) list.querySelector('input')?.focus();
});
document.addEventListener('click', e => {
  const fav = e.target.closest('[data-fav]');
  if (fav) {
    const id = fav.dataset.fav, on = toggleFav(id); syncFavButtons(id);
    const refresh = () => { if (route === '/offres' && state.filter.fav) updateResults(); };
    refresh();
    toast(on ? 'Offre gardée dans ce navigateur.' : 'Offre retirée de vos offres gardées.', {icon: 'heart', action: on ? {label: 'Voir mes offres gardées', run: () => { state.filter = {specs: [], depts: [], months: [], fav: true, status: 'all'}; location.hash = '/offres?gardees=1'; }} : {label: 'Annuler', run: () => { toggleFav(id); syncFavButtons(id); refresh(); }}});
    return;
  }
  /* Aller à une partie de la page (sans toucher à l’adresse, qui sert à la navigation) et y placer le curseur. */
  const goto = e.target.closest('[data-goto]');
  if (goto) { const t = document.getElementById(goto.dataset.goto); if (t) { t.scrollIntoView({block: 'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'}); t.querySelector('input:not([type=hidden]):not(.sr-only), select, textarea')?.focus({preventScroll: true}); } return; }
  const share = e.target.closest('[data-share]'); if (share) { shareOffer(offers.find(o => o.id === share.dataset.share)); return; }
  if (e.target.closest('[data-callback]')) { callbackDialog(); return; }
  const copy = e.target.closest('[data-copy]'); if (copy) { (navigator.clipboard?.writeText(copy.dataset.copy) || Promise.reject()).then(() => toast('Référence copiée.'), () => toast(`Votre référence : ${copy.dataset.copy}`, {icon: 'file'})); return; }
  if (e.target.closest('[data-print]')) { $$('.sent-recap').forEach(d => d.open = true); window.print(); return; }
  /* Récapitulatif : « Modifier » ramène à l’étape et au champ ; « Revenir au formulaire », à la dernière étape. */
  const edit = e.target.closest('[data-edit]');
  if (edit) {
    const kind = edit.closest('[data-review]')?.dataset.review; if (!kind) return;
    const total = formStages(kind).length, last = edit.dataset.edit === 'last';
    if (last && history.state?.wizard === kind && history.state.prev === total) { history.back(); return; }
    goStep(kind, last ? total : Number(edit.dataset.edit), {focus: edit.dataset.editFocus || ''}); return;
  }
  /* Étapes : Retour (l’étape d’avant, par l’historique quand on en vient), Passer (étape facultative). */
  const back = e.target.closest('[data-step-back]');
  if (back) {
    const form = back.closest('form'), kind = form.dataset.kind, n = Number(form.dataset.step);
    saveForm(form, kind); saveDraft();
    if (history.state?.wizard === kind && history.state.prev === n - 1) history.back(); else goStep(kind, n - 1, {replace: true});
    return;
  }
  if (e.target.closest('[data-step-skip]')) { e.target.closest('form').requestSubmit(); return; }
  const keep = e.target.closest('[data-draft-keep]');
  if (keep) { restored[keep.dataset.draftKeep] = false; keep.closest('.draft-note').remove(); return; }
  const clear = e.target.closest('[data-draft-clear]');
  if (clear) {
    /* Effacer est réversible pendant 10 s : « Annuler » remet la saisie telle qu’elle était. */
    const kind = clear.dataset.draftClear, before = JSON.parse(JSON.stringify(state[kind])), show = () => kind === 'contact' ? render(false) : goStep(kind, 1, {replace: true});
    restored[kind] = false; state[kind] = {values: {}, success: false}; saveDraft(); show();
    toast('Saisie effacée.', {icon: 'close', action: {label: 'Annuler', run: () => { state[kind] = before; saveDraft(); show(); }}});
    return;
  }
  const send = e.target.closest('[data-send]');
  if (send) { const s = state[send.dataset.send]; s.success = true; s.ref = newRef(); saveDraft(); transition(() => { render(false); focusCard('.success-state h2'); }, {kind: 'form'}); }
});
/* Clic sur une offre : son numéro de département et son titre deviendront ceux de la fiche (transition partagée). */
document.addEventListener('click', e => {
  const link = e.target.closest('a[href^="#/offre/"]'); if (!link || e.metaKey || e.ctrlKey || e.shiftKey) return;
  clearShared();
  const card = link.closest('.offer-card, .offer-row');
  if (card) { vtName($('.dept-num, .row-num', card), 'offer-num'); vtName($('h2, h3', card), 'offer-title'); }
  if (route === '/offres') offersScroll = scrollY;
}, true);
/* Changement de page. Depuis une fiche, son numéro repart vers la ligne ou la carte d’où l’on venait. */
let arrival = null, offersScroll = 0;
function navigate() {
  /* Changement d’étape dans un formulaire (boutons ou historique) : seule la carte change, la page ne saute pas. */
  const [path] = location.hash.slice(1).split('?'), parts = path.split('/').filter(Boolean), next = '/' + (parts[0] || '');
  if ((next === '/postuler' || next === '/besoin') && next === route && (parts[1] || '') === offerId) {
    const after = stepAfter; stepAfter = null;
    transition(() => { render(false); afterStep(after); }, {kind: 'form'});
    return;
  }
  arrival = {route, offerId};
  if (route === '/offre' && !$('[style*="view-transition-name"]')) { vtName($('.detail-num'), 'offer-num'); vtName($('.detail-head h1'), 'offer-title'); }
  /* Les messages éphémères d’une page ne suivent pas le visiteur sur la suivante (sauf ceux qui viennent de s’afficher). */
  $$('.toast-zone .toast').forEach(t => { if (Date.now() - Number(t.dataset.born || 0) > 800) t.remove(); });
  /* Nouvelle page : le clavier et le lecteur d’écran repartent du contenu, pas du lien cliqué (sans faire défiler). */
  transition(() => { render(); $('#main')?.focus({preventScroll: true}); }, {kind: 'route'});
}

function afterStep(after) {
  const form = $('#application-form');
  if (after?.errors && form) { validate(form); return; }
  if (after?.focus && document.getElementById(after.focus)) { goToField(after.focus); return; }
  focusCard('#form-title, .review h2, .success-state h2');
}
function render(scroll = true) {
  document.dispatchEvent(new CustomEvent('laska:before-render'));
  const [path, q] = (location.hash.slice(1) || '/').split('?'), parts = path.split('/').filter(Boolean);
  route = '/' + (parts[0] || ''); offerId = parts[1] || ''; query = q || '';
  const titles = {'/':'Une place pour chaque talent','/praticiens':'Praticiens','/etablissements':'Établissements','/engagement':'Notre engagement','/offres':'Offres d’emploi','/offre':'Offre','/postuler':offerId ? 'Postuler' : 'Créer mon dossier','/besoin':'Décrire mon besoin','/contact':'Contact','/mentions-legales':'Mentions légales','/eligibilite':'Suis-je éligible ?','/avis':'Avis des praticiens','/admin':'Modération des avis','/espace':'Espace candidat'};
  document.title = `Laska Corporate — ${titles[route] || 'Page introuvable'}`;
  document.body.classList.toggle('has-mobile-action', route === '/offre');
  document.body.classList.remove('menu-open');
  $('#help-panel')?.hidePopover?.();
  document.body.dataset.side = pageSide() || 'none';
  if (route === '/postuler') {
    if ((state.candidate.values.offerId || '') !== offerId) { state.candidate.success = false; state.candidate.values.wizardSeen = state.candidate.values.wizardReady = false; }
    state.candidate.values.offerId = offerId;
    if (offerId && !(state.candidate.values.specialties || []).length) { const linked = offers.find(o => o.id === offerId); if (linked) state.candidate.values.specialties = [linked.specialty]; }
  }
  const pages = {'/':home,'/praticiens':practitioners,'/etablissements':employers,'/engagement':engagement,'/offres':offersPage,'/offre':offerDetail,'/postuler':() => application(false),'/besoin':() => application(true),'/contact':contact,'/mentions-legales':legal,'/eligibilite':eligibility,'/avis':avisPage,'/espace':espacePage,'/admin':() => offerId === 'avis' ? adminAvis() : notFound()};
  $('#app').innerHTML = header() + `<main id="main" tabindex="-1">${(pages[route] || notFound)()}</main>` + footer();
  bindHeader();
  const hs = $('#home-search');
  if (hs) {
    const homeDepts = () => multiValues($('#home-dept').closest('.multi'));
    bindMulti(hs);
    const homeSpecs = () => multiValues($('#home-specialty').closest('.multi'));
    const upd = () => { const n = countFor(homeSpecs(), homeDepts()), label = seeLabel(n); setDone(hs, n); refreshCounts(hs, {specs: homeSpecs(), depts: homeDepts(), months: []}); window.LaskaMotion ? window.LaskaMotion.roll($('#home-count'), label) : $('#home-count').textContent = label; };
    hs.addEventListener('change', upd); hs.addEventListener('multichange', upd);
    hs.addEventListener('submit', e => { e.preventDefault(); const depts = homeDepts(), specs = homeSpecs(); state.filter = {specs, depts, months: [], fav: false, status: 'all'}; location.hash = '/offres' + filterQuery(); });
  }
  bindBrief($('#main')); bindPicks($('#main')); bindEligibility($('#main')); bindAvis($('#main')); bindEspace($('#main')); ensureHelp();
  if (route === '/offres') bindOffers(); else { bindMap($('#main')); bindIndex($('#main')); }
  bindForm($('#application-form'), $('#application-form')?.dataset.kind); bindForm($('#contact-form'), 'contact');
  $$('[data-restart]').forEach(b => b.addEventListener('click', () => { const kind = b.dataset.restart; state[kind] = {values: {}, success: false}; saveDraft(); if (kind === 'contact') transition(() => render(false), {kind: 'form'}); else goStep(kind, 1, {replace: true}); }));
  $$('.field').forEach(f => { const help = f.querySelector('small[id]'); if (help) f.querySelector('input,select,textarea')?.setAttribute('aria-describedby', help.id); });
  if (scroll) window.scrollTo({top: 0, behavior: 'instant'});
  if (arrival) {
    if (route === '/offre') { vtName($('.detail-num'), 'offer-num'); vtName($('.detail-head h1'), 'offer-title'); }
    else if (arrival.route === '/offre' && arrival.offerId) { const card = $(`[data-offer="${arrival.offerId}"]`); if (card) { vtName($('.dept-num, .row-num', card), 'offer-num'); vtName($('h2, h3', card), 'offer-title'); } }
    if (route === '/offres' && arrival.route === '/offre' && offersScroll) window.scrollTo({top: offersScroll, behavior: 'instant'});
    arrival = null;
  }
  document.dispatchEvent(new CustomEvent('laska:rendered', {detail: {route}}));
  const p = new URLSearchParams(query);
  if (p.has('faq')) requestAnimationFrame(() => $('#faq')?.scrollIntoView());
  if (p.has('section')) requestAnimationFrame(() => document.getElementById(p.get('section'))?.scrollIntoView());
}

document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  if ($('#navigation')?.classList.contains('open')) { $('#menu-button').click(); $('#menu-button').focus(); }
});
window.addEventListener('hashchange', navigate);
/* Typographie française : espace insécable avant ? ! ; : et », après «, et entre un nombre et son unité (9 h, 10 Mo).
   Un « ? » ne se retrouve plus seul en début de ligne. Appliquée à tout texte ajouté à la page, jamais aux champs de saisie. */
const FR_SPACES = [[/ ([?!;:»])/g, ' $1'], [/« /g, '« '], [/(\d) (h|min|Mo|Ko|km|ans?|mois|jours?|semaines?)(?=[\s.,;:!?)]|$)/g, '$1 $2']];
function frenchSpaces(node) {
  const fix = t => {
    if (!t.data.includes(' ') || t.parentElement?.closest('input, textarea, script, style, code, pre')) return;
    let d = t.data; for (const [re, to] of FR_SPACES) d = d.replace(re, to);
    if (d !== t.data) t.data = d;
  };
  if (node.nodeType === 3) return fix(node);
  if (node.nodeType !== 1) return;
  const w = document.createTreeWalker(node, NodeFilter.SHOW_TEXT); while (w.nextNode()) fix(w.currentNode);
}
new MutationObserver(list => { for (const m of list) m.type === 'characterData' ? frenchSpaces(m.target) : m.addedNodes.forEach(frenchSpaces); })
  .observe(document.body, {childList: true, subtree: true, characterData: true});
loadDraft();
document.querySelector('.skip-link').addEventListener('click', e => { e.preventDefault(); $('#main').focus(); $('#main').scrollIntoView(); });
render();
