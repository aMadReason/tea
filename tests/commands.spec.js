import { gamedata } from "./gamedata";
import { Game } from "../src/index.ts";
import {
  describe,
  help,
  examine,
  goTo,
  take,
  drop,
  converse,
  lookInside
} from "../src/behaviours/index.ts";

const G = new Game();
G.addPatterns({ golden: "Adjective", note: "Noun" });
G.registerBehaviour([describe, help, examine, gamedata, goTo, take, drop, converse, lookInside]);
G.resolveGameData(gamedata);

test("examine book", () => {
  G.setLocationByKey("cabin");
  const cmd = G.command("examine book");
  const res = cmd.response();
  expect(res).toMatch(/Please be more descriptive and reference "red book" or "green book"./);
});

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
  expect(res).toMatch(/Unknown action, unable to eat rope./);
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

test("say hello to Bob", () => {
  G.setLocationByKey("cabin");
  const res = G.command("say hello to Bob").response();
  expect(res).toMatch(/Bob: Hello./);
});

test("look inside green book", () => {
  G.setLocationByKey("cabin");
  const res = G.command("look inside green book").response();
  expect(res).toMatch(/There is a note inside the green book./);
});

test("look in green book", () => {
  G.setLocationByKey("cabin");
  const res = G.command("look in green book").response();
  expect(res).toMatch(/There is a note in the green book./);
});

test("look within green book", () => {
  G.setLocationByKey("cabin");
  const res = G.command("look within green book").response();
  expect(res).toMatch(/There is a note within the green book./);
});

test("open green book (assigned action)", () => {
  G.setLocationByKey("cabin");
  const res = G.command("open green book").response();
  expect(res).toMatch(/There is a note inside the green book./);
});

test("look behind green book", () => {
  G.setLocationByKey("cabin");
  const res = G.command("look behind green book").response();
  expect(res).toMatch(/There is nothing behind the green book./);
});

test("take the note from the green book", () => {
  G.setLocationByKey("cabin");
  const res = G.command("take the note from the green book").response();
  expect(res).toMatch(/The note was moved to inventory./);
});

test("drop note in green book", () => {
  G.setLocationByKey("cabin");
  let res = G.command("drop note in green book").response();
  expect(res).toMatch(/The note was left in the green book./);
  res = G.command("drop note in green book").response();
  expect(res).toMatch(/There is no note in the inventory to leave in the green book./);
});

test("conditional topic: tell Bob hello", () => {
  G.setLocationByKey("cabin");
  const res = G.command("tell Bob hello").response();
  expect(res).toMatch(/Bob: Hello/);
});

test("conditional topic: ask Bob about key", () => {
  G.setLocationByKey("cabin");
  const res = G.command("ask Bob about key").response();
  expect(res).toMatch(/There is no response./);
});

test("conditional topic: tell Bob about key", () => {
  G.setLocationByKey("cabin");
  const res = G.command("tell Bob about key").response();
  expect(res).toMatch(/There is no response./);
});

test("conditional topic: answer yes to bob", () => {
  G.setLocationByKey("cabin");
  const res = G.command("answer yes to bob").response();
  expect(res).toMatch(/Bob: .../);
});
