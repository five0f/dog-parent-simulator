import type { DogAchievementId, DogHabitId, DogProblemId } from '../types';

export const habitLabels: Record<DogHabitId, string> = {
  holds_until_walk: 'Терпит до прогулки',
  calm_leash: 'Спокойно гуляет на поводке',
  ignores_ground_food: 'Игнорирует еду на земле',
  comes_when_called: 'Подходит по команде',
  calm_dogs: 'Спокойно знакомится с собаками',
  stays_home_alone: 'Хорошо остаётся дома один',
};

export const problemLabels: Record<DogProblemId, string> = {
  doesnt_hold_walk: 'Не терпит до прогулки',
  pulls_leash: 'Тянет поводок',
  picks_food: 'Подбирает еду',
  fear_dogs: 'Боится собак',
  fear_noises: 'Лает на шумы',
  sock_thief: 'Ворует носки',
  separation_anxiety: 'Боится оставаться один',
};

export const achievementLabels: Record<DogAchievementId, string> = {
  first_calm_dog_intro: 'Первый раз спокойно познакомился с собакой',
  first_ignored_food: 'Первый раз прошёл мимо еды',
  first_quiet_day: 'Первый день без происшествий',
  learned_hold_walk: 'Научился терпеть до прогулки',
  brave_with_noise: 'Перестал бояться громких звуков',
  stick_memory: 'Помнит ту самую палку',
};
