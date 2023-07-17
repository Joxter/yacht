import { combine, createEffect, createEvent, createStore, sample } from "effector";
import { CategoryName, Dice, newPlayer, Player, Stage, Stages, MaxPlayerCount, Dices } from "./game";

export let $state = createStore<Stage>({ stage: Stages.Init });
export let $players = createStore<Player[]>([]);

export let $playerNameInput = createStore("");

export type StateDice = {
  val: Dice;
  pos: number;
  state: "kept" | "table" | "box" | "spinning";
};

export type FiveStateDice = [StateDice, StateDice, StateDice, StateDice, StateDice];

export let $newDices = createStore<FiveStateDice>([
  { val: 1, pos: 0, state: "box" },
  { val: 1, pos: 1, state: "box" },
  { val: 1, pos: 2, state: "box" },
  { val: 1, pos: 3, state: "box" },
  { val: 1, pos: 4, state: "box" },
]);

$newDices.watch((d) => console.log(...d))

export let $setDices = $newDices.map((dices) => {
  let res = dices.filter((d) => d.state === "table" || d.state === "kept").map((d) => d.val);

  return res.length === 5 ? (res as Dices) : null;
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

let throwDicesFx = createEffect(async (dices: Dice[]): Promise<Dice[]> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  let res = dices.map(() => {
    return (Math.floor(Math.random() * 6) + 1) as Dice;
  });

  return res;
});

sample({
  source: $newDices,
  clock: throwDicesClicked,
  fn: (dices) => {
    return dices.filter((d) => d.state !== "kept").map((d) => d.val);
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

$state
  .on(startGameClicked, () => {
    return { stage: Stages.PlayerStart, player: 0 };
  })
  .on(throwDicesClicked, (state) => {
    if (state.stage === Stages.PlayerStart) {
      return { stage: Stages.PlayerThrew, player: state.player };
    }
  });

$newDices
  .on(toBoxDicesClicked, (dices) => {
    let res = dices.map((d) => {
      if (d.state === "table") {
        return { ...d, state: "box" };
      }
      return d;
    }) as FiveStateDice;
    return res;
  })
  .on(throwDicesClicked, (dices) => {
    let res = dices.map((d) => {
      if (d.state === "box" || d.state === "table") {
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
  });

addPlayerClicked();
addPlayerClicked();
