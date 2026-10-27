/**
 * UI Renderer and Event Controller for Maths Handbuilder Prototype (v0.7 Underwater Scooter)
 */
import { GameState } from './game.js';
import { FISH_ART } from './fish_art.js';

export class GameUI {
  constructor() {
    this.game = new GameState();
    this.selectedSequence = []; // Array of number cards selected from hand
    this.selectedTarget = null; // { type: 'market' | 'stockpile', index: number } | null
    this.showCalculator = false; // Default: OFF (physical card simulation with mental math)

    this.cacheElements();
    this.bindEvents();
    this.render();
  }

  cacheElements() {
    // Fish Encounter Elements
    this.monsterNameEl = document.getElementById('monster-name');
    this.monsterTargetEl = document.getElementById('monster-target');
    this.fishRechargeValEl = document.getElementById('fish-recharge-val');
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

    // Hand & Discard Elements (LHS)
    this.handNumberCardsEl = document.getElementById('hand-number-cards');
    this.discardPreviewCountEl = document.getElementById('discard-preview-count');
    this.discardPreviewCardsEl = document.getElementById('discard-preview-cards');

    // Action Buttons
    this.btnAttack = document.getElementById('btn-action-attack');
    this.btnBuy = document.getElementById('btn-action-buy');
    this.btnRefresh = document.getElementById('btn-action-refresh');
    this.btnPickup = document.getElementById('btn-action-pickup');

    // Top Bar & End Run Buttons
    this.btnEndRun = document.getElementById('btn-end-run');
    this.btnRestart = document.getElementById('btn-restart');

    // Info & Pile stats
    this.statBatteryCount = document.getElementById('stat-battery-count');
    this.statDrawCount = document.getElementById('stat-draw-count');
    this.statDiscardCount = document.getElementById('stat-discard-count');
    this.statPlayerDiscardCount = document.getElementById('stat-player-discard-count');
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
    // Action Buttons
    this.btnAttack.addEventListener('click', () => this.handleAttack());
    this.btnBuy.addEventListener('click', () => this.handleBuy());
    this.btnRefresh.addEventListener('click', () => this.handleMarketRefresh());
    this.btnPickup.addEventListener('click', () => this.handlePickup());
    this.clearSequenceBtn.addEventListener('click', () => this.clearSelection());

    // Auto-Calculator Debug Toggle (in Workbench header and debug panel)
    const setCalculatorToggle = (enabled) => {
      this.showCalculator = enabled;
      if (this.chkAutoCalc) this.chkAutoCalc.checked = enabled;
      if (this.debugChkAutoCalc) this.debugChkAutoCalc.checked = enabled;
      if (enabled && this.selectedSequence.length > 0) {
        const calc = GameState.calculateSequence(this.selectedSequence);
        this.autoSelectMatchingTarget(calc.total);
      }
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
        this.render();
      });
    }

    // Restart Button
    this.btnRestart.addEventListener('click', () => {
      this.game.reset();
      this.clearSelection();
      this.selectedTarget = null;
      this.render();
    });

    // Debug Controls
    this.debugSkipBtn.addEventListener('click', () => {
      this.game.debugSkipMonster();
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

  autoSelectMatchingTarget(calcTotal) {
    if (!this.showCalculator) return; // Do not auto-select when calculator hints are disabled

    if (this.selectedTarget !== null) {
      const current = (this.selectedTarget.type === 'stockpile')
        ? this.game.treasureStockpile[this.selectedTarget.index]
        : this.game.market[this.selectedTarget.index];
      if (current && current.target === calcTotal) return;
    }

    if (this.selectedSequence.length > 0) {
      const marketMatchIdx = this.game.market.findIndex(c => c && c.target === calcTotal);
      const stockMatchIdx = this.game.treasureStockpile.findIndex(c => c && c.target === calcTotal);

      if (stockMatchIdx !== -1 && marketMatchIdx === -1) {
        this.selectedTarget = { type: 'stockpile', index: stockMatchIdx };
      } else if (marketMatchIdx !== -1 && stockMatchIdx === -1) {
        this.selectedTarget = { type: 'market', index: marketMatchIdx };
      } else if (marketMatchIdx !== -1 && stockMatchIdx !== -1 && !this.selectedTarget) {
        // Prefer stockpile if in post_game
        this.selectedTarget = (this.game.status === 'post_game')
          ? { type: 'stockpile', index: stockMatchIdx }
          : { type: 'market', index: marketMatchIdx };
      }
    }
  }

  toggleNumberCardSelection(card) {
    if (this.game.status !== 'in_progress' && this.game.status !== 'post_game') return;

    const cardId = card.uid || card.id;
    const existingIndex = this.selectedSequence.findIndex(c => (c.uid || c.id) === cardId);

    if (existingIndex >= 0) {
      this.selectedSequence.splice(existingIndex, 1);
    } else {
      this.selectedSequence.push(card);
    }

    if (this.showCalculator) {
      const calc = GameState.calculateSequence(this.selectedSequence);
      this.autoSelectMatchingTarget(calc.total);
    }

    this.render();
  }

  selectTarget(type, index) {
    if (this.game.status !== 'in_progress' && this.game.status !== 'post_game') return;
    if (this.game.isFinalAttack && this.game.status === 'in_progress') {
      alert('Scooter is out of battery! Only Final Attack is available.');
      return;
    }

    const card = (type === 'stockpile')
      ? this.game.treasureStockpile[index]
      : this.game.market[index];
    if (!card) return;

    if (this.selectedTarget && this.selectedTarget.type === type && this.selectedTarget.index === index) {
      if (this.showCalculator) {
        const calc = GameState.calculateSequence(this.selectedSequence);
        if (calc.total === card.target) {
          this.handleBuy();
          return;
        }
      }
      this.selectedTarget = null;
    } else {
      this.selectedTarget = { type, index };
    }
    this.render();
  }

  handleAttack() {
    if (this.game.status !== 'in_progress') return;

    const res = this.game.playAttack(this.selectedSequence);
    if (res.success) {
      this.clearSelection();
    }
    this.render();
  }

  handleBuy() {
    if (this.game.status !== 'in_progress' && this.game.status !== 'post_game') return;

    if (this.game.isFinalAttack && this.game.status === 'in_progress') {
      alert('Scooter is out of battery! No other actions are available. You must make your Final Attack now!');
      return;
    }

    const calc = GameState.calculateSequence(this.selectedSequence);

    if (this.selectedTarget === null) {
      if (this.showCalculator) {
        const matchingMarket = [];
        this.game.market.forEach((card, idx) => {
          if (card && card.target === calc.total) {
            matchingMarket.push({ type: 'market', index: idx, card });
          }
        });

        const matchingStockpile = [];
        this.game.treasureStockpile.forEach((card, idx) => {
          if (card && card.target === calc.total) {
            matchingStockpile.push({ type: 'stockpile', index: idx, card });
          }
        });

        const totalMatches = [...matchingMarket, ...matchingStockpile];

        if (totalMatches.length === 1) {
          this.selectedTarget = totalMatches[0];
        } else if (totalMatches.length > 1) {
          alert('Multiple targets match your total! Click on the specific Market card or Stockpile treasure to buy/claim it.');
          return;
        } else {
          alert(`Your calculation total is ${calc.total}, but no target matches it. Click on a Market card or Stockpile treasure to target it.`);
          return;
        }
      } else {
        alert('Please click on a Market card or Stockpile treasure to select which card you want to buy/claim, then hit Buy!');
        return;
      }
    }

    const res = this.game.playBuy(this.selectedTarget.type, this.selectedTarget.index, this.selectedSequence);
    if (res.success) {
      this.clearSelection();
      this.selectedTarget = null;
    }
    this.render();
  }

  handleMarketRefresh() {
    if (this.game.status !== 'in_progress') return;

    if (this.game.isFinalAttack) {
      alert('Scooter is out of battery! No other actions are available. You must make your Final Attack now!');
      return;
    }

    const res = this.game.playMarketRefresh();
    if (res.success) {
      if (this.selectedTarget && this.selectedTarget.type === 'market') {
        this.selectedTarget = null;
      }
    }
    this.render();
  }

  handlePickup() {
    if (this.game.status !== 'in_progress' && this.game.status !== 'post_game') return;

    if (this.game.isFinalAttack && this.game.status === 'in_progress') {
      alert('Scooter is out of battery! No other actions are available. You must make your Final Attack now!');
      return;
    }

    this.game.playPickup();
    this.render();
  }

  render() {
    const g = this.game;
    const fish = g.currentMonster;
    const calc = GameState.calculateSequence(this.selectedSequence);
    const isFinalAttack = g.isFinalAttack;
    const isPostGame = (g.status === 'post_game');

    // 1. Current Sea Creature Info, Artwork & Scooter Battery Cards
    if (fish) {
      const isDefeated = g.sharkDefeated || isPostGame;
      this.monsterNameEl.textContent = isDefeated
        ? `${fish.name} (Defeated! 🏆)`
        : `Encounter ${g.currentMonsterIndex + 1}/${g.monstersList.length}: ${fish.name}`;
      this.monsterTargetEl.textContent = fish.target;
      if (this.fishRechargeValEl) {
        this.fishRechargeValEl.textContent = typeof fish.recharge === 'number' ? `+${fish.recharge}` : fish.recharge;
      }
      if (this.batteryCountTextEl) {
        this.batteryCountTextEl.textContent = `${g.currentBolts} / ${g.maxBolts} Bolts`;
      }
      if (this.statBatteryCount) {
        this.statBatteryCount.textContent = g.currentBolts;
      }

      // Render funny placeholder vector graphic
      if (this.creatureArtEl) {
        this.creatureArtEl.innerHTML = FISH_ART[fish.id] || '';
      }

      // Render 5 double-sided battery cards
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
      if (this.fishRechargeValEl) this.fishRechargeValEl.textContent = '-';
      if (this.batteryCountTextEl) this.batteryCountTextEl.textContent = '-';
      if (this.batteryCardsRowEl) this.batteryCardsRowEl.innerHTML = '';
      if (this.creatureArtEl) this.creatureArtEl.innerHTML = FISH_ART[6] || '';
    }

    // Auto-select target if calculation matches and auto-calc is enabled
    if (this.showCalculator) {
      this.autoSelectMatchingTarget(calc.total);
    }

    // 2. Market Slots (5 Number cards)
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
        slotEl.className = `portrait-card market-card op-${card.op === '×' ? 'mult' : (card.op === '-' ? 'sub' : 'add')}`;
        const isSelected = (this.selectedTarget?.type === 'market' && this.selectedTarget?.index === idx);
        const isMatched = this.showCalculator && (this.selectedSequence.length > 0 && calc.total === card.target);

        if (isSelected) slotEl.classList.add('selected');
        if (isMatched && !isFinalAttack) slotEl.classList.add('matched');

        let matchBadge = '';
        if (isMatched && !isFinalAttack) {
          matchBadge = `<div class="card-match-indicator">✨ MATCH! (Click to Buy)</div>`;
        }

        slotEl.innerHTML = `
          <div class="card-corner-top">${card.label}</div>
          <div class="card-center-val">${card.label}</div>
          <div class="card-target-bottom ${card.target < 0 ? 'neg-target' : ''}">🎯 ${card.target}</div>
          ${matchBadge}
        `;
        slotEl.addEventListener('click', () => this.selectTarget('market', idx));
      }
      this.marketSlotsEl.appendChild(slotEl);
    });

    // 3. Treasure Stockpile Slots (Clean: NO "Composite (3gem)" text)
    if (this.stockpileSlotsEl) {
      this.stockpileSlotsEl.innerHTML = '';
      if (g.treasureStockpile.length === 0) {
        this.stockpileSlotsEl.innerHTML = '<span class="empty-stockpile-hint">Stockpile is empty. Defeat sea creatures to reveal treasure cards here!</span>';
      } else {
        g.treasureStockpile.forEach((card, idx) => {
          const slotEl = document.createElement('div');
          slotEl.className = 'portrait-card stockpile-card treasure-card';

          const isSelected = (this.selectedTarget?.type === 'stockpile' && this.selectedTarget?.index === idx);
          const isMatched = this.showCalculator && (this.selectedSequence.length > 0 && calc.total === card.target);

          if (isSelected) slotEl.classList.add('selected');
          if (isMatched && !isFinalAttack) slotEl.classList.add('matched');

          let matchBadge = '';
          if (isMatched && !isFinalAttack) {
            matchBadge = `<div class="card-match-indicator">✨ MATCH! (Click to Claim)</div>`;
          }

          // Clean treasure display: gem corner, gem icons in center, and target badge at bottom
          slotEl.innerHTML = `
            <div class="card-corner-top">💎 ${card.gems}</div>
            <div class="card-center-gems">${card.label}</div>
            <div class="card-target-bottom ${card.target < 0 ? 'neg-target' : ''}">🎯 ${card.target}</div>
            ${matchBadge}
          `;
          slotEl.addEventListener('click', () => this.selectTarget('stockpile', idx));
          this.stockpileSlotsEl.appendChild(slotEl);
        });
      }
    }

    // 4. Calculation Workbench: Moving cards onto playmat as they are clicked!
    this.formulaChainEl.innerHTML = '';

    // Always display Starting 0 Base Card
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
      emptyHintEl.innerHTML = '<span class="empty-slot-icon">🂠</span><span>Click number cards in your hand to place them on the workbench</span>';
      this.formulaChainEl.appendChild(emptyHintEl);
    } else {
      calc.steps.forEach((step, idx) => {
        const arrowEl = document.createElement('span');
        arrowEl.className = 'workbench-arrow';
        arrowEl.textContent = '→';
        this.formulaChainEl.appendChild(arrowEl);

        const card = step.card;
        const cardEl = document.createElement('div');
        cardEl.className = `portrait-card workbench-card op-${card.op === '×' ? 'mult' : (card.op === '-' ? 'sub' : 'add')}`;
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
          this.selectedSequence.splice(idx, 1);
          if (this.showCalculator) {
            const newCalc = GameState.calculateSequence(this.selectedSequence);
            this.autoSelectMatchingTarget(newCalc.total);
          }
          this.render();
        });
        this.formulaChainEl.appendChild(cardEl);
      });
    }

    // Evaluated Total Display (Only shown when auto-calculator debug toggle is ON)
    if (this.formulaResultContainer) {
      if (this.showCalculator) {
        this.formulaResultContainer.classList.remove('hidden-calc');
        this.runningTotalEl.textContent = calc.total;
      } else {
        this.formulaResultContainer.classList.add('hidden-calc');
        this.runningTotalEl.textContent = '?';
      }
    }

    // Target comparison feedback (Only shown when auto-calculator debug toggle is ON)
    let comparisonText = '';
    const selectedTargetCard = this.selectedTarget !== null
      ? (this.selectedTarget.type === 'stockpile' ? g.treasureStockpile[this.selectedTarget.index] : g.market[this.selectedTarget.index])
      : null;

    if (this.showCalculator) {
      if (fish && calc.total === fish.target && !isPostGame) {
        const alertLabel = isFinalAttack ? '🚨 MATCHES FINAL ATTACK TARGET! Hit now to recharge!' : `🎯 Matches ${fish.name} Target! Ready to Attack!`;
        comparisonText += `<span class="badge-match monster">${alertLabel}</span> `;
      }
      if (selectedTargetCard && calc.total === selectedTargetCard.target && !isFinalAttack) {
        const typeLabel = this.selectedTarget.type === 'stockpile'
          ? `Treasure (${selectedTargetCard.label}, 🎯 ${selectedTargetCard.target})`
          : `Market Card (${selectedTargetCard.label}, 🎯 ${selectedTargetCard.target})`;
        comparisonText += `<span class="badge-match market">🛒 Matches ${typeLabel}! Ready to Buy/Claim!</span> `;
      }
      if (!comparisonText && this.selectedSequence.length > 0) {
        const targets = [];
        if (fish && !isPostGame) targets.push(`${fish.name}: ${fish.target}`);
        if (selectedTargetCard && !isFinalAttack) targets.push(`Target: ${selectedTargetCard.target}`);
        comparisonText = `<span class="badge-mismatch">Current Total: ${calc.total} ${targets.length ? `(Targets: ${targets.join(', ')})` : ''}</span>`;
      }
    }
    this.formulaComparisonEl.innerHTML = comparisonText;

    // 5. Hand Display: Only cards NOT placed on workbench remain in hand!
    this.handNumberCardsEl.innerHTML = '';
    const selectedIds = new Set(this.selectedSequence.map(c => c.uid || c.id));
    const cardsInHand = g.hand.filter(c => !selectedIds.has(c.uid || c.id));

    if (cardsInHand.length === 0) {
      this.handNumberCardsEl.innerHTML = this.selectedSequence.length > 0
        ? '<div class="empty-hand-hint">All cards from your hand are on the Calculation Workbench. Click any card on the workbench to return it to your hand.</div>'
        : '<div class="empty-hand-hint">Hand is empty! Play <strong>✋ Pickup</strong> to recover your played cards.</div>';
    } else {
      cardsInHand.forEach(c => {
        const cardEl = document.createElement('div');
        cardEl.className = `portrait-card game-card number-card op-${c.op === '×' ? 'mult' : (c.op === '-' ? 'sub' : 'add')}`;
        cardEl.title = 'Click to place this card onto the Calculation Workbench';
        cardEl.innerHTML = `
          <div class="card-corner-top">${c.label}</div>
          <div class="card-center-val">${c.label}</div>
          <div class="card-target-bottom">🎯 ${c.target}</div>
        `;
        cardEl.addEventListener('click', () => this.toggleNumberCardSelection(c));
        this.handNumberCardsEl.appendChild(cardEl);
      });
    }

    // Discard Pile Preview
    this.discardPreviewCountEl.textContent = g.playerDiscard.length;
    this.discardPreviewCardsEl.innerHTML = '';
    if (g.playerDiscard.length === 0) {
      this.discardPreviewCardsEl.innerHTML = '<span class="placeholder-sm">No cards in discard</span>';
    } else {
      g.playerDiscard.forEach(c => {
        const dEl = document.createElement('div');
        dEl.className = `mini-card op-${c.op === '×' ? 'mult' : (c.op === '-' ? 'sub' : 'add')}`;
        dEl.textContent = c.label;
        this.discardPreviewCardsEl.appendChild(dEl);
      });
    }

    // 6. Actions Panel & Button States
    const matchesFish = (fish && calc.total === fish.target && !isPostGame);
    const targetCard = selectedTargetCard;
    const matchesTarget = (targetCard && calc.total === targetCard.target);

    // Helpers only active when showCalculator is true
    const showMatchMonster = this.showCalculator && matchesFish;
    const showMatchTarget = this.showCalculator && matchesTarget;

    if (isPostGame) {
      // POST-GAME TREASURE CLAIMING PHASE: Can spend remaining bolts on treasures!
      this.btnAttack.disabled = true;
      this.btnAttack.classList.remove('final-attack-mode', 'ready-to-act');
      this.btnAttack.querySelector('.btn-title').textContent = '⚔️ All Fish Defeated!';
      this.btnAttack.querySelector('.btn-sub').textContent = 'Great White Shark conquered!';

      this.btnBuy.classList.remove('locked-action');
      if (targetCard && this.selectedTarget) {
        if (this.selectedTarget.type === 'stockpile') {
          this.btnBuy.querySelector('.btn-title').textContent = showMatchTarget
            ? `💎 Claim ${targetCard.label} (🎯 Matched!)`
            : `💎 Claim ${targetCard.label}`;
          this.btnBuy.querySelector('.btn-sub').textContent = showMatchTarget
            ? `Claim +${targetCard.gems} 💎 to Treasure Chest! (Costs 1 ⚡)`
            : `Treasure target is 🎯 ${targetCard.target} (Costs 1 ⚡)`;
        } else {
          this.btnBuy.querySelector('.btn-title').textContent = showMatchTarget
            ? `🛒 Buy ${targetCard.label} (🎯 Matched!)`
            : `🛒 Buy ${targetCard.label}`;
          this.btnBuy.querySelector('.btn-sub').textContent = showMatchTarget
            ? `Ready to acquire into hand! (Costs 1 ⚡)`
            : `Market target is 🎯 ${targetCard.target} (Costs 1 ⚡)`;
        }
      } else {
        this.btnBuy.querySelector('.btn-title').textContent = '💎 Claim Treasure';
        this.btnBuy.querySelector('.btn-sub').textContent = `Spend remaining bolts (${g.currentBolts} ⚡) on stockpile treasures`;
      }
      this.btnBuy.disabled = g.currentBolts <= 0;
      this.btnBuy.classList.toggle('ready-to-act', !!showMatchTarget && g.currentBolts > 0);

      this.btnRefresh.disabled = true;
      this.btnRefresh.classList.add('locked-action');
      this.btnRefresh.querySelector('.btn-title').textContent = '🔄 Refresh (Finished)';
      this.btnRefresh.querySelector('.btn-sub').textContent = 'All encounters complete';

      this.btnPickup.disabled = g.currentBolts <= 0;
      this.btnPickup.classList.remove('locked-action');
      this.btnPickup.querySelector('.btn-title').textContent = `✋ Pickup (${g.playerDiscard.length})`;
      this.btnPickup.querySelector('.btn-sub').textContent = g.playerDiscard.length > 0 ? 'Return all discard to hand (Costs 1 ⚡)' : 'No cards in discard';
      this.btnPickup.classList.toggle('ready-to-act', g.playerDiscard.length > 0 && g.currentBolts > 0);
    } else if (isFinalAttack) {
      // FINAL ATTACK MODE: Only Attack is available!
      this.btnAttack.disabled = false;
      this.btnAttack.classList.add('final-attack-mode');
      this.btnAttack.classList.toggle('ready-to-act', showMatchMonster);
      this.btnAttack.querySelector('.btn-title').textContent = showMatchMonster ? '⚔️ FINAL ATTACK (🎯 Matched!)' : '⚔️ FINAL ATTACK';
      this.btnAttack.querySelector('.btn-sub').textContent = showMatchMonster ? 'Defeat sea creature & recharge battery!' : `Hit ${fish?.name} 🎯 ${fish?.target} or strand!`;

      this.btnBuy.disabled = true;
      this.btnBuy.classList.add('locked-action');
      this.btnBuy.classList.remove('ready-to-act');
      this.btnBuy.querySelector('.btn-title').textContent = '🛒 Buy (No Battery)';
      this.btnBuy.querySelector('.btn-sub').textContent = 'Unavailable at 0 bolts';

      this.btnRefresh.disabled = true;
      this.btnRefresh.classList.add('locked-action');
      this.btnRefresh.querySelector('.btn-title').textContent = '🔄 Refresh (No Battery)';
      this.btnRefresh.querySelector('.btn-sub').textContent = 'Unavailable at 0 bolts';

      this.btnPickup.disabled = true;
      this.btnPickup.classList.add('locked-action');
      this.btnPickup.classList.remove('ready-to-act');
      this.btnPickup.querySelector('.btn-title').textContent = '✋ Pickup (No Battery)';
      this.btnPickup.querySelector('.btn-sub').textContent = 'Unavailable at 0 bolts';
    } else {
      // NORMAL MODE: All actions available
      this.btnAttack.classList.remove('final-attack-mode');
      this.btnAttack.classList.toggle('ready-to-act', showMatchMonster);
      this.btnAttack.querySelector('.btn-title').textContent = showMatchMonster ? '⚔️ Attack (🎯 Matched!)' : '⚔️ Attack';
      this.btnAttack.querySelector('.btn-sub').textContent = showMatchMonster ? 'Defeat creature & recharge!' : `Hit ${fish?.name} 🎯 ${fish?.target} (Costs 1 ⚡)`;

      this.btnBuy.classList.remove('locked-action');
      if (targetCard && this.selectedTarget) {
        if (this.selectedTarget.type === 'stockpile') {
          this.btnBuy.querySelector('.btn-title').textContent = showMatchTarget
            ? `💎 Claim ${targetCard.label} (🎯 Matched!)`
            : `💎 Claim ${targetCard.label}`;
          this.btnBuy.querySelector('.btn-sub').textContent = showMatchTarget
            ? `Claim +${targetCard.gems} 💎 to Treasure Chest! (Costs 1 ⚡)`
            : `Treasure target is 🎯 ${targetCard.target} (Costs 1 ⚡)`;
        } else {
          this.btnBuy.querySelector('.btn-title').textContent = showMatchTarget
            ? `🛒 Buy ${targetCard.label} (🎯 Matched!)`
            : `🛒 Buy ${targetCard.label}`;
          this.btnBuy.querySelector('.btn-sub').textContent = showMatchTarget
            ? `Ready to acquire into hand! (Costs 1 ⚡)`
            : `Market target is 🎯 ${targetCard.target} (Costs 1 ⚡)`;
        }
      } else {
        this.btnBuy.querySelector('.btn-title').textContent = '🛒 Buy / Claim';
        this.btnBuy.querySelector('.btn-sub').textContent = 'Match a Market card or Treasure target (Costs 1 ⚡)';
      }
      this.btnBuy.classList.toggle('ready-to-act', !!showMatchTarget);

      this.btnRefresh.classList.remove('locked-action');
      this.btnRefresh.querySelector('.btn-title').textContent = '🔄 Market Refresh';
      this.btnRefresh.querySelector('.btn-sub').textContent = 'Discard market & deal 5 new cards (Costs 1 ⚡)';

      this.btnPickup.classList.remove('locked-action');
      this.btnPickup.querySelector('.btn-title').textContent = `✋ Pickup (${g.playerDiscard.length})`;
      this.btnPickup.querySelector('.btn-sub').textContent = g.playerDiscard.length > 0 ? 'Return all discard to hand (Costs 1 ⚡)' : 'No cards in discard yet (Costs 1 ⚡)';
      this.btnPickup.classList.toggle('ready-to-act', g.playerDiscard.length > 0);

      this.btnAttack.disabled = g.status !== 'in_progress';
      this.btnBuy.disabled = g.status !== 'in_progress';
      this.btnRefresh.disabled = g.status !== 'in_progress';
      this.btnPickup.disabled = g.status !== 'in_progress';
    }

    // 7. Pile & Deck Stats
    this.statDrawCount.textContent = g.drawPile.length;
    this.statDiscardCount.textContent = g.drawDiscard.length;
    this.statPlayerDiscardCount.textContent = g.playerDiscard.length;
    this.statHandCount.textContent = g.hand.length;
    if (this.statGemCount) this.statGemCount.textContent = g.totalGems;
    if (this.statStashCount) this.statStashCount.textContent = GameState.getPermanentGems();

    // End run button state
    if (this.btnEndRun) {
      this.btnEndRun.disabled = (g.status === 'won' || g.status === 'lost');
    }

    // 8. Treasure Chest (LHS bottom)
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
          itemEl.title = `${t.category} target (${t.target})`;
          itemEl.innerHTML = `
            <div class="t-corner">💎 ${t.gems}</div>
            <div class="t-gems">${t.label}</div>
            <div class="t-target">🎯 ${t.target}</div>
          `;
          this.treasureCollectedListEl.appendChild(itemEl);
        });
      }
    }

    // 9. Status & Final Attack Banners
    if (isFinalAttack && g.status === 'in_progress') {
      this.finalAttackBannerEl.classList.remove('hidden');
      this.faTargetNumEl.textContent = fish?.target ?? '';
    } else {
      this.finalAttackBannerEl.classList.add('hidden');
    }

    if (isPostGame) {
      this.gameBannerEl.className = 'status-banner victory';
      this.gameBannerEl.innerHTML = `
        <div>🏆 <strong>GREAT WHITE SHARK DEFEATED!</strong> You have <strong>${g.currentBolts} ⚡ bolt${g.currentBolts > 1 ? 's' : ''} remaining</strong>!</div>
        <div class="victory-bonus-box">You may spend remaining bolts to claim any leftover treasures in the stockpile, or hit <strong>End Run</strong> to bank what you have!</div>
        <div style="display: flex; gap: 8px; margin-top: 6px;">
          <button id="btn-banner-end-run" class="btn-primary">⚓ End Run & Bank Haul</button>
        </div>
      `;
      document.getElementById('btn-banner-end-run')?.addEventListener('click', () => {
        this.game.endRun();
        this.render();
      });
    } else if (g.status === 'won') {
      this.gameBannerEl.className = 'status-banner victory';
      const victoryBonusHtml = g.victoryTreasure
        ? `<div class="victory-bonus-box">🏆 Great White Shark Defeated! Final Treasure: <strong>${g.victoryTreasure.label} (🎯 Target ${g.victoryTreasure.target}) +${g.victoryTreasure.gems} 💎</strong> automatically claimed!</div>`
        : '';
      this.gameBannerEl.innerHTML = `
        <div>🏆 <strong>ADVENTURE COMPLETED!</strong> You conquered the underwater world!</div>
        ${victoryBonusHtml}
        <div class="victory-stats">Adventure Score: <strong>💎 ${g.totalGems} Gems</strong> (${g.treasureChest.length} treasures) • Total Legacy Stash: <strong>💎 ${GameState.getPermanentGems()} Gems</strong></div>
        <button id="btn-banner-restart" class="btn-primary" style="margin-top: 8px;">Ride Again</button>
      `;
      document.getElementById('btn-banner-restart')?.addEventListener('click', () => this.btnRestart.click());
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

    // 10. Log Rendering
    this.gameLogEl.innerHTML = g.log.map(item => `
      <div class="log-entry log-${item.type}">
        <span class="log-time">[${item.timestamp}]</span>
        <span class="log-msg">${item.msg}</span>
      </div>
    `).join('');
  }
}

// Instantiate UI once DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
  window.gameUI = new GameUI();
});
