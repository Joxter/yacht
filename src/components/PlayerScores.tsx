import type { Component } from "solid-js";
import { Scores, categoriesLow, categoriesTop, Dices, Player, Category } from "../game/game";
import css from "./PlayerScores.module.css";

type Props = {
  players: Player[];
  dices: Dices | null;
};

export const PlayerScores: Component<Props> = (props) => {
  return (
    <div class={css.root}>
      Scores:
      <div>
        {categoriesTop.map((category) => {
          return <ScoreRow dices={props.dices} players={props.players} category={category} />;
        })}
      </div>
      <p>---</p>
      <div>
        {categoriesLow.map((category) => {
          return <ScoreRow dices={props.dices} players={props.players} category={category} />;
        })}
      </div>
    </div>
  );
};

type ScoreRowProps = {
  players: Player[];
  dices: Dices | null;
  category: Category;
};

export const ScoreRow: Component<ScoreRowProps> = (props) => {
  const { isMatch, name } = props.category;

  return (
    <div classList={{ [css.scoreRow]: true }}>
      <p>{name}</p>
      {props.players.map((p) => {
        if (p.scores[name]) {
          return <p class={css.scoreCell}>{p.scores[name]}</p>;
        }

        const match = props.dices !== null ? isMatch(props.dices, p.scores) : false;

        if (match) {
          return <p class={css.matched + " " + css.scoreCell}>{match}</p>;
        }
        return <p class={css.scoreCell}>-</p>;
      })}
    </div>
  );
};
