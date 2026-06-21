import { cn } from '../../lib/class-names';
import { dogImages, locationBackgrounds, sceneObjectImages, uiAssets } from '../assets';
import type { DogPose, LocationId, SceneObjectId } from '../types';

const sceneObjectClasses: Record<SceneObjectId, string> = {
  bread: 'scene-object-bread',
  pigeonFly: 'scene-object-pigeon-fly',
  pigeonIdle: 'scene-object-pigeon-idle',
  pigeonPeck: 'scene-object-pigeon-peck',
  stick: 'scene-object-stick',
  tennisBall: 'scene-object-tennis-ball',
  trashBag: 'scene-object-trash-bag',
};

function getHumanClassName(location: LocationId) {
  return cn(
    'scene-character scene-human',
    location === 'park' ? 'scene-human-park' : 'scene-human-home'
  );
}

function getDogClassName(location: LocationId, pose: DogPose) {
  if (location === 'park') return 'scene-character scene-dog scene-dog-park';
  if (pose === 'sleep') return 'scene-character scene-dog scene-dog-home-sleep';

  const activePoses: DogPose[] = ['happy', 'leashPull', 'sniff', 'sock', 'stressed'];
  return cn(
    'scene-character scene-dog',
    activePoses.includes(pose) ? 'scene-dog-home-active' : 'scene-dog-home-default'
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
      <img className='scene-background' src={background} alt='' aria-hidden='true' />

      <section className='scene-layer' aria-label={location === 'park' ? 'Парк' : 'Дом'}>
        <img className={getHumanClassName(location)} src={humanImage} alt='Хозяин' />
        {sceneObjects.map(objectId => (
          <img
            className={cn('scene-object', sceneObjectClasses[objectId])}
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
