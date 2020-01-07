export interface iProperties<T> {
  [propName: string]: T;
}

interface iPubsub {
  subs: Map<String, Function>;
  subscribe: Function;
  publish: Function;
}

export interface iCommand {
  tags: Array<any>;
  singulars: Array<string>;
  strictCommand: string;
  adjectives: Array<string>;
  directions: Array<string>;
  type: string | boolean;
  verbs: Array<string>;
  nouns: Array<string>;
  described: Array<string>;
  joins: Array<string>;
  command: string;
  verb?: string;
  locations?: Array<iThing>;
  firstThings?: Array<iThing>;
  inventoryThings?: Array<iThing>;
  msg?: Array<string>;
}

export type behaviourMethod = (ins: iThing, cmd?: iCommand) => string;

export interface iBehaviour {
  name: string;
  methods: iProperties<behaviourMethod>;
  properties: iProperties<string | Array<string> | iProperties<string>>;
  actions: iProperties<string>; // maps verbs to method key
}

export interface iGame {
  location: string;
  locations: Array<iThing>;
  things: Array<iThing>;
  behaviourReg: Map<string, iBehaviour>;
  registerBehaviour(behaviour: iBehaviour): void;
  getRegister(): Map<string, iBehaviour>;
  subscribe(evtName: string, callback: () => {}): void;
  addLocation(data: iThing): void;
  addThing(data: iThing): void;
  getActiveLocation(): iThing;
  setLocationByKey(key: string): void;
  getLocationByKey(key: string): iThing;
}

export interface iThing {
  key: string;
  noun: string;
  described: string;
  name: string;
  locationKey?: string | null;
  game?: iGame | null;
  pubsub?: iPubsub | null;
  behaviours?: Array<string>;
  methods: Map<string, behaviourMethod>;
  properties: Map<string, string | iProperties<string | Array<string> | iProperties<string>>>;
  actions: Map<string, string>; // maps verbs to method key
  setLocationKey(key: string): void;
  setProp(
    key: string,
    value: string | iProperties<string | Array<string> | iProperties<string>> | Array<string>
  ): void;
  getProp(key: string): string | Array<string> | iProperties<string | Array<string> | iProperties<string>>;
  setMethod(key: string, value: behaviourMethod): void;
  hasMethod(key: string): boolean;
  getMethod(key: string, cmd: iCommand): behaviourMethod;
  setAction(key: string, value: string): void;
  hasAction(key: string): boolean;
  getAction(key: string, cmd?: iCommand): () => string;
  getActionKeys(): Array<string>;
}

// Data shapes
export interface iThingData {
  noun: string;
  key?: string;
  described?: string;
  locationKey?: string;
  behaviours?: Array<string>;
  properties?: iProperties<string | Array<string> | iProperties<string>>;
  actions?: iProperties<string>; // maps verbs to method key
}

export interface iGameData {
  location?: string;
  locations: Array<iThingData>;
  things: Array<iThingData>;
}
