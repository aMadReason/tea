import { Game, ThingMaker } from "../dist/index.js";
import {
  help,
  examine,
  describe,
  take,
  goTo,
  usePortal
} from "../dist/behaviours/index.js";
import { gamedata } from "./gamedata";

const behaviours = [help, examine, describe, take, goTo, usePortal];
const G = new Game(); // manual tests
const game = new Game(); // resolve tests

behaviours.map(b => G.registerBehaviour(b));
const register = G.getRegister();
const locA = ThingMaker.make(gamedata.locations[0], register, G);
const locB = ThingMaker.make(gamedata.locations[1], register, G);
const thingA = ThingMaker.make(gamedata.things[0], register, G);
const thingB = ThingMaker.make(gamedata.things[1], register, G);

test("Initialise a Game", () => {
  expect(G).not.toBeUndefined();
});

test("Register game behaviours", () => {
  expect(G.getRegister().size).toBeGreaterThan(0);
});

test("Add locations manually and set active location.", () => {
  G.addLocation(locA).addLocation(locB);
  G.setLocationByKey(locA.key);
  expect(G.getLocations().length).toBeGreaterThan(1);
  expect(G.getActiveLocation()).toEqual(locA);
});

test("Add things manually.", () => {
  G.addThing(thingA).addThing(thingB);
  expect(G.getLocations().length).toBeGreaterThan(1);
  expect(G.getThingsByLocationKey(locA.key).length).toEqual(1);
  expect(G.getThingsByLocationKey(locB.key).length).toEqual(1);
});

test("Resolve Game Data", () => {
  behaviours.map(b => game.registerBehaviour(b));
  game.resolveGameData(gamedata);
  expect(G.getLocations().length).toBeGreaterThan(1);
  expect(G.getThingsByLocationKey(locA.key).length).toEqual(1);
  expect(G.getThingsByLocationKey(locB.key).length).toEqual(1);
});

test("Resolved Game - test command: use cup", () => {
  const res = game.command("describe cup.");
  expect(res.response()).toEqual(
    `A small golden cup rests on it's side on the floor.`
  );
});

test("Resolved Game - test command: help with cup", () => {
  const res = game.command("help with cup");
  expect(res.response()).toEqual(
    `You can describe, help, examine, take, pick, drop, leave or put the golden cup.`
  );
});

test("Resolved Game - test command: help with green book", () => {
  const res = game.command("help with green book");
  expect(res.response()).toEqual(
    `You can examine, take or drop the green book.`
  );
});

test("Resolved Game - test command: examine book", () => {
  const res = game.command("examine book");
  expect([
    `Please be more descriptive and reference "red book" or "green book".`
  ]).toContain(res.response());
});

test("Resolved Game - test command: take cup", () => {
  const res = game.command("take cup");
  expect([`golden cup added to inventory.`]).toContain(res.response());
});

test("Resolved Game - test command: use door", () => {
  const res = game.command("use door");
  expect([`Moved to deck.`, `Moved to cabin.`]).toContain(res.response());
});

test("Resolved Game - test command: drop cup", () => {
  const res = game.command("drop cup");
  expect([`golden cup removed from inventory.`]).toContain(res.response());
});
