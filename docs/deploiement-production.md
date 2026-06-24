# Déploiement en production

## Différences avec l'environnement de développement

| | Développement (`docker-compose.yml`) | Production (`docker-compose.prod.yml`) |
|---|---|---|
| Frontend | Vite dev server (hot reload) | Build statique React servi par Nginx |
| Ports exposés | mysql, backend, frontend, nginx, phpMyAdmin | uniquement nginx (80/443) |
| HTTPS | non | oui (terminaison TLS sur le reverse proxy) |
| Variables d'env | valeurs par défaut dans le compose | uniquement via `.env`, aucune valeur par défaut |

## Mise en place

1. Copier `.env.example` vers `.env` et renseigner des valeurs fortes pour
   `DB_ROOT_PASSWORD`, `DB_PASSWORD` et `JWT_SECRET` (`NODE_ENV=production`).
2. Générer un certificat TLS dans `nginx/certs/` :
   - Démo / local : certificat auto-signé
     ```
     openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
       -keyout nginx/certs/privkey.pem -out nginx/certs/fullchain.pem
     ```
   - Production réelle : certificat Let's Encrypt (via certbot) placé aux mêmes
     emplacements (`fullchain.pem` / `privkey.pem`).
3. Lancer la stack :
   ```
   docker compose -f docker-compose.prod.yml up -d --build
   ```

## Sécurité

- Seul le conteneur `nginx` publie des ports sur l'hôte ; MySQL et le backend
  ne sont accessibles que sur le réseau Docker interne.
- Tout le trafic HTTP est redirigé vers HTTPS.
- Aucune valeur de mot de passe par défaut n'est définie dans le compose de
  production : un `.env` absent ou incomplet fait échouer le démarrage des
  conteneurs plutôt que de démarrer avec des identifiants faibles.
