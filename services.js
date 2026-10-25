/* Laska Corporate — services autour des offres et de l’aide (v6).
   Chargé avant app.js ; ne contient que des définitions, appelées par app.js au rendu.
   – Garder une offre (sans compte, dans ce navigateur) et la partager (WhatsApp, email, lien).
   – Aide toujours visible : appeler, WhatsApp, être rappelé, écrire.
   – « Suis-je éligible ? » : trois questions pour savoir par où commencer.
   – Avis des praticiens : dépôt, validation par l’équipe, publication (modération simulée en maquette).
   – Emplacements « à compléter » : contenus que seul Laska Corporate peut fournir (chiffres, témoignages, tarifs…).
   En Next.js : <FavoriteButton>, <ShareMenu>, <HelpButton>, <CallbackDialog>, <EligibilityQuiz>. */

/* Numéro WhatsApp de Laska Corporate (format international sans « + »). À CONFIRMER : c’est pour l’instant le standard. */
const WHATSAPP = '33184803696';
/* Maquette : affiche les emplacements de contenu à fournir et les mentions « exemple ». Passer à false en production. */
const MAQUETTE = true;
const todo = (what, detail = '') => MAQUETTE ? `<span class="todo">${icon('file')}<span><strong>À compléter : ${what}</strong>${detail ? `<small>${detail}</small>` : ''}</span></span>` : '';
const sampleNote = text => MAQUETTE ? `<p class="sample-note">${icon('chat')}${text}</p>` : '';
const newRef = () => { const d = new Date(); return `LSK-${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`; };

/* ───────────── Garder une offre ───────────── */
const FAV_KEY = 'laska-offres-gardees';
const favList = () => { try { return JSON.parse(localStorage.getItem(FAV_KEY) || '[]'); } catch { return []; } };
const isFav = id => favList().includes(id);
function toggleFav(id) {
  const list = favList(), on = !list.includes(id), next = on ? [...list, id] : list.filter(x => x !== id);
  try { localStorage.setItem(FAV_KEY, JSON.stringify(next)); } catch {}
  return on;
}
const favButton = (o, cls = '') => `<button type="button" class="fav ${cls}" data-fav="${o.id}" aria-pressed="${isFav(o.id)}" aria-label="Garder l’offre ${esc(o.specialty)}, ${esc(o.city)}">${icon('heart')}${cls.includes('fav-lg') ? `<span>${isFav(o.id) ? 'Gardée' : 'Garder'}</span>` : ''}</button>`;
function syncFavButtons(id) {
  const on = isFav(id);
  $$(`[data-fav="${id}"]`).forEach(b => { b.setAttribute('aria-pressed', on); const t = $('span', b); if (t) t.textContent = on ? 'Gardée' : 'Garder'; });
  $$('[data-fav-count]').forEach(el => el.textContent = favList().length);
}

/* ───────────── Partager une offre ───────────── */
function shareOffer(o) {
  const url = `${location.origin}${location.pathname}#/offre/${o.id}`, text = `Offre Laska Corporate : ${o.specialty}, ${o.place} — ${slotRange(o)}`;
  if (navigator.share && matchMedia('(pointer: coarse)').matches) { navigator.share({title: `Laska Corporate — ${o.specialty}`, text, url}).catch(() => {}); return; }
  const d = document.createElement('dialog'); d.className = 'guard share-dialog'; d.setAttribute('aria-labelledby', 'share-title');
  d.innerHTML = `<div class="guard-body">${icon('share')}<h2 id="share-title">Partager cette offre</h2><p>${esc(o.specialty)}, ${esc(o.place)}</p>
    <div class="share-list"><a class="help-item" href="https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}" target="_blank" rel="noopener">${icon('chat')}<span><strong>WhatsApp</strong>Envoyer à un collègue</span></a>
    <a class="help-item" href="mailto:?subject=${encodeURIComponent(`Offre Laska Corporate : ${o.specialty}`)}&body=${encodeURIComponent(`${text}\n${url}`)}">${icon('mail')}<span><strong>Email</strong>Ouvrir votre messagerie</span></a>
    <button type="button" class="help-item" data-copy-link>${icon('link')}<span><strong>Copier le lien</strong>Pour le coller où vous voulez</span></button></div>
    <button type="button" class="guard-close" aria-label="Fermer">${icon('close')}</button></div>`;
  document.body.append(d);
  d.addEventListener('click', e => {
    if (e.target.closest('[data-copy-link]')) { (navigator.clipboard?.writeText(url) || Promise.reject()).then(() => toast('Lien copié. Collez-le où vous voulez.'), () => toast(`Lien : ${url}`, {icon: 'link'})); d.close(); }
    else if (e.target.closest('.share-list a')) d.close();
    else if (e.target.closest('.guard-close') || e.target === d) d.close();
  });
  d.addEventListener('close', () => d.remove());
  d.showModal();
}

