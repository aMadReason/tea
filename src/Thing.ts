import { genId } from "./modules/uuid";
import {
  iThing,
  behaviourMethod,
  iBehaviour,
  iProperties,
  iCommand,
  iGame
} from "./_types";

class Thing implements iThing {
  locationKey = "";
  noun = "";
  described = "";
  name = "";
  properties = new Map();
  methods = new Map();
  actions = new Map();
  key = "";
  game: iGame = null;

  constructor({
    noun = "",
    described = "",
    locationKey = null,
    properties = {},
    game = null,
    pubsub = null,
    key = genId()
  }) {
    this.noun = noun;
    this.described = described;
    this.locationKey = locationKey;
    this.name = this.described || this.noun;
    this.key = key;
    this.game = game;

    Object.keys(properties).map(k => this.setProp(k, properties[k]));

    return this;
  }

  setLocationKey(key: string) {
    this.locationKey = key;
  }

  setProp(key: string, value: string | iProperties<string> | Array<string>) {
    this.properties.set(key, value);
  }

  getProp(key: string) {
    return this.properties.get(key);
  }

  setMethod(key: string, value: behaviourMethod) {
    this.methods.set(key, value);
  }

  getMethod(key: string, cmd: iCommand) {
    return () => this.methods.get(key)(this, cmd);
  }

  setAction(key: string, value: string) {
    this.actions.set(key, value);
  }

  getAction(key: string, cmd: iCommand = null) {
    const methodKey = this.actions.get(key);
    return this.getMethod(methodKey, cmd);
  }

  getActionKeys() {
    return [...this.actions.keys()];
  }

  addBehaviour(behaviour: iBehaviour) {
    const { properties, methods, actions } = behaviour;

    if (properties) {
      Object.keys(properties).map(p => {
        if (!this.getProp(p)) this.setProp(p, properties[p]);
        return null;
      });
    }

    if (methods) {
      Object.keys(methods).map(m => this.setMethod(m, methods[m]));
    }

    if (actions) {
      Object.keys(actions).map(a => this.setAction(a, actions[a]));
    }

    return this;
  }
}

export default Thing;
