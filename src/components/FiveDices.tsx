import type { Component } from "solid-js";
import css from "./FiveDices.module.css";
import { discardDiceClicked, FiveStateDice, keepDiceClicked, StateDice } from "../game/model";

type Props = {
  dices: FiveStateDice;
};

export const FiveDices: Component<Props> = (props) => {
  return (
    <div class={css.root}>
      <h3>kept dices</h3>
      <h3>table dices</h3>
      <h3>box dices</h3>
      <DiceComp dice={props.dices[0]} />
      <DiceComp dice={props.dices[1]} />
      <DiceComp dice={props.dices[2]} />
      <DiceComp dice={props.dices[3]} />
      <DiceComp dice={props.dices[4]} />
    </div>
  );
};

type DiceCompProps = {
  dice: StateDice;
};

export const DiceComp: Component<DiceCompProps> = (props) => {
  function st() {
    let y = {
      kept: 0,
      table: 50 + 8,
      box: 50 + 8 + 50 + 8,
      spinning: 50 + 8 + 50 + 8, // todo move to css classes: .kept .table, ...
    }[props.dice.state];

    let x = props.dice.pos * 50 + (props.dice.pos - 1) * 8; // todo move to css classes: .pos-0, .pos-1, ...

    return `translateX(${x}px) translateY(${y}px)`;
  }

  function onCLick() {
    if (props.dice.state === "table") {
      keepDiceClicked({ diceNumber: props.dice.pos });
    } else if (props.dice.state === "kept") {
      discardDiceClicked({ diceNumber: props.dice.pos });
    }
  }

  return (
    <button class={css.dice} style={{ transform: st() }} onClick={onCLick}>
      {props.dice.state === "spinning" ? <div class={css.spinner}></div> : props.dice.val}
    </button>
  );
};
