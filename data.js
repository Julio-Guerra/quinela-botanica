/* ============================================================================
 *  QUIÑELA — COUPE DU MONDE 2026
 *  ----------------------------------------------------------------------------
 *  C'EST LE SEUL FICHIER QUE TU AS BESOIN DE MODIFIER.
 *  (This is the only file you need to edit.)
 *
 *  Après chaque match / tour, change juste le "stage" d'une équipe.
 *  Le tableau, les points et le podium se recalculent tout seuls.
 * ==========================================================================*/


/* ----------------------------------------------------------------------------
 *  1) BARÈME DES POINTS — combien rapporte chaque tour atteint par une équipe.
 *     Modifie librement ces valeurs, tout se recalcule.
 * --------------------------------------------------------------------------*/
const SCORING = {
  group:     0,   // Éliminée en phase de groupes
  r32:       1,   // Atteint les 32es de finale
  r16:       3,   // Atteint les 16es (huitièmes)
  qf:        6,   // Atteint les quarts
  sf:       10,   // Atteint les demi-finales
  final:    15,   // Finaliste (perdant de la finale)
  champion: 25,   // CHAMPION DU MONDE 🏆
};

// Bonus optionnel : points par victoire / nul accumulés en route.
// Mets les deux à 0 pour ignorer complètement et ne compter que les tours.
const BONUS = {
  perWin:  0,
  perDraw: 0,
};


/* ----------------------------------------------------------------------------
 *  2) LES PARTICIPANTS ET LEURS ÉQUIPES (tirage au sort).
 *
 *     - "name"  : le nom de l'équipe (remplace "Équipe N" après le tirage).
 *     - "stage" : le tour le plus loin atteint. Valeurs possibles :
 *                 "group" | "r32" | "r16" | "qf" | "sf" | "final" | "champion"
 *     - "wins" / "draws" : optionnel, seulement si tu utilises le BONUS.
 *
 *     👉 Pour mettre à jour : change "stage" d'une équipe et sauvegarde.
 * --------------------------------------------------------------------------*/
