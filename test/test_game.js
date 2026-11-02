/**
 * Comprehensive Unit & Integration Tests for Maths Handbuilder (v0.10 – Seven Seas)
 *
 * Verifies all game mechanics driven by the Excel spreadsheet source of truth:
 * - 7 Seas & cumulative card unlocks (A–G)
 * - Scooter configurations, starting hands, capacities, and start-of-run abilities
 * - Encounters sequence (fixed for A–B, randomised for C–G, final fish)
 * - Fish special abilities (Jellyfish no recharge, Kraken discard, Hydra multi-target, Squid treasure theft)
 * - Repeatable Sea Quests tracking & gem payouts
 * - Core combat, market purchases, card replacement at capacity, Final Attack, and Victory Lap
 */
import assert from 'node:assert';
import { GameState } from '../src/game.js';
import { scooterArtFor, SCOOTER_ART } from '../src/scooter_art.js';
import {
  GAME_DATA, SEA_ORDER, getSea, getScooter, scootersForSea,
  defaultScooterForSea, buildStartingHand, buildDrawPile,
  buildTreasureDeck, buildEncounters, questsForSea, isUnlocked
} from '../data/content.js';

console.log('--- Running Tests for Maths Handbuilder v0.10 (Seven Seas) ---');

// Test 1: Data Integrity from Spreadsheet
console.log('1. Checking spreadsheet data integrity...');
assert.strictEqual(GAME_DATA.seas.length, 7, 'Must have 7 Seas (A-G)');
assert.deepStrictEqual(SEA_ORDER, ['A', 'B', 'C', 'D', 'E', 'F', 'G']);
assert.strictEqual(GAME_DATA.scooters.length, 7, 'Must have 7 Scooters');
assert.strictEqual(GAME_DATA.fish.length, 16, 'Must have 16 Fish');
assert.strictEqual(GAME_DATA.treasures.length, 16, 'Must have 16 Treasures');
assert.strictEqual(Object.keys(GAME_DATA.quests).length, 7, 'All 7 Seas must have quests');
console.log('   ✓ 7 seas, 7 scooters, 16 fish, 16 treasures, and 7 quest sets verified.');

// Test 2: Sea A Baseline Initialization & Scooter
console.log('2. Checking Sea A baseline initialization & Underwater Scooter...');
const seaA = getSea('A');
assert.strictEqual(seaA.name, 'Shallow Reef');
assert.strictEqual(seaA.fishPerAdventure, 4);

const scooterA = defaultScooterForSea('A');
assert.strictEqual(scooterA.name, 'Underwater Scooter');
assert.strictEqual(scooterA.battery, 4);
assert.strictEqual(scooterA.handCapacity, 8);
const startHandA = buildStartingHand(scooterA);
assert.deepStrictEqual(startHandA.map(c => c.label), ['+1', '+2', '+3']);

const drawA = buildDrawPile('A');
assert.strictEqual(drawA.length, 18, 'Sea A draw pile has 18 cards (9 numbers × 2 copies)');
assert.strictEqual(drawA.every(c => c.op === '+'), true, 'Sea A has only addition');

const encA = buildEncounters('A');
assert.strictEqual(encA.length, 4, 'Sea A has 4 encounters (Fish 5 is (none))');
assert.deepStrictEqual(encA.map(f => f.name), [
  'Clownfish with a Chainsaw',
  'Electric Eel',
  'Pufferfish in a Puffer Jacket',
  'Electric Eel'
]);
console.log('   ✓ Sea A setup, Underwater Scooter, 18-card draw deck, and 4 explicit fish slots verified.');

// Test 3: Cumulative Unlocks across Seas (A..G)
console.log('3. Checking cumulative card unlocks across Seas...');
const drawB = buildDrawPile('B');
assert.strictEqual(drawB.length, 24, 'Sea B has 18 (A) + 6 (B) = 24 cards');

const drawC = buildDrawPile('C');
assert.strictEqual(drawC.length, 36, 'Sea C has 24 + 12 (negative cards) = 36 cards');
assert.strictEqual(drawC.some(c => c.op === '-'), true, 'Sea C introduces subtraction');

const drawD = buildDrawPile('D');
assert.strictEqual(drawD.length, 40, 'Sea D has 36 + 4 (×2, ×10) = 40 cards');

