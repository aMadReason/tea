"use strict";
exports.__esModule = true;
var behaviour = {
    name: "usePortal",
    properties: {
        portalTo: "",
        badPortalMsg: "Broken portal"
    },
    methods: {
        use: function (ins) {
            var locationKey = ins.getProp("portalTo").toString();
            var location = ins.game.getLocationByKey(locationKey);
            if (!location)
                return ins.getProp("badPortalMsg").toString();
            ins.game.setLocationByKey(locationKey);
            return "Moved to " + location.name + ".";
        }
    },
    actions: {
        use: "use"
    }
};
Object.freeze(behaviour);
exports["default"] = behaviour;
