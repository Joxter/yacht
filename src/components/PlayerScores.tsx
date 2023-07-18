import type { Component } from "solid-js";
import { Scores, categoriesLow, categoriesTop, Dices, Player, Category, countOfEverything } from "../game/game";
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
        let isCaptured = p.scores[name] !== null;

        if (isCaptured) {
          return (
            <button type={"button"} disabled class={css.scoreCell}>
              {p.scores[name]}
            </button>
          );
        }

        let isCurrentPlayer = props.currentPlayer === i;

        if (isCurrentPlayer && props.dices) {
          // todo remove countOfEverything(props.dices) from view
          const match = isMatch(countOfEverything(props.dices), p.scores) || 0;

          return (
            <button
              type={"button"}
              onClick={() => commitScoreClicked({ score: match, name: name })}
              classList={{
                [css.scoreCell]: true,
                [css.matched]: !isCaptured,
              }}
            >
              {match}
            </button>
          );
        }

        return (
          <button type={"button"} disabled class={css.scoreCell}>
            {" "}
          </button>
        );
      })}
    </div>
  );
};
