/**
 * Unit & Integration Tests for Maths Handbuilder Game Logic (v0.5 + Treasure Experiment)
 */
import assert from 'node:assert';
import { GameState } from '../src/game.js';
import { STARTING_HAND, buildDrawPile, buildNumberDeck } from '../data/cards.js';
import { TREASURE_CARDS, buildTreasureDeck } from '../data/treasures.js';
import { MONSTERS } from '../data/monsters.js';

console.log('--- Running Tests for Maths Handbuilder v0.5 + Treasure Experiment ---');

// Test 1: Starting hand composition (v0.5)
console.log('1. Checking starting hand (+1, +2, +3)...');
assert.strictEqual(STARTING_HAND.length, 3, 'Starting hand must have exactly 3 cards');
assert.strictEqual(STARTING_HAND.every(c => c.type === 'number'), true, 'All starting cards must be number cards');
const labels = STARTING_HAND.map(c => c.label);
assert.deepStrictEqual(labels, ['+1', '+2', '+3'], 'Starting hand must be +1, +2, +3');
console.log('   ✓ Starting hand has 3 number cards (+1, +2, +3).');

// Test 2: Draw pile & Treasure distribution
console.log('2. Checking number deck & treasure distribution...');
const numberDeck = buildNumberDeck();
assert.strictEqual(numberDeck.length, 70, `Number deck must be 70 cards, got ${numberDeck.length}`);

const treasureDeck = buildTreasureDeck();
assert.strictEqual(treasureDeck.length, 19, `Treasure deck must have 19 cards, got ${treasureDeck.length}`);
const negTreasures = treasureDeck.filter(t => t.category === 'negative');
const sqTreasures = treasureDeck.filter(t => t.category === 'square');
const compTreasures = treasureDeck.filter(t => t.category === 'composite');
assert.strictEqual(negTreasures.length, 5, 'Expected 5 negative target treasures');
assert.strictEqual(sqTreasures.length, 8, 'Expected 8 square target treasures');
assert.strictEqual(compTreasures.length, 6, 'Expected 6 composite target treasures');

const combinedDeck = buildDrawPile();
assert.strictEqual(combinedDeck.length, 70 + 19, `Combined deck should be 89 cards, got ${combinedDeck.length}`);
const treasureRatio = treasureDeck.length / combinedDeck.length;
assert.ok(treasureRatio >= 0.20 && treasureRatio <= 0.23, `Treasure should be ~20% (1/5) of the deck, got ${(treasureRatio * 100).toFixed(1)}%`);
console.log(`   ✓ Combined deck has 89 cards (${(treasureRatio * 100).toFixed(1)}% treasure cards, ~1/5 of deck).`);

// Test 3: Math sequence evaluation (strictly in played order)
console.log('3. Checking math calculation sequence examples...');
const seq1 = [
  { op: '+', value: 8, label: '+8' },
  { op: '-', value: 1, label: '-1' },
  { op: '×', value: 8, label: '×8' }
];
const res1 = GameState.calculateSequence(seq1);
assert.strictEqual(res1.total, 56, `Expected 56, got ${res1.total}`);

const seq2 = [
  { op: '+', value: 8, label: '+8' },
  { op: '×', value: 8, label: '×8' },
  { op: '-', value: 1, label: '-1' }
];
const res2 = GameState.calculateSequence(seq2);
assert.strictEqual(res2.total, 63, `Expected 63, got ${res2.total}`);
console.log('   ✓ Calculations resolve strictly in played order (no BEDMAS).');

// Test 4: Game initialization & Market
console.log('4. Checking game state initialization & market...');
const game = new GameState();
assert.strictEqual(game.hand.length, 3, 'Player hand should start with 3 cards');
assert.strictEqual(game.market.length, 5, 'Market should start with 5 slots');
assert.strictEqual(game.market.every(slot => slot !== null), true, 'All 5 market slots should be filled initially');
assert.strictEqual(game.drawPile.length, 89 - 5, 'Draw pile should have 84 cards remaining after dealing market');
assert.strictEqual(game.currentDoom, 0, 'Current monster doom should start at 0');
assert.strictEqual(game.currentMonsterIndex, 0, 'Starts at monster 1');
assert.strictEqual(game.isFinalAttack, false, 'Final Attack should not be active initially');
assert.strictEqual(game.totalGems, 0, 'Total gems should start at 0');
assert.strictEqual(game.treasureChest.length, 0, 'Treasure chest starts empty');
console.log('   ✓ Initialization matches rules.');

