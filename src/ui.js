/**
 * UI Renderer and Event Controller for Maths Handbuilder Prototype (v0.6)
 */
import { GameState } from './game.js';

export class GameUI {
  constructor() {
    this.game = new GameState();
    this.selectedSequence = []; // Array of number cards selected from hand
    this.selectedTarget = null; // { type: 'market' | 'stockpile', index: number } | null

    this.cacheElements();
    this.bindEvents();
    this.render();
  }

  cacheElements() {
    // Monster Elements
    this.monsterNameEl = document.getElementById('monster-name');
    this.monsterTargetEl = document.getElementById('monster-target');
    this.monsterDoomEl = document.getElementById('monster-doom');
    this.monsterDoomBarEl = document.getElementById('monster-doom-bar');

    // Market & Stockpile Elements (RHS)
    this.marketSlotsEl = document.getElementById('market-slots');
    this.stockpileSlotsEl = document.getElementById('stockpile-slots');

    // Formula & Running Calculation Elements
    this.formulaChainEl = document.getElementById('formula-chain');
    this.runningTotalEl = document.getElementById('running-total');
    this.formulaComparisonEl = document.getElementById('formula-comparison');
    this.clearSequenceBtn = document.getElementById('btn-clear-seq');

    // Hand & Discard Elements (LHS)
    this.handNumberCardsEl = document.getElementById('hand-number-cards');
    this.discardPreviewCountEl = document.getElementById('discard-preview-count');
    this.discardPreviewCardsEl = document.getElementById('discard-preview-cards');

    // Action Buttons
    this.btnAttack = document.getElementById('btn-action-attack');
    this.btnBuy = document.getElementById('btn-action-buy');
    this.btnRefresh = document.getElementById('btn-action-refresh');
    this.btnPickup = document.getElementById('btn-action-pickup');

    // Info & Pile stats
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
    this.debugAddDoomBtn = document.getElementById('debug-add-doom');
    this.debugSubDoomBtn = document.getElementById('debug-sub-doom');
    this.debugRevealTreasureBtn = document.getElementById('debug-reveal-treasure');
    this.debugAddCardBtn = document.getElementById('debug-add-card-btn');
    this.debugOpInput = document.getElementById('debug-card-op');
    this.debugValInput = document.getElementById('debug-card-val');
    this.btnRestart = document.getElementById('btn-restart');
  }

  bindEvents() {
    // Action Buttons
    this.btnAttack.addEventListener('click', () => this.handleAttack());
    this.btnBuy.addEventListener('click', () => this.handleBuy());
    this.btnRefresh.addEventListener('click', () => this.handleMarketRefresh());
    this.btnPickup.addEventListener('click', () => this.handlePickup());
    this.clearSequenceBtn.addEventListener('click', () => this.clearSelection());

    // Restart
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
    this.debugAddDoomBtn.addEventListener('click', () => {
      this.game.debugAdjustDoom(1);
      this.render();
    });
    this.debugSubDoomBtn.addEventListener('click', () => {
      this.game.debugAdjustDoom(-1);
      this.render();
    });
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
    if (this.selectedTarget !== null) {
      const current = (this.selectedTarget.type === 'stockpile')
        ? this.game.treasureStockpile[this.selectedTarget.index]
        : this.game.market[this.selectedTarget.index];
      if (current && current.target === calcTotal) return;
    }

    if (this.selectedSequence.length > 0) {
      const marketMatchIdx = this.game.market.findIndex(c => c && c.target === calcTotal);
      const stockMatchIdx = this.game.treasureStockpile.findIndex(c => c && c.target === calcTotal);

      if (marketMatchIdx !== -1 && stockMatchIdx === -1) {
        this.selectedTarget = { type: 'market', index: marketMatchIdx };
      } else if (stockMatchIdx !== -1 && marketMatchIdx === -1) {
        this.selectedTarget = { type: 'stockpile', index: stockMatchIdx };
      } else if (marketMatchIdx !== -1 && stockMatchIdx !== -1 && !this.selectedTarget) {
        this.selectedTarget = { type: 'market', index: marketMatchIdx };
      }
    }
  }

