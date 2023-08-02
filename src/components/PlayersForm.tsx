import type { Component } from "solid-js";
import { playerForm } from "../game/model";
import css from "./PlayersForm.module.css";
import { For } from "solid-js";
import { useUnit } from "effector-solid";

export const PlayersForm: Component = () => {
  let [players, formError] = useUnit([playerForm.$players, playerForm.$formError]);

  return (
    <div class={css.root}>
      <div class={css.list}>
        <For each={players()}>
          {(p, i) => {
            return (
              <div>
                <div class={css.player}>
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
                </div>
                <p class={css.error}>{p.error || ""}</p>
              </div>
            );
          }}
        </For>
      </div>
      <div style={{ "text-align": "center" }}>
        <button type={"button"} onClick={() => playerForm.addPlayerClicked()}>
          add new player
        </button>
      </div>
      <div style={{ "text-align": "right" }}>
        <button type={"button"} onClick={() => playerForm.formSubmitted()}>
          START
        </button>
      </div>
      <p class={css.error}>{formError()}</p>
    </div>
  );
};
