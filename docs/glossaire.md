# Glossaire — FitTrack

## Termes métier

| Terme | Définition |
|---|---|
| **Séance** | Une session d'entraînement datée, créée par un utilisateur, pouvant contenir plusieurs exercices pratiqués (table `Workout`). |
| **Exercice** | Une entrée du catalogue partagé (ex. *Squat barre*), avec une catégorie et un groupe musculaire (table `Exercise`). |
| **Catégorie** | Classification d'un exercice : `Musculation`, `Cardio` ou `Flexibilité`. |
| **Programme** | Un modèle de séance type pré-défini (ex. *Programme Débutant Full-Body*), associé à un niveau et un objectif, copiable dans ses propres séances (table `Program`). |
| **PR (Personal Record / Record personnel)** | La charge la plus élevée jamais enregistrée par l'utilisateur pour un exercice donné. |
| **Streak** | Nombre de jours consécutifs (jusqu'à aujourd'hui ou hier) avec au moins une séance enregistrée. |
| **Volume** | Quantité d'entraînement réalisée, ici mesurée en durée cumulée de séances sur une période (30 derniers jours sur le dashboard). |
| **Bilan** | Synthèse des statistiques d'un utilisateur (séances, minutes, streak), exportable en CSV/PDF ou en image partageable. |

## Termes techniques

| Terme | Définition |
|---|---|
| **JWT (JSON Web Token)** | Jeton signé contenant l'identité de l'utilisateur (id, email, rôle), transmis dans l'en-tête `Authorization: Bearer <token>` à chaque requête authentifiée. Stateless : aucune session n'est stockée côté serveur. |
| **Bcrypt** | Algorithme de hachage utilisé pour stocker les mots de passe de façon irréversible (jamais en clair). |
| **Rate limiting** | Limitation du nombre de requêtes autorisées par IP sur une fenêtre de temps donnée (ici 10 tentatives / 15 min sur les routes d'authentification), pour limiter le brute-force. |
| **Helmet** | Middleware Express qui ajoute des en-têtes HTTP de sécurité (anti-clickjacking, anti-MIME-sniffing, CSP...). |
| **Requête paramétrée** | Requête SQL où les valeurs utilisateur sont passées séparément du texte SQL (`pool.execute(sql, [valeurs])`), empêchant toute injection SQL. |
| **Injection de formule CSV** | Faille où une cellule de fichier CSV commençant par `=`, `+`, `-` ou `@` peut être interprétée comme une formule par Excel/Sheets à l'ouverture. Neutralisée en préfixant ces valeurs d'une apostrophe. |
| **Anti-énumération** | Pratique consistant à renvoyer une réponse identique que des données (ex. un email) existent ou non en base, pour empêcher un attaquant de déduire des informations sur les comptes existants. |
| **RGAA** | Référentiel Général d'Amélioration de l'Accessibilité — ensemble de critères français pour rendre une interface utilisable par tous, y compris avec un lecteur d'écran. |
| **CI/CD (Intégration / Déploiement continus)** | Automatisation des tests et de la construction de l'application à chaque modification du code (ici via GitHub Actions). |
| **MCD / MLD** | Modèle Conceptuel de Données / Modèle Logique de Données — formalismes Merise décrivant respectivement les entités-relations métier et leur traduction en tables relationnelles. |
| **ORM vs requêtes paramétrées** | FitTrack n'utilise pas d'ORM : l'accès aux données passe par des requêtes SQL paramétrées directes via `mysql2`, pour un contrôle explicite des requêtes. |

## Acronymes du projet

| Acronyme | Signification |
|---|---|
| **CDA** | Concepteur Développeur d'Applications (titre RNCP niveau 6) |
| **BC** | Bloc de Compétences (unité d'évaluation du référentiel CDA) |
| **API** | Application Programming Interface |
| **JWT** | JSON Web Token |
| **CSP** | Content Security Policy |
| **CORS** | Cross-Origin Resource Sharing |
| **TLS/HTTPS** | Transport Layer Security / HTTP sécurisé |
