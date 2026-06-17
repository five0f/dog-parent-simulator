export type LocationId = 'home' | 'yard' | 'park' | 'shop' | 'vet' | 'grooming';

export type TimeOfDay = 'Утро' | 'День' | 'Вечер' | 'Ночь';

export type GameMode = 'life' | 'walk';

export type DogTraitId =
  | 'vacuum'
  | 'timid'
  | 'hyperactive'
  | 'stubborn'
  | 'friendly'
  | 'destroyer'
  | 'hunter'
  | 'beggar';

export type StatKey =
  | 'ownerFatigue'
  | 'satiety'
  | 'toilet'
  | 'mood'
  | 'health'
  | 'dirt'
  | 'obedience'
  | 'apartment'
  | 'reputation'
  | 'trust';

export type Stats = Record<StatKey, number>;

export interface DogTrait {
  id: DogTraitId;
  title: string;
  description: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  done: boolean;
}

export interface WalkState {
  step: number;
  total: number;
  foundFriend: boolean;
  learnedRecall: number;
  contestScore: number;
  survivedStorm: boolean;
}

export interface GameState {
  day: number;
  timeIndex: number;
  money: number;
  location: LocationId;
  mode: GameMode;
  currentDecisionId: string;
  scenePose: string;
  stats: Stats;
  traits: DogTraitId[];
  inventory: {
    toy: boolean;
    treats: number;
  };
  memories: string[];
  dayNotes: string[];
  goals: Goal[];
  walk: WalkState;
  daySummary: DaySummaryData | null;
  ending: EndingId | null;
}

export interface StatChange {
  money?: number;
  time?: number;
  toy?: boolean;
  treats?: number;
  memory?: string;
  scenePose?: string;
  location?: LocationId;
  mode?: GameMode;
  startWalk?: boolean;
  endWalk?: boolean;
  nextDecisionId?: string;
  goalId?: string;
  walk?: Partial<WalkState>;
  stats?: Partial<Stats>;
}

export interface DecisionChoice {
  title: string;
  text: string;
  effect: StatChange;
}

export interface Decision {
  id: string;
  title: string;
  text: string;
  scenePose: string;
  location: LocationId;
  choices: DecisionChoice[];
}

export interface DaySummaryData {
  day: number;
  title: string;
  notes: string[];
  conditionLines: string[];
  money: number;
}

export type EndingId =
  | 'responsible'
  | 'happyDogBrokenOwner'
  | 'districtThreat'
  | 'minusSofa'
  | 'legend';

export interface Ending {
  id: EndingId;
  title: string;
  text: string;
}
