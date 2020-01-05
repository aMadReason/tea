"use strict";
exports.__esModule = true;
var examine = {
    name: "examine",
    properties: {
        stateKey: "",
        details: {
            "default": "There is nothing remarkable about the {name}"
        }
    },
    methods: {
        examine: function (ins, cmd) {
            var name = ins.name.toString();
            var stateKey = ins.getProp("stateKey").toString();
            var details = ins.getProp("details");
            var detail = details[stateKey];
            if (!detail)
                detail = details["default"];
            return detail.replace("{name}", name);
        }
    },
    actions: {
        examine: "examine"
    }
};
Object.freeze(examine);
exports["default"] = examine;
