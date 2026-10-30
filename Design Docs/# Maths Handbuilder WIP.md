# Maths Handbuilder WIP

**Game Design Document | v0.8**

*A roguelike handbuilding game where maths powers your underwater adventure.*

## 1. Overview

Ride an electric scooter through a bizarre underwater world, defeating increasingly dangerous sea creatures by combining cards to make exact target numbers.

Build a versatile hand of mathematical cards, collect treasure, and unlock new content across multiple adventures.

**Design principles**

- **Simple:** Cards explain how to play, with minimal additional rules.
- **Fun first:** Maths is the game, not a separate quiz.
- **Strategic:** Build a powerful hand within limited capacity and manage your battery.
- **Replayable:** Random card acquisition creates different combinations and strategies.
- **Accessible:** Designed for children aged eight and up.

## 2. Cards and actions

Players start with three number cards: **+1, +2, +3**.

The starting scooter has a maximum capacity of **seven number cards**.

Three actions are available during the adventure:

| Action | Effect |
|---|---|
| **Attack** | Make the fish's 🎯 target to defeat it. |
| **Buy** | Make a market card's 🎯 target to add it to your hand, or claim a treasure by making its target. |
| **Market Refresh** | Replace all five market cards. |

### Playing number cards

Number cards are reusable.

1. Place number cards from your hand into a calculation area, in the order you want to use them.
2. Rearrange or return cards freely before committing to an action.
3. Perform an Attack or Buy action.
4. Return all played number cards to your hand, whether the action succeeds or fails.

Each physical number card may be used only once in a single calculation.

**There is no discard pile or Pickup action.**

Every Attack, Buy or Market Refresh costs one ⚡ bolt. Failed attacks and purchases still consume a bolt.

## 3. Making numbers

Calculations start at zero. Play number cards in any order, applying each operation to the running total.

For example:

- **+3 → ×4 = 12**
- **+2 → ×5 → +3 = 13**
- **+3 → +2 → ×4 = 20**

Operations resolve in the order played rather than conventional BEDMAS precedence.

### Starting operations

The baseline game contains only:

- **Addition (+)**
- **Multiplication (×)**

Subtraction and negative numbers are reserved for future unlocks.

All baseline fish and treasure targets are positive numbers.

Players can experiment with different combinations before committing to an action.

## 4. Scooter and hand capacity

The scooter determines the maximum number of number cards a player can own.

The starting scooter has **seven card slots**.

Players begin with three cards, leaving four empty slots.

### Buying below capacity

When a player successfully buys a market card, they add it to their hand immediately.

### Buying at capacity

If the player already owns seven number cards, buying another requires replacing one.

1. Successfully make the market card's target.
2. Take the purchased card.
3. Permanently remove one existing number card.
4. Add the purchased card to the hand.

The removed card leaves the current adventure and cannot be recovered.

Replacement costs no additional bolts.

Players cannot exceed their scooter's capacity.

### Future scooters

Future unlocks may introduce scooters with different hand capacities or battery characteristics.

These are not implemented in v0.8.

## 5. Battery and bolts

The starting scooter has a maximum battery capacity of **four bolts**.

Four double-sided battery cards track charge:

- **Yellow ⚡:** Charged.
- **Grey ⚡:** Depleted.

Every action costs one bolt.

### Defeating a fish

Defeating any fish **completely refills the battery to four bolts**, regardless of its previous charge.

Individual fish no longer have different recharge values.

### Running out of bolts

When the last bolt is spent during an encounter, the player may make one final Attack.

- **Success:** Defeat the fish and fully recharge the battery.
- **Failure:** The journey ends.

No Buy or Market Refresh actions are available at zero bolts.

The final Attack does not require an additional bolt.

A player who loses retains all gems collected during the adventure.

## 6. Fish encounters

Fish appear in a preset sequence of increasing difficulty.

Each fish displays:

- **🎯 Target:** The exact number required to defeat it.

Fish do not display recharge values because all fish fully refill the battery.

### Initial encounter sequence

| Encounter | Fish | 🎯 Target |
|---|---|---:|
| 1 | Chainsaw Clownfish | 10 |
| 2 | Electric Eel | 16 |
| 3 | Pufferfish | 36 |
| 4 | Kraken Takin' a Break'n | 56 |
| 5 | Great White Shark | 98 |

The Anglerfish and its negative target are removed from the baseline game and reserved for future unlockable content.

### Defeating a fish

For fish 1–4:

1. Refill the battery to four bolts.
2. Return all played number cards to the hand.
3. Refill empty market slots.
4. Reveal one random treasure and add it to the treasure stockpile.
5. Advance to the next fish.

Defeating the Great White Shark triggers the Victory Lap, described in Section 9.

### Visible upcoming encounters

Players can see the 🎯 target values of upcoming fish before reaching them.

In the physical game, fish cards can be arranged in an overlapping stack with their target corners exposed.

This allows players to plan card purchases around upcoming encounters.

