# Laska Corporate — système visuel (v4, finitions v6.1, lisibilité v8, finitions v8.1)

## Concept : deux portes
Un site, deux publics. L’espace **praticien** est clair (papier blanc, surlignage menthe). L’espace **établissement** est profond (turquoise foncé, accents menthe). Les deux se côtoient toujours sur l’accueil (v8 : plus de profil de visite, plus de porte réduite ni de bandeau « Vous recrutez ? »).

La **pastille corail** du logo marque toujours la destination : le point final des titres, la fin du parcours (« France »), le nombre de missions sur la carte, le département sélectionné.

## Logo
Logo officiel Laska Corporate | Médical : tête de loup géométrique et croix médicale, couleur #058689. La tête est en SVG (`wolfMark`), le texte d’origine en image. En-tête : tête + texte côte à côte ; pied de page : version blanche et grande tête en filigrane (6 % de menthe). Une fois par visite (v8), le contour se dessine puis la croix apparaît.

## Palette (imposée, inchangée)
Turquoise #177e7a · turquoise foncé #0f5c59 · menthe #9dded6 · sable #cbb894 · corail #e8734a · encre #20242a · fond #f7f5f0.
Dérivées : turquoise très foncé #0b4442 (pied de page), menthe claire #e2f2ee, sable clair #efe8da, texte courant #3b4442 (`--text`, v8.1), texte secondaire #56625f (notes, aides, métadonnées).
Règles : texte encre sur corail, blanc sur turquoise foncé. Menthe et sable réservés aux surfaces et accents.

## Typographie
Manrope 800 pour les titres, serrée (−0,04 à −0,06 em), en grands corps : c’est la signature. DM Sans pour la lecture et les contrôles, corps 17 px (16 px sur mobile). Libellés en petites capitales espacées. Chiffres tabulaires pour les références et téléphones.
Échelle (v8.1), 11 tailles : 13 · 14 · 15 · 16 · 17 · 20 · 24 · 34 · 46 · 60 · 72 px. Titres de carte 34, de section 46, de page et des portes 60, d’affichage 72 (fluides, avec `clamp`). Pas de demi-pixel. Espaces insécables françaises posées automatiquement (avant ? ! ; : », après «, entre nombre et unité).

## Motifs propres au sujet
- **Numéros de département** en chiffres détourés (cartes, lignes d’offres, fiche d’offre). Le détouré est réservé à ce décor : les libellés de contrat, qui portent une information, sont en lettres pleines (v8.1).
- **Carte de France en points**, générée à partir d’un contour simplifié ; pastilles aux préfectures des départements où une mission est ouverte.
- **Parcours pointillé** du diplôme à la prise de poste, terminé par la pastille corail.
- **Photos en arche** (grand rayon sur un angle), reprise de la v2.

## Composants
Menu unique et bouton principal selon la page (v8) · bouton « Aide » (en-tête sur téléphone, flottant et blanc sur ordinateur) · portes d’accueil (sous 860 px, le portrait se loge dans le texte d’accroche) · formulaires en étapes : « Étape 2 sur 5 », barre d’avancement, Retour et Continuer collés en bas de l’écran · « C’est quoi ? » : explication d’une ligne ouverte au toucher · mini-brief en puces · index des spécialités en tableau des départs (nom, pointillé, nombre) · cartes et lignes d’offres · carte interactive avec infobulle · étapes établissement en grands chiffres détourés reliés par le pointillé · FAQ en rangées pleines · principes en lignes de grande taille · formulaires avec boutons radio en pilules et anneau de progression · bandeau d’appel à l’action plat (turquoise foncé, cercle menthe plein, sans dégradé) · route du pied de page terminée par la pastille.

## Retenue (v4)
Plus d’étiquettes en petites capitales au-dessus des titres : le fil d’Ariane situe les pages, le public d’une porte est dit dans sa première phrase. Plus de filets ni de contours d’un pixel : les surfaces se distinguent par un pas de ton. Ombres réservées à ce qui flotte (menus, barre de filtres collante, carte de candidature, en-tête quand la page défile).
v8.1 : les derniers filets sont partis (barre de filtres, faits de l’offre, référence, bouton Menu, liens du menu mobile). Le bouton « Aide » a une seule ombre douce. Le bandeau d’appel n’a plus de dégradé. Les pastilles s’ajustent à leur contenu.

