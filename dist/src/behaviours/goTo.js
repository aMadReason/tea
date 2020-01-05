"use strict";
exports.__esModule = true;
var behaviour = {
    name: "goTo",
    methods: {
        travel: function (ins) {
            ins.game.setLocationByKey(ins.key);
            return "Moved to " + ins.name + ".";
        }
    },
    actions: {
        go: "travel",
        move: "travel",
        travel: "travel"
    }
};
Object.freeze(behaviour);
exports["default"] = behaviour;
