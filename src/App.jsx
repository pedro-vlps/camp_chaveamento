import { useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'camp-manager-state-v5';

const INITIAL_STATE = {
  teams: [],
  locked: false,
  matchEvents: {},
  penalties: {},
};

const SLOT_ORDERS = {
  4: [0, 3, 1, 2],
  8: [0, 7, 3, 4, 1, 6, 2, 5],
};

const BRACKETS = {
  4: [
    {
      id: 'U1',
      bracket: 'upper',
      round: 1,
      title: 'Upper Semifinal 1',
      description: 'Seed 1 vs Seed 4',
      slots: [
        { type: 'seed', slot: 1 },
        { type: 'seed', slot: 2 },
      ],
    },
    {
      id: 'U2',
      bracket: 'upper',
      round: 1,
      title: 'Upper Semifinal 2',
      description: 'Seed 2 vs Seed 3',
      slots: [
        { type: 'seed', slot: 3 },
        { type: 'seed', slot: 4 },
      ],
    },
    {
      id: 'U3',
      bracket: 'upper',
      round: 2,
      title: 'Final Upper',
      description: 'Valendo vaga direta na final geral',
      slots: [
        { type: 'winner', matchId: 'U1' },
        { type: 'winner', matchId: 'U2' },
      ],
    },
    {
      id: 'L1',
      bracket: 'lower',
      round: 1,
      title: 'Semifinal Lower',
      description: 'Perdedores da rodada inicial',
      slots: [
        { type: 'loser', matchId: 'U1' },
        { type: 'loser', matchId: 'U2' },
      ],
    },
    {
      id: 'L2',
      bracket: 'lower',
      round: 2,
      title: 'Final Lower',
      description: 'Ultima vaga para a final geral',
      slots: [
        { type: 'loser', matchId: 'U3' },
        { type: 'winner', matchId: 'L1' },
      ],
    },
    {
      id: 'G1',
      bracket: 'grand',
      round: 1,
      title: 'Final Geral',
      description: 'Upper winner vs Lower winner',
      slots: [
        { type: 'winner', matchId: 'U3' },
        { type: 'winner', matchId: 'L2' },
      ],
    },
  ],
  8: [
    {
      id: 'U1',
      bracket: 'upper',
      round: 1,
      title: 'Upper Quartas 1',
      description: 'Seed 1 vs Seed 8',
      slots: [
        { type: 'seed', slot: 1 },
        { type: 'seed', slot: 2 },
      ],
    },
    {
      id: 'U2',
      bracket: 'upper',
      round: 1,
      title: 'Upper Quartas 2',
      description: 'Seed 4 vs Seed 5',
      slots: [
        { type: 'seed', slot: 3 },
        { type: 'seed', slot: 4 },
      ],
    },
    {
      id: 'U3',
      bracket: 'upper',
      round: 1,
      title: 'Upper Quartas 3',
      description: 'Seed 2 vs Seed 7',
      slots: [
        { type: 'seed', slot: 5 },
        { type: 'seed', slot: 6 },
      ],
    },
    {
      id: 'U4',
      bracket: 'upper',
      round: 1,
      title: 'Upper Quartas 4',
      description: 'Seed 3 vs Seed 6',
      slots: [
        { type: 'seed', slot: 7 },
        { type: 'seed', slot: 8 },
      ],
    },
    {
      id: 'U5',
      bracket: 'upper',
      round: 2,
      title: 'Upper Semifinal 1',
      description: 'Vencedores de U1 e U2',
      slots: [
        { type: 'winner', matchId: 'U1' },
        { type: 'winner', matchId: 'U2' },
      ],
    },
    {
      id: 'U6',
      bracket: 'upper',
      round: 2,
      title: 'Upper Semifinal 2',
      description: 'Vencedores de U3 e U4',
      slots: [
        { type: 'winner', matchId: 'U3' },
        { type: 'winner', matchId: 'U4' },
      ],
    },
    {
      id: 'U7',
      bracket: 'upper',
      round: 3,
      title: 'Final Upper',
      description: 'Vaga direta na final geral',
      slots: [
        { type: 'winner', matchId: 'U5' },
        { type: 'winner', matchId: 'U6' },
      ],
    },
    {
      id: 'L1',
      bracket: 'lower',
      round: 1,
      title: 'Lower Rodada 1A',
      description: 'Perdedores de U1 e U2',
      slots: [
        { type: 'loser', matchId: 'U1' },
        { type: 'loser', matchId: 'U2' },
      ],
    },
    {
      id: 'L2',
      bracket: 'lower',
      round: 1,
      title: 'Lower Rodada 1B',
      description: 'Perdedores de U3 e U4',
      slots: [
        { type: 'loser', matchId: 'U3' },
        { type: 'loser', matchId: 'U4' },
      ],
    },
    {
      id: 'L3',
      bracket: 'lower',
      round: 2,
      title: 'Lower Rodada 2A',
      description: 'Perdedor de U5 vs vencedor de L1',
      slots: [
        { type: 'loser', matchId: 'U5' },
        { type: 'winner', matchId: 'L1' },
      ],
    },
    {
      id: 'L4',
      bracket: 'lower',
      round: 2,
      title: 'Lower Rodada 2B',
      description: 'Perdedor de U6 vs vencedor de L2',
      slots: [
        { type: 'loser', matchId: 'U6' },
        { type: 'winner', matchId: 'L2' },
      ],
    },
    {
      id: 'L5',
      bracket: 'lower',
      round: 3,
      title: 'Semifinal Lower',
      description: 'Vencedores de L3 e L4',
      slots: [
        { type: 'winner', matchId: 'L3' },
        { type: 'winner', matchId: 'L4' },
      ],
    },
    {
      id: 'L6',
      bracket: 'lower',
      round: 4,
      title: 'Final Lower',
      description: 'Perdedor de U7 vs vencedor de L5',
      slots: [
        { type: 'loser', matchId: 'U7' },
        { type: 'winner', matchId: 'L5' },
      ],
    },
    {
      id: 'G1',
      bracket: 'grand',
      round: 1,
      title: 'Final Geral',
      description: 'Upper winner vs Lower winner',
      slots: [
        { type: 'winner', matchId: 'U7' },
        { type: 'winner', matchId: 'L6' },
      ],
    },
  ],
};

const ROUND_TITLES = {
  4: {
    upper: {
      1: 'Upper Bracket: Semifinais',
      2: 'Upper Bracket: Final',
    },
    lower: {
      1: 'Lower Bracket: Semifinal',
      2: 'Lower Bracket: Final',
    },
    grand: {
      1: 'Final do Campeonato',
    },
  },
  8: {
    upper: {
      1: 'Upper Bracket: Quartas',
      2: 'Upper Bracket: Semifinais',
      3: 'Upper Bracket: Final',
    },
    lower: {
      1: 'Lower Bracket: Rodada 1',
      2: 'Lower Bracket: Rodada 2',
      3: 'Lower Bracket: Semifinal',
      4: 'Lower Bracket: Final',
    },
    grand: {
      1: 'Final do Campeonato',
    },
  },
};

const EVENT_OPTIONS = [
  { value: 'goal', label: 'Gol' },
  { value: 'yellow', label: 'Cartao amarelo' },
  { value: 'red', label: 'Cartao vermelho' },
];

function createId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

function createEventEntry() {
  return {
    id: createId('event'),
    type: 'goal',
    playerId: '',
    assistPlayerId: '',
    ownGoal: false,
  };
}

function normalizePlayers(players) {
  if (!Array.isArray(players)) {
    return [];
  }

  return players
    .map((player) => {
      if (typeof player === 'string') {
        const name = player.trim();
        return name ? { id: createId('player'), name } : null;
      }

      if (!player || typeof player !== 'object') {
        return null;
      }

      const name = typeof player.name === 'string' ? player.name.trim() : '';
      if (!name) {
        return null;
      }

      return {
        id: typeof player.id === 'string' ? player.id : createId('player'),
        name,
      };
    })
    .filter(Boolean);
}

function normalizeTeams(teams) {
  if (!Array.isArray(teams)) {
    return [];
  }

  return teams
    .map((team) => {
      if (typeof team === 'string') {
        const name = team.trim();
        return name
          ? {
              id: createId('team'),
              name,
              players: [],
            }
          : null;
      }

      if (!team || typeof team !== 'object') {
        return null;
      }

      const name = typeof team.name === 'string' ? team.name.trim() : '';
      if (!name) {
        return null;
      }

      return {
        id: typeof team.id === 'string' ? team.id : createId('team'),
        name,
        players: normalizePlayers(team.players),
      };
    })
    .filter(Boolean);
}

function normalizeEventRows(rows) {
  if (!Array.isArray(rows)) {
    return [];
  }

  return rows.map((row) => ({
    id: typeof row?.id === 'string' ? row.id : createId('event'),
    type: row?.type === 'yellow' || row?.type === 'red' ? row.type : 'goal',
    playerId: typeof row?.playerId === 'string' ? row.playerId : '',
    assistPlayerId: typeof row?.assistPlayerId === 'string' ? row.assistPlayerId : '',
    ownGoal: Boolean(row?.ownGoal),
  }));
}

function normalizeMatchEvents(matchEvents) {
  if (!matchEvents || typeof matchEvents !== 'object') {
    return {};
  }

  return Object.fromEntries(
    Object.entries(matchEvents).map(([matchId, sides]) => [
      matchId,
      {
        A: normalizeEventRows(sides?.A),
        B: normalizeEventRows(sides?.B),
      },
    ]),
  );
}

function normalizePenaltyScore(value) {
  if (value === '') {
    return '';
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : '';
}

function normalizePenalties(penalties) {
  if (!penalties || typeof penalties !== 'object') {
    return {};
  }

  return Object.fromEntries(
    Object.entries(penalties).map(([matchId, score]) => [
      matchId,
      {
        A: normalizePenaltyScore(score?.A),
        B: normalizePenaltyScore(score?.B),
      },
    ]),
  );
}

function loadState() {
  if (typeof window === 'undefined') {
    return INITIAL_STATE;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return INITIAL_STATE;
    }

    const parsed = JSON.parse(raw);

    return {
      teams: normalizeTeams(parsed.teams),
      locked: Boolean(parsed.locked),
      matchEvents: normalizeMatchEvents(parsed.matchEvents),
      penalties: normalizePenalties(parsed.penalties),
    };
  } catch {
    return INITIAL_STATE;
  }
}

function createSeededTeams(teams, bracketSize) {
  return SLOT_ORDERS[bracketSize].map((teamIndex) => teams[teamIndex] ?? null);
}

function createDependencyMap(matches) {
  const direct = new Map(matches.map((match) => [match.id, []]));

  matches.forEach((match) => {
    match.slots.forEach((slot) => {
      if (slot.matchId) {
        direct.get(slot.matchId)?.push(match.id);
      }
    });
  });

  const memo = new Map();

  function collect(matchId) {
    if (memo.has(matchId)) {
      return memo.get(matchId);
    }

    const nextMatches = direct.get(matchId) ?? [];
    const descendants = new Set(nextMatches);

    nextMatches.forEach((nextMatchId) => {
      collect(nextMatchId).forEach((nestedId) => descendants.add(nestedId));
    });

    memo.set(matchId, descendants);
    return descendants;
  }

  return new Map(matches.map((match) => [match.id, collect(match.id)]));
}

function resolveMatches(template, seededTeams, matchEvents, penalties) {
  const matchMap = new Map(template.map((match) => [match.id, match]));
  const cache = new Map();

  function resolveSource(source) {
    if (source.type === 'seed') {
      return {
        ready: true,
        team: seededTeams[source.slot - 1] ?? null,
      };
    }

    const upstream = resolveMatch(source.matchId);
    return {
      ready: upstream.resolved,
      team: source.type === 'winner' ? upstream.winner : upstream.loser,
    };
  }

  function resolveMatch(matchId) {
    if (cache.has(matchId)) {
      return cache.get(matchId);
    }

    const match = matchMap.get(matchId);
    const left = resolveSource(match.slots[0]);
    const right = resolveSource(match.slots[1]);
    const leftTeam = left.team;
    const rightTeam = right.team;
    const ready = left.ready && right.ready;
    const hasLeft = Boolean(leftTeam);
    const hasRight = Boolean(rightTeam);
    const score = calculateMatchScore(matchId, matchEvents);
    const penaltyScore = penalties[matchId] ?? { A: '', B: '' };

    let winner = null;
    let loser = null;
    let resolution = 'pending';

    if (ready && hasLeft && hasRight) {
      if (score.A > score.B) {
        winner = leftTeam;
        loser = rightTeam;
        resolution = 'score';
      } else if (score.B > score.A) {
        winner = rightTeam;
        loser = leftTeam;
        resolution = 'score';
      } else if (penaltyScore.A !== '' && penaltyScore.B !== '' && penaltyScore.A > penaltyScore.B) {
        winner = leftTeam;
        loser = rightTeam;
        resolution = 'penalties';
      } else if (penaltyScore.A !== '' && penaltyScore.B !== '' && penaltyScore.B > penaltyScore.A) {
        winner = rightTeam;
        loser = leftTeam;
        resolution = 'penalties';
      } else {
        resolution = 'tied';
      }
    } else if (ready && hasLeft !== hasRight) {
      winner = hasLeft ? leftTeam : rightTeam;
      loser = hasLeft ? rightTeam : leftTeam;
      resolution = 'bye';
    } else if (ready && !hasLeft && !hasRight) {
      resolution = 'empty';
    }

    const resolved = Boolean(winner) || resolution === 'empty';

    const data = {
      ...match,
      participantA: leftTeam,
      participantB: rightTeam,
      ready,
      winner,
      loser,
      resolved,
      resolution,
      score,
      penaltyScore,
      canEditPenalties: ready && hasLeft && hasRight && score.A === score.B,
    };

    cache.set(matchId, data);
    return data;
  }

  return template.map((match) => resolveMatch(match.id));
}

function groupMatches(matches, bracketSize, bracket) {
  const grouped = new Map();

  matches
    .filter((match) => match.bracket === bracket)
    .forEach((match) => {
      if (!grouped.has(match.round)) {
        grouped.set(match.round, []);
      }
      grouped.get(match.round).push(match);
    });

  return Array.from(grouped.entries()).map(([round, roundMatches]) => ({
    round,
    title: ROUND_TITLES[bracketSize][bracket][round],
    matches: roundMatches,
  }));
}

function getEventRows(matchEvents, matchId, side) {
  return matchEvents[matchId]?.[side] ?? [];
}

function getTeamName(team) {
  return team?.name ?? 'A definir';
}

function getPlayersById(team) {
  return new Map((team?.players ?? []).map((player) => [player.id, player]));
}

function calculateSideScore(rows, opponentRows) {
  const directGoals = rows.filter((event) => event.type === 'goal' && !event.ownGoal).length;
  const opponentOwnGoals = opponentRows.filter(
    (event) => event.type === 'goal' && event.ownGoal,
  ).length;

  return directGoals + opponentOwnGoals;
}

function calculateMatchScore(matchId, matchEvents) {
  const rowsA = getEventRows(matchEvents, matchId, 'A');
  const rowsB = getEventRows(matchEvents, matchId, 'B');

  return {
    A: calculateSideScore(rowsA, rowsB),
    B: calculateSideScore(rowsB, rowsA),
  };
}

function clearDescendantData(current, dependencyMap, matchId) {
  const nextMatchEvents = { ...current.matchEvents };
  const nextPenalties = { ...current.penalties };
  const descendants = dependencyMap.get(matchId) ?? new Set();

  descendants.forEach((dependentId) => {
    delete nextMatchEvents[dependentId];
    delete nextPenalties[dependentId];
  });

  return {
    nextMatchEvents,
    nextPenalties,
  };
}

function createRankingList(map, sortFn) {
  return Array.from(map.values())
    .map((entry) => ({
      ...entry,
      matches: entry.matchIds.size,
    }))
    .sort(sortFn);
}

function createRankings(matches, matchEvents) {
  const goalsMap = new Map();
  const assistsMap = new Map();
  const cardsMap = new Map();

  matches.forEach((match) => {
    [
      ['A', match.participantA],
      ['B', match.participantB],
    ].forEach(([side, team]) => {
      if (!team) {
        return;
      }

      const playersById = getPlayersById(team);

      getEventRows(matchEvents, match.id, side).forEach((event) => {
        const player = playersById.get(event.playerId);

        if (event.type === 'goal') {
          if (!event.ownGoal && player) {
            const goalKey = `${player.id}::${team.id}`;
            const goalEntry = goalsMap.get(goalKey) ?? {
              name: player.name,
              team: team.name,
              total: 0,
              matchIds: new Set(),
            };

            goalEntry.total += 1;
            goalEntry.matchIds.add(match.id);
            goalsMap.set(goalKey, goalEntry);
          }

          if (!event.ownGoal && event.assistPlayerId) {
            const assistPlayer = playersById.get(event.assistPlayerId);
            if (!assistPlayer) {
              return;
            }

            const assistKey = `${assistPlayer.id}::${team.id}`;
            const assistEntry = assistsMap.get(assistKey) ?? {
              name: assistPlayer.name,
              team: team.name,
              total: 0,
              matchIds: new Set(),
            };

            assistEntry.total += 1;
            assistEntry.matchIds.add(match.id);
            assistsMap.set(assistKey, assistEntry);
          }
        }

        if ((event.type === 'yellow' || event.type === 'red') && player) {
          const cardKey = `${player.id}::${team.id}`;
          const cardEntry = cardsMap.get(cardKey) ?? {
            name: player.name,
            team: team.name,
            yellow: 0,
            red: 0,
            matchIds: new Set(),
          };

          if (event.type === 'yellow') {
            cardEntry.yellow += 1;
          } else {
            cardEntry.red += 1;
          }

          cardEntry.matchIds.add(match.id);
          cardsMap.set(cardKey, cardEntry);
        }
      });
    });
  });

  return {
    goals: createRankingList(goalsMap, (left, right) => {
      if (right.total !== left.total) {
        return right.total - left.total;
      }
      return left.name.localeCompare(right.name, 'pt-BR');
    }),
    assists: createRankingList(assistsMap, (left, right) => {
      if (right.total !== left.total) {
        return right.total - left.total;
      }
      return left.name.localeCompare(right.name, 'pt-BR');
    }),
    cards: createRankingList(cardsMap, (left, right) => {
      if (right.red !== left.red) {
        return right.red - left.red;
      }
      if (right.yellow !== left.yellow) {
        return right.yellow - left.yellow;
      }
      return left.name.localeCompare(right.name, 'pt-BR');
    }),
  };
}

function TeamSetupCard({
  team,
  draftPlayerName,
  onDraftChange,
  onAddPlayer,
  onRemovePlayer,
  onRemoveTeam,
}) {
  return (
    <article className="team-setup-card">
      <div className="team-setup-card__header">
        <div>
          <p className="eyebrow">Time</p>
          <h3>{team.name}</h3>
        </div>
        <button type="button" className="ghost-button ghost-button--small" onClick={() => onRemoveTeam(team.id)}>
          remover time
        </button>
      </div>

      <form
        className="team-setup-card__form"
        onSubmit={(event) => {
          event.preventDefault();
          onAddPlayer(team.id);
        }}
      >
        <label className="field">
          <span>Jogador do elenco</span>
          <input
            type="text"
            value={draftPlayerName}
            placeholder="Ex.: Carlos"
            onChange={(event) => onDraftChange(team.id, event.target.value)}
          />
        </label>

        <button type="submit" className="primary-button" disabled={!draftPlayerName.trim()}>
          Adicionar jogador
        </button>
      </form>

      <div className="roster-list">
        {team.players.length === 0 ? (
          <p className="empty-state">Cadastre pelo menos um jogador neste time.</p>
        ) : (
          team.players.map((player) => (
            <div key={player.id} className="player-chip">
              <strong>{player.name}</strong>
              <button type="button" onClick={() => onRemovePlayer(team.id, player.id)}>
                remover
              </button>
            </div>
          ))
        )}
      </div>
    </article>
  );
}

function EventEditor({
  team,
  rows,
  disabled,
  onAddEvent,
  onRemoveEvent,
  onUpdateEvent,
}) {
  const players = team?.players ?? [];

  return (
    <section className="event-editor">
      <div className="event-editor__header">
        <div>
          <h5>{getTeamName(team)}</h5>
          <p>Cadastre os eventos deste time nesta partida.</p>
        </div>
        <button
          type="button"
          className="ghost-button ghost-button--small"
          disabled={disabled}
          onClick={onAddEvent}
        >
          Adicionar evento
        </button>
      </div>

      {rows.length === 0 ? (
        <p className="event-editor__empty">Nenhum evento cadastrado.</p>
      ) : (
        <div className="event-editor__list">
          {rows.map((event) => (
            <div key={event.id} className="event-row">
              <div className="event-row__top">
                <label className="field">
                  <span>Tipo</span>
                  <select
                    value={event.type}
                    disabled={disabled}
                    onChange={(changeEvent) =>
                      onUpdateEvent(event.id, 'type', changeEvent.target.value)
                    }
                  >
                    {EVENT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="field">
                  <span>Jogador</span>
                  <select
                    value={event.playerId}
                    disabled={disabled}
                    onChange={(changeEvent) =>
                      onUpdateEvent(event.id, 'playerId', changeEvent.target.value)
                    }
                  >
                    <option value="">Selecione um jogador</option>
                    {players.map((player) => (
                      <option key={player.id} value={player.id}>
                        {player.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              {event.type === 'goal' && (
                <div className="event-row__goal">
                  <label className="field">
                    <span>Assistencia</span>
                    <select
                      value={event.assistPlayerId}
                      disabled={disabled || event.ownGoal}
                      onChange={(changeEvent) =>
                        onUpdateEvent(event.id, 'assistPlayerId', changeEvent.target.value)
                      }
                    >
                      <option value="">Sem assistencia</option>
                      {players
                        .filter((player) => player.id !== event.playerId)
                        .map((player) => (
                        <option key={player.id} value={player.id}>
                          {player.name}
                        </option>
                        ))}
                    </select>
                  </label>

                  <label className="checkbox-field">
                    <input
                      type="checkbox"
                      checked={event.ownGoal}
                      disabled={disabled}
                      onChange={(changeEvent) =>
                        onUpdateEvent(event.id, 'ownGoal', changeEvent.target.checked)
                      }
                    />
                    <span>Gol contra</span>
                  </label>
                </div>
              )}

              <button
                type="button"
                className="event-row__remove"
                disabled={disabled}
                onClick={() => onRemoveEvent(event.id)}
              >
                remover
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function MatchCard({
  match,
  matchEvents,
  onAddEvent,
  onRemoveEvent,
  onUpdateEvent,
  onUpdatePenalties,
}) {
  const waitingMessage = !match.ready
    ? 'Aguardando definicao das partidas anteriores.'
    : match.resolution === 'bye'
      ? 'Avanco automatico por ausencia de adversario.'
      : match.resolution === 'empty'
        ? 'Rodada sem confronto por falta de times nesta chave.'
        : match.resolution === 'tied'
          ? 'Placar empatado. Registre a disputa por penaltis para definir quem avanca.'
          : match.resolution === 'penalties'
            ? 'Classificacao definida nos penaltis.'
            : 'Classificacao automatica pelo placar do jogo.';

  return (
    <article className="match-card">
      <div className="match-card__header">
        <div>
          <p className="match-card__eyebrow">{match.id}</p>
          <h4>{match.title}</h4>
        </div>
        <span className={`match-card__badge match-card__badge--${match.resolution}`}>
          {match.resolution === 'score' && 'Definido no tempo normal'}
          {match.resolution === 'penalties' && 'Definido nos penaltis'}
          {match.resolution === 'bye' && 'Bye'}
          {match.resolution === 'tied' && 'Empatado'}
          {match.resolution === 'pending' && 'Em aberto'}
          {match.resolution === 'empty' && 'Sem duelo'}
        </span>
      </div>

      <p className="match-card__description">{match.description}</p>

      <div className="match-score">
        <span className="match-score__team">{getTeamName(match.participantA)}</span>
        <strong>
          {match.score.A} x {match.score.B}
        </strong>
        <span className="match-score__team">{getTeamName(match.participantB)}</span>
      </div>

      <div className="match-card__teams match-card__teams--static">
        {[
          ['A', match.participantA, match.score.A],
          ['B', match.participantB, match.score.B],
        ].map(([side, team, teamScore]) => {
          const isWinner = match.winner === team && Boolean(team);
          const isLoser = match.loser === team && Boolean(team);

          return (
            <div
              key={side}
              className={[
                'team-option',
                isWinner ? 'team-option--winner' : '',
                isLoser ? 'team-option--loser' : '',
                !team ? 'team-option--empty' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <span className="team-option__side">{side}</span>
              <span className="team-option__name">{getTeamName(team)}</span>
              <span className="team-option__score">{teamScore}</span>
            </div>
          );
        })}
      </div>

      {match.canEditPenalties && (
        <div className="penalty-box">
          <div className="penalty-box__header">
            <h5>Disputa por penaltis</h5>
            <p>Use apenas quando o placar estiver empatado.</p>
          </div>

          <div className="penalty-box__fields">
            <label className="field">
              <span>{getTeamName(match.participantA)}</span>
              <input
                type="number"
                min="0"
                value={match.penaltyScore.A}
                onChange={(event) => onUpdatePenalties(match.id, 'A', event.target.value)}
              />
            </label>

            <label className="field">
              <span>{getTeamName(match.participantB)}</span>
              <input
                type="number"
                min="0"
                value={match.penaltyScore.B}
                onChange={(event) => onUpdatePenalties(match.id, 'B', event.target.value)}
              />
            </label>
          </div>
        </div>
      )}

      <div className="match-card__stats">
        <EventEditor
          team={match.participantA}
          rows={getEventRows(matchEvents, match.id, 'A')}
          disabled={!match.participantA}
          onAddEvent={() => onAddEvent(match.id, 'A')}
          onRemoveEvent={(eventId) => onRemoveEvent(match.id, 'A', eventId)}
          onUpdateEvent={(eventId, field, value) =>
            onUpdateEvent(match.id, 'A', eventId, field, value)
          }
        />

        <EventEditor
          team={match.participantB}
          rows={getEventRows(matchEvents, match.id, 'B')}
          disabled={!match.participantB}
          onAddEvent={() => onAddEvent(match.id, 'B')}
          onRemoveEvent={(eventId) => onRemoveEvent(match.id, 'B', eventId)}
          onUpdateEvent={(eventId, field, value) =>
            onUpdateEvent(match.id, 'B', eventId, field, value)
          }
        />
      </div>

      <p className="match-card__footer">{waitingMessage}</p>
    </article>
  );
}

function RankingBlock({ title, subtitle, items, renderMetrics }) {
  return (
    <section className="ranking-block">
      <div className="ranking-block__header">
        <h3>{title}</h3>
        <p>{subtitle}</p>
      </div>

      {items.length === 0 ? (
        <p className="empty-state">Ainda nao ha dados suficientes para este ranking.</p>
      ) : (
        <div className="ranking-list">
          {items.map((item, index) => (
            <article
              key={`${title}-${item.team}-${item.name}`}
              className={`ranking-card ${index === 0 ? 'ranking-card--leader' : ''}`}
            >
              <div className="ranking-card__top">
                <div>
                  <span className="ranking-card__position">#{index + 1}</span>
                  <h3>{item.name}</h3>
                  <p>{item.team}</p>
                </div>
                {renderMetrics(item, true)}
              </div>

              <div className="ranking-card__stats">{renderMetrics(item, false)}</div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default function App() {
  const [teamName, setTeamName] = useState('');
  const [playerDrafts, setPlayerDrafts] = useState({});
  const [state, setState] = useState(loadState);

  const bracketSize = state.locked ? (state.teams.length <= 4 ? 4 : 8) : null;

  const template = useMemo(() => {
    if (!bracketSize) {
      return [];
    }

    return BRACKETS[bracketSize];
  }, [bracketSize]);

  const dependencyMap = useMemo(() => createDependencyMap(template), [template]);
  const seededTeams = useMemo(
    () => (bracketSize ? createSeededTeams(state.teams, bracketSize) : []),
    [bracketSize, state.teams],
  );
  const resolvedMatches = useMemo(
    () => resolveMatches(template, seededTeams, state.matchEvents, state.penalties),
    [template, seededTeams, state.matchEvents, state.penalties],
  );

  const upperRounds = useMemo(
    () => (bracketSize ? groupMatches(resolvedMatches, bracketSize, 'upper') : []),
    [bracketSize, resolvedMatches],
  );
  const lowerRounds = useMemo(
    () => (bracketSize ? groupMatches(resolvedMatches, bracketSize, 'lower') : []),
    [bracketSize, resolvedMatches],
  );
  const grandRounds = useMemo(
    () => (bracketSize ? groupMatches(resolvedMatches, bracketSize, 'grand') : []),
    [bracketSize, resolvedMatches],
  );
  const rankings = useMemo(
    () => createRankings(resolvedMatches, state.matchEvents),
    [resolvedMatches, state.matchEvents],
  );

  const completedMatches = resolvedMatches.filter(
    (match) => match.resolution === 'score' || match.resolution === 'penalties',
  ).length;
  const champion = resolvedMatches.find((match) => match.id === 'G1')?.winner?.name ?? null;
  const totalPlayers = state.teams.reduce((sum, team) => sum + team.players.length, 0);
  const totalEvents = Object.values(state.matchEvents).reduce(
    (sum, sides) => sum + (sides.A?.length ?? 0) + (sides.B?.length ?? 0),
    0,
  );
  const canStart =
    state.teams.length >= 4 &&
    state.teams.length <= 8 &&
    state.teams.every((team) => team.players.length > 0);
  const hasByes = state.locked && state.teams.length !== bracketSize;

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  function addTeam(event) {
    event.preventDefault();
    const normalizedName = teamName.trim();

    if (!normalizedName || state.teams.length >= 8) {
      return;
    }

    if (state.teams.some((team) => team.name.toLowerCase() === normalizedName.toLowerCase())) {
      return;
    }

    setState((current) => ({
      ...current,
      teams: [
        ...current.teams,
        {
          id: createId('team'),
          name: normalizedName,
          players: [],
        },
      ],
    }));
    setTeamName('');
  }

  function removeTeam(teamId) {
    setState((current) => ({
      ...current,
      teams: current.teams.filter((team) => team.id !== teamId),
    }));

    setPlayerDrafts((current) => {
      const next = { ...current };
      delete next[teamId];
      return next;
    });
  }

  function updatePlayerDraft(teamId, value) {
    setPlayerDrafts((current) => ({
      ...current,
      [teamId]: value,
    }));
  }

  function addPlayerToTeam(teamId) {
    const playerName = (playerDrafts[teamId] ?? '').trim();
    if (!playerName) {
      return;
    }

    setState((current) => ({
      ...current,
      teams: current.teams.map((team) => {
        if (team.id !== teamId) {
          return team;
        }

        if (team.players.some((player) => player.name.toLowerCase() === playerName.toLowerCase())) {
          return team;
        }

        return {
          ...team,
          players: [
            ...team.players,
            {
              id: createId('player'),
              name: playerName,
            },
          ],
        };
      }),
    }));

    setPlayerDrafts((current) => ({
      ...current,
      [teamId]: '',
    }));
  }

  function removePlayerFromTeam(teamId, playerId) {
    setState((current) => ({
      ...current,
      teams: current.teams.map((team) => {
        if (team.id !== teamId) {
          return team;
        }

        return {
          ...team,
          players: team.players.filter((player) => player.id !== playerId),
        };
      }),
    }));
  }

  function startTournament() {
    if (!canStart) {
      return;
    }

    setState((current) => ({
      ...current,
      locked: true,
      matchEvents: {},
      penalties: {},
    }));
  }

  function unlockTournament() {
    setState((current) => ({
      ...current,
      locked: false,
      matchEvents: {},
      penalties: {},
    }));
  }

  function resetTournament() {
    setState(INITIAL_STATE);
    setTeamName('');
    setPlayerDrafts({});
  }

  function handleAddEvent(matchId, side) {
    setState((current) => {
      const matchState = current.matchEvents[matchId] ?? { A: [], B: [] };
      const { nextMatchEvents, nextPenalties } = clearDescendantData(current, dependencyMap, matchId);
      delete nextPenalties[matchId];

      return {
        ...current,
        matchEvents: {
          ...nextMatchEvents,
          [matchId]: {
            ...matchState,
            [side]: [...(matchState[side] ?? []), createEventEntry()],
          },
        },
        penalties: nextPenalties,
      };
    });
  }

  function handleRemoveEvent(matchId, side, eventId) {
    setState((current) => {
      const matchState = current.matchEvents[matchId] ?? { A: [], B: [] };
      const { nextMatchEvents, nextPenalties } = clearDescendantData(current, dependencyMap, matchId);
      delete nextPenalties[matchId];

      return {
        ...current,
        matchEvents: {
          ...nextMatchEvents,
          [matchId]: {
            ...matchState,
            [side]: (matchState[side] ?? []).filter((event) => event.id !== eventId),
          },
        },
        penalties: nextPenalties,
      };
    });
  }

  function handleUpdateEvent(matchId, side, eventId, field, value) {
    setState((current) => {
      const matchState = current.matchEvents[matchId] ?? { A: [], B: [] };
      const { nextMatchEvents, nextPenalties } = clearDescendantData(current, dependencyMap, matchId);
      delete nextPenalties[matchId];

      return {
        ...current,
        matchEvents: {
          ...nextMatchEvents,
          [matchId]: {
            ...matchState,
            [side]: (matchState[side] ?? []).map((event) => {
              if (event.id !== eventId) {
                return event;
              }

              const updatedEvent = {
                ...event,
                [field]: value,
              };

              if (field === 'type' && value !== 'goal') {
                updatedEvent.assistPlayerId = '';
                updatedEvent.ownGoal = false;
              }

              if (field === 'ownGoal' && value) {
                updatedEvent.assistPlayerId = '';
              }

              if (field === 'playerId' && updatedEvent.assistPlayerId === value && value) {
                updatedEvent.assistPlayerId = '';
              }

              return updatedEvent;
            }),
          },
        },
        penalties: nextPenalties,
      };
    });
  }

  function handleUpdatePenalties(matchId, side, value) {
    setState((current) => {
      const { nextMatchEvents, nextPenalties } = clearDescendantData(current, dependencyMap, matchId);

      return {
        ...current,
        matchEvents: nextMatchEvents,
        penalties: {
          ...nextPenalties,
          [matchId]: {
            ...(current.penalties[matchId] ?? { A: '', B: '' }),
            [side]: normalizePenaltyScore(value),
          },
        },
      };
    });
  }

  return (
    <div className="app-shell">
      <div className="app-shell__glow app-shell__glow--one" />
      <div className="app-shell__glow app-shell__glow--two" />

      <main className="layout">
        <section className="hero">
          <div className="hero__copy">
            <p className="eyebrow">Camp Manager</p>
            <h1>
              {state.locked
                ? 'Gerenciador de campeonatos com chave upper e lower bracket.'
                : 'Monte os times e seus elencos antes de iniciar o campeonato.'}
            </h1>
            <p className="hero__text">
              {state.locked
                ? 'Cadastre eventos por partida usando os jogadores de cada elenco e acompanhe os rankings automaticamente.'
                : 'Nesta etapa voce cadastra os times e seus jogadores. Depois, na tela do campeonato, os eventos usam dropdown com o elenco de cada time.'}
            </p>
          </div>

          <div className="hero__stats">
            <div className="stat-card">
              <span>Times</span>
              <strong>{state.teams.length}</strong>
            </div>
            <div className="stat-card">
              <span>Jogadores</span>
              <strong>{totalPlayers}</strong>
            </div>
            <div className="stat-card">
              <span>{state.locked ? 'Eventos' : 'Pronto para iniciar'}</span>
              <strong>{state.locked ? totalEvents : canStart ? 'Sim' : 'Nao'}</strong>
            </div>
          </div>
        </section>

        {!state.locked ? (
          <>
            <section className="panel panel--register">
              <div className="panel__heading">
                <div>
                  <p className="eyebrow">Tela de Cadastro</p>
                  <h2>Registrar times e elencos</h2>
                </div>
                <div className="panel__actions">
                  <button type="button" className="ghost-button" onClick={resetTournament}>
                    Limpar tudo
                  </button>
                  <button
                    type="button"
                    className="primary-button"
                    disabled={!canStart}
                    onClick={startTournament}
                  >
                    Ir para o campeonato
                  </button>
                </div>
              </div>

              <form className="register-form" onSubmit={addTeam}>
                <label className="field">
                  <span>Nome do time</span>
                  <input
                    type="text"
                    value={teamName}
                    onChange={(event) => setTeamName(event.target.value)}
                    placeholder="Ex.: Falcoes do Norte"
                    disabled={state.teams.length >= 8}
                  />
                </label>

                <button
                  type="submit"
                  className="primary-button"
                  disabled={!teamName.trim() || state.teams.length >= 8}
                >
                  Adicionar time
                </button>
              </form>

              <div className="helper-grid">
                <p>
                  O campeonato aceita de <strong>4 a 8 times</strong>. A ordem do cadastro
                  define o seed.
                </p>
                <p>
                  Para iniciar, cada time precisa ter <strong>ao menos um jogador</strong>
                  cadastrado.
                </p>
              </div>
            </section>

            <section className="team-setup-grid">
              {state.teams.length === 0 ? (
                <section className="panel">
                  <p className="empty-state">
                    Nenhum time cadastrado ainda. Adicione os times para montar os elencos.
                  </p>
                </section>
              ) : (
                state.teams.map((team) => (
                  <TeamSetupCard
                    key={team.id}
                    team={team}
                    draftPlayerName={playerDrafts[team.id] ?? ''}
                    onDraftChange={updatePlayerDraft}
                    onAddPlayer={addPlayerToTeam}
                    onRemovePlayer={removePlayerFromTeam}
                    onRemoveTeam={removeTeam}
                  />
                ))
              )}
            </section>
          </>
        ) : (
          <>
            <section className="panel panel--summary">
              <div className="panel__heading">
                <div>
                  <p className="eyebrow">Resumo</p>
                  <h2>Campeonato em andamento</h2>
                </div>
                <div className="panel__actions">
                  <button type="button" className="ghost-button" onClick={unlockTournament}>
                    Voltar ao cadastro
                  </button>
                </div>
              </div>

              <div className="summary-grid">
                <div className="summary-card">
                  <span>Formato</span>
                  <strong>Dupla eliminacao</strong>
                  <p>Upper bracket, lower bracket e final geral.</p>
                </div>
                <div className="summary-card">
                  <span>Seeding aplicado</span>
                  <strong>{bracketSize} posicoes</strong>
                  <p>
                    {seededTeams
                      .map((team, index) => `Slot ${index + 1}: ${team?.name ?? 'Bye'}`)
                      .join(' | ')}
                  </p>
                </div>
                <div className="summary-card">
                  <span>Status</span>
                  <strong>{champion ? 'Encerrado' : 'Aberto'}</strong>
                  <p>
                    {hasByes
                      ? 'Existem byes automaticos nesta chave por haver menos times que vagas.'
                      : 'Todos os confrontos dependem apenas dos resultados registrados.'}
                  </p>
                </div>
                <div className="summary-card">
                  <span>Resultados definidos</span>
                  <strong>{completedMatches}</strong>
                  <p>Partidas definidas automaticamente por placar ou penaltis.</p>
                </div>
                <div className="summary-card">
                  <span>Eventos cadastrados</span>
                  <strong>{totalEvents}</strong>
                  <p>Gols, assistencias e cartoes usando os elencos cadastrados.</p>
                </div>
              </div>

              {champion && (
                <div className="champion-banner">
                  <p className="eyebrow">Campeao</p>
                  <h3>{champion}</h3>
                  <p>Venceu a final geral e fechou o campeonato.</p>
                </div>
              )}
            </section>

            <section className="panel panel--ranking">
              <div className="panel__heading">
                <div>
                  <p className="eyebrow">Rankings</p>
                  <h2>Artilharia, assistencias e cartoes</h2>
                </div>
              </div>

              <div className="ranking-grid">
                <RankingBlock
                  title="Gols"
                  subtitle="Conta apenas gols a favor. Gol contra nao entra na artilharia."
                  items={rankings.goals}
                  renderMetrics={(item, compact) =>
                    compact ? (
                      <div className="ranking-card__goals">
                        <span>Gols</span>
                        <strong>{item.total}</strong>
                      </div>
                    ) : (
                      <>
                        <span>Gols: {item.total}</span>
                        <span>Jogos: {item.matches}</span>
                      </>
                    )
                  }
                />

                <RankingBlock
                  title="Assistencias"
                  subtitle="Assistencias contam apenas em gols normais."
                  items={rankings.assists}
                  renderMetrics={(item, compact) =>
                    compact ? (
                      <div className="ranking-card__goals">
                        <span>Assist.</span>
                        <strong>{item.total}</strong>
                      </div>
                    ) : (
                      <>
                        <span>Assistencias: {item.total}</span>
                        <span>Jogos: {item.matches}</span>
                      </>
                    )
                  }
                />

                <RankingBlock
                  title="Cartoes"
                  subtitle="Ordenado por vermelhos e depois amarelos."
                  items={rankings.cards}
                  renderMetrics={(item, compact) =>
                    compact ? (
                      <div className="ranking-card__goals">
                        <span>Cartoes</span>
                        <strong>{item.red + item.yellow}</strong>
                      </div>
                    ) : (
                      <>
                        <span>Vermelhos: {item.red}</span>
                        <span>Amarelos: {item.yellow}</span>
                        <span>Jogos: {item.matches}</span>
                      </>
                    )
                  }
                />
              </div>
            </section>

            <section className="bracket-grid">
              <section className="panel">
                <div className="panel__heading">
                  <div>
                    <p className="eyebrow">Upper</p>
                    <h2>Chave principal</h2>
                  </div>
                </div>

                <div className="round-grid">
                  {upperRounds.map((round) => (
                    <div key={`upper-${round.round}`} className="round-column">
                      <h3>{round.title}</h3>
                      <div className="round-column__list">
                        {round.matches.map((match) => (
                          <MatchCard
                            key={match.id}
                            match={match}
                            matchEvents={state.matchEvents}
                            onAddEvent={handleAddEvent}
                            onRemoveEvent={handleRemoveEvent}
                            onUpdateEvent={handleUpdateEvent}
                            onUpdatePenalties={handleUpdatePenalties}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="panel">
                <div className="panel__heading">
                  <div>
                    <p className="eyebrow">Lower</p>
                    <h2>Repescagem</h2>
                  </div>
                </div>

                <div className="round-grid">
                  {lowerRounds.map((round) => (
                    <div key={`lower-${round.round}`} className="round-column">
                      <h3>{round.title}</h3>
                      <div className="round-column__list">
                        {round.matches.map((match) => (
                          <MatchCard
                            key={match.id}
                            match={match}
                            matchEvents={state.matchEvents}
                            onAddEvent={handleAddEvent}
                            onRemoveEvent={handleRemoveEvent}
                            onUpdateEvent={handleUpdateEvent}
                            onUpdatePenalties={handleUpdatePenalties}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="panel">
                <div className="panel__heading">
                  <div>
                    <p className="eyebrow">Final</p>
                    <h2>Decisao do campeonato</h2>
                  </div>
                </div>

                <div className="round-grid round-grid--final">
                  {grandRounds.map((round) => (
                    <div key={`grand-${round.round}`} className="round-column">
                      <h3>{round.title}</h3>
                      <div className="round-column__list">
                        {round.matches.map((match) => (
                          <MatchCard
                            key={match.id}
                            match={match}
                            matchEvents={state.matchEvents}
                            onAddEvent={handleAddEvent}
                            onRemoveEvent={handleRemoveEvent}
                            onUpdateEvent={handleUpdateEvent}
                            onUpdatePenalties={handleUpdatePenalties}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