// Scooters unlocked up to Sea C
const scootersC = scootersForSea('C');
assert.strictEqual(scootersC.length, 3, 'Seas A, B, C scooters available in Sea C');
const reverseScooter = getScooter('C_Scooter');
assert.strictEqual(reverseScooter.name, 'Reverse Gear Scooter');
assert.strictEqual(reverseScooter.handCapacity, 9);
assert.deepStrictEqual(reverseScooter.startingHand.map(c => c.label), ['+2', '+4', '+9', '−3', '−5']);
console.log('   ✓ Cumulative market decks and scooter unlock filtering verified.');

// Test 4: Game State Core Flow in Sea A
console.log('4. Testing core gameplay flow (Attack, Buy, Market Refresh)...');
const game = new GameState({ sea: 'A' });
assert.strictEqual(game.maxBolts, 4);
assert.strictEqual(game.currentBolts, 4);
assert.strictEqual(game.maxHandCapacity, 8);
assert.strictEqual(game.hand.length, 3);
assert.strictEqual(game.market.length, 5);
assert.strictEqual(game.drawPile.length, 18 - 5);

// Attack costs 1 bolt, number cards return to hand
const atkMiss = game.playAttack([game.hand[0]]);
assert.strictEqual(atkMiss.success, true);
assert.strictEqual(atkMiss.targetMatched, false);
assert.strictEqual(game.currentBolts, 3, 'Attack costs 1 bolt');
assert.strictEqual(game.hand.length, 3, 'Cards return to hand automatically');

// Refresh costs 1 bolt
const refRes = game.playMarketRefresh();
assert.strictEqual(refRes.success, true);
assert.strictEqual(game.currentBolts, 2, 'Refresh costs 1 bolt');

// Buying market card below capacity (hand 3 < 8)
const m0 = game.market[0];
game.hand.push({ uid: 'buy_solver', type: 'number', op: '+', value: m0.target, label: `+${m0.target}`, target: m0.target });
const buyRes = game.playBuy('market', 0, [game.hand.find(c => c.uid === 'buy_solver')]);
assert.strictEqual(buyRes.success, true);
assert.strictEqual(buyRes.targetMatched, true);
assert.strictEqual(game.currentBolts, 1, 'Buy costs 1 bolt');
assert.strictEqual(game.hand.length, 5, 'Card added directly to hand (capacity 8)');
console.log('   ✓ Reusable cards, action bolt costs, and sub-capacity market purchase verified.');

// Test 5: Buying at Capacity Requires Card Replacement
console.log('5. Testing buying at capacity requires card replacement...');
while (game.hand.length < game.maxHandCapacity) {
  game.hand.push({ uid: `pad_${game.hand.length}`, type: 'number', op: '+', value: 1, label: '+1', target: 1 });
}
assert.strictEqual(game.hand.length, 8, 'Hand is at full capacity (8 cards)');

game.currentBolts = 2;
game.market[0] = { uid: 'cap_card', type: 'number', op: '+', value: 3, label: '+3', target: 3 };
const card3 = game.hand.find(c => c.value === 3) || game.hand[0];

const buyCapRes = game.playBuy('market', 0, [card3]);
assert.strictEqual(buyCapRes.success, true);
assert.strictEqual(buyCapRes.needsReplacement, true, 'Indicates replacement is required');
assert.strictEqual(game.pendingPurchase !== null, true);

const repCardId = game.hand[0].uid || game.hand[0].id;
const repRes = game.replaceAndAcquire(repCardId);
assert.strictEqual(repRes.success, true);
assert.strictEqual(game.hand.length, 8, 'Hand remains at 8 cards');
assert.strictEqual(game.pendingPurchase, null);
console.log('   ✓ Hand capacity replacement mechanism verified.');

// Test 6: Final Attack at 0 Bolts
console.log('6. Testing Final Attack at 0 bolts...');
game.currentBolts = 0;
assert.strictEqual(game.isFinalAttack, true);

// Hit Clownfish (10)
game.hand.push({ uid: 'c10', type: 'number', op: '+', value: 10, label: '+10', target: 10 });
const faHit = game.playAttack([game.hand.find(c => c.uid === 'c10')]);
assert.strictEqual(faHit.success, true);
assert.strictEqual(faHit.targetMatched, true);
assert.strictEqual(faHit.finalAttack, true);
assert.strictEqual(game.currentBolts, 4, 'Final Attack hit fully refills battery to 4 bolts');
assert.strictEqual(game.currentMonsterIndex, 1, 'Advanced to Electric Eel');

