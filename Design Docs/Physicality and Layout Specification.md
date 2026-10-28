# Physicality and Layout Specification

**Document Version:** 1.0  
**Game Reference:** Maths Handbuilder (v0.7 Underwater Scooter)  
**Purpose:** Defines the physical tabletop components, spatial layout, card dimensions, and interaction model to ensure all digital implementations faithfully simulate the physical card game.

---

## 1. Core Design Philosophy: Physical Card Game First

*Maths Handbuilder* is fundamentally a **tabletop physical card game**. The digital prototype is an interactive simulation of playing on a real table.

### Guiding Tabletop Principles
1. **Physical Card Metaphor:** Every gameplay component that would exist as cardboard, cardstock, or double-sided cards in a box is represented as a physical card shape on screen.
2. **Mental Math (No Auto-Calculator):** By default, the game does not calculate answers for the player, nor does it highlight matches. Players must do mental arithmetic, lay cards onto the playmat, and commit to actions.
3. **Card Movement:** Cards are not merely "selected with a border"; they physically leave the player's hand and move onto the playmat (Calculation Workbench) when played, and return to the hand when picked up or cleared.
4. **Action Buttons are Controls, Not Cards:** Actions (`Attack`, `Buy / Claim`, `Market Refresh`, `Pickup`) represent player choices / game phases and remain standard UI buttons.

---

## 2. Tabletop Layout & UI Architecture

The playing surface is organized into a two-column tabletop layout:

```
+-------------------------------------------------------+-------------------------------------------------------+
| LEFT-HAND SIDE (Player Area & Encounter)             | RIGHT-HAND SIDE (Market & Playmat)                    |
+-------------------------------------------------------+-------------------------------------------------------+
| 1. Current Sea Creature Encounter (Landscape Card)    | 1. Market (5 Portrait Number Card Slots)              |
|    - Name, Vector Artwork, Target 🎯, Recharge ⚡    |    - Fixed empty slot placeholders (🂠)                |
|                                                       |                                                       |
| 2. Scooter Battery (5 Portrait Cards, Single Row)     | 2. Treasure Stockpile (Portrait Treasure Cards)       |
|    - Double-sided: Yellow (Charged) / Grey (Spent)   |    - Revealed by defeated fish, claimed via Target 🎯 |
|                                                       |                                                       |
| 3. Player's Hand (Portrait Number Cards)              | 3. Calculation Workbench (The Playmat)                |
|    - Only held cards; played cards move to table      |    - [Start 0 Base] -> [Card 1] -> [Card 2] ...       |
|    - Played Discard Pile preview underneath           |    - No auto-total (Debug toggle available)           |
|                                                       |                                                       |
| 4. Action Buttons (Costs 1 ⚡ Bolt)                   | 4. Combat & Adventure Log                             |
|    - Attack, Buy/Claim, Refresh, Pickup              |    - Action resolutions, dice/math outcomes, lore     |
|                                                       |                                                       |
| 5. Treasure Chest / Vault                             | 5. Rules Tuning & Debug Drawer                        |
|    - Collected gem treasures stored as mini-cards     |    - Skip encounter, spawn cards, debug toggles       |
+-------------------------------------------------------+-------------------------------------------------------+
```

---

## 3. Card Specifications & Dimensions

### A. Sea Creature Encounter Card (Landscape)
- **Orientation:** Landscape (`aspect-ratio: ~2.2 : 1`, approx. `440px × 200px`).
- **Physical Feel:** Large encounter / boss card.
- **Card Anatomy:**
  - **Top Banner:** Encounter number and creature name (e.g., *Encounter 1/6: Chainsaw Clownfish*).
  - **Center Art:** Distinctive creature illustration (humorous vector SVG art).
  - **Bottom Left:** Creature Target box (`🎯 Target: 10`).
  - **Bottom Right:** Battery recharge reward (`⚡ Recharge: +4`).

### B. Scooter Battery Bolt Cards (Portrait)
- **Orientation:** Portrait playing cards.
- **Layout Rule:** All **5 cards must fit on a single horizontal line** without wrapping across all standard screen sizes.
- **Physical Mechanism:** **Double-sided flip cards**:
  - **Charged Face (Yellow):** Gold border, light warm gradient, corner `⚡`, large central `⚡`, and bottom `⚡ CHARGED` badge.
  - **Depleted Face (Grey):** Greyscale dashed border, dimmed background, and bottom `SPENT` badge.
- **Behavior:** 1 card flips to depleted per action taken. Defeating creatures flips cards back to charged up to the maximum of 5.

