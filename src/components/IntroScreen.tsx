interface Props {
  step: number;
  onNext: () => void;
}

const introSlides = [
  {
    lines: ['Меня зовут Бублик.', 'Я собака.'],
    button: 'Дальше',
  },
  {
    lines: ['А это мой человек.', 'Он немного странный.', 'Но я его люблю.'],
    button: 'Дальше',
  },
  {
    lines: ['Мы живём вместе уже 147 дней.', 'За это время я:', 'съел носок', 'украл котлету', 'победил пылесос', 'не понял зачем нужен дождь'],
    button: 'Дальше',
  },
  {
    lines: ['Сегодня начинается новый день.'],
    button: 'Начать день',
  },
];

export default function IntroScreen({ step, onNext }: Props) {
  const slide = introSlides[Math.min(step, introSlides.length - 1)];
  const listItems = step === 2 ? slide.lines.slice(2) : [];

  return (
    <main className="intro-screen">
      <section className="intro-card" aria-label="Вступление">
        {slide.lines.slice(0, step === 2 ? 2 : slide.lines.length).map((line) => (
          <p key={line}>{line}</p>
        ))}
        {listItems.length > 0 && (
          <ul>
            {listItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )}
        <button onClick={onNext}>{slide.button}</button>
      </section>
    </main>
  );
}
