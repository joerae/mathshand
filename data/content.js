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
 * Uses the explicit Fish 1 to Fish 5 slots from the spreadsheet:
 * - Specific fish in a slot (e.g. Fish 1, Fish 5) appear at that exact position.
 * - Empty slots (where no fish is specified) are filled using the random selection rules:
 *   newly unlocked fish for this sea appear first, remainder from earlier seas.
 * - Omitted slots (e.g. "(none)" in Sea A) are excluded.
 */
export function buildEncounters(letter, rng = Math.random) {
  const sea = getSea(letter);
  if (!sea) throw new Error(`Unknown sea "${letter}"`);

  // Explicit fish slots from the spreadsheet (Fish 1 to Fish 5)
  const slots = (sea.fishSlots && sea.fishSlots.length)
    ? sea.fishSlots
    : (sea.fixedFishIds || Array(sea.fishPerAdventure || 5).fill(null));

  const totalSlots = slots.length;

  // 1. If all slots are explicitly fixed (e.g. Sea A: 4 fixed fish)
  if (slots.every(id => id !== null)) {
    return slots.map(id => GAME_DATA.fish.find(f => f.id === id)).filter(Boolean).map(makeEncounter);
  }

  // 2. Identify fish already fixed in specific slots
  const fixedFish = slots.map(id => id ? GAME_DATA.fish.find(f => f.id === id) : null);
  const fixedSet = new Set(fixedFish.filter(Boolean));

  // 3. Count empty slots that need to be filled with random selection rules
  const emptyCount = slots.filter(s => s === null).length;

  // 4. Candidate fish unlocked up to this sea, excluding ones already locked into fixed slots
  const own = GAME_DATA.fish.filter(f => f.sea === sea.letter && !fixedSet.has(f));
  const earlier = GAME_DATA.fish.filter(f => seaIndex(f.sea) < seaIndex(sea.letter) && !fixedSet.has(f));

  // 5. Prioritize newly unlocked fish in this sea that aren't already placed, then earlier fish
  let filler = [];
  if (own.length >= emptyCount) {
    filler = sea.randomised ? shuffle(own, rng).slice(0, emptyCount) : own.slice(0, emptyCount);
  } else {
    const needEarlier = emptyCount - own.length;
    const fromEarlier = sea.randomised ? shuffle(earlier, rng).slice(0, needEarlier) : earlier.slice(0, needEarlier);
    filler = [...own, ...fromEarlier];
    if (sea.randomised) {
      filler = shuffle(filler, rng);
    }
  }

  // 6. Place fixed and filler fish into their designated slot positions
  let fillerIdx = 0;
  const ordered = [];
  for (let i = 0; i < totalSlots; i++) {
    if (fixedFish[i]) {
      ordered.push(fixedFish[i]);
    } else if (fillerIdx < filler.length) {
      ordered.push(filler[fillerIdx++]);
    }
  }

  return ordered.map(makeEncounter);
}