### Future fish selection system

The intended long-term structure is:

- **First fish:** Always the Chainsaw Clownfish.
- **Middle fish:** A fixed number of encounters selected from a growing pool of unlocked fish.
- **Final fish:** Always the Great White Shark.

The baseline game contains three middle fish, giving five encounters in total.

Future unlocks will expand the middle-fish pool, increasing variety between adventures.

Additional fish are intended to be among the first legacy unlocks.

**Prototype scope:** The five baseline fish remain in their fixed order. Random selection from the unlocked fish pool is not implemented yet.

## 7. The market

Five random number cards from the draw pile are displayed face-up.

Each card has a 🎯 target equal to its numerical value, regardless of its operation.

For example:

- **+4:** 🎯 4
- **×7:** 🎯 7

Players acquire one card per Buy action by making its target exactly.

Purchased cards enter the player's hand immediately, subject to scooter capacity.

Their market slots remain empty until the next fish is defeated.

Players may use Market Refresh to replace all five market cards at the cost of one bolt.

### Refreshing the draw pile

Market cards removed during a refresh enter a market discard pile.

When the draw pile runs out, discarded market cards are reshuffled to form a new draw pile.

Cards permanently removed from a player's hand do not return to the draw pile during that adventure.

## 8. Treasure and gems

Treasure cards form a separate deck.

Each treasure displays:

- **🎯 Target:** The exact number required to claim it.
- **💎 Gems:** The reward for claiming it.

All baseline treasure targets are positive numbers.

### Revealing treasure

Defeating each fish reveals one random treasure.

- After fish 1–4, the treasure enters the face-up stockpile.
- Unclaimed treasures remain available until the adventure ends.
- The stockpile can contain multiple treasures.
- Defeating the Great White Shark reveals one additional treasure for the Victory Lap.

### Claiming treasure

Use the Buy action to make a treasure's target exactly.

- Collect the gems shown on the treasure.
- Remove the claimed treasure from the stockpile.
- Return all played number cards to the hand.
- Spend one bolt.

Failed treasure claims still consume a bolt.

**Claiming treasure does not permanently remove number cards.**

### Keeping gems

Gems are permanent rewards.

Players keep all gems earned during an adventure, whether they win or lose.

**Prototype scope:** Track the total number of gems earned. Gem spending and legacy unlocks are not implemented yet.

## 9. Victory Lap

Defeating the Great White Shark ends combat and begins the **Victory Lap**.

This is a final opportunity to collect treasure before the adventure ends.

### Entering the Victory Lap

When the shark is defeated:

1. Refill the battery to its maximum of four bolts.
2. Return all played number cards to the hand.
3. Refill empty market slots.
4. Reveal one final random treasure and add it to the stockpile.
5. Enter the Victory Lap.

**The shark does not award gems automatically.**

### Victory Lap actions

During the Victory Lap:

- Players may spend bolts attempting to claim any remaining treasures.
- Each treasure claim costs one bolt, whether successful or unsuccessful.
- Successfully claimed treasures award their gems and leave the stockpile.
- Number cards return to the hand after every attempt.
- Players cannot Attack, purchase market cards or refresh the market.
- No additional bolts can be earned.

### Ending the Victory Lap

The Victory Lap ends when:

- The battery reaches zero, or
- All available treasures have been claimed.

The player may also voluntarily finish early.

The adventure is then complete.

**Defeating the Great White Shark always counts as victory**, regardless of how much treasure is collected during the Victory Lap.

All earned gems are retained for future adventures.

## 10. Draw pile distribution

The baseline draw pile contains only addition and multiplication.

| Card | Copies per card | Total cards |
|---|---:|---:|
| +1 to +4 | 5 | 20 |
| +5 to +9 | 3 | 15 |
| ×2 to ×4 | 3 | 9 |
| ×5 to ×9 | 2 | 10 |
| **Total** | | **54** |

The three starting cards are separate from the draw pile.

The draw pile supplies market cards.

Subtraction cards are excluded from the baseline draw pile and reserved for future unlocks.

### Treasure distribution

Treasure cards use a separate deck.

For the current prototype, the existing provisional treasure deck may be retained, provided all targets are positive.

Final treasure targets, gem rewards and rarity distribution remain subject to balancing.

## 11. Strategy and progression

Players balance three goals:

**Survive:** Defeat fish within the available battery charge.

**Build a versatile hand:** Acquire mathematical cards capable of making a wide range of targets within seven slots.

**Collect treasure:** Spend bolts claiming treasure to earn permanent gems.

The limited hand capacity creates two phases of handbuilding:

- **Growth:** Fill unused scooter slots with useful cards.
- **Optimisation:** Replace cards to build a more effective mathematical toolkit.

Because number cards are reusable, the challenge lies in assembling the right operations for changing targets rather than managing discarded cards.

Visible upcoming fish targets allow players to plan purchases.

The Victory Lap provides a final payoff for treasure collection and a satisfying conclusion to a successful adventure.

