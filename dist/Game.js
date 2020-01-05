"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pubsub_1 = __importDefault(require("./modules/pubsub"));
const commandParser_1 = __importDefault(require("./modules/commandParser"));
const index_1 = require("./index");
const events = {
    locationChange: "tea-location-change",
    commandCall: "tea-command"
};
class Game {
    constructor(things = [], locations = [], patterns = {}) {
        this.location = null;
        this.things = [];
        this.locations = [];
        this.behaviourReg = new Map();
        this.locations = locations;
        this.things = things;
        this.parserPatterns = patterns;
        index_1.defaultBehaviours.map(b => this.registerBehaviour(b));
    }
    registerBehaviour(behaviour) {
        this.behaviourReg.set(behaviour.name, behaviour);
        return this;
    }
    getRegister() {
        return this.behaviourReg;
    }
    subscribe(eventName, callback) {
        return pubsub_1.default.subscribe(eventName, callback);
    }
    preThingAdd(data) {
        const defaultBehaviors = index_1.defaultBehaviours.map(i => i.name);
        const dataBehaviours = data.behaviours || [];
        const behaviours = [...new Set([...defaultBehaviors, ...dataBehaviours])];
        const processedData = Object.assign(Object.assign({}, data), { behaviours });
        return processedData;
    }
    addLocation(thing) {
        this.locations.push(thing);
        return this;
    }
    addThing(thing) {
        this.things.push(thing);
        return this;
    }
    getActiveLocation() {
        return this.locations.find(i => i.key === this.location);
    }
    getLocationByKey(key = null) {
        return this.locations.find(i => i.key === key);
    }
    setLocationByKey(key = null) {
        const { locations } = this;
        const from = this.getLocationByKey(this.location);
        const to = this.getLocationByKey(key);
        if (!from && to) {
            this.location = to.key;
            return pubsub_1.default.publish(events.locationChange, { from, to });
        }
        if (to && to.key !== from.key) {
            this.location = to.key;
            return pubsub_1.default.publish(events.locationChange, { from, to });
        }
        if (!to && locations.length > 0) {
            return (this.location = locations[0].key);
        }
    }
    getThingsByLocationKey(key = null) {
        return this.things.filter(i => i.locationKey === key);
    }
    getActiveThings(locationKey = this.location) {
        return this.getThingsByLocationKey(locationKey);
    }
    getThingByKey(key) {
        return this.things.find(i => i.key === key);
    }
    getThings() {
        return this.things;
    }
    getLocations() {
        return this.locations;
    }
    getLocationNouns() {
        return this.locations.map(l => l.noun);
    }
    resolveGameData(data) {
        const { locations, things, location = null } = data;
        if (Array.isArray(locations)) {
            locations.map(i => {
                const loc = index_1.ThingMaker.make(i, this.behaviourReg, this);
                return this.addLocation(loc);
            });
        }
        if (Array.isArray(things)) {
            things.map(i => {
                const thing = index_1.ThingMaker.make(i, this.behaviourReg, this);
                return this.addThing(thing);
            });
        }
        this.setLocationByKey(location);
    }
    getThingsByNoun(noun, described = undefined, things = this.getActiveThings()) {
        const fThings = things.filter(t => {
            const isDescribed = t.described === described;
            const isNoun = noun && t.noun === noun;
            if (described && isDescribed && isNoun)
                return true;
            if (!described && isNoun)
                return true;
            return false;
        });
        return fThings;
    }
    getLocationsByNoun(noun, described = undefined) {
        const locations = this.getLocations();
        return locations.filter(t => {
            const isDescribed = t.described === described;
            const isNoun = noun && t.noun === noun;
            if (described && isDescribed && isNoun)
                return true;
            if (!described && isNoun)
                return true;
            return false;
        });
    }
    parseCommand(cmd, patterns = this.parserPatterns) {
        const msg = [];
        const parserResult = commandParser_1.default(cmd.toLocaleLowerCase(), patterns);
        const { nouns, verbs, described } = parserResult;
        const verb = verbs[0];
        const locations = this.getLocationsByNoun(nouns[0], described[0]);
        const firstThings = this.getThingsByNoun(nouns[0], described[0]);
        const secondThings = this.getThingsByNoun(nouns[1], described[1]);
        const iThings = this.getThingsByLocationKey(null);
        const inventoryThings = this.getThingsByNoun(nouns[0], described[0], iThings);
        const lLength = locations.length;
        const fLength = firstThings.length;
        const sLength = secondThings.length;
        const iLength = inventoryThings.length;
        const cmdTypes = {
            nav: lLength > 0,
            inventory: verb && iLength > 0 && fLength === 0,
            simple: verb && fLength > 0 && sLength === 0,
            complex: verb && fLength > 0 && sLength > 0
        };
        let type = Object.keys(cmdTypes).find(k => cmdTypes[k] && k) || false;
        const simpleDuplicate = type === "simple" &&
            fLength >= 2 &&
            firstThings[0].noun === firstThings[1].noun;
        if (simpleDuplicate) {
            type = "simpleDuplicate";
            msg.push(`Please be more descriptive and reference ${firstThings
                .map(i => `"${i.described}"`)
                .join(" or ")}.`);
        }
        if (inventoryThings.length >= 2) {
            type = "inventoryDuplicate";
            msg.push(`Please be more descriptive and reference ${inventoryThings
                .map(i => `"${i.described}"`)
                .join(" or ")}.`);
        }
        const result = Object.assign(Object.assign({ msg }, parserResult), { verb,
            type,
            locations,
            firstThings,
            secondThings,
            inventoryThings });
        return result;
    }
    command(command, patterns = this.parserPatterns) {
        const cmd = this.parseCommand(command, patterns);
        const { verb, type, locations, firstThings, inventoryThings, strictCommand, msg } = cmd;
        let response = () => `Invalid command: "${strictCommand}"`;
        let valid = false;
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
            response = () => msg.join(" ");
        }
        const res = Object.assign(Object.assign({}, cmd), { valid, response });
        pubsub_1.default.publish(events.commandCall, res);
        return res;
    }
}
exports.default = Game;
