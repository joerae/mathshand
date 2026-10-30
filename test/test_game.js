/**
 * Unit & Integration Tests for Maths Handbuilder Game Logic (v0.8)
 */
import assert from 'node:assert';
import { GameState } from '../src/game.js';
import { STARTING_HAND, buildDrawPile, GAME_CONFIG } from '../data/cards.js';
import { TREASURE_CARDS, buildTreasureDeck } from '../data/treasures.js';
import { MONSTERS, FISH_ENCOUNTERS } from '../data/monsters.js';
import { UNLOCK_SEQUENCE, getCumulativeUnlockCosts } from '../data/unlocks.js';

console.log('--- Running Tests for Maths Handbuilder v0.8 ---');

// Test 1: Starting hand composition & config
console.log('1. Checking starting hand (+1, +2, +3) and config...');
assert.strictEqual(STARTING_HAND.length, 3, 'Starting hand must have exactly 3 cards');
assert.strictEqual(STARTING_HAND.every(c => c.type === 'number'), true, 'All starting cards must be number cards');
const labels = STARTING_HAND.map(c => c.label);
assert.deepStrictEqual(labels, ['+1', '+2', '+3'], 'Starting hand must be +1, +2, +3');
assert.strictEqual(GAME_CONFIG.handCapacity, 7, 'Scooter hand capacity must be 7 cards');
assert.strictEqual(GAME_CONFIG.batteryCapacity, 4, 'Scooter battery capacity must be 4 bolts');
console.log('   ✓ Starting hand has 3 number cards (+1, +2, +3) and capacity is 7.');

// Test 2: Fish Encounters Sequence (5 Fish)
console.log('2. Checking fish encounters sequence (5 baseline fish)...');
assert.strictEqual(MONSTERS.length, 5, 'Must have 5 baseline fish encounters');
assert.strictEqual(MONSTERS[0].name, 'Chainsaw Clownfish');
assert.strictEqual(MONSTERS[0].target, 10);

assert.strictEqual(MONSTERS[1].name, 'Electric Eel');
assert.strictEqual(MONSTERS[1].target, 16);

assert.strictEqual(MONSTERS[2].name, 'Pufferfish');
assert.strictEqual(MONSTERS[2].target, 36);

assert.strictEqual(MONSTERS[3].name, "Kraken Takin' a Break'n");
assert.strictEqual(MONSTERS[3].target, 56);

assert.strictEqual(MONSTERS[4].name, 'Great White Shark');
assert.strictEqual(MONSTERS[4].target, 98);
console.log('   ✓ 5 baseline sea creatures verified with correct positive targets.');

// Test 3: Deck Composition (54 draw cards, 14 positive treasures, unlocks file)
console.log('3. Checking baseline decks and unlock registry...');
const drawCards = buildDrawPile();
assert.strictEqual(drawCards.length, 54, 'Draw pile must contain exactly 54 cards');
assert.strictEqual(drawCards.every(c => c.op === '+' || c.op === '×'), true, 'Baseline deck must contain only + and ×');

const treasureCards = buildTreasureDeck();
assert.strictEqual(treasureCards.length, 14, 'Baseline treasure deck must contain 14 cards (squares and composites)');
assert.strictEqual(treasureCards.every(t => t.target > 0), true, 'All baseline treasure targets must be positive');

assert.strictEqual(UNLOCK_SEQUENCE.length >= 3, true, 'Unlock sequence has defined stages');
assert.strictEqual(UNLOCK_SEQUENCE[0].type, 'fish', 'Stage 1 unlock is middle fish');
assert.strictEqual(UNLOCK_SEQUENCE[1].type, 'fish', 'Stage 2 unlock is middle fish');
assert.strictEqual(UNLOCK_SEQUENCE[2].type, 'operation', 'Stage 3 unlock is Subtraction package');
const cumulativeCosts = getCumulativeUnlockCosts();
assert.strictEqual(cumulativeCosts[0].cumulativeGems, UNLOCK_SEQUENCE[0].incrementalGems);
console.log('   ✓ 54-card draw deck, 14 positive treasures, and unlock registry verified.');

// Test 4: Game initialization (4 bolts, reusable cards)
console.log('4. Checking game initialization (4 bolts, reusable cards)...');
const game = new GameState();
assert.strictEqual(game.maxBolts, 4, 'Max battery is 4 bolts');
assert.strictEqual(game.currentBolts, 4, 'Starts with full battery of 4 bolts');
assert.strictEqual(game.maxHandCapacity, 7, 'Hand capacity is 7');
assert.strictEqual(game.drawPile.length, 54 - 5, 'Draw pile has 49 cards remaining after market deal');
assert.strictEqual(game.market.length, 5, 'Market has 5 cards');
assert.strictEqual(game.treasureStockpile.length, 0, 'Stockpile starts empty');
assert.strictEqual(game.isFinalAttack, false, 'Final attack is not active');
console.log('   ✓ Game initialized with 4/4 bolts and 5-card pure number market.');

