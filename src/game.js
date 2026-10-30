/**
 * Core Game Engine for Maths Handbuilder (v0.8)
 * 
 * Major v0.8 Mechanics:
 * - Hand Capacity: 7 number cards max on starting scooter.
 * - Card Replacement: Buying at capacity permanently removes an existing card from the adventure.
 * - Reusable Number Cards: Number cards return to hand after every action (no discard pile).
 * - No Pickup Action: Removed completely.
 * - 4-Bolt Battery: Maximum and starting charge of 4 bolts.
 * - Full Recharge: Defeating any fish fully refills the battery to 4 bolts (no individual recharge values).
 * - 5-Fish Baseline Sequence: Positive targets only (Anglerfish and negative targets deferred).
 * - 54-Card Draw Pile: Pure addition (+) and multiplication (×).
 * - Post-Shark Treasure Phase: Defeating Great White Shark refills to 4 bolts, reveals 1 final treasure,
 *   and allows using remaining energy solely to claim stockpile treasures before concluding.
 */
import { STARTING_HAND, buildDrawPile, GAME_CONFIG } from '../data/cards.js';
import { buildTreasureDeck } from '../data/treasures.js';
import { MONSTERS, FISH_ENCOUNTERS } from '../data/monsters.js';

export function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export class GameState {
  constructor(customMonsters = null) {
    this.monsters = customMonsters || FISH_ENCOUNTERS || MONSTERS;
    this.reset();
  }

  reset() {
    this.monstersList = JSON.parse(JSON.stringify(this.monsters));
    this.currentMonsterIndex = 0;

    // Electric Scooter Battery (4 double-sided bolt cards)
    this.maxBolts = GAME_CONFIG.batteryCapacity || 4;
    this.currentBolts = this.maxBolts;

    // Hand Capacity (7 cards max)
    this.maxHandCapacity = GAME_CONFIG.handCapacity || 7;

    // Number Draw Deck & Discard (54 cards total in baseline; + and × only)
    this.drawPile = shuffle(buildDrawPile());
    this.drawDiscard = []; // Refreshed market cards

    // Separate Treasure Deck & Stockpile (positive targets only)
    this.treasureDeck = shuffle(buildTreasureDeck());
    this.treasureStockpile = []; // Revealed treasures available to claim
    this.treasureChest = [];     // Claimed treasures / gems
    this.victoryTreasure = null; // Reference for final encounter

    // Player Hand (Number cards are reusable and never permanently discarded during play)
    this.hand = JSON.parse(JSON.stringify(STARTING_HAND)); // +1, +2, +3
    this.removedCards = [];      // Cards permanently removed when replaced at capacity

    // Pending purchase when hand is at capacity
    this.pendingPurchase = null; // { targetIndex, card }

    // Market: 5 number cards
    this.market = [];
    this.initMarket();

    // Game status: 'in_progress', 'post_game', 'won', 'lost'
    this.status = 'in_progress';
    this.statusMessage = '';

    // Action log
    this.log = [];
    this.addLog(`Underwater scooter adventure started (v0.8 rules). Battery: ${this.maxBolts}/${this.maxBolts} ⚡. First encounter: ${this.currentMonster.name}!`);
  }

  get currentMonster() {
    return this.monstersList[this.currentMonsterIndex] || null;
  }

  // Alias for underwater theme
  get currentFish() {
    return this.currentMonster;
  }

  get totalGems() {
    return this.treasureChest.reduce((sum, t) => sum + (t.gems || 0), 0);
  }

  /**
   * Final Attack is active when scooter battery reaches 0 bolts during normal combat.
   * During Final Attack, no other actions (Buy, Market Refresh) are available.
   */
  get isFinalAttack() {
    return (
      this.status === 'in_progress' &&
      this.currentMonster !== null &&
      this.currentBolts === 0
    );
  }

  /**
   * Spend 1 battery bolt for taking an action.
   */
  spendBolt() {
    this.currentBolts = Math.max(0, this.currentBolts - 1);
  }

  /**
   * Retrieves permanent legacy gems persisted in browser storage.
   */
  static getPermanentGems() {
    try {
      if (typeof localStorage !== 'undefined') {
        const val = localStorage.getItem('maths_handbuilder_permanent_gems');
        return val ? parseInt(val, 10) || 0 : 0;
      }
    } catch (e) {
      // Storage unavailable or disabled
    }
    return 0;
  }

  /**
   * Adds gems to permanent legacy stash in browser storage.
   */
  static addPermanentGems(count) {
    try {
      if (typeof localStorage !== 'undefined' && count > 0) {
        const current = GameState.getPermanentGems();
        const updated = current + count;
        localStorage.setItem('maths_handbuilder_permanent_gems', updated.toString());
        return updated;
      }
    } catch (e) {
      // Storage unavailable or disabled
    }
    return 0;
  }

  addLog(msg, type = 'info') {
    this.log.unshift({
      id: Date.now() + Math.random(),
      msg,
      type,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    });
  }

  /**
   * Draw a card from drawPile, reshuffling drawDiscard if empty.
   */
  drawCardFromDeck() {
    if (this.drawPile.length === 0) {
      if (this.drawDiscard.length === 0) {
        return null;
      }
      this.drawPile = shuffle(this.drawDiscard);
      this.drawDiscard = [];
      this.addLog('Draw pile was empty. Reshuffled discard pile into draw pile.', 'system');
    }
    return this.drawPile.pop();
  }

  /**
   * Draw a card from separate treasure deck.
   */
  drawTreasureCard() {
    if (this.treasureDeck.length === 0) {
      return null;
    }
    return this.treasureDeck.pop();
  }

  /**
   * Reveals a treasure from the treasure deck into the stockpile.
   */
  revealTreasureToStockpile() {
    const treasure = this.drawTreasureCard();
    if (treasure) {
      this.treasureStockpile.push(treasure);
      this.addLog(`💎 TREASURE REVEALED: Placed ${treasure.label} (🎯 Target: ${treasure.target}) into the stockpile!`, 'treasure');
    }
    return treasure;
  }

  /**
   * Populate market with number cards from draw pile up to marketSize
   */
  initMarket() {
    this.market = [];
    for (let i = 0; i < GAME_CONFIG.marketSize; i++) {
      const card = this.drawCardFromDeck();
      this.market.push(card);
    }
  }

  /**
   * Refills only empty slots in the market up to marketSize.
   */
  refillEmptyMarketSlots() {
    let refilled = 0;
    for (let i = 0; i < GAME_CONFIG.marketSize; i++) {
      if (!this.market[i]) {
        const card = this.drawCardFromDeck();
        if (card) {
          this.market[i] = card;
          refilled++;
        }
      }
    }
    return refilled;
  }

  /**
   * Evaluates mathematical sequence from zero in order played.
   */
  static calculateSequence(numberCards) {
    let runningTotal = 0;
    const steps = [];

    for (const card of numberCards) {
      const prev = runningTotal;
      let expr = '';

      if (card.op === '+') {
        runningTotal += card.value;
        expr = `${prev} + ${card.value} = ${runningTotal}`;
      } else if (card.op === '-') {
        runningTotal -= card.value;
        expr = `${prev} − ${card.value} = ${runningTotal}`;
      } else if (card.op === '×') {
        runningTotal *= card.value;
        expr = `${prev} × ${card.value} = ${runningTotal}`;
      } else {
        runningTotal += (card.value || 0);
        expr = `${prev} + ${card.value || 0} = ${runningTotal}`;
      }

      steps.push({
        card,
        prev,
        result: runningTotal,
        expr
      });
    }

    return {
      total: runningTotal,
      steps
    };
  }

  /**
   * ACTION 1: Attack Sea Creature
   * Costs 1 bolt. Number cards are permanently reusable and return to hand.
   * On Final Attack (0 bolts), success defeats fish and recharges battery; miss ends journey.
   */
  playAttack(selectedNumberCards) {
    if (this.status !== 'in_progress') return { success: false, reason: 'Game has already ended.' };
    if (this.pendingPurchase) return { success: false, reason: 'Complete card replacement first.' };

    const wasFinalAttack = this.isFinalAttack;
    const fish = this.currentMonster;
    const isFinalFish = (this.currentMonsterIndex === this.monstersList.length - 1);
    const { total, steps } = GameState.calculateSequence(selectedNumberCards);
    const targetMatched = (total === fish.target);
    const sequenceSummary = steps.map(s => s.card.label).join(' → ') || '(0 cards)';

    // In v0.8, number cards return to hand immediately (no discard pile)

    if (wasFinalAttack) {
      if (targetMatched) {
        this.addLog(`⚔️ FINAL ATTACK SUCCESS: [${sequenceSummary}] = ${total}. Defeated ${fish.name} with battery depleted!`, 'success');
        this.handleFishDefeat(isFinalFish, fish, true);
        return { success: true, targetMatched: true, finalAttack: true, total };
      } else {
        this.status = 'lost';
        this.statusMessage = `Final Attack missed against ${fish.name}! Needed 🎯 ${fish.target}, got ${total}.`;
        this.addLog(`☠️ OUT OF POWER: Final Attack missed [${sequenceSummary}] = ${total} (needed 🎯 ${fish.target}). The scooter stranded underwater!`, 'danger');
        return { success: true, targetMatched: false, finalAttack: true, total };
      }
    }

    // Normal Attack: costs 1 Bolt
    this.spendBolt();

    if (targetMatched) {
      this.addLog(`⚔️ ATTACK SUCCESS: [${sequenceSummary}] = ${total}. Defeated ${fish.name} (🎯 ${fish.target})!`, 'success');
      this.handleFishDefeat(isFinalFish, fish, false);
      return { success: true, targetMatched: true, finalAttack: false, total };
    } else {
      this.addLog(`❌ ATTACK FAILED: [${sequenceSummary}] = ${total}. Needed 🎯 ${fish.target}. (Battery: ${this.currentBolts}/${this.maxBolts} ⚡)`, 'warning');
      this.checkFinalAttackTrigger();
      return { success: true, targetMatched: false, finalAttack: false, total };
    }
  }

  /**
   * Handles post-encounter sequence upon defeating a sea creature:
   * 1. Completely refills battery to maximum 4 bolts.
   * 2. Auto-refills empty market slots.
   * 3. Reveals 1 random treasure into stockpile.
   * 4. If final fish (Shark): transitions to post-game treasure claiming phase.
   */
  handleFishDefeat(isFinalFish, fish, fromFinalAttack = false) {
    // 1. Defeating ANY fish completely refills battery to 4 bolts
    this.currentBolts = this.maxBolts;

    // 2. Replenish empty market slots
    const slotsRefilled = this.refillEmptyMarketSlots();

    // 3. Reveal 1 treasure into the stockpile
    const revealedTreasure = this.revealTreasureToStockpile();

    if (isFinalFish) {
      this.sharkDefeated = true;
      this.status = 'post_game';
      this.statusMessage = 'Great White Shark defeated! Scooter battery refilled (4/4 ⚡). Spend remaining energy to claim any remaining treasures, or conclude the adventure.';
      this.addLog(
        `🏆 GREAT WHITE SHARK DEFEATED! Battery fully recharged to ${this.currentBolts}/${this.maxBolts} ⚡. Use your remaining bolts to claim stockpile treasures, or hit "Conclude Adventure" to bank your haul!`,
        'victory'
      );
    } else {
      this.currentMonsterIndex++;
      const nextFish = this.currentMonster;

      this.addLog(
        `⚡ POST-BATTLE RECOVERY: Battery fully recharged (${this.currentBolts}/${this.maxBolts} ⚡) and refilled ${slotsRefilled} market slots. Next encounter: ${nextFish.name} (🎯 ${nextFish.target})!`,
        'success'
      );
    }
  }

  handleMonsterDefeat(isFinalMonster, monster) {
    return this.handleFishDefeat(isFinalMonster, monster, false);
  }

  /**
   * ACTION 2: Buy / Claim (Market Card OR Stockpile Treasure)
   * Costs 1 bolt.
   * - targetType: 'market' (buys number card into hand; replaces a card if hand has 7 cards)
   * - targetType: 'stockpile' (claims treasure into treasure chest)
   */
  playBuy(targetType, targetIndex, selectedNumberCards, replaceCardId = null) {
    if (this.status !== 'in_progress' && this.status !== 'post_game') {
      return { success: false, reason: 'Game has already ended.' };
    }
    if (this.pendingPurchase) {
      return { success: false, reason: 'Complete pending card replacement first.' };
    }
    if (this.status === 'post_game' && targetType !== 'stockpile') {
      return { success: false, reason: 'Market purchases are closed after defeating the final fish.' };
    }
    if (this.isFinalAttack && this.status === 'in_progress') {
      return { success: false, reason: 'Scooter is out of battery! Only Final Attack is available.' };
    }
    if (this.currentBolts <= 0) {
      return { success: false, reason: 'Out of bolts.' };
    }

    const targetCard = (targetType === 'stockpile')
      ? this.treasureStockpile[targetIndex]
      : this.market[targetIndex];

    if (!targetCard) {
      return { success: false, reason: 'Selected target slot is empty.' };
    }

    const { total, steps } = GameState.calculateSequence(selectedNumberCards);
    const targetMatched = (total === targetCard.target);
    const sequenceSummary = steps.map(s => s.card.label).join(' → ') || '(0 cards)';

    // Costs 1 bolt whether successful or failed
    this.spendBolt();

    if (targetMatched) {
      if (targetType === 'stockpile') {
        // Claim treasure from stockpile -> into treasure chest
        this.treasureStockpile.splice(targetIndex, 1);
        this.treasureChest.push(targetCard);
        GameState.addPermanentGems(targetCard.gems);

        this.addLog(`💎 TREASURE CLAIMED: [${sequenceSummary}] = ${total}. Claimed ${targetCard.label} (🎯 ${targetCard.target}, +${targetCard.gems} 💎)! Total: ${this.totalGems} 💎. (Battery: ${this.currentBolts}/${this.maxBolts} ⚡)`, 'treasure');
        
        if (this.status === 'post_game') {
          if (this.currentBolts === 0 || this.treasureStockpile.length === 0) {
            this.status = 'won';
            this.statusMessage = 'Victory! Completed treasure claims.';
            this.addLog(`🏆 ADVENTURE COMPLETE: Finished spending remaining bolts. Total gems earned: ${this.totalGems} 💎!`, 'victory');
          }
        } else {
          this.checkFinalAttackTrigger();
        }

        return { success: true, targetMatched: true, targetType: 'stockpile', acquiredCard: targetCard, total };
      } else {
        // Market Purchase: Check Hand Capacity (max 7)
        if (this.hand.length >= this.maxHandCapacity) {
          if (replaceCardId) {
            // Replaced card specified directly
            const cardIdx = this.hand.findIndex(c => (c.uid || c.id) === replaceCardId);
            if (cardIdx !== -1) {
              const replaced = this.hand.splice(cardIdx, 1)[0];
              this.removedCards.push(replaced);
              this.hand.push(targetCard);
              this.market[targetIndex] = null;

              this.addLog(`🛒 BUY SUCCESS: [${sequenceSummary}] = ${total}. Hand at capacity (7/7): Replaced ${replaced.label} with ${targetCard.label} (🎯 ${targetCard.target})! (Battery: ${this.currentBolts}/${this.maxBolts} ⚡)`, 'success');
              this.checkFinalAttackTrigger();
              return { success: true, targetMatched: true, targetType: 'market', acquiredCard: targetCard, replacedCard: replaced, total };
            }
          }

          // Hand is full; require player to choose replacement card
          this.pendingPurchase = { targetIndex, card: targetCard };
          this.addLog(`🛒 BUY TARGET MATCHED: [${sequenceSummary}] = ${total}. Scooter is at capacity (${this.hand.length}/${this.maxHandCapacity}). Choose 1 card from hand to permanently replace.`, 'info');
          return { success: true, targetMatched: true, targetType: 'market', needsReplacement: true, acquiredCard: targetCard, total };
        } else {
          // Below capacity: add directly to hand
          this.market[targetIndex] = null;
          this.hand.push(targetCard);

          this.addLog(`🛒 BUY SUCCESS: [${sequenceSummary}] = ${total}. Acquired ${targetCard.label} (🎯 ${targetCard.target}) into hand (${this.hand.length}/${this.maxHandCapacity})! (Battery: ${this.currentBolts}/${this.maxBolts} ⚡)`, 'success');
          this.checkFinalAttackTrigger();
          return { success: true, targetMatched: true, targetType: 'market', acquiredCard: targetCard, total };
        }
      }
    } else {
      const typeDesc = targetType === 'stockpile' ? 'Treasure target' : 'Market card target';
      this.addLog(`❌ BUY FAILED: [${sequenceSummary}] = ${total}. Needed ${typeDesc} 🎯 ${targetCard.target}. (Battery: ${this.currentBolts}/${this.maxBolts} ⚡)`, 'warning');
      
      if (this.status === 'post_game') {
        if (this.currentBolts === 0) {
          this.status = 'won';
          this.statusMessage = 'Adventure complete! Out of energy. Banked gems.';
          this.addLog(`🏆 ADVENTURE COMPLETE: Out of energy. Banked ${this.totalGems} gems!`, 'victory');
        }
      } else {
        this.checkFinalAttackTrigger();
      }

      return { success: true, targetMatched: false, targetType, total };
    }
  }

  /**
   * Completes a pending card purchase by replacing an existing card in hand.
   */
  replaceAndAcquire(replaceCardId) {
    if (!this.pendingPurchase) {
      return { success: false, reason: 'No pending card purchase requiring replacement.' };
    }

    const { targetIndex, card: targetCard } = this.pendingPurchase;
    const cardIdx = this.hand.findIndex(c => (c.uid || c.id) === replaceCardId);
    if (cardIdx === -1) {
      return { success: false, reason: 'Selected replacement card not found in hand.' };
    }

    const replaced = this.hand.splice(cardIdx, 1)[0];
    this.removedCards.push(replaced);
    this.hand.push(targetCard);
    this.market[targetIndex] = null;
    this.pendingPurchase = null;

    this.addLog(`🔄 CARD REPLACED: Permanently removed ${replaced.label} and added ${targetCard.label} to hand (${this.hand.length}/${this.maxHandCapacity}).`, 'success');
    this.checkFinalAttackTrigger();

    return { success: true, acquiredCard: targetCard, replacedCard: replaced };
  }

  /**
   * ACTION 3: Market Refresh
   * Replaces all 5 market cards with fresh cards from draw pile. Costs 1 bolt.
   */
  playMarketRefresh() {
    if (this.status !== 'in_progress') return { success: false, reason: 'Game has already ended.' };
    if (this.pendingPurchase) return { success: false, reason: 'Complete card replacement first.' };
    if (this.isFinalAttack) return { success: false, reason: 'Scooter is out of battery! Only Final Attack is available.' };
    if (this.currentBolts <= 0) return { success: false, reason: 'Out of bolts.' };

    for (const card of this.market) {
      if (card) {
        this.drawDiscard.push(card);
      }
    }

    this.initMarket();
    this.spendBolt();

    this.addLog(`🔄 MARKET REFRESH: Replaced all 5 market cards. (Battery: ${this.currentBolts}/${this.maxBolts} ⚡)`, 'info');
    this.checkFinalAttackTrigger();
    return { success: true };
  }

  /**
   * Pickup Action has been removed in v0.8.
   */
  playPickup() {
    return {
      success: false,
      reason: 'The Pickup action has been removed in v0.8. Number cards are permanently reusable and return to hand automatically.'
    };
  }

  /**
   * Voluntary End Run: safely bank what you have collected and conclude the adventure.
   */
  endRun() {
    if (this.status === 'won' || this.status === 'lost') {
      return { success: false, reason: 'Adventure already concluded.' };
    }

    this.status = 'won';
    this.statusMessage = `Adventure concluded. Safely banked ${this.totalGems} gems!`;
    this.addLog(`⚓ ADVENTURE CONCLUDED: Safely banked ${this.totalGems} gems! Permanent legacy stash: ${GameState.getPermanentGems()} 💎.`, 'victory');
    return { success: true, totalGems: this.totalGems };
  }

  checkFinalAttackTrigger() {
    if (this.isFinalAttack) {
      this.addLog(`🚨 FINAL ATTACK ACTIVATED: Scooter battery is depleted (0/${this.maxBolts} ⚡)! You have one final Attack to hit 🎯 ${this.currentMonster.target} or the journey ends.`, 'warning');
    }
  }

  // --- DEBUG / TEST CONTROLS ---

  debugSkipMonster() {
    if (this.currentMonster) {
      const isFinalMonster = (this.currentMonsterIndex === this.monstersList.length - 1);
      this.handleFishDefeat(isFinalMonster, this.currentMonster, false);
      this.addLog(`[Debug] Skipped sea creature.`, 'system');
    }
  }

  debugAdjustBolts(delta) {
    this.currentBolts = Math.max(0, Math.min(this.maxBolts, this.currentBolts + delta));
    this.addLog(`[Debug] Adjusted battery by ${delta}. Current: ${this.currentBolts}/${this.maxBolts} ⚡`, 'system');
    this.checkFinalAttackTrigger();
  }

  debugAddCard(op, value) {
    const card = {
      uid: `debug_card_${Date.now()}_${Math.random()}`,
      type: 'number',
      op,
      value: Number(value),
      label: `${op}${value}`,
      target: Math.abs(Number(value))
    };
    this.hand.push(card);
    this.addLog(`[Debug] Added card ${card.label} to hand (${this.hand.length}/${this.maxHandCapacity}).`, 'system');
  }

  debugRevealTreasure() {
    const t = this.revealTreasureToStockpile();
    if (!t) {
      this.addLog('[Debug] Treasure deck is empty.', 'system');
    }
  }
}
