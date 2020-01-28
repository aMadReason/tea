import { iBehaviour } from "../index";

// reveals more detailed details about the thing

const examine: iBehaviour = {
  name: "examine",
  properties: {
    stateKey: "",
    details: {
      default: "There is nothing remarkable about the {name}"
    }
  },
  methods: {
    examine(ins, cmd = null): string {
      const name = ins.name.toString();
      const stateKey = ins.getProp("stateKey").toString();
      const details = ins.getProp("details");
      let detail = details[stateKey];
      if (!detail) detail = details["default"];
      return detail.replace("{name}", name);
    }
  },
  actions: {
    examine: "examine"
  }
};

Object.freeze(examine);
export default examine;
