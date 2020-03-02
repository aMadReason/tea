const behaviour = {
    name: "drop",
    properties: {},
    methods: {
        drop(ins, cmd = null) {
            if (cmd.type === "simple")
                return behaviour.methods.dropSimple(ins, cmd);
            if (cmd.type === "complex")
                return behaviour.methods.dropComplex(ins, cmd);
        },
        dropComplex(ins, cmd = null) {
            const { verb } = cmd;
            const { noun, described } = ins;
            const otherNoun = cmd.nouns.find(i => i !== noun);
            const otherDesc = cmd.described.find(i => i !== described);
            const inside = ins.game.getThingsByInsideKey(ins.game.getPlayerKey());
            const targets = ins.game.getThingsByNoun(otherNoun, otherDesc, inside);
            const target = targets[0];
            if (ins && target && target.insideKey === ins.key) {
                return `${target.name} is already in the ${ins.name}.`;
            }
            if (ins && target && target.insideKey !== ins.key) {
                target.setInsideKey(ins.key);
                return ins.game.capitalise(`The ${target.name} was left in the ${ins.name}.`);
            }
            if (!target) {
                return `There is no ${otherDesc || otherNoun} in the inventory to leave in the ${ins.name}.`;
            }
            return `Unable to ${cmd.verb} the ${otherDesc || otherNoun}.`;
        },
        dropSimple(ins, cmd = null) {
            const playerKey = ins.game.playerKey;
            const key = ins.insideKey;
            const loc = ins.game.getActiveLocation();
            if (key !== playerKey)
                return `${ins.name} is not in your inventory.`;
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
