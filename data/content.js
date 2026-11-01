/**
 * Content builders for Maths Handbuilder (v0.10 – Seven Seas).
 *
 * All raw content comes from `data/game_data.js`, which is generated from the
 * Excel workbook (the source of truth) by `npm run import-data`.
 *
 * Unlock model: choosing Sea X makes every card marked A..X available
 * (number cards, treasure and scooters). The Sea card itself decides which
 * fish appear and in what order.
 */
import { GAME_DATA } from './game_data.js';

export { GAME_DATA };

export const SEA_ORDER = GAME_DATA.seaOrder;
export const GAME_CONFIG = GAME_DATA.config;

export function seaIndex(letter) {
  return SEA_ORDER.indexOf(String(letter).toUpperCase());
}

/** True when content from `cardSea` is unlocked while playing in `playSea`. */
export function isUnlocked(cardSea, playSea) {
  const c = seaIndex(cardSea);
  const p = seaIndex(playSea);
  return c !== -1 && p !== -1 && c <= p;
}

export function getSea(letter) {
  return GAME_DATA.seas.find(s => s.letter === String(letter).toUpperCase()) || null;
}

export function getScooter(id) {
  return GAME_DATA.scooters.find(s => s.id === id) || null;
}

/** Scooters available when playing a sea (all scooters unlocked up to that sea). */
export function scootersForSea(letter) {
  return GAME_DATA.scooters.filter(s => isUnlocked(s.sea, letter));
}

/** The scooter introduced by a sea, falling back to the first available one. */
export function defaultScooterForSea(letter) {
  const list = scootersForSea(letter);
  return list.find(s => s.sea === letter) || list[0] || null;
}

export function questsForSea(letter) {
  return GAME_DATA.quests[String(letter).toUpperCase()] || [];
}

export function shuffle(array, rng = Math.random) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function makeNumberCard(def, uid) {
  return {
    uid,
    id: def.id,
    type: 'number',
    op: def.op,
    value: def.value,
    label: def.label,
    target: def.target,
    sea: def.sea
  };
}

/** Starting hand for a scooter (fresh card instances). */
export function buildStartingHand(scooter) {
  return scooter.startingHand.map((c, i) => makeNumberCard(
    { ...c, id: `${scooter.id}_start_${i + 1}`, sea: scooter.sea },
    `${scooter.id}_start_${i + 1}`
  ));
}

/** Market draw pile: every enabled number card unlocked up to the sea, × copies. */
export function buildDrawPile(letter) {
  const deck = [];
  for (const def of GAME_DATA.numberCards) {
    if (!def.enabled || !isUnlocked(def.sea, letter)) continue;
    for (let i = 0; i < def.copies; i++) {
      deck.push(makeNumberCard(def, `${def.id}_copy${i + 1}`));
    }
  }
  return deck;
}

/** Treasure deck: every treasure unlocked up to the sea, × copies. */
export function buildTreasureDeck(letter) {
  const deck = [];
  for (const def of GAME_DATA.treasures) {
    if (!isUnlocked(def.sea, letter)) continue;
    for (let i = 0; i < def.copies; i++) {
      deck.push({
        uid: `${def.id}_copy${i + 1}`,
        id: def.id,
        type: 'treasure',
        name: def.name,
        target: def.target,
        gems: def.gems,
        sea: def.sea,
        label: '💎'.repeat(Math.max(1, def.gems)),
        desc: `${def.gems} Gem${def.gems === 1 ? '' : 's'}`
      });
    }
  }
  return deck;
}

function makeEncounter(def) {
  const targets = (def.abilities?.multiTargets?.length ? def.abilities.multiTargets : [def.target]).slice();
  return {
    ...JSON.parse(JSON.stringify(def)),
    targets,
    remainingTargets: targets.slice(),
    // `target` is the next target still to hit (kept for UI/back-compat)
    target: targets[0]
  };
}

/**
 * Builds the ordered fish encounters for a sea.
 *
 * - The sea's own (newly unlocked) fish always appear.
 * - A fixed final fish named in the Sea's encounter rules is always last.
 * - Remaining slots are filled from fish unlocked in earlier seas.
 * - Seas A–B: fixed, spreadsheet order (earlier fish first, new fish last).
 * - Sea C onwards: filler fish chosen at random and all non-final fish shuffled.
 */
export function buildEncounters(letter, rng = Math.random) {
  const sea = getSea(letter);
  if (!sea) throw new Error(`Unknown sea "${letter}"`);

  // Fixed encounter sequence override (e.g. Sea A cards 1-4 in order)
  if (sea.fixedFishIds && sea.fixedFishIds.length) {
    const list = sea.fixedFishIds.map(id => GAME_DATA.fish.find(f => f.id === id)).filter(Boolean);
    return list.map(makeEncounter);
  }

  const startFish = sea.startFishId ? GAME_DATA.fish.find(f => f.id === sea.startFishId) : null;
  const finalFish = sea.finalFishId ? GAME_DATA.fish.find(f => f.id === sea.finalFishId) : null;

  const own = GAME_DATA.fish.filter(f => f.sea === sea.letter && f !== startFish && f !== finalFish);
  const earlier = GAME_DATA.fish.filter(f => seaIndex(f.sea) < seaIndex(sea.letter) && f !== startFish && f !== finalFish);

  const slots = sea.fishPerAdventure;
  const fixedCount = (startFish ? 1 : 0) + (finalFish ? 1 : 0);
  const neededMiddle = Math.max(0, slots - fixedCount);

  let middle = [];
  if (own.length >= neededMiddle) {
    middle = sea.randomised ? shuffle(own, rng).slice(0, neededMiddle) : own.slice(0, neededMiddle);
  } else {
    const fillCount = neededMiddle - own.length;
    const filler = sea.randomised
      ? shuffle(earlier, rng).slice(0, fillCount)
      : earlier.slice(0, fillCount);
    middle = [...own, ...filler];
    if (sea.randomised) {
      middle = shuffle(middle, rng);
    }
  }

  const ordered = [
    ...(startFish ? [startFish] : []),
    ...middle,
    ...(finalFish ? [finalFish] : [])
  ];

  return ordered.slice(0, Math.max(slots, ordered.length)).map(makeEncounter);
}
