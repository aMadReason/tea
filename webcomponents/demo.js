import { Game, goTo, take, drop, converse, lookInside, usePortal } from "../dist/index";
import { gamedata } from "../tests/gamedata";

(() => {
  const G = new Game();
  G.addPatterns({ golden: "Adjective", note: "Noun", me: "Ignore" });
  G.registerBehaviour([goTo, take, drop, converse, lookInside, usePortal]);
  G.resolveGameData(gamedata);

  const gameEl = document.querySelector("tea-game-el");

  
  gameEl.setGame(G);
  console.log(gameEl);
})();


