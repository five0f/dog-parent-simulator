import { useEffect, useState } from 'react';
import dogHappy from '../assets/dog/dog-happy.png';
import dogIdle from '../assets/dog/dog-idle.png';
import dogLeashPull from '../assets/dog/dog-leash-pull.png';
import dogSit from '../assets/dog/dog-sit.png';
import dogSleep from '../assets/dog/dog-sleep.png';
import dogSniff from '../assets/dog/dog-sniff.png';
import dogSock from '../assets/dog/dog-sock.png';
import dogStressed from '../assets/dog/dog-stressed.png';
import humanIdle from '../assets/human/human-idle.png';
import homeBackground from '../assets/locations/home.png';
import parkBackground from '../assets/locations/park.png';
import breadAsset from '../assets/park/bread.png';
import stickAsset from '../assets/park/stick.png';
import tennisBallAsset from '../assets/park/tennis_ball.png';
import trashBagAsset from '../assets/park/trash_bag.png';
import pigeonFlyAsset from '../assets/pigeon/pigeon_fly.png';
import pigeonIdleAsset from '../assets/pigeon/pigeon_idle.png';
import pigeonPeckAsset from '../assets/pigeon/pigeon_peck.png';
import goalBadge from '../assets/ui/goal_badge.png';
import traitBadge from '../assets/ui/trait_badge.png';
import { Button, Card, DogAvatar, DogStats, HeaderLabel, SkillList, type DogStatItem, type IconName } from '../components/ui';
import { useApartmentGame } from '../game/useApartmentGame';
import {
  getDaySummary,
  getGoalsTheme,
  getLocationTab,
  getMeters,
  getSkillList,
  getUnlockedTraits,
  type DogPose,
  type DogStatId,
  type GoalStatus,
  type LocationId,
  type SceneObjectId,
} from '../game/apartmentGame';
import './apartmentScreen.css';

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

const meterIcons: Record<DogStatId, IconName> = {
  trust: 'trust',
  energy: 'energy',
  stress: 'stress',
  hunger: 'food',
  walkNeed: 'walk',
  playNeed: 'play',
};

function getTrustHearts(value: number) {
  const filled = Math.max(0, Math.min(5, Math.round(value / 20)));
  return `${'❤️'.repeat(filled)}${'🤍'.repeat(5 - filled)}`;
}

