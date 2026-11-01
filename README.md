# Maths Handbuilder — Seven Seas Prototype (v0.10)

*A roguelike handbuilding card game where maths powers your underwater electric scooter adventure.*

Based on [`Design Docs/# Maths Handbuilder WIP.md`](./Design%20Docs/%23%20Maths%20Handbuilder%20WIP.md) and [`data/Maths_Handbuilder_Card_Content_v6(1).xlsx`](./data/Maths_Handbuilder_Card_Content_v6(1).xlsx).

---

## 🚀 Quick Start

1. Start the local server:
   ```bash
   npm start
   ```
   *(runs `scripts/import_xlsx.mjs` automatically before starting)*

2. Open your web browser to:
   ```
   http://localhost:3000
   ```

3. Run the test suite:
   ```bash
   npm test
   ```

---

## 📊 Spreadsheet as the Single Source of Truth

All game cards, values, quantities, encounter sequences, scooter capabilities, and quest rules are driven directly by the spreadsheet:
- **Location**: `data/Maths_Handbuilder_Card_Content_v6(1).xlsx` (or any newer `.xlsx` dropped into `data/`).
- **Importer script**: `npm run import-data` (or `node scripts/import_xlsx.mjs`).
- **Generated data**: `data/game_data.js` and `data/content.js`.

Whenever you edit and save the spreadsheet, run `npm run import-data` (or simply `npm start` / `npm test`), and all game data will immediately update!

---

## 🌊 The Seven Seas (A–G)

Choose your sea and scooter before every adventure:

| Sea | Name | Focus | Key Unlocks |
|---|---|---|---|
| **A** | Shallow Reef | Addition +1 to +9 | Starter Scooter (⚡4, Hand 8, +1,+2,+3), 4 fixed fish, 4 treasures |
| **B** | Extended Addition | +10, +12, +20; bonds to 10/20/30 | Ten Speed Scooter (⚡4, Hand 7, +1,+5,+10), 2 new fish |
| **C** | Negative Depths | Subtraction −1 to −5, −10; negative targets | Reverse Gear Scooter (⚡4, Hand 9, +2,+4,+9,−3,−5), randomised fish |
| **D** | Double Trouble | Multiplication ×2 and ×10 | Double Drive Scooter (⚡4, Hand 7, +6,+8,×2,×10,−3), Jellyfish (no recharge) |
| **E** | Multiplication Reef | Multiplication ×3, ×4, ×5 | Quad Bike Scooter (⚡5, Hand 7), Kraken (discard), Hydra (multi-target) |
| **F** | Negative Currents | Extended subtraction −6 to −9 | Seven Speed Scooter (reveals +1 treasure), Theiving Squid (steals treasure) |
| **G** | Times Table Trench | Extended times tables ×6 to ×9 | Treasure Hunter (+2 treasures), Great White Shark (🎯 99) |

---

## 🎮 How to Play

1. **Calculations start at 0**: Click number cards from your hand in the order you wish to apply them (e.g. `0 → +3 → ×4 → −2 = 10`).
2. **Number cards are reusable**: Cards return to your hand after every action.
3. **Actions cost 1 ⚡ Bolt**:
   - **⚔️ Attack**: Match the sea creature's target number to defeat it.
   - **🛒 Buy / Claim**: Match a Market card to acquire it into your scooter's hand, OR match a Stockpile treasure to claim gems.
   - **🔄 Market Refresh**: Replace all 5 market cards.
4. **Scooter Hand Capacity**: When buying at capacity, choose one card from your hand to permanently scrap.
5. **Final Attack at 0 Bolts**: You get one final Attack against the creature; hit to recharge, or fail to end the journey.
6. **Sea Quests**: Complete each sea's 3 repeatable quests to bank bonus permanent gems.
7. **Victory Lap**: Defeating the final fish recharges your scooter to full power and opens the stockpile for a final treasure-collecting spree!
