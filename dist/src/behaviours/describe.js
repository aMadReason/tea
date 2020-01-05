"use strict";
exports.__esModule = true;
var describe = {
    name: "describe",
    properties: {
        "stateKey": "default",
        "descriptions": {
            "default": "It's a {name}"
        }
    },
    methods: {
        describe: function (ins, cmd) {
            var name = ins.name.toString();
            var stateKey = ins.getProp("stateKey").toString();
            var descriptions = ins.getProp("descriptions");
            var description = descriptions[stateKey];
            if (!description)
                description = descriptions["default"];
            return description.replace("{name}", name);
        }
    },
    actions: {
        describe: "describe"
    }
};
Object.freeze(describe);
exports["default"] = describe;
