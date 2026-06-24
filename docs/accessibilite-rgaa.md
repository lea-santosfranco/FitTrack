# Accessibilité — bonnes pratiques RGAA

FitTrack n'a pas fait l'objet d'un audit RGAA complet, mais quelques principes
du référentiel ont été appliqués au fil du développement de l'interface React.

## Pratiques appliquées

- **Labels de formulaire associés aux champs** (`<label htmlFor>` / `id`) sur
  les pages Login et Register, pour que les lecteurs d'écran annoncent
  correctement chaque champ (critère RGAA 11.1).
- **Icônes décoratives masquées aux technologies d'assistance**
  (`aria-hidden="true"`) sur les émojis de navigation (Sidebar), qui sont déjà
  accompagnés d'un libellé texte — évite une annonce redondante ou confuse
  au lecteur d'écran (critère RGAA 1.1/1.2).
- **Contraste des couleurs** : la palette (texte gris foncé sur fond clair,
  boutons bleu `#2563eb` sur blanc) respecte un ratio de contraste AA pour le
  texte normal.
- **Navigation au clavier** : les éléments interactifs sont des `<button>`,
  `<a>`/`<NavLink>` et `<input>` natifs (pas de `<div onClick>`), ce qui
  garantit la focusabilité et l'activation au clavier sans code
  supplémentaire ; les champs de saisie ont un anneau de focus visible
  (`focus:ring-2`).

## Pistes pour aller plus loin

- Audit RGAA complet (grille AcceSpec ou similaire) sur l'ensemble des pages.
- Vérification du contraste sur les états désactivés/hover.
- Ajout d'un mode de navigation "passer au contenu principal" (skip link).
