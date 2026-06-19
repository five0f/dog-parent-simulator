import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  chooseEventOption,
  continueAfterResult,
  createInitialApartmentState,
  getCurrentEvent,
  loadApartmentState,
  resetApartmentSave,
  saveApartmentState,
  startNextDay,
} from './apartmentGame';

export function useApartmentGame() {
  const [state, setState] = useState(loadApartmentState);
  const event = useMemo(() => getCurrentEvent(state), [state]);

  useEffect(() => {
    saveApartmentState(state);
  }, [state]);

  const choose = useCallback((choiceId: string) => {
    setState((currentState) => chooseEventOption(currentState, choiceId));
  }, []);

  const continueGame = useCallback(() => {
    setState((currentState) => continueAfterResult(currentState));
  }, []);

  const nextDay = useCallback(() => {
    setState((currentState) => startNextDay(currentState));
  }, []);

  const reset = useCallback(() => {
    resetApartmentSave();
    setState(createInitialApartmentState());
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
