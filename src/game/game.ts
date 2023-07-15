type Dice = 1 | 2 | 3 | 4 | 5 | 6;
type Dices = [Dice, Dice, Dice, Dice, Dice];

type Category = {
  name: string;
  icon: string;
  isMatch: (dices: Dices) => number | false;
};

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
