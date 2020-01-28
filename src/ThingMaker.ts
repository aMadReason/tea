import { Thing, iThing, iBehaviour } from "./index";
import { help, describe, examine } from "./behaviours/index";
import { iThingData, iGame } from "./_types";

export const defaultBehaviours = [describe, help, examine];

abstract class ThingMaker {
  static preProcess(data: iThingData): iThingData {
    const defaultBehaviors = defaultBehaviours.map(i => i.name);
    const dataBehaviours = data.behaviours || [];
    const behaviours = [...new Set([...defaultBehaviors, ...dataBehaviours])];
    const processedData = { ...data, behaviours };
    return processedData;
  }

  static make(data: iThingData, behaviourReg: Map<string, iBehaviour>, game: iGame): iThing {
    const processedData = ThingMaker.preProcess(data);
    const { noun, described, behaviours, insideKey, key, properties, actions } = processedData;

    const thing = new Thing({
      noun,
      properties,
      described,
      insideKey,
      key,
      game
    });

    if (!behaviours) return thing;

    behaviours.map(b => {
      const behaviour = behaviourReg.get(b);
      if (behaviour) thing.addBehaviour(behaviour);
      return null;
    });

    // assign custom actions over actions set by behaviours
    if (actions) {
      Object.keys(actions).map(k => thing.setAction(k, actions[k]));
    }

    return thing;
  }
}

export default ThingMaker;
