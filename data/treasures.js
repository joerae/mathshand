/**
 * Treasure Configuration for Maths Handbuilder (v0.10)
 *
 * Sourced directly from data/game_data.js (generated from Excel workbook).
 */
import { GAME_DATA, buildTreasureDeck as buildDeckForSea } from './content.js';

export const TREASURE_CARDS = GAME_DATA.treasures;

export function buildTreasureDeck(sea = 'A') {
  return buildDeckForSea(sea);
}
