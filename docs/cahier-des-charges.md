# Cahier des charges — FitTrack

## 1. Contexte et objectif

FitTrack est une application web (et mobile, hors périmètre de ce dépôt) de suivi
d'entraînement sportif. Elle permet à un utilisateur de planifier ses séances,
suivre sa progression dans le temps, et s'appuyer sur des programmes types pour
démarrer rapidement.

L'objectif du projet est de démontrer la maîtrise d'une architecture applicative
complète (frontend, API REST, base de données relationnelle, conteneurisation,
sécurité) dans le cadre du titre RNCP Concepteur Développeur d'Applications.

## 2. Besoins fonctionnels

### 2.1 Gestion des comptes
- Un visiteur peut créer un compte (username, email, mot de passe).
- Le mot de passe doit respecter une politique de complexité (8 caractères
  minimum, majuscule, minuscule, chiffre, caractère spécial).
- L'adresse email doit être vérifiée par un lien envoyé par email avant que le
  compte puisse se connecter.
- Un utilisateur peut consulter et modifier son profil (poids, objectif).
- Deux rôles existent : `user` (par défaut) et `admin` (gestion du catalogue
  d'exercices et des rôles).

### 2.2 Catalogue d'exercices
- Tout utilisateur authentifié peut consulter le catalogue, filtrer par
  catégorie (Musculation, Cardio, Flexibilité) et rechercher par nom.
- Seul un administrateur peut créer, modifier ou supprimer un exercice du
  catalogue partagé.
- Un exercice référencé par au moins une séance ne peut pas être supprimé
  (intégrité référentielle).

### 2.3 Séances d'entraînement
- Un utilisateur peut créer, consulter, modifier et supprimer ses propres
  séances (titre, date, durée, notes).
- Un utilisateur peut ajouter, modifier ou retirer des exercices au sein d'une
  séance, avec séries / répétitions / charge / durée.
- Un chronomètre de séance et un minuteur de repos (avec signal sonore) sont
  disponibles sur la page de détail d'une séance.

### 2.4 Programmes pré-définis
- Des programmes types (débutant, intermédiaire, avancé) sont proposés,
  associés à un objectif (perte de poids, maintien, prise de masse).
- Un utilisateur peut copier un programme dans ses séances personnelles ; la
  copie est indépendante du programme d'origine.

### 2.5 Statistiques et partage
- Un tableau de bord agrège : nombre de séances, durée totale, exercices
  pratiqués, streak de jours consécutifs, records personnels par exercice,
  répartition par catégorie, volume sur 30 jours.
- L'historique peut être exporté en CSV ou en PDF.
- Un récapitulatif peut être généré sous forme d'image partageable.

### 2.6 Administration
- Un administrateur peut consulter la liste des utilisateurs et modifier leur
  rôle (sans pouvoir révoquer son propre rôle admin).

## 3. Besoins non fonctionnels

| Catégorie | Exigence |
|---|---|
| Sécurité | Mots de passe hashés (bcrypt), JWT signé, validation systématique des entrées, protection anti brute-force (rate limiting), en-têtes de sécurité HTTP (helmet), aucune injection SQL/CSV/LIKE possible |
| Accessibilité | Respect de quelques critères RGAA de base (labels de formulaire, alternatives textuelles, navigation clavier) |
| Performance | Pagination/filtrage côté base de données plutôt que côté client pour le catalogue d'exercices |
| Déploiement | Conteneurisation Docker, configuration distincte dev/production, HTTPS en production |
| Qualité | Suite de tests automatisés (Jest + Supertest) couvrant les routes API critiques, intégration continue (GitHub Actions) |
| Documentation | Documentation API générée (Swagger/OpenAPI), documentation de conception (UML, Merise) |

## 4. Contraintes techniques

- Backend : Node.js / Express / MySQL (via `mysql2`).
- Frontend : React + TypeScript + Vite + Tailwind CSS.
- Authentification : JWT stateless (pas de session serveur).
- Conteneurisation : Docker Compose (dev et prod).

## 5. Hors périmètre

- Authentification multi-facteurs (2FA).
- Application mobile (non présente dans ce dépôt).
- Paiement / fonctionnalités premium.
- Notifications push.
