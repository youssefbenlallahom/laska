/* Laska — couche de mouvement (v4, corrigée en v8 : la lecture d’abord).
   Une seule idée : la route jusqu’à la destination.
   – Les titres montent mot à mot, puis la pastille corail « atterrit » sur le point final.
   – La carte se dessine en vague depuis la Méditerranée ; les pastilles se posent quand la vague les atteint.
   – Le parcours praticien se trace pendant le défilement ; ses textes restent lisibles ; « France » s’allume à l’arrivée.
   – Les listes filtrées se réordonnent sans saut (FLIP), les compteurs changent en douceur.
   Chargé avant app.js. Rien n’est masqué si ce fichier échoue ; « réduire les animations » supprime les déplacements
   et garde les changements d’état (couleur, opacité). En Next.js : un hook useReveal + un composant <SplitTitle>. */
(() => {
  const html = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const EASE_OUT = 'cubic-bezier(.22,1,.36,1)', EASE_IO = 'cubic-bezier(.76,0,.24,1)';
  const moving = () => !reduced.matches;
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const syncMode = () => html.classList.toggle('motion-ok', moving());
  syncMode();
  reduced.addEventListener?.('change', syncMode);

  /* ───────────── Titres découpés en mots ───────────── */
  const SPLIT = ['.door-title', '.section-head h2', '.missions-copy h2', '.verify h2', '.faq-layout h2', '.footer-claim', '.sub-copy h1',
    '.page-heading h1', '.engagement-hero h1', '.editorial-copy h2', '.inclusion-line h2', '.cta-inner h2', '.detail-head h1', '.form-intro h1',
    '.success-state h2', '.not-found h1', '.offer-note h2', '.etab-map-copy h2'].join(',');
  /* Éléments qui servent de cible à une transition partagée : on ne les cache pas pendant qu’elle se joue. */
  const MORPHING = '.door, .door *, .form-card, .form-card *, .detail-num';

  function splitWords(el, attr) {
    if (el.dataset.split || el.dataset.ink) return;
    el.setAttribute(attr, '1');
    let i = 0;
    const walk = node => {
      for (const n of [...node.childNodes]) {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          for (const part of n.textContent.split(/(\s+)/)) {
            if (!part) continue;
            if (/^\s+$/.test(part)) { frag.append(part); continue; }
            const w = document.createElement('span'), inner = document.createElement('span');
            w.className = 'w'; inner.textContent = part; inner.style.setProperty('--i', i++);
            w.append(inner); frag.append(w);
          }
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && n.hasAttribute('data-count-to')) {
          /* Un chiffre qui compte reste un seul mot. */
          const w = document.createElement('span'), inner = document.createElement('span');
          w.className = 'w'; inner.style.setProperty('--i', i++); n.replaceWith(w); inner.append(n); w.append(inner);
        } else if (n.nodeType === 1 && !n.classList.contains('dot') && n.tagName !== 'BR' && n.tagName !== 'SVG') walk(n);
      }
    };
    walk(el);
    el.style.setProperty('--words', i);
  }

  /* ───────────── Apparitions au défilement ───────────── */
  /* [conteneur, enfants, pas en ms] : une liste arrive élément par élément, jamais toute la section d’un bloc. */
  const GROUPS = [
    ['.sp-index', ':scope > li', 45], ['.offer-list', ':scope > *', 40], ['.offer-grid', ':scope > *', 80], ['.steps', ':scope > li', 140],
    ['.principle-list', ':scope > *', 110], ['.faq-list', ':scope > details', 55], ['.check-list', ':scope > li', 130], ['.contract-grid', ':scope > *', 100],
    ['.unknowns', ':scope > li', 60], ['.slot-picks[data-offer]', ':scope > .slot-pick', 50], ['.contact-channels', ':scope > *', 90], ['.sector-line', ':scope > *', 45], ['.detail-facts', ':scope > div', 60],
    ['.footer-grid', ':scope > *', 70], ['.journey', ':scope > .journey-step', 90], ['.etab-map-copy .promise', ':scope > li', 90], ['.mini-steps', ':scope > li', 140]
  ];
  const SINGLES = ['.section-lead', '.section-head > .text-link', '.missions-copy > .btn', '.sub-copy > .lead', '.sub-copy > .actions', '.sub-copy > .promise',
    '.page-heading .lead', '.engagement-hero .lead', '.belief-side > p', '.belief-side > .text-link', '.offer-note', '.inclusion-line p',
    '.inclusion-line > .btn', '.verify-lead', '.etab-map-copy > .btn', '.brief-card', '.apply-card', '.filter-bar', '.journey-details', '.editorial-copy p',
    '.faq-layout .text-link', '.cta-inner p', '.cta-inner .actions', '.form-intro .lead', '.form-help',
    '.footer-bottom', '.legal-nav', '.legal-copy', '.results-head', '.not-found .lead', '.not-found .actions'].join(',');
  const SHUTTER = '.door-photo, .sub-photo, .verify-photo, .form-photo, .belief-photo';

  /* Pages de tâche (formulaires, offres, contact, avis, éligibilité, mentions) : le contenu est là tout de suite.
     Pas de titres mot à mot ni d’apparitions : la transition de page suffit, personne n’attend une chorégraphie. */
  const TASK = /^#\/(postuler|besoin|contact|offres|offre|mentions-legales|avis|admin|eligibilite|espace)(\/|\?|$)/;

  let revealIO, scrubIO, firstRender = true;
  const live = new Set();

  function play(el) {
    el.classList.add('is-in');
    $$('[data-count-to]', el).forEach(countUp);
    if (el.hasAttribute('data-reveal') || el.hasAttribute('data-shutter')) {
      const d = parseFloat(el.style.getPropertyValue('--d')) || 0;
      /* Une fois arrivé, l’élément retrouve ses propres transitions (survol, appui). */
      setTimeout(() => { el.removeAttribute('data-reveal'); el.removeAttribute('data-shutter'); el.classList.remove('is-in'); el.style.removeProperty('--d'); }, 1400 + d);
    }
  }
  /* v8 : ce qui est déjà dans le premier écran à l’affichage n’est jamais caché pour être révélé ;
     seuls les titres gardent leur montée (data-split-in) et la conviction son encre. */
  const KEEP_MOTION = ['data-split-in', 'data-ink-in', 'data-map', 'data-draw'];
  function tag(el, attr, value = '1', delay = 0) {
    if (!el || el.closest(MORPHING) && html.dataset.vt || el.hasAttribute(attr)) return;
    if (!KEEP_MOTION.includes(attr) && el.getBoundingClientRect().top < innerHeight) return;
    el.setAttribute(attr, value);
    if (delay) el.style.setProperty('--d', `${delay}ms`);
    revealIO.observe(el);
  }

  function prepare() {
    const app = document.getElementById('app'); if (!app) return;
    revealIO?.disconnect(); scrubIO?.disconnect(); live.clear();
    revealIO = new IntersectionObserver(entries => {
      for (const e of entries) if (e.isIntersecting) { play(e.target); revealIO.unobserve(e.target); }
    }, {rootMargin: '0px 0px 12% 0px'}); /* v8 : un peu avant l’arrivée à l’écran, jamais de zone vide en défilant vite */
    scrubIO = new IntersectionObserver(entries => {
      for (const e of entries) { const s = e.target._scrub; if (!s) continue; e.isIntersecting ? live.add(s) : live.delete(s); s(); }
    }, {rootMargin: '15% 0px'});

    refreshHeader();
    /* Le logo se dessine à la première visite ; le masque est retiré ensuite (aucun risque de trait coupé). */
    /* v8 : une fois par visite (stockage de session), plus à chaque chargement. */
    const once = key => { try { if (sessionStorage.getItem(key)) return false; sessionStorage.setItem(key, '1'); } catch {} return true; };
    if (firstRender && moving() && once('laska-logo-vu')) { const lg = $('.site-header .logo'); lg?.classList.add('is-intro'); setTimeout(() => $('.site-header .logo')?.classList.remove('is-intro'), 2600); }
    if (!moving()) { firstRender = false; return; }

    /* Les portes d’accueil ne s’ouvrent qu’une fois par visite ; ensuite l’accueil arrive simplement. */
    const hero = $('.split-hero');
    if (hero && firstRender && once('laska-portes-vues')) { hero.classList.add('is-opening'); hero.style.setProperty('--d0', '120ms'); }

    const task = TASK.test(location.hash);
    if (!task) $$(SPLIT, app).forEach(el => { if (!(el.closest(MORPHING) && html.dataset.vt) && !el.style.viewTransitionName) { splitWords(el, 'data-split'); tag(el, 'data-split-in'); } });
    /* Conviction : l’encre se pose en une fois quand la phrase arrive à l’écran (v8 : elle ne suit plus le défilement). */
    $$('.belief-quote', app).forEach(el => { splitWords(el, 'data-ink'); tag(el, 'data-ink-in'); });

    for (const [box, kids, step] of GROUPS) if (!task || box === '.footer-grid') $$(box, app).forEach(c => $$(kids, c).forEach((k, i) => tag(k, 'data-reveal', '1', Math.min(i * Math.round(step / 2), 240))));
    $$(task ? '.footer-bottom' : SINGLES, app).forEach(el => tag(el, 'data-reveal', '1', 60));
    if (!task) $$(SHUTTER, app).forEach(el => tag(el, 'data-shutter'));
    $$('.engagement-banner', app).forEach(el => tag(el, 'data-shutter', 'doors'));
    $$('.france-map[data-intro]', app).forEach(el => tag(el, 'data-map'));
    $$('.footer-route', app).forEach(el => tag(el, 'data-draw'));
    $$('.journey-wrap', app).forEach(el => { el.classList.add('is-live'); scrub(el, journeyUpdate); });
    $$('.detail-num', app).forEach(el => { if (!el.style.viewTransitionName) el.classList.add('is-rising'); scrub(el, driftUpdate); });
    firstRender = false;
  }
  function countUp(el) {
    const to = Number(el.dataset.countTo), t0 = performance.now(), dur = 1100;
    const step = now => { const p = clamp((now - t0) / dur); el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); };
    el.textContent = '0'; requestAnimationFrame(step);
  }

  /* ───────────── Mouvements liés au défilement ───────────── */
  let raf = 0;
  const tick = () => { raf = 0; live.forEach(fn => fn()); };
  const request = () => { if (!raf && live.size) raf = requestAnimationFrame(tick); };
  addEventListener('scroll', () => { request(); headerState(); }, {passive: true});
  addEventListener('resize', request, {passive: true});
  function scrub(el, update) { el._scrub = () => update(el); scrubIO.observe(el); }

  /* Parcours : la ligne pointillée se remplit, chaque étape s’allume quand la ligne l’atteint. */
  function journeyUpdate(wrap) {
    const vh = innerHeight, steps = $$('.journey-step', wrap), track = $('.journey-track', wrap), fill = $('.journey-fill', wrap), end = $('.journey-end', wrap);
    if (track && track.offsetParent) {
      const r = wrap.getBoundingClientRect(), t = track.getBoundingClientRect(), p = clamp((vh * .92 - r.top) / (vh * .52));
      fill.style.clipPath = `inset(0 ${((1 - p) * 100).toFixed(2)}% 0 0)`;
      steps.forEach(s => { const m = $('.journey-marker', s).getBoundingClientRect(); s.classList.toggle('is-reached', p + .002 >= (m.left + m.width / 2 - t.left) / t.width); });
      end?.classList.toggle('is-reached', p >= .995);
    } else {
      steps.forEach(s => { const m = $('.journey-marker', s).getBoundingClientRect(); s.classList.toggle('is-reached', m.top + m.height / 2 < vh * .74); });
      steps.forEach((s, i) => s.classList.toggle('is-done', !!steps[i + 1]?.classList.contains('is-reached')));
    }
  }
  /* Grand numéro de département : il dérive doucement pendant le défilement. */
  function driftUpdate(el) {
    const r = el.parentElement.getBoundingClientRect(), p = clamp(-r.top / Math.max(1, r.height));
    el.style.translate = `0 ${(p * 70).toFixed(1)}px`;
  }

  /* ───────────── En-tête ───────────── */
  function headerState() { $('.site-header')?.classList.toggle('is-scrolled', scrollY > 6); }
  function refreshHeader() { headerState(); }

  /* ───────────── Carte ↔ offres : survoler l’un éclaire l’autre ───────────── */
  let linked = '';
  function setLinked(dept) {
    if (dept === linked) return; linked = dept;
    $$('.is-linked').forEach(x => x.classList.remove('is-linked'));
    if (dept) $$(`.offer-row[data-dept="${dept}"], .offer-card[data-dept="${dept}"], .pin[data-dept="${dept}"]`).forEach(x => x.classList.add('is-linked'));
  }
  const linkTarget = t => t?.closest?.('.offer-row[data-dept], .offer-card[data-dept], .offers-map .pin');
  document.addEventListener('pointerover', e => { if (e.pointerType === 'mouse') setLinked(linkTarget(e.target)?.dataset.dept || ''); });
  document.addEventListener('focusin', e => setLinked(linkTarget(e.target)?.dataset.dept || ''));

  /* ───────────── Outils appelés par app.js ───────────── */
  /* FLIP : les lignes restantes glissent vers leur nouvelle place, les nouvelles arrivent ; rien ne saute. */
  function flip(container, mutate) {
    if (!moving() || !container) return mutate();
    const before = new Map($$('[data-flip]', container).map(el => [el.dataset.flip, el.getBoundingClientRect()]));
    mutate();
    let fresh = 0;
    $$('[data-flip]', container).forEach(el => {
      const a = before.get(el.dataset.flip), b = el.getBoundingClientRect();
      if (a) { const dy = a.top - b.top, dx = a.left - b.left; if (Math.abs(dy) > .5 || Math.abs(dx) > .5) el.animate([{transform: `translate(${dx}px, ${dy}px)`}, {transform: 'none'}], {duration: 460, easing: EASE_IO}); }
      else el.animate([{opacity: 0, transform: 'translateY(14px) scale(.985)'}, {opacity: 1, transform: 'none'}], {duration: 420, delay: Math.min(fresh++ * 40, 320), easing: EASE_OUT, fill: 'backwards'});
    });
  }
  /* Compteur : l’ancienne valeur s’efface vers le haut (léger flou), la nouvelle arrive par le bas. */
  function roll(el, value, asHTML = false) {
    if (!el) return;
    const current = asHTML ? el.innerHTML : el.textContent;
    el._next = value;
    if (current === value && !el._rolling) return;
    if (!moving()) { asHTML ? el.innerHTML = value : el.textContent = value; return; }
    if (el._rolling) return;
    el._rolling = true;
    el.animate([{opacity: 1, filter: 'blur(0)', transform: 'none'}, {opacity: 0, filter: 'blur(3px)', transform: 'translateY(-35%)'}], {duration: 120, easing: 'ease-out', fill: 'forwards'}).onfinish = () => {
      asHTML ? el.innerHTML = el._next : el.textContent = el._next;
      el.animate([{opacity: 0, filter: 'blur(3px)', transform: 'translateY(35%)'}, {opacity: 1, filter: 'blur(0)', transform: 'none'}], {duration: 240, easing: EASE_OUT, fill: 'forwards'}).onfinish = () => { el._rolling = false; if ((asHTML ? el.innerHTML : el.textContent) !== el._next) roll(el, el._next, asHTML); };
    };
  }

  document.addEventListener('laska:rendered', () => { linked = ''; prepare(); });
  window.LaskaMotion = {flip, roll, refreshHeader, moving};
})();
