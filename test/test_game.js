/**
 * Unit & Integration Tests for Maths Handbuilder Game Logic (v0.7 Underwater Scooter)
 */
import assert from 'node:assert';
import { GameState } from '../src/game.js';
import { STARTING_HAND, buildDrawPile } from '../data/cards.js';
import { TREASURE_CARDS, buildTreasureDeck } from '../data/treasures.js';
import { MONSTERS, FISH_ENCOUNTERS } from '../data/monsters.js';

console.log('--- Running Tests for Maths Handbuilder v0.7 (Underwater Scooter) ---');

// Test 1: Starting hand composition
console.log('1. Checking starting hand (+1, +2, +3)...');
assert.strictEqual(STARTING_HAND.length, 3, 'Starting hand must have exactly 3 cards');
assert.strictEqual(STARTING_HAND.every(c => c.type === 'number'), true, 'All starting cards must be number cards');
const labels = STARTING_HAND.map(c => c.label);
assert.deepStrictEqual(labels, ['+1', '+2', '+3'], 'Starting hand must be +1, +2, +3');
console.log('   ✓ Starting hand has 3 number cards (+1, +2, +3).');

// Test 2: Fish Encounters & Recharge Configuration
console.log('2. Checking fish encounters sequence and recharge values...');
assert.strictEqual(MONSTERS.length, 6, 'Must have 6 fish encounters');
assert.strictEqual(MONSTERS[0].name, 'Chainsaw Clownfish');
assert.strictEqual(MONSTERS[0].target, 10);
assert.strictEqual(MONSTERS[0].recharge, 4);

assert.strictEqual(MONSTERS[1].name, 'Electric Eel');
assert.strictEqual(MONSTERS[1].target, 16);
assert.strictEqual(MONSTERS[1].recharge, 3);

assert.strictEqual(MONSTERS[2].name, 'Pufferfish');
assert.strictEqual(MONSTERS[2].target, 36);
assert.strictEqual(MONSTERS[2].recharge, 4);

assert.strictEqual(MONSTERS[3].name, "Kraken Takin' a Break'n");
assert.strictEqual(MONSTERS[3].target, 56);
assert.strictEqual(MONSTERS[3].recharge, 3);

assert.strictEqual(MONSTERS[4].name, 'Anglerfish');
assert.strictEqual(MONSTERS[4].target, -12);
assert.strictEqual(MONSTERS[4].recharge, 5);

assert.strictEqual(MONSTERS[5].name, 'Great White Shark');
assert.strictEqual(MONSTERS[5].target, 98);
assert.strictEqual(MONSTERS[5].recharge, 'Victory');
console.log('   ✓ 6 sea creatures verified with correct targets and recharge rewards.');

// Test 3: Battery & Deck Initialization
console.log('3. Checking battery and deck initialization...');
const game = new GameState();
assert.strictEqual(game.maxBolts, 5, 'Max battery is 5 bolts');
assert.strictEqual(game.currentBolts, 5, 'Starts with full battery of 5 bolts');
assert.strictEqual(game.drawPile.length, 66 - 5, 'Draw pile has 61 cards remaining after market deal');
assert.strictEqual(game.market.length, 5, 'Market has 5 cards');
assert.strictEqual(game.treasureStockpile.length, 0, 'Stockpile starts empty');
assert.strictEqual(game.isFinalAttack, false, 'Final attack is not active');
console.log('   ✓ Scooter initialized with 5/5 bolts and pure number market.');

// Test 4: Actions cost 1 bolt each
console.log('4. Testing actions cost 1 bolt each...');
// Buy a card from market (costs 1 bolt)
const target0 = game.market[0].target;
game.hand.push({ uid: 'buy_solver', type: 'number', op: '+', value: target0, label: `+${target0}`, target: target0 });
const solverCards = game.hand.filter(c => c.uid === 'buy_solver');
const buyRes = game.playBuy('market', 0, solverCards);
assert.strictEqual(buyRes.success, true);
assert.strictEqual(game.currentBolts, 4, 'Buy must cost 1 bolt (5 -> 4)');
assert.strictEqual(game.market[0], null, 'Market slot 0 is empty');

// Market Refresh costs 1 bolt
const refRes = game.playMarketRefresh();
assert.strictEqual(refRes.success, true);
assert.strictEqual(game.currentBolts, 3, 'Market refresh must cost 1 bolt (4 -> 3)');
assert.strictEqual(game.market.every(c => c !== null), true, 'Market fully refreshed');

// Empty market slot 0 again for testing auto-refill later
const target0b = game.market[0].target;
game.hand.push({ uid: 'buy_solver_2', type: 'number', op: '+', value: target0b, label: `+${target0b}`, target: target0b });
game.playBuy('market', 0, game.hand.filter(c => c.uid === 'buy_solver_2'));
assert.strictEqual(game.currentBolts, 2, 'Buy costs 1 bolt (3 -> 2)');
assert.strictEqual(game.market[0], null, 'Market slot 0 is empty again');

// Pickup costs 1 bolt
const pickRes = game.playPickup();
assert.strictEqual(pickRes.success, true);
assert.strictEqual(game.currentBolts, 1, 'Pickup costs 1 bolt (2 -> 1)');
assert.strictEqual(game.playerDiscard.length, 0, 'Discard retrieved to hand');
console.log('   ✓ All actions correctly cost 1 bolt each.');

