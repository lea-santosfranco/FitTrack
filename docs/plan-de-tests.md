# Plan de tests / Cahier de recette — FitTrack

Ce document complète la suite de tests automatisés (`backend/tests/*.test.js`,
61 tests Jest/Supertest exécutés en CI) par des scénarios fonctionnels de bout
en bout, à valider manuellement ou via un outil E2E (Cypress/Playwright).

## 1. Authentification

| # | Scénario | Étapes | Résultat attendu | Couvert par test auto |
|---|---|---|---|---|
| T01 | Inscription réussie | Renseigner username/email/mot de passe conforme, soumettre | Message "vérifiez votre email", aucune connexion automatique | ✅ `auth.test.js` |
| T02 | Mot de passe trop faible | Saisir `azerty` ou `Test123` (sans caractère spécial) | Rejet, message explicite (côté front et back) | ✅ |
| T03 | Email déjà utilisé | S'inscrire avec un email existant | 409, message d'erreur | ✅ |
| T04 | Connexion avant vérification | Se connecter avec un compte non vérifié | 403 "vérifiez votre email" + bouton "renvoyer" visible | ✅ |
| T05 | Vérification d'email | Cliquer sur le lien reçu (ou loggé en dev) | Compte activé, connexion possible ensuite | ✅ |
| T06 | Lien de vérification réutilisé | Cliquer deux fois sur le même lien | 400 à la deuxième tentative | ✅ |
| T07 | Connexion avec mauvais mot de passe | Email correct, mot de passe erroné | 401, message générique (pas de détail sur la cause) | ✅ |
| T08 | Brute-force login | 11 tentatives de connexion en moins de 15 min | La 11e requête est bloquée (429) | Manuel (rate-limit) |

## 2. Catalogue d'exercices

| # | Scénario | Étapes | Résultat attendu | Couvert |
|---|---|---|---|---|
| T10 | Consultation du catalogue | Aller sur "Exercices" | Liste des 20 exercices de base affichée | ✅ |
| T11 | Filtre par catégorie | Sélectionner "Cardio" | Seuls les exercices Cardio s'affichent | ✅ |
| T12 | Recherche par nom | Taper "squat" | L'exercice "Squat barre" apparaît | ✅ |
| T13 | Création par un non-admin | Utilisateur `user` tente de créer un exercice | 403 | ✅ |
| T14 | Suppression d'un exercice utilisé | Admin supprime un exercice référencé dans une séance | 409, suppression refusée | ✅ |

## 3. Séances et programmes

| # | Scénario | Étapes | Résultat attendu | Couvert |
|---|---|---|---|---|
| T20 | Création d'une séance | Renseigner titre + date, valider | Séance créée, redirection vers le détail | ✅ |
| T21 | Ajout d'un exercice à une séance | Choisir un exercice, séries/reps, valider | Exercice listé dans la séance | ✅ |
| T22 | Timer de séance | Lancer le chronomètre, observer 5s | Le temps affiché s'incrémente | Manuel (UI) |
| T23 | Timer de repos avec son | Lancer un repos de 30s, attendre la fin | Un bip est joué à expiration | Manuel (UI, audio) |
| T24 | Copie d'un programme | Cliquer "Copier dans mes séances" sur un programme | Nouvelle séance créée avec les mêmes exercices, indépendante du programme | ✅ |
| T25 | Modification d'une séance d'un autre utilisateur | Appeler l'API avec l'id d'une séance d'un autre compte | 404 (pas de fuite d'information sur l'existence) | ✅ (via `user_id` dans la clause `WHERE`) |

## 4. Statistiques et export

| # | Scénario | Étapes | Résultat attendu | Couvert |
|---|---|---|---|---|
| T30 | Dashboard avec données | Avoir au moins une séance, consulter le dashboard | KPI, graphiques, streak et PR cohérents avec les données | ✅ (valeurs) / Manuel (rendu visuel) |
| T31 | Export CSV | Cliquer "Export CSV" | Fichier téléchargé, ouverture sans erreur dans un tableur | ✅ (statut + content-type) / Manuel (ouverture réelle) |
| T32 | Export CSV anti-injection | Créer une séance avec une note `=1+1` | La cellule CSV correspondante est préfixée d'une apostrophe (pas de formule exécutée) | Manuel |
| T33 | Export PDF | Cliquer "Export PDF" | PDF généré avec l'historique des séances | ✅ |
| T34 | Partage du bilan | Cliquer "Partager mon bilan" | Image PNG générée et téléchargée | Manuel (UI, Canvas) |

## 5. Administration

| # | Scénario | Étapes | Résultat attendu | Couvert |
|---|---|---|---|---|
| T40 | Liste des utilisateurs | Admin consulte `/api/admin/users` | Liste complète sans les mots de passe | ✅ |
| T41 | Promotion en admin | Admin change le rôle d'un utilisateur | Rôle mis à jour, visible immédiatement | ✅ |
| T42 | Auto-rétrogradation | Un admin tente de retirer son propre rôle admin | 400, action refusée | ✅ |
| T43 | Accès admin par un non-admin | Utilisateur `user` appelle une route admin | 403 | ✅ |

## 6. Accessibilité (RGAA)

| # | Scénario | Résultat attendu | Méthode |
|---|---|---|---|
| T50 | Navigation clavier complète | Tous les formulaires et boutons sont atteignables et activables au clavier (Tab, Entrée) | Manuel |
| T51 | Lecteur d'écran sur le formulaire de connexion | Les champs sont annoncés avec leur libellé (`label for`) | Manuel (NVDA/VoiceOver) |
| T52 | Icônes décoratives | Les emojis de la sidebar ne sont pas annoncés par le lecteur d'écran (`aria-hidden`) | Manuel |

## 7. Non-régression / CI

Chaque push déclenche le workflow [`ci.yml`](../.github/workflows/ci.yml) :
1. Installation des dépendances backend et frontend.
2. Exécution des 61 tests Jest/Supertest contre une base MySQL éphémère.
3. Build TypeScript + Vite du frontend.
4. Build des images Docker (backend, frontend) pour valider les Dockerfiles.

Un échec à n'importe quelle étape bloque la fusion sur `main`.
