import { type CSSProperties, useState } from 'react';

import { cn } from '../../lib/class-names';
import { locationBackgrounds } from '../assets';
import {
  type GameSavePreview,
  type GameSettings,
  loadGameSettings,
  saveGameSettings,
} from '../storage';
import {
  dialogFrameClassName,
  menuChoiceButtonClassName,
  menuSmallButtonClassName,
} from './ui-classes';

const menuBackgroundStyle: CSSProperties = {
  backgroundImage: `radial-gradient(circle at 50% 42%, rgb(0 0 0 / 0.12), rgb(0 0 0 / 0.58)), linear-gradient(rgb(0 0 0 / 0.45), rgb(0 0 0 / 0.45)), url(${locationBackgrounds.home_morning})`,
};

export function StartMenu({
  isLeaving,
  onCancelNewGame,
  onConfirmNewGame,
  onContinue,
  onNewGame,
  savePreview,
  showNewGameConfirm,
}: {
  isLeaving: boolean;
  onCancelNewGame: () => void;
  onConfirmNewGame: () => void;
  onContinue: () => void;
  onNewGame: () => void;
  savePreview: GameSavePreview | null;
  showNewGameConfirm: boolean;
}) {
  const [settings, setSettings] = useState(loadGameSettings);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const updateSettings = (nextSettings: GameSettings) => {
    setSettings(nextSettings);
    saveGameSettings(nextSettings);
  };

  return (
    <section
      className={cn(
        'absolute inset-0 z-40 grid place-items-center bg-cover bg-center px-3 text-ui-text start-menu-screen',
        isLeaving && 'pointer-events-none opacity-0'
      )}
      aria-label='Главное меню'
      style={menuBackgroundStyle}
    >
      <div className='grid w-full max-w-132 justify-items-center gap-7 text-center hud-text-shadow max-xs:gap-5'>
        <div className='grid gap-3'>
          <h1 className='m-0 text-7xl leading-none font-normal max-md:text-6xl max-xs:text-5xl'>
            Бублик
          </h1>
          <p className='m-0 max-w-md text-2xl/tight font-normal text-ui-text max-md:text-xl'>
            История одного уставшего хозяина и очень занятого корги
          </p>
        </div>

        <nav className='grid gap-3' aria-label='Старт игры'>
          <StartMenuButton
            label='Новая игра'
            description={savePreview ? 'Начать сначала' : 'Первое утро Бублика'}
            onClick={onNewGame}
          />
          <StartMenuButton
            disabled={!savePreview}
            label='Продолжить'
            description={
              savePreview
                ? `День ${String(savePreview.day)} • ${savePreview.timeLabel}`
                : 'Нет сохранения'
            }
            onClick={onContinue}
          />
          <StartMenuButton
            label='Настройки'
            description='Музыка и звуки'
            onClick={() => {
              setSettingsOpen(true);
            }}
          />
        </nav>
      </div>

      {showNewGameConfirm && (
        <MenuDialog title='Начать новую игру?'>
          <p className='m-0 text-lg/tight text-ink-soft'>Текущее сохранение будет удалено.</p>
          <div className='mt-5 flex flex-wrap justify-center gap-3'>
            <button className={menuSmallButtonClassName} type='button' onClick={onConfirmNewGame}>
              Начать заново
            </button>
            <button className={menuSmallButtonClassName} type='button' onClick={onCancelNewGame}>
              Отмена
            </button>
          </div>
        </MenuDialog>
      )}

      {settingsOpen && (
        <MenuDialog title='Настройки'>
          <div className='grid gap-3'>
            <button
              className={menuSmallButtonClassName}
              type='button'
              onClick={() => {
                updateSettings({ ...settings, music: !settings.music });
              }}
            >
              Музыка: {settings.music ? 'вкл' : 'выкл'}
            </button>
            <button
              className={menuSmallButtonClassName}
              type='button'
              onClick={() => {
                updateSettings({ ...settings, sounds: !settings.sounds });
              }}
            >
              Звуки: {settings.sounds ? 'вкл' : 'выкл'}
            </button>
            <button
              className={menuSmallButtonClassName}
              type='button'
              onClick={() => {
                setSettingsOpen(false);
              }}
            >
              Закрыть
            </button>
          </div>
        </MenuDialog>
      )}
    </section>
  );
}

function StartMenuButton({
  description,
  disabled = false,
  label,
  onClick,
}: {
  description: string;
  disabled?: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      className={menuChoiceButtonClassName}
      disabled={disabled}
      type='button'
      onClick={onClick}
    >
      <span className='text-2xl/tight font-bold text-ink'>{label}</span>
      <span className='mt-1 text-base/tight font-normal text-description'>{description}</span>
    </button>
  );
}

function MenuDialog({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <div className='absolute inset-0 z-10 grid place-items-center bg-black/35 px-3'>
      <section className={`${dialogFrameClassName} w-full max-w-md px-6 py-5 text-center text-ink`}>
        <h2 className='m-0 text-3xl/tight font-normal'>{title}</h2>
        <div className='mt-4'>{children}</div>
      </section>
    </div>
  );
}
