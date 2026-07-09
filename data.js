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
  group:     0,   // Phase de groupes (en cours ou éliminée — voir "eliminated")
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
 *     - "eliminated" : true si l'équipe est sortie au tour "stage" (affichée
 *                      en rouge). Absent/false = encore en lice.
 *     - "wins" / "draws" : optionnel, seulement si tu utilises le BONUS.
 *
 *     👉 Pour mettre à jour : change "stage" (et "eliminated" si sortie) et sauvegarde.
 * --------------------------------------------------------------------------*/
const PARTICIPANTS = [
  { name: "Jess",     surnom: "", teams: [
      { name: "🇫🇷 France",  stage: "qf", wins: 0, draws: 0 },
      { name: "🇬🇭 Ghana",   stage: "r32", wins: 0, draws: 0, eliminated: true },
      { name: "🇯🇵 Japon",   stage: "r32", wins: 0, draws: 0, eliminated: true },
  ]},
  { name: "Julio",    surnom: "", teams: [
      { name: "🇧🇷 Brésil",  stage: "r16", wins: 0, draws: 0, eliminated: true },
      { name: "🇨🇭 Suisse",  stage: "qf", wins: 0, draws: 0 },
      { name: "🇮🇶 Irak",    stage: "group", wins: 0, draws: 0, eliminated: true },
  ]},
  { name: "Élodie",   surnom: "", teams: [
      { name: "🇪🇸 Espagne", stage: "qf", wins: 0, draws: 0 },
      { name: "🇲🇦 Maroc",   stage: "qf", wins: 0, draws: 0 },
      { name: "🇵🇦 Panama",  stage: "group", wins: 0, draws: 0, eliminated: true },
  ]},
  { name: "Thomas",   surnom: "", teams: [
      { name: "🇩🇪 Allemagne", stage: "r32", wins: 0, draws: 0, eliminated: true },
      { name: "🇹🇳 Tunisie",   stage: "group", wins: 0, draws: 0, eliminated: true },
      { name: "🇯🇴 Jordanie",  stage: "group", wins: 0, draws: 0, eliminated: true },
  ]},
  { name: "Zuhey",    surnom: "", teams: [
      { name: "🏴󠁧󠁢󠁥󠁮󠁧󠁿 Angleterre", stage: "qf", wins: 0, draws: 0 },
      { name: "🇪🇨 Équateur",   stage: "r32", wins: 0, draws: 0, eliminated: true },
      { name: "🇶🇦 Qatar",      stage: "group", wins: 0, draws: 0, eliminated: true },
  ]},
  { name: "Elaine",   surnom: "", teams: [
      { name: "🇵🇹 Portugal",       stage: "r16", wins: 0, draws: 0, eliminated: true },
      { name: "🇨🇮 Côte d'Ivoire",  stage: "r32", wins: 0, draws: 0, eliminated: true },
      { name: "🇧🇦 Bosnie",         stage: "r32", wins: 0, draws: 0, eliminated: true },
  ]},
  { name: "Momo",     surnom: "", teams: [
      { name: "🇳🇱 Pays-Bas",           stage: "r32", wins: 0, draws: 0, eliminated: true },
      { name: "🇦🇺 Australie",          stage: "r32", wins: 0, draws: 0, eliminated: true },
      { name: "🇳🇿 Nouvelle-Zélande",   stage: "group", wins: 0, draws: 0, eliminated: true },
  ]},
  { name: "Titziana", surnom: "", teams: [
      { name: "🇧🇪 Belgique", stage: "qf", wins: 0, draws: 0 },
      { name: "🇸🇳 Sénégal",  stage: "r32", wins: 0, draws: 0, eliminated: true },
      { name: "🇨🇼 Curaçao",  stage: "group", wins: 0, draws: 0, eliminated: true },
  ]},
  { name: "Jenna",    surnom: "", teams: [
      { name: "🇨🇴 Colombie", stage: "r16", wins: 0, draws: 0, eliminated: true },
      { name: "🇮🇷 Iran",     stage: "group", wins: 0, draws: 0, eliminated: true },
      { name: "🇭🇹 Haïti",    stage: "group", wins: 0, draws: 0, eliminated: true },
  ]},
  { name: "Nicolas",  surnom: "", teams: [
      { name: "🇭🇷 Croatie",     stage: "r32", wins: 0, draws: 0, eliminated: true },
      { name: "🇪🇬 Égypte",      stage: "r16", wins: 0, draws: 0, eliminated: true },
      { name: "🇺🇿 Ouzbékistan", stage: "group", wins: 0, draws: 0, eliminated: true },
  ]},
  { name: "Quentin",  surnom: "", teams: [
      { name: "🇳🇴 Norvège", stage: "qf", wins: 0, draws: 0 },
      { name: "🇩🇿 Algérie", stage: "r32", wins: 0, draws: 0, eliminated: true },
      { name: "🇹🇷 Turquie", stage: "group", wins: 0, draws: 0, eliminated: true },
  ]},
  { name: "Marine",   surnom: "", teams: [
      { name: "🇨🇦 Canada",          stage: "r16", wins: 0, draws: 0, eliminated: true },
      { name: "🇸🇦 Arabie saoudite", stage: "group", wins: 0, draws: 0, eliminated: true },
      { name: "🇨🇬 Congo",           stage: "r32", wins: 0, draws: 0, eliminated: true },
  ]},
  { name: "Amele",    surnom: "", teams: [
      { name: "🇺🇸 États-Unis", stage: "r16", wins: 0, draws: 0, eliminated: true },
      { name: "🇵🇾 Paraguay",   stage: "r16", wins: 0, draws: 0, eliminated: true },
      { name: "🇨🇻 Cap-Vert",   stage: "r32", wins: 0, draws: 0, eliminated: true },
  ]},
  { name: "David",    surnom: "", teams: [
      { name: "🇲🇽 Mexique",  stage: "r16", wins: 0, draws: 0, eliminated: true },
      { name: "🇦🇹 Autriche", stage: "r32", wins: 0, draws: 0, eliminated: true },
      { name: "🏴󠁧󠁢󠁳󠁣󠁴󠁿 Écosse",   stage: "group", wins: 0, draws: 0, eliminated: true },
  ]},
  { name: "Sandra",   surnom: "", teams: [
      { name: "🇦🇷 Argentine",     stage: "qf", wins: 0, draws: 0 },
      { name: "🇰🇷 Corée du Sud",  stage: "group", wins: 0, draws: 0, eliminated: true },
      { name: "🇸🇪 Suède",         stage: "r32", wins: 0, draws: 0, eliminated: true },
  ]},
  { name: "Julien",   surnom: "", teams: [
      { name: "🇺🇾 Uruguay",            stage: "group", wins: 0, draws: 0, eliminated: true },
      { name: "🇿🇦 Afrique du Sud",     stage: "r32", wins: 0, draws: 0, eliminated: true },
      { name: "🇨🇿 République tchèque", stage: "group", wins: 0, draws: 0, eliminated: true },
  ]},
];


/* ----------------------------------------------------------------------------
 *  3) DATE DE DERNIÈRE MISE À JOUR (affichée sur la page).
 *     La routine nocturne réécrit cette valeur à chaque passage.
 *     Format libre, par ex. une date ISO. Laisse null pour masquer.
 * --------------------------------------------------------------------------*/
const LAST_UPDATED = "2026-07-09T07:25:36Z";   // ex: "2026-06-13T03:00:00Z"


/* Ne pas toucher : expose les données au reste de l'appli. */
window.QUINELA = { SCORING, BONUS, PARTICIPANTS, LAST_UPDATED };
