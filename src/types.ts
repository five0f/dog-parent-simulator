export type LocationId = 'home' | 'park';

export type TimeOfDay = 'Утро' | 'День' | 'Вечер' | 'Ночь';

export type GameMode = 'home' | 'walk';

export type DogPose = 'idle' | 'sit' | 'sleep' | 'curious' | 'happy';

export type DogTraitId = 'curious' | 'stubborn' | 'timid' | 'brave' | 'vacuum' | 'friendly';

export type StatKey = 'mood' | 'trust' | 'health';

export type Stats = Record<StatKey, number>;

export interface DogTrait {
  id: DogTraitId;
  title: string;
  description: string;
}

export interface GameState {
  day: number;
  timeIndex: number;
  location: LocationId;
  mode: GameMode;
  currentDecisionId: string;
  dogPose: DogPose;
  emotion: string;
  stats: Stats;
  traits: DogTraitId[];
  memories: string[];
  dayNotes: string[];
  daySummary: DaySummaryData | null;
  ending: EndingId | null;
}

export interface StatChange {
  time?: number;
  memory?: string;
  dogPose?: DogPose;
  emotion?: string;
  location?: LocationId;
  mode?: GameMode;
  goHome?: boolean;
  goPark?: boolean;
  nextDecisionId?: string;
  addTrait?: DogTraitId;
  stats?: Partial<Stats>;
}

export interface DecisionChoice {
  title: string;
  text: string;
  icon: string;
  effect: StatChange;
}

export interface Decision {
  id: string;
  title: string;
  text: string;
  dogPose: DogPose;
  emotion: string;
  location: LocationId;
  traits?: DogTraitId[];
  choices: DecisionChoice[];
}

export interface DaySummaryData {
  day: number;
  title: string;
  notes: string[];
  conditionLines: string[];
}

export type EndingId = 'responsible' | 'bestFriends' | 'chaosWeek' | 'quietCozy' | 'parkLegend';

export interface Ending {
  id: EndingId;
  title: string;
  text: string;
}
