import { locations } from '../data/actions';
import type { GameState, LocationId } from '../types';

interface Props {
  state: GameState;
  onNavigate: (location: LocationId) => void;
}

const route: LocationId[] = ['home', 'park'];

export default function LocationMap({ state, onNavigate }: Props) {
  return (
    <nav className="location-map" aria-label="Локации">
      {route.map((location) => (
        <button key={location} className={state.location === location ? 'active' : ''} onClick={() => onNavigate(location)}>
          <span>{locations[location].icon}</span>
          <b>{locations[location].button}</b>
        </button>
      ))}
    </nav>
  );
}
