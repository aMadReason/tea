"use strict";
exports.__esModule = true;
var behaviour = {
    name: "take",
    properties: {},
    methods: {
        take: function (ins) {
            var key = ins.locationKey;
            if (key === null)
                return ins.name + " is already in your inventory.";
            ins.setLocationKey(null);
            var stateKey = ins.getProp("stateKey");
            if (stateKey && stateKey === "initial") {
                ins.setProp("stateKey", "default");
            }
            return ins.name + " added to inventory.";
        },
        drop: function (ins) {
            var key = ins.locationKey;
            var loc = ins.game.getActiveLocation();
            if (key)
                return ins.name + " is not in your inventory.";
            ins.setLocationKey(loc.key);
            var descriptions = ins.getProp("descriptions");
            if (descriptions && "dropped" in descriptions) {
                ins.setProp("stateKey", "dropped");
            }
            return ins.name + " removed from inventory.";
        }
    },
    actions: {
        take: "take",
        pick: "take",
        drop: "drop",
        leave: "drop",
        put: "drop"
    }
};
Object.freeze(behaviour);
exports["default"] = behaviour;
