import { iGame, iThing, iGameData, iBehaviour, iCommand } from "./_types";
//import { help, describe, examine } from "./behaviours";
import pubsub from "./modules/pubsub";
import commandParser from "./modules/commandParser";
import { ThingMaker, defaultBehaviours } from "./index";

const events = {
  locationChange: "tea-location-change",
  commandCall: "tea-command"
};

class Game implements iGame {
  location: string = null;
  things: Array<iThing> = [];
  locations: Array<iThing> = [];
  behaviourReg: Map<string, iBehaviour>;
  parserPatterns: Object;

  constructor(things: Array<iThing> = [], locations: Array<iThing> = [], patterns = {}) {
    this.behaviourReg = new Map();
    this.locations = locations;
    this.things = things;
    this.parserPatterns = patterns;
    //add default behaviours
    defaultBehaviours.map(b => this.registerBehaviour(b));
  }

  registerBehaviour(behaviour: iBehaviour) {
    this.behaviourReg.set(behaviour.name, behaviour);
    return this;
  }

  getRegister() {
    return this.behaviourReg;
  }

  subscribe(eventName: string, callback: () => {}) {
    return pubsub.subscribe(eventName, callback);
  }

  preThingAdd(data: iThing) {
    const defaultBehaviors = defaultBehaviours.map(i => i.name);
    const dataBehaviours = data.behaviours || [];
    const behaviours = [...new Set([...defaultBehaviors, ...dataBehaviours])];
    const processedData = { ...data, behaviours };
    return processedData;
  }

  addLocation(thing: iThing) {
    this.locations.push(thing);
    return this;
  }

  addThing(thing: iThing) {
    this.things.push(thing);
    return this;
  }

  getActiveLocation(): iThing {
    return this.locations.find(i => i.key === this.location);
  }

  getLocationByKey(key: string = null): iThing {
    return this.locations.find(i => i.key === key);
  }

  setLocationByKey(key: string = null) {
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

  getThingsByLocationKey(key: string = null): iThing[] {
    return this.things.filter(i => i.locationKey === key);
  }

  getActiveThings(locationKey: string = this.location): iThing[] {
    return this.getThingsByLocationKey(locationKey);
  }

  getThingByKey(key: string): iThing {
    return this.things.find(i => i.key === key);
  }

  getThings(): iThing[] {
    return this.things;
  }

  getLocations() {
    return this.locations;
  }

  getLocationNouns() {
    return this.locations.map(l => l.noun);
  }

  resolveGameData(data: iGameData) {
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
  }

  getThingsByNoun(
    noun: String,
    described: String = undefined,
    things: iThing[] = this.getActiveThings()
  ) {
    const fThings = things.filter(t => {
      const isDescribed = t.described === described;
      const isNoun = noun && t.noun === noun;
      if (described && isDescribed && isNoun) return true;
      if (!described && isNoun) return true;
      return false;
    });

    return fThings;
  }

  getLocationsByNoun(noun: String, described: String = undefined) {
    const locations = this.getLocations();
    return locations.filter(t => {
      const isDescribed = t.described === described;
      const isNoun = noun && t.noun === noun;
      if (described && isDescribed && isNoun) return true;
      if (!described && isNoun) return true;
      return false;
    });
  }

  parseCommand(cmd: string, patterns = this.parserPatterns) {
    const msg = [];
    const parserResult = commandParser(cmd.toLocaleLowerCase(), patterns);
    const { nouns, verbs, described, command } = parserResult;
    const verb = verbs[0];
    const locations = this.getLocationsByNoun(nouns[0], described[0]);
    const firstThings = this.getThingsByNoun(nouns[0], described[0]);
    const secondThings = this.getThingsByNoun(nouns[1], described[1]);
    const iThings = this.getThingsByLocationKey(null);
    const inventoryThings = this.getThingsByNoun(
      nouns[0],
      described[0],
      iThings
    );

    const lLength = locations.length;
    const fLength = firstThings.length;
    const sLength = secondThings.length;
    const iLength = inventoryThings.length;

    const cmdTypes = {
      // order is important
      nav: lLength > 0,
      inventory: verb && iLength > 0 && fLength === 0,
      simple: verb && fLength > 0 && sLength === 0,
      complex: verb && fLength > 0 && sLength > 0
    };

    let type = Object.keys(cmdTypes).find(k => cmdTypes[k] && k) || false;

    // secondary checks
    const simpleBadVerb = type === "simple" && fLength === 1 && !firstThings[0].hasAction(verb);
    if (simpleBadVerb) {
      type = "simpleBadVerb";
      msg.push(
        `Unable to ${command}.`
      );
    }

    const simpleDuplicate =
      type === "simple" &&
      fLength >= 2 &&
      firstThings[0].noun === firstThings[1].noun;

    if (simpleDuplicate) {
      type = "simpleDuplicate";
      msg.push(
        `Please be more descriptive and reference ${firstThings
          .map(i => `"${i.described}"`)
          .join(" or ")}.`
      );
    }

    if (inventoryThings.length >= 2) {
      type = "inventoryDuplicate";
      msg.push(
        `Please be more descriptive and reference ${inventoryThings
          .map(i => `"${i.described}"`)
          .join(" or ")}.`
      );
    }

    const result = {
      msg,
      ...parserResult,
      verb,
      type,
      locations,
      firstThings,
      secondThings,
      inventoryThings
    };
    return result;
  }

  command(command: string, patterns = this.parserPatterns) {
    const cmd: iCommand = this.parseCommand(command, patterns);
    const {
      verb,
      type,
      locations,
      firstThings,
      inventoryThings,
      strictCommand,
      msg
    } = cmd;
    const hasMsg = msg.length > 0;
    let response = () => `Invalid command: "${strictCommand}"`;
    let valid = false;

    if (hasMsg) {
      response = () => msg.join(" ");
    } else {

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

    const res = { ...cmd, valid, response };

    pubsub.publish(events.commandCall, res);

    return res;
  }
}

export default Game;
