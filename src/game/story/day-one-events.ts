import type { StoryEvent } from '../types';

export const dayOneEvents: StoryEvent[] = [
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
          resultText:
            'Ты похвалил Бублика и обменял носок на игрушку. Бублик решил, что дипломатия работает.',
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
            memory: { tookResourceByForce: 1 },
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
        outcome: state => {
          const walkIgnoredCount = (Number(state.flags.walkIgnoredCount) || 0) + 1;
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
            journal: puddleRisk
              ? 'Бублик уже слишком долго ждёт прогулку.'
              : 'Ты отложил прогулку, и Бублик остался ждать у двери.',
            nextEventId: puddleRisk ? 'puddle' : 'leash',
          };
        },
      },
      {
        id: 'distract-play',
        label: 'Отвлечь игрой',
        variant: 'neutral',
        outcome: state => {
          const nextWalkNeed = state.stats.walkNeed + 8;
          const puddleRisk = Boolean(state.flags.puddleRisk) || nextWalkNeed >= 80;

          return {
            resultText:
              'Ты попробовал отвлечь Бублика игрой. Ему весело, но туалетную проблему это не отменило.',
            storyChanges: [
              'Играть было приятно, но прогулка всё ещё нужна.',
              'Часть энергии ушла в игру.',
              puddleRisk
                ? 'Ожидание уже стало опасным для квартиры.'
                : 'Бублик немного отвлёкся, но продолжает помнить про дверь.',
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
          resultText:
            'Ты наругал Бублика. Он не понял, как это связано с прогулкой, но понял, что дома стало страшнее.',
          storyChanges: [
            'Бублик испугался и не понял, как исправить ситуацию.',
            'Доверие резко просело.',
            'Дом стал для него менее безопасным местом.',
          ],
          effects: {
            flags: {
              homeDamage: true,
              puddleHappened: true,
              puddleRisk: false,
              scoldedBublik: true,
            },
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
          resultText:
            'Бублик отскочил от голубя, но теперь поводок стал чуть менее приятной штукой.',
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
            memory: { tookResourceByForce: 1 },
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
        outcome: state => {
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
];
