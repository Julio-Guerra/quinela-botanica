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
  elim:      0,   // Éliminée en phase de groupes (mathématiquement)
  group:     0,   // Encore en jeu (phase de groupes en cours)
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
      { name: "🇫🇷 France",  stage: "r32", wins: 0, draws: 0 },
      { name: "🇬🇭 Ghana",   stage: "r32", wins: 0, draws: 0 },
      { name: "🇯🇵 Japon",   stage: "r32", wins: 0, draws: 0 },
  ]},
  { name: "Julio",    surnom: "", teams: [
      { name: "🇧🇷 Brésil",  stage: "r32", wins: 0, draws: 0 },
      { name: "🇨🇭 Suisse",  stage: "r32", wins: 0, draws: 0 },
      { name: "🇮🇶 Irak",    stage: "elim",  wins: 0, draws: 0 },
  ]},
  { name: "Élodie",   surnom: "", teams: [
      { name: "🇪🇸 Espagne", stage: "r32", wins: 0, draws: 0 },
      { name: "🇲🇦 Maroc",   stage: "r32", wins: 0, draws: 0 },
      { name: "🇵🇦 Panama",  stage: "elim",  wins: 0, draws: 0 },
  ]},
  { name: "Thomas",   surnom: "", teams: [
      { name: "🇩🇪 Allemagne", stage: "r32", wins: 0, draws: 0 },
      { name: "🇹🇳 Tunisie",   stage: "elim",  wins: 0, draws: 0 },
      { name: "🇯🇴 Jordanie",  stage: "elim",  wins: 0, draws: 0 },
  ]},
  { name: "Zuhey",    surnom: "", teams: [
      { name: "🏴󠁧󠁢󠁥󠁮󠁧󠁿 Angleterre", stage: "r32", wins: 0, draws: 0 },
      { name: "🇪🇨 Équateur",   stage: "r32",   wins: 0, draws: 0 },
      { name: "🇶🇦 Qatar",      stage: "elim",  wins: 0, draws: 0 },
  ]},
  { name: "Elaine",   surnom: "", teams: [
      { name: "🇵🇹 Portugal",       stage: "r32",   wins: 0, draws: 0 },
      { name: "🇨🇮 Côte d'Ivoire",  stage: "r32", wins: 0, draws: 0 },
      { name: "🇧🇦 Bosnie",         stage: "r32",   wins: 0, draws: 0 },
  ]},
  { name: "Momo",     surnom: "", teams: [
      { name: "🇳🇱 Pays-Bas",           stage: "r32", wins: 0, draws: 0 },
      { name: "🇦🇺 Australie",          stage: "r32", wins: 0, draws: 0 },
      { name: "🇳🇿 Nouvelle-Zélande",   stage: "elim",  wins: 0, draws: 0 },
  ]},
  { name: "Titziana", surnom: "", teams: [
      { name: "🇧🇪 Belgique", stage: "r32", wins: 0, draws: 0 },
      { name: "🇸🇳 Sénégal",  stage: "elim",  wins: 0, draws: 0 },
      { name: "🇨🇼 Curaçao",  stage: "elim",  wins: 0, draws: 0 },
  ]},
  { name: "Jenna",    surnom: "", teams: [
      { name: "🇨🇴 Colombie", stage: "r32", wins: 0, draws: 0 },
      { name: "🇮🇷 Iran",     stage: "elim", wins: 0, draws: 0 },
      { name: "🇭🇹 Haïti",    stage: "elim",  wins: 0, draws: 0 },
  ]},
  { name: "Nicolas",  surnom: "", teams: [
      { name: "🇭🇷 Croatie",     stage: "r32",   wins: 0, draws: 0 },
      { name: "🇪🇬 Égypte",      stage: "r32",   wins: 0, draws: 0 },
      { name: "🇺🇿 Ouzbékistan", stage: "elim",  wins: 0, draws: 0 },
  ]},
  { name: "Quentin",  surnom: "", teams: [
      { name: "🇳🇴 Norvège", stage: "r32", wins: 0, draws: 0 },
      { name: "🇩🇿 Algérie", stage: "r32",   wins: 0, draws: 0 },
      { name: "🇹🇷 Turquie", stage: "elim",  wins: 0, draws: 0 },
  ]},
  { name: "Marine",   surnom: "", teams: [
      { name: "🇨🇦 Canada",          stage: "r32", wins: 0, draws: 0 },
      { name: "🇸🇦 Arabie saoudite", stage: "elim",  wins: 0, draws: 0 },
      { name: "🇨🇬 Congo",           stage: "r32",   wins: 0, draws: 0 },
  ]},
  { name: "Amele",    surnom: "", teams: [
      { name: "🇺🇸 États-Unis", stage: "r32", wins: 0, draws: 0 },
      { name: "🇵🇾 Paraguay",   stage: "r32",   wins: 0, draws: 0 },
      { name: "🇨🇻 Cap-Vert",   stage: "r32",   wins: 0, draws: 0 },
  ]},
  { name: "David",    surnom: "", teams: [
      { name: "🇲🇽 Mexique",  stage: "r32", wins: 0, draws: 0 },
      { name: "🇦🇹 Autriche", stage: "r32",   wins: 0, draws: 0 },
      { name: "🏴󠁧󠁢󠁳󠁣󠁴󠁿 Écosse",   stage: "group", wins: 0, draws: 0 },
  ]},
  { name: "Sandra",   surnom: "", teams: [
      { name: "🇦🇷 Argentine",     stage: "r32", wins: 0, draws: 0 },
      { name: "🇰🇷 Corée du Sud",  stage: "group", wins: 0, draws: 0 },
      { name: "🇸🇪 Suède",         stage: "r32",   wins: 0, draws: 0 },
  ]},
  { name: "Julien",   surnom: "", teams: [
      { name: "🇺🇾 Uruguay",            stage: "elim",  wins: 0, draws: 0 },
      { name: "🇿🇦 Afrique du Sud",     stage: "r32",  wins: 0, draws: 0 },
      { name: "🇨🇿 République tchèque", stage: "elim", wins: 0, draws: 0 },
  ]},
];


/* ----------------------------------------------------------------------------
 *  3) DATE DE DERNIÈRE MISE À JOUR (affichée sur la page).
 *     La routine nocturne réécrit cette valeur à chaque passage.
 *     Format libre, par ex. une date ISO. Laisse null pour masquer.
 * --------------------------------------------------------------------------*/
const LAST_UPDATED = "2026-06-28T05:22:00Z";   // ex: "2026-06-13T03:00:00Z"


/* Ne pas toucher : expose les données au reste de l'appli. */
window.QUINELA = { SCORING, BONUS, PARTICIPANTS, LAST_UPDATED };
