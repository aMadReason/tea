"use strict";
exports.__esModule = true;
var behaviour = {
    name: "help",
    properties: {
        filterActionsTo: [],
        excludeActionsTo: []
    },
    methods: {
        help: function (ins, cmd) {
            var allowedActs = ins.getProp("filterActionsTo");
            var acts = ins.getActionKeys();
            if (allowedActs && Array.isArray(allowedActs) && allowedActs.length > 0) {
                acts = acts.filter(function (i) { return allowedActs.indexOf(i) > -1; });
            }
            if (acts.length > 1) {
                var last = acts.pop();
                return "You can " + acts.join(", ") + " or " + last + " the " + ins.name + ".";
            }
            return "You can " + acts.join(", ") + " the " + ins.name + ".";
        }
    },
    actions: {
        help: "help",
        examine: "help"
    }
};
Object.freeze(behaviour);
exports["default"] = behaviour;
