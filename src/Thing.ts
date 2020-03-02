import { genId } from "./modules/uuid";
import { iThing, iCommand, iGame, behaviourMethod, iBehaviour } from "./_types";

class Thing implements iThing {
  insideKey: string = "";
  noun: string = "";
  described: string = "";
  properties: Map<string, any> = new Map();
  methods: Map<string, behaviourMethod> = new Map();
  actions: Map<string, string> = new Map();
  key: string = "";
  game: iGame = null;

  get name(): string {
    return this.described || this.noun;
  }

  constructor({
    noun = "",
    described = "",
    insideKey = "",
    properties = {},
    game = null,
    key = genId()
  }: {
    noun: string;
    described: string;
    insideKey: string;
    properties: any;
    game: iGame;
    key: string;
  }) {
    this.noun = noun;
    this.described = described;
    this.insideKey = insideKey || null;
    this.insideKey = insideKey || null;
    this.key = key;
    this.game = game || null;

    Object.keys(properties).map(k => this.setProp(k, properties[k]));

    return this;
  }

  setInsideKey(key: string): void {
    this.insideKey = key;
  }

  setProp(key: string, value: any): void {
    this.properties.set(key, value);
  }

  getProp(key: string): any {
    return this.properties.get(key);
  }

  setMethod(key: string, value: behaviourMethod): void {
    this.methods.set(key, value);
  }

  hasMethod(key: string): boolean {
    return this.methods.has(key);
  }

  getMethod(key: string, cmd: iCommand = null): behaviourMethod {
    return () => this.methods.get(key)(this, cmd);
  }

  callMethod(key: string, cmd: iCommand = null): string {
    const method = this.getMethod(key, cmd);
    return method(this, cmd);
  }

  setAction(key: string, value: string): void {
    this.actions.set(key, value);
  }

  hasAction(key: string): boolean {
    return this.actions.has(key);
  }

  getAction(key: string, cmd: iCommand = null): behaviourMethod {
    const methodKey = this.actions.get(key);
    return this.getMethod(methodKey, cmd);
  }

  getActionKeys(): Array<string> {
    return [...this.actions.keys()];
  }

  addBehaviour(behaviour: iBehaviour): iThing {
    const { properties, methods, actions } = behaviour;

    if (properties) {
      Object.keys(properties).map(p => {
        const prop = this.getProp(p);
        if (!prop) this.setProp(p, properties[p]);
        if (prop && typeof prop === "object") this.setProp(p, { ...properties[p], ...prop });
        if (prop && Array.isArray(prop)) this.setProp(p, [...properties[p], ...prop]);
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
