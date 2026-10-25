/* Laska Corporate — espace candidat (v7).
   Les menus reprennent ceux d’un espace intérimaire de référence : onglets « Page d’accueil », « Mon profil »,
   « Questions fréquentes », « Déconnexion » ; un bloc Messages ; huit tuiles et leurs sous-menus.
   Maquette : connexion simulée (n’importe quel email, mot de passe de 6 caractères ou plus, jamais gardé),
   praticienne d’exemple et données FICTIVES. Production : authentification réelle (mot de passe haché côté serveur,
   session en cookie httpOnly), données lues dans le CRM et le logiciel de paie.
   Chargé avant app.js ; ne contient que des définitions, appelées au rendu. En Next.js : un segment /espace protégé
   par un middleware, avec <SpaceBand>, <SpaceTile>, <Planning>, <ContractList>, <ProfileCard>. */

/* ───────────── Session (simulée) ───────────── */
const SESSION_KEY = 'laska-session';
function espaceUser() {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY) || 'null'); } catch { return null; }
}
function espaceLogin(email, remember) {
  const user = {email, firstName: ESPACE_PROFILE.prenom, lastName: ESPACE_PROFILE.nom, since: new Date().toISOString()};
  try { (remember ? localStorage : sessionStorage).setItem(SESSION_KEY, JSON.stringify(user)); } catch {}
  return user;
}
function espaceLogout() { try { localStorage.removeItem(SESSION_KEY); sessionStorage.removeItem(SESSION_KEY); } catch {} }
const initials = u => `${(u.firstName || '?')[0]}${(u.lastName || '')[0] || ''}`.toUpperCase();
const store = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key) || 'null') ?? fallback; } catch { return fallback; } };
const keep = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} };

/* ───────────── Données d’EXEMPLE (fictives) ───────────── */
const addDays = (iso, n) => { const d = asDate(iso); d.setDate(d.getDate() + n); return isoOf(d.getFullYear(), d.getMonth(), d.getDate()); };
const mondayOf = iso => addDays(iso, -((asDate(iso).getDay() + 6) % 7));
/* Calculées à la première utilisation : les outils de dates viennent d’app.js, chargé après ce fichier. */
const lazy = build => { let v; return () => v ??= build(); };
const yearNow = () => year(TODAY);
const ESPACE_PROFILE = {
  civilite: 'Madame', nom: 'Mansouri', nomJeuneFille: '', prenom: 'Sarah', tel1: '06 12 34 56 78', tel2: '',
  naissance: '1989-04-12', lieuNaissance: 'Sfax', depNaissance: '99 – Étranger', paysNaissance: 'Tunisie', nationalite: 'Tunisienne', mobilite: 'Auvergne-Rhône-Alpes, Provence-Alpes-Côte d’Azur',
  app: '', bat: '', voie: '12 rue des Tilleuls', lieuDit: '', cp: '69003', ville: 'Lyon', pays: 'France',
  paiement: 'Virement France et DOM-TOM', bic: 'BANKFRPP', iban: 'FR76 0000 0000 0000 0000 0000 123'
};
const PROFILE_KEY = 'laska-espace-profil';
const profile = () => ({...ESPACE_PROFILE, ...store(PROFILE_KEY, {})});
/* Missions et contrats datés par rapport à la semaine en cours : la démonstration reste vivante quel que soit le jour.
   [décalage depuis le lundi de cette semaine, type, spécialité, lieu, contrat] */
const missions = lazy(() => { const base = mondayOf(TODAY); return [
  [-25, 'Garde 24 h', 'Médecine d’urgence', 'Centre hospitalier · Sarthe (72)', 'CM-0371'],
  [-10, 'Journée 10 h', 'Médecine générale', 'Centre de santé · Côtes-d’Armor (22)', 'CM-0388'],
  [-9, 'Journée 10 h', 'Médecine générale', 'Centre de santé · Côtes-d’Armor (22)', 'CM-0388'],
  [1, 'Journée 12 h', 'Médecine d’urgence', 'Clinique privée · Bouches-du-Rhône (13)', 'CM-0405'],
  [3, 'Garde 24 h', 'Médecine d’urgence', 'Clinique privée · Bouches-du-Rhône (13)', 'CM-0405'],
  [5, 'Journée 12 h', 'Médecine d’urgence', 'Clinique privée · Bouches-du-Rhône (13)', 'CM-0405'],
  [8, 'Garde 24 h', 'Médecine d’urgence', 'Centre hospitalier · Rhône (69)', 'CM-0412'],
  [12, 'Nuit 12 h', 'Médecine d’urgence', 'Centre hospitalier · Rhône (69)', 'CM-0412'],
  [19, 'Garde 24 h', 'Médecine d’urgence', 'Centre hospitalier · Rhône (69)', 'CM-0412'],
  [-40, 'Journée 7 h', 'Formation AFGSU niveau 2', 'Organisme de formation · Lyon (69)', 'CF-0051'],
  [-39, 'Journée 7 h', 'Formation AFGSU niveau 2', 'Organisme de formation · Lyon (69)', 'CF-0051']
].map(([off, type, spec, place, ref]) => ({date: addDays(base, off), type, spec, place, ref: `${ref.slice(0, 2)}-${yearNow()}-${ref.slice(3)}`})); });
/* Contrats : leurs dates viennent de leurs missions ; une fois la dernière passée, un contrat signé devient « Terminé ». */
const baseContracts = lazy(() => [
  ['CM-0412', 'mission', 'Médecine d’urgence · gardes et nuit', 'sign'],
  ['CM-0405', 'mission', 'Médecine d’urgence · journées et garde', 'signed'],
  ['CM-0388', 'mission', 'Médecine générale · journées 10 h', 'signed'],
  ['CM-0371', 'mission', 'Médecine d’urgence · garde 24 h', 'signed'],
  ['CF-0051', 'formation', 'Formation AFGSU niveau 2', 'signed']
].map(([short, kind, title, status]) => { const ref = `${short.slice(0, 2)}-${yearNow()}-${short.slice(3)}`, days = missions().filter(m => m.ref === ref).map(m => m.date).sort();
  return {ref, kind, title, place: missions().find(m => m.ref === ref).place, from: days[0], to: days.at(-1), status}; }));
const SIGNED_KEY = 'laska-espace-signes', READ_KEY = 'laska-espace-lus', ADVANCE_KEY = 'laska-espace-acomptes';
const spaceContracts = () => { const signed = store(SIGNED_KEY, []); return baseContracts().map(c => { const status = signed.includes(c.ref) ? 'signed' : c.status; return {...c, status: status === 'signed' && c.to < TODAY ? 'done' : status}; }); };
const toSign = () => spaceContracts().filter(c => c.status === 'sign');
const messages = lazy(() => [
  {id: 'm1', when: 0, text: 'Votre contrat de mission au centre hospitalier du Rhône est prêt : signez-le en ligne.', link: '#/espace/contrats?vue=signer', label: 'Signer le contrat'},
  {id: 'm2', when: -1, text: 'Nouvelle offre compatible avec votre profil : Médecine d’urgence, Rhône (69).', link: '#/offre/MU-69-1', label: 'Voir l’offre'},
  {id: 'm3', when: -6, text: 'Bienvenue dans votre espace candidat. Je reste joignable du lundi au vendredi, de 9 h à 18 h : n’hésitez pas à m’appeler.', link: '', label: ''}
].map(m => ({...m, date: addDays(TODAY, m.when)})));

/* Conseillère d’EXEMPLE (fictive) : en production, le chargé de recrutement du praticien, lu dans le CRM. */
const ADVISOR = {prenom: 'Inès', nom: 'Martin', role: 'Votre conseillère Laska Corporate'};

/* Justificatifs du dossier : état (à jour, à renouveler, à fournir, en vérification) et validité. EXEMPLES.
   Le praticien dépose une pièce : elle passe « en vérification » (gardée dans ce navigateur, le fichier n’est pas envoyé). */
const DOCS_KEY = 'laska-espace-justificatifs';
const baseDocs = lazy(() => [
  ['identite', 'Pièce d’identité ou titre de séjour', 'ok', addDays(TODAY, 1460)],
  ['diplome', 'Diplôme de docteur en médecine', 'ok', ''],
  ['autorisation', 'Autorisation d’exercice', 'ok', ''],
  ['rpps', 'Attestation RPPS ou d’inscription à l’Ordre', 'missing', ''],
  ['vaccins', 'Certificat de vaccinations', 'expiring', addDays(TODAY, 24)],
  ['afgsu', 'Attestation de formation aux gestes d’urgence (AFGSU 2)', 'ok', addDays(TODAY, 1180)],
  ['secu', 'Attestation de sécurité sociale', 'ok', ''],
  ['rib', 'RIB', 'ok', ''],
  ['cv', 'CV', 'ok', '']
].map(([key, label, status, until]) => ({key, label, status, until})));
const spaceDocs = () => { const sent = store(DOCS_KEY, {}); return baseDocs().map(d => sent[d.key] ? {...d, status: 'review', file: sent[d.key]} : d); };
const docsToDo = () => spaceDocs().filter(d => d.status === 'missing' || d.status === 'expiring');
const daysUntil = iso => Math.round((asDate(iso) - asDate(TODAY)) / 864e5);

