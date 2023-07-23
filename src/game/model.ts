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
} from "./game";

let game = createGame();

export let $game = createStore({
  stage: game.stage,
  dices: game.dices,
});
export let $players = createStore(game.players);

export let $dices = $game.map((it) => it.dices);

export let $setDices = $dices.map((dices) => {
  let res = dices.filter((d) => d.state === "table" || d.state === "kept");

  return res.length === 5 ? (res as Dices) : null;
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
    return throwDicesStart(game.stage, game.dices);
  },
  target: $game,
});

sample({
  source: $game,
  clock: throwDicesClicked,
  filter: $canThrow,
  fn: (game) => {
    return throwDicesEnd(game.stage, game.dices);
  },
  target: $game,
});

$players
  .on(addPlayerClicked, (players) => {
    if (players.length < MaxPlayerCount) {
      return [...players, newPlayer()];
    }
    return players;
  })
  .on(removePlayerClicked, (players, n) => {
    if (players.length < 2) return players;
    let newPlayers = [...players];
    newPlayers.splice(n, 1);
    return newPlayers;
  })
  .on(playerNameChanged, (players, { n, name }) => {
    let newPlayers = [...players];
    newPlayers[n].name = name;
    return newPlayers;
  });

sample({
  source: [$players, $game] as const,
  clock: commitScoreClicked,
  fn: ([players, game], { score, name }) => {
    if ("player" in game.stage) {
      let newPlayers = [...players];
      newPlayers[game.stage.player].scores = {
        ...newPlayers[game.stage.player].scores,
        [name]: score,
      };
      return newPlayers;
    }
    return players;
  },
  target: $players,
});

sample({
  source: [$players, $game] as const,
  clock: startGameClicked,
  fn: ([players, game]) => {
    return { ...game, stage: startGame(game.stage, players) };
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

// startGameClicked();
addPlayerClicked();
