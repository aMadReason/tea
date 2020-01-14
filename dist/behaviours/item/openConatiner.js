const behaviour = {
  name: "openContainer",
  properties: {},
  methods: {
    take(ins, cmd = null) {
      return ``;
    },
    drop(ins) {
      return ``;
    },
    in(ins) {
      return ``;
    }
  },
  actions: {
    open: "open",
    close: "close",
    look: "in"
  }
};
Object.freeze(behaviour);
export default behaviour;