// Test 5: Reusable cards (no discard pile) and action costs
console.log('5. Testing reusable number cards and action costs...');
// Hand starts with 3 cards. Use them in an attack that misses
const handCardsBefore = [...game.hand];
const failAtkRes = game.playAttack([game.hand[0]]);
assert.strictEqual(failAtkRes.success, true);
assert.strictEqual(failAtkRes.targetMatched, false);
assert.strictEqual(game.currentBolts, 3, 'Attack costs 1 bolt (4 -> 3)');
assert.strictEqual(game.hand.length, 3, 'Cards stay in hand after failed attack (reusable)');
assert.strictEqual(game.playerDiscard === undefined, true, 'No player discard pile exists');

// Market Refresh costs 1 bolt
const refRes = game.playMarketRefresh();
assert.strictEqual(refRes.success, true);
assert.strictEqual(game.currentBolts, 2, 'Market refresh costs 1 bolt (3 -> 2)');
assert.strictEqual(game.market.every(c => c !== null), true, 'Market fully refreshed');

// Pickup action is gone
const pickRes = game.playPickup();
assert.strictEqual(pickRes.success, false, 'Pickup action is not allowed');
console.log('   ✓ Number cards are reusable, actions cost 1 bolt, and Pickup is removed.');

// Test 6: Buying below capacity (< 7 cards)
console.log('6. Testing buying market card below capacity (< 7 cards)...');
// Hand has 3 cards. Let's buy market card 0
const target0 = game.market[0].target;
game.hand.push({ uid: 'solver_card_1', type: 'number', op: '+', value: target0, label: `+${target0}`, target: target0 });
const solverCard = game.hand.find(c => c.uid === 'solver_card_1');
const buyRes1 = game.playBuy('market', 0, [solverCard]);
assert.strictEqual(buyRes1.success, true);
assert.strictEqual(buyRes1.targetMatched, true);
assert.strictEqual(game.currentBolts, 1, 'Buy costs 1 bolt (2 -> 1)');
assert.strictEqual(game.market[0], null, 'Market slot 0 is empty');
// Hand was 4 (3 starting + 1 solver), plus 1 bought = 5 cards
assert.strictEqual(game.hand.length, 5, 'New card added to hand (5 cards now)');
console.log('   ✓ Successfully bought card below capacity.');

// Test 7: Buying at capacity (7 cards) requires card replacement
console.log('7. Testing buying at capacity (7 cards) requires card replacement...');
// Pad hand up to 7 cards
while (game.hand.length < 7) {
  game.hand.push({ uid: `pad_${game.hand.length}`, type: 'number', op: '+', value: 1, label: '+1', target: 1 });
}
assert.strictEqual(game.hand.length, 7, 'Hand is at full capacity (7 cards)');

// Re-fill market[0] with a known card for testing
game.market[0] = { uid: 'market_buy_test', type: 'number', op: '×', value: 3, label: '×3', target: 3 };
const card3 = game.hand.find(c => c.value === 3) || game.hand[0];
// Give player 2 bolts
game.currentBolts = 2;

// Attempt to buy without specifying replacement -> triggers pending replacement
const buyCapRes = game.playBuy('market', 0, [card3]);
assert.strictEqual(buyCapRes.success, true);
assert.strictEqual(buyCapRes.needsReplacement, true, 'Must indicate replacement is required');
assert.strictEqual(game.currentBolts, 1, 'Bolt spent for the buy action');
assert.strictEqual(game.pendingPurchase !== null, true, 'Pending purchase stored');

// Replace card in hand
const cardToReplaceId = game.hand[0].uid || game.hand[0].id;
const replacedLabel = game.hand[0].label;
const repRes = game.replaceAndAcquire(cardToReplaceId);
assert.strictEqual(repRes.success, true);
assert.strictEqual(game.hand.length, 7, 'Hand remains at 7 cards');
assert.strictEqual(game.hand.some(c => (c.uid || c.id) === cardToReplaceId), false, 'Replaced card was removed from hand');
assert.strictEqual(game.hand.some(c => c.uid === 'market_buy_test'), true, 'Purchased card is in hand');
assert.strictEqual(game.removedCards.length, 1, 'Replaced card recorded in removedCards');
assert.strictEqual(game.pendingPurchase, null, 'Pending purchase cleared');
console.log(`   ✓ Buying at 7 cards successfully required replacing an existing card (${replacedLabel}).`);

