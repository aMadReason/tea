import { Game, ThingMaker } from "../src/index.ts";
import { help, examine, describe, take, goTo, usePortal } from "../src/behaviours/index.ts";
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
  expect(G.getThingsByInsideKey(locA.key).length).toEqual(1);
  expect(G.getThingsByInsideKey(locB.key).length).toEqual(1);
});

test("Resolve Game Data", () => {
  behaviours.map(b => game.registerBehaviour(b));
  game.resolveGameData(gamedata);
  expect(G.getLocations().length).toBeGreaterThan(1);
  expect(G.getThingsByInsideKey(locA.key).length).toEqual(1);
  expect(G.getThingsByInsideKey(locB.key).length).toEqual(1);
});
