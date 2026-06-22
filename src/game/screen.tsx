import { type CSSProperties, useCallback, useEffect, useMemo, useReducer, useRef } from 'react';

import { uiAssets } from './assets';
import { getDisplayTimeLabel, getResultText } from './presentation/event-text';
import { getDaySummary, getMeters, getSkillList } from './selectors';
import { getGameSavePreview, saveGameState } from './storage';
import { hasNextStoryDay } from './story';
import { EventPanel } from './ui/event-panel';
import { ChoiceActionBar, DaySummaryActionBar, ResultActionBar } from './ui/game-actions';
import { GameHud } from './ui/game-hud';
import { GameScene } from './ui/game-scene';
import { InfoPanelDialog, type InfoPanelId } from './ui/info-panel/dialog';
import { StartMenu } from './ui/start-menu';
import { playfieldControlsClassName } from './ui/ui-classes';
import { useGame } from './use-game';

type GameScreenStyle = CSSProperties & {
  '--choice-card': string;
  '--dialog-panel': string;
  '--heart-empty': string;
  '--heart-full': string;
};

type ScreenMode = 'game' | 'menu';

interface ScreenUiState {
  activePanel: InfoPanelId | null;
  isMenuLeaving: boolean;
  savePreview: ReturnType<typeof getGameSavePreview>;
  screenMode: ScreenMode;
  showNewGameConfirm: boolean;
}

type ScreenUiAction =
  | { type: 'clear-save-preview' }
  | { type: 'close-panel' }
  | { type: 'enter-game' }
  | { type: 'finish-menu-fade' }
  | { type: 'hide-new-game-confirm' }
  | { savePreview: ReturnType<typeof getGameSavePreview>; type: 'open-menu' }
  | { panel: InfoPanelId; type: 'open-panel' }
  | { type: 'show-new-game-confirm' };

function createInitialScreenUiState(): ScreenUiState {
  return {
    activePanel: null,
    isMenuLeaving: false,
    savePreview: getGameSavePreview(),
    screenMode: 'menu',
    showNewGameConfirm: false,
  };
}

function screenUiReducer(state: ScreenUiState, action: ScreenUiAction): ScreenUiState {
  if (action.type === 'clear-save-preview') {
    return {
      ...state,
      savePreview: null,
      showNewGameConfirm: false,
    };
  }

  if (action.type === 'close-panel') {
    return {
      ...state,
      activePanel: null,
    };
  }

  if (action.type === 'enter-game') {
    return {
      ...state,
      activePanel: null,
      isMenuLeaving: true,
      screenMode: 'game',
      showNewGameConfirm: false,
    };
  }

  if (action.type === 'finish-menu-fade') {
    return {
      ...state,
      isMenuLeaving: false,
    };
  }

  if (action.type === 'hide-new-game-confirm') {
    return {
      ...state,
      showNewGameConfirm: false,
    };
  }

  if (action.type === 'open-menu') {
    return {
      ...state,
      activePanel: null,
      isMenuLeaving: false,
      savePreview: action.savePreview,
      screenMode: 'menu',
      showNewGameConfirm: false,
    };
  }

  if (action.type === 'open-panel') {
    return {
      ...state,
      activePanel: action.panel,
    };
  }

  return {
    ...state,
    showNewGameConfirm: true,
  };
}

export default function GameScreen() {
  const { choose, continueGame, event, loadSavedGame, nextDay, reset, state } = useGame();
  const [uiState, dispatchUi] = useReducer(screenUiReducer, undefined, createInitialScreenUiState);
  const transitionTimeoutRef = useRef<number | null>(null);
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

  const enterGame = useCallback(() => {
    if (transitionTimeoutRef.current) window.clearTimeout(transitionTimeoutRef.current);

    dispatchUi({ type: 'enter-game' });
    transitionTimeoutRef.current = window.setTimeout(() => {
      dispatchUi({ type: 'finish-menu-fade' });
      transitionTimeoutRef.current = null;
    }, 250);
  }, []);

  const startNewGame = useCallback(() => {
    reset();
    dispatchUi({ type: 'clear-save-preview' });
    enterGame();
  }, [enterGame, reset]);

  const continueSavedGame = useCallback(() => {
    if (!loadSavedGame()) {
      dispatchUi({ type: 'clear-save-preview' });
      return;
    }

    enterGame();
  }, [enterGame, loadSavedGame]);

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
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;

      if (uiState.activePanel) {
        dispatchUi({ type: 'close-panel' });
        return;
      }

      if (uiState.screenMode === 'game') {
        saveGameState(state);
        dispatchUi({ savePreview: getGameSavePreview(), type: 'open-menu' });
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [state, uiState.activePanel, uiState.screenMode]);

  useEffect(
    () => () => {
      if (transitionTimeoutRef.current) window.clearTimeout(transitionTimeoutRef.current);
    },
    []
  );

  return (
    <main
      className='relative h-screen w-screen min-w-80 overflow-hidden bg-neutral-950 font-hand text-ink'
      aria-label='Симулятор собачника'
      data-location={state.location}
      data-screen-mode={uiState.screenMode}
      style={screenStyle}
    >
      {uiState.screenMode === 'game' && (
        <>
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
              dispatchUi({ panel: 'day', type: 'open-panel' });
            }}
            onOpenDogPanel={() => {
              dispatchUi({ panel: 'dog', type: 'open-panel' });
            }}
          />

          <section className={playfieldControlsClassName} aria-label='Текущая ситуация'>
            <EventPanel ariaLabel={eventPanelLabel} subtitle={eventSubtitle} title={eventTitle} />

            {state.phase === 'event' && (
              <ChoiceActionBar choices={event.choices} onChoose={choose} />
            )}

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
        </>
      )}

      {uiState.screenMode === 'game' && uiState.activePanel && (
        <InfoPanelDialog
          activePanel={uiState.activePanel}
          displayTimeLabel={displayTimeLabel}
          meters={meters}
          skills={skills}
          state={state}
          onClose={() => {
            dispatchUi({ type: 'close-panel' });
          }}
        />
      )}

      {(uiState.screenMode === 'menu' || uiState.isMenuLeaving) && (
        <StartMenu
          isLeaving={uiState.screenMode === 'game'}
          savePreview={uiState.savePreview}
          showNewGameConfirm={uiState.showNewGameConfirm}
          onCancelNewGame={() => {
            dispatchUi({ type: 'hide-new-game-confirm' });
          }}
          onConfirmNewGame={startNewGame}
          onContinue={continueSavedGame}
          onNewGame={() => {
            if (uiState.savePreview) {
              dispatchUi({ type: 'show-new-game-confirm' });
              return;
            }

            startNewGame();
          }}
        />
      )}
    </main>
  );
}
