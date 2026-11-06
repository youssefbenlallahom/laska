/* Laska Corporate — espace praticien (v9.1).
   Copie de l’espace praticien de référence (laska-espace.vercel.app), relevé écran par écran le 5 novembre 2026 sur le
   compte de démonstration (données fictives : Dr Wassim Fabregas, contact Wiem, missions de Vaugelas et de Sorgueval) :
   mêmes rubriques, même ordre des blocs, mêmes titres, mêmes textes, mêmes données. Seul le design suit le site
   Laska Corporate (couleurs, typographie, formes). Les dates restent calées sur aujourd’hui : la démonstration vit.
   Maquette : connexion simulée (n’importe quel email, mot de passe de 6 caractères ou plus, jamais gardé) ; ce que l’on
   fait est gardé dans ce navigateur (clé laska-portail). Production : authentification réelle, données du CRM.
   Chargé après espace-contrat.js et avant app.js ; ne contient que des définitions, appelées au rendu. */

/* ───────────── Session (simulée) ───────────── */
const SESSION_KEY = 'laska-session';
/* false : l’espace se referme, seule la page de connexion reste et une tentative de connexion l’explique (v8.7). */
const ESPACE_OUVERT = true;
function espaceUser() {
  if (!ESPACE_OUVERT) return null;
  try { return JSON.parse(localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY) || 'null'); } catch { return null; }
}
function espaceLogin(email) {
  const user = {email, firstName: PRATICIEN.prenom, lastName: PRATICIEN.nom, since: new Date().toISOString()};
  try { localStorage.setItem(SESSION_KEY, JSON.stringify(user)); } catch {}
  return user;
}
function espaceLogout() { try { localStorage.removeItem(SESSION_KEY); sessionStorage.removeItem(SESSION_KEY); } catch {} }
if (!ESPACE_OUVERT) espaceLogout();
const store = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key) || 'null') ?? fallback; } catch { return fallback; } };
const keep = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} };

