function isMet(propVal, operator, checkVal) {
    return {
        "=": propVal === checkVal,
        ">": propVal > checkVal,
        "<": propVal < checkVal,
        ">=": propVal >= checkVal,
        "<=": propVal <= checkVal,
        "!=": propVal !== checkVal,
        includes: propVal && propVal.includes(checkVal)
    }[operator];
}
const converse = {
    name: "converse",
    properties: {
        conversationResponses: [
            { verbs: ["answer", "say", "ask", "show", "tell"], response: "{name}: ..." }
        ]
    },
    methods: {
        converse(ins, cmd = null) {
            const name = ins.game.capitalise(ins.name);
            const { verb, input } = cmd;
            const responses = ins.getProp("conversationResponses");
            let resObj = responses.find((r) => r.verbs.includes(verb) && input.includes(r.subject));
            resObj = resObj ? resObj : responses.find((r) => r.verbs.includes(verb) && !r.subject);
            let conditionsMet = true;
            const { conditions = [], response = "" } = resObj;
            conditions.map((c) => {
                const { operator, value, prop } = c || {};
                const propVal = ins.getProp(prop);
                const met = isMet(propVal, operator, value);
                conditionsMet = conditionsMet ? met : conditionsMet;
                return null;
            });
            if (conditionsMet)
                return response.replace("{name}", name);
            return `There is no response.`;
        }
    },
    actions: {
        answer: "converse",
        say: "converse",
        ask: "converse",
        show: "converse",
        tell: "converse"
    }
};
Object.freeze(converse);
export default converse;
