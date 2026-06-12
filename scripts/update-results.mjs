/* ============================================================================
 *  Routine nocturne — met à jour les "stage" dans data.js depuis une API.
 *  Aucune dépendance : Node 20+ (fetch intégré).
 *
 *  Source par défaut : football-data.org (palier gratuit, compétition "WC").
 *  → Crée un compte gratuit sur https://www.football-data.org/client/register
 *    puis ajoute le token dans les secrets du repo : FOOTBALL_DATA_TOKEN.
 *
 *  Les équipes absentes du tournoi (ou non trouvées) gardent leur valeur :
 *  elles restent "group" (0 pt), ce qui est exactement le comportement voulu.
 * ==========================================================================*/

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_FILE = join(__dirname, "..", "data.js");

const TOKEN  = process.env.FOOTBALL_DATA_TOKEN || "";
const COMP   = process.env.FOOTBALL_DATA_COMP || "WC";   // World Cup
const API    = `https://api.football-data.org/v4/competitions/${COMP}/matches`;

/* Ordre des tours, du plus tôt au plus loin (doit coller à data.js). */
const ORDER = ["group", "r32", "r16", "qf", "sf", "final", "champion"];

/* football-data.org "stage" → notre code. THIRD_PLACE = a atteint les demies. */
const API_STAGE = {
  GROUP_STAGE:    "group",
  LAST_32:        "r32",
  ROUND_OF_32:    "r32",
  LAST_16:        "r16",
  ROUND_OF_16:    "r16",
  QUARTER_FINALS: "qf",
  SEMI_FINALS:    "sf",
  THIRD_PLACE:    "sf",
  FINAL:          "final",
};

/* Nom FR (tel qu'écrit dans data.js, drapeau exclu) → nom côté API (anglais).
 * Seules les équipes réellement au Mondial seront trouvées ; les autres sont
 * simplement ignorées. Vérifie/ajuste ces libellés quand l'API 2026 est live. */
const NAME_MAP = {
  "France": "France", "Ghana": "Ghana", "Japon": "Japan",
  "Brésil": "Brazil", "Suisse": "Switzerland", "Irak": "Iraq",
  "Espagne": "Spain", "Maroc": "Morocco", "Panama": "Panama",
  "Allemagne": "Germany", "Tunisie": "Tunisia", "Jordanie": "Jordan",
  "Angleterre": "England", "Équateur": "Ecuador", "Qatar": "Qatar",
  "Portugal": "Portugal", "Côte d'Ivoire": "Ivory Coast", "Bosnie": "Bosnia and Herzegovina",
  "Pays-Bas": "Netherlands", "Australie": "Australia", "Nouvelle-Zélande": "New Zealand",
  "Belgique": "Belgium", "Sénégal": "Senegal", "Curaçao": "Curaçao",
  "Colombie": "Colombia", "Iran": "Iran", "Haïti": "Haiti",
  "Croatie": "Croatia", "Égypte": "Egypt", "Ouzbékistan": "Uzbekistan",
  "Norvège": "Norway", "Algérie": "Algeria", "Turquie": "Turkey",
  "Canada": "Canada", "Arabie saoudite": "Saudi Arabia", "Congo": "Congo",
  "États-Unis": "United States", "Paraguay": "Paraguay", "Cap-Vert": "Cape Verde",
  "Mexique": "Mexico", "Autriche": "Austria", "Écosse": "Scotland",
  "Argentine": "Argentina", "Corée du Sud": "South Korea", "Suède": "Sweden",
  "Uruguay": "Uruguay", "Afrique du Sud": "South Africa", "République tchèque": "Czech Republic",
};

/* ---------------------------------------------------------------------------
 * 1) Récupère les matchs et calcule, pour chaque équipe (nom API), le tour
 *    le plus loin atteint + qui est champion.
 * ------------------------------------------------------------------------- */
async function fetchStagesByApiName() {
  if (!TOKEN) throw new Error("FOOTBALL_DATA_TOKEN manquant (secret du repo).");

  const res = await fetch(API, { headers: { "X-Auth-Token": TOKEN } });
  if (!res.ok) throw new Error(`API HTTP ${res.status} — ${await res.text()}`);
  const { matches = [] } = await res.json();

  const best = {};   // nom API → index de tour le plus loin
  const bump = (team, stage) => {
    if (!team) return;
    const idx = ORDER.indexOf(stage);
    if (idx < 0) return;
    if (best[team] === undefined || idx > best[team]) best[team] = idx;
  };

  for (const m of matches) {
    const stage = API_STAGE[m.stage];
    if (!stage) continue;
    const home = m.homeTeam?.name;
    const away = m.awayTeam?.name;
    bump(home, stage);
    bump(away, stage);

    // Champion = vainqueur de la finale (match terminé).
    if (m.stage === "FINAL" && m.status === "FINISHED" && m.score?.winner) {
      const champ = m.score.winner === "HOME_TEAM" ? home : away;
      if (champ) best[champ] = ORDER.indexOf("champion");
    }
  }
  return best; // { "France": 3, ... } index dans ORDER
}

/* ---------------------------------------------------------------------------
 * 2) Réécrit data.js en place : remplace chaque "stage" connu + LAST_UPDATED.
 * ------------------------------------------------------------------------- */
function escapeRegex(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }

function updateDataFile(stagesByApiName) {
  let src = readFileSync(DATA_FILE, "utf8");
  let changed = 0;

  for (const [frName, apiName] of Object.entries(NAME_MAP)) {
    const idx = stagesByApiName[apiName];
    if (idx === undefined) continue;             // pas (encore) au tournoi
    const stage = ORDER[idx];

    // Cible : { name: "<drapeau> FrName", stage: "xxx", ... }
    const re = new RegExp(
      `(name:\\s*"[^"]*${escapeRegex(frName)}"\\s*,\\s*stage:\\s*")[a-z0-9]+(")`
    );
    const next = src.replace(re, `$1${stage}$2`);
    if (next !== src) { src = next; changed++; }
    else console.warn(`⚠️  Équipe non trouvée dans data.js : ${frName}`);
  }

  // Horodatage de la mise à jour.
  const now = new Date().toISOString();
  src = src.replace(
    /const LAST_UPDATED = [^;]*;/,
    `const LAST_UPDATED = "${now}";`
  );

  writeFileSync(DATA_FILE, src);
  return changed;
}

/* --------------------------------- main ---------------------------------- */
try {
  const stages = await fetchStagesByApiName();
  const n = updateDataFile(stages);
  console.log(`✅ Mise à jour terminée : ${n} équipe(s) modifiée(s).`);
} catch (err) {
  console.error("❌ Échec de la mise à jour :", err.message);
  process.exit(1);
}
