import { combine, createEffect, createEvent, createStore, sample } from "effector";
import {
  CategoryName,
  newPlayer,
  MaxPlayerCount,
  Dices,
  createGame,
  throwDicesEnd,
  startGame,
  canSpin,
  canThrow,
  throwDicesStart,
  commitScores,
  GameStatuses,
  countOfEverything,
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
    let res = startGame(game);
    // console.log(res);
    return res ? { ...game, ...res } : game;
  },
  target: $game,
});

$game
  .on(keepDiceClicked, (game, { diceNumber }) => {
    let res = game.dices.map((d) => {
      if (d.pos === diceNumber) {
        return { ...d, state: "kept" };
      }
      return d;
    }) as Dices;
    return { ...game, dices: res };
  })
  .on(discardDiceClicked, (game, { diceNumber }) => {
    let res = game.dices.map((d) => {
      if (d.pos === diceNumber) {
        return { ...d, state: "table" };
      }
      return d;
    }) as Dices;
    return { ...game, dices: res };
  });

addPlayerClicked();
addPlayerClicked();
playerNameChanged({ n: 0, name: "aaa" });
playerNameChanged({ n: 1, name: "bbb" });

// startGameClicked();
