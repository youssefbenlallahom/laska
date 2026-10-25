# Laska Corporate — maquette HTML (v8.2)

Maquette navigable du futur site Laska Corporate, à porter ensuite en React / Next.js. Copies des versions précédentes : `_sauvegarde-v3/`, `_sauvegarde-v5/`, `_sauvegarde-v7/` (état v7.2, avant la v8), `_sauvegarde-v8/` (état v8, avant la passe de finition).

## Passe de finition v8.1 : même identité, mêmes parcours

Le 25 octobre 2026, une passe de finition visuelle. L’identité ne change pas (palette, polices, deux portes, pastille corail), les parcours non plus, et le mouvement reste au service de la lecture.

### Ce qui change à l’écran

- **Typographie** :
  - échelle resserrée à 11 tailles : 13 · 14 · 15 · 16 · 17 · 20 · 24 · 34 · 46 · 60 · 72 px ;
  - titres de carte en 34, de section en 46, de page en 60, d’affichage en 72 ; plus de demi-pixels ;
  - de 9 à 12 tailles par page au lieu de 13 à 15.
- **Texte courant presque noir** (#3b4442, contraste 9:1 au lieu de 6:1). Le gris reste aux notes, aides et métadonnées. Les paragraphes évitent les mots seuls en fin de bloc.
- **Espaces insécables à la française**, posées automatiquement :
  - avant ? ! ; : et », après « ;
  - entre un nombre et son unité (24 h, 48 h, 3 Mo…).
  - Plus de « ? » seul en début de ligne.
- **Surfaces plus calmes** :
  - plus de filets ni de contours d’un pixel (barre de filtres, faits de l’offre, référence, bouton Menu) ;
  - bandeau « Faisons le premier pas » plat, sans dégradé ;
  - libellés de contrat (« Intérim · Vacation », « CDI · CDD ») en lettres pleines au lieu de lettres détourées ;
  - ombre plus douce pour le bouton « Aide ».
- **Jauges** des étapes et des justificatifs : la partie qui reste à faire se voit.
- **Fiche d’offre** :
  - les valeurs des faits sont alignées en haut ;
  - la référence tient dans une pastille à sa taille ;
  - « Besoin d’aide ? » passe sur deux lignes : le téléphone à gauche, *Être rappelé* à droite.
- **Accueil sur téléphone et tablette** (860 px et moins) :
  - le portrait de chaque porte se loge dans le texte d’accroche au lieu de chevaucher le titre ;
  - le titre ne dépasse plus du bloc (il pouvait être coupé à 320 px) ;
  - « Besoin urgent ? » passe à la ligne sans laisser de point seul.
- **Pied de page sur téléphone** :
  - deux colonnes de liens, puis Laska Corporate et le contact en pleine largeur ;
  - les liens sur deux lignes restent bien séparés ;
  - les adresses email se coupent avant l’arobase.
- **Défilement** :
  - les ancres (questions fréquentes, mentions, explications) ne sont plus cachées sous l’en-tête collant ;
  - quand on fait défiler un menu ou un panneau, la page derrière ne bouge pas, et Android ne recharge plus la page par glissement.
- **Petits gestes** :
  - *Tout effacer* propose *Annuler* pendant quelques secondes ;
  - pas de correcteur sur les champs email et téléphone, ni de majuscule automatique sur l’email ;
  - la barre du navigateur prend la couleur du fond du site au lieu du turquoise.

### Poids et vitesse

- **Images recompressées** :
  - logo texte : de 60 à 6 Ko ;
  - photos : de 155 à 88 Ko, de 193 à 70 Ko, de 108 à 61 Ko, de 81 à 53 Ko ;
  - portraits des portes en 240 × 240 px (11 et 13 Ko) au lieu des photos entières.
- **Carte de France** : elle n’est plus construite sur téléphone, où elle n’est pas affichée. Elle se construit si l’écran s’élargit.

### Mesures

Conditions : téléphone simulé, 4G lente, processeur ralenti 4 fois, serveur local sans compression.

| Mesure | Avant (v8) | Après (v8.1) |
|---|---|---|
| Accueil : premier affichage / plus grand élément / temps de blocage | 4,0 s / 4,56 s / 934 ms | 3,69 s / 4,35 s / 697 ms |
| Praticiens : premier affichage / plus grand élément / temps de blocage | 3,67 s / 5,9 s / 706 ms | 3,59 s / 5,0 s / 563 ms |
| Tailles de texte par page (accueil, praticiens, établissements) | 15, 13, 15 | 12, 9, 11 |

Le reste des vérifications est inchangé ou meilleur :
- aucun texte sous 13 px ;
- aucun contraste sous 4,5:1 sur téléphone ;
- 100 % des zones tactiles à 44 px ou plus sur téléphone ;
- zéro erreur JavaScript et zéro débordement sur les 68 pages balayées.

Le détecteur de défauts visuels (impeccable) ne relève plus que le fond crème. Il est gardé : c’est la couleur de la marque.

### Pas fait, à prévoir en production

- **Polices en WOFF2 et compression gzip ou brotli chez l’hébergeur.** C’est le plus gros gain de vitesse restant : chaque graisse de Manrope pèse environ 95 Ko en TTF.
- **Propositions de parcours du nouvel audit** (plus bas) : elles ont été écartées de cette passe, qui ne touche qu’au visuel.

## Passe v8.2 : formulaires plus compacts

Les formulaires défilaient trop, même sur ordinateur. Le texte des formulaires descend d’un cran et les champs perdent l’interligne du corps de page. Seuls les formulaires changent (la carte `.form-card` et le titre `.form-intro`) : la recherche de l’accueil et le reste du site ne bougent pas. Les règles sont à la fin de `styles.css`, section « v8.2 ».

- **Titres** : titre de page 60 → 48 px sur ordinateur, 32 → 30 px sur téléphone ; titre d’étape 34 → 30 px ; phrase d’accroche 20 → 17 px.
- **Choix** (spécialités, contrats, pays) : 15 → 14 px, 44 px de haut. Sur téléphone, deux ou trois par ligne au lieu d’une. **Créneaux** : 74 → 64 px de haut.
- **Champs** : 54 → 50 px de haut. Le texte reste à 16 px, parce qu’iOS zoome sur un champ plus petit. Libellés à 15 px.
- **Boutons** : 17 → 16 px, 52 px de haut au lieu de 56 à 58.
- **Espaces** : 12 px entre les lignes de champs (18 avant), 6 px entre un libellé et son champ.

Hauteur de la page, du haut au bas, avant → après (pixels) :

| Page | Ordinateur 1440 px | Téléphone 390 px |
|---|---|---|
| Dossier praticien, étape 1 | 1987 → 1885 | 2531 → 2418 |
| Dossier praticien, étape 2 | 1905 → 1837 | 2401 → 2261 |
| Dossier praticien, étape 5 | 2028 → 1955 | 2887 → 2663 |
| Demande d’un établissement, étape 1 | 1955 → 1887 | 2673 → 2563 |
| Contact | 2214 → 2204 | 3225 → 3136 |

Sur les étapes du dossier et de la demande, le gain est de 2 à 8 % ; le contact gagne peu. La longueur tient surtout au nombre de questions et aux créneaux. Pour aller plus loin, il faudrait changer la mise en page (créneaux en deux colonnes sur téléphone, étapes plus courtes).

## Version 8 : un site facile pour tous

Objectif : un site clair et peu encombré, qu’un médecin sur un téléphone Android ou une RH pressée utilisent sans aide. La v8 suit l’audit UX du 25 octobre 2026 (27/40). Elle a été faite en neuf lots, vérifiés un par un.

### Ce qui change pour le visiteur

- **Un seul menu, le même partout** : *Offres d’emploi · Praticiens · Établissements · Avis · Contact*.
  - Plus d’interrupteur Praticien / Établissement, plus de « profil » qui change tout seul, plus de messages « vous êtes dans l’espace… ».
  - Le bouton principal dépend seulement de la page : *Créer mon dossier* côté praticiens et offres, *Décrire mon besoin* côté établissements, aucun sur l’accueil. Une fois connecté à l’Espace candidat, aucun bouton orange : « Mon espace » le remplace sur toutes les pages.
  - Le mot « espace » ne désigne plus que l’Espace candidat.
- **Bouton « Aide »** :
  - dans l’en-tête sur téléphone et tablette ;
  - en bas à droite sur ordinateur, en blanc, et il s’efface pendant le défilement.
- **Rien de bloquant au premier contact** :
  - CV et copies facultatifs ;
  - photos acceptées (l’appareil photo s’ouvre sur téléphone), plusieurs photos possibles pour le CV ;
  - « Envoyez-le plus tard, par WhatsApp ou par email ».
- **Formulaires en étapes**, une par écran : « Étape 2 sur 5 », une barre d’avancement, *Continuer* et *Retour*.
  - L’étape est dans l’adresse (`?etape=2`), donc le bouton Retour du téléphone fonctionne.
  - *Continuer* reste visible en bas de l’écran sur téléphone.
  - Le dossier praticien compte 5 étapes ; la 5ᵉ, *Pour aller plus loin*, est facultative, avec *Passer cette étape*. La demande de renfort en compte 3.
  - Un récapitulatif vient ensuite : chaque *Modifier* ramène à la bonne étape, et *Revenir au récapitulatif* y retourne directement.
  - Avant le récapitulatif, toutes les étapes sont revérifiées.
- **Un mot par chose** :
  - *Créer mon dossier* → *Envoyer mon dossier* → « Votre dossier est envoyé » ;
  - *Je postule* → *Envoyer ma candidature* → « Votre candidature est envoyée » ;
  - *Décrire mon besoin* ou *Être informé* → *Envoyer ma demande* → « Votre demande est envoyée ».
  - Le bouton du formulaire dit ce qu’il fait : *Vérifier avant d’envoyer*.
- **« C’est quoi ? »** : une explication d’une ligne qui s’ouvre au toucher, sur :
  - EVC et autorisation d’exercice ;
  - intérim, vacation, CDD et CDI (dans les deux formulaires et sur chaque fiche d’offre) ;
  - RPPS et AFGSU (Mes justificatifs).
- **Recherche** :
  - chaque département affiche sa préfecture (« Rhône (69) · Lyon ») et chaque offre son lieu (« Lyon · Rhône (69) ») ;
  - les compteurs des listes suivent les autres choix, et les options à 0 sont grisées ;
  - la recherche de l’accueil garde les critères, même sans résultat : la page Offres propose alors des solutions ;
  - sur téléphone, les résultats viennent d’abord et *Filtrer les offres (n)* ouvre les filtres.
- **Fiche d’offre** : en tête, Lieu, Contrat, Rémunération et Dates ; la référence passe en bas de page.
- **Établissements** :
  - téléphone *conseillé* dans la demande ;
  - délai annoncé « sous 24 h ouvrées » ;
  - tarifs repliés tant qu’ils ne sont pas renseignés.
- **Avis** :
  - bouton *Donner mon avis* sous le titre ;
  - seuls le prénom, la note, l’avis et l’accord sont obligatoires.
- **Messages éphémères** : seulement en réponse à une action (*Annuler*…), fermés au changement de page. Sur téléphone, ils sont en pleine largeur. La saisie retrouvée après un rechargement est dite dans le formulaire, avec *Tout effacer*.

### Espace candidat

- **Menu** : 7 entrées au lieu de 13 :
  - Accueil, Mon planning, Mes contrats, Mes offres d’emploi ;
  - *Ma paie et mes documents* (onglets : Bulletins et avances, Attestations, Données fiscales) ;
  - *Mon dossier* (Mes informations, Mes justificatifs) ;
  - *Aide et infos* (Questions fréquentes, Sécurité au travail, Mes avantages).
  - Les adresses ne changent pas.
- **Signer en confiance** :
  - « Votre contrat en bref » : où, quand, horaires, rémunération en euros, un exemple ;
  - *Lire le contrat complet (PDF, 3 pages)* et *Appeler ma conseillère avant de signer* ;
  - après la signature, un écran de confirmation (date, heure, référence, où trouver la copie).
- **Ma paie** : deux bulletins d’exemple, l’un versé et l’autre en préparation.
- **Disponibilités** : la consigne est au-dessus de la grille (« 1 fois, disponible · 2 fois, indisponible · 3 fois, effacé »).
- **Mots courants** :
  - « Mes droits en cas d’arrêt de travail (prévoyance) » ;
  - « Aides du FASTT : logement, transport, garde d’enfants » ;
  - « Ma mutuelle santé » ;
  - « Demander une avance sur ma paie (acompte) » ;
  - « Signature en ligne acceptée (convention de preuve) » ;
  - « vos documents en ligne ».
  - Dans tout l’espace, on parle d’« Inès Martin, votre conseillère ».

### Lisibilité et mouvement

- **Textes** : aucun texte sous 13 px. Dans l’espace candidat, 14 px au moins, et 15 px pour les lignes de texte.
- **Contrastes à 4,5:1** : textes d’exemple des champs, astérisques des champs obligatoires, libellés de la fiche d’offre.
- **Zones tactiles de 44 px** : menus, pied de page, fil d’Ariane, puces, cœurs, petits boutons.
- **Téléphone** :
  - la carte de France laisse la place à la liste des spécialités et à *Voir les offres par département* ;
  - accueil plus court (deux témoignages, la citation sans photo).
- **Mouvement, même style mais la lecture d’abord** :
  - ce qui est déjà à l’écran n’est plus caché pour être révélé ;
  - les portes de l’accueil s’ouvrent plus vite, depuis une porte entrouverte, et une seule fois par visite (le logo aussi) ;
  - les textes du parcours restent lisibles ;
  - la citation prend l’encre en une fois, sans suivre le défilement ;
  - les apparitions arrivent un peu avant l’écran, et plus vite.

### Mesures (mêmes scripts sur la v7.2 et sur la v8)

20 pages mesurées, chacune sur ordinateur (1440 px) et sur téléphone (390 px).

| Mesure | Avant (v7.2) | Après (v8) |
|---|---|---|
| Bouton *Continuer* ou *Envoyer* visible à l’arrivée de chaque étape, téléphone | non (envoi à 4,8 écrans) | oui, 5 étapes sur 5 |
| Textes sous 13 px | 45 | 0 |
| Textes sous 14 px dans l’espace candidat | 17 % (ordinateur), 15 % (téléphone) | 2 %, 5 % |
| Textes sous 4,5:1 de contraste | 57 | 0 |
| Zones tactiles d’au moins 44 px | 42 % (ordinateur), 36 % (téléphone) | 99 %, 100 % |
| Messages éphémères pendant la navigation (8 changements de page) | 8 sur 8 | 0 |
| Texte du premier écran lisible à 0,3 s (accueil, praticiens, établissements, engagement, offres) | 9 à 85 % | 93 à 100 % |

La seule zone tactile restante sous 44 px est la pastille de la carte de France sur ordinateur, où la liste des départements sert d’alternative.

### Nouvel audit : 32/40 (27/40 avant)

Le nouvel audit a été fait par un relecteur indépendant, avec la même méthode (10 critères notés de 0 à 4).
- **Note : 32/40.** L’aide et la récupération après une erreur sont à 4 ; tout le reste est à 3.
- **Corrigé après l’audit :**
  - la grille des disponibilités débordait sur téléphone ;
  - « Garder » chevauchait « Partager » sur la fiche d’offre ;
  - une faute dans l’adresse email est redite au récapitulatif ;
  - une demande de renfort sans téléphone n’annonce plus un rappel, mais une réponse par email ;
  - le lieu tient sur une ligne dans la liste des offres ;
  - « Touchez » devient « Appuyez ».
- **Proposé, pas encore fait :**
  - choisir « Disponible / Pas disponible / Effacer » dans un petit menu, au lieu de toucher 1, 2 ou 3 fois ;
  - raccourcir la candidature à une offre (les créneaux dans le récapitulatif, *Pour aller plus loin* après l’envoi) ;
  - demande de renfort, période : l’ordre Du, Au, Créneau, aucun jour coché au départ, des raccourcis Week-ends et Semaine ;
  - numéros de téléphone : le nôtre au format international, les numéros étrangers découpés selon le pays ;
  - page Offres sur téléphone : Trier et Liste/Carte dans le panneau des filtres ;
  - une fois connecté, garder « Menu » et « Mon espace » écrits dans l’en-tête.
- **À trancher avec Laska Corporate :**
  - l’audit propose de dire « publié après relecture » quand un avis est envoyé. C’est contraire à la consigne actuelle : le visiteur ne voit rien de la modération ;
  - libellés de situation fournis par Laska : « Sans EVC », et « docteur en médecine » dans la carte « Diplôme français ou européen », alors que les autres métiers peuvent aussi la choisir.

### À faire valider par Laska Corporate

- Les définitions des « C’est quoi ? » (`EXPLAIN` et `CONTRACT_DEFS` dans app.js) : EVC, autorisation d’exercice, intérim, vacation, CDD, CDI, RPPS, AFGSU.
- Le délai « sous 24 h ouvrées » pour rappeler un établissement.
- Données d’exemple de la maquette :
  - **villes des offres** : la préfecture du département ; en production, la ville réelle lue dans le CRM ;
  - **horaires et tarifs** des créneaux dans le résumé du contrat (`SHIFT` et `RATE` dans espace.js) ;
  - **bulletins de salaire** : montants calculés sur ces tarifs, net à environ 78 % du brut.

### Vérifier

Serveur local `node server.cjs`, puis http://127.0.0.1:4173.

Les vérifications automatiques ont tourné avec Chrome sans interface, sur ordinateur et sur téléphone. Elles ont trouvé zéro erreur JavaScript et zéro défilement horizontal. Elles couvraient :
- le balayage de 17 routes ;
- l’en-tête à 17 largeurs ;
- les parcours complets (dossier, candidature, renfort, avis et modération, espace candidat) ;
- la lisibilité et le mouvement.

## Espace candidat (v7)

**Espace candidat** en haut à droite, dans la barre de services (horaires, téléphone) au-dessus de l’en-tête, sur ordinateur. La barre s’efface au défilement. Une fois connecté, « Mon espace » (avec les initiales) remplace « Créer mon dossier » comme bouton principal de l’en-tête. Sur téléphone : lien dans le menu, avatar dans l’en-tête une fois connecté. Code : `espace.js` (chargé avant app.js) et la section « v7 : espace candidat » de styles.css.

- **Connexion (`#/espace`)** :
  - champs identifiant (email) et mot de passe, bouton afficher / masquer, alerte « majuscules activées », correction des fautes d’adresse (gmial.com…) ;
  - « Rester connecté » ;
  - les aides de l’espace de référence : « J’ai oublié mon mot de passe », « Je souhaite changer mon mot de passe », « Je souhaite changer mon adresse email » ;
  - conseiller, mentions légales et accessibilité.
- **Menus repris de l’espace intérimaire de référence** :
  - onglets *Page d’accueil*, *Mon profil*, *Questions fréquentes*, *Déconnexion* ;
  - un bloc *Messages* et *Mon conseiller* (l’équivalent de « Voir toutes mes agences ») ;
  - huit tuiles :
    - *Ma paie et mes acomptes* ;
    - *Mon planning* (Semaine, Mois) ;
    - *Mes impressions de documents* (Certificat de travail, Attestation de salaire) ;
    - *Mes offres d’emploi* (Intérim ; CDD, CDI) ;
    - *Mes contrats* (Historique, Mission, Mission – formation, Signer mes contrats électroniques) ;
    - *Mes données fiscales* ;
    - *Sécurité prévention* ;
    - *Mes avantages* (avantages, prévoyance cadre et non cadre, site du FASTT, notices mutuelle cadre et non cadre, règlement intérieur).
- **Chaque sous-menu ouvre un écran fonctionnel en simulation** :
  - planning à la semaine et au mois, avec navigation ;
  - signature électronique avec case de lecture obligatoire ;
  - demande d’acompte avec montant contrôlé ;
  - préparation de certificat et d’attestation ;
  - offres filtrées par contrat ;
  - profil (Identité, Moyens / Types de paiement, IBAN masqué et contrôlé, convention de preuve) modifiable sur place.
- **Données fictives** : praticienne d’exemple, missions et contrats placés autour de la semaine en cours, messages. Le mot de passe n’est jamais gardé. Session dans le navigateur : `laska-session`.
- **Production** : authentification réelle (mot de passe haché côté serveur, cookie httpOnly), données lues dans le CRM et le logiciel de paie, signature par un prestataire de signature électronique, documents générés par la paie. Les notices (prévoyance, mutuelle, règlement intérieur) et la liste des avantages sont des emplacements à fournir.

### Simplification (v7.2)

L’espace était jugé compliqué : son accueil comptait 40 liens et boutons, 15 blocs, et faisait 4,6 écrans de haut sur téléphone. Après simplification : 10 actions, 4 blocs, 1,3 écran sur ordinateur et 2,8 sur téléphone. Aucune fonction ni aucune rubrique de référence n’est retirée.
- **Un menu latéral** (ordinateur) remplace le bandeau turquoise, ses onglets et les 9 tuiles. Il est rangé en 4 groupes : *Mon activité*, *Ma paie et mes papiers*, *Mon dossier*, *Infos utiles*. Les pastilles corail n’indiquent que ce qui attend une action (contrats, justificatifs).
- **Sur téléphone**, un seul bouton « Mon espace ▾ » ouvre le même menu, avec le nombre de choses à faire.
- **L’accueil répond à une seule question, « que dois-je faire ? »** :
  - bonjour ;
  - *À faire* : une ligne par action, un seul bouton ; la liste se vide d’elle-même ;
  - *Mes prochaines missions* (3) ;
  - *Messages* ;
  - *Ma conseillère*.
- **Pages** : plus de lien « ← Page d’accueil » ni d’icône de titre ; les sous-menus de référence sont les onglets de chaque page. Les onglets des contrats sont raccourcis (*À signer*, *Tous mes contrats*, *Missions*, *Formations*) ; *À signer* s’ouvre d’abord s’il y a un contrat en attente.
- **Connexion** : les options rares (changer de mot de passe, d’adresse) sont repliées sous « Autres options ».
- **Code** : 61 règles de style devenues inutiles sont supprimées (bandeau, tuiles, coup d’œil).

### Revue UX (v7.1)

- **En-tête** : il dépassait de son conteneur à plusieurs largeurs (jusqu’à 167 px de défilement horizontal à 1 600 px) depuis l’ajout du bouton. D’où la barre de services, l’interrupteur à sa largeur (il n’est plus tassé) et un menu resserré entre 1 101 et 1 300 px. Vérifié de 390 à 1 920 px, dans les quatre états (sans profil, praticien, praticien connecté, établissement).
- **Accueil de l’espace** :
  - « en un coup d’œil » en tête : prochaine mission, contrats à signer, justificatifs à mettre à jour, disponibilités ; un point corail signale ce qui attend une action ;
  - tuiles en colonnes équilibrées ;
  - une conseillère nommée (Inès Martin, exemple fictif).
- **Ajouts** (hors espace de référence, utiles à un praticien) :
  - *Mes justificatifs* : les pièces du dossier, avec leur état (à jour, à renouveler, à fournir, en vérification), leur validité, une barre d’avancement et un dépôt en un clic (format et poids contrôlés, « Annuler ») ;
  - *Mes disponibilités* dans *Mon planning* : 4 semaines ; un appui fait passer un jour de disponible à indisponible ; « Disponible tous les jours libres », « Seulement les week-ends », « Tout effacer », avec « Annuler » ;
  - *Mes candidatures* dans *Mes offres d’emploi* : suivi en 4 étapes (Envoyée, En étude, Présentée à l’établissement, Retenue), lien vers les offres gardées.
- **Mobile** : onglets de l’espace en grille 2 × 2 (au lieu d’une bande à faire défiler, où « Déconnexion » était caché) ; avatar dans l’en-tête une fois connecté.
- **Détails** : compteurs d’offres en menthe (le corail reste réservé aux actions), libellés et accords revus.

## Retours du 24 octobre 2026 (v6.2)

- **Avis et témoignages d’exemple** : six avis fictifs (`SAMPLE_AVIS` dans services.js), tous publiés, dont trois repris en témoignage sur l’accueil. Ils sont posés au premier passage et signalés par une note « exemple » (avec `MAQUETTE = true`). À remplacer par les vrais avis avant publication.
- **La validation des avis est réservée au back-office.**
  - Le visiteur lit les avis et ajoute le sien, sans aucune mention de relecture ni de modération (page Avis, remerciement, accueil).
  - Le back-office simulé reste à l’adresse `#/admin/avis`, sans lien depuis le site. Il permet de publier, refuser, mettre en témoignage, revenir aux avis d’exemple ou tout effacer.
  - Seules les mentions légales gardent une phrase sur la relecture des avis : la loi impose d’informer sur le contrôle des avis en ligne (Code de la consommation, art. L111-7-2). À valider avec le conseil juridique.
- **Interrupteur Praticien / Établissement** :
  - couleurs : fond menthe claire, libellés turquoise, pastille turquoise avec légère ombre, icône active en menthe, survol visible ;
  - sans profil, une pastille fantôme glisse une fois (au lieu d’un halo) ;
  - la pastille glisse aussi quand le profil change depuis un formulaire, et les libellés changent de couleur à son passage.
- **Votre situation, pièces facultatives** :
  - preuve de réussite aux EVC pour « EVC validées, sans autorisation d’exercice » ;
  - attestation RPPS pour « EVC validées avec autorisation d’exercice » et « Diplôme français ou européen ».
  
  Elles sont annoncées sur les cartes et reprises dans le récapitulatif.
- « Retirer le fichier » n’est plus une barre sur toute la largeur.

## Passe de finition (v6.1) : témoignages, listes déroulantes, mouvement, navigation

- **« Ils nous font confiance. »** : uniquement des témoignages, extraits des avis. Sur `#/admin/avis`, un avis publié peut être « mis en témoignage ». Les trois plus récents s’affichent, le premier en grand sur turquoise. Retirés : chiffres clés, témoignage d’établissement, logos partenaires. Sur l’accueil, ce bloc remplace celui des avis : la liste complète reste dans l’espace praticien et sur `#/avis`. Le texte d’accord du formulaire d’avis et les mentions légales le précisent.
- **Listes déroulantes** : les listes natives (pays, tri, indicatif, type de créneau, structure, mois et année du calendrier) s’ouvrent au style du site : surface blanche, coins arrondis, ligne choisie en menthe avec coche. Cela passe par `appearance: base-select` (Chrome et Edge 135+) ; ailleurs, la liste du système. Cases à cocher dessinées comme les puces (coche blanche sur turquoise).
- **Mouvement** :
  - transitions de page plus courtes (0,3 s) ;
  - titres plus rapides (mots en 0,6 s, cascade plafonnée à 0,42 s) ;
  - apparitions et photos raccourcies ;
  - sur les pages de tâche (dossier, renfort, offres, fiche, contact, avis, éligibilité, mentions), le contenu est là tout de suite, sans chorégraphie ;
  - l’ouverture des portes de l’accueil reste le moment fort ;
  - les fenêtres s’ouvrent depuis leur bouton ;
  - sur écran tactile, plus de faux survol (carte soulevée, flèche décalée).
- **Navigation** :
  - à chaque changement de page, le focus clavier et lecteur d’écran repart du contenu ;
  - « Suis-je éligible ? » et « Avis » allument leur rubrique dans le menu.
- **Bouton corail** : plus de halo coloré au survol.

## Version 6 : Laska Corporate, situation du praticien, contrats, avis, CRM

Maquette de présentation : elle montre l’UI/UX et le fonctionnement prévu (CRM, avis, modération). Rien n’est branché : les données « CRM » et les avis sont simulés dans le navigateur. Copie de la v5 dans `_sauvegarde-v5/`.

**Marque et textes**
- « Laska » devient **« Laska Corporate »** dans tous les textes (titres d’onglet, en-tête, pied de page, notices, partage, mentions légales). Raison sociale « LASKA CORPORATE » et logo inchangés.
- Retirés : « diplômés hors UE » (accroche, titre de l’accueil, Engagement, FAQ, description) et « Sans compte à créer » (remplacé par « Réponse sous 48 h »). Le test d’éligibilité garde la réponse « Hors de l’Union européenne », qui est une option du test.

**Dossier praticien**
- **Votre situation** : 4 cartes à choisir.
  - Sans EVC.
  - EVC validées, sans autorisation d’exercice : demande la date.
  - EVC validées avec autorisation d’exercice : demande la date et une copie de l’autorisation.
  - Diplôme français ou européen : demande la date et une copie du diplôme.
  
  Chaque carte annonce ce qui sera demandé. Les champs n’apparaissent qu’après le choix, et ils sont alors obligatoires.
- Le **test d’éligibilité** préremplit la bonne situation.
- **CV obligatoire** : message « Joignez votre CV » s’il manque. « CV facultatif » est retiré partout.
- **Contrat recherché** : choix multiple entre Intérim, CDI, CDD et Vacation.
- **Téléphone avec indicatif pays** : une liste (France d’abord), puis le numéro.
  - Un « +216… » tapé dans le numéro règle la liste tout seul.
  - Le numéro est mis en forme ; un numéro français mal compté reçoit un message précis.
  - Même champ dans la demande établissement et dans « Être rappelé ».

**Établissements**
- Plus d’« Offres en cours » : retiré du menu et de l’accueil établissement (section carte).
- **Demande de renfort** : 4 contrats, Intérim, Vacation, CDI et CDD (« À définir ensemble » retiré).
  - Intérim et vacation : les créneaux, comme avant, sans « Prise de poste (CDI) » dans la liste des types.
  - CDI et CDD : l’étape 2 devient « Prise de poste », avec un champ « À partir du » par spécialité ou « Date à définir avec Laska Corporate ».
  - Le récapitulatif et la confirmation suivent.
- Textes, cartes contrat et tarifs regroupés en « Intérim · Vacation » et « CDI · CDD ».

**Avis des praticiens** (services.js, section « Avis des praticiens »)
- **Page `#/avis`** :
  - les avis publiés, avec la note moyenne ;
  - le formulaire « Donner mon avis » : nom, prénom, spécialité, pays d’exercice, note de 1 à 5 étoiles (clavier : flèches), texte de 20 à 500 caractères, et une case d’accord pour la publication.
- **Validation par l’équipe avant publication** : un avis déposé est « en attente » et n’apparaît pas sur le site.
- **Modération simulée sur `#/admin/avis`** : « Publier », « Refuser », « Retirer du site », avec « Annuler ».
- Un avis publié s’affiche sous « Prénom N. », avec la spécialité et le pays, sur l’accueil (espace praticien), dans l’espace praticien et sur `#/avis`.
- Sans avis publié : une invitation en maquette, rien en production. Aucun avis n’est inventé.
- Le témoignage d’établissement reste un emplacement à compléter.
- Pour la démonstration, les avis sont gardés dans ce navigateur (`localStorage`, clé `laska-avis`). Production : dépôt vers le CRM ou le back-office, modération par l’équipe.

**Référentiels du CRM** (`crm.js`)
- Spécialités, départements (101, avec leur code) et pays sont lus depuis `CRM`, un export simulé.
- Les offres ne gardent que des codes ; les noms viennent du CRM.
- Les listes, les filtres et les formulaires suivent le CRM. En production : lecture côté serveur depuis le CRM, endpoint à confirmer.

## Version 5 : agir plus facilement, informations des offres, revue UI

**Pour agir plus facilement**
- **Récapitulatif avant envoi** (dossier praticien, demande établissement) : chaque partie relue d’un coup d’œil, « Modifier » ramène au bon endroit.
- **Confirmation utile** : numéro de référence (copiable), « Revoir ce que vous avez envoyé », « Imprimer ou enregistrer en PDF », adresse à laquelle part l’email de confirmation (en service réel).
- **Créneaux en série** (établissements) : « Ajouter une période » (du… au…, jours cochés, par exemple le week-end), avec le nombre de créneaux calculé en direct.
- **Dossier praticien en cinq étapes**, sans partie repliée « facultative » : 1 Vous (dont téléphone et lieu de vie), 2 Votre métier, 3 Votre situation (autorisation si obtenue, CV facultatif), 4 Vos créneaux ou Vos disponibilités, 5 Vos souhaits (facultatif : régions, contrat, langues). Quand on postule à une offre, les disponibilités sont les créneaux cochés, synchronisés dans les deux sens avec la fiche.
- **Offres** : filtre « Période » (mois), tri (dates les plus proches, département, spécialité), « Offres gardées ».
- **Garder et partager** : cœur sur chaque offre (gardé dans ce navigateur, sans compte), « Partager » (WhatsApp, email, lien copié ; partage natif sur téléphone).
- **Aide toujours visible** (« Besoin d’aide ? » en bas à droite) : appeler, WhatsApp, être rappelé, écrire. **« Être rappelé »** : nom, téléphone, moment préféré ; aussi sur la page Contact, la fiche d’offre et le bloc « Besoin urgent ».
- **« Suis-je éligible ? »** (`#/eligibilite`) : trois questions, une orientation prudente (étapes, « vous êtes ici », documents à préparer), puis « Créer mon dossier » prérempli. Liens depuis l’accueil, l’espace praticien et le pied de page.

**Contenus : exemples signalés et emplacements à compléter** (`MAQUETTE = true` dans services.js les affiche ; `false` les masque)
- **Conditions des offres** (contrat, rémunération, type d’établissement, avantages) : EXEMPLES dans app.js (`details`, `PAY`, `STRUCTURE`, `CDI_OFFERS`), signalés sur la fiche. Le nom de l’établissement reste confidentiel.
- **Preuves** (chiffres, témoignages, logos partenaires) : `PROOF` dans services.js, vide ; l’accueil montre les emplacements « À compléter ».
- **Tarifs et délais** (établissements) : `PRICING` dans services.js, vide ; section « Tarifs et délais » avec emplacements.
- **Mentions légales** : complétées (TVA calculée depuis le SIREN : FR29 983 374 398, hébergeur du site actuel Vercel, données chez Supabase, crédits, accessibilité) ; **capital social à compléter** ; hébergeur et TVA à confirmer.
- **WhatsApp** : `WHATSAPP` dans services.js utilise pour l’instant le standard (33184803696), **à confirmer**.

**Revue UI**
- Titres des pages pratiques, de la fiche d’offre, du pied de page et de la conviction réduits ; chiffres des étapes et mots « Intérim / CDI » plus petits.
- Plus aucun texte sous 13 px ; aides sous les champs à 14 px.
- Boutons « Ajouter une date / une période » de vrais boutons ; halo de l’interrupteur d’espace adouci (une seule fois).
- Animations plus courtes et moins amples ; la pastille corail « atterrit » seulement sur les grands titres.
- Correction d’un défilement horizontal sur « Mon dossier ».

## Champs date (v4.4)

Le calendrier natif du navigateur (non réglable, différent selon l’appareil) est remplacé par un calendrier Laska sur les trois champs date : créneaux de la demande établissement, « Disponible à partir du » et « Autorisation obtenue le ». Le bouton affiche la date en toutes lettres (« Mer. 28 octobre 2026 ») ; le calendrier est en français, avec de grandes cases, le mois et l’année en listes directes (une autorisation de 2019 se choisit en deux gestes), les dates impossibles grisées (passé pour les créneaux et la disponibilité, futur pour l’autorisation), « Aujourd’hui » et « Effacer ». Clavier : flèches, Page précédente / suivante, Début / Fin, Échap. Sur téléphone, il s’ouvre en bas de l’écran. La valeur reste dans un champ date caché : envoi et validation inchangés (fonctions `dateField` et `bindDates` dans app.js).

## Erreurs humaines (v4.3)

Chaque erreur probable reçoit une aide sur place et une façon simple de revenir en arrière ; rien n’est bloquant (code : section « Erreurs humaines » d’app.js).
- **Contact** : si le sujet contredit l’espace du visiteur (praticien qui choisit « Je recrute », ou l’inverse), ou si son message parle visiblement de l’autre cas (« notre service recherche un renfort »…), un encadré le signale avec la correction en un clic, ou « Non, c’est correct ».
- **Mauvaise adresse email** : un praticien qui clique sur affairesmedicales@ (ou un établissement sur contact@) voit une question : écrire à la bonne adresse, ou continuer quand même.
- **Mauvais formulaire** : arriver sur « Mon besoin » depuis l’espace praticien (ou sur « Mon dossier » depuis l’espace établissement) affiche un bandeau avec le bon formulaire en un clic ; sinon, une ligne discrète en tête du formulaire.
- **Changement d’espace** : chaque changement (interrupteur, portes, bandeaux) affiche « Vous êtes maintenant dans l’espace… » avec **Annuler** ; quand le site choisit l’espace à la place du visiteur (page visitée, recherche, mini-brief), il le dit et propose l’autre.
- **Saisie** : faute de frappe dans l’email (gmial.com, .con, @ oublié…) → « Vouliez-vous dire … ? Oui, corriger » ; numéros français remis en forme (06 12 34 56 78).
- **Fichiers** : la raison du refus et la marche à suivre (document Word à enregistrer en PDF, photo d’iPhone HEIC, fichier trop lourd avec sa taille).
- **Zéro résultat** : la page Offres propose l’élargissement utile (« Voir les 5 offres de cette spécialité dans toute la France »…).
- **Créneau retiré par erreur** : « Annuler » pendant 10 s.
- **Saisie perdue** : les formulaires sont gardés dans l’onglet (stockage de session, sans les fichiers) ; après un rechargement, « Nous avons gardé ce que vous aviez commencé à remplir » avec « Tout effacer ». Tout disparaît à la fermeture de l’onglet (mentions légales mises à jour).

## Retours du 15 octobre 2026, suite (v4.2) : logo et facilité d’usage

- **Logo officiel** Laska Corporate | Médical : tête de loup et croix redessinées en SVG d’après le fichier fourni (`assets/favicon.svg`, fonction `wolfMark` dans app.js), texte d’origine (`assets/logo-texte.png`), logo complet d’origine (`assets/logo-laska.png`). À la première visite, le contour du loup se dessine puis la croix apparaît. Grande tête de loup en filigrane dans le pied de page.
- **Spécialités sans liste déroulante** : dans le mini-brief « Du renfort pour vos équipes », la demande établissement et le dossier praticien, les spécialités sont des puces à cocher (plusieurs choix). Les plus demandées d’abord ; « + N autres spécialités » affiche toutes les autres sur place.
- **Recherche par spécialités multiples** (accueil et page Offres), comme les départements ; l’adresse garde la sélection (`?specialite=0,3`). Les listes ont un titre, un bouton Fermer visible, un bouton « Voir les N offres » qui annonce le résultat, et s’ouvrent en bas de l’écran sur téléphone.
- **Formulaires en étapes numérotées** : établissement (1 Votre besoin, 2 Vos dates, 3 Vos coordonnées), praticien (1 Vous, 2 Votre métier, puis « Pour aller plus vite » facultatif).
- **Consignes plus claires** : « Choisissez une spécialité ou un département pour voir ses offres » remplace « Survolez… », sans objet sur téléphone.

## Retours du 15 octobre 2026 (v4.1)

- **Email établissements** : affairesmedicales@laskacorp.com (pied de page, demande de renfort, page Contact selon le sujet, confirmation, FAQ). contact@laskacorp.com reste l’adresse des praticiens.
- **Départements en choix multiple** : liste déroulante à cases (accueil et page Offres), synchronisée avec la carte ; l’adresse garde la sélection (`?departement=13,69`).
- **Offres à plusieurs créneaux** avec **dates exactes** : cartes et lignes affichent la période réelle et le nombre de créneaux ; la fiche liste chaque créneau (jour, date, type). Le praticien coche ceux qui l’intéressent : ils sont repris, modifiables, dans sa candidature. ⚠️ Les dates sont des **exemples** (`sourceSlots` dans app.js) à remplacer par les vraies.
- **Nom de l’établissement retiré** de la fiche d’offre (confidentiel).
- **« Mission » devient « offre »** dans les titres, la navigation (« Offres en cours »), les compteurs et la carte.
- **Demande établissement** : spécialités en choix multiple (formulaire et mini-brief d’accueil) ; pour chaque spécialité, un ou plusieurs créneaux (date + type : garde 24 h, journée 10 h / 12 h, nuit, prise de poste CDI), ou « dates à définir avec Laska ».
- **Dossier praticien** : le bloc « Votre autorisation d’exercice » (date d’obtention + copie en PDF, JPG ou PNG) est visible sous « Où en êtes-vous ? ». Il devient obligatoire avec « Autorisation d’exercice obtenue » (choisie automatiquement si l’on remplit la date ou joint la copie) et disparaît pour « Je commence » ou « Démarches en cours ». La disponibilité est « dès maintenant » ou « à partir d’une date » choisie.
- **Contact** : tant que le visiteur n’a pas choisi de sujet, il suit le profil ; un établissement voit « Je recrute » et affairesmedicales@laskacorp.com en premier. L’adresse du pied de page suit aussi le profil.

## Ce qui change dans la v4 : animations et finitions

Fil conducteur : **la route jusqu’à la destination** — le pointillé du parcours et la pastille corail de la marque guident chaque animation (détail dans DESIGN.md, section Mouvement).
- Accueil : les deux portes s’ouvrent depuis le centre à la première visite ; les titres montent mot à mot et la pastille corail atterrit sur le point final.
- Nouvel **index des spécialités** relié à la carte : survoler « Médecine d’urgence » montre ses départements et leur nombre de missions. Remplace les quatre cartes d’exemple.
- Carte de France dessinée en vague depuis la Méditerranée ; pastilles qui se posent ; lien survol ligne d’offre ↔ département sur la page Offres.
- Parcours praticien tracé au fil du défilement ; étapes établissement en grands chiffres qui se remplissent.
- Transitions de vue : changement de profil en cercle depuis le bouton, numéro d’offre qui passe de la liste à la fiche (et revient, avec le défilement restauré), formulaire envoyé sans saut.
- Retours : filtres à pastille glissante, compteurs qui roulent, lignes qui glissent à leur nouvelle place, erreurs effacées dès la correction, CV déposable par glisser-déposer, accordéons fluides.
- Finitions : plus d’étiquettes en capitales au-dessus des titres (fil d’Ariane sur les pages internes), plus de filets ni de contours d’un pixel, ombres réservées aux éléments flottants, barre de défilement et curseur de saisie aux couleurs de la marque.
- Accessibilité : tout reste visible sans JavaScript ; « réduire les animations » supprime les déplacements et garde les changements d’état.

## Ouvrir la maquette

Double-cliquez sur **index.html** : tout fonctionne en local, sans installation ni connexion.
Pour une prévisualisation HTTP (Node.js installé) :

```powershell
node server.cjs
```

puis http://127.0.0.1:4173/ (Ctrl+C pour arrêter).

## Ce qui change dans la v3

### Deux publics, un seul site, sans connexion
Le site s’adresse aux **praticiens** (diplômés hors UE) et aux **établissements**. Plutôt qu’un login, la maquette utilise un **profil de visite** :

| Situation | Ce que voit le visiteur |
| --- | --- |
| Première visite | Accueil en **deux portes** côte à côte : recherche de missions (praticien) et mini-brief de renfort (établissement). Chacun peut agir dès le premier écran, sans choisir d’abord. Bouton d’en-tête **« Commencer »** avec un menu à deux entrées. |
| Profil praticien | Bouton d’en-tête **« Créer mon dossier »**, navigation praticien, accueil centré sur les missions, la carte et le parcours. |
| Profil établissement | Bouton d’en-tête **« Décrire mon besoin »**, navigation établissement, accueil centré sur la méthode, les vérifications et l’urgence. |

Le profil se choisit ou se corrige partout :
- l’interrupteur **« Vous êtes : Praticien / Établissement »** dans l’en-tête (dans le menu sur mobile) ;
- la porte réduite de l’accueil (« Espace établissement » / « Espace praticien ») ;
- les liens « Vous recrutez ? / Vous êtes praticien ? » sur chaque formulaire, pour rattraper une erreur d’aiguillage.

Il est aussi **déduit de la page** : /praticiens et /postuler fixent « praticien », /etablissements et /besoin fixent « établissement ». Changer de profil sur une de ces pages ouvre la page équivalente de l’autre public.

### Autres améliorations UX
- **Carte de France** des missions (points + pastilles par département) sur l’accueil et la page Offres ; un clic filtre les offres. Vue Liste / Carte sur mobile.
- **Mini-brief établissement** (spécialité + contrat en deux clics) qui préremplit le formulaire de besoin.
- **Compteur en direct** sur la recherche d’accueil (« Voir les 5 offres »).
- Formulaires : choix courts en **boutons visibles** au lieu de listes déroulantes, **anneau de progression** des champs obligatoires, cases « Autre » conditionnelles, erreurs près des champs et en résumé, écran de confirmation avec les étapes suivantes.
- Fiche d’offre : en-tête immersif avec le numéro du département, informations « À préciser » assumées, carte de candidature fixe, missions proches, barre d’action fixe sur mobile.
- Contact : sujet prérempli selon le profil ou l’offre d’origine.
- Transitions animées entre profils (View Transitions API), mouvement réduit respecté, focus visible, lien d’évitement, menu fermé par Échap.

## Fichiers

- `index.html` — point d’entrée.
- `app.js` — données, routes et rendu. Chaque fonction de rendu (`header`, `doorPro`, `quickBrief`, `franceMap`, `offerRow`, `application`…) correspond à un futur composant.
- `styles.css` — composants (tokens en tête, puis composants, puis responsive 1100 / 860 / 620 px).
- `espace.js` — espace candidat : connexion simulée, accueil, profil, questions, et les écrans des huit tuiles (chargé avant app.js).
- `crm.js` — référentiels du CRM (spécialités, départements, pays), export simulé pour la maquette (chargé en premier).
- `services.js` — garder et partager une offre, aide et « Être rappelé », « Suis-je éligible ? », avis des praticiens et modération, emplacements de contenu à fournir (chargé avant app.js).
- `motion.js` / `motion.css` — couche de mouvement (apparitions, titres, carte, parcours, FLIP, transitions de vue). En Next.js : un hook `useReveal`, un composant `SplitTitle`, et les transitions de vue du routeur.
- `design-tokens.json` — couleurs et polices au format DTCG.
- `DESIGN.md` — système visuel et décisions. `PRODUCT.md` — cadre produit.
- `assets/` — photos, polices locales (Manrope, DM Sans) et licences.

## Passage à Next.js — recommandations

1. **Profil** : cookie `laska_profil` (`pro` | `etab`), lu côté serveur (middleware ou `cookies()` dans le layout) pour rendre la bonne variante sans flash. La maquette utilise `localStorage` uniquement pour la démonstration.
2. **SEO** : garder `/praticiens` et `/etablissements` comme pages d’atterrissage indexables et autonomes ; l’accueil sans cookie affiche les deux portes (rendu par défaut pour les robots).
3. **Composants** : `ProfileSwitch`, `HeaderCta`, `SplitHero` (états `open` / `pro` / `etab`), `QuickBrief`, `FranceMap` (SVG calculé à partir des coordonnées des préfectures), `OfferCard`, `OfferRow`, `ProgressRing`, `PillGroup`.
4. **Formulaires** : brancher l’envoi réel, le dépôt de CV et la politique de confidentialité validée avant publication.

## Contenu et limites

Offres (19), coordonnées et principes repris du site actuel (visite du 13 octobre 2026) et figés pour la maquette. Aucune donnée n’est envoyée : les formulaires sont des simulations. Pas de témoignages, logos clients ni chiffres inventés. Photographies Unsplash d’illustration, qui ne représentent pas l’équipe Laska. Informations juridiques à compléter et à valider avant publication.
