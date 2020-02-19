import { iBehaviour } from "../index";

// reveals more detailed details about the thing

const takeInside: iBehaviour = {
  name: "takeInside",
  properties: {},
  methods: {
    takeInside(ins, cmd = null): string {
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
    }
  },
  actions: {
    take: "takeInside"
  }
};

Object.freeze(takeInside);
export default takeInside;
