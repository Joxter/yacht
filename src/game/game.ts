export type DiceVal = 1 | 2 | 3 | 4 | 5 | 6;
export type DiceSum = [number, number, number, number, number, number];
export type Dice = {
  val: DiceVal;
  pos: number;
  state: "kept" | "table" | "cup" | "spinning";
};
export type Dices = [Dice, Dice, Dice, Dice, Dice];

// todo Store FULL state (dices, players, stage) in one single variable

export const GameStatuses = {
  Init: "Init",
  PlayerMove: "PlayerMove",
  Finish: "Finish",
} as const;

export const MaxPlayerCount = 6;

export type Stage =
  | { status: typeof GameStatuses.Init }
  | { status: typeof GameStatuses.PlayerMove; player: number; step: number; spinning: boolean }
  | { status: typeof GameStatuses.Finish; winners: number[] };

export type Scores = {
  Aces: number | null;
  Deuces: number | null;
  Threes: number | null;
  Fours: number | null;
  Fives: number | null;
  Sixes: number | null;
  Extra: number | null;
  //
  "Three of a kind": number | null;
  "Four of a kind": number | null;
  "Full house": number | null;
  "Small straight": number | null;
  "Large straight": number | null;
  Yacht: number | null;
  Chance: number | null;
};

export type CategoryName = keyof Scores;

export type Player = {
  name: string;
  // n: number;
  scores: Scores;
};

export type Category = {
  name: CategoryName;
  icon: string;
  isMatch: (dices: DiceSum, scores: Scores) => number | false; // todo Remove `false`? maybe just 0 is enough
};

export const categoriesTop: Category[] = [
  { name: "Aces", icon: "", isMatch: (d) => setOf(d, 1) },
  { name: "Deuces", icon: "", isMatch: (d) => setOf(d, 2) },
  { name: "Threes", icon: "", isMatch: (d) => setOf(d, 3) },
  { name: "Fours", icon: "", isMatch: (d) => setOf(d, 4) },
  { name: "Fives", icon: "", isMatch: (d) => setOf(d, 5) },
  { name: "Sixes", icon: "", isMatch: (d) => setOf(d, 6) },
];

export let extraCategory: Category = {
  name: "Extra",
  icon: "",
  isMatch: (_: any, scores) => {
    return totalOfTop(scores) >= 63 ? 35 : false;
  },
};

export const categoriesLow: Category[] = [
  {
    name: "Three of a kind",
    icon: "",
    isMatch: (dices: DiceSum) => {
      let has3OfSomething = dices.find((cnt) => {
        return cnt >= 3;
      });
      return has3OfSomething ? sum(dices) : false;
    },
  },
  {
    name: "Four of a kind",
    icon: "",
    isMatch: (dices: DiceSum) => {
      let has4OfSomething = dices.find((cnt) => {
        return cnt >= 4;
      });
      return has4OfSomething ? sum(dices) : false;
    },
  },
  {
    name: "Full house",
    icon: "",
    isMatch: (dices: DiceSum) => {
      let cnt = dices;
      if (cnt.includes(2) && cnt.includes(3)) {
        return 25;
      }
      return false;
    },
  },
  {
    name: "Small straight",
    icon: "",
    isMatch: (dices: DiceSum) => {
      let cnt = dices;
      if (
        (cnt[0] && cnt[1] && cnt[2] && cnt[3]) ||
        (cnt[1] && cnt[2] && cnt[3] && cnt[4]) ||
        (cnt[2] && cnt[3] && cnt[4] && cnt[5])
      ) {
        return 30;
      }
      return false;
    },
  },
  {
    name: "Large straight",
    icon: "",
    isMatch: (dices: DiceSum) => {
      let cnt = dices;
      if ((cnt[0] && cnt[1] && cnt[2] && cnt[3] && cnt[4]) || (cnt[1] && cnt[2] && cnt[3] && cnt[4] && cnt[5])) {
        return 40;
      }
      return false;
    },
  },
  {
    name: "Yacht",
    icon: "",
    isMatch: (dices: DiceSum) => {
      if (dices.includes(5)) {
        return 50;
      }
      return false;
    },
  },
  {
    name: "Chance",
    icon: "",
    isMatch: (dices: DiceSum) => {
      return sum(dices);
    },
  },
];

export function newPlayer(): Player {
  return { name: "", scores: newScores() };
}

export function newScores(): Scores {
  return {
    Aces: null,
    Deuces: null,
    Threes: null,
    Fours: null,
    Fives: null,
    Sixes: null,
    Extra: null,
    //
    "Three of a kind": null,
    "Four of a kind": null,
    "Full house": null,
    "Small straight": null,
    "Large straight": null,
    Yacht: null,
    Chance: null,
  };
}

function setOf(dices: DiceSum, n: DiceVal): number | false {
  let cnt = countOf(dices, n);
  if (cnt) {
    return cnt * n;
  }
  return false;
}

function countOf(dices: DiceSum, n: DiceVal): number {
  return dices[n - 1];
}

/**
 * Returns count of each dice
 *
 * example:
 *    input dices  [1, 2, 2, 5, 6]
 *    result       [1, 2, 0, 0, 1, 1]
 * */
export function countOfEverything(dices: Dices): DiceSum {
  let res = [0, 0, 0, 0, 0, 0] as DiceSum;
  dices.forEach((d) => res[d.val - 1]++);
  return res;
}

