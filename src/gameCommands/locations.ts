import { iCommandMethod } from "../index";
const gameCommand: iCommandMethod = {
  name: "locations",
  method: (g, cmd = null) => {
    const first = `Locations available:`;
    let locs = [...g.getLocationNouns()];

    if (Array.isArray(locs) && locs.length === 0) return `No locations available`;
    if (locs.length === 1) return `${first} ${locs.join(", ")}`;

    const last = locs.pop();
    return `${first} ${locs.join(", ")} and ${last}.`;
  }
};

Object.freeze(gameCommand);
export default gameCommand;
