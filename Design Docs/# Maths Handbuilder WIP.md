# Maths Handbuilder WIP

**Game Design Document | v0.5**

*A roguelike handbuilding game where maths is your weapon.*

## 1. Overview

Defeat a sequence of monsters by combining cards to make exact target numbers.

Build a powerful hand, discover clever mathematical combinations, and prepare for increasingly dangerous monsters.

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
| **Buy** | Make a market card's 🎯 target to add it to your hand. |
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

Five random cards from the draw pile are displayed face-up.

Each card has a 🎯 target equal to its numerical value, regardless of its operation.

For example:

- **+4:** 🎯 4
- **×7:** 🎯 7
- **−3:** 🎯 3

Players acquire one card per Buy action by making its target exactly.

Purchased cards enter the player's hand immediately. Their market slots remain empty until Market Refresh is played.

## 6. Draw pile distribution

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

## 7. Strategy and progression

The player balances two goals:

**Survive:** Find the right calculations to defeat each monster before Doom runs out.

**Grow stronger:** Acquire cards and improve the hand to tackle increasingly difficult targets.

Early monsters have generous Doom limits, allowing players to invest actions in improving their hands. Later monsters demand more powerful combinations and efficient play.

Every purchase costs one Doom, creating a trade-off between growing stronger and surviving the current monster.

## 8. Winning

Defeat every monster in the sequence to win.

## 9. Future possibilities

Potential additions outside the initial prototype:

- Additional actions and unlockable abilities.
- Division and other mathematical operations.
- Alternative monster sequences and difficulty levels.

---

## 10. Version history

### v0.5

**Changes from v0.4:**

1. **Actions are always available.** Attack, Buy, Market Refresh and Pickup are now actions rather than cards. Players no longer need to recover an action card before using that action again.
2. **Starting hand simplified.** Players begin with +1, +2 and +3, rather than seven cards containing four action cards.
3. **Buy cards removed from the draw pile.** The five Buy cards have been removed, reducing the draw pile from 71 to 66 cards.
4. **Final Attack introduced.** When Doom reaches a monster's limit, the player may make one final Attack. A success advances to the next monster; a failure ends the game. No other actions are available during this final chance.

### v0.4

- Established the original seven-card starting hand and action-card lifecycle.
- Introduced the fixed six-monster progression.
- Defined target-based purchasing, Doom and the weighted 71-card draw pile.