const gameCommand = {
    name: "location",
    method: (g, cmd = null) => {
        const loc = g.getActiveLocation();
        const player = g.getActivePlayer();
        if (loc)
            return `The current location is the ${loc.name}.`;
        return `Active location '${player.insideKey}' doesn't exist in game.`;
    }
};
Object.freeze(gameCommand);
export default gameCommand;
