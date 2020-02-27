import { Game } from "../src/index.ts";
import {
  describe,
  help,
  examine,
  goTo,
  take,
  lookInside,
  takeInside,
  converse
} from "../src/behaviours/index.ts";
import { gamedata } from "./data.js";

const G = new Game();

G.addPatterns({ golden: "Adjective" });
G.registerBehaviour([
  describe,
  help,
  examine,
  gamedata,
  goTo,
  take,
  lookInside,
  takeInside,
  converse
]);

G.resolveGameData(gamedata);
G.setLocationByKey("cabin");
const scene = document.querySelector("tea-scene");
scene.game = G;