// Final Attack miss ends journey
const failGame = new GameState({ sea: 'A' });
failGame.currentBolts = 0;
const faMiss = failGame.playAttack([]);
assert.strictEqual(faMiss.finalAttack, true);
assert.strictEqual(failGame.status, 'lost');
console.log('   ✓ Final Attack at 0 bolts verified.');

// Test 7: Fish Special Abilities
console.log('7. Testing fish special abilities (Jellyfish, Kraken, Hydra, Theiving Squid)...');

// 7a. Jellyfish (No battery recharge)
const jellyGame = new GameState({
  sea: 'D',
  encounters: [{ id: 'D_Fish', name: 'Jellyfish', target: 40, abilities: { noRecharge: true } }]
});
jellyGame.currentBolts = 2;
jellyGame.hand.push({ uid: 'j40', type: 'number', op: '+', value: 40, label: '+40', target: 40 });
jellyGame.playAttack([jellyGame.hand.find(c => c.uid === 'j40')]);
assert.strictEqual(jellyGame.currentBolts, 1, 'Jellyfish defeat does NOT recharge battery (costs 1 bolt: 2 -> 1)');

// 7b. Kraken (Discard 2 number cards on encounter)
const krakenGame = new GameState({
  sea: 'E',
  encounters: [{ id: 'E_Fish', name: "Kraken Takin' a Break'n", target: 35, abilities: { discardOnEncounter: 2 } }]
});
assert.strictEqual(krakenGame.pendingDiscard !== null, true, 'Kraken forces discard on encounter');
assert.strictEqual(krakenGame.pendingDiscard.remaining, 2);
const d1 = krakenGame.hand[0].uid || krakenGame.hand[0].id;
krakenGame.discardFromHand(d1);
assert.strictEqual(krakenGame.pendingDiscard.remaining, 1);
const d2 = krakenGame.hand[0].uid || krakenGame.hand[0].id;
krakenGame.discardFromHand(d2);
assert.strictEqual(krakenGame.pendingDiscard, null, 'Discard requirement resolved');

// 7c. Hydra (Two separate targets: 35 and 63)
const hydraGame = new GameState({
  sea: 'E',
  encounters: [{ id: 'E_Fish_2', name: 'Hydra', target: -24, abilities: { multiTargets: [35, 63] } }]
});
assert.deepStrictEqual(hydraGame.currentMonster.remainingTargets, [35, 63]);
// Hit first target (35)
hydraGame.hand.push({ uid: 'h35', type: 'number', op: '+', value: 35, label: '+35', target: 35 });
const hit1 = hydraGame.playAttack([hydraGame.hand.find(c => c.uid === 'h35')]);
assert.strictEqual(hit1.targetMatched, true);
assert.strictEqual(hit1.defeated, false, 'Hydra is NOT defeated after only 1 target hit');
assert.deepStrictEqual(hydraGame.currentMonster.remainingTargets, [63]);
// Hit second target (63)
hydraGame.hand.push({ uid: 'h63', type: 'number', op: '+', value: 63, label: '+63', target: 63 });
const hit2 = hydraGame.playAttack([hydraGame.hand.find(c => c.uid === 'h63')]);
assert.strictEqual(hit2.targetMatched, true);
assert.strictEqual(hit2.defeated, true, 'Hydra defeated after landing both targets');

// 7d. Theiving Squid (All unclaimed treasures disappear)
const squidGame = new GameState({
  sea: 'F',
  encounters: [{ id: 'F_Fish', name: 'Theiving Squid', target: 48, abilities: { destroyTreasureOnEncounter: true } }]
});
assert.strictEqual(squidGame.destroyedTreasure.length, 1, 'Squid destroyed start-of-run treasure from F_Scooter');
squidGame.treasureStockpile.push({ uid: 'gem_t', name: 'Golden Shell', target: 25, gems: 2 });
squidGame.onFishEncountered();
assert.strictEqual(squidGame.treasureStockpile.length, 0, 'Squid steals all unclaimed treasures');
assert.strictEqual(squidGame.destroyedTreasure.length, 2, 'Squid destroyed second treasure too');
console.log('   ✓ Jellyfish, Kraken, Hydra, and Theiving Squid special abilities verified.');