function getMood(value: number) {
  if (value >= 75) return '😊';
  if (value >= 45) return '🙂';
  return '😟';
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

export default function ApartmentScreen() {
  const { choose, continueGame, event, nextDay, reset, state } = useApartmentGame();
  const [showTechnicalChanges, setShowTechnicalChanges] = useState(false);
  const activeLocation = getLocationTab(state.location);
  const daySummary = getDaySummary(state);
  const trust = state.stats.trust;
  const dogStats: DogStatItem[] = getMeters(state).map((meter) => ({
    icon: meterIcons[meter.id],
    stateText: getStatStateText(meter.id, meter.value),
    title: meter.title,
    value: meter.value,
  }));
  const skills = getSkillList(state);
  const visibleDogPose = state.pendingResult?.dogPose ?? event.dogPose;
  const visibleSceneObjects = state.pendingResult?.sceneObjects ?? event.sceneObjects;
  const dogImage = dogImages[visibleDogPose];
  const background = locationBackgrounds[state.location];
  const unlockedTraits = getUnlockedTraits(state);
  const isChoiceLocked = state.phase !== 'event';

  useEffect(() => {
    setShowTechnicalChanges(false);
  }, [state.pendingResult?.choiceId]);

  return (
    <main className="apartment-screen" aria-label="Симулятор собачника" data-location={state.location}>
      <img className="apartment-screen__background" src={background} alt="" aria-hidden="true" />

      <div className="apartment-screen__top">
        <HeaderLabel className="apartment-screen__time">
          {state.timeLabel}, день {state.day}
        </HeaderLabel>
        <div className="apartment-screen__locations" aria-label="Локации">
          <Button aria-pressed={activeLocation === 'home'} variant={activeLocation === 'home' ? 'positive' : 'neutral'}>
            Дом
          </Button>
          <Button aria-pressed={activeLocation === 'park'} variant={activeLocation === 'park' ? 'positive' : 'neutral'}>
            Парк
          </Button>
        </div>
      </div>

      <section className="apartment-scene" aria-label={activeLocation === 'home' ? 'Квартира' : 'Парк'}>
        <img className="apartment-scene__human" src={humanIdle} alt="Хозяин" />
        {visibleSceneObjects.map((objectId) => (
          <img className={`apartment-scene__object apartment-scene__object--${objectId}`} src={sceneObjectImages[objectId]} alt="" aria-hidden="true" key={objectId} />
        ))}
        <img className={`apartment-scene__dog apartment-scene__dog--${visibleDogPose}`} src={dogImage} alt="Бублик" />
      </section>

      <aside className="apartment-left" aria-label="Бублик">
        <Card
          variant="small"
          className="apartment-card apartment-card--dog"
          style={{ width: 'var(--side-card-width)', aspectRatio: '330 / 120' }}
          contentStyle={{ display: 'grid', gridTemplateColumns: 'var(--avatar-size) 1fr', alignItems: 'center', gap: '10px', padding: '12px 18px' }}
        >
          <DogAvatar src={dogIdle} alt="Бублик" className="apartment-dog-avatar" imageStyle={{ transform: 'scale(1.22) translateY(3%)' }} />
          <div className="apartment-dog-copy">
            <h1>Бублик</h1>
            <p>4 месяца</p>
            <p>Настроение: {getMood(trust)}</p>
            <p>Доверие: {getTrustHearts(trust)}</p>
          </div>
        </Card>

        <Card
          variant="medium"
          className="apartment-card apartment-card--state"
          style={{ width: 'var(--side-card-width)', aspectRatio: '330 / 300' }}
          contentStyle={{ display: 'grid', alignContent: 'start', gap: '8px', padding: '16px 20px' }}
        >
          <HeaderLabel className="apartment-card__label">Состояние</HeaderLabel>
          <DogStats items={dogStats} />
        </Card>

        <Card
          variant="medium"
          className="apartment-card apartment-card--skills"
          style={{ width: 'var(--side-card-width)', aspectRatio: '330 / 210' }}
          contentStyle={{ display: 'grid', alignContent: 'start', gap: '9px', padding: '16px 20px' }}
        >
          <HeaderLabel className="apartment-card__label">Навыки</HeaderLabel>
          <SkillList items={skills} />
        </Card>

        <Card
          variant="medium"
          className="apartment-card apartment-card--traits"
          style={{ width: 'var(--side-card-width)', aspectRatio: '330 / 178' }}
          contentStyle={{ display: 'grid', alignContent: 'start', gap: '9px', padding: '16px 20px' }}
        >
          <HeaderLabel className="apartment-card__label">Характер</HeaderLabel>
          {unlockedTraits.length ? (
            <ul className="apartment-traits">
              {unlockedTraits.map((trait) => (
                <li className="apartment-trait-badge" key={trait.id} style={{ backgroundImage: `url(${traitBadge})` }} title={trait.description}>
                  <span>{trait.title}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="apartment-traits__empty">Характер Бублика ещё формируется.</p>
          )}
        </Card>
      </aside>

      <aside className="apartment-right" aria-label="Цели дня">
        <Card
          variant="medium"
          className="apartment-card apartment-card--goals"
          style={{ width: 'var(--side-card-width)', aspectRatio: '330 / 408' }}
          contentStyle={{ display: 'grid', alignContent: 'start', gap: '9px', padding: '17px 21px' }}
        >
          <HeaderLabel className="apartment-card__label">Цели дня</HeaderLabel>
          <p className="apartment-goals__theme">{getGoalsTheme(state)}</p>
          <ul className="apartment-goals">
            {state.goals.map((goal) => (
              <li className={`apartment-goals__item apartment-goals__item--${goal.status.replace('_', '-')}`} key={goal.id} style={{ backgroundImage: `url(${goalBadge})` }}>
                <span className="apartment-goals__status">{getGoalStatusLabel(goal.status)}</span>
                <span className="apartment-goals__label">{goal.label}</span>
                <small>{goal.reason}</small>
              </li>
            ))}
          </ul>
        </Card>
      </aside>

      {state.phase !== 'daySummary' && (
        <section className="apartment-event" aria-label="Событие">
          <Card
            variant="medium"
            className="apartment-card apartment-card--event"
            style={{ width: 'var(--event-card-width)', aspectRatio: '440 / 152' }}
            contentStyle={{ display: 'grid', alignContent: 'center', justifyItems: 'center', gap: '8px', padding: '18px 28px' }}
          >
            <HeaderLabel className="apartment-card__label">Событие</HeaderLabel>
            <h2>{event.title}</h2>
            <p>{event.description}</p>
          </Card>
        </section>
      )}

      {state.phase !== 'daySummary' && (
        <section className="apartment-actions" aria-label={state.pendingResult ? 'Результат выбора' : 'Что делать'}>
        <Card
          variant="large"
          className={state.pendingResult ? 'apartment-card apartment-card--actions apartment-card--actions-result' : 'apartment-card apartment-card--actions'}
          style={{ width: 'var(--action-card-width)', aspectRatio: state.pendingResult ? '760 / 350' : '760 / 168' }}
          contentStyle={{ display: 'grid', alignContent: 'center', justifyItems: 'center', gap: '11px', padding: '20px 28px' }}
        >
          {state.pendingResult ? (
            <>
              <HeaderLabel className="apartment-card__label">Результат</HeaderLabel>
              <p className="apartment-result-text">{state.pendingResult.resultText}</p>
              <div className="apartment-story-changes">
                <h3>Что изменилось</h3>
                <ul>
                  {state.pendingResult.storyChanges.map((change) => (
                    <li key={change}>{change}</li>
                  ))}
                </ul>
              </div>
              <Button className="apartment-technical-toggle" variant="neutral" onClick={() => setShowTechnicalChanges((isShown) => !isShown)}>
                {showTechnicalChanges ? 'Скрыть цифры' : 'Показать цифры'}
              </Button>
              {showTechnicalChanges && (
                <ul className="apartment-change-list apartment-change-list--technical">
                  {(state.pendingResult.changes.length ? state.pendingResult.changes : ['Без числовых изменений']).map((change) => (
                    <li key={change}>{change}</li>
                  ))}
                </ul>
              )}
              <Button className="apartment-next" variant="positive" onClick={continueGame}>
                Дальше
              </Button>
            </>
          ) : (
            <>
              <HeaderLabel className="apartment-card__label">Что делать?</HeaderLabel>
              <div className="apartment-actions__buttons">
                {event.choices.map((choice) => (
                  <Button className="apartment-choice" disabled={isChoiceLocked} key={choice.id} variant={choice.variant} onClick={() => choose(choice.id)}>
                    {choice.label}
                  </Button>
                ))}
              </div>
            </>
          )}
        </Card>
        </section>
      )}

      {state.phase === 'daySummary' && (
        <section className="apartment-summary" aria-label="Итоги дня">
          <Card
            variant="large"
            className="apartment-card apartment-card--summary"
            style={{ width: 'var(--summary-card-width)', aspectRatio: '760 / 640' }}
            contentStyle={{ display: 'grid', alignContent: 'start', gap: '12px', padding: '26px 34px' }}
          >
            <HeaderLabel className="apartment-card__label">{daySummary.title}</HeaderLabel>
            <div className="apartment-summary__grid">
              <section>
                <h3>Сегодня Бублик</h3>
                <ul>
                  {daySummary.storyLines.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </section>
              <section>
                <h3>Что закрепилось</h3>
                <ul>
                  {daySummary.reinforcedLines.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </section>
              <section>
                <h3>Новые черты</h3>
                {daySummary.newTraits.length ? (
                  <ul className="apartment-summary__trait-list">
                    {daySummary.newTraits.map((trait) => (
                      <li className="apartment-trait-badge" key={trait.id} style={{ backgroundImage: `url(${traitBadge})` }} title={trait.description}>
                        <span>{trait.title}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>Новых черт пока нет. Бублик ещё присматривается к жизни.</p>
                )}
              </section>
              <section>
                <h3>Цели дня</h3>
                <ul className="apartment-summary__goal-list">
                  {daySummary.goalSummaries.map((goal) => (
                    <li className={`apartment-summary__goal apartment-summary__goal--${goal.status.replace('_', '-')}`} key={goal.label} style={{ backgroundImage: `url(${goalBadge})` }}>
                      <strong>{goal.label}</strong>
                      <span>{getGoalStatusLabel(goal.status)}</span>
                      <small>{goal.explanation}</small>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
            <div className="apartment-summary__buttons">
              <Button variant="positive" onClick={nextDay}>
                Начать следующий день
              </Button>
              <Button variant="neutral" onClick={reset}>
                Начать заново
              </Button>
            </div>
          </Card>
        </section>
      )}

      {state.phase !== 'daySummary' && (
        <button className="apartment-reset" type="button" onClick={reset}>
          Начать заново
        </button>
      )}
    </main>
  );
}
