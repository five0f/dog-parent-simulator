import { eventPanelClassName } from './ui-classes';

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
      className={eventPanelClassName}
      aria-label={ariaLabel}
      title={typeof subtitle === 'string' ? `${title}. ${subtitle}` : title}
    >
      <h1 className='m-0 text-lg/tight font-bold text-panel-close'>{title}</h1>
      {Array.isArray(subtitle) && (
        <ul className='mx-auto mt-1 grid max-w-sm list-disc gap-0.5 pl-5 text-left text-sm/tight font-normal text-panel-close'>
          {subtitle.map((line, index) => (
            <li key={`${line}-${String(index)}`}>{line}</li>
          ))}
        </ul>
      )}
      {typeof subtitle === 'string' && (
        <p className='m-0 mt-1 text-sm/tight font-normal text-panel-close'>{subtitle}</p>
      )}
    </section>
  );
}
