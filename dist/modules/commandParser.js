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
const types = [
    "#ParserComplexImplicit",
    "#ParserComplex",
    "#ParserSimple"
];
const defaultPatterns = {
    open: "Verb",
    cup: "Noun",
    golden: "Adjective",
    "(it)": "Ignore",
    "(light|mix)$": "Noun",
    "^(light|mix|move|shift|pick)": "Verb",
    "(#Conjunction|above|adjacent|beside|under|over|above|on|over|in|inside)": "Join",
    "(north|east|south|west|left|right|up|down)": "Direction",
    "#Verb (#Determiner|#Preposition)? #Adjective+ (with|using|on|using|and) (#Determiner|#Preposition)? #Adjective #Noun$": "ParserComplexImplicit",
    "#Verb (#Determiner|#Preposition)? #Adjective+? #Noun #Join? (#Determiner|#Preposition)? #Adjective+? #Noun": "ParserComplex",
    "#Verb (#Determiner|#Preposition)? #Adjective+? #Noun": "ParserSimple"
};
export default function commandParser(original, patterns = {}) {
    const words = Object.assign(Object.assign({}, defaultPatterns), patterns);
    const originalNoStop = original.replace(/\.+$/, "");
    const doc = nlp(originalNoStop, words)
        .clone()
        .normalize(normalizeRules);
    Object.keys(words).map(p => doc.match(p).tag(words[p]));
    const type = types.find(i => doc.has(i) && i);
    const tags = doc.out("tags");
    const terms = doc.terms().out("array");
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
        .out("array");
    const joins = doc.match("#Join").out("array");
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
            if (described.includes(describedAd))
                return undefined;
            return (described = [describedAd, ...described]);
        });
    }
    const input = [
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
        terms,
        tags,
        singulars,
        strictCommand,
        adjectives,
        directions,
        type,
        verbs,
        nouns,
        described,
        joins,
        input
    };
}
