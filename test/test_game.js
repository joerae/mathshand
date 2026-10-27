/**
 * Unit & Integration Tests for Maths Handbuilder Game Logic (v0.5)
 */
import assert from 'node:assert';
import { GameState } from '../src/game.js';
import { STARTING_HAND, buildDrawPile } from '../data/cards.js';
import { MONSTERS } from '../data/monsters.js';

console.log('--- Running Tests for Maths Handbuilder v0.5 ---');

// Test 1: Starting hand composition (v0.5)
console.log('1. Checking starting hand (+1, +2, +3)...');
assert.strictEqual(STARTING_HAND.length, 3, 'Starting hand must have exactly 3 cards');
assert.strictEqual(STARTING_HAND.every(c => c.type === 'number'), true, 'All starting cards must be number cards');
const labels = STARTING_HAND.map(c => c.label);
assert.deepStrictEqual(labels, ['+1', '+2', '+3'], 'Starting hand must be +1, +2, +3');
console.log('   ✓ Starting hand has 3 number cards (+1, +2, +3).');

// Test 2: Draw pile distribution (v0.5)
console.log('2. Checking draw pile distribution (66 cards, 0 Buy cards)...');
const deck = buildDrawPile();
assert.strictEqual(deck.length, 66, `Draw pile total must be 66 cards, got ${deck.length}`);
const buyCount = deck.filter(c => c.action === 'buy').length;
assert.strictEqual(buyCount, 0, `Expected 0 Buy cards in draw pile, got ${buyCount}`);
assert.strictEqual(deck.every(c => c.type === 'number'), true, 'All draw pile cards must be number cards');
console.log('   ✓ Draw pile has 66 number cards (Buy action cards removed).');

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

// Test 4: Game initialization
console.log('4. Checking game state initialization & market...');
const game = new GameState();
assert.strictEqual(game.hand.length, 3, 'Player hand should start with 3 cards');
assert.strictEqual(game.market.length, 5, 'Market should start with 5 slots');
assert.strictEqual(game.market.every(slot => slot !== null), true, 'All 5 market slots should be filled initially');
assert.strictEqual(game.drawPile.length, 66 - 5, 'Draw pile should have 61 cards remaining after dealing market');
assert.strictEqual(game.currentDoom, 0, 'Current monster doom should start at 0');
assert.strictEqual(game.currentMonsterIndex, 0, 'Starts at monster 1');
assert.strictEqual(game.isFinalAttack, false, 'Final Attack should not be active initially');
console.log('   ✓ Initialization matches v0.5 rules.');

// Test 5: Actions are always available without action cards
console.log('5. Testing that actions are intrinsic and reusable...');
// Refresh market twice in a row without needing a card
const r1 = game.playMarketRefresh();
assert.strictEqual(r1.success, true, 'First Market Refresh should succeed');
assert.strictEqual(game.currentDoom, 1, 'Doom should be 1');
const r2 = game.playMarketRefresh();
assert.strictEqual(r2.success, true, 'Second Market Refresh should succeed without needing a card');
assert.strictEqual(game.currentDoom, 2, 'Doom should be 2');
console.log('   ✓ Actions are intrinsic and do not require action cards.');

// Test 6: Buy Action and Pickup Action
console.log('6. Testing Buy and Pickup...');
// Spawn a card to hit market target
const targetMarketCard = game.market[0];
const targetVal = targetMarketCard.target;
game.hand.push({
  uid: 'test_buy_num',
  type: 'number',
  op: '+',
  value: targetVal,
  label: `+${targetVal}`,
  target: targetVal
});
const buyNumCard = game.hand[game.hand.length - 1];
const buyRes = game.playBuy(0, [buyNumCard]);
assert.strictEqual(buyRes.success, true, 'Buy should execute');
assert.strictEqual(buyRes.targetMatched, true, 'Buy should match target');
assert.strictEqual(game.market[0], null, 'Market slot 0 should now be empty (null)');
assert.strictEqual(game.hand.some(c => (c.uid || c.id) === (targetMarketCard.uid || targetMarketCard.id)), true, 'Bought card should be in player hand');
assert.strictEqual(game.playerDiscard.some(c => c.uid === 'test_buy_num'), true, 'Played number card should be in player discard');
assert.strictEqual(game.currentDoom, 3, 'Buy adds 1 Doom (total now 3)');

