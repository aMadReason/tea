import { ThingMaker } from "../dist/index";
import { describe, help } from "../dist/behaviours/index";

const testThing = {
  noun: "cup",
  locationKey: null,
  described: "golden cup",
  behaviours: ["describe"],
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

test("Initialise a Thing via ThingMaker", () => {
  const behaviourReg = new Map();
  behaviourReg.set(describe.name, describe);
  behaviourReg.set(help.name, help);

  const t = ThingMaker.make(testThing, behaviourReg);
  const result = t.getMethod("describe")();

  expect(result.indexOf(t.name) > -1).toBeTruthy();
});
