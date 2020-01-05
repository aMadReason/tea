import { ThingMaker } from "../dist/index.js";
import { describe, help, examine } from "../dist/behaviours/index.js";

const behaviourReg = new Map();
behaviourReg.set(describe.name, describe);
behaviourReg.set(help.name, help);
behaviourReg.set(examine.name, examine);

const testThing = {
  noun: "cup",
  locationKey: null,
  described: "golden cup",
  behaviours: ["describe", "help", "examine"],
  properties: {
    stateKey: "initial",
    descriptions: {
      initial: "A small golden cup rests on it's side on the floor.",
      default: "A small golden cup.",
      dropped: "The golden cup you left here sits on the floor."
    },
    details: {
      default: "The {name} is made of plastic... disapointing."
    }
  }
};

test("Test 'describe' behaviour", () => {
  const t = ThingMaker.make(testThing, behaviourReg);
  const res = t.getMethod("describe")();
  expect(res).toMatch(/A small golden cup rests on it's side on the floor./);
});

test("Test 'examine' behaviour", () => {
  const t = ThingMaker.make(testThing, behaviourReg);
  const res = t.getMethod("examine")();
  expect(res).toMatch(/The golden cup is made of plastic... disapointing./);
});

test("Test 'help' behaviour", () => {
  const t = ThingMaker.make(testThing, behaviourReg);
  const res = t.getMethod("help")();
  expect(res).toMatch(/You can describe, help or examine the golden cup./);
});
