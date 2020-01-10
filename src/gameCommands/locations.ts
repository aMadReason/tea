import { iCommandMethod, iGame } from "../index";
const gameCommand: iCommandMethod = {
  name: "locations",
  method: (g: iGame, cmd) => {
    const first = `Locations available:`;
    let locs = [...g.getLocationNouns()];

    if (Array.isArray(locs) && locs.length === 0) return `No locations available`;
    if (locs.length === 1) return `${first} ${locs.join(", ")}`;

    const last = locs.pop();
    return `${first} ${locs.join(", ")} and ${last}.`;
  }
};

export default gameCommand;
