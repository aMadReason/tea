import { Thing } from "../index";

const behaviour = {
  name: "usePortal",
  properties: {
    portalTo: "",
    badPortalMsg: "Broken portal"
  },
  methods: {
    use(ins: Thing): String {
      const locationKey = ins.getProp("portalTo");
      const location = ins.game.getLocationByKey(locationKey);
      if (!location) return ins.getProp("badPortalMsg").toString();
      ins.game.setLocationByKey(location.key);
      return `Moved to ${location.name}.`;
    }
  },
  actions: {
    use: "use"
  }
};
Object.freeze(behaviour);
export default behaviour;
