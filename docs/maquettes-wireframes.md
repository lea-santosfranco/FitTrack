# Maquettes / wireframes — FitTrack

Wireframes basse-fidélité réalisés avant l'implémentation, pour valider la
structure des écrans principaux. Les écrans réels (Tailwind CSS) suivent cette
disposition générale.

## Connexion / Inscription

```
┌─────────────────────────────────────┐
│              FitTrack                │
│        Connectez-vous à votre compte │
│                                       │
│  [ Email                         ]   │
│  [ Mot de passe                  ]   │
│                                       │
│  [        Se connecter           ]   │
│                                       │
│  Pas encore de compte ? S'inscrire   │
└─────────────────────────────────────┘
```

À l'inscription, un message de confirmation remplace le formulaire après
soumission ("compte créé, vérifiez votre boîte mail") plutôt qu'une connexion
automatique.

## Layout général (après connexion)

```
┌──────────┬──────────────────────────────────────┐
│          │  Bonjour, {username} 👋               │
│ FitTrack │  Objectif : ...                       │
│          │                                        │
│ Dashboard│ ┌──────────────────────────────────┐  │
│ Exercices│ │         Contenu de la page        │  │
│ Séances  │ │                                    │  │
│ Programme│ │                                    │  │
│ Profil   │ └──────────────────────────────────┘  │
│          │                                        │
│Déconnexion│                                       │
└──────────┴──────────────────────────────────────┘
```

Sidebar fixe à gauche, contenu scrollable à droite. Disposition reprise sur
toutes les pages authentifiées.

## Dashboard

```
┌────────────────────────────────────────────────────┐
│  Bonjour, {username}     [Export CSV][Export PDF][Partager]
│                                                       │
│  [📅 Séances] [⏱️ Minutes] [🏋️ Exercices] [🔥 Streak]  │  ← KPI
│                                                       │
│  ┌─────────────────────┐  ┌─────────────────────┐   │
│  │ Volume 30 derniers   │  │ Répartition par      │   │
│  │ jours (barres)        │  │ catégorie (donut)    │   │
│  └─────────────────────┘  └─────────────────────┘   │
│                                                       │
│  Exercices les plus pratiqués (liste classée)        │
│  Records personnels (grille de cartes)               │
└────────────────────────────────────────────────────┘
```

## Détail d'une séance

```
┌────────────────────────────────────────────────────┐
│  {Titre de la séance}            [Modifier][Suppr.] │
│  📅 date   ⏱️ durée                                  │
│  Notes...                                            │
│                                                       │
│  ┌─────────────────────────────────────────────┐   │
│  │  Durée séance : 00:14:32   [Pause][Reset]     │   │
│  │  Timer repos : [30s][60s][90s][120s]          │   │
│  └─────────────────────────────────────────────┘   │
│                                                       │
│  Exercices                          [+ Ajouter]      │
│  ┌─────────────────────────────────────────────┐   │
│  │ Squat barre — 3 séries × 12 reps @ 60kg       │   │
│  │                          [Modifier][Retirer]  │   │
│  └─────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────┘
```

## Programmes pré-définis

```
┌────────────────────────────────────────────────────┐
│  Programmes pré-définis                              │
│                                                       │
│  ┌──────────────────────┐  ┌──────────────────────┐│
│  │ [débutant] Maintenir   │  │ [intermédiaire] Masse ││
│  │ Programme Full-Body    │  │ Haut/Bas               ││
│  │ Description...         │  │ Description...         ││
│  │ [Copier dans mes séances]│  │ [Copier dans mes séances]││
│  └──────────────────────┘  └──────────────────────┘│
└────────────────────────────────────────────────────┘
```

## Principes retenus

- **Une action principale par carte/écran** (ex. : un seul bouton primaire
  visible à la fois) pour limiter la charge cognitive.
- **Feedback immédiat** sur chaque action asynchrone (texte de bouton qui
  change pendant le chargement, ex. "Connexion...").
- **Couleurs porteuses de sens** : bleu pour les actions primaires, rouge pour
  les actions destructives, vert/orange/rouge pour les niveaux de difficulté
  des programmes.
