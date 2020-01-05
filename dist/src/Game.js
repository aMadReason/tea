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
var pubsub_1 = require("./modules/pubsub");
var commandParser_1 = require("./modules/commandParser");
var index_1 = require("./index");
var events = {
    locationChange: "tea-location-change",
    commandCall: "tea-command"
};
var Game = (function () {
    function Game(things, locations, patterns) {
        var _this = this;
        if (things === void 0) { things = []; }
        if (locations === void 0) { locations = []; }
        if (patterns === void 0) { patterns = {}; }
        this.location = null;
        this.things = [];
        this.locations = [];
        this.behaviourReg = new Map();
        this.locations = locations;
        this.things = things;
        this.parserPatterns = patterns;
        index_1.defaultBehaviours.map(function (b) { return _this.registerBehaviour(b); });
    }
    Game.prototype.registerBehaviour = function (behaviour) {
        this.behaviourReg.set(behaviour.name, behaviour);
        return this;
    };
    Game.prototype.getRegister = function () {
        return this.behaviourReg;
    };
    Game.prototype.subscribe = function (eventName, callback) {
        return pubsub_1["default"].subscribe(eventName, callback);
    };
    Game.prototype.preThingAdd = function (data) {
        var defaultBehaviors = index_1.defaultBehaviours.map(function (i) { return i.name; });
        var dataBehaviours = data.behaviours || [];
        var behaviours = __spread(new Set(__spread(defaultBehaviors, dataBehaviours)));
        var processedData = __assign(__assign({}, data), { behaviours: behaviours });
        return processedData;
    };
    Game.prototype.addLocation = function (thing) {
        this.locations.push(thing);
        return this;
    };
    Game.prototype.addThing = function (thing) {
        this.things.push(thing);
        return this;
    };
    Game.prototype.getActiveLocation = function () {
        var _this = this;
        return this.locations.find(function (i) { return i.key === _this.location; });
    };
    Game.prototype.getLocationByKey = function (key) {
        if (key === void 0) { key = null; }
        return this.locations.find(function (i) { return i.key === key; });
    };
    Game.prototype.setLocationByKey = function (key) {
        if (key === void 0) { key = null; }
        var locations = this.locations;
        var from = this.getLocationByKey(this.location);
        var to = this.getLocationByKey(key);
        if (!from && to) {
            this.location = to.key;
            return pubsub_1["default"].publish(events.locationChange, { from: from, to: to });
        }
        if (to && to.key !== from.key) {
            this.location = to.key;
            return pubsub_1["default"].publish(events.locationChange, { from: from, to: to });
        }
        if (!to && locations.length > 0) {
            return (this.location = locations[0].key);
        }
    };
    Game.prototype.getThingsByLocationKey = function (key) {
        if (key === void 0) { key = null; }
        return this.things.filter(function (i) { return i.locationKey === key; });
    };
    Game.prototype.getActiveThings = function (locationKey) {
        if (locationKey === void 0) { locationKey = this.location; }
        return this.getThingsByLocationKey(locationKey);
    };
    Game.prototype.getThingByKey = function (key) {
        return this.things.find(function (i) { return i.key === key; });
    };
    Game.prototype.getThings = function () {
        return this.things;
    };
    Game.prototype.getLocations = function () {
        return this.locations;
    };
    Game.prototype.getLocationNouns = function () {
        return this.locations.map(function (l) { return l.noun; });
    };
    Game.prototype.resolveGameData = function (data) {
        var _this = this;
        var locations = data.locations, things = data.things, _a = data.location, location = _a === void 0 ? null : _a;
        if (Array.isArray(locations)) {
            locations.map(function (i) {
                var loc = index_1.ThingMaker.make(i, _this.behaviourReg, _this);
                return _this.addLocation(loc);
            });
        }
        if (Array.isArray(things)) {
            things.map(function (i) {
                var thing = index_1.ThingMaker.make(i, _this.behaviourReg, _this);
                return _this.addThing(thing);
            });
        }
        this.setLocationByKey(location);
    };
    Game.prototype.getThingsByNoun = function (noun, described, things) {
        if (described === void 0) { described = undefined; }
        if (things === void 0) { things = this.getActiveThings(); }
        var fThings = things.filter(function (t) {
            var isDescribed = t.described === described;
            var isNoun = noun && t.noun === noun;
            if (described && isDescribed && isNoun)
                return true;
            if (!described && isNoun)
                return true;
            return false;
        });
        return fThings;
    };
    Game.prototype.getLocationsByNoun = function (noun, described) {
        if (described === void 0) { described = undefined; }
        var locations = this.getLocations();
        return locations.filter(function (t) {
            var isDescribed = t.described === described;
            var isNoun = noun && t.noun === noun;
            if (described && isDescribed && isNoun)
                return true;
            if (!described && isNoun)
                return true;
            return false;
        });
    };
    Game.prototype.parseCommand = function (cmd, patterns) {
        if (patterns === void 0) { patterns = this.parserPatterns; }
        var msg = [];
        var parserResult = commandParser_1["default"](cmd.toLocaleLowerCase(), patterns);
        var nouns = parserResult.nouns, verbs = parserResult.verbs, described = parserResult.described;
        var verb = verbs[0];
        var locations = this.getLocationsByNoun(nouns[0], described[0]);
        var firstThings = this.getThingsByNoun(nouns[0], described[0]);
        var secondThings = this.getThingsByNoun(nouns[1], described[1]);
        var iThings = this.getThingsByLocationKey(null);
        var inventoryThings = this.getThingsByNoun(nouns[0], described[0], iThings);
        var lLength = locations.length;
        var fLength = firstThings.length;
        var sLength = secondThings.length;
        var iLength = inventoryThings.length;
        var cmdTypes = {
            nav: lLength > 0,
            inventory: verb && iLength > 0 && fLength === 0,
            simple: verb && fLength > 0 && sLength === 0,
            complex: verb && fLength > 0 && sLength > 0
        };
        var type = Object.keys(cmdTypes).find(function (k) { return cmdTypes[k] && k; }) || false;
        var simpleDuplicate = type === "simple" &&
            fLength >= 2 &&
            firstThings[0].noun === firstThings[1].noun;
        if (simpleDuplicate) {
            type = "simpleDuplicate";
            msg.push("Please be more descriptive and reference " + firstThings
                .map(function (i) { return "\"" + i.described + "\""; })
                .join(" or ") + ".");
        }
        if (inventoryThings.length >= 2) {
            type = "inventoryDuplicate";
            msg.push("Please be more descriptive and reference " + inventoryThings
                .map(function (i) { return "\"" + i.described + "\""; })
                .join(" or ") + ".");
        }
        var result = __assign(__assign({ msg: msg }, parserResult), { verb: verb,
            type: type,
            locations: locations,
            firstThings: firstThings,
            secondThings: secondThings,
            inventoryThings: inventoryThings });
        return result;
    };
    Game.prototype.command = function (command, patterns) {
        if (patterns === void 0) { patterns = this.parserPatterns; }
        var cmd = this.parseCommand(command, patterns);
        var verb = cmd.verb, type = cmd.type, locations = cmd.locations, firstThings = cmd.firstThings, inventoryThings = cmd.inventoryThings, strictCommand = cmd.strictCommand, msg = cmd.msg;
        var response = function () { return "Invalid command: \"" + strictCommand + "\""; };
        var valid = false;
        if (type === "nav" && locations.length > 0) {
            valid = true;
            response = locations[0].getAction(verb, cmd);
        }
        if (type === "simple" && firstThings.length > 0) {
            valid = true;
            response = firstThings[0].getAction(verb, cmd);
        }
        if (type === "inventory") {
            valid = true;
            response = inventoryThings[0].getAction(verb, cmd);
        }
        if (msg && msg.length > 0) {
            valid = false;
            response = function () { return msg.join(" "); };
        }
        var res = __assign(__assign({}, cmd), { valid: valid, response: response });
        pubsub_1["default"].publish(events.commandCall, res);
        return res;
    };
    return Game;
}());
exports["default"] = Game;