/* Disponibilités déclarées par le praticien, jour par jour ('dispo' ou 'off'), sur les 4 semaines à venir. */
const DISPO_KEY = 'laska-espace-dispos';
const dispos = () => store(DISPO_KEY, {});

/* Candidatures envoyées depuis les offres : 4 étapes, de l’envoi à la réponse. EXEMPLES. */
const APP_STEPS = ['Envoyée', 'En étude', 'Présentée à l’établissement', 'Retenue'];
const applications = lazy(() => [
  {offer: 'MU-69-1', date: addDays(TODAY, -3), step: 1},
  {offer: 'AR-13-1', date: addDays(TODAY, -9), step: 2},
  {offer: 'MG-85-1', date: addDays(TODAY, -21), step: 3}
].filter(a => offers.some(o => o.id === a.offer)));

/* ───────────── Menus (repris de l’espace de référence) ─────────────
   Les rubriques de l’espace de référence (onglets et tuiles) sont toutes là, rangées dans un menu latéral en
   quatre groupes ; leurs sous-menus deviennent les onglets de chaque page. L’accueil ne montre plus que l’essentiel. */
const SPACE_NAV = [
  ['', [['', 'Accueil', 'home']]],
  ['Mon activité', [['planning', 'Mon planning', 'calendar'], ['contrats', 'Mes contrats', 'file'], ['offres', 'Mes offres d’emploi', 'briefcase']]],
  ['Ma paie et mes papiers', [['paie', 'Ma paie et mes acomptes', 'euro'], ['documents', 'Mes impressions de documents', 'print'], ['fiscal', 'Mes données fiscales', 'receipt']]],
  ['Mon dossier', [['profil', 'Mon profil', 'user'], ['justificatifs', 'Mes justificatifs', 'badge']]],
  ['Infos utiles', [['securite', 'Sécurité prévention', 'shield'], ['avantages', 'Mes avantages', 'gift'], ['faq', 'Questions fréquentes', 'chat']]]
];
/* Sous-menus de l’espace de référence (repris en onglets dans chaque page). */
const TILES = [
  {key: 'paie', title: 'Ma paie et mes acomptes', icon: 'euro', tone: 'teal', note: 'Votre premier bulletin de salaire en version électronique sera accessible ici.'},
  {key: 'planning', title: 'Mon planning', icon: 'calendar', tone: 'coral', items: [['Semaine', 'planning?vue=semaine'], ['Mois', 'planning?vue=mois'], ['Mes disponibilités', 'planning?vue=dispos']]},
  {key: 'documents', title: 'Mes impressions de documents', icon: 'print', tone: 'sand', items: [['Certificat de travail', 'documents?doc=certificat'], ['Attestation de salaire', 'documents?doc=attestation']]},
  {key: 'offres', title: 'Mes offres d’emploi', icon: 'briefcase', tone: 'ink', items: [['Intérim', 'offres?type=interim'], ['CDD, CDI', 'offres?type=cdi'], ['Mes candidatures', 'offres?type=candidatures']]},
  {key: 'contrats', title: 'Mes contrats', icon: 'file', tone: 'coral', items: [['Historique de mes contrats', 'contrats?vue=historique'], ['Mes contrats de mission', 'contrats?vue=mission'], ['Mes contrats de mission – formation', 'contrats?vue=formation'], ['Signer mes contrats électroniques', 'contrats?vue=signer']]},
  {key: 'fiscal', title: 'Mes données fiscales', icon: 'receipt', tone: 'ink', note: '', year: true},
  {key: 'securite', title: 'Sécurité prévention', icon: 'shield', tone: 'teal', items: [['Réalisez votre mission en toute sécurité', 'securite']]},
  /* Ajout (hors espace de référence) : les pièces du dossier, demandées avant chaque mission. */
  {key: 'justificatifs', title: 'Mes justificatifs', icon: 'badge', tone: 'teal', items: [['Pièces de mon dossier', 'justificatifs']]},
  {key: 'avantages', title: 'Mes avantages', icon: 'gift', tone: 'sand', items: [['Mes avantages', 'avantages?doc=avantages'], ['Mes droits sur la prévoyance : Cadre', 'avantages?doc=prevoyance-cadre'], ['Mes droits sur la prévoyance : Non cadre', 'avantages?doc=prevoyance-non-cadre'], ['Site du FASTT', 'avantages?doc=fastt'], ['Notice information Mutuelle : Cadre', 'avantages?doc=mutuelle-cadre'], ['Notice information Mutuelle : Non cadre', 'avantages?doc=mutuelle-non-cadre'], ['Consulter le règlement intérieur', 'avantages?doc=reglement']]}
];
const tileOf = key => TILES.find(t => t.key === key);

/* ───────────── Bouton de l’en-tête ───────────── */
function espaceButton() {
  const u = espaceUser(), on = route === '/espace';
  return u
    ? `<a class="espace-btn is-in" href="#/espace" ${on ? 'aria-current="page"' : ''} aria-label="Mon espace candidat, ${esc(u.firstName)} ${esc(u.lastName)}"><span class="espace-avatar" aria-hidden="true">${initials(u)}</span><span class="espace-btn-label">Mon espace</span></a>`
    : `<a class="espace-btn" href="#/espace" ${on ? 'aria-current="page"' : ''}>${icon('user')}<span class="espace-btn-label">Espace candidat</span></a>`;
}

/* ───────────── Page : connexion ou espace ───────────── */
function espacePage() {
  const u = espaceUser(); if (!u) return espaceLoginPage();
  const sub = offerId, p = new URLSearchParams(query);
  const views = {'': espaceHome, profil: espaceProfil, faq: espaceFaq, paie: espacePaie, planning: () => espacePlanning(['mois', 'dispos'].includes(p.get('vue')) ? p.get('vue') : 'semaine'), documents: () => espaceDocuments(p.get('doc') === 'attestation' ? 'attestation' : 'certificat'),
    offres: () => espaceOffres(['cdi', 'candidatures'].includes(p.get('type')) ? p.get('type') : 'interim'), justificatifs: espaceJustificatifs, contrats: () => espaceContrats(['historique', 'mission', 'formation', 'signer'].includes(p.get('vue')) ? p.get('vue') : toSign().length ? 'signer' : 'historique'), fiscal: espaceFiscal, securite: espaceSecurite, avantages: () => espaceAvantages(p.get('doc') || '')};
  return spaceShell(u, views[sub] ? sub : '', (views[sub] || espaceHome)(u));
}

/* Connexion : les liens et aides de l’espace de référence, au style du site. */
let loginView = 'login';
function espaceLoginPage() {
  const intro = [['euro', 'Vos bulletins de paie et vos acomptes'], ['calendar', 'Votre planning, à la semaine ou au mois'], ['pen', 'Vos contrats, signés en ligne'], ['print', 'Vos attestations, prêtes à imprimer']];
  return `<div class="container">${breadcrumb([['Espace candidat']])}</div><section class="espace-login"><div class="container espace-login-grid">
    <div class="espace-login-intro"><h1>${dot('Votre espace candidat.')}</h1><p class="lead">Bienvenue sur votre espace Laska Corporate : tout ce qui concerne vos missions, au même endroit.</p>
      <ul class="espace-login-list">${intro.map(([i, t]) => `<li>${icon(i)}<span>${t}</span></li>`).join('')}</ul>
      <div class="espace-login-links"><p>${icon('phone')}<span>Pour toute question, votre conseiller reste à votre disposition&nbsp;: <a class="text-link" href="${TEL}">${PHONE}</a></span></p><a class="text-link" href="#/mentions-legales">Mentions légales</a><a class="text-link" href="#/mentions-legales?section=editeur">Accessibilité</a></div></div>
    <div class="form-card espace-login-card" id="login-card">${loginCard()}</div></div></section>`;
}
function passwordField(name, label, {autocomplete = 'current-password', help = '', min = 6} = {}) {
  return `<div class="field full password-field"><label for="${name}">${label} <span class="req" aria-hidden="true">*</span></label><div class="password-row"><input id="${name}" name="${name}" type="password" required autocomplete="${autocomplete}" data-min="${min}" data-min-msg="Le mot de passe compte au moins ${min} caractères." ${help ? `aria-describedby="${name}-help"` : ''}><button type="button" class="password-toggle" data-reveal-password="${name}" aria-pressed="false" aria-label="Afficher le mot de passe">${icon('eye')}</button></div><p class="caps-hint" hidden>${icon('bolt')}Les majuscules sont activées.</p>${help ? `<small id="${name}-help">${help}</small>` : ''}</div>`;
}
function loginCard() {
  const back = `<button type="button" class="reset-link" data-login-view="login">${icon('back')}Retour à la connexion</button>`;
  const head = (t, s) => `<div class="form-head"><div><h2 id="login-title" tabindex="-1">${t}</h2>${s ? `<p class="muted small">${s}</p>` : ''}</div></div>`;
  const form = (id, body, submit) => `<form id="${id}" class="login-form" novalidate aria-labelledby="login-title"><div id="form-errors"></div><div class="form-grid">${body}</div><div class="form-actions"><button type="submit" class="btn btn-primary btn-full">${submit}${icon('arrow')}</button></div></form>`;
  if (loginView === 'forgot') return head('Mot de passe oublié', 'Indiquez votre adresse : nous vous envoyons un lien pour en choisir un nouveau.') + form('forgot-form', field('forgotEmail', 'Identifiant (votre adresse email)', {type: 'email', autocomplete: 'username', full: true}), 'Recevoir le lien') + back;
  if (loginView === 'password') return head('Changer mon mot de passe', '') + form('password-form', field('pwEmail', 'Identifiant (votre adresse email)', {type: 'email', autocomplete: 'username', full: true}) + passwordField('pwOld', 'Mot de passe actuel') + passwordField('pwNew', 'Nouveau mot de passe', {autocomplete: 'new-password', min: 8, help: '8 caractères minimum, avec au moins un chiffre.'}), 'Changer le mot de passe') + back;
  if (loginView === 'email') return head('Changer mon adresse email', '') + form('email-form', field('emOld', 'Adresse email actuelle', {type: 'email', autocomplete: 'username', full: true}) + field('emNew', 'Nouvelle adresse email', {type: 'email', autocomplete: 'email', full: true}) + passwordField('emPassword', 'Mot de passe'), 'Changer mon adresse') + back;
  return head('Connexion', '<span class="req">*</span> Champs obligatoires')
    + form('login-form', field('loginEmail', 'Identifiant (votre adresse email)', {type: 'email', autocomplete: 'username', full: true, placeholder: 'nom@exemple.com'}) + passwordField('loginPassword', 'Mot de passe')
      + `<div class="field full login-options"><label class="choice-inline"><input type="checkbox" name="remember" checked><span>Rester connecté sur cet appareil</span></label><button type="button" class="text-link" data-login-view="forgot">J’ai oublié mon mot de passe</button></div>`, 'Connexion')
    + `<details class="login-more"><summary>${icon('plus')}Autres options</summary><div><button type="button" class="text-link" data-login-view="password">Je souhaite changer mon mot de passe</button><button type="button" class="text-link" data-login-view="email">Je souhaite changer mon adresse email</button></div></details>
    <p class="login-new">${icon('file')}<span>Pas encore de dossier chez Laska Corporate ? <a class="text-link" href="#/postuler">Créer mon dossier</a></span></p>
    ${MAQUETTE ? sampleNote('Maquette : saisissez n’importe quelle adresse email et un mot de passe de 6 caractères ou plus. Rien n’est envoyé ni gardé.') : ''}`;
}

