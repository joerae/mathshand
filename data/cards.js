/**
 * Card and Deck Configuration for Maths Handbuilder (v0.10)
 *
 * Sourced directly from data/game_data.js (generated from Excel workbook).
 */
import { GAME_DATA, buildStartingHand, buildDrawPile as buildDrawPileForSea, getScooter } from './content.js';

const aScooter = getScooter('A_Scooter') || { battery: 4, handCapacity: 8 };

export const GAME_CONFIG = {
  marketSize: GAME_DATA.config.marketSize || 5,
  startingHandSize: 3,
  handCapacity: aScooter.handCapacity,
  batteryCapacity: aScooter.battery
};

/**
 * Starting hand for Sea A's Underwater Scooter (+1, +2, +3).
 */
export const STARTING_HAND = buildStartingHand(aScooter);

/**
 * Builds draw pile for a sea (defaults to Sea A).
 */
export function buildDrawPile(sea = 'A') {
  return buildDrawPileForSea(sea);
}
