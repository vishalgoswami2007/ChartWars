export function eloChanges(players, K = 32) {   // [{ id, elo, value }]
  const out = {};
  for (const a of players) {
    let delta = 0;
    for (const b of players) {
      if (a.id === b.id) continue;
      const expected = 1 / (1 + 10 ** ((b.elo - a.elo) / 400));
      const score = a.value > b.value ? 1 : a.value < b.value ? 0 : 0.5;
      delta += K * (score - expected);
    }
    out[a.id] = Math.round(delta / (players.length - 1));
  }
  return out;
}