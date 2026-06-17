import { useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'camp-manager-state-v3';

const INITIAL_STATE = {
  teams: [],
  locked: false,
  results: {},
  matchEvents: {},
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

function createEventEntry() {
  return {
    id: `event-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    type: 'goal',
    playerName: '',
    assistName: '',
    ownGoal: false,
  };
}

function normalizeEventRows(rows) {
  if (!Array.isArray(rows)) {
    return [];
  }

  return rows.map((row) => ({
    id: typeof row?.id === 'string' ? row.id : createEventEntry().id,
    type: row?.type === 'yellow' || row?.type === 'red' ? row.type : 'goal',
    playerName: typeof row?.playerName === 'string' ? row.playerName : '',
    assistName: typeof row?.assistName === 'string' ? row.assistName : '',
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
      teams: Array.isArray(parsed.teams) ? parsed.teams : [],
      locked: Boolean(parsed.locked),
      results: parsed.results && typeof parsed.results === 'object' ? parsed.results : {},
      matchEvents: normalizeMatchEvents(parsed.matchEvents),
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

function resolveMatches(template, seededTeams, manualResults) {
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
    const selected = manualResults[matchId];
    const hasLeft = Boolean(leftTeam);
    const hasRight = Boolean(rightTeam);

    let winner = null;
    let loser = null;
    let resolution = 'pending';

    if (ready && hasLeft && hasRight && selected === 'A') {
      winner = leftTeam;
      loser = rightTeam;
      resolution = 'manual';
    } else if (ready && hasLeft && hasRight && selected === 'B') {
      winner = rightTeam;
      loser = leftTeam;
      resolution = 'manual';
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
      selected,
      winner,
      loser,
      resolved,
      resolution,
      canPickWinner: ready && hasLeft && hasRight,
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
    ['A', 'B'].forEach((side) => {
      const teamName = side === 'A' ? match.participantA : match.participantB;
      if (!teamName) {
        return;
      }

      getEventRows(matchEvents, match.id, side).forEach((event) => {
        const playerName = event.playerName.trim();

        if (event.type === 'goal') {
          if (!event.ownGoal && playerName) {
            const goalKey = `${playerName.toLowerCase()}::${teamName.toLowerCase()}`;
            const goalEntry = goalsMap.get(goalKey) ?? {
              name: playerName,
              team: teamName,
              total: 0,
              matchIds: new Set(),
            };

            goalEntry.total += 1;
            goalEntry.matchIds.add(match.id);
            goalsMap.set(goalKey, goalEntry);
          }

          const assistName = event.ownGoal ? '' : event.assistName.trim();
          if (assistName) {
            const assistKey = `${assistName.toLowerCase()}::${teamName.toLowerCase()}`;
            const assistEntry = assistsMap.get(assistKey) ?? {
              name: assistName,
              team: teamName,
              total: 0,
              matchIds: new Set(),
            };

            assistEntry.total += 1;
            assistEntry.matchIds.add(match.id);
            assistsMap.set(assistKey, assistEntry);
          }
        }

        if ((event.type === 'yellow' || event.type === 'red') && playerName) {
          const cardKey = `${playerName.toLowerCase()}::${teamName.toLowerCase()}`;
          const cardEntry = cardsMap.get(cardKey) ?? {
            name: playerName,
            team: teamName,
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

function EventEditor({ teamName, rows, disabled, onAddEvent, onRemoveEvent, onUpdateEvent }) {
  return (
    <section className="event-editor">
      <div className="event-editor__header">
        <div>
          <h5>{teamName ?? 'A definir'}</h5>
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
                  <input
                    type="text"
                    value={event.playerName}
                    placeholder="Nome do jogador"
                    disabled={disabled}
                    onChange={(changeEvent) =>
                      onUpdateEvent(event.id, 'playerName', changeEvent.target.value)
                    }
                  />
                </label>
              </div>

              {event.type === 'goal' && (
                <div className="event-row__goal">
                  <label className="field">
                    <span>Assistencia</span>
                    <input
                      type="text"
                      value={event.assistName}
                      placeholder="Quem deu a assistencia"
                      disabled={disabled || event.ownGoal}
                      onChange={(changeEvent) =>
                        onUpdateEvent(event.id, 'assistName', changeEvent.target.value)
                      }
                    />
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
  onPickWinner,
}) {
  const score = calculateMatchScore(match.id, matchEvents);

  const waitingMessage = !match.ready
    ? 'Aguardando definicao das partidas anteriores.'
    : !match.canPickWinner && match.resolution === 'bye'
      ? 'Avanco automatico por ausencia de adversario.'
      : !match.canPickWinner && match.resolution === 'empty'
        ? 'Rodada sem confronto por falta de times nesta chave.'
        : 'Escolha o vencedor manualmente. O placar e calculado pelos eventos.';

  return (
    <article className="match-card">
      <div className="match-card__header">
        <div>
          <p className="match-card__eyebrow">{match.id}</p>
          <h4>{match.title}</h4>
        </div>
        <span className={`match-card__badge match-card__badge--${match.resolution}`}>
          {match.resolution === 'manual' && 'Resultado definido'}
          {match.resolution === 'bye' && 'Bye'}
          {match.resolution === 'pending' && 'Em aberto'}
          {match.resolution === 'empty' && 'Sem duelo'}
        </span>
      </div>

      <p className="match-card__description">{match.description}</p>

      <div className="match-score">
        <span className="match-score__team">{match.participantA ?? 'A definir'}</span>
        <strong>
          {score.A} x {score.B}
        </strong>
        <span className="match-score__team">{match.participantB ?? 'A definir'}</span>
      </div>

      <div className="match-card__teams">
        {[
          ['A', match.participantA, score.A],
          ['B', match.participantB, score.B],
        ].map(([side, team, teamScore]) => {
          const isWinner = match.winner === team && Boolean(team);
          const isLoser = match.loser === team && Boolean(team);

          return (
            <button
              key={side}
              type="button"
              className={[
                'team-option',
                isWinner ? 'team-option--winner' : '',
                isLoser ? 'team-option--loser' : '',
                !team ? 'team-option--empty' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              disabled={!match.canPickWinner || !team}
              onClick={() => onPickWinner(match.id, side)}
            >
              <span className="team-option__side">{side}</span>
              <span className="team-option__name">{team ?? 'A definir'}</span>
              <span className="team-option__score">{teamScore}</span>
            </button>
          );
        })}
      </div>

      <div className="match-card__stats">
        <EventEditor
          teamName={match.participantA}
          rows={getEventRows(matchEvents, match.id, 'A')}
          disabled={!match.participantA}
          onAddEvent={() => onAddEvent(match.id, 'A')}
          onRemoveEvent={(eventId) => onRemoveEvent(match.id, 'A', eventId)}
          onUpdateEvent={(eventId, field, value) => onUpdateEvent(match.id, 'A', eventId, field, value)}
        />

        <EventEditor
          teamName={match.participantB}
          rows={getEventRows(matchEvents, match.id, 'B')}
          disabled={!match.participantB}
          onAddEvent={() => onAddEvent(match.id, 'B')}
          onRemoveEvent={(eventId) => onRemoveEvent(match.id, 'B', eventId)}
          onUpdateEvent={(eventId, field, value) => onUpdateEvent(match.id, 'B', eventId, field, value)}
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
    () => resolveMatches(template, seededTeams, state.results),
    [template, seededTeams, state.results],
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

  const completedMatches = resolvedMatches.filter((match) => match.resolution === 'manual').length;
  const champion = resolvedMatches.find((match) => match.id === 'G1')?.winner ?? null;
  const canStart = state.teams.length >= 4;
  const hasByes = state.locked && state.teams.length !== bracketSize;
  const totalEvents = Object.values(state.matchEvents).reduce(
    (sum, sides) => sum + (sides.A?.length ?? 0) + (sides.B?.length ?? 0),
    0,
  );

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  function addTeam(event) {
    event.preventDefault();
    const normalizedName = teamName.trim();

    if (!normalizedName || state.teams.length >= 8) {
      return;
    }

    if (state.teams.some((team) => team.toLowerCase() === normalizedName.toLowerCase())) {
      return;
    }

    setState((current) => ({
      ...current,
      teams: [...current.teams, normalizedName],
    }));
    setTeamName('');
  }

  function removeTeam(teamToRemove) {
    setState((current) => ({
      ...current,
      teams: current.teams.filter((team) => team !== teamToRemove),
    }));
  }

  function startTournament() {
    if (!canStart) {
      return;
    }

    setState((current) => ({
      ...current,
      locked: true,
      results: {},
      matchEvents: {},
    }));
  }

  function unlockTournament() {
    setState((current) => ({
      ...current,
      locked: false,
      results: {},
      matchEvents: {},
    }));
  }

  function resetTournament() {
    setState(INITIAL_STATE);
    setTeamName('');
  }

  function handlePickWinner(matchId, side) {
    setState((current) => {
      const nextResults = { ...current.results };
      const nextMatchEvents = { ...current.matchEvents };
      const descendants = dependencyMap.get(matchId) ?? new Set();

      descendants.forEach((dependentId) => {
        delete nextResults[dependentId];
        delete nextMatchEvents[dependentId];
      });

      if (nextResults[matchId] === side) {
        delete nextResults[matchId];
      } else {
        nextResults[matchId] = side;
      }

      return {
        ...current,
        results: nextResults,
        matchEvents: nextMatchEvents,
      };
    });
  }

  function handleAddEvent(matchId, side) {
    setState((current) => {
      const matchState = current.matchEvents[matchId] ?? { A: [], B: [] };

      return {
        ...current,
        matchEvents: {
          ...current.matchEvents,
          [matchId]: {
            ...matchState,
            [side]: [...(matchState[side] ?? []), createEventEntry()],
          },
        },
      };
    });
  }

  function handleRemoveEvent(matchId, side, eventId) {
    setState((current) => {
      const matchState = current.matchEvents[matchId] ?? { A: [], B: [] };

      return {
        ...current,
        matchEvents: {
          ...current.matchEvents,
          [matchId]: {
            ...matchState,
            [side]: (matchState[side] ?? []).filter((event) => event.id !== eventId),
          },
        },
      };
    });
  }

  function handleUpdateEvent(matchId, side, eventId, field, value) {
    setState((current) => {
      const matchState = current.matchEvents[matchId] ?? { A: [], B: [] };

      return {
        ...current,
        matchEvents: {
          ...current.matchEvents,
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
                updatedEvent.assistName = '';
                updatedEvent.ownGoal = false;
              }

              if (field === 'ownGoal' && value) {
                updatedEvent.assistName = '';
              }

              return updatedEvent;
            }),
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
            <h1>Gerenciador de campeonatos com chave upper e lower bracket.</h1>
            <p className="hero__text">
              Cadastre entre 4 e 8 times, monte um torneio em dupla eliminacao e registre
              eventos por partida para alimentar os rankings.
            </p>
          </div>

          <div className="hero__stats">
            <div className="stat-card">
              <span>Times</span>
              <strong>{state.teams.length}</strong>
            </div>
            <div className="stat-card">
              <span>Tamanho da chave</span>
              <strong>{bracketSize ?? '-'}</strong>
            </div>
            <div className="stat-card">
              <span>Eventos</span>
              <strong>{totalEvents}</strong>
            </div>
          </div>
        </section>

        <section className="panel panel--register">
          <div className="panel__heading">
            <div>
              <p className="eyebrow">Cadastro</p>
              <h2>Registrar times</h2>
            </div>
            <div className="panel__actions">
              <button type="button" className="ghost-button" onClick={resetTournament}>
                Limpar tudo
              </button>
              {state.locked ? (
                <button type="button" className="ghost-button" onClick={unlockTournament}>
                  Editar cadastro
                </button>
              ) : (
                <button
                  type="button"
                  className="primary-button"
                  disabled={!canStart}
                  onClick={startTournament}
                >
                  Gerar chaveamento
                </button>
              )}
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
                disabled={state.locked || state.teams.length >= 8}
              />
            </label>

            <button
              type="submit"
              className="primary-button"
              disabled={state.locked || !teamName.trim() || state.teams.length >= 8}
            >
              Adicionar time
            </button>
          </form>

          <div className="team-list">
            {state.teams.length === 0 ? (
              <p className="empty-state">Nenhum time cadastrado ainda.</p>
            ) : (
              state.teams.map((team, index) => (
                <div key={team} className="team-chip">
                  <span className="team-chip__seed">Seed {index + 1}</span>
                  <strong>{team}</strong>
                  {!state.locked && (
                    <button type="button" onClick={() => removeTeam(team)}>
                      remover
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="helper-grid">
            <p>
              O sistema aceita de <strong>4 a 8 times</strong>. Ao gerar a chave, a ordem do
              cadastro vira o seed do campeonato.
            </p>
            <p>
              Os eventos sao cadastrados por <strong>partida e por time</strong>. Gol contra soma
              no placar do adversario.
            </p>
          </div>
        </section>

        {state.locked && (
          <>
            <section className="panel panel--summary">
              <div className="panel__heading">
                <div>
                  <p className="eyebrow">Resumo</p>
                  <h2>Campeonato em andamento</h2>
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
                      .map((team, index) => `Slot ${index + 1}: ${team ?? 'Bye'}`)
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
                  <p>Partidas com vencedor selecionado manualmente.</p>
                </div>
                <div className="summary-card">
                  <span>Eventos cadastrados</span>
                  <strong>{totalEvents}</strong>
                  <p>Inclui gols, assistencias, amarelos e vermelhos por partida.</p>
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
                            onPickWinner={handlePickWinner}
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
                            onPickWinner={handlePickWinner}
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
                            onPickWinner={handlePickWinner}
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
