import { Thing } from "../index";

const behaviour = {
  name: "goTo", // assignable to locations
  methods: {
    goTo(ins: Thing): String {
      ins.game.setLocationByKey(ins.key);
      return `Moved to ${ins.name}.`;
    }
  },
  actions: {
    go: "goTo",
    move: "goTo",
    travel: "goTo"
  }
};

Object.freeze(behaviour);
export default behaviour;
