import type { DayGoalId, GoalStatus } from '../types';

export function getGoalStatusLabel(status: GoalStatus) {
  if (status === 'done') return 'выполнено';
  if (status === 'failed') return 'провалено';
  if (status === 'at_risk') return 'под угрозой';
  return 'в процессе';
}

export function getGoalDisplayText(id: DayGoalId) {
  switch (id) {
    case 'calmMorning':
      return {
        description: 'Помочь Бублику спокойно начать день.',
        title: 'Спокойное утро',
      };
    case 'keepTrust':
      return {
        description: 'Не кричать и сохранять контакт.',
        title: 'Сохранить доверие',
      };
    case 'homeSafe':
      return {
        description: 'Не дать квартире стать зоной бедствия.',
        title: 'Без происшествий дома',
      };
    case 'noNewFear':
      return {
        description: 'Погулять без стресса.',
        title: 'Спокойная прогулка',
      };
  }
}

export function getModalJournal(stateJournal: string[]) {
  if (stateJournal.length) return stateJournal.slice(-6);

  return [
    'Бублик принёс носок',
    'Ты обменял носок на игрушку',
    'Бублик понял, что вещи можно менять',
  ];
}

export function getModalConsequences(stateJournal: string[]) {
  if (!stateJournal.length) {
    return ['Бублик стал спокойнее', 'Доверие сохранилось', 'Стресс не вырос'];
  }

  return [
    'История дня уже меняется',
    'Бублик запоминает твои решения',
    'Последствия проявятся в следующих ситуациях',
  ];
}
