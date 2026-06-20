# Additional design rules

## Time system

The game uses explicit story phases rather than a continuous clock.

Phases:

- `event`
- `result`
- `daySummary`

Display time is derived from the current location and state label.

Examples:

- `home_morning` -> morning label from state
- `park` -> day
- `home_after_walk` -> evening

When a day summary has a registered next story day, the player may start it.

## Daily structure

Each story day is explicit in `src/game/story/index.ts`.

Current prototype:

- Day 1 starts at `sock`
- Day 2 starts at `day2-sock`

Goal: short play sessions of 5-15 minutes.

## Event schema

Every event must contain:

- `id`
- `title`
- `description`
- `choices`

Optional fields:

- `dogPose`
- `sceneObjects`

Example:

```ts
{
  id: 'stick_found',
  location: 'park',
  title: 'Bublik found a stick',
  description: 'Bublik is extremely proud of this stick.',
  choices: [],
}
```

## Choice schema

Each choice contains:

- `id`
- `label`
- `variant`
- `outcome`

Each outcome contains:

- `resultText`
- `effects`
- `journal`

Optional outcome fields:

- `storyChanges`
- `dogPose`
- `sceneObjects`
- `nextEventId`
- `nextLocation`
- `completeDay`

Example:

```ts
{
  id: 'trade-stick',
  label: 'Play with him',
  variant: 'positive',
  outcome: {
    resultText: 'Bublik is delighted.',
    effects: {
      stats: { trust: 2 },
    },
    journal: 'Bublik played with the stick.',
  },
}
```

## Trait influence

Traits should modify:

- story text
- choice outcomes
- day summaries
- unlocked trait badges

## Content first rule

The game should always prioritize new situations over new systems.

When choosing between adding a feature and adding 20 new events, prefer adding events.

Content is the product.

## Development priority

Priority order:

1. Event system
2. Choice system
3. Trait system
4. Time system
5. Home location
6. Park location
7. Additional locations
8. Additional mechanics

Do not introduce new systems before the previous layer is complete.
