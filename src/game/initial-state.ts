import type {
  DayGoal,
  DecisionMemory,
  DogSkillId,
  DogSkills,
  DogStatId,
  DogStats,
  DogTraitBadge,
  DogTraits,
} from './types';

export const statLabels: Record<DogStatId, string> = {
  trust: 'Доверие',
  energy: 'Энергия',
  stress: 'Стресс',
  hunger: 'Голод',
  walkNeed: 'Прогулка',
  playNeed: 'Игра',
};

export const skillLabels: Record<DogSkillId, string> = {
  fetch: 'Апорт',
  heel: 'Рядом',
  place: 'Место',
  sit: 'Сидеть',
};

export const initialStats: DogStats = {
  energy: 70,
  hunger: 35,
  playNeed: 45,
  stress: 22,
  trust: 65,
  walkNeed: 55,
};

export const initialSkills: DogSkills = {
  fetch: 5,
  heel: 10,
  place: 15,
  sit: 25,
};

export const initialTraits: DogTraits = {
  attachment: 52,
  confidence: 50,
  impulsivity: 45,
  leashBehavior: 60,
  resourceGuarding: 20,
  toiletHabit: 70,
};

export const initialDecisionMemory: DecisionMemory = {
  praisedSock: 0,
  ignoredSock: 0,
  tookResourceByForce: 0,
  chasedPigeons: 0,
  redirectedPigeons: 0,
  pulledLeash: 0,
  ateTrash: 0,
  redirectedTrash: 0,
  punishedDog: 0,
  calmChoices: 0,
};

export const dayGoals: DayGoal[] = [
  {
    id: 'calmMorning',
    label: 'Помочь Бублику спокойно начать день',
    status: 'in_progress',
    reason: 'Бублик только проснулся. Пока утро можно провести спокойно.',
    completed: false,
  },
  {
    id: 'keepTrust',
    label: 'Сохранить доверие, когда Бублик делает глупости',
    status: 'in_progress',
    reason: 'Пока ты не ругал Бублика и не забирал вещи резко.',
    completed: false,
  },
  {
    id: 'homeSafe',
    label: 'Не дать квартире стать зоной бедствия',
    status: 'in_progress',
    reason: 'Дома пока нет луж, разгрызенных вещей или другого ущерба.',
    completed: false,
  },
  {
    id: 'noNewFear',
    label: 'Вернуться с прогулки без нового страха',
    status: 'in_progress',
    reason: 'Прогулка ещё впереди. Главное — без резких действий и лишнего стресса.',
    completed: false,
  },
];

export const traitBadgeDefinitions: Omit<DogTraitBadge, 'level' | 'unlocked'>[] = [
  {
    id: 'sock-thief',
    title: 'Вор носков',
    description: 'Бублик считает носки своей законной добычей.',
  },
  {
    id: 'pigeon-fan',
    title: 'Любитель голубей',
    description: 'Голуби занимают важное место в мировоззрении Бублика.',
  },
  {
    id: 'street-vacuum',
    title: 'Пылесос улиц',
    description: 'Бублик уверен, что всё на земле существует для дегустации.',
  },
  {
    id: 'calm-dog',
    title: 'Спокойный пёс',
    description: 'Бублик стал спокойнее реагировать на странности мира.',
  },
  {
    id: 'anxious-dog',
    title: 'Тревожный пёс',
    description: 'Бублик стал осторожнее и чаще ждёт подвоха.',
  },
  {
    id: 'velcro-dog',
    title: 'Липучка',
    description: 'Бублик предпочитает держаться рядом с тобой.',
  },
];
