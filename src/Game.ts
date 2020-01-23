import { iGame, iThing, iBehaviour, iCommand, gameCommandMethod, iProperties } from "./_types";
import pubsub from "./modules/pubsub";
import commandParser from "./modules/commandParser";
import { ThingMaker, defaultBehaviours, locations, location } from "./index";

const events = {
  locationChange: "tea-location-change",
  commandCall: "tea-command"
};

const gCommands = [locations, location];

class Game implements iGame {
  //location: string = null;
  playerKey: string = null;
  things: Array<iThing> = [];
  characters: Array<iThing> = [];
  locations: Array<iThing> = [];
  behaviourReg: Map<string, iBehaviour> = new Map();
  parserPatterns: Object;
  gameCommands: Map<string, gameCommandMethod> = new Map();

  constructor(
    things: Array<iThing> = [],
    locations: Array<iThing> = [],
    characters: Array<iThing> = [],
    patterns: iProperties<string> = {}
  ) {
    this.behaviourReg = new Map();
    this.locations = locations;
    this.things = things;
    this.characters = characters;
    this.parserPatterns = patterns;
    //add default behaviours
    defaultBehaviours.map(b => this.registerBehaviour(b));
    gCommands.map(i => this.gameCommands.set(i.name, i.method));
  }

  get location() {
    const player = this.getActivePlayer();
    return player ? player.insideKey : null;
  }

  capitalise(str: string) {
    return str.replace(/^\w/, c => c.toUpperCase());
  }

  registerBehaviour(behaviour) {
    if (Array.isArray(behaviour)) {
      behaviour.map(i => this.behaviourReg.set(i.name, i));
    } else {
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

  addLocation(thing: iThing) {
    this.locations.push(thing);
    return this;
  }

  addCharacter(thing: iThing) {
    this.characters.push(thing);
    return this;
  }

  addThing(thing: iThing) {
    this.things.push(thing);
    return this;
  }

  getCharacters() {
    return [...this.characters];
  }

  setPlayerKey(key: string) {
    this.playerKey = key;
  }

  getActivePlayer() {
    return this.characters.find(p => p.key === this.playerKey);
  }

  getActiveLocation() {
    return this.locations.find(i => i.key === this.location);
  }

  getLocationByKey(key = null) {
    return this.locations.find(i => i.key === key);
  }

  setLocationByKey(key) {
    const { locations } = this;
    const player = this.getActivePlayer();
    const from = this.getLocationByKey(this.location);
    const to = this.getLocationByKey(key);

    if (!player) throw Error("No player character set.");

    if (!from && to) {
      player.insideKey = to.key;
      return pubsub.publish(events.locationChange, { from, to });
    }

    if (to && to.key !== from.key) {
      player.insideKey = to.key;
      return pubsub.publish(events.locationChange, { from, to });
    }

    if (!to && locations.length > 0) {
      return (player.insideKey = locations[0].key);
    }
  }

  getLocations() {
    return [...this.locations];
  }

  getThingsByInsideKey(key) {
    return this.things.filter(i => i.insideKey === key);
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

  getLocationNouns() {
    return this.locations.map(l => l.noun);
  }

  getActiveThings(locationKey = this.location) {
    return this.getThingsByInsideKey(locationKey);
  }

  getThingByKey(key, things = this.things) {
    return things.find(i => i.key === key);
  }

  getThings(): iThing[] {
    return this.things;
  }

  getThingsByNoun(noun, described = undefined, things = this.getActiveThings()) {
    const fThings = things.filter(t => {
      const isDescribed = t.described === described;
      const isNoun = noun && t.noun === noun;
      if (described && isDescribed && isNoun) return true;
      if (!described && isNoun) return true;
      return false;
    });

    return fThings;
  }

  resolveGameData(data) {
    const { locations, things, characters, playerKey = null } = data;

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

    if (Array.isArray(characters)) {
      characters.map(i => {
        const char = ThingMaker.make(i, this.behaviourReg, this);
        return this.addCharacter(char);
      });
    }

    if (playerKey) {
      this.setPlayerKey(playerKey);
    }

    return this;
  }

  parseCommand(cmd: string, patterns = this.parserPatterns) {
    const msg = [];
    const parserResult = commandParser(cmd.toLocaleLowerCase(), patterns);
    const { nouns, verbs, described, input, terms } = parserResult;
    const verb = verbs[0];
    const locations = this.getLocationsByNoun(nouns[0], described[0]);
    const firstThings = this.getThingsByNoun(nouns[0], described[0]);
    const secondThings = this.getThingsByNoun(nouns[1], described[1]);
    const iThings = this.getThingsByInsideKey(null);
    const inventoryThings = this.getThingsByNoun(nouns[0], described[0], iThings);

    const tLength = terms.length;
    const lLength = locations.length;
    const fLength = firstThings.length;
    const sLength = secondThings.length;
    const iLength = inventoryThings.length;

    let type = "";

    // check basic type - order is important!
    const cmdTypes = {
      gameCommand: tLength === 1 && this.gameCommands.has(input),
      nav: lLength > 0,
      inventory: verb && iLength > 0 && fLength === 0,
      simple: verb && fLength > 0 && sLength === 0,
      complex: verb && fLength > 0 && sLength > 0
    };
    type = Object.keys(cmdTypes).find(k => cmdTypes[k] && k) || type;

    // then check for errors
    const errTypes = {
      simpleNoThing: verb && !type && fLength === 0 && nouns.length > 0,
      simpleBadVerb: type === "simple" && fLength === 1 && !firstThings[0].hasAction(verb),
      simpleDuplicate:
        type === "simple" && fLength >= 2 && firstThings[0].noun === firstThings[1].noun
    };
    type = Object.keys(errTypes).find(k => errTypes[k] && k) || type;

    // secondary checks
    if (type === "simpleNoThing") {
      type = "simpleNoThing";
      msg.push(`No "${nouns[0]}" found in inventory or ${this.getActiveLocation().name}.`);
    }

    if (type === "simpleBadVerb") {
      type = "simpleBadVerb";
      msg.push(`Unable to ${input}.`);
    }

    // const simpleDuplicate =
    if (type === "simpleDuplicate") {
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

  command(command, patterns = this.parserPatterns) {
    const cmd = this.parseCommand(command, patterns);
    const { verb, type, locations, firstThings, inventoryThings, msg, input } = cmd;
    const hasMsg = msg.length > 0;
    let response = () => `Invalid command: ${input}.`;
    let valid = false;

    if (hasMsg) {
      response = () => msg.join(" ");
    } else {
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

    const res = { ...cmd, valid, response };
    pubsub.publish(events.commandCall, res);
    return res;
  }
}

export default Game;
