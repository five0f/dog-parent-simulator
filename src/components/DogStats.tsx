import Icon, { type IconName } from './Icon';
import ProgressBar from './ProgressBar';

export interface DogStatItem {
  icon: IconName;
  title: string;
  stateText: string;
  value: number;
}

interface DogStatsProps {
  items: DogStatItem[];
}

export default function DogStats({ items }: DogStatsProps) {
  return (
    <div className="dog-stats">
      {items.map((item) => (
        <div className="dog-stats__row" key={item.title}>
          <Icon name={item.icon} size={23} />
          <div className="dog-stats__copy">
            <b>{item.title}</b>
            <strong>{item.stateText}</strong>
          </div>
          <div className="dog-stats__meter">
            <ProgressBar value={item.value} />
            <span>{item.value}/100</span>
          </div>
        </div>
      ))}
    </div>
  );
}
