/**
 * Treasure Configuration for Maths Handbuilder (Treasure Experiment)
 * 
 * Rules:
 * - Appears mixed in with the market (~1/5 of total deck).
 * - Categories:
 *   1) Negative numbers as targets (-2 to -12)
 *   2) Square numbers as targets (4 to 81)
 *   3) Highly composite numbers as targets (6 to 96)
 * - Value: 1, 2, or 3 gems (💎)
 * - Easy to edit and tune!
 */

export const TREASURE_CARDS = [
  // --- 1/3 Negative Targets (5 cards) ---
  { id: 't_neg_4', category: 'negative', target: -4, gems: 2 },
  { id: 't_neg_6', category: 'negative', target: -6, gems: 2 },
  { id: 't_neg_8', category: 'negative', target: -8, gems: 2 },
  { id: 't_neg_10', category: 'negative', target: -10, gems: 3 },
  { id: 't_neg_12', category: 'negative', target: -12, gems: 3 },

  // --- 1/3 Square Number Targets (8 cards) ---
  { id: 't_sq_4', category: 'square', target: 4, gems: 1 },
  { id: 't_sq_9', category: 'square', target: 9, gems: 1 },
  { id: 't_sq_16', category: 'square', target: 16, gems: 2 },
  { id: 't_sq_25', category: 'square', target: 25, gems: 2 },
  { id: 't_sq_36', category: 'square', target: 36, gems: 2 },
  { id: 't_sq_49', category: 'square', target: 49, gems: 3 },
  { id: 't_sq_64', category: 'square', target: 64, gems: 3 },
  { id: 't_sq_81', category: 'square', target: 81, gems: 3 },

  // --- 1/3 Highly Composite Number Targets (6 cards) ---
  { id: 't_comp_12', category: 'composite', target: 12, gems: 1 },
  { id: 't_comp_18', category: 'composite', target: 18, gems: 2 },
  { id: 't_comp_24', category: 'composite', target: 24, gems: 2 },
  { id: 't_comp_30', category: 'composite', target: 30, gems: 2 },
  { id: 't_comp_48', category: 'composite', target: 48, gems: 3 },
  { id: 't_comp_60', category: 'composite', target: 60, gems: 3 }
];

/**
 * Builds the array of treasure card objects with unique IDs and display labels.
 */
export function buildTreasureDeck() {
  return TREASURE_CARDS.map((card, idx) => {
    const gemIcons = '💎'.repeat(card.gems);
    return {
      uid: `draw_treasure_${idx + 1}_${card.id}`,
      type: 'treasure',
      category: card.category,
      target: card.target,
      gems: card.gems,
      label: gemIcons,
      desc: `${card.gems} Gem${card.gems > 1 ? 's' : ''}`
    };
  });
}