// Test 8: Scooter Start-of-Adventure Abilities
console.log('8. Testing scooter abilities (start treasure reveals)...');
const safeEncounters = [{ id: 'safe_fish', name: 'Safe Fish', target: 20 }];
const fGame = new GameState({ sea: 'F', scooterId: 'F_Scooter', encounters: safeEncounters });
assert.strictEqual(fGame.scooter.name, 'Seven Speed Scooter');
assert.strictEqual(fGame.treasureStockpile.length, 1, 'Seven Speed Scooter reveals 1 extra treasure at start');

const gGame = new GameState({ sea: 'G', scooterId: 'G_Scooter', encounters: safeEncounters });
assert.strictEqual(gGame.scooter.name, 'Treasure Hunter');
assert.strictEqual(gGame.treasureStockpile.length, 2, 'Treasure Hunter reveals 2 extra treasures at start');
console.log('   ✓ Scooter starting treasure abilities verified.');

// Test 9: Sea Quests & Encounter Rules across Seas
console.log('9. Testing repeatable Sea Quests tracking & explicit fish slot rules...');

// 9a. Sea A Quest 1 ("Defeat Swordfish with a Sword") & Quest 2 ("Get at least 2 treasure cards")
const questGame = new GameState({
  sea: 'A',
  encounters: [{ id: 'A_Fish_4', name: 'Swordfish with a Sword', target: 10, targets: [10], remainingTargets: [10] }]
});
const qList = questGame.quests.quests;
assert.strictEqual(qList.length, 2, 'Sea A has 2 quests in current spreadsheet');

// Defeat Swordfish with a Sword
questGame.hand.push({ uid: 'q_c10', type: 'number', op: '+', value: 10, label: '+10', target: 10 });
questGame.playAttack([questGame.hand.find(c => c.uid === 'q_c10')]);
assert.strictEqual(qList[0].completed, true, 'Quest 1 ("Defeat Swordfish with a Sword") completed');

// Claim 2 treasures for Quest 2
questGame.treasureStockpile = [
  { uid: 't1', id: 'T_1', type: 'treasure', name: 'Shell', target: 1, gems: 1 },
  { uid: 't2', id: 'T_2', type: 'treasure', name: 'Pearl', target: 2, gems: 1 }
];
questGame.hand.push({ uid: 'q_t1', type: 'number', op: '+', value: 1, label: '+1', target: 1 });
questGame.playBuy('stockpile', 0, [questGame.hand.find(c => c.uid === 'q_t1')]);
assert.strictEqual(qList[1].completed, false, 'Quest 2 not completed after 1 treasure');

questGame.hand.push({ uid: 'q_t2', type: 'number', op: '+', value: 2, label: '+2', target: 2 });
questGame.playBuy('stockpile', 0, [questGame.hand.find(c => c.uid === 'q_t2')]);
assert.strictEqual(qList[1].completed, true, 'Quest 2 ("Get at least 2 treasure cards") completed');

// 9b. Sea F Quest 1: "Use 5 cards to defeat a fish"
const qGameF = new GameState({
  sea: 'F',
  encounters: [{ id: 'F_Fish_2', name: 'Hammerhead Shark', target: 5, targets: [5], remainingTargets: [5] }]
});
const fiveCards = [1, 2, 3, 4, 5].map(i => ({ uid: `f5_${i}`, type: 'number', op: '+', value: 1, label: '+1', target: 1 }));
qGameF.hand.push(...fiveCards);
qGameF.playAttack(fiveCards);
assert.strictEqual(qGameF.quests.quests[0].completed, true, 'Sea F Quest 1 ("Use 5 cards to defeat a fish") completed');

// 9c. Sea C explicit fish slots: Start with Moray Eel (Fish 1), randomised centre, finish with Anglerfish (Fish 5)
const encC = buildEncounters('C');
assert.strictEqual(encC.length, 5, 'Sea C has 5 encounters');
assert.strictEqual(encC[0].name, 'Moray Eel', 'Sea C starts with Moray Eel');
assert.strictEqual(encC[4].name, 'Anglerfish', 'Sea C finishes with Anglerfish');

