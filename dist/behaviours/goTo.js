"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const behaviour = {
    name: "goTo",
    methods: {
        travel(ins) {
            ins.game.setLocationByKey(ins.key);
            return `Moved to ${ins.name}.`;
        }
    },
    actions: {
        go: "travel",
        move: "travel",
        travel: "travel"
    }
};
Object.freeze(behaviour);
exports.default = behaviour;
