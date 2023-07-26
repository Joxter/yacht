import type { Component } from "solid-js";
import css from "./FiveDices.module.css";
import {
  $dices,
  $isSpinning,
  $noMoreShakes,
  discardDiceClicked,
  keepDiceClicked,
  spinDicesClicked,
  throwDicesClicked,
} from "../game/model";
import { Dice } from "../game/game";
import cup from "./cup.png";
import { useUnit } from "effector-solid";

export const FiveDices: Component = () => {
  let [dices, isSpinning, noMoreShakes] = useUnit([$dices, $isSpinning, $noMoreShakes]);

  return (
    <div class={css.root}>
      <div class={css.keep}></div>
      <DiceComp dice={dices()[0]} />
      <DiceComp dice={dices()[1]} />
      <DiceComp dice={dices()[2]} />
      <DiceComp dice={dices()[3]} />
      <DiceComp dice={dices()[4]} />
      <button
        classList={{ [css.cupBtn]: true, [css.shaking]: isSpinning(), [css.noShake]: noMoreShakes() }}
        onClick={() => {
          if (isSpinning()) {
            throwDicesClicked();
          } else {
            spinDicesClicked();
          }
        }}
      >
        <img class={css.cup} src={cup} alt="cup" />
      </button>
    </div>
  );
};

type DiceCompProps = {
  dice: Dice;
};

const OFFSET = {
  left: 8,
  top: 6,
};

export const DiceComp: Component<DiceCompProps> = (props) => {
  function st() {
    if (props.dice.state === "cup" || props.dice.state === "spinning") {
      return `translateX(${OFFSET.left + 110}px) translateY(${OFFSET.left + 130}px)`;
    }

    let y = {
      kept: 0,
      table: 50 + 12,
    }[props.dice.state];

    let x = props.dice.pos * 50 + props.dice.pos * 8;

    return `translateX(${OFFSET.left + x}px) translateY(${OFFSET.top + y}px)`;
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
