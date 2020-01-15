import { iBehaviour } from "../../index";

const behaviour: iBehaviour = {
  name: "openContainer",
  properties: {
    stateKey: {
      open: "false"
    }
  },
  methods: {
    open(ins, cmd = null) {
      const children = ins.game.getThingsByInsideKey(ins.key);

      return ``;
    }
  },
  actions: {
    open: "open"
  }
};
Object.freeze(behaviour);
export default behaviour;