## 12. Winning and losing

### Victory

Defeat the Great White Shark, complete or end the Victory Lap, and finish the adventure.

### Defeat

Fail the final Attack when the battery is empty.

### Persistent rewards

All gems collected remain with the player, whether they win or lose.

The next adventure begins with the baseline starting cards, scooter and battery. Purchased number cards do not carry into future adventures.

---

## 13. Legacy progression (future implementation)

Gems will eventually unlock new content across multiple adventures.

Locked content will be arranged in a fixed sequence of physical cards, with the next unlock's requirements displayed on its back.

The intended process is:

1. Earn gems by claiming treasure.
2. Mark gem checkboxes on the next locked card.
3. When all requirements are met, flip the card to reveal its reward.
4. Add the unlocked content to future adventures and reveal the next unlock.

Each unlock introduces one physical card.

### Intended early progression

The first unlocks should introduce **additional middle-encounter fish**.

This expands replayability without immediately introducing new mathematical operations or rules.

Later unlocks may introduce:

- Additional middle fish.
- Subtraction cards.
- Negative-target fish, including the Anglerfish.
- Negative-target treasures.
- Alternative starting number cards.
- Scooters with different hand capacities.
- Scooters with different battery capacities.
- New treasure types.
- New mathematical operations.
- New actions or rule variations.

Some unlocks may eventually require a second currency.

### Future fish progression

The future encounter system should support:

- One fixed starting fish.
- A configurable number of middle encounters.
- A pool of available middle fish.
- One fixed final fish.

When additional fish are unlocked, middle encounters will be selected from the available pool.

Fish selection should eventually respect difficulty progression, although the exact selection and ordering rules are not yet defined.

### Unlock data file

The coding agent should prepare a **separate structured unlock data file** to support future legacy progression.

Each unlock record should support:

| Field | Purpose |
|---|---|
| `id` | Unique unlock identifier |
| `order` | Position in the unlock sequence |
| `name` | Display name |
| `description` | Explanation of the reward |
| `type` | Fish, operation, scooter, treasure, starting card, etc. |
| `gemCost` | Gems required to unlock |
| `secondaryCost` | Optional second currency requirement |
| `prerequisites` | Required earlier unlocks |
| `contentIds` | References to content introduced by the unlock |
| `status` | Planned or defined |

The file should contain an initial editable unlock sequence beginning with additional fish.

Later entries may describe planned subtraction, negative-number and scooter content without finalising their values or costs.

The game data architecture should distinguish between baseline content and unlockable content.

### Implementation restriction

**Do not implement legacy progression in v0.8.**

Specifically:

- Do not implement gem spending.
- Do not implement unlock UI or checkbox progression.
- Do not implement alternative scooters.
- Do not activate subtraction or negative-number content.
- Do not implement randomised middle-fish selection.
- Do not introduce unlockable content into the baseline game.

Only create the unlock data file and supporting content definitions. Please MOVE THE EXISTING SUBTRACTION DATA into the unlock file, but put it behind to example unlocked fish.

Gem tracking remains active.

---

## 14. Version history

### v0.8

**Changes from v0.7, incorporating v0.7B and subsequent playtesting:**

1. **Seven-card hand capacity.** The starting scooter holds up to seven number cards.
2. **Card replacement.** Buying at capacity requires permanently removing an existing card.
3. **Reusable number cards.** Cards return to the hand after every Attack or Buy, including failed actions.
4. **Discard pile removed.** Played number cards are no longer discarded.
5. **Pickup action removed.** Only Attack, Buy and Market Refresh remain.
6. **Four-bolt battery.** Maximum and starting charge reduced from five to four.
7. **Full recharge.** Defeating any fish refills the battery completely.
8. **Fish recharge values removed.** Fish cards no longer display individual recharge amounts.
9. **Subtraction deferred.** The baseline game includes only addition and multiplication.
10. **Positive-only targets.** Negative fish and treasure targets are reserved for future unlocks.
11. **Five-fish adventure.** The Anglerfish is removed from the baseline sequence.
12. **Upcoming targets visible.** Future fish target values are visible during play.
13. **Future fish-pool system defined.** First and final fish are fixed, with middle encounters eventually drawn from unlocked fish.
14. **Fish unlocks prioritised.** Early unlocks expand encounter variety before mathematical complexity.
15. **54-card draw pile.** The original 66-card distribution is reduced by removing 12 subtraction cards.
16. **Victory Lap introduced.** Defeating the Great White Shark begins a final treasure-claiming phase.
17. **No automatic final treasure reward.** The shark reveals a treasure but does not award its gems automatically.
18. **Full recharge for Victory Lap.** The player enters the final treasure phase with four bolts.
19. **Treasure-only Victory Lap.** Players can claim remaining treasures but cannot buy market cards, refresh or attack.
20. **Unlock data preparation.** The coding agent must prepare the future unlock data file without implementing legacy progression.

