import { iCommandMethod } from "../index";
const gameCommand: iCommandMethod = {
  name: "location",
  method: (g, cmd = null) => {
    const loc = g.getActiveLocation();

    return `The current location is the ${loc.name}.`;
  }
};

export default gameCommand;
