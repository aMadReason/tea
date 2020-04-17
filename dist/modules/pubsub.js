const pubsub = {
    subs: new Map(),
    publish(event, data) {
        if (!this.subs[event])
            return;
        this.subs[event].forEach((subCallback) => {
            if (typeof subCallback === 'function')
                subCallback(data);
        });
    },
    subscribe(event, callback) {
        if (!this.subs[event])
            this.subs[event] = [];
        const index = this.subs[event].push(callback) - 1;
        return { unsubscribe: () => this.subs[event].splice(index, 1) };
    }
};
export default pubsub;
