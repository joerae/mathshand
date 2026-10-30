/**
 * UI Renderer and Event Controller for Maths Handbuilder Prototype (v0.8)
 */
import { GameState } from './game.js';
import { FISH_ART } from './fish_art.js';

export class GameUI {
  constructor() {
    this.game = new GameState();
    this.selectedSequence = []; // Array of number cards selected from hand onto workbench
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
    this.replacementPromptText = document.getElementById('replacement-prompt-text');
    this.btnCancelReplacement = document.getElementById('btn-cancel-replacement');

    // Action Buttons
    this.btnAttack = document.getElementById('btn-action-attack');
    this.btnBuy = document.getElementById('btn-action-buy');
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
    // Action Buttons
    this.btnAttack.addEventListener('click', () => this.handleAttack());
    this.btnBuy.addEventListener('click', () => this.handleBuy());
    this.btnRefresh.addEventListener('click', () => this.handleMarketRefresh());
    this.clearSequenceBtn.addEventListener('click', () => this.clearSelection());

    // Card Replacement Cancel Button
    if (this.btnCancelReplacement) {
      this.btnCancelReplacement.addEventListener('click', () => {
        if (this.game.pendingPurchase) {
          this.game.addLog(`Aborted card replacement.`, 'info');
          this.game.pendingPurchase = null;
          this.render();
        }
      });
    }

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
    if (!this.showCalculator) return;

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
        this.selectedTarget = (this.game.status === 'post_game')
          ? { type: 'stockpile', index: stockMatchIdx }
          : { type: 'market', index: marketMatchIdx };
      }
    }
  }

  toggleNumberCardSelection(card) {
    if (this.game.status !== 'in_progress' && this.game.status !== 'post_game') return;

    const cardId = card.uid || card.id;

    // If a card purchase is pending replacement at 7/7 capacity, clicking replaces it!
    if (this.game.pendingPurchase) {
      const repRes = this.game.replaceAndAcquire(cardId);
      if (repRes.success) {
        this.clearSelection();
      }
      this.render();
      return;
    }

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
    if (this.game.status === 'post_game' && type !== 'stockpile') {
      alert('Market purchases are closed after defeating the Great White Shark. Spend your remaining energy claiming stockpile treasures!');
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
        if (this.game.status === 'in_progress') {
          this.game.market.forEach((card, idx) => {
            if (card && card.target === calc.total) {
              matchingMarket.push({ type: 'market', index: idx, card });
            }
          });
        }

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
      if (!res.needsReplacement) {
        this.selectedTarget = null;
      }
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
      if (this.batteryCountTextEl) {
        this.batteryCountTextEl.textContent = `${g.currentBolts} / ${g.maxBolts} Bolts`;
      }
      if (this.statBatteryCount) {
        this.statBatteryCount.textContent = g.currentBolts;
      }

      // Render vector graphic
      if (this.creatureArtEl) {
        this.creatureArtEl.innerHTML = FISH_ART[fish.id] || '';
      }

      // Render 4 double-sided battery cards (v0.8)
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
      if (this.batteryCountTextEl) this.batteryCountTextEl.textContent = '-';
      if (this.batteryCardsRowEl) this.batteryCardsRowEl.innerHTML = '';
      if (this.creatureArtEl) this.creatureArtEl.innerHTML = FISH_ART[5] || '';
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
        slotEl.className = `portrait-card market-card op-${card.op === '×' ? 'mult' : 'add'}`;
        if (isPostGame) {
          slotEl.classList.add('market-card-closed');
          slotEl.style.opacity = '0.45';
          slotEl.style.cursor = 'not-allowed';
        }

        const isSelected = (this.selectedTarget?.type === 'market' && this.selectedTarget?.index === idx);
        const isMatched = this.showCalculator && (this.selectedSequence.length > 0 && calc.total === card.target);

        if (isSelected && !isPostGame) slotEl.classList.add('selected');
        if (isMatched && !isFinalAttack && !isPostGame) slotEl.classList.add('matched');

        let matchBadge = '';
        if (isMatched && !isFinalAttack && !isPostGame) {
          matchBadge = `<div class="card-match-indicator">✨ MATCH! (Click to Buy)</div>`;
        }

        slotEl.innerHTML = `
          <div class="card-corner-top">${card.label}</div>
          <div class="card-center-val">${card.label}</div>
          <div class="card-target-bottom">🎯 ${card.target}</div>
          ${matchBadge}
        `;
        if (!isPostGame) {
          slotEl.addEventListener('click', () => this.selectTarget('market', idx));
        }
      }
      this.marketSlotsEl.appendChild(slotEl);
    });

    // 3. Treasure Stockpile Slots
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

          slotEl.innerHTML = `
            <div class="card-corner-top">💎 ${card.gems}</div>
            <div class="card-center-gems">${card.label}</div>
            <div class="card-target-bottom">🎯 ${card.target}</div>
            ${matchBadge}
          `;
          slotEl.addEventListener('click', () => this.selectTarget('stockpile', idx));
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
        cardEl.className = `portrait-card workbench-card op-${card.op === '×' ? 'mult' : 'add'}`;
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

    // Target comparison feedback
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

    // 5. Hand Display: Number cards are reusable!
    this.handNumberCardsEl.innerHTML = '';
    const isReplacing = !!g.pendingPurchase;

    if (this.handReplacementAlert) {
      if (isReplacing) {
        this.handReplacementAlert.classList.remove('hidden');
        if (this.replacementPromptText) {
          this.replacementPromptText.textContent = `Click any card below to permanently replace it with ${g.pendingPurchase.card.label} (🎯 ${g.pendingPurchase.card.target}).`;
        }
      } else {
        this.handReplacementAlert.classList.add('hidden');
      }
    }

    const selectedIds = new Set(this.selectedSequence.map(c => c.uid || c.id));
    const cardsInHand = isReplacing
      ? g.hand // When replacing, show all cards in hand
      : g.hand.filter(c => !selectedIds.has(c.uid || c.id));

    if (cardsInHand.length === 0) {
      this.handNumberCardsEl.innerHTML = '<div class="empty-hand-hint">All cards from your hand are on the Calculation Workbench. Click any card on the workbench to return it to your hand.</div>';
    } else {
      cardsInHand.forEach(c => {
        const cardEl = document.createElement('div');
        cardEl.className = `portrait-card game-card number-card op-${c.op === '×' ? 'mult' : 'add'}`;
        if (isReplacing) {
          cardEl.classList.add('selectable-for-replacement');
          cardEl.title = `Click to PERMANENTLY REMOVE ${c.label} and add ${g.pendingPurchase.card.label}`;
        } else {
          cardEl.title = 'Click to place this card onto the Calculation Workbench';
        }

        const replaceTag = isReplacing ? `<div class="card-match-indicator" style="background:#d97706;">SCRAP</div>` : '';

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

    // 6. Actions Panel & Button States
    const matchesFish = (fish && calc.total === fish.target && !isPostGame);
    const targetCard = selectedTargetCard;
    const matchesTarget = (targetCard && calc.total === targetCard.target);

    const showMatchMonster = this.showCalculator && matchesFish;
    const showMatchTarget = this.showCalculator && matchesTarget;

    if (isPostGame) {
      // POST-SHARK ENERGY PHASE
      this.btnAttack.disabled = true;
      this.btnAttack.classList.remove('final-attack-mode', 'ready-to-act');
      this.btnAttack.querySelector('.btn-title').textContent = '⚔️ All Fish Defeated!';
      this.btnAttack.querySelector('.btn-sub').textContent = 'Shark conquered!';

      this.btnBuy.classList.remove('locked-action');
      if (targetCard && this.selectedTarget) {
        if (this.selectedTarget.type === 'stockpile') {
          this.btnBuy.querySelector('.btn-title').textContent = showMatchTarget
            ? `💎 Claim ${targetCard.label} (🎯 Matched!)`
            : `💎 Claim ${targetCard.label}`;
          this.btnBuy.querySelector('.btn-sub').textContent = showMatchTarget
            ? `Claim +${targetCard.gems} 💎 to Treasure Chest! (Costs 1 ⚡)`
            : `Treasure target is 🎯 ${targetCard.target} (Costs 1 ⚡)`;
        }
      } else {
        this.btnBuy.querySelector('.btn-title').textContent = '💎 Claim Treasure';
        this.btnBuy.querySelector('.btn-sub').textContent = `Spend remaining bolts (${g.currentBolts} ⚡) on stockpile treasures`;
      }
      this.btnBuy.disabled = g.currentBolts <= 0 || isReplacing;
      this.btnBuy.classList.toggle('ready-to-act', !!showMatchTarget && g.currentBolts > 0 && !isReplacing);

      this.btnRefresh.disabled = true;
      this.btnRefresh.classList.add('locked-action');
      this.btnRefresh.querySelector('.btn-title').textContent = '🔄 Market Closed';
      this.btnRefresh.querySelector('.btn-sub').textContent = 'Encounters complete';
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
    } else {
      // NORMAL COMBAT MODE
      this.btnAttack.classList.remove('final-attack-mode');
      this.btnAttack.classList.toggle('ready-to-act', showMatchMonster && !isReplacing);
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
      this.btnBuy.classList.toggle('ready-to-act', !!showMatchTarget && !isReplacing);

      this.btnRefresh.classList.remove('locked-action');
      this.btnRefresh.querySelector('.btn-title').textContent = '🔄 Market Refresh';
      this.btnRefresh.querySelector('.btn-sub').textContent = 'Discard market & deal 5 new cards (Costs 1 ⚡)';

      this.btnAttack.disabled = g.status !== 'in_progress' || isReplacing;
      this.btnBuy.disabled = g.status !== 'in_progress' || isReplacing;
      this.btnRefresh.disabled = g.status !== 'in_progress' || isReplacing;
    }

    // 7. Stats Bar
    this.statDrawCount.textContent = g.drawPile.length;
    this.statDiscardCount.textContent = g.drawDiscard.length;
    this.statHandCount.textContent = g.hand.length;
    if (this.statGemCount) this.statGemCount.textContent = g.totalGems;
    if (this.statStashCount) this.statStashCount.textContent = GameState.getPermanentGems();

    if (this.btnEndRun) {
      this.btnEndRun.disabled = (g.status === 'won' || g.status === 'lost');
    }

    // 8. Treasure Chest
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
        <div>🏆 <strong>GREAT WHITE SHARK DEFEATED!</strong> Scooter battery refilled (<strong>${g.currentBolts}/${g.maxBolts} ⚡</strong>).</div>
        <div class="victory-bonus-box">Spend your remaining energy claiming any remaining treasures in the stockpile, or conclude your adventure to bank your gems!</div>
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
        <div>🏆 <strong>ADVENTURE COMPLETED!</strong> You conquered the underwater world!</div>
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
