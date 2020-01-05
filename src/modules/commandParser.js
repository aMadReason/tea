import nlp from "compromise";

const normalizeRules = {
  whitespace: true,
  case: true,
  punctuation: true,
  unicode: true,
  contractions: true,
  acronyms: true,
  parentheses: false,
  possessives: false,
  plurals: false,
  verbs: false,
  honorifics: false
};

// most restrictive first
const types = [
  "#ParserComplexImplicit", // mix red and blue paint (both are paint but one is implicit)
  "#ParserComplex", // mix red paint and blue paint (explicit)
  "#ParserSimple" // mix paint 'basic'
];

const defaultPatterns = {
  open: "Verb",
  cup: "Noun",
  golden: "Adjective",
  "(it)": "Ignore",
  "(light|mix)$": "Noun",
  "^(light|mix|move|shift|pick)": "Verb",
  "(#Conjunction|above|adjacent|beside|under|over|above|on|over|in|inside)":
    "Join",
  "(north|east|south|west|left|right|up|down)": "Direction",
  "#Verb (#Determiner|#Preposition)? #Adjective+ (with|using|on|using|and) (#Determiner|#Preposition)? #Adjective #Noun$":
    "ParserComplexImplicit",
  "#Verb (#Determiner|#Preposition)? #Adjective+? #Noun #Join? (#Determiner|#Preposition)? #Adjective+? #Noun":
    "ParserComplex",
  "#Verb (#Determiner|#Preposition)? #Adjective+? #Noun": "ParserSimple"
};

export default function commandParser(input, patterns = {}) {
  const words = { ...defaultPatterns, ...patterns };
  const inputNoStop = input.replace(/\.+$/, ""); // removes full stop
  const doc = nlp(inputNoStop, words)
    .clone()
    .normalize(normalizeRules);

  Object.keys(words).map(p => doc.match(p).tag(words[p]));
  const type = types.find(i => doc.has(i) && i);

  // Get output
  const tags = doc.out("tags");
  const verbs = doc
    .verbs()
    .toInfinitive()
    .out("array");
  const nouns = doc
    .not("#Ignore")
    .match("#Noun")
    .out("array");
  let described = doc
    .not("#Direction|#Join")
    .match("#Adjective+ #Noun")
    .out("array"); // unable to filter valid
  const joins = doc.match("#Join").out("array");

  // additionals
  // const infinitives = doc
  //   .verbs()
  //   .toInfinitive()
  //   .conjugate()
  //   .map(i => i.Infinitive);
  const singulars = doc
    .nouns()
    .toSingular()
    .out("array");
  const adjectives = doc
    .not("#Direction")
    .match("#Adjective")
    .out("array");
  const directions = doc.match("#Direction").out("array");

  if (type === types[0] && nouns.length > 0) {
    adjectives.map(a => {
      const describedAd = a + " " + nouns[0];
      if (described.includes(describedAd)) return undefined; // prevent dupes
      return (described = [describedAd, ...described]);
    });
  }

  // Commands
  const command = [
    verbs[0],
    described[0] || nouns[0],
    joins[0] || null,
    described[1] || nouns[1] || ""
  ]
    .filter(i => i)
    .join(" ");

  const strictCommand = [
    verbs[0],
    described[0] || singulars[0],
    joins[0] || null,
    described[1] || singulars[1] || ""
  ]
    .filter(i => i)
    .join(" ");

  return {
    tags,
    //infinitives,
    singulars,
    strictCommand,
    adjectives,
    directions,
    type,
    verbs,
    nouns,
    described,
    joins,
    command
  };
}
