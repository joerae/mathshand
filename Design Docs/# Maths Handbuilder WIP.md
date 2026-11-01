# Maths Handbuilder
**Game Design Document | v0.10**

*A roguelike handbuilding game where maths powers your underwater adventure.*

## 1. Overview

Ride an electric scooter through an underwater world, defeating sea creatures by combining number cards to make exact target numbers.

Build your hand, manage your battery, collect treasure and earn gems to unlock new seas.

The game contains **seven seas (A–G)**, each introducing new mathematical concepts, creatures, scooters and challenges.

**Design principles**

- **Simple:** Minimal rules, with information printed on cards wherever possible.
- **Fun first:** Maths is the game, not a separate quiz.
- **Strategic:** Build a versatile hand and manage limited battery charge.
- **Replayable:** Different cards, scooters and encounters create different adventures.
- **Progressive:** Mathematical difficulty increases across the seven seas.
- **Accessible:** Designed for ages eight and up, with earlier seas suitable for younger players.

## 2. Components

| Component | Purpose |
|---|---|
| A4 instructions | Game rules and sea unlock progression |
| Sea cards | Define encounters, special rules and three repeatable quests |
| Scooter cards | Define starting hand, hand capacity, battery and abilities |
| Number cards | Mathematical operations used to reach targets |
| Fish cards | Encounters with targets and possible special abilities |
| Treasure cards | Optional targets that award gems |
| Battery cards | Double-sided charged/depleted bolt indicators |
| Gem tracker | Records gems earned |

Cards are marked with a small letter (A–G) identifying the sea in which they become available.

Individual card definitions and quantities are maintained in the accompanying spreadsheet.

## 3. Number Cards and Maths

Each number card contains a mathematical operation, such as +3, −5 or ×4.

**Calculations always start at zero.** Players select and arrange cards from their hand, applying operations sequentially in the order played.

For example:

**+3 → ×4 → −2 = 10**

Conventional order-of-operations precedence does not apply.

- Any number of cards may be used, but each physical card can be used only once per calculation.
- Cards can be rearranged freely before committing an action.
- Played cards return to the hand after an action, whether successful or unsuccessful.
- Number cards are reusable and are not normally discarded.

### Hand capacity

Each scooter specifies the maximum number of number cards the player may own.

When purchasing a card at maximum capacity, the player must permanently remove one existing card before adding the new card. This costs no additional battery.

Some fish abilities may also permanently remove cards.

## 4. Actions and Battery

During a normal encounter, players can perform three actions in any order.

| Action | Effect | Cost |
|---|---|---|
| **Attack** | Attempt to match the current fish's target exactly | 1 ⚡ |
| **Buy** | Attempt to purchase a market card or claim treasure | 1 ⚡ |
| **Refresh** | Replace all five market cards | 1 ⚡ |

Every committed action costs one bolt, even if unsuccessful.

### Recharging

Defeating a fish restores the battery to its maximum capacity, unless a fish ability says otherwise.

### Running out of battery

At zero battery, the player gets **one final Attack** against the current fish, at no additional cost.

- **Success:** Defeat the fish and continue normally.
- **Failure:** The adventure ends.

Players cannot Buy or Refresh at zero battery.

Any gems already earned are retained, even when an adventure ends in defeat.

## 5. Market and Treasure

### The market

The market contains up to five number cards drawn from the currently unlocked number-card deck.

To buy a card, make its purchase target exactly using your existing hand. The purchase target is the card's numerical value, regardless of its operation.

For example, +4 costs 4, −5 costs 5 and ×7 costs 7.

- Purchased cards enter the hand immediately.
- Purchased cards leave empty market slots.
- Defeating a fish refills empty slots.
- Refresh replaces all five market cards.
- Refreshed cards enter a market discard pile, which is reshuffled when the draw pile runs out.
- Cards permanently removed from the hand do not return to the market during that adventure.

Card copy quantities control market distribution and are defined in the spreadsheet.

### Treasure

After each defeated fish, reveal one treasure card and add it to the visible stockpile.

Each treasure has a mathematical target and a gem reward.

To claim treasure, make its target exactly and commit a Buy action, spending one bolt. Successful claims award the printed gems and remove that treasure from the stockpile. Failed attempts still cost a bolt.

Unclaimed treasure remains available until claimed, removed by a special ability or the adventure ends.

Later seas introduce more difficult treasures with potentially larger gem rewards.

## 6. Fish and Encounters

Each fish has an exact target number and may have a special ability.

The selected Sea card determines the number of encounters, eligible fish and encounter order.

Early seas have predetermined encounters. From **Sea C**, some seas use randomly selected fish, potentially with fixed opening and final encounters.

For random encounters, select the required fish from the eligible pool, shuffle them into the specified positions and keep upcoming fish face-down. A physical fish card cannot appear twice in an adventure.

Only the current fish is visible. Players cannot see upcoming targets.

### Defeating a fish

When an Attack matches the fish's target:

1. Return played number cards to the hand.
2. Apply any special effects printed on the fish.
3. Recharge the battery, unless modified by a special ability.
4. Refill empty market slots.
5. Reveal one treasure and add it to the stockpile.
6. Advance to the next fish.

The final fish triggers the Victory Lap instead of another encounter.

### Special abilities

Fish may modify normal rules, including preventing battery recharge, permanently removing hand cards, destroying unclaimed treasure or requiring multiple targets.

For example, the Hydra requires two successful Attacks against different targets.

The card specifies the ability and when it takes effect. Fish targets and abilities are defined in the spreadsheet.

## 7. Victory Lap

