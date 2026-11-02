/**
 * Core Game Engine for Maths Handbuilder (v0.10 – Seven Seas)
 *
 * All content is data-driven from the spreadsheet (via data/game_data.js):
 * - Choose a Sea (A–G) and a Scooter. Cards marked A..Sea are unlocked.
 * - Scooter sets starting hand, hand capacity, battery and abilities.
 * - Sea card sets the number of encounters and fish selection.
 * - Fish may have special abilities (no recharge, discard cards on encounter,
 *   destroy unclaimed treasure, multiple targets).
 * - Three repeatable quests per sea award gems once per adventure.
 *
 * Core rules (unchanged from v0.8):
 * - Calculations start at 0, applied in the order played.
 * - Number cards are reusable and return to hand after every action.
 * - Attack / Buy / Refresh each cost 1 bolt, even when unsuccessful.
 * - At 0 bolts, one free Final Attack; a miss ends the adventure.
 * - Defeating the final fish starts the Victory Lap (treasure claims only).
 */
import {
  GAME_CONFIG, SEA_ORDER, getSea, getScooter, defaultScooterForSea,
  buildStartingHand, buildDrawPile, buildTreasureDeck, buildEncounters,
  questsForSea, shuffle
} from '../data/content.js';
import { QuestTracker } from './quests.js';

export { shuffle };

export class GameState {
  /**
   * @param {object} [options]
   * @param {string} [options.sea='A']        Sea letter A–G
   * @param {string} [options.scooterId]      Scooter card ID (defaults to the sea's own scooter)
   * @param {Array}  [options.encounters]     Override encounter list (testing)
   */
  constructor(options = {}) {
    this.options = options;
    this.reset();
  }

  reset() {
    const { sea = 'A', scooterId, encounters } = this.options;

    this.sea = getSea(sea) || getSea(SEA_ORDER[0]);
    this.scooter = (scooterId && getScooter(scooterId)) || defaultScooterForSea(this.sea.letter);
    if (!this.scooter) throw new Error(`No scooter available for Sea ${this.sea.letter}`);

    // Encounters
    this.monstersList = encounters
      ? JSON.parse(JSON.stringify(encounters)).map(f => {
          const targets = f.targets || (f.abilities?.multiTargets?.length ? f.abilities.multiTargets : [f.target]);
          return {
            ...f,
            targets,
            remainingTargets: targets.slice(),
            target: targets[0]
          };
        })
      : buildEncounters(this.sea.letter);
    this.currentMonsterIndex = 0;
    this.sharkDefeated = false;

    // Scooter: battery + hand capacity
    this.maxBolts = this.scooter.battery;
    this.currentBolts = this.maxBolts;
    this.maxHandCapacity = this.scooter.handCapacity;

    // Decks
    this.drawPile = shuffle(buildDrawPile(this.sea.letter));
    this.drawDiscard = [];
    this.treasureDeck = shuffle(buildTreasureDeck(this.sea.letter));
    this.treasureStockpile = [];
    this.treasureChest = [];
    this.destroyedTreasure = [];

    // Hand
    this.hand = buildStartingHand(this.scooter);
    this.removedCards = [];

    // Pending choices
    this.pendingPurchase = null; // { targetIndex, card }
    this.pendingDiscard = null;  // { remaining, source }

    // Quests
    this.quests = new QuestTracker(questsForSea(this.sea.letter));

    // Market
    this.market = [];
    this.lastRefilledIndices = [];
    this.initMarket();

    this.status = 'in_progress';
    this.statusMessage = '';
    this.log = [];

    this.addLog(`🌊 Adventure started in Sea ${this.sea.letter}: ${this.sea.name} on the ${this.scooter.name} ` +
      `(⚡ ${this.maxBolts}, hand ${this.maxHandCapacity}). ${this.monstersList.length} encounters ahead.`, 'system');

    // Scooter start-of-adventure abilities
    const reveal = this.scooter.abilities?.revealTreasuresAtStart || 0;
    for (let i = 0; i < reveal; i++) this.revealTreasureToStockpile();

    this.onFishEncountered();
  }

  get currentMonster() {
    return this.monstersList[this.currentMonsterIndex] || null;
  }

