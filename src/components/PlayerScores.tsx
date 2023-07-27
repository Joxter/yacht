import type { Component } from "solid-js";
import { categoriesLow, categoriesTop, Category, extraCategory } from "../game/game";
import css from "./PlayerScores.module.css";
import { $countOfEverything, $currentPlayer, $players, commitScoreClicked } from "../game/model";
import { For } from "solid-js";
import { useUnit } from "effector-solid";

export const PlayerScores: Component = () => {
  let [players] = useUnit([$players]);

  function cols() {
    return `150px${" 50px".repeat(players().length)}`;
  }

  return (
    <div class={css.root}>
      <div classList={{ [css.scoreRow]: true }} style={{ "grid-template-columns": cols() }}>
        <p>Scores:</p>
        <For each={players()}>
          {(p) => {
            return <p title={p.name}>{p.icon}</p>;
          }}
        </For>
      </div>
      <div>
        {categoriesTop.map((category) => {
          return <ScoreRow category={category} />;
        })}
      </div>
      <ExtraScoreRow category={extraCategory} />
      <p>---</p>
      <div>
        <For each={categoriesLow}>
          {(category) => {
            return <ScoreRow category={category} />;
          }}
        </For>
      </div>
    </div>
  );
};

type ScoreRowProps = {
  category: Category;
};

export const ScoreRow: Component<ScoreRowProps> = (props) => {
  let [players, currentPlayer, countOfEverything] = useUnit([$players, $currentPlayer, $countOfEverything]);

  const { isMatch, name } = props.category;

  function cols() {
    return `150px${" 50px".repeat(players().length)}`;
  }

  return (
    <div classList={{ [css.scoreRow]: true }} style={{ "grid-template-columns": cols() }}>
      <p>{name}</p>
      {players().map((p, i) => {
        let isCaptured = p.scores[name] !== null;

        if (isCaptured) {
          return (
            <button type={"button"} disabled class={css.scoreCell}>
              {p.scores[name]}
            </button>
          );
        }

        let isCurrentPlayer = currentPlayer() === i;
        let count = countOfEverything();

        if (isCurrentPlayer && count) {
          const match = isMatch(count, p.scores) || 0;

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
  category: Category;
}> = (props) => {
  const { name } = props.category;

  let [players] = useUnit([$players]);

  function cols() {
    return `150px${" 50px".repeat(players().length)}`;
  }

  return (
    <div classList={{ [css.scoreRow]: true }} style={{ "grid-template-columns": cols() }}>
      <p>{name}</p>
      <For each={players()}>
        {(p, i) => {
          return (
            <button type={"button"} disabled classList={{ [css.scoreCell]: true, [css.done]: true }}>
              {p.scores[name]}
            </button>
          );
        }}
      </For>
    </div>
  );
};
