import { uiAssets } from '../assets';
import { TrustHearts } from './trust-hearts';

const topMenuButtonClassName =
  'flex size-25 cursor-pointer flex-col items-center justify-center gap-0.75 border-0 bg-transparent bg-(image:--top-button) bg-size-[100%_100%] bg-center bg-no-repeat px-3 pt-4.25 pb-2.75 text-[16px] font-normal text-[#2b1b12] hover:brightness-[1.06] focus-visible:brightness-[1.06] focus-visible:outline-none active:brightness-[0.98] max-[900px]:size-20.5 max-[900px]:gap-1 max-[900px]:px-2 max-[900px]:pt-2.5 max-[900px]:pb-2 max-[900px]:text-[15px] max-[520px]:size-17 max-[520px]:px-1.5 max-[520px]:pt-2 max-[520px]:pb-1.5 max-[520px]:text-[13px]';

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
      <img
        className='size-9.5 object-contain max-[900px]:size-8.5 max-[520px]:size-7'
        src={icon}
        alt=''
        aria-hidden='true'
      />
      <span>{label}</span>
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
    <>
      <header
        className='absolute top-3.75 left-3.75 z-30 flex w-117.5 max-w-117.5 items-start gap-2 max-[900px]:top-4 max-[900px]:left-4 max-[900px]:w-auto max-[900px]:max-w-[calc(100vw-220px)] max-[900px]:gap-2.5 max-[520px]:max-w-[calc(100vw-180px)]'
        aria-label='Бублик'
      >
        <img
          className='size-28 -translate-y-3.5 -scale-x-100 object-contain max-[900px]:size-12 max-[520px]:size-11'
          src={uiAssets.dogAvatar}
          alt='Бублик'
        />
        <div className='grid min-w-0 gap-2.75 pt-3 max-[520px]:gap-1.75'>
          <div className='truncate text-[25px] leading-[0.98] font-normal text-ui-text [text-shadow:0_2px_4px_rgb(0_0_0/0.5)] max-[900px]:text-2xl max-[520px]:text-xl'>
            Бублик
          </div>
          <TrustHearts value={trust} />
        </div>
      </header>

      <div
        className='absolute top-3.75 left-1/2 z-30 flex -translate-x-1/2 items-center gap-3 text-[25px] leading-none font-normal whitespace-nowrap text-ui-text [text-shadow:0_2px_4px_rgb(0_0_0/0.45)] max-[900px]:top-24.5 max-[900px]:text-[22px] max-[520px]:gap-2 max-[520px]:text-[21px]'
        aria-label={`День ${String(day)}, ${displayTimeLabel}`}
      >
        <span>
          День {day}
          <span className='mx-2 inline-block translate-y-1.5 text-[40px] max-[520px]:mx-1.5 max-[520px]:text-[32px]'>
            •
          </span>
          {displayTimeLabel}
        </span>
        <img
          className='mt-auto size-7 translate-y-0.75 object-contain max-[900px]:size-6 max-[520px]:size-5.5'
          src={isNight ? uiAssets.iconMoon : uiAssets.iconSun}
          alt=''
          aria-hidden='true'
        />
      </div>

      <nav
        className='absolute top-4.5 right-8.25 z-30 flex gap-4 max-[900px]:top-3 max-[900px]:right-3 max-[900px]:gap-2.5 max-[520px]:gap-2'
        aria-label='Меню'
      >
        <TopMenuButton icon={uiAssets.iconDay} label='День' onClick={onOpenDayPanel} />
        <TopMenuButton icon={uiAssets.iconDog} label='Бублик' onClick={onOpenDogPanel} />
      </nav>
    </>
  );
}
