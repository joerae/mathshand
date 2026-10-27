# Maths Handbuilder WIP

**Game Design Document | v0.7**

*A roguelike handbuilding game where maths powers your underwater adventure.*

## 1. Overview

Ride an electric scooter through a bizarre underwater world, defeating increasingly dangerous sea creatures by combining cards to make exact target numbers.

Build a powerful hand, collect treasure, and unlock new content across multiple games.

**Design principles**

- **Simple:** Cards explain how to play, with minimal additional rules.
- **Fun first:** Maths is the game, not a separate quiz.
- **Strategic:** Build your hand and manage your limited battery.
- **Replayable:** Random card acquisition creates different combinations and strategies.
- **Accessible:** Designed for children aged eight and up.

## 2. Cards and actions

Players start with three cards in their hand: **+1, +2, +3**.

Four actions are available:

| Action | Effect |
|---|---|
| **Attack** | Make the fish's 🎯 target to defeat it. |
| **Buy** | Make a market card's 🎯 target to add it to your hand, or claim a treasure by making its target. |
| **Market Refresh** | Replace all five market cards. |
| **Pickup** | Return all played cards to your hand. |

### Playing cards

Number cards follow the lifecycle: **play → discard → Pickup**.

Each action:

1. Uses any number cards required.
2. Discards the played number cards, except those recovered by Pickup.
3. Costs one ⚡ bolt.

Failed attacks and purchases still cost one bolt.

## 3. Making numbers

Calculations start at zero. Play number cards in any order, applying each operation to the running total.

For example:

- **+8 → −1 → ×8 = 56**
- **+8 → ×8 → −1 = 63**

Operations resolve in the order played rather than conventional BEDMAS precedence.

Players can create positive or negative numbers, experimenting with different sequences to reach their targets.

## 4. Battery and bolts

The scooter has a maximum capacity of **five bolts**.

Five double-sided battery cards track the remaining charge:

- **Yellow ⚡:** Charged.
- **Grey ⚡:** Depleted.

Each action costs one bolt. Flip a charged battery card to its depleted side.

Defeating a fish restores the number of bolts shown on its card, up to the maximum of five.

### Running out of bolts

When the last bolt is spent, the player may make one final Attack.

- **Success:** Defeat the fish and recharge the battery.
- **Failure:** The journey ends.

No other actions are available at zero bolts.

## 5. Fish encounters

Fish appear in a preset sequence of increasing difficulty.

Each fish displays:

- **🎯 Target:** The exact number required to defeat it.
- **⚡ Recharge:** The number of bolts restored when defeated.

### Defeating a fish

When a fish is defeated:

1. Restore the bolts shown on its card, up to the maximum of five.
2. Pick up all played number cards.
3. Refill empty market slots.
4. Reveal one random treasure.

After the first five fish, revealed treasures enter the treasure stockpile. Defeating the final fish awards its treasure automatically and ends the adventure.

### Initial encounter sequence

| Fish | 🎯 Target | ⚡ Recharge |
|---|---:|---:|
| Chainsaw Clownfish | 10 | +4 |
| Electric Eel | 16 | +3 |
| Pufferfish | 36 | +4 |
| Kraken Takin' a Break'n | 56 | +3 |
| Anglerfish | −12 | +5 |
| Great White Shark | 98 | Victory |

*Recharge values are initial balancing values.*

## 6. The market

Five random number cards from the draw pile are displayed face-up.

Each card has a 🎯 target equal to its numerical value, regardless of its operation.

For example:

- **+4:** 🎯 4
- **×7:** 🎯 7
- **−3:** 🎯 3

Players acquire one card per Buy action by making its target exactly.

Purchased cards enter the player's hand immediately. Their market slots remain empty until the next fish is defeated.

Players may use Market Refresh to replace all five market cards at a cost of one bolt.

## 7. Treasure and gems

Treasure cards form a separate deck.

Each treasure displays a 🎯 target and a gem reward.

### Revealing treasure

Defeating a fish reveals one random treasure.

- After fish 1–5, place it face-up in the **treasure stockpile**.
- Unclaimed treasures remain available until the end of the adventure.
- The stockpile can contain multiple treasures.

### Claiming treasure

Use the Buy action to make a treasure's target exactly.

