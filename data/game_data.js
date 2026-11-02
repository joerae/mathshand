/**
 * AUTO-GENERATED FILE — DO NOT EDIT BY HAND.
 *
 * Source: Google Docs (online)
 * Regenerate with: npm run import-data
 *
 * Edit the spreadsheet or Google Doc; it is the source of truth for all game content.
 */
export const GAME_DATA = {
  "source": "Google Docs (online)",
  "importedAt": "2026-11-02T21:39:05.066Z",
  "seaOrder": [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G"
  ],
  "config": {
    "marketSize": 5
  },
  "seas": [
    {
      "id": "A_Sea",
      "letter": "A",
      "name": "Shallow Reef",
      "description": "Getting Used to the Game. Number Bonds",
      "mathsFocus": "Addition +1 to +9",
      "encounterRulesText": "Fixed 4 encounters: Sea A cards 1-4 in order",
      "fishPerAdventure": 4,
      "randomised": false,
      "fishSlots": [
        "A_Fish",
        "A_Fish_2",
        "A_Fish_3",
        "A_Fish_2"
      ],
      "startFishId": "A_Fish",
      "finalFishId": "A_Fish_2",
      "fixedFishIds": [
        "A_Fish",
        "A_Fish_2",
        "A_Fish_3",
        "A_Fish_2"
      ],
      "newNumberCardsText": "+1,+2,+3,+4,+5,+6,+7,+8,+9"
    },
    {
      "id": "B_Sea",
      "letter": "B",
      "name": "Extended Addition",
      "description": "Unlocking new cards, hitting new targets. Number bonds for 10,20,30",
      "mathsFocus": "+10, +12, +20; bonds across 10/20/30",
      "encounterRulesText": "Start with Clownfish with a Chainsaw. Rest are random",
      "fishPerAdventure": 5,
      "randomised": true,
      "fishSlots": [
        "A_Fish",
        null,
        null,
        null,
        null
      ],
      "startFishId": "A_Fish",
      "finalFishId": null,
      "fixedFishIds": null,
      "newNumberCardsText": "+10,+12,+20,"
    },
    {
      "id": "C_Sea",
      "letter": "C",
      "name": "Negative Depths",
      "description": "Getting used to hitting negative numbers",
      "mathsFocus": "−1 to −5, −10; negative targets",
      "encounterRulesText": "Start with Moray Eel. Randomised Centre. Finish with Anglerfish",
      "fishPerAdventure": 5,
      "randomised": true,
      "fishSlots": [
        "C_Fish",
        null,
        null,
        null,
        "C_Fish_2"
      ],
      "startFishId": "C_Fish",
      "finalFishId": "C_Fish_2",
      "fixedFishIds": null,
      "newNumberCardsText": "-1,-2,-3,-4,-5,-10"
    },
    {
      "id": "D_Sea",
      "letter": "D",
      "name": "Double Trouble",
      "description": "Getting used to multiplying with x2 and x10",
      "mathsFocus": "×2 and ×10",
      "encounterRulesText": "Start with Lionfish. Rest are random",
      "fishPerAdventure": 5,
      "randomised": true,
      "fishSlots": [
        "B_Fish",
        null,
        null,
        null,
        "D_Fish_2"
      ],
      "startFishId": "B_Fish",
      "finalFishId": "D_Fish_2",
      "fixedFishIds": null,
      "newNumberCardsText": "x2, x10"
    },
    {
      "id": "E_Sea",
      "letter": "E",
      "name": "Multiplication Reef",
      "description": "Get used to multiplying x3,x4,x5",
      "mathsFocus": "×3, ×4, ×5",
      "encounterRulesText": "Start with Electric eel. Finish with Hydra",
      "fishPerAdventure": 5,
      "randomised": true,
      "fishSlots": [
        "A_Fish_2",
        null,
        null,
        null,
        "E_Fish_2"
      ],
      "startFishId": "A_Fish_2",
      "finalFishId": "E_Fish_2",
      "fixedFishIds": null,
      "newNumberCardsText": "x3,x4,x5"
    },
    {
      "id": "F_Sea",
      "letter": "F",
      "name": "Negative Currents",
      "description": "Learn about multiplifying 6,7,8,9",
      "mathsFocus": "x6 to x9",
      "encounterRulesText": "Finish with Theiving Sqiud",
      "fishPerAdventure": 5,
      "randomised": true,
      "fishSlots": [
        null,
        null,
        null,
        null,
        "F_Fish"
      ],
      "startFishId": null,
      "finalFishId": "F_Fish",
      "fixedFishIds": null,
      "newNumberCardsText": "x6,x7,x8,x9"
    },
    {
      "id": "G_Sea",
      "letter": "G",
      "name": "Times Table Trench",
      "description": "Adding negative multiplicaiton of 2,3,4 and 10 against -6 to -9",
      "mathsFocus": "Negative multiplication and all over revision and great stuff",
      "encounterRulesText": "",
      "fishPerAdventure": 5,
      "randomised": true,
      "fishSlots": [
        null,
        null,
        null,
        null,
        "G_Fish"
      ],
      "startFishId": null,
      "finalFishId": "G_Fish",
      "fixedFishIds": null,
      "newNumberCardsText": "-6,-7,-8,-9"
    }
  ],
  "scooters": [
    {
      "id": "A_Scooter",
      "sea": "A",
      "name": "Underwater Scooter",
      "battery": 4,
      "handCapacity": 8,
      "startingHand": [
        {
          "op": "+",
          "value": 1,
          "label": "+1",
          "target": 1
        },
        {
          "op": "+",
          "value": 2,
          "label": "+2",
          "target": 2
        },
        {
          "op": "+",
          "value": 3,
          "label": "+3",
          "target": 3
        }
      ],
      "abilityText": "",
      "abilities": {},
      "concept": "Initial scooter",
      "status": "Agreed",
      "notes": ""
    },
    {
      "id": "B_Scooter",
      "sea": "B",
      "name": "Ten Speed Scooter",
      "battery": 4,
      "handCapacity": 7,
      "startingHand": [
        {
          "op": "+",
          "value": 1,
          "label": "+1",
          "target": 1
        },
        {
          "op": "+",
          "value": 5,
          "label": "+5",
          "target": 5
        },
        {
          "op": "+",
          "value": 10,
          "label": "+10",
          "target": 10
        }
      ],
      "abilityText": "",
      "abilities": {},
      "concept": "Larger addition starting toolkit",
      "status": "Proposed",
      "notes": ""
    },
    {
      "id": "C_Scooter",
      "sea": "C",
      "name": "Reverse Gear Scooter",
      "battery": 4,
      "handCapacity": 9,
      "startingHand": [
        {
          "op": "+",
          "value": 2,
          "label": "+2",
          "target": 2
        },
        {
          "op": "+",
          "value": 4,
          "label": "+4",
          "target": 4
        },
        {
          "op": "+",
          "value": 9,
          "label": "+9",
          "target": 9
        },
        {
          "op": "-",
          "value": 3,
          "label": "−3",
          "target": 3
        },
        {
          "op": "-",
          "value": 5,
          "label": "−5",
          "target": 5
        }
      ],
      "abilityText": "",
      "abilities": {},
      "concept": "Subtraction-focused scooter",
      "status": "Working",
      "notes": ""
    },
    {
      "id": "D_Scooter",
      "sea": "D",
      "name": "Double Drive Scooter",
      "battery": 3,
      "handCapacity": 8,
      "startingHand": [
        {
          "op": "+",
          "value": 1,
          "label": "+1",
          "target": 1
        },
        {
          "op": "+",
          "value": 2,
          "label": "+2",
          "target": 2
        },
        {
          "op": "+",
          "value": 6,
          "label": "+6",
          "target": 6
        },
        {
          "op": "-",
          "value": 3,
          "label": "−3",
          "target": 3
        },
        {
          "op": "×",
          "value": 10,
          "label": "×10",
          "target": 10
        }
      ],
      "abilityText": "",
      "abilities": {},
      "concept": "Highlights ×2 and ×10",
      "status": "Proposed",
      "notes": ""
    },
    {
      "id": "E_Scooter",
      "sea": "E",
      "name": "Quad Bike Scooter",
      "battery": 5,
      "handCapacity": 8,
      "startingHand": [
        {
          "op": "+",
          "value": 1,
          "label": "+1",
          "target": 1
        },
        {
          "op": "+",
          "value": 3,
          "label": "+3",
          "target": 3
        },
        {
          "op": "×",
          "value": 3,
          "label": "×3",
          "target": 3
        },
        {
          "op": "×",
          "value": 4,
          "label": "×4",
          "target": 4
        },
        {
          "op": "×",
          "value": 5,
          "label": "×5",
          "target": 5
        }
      ],
      "abilityText": "",
      "abilities": {},
      "concept": "Multiplication-focused small hand",
      "status": "Proposed",
      "notes": ""
    },
    {
      "id": "F_Scooter",
      "sea": "F",
      "name": "Seven Speed Scooter",
      "battery": 4,
      "handCapacity": 8,
      "startingHand": [
        {
          "op": "+",
          "value": 2,
          "label": "+2",
          "target": 2
        },
        {
          "op": "+",
          "value": 6,
          "label": "+6",
          "target": 6
        },
        {
          "op": "+",
          "value": 8,
          "label": "+8",
          "target": 8
        },
        {
          "op": "-",
          "value": 3,
          "label": "−3",
          "target": 3
        },
        {
          "op": "×",
          "value": 7,
          "label": "×7",
          "target": 7
        },
        {
          "op": "×",
          "value": 9,
          "label": "×9",
          "target": 9
        }
      ],
      "abilityText": "Reveal additional treasure at start.",
      "abilities": {
        "revealTreasuresAtStart": 1
      },
      "concept": "Larger Multiplicaiton",
      "status": "Proposed",
      "notes": ""
    },
    {
      "id": "G_Scooter",
      "sea": "G",
      "name": "Treasure Hunter",
      "battery": 4,
      "handCapacity": 7,
      "startingHand": [
        {
          "op": "+",
          "value": 1,
          "label": "+1",
          "target": 1
        },
        {
          "op": "+",
          "value": 7,
          "label": "+7",
          "target": 7
        },
        {
          "op": "-",
          "value": 5,
          "label": "−5",
          "target": 5
        },
        {
          "op": "×",
          "value": 8,
          "label": "×8",
          "target": 8
        }
      ],
      "abilityText": "Reveal two treasure cards at start.",
      "abilities": {
        "revealTreasuresAtStart": 2
      },
      "concept": "Starts with 2 treasure cards revealed; demanding trade-off",
      "status": "Proposed",
      "notes": ""
    }
  ],
  "numberCards": [
    {
      "id": "A_Num_1",
      "sea": "A",
      "op": "+",
      "value": 1,
      "label": "+1",
      "target": 1,
      "copies": 2,
      "mathsType": "Addition",
      "status": "Working",
      "enabled": true
    },
    {
      "id": "A_Num_2",
      "sea": "A",
      "op": "+",
      "value": 2,
      "label": "+2",
      "target": 2,
      "copies": 2,
      "mathsType": "Addition",
      "status": "Working",
      "enabled": true
    },
    {
      "id": "A_Num_3",
      "sea": "A",
      "op": "+",
      "value": 3,
      "label": "+3",
      "target": 3,
      "copies": 2,
      "mathsType": "Addition",
      "status": "Working",
      "enabled": true
    },
    {
      "id": "A_Num_4",
      "sea": "A",
      "op": "+",
      "value": 4,
      "label": "+4",
      "target": 4,
      "copies": 2,
      "mathsType": "Addition",
      "status": "Working",
      "enabled": true
    },
    {
      "id": "A_Num_5",
      "sea": "A",
      "op": "+",
      "value": 5,
      "label": "+5",
      "target": 5,
      "copies": 2,
      "mathsType": "Addition",
      "status": "Working",
      "enabled": true
    },
    {
      "id": "A_Num_6",
      "sea": "A",
      "op": "+",
      "value": 6,
      "label": "+6",
      "target": 6,
      "copies": 2,
      "mathsType": "Addition",
      "status": "Working",
      "enabled": true
    },
    {
      "id": "A_Num_7",
      "sea": "A",
      "op": "+",
      "value": 7,
      "label": "+7",
      "target": 7,
      "copies": 2,
      "mathsType": "Addition",
      "status": "Working",
      "enabled": true
    },
    {
      "id": "A_Num_8",
      "sea": "A",
      "op": "+",
      "value": 8,
      "label": "+8",
      "target": 8,
      "copies": 2,
      "mathsType": "Addition",
      "status": "Working",
      "enabled": true
    },
    {
      "id": "A_Num_9",
      "sea": "A",
      "op": "+",
      "value": 9,
      "label": "+9",
      "target": 9,
      "copies": 2,
      "mathsType": "Addition",
      "status": "Working",
      "enabled": true
    },
    {
      "id": "B_Num_1",
      "sea": "B",
      "op": "+",
      "value": 10,
      "label": "+10",
      "target": 10,
      "copies": 2,
      "mathsType": "Extended addition",
      "status": "Working",
      "enabled": true
    },
    {
      "id": "B_Num_2",
      "sea": "B",
      "op": "+",
      "value": 12,
      "label": "+12",
      "target": 12,
      "copies": 2,
      "mathsType": "Extended addition",
      "status": "Working",
      "enabled": true
    },
    {
      "id": "B_Num_3",
      "sea": "B",
      "op": "+",
      "value": 20,
      "label": "+20",
      "target": 20,
      "copies": 2,
      "mathsType": "Extended addition",
      "status": "Working",
      "enabled": true
    },
    {
      "id": "C_Num_1",
      "sea": "C",
      "op": "-",
      "value": 1,
      "label": "−1",
      "target": 1,
      "copies": 2,
      "mathsType": "Subtraction",
      "status": "Working",
      "enabled": true
    },
    {
      "id": "C_Num_2",
      "sea": "C",
      "op": "-",
      "value": 2,
      "label": "−2",
      "target": 2,
      "copies": 2,
      "mathsType": "Subtraction",
      "status": "Working",
      "enabled": true
    },
    {
      "id": "C_Num_3",
      "sea": "C",
      "op": "-",
      "value": 3,
      "label": "−3",
      "target": 3,
      "copies": 2,
      "mathsType": "Subtraction",
      "status": "Working",
      "enabled": true
    },
    {
      "id": "C_Num_4",
      "sea": "C",
      "op": "-",
      "value": 4,
      "label": "−4",
      "target": 4,
      "copies": 2,
      "mathsType": "Subtraction",
      "status": "Working",
      "enabled": true
    },
    {
      "id": "C_Num_5",
      "sea": "C",
      "op": "-",
      "value": 5,
      "label": "−5",
      "target": 5,
      "copies": 2,
      "mathsType": "Subtraction",
      "status": "Working",
      "enabled": true
    },
    {
      "id": "C_Num_6",
      "sea": "C",
      "op": "-",
      "value": 10,
      "label": "−10",
      "target": 10,
      "copies": 2,
      "mathsType": "Subtraction",
      "status": "Working",
      "enabled": true
    },
    {
      "id": "D_Num_1",
      "sea": "D",
      "op": "×",
      "value": 2,
      "label": "×2",
      "target": 2,
      "copies": 2,
      "mathsType": "Basic multiplication",
      "status": "Working",
      "enabled": true
    },
    {
      "id": "D_Num_2",
      "sea": "D",
      "op": "×",
      "value": 10,
      "label": "×10",
      "target": 10,
      "copies": 2,
      "mathsType": "Basic multiplication",
      "status": "Working",
      "enabled": true
    },
    {
      "id": "E_Num_1",
      "sea": "E",
      "op": "×",
      "value": 3,
      "label": "×3",
      "target": 3,
      "copies": 2,
      "mathsType": "More multiplication",
      "status": "Working",
      "enabled": true
    },
    {
      "id": "E_Num_2",
      "sea": "E",
      "op": "×",
      "value": 4,
      "label": "×4",
      "target": 4,
      "copies": 2,
      "mathsType": "More multiplication",
      "status": "Working",
      "enabled": true
    },
    {
      "id": "E_Num_3",
      "sea": "E",
      "op": "×",
      "value": 5,
      "label": "×5",
      "target": 5,
      "copies": 2,
      "mathsType": "More multiplication",
      "status": "Working",
      "enabled": true
    },
    {
      "id": "F_Num_1",
      "sea": "F",
      "op": "×",
      "value": 6,
      "label": "×6",
      "target": 6,
      "copies": 2,
      "mathsType": "Extended times tables",
      "status": "Working",
      "enabled": true
    },
    {
      "id": "F_Num_2",
      "sea": "F",
      "op": "×",
      "value": 7,
      "label": "×7",
      "target": 7,
      "copies": 2,
      "mathsType": "Extended times tables",
      "status": "Working",
      "enabled": true
    },
    {
      "id": "F_Num_3",
      "sea": "F",
      "op": "×",
      "value": 8,
      "label": "×8",
      "target": 8,
      "copies": 2,
      "mathsType": "Extended times tables",
      "status": "Working",
      "enabled": true
    },
    {
      "id": "F_Num_4",
      "sea": "F",
      "op": "×",
      "value": 9,
      "label": "×9",
      "target": 9,
      "copies": 2,
      "mathsType": "Extended times tables",
      "status": "Working",
      "enabled": true
    },
    {
      "id": "G_Num_1",
      "sea": "G",
      "op": "-",
      "value": 6,
      "label": "−6",
      "target": 6,
      "copies": 2,
      "mathsType": "Extended subtraction",
      "status": "Working",
      "enabled": true
    },
    {
      "id": "G_Num_2",
      "sea": "G",
      "op": "-",
      "value": 7,
      "label": "−7",
      "target": 7,
      "copies": 2,
      "mathsType": "Extended subtraction",
      "status": "Working",
      "enabled": true
    },
    {
      "id": "G_Num_3",
      "sea": "G",
      "op": "-",
      "value": 8,
      "label": "−8",
      "target": 8,
      "copies": 2,
      "mathsType": "Extended subtraction",
      "status": "Working",
      "enabled": true
    },
    {
      "id": "G_Num_4",
      "sea": "G",
      "op": "-",
      "value": 9,
      "label": "−9",
      "target": 9,
      "copies": 2,
      "mathsType": "Extended subtraction",
      "status": "Working",
      "enabled": true
    }
  ],
  "fish": [
    {
      "id": "A_Fish",
      "sea": "A",
      "name": "Clownfish with a Chainsaw",
      "copies": 1,
      "target": 10,
      "abilityText": "",
      "abilities": {},
      "encounterStatus": "",
      "notes": ""
    },
    {
      "id": "A_Fish_2",
      "sea": "A",
      "name": "Electric Eel",
      "copies": 1,
      "target": 16,
      "abilityText": "",
      "abilities": {},
      "encounterStatus": "",
      "notes": ""
    },
    {
      "id": "A_Fish_3",
      "sea": "A",
      "name": "Pufferfish in a Puffer Jacket",
      "copies": 1,
      "target": 19,
      "abilityText": "",
      "abilities": {},
      "encounterStatus": "",
      "notes": ""
    },
    {
      "id": "A_Fish_4",
      "sea": "A",
      "name": "Swordfish with a Sword",
      "copies": 1,
      "target": 24,
      "abilityText": "",
      "abilities": {},
      "encounterStatus": "",
      "notes": ""
    },
    {
      "id": "B_Fish",
      "sea": "B",
      "name": "Lionfish",
      "copies": 1,
      "target": 20,
      "abilityText": "",
      "abilities": {},
      "encounterStatus": "",
      "notes": ""
    },
    {
      "id": "B_Fish_2",
      "sea": "B",
      "name": "Snappy Schnapper",
      "copies": 1,
      "target": 30,
      "abilityText": "",
      "abilities": {},
      "encounterStatus": "",
      "notes": ""
    },
    {
      "id": "C_Fish",
      "sea": "C",
      "name": "Moray Eel",
      "copies": 1,
      "target": -8,
      "abilityText": "",
      "abilities": {},
      "encounterStatus": "",
      "notes": ""
    },
    {
      "id": "C_Fish_2",
      "sea": "C",
      "name": "Anglerfish",
      "copies": 1,
      "target": -9,
      "abilityText": "",
      "abilities": {},
      "encounterStatus": "",
      "notes": ""
    },
    {
      "id": "D_Fish",
      "sea": "D",
      "name": "Jellyfish",
      "copies": 1,
      "target": 40,
      "abilityText": "No battery recharge when defeated",
      "abilities": {
        "noRecharge": true
      },
      "encounterStatus": "",
      "notes": ""
    },
    {
      "id": "D_Fish_2",
      "sea": "D",
      "name": "Manta Ray",
      "copies": 1,
      "target": 50,
      "abilityText": "",
      "abilities": {},
      "encounterStatus": "",
      "notes": ""
    },
    {
      "id": "E_Fish",
      "sea": "E",
      "name": "Kraken Takin’ a Break’n",
      "copies": 1,
      "target": 15,
      "abilityText": "Discard one number card of your choice when defeated",
      "abilities": {
        "discardOnDefeat": 1
      },
      "encounterStatus": "",
      "notes": ""
    },
    {
      "id": "E_Fish_2",
      "sea": "E",
      "name": "Hydra",
      "copies": 1,
      "target": 32,
      "abilityText": "Must land two separate targets (35 and 63); two successful attacks",
      "abilities": {
        "multiTargets": [
          35,
          63
        ]
      },
      "encounterStatus": "",
      "notes": ""
    },
    {
      "id": "E_Fish_3",
      "sea": "E",
      "name": "Squarefish",
      "copies": 1,
      "target": 25,
      "abilityText": "",
      "abilities": {},
      "encounterStatus": "",
      "notes": ""
    },
    {
      "id": "E_Fish_4",
      "sea": "E",
      "name": "Blackjack fish",
      "copies": 1,
      "target": 21,
      "abilityText": "",
      "abilities": {},
      "encounterStatus": "",
      "notes": ""
    },
    {
      "id": "F_Fish",
      "sea": "F",
      "name": "Theiving Squid",
      "copies": 1,
      "target": 48,
      "abilityText": "All unclaimed treasures disappear when defeated",
      "abilities": {
        "destroyTreasureOnEncounter": true
      },
      "encounterStatus": "",
      "notes": ""
    },
    {
      "id": "F_Fish_2",
      "sea": "F",
      "name": "Parrotfish with a Parrot",
      "copies": 1,
      "target": -21,
      "abilityText": "Discard one number cards of your choice when defeated",
      "abilities": {
        "discardOnDefeat": 1
      },
      "encounterStatus": "",
      "notes": ""
    },
    {
      "id": "F_Fish_3",
      "sea": "F",
      "name": "Squarefish XL",
      "copies": 1,
      "target": 49,
      "abilityText": "",
      "abilities": {},
      "encounterStatus": "",
      "notes": ""
    },
    {
      "id": "F_Fish_4",
      "sea": "F",
      "name": "Leatherjacket",
      "copies": 1,
      "target": 48,
      "abilityText": "",
      "abilities": {},
      "encounterStatus": "",
      "notes": ""
    },
    {
      "id": "G_Fish",
      "sea": "G",
      "name": "Great White Shark",
      "copies": 1,
      "target": 99,
      "abilityText": "",
      "abilities": {},
      "encounterStatus": "",
      "notes": ""
    },
    {
      "id": "G_Fish_2",
      "sea": "G",
      "name": "Octopus",
      "copies": 1,
      "target": -88,
      "abilityText": "",
      "abilities": {},
      "encounterStatus": "",
      "notes": ""
    }
  ],
  "treasures": [
    {
      "id": "A_Treasure",
      "sea": "A",
      "name": "Small Pearl",
      "copies": 1,
      "target": 4,
      "gems": 1,
      "specialRule": "",
      "status": ""
    },
    {
      "id": "A_Treasure_2",
      "sea": "A",
      "name": "Sunken Coin",
      "copies": 1,
      "target": 8,
      "gems": 1,
      "specialRule": "",
      "status": ""
    },
    {
      "id": "A_Treasure_3",
      "sea": "A",
      "name": "Coral Chest",
      "copies": 1,
      "target": 12,
      "gems": 1,
      "specialRule": "",
      "status": ""
    },
    {
      "id": "A_Treasure_4",
      "sea": "A",
      "name": "Tidal Trinket",
      "copies": 1,
      "target": 18,
      "gems": 1,
      "specialRule": "",
      "status": ""
    },
    {
      "id": "B_Treasure",
      "sea": "B",
      "name": "Golden Shell",
      "copies": 1,
      "target": 22,
      "gems": 2,
      "specialRule": "",
      "status": ""
    },
    {
      "id": "B_Treasure_2",
      "sea": "B",
      "name": "Lost Compass",
      "copies": 1,
      "target": 32,
      "gems": 2,
      "specialRule": "",
      "status": ""
    },
    {
      "id": "C_Treasure",
      "sea": "C",
      "name": "Cursed Doubloon",
      "copies": 1,
      "target": -12,
      "gems": 2,
      "specialRule": "",
      "status": ""
    },
    {
      "id": "C_Treasure_2",
      "sea": "C",
      "name": "Black Pearl",
      "copies": 1,
      "target": -13,
      "gems": 3,
      "specialRule": "",
      "status": ""
    },
    {
      "id": "D_Treasure",
      "sea": "D",
      "name": "Giant Clam",
      "copies": 1,
      "target": 18,
      "gems": 2,
      "specialRule": "",
      "status": ""
    },
    {
      "id": "D_Treasure_2",
      "sea": "D",
      "name": "Golden Bell",
      "copies": 1,
      "target": 22,
      "gems": 3,
      "specialRule": "",
      "status": ""
    },
    {
      "id": "E_Treasure",
      "sea": "E",
      "name": "Pirate Crown",
      "copies": 1,
      "target": 13,
      "gems": 2,
      "specialRule": "",
      "status": ""
    },
    {
      "id": "E_Treasure_2",
      "sea": "E",
      "name": "Sunken Safe",
      "copies": 1,
      "target": 16,
      "gems": 2,
      "specialRule": "",
      "status": ""
    },
    {
      "id": "F_Treasure",
      "sea": "F",
      "name": "Ghost Lantern",
      "copies": 1,
      "target": -21,
      "gems": 3,
      "specialRule": "",
      "status": ""
    },
    {
      "id": "F_Treasure_2",
      "sea": "F",
      "name": "Frozen Chest",
      "copies": 1,
      "target": 42,
      "gems": 3,
      "specialRule": "",
      "status": ""
    },
    {
      "id": "G_Treasure",
      "sea": "G",
      "name": "Ancient Idol",
      "copies": 1,
      "target": 56,
      "gems": 3,
      "specialRule": "",
      "status": ""
    },
    {
      "id": "G_Treasure_2",
      "sea": "G",
      "name": "Royal Hoard",
      "copies": 1,
      "target": -64,
      "gems": 3,
      "specialRule": "",
      "status": ""
    }
  ],
  "quests": {
    "A": [
      {
        "id": "A_Quest_1",
        "text": "Defeat Swordfish with a Sword",
        "gems": 1,
        "gemsTbd": false,
        "rule": {
          "type": "defeat_specific_fish",
          "fishId": "A_Fish_4",
          "fishName": "Swordfish with a Sword"
        }
      },
      {
        "id": "A_Quest_2",
        "text": "Get at least 2 treasure cards",
        "gems": 1,
        "gemsTbd": false,
        "rule": {
          "type": "claim_treasure",
          "count": 2
        }
      }
    ],
    "B": [
      {
        "id": "B_Quest_1",
        "text": "Make a target using +10",
        "gems": 1,
        "gemsTbd": false,
        "rule": {
          "type": "success_with_card",
          "action": "any",
          "cards": [
            "+10"
          ]
        }
      },
      {
        "id": "B_Quest_2",
        "text": "Claim a treasure worth 2 gems",
        "gems": 1,
        "gemsTbd": false,
        "rule": {
          "type": "claim_treasure",
          "count": 1
        }
      },
      {
        "id": "B_Quest_3",
        "text": "Complete Sea B",
        "gems": 1,
        "gemsTbd": false,
        "rule": {
          "type": "complete_sea"
        }
      }
    ],
    "C": [
      {
        "id": "C_Quest_1",
        "text": "Hit a negative fish target",
        "gems": 1,
        "gemsTbd": false,
        "rule": {
          "type": "defeat_negative_fish"
        }
      },
      {
        "id": "C_Quest_2",
        "text": "Claim a negative-target treasure",
        "gems": 1,
        "gemsTbd": false,
        "rule": {
          "type": "claim_treasure",
          "negative": true,
          "count": 1
        }
      },
      {
        "id": "C_Quest_3",
        "text": "Claim a negative-target treasure during this adventure",
        "gems": 1,
        "gemsTbd": false,
        "rule": {
          "type": "claim_treasure",
          "negative": true,
          "count": 1
        }
      }
    ],
    "D": [
      {
        "id": "D_Quest_1",
        "text": "Win an encounter using ×2",
        "gems": 1,
        "gemsTbd": false,
        "rule": {
          "type": "success_with_card",
          "action": "attack",
          "cards": [
            "×2"
          ]
        }
      },
      {
        "id": "D_Quest_2",
        "text": "Make a target using ×10",
        "gems": 1,
        "gemsTbd": false,
        "rule": {
          "type": "success_with_card",
          "action": "any",
          "cards": [
            "×10"
          ]
        }
      },
      {
        "id": "D_Quest_3",
        "text": "Complete Sea D",
        "gems": 1,
        "gemsTbd": false,
        "rule": {
          "type": "complete_sea"
        }
      }
    ],
    "E": [
      {
        "id": "E_Quest_1",
        "text": "Win using ×3, ×4 or ×5",
        "gems": 1,
        "gemsTbd": false,
        "rule": {
          "type": "success_with_card",
          "action": "attack",
          "cards": [
            "×3",
            "×4",
            "×5"
          ]
        }
      },
      {
        "id": "E_Quest_2",
        "text": "Claim a tricky multiplication treasure",
        "gems": 1,
        "gemsTbd": false,
        "rule": {
          "type": "claim_treasure",
          "usingOp": "×",
          "count": 1
        }
      },
      {
        "id": "E_Quest_3",
        "text": "Complete Sea E",
        "gems": 1,
        "gemsTbd": false,
        "rule": {
          "type": "complete_sea"
        }
      }
    ],
    "F": [
      {
        "id": "F_Quest_1",
        "text": "Use 5 cards to defeat a fish",
        "gems": 1,
        "gemsTbd": false,
        "rule": {
          "type": "defeat_fish_with_cards_count",
          "count": 5
        }
      },
      {
        "id": "F_Quest_2",
        "text": "Claim two negative treasures in a run",
        "gems": 1,
        "gemsTbd": false,
        "rule": {
          "type": "claim_treasure",
          "negative": true,
          "count": 2
        }
      },
      {
        "id": "F_Quest_3",
        "text": "Complete Sea F",
        "gems": 1,
        "gemsTbd": false,
        "rule": {
          "type": "complete_sea"
        }
      }
    ],
    "G": [
      {
        "id": "G_Quest_1",
        "text": "Use ×7 or ×8 successfully",
        "gems": 1,
        "gemsTbd": false,
        "rule": {
          "type": "success_with_card",
          "action": "any",
          "cards": [
            "×7",
            "×8"
          ]
        }
      },
      {
        "id": "G_Quest_2",
        "text": "Claim a 3-gem treasure",
        "gems": 1,
        "gemsTbd": false,
        "rule": {
          "type": "claim_treasure",
          "gems": 3,
          "count": 1
        }
      },
      {
        "id": "G_Quest_3",
        "text": "Complete Sea G",
        "gems": 1,
        "gemsTbd": false,
        "rule": {
          "type": "complete_sea"
        }
      }
    ]
  }
};
