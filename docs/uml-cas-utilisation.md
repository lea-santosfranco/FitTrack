# Diagramme de cas d'utilisation — FitTrack

```mermaid
flowchart LR
  Utilisateur(("Utilisateur"))
  Admin(("Administrateur"))

  subgraph FitTrack["Système FitTrack"]
    UC1["S'inscrire"]
    UC1b["Vérifier son email"]
    UC2["Se connecter"]
    UC3["Consulter / modifier son profil"]
    UC4["Consulter le catalogue d'exercices"]
    UC5["Créer une séance"]
    UC6["Modifier / supprimer une séance"]
    UC7["Ajouter un exercice à une séance"]
    UC8["Modifier / retirer un exercice d'une séance"]
    UC9["Consulter le tableau de bord (stats, PR, streak)"]
    UC10["Exporter l'historique (CSV / PDF)"]
    UC13["Consulter les programmes pré-définis"]
    UC14["Copier un programme dans ses séances"]
    UC15["Chronométrer une séance (timer + repos)"]
    UC16["Partager son bilan (image)"]
    UC11["Créer / modifier / supprimer un exercice"]
    UC12["Gérer les rôles utilisateurs"]
  end

  Utilisateur --> UC1
  Utilisateur --> UC1b
  Utilisateur --> UC2
  Utilisateur --> UC3
  Utilisateur --> UC4
  Utilisateur --> UC5
  Utilisateur --> UC6
  Utilisateur --> UC7
  Utilisateur --> UC8
  Utilisateur --> UC9
  Utilisateur --> UC10
  Utilisateur --> UC13
  Utilisateur --> UC14
  Utilisateur --> UC15
  Utilisateur --> UC16

  Admin --> UC2
  Admin --> UC11
  Admin --> UC12
  Admin -.hérite.-> Utilisateur
```

## Description des cas d'utilisation principaux

| Cas d'utilisation | Acteur | Pré-condition | Description |
|---|---|---|---|
| S'inscrire | Utilisateur | Email/username non utilisés, mot de passe conforme (maj/min/chiffre/spécial) | Création d'un compte non vérifié, mot de passe haché (Bcrypt), email de vérification envoyé |
| Vérifier son email | Utilisateur | Compte créé, token de vérification valide (24h) | Active le compte ; la connexion est refusée jusqu'à cette étape |
| Se connecter | Utilisateur, Admin | Compte existant et email vérifié | Authentification, émission d'un JWT (7 jours) |
| Créer une séance | Utilisateur | Authentifié | Création d'une séance datée, rattachée à l'utilisateur |
| Ajouter un exercice à une séance | Utilisateur | Séance existante et possédée par l'utilisateur | Association séance/exercice avec séries, répétitions, charge |
| Consulter le tableau de bord | Utilisateur | Authentifié | Agrégation des statistiques (durée totale, records, streak) |
| Copier un programme dans ses séances | Utilisateur | Authentifié, programme existant | Crée une nouvelle séance personnelle à partir d'un programme type, indépendante de l'original |
| Chronométrer une séance | Utilisateur | Sur la page de détail d'une séance | Chronomètre de durée totale + minuteur de repos avec notification sonore |
| Partager son bilan | Utilisateur | Authentifié | Génère une image récapitulative (Canvas) téléchargeable |
| Créer / modifier / supprimer un exercice | Admin | Rôle `admin` | Gestion du catalogue d'exercices partagé entre tous les utilisateurs |
| Gérer les rôles utilisateurs | Admin | Rôle `admin` | Promotion/rétrogradation d'un compte utilisateur |
