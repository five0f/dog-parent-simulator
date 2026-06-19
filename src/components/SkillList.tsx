import ProgressBar from './ProgressBar';

export interface SkillListItem {
  title: string;
  value: number;
}

interface SkillListProps {
  items: SkillListItem[];
}

export default function SkillList({ items }: SkillListProps) {
  return (
    <div className="skill-list">
      {items.map((item) => (
        <div className="skill-list__row" key={item.title}>
          <b>{item.title}</b>
          <ProgressBar value={item.value} tone="good" />
          <span>{item.value}/100</span>
        </div>
      ))}
    </div>
  );
}
