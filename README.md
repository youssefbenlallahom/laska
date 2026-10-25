# Laska Corporate — maquette HTML (v7.2)

Maquette navigable du futur site Laska Corporate, à porter ensuite en React / Next.js. Une copie de la v3 est gardée dans `_sauvegarde-v3/` (à supprimer une fois la v4 validée).

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