### C. Number Cards (Hand & Market)
- **Orientation:** Portrait playing cards (standard poker/bridge card proportion, approx. `82px × 118px`).
- **Card Anatomy:**
  - **Top-Left Corner:** Operation symbol and value (e.g., `+3`, `−5`, `×2`).
  - **Center:** Bold primary operation and value.
  - **Bottom Badge:** Purchase target number (`🎯 6`, `🎯 12`).
  - **Top-Right Pip:** Sequence number (`#1`, `#2`, `#3`) when laid out in order.
- **Color Coding by Mathematical Operation:**
  - **Addition (`+`):** Blue theme (`#1e40af`, border `#3b82f6`, light blue gradient).
  - **Subtraction (`−`):** Red theme (`#b91c1c`, border `#ef4444`, light red gradient).
  - **Multiplication (`×`):** Purple theme (`#6d28d9`, border `#8b5cf6`, light purple gradient).
- **Market Empty Slots:** Retain the exact same card dimensions with a dashed border and an empty card symbol (`🂠`) so the market layout never shifts or collapses.

### D. Treasure Cards (Stockpile & Chest)
- **Orientation:** Portrait cards with identical dimensions to Number Cards (`82px × 118px`).
- **Theme:** Amber / gold border (`#f59e0b`) on warm ivory cardstock (`#fffdf5`).
- **Card Anatomy:**
  - **Top-Left Corner:** Gem count badge (`💎 2`, `💎 3`).
  - **Center:** Gem icons (`💎💎`, `💎💎💎`).
  - **Bottom Badge:** Target value (`🎯 7`, `🎯 9`).
  - **Zero Extraneous Text:** Do NOT display redundant text like "Composite (3gem)".
- **Treasure Chest Storage:** Banked treasures in the chest are presented as miniature portrait cards (`58px × 84px`) showing gem count and target.

---

## 4. Interaction & Physicality Rules

### Card Movement (Hand ⇄ Workbench)
1. **Playing a Card:**
   - Clicking a card in the player's Hand removes it from the hand container and places it onto the Calculation Workbench playmat.
   - Cards on the workbench are arranged left-to-right, connected by sequence arrows (`→`).
2. **Returning a Card:**
   - Clicking any card currently on the workbench immediately removes it from the sequence and returns it to the player's hand.
   - Clicking **✕ Return All to Hand** clears the entire sequence and returns all played cards to the hand.

### "No Auto-Calculator" Physical Play Mode
1. **Default State (Mental Arithmetic):**
   - The workbench does **not** evaluate the sequence or show a running total (`Total: ?` or hidden).
   - Intermediate step values (`= 3`, `= 6`) are hidden.
   - Market and Stockpile cards do **not** glow green or display `"✨ MATCH!"` badges.
   - The Attack and Buy buttons do **not** reveal whether the sequence matches (no `(🎯 Matched!)` text and no `.ready-to-act` green glow).
   - Players must decide when their calculation is correct. Clicking `Attack` or `Buy` executes the action; if the math was incorrect, the bolt is spent and the failure is logged.
2. **Debug / Training Mode (Auto-Calc Toggle):**
   - A checkbox labeled `🧮 Auto-Calc (Debug)` in the workbench header (and debug drawer) allows toggling on the live calculation engine.
   - When enabled, it displays the evaluated running total, step results, green card pulsing, and match indicators.

---

## 5. Summary Table of Physical Components

| Component | Physical Form | Orientation | Default Sizing | Color / Theme |
|---|---|---|---|---|
| **Sea Creature Encounter** | Boss / Encounter Card | Landscape | ~440px × 200px | Ocean Blue (`#0284c7`) |
| **Scooter Battery Bolts (5)** | Double-Sided Token Cards | Portrait | ~76px × 106px (Single row, no-wrap) | Charged: Gold / Depleted: Grey |
| **Number Cards** | Deck Cards (Hand & Market) | Portrait | 82px × 118px | Blue (`+`), Red (`−`), Purple (`×`) |
| **Treasure Cards** | Stockpile Cards | Portrait | 82px × 118px | Gold / Amber (`#f59e0b`) |
| **Treasures in Chest** | Vault Cards | Mini-Portrait | 58px × 84px | Gold / Amber (`#f59e0b`) |
| **Discard Pile Preview** | Played Discard Pile | Mini-Portrait | 44px × 62px | Color-matched to operation |
| **Action Buttons** | Control Panel | Standard Buttons | Full-width buttons | Distinct action color borders |
| **Workbench Playmat** | Felt Table Surface | Horizontal Area | Min-height 144px | Deep Navy Mat (`#0f172a`) |