/* ───────────── Aide toujours visible ───────────── */
function waText() {
  const o = route === '/offre' ? offers.find(x => x.id === offerId) : null;
  if (o) return `Bonjour, je vous contacte au sujet de l’offre ${o.specialty} à ${o.city}, ${o.dept} (réf. ${o.ref}).`;
  const side = pageSide();
  return side === 'pro' ? 'Bonjour, je suis praticien et j’aimerais des informations.' : side === 'etab' ? 'Bonjour, je recrute pour un établissement et j’aimerais vous parler d’un besoin.' : 'Bonjour, j’aimerais des informations.';
}
const waLink = () => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(waText())}`;
/* Bouton « Aide » : en bas à droite sur ordinateur (il s’efface pendant le défilement), dans l’en-tête sur téléphone. */
function ensureHelp() {
  if (document.querySelector('.help-fab')) return;
  document.body.insertAdjacentHTML('beforeend', `<button type="button" class="help-fab" popovertarget="help-panel" aria-haspopup="dialog">${icon('chat')}<span>Aide</span></button><div class="help-panel" id="help-panel" popover role="dialog" aria-labelledby="help-title"></div>`);
  const panel = $('#help-panel');
  let still;
  addEventListener('scroll', () => { document.body.classList.add('is-scrolling'); clearTimeout(still); still = setTimeout(() => document.body.classList.remove('is-scrolling'), 450); }, {passive: true});
  panel.addEventListener('beforetoggle', e => {
    if (e.newState !== 'open') return;
    panel.innerHTML = `<div class="help-head"><h2 id="help-title">Une question ? Nous sommes là.</h2><button type="button" class="multi-close" popovertarget="help-panel" popovertargetaction="hide" aria-label="Fermer">${icon('close')}</button></div>
      <p class="help-hours">${icon('clock')}Du lundi au vendredi, de 9 h à 18 h</p>
      <a class="help-item" href="${TEL}">${icon('phone')}<span><strong>Appeler</strong>${PHONE}</span></a>
      <a class="help-item" href="${waLink()}" target="_blank" rel="noopener">${icon('chat')}<span><strong>Écrire sur WhatsApp</strong>Pratique depuis l’étranger</span></a>
      <button type="button" class="help-item" data-callback>${icon('phone')}<span><strong>Être rappelé</strong>Laissez votre numéro, nous vous appelons</span></button>
      <a class="help-item" href="#/contact">${icon('mail')}<span><strong>Écrire un message</strong>Réponse sous 24 h ouvrées</span></a>`;
  });
  panel.addEventListener('toggle', e => { $$('.help-fab, .header-help').forEach(b => b.setAttribute('aria-expanded', e.newState === 'open')); if (e.newState === 'open') $('.help-item', panel)?.focus(); });
  panel.addEventListener('click', e => { if (e.target.closest('a.help-item, [data-callback]')) panel.hidePopover(); });
}

/* ───────────── Être rappelé ───────────── */
function callbackDialog() {
  const o = route === '/offre' ? offers.find(x => x.id === offerId) : null, side = pageSide(), whens = ['Le matin (9 h – 12 h)', 'À midi (12 h – 14 h)', 'L’après-midi (14 h – 18 h)'];
  const d = document.createElement('dialog'); d.className = 'guard callback-dialog'; d.setAttribute('aria-labelledby', 'cb-title');
  d.innerHTML = `<div class="guard-body">${icon('phone')}<h2 id="cb-title">Être rappelé</h2><p>Laissez votre numéro : un conseiller vous appelle au moment choisi, du lundi au vendredi.</p>
    <form class="cb-form form-grid" novalidate>
      <div class="field full"><label for="cb-name">Votre nom <span class="req" aria-hidden="true">*</span></label><input id="cb-name" name="name" autocomplete="name" required></div>
      ${phoneField('phone', 'Votre téléphone', {id: 'cb-phone'})}
      <fieldset class="field full pills-field"><legend>Quand vous rappeler ?</legend><div class="pills">${whens.map((t, i) => `<label class="pill"><input type="radio" name="when" value="${t}" ${i ? '' : 'checked'}><span>${t}</span></label>`).join('')}</div></fieldset>
      <fieldset class="field full pills-field"><legend>Vous êtes</legend><div class="pills">${[['pro', 'Praticien'], ['etab', 'Établissement']].map(([v, t]) => `<label class="pill"><input type="radio" name="who" value="${v}" ${side === v ? 'checked' : ''}><span>${t}</span></label>`).join('')}</div></fieldset>
      ${o ? `<p class="cb-about field full">${icon('file')}À propos de l’offre <strong>${esc(o.specialty)}</strong>, ${esc(o.place)} · réf. ${o.ref}</p>` : ''}
      <div class="guard-actions full"><button type="submit" class="btn btn-coral">Me faire rappeler${icon('arrow')}</button></div>
    </form><button type="button" class="guard-close" aria-label="Fermer">${icon('close')}</button></div>`;
  document.body.append(d);
  const form = $('.cb-form', d), phone = $('#cb-phone', d);
  const fail = (input, message) => { input.setAttribute('aria-invalid', 'true'); const p = document.createElement('p'); p.className = 'error-text'; p.id = `${input.id}-error`; p.innerHTML = `${icon('close')}${message}`; input.setAttribute('aria-describedby', p.id); input.closest('.field').append(p); };
  const box = phone.closest('.phone-field'), code = $('[data-phone-code]', box);
  box.addEventListener('change', () => fixPhone(box));
  form.addEventListener('submit', e => {
    e.preventDefault(); $$('.error-text', form).forEach(p => p.remove()); $$('[aria-invalid]', form).forEach(i => i.removeAttribute('aria-invalid'));
    const name = $('#cb-name', d);
    if (!name.value.trim()) fail(name, 'Indiquez votre nom.');
    fixPhone(box);
    if (!phone.value.trim()) fail(phone, 'Indiquez votre numéro.');
    else if (phoneProblem(phone.value, code.value)) fail(phone, phoneProblem(phone.value, code.value));
    const bad = $('[aria-invalid="true"]', form); if (bad) { bad.focus(); return; }
    const when = form.querySelector('[name="when"]:checked').value.toLowerCase().replace(/\s*\(.*\)/, ''), ref = newRef();
    $('.guard-body', d).innerHTML = `<div class="success-symbol"><svg viewBox="0 0 52 52" aria-hidden="true"><circle cx="26" cy="26" r="24"/><path d="m15 27 7 7 15-16"/></svg></div><h2 id="cb-title" tabindex="-1">C’est noté.</h2><p>Un conseiller vous appelle <strong>${esc(when)}</strong>, au <strong>${esc(phoneText(phone.value, code.value))}</strong>. Votre référence : <strong>${ref}</strong>.</p><div class="notice">${icon('shield')}<p><strong>Simulation.</strong> Aucune donnée n’a été envoyée.</p></div><div class="guard-actions"><button type="button" class="btn btn-primary" data-close>Fermer</button></div>`;
    $('#cb-title', d).focus();
  });
  d.addEventListener('click', e => { if (e.target.closest('.guard-close, [data-close]') || e.target === d) d.close(); });
  d.addEventListener('close', () => d.remove());
  d.showModal(); $('#cb-name', d).focus();
}

/* ───────────── Suis-je éligible ? ─────────────
   Orientation indicative, rédigée avec prudence : elle ne remplace pas l’étude du dossier par le conseiller. */
const ELIG_QUESTIONS = [
  {key: 'diploma', q: 'Où avez-vous obtenu votre diplôme ?', options: [['fr', 'En France'], ['ue', 'Dans l’Union européenne, l’EEE ou en Suisse'], ['hors', 'Hors de l’Union européenne']]},
  {key: 'profession', q: 'Quelle est votre profession ?', options: [['medecin', 'Médecin'], ['dentiste', 'Chirurgien-dentiste'], ['sf', 'Sage-femme'], ['pharma', 'Pharmacien'], ['para', 'Infirmier ou autre profession paramédicale']]},
  {key: 'stage', q: 'Où en êtes-vous ?', when: a => !a.diploma || (a.diploma === 'hors' && a.profession !== 'para'), options: [['debut', 'Je n’ai pas encore validé les épreuves de vérification des connaissances (EVC)'], ['evc', 'J’ai réussi les EVC, sans autorisation d’exercice pour l’instant'], ['pcc', 'Je suis en parcours de consolidation des compétences'], ['autorisation', 'J’ai réussi les EVC et j’ai mon autorisation d’exercice']]}
];
/* Réponse au test → situation préremplie dans le dossier (voir SITUATIONS dans app.js). */
const eligSituation = a => a.diploma === 'fr' || a.diploma === 'ue' ? SIT_EU : a.stage === 'autorisation' ? SIT_AUTH : a.stage === 'evc' || a.stage === 'pcc' ? SIT_EVC : SIT_NONE;
const eligSteps = a => ELIG_QUESTIONS.filter(q => !q.when || q.when(a));
function eligResult(a) {
  const docs = ['Votre diplôme et sa traduction en français', 'Une pièce d’identité', 'Votre CV', 'Les justificatifs de votre expérience'];
  if (a.diploma === 'fr') return {title: 'Vous pouvez exercer avec votre diplôme français.', text: 'Après votre inscription au tableau de l’Ordre de votre profession, vous pouvez prendre un poste. Laska Corporate vous propose directement des offres adaptées.', steps: ['Inscription à l’Ordre de votre profession', 'Choix d’une offre avec votre conseiller', 'Prise de poste'], docs: ['Votre diplôme', 'Une pièce d’identité', 'Votre CV'], offers: true};
  if (a.diploma === 'ue') return {title: 'Votre diplôme est le plus souvent reconnu de façon simplifiée.', text: 'Pour ces professions, les diplômes obtenus dans l’Union européenne, l’EEE ou en Suisse bénéficient en général d’une reconnaissance facilitée. Votre conseiller vérifie votre diplôme et vous accompagne jusqu’à l’inscription à l’Ordre.', steps: ['Vérification de votre diplôme', 'Inscription à l’Ordre', 'Choix d’une offre et prise de poste'], docs, offers: true};
  if (a.profession === 'para') return {title: 'Une étude de votre dossier est nécessaire.', text: 'Pour les professions paramédicales, un diplôme obtenu hors de l’Union européenne ne permet généralement pas d’exercer directement en France : une formation complémentaire ou le diplôme d’État français est le plus souvent demandé. Votre conseiller étudie votre parcours et les équivalences possibles.', steps: ['Étude de votre diplôme et de votre expérience', 'Orientation vers la formation ou la procédure adaptée', 'Mise en relation avec des établissements'], docs: [...docs, 'Un justificatif de niveau de français, si vous en avez un'], offers: false, specialty: 'Paramédical'};
  const path = ['Épreuves de vérification des connaissances (EVC)', 'Parcours de consolidation des compétences dans un établissement de santé', 'Autorisation d’exercice, puis inscription à l’Ordre'];
  const at = {debut: 0, evc: 1, pcc: 1, autorisation: 2}[a.stage] ?? 0;
  const extra = a.stage === 'evc' || a.stage === 'pcc' ? ['Vos résultats aux EVC'] : a.stage === 'autorisation' ? ['Votre autorisation d’exercice'] : [];
  if (a.stage === 'autorisation') return {title: 'Vous pouvez postuler aux offres.', text: 'Avec votre autorisation d’exercice et votre inscription à l’Ordre, vous pouvez prendre un poste. Joignez une copie de votre autorisation à votre dossier.', steps: path, at: 3, docs: [...docs, ...extra], offers: true};
  const next = {debut: 'Votre conseiller vous explique les épreuves et leur calendrier, et vous aide à préparer votre dossier.', evc: 'Vos EVC sont validées : votre conseiller vous aide à préparer la suite, le parcours de consolidation des compétences, puis l’autorisation d’exercice.', pcc: 'Des établissements accueillent des praticiens en parcours de consolidation : votre conseiller vous oriente vers les postes adaptés.'}[a.stage] || '';
  return {title: 'Votre voie : la procédure d’autorisation d’exercice.', text: `Avec un diplôme obtenu hors de l’Union européenne, la voie habituelle comporte trois étapes. ${next}`, steps: path, at, docs: [...docs, ...extra, 'Un justificatif de niveau de français, si vous en avez un'], offers: a.stage === 'pcc' || a.stage === 'evc'};
}
function eligibility() {
  return `<section class="page-heading"><div class="container">${breadcrumb([['Praticiens', '#/praticiens'], ['Suis-je éligible ?']])}<h1>${dot('Suis-je éligible ?')}</h1><p class="lead">Trois questions pour savoir par où commencer. Gratuit.</p></div></section>
  <section class="elig-section"><div class="container elig-layout"><div class="form-card elig-card" id="elig">${eligStep()}</div>
    <aside class="elig-aside"><p>${icon('shield')}<span>Cette orientation est indicative. Votre conseiller vérifie votre situation exacte, gratuitement.</span></p><p>${icon('phone')}<span>Une question ? <a class="text-link" href="${TEL}">${PHONE}</a></span></p></aside></div></section>`;
}
function eligStep() {
  const a = state.elig, list = eligSteps(a), i = a.step;
  if (i >= list.length) return eligResultHTML(eligResult(a));
  const q = list[i];
  return `<div class="elig-progress" aria-hidden="true">${list.map((_, k) => `<span class="${k < i ? 'is-done' : k === i ? 'is-on' : ''}"></span>`).join('')}</div>
    <p class="elig-count">Question ${i + 1} sur ${list.length}</p><h2 tabindex="-1">${q.q}</h2>
    <div class="elig-options">${q.options.map(([v, t], k) => `<button type="button" class="elig-option" style="--c:${k}" data-elig="${q.key}" data-value="${v}" aria-pressed="${a[q.key] === v}"><span>${t}</span>${icon('arrow')}</button>`).join('')}</div>
    ${i ? `<button type="button" class="reset-link elig-back" data-elig-back>${icon('back')}Question précédente</button>` : ''}`;
}
function eligResultHTML(r) {
  return `<div class="elig-result"><p class="elig-count">Votre orientation</p><h2 tabindex="-1">${dot(r.title)}</h2><p class="elig-text">${r.text}</p>
    <ol class="mini-steps elig-path">${r.steps.map((s, k) => `<li class="${r.at !== undefined && k < r.at ? 'is-done' : r.at === k ? 'is-here' : ''}"><strong>${s}</strong>${r.at === k ? '<em>Vous êtes ici</em>' : ''}</li>`).join('')}</ol>
    <h3>Préparez, si possible</h3>${checkList(r.docs)}
    <div class="actions"><a class="btn btn-coral" href="#/postuler" data-elig-apply>Créer mon dossier${icon('arrow')}</a>${r.offers ? btn('Voir les offres', '#/offres', 'outline', '') : ''}<button type="button" class="reset-link" data-elig-restart>Recommencer</button></div></div>`;
}
function bindEligibility(root = document) {
  const box = $('#elig', root); if (!box) return;
  const paint = () => { box.innerHTML = eligStep(); $('h2', box)?.focus({preventScroll: true}); box.scrollIntoView({block: 'nearest', behavior: 'smooth'}); };
  box.addEventListener('click', e => {
    const opt = e.target.closest('[data-elig]');
    if (opt) { state.elig[opt.dataset.elig] = opt.dataset.value; $$('[data-elig]', box).forEach(b => b.setAttribute('aria-pressed', b === opt)); state.elig.step++; setTimeout(paint, matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 160); return; }
    if (e.target.closest('[data-elig-back]')) { state.elig.step = Math.max(0, state.elig.step - 1); paint(); return; }
    if (e.target.closest('[data-elig-restart]')) { state.elig = {step: 0}; paint(); return; }
    if (e.target.closest('[data-elig-apply]')) {
      const r = eligResult(state.elig), v = state.candidate.values;
      v.stage = eligSituation(state.elig); if (r.specialty) v.specialties = [r.specialty];
    }
  });
}

/* ───────────── Avis des praticiens ─────────────
   Côté visiteur : il lit les avis et peut ajouter le sien (nom, prénom, spécialité, pays d’exercice, texte, note sur 5).
   Côté back-office uniquement (le visiteur n’en voit rien) : chaque avis est validé avant publication,
   statut « pending » → « approved » (ou « rejected »), et l’équipe choisit ceux repris en témoignage (featured).
   Publication : prénom, initiale du nom, spécialité, pays.
   Maquette : avis gardés dans ce navigateur (localStorage), avec des avis d’exemple posés au premier passage ;
   back-office simulé sur #/admin/avis (aucun lien depuis le site visiteur : adresse à taper).
   Production : POST /api/avis (statut « en attente » dans le CRM), modération dans le CRM ou le back-office,
   GET /api/avis?statut=publie pour l’affichage. En Next.js : <ReviewsSection>, <ReviewForm>, <StarRating>. */
const AVIS_KEY = 'laska-avis';
/* Avis d’EXEMPLE, fictifs, pour présenter la maquette : à remplacer par les vrais avis avant publication.
   Tous publiés ; les trois plus récents sont repris en témoignage sur l’accueil. */
const SAMPLE_AVIS = [
  {id: 'EX-1', firstName: 'Karim', lastName: 'Haddad', specialty: 'Médecine d’urgence', country: 'France', stars: 5, featured: true, date: '2026-10-20T09:30:00Z', text: 'Un accompagnement sérieux, du premier appel jusqu’à ma prise de poste à Lyon. Mon conseiller a toujours répondu à mes questions.'},
  {id: 'EX-2', firstName: 'Salma', lastName: 'Benali', specialty: 'Pédiatrie', country: 'France', stars: 5, featured: true, date: '2026-10-14T14:10:00Z', text: 'Des démarches longues, mais expliquées clairement à chaque étape. Je savais toujours ce qui restait à faire, et pourquoi.'},
  {id: 'EX-3', firstName: 'Nadia', lastName: 'Cherif', specialty: 'Anesthésie-réanimation', country: 'France', stars: 5, featured: true, date: '2026-10-08T11:00:00Z', text: 'J’ai trouvé un poste qui correspond à mon parcours, avec un vrai suivi après mon arrivée dans l’équipe.'},
  {id: 'EX-4', firstName: 'Mehdi', lastName: 'Touati', specialty: 'Médecine générale', country: 'France', stars: 5, featured: false, date: '2026-09-29T16:45:00Z', text: 'Mon dossier d’autorisation d’exercice était complexe : on m’a aidé à rassembler chaque pièce, sans jamais me presser.'},
  {id: 'EX-5', firstName: 'Amina', lastName: 'Diallo', specialty: 'Gériatrie', country: 'France', stars: 4, featured: false, date: '2026-09-18T10:20:00Z', text: 'Des propositions de remplacement adaptées à mes disponibilités, et un interlocuteur facile à joindre.'},
  {id: 'EX-6', firstName: 'Rania', lastName: 'Kefi', specialty: 'Psychiatrie', country: 'Tunisie', stars: 5, featured: false, date: '2026-09-05T08:15:00Z', text: 'J’ai commencé mes démarches depuis Tunis. Les rendez-vous par téléphone et sur WhatsApp m’ont beaucoup simplifié la vie.'}
].map(r => ({...r, status: 'approved', sample: true}));
const avisList = () => {
  try {
    const raw = localStorage.getItem(AVIS_KEY);
    if (raw === null && MAQUETTE) { localStorage.setItem(AVIS_KEY, JSON.stringify(SAMPLE_AVIS)); return SAMPLE_AVIS.map(r => ({...r})); }
    return JSON.parse(raw || '[]');
  } catch { return SAMPLE_AVIS.map(r => ({...r})); }
};
const saveAvis = list => { try { localStorage.setItem(AVIS_KEY, JSON.stringify(list)); } catch {} };
const publishedAvis = () => avisList().filter(r => r.status === 'approved').sort((a, b) => b.date.localeCompare(a.date));
const STAR = 'M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8Z';
const STAR_WORDS = ['', 'Décevant', 'Moyen', 'Bien', 'Très bien', 'Excellent'];
const starSVG = (cls = '') => `<svg class="star ${cls}" viewBox="0 0 24 24" aria-hidden="true"><path d="${STAR}"/></svg>`;
const starsHTML = (n, label = true) => `<span class="stars" ${label ? `role="img" aria-label="Note : ${n} sur 5"` : 'aria-hidden="true"'}>${[1, 2, 3, 4, 5].map(i => starSVG(i <= n ? 'is-on' : '')).join('')}</span>`;
const avisWho = r => [r.specialty, r.country].filter(Boolean).map(esc).join(' · ');
const shortName = r => `${r.firstName} ${r.lastName ? `${r.lastName.trim()[0].toUpperCase()}.` : ''}`.trim();
const monthYear = iso => new Intl.DateTimeFormat('fr-FR', {month: 'long', year: 'numeric'}).format(new Date(iso));
function avisCard(r, {admin = false} = {}) {
  return `<figure class="avis-card">${starsHTML(r.stars)}<blockquote>${esc(r.text)}</blockquote>
    <figcaption><span class="avis-avatar" aria-hidden="true">${esc((r.firstName || '?')[0].toUpperCase())}</span><span><strong>${esc(admin ? `${r.firstName} ${r.lastName}` : shortName(r))}</strong>${avisWho(r)}<small>${admin ? `Déposé le ${new Intl.DateTimeFormat('fr-FR', {dateStyle: 'long', timeStyle: 'short'}).format(new Date(r.date))}` : monthYear(r.date)}</small></span></figcaption></figure>`;
}
function avisSummary(list) {
  const avg = list.reduce((n, r) => n + r.stars, 0) / list.length;
  return `<p class="avis-summary">${starsHTML(Math.round(avg))}<strong>${avg.toLocaleString('fr-FR', {maximumFractionDigits: 1})} sur 5</strong><span>${list.length} avis publié${list.length > 1 ? 's' : ''}</span></p>`;
}
const avisEmpty = (link = true) => `<div class="avis-empty">${starsHTML(0, false)}<div><strong>Les premiers avis arrivent.</strong><p>Vous avez été accompagné par Laska Corporate ? Racontez votre parcours, il aidera d’autres praticiens.</p></div>${link ? btn('Donner mon avis', '#/avis', 'outline', '') : ''}</div>`;
/* Bloc d’avis de la page Praticiens : les trois plus récents. */
function avisSection() {
  const list = publishedAvis();
  if (!list.length && !MAQUETTE) return '';
  return `<section class="section avis-band"><div class="container"><div class="section-head"><div><h2>${dot('Avis des praticiens.')}</h2>${list.length ? avisSummary(list) : ''}</div>${list.length ? `<a class="text-link" href="#/avis">Tous les avis et donner le mien${icon('arrow')}</a>` : ''}</div>
    ${list.length ? `<div class="avis-grid">${list.slice(0, 3).map(r => avisCard(r)).join('')}</div>` : avisEmpty()}${list.some(r => r.sample) ? sampleNote('Avis d’exemple pour la maquette, à remplacer par les vrais avis.') : ''}</div></section>`;
}
function starInput() {
  return `<fieldset class="field full star-field" id="rvStars-group"><legend>Votre note <span class="req" aria-hidden="true">*</span></legend><div class="star-row"><div class="star-input">${[1, 2, 3, 4, 5].map(i => `<label class="star-pick"><input type="radio" name="rvStars" value="${i}" required data-group-msg="Choisissez une note, de 1 à 5 étoiles.">${starSVG()}<span class="sr-only">${i} sur 5 : ${STAR_WORDS[i]}</span></label>`).join('')}</div><span class="star-say" aria-hidden="true">Touchez une étoile</span></div></fieldset>`;
}
function avisForm() {
  return `<div class="form-head"><div><h2 id="avis-title">Donner mon avis</h2><p class="muted small"><span class="req">*</span> Champs obligatoires</p></div></div>
    <form id="avis-form" novalidate aria-labelledby="avis-title"><div id="form-errors"></div><div class="form-grid">
      ${field('rvFirstName', 'Prénom', {autocomplete: 'given-name'})}${field('rvLastName', 'Nom <span class="field-note">facultatif</span>', {required: false, autocomplete: 'family-name', help: 'Seule l’initiale est publiée.'})}
      ${starInput()}
      ${field('rvText', 'Votre avis', {type: 'textarea', full: true, placeholder: 'Votre accompagnement, votre conseiller, votre prise de poste…', help: '20 caractères minimum, 500 maximum.', attrs: 'data-min="20"'})}
      ${field('rvSpecialty', 'Votre spécialité <span class="field-note">facultatif</span>', {required: false, options: allSpecialties, full: true})}
      ${field('rvCountry', 'Pays d’exercice <span class="field-note">facultatif</span>', {required: false, options: countries, full: true, help: 'Le pays où vous exercez aujourd’hui.'})}
      ${when('rvCountry:Autre pays', false, field('rvCountryOther', 'Quel pays ?', {required: false, full: true}))}
      <div class="field full consent-field"><label class="choice-inline"><input type="checkbox" name="rvConsent" required data-error-label="Accord pour la publication" data-missing="Cochez cette case : sans votre accord, nous ne pouvons pas publier votre avis."><span>J’accepte que mon avis soit publié avec mon prénom et, si je les indique, l’initiale de mon nom, ma spécialité et mon pays. Il peut aussi être repris sur la page d’accueil.</span></label></div>
    </div>${consentField()}
    <div class="form-actions"><button type="submit" class="btn btn-primary btn-full">Envoyer mon avis${icon('arrow')}</button></div></form>`;
}
function avisThanks(r) {
  return `<div class="success-state avis-thanks"><div class="success-symbol"><svg viewBox="0 0 52 52" aria-hidden="true"><circle cx="26" cy="26" r="24"/><path d="m15 27 7 7 15-16"/></svg></div><h2 tabindex="-1">${dot('Merci pour votre avis.')}</h2>
    <p>Votre avis est bien envoyé, signé <strong>${esc(shortName(r))}</strong> : il aidera d’autres praticiens à se lancer.</p>
    <div class="notice">${icon('shield')}<p><strong>Simulation terminée.</strong> Aucune donnée n’a été envoyée.</p></div>
    <div class="actions">${btn('Retour à l’accueil', '#/', 'primary', '')}${btn('Lire les avis', '#/avis', 'outline', '')}</div></div>`;
}
function avisPage() {
  const list = publishedAvis();
  return `<section class="page-heading"><div class="container">${breadcrumb([['Avis des praticiens']])}<h1>${dot('Avis des praticiens.')}</h1><p class="lead">Ils ont été accompagnés par Laska Corporate. Vous aussi ? Partagez votre expérience.</p><div class="actions"><button type="button" class="btn btn-coral" data-goto="donner-mon-avis">${icon('pen')}Donner mon avis</button></div></div></section>
  <div class="container avis-layout"><div class="avis-list">${list.length ? avisSummary(list) + list.map(r => avisCard(r)).join('') : avisEmpty(false)}
    ${list.some(r => r.sample) ? sampleNote('Avis d’exemple pour la maquette, à remplacer par les vrais avis.') : ''}</div>
    <div class="form-card avis-form-card" id="donner-mon-avis">${avisForm()}</div></div>`;
}
/* Modération (maquette) : en production, réservée à l’équipe, ou faite dans le CRM. */
function adminAvis() {
  return `<section class="page-heading"><div class="container">${breadcrumb([['Avis des praticiens', '#/avis'], ['Modération']])}<h1>${dot('Modération des avis.')}</h1><p class="lead">Un avis n’apparaît sur le site qu’une fois publié ici.</p>${sampleNote('Maquette : en production, cette page est réservée à l’équipe (connexion) ou remplacée par la modération du CRM.')}</div></section>
  <div class="container avis-admin" id="avis-admin">${adminLists()}</div>`;
}
function adminLists() {
  const list = avisList(), by = st => list.filter(r => r.status === st).sort((a, b) => b.date.localeCompare(a.date));
  const group = (title, st, actions, empty) => {
    const items = by(st);
    /* Avis publiés : en plus, « Mettre en témoignage » (section « Ils nous font confiance. » de l’accueil). */
    const feature = r => st === 'approved' ? `<button type="button" class="btn ${r.featured ? 'btn-outline' : 'btn-primary'}" data-feature="${r.id}" aria-pressed="${!!r.featured}">${icon(r.featured ? 'close' : 'heart')}${r.featured ? 'Retirer des témoignages' : 'Mettre en témoignage'}</button>` : '';
    return `<section class="admin-group" data-group="${st}"><h2 tabindex="-1">${title} <span class="admin-n">${items.length}</span></h2>${items.length ? `<ul class="admin-list">${items.map(r => `<li class="admin-item ${st === 'approved' && r.featured ? 'is-featured' : ''}">${st === 'approved' && r.featured ? `<span class="admin-badge">${icon('heart')}Témoignage sur l’accueil</span>` : ''}${avisCard(r, {admin: true})}<div class="admin-actions">${feature(r)}${actions.map(([to, label, kind]) => `<button type="button" class="btn ${kind}" data-avis="${r.id}:${to}">${label}</button>`).join('')}</div></li>`).join('')}</ul>` : `<p class="admin-empty">${empty}</p>`}</section>`;
  };
  return group('En attente', 'pending', [['approved', 'Publier', 'btn-primary'], ['rejected', 'Refuser', 'btn-outline']], 'Aucun avis en attente de validation.')
    + group('Publiés', 'approved', [['rejected', 'Retirer du site', 'btn-outline']], 'Aucun avis publié pour le moment.')
    + group('Refusés', 'rejected', [['approved', 'Publier', 'btn-outline']], 'Aucun avis refusé.')
    + `<div class="admin-tools"><button type="button" class="reset-link" data-avis-samples>${icon('back')}Revenir aux avis d’exemple</button>${list.length ? `<button type="button" class="reset-link" data-avis-reset>${icon('close')}Effacer tous les avis de ce navigateur</button>` : ''}</div>`;
}
function bindAvis(root = document) {
  const form = $('#avis-form', root);
  if (form) {
    const say = $('.star-say', form);
    form.addEventListener('change', e => {
      if (e.target.name === 'rvStars') { say.textContent = `${e.target.value} sur 5 : ${STAR_WORDS[e.target.value]}`; say.classList.add('is-set'); }
      syncConditionals(form); clearError(e.target);
    });
    form.addEventListener('input', e => clearError(e.target));
    syncConditionals(form);
    form.addEventListener('submit', e => {
      e.preventDefault(); syncConditionals(form); if (!validate(form)) return;
      const d = new FormData(form), get = k => String(d.get(k) || '').trim();
      const item = {id: `AV-${Date.now().toString(36)}`, firstName: get('rvFirstName'), lastName: get('rvLastName'), specialty: get('rvSpecialty'), country: get('rvCountry') === 'Autre pays' ? get('rvCountryOther') : get('rvCountry'), text: get('rvText'), stars: Number(get('rvStars')), status: 'pending', date: new Date().toISOString()};
      saveAvis([...avisList(), item]);
      const card = form.closest('.form-card'); card.innerHTML = avisThanks(item);
      card.scrollIntoView({block: 'start', behavior: 'smooth'}); $('h2', card).focus({preventScroll: true});
    });
  }
  const admin = $('#avis-admin', root); if (!admin) return;
  const paint = st => { admin.innerHTML = adminLists(); $(`[data-group="${st}"] h2`, admin)?.focus({preventScroll: true}); };
  const say = {approved: 'Avis publié : il apparaît sur le site.', rejected: 'Avis retiré : il n’apparaît pas sur le site.', pending: 'Avis remis en attente.'};
  admin.addEventListener('click', e => {
    if (e.target.closest('[data-avis-samples]')) {
      askChoice({title: 'Revenir aux avis d’exemple ?', text: 'Les avis de ce navigateur sont remplacés par les six avis d’exemple de la maquette, dont trois en témoignage.', choices: [{label: 'Garder les avis actuels', run: () => {}}, {label: 'Revenir aux exemples', run: () => { saveAvis(SAMPLE_AVIS); paint('approved'); toast('Avis d’exemple remis en place.'); }}]});
      return;
    }
    if (e.target.closest('[data-avis-reset]')) {
      askChoice({title: 'Effacer tous les avis ?', text: 'Les avis déposés dans ce navigateur (maquette) seront supprimés.', choices: [{label: 'Garder les avis', run: () => {}}, {label: 'Tout effacer', run: () => { saveAvis([]); paint('pending'); toast('Avis effacés.', {icon: 'close'}); }}]});
      return;
    }
    const f = e.target.closest('[data-feature]');
    if (f) {
      const list = avisList(), item = list.find(r => r.id === f.dataset.feature); if (!item) return;
      item.featured = !item.featured; saveAvis(list); paint('approved');
      toast(item.featured ? 'Avis mis en témoignage : il apparaît dans « Ils nous font confiance. » sur l’accueil.' : 'Avis retiré des témoignages. Il reste publié parmi les avis.', {icon: 'heart', action: {label: 'Annuler', run: () => { const l = avisList(), it = l.find(r => r.id === item.id); if (it) { it.featured = !it.featured; saveAvis(l); paint('approved'); } }}});
      return;
    }
    const b = e.target.closest('[data-avis]'); if (!b) return;
    const [id, to] = b.dataset.avis.split(':'), list = avisList(), item = list.find(r => r.id === id); if (!item) return;
    /* Un avis qui quitte « Publiés » cesse aussi d’être un témoignage. */
    const from = item.status, wasFeatured = !!item.featured; item.status = to; if (to !== 'approved') item.featured = false; saveAvis(list); paint(from);
    toast(say[to] + (wasFeatured && to !== 'approved' ? ' Il est aussi retiré des témoignages.' : ''), {icon: to === 'approved' ? 'check' : 'close', action: {label: 'Annuler', run: () => { const l = avisList(), it = l.find(r => r.id === id); if (it) { it.status = from; it.featured = wasFeatured; saveAvis(l); paint(from); } }}});
  });
}

/* ───────────── Témoignages : « Ils nous font confiance. » ─────────────
   Uniquement des témoignages, extraits des avis : dans le back-office, l’équipe choisit parmi les avis publiés
   ceux à « mettre en témoignage » (r.featured). Les trois plus récents s’affichent, le premier en grand.
   Sans témoignage choisi, la section n’apparaît pas. */
const temoignages = () => publishedAvis().filter(r => r.featured);
const temoignage = (r, i) => `<figure class="temoignage ${i === 0 ? 'is-lead' : ''}"><span class="temoignage-mark" aria-hidden="true">“</span><blockquote>${esc(r.text)}</blockquote><figcaption>${starsHTML(r.stars)}<span><strong>${esc(shortName(r))}</strong>${avisWho(r)}</span></figcaption></figure>`;
function temoignagesSection() {
  const list = temoignages().slice(0, 3);
  if (!list.length) return '';
  return `<section class="section temoignages-band"><div class="container"><div class="section-head"><h2>${dot('Ils nous font confiance.')}</h2><a class="text-link" href="#/avis">Lire les avis ou donner le vôtre${icon('arrow')}</a></div>
    <div class="temoignages is-${list.length}">${list.map(temoignage).join('')}</div>${list.some(r => r.sample) ? sampleNote('Témoignages d’exemple pour la maquette, à remplacer par de vrais avis.') : ''}</div></section>`;
}
/* Tarifs et délais côté établissements : à fournir par Laska Corporate. */
const PRICING = {interim: '', cdi: '', delay: ''};
