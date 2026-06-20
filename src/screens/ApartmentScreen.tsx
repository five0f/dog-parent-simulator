import { type CSSProperties, useEffect, useMemo, useState } from 'react';
import dogHappy from '../assets/dog/dog-happy.png';
import dogIdle from '../assets/dog/dog-idle.png';
import dogLeashPull from '../assets/dog/dog-leash-pull.png';
import dogSit from '../assets/dog/dog-sit.png';
import dogSleep from '../assets/dog/dog-sleep.png';
import dogSniff from '../assets/dog/dog-sniff.png';
import dogSock from '../assets/dog/dog-sock.png';
import dogStressed from '../assets/dog/dog-stressed.png';
import homeBackground from '../assets/backgrounds/home.png';
import humanIdle from '../assets/human/human-idle.png';
import humanParkIdle from '../assets/human/human-idle-park.png';
import parkBackground from '../assets/backgrounds/park.png';
import breadAsset from '../assets/park/bread.png';
import pigeonFlyAsset from '../assets/park/pigeon_fly.png';
import pigeonIdleAsset from '../assets/park/pigeon_idle.png';
import pigeonPeckAsset from '../assets/park/pigeon_peck.png';
import stickAsset from '../assets/park/stick.png';
import tennisBallAsset from '../assets/park/tennis_ball.png';
import trashBagAsset from '../assets/park/trash_bag.png';
import dogAvatar from '../assets/ui/avatars/dog-avatar.png';
import buttonPanel from '../assets/ui/cards/button.png';
import choiceCard from '../assets/ui/cards/choice-card.png';
import dialogPanel from '../assets/ui/cards/dialog-panel.png';
import heartEmpty from '../assets/ui/icons/heart-empty.png';
import heartFull from '../assets/ui/icons/heart-full.png';
import iconDay from '../assets/ui/icons/icon-day.png';
import iconDog from '../assets/ui/icons/icon-dog.png';
import iconMoon from '../assets/ui/icons/icon-moon.png';
import iconSun from '../assets/ui/icons/icon-sun.png';
import { useApartmentGame } from '../game/useApartmentGame';
import {
  getDaySummary,
  getMeters,
  getSkillList,
  getUnlockedTraits,
  type ChoiceVariant,
  type EventChoice,
  type DogPose,
  type DogStatId,
  type GoalStatus,
  type LocationId,
  type SceneObjectId,
} from '../game/apartmentGame';
import './apartmentScreen.css';

type ActivePanel = 'day' | 'dog' | null;

type GameScreenStyle = CSSProperties & {
  '--choice-card': string;
  '--dialog-panel': string;
  '--heart-empty': string;
  '--heart-full': string;
  '--top-button': string;
};

const dogImages: Record<DogPose, string> = {
  happy: dogHappy,
  idle: dogIdle,
  leashPull: dogLeashPull,
  sit: dogSit,
  sleep: dogSleep,
  sniff: dogSniff,
  sock: dogSock,
  stressed: dogStressed,
};

const locationBackgrounds: Record<LocationId, string> = {
  home_after_walk: homeBackground,
  home_morning: homeBackground,
  park: parkBackground,
};

const sceneObjectImages: Record<SceneObjectId, string> = {
  bread: breadAsset,
  pigeonFly: pigeonFlyAsset,
  pigeonIdle: pigeonIdleAsset,
  pigeonPeck: pigeonPeckAsset,
  stick: stickAsset,
  tennisBall: tennisBallAsset,
  trashBag: trashBagAsset,
};

const choiceIcons: Record<ChoiceVariant, string> = {
  negative: '✋',
  neutral: '↔',
  positive: '♥',
};

const choiceOrder: Record<ChoiceVariant, number> = {
  positive: 0,
  neutral: 1,
  negative: 2,
};

function getTrustHeartCount(value: number) {
  return Math.max(0, Math.min(5, Math.round(value / 20)));
}

