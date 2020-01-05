"use strict";
exports.__esModule = true;
var pubsub = {
    subs: new Map(),
    publish: function (event, data) {
        if (!this.subs[event])
            return;
        this.subs[event].forEach(function (subCallback) { return subCallback(data); });
    },
    subscribe: function (event, callback) {
        var _this = this;
        if (!this.subs[event])
            this.subs[event] = [];
        var index = this.subs[event].push(callback) - 1;
        return { unsubscribe: function () { return _this.subs[event].splice(index, 1); } };
    }
};
exports["default"] = pubsub;