// Test 5: Defeating Fish 1 (Chainsaw Clownfish) with Post-Battle Recovery
console.log('5. Testing defeating Fish 1, bolt recharge, auto-pickup, auto market refill & treasure reveal...');
// Fish 1 target is 10, recharge is +4. Current bolts = 1.
// Attack costs 1 bolt: 1 - 1 = 0, then recharge +4 gives 4 bolts!
game.hand.push({ uid: 'c10', type: 'number', op: '+', value: 10, label: '+10', target: 10 });
// Also leave 1 card in discard to verify auto-pickup
game.playerDiscard.push({ uid: 'discarded_test', type: 'number', op: '+', value: 1, label: '+1', target: 1 });

const atkRes = game.playAttack(game.hand.filter(c => c.uid === 'c10'));
assert.strictEqual(atkRes.success, true);
assert.strictEqual(atkRes.targetMatched, true);

// Check Fish 2 advanced
assert.strictEqual(game.currentMonsterIndex, 1, 'Advanced to Fish 2 (Electric Eel)');
assert.strictEqual(game.currentMonster.name, 'Electric Eel');

// Check battery recharge: was 1, -1 for attack = 0, +4 recharge = 4 bolts
assert.strictEqual(game.currentBolts, 4, 'Battery recharged to 4 bolts');

// Check auto-pickup
assert.strictEqual(game.playerDiscard.length, 0, 'All discard automatically picked up');
assert.strictEqual(game.hand.some(c => c.uid === 'discarded_test'), true, 'Discarded card returned to hand');

// Check auto market refill: empty slot 0 was refilled
assert.strictEqual(game.market[0] !== null, true, 'Empty market slot was refilled automatically');
assert.strictEqual(game.market.every(c => c !== null), true, 'All 5 market slots filled');

// Check treasure revealed to stockpile
assert.strictEqual(game.treasureStockpile.length, 1, 'Stockpile received 1 treasure');
console.log(`   ✓ Defeating Fish 1 recharged battery to ${game.currentBolts}/5, auto-picked up discard, refilled market, and revealed treasure.`);

// Test 6: Battery depletion to 0 bolts activates Final Attack
console.log('6. Testing battery depletion and Final Attack at 0 bolts...');
// Current bolts = 4. Spend 4 bolts with market refreshes
game.playMarketRefresh(); // 3
game.playMarketRefresh(); // 2
game.playMarketRefresh(); // 1
game.playMarketRefresh(); // 0
assert.strictEqual(game.currentBolts, 0, 'Battery is now at 0 bolts');
assert.strictEqual(game.isFinalAttack, true, 'Final Attack is active');

// Other actions locked
assert.strictEqual(game.playBuy('market', 0, []).success, false, 'Buy locked at 0 bolts');
assert.strictEqual(game.playMarketRefresh().success, false, 'Refresh locked at 0 bolts');
assert.strictEqual(game.playPickup().success, false, 'Pickup locked at 0 bolts');

// Final Attack hit against Electric Eel (target 16, recharge 3)
game.hand.push({ uid: 'eel_killer', type: 'number', op: '+', value: 16, label: '+16', target: 16 });
const faRes = game.playAttack(game.hand.filter(c => c.uid === 'eel_killer'));
assert.strictEqual(faRes.success, true);
assert.strictEqual(faRes.finalAttack, true);
assert.strictEqual(game.currentMonsterIndex, 2, 'Advanced to Fish 3 (Pufferfish)');
assert.strictEqual(game.currentBolts, 3, 'Recharged 0 + 3 = 3 bolts from Electric Eel');
assert.strictEqual(game.isFinalAttack, false, 'Final Attack resolved');
console.log('   ✓ Final Attack hit survived 0 bolts and recharged battery to 3/5.');

// Test 7: Final Attack miss ends journey
console.log('7. Testing Final Attack miss ends adventure in defeat...');
const failGame = new GameState();
failGame.currentBolts = 0; // drain battery
assert.strictEqual(failGame.isFinalAttack, true);
const missRes = failGame.playAttack([]);
assert.strictEqual(missRes.success, true);
assert.strictEqual(missRes.finalAttack, true);
assert.strictEqual(failGame.status, 'lost', 'Status must be lost on Final Attack miss');
console.log('   ✓ Final Attack miss ends journey.');

// Test 8: Great White Shark (Fish 6) Defeat & Automatic Victory Bonus
console.log('8. Testing Great White Shark defeat and victory treasure bonus...');
const victoryGame = new GameState();
victoryGame.currentMonsterIndex = 5;
const shark = victoryGame.currentMonster;
assert.strictEqual(shark.name, 'Great White Shark');
assert.strictEqual(shark.target, 98);

victoryGame.hand.push({ uid: 'shark_slayer', type: 'number', op: '+', value: 98, label: '+98', target: 98 });
const sharkRes = victoryGame.playAttack(victoryGame.hand.filter(c => c.uid === 'shark_slayer'));
assert.strictEqual(sharkRes.success, true);
assert.strictEqual(victoryGame.status, 'won', 'Game status must be won');
assert.ok(victoryGame.victoryTreasure !== null, 'Victory treasure awarded');
assert.strictEqual(victoryGame.treasureChest.length, 1, 'Treasure chest has victory bonus');
console.log(`   ✓ Great White Shark defeated! Won ${victoryGame.victoryTreasure.label} (+${victoryGame.victoryTreasure.gems} 💎). Adventure won!`);

console.log('\n✅ ALL 8 v0.7 UNDERWATER SCOOTER TESTS PASSED SUCCESSFULLY!');
