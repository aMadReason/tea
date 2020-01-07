import { genId } from "./modules/uuid";
class Thing {
    constructor({ noun = "", described = "", locationKey = "", properties = {}, game = null, key = genId() }) {
        this.locationKey = "";
        this.noun = "";
        this.described = "";
        this.name = "";
        this.properties = new Map();
        this.methods = new Map();
        this.actions = new Map();
        this.key = "";
        this.game = null;
        this.noun = noun;
        this.described = described;
        this.locationKey = locationKey || null;
        this.name = this.described || this.noun;
        this.key = key;
        this.game = game || null;
        Object.keys(properties).map(k => this.setProp(k, properties[k]));
        return this;
    }
    setLocationKey(key) {
        this.locationKey = key;
    }
    setProp(key, value) {
        this.properties.set(key, value);
    }
    getProp(key) {
        return this.properties.get(key);
    }
    setMethod(key, value) {
        this.methods.set(key, value);
    }
    hasMethod(key) {
        return this.methods.has(key);
    }
    getMethod(key, cmd) {
        const method = this.methods.get(key);
        return () => method(this, cmd);
    }
    setAction(key, value) {
        this.actions.set(key, value);
    }
    hasAction(key) {
        return this.actions.has(key);
    }
    getAction(key, cmd = null) {
        const methodKey = this.actions.get(key);
        return this.getMethod(methodKey, cmd);
    }
    getActionKeys() {
        return [...this.actions.keys()];
    }
    addBehaviour(behaviour) {
        const { properties, methods, actions } = behaviour;
        if (properties) {
            Object.keys(properties).map(p => {
                if (!this.getProp(p))
                    this.setProp(p, properties[p]);
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
