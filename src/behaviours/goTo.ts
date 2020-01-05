import { Thing } from "../index";

const behaviour = {
  name: "goTo", // assignable to locations
  methods: {
    travel(ins: Thing): String {
      ins.game.setLocationByKey(ins.key);
      return `Moved to ${ins.name}.`;
    }
  },
  actions: {
    go: "travel",
    move: "travel",
    travel: "travel"
  }
};

Object.freeze(behaviour);
export default behaviour;
