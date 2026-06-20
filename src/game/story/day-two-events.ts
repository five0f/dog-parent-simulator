import type { StoryEvent } from '../types';

export const dayTwoEvents: StoryEvent[] = [
  {
    id: 'day2-sock',
    location: 'home_morning',
    title: 'Носок возвращается.',
    description: state => {
      if (state.decisionMemory.praisedSock > state.decisionMemory.tookResourceByForce) {
        return 'Бублик принёс носок и сразу посмотрел на игрушку. Кажется, он понял, что добыча меняется на что-то лучше.';
      }

      if (state.decisionMemory.tookResourceByForce > 0) {
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
            memory: { tookResourceByForce: 1 },
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
    description: state => {
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
          storyChanges: ['Он справился с маленьким разочарованием.', 'Прогулка осталась ровной.'],
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
          resultText:
            'Палка стала главным пассажиром прогулки. Управляемость временно уехала в отпуск.',
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
    description: state => {
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
          resultText:
            'Ты дал Бублику восстановиться. Он заснул с видом человека, который всё понял про парк.',
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
