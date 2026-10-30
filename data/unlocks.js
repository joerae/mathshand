/**
 * Legacy Progression & Unlock Data (Maths Handbuilder v0.8)
 * 
 * DESIGN NOTES:
 * - Arranged in sequential order.
 * - `incrementalGems`: gems required over the PREVIOUS unlock (can be 0 or a positive number).
 * - `content`: Array of cards/entities unlocked by this stage (supports multiple cards per stage).
 * - Formatted for easy copy-pasting to and from spreadsheet rows.
 * 
 * NOTE: Legacy progression mechanics (spending gems, checkboxes) are deferred in v0.8.
 * This file serves as the structured registry for all unlockable content.
 */

export const UNLOCK_SEQUENCE = [
  {
    order: 1,
    id: 'unlock_fish_swordfish',
    name: 'Middle Encounter: Swordfish',
    description: 'Adds the swift Swordfish (🎯 Target: 24) to the pool of middle encounters.',
    type: 'fish',
    incrementalGems: 4,
    secondaryCost: 0,
    prerequisites: [],
    status: 'defined',
    content: [
      {
        type: 'fish',
        id: 'fish_swordfish',
        name: 'Swordfish',
        target: 24,
        role: 'middle'
      }
    ]
  },
  {
    order: 2,
    id: 'unlock_fish_manta_ray',
    name: 'Middle Encounter: Manta Ray',
    description: 'Adds the graceful Manta Ray (🎯 Target: 42) to the pool of middle encounters.',
    type: 'fish',
    incrementalGems: 6,
    secondaryCost: 0,
    prerequisites: ['unlock_fish_swordfish'],
    status: 'defined',
    content: [
      {
        type: 'fish',
        id: 'fish_manta_ray',
        name: 'Manta Ray',
        target: 42,
        role: 'middle'
      }
    ]
  },
  {
    order: 3,
    id: 'unlock_subtraction_pack',
    name: 'Operation Pack: Subtraction & Deep Depths',
    description: 'Introduces the minus operation (−1 to −4, 12 cards), the Anglerfish (🎯 -12), and 5 negative-target treasures.',
    type: 'operation',
    incrementalGems: 10,
    secondaryCost: 0,
    prerequisites: ['unlock_fish_manta_ray'],
    status: 'defined',
    content: [
      // 12 Subtraction Number Cards (−1 to −4, 3 copies each)
      { type: 'number_card_group', op: '-', min: 1, max: 4, copies: 3, count: 12 },
      // Anglerfish Encounter
      {
        type: 'fish',
        id: 'fish_anglerfish',
        name: 'Anglerfish',
        target: -12,
        role: 'middle'
      },
      // 5 Negative-target treasures
      { type: 'treasure', id: 't_neg_4', category: 'negative', target: -4, gems: 2 },
      { type: 'treasure', id: 't_neg_6', category: 'negative', target: -6, gems: 2 },
      { type: 'treasure', id: 't_neg_8', category: 'negative', target: -8, gems: 2 },
      { type: 'treasure', id: 't_neg_10', category: 'negative', target: -10, gems: 3 },
      { type: 'treasure', id: 't_neg_12', category: 'negative', target: -12, gems: 3 }
    ]
  },
  {
    order: 4,
    id: 'unlock_scooter_cruiser',
    name: 'Scooter Model: Sea Cruiser',
    description: 'Unlocks a modified scooter with 8 card slots but 3 battery capacity.',
    type: 'scooter',
    incrementalGems: 15,
    secondaryCost: 0,
    prerequisites: ['unlock_subtraction_pack'],
    status: 'planned',
    content: [
      {
        type: 'scooter',
        id: 'scooter_sea_cruiser',
        name: 'Sea Cruiser',
        handCapacity: 8,
        batteryCapacity: 3
      }
    ]
  },
  {
    order: 5,
    id: 'unlock_operation_division',
    name: 'Operation Pack: Division',
    description: 'Introduces division (÷2, ÷3) cards into the draw deck.',
    type: 'operation',
    incrementalGems: 20,
    secondaryCost: 0,
    prerequisites: ['unlock_scooter_cruiser'],
    status: 'planned',
    content: [
      { type: 'number_card_group', op: '÷', min: 2, max: 3, copies: 2, count: 4 }
    ]
  }
];

/**
 * Helper to compute cumulative gem costs across unlock stages.
 */
export function getCumulativeUnlockCosts() {
  let cumulative = 0;
  return UNLOCK_SEQUENCE.map(stage => {
    cumulative += stage.incrementalGems;
    return {
      ...stage,
      cumulativeGems: cumulative
    };
  });
}
