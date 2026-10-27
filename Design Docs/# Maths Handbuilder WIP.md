# Maths Handbuilder WIP

**Game Design Document | v0.6**

*A roguelike handbuilding game where maths is your weapon.*

## 1. Overview

Defeat a sequence of monsters by combining cards to make exact target numbers.

Build a powerful hand, collect treasure, and unlock new content across multiple games.

**Design principles**

- **Simple:** Cards explain how to play, with minimal additional rules.
- **Fun first:** Maths is the game, not a separate quiz.
- **Strategic:** Build your hand and manage your limited actions.
- **Replayable:** Random card acquisition creates different combinations and strategies.
- **Accessible:** Designed for children aged eight and up.

## 2. Cards and actions

Players start with three cards in their hand: **+1, +2, +3**.

Four actions are available:

| Action | Effect |
|---|---|
| **Attack** | Make the monster's 🎯 target to defeat it. |
| **Buy** | Make a market card's 🎯 target to add it to your hand, or claim a treasure by making its target. |
| **Market Refresh** | Replace the market with five new cards. |
| **Pickup** | Return all played cards to your hand. |

### Playing cards

Number cards follow the lifecycle: **play → discard → Pickup**.

Each action:

1. Uses any number cards required.
2. Discards the played cards, except those recovered by Pickup.
3. Places one card face-down from the draw pile onto the monster, adding one Doom.

Every action adds one Doom, regardless of how many number cards are played. Failed attacks and purchases still add Doom.

## 3. Making numbers

Calculations start at zero. Play number cards in any order, applying each operation to the running total.

For example:

- **+8 → −1 → ×8 = 56**
- **+8 → ×8 → −1 = 63**

Operations resolve in the order played rather than conventional BEDMAS precedence.

Players can create positive or negative numbers, experimenting with different sequences to reach their targets.

## 4. Monsters and Doom

Monsters appear in a preset sequence of increasing difficulty.

Each monster displays:

- **🎯 Target:** The exact number required to defeat it.
- **☠ Doom limit:** The number of actions before the final chance.

Face-down cards drawn from the draw pile track accumulated Doom.

A successful Attack defeats the monster. Remove its Doom cards and reveal the next monster with zero Doom.

Defeating a monster also reveals a random treasure, as described in section 6.

### Final Attack

When Doom reaches the monster's limit, the player gets one final Attack.

- A successful Attack defeats the monster.
- A failed Attack ends the game.
- No other actions are available.

### Initial monster sequence

| Monster | 🎯 Target | ☠ Doom limit |
|---|---:|---:|
| 1 | 10 | 6 |
| 2 | 16 | 6 |
| 3 | 36 | 5 |
| 4 | 56 | 4 |
| 5 | −12 | 4 |
| 6 | 98 | 3 |

## 5. The market

Five random number cards from the draw pile are displayed face-up.

Each card has a 🎯 target equal to its numerical value, regardless of its operation.

For example:

- **+4:** 🎯 4
- **×7:** 🎯 7
- **−3:** 🎯 3

Players acquire one card per Buy action by making its target exactly.

Purchased cards enter the player's hand immediately. Their market slots remain empty until Market Refresh is played.

## 6. Treasure and gems

Treasure cards form a separate deck.

Each treasure displays a 🎯 target and a gem reward.

### Revealing treasure

Defeating a monster reveals one random treasure card.

- After monsters 1–5, place the treasure face-up in the **treasure stockpile**.
- Unclaimed treasures remain in the stockpile until the end of the run.
- The stockpile can contain multiple treasures.

### Claiming treasure

Use the Buy action to make a treasure's target exactly.

- Collect the gems shown on the treasure.
- Remove the claimed treasure from the stockpile.
- Discard the number cards used and add one Doom, as with any action.

### Final monster reward

Defeating the final monster reveals one random treasure.

**Collect its gems automatically and win the game.**

### Keeping gems

Gems are permanent rewards. Players keep all gems collected during a run, even if they lose.

## 7. Legacy progression

Gems unlock new content across multiple games.

Locked content is arranged in a fixed sequence of cards, with the next unlock's requirements displayed on its back.

1. Earn gems by claiming treasure or defeating the final monster.
2. Mark the corresponding gem checkboxes on the next locked card.
3. When all requirements are complete, flip the card to reveal the reward.
4. Add the unlocked content to future games and reveal the next unlock.

Unlocked content may include:

- New mathematical cards.
- Alternative starting hands.
- Additional monsters.
- New actions.
- Rule variations.

The progression is permanent, with players marking their unlocks directly on the cards.

Some unlocks may require a second type of currency.

## 8. Draw pile distribution

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

The draw pile supplies market cards and face-down Doom counters. When the draw pile runs out, its discarded cards are reshuffled to form a new draw pile.

Treasure cards are kept in a separate deck.

## 9. Strategy and progression

Players balance three goals:

**Survive:** Make the calculations needed to defeat each monster before Doom runs out.

**Grow stronger:** Acquire number cards to create more mathematical possibilities.

**Collect treasure:** Spend actions on treasure targets to earn gems and unlock permanent rewards.

Early monsters offer more opportunities to build a hand and collect treasure. Later monsters demand more efficient play.

## 10. Winning

Defeat every monster in the sequence to win.

Reveal the final treasure and collect its gems as a victory bonus.

All gems earned during the game contribute to permanent legacy progression, whether the player wins or loses.

## 11. Future possibilities

- Additional mathematical operations, including division.
- New monster sequences and difficulty levels.
- Additional unlockable abilities and rule variations.

---

## 12. Version history

### v0.6

**Changes from v0.5:**

1. **Separate treasure deck.** Treasure cards no longer occupy market slots.
2. **Treasure stockpile.** Defeating each monster except the final monster adds one random treasure to a separate stockpile.
3. **Treasure targets.** Players claim treasures using the Buy action, matching their targets exactly to earn gems.
4. **Permanent gems.** Gems are retained between games, including after defeat.
5. **Final victory reward.** Defeating the final monster awards one random treasure automatically.
6. **Linear legacy progression.** Gems fill checkboxes on a sequence of mystery unlock cards, revealing new content such as starting hands, monsters, actions and rules. Some unlocks may require a second currency.

### v0.5

1. **Actions are always available.** Attack, Buy, Market Refresh and Pickup became actions rather than cards.
2. **Starting hand simplified.** Players begin with +1, +2 and +3.
3. **Buy cards removed.** The draw pile was reduced from 71 to 66 cards.
4. **Final Attack introduced.** Players get one final Attack when Doom reaches its limit.

### v0.4

- Established the original seven-card starting hand and action-card lifecycle.
- Introduced the fixed six-monster progression.
- Defined target-based purchasing, Doom and the weighted 71-card draw pile.