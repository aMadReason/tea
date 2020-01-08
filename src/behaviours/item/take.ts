import { Thing } from "../index";

const behaviour = {
  name: "take",
  properties: {},
  methods: {
    take(ins: Thing): String {
      const key = ins.insideKey;
      if (key === null) return `${ins.name} is already in your inventory.`;
      ins.setInsideKey(null);

      const stateKey = ins.getProp("stateKey");
      if (stateKey && stateKey === "initial") {
        ins.setProp("stateKey", "default");
      }

      return `${ins.name} added to inventory.`.replace(/^\w/, c => c.toUpperCase());
    },
    drop(ins: Thing): String {
      const key = ins.insideKey;
      const loc = ins.game.getActiveLocation();
      if (key) return `${ins.name} is not in your inventory.`;
      ins.setInsideKey(loc.key);

      const descriptions = ins.getProp("descriptions");
      if (descriptions && "dropped" in descriptions) {
        ins.setProp("stateKey", "dropped");
      }

      return `${ins.name} removed from inventory.`.replace(/^\w/, c => c.toUpperCase());
    }
  },
  actions: {
    take: "take",
    pick: "take",
    drop: "drop",
    leave: "drop",
    put: "drop"
  }
};

Object.freeze(behaviour);
export default behaviour;