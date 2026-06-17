import type { Decision, DogTrait, DogTraitId, LocationId } from '../types';

export const locations: Record<LocationId, { title: string; button: string; icon: string; description: string }> = {
  home: {
    title: 'Дом',
    button: 'Дом',
    icon: '🏠',
    description: 'Квартира, где Бублик живёт свою маленькую собачью жизнь.',
  },
  park: {
    title: 'Парк',
    button: 'Парк',
    icon: '🌳',
    description: 'Короткая прогулка, где каждый запах может стать событием.',
  },
};

export const dogTraits: Record<DogTraitId, DogTrait> = {
  curious: {
    id: 'curious',
    title: 'Любопытный',
    description: 'Чаще замечает странные предметы и просит посмотреть.',
  },
  stubborn: {
    id: 'stubborn',
    title: 'Упрямый',
    description: 'Иногда выбирает собственный план и ждёт переговоров.',
  },
  timid: {
    id: 'timid',
    title: 'Трусишка',
    description: 'Осторожнее реагирует на шум, дождь и незнакомцев.',
  },
  brave: {
    id: 'brave',
    title: 'Смелый',
    description: 'Охотнее пробует новое, если хозяин рядом.',
  },
  vacuum: {
    id: 'vacuum',
    title: 'Пылесос',
    description: 'Слишком внимательно изучает всё съедобное на земле.',
  },
  friendly: {
    id: 'friendly',
    title: 'Дружелюбный',
    description: 'Тянется к людям и собакам, если чувствует добрый настрой.',
  },
};

