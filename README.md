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

## 🌙 Mise à jour automatique (GitHub Actions, chaque nuit)

Le site est **100 % statique** : aucun appel réseau au chargement, les données viennent
uniquement de `data.js`. C'est une **GitHub Action** qui fait le travail côté serveur :

- `.github/workflows/update-results.yml` — cron à **03:00 UTC** (+ bouton manuel).
- `scripts/update-results.mjs` — récupère les résultats, recalcule le `stage` de chaque
  équipe, met à jour `LAST_UPDATED`, puis `commit` + `push`. Pas de dépendance (Node 20).

GitHub Pages se redéploie automatiquement après le push → classement à jour le matin.

### ⚙️ Activation (une seule fois)

1. Crée un compte gratuit sur **https://www.football-data.org/client/register**
   et récupère ton token API.
2. Dans le repo GitHub : **Settings → Secrets and variables → Actions → New repository secret**
   - Nom : `FOOTBALL_DATA_TOKEN`
   - Valeur : ton token.
3. Onglet **Actions** → workflow « Mise à jour nocturne » → **Run workflow** pour tester.

> Les équipes hors du Mondial (ou non trouvées dans l'API) gardent leur `stage` actuel
> (`group`, 0 pt) — c'est volontaire. La correspondance des noms FR → API est dans
> `NAME_MAP` (en haut de `scripts/update-results.mjs`) : vérifie-la quand l'API 2026 est live.
