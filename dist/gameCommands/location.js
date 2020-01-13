const gameCommand = {
    name: "location",
    method: (g, cmd = null) => {
        const loc = g.getActiveLocation();
        return `The current location is the ${loc.name}.`;
    }
};
export default gameCommand;
