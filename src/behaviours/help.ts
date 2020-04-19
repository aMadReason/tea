import { iBehaviour } from "../index";

const behaviour: iBehaviour = {
  name: "help",
  properties: {
    hideActions: [],
    //filterActionsTo: [],
    //excludeActionsTo: []
  },
  methods: {
    help(ins, cmd = null): string {
      const hidden = ins.getProp("hideActions");
      const first = `The ${ins.name} has the following actions available;`;
      let acts = [...ins.getActionKeys()];

      if (hidden && Array.isArray(hidden) && hidden.length > 0) {
        acts = acts.filter(i => !hidden.includes(i));
      }

      if (acts.length === 0 || !acts) return `${ins.name} has no actions available`;
      if (acts.length === 1) return `${first} ${acts.join(", ")}`;

      const last = acts.pop();
      return `${first} ${acts.join(", ")} and ${last}.`;
    }
  },
  actions: {
    help: "help",
    examine: "help"
  }
};

Object.freeze(behaviour);
export default behaviour;
