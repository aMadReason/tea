"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
exports.__esModule = true;
var compromise_1 = require("compromise");
var normalizeRules = {
    whitespace: true,
    "case": true,
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
var types = [
    "#ParserComplexImplicit",
    "#ParserComplex",
    "#ParserSimple"
];
var defaultPatterns = {
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
function commandParser(input, patterns) {
    if (patterns === void 0) { patterns = {}; }
    var words = __assign(__assign({}, defaultPatterns), patterns);
    var inputNoStop = input.replace(/\.+$/, "");
    var doc = compromise_1["default"](inputNoStop, words)
        .clone()
        .normalize(normalizeRules);
    Object.keys(words).map(function (p) { return doc.match(p).tag(words[p]); });
    var type = types.find(function (i) { return doc.has(i) && i; });
    var tags = doc.out("tags");
    var verbs = doc
        .verbs()
        .toInfinitive()
        .out("array");
    var nouns = doc
        .not("#Ignore")
        .match("#Noun")
        .out("array");
    var described = doc
        .not("#Direction|#Join")
        .match("#Adjective+ #Noun")
        .out("array");
    var joins = doc.match("#Join").out("array");
    var singulars = doc
        .nouns()
        .toSingular()
        .out("array");
    var adjectives = doc
        .not("#Direction")
        .match("#Adjective")
        .out("array");
    var directions = doc.match("#Direction").out("array");
    if (type === types[0] && nouns.length > 0) {
        adjectives.map(function (a) {
            var describedAd = a + " " + nouns[0];
            if (described.includes(describedAd))
                return undefined;
            return (described = __spread([describedAd], described));
        });
    }
    var command = [
        verbs[0],
        described[0] || nouns[0],
        joins[0] || null,
        described[1] || nouns[1] || ""
    ]
        .filter(function (i) { return i; })
        .join(" ");
    var strictCommand = [
        verbs[0],
        described[0] || singulars[0],
        joins[0] || null,
        described[1] || singulars[1] || ""
    ]
        .filter(function (i) { return i; })
        .join(" ");
    return {
        tags: tags,
        singulars: singulars,
        strictCommand: strictCommand,
        adjectives: adjectives,
        directions: directions,
        type: type,
        verbs: verbs,
        nouns: nouns,
        described: described,
        joins: joins,
        command: command
    };
}
exports["default"] = commandParser;
