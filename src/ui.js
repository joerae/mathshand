/**
 * UI Renderer and Event Controller for Maths Handbuilder Prototype (v0.10 – Seven Seas)
 */
import { GameState } from './game.js';
import { FISH_ART } from './fish_art.js';
import {
  GAME_DATA, SEA_ORDER, getSea, scootersForSea, defaultScooterForSea,
  buildDrawPile, buildTreasureDeck, isUnlocked
} from '../data/content.js';

const SELECTION_KEY = 'maths_handbuilder_last_selection';

/** Maps spreadsheet fish names to the existing SVG artwork. */
function fishArtFor(fish) {
  const n = (fish?.name || '').toLowerCase();
  if (n.includes('clownfish')) return FISH_ART[1];
  if (n.includes('electric eel')) return FISH_ART[2];
  if (n.includes('puffer')) return FISH_ART[3];
  if (n.includes('kraken')) return FISH_ART[4];
  if (n.includes('great white')) return FISH_ART[5];
  // Generic placeholder fish, tinted per fish
  let hash = 0;
  for (const ch of fish?.id || '') hash = (hash * 31 + ch.charCodeAt(0)) % 360;
  return `
    <svg viewBox="0 0 160 120" class="fish-svg" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="72" cy="60" rx="46" ry="28" fill="hsl(${hash},70%,60%)" stroke="hsl(${hash},60%,35%)" stroke-width="2.5"/>
      <path d="M28 60 L8 40 L14 60 L8 80 Z" fill="hsl(${hash},70%,55%)" stroke="hsl(${hash},60%,35%)" stroke-width="2.5"/>
      <circle cx="100" cy="52" r="7" fill="#fff" stroke="#1f2937" stroke-width="1.5"/>
      <circle cx="102" cy="52" r="3" fill="#1f2937"/>
      <path d="M108 70 Q114 72 118 68" stroke="#1f2937" stroke-width="2" fill="none"/>
      <text x="72" y="112" text-anchor="middle" font-size="11" fill="#64748b">${fish?.name || ''}</text>
    </svg>`;
}

function opClass(card) {
  if (card.op === '×') return 'op-mult';
  if (card.op === '-') return 'op-sub';
  return 'op-add';
}

export class GameUI {
  constructor() {
    this.selection = this.loadSelection();
    this.game = new GameState({ sea: this.selection.sea, scooterId: this.selection.scooterId });
    this.selectedSequence = []; // Array of number cards selected from hand onto workbench
    this.showCalculator = false; // Default: OFF (physical card simulation with mental math)
    this.lastActionFeedback = null; // { type: 'success' | 'miss' | 'info', text: string } | null

    this.cacheElements();
    this.bindEvents();
    this.render();
    this.openSeaSelect();
  }

  loadSelection() {
    try {
      const saved = JSON.parse(localStorage.getItem(SELECTION_KEY) || 'null');
      if (saved && getSea(saved.sea)) {
        const scooters = scootersForSea(saved.sea);
        if (!scooters.some(s => s.id === saved.scooterId)) saved.scooterId = defaultScooterForSea(saved.sea)?.id;
        return saved;
      }
    } catch (e) { /* ignore */ }
    return { sea: SEA_ORDER[0], scooterId: defaultScooterForSea(SEA_ORDER[0])?.id };
  }

  saveSelection() {
    try { localStorage.setItem(SELECTION_KEY, JSON.stringify(this.selection)); } catch (e) { /* ignore */ }
  }

  cacheElements() {
    // Fish Encounter Elements
    this.fishCardEl = document.getElementById('fish-card-landscape');
    this.fishAttackHintEl = document.getElementById('fish-attack-hint');
    this.monsterNameEl = document.getElementById('monster-name');
    this.monsterTargetEl = document.getElementById('monster-target');
    this.batteryCountTextEl = document.getElementById('battery-count-text');
    this.batteryCardsRowEl = document.getElementById('battery-cards-row');
    this.creatureArtEl = document.getElementById('creature-art');

    // Market & Stockpile Elements (RHS)
    this.marketSlotsEl = document.getElementById('market-slots');
    this.stockpileSlotsEl = document.getElementById('stockpile-slots');

    // Formula & Running Calculation Elements
    this.formulaChainEl = document.getElementById('formula-chain');
    this.formulaResultContainer = document.getElementById('formula-result-container');
    this.runningTotalEl = document.getElementById('running-total');
    this.formulaComparisonEl = document.getElementById('formula-comparison');
    this.clearSequenceBtn = document.getElementById('btn-clear-seq');
    this.chkAutoCalc = document.getElementById('chk-auto-calc');
    this.debugChkAutoCalc = document.getElementById('debug-chk-auto-calc');

    // Hand Elements (LHS)
    this.handNumberCardsEl = document.getElementById('hand-number-cards');
    this.handReplacementAlert = document.getElementById('hand-replacement-alert');
    this.replacementTitle = document.getElementById('replacement-title');
    this.replacementPromptText = document.getElementById('replacement-prompt-text');
    this.btnCancelReplacement = document.getElementById('btn-cancel-replacement');
    this.handDiscardAlert = document.getElementById('hand-discard-alert');
    this.discardTitle = document.getElementById('discard-title');
    this.discardPromptText = document.getElementById('discard-prompt-text');

    // Fish extras
    this.fishAbilityEl = document.getElementById('fish-ability');
    this.upcomingFishEl = document.getElementById('upcoming-fish');
    this.batteryHelpEl = document.getElementById('battery-help');

    // Quests
    this.questListEl = document.getElementById('quest-list');
    this.questGemsEl = document.getElementById('quest-gems');
    this.questPanelTitleEl = document.getElementById('quest-panel-title');

    // Sea selection
    this.btnCurrentSea = document.getElementById('btn-current-sea');
    this.btnNewAdventure = document.getElementById('btn-new-adventure');
    this.seaOverlay = document.getElementById('sea-select-overlay');
    this.seaOptionsEl = document.getElementById('sea-options');
    this.scooterOptionsEl = document.getElementById('scooter-options');
    this.seaPreviewEl = document.getElementById('sea-preview');
    this.btnStartAdventure = document.getElementById('btn-start-adventure');
    this.btnCloseSeaSelect = document.getElementById('btn-close-sea-select');
    this.dataSourceLabel = document.getElementById('data-source-label');
    this.statBatteryMax = document.getElementById('stat-battery-max');
    this.statHandMax = document.getElementById('stat-hand-max');

    // Market Refresh Button
    this.btnRefresh = document.getElementById('btn-action-refresh');

    // Top Bar & End Run Buttons
    this.btnEndRun = document.getElementById('btn-end-run');
    this.btnRestart = document.getElementById('btn-restart');

    // Info & Pile stats
    this.statBatteryCount = document.getElementById('stat-battery-count');
    this.statDrawCount = document.getElementById('stat-draw-count');
    this.statDiscardCount = document.getElementById('stat-discard-count');
    this.statHandCount = document.getElementById('stat-hand-count');
    this.statGemCount = document.getElementById('stat-gem-count');
    this.statStashCount = document.getElementById('stat-stash-count');

    // Treasure Chest (LHS bottom)
    this.treasureGemsRunEl = document.getElementById('treasure-gems-run');
    this.treasureGemsStashEl = document.getElementById('treasure-gems-stash');
    this.treasureCollectedListEl = document.getElementById('treasure-collected-list');

    // Log & Status
    this.gameLogEl = document.getElementById('game-log');
    this.gameBannerEl = document.getElementById('game-status-banner');
    this.finalAttackBannerEl = document.getElementById('final-attack-banner');
    this.faTargetNumEl = document.getElementById('fa-target-num');

    // Debug Controls
    this.debugSkipBtn = document.getElementById('debug-skip-monster');
    this.debugAddBoltBtn = document.getElementById('debug-add-bolt');
    this.debugSubBoltBtn = document.getElementById('debug-sub-bolt');
    this.debugRevealTreasureBtn = document.getElementById('debug-reveal-treasure');
    this.debugAddCardBtn = document.getElementById('debug-add-card-btn');
    this.debugOpInput = document.getElementById('debug-card-op');
    this.debugValInput = document.getElementById('debug-card-val');
  }

  bindEvents() {
    // Direct tap on Fish card to Attack
    if (this.fishCardEl) {
      this.fishCardEl.addEventListener('click', () => this.handleAttack());
    }

    // Market Refresh & Clear Workbench
    if (this.btnRefresh) {
      this.btnRefresh.addEventListener('click', () => this.handleMarketRefresh());
    }
    this.clearSequenceBtn.addEventListener('click', () => {
      this.lastActionFeedback = null;
      this.clearSelection();
    });

    // Card Replacement Cancel Button
    if (this.btnCancelReplacement) {
      this.btnCancelReplacement.addEventListener('click', () => {
        if (this.game.pendingPurchase) {
          this.game.addLog(`Aborted card replacement.`, 'info');
          this.game.pendingPurchase = null;
          this.lastActionFeedback = null;
          this.render();
        }
      });
    }

    // Auto-Calculator Debug Toggle (in Workbench header and debug panel)
    const setCalculatorToggle = (enabled) => {
      this.showCalculator = enabled;
      if (this.chkAutoCalc) this.chkAutoCalc.checked = enabled;
      if (this.debugChkAutoCalc) this.debugChkAutoCalc.checked = enabled;
      this.render();
    };

    if (this.chkAutoCalc) {
      this.chkAutoCalc.checked = this.showCalculator;
      this.chkAutoCalc.addEventListener('change', (e) => setCalculatorToggle(e.target.checked));
    }
    if (this.debugChkAutoCalc) {
      this.debugChkAutoCalc.checked = this.showCalculator;
      this.debugChkAutoCalc.addEventListener('change', (e) => setCalculatorToggle(e.target.checked));
    }

    // End Run Button
    if (this.btnEndRun) {
      this.btnEndRun.addEventListener('click', () => {
        this.game.endRun();
        this.lastActionFeedback = null;
        this.render();
      });
    }

    // Restart Button (same sea + scooter)
    this.btnRestart.addEventListener('click', () => {
      this.game.reset();
      this.lastActionFeedback = null;
      this.clearSelection();
    });

    // Sea selection
    this.btnNewAdventure?.addEventListener('click', () => this.openSeaSelect());
    this.btnCurrentSea?.addEventListener('click', () => this.openSeaSelect());
    this.btnCloseSeaSelect?.addEventListener('click', () => this.closeSeaSelect());
    this.btnStartAdventure?.addEventListener('click', () => this.startAdventure());
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !this.seaOverlay.classList.contains('hidden')) this.closeSeaSelect();
    });

    // Debug Controls
    this.debugSkipBtn.addEventListener('click', () => {
      this.game.debugSkipMonster();
      this.lastActionFeedback = null;
      this.render();
    });
    if (this.debugAddBoltBtn) {
      this.debugAddBoltBtn.addEventListener('click', () => {
        this.game.debugAdjustBolts(1);
        this.render();
      });
    }
    if (this.debugSubBoltBtn) {
      this.debugSubBoltBtn.addEventListener('click', () => {
        this.game.debugAdjustBolts(-1);
        this.render();
      });
    }
    if (this.debugRevealTreasureBtn) {
      this.debugRevealTreasureBtn.addEventListener('click', () => {
        this.game.debugRevealTreasure();
        this.render();
      });
    }
    this.debugAddCardBtn.addEventListener('click', () => {
      const op = this.debugOpInput.value;
      const val = parseInt(this.debugValInput.value, 10) || 1;
      this.game.debugAddCard(op, val);
      this.render();
    });
  }

  clearSelection() {
    this.selectedSequence = [];
    this.render();
  }

  toggleNumberCardSelection(card) {
    if (this.game.status !== 'in_progress' && this.game.status !== 'post_game') return;

    const cardId = card.uid || card.id;

    // Fish ability: choose cards to discard
    if (this.game.pendingDiscard) {
      this.game.discardFromHand(cardId);
      this.selectedSequence = this.selectedSequence.filter(c => (c.uid || c.id) !== cardId);
      this.render();
      return;
    }

    // If a card purchase is pending replacement at capacity, clicking replaces it!
    if (this.game.pendingPurchase) {
      const targetLabel = this.game.pendingPurchase.card.label;
      const repRes = this.game.replaceAndAcquire(cardId);
      if (repRes.success) {
        this.lastActionFeedback = {
          type: 'success',
          text: `🔄 Replaced ${repRes.replacedCard.label} with ${targetLabel}!`
        };
        this.clearSelection();
      }
      this.render();
      return;
    }

    this.lastActionFeedback = null;
    const existingIndex = this.selectedSequence.findIndex(c => (c.uid || c.id) === cardId);

    if (existingIndex >= 0) {
      this.selectedSequence.splice(existingIndex, 1);
    } else {
      this.selectedSequence.push(card);
    }

    this.render();
  }

  /**
   * Tap on the Fish card to attack it with the current workbench total.
   * If the total matches, hits/defeats the fish. If not, loses 1 energy (or ends run on Final Attack).
   */
  handleAttack() {
    if (this.game.status !== 'in_progress') return;
    if (this.game.isBlocked) return;

    const fish = this.game.currentMonster;
    const fishName = fish?.name || 'Sea Creature';
    const needed = fish ? fish.remainingTargets.join(' or ') : '';
    const res = this.game.playAttack(this.selectedSequence);

    if (res.success) {
      this.selectedSequence = [];
      if (res.targetMatched) {
        this.lastActionFeedback = {
          type: 'success',
          text: res.defeated
            ? `⚔️ Direct hit (${res.total})! Defeated ${fishName}!`
            : `⚔️ Hit ${fishName} with ${res.total}! Remaining target: 🎯 ${fish.remainingTargets.join(' & ')}`
        };
      } else {
        this.lastActionFeedback = {
          type: 'miss',
          text: res.finalAttack
            ? `☠️ Final Attack missed! Total was ${res.total} (needed 🎯 ${needed}).`
            : `❌ Attack missed! Total was ${res.total} (needed 🎯 ${needed}) — lost 1 ⚡`
        };
      }
    }
    this.render();
  }

  /**
   * Tap directly on a Market card or Stockpile treasure card to buy/claim it.
   * If the workbench total matches, acquires the card. If not, loses 1 energy.
   */
  handleBuy(type, index) {
    if (this.game.status !== 'in_progress' && this.game.status !== 'post_game') return;
    if (this.game.isBlocked) return;

    if (this.game.isFinalAttack && this.game.status === 'in_progress') {
      this.lastActionFeedback = {
        type: 'miss',
        text: '⚡ Out of battery! Only Final Attack is available — tap the sea creature!'
      };
      this.render();
      return;
    }

    if (this.game.status === 'post_game' && type !== 'stockpile') {
      this.lastActionFeedback = {
        type: 'info',
        text: '🏆 Market is closed during the Victory Lap. Tap a stockpile treasure to claim it!'
      };
      this.render();
      return;
    }

    const targetCard = type === 'stockpile'
      ? this.game.treasureStockpile[index]
      : this.game.market[index];
    if (!targetCard) return;

    const res = this.game.playBuy(type, index, this.selectedSequence);
    if (res.success) {
      this.selectedSequence = [];
      if (res.targetMatched) {
        if (type === 'stockpile') {
          this.lastActionFeedback = {
            type: 'success',
            text: `💎 Claimed ${targetCard.name} (+${targetCard.gems} 💎) with ${res.total}!`
          };
        } else if (res.needsReplacement) {
          this.lastActionFeedback = {
            type: 'info',
            text: `🛒 Matched ${targetCard.label} (🎯 ${targetCard.target})! Hand full — tap a card in your hand to replace.`
          };
        } else {
          this.lastActionFeedback = {
            type: 'success',
            text: `🛒 Bought ${targetCard.label} (🎯 ${targetCard.target}) with ${res.total}!`
          };
        }
      } else {
        const itemLabel = type === 'stockpile' ? targetCard.name : `Market card ${targetCard.label}`;
        this.lastActionFeedback = {
          type: 'miss',
          text: `❌ Buy failed! Total was ${res.total} (needed 🎯 ${targetCard.target} for ${itemLabel}) — lost 1 ⚡`
        };
      }
    }
    this.render();
  }

  handleMarketRefresh() {
    if (this.game.status !== 'in_progress') return;
    if (this.game.isBlocked) return;

    if (this.game.isFinalAttack) {
      this.lastActionFeedback = {
        type: 'miss',
        text: '⚡ Out of battery! Only Final Attack is available — tap the sea creature!'
      };
      this.render();
      return;
    }

    const res = this.game.playMarketRefresh();
    if (res.success) {
      this.lastActionFeedback = {
        type: 'info',
        text: '🔄 Refreshed all 5 market cards (-1 ⚡).'
      };
    }
    this.render();
  }

  render() {
    const g = this.game;
    const fish = g.currentMonster;
    const calc = GameState.calculateSequence(this.selectedSequence);
    const isFinalAttack = g.isFinalAttack;
    const isPostGame = (g.status === 'post_game');
    const isReplacing = !!g.pendingPurchase;
    const isDiscarding = !!g.pendingDiscard;
    const isBlocked = isReplacing || isDiscarding;

    const matchesFish = !!(fish && fish.remainingTargets.includes(calc.total) && !isPostGame);
    const showMatchMonster = this.showCalculator && matchesFish && this.selectedSequence.length > 0;

    // 1. Current Sea Creature Info, Artwork & Scooter Battery Cards
    if (fish) {
      const isDefeated = g.sharkDefeated || isPostGame;
      this.monsterNameEl.textContent = isDefeated
        ? `${fish.name} (Defeated! 🏆)`
        : `Encounter ${g.currentMonsterIndex + 1}/${g.monstersList.length}: ${fish.name}`;
      if (fish.targets.length > 1) {
        this.monsterTargetEl.innerHTML = fish.targets
          .map(t => fish.remainingTargets.includes(t) ? `${t}` : `<s style="opacity:.45">${t}</s>`)
          .join(' & ');
      } else {
        this.monsterTargetEl.textContent = fish.targets[0];
      }
      if (this.fishAbilityEl) {
        this.fishAbilityEl.textContent = fish.abilityText ? `✨ ${fish.abilityText}` : '';
      }
      if (this.batteryCountTextEl) {
        this.batteryCountTextEl.textContent = `${g.currentBolts} / ${g.maxBolts} Bolts`;
      }
      if (this.statBatteryCount) {
        this.statBatteryCount.textContent = g.currentBolts;
      }

      // Interactive state on Fish Card
      if (this.fishCardEl) {
        const canAttack = g.status === 'in_progress' && !isBlocked;
        this.fishCardEl.classList.toggle('attackable', canAttack);
        this.fishCardEl.classList.toggle('final-attack-mode', canAttack && isFinalAttack);
        this.fishCardEl.classList.toggle('matched', canAttack && showMatchMonster);
      }

      if (this.fishAttackHintEl) {
        if (isDefeated || g.status === 'won') {
          this.fishAttackHintEl.textContent = '🏆 Defeated';
          this.fishAttackHintEl.className = 'fish-attack-pill defeated';
        } else if (g.status === 'lost') {
          this.fishAttackHintEl.textContent = '☠️ Journey Ended';
          this.fishAttackHintEl.className = 'fish-attack-pill defeated';
        } else if (isBlocked) {
          this.fishAttackHintEl.textContent = '⏳ Resolve Hand First';
          this.fishAttackHintEl.className = 'fish-attack-pill blocked';
        } else if (isFinalAttack) {
          this.fishAttackHintEl.textContent = showMatchMonster
            ? '✨ MATCH! Tap for Final Attack!'
            : '⚡ Tap for FINAL ATTACK!';
          this.fishAttackHintEl.className = 'fish-attack-pill final-attack';
        } else if (showMatchMonster) {
          this.fishAttackHintEl.textContent = '✨ MATCH! Tap to Attack (⚡ 1)';
          this.fishAttackHintEl.className = 'fish-attack-pill matched';
        } else {
          this.fishAttackHintEl.textContent = '⚔️ Tap to Attack (⚡ 1)';
          this.fishAttackHintEl.className = 'fish-attack-pill';
        }
      }

      // Render vector graphic
      if (this.creatureArtEl) {
        this.creatureArtEl.innerHTML = fishArtFor(fish);
      }

      // Upcoming encounters: face-down (targets hidden per v0.10 rules)
      if (this.upcomingFishEl) {
        this.upcomingFishEl.innerHTML = g.monstersList.map((f, i) => {
          const cls = i < g.currentMonsterIndex || (i === g.currentMonsterIndex && isDefeated)
            ? 'done' : (i === g.currentMonsterIndex ? 'current' : 'hidden-fish');
          const label = i < g.currentMonsterIndex || i === g.currentMonsterIndex ? f.name : 'Face-down fish';
          return `<span class="encounter-pip ${cls}" title="${label}">${i + 1}</span>`;
        }).join('');
      }

      // Render double-sided battery cards (count set by scooter)
      if (this.batteryCardsRowEl) {
        let batteryCardsHtml = '';
        for (let i = 0; i < g.maxBolts; i++) {
          const isCharged = (i < g.currentBolts);
          batteryCardsHtml += `
            <div class="battery-card ${isCharged ? 'charged' : 'depleted'}" title="Battery Card ${i + 1}: ${isCharged ? 'Charged (Yellow ⚡)' : 'Depleted (Grey ⚡)'}">
              <div class="bolt-corner">⚡</div>
              <div class="bolt-center">⚡</div>
              <div class="bolt-badge">${isCharged ? '⚡ CHARGED' : 'SPENT'}</div>
            </div>
          `;
        }
        this.batteryCardsRowEl.innerHTML = batteryCardsHtml;
      }
    } else {
      this.monsterNameEl.textContent = 'All Sea Creatures Defeated!';
      this.monsterTargetEl.textContent = '-';
      if (this.fishAbilityEl) this.fishAbilityEl.textContent = '';
      if (this.batteryCountTextEl) this.batteryCountTextEl.textContent = '-';
      if (this.batteryCardsRowEl) this.batteryCardsRowEl.innerHTML = '';
      if (this.creatureArtEl) this.creatureArtEl.innerHTML = '';
    }

    // 2. Market Slots (5 Number cards) — Tap directly to buy!
    this.marketSlotsEl.innerHTML = '';
    g.market.forEach((card, idx) => {
      const slotEl = document.createElement('div');

      if (!card) {
        slotEl.className = 'portrait-card market-card empty';
        slotEl.innerHTML = `
          <div class="empty-card-inner">
            <span class="empty-slot-icon">🂠</span>
            <span class="empty-label">Empty Slot</span>
            <span class="empty-sub">Refills on fish defeat</span>
          </div>
        `;
      } else {
        slotEl.className = `portrait-card market-card ${opClass(card)}`;
        if (isPostGame || isFinalAttack) {
          slotEl.classList.add('market-card-closed');
          slotEl.style.opacity = '0.45';
          slotEl.style.cursor = 'not-allowed';
        }

        const isMatched = this.showCalculator && (this.selectedSequence.length > 0 && calc.total === card.target);
        if (isMatched && !isFinalAttack && !isPostGame) slotEl.classList.add('matched');

        let matchBadge = '';
        if (isMatched && !isFinalAttack && !isPostGame) {
          matchBadge = `<div class="card-match-indicator">✨ MATCH! (Tap to Buy)</div>`;
        }

        slotEl.title = isPostGame
          ? 'Market is closed during Victory Lap'
          : (isFinalAttack ? 'Unavailable during Final Attack (0 bolts)' : `Tap to buy ${card.label} (Target 🎯 ${card.target}, costs 1 ⚡)`);

        slotEl.innerHTML = `
          <div class="card-corner-top">${card.label}</div>
          <div class="card-center-val">${card.label}</div>
          <div class="card-target-bottom">🎯 ${card.target}</div>
          ${matchBadge}
        `;
        slotEl.addEventListener('click', () => this.handleBuy('market', idx));
      }
      this.marketSlotsEl.appendChild(slotEl);
    });

    // Market Refresh Button state
    if (this.btnRefresh) {
      if (isPostGame) {
        this.btnRefresh.disabled = true;
        this.btnRefresh.textContent = '🔄 Market Closed';
      } else if (isFinalAttack) {
        this.btnRefresh.disabled = true;
        this.btnRefresh.textContent = '🔄 Refresh (0 ⚡)';
      } else {
        this.btnRefresh.disabled = g.status !== 'in_progress' || isBlocked || g.currentBolts <= 0;
        this.btnRefresh.textContent = '🔄 Refresh Market (⚡ 1)';
      }
    }

    // 3. Treasure Stockpile Slots — Tap directly to claim!
    if (this.stockpileSlotsEl) {
      this.stockpileSlotsEl.innerHTML = '';
      if (g.treasureStockpile.length === 0) {
        this.stockpileSlotsEl.innerHTML = '<span class="empty-stockpile-hint">Stockpile is empty. Defeat sea creatures to reveal treasure cards here!</span>';
      } else {
        g.treasureStockpile.forEach((card, idx) => {
          const slotEl = document.createElement('div');
          slotEl.className = 'portrait-card stockpile-card treasure-card';
          if (isFinalAttack && !isPostGame) {
            slotEl.style.opacity = '0.45';
            slotEl.style.cursor = 'not-allowed';
          }

          const isMatched = this.showCalculator && (this.selectedSequence.length > 0 && calc.total === card.target);
          if (isMatched && !isFinalAttack) slotEl.classList.add('matched');

          let matchBadge = '';
          if (isMatched && !isFinalAttack) {
            matchBadge = `<div class="card-match-indicator">✨ MATCH! (Tap to Claim)</div>`;
          }

          slotEl.title = `${card.name} — Tap to claim (Target 🎯 ${card.target}, costs 1 ⚡)`;
          slotEl.innerHTML = `
            <div class="card-corner-top">💎 ${card.gems}</div>
            <div class="card-center-gems">${card.label}</div>
            <div class="treasure-name">${card.name}</div>
            <div class="card-target-bottom">🎯 ${card.target}</div>
            ${matchBadge}
          `;
          slotEl.addEventListener('click', () => this.handleBuy('stockpile', idx));
          this.stockpileSlotsEl.appendChild(slotEl);
        });
      }
    }

    // 4. Calculation Workbench
    this.formulaChainEl.innerHTML = '';

    const startCardEl = document.createElement('div');
    startCardEl.className = 'workbench-start-card';
    startCardEl.innerHTML = `
      <span class="start-tag">Start</span>
      <span class="start-val">0</span>
      <span class="start-sub">Base</span>
    `;
    this.formulaChainEl.appendChild(startCardEl);

    if (this.selectedSequence.length === 0) {
      const emptyHintEl = document.createElement('div');
      emptyHintEl.className = 'workbench-empty-slot';
      emptyHintEl.innerHTML = '<span class="empty-slot-icon">🂠</span><span>Tap number cards in your hand to chain them, then tap a Market card, Treasure, or Fish!</span>';
      this.formulaChainEl.appendChild(emptyHintEl);
    } else {
      calc.steps.forEach((step, idx) => {
        const arrowEl = document.createElement('span');
        arrowEl.className = 'workbench-arrow';
        arrowEl.textContent = '→';
        this.formulaChainEl.appendChild(arrowEl);

        const card = step.card;
        const cardEl = document.createElement('div');
        cardEl.className = `portrait-card workbench-card ${opClass(card)}`;
        cardEl.title = 'Click to return this card to your hand';
        const stepBadge = this.showCalculator ? `<div class="card-calc-step">= ${step.result}</div>` : '';
        cardEl.innerHTML = `
          <div class="card-badge">#${idx + 1}</div>
          <div class="card-corner-top">${card.label}</div>
          <div class="card-center-val">${card.label}</div>
          <div class="card-target-bottom">🎯 ${card.target}</div>
          ${stepBadge}
        `;
        cardEl.addEventListener('click', () => {
          this.lastActionFeedback = null;
          this.selectedSequence.splice(idx, 1);
          this.render();
        });
        this.formulaChainEl.appendChild(cardEl);
      });
    }

    // Evaluated Total Display
    if (this.formulaResultContainer) {
      if (this.showCalculator) {
        this.formulaResultContainer.classList.remove('hidden-calc');
        this.runningTotalEl.textContent = calc.total;
      } else {
        this.formulaResultContainer.classList.add('hidden-calc');
        this.runningTotalEl.textContent = '?';
      }
    }

    // Target comparison & last action feedback
    let comparisonText = '';
    if (this.lastActionFeedback) {
      const fbClass = this.lastActionFeedback.type === 'success'
        ? 'badge-match monster'
        : (this.lastActionFeedback.type === 'miss' ? 'badge-feedback-miss' : 'badge-match market');
      comparisonText += `<span class="${fbClass}">${this.lastActionFeedback.text}</span> `;
    } else if (this.showCalculator && this.selectedSequence.length > 0) {
      if (fish && fish.remainingTargets.includes(calc.total) && !isPostGame) {
        const alertLabel = isFinalAttack
          ? '🚨 MATCHES FINAL ATTACK TARGET! Tap the fish to recharge!'
          : `🎯 Matches ${fish.name} Target! Tap the fish to Attack!`;
        comparisonText += `<span class="badge-match monster">${alertLabel}</span> `;
      }

      const matchingMarket = !isPostGame && !isFinalAttack
        ? g.market.filter(c => c && c.target === calc.total)
        : [];
      const matchingStockpile = !isFinalAttack
        ? g.treasureStockpile.filter(c => c && c.target === calc.total)
        : [];

      if (matchingMarket.length > 0) {
        comparisonText += `<span class="badge-match market">🛒 Matches Market (${matchingMarket.map(c => c.label).join(', ')}) — Tap card to Buy!</span> `;
      }
      if (matchingStockpile.length > 0) {
        comparisonText += `<span class="badge-match market">💎 Matches Treasure (${matchingStockpile.map(c => c.name).join(', ')}) — Tap card to Claim!</span> `;
      }
      if (!comparisonText) {
        comparisonText = `<span class="badge-mismatch">Current Total: ${calc.total}</span>`;
      }
    }
    this.formulaComparisonEl.innerHTML = comparisonText;

    // 5. Hand Display: Number cards are reusable!
    this.handNumberCardsEl.innerHTML = '';

    if (this.handReplacementAlert) {
      if (isReplacing) {
        this.handReplacementAlert.classList.remove('hidden');
        if (this.replacementTitle) {
          this.replacementTitle.textContent = `🔄 SCOOTER AT CAPACITY (${g.hand.length}/${g.maxHandCapacity})!`;
        }
        if (this.replacementPromptText) {
          this.replacementPromptText.textContent = `Click any card below to permanently replace it with ${g.pendingPurchase.card.label} (🎯 ${g.pendingPurchase.card.target}).`;
        }
      } else {
        this.handReplacementAlert.classList.add('hidden');
      }
    }

    if (this.handDiscardAlert) {
      this.handDiscardAlert.classList.toggle('hidden', !isDiscarding);
      if (isDiscarding) {
        const n = g.pendingDiscard.remaining;
        this.discardTitle.textContent = `🐙 ${g.pendingDiscard.source.toUpperCase()} ATTACKS!`;
        this.discardPromptText.textContent = `Click ${n} card${n > 1 ? 's' : ''} below to permanently discard ${n > 1 ? 'them' : 'it'}.`;
      }
    }

    const selectedIds = new Set(this.selectedSequence.map(c => c.uid || c.id));
    const cardsInHand = isBlocked
      ? g.hand // When replacing/discarding, show all cards in hand
      : g.hand.filter(c => !selectedIds.has(c.uid || c.id));

    if (cardsInHand.length === 0) {
      this.handNumberCardsEl.innerHTML = '<div class="empty-hand-hint">All cards from your hand are on the Calculation Workbench. Click any card on the workbench to return it to your hand.</div>';
    } else {
      cardsInHand.forEach(c => {
        const cardEl = document.createElement('div');
        cardEl.className = `portrait-card game-card number-card ${opClass(c)}`;
        if (isDiscarding) {
          cardEl.classList.add('selectable-for-replacement');
          cardEl.title = `Click to PERMANENTLY DISCARD ${c.label}`;
        } else if (isReplacing) {
          cardEl.classList.add('selectable-for-replacement');
          cardEl.title = `Click to PERMANENTLY REMOVE ${c.label} and add ${g.pendingPurchase.card.label}`;
        } else {
          cardEl.title = 'Click to place this card onto the Calculation Workbench';
        }

        const replaceTag = isBlocked ? `<div class="card-match-indicator" style="background:#d97706;">${isDiscarding ? 'DISCARD' : 'SCRAP'}</div>` : '';

        cardEl.innerHTML = `
          <div class="card-corner-top">${c.label}</div>
          <div class="card-center-val">${c.label}</div>
          <div class="card-target-bottom">🎯 ${c.target}</div>
          ${replaceTag}
        `;
        cardEl.addEventListener('click', () => this.toggleNumberCardSelection(c));
        this.handNumberCardsEl.appendChild(cardEl);
      });
    }

    // 6. Stats Bar
    this.statDrawCount.textContent = g.drawPile.length;
    this.statDiscardCount.textContent = g.drawDiscard.length;
    this.statHandCount.textContent = g.hand.length;
    if (this.statHandMax) this.statHandMax.textContent = g.maxHandCapacity;
    if (this.statBatteryMax) this.statBatteryMax.textContent = g.maxBolts;
    if (this.statGemCount) this.statGemCount.textContent = g.totalGems;
    if (this.statStashCount) this.statStashCount.textContent = GameState.getPermanentGems();
    if (this.btnCurrentSea) {
      this.btnCurrentSea.textContent = `🌊 Sea ${g.sea.letter}: ${g.sea.name} • 🛵 ${g.scooter.name}`;
    }
    if (this.batteryHelpEl) {
      this.batteryHelpEl.textContent = `${g.scooter.name}: ${g.maxBolts} bolts, hand capacity ${g.maxHandCapacity}. ` +
        `Each action costs 1 bolt. Defeating a creature refills the battery (unless its ability says otherwise).` +
        (g.scooter.abilityText ? ` Scooter ability: ${g.scooter.abilityText}.` : '');
    }

    this.renderQuests();

    if (this.btnEndRun) {
      this.btnEndRun.disabled = (g.status === 'won' || g.status === 'lost');
    }

    // 7. Treasure Chest
    if (this.treasureGemsRunEl) {
      this.treasureGemsRunEl.textContent = `${g.totalGems} 💎`;
    }
    if (this.treasureGemsStashEl) {
      this.treasureGemsStashEl.textContent = `${GameState.getPermanentGems()} 💎`;
    }
    if (this.treasureCollectedListEl) {
      this.treasureCollectedListEl.innerHTML = '';
      if (g.treasureChest.length === 0) {
        this.treasureCollectedListEl.innerHTML = '<span class="placeholder-sm">No treasure collected yet. Defeat sea creatures and match stockpile targets to claim gems!</span>';
      } else {
        g.treasureChest.forEach(t => {
          const itemEl = document.createElement('div');
          itemEl.className = 'treasure-chest-item';
          itemEl.title = `${t.name} (🎯 ${t.target})`;
          itemEl.innerHTML = `
            <div class="t-corner">💎 ${t.gems}</div>
            <div class="t-gems">${t.label}</div>
            <div class="t-target">🎯 ${t.target}</div>
          `;
          this.treasureCollectedListEl.appendChild(itemEl);
        });
      }
    }

    // 8. Status & Final Attack Banners
    if (isFinalAttack && g.status === 'in_progress') {
      this.finalAttackBannerEl.classList.remove('hidden');
      this.faTargetNumEl.textContent = fish?.target ?? '';
    } else {
      this.finalAttackBannerEl.classList.add('hidden');
    }

    if (isPostGame) {
      this.gameBannerEl.className = 'status-banner victory';
      this.gameBannerEl.innerHTML = `
        <div>🏆 <strong>${(fish?.name || 'FINAL FISH').toUpperCase()} DEFEATED — SEA ${g.sea.letter} COMPLETE!</strong> Victory Lap battery: <strong>${g.currentBolts}/${g.maxBolts} ⚡</strong>.</div>
        <div class="victory-bonus-box">Tap any remaining treasures in the stockpile to claim them, or conclude your adventure to bank your gems!</div>
        <div style="display: flex; gap: 8px; margin-top: 6px;">
          <button id="btn-banner-end-run" class="btn-primary">⚓ Conclude Adventure & Bank Haul</button>
        </div>
      `;
      document.getElementById('btn-banner-end-run')?.addEventListener('click', () => {
        this.game.endRun();
        this.render();
      });
    } else if (g.status === 'won') {
      this.gameBannerEl.className = 'status-banner victory';
      this.gameBannerEl.innerHTML = `
        <div>🏆 <strong>ADVENTURE COMPLETED!</strong> Sea ${g.sea.letter}: ${g.sea.name}</div>
        <div class="victory-stats">Adventure Score: <strong>💎 ${g.totalGems} Gems</strong> (${g.treasureChest.length} treasures, ${g.quests.quests.filter(q => q.completed).length}/${g.quests.quests.length} quests) • Total Legacy Stash: <strong>💎 ${GameState.getPermanentGems()} Gems</strong></div>
        <div style="display:flex; gap:8px; margin-top:8px;">
          <button id="btn-banner-restart" class="btn-primary">Ride Again</button>
          <button id="btn-banner-new" class="btn-secondary">🧭 Choose Another Sea</button>
        </div>
      `;
      document.getElementById('btn-banner-restart')?.addEventListener('click', () => this.btnRestart.click());
      document.getElementById('btn-banner-new')?.addEventListener('click', () => this.openSeaSelect());
    } else if (g.status === 'lost') {
      this.gameBannerEl.className = 'status-banner gameover';
      this.gameBannerEl.innerHTML = `
        <div>☠️ <strong>JOURNEY ENDED:</strong> ${g.statusMessage}</div>
        <div class="victory-stats">Gems Kept: <strong>💎 ${g.totalGems} Gems</strong> • Total Legacy Stash: <strong>💎 ${GameState.getPermanentGems()} Gems</strong></div>
        <button id="btn-banner-restart" class="btn-primary" style="margin-top: 8px;">Try Again</button>
      `;
      document.getElementById('btn-banner-restart')?.addEventListener('click', () => this.btnRestart.click());
    } else {
      this.gameBannerEl.className = 'status-banner hidden';
      this.gameBannerEl.innerHTML = '';
    }

    // 9. Log Rendering
    this.gameLogEl.innerHTML = g.log.map(item => `
      <div class="log-entry log-${item.type}">
        <span class="log-time">[${item.timestamp}]</span>
        <span class="log-msg">${item.msg}</span>
      </div>
    `).join('');
  }

  renderQuests() {
    const g = this.game;
    if (!this.questListEl) return;
    if (this.questPanelTitleEl) this.questPanelTitleEl.textContent = `SEA ${g.sea.letter} QUESTS`;
    if (this.questGemsEl) this.questGemsEl.textContent = `${g.questGems} 💎`;
    this.questListEl.innerHTML = g.quests.quests.map(q => {
      const reward = q.gemsTbd ? '💎 TBD' : `💎 ${q.gems}`;
      const tracking = q.rule ? '' : ' <span class="quest-manual" title="Not auto-tracked">(manual)</span>';
      return `<li class="quest-item ${q.completed ? 'done' : ''}">
        <span class="quest-check">${q.completed ? '✅' : '⬜'}</span>
        <span class="quest-text">${q.text}${tracking}</span>
        <span class="quest-reward">${reward}</span>
      </li>`;
    }).join('') || '<li class="quest-item">No quests for this sea.</li>';
  }

  // --- Sea & Scooter selection -------------------------------------------

  openSeaSelect() {
    this.draft = { ...this.selection };
    this.renderSeaSelect();
    this.seaOverlay.classList.remove('hidden');
  }

  closeSeaSelect() {
    this.seaOverlay.classList.add('hidden');
  }

  startAdventure() {
    this.selection = { ...this.draft };
    this.saveSelection();
    this.game = new GameState({ sea: this.selection.sea, scooterId: this.selection.scooterId });
    this.selectedSequence = [];
    this.lastActionFeedback = null;
    this.closeSeaSelect();
    this.render();
  }

  renderSeaSelect() {
    const d = this.draft;

    this.seaOptionsEl.innerHTML = GAME_DATA.seas.map(s => `
      <button class="sea-option ${s.letter === d.sea ? 'active' : ''}" data-sea="${s.letter}" id="sea-option-${s.letter}">
        <span class="sea-letter">${s.letter}</span>
        <span class="sea-name">${s.name}</span>
        <span class="sea-focus">${s.mathsFocus}</span>
      </button>`).join('');
    this.seaOptionsEl.querySelectorAll('.sea-option').forEach(btn => {
      btn.addEventListener('click', () => {
        d.sea = btn.dataset.sea;
        const scooters = scootersForSea(d.sea);
        if (!scooters.some(s => s.id === d.scooterId)) d.scooterId = defaultScooterForSea(d.sea)?.id;
        this.renderSeaSelect();
      });
    });

    const scooters = scootersForSea(d.sea);
    this.scooterOptionsEl.innerHTML = scooters.map(s => `
      <button class="scooter-option ${s.id === d.scooterId ? 'active' : ''}" data-id="${s.id}" id="scooter-option-${s.id}">
        <span class="scooter-head"><span class="sea-badge">${s.sea}</span> ${s.name}</span>
        <span class="scooter-stats">⚡ ${s.battery} • ✋ ${s.handCapacity} cards</span>
        <span class="scooter-hand">${s.startingHand.map(c => `<span class="mini-op ${opClass(c)}">${c.label}</span>`).join('')}</span>
        ${s.abilityText ? `<span class="scooter-ability">✨ ${s.abilityText}</span>` : ''}
      </button>`).join('');
    this.scooterOptionsEl.querySelectorAll('.scooter-option').forEach(btn => {
      btn.addEventListener('click', () => {
        d.scooterId = btn.dataset.id;
        this.renderSeaSelect();
      });
    });

    // Preview of what this sea contains
    const sea = getSea(d.sea);
    const deck = buildDrawPile(d.sea);
    const ops = [...new Set(deck.map(c => c.label))];
    const treasures = buildTreasureDeck(d.sea);
    const newFish = GAME_DATA.fish.filter(f => f.sea === d.sea);
    const fishPool = GAME_DATA.fish.filter(f => isUnlocked(f.sea, d.sea));
    const quests = GAME_DATA.quests[d.sea] || [];

    this.seaPreviewEl.innerHTML = `
      <div class="preview-title">Sea ${sea.letter}: ${sea.name}</div>
      <div class="preview-desc">${sea.description}</div>
      <div class="preview-grid">
        <div><strong>Encounters:</strong> ${sea.fishPerAdventure} fish ${sea.randomised ? '(randomised)' : '(fixed order)'}
          ${sea.finalFishId ? ` • final: ${GAME_DATA.fish.find(f => f.id === sea.finalFishId)?.name}` : ''}</div>
        <div><strong>New fish:</strong> ${newFish.map(f => f.name).join(', ') || '—'} <span class="muted">(pool of ${fishPool.length})</span></div>
        <div><strong>Market (${deck.length} cards):</strong> ${ops.map(l => `<span class="mini-op ${l.startsWith('×') ? 'op-mult' : l.startsWith('−') ? 'op-sub' : 'op-add'}">${l}</span>`).join('')}</div>
        <div><strong>Treasure deck:</strong> ${treasures.length} cards</div>
        <div><strong>Quests:</strong> ${quests.map(q => q.text).join(' • ') || '—'}</div>
      </div>
      <div class="muted preview-rules">${sea.encounterRulesText}</div>
    `;

    if (this.dataSourceLabel) {
      this.dataSourceLabel.textContent = `Data: ${GAME_DATA.source}`;
    }
  }
}

// Instantiate UI once DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
  window.gameUI = new GameUI();
});
