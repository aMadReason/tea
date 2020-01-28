import { iBehaviour } from "../index";
// gives brief description of thing depending on its state.

const describe: iBehaviour = {
  name: "describe",
  properties: {
    stateKey: "default",
    descriptions: {
      default: "It's a {name}"
    }
  },
  methods: {
    describe(ins, cmd = null): string {
      const name = ins.name.toString();
      const stateKey = ins.getProp("stateKey").toString();
      const descriptions = ins.getProp("descriptions");
      let description = descriptions[stateKey];
      if (!description) description = descriptions["default"];
      return description.replace("{name}", name);
    }
  },
  actions: {
    describe: "describe"
  }
};

Object.freeze(describe);
export default describe;
