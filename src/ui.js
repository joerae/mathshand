/**
 * UI Renderer and Event Controller for Maths Handbuilder Prototype (v0.5)
 */
import { GameState } from './game.js';

export class GameUI {
  constructor() {
    this.game = new GameState();
    this.selectedSequence = []; // Array of number cards selected from hand
    this.selectedMarketIndex = null; // Index of selected card in market

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

    // Market Elements
    this.marketSlotsEl = document.getElementById('market-slots');

    // Formula & Running Calculation Elements
    this.formulaChainEl = document.getElementById('formula-chain');
    this.runningTotalEl = document.getElementById('running-total');
    this.formulaComparisonEl = document.getElementById('formula-comparison');
    this.clearSequenceBtn = document.getElementById('btn-clear-seq');

    // Hand & Discard Elements
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

    // Log & Status
    this.gameLogEl = document.getElementById('game-log');
    this.gameBannerEl = document.getElementById('game-status-banner');
    this.finalAttackBannerEl = document.getElementById('final-attack-banner');
    this.faTargetNumEl = document.getElementById('fa-target-num');

    // Debug Controls
    this.debugSkipBtn = document.getElementById('debug-skip-monster');
    this.debugAddDoomBtn = document.getElementById('debug-add-doom');
    this.debugSubDoomBtn = document.getElementById('debug-sub-doom');
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
      this.selectedMarketIndex = null;
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

  autoSelectMatchingMarketCard(calcTotal) {
    if (this.selectedMarketIndex !== null) {
      const current = this.game.market[this.selectedMarketIndex];
      if (current && current.target === calcTotal) return;
    }

    if (this.selectedSequence.length > 0) {
      const matchIdx = this.game.market.findIndex(c => c && c.target === calcTotal);
      if (matchIdx !== -1) {
        this.selectedMarketIndex = matchIdx;
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
    this.autoSelectMatchingMarketCard(calc.total);

    this.render();
  }

  selectMarketCard(index) {
    if (this.game.status !== 'in_progress') return;
    if (this.game.isFinalAttack) {
      alert('Final Attack is active! Only Attack is available.');
      return;
    }

    const card = this.game.market[index];
    if (!card) return;

    if (this.selectedMarketIndex === index) {
      const calc = GameState.calculateSequence(this.selectedSequence);
      if (calc.total === card.target) {
        this.handleBuy();
        return;
      }
      this.selectedMarketIndex = null;
    } else {
      this.selectedMarketIndex = index;
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

    if (this.selectedMarketIndex === null) {
      const matchingIndices = [];
      this.game.market.forEach((card, idx) => {
        if (card && card.target === calc.total) {
          matchingIndices.push(idx);
        }
      });

      if (matchingIndices.length === 1) {
        this.selectedMarketIndex = matchingIndices[0];
      } else if (matchingIndices.length > 1) {
        alert('Multiple market cards match your calculation total! Please click on the specific card in the market you want to buy.');
        return;
      } else {
        alert(`Your calculation total is ${calc.total}, but no market card was selected. Click on a card in the market (e.g. 🎯 ${calc.total}) to target it for purchase.`);
        return;
      }
    }

    const res = this.game.playBuy(this.selectedMarketIndex, this.selectedSequence);
    if (res.success) {
      this.clearSelection();
      this.selectedMarketIndex = null;
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
      this.selectedMarketIndex = null;
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

    // Auto-select market card if matching
    this.autoSelectMatchingMarketCard(calc.total);

    // 2. Market Slots
    this.marketSlotsEl.innerHTML = '';
    g.market.forEach((card, idx) => {
      const slotEl = document.createElement('div');
      slotEl.className = 'market-card';

      if (!card) {
        slotEl.classList.add('empty');
        slotEl.innerHTML = `<span class="empty-label">Empty Slot</span><span class="sub">(Use Refresh)</span>`;
      } else {
        const isSelected = (this.selectedMarketIndex === idx);
        const isMatched = (this.selectedSequence.length > 0 && calc.total === card.target);

        if (isSelected) slotEl.classList.add('selected');
        if (isMatched && !isFinalAttack) slotEl.classList.add('matched');

        let matchBadge = '';
        if (isMatched && !isFinalAttack) {
          matchBadge = `<div class="card-match-indicator">✨ MATCH! (Click to Buy)</div>`;
        }

        slotEl.innerHTML = `
          <div class="card-op-badge">${card.label}</div>
          <div class="card-target-badge">🎯 Target: ${card.target}</div>
          <div class="card-type-sub">Number</div>
          ${matchBadge}
        `;
        slotEl.addEventListener('click', () => this.selectMarketCard(idx));
      }
      this.marketSlotsEl.appendChild(slotEl);
    });

    // 3. Live Sequence Calculation Workbench
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
          this.autoSelectMatchingMarketCard(newCalc.total);
          this.render();
        });
      });
    }

    // Target comparison feedback
    let comparisonText = '';
    const selectedMarketCard = this.selectedMarketIndex !== null ? g.market[this.selectedMarketIndex] : null;

    if (monster && calc.total === monster.target) {
      const alertLabel = isFinalAttack ? '🚨 MATCHES FINAL ATTACK TARGET! Attack now to survive!' : '🎯 Matches Monster Target! Ready to Attack!';
      comparisonText += `<span class="badge-match monster">${alertLabel}</span> `;
    }
    if (selectedMarketCard && calc.total === selectedMarketCard.target && !isFinalAttack) {
      comparisonText += `<span class="badge-match market">🛒 Matches Market Card (${selectedMarketCard.label}, 🎯 ${selectedMarketCard.target})! Ready to Buy!</span> `;
    }
    if (!comparisonText && this.selectedSequence.length > 0) {
      const targets = [];
      if (monster) targets.push(`Monster: ${monster.target}`);
      if (selectedMarketCard && !isFinalAttack) targets.push(`Market: ${selectedMarketCard.target}`);
      comparisonText = `<span class="badge-mismatch">Current Total: ${calc.total} ${targets.length ? `(Targets: ${targets.join(', ')})` : ''}</span>`;
    }
    this.formulaComparisonEl.innerHTML = comparisonText;

    // 4. Hand Display (Number Cards only in v0.5)
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

    // 5. Actions Panel & Button States
    const matchesMonster = (monster && calc.total === monster.target);
    const targetCard = this.selectedMarketIndex !== null ? g.market[this.selectedMarketIndex] : null;
    const matchesMarket = (targetCard && calc.total === targetCard.target);

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
      if (targetCard) {
        this.btnBuy.querySelector('.btn-title').textContent = matchesMarket ? `🛒 Buy ${targetCard.label} (🎯 Matched!)` : `🛒 Buy ${targetCard.label}`;
        this.btnBuy.querySelector('.btn-sub').textContent = matchesMarket ? 'Ready to acquire into hand!' : `Target is 🎯 ${targetCard.target}`;
      } else {
        this.btnBuy.querySelector('.btn-title').textContent = '🛒 Buy';
        this.btnBuy.querySelector('.btn-sub').textContent = 'Hit selected card 🎯 to gain it';
      }
      this.btnBuy.classList.toggle('ready-to-act', !!matchesMarket);

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

    // 6. Pile & Deck Stats
    this.statDrawCount.textContent = g.drawPile.length;
    this.statDiscardCount.textContent = g.drawDiscard.length;
    this.statPlayerDiscardCount.textContent = g.playerDiscard.length;
    this.statHandCount.textContent = g.hand.length;

    // 7. Status & Final Attack Banners
    if (isFinalAttack && g.status === 'in_progress') {
      this.finalAttackBannerEl.classList.remove('hidden');
      this.faTargetNumEl.textContent = monster?.target ?? '';
    } else {
      this.finalAttackBannerEl.classList.add('hidden');
    }

    if (g.status === 'won') {
      this.gameBannerEl.className = 'status-banner victory';
      this.gameBannerEl.innerHTML = `🏆 <strong>VICTORY!</strong> All monsters defeated! <button id="btn-banner-restart">Play Again</button>`;
      document.getElementById('btn-banner-restart')?.addEventListener('click', () => this.btnRestart.click());
    } else if (g.status === 'lost') {
      this.gameBannerEl.className = 'status-banner gameover';
      this.gameBannerEl.innerHTML = `☠️ <strong>DEFEAT:</strong> ${g.statusMessage} <button id="btn-banner-restart">Try Again</button>`;
      document.getElementById('btn-banner-restart')?.addEventListener('click', () => this.btnRestart.click());
    } else {
      this.gameBannerEl.className = 'status-banner hidden';
      this.gameBannerEl.innerHTML = '';
    }

    // 8. Log Rendering
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
