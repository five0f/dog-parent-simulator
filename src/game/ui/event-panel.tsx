export function EventPanel({
  ariaLabel,
  subtitle,
  title,
}: {
  ariaLabel: string;
  subtitle?: string | string[];
  title: string;
}) {
  return (
    <section
      className='absolute bottom-45 left-1/2 z-30 box-border flex h-25 w-125 -translate-x-1/2 flex-col justify-center border-0 bg-transparent bg-(image:--dialog-panel) bg-size-[100%_100%] bg-center bg-no-repeat px-8.5 py-4 text-center max-[1200px]:bottom-70 max-[900px]:bottom-41 max-[900px]:h-28 max-[900px]:w-[calc(100vw-32px)] max-[900px]:px-6 max-[900px]:py-4.5 max-[520px]:bottom-37.5'
      aria-label={ariaLabel}
    >
      <h1 className='m-0 text-2xl leading-[1.05] font-bold text-[#2a1d14] max-[900px]:text-xl'>
        {title}
      </h1>
      {Array.isArray(subtitle) && (
        <ul className='mx-auto mt-2 grid max-w-108 list-disc gap-0.5 pl-6 text-left text-lg leading-[1.05] font-normal text-[#2a1d14] max-[900px]:text-base'>
          {subtitle.map((line, index) => (
            <li key={`${line}-${String(index)}`}>{line}</li>
          ))}
        </ul>
      )}
      {typeof subtitle === 'string' && (
        <p className='m-0 mt-3.5 text-xl leading-[1.05] font-normal text-[#2a1d14] max-[900px]:mt-2 max-[900px]:text-base'>
          {subtitle}
        </p>
      )}
    </section>
  );
}
