import { combine, createEffect, createEvent, createStore, sample } from "effector";
import {
  CategoryName,
  newPlayer,
  GameStatuses,
  MaxPlayerCount,
  Dices,
  createGame,
  dicesToSpinning,
  throwDices,
  Stage,
  startGame,
  canThrow,
} from "./game";

let game = createGame();

export let $game = createStore(startGame(game.stage));
export let $players = createStore(game.players);

export let $playerNameInput = createStore("");

export let $dices = createStore(game.dices);

export let $setDices = $dices.map((dices) => {
  let res = dices.filter((d) => d.state === "table" || d.state === "kept");

  return res.length === 5 ? (res as Dices) : null;
});

export let $currentPlayer = $game.map((s) => {
  if ("player" in s) {
    return s.player;
  }
  return 0;
});

export let $canThrow = $game.map((g) => canThrow(g));

let addPlayerClicked = createEvent();
let removePlayerClicked = createEvent<number>();
let playerNameChanged = createEvent<{ n: number; name: string }>();
let startGameClicked = createEvent();

export let throwDicesClicked = createEvent();
export let toBoxDicesClicked = createEvent();
export let keepDiceClicked = createEvent<{ diceNumber: number }>();
export let discardDiceClicked = createEvent<{ diceNumber: number }>();
export let commitScoreClicked = createEvent<{ name: CategoryName; score: number }>();

let throwDicesFx = createEffect(
  async (params: { dices: Dices; game: Stage }): Promise<{ dices: Dices; game: Stage }> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return throwDices(params.game, params.dices);
  },
);

sample({
  source: [$dices, $game] as const,
  clock: throwDicesClicked,
  fn: ([dices, game]) => {
    return { dices, game };
  },
  target: throwDicesFx,
});

$players
  .on(addPlayerClicked, (players) => {
    if (players.length < MaxPlayerCount) {
      return [...players, newPlayer("")];
    }
    return players;
  })
  .on(removePlayerClicked, (players, n) => {
    return players.filter((p) => p.n !== n);
  })
  .on(playerNameChanged, (players, { n, name }) => {
    return players.map((p) => {
      return p.n === n ? { ...p, name } : p;
    });
  })
  .on(startGameClicked, (players) => {
    return players.map((p, i) => {
      return { ...p, n: i };
    });
  });

sample({
  source: [$players, $game] as const,
  clock: commitScoreClicked,
  fn: ([players, game], { score, name }) => {
    if ("player" in game) {
      let newPlayers = [...players];
      newPlayers[game.player].scores = {
        ...newPlayers[game.player].scores,
        [name]: score,
      };
      return newPlayers;
    }
    return players;
  },
  target: $players,
});

$game
  .on(startGameClicked, () => {
    return { status: GameStatuses.PlayerStart, player: 0, step: 1 };
  })
  .on(throwDicesFx.doneData, (_, { game }) => game);

$dices
  .on(throwDicesClicked, (dices) => dicesToSpinning(dices))
  .on(throwDicesFx.doneData, (_, { dices }) => dices)
  .on(keepDiceClicked, (dices, { diceNumber }) => {
    let res = dices.map((d) => {
      if (d.pos === diceNumber) {
        return { ...d, state: "kept" };
      }
      return d;
    }) as Dices;
    return res;
  })
  .on(discardDiceClicked, (dices, { diceNumber }) => {
    let res = dices.map((d) => {
      if (d.pos === diceNumber) {
        return { ...d, state: "table" };
      }
      return d;
    }) as Dices;
    return res;
  });

addPlayerClicked();
addPlayerClicked();
