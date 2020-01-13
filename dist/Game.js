import pubsub from "./modules/pubsub";
import commandParser from "./modules/commandParser";
import { ThingMaker, defaultBehaviours, locations, location } from "./index";
const events = {
    locationChange: "tea-location-change",
    commandCall: "tea-command"
};
const gCommands = [locations, location];
class Game {
    constructor(things = [], locations = [], patterns = {}) {
        this.location = null;
        this.things = [];
        this.locations = [];
        this.behaviourReg = new Map();
        this.gameCommands = new Map();
        this.behaviourReg = new Map();
        this.locations = locations;
        this.things = things;
        this.parserPatterns = patterns;
        defaultBehaviours.map(b => this.registerBehaviour(b));
        gCommands.map(i => this.gameCommands.set(i.name, i.method));
    }
    capitalise(str) {
        return str.replace(/^\w/, c => c.toUpperCase());
    }
    registerBehaviour(behaviour) {
        if (Array.isArray(behaviour)) {
            behaviour.map(i => this.behaviourReg.set(i.name, i));
        }
        else {
            this.behaviourReg.set(behaviour.name, behaviour);
        }
        return this;
    }
    getRegister() {
        return this.behaviourReg;
    }
    subscribe(eventName, callback) {
        return pubsub.subscribe(eventName, callback);
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
    setLocationByKey(key) {
        const { locations } = this;
        const from = this.getLocationByKey(this.location);
        const to = this.getLocationByKey(key);
        if (!from && to) {
            this.location = to.key;
            return pubsub.publish(events.locationChange, { from, to });
        }
        if (to && to.key !== from.key) {
            this.location = to.key;
            return pubsub.publish(events.locationChange, { from, to });
        }
        if (!to && locations.length > 0) {
            return (this.location = locations[0].key);
        }
    }
    getLocations() {
        return [...this.locations];
    }
    getThingsByLocationKey(key) {
        return this.things.filter(i => i.insideKey === key);
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
    getLocationNouns() {
        return this.locations.map(l => l.noun);
    }
    getActiveThings(locationKey = this.location) {
        return this.getThingsByLocationKey(locationKey);
    }
    getThingByKey(key, things = this.things) {
        return things.find(i => i.key === key);
    }
    getThings() {
        return this.things;
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
    resolveGameData(data) {
        const { locations, things, location = null } = data;
        if (Array.isArray(locations)) {
            locations.map(i => {
                const loc = ThingMaker.make(i, this.behaviourReg, this);
                return this.addLocation(loc);
            });
        }
        if (Array.isArray(things)) {
            things.map(i => {
                const thing = ThingMaker.make(i, this.behaviourReg, this);
                return this.addThing(thing);
            });
        }
        this.setLocationByKey(location);
        return this;
    }
    parseCommand(cmd, patterns = this.parserPatterns) {
        const msg = [];
        const parserResult = commandParser(cmd.toLocaleLowerCase(), patterns);
        const { nouns, verbs, described, input, terms } = parserResult;
        const verb = verbs[0];
        const locations = this.getLocationsByNoun(nouns[0], described[0]);
        const firstThings = this.getThingsByNoun(nouns[0], described[0]);
        const secondThings = this.getThingsByNoun(nouns[1], described[1]);
        const iThings = this.getThingsByLocationKey(null);
        const inventoryThings = this.getThingsByNoun(nouns[0], described[0], iThings);
        const tLength = terms.length;
        const lLength = locations.length;
        const fLength = firstThings.length;
        const sLength = secondThings.length;
        const iLength = inventoryThings.length;
        let type = "";
        const cmdTypes = {
            gameCommand: tLength === 1 && this.gameCommands.has(input),
            nav: lLength > 0,
            inventory: verb && iLength > 0 && fLength === 0,
            simple: verb && fLength > 0 && sLength === 0,
            complex: verb && fLength > 0 && sLength > 0
        };
        type = Object.keys(cmdTypes).find(k => cmdTypes[k] && k) || type;
        const errTypes = {
            simpleNoThing: verb && !type && fLength === 0 && nouns.length > 0,
            simpleBadVerb: type === "simple" && fLength === 1 && !firstThings[0].hasAction(verb),
            simpleDuplicate: type === "simple" && fLength >= 2 && firstThings[0].noun === firstThings[1].noun
        };
        type = Object.keys(errTypes).find(k => errTypes[k] && k) || type;
        if (type === "simpleNoThing") {
            type = "simpleNoThing";
            msg.push(`No "${nouns[0]}" found in inventory or ${this.getActiveLocation().name}.`);
        }
        if (type === "simpleBadVerb") {
            type = "simpleBadVerb";
            msg.push(`Unable to ${input}.`);
        }
        if (type === "simpleDuplicate") {
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
        const { verb, type, locations, firstThings, inventoryThings, msg, input } = cmd;
        const hasMsg = msg.length > 0;
        let response = () => `Invalid command: ${input}.`;
        let valid = false;
        if (hasMsg) {
            response = () => msg.join(" ");
        }
        else {
            if (type === "gameCommand") {
                valid = true;
                response = () => this.gameCommands.get(input)(this);
            }
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
        }
        const res = Object.assign(Object.assign({}, cmd), { valid, response });
        pubsub.publish(events.commandCall, res);
        return res;
    }
}
export default Game;
