# Dog development system

Version: 1.0

## Overview

Bublik is not a static character. Bublik changes based on player decisions.

Every action affects:

- needs
- habits
- behavior problems
- personality traits

The goal of the game is not to maximize numbers. The goal is to raise a well-adjusted dog.

Different players should end up with completely different Bubliks.

## Development layers

The dog development system consists of three layers:

1. Needs
2. Behavior problems
3. Personality traits

## Layer 1: needs

Needs are short-term states. They change every day and create situations and events.

### Walk need

Represents the dog's need to go outside.

If low, possible events include:

- Bublik sits by the door
- Bublik brings the leash
- Bublik waits near the entrance
- Bublik becomes restless

If ignored repeatedly, it may create behavior problems.

### Rest need

Represents the dog's need for recovery.

If low, possible events include:

- Bublik falls asleep unexpectedly
- Bublik ignores activities
- Bublik becomes irritable

### Social need

Represents interaction with dogs and people.

If low, possible events include:

- Bublik becomes cautious
- Bublik avoids contact
- Bublik struggles with new situations

## Layer 2: behavior problems

Problems are not random. Problems are created by repeated player behavior and can be fixed through
proper training.

### Does not hold until walk

Cause: repeatedly ignoring requests to go outside.

Example chain:

1. Bublik asks for a walk.
2. Player ignores.
3. Player ignores again.
4. Player ignores again.
5. Accident at home.
6. Problem unlocked.

Effects:

- More accidents
- More urgency events
- Reduced trust

Fix:

- Respond consistently to walk requests.
- Reward successful outdoor toilet behavior.

After repeated success, the problem is removed.

### Pulls on leash

Cause:

- Player repeatedly rushes walks.
- Player never rewards calm walking.

Effects:

- Walk events become harder.
- Control in park events is reduced.

Fix:

- Reward calm behavior.
- Choose training-oriented decisions.

### Picks up food from ground

Cause: player repeatedly allows suspicious food interactions.

Effects:

- New risky park events
- Increased chance of negative outcomes

Fix:

- Consistent redirection.
- Reward ignoring food.

### Fear of dogs

Cause:

- Negative social experiences
- Punishment during introductions
- Forced interactions

Effects:

- Avoidance events
- Stress during social encounters

Fix:

- Positive introductions.
- Gradual exposure.
- Reward calm behavior.

### Fear of loud noises

Cause: repeated stressful situations without support.

Effects:

- Panic during storms
- Panic during fireworks
- Refusal to walk

Fix:

- Supportive responses.
- Confidence-building events.

## Layer 3: personality traits

Traits change slowly. Traits define who Bublik becomes.

Traits affect:

- event generation
- event outcomes
- learning speed

### Confidence

High confidence:

- approaches dogs
- approaches people
- learns faster

Low confidence:

- avoids interaction
- hesitates more often

### Curiosity

High curiosity:

- investigates objects
- discovers new events
- finds unusual situations

Low curiosity:

- ignores many opportunities

### Friendliness

High friendliness:

- enjoys social events
- gains trust faster

Low friendliness:

- prefers distance

### Stubbornness

High stubbornness:

- ignores commands
- creates funny situations

Low stubbornness:

- follows instructions more easily

### Calmness

High calmness:

- better emotional stability
- fewer stress reactions

Low calmness:

- stronger reactions
- more impulsive behavior

## Development philosophy

Players should not think: "My mood bar increased by 5."

Players should think:

- "Bublik stopped pulling the leash."
- "Bublik finally trusts other dogs."
- "Bublik learned to wait calmly."
- "Bublik became more confident."

## Long-term goal

The player's dog should feel unique.

After 30 in-game days, one player's Bublik may be confident, friendly, and calm. Another player's
Bublik may be stubborn, anxious, and reactive.

Both outcomes should be valid.

The game should reflect the player's choices rather than force a single correct dog.
