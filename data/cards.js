/**
 * Card and Deck Configuration for Maths Handbuilder (v0.6)
 * 
 * In v0.6:
 * - Starting hand contains 3 cards: +1, +2, +3
 * - Draw pile supplies market cards and Doom counters (66 number cards)
 * - Treasure cards are kept in a separate deck (data/treasures.js)
 */

export const GAME_CONFIG = {
  marketSize: 5,
  startingHandSize: 3
};

/**
 * The 3 starting number cards the player begins with.
 * Separate from the draw pile.
 */
export const STARTING_HAND = [
  { id: 'start_num_1', type: 'number', op: '+', value: 1, label: '+1', target: 1 },
  { id: 'start_num_2', type: 'number', op: '+', value: 2, label: '+2', target: 2 },
  { id: 'start_num_3', type: 'number', op: '+', value: 3, label: '+3', target: 3 }
];

/**
 * Draw pile distribution definition (66 cards total as per Section 8).
 * All cards in the draw pile are number cards.
 */
export const DRAW_PILE_DISTRIBUTION = [
  // +1 to +4: 5 copies each (20 cards)
  { op: '+', min: 1, max: 4, copies: 5 },

  // +5 to +9: 3 copies each (15 cards)
  { op: '+', min: 5, max: 9, copies: 3 },

  // −1 to −4: 3 copies each (12 cards)
  { op: '-', min: 1, max: 4, copies: 3 },

  // ×2 to ×4: 3 copies each (9 cards)
  { op: '×', min: 2, max: 4, copies: 3 },

  // ×5 to ×9: 2 copies each (10 cards)
  { op: '×', min: 5, max: 9, copies: 2 }
];

/**
 * Builds the draw pile of number cards (70 cards).
 */
export function buildDrawPile() {
  const deck = [];
  let cardSeq = 1;

  for (const entry of DRAW_PILE_DISTRIBUTION) {
    for (let val = entry.min; val <= entry.max; val++) {
      for (let i = 0; i < entry.copies; i++) {
        const opSymbol = entry.op;
        const displayLabel = `${opSymbol}${val}`;
        const target = val;

        deck.push({
          uid: `draw_num_${cardSeq++}`,
          type: 'number',
          op: opSymbol,
          value: val,
          label: displayLabel,
          target: target
        });
      }
    }
  }

  return deck;
}
