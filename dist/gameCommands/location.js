const gameCommand = {
    name: "location",
    method: (g, cmd = null) => {
        const loc = g.getActiveLocation();
        return `The current location is the ${loc.name}.`;
    }
};
Object.freeze(gameCommand);
export default gameCommand;
