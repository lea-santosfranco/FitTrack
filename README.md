# FitTrack

Application web de suivi d'entraînement sportif — planifiez vos séances, suivez votre progression et gérez votre catalogue d'exercices depuis une interface moderne et responsive.

---

## Fonctionnalités

- **Compte utilisateur** — inscription avec vérification email, connexion sécurisée JWT, gestion du profil (poids, objectif)
- **Séances d'entraînement** — création, édition et historique de séances avec exercices, séries, répétitions et charges
- **Catalogue d'exercices** — consultation et recherche par catégorie ou groupe musculaire ; CRUD réservé aux administrateurs
- **Programmes pré-définis** — du niveau Débutant à Avancé, copiables en séances personnelles indépendantes
- **Statistiques & records** — dashboard de progression, streak d'activité, records personnels par exercice
- **Export** — export CSV, PDF et image partageable du bilan sportif
- **Timer de repos** — chronomètre intégré avec signal sonore
- **Administration** — gestion des utilisateurs et des rôles

---

## Stack technique

| Couche | Technologies |
|--------|-------------|
| Frontend | React 19 · TypeScript · Vite · Tailwind CSS · Recharts · Axios · React Router DOM v7 |
| Backend | Node.js · Express 5 · JWT (HMAC-SHA256) · bcrypt · express-validator · Swagger / OpenAPI |
| Base de données | MySQL 8 · mysql2 · requêtes paramétrées · migrations SQL |
| Infrastructure | Docker Compose · Nginx · GitHub Actions CI/CD · Let's Encrypt (HTTPS) |
| Tests | Jest · Supertest — 61 tests sur 6 modules |

---

## Architecture

```
Client (React SPA)
      │
      ▼ HTTPS
   Nginx (reverse proxy)
      │
      ├─▶ /api/*  →  Backend Express (port 5000, réseau interne)
      │               └─▶ MySQL (port 3306, réseau interne, non exposé)
      │
      └─▶ /*      →  Build statique React (servi par Nginx)
```

Le backend applique dans l'ordre : Helmet/CORS → rate-limit → authMiddleware (JWT) → checkRole → express-validator → contrôleur → modèle SQL.

---

## Prérequis

- [Docker](https://www.docker.com/) et Docker Compose
- Node.js ≥ 20 (développement local uniquement)

---

## Installation & lancement

### Développement

```bash
# Cloner le dépôt
git clone https://github.com/lea-santosfranco/FitTrack.git
cd FitTrack

# Copier et remplir les variables d'environnement
cp .env.example .env

# Lancer tous les services (MySQL, backend, frontend, Nginx, phpMyAdmin)
docker compose up --build
```

| Service | URL |
|---------|-----|
| Application | http://localhost |
| API | http://localhost:5000 |
| phpMyAdmin | http://localhost:8081 |

### Production

```bash
docker compose -f docker-compose.prod.yml up --build -d
```

L'application est accessible sur le port 443 (HTTPS). Le port 80 redirige automatiquement.

---

## Variables d'environnement

Créez un fichier `.env` à la racine à partir de `.env.example` :

```env
# Base de données
DB_HOST=mysql
DB_PORT=3306
DB_NAME=fittrack
DB_USER=fittrack_user
DB_PASSWORD=your_db_password

# JWT
JWT_SECRET=your_jwt_secret_min_32_chars

# Email (vérification de compte)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your@email.com
SMTP_PASS=your_smtp_password
MAIL_FROM=noreply@example.com

# App
FRONTEND_URL=http://localhost
NODE_ENV=development
```

> ⚠️ Ne commitez jamais le fichier `.env`. Il est dans le `.gitignore`.

---

## Tests

```bash
# Lancer tous les tests (Jest + Supertest)
cd backend
npm test

# Avec couverture
npm run test:coverage
```

61 tests couvrent les modules : `auth`, `workouts`, `exercises`, `programs`, `stats`, `admin`.

Les tests utilisent une base MySQL éphémère montée via le service Docker `mysql-test`.

---

## Documentation API

La documentation Swagger est disponible en développement à l'adresse :

```
http://localhost:5000/api-docs
```

---

## Structure du projet

```
FitTrack/
├── frontend/          # Application React (Vite + TypeScript)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   └── services/  # Appels API (Axios)
│   └── Dockerfile
│
├── backend/           # API REST (Node.js + Express)
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── utils/
│   ├── tests/         # Tests Jest + Supertest
│   └── Dockerfile
│
├── nginx/             # Configuration Nginx (dev + prod)
├── docs/              # Documentation technique du projet
├── docker-compose.yml
├── docker-compose.prod.yml
└── .env.example
```

---

## Sécurité

- Mots de passe hashés avec **bcrypt** (coût 10) — jamais stockés ni loggés en clair
- Authentification **JWT** (HMAC-SHA256, expiration 7 jours), vérifiée à chaque requête
- **Helmet** pour les en-têtes HTTP de sécurité
- **CORS** strict avec origines configurées
- **Rate limiting** : 10 tentatives / 15 min → HTTP 429 (protection brute-force)
- **express-validator** sur toutes les routes avec sanitisation systématique
- Requêtes SQL **paramétrées** — aucune concaténation de saisie utilisateur

---

## Licence

MIT
