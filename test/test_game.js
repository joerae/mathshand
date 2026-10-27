/**
 * Unit & Integration Tests for Maths Handbuilder Game Logic (v0.6)
 */
import assert from 'node:assert';
import { GameState } from '../src/game.js';
import { STARTING_HAND, buildDrawPile } from '../data/cards.js';
import { TREASURE_CARDS, buildTreasureDeck } from '../data/treasures.js';
import { MONSTERS } from '../data/monsters.js';

console.log('--- Running Tests for Maths Handbuilder v0.6 ---');

// Test 1: Starting hand composition (v0.6)
console.log('1. Checking starting hand (+1, +2, +3)...');
assert.strictEqual(STARTING_HAND.length, 3, 'Starting hand must have exactly 3 cards');
assert.strictEqual(STARTING_HAND.every(c => c.type === 'number'), true, 'All starting cards must be number cards');
const labels = STARTING_HAND.map(c => c.label);
assert.deepStrictEqual(labels, ['+1', '+2', '+3'], 'Starting hand must be +1, +2, +3');
console.log('   ✓ Starting hand has 3 number cards (+1, +2, +3).');

// Test 2: Draw pile & Treasure distribution (v0.6)
console.log('2. Checking 66 number cards and separate 19 treasure cards...');
const drawPile = buildDrawPile();
assert.strictEqual(drawPile.length, 66, `Draw pile must be exactly 66 number cards, got ${drawPile.length}`);
assert.strictEqual(drawPile.every(c => c.type === 'number'), true, 'All draw pile cards must be number cards');

// Verify distribution counts
const negCards = drawPile.filter(c => c.op === '-');
const plusLow = drawPile.filter(c => c.op === '+' && c.value <= 4);
const plusHigh = drawPile.filter(c => c.op === '+' && c.value >= 5);
const multLow = drawPile.filter(c => c.op === '×' && c.value <= 4);
const multHigh = drawPile.filter(c => c.op === '×' && c.value >= 5);

assert.strictEqual(plusLow.length, 20, 'Expected 20 (+1 to +4) cards');
assert.strictEqual(plusHigh.length, 15, 'Expected 15 (+5 to +9) cards');
assert.strictEqual(negCards.length, 12, 'Expected 12 (−1 to −4) cards (3 copies each)');
assert.strictEqual(multLow.length, 9, 'Expected 9 (×2 to ×4) cards');
assert.strictEqual(multHigh.length, 10, 'Expected 10 (×5 to ×9) cards');

const treasureDeck = buildTreasureDeck();
assert.strictEqual(treasureDeck.length, 19, `Treasure deck must have 19 cards, got ${treasureDeck.length}`);
const negTreasures = treasureDeck.filter(t => t.category === 'negative');
const sqTreasures = treasureDeck.filter(t => t.category === 'square');
const compTreasures = treasureDeck.filter(t => t.category === 'composite');
assert.strictEqual(negTreasures.length, 5, 'Expected 5 negative target treasures');
assert.strictEqual(sqTreasures.length, 8, 'Expected 8 square target treasures');
assert.strictEqual(compTreasures.length, 6, 'Expected 6 composite target treasures');
console.log('   ✓ 66 number cards and 19 separate treasure cards verified.');

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

// Test 4: Game initialization & Market separation (v0.6)
console.log('4. Checking game state initialization & separation...');
const game = new GameState();
assert.strictEqual(game.hand.length, 3, 'Player hand should start with 3 cards');
assert.strictEqual(game.market.length, 5, 'Market should start with 5 slots');
assert.strictEqual(game.market.every(slot => slot !== null && slot.type === 'number'), true, 'All 5 market slots should be number cards');
assert.strictEqual(game.drawPile.length, 66 - 5, 'Draw pile should have 61 cards remaining after dealing market');
assert.strictEqual(game.treasureStockpile.length, 0, 'Treasure stockpile starts empty');
assert.strictEqual(game.treasureChest.length, 0, 'Treasure chest starts empty');
assert.strictEqual(game.totalGems, 0, 'Total gems start at 0');
assert.strictEqual(game.currentDoom, 0, 'Current monster doom starts at 0');
assert.strictEqual(game.currentMonsterIndex, 0, 'Starts at monster 1');
console.log('   ✓ Market contains only number cards; stockpile starts empty.');

// Test 5: Defeating Monster 1 reveals 1 treasure to the stockpile
console.log('5. Testing defeating Monster 1 reveals treasure to stockpile...');
// Monster 1 target is 10
game.hand.push({ uid: 'test_10', type: 'number', op: '+', value: 10, label: '+10', target: 10 });
const atkCards = game.hand.filter(c => c.uid === 'test_10');
const atkRes = game.playAttack(atkCards);
assert.strictEqual(atkRes.success, true, 'Attack should succeed');
assert.strictEqual(atkRes.targetMatched, true, 'Target 10 should be matched');
assert.strictEqual(game.currentMonsterIndex, 1, 'Should advance to Monster 2');
assert.strictEqual(game.treasureStockpile.length, 1, 'Stockpile should now contain exactly 1 revealed treasure');
assert.strictEqual(game.treasureStockpile[0].type, 'treasure', 'Card in stockpile must be a treasure');
console.log(`   ✓ Monster 1 defeated. Stockpile received: ${game.treasureStockpile[0].label} (Target 🎯 ${game.treasureStockpile[0].target}, ${game.treasureStockpile[0].gems} Gems).`);

