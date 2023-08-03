import type { Component } from "solid-js";
import css from "./DicesAndCup.module.css";
import {
  $dicesWithPositions,
  $isSpinning,
  $noMoreShakes,
  discardDiceClicked,
  keepDiceClicked,
  spinDicesClicked,
  throwDicesClicked,
} from "../game/model";
import { Dice } from "../game/game";
import cup from "./cup.webp";
import { useUnit } from "effector-solid";

export const DicesAndCup: Component = () => {
  let [dices, isSpinning, noMoreShakes] = useUnit([$dicesWithPositions, $isSpinning, $noMoreShakes]);

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

export const DiceComp: Component<DiceCompProps> = (props) => {
  function onCLick() {
    if (props.dice.state === "table") {
      keepDiceClicked({ diceNumber: props.dice.id });
    } else if (props.dice.state === "kept") {
      discardDiceClicked({ diceNumber: props.dice.id });
    }
  }

  return (
    <button class={css.dice} style={{ transform: props.dice.coords }} onClick={onCLick}>
      {props.dice.state === "spinning" ? <div class={css.spinner}></div> : props.dice.val}
    </button>
  );
};
