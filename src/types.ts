export type LocationId = 'home' | 'park';

export type TimeOfDay = 'Утро' | 'День' | 'Вечер';

export type GameMode = 'home' | 'walk';

export type GamePhase = 'intro' | 'event' | 'result';

export type DogPose = 'idle' | 'sit' | 'sleep';

export type DogTraitId = 'curious' | 'stubborn' | 'timid' | 'brave' | 'vacuum' | 'friendly' | 'calm' | 'anxious' | 'independent';

export type StatKey = 'mood' | 'trust' | 'health';

export type Stats = Record<StatKey, number>;

export type DogProblemId = 'doesnt_hold_walk' | 'pulls_leash' | 'picks_food' | 'fear_dogs' | 'fear_noises' | 'sock_thief' | 'separation_anxiety';

export type DogHabitId = 'holds_until_walk' | 'calm_leash' | 'ignores_ground_food' | 'comes_when_called' | 'calm_dogs' | 'stays_home_alone';

export type DogAchievementId = 'first_calm_dog_intro' | 'first_ignored_food' | 'first_quiet_day' | 'learned_hold_walk' | 'brave_with_noise' | 'stick_memory';

export type DevelopmentTrack = 'walkIgnored' | 'walkSuccess' | 'foodAllowed' | 'foodRedirected' | 'dogGoodSocial' | 'dogBadSocial' | 'sockChase' | 'recallSuccess' | 'calmWalking';

export type StoryFlag = 'walk_refused' | 'stick_taken' | 'praised_bublik';

export type EventMoodTag = 'lowMood' | 'warm' | 'tired' | 'curious';

export interface DogTrait {
  id: DogTraitId;
  title: string;
  description: string;
}

export interface GameState {
  phase: GamePhase;
  introStep: number;
  day: number;
  timeIndex: number;
  location: LocationId;
  mode: GameMode;
  currentDecisionId: string;
  lastResult: string | null;
  dogPose: DogPose;
  emotion: string;
  stats: Stats;
  traits: DogTraitId[];
  development: DogDevelopment;
  storyFlags: StoryFlag[];
  lastChoiceId: string | null;
  memories: string[];
  dayNotes: string[];
  daySummary: DaySummaryData | null;
  ending: EndingId | null;
  pendingConsequence: PendingConsequence | null;
}

export interface DogDevelopment {
  habits: DogHabitId[];
  problems: DogProblemId[];
  achievements: DogAchievementId[];
  journal: DevelopmentEntry[];
  tracks: Partial<Record<DevelopmentTrack, number>>;
}

export interface DevelopmentEntry {
  day: number;
  type: 'problem' | 'habit' | 'trait' | 'achievement' | 'recovery';
  title: string;
  text: string;
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
  addFlag?: StoryFlag;
  clearFlag?: StoryFlag;
  addTrait?: DogTraitId;
  development?: DevelopmentEffect;
  stats?: Partial<Stats>;
}

export interface DevelopmentEffect {
  progress?: Partial<Record<DevelopmentTrack, number>>;
  addProblem?: DogProblemId;
  removeProblem?: DogProblemId;
  addHabit?: DogHabitId;
  addAchievement?: DogAchievementId;
}

export interface ChoiceResult {
  bublik: string;
  situation: string;
  mood?: string;
  trust?: string;
  thought?: string;
  note?: string;
}

export interface DecisionChoice {
  title: string;
  text: string;
  icon: string;
  resultText?: string;
  result?: ChoiceResult;
  effect: StatChange;
}

export interface PendingConsequence {
  choiceTitle: string;
  resultText: string;
  result: ChoiceResult;
  stats: Partial<Stats>;
  transition: StatChange;
}

export interface Decision {
  id: string;
  title: string;
  text: string;
  dogPose: DogPose;
  emotion: string;
  location: LocationId;
  traits?: DogTraitId[];
  timeOfDay?: TimeOfDay[];
  requiredFlag?: StoryFlag;
  moodTags?: EventMoodTag[];
  problems?: DogProblemId[];
  habits?: DogHabitId[];
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
