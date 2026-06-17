import type { Decision, DogTraitId, Ending } from '../types';

export interface WalkEvent extends Decision {
  traits?: DogTraitId[];
}

export const walkEvents: WalkEvent[] = [
  {
    id: 'walk-bush-food',
    title: 'Что-то в кустах',
    text: 'Бублик резко ныряет носом в кусты. Там шуршит пакет и пахнет чужим обедом.',
    scenePose: 'sniff',
    location: 'park',
    traits: ['vacuum'],
    choices: [
      {
        title: 'Сказать “фу”',
        text: 'Коротко, спокойно, без паники.',
        effect: {
          stats: { obedience: 7, trust: 3, health: 3, mood: -2 },
          memory: 'Бублик нашёл подозрительную еду в кустах, но услышал ваше “фу”.',
          goalId: 'training-course',
          walk: { learnedRecall: 1 },
          scenePose: 'listen',
        },
      },
      {
        title: 'Отвлечь вкусняшкой',
        text: 'Поменять неизвестную находку на честную сделку.',
        effect: {
          treats: -1,
          stats: { trust: 5, obedience: 5, health: 2 },
          memory: 'В кустах было что-то сомнительное, но вкусняшка оказалась убедительнее.',
          scenePose: 'treat',
        },
      },
      {
        title: 'Посмотреть, что там',
        text: 'Любопытство заразительно.',
        effect: {
          stats: { mood: 5, health: -9, obedience: -4 },
          memory: 'Вы вместе заглянули в кусты. Бублик был счастлив, желудок не обещал того же.',
          scenePose: 'sniff',
        },
      },
    ],
  },
  {
    id: 'walk-free-dog',
    title: 'К вам бежит чужая собака',
    text: 'С дорожки несётся собака без поводка. Бублик застыл между восторгом и вопросом “мы это делаем?”.',
    scenePose: 'meet',
    location: 'park',
    traits: ['friendly', 'timid'],
    choices: [
      {
        title: 'Познакомить спокойно',
        text: 'Дать собакам дугу, паузу и шанс.',
        effect: {
          stats: { mood: 9, trust: 5, reputation: 6, obedience: 2 },
          memory: 'Бублик познакомился с корги Ричи без суеты и потом долго оглядывался ему вслед.',
          goalId: 'friend',
          walk: { foundFriend: true },
          scenePose: 'friend',
        },
      },
      {
        title: 'Уйти в сторону',
        text: 'Не каждое знакомство обязательно.',
        effect: {
          stats: { trust: 4, mood: -2, reputation: 2 },
          memory: 'Вы увели Бублика от слишком резкой собаки, и он держался ближе обычного.',
          scenePose: 'close',
        },
      },
      {
        title: 'Взять Бублика ближе',
        text: 'Сначала безопасность, потом социальная жизнь.',
        effect: {
          stats: { trust: 2, obedience: 4, mood: -4, ownerFatigue: 3 },
          memory: 'Чужая собака пронеслась мимо, а Бублик остался рядом на коротком поводке.',
          scenePose: 'close',
        },
      },
    ],
  },
  {
    id: 'walk-pigeons',
    title: 'Голуби на дорожке',
    text: 'Голуби идут по своим делам. Бублик уверен, что его пригласили руководить процессом.',
    scenePose: 'hunt',
    location: 'park',
    traits: ['hunter', 'hyperactive'],
    choices: [
      {
        title: 'Позвать к себе',
        text: 'Проверить, сильнее ли связь древнего инстинкта.',
        effect: {
          stats: { obedience: 9, trust: 4, mood: 1 },
          memory: 'Бублик увидел голубей, но вернулся на ваш зов. Это было почти кино.',
          goalId: 'recall',
          walk: { learnedRecall: 1 },
          scenePose: 'listen',
        },
      },
      {
        title: 'Потренировать выдержку',
        text: 'Сделать из голубей учебное пособие.',
        effect: {
          stats: { obedience: 12, trust: 3, ownerFatigue: 5, mood: -2 },
          memory: 'Голуби стали тренировкой выдержки, а не хаотичной погоней.',
          goalId: 'training-course',
          scenePose: 'training',
        },
      },
      {
        title: 'Отпустить ситуацию',
        text: 'Пусть побегает, мир переживёт.',
        effect: {
          stats: { mood: 12, dirt: 6, obedience: -5, reputation: -3 },
          memory: 'Бублик устроил короткую охоту на голубей и вернулся абсолютно довольным.',
          scenePose: 'run',
        },
      },
    ],
  },
  {
    id: 'walk-stick',
    title: 'Идеальная палка',
    text: 'Бублик нашёл палку. Не просто палку, а палку, ради которой стоит пересмотреть планы на день.',
    scenePose: 'stick',
    location: 'park',
    choices: [
      {
        title: 'Нести палку домой',
        text: 'Пусть будет трофей.',
        effect: {
          stats: { mood: 10, trust: 3, apartment: -4 },
          memory: 'Бублик нёс домой палку так гордо, будто добыл её в честном походе.',
          scenePose: 'stick',
        },
      },
      {
        title: 'Поиграть рядом',
        text: 'Палка остаётся в парке, история остаётся с вами.',
        effect: {
          stats: { mood: 11, trust: 5, ownerFatigue: 4, dirt: 4 },
          memory: 'Вы играли с найденной палкой, пока Бублик не решил, что парк сегодня удался.',
          scenePose: 'play',
        },
      },
      {
        title: 'Обменять на вкусняшку',
        text: 'Практиковать честный обмен.',
        effect: {
          treats: -1,
          stats: { obedience: 8, trust: 4, mood: 2 },
          memory: 'Бублик обменял великую палку на вкусняшку и почти не пожалел.',
          scenePose: 'treat',
        },
      },
    ],
  },
  {
    id: 'walk-refuse-home',
    title: 'Домой? Нет',
    text: 'Вы разворачиваетесь к дому. Бублик садится посреди дорожки и становится памятником прогулке.',
    scenePose: 'stubborn',
    location: 'park',
    traits: ['stubborn'],
    choices: [
      {
        title: 'Уговорить',
        text: 'Мягко, терпеливо, без борьбы за власть.',
        effect: {
          stats: { trust: 6, obedience: 4, ownerFatigue: 3 },
          memory: 'Бублик не хотел домой, но согласился после честных переговоров.',
          scenePose: 'listen',
        },
      },
      {
        title: 'Взять на руки',
        text: 'Не самый элегантный, зато быстрый метод.',
        effect: {
          stats: { trust: -2, mood: -5, ownerFatigue: 9 },
          memory: 'Бублик был вынесен с прогулки на руках и выглядел как оскорблённый принц.',
          scenePose: 'carry',
        },
      },
      {
        title: 'Пойти ещё немного',
        text: 'Иногда уступка дешевле конфликта.',
        effect: {
          stats: { mood: 9, trust: 3, ownerFatigue: 7, toilet: 5 },
          memory: 'Вы пошли ещё немного, и Бублик решил, что умеет договариваться.',
          scenePose: 'walk',
        },
      },
    ],
  },
  {
    id: 'walk-storm',
    title: 'Гром над парком',
    text: 'Небо глухо бухает. Бублик прижимает уши и смотрит, куда спрятаться.',
    scenePose: 'scared',
    location: 'park',
    traits: ['timid'],
    choices: [
      {
        title: 'Присесть рядом',
        text: 'Стать маленьким укрытием.',
        effect: {
          stats: { trust: 10, mood: 4, ownerFatigue: 4 },
          memory: 'В парке загремело, и Бублик переждал страшный звук рядом с вами.',
          goalId: 'storm',
          walk: { survivedStorm: true },
          scenePose: 'close',
        },
      },
      {
        title: 'Быстро идти домой',
        text: 'Сократить путь и шум.',
        effect: {
          stats: { trust: 4, mood: -2, ownerFatigue: 6 },
          memory: 'Гром выгнал вас домой, но Бублик держался рядом.',
          scenePose: 'close',
        },
      },
      {
        title: 'Не обращать внимания',
        text: 'Может, само пройдёт.',
        effect: {
          stats: { trust: -8, mood: -10, obedience: -4 },
          memory: 'Бублик испугался грома и не сразу понял, что вы на его стороне.',
          scenePose: 'scared',
        },
      },
    ],
  },
  {
    id: 'walk-bench-human',
    title: 'Человек на лавочке',
    text: 'Незнакомец улыбается и спрашивает, можно ли погладить Бублика.',
    scenePose: 'meet',
    location: 'park',
    traits: ['friendly', 'timid'],
    choices: [
      {
        title: 'Попросить подойти спокойно',
        text: 'Сделать знакомство безопасным.',
        effect: {
          stats: { reputation: 8, trust: 5, mood: 5, obedience: 3 },
          memory: 'Бублик познакомился с добрым человеком на лавочке и вёл себя удивительно взрослым.',
          scenePose: 'friend',
        },
      },
      {
        title: 'Отказать',
        text: 'Сегодня не день для контактов.',
        effect: {
          stats: { trust: 3, reputation: -1, mood: -1 },
          memory: 'Вы отказали в поглаживании, потому что настроение Бублика важнее вежливости.',
          scenePose: 'close',
        },
      },
      {
        title: 'Разрешить сразу',
        text: 'Бублик же милый. Что может пойти не так?',
        effect: {
          stats: { mood: 7, reputation: -4, obedience: -3 },
          memory: 'Бублик прыгнул знакомиться слишком радостно, и лавочка слегка ахнула.',
          scenePose: 'jump',
        },
      },
    ],
  },
  {
    id: 'walk-dog-school',
    title: 'Мини-занятие на площадке',
    text: 'На площадке кто-то тренирует собак. Бублик смотрит то на них, то на ваш карман с вкусняшками.',
    scenePose: 'training',
    location: 'park',
    choices: [
      {
        title: 'Встать рядом и повторять',
        text: 'Без давления, просто попробовать.',
        effect: {
          stats: { obedience: 12, trust: 5, ownerFatigue: 5 },
          memory: 'Вы присоединились к занятию на площадке, и Бублик поймал ритм команд.',
          goalId: 'training-course',
          walk: { learnedRecall: 1 },
          scenePose: 'training',
        },
      },
      {
        title: 'Смотреть со стороны',
        text: 'Учиться без сцены.',
        effect: {
          stats: { obedience: 5, trust: 2, ownerFatigue: -1 },
          memory: 'Вы посмотрели тренировку со стороны и унесли пару полезных идей.',
          scenePose: 'watch',
        },
      },
      {
        title: 'Уйти играть',
        text: 'Сегодня больше радости, меньше школы.',
        effect: {
          stats: { mood: 10, trust: 3, obedience: -2 },
          memory: 'Бублик выбрал игру вместо занятий и явно счёл день удачным.',
          scenePose: 'play',
        },
      },
    ],
  },
  {
    id: 'walk-contest',
    title: 'Дворовый конкурс',
    text: 'У площадки собираются собачники: “Кто покажет самый милый трюк?” Бублик делает вид, что он готов.',
    scenePose: 'contest',
    location: 'park',
    choices: [
      {
        title: 'Показать “ко мне”',
        text: 'Ставка на связь между вами.',
        effect: {
          stats: { reputation: 10, trust: 6, obedience: 7, mood: 6 },
          memory: 'На любительском конкурсе Бублик прибежал на “ко мне” и сорвал аплодисменты.',
          goalId: 'contest',
          walk: { contestScore: 1, learnedRecall: 1 },
          scenePose: 'contest',
        },
      },
      {
        title: 'Показать смешной поклон',
        text: 'Не идеально, зато харизма.',
        effect: {
          stats: { reputation: 7, mood: 10, trust: 4 },
          memory: 'Бублик показал поклон, который был наполовину трюком, наполовину импровизацией.',
          goalId: 'contest',
          walk: { contestScore: 1 },
          scenePose: 'contest',
        },
      },
      {
        title: 'Не выступать',
        text: 'Остаться зрителями тоже нормально.',
        effect: {
          stats: { trust: 2, ownerFatigue: -2 },
          memory: 'Вы посмотрели дворовый конкурс со стороны, и Бублик спокойно сидел рядом.',
          scenePose: 'watch',
        },
      },
    ],
  },
  {
    id: 'walk-mud',
    title: 'Лужа судьбы',
    text: 'Впереди лужа. Бублик видит не грязь, а приглашение.',
    scenePose: 'mud',
    location: 'park',
    traits: ['hyperactive', 'destroyer'],
    choices: [
      {
        title: 'Обойти',
        text: 'Скучно, но полотенце скажет спасибо.',
        effect: {
          stats: { obedience: 5, trust: 2, dirt: -2 },
          memory: 'Вы обошли лужу, хотя Бублик считал это упущенной культурной возможностью.',
          scenePose: 'walk',
        },
      },
      {
        title: 'Разрешить прыгнуть',
        text: 'Пусть радость будет мокрой.',
        effect: {
          stats: { mood: 13, dirt: 18, trust: 4, reputation: -2 },
          memory: 'Бублик прыгнул в лужу так счастливо, что прохожие невольно улыбнулись.',
          scenePose: 'mud',
        },
      },
      {
        title: 'Потренировать “рядом”',
        text: 'Лужа как экзамен.',
        effect: {
          stats: { obedience: 9, trust: 3, mood: -3, ownerFatigue: 4 },
          memory: 'Лужа стала упражнением “рядом”, и Бублик почти победил себя.',
          goalId: 'training-course',
          scenePose: 'training',
        },
      },
    ],
  },
];

export const endings: Record<string, Ending> = {
  responsible: {
    id: 'responsible',
    title: 'Ответственный собачник',
    text: 'Неделя получилась не идеальной, но живой. Бублик доверяет вам, дом стоит, а воспоминаний стало больше, чем тревог.',
  },
  happyDogBrokenOwner: {
    id: 'happyDogBrokenOwner',
    title: 'Собака счастлива, хозяин уничтожен',
    text: 'Бублик прожил неделю мечты: прогулки, палки, знакомства, приключения. Вы тоже счастливы, просто теперь умеете спать сидя.',
  },
  districtThreat: {
    id: 'districtThreat',
    title: 'Гроза района',
    text: 'Двор запомнит эту неделю. Бублик яркий, громкий и самостоятельный, а соседи теперь читают расписание прогулок по звукам.',
  },
  minusSofa: {
    id: 'minusSofa',
    title: 'Минус диван',
    text: 'Квартира стала картой приключений Бублика. Диван не пережил сюжет, зато у вас есть богатый архив воспоминаний.',
  },
  legend: {
    id: 'legend',
    title: 'Легенда собачьей площадки',
    text: 'Вы стали командой. Бублик слушает не потому, что обязан, а потому что верит вам. На площадке это заметили все.',
  },
};
