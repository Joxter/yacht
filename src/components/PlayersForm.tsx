import type { Component } from "solid-js";
import {
  $canStartNewGame,
  $players,
  addPlayerClicked,
  playerNameChanged,
  removePlayerClicked,
  startGameClicked,
} from "../game/model";
import { For } from "solid-js";
import { useUnit } from "effector-solid";

export const PlayersForm: Component = () => {
  let [players, canStartNewGame] = useUnit([$players, $canStartNewGame]);

  return (
    <div>
      <For each={players()}>
        {(p, i) => {
          return (
            <div>
              <input
                type="text"
                value={p.name}
                onInput={(ev) => {
                  playerNameChanged({ n: i(), name: ev.target.value });
                }}
              />
              <button type={"button"} onClick={() => removePlayerClicked(i())}>
                delete
              </button>
            </div>
          );
        }}
      </For>
      <button type={"button"} onClick={() => addPlayerClicked()}>
        add new player
      </button>
      <br />
      <button type={"button"} onClick={() => startGameClicked()} disabled={!canStartNewGame()}>
        START
      </button>
    </div>
  );
};
