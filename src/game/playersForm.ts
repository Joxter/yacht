import { createEvent, createStore, sample } from "effector";

export function createPlayersForm() {
  const ICONS = ["❤️", "🎄", "🤗", "🤞", "🙏", "👍", "😜"] as const;
  let $players = createStore([{ name: "", icon: "👍", error: "" }]);
  let $formError = createStore("");

  let addPlayerClicked = createEvent();
  let removePlayerClicked = createEvent<number>();
  let nameChanged = createEvent<{ n: number; name: string }>();
  let iconChanged = createEvent<{ n: number; icon: string }>();
  let formSubmitted = createEvent();
  let playersApplied = createEvent<{ name: string; icon: string }[]>();

  $players
    .on(addPlayerClicked, (players) => {
      let icons = ICONS.filter((i) => !players.some((p) => p.icon === i));
      let newIcon = icons[Math.floor(Math.random() * icons.length)];

      return [...players, { name: "", icon: newIcon, error: "" }];
    })
    .on(removePlayerClicked, (players, n) => {
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

        if (players.filter((p) => p.icon === player.icon).length > 1) {
          return { ...player, error: "Please, choose an unique icon" };
        }

        return player;
      });
    });

  sample({
    source: $players,
    clock: formSubmitted,
    filter: (players) => players.length < 2,
    fn: () => "should be at least 2 players:(",
    target: $formError,
  });

  sample({
    source: [$players, $formError] as const,
    clock: formSubmitted,
    filter: ([players, formError]) => players.length >= 2 && formError === "",
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
