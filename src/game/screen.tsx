import { type CSSProperties, useEffect, useMemo, useState } from 'react';

import { uiAssets } from './assets';
import { getDisplayTimeLabel, getResultText } from './presentation/event-text';
import { getDaySummary, getMeters, getSkillList } from './selectors';
import { hasNextStoryDay } from './story';
import { EventPanel } from './ui/event-panel';
import { ChoiceActionBar, DaySummaryActionBar, ResultActionBar } from './ui/game-actions';
import { GameHud } from './ui/game-hud';
import { GameScene } from './ui/game-scene';
import { InfoPanelDialog, type InfoPanelId } from './ui/info-panel/dialog';
import { playfieldControlsClassName } from './ui/ui-classes';
import { useGame } from './use-game';

type GameScreenStyle = CSSProperties & {
  '--choice-card': string;
  '--dialog-panel': string;
  '--heart-empty': string;
  '--heart-full': string;
};

export default function GameScreen() {
  const { choose, continueGame, event, nextDay, reset, state } = useGame();
  const [activePanel, setActivePanel] = useState<InfoPanelId | null>(null);
  const daySummary = getDaySummary(state);
  const visibleDogPose = state.pendingResult?.dogPose ?? event.dogPose;
  const visibleSceneObjects = state.pendingResult?.sceneObjects ?? event.sceneObjects;
  const displayTimeLabel = getDisplayTimeLabel(state.location, state.timeLabel);
  const meters = getMeters(state);
  const skills = getSkillList(state);
  const resultText = state.pendingResult
    ? getResultText(state.pendingResult.resultText, state.pendingResult.storyChanges)
    : null;
  const screenStyle = useMemo<GameScreenStyle>(
    () => ({
      '--choice-card': `url(${uiAssets.choiceCard})`,
      '--dialog-panel': `url(${uiAssets.dialogPanel})`,
      '--heart-empty': `url(${uiAssets.heartEmpty})`,
      '--heart-full': `url(${uiAssets.heartFull})`,
    }),
    []
  );

  const eventTitle =
    state.phase === 'daySummary' ? daySummary.title : (resultText?.title ?? event.title);
  const eventSubtitle =
    state.phase === 'daySummary'
      ? daySummary.storyLines.slice(0, 2)
      : state.pendingResult
        ? resultText?.subtitle
        : event.description;
  const eventPanelLabel =
    state.phase === 'daySummary'
      ? 'Итоги дня'
      : state.phase === 'result'
        ? 'Результат выбора'
        : 'Событие';

  useEffect(() => {
    if (!activePanel) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActivePanel(null);
    };

    window.addEventListener('keydown', closeOnEscape);
    return () => {
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [activePanel]);

  return (
    <main
      className='relative h-screen w-screen min-w-80 overflow-hidden bg-neutral-950 font-hand text-ink'
      aria-label='Симулятор собачника'
      data-location={state.location}
      style={screenStyle}
    >
      <GameScene
        dogPose={visibleDogPose}
        location={state.location}
        sceneObjects={visibleSceneObjects}
      />

      <GameHud
        day={state.day}
        displayTimeLabel={displayTimeLabel}
        trust={state.stats.trust}
        onOpenDayPanel={() => {
          setActivePanel('day');
        }}
        onOpenDogPanel={() => {
          setActivePanel('dog');
        }}
      />

      <section className={playfieldControlsClassName} aria-label='Текущая ситуация'>
        <EventPanel ariaLabel={eventPanelLabel} subtitle={eventSubtitle} title={eventTitle} />

        {state.phase === 'event' && <ChoiceActionBar choices={event.choices} onChoose={choose} />}

        {state.phase === 'result' && (
          <ResultActionBar
            completeDay={state.pendingResult?.completeDay}
            variant={state.pendingResult?.variant}
            onContinue={continueGame}
          />
        )}

        {state.phase === 'daySummary' && (
          <DaySummaryActionBar
            hasNextDay={hasNextStoryDay(state.day)}
            onNextDay={nextDay}
            onReset={reset}
          />
        )}
      </section>

      {activePanel && (
        <InfoPanelDialog
          activePanel={activePanel}
          displayTimeLabel={displayTimeLabel}
          meters={meters}
          skills={skills}
          state={state}
          onClose={() => {
            setActivePanel(null);
          }}
        />
      )}
    </main>
  );
}
