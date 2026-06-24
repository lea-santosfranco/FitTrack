# Diagramme de séquence — Authentification & flux JWT

## Connexion (login)

```mermaid
sequenceDiagram
  actor U as Utilisateur
  participant F as Frontend (React)
  participant N as Nginx
  participant B as Backend (Express)
  participant DB as MySQL

  U->>F: Saisit email + mot de passe
  F->>N: POST /api/auth/login
  N->>B: proxy_pass /api/auth/login
  B->>DB: SELECT * FROM User WHERE email = ?
  DB-->>B: Utilisateur (hash bcrypt)
  B->>B: bcrypt.compare(password, hash)
  alt mot de passe valide
    B->>B: jwt.sign({id, email, username, role}, JWT_SECRET, 7d)
    B-->>N: 200 { token, user }
    N-->>F: 200 { token, user }
    F->>F: localStorage.setItem('fittrack_token', token)
    F-->>U: Redirection /dashboard
  else mot de passe invalide
    B-->>F: 401 { error: "Invalid credentials." }
    F-->>U: Affiche message d'erreur
  end
```

## Requête authentifiée (vérification JWT)

```mermaid
sequenceDiagram
  actor U as Utilisateur
  participant F as Frontend (React)
  participant B as Backend (Express)
  participant MW as authMiddleware
  participant RW as checkRole (si requis)
  participant DB as MySQL

  U->>F: Action (ex: consulter ses séances)
  F->>B: GET /api/workouts<br/>Authorization: Bearer <token>
  B->>MW: jwt.verify(token, JWT_SECRET)
  alt token invalide ou expiré
    MW-->>F: 401 { error }
  else token valide
    MW->>MW: req.user = { id, email, username, role }
    opt route protégée par rôle
      MW->>RW: checkRole('admin')
      alt rôle insuffisant
        RW-->>F: 403 { error: "Access forbidden." }
      end
    end
    MW->>B: next()
    B->>DB: SELECT ... WHERE user_id = ?
    DB-->>B: Résultats
    B-->>F: 200 { workouts }
  end
```
