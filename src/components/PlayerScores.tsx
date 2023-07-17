import type { Component } from "solid-js";
import { Scores, categoriesLow, categoriesTop, Dices, Player, Category } from "../game/game";
import css from "./PlayerScores.module.css";
import { commitScoreClicked } from "../game/model";

type Props = {
  players: Player[];
  currentPlayer: number;
  dices: Dices | null;
};

export const PlayerScores: Component<Props> = (props) => {
  return (
    <div class={css.root}>
      Scores:
      <div>
        {categoriesTop.map((category) => {
          return (
            <ScoreRow
              dices={props.dices}
              players={props.players}
              currentPlayer={props.currentPlayer}
              category={category}
            />
          );
        })}
      </div>
      <p>---</p>
      <div>
        {categoriesLow.map((category) => {
          return (
            <ScoreRow
              dices={props.dices}
              players={props.players}
              currentPlayer={props.currentPlayer}
              category={category}
            />
          );
        })}
      </div>
    </div>
  );
};

type ScoreRowProps = {
  players: Player[];
  dices: Dices | null;
  currentPlayer: number;
  category: Category;
};

export const ScoreRow: Component<ScoreRowProps> = (props) => {
  const { isMatch, name } = props.category;

  return (
    <div classList={{ [css.scoreRow]: true }}>
      <p>{name}</p>
      {props.players.map((p, i) => {
        if (p.scores[name]) {
          return <p class={css.scoreCell}>{p.scores[name]}</p>;
        }

        const match = props.dices !== null && props.currentPlayer === i ? isMatch(props.dices, p.scores) : false;

        if (match) {
          return (
            <button
              type={"button"}
              onClick={() => commitScoreClicked({ score: match, name: name })}
              class={css.matched + " " + css.scoreCell}
            >
              {match}
            </button>
          );
        }
        return <p class={css.scoreCell}>-</p>;
      })}
    </div>
  );
};
