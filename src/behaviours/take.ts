import { iBehaviour } from "../index";

const behaviour: iBehaviour = {
  name: "take",
  properties: {},
  methods: {
    take(ins, cmd = null) {
      if (cmd.type === "simple") return behaviour.methods.takeSimple(ins, cmd);
      if (cmd.type === "complex") return behaviour.methods.takeComplex(ins, cmd);
    },
    takeComplex(ins, cmd = null) {
      const { noun, described } = ins;
      const otherNoun = cmd.nouns.find(i => i !== noun);
      const otherDesc = cmd.described.find(i => i !== described);
      const inside = ins.game.getThingsByInsideKey(ins.key);
      const targets = ins.game.getThingsByNoun(otherNoun, otherDesc, inside);
      const target = targets[0];

      if (target) {
        target.setInsideKey(ins.game.playerKey);
        return ins.game.capitalise(`The ${target.name} was moved to inventory.`);
      }

      return ins.game.capitalise(`There is no ${target.name} in the ${ins.name}.`);
    },
    takeSimple(ins, cmd = null) {
      const key = ins.insideKey;
      const playerKey = ins.game.playerKey;
      if (key === playerKey) return `${ins.name} is already in your inventory.`;
      ins.setInsideKey(playerKey);

      const stateKey = ins.getProp("stateKey");
      if (stateKey && stateKey === "initial") {
        ins.setProp("stateKey", "default");
      }

      return `${ins.name} added to inventory.`.replace(/^\w/, c => c.toUpperCase());
    }
  },
  actions: {
    take: "take",
    pick: "take"
  }
};

Object.freeze(behaviour);
export default behaviour;
