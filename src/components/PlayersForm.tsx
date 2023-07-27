import type { Component } from "solid-js";
import { playerForm } from "../game/model";
import { For } from "solid-js";
import { useUnit } from "effector-solid";

export const PlayersForm: Component = () => {
  let [players, formError] = useUnit([playerForm.$players, playerForm.$formError]);

  return (
    <div>
      <For each={players()}>
        {(p, i) => {
          return (
            <div>
              <select
                name=""
                value={p.icon}
                onChange={(ev) => {
                  playerForm.iconChanged({ n: i(), icon: ev.target.value });
                }}
              >
                <option value="">-</option>
                {playerForm.ICONS.map((val) => {
                  return <option value={val}>{val}</option>;
                })}
              </select>
              <input
                type="text"
                value={p.name}
                onInput={(ev) => {
                  playerForm.nameChanged({ n: i(), name: ev.target.value });
                }}
              />
              <button type={"button"} onClick={() => playerForm.removePlayerClicked(i())}>
                delete
              </button>
              <p>error: {p.error}</p>
            </div>
          );
        }}
      </For>
      <button type={"button"} onClick={() => playerForm.addPlayerClicked()}>
        add new player
      </button>
      <br />
      <button type={"button"} onClick={() => playerForm.formSubmitted()}>
        START
      </button>
      <p>{formError()}</p>
    </div>
  );
};
