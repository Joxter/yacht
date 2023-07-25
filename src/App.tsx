import type { Component } from "solid-js";
import { Show } from "solid-js";
import css from "./App.module.css";
import { PlayerScores } from "./components/PlayerScores";
import { useUnit } from "effector-solid";
import {
  $dices,
  spinDicesClicked,
  $canSpin,
  throwDicesClicked,
  $canThrow,
  $game,
  $editable,
  startGameClicked,
  $canStartNewGame,
} from "./game/model";
import { FiveDices } from "./components/FiveDices";
import { PlayersForm } from "./components/PlayersForm";
import { GameStatuses } from "./game/game";

const App: Component = () => {
  let [dices, canSpin, canThrow, game, editable, canStartNewGame] = useUnit([
    $dices,
    $canSpin,
    $canThrow,
    $game,
    $editable,
    $canStartNewGame,
  ]);

  return (
    <div class={css.root}>
      <div class={css.content}>
        <h1>Yacht</h1>

        <div style={{ display: "grid", gap: "8px", "grid-template-columns": "auto 1fr" }}>
          <Show when={editable()}>
            <PlayersForm />
          </Show>
          <Show when={game().stage.status !== GameStatuses.Init}>
            <div>
              <PlayerScores />
              <button type={"button"} disabled={!canStartNewGame()} onClick={() => startGameClicked()}>
                RESTART
              </button>
            </div>
            <div>
              <FiveDices dices={dices()} />
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
          </Show>
        </div>
      </div>
    </div>
  );
};

export default App;
