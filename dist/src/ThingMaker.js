"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
exports.__esModule = true;
var index_1 = require("./index");
var index_2 = require("./behaviours/index");
exports.defaultBehaviours = [index_2.describe, index_2.help, index_2.examine];
var ThingMaker = (function () {
    function ThingMaker() {
    }
    ThingMaker.preProcess = function (data) {
        var defaultBehaviors = exports.defaultBehaviours.map(function (i) { return i.name; });
        var dataBehaviours = data.behaviours || [];
        var behaviours = __spread(new Set(__spread(defaultBehaviors, dataBehaviours)));
        var processedData = __assign(__assign({}, data), { behaviours: behaviours });
        return processedData;
    };
    ThingMaker.make = function (data, behaviourReg, game) {
        var processedData = ThingMaker.preProcess(data);
        var noun = processedData.noun, described = processedData.described, behaviours = processedData.behaviours, locationKey = processedData.locationKey, key = processedData.key, properties = processedData.properties;
        var thing = new index_1.Thing({
            noun: noun,
            properties: properties,
            described: described,
            locationKey: locationKey,
            key: key,
            game: game
        });
        if (!behaviours)
            return thing;
        behaviours.map(function (b) {
            var behaviour = behaviourReg.get(b);
            if (behaviour)
                thing.addBehaviour(behaviour);
            return null;
        });
        return thing;
    };
    return ThingMaker;
}());
exports["default"] = ThingMaker;
