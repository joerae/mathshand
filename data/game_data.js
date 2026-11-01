/**
 * AUTO-GENERATED FILE — DO NOT EDIT BY HAND.
 *
 * Generated from: data/Maths_Handbuilder_Card_Content_v6(1).xlsx
 * Regenerate with: npm run import-data
 *
 * Edit the spreadsheet instead; it is the source of truth for all game content.
 */
export const GAME_DATA = {
  "source": "Maths_Handbuilder_Card_Content_v6(1).xlsx",
  "importedAt": "2026-11-01T22:38:17.527Z",
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
      "encounterRulesText": "Fixed 4 encounters: Chainsaw Clownfish, Electric Eel, Pufferfish, Kraken Takin’ a Break’n",
      "fishPerAdventure": 4,
      "randomised": false,
      "finalFishId": null,
      "newNumberCardsText": "+1,+2,+3,+4,+5,+6,+7,+8,+9"
    },
    {
      "id": "B_Sea",
      "letter": "B",
      "name": "Extended Addition",
      "description": "Unlocking new cards, hitting new targets. Number bonds for 10,20,30",
      "mathsFocus": "+10, +12, +20; bonds across 10/20/30",
      "encounterRulesText": "Fixed or curated encounter order; TBD",
      "fishPerAdventure": 5,
      "randomised": false,
      "finalFishId": null,
      "newNumberCardsText": "+10,+12,+20,"
    },
    {
      "id": "C_Sea",
      "letter": "C",
      "name": "Negative Depths",
      "description": "Getting used to hitting negative numbers",
      "mathsFocus": "−1 to −5, −10; negative targets",
      "encounterRulesText": "Randomised middle-fish selection introduced; fixed encounters as specified on Sea card",
      "fishPerAdventure": 5,
      "randomised": true,
      "finalFishId": null,
      "newNumberCardsText": "-1,-2,-3,-4,-5,-10"
    },
    {
      "id": "D_Sea",
      "letter": "D",
      "name": "Double Trouble",
      "description": "Getting used to multiplying with x2 and x10",
      "mathsFocus": "×2 and ×10",
      "encounterRulesText": "Sea-specific encounter selection; randomisation available since Sea C",
      "fishPerAdventure": 5,
      "randomised": true,
      "finalFishId": null,
      "newNumberCardsText": "x2, x10"
    },
    {
      "id": "E_Sea",
      "letter": "E",
      "name": "Multiplication Reef",
      "description": "Get used to multiplying x3,x4,x5",
      "mathsFocus": "×3, ×4, ×5",
      "encounterRulesText": "Random pool or sea-specific fish roster",
      "fishPerAdventure": 5,
      "randomised": true,
      "finalFishId": null,
      "newNumberCardsText": "x3,x4,x5"
    },
    {
      "id": "F_Sea",
      "letter": "F",
      "name": "Negative Currents",
      "description": "Learn about multiplifying 6,7,8,9",
      "mathsFocus": "−6 to −9; maybe ×−2 and negative products",
      "encounterRulesText": "Random/curated as needed",
      "fishPerAdventure": 5,
      "randomised": true,
      "finalFishId": null,
      "newNumberCardsText": "-6,-7,-8,-9, x-2(?)"
    },
    {
      "id": "G_Sea",
      "letter": "G",
      "name": "Times Table Trench",
      "description": "Adding negative multiplicaiton of 2,3,4 and 10 against -6 to -9",
      "mathsFocus": "×6 to ×9",
      "encounterRulesText": "Great White Shark is the fixed final encounter; earlier fish selected from Sea G eligible pool (details TBD)",
      "fishPerAdventure": 5,
      "randomised": true,
      "finalFishId": "G_Fish",
      "newNumberCardsText": "x6,x7,x8,x9"
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
      "notes": "Working concept: different starting hand; costs/capacity to playtest."
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
      "notes": "Spec explicitly discussed."
    },
    {
      "id": "D_Scooter",
      "sea": "D",
      "name": "Double Drive Scooter",
      "battery": 4,
      "handCapacity": 7,
      "startingHand": [
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
          "op": "×",
          "value": 2,
          "label": "×2",
          "target": 2
        },
        {
          "op": "×",
          "value": 10,
          "label": "×10",
          "target": 10
        },
        {
          "op": "-",
          "value": 3,
          "label": "−3",
          "target": 3
        }
      ],
      "abilityText": "",
      "abilities": {},
      "concept": "Highlights ×2 and ×10",
      "status": "Proposed",
      "notes": "Candidate; ×10 available to buy."
    },
    {
      "id": "E_Scooter",
      "sea": "E",
      "name": "Quad Bike Scooter",
      "battery": 5,
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
      "battery": 3,
      "handCapacity": 8,
      "startingHand": [
        {
          "op": "+",
          "value": 5,
          "label": "+5",
          "target": 5
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
      "abilityText": "Reveal additional treasure at start",
      "abilities": {
        "revealTreasuresAtStart": 1
      },
      "concept": "Negative multiplication alternative",
      "status": "Proposed",
      "notes": "Negative multiplier is speculative; could instead use minus-card focus."
    },
    {
      "id": "G_Scooter",
      "sea": "G",
      "name": "Treasure Hunter",
      "battery": 3,
      "handCapacity": 6,
      "startingHand": [
        {
          "op": "+",
          "value": 1,
          "label": "+1",
          "target": 1
        },
        {
          "op": "+",
          "value": 10,
          "label": "+10",
          "target": 10
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
      "abilityText": "Reveal two treasure cards at start",
      "abilities": {
        "revealTreasuresAtStart": 2
      },
      "concept": "Starts with 2 treasure cards revealed; demanding trade-off",
      "status": "Proposed",
      "notes": "Could move to an earlier sea or replace one of the others to keep six scooters. Moved from draft Sea H; provisional placement."
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
      "copies": 3,
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
      "copies": 3,
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
      "copies": 3,
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
      "copies": 3,
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
      "copies": 3,
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
      "copies": 3,
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
      "copies": 3,
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
      "copies": 3,
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
      "copies": 3,
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
      "copies": 3,
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
      "copies": 3,
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
      "copies": 3,
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
      "copies": 3,
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
      "copies": 3,
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
      "copies": 3,
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
      "copies": 3,
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
      "copies": 3,
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
      "copies": 3,
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
      "copies": 3,
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
      "copies": 3,
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
      "copies": 3,
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
      "copies": 3,
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
      "copies": 3,
      "mathsType": "More multiplication",
      "status": "Working",
      "enabled": true
    },
    {
      "id": "F_Num_1",
      "sea": "F",
      "op": "-",
      "value": 6,
      "label": "−6",
      "target": 6,
      "copies": 3,
      "mathsType": "Extended subtraction",
      "status": "Working",
      "enabled": true
    },
    {
      "id": "F_Num_2",
      "sea": "F",
      "op": "-",
      "value": 7,
      "label": "−7",
      "target": 7,
      "copies": 3,
      "mathsType": "Extended subtraction",
      "status": "Working",
      "enabled": true
    },
    {
      "id": "F_Num_3",
      "sea": "F",
      "op": "-",
      "value": 8,
      "label": "−8",
      "target": 8,
      "copies": 3,
      "mathsType": "Extended subtraction",
      "status": "Working",
      "enabled": true
    },
    {
      "id": "F_Num_4",
      "sea": "F",
      "op": "-",
      "value": 9,
      "label": "−9",
      "target": 9,
      "copies": 3,
      "mathsType": "Extended subtraction",
      "status": "Working",
      "enabled": true
    },
    {
      "id": "F_Num_5",
      "sea": "F",
      "op": "×",
      "value": -2,
      "label": "×−2",
      "target": 2,
      "copies": 3,
      "mathsType": "Negative multiplication (optional)",
      "status": "Idea",
      "enabled": false
    },
    {
      "id": "G_Num_1",
      "sea": "G",
      "op": "×",
      "value": 6,
      "label": "×6",
      "target": 6,
      "copies": 3,
      "mathsType": "Extended times tables",
      "status": "Working",
      "enabled": true
    },
    {
      "id": "G_Num_2",
      "sea": "G",
      "op": "×",
      "value": 7,
      "label": "×7",
      "target": 7,
      "copies": 3,
      "mathsType": "Extended times tables",
      "status": "Working",
      "enabled": true
    },
    {
      "id": "G_Num_3",
      "sea": "G",
      "op": "×",
      "value": 8,
      "label": "×8",
      "target": 8,
      "copies": 3,
      "mathsType": "Extended times tables",
      "status": "Working",
      "enabled": true
    },
    {
      "id": "G_Num_4",
      "sea": "G",
      "op": "×",
      "value": 9,
      "label": "×9",
      "target": 9,
      "copies": 3,
      "mathsType": "Extended times tables",
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
      "encounterStatus": "Sea A fixed encounter",
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
      "encounterStatus": "Sea A fixed encounter",
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
      "encounterStatus": "Sea A fixed encounter",
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
      "encounterStatus": "Sea A fixed encounter",
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
      "encounterStatus": "Available",
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
      "encounterStatus": "Available",
      "notes": ""
    },
    {
      "id": "C_Fish",
      "sea": "C",
      "name": "Anglerfish",
      "copies": 1,
      "target": -8,
      "abilityText": "",
      "abilities": {},
      "encounterStatus": "Available",
      "notes": ""
    },
    {
      "id": "C_Fish_2",
      "sea": "C",
      "name": "Moray Eel",
      "copies": 1,
      "target": -9,
      "abilityText": "",
      "abilities": {},
      "encounterStatus": "Available",
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
      "encounterStatus": "Available",
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
      "encounterStatus": "Available",
      "notes": ""
    },
    {
      "id": "E_Fish",
      "sea": "E",
      "name": "Kraken Takin’ a Break’n",
      "copies": 1,
      "target": 35,
      "abilityText": "Discard two number cards of your choice when encountered",
      "abilities": {
        "discardOnEncounter": 2
      },
      "encounterStatus": "Available",
      "notes": ""
    },
    {
      "id": "E_Fish_2",
      "sea": "E",
      "name": "Hydra",
      "copies": 1,
      "target": -24,
      "abilityText": "Must land two separate targets (35 and 63); two successful attacks",
      "abilities": {
        "multiTargets": [
          35,
          63
        ]
      },
      "encounterStatus": "Available",
      "notes": ""
    },
    {
      "id": "F_Fish",
      "sea": "F",
      "name": "Theiving Squid",
      "copies": 1,
      "target": 48,
      "abilityText": "All unclaimed treasures disappear when encountered",
      "abilities": {
        "destroyTreasureOnEncounter": true
      },
      "encounterStatus": "Available",
      "notes": ""
    },
    {
      "id": "F_Fish_2",
      "sea": "F",
      "name": "Hammerhead Shark",
      "copies": 1,
      "target": 56,
      "abilityText": "",
      "abilities": {},
      "encounterStatus": "Available",
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
      "encounterStatus": "Fixed final encounter in Sea G",
      "notes": "Moved from Sea A to Sea G; target 98 retained."
    },
    {
      "id": "G_Fish_2",
      "sea": "G",
      "name": "Octopus",
      "copies": 1,
      "target": -88,
      "abilityText": "",
      "abilities": {},
      "encounterStatus": "Fixed final encounter in Sea G",
      "notes": "Moved from Sea A to Sea G; target 98 retained."
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
      "status": "Proposed"
    },
    {
      "id": "A_Treasure_2",
      "sea": "A",
      "name": "Sunken Coin",
      "copies": 1,
      "target": 8,
      "gems": 1,
      "specialRule": "",
      "status": "Proposed"
    },
    {
      "id": "A_Treasure_3",
      "sea": "A",
      "name": "Coral Chest",
      "copies": 1,
      "target": 12,
      "gems": 1,
      "specialRule": "",
      "status": "Proposed"
    },
    {
      "id": "A_Treasure_4",
      "sea": "A",
      "name": "Tidal Trinket",
      "copies": 1,
      "target": 20,
      "gems": 1,
      "specialRule": "",
      "status": "Provisional"
    },
    {
      "id": "B_Treasure",
      "sea": "B",
      "name": "Golden Shell",
      "copies": 1,
      "target": 25,
      "gems": 2,
      "specialRule": "",
      "status": "Proposed"
    },
    {
      "id": "B_Treasure_2",
      "sea": "B",
      "name": "Lost Compass",
      "copies": 1,
      "target": 32,
      "gems": 2,
      "specialRule": "",
      "status": "Proposed"
    },
    {
      "id": "C_Treasure",
      "sea": "C",
      "name": "Cursed Doubloon",
      "copies": 1,
      "target": -12,
      "gems": 2,
      "specialRule": "",
      "status": "Proposed"
    },
    {
      "id": "C_Treasure_2",
      "sea": "C",
      "name": "Black Pearl",
      "copies": 1,
      "target": -13,
      "gems": 3,
      "specialRule": "",
      "status": "Proposed"
    },
    {
      "id": "D_Treasure",
      "sea": "D",
      "name": "Giant Clam",
      "copies": 1,
      "target": 18,
      "gems": 2,
      "specialRule": "",
      "status": "Proposed"
    },
    {
      "id": "D_Treasure_2",
      "sea": "D",
      "name": "Golden Bell",
      "copies": 1,
      "target": 22,
      "gems": 3,
      "specialRule": "",
      "status": "Proposed"
    },
    {
      "id": "E_Treasure",
      "sea": "E",
      "name": "Pirate Crown",
      "copies": 1,
      "target": 54,
      "gems": 2,
      "specialRule": "",
      "status": "Proposed"
    },
    {
      "id": "E_Treasure_2",
      "sea": "E",
      "name": "Sunken Safe",
      "copies": 1,
      "target": 16,
      "gems": 3,
      "specialRule": "",
      "status": "Proposed"
    },
    {
      "id": "F_Treasure",
      "sea": "F",
      "name": "Ghost Lantern",
      "copies": 1,
      "target": -21,
      "gems": 3,
      "specialRule": "",
      "status": "Proposed"
    },
    {
      "id": "F_Treasure_2",
      "sea": "F",
      "name": "Frozen Chest",
      "copies": 1,
      "target": 42,
      "gems": 3,
      "specialRule": "",
      "status": "Proposed"
    },
    {
      "id": "G_Treasure",
      "sea": "G",
      "name": "Ancient Idol",
      "copies": 1,
      "target": 56,
      "gems": 3,
      "specialRule": "",
      "status": "Proposed"
    },
    {
      "id": "G_Treasure_2",
      "sea": "G",
      "name": "Royal Hoard",
      "copies": 1,
      "target": -64,
      "gems": 3,
      "specialRule": "",
      "status": "Proposed"
    }
  ],
  "quests": {
    "A": [
      {
        "id": "A_Quest_1",
        "text": "Defeat the first fish",
        "gems": 0,
        "gemsTbd": true,
        "rule": {
          "type": "defeat_fish_count",
          "count": 1
        }
      },
      {
        "id": "A_Quest_2",
        "text": "Buy a number card from the market",
        "gems": 0,
        "gemsTbd": true,
        "rule": {
          "type": "buy_market",
          "count": 1
        }
      },
      {
        "id": "A_Quest_3",
        "text": "Complete Sea A",
        "gems": 0,
        "gemsTbd": true,
        "rule": {
          "type": "complete_sea"
        }
      }
    ],
    "B": [
      {
        "id": "B_Quest_1",
        "text": "Make a target using +10",
        "gems": 0,
        "gemsTbd": true,
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
        "gems": 0,
        "gemsTbd": true,
        "rule": {
          "type": "claim_treasure",
          "gems": 2,
          "count": 1
        }
      },
      {
        "id": "B_Quest_3",
        "text": "Complete Sea B",
        "gems": 0,
        "gemsTbd": true,
        "rule": {
          "type": "complete_sea"
        }
      }
    ],
    "C": [
      {
        "id": "C_Quest_1",
        "text": "Hit a negative fish target",
        "gems": 0,
        "gemsTbd": true,
        "rule": {
          "type": "defeat_negative_fish"
        }
      },
      {
        "id": "C_Quest_2",
        "text": "Claim a negative-target treasure",
        "gems": 0,
        "gemsTbd": true,
        "rule": {
          "type": "claim_treasure",
          "negative": true,
          "count": 1
        }
      },
      {
        "id": "C_Quest_3",
        "text": "Claim a negative-target treasure during this adventure",
        "gems": 0,
        "gemsTbd": true,
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
        "gems": 0,
        "gemsTbd": true,
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
        "gems": 0,
        "gemsTbd": true,
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
        "gems": 0,
        "gemsTbd": true,
        "rule": {
          "type": "complete_sea"
        }
      }
    ],
    "E": [
      {
        "id": "E_Quest_1",
        "text": "Win using ×3, ×4 or ×5",
        "gems": 0,
        "gemsTbd": true,
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
        "gems": 0,
        "gemsTbd": true,
        "rule": {
          "type": "claim_treasure",
          "usingOp": "×",
          "count": 1
        }
      },
      {
        "id": "E_Quest_3",
        "text": "Complete Sea E",
        "gems": 0,
        "gemsTbd": true,
        "rule": {
          "type": "complete_sea"
        }
      }
    ],
    "F": [
      {
        "id": "F_Quest_1",
        "text": "Win with a negative multiplier (if included)",
        "gems": 0,
        "gemsTbd": true,
        "rule": {
          "type": "success_with_card",
          "action": "attack",
          "negativeMultiplier": true
        }
      },
      {
        "id": "F_Quest_2",
        "text": "Claim two negative treasures in a run",
        "gems": 0,
        "gemsTbd": true,
        "rule": {
          "type": "claim_treasure",
          "negative": true,
          "count": 2
        }
      },
      {
        "id": "F_Quest_3",
        "text": "Complete Sea F",
        "gems": 0,
        "gemsTbd": true,
        "rule": {
          "type": "complete_sea"
        }
      }
    ],
    "G": [
      {
        "id": "G_Quest_1",
        "text": "Use ×7 or ×8 successfully",
        "gems": 0,
        "gemsTbd": true,
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
        "gems": 0,
        "gemsTbd": true,
        "rule": {
          "type": "claim_treasure",
          "gems": 3,
          "count": 1
        }
      },
      {
        "id": "G_Quest_3",
        "text": "Complete Sea G",
        "gems": 0,
        "gemsTbd": true,
        "rule": {
          "type": "complete_sea"
        }
      }
    ]
  }
};
