"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const behaviour = {
    name: "usePortal",
    properties: {
        portalTo: "",
        badPortalMsg: "Broken portal"
    },
    methods: {
        use(ins) {
            const locationKey = ins.getProp("portalTo").toString();
            const location = ins.game.getLocationByKey(locationKey);
            if (!location)
                return ins.getProp("badPortalMsg").toString();
            ins.game.setLocationByKey(locationKey);
            return `Moved to ${location.name}.`;
        }
    },
    actions: {
        use: "use"
    }
};
Object.freeze(behaviour);
exports.default = behaviour;