Defeating the final fish completes the adventure and begins the Victory Lap.

Apply the final fish's normal defeat effects, including battery recharge and revealing its treasure.

During the Victory Lap, players can use their remaining battery to claim treasure from the stockpile.

- Each treasure attempt costs one bolt.
- Players cannot Attack fish, buy market cards or Refresh.
- No additional battery can be earned.
- Treasure gems are never awarded automatically.

The Victory Lap ends when the battery reaches zero, all treasure has been collected or the player chooses to finish.

## 8. Quests

Each Sea card contains **three repeatable quests**, with gem rewards printed alongside them.

- All three quests are active during an adventure in that sea.
- Each quest can be completed once per adventure.
- Earned gems are retained even if the adventure ends in defeat.
- Quests reset each adventure and may be completed again on future visits.

Quests may involve defeating particular fish, collecting treasure, using specific mathematical operations, choosing particular scooters or completing an adventure under certain conditions.

Quest definitions and rewards are maintained in the spreadsheet.

## 9. Your First Adventure

Your first adventure takes place in **Sea A**, using the Starter Scooter.

### Setup

1. **Set aside all cards marked B–G.** You'll unlock these later.
2. Take the **Sea A** card and the **Starter Scooter**.
3. Take your starting hand: **+1, +2 and +3**.
4. Set your battery to **4 ⚡**.
5. Shuffle the available number cards and deal five into the market.
6. Shuffle the treasure deck.
7. Arrange the fish encounters as shown on the Sea A card.
8. Reveal the first fish and begin!

Your Starter Scooter has a maximum hand capacity of seven number cards.

### Playing

Use Attack, Buy and Refresh to defeat fish, strengthen your hand and collect treasure.

Complete the three quests printed on the Sea A card to earn additional gems.

Defeat the final fish to enter the Victory Lap, where you can use your remaining battery to collect unclaimed treasure.

If you run out of battery and fail your final Attack, the adventure ends, but you keep your earned gems.

## 10. The Seven Seas

Each sea introduces new content and mathematical challenges. Newer seas may combine previously learned operations.

| Sea | Mathematical focus | New content and mechanics |
|---|---|---|
| **A** | Basic addition and number bonds | Starting scooter, market, treasure, battery management and fixed encounters |
| **B** | Larger addition and number bonds | Larger addition cards, alternative scooter and fixed encounters |
| **C** | Subtraction and negative numbers | Negative targets, Reverse Gear scooter and randomised fish selection |
| **D** | Basic multiplication | ×2 and ×10, combining positive multiplication with earlier operations |
| **E** | More multiplication | ×3, ×4, ×5 and more demanding combinations |
| **F** | Extended negative combinations | Larger subtraction values and potentially negative multiplication |
| **G** | Extended multiplication | ×6, ×7, ×8, ×9 and more challenging multi-step calculations |

The progression introduces addition, then subtraction and negative numbers, then multiplication. Negative multiplication is introduced only after the basic concepts.

Each sea may also introduce new scooters, fish, treasure and quests.

The exact mathematical values, encounter sequences, fish pools, scooter configurations and quests are specified in the spreadsheet.

## 11. Unlocking and Future Adventures

Earn gems by collecting treasure and completing quests.

Sea A is available from the start. The remaining six seas (B–G) unlock in order, with progress tracked on the A4 instructions.

### Unlocking Sea B

Once you have earned enough gems to unlock Sea B:

1. Mark Sea B as unlocked on the A4 instructions.
2. **Add all cards marked B to the game**, including its scooter, fish, number cards, treasure and Sea card.
3. Choose your next adventure!

The same process applies to Seas C–G as they are unlocked.

### Starting another adventure

For every new adventure:

1. Choose any unlocked sea.
2. Choose any unlocked scooter.
3. Take the scooter's specified starting hand and set its starting battery.
4. Prepare the market and treasure using all unlocked cards.
5. Arrange the encounters according to the selected Sea card.
6. Reveal the first fish.

Unlocked scooters, number cards and treasure may be used across all seas. The selected Sea card determines which fish appear and how encounters are arranged.

Scooters are alternative configurations, not necessarily upgrades. They may offer different starting hands, hand capacities, battery capacities and special abilities.

### Persistent progression

**Keep between adventures:**

- Gems earned.
- Unlocked seas and content.

**Reset each adventure:**

- Current hand and purchased number cards.
- Battery and market.
- Encounter sequence.
- Unclaimed treasure.
- Quest completion.

Gem unlock requirements and whether gems are spent or accumulated towards unlocks will be determined through balancing.

## 12. Design Data and Implementation

The accompanying **All Item Unlocks spreadsheet** is the source of truth for individual content definitions, including:

- Card values, quantities and unlock assignments.
- Scooter configurations and abilities.
- Fish targets, abilities and encounter pools.
- Treasure targets and gem rewards.
- Quest definitions and rewards.
- Sea-specific encounter rules.

This document defines the shared gameplay rules. The spreadsheet defines the content used by those rules.

### Implementation

The game should support data-driven sea definitions and encounters, A–G unlock groups, configurable scooters and markets, addition/subtraction/multiplication, positive and negative targets, special fish abilities, repeatable quests and persistent gem progression.

Implementation may be staged.

### Balancing

The following remain subject to playtesting:

- Gem requirements for sea unlocks.
- Number-card distribution and hand capacities.
- Fish targets, abilities and encounter selection.
- Scooter starting configurations and battery capacities.
- Treasure difficulty, frequency and rewards.
- Quest difficulty and gem payouts.
- The pacing of mathematical progression.

**Version 0.10 | Seven Seas Handbuilder**