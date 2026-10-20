import { ArrowUpRight, BookOpen, Newspaper } from "lucide-react";
import Container from "../../../components/ui/Container";
import SectionHeading from "../components/SectionHeading";

const lessons = [
  {
    category: "MARKET BASICS",
    title: "Understand candlestick structure",
    description:
      "Learn what open, high, low, and close reveal about price movement.",
    number: "01",
  },
  {
    category: "RISK MANAGEMENT",
    title: "Plan your risk before entry",
    description:
      "Explore stop-loss placement, position sizing, and risk-to-reward.",
    number: "02",
  },
  {
    category: "TRADING HABITS",
    title: "Recognise impulsive decisions",
    description:
      "Understand overtrading, revenge trading, and the value of consistency.",
    number: "03",
  },
];

const headlines = [
  {
    category: "MARKET EDUCATION",
    title: "Why market volatility matters",
    description: "Understand price movement before interpreting a chart.",
  },
  {
    category: "MARKET EDUCATION",
    title: "What moves a cryptocurrency market?",
    description: "Explore liquidity, market sentiment, and major catalysts.",
  },
];

export default function LearnAndNews() {
  return (
    <section id="learn" className="cw-section scroll-mt-20">
      <Container>
        <SectionHeading
          eyebrow="04 / Learn & market insights"
          title="Understand the market behind every candle."
          description="Build foundational knowledge alongside your practice sessions."
        />

        <div className="grid gap-5 lg:grid-cols-2">
          <div className="cw-card p-5 sm:p-7">
            <div className="mb-6 flex items-center gap-3">
              <BookOpen size={20} className="text-[#00e887]" />
              <h3 className="text-lg font-semibold text-white">
                Learning library
              </h3>
            </div>

            <div className="divide-y divide-[#202a33]">
              {lessons.map((lesson) => (
                <article key={lesson.number} className="py-5 first:pt-0 last:pb-0">
                  <p className="cw-eyebrow">{lesson.category}</p>

                  <h4 className="mt-2 text-base font-semibold text-white">
                    {lesson.title}
                  </h4>

                  <p className="mt-2 text-sm leading-6 text-[#8c9bad]">
                    {lesson.description}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <div className="cw-card p-5 sm:p-7">
            <div className="mb-6 flex items-center gap-3">
              <Newspaper size={20} className="text-[#00e887]" />
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Market insights
                </h3>
                <p className="mt-1 text-xs text-[#8193a5]">
                  Educational previews
                </p>
              </div>
            </div>

            <div className="grid gap-3">
              {headlines.map((headline) => (
                <article
                  key={headline.title}
                  className="border border-[#202a33] bg-[#080c10] p-4"
                >
                  <p className="cw-eyebrow">{headline.category}</p>

                  <h4 className="mt-2 font-semibold text-white">
                    {headline.title}
                  </h4>

                  <p className="mt-2 text-sm leading-6 text-[#8c9bad]">
                    {headline.description}
                  </p>
                </article>
              ))}
            </div>

            <p className="mt-4 text-xs leading-5 text-[#718194]">
              These are educational examples, not live news headlines.
              Curated news integration can be added later.
            </p>

            <a
              href="/learn"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#00e887]"
            >
              Explore learning <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}