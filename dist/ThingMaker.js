"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
const index_2 = require("./behaviours/index");
exports.defaultBehaviours = [index_2.describe, index_2.help, index_2.examine];
class ThingMaker {
    static preProcess(data) {
        const defaultBehaviors = exports.defaultBehaviours.map(i => i.name);
        const dataBehaviours = data.behaviours || [];
        const behaviours = [...new Set([...defaultBehaviors, ...dataBehaviours])];
        const processedData = Object.assign(Object.assign({}, data), { behaviours });
        return processedData;
    }
    static make(data, behaviourReg, game) {
        const processedData = ThingMaker.preProcess(data);
        const { noun, described, behaviours, locationKey, key, properties } = processedData;
        const thing = new index_1.Thing({
            noun,
            properties,
            described,
            locationKey,
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
exports.default = ThingMaker;
