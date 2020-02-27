export const gamedata = {
  playerKey: "peter",
  characters: [
    {
      key: "peter",
      noun: "peter",
      insideKey: "cabin"
    },
    {
      key: "bob",
      noun: "bob",
      insideKey: "cabin",
      behaviours: ["converse"],
      properties: {
        stateKey: "default",
        conversationResponses: [
          {
            verbs: ["say", "tell"],
            subject: "hello",
            response: "Hello"
          },
          {
            verbs: ["ask", "tell"],
            subject: "key",
            response: "The key can be used to unlock the door.",
            condition: { prop: "stateKey", operator: "=", value: "discoveredKey" }
          }
        ]
      }
    }
  ],
  things: [
    {
      noun: "apple",
      insideKey: "peter",
      properties: {
        descriptions: {
          default: "A tasty looking apple."
        }
      }
    },
    {
      noun: "door",
      insideKey: "deck",
      behaviours: ["usePortal"],
      properties: {
        filterActionsTo: ["use"],
        portalTo: "cabin",
        descriptions: {
          default: "A door leading to the cabin."
        }
      }
    },
    {
      noun: "door",
      insideKey: "cabin",
      behaviours: ["usePortal"],
      properties: {
        filterActionsTo: ["use"],
        portalTo: "deck",
        descriptions: {
          default: "A door leading to the deck."
        }
      }
    },
    {
      noun: "cup",
      insideKey: "cabin",
      described: "golden cup",
      behaviours: ["take"],
      properties: {
        filterActionsTo: [],
        stateKey: "initial",
        descriptions: {
          initial: "A small golden cup rests on it's side on the floor.",
          default: "A small golden cup.",
          dropped: "The golden cup you left here sits on the floor."
        },
        details: {
          default: "The {name} is made of plastic... disapointing."
        }
      }
    },
    {
      noun: "book",
      insideKey: "cabin",
      described: "red book",
      behaviours: ["take"],
      properties: {
        filterActionsTo: ["take", "drop", "examine"],
        descriptions: {
          default: "A shabby red book rests haphazardly on the ground."
        }
      }
    },
    {
      key: "green_book",
      noun: "book",
      insideKey: "cabin",
      described: "green book",
      behaviours: ["take", "lookInside", "takeInside"],
      properties: {
        filterActionsTo: ["take", "drop", "examine"],
        descriptions: {
          default: "A shabby green book rests haphazardly on the ground."
        }
      },
      actions: { open: "lookInside" }
    },
    {
      noun: "note",
      insideKey: "green_book",
      behaviours: ["take"],
      properties: {
        filterActionsTo: ["take", "drop", "examine"],
        descriptions: {
          default: "A note with the code: 427 written on it."
        }
      }
    },
    {
      noun: "rope",
      insideKey: "deck",
      behaviours: ["take"],
      properties: {
        filterActionsTo: ["take", "drop", "examine"],
        stateKey: "initial",
        descriptions: {
          initial: "A small coil of rope is hung on the wall.",
          default: "A small coil of rope.",
          dropped: "A small coil of rope sits on the floor."
        }
      }
    },
    {
      noun: "rooope",
      insideKey: "deck",
      behaviours: ["take"],
      properties: {
        filterActionsTo: ["take", "drop", "examine"],
        stateKey: "initial",
        descriptions: {
          initial: "A large coil of rooope is hung on the wall.",
          default: "A large coil of rooope.",
          dropped: "A large coil of rooope sits on the floor."
        }
      }
    }
  ],
  locations: [
    {
      key: "cabin",
      noun: "cabin",
      behaviours: ["goTo"],
      properties: {
        descriptions: {
          default: "The engine purrs constantly in the background. "
        }
      }
    },
    {
      key: "deck",
      noun: "deck",
      behaviours: ["goTo"],
      properties: {
        descriptions: {
          default:
            "Waves slap rythmically against the hull of the boat as the water rolls in time of the waves. The deck is sparse."
        }
      }
    }
  ]
};
