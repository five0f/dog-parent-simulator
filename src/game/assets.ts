import homeBackground from '../assets/backgrounds/home.png';
import parkBackground from '../assets/backgrounds/park.png';
import dogHappy from '../assets/dog/dog-happy.png';
import dogIdle from '../assets/dog/dog-idle.png';
import dogLeashPull from '../assets/dog/dog-leash-pull.png';
import dogSit from '../assets/dog/dog-sit.png';
import dogSleep from '../assets/dog/dog-sleep.png';
import dogSniff from '../assets/dog/dog-sniff.png';
import dogSock from '../assets/dog/dog-sock.png';
import dogStressed from '../assets/dog/dog-stressed.png';
import humanIdle from '../assets/human/human-idle.png';
import humanParkIdle from '../assets/human/human-idle-park.png';
import breadAsset from '../assets/park/bread.png';
import pigeonFlyAsset from '../assets/park/pigeon-fly.png';
import pigeonIdleAsset from '../assets/park/pigeon-idle.png';
import pigeonPeckAsset from '../assets/park/pigeon-peck.png';
import stickAsset from '../assets/park/stick.png';
import tennisBallAsset from '../assets/park/tennis-ball.png';
import trashBagAsset from '../assets/park/trash-bag.png';
import dogAvatar from '../assets/ui/avatars/dog-avatar.png';
import buttonPanel from '../assets/ui/cards/button.png';
import choiceCard from '../assets/ui/cards/choice-card.png';
import dialogPanel from '../assets/ui/cards/dialog-panel.png';
import heartEmpty from '../assets/ui/icons/heart-empty.png';
import heartFull from '../assets/ui/icons/heart-full.png';
import iconDay from '../assets/ui/icons/icon-day.png';
import iconDog from '../assets/ui/icons/icon-dog.png';
import iconMoon from '../assets/ui/icons/icon-moon.png';
import iconSun from '../assets/ui/icons/icon-sun.png';
import type { DogPose, LocationId, SceneObjectId } from './types';

export const dogImages: Record<DogPose, string> = {
  happy: dogHappy,
  idle: dogIdle,
  leashPull: dogLeashPull,
  sit: dogSit,
  sleep: dogSleep,
  sniff: dogSniff,
  sock: dogSock,
  stressed: dogStressed,
};

export const locationBackgrounds: Record<LocationId, string> = {
  home_after_walk: homeBackground,
  home_morning: homeBackground,
  park: parkBackground,
};

export const sceneObjectImages: Record<SceneObjectId, string> = {
  bread: breadAsset,
  pigeonFly: pigeonFlyAsset,
  pigeonIdle: pigeonIdleAsset,
  pigeonPeck: pigeonPeckAsset,
  stick: stickAsset,
  tennisBall: tennisBallAsset,
  trashBag: trashBagAsset,
};

export const uiAssets = {
  buttonPanel,
  choiceCard,
  dialogPanel,
  dogAvatar,
  heartEmpty,
  heartFull,
  humanIdle,
  humanParkIdle,
  iconDay,
  iconDog,
  iconMoon,
  iconSun,
};
