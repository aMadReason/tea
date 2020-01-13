import { Thing } from "./index";
import { help, describe, examine } from "./behaviours/index";
export const defaultBehaviours = [describe, help, examine];
class ThingMaker {
    static preProcess(data) {
        const defaultBehaviors = defaultBehaviours.map(i => i.name);
        const dataBehaviours = data.behaviours || [];
        const behaviours = [...new Set([...defaultBehaviors, ...dataBehaviours])];
        const processedData = Object.assign(Object.assign({}, data), { behaviours });
        return processedData;
    }
    static make(data, behaviourReg, game) {
        const processedData = ThingMaker.preProcess(data);
        const { noun, described, behaviours, insideKey, key, properties } = processedData;
        const thing = new Thing({
            noun,
            properties,
            described,
            insideKey,
            key,
            game
        });
        if (!behaviours)
            return thing;
        behaviours.map(b => {
            const behaviour = behaviourReg.get(b);
            if (behaviour)
                thing.addBehaviour(behaviour);
            return null;
        });
        return thing;
    }
}
export default ThingMaker;
