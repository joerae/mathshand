/**
 * Repeatable sea quests (v0.10).
 *
 * Each Sea has three quests, each completable once per adventure.
 * Quest rules are parsed from the spreadsheet text by the importer into
 * structured `rule` objects; quests with `rule: null` are displayed but not
 * auto-tracked.
 */
export class QuestTracker {
  constructor(quests = []) {
    this.quests = quests.map(q => ({ ...q, completed: false, progress: 0 }));
    this.fishDefeated = 0;
    this.marketBuys = 0;
  }

  get earnedGems() {
    return this.quests.filter(q => q.completed).reduce((s, q) => s + (q.gems || 0), 0);
  }

  /**
   * Feed a game event. Returns the list of quests newly completed by it.
   * Event shapes:
   *  { type: 'attack_hit', fish, cards, defeated }
   *  { type: 'market_bought', card, cards }
   *  { type: 'treasure_claimed', treasure, cards }
   *  { type: 'adventure_complete' }
   */
  handle(event) {
    if (event.type === 'attack_hit' && event.defeated) this.fishDefeated++;
    if (event.type === 'market_bought') this.marketBuys++;

    const newlyDone = [];
    for (const q of this.quests) {
      if (q.completed || !q.rule) continue;
      if (this.check(q, event)) {
        q.completed = true;
        newlyDone.push(q);
      }
    }
    return newlyDone;
  }

  check(q, event) {
    const r = q.rule;
    const cards = event.cards || [];
    const isSuccess = ['attack_hit', 'market_bought', 'treasure_claimed'].includes(event.type);

    switch (r.type) {
      case 'defeat_fish_count':
        return this.fishDefeated >= (r.count || 1);

      case 'buy_market':
        return this.marketBuys >= (r.count || 1);

      case 'complete_sea':
        return event.type === 'adventure_complete';

      case 'defeat_negative_fish':
        return event.type === 'attack_hit' && event.defeated && event.fish.targets.some(t => t < 0);

      case 'success_with_card': {
        if (!isSuccess) return false;
        if (r.action === 'attack' && event.type !== 'attack_hit') return false;
        if (r.negativeMultiplier) return cards.some(c => c.op === '×' && c.value < 0);
        return cards.some(c => (r.cards || []).includes(c.label));
      }

      case 'claim_treasure': {
        if (event.type !== 'treasure_claimed') return false;
        const t = event.treasure;
        if (r.negative && !(t.target < 0)) return false;
        if (r.gems !== undefined && t.gems !== r.gems) return false;
        if (r.usingOp && !cards.some(c => c.op === r.usingOp)) return false;
        q.progress++;
        return q.progress >= (r.count || 1);
      }

      default:
        return false;
    }
  }
}
