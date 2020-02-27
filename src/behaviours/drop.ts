import { iBehaviour } from "../index";

const behaviour: iBehaviour = {
  name: "drop",
  properties: {},
  methods: {
    drop(ins, cmd = null) {
      if (cmd.type === "simple") return behaviour.methods.dropSimple(ins, cmd);
      if (cmd.type === "complex") return behaviour.methods.dropComplex(ins, cmd);
    },
    dropComplex(ins, cmd = null) {
      const { noun, described } = ins;
      const otherNoun = cmd.nouns.find(i => i !== noun);
      const otherDesc = cmd.described.find(i => i !== described);
      const inside = ins.game.getThingsByInsideKey(ins.key);
      const targets = ins.game.getThingsByNoun(otherNoun, otherDesc, inside);
      const target = targets[0];

      console.log(inside);

      // if (target) {
      //   target.setInsideKey(ins.game.playerKey);
      //   return ins.game.capitalise(`The ${target.name} was moved to inventory.`);
      // }

      return "";
      //return behaviour.methods.dropSimple(ins, cmd);
    },
    dropSimple(ins, cmd = null) {
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
    drop: "drop",
    leave: "drop",
    put: "drop"
  }
};

Object.freeze(behaviour);
export default behaviour;
