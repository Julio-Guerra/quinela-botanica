# 🏆 Quiñela — Coupe du Monde 2026

Page web statique pour gérer la quiñela (pool d'équipes) de la Coupe du Monde 2026.
**100 % navigateur** : pas de Node, pas de build, pas de serveur. Juste 4 fichiers.

| Fichier | Rôle |
|---|---|
| `index.html` | La page |
| `style.css` | Le thème (or / bleu nuit) |
| `data.js` | **👉 le seul fichier à modifier** (participants, équipes, résultats, barème) |
| `app.js` | Le moteur (calcul des points, classement, podium, API) |

## ✏️ Mettre à jour après un match

Ouvre `data.js` et change le `stage` d'une équipe (le tour le plus loin atteint) :

```js
{ name: "France", stage: "qf" },   // a atteint les quarts
```

Valeurs possibles : `group` · `r32` · `r16` · `qf` · `sf` · `final` · `champion`.

Sauvegarde, rafraîchis la page → points, classement et podium se recalculent seuls.
Tu peux aussi changer le barème dans `SCORING` en haut de `data.js`.

## 🚀 Héberger sur GitHub Pages

1. Crée un dépôt GitHub et pousse ces fichiers à la racine :
   ```bash
   git init
   git add .
   git commit -m "Quiñela Coupe du Monde 2026"
   git branch -M main
   git remote add origin https://github.com/<toi>/<repo>.git
   git push -u origin main
   ```
2. Sur GitHub : **Settings → Pages → Source : Deploy from a branch → `main` / `root`**.
3. Ton site est en ligne sur `https://<toi>.github.io/<repo>/`.

Pour publier une mise à jour : édite `data.js`, puis `git commit` + `git push`. La page se met à jour.

## 🌙 Mise à jour automatique (routine nocturne)

Le site est **100 % statique** : aucun appel réseau au chargement. Les données viennent
uniquement de `data.js`. Une routine distante (cron / agent) tourne chaque nuit, met à jour
les `stage` dans `data.js`, renseigne `LAST_UPDATED`, puis fait `commit` + `push` sur GitHub.

La routine doit produire un `data.js` valide où :
- chaque équipe a un `stage` parmi `group · r32 · r16 · qf · sf · final · champion` ;
- `const LAST_UPDATED = "2026-06-13T03:00:00Z";` (date du passage, affichée sur la page).

GitHub Pages se redéploie automatiquement à chaque push → le classement est à jour le matin.
