import { combine, createEffect, createEvent, createStore, sample } from "effector";
import { CategoryName, DiceVal, newPlayer, Player, Stage, Stages, MaxPlayerCount, Dices, Dice } from "./game";

export let $state = createStore<Stage>({ stage: Stages.PlayerStart, player: 0, step: 1 });
export let $players = createStore<Player[]>([]);

export let $playerNameInput = createStore("");

export type FiveStateDice = [Dice, Dice, Dice, Dice, Dice];

export let $newDices = createStore<FiveStateDice>([
  { val: 1, pos: 0, state: "cup" },
  { val: 1, pos: 1, state: "cup" },
  { val: 1, pos: 2, state: "cup" },
  { val: 1, pos: 3, state: "cup" },
  { val: 1, pos: 4, state: "cup" },
]);

export let $setDices = $newDices.map((dices) => {
  let res = dices.filter((d) => d.state === "table" || d.state === "kept");

  return res.length === 5 ? (res as Dices) : null;
});

export let $currentPlayer = $state.map((s) => {
  if ("player" in s) {
    return s.player;
  }
  return 0;
});

let addPlayerClicked = createEvent();
let removePlayerClicked = createEvent<number>();
let playerNameChanged = createEvent<{ n: number; name: string }>();
let startGameClicked = createEvent();

export let throwDicesClicked = createEvent();
export let toBoxDicesClicked = createEvent();
export let keepDiceClicked = createEvent<{ diceNumber: number }>();
export let discardDiceClicked = createEvent<{ diceNumber: number }>();
export let commitScoreClicked = createEvent<{ name: CategoryName; score: number }>();

let throwDicesFx = createEffect(async (dices: Dice[]): Promise<DiceVal[]> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  let newVals = dices
    .map(() => {
      return (Math.floor(Math.random() * 6) + 1) as DiceVal;
    })
    .sort((a, b) => b - a);

  return newVals;
});

sample({
  source: $newDices,
  clock: throwDicesClicked,
  fn: (dices) => {
    return dices.filter((d) => d.state !== "kept");
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
  source: [$players, $state] as const,
  clock: commitScoreClicked,
  fn: ([players, game], { score, name }) => {
    if (game.stage !== Stages.Init) {
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

$state
  .on(startGameClicked, () => {
    return { stage: Stages.PlayerStart, player: 0, step: 1 };
  })
  .on(throwDicesClicked, (state) => {
    if (state.stage === Stages.PlayerStart && state.step < 3) {
      return {
        stage: Stages.PlayerThrew,
        player: state.player,
        step: (state.step + 1) as 1 | 2 | 3,
      };
    }
  });

$newDices
  .on(throwDicesClicked, (dices) => {
    let res = dices.map((d) => {
      if (d.state !== "kept") {
        return { ...d, state: "spinning" };
      }
      return d;
    }) as FiveStateDice;
    return res;
  })
  .on(throwDicesFx.doneData, (dices, newDices) => {
    let res = dices.map((d) => {
      if (d.state === "spinning") {
        return {
          pos: d.pos,
          val: newDices.pop(),
          state: "table",
        };
      }
      return d;
    }) as FiveStateDice;
    return res;
  })
  .on(keepDiceClicked, (dices, { diceNumber }) => {
    let res = dices.map((d) => {
      if (d.pos === diceNumber) {
        return { ...d, state: "kept" };
      }
      return d;
    }) as FiveStateDice;
    return res;
  })
  .on(discardDiceClicked, (dices, { diceNumber }) => {
    let res = dices.map((d) => {
      if (d.pos === diceNumber) {
        return { ...d, state: "table" };
      }
      return d;
    }) as FiveStateDice;
    return res;
  });

addPlayerClicked();
addPlayerClicked();