// Test 6: Claiming a treasure from the stockpile via Buy action
console.log('6. Testing claiming treasure from stockpile via playBuy("stockpile", ...)...');
const stockTreasure = game.treasureStockpile[0];
const targetToMatch = stockTreasure.target;

// Spawn cards to match the treasure's target
game.hand.push({ uid: 'treasure_solver', type: 'number', op: '+', value: targetToMatch, label: `+${targetToMatch}`, target: Math.abs(targetToMatch) });
const solverCards = game.hand.filter(c => c.uid === 'treasure_solver');
const doomBeforeClaim = game.currentDoom;

const claimRes = game.playBuy('stockpile', 0, solverCards);
assert.strictEqual(claimRes.success, true, 'Claiming treasure should succeed');
assert.strictEqual(claimRes.targetMatched, true, 'Target must match');
assert.strictEqual(claimRes.targetType, 'stockpile', 'Target type should be stockpile');
assert.strictEqual(game.treasureStockpile.length, 0, 'Treasure should be removed from stockpile');
assert.strictEqual(game.treasureChest.length, 1, 'Treasure should be in treasure chest');
assert.strictEqual(game.totalGems, stockTreasure.gems, 'Total gems should match treasure gem count');
assert.strictEqual(game.currentDoom, doomBeforeClaim + 1, 'Claiming treasure must add 1 Doom');
assert.strictEqual(game.hand.some(c => c.type === 'treasure'), false, 'Hand must NOT contain treasure cards');
console.log(`   ✓ Claimed treasure into chest (+${stockTreasure.gems} 💎). Total gems: ${game.totalGems}. Hand remains purely number cards.`);

// Test 7: Buying a number card from the Market via Buy action
console.log('7. Testing buying a number card from market...');
const marketCard = game.market[0];
const marketTarget = marketCard.target;
game.hand.push({ uid: 'market_solver', type: 'number', op: '+', value: marketTarget, label: `+${marketTarget}`, target: marketTarget });
const mSolverCards = game.hand.filter(c => c.uid === 'market_solver');

const buyMktRes = game.playBuy('market', 0, mSolverCards);
assert.strictEqual(buyMktRes.success, true, 'Market buy should succeed');
assert.strictEqual(buyMktRes.targetMatched, true, 'Target must match');
assert.strictEqual(game.market[0], null, 'Market slot 0 should now be null');
assert.strictEqual(game.hand.some(c => c.uid === marketCard.uid), true, 'Bought card must enter player hand');
console.log(`   ✓ Bought ${marketCard.label} from market into hand.`);

// Test 8: Market Refresh & Pickup
console.log('8. Testing Market Refresh and Pickup...');
const r1 = game.playMarketRefresh();
assert.strictEqual(r1.success, true, 'Market Refresh should succeed');
assert.strictEqual(game.market.length, 5, 'Market should have 5 slots');
assert.strictEqual(game.market.every(c => c !== null && c.type === 'number'), true, 'All 5 market slots refilled with numbers');

const p1 = game.playPickup();
assert.strictEqual(p1.success, true, 'Pickup should succeed');
assert.strictEqual(game.playerDiscard.length, 0, 'Player discard emptied');
console.log('   ✓ Refresh and Pickup work properly.');

// Test 9: Final Attack mechanics
console.log('9. Testing Final Attack at doom limit...');
const curMonster = game.currentMonster;
while (game.currentDoom < curMonster.doomLimit) {
  game.playMarketRefresh();
}
assert.strictEqual(game.isFinalAttack, true, 'Final Attack must be triggered');
assert.strictEqual(game.playBuy('market', 0, []).success, false, 'Buy must be blocked during Final Attack');
assert.strictEqual(game.playMarketRefresh().success, false, 'Market Refresh must be blocked during Final Attack');
assert.strictEqual(game.playPickup().success, false, 'Pickup must be blocked during Final Attack');

// Missed final attack causes defeat
const failAttack = game.playAttack([]);
assert.strictEqual(game.status, 'lost', 'Failed final attack must end game in loss');
console.log('   ✓ Final Attack properly locks actions and ends game on failure.');

// Test 10: Final Monster Defeat & Victory Bonus (v0.6)
console.log('10. Testing Monster 6 defeat and automatic victory bonus...');
const victoryGame = new GameState();
// Skip to monster 6 (index 5)
victoryGame.currentMonsterIndex = 5;
const finalMonster = victoryGame.currentMonster;
assert.strictEqual(finalMonster.id, 6, 'Should be monster 6');

// Defeat monster 6: target is 98
victoryGame.hand.push({ uid: 'm6_killer', type: 'number', op: '+', value: 98, label: '+98', target: 98 });
const m6Cards = victoryGame.hand.filter(c => c.uid === 'm6_killer');
const vRes = victoryGame.playAttack(m6Cards);

assert.strictEqual(vRes.success, true, 'Final attack must succeed');
assert.strictEqual(victoryGame.status, 'won', 'Game status must be won');
assert.strictEqual(victoryGame.treasureChest.length, 1, 'Victory bonus treasure must be in treasure chest');
assert.ok(victoryGame.victoryTreasure !== null, 'victoryTreasure must be recorded');
assert.strictEqual(victoryGame.totalGems, victoryGame.victoryTreasure.gems, 'Total gems must include victory bonus');
console.log(`   ✓ Monster 6 defeated! Victory bonus awarded: ${victoryGame.victoryTreasure.label} (+${victoryGame.victoryTreasure.gems} 💎). Status: ${victoryGame.status}.`);

console.log('\n✅ ALL 10 v0.6 INTEGRATION TESTS PASSED SUCCESSFULLY!');
