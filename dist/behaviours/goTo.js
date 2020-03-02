const behaviour = {
    name: "goTo",
    properties: {},
    methods: {
        goTo(ins, cmd = null) {
            ins.game.setLocationByKey(ins.key);
            return `Moved to ${ins.name}.`;
        }
    },
    actions: {
        go: "goTo",
        move: "goTo",
        travel: "goTo"
    }
};
Object.freeze(behaviour);
export default behaviour;
