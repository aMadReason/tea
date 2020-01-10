import { iThing, iBehaviour, iCommand } from "../../index";

const behaviour: iBehaviour = {
  name: "help",
  properties: {
    filterActionsTo: [],
    excludeActionsTo: []
  },
  methods: {
    help(ins: iThing, cmd?: iCommand): string {
      const allowedActs = ins.getProp("filterActionsTo");
      const first = `The ${ins.name} has the following actions available;`;
      let acts = [...ins.getActionKeys()];

      if (allowedActs && Array.isArray(allowedActs) && allowedActs.length > 0) {
        acts = acts.filter(i => allowedActs.indexOf(i) > -1);
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