/* ───────────── Cadre de l’espace : menu latéral (ordinateur) ou menu déroulant (mobile) ───────────── */
/* Pastilles du menu : seulement ce qui attend une action (contrats à signer, pièces à fournir). */
const navBadge = key => { const n = key === 'contrats' ? toSign().length : key === 'justificatifs' ? docsToDo().length : 0; return n ? `<span class="seg-badge" aria-label="${n} à traiter">${n}</span>` : ''; };
const sideNav = sub => `<nav class="side-nav" aria-label="Menu de mon espace">${SPACE_NAV.map(([group, items]) => `${group ? `<p class="side-group">${group}</p>` : ''}<ul>${items.map(([key, label, ic]) => `<li><a href="#/espace${key ? '/' + key : ''}" ${key === sub ? 'aria-current="page"' : ''}>${icon(ic)}<span>${label}</span>${navBadge(key)}</a></li>`).join('')}</ul>`).join('')}</nav>`;
const spaceLabel = sub => SPACE_NAV.flatMap(([, items]) => items).find(([key]) => key === sub)?.[1] || 'Accueil';
const advisorCard = () => `<div class="agent-who"><span class="space-avatar" aria-hidden="true">${ADVISOR.prenom[0]}${ADVISOR.nom[0]}</span><p class="agent-name">${ADVISOR.prenom} ${ADVISOR.nom}<small>Votre conseillère</small></p></div>
  <a class="btn btn-primary" href="${TEL}">${icon('phone')}${PHONE}</a><button type="button" class="btn btn-outline" data-callback>Être rappelé</button>`;
function spaceShell(u, sub, content) {
  const todo = todoItems().length;
  return `<div class="container space-shell">
    <aside class="space-side" aria-label="Mon espace candidat">
      <div class="side-who"><span class="space-avatar" aria-hidden="true">${initials(u)}</span><p><strong>Dr ${esc(u.firstName)} ${esc(u.lastName)}</strong><small>Espace candidat</small></p></div>
      ${sideNav(sub)}
      <button type="button" class="side-logout" data-logout>${icon('logout')}Déconnexion</button>
    </aside>
    <div class="space-main">
      <details class="space-switch"><summary><span class="space-avatar" aria-hidden="true">${initials(u)}</span><span><small>Mon espace · Dr ${esc(u.lastName)}</small><strong>${spaceLabel(sub)}</strong></span>${todo ? `<span class="seg-badge" aria-label="${todo} à traiter">${todo}</span>` : ''}${icon('down', 'switch-caret')}</summary>
        ${sideNav(sub)}<button type="button" class="side-logout" data-logout>${icon('logout')}Déconnexion</button></details>
      ${content}
    </div>
  </div>`;
}
/* Titre d’une page de l’espace : le menu situe déjà la page, pas de retour ni d’icône en plus. */
const spaceHead = (key, title, lead = '') => `<header class="space-head"><h1>${title}</h1>${lead ? `<p>${lead}</p>` : ''}</header>`;
/* Pastille : corail quand elle attend une action (contrat à signer), menthe quand elle compte (offres, candidatures). */
const segTabs = (items, current, label) => `<nav class="space-seg" aria-label="${label}">${items.map(([key, text, href, badge, quiet]) => `<a href="${href}" ${key === current ? 'aria-current="page"' : ''}>${text}${badge ? `<span class="seg-badge ${quiet ? 'is-quiet' : ''}">${badge}</span>` : ''}</a>`).join('')}</nav>`;
const statusPill = s => ({sign: '<span class="space-pill is-sign">À signer</span>', signed: '<span class="space-pill is-signed">Signé</span>', done: '<span class="space-pill is-done">Terminé</span>'})[s];
const period = (a, b) => a === b ? `Le ${dateLabel(a).toLowerCase()}` : `Du ${dayMonth(a, true)} au ${dayMonth(b, true)} ${year(b)}`;

/* ───────────── Page d’accueil ───────────── */
/* À faire : une ligne par action, un seul bouton par ligne. Ce qui n’attend rien n’y figure pas. */
function todoItems() {
  const d = dispos(), horizon = addDays(mondayOf(TODAY), 27), declared = Object.keys(d).some(k => k >= TODAY && k <= horizon);
  return [
    ...toSign().map(c => ({ico: 'pen', text: 'Signer votre contrat', sub: `${c.title} · ${period(c.from, c.to).toLowerCase()}`, href: '#/espace/contrats?vue=signer', label: 'Signer'})),
    ...docsToDo().map(x => ({ico: 'badge', text: `${x.status === 'missing' ? 'Ajouter' : 'Renouveler'} : ${x.label}`, sub: x.status === 'missing' ? 'À fournir avant votre prochaine mission' : `Expire le ${dateLabel(x.until).toLowerCase()}`, href: '#/espace/justificatifs', label: x.status === 'missing' ? 'Ajouter' : 'Mettre à jour'})),
    ...(declared ? [] : [{ico: 'clock', text: 'Indiquer vos disponibilités', sub: 'Pour recevoir des missions à vos dates', href: '#/espace/planning?vue=dispos', label: 'Indiquer'}])
  ];
}
/* Accueil : bonjour, ce qu’il y a à faire, les prochaines missions, les messages. Tout le reste est dans le menu. */
function espaceHome(u) {
  const read = store(READ_KEY, []), unread = messages().filter(m => !read.includes(m.id)).length, todo = todoItems();
  const next = missions().filter(m => m.date >= TODAY).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 3);
  const when = iso => { const n = daysUntil(iso); return n === 0 ? 'Aujourd’hui' : n === 1 ? 'Demain' : (t => t[0].toUpperCase() + t.slice(1))(fmtDate(iso, {weekday: 'long'})); };
  return `<div class="space-home">
    <header class="space-hello"><h1>${dot(`Bonjour ${esc(u.firstName)}.`)}</h1><p>${todo.length ? `Vous avez ${todo.length} chose${todo.length > 1 ? 's' : ''} à faire.` : 'Tout est à jour.'}</p></header>
    <section class="space-card home-todo" aria-labelledby="todo-title"><h2 id="todo-title">À faire</h2>
      ${todo.length ? `<ul class="todo-list">${todo.map(t => `<li class="todo-row"><span class="space-ico tone-coral">${icon(t.ico)}</span><div><strong>${t.text}</strong><small>${esc(t.sub)}</small></div><a class="btn btn-primary" href="${t.href}">${t.label}${icon('arrow')}</a></li>`).join('')}</ul>` : `<p class="todo-done">${icon('check')}<span>Rien à faire : vos contrats sont signés, votre dossier et vos disponibilités sont à jour.</span></p>`}</section>
    <div class="space-duo">
      <section class="space-card home-next" aria-labelledby="next-title"><h2 id="next-title">Mes prochaines missions</h2>
        ${next.length ? `<ul class="next-list">${next.map(m => `<li class="next-row"><span class="next-date" aria-hidden="true"><small>${fmtDate(m.date, {month: 'short'})}</small><b>${asDate(m.date).getDate()}</b></span><div><strong>${when(m.date)} · ${m.type}</strong><small><span class="sr-only">${dateLabel(m.date)}, </span>${esc(m.spec)} · ${esc(m.place)}</small></div></li>`).join('')}</ul>` : '<p class="space-lead">Aucune mission prévue pour l’instant.</p>'}
        <a class="text-link" href="#/espace/planning?vue=semaine">Voir mon planning${icon('arrow')}</a></section>
      <section class="space-card space-messages" aria-labelledby="msg-title"><div class="space-card-head"><h2 id="msg-title">Messages</h2>${unread ? `<span class="seg-badge">${unread} nouveau${unread > 1 ? 'x' : ''}</span>` : ''}</div>
        <ul class="msg-list">${messages().map(m => `<li class="msg ${read.includes(m.id) ? '' : 'is-unread'}" data-msg="${m.id}"><span class="msg-dot" aria-hidden="true"></span><div><p>${m.text}</p><small>${m.when === 0 ? 'Aujourd’hui' : m.when === -1 ? 'Hier' : dateLabel(m.date)} · ${ADVISOR.prenom} ${ADVISOR.nom}</small></div>${m.link ? `<a class="btn btn-outline msg-action" href="${m.link}" data-msg-read="${m.id}">${m.label}</a>` : `<button type="button" class="reset-link" data-msg-read="${m.id}">${read.includes(m.id) ? 'Lu' : 'Marquer comme lu'}</button>`}</li>`).join('')}</ul></section>
    </div>
    <section class="space-card home-agent" aria-labelledby="agent-title"><h2 id="agent-title">Ma conseillère</h2><div class="side-help">${advisorCard()}</div></section>
    ${sampleNote('Maquette : praticienne, missions, contrats et messages d’exemple, fictifs.')}
  </div>`;
}

