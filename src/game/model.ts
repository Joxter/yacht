import { createEvent, createStore, sample } from "effector";
import {
  CategoryName,
  Dices,
  createGame,
  throwDicesEnd,
  startNewGameWithPlayers,
  canSpin,
  canThrow,
  throwDicesStart,
  commitScores,
  GameStatuses,
  countOfEverything,
  canStartNewGame,
  Dice,
  isSpinning,
  noMoreShakes,
} from "./game";
import { createPlayersForm } from "./playersForm";

let game = createGame();

export let $game = createStore(game);

export let playerForm = createPlayersForm();

export let $dices = $game.map((it) => it.dices);
export let $players = $game.map((it) => it.players);
export let $editable = $game.map((game) => game.stage.status === GameStatuses.Init);

export let $countOfEverything = $dices.map((dices) => {
  let res = dices.filter((d) => d.state === "table" || d.state === "kept");

  return res.length === 5 ? countOfEverything(res as Dices) : null;
});
export let $dicesWithPosition = $dices.map((dices) => getDicesPosition(dices));

export let $currentPlayer = $game.map((s) => {
  if ("player" in s.stage) {
    return s.stage.player;
  }
  return 0;
});

export let $canSpin = $game.map((g) => canSpin(g.stage));
export let $canThrow = $game.map((g) => canThrow(g.stage));
export let $isSpinning = $game.map((g) => isSpinning(g.stage));
export let $noMoreShakes = $game.map((g) => noMoreShakes(g.stage));
export let $canStartNewGame = $game.map((g) => canStartNewGame(g));

export let startGameClicked = createEvent();

export let spinDicesClicked = createEvent();
export let throwDicesClicked = createEvent();
export let keepDiceClicked = createEvent<{ diceNumber: number }>();
export let discardDiceClicked = createEvent<{ diceNumber: number }>();
export let commitScoreClicked = createEvent<{ name: CategoryName; score: number }>();

sample({
  source: $game,
  clock: spinDicesClicked,
  filter: $canSpin,
  fn: (game) => {
    let res = throwDicesStart(game);
    return res ? { ...game, ...res } : game;
  },
  target: $game,
});

sample({
  source: $game,
  clock: throwDicesClicked,
  filter: $canThrow,
  fn: (game) => {
    let res = throwDicesEnd(game);
    return res ? { ...game, ...res } : game;
  },
  target: $game,
});

sample({
  source: $game,
  clock: commitScoreClicked,
  fn: (game, payload) => {
    let res = commitScores(game, payload);
    return res ? { ...game, ...res } : game;
  },
  target: $game,
});

sample({
  clock: playerForm.playersApplied,
  fn: (players) => {
    return startNewGameWithPlayers(players);
  },
  target: $game,
});

$game
  .on(keepDiceClicked, (game, { diceNumber }) => {
    let res = game.dices.map((d) => {
      if (d.id === diceNumber) {
        return { ...d, state: "kept" };
      }
      return d;
    }) as Dices;
    return { ...game, dices: res };
  })
  .on(discardDiceClicked, (game, { diceNumber }) => {
    let res = game.dices.map((d) => {
      if (d.id === diceNumber) {
        return { ...d, state: "table" };
      }
      return d;
    }) as Dices;
    return { ...game, dices: res };
  });

function split(dices: Dices): { kept: Dice[]; table: Dice[] } {
  // WIP
  let kept: Dice[] = [];
  let table: Dice[] = [];

  dices.forEach((dice) => {
    if (dice.state === "kept") {
      kept.push(dice);
    } else if (dice.state === "table") {
      table.push(dice);
    }
  });
  return { kept, table };
}

function getDicesPosition(dices: Dices): Dices {
  // WIP
  const OFFSET = {
    left: 8,
    top: 6,
  };

  let diceWidth = 50;
  let gap = 8;
  let totalWidth = diceWidth * 5 + gap * 4;

  function getRowOffset(count: number): number {
    return totalWidth - (count * diceWidth + (count - 1) * gap) / 2;
  }

  function calcPos(dice: Dice): number {
    return dices.filter((d) => {
      return d.state === dice.state && d.val < dice.val;
    }).length;
  }

  let aa = [0, 0, 0, 0, 0, 0, 0];
  let positionedDices = dices.map((dice): Dice => {
    let res = { ...dice, pos: calcPos(dice) + aa[dice.val] };
    aa[dice.val]++;
    return res;
  });

  let keptDices = 0;
  let tableDices = 0;

  dices.forEach((dice) => {
    if (dice.state === "kept") {
      keptDices++;
    } else if (dice.state === "table") {
      tableDices++;
    }
  });

  let keptOffset = getRowOffset(keptDices);
  let tableOffset = getRowOffset(tableDices);

  let ddd = positionedDices.map((dice): Dice => {
    if (dice.state === "kept") {
      return {
        ...dice,
        coords: `translateX(${keptOffset + dice.pos * (diceWidth + gap)}px) translateY(${OFFSET.top}px)`,
      };
    } else if (dice.state === "table") {
      return {
        ...dice,
        coords: `translateX(${tableOffset + dice.pos * (diceWidth + gap)}px) translateY(${
          OFFSET.top + diceWidth + gap
        }px)`,
      };
    } else {
      return dice;
    }
  });

  return ddd as Dices;
}
