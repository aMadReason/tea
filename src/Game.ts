import {
  iGame,
  iThing,
  iBehaviour,
  gameCommandMethod,
  iProperties,
  iGameData,
  iCommand
} from "./_types";
import pubsub from "./modules/pubsub";
import commandParser from "./modules/commandParser";
import { ThingMaker, defaultBehaviours, locations, location } from "./index";

const events = {
  locationChange: "location-change",
  commandCall: "command"
};

const gCommands = [locations, location];

class Game implements iGame {
  log: boolean = false;
  playerKey: string = null;
  things: Array<iThing> = [];
  characters: Array<iThing> = [];
  locations: Array<iThing> = [];
  behaviourReg: Map<string, iBehaviour> = new Map();
  parserPatterns: Object;
  gameCommands: Map<string, gameCommandMethod> = new Map();
  pubsub: any;

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
    this.pubsub = pubsub;
    //add default behaviours
    defaultBehaviours.map(b => this.registerBehaviour(b));
    gCommands.map(i => this.gameCommands.set(i.name, i.method));
  }

  get locationKey(): string {
    const player = this.getActivePlayer();
    return player ? player.insideKey : null;
  }

  capitalise(str: string) {
    return str.replace(/^\w/, c => c.toUpperCase());
  }

  registerBehaviour(behaviour: iBehaviour): iGame {
    if (Array.isArray(behaviour)) {
      behaviour.map(i => this.behaviourReg.set(i.name, i));
    } else {
      this.behaviourReg.set(behaviour.name, behaviour);
    }
    return this;
  }

  subscribe(eventName: string, callback: Function) {
    return this.pubsub.subscribe(eventName, (data: any) => callback(data));
  }

  addLocation(thing: iThing): iGame {
    this.locations.push(thing);
    return this;
  }

  addCharacter(thing: iThing): iGame {
    this.characters.push(thing);
    return this;
  }

  addThing(thing: iThing): iGame {
    this.things.push(thing);
    return this;
  }

  addPatterns(patterns: iProperties<string>): iGame {
    this.parserPatterns = patterns;
    return this;
  }

  getRegister(): Map<string, iBehaviour> {
    return this.behaviourReg;
  }

  getPlayerKey(): string {
    return this.playerKey;
  }

  getCharacters(): Array<iThing> {
    return [...this.characters];
  }

  getActivePlayer(): iThing {
    return this.characters.find(p => p.key === this.playerKey);
  }

  getActiveLocation(): iThing {
    return this.locations.find(i => i.key === this.locationKey);
  }

  getLocationByKey(key: string = null): iThing {
    return this.locations.find(i => i.key === key);
  }

  setPlayerKey(key: string): iGame {
    this.playerKey = key;
    return this;
  }

  setLocationByKey(key: string): void {
    //const { locations } = this;
    const player = this.getActivePlayer();
    const from = this.getLocationByKey(this.locationKey);
    const to = this.getLocationByKey(key);

    //console.log(123);

    if (!player) throw Error("No player character set.");

    // if (!from && to) {
    //   player.insideKey = to.key;
    //   return pubsub.publish(events.locationChange, { from, to });
    // }

    if (to && to.key !== from.key) {
      player.insideKey = to.key;
      return this.pubsub.publish(events.locationChange, { from, to });
    }

    // if (!to && locations.length > 0) {
    //   player.insideKey = locations[0].key;
    //   return;
    // }
  }

  getLocations(): Array<iThing> {
    return [...this.locations];
  }

  getThingsByInsideKey(key: string, things: Array<iThing> = this.things): Array<iThing> {
    return things.filter(i => i.insideKey === key);
  }

  getLocationNouns(): Array<string> {
    return this.locations.map(l => l.noun);
  }

  getAllActiveThings(
    locationKey: string = this.locationKey,
    playerKey: string = this.playerKey
  ): Array<iThing> {
    return [
      ...this.getThingsByInsideKey(locationKey),
      ...this.getThingsByInsideKey(playerKey),
      ...this.getThingsByInsideKey(locationKey, this.getCharacters())
    ];
  }

  getThingByKey(key: string, things = this.things): iThing {
    return things.find(i => i.key === key);
  }

  getThings(): Array<iThing> {
    return this.things;
  }

  getThingsByNoun(
    noun: string,
    described: string = undefined,
    things: Array<iThing> = this.getAllActiveThings()
  ): Array<iThing> {
    const fThings = things.filter(t => {
      const isDescribed = described && t.described === described;
      const isNoun = noun && t.noun === noun;
      if (described && isDescribed && isNoun) return true;
      if (!described && isNoun) return true;
      return false;
    });
    return fThings;
  }

  resolveGameData(data: iGameData) {
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

    if (playerKey && characters.find(i => i.key === playerKey)) {
      this.setPlayerKey(playerKey);
    } else {
      const player = ThingMaker.make(
        {
          key: "__default__",
          noun: "player"
        },
        this.behaviourReg,
        this
      );
      this.addCharacter(player);
      this.setPlayerKey(player.key);
    }

    return this;
  }

  parseCommand(cmd: string, patterns: any = this.parserPatterns): iCommand {
    const msg = [];
    const parserResult = commandParser(cmd.toLocaleLowerCase(), patterns);
    const { nouns, verbs, described, input, terms } = parserResult;
    const verb = verbs[0];
    const locations = this.getThingsByNoun(nouns[0], described[0], this.getLocations());
    const firstThings = this.getThingsByNoun(nouns[0], described[0]);
    const secondThings = this.getThingsByNoun(nouns[1], described[1] || described[0]);

    const tLength = terms.length;
    const lLength = locations.length;
    const fLength = firstThings.length;
    const sLength = secondThings.length;

    let type = "";

    // check basic type - order is important!
    const cmdTypes = {
      gameCommand: tLength === 1 && this.gameCommands.has(input),
      nav: lLength > 0,
      complex: verb && nouns.length >= 2,
      simple: (verb && (fLength > 0 && sLength === 0)) || (fLength === 0 && sLength > 0)
    };
    type = Object.keys(cmdTypes).find(k => cmdTypes[k] && k) || type;

    // then check for errors
    const errTypes = {
      simpleNoThing: verb && !type && fLength === 0 && sLength === 0 && nouns.length > 0,
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
      msg.push(`Unknown action, unable to ${input}.`);
    }

    if (type === "simpleDuplicate") {
      type = "simpleDuplicate";
      msg.push(
        `Please be more descriptive and reference ${firstThings
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
      secondThings
    };

    if (this.log) console.log(result);
    return result;
  }

  command(command: string, patterns: any = this.parserPatterns): iCommand {
    const cmd = this.parseCommand(command, patterns);
    const { verb, type, locations, firstThings, secondThings, described, nouns, msg, input } = cmd;
    const hasMsg = msg.length > 0;
    let response: Function = () => `Invalid command: ${input}.`;
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

      if (type === "simple") {
        valid = true;
        response = firstThings[0].getAction(verb, cmd);
      }

      if (type === "complex") {
        valid = true;
        const first = firstThings.find(i => described.includes(i.name) || nouns.includes(i.name));
        const second = secondThings.find(i => described.includes(i.name) || nouns.includes(i.name));

        if (firstThings.length > 0 || secondThings.length > 0) {
          const thing = first || second;
          if (thing) response = thing.getAction(verb, cmd);
        }
      }
    }

    const res = { ...cmd, valid, response };
    this.pubsub.publish(events.commandCall, res);
    return res;
  }
}

export default Game;