/* ───────────── Mon profil ───────────── */
let profileEdit = '';
function espaceProfil(u) {
  const p = profile(), row = (k, v) => `<div><dt>${k}</dt><dd>${v ? esc(v) : '<span class="muted">—</span>'}</dd></div>`;
  const ibanMasked = p.iban.replace(/\s/g, '').replace(/^(.{4}).*(.{3})$/, '$1 •••• •••• •••• •••• •••• $2');
  const card = (key, title, view, edit) => `<section class="space-card profile-card" id="profil-${key}"><div class="space-card-head"><h2>${title}</h2>${profileEdit === key ? '' : `<button type="button" class="review-edit" data-profile-edit="${key}">${icon('pen')}Modifier</button>`}</div>${profileEdit === key ? edit : view}</section>`;
  const f = (n, l, o = {}) => field(`pf-${n}`, l, {required: false, value: p[n] || '', ...o});
  const identityView = `<div class="profile-cols"><dl class="profile-dl">${row('Civilité', p.civilite)}${row('Nom', p.nom)}${row('Nom de jeune fille', p.nomJeuneFille)}${row('Prénom', p.prenom)}${row('Téléphone 1', p.tel1)}${row('Téléphone 2', p.tel2)}${row('Email', u.email)}${row('Né(e) le', p.naissance ? dateLabel(p.naissance) : '')}${row('Dpt naiss.', p.depNaissance)}${row('Mobilité', p.mobilite)}</dl>
    <dl class="profile-dl">${row('N° app, étage', p.app)}${row('Bât, résidence', p.bat)}${row('N° et voie', p.voie)}${row('Lieu-dit, BP', p.lieuDit)}${row('CP – Ville', `${p.cp} ${p.ville}`.trim())}${row('Pays', p.pays)}${row('Nationalité', p.nationalite)}${row('Né(e) à', p.lieuNaissance)}${row('Pays de naissance', p.paysNaissance)}</dl></div>`;
  const identityEdit = `<form class="profile-form" data-profile-form="identite" novalidate><div id="form-errors"></div><div class="form-grid">${f('civilite', 'Civilité', {options: ['Madame', 'Monsieur']})}${f('nomJeuneFille', 'Nom de jeune fille')}${f('tel1', 'Téléphone 1', {type: 'tel'})}${f('tel2', 'Téléphone 2', {type: 'tel'})}${f('app', 'N° app, étage')}${f('bat', 'Bât, résidence')}${f('voie', 'N° et voie', {full: true})}${f('lieuDit', 'Lieu-dit, BP')}${f('cp', 'Code postal', {attrs: 'inputmode="numeric" maxlength="5"'})}${f('ville', 'Ville')}${f('pays', 'Pays', {options: countries.filter(c => c !== 'Autre pays')})}${f('mobilite', 'Mobilité', {full: true, placeholder: 'Régions où vous acceptez des missions'})}</div>
    <p class="muted small">Nom, prénom, date et lieu de naissance : pour les modifier, contactez votre conseiller (justificatif demandé).</p><div class="profile-actions"><button type="submit" class="btn btn-primary">Enregistrer</button><button type="button" class="reset-link" data-profile-cancel>Annuler</button></div></form>`;
  const payView = `<div class="pay-choice" role="list">${['Chèque', 'Virement France et DOM-TOM', 'Vir. International'].map(m => `<span role="listitem" class="pay-opt ${p.paiement === m ? 'is-on' : ''}">${p.paiement === m ? icon('check') : ''}${m}</span>`).join('')}</div><dl class="profile-dl is-inline">${row('BIC', p.bic)}${row('IBAN', ibanMasked)}</dl>`;
  const payEdit = `<form class="profile-form" data-profile-form="paiement" novalidate><div id="form-errors"></div><div class="form-grid">${pills('pf-paiement', 'Moyen de paiement', ['Chèque', 'Virement France et DOM-TOM', 'Vir. International'], p.paiement)}${f('bic', 'BIC', {attrs: 'maxlength="11" autocapitalize="characters"'})}${f('iban', 'IBAN', {full: true, value: '', placeholder: 'FR76 …', help: 'Pour votre sécurité, l’IBAN actuel n’est pas réaffiché : saisissez le nouveau en entier.'})}</div><div class="profile-actions"><button type="submit" class="btn btn-primary">Enregistrer</button><button type="button" class="reset-link" data-profile-cancel>Annuler</button></div></form>`;
  return `<div class="space-page">${spaceHead('', 'Mon profil', 'Vos informations personnelles et votre moyen de paiement.')}
    ${card('identite', 'Identité', identityView, identityEdit)}
    ${card('paiement', 'Moyens / Types de paiement', payView, payEdit)}
    <p class="proof-line">${icon('check')}Convention de preuve acceptée</p>
    ${sampleNote('Maquette : informations d’exemple, fictives.')}</div>`;
}

/* ───────────── Questions fréquentes ───────────── */
const spaceFaq = lazy(() => [
  ['Comment lire votre bulletin de paie', 'En haut : vos heures et le salaire de chaque mission. Au milieu : les indemnités de fin de mission et de congés payés, puis les cotisations sociales. En bas : le net à payer, le montant versé et la date du virement. Une ligne vous semble fausse ? Votre conseiller la vérifie avec vous.'],
  ['Vous n’avez pas encaissé un chèque depuis plus de 1 an', 'Un chèque n’est plus encaissable au-delà d’un an et huit jours après sa date d’émission. Contactez votre conseiller : un nouveau paiement est émis, de préférence par virement.'],
  ['Vous avez perdu votre chèque', 'Prévenez votre conseiller au plus vite : le chèque est bloqué, puis un nouveau paiement vous est envoyé. Pensez à passer au virement dans « Mon profil ».'],
  ['Vous n’arrivez pas à accéder à votre coffre-fort numérique', 'Vos bulletins et contrats y sont déposés avec l’adresse email de votre espace. Vérifiez cette adresse dans « Mon profil », utilisez « J’ai oublié mon mot de passe », puis appelez votre conseiller si le problème continue.'],
  ['Questions courantes', `Démarches d’exercice, disponibilités, offres : retrouvez les réponses dans les <a class="text-link" href="#/praticiens?faq=1">questions fréquentes des praticiens</a>, ou appelez le ${PHONE}.`]
]);
function espaceFaq() {
  return `<div class="space-page">${spaceHead('', 'Questions fréquentes', 'Paie, paiements, accès : les réponses aux questions les plus posées.')}${faq(spaceFaq())}${sampleNote('Maquette : réponses proposées, à faire valider.')}</div>`;
}

/* ───────────── Ma paie et mes acomptes ───────────── */
function espacePaie() {
  const asked = store(ADVANCE_KEY, []), done = spaceContracts().filter(c => c.status !== 'sign');
  return `<div class="space-page">${spaceHead('paie', 'Ma paie et mes acomptes')}
    <div class="space-split">
      <section class="space-card"><h2>Mes bulletins de salaire</h2><div class="space-empty">${icon('euro')}<p><strong>Votre premier bulletin de salaire en version électronique sera accessible ici.</strong>Il arrive au début du mois qui suit votre première mission, et vous recevez un email à chaque nouveau bulletin.</p></div></section>
      <section class="space-card"><h2>Demander un acompte</h2>
        <form id="advance-form" novalidate><div id="form-errors"></div><div class="form-grid">
          ${field('advMission', 'Mission concernée', {options: done.map(c => `${c.title} (${c.ref})`), full: true})}
          ${field('advAmount', 'Montant souhaité, en euros', {full: true, attrs: 'inputmode="decimal" data-amount', help: 'Jusqu’à 50 % des heures déjà réalisées sur la mission.', placeholder: 'Ex. 300'})}
        </div><p class="muted small">${icon('shield')}Versé par virement sur votre compte ${esc(profile().iban.slice(0, 4))} •••• ${esc(profile().iban.replace(/\s/g, '').slice(-3))}, sous 48 h ouvrées.</p>
        <div class="form-actions"><button type="submit" class="btn btn-primary btn-full">Envoyer ma demande${icon('arrow')}</button></div></form>
        ${asked.length ? `<h3 class="space-sub">Mes demandes</h3><ul class="space-rows">${asked.map(a => `<li><span><strong>${esc(a.amount)} €</strong>${esc(a.mission)}</span><span class="space-pill is-signed">Envoyée le ${dayMonth(a.date)}</span></li>`).join('')}</ul>` : ''}
      </section>
    </div></div>`;
}