  toggleNumberCardSelection(card) {
    if (this.game.status !== 'in_progress') return;

    const cardId = card.uid || card.id;
    const existingIndex = this.selectedSequence.findIndex(c => (c.uid || c.id) === cardId);

    if (existingIndex >= 0) {
      this.selectedSequence.splice(existingIndex, 1);
    } else {
      this.selectedSequence.push(card);
    }

    const calc = GameState.calculateSequence(this.selectedSequence);
    this.autoSelectMatchingTarget(calc.total);

    this.render();
  }

  selectTarget(type, index) {
    if (this.game.status !== 'in_progress') return;
    if (this.game.isFinalAttack) {
      alert('Final Attack is active! Only Attack is available.');
      return;
    }

    const card = (type === 'stockpile')
      ? this.game.treasureStockpile[index]
      : this.game.market[index];
    if (!card) return;

    if (this.selectedTarget && this.selectedTarget.type === type && this.selectedTarget.index === index) {
      const calc = GameState.calculateSequence(this.selectedSequence);
      if (calc.total === card.target) {
        this.handleBuy();
        return;
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
    if (this.game.status !== 'in_progress') return;

    if (this.game.isFinalAttack) {
      alert('Final Attack is active! No other actions are available. You must Attack the monster now!');
      return;
    }

    const calc = GameState.calculateSequence(this.selectedSequence);

    if (this.selectedTarget === null) {
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
        alert('Multiple targets match your total! Please click on the specific Market card or Stockpile treasure to buy/claim it.');
        return;
      } else {
        alert(`Your calculation total is ${calc.total}, but no target matches it. Click on a Market card or Stockpile treasure (e.g. 🎯 ${calc.total}) to target it.`);
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
      alert('Final Attack is active! No other actions are available. You must Attack the monster now!');
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
    if (this.game.status !== 'in_progress') return;

    if (this.game.isFinalAttack) {
      alert('Final Attack is active! No other actions are available. You must Attack the monster now!');
      return;
    }

    this.game.playPickup();
    this.render();
  }

  render() {
    const g = this.game;
    const monster = g.currentMonster;
    const calc = GameState.calculateSequence(this.selectedSequence);
    const isFinalAttack = g.isFinalAttack;

    // 1. Monster Info
    if (monster) {
      this.monsterNameEl.textContent = `Monster ${g.currentMonsterIndex + 1}/${g.monstersList.length}: ${monster.name}`;
      this.monsterTargetEl.textContent = monster.target;
      this.monsterDoomEl.textContent = `${g.currentDoom} / ${monster.doomLimit}`;

      // Doom visual pips
      let pips = '';
      for (let i = 0; i < monster.doomLimit; i++) {
        if (i < g.currentDoom) {
          pips += '<span class="pip active">☠</span>';
        } else {
          pips += '<span class="pip empty">○</span>';
        }
      }
      this.monsterDoomBarEl.innerHTML = pips;
    } else {
      this.monsterNameEl.textContent = 'All Monsters Defeated!';
      this.monsterTargetEl.textContent = '-';
      this.monsterDoomEl.textContent = '-';
      this.monsterDoomBarEl.innerHTML = '';
    }

    // Auto-select target if calculation matches
    this.autoSelectMatchingTarget(calc.total);

    // 2. Market Slots (5 Number cards only)
    this.marketSlotsEl.innerHTML = '';
    g.market.forEach((card, idx) => {
      const slotEl = document.createElement('div');
      slotEl.className = 'market-card';

      if (!card) {
        slotEl.classList.add('empty');
        slotEl.innerHTML = `<span class="empty-label">Empty Slot</span><span class="sub">(Use Refresh)</span>`;
      } else {
        const isSelected = (this.selectedTarget?.type === 'market' && this.selectedTarget?.index === idx);
        const isMatched = (this.selectedSequence.length > 0 && calc.total === card.target);

        if (isSelected) slotEl.classList.add('selected');
        if (isMatched && !isFinalAttack) slotEl.classList.add('matched');

        let matchBadge = '';
        if (isMatched && !isFinalAttack) {
          matchBadge = `<div class="card-match-indicator">✨ MATCH! (Click to Buy)</div>`;
        }

        slotEl.innerHTML = `
          <div class="card-op-badge">${card.label}</div>
          <div class="card-target-badge ${card.target < 0 ? 'neg-target' : ''}">🎯 Target: ${card.target}</div>
          <div class="card-type-sub">Number</div>
          ${matchBadge}
        `;
        slotEl.addEventListener('click', () => this.selectTarget('market', idx));
      }
      this.marketSlotsEl.appendChild(slotEl);
    });

    // 3. Treasure Stockpile Slots (Revealed by monsters 1–5)
    if (this.stockpileSlotsEl) {
      this.stockpileSlotsEl.innerHTML = '';
      if (g.treasureStockpile.length === 0) {
        this.stockpileSlotsEl.innerHTML = '<span class="empty-stockpile-hint">Stockpile is empty. Defeat monsters 1–5 to reveal treasure cards here!</span>';
      } else {
        g.treasureStockpile.forEach((card, idx) => {
          const slotEl = document.createElement('div');
          slotEl.className = 'stockpile-card';

          const isSelected = (this.selectedTarget?.type === 'stockpile' && this.selectedTarget?.index === idx);
          const isMatched = (this.selectedSequence.length > 0 && calc.total === card.target);

          if (isSelected) slotEl.classList.add('selected');
          if (isMatched && !isFinalAttack) slotEl.classList.add('matched');

          let matchBadge = '';
          if (isMatched && !isFinalAttack) {
            matchBadge = `<div class="card-match-indicator">✨ MATCH! (Click to Claim)</div>`;
          }

          slotEl.innerHTML = `
            <div class="card-op-badge">${card.label}</div>
            <div class="card-target-badge ${card.target < 0 ? 'neg-target' : ''}">🎯 Target: ${card.target}</div>
            <div class="card-category-sub">${card.category} (${card.gems} 💎)</div>
            ${matchBadge}
          `;
          slotEl.addEventListener('click', () => this.selectTarget('stockpile', idx));
          this.stockpileSlotsEl.appendChild(slotEl);
        });
      }
    }

    // 4. Live Sequence Calculation Workbench
    this.runningTotalEl.textContent = calc.total;

    this.formulaChainEl.innerHTML = '';
    if (this.selectedSequence.length === 0) {
      this.formulaChainEl.innerHTML = '<span class="placeholder">Click number cards in your hand to build your calculation (starts at 0)</span>';
    } else {
      let chainHtml = '<span class="seq-token zero">0</span>';
      calc.steps.forEach((step, idx) => {
        chainHtml += `
          <span class="seq-arrow">→</span>
          <span class="seq-token step" data-idx="${idx}" title="Click to remove">
            ${step.card.label} <small>(${step.result})</small>
          </span>
        `;
      });
      this.formulaChainEl.innerHTML = chainHtml;

      this.formulaChainEl.querySelectorAll('.seq-token.step').forEach(tokenEl => {
        tokenEl.addEventListener('click', (e) => {
          const idx = parseInt(e.currentTarget.getAttribute('data-idx'), 10);
          this.selectedSequence.splice(idx, 1);
          const newCalc = GameState.calculateSequence(this.selectedSequence);
          this.autoSelectMatchingTarget(newCalc.total);
          this.render();
        });
      });
    }

    // Target comparison feedback
    let comparisonText = '';
    const selectedTargetCard = this.selectedTarget !== null
      ? (this.selectedTarget.type === 'stockpile' ? g.treasureStockpile[this.selectedTarget.index] : g.market[this.selectedTarget.index])
      : null;

    if (monster && calc.total === monster.target) {
      const alertLabel = isFinalAttack ? '🚨 MATCHES FINAL ATTACK TARGET! Attack now to survive!' : '🎯 Matches Monster Target! Ready to Attack!';
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
      if (monster) targets.push(`Monster: ${monster.target}`);
      if (selectedTargetCard && !isFinalAttack) targets.push(`Target: ${selectedTargetCard.target}`);
      comparisonText = `<span class="badge-mismatch">Current Total: ${calc.total} ${targets.length ? `(Targets: ${targets.join(', ')})` : ''}</span>`;
    }
    this.formulaComparisonEl.innerHTML = comparisonText;

    // 5. Hand Display (Number Cards only)
    this.handNumberCardsEl.innerHTML = '';
    const selectedIds = new Set(this.selectedSequence.map(c => c.uid || c.id));
    
    if (g.hand.length === 0) {
      this.handNumberCardsEl.innerHTML = '<div class="empty-hand-hint">Hand is empty! Play <strong>✋ Pickup</strong> to recover your played cards.</div>';
    } else {
      g.hand.forEach(c => {
        const cardId = c.uid || c.id;
        const isSelected = selectedIds.has(cardId);
        const cardEl = document.createElement('div');
        cardEl.className = `game-card number-card op-${c.op === '×' ? 'mult' : (c.op === '-' ? 'sub' : 'add')}`;
        
        if (isSelected) {
          cardEl.classList.add('selected');
          const seqIndex = this.selectedSequence.findIndex(item => (item.uid || item.id) === cardId) + 1;
          cardEl.innerHTML = `
            <div class="card-badge">#${seqIndex}</div>
            <div class="card-value">${c.label}</div>
            <div class="card-sub-target">🎯 ${c.target}</div>
          `;
        } else {
          cardEl.innerHTML = `
            <div class="card-value">${c.label}</div>
            <div class="card-sub-target">🎯 ${c.target}</div>
          `;
        }

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
    const matchesMonster = (monster && calc.total === monster.target);
    const targetCard = selectedTargetCard;
    const matchesTarget = (targetCard && calc.total === targetCard.target);

    if (isFinalAttack) {
      // FINAL ATTACK MODE: Only Attack is available!
      this.btnAttack.disabled = false;
      this.btnAttack.classList.add('final-attack-mode');
      this.btnAttack.classList.toggle('ready-to-act', matchesMonster);
      this.btnAttack.querySelector('.btn-title').textContent = matchesMonster ? '⚔️ FINAL ATTACK (🎯 Matched!)' : '⚔️ FINAL ATTACK';
      this.btnAttack.querySelector('.btn-sub').textContent = matchesMonster ? 'Defeat monster on the brink of doom!' : `Hit Monster 🎯 ${monster?.target} or lose!`;

      // Buy, Refresh, Pickup locked during Final Attack
      this.btnBuy.disabled = true;
      this.btnBuy.classList.add('locked-action');
      this.btnBuy.classList.remove('ready-to-act');
      this.btnBuy.querySelector('.btn-title').textContent = '🛒 Buy (Locked)';
      this.btnBuy.querySelector('.btn-sub').textContent = 'Unavailable during Final Attack';

      this.btnRefresh.disabled = true;
      this.btnRefresh.classList.add('locked-action');
      this.btnRefresh.querySelector('.btn-title').textContent = '🔄 Refresh (Locked)';
      this.btnRefresh.querySelector('.btn-sub').textContent = 'Unavailable during Final Attack';

      this.btnPickup.disabled = true;
      this.btnPickup.classList.add('locked-action');
      this.btnPickup.classList.remove('ready-to-act');
      this.btnPickup.querySelector('.btn-title').textContent = '✋ Pickup (Locked)';
      this.btnPickup.querySelector('.btn-sub').textContent = 'Unavailable during Final Attack';
    } else {
      // NORMAL MODE: All actions available
      this.btnAttack.classList.remove('final-attack-mode');
      this.btnAttack.classList.toggle('ready-to-act', matchesMonster);
      this.btnAttack.querySelector('.btn-title').textContent = matchesMonster ? '⚔️ Attack (🎯 Matched!)' : '⚔️ Attack';
      this.btnAttack.querySelector('.btn-sub').textContent = matchesMonster ? 'Ready to defeat monster!' : `Hit Monster 🎯 ${monster?.target}`;

      this.btnBuy.classList.remove('locked-action');
      if (targetCard && this.selectedTarget) {
        if (this.selectedTarget.type === 'stockpile') {
          this.btnBuy.querySelector('.btn-title').textContent = matchesTarget
            ? `💎 Claim ${targetCard.label} (🎯 Matched!)`
            : `💎 Claim ${targetCard.label}`;
          this.btnBuy.querySelector('.btn-sub').textContent = matchesTarget
            ? `Claim +${targetCard.gems} 💎 to Treasure Chest!`
            : `Treasure target is 🎯 ${targetCard.target}`;
        } else {
          this.btnBuy.querySelector('.btn-title').textContent = matchesTarget
            ? `🛒 Buy ${targetCard.label} (🎯 Matched!)`
            : `🛒 Buy ${targetCard.label}`;
          this.btnBuy.querySelector('.btn-sub').textContent = matchesTarget
            ? `Ready to acquire ${targetCard.label} into hand!`
            : `Market target is 🎯 ${targetCard.target}`;
        }
      } else {
        this.btnBuy.querySelector('.btn-title').textContent = '🛒 Buy / Claim';
        this.btnBuy.querySelector('.btn-sub').textContent = 'Match a Market card or Treasure target';
      }
      this.btnBuy.classList.toggle('ready-to-act', !!matchesTarget);

      this.btnRefresh.classList.remove('locked-action');
      this.btnRefresh.querySelector('.btn-title').textContent = '🔄 Market Refresh';
      this.btnRefresh.querySelector('.btn-sub').textContent = 'Discard market & deal 5 new cards';

      this.btnPickup.classList.remove('locked-action');
      this.btnPickup.querySelector('.btn-title').textContent = `✋ Pickup (${g.playerDiscard.length})`;
      this.btnPickup.querySelector('.btn-sub').textContent = g.playerDiscard.length > 0 ? 'Return all discard to hand' : 'No cards in discard yet';
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
        this.treasureCollectedListEl.innerHTML = '<span class="placeholder-sm">No treasure collected yet. Defeat monsters and match stockpile targets to claim gems!</span>';
      } else {
        g.treasureChest.forEach(t => {
          const itemEl = document.createElement('div');
          itemEl.className = 'treasure-chest-item';
          itemEl.title = `${t.category} target (${t.target})`;
          itemEl.innerHTML = `
            <span class="t-gems">${t.label}</span>
            <span class="t-target">🎯 ${t.target}</span>
          `;
          this.treasureCollectedListEl.appendChild(itemEl);
        });
      }
    }

    // 9. Status & Final Attack Banners
    if (isFinalAttack && g.status === 'in_progress') {
      this.finalAttackBannerEl.classList.remove('hidden');
      this.faTargetNumEl.textContent = monster?.target ?? '';
    } else {
      this.finalAttackBannerEl.classList.add('hidden');
    }

    if (g.status === 'won') {
      this.gameBannerEl.className = 'status-banner victory';
      const victoryBonusHtml = g.victoryTreasure
        ? `<div class="victory-bonus-box">🏆 Final Monster Bonus: <strong>${g.victoryTreasure.label} (🎯 Target ${g.victoryTreasure.target}) +${g.victoryTreasure.gems} 💎</strong> automatically claimed!</div>`
        : '';
      this.gameBannerEl.innerHTML = `
        <div>🏆 <strong>VICTORY!</strong> All monsters defeated!</div>
        ${victoryBonusHtml}
        <div class="victory-stats">Run Score: <strong>💎 ${g.totalGems} Gems</strong> (${g.treasureChest.length} treasures) • Total Legacy Stash: <strong>💎 ${GameState.getPermanentGems()} Gems</strong></div>
        <button id="btn-banner-restart" class="btn-primary" style="margin-top: 8px;">Play Again</button>
      `;
      document.getElementById('btn-banner-restart')?.addEventListener('click', () => this.btnRestart.click());
    } else if (g.status === 'lost') {
      this.gameBannerEl.className = 'status-banner gameover';
      this.gameBannerEl.innerHTML = `
        <div>☠️ <strong>DEFEAT:</strong> ${g.statusMessage}</div>
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