/* ───────────── Dates, aux formats de la référence ───────────── */
const lazy = build => { let v; return () => v ??= build(); };
const addDays = (iso, n) => { const d = asDate(iso); d.setDate(d.getDate() + n); return isoOf(d.getFullYear(), d.getMonth(), d.getDate()); };
const J = n => addDays(TODAY, n);
const daysFrom = (a, b) => Math.round((asDate(b) - asDate(a)) / 864e5);
const cap = s => s ? s[0].toUpperCase() + s.slice(1) : s;
const jourNum = n => n === 1 ? '1er' : String(n);
const dateLongue = iso => { const d = asDate(iso); return `${jourNum(d.getDate())} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`; };
/* « Du 16 au 20 novembre 2026 » ; mission en cours : « Depuis le …, jusqu’au … ». */
function plage(a, b, enCours = false) {
  if (enCours) return `Depuis le ${dateLongue(a)}, jusqu’au ${dateLongue(b)}`;
  const x = asDate(a), y = asDate(b);
  return x.getMonth() === y.getMonth() && x.getFullYear() === y.getFullYear() ? `Du ${jourNum(x.getDate())} au ${jourNum(y.getDate())} ${MONTHS[y.getMonth()]} ${y.getFullYear()}` : `Du ${dateLongue(a)} au ${dateLongue(b)}`;
}
const dateDuJour = () => { const s = fmtDate(TODAY, {weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'}); return cap(asDate(TODAY).getDate() === 1 ? s.replace(' 1 ', ' 1er ') : s); };
const jc = iso => fmtDate(iso, {weekday: 'short', day: 'numeric', month: 'short'});
const jcl = iso => fmtDate(iso, {weekday: 'short', day: 'numeric', month: 'long'});
const jl = iso => fmtDate(iso, {weekday: 'long', day: 'numeric', month: 'long'});
const horo = s => `${jc(s.slice(0, 10))} à ${s.slice(11, 16)}`;
const horoMsg = s => `${jc(s.slice(0, 10))}, ${s.slice(11, 13)} h ${s.slice(14, 16)}`;
const horoNotif = s => `${dateLongue(s.slice(0, 10))} à ${s.slice(11, 13)}h${s.slice(14, 16)}`;
const heure = t => { const [h, m] = String(t).split(':'); return `${Number(h)} h${m && m !== '00' ? ` ${m}` : ''}`; };
const toMin = t => { const [h, m] = String(t).split(':').map(Number); return h * 60 + (m || 0); };
const duree = (debut, fin) => { let d = toMin(fin) - toMin(debut); if (d <= 0) d += 1440; return d; };
const hm = min => { const a = Math.abs(min), h = Math.floor(a / 60), m = a % 60; return `${h} h${m ? ` ${String(m).padStart(2, '0')}` : ''}`; };
const stamp = (n, t) => `${J(n)}T${t}`;
const nowStamp = () => { const d = new Date(); return `${TODAY}T${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`; };
const euros = n => n.toLocaleString('fr-FR', {style: 'currency', currency: 'EUR'});

/* ───────────── Données relevées sur le compte de démonstration (fictives) ───────────── */
const PRATICIEN = {prenom: 'Wassim', nom: 'Fabregas', specialite: 'Anesthésie-réanimation', tel: '06 39 98 10 34', email: 'wassim.fabregas@exemple.test', cp: '31200', ville: 'Toulouse', rpps: '', ordre: '2013-03-15', exercice: 'Libéral'};
const PP_CONTACT = {prenom: 'Wiem'};
/* Formats de vacation : [libellé de liste, libellé court, libellé de fiche]. */
const FORMATS = {j10: ['Journée 10 h (J10)', 'journée 10 h', 'Journée 10 h'], j12: ['Journée 12 h (J12)', 'journée 12 h', 'Journée 12 h'], garde24: ['Garde 24 h', 'garde 24 h', 'Garde 24 h']};
const HEBERGEMENT = {
  reserve: 'Hébergement réservé par Laska.',
  a_reserver: 'Hébergement à réserver de votre côté — remboursé sur justificatifs, à déposer dans votre espace.',
  pris_en_charge: 'Hébergement pris en charge.',
  aucun: 'Pas d’hébergement prévu : vous n’en avez pas besoin pour cette mission.'
};
const journees = (from, n, f = 'j10') => Array.from({length: n}, (_, i) => ({date: J(from + i), format: f, debut: '08:00', fin: '18:00'}));
const MISSIONS = lazy(() => [
  {id: 'vaugelas', etablissementNom: 'Centre Hospitalier de Vaugelas', specialiteLibelle: 'Anesthésie-réanimation', format: 'j10', jours: journees(11, 5),
    adresse: '18 allée des Platanes, 31330 Vaugelas', hebergement: 'aucun', surPlace: {nom: 'Dr Julie Sabatier', tel: '01 99 00 11 68', email: 'julie.sabatier@vaugelas.test'},
    eu: {tel: '01 99 00 11 75', contact: 'M. Pierre Castex', service: 'Anesthésie', acces: 'Voiture personnelle', motif: 'Vacance temporaire'},
    contrat: {mode: 'papier', valideLe: J(-16)}, route: null, accepteLe: ''},
  {id: 'sorgueval', etablissementNom: 'Centre Hospitalier de Sorgueval', specialiteLibelle: 'Anesthésie-réanimation', format: 'j10', jours: journees(-6, 1),
    adresse: '14 rue des Tilleuls, 69400 Sorgueval', hebergement: 'pris_en_charge', surPlace: {nom: 'Dr Paul Ménard', role: 'chef de service', tel: '01 99 00 10 00', email: 'paul.menard@sorgueval.test'},
    eu: {tel: '01 99 00 10 21', contact: 'Mme Hélène Ravel', service: 'Urgences', acces: 'Train, puis navette de l’établissement', motif: 'Remplacement d’un praticien absent'},
    contrat: {mode: 'en_ligne', valideLe: J(-6), envoyeeLe: stamp(-6, '10:06'), signeLe: stamp(-6, '10:09'), etabLe: stamp(-6, '10:12'), laskaLe: stamp(-6, '10:12')},
    route: {le: J(-6), arrivee: 'à 8 h', bon: 'Bâtiment B, 2e étage, à 8 h : Mme Garnier, cadre de santé, accueille ; badge et accès au logiciel patients préparés par le service.', logement: 'Studio à l’internat de l’hôpital ; clés à l’accueil des urgences, ouvert jour et nuit.', trajet: 'Sur place : Gare de Sorgueval, puis navette de l’hôpital toutes les 30 minutes ; parking du personnel avec le badge.', repas: 'Self de l’hôpital, badge repas remis à l’arrivée.', apporter: ['une pièce d’identité', 'votre attestation d’inscription à l’Ordre des médecins', 'votre carte de professionnel de santé (CPS), si vous en avez une'], standard: '01 99 00 10 00, demander le secrétariat des urgences'},
    accepteLe: J(-6)}
].map(m => ({...m, debut: m.jours[0].date, fin: m.jours.at(-1).date})));
/* Le dossier : [code, catégorie, libellé, état, condition]. « Selon votre situation » : pièces manquantes sous condition. */
const CATEGORIES = [['id', 'Identité & domicile'], ['exercice', 'Autorisation d’exercice'], ['couverture', 'Couverture & paiement'], ['mobilite', 'Mobilité'], ['engagements', 'Engagements'], ['renouvellements', 'Renouvellements']];
const PIECES = [
  ['CNI', 'id', 'Carte d’identité ou passeport', 'fournie'], ['titre_sejour', 'id', 'Titre de séjour', 'manquante', 'hors UE'], ['justificatif_domicile', 'id', 'Justificatif de domicile', 'fournie'],
  ['autorisation_cng', 'exercice', 'Autorisation d’exercice délivrée par le CNG', 'na'], ['diplome', 'exercice', 'Diplôme de Docteur en Médecine', 'fournie'], ['diplome_specialiste', 'exercice', 'Diplôme de Spécialiste', 'manquante', 'si applicable'],
  ['attestation_secu', 'couverture', 'Attestation de droits à la sécurité sociale', 'fournie'], ['RCP', 'couverture', 'Assurance responsabilité civile professionnelle', 'attente'], ['RIB', 'couverture', 'RIB', 'fournie'],
  ['permis', 'mobilite', 'Permis de conduire', 'fournie'], ['carte_grise', 'mobilite', 'Carte grise', 'manquante', 'si véhiculé'],
  ['engagement_candidat', 'engagements', 'Engagement Candidat Laska Corporate', 'fournie'], ['conditions_contrat', 'engagements', 'Conditions du contrat de travail temporaire', 'fournie'],
  ['ordre', 'renouvellements', 'Carte d’Ordre', 'fournie'], ['visite_medicale', 'renouvellements', 'Visite médicale du travail', 'fournie']
].map(([code, cat, lib, etat, condition]) => ({code, cat, lib, etat, condition}));
/* Pièces à présenter (jamais déposées) et libellés de la liste « Selon votre situation ». */
const A_PRESENTER = ['titre_sejour'];
const LIB_SITUATION = {titre_sejour: 'Titre de séjour (hors UE)', diplome_specialiste: 'Diplôme de Spécialiste (si applicable)', carte_grise: 'Carte grise (si véhiculé)'};
const MESSAGES = lazy(() => { const dm = dayMonth(J(-6), true);
  return [
    {id: 'm1', sens: 'recu', de: 'Wiem', quand: stamp(-18, '09:00'), objet: 'Votre contrat est prêt à signer', texte: 'Bonjour Docteur Fabregas,\n\nVotre contrat est prêt : vous pouvez le signer depuis votre espace.\n\nWiem'},
    {id: 'm2', sens: 'envoye', quand: stamp(-16, '08:40'), texte: 'Bonjour, je vous joins mon attestation de formation aux gestes d’urgence, au cas où le service la demande.', pieces: [['attestation-formation-fabregas.pdf', '1 ko']]},
    {id: 'm3', sens: 'recu', de: 'Wiem', quand: stamp(-16, '09:30'), objet: 'Réponse de Wiem', texte: 'Merci Docteur Fabregas, je la garde dans vos documents.\n\nWiem'},
    {id: 'm4', sens: 'recu', de: 'Skander', quand: stamp(-14, '12:54'), objet: 'Réponse de Skander', texte: 'Bonjour Docteur Fabregas,\n\nMerci pour votre message : je vous appelle aujourd’hui pour en parler.\n\nSkander'},
    {id: 'm5', sens: 'recu', de: 'Wiem', quand: stamp(-6, '09:55'), objet: `Vos dates le ${dm} au Centre Hospitalier de Sorgueval`, texte: `Bonjour Wassim, c’est confirmé de votre côté : le ${dm}, au Centre Hospitalier de Sorgueval. Je vous confirme dès que le service a validé votre dossier.\nWiem, Laska`},
    {id: 'm6', sens: 'recu', de: 'Wiem', quand: stamp(-6, '09:56'), objet: `C’est confirmé : Centre Hospitalier de Sorgueval le ${dm}`, texte: `Bonjour Wassim, bonne nouvelle : le service a validé votre dossier. Centre Hospitalier de Sorgueval, le ${dm} : c’est confirmé. Le contrat et la feuille de route suivent.\nWiem, Laska`},
    {id: 'm7', sens: 'recu', de: 'Wiem', quand: stamp(-6, '10:06'), objet: 'Votre contrat est prêt à signer', texte: 'Bonjour Docteur Fabregas,\n\nVotre contrat au Centre Hospitalier de Sorgueval est prêt à signer sur votre espace Laska.\n\nBien à vous,\nWiem, Laska'}
  ]; });
const NOTIFS = lazy(() => { const msg = id => MESSAGES().find(x => x.id === id), ecrit = (id, n, lu) => ({id: n, quand: msg(id).quand, titre: `${msg(id).de} vous écrit : ${msg(id).objet}`, texte: msg(id).texte, vers: '#/espace/messages', lu});
  return [
    {id: 'n1', quand: stamp(-6, '10:28'), titre: 'Vos heures ont été validées', texte: '', vers: '#/espace/heures', lu: false},
    ecrit('m7', 'n2', true),
    {id: 'n3', quand: stamp(-6, '10:05'), titre: 'Votre contrat est disponible', texte: 'Le document est prêt — consultable depuis votre mission.', vers: '#/espace/missions/sorgueval', lu: false},
    {id: 'n4', quand: stamp(-6, '09:56'), titre: 'Nouvelle proposition de mission', texte: 'Laska vous propose une mission — répondez quand vous voulez.', vers: '#/espace/proposition/sorgueval', lu: false},
    ecrit('m6', 'n5', true), ecrit('m5', 'n6', true), ecrit('m4', 'n7', true), ecrit('m3', 'n8', true), ecrit('m1', 'n9', true)
  ]; });
const AVIS_Q = [['accueil', 'Accueil', 'L’accueil du service', ['Bon', 'Moyen', 'Difficile']], ['charge', 'Charge', 'La charge de travail', ['Légère', 'Normale', 'Soutenue', 'Trop lourde']], ['logement', 'Logement', 'Le logement', ['Bon', 'Correct', 'À revoir', 'Non concerné']], ['revenir', 'Reviendrait', 'Y retourneriez-vous ?', ['Oui', 'Peut-être', 'Non']]];

/* ───────────── Ce que l’on fait dans la maquette (gardé dans ce navigateur) ───────────── */
const PORTAIL_KEY = 'laska-portail';
const SEED = () => ({
  jours: {sorgueval: {[J(-6)]: {debut: '08:00', fin: '18:00'}}},
  releves: {sorgueval: {statut: 'facture', envoyeLe: stamp(-6, '10:20'), valideLe: stamp(-6, '10:28')}},
  avis: {sorgueval: {accueil: 'Bon', charge: 'Normale', logement: 'Correct', revenir: 'Oui', mot: 'Bon accueil, équipe soudée.', le: J(-6)}},
  frais: {sorgueval: [{id: 'f1', libelle: 'Billet de train', precision: 'Toulouse → Sorgueval aller-retour', montant: 48.6, deposeLe: J(-6), valideLe: J(-6), fichier: 'billet-train-sorgueval.pdf'}]},
  dispos: [], docs: {}, coords: {}, messages: [], lus: [], contestations: {}
});
let PP = null;
const pstate = () => { if (!PP) { const s = store(PORTAIL_KEY, {}); PP = s.version === 2 ? s : {...SEED(), version: 2}; } return PP; };
const ppSave = () => keep(PORTAIL_KEY, PP);

/* ───────────── États calculés ───────────── */
const statutMission = m => m.debut > TODAY ? 'confirmee' : m.fin < TODAY ? 'terminee' : 'en_cours';
const STATUT = {en_cours: ['En cours', 'dark'], confirmee: ['Confirmée', ''], terminee: ['Terminée', 'sand']};
const missionById = id => MISSIONS().find(m => m.id === id);
const etabNom = m => m.etablissementNom || 'Établissement : Laska vous le précise';
const signatureOf = m => { const c = m.contrat; if (c.mode !== 'en_ligne') return {statut: 'papier'}; return {...c, statut: c.signeLe && c.etabLe && c.laskaLe ? 'complet' : c.signeLe ? 'signe' : 'a_signer'}; };
function releveOf(m) {
  const r = pstate().releves[m.id] || {statut: 'saisi'}, jours = pstate().jours[m.id] || {};
  const prevu = m.jours.reduce((n, j) => n + duree(j.debut, j.fin), 0), declare = Object.values(jours).reduce((n, j) => n + duree(j.debut, j.fin), 0);
  return {...r, jours, prevu, declare, ecart: declare - prevu};
}
const totalDeclare = () => MISSIONS().reduce((n, m) => n + releveOf(m).declare, 0);
function pieceOf(p) {
  const up = pstate().docs[p.code];
  return up ? {...p, etat: 'attente', fichier: up.nom} : p;
}
const pieces = () => PIECES.map(pieceOf);
const pieceStatut = p => ({fournie: 'Fournie', attente: 'En attente de vérification par Laska', na: 'Non applicable', manquante: `Manquante${p.condition ? ` (${p.condition})` : ''}`})[p.etat];
const selonSituation = () => pieces().filter(p => p.etat === 'manquante' && p.condition);
/* La phrase du dossier, comme la référence : complet, ou ce qui manque, et ce qui peut être demandé selon la situation. */
function dossierPhrase() {
  const ps = pieces(), n = selonSituation().length, r = ps.filter(p => p.etat === 'manquante' && !p.condition);
  const suite = n > 0 ? `, et ${n} autre${n > 1 ? 's' : ''} peu${n > 1 ? 'vent' : 't'} vous être demandée${n > 1 ? 's' : ''} selon votre situation.` : '.';
  if (!r.length) return n ? `Votre dossier est complet. ${n > 1 ? `${n} pièces peuvent` : '1 pièce peut'} vous être demandée${n > 1 ? 's' : ''} selon votre situation.` : 'Toutes vos pièces sont à jour.';
  return r.length === 1 ? `${r[0].lib} manque à votre dossier${suite}` : `${r[0].lib} et ${r.length - 1} autre${r.length > 2 ? 's' : ''} pièce${r.length > 2 ? 's' : ''} manquent à votre dossier${suite}`;
}
const dossierAttention = () => pieces().some(p => p.etat === 'manquante' && p.condition !== undefined);
const notifs = () => NOTIFS().map(n => ({...n, lu: n.lu || pstate().lus.includes(n.id)}));
const unreadNotifs = () => espaceUser() ? notifs().filter(n => !n.lu).length : 0;
const allMessages = () => [...MESSAGES(), ...pstate().messages].sort((a, b) => a.quand.localeCompare(b.quand));
/* Pastille de l’onglet « Espace » du site : les notifications non lues. */
const todoItems = () => Array.from({length: unreadNotifs()});

/* ───────────── Adresses de l’espace ───────────── */
function espaceRoute() {
  const [path, q] = location.hash.slice(1).split('?'), parts = path.split('/').filter(Boolean);
  return {sub: parts[1] || '', id: parts[2] || '', extra: parts[3] || '', q: new URLSearchParams(q || '')};
}
/* Comme la référence : le retour est un lien en tête de page, la barre d’onglets reste sur tous les écrans. */
const espaceChrome = () => ({push: false, noTabbar: false});
const espaceBack = () => null;

/* ───────────── Cadre : barre du haut, navigation, onglets ───────────── */
function espaceButton() {
  const u = espaceUser(), on = route === '/espace';
  return u
    ? `<a class="espace-btn is-in" href="#/espace" ${on ? 'aria-current="page"' : ''} aria-label="Mon espace praticien, ${esc(u.firstName)} ${esc(u.lastName)}"><span class="espace-avatar" aria-hidden="true">${esc(u.firstName[0])}</span><span class="espace-btn-label">Mon espace</span></a>`
    : `<a class="espace-btn" href="#/espace" ${on ? 'aria-current="page"' : ''}>${icon('user')}<span class="espace-btn-label">Espace praticien</span></a>`;
}
const nonLues = n => `${n} non lue${n > 1 ? 's' : ''}`;
const compteur = (n, cls) => n ? `<span class="${cls}" aria-hidden="true">${n > 9 ? '9+' : n}</span>` : '';
/* La cloche ouvre la fenêtre des notifications (ordinateur) ou le panneau du bas (téléphone). */
const bell = () => { const n = unreadNotifs(), here = espaceRoute().sub === 'notifications', open = notifPop?.matches(':popover-open');
  return `<button type="button" class="pp-bell${here ? ' is-here' : ''}${open ? ' is-open' : ''}" popovertarget="pp-notif-pop" aria-haspopup="dialog" aria-label="Notifications${n ? ` — ${nonLues(n)}` : ''}">${icon('bell')}${compteur(n, 'pp-bell-n')}</button>`; };
const avatarBtn = u => `<button type="button" class="pp-me" data-logout aria-label="Se déconnecter">${esc(u.firstName[0].toUpperCase())}</button>`;
/* Téléphone : la cloche et l’initiale (qui déconnecte, comme la référence) dans l’en-tête du site. */
function espaceTools() {
  const u = espaceUser(); if (!u || route !== '/espace') return '';
  return `<div class="pp-tools">${bell()}${avatarBtn(u)}</div>`;
}
/* [clé, libellé, libellé court, icône] : les six rubriques de la référence. */
const SPACE_TABS = [['', 'Accueil', 'Accueil', 'home'], ['missions', 'Mes missions', 'Missions', 'clipboard'], ['heures', 'Mes heures', 'Heures', 'clock'], ['disponibilites', 'Mes disponibilités', 'Dispos', 'calcheck'], ['documents', 'Mes documents', 'Documents', 'file'], ['profil', 'Mon profil', 'Profil', 'user']];
const sectionOf = sub => ['proposition', 'notifications', 'messages'].includes(sub) ? '-' : sub;
const tabLink = ([k, label, court, ic], on) => `<a href="#/espace${k ? '/' + k : ''}" ${on ? 'aria-current="page"' : ''}><span class="tab-ico">${icon(ic)}</span><span class="tab-label" aria-hidden="true">${court}</span><span class="sr-only">${label}</span></a>`;
/* Téléphone : les six onglets en bas, libellés courts. */
const espaceTabs = () => { const on = sectionOf(espaceRoute().sub); return `<nav class="tabbar is-espace" aria-label="Navigation de l’espace praticien">${SPACE_TABS.map(t => tabLink(t, on === t[0])).join('')}</nav>`; };
/* Ordinateur et tablette : la colonne d’icônes à gauche, libellé dessous ; Notifications en bas de la colonne, avec le nombre de non lues. */
const rail = sub => { const section = sectionOf(sub), n = unreadNotifs();
  return `<nav class="pp-rail" aria-label="Navigation de l’espace praticien">${SPACE_TABS.map(([k, label, , ic]) => `<a href="#/espace${k ? '/' + k : ''}" ${section === k ? 'aria-current="page"' : ''}>${icon(ic)}<span>${label}</span></a>`).join('')}
    <a class="pp-rail-notif" href="#/espace/notifications" ${sub === 'notifications' ? 'aria-current="page"' : ''}><span class="pp-rail-ico">${icon('bell')}${compteur(n, 'pp-rail-n')}</span><span>Notifications</span>${n ? `<span class="sr-only">, ${nonLues(n)}</span>` : ''}</a></nav>`; };
const topbar = u => `<div class="pp-topbar">${bell()}<span class="pp-topbar-name">${esc(u.firstName)}</span><button type="button" class="pp-logout" data-logout>${icon('logout')}Se déconnecter</button>${avatarBtn(u)}</div>`;

/* ───────────── Notifications : fenêtre sous la cloche, panneau du bas sur téléphone ─────────────
   Ordinateur et tablette : une fenêtre accrochée à la cloche, les 5 plus récentes, « Voir plus » mène à la page complète.
   Téléphone : un panneau qui monte du bas, à portée du pouce — les nouvelles d’abord, puis « Plus tôt », grandes rangées,
   « Tout marquer comme lu » en haut, « Voir plus » toujours visible en bas ; on le ferme en le tirant vers le bas, en
   touchant le voile ou avec la croix. Toucher une notification la marque comme lue et ouvre l’écran concerné. */
const NOTIF_POP = 5, PHONE_MQ = matchMedia('(max-width: 760px)');
const notifIcon = n => n.titre.includes('vous écrit') ? 'chat' : n.titre.includes('heures') ? 'clock' : n.titre.includes('contrat') ? 'file' : 'clipboard';
const parDate = list => list.sort((a, b) => b.quand.localeCompare(a.quand));
/* Le moment, dit simplement : « Aujourd’hui à 10h28 », « Hier à 09h56 », « Il y a 6 jours, à 10h05 », puis la date. */
function quandCourt(s) {
  const d = Math.round((asDate(TODAY) - asDate(s.slice(0, 10))) / 864e5), h = `${s.slice(11, 13)}h${s.slice(14, 16)}`;
  return d <= 0 ? `Aujourd’hui à ${h}` : d === 1 ? `Hier à ${h}` : d < 7 ? `Il y a ${d} jours, à ${h}` : `${fmtDate(s.slice(0, 10), {day: 'numeric', month: 'long'})} à ${h}`;
}
const notifRow = n => `<li><a class="pp-pn${n.lu ? '' : ' is-unread'}" href="${n.vers}" data-notif="${n.id}"><span class="pp-notif-ico" aria-hidden="true">${icon(notifIcon(n))}</span><span class="pp-pn-main"><strong>${esc(n.titre)}</strong><time datetime="${n.quand}" title="${horoNotif(n.quand)}">${quandCourt(n.quand)}</time></span>${n.lu ? '' : '<span class="pp-unread"><span class="sr-only">Non lue</span></span>'}</a></li>`;
function notifPanel(sheet) {
  const list = parDate(notifs()), nouvelles = list.filter(x => !x.lu), n = nouvelles.length;
  const rows = items => `<ul class="pp-pop-list">${items.map(notifRow).join('')}</ul>`;
  let body;
  if (!list.length) body = `<p class="pp-pop-empty">Rien pour l’instant — vous serez prévenu ici quand quelque chose bouge.</p>`;
  else if (sheet) {
    const plusTot = list.filter(x => x.lu).slice(0, Math.max(3, NOTIF_POP + 1 - n));
    body = `${n ? `<h3 class="pp-pop-group">Nouvelles</h3>${rows(nouvelles)}` : `<p class="pp-pop-empty">${icon('check')}Vous êtes à jour : rien de nouveau.</p>`}${plusTot.length ? `<h3 class="pp-pop-group">Plus tôt</h3>${rows(plusTot)}` : ''}`;
  } else body = rows(list.slice(0, NOTIF_POP));
  return `<div class="pp-pop-head">${sheet ? '<span class="pp-grab" aria-hidden="true"></span>' : ''}<div class="pp-pop-title"><h2 id="pp-pop-title">Notifications</h2><p>${n ? nonLues(n) : 'Tout est lu'}</p></div>
      ${n ? `<button type="button" class="pp-link" data-notif-all>${icon('check')}Tout marquer comme lu</button>` : ''}
      ${sheet ? `<button type="button" class="pp-x pp-pop-close" popovertarget="pp-notif-pop" popovertargetaction="hide" aria-label="Fermer les notifications">${icon('close')}</button>` : ''}</div>
    <div class="pp-pop-body">${body}</div>
    <div class="pp-pop-foot"><a class="btn btn-primary pp-sm" href="#/espace/notifications" data-notif-more>Voir plus${icon('arrow')}</a></div>`;
}
const notifPop = (() => { document.body.insertAdjacentHTML('beforeend', '<div class="pp-pop" id="pp-notif-pop" popover role="dialog" aria-labelledby="pp-pop-title" tabindex="-1"></div>'); return document.getElementById('pp-notif-pop'); })();
const popOpen = () => notifPop.matches(':popover-open');
const closeNotifPop = () => { if (popOpen()) notifPop.hidePopover(); };
const visibleBell = () => [...document.querySelectorAll('.pp-bell')].find(b => b.getClientRects().length);
/* Ordinateur : la fenêtre se centre sous la cloche (sans sortir de l’écran), sa pointe vise la cloche ; elle défile avec la page. */
function placeNotifPop() {
  const b = visibleBell(); notifPop.removeAttribute('style');
  if (PHONE_MQ.matches || !b) { notifPop.dataset.side = 'sheet'; return; }
  const r = b.getBoundingClientRect(), cw = document.documentElement.clientWidth, w = Math.min(400, cw - 32), cx = r.left + r.width / 2;
  const left = Math.min(Math.max(16, cx - w / 2), cw - 16 - w);
  notifPop.dataset.side = 'bottom';
  Object.assign(notifPop.style, {left: `${left + scrollX}px`, top: `${r.bottom + scrollY + 10}px`, width: `${w}px`, maxHeight: `${Math.max(320, innerHeight - r.bottom - 24)}px`});
  notifPop.style.setProperty('--caret', `${cx - left}px`);
}
const refillNotifPop = () => { notifPop.innerHTML = notifPanel(notifPop.dataset.side === 'sheet'); };
const markRead = ids => { const P = pstate(); let changed = false; ids.forEach(id => { if (!P.lus.includes(id)) { P.lus.push(id); changed = true; } }); if (changed) ppSave(); };
notifPop.addEventListener('beforetoggle', e => { if (e.newState === 'open') { placeNotifPop(); refillNotifPop(); } });
notifPop.addEventListener('toggle', e => {
  const open = e.newState === 'open';
  document.querySelectorAll('.pp-bell').forEach(b => b.classList.toggle('is-open', open));
  if (open) notifPop.focus({preventScroll: true}); else notifPop.style.translate = '';
});
/* Toucher une notification : marquée comme lue, la fenêtre se ferme, l’écran concerné s’ouvre. */
notifPop.addEventListener('click', e => {
  const a = e.target.closest('[data-notif], [data-notif-more]'); if (!a) return;
  if (a.dataset.notif) markRead([a.dataset.notif]);
  closeNotifPop();
  if (a.getAttribute('href') === location.hash) { e.preventDefault(); rerender(); }
});
/* Téléphone : on tire le panneau vers le bas pour le fermer (au-delà de 90 px), sinon il revient en place. */
let notifDrag = null;
notifPop.addEventListener('pointerdown', e => {
  if (notifPop.dataset.side !== 'sheet' || !e.target.closest('.pp-pop-head') || e.target.closest('button, a')) return;
  notifDrag = {y: e.clientY}; try { notifPop.setPointerCapture(e.pointerId); } catch {} notifPop.classList.add('is-dragging');
});
notifPop.addEventListener('pointermove', e => { if (notifDrag) notifPop.style.translate = `0 ${Math.max(0, e.clientY - notifDrag.y)}px`; });
const endNotifDrag = e => { if (!notifDrag) return; const dy = e.clientY - notifDrag.y; notifDrag = null; notifPop.classList.remove('is-dragging'); if (dy > 90) closeNotifPop(); else notifPop.style.translate = ''; };
notifPop.addEventListener('pointerup', endNotifDrag);
notifPop.addEventListener('pointercancel', endNotifDrag);
/* Tout marquer comme lu : depuis la fenêtre ou la page complète. */
document.addEventListener('click', e => {
  if (!e.target.closest('[data-notif-all]')) return;
  markRead(notifs().map(n => n.id));
  const open = popOpen();
  rerender(open ? '' : '.pp-head h1');
  if (open) { refillNotifPop(); notifPop.focus({preventScroll: true}); }
  toast('Toutes vos notifications sont marquées comme lues.', {icon: 'check'});
});
/* La fenêtre se ferme quand on change d’écran, quand on passe du format ordinateur au téléphone, ou quand la cloche passe sous l’en-tête. */
addEventListener('hashchange', closeNotifPop);
PHONE_MQ.addEventListener('change', closeNotifPop);
addEventListener('scroll', () => {
  if (!popOpen() || notifPop.dataset.side !== 'bottom') return;
  const b = visibleBell(), h = document.querySelector('.site-header');
  if (!b || (h && b.getBoundingClientRect().bottom < h.getBoundingClientRect().bottom)) closeNotifPop();
}, {passive: true});

/* ───────────── Briques ───────────── */
const eyebrow = (t, cls = '') => `<p class="pp-eyebrow ${cls}">${t}</p>`;
const ppChip = (text, tone = '') => `<span class="pp-chip${tone ? ` is-${tone}` : ''}">${text}</span>`;
const statutChip = m => { const [t, tone] = STATUT[statutMission(m)]; return ppChip(t, tone); };
const pageHead = (eb, title, lead = '') => `<header class="pp-head">${eyebrow(eb)}<h1 tabindex="-1">${dot(title + '.')}</h1>${lead ? `<p>${lead}</p>` : ''}</header>`;
const card = (eb, body, {cls = '', id = '', attention = false} = {}) => `<section class="pp-card ${attention ? 'is-attention' : ''} ${cls}" ${id ? `id="${id}"` : ''}>${eb ? eyebrow(eb, attention ? 'is-attention' : '') : ''}${body}</section>`;
const arrowLink = (href, t, cls = 'pp-link') => `<a class="${cls}" href="${href}">${t}${icon('arrow')}</a>`;
const ppBack = (href, label) => `<a class="pp-back" href="${href}">${icon('back')}${label}</a>`;
const privacy = () => `<p class="pp-private">${icon('shield')}<span>Vos documents et vos échanges avec Laska restent privés — personne d’autre n’y a accès.</span></p>`;
const contactCard = () => card('Votre contact chez Laska', `<div class="pp-contact-who"><span class="pp-avatar" aria-hidden="true">${PP_CONTACT.prenom[0]}</span><p><strong>${PP_CONTACT.prenom}</strong><span>Suit votre parcours chez Laska</span></p></div>${arrowLink('#/espace/messages', 'Envoyer un message', 'btn btn-outline pp-sm')}`, {cls: 'pp-contact'});
const formatLib = (m, i = 0) => FORMATS[m.format][i];
const vacationsResume = m => m.jours.length > 1 ? `${m.jours.length} × ${formatLib(m, 1)}` : formatLib(m, 2);
function compteRebours(m) {
  const s = statutMission(m);
  if (s === 'confirmee') { const k = daysFrom(TODAY, m.debut); return k === 1 ? 'Commence demain' : `Commence dans ${k} jours`; }
  if (s === 'terminee') { const k = daysFrom(m.fin, TODAY); return k === 1 ? 'Terminée depuis hier' : `Terminée depuis ${k} jours`; }
  const n = daysFrom(m.debut, TODAY) + 1, left = daysFrom(TODAY, m.fin), a = n === 1 ? 'En cours — 1er jour' : `En cours — ${n}e jour`;
  return left === 0 ? `${a}, dernier jour aujourd’hui` : left === 1 ? `${a}, se termine demain` : `${a}, se termine dans ${left} jours`;
}
/* Mise en avant de l’accueil : « Dans 11 jours », « Encore 3 jours »… */
function bientot(m) {
  if (statutMission(m) === 'en_cours') { const e = daysFrom(TODAY, m.fin); return e === 0 ? 'Se termine aujourd’hui' : e === 1 ? 'Encore 1 jour' : `Encore ${e} jours`; }
  const i = daysFrom(TODAY, m.debut); return i <= 0 ? 'Aujourd’hui' : i === 1 ? 'Demain' : `Dans ${i} jours`;
}
const missionCard = m => `<li><a class="pp-mcard" href="#/espace/missions/${m.id}"><span class="pp-mcard-top"><span><strong>${esc(etabNom(m))}</strong><span>${m.specialiteLibelle}</span></span>${statutChip(m)}</span><span class="pp-mcard-when">${plage(m.debut, m.fin, statutMission(m) === 'en_cours')}</span><span class="pp-mcard-format">${icon('clock')}${formatLib(m)}</span>${icon('chevron', 'pp-chev')}</a></li>`;

/* ───────────── Écran : Accueil ───────────── */
function screenAccueil(u) {
  const ms = MISSIONS(), avenir = ms.filter(m => statutMission(m) !== 'terminee').sort((a, b) => a.debut.localeCompare(b.debut));
  const focus = avenir[0], autres = avenir.slice(1), passees = ms.filter(m => statutMission(m) === 'terminee').sort((a, b) => b.fin.localeCompare(a.fin));
  const apres = passees.find(m => daysFrom(m.fin, TODAY) <= 30 && !pstate().avis[m.id]);
  const urgent = dossierAttention();
  const hello = `<header class="pp-hello"><h1 tabindex="-1">${dot(`Bonjour, ${esc(u.firstName)}.`)}</h1><p>${dateDuJour()}</p></header>`;
  const apresCard = apres ? `<section class="pp-card pp-after">${eyebrow('Après votre mission', 'is-coral')}<p class="pp-strong">${esc(etabNom(apres))} — terminée le ${dateLongue(apres.fin)}</p><p class="pp-muted">Votre avis aide les prochains praticiens ; vos frais se déclarent au même endroit.</p>${arrowLink(`#/espace/missions/${apres.id}`, 'Donner mon avis et mes frais', 'btn btn-primary pp-sm')}</section>` : '';
  const premier = selonSituation()[0];
  const hero = focus ? `<section class="pp-hero" aria-label="Votre prochaine mission">${eyebrow(statutMission(focus) === 'en_cours' ? 'Votre mission en ce moment' : 'Votre prochaine mission', 'is-light')}
      <p class="pp-hero-count">${bientot(focus)}</p><h2>${esc(etabNom(focus))}</h2><p class="pp-hero-spec">${focus.specialiteLibelle}</p>
      <p class="pp-hero-when">${plage(focus.debut, focus.fin, statutMission(focus) === 'en_cours')}</p><span class="pp-hero-format">${formatLib(focus)}</span>
      <div class="pp-hero-actions">${statutMission(focus) === 'en_cours' ? `${arrowLink('#/espace/heures', 'Déclarer mes heures', 'btn btn-light')}${arrowLink(`#/espace/missions/${focus.id}`, 'Voir la mission', 'pp-link is-light')}` : arrowLink(`#/espace/missions/${focus.id}`, 'Voir la mission', 'btn btn-light')}</div>
      ${premier ? `<p class="pp-hero-prep">${icon('bolt')}<span>Votre ${LIB_SITUATION[premier.code] || premier.lib} manque encore à votre dossier.</span></p>` : '<p class="pp-hero-prep">Rien à préparer pour cette mission — nous vous recontactons en cas de besoin.</p>'}</section>`
    : `<section class="pp-card" aria-label="Votre prochaine mission">${eyebrow('Votre prochaine mission')}<p class="pp-big-text">Aucune mission prévue pour le moment.</p><p class="pp-muted">Votre contact chez Laska connaît votre situation et revient vers vous dès qu’une mission correspond.</p>${arrowLink('#/espace/messages', `Écrire à ${PP_CONTACT.prenom}`)}</section>`;
  const dossier = card('Votre dossier', `<p>${dossierPhrase()}</p>${arrowLink('#/espace/documents', 'Voir mes documents', urgent ? 'btn btn-attention pp-sm' : 'pp-link')}`, {attention: urgent});
  const heures = ms.some(m => statutMission(m) !== 'confirmee') ? card('Mes heures', `<p>${totalDeclare() ? `${hm(totalDeclare())} déclarées.` : 'Aucun jour saisi — votre relevé vous attend.'}</p>${arrowLink('#/espace/heures', 'Voir mes heures')}`) : '';
  const d0 = pstate().dispos.filter(d => d.fin >= TODAY).sort((a, b) => a.debut.localeCompare(b.debut))[0];
  const dispos = card('Vos disponibilités', `<p>${d0 ? (d0.commentaire || `Disponible du ${dateLongue(d0.debut)} au ${dateLongue(d0.fin)}.`) : 'Aucune disponibilité renseignée pour le moment.'}</p>${arrowLink('#/espace/disponibilites', 'Gérer mes disponibilités')}`);
  const profil = card('Mon profil', `<p>Vos coordonnées et ce que Laska a enregistré à votre sujet.</p>${arrowLink('#/espace/profil', 'Voir mon profil')}`);
  const prochaines = autres.length ? card('Prochaine mission', `<ul class="pp-lines">${autres.slice(0, 2).map(m => `<li><strong>${esc(etabNom(m))}</strong><span>${plage(m.debut, m.fin)}</span></li>`).join('')}</ul>`) : '';
  const anciennes = card('Missions passées', `${passees.length ? `<ul class="pp-lines">${passees.slice(0, 2).map(m => `<li><strong>${esc(etabNom(m))}</strong><span>${plage(m.debut, m.fin)}</span></li>`).join('')}</ul>` : '<p class="pp-muted">Aucune mission passée pour le moment.</p>'}${arrowLink('#/espace/missions', 'Voir tout l’historique')}`);
  return `${hello}${apresCard}${hero}${urgent ? dossier : ''}<div class="pp-grid">${heures}${dispos}${urgent ? '' : dossier}${profil}</div>${prochaines}${anciennes}${askCard()}${contactCard()}${privacy()}`;
}
const ASK = ['Quelles pièces me manquent ?', 'Quand commence ma prochaine mission ?', 'Où en sont mes heures ?'];
const askCard = () => card(`${icon('bolt')}Une question sur votre dossier ?`, `<div class="pp-ask-chips">${ASK.map((q, i) => `<button type="button" class="pp-ask-chip" data-ask="${i}">${q}</button>`).join('')}</div>
  <form class="pp-ask-form" data-form="ask" novalidate><label for="ask-q" class="sr-only">Votre question</label><input id="ask-q" name="q" maxlength="300" autocomplete="off" placeholder="Ou posez votre question…"><button type="submit" class="btn btn-primary pp-sm" data-ask-submit>${icon('bolt')}Demander</button></form>
  <div class="pp-ask-answer" id="ask-answer" aria-live="polite"></div>`, {cls: 'pp-ask'});
function askAnswer(k) {
  const ms = MISSIONS(), next = ms.filter(m => statutMission(m) !== 'terminee').sort((a, b) => a.debut.localeCompare(b.debut))[0];
  if (k === 0) { const s = selonSituation(); return `${dossierPhrase()}${s.length ? ` Selon votre situation : ${s.map(p => LIB_SITUATION[p.code] || p.lib).join(', ')}.` : ''}`; }
  if (k === 1) return next ? `Votre prochaine mission commence le ${jl(next.debut)}, au ${esc(etabNom(next))} : ${formatLib(next).toLowerCase()}, à partir de ${heure(next.jours[0].debut)}.` : 'Aucune mission n’est prévue pour le moment.';
  return MISSIONS().filter(m => releveOf(m).declare).map(m => { const r = releveOf(m); return `${etabNom(m)} : ${hm(r.declare)} déclarées${r.statut === 'facture' ? ', validées par Laska et facturées à l’établissement' : r.statut === 'valide' ? ', validées par Laska' : ''}.`; }).join(' ') || 'Aucun jour saisi pour le moment.';
}

/* ───────────── Écran : Mes missions ───────────── */
function screenMissions() {
  const ms = MISSIONS(), avenir = ms.filter(m => statutMission(m) !== 'terminee').sort((a, b) => a.debut.localeCompare(b.debut)), passees = ms.filter(m => statutMission(m) === 'terminee').sort((a, b) => b.fin.localeCompare(a.fin));
  const t = totalDeclare();
  return `${pageHead('Votre parcours', 'Mes missions', `${ms.length} mission${ms.length > 1 ? 's' : ''}${t ? ` · ${hm(t)} déclarées` : ''}`)}
    ${card('En cours et à venir', avenir.length ? `<ul class="pp-mlist">${avenir.map(missionCard).join('')}</ul>` : `<p class="pp-muted">Aucune mission prévue pour le moment.</p>${arrowLink('#/espace/disponibilites', 'Indiquer mes disponibilités')}`)}
    ${card('Missions passées', passees.length ? `<ul class="pp-mlist">${passees.map(missionCard).join('')}</ul>` : '<p class="pp-muted">Aucune mission passée pour le moment.</p>')}
    ${contactCard()}${privacy()}`;
}

/* ───────────── Écran : fiche d’une mission ───────────── */
function screenMission(m) {
  const s = statutMission(m), sig = signatureOf(m), r = releveOf(m);
  const head = `<section class="pp-mhead is-${s}" aria-labelledby="mh-t"><span class="pp-mhead-num" aria-hidden="true">${m.adresse.match(/\b(\d{2})\d{3}\b/)?.[1] || ''}</span>
    <div class="pp-mhead-top"><h1 id="mh-t" tabindex="-1">${esc(etabNom(m))}</h1>${statutChip(m)}</div><p class="pp-mhead-spec">${m.specialiteLibelle}</p>
    <p class="pp-mhead-when">${icon('calendar')}${plage(m.debut, m.fin, s === 'en_cours')}</p><p class="pp-mhead-count">${compteRebours(m)}</p><p class="pp-mhead-vac">${icon('clock')}${vacationsResume(m)}</p></section>`;
  const dossier = card('Votre dossier', `<p>${dossierPhrase()}</p>${arrowLink('#/espace/documents', 'Voir mes documents', dossierAttention() ? 'btn btn-attention pp-sm' : 'pp-link')}<p class="pp-muted">Ce suivi vaut pour toutes vos missions chez Laska, pas seulement celle-ci.</p>`, {attention: dossierAttention()});
  const sigLine = sig.statut === 'papier' ? '' : `<p class="pp-sig-line">${sig.statut === 'complet' ? `${icon('check')}Signé par les trois le ${horo(sig.laskaLe)}.` : sig.statut === 'signe' ? `${icon('pen')}Vous avez signé le ${horo(sig.signeLe)} ; l’établissement doit encore signer.` : `${icon('pen')}À signer en ligne, depuis votre espace.`}</p>${arrowLink(`#/espace/missions/${m.id}/contrat`, sig.statut === 'complet' ? 'Le contrat signé' : sig.statut === 'a_signer' ? 'Lire et signer' : 'Où en est la signature', 'pp-link')}`;
  const contrat = card('Votre contrat', `<div class="pp-docline">${icon('file')}<span><strong>Contrat de mission temporaire</strong><span>Document disponible</span></span><button type="button" class="btn btn-outline pp-sm" data-download="${m.id}">${icon('upload', 'pp-flip')}Télécharger</button></div>${sigLine}<p class="pp-muted">La rémunération ne figure pas dans ce document : votre contact chez Laska vous la communique directement.</p>`);
  let jours;
  if (s === 'confirmee') jours = `<p>Vos journées se déclareront à partir du ${dateLongue(m.debut)}, chaque jour dans « Mes heures ».</p>${arrowLink('#/espace/heures', 'Saisir ou modifier mes jours')}`;
  else { const liste = Object.entries(r.jours).sort(([a], [b]) => a.localeCompare(b));
    jours = `<p class="pp-strong">${hm(r.declare)} déclarées</p><p class="pp-muted">Prévu ${hm(r.prevu)} · Déclaré ${hm(r.declare)} · ${r.ecart ? `écart ${r.ecart > 0 ? '+' : '−'}${hm(r.ecart)}` : 'aucun écart'}</p>
      <ul class="pp-lines">${liste.map(([d, j]) => `<li><strong>${dateLongue(d)}</strong><span>${heure(j.debut)} → ${heure(j.fin)}</span></li>`).join('')}</ul>
      ${r.valideLe ? `<p class="pp-muted">Validées par Laska le ${dateLongue(r.valideLe.slice(0, 10))} — elles ne se modifient plus.</p>` : ''}${arrowLink('#/espace/heures', r.valideLe ? 'Voir mes heures' : 'Saisir ou modifier mes jours')}`; }
  const route = m.route ? card('Votre feuille de route', `<p>Arrivée, planning, logement, trajet, ce qu’il faut apporter et qui appeler — envoyée le ${jl(m.route.le)}.</p><button type="button" class="btn btn-outline pp-sm" data-route="${m.id}" aria-expanded="${routeOpen === m.id}">${icon('file')}${routeOpen === m.id ? 'Refermer' : 'Lire ma feuille de route'}</button>${routeOpen === m.id ? feuilleDeRoute(m) : ''}`, {id: 'feuille'}) : '';
  const ou = card('Où', `<p class="pp-strong">${esc(m.adresse)}</p><div class="pp-row-actions"><a class="btn btn-outline pp-sm" href="https://maps.google.com/?q=${encodeURIComponent(m.adresse)}" target="_blank" rel="noopener">${icon('pin')}Ouvrir dans le GPS</a><button type="button" class="btn btn-outline pp-sm" data-copy-address="${esc(m.adresse)}">${icon('link')}Copier</button></div>`);
  const dormez = card('Où vous dormez', `<p>${HEBERGEMENT[m.hebergement]}</p>`);
  const surPlace = card('Sur place', `<p class="pp-strong">${esc(m.surPlace.nom)}</p><p class="pp-contacts"><a href="tel:${m.surPlace.tel.replace(/ /g, '')}">${icon('phone')}${m.surPlace.tel}</a><a href="mailto:${m.surPlace.email}">${icon('mail')}${m.surPlace.email}</a></p>`);
  const histo = m.accepteLe ? card('L’historique de cette mission', `<p>Vous avez accepté cette mission le ${dateLongue(m.accepteLe)}.</p>`) : '';
  const blocs = s === 'terminee' ? [avisBlock(m), fraisBlock(m), dossier, contrat, card('Jours travaillés', jours), route, ou, dormez, surPlace, contactCard(), histo] : [dossier, contrat, card('Jours travaillés', jours), route, ou, dormez, surPlace, contactCard(), histo];
  return `${ppBack('#/espace/missions', 'Mes missions')}${head}${blocs.join('')}`;
}
function feuilleDeRoute(m) {
  const f = m.route, sec = (t, body) => `<section class="pp-route-sec"><h3>${t}</h3>${body}</section>`;
  return `<div class="pp-route"><h2>Votre feuille de route</h2><p class="pp-muted">envoyée le ${jl(f.le)} ${year(f.le)}</p>
    <p>Bonjour Dr ${PRATICIEN.nom},</p><p>Voici tout ce qu’il vous faut pour votre mission au ${esc(m.etablissementNom)}, service ${m.eu.service}, le ${jl(m.debut)} ${year(m.debut)}.</p>
    ${sec('Votre arrivée', `<p>${cap(jl(m.debut))} ${f.arrivee}, ${esc(m.adresse)}. ${esc(m.surPlace.nom)}, ${m.surPlace.role}, vous accueille.</p><p><strong>Bon à savoir :</strong> ${f.bon}</p>`)}
    ${sec('Votre planning', `<ul class="pp-lines">${m.jours.map(j => `<li><strong>${fmtDate(j.date, {weekday: 'short', day: 'numeric'})}</strong><span>journée ${heure(j.debut)} → ${heure(j.fin)}</span></li>`).join('')}</ul>`)}
    ${sec('Votre logement', `<p>${f.logement}</p>`)}${sec('Votre trajet', `<p>${f.trajet}</p>`)}${sec('Vos repas', `<p>${f.repas}</p>`)}
    ${sec('À apporter', `<ul class="pp-bullets">${f.apporter.map(a => `<li>${a}</li>`).join('')}</ul>`)}
    ${sec('Vos heures et vos frais', '<p>Déclarez vos heures chaque jour dans votre espace praticien ; un écart avec le prévu s’explique en envoyant votre relevé, à la fin de la mission. Gardez vos justificatifs de frais et déposez-les dans votre espace : ils vous sont remboursés.</p>')}
    ${sec('Chez Laska', `<p>${PP_CONTACT.prenom}, qui suit votre mission</p><p><a class="pp-link" href="${TEL}">${PHONE}</a></p>`)}
    ${sec('À l’hôpital', `<p>${esc(m.surPlace.nom)}, ${m.surPlace.role}</p><p><a class="pp-link" href="tel:${m.surPlace.tel.replace(/ /g, '')}">${m.surPlace.tel}</a></p><p>Standard : ${f.standard}</p>`)}
    <p class="pp-muted">Cette feuille de route accompagne votre contrat de mission ; elle ne le remplace pas. En cas d’empêchement, prévenez ${PP_CONTACT.prenom} au plus vite, même le soir.</p></div>`;
}
function avisBlock(m) {
  const a = pstate().avis[m.id];
  if (a && avisEdit !== m.id) return card('Votre avis sur la mission', `<p class="pp-sent">${ppChip('Envoyé')}<span>Le ${dateLongue(a.le)}</span></p><dl class="pp-pairs">${AVIS_Q.map(([k, court]) => `<div><dt>${court}</dt><dd>${esc(a[k] || '—')}</dd></div>`).join('')}</dl>${a.mot ? `<p class="pp-quote">« ${esc(a.mot)} »</p>` : ''}<p class="pp-muted">Il reste chez Laska : l’établissement ne le voit pas.</p><button type="button" class="pp-link" data-avis-edit="${m.id}">Modifier mon avis</button>`, {id: 'voir-avis'});
  return card('Votre avis sur la mission', `<form data-form="avis" data-mid="${m.id}" novalidate><div id="form-errors"></div><p class="pp-strong">Comment s’est passée la mission</p>
    <div class="pp-avis-q">${AVIS_Q.map(([k, , q, opts]) => pills(`avis_${k}`, q, opts, a?.[k] || '')).join('')}</div>
    <div class="field full"><label for="avis-mot">Un mot pour l’équipe <span class="field-note">(facultatif)</span></label><textarea id="avis-mot" name="mot" maxlength="1000" rows="3" placeholder="Ce qui s’est bien passé, ce qui serait à revoir…">${esc(a?.mot || '')}</textarea></div>
    <p class="pp-muted">Une réponse par question, puis envoyez. Votre avis reste chez Laska : l’établissement ne le voit pas.</p>
    <div class="pp-actions"><button type="submit" class="btn btn-primary">Envoyer mon avis</button>${a ? '<button type="button" class="btn btn-outline" data-avis-cancel>Annuler</button>' : ''}</div></form>`, {id: 'voir-avis'});
}
function fraisBlock(m) {
  const list = pstate().frais[m.id] || [], total = list.reduce((n, f) => n + f.montant, 0), valide = list.length && list.every(f => f.valideLe);
  return card('Vos frais', list.length ? `<p class="pp-total">${euros(total)}</p><ul class="pp-frais">${list.map(f => `<li><span class="pp-frais-main"><strong>${esc(f.libelle)}${f.precision ? ` (${esc(f.precision)})` : ''}</strong><span>Déposé le ${dateLongue(f.deposeLe)}${f.valideLe ? ` · Validé le ${dateLongue(f.valideLe)}` : ' · À valider par Laska'}</span></span><b>${euros(f.montant)}</b>${f.fichier ? `<button type="button" class="pp-link" data-justificatif="${esc(f.fichier)}">Voir le justificatif</button>` : ''}</li>`).join('')}</ul>${valide ? '<p class="pp-muted">Votre note de frais est validée : Laska vous la rembourse par virement. Pour un frais oublié, appelez Laska.</p>' : ''}` : '<p class="pp-muted">Aucun frais pour cette mission.</p>');
}

/* ───────────── Écran : contrat ───────────── */
function screenContrat(m) {
  const s = signatureOf(m), sous = `${m.specialiteLibelle} · du ${jcl(m.debut)} au ${jcl(m.fin)}`;
  const head = `${ppBack(`#/espace/missions/${m.id}`, 'Votre mission')}<header class="pp-head">${eyebrow('Contrat de mission')}<h1 tabindex="-1">${dot(etabNom(m) + '.')}</h1><p>${sous}</p></header>`;
  const doc = `<article class="pp-doc" tabindex="0" id="pp-doc" aria-label="Le contrat, à faire défiler">${contratDocHTML(m, signatureOf(m).statut === 'papier' ? {} : s, PRATICIEN)}</article>`;
  const note = '<p class="pp-muted">Le vrai document : 22 articles, les trois cadres de signature. Votre rémunération y est masquée, comme partout dans votre espace.</p>';
  if (s.statut === 'papier') return `${head}${card('', `<p class="pp-strong">Ce contrat ne se signe pas en ligne pour l’instant : Laska vous l’envoie pour une signature sur papier.</p>`)}
    ${card('', `<h2 class="pp-card-title">Le contrat</h2>${doc}${note}<button type="button" class="btn btn-outline pp-sm" data-download="${m.id}">${icon('upload', 'pp-flip')}Télécharger</button>`)}`;
  const qui = [['Vous', s.signeLe], [`${esc(m.etablissementNom)} · ${esc(m.eu.contact)}`, s.etabLe], ['Laska', s.laskaLe]];
  return `${head}${card('', `<p class="pp-status-title">${s.statut === 'complet' ? 'Votre contrat est signé par les trois' : s.statut === 'signe' ? 'Vous avez signé' : 'Votre contrat est prêt à signer'}</p><p class="pp-muted">${s.statut === 'complet' ? 'Bonne mission ! Le contrat signé et son certificat sont ci-dessous.' : 'À signer en ligne, depuis votre espace.'}</p>
      <ol class="pp-signers">${qui.map(([t, at]) => `<li class="${at ? 'is-done' : ''}"><span class="pp-tick" aria-hidden="true">${at ? '✓' : ''}</span><span><strong>${t}</strong>${at ? `signé le ${horo(at)}` : 'à signer'}</span></li>`).join('')}</ol>
      <button type="button" class="btn btn-primary pp-sm" data-download="${m.id}">${icon('upload', 'pp-flip')}Télécharger le contrat signé et son certificat</button>`)}
    ${card('', `<h2 class="pp-card-title">${s.statut === 'complet' ? 'Le contrat signé' : 'Le contrat, tel qu’il sera signé'}</h2>${doc}${note}`)}`;
}
const screenProposition = () => `${ppBack('#/espace', 'Accueil')}${card('', `<p class="pp-status-title">Cette proposition n’est plus disponible.</p><p class="pp-muted">Elle n’existe plus, ou a déjà évolué. Retournez à votre accueil — votre contact chez Laska reste joignable si vous avez un doute.</p>${arrowLink('#/espace', 'Retour à l’accueil', 'btn btn-primary pp-sm')}`)}`;

/* ───────────── Écran : Mes heures ───────────── */
const RELEVE_STEPS = [['saisi', 'Saisi'], ['envoye', 'Envoyé'], ['valide', 'Validé'], ['facture', 'Facturé']];
function screenHeures() {
  const list = MISSIONS().filter(m => statutMission(m) !== 'confirmee' || Object.keys(releveOf(m).jours).length).sort((a, b) => b.fin.localeCompare(a.fin));
  return pageHead('D’après vos missions', 'Mes heures', 'Déclarez chaque journée, puis envoyez votre relevé à la fin de la mission : Laska le valide, la paie et la facture partent ensuite.')
    + (list.length ? list.map(releveCard).join('') : card('', '<p class="pp-muted">Pas encore de mission en cours ou terminée : vos journées apparaîtront ici dès le premier jour de votre mission.</p>'));
}
function releveCard(m) {
  const r = releveOf(m), idx = RELEVE_STEPS.findIndex(([k]) => k === r.statut), c = pstate().contestations[m.id], open = joursOpen.includes(m.id);
  const steps = `<ol class="pp-steps" aria-label="Où en est votre relevé">${RELEVE_STEPS.map(([k, l], i) => `<li class="${i <= idx ? 'is-done' : ''} ${i === idx ? 'is-now' : ''}" ${i === idx ? 'aria-current="step"' : ''}>${l}</li>`).join('')}</ol>`;
  let etat = '';
  if (['valide', 'facture'].includes(r.statut)) etat = `<p class="pp-strong">Validé par Laska le ${jl(r.valideLe.slice(0, 10))} : ${hm(r.declare)}</p>${r.statut === 'facture' ? '<p class="pp-muted">Facturé à l’établissement.</p>' : ''}`
    + (c ? `<div class="pp-note">${eyebrow(`Contestation envoyée le ${jl(c.le.slice(0, 10))}`)}<p>Laska vous répond ici. Votre relevé reste validé en attendant.</p><p class="pp-quote">Vous avez écrit : « ${esc(c.message)} »</p></div>`
      : contestOpen === m.id ? contestForm(m) : `<button type="button" class="pp-link" data-contest-open="${m.id}">Ce n’est pas ce que j’ai fait : contester…</button>`);
  else if (r.statut === 'envoye') etat = '<p class="pp-strong">Envoyé</p><p class="pp-muted">Laska le valide. S’il manque quelque chose, vous le lirez ici.</p>';
  const jours = Object.entries(r.jours).sort(([a], [b]) => a.localeCompare(b));
  return `<section class="pp-card pp-releve" id="voir-releve-${m.id}">${eyebrow('Mon relevé')}<h2 class="pp-card-title">${esc(etabNom(m))}</h2><p class="pp-muted">${m.specialiteLibelle} · du ${jc(m.debut)} au ${jc(m.fin)}</p>
    ${steps}<p class="pp-strong">Prévu ${hm(r.prevu)} · déclaré ${hm(r.declare)}</p>${etat}
    <div class="pp-subsection">${eyebrow('Mes journées')}<button type="button" class="pp-link" data-jours="${m.id}" aria-expanded="${open}">${open ? 'Masquer mes journées' : 'Voir mes journées'}</button>
      ${open ? `<ul class="pp-days">${jours.map(([d, j]) => `<li><span class="pp-tick is-done" aria-hidden="true">✓</span><strong>${jc(d)}</strong><span>${heure(j.debut)} → ${heure(j.fin)} · ${hm(duree(j.debut, j.fin))}</span></li>`).join('')}</ul>` : ''}</div></section>`;
}
const contestForm = m => `<form class="pp-subform" data-form="contest" data-mid="${m.id}" novalidate><div id="form-errors"></div><h3>Contester mon relevé</h3>
  <div class="field"><label for="ct-jour">Quel jour <span class="req" aria-hidden="true">*</span></label><select id="ct-jour" name="jour" required><option value="">Choisissez</option>${m.jours.map(j => `<option value="${j.date}">${cap(jl(j.date))}</option>`).join('')}</select></div>
  <div class="pp-time-row"><div class="field"><label for="ct-d">J’ai commencé à</label><input type="time" id="ct-d" name="debut" step="900"></div><div class="field"><label for="ct-f">J’ai fini à</label><input type="time" id="ct-f" name="fin" step="900"></div></div>
  <div class="field full"><label for="ct-msg">Votre message à Laska <span class="req" aria-hidden="true">*</span></label><textarea id="ct-msg" name="message" required rows="3" maxlength="600" data-min="10" data-min-msg="Expliquez en quelques mots ce qui ne va pas." placeholder="Ex. la garde du samedi n’apparaît pas : j’ai fait 24 h, pas 12 h."></textarea></div>
  <p class="pp-muted">Laska vérifie, puis vous répond ici : il rouvre votre relevé, ou vous dit pourquoi la validation tient.</p>
  <div class="pp-actions"><button type="submit" class="btn btn-primary">Envoyer ma contestation</button><button type="button" class="btn btn-outline" data-contest-cancel>Annuler</button></div></form>`;

/* ───────────── Écran : Mes disponibilités ───────────── */
function screenDispos() {
  const list = pstate().dispos.filter(d => d.fin >= TODAY).sort((a, b) => a.debut.localeCompare(b.debut));
  const row = d => `<li class="pp-dispo"><span><strong>${plage(d.debut, d.fin)}</strong>${d.commentaire ? `<span>${esc(d.commentaire)}</span>` : ''}</span><span class="pp-row-actions"><button type="button" class="pp-link" data-dispo-edit="${d.id}">Modifier</button><button type="button" class="pp-link is-danger" data-dispo-del="${d.id}">Supprimer</button></span>${dispoEdit === d.id ? dispoForm(d) : ''}</li>`;
  const body = list.length
    ? `<div class="pp-card-head">${eyebrow('Vos disponibilités')}${dispoEdit === 'new' ? '' : '<button type="button" class="pp-link" data-dispo-add>+ Ajouter</button>'}</div><ul class="pp-dispos">${list.map(row).join('')}</ul>${dispoEdit === 'new' ? dispoForm(null) : ''}`
    : `${eyebrow('Vos disponibilités')}<p class="pp-strong">Aucune disponibilité enregistrée pour le moment.</p><p class="pp-muted">Ajoutez une première période pour indiquer quand vous pouvez travailler — Laska s’appuie dessus pour vous proposer des missions.</p>${dispoEdit === 'new' ? dispoForm(null) : '<button type="button" class="btn btn-primary pp-sm" data-dispo-add>Ajouter une disponibilité</button>'}`;
  return `${pageHead('Votre agenda', 'Mes disponibilités', 'Dites à Laska quand vous êtes disponible — c’est ce qui déclenche vos propositions de mission.')}<section class="pp-card">${body}</section>${contactCard()}${privacy()}`;
}
const dispoForm = d => `<form class="pp-subform" data-form="dispo" data-id="${d?.id || ''}" novalidate><div id="form-errors"></div><h3>${d ? 'Modifier votre disponibilité' : 'Ajouter une disponibilité'}</h3><p class="pp-muted">${d ? 'Les dates ou le commentaire ont changé ? Mettez à jour cette période.' : 'Indiquez la période où vous pouvez travailler.'}</p>
  <div class="form-grid">${dateField({id: 'dispo-debut', name: 'debut', label: 'Début', value: d?.debut || '', required: true, mark: true, attrs: `min="${TODAY}"`})}${dateField({id: 'dispo-fin', name: 'fin', label: 'Fin', value: d?.fin || '', required: true, mark: true, attrs: `min="${TODAY}" data-after="dispo-debut-value"`})}
  <div class="field full"><label for="dispo-com">Commentaire <span class="field-note">(facultatif)</span></label><textarea id="dispo-com" name="commentaire" rows="2" maxlength="300">${esc(d?.commentaire || '')}</textarea></div></div>
  <div class="pp-actions"><button type="submit" class="btn btn-primary">${d ? 'Enregistrer' : 'Ajouter'}</button><button type="button" class="btn btn-outline" data-dispo-cancel>Annuler</button></div></form>`;

/* ───────────── Écran : Mes documents ───────────── */
const uploadBtn = code => `<label class="btn btn-outline pp-sm pp-upload">${icon('upload')}Déposer un fichier<span class="sr-only"> : ${esc(PIECES.find(p => p.code === code).lib)}</span><input type="file" class="sr-only" accept="application/pdf,image/jpeg,image/png,image/webp" data-upload="${code}"></label>`;
function screenDocuments() {
  const ps = pieces(), sit = selonSituation(), urgent = dossierAttention();
  const situation = sit.length ? `<div class="pp-subsection">${eyebrow('Selon votre situation')}<ul class="pp-plist">${sit.map(p => `<li class="pp-need"><strong>${LIB_SITUATION[p.code] || p.lib}</strong>${A_PRESENTER.includes(p.code) ? '<p class="pp-muted">À présenter à votre contact Laska, en rendez-vous ou en visio : nous notons seulement sa date de fin de validité, jamais l’image. Rien à déposer ici.</p>' : uploadBtn(p.code)}</li>`).join('')}</ul></div>` : '';
  const detail = `<details class="pp-fold" ${docsOpen ? 'open' : ''} data-docs-fold><summary>${icon('plus')}Voir le détail complet (${ps.length} pièces)</summary>${CATEGORIES.map(([k, t]) => `<div class="pp-cat">${eyebrow(t)}<ul class="pp-plist">${ps.filter(p => p.cat === k).map(p => `<li><a class="pp-prow" href="#/espace/documents/${p.code}"><strong>${p.lib}</strong><span class="pp-prow-state is-${p.etat}">${pieceStatut(p)}</span>${icon('chevron', 'pp-chev')}</a></li>`).join('')}</ul></div>`).join('')}</details>`;
  const contrats = MISSIONS().slice().sort((a, b) => b.contrat.valideLe.localeCompare(a.contrat.valideLe)).map(m => { const s = signatureOf(m);
    return `<li><a class="pp-prow" href="#/espace/missions/${m.id}/contrat"><strong>${esc(etabNom(m))}</strong><span class="pp-prow-state">${s.statut === 'complet' ? 'Signé' : `Validé le ${asDate(m.contrat.valideLe).toLocaleDateString('fr-FR')}, à signer`}</span>${icon('chevron', 'pp-chev')}</a></li>`; }).join('');
  return `${pageHead('Votre dossier', 'Mes documents')}
    <section class="pp-card ${urgent ? 'is-attention' : ''}">${eyebrow('Votre dossier', urgent ? 'is-attention' : '')}<p>${dossierPhrase()}</p><p class="pp-muted">Photo ou scan — PDF, JPEG, PNG ou WEBP, 10 Mo maximum.</p>${situation}
      <p class="pp-muted">Votre contact chez Laska peut vous aider à mettre votre dossier à jour.</p>${arrowLink('#/espace/messages', `Écrire à ${PP_CONTACT.prenom}`)}${detail}</section>
    ${card('Mes contrats', `<p class="pp-muted">Tous vos contrats, missions confondues, du plus récent au plus ancien.</p><ul class="pp-plist">${contrats}</ul>`)}${privacy()}`;
}
function screenPiece(p) {
  const cat = CATEGORIES.find(([k]) => k === p.cat)[1];
  return `${ppBack('#/espace/documents', 'Mes documents')}${pageHead(cat, p.lib)}
    ${card('Statut', `<p class="pp-strong pp-prow-state is-${p.etat}">${pieceStatut(p)}</p>`)}
    ${card('Fichier', p.etat === 'attente' ? `<button type="button" class="btn btn-outline pp-sm" data-justificatif="${esc(p.fichier || 'attestation-rcp.pdf')}">${icon('eye')}Voir mon fichier</button>` : '<p class="pp-muted">Aucun fichier n’est joint à cette pièce.</p>')}`;
}

/* ───────────── Écran : Mon profil ───────────── */
function screenProfil(u) {
  const c = {tel: PRATICIEN.tel, email: PRATICIEN.email, cp: PRATICIEN.cp, ville: PRATICIEN.ville, ...pstate().coords};
  const coords = coordsEdit ? `<form data-form="coords" novalidate><div id="form-errors"></div><div class="form-grid">
      <div class="field"><label for="co-tel">Téléphone</label><input id="co-tel" name="tel" inputmode="tel" autocomplete="tel" value="${esc(c.tel)}"></div>
      <div class="field"><label for="co-email">Email de contact</label><input id="co-email" name="email" type="email" autocomplete="email" spellcheck="false" autocapitalize="off" value="${esc(c.email)}"><small id="co-email-help">C’est l’adresse où Laska vous joint. Votre email de connexion ne change pas.</small></div>
      <div class="field"><label for="co-cp">Code postal</label><input id="co-cp" name="cp" inputmode="numeric" autocomplete="postal-code" maxlength="5" required value="${esc(c.cp)}"></div>
      <div class="field"><label for="co-ville">Ville</label><input id="co-ville" name="ville" autocomplete="address-level2" value="${esc(c.ville)}"></div></div>
      <div class="pp-actions"><button type="submit" class="btn btn-primary">Enregistrer</button><button type="button" class="btn btn-outline" data-coords-cancel>Annuler</button></div></form>`
    : `<dl class="pp-pairs is-stack"><div><dt>Téléphone</dt><dd>${esc(c.tel)}</dd></div><div><dt>Email</dt><dd>${esc(c.email)}</dd></div><div><dt>Code postal et ville</dt><dd>${esc(c.cp)} ${esc(c.ville)}</dd></div></dl><button type="button" class="btn btn-outline pp-sm" data-coords-edit>${icon('pen')}Modifier mes coordonnées</button>`;
  return `<header class="pp-head">${eyebrow('Votre profil')}<h1 tabindex="-1">${dot(`Dr ${esc(u.firstName)} ${esc(u.lastName)}.`)}</h1><p class="pp-head-sub">${PRATICIEN.specialite}</p><p>Ce que Laska a enregistré à votre sujet — vos coordonnées et votre mot de passe se modifient ici.</p></header>
    ${card('Vos coordonnées', coords)}${contactCard()}
    ${card('Votre situation professionnelle', `<dl class="pp-pairs is-stack"><div><dt>Numéro RPPS</dt><dd>${PRATICIEN.rpps || 'Aucun numéro RPPS enregistré chez Laska.'}</dd></div><div><dt>Inscription à l’Ordre</dt><dd>Depuis le ${dateLongue(PRATICIEN.ordre)}</dd></div><div><dt>Mode d’exercice</dt><dd>${PRATICIEN.exercice}</dd></div></dl><p class="pp-muted">Ces informations conditionnent votre éligibilité aux missions : elles sont vérifiées et gérées par Laska, vous ne pouvez pas les modifier vous-même.</p><p class="pp-muted">Une information à corriger ? ${arrowLink('#/espace/messages', `Écrire à ${PP_CONTACT.prenom}`)}</p>`)}
    ${card('Mot de passe', `<form data-form="pw" novalidate><div id="form-errors"></div><div class="form-grid">${passwordField('pwOld', 'Mot de passe actuel')}${passwordField('pwNew', 'Nouveau mot de passe', {autocomplete: 'new-password', min: 8})}${passwordField('pwNew2', 'Confirmer le nouveau mot de passe', {autocomplete: 'new-password', min: 8})}</div><div class="pp-actions"><button type="submit" class="btn btn-primary">Changer mon mot de passe</button></div></form>`)}
    ${privacy()}`;
}

/* ───────────── Écrans : Notifications et Messages ───────────── */
function screenNotifs() {
  const list = parDate(notifs()), n = list.filter(x => !x.lu).length;
  return `${pageHead('Ce qui a bougé', 'Notifications', 'Cliquez une entrée pour ouvrir l’écran concerné.')}
    ${n ? `<div class="pp-notifs-bar"><p>${nonLues(n)} sur ${list.length}</p><button type="button" class="pp-link" data-notif-all>${icon('check')}Tout marquer comme lu</button></div>` : ''}
    ${list.length ? `<ul class="pp-notifs">${list.map(n => `<li><a class="pp-notif ${n.lu ? '' : 'is-unread'}" href="${n.vers}" data-notif="${n.id}"><span class="pp-notif-ico" aria-hidden="true">${icon(notifIcon(n))}</span><span class="pp-notif-main"><span class="pp-notif-top"><strong>${esc(n.titre)}</strong><time datetime="${n.quand}">${horoNotif(n.quand)}</time></span>${n.texte ? `<span class="pp-notif-text">${esc(n.texte)}</span>` : ''}</span>${n.lu ? '' : '<span class="pp-unread"><span class="sr-only">Non lue</span></span>'}</a></li>`).join('')}</ul>`
      : card('', '<p class="pp-muted">Rien pour l’instant — vous serez prévenu ici quand quelque chose bouge : proposition, heures, contrat, dossier.</p>')}`;
}
function screenMessages() {
  const reply = replyTo && allMessages().find(x => x.id === replyTo);
  const items = allMessages().map(x => `<li class="pp-msg ${x.sens === 'envoye' ? 'is-me' : ''}" id="msg-${x.id}"><p class="pp-msg-meta">${x.sens === 'envoye' ? 'Vous' : `${esc(x.de)}, Laska`} · ${horoMsg(x.quand)}</p>${x.objet ? `<p class="pp-msg-objet">${esc(x.objet)}</p>` : ''}${x.reponseA ? `<p class="pp-muted">En réponse à « ${esc(x.reponseA)} »</p>` : ''}<p class="pp-msg-body">${esc(x.texte)}</p>
    ${x.pieces?.length ? `<ul class="pp-attach">${x.pieces.map(([n, t]) => `<li>${icon('file')}<span><strong>${esc(n)}</strong>${esc(t)}</span></li>`).join('')}</ul>` : ''}${x.sens === 'recu' ? `<button type="button" class="pp-link" data-reply="${x.id}">Répondre</button>` : ''}</li>`).join('');
  const pending = msgPending ? `<li class="pp-msg is-me is-pending" aria-live="polite"><p class="pp-msg-meta">Vous · maintenant</p><p class="pp-msg-body">${esc(msgPending.texte)}</p><p class="pp-pending">Votre message part dans <b data-countdown>${Math.max(0, Math.ceil((msgPending.until - Date.now()) / 1000))}</b> s. <button type="button" class="pp-link" data-msg-cancel>Annuler</button></p></li>` : '';
  return `${pageHead('Vos échanges avec Laska', 'Messages', 'Ce que votre contact vous écrit, et ce que vous lui répondez. Joignez un fichier si besoin : Laska le reçoit directement.')}
    <ol class="pp-thread" aria-label="Le fil">${items}${pending}</ol>
    <form class="pp-card pp-compose" data-form="msg" novalidate><div id="form-errors"></div><h2 class="pp-card-title">Écrire à ${PP_CONTACT.prenom}</h2>
      ${reply ? `<p class="pp-replying">En réponse à « ${esc(reply.objet || '')} » <button type="button" class="pp-x" data-reply-clear aria-label="Ne plus répondre à ce message">${icon('close')}</button></p>` : ''}
      <div class="field full"><label for="msg-text">Votre message</label><textarea id="msg-text" name="texte" rows="4" maxlength="2000" required data-min="2" data-min-msg="Écrivez votre message." placeholder="Une question, une précision sur vos dates, un document à transmettre…">${esc(msgDraft)}</textarea></div>
      ${msgFiles.length ? `<ul class="pp-attach is-draft" aria-label="Pièces jointes">${msgFiles.map((f, i) => `<li>${icon('file')}<span>${esc(f)}</span><button type="button" class="pp-x" data-file-remove="${i}" aria-label="Retirer ${esc(f)}">${icon('close')}</button></li>`).join('')}</ul>` : ''}
      <div class="pp-actions"><label class="btn btn-outline pp-sm pp-upload">${icon('clip')}Joindre un fichier<input type="file" class="sr-only" multiple accept="application/pdf,image/jpeg,image/png,image/webp" data-msg-files></label><button type="submit" class="btn btn-primary pp-sm" ${msgPending ? 'disabled' : ''}>${icon('send')}Envoyer</button></div>
      <p class="pp-muted">PDF ou photo (JPEG, PNG, WEBP), 10 Mo par fichier, cinq au plus. Votre message part 10 secondes après le clic, le temps de l’annuler.</p>
      <p class="pp-muted">Pour un document de votre dossier (diplôme, RIB…), vous pouvez aussi le déposer à sa place dans <a class="pp-link" href="#/espace/documents">Mes documents</a>.</p></form>`;
}
const screenLost = () => `${card('', `<p class="pp-status-title">Cette page n’existe pas dans votre espace Laska.</p><p class="pp-muted">Vérifiez l’adresse, ou retournez à votre accueil.</p>${arrowLink('#/espace', 'Retour à l’accueil', 'btn btn-primary pp-sm')}`)}`;

/* ───────────── Page : connexion ou espace ───────────── */
/* États d’écran (formulaires ouverts, brouillons) : remis à zéro quand on change d’écran. */
let routeOpen = '', avisEdit = '', contestOpen = '', dispoEdit = '', coordsEdit = false, docsOpen = false, joursOpen = [], replyTo = '';
let msgDraft = '', msgFiles = [], msgPending = null, countdown = 0, lastScreen = '';
function espacePage() {
  const u = espaceUser(); if (!u) return espaceLoginPage();
  const r = espaceRoute(), here = `${r.sub}/${r.id}/${r.extra}`;
  if (here !== lastScreen) { routeOpen = avisEdit = contestOpen = dispoEdit = ''; coordsEdit = docsOpen = false; joursOpen = []; lastScreen = here; }
  const v = resolveScreen(u, r);
  document.title = `${v.title} — Espace praticien Laska`;
  return `<div class="container pp-shell">${topbar(u)}${rail(r.sub)}<div class="pp-main" data-screen="${r.sub || 'accueil'}">${v.html}</div></div>`;
}
function resolveScreen(u, r) {
  const m = missionById(r.id), p = PIECES.find(x => x.code === r.id);
  switch (r.sub) {
    case '': return {html: screenAccueil(u), title: 'Accueil'};
    case 'missions': return !r.id ? {html: screenMissions(), title: 'Mes missions'} : m ? {html: r.extra === 'contrat' ? screenContrat(m) : screenMission(m), title: 'Détail de la mission'} : {html: screenLost(), title: 'Page introuvable'};
    case 'proposition': return {html: screenProposition(), title: 'Répondre à la proposition'};
    case 'heures': return {html: screenHeures(), title: 'Mes heures'};
    case 'disponibilites': return {html: screenDispos(), title: 'Mes disponibilités'};
    case 'documents': return !r.id ? {html: screenDocuments(), title: 'Mes documents'} : p ? {html: screenPiece(pieceOf(p)), title: 'Détail du document'} : {html: screenLost(), title: 'Page introuvable'};
    case 'profil': return {html: screenProfil(u), title: 'Mon profil'};
    case 'notifications': return {html: screenNotifs(), title: 'Notifications'};
    case 'messages': return {html: screenMessages(), title: 'Messages'};
    default: return {html: screenLost(), title: 'Page introuvable'};
  }
}
/* Connexion, comme la référence : une carte, l’email, le mot de passe, et à qui écrire en cas d’oubli. */
function espaceLoginPage() {
  return `<section class="pp-login"><div class="container"><div class="form-card pp-login-card" id="login-card">${loginCard()}</div></div></section>`;
}
function passwordField(name, label, {autocomplete = 'current-password', help = '', min = 6} = {}) {
  return `<div class="field full password-field"><label for="${name}">${label}</label><div class="password-row"><input id="${name}" name="${name}" type="password" required autocomplete="${autocomplete}" data-min="${min}" data-min-msg="Le mot de passe compte au moins ${min} caractères." ${help ? `aria-describedby="${name}-help"` : ''}><button type="button" class="password-toggle" data-reveal-password="${name}" aria-pressed="false" aria-label="Afficher le mot de passe">${icon('eye')}</button></div><p class="caps-hint" hidden>${icon('bolt')}Les majuscules sont activées.</p>${help ? `<small id="${name}-help">${help}</small>` : ''}</div>`;
}
function loginCard() {
  return `<div class="pp-login-head">${wolfMark('pp-login-wolf')}<p class="pp-login-brand">Laska</p><h1 id="login-title" tabindex="-1">Connectez-vous à votre espace.</h1></div>
    <form id="login-form" class="login-form" novalidate aria-labelledby="login-title"><div id="form-errors"></div><div class="form-grid"><div class="field full"><label for="loginEmail">Email</label><input id="loginEmail" name="loginEmail" type="email" required autocomplete="username" spellcheck="false" autocapitalize="off"></div>${passwordField('loginPassword', 'Mot de passe')}</div>
      <p class="pp-muted">Mot de passe oublié ? Écrivez à <a class="pp-link" href="mailto:${MAIL}">${MAIL}</a> — l’équipe Laska peut régénérer votre accès.</p>
      <div class="form-actions"><button type="submit" class="btn btn-primary btn-full">${icon('logout', 'pp-flip')}Se connecter</button></div></form>
    ${MAQUETTE ? sampleNote(ESPACE_OUVERT ? 'Maquette : saisissez n’importe quelle adresse email et un mot de passe de 6 caractères ou plus. Rien n’est envoyé ni gardé.' : 'Maquette : l’espace praticien n’est pas encore ouvert. Rien n’est envoyé ni gardé.') : ''}`;
}
/* Tentative de connexion tant que l’espace n’est pas ouvert (ESPACE_OUVERT à false). */
const loginSoon = () => `<div class="success-state login-soon"><span class="soon-symbol" aria-hidden="true">${icon('clock')}</span><h2 tabindex="-1">${dot('Votre espace arrive bientôt.')}</h2>
  <p class="space-lead">La connexion à l’espace praticien n’est pas encore ouverte. Vous pourrez vous connecter ici dès son lancement.</p>
  <p class="space-lead">En attendant, votre conseiller répond à vos questions.</p>
  <div class="actions"><a class="btn btn-primary" href="${TEL}">${icon('phone')}${PHONE}</a></div></div>`;

/* ───────────── Interactions ───────────── */
/* Après une action : la page se redessine sur place (sans remonter), puis le focus va où l’action mène. */
function rerender(focus = '') {
  render(false);
  if (focus) requestAnimationFrame(() => { const el = document.querySelector(focus); if (el) { el.focus({preventScroll: true}); el.scrollIntoView({block: 'nearest'}); } });
}
const fileOk = f => /\.(pdf|jpe?g|png|webp|heic|heif)$/i.test(f.name) && f.size <= 10 * 1048576;
function downloadContrat(m) {
  const doc = `<!doctype html><html lang="fr"><meta charset="utf-8"><title>Contrat — ${esc(etabNom(m))}</title><body style="font-family:system-ui,sans-serif;max-width:760px;margin:40px auto;line-height:1.6">${contratDocHTML(m, signatureOf(m).statut === 'papier' ? {} : signatureOf(m), PRATICIEN)}</body></html>`;
  const a = document.createElement('a'), url = URL.createObjectURL(new Blob([doc], {type: 'text/html;charset=utf-8'}));
  a.href = url; a.download = `contrat-${PRATICIEN.nom.toLowerCase()}-${m.id}.html`; document.body.append(a); a.click(); a.remove(); URL.revokeObjectURL(url);
}
function sendMessage() {
  const {texte, pieces: pj, reponseA} = msgPending; msgPending = null;
  pstate().messages.push({id: `x${Date.now()}`, sens: 'envoye', quand: nowStamp(), texte, reponseA, pieces: pj.map(n => [n, 'pièce jointe'])}); ppSave();
  if (espaceRoute().sub === 'messages' && route === '/espace') rerender('#msg-text');
}
/* Déconnexion : depuis l’initiale (en-tête) ou « Se déconnecter », comme la référence. */
document.addEventListener('click', e => {
  if (!e.target.closest('[data-logout]')) return;
  const was = location.hash; espaceLogout(); location.hash = '/espace'; if (was === '#/espace') render();
  toast('Vous êtes déconnecté. À bientôt !', {icon: 'logout'});
});
function bindEspace(root = document) {
  const card = $('#login-card', root);
  if (card) bindLogin(card);
  const main = $('.pp-main', root); if (!main) return;
  bindDates(main);
  const r = espaceRoute(), voir = r.q.get('voir');
  if (voir) requestAnimationFrame(() => document.getElementById(`voir-${voir}`)?.scrollIntoView({block: 'start'}));
  clearInterval(countdown);
  if (msgPending) countdown = setInterval(() => { const b = $('[data-countdown]'); if (!msgPending || !b) return clearInterval(countdown); b.textContent = Math.max(0, Math.ceil((msgPending.until - Date.now()) / 1000)); }, 250);
  const P = pstate();
  main.addEventListener('input', e => { clearError(e.target); if (e.target.id === 'msg-text') msgDraft = e.target.value; });
  main.addEventListener('toggle', e => { if (e.target.matches?.('[data-docs-fold]')) docsOpen = e.target.open; }, true);
  main.addEventListener('change', e => {
    clearError(e.target);
    const up = e.target.closest('[data-upload]');
    if (up) { const file = up.files[0]; if (!file) return; if (!fileOk(file)) { toast('Ce fichier ne passe pas : choisissez un PDF ou une photo de moins de 10 Mo.', {icon: 'close'}); up.value = ''; return; }
      P.docs[up.dataset.upload] = {nom: file.name, le: TODAY}; ppSave(); rerender('.pp-head h1'); toast('Fichier déposé : Laska le vérifie.', {icon: 'file'}); return; }
    if (e.target.matches('[data-msg-files]')) { const files = [...e.target.files], bad = files.filter(f => !fileOk(f));
      if (bad.length) toast(`${bad.length > 1 ? 'Ces fichiers ne passent pas' : 'Ce fichier ne passe pas'} : PDF ou photo de moins de 10 Mo.`, {icon: 'close'});
      msgFiles = [...msgFiles, ...files.filter(fileOk).map(f => f.name)].slice(0, 5); rerender('#msg-text'); }
  });
  main.addEventListener('click', e => {
    const t = e.target.closest('button, a'); if (!t) return;
    const d = t.dataset;
    if (d.ask !== undefined) { $('#ask-answer', main).innerHTML = `<p class="pp-ask-q">${esc(ASK[d.ask])}</p><p>${askAnswer(Number(d.ask))}</p><p class="pp-muted">Réponse automatique — votre recruteuse reste votre interlocutrice.</p>`; return; }
    if (d.route) { routeOpen = routeOpen === d.route ? '' : d.route; rerender('[data-route]'); return; }
    if (d.download) { downloadContrat(missionById(d.download)); toast('Contrat téléchargé.', {icon: 'file'}); return; }
    if (d.copyAddress) { (navigator.clipboard?.writeText(d.copyAddress) || Promise.reject()).then(() => toast('Adresse copiée.', {icon: 'pin'}), () => toast(d.copyAddress, {icon: 'pin'})); return; }
    if (d.justificatif) { toast(`${d.justificatif} — maquette : l’aperçu du fichier n’est pas disponible.`, {icon: 'file'}); return; }
    if (d.avisEdit) { avisEdit = d.avisEdit; rerender('#voir-avis input'); return; }
    if ('avisCancel' in d) { avisEdit = ''; rerender('#voir-avis'); return; }
    if (d.contestOpen) { contestOpen = d.contestOpen; rerender('#ct-jour'); return; }
    if ('contestCancel' in d) { contestOpen = ''; rerender('[data-contest-open]'); return; }
    if (d.jours) { joursOpen = joursOpen.includes(d.jours) ? joursOpen.filter(x => x !== d.jours) : [...joursOpen, d.jours]; rerender(`[data-jours="${d.jours}"]`); return; }
    if ('dispoAdd' in d) { dispoEdit = 'new'; rerender('#dispo-debut'); return; }
    if (d.dispoEdit) { dispoEdit = d.dispoEdit; rerender('#dispo-debut'); return; }
    if ('dispoCancel' in d) { dispoEdit = ''; rerender('[data-dispo-add]'); return; }
    if (d.dispoDel) { const x = P.dispos.find(y => y.id === d.dispoDel);
      askChoice({title: 'Supprimer cette disponibilité ?', text: `${plage(x.debut, x.fin)} — cette disponibilité sera définitivement supprimée.`, choices: [{label: 'Supprimer', run: () => { P.dispos = P.dispos.filter(y => y.id !== x.id); ppSave(); rerender('.pp-head h1'); }}, {label: 'Annuler', run: () => {}}]}); return; }
    if ('coordsEdit' in d) { coordsEdit = true; rerender('#co-tel'); return; }
    if ('coordsCancel' in d) { coordsEdit = false; rerender('[data-coords-edit]'); return; }
    if (d.revealPassword) { const input = $(`#${d.revealPassword}`, main), show = input.type === 'password'; input.type = show ? 'text' : 'password'; t.setAttribute('aria-pressed', show); t.setAttribute('aria-label', show ? 'Masquer le mot de passe' : 'Afficher le mot de passe'); t.innerHTML = icon(show ? 'eyeOff' : 'eye'); input.focus(); return; }
    if (d.notif) { if (!P.lus.includes(d.notif)) { P.lus.push(d.notif); ppSave(); } return; }
    if (d.reply) { replyTo = d.reply; rerender('#msg-text'); return; }
    if ('replyClear' in d) { replyTo = ''; rerender('#msg-text'); return; }
    if ('msgCancel' in d) { clearTimeout(msgPending.timer); msgDraft = msgPending.texte; msgFiles = msgPending.pieces; msgPending = null; rerender('#msg-text'); toast('Envoi annulé : votre message n’est pas parti.', {icon: 'close'}); return; }
    if (d.fileRemove !== undefined) { msgFiles.splice(Number(d.fileRemove), 1); rerender('#msg-text'); return; }
  });
  main.addEventListener('submit', e => {
    const f = e.target.closest('form[data-form]'); if (!f) return;
    e.preventDefault();
    const kind = f.dataset.form, val = n => (f.elements[n]?.value || '').trim();
    if (kind === 'ask') { const q = val('q'); if (!q) return;
      $('#ask-answer', main).innerHTML = `<p class="pp-ask-q">${esc(q)}</p><p>Je transmets votre question à ${PP_CONTACT.prenom}, votre contact chez Laska : elle vous répond dans Messages.</p><p class="pp-muted">Réponse automatique — votre recruteuse reste votre interlocutrice.</p>`; f.reset(); return; }
    if (!validate(f)) return;
    if (kind === 'contest') { const mid = f.dataset.mid; P.contestations[mid] = {jour: val('jour'), debut: val('debut'), fin: val('fin'), message: val('message'), le: nowStamp()}; contestOpen = ''; ppSave(); rerender(`#voir-releve-${mid}`); toast('Contestation envoyée à Laska.', {icon: 'send'}); return; }
    if (kind === 'avis') { const mid = f.dataset.mid, a = {mot: val('mot'), le: TODAY}; AVIS_Q.forEach(([k]) => { a[k] = f.querySelector(`[name="avis_${k}"]:checked`)?.value || ''; }); P.avis[mid] = a; avisEdit = ''; ppSave(); rerender('#voir-avis'); toast('Merci : votre avis est arrivé chez Laska.'); return; }
    if (kind === 'dispo') { const id = f.dataset.id, debut = val('debut'), fin = val('fin');
      if (P.dispos.some(x => x.id !== id && x.debut === debut && x.fin === fin)) { toast('Une période est déjà enregistrée sur exactement ces dates.', {icon: 'close'}); return; }
      if (id) Object.assign(P.dispos.find(x => x.id === id), {debut, fin, commentaire: val('commentaire')}); else P.dispos.push({id: `d${Date.now()}`, debut, fin, commentaire: val('commentaire')});
      dispoEdit = ''; ppSave(); rerender('.pp-head h1'); return; }
    if (kind === 'coords') { if (!/^\d{5}$/.test(val('cp'))) { toast('Le code postal compte 5 chiffres.', {icon: 'close'}); f.elements.cp.focus(); return; }
      P.coords = {tel: val('tel'), email: val('email'), cp: val('cp'), ville: val('ville')}; coordsEdit = false; ppSave(); rerender('[data-coords-edit]'); toast('Coordonnées mises à jour — Laska les voit immédiatement.'); return; }
    if (kind === 'pw') { if (val('pwNew') !== val('pwNew2')) { toast('Les deux nouveaux mots de passe ne sont pas identiques.', {icon: 'close'}); f.elements.pwNew2.focus(); return; }
      f.reset(); toast('Mot de passe modifié.', {icon: 'shield'}); return; }
    if (kind === 'msg') { const reply = replyTo && allMessages().find(x => x.id === replyTo);
      msgPending = {texte: val('texte'), pieces: [...msgFiles], reponseA: reply?.objet || '', until: Date.now() + 10000, timer: setTimeout(sendMessage, 10000)}; msgDraft = ''; msgFiles = []; replyTo = ''; rerender('[data-msg-cancel]'); }
  });
}
function bindLogin(card) {
  const form = $('#login-form', card); if (!form) return;
  form.addEventListener('input', e => clearError(e.target));
  card.addEventListener('click', e => {
    const t = e.target.closest('[data-reveal-password]'); if (!t) return;
    const input = $(`#${t.dataset.revealPassword}`, card), show = input.type === 'password'; input.type = show ? 'text' : 'password'; t.setAttribute('aria-pressed', show); t.setAttribute('aria-label', show ? 'Masquer le mot de passe' : 'Afficher le mot de passe'); t.innerHTML = icon(show ? 'eyeOff' : 'eye'); input.focus();
  });
  form.addEventListener('submit', e => {
    e.preventDefault(); if (!validate(form)) return;
    const submit = $('[type=submit]', form);
    submit.disabled = true; submit.classList.add('is-loading'); submit.innerHTML = '<span class="btn-spinner" aria-hidden="true"></span>Connexion en cours…';
    setTimeout(() => {
      if (!ESPACE_OUVERT) { card.innerHTML = loginSoon(); $('h2', card).focus(); return; }
      espaceLogin($('#loginEmail', form).value.trim());
      render(false); $('.pp-main h1')?.focus({preventScroll: true});
    }, 650);
  });
}