// Test 8: Defeating fish fully recharges battery to 4 bolts and reveals treasure
console.log('8. Testing defeating fish fully refills battery to 4 bolts...');
// Fish 1 target is 10. Current bolts = 1.
game.hand.push({ uid: 'c10', type: 'number', op: '+', value: 10, label: '+10', target: 10 });
const atkRes = game.playAttack([game.hand.find(c => c.uid === 'c10')]);
assert.strictEqual(atkRes.success, true);
assert.strictEqual(atkRes.targetMatched, true);
assert.strictEqual(game.currentMonsterIndex, 1, 'Advanced to Fish 2 (Electric Eel)');
assert.strictEqual(game.currentBolts, 4, 'Defeating fish fully recharged battery to 4 bolts');
assert.strictEqual(game.treasureStockpile.length, 1, 'Stockpile received 1 treasure');
console.log('   ✓ Defeating fish fully refilled battery to 4/4 bolts and revealed treasure.');

// Test 9: 0 bolts triggers Final Attack; success recharges to 4, fail loses
console.log('9. Testing 0 bolts Final Attack...');
// Drain bolts to 0
game.currentBolts = 0;
assert.strictEqual(game.isFinalAttack, true);

// Final attack hit against Eel (16)
game.hand.push({ uid: 'c16', type: 'number', op: '+', value: 16, label: '+16', target: 16 });
const faHitRes = game.playAttack([game.hand.find(c => c.uid === 'c16')]);
assert.strictEqual(faHitRes.success, true);
assert.strictEqual(faHitRes.finalAttack, true);
assert.strictEqual(game.currentMonsterIndex, 2, 'Advanced to Fish 3 (Pufferfish)');
assert.strictEqual(game.currentBolts, 4, 'Final Attack hit fully recharged battery to 4 bolts');
assert.strictEqual(game.isFinalAttack, false);

// Test final attack miss
const failGame = new GameState();
failGame.currentBolts = 0;
assert.strictEqual(failGame.isFinalAttack, true);
const faMissRes = failGame.playAttack([]);
assert.strictEqual(faMissRes.success, true);
assert.strictEqual(faMissRes.finalAttack, true);
assert.strictEqual(failGame.status, 'lost', 'Final attack miss results in lost status');
console.log('   ✓ Final Attack mechanics verified.');

// Test 10: Defeating Great White Shark (Fish 5) -> Post-game treasure claiming
console.log('10. Testing Great White Shark defeat and post-shark treasure claiming...');
const finalGame = new GameState();
finalGame.currentMonsterIndex = 4; // Shark
assert.strictEqual(finalGame.currentMonster.name, 'Great White Shark');

// Defeat Shark
finalGame.hand.push({ uid: 'c98', type: 'number', op: '+', value: 98, label: '+98', target: 98 });
const sharkAtk = finalGame.playAttack([finalGame.hand.find(c => c.uid === 'c98')]);
assert.strictEqual(sharkAtk.success, true);
assert.strictEqual(finalGame.status, 'post_game', 'Transitions to post_game');
assert.strictEqual(finalGame.currentBolts, 4, 'Refills battery to 4 bolts for final treasure phase');
assert.strictEqual(finalGame.treasureStockpile.length, 1, 'Revealed 1 final treasure to stockpile');

// In post_game, market actions are locked
assert.strictEqual(finalGame.playAttack([]).success, false, 'Attack locked in post_game');
assert.strictEqual(finalGame.playMarketRefresh().success, false, 'Refresh locked in post_game');
assert.strictEqual(finalGame.playBuy('market', 0, []).success, false, 'Market buy locked in post_game');

// Stockpile buy is allowed
const tCard = finalGame.treasureStockpile[0];
finalGame.hand.push({ uid: 't_solver', type: 'number', op: '+', value: tCard.target, label: `+${tCard.target}`, target: tCard.target });
const claimRes = finalGame.playBuy('stockpile', 0, [finalGame.hand.find(c => c.uid === 't_solver')]);
assert.strictEqual(claimRes.success, true);
assert.strictEqual(finalGame.currentBolts, 3, 'Claiming treasure used 1 bolt (4 -> 3)');
assert.strictEqual(finalGame.treasureChest.length, 1, 'Treasure claimed to chest');
assert.strictEqual(finalGame.status, 'won', 'All stockpile treasures claimed -> transitions to won');

// Voluntary end run
const erGame = new GameState();
erGame.treasureChest.push({ uid: 't_banked', gems: 5 });
const erRes = erGame.endRun();
assert.strictEqual(erRes.success, true);
assert.strictEqual(erGame.status, 'won');
console.log('   ✓ Post-shark treasure claiming and end run verified.');

console.log('\n✅ ALL 10 v0.8 TESTS PASSED SUCCESSFULLY!');