- Collect the gems shown on the treasure.
- Remove the claimed treasure from the stockpile.
- Discard the number cards used and spend one bolt.

### Final fish reward

Defeating the Great White Shark reveals one random treasure.

**Collect its gems automatically and win the game.**

### Keeping gems

Gems are permanent rewards. Players keep all gems collected during an adventure, even if they lose.

**Prototype scope:** Track the total number of gems earned. Legacy unlocks are not implemented yet.

## 8. Legacy progression (future implementation)

Gems will unlock new content across multiple games.

Locked content will be arranged in a fixed sequence of cards, with the next unlock's requirements displayed on its back.

1. Earn gems by claiming treasure or defeating the final fish.
2. Mark gem checkboxes on the next locked card.
3. When all requirements are met, flip the card to reveal its reward.
4. Add the unlocked card to future games and reveal the next unlock.

Each unlock introduces one physical card.

Unlocked cards may introduce:

- New mathematical operations.
- Alternative starting cards.
- Additional fish.
- New treasure types.
- New actions or rule variations.

Some unlocks may require a second type of currency.

**This entire unlock system is excluded from the current prototype. Only gem tracking is required.**

## 9. Draw pile distribution

The draw pile favours smaller additions and accessible operations, with powerful multipliers appearing less frequently.

| Card | Copies per card | Total cards |
|---|---:|---:|
| +1 to +4 | 5 | 20 |
| +5 to +9 | 3 | 15 |
| −1 to −4 | 3 | 12 |
| ×2 to ×4 | 3 | 9 |
| ×5 to ×9 | 2 | 10 |
| **Total** | | **66** |

The three starting cards are separate from this draw pile.

The draw pile supplies market cards. When the draw pile runs out, its discarded cards are reshuffled to form a new draw pile.

Treasure cards form a separate deck. Five double-sided battery cards track bolts.

## 10. Strategy and progression

Players balance three goals:

**Survive:** Defeat fish before the scooter runs out of battery.

**Grow stronger:** Acquire mathematical cards to create more combinations.

**Collect treasure:** Spend bolts on treasure targets to earn gems.

Defeating fish restores bolts, recovers played cards and replenishes the market, encouraging players to keep progressing.

Efficient play preserves battery charge for later encounters.

## 11. Winning

Defeat the Great White Shark to complete the adventure.

Collect its treasure automatically as a victory reward.

All gems earned during the adventure are retained, whether the player wins or loses.

---

## 12. Version history

### v0.7

**Changes from v0.6:**

1. **Underwater electric scooter theme.** Monsters become bizarre sea creatures, beginning with the Chainsaw Clownfish and ending with the Great White Shark.
2. **Bolts replace Doom.** The scooter has five double-sided battery cards. Every action depletes one bolt.
3. **Persistent battery.** Bolts carry between encounters. Defeating a fish restores a specified number, up to the five-bolt cap.
4. **Final Attack retained.** At zero bolts, the player gets one final Attack. Success continues the adventure; failure ends it.
5. **Automatic Pickup.** Defeating a fish returns all played number cards to the hand.
6. **Automatic market replenishment.** Empty market slots refill after defeating a fish. Manual Market Refresh remains available.
7. **Fish recharge rewards.** Each fish displays its own battery recharge value, initially ranging from +3 to +5.
8. **Battery cards replace Doom counters.** The draw pile no longer supplies face-down cards for tracking Doom.
9. **Prototype scope clarified.** Gems are tracked, but legacy unlocks are deferred.

### v0.6

1. Introduced a separate treasure deck and treasure stockpile.
2. Added target-based treasure claiming and permanent gems.
3. Added an automatic treasure reward for defeating the final monster.
4. Introduced linear legacy progression with one-card-at-a-time unlocks.

### v0.5

1. Made Attack, Buy, Market Refresh and Pickup always-available actions.
2. Simplified the starting hand to +1, +2 and +3.
3. Removed Buy cards, reducing the draw pile to 66 cards.
4. Introduced the final-chance Attack rule.

### v0.4

- Established the original seven-card starting hand and action-card lifecycle.
- Introduced the fixed six-monster progression.
- Defined target-based purchasing, Doom and the weighted 71-card draw pile.