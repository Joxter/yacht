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
import { canSpin, GameStatuses } from "./game/game";

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

        <div style={{ display: "grid", gap: "8px", "grid-template-columns": "auto 1fr" }}>
          <div>
            <PlayerScores
              dices={allDices()}
              currentPlayer={currentPlayer()}
              players={players()}
              editable={game().stage.status === GameStatuses.Init}
            />
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
            <p style={{}}>stage: {JSON.stringify(game().stage)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
