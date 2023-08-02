import { createEvent, createStore, sample } from "effector";
import { MaxPlayerCount } from "./game";

const NOUNS = ["car", "truck", "doll", "ball", "bear", "puzzle", "train", "sandbox", "bike", "pen", "balloon"];

const ADJECTIVES = [
  "red",
  "green",
  "blue",
  "yellow",
  "black",
  "white",
  "dark",
  "light",
  "brown",
  "gray",
  "pink",
  "purple",
  "orange",
  "violet",
];

function randomElem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomName(): string {
  return `${randomElem(ADJECTIVES)} ${randomElem(NOUNS)}`;
}

export function createPlayersForm() {
  const ICONS = ["❤️", "🎄", "🤗", "🤞", "🙏", "👍", "😜"] as const;
  let $players = createStore([{ name: getRandomName(), icon: "👍", error: "" }]);
  let $formError = createStore("");

  let addPlayerClicked = createEvent();
  let removePlayerClicked = createEvent<number>();
  let nameChanged = createEvent<{ n: number; name: string }>();
  let iconChanged = createEvent<{ n: number; icon: string }>();
  let formSubmitted = createEvent();
  let playersApplied = createEvent<{ name: string; icon: string }[]>();

  $players
    .on(addPlayerClicked, (players) => {
      if (players.length >= MaxPlayerCount) return players;

      let icons = ICONS.filter((i) => !players.some((p) => p.icon === i));
      let newIcon = randomElem(icons) || "🚫";

      let randomName = getRandomName();
      while (players.some((p) => p.name === randomName)) {
        randomName = getRandomName();
      }

      return [...players, { name: randomName, icon: newIcon, error: "" }];
    })
    .on(removePlayerClicked, (players, n) => {
      if (players.length === 0) return players;
      let newPlayers = players.slice();
      newPlayers.splice(n, 1);
      return newPlayers;
    })
    .on(nameChanged, (players, { n, name }) => {
      let newPlayers = players.slice();
      newPlayers[n].name = name;

      return newPlayers;
    })
    .on(iconChanged, (players, { n, icon }) => {
      let newPlayers = players.slice();
      newPlayers[n].icon = icon;

      return newPlayers;
    })
    .on(formSubmitted, (players) => {
      return players.map((player) => {
        if (!player.icon) {
          return { ...player, error: "You need an icon for a comfortable game" };
        }
        if (!player.name) {
          return { ...player, error: "You need name for a comfortable game" };
        }

        if (players.filter((p) => p.icon === player.icon).length > 1) {
          return { ...player, error: "Please, choose an unique icon" };
        }

        return { ...player, error: "" };
      });
    });

  sample({
    source: $players,
    clock: formSubmitted,
    fn: (players) => {
      return players.length < 2 ? "should be at least 2 players:(" : "";
    },
    target: $formError,
  });

  sample({
    source: [$players, $formError] as const,
    clock: formSubmitted,
    filter: ([players, formError]) => players.length >= 2 && formError === "" && players.every((p) => p.error === ""),
    fn: ([players]) => players,
    target: playersApplied,
  });

  return {
    ICONS,
    $players,
    $formError,
    formSubmitted,
    playersApplied,
    nameChanged,
    iconChanged,
    addPlayerClicked,
    removePlayerClicked,
  };
}
