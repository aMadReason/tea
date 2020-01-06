const behaviour = {
    name: "help",
    properties: {
        filterActionsTo: [],
        excludeActionsTo: []
    },
    methods: {
        help(ins, cmd) {
            const allowedActs = ins.getProp("filterActionsTo");
            let acts = ins.getActionKeys();
            if (allowedActs && Array.isArray(allowedActs) && allowedActs.length > 0) {
                acts = acts.filter(i => allowedActs.indexOf(i) > -1);
            }
            if (acts.length > 1) {
                const last = acts.pop();
                return `You can ${acts.join(", ")} or ${last} the ${ins.name}.`;
            }
            return `You can ${acts.join(", ")} the ${ins.name}.`;
        }
    },
    actions: {
        help: "help",
        examine: "help"
    }
};
Object.freeze(behaviour);
export default behaviour;
