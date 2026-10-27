# Maths Handbuilder — Playable Rules Prototype (v0.7)

*A roguelike handbuilding card game where maths powers your underwater electric scooter adventure.*

Based on [`Design Docs/# Maths Handbuilder WIP.md`](./Design%20Docs/%23%20Maths%20Handbuilder%20WIP.md).

Built with zero-dependency Vanilla JS/HTML/CSS so you can rapidly test, tune card distributions, tweak fish stats, and iterate on mechanics without build steps or complex dependencies.

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

All balance, card distributions, starting hand compositions, and encounter progression are isolated in clean, plain JavaScript data files:

### 1. `data/cards.js`
- **`STARTING_HAND`**: The 3 cards the player begins with (+1, +2, +3).
- **`DRAW_PILE_DISTRIBUTION`**: Card counts and ranges for the 66-card number draw pile:
  - `+1 to +4` (5 copies each = 20)
  - `+5 to +9` (3 copies each = 15)
  - `−1 to −4` (3 copies each = 12)
  - `×2 to ×4` (3 copies each = 9)
  - `×5 to ×9` (2 copies each = 10)
  - **Total**: 66 number cards (no doom counters).
- **`GAME_CONFIG`**: Market size (default: 5 number cards).

### 2. `data/monsters.js`
- **`MONSTERS` / `FISH_ENCOUNTERS`**: The sequence of 6 sea creature encounters:
  1. **Chainsaw Clownfish**: 🎯 10, ⚡ Recharge: +4
  2. **Electric Eel**: 🎯 16, ⚡ Recharge: +3
  3. **Pufferfish**: 🎯 36, ⚡ Recharge: +4
  4. **Kraken Takin' a Break'n**: 🎯 56, ⚡ Recharge: +3
  5. **Anglerfish**: 🎯 −12, ⚡ Recharge: +5
  6. **Great White Shark**: 🎯 98, ⚡ Recharge: Victory

### 3. `data/treasures.js`
- **`TREASURE_CARDS`**: 19 curated treasure cards kept in a separate deck:
  - **Negative targets** (e.g. -4, -6, -8, -10, -12)
  - **Square targets** (e.g. 4, 9, 16, 25, 36, 49, 64, 81)
  - **Highly composite targets** (e.g. 12, 18, 24, 30, 48, 60)
  - **Gems**: 1, 2, or 3 gems (💎) depending on target difficulty.

---

## 🎮 How to Play the Prototype (v0.7 Rules)

1. **Building Sequences:**
   - Calculations start at **0**.
   - Click number cards from your hand to chain them in the order played (e.g. `0 → +8 → -1 → ×8 = 56`).
   - Click any card token in the workbench or click **✕ Clear Selection** to reset.

2. **⚡ Scooter Battery and Bolts (Replaces Doom):**
   - The scooter has a maximum capacity of **5 bolts**, represented by five double-sided battery cards (Yellow ⚡ charged, Grey ⚡ depleted).
   - Starts fully charged with **5 bolts**.
   - Each action costs **1 bolt**:
     - **⚔️ Attack**: Make the sea creature's 🎯 target to defeat it.
     - **🛒 Buy / Claim**: Make a market number card's 🎯 target to add it to your hand, OR make a stockpile treasure's 🎯 target to claim its gems into your Treasure Chest.
     - **🔄 Market Refresh**: Replace all five market cards with fresh ones.
     - **✋ Pickup**: Return all played cards from your discard pile to your hand mid-encounter.

3. **⚡ Post-Battle Recovery:**
   - Defeating a fish automatically:
     1. Restores the bolts shown on its card (up to the 5-bolt cap).
     2. Returns all played number cards from your discard to your hand (Automatic Pickup).
     3. Refills empty market slots from the draw pile up to 5 cards.
     4. Reveals 1 random treasure into the **Treasure Stockpile**.

4. **🚨 Final Attack (at 0 Bolts):**
   - When the last bolt is spent (battery at 0 bolts), the player gets one final Attack.
   - **Hit:** Defeats the sea creature and recharges the battery by its recharge value to continue the adventure.
   - **Miss:** The scooter strands underwater and the adventure ends in defeat.
   - No other actions (Buy, Market Refresh, Pickup) are available at 0 bolts.

5. **🏆 Winning:**
   - Defeat the Great White Shark (Encounter 6) to complete the adventure.
   - Collect its final treasure automatically as a victory bonus.
   - All gems earned during the adventure are stored permanently in browser storage.

6. **⚙️ Rules Tuning & Debug Tools:**
   - Expand the **"Rules Tuning & Debug Tools"** panel at the bottom of the screen to:
     - Skip to any sea creature.
     - Adjust scooter battery charge (+1 / -1 Bolt).
     - Reveal a treasure directly into the stockpile.
     - Spawn specific number cards directly into your hand.

---

## 🧪 Automated Rule Tests

Run the test suite to verify card counts, battery mechanics, action costs, post-battle recharge, and victory bonus conditions:
```bash
npm test
```

## Don't add extraneous text
Please don't add text fields into the prototype with "helper" text or commentary unless asked.
