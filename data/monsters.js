/**
 * Fish Encounters Configuration for Maths Handbuilder (v0.10)
 *
 * Sourced directly from data/game_data.js (generated from Excel workbook).
 */
import { GAME_DATA, buildEncounters } from './content.js';

export const MONSTERS = GAME_DATA.fish;
export const FISH_ENCOUNTERS = buildEncounters('A');
