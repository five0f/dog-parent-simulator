const closeButtonClassName =
  'mt-5.5 min-h-15.5 min-w-52.5 cursor-pointer border-18 border-transparent bg-transparent px-5 py-2.5 text-[22px] font-normal text-ink hover:brightness-[1.06] focus-visible:brightness-[1.06] focus-visible:outline-none active:brightness-[0.98] [border-image-repeat:stretch] [border-image-slice:34_fill] [border-image-source:var(--choice-card)] [border-image-width:18px] max-[520px]:min-h-13 max-[520px]:min-w-44 max-[520px]:text-xl';

export function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <button className={closeButtonClassName} type='button' onClick={onClick}>
      Закрыть
    </button>
  );
}
