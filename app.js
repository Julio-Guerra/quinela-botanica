/* ============================================================================
 *  QUIÑELA — moteur de calcul + rendu. Normalement tu n'as pas à toucher ici.
 * ==========================================================================*/
(function () {
  const { SCORING, BONUS, PARTICIPANTS, LAST_UPDATED } = window.QUINELA;

  // Ordre des tours, du plus tôt au plus loin.
  const STAGE_ORDER = ["group", "r32", "r16", "qf", "sf", "final", "champion"];
  const STAGE_LABEL = {
    group: "Groupes", r32: "32es", r16: "8es",
    qf: "Quarts", sf: "Demies", final: "Finale", champion: "Champion 🏆",
  };

  // Points d'une équipe = barème du tour atteint + bonus victoires/nuls.
  function teamPoints(team) {
    const base = SCORING[team.stage] ?? 0;
    const bonus = (team.wins || 0) * (BONUS.perWin || 0)
                + (team.draws || 0) * (BONUS.perDraw || 0);
    return base + bonus;
  }

  // Calcule le total + détails pour chaque participant, puis trie.
  function computeStandings(participants) {
    const rows = participants.map((p) => {
      const teams = p.teams.map((t) => ({ ...t, points: teamPoints(t) }));
      const total = teams.reduce((s, t) => s + t.points, 0);
      // Meilleur tour atteint par une de ses équipes (pour départager).
      const bestStageIdx = Math.max(...teams.map((t) => STAGE_ORDER.indexOf(t.stage)));
      return { name: p.name, surnom: p.surnom, teams, total, bestStageIdx };
    });

    rows.sort((a, b) =>
      b.total - a.total ||
      b.bestStageIdx - a.bestStageIdx ||
      a.name.localeCompare(b.name)
    );

    // Rang avec ex-aequo (même total = même rang).
    let lastTotal = null, lastRank = 0;
    rows.forEach((r, i) => {
      if (r.total !== lastTotal) { lastRank = i + 1; lastTotal = r.total; }
      r.rank = lastRank;
    });
    return rows;
  }

  /* ---------------------- RENDU ---------------------- */

  function medal(rank) {
    return rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : rank;
  }

  function teamChip(t) {
    const reached = STAGE_ORDER.indexOf(t.stage);
    const cls = reached >= STAGE_ORDER.indexOf("qf") ? "chip-hot"
              : reached >= STAGE_ORDER.indexOf("r32") ? "chip-alive"
              : "chip-out";
    return `<span class="chip ${cls}" title="${STAGE_LABEL[t.stage]} • ${t.points} pts">
              ${escapeHtml(t.name)}
              <span class="chip-stage">${STAGE_LABEL[t.stage]}</span>
            </span>`;
  }

  function renderTable(rows) {
    const tbody = document.getElementById("tbody");
    tbody.innerHTML = rows
      .map((r) => `
        <tr class="${r.rank <= 3 ? "top3 rank-" + r.rank : ""}">
          <td class="c-rank">${medal(r.rank)}</td>
          <td class="c-name">
            <span class="pname">${escapeHtml(r.name)}</span>
            ${r.surnom ? `<span class="psurnom">« ${escapeHtml(r.surnom)} »</span>` : ""}
          </td>
          <td class="c-teams"><div class="chips">${r.teams.map(teamChip).join("")}</div></td>
          <td class="c-pts">${r.total}</td>
        </tr>`)
      .join("");
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  function paint(participants) {
    const rows = computeStandings(participants);
    renderTable(rows);

    const updated = document.getElementById("updated");
    if (LAST_UPDATED) {
      const d = new Date(LAST_UPDATED);
      const txt = isNaN(d) ? LAST_UPDATED : d.toLocaleString("fr-FR");
      updated.textContent = "mise à jour : " + txt;
    } else {
      updated.textContent = "";
    }
  }

  /* ---------------------- DÉMARRAGE ---------------------- */
  paint(PARTICIPANTS);
})();