// Test 5: Buying a Treasure Card
console.log('5. Testing buying a Treasure card...');
// Put a treasure card into market slot 0
const mockTreasure = {
  uid: 'test_treasure_1',
  type: 'treasure',
  category: 'square',
  target: 25,
  gems: 2,
  label: '💎💎'
};
game.market[0] = mockTreasure;

// Spawn number cards to make 25: 0 + 5 x 5 = 25
game.hand.push(
  { uid: 'num_5a', type: 'number', op: '+', value: 5, label: '+5', target: 5 },
  { uid: 'num_5b', type: 'number', op: '×', value: 5, label: '×5', target: 5 }
);
const cardsUsed = game.hand.filter(c => c.uid === 'num_5a' || c.uid === 'num_5b');
const handSizeBefore = game.hand.length;

const buyTreasRes = game.playBuy(0, cardsUsed);
assert.strictEqual(buyTreasRes.success, true, 'Buying treasure should succeed');
assert.strictEqual(buyTreasRes.targetMatched, true, 'Should match target');
assert.strictEqual(buyTreasRes.isTreasure, true, 'Should be flagged as treasure');
assert.strictEqual(game.market[0], null, 'Market slot 0 should now be null');
assert.strictEqual(game.treasureChest.length, 1, 'Treasure chest should have 1 card');
assert.strictEqual(game.totalGems, 2, 'Total gems should be 2');
// Verify hand did NOT receive the treasure card
assert.strictEqual(game.hand.some(c => c.type === 'treasure'), false, 'Treasure card must NOT enter the playable hand');
// Verify cards used were discarded
assert.strictEqual(game.playerDiscard.some(c => c.uid === 'num_5a'), true, 'Used card 1 should be in discard');
assert.strictEqual(game.playerDiscard.some(c => c.uid === 'num_5b'), true, 'Used card 2 should be in discard');
assert.strictEqual(game.hand.length, handSizeBefore - 2, 'Hand size should decrease by the number cards played');
console.log('   ✓ Buying treasure awards gems to Treasure Chest without adding cards to hand.');

// Test 6: Market Refresh and Pickup
console.log('6. Testing Market Refresh and Pickup...');
const r1 = game.playMarketRefresh();
assert.strictEqual(r1.success, true, 'Market Refresh should succeed');
assert.strictEqual(game.market.length, 5, 'Market has 5 slots');

const p1 = game.playPickup();
assert.strictEqual(p1.success, true, 'Pickup should succeed');
assert.strictEqual(game.playerDiscard.length, 0, 'Discard should be empty');
assert.strictEqual(game.hand.some(c => c.uid === 'num_5a'), true, 'Cards returned to hand');
console.log('   ✓ Market Refresh and Pickup function properly.');

// Test 7: Final Attack at Doom limit
console.log('7. Testing Final Attack at Doom limit...');
const monster1 = game.currentMonster;
// Bring doom to limit
while (game.currentDoom < monster1.doomLimit) {
  game.playMarketRefresh();
}
assert.strictEqual(game.isFinalAttack, true, 'Final attack should be active');
assert.strictEqual(game.playBuy(0, []).success, false, 'Buy must be blocked during Final Attack');

// Attempt Final Attack with matching cards (target 10)
game.hand.push({ uid: 'win_10', type: 'number', op: '+', value: 10, label: '+10', target: 10 });
const winCards = game.hand.filter(c => c.uid === 'win_10');
const faWinRes = game.playAttack(winCards);
assert.strictEqual(faWinRes.success, true, 'Attack succeeds');
assert.strictEqual(faWinRes.finalAttack, true, 'Was final attack');
assert.strictEqual(game.currentMonsterIndex, 1, 'Advanced to Monster 2');
assert.strictEqual(game.currentDoom, 0, 'Doom reset to 0');
assert.strictEqual(game.isFinalAttack, false, 'Final Attack resolved');
assert.strictEqual(game.totalGems, 2, 'Gems preserved across monsters');
console.log('   ✓ Final Attack works seamlessly alongside treasure system.');

console.log('\n✅ ALL 7 v0.5 + TREASURE TESTS PASSED SUCCESSFULLY!');
