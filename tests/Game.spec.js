import { Game, ThingMaker } from "../src/index.ts";
import { help, examine, describe, take, goTo, usePortal } from "../src/behaviours/index.ts";
import { gamedata } from "./gamedata";

const behaviours = [help, examine, describe, take, goTo, usePortal];
const G = new Game(); // manual tests
const game = new Game(); // resolve tests

behaviours.map(b => G.registerBehaviour(b));
const register = G.getRegister();
const characterA = ThingMaker.make(gamedata.characters[0], register, G);
const locA = ThingMaker.make(gamedata.locations[0], register, G);
const locB = ThingMaker.make(gamedata.locations[1], register, G);
const thingA = ThingMaker.make(gamedata.things[1], register, G);
const thingB = ThingMaker.make(gamedata.things[2], register, G);
const thingC = ThingMaker.make(gamedata.things[0], register, G);

test("Initialise a Game", () => {
  expect(G).not.toBeUndefined();
});

test("Register game behaviours", () => {
  expect(G.getRegister().size).toBeGreaterThan(0);
});

test("Add characters manually.", () => {
  G.addCharacter(characterA);
  expect(G.getCharacters().length).toBeGreaterThanOrEqual(1);
});

test("Set player manually.", () => {
  let player = G.getActivePlayer();
  expect(player).toBeFalsy();
  G.setPlayerKey(characterA.key);
  player = G.getActivePlayer();
  expect(player.key).toMatch(/peter/);
});

test("Add locations manually and set active location.", () => {
  G.addLocation(locA).addLocation(locB);
  G.setLocationByKey(locA.key);
  expect(G.getLocations().length).toBeGreaterThan(1);
  expect(G.getActiveLocation()).toEqual(locA);
});

test("Add things manually.", () => {
  G.addThing(thingA)
    .addThing(thingB)
    .addThing(thingC);
  expect(G.getLocations().length).toBeGreaterThanOrEqual(1);
  expect(G.getThingsByInsideKey(locA.key).length).toBeGreaterThanOrEqual(1);
  expect(G.getThingsByInsideKey(locB.key).length).toBeGreaterThanOrEqual(1);
});

test("Get things inside player", () => {
  let player = G.getActivePlayer();
  const inventory = G.getThingsByInsideKey(player.key);
  expect(inventory.length).toBeGreaterThanOrEqual(1);
});

test("Resolve Game Data", () => {
  behaviours.map(b => game.registerBehaviour(b));
  game.resolveGameData(gamedata);
  expect(G.getLocations().length).toBeGreaterThan(1);
  expect(G.getThingsByInsideKey(locA.key).length).toEqual(1);
  expect(G.getThingsByInsideKey(locB.key).length).toEqual(1);
});
