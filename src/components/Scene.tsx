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
}

const dogImages: Record<DogPose, string> = {
  idle: dogIdle,
  sit: dogSit,
  sleep: dogSleep,
};

export default function Scene({ state, decision }: Props) {
  const location = locations[state.location];
  const isParkScene = state.location === 'park' || state.mode === 'walk';
  const background = isParkScene ? parkBackground : homeBackground;

  return (
    <section className={`scene scene-${state.location} pose-${state.dogPose} event-${decision.id}`}>
      <img className="location-bg" src={background} alt={location.title} />

      <img className="human-sprite" src={humanIdle} alt="Хозяин" />

      <div className="dog-sprite-wrap" aria-label="Бублик">
        <span className="emotion-bubble">{state.emotion}</span>
        <img className="dog-sprite" src={dogImages[state.dogPose]} alt="Бублик" />
      </div>

      {decision.id === 'home-door' && (
        <div className="door-cues" aria-hidden="true">
          <span>🦮</span>
          <span>👟</span>
        </div>
      )}
    </section>
  );
}
