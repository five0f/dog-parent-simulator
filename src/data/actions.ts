import type { Decision, DogTrait, DogTraitId, Goal, LocationId } from '../types';

export const locations: Record<LocationId, { title: string; button: string; emoji: string; description: string }> = {
  home: {
    title: 'Квартира',
    button: 'Дом',
    emoji: '🏠',
    description: 'Место, где Бублик хранит носки, сны и свои великие планы.',
  },
  yard: {
    title: 'Двор',
    button: 'Двор',
    emoji: '🏢',
    description: 'Лавочки, подъездные новости и первые запахи дня.',
  },
  park: {
    title: 'Прогулка',
    button: 'Парк',
    emoji: '🌳',
    description: 'Дорожка идёт вперёд, а Бублик ведёт к приключениям.',
  },
  shop: {
    title: 'Зоомагазин',
    button: 'Магазин',
    emoji: '🛒',
    description: 'Полки, запах корма и игрушки, которые пищат слишком убедительно.',
  },
  vet: {
    title: 'Ветеринарка',
    button: 'Вет',
    emoji: '🏥',
    description: 'Тихий кабинет, умный взгляд врача и немного храбрости.',
  },
  grooming: {
    title: 'Груминг',
    button: 'Груминг',
    emoji: '✂️',
    description: 'Пена, щётки и шанс снова стать собакой, а не облаком пыли.',
  },
};

export const dogTraits: Record<DogTraitId, DogTrait> = {
  vacuum: {
    id: 'vacuum',
    title: 'Пылесос',
    description: 'Находит еду там, где её не должно быть, и считает это талантом.',
  },
  timid: {
    id: 'timid',
    title: 'Трусишка',
    description: 'Осторожен с громкими звуками, большими собаками и подозрительными пакетами.',
  },
  hyperactive: {
    id: 'hyperactive',
    title: 'Гиперактивный',
    description: 'У него внутри маленькая батарейка, которую никто не выключал.',
  },
  stubborn: {
    id: 'stubborn',
    title: 'Упрямый',
    description: 'Если Бублик решил идти налево, переговоры начинаются именно там.',
  },
  friendly: {
    id: 'friendly',
    title: 'Дружелюбный',
    description: 'Готов знакомиться с людьми, собаками и иногда с урнами.',
  },
  destroyer: {
    id: 'destroyer',
    title: 'Разрушитель',
    description: 'Когда скучно, интерьер становится интерактивным.',
  },
  hunter: {
    id: 'hunter',
    title: 'Охотник',
    description: 'Голуби, листья и шорохи запускают древние инстинкты.',
  },
  beggar: {
    id: 'beggar',
    title: 'Попрошайка',
    description: 'Умеет смотреть так, будто не ел с прошлой эпохи.',
  },
};

export const goals: Goal[] = [
  {
    id: 'no-complaints',
    title: 'Неделя без войны с соседями',
    description: 'Сохранить репутацию во дворе и не превратить подъезд в драму.',
    done: false,
  },
  {
    id: 'recall',
    title: 'Команда “ко мне”',
    description: 'Несколько раз успешно позвать Бублика на прогулке.',
    done: false,
  },
  {
    id: 'friend',
    title: 'Собачий друг',
    description: 'Познакомиться с собакой так, чтобы это стало воспоминанием.',
    done: false,
  },
  {
    id: 'contest',
    title: 'Любительский конкурс',
    description: 'Набрать уверенность и репутацию для дворового конкурса.',
    done: false,
  },
  {
    id: 'storm',
    title: 'Пережить грозу',
    description: 'Остаться рядом с Бубликом, когда миру слишком громко.',
    done: false,
  },
  {
    id: 'training-course',
    title: 'Курс дрессировки',
    description: 'Сделать доверие и послушание настоящей командной работой.',
    done: false,
  },
];

