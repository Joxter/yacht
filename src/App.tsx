import type { Component } from "solid-js";
import { Show } from "solid-js";
import css from "./App.module.css";
import { PlayerScores } from "./components/PlayerScores";
import { useUnit } from "effector-solid";
import { $game, $editable, startGameClicked, $canStartNewGame, $players, $currentPlayer } from "./game/model";
import { DicesAndCup } from "./components/DicesAndCup";
import { PlayersForm } from "./components/PlayersForm";
import { GameStatuses } from "./game/game";

const App: Component = () => {
  let [game, editable, canStartNewGame, players, currentPlayer] = useUnit([
    $game,
    $editable,
    $canStartNewGame,
    $players,
    $currentPlayer,
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
              <DicesAndCup />
              <ul style={{ "list-style": "none", padding: 0 }}>
                {players().map((p, i) => {
                  let isCurrent = currentPlayer() === i;

                  return (
                    <li style={{ "font-weight": isCurrent ? "bold" : "initial" }}>
                      {p.icon} {p.name}
                    </li>
                  );
                })}
              </ul>
              <p style={{}}>stage: {JSON.stringify(game().stage)}</p>
            </div>
          </Show>
        </div>
      </div>
    </div>
  );
};

export default App;
