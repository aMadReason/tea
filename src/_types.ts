export interface iProperties<T> {
  [propName: string]: T;
}

interface iPubsub {
  subs: Map<string, Function>;
  subscribe: Function;
  publish: Function;
}

export interface iCommand {
  terms: Array<string>;
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
  input: string;
  verb?: string;
  locations?: Array<iThing>;
  firstThings?: Array<iThing>;
  inventoryThings?: Array<iThing>;
  msg?: Array<string>;
}

export type behaviourMethod = (t: iThing, cmd?: iCommand) => string;
export interface iBehaviour {
  name: string;
  methods: iProperties<behaviourMethod>;
  properties: iProperties<string | Array<string> | iProperties<string>>;
  actions: iProperties<string>; // maps verbs to method key
}

export type gameCommandMethod = (g: iGame, cmd?: iCommand) => string;
export interface iCommandMethod {
  name: string;
  method: gameCommandMethod;
}

export interface iGame {
  playerKey: string;
  things: Array<iThing>;
  characters: Array<iThing>;
  locations: Array<iThing>;
  behaviourReg: Map<string, iBehaviour>;
  gameCommands?: Map<string, gameCommandMethod>;
  capitalise(str: string): string;
  registerBehaviour(behaviour: iBehaviour | Array<iBehaviour>): void;
  getRegister(): Map<string, iBehaviour>;
  subscribe(evtName: string, callback: () => {}): void;
  addLocation(data: iThing): void;
  addCharacter(data: iThing): void;
  addThing(data: iThing): void;
  getCharacters(): Array<iThing>;
  getActivePlayer(): iThing;
  getActiveLocation(): iThing;
  getLocationByKey(key: string | null): iThing;
  getLocations(): Array<iThing>;
  getThingsByInsideKey(key: string | null): Array<iThing>;
  getLocationNouns(): Array<string>;
  getActiveThings(locationKey: string): Array<iThing>;
  getThingByKey(key: string, things: Array<iThing>): iThing;
  getThings(): Array<iThing>;
  getThingsByNoun(
    noun: string,
    described: string | undefined,
    things: Array<iThing>
  ): Array<iThing>;
  setLocationByKey(key: string | null): void;
  setPlayerKey(key: string | null): void;
  resolveGameData(iGameData: iGameData): iGame;
  parseCommand(cmd: string, patterns: iCommand);
  command(cmd: string, patterns: iCommand);
}

export interface iThing {
  key: string;
  noun: string;
  described: string | null;
  insideKey: string | null;
  name: string;
  game?: iGame | null;
  pubsub?: iPubsub | null;
  behaviours?: Array<string>;
  methods: Map<string, behaviourMethod>;
  properties: Map<string, string | iProperties<string | Array<string> | iProperties<string>>>;
  actions: Map<string, string>; // maps verbs to method key
  setInsideKey(key: string): void;
  setProp(
    key: string,
    value: string | iProperties<string | Array<string> | iProperties<string>> | Array<string>
  ): void;
  getProp(
    key: string
  ): undefined | string | Array<string> | iProperties<string | Array<string> | iProperties<string>>;
  setMethod(key: string, value: behaviourMethod): void;
  hasMethod(key: string): boolean;
  getMethod(key: string, cmd: iCommand | null): behaviourMethod;
  callMethod(key: string, cmd: iCommand | null): string;
  setAction(key: string, value: string): void;
  hasAction(key: string): boolean;
  getAction(key: string, cmd?: iCommand | null): () => string;
  getActionKeys(): Array<string>;
  addBehaviour(behaviour: iBehaviour): void;
}

// Data shapes
export interface iThingData {
  noun: string;
  key?: string;
  described?: string;
  insideKey?: string | null;
  behaviours?: Array<string>;
  properties?: iProperties<string | Array<string> | iProperties<string>>;
  actions?: iProperties<string>; // maps verbs to method key
}

export interface iGameData {
  playerKey?: string;
  locations: Array<iThingData>;
  things: Array<iThingData>;
}
