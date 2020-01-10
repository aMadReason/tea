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

test("eat rope", () => {
  G.setLocationByKey("cabin");
  const res = G.command("eat rope").response();
  expect(res).toMatch(/Unable to eat rope./);
});

test("eat burger", () => {
  G.setLocationByKey("cabin");
  const res = G.command("eat burger").response();
  expect(res).toMatch(/No "burger" found in inventory or cabin./);
});

test("murgjdkdk djdjdjd", () => {
  G.setLocationByKey("cabin");
  const res = G.command("murgjdkdk djdjdjd").response();
  expect(res).toMatch(/Invalid command: murgjdkdk djdjdjd./);
});

test("help with cabin", () => {
  G.setLocationByKey("cabin");
  const res = G.command("help with cabin").response();
  expect(res).toMatch(
    /The cabin has the following actions available; describe, help, examine, go, move and travel./
  );
});

test("locations", () => {
  const res = G.command("locations").response();
  expect(res).toMatch(/Locations available: cabin and deck./);
});

test("locations", () => {
  const res = G.command("locations").response();
  expect(res).toMatch(/Locations available: cabin and deck./);
});

test("location", () => {
  G.setLocationByKey("cabin");
  const res = G.command("location").response();
  expect(res).toMatch(/The current location is the cabin./);
});
// test("inventory", () => {
//   G.setLocationByKey("cabin");
//   G.command("take cup").response();
//   const res = G.command("inventory").response();
//   expect(res).toMatch(/Inventory contains rope./);
// });

// test("location", () => {
//   const res = G.command("location").response();
//   expect(res).toMatch(/You are in the 'cabin'./);
// });

// test("locations", () => {
//   const res = G.command("locations").response();
//   expect(res).toMatch(/You are in the 'cabin', and can go to the 'deck'./);
// });