function sum(dices: DiceSum): number {
  return dices.reduce((acc, dice, i) => acc + dice * (i + 1), 0);
}

function totalOfTop(score: Scores): number {
  return (
    (score.Aces || 0) +
    (score.Deuces || 0) +
    (score.Threes || 0) +
    (score.Fours || 0) +
    (score.Fives || 0) +
    (score.Sixes || 0)
  );
}

function ifAllTopCommitted(score: Scores): boolean {
  return (
    score.Aces !== null &&
    score.Deuces !== null &&
    score.Threes !== null &&
    score.Fours !== null &&
    score.Fives !== null &&
    score.Sixes !== null
  );
}

function isTopCategory(name: CategoryName): boolean {
  return (
    name === "Aces" ||
    name === "Deuces" ||
    name === "Threes" ||
    name === "Fours" ||
    name === "Fives" ||
    name === "Sixes"
  );
}

export function createDices(): Dices {
  return [
    { val: 1, pos: 0, state: "cup" },
    { val: 1, pos: 1, state: "cup" },
    { val: 1, pos: 2, state: "cup" },
    { val: 1, pos: 3, state: "cup" },
    { val: 1, pos: 4, state: "cup" },
  ] as Dices;
}

export function createGame(): { stage: Stage; players: Player[]; dices: Dices } {
  let stage: Stage = {
    status: GameStatuses.Init,
  };

  let players: Player[] = [];
  let dices = createDices();

  return { stage, players, dices };
}

export function throwDicesStart(game: Stage, dices: Dices): { stage: Stage; dices: Dices } {
  let maybeGame = trySpin(game);
  if (!maybeGame) {
    return { stage: game, dices };
  }

  let newDices = dices.map((d) => {
    if (d.state !== "kept") {
      return { ...d, state: "spinning" };
    }
    return d;
  }) as Dices;

  return { stage: maybeGame, dices: newDices };
}

export function throwDicesEnd(stage: Stage, dices: Dices): { stage: Stage; dices: Dices } {
  let maybeGame = tryThrow(stage);
  if (!maybeGame) {
    return { stage, dices };
  }

  let diceVals = dices
    .filter((d) => d.state === "spinning")
    .map(() => {
      return (Math.floor(Math.random() * 6) + 1) as DiceVal;
    })
    .sort((a, b) => b - a);

  let newDices = dices.map((d) => {
    if (d.state === "spinning") {
      return {
        pos: d.pos,
        val: diceVals.pop(),
        state: "table",
      };
    }
    return d;
  }) as Dices;

  return { dices: newDices, stage: maybeGame };
}

export function startGame(stage: Stage, players: Player[]): Stage {
  if (stage.status === GameStatuses.Init) {
    if (players.every((p) => p.name.trim() !== "")) {
      return { status: GameStatuses.PlayerMove, player: 0, step: 0, spinning: false };
    }
  }
  return stage;
}

export function canSpin(game: Stage): boolean {
  return game.status === GameStatuses.PlayerMove && !game.spinning && game.step <= 3;
}

export function trySpin(game: Stage): false | Stage {
  if (game.status === GameStatuses.PlayerMove && game.step <= 3) {
    return { ...game, spinning: true, step: game.step + 1 };
  }
  return false;
}

export function tryThrow(game: Stage): false | Stage {
  if (game.status === GameStatuses.PlayerMove && game.spinning) {
    return { ...game, spinning: false };
  }
  return false;
}

export function canThrow(game: Stage): boolean {
  return game.status === GameStatuses.PlayerMove && game.spinning;
}

export function commitScores(
  stage: Stage,
  players: Player[],
  payload: { score: number; name: CategoryName },
): { stage: Stage; players: Player[] } {
  if (stage.status === GameStatuses.PlayerMove && payload.name !== "Extra") {
    let newPlayers = [...players];
    newPlayers[stage.player].scores = {
      ...newPlayers[stage.player].scores,
      [payload.name]: payload.score,
    };

    if (isTopCategory(payload.name) && ifAllTopCommitted(newPlayers[stage.player].scores)) {
      let extraScores = extraCategory.isMatch([] as any, newPlayers[stage.player].scores) || 0;

      newPlayers[stage.player].scores = {
        ...newPlayers[stage.player].scores,
        Extra: extraScores,
      };
    }

    let nextPlayerId = (stage.player + 1) % players.length;

    if (isAllCommitted(newPlayers[nextPlayerId])) {
      return {
        players: newPlayers,
        stage: {
          status: GameStatuses.Finish,
          winners: findWinners(newPlayers),
        },
      };
    }

    return {
      players: newPlayers,
      stage: {
        ...stage,
        player: nextPlayerId,
        step: 0,
      },
    };
  }
  return { players, stage };
}

function isAllCommitted(player: Player): boolean {
  return Object.values(player.scores).every((n) => n !== null);
}

function totalScore(player: Player): number {
  let vals = Object.values(player.scores);

  let total = 0;
  for (let i = 0; i < vals.length; i++) {
    total += vals[i] || 0;
  }
  return total;
}

function findWinners(players: Player[]): number[] {
  let finalScores = players.map((p) => totalScore(p));
  let max = Math.max(...finalScores);

  let winners: number[] = [];
  for (let i = 0; i < finalScores.length; i++) {
    if (finalScores[i] === max) {
      winners.push(i);
    }
  }
  return winners;
}
