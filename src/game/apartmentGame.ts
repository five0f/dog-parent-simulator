export type LocationId = 'home_morning' | 'park' | 'home_after_walk';
export type LocationTab = 'home' | 'park';
export type DogPose = 'idle' | 'sit' | 'sleep' | 'happy' | 'stressed' | 'sock' | 'leashPull' | 'sniff';
export type SceneObjectId = 'pigeonIdle' | 'pigeonPeck' | 'pigeonFly' | 'bread' | 'stick' | 'tennisBall' | 'trashBag';
export type ChoiceVariant = 'positive' | 'neutral' | 'negative';
export type DogStatId = 'trust' | 'energy' | 'hunger' | 'stress' | 'walkNeed' | 'playNeed';
export type DogSkillId = 'sit' | 'heel' | 'fetch' | 'place';
export type DogTraitId = 'confidence' | 'impulsivity' | 'resourceGuarding' | 'toiletHabit' | 'leashBehavior' | 'attachment';
export type DayGoalId = 'calmMorning' | 'keepTrust' | 'apartmentSafe' | 'noNewFear';
export type GoalStatus = 'in_progress' | 'done' | 'failed' | 'at_risk';
export type GamePhase = 'event' | 'result' | 'daySummary';

type StoryText = string | ((state: GameState) => string);

export type DogStats = Record<DogStatId, number>;
export type DogSkills = Record<DogSkillId, number>;
export type DogTraits = Record<DogTraitId, number>;

export interface DecisionMemory {
  praisedSock: number;
  ignoredSock: number;
  tookSockByForce: number;
  chasedPigeons: number;
  redirectedPigeons: number;
  pulledLeash: number;
  ateTrash: number;
  redirectedTrash: number;
  punishedDog: number;
  calmChoices: number;
}

export interface DogTraitBadge {
  id: string;
  title: string;
  description: string;
  level: number;
  unlocked: boolean;
}

export interface MeterState {
  id: DogStatId;
  title: string;
  value: number;
}

export interface SkillState {
  id: DogSkillId;
  title: string;
  value: number;
}

export interface DayGoal {
  id: DayGoalId;
  label: string;
  status: GoalStatus;
  reason: string;
  completed: boolean;
}

export interface ChoiceEffect {
  stats?: Partial<Record<DogStatId, number>>;
  skills?: Partial<Record<DogSkillId, number>>;
  traits?: Partial<Record<DogTraitId, number>>;
  memory?: Partial<Record<keyof DecisionMemory, number>>;
  flags?: Record<string, boolean | number | string>;
  flagDeltas?: Record<string, number>;
}

export interface ChoiceOutcome {
  resultText: string;
  storyChanges?: string[];
  effects: ChoiceEffect;
  journal: string;
  dogPose?: DogPose;
  sceneObjects?: SceneObjectId[];
  nextEventId?: string;
  nextLocation?: LocationId;
  completeDay?: boolean;
}

export interface EventChoice {
  id: string;
  label: string;
  variant: ChoiceVariant;
  outcome: ChoiceOutcome | ((state: GameState) => ChoiceOutcome);
}

export interface StoryEvent {
  id: string;
  location: LocationId;
  title: StoryText;
  description: StoryText;
  dogPose?: DogPose;
  sceneObjects?: SceneObjectId[];
  choices: EventChoice[];
}

export interface ResolvedStoryEvent extends Omit<StoryEvent, 'title' | 'description' | 'dogPose' | 'sceneObjects'> {
  title: string;
  description: string;
  dogPose: DogPose;
  sceneObjects: SceneObjectId[];
}

export interface PendingResult {
  choiceId: string;
  variant: ChoiceVariant;
  resultText: string;
  storyChanges: string[];
  changes: string[];
  dogPose: DogPose;
  sceneObjects: SceneObjectId[];
  nextEventId: string;
  nextLocation: LocationId;
  completeDay: boolean;
}

export interface GameState {
  day: number;
  timeLabel: string;
  location: LocationId;
  phase: GamePhase;
  stats: DogStats;
  skills: DogSkills;
  traits: DogTraits;
  decisionMemory: DecisionMemory;
  personalityTraits: DogTraitBadge[];
  currentEventId: string;
  completedEventIds: string[];
  journal: string[];
  goals: DayGoal[];
  flags: Record<string, boolean | number | string>;
  pendingResult: PendingResult | null;
  dayStartSkills: DogSkills;
  dayStartTraitIds: string[];
}

export interface DaySummary {
  title: string;
  storyLines: string[];
  reinforcedLines: string[];
  newTraits: DogTraitBadge[];
  goalSummaries: Array<{
    label: string;
    status: GoalStatus;
    explanation: string;
  }>;
  skillChanges: string[];
  journal: string[];
}

const storageKey = 'dog-owner-first-day-v3';

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

const traitLabels: Record<DogTraitId, string> = {
  attachment: 'Привязанность',
  confidence: 'Уверенность',
  impulsivity: 'Импульсивность',
  leashBehavior: 'Поведение на поводке',
  resourceGuarding: 'Охрана ресурсов',
  toiletHabit: 'Туалетная привычка',
};

const initialStats: DogStats = {
  energy: 70,
  hunger: 35,
  playNeed: 45,
  stress: 22,
  trust: 65,
  walkNeed: 55,
};

const initialSkills: DogSkills = {
  fetch: 5,
  heel: 10,
  place: 15,
  sit: 25,
};

const initialTraits: DogTraits = {
  attachment: 52,
  confidence: 50,
  impulsivity: 45,
  leashBehavior: 60,
  resourceGuarding: 20,
  toiletHabit: 70,
};

const initialDecisionMemory: DecisionMemory = {
  praisedSock: 0,
  ignoredSock: 0,
  tookSockByForce: 0,
  chasedPigeons: 0,
  redirectedPigeons: 0,
  pulledLeash: 0,
  ateTrash: 0,
  redirectedTrash: 0,
  punishedDog: 0,
  calmChoices: 0,
};

