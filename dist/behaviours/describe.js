"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const describe = {
    name: "describe",
    properties: {
        "stateKey": "default",
        "descriptions": {
            "default": "It's a {name}"
        }
    },
    methods: {
        describe(ins, cmd) {
            const name = ins.name.toString();
            const stateKey = ins.getProp("stateKey").toString();
            const descriptions = ins.getProp("descriptions");
            let description = descriptions[stateKey];
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
exports.default = describe;
