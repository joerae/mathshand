# Maths Handbuilder — Playable Rules Prototype (v0.6)

A light, fast-to-iterate playable card game prototype based on [`Design Docs/# Maths Handbuilder WIP.md`](./Design%20Docs/%23%20Maths%20Handbuilder%20WIP.md).

Built with zero-dependency Vanilla JS/HTML/CSS so you can rapidly test, tune card distributions, tweak monster stats, and iterate on mechanics without build steps or complex dependencies.

---

## 🚀 Quick Start

1. Start the local server:
   ```bash
   npm start
   ```
   *(or run `node server.js` directly)*
2. Open your web browser to:
   ```
   http://localhost:3000
   ```
   *(You can also double-click `index.html` directly in a browser)*

---

## 📁 Easy-to-Edit Data Files

All balance, card distributions, starting hand compositions, and monster progression are isolated in clean, plain JavaScript data files:

### 1. `data/cards.js`
- **`STARTING_HAND`**: The 3 cards the player begins with (+1, +2, +3).
- **`DRAW_PILE_DISTRIBUTION`**: Card counts and ranges for the 66-card number draw pile:
  - `+1 to +4` (5 copies each = 20)
  - `+5 to +9` (3 copies each = 15)
  - `−1 to −4` (3 copies each = 12)
  - `×2 to ×4` (3 copies each = 9)
  - `×5 to ×9` (2 copies each = 10)
  - **Total**: 66 number cards.
- **`GAME_CONFIG`**: Market size (default: 5 number cards).

### 2. `data/monsters.js`
- **`MONSTERS`**: The sequence of 6 enemies with:
  - `target`: The exact target number required to defeat the monster (positive or negative).
  - `doomLimit`: Number of actions before the final chance.

### 3. `data/treasures.js`
- **`TREASURE_CARDS`**: 19 curated treasure cards kept in a separate deck:
  - **Negative targets** (e.g. -4, -6, -8, -10, -12)
  - **Square targets** (e.g. 4, 9, 16, 25, 36, 49, 64, 81)
  - **Highly composite targets** (e.g. 12, 18, 24, 30, 48, 60)
  - **Gems**: 1, 2, or 3 gems (💎) depending on target difficulty.

---

## 🎮 How to Play the Prototype (v0.6 Rules)

1. **Building Sequences:**
   - Calculations start at **0**.
   - Click number cards from your hand to chain them in the order played (e.g. `0 → +8 → -1 → ×8 = 56`).
   - Click any card token in the workbench or click **✕ Clear Selection** to reset.

2. **Actions (Always Available • Each costs 1 Doom):**
   - **⚔️ Attack**: Make the monster's 🎯 target to defeat it.
   - **🛒 Buy / Claim**: Make a market number card's 🎯 target to add it to your hand, OR make a stockpile treasure's 🎯 target to claim its gems into your Treasure Chest.
   - **🔄 Market Refresh**: Replace the market with five new number cards from the draw pile.
   - **✋ Pickup**: Return all played cards from your discard pile to your hand.

3. **💎 Treasure Stockpile & Boss Rewards:**
   - Defeating monsters 1–5 reveals 1 random treasure card into the **Treasure Stockpile**.
   - Multiple treasures accumulate in the stockpile if not immediately claimed.
   - Claiming a treasure costs 1 Doom and discards played numbers just like buying from the market, adding the treasure's gems to your run and permanent stash.
   - Defeating the final monster (Monster 6) automatically awards 1 final random treasure's gems and wins the run.

4. **💎 Permanent Legacy Gems:**
   - All gems earned during a run (via claiming treasure or final victory bonus) are stored permanently in browser storage, persisting across wins and losses.
   - *(Note: Linear mystery unlock cards will be introduced in a future milestone; the core prototype currently tracks total legacy stash).*

5. **🚨 Final Attack:**
   - When Doom reaches a monster's limit, the player gets one final Attack.
   - A successful Attack defeats the monster and resets Doom to 0.
   - A failed Attack ends the game in defeat.
   - No other actions (Buy, Market Refresh, Pickup) are available during Final Attack.

6. **⚙️ Rules Tuning & Debug Panel:**
   - Expand the **"Rules Tuning & Debug Tools"** panel at the bottom of the screen to:
     - Skip to any monster.
     - Add or subtract Doom counters to test Final Attack.
     - Reveal a treasure directly into the stockpile.
     - Spawn specific number cards directly into your hand to test combinations.

---

## 🧪 Automated Rule Tests

Run the test suite to verify card counts, math order, action rules, stockpile mechanics, and victory bonus conditions:
```bash
npm test
```

## Don't add extraneous text
Please don't add text fields into the prototype with "helper" text or comments unless asked. E.g. I don't need it to say "Good opportunity to develop your hand" when Doom is low.
