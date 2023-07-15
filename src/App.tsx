import type { Component } from "solid-js";

import css from "./App.module.css";

const App: Component = () => {
  return (
    <div class={css.root}>
      <div class={css.content}>
        <h1>Yacht</h1>

        <h2>Count table</h2>
        <h2>desk</h2>
        <h3>throw animation</h3>
        <h3>kept dices</h3>
        <h3>thrown dices</h3>
      </div>
    </div>
  );
};

export default App;
