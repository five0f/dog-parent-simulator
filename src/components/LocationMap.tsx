import { locations } from '../data/actions';
import type { GameState, LocationId } from '../types';

interface Props {
  state: GameState;
}

const route: LocationId[] = ['home', 'yard', 'park', 'shop', 'vet', 'grooming'];

export default function LocationMap({ state }: Props) {
  return (
    <nav className="location-map" aria-label="Мир Бублика">
      {route.map((location) => (
        <div key={location} className={state.location === location ? 'active' : ''}>
          <span>{locations[location].emoji}</span>
          <b>{locations[location].button}</b>
        </div>
      ))}
    </nav>
  );
}
