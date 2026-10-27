/**
 * Core Game Engine for Maths Handbuilder (v0.5)
 */
import { STARTING_HAND, buildDrawPile, GAME_CONFIG } from '../data/cards.js';
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
    
    // Decks & Piles
    this.drawPile = shuffle(buildDrawPile()); // 66 number cards
    this.drawDiscard = [];     // Discarded doom cards and refreshed market cards
    this.doomCards = [];       // Face-down cards on the current monster
    
    // Player Hand & Discard (Only contains number cards in v0.5)
    this.hand = JSON.parse(JSON.stringify(STARTING_HAND)); // +1, +2, +3
    this.playerDiscard = [];
    
    // Market: array of 5 slots (contains card object or null)
    this.market = [];
    this.initMarket();

    // Game status: 'in_progress', 'won', 'lost'
    this.status = 'in_progress';
    this.statusMessage = '';

    // Action log for reviewing turns
    this.log = [];
    this.addLog('Game started (v0.5 rules). Starting hand: +1, +2, +3. First monster: ' + this.currentMonster.name);
  }

  get currentMonster() {
    return this.monstersList[this.currentMonsterIndex] || null;
  }

  get currentDoom() {
    return this.doomCards.length;
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
   * Populate market with cards from draw pile up to marketSize
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
   * Number cards apply their operator (+, -, ×) to running total.
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
   * In v0.5, Attack is an intrinsic action (always available).
   * If in Final Attack:
   *   - Success defeats monster and advances.
   *   - Failure immediately ends the game in defeat!
   * If not in Final Attack:
   *   - Adds 1 Doom counter.
   *   - Success defeats monster and advances.
   *   - Failure keeps monster and triggers Final Attack if doom reaches limit.
   */
  playAttack(selectedNumberCards) {
    if (this.status !== 'in_progress') return { success: false, reason: 'Game has already ended.' };

    const wasFinalAttack = this.isFinalAttack;
    const monster = this.currentMonster;
    const { total, steps } = GameState.calculateSequence(selectedNumberCards);
    const targetMatched = (total === monster.target);
    const sequenceSummary = steps.map(s => s.card.label).join(' → ') || '(0 cards)';

    // Discard played number cards
    this.discardFromHand(selectedNumberCards);

    if (wasFinalAttack) {
      // Final Attack chance: do not add extra doom, this is the final resolution
      if (targetMatched) {
        this.addLog(`⚔️ FINAL ATTACK SUCCESS: [${sequenceSummary}] = ${total}. Defeated ${monster.name} on the brink of doom!`, 'success');
        this.drawDiscard.push(...this.doomCards);
        this.doomCards = [];

        this.currentMonsterIndex++;
        if (this.currentMonsterIndex >= this.monstersList.length) {
          this.status = 'won';
          this.statusMessage = 'Victory! All monsters defeated!';
          this.addLog('🏆 VICTORY: You have defeated all monsters and won the game!', 'victory');
        } else {
          this.addLog(`Next monster revealed: ${this.currentMonster.name} (🎯 ${this.currentMonster.target}, ☠ Doom Limit ${this.currentMonster.doomLimit})`, 'info');
        }
        return { success: true, targetMatched: true, finalAttack: true, total };
      } else {
        // Final attack failed -> Game Over!
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

      this.currentMonsterIndex++;
      if (this.currentMonsterIndex >= this.monstersList.length) {
        this.status = 'won';
        this.statusMessage = 'Victory! All monsters defeated!';
        this.addLog('🏆 VICTORY: You have defeated all monsters and won the game!', 'victory');
      } else {
        this.addLog(`Next monster revealed: ${this.currentMonster.name} (🎯 ${this.currentMonster.target}, ☠ Doom Limit ${this.currentMonster.doomLimit})`, 'info');
      }
      return { success: true, targetMatched: true, finalAttack: false, total };
    } else {
      this.addLog(`❌ ATTACK FAILED: [${sequenceSummary}] = ${total}. Needed 🎯 ${monster.target}. (Doom: ${this.currentDoom}/${monster.doomLimit})`, 'warning');
      this.checkFinalAttackTrigger();
      return { success: true, targetMatched: false, finalAttack: false, total };
    }
  }

  /**
   * ACTION 2: Buy Market Card
   * In v0.5, Buy is an intrinsic action (always available unless in Final Attack).
   */
  playBuy(marketIndex, selectedNumberCards) {
    if (this.status !== 'in_progress') return { success: false, reason: 'Game has already ended.' };
    if (this.isFinalAttack) return { success: false, reason: 'Final Attack active! No other actions are available.' };

    const marketCard = this.market[marketIndex];
    if (!marketCard) {
      return { success: false, reason: 'Selected market slot is empty.' };
    }

    const { total, steps } = GameState.calculateSequence(selectedNumberCards);
    const targetMatched = (total === marketCard.target);
    const sequenceSummary = steps.map(s => s.card.label).join(' → ') || '(0 cards)';

    // Discard played number cards
    this.discardFromHand(selectedNumberCards);

    // Adds 1 Doom counter
    this.addDoomCard();

    if (targetMatched) {
      // Purchased card goes immediately to hand
      this.hand.push(marketCard);
      this.market[marketIndex] = null;

      this.addLog(`🛒 BUY SUCCESS: [${sequenceSummary}] = ${total}. Acquired ${marketCard.label} (🎯 ${marketCard.target}) into hand! (Doom: ${this.currentDoom}/${this.currentMonster.doomLimit})`, 'success');
      this.checkFinalAttackTrigger();
      return { success: true, targetMatched: true, acquiredCard: marketCard, total };
    } else {
      this.addLog(`❌ BUY FAILED: [${sequenceSummary}] = ${total}. Needed 🎯 ${marketCard.target}. Card not acquired. (Doom: ${this.currentDoom}/${this.currentMonster.doomLimit})`, 'warning');
      this.checkFinalAttackTrigger();
      return { success: true, targetMatched: false, total };
    }
  }

  /**
   * ACTION 3: Market Refresh
   * In v0.5, Market Refresh is an intrinsic action (always available unless in Final Attack).
   */
  playMarketRefresh() {
    if (this.status !== 'in_progress') return { success: false, reason: 'Game has already ended.' };
    if (this.isFinalAttack) return { success: false, reason: 'Final Attack active! No other actions are available.' };

    // Discard all remaining market cards to draw discard
    for (const card of this.market) {
      if (card) {
        this.drawDiscard.push(card);
      }
    }

    // Deal 5 fresh cards
    this.initMarket();

    // Adds 1 Doom counter
    this.addDoomCard();

    this.addLog(`🔄 MARKET REFRESH: Dealt 5 new cards to market. (Doom: ${this.currentDoom}/${this.currentMonster.doomLimit})`, 'info');
    this.checkFinalAttackTrigger();
    return { success: true };
  }

  /**
   * ACTION 4: Pickup
   * In v0.5, Pickup is an intrinsic action (always available unless in Final Attack).
   * Returns all played number cards in player discard back to hand.
   */
  playPickup() {
    if (this.status !== 'in_progress') return { success: false, reason: 'Game has already ended.' };
    if (this.isFinalAttack) return { success: false, reason: 'Final Attack active! No other actions are available.' };

    const returnedCount = this.playerDiscard.length;
    this.hand.push(...this.playerDiscard);
    this.playerDiscard = [];

    // Adds 1 Doom counter
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
      this.currentMonsterIndex++;
      if (this.currentMonsterIndex >= this.monstersList.length) {
        this.status = 'won';
        this.statusMessage = 'Victory! All monsters defeated (via test skip).';
      }
      this.addLog(`[Debug] Skipped to monster ${this.currentMonster ? this.currentMonster.name : 'End'}.`, 'system');
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
}
