/**
 * Sea Unlocks Configuration for Maths Handbuilder (v0.10)
 *
 * Sourced directly from data/game_data.js (generated from Excel workbook).
 */
import { GAME_DATA } from './content.js';

export const UNLOCK_SEQUENCE = GAME_DATA.seas.map((s, idx) => ({
  order: idx + 1,
  id: s.id,
  letter: s.letter,
  name: `Sea ${s.letter}: ${s.name}`,
  description: s.description,
  mathsFocus: s.mathsFocus,
  fishPerAdventure: s.fishPerAdventure
}));

export function getCumulativeUnlockCosts() {
  return UNLOCK_SEQUENCE.map(s => ({ ...s, cumulativeGems: 0 }));
}
