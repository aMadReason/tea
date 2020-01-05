import { Thing } from "../dist/index";
import { describe } from "../dist/behaviours/index";

test("Initialise a Thing", () => {
  const t = new Thing({
    key: "cup",
    noun: "cup",
    described: "red cup"
  });
  expect(t).not.toBeUndefined();
});

test("Add Behviour To A Thing Manually", () => {
  const t = new Thing({
    key: "cup",
    noun: "cup",
    described: "red cup"
  });

  t.addBehaviour(describe);

  expect(t.methods.size).toBeGreaterThan(0);
  expect(t.properties.size).toBeGreaterThan(0);
  expect(t.actions.size).toBeGreaterThan(0);

  const result = t.getMethod("describe")();

  expect(result.indexOf(t.name) > -1).toBeTruthy();
  expect(t.getProp("stateKey")).toBeDefined();
});