// Test Pickup
const pickupRes = game.playPickup();
assert.strictEqual(pickupRes.success, true, 'Pickup should succeed');
assert.strictEqual(game.playerDiscard.length, 0, 'Player discard should be empty after Pickup');
assert.strictEqual(game.hand.some(c => c.uid === 'test_buy_num'), true, 'Picked up number card back in hand');
assert.strictEqual(game.currentDoom, 4, 'Pickup adds 1 Doom (total now 4)');
console.log('   ✓ Buy and Pickup work with number cards.');

// Test 7: Final Attack Activation when Doom reaches limit
console.log('7. Testing Final Attack activation at Doom limit...');
const monster1 = game.currentMonster;
assert.strictEqual(monster1.doomLimit, 6, 'Monster 1 doom limit is 6');
assert.strictEqual(game.currentDoom, 4, 'Current doom is 4');
assert.strictEqual(game.isFinalAttack, false, 'Not yet Final Attack');

// Add 2 more doom actions to reach 6
game.playMarketRefresh(); // doom 5
game.playMarketRefresh(); // doom 6
assert.strictEqual(game.currentDoom, 6, 'Current doom is now 6');
assert.strictEqual(game.isFinalAttack, true, 'Final Attack MUST now be active!');

// Verify other actions are blocked during Final Attack
const buyAttempt = game.playBuy(1, []);
assert.strictEqual(buyAttempt.success, false, 'Buy must be blocked during Final Attack');
const refreshAttempt = game.playMarketRefresh();
assert.strictEqual(refreshAttempt.success, false, 'Market Refresh must be blocked during Final Attack');
const pickupAttempt = game.playPickup();
assert.strictEqual(pickupAttempt.success, false, 'Pickup must be blocked during Final Attack');
console.log('   ✓ Final Attack triggers at Doom limit, locking out other actions.');

// Test 8: Final Attack Failure -> Game Over
console.log('8. Testing Final Attack failure -> Defeat...');
// Create a new game to test failure
const gameFail = new GameState();
for (let i = 0; i < 6; i++) {
  gameFail.playMarketRefresh();
}
assert.strictEqual(gameFail.isFinalAttack, true, 'Final attack active');
// Attack with wrong cards (needed 10, give 1)
const failAtkRes = gameFail.playAttack([gameFail.hand[0]]); // +1 != 10
assert.strictEqual(failAtkRes.finalAttack, true, 'Should be flagged as final attack');
assert.strictEqual(failAtkRes.targetMatched, false, 'Target should not match');
assert.strictEqual(gameFail.status, 'lost', 'Game should be LOST after failing Final Attack');
console.log('   ✓ Failed Final Attack results in immediate Game Over.');

// Test 9: Final Attack Success -> Next Monster
console.log('9. Testing Final Attack success -> Advances to next monster with 0 Doom...');
// In original game, attack with target 10
game.hand.push(
  { uid: 'atk_1', type: 'number', op: '+', value: 3, label: '+3', target: 3 },
  { uid: 'atk_2', type: 'number', op: '+', value: 7, label: '+7', target: 7 }
);
const hitCards = game.hand.filter(c => c.uid === 'atk_1' || c.uid === 'atk_2');
const winAtkRes = game.playAttack(hitCards);
assert.strictEqual(winAtkRes.success, true, 'Attack should succeed');
assert.strictEqual(winAtkRes.finalAttack, true, 'Was a Final Attack');
assert.strictEqual(winAtkRes.targetMatched, true, 'Target matched');
assert.strictEqual(game.currentMonsterIndex, 1, 'Advanced to Monster 2');
assert.strictEqual(game.currentDoom, 0, 'Doom reset to 0 for Monster 2');
assert.strictEqual(game.isFinalAttack, false, 'Final Attack mode deactivated for new monster');
console.log('   ✓ Successful Final Attack defeats monster and advances with 0 Doom.');

console.log('\n✅ ALL 9 v0.5 TESTS PASSED SUCCESSFULLY!');