  get currentFish() {
    return this.currentMonster;
  }

  get treasureGems() {
    return this.treasureChest.reduce((sum, t) => sum + (t.gems || 0), 0);
  }

  get questGems() {
    return this.quests.earnedGems;
  }

  get totalGems() {
    return this.treasureGems + this.questGems;
  }

  get isBlocked() {
    return !!(this.pendingPurchase || this.pendingDiscard);
  }

  get isFinalAttack() {
    return this.status === 'in_progress' && this.currentMonster !== null && this.currentBolts === 0;
  }

  spendBolt() {
    this.currentBolts = Math.max(0, this.currentBolts - 1);
  }

  // --- Persistent gems -------------------------------------------------------

  static getPermanentGems() {
    try {
      if (typeof localStorage !== 'undefined') {
        const val = localStorage.getItem('maths_handbuilder_permanent_gems');
        return val ? parseInt(val, 10) || 0 : 0;
      }
    } catch (e) { /* storage unavailable */ }
    return 0;
  }

  static addPermanentGems(count) {
    try {
      if (typeof localStorage !== 'undefined' && count > 0) {
        const updated = GameState.getPermanentGems() + count;
        localStorage.setItem('maths_handbuilder_permanent_gems', updated.toString());
        return updated;
      }
    } catch (e) { /* storage unavailable */ }
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

  // --- Quests ----------------------------------------------------------------

  emitQuestEvent(event) {
    const done = this.quests.handle(event);
    for (const q of done) {
      GameState.addPermanentGems(q.gems || 0);
      const reward = q.gemsTbd ? '(gem reward TBD)' : `+${q.gems} 💎`;
      this.addLog(`📜 QUEST COMPLETE: "${q.text}" ${reward}`, 'treasure');
    }
  }

  // --- Decks -----------------------------------------------------------------

  drawCardFromDeck() {
    if (this.drawPile.length === 0) {
      if (this.drawDiscard.length === 0) return null;
      this.drawPile = shuffle(this.drawDiscard);
      this.drawDiscard = [];
      this.addLog('Draw pile was empty. Reshuffled discard pile into draw pile.', 'system');
    }
    return this.drawPile.pop();
  }

  drawTreasureCard() {
    return this.treasureDeck.length ? this.treasureDeck.pop() : null;
  }

  revealTreasureToStockpile() {
    const treasure = this.drawTreasureCard();
    if (treasure) {
      this.treasureStockpile.push(treasure);
      this.addLog(`💎 TREASURE REVEALED: ${treasure.name} ${treasure.label} (🎯 ${treasure.target}) added to the stockpile!`, 'treasure');
    }
    return treasure;
  }

  initMarket() {
    this.market = [];
    for (let i = 0; i < GAME_CONFIG.marketSize; i++) {
      this.market.push(this.drawCardFromDeck());
    }
  }

  refillEmptyMarketSlots() {
    let refilled = 0;
    this.lastRefilledIndices = [];
    for (let i = 0; i < GAME_CONFIG.marketSize; i++) {
      if (!this.market[i]) {
        const card = this.drawCardFromDeck();
        if (card) {
          this.market[i] = card;
          this.lastRefilledIndices.push(i);
          refilled++;
        }
      }
    }
    return refilled;
  }

  // --- Maths -----------------------------------------------------------------

  static calculateSequence(numberCards) {
    let runningTotal = 0;
    const steps = [];
    for (const card of numberCards) {
      const prev = runningTotal;
      let expr;
      if (card.op === '-') {
        runningTotal -= card.value;
        expr = `${prev} − ${card.value} = ${runningTotal}`;
      } else if (card.op === '×') {
        runningTotal *= card.value;
        expr = `${prev} × ${card.value} = ${runningTotal}`;
      } else {
        runningTotal += (card.value || 0);
        expr = `${prev} + ${card.value || 0} = ${runningTotal}`;
      }
      steps.push({ card, prev, result: runningTotal, expr });
    }
    return { total: runningTotal, steps };
  }

  // --- Fish encounter effects ------------------------------------------------

  /** Applies "when encountered" abilities of the current fish. */
  onFishEncountered() {
    const fish = this.currentMonster;
    if (!fish) return;
    const a = fish.abilities || {};

    if (a.destroyTreasureOnEncounter && this.treasureStockpile.length) {
      const lost = this.treasureStockpile.splice(0);
      this.destroyedTreasure.push(...lost);
      this.addLog(`🦑 ${fish.name} steals ALL unclaimed treasure! Lost: ${lost.map(t => t.name).join(', ')}.`, 'danger');
    }

    if (a.discardOnEncounter && !a.discardOnDefeat && !/when defeated/i.test(fish.abilityText || '')) {
      const count = Math.min(a.discardOnEncounter, this.hand.length);
      if (count > 0) {
        this.pendingDiscard = { remaining: count, source: fish.name };
        this.addLog(`🐙 ${fish.name}: choose ${count} number card${count > 1 ? 's' : ''} to permanently discard.`, 'warning');
      }
    }

    if (fish.targets.length > 1) {
      this.addLog(`🐉 ${fish.name} has ${fish.targets.length} targets (${fish.targets.join(' & ')}). Each needs a separate successful Attack.`, 'warning');
    }
  }

  /** Resolve one pending discard choice (fish ability). */
  discardFromHand(cardId) {
    if (!this.pendingDiscard) return { success: false, reason: 'No discard required.' };
    const idx = this.hand.findIndex(c => (c.uid || c.id) === cardId);
    if (idx === -1) return { success: false, reason: 'Card not found in hand.' };

    const [card] = this.hand.splice(idx, 1);
    this.removedCards.push(card);
    this.pendingDiscard.remaining--;
    this.addLog(`🗑️ Discarded ${card.label} (${this.pendingDiscard.source}).`, 'warning');
    if (this.pendingDiscard.remaining <= 0 || this.hand.length === 0) this.pendingDiscard = null;
    return { success: true, card };
  }

  // --- Actions ---------------------------------------------------------------

  /**
   * ACTION 1: Attack. Costs 1 bolt (free at 0 bolts = Final Attack).
   * Multi-target fish: matching any remaining target removes it; the fish is
   * defeated once every target has been hit.
   */
  playAttack(selectedNumberCards) {
    if (this.status !== 'in_progress') return { success: false, reason: 'Game has already ended.' };
    if (this.isBlocked) return { success: false, reason: 'Resolve the pending card choice first.' };

    const wasFinalAttack = this.isFinalAttack;
    const fish = this.currentMonster;
    const isFinalFish = (this.currentMonsterIndex === this.monstersList.length - 1);
    const { total, steps } = GameState.calculateSequence(selectedNumberCards);
    const hitIndex = fish.remainingTargets.indexOf(total);
    const targetMatched = hitIndex !== -1;
    const summary = steps.map(s => s.card.label).join(' → ') || '(0 cards)';
    const needed = fish.remainingTargets.join(' or ');

    if (!wasFinalAttack) this.spendBolt();

    if (!targetMatched) {
      if (wasFinalAttack) {
        this.status = 'lost';
        this.statusMessage = `Final Attack missed against ${fish.name}! Needed 🎯 ${needed}, got ${total}.`;
        this.addLog(`☠️ OUT OF POWER: Final Attack missed [${summary}] = ${total} (needed 🎯 ${needed}).`, 'danger');
      } else {
        this.addLog(`❌ ATTACK FAILED: [${summary}] = ${total}. Needed 🎯 ${needed}. (Battery: ${this.currentBolts}/${this.maxBolts} ⚡)`, 'warning');
        this.checkFinalAttackTrigger();
      }
      return { success: true, targetMatched: false, finalAttack: wasFinalAttack, total };
    }

    fish.remainingTargets.splice(hitIndex, 1);
    const defeated = fish.remainingTargets.length === 0;
    this.emitQuestEvent({ type: 'attack_hit', fish, cards: selectedNumberCards, defeated });

    if (!defeated) {
      fish.target = fish.remainingTargets[0];
      this.addLog(`⚔️ HIT! [${summary}] = ${total}. ${fish.name} still needs 🎯 ${fish.remainingTargets.join(' & ')}.`, 'success');
      this.checkFinalAttackTrigger();
      return { success: true, targetMatched: true, defeated: false, finalAttack: wasFinalAttack, total };
    }

    this.addLog(`⚔️ ${wasFinalAttack ? 'FINAL ATTACK SUCCESS' : 'ATTACK SUCCESS'}: [${summary}] = ${total}. Defeated ${fish.name}!`, 'success');
    const defeatInfo = this.handleFishDefeat(isFinalFish, fish);
    return {
      success: true,
      targetMatched: true,
      defeated: true,
      finalAttack: wasFinalAttack,
      total,
      defeatedFish: fish,
      ...defeatInfo
    };
  }

  /**
   * Post-defeat sequence: recharge (unless prevented), refill market, reveal
   * treasure, then advance (or start the Victory Lap after the final fish).
   */
  handleFishDefeat(isFinalFish, fish) {
    const recharged = !fish.abilities?.noRecharge;
    if (fish.abilities?.noRecharge) {
      this.addLog(`🪼 ${fish.name}: no battery recharge for this defeat! (${this.currentBolts}/${this.maxBolts} ⚡)`, 'warning');
    } else {
      this.currentBolts = this.maxBolts;
    }

    const slotsRefilled = this.refillEmptyMarketSlots();
    const refilledIndices = (this.lastRefilledIndices || []).slice();

    // Determine how many treasures to reveal on defeat
    // Standard: 1 treasure. Fish ability revealTreasuresOnDefeat can reveal more (e.g. Blackjack fish reveals 2)
    const treasureCount = fish.abilities?.revealTreasuresOnDefeat ?? 1;
    const revealedTreasures = [];
    for (let i = 0; i < treasureCount; i++) {
      const t = this.revealTreasureToStockpile();
      if (t) revealedTreasures.push(t);
    }
    const revealedTreasure = revealedTreasures[0] || null;

    if (treasureCount > 1 && revealedTreasures.length > 0) {
      this.addLog(`✨ ${fish.name} BONUS: Revealed ${revealedTreasures.length} treasures into the stockpile!`, 'treasure');
    }

    // Fish ability: discard cards when defeated
    const discardDefeatCount = fish.abilities?.discardOnDefeat
      || (fish.abilities?.discardOnEncounter && /when defeated/i.test(fish.abilityText || '') ? fish.abilities.discardOnEncounter : 0);
    if (discardDefeatCount > 0) {
      const count = Math.min(discardDefeatCount, this.hand.length);
      if (count > 0) {
        this.pendingDiscard = { remaining: count, source: fish.name };
        this.addLog(`🐙 ${fish.name} DEFEATED: Choose ${count} number card${count > 1 ? 's' : ''} from your hand to permanently discard.`, 'warning');
      }
    }

    if (isFinalFish) {
      this.sharkDefeated = true;
      this.status = 'post_game';
      this.statusMessage = `${fish.name} defeated! Victory Lap: spend remaining bolts claiming treasure.`;
      this.emitQuestEvent({ type: 'adventure_complete' });
      this.addLog(`🏆 ${fish.name.toUpperCase()} DEFEATED — Sea ${this.sea.letter} complete! Victory Lap with ${this.currentBolts}/${this.maxBolts} ⚡.`, 'victory');
      if (this.currentBolts === 0 || this.treasureStockpile.length === 0) this.finishVictoryLap();
      return { recharged, slotsRefilled, refilledIndices, revealedTreasure, revealedTreasures };
    }

    this.currentMonsterIndex++;
    const next = this.currentMonster;
    this.addLog(`⚡ Battery ${this.currentBolts}/${this.maxBolts}, refilled ${slotsRefilled} market slots. Next: ${next.name} (🎯 ${next.targets.join(' & ')})!`, 'success');
    this.onFishEncountered();
    this.checkFinalAttackTrigger();
    return { recharged, slotsRefilled, refilledIndices, revealedTreasure, revealedTreasures };
  }

  finishVictoryLap() {
    this.status = 'won';
    this.statusMessage = `Sea ${this.sea.letter} complete!`;
    this.addLog(`🏆 ADVENTURE COMPLETE: ${this.totalGems} 💎 earned this adventure.`, 'victory');
  }

  /**
   * ACTION 2: Buy a market card or claim a stockpile treasure. Costs 1 bolt.
   */
  playBuy(targetType, targetIndex, selectedNumberCards, replaceCardId = null) {
    if (this.status !== 'in_progress' && this.status !== 'post_game') return { success: false, reason: 'Game has already ended.' };
    if (this.isBlocked) return { success: false, reason: 'Resolve the pending card choice first.' };
    if (this.status === 'post_game' && targetType !== 'stockpile') return { success: false, reason: 'Market purchases are closed during the Victory Lap.' };
    if (this.isFinalAttack) return { success: false, reason: 'Out of battery! Only Final Attack is available.' };
    if (this.currentBolts <= 0) return { success: false, reason: 'Out of bolts.' };

    const targetCard = targetType === 'stockpile' ? this.treasureStockpile[targetIndex] : this.market[targetIndex];
    if (!targetCard) return { success: false, reason: 'Selected target slot is empty.' };

    const { total, steps } = GameState.calculateSequence(selectedNumberCards);
    const targetMatched = total === targetCard.target;
    const summary = steps.map(s => s.card.label).join(' → ') || '(0 cards)';

    this.spendBolt();

    if (!targetMatched) {
      const what = targetType === 'stockpile' ? 'Treasure' : 'Market card';
      this.addLog(`❌ BUY FAILED: [${summary}] = ${total}. Needed ${what} 🎯 ${targetCard.target}. (Battery: ${this.currentBolts}/${this.maxBolts} ⚡)`, 'warning');
      this.afterBuyAction();
      return { success: true, targetMatched: false, targetType, total };
    }

    if (targetType === 'stockpile') {
      this.treasureStockpile.splice(targetIndex, 1);
      this.treasureChest.push(targetCard);
      GameState.addPermanentGems(targetCard.gems);
      this.addLog(`💎 TREASURE CLAIMED: [${summary}] = ${total}. ${targetCard.name} +${targetCard.gems} 💎! (Battery: ${this.currentBolts}/${this.maxBolts} ⚡)`, 'treasure');
      this.emitQuestEvent({ type: 'treasure_claimed', treasure: targetCard, cards: selectedNumberCards });
      this.afterBuyAction();
      return { success: true, targetMatched: true, targetType: 'stockpile', acquiredCard: targetCard, total };
    }

    // Market purchase
    if (this.hand.length >= this.maxHandCapacity) {
      if (replaceCardId) {
        const idx = this.hand.findIndex(c => (c.uid || c.id) === replaceCardId);
        if (idx !== -1) {
          const [replaced] = this.hand.splice(idx, 1);
          this.removedCards.push(replaced);
          this.hand.push(targetCard);
          this.market[targetIndex] = null;
          this.addLog(`🛒 BUY SUCCESS: [${summary}] = ${total}. Replaced ${replaced.label} with ${targetCard.label}.`, 'success');
          this.emitQuestEvent({ type: 'market_bought', card: targetCard, cards: selectedNumberCards });
          this.checkFinalAttackTrigger();
          return { success: true, targetMatched: true, targetType: 'market', acquiredCard: targetCard, replacedCard: replaced, total };
        }
      }
      this.pendingPurchase = { targetIndex, card: targetCard, cards: selectedNumberCards };
      this.addLog(`🛒 BUY TARGET MATCHED: [${summary}] = ${total}. Hand full (${this.hand.length}/${this.maxHandCapacity}) — choose a card to permanently replace.`, 'info');
      return { success: true, targetMatched: true, targetType: 'market', needsReplacement: true, acquiredCard: targetCard, total };
    }

    this.market[targetIndex] = null;
    this.hand.push(targetCard);
    this.addLog(`🛒 BUY SUCCESS: [${summary}] = ${total}. Acquired ${targetCard.label} (${this.hand.length}/${this.maxHandCapacity}). (Battery: ${this.currentBolts}/${this.maxBolts} ⚡)`, 'success');
    this.emitQuestEvent({ type: 'market_bought', card: targetCard, cards: selectedNumberCards });
    this.checkFinalAttackTrigger();
    return { success: true, targetMatched: true, targetType: 'market', acquiredCard: targetCard, total };
  }

  afterBuyAction() {
    if (this.status === 'post_game') {
      if (this.currentBolts === 0 || this.treasureStockpile.length === 0) this.finishVictoryLap();
    } else {
      this.checkFinalAttackTrigger();
    }
  }

  replaceAndAcquire(replaceCardId) {
    if (!this.pendingPurchase) return { success: false, reason: 'No pending card purchase requiring replacement.' };

    const { targetIndex, card: targetCard, cards } = this.pendingPurchase;
    const idx = this.hand.findIndex(c => (c.uid || c.id) === replaceCardId);
    if (idx === -1) return { success: false, reason: 'Selected replacement card not found in hand.' };

    const [replaced] = this.hand.splice(idx, 1);
    this.removedCards.push(replaced);
    this.hand.push(targetCard);
    this.market[targetIndex] = null;
    this.pendingPurchase = null;

    this.addLog(`🔄 CARD REPLACED: Removed ${replaced.label}, added ${targetCard.label} (${this.hand.length}/${this.maxHandCapacity}).`, 'success');
    this.emitQuestEvent({ type: 'market_bought', card: targetCard, cards: cards || [] });
    this.checkFinalAttackTrigger();
    return { success: true, acquiredCard: targetCard, replacedCard: replaced, targetIndex };
  }

  /** ACTION 3: Refresh all market cards. Costs 1 bolt. */
  playMarketRefresh() {
    if (this.status !== 'in_progress') return { success: false, reason: 'Game has already ended.' };
    if (this.isBlocked) return { success: false, reason: 'Resolve the pending card choice first.' };
    if (this.isFinalAttack) return { success: false, reason: 'Out of battery! Only Final Attack is available.' };
    if (this.currentBolts <= 0) return { success: false, reason: 'Out of bolts.' };

    for (const card of this.market) if (card) this.drawDiscard.push(card);
    this.initMarket();
    this.spendBolt();

    this.addLog(`🔄 MARKET REFRESH: Replaced all market cards. (Battery: ${this.currentBolts}/${this.maxBolts} ⚡)`, 'info');
    this.checkFinalAttackTrigger();
    return { success: true };
  }

  playPickup() {
    return { success: false, reason: 'The Pickup action no longer exists. Number cards return to hand automatically.' };
  }

  endRun() {
    if (this.status === 'won' || this.status === 'lost') return { success: false, reason: 'Adventure already concluded.' };
    this.status = 'won';
    this.statusMessage = `Adventure concluded. Banked ${this.totalGems} gems!`;
    this.addLog(`⚓ ADVENTURE CONCLUDED: Banked ${this.totalGems} gems. Permanent stash: ${GameState.getPermanentGems()} 💎.`, 'victory');
    return { success: true, totalGems: this.totalGems };
  }

  checkFinalAttackTrigger() {
    if (this.isFinalAttack) {
      this.addLog(`🚨 FINAL ATTACK: Battery depleted! One free Attack to hit 🎯 ${this.currentMonster.remainingTargets.join(' or ')} or the journey ends.`, 'warning');
    }
  }

  // --- Debug -----------------------------------------------------------------

  debugSkipMonster() {
    const fish = this.currentMonster;
    if (fish && this.status === 'in_progress') {
      this.pendingDiscard = null;
      fish.remainingTargets = [];
      this.addLog(`[Debug] Skipped ${fish.name}.`, 'system');
      this.handleFishDefeat(this.currentMonsterIndex === this.monstersList.length - 1, fish);
    }
  }

  debugAdjustBolts(delta) {
    this.currentBolts = Math.max(0, Math.min(this.maxBolts, this.currentBolts + delta));
    this.addLog(`[Debug] Battery now ${this.currentBolts}/${this.maxBolts} ⚡`, 'system');
    this.checkFinalAttackTrigger();
  }

  debugAddCard(op, value) {
    const v = Number(value);
    const card = {
      uid: `debug_card_${Date.now()}_${Math.random()}`,
      type: 'number',
      op,
      value: v,
      label: `${op === '-' ? '−' : op}${v}`,
      target: Math.abs(v)
    };
    this.hand.push(card);
    this.addLog(`[Debug] Added ${card.label} to hand (${this.hand.length}/${this.maxHandCapacity}).`, 'system');
  }

  debugRevealTreasure() {
    if (!this.revealTreasureToStockpile()) this.addLog('[Debug] Treasure deck is empty.', 'system');
  }
}