/* ───────────── Mon planning ───────────── */
let planWeek = 0, planMonth = 0;
const missionsOn = iso => missions().filter(m => m.date === iso);
const missionChip = (m, short = false) => `<span class="plan-chip ${m.ref.startsWith('CF') ? 'is-training' : ''}"><strong>${m.type}</strong>${short ? '' : `<small>${esc(m.spec)}<br>${esc(m.place)}</small>`}</span>`;
function planView(vue) {
  if (vue === 'semaine') {
    const start = addDays(mondayOf(TODAY), planWeek * 7), days = Array.from({length: 7}, (_, i) => addDays(start, i));
    return `<div class="plan-nav"><button type="button" class="plan-step" data-plan-step="-1" aria-label="Semaine précédente">${icon('back')}</button><h2 aria-live="polite">Semaine du ${dayMonth(start, true)} au ${dayMonth(days[6], true)} ${year(days[6])}</h2><button type="button" class="plan-step" data-plan-step="1" aria-label="Semaine suivante">${icon('arrow')}</button>${planWeek ? '<button type="button" class="reset-link" data-plan-today>Cette semaine</button>' : ''}</div>
      <ol class="plan-week">${days.map((d, i) => { const ms = missionsOn(d); return `<li class="plan-day ${d === TODAY ? 'is-today' : ''} ${ms.length ? 'has-mission' : ''}"><span class="plan-date"><abbr title="${WEEKDAYS[i][1]}">${WEEKDAYS[i][0]}</abbr><b>${asDate(d).getDate()}</b></span>${ms.length ? ms.map(m => missionChip(m)).join('') : '<span class="plan-free">Libre</span>'}</li>`; }).join('')}</ol>`;
  }
  const ref = asDate(TODAY); ref.setDate(1); ref.setMonth(ref.getMonth() + planMonth);
  const y = ref.getFullYear(), mo = ref.getMonth(), first = (new Date(y, mo, 1).getDay() + 6) % 7, n = new Date(y, mo + 1, 0).getDate();
  let cells = ''; for (let i = 0; i < first; i++) cells += '<li class="plan-cell is-blank" aria-hidden="true"></li>';
  for (let d = 1; d <= n; d++) { const iso = isoOf(y, mo, d), ms = missionsOn(iso); cells += `<li class="plan-cell ${iso === TODAY ? 'is-today' : ''} ${ms.length ? 'has-mission' : ''}"><b>${d}</b>${ms.map(m => missionChip(m, true)).join('')}${ms.length ? `<span class="sr-only">${ms.map(m => `${m.type}, ${m.place}`).join(' ; ')}</span>` : ''}</li>`; }
  const count = missions().filter(m => m.date.startsWith(isoOf(y, mo, 1).slice(0, 7))).length;
  return `<div class="plan-nav"><button type="button" class="plan-step" data-plan-step="-1" aria-label="Mois précédent">${icon('back')}</button><h2 aria-live="polite">${MONTHS[mo][0].toUpperCase() + MONTHS[mo].slice(1)} ${y} <small>${count ? `${count} jour${count > 1 ? 's' : ''} de mission` : 'Aucune mission'}</small></h2><button type="button" class="plan-step" data-plan-step="1" aria-label="Mois suivant">${icon('arrow')}</button>${planMonth ? '<button type="button" class="reset-link" data-plan-today>Ce mois-ci</button>' : ''}</div>
    <div class="plan-month"><div class="plan-head" aria-hidden="true">${WEEKDAYS.map(([s]) => `<span>${s}</span>`).join('')}</div><ol class="plan-grid">${cells}</ol></div>`;
}
function espacePlanning(vue) {
  const tabs = segTabs([['semaine', 'Semaine', '#/espace/planning?vue=semaine'], ['mois', 'Mois', '#/espace/planning?vue=mois'], ['dispos', 'Mes disponibilités', '#/espace/planning?vue=dispos']], vue, 'Affichage du planning');
  if (vue === 'dispos') return `<div class="space-page">${spaceHead('planning', 'Mon planning', 'Touchez un jour pour dire si vous êtes disponible : votre conseillère vous propose des missions à ces dates.')}${tabs}
    <section class="space-card" id="dispo-view">${dispoView()}</section></div>`;
  return `<div class="space-page">${spaceHead('planning', 'Mon planning')}${tabs}
    <section class="space-card plan-card" id="plan-view" data-vue="${vue}">${planView(vue)}</section>
    <p class="plan-legend"><span class="plan-chip"><strong>Mission</strong></span><span class="plan-chip is-training"><strong>Formation</strong></span><span>Une mission vous semble manquer ? Appelez le <a class="text-link" href="${TEL}">${PHONE}</a>.</span></p></div>`;
}
/* Disponibilités : 4 semaines à partir de ce lundi. Un appui fait passer le jour de « non renseigné » à « disponible »,
   puis « indisponible », puis de nouveau « non renseigné ». Jours passés et jours de mission : non modifiables. */
const DISPO_LABEL = {'': 'Non renseigné', dispo: 'Disponible', off: 'Indisponible'};
function dispoView() {
  const d = dispos(), start = mondayOf(TODAY), days = Array.from({length: 28}, (_, i) => addDays(start, i));
  const free = days.filter(x => x >= TODAY && !missionsOn(x).length), count = k => free.filter(x => (d[x] || '') === k).length;
  const cell = iso => {
    const i = (asDate(iso).getDay() + 6) % 7, num = asDate(iso).getDate(), head = `<span class="dispo-date"><b>${num}</b>${num === 1 || iso === days[0] ? `<span>${fmtDate(iso, {month: 'short'})}</span>` : ''}</span>`;
    if (iso < TODAY) return `<li class="dispo-day is-past" aria-hidden="true">${head}</li>`;
    const m = missionsOn(iso)[0];
    if (m) return `<li class="dispo-day is-mission">${head}<span class="dispo-state">${icon('calendar')}Mission</span><span class="sr-only">${dateLabel(iso)} : mission, ${m.type}</span></li>`;
    const st = d[iso] || '';
    return `<li><button type="button" class="dispo-day is-${st || 'unset'} ${iso === TODAY ? 'is-today' : ''}" data-dispo="${iso}" aria-label="${dateLabel(iso)} : ${DISPO_LABEL[st].toLowerCase()}. Toucher pour changer.">${head}<span class="dispo-state" aria-hidden="true">${st === 'dispo' ? icon('check') : st === 'off' ? icon('close') : ''}${st ? DISPO_LABEL[st] : 'À indiquer'}</span></button></li>`;
  };
  return `<div class="dispo-head"><p class="dispo-count" aria-live="polite"><strong>${count('dispo')}</strong> jour${count('dispo') > 1 ? 's' : ''} disponible${count('dispo') > 1 ? 's' : ''} · <strong>${count('off')}</strong> indisponible${count('off') > 1 ? 's' : ''} · <strong>${count('')}</strong> à indiquer</p>
      <div class="dispo-quick"><button type="button" class="btn btn-outline" data-dispo-all="dispo">${icon('check')}Disponible tous les jours libres</button><button type="button" class="btn btn-outline" data-dispo-all="weekend">${icon('calendar')}Seulement les week-ends</button>${Object.keys(d).length ? `<button type="button" class="reset-link" data-dispo-all="clear">${icon('close')}Tout effacer</button>` : ''}</div></div>
    <div class="dispo-weekdays" aria-hidden="true">${WEEKDAYS.map(([s]) => `<span>${s}</span>`).join('')}</div>
    <ol class="dispo-grid" aria-label="Mes disponibilités, du ${dayMonth(start, true)} au ${dayMonth(days.at(-1), true)}">${days.map(cell).join('')}</ol>
    <p class="plan-legend"><span class="dispo-key is-dispo">${icon('check')}Disponible</span><span class="dispo-key is-off">${icon('close')}Indisponible</span><span class="dispo-key is-mission">${icon('calendar')}Mission prévue</span><span>Vos réponses sont envoyées à votre conseillère à chaque changement.</span></p>`;
}

