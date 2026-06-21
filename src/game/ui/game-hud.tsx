import { uiAssets } from '../assets';
import { TrustHearts } from './trust-hearts';

const topMenuButtonClassName =
  'relative grid size-24 cursor-pointer place-items-center border-0 bg-transparent p-0 text-sm font-normal text-panel-close hover:brightness-105 focus-visible:brightness-105 focus-visible:outline-none active:brightness-95 max-md:size-20 max-xs:size-16 max-xs:text-xs';

function TopMenuButton({
  icon,
  label,
  onClick,
}: {
  icon: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <button className={topMenuButtonClassName} type='button' onClick={onClick}>
      <img className='absolute inset-0 size-full object-fill' src={uiAssets.buttonPanel} alt='' />
      <span className='relative grid place-items-center gap-1 max-xs:gap-0.5'>
        <img
          className='size-9 object-contain max-md:size-8 max-xs:size-6'
          src={icon}
          alt=''
          aria-hidden='true'
        />
        <span>{label}</span>
      </span>
    </button>
  );
}

export function GameHud({
  day,
  displayTimeLabel,
  onOpenDayPanel,
  onOpenDogPanel,
  trust,
}: {
  day: number;
  displayTimeLabel: string;
  onOpenDayPanel: () => void;
  onOpenDogPanel: () => void;
  trust: number;
}) {
  const isNight = displayTimeLabel === 'Вечер' || displayTimeLabel === 'Ночь';

  return (
    <div className='pointer-events-none absolute inset-x-3 top-3 z-30 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-start gap-2 max-md:grid-cols-[minmax(0,1fr)_auto]'>
      <header
        className='flex max-w-72 items-start gap-2 max-md:max-w-56 max-xs:max-w-44'
        aria-label='Бублик'
      >
        <img
          className='size-28 -scale-x-100 object-contain max-md:size-16 max-xs:size-12'
          src={uiAssets.dogAvatar}
          alt='Бублик'
        />
        <div className='grid min-w-0 gap-2 max-xs:gap-1'>
          <div className='truncate text-3xl leading-none font-normal text-ui-text hud-text-shadow max-md:text-2xl max-xs:text-xl'>
            Бублик
          </div>
          <TrustHearts value={trust} />
        </div>
      </header>

      <div
        className='flex w-fit items-center gap-2 justify-self-center text-3xl leading-none font-normal whitespace-nowrap text-ui-text hud-text-shadow max-md:col-span-2 max-md:row-start-2 max-md:mt-2 max-md:text-2xl max-xs:text-xl'
        aria-label={`День ${String(day)}, ${displayTimeLabel}`}
      >
        <span>
          День {day} • {displayTimeLabel}
        </span>
        <img
          className='size-7 object-contain max-md:size-6 max-xs:size-5'
          src={isNight ? uiAssets.iconMoon : uiAssets.iconSun}
          alt=''
          aria-hidden='true'
        />
      </div>

      <nav
        className='pointer-events-auto flex gap-2 justify-self-end max-md:col-start-2 max-md:row-start-1 max-xs:gap-1.5'
        aria-label='Меню'
      >
        <TopMenuButton icon={uiAssets.iconDay} label='День' onClick={onOpenDayPanel} />
        <TopMenuButton icon={uiAssets.iconDog} label='Бублик' onClick={onOpenDogPanel} />
      </nav>
    </div>
  );
}
