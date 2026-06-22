import { useCallback, useMemo, useState } from 'react';

import { chooseEventOption, continueAfterResult, startNextDay } from './engine';
import { createInitialGameState } from './state-factory';
import { readGameSave, resetGameSave, saveGameState } from './storage';
import { getCurrentEvent } from './story/registry';
import type { GameState } from './types';

export function useGame() {
  const [state, setState] = useState(createInitialGameState);
  const event = useMemo(() => getCurrentEvent(state), [state]);

  const commitState = useCallback((updater: (state: GameState) => GameState) => {
    setState(currentState => {
      const nextState = updater(currentState);
      if (nextState !== currentState) saveGameState(nextState);
      return nextState;
    });
  }, []);

  const choose = useCallback(
    (choiceId: string) => {
      commitState(currentState => chooseEventOption(currentState, choiceId));
    },
    [commitState]
  );

  const continueGame = useCallback(() => {
    commitState(currentState => continueAfterResult(currentState));
  }, [commitState]);

  const nextDay = useCallback(() => {
    commitState(currentState => startNextDay(currentState));
  }, [commitState]);

  const loadSavedGame = useCallback(() => {
    const savedState = readGameSave();
    if (!savedState) return false;

    setState(savedState);
    return true;
  }, []);

  const reset = useCallback(() => {
    resetGameSave();
    setState(createInitialGameState());
  }, []);

  return {
    choose,
    continueGame,
    event,
    loadSavedGame,
    nextDay,
    reset,
    state,
  };
}
