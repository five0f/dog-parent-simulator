import type { DogStatId } from '../types';

export const alwaysVisibleTraits = ['Любитель носков', 'Липучка', 'Спокойный пёс'];

export function getTrustHeartCount(value: number) {
  return Math.max(0, Math.min(5, Math.round(value / 20)));
}

export function getStatStateText(id: DogStatId, value: number) {
  if (id === 'trust') {
    if (value >= 75) return 'высокое';
    if (value >= 50) return 'бережное';
    return 'хрупкое';
  }

  if (id === 'stress') {
    if (value <= 25) return 'низкий';
    if (value <= 50) return 'средний';
    return 'высокий';
  }

  if (id === 'energy') {
    if (value >= 70) return 'бодрый';
    if (value >= 35) return 'держится';
    return 'устал';
  }

  if (id === 'hunger') {
    if (value <= 30) return 'терпимо';
    if (value <= 65) return 'голоден';
    return 'очень голоден';
  }

  if (id === 'walkNeed') {
    if (value <= 35) return 'спокойно';
    if (value <= 70) return 'скоро пора';
    return 'срочно гулять';
  }

  if (value <= 35) return 'наигрался';
  if (value <= 70) return 'хочет внимания';
  return 'ищет приключения';
}

export function getSkillStateText(value: number) {
  if (value >= 50) return 'уверенно';
  if (value >= 20) return 'учится';
  return 'пока сложно';
}