## Mouvement (v4) : la route jusqu’à la destination
Tout ce qui bouge prolonge deux motifs de la marque : le **pointillé du parcours** et la **pastille corail**. Code dans `motion.js` / `motion.css`.
- **Portes qui s’ouvrent** (une fois par visite) : les deux portes se révèlent depuis la jointure centrale, en 0,6 s depuis une porte entrouverte ; le texte ne glisse pas et la recherche est là tout de suite.
- **Titres** : les mots montent derrière leur ligne de base, puis la pastille corail « atterrit » sur le point final (léger écrasement). Le surlignage menthe se pose sous « en France ».
- **Carte** : les points apparaissent en vague depuis la Méditerranée ; chaque pastille se pose quand la vague l’atteint, puis son nombre de missions.
- **Index des spécialités ↔ carte** : survoler une spécialité redessine la carte (missions de cette spécialité par département) ; survoler un département atténue les spécialités absentes. Même lien entre les lignes d’offres et la carte de la page Offres.
- **Parcours tracé au défilement** : la ligne se remplit, chaque pastille d’étape s’allume quand elle l’atteint, la pastille « France » s’illumine à l’arrivée. Le texte des étapes reste pleinement lisible (v8).
- **Conviction** : les mots prennent l’encre en une fois, l’un après l’autre (moins d’une seconde), quand la phrase arrive à l’écran ; jamais sous 35 %.
- **Transitions de vue** : changement de page avec en-tête fixe et pastille de navigation qui glisse ; le numéro de département et le titre d’une offre passent de la ligne à la fiche (et reviennent) ; formulaire envoyé ou étape suivante : la carte change de hauteur sans saut.
- **Retours** : appui (échelle 0,97), filtre à pastille glissante, compteurs qui roulent, lignes filtrées qui glissent (FLIP), coche sur un champ obligatoire bien rempli, erreurs effacées dès la correction, dépôt du CV par glisser-déposer, accordéons à leur vraie hauteur.
Rythme (v8) : transitions de page 0,3 s ; titres 0,45 s, cascade plafonnée à 0,25 s ; apparitions 0,3 s, déclenchées un peu avant l’écran ; rien de ce qui est déjà dans le premier écran n’est caché pour être révélé ; aucune chorégraphie sur les pages de tâche (formulaires, offres, contact, avis, éligibilité, mentions). Les fenêtres s’ouvrent depuis leur bouton ; pas de faux survol sur écran tactile.
Courbes : `--ease-out` (arrivées), `--ease-in-out` (déplacements), `--ease-drawer` (interrupteurs). Survols réservés aux souris. « Réduire les animations » : plus aucun déplacement, les changements d’état restent en fondu.

## Listes et cases (v6.1)
Listes déroulantes natives au style du site via `appearance: base-select` : surface blanche, rayon 14 px, ligne choisie en menthe avec coche turquoise, comme les listes à choix multiple. Cases à cocher dessinées : rayon 7 px, coche blanche sur turquoise. Témoignages : premier en grand sur turquoise, guillemet corail ou menthe.

## Accessibilité
Mesuré en v8 sur 20 pages, ordinateur et téléphone : aucun texte sous 13 px (espace candidat : 14 px au moins, 15 px pour les lignes de texte), contrastes ≥ 4,5:1, cibles ≥ 44 px (99 à 100 %). Ancres décalées sous l’en-tête collant (`scroll-margin-top`) ; menus et panneaux qui défilent sans entraîner la page (`overscroll-behavior: contain`). Focus visible partout, lien d’évitement, `aria-pressed` sur les interrupteurs et filtres, résumé d’erreurs focalisé, champs radio natifs, menu fermé par Échap.

## Formats vérifiés
En-tête vérifié à 17 largeurs, de 320 à 1920 px ; portes de l’accueil à 18 largeurs, de 320 à 1440 px (au moins 9 px entre portrait et titre) ; pages à 1440 et 390 px : aucun débordement horizontal, aucune erreur console.

## Références
- https://laskasite.vercel.app/ — contenu et offres.
- https://www.pulsejobs.com/ — séparation des publics.
- Photos Unsplash : photo-1612349317150-e413f6a5b16d, photo-1559839734-2b71ea197ec2, photo-1582750433449-648ed127bb54, photo-1576091160399-112ba8d25d1d.
- Polices : Manrope et DM Sans (Google Fonts, fichiers locaux et licences dans assets/).
