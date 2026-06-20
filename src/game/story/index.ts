import type { StoryEvent } from '../types';
import { dayOneEvents } from './day-one-events';
import { dayTwoEvents } from './day-two-events';

const storyDays: { day: number; events: StoryEvent[] }[] = [
  { day: 1, events: dayOneEvents },
  { day: 2, events: dayTwoEvents },
];

export const storyEvents: StoryEvent[] = storyDays.flatMap(storyDay => storyDay.events);
const storyEventDays = new Map(
  storyDays.flatMap(storyDay => storyDay.events.map(event => [event.id, storyDay.day] as const))
);
const storyEventLocations = new Map(storyEvents.map(event => [event.id, event.location]));

export function getInitialStoryDayStart() {
  const firstStoryDay = storyDays[0];
  const firstEvent = firstStoryDay.events[0];

  return {
    day: firstStoryDay.day,
    eventId: firstEvent.id,
  };
}

export function getNextStoryDayStart(currentDay: number) {
  const nextStoryDay = storyDays.find(storyDay => storyDay.day > currentDay);
  const firstEvent = nextStoryDay?.events[0];

  if (!nextStoryDay || !firstEvent) return null;

  return {
    day: nextStoryDay.day,
    eventId: firstEvent.id,
  };
}

export function hasNextStoryDay(day: number) {
  return getNextStoryDayStart(day) !== null;
}

export function getStoryEventDay(eventId: string) {
  return storyEventDays.get(eventId) ?? null;
}

export function getStoryEventLocation(eventId: string) {
  return storyEventLocations.get(eventId) ?? null;
}
