import { useCallback, useEffect, useMemo, useState } from 'react';

import { chooseEventOption, continueAfterResult, startNextDay } from './engine';
import { createInitialGameState } from './state-factory';
import { loadGameState, resetGameSave, saveGameState } from './storage';
import { getCurrentEvent } from './story/registry';

export function useGame() {
  const [state, setState] = useState(loadGameState);
  const event = useMemo(() => getCurrentEvent(state), [state]);

  useEffect(() => {
    saveGameState(state);
  }, [state]);

  const choose = useCallback((choiceId: string) => {
    setState(currentState => chooseEventOption(currentState, choiceId));
  }, []);

  const continueGame = useCallback(() => {
    setState(currentState => continueAfterResult(currentState));
  }, []);

  const nextDay = useCallback(() => {
    setState(currentState => startNextDay(currentState));
  }, []);

  const reset = useCallback(() => {
    resetGameSave();
    setState(createInitialGameState());
  }, []);

  return {
    choose,
    continueGame,
    event,
    nextDay,
    reset,
    state,
  };
}
