import { cn } from '../../lib/class-names';
import { dogImages, locationBackgrounds, sceneObjectImages, uiAssets } from '../assets';
import type { DogPose, LocationId, SceneObjectId } from '../types';

const sceneObjectClasses: Record<SceneObjectId, string> = {
  bread:
    'bottom-[34%] left-[72%] w-[clamp(44px,4vw,78px)] max-[900px]:bottom-[34%] max-[900px]:left-[77%]',
  pigeonFly:
    'bottom-[39%] left-[74%] w-[clamp(84px,7.6vw,144px)] max-[900px]:bottom-[36%] max-[900px]:left-[79%]',
  pigeonIdle:
    'bottom-[36%] left-[74%] w-[clamp(80px,7vw,132px)] max-[900px]:bottom-[36%] max-[900px]:left-[79%]',
  pigeonPeck:
    'bottom-[36%] left-[74%] w-[clamp(80px,7vw,132px)] max-[900px]:bottom-[36%] max-[900px]:left-[79%]',
  stick:
    'bottom-[28%] left-[72%] w-[clamp(128px,10vw,190px)] max-[900px]:bottom-[29%] max-[900px]:left-[77%]',
  tennisBall:
    'bottom-[28%] left-[70%] w-[clamp(58px,5vw,92px)] max-[900px]:bottom-[29%] max-[900px]:left-[76%]',
  trashBag:
    'bottom-[28%] left-[74%] w-[clamp(100px,8vw,156px)] max-[900px]:bottom-[29%] max-[900px]:left-[79%]',
};

function getHumanClassName(location: LocationId) {
  return cn(
    'absolute z-12 block -translate-x-1/2 object-contain select-none',
    location === 'park'
      ? 'bottom-[16%] left-[35%] h-[63%] max-[900px]:bottom-[34%] max-[900px]:left-[39%] max-[900px]:h-[42%] max-[520px]:bottom-[38%] max-[520px]:left-[38%] max-[520px]:h-[36%]'
      : 'bottom-[20%] left-[36%] h-[65%] max-[1200px]:left-[34%] max-[900px]:bottom-[35%] max-[900px]:left-[39%] max-[900px]:h-[42%] max-[520px]:bottom-[38%] max-[520px]:left-[38%] max-[520px]:h-[36%]'
  );
}

function getDogClassName(location: LocationId, pose: DogPose) {
  const homePoseClass =
    pose === 'sleep'
      ? 'bottom-[36%] h-[22%]'
      : ['happy', 'leashPull', 'sniff', 'sock', 'stressed'].includes(pose)
        ? 'bottom-[37%] h-[25.3%]'
        : 'bottom-[37%] h-[24.2%]';

  return cn(
    'absolute z-14 block -translate-x-1/2 object-contain select-none',
    location === 'park'
      ? 'bottom-[34%] left-1/2 h-[24%] max-[900px]:bottom-[36%] max-[900px]:left-[61%] max-[900px]:h-[16%]'
      : cn(
          'left-[49%] max-[900px]:bottom-[37%] max-[900px]:left-[62%] max-[900px]:h-[16%]',
          homePoseClass
        ),
    'max-[520px]:bottom-[40%] max-[520px]:left-[63%] max-[520px]:h-[14%]'
  );
}

export function GameScene({
  dogPose,
  location,
  sceneObjects,
}: {
  dogPose: DogPose;
  location: LocationId;
  sceneObjects: SceneObjectId[];
}) {
  const background = locationBackgrounds[location];
  const humanImage = location === 'park' ? uiAssets.humanParkIdle : uiAssets.humanIdle;

  return (
    <>
      <img
        className='absolute inset-0 size-full object-cover'
        src={background}
        alt=''
        aria-hidden='true'
      />

      <section
        className='pointer-events-none absolute inset-0 z-10'
        aria-label={location === 'park' ? 'Парк' : 'Дом'}
      >
        <img className={getHumanClassName(location)} src={humanImage} alt='Хозяин' />
        {sceneObjects.map(objectId => (
          <img
            className={cn(
              'absolute z-13 block object-contain drop-shadow-[0_10px_12px_rgba(21,16,12,0.25)] select-none',
              sceneObjectClasses[objectId]
            )}
            src={sceneObjectImages[objectId]}
            alt=''
            aria-hidden='true'
            key={objectId}
          />
        ))}
        <img className={getDogClassName(location, dogPose)} src={dogImages[dogPose]} alt='Бублик' />
      </section>
    </>
  );
}
