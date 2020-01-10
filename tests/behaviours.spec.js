import { gamedata } from "./gamedata";
import { Game } from "../src/index.ts";
import { describe, help, examine, goTo } from "../src/behaviours/index.ts";

const bGame = new Game();
bGame.registerBehaviour([describe, help, examine, gamedata, goTo]);
bGame.resolveGameData(gamedata);

const cup = bGame.getThingsByNoun("cup")[0];
const deck = bGame.getLocationByKey("deck");
const cabin = bGame.getLocationByKey("cabin");

test("Test 'describe' behaviour", () => {
  const res = cup.callMethod("describe");
  expect(res).toMatch(/A small golden cup rests on it's side on the floor./);
});

test("Test 'examine' behaviour", () => {
  const res = cup.callMethod("examine");
  expect(res).toMatch(/The golden cup is made of plastic... disapointing./);
});

test("Test 'help' behaviour", () => {
  const res = cup.callMethod("help");
  expect(res).toMatch(
    /The golden cup has the following actions available; describe, help and examine./
  );
});

test("Test 'goTo' behaviour", () => {
  const res = cabin.callMethod("goTo");
  expect(res).toMatch(/Moved to cabin./);
});
