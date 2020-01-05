import { Thing, iThing, iBehaviour } from "./index";
import { help, describe, examine } from "./behaviours";
import { iThingData, iGame } from "./_types";

export const defaultBehaviours = [describe, help, examine];

abstract class ThingMaker {
  static preProcess(data: iThingData) {
    const defaultBehaviors = defaultBehaviours.map(i => i.name);
    const dataBehaviours = data.behaviours || [];
    const behaviours = [...new Set([...defaultBehaviors, ...dataBehaviours])];
    const processedData = { ...data, behaviours };
    return processedData;
  }

  static make(
    data: iThingData,
    behaviourReg: Map<string, iBehaviour>,
    game: iGame
  ): iThing {
    const processedData = ThingMaker.preProcess(data);
    const {
      noun,
      described,
      behaviours,
      locationKey,
      key,
      properties
    } = processedData;

    const thing = new Thing({
      noun,
      properties,
      described,
      locationKey,
      key,
      game
    });

    if (!behaviours) return thing;

    behaviours.map(b => {
      const behaviour = behaviourReg.get(b);
      if (behaviour) thing.addBehaviour(behaviour);
      return null;
    });

    return thing;
  }
}

export default ThingMaker;
