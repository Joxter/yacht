import type { Component } from "solid-js";
import { Show } from "solid-js";
import css from "./App.module.css";
import { PlayerScores } from "./components/PlayerScores";
import { useUnit } from "effector-solid";
import {
  $setDices,
  $players,
  $dices,
  spinDicesClicked,
  $currentPlayer,
  $canSpin,
  throwDicesClicked,
  $canThrow,
  $game,
} from "./game/model";
import { FiveDices } from "./components/FiveDices";
import { canSpin } from "./game/game";

const App: Component = () => {
  let [allDices, newDices, players, currentPlayer, canSpin, canThrow, game] = useUnit([
    $setDices,
    $dices,
    $players,
    $currentPlayer,
    $canSpin,
    $canThrow,
    $game,
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
              <Show when={canSpin()}>
                <button type={"button"} onClick={() => spinDicesClicked()}>
                  spin dices
                </button>
              </Show>
              <Show when={canThrow()}>
                <button disabled={!canThrow()} type={"button"} onClick={() => throwDicesClicked()}>
                  throw dices
                </button>
              </Show>
            </div>
            <p>{JSON.stringify(game())}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
