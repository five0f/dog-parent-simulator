export const locationIds = ['home_morning', 'park', 'home_after_walk'] as const;
export const dogPoses = [
  'idle',
  'sit',
  'sleep',
  'happy',
  'stressed',
  'sock',
  'leashPull',
  'sniff',
] as const;
export const sceneObjectIds = [
  'pigeonIdle',
  'pigeonPeck',
  'pigeonFly',
  'bread',
  'stick',
  'tennisBall',
  'trashBag',
] as const;
export const choiceVariants = ['positive', 'neutral', 'negative'] as const;
export const gamePhases = ['event', 'result', 'daySummary'] as const;

export type LocationId = (typeof locationIds)[number];
export type DogPose = (typeof dogPoses)[number];
export type SceneObjectId = (typeof sceneObjectIds)[number];
export type ChoiceVariant = (typeof choiceVariants)[number];
export type DogStatId = 'trust' | 'energy' | 'hunger' | 'stress' | 'walkNeed' | 'playNeed';
export type DogSkillId = 'sit' | 'heel' | 'fetch' | 'place';
export type DogTraitId =
  | 'confidence'
  | 'impulsivity'
  | 'resourceGuarding'
  | 'toiletHabit'
  | 'leashBehavior'
  | 'attachment';
export type DayGoalId = 'calmMorning' | 'keepTrust' | 'homeSafe' | 'noNewFear';
export type GoalStatus = 'in_progress' | 'done' | 'failed' | 'at_risk';
export type GamePhase = (typeof gamePhases)[number];

export type StoryText = string | ((state: GameState) => string);

export type DogStats = Record<DogStatId, number>;
export type DogSkills = Record<DogSkillId, number>;
export type DogTraits = Record<DogTraitId, number>;

export interface DecisionMemory {
  praisedSock: number;
  ignoredSock: number;
  tookResourceByForce: number;
  chasedPigeons: number;
  redirectedPigeons: number;
  pulledLeash: number;
  ateTrash: number;
  redirectedTrash: number;
  punishedDog: number;
  calmChoices: number;
}

export interface DogTraitBadge {
  id: string;
  title: string;
  description: string;
  level: number;
  unlocked: boolean;
}

export interface MeterState {
  id: DogStatId;
  title: string;
  value: number;
}

export interface SkillState {
  id: DogSkillId;
  title: string;
  value: number;
}

export interface DayGoal {
  id: DayGoalId;
  label: string;
  status: GoalStatus;
  reason: string;
  completed: boolean;
}

export interface ChoiceEffect {
  stats?: Partial<Record<DogStatId, number>>;
  skills?: Partial<Record<DogSkillId, number>>;
  traits?: Partial<Record<DogTraitId, number>>;
  memory?: Partial<Record<keyof DecisionMemory, number>>;
  flags?: Record<string, boolean | number | string>;
  flagDeltas?: Record<string, number>;
}

export interface ChoiceOutcome {
  resultText: string;
  storyChanges?: string[];
  effects: ChoiceEffect;
  journal: string;
  dogPose?: DogPose;
  sceneObjects?: SceneObjectId[];
  nextEventId?: string;
  nextLocation?: LocationId;
  completeDay?: boolean;
}

export interface EventChoice {
  id: string;
  label: string;
  variant: ChoiceVariant;
  outcome: ChoiceOutcome | ((state: GameState) => ChoiceOutcome);
}

export interface StoryEvent {
  id: string;
  location: LocationId;
  title: StoryText;
  description: StoryText;
  dogPose?: DogPose;
  sceneObjects?: SceneObjectId[];
  choices: EventChoice[];
}

export interface ResolvedStoryEvent extends Omit<
  StoryEvent,
  'title' | 'description' | 'dogPose' | 'sceneObjects'
> {
  title: string;
  description: string;
  dogPose: DogPose;
  sceneObjects: SceneObjectId[];
}

export interface PendingResult {
  choiceId: string;
  variant: ChoiceVariant;
  resultText: string;
  storyChanges: string[];
  dogPose: DogPose;
  sceneObjects: SceneObjectId[];
  nextEventId: string;
  nextLocation: LocationId;
  completeDay: boolean;
}

export interface GameState {
  day: number;
  timeLabel: string;
  location: LocationId;
  phase: GamePhase;
  stats: DogStats;
  skills: DogSkills;
  traits: DogTraits;
  decisionMemory: DecisionMemory;
  personalityTraits: DogTraitBadge[];
  currentEventId: string;
  completedEventIds: string[];
  journal: string[];
  goals: DayGoal[];
  flags: Record<string, boolean | number | string>;
  pendingResult: PendingResult | null;
  dayStartSkills: DogSkills;
  dayStartTraitIds: string[];
}

export interface DaySummary {
  title: string;
  storyLines: string[];
  reinforcedLines: string[];
  newTraits: DogTraitBadge[];
  goalSummaries: {
    label: string;
    status: GoalStatus;
    explanation: string;
  }[];
  skillChanges: string[];
  journal: string[];
}
