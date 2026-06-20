import type { DayGoal, DayGoalId, GameState, GoalStatus } from './types';

export function resolveGoals(state: GameState): DayGoal[] {
  return state.goals.map(goal => resolveGoal(goal, state));
}

export function cloneGoals(goals: DayGoal[]): DayGoal[] {
  return goals.map(goal => ({ ...goal }));
}

function resolveGoal(goal: DayGoal, state: GameState): DayGoal {
  const statusData = getGoalStatus(goal.id, state);

  return {
    ...goal,
    completed: statusData.status === 'done',
    reason: statusData.reason,
    status: statusData.status,
  };
}

function getGoalStatus(id: DayGoalId, state: GameState): { status: GoalStatus; reason: string } {
  const flags = state.flags;
  const leftHomeStress =
    typeof flags.leftHomeStress === 'number' ? flags.leftHomeStress : undefined;
  const hasLeftHome =
    leftHomeStress !== undefined ||
    state.location === 'park' ||
    state.location === 'home_after_walk' ||
    state.phase === 'daySummary';
  const isSummary = state.phase === 'daySummary';
  const harshTrustAction =
    flags.scoldedBublik === true || flags.harshObjectTake === true || flags.yankedLeash === true;
  const homeDamage =
    flags.homeDamage === true ||
    flags.puddleHappened === true ||
    flags.sockChewed === true ||
    flags.chewedBag === true;
  const walkStarted =
    state.location === 'park' || state.location === 'home_after_walk' || isSummary;

  if (id === 'calmMorning') {
    if (hasLeftHome) {
      const stressAtDoor = leftHomeStress ?? state.stats.stress;
      return stressAtDoor <= 50
        ? {
            status: 'done',
            reason: 'Ты вывел Бублика до того, как ожидание стало слишком напряжённым.',
          }
        : { status: 'failed', reason: 'К выходу из дома стресс был выше среднего.' };
    }

    if (state.stats.stress >= 40 || state.stats.walkNeed >= 76 || flags.puddleRisk === true) {
      return {
        status: 'at_risk',
        reason: 'Бублик долго ждёт прогулку, и утро становится нервным.',
      };
    }

    return {
      status: 'in_progress',
      reason: 'Пока утро идёт спокойно. Важно не затягивать с прогулкой.',
    };
  }

  if (id === 'keepTrust') {
    if (harshTrustAction) return { status: 'failed', reason: getTrustFailureReason(state) };
    if (isSummary)
      return {
        status: 'done',
        reason: 'Ты не отбирал вещи силой, не ругал Бублика и не дёргал поводок.',
      };
    if (state.stats.trust < 58 || state.traits.resourceGuarding >= 35) {
      return {
        status: 'at_risk',
        reason: 'Доверие уже хрупкое: сейчас особенно важны спокойные решения.',
      };
    }

    return { status: 'in_progress', reason: 'Пока ты сохраняешь контакт даже в глупых ситуациях.' };
  }

  if (id === 'homeSafe') {
    if (homeDamage) return { status: 'failed', reason: getHomeFailureReason(state) };
    if (isSummary)
      return {
        status: 'done',
        reason: 'Дома обошлось без луж, разгрызенных носков и других происшествий.',
      };
    if (
      state.stats.walkNeed >= 76 ||
      flags.puddleRisk === true ||
      getNumberFlag(flags, 'walkIgnoredCount') > 0
    ) {
      return { status: 'at_risk', reason: 'Бублик уже долго ждёт прогулку. Квартира под угрозой.' };
    }

    return {
      status: 'in_progress',
      reason: 'Пока квартира держится. Бублик занят, но ему скоро понадобится улица.',
    };
  }

  if (flags.usedHarshWalkAction === true || flags.yankedLeash === true) {
    return {
      status: 'failed',
      reason: 'На прогулке было резкое действие, и поводок стал тревожнее.',
    };
  }

  if (walkStarted && state.stats.stress > 50) {
    return { status: 'failed', reason: 'Стресс на прогулке поднялся выше безопасного уровня.' };
  }

  if (isSummary || state.location === 'home_after_walk') {
    return {
      status: 'done',
      reason: 'Ты вернулся без резких действий, и стресс остался управляемым.',
    };
  }

  if (state.location === 'park' && (state.stats.stress >= 40 || state.traits.leashBehavior < 50)) {
    return {
      status: 'at_risk',
      reason: 'Прогулка напряжённая: сейчас лучше выбирать мягкие действия.',
    };
  }

  return {
    status: 'in_progress',
    reason: 'Прогулка ещё впереди. Новый страх появится только от стресса и резкости.',
  };
}

function getTrustFailureReason(state: GameState): string {
  if (state.flags.scoldedBublik === true)
    return 'Ты наругал Бублика, и он не понял, как вернуть безопасность.';
  if (state.flags.yankedLeash === true) return 'Ты дёрнул поводок, и доверие на прогулке просело.';
  if (state.flags.harshObjectTake === true)
    return 'Ты резко отобрал предмет, и Бублик стал осторожнее с добычей.';
  return 'Одно из решений оказалось слишком резким для доверия.';
}

function getHomeFailureReason(state: GameState): string {
  if (state.flags.puddleHappened === true)
    return 'Бублик не дождался прогулки и сделал лужу у двери.';
  if (state.flags.sockChewed === true) return 'Носок остался без присмотра и был разгрызен.';
  if (state.flags.chewedBag === true) return 'Бублик добрался до пакета и устроил домашний ущерб.';
  return 'Дома случился ущерб, которого можно было избежать.';
}

function getNumberFlag(flags: GameState['flags'], key: string): number {
  const value = flags[key];
  return typeof value === 'number' ? value : 0;
}
