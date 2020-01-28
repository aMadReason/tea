import { iBehaviour } from "../index";

// reveals more detailed details about the thing

const examine: iBehaviour = {
  name: "lookInside",
  properties: {
    stateKey: "",
    details: {
      default: "There is nothing remarkable about the {name}"
    }
  },
  methods: {
    lookInside(ins, cmd = null): string {
      const join = cmd.joins[0] || "inside";
      const inside = ["inside", "in", "within"].indexOf(join) > -1;

      if (!inside) return `There is nothing ${join} the ${ins.name}.`;

      const things = ins.game.getThingsByInsideKey(ins.key).map(i => i.name);

      if (Array.isArray(things) && things.length === 0) {
        return `There is nothing ${join} the ${ins.name}.`;
      }

      if (things.length === 1) return `There is a ${things.join(", ")} ${join} the ${ins.name}.`;

      const last = things.pop();
      return `There is a ${things.join(", a ")} and  a ${last} ${join} the ${ins.name}.`;
    }
  },
  actions: {
    look: "lookInside"
  }
};

Object.freeze(examine);
export default examine;