const dayGoals: DayGoal[] = [
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
    id: 'apartmentSafe',
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

const traitBadgeDefinitions: Array<Omit<DogTraitBadge, 'level' | 'unlocked'>> = [
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

export const events: StoryEvent[] = [
  {
    id: 'sock',
    location: 'home_morning',
    title: 'Бублик принёс тебе носок.',
    description: 'Гордый, как будто это диплом.',
    dogPose: 'sock',
    choices: [
      {
        id: 'exchange-sock',
        label: 'Похвалить и обменять',
        variant: 'positive',
        outcome: {
          resultText: 'Ты похвалил Бублика и обменял носок на игрушку. Бублик решил, что дипломатия работает.',
          storyChanges: [
            'Бублик понял, что найденное можно спокойно обменять.',
            'Доверия стало больше: с ним договорились, а не отобрали.',
            'Игровой азарт ушёл в безопасную сторону.',
          ],
          effects: {
            memory: { praisedSock: 1, calmChoices: 1 },
            stats: { playNeed: -8, trust: 7 },
            skills: { fetch: 6 },
            traits: { resourceGuarding: -3 },
          },
          dogPose: 'happy',
          journal: 'Бублик принёс носок, а ты спокойно обменял его на игрушку.',
          nextEventId: 'leash',
        },
      },
      {
        id: 'take-sock',
        label: 'Просто забрать носок',
        variant: 'negative',
        outcome: {
          resultText: 'Ты забрал носок. Бублик запомнил, что добычу могут отнять без переговоров.',
          storyChanges: [
            'Бублик насторожился: важные находки могут исчезнуть без предупреждения.',
            'Доверие просело, а напряжение выросло.',
            'Охранять вещи стало чуть важнее.',
          ],
          effects: {
            flags: { harshObjectTake: true },
            memory: { tookSockByForce: 1 },
            stats: { stress: 7, trust: -5 },
            traits: { resourceGuarding: 8 },
          },
          dogPose: 'stressed',
          journal: 'Ты резко забрал у Бублика носок.',
          nextEventId: 'leash',
        },
      },
      {
        id: 'ignore-sock',
        label: 'Сделать вид, что не заметил',
        variant: 'neutral',
        outcome: {
          resultText: 'Бублик остался один на один с носком. Носок проиграл.',
          storyChanges: [
            'Бублик решил, что носки — самостоятельная игра.',
            'Квартира стала ближе к маленькой катастрофе.',
            'Импульсивность получила подкрепление.',
          ],
          effects: {
            flags: { homeDamage: true, sockChewed: true },
            memory: { ignoredSock: 1 },
            stats: { playNeed: 6 },
            traits: { impulsivity: 5 },
          },
          dogPose: 'sock',
          journal: 'Ты проигнорировал носок, и Бублик начал его жевать.',
          nextEventId: 'leash',
        },
      },
    ],
  },
  {
    id: 'leash',
    location: 'home_morning',
    title: 'Бублик смотрит на поводок.',
    description: 'Бублик сел у двери и смотрит на поводок. Очень официально.',
    dogPose: 'sit',
    choices: [
      {
        id: 'go-walk',
        label: 'Пойти гулять',
        variant: 'positive',
        outcome: {
          resultText: 'Ты взял поводок. Бублик включил режим ракеты у двери.',
          storyChanges: [
            'Бублик почувствовал, что его поняли.',
            'Напряжение из-за прогулки снизилось.',
            'Он немного устал от возбуждения перед выходом.',
          ],
          effects: {
            memory: { calmChoices: 1 },
            stats: { energy: -5, trust: 5, walkNeed: -20 },
          },
          dogPose: 'leashPull',
          journal: 'Ты вовремя вывел Бублика на прогулку.',
          nextEventId: 'pigeon-bread',
          nextLocation: 'park',
        },
      },
      {
        id: 'later-walk',
        label: 'Сказать "потом"',
        variant: 'negative',
        outcome: (state) => {
          const walkIgnoredCount = Number(state.flags.walkIgnoredCount ?? 0) + 1;
          const nextWalkNeed = state.stats.walkNeed + 15;
          const puddleRisk = walkIgnoredCount >= 2 || nextWalkNeed >= 80;

          return {
            resultText: 'Ты сказал "потом". Бублик записал это в маленький блокнот обид.',
            storyChanges: puddleRisk
              ? [
                  'Бублик слишком долго ждал и уже почти не справляется.',
                  'Квартира оказалась под угрозой.',
                  'Доверие немного просело: просьбу не услышали.',
                ]
              : [
                  'Бублик остался ждать у двери и стал тревожнее.',
                  'Потребность в прогулке стала острее.',
                  'Он ещё держится, но утро перестало быть спокойным.',
                ],
            effects: {
              flagDeltas: { walkIgnoredCount: 1 },
              flags: puddleRisk ? { puddleRisk: true } : undefined,
              stats: { stress: 5, trust: -3, walkNeed: 15 },
            },
            dogPose: 'stressed',
            journal: puddleRisk ? 'Бублик уже слишком долго ждёт прогулку.' : 'Ты отложил прогулку, и Бублик остался ждать у двери.',
            nextEventId: puddleRisk ? 'puddle' : 'leash',
          };
        },
      },
      {
        id: 'distract-play',
        label: 'Отвлечь игрой',
        variant: 'neutral',
        outcome: (state) => {
          const nextWalkNeed = state.stats.walkNeed + 8;
          const puddleRisk = Boolean(state.flags.puddleRisk) || nextWalkNeed >= 80;

          return {
            resultText: 'Ты попробовал отвлечь Бублика игрой. Ему весело, но туалетную проблему это не отменило.',
            storyChanges: [
              'Играть было приятно, но прогулка всё ещё нужна.',
              'Часть энергии ушла в игру.',
              puddleRisk ? 'Ожидание уже стало опасным для квартиры.' : 'Бублик немного отвлёкся, но продолжает помнить про дверь.',
            ],
            effects: {
              flags: puddleRisk ? { puddleRisk: true } : undefined,
              memory: { calmChoices: 1 },
              stats: { energy: -8, playNeed: -10, walkNeed: 8 },
            },
            dogPose: 'happy',
            journal: 'Ты отвлёк Бублика игрой вместо прогулки.',
            nextEventId: puddleRisk ? 'puddle' : 'leash',
          };
        },
      },
    ],
  },
  {
    id: 'puddle',
    location: 'home_morning',
    title: 'Бублик сделал лужу у двери.',
    description: 'Вид у него такой, будто он сам не рад этому проекту.',
    dogPose: 'stressed',
    choices: [
      {
        id: 'clean-and-walk',
        label: 'Спокойно убрать и выйти гулять',
        variant: 'positive',
        outcome: {
          resultText: 'Ты спокойно убрал лужу и всё равно пошёл гулять. Бублик немного выдохнул.',
          storyChanges: [
            'Бублик не испугался твоей реакции.',
            'Доверие сохранилось, но квартира уже пережила происшествие.',
            'Туалетная привычка получила неприятный урок ожидания.',
          ],
          effects: {
            flags: { homeDamage: true, puddleHappened: true, puddleRisk: false },
            memory: { calmChoices: 1 },
            stats: { stress: -3, trust: 2, walkNeed: -30 },
            traits: { toiletHabit: -5 },
          },
          dogPose: 'sit',
          journal: 'Бублик сделал лужу, но ты не стал его ругать.',
          nextEventId: 'pigeon-bread',
          nextLocation: 'park',
        },
      },
      {
        id: 'scold-puddle',
        label: 'Наругать',
        variant: 'negative',
        outcome: {
          resultText: 'Ты наругал Бублика. Он не понял, как это связано с прогулкой, но понял, что дома стало страшнее.',
          storyChanges: [
            'Бублик испугался и не понял, как исправить ситуацию.',
            'Доверие резко просело.',
            'Дом стал для него менее безопасным местом.',
          ],
          effects: {
            flags: { homeDamage: true, puddleHappened: true, puddleRisk: false, scoldedBublik: true },
            memory: { punishedDog: 1 },
            stats: { stress: 15, trust: -10 },
            traits: { confidence: -8, toiletHabit: -10 },
          },
          dogPose: 'stressed',
          journal: 'Ты наругал Бублика за лужу. Это ухудшило доверие.',
          nextEventId: 'leash',
        },
      },
    ],
  },
  {
    id: 'pigeon-bread',
    location: 'park',
    title: 'Голубь и хлеб.',
    description: 'У лавки голубь ест кусок хлеба. Бублик понял, что это его жизненная цель.',
    dogPose: 'leashPull',
    sceneObjects: ['pigeonPeck', 'bread'],
    choices: [
      {
        id: 'recall-praise',
        label: 'Позвать и похвалить',
        variant: 'positive',
        outcome: {
          resultText: 'Бублик отвлёкся от голубя и посмотрел на тебя. На секунду ты победил хлеб.',
          storyChanges: [
            'Бублик смог переключиться с хлеба на тебя.',
            'Поводок и команда стали понятнее.',
            'Прогулка осталась спокойной, хотя соблазн был серьёзный.',
          ],
          effects: {
            memory: { redirectedPigeons: 1, calmChoices: 1 },
            skills: { heel: 7 },
            stats: { stress: -2, trust: 6 },
            traits: { impulsivity: -4 },
          },
          dogPose: 'happy',
          sceneObjects: ['pigeonIdle', 'bread'],
          journal: 'Ты переключил Бублика с голубя на себя.',
          nextEventId: 'trash',
        },
      },
      {
        id: 'yank-leash',
        label: 'Дёрнуть поводок',
        variant: 'negative',
        outcome: {
          resultText: 'Бублик отскочил от голубя, но теперь поводок стал чуть менее приятной штукой.',
          storyChanges: [
            'Бублик остановился, но испугался резкости.',
            'Поводок стал тревожнее.',
            'Появился риск нового страха на прогулке.',
          ],
          effects: {
            flags: { usedHarshWalkAction: true, yankedLeash: true },
            memory: { pulledLeash: 1 },
            stats: { stress: 10, trust: -6 },
            traits: { confidence: -4, leashBehavior: -7 },
          },
          dogPose: 'stressed',
          sceneObjects: ['pigeonFly', 'bread'],
          journal: 'Ты дёрнул поводок, чтобы остановить Бублика.',
          nextEventId: 'trash',
        },
      },
      {
        id: 'let-chase',
        label: 'Разрешить погонять',
        variant: 'neutral',
        outcome: {
          resultText: 'Голубь улетел. Бублик счастлив. Поводок — нет.',
          storyChanges: [
            'Бублик выплеснул энергию и очень собой доволен.',
            'Сдерживаться рядом с птицами стало сложнее.',
            'Прогулка стала веселее, но менее управляемой.',
          ],
          effects: {
            memory: { chasedPigeons: 1 },
            skills: { heel: -5 },
            stats: { energy: -10, playNeed: -8 },
            traits: { impulsivity: 8 },
          },
          dogPose: 'happy',
          sceneObjects: ['pigeonFly'],
          journal: 'Ты разрешил Бублику погонять голубя.',
          nextEventId: 'trash',
        },
      },
    ],
  },
  {
    id: 'trash',
    location: 'park',
    title: 'Мусор на земле.',
    description: 'На земле лежит что-то подозрительное. Бублик считает, что это ресторан.',
    dogPose: 'sniff',
    sceneObjects: ['trashBag'],
    choices: [
      {
        id: 'treat-switch',
        label: 'Переключить на лакомство',
        variant: 'positive',
        outcome: {
          resultText: 'Бублик выбрал тебя вместо уличной кухни. Сегодня ты шеф-повар.',
          storyChanges: [
            'Бублик выбрал тебя вместо подозрительной находки.',
            'Контакт на прогулке стал надёжнее.',
            'Еда на земле сегодня проиграла лакомству.',
          ],
          effects: {
            memory: { redirectedTrash: 1, calmChoices: 1 },
            skills: { heel: 4 },
            stats: { hunger: 3, trust: 5 },
            traits: { impulsivity: -3 },
          },
          dogPose: 'happy',
          sceneObjects: ['trashBag'],
          journal: 'Ты переключил Бублика с мусора на лакомство.',
          nextEventId: 'after-walk',
          nextLocation: 'home_after_walk',
        },
      },
      {
        id: 'pull-trash',
        label: 'Резко вытащить из пасти',
        variant: 'negative',
        outcome: {
          resultText: 'Ты успел вытащить мусор, но Бублик напрягся и начал крепче держать добычу.',
          storyChanges: [
            'Бублик напрягся и сильнее вцепился в добычу.',
            'Резкое вмешательство ударило по доверию.',
            'Охранять находки стало для него логичнее.',
          ],
          effects: {
            flags: { harshObjectTake: true, usedHarshWalkAction: true },
            memory: { tookSockByForce: 1 },
            stats: { stress: 8, trust: -4 },
            traits: { resourceGuarding: 6 },
          },
          dogPose: 'stressed',
          sceneObjects: ['trashBag'],
          journal: 'Ты резко вытащил мусор из пасти.',
          nextEventId: 'after-walk',
          nextLocation: 'home_after_walk',
        },
      },
      {
        id: 'miss-trash',
        label: 'Не успеть',
        variant: 'negative',
        outcome: {
          resultText: 'Бублик что-то съел. Судя по лицу, это было ужасно и прекрасно одновременно.',
          storyChanges: [
            'Уличная кухня один раз победила.',
            'Бублик получил подкрепление: находки на земле могут быть интересными.',
            'На следующих прогулках мусор будет заметнее для него.',
          ],
          effects: {
            flags: { ateTrash: true },
            memory: { ateTrash: 1 },
            stats: { hunger: -5, stress: 4 },
          },
          dogPose: 'sniff',
          sceneObjects: ['trashBag'],
          journal: 'Бублик подобрал что-то на улице.',
          nextEventId: 'after-walk',
          nextLocation: 'home_after_walk',
        },
      },
    ],
  },
  {
    id: 'after-walk',
    location: 'home_after_walk',
    title: 'После прогулки.',
    description: 'Бублик вернулся домой и рухнул на лежанку. Маленький герой большого двора.',
    dogPose: 'sleep',
    sceneObjects: ['tennisBall'],
    choices: [
      {
        id: 'rest-after-walk',
        label: 'Дать отдохнуть',
        variant: 'positive',
        outcome: {
          resultText: 'Ты дал Бублику спокойно выдохнуть. Иногда лучший тренинг — это сон.',
          storyChanges: [
            'Бублик понял, что дома после прогулки можно спокойно отдыхать.',
            'Стресс снизился.',
            'Ваш день закончился мягко, без дополнительной суеты.',
          ],
          effects: {
            memory: { calmChoices: 1 },
            stats: { energy: 10, stress: -8, trust: 3 },
          },
          dogPose: 'sleep',
          journal: 'После прогулки ты дал Бублику отдохнуть.',
          completeDay: true,
        },
      },
      {
        id: 'train-sit-after-walk',
        label: 'Потренировать "сидеть"',
        variant: 'positive',
        outcome: (state) => {
          if (state.stats.energy < 30) {
            return {
              resultText: 'Бублик устал и сел только душой.',
              storyChanges: [
                'Бублик пытался понять тебя, но усталость победила.',
                'Тренировка в неподходящий момент добавила напряжения.',
                'Команда почти не закрепилась.',
              ],
              effects: {
                skills: { sit: 1 },
                stats: { stress: 5 },
              },
              dogPose: 'sleep',
              journal: 'Ты попробовал тренировать "сидеть", но Бублик был слишком уставшим.',
              completeDay: true,
            };
          }

          return {
            resultText: 'Бублик сел почти сразу. Великий мыслитель понял систему.',
            storyChanges: [
              'Бублик смог собраться даже после прогулки.',
              'Команда "сидеть" стала понятнее.',
              'Доверие подкрепилось спокойной совместной работой.',
            ],
            effects: {
              memory: { calmChoices: 1 },
              skills: { sit: 8 },
              stats: { trust: 3 },
            },
            dogPose: 'happy',
            journal: 'После прогулки Бублик потренировал команду "сидеть".',
            completeDay: true,
          };
        },
      },
      {
        id: 'active-play-after-walk',
        label: 'Начать активную игру',
        variant: 'neutral',
        outcome: {
          resultText: 'Бублик оживился, но квартира снова стала спортивным объектом.',
          storyChanges: [
            'Бублик с радостью включился в игру.',
            'Энергии стало меньше, но возбуждение снова выросло.',
            'После прогулки ему всё же нужен более мягкий переход к отдыху.',
          ],
          effects: {
            stats: { energy: -10, playNeed: -10, stress: 3 },
          },
          dogPose: 'happy',
          sceneObjects: ['tennisBall'],
          journal: 'Ты начал активную игру сразу после прогулки.',
          completeDay: true,
        },
      },
    ],
  },
  {
    id: 'day2-sock',
    location: 'home_morning',
    title: 'Носок возвращается.',
    description: (state) => {
      if (state.decisionMemory.praisedSock > state.decisionMemory.tookSockByForce) {
        return 'Бублик принёс носок и сразу посмотрел на игрушку. Кажется, он понял, что добыча меняется на что-то лучше.';
      }

      if (state.decisionMemory.tookSockByForce > 0) {
        return 'Бублик принёс носок, но держит его крепче. Вид у него такой, будто он уже нанял адвоката.';
      }

      return 'Бублик снова нашёл носок и выглядит так, будто эта традиция теперь официальная.';
    },
    dogPose: 'sock',
    choices: [
      {
        id: 'day2-exchange-sock',
        label: 'Обменять на игрушку',
        variant: 'positive',
        outcome: {
          resultText: 'Ты предложил обмен. Бублик отпустил носок быстрее, чем вчера.',
          storyChanges: [
            'Правило обмена начало закрепляться.',
            'Носок перестал быть борьбой за добычу.',
            'Доверие к твоим рукам стало крепче.',
          ],
          effects: {
            memory: { praisedSock: 1, calmChoices: 1 },
            stats: { trust: 6, playNeed: -6 },
            skills: { fetch: 4 },
            traits: { resourceGuarding: -4 },
          },
          dogPose: 'happy',
          journal: 'На второй день Бублик быстрее согласился обменять носок.',
          nextEventId: 'day2-pigeon',
          nextLocation: 'park',
        },
      },
      {
        id: 'day2-take-sock',
        label: 'Просто забрать',
        variant: 'negative',
        outcome: {
          resultText: 'Носок спасён, но Бублик сжал челюсти так, будто начался юридический спор.',
          storyChanges: [
            'Переговоры стали сложнее.',
            'Бублик сильнее охраняет добычу.',
            'Доверие снова получило царапину.',
          ],
          effects: {
            flags: { harshObjectTake: true },
            memory: { tookSockByForce: 1 },
            stats: { stress: 8, trust: -6 },
            traits: { resourceGuarding: 8 },
          },
          dogPose: 'stressed',
          journal: 'Ты снова забрал носок силой, и Бублик стал держать добычу крепче.',
          nextEventId: 'day2-pigeon',
          nextLocation: 'park',
        },
      },
      {
        id: 'day2-ignore-sock',
        label: 'Сделать вид, что не заметил',
        variant: 'neutral',
        outcome: {
          resultText: 'Бублик решил, что молчание — это разрешение. Носок снова пошёл в дело.',
          storyChanges: [
            'Носки стали ещё интереснее.',
            'Квартира получила новый риск.',
            'Привычка воровать вещи закрепилась сильнее.',
          ],
          effects: {
            flags: { homeDamage: true, sockChewed: true },
            memory: { ignoredSock: 1 },
            stats: { playNeed: 5 },
            traits: { impulsivity: 5 },
          },
          dogPose: 'sock',
          journal: 'Бублик снова остался с носком без правил.',
          nextEventId: 'day2-pigeon',
          nextLocation: 'park',
        },
      },
    ],
  },
  {
    id: 'day2-pigeon',
    location: 'park',
    title: 'Голубь раньше тебя.',
    description: (state) => {
      if (state.decisionMemory.chasedPigeons > state.decisionMemory.redirectedPigeons) {
        return 'Бублик заметил голубя раньше тебя и уже натянул поводок. Кажется, вчерашняя охота ему понравилась.';
      }

      if (state.decisionMemory.redirectedPigeons > 0) {
        return 'Бублик увидел голубя, но на секунду посмотрел на тебя. Хлеб проигрывает не сразу, но шансы есть.';
      }

      return 'Голубь деловито шагает у дорожки. Бублик оценивает ситуацию как спортивную.';
    },
    dogPose: 'leashPull',
    sceneObjects: ['pigeonPeck', 'bread'],
    choices: [
      {
        id: 'day2-recall-praise',
        label: 'Позвать и похвалить',
        variant: 'positive',
        outcome: {
          resultText: 'Бублик на секунду выбрал тебя вместо голубя. Это уже не случайность.',
          storyChanges: [
            'Поводок стал спокойнее.',
            'Контакт на прогулке закрепился.',
            'Голуби всё ещё важны, но ты появился в списке аргументов.',
          ],
          effects: {
            memory: { redirectedPigeons: 1, calmChoices: 1 },
            skills: { heel: 8 },
            stats: { trust: 5, stress: -3 },
            traits: { impulsivity: -5, leashBehavior: 4 },
          },
          dogPose: 'happy',
          sceneObjects: ['pigeonIdle', 'bread'],
          journal: 'Бублик снова переключился с голубя на тебя.',
          nextEventId: 'day2-stick',
        },
      },
      {
        id: 'day2-yank-leash',
        label: 'Дёрнуть поводок',
        variant: 'negative',
        outcome: {
          resultText: 'Бублик отпрянул. Голубь исчез, но напряжение осталось на поводке.',
          storyChanges: [
            'Резкость остановила рывок, но не научила спокойствию.',
            'Стресс вырос.',
            'Прогулка стала ближе к новому страху.',
          ],
          effects: {
            flags: { usedHarshWalkAction: true, yankedLeash: true },
            memory: { pulledLeash: 1 },
            stats: { trust: -6, stress: 11 },
            traits: { confidence: -5, leashBehavior: -8 },
          },
          dogPose: 'stressed',
          sceneObjects: ['pigeonFly'],
          journal: 'На второй день ты снова остановил голубя рывком поводка.',
          nextEventId: 'day2-stick',
        },
      },
      {
        id: 'day2-let-chase',
        label: 'Разрешить погонять',
        variant: 'neutral',
        outcome: {
          resultText: 'Бублик сделал великий рывок. Голубь не подписывался на эту сцену.',
          storyChanges: [
            'Охота на голубей стала настоящим развлечением.',
            'Послушание на поводке просело.',
            'Бублик получил яркую победу над скучной прогулкой.',
          ],
          effects: {
            memory: { chasedPigeons: 1 },
            skills: { heel: -6 },
            stats: { energy: -10, playNeed: -8 },
            traits: { impulsivity: 8 },
          },
          dogPose: 'happy',
          sceneObjects: ['pigeonFly'],
          journal: 'Бублик опять погнал голубя.',
          nextEventId: 'day2-stick',
        },
      },
    ],
  },
  {
    id: 'day2-stick',
    location: 'park',
    title: 'Палка с характером.',
    description: 'У дорожки лежит палка. Бублик смотрит на неё так, будто это древний артефакт.',
    dogPose: 'idle',
    sceneObjects: ['stick'],
    choices: [
      {
        id: 'day2-play-stick',
        label: 'Поиграть спокойно',
        variant: 'positive',
        outcome: {
          resultText: 'Вы немного поиграли с палкой без рывков и хаоса. Бублик сияет.',
          storyChanges: [
            'Игровая энергия ушла в безопасную штуку.',
            'Бублик получил внимание без перевозбуждения.',
            'Прогулка стала теплее.',
          ],
          effects: {
            memory: { calmChoices: 1 },
            stats: { trust: 4, energy: -6, playNeed: -10 },
            skills: { fetch: 5 },
          },
          dogPose: 'happy',
          sceneObjects: ['stick'],
          journal: 'В парке вы спокойно поиграли с палкой.',
          nextEventId: 'day2-package',
        },
      },
      {
        id: 'day2-leave-stick',
        label: 'Оставить палку',
        variant: 'neutral',
        outcome: {
          resultText: 'Бублик проводил палку взглядом, но пошёл дальше.',
          storyChanges: [
            'Он справился с маленьким разочарованием.',
            'Прогулка осталась ровной.',
          ],
          effects: {
            memory: { calmChoices: 1 },
            stats: { stress: -1 },
          },
          dogPose: 'sit',
          sceneObjects: ['stick'],
          journal: 'Бублик прошёл мимо палки без драмы.',
          nextEventId: 'day2-package',
        },
      },
      {
        id: 'day2-rush-stick',
        label: 'Разрешить тащить домой',
        variant: 'negative',
        outcome: {
          resultText: 'Палка стала главным пассажиром прогулки. Управляемость временно уехала в отпуск.',
          storyChanges: [
            'Бублик сильнее увлёкся добычей.',
            'Поводок стал менее спокойным.',
            'Игрушки на улице получили больше власти.',
          ],
          effects: {
            stats: { stress: 4, playNeed: -5 },
            traits: { impulsivity: 4, resourceGuarding: 3 },
          },
          dogPose: 'leashPull',
          sceneObjects: ['stick'],
          journal: 'Бублик решил, что палку надо нести домой.',
          nextEventId: 'day2-package',
        },
      },
    ],
  },
  {
    id: 'day2-package',
    location: 'park',
    title: 'Подозрительный пакет.',
    description: (state) => {
      if (state.decisionMemory.ateTrash > 0) {
        return 'На прогулке Бублик сразу начал сканировать землю. Уличная кухня зовёт.';
      }

      return 'У дорожки лежит пакет. Бублик считает, что это квест.';
    },
    dogPose: 'sniff',
    sceneObjects: ['trashBag'],
    choices: [
      {
        id: 'day2-arc-around',
        label: 'Обойти дугой',
        variant: 'positive',
        outcome: {
          resultText: 'Ты заранее увёл Бублика по дуге. Пакет остался загадкой без дегустации.',
          storyChanges: [
            'Бублик прошёл мимо потенциальной гадости.',
            'Контакт на поводке стал спокойнее.',
            'Уличная кухня потеряла шанс.',
          ],
          effects: {
            memory: { redirectedTrash: 1, calmChoices: 1 },
            skills: { heel: 5 },
            stats: { trust: 4, stress: -2 },
            traits: { impulsivity: -3 },
          },
          dogPose: 'happy',
          sceneObjects: ['trashBag'],
          journal: 'Ты заранее обошёл подозрительный пакет.',
          nextEventId: 'day2-after-walk',
          nextLocation: 'home_after_walk',
        },
      },
      {
        id: 'day2-sniff-short',
        label: 'Дать понюхать на коротком поводке',
        variant: 'neutral',
        outcome: {
          resultText: 'Бублик понюхал пакет, но не успел устроить гастрономический эксперимент.',
          storyChanges: [
            'Любопытство получило рамки.',
            'Поводок остался под контролем.',
            'Пакет не стал проблемой, но интерес к находкам заметен.',
          ],
          effects: {
            memory: { calmChoices: 1 },
            stats: { stress: 2, trust: 2 },
            traits: { impulsivity: 2 },
          },
          dogPose: 'sniff',
          sceneObjects: ['trashBag'],
          journal: 'Бублик понюхал пакет на коротком поводке.',
          nextEventId: 'day2-after-walk',
          nextLocation: 'home_after_walk',
        },
      },
      {
        id: 'day2-miss-package',
        label: 'Не успеть остановить',
        variant: 'negative',
        outcome: {
          resultText: 'Бублик успел ткнуться носом в пакет. Судя по выражению, это было важно.',
          storyChanges: [
            'Находки на земле стали ещё интереснее.',
            'Ты потерял момент до того, как он начал исследовать.',
            'Следующие прогулки могут стать сложнее.',
          ],
          effects: {
            flags: { ateTrash: true },
            memory: { ateTrash: 1 },
            stats: { hunger: -4, stress: 5 },
            traits: { impulsivity: 5 },
          },
          dogPose: 'sniff',
          sceneObjects: ['trashBag'],
          journal: 'Бублик успел исследовать подозрительный пакет.',
          nextEventId: 'day2-after-walk',
          nextLocation: 'home_after_walk',
        },
      },
    ],
  },
  {
    id: 'day2-after-walk',
    location: 'home_after_walk',
    title: 'После прогулки.',
    description: 'Бублик вернулся домой и лёг так, будто платит ипотеку.',
    dogPose: 'sleep',
    sceneObjects: ['tennisBall'],
    choices: [
      {
        id: 'day2-rest',
        label: 'Дать отдохнуть',
        variant: 'positive',
        outcome: {
          resultText: 'Ты дал Бублику восстановиться. Он заснул с видом человека, который всё понял про парк.',
          storyChanges: [
            'День закончился спокойно.',
            'Бублик быстрее сбросил напряжение.',
            'Отдых после прогулки стал понятной частью ритуала.',
          ],
          effects: {
            memory: { calmChoices: 1 },
            stats: { energy: 12, stress: -8, trust: 3 },
          },
          dogPose: 'sleep',
          journal: 'После второго дня прогулки Бублик спокойно отдохнул.',
          completeDay: true,
        },
      },
      {
        id: 'day2-train-sit',
        label: 'Потренировать "сидеть"',
        variant: 'positive',
        outcome: {
          resultText: 'Бублик сел, подумал, снова сел. В голове что-то щёлкнуло.',
          storyChanges: [
            'Команда "сидеть" стала заметно увереннее.',
            'Совместная работа после прогулки прошла без давления.',
            'Доверие держится на спокойной практике.',
          ],
          effects: {
            memory: { calmChoices: 1 },
            skills: { sit: 7 },
            stats: { trust: 3, energy: -3 },
          },
          dogPose: 'happy',
          journal: 'После прогулки вы спокойно потренировали "сидеть".',
          completeDay: true,
        },
      },
      {
        id: 'day2-ball-play',
        label: 'Поиграть в мячик',
        variant: 'neutral',
        outcome: {
          resultText: 'Мячик оказался сильнее усталости. Бублик рад, ковёр не уверен.',
          storyChanges: [
            'Игры стало достаточно.',
            'Возбуждение после прогулки снова поднялось.',
            'Мячик стал частью вечернего хаоса.',
          ],
          effects: {
            stats: { energy: -8, playNeed: -12, stress: 4 },
            skills: { fetch: 4 },
          },
          dogPose: 'happy',
          sceneObjects: ['tennisBall'],
          journal: 'Вечером Бублик играл с мячиком после прогулки.',
          completeDay: true,
        },
      },
    ],
  },
];

export function createInitialApartmentState(): GameState {
  return normalizeState({
    completedEventIds: [],
    currentEventId: 'sock',
    day: 1,
    dayStartSkills: { ...initialSkills },
    dayStartTraitIds: [],
    decisionMemory: { ...initialDecisionMemory },
    flags: {},
    goals: cloneGoals(dayGoals),
    journal: ['Бублик приехал с передержки и изучает новый дом.'],
    location: 'home_morning',
    pendingResult: null,
    personalityTraits: [],
    phase: 'event',
    skills: { ...initialSkills },
    stats: { ...initialStats },
    timeLabel: 'Утро',
    traits: { ...initialTraits },
  });
}

export function getCurrentEvent(state: GameState): ResolvedStoryEvent {
  return resolveEvent(eventsById[state.currentEventId] ?? eventsById.sock, state);
}

export function chooseEventOption(state: GameState, choiceId: string): GameState {
  if (state.phase !== 'event') return state;

  const currentEvent = getCurrentEvent(state);
  const choice = currentEvent.choices.find((item) => item.id === choiceId);
  if (!choice) return state;

  const outcome = typeof choice.outcome === 'function' ? choice.outcome(state) : choice.outcome;
  const updatedState = applyEffects(state, outcome.effects);
  const nextLocation = outcome.nextLocation ?? currentEvent.location;
  const nextEventId = outcome.nextEventId ?? state.currentEventId;

  return normalizeState({
    ...updatedState,
    journal: [...updatedState.journal, outcome.journal],
    location: state.location,
    pendingResult: {
      changes: describeEffects(state, updatedState, outcome.effects),
      choiceId: choice.id,
      completeDay: Boolean(outcome.completeDay),
      dogPose: outcome.dogPose ?? getResultDogPose(choice.variant),
      nextEventId,
      nextLocation,
      resultText: outcome.resultText,
      sceneObjects: outcome.sceneObjects ?? currentEvent.sceneObjects,
      storyChanges: outcome.storyChanges ?? describeStoryFallback(outcome.effects),
      variant: choice.variant,
    },
    phase: 'result',
  });
}

export function continueAfterResult(state: GameState): GameState {
  if (state.phase !== 'result' || !state.pendingResult) return state;

  const currentEvent = getCurrentEvent(state);
  const completedEventIds = state.completedEventIds.includes(currentEvent.id)
    ? state.completedEventIds
    : [...state.completedEventIds, currentEvent.id];

  if (state.pendingResult.completeDay) {
    return normalizeState({
      ...state,
      completedEventIds,
      location: 'home_after_walk',
      pendingResult: null,
      phase: 'daySummary',
      timeLabel: 'Вечер',
    });
  }

  const nextState: GameState = {
    ...state,
    completedEventIds,
    currentEventId: state.pendingResult.nextEventId,
    location: state.pendingResult.nextLocation,
    pendingResult: null,
    phase: 'event',
    timeLabel: getTimeLabelForLocation(state.pendingResult.nextLocation),
  };

  return normalizeState(markDepartureIfNeeded(nextState, state.pendingResult.nextLocation));
}

export function startNextDay(state: GameState): GameState {
  const scoredState = normalizeState(state);
  const nextDay = scoredState.day + 1;
  const currentTraitIds = getUnlockedTraits(scoredState).map((trait) => trait.id);

  return normalizeState({
    ...scoredState,
    completedEventIds: [],
    currentEventId: nextDay === 2 ? 'day2-sock' : 'day2-sock',
    day: nextDay,
    dayStartSkills: { ...scoredState.skills },
    dayStartTraitIds: currentTraitIds,
    flags: {},
    goals: cloneGoals(dayGoals),
    journal: [`День ${nextDay}: Бублик проснулся уже не совсем той собакой, что вчера.`],
    location: 'home_morning',
    pendingResult: null,
    phase: 'event',
    stats: {
      ...scoredState.stats,
      energy: clamp(scoredState.stats.energy + 12),
      hunger: clamp(scoredState.stats.hunger + 10),
      playNeed: clamp(scoredState.stats.playNeed + 10),
      stress: clamp(scoredState.stats.stress - 10),
      walkNeed: 55,
    },
    timeLabel: 'Утро',
  });
}

export function resetApartmentSave() {
  window.localStorage.removeItem(storageKey);
}

export function loadApartmentState(): GameState {
  try {
    const rawState = window.localStorage.getItem(storageKey);
    if (!rawState) return createInitialApartmentState();

    return sanitizeApartmentState(JSON.parse(rawState));
  } catch {
    return createInitialApartmentState();
  }
}

export function saveApartmentState(state: GameState) {
  window.localStorage.setItem(storageKey, JSON.stringify({ ...state, pendingResult: null, phase: state.phase === 'result' ? 'event' : state.phase }));
}

export function getMeters(state: GameState): MeterState[] {
  return (Object.keys(statLabels) as DogStatId[]).map((id) => ({
    id,
    title: statLabels[id],
    value: state.stats[id],
  }));
}

export function getSkillList(state: GameState): SkillState[] {
  return (Object.keys(skillLabels) as DogSkillId[]).map((id) => ({
    id,
    title: skillLabels[id],
    value: state.skills[id],
  }));
}

export function getLocationTab(location: LocationId): LocationTab {
  return location === 'park' ? 'park' : 'home';
}

export function getGoalsTheme(state: GameState): string {
  return `День ${state.day}: Утро без катастроф`;
}

export function getUnlockedTraits(state: GameState): DogTraitBadge[] {
  return state.personalityTraits.filter((trait) => trait.unlocked);
}

export function getDaySummary(state: GameState): DaySummary {
  const scoredState = normalizeState(state);
  const unlockedTraitIds = new Set(scoredState.dayStartTraitIds);
  const newTraits = getUnlockedTraits(scoredState).filter((trait) => !unlockedTraitIds.has(trait.id));

  return {
    goalSummaries: scoredState.goals.map((goal) => ({
      explanation: getGoalSummaryExplanation(goal, scoredState),
      label: goal.label,
      status: goal.status,
    })),
    journal: scoredState.journal.slice(-5),
    newTraits,
    reinforcedLines: describeReinforcedPatterns(scoredState),
    skillChanges: describeSkillChanges(scoredState),
    storyLines: describeDayStory(scoredState),
    title: `Итоги дня ${scoredState.day}`,
  };
}

const eventsById = Object.fromEntries(events.map((event) => [event.id, event])) as Record<string, StoryEvent>;

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

function applyEffects(state: GameState, effects: ChoiceEffect): GameState {
  return {
    ...state,
    decisionMemory: applyMemoryEffects(state.decisionMemory, effects.memory),
    flags: applyFlagEffects(state.flags, effects),
    skills: applyNumberEffects(state.skills, effects.skills),
    stats: applyNumberEffects(state.stats, effects.stats),
    traits: applyNumberEffects(state.traits, effects.traits),
  };
}

function applyNumberEffects<T extends Record<string, number>>(values: T, effects?: Partial<Record<keyof T, number>>): T {
  if (!effects) return values;

  const nextValues = { ...values };
  for (const key of Object.keys(effects) as Array<keyof T>) {
    nextValues[key] = clamp(values[key] + (effects[key] ?? 0)) as T[keyof T];
  }

  return nextValues;
}

function applyMemoryEffects(memory: DecisionMemory, effects?: Partial<Record<keyof DecisionMemory, number>>): DecisionMemory {
  if (!effects) return memory;

  const nextMemory = { ...memory };
  for (const key of Object.keys(effects) as Array<keyof DecisionMemory>) {
    nextMemory[key] = Math.max(0, memory[key] + (effects[key] ?? 0));
  }

  return nextMemory;
}

function applyFlagEffects(flags: GameState['flags'], effects: ChoiceEffect): GameState['flags'] {
  const nextFlags = { ...flags, ...(effects.flags ?? {}) };

  if (effects.flagDeltas) {
    for (const [key, delta] of Object.entries(effects.flagDeltas)) {
      nextFlags[key] = Number(nextFlags[key] ?? 0) + delta;
    }
  }

  return nextFlags;
}

function normalizeState(state: GameState): GameState {
  const stateWithGoals = {
    ...state,
    goals: state.goals.map((goal) => resolveGoal(goal, state)),
  };

  return {
    ...stateWithGoals,
    personalityTraits: buildTraitBadges(stateWithGoals),
  };
}

function markDepartureIfNeeded(state: GameState, nextLocation: LocationId): GameState {
  if (nextLocation !== 'park' || typeof state.flags.leftHomeStress === 'number') return state;

  return {
    ...state,
    flags: {
      ...state.flags,
      leftHomeStress: state.stats.stress,
    },
  };
}

function resolveGoal(goal: DayGoal, state: GameState): DayGoal {
  const statusData = getGoalStatus(goal.id, state);

  return {
    ...goal,
    completed: statusData.status === 'done',
    reason: statusData.reason,
    status: statusData.status,
  };
}

function getGoalStatus(id: DayGoalId, state: GameState): { status: GoalStatus; reason: string } {
  const flags = state.flags;
  const leftHomeStress = typeof flags.leftHomeStress === 'number' ? flags.leftHomeStress : undefined;
  const hasLeftHome = leftHomeStress !== undefined || state.location === 'park' || state.location === 'home_after_walk' || state.phase === 'daySummary';
  const isSummary = state.phase === 'daySummary';
  const harshTrustAction = flags.scoldedBublik === true || flags.harshObjectTake === true || flags.yankedLeash === true;
  const homeDamage = flags.homeDamage === true || flags.puddleHappened === true || flags.sockChewed === true || flags.chewedBag === true;
  const walkStarted = state.location === 'park' || state.location === 'home_after_walk' || isSummary;

  if (id === 'calmMorning') {
    if (hasLeftHome) {
      const stressAtDoor = leftHomeStress ?? state.stats.stress;
      return stressAtDoor <= 50
        ? { status: 'done', reason: 'Ты вывел Бублика до того, как ожидание стало слишком напряжённым.' }
        : { status: 'failed', reason: 'К выходу из дома стресс был выше среднего.' };
    }

    if (state.stats.stress >= 40 || state.stats.walkNeed >= 76 || flags.puddleRisk === true) {
      return { status: 'at_risk', reason: 'Бублик долго ждёт прогулку, и утро становится нервным.' };
    }

    return { status: 'in_progress', reason: 'Пока утро идёт спокойно. Важно не затягивать с прогулкой.' };
  }

  if (id === 'keepTrust') {
    if (harshTrustAction) return { status: 'failed', reason: getTrustFailureReason(state) };
    if (isSummary) return { status: 'done', reason: 'Ты не отбирал вещи силой, не ругал Бублика и не дёргал поводок.' };
    if (state.stats.trust < 58 || state.traits.resourceGuarding >= 35) {
      return { status: 'at_risk', reason: 'Доверие уже хрупкое: сейчас особенно важны спокойные решения.' };
    }

    return { status: 'in_progress', reason: 'Пока ты сохраняешь контакт даже в глупых ситуациях.' };
  }

  if (id === 'apartmentSafe') {
    if (homeDamage) return { status: 'failed', reason: getApartmentFailureReason(state) };
    if (isSummary) return { status: 'done', reason: 'Дома обошлось без луж, разгрызенных носков и других происшествий.' };
    if (state.stats.walkNeed >= 76 || flags.puddleRisk === true || Number(flags.walkIgnoredCount ?? 0) > 0) {
      return { status: 'at_risk', reason: 'Бублик уже долго ждёт прогулку. Квартира под угрозой.' };
    }

    return { status: 'in_progress', reason: 'Пока квартира держится. Бублик занят, но ему скоро понадобится улица.' };
  }

  if (id === 'noNewFear') {
    if (flags.usedHarshWalkAction === true || flags.yankedLeash === true) {
      return { status: 'failed', reason: 'На прогулке было резкое действие, и поводок стал тревожнее.' };
    }

    if (walkStarted && state.stats.stress > 50) {
      return { status: 'failed', reason: 'Стресс на прогулке поднялся выше безопасного уровня.' };
    }

    if (isSummary || state.location === 'home_after_walk') {
      return { status: 'done', reason: 'Ты вернулся без резких действий, и стресс остался управляемым.' };
    }

    if (state.location === 'park' && (state.stats.stress >= 40 || state.traits.leashBehavior < 50)) {
      return { status: 'at_risk', reason: 'Прогулка напряжённая: сейчас лучше выбирать мягкие действия.' };
    }

    return { status: 'in_progress', reason: 'Прогулка ещё впереди. Новый страх появится только от стресса и резкости.' };
  }

  return { status: 'in_progress', reason: 'Цель ещё развивается через твои решения.' };
}

function buildTraitBadges(state: GameState): DogTraitBadge[] {
  return traitBadgeDefinitions.map((definition) => {
    const score = getTraitScore(definition.id, state);

    return {
      ...definition,
      level: score.unlocked ? Math.max(1, Math.min(3, score.level)) : 0,
      unlocked: score.unlocked,
    };
  });
}

function getTraitScore(id: string, state: GameState): { level: number; unlocked: boolean } {
  const memory = state.decisionMemory;

  if (id === 'sock-thief') {
    const level = memory.ignoredSock + Math.floor(memory.tookSockByForce / 2);
    return { level, unlocked: memory.ignoredSock >= 1 || memory.tookSockByForce >= 2 };
  }

  if (id === 'pigeon-fan') {
    const level = memory.chasedPigeons + (state.traits.impulsivity >= 58 ? 1 : 0);
    return { level, unlocked: memory.chasedPigeons >= 1 };
  }

  if (id === 'street-vacuum') {
    return { level: memory.ateTrash, unlocked: memory.ateTrash >= 1 };
  }

  if (id === 'calm-dog') {
    const level = memory.calmChoices + (state.stats.stress <= 30 ? 1 : 0);
    const noHarshActions = memory.punishedDog === 0 && memory.pulledLeash === 0 && memory.tookSockByForce === 0;
    return { level, unlocked: memory.calmChoices >= 3 && state.stats.stress <= 35 && noHarshActions };
  }

  if (id === 'anxious-dog') {
    const harshScore = memory.punishedDog + memory.pulledLeash + memory.tookSockByForce;
    const level = harshScore + (state.stats.stress >= 50 ? 1 : 0);
    return { level, unlocked: harshScore >= 2 || state.stats.stress >= 55 };
  }

  if (id === 'velcro-dog') {
    const level = (state.stats.trust >= 75 ? 2 : state.stats.trust >= 70 ? 1 : 0) + memory.praisedSock + memory.redirectedPigeons + memory.redirectedTrash;
    return { level, unlocked: state.stats.trust >= 75 && memory.calmChoices >= 2 };
  }

  return { level: 0, unlocked: false };
}

function getTrustFailureReason(state: GameState): string {
  if (state.flags.scoldedBublik === true) return 'Ты наругал Бублика, и он не понял, как вернуть безопасность.';
  if (state.flags.yankedLeash === true) return 'Ты дёрнул поводок, и доверие на прогулке просело.';
  if (state.flags.harshObjectTake === true) return 'Ты резко отобрал предмет, и Бублик стал осторожнее с добычей.';
  return 'Одно из решений оказалось слишком резким для доверия.';
}

function getApartmentFailureReason(state: GameState): string {
  if (state.flags.puddleHappened === true) return 'Бублик не дождался прогулки и сделал лужу у двери.';
  if (state.flags.sockChewed === true) return 'Носок остался без присмотра и был разгрызен.';
  if (state.flags.chewedBag === true) return 'Бублик добрался до пакета и устроил домашний ущерб.';
  return 'Дома случился ущерб, которого можно было избежать.';
}

function getGoalSummaryExplanation(goal: DayGoal, state: GameState): string {
  if (goal.status === 'done' || goal.status === 'failed') return goal.reason;
  if (goal.status === 'at_risk') return `${goal.reason} До конца дня цель осталась под угрозой.`;

  if (goal.id === 'noNewFear' && state.location === 'home_morning') {
    return 'Прогулка так и не началась, поэтому цель нельзя считать закрытой.';
  }

  return `${goal.reason} Цель не успела завершиться.`;
}

function describeDayStory(state: GameState): string[] {
  const lines: string[] = [];
  if (state.stats.stress <= 35) lines.push('спокойно переживал странности дня');
  if (state.stats.trust >= 72) lines.push('чуть лучше реагировал на тебя');
  if (state.decisionMemory.redirectedPigeons > 0) lines.push('хотя бы раз выбрал тебя вместо голубя');
  if (state.decisionMemory.chasedPigeons > 0) lines.push('заинтересовался голубями всерьёз');
  if (state.decisionMemory.ateTrash > 0) lines.push('обнаружил, что земля иногда предлагает меню');
  if (state.flags.homeDamage !== true) lines.push('не устроил катастроф дома');
  if (state.flags.homeDamage === true) lines.push('оставил дома историю, которую придётся помнить');

  return lines.length ? lines.slice(0, 5) : ['прожил ещё один день и стал чуть более собой'];
}

function describeReinforcedPatterns(state: GameState): string[] {
  const lines: string[] = [];
  if (state.decisionMemory.praisedSock > state.decisionMemory.tookSockByForce) lines.push('Бублик запомнил, что носки можно обменивать.');
  if (state.decisionMemory.tookSockByForce > 0) lines.push('Бублик запомнил, что добычу могут забрать резко.');
  if (state.decisionMemory.redirectedPigeons > state.decisionMemory.chasedPigeons) lines.push('Голуби стали поводом смотреть на тебя, а не только бежать.');
  if (state.decisionMemory.chasedPigeons > 0) lines.push('Погоня за голубями закрепилась как яркая идея.');
  if (state.decisionMemory.redirectedTrash > state.decisionMemory.ateTrash) lines.push('Уличную еду можно обходить без драмы.');
  if (state.decisionMemory.ateTrash > 0) lines.push('Уличная кухня стала заметнее для Бублика.');
  if (state.decisionMemory.calmChoices >= 3) lines.push('Спокойные решения помогают Бублику быстрее выдыхать.');

  return lines.length ? lines.slice(0, 5) : ['Бублик ещё присматривается к правилам новой жизни.'];
}

function describeStoryFallback(effects: ChoiceEffect): string[] {
  const lines: string[] = [];

  if ((effects.stats?.trust ?? 0) > 0) lines.push('Бублик почувствовал больше поддержки и контакта.');
  if ((effects.stats?.trust ?? 0) < 0) lines.push('Бублик стал осторожнее в контакте с тобой.');
  if ((effects.stats?.stress ?? 0) > 0) lines.push('Напряжение у Бублика выросло.');
  if ((effects.stats?.stress ?? 0) < 0) lines.push('Бублик немного выдохнул.');
  if ((effects.stats?.energy ?? 0) < 0) lines.push('Он потратил немного сил.');
  if ((effects.stats?.walkNeed ?? 0) < 0) lines.push('Потребность в прогулке снизилась.');
  if ((effects.stats?.playNeed ?? 0) < 0) lines.push('Игровой зуд стал спокойнее.');

  return lines.length ? lines : ['Решение изменило день Бублика, но без резкого поворота.'];
}

function describeEffects(before: GameState, after: GameState, effects: ChoiceEffect): string[] {
  return [
    ...describeDeltaGroup(statLabels, before.stats, after.stats, effects.stats),
    ...describeDeltaGroup(skillLabels, before.skills, after.skills, effects.skills),
    ...describeDeltaGroup(traitLabels, before.traits, after.traits, effects.traits),
  ];
}

function describeDeltaGroup<T extends string>(labels: Record<T, string>, before: Record<T, number>, after: Record<T, number>, effects?: Partial<Record<T, number>>): string[] {
  if (!effects) return [];

  return (Object.keys(effects) as T[]).map((key) => {
    const delta = after[key] - before[key];
    const sign = delta > 0 ? '+' : '';
    return `${labels[key]} ${sign}${delta}`;
  });
}

function describeSkillChanges(state: GameState): string[] {
  const changes = (Object.keys(skillLabels) as DogSkillId[])
    .map((key) => {
      const delta = state.skills[key] - state.dayStartSkills[key];
      if (!delta) return null;
      const sign = delta > 0 ? '+' : '';
      return `${skillLabels[key]} ${sign}${delta}`;
    })
    .filter(Boolean) as string[];

  return changes.length ? changes : ['Навыки почти не изменились.'];
}

function getResultDogPose(variant: ChoiceVariant): DogPose {
  if (variant === 'positive') return 'happy';
  if (variant === 'negative') return 'stressed';
  return 'idle';
}

function getTimeLabelForLocation(location: LocationId) {
  if (location === 'park') return 'Прогулка';
  if (location === 'home_after_walk') return 'Вечер';
  return 'Утро';
}

function sanitizeApartmentState(value: Partial<GameState>): GameState {
  const initialState = createInitialApartmentState();
  const currentEventId = typeof value.currentEventId === 'string' && eventsById[value.currentEventId] ? value.currentEventId : initialState.currentEventId;
  const phase = value.phase === 'daySummary' ? 'daySummary' : 'event';

  return normalizeState({
    ...initialState,
    ...value,
    currentEventId,
    dayStartSkills: { ...initialState.dayStartSkills, ...(value.dayStartSkills ?? {}) },
    dayStartTraitIds: Array.isArray(value.dayStartTraitIds) ? value.dayStartTraitIds : initialState.dayStartTraitIds,
    decisionMemory: { ...initialState.decisionMemory, ...(value.decisionMemory ?? {}) },
    flags: value.flags && typeof value.flags === 'object' ? value.flags : initialState.flags,
    goals: mergeGoals(value.goals),
    journal: Array.isArray(value.journal) ? value.journal : initialState.journal,
    pendingResult: null,
    personalityTraits: Array.isArray(value.personalityTraits) ? value.personalityTraits : initialState.personalityTraits,
    phase,
    skills: { ...initialState.skills, ...(value.skills ?? {}) },
    stats: { ...initialState.stats, ...(value.stats ?? {}) },
    traits: { ...initialState.traits, ...(value.traits ?? {}) },
  });
}

function mergeGoals(savedGoals?: DayGoal[]): DayGoal[] {
  if (!Array.isArray(savedGoals)) return cloneGoals(dayGoals);

  return dayGoals.map((goal) => {
    const savedGoal = savedGoals.find((item) => item.id === goal.id);
    return savedGoal ? { ...goal, ...savedGoal } : { ...goal };
  });
}

function cloneGoals(goals: DayGoal[]): DayGoal[] {
  return goals.map((goal) => ({ ...goal }));
}

function clamp(value: number) {
  return Math.max(0, Math.min(100, value));
}
