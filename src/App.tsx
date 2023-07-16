import type { Component } from "solid-js";

import css from "./App.module.css";
import { PlayerScores } from "./components/PlayerScores";
import { useUnit } from "effector-solid";
import { $allDices, $players } from "./game/model";

const App: Component = () => {
  let [allDices, players] = useUnit([$allDices, $players]);

  return (
    <div class={css.root}>
      <div class={css.content}>
        <h1>Yacht</h1>

        <PlayerScores dices={allDices()} players={players()} />
        <h2>desk</h2>
        <h3>throw animation</h3>
        <h3>kept dices</h3>
        <h3>thrown dices</h3>
      </div>
    </div>
  );
};

export default App;
