import type { Component } from "solid-js";

import css from "./App.module.css";
import { PlayerScores } from "./components/PlayerScores";
import { useUnit } from "effector-solid";
import { $setDices, $players, $newDices, throwDicesClicked, toBoxDicesClicked } from "./game/model";
import { FiveDices } from "./components/FiveDices";

const App: Component = () => {
  let [allDices, newDices, players] = useUnit([$setDices, $newDices, $players]);

  return (
    <div class={css.root}>
      <div class={css.content}>
        <h1>Yacht</h1>

        <div style={{ display: "flex" }}>
          <div style={{ width: "300px" }}>
            <PlayerScores dices={allDices()} players={players()} />
          </div>
          <div>
            <FiveDices dices={newDices()} />
            <div>
              <button type={"button"} onClick={() => throwDicesClicked()}>
                throw dices
              </button>
              <button type={"button"} onClick={() => toBoxDicesClicked()}>
                to box
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
