import { gamedata } from "./gamedata";
import { Game } from "../src/index.ts";
import { describe, help, examine, goTo, take } from "../src/behaviours/index.ts";

const G = new Game();
G.registerBehaviour([describe, help, examine, gamedata, goTo, take]);
G.resolveGameData(gamedata);

test("examine cup", () => {
  G.setLocationByKey("cabin");
  const cmd = G.command("examine cup");
  const res = cmd.response();
  expect(res).toMatch(/The golden cup is made of plastic... disapointing./);
});

test("go to deck", () => {
  G.setLocationByKey("cabin");
  const cmd = G.command("go to deck");
  const res = cmd.response();
  expect(res).toMatch(/Moved to deck./);
});

test("take rope", () => {
  G.setLocationByKey("deck");
  const res = G.command("take rope").response();
  expect(res).toMatch(/Rope added to inventory./);
});

test("drop rope", () => {
  G.setLocationByKey("cabin");
  const res = G.command("drop rope").response();
  expect(res).toMatch(/Rope removed from inventory./);
});

test("inventory", () => {
  G.setLocationByKey("cabin");
  G.command("take cup").response();
  const res = G.command("inventory").response();
  expect(res).toMatch(/Inventory contains rope./);
});
