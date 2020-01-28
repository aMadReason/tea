import { iBehaviour } from "../index";

const behaviour: iBehaviour = {
  name: "take",
  properties: {},
  methods: {
    take(ins, cmd = null) {
      const key = ins.insideKey;
      const playerKey = ins.game.playerKey;
      if (key === playerKey) return `${ins.name} is already in your inventory.`;
      ins.setInsideKey(playerKey);

      const stateKey = ins.getProp("stateKey");
      if (stateKey && stateKey === "initial") {
        ins.setProp("stateKey", "default");
      }

      return `${ins.name} added to inventory.`.replace(/^\w/, c => c.toUpperCase());
    },
    drop(ins) {
      const playerKey = ins.game.playerKey;
      const key = ins.insideKey;
      const loc = ins.game.getActiveLocation();
      if (key !== playerKey) return `${ins.name} is not in your inventory.`;
      ins.setInsideKey(loc.key);

      const descriptions = ins.getProp("descriptions");
      if (descriptions && descriptions["dropped"]) {
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