/* ───────────── Mes impressions de documents ───────────── */
function espaceDocuments(doc) {
  const ended = spaceContracts().filter(c => c.status === 'done');
  const what = doc === 'certificat' ? ['Certificat de travail', 'Il atteste des missions réalisées : dates, établissement, fonction. Utile pour un nouvel employeur ou l’Ordre.'] : ['Attestation de salaire', 'Elle récapitule les salaires d’une période : utile pour un arrêt de travail, un congé maternité ou une demande de prêt.'];
  return `<div class="space-page">${spaceHead('documents', 'Mes impressions de documents')}
    ${segTabs([['certificat', 'Certificat de travail', '#/espace/documents?doc=certificat'], ['attestation', 'Attestation de salaire', '#/espace/documents?doc=attestation']], doc, 'Type de document')}
    <section class="space-card"><h2>${what[0]}</h2><p class="space-lead">${what[1]}</p>
      <form id="doc-form" data-doc="${what[0]}" novalidate><div id="form-errors"></div><div class="form-grid">
        ${doc === 'certificat' ? field('docMission', 'Mission', {options: ended.map(c => `${c.title}, ${period(c.from, c.to).toLowerCase()}`), full: true}) : field('docPeriod', 'Période', {options: [`Mois dernier`, `3 derniers mois`, `12 derniers mois`, `Année ${yearNow()}`], full: true})}
      </div><div class="form-actions"><button type="submit" class="btn btn-primary">${icon('print')}Préparer le document</button></div></form>
      <div id="doc-result" aria-live="polite"></div></section></div>`;
}

/* ───────────── Mes offres d’emploi ───────────── */
function espaceOffres(type) {
  const list = offers.filter(o => type === 'cdi' ? o.contract !== 'Intérim' : o.contract === 'Intérim');
  const tabs = segTabs([['interim', 'Intérim', '#/espace/offres?type=interim', offers.filter(o => o.contract === 'Intérim').length, true], ['cdi', 'CDD, CDI', '#/espace/offres?type=cdi', offers.filter(o => o.contract !== 'Intérim').length, true], ['candidatures', 'Mes candidatures', '#/espace/offres?type=candidatures', applications().length, true]], type, 'Mes offres d’emploi');
  if (type === 'candidatures') return `<div class="space-page">${spaceHead('offres', 'Mes offres d’emploi', 'Où en sont vos candidatures : votre conseillère vous appelle à chaque étape importante.')}${tabs}
    <section class="space-card">${applications().length ? `<ul class="app-list">${applications().map(appRow).join('')}</ul>` : `<div class="space-empty">${icon('briefcase')}<p><strong>Aucune candidature pour l’instant.</strong>Postulez depuis une offre : elle apparaîtra ici avec son avancement.</p></div>`}</section>
    <p class="space-more"><a class="text-link" href="#/offres?gardees=1">${icon('heart')}Mes offres gardées (${favList().length})</a><a class="text-link" href="#/offres">Rechercher parmi toutes les offres${icon('arrow')}</a></p></div>`;
  return `<div class="space-page">${spaceHead('offres', 'Mes offres d’emploi', 'Les offres ouvertes, selon le contrat recherché.')}${tabs}
    ${list.length ? `<div class="offer-grid space-offers">${list.map(offerCard).join('')}</div>` : `<div class="space-empty">${icon('briefcase')}<p><strong>Aucune offre pour l’instant.</strong>Votre conseillère vous prévient dès qu’une offre correspond à votre profil.</p></div>`}
    <p class="space-more"><a class="text-link" href="#/offres">Rechercher parmi toutes les offres${icon('arrow')}</a></p></div>`;
}
/* Une candidature : l’offre, la date d’envoi et un suivi en 4 étapes (l’étape en cours est nommée en toutes lettres). */
function appRow(a) {
  const o = offers.find(x => x.id === a.offer), last = a.step === APP_STEPS.length - 1;
  return `<li class="app-row"><div class="app-main"><span class="row-num" aria-hidden="true">${o.num}</span><div><strong>${esc(o.specialty)}</strong><small>${esc(o.dept)} (${o.num}) · ${slotRange(o)} · réf. ${o.ref}</small><small>Envoyée le ${dateLabel(a.date).toLowerCase()}</small></div><span class="space-pill ${last ? 'is-signed' : 'is-progress'}">${APP_STEPS[a.step]}</span><a class="btn btn-outline" href="#/offre/${o.id}">Voir l’offre</a></div>
    <ol class="app-steps" aria-label="Avancement : étape ${a.step + 1} sur ${APP_STEPS.length}, ${APP_STEPS[a.step].toLowerCase()}">${APP_STEPS.map((s, i) => `<li class="${i < a.step ? 'is-done' : i === a.step ? 'is-now' : ''}"><span aria-hidden="true">${i < a.step ? icon('check') : i + 1}</span>${s}</li>`).join('')}</ol></li>`;
}

/* ───────────── Mes justificatifs ───────────── */
const DOC_STATE = {ok: ['À jour', 'is-signed'], expiring: ['À renouveler', 'is-warn'], missing: ['À fournir', 'is-sign'], review: ['En vérification', 'is-done']};
function espaceJustificatifs() {
  const docs = spaceDocs(), ok = docs.filter(d => d.status === 'ok').length, todo = docsToDo();
  const sub = d => d.status === 'review' ? `Reçu : ${esc(d.file)}. Votre conseillère le vérifie sous 48 h.` : d.status === 'missing' ? 'À fournir avant votre prochaine mission.' : d.until ? (d.status === 'expiring' ? `Expire dans ${daysUntil(d.until)} jours, le ${dateLabel(d.until).toLowerCase()}.` : `Valable jusqu’au ${dateLabel(d.until).toLowerCase()}.`) : 'Vérifié par votre conseillère.';
  const row = d => `<li class="doc-row is-${d.status}"><span class="space-ico tone-${d.status === 'ok' ? 'teal' : d.status === 'review' ? 'ink' : d.status === 'missing' ? 'coral' : 'sand'}">${icon(d.status === 'ok' ? 'check' : d.status === 'review' ? 'clock' : 'file')}</span>
    <div><strong>${d.label}</strong><small>${sub(d)}</small></div><span class="space-pill ${DOC_STATE[d.status][1]}">${DOC_STATE[d.status][0]}</span>
    <label class="btn ${d.status === 'missing' || d.status === 'expiring' ? 'btn-primary' : 'btn-outline'} doc-upload">${icon('file')}${d.status === 'missing' ? 'Ajouter' : d.status === 'expiring' ? 'Mettre à jour' : 'Remplacer'}<span class="sr-only"> : ${d.label}</span><input type="file" class="sr-only" data-doc-up="${d.key}" accept="application/pdf,.pdf,image/jpeg,.jpg,.jpeg,image/png,.png"></label></li>`;
  return `<div class="space-page">${spaceHead('justificatifs', 'Mes justificatifs', 'Les pièces de votre dossier, demandées avant chaque mission. Gardez-les à jour, nous vous prévenons avant leur expiration.')}
    <section class="space-card docs-summary"><div><strong>${ok} pièce${ok > 1 ? 's' : ''} à jour sur ${docs.length}</strong><span>${todo.length ? `${todo.length} à mettre à jour : ${todo.map(t => t.label.split(' ou ')[0]).join(', ')}.` : 'Votre dossier est complet.'}</span></div><span class="docs-bar" role="img" aria-label="Pièces à jour : ${ok} sur ${docs.length}"><span style="--p:${Math.round(ok / docs.length * 100)}%"></span></span></section>
    <section class="space-card"><ul class="doc-list">${[...todo, ...docs.filter(d => !todo.includes(d))].map(row).join('')}</ul>
      <p class="muted small">${icon('shield')}PDF, JPG ou PNG, 10 Mo maximum. Une photo nette du document suffit.</p></section>
    ${sampleNote('Maquette : pièces et dates d’exemple. Les fichiers déposés ne sont pas envoyés.')}</div>`;
}

/* ───────────── Mes contrats ───────────── */
function contractRow(c, open) {
  return `<li class="contract-row ${open ? 'is-open' : ''}" data-contract="${c.ref}"><div class="contract-main"><span class="space-ico tone-${c.kind === 'formation' ? 'sand' : 'coral'}">${icon(c.kind === 'formation' ? 'diploma' : 'file')}</span>
    <div><strong>${esc(c.title)}</strong><small>${esc(c.place)} · ${period(c.from, c.to)}</small><small class="contract-ref">Réf. ${c.ref} · ${c.kind === 'formation' ? 'Contrat de mission – formation' : 'Contrat de mission'}</small></div>${statusPill(c.status)}
    ${c.status === 'sign' ? `<button type="button" class="btn btn-coral" data-sign-open="${c.ref}" aria-expanded="${open}">${icon('pen')}Lire et signer</button>` : `<button type="button" class="btn btn-outline" data-download="${c.ref}">${icon('file')}PDF</button>`}</div>
    ${c.status === 'sign' && open ? `<form class="sign-panel" data-sign="${c.ref}" novalidate><div id="form-errors"></div><dl class="profile-dl is-inline"><div><dt>Établissement</dt><dd>${esc(c.place)}</dd></div><div><dt>Dates</dt><dd>${period(c.from, c.to)}</dd></div><div><dt>Créneaux</dt><dd>${missions().filter(m => m.ref === c.ref).map(m => `${dayMonth(m.date)} · ${m.type}`).join(', ')}</dd></div><div><dt>Rémunération</dt><dd>Selon les conditions de l’offre</dd></div></dl>
      <div class="field full"><label class="choice-inline"><input type="checkbox" name="signRead" required data-error-label="Lecture du contrat" data-missing="Cochez cette case pour signer : elle confirme que vous avez lu le contrat."><span>J’ai lu le contrat et j’en accepte les conditions.</span></label></div>
      <div class="profile-actions"><button type="submit" class="btn btn-primary">${icon('pen')}Signer électroniquement</button><button type="button" class="reset-link" data-sign-open="${c.ref}">Plus tard</button></div></form>` : ''}</li>`;
}
let openSign = '';
function espaceContrats(vue) {
  const all = spaceContracts().sort((a, b) => b.from.localeCompare(a.from));
  const list = {historique: all, mission: all.filter(c => c.kind === 'mission'), formation: all.filter(c => c.kind === 'formation'), signer: all.filter(c => c.status === 'sign')}[vue];
  const n = toSign().length;
  return `<div class="space-page">${spaceHead('contrats', 'Mes contrats')}
    ${segTabs([['signer', 'À signer', '#/espace/contrats?vue=signer', n || ''], ['historique', 'Tous mes contrats', '#/espace/contrats?vue=historique'], ['mission', 'Missions', '#/espace/contrats?vue=mission'], ['formation', 'Formations', '#/espace/contrats?vue=formation']], vue, 'Mes contrats')}
    <section class="space-card" id="contract-list">${list.length ? `<ul class="contract-list">${list.map(c => contractRow(c, openSign === c.ref)).join('')}</ul>` : `<div class="space-empty">${icon('check')}<p><strong>${vue === 'signer' ? 'Aucun contrat à signer.' : 'Aucun contrat ici pour l’instant.'}</strong>${vue === 'signer' ? 'Vous recevez un message dès qu’un nouveau contrat est prêt.' : 'Vos contrats apparaissent ici dès votre première mission.'}</p></div>`}</section></div>`;
}

