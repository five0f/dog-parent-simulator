import type { GameState, ResolvedStoryEvent, StoryEvent, StoryText } from '../types';
import { storyEvents } from '.';

const eventsById = Object.fromEntries(storyEvents.map(event => [event.id, event])) as Partial<
  Record<string, StoryEvent>
>;

export function getCurrentEvent(state: GameState): ResolvedStoryEvent {
  const event = eventsById[state.currentEventId] ?? eventsById.sock;

  if (!event) {
    throw new Error('Fallback story event is missing');
  }

  return resolveEvent(event, state);
}

export function hasStoryEvent(eventId: string) {
  return Boolean(eventsById[eventId]);
}

function resolveEvent(event: StoryEvent, state: GameState): ResolvedStoryEvent {
  return {
    ...event,
    description: resolveStoryText(event.description, state),
    dogPose: event.dogPose ?? 'idle',
    sceneObjects: event.sceneObjects ?? [],
    title: resolveStoryText(event.title, state),
  };
}

function resolveStoryText(text: StoryText, state: GameState): string {
  return typeof text === 'function' ? text(state) : text;
}
