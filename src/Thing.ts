import { genId } from "./modules/uuid";
import { iThing, behaviourMethod, iBehaviour, iProperties, iCommand, iGame } from "./_types";

class Thing implements iThing {
  insideKey = "";
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
    insideKey = "",
    properties = {},
    game = null,
    key = genId()
  }) {
    this.noun = noun;
    this.described = described;
    this.insideKey = insideKey || null;
    this.insideKey = insideKey || null;
    this.name = this.described || this.noun;
    this.key = key;
    this.game = game || null;

    Object.keys(properties).map(k => this.setProp(k, properties[k]));

    return this;
  }

  setInsideKey(key: string) {
    this.insideKey = key;
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

  hasMethod(key) {
    return this.methods.has(key);
  }

  getMethod(key: string, cmd: iCommand = null) {
    return () => this.methods.get(key)(this, cmd);
  }

  callMethod(key, cmd: iCommand = null) {
    return this.getMethod(key)();
  }

  setAction(key: string, value: string) {
    this.actions.set(key, value);
  }

  hasAction(key) {
    return this.actions.has(key);
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