const PARTICIPANTS = [
  { name: "Jess",     surnom: "", teams: [
      { name: "🇫🇷 France",  stage: "group", wins: 0, draws: 0 },
      { name: "🇬🇭 Ghana",   stage: "group", wins: 0, draws: 0 },
      { name: "🇯🇵 Japon",   stage: "group", wins: 0, draws: 0 },
  ]},
  { name: "Julio",    surnom: "", teams: [
      { name: "🇧🇷 Brésil",  stage: "group", wins: 0, draws: 0 },
      { name: "🇨🇭 Suisse",  stage: "group", wins: 0, draws: 0 },
      { name: "🇮🇶 Irak",    stage: "group", wins: 0, draws: 0 },
  ]},
  { name: "Élodie",   surnom: "", teams: [
      { name: "🇪🇸 Espagne", stage: "group", wins: 0, draws: 0 },
      { name: "🇲🇦 Maroc",   stage: "group", wins: 0, draws: 0 },
      { name: "🇵🇦 Panama",  stage: "group", wins: 0, draws: 0 },
  ]},
  { name: "Thomas",   surnom: "", teams: [
      { name: "🇩🇪 Allemagne", stage: "group", wins: 0, draws: 0 },
      { name: "🇹🇳 Tunisie",   stage: "group", wins: 0, draws: 0 },
      { name: "🇯🇴 Jordanie",  stage: "group", wins: 0, draws: 0 },
  ]},
  { name: "Zuhey",    surnom: "", teams: [
      { name: "🏴󠁧󠁢󠁥󠁮󠁧󠁿 Angleterre", stage: "group", wins: 0, draws: 0 },
      { name: "🇪🇨 Équateur",   stage: "group", wins: 0, draws: 0 },
      { name: "🇶🇦 Qatar",      stage: "group", wins: 0, draws: 0 },
  ]},
  { name: "Elaine",   surnom: "", teams: [
      { name: "🇵🇹 Portugal",       stage: "group", wins: 0, draws: 0 },
      { name: "🇨🇮 Côte d'Ivoire",  stage: "group", wins: 0, draws: 0 },
      { name: "🇧🇦 Bosnie",         stage: "group", wins: 0, draws: 0 },
  ]},
  { name: "Momo",     surnom: "", teams: [
      { name: "🇳🇱 Pays-Bas",           stage: "group", wins: 0, draws: 0 },
      { name: "🇦🇺 Australie",          stage: "group", wins: 0, draws: 0 },
      { name: "🇳🇿 Nouvelle-Zélande",   stage: "group", wins: 0, draws: 0 },
  ]},
  { name: "Titziana", surnom: "", teams: [
      { name: "🇧🇪 Belgique", stage: "group", wins: 0, draws: 0 },
      { name: "🇸🇳 Sénégal",  stage: "group", wins: 0, draws: 0 },
      { name: "🇨🇼 Curaçao",  stage: "group", wins: 0, draws: 0 },
  ]},
  { name: "Jenna",    surnom: "", teams: [
      { name: "🇨🇴 Colombie", stage: "group", wins: 0, draws: 0 },
      { name: "🇮🇷 Iran",     stage: "group", wins: 0, draws: 0 },
      { name: "🇭🇹 Haïti",    stage: "group", wins: 0, draws: 0 },
  ]},
  { name: "Nicolas",  surnom: "", teams: [
      { name: "🇭🇷 Croatie",     stage: "group", wins: 0, draws: 0 },
      { name: "🇪🇬 Égypte",      stage: "group", wins: 0, draws: 0 },
      { name: "🇺🇿 Ouzbékistan", stage: "group", wins: 0, draws: 0 },
  ]},
  { name: "Quentin",  surnom: "", teams: [
      { name: "🇳🇴 Norvège", stage: "group", wins: 0, draws: 0 },
      { name: "🇩🇿 Algérie", stage: "group", wins: 0, draws: 0 },
      { name: "🇹🇷 Turquie", stage: "group", wins: 0, draws: 0 },
  ]},
  { name: "Marine",   surnom: "", teams: [
      { name: "🇨🇦 Canada",          stage: "group", wins: 0, draws: 0 },
      { name: "🇸🇦 Arabie saoudite", stage: "group", wins: 0, draws: 0 },
      { name: "🇨🇬 Congo",           stage: "group", wins: 0, draws: 0 },
  ]},
  { name: "Amele",    surnom: "", teams: [
      { name: "🇺🇸 États-Unis", stage: "group", wins: 0, draws: 0 },
      { name: "🇵🇾 Paraguay",   stage: "group", wins: 0, draws: 0 },
      { name: "🇨🇻 Cap-Vert",   stage: "group", wins: 0, draws: 0 },
  ]},
  { name: "David",    surnom: "", teams: [
      { name: "🇲🇽 Mexique",  stage: "group", wins: 0, draws: 0 },
      { name: "🇦🇹 Autriche", stage: "group", wins: 0, draws: 0 },
      { name: "🏴󠁧󠁢󠁳󠁣󠁴󠁿 Écosse",   stage: "group", wins: 0, draws: 0 },
  ]},
  { name: "Sandra",   surnom: "", teams: [
      { name: "🇦🇷 Argentine",     stage: "group", wins: 0, draws: 0 },
      { name: "🇰🇷 Corée du Sud",  stage: "group", wins: 0, draws: 0 },
      { name: "🇸🇪 Suède",         stage: "group", wins: 0, draws: 0 },
  ]},
  { name: "Julien",   surnom: "", teams: [
      { name: "🇺🇾 Uruguay",            stage: "group", wins: 0, draws: 0 },
      { name: "🇿🇦 Afrique du Sud",     stage: "group", wins: 0, draws: 0 },
      { name: "🇨🇿 République tchèque", stage: "group", wins: 0, draws: 0 },
  ]},
];


/* ----------------------------------------------------------------------------
 *  3) DATE DE DERNIÈRE MISE À JOUR (affichée sur la page).
 *     La routine nocturne réécrit cette valeur à chaque passage.
 *     Format libre, par ex. une date ISO. Laisse null pour masquer.
 * --------------------------------------------------------------------------*/
const LAST_UPDATED = "2026-06-12T21:37:29Z";   // ex: "2026-06-13T03:00:00Z"


/* Ne pas toucher : expose les données au reste de l'appli. */
window.QUINELA = { SCORING, BONUS, PARTICIPANTS, LAST_UPDATED };
