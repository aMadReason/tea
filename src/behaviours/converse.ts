import { iBehaviour } from "../index";
// gives brief description of thing depending on its state.

const converse: iBehaviour = {
  name: "converse",
  properties: {
    conversationResponses: []
  },
  methods: {
    converse(ins, cmd = null): string {
      const name = ins.game.capitalise(ins.name);
      const { verb, input } = cmd;
      const responses = ins.getProp("conversationResponses");
      const responseObj = responses.find(r => r.verbs.includes(verb) && input.includes(r.subject));

      if (!responseObj) return `${ins.name} doesn't respond.`;
      const { condition, response } = responseObj;
      const { operator, value, prop } = condition || {};

      const propVal = ins.getProp(prop);

      const met = {
        "=": propVal === value,
        ">": propVal > value,
        "<": propVal < value,
        ">=": propVal >= value,
        "<=": propVal <= value,
        "!=": propVal !== value,
        includes: propVal && propVal.includes(value)
      }[operator];

      if (met || !condition) return `${name}: ${response}.`;

      return `They don't seem to want to talk about it right now.`;
    }
  },
  actions: {
    say: "converse",
    ask: "converse",
    show: "converse",
    tell: "converse"
  }
};

Object.freeze(converse);
export default converse;
