export function pubsub() {
  return {
    subs: new Map(),
    publish(event: string, data: any): void {
      console.log(123);
      if (!this.subs[event]) return;
      this.subs[event].forEach((subCallback: Function) => {
        subCallback({ subEvent: event, ...data });
      });
      // this.subs[event].forEach((subCallback: Function) => {
      //   subCallback({ subEvent: event, ...data });
      // });
    },
    subscribe(event: string, callback: Function) {
      if (!this.subs[event]) this.subs[event] = [];
      const index = this.subs[event].push(callback) - 1;
      return { unsubscribe: () => this.subs[event].splice(index, 1) };
    }
  };
}

/**usage example
const subscriber1 = pubSub.subscribe("anEvent", data => {
  console.log(`"anEvent", was published with this data: "${data.moo}"`);
});

pubSub.publish("anEvent", { moo: "123" });
pubSub.publish("anEvent", { moo: "321" });

subscriber1.unsubscribe();

pubSub.publish("anEvent", { moo: "heeey" }); 
 */
