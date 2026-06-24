# Diagramme de cas d'utilisation — FitTrack

```mermaid
flowchart LR
  Utilisateur(("Utilisateur"))
  Admin(("Administrateur"))

  subgraph FitTrack["Système FitTrack"]
    UC1["S'inscrire"]
    UC2["Se connecter"]
    UC3["Consulter / modifier son profil"]
    UC4["Consulter le catalogue d'exercices"]
    UC5["Créer une séance"]
    UC6["Modifier / supprimer une séance"]
    UC7["Ajouter un exercice à une séance"]
    UC8["Modifier / retirer un exercice d'une séance"]
    UC9["Consulter le tableau de bord (stats, PR, streak)"]
    UC10["Exporter l'historique (CSV / PDF)"]
    UC11["Créer / modifier / supprimer un exercice"]
    UC12["Gérer les rôles utilisateurs"]
  end

  Utilisateur --> UC1
  Utilisateur --> UC2
  Utilisateur --> UC3
  Utilisateur --> UC4
  Utilisateur --> UC5
  Utilisateur --> UC6
  Utilisateur --> UC7
  Utilisateur --> UC8
  Utilisateur --> UC9
  Utilisateur --> UC10

  Admin --> UC2
  Admin --> UC11
  Admin --> UC12
  Admin -.hérite.-> Utilisateur
```

## Description des cas d'utilisation principaux

| Cas d'utilisation | Acteur | Pré-condition | Description |
|---|---|---|---|
| S'inscrire | Utilisateur | Email/username non utilisés | Création d'un compte avec mot de passe haché (Bcrypt) |
| Se connecter | Utilisateur, Admin | Compte existant | Authentification, émission d'un JWT (7 jours) |
| Créer une séance | Utilisateur | Authentifié | Création d'une séance datée, rattachée à l'utilisateur |
| Ajouter un exercice à une séance | Utilisateur | Séance existante et possédée par l'utilisateur | Association séance/exercice avec séries, répétitions, charge |
| Consulter le tableau de bord | Utilisateur | Authentifié | Agrégation des statistiques (durée totale, records, streak) |
| Créer / modifier / supprimer un exercice | Admin | Rôle `admin` | Gestion du catalogue d'exercices partagé entre tous les utilisateurs |
| Gérer les rôles utilisateurs | Admin | Rôle `admin` | Promotion/rétrogradation d'un compte utilisateur |