export const homeEvents: Decision[] = [
  {
    id: 'home-door',
    title: 'Бублик сидит у двери',
    text: 'Он смотрит на поводок и тихо ждёт, что вы поймёте намёк.',
    dogPose: 'sit',
    emotion: '🚪',
    location: 'home',
    choices: [
      {
        title: 'Пойти гулять',
        text: 'Выйти в парк и дать дню начаться с запахов.',
        icon: '🌳',
        effect: {
          goPark: true,
          time: 1,
          stats: { mood: 8, trust: 5 },
          memory: 'Бублик сидел у двери, и вы пошли гулять.',
        },
      },
      {
        title: 'Погладить',
        text: 'Показать, что вы заметили его просьбу.',
        icon: '🤲',
        effect: {
          stats: { trust: 5, mood: 2 },
          dogPose: 'happy',
          emotion: '❤️',
          memory: 'Вы погладили Бублика у двери.',
        },
      },
      {
        title: 'Позвать ко мне',
        text: 'Проверить, готов ли он отойти от двери ради вас.',
        icon: '💬',
        effect: {
          stats: { trust: 4 },
          dogPose: 'sit',
          emotion: '💛',
          memory: 'Бублик подошёл на ваш зов, хотя дверь всё ещё была важной.',
        },
      },
    ],
  },
  {
    id: 'home-bed',
    title: 'Бублик спит на лежанке',
    text: 'Он свернулся клубком и иногда тихо шевелит лапой во сне.',
    dogPose: 'sleep',
    emotion: '😴',
    location: 'home',
    choices: [
      {
        title: 'Не тревожить',
        text: 'Пусть сон восстановит маленького исследователя.',
        icon: '🌙',
        effect: {
          stats: { mood: 4, health: 2 },
          dogPose: 'sleep',
          emotion: '😴',
          memory: 'Бублик спокойно поспал на лежанке.',
        },
      },
      {
        title: 'Сесть рядом',
        text: 'Просто быть рядом, не требуя внимания.',
        icon: '🤍',
        effect: {
          stats: { trust: 6, mood: 3 },
          dogPose: 'idle',
          emotion: '💛',
          memory: 'Вы тихо посидели рядом, пока Бублик дремал.',
        },
      },
    ],
  },
  {
    id: 'home-window',
    title: 'Бублик смотрит в окно',
    text: 'За окном кто-то прошёл, и Бублик внимательно слушает двор.',
    dogPose: 'curious',
    emotion: '🤔',
    location: 'home',
    traits: ['curious'],
    choices: [
      {
        title: 'Посмотреть вместе',
        text: 'Подойти к окну и разделить его интерес.',
        icon: '👀',
        effect: {
          stats: { trust: 4, mood: 3 },
          dogPose: 'curious',
          emotion: '✨',
          addTrait: 'curious',
          memory: 'Вы вместе смотрели в окно.',
        },
      },
      {
        title: 'Позвать к себе',
        text: 'Мягко переключить его внимание.',
        icon: '💬',
        effect: {
          stats: { trust: 3 },
          dogPose: 'sit',
          emotion: '💛',
          memory: 'Бублик отвлёкся от окна и подошёл к вам.',
        },
      },
    ],
  },
  {
    id: 'home-toy',
    title: 'Бублик принёс игрушку',
    text: 'Он положил игрушку у ваших ног и ждёт ответа.',
    dogPose: 'happy',
    emotion: '🎾',
    location: 'home',
    choices: [
      {
        title: 'Играть',
        text: 'Устроить короткую игру прямо в комнате.',
        icon: '🎾',
        effect: {
          stats: { mood: 9, trust: 5 },
          dogPose: 'happy',
          emotion: '😄',
          memory: 'Вы поиграли с Бубликом дома.',
        },
      },
      {
        title: 'Отложить на потом',
        text: 'Мягко сказать, что игра будет позже.',
        icon: '🛋️',
        effect: {
          stats: { mood: -3, trust: -1 },
          dogPose: 'idle',
          emotion: '🤔',
          addTrait: 'stubborn',
          memory: 'Бублик принёс игрушку, но игра подождала.',
        },
      },
    ],
  },
  {
    id: 'home-sock',
    title: 'Бублик нашёл носок',
    text: 'Носок торчит из пасти так гордо, будто это редкий трофей.',
    dogPose: 'curious',
    emotion: '🧦',
    location: 'home',
    traits: ['curious', 'stubborn'],
    choices: [
      {
        title: 'Обменять',
        text: 'Позвать и спокойно обменять носок на внимание.',
        icon: '🤝',
        effect: {
          stats: { trust: 5, mood: 2 },
          dogPose: 'happy',
          emotion: '💛',
          memory: 'Бублик обменял найденный носок без погони.',
        },
      },
      {
        title: 'Погнаться',
        text: 'Превратить носок в домашнее приключение.',
        icon: '🏃',
        effect: {
          stats: { mood: 7, trust: -1 },
          dogPose: 'happy',
          emotion: '😄',
          addTrait: 'stubborn',
          memory: 'Носок превратился в весёлую погоню по дому.',
        },
      },
    ],
  },
  {
    id: 'home-treat',
    title: 'Бублик просит вкусняшку',
    text: 'Он сидит идеально ровно и смотрит так, будто всю жизнь тренировался для этого момента.',
    dogPose: 'sit',
    emotion: '🦴',
    location: 'home',
    traits: ['vacuum'],
    choices: [
      {
        title: 'Дать вкусняшку',
        text: 'Наградить за выдержку.',
        icon: '🦴',
        effect: {
          stats: { mood: 6, trust: 2 },
          dogPose: 'happy',
          emotion: '😄',
          addTrait: 'vacuum',
          memory: 'Бублик получил вкусняшку за идеальную посадку.',
        },
      },
      {
        title: 'Отказать',
        text: 'Не превращать взгляд в способ управления миром.',
        icon: '✋',
        effect: {
          stats: { mood: -3, trust: 2 },
          dogPose: 'sit',
          emotion: '🤔',
          memory: 'Вы отказали во вкусняшке, но спокойно похвалили Бублика.',
        },
      },
    ],
  },
  {
    id: 'home-attention',
    title: 'Бублик хочет внимания',
    text: 'Он подошёл ближе и положил голову так, чтобы её невозможно было не заметить.',
    dogPose: 'idle',
    emotion: '❤️',
    location: 'home',
    choices: [
      {
        title: 'Погладить',
        text: 'Ответить на его просьбу без слов.',
        icon: '🤲',
        effect: {
          stats: { trust: 7, mood: 4 },
          dogPose: 'happy',
          emotion: '❤️',
          memory: 'Бублик попросил внимания и получил его.',
        },
      },
      {
        title: 'Обнять',
        text: 'Сесть рядом и устроить минуту тепла.',
        icon: '🤍',
        effect: {
          stats: { trust: 9, mood: 3 },
          dogPose: 'idle',
          emotion: '💛',
          memory: 'Вы обняли Бублика, и он успокоился рядом.',
        },
      },
    ],
  },
  {
    id: 'home-noise',
    title: 'Бублик лает на шум за дверью',
    text: 'За дверью что-то стукнуло. Бублик насторожился и встал между вами и звуком.',
    dogPose: 'sit',
    emotion: '😨',
    location: 'home',
    traits: ['timid', 'brave'],
    choices: [
      {
        title: 'Успокоить',
        text: 'Сесть рядом и показать, что дома безопасно.',
        icon: '🤲',
        effect: {
          stats: { trust: 7, mood: 2 },
          dogPose: 'idle',
          emotion: '💛',
          addTrait: 'timid',
          memory: 'Бублик насторожился на шум, но вы помогли ему успокоиться.',
        },
      },
      {
        title: 'Проверить дверь',
        text: 'Вместе убедиться, что всё в порядке.',
        icon: '🚪',
        effect: {
          stats: { trust: 5, mood: 3 },
          dogPose: 'curious',
          emotion: '👀',
          addTrait: 'brave',
          memory: 'Вы вместе проверили шум за дверью.',
        },
      },
    ],
  },
  {
    id: 'home-nearby',
    title: 'Бублик лёг рядом с хозяином',
    text: 'Он устроился так близко, будто это единственное правильное место в комнате.',
    dogPose: 'sleep',
    emotion: '❤️',
    location: 'home',
    choices: [
      {
        title: 'Остаться рядом',
        text: 'Не делать ничего. Просто быть командой.',
        icon: '🤍',
        effect: {
          stats: { trust: 8, mood: 5, health: 1 },
          dogPose: 'sleep',
          emotion: '😴',
          memory: 'Бублик лёг рядом, и вы остались с ним.',
        },
      },
      {
        title: 'Тихо позвать играть',
        text: 'Проверить, хочет ли он ещё немного общения.',
        icon: '🎾',
        effect: {
          stats: { mood: 4, trust: 3 },
          dogPose: 'happy',
          emotion: '🎾',
          memory: 'Бублик лежал рядом, но всё-таки согласился на игру.',
        },
      },
    ],
  },
];
