import { locations } from '../data/actions';
import type { Decision, GameState } from '../types';

interface Props {
  state: GameState;
  decision: Decision;
  onDogClick: () => void;
}

const poseText: Record<string, string> = {
  door: 'сидит у двери',
  bowl: 'дежурит у миски',
  beg: 'строит голодные глаза',
  idle: 'ищет, чем заняться',
  toy: 'несёт игрушку',
  mess: 'прячет следы хаоса',
  window: 'смотрит во двор',
  vet: 'держится храбро',
  alert: 'слушает ночь',
  sleep: 'дремлет рядом',
  walk: 'идёт по дорожке',
  sniff: 'роется в кустах',
  listen: 'смотрит на вас',
  treat: 'ждёт сделку',
  meet: 'замер перед знакомством',
  friend: 'виляет новому другу',
  close: 'держится ближе',
  hunt: 'следит за голубями',
  run: 'летит вперёд',
  stick: 'несёт палку',
  play: 'играет',
  stubborn: 'сел и спорит',
  carry: 'обиженно едет на руках',
  scared: 'прижал уши',
  training: 'учит команду',
  watch: 'наблюдает',
  jump: 'прыгает от радости',
  contest: 'выступает',
  mud: 'гордо грязный',
  shop: 'выбирает добычу',
};

const poseEmotion: Record<string, string> = {
  door: '🚪',
  bowl: '🍖',
  beg: '🥺',
  idle: '🤔',
  toy: '🎾',
  mess: '😶',
  window: '🌙',
  vet: '😟',
  alert: '😨',
  sleep: '😴',
  walk: '😄',
  sniff: '🤔',
  listen: '💭',
  treat: '🍖',
  meet: '👀',
  friend: '💛',
  close: '🤝',
  hunt: '🐦',
  run: '😄',
  stick: '🪵',
  play: '🎾',
  stubborn: '😤',
  carry: '😑',
  scared: '😨',
  training: '✨',
  watch: '👀',
  jump: '😄',
  contest: '🏅',
  mud: '💦',
  shop: '🧸',
};

export default function Scene({ state, decision, onDogClick }: Props) {
  const location = locations[decision.location];
  const pose = state.scenePose || decision.scenePose;
  const isWalk = state.mode === 'walk';

  return (
    <section className={`scene scene-${decision.location} pose-${pose} ${isWalk ? 'walking-scene' : ''}`}>
      <div className="scene-sky">
        <span className="sun" />
        <span className="cloud cloud-a" />
        <span className="cloud cloud-b" />
      </div>

      <div className="ambient-light" />

      <div className="scene-title">
        <strong>{decision.title}</strong>
        <span>{location.description}</span>
      </div>

      {isWalk && (
        <div className="walk-road">
          <span />
          <span />
          <span />
        </div>
      )}

      <div className="iso-room">
        <span className="wall wall-left" />
        <span className="wall wall-back" />
        <span className="floor-tile tile-a" />
        <span className="floor-tile tile-b" />
        <span className="floor-tile tile-c" />
      </div>

      <div className="scene-props">
        <span className="furniture bed" />
        <span className="furniture shelf" />
        <span className="furniture cabinet" />
        <span className="furniture table" />
        <span className="furniture mat" />
        <span className="furniture bowl" />
        <span className="furniture leash" />
        <span className="furniture plant plant-a" />
        <span className="furniture plant plant-b" />
        <span className="furniture toy-ball" />
        <span className="park-detail tree tree-a" />
        <span className="park-detail tree tree-b" />
        <span className="park-detail bench" />
        <span className="park-detail bush bush-a" />
        <span className="park-detail pigeon pigeon-a" />
        <span className="park-detail pigeon pigeon-b" />
        <span className="event-item">{pose === 'stick' ? '🪵' : pose === 'mud' ? '💦' : pose === 'shop' ? '🧸' : pose === 'vet' ? '🩺' : ''}</span>
      </div>

      <div className="ground">
        <div className={`person ${pose === 'carry' ? 'carry' : ''}`}>
          <span className="head" />
          <span className="body" />
          <span className="leg left" />
          <span className="leg right" />
        </div>

        <button
          className={`dog dog-${pose} ${state.stats.trust > 70 ? 'trusting' : ''} ${state.stats.mood > 70 ? 'happy' : ''}`}
          onClick={onDogClick}
          aria-label={`Бублик ${poseText[pose] ?? ''}. Открыть действия`}
        >
          <span className="emotion-bubble">{poseEmotion[pose] ?? '💭'}</span>
          <span className="tail" />
          <span className="dog-body" />
          <span className="ear" />
          <span className="dog-head" />
          <span className="paw paw-a" />
          <span className="paw paw-b" />
          {['stick', 'sniff', 'mud', 'treat'].includes(pose) && <span className="dog-item" />}
        </button>
      </div>

      <div className="dog-thought">
        <b>Бублик</b>
        <span>{poseText[pose] ?? 'живёт свою собачью жизнь'}</span>
      </div>
    </section>
  );
}
