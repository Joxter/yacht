export type Dice = 1 | 2 | 3 | 4 | 5 | 6;
export type Dices = [Dice, Dice, Dice, Dice, Dice];

export const Stages = {
  Init: "Init",
  PlayerStart: "PlayerStart",
  PlayerThrew: "PlayerThrew",
  PlayerThinking: "PlayerThinking",
  Finish: "Finish",
} as const;

export const MaxPlayerCount = 6;

export type Stage =
  | { stage: typeof Stages.Init }
  | { stage: typeof Stages.PlayerStart; player: number }
  | { stage: typeof Stages.PlayerThrew; player: number }
  | { stage: typeof Stages.PlayerThinking; player: number }
  | { stage: typeof Stages.Finish; player: number };

export type Scores = {
  Aces: number;
  Deuces: number;
  Threes: number;
  Fours: number;
  Fives: number;
  Sixes: number;
  Extra: number;
  //
  ThreeOfAKind: number;
  FourOfAKind: number;
  FullHouse: number;
  SmallStraight: number;
  LargeStraight: number;
  Yacht: number;
  Chance: number;
};

export type CategoryName = keyof Scores;

export type Player = {
  name: string;
  n: number;
  scores: Scores;
};

type Category = {
  name: string;
  icon: string;
  isMatch: (dices: Dices) => number | false;
};

const categoriesTop: Category[] = [
  { name: "Aces", icon: "", isMatch: (d) => setOf(d, 1) },
  { name: "Deuces", icon: "", isMatch: (d) => setOf(d, 2) },
  { name: "Threes", icon: "", isMatch: (d) => setOf(d, 3) },
  { name: "Fours", icon: "", isMatch: (d) => setOf(d, 4) },
  { name: "Fives", icon: "", isMatch: (d) => setOf(d, 5) },
  { name: "Sixes", icon: "", isMatch: (d) => setOf(d, 6) },
];

const categoriesLow: Category[] = [
  {
    name: "Three of a kind",
    icon: "",
    isMatch: (dices: Dices) => {
      let has3OfSomething = countOfEverything(dices).find((cnt) => {
        return cnt >= 3;
      });
      return has3OfSomething ? sum(dices) : false;
    },
  },
  {
    name: "Four of a kind",
    icon: "",
    isMatch: (dices: Dices) => {
      let has4OfSomething = countOfEverything(dices).find((cnt) => {
        return cnt >= 4;
      });
      return has4OfSomething ? sum(dices) : false;
    },
  },
  {
    name: "Full house",
    icon: "",
    isMatch: (dices: Dices) => {
      let cnt = countOfEverything(dices);
      if (cnt.includes(2) && cnt.includes(3)) {
        return 25;
      }
      return false;
    },
  },
  {
    name: "Small straight",
    icon: "",
    isMatch: (dices: Dices) => {
      let cnt = countOfEverything(dices);
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
    isMatch: (dices: Dices) => {
      let cnt = countOfEverything(dices);
      if ((cnt[0] && cnt[1] && cnt[2] && cnt[3] && cnt[4]) || (cnt[1] && cnt[2] && cnt[3] && cnt[4] && cnt[5])) {
        return 40;
      }
      return false;
    },
  },
  {
    name: "Yacht",
    icon: "",
    isMatch: (dices: Dices) => {
      if (dices[0] === dices[1] && dices[1] === dices[2] && dices[2] === dices[3] && dices[3] === dices[4]) {
        return 50;
      }
      return false;
    },
  },
  {
    name: "Chance",
    icon: "",
    isMatch: (dices: Dices) => {
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
    Aces: 0,
    Deuces: 0,
    Threes: 0,
    Fours: 0,
    Fives: 0,
    Sixes: 0,
    Extra: 0,
    //
    ThreeOfAKind: 0,
    FourOfAKind: 0,
    FullHouse: 0,
    SmallStraight: 0,
    LargeStraight: 0,
    Yacht: 0,
    Chance: 0,
  };
}

function setOf(dices: Dices, n: Dice): number | false {
  let cnt = countOf(dices, n);
  if (cnt) {
    return cnt * n;
  }
  return false;
}

function countOf(dices: Dices, n: Dice): number {
  return countOfEverything(dices)[n - 1];
}

/**
 * Returns count of each dice
 *
 * example:
 *    input dices  [1, 2, 2, 5, 6]
 *    result       [1, 2, 0, 0, 1, 1]
 * */
function countOfEverything(dices: Dices): [number, number, number, number, number, number] {
  let res = [0, 0, 0, 0, 0, 0] as [number, number, number, number, number, number];
  dices.forEach((d) => res[d - 1]++);
  return res;
}

function sum(dices: Dices): number {
  return dices.reduce((acc, it) => acc + it, 0);
}
