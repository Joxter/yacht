import { createEvent, createStore, sample } from "effector";
import { CategoryName, Dice, newPlayer, Player, Stage, Stages, MaxPlayerCount } from "./game";

let $state = createStore<Stage>({ stage: Stages.Init });
let $players = createStore<Player[]>([]);

let $keptDices = createStore<Dice[]>([]);
let $playerNameInput = createStore("");
let $thrownDices = createStore<Dice[]>([]);

let addPlayerClicked = createEvent();
let removePlayerClicked = createEvent<number>();
let playerNameChanged = createEvent<{ n: number; name: string }>();
let startGameClicked = createEvent();

let throwDicesClicked = createEvent();
let keepDiceClicked = createEvent<{ diceNumber: number }>();
let discardDiceClicked = createEvent<{ diceNumber: number }>();
let commitScoreClicked = createEvent<{ name: CategoryName; score: number }>();

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