export const lifeDecisions: Decision[] = [
  {
    id: 'morning-door',
    title: 'Бублик у двери',
    text: 'Утро. Бублик сидит у двери с видом существа, которое уже составило маршрут. Поводок лежит рядом подозрительно аккуратно.',
    scenePose: 'door',
    location: 'home',
    choices: [
      {
        title: 'Выйти сразу',
        text: 'Пижама под курткой тоже стиль.',
        effect: {
          startWalk: true,
          time: 1,
          stats: { toilet: 18, mood: 8, trust: 5, ownerFatigue: 6 },
          memory: 'Бублик понял, что иногда его просьбы слышат с первого взгляда.',
        },
      },
      {
        title: 'Ещё полежать 10 минут',
        text: 'Проверить, насколько собака уважает ваше право на одеяло.',
        effect: {
          time: 1,
          nextDecisionId: 'late-morning',
          stats: { toilet: -16, mood: -5, trust: -3, apartment: -3 },
          memory: 'Бублик десять минут вздыхал у двери, как маленький театральный критик.',
          scenePose: 'door',
        },
      },
      {
        title: 'Сначала завтрак',
        text: 'Попытаться начать день как цивилизованный человек.',
        effect: {
          time: 1,
          nextDecisionId: 'breakfast-eyes',
          stats: { satiety: 14, toilet: -9, mood: 3, trust: 1 },
          memory: 'Бублик получил завтрак, но дверь всё равно осталась главным событием утра.',
          scenePose: 'bowl',
        },
      },
    ],
  },
  {
    id: 'late-morning',
    title: 'Терпение кончается',
    text: 'Бублик уже не сидит. Он ходит от двери к вам и обратно, будто запускает тревожную сирену без звука.',
    scenePose: 'door',
    location: 'home',
    choices: [
      {
        title: 'Быстро на улицу',
        text: 'Спасти коврик и утро.',
        effect: {
          startWalk: true,
          time: 1,
          stats: { toilet: 12, mood: 5, trust: 3, ownerFatigue: 4 },
          memory: 'Вы успели выйти до домашней катастрофы. Бублик был благодарен по-своему.',
        },
      },
      {
        title: 'Попросить подождать ещё',
        text: 'Опасная дипломатия.',
        effect: {
          nextDecisionId: 'home-chaos',
          stats: { toilet: -18, trust: -6, apartment: -14, reputation: -2 },
          memory: 'Бублик не дождался. Коврик стал частью большой истории взросления.',
          scenePose: 'mess',
        },
      },
      {
        title: 'Отвлечь игрушкой',
        text: 'Может, сработает. Может, игрушка пострадает.',
        effect: {
          nextDecisionId: 'day-lull',
          stats: { mood: 8, toilet: -10, apartment: -5, trust: 1 },
          memory: 'Бублик согласился на игрушку, но дверь всё равно держал в поле зрения.',
          scenePose: 'toy',
        },
      },
    ],
  },
  {
    id: 'breakfast-eyes',
    title: 'Глаза напротив стола',
    text: 'Вы едите. Бублик смотрит так, будто вся еда в мире была создана для проверки вашей щедрости.',
    scenePose: 'beg',
    location: 'home',
    choices: [
      {
        title: 'Не поддаваться',
        text: 'Любовь любовью, а привычки важнее.',
        effect: {
          nextDecisionId: 'day-lull',
          stats: { obedience: 6, trust: 2, mood: -2 },
          memory: 'Бублик не получил кусочек со стола и впервые задумался о правилах дома.',
        },
      },
      {
        title: 'Дать маленький кусочек',
        text: 'Слабость, но очень человеческая.',
        effect: {
          nextDecisionId: 'day-lull',
          stats: { mood: 8, health: -3, obedience: -4, trust: 1 },
          memory: 'Бублик получил кусочек и записал стол в список перспективных мест.',
        },
      },
      {
        title: 'Взять вкусняшку для тренировки',
        text: 'Пусть просьба станет упражнением.',
        effect: {
          nextDecisionId: 'day-lull',
          treats: -1,
          stats: { obedience: 8, trust: 4, mood: 4 },
          memory: 'Попрошайничество превратилось в маленькую тренировку выдержки.',
          goalId: 'training-course',
        },
      },
    ],
  },
  {
    id: 'day-lull',
    title: 'Тихий час с подвохом',
    text: 'Днём квартира замирает. Бублик то ложится, то внезапно приносит вам взгляд “а давай что-нибудь?”.',
    scenePose: 'idle',
    location: 'home',
    choices: [
      {
        title: 'Пойти на большую прогулку',
        text: 'Довериться улице и всем её странностям.',
        effect: {
          startWalk: true,
          time: 1,
          stats: { mood: 7, ownerFatigue: 6, trust: 3 },
          memory: 'Вы выбрали прогулку вместо прокрастинации. Бублик одобрил всем корпусом.',
        },
      },
      {
        title: 'Зайти в зоомагазин',
        text: 'Заодно проверить силу воли у полки с игрушками.',
        effect: {
          nextDecisionId: 'shop-choice',
          location: 'shop',
          time: 1,
          stats: { ownerFatigue: 4 },
          memory: 'Вы с Бубликом зашли в зоомагазин, где каждая полка обещала счастье.',
          scenePose: 'shop',
        },
      },
      {
        title: 'Остаться дома и заняться командой',
        text: 'Короткое занятие без муштры.',
        effect: {
          nextDecisionId: 'evening-window',
          time: 1,
          stats: { obedience: 10, trust: 6, mood: 3, ownerFatigue: 7 },
          memory: 'Бублик сделал “ко мне” в комнате и получил честную радость вместо экзамена.',
          goalId: 'recall',
          walk: { learnedRecall: 1 },
          scenePose: 'training',
        },
      },
    ],
  },
  {
    id: 'shop-choice',
    title: 'Полка соблазнов',
    text: 'В магазине Бублик завис между пакетом корма, смешной игрушкой и витриной с вкусняшками.',
    scenePose: 'shop',
    location: 'shop',
    choices: [
      {
        title: 'Купить красивую игрушку',
        text: 'Она бесполезная, но Бублик уже выбрал её глазами.',
        effect: {
          nextDecisionId: 'evening-window',
          money: -20,
          toy: true,
          stats: { mood: 14, trust: 4, apartment: -3 },
          memory: 'Бублик вынес из магазина игрушку, которая пищит как маленькая катастрофа.',
          scenePose: 'toy',
        },
      },
      {
        title: 'Взять хорошие вкусняшки',
        text: 'Инвестиция в будущие переговоры.',
        effect: {
          nextDecisionId: 'evening-window',
          money: -15,
          treats: 3,
          stats: { obedience: 5, trust: 2 },
          memory: 'В кармане появились вкусняшки, и Бублик стал смотреть на вас стратегически.',
        },
      },
      {
        title: 'Поговорить с консультантом',
        text: 'Узнать, что правда нужно, а что просто красиво.',
        effect: {
          nextDecisionId: 'evening-window',
          money: -10,
          stats: { health: 8, trust: 3, ownerFatigue: 3 },
          memory: 'Консультант помог выбрать полезную мелочь, а не блестящую ерунду.',
        },
      },
    ],
  },
  {
    id: 'home-chaos',
    title: 'Квартира после паузы',
    text: 'На полу следы, игрушка под столом, Бублик виновато виляет хвостом. Это не катастрофа, но уже глава.',
    scenePose: 'mess',
    location: 'home',
    choices: [
      {
        title: 'Не ругаться, а выйти',
        text: 'Сначала причина, потом последствия.',
        effect: {
          startWalk: true,
          time: 1,
          stats: { trust: 6, toilet: 18, mood: 4, apartment: -2 },
          memory: 'Вы не стали ругать Бублика за опоздание человека. Доверие заметно потеплело.',
        },
      },
      {
        title: 'Строго объяснить правила',
        text: 'Тон взрослый, сердце мягкое.',
        effect: {
          nextDecisionId: 'day-lull',
          stats: { obedience: 5, trust: -5, mood: -8, apartment: 4 },
          memory: 'Бублик понял, что вы недовольны, но не до конца понял, как остановить время.',
        },
      },
      {
        title: 'Посмеяться и принять хаос',
        text: 'Иногда дом живой. Очень живой.',
        effect: {
          nextDecisionId: 'day-lull',
          stats: { mood: 8, trust: 3, apartment: -8, reputation: -2 },
          memory: 'Вы рассмеялись над бардаком, и Бублик решил, что жизнь всё ещё хороша.',
        },
      },
    ],
  },
  {
    id: 'evening-window',
    title: 'Вечер у окна',
    text: 'За окном двор, собаки, люди и запахи. Бублик кладёт голову на подоконник и тихо поскуливает.',
    scenePose: 'window',
    location: 'home',
    choices: [
      {
        title: 'Вечерняя прогулка',
        text: 'Самый правильный риск.',
        effect: {
          startWalk: true,
          time: 1,
          stats: { mood: 8, trust: 4, ownerFatigue: 5 },
          memory: 'Вечерняя прогулка началась с тихого счастья у лифта.',
        },
      },
      {
        title: 'Сходить к ветеринару',
        text: 'Если что-то тревожит, лучше узнать правду.',
        effect: {
          nextDecisionId: 'vet-room',
          location: 'vet',
          time: 1,
          money: -25,
          stats: { health: 16, ownerFatigue: 7, mood: -3, trust: 2 },
          memory: 'Ветеринар сказал, что лучше смотреть на собаку, а не на форумы ночью.',
          scenePose: 'vet',
        },
      },
      {
        title: 'Остаться рядом дома',
        text: 'Плед, тёплый бок и спокойный вечер.',
        effect: {
          nextDecisionId: 'night-sounds',
          time: 1,
          stats: { mood: 8, trust: 7, ownerFatigue: -8, toilet: -10 },
          memory: 'Бублик уснул рядом, и квартира стала тише.',
          scenePose: 'sleep',
        },
      },
    ],
  },
  {
    id: 'vet-room',
    title: 'В кабинете',
    text: 'Бублик стоит на столе и делает вид, что он маленький камень. Врач говорит спокойно, но хвост не уверен.',
    scenePose: 'vet',
    location: 'vet',
    choices: [
      {
        title: 'Поддерживать голосом',
        text: 'Быть рядом, пока страшно.',
        effect: {
          nextDecisionId: 'night-sounds',
          stats: { health: 8, trust: 8, mood: 2 },
          memory: 'На осмотре Бублик всё время слышал ваш голос и держался храбрее.',
          goalId: 'storm',
        },
      },
      {
        title: 'Попросить план профилактики',
        text: 'Понять, как заботиться без паники.',
        effect: {
          nextDecisionId: 'night-sounds',
          money: -10,
          stats: { health: 14, trust: 4, ownerFatigue: 2 },
          memory: 'Врач составил понятный план, и здоровье Бублика стало меньше загадкой.',
        },
      },
      {
        title: 'Скорее уйти',
        text: 'Иногда хочется просто закончить стресс.',
        effect: {
          nextDecisionId: 'night-sounds',
          stats: { mood: 4, trust: -3, health: 3 },
          memory: 'Вы быстро вышли из клиники, но тревожность Бублика осталась в поводке.',
        },
      },
    ],
  },
  {
    id: 'night-sounds',
    title: 'Ночные звуки',
    text: 'Ночь. За окном хлопнула дверь или, может, далёкий салют. Бублик поднимает голову и ищет вас глазами.',
    scenePose: 'alert',
    location: 'home',
    choices: [
      {
        title: 'Сесть рядом на пол',
        text: 'Побыть островом безопасности.',
        effect: {
          time: 1,
          nextDecisionId: 'morning-door',
          stats: { trust: 10, mood: 6, ownerFatigue: 6 },
          memory: 'Ночью Бублик испугался звука, но нашёл вас рядом.',
          goalId: 'storm',
          walk: { survivedStorm: true },
          scenePose: 'sleep',
        },
      },
      {
        title: 'Сказать “всё хорошо” с кровати',
        text: 'Полусонная поддержка тоже поддержка.',
        effect: {
          time: 1,
          nextDecisionId: 'morning-door',
          stats: { trust: 3, mood: 1, ownerFatigue: -4 },
          memory: 'Бублик поверил вашему сонному голосу не сразу, но всё-таки улёгся.',
          scenePose: 'sleep',
        },
      },
      {
        title: 'Не реагировать',
        text: 'Проверить, справится ли сам.',
        effect: {
          time: 1,
          nextDecisionId: 'morning-door',
          stats: { trust: -7, mood: -8, reputation: -4, ownerFatigue: -5 },
          memory: 'Бублик долго слушал ночь один и пару раз тревожно гавкнул.',
          scenePose: 'alert',
        },
      },
    ],
  },
];
