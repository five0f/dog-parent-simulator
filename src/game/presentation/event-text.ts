import type { LocationId } from '../types';

export function getDisplayTimeLabel(location: LocationId, timeLabel: string) {
  if (location === 'park') return 'День';
  if (location === 'home_after_walk') return 'Вечер';
  return timeLabel;
}

export function getResultText(resultText: string, storyChanges: string[]) {
  const [firstSentence, ...restSentences] = resultText.split(/(?<=\.)\s+/);
  const subtitle = restSentences.join(' ') || storyChanges[0] || '';

  return {
    subtitle,
    title: firstSentence || resultText,
  };
}
