"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pubsub = {
    subs: new Map(),
    publish(event, data) {
        if (!this.subs[event])
            return;
        this.subs[event].forEach((subCallback) => subCallback(data));
    },
    subscribe(event, callback) {
        if (!this.subs[event])
            this.subs[event] = [];
        const index = this.subs[event].push(callback) - 1;
        return { unsubscribe: () => this.subs[event].splice(index, 1) };
    }
};
exports.default = pubsub;