/* ───────────── Données fiscales, sécurité, avantages ───────────── */
function espaceFiscal() {
  return `<div class="space-page">${spaceHead('fiscal', 'Mes données fiscales')}
    <section class="space-card"><div class="space-empty">${icon('receipt')}<p><strong>Aucune donnée pour l’année ${yearNow()}.</strong>Le récapitulatif de vos revenus imposables apparaît ici après votre première paie : vous pourrez le comparer avec votre déclaration de revenus.</p></div></section></div>`;
}
function espaceSecurite() {
  const blocks = [['Avant la mission', ['Lisez la fiche de poste et le lieu de rendez-vous envoyés par votre conseiller.', 'Vérifiez que vos vaccinations obligatoires sont à jour.', 'Demandez l’accueil sécurité du service dès votre arrivée.']],
    ['Pendant la mission', ['Portez les équipements de protection fournis par l’établissement.', 'Repérez les issues de secours et les numéros d’urgence internes.', 'Signalez toute situation à risque au cadre de santé.']],
    ['En cas d’accident', ['Prévenez immédiatement le cadre du service.', 'Appelez votre conseiller dans les 24 heures : nous déclarons l’accident avec vous.', `Numéro direct : ${PHONE}.`]]];
  return `<div class="space-page">${spaceHead('securite', 'Sécurité prévention', 'Réalisez votre mission en toute sécurité.')}
    <div class="space-safety">${blocks.map(([t, list], i) => `<section class="space-card"><span class="safety-n" aria-hidden="true">${i + 1}</span><h2>${t}</h2>${checkList(list)}</section>`).join('')}</div>
    ${sampleNote('Maquette : consignes proposées, à faire valider par Laska Corporate.')}</div>`;
}
function espaceAvantages(doc) {
  const items = tileOf('avantages').items, current = items.find(([, h]) => h.endsWith(`doc=${doc}`)) || items[0];
  const row = ([label, href]) => { const key = href.split('doc=')[1], ext = key === 'fastt';
    return `<li class="${current[1] === href ? 'is-current' : ''}">${ext ? `<a href="https://www.fastt.org" target="_blank" rel="noopener">${icon('link')}<span>${label}<small>Site externe, nouvel onglet</small></span>${icon('arrow')}</a>` : `<a href="#/espace/${href}" ${current[1] === href ? 'aria-current="page"' : ''}>${icon('file')}<span>${label}<small>${key === 'avantages' ? 'Vos avantages Laska Corporate' : 'Document PDF'}</small></span>${icon('chevron')}</a>`}</li>`; };
  const key = current[1].split('doc=')[1];
  return `<div class="space-page">${spaceHead('avantages', 'Mes avantages')}
    <div class="space-split is-nav"><nav aria-label="Mes avantages"><ul class="space-docs">${items.map(row).join('')}</ul></nav>
      <section class="space-card doc-view"><h2>${current[0]}</h2>${key === 'avantages' ? checkList(['Accompagnement gratuit dans vos démarches d’exercice', 'Logement et transport proposés selon les missions', 'Un conseiller dédié, joignable par téléphone et WhatsApp']) + todo('liste complète des avantages', 'À fournir par Laska Corporate.') : todo(`document « ${current[0]} »`, 'PDF à fournir par Laska Corporate ; il s’ouvrira ici et pourra être téléchargé.')}</section></div></div>`;
}

