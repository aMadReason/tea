export function pubsub() {
    return {
        subs: new Map(),
        publish(event, data) {
            console.log(123);
            if (!this.subs[event])
                return;
            this.subs[event].forEach((subCallback) => {
                subCallback(Object.assign({ subEvent: event }, data));
            });
        },
        subscribe(event, callback) {
            if (!this.subs[event])
                this.subs[event] = [];
            const index = this.subs[event].push(callback) - 1;
            return { unsubscribe: () => this.subs[event].splice(index, 1) };
        }
    };
}
