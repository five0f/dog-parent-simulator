import { initialDecisionMemory } from './initial-state';
import { clamp } from './math';
import { createInitialGameState } from './state-factory';
import { normalizeState } from './state-normalization';
import { getStoryEventDay, getStoryEventLocation } from './story';
import { hasStoryEvent } from './story/registry';
import {
  choiceVariants,
  dogPoses,
  type GamePhase,
  gamePhases,
  type GameState,
  locationIds,
  type PendingResult,
  type SceneObjectId,
  sceneObjectIds,
} from './types';

type NumberRecord<T> = { [Key in keyof T]: number };

export function sanitizeGameState(value: unknown): GameState {
  const savedState = isRecord(value) ? value : {};
  const initialState = createInitialGameState();
  const currentEventId =
    typeof savedState.currentEventId === 'string' && hasStoryEvent(savedState.currentEventId)
      ? savedState.currentEventId
      : initialState.currentEventId;
  const currentEventDay = getStoryEventDay(currentEventId) ?? initialState.day;
  const pendingResult = sanitizePendingResult(savedState.pendingResult);
  const phase = getSafePhase(savedState.phase, pendingResult);
  const savedLocation = isOneOf(savedState.location, locationIds)
    ? savedState.location
    : initialState.location;

  return normalizeState({
    ...initialState,
    completedEventIds: sanitizeStoryEventIdList(savedState.completedEventIds),
    currentEventId,
    day: currentEventDay,
    dayStartSkills: sanitizeScoreRecord(initialState.dayStartSkills, savedState.dayStartSkills),
    dayStartTraitIds: sanitizeUniqueStringList(savedState.dayStartTraitIds),
    decisionMemory: sanitizeDecisionMemory(savedState.decisionMemory),
    flags: sanitizeFlags(savedState.flags),
    goals: initialState.goals,
    journal: sanitizeJournal(savedState.journal, initialState.journal),
    location: sanitizeLocationForPhase(phase, currentEventId, savedLocation),
    pendingResult: phase === 'result' ? pendingResult : null,
    personalityTraits: initialState.personalityTraits,
    phase,
    skills: sanitizeScoreRecord(initialState.skills, savedState.skills),
    stats: sanitizeScoreRecord(initialState.stats, savedState.stats),
    timeLabel: sanitizeText(savedState.timeLabel, initialState.timeLabel),
    traits: sanitizeScoreRecord(initialState.traits, savedState.traits),
  });
}

function getSafePhase(phase: unknown, pendingResult: PendingResult | null): GamePhase {
  if (!isOneOf(phase, gamePhases)) return 'event';
  if (phase === 'result' && !pendingResult) return 'event';
  return phase;
}

function sanitizeLocationForPhase(
  phase: GamePhase,
  currentEventId: string,
  savedLocation: GameState['location']
): GameState['location'] {
  if (phase === 'daySummary') return savedLocation;

  return getStoryEventLocation(currentEventId) ?? savedLocation;
}

function sanitizePendingResult(value: unknown): PendingResult | null {
  if (!isRecord(value)) return null;
  const choiceId = value.choiceId;
  const completeDay = value.completeDay;
  const dogPose = value.dogPose;
  const nextEventId = value.nextEventId;
  const nextLocation = value.nextLocation;
  const resultText = value.resultText;
  const sceneObjects = value.sceneObjects;
  const storyChanges = value.storyChanges;
  const variant = value.variant;

  if (
    !isNonEmptyString(choiceId) ||
    !isNonEmptyString(resultText) ||
    !isNonEmptyString(nextEventId) ||
    !Array.isArray(storyChanges) ||
    !isOneOf(variant, choiceVariants) ||
    !isOneOf(dogPose, dogPoses) ||
    !hasStoryEvent(nextEventId) ||
    !isOneOf(nextLocation, locationIds)
  ) {
    return null;
  }

  return {
    choiceId,
    completeDay: completeDay === true,
    dogPose,
    nextEventId,
    nextLocation,
    resultText,
    sceneObjects: sanitizeSceneObjectList(sceneObjects),
    storyChanges: sanitizeStringList(storyChanges),
    variant,
  };
}

function sanitizeScoreRecord<T extends NumberRecord<T>>(initialValues: T, value: unknown): T {
  const nextValues = { ...initialValues };
  if (!isRecord(value)) return nextValues;

  for (const key of Object.keys(initialValues) as (keyof T)[]) {
    const nextValue: unknown = value[String(key)];
    if (typeof nextValue === 'number' && Number.isFinite(nextValue)) {
      nextValues[key] = clamp(nextValue) as T[keyof T];
    }
  }

  return nextValues;
}

function sanitizeCounterRecord<T extends NumberRecord<T>>(initialValues: T, value: unknown): T {
  const nextValues = { ...initialValues };
  if (!isRecord(value)) return nextValues;

  for (const key of Object.keys(initialValues) as (keyof T)[]) {
    const nextValue: unknown = value[String(key)];
    if (typeof nextValue === 'number' && Number.isFinite(nextValue)) {
      nextValues[key] = Math.max(0, Math.floor(nextValue)) as T[keyof T];
    }
  }

  return nextValues;
}

function sanitizeDecisionMemory(value: unknown): GameState['decisionMemory'] {
  const memory = sanitizeCounterRecord(initialDecisionMemory, value);
  if (!isRecord(value)) return memory;

  // Preserve older saves created before the resource-take counter was renamed.
  const legacyResourceTakeCount = value.tookSockByForce;
  if (
    memory.tookResourceByForce === 0 &&
    typeof legacyResourceTakeCount === 'number' &&
    Number.isFinite(legacyResourceTakeCount)
  ) {
    memory.tookResourceByForce = Math.max(0, Math.floor(legacyResourceTakeCount));
  }

  return memory;
}

function sanitizeFlags(value: unknown): GameState['flags'] {
  if (!isRecord(value)) return {};

  const entries: [string, boolean | number | string][] = [];
  for (const [key, flagValue] of Object.entries(value)) {
    if (typeof flagValue === 'boolean' || typeof flagValue === 'string') {
      entries.push([key, flagValue]);
      continue;
    }

    if (typeof flagValue === 'number' && Number.isFinite(flagValue)) {
      entries.push([key, flagValue]);
    }
  }

  return Object.fromEntries(entries);
}

function sanitizeJournal(value: unknown, fallback: string[]) {
  const journal = sanitizeStringList(value);
  return journal.length ? journal : fallback;
}

function sanitizeSceneObjectList(value: unknown): SceneObjectId[] {
  if (!Array.isArray(value)) return [];

  const objectIds = new Set<SceneObjectId>();
  for (const item of value) {
    if (isOneOf(item, sceneObjectIds)) {
      objectIds.add(item);
    }
  }

  return [...objectIds];
}

function sanitizeStoryEventIdList(value: unknown): string[] {
  return sanitizeUniqueStringList(value).filter(hasStoryEvent);
}

function sanitizeUniqueStringList(value: unknown): string[] {
  return Array.from(new Set(sanitizeStringList(value)));
}

function sanitizeStringList(value: unknown): string[] {
  return Array.isArray(value) ? value.filter(isNonEmptyString) : [];
}

function sanitizeText(value: unknown, fallback: string) {
  return isNonEmptyString(value) ? value : fallback;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function isOneOf<T extends string>(value: unknown, options: readonly T[]): value is T {
  return typeof value === 'string' && options.includes(value as T);
}
