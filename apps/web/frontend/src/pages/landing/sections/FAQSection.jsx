import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Container from "../../../components/ui/Container";
import SectionHeading from "../components/SectionHeading";

const faqs = [
  {
    question: "Does ChartWars use real money?",
    answer:
      "ChartWars is designed for simulated trading using virtual funds. It is not a platform for executing real-money trades.",
  },
  {
    question: "Is ChartWars an investment advisory service?",
    answer:
      "No. ChartWars is an educational practice platform, not investment advice or a recommendation to buy or sell an asset.",
  },
  {
    question: "Can I practise with friends?",
    answer:
      "Friend Rooms are part of the planned product experience. Shared sessions will depend on the availability of room and realtime functionality.",
  },
  {
    question: "Are market prices and news live?",
    answer:
      "The current landing page uses illustrative sample data. Live market feeds and curated news must be connected and verified before being presented as live.",
  },
  {
    question: "Can simulated performance predict real results?",
    answer:
      "No. Simulations cannot reproduce every real-world factor, and simulated performance does not guarantee future results.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="cw-section scroll-mt-20">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="05 / FAQ"
              title="Questions before your first session?"
              description="Understand what the platform is designed to do before getting started."
            />

            <p className="text-sm leading-6 text-[#8193a5]">
              Need more information? Reach out through the contact page once it
              is available.
            </p>
          </div>

          <div className="divide-y divide-[#202a33] border-y border-[#202a33]">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              const answerId = `faq-answer-${index}`;

              return (
                <article key={faq.question} className="py-1">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={answerId}
                    onClick={() => setOpenIndex(isOpen ? -1 : index)}
                    className="flex w-full items-center justify-between gap-4 py-5 text-left"
                  >
                    <span className="text-sm font-semibold leading-6 text-white sm:text-base">
                      {faq.question}
                    </span>

                    <ChevronDown
                      size={18}
                      className={`shrink-0 text-[#00e887] transition-transform ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {isOpen && (
                    <p
                      id={answerId}
                      className="max-w-2xl pb-5 text-sm leading-7 text-[#8c9bad]"
                    >
                      {faq.answer}
                    </p>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}