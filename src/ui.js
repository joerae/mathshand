/**
 * UI Renderer and Event Controller for Maths Handbuilder Prototype (v0.10 – Seven Seas)
 */
import { GameState } from './game.js';
import { FISH_ART } from './fish_art.js';
import { scooterArtFor } from './scooter_art.js';
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
  if (card.op === '×' || card.op === 'x' || card.op === '*') return 'op-mult';
  if (card.op === '-' || card.op === '−') return 'op-sub';
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

    // Scooter Card Panel (Bottom Right)
    this.scooterCardDisplayEl = document.getElementById('scooter-card-display');
    this.scooterPanelSeaHint = document.getElementById('scooter-panel-sea-hint');

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

  // --- Visual Cause-and-Effect Animations ----------------------------------

  /**
   * Spawns a floating callout badge anchored to a DOM element (or rect) that
   * rises and fades out.
   */
  spawnFloatingCallout(targetElOrRect, text, variant = 'info', offsetY = 0) {
    if (!targetElOrRect) return;
    const rect = typeof targetElOrRect.getBoundingClientRect === 'function'
      ? targetElOrRect.getBoundingClientRect()
      : targetElOrRect;
    if (!rect || (rect.width === 0 && rect.height === 0)) return;

    const pill = document.createElement('div');
    pill.className = `fx-floating-callout fx-${variant}`;
    pill.textContent = text;
    pill.style.left = `${rect.left + rect.width / 2}px`;
    pill.style.top = `${rect.top + rect.height * 0.35 + offsetY}px`;
    document.body.appendChild(pill);

    setTimeout(() => pill.remove(), 1350);
  }

  /**
   * Temporarily applies a CSS animation class to an element and removes it when done.
   */
  triggerElementAnim(el, className, durationMs = 650) {
    if (!el) return;
    el.classList.remove(className);
    // Force reflow so re-triggering the same animation works immediately
    void el.offsetWidth;
    el.classList.add(className);
    setTimeout(() => el.classList.remove(className), durationMs);
  }

  /**
   * Highlights the battery bolt that was just spent (and pulses the top battery pill).
   */
  animateBoltSpent(spentBoltIndex) {
    const boltCards = this.batteryCardsRowEl?.querySelectorAll('.battery-card');
    if (boltCards && boltCards[spentBoltIndex]) {
      const boltEl = boltCards[spentBoltIndex];
      this.triggerElementAnim(boltEl, 'anim-bolt-spent', 700);
      this.spawnFloatingCallout(boltEl, '−1 ⚡', 'bolt', -10);
    }
    const batteryPill = document.querySelector('.battery-pill');
    if (batteryPill) {
      this.triggerElementAnim(batteryPill, 'anim-pill-flash-warn', 600);
    }
  }

  /**
   * Animates a card clone flying from a source bounding rect to a destination element.
   */
  animateCardFlight({ fromRect, toEl, cardHtml, cardClass, duration = 520, onArrive }) {
    if (!fromRect || !toEl) {
      if (onArrive) onArrive();
      return;
    }
    const toRect = toEl.getBoundingClientRect();
    if (toRect.width === 0 && toRect.height === 0) {
      if (onArrive) onArrive();
      return;
    }

    // Hide destination card until flight completes
    const prevVisibility = toEl.style.visibility;
    toEl.style.visibility = 'hidden';

    const flyer = document.createElement('div');
    flyer.className = `portrait-card ${cardClass} fx-flying-card`;
    flyer.innerHTML = cardHtml;
    flyer.style.left = `${fromRect.left}px`;
    flyer.style.top = `${fromRect.top}px`;
    flyer.style.width = `${fromRect.width}px`;
    flyer.style.height = `${fromRect.height}px`;
    document.body.appendChild(flyer);

    const dx = (toRect.left + toRect.width / 2) - (fromRect.left + fromRect.width / 2);
    const dy = (toRect.top + toRect.height / 2) - (fromRect.top + fromRect.height / 2);
    const scaleX = toRect.width / Math.max(1, fromRect.width);
    const scaleY = toRect.height / Math.max(1, fromRect.height);

    if (typeof flyer.animate === 'function') {
      const anim = flyer.animate([
        { transform: 'translate(0px, 0px) scale(1) rotate(0deg)', boxShadow: '0 8px 20px rgba(0,0,0,0.22)' },
        { transform: `translate(${dx * 0.5}px, ${dy * 0.5 - 28}px) scale(1.16) rotate(-4deg)`, boxShadow: '0 16px 32px rgba(0,0,0,0.32)', offset: 0.45 },
        { transform: `translate(${dx}px, ${dy}px) scale(${scaleX}, ${scaleY}) rotate(0deg)`, boxShadow: '0 4px 10px rgba(0,0,0,0.15)' }
      ], {
        duration,
        easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
        fill: 'forwards'
      });
      anim.onfinish = () => {
        flyer.remove();
        toEl.style.visibility = prevVisibility;
        this.triggerElementAnim(toEl, 'anim-card-arrived', 650);
        if (onArrive) onArrive();
      };
    } else {
      setTimeout(() => {
        flyer.remove();
        toEl.style.visibility = prevVisibility;
        if (onArrive) onArrive();
      }, duration);
    }
  }

  /**
   * Dramatic sequence when a fish is defeated:
   * 1. Shows the defeated fish bursting on the encounter card before revealing the next fish
   * 2. Pops the newly revealed Treasure card out of the defeated fish and flies it to the Stockpile
   * 3. Pulses the recharged battery bolts and deals in any refilled market slots
   */
  animateFishDefeatSequence({ defeatedFish, total, revealedTreasure, recharged, refilledIndices }) {
    const fishCardEl = this.fishCardEl;
    if (!fishCardEl) return;

    const fishRect = fishCardEl.getBoundingClientRect();

    // 1. Defeated fish overlay right on top of the fish card
    const overlay = document.createElement('div');
    overlay.className = 'fx-fish-defeat-overlay';
    overlay.innerHTML = `
      <div class="fx-defeat-art">${fishArtFor(defeatedFish)}</div>
      <div class="fx-defeat-burst">
        <span class="fx-defeat-badge">⚔️ ${defeatedFish.name.toUpperCase()} DEFEATED! (🎯 ${total})</span>
      </div>
    `;
    fishCardEl.appendChild(overlay);
    this.triggerElementAnim(fishCardEl, 'anim-fish-defeat-impact', 900);
    setTimeout(() => overlay.remove(), 880);

    // 2. Treasure card emerging from the defeated fish and flying to the Treasure Stockpile
    if (revealedTreasure && this.stockpileSlotsEl) {
      const stockpileCards = this.stockpileSlotsEl.querySelectorAll('.stockpile-card');
      const destCardEl = stockpileCards[stockpileCards.length - 1];
      const wasStolen = !this.game.treasureStockpile.some(t => (t.uid || t.id) === (revealedTreasure.uid || revealedTreasure.id));

      if (destCardEl && !wasStolen) {
        const destRect = destCardEl.getBoundingClientRect();
        destCardEl.style.visibility = 'hidden';

        const flyer = document.createElement('div');
        flyer.className = 'portrait-card stockpile-card treasure-card fx-flying-card fx-treasure-drop';
        flyer.innerHTML = `
          <div class="fx-drop-banner">💎 TREASURE!</div>
          <div class="card-corner-top">💎 ${revealedTreasure.gems}</div>
          <div class="card-center-gems">${revealedTreasure.label}</div>
          <div class="treasure-name">${revealedTreasure.name}</div>
          <div class="card-target-bottom">🎯 ${revealedTreasure.target}</div>
        `;

        const cardW = 86;
        const cardH = 122;
        const startLeft = fishRect.left + fishRect.width / 2 - cardW / 2;
        const startTop = fishRect.top + fishRect.height / 2 - cardH / 2;

        flyer.style.left = `${startLeft}px`;
        flyer.style.top = `${startTop}px`;
        flyer.style.width = `${cardW}px`;
        flyer.style.height = `${cardH}px`;
        document.body.appendChild(flyer);

        const dx = (destRect.left + destRect.width / 2) - (startLeft + cardW / 2);
        const dy = (destRect.top + destRect.height / 2) - (startTop + cardH / 2);

        if (typeof flyer.animate === 'function') {
          const anim = flyer.animate([
            { transform: 'translate(0px, 12px) scale(0.25) rotate(-12deg)', opacity: 0 },
            { transform: 'translate(0px, -22px) scale(1.22) rotate(4deg)', opacity: 1, offset: 0.28 },
            { transform: 'translate(0px, -26px) scale(1.18) rotate(0deg)', opacity: 1, offset: 0.52 },
            { transform: `translate(${dx}px, ${dy}px) scale(1) rotate(0deg)', opacity: 1` }
          ], {
            duration: 1050,
            easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
            fill: 'forwards'
          });

          // Fix keyframe syntax by passing clean objects:
          anim.cancel();
          const cleanAnim = flyer.animate([
            { transform: 'translate(0px, 12px) scale(0.25) rotate(-12deg)', opacity: 0 },
            { transform: 'translate(0px, -22px) scale(1.22) rotate(4deg)', opacity: 1, offset: 0.28 },
            { transform: 'translate(0px, -26px) scale(1.18) rotate(0deg)', opacity: 1, offset: 0.52 },
            { transform: `translate(${dx}px, ${dy}px) scale(1) rotate(0deg)`, opacity: 1 }
          ], {
            duration: 1050,
            easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
            fill: 'forwards'
          });

          cleanAnim.onfinish = () => {
            flyer.remove();
            destCardEl.style.visibility = '';
            this.triggerElementAnim(destCardEl, 'anim-treasure-landed', 750);
            this.spawnFloatingCallout(destCardEl, `💎 ${revealedTreasure.name}!`, 'treasure', -12);
          };
        } else {
          setTimeout(() => {
            flyer.remove();
            destCardEl.style.visibility = '';
          }, 1050);
        }
      } else if (wasStolen) {
        this.spawnFloatingCallout(fishCardEl, `🦑 ${this.game.currentMonster?.name} stole the treasure!`, 'miss', -20);
      }
    }

    // 3. Battery recharge pulse
    if (recharged && this.batteryCardsRowEl) {
      const boltCards = this.batteryCardsRowEl.querySelectorAll('.battery-card.charged');
      boltCards.forEach((cardEl, idx) => {
        cardEl.style.animationDelay = `${idx * 65}ms`;
        this.triggerElementAnim(cardEl, 'anim-battery-recharge', 800);
        setTimeout(() => { cardEl.style.animationDelay = ''; }, 850);
      });
      this.spawnFloatingCallout(this.batteryCardsRowEl, '⚡ BATTERY RECHARGED!', 'success', -8);
    } else if (!recharged && this.batteryCardsRowEl) {
      this.spawnFloatingCallout(this.batteryCardsRowEl, '🪼 No Recharge!', 'miss', -8);
    }

    // 4. Market slots refilled animation
    if (refilledIndices && refilledIndices.length > 0 && this.marketSlotsEl) {
      const slots = this.marketSlotsEl.children;
      refilledIndices.forEach((slotIdx, i) => {
        const slotEl = slots[slotIdx];
        if (slotEl) {
          slotEl.style.animationDelay = `${i * 70}ms`;
          this.triggerElementAnim(slotEl, 'anim-card-deal', 650);
          setTimeout(() => { slotEl.style.animationDelay = ''; }, 700);
        }
      });
      this.spawnFloatingCallout(this.marketSlotsEl, `🔄 +${refilledIndices.length} Market Refilled`, 'info', -10);
    }
  }

  // --- Selection & Actions -------------------------------------------------

  clearSelection() {
    this.selectedSequence = [];
    this.render();
  }

  toggleNumberCardSelection(card) {
    if (this.game.status !== 'in_progress' && this.game.status !== 'post_game') return;

    const cardId = card.uid || card.id;

    // Fish ability: choose cards to discard
    if (this.game.pendingDiscard) {
      const res = this.game.discardFromHand(cardId);
      this.selectedSequence = this.selectedSequence.filter(c => (c.uid || c.id) !== cardId);
      this.render();
      if (res.success && this.handNumberCardsEl) {
        this.spawnFloatingCallout(this.handNumberCardsEl, `🗑️ Discarded ${res.card.label}`, 'miss', -10);
      }
      return;
    }

    // If a card purchase is pending replacement at capacity, clicking replaces it!
    if (this.game.pendingPurchase) {
      const pendingMarketIdx = this.game.pendingPurchase.targetIndex;
      const pendingCard = this.game.pendingPurchase.card;
      const marketSlotEl = this.marketSlotsEl?.children[pendingMarketIdx];
      const fromRect = marketSlotEl ? marketSlotEl.getBoundingClientRect() : null;

      const repRes = this.game.replaceAndAcquire(cardId);
      if (repRes.success) {
        this.lastActionFeedback = {
          type: 'success',
          text: `🔄 Replaced ${repRes.replacedCard.label} with ${pendingCard.label}!`
        };
        this.selectedSequence = [];
        this.render();

        const handCards = this.handNumberCardsEl?.querySelectorAll('.number-card');
        const newHandCardEl = handCards?.[handCards.length - 1];
        if (fromRect && newHandCardEl) {
          this.animateCardFlight({
            fromRect,
            toEl: newHandCardEl,
            cardClass: `game-card number-card ${opClass(pendingCard)}`,
            cardHtml: `
              <div class="card-corner-top">${pendingCard.label}</div>
              <div class="card-center-val">${pendingCard.label}</div>
              <div class="card-target-bottom">🎯 ${pendingCard.target}</div>
            `
          });
        }
        if (this.handNumberCardsEl) {
          this.spawnFloatingCallout(
            this.handNumberCardsEl,
            `🔄 ${repRes.replacedCard.label} → ${pendingCard.label}`,
            'success',
            -12
          );
        }
      } else {
        this.render();
      }
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
    if (this.game.isBlocked) {
      const msg = this.game.pendingDiscard
        ? '⏳ Discard a card from your hand first!'
        : '⏳ Choose a card in your hand first!';
      this.spawnFloatingCallout(this.handNumberCardsEl, msg, 'miss', -10);
      return;
    }

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

    if (!res.success) return;

    if (res.targetMatched && res.defeated) {
      this.animateFishDefeatSequence({
        defeatedFish: res.defeatedFish || fish,
        total: res.total,
        revealedTreasure: res.revealedTreasure,
        recharged: res.recharged,
        refilledIndices: res.refilledIndices
      });
    } else if (res.targetMatched && !res.defeated) {
      // Multi-target fish hit (e.g. Hydra)
      this.triggerElementAnim(this.fishCardEl, 'anim-fish-hit', 650);
      this.spawnFloatingCallout(this.fishCardEl, `⚔️ HIT 🎯 ${res.total}!`, 'success', -15);
      if (!res.finalAttack) {
        this.animateBoltSpent(this.game.currentBolts);
      }
    } else {
      // Missed attack
      this.triggerElementAnim(this.fishCardEl, 'anim-shake-miss', 600);
      this.spawnFloatingCallout(
        this.fishCardEl,
        `❌ Got ${res.total}, needed 🎯 ${needed}`,
        'miss',
        -10
      );
      if (!res.finalAttack) {
        this.animateBoltSpent(this.game.currentBolts);
      }
    }
  }

  /**
   * Tap directly on a Market card or Stockpile treasure card to buy/claim it.
   * If the workbench total matches, acquires the card. If not, loses 1 energy.
   */
  handleBuy(type, index) {
    if (this.game.status !== 'in_progress' && this.game.status !== 'post_game') return;
    if (this.game.isBlocked) {
      const msg = this.game.pendingDiscard
        ? '⏳ Discard a card from your hand first!'
        : '⏳ Choose a card in your hand first!';
      this.spawnFloatingCallout(this.handNumberCardsEl, msg, 'miss', -10);
      return;
    }

    const containerEl = type === 'stockpile' ? this.stockpileSlotsEl : this.marketSlotsEl;
    const clickedSlotEl = containerEl?.children[index];
    const fromRect = clickedSlotEl ? clickedSlotEl.getBoundingClientRect() : null;

    if (this.game.isFinalAttack && this.game.status === 'in_progress') {
      this.lastActionFeedback = {
        type: 'miss',
        text: '⚡ Out of battery! Only Final Attack is available — tap the sea creature!'
      };
      this.render();
      const postSlotEl = (type === 'stockpile' ? this.stockpileSlotsEl : this.marketSlotsEl)?.children[index];
      this.triggerElementAnim(postSlotEl, 'anim-shake-miss', 550);
      this.spawnFloatingCallout(fromRect, '⚡ 0 Bolts! Tap Fish for Final Attack', 'miss', -10);
      return;
    }

    if (this.game.status === 'post_game' && type !== 'stockpile') {
      this.lastActionFeedback = {
        type: 'info',
        text: '🏆 Market is closed during the Victory Lap. Tap a stockpile treasure to claim it!'
      };
      this.render();
      this.spawnFloatingCallout(fromRect, '🏆 Market Closed in Victory Lap', 'info', -10);
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

    if (!res.success) return;

    // Spend bolt animation for every buy/claim attempt
    this.animateBoltSpent(this.game.currentBolts);

    if (res.targetMatched) {
      if (type === 'stockpile') {
        // Fly claimed treasure card from Stockpile to Treasure Chest
        this.spawnFloatingCallout(fromRect, `💎 +${targetCard.gems} GEMS!`, 'treasure', -14);
        const chestItems = this.treasureCollectedListEl?.querySelectorAll('.treasure-chest-item');
        const newChestItemEl = chestItems?.[chestItems.length - 1];
        if (fromRect && newChestItemEl) {
          this.animateCardFlight({
            fromRect,
            toEl: newChestItemEl,
            cardClass: 'treasure-card',
            cardHtml: `
              <div class="card-corner-top">💎 ${targetCard.gems}</div>
              <div class="card-center-gems">${targetCard.label}</div>
              <div class="card-target-bottom">🎯 ${targetCard.target}</div>
            `
          });
        }
        const treasurePill = document.querySelector('.treasure-pill');
        if (treasurePill) this.triggerElementAnim(treasurePill, 'anim-pill-flash-gold', 700);
      } else if (res.needsReplacement) {
        const postSlotEl = this.marketSlotsEl?.children[index];
        this.triggerElementAnim(postSlotEl, 'anim-card-arrived', 650);
        this.spawnFloatingCallout(fromRect, `🛒 Matched ${targetCard.label}! Pick a card to scrap`, 'info', -14);
      } else {
        // Fly bought market card from Market slot into Player's Hand
        this.spawnFloatingCallout(fromRect, `🛒 Bought ${targetCard.label}!`, 'success', -14);
        const handCards = this.handNumberCardsEl?.querySelectorAll('.number-card');
        const newHandCardEl = handCards?.[handCards.length - 1];
        if (fromRect && newHandCardEl) {
          this.animateCardFlight({
            fromRect,
            toEl: newHandCardEl,
            cardClass: `game-card number-card ${opClass(targetCard)}`,
            cardHtml: `
              <div class="card-corner-top">${targetCard.label}</div>
              <div class="card-center-val">${targetCard.label}</div>
              <div class="card-target-bottom">🎯 ${targetCard.target}</div>
            `
          });
        }
      }
    } else {
      // Mismatch: shake the tapped card and show floating mismatch callout
      const postContainer = type === 'stockpile' ? this.stockpileSlotsEl : this.marketSlotsEl;
      const postSlotEl = postContainer?.children[index];
      this.triggerElementAnim(postSlotEl, 'anim-shake-miss', 600);
      this.spawnFloatingCallout(
        fromRect,
        `❌ Got ${res.total}, needed 🎯 ${targetCard.target}`,
        'miss',
        -12
      );
    }
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

    if (res.success) {
      this.animateBoltSpent(this.game.currentBolts);
      if (this.marketSlotsEl) {
        Array.from(this.marketSlotsEl.children).forEach((slotEl, idx) => {
          slotEl.style.animationDelay = `${idx * 55}ms`;
          this.triggerElementAnim(slotEl, 'anim-card-deal', 600);
          setTimeout(() => { slotEl.style.animationDelay = ''; }, 650);
        });
        this.spawnFloatingCallout(this.marketSlotsEl, '🔄 5 New Market Cards!', 'info', -12);
      }
    }
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
        if (isReplacing && g.pendingPurchase?.targetIndex === idx) {
          slotEl.classList.add('selected');
        }

        const isMatched = this.showCalculator && (this.selectedSequence.length > 0 && calc.total === card.target);
        if (isMatched && !isFinalAttack && !isPostGame) slotEl.classList.add('matched');

        let matchBadge = '';
        if (isReplacing && g.pendingPurchase?.targetIndex === idx) {
          matchBadge = `<div class="card-match-indicator">🛒 BUYING...</div>`;
        } else if (isMatched && !isFinalAttack && !isPostGame) {
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
        this.discardTitle.textContent = `🐙 ${g.pendingDiscard.source.toUpperCase()} DEFEATED — DISCARD REQUIRED!`;
        this.discardPromptText.textContent = `Defeating ${g.pendingDiscard.source} forces you to discard ${n} number card${n > 1 ? 's' : ''} of your choice. Click a card in your hand to discard.`;
      }
    }

    const selectedIds = new Set(this.selectedSequence.map(c => c.uid || c.id));
    const cardsInHand = isBlocked
      ? g.hand // When replacing/discarding, show all cards in hand
      : g.hand.filter(c => !selectedIds.has(c.uid || c.id));

    this.handNumberCardsEl.innerHTML = '';

    if (cardsInHand.length === 0 && !isBlocked) {
      const hintEl = document.createElement('div');
      hintEl.className = 'empty-hand-hint';
      hintEl.style.width = '100%';
      hintEl.textContent = 'All cards from your hand are on the Calculation Workbench. Click any card on the workbench to return it to your hand.';
      this.handNumberCardsEl.appendChild(hintEl);
    }

    cardsInHand.forEach(c => {
      const cardEl = document.createElement('div');
      cardEl.className = `portrait-card game-card number-card ${opClass(c)}`;
      if (isDiscarding) {
        cardEl.classList.add('selectable-for-replacement');
        cardEl.title = `Click to PERMANENTLY DISCARD ${c.label} (${g.pendingDiscard.source} defeat effect)`;
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

    // Render dotted outlines for available scooter card slots
    const occupiedSlots = cardsInHand.length;
    const totalSlots = g.maxHandCapacity || 8;
    for (let slotIdx = occupiedSlots + 1; slotIdx <= totalSlots; slotIdx++) {
      const slotEl = document.createElement('div');
      slotEl.className = 'portrait-card hand-slot-empty';
      slotEl.title = `Scooter Card Slot ${slotIdx} (Available • Buy cards from the market to fill)`;
      slotEl.innerHTML = `
        <div class="card-corner-top slot-corner">#${slotIdx}</div>
        <div class="slot-center-body">
          <span class="slot-plus">＋</span>
          <span class="slot-name">Empty</span>
        </div>
        <div class="card-target-bottom slot-target">Available</div>
      `;
      slotEl.addEventListener('click', () => {
        if (isReplacing) {
          this.spawnFloatingCallout(slotEl, '⚠️ Click a card to replace!', 'miss', -8);
        } else if (isDiscarding) {
          this.spawnFloatingCallout(slotEl, '⚠️ Click a card to discard!', 'miss', -8);
        } else {
          this.spawnFloatingCallout(slotEl, '🛒 Buy cards in Market to fill slot!', 'info', -8);
        }
      });
      this.handNumberCardsEl.appendChild(slotEl);
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

    // 10. Current Scooter Card Rendering (Bottom Right)
    this.renderScooterCard();
  }

  renderScooterCard() {
    if (!this.scooterCardDisplayEl) return;
    const g = this.game;
    const s = g.scooter;
    if (!s) {
      this.scooterCardDisplayEl.innerHTML = '<div style="color:#64748b; font-size:0.85rem; padding: 12px;">No scooter equipped.</div>';
      return;
    }

    if (this.scooterPanelSeaHint) {
      this.scooterPanelSeaHint.textContent = `Sea ${s.sea} Equipment`;
    }

    // Battery Pips
    const pipsHtml = Array.from({ length: g.maxBolts }, (_, i) => {
      const isCharged = i < g.currentBolts;
      return `<span class="bolt-pip ${isCharged ? 'pip-charged' : 'pip-spent'}" title="${isCharged ? `Bolt ${i + 1}: Charged` : `Bolt ${i + 1}: Spent`}">${isCharged ? '⚡' : '○'}</span>`;
    }).join('');

    // Starting Hand Mini Cards
    const startingHandCards = Array.isArray(s.startingHand) ? s.startingHand : [];
    const startingCardsHtml = startingHandCards.map(c => `
      <div class="scooter-mini-card ${opClass(c)}" title="Starting Toolkit Card: ${c.label} (Target 🎯 ${c.target})">
        <span class="mini-corner">${c.label}</span>
        <span class="mini-val">${c.label}</span>
        <span class="mini-target">🎯${c.target}</span>
      </div>
    `).join('');

    // Special Ability text
    let abilityHtml = '';
    if (s.abilityText && s.abilityText.trim().length > 0) {
      abilityHtml = `<div class="ability-active">✨ <strong>${s.abilityText}</strong></div>`;
    } else {
      abilityHtml = `<div class="ability-none">Standard Propulsion Engine (Costs 1 bolt per movement/action. Refills fully when a sea creature is defeated).</div>`;
    }

    const availableSlots = Math.max(0, g.maxHandCapacity - g.hand.length);

    this.scooterCardDisplayEl.innerHTML = `
      <div class="scooter-tcg-card">
        <div class="scooter-tcg-header">
          <div class="scooter-tcg-title-row">
            <h3 class="scooter-tcg-name">🛵 ${s.name}</h3>
            <span class="scooter-tcg-sea-badge">🌊 Sea ${s.sea}</span>
          </div>
          ${s.concept ? `<div class="scooter-tcg-concept">"${s.concept}"</div>` : ''}
        </div>

        <div class="scooter-tcg-art-frame" title="${s.name} blueprint art">
          ${scooterArtFor(s)}
        </div>

        <div class="scooter-tcg-specs">
          <div class="scooter-spec-box spec-battery">
            <div class="spec-label">⚡ Battery Charge</div>
            <div class="spec-value">${g.currentBolts} / ${g.maxBolts} <span class="spec-unit">Bolts</span></div>
            <div class="spec-pips">${pipsHtml}</div>
          </div>
          <div class="scooter-spec-box spec-hand">
            <div class="spec-label">✋ Hand Capacity</div>
            <div class="spec-value">${g.hand.length} / ${g.maxHandCapacity} <span class="spec-unit">Cards</span></div>
            <div class="spec-sub">${availableSlots} available slot${availableSlots === 1 ? '' : 's'}</div>
          </div>
        </div>

        <div class="scooter-tcg-section">
          <div class="section-title">🎒 Starting Toolkit (${startingHandCards.length} Cards)</div>
          <div class="scooter-tcg-hand-pills">
            ${startingCardsHtml}
          </div>
        </div>

        <div class="scooter-tcg-section">
          <div class="section-title">✨ Special Abilities & Systems</div>
          <div class="scooter-tcg-ability">
            ${abilityHtml}
          </div>
        </div>
      </div>
    `;
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
