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
  calm: {
    id: 'calm',
    title: 'Спокойный',
    description: 'Лучше выдерживает паузы и не сразу заводится от каждого события.',
  },
  anxious: {
    id: 'anxious',
    title: 'Тревожный',
    description: 'Чаще настораживается и нуждается в поддержке хозяина.',
  },
  independent: {
    id: 'independent',
    title: 'Независимый',
    description: 'Лучше переносит одиночество и иногда сам выбирает занятие.',
  },
};

export const homeEvents: Decision[] = [
  {
    id: 'home-door',
    title: 'Бублик сидит у двери',
    text: 'Он уже десять минут смотрит на поводок. Возможно, хочет гулять. Возможно, просто давит психологически.',
    dogPose: 'sit',
    emotion: '🚪',
    location: 'home',
    choices: [
      {
        title: 'Пойти гулять',
        text: 'Выйти в парк и дать дню начаться с запахов.',
        icon: '🌳',
        resultText: 'Бублик мгновенно оживился. Кажется, он ждал именно этого.',
        result: {
          bublik: 'Бублик вскочил так быстро, будто последние десять минут были официальной разминкой.',
          situation: 'Поводок наконец оказался в руках, дверь перестала быть философской проблемой, и день повернул в сторону парка.',
          thought: 'Я знал, что человек обучаемый.',
        },
        effect: {
          goPark: true,
          time: 1,
          stats: { mood: 5, trust: 3 },
          development: {
            progress: { walkSuccess: 1 },
          },
          memory: 'Бублик мгновенно оживился, когда вы согласились гулять.',
        },
      },
      {
        title: 'Сказать “позже”',
        text: 'Попробовать договориться с собакой, которая уже всё решила.',
        icon: '⌛',
        resultText: 'Бублик тяжело вздохнул. По крайней мере, тебе показалось именно так.',
        result: {
          bublik: 'Бублик сел ровнее и посмотрел на поводок ещё выразительнее. Теперь это уже не просьба, а протокол.',
          situation: 'Прогулка отложилась, но тема явно не закрыта. В комнате стало больше ожидания и меньше шансов спокойно сделать вид, что ничего не происходит.',
          thought: '“Позже” звучит как “надо принести доказательство”.',
        },
        effect: {
          nextDecisionId: 'home-leash',
          addFlag: 'walk_refused',
          stats: { mood: -2, trust: -1 },
          development: {
            progress: { walkIgnored: 1 },
          },
          dogPose: 'sit',
          emotion: '😐',
          memory: 'Бублик услышал “позже” и сделал вид, что это слово его ранило.',
        },
      },
      {
        title: 'Сделать вид, что не понял намёк',
        text: 'Рискованный эксперимент в области межвидовой дипломатии.',
        icon: '🙄',
        resultText: 'Через минуту Бублик принёс поводок. План “не заметить” провалился.',
        result: {
          bublik: 'Бублик исчез на секунду и вернулся с поводком в зубах. Улика легла прямо у ваших ног.',
          situation: 'Теперь событие стало слишком конкретным, чтобы его игнорировать. Дом официально перешёл в режим переговоров о прогулке.',
          thought: 'Человек иногда медленный, но это лечится поводком.',
        },
        effect: {
          nextDecisionId: 'home-leash',
          addFlag: 'walk_refused',
          stats: { mood: -1, trust: 0 },
          development: {
            progress: { walkIgnored: 1 },
          },
          dogPose: 'idle',
          emotion: '🦮',
          memory: 'Бублик принёс поводок, потому что намёки в этом доме явно не работают.',
        },
      },
    ],
  },
  {
    id: 'home-leash',
    title: 'Бублик принёс поводок',
    text: 'Он положил его у ваших ног и сел рядом. Аргумент выглядит убедительно.',
    dogPose: 'sit',
    emotion: '🦮',
    location: 'home',
    requiredFlag: 'walk_refused',
    traits: ['stubborn'],
    choices: [
      {
        title: 'Сдаться и пойти гулять',
        text: 'Признать, что переговоры проиграны.',
        icon: '🌳',
        resultText: 'Бублик сделал вид, что это было ваше решение. Очень благородно с его стороны.',
        result: {
          bublik: 'Бублик аккуратно подвинул поводок носом и тут же сделал самый невинный вид в квартире.',
          situation: 'Переговоры закончились прогулкой. Формально решение приняли вы, но протокол Бублика сработал идеально.',
          thought: 'Команда “человек, гулять” закрепляется.',
        },
        effect: {
          goPark: true,
          time: 1,
          clearFlag: 'walk_refused',
          stats: { mood: 4, trust: 2 },
          addTrait: 'stubborn',
          development: {
            progress: { walkSuccess: 1 },
          },
          memory: 'Бублик принёс поводок и добился прогулки.',
        },
      },
      {
        title: 'Убрать поводок',
        text: 'Попробовать вернуть контроль над ситуацией.',
        icon: '🖐',
        resultText: 'Бублик посмотрел на пустое место у ваших ног. Теперь это стало личным.',
        result: {
          bublik: 'Бублик проводил поводок взглядом и сел возле двери так демонстративно, что даже коврик выглядел виноватым.',
          situation: 'Прогулка снова отложилась. Бублик не устроил сцену, но его молчание звучит довольно громко.',
          thought: 'Поводок исчез. Значит, надо усилить взгляд.',
        },
        effect: {
          addFlag: 'walk_refused',
          stats: { mood: -2, trust: -1 },
          development: {
            progress: { walkIgnored: 1 },
          },
          dogPose: 'sit',
          emotion: '😐',
          addTrait: 'stubborn',
          memory: 'Вы убрали поводок, но Бублик запомнил этот ход.',
        },
      },
      {
        title: 'Похвалить за инициативу',
        text: 'Отметить, что план был понятен и почти безупречен.',
        icon: '♥',
        resultText: 'Бублик принял похвалу как подтверждение своих управленческих навыков.',
        result: {
          bublik: 'Бублик расправился, будто только что получил должность главного по утренним маршрутам.',
          situation: 'Даже без прогулки он понял: его заметили. В комнате стало мягче, а поводок остался важным аргументом на будущее.',
          thought: 'Меня услышали. Почти победа.',
        },
        effect: {
          addFlag: 'praised_bublik',
          stats: { mood: 2, trust: 3 },
          development: {
            progress: { walkSuccess: 1 },
          },
          dogPose: 'idle',
          emotion: '♥',
          memory: 'Вы похвалили Бублика за поводок и инициативу.',
        },
      },
    ],
  },
  {
    id: 'home-warm-after-praise',
    title: 'Бублик держится рядом',
    text: 'После похвалы он ходит за вами по комнате и время от времени проверяет, не забыли ли вы, какой он хороший.',
    dogPose: 'sit',
    emotion: '❤️',
    location: 'home',
    requiredFlag: 'praised_bublik',
    moodTags: ['warm'],
    choices: [
      {
        title: 'Почесать за ухом',
        text: 'Закрепить важный вывод: хорошие инициативы замечают.',
        icon: '❤️',
        result: {
          bublik: 'Бублик прижал уши и наклонился ровно туда, где рука чешет лучше всего.',
          situation: 'Предыдущая похвала превратилась в маленький ритуал доверия. Он явно запомнил, что к вам можно приходить с идеями.',
          thought: 'Да. Вот это управление человеком мне подходит.',
        },
        effect: {
          clearFlag: 'praised_bublik',
          stats: { mood: 3, trust: 5 },
          dogPose: 'sit',
          emotion: '❤️',
          memory: 'После похвалы Бублик весь день держался рядом.',
        },
      },
      {
        title: 'Мягко заняться своими делами',
        text: 'Оставить тепло, но не превращать момент в бесконечную церемонию.',
        icon: '🤍',
        result: {
          bublik: 'Бублик посидел рядом, понял, что всё спокойно, и устроился наблюдать за вами.',
          situation: 'Связь осталась тёплой, просто без дополнительных фанфар. Иногда собаке достаточно знать, что её заметили.',
          thought: 'Человек занят. Но мой статус подтверждён.',
        },
        effect: {
          clearFlag: 'praised_bublik',
          stats: { mood: 1, trust: 2 },
          dogPose: 'sit',
          emotion: '🤍',
          memory: 'Бублик спокойно остался рядом после похвалы.',
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
    dogPose: 'sit',
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
          dogPose: 'sit',
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
    dogPose: 'idle',
    emotion: '🎾',
    location: 'home',
    choices: [
      {
        title: 'Играть',
        text: 'Устроить короткую игру прямо в комнате.',
        icon: '🎾',
        effect: {
          stats: { mood: 9, trust: 5 },
          dogPose: 'idle',
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
    dogPose: 'idle',
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
          development: {
            progress: { sockChase: -1 },
          },
          dogPose: 'idle',
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
          development: {
            progress: { sockChase: 1 },
          },
          dogPose: 'idle',
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
          dogPose: 'idle',
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
          dogPose: 'idle',
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
          addTrait: 'calm',
          development: {
            addAchievement: 'brave_with_noise',
          },
          memory: 'Бублик насторожился на шум, но вы помогли ему успокоиться.',
        },
      },
      {
        title: 'Проверить дверь',
        text: 'Вместе убедиться, что всё в порядке.',
        icon: '🚪',
        effect: {
          stats: { trust: 5, mood: 3 },
          dogPose: 'sit',
          emotion: '👀',
          addTrait: 'brave',
          development: {
            progress: { calmWalking: 1 },
          },
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
          dogPose: 'idle',
          emotion: '🎾',
          memory: 'Бублик лежал рядом, но всё-таки согласился на игру.',
        },
      },
    ],
  },
];
