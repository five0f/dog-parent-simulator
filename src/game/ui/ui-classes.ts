export const dialogFrameClassName = 'dialog-frame border-8';
export const choiceFrameClassName = 'choice-frame border-8';

export const playfieldControlsClassName =
  'absolute inset-x-3 bottom-3 z-30 flex flex-col items-center gap-2';

export const eventPanelClassName = `${dialogFrameClassName} mx-auto flex min-h-18 w-full max-w-112 flex-col justify-center px-4 py-2 text-center max-md:max-w-full`;
export const actionBarClassName =
  'flex w-full items-stretch justify-center gap-2 max-md:justify-start max-md:overflow-x-auto max-md:px-1 max-md:pb-1 max-md:snap-x max-md:snap-proximity';
export const choiceCardClassName = `${choiceFrameClassName} box-border flex min-h-18 w-52 shrink-0 cursor-pointer flex-col justify-center px-3 py-2 text-left text-ink hover:brightness-105 focus-visible:brightness-105 focus-visible:outline-none active:brightness-95 max-md:snap-center max-md:scroll-ml-3`;
export const choiceCardWideClassName = 'w-64 max-md:w-60';
export const menuChoiceButtonClassName = `${choiceFrameClassName} menu-button-motion box-border flex min-h-20 w-80 cursor-pointer flex-col justify-center px-5 py-3 text-left text-ink max-xs:w-full`;
export const menuSmallButtonClassName = `${choiceFrameClassName} menu-button-motion box-border grid min-h-14 min-w-40 cursor-pointer place-items-center px-4 py-2 text-center text-base font-normal text-ink`;

export const modalRootClassName =
  'absolute inset-0 z-50 m-0 size-full max-h-none max-w-none border-0 bg-transparent p-0';
export const modalBackdropClassName = 'absolute inset-0 cursor-default border-0 bg-black/60 p-0';
export const modalPanelClassName = `${dialogFrameClassName} absolute top-3 right-3 bottom-3 box-border flex w-1/2 flex-col overflow-hidden px-6 py-5 max-md:left-3 max-md:w-auto max-xs:px-4 max-xs:py-4`;
export const modalCloseClassName =
  'absolute top-0 right-0 z-10 grid size-8 cursor-pointer place-items-center rounded-full border-0 bg-transparent p-0 text-4xl leading-none font-normal text-panel-close hover:brightness-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-panel-close';
export const modalContentClassName = 'mr-9 min-h-0 flex-1 overflow-y-auto pr-3 max-xs:mr-7';

export const modalTitleClassName =
  'm-0 text-3xl leading-tight font-normal text-ink max-xs:text-2xl';
export const modalBodyTextClassName =
  'text-base leading-snug font-normal text-ink-soft max-xs:text-sm';
export const modalListClassName = 'm-0 grid list-none gap-1.5 p-0';
