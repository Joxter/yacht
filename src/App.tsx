import type { Component } from "solid-js";

import css from "./App.module.css";
import { PlayerScores } from "./components/PlayerScores";
import { useUnit } from "effector-solid";
import { $setDices, $players, $dices, throwDicesClicked, $currentPlayer, $canThrow } from "./game/model";
import { FiveDices } from "./components/FiveDices";

const App: Component = () => {
    let [allDices, newDices, players, currentPlayer, canThrow] = useUnit([
    $setDices,
    $dices,
    $players,
    $currentPlayer,
    $canThrow,
  ]);

  return (
    <div class={css.root}>
      <div class={css.content}>
        <h1>Yacht</h1>

        <div style={{ display: "flex" }}>
          <div style={{ width: "300px" }}>
            <PlayerScores dices={allDices()} currentPlayer={currentPlayer()} players={players()} />
          </div>
          <div>
            <FiveDices dices={newDices()} />
            <div>
              <button disabled={!canThrow()} type={"button"} onClick={() => throwDicesClicked()}>
                throw dices
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
