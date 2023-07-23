import type { Component } from "solid-js";
import {
  categoriesLow,
  categoriesTop,
  Dices,
  Player,
  Category,
  countOfEverything,
  extraCategory,
  trySpin,
} from "../game/game";
import css from "./PlayerScores.module.css";
import {
  addPlayerClicked,
  commitScoreClicked,
  playerNameChanged,
  removePlayerClicked,
  startGameClicked,
} from "../game/model";

type Props = {
  players: Player[];
  currentPlayer: number;
  dices: Dices | null;
};

export const PlayerScores: Component<Props> = (props) => {
  function cols() {
    return `150px${" 50px".repeat(props.players.length)}`;
  }

  return (
    <div class={css.root}>
      <div class={css.root}>
        {props.players.map((p, i) => {
          return (
            <div>
              <input
                type="text"
                value={p.name}
                onChange={(ev) => {
                  playerNameChanged({ n: i, name: ev.target.value });
                }}
              />
              <button type={"button"} onClick={() => removePlayerClicked(i)}>
                delete
              </button>
            </div>
          );
        })}
        <button type={"button"} onClick={() => addPlayerClicked()}>
          add new player
        </button>
        <br />
        <button type={"button"} onClick={() => startGameClicked()}>
          START
        </button>
      </div>
      <div classList={{ [css.scoreRow]: true }} style={{ "grid-template-columns": cols() }}>
        <p> Scores:</p>
        {props.players.map((p, i) => (
          <p title={p.name}>{i + 1}</p>
        ))}
      </div>
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
      <ExtraScoreRow players={props.players} currentPlayer={props.currentPlayer} category={extraCategory} />
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

  function cols() {
    return `150px${" 50px".repeat(props.players.length)}`;
  }

  return (
    <div classList={{ [css.scoreRow]: true }} style={{ "grid-template-columns": cols() }}>
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
                [css.matched]: true,
              }}
            >
              {match}
            </button>
          );
        }

        return (
          <button type={"button"} classList={{ [css.scoreCell]: true, [css.done]: true }}>
            {" "}
          </button>
        );
      })}
    </div>
  );
};

export const ExtraScoreRow: Component<{
  players: Player[];
  currentPlayer: number;
  category: Category;
}> = (props) => {
  const { name } = props.category;

  function cols() {
    return `150px${" 50px".repeat(props.players.length)}`;
  }

  return (
    <div classList={{ [css.scoreRow]: true }} style={{ "grid-template-columns": cols() }}>
      <p>{name}</p>
      {props.players.map((p, i) => {
        return (
          <button type={"button"} disabled classList={{ [css.scoreCell]: true, [css.done]: true }}>
            {p.scores[name]}
          </button>
        );
      })}
    </div>
  );
};
