import type { Component } from "solid-js";
import css from "./FiveDices.module.css";
import { FiveStateDice, StateDice } from "../game/model";

type Props = {
  dices: FiveStateDice;
};

export const FiveDices: Component<Props> = (props) => {
  return (
    <div class={css.root}>
      <h3>kept dices</h3>
      <h3>table dices</h3>
      <h3>box dices</h3>
      {props.dices.map((d) => {
        return <DiceComp dice={d} />;
      })}
    </div>
  );
};

type DiceCompProps = {
  dice: StateDice;
};

export const DiceComp: Component<DiceCompProps> = (props) => {
  let y = {
    kept: 0,
    table: 50 + 8,
    box: 50 + 8 + 50 + 8,
    spinning: 50 + 8 + 50 + 8,
  }[props.dice.state];

  let x = props.dice.pos * 50 + (props.dice.pos - 1) * 8;

  return (
    <button class={css.dice} style={{ transform: `translateX(${x}px) translateY(${y}px)` }}>
      {props.dice.state === "spinning" ? <div class={css.spinner}></div> : props.dice.val}
    </button>
  );
};
