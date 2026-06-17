import dogCurious from '../assets/dog/dog-curious.png';
import dogHappy from '../assets/dog/dog-happy.png';
import dogIdle from '../assets/dog/dog-idle.png';
import dogSit from '../assets/dog/dog-sit.png';
import dogSleep from '../assets/dog/dog-sleep.png';
import humanIdle from '../assets/human/human-idle.png';
import homeBackground from '../assets/locations/home.png';
import parkBackground from '../assets/locations/park.png';
import { locations } from '../data/actions';
import type { Decision, DogPose, GameState } from '../types';

interface Props {
  state: GameState;
  decision: Decision;
  onDogClick: () => void;
}

const dogImages: Record<DogPose, string> = {
  idle: dogIdle,
  sit: dogSit,
  sleep: dogSleep,
  curious: dogCurious,
  happy: dogHappy,
};

export default function Scene({ state, decision, onDogClick }: Props) {
  const location = locations[state.location];
  const isParkScene = state.location === 'park' || state.mode === 'walk';
  const background = isParkScene ? parkBackground : homeBackground;

  return (
    <section className={`scene scene-${state.location} pose-${state.dogPose} event-${decision.id}`}>
      <img className="location-bg" src={background} alt={location.title} />

      <img className="human-sprite" src={humanIdle} alt="Хозяин" />

      <button className="dog-sprite-button" onClick={onDogClick} aria-label="Открыть действия с Бубликом">
        <span className="emotion-bubble">{state.emotion}</span>
        <span className="event-bubble">
          <b>{decision.title}</b>
          <small>{decision.text}</small>
        </span>
        <img className="dog-sprite" src={dogImages[state.dogPose]} alt="Бублик" />
      </button>

      {decision.id === 'home-door' && (
        <div className="door-cues" aria-hidden="true">
          <span>🦮</span>
          <span>👟</span>
        </div>
      )}
    </section>
  );
}