/* ───────────── Interactions ───────────── */
function bindEspace(root = document) {
  /* Connexion et formulaires d’aide (mot de passe oublié, changements). */
  const card = $('#login-card', root);
  if (card) {
    const wire = () => {
      const form = $('form', card); if (!form) return;
      form.addEventListener('input', e => clearError(e.target)); form.addEventListener('change', e => clearError(e.target));
      form.addEventListener('change', e => { if (e.target.type === 'email') { const better = emailSuggestion(e.target.value); fieldHint(e.target, better ? `Vouliez-vous dire <strong>${esc(better)}</strong> ?` : '', better ? {label: 'Oui, corriger', run: () => { e.target.value = better; clearError(e.target); }} : null); } });
      form.addEventListener('keyup', e => { if (e.target.type === 'password' || e.target.dataset.revealed) { const hint = e.target.closest('.field').querySelector('.caps-hint'); if (hint && e.getModifierState) hint.hidden = !e.getModifierState('CapsLock'); } });
      form.addEventListener('submit', e => {
        e.preventDefault(); if (!validate(form)) return;
        const submit = $('[type=submit]', form);
        if (form.id === 'login-form') {
          submit.disabled = true; submit.classList.add('is-loading'); submit.innerHTML = `<span class="btn-spinner" aria-hidden="true"></span>Connexion…`;
          setTimeout(() => {
            const u = espaceLogin($('#loginEmail', form).value.trim(), form.remember.checked);
            setAudience('pro', {rerender: false}); render(false); $('#main')?.focus({preventScroll: true});
            toast(`Bonjour ${u.firstName}, vous êtes connectée à votre espace.`, {icon: 'user'});
          }, 650);
          return;
        }
        const done = {'forgot-form': ['Lien envoyé', 'Si un espace existe avec cette adresse, vous recevez un email pour choisir un nouveau mot de passe. Pensez à regarder vos courriers indésirables.'], 'password-form': ['Mot de passe changé', 'Votre nouveau mot de passe est actif. Utilisez-le à votre prochaine connexion.'], 'email-form': ['Adresse à confirmer', 'Un email de confirmation part à votre nouvelle adresse : cliquez sur le lien qu’il contient pour terminer.']}[form.id];
        card.innerHTML = `<div class="success-state"><div class="success-symbol"><svg viewBox="0 0 52 52" aria-hidden="true"><circle cx="26" cy="26" r="24"/><path d="m15 27 7 7 15-16"/></svg></div><h2 tabindex="-1">${dot(done[0] + '.')}</h2><p class="space-lead">${done[1]}</p><div class="notice">${icon('shield')}<p><strong>Simulation.</strong> Aucun email n’est envoyé.</p></div><div class="actions"><button type="button" class="btn btn-primary" data-login-view="login">Retour à la connexion</button></div></div>`;
        $('h2', card).focus();
      });
    };
    card.addEventListener('click', e => {
      const v = e.target.closest('[data-login-view]');
      if (v) { loginView = v.dataset.loginView; card.innerHTML = loginCard(); wire(); $('#login-title', card)?.focus(); return; }
      const t = e.target.closest('[data-reveal-password]');
      if (t) { const input = $(`#${t.dataset.revealPassword}`, card), show = input.type === 'password'; input.type = show ? 'text' : 'password'; input.dataset.revealed = show ? '1' : ''; t.setAttribute('aria-pressed', show); t.setAttribute('aria-label', show ? 'Masquer le mot de passe' : 'Afficher le mot de passe'); t.innerHTML = icon(show ? 'eyeOff' : 'eye'); input.focus(); }
    });
    wire();
  }
  const page = $('.space-page, .space-home', root);
  /* Déconnexion : depuis n’importe quel écran de l’espace. */
  $$('[data-logout]', root).forEach(b => b.addEventListener('click', () => {
    espaceLogout(); loginView = 'login'; profileEdit = ''; openSign = '';
    if (location.hash === '#/espace') render(); else location.hash = '/espace';
    toast('Vous êtes déconnecté. À bientôt !', {icon: 'logout'});
  }));
  if (page) bindSpacePage(page);
}
/* Écran de l’espace (relié à nouveau après chaque mise à jour sur place, sans toucher au bandeau). */
function bindSpacePage(page) {
  const again = () => bindSpacePage($('.space-page, .space-home'));
  /* Messages : lus au clic. */
  page.addEventListener('click', e => {
    const m = e.target.closest('[data-msg-read]'); if (!m) return;
    const read = store(READ_KEY, []); if (!read.includes(m.dataset.msgRead)) keep(READ_KEY, [...read, m.dataset.msgRead]);
    if (m.tagName === 'BUTTON') { const li = m.closest('.msg'); li.classList.remove('is-unread'); m.textContent = 'Lu'; m.disabled = true; const badge = $('.space-messages .seg-badge', page), n = $$('.msg.is-unread', page).length; if (badge) n ? badge.textContent = `${n} nouveau${n > 1 ? 'x' : ''}` : badge.remove(); }
  });
  /* Planning : semaines et mois précédents ou suivants, sur place. */
  const plan = $('#plan-view', page);
  plan?.addEventListener('click', e => {
    const step = e.target.closest('[data-plan-step]'), today = e.target.closest('[data-plan-today]'); if (!step && !today) return;
    const vue = plan.dataset.vue; if (vue === 'semaine') planWeek = today ? 0 : planWeek + Number(step.dataset.planStep); else planMonth = today ? 0 : planMonth + Number(step.dataset.planStep);
    plan.innerHTML = planView(vue); $(step ? `[data-plan-step="${step.dataset.planStep}"]` : '[data-plan-step="1"]', plan)?.focus();
  });
  /* Contrats : ouvrir le panneau de signature, signer, télécharger. */
  const list = $('#contract-list', page);
  const paintContracts = () => { const vue = new URLSearchParams(query).get('vue') || $('.space-seg [aria-current]', page)?.getAttribute('href').split('vue=')[1] || 'historique'; page.outerHTML = espaceContrats(vue); again(); };
  list?.addEventListener('click', e => {
    const o = e.target.closest('[data-sign-open]');
    if (o) { openSign = openSign === o.dataset.signOpen ? '' : o.dataset.signOpen; paintContracts(); $(`[data-contract="${o.dataset.signOpen}"] ${openSign ? '.sign-panel input' : '[data-sign-open]'}`)?.focus(); return; }
    const d = e.target.closest('[data-download]'); if (d) toast(`Contrat ${d.dataset.download} : téléchargement simulé, aucun fichier n’est créé.`, {icon: 'file'});
  });
  list?.addEventListener('submit', e => {
    const form = e.target.closest('[data-sign]'); if (!form) return; e.preventDefault(); if (!validate(form)) return;
    const ref = form.dataset.sign; keep(SIGNED_KEY, [...new Set([...store(SIGNED_KEY, []), ref])]); openSign = '';
    paintContracts(); toast(`Contrat ${ref} signé électroniquement. Une copie est déposée dans votre historique.`, {action: {label: 'Voir l’historique', run: () => { location.hash = '/espace/contrats?vue=historique'; }}});
  });
  list?.addEventListener('change', e => clearError(e.target));
  /* Acompte. */
  const adv = $('#advance-form', page);
  adv?.addEventListener('input', e => clearError(e.target));
  adv?.addEventListener('submit', e => {
    e.preventDefault(); const amount = $('#advAmount', adv);
    const value = Number(amount.value.replace(',', '.').replace(/[^\d.]/g, ''));
    if (!validate(adv)) return;
    if (!value || value < 20 || value > 2000) { amount.setAttribute('aria-invalid', 'true'); fieldHint(amount, value > 2000 ? 'Au-delà de 2 000 €, appelez votre conseiller : il étudie la demande avec vous.' : 'Indiquez un montant entre 20 € et 2 000 €.'); amount.focus(); return; }
    keep(ADVANCE_KEY, [{amount: value.toLocaleString('fr-FR'), mission: $('#advMission', adv).value, date: TODAY}, ...store(ADVANCE_KEY, [])]);
    page.outerHTML = espacePaie(); again();
    toast(`Demande d’acompte de ${value.toLocaleString('fr-FR')} € envoyée (simulation).`);
  });
  /* Documents. */
  const docForm = $('#doc-form', page);
  docForm?.addEventListener('submit', e => {
    e.preventDefault(); if (!validate(docForm)) return;
    const choice = $('select', docForm).value, name = docForm.dataset.doc;
    $('#doc-result', page).innerHTML = `<div class="doc-ready">${icon('file')}<div><strong>${name} prêt</strong><small>${esc(choice)} · PDF</small></div><button type="button" class="btn btn-outline" data-print-doc>${icon('print')}Imprimer</button><button type="button" class="btn btn-primary" data-download="${esc(name)}">Télécharger</button></div>`;
    $('#doc-result [data-print-doc]', page).focus();
  });
  page.addEventListener('click', e => {
    if (e.target.closest('[data-print-doc]')) toast('Impression simulée : le vrai document sera généré par le logiciel de paie.', {icon: 'print'});
    const d = e.target.closest('#doc-result [data-download]'); if (d) toast(`${d.dataset.download} : téléchargement simulé, aucun fichier n’est créé.`, {icon: 'file'});
  });
  /* Profil : modifier une carte sur place. */
  page.addEventListener('click', e => {
    const ed = e.target.closest('[data-profile-edit]'), cancel = e.target.closest('[data-profile-cancel]');
    if (!ed && !cancel) return;
    profileEdit = ed ? ed.dataset.profileEdit : ''; const key = ed ? ed.dataset.profileEdit : cancel.closest('[data-profile-form]').dataset.profileForm;
    page.outerHTML = espaceProfil(espaceUser()); again();
    (ed ? $(`#profil-${key} input:not([type=hidden]), #profil-${key} select`) : $(`#profil-${key} [data-profile-edit]`))?.focus();
  });
  page.addEventListener('submit', e => {
    const form = e.target.closest('[data-profile-form]'); if (!form) return; e.preventDefault();
    const iban = $('#pf-iban', form);
    if (iban && iban.value.trim() && !/^[A-Z]{2}\d{2}[A-Z0-9]{10,30}$/.test(iban.value.replace(/\s/g, '').toUpperCase())) { iban.setAttribute('aria-invalid', 'true'); fieldHint(iban, 'Cet IBAN semble incomplet : il commence par deux lettres (FR pour la France) puis compte 27 caractères en France.'); iban.focus(); return; }
    if (!validate(form)) return;
    const next = {...store(PROFILE_KEY, {})};
    for (const el of form.elements) if (el.name?.startsWith('pf-') && (el.type !== 'radio' || el.checked)) { const k = el.name.slice(3); if (k === 'iban' && !el.value.trim()) continue; next[k] = k === 'iban' ? el.value.toUpperCase().replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim() : el.value; }
    if (form.dataset.profileForm === 'paiement' && next.paiement === undefined) next.paiement = profile().paiement;
    keep(PROFILE_KEY, next); profileEdit = '';
    page.outerHTML = espaceProfil(espaceUser()); again();
    toast('Modifications enregistrées. Votre conseiller en est informé.');
  });
  page.querySelectorAll('.profile-form').forEach(f => { f.addEventListener('input', e => clearError(e.target)); bindMulti(f); });
  /* Disponibilités : un appui par jour ; actions groupées avec « Annuler ». */
  const dv = $('#dispo-view', page);
  dv?.addEventListener('click', e => {
    const day = e.target.closest('[data-dispo]'), all = e.target.closest('[data-dispo-all]'); if (!day && !all) return;
    const d = dispos(), before = {...d};
    if (day) { const iso = day.dataset.dispo, next = {'': 'dispo', dispo: 'off', off: ''}[d[iso] || '']; if (next) d[iso] = next; else delete d[iso]; }
    else if (all.dataset.dispoAll === 'clear') Object.keys(d).forEach(k => delete d[k]);
    else Array.from({length: 28}, (_, i) => addDays(mondayOf(TODAY), i)).filter(x => x >= TODAY && !missionsOn(x).length)
      .forEach(x => { d[x] = all.dataset.dispoAll === 'dispo' || [0, 6].includes(asDate(x).getDay()) ? 'dispo' : 'off'; });
    keep(DISPO_KEY, d); dv.innerHTML = dispoView();
    (day ? $(`[data-dispo="${day.dataset.dispo}"]`, dv) : $(`[data-dispo-all="${all.dataset.dispoAll}"]`, dv) || $('[data-dispo-all]', dv))?.focus();
    if (all) toast(all.dataset.dispoAll === 'clear' ? 'Disponibilités effacées.' : 'Disponibilités enregistrées : votre conseillère les voit tout de suite.', {action: {label: 'Annuler', run: () => { keep(DISPO_KEY, before); const v = $('#dispo-view'); if (v) v.innerHTML = dispoView(); }}});
  });
  /* Justificatifs : dépôt d’une pièce (contrôle du format et du poids), puis « en vérification ». */
  page.addEventListener('change', e => {
    const up = e.target.closest('[data-doc-up]'); if (!up) return;
    const f = up.files[0], key = up.dataset.docUp; if (!f) return;
    const problem = fileProblem(f, ['pdf', 'jpg', 'jpeg', 'png']);
    if (problem) { up.value = ''; toast(problem, {icon: 'close'}); return; }
    const sent = store(DOCS_KEY, {}), prev = sent[key]; sent[key] = f.name; keep(DOCS_KEY, sent);
    page.outerHTML = espaceJustificatifs(); again(); $(`[data-doc-up="${key}"]`)?.focus();
    toast(`« ${esc(f.name)} » reçu. Votre conseillère le vérifie sous 48 h.`, {icon: 'file', action: {label: 'Annuler', run: () => { const s = store(DOCS_KEY, {}); prev ? s[key] = prev : delete s[key]; keep(DOCS_KEY, s); const pg = $('.space-page'); if (pg && location.hash.includes('justificatifs')) { pg.outerHTML = espaceJustificatifs(); bindSpacePage($('.space-page')); } }}});
  });
}
