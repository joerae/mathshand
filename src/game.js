/**
 * Core Game Engine for Maths Handbuilder (v0.7 Underwater Scooter)
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

    // Electric Scooter Battery (5 double-sided bolt cards)
    this.maxBolts = 5;
    this.currentBolts = 5; // Starts with 5 charged bolts

    // Number Draw Deck & Discard (66 cards total; no doom cards)
    this.drawPile = shuffle(buildDrawPile());
    this.drawDiscard = []; // Refreshed market cards

    // Separate Treasure Deck & Stockpile
    this.treasureDeck = shuffle(buildTreasureDeck());
    this.treasureStockpile = []; // Revealed treasures available to claim (starts empty)
    this.treasureChest = [];     // Claimed treasures / gems
    this.victoryTreasure = null; // Bonus treasure awarded upon defeating final fish

    // Player Hand & Discard (Only contains number cards)
    this.hand = JSON.parse(JSON.stringify(STARTING_HAND)); // +1, +2, +3
    this.playerDiscard = [];

    // Market: 5 number cards
    this.market = [];
    this.initMarket();

    // Game status: 'in_progress', 'won', 'lost'
    this.status = 'in_progress';
    this.statusMessage = '';

    // Action log
    this.log = [];
    this.addLog(`Underwater scooter adventure started (v0.7 rules). Battery: 5/5 bolts. First encounter: ${this.currentMonster.name}!`);
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
   * Final Attack is active when scooter battery reaches 0 bolts.
   * During Final Attack, no other actions (Buy, Refresh, Pickup) are available.
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
   * Discards cards from hand by their unique ID/reference.
   */
  discardFromHand(cardsToDiscard) {
    const cardIds = new Set(cardsToDiscard.map(c => c.uid || c.id));
    const kept = [];
    const discarded = [];

    for (const c of this.hand) {
      const id = c.uid || c.id;
      if (cardIds.has(id)) {
        discarded.push(c);
        cardIds.delete(id);
      } else {
        kept.push(c);
      }
    }

    this.hand = kept;
    this.playerDiscard.push(...discarded);
  }

  /**
   * ACTION 1: Attack Sea Creature
   * Costs 1 bolt.
   * On Final Attack (0 bolts), success defeats fish and continues; miss ends journey.
   */
  playAttack(selectedNumberCards) {
    if (this.status !== 'in_progress') return { success: false, reason: 'Game has already ended.' };

    const wasFinalAttack = this.isFinalAttack;
    const fish = this.currentMonster;
    const isFinalFish = (this.currentMonsterIndex === this.monstersList.length - 1);
    const { total, steps } = GameState.calculateSequence(selectedNumberCards);
    const targetMatched = (total === fish.target);
    const sequenceSummary = steps.map(s => s.card.label).join(' → ') || '(0 cards)';

    // Discard played number cards
    this.discardFromHand(selectedNumberCards);

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
   * 1. Recharges battery bolts up to max 5.
   * 2. Auto-pickup: returns all played number cards to hand.
   * 3. Auto-refill: fills empty market slots up to 5.
   * 4. Reveals 1 random treasure into stockpile (or awards victory bonus on final fish).
   */
  handleFishDefeat(isFinalFish, fish, fromFinalAttack = false) {
    if (isFinalFish) {
      // Final fish (Great White Shark) defeated: award final treasure automatically!
      const victoryTreasure = this.drawTreasureCard();
      if (victoryTreasure) {
        this.treasureChest.push(victoryTreasure);
        GameState.addPermanentGems(victoryTreasure.gems);
      }
      this.victoryTreasure = victoryTreasure;
      this.sharkDefeated = true;

      // Pick up all played cards so full hand is available to claim treasures
      this.hand.push(...this.playerDiscard);
      this.playerDiscard = [];

      if (this.treasureStockpile.length > 0 && this.currentBolts > 0) {
        this.status = 'post_game';
        this.statusMessage = 'Great White Shark defeated! You can spend remaining bolts on stockpile treasures, or hit End Run to bank your haul.';
        this.addLog(`🏆 GREAT WHITE SHARK DEFEATED! Victory bonus awarded (+${victoryTreasure ? victoryTreasure.gems : 0} 💎). You have ${this.currentBolts} bolts remaining to claim stockpile treasures, or hit "End Run" to bank your haul!`, 'victory');
      } else {
        this.status = 'won';
        this.statusMessage = 'Victory! Great White Shark defeated! Adventure completed!';
        this.addLog(`🏆 VICTORY: Great White Shark defeated! Final victory bonus: ${victoryTreasure ? `${victoryTreasure.label} (+${victoryTreasure.gems} 💎)` : 'None'}. Total gems earned: ${this.totalGems} 💎!`, 'victory');
      }
    } else {
      // 1. Restore bolts
      const rechargeAmount = typeof fish.recharge === 'number' ? fish.recharge : 0;
      const boltsBefore = this.currentBolts;
      this.currentBolts = Math.min(this.maxBolts, this.currentBolts + rechargeAmount);
      const boltsRestored = this.currentBolts - boltsBefore;

      // 2. Automatic Pickup: Return all played cards to hand
      const cardsPickedUp = this.playerDiscard.length;
      this.hand.push(...this.playerDiscard);
      this.playerDiscard = [];

      // 3. Automatic Market Refill: Replenish empty slots
      const slotsRefilled = this.refillEmptyMarketSlots();

      // 4. Reveal 1 treasure into the stockpile
      this.currentMonsterIndex++;
      const nextFish = this.currentMonster;
      const revealedTreasure = this.revealTreasureToStockpile();

      this.addLog(
        `⚡ POST-BATTLE RECOVERY: Recharged +${boltsRestored} bolts (${this.currentBolts}/${this.maxBolts} ⚡), retrieved ${cardsPickedUp} cards to hand, and refilled ${slotsRefilled} market slots. Next encounter: ${nextFish.name} (🎯 ${nextFish.target}, ⚡ Recharge: +${nextFish.recharge})!`,
        'success'
      );
    }
  }

  // Alias for backward compatibility
  handleMonsterDefeat(isFinalMonster, monster) {
    return this.handleFishDefeat(isFinalMonster, monster, false);
  }

  /**
   * ACTION 2: Buy / Claim (Market Card OR Stockpile Treasure)
   * Costs 1 bolt.
   * - targetType: 'market' (buys number card into hand)
   * - targetType: 'stockpile' (claims treasure into treasure chest)
   */
  playBuy(targetType, targetIndex, selectedNumberCards) {
    if (this.status !== 'in_progress' && this.status !== 'post_game') {
      return { success: false, reason: 'Game has already ended.' };
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

    // Discard played number cards
    this.discardFromHand(selectedNumberCards);

    // Costs 1 bolt
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
            this.statusMessage = 'Victory! Completed post-game treasure claiming.';
            this.addLog(`🏆 VICTORY COMPLETE: Finished spending remaining bolts. Total gems earned: ${this.totalGems} 💎!`, 'victory');
          }
        } else {
          this.checkFinalAttackTrigger();
        }

        return { success: true, targetMatched: true, targetType: 'stockpile', acquiredCard: targetCard, total };
      } else {
        // Buy number card from market -> into hand (slot stays empty until next fish defeat or refresh)
        this.market[targetIndex] = null;
        this.hand.push(targetCard);

        this.addLog(`🛒 BUY SUCCESS: [${sequenceSummary}] = ${total}. Acquired ${targetCard.label} (🎯 ${targetCard.target}) into hand! (Battery: ${this.currentBolts}/${this.maxBolts} ⚡)`, 'success');
        
        if (this.status === 'post_game') {
          if (this.currentBolts === 0) {
            this.status = 'won';
            this.statusMessage = 'Victory! Completed post-game shopping.';
          }
        } else {
          this.checkFinalAttackTrigger();
        }

        return { success: true, targetMatched: true, targetType: 'market', acquiredCard: targetCard, total };
      }
    } else {
      const typeDesc = targetType === 'stockpile' ? 'Treasure target' : 'Market card target';
      this.addLog(`❌ BUY FAILED: [${sequenceSummary}] = ${total}. Needed ${typeDesc} 🎯 ${targetCard.target}. (Battery: ${this.currentBolts}/${this.maxBolts} ⚡)`, 'warning');
      
      if (this.status === 'post_game') {
        if (this.currentBolts === 0) {
          this.status = 'won';
          this.statusMessage = 'Victory! Out of bolts during post-game.';
          this.addLog(`🏆 VICTORY COMPLETE: Out of bolts. Banked ${this.totalGems} gems!`, 'victory');
        }
      } else {
        this.checkFinalAttackTrigger();
      }

      return { success: true, targetMatched: false, targetType, total };
    }
  }

  /**
   * ACTION 3: Market Refresh
   * Replaces all 5 market cards with fresh cards from draw pile. Costs 1 bolt.
   */
  playMarketRefresh() {
    if (this.status !== 'in_progress') return { success: false, reason: 'Game has already ended.' };
    if (this.isFinalAttack) return { success: false, reason: 'Scooter is out of battery! Only Final Attack is available.' };

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
   * ACTION 4: Pickup
   * Returns all played number cards in player discard back to hand mid-encounter. Costs 1 bolt.
   */
  playPickup() {
    if (this.status !== 'in_progress' && this.status !== 'post_game') {
      return { success: false, reason: 'Game has already ended.' };
    }
    if (this.isFinalAttack && this.status === 'in_progress') {
      return { success: false, reason: 'Scooter is out of battery! Only Final Attack is available.' };
    }
    if (this.currentBolts <= 0) {
      return { success: false, reason: 'Out of bolts.' };
    }

    const returnedCount = this.playerDiscard.length;
    this.hand.push(...this.playerDiscard);
    this.playerDiscard = [];

    this.spendBolt();

    this.addLog(`✋ PICKUP: Retrieved ${returnedCount} cards from discard back to hand. (Battery: ${this.currentBolts}/${this.maxBolts} ⚡)`, 'info');
    
    if (this.status === 'post_game' && this.currentBolts === 0) {
      this.status = 'won';
      this.statusMessage = 'Victory! Out of bolts during post-game.';
      this.addLog(`🏆 VICTORY COMPLETE: Out of bolts. Banked ${this.totalGems} gems!`, 'victory');
    } else {
      this.checkFinalAttackTrigger();
    }

    return { success: true, returnedCount };
  }

  /**
   * Voluntary End Run: safely bank what you have collected and conclude the adventure.
   */
  endRun() {
    if (this.status === 'won' || this.status === 'lost') {
      return { success: false, reason: 'Adventure already concluded.' };
    }

    this.status = 'won';
    this.statusMessage = `Adventure ended. Safely banked ${this.totalGems} gems!`;
    this.addLog(`⚓ END RUN: Safely banked ${this.totalGems} gems! Permanent legacy stash: ${GameState.getPermanentGems()} 💎.`, 'victory');
    return { success: true, totalGems: this.totalGems };
  }

  checkFinalAttackTrigger() {
    if (this.isFinalAttack) {
      this.addLog(`🚨 FINAL ATTACK ACTIVATED: Scooter battery is depleted (0/5 ⚡)! You have one final Attack to hit 🎯 ${this.currentMonster.target} or the journey ends.`, 'warning');
    }
  }

  // --- DEBUG / TEST CONTROLS FOR QUICK RULES ITERATION ---

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
    this.addLog(`[Debug] Added card ${card.label} to hand.`, 'system');
  }

  debugRevealTreasure() {
    const t = this.revealTreasureToStockpile();
    if (!t) {
      this.addLog('[Debug] Treasure deck is empty.', 'system');
    }
  }
}
