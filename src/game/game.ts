export type DiceVal = 1 | 2 | 3 | 4 | 5 | 6;
export type DiceSum = [number, number, number, number, number, number];
export type Dice = {
  val: DiceVal;
  pos: number;
  state: "kept" | "table" | "cup" | "spinning";
};
export type Dices = [Dice, Dice, Dice, Dice, Dice];

export const Stages = {
  Init: "Init",
  PlayerStart: "PlayerStart", // before roll
  PlayerThrew: "PlayerRolling", // rolling
  PlayerThinking: "PlayerThinking", // mixing dices
  ScoreCommitted: "ScoreCommitted", // score committed
  Finish: "Finish",
} as const;

export const MaxPlayerCount = 6;

export type Stage =
  | { stage: typeof Stages.Init }
  | { stage: typeof Stages.PlayerStart; player: number; step: 1 | 2 | 3 }
  | { stage: typeof Stages.PlayerThrew; player: number; step: 1 | 2 | 3 }
  | { stage: typeof Stages.PlayerThinking; player: number; step: 1 | 2 | 3 }
  | { stage: typeof Stages.ScoreCommitted; player: number }
  | { stage: typeof Stages.Finish; player: number };

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
  n: number;
  scores: Scores;
};

export type Category = {
  name: CategoryName;
  icon: string;
  // TODO dices -> count of everything
  isMatch: (dices: DiceSum, scores: Scores) => number | false;
};

export const categoriesTop: Category[] = [
  { name: "Aces", icon: "", isMatch: (d) => setOf(d, 1) },
  { name: "Deuces", icon: "", isMatch: (d) => setOf(d, 2) },
  { name: "Threes", icon: "", isMatch: (d) => setOf(d, 3) },
  { name: "Fours", icon: "", isMatch: (d) => setOf(d, 4) },
  { name: "Fives", icon: "", isMatch: (d) => setOf(d, 5) },
  { name: "Sixes", icon: "", isMatch: (d) => setOf(d, 6) },
  {
    name: "Extra",
    icon: "",
    isMatch: (dices, scores) => {
      return totalOfTop(scores) >= 63 ? 35 : false;
    },
  },
];

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

let playerCounter = 0;
export function newPlayer(name: string): Player {
  playerCounter++;
  return { name, n: playerCounter, scores: newScores() };
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