// 9d. Verify Seas D, E, F, G explicit Fish 1 & Fish 5 slots
const encD = buildEncounters('D');
assert.strictEqual(encD[0].name, 'Lionfish', 'Sea D starts with Lionfish');
assert.strictEqual(encD[4].name, 'Manta Ray', 'Sea D finishes with Manta Ray');

const encE = buildEncounters('E');
assert.strictEqual(encE[0].name, 'Electric Eel', 'Sea E starts with Electric Eel');
assert.strictEqual(encE[4].name, 'Hydra', 'Sea E finishes with Hydra');

const encF = buildEncounters('F');
assert.strictEqual(encF[4].name, 'Theiving Squid', 'Sea F finishes with Theiving Squid');

const encG = buildEncounters('G');
assert.strictEqual(encG[4].name, 'Great White Shark', 'Sea G finishes with Great White Shark');

console.log('   ✓ Sea quests auto-tracking and explicit fish slot rules (Fish 1..5) across all seas verified.');

// Test 10: Final Fish Defeat & Victory Lap
console.log('10. Testing final fish defeat and Victory Lap...');
const victoryGame = new GameState({
  sea: 'B',
  encounters: [{ id: 'B_Fish_2', name: 'Snappy Schnapper', target: 24, targets: [24], remainingTargets: [24] }]
});
victoryGame.currentBolts = 1;
victoryGame.hand.push({ uid: 'v_c24', type: 'number', op: '+', value: 24, label: '+24', target: 24 });
victoryGame.playAttack([victoryGame.hand.find(c => c.uid === 'v_c24')]);

assert.strictEqual(victoryGame.status, 'post_game', 'Transitions to post_game (Victory Lap)');
assert.strictEqual(victoryGame.currentBolts, victoryGame.maxBolts, 'Refills battery to max for Victory Lap');
assert.strictEqual(victoryGame.treasureStockpile.length, 1, 'Stockpile has final revealed treasure');
assert.strictEqual(victoryGame.quests.quests.find(q => q.rule?.type === 'complete_sea').completed, true, 'Quest ("Complete Sea B") completed');

// Claim treasure in Victory Lap
const vTreasure = victoryGame.treasureStockpile[0];
victoryGame.hand.push({ uid: 'v_t', type: 'number', op: '+', value: vTreasure.target, label: `+${vTreasure.target}`, target: vTreasure.target });
const claimRes = victoryGame.playBuy('stockpile', 0, [victoryGame.hand.find(c => c.uid === 'v_t')]);
assert.strictEqual(claimRes.success, true);
assert.strictEqual(victoryGame.status, 'won', 'Concludes adventure after claiming all treasures');
console.log('   ✓ Victory Lap treasure claiming and quest payout verified.');

// Test 11: Scooter Artwork and Hand Slot Capacity Verification
console.log('11. Testing scooter artwork and hand slot capacity...');
for (const seaLetter of SEA_ORDER) {
  const sc = defaultScooterForSea(seaLetter);
  assert.ok(sc, `Scooter must exist for Sea ${seaLetter}`);
  assert.ok(sc.handCapacity >= 7 && sc.handCapacity <= 10, `Hand capacity must be realistic (7-10): got ${sc.handCapacity}`);
  assert.ok(sc.startingHand.length <= sc.handCapacity, 'Starting hand cannot exceed scooter capacity');
  
  const availableSlots = sc.handCapacity - sc.startingHand.length;
  assert.ok(availableSlots > 0, `Scooter ${sc.name} must have available empty slots for market purchases`);

  const artSvg = scooterArtFor(sc);
  assert.ok(artSvg && typeof artSvg === 'string', `Scooter art SVG must be non-empty string for ${sc.id}`);
  assert.ok(artSvg.includes('<svg') && artSvg.includes('</svg>'), `Scooter art must produce valid SVG for ${sc.id}`);
  assert.ok(SCOOTER_ART[sc.id], `Explicit custom SVG must exist in SCOOTER_ART for ${sc.id}`);
}
console.log('   ✓ Scooter vector art (7/7) and empty slot capacities verified.');

console.log('\n✅ ALL 11 v0.10 SEVEN SEAS INTEGRATION TESTS PASSED SUCCESSFULLY!');
