/**
 * Core Game Engine for Maths Handbuilder (v0.6)
 */
import { STARTING_HAND, buildDrawPile, GAME_CONFIG } from '../data/cards.js';
import { buildTreasureDeck } from '../data/treasures.js';
import { MONSTERS } from '../data/monsters.js';

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
    this.monsters = customMonsters || MONSTERS;
    this.reset();
  }

  reset() {
    this.monstersList = JSON.parse(JSON.stringify(this.monsters));
    this.currentMonsterIndex = 0;
    
    // Number Draw Deck & Piles (66 cards)
    this.drawPile = shuffle(buildDrawPile());
    this.drawDiscard = [];     // Discarded doom cards and refreshed market cards
    this.doomCards = [];       // Face-down cards on the current monster
    
    // Separate Treasure Deck & Stockpile (v0.6)
    this.treasureDeck = shuffle(buildTreasureDeck());
    this.treasureStockpile = []; // Revealed treasures available to claim (starts empty)
    this.treasureChest = [];     // Claimed treasures / gems
    this.victoryTreasure = null; // Bonus treasure awarded upon defeating monster 6
    
    // Player Hand & Discard (Only contains number cards)
    this.hand = JSON.parse(JSON.stringify(STARTING_HAND)); // +1, +2, +3
    this.playerDiscard = [];
    
    // Market: 5 number cards
    this.market = [];
    this.initMarket();

    // Game status: 'in_progress', 'won', 'lost'
    this.status = 'in_progress';
    this.statusMessage = '';

    // Action log for reviewing turns
    this.log = [];
    this.addLog('Game started (v0.6 rules). Starting hand: +1, +2, +3. First monster: ' + this.currentMonster.name);
  }

  get currentMonster() {
    return this.monstersList[this.currentMonsterIndex] || null;
  }

  get currentDoom() {
    return this.doomCards.length;
  }

  get totalGems() {
    return this.treasureChest.reduce((sum, t) => sum + (t.gems || 0), 0);
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

  /**
   * Final Attack is active when Doom reaches or exceeds the monster's doom limit.
   * During Final Attack, no other actions (Buy, Refresh, Pickup) are available.
   */
  get isFinalAttack() {
    return (
      this.status === 'in_progress' &&
      this.currentMonster !== null &&
      this.currentDoom >= this.currentMonster.doomLimit
    );
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
   * Adds 1 doom card to the monster from the draw pile.
   */
  addDoomCard() {
    const card = this.drawCardFromDeck();
    if (card) {
      this.doomCards.push(card);
    }
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
   * ACTION 1: Attack Monster
   * Defeating monster 1-5 adds 1 treasure to the stockpile.
   * Defeating the final monster automatically awards final treasure and wins!
   */
  playAttack(selectedNumberCards) {
    if (this.status !== 'in_progress') return { success: false, reason: 'Game has already ended.' };

    const wasFinalAttack = this.isFinalAttack;
    const monster = this.currentMonster;
    const isFinalMonster = (this.currentMonsterIndex === this.monstersList.length - 1);
    const { total, steps } = GameState.calculateSequence(selectedNumberCards);
    const targetMatched = (total === monster.target);
    const sequenceSummary = steps.map(s => s.card.label).join(' → ') || '(0 cards)';

    // Discard played number cards
    this.discardFromHand(selectedNumberCards);

    if (wasFinalAttack) {
      if (targetMatched) {
        this.addLog(`⚔️ FINAL ATTACK SUCCESS: [${sequenceSummary}] = ${total}. Defeated ${monster.name} on the brink of doom!`, 'success');
        this.drawDiscard.push(...this.doomCards);
        this.doomCards = [];

        this.handleMonsterDefeat(isFinalMonster, monster);
        return { success: true, targetMatched: true, finalAttack: true, total };
      } else {
        this.status = 'lost';
        this.statusMessage = `Final Attack failed against ${monster.name}! Needed 🎯 ${monster.target}, got ${total}.`;
        this.addLog(`☠️ GAME OVER: Final Attack missed [${sequenceSummary}] = ${total} (needed 🎯 ${monster.target}). The monster overwhelmed you!`, 'danger');
        return { success: true, targetMatched: false, finalAttack: true, total };
      }
    }

    // Normal Attack: adds 1 Doom counter
    this.addDoomCard();

    if (targetMatched) {
      this.addLog(`⚔️ ATTACK SUCCESS: [${sequenceSummary}] = ${total}. Defeated ${monster.name} (🎯 ${monster.target})!`, 'success');
      this.drawDiscard.push(...this.doomCards);
      this.doomCards = [];

      this.handleMonsterDefeat(isFinalMonster, monster);
      return { success: true, targetMatched: true, finalAttack: false, total };
    } else {
      this.addLog(`❌ ATTACK FAILED: [${sequenceSummary}] = ${total}. Needed 🎯 ${monster.target}. (Doom: ${this.currentDoom}/${monster.doomLimit})`, 'warning');
      this.checkFinalAttackTrigger();
      return { success: true, targetMatched: false, finalAttack: false, total };
    }
  }

  handleMonsterDefeat(isFinalMonster, monster) {
    if (isFinalMonster) {
      // Final monster defeated: award final treasure automatically!
      const victoryTreasure = this.drawTreasureCard();
      if (victoryTreasure) {
        this.treasureChest.push(victoryTreasure);
        GameState.addPermanentGems(victoryTreasure.gems);
      }
      this.victoryTreasure = victoryTreasure;
      this.status = 'won';
      this.statusMessage = 'Victory! All monsters defeated!';
      this.addLog(`🏆 VICTORY: All monsters defeated! Final victory bonus: ${victoryTreasure ? `${victoryTreasure.label} (+${victoryTreasure.gems} 💎)` : 'None'}. Total gems earned: ${this.totalGems} 💎!`, 'victory');
    } else {
      // Monsters 1 to 5: reveal 1 treasure into the stockpile
      this.currentMonsterIndex++;
      this.revealTreasureToStockpile();
      this.addLog(`Next monster revealed: ${this.currentMonster.name} (🎯 ${this.currentMonster.target}, ☠ Doom Limit ${this.currentMonster.doomLimit})`, 'info');
    }
  }

  /**
   * ACTION 2: Buy (Market Card OR Stockpile Treasure)
   * In v0.6:
   * - targetType: 'market' (buys number card into hand)
   * - targetType: 'stockpile' (claims treasure into treasure chest)
   */
  playBuy(targetType, targetIndex, selectedNumberCards) {
    if (this.status !== 'in_progress') return { success: false, reason: 'Game has already ended.' };
    if (this.isFinalAttack) return { success: false, reason: 'Final Attack active! No other actions are available.' };

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

    // Adds 1 Doom counter
    this.addDoomCard();

    if (targetMatched) {
      if (targetType === 'stockpile') {
        // Claim treasure from stockpile -> into treasure chest
        this.treasureStockpile.splice(targetIndex, 1);
        this.treasureChest.push(targetCard);
        GameState.addPermanentGems(targetCard.gems);

        this.addLog(`💎 TREASURE CLAIMED: [${sequenceSummary}] = ${total}. Claimed ${targetCard.label} (🎯 ${targetCard.target}, +${targetCard.gems} 💎)! Total: ${this.totalGems} 💎. (Doom: ${this.currentDoom}/${this.currentMonster.doomLimit})`, 'treasure');
        this.checkFinalAttackTrigger();
        return { success: true, targetMatched: true, targetType: 'stockpile', acquiredCard: targetCard, total };
      } else {
        // Buy number card from market -> into hand
        this.market[targetIndex] = null;
        this.hand.push(targetCard);

        this.addLog(`🛒 BUY SUCCESS: [${sequenceSummary}] = ${total}. Acquired ${targetCard.label} (🎯 ${targetCard.target}) into hand! (Doom: ${this.currentDoom}/${this.currentMonster.doomLimit})`, 'success');
        this.checkFinalAttackTrigger();
        return { success: true, targetMatched: true, targetType: 'market', acquiredCard: targetCard, total };
      }
    } else {
      const typeDesc = targetType === 'stockpile' ? 'Treasure target' : 'Market card target';
      this.addLog(`❌ BUY FAILED: [${sequenceSummary}] = ${total}. Needed ${typeDesc} 🎯 ${targetCard.target}. (Doom: ${this.currentDoom}/${this.currentMonster.doomLimit})`, 'warning');
      this.checkFinalAttackTrigger();
      return { success: true, targetMatched: false, targetType, total };
    }
  }

  /**
   * ACTION 3: Market Refresh
   * Replaces the 5 market cards with fresh number cards from draw pile.
   */
  playMarketRefresh() {
    if (this.status !== 'in_progress') return { success: false, reason: 'Game has already ended.' };
    if (this.isFinalAttack) return { success: false, reason: 'Final Attack active! No other actions are available.' };

    for (const card of this.market) {
      if (card) {
        this.drawDiscard.push(card);
      }
    }

    this.initMarket();
    this.addDoomCard();

    this.addLog(`🔄 MARKET REFRESH: Dealt 5 new cards to market. (Doom: ${this.currentDoom}/${this.currentMonster.doomLimit})`, 'info');
    this.checkFinalAttackTrigger();
    return { success: true };
  }

  /**
   * ACTION 4: Pickup
   * Returns all played number cards in player discard back to hand.
   */
  playPickup() {
    if (this.status !== 'in_progress') return { success: false, reason: 'Game has already ended.' };
    if (this.isFinalAttack) return { success: false, reason: 'Final Attack active! No other actions are available.' };

    const returnedCount = this.playerDiscard.length;
    this.hand.push(...this.playerDiscard);
    this.playerDiscard = [];

    this.addDoomCard();

    this.addLog(`✋ PICKUP: Retrieved ${returnedCount} cards from discard back to hand. (Doom: ${this.currentDoom}/${this.currentMonster.doomLimit})`, 'info');
    this.checkFinalAttackTrigger();
    return { success: true, returnedCount };
  }

  checkFinalAttackTrigger() {
    if (this.isFinalAttack) {
      this.addLog(`🚨 FINAL ATTACK ACTIVATED: Doom reached ${this.currentDoom}/${this.currentMonster.doomLimit}! Make your Final Attack now (hit 🎯 ${this.currentMonster.target} or game ends).`, 'warning');
    }
  }

  // --- DEBUG / TEST CONTROLS FOR QUICK RULES ITERATION ---

  debugSkipMonster() {
    if (this.currentMonster) {
      this.drawDiscard.push(...this.doomCards);
      this.doomCards = [];
      const isFinalMonster = (this.currentMonsterIndex === this.monstersList.length - 1);
      this.handleMonsterDefeat(isFinalMonster, this.currentMonster);
      this.addLog(`[Debug] Skipped monster.`, 'system');
    }
  }

  debugAdjustDoom(delta) {
    if (delta > 0) {
      for (let i = 0; i < delta; i++) {
        this.addDoomCard();
      }
    } else if (delta < 0) {
      for (let i = 0; i < Math.abs(delta); i++) {
        const removed = this.doomCards.pop();
        if (removed) this.drawDiscard.push(removed);
      }
    }
    this.addLog(`[Debug] Adjusted doom by ${delta}. Current: ${this.currentDoom}/${this.currentMonster ? this.currentMonster.doomLimit : '-'}`, 'system');
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
