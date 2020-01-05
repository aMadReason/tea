"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
exports.__esModule = true;
var uuid_1 = require("./modules/uuid");
var Thing = (function () {
    function Thing(_a) {
        var _this = this;
        var _b = _a.noun, noun = _b === void 0 ? "" : _b, _c = _a.described, described = _c === void 0 ? "" : _c, _d = _a.locationKey, locationKey = _d === void 0 ? "" : _d, _e = _a.properties, properties = _e === void 0 ? {} : _e, _f = _a.game, game = _f === void 0 ? null : _f, _g = _a.key, key = _g === void 0 ? uuid_1.genId() : _g;
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
        Object.keys(properties).map(function (k) { return _this.setProp(k, properties[k]); });
        return this;
    }
    Thing.prototype.setLocationKey = function (key) {
        this.locationKey = key;
    };
    Thing.prototype.setProp = function (key, value) {
        this.properties.set(key, value);
    };
    Thing.prototype.getProp = function (key) {
        return this.properties.get(key);
    };
    Thing.prototype.setMethod = function (key, value) {
        this.methods.set(key, value);
    };
    Thing.prototype.getMethod = function (key, cmd) {
        var _this = this;
        return function () { return _this.methods.get(key)(_this, cmd); };
    };
    Thing.prototype.setAction = function (key, value) {
        this.actions.set(key, value);
    };
    Thing.prototype.getAction = function (key, cmd) {
        if (cmd === void 0) { cmd = null; }
        var methodKey = this.actions.get(key);
        return this.getMethod(methodKey, cmd);
    };
    Thing.prototype.getActionKeys = function () {
        return __spread(this.actions.keys());
    };
    Thing.prototype.addBehaviour = function (behaviour) {
        var _this = this;
        var properties = behaviour.properties, methods = behaviour.methods, actions = behaviour.actions;
        if (properties) {
            Object.keys(properties).map(function (p) {
                if (!_this.getProp(p))
                    _this.setProp(p, properties[p]);
                return null;
            });
        }
        if (methods) {
            Object.keys(methods).map(function (m) { return _this.setMethod(m, methods[m]); });
        }
        if (actions) {
            Object.keys(actions).map(function (a) { return _this.setAction(a, actions[a]); });
        }
        return this;
    };
    return Thing;
}());
exports["default"] = Thing;