function getStatStateText(id: DogStatId, value: number) {
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

function getGoalStatusLabel(status: GoalStatus) {
  if (status === 'done') return 'выполнено';
  if (status === 'failed') return 'провалено';
  if (status === 'at_risk') return 'под угрозой';
  return 'в процессе';
}

function getChoiceCopy(choice: EventChoice, eventId: string) {
  if (eventId.includes('sock')) {
    if (choice.variant === 'positive') {
      return { description: 'Бублик будет рад', label: 'Похвалить' };
    }

    if (choice.variant === 'neutral') {
      return { description: 'Поменять носок на вкусняшку', label: 'Обменять' };
    }

    return { description: 'Просто забрать носок', label: 'Забрать' };
  }

  if (choice.variant === 'positive') return { description: 'Мягко и с доверием', label: choice.label };
  if (choice.variant === 'negative') return { description: 'Быстро, но рискованно', label: choice.label };
  return { description: 'Посмотреть, что будет', label: choice.label };
}

function getDisplayTimeLabel(location: LocationId, timeLabel: string) {
  if (location === 'park') return 'День';
  if (location === 'home_after_walk') return 'Вечер';
  return timeLabel;
}

function getResultCopy(resultText: string, storyChanges: string[]) {
  const [firstSentence, ...restSentences] = resultText.split(/(?<=\.)\s+/);
  const subtitle = restSentences.join(' ') || storyChanges[0] || '';

  return {
    subtitle,
    title: firstSentence || resultText,
  };
}

function getGoalDisplayText(id: string) {
  if (id === 'calmMorning') {
    return {
      description: 'Помочь Бублику спокойно начать день.',
      title: 'Спокойное утро',
    };
  }

  if (id === 'keepTrust') {
    return {
      description: 'Не кричать и сохранять контакт.',
      title: 'Сохранить доверие',
    };
  }

  if (id === 'apartmentSafe') {
    return {
      description: 'Не дать квартире стать зоной бедствия.',
      title: 'Без происшествий дома',
    };
  }

  return {
    description: 'Погулять без стресса.',
    title: 'Спокойная прогулка',
  };
}

function getModalJournal(stateJournal: string[]) {
  if (stateJournal.length) return stateJournal.slice(-3);

  return ['Бублик принёс носок', 'Ты обменял носок на игрушку', 'Бублик понял, что вещи можно менять'];
}

function getModalConsequences(stateJournal: string[]) {
  if (!stateJournal.length) {
    return ['Бублик стал спокойнее', 'Доверие сохранилось', 'Стресс не вырос'];
  }

  return ['История дня уже меняется', 'Бублик запоминает твои решения', 'Последствия проявятся в следующих ситуациях'];
}

function TrustHearts({ value }: { value: number }) {
  const filled = getTrustHeartCount(value);

  return (
    <div className="trust-hearts" aria-label={`Доверие: ${filled} из 5`}>
      {Array.from({ length: 5 }, (_, index) => (
        <span aria-hidden="true" className={index < filled ? 'trust-heart trust-heart--full' : 'trust-heart trust-heart--empty'} key={index} />
      ))}
    </div>
  );
}

export default function ApartmentScreen() {
  const { choose, continueGame, event, nextDay, reset, state } = useApartmentGame();
  const [activePanel, setActivePanel] = useState<ActivePanel>(null);
  const daySummary = getDaySummary(state);
  const visibleDogPose = state.pendingResult?.dogPose ?? event.dogPose;
  const visibleSceneObjects = state.pendingResult?.sceneObjects ?? event.sceneObjects;
  const background = locationBackgrounds[state.location];
  const humanImage = state.location === 'park' ? humanParkIdle : humanIdle;
  const displayTimeLabel = getDisplayTimeLabel(state.location, state.timeLabel);
  const isNight = displayTimeLabel === 'Вечер' || displayTimeLabel === 'Ночь';
  const unlockedTraits = getUnlockedTraits(state);
  const meters = getMeters(state);
  const skills = getSkillList(state);
  const resultCopy = state.pendingResult ? getResultCopy(state.pendingResult.resultText, state.pendingResult.storyChanges) : null;
  const screenStyle = useMemo<GameScreenStyle>(
    () => ({
      '--choice-card': `url(${choiceCard})`,
      '--dialog-panel': `url(${dialogPanel})`,
      '--heart-empty': `url(${heartEmpty})`,
      '--heart-full': `url(${heartFull})`,
      '--top-button': `url(${buttonPanel})`,
    }),
    [],
  );

  const eventTitle = state.phase === 'daySummary' ? daySummary.title : resultCopy?.title ?? event.title;
  const eventSubtitle =
    state.phase === 'daySummary'
      ? daySummary.storyLines.slice(0, 2).join(' ')
      : state.pendingResult
        ? resultCopy?.subtitle
        : event.description;

  useEffect(() => {
    if (!activePanel) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActivePanel(null);
    };

    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [activePanel]);

  return (
    <main className="apartment-screen" aria-label="Симулятор собачника" data-location={state.location} style={screenStyle}>
      <img className="scene-background" src={background} alt="" aria-hidden="true" />

      <section className="scene-layer" aria-label={state.location === 'park' ? 'Парк' : 'Квартира'}>
        <img className="scene-human" src={humanImage} alt="Хозяин" />
        {visibleSceneObjects.map((objectId) => (
          <img className={`scene-object scene-object--${objectId}`} src={sceneObjectImages[objectId]} alt="" aria-hidden="true" key={objectId} />
        ))}
        <img className={`scene-dog scene-dog--${visibleDogPose}`} src={dogImages[visibleDogPose]} alt="Бублик" />
      </section>

      <header className="top-dog-hud" aria-label="Бублик">
        <img className="dog-avatar" src={dogAvatar} alt="Бублик" />
        <div className="top-dog-info">
          <div className="dog-name">Бублик</div>
          <TrustHearts value={state.stats.trust} />
        </div>
      </header>

      <div className="day-time-label" aria-label={`День ${state.day}, ${displayTimeLabel}`}>
        <span>
          День {state.day}
          <span className="separator">•</span>
          {displayTimeLabel}
        </span>
        <img src={isNight ? iconMoon : iconSun} alt="" aria-hidden="true" />
      </div>

      <nav className="top-menu" aria-label="Меню">
        <button className="top-menu-button" type="button" onClick={() => setActivePanel('day')}>
          <img src={iconDay} alt="" aria-hidden="true" />
          <span>День</span>
        </button>
        <button className="top-menu-button" type="button" onClick={() => setActivePanel('dog')}>
          <img src={iconDog} alt="" aria-hidden="true" />
          <span>Бублик</span>
        </button>
      </nav>

      <section className="event-card" aria-label={state.pendingResult ? 'Результат выбора' : 'Событие'}>
        <h1 className="event-title">{eventTitle}</h1>
        {eventSubtitle && <p className="event-subtitle">{eventSubtitle}</p>}
      </section>

      {state.phase === 'event' && (
        <section className="choice-row" aria-label="Варианты действий">
          {[...event.choices]
            .sort((left, right) => choiceOrder[left.variant] - choiceOrder[right.variant])
            .map((choice) => {
              const choiceCopy = getChoiceCopy(choice, event.id);

              return (
                <button className={`choice-card choice-${choice.variant}`} key={choice.id} type="button" onClick={() => choose(choice.id)}>
                  <span className="choice-main">
                    <span className="choice-icon" aria-hidden="true">
                      {choiceIcons[choice.variant]}
                    </span>
                    <span className="choice-title">{choiceCopy.label}</span>
                  </span>
                  <span className="choice-description">{choiceCopy.description}</span>
                </button>
              );
            })}
        </section>
      )}

      {state.phase === 'result' && (
        <section className="choice-row choice-row--single" aria-label="Продолжить">
          <button className={`choice-card choice-${state.pendingResult?.variant ?? 'positive'}`} type="button" onClick={continueGame}>
            <span className="choice-main">
              <span className="choice-icon" aria-hidden="true">
                →
              </span>
              <span className="choice-title">Дальше</span>
            </span>
            <span className="choice-description">{state.pendingResult?.completeDay ? 'Посмотреть итоги дня' : 'К следующей ситуации'}</span>
          </button>
        </section>
      )}

      {state.phase === 'daySummary' && (
        <section className="choice-row choice-row--summary" aria-label="Итоги дня">
          <button className="choice-card choice-positive" type="button" onClick={nextDay}>
            <span className="choice-main">
              <span className="choice-icon" aria-hidden="true">
                ☀
              </span>
              <span className="choice-title">Следующий день</span>
            </span>
            <span className="choice-description">Бублик проснётся другим</span>
          </button>
          <button className="choice-card choice-neutral" type="button" onClick={reset}>
            <span className="choice-main">
              <span className="choice-icon" aria-hidden="true">
                ↺
              </span>
              <span className="choice-title">Начать заново</span>
            </span>
            <span className="choice-description">Вернуться к первому утру</span>
          </button>
        </section>
      )}

      {activePanel && (
        <div className="modal-backdrop" onClick={() => setActivePanel(null)}>
          <aside className={`side-modal side-modal--${activePanel}`} role="dialog" aria-modal="true" aria-labelledby={`${activePanel}-modal-title`} onClick={(event) => event.stopPropagation()}>
            {activePanel === 'day' ? (
              <>
                <h2 id="day-modal-title">
                  День {state.day} • {displayTimeLabel}
                </h2>
                <p className="modal-kicker">Утро без катастроф</p>
                <section className="modal-section">
                  <h3>Цели дня</h3>
                  <ul className="goal-list">
                    {state.goals.map((goal) => {
                      const displayGoal = getGoalDisplayText(goal.id);

                      return (
                        <li className={`goal-item goal-item--${goal.status.replace('_', '-')}`} key={goal.id}>
                          <strong>{displayGoal.title}</strong>
                          <span>Статус: {getGoalStatusLabel(goal.status)}</span>
                          <small>{displayGoal.description}</small>
                        </li>
                      );
                    })}
                  </ul>
                </section>
                <section className="modal-section">
                  <h3>Журнал событий</h3>
                  <ul className="journal-list">
                    {getModalJournal(state.journal).map((entry, index) => (
                      <li key={`${entry}-${index}`}>{entry}</li>
                    ))}
                  </ul>
                </section>
                <section className="modal-section">
                  <h3>Последствия</h3>
                  <ul className="journal-list">
                    {getModalConsequences(state.journal).map((entry, index) => (
                      <li key={`${entry}-${index}`}>{entry}</li>
                    ))}
                  </ul>
                </section>
                <button className="modal-action" type="button" onClick={() => setActivePanel(null)}>
                  Закрыть
                </button>
              </>
            ) : (
              <>
                <div className="dog-profile-head">
                  <img src={dogAvatar} alt="Бублик" />
                  <div>
                    <h2 id="dog-modal-title">Бублик</h2>
                    <p>4 месяца</p>
                    <TrustHearts value={state.stats.trust} />
                  </div>
                </div>
                <section className="modal-section">
                  <h3>Состояние</h3>
                  <ul className="modal-stat-list">
                    {meters.map((meter) => (
                      <li key={meter.id}>
                        <strong>{meter.title}</strong>
                        <span>{getStatStateText(meter.id, meter.value)}</span>
                        <small>{meter.value}/100</small>
                      </li>
                    ))}
                  </ul>
                </section>
                <section className="modal-section">
                  <h3>Навыки</h3>
                  <ul className="modal-stat-list modal-stat-list--skills">
                    {skills.map((skill) => (
                      <li key={skill.id}>
                        <strong>{skill.title}</strong>
                        <span>{skill.value >= 50 ? 'уверенно' : skill.value >= 20 ? 'учится' : 'пока сложно'}</span>
                        <small>{skill.value}/100</small>
                      </li>
                    ))}
                  </ul>
                </section>
                <section className="modal-section">
                  <h3>Черты характера</h3>
                  <ul className="trait-list">
                    <li>Любитель носков</li>
                    <li>Липучка</li>
                    <li>Спокойный пёс</li>
                    {unlockedTraits
                      .filter((trait) => !['Любитель носков', 'Липучка', 'Спокойный пёс'].includes(trait.title))
                      .map((trait) => (
                        <li key={trait.id} title={trait.description}>
                          {trait.title}
                        </li>
                      ))}
                  </ul>
                </section>
                <button className="modal-action" type="button" onClick={() => setActivePanel(null)}>
                  Закрыть
                </button>
              </>
            )}
          </aside>
        </div>
      )}
    </main>
  );
}
