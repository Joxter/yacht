import { combine, createEffect, createEvent, createStore, sample } from "effector";
import {
  CategoryName,
  newPlayer,
  MaxPlayerCount,
  Dices,
  createGame,
  throwDicesEnd,
  startNewGameSamePlayers,
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

let game = createGame();

export let $game = createStore(game);

export let $dices = $game.map((it) => it.dices);
export let $players = $game.map((it) => it.players);
export let $editable = $game.map((game) => game.stage.status === GameStatuses.Init);

export let $countOfEverything = $dices.map((dices) => {
  let res = dices.filter((d) => d.state === "table" || d.state === "kept");

  return res.length === 5 ? countOfEverything(res as Dices) : null;
});

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

export let addPlayerClicked = createEvent();
export let removePlayerClicked = createEvent<number>();
export let playerNameChanged = createEvent<{ n: number; name: string }>();
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

$game
  .on(addPlayerClicked, (game) => {
    if (game.players.length < MaxPlayerCount) {
      return { ...game, players: [...game.players, newPlayer("")] };
    }
    return game;
  })
  .on(removePlayerClicked, (game, n) => {
    if (game.players.length < 2) return game;
    let newPlayers = [...game.players];
    newPlayers.splice(n, 1);
    return { ...game, players: newPlayers };
  })
  .on(playerNameChanged, (game, { n, name }) => {
    let newPlayers = [...game.players];
    newPlayers[n].name = name;
    return { ...game, players: newPlayers };
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
  source: $game,
  clock: startGameClicked,
  fn: (game) => {
    let res = startNewGameSamePlayers(game);
    return res ? { ...game, ...res } : game;
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

addPlayerClicked();
addPlayerClicked();
playerNameChanged({ n: 0, name: "Kolya" });
playerNameChanged({ n: 1, name: "Olya" });

// startGameClicked();

function getDicesPosition(dices: Dices) {
  // WIP
  let dice = 50;
  let gap = 8;
  let totalWidth = dice * 5 + gap * 4;

  function getRowOffset(count: number): number {
    return totalWidth - (count * dice + (count - 1) * gap) / 2;
  }

  let keptDices: Dice[] = [];
  let tableDices: Dice[] = [];
  let boxDices: Dice[] = [];

  dices.forEach((dice) => {
    if (dice.state === "kept") {
      keptDices.push(dice);
    } else if (dice.state === "table") {
      tableDices.push(dice);
    } else {
      boxDices.push(dice);
    }
  });

  let keptOffset = getRowOffset(keptDices.length);
  let keptDicesPos = keptDices.map((d, i) => {
    return { ...d, position: `translateX(${keptOffset + i * (dice + gap)}px) translateY(0px)` };
  });

  let tableOffset = getRowOffset(tableDices.length);
  let tableDicesPos = tableDices.map((d, i) => {
    return { ...d, position: `translateX(${tableOffset + i * (dice + gap)}px) translateY(${dice + gap}px)` };
  });

  let boxOffset = getRowOffset(boxDices.length);
  let boxDicesPos = boxDices.map((d, i) => {
    return {
      ...d,
      position: `translateX(${boxOffset + i * (dice + gap)}px) translateY(${dice + gap + dice + gap}px)`,
    };
  });

  return [...keptDicesPos, ...tableDicesPos, ...boxDicesPos];
}
