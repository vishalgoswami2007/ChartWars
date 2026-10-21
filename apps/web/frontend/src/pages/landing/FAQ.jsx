import { useState } from "react";
import {
  Search,
  ChevronDown,
  MessageCircle,
  Send,
  ThumbsUp,
  ThumbsDown,
  CircleHelp,
  ShieldCheck,
  Users,
  TrendingUp,
  Lightbulb,
  Plus,
  CheckCircle2,
} from "lucide-react";
import Footer from "./footer/Footer";
import logo from "../../assets/logo.png";

const categories = [
  { name: "All Questions", icon: CircleHelp },
  { name: "Getting Started", icon: Lightbulb },
  { name: "Trading Practice", icon: TrendingUp },
  { name: "Rooms & Friends", icon: Users },
  { name: "Account & Security", icon: ShieldCheck },
];

const initialFAQs = [
  {
    category: "Getting Started",
    question: "What is ChartWars?",
    answer:
      "ChartWars is a trading practice platform where you can explore charts, practice trading strategies, challenge friends, and review your performance using virtual funds.",
  },
  {
    category: "Getting Started",
    question: "Is ChartWars free to use?",
    answer:
      "ChartWars is designed for accessible trading practice. Available features and any future pricing will be shown on the platform.",
  },
  {
    category: "Getting Started",
    question: "Do I need real money to practice?",
    answer:
      "No. ChartWars practice trading uses virtual funds. You can practice strategies without placing real-money trades through the practice simulator.",
  },
  {
    category: "Trading Practice",
    question: "Can I lose real money on ChartWars?",
    answer:
      "Virtual practice balances are used for simulated trading. They are not real money, and simulated profits or losses do not represent actual financial returns.",
  },
  {
    category: "Trading Practice",
    question: "What is candle replay?",
    answer:
      "Candle replay lets you study historical market candles step by step, make simulated trading decisions, and evaluate your strategy without seeing future candles in advance when the replay mode supports that restriction.",
  },
  {
    category: "Trading Practice",
    question: "Can I use indicators like EMA and RSI?",
    answer:
      "ChartWars is designed around chart-based practice and technical analysis. Indicator availability depends on the features enabled in the current version.",
  },
  {
    category: "Trading Practice",
    question: "Does ChartWars guarantee profitable strategies?",
    answer:
      "No. ChartWars is a learning and practice tool. No indicator, strategy, replay result, or performance report guarantees future profits.",
  },
  {
    category: "Rooms & Friends",
    question: "Can I practice with my friends?",
    answer:
      "ChartWars is built around social trading practice. Where room features are available, you can join shared sessions and compare your practice results with friends.",
  },
  {
    category: "Rooms & Friends",
    question: "What are trading rooms?",
    answer:
      "Rooms are shared practice spaces intended for collaborative sessions, friendly challenges, and group learning. The available room controls depend on the current release.",
  },
  {
    category: "Rooms & Friends",
    question: "Can a room owner control who joins?",
    answer:
      "Room access and participant permissions depend on the room settings and features available in your version. Always check the room's displayed permissions before joining.",
  },
  {
    category: "Account & Security",
    question: "How do I keep my account secure?",
    answer:
      "Use a strong, unique password, protect access to your email, never share verification codes, and sign out on shared devices. Use only the official ChartWars website.",
  },
  {
    category: "Account & Security",
    question: "What should I do if I forget my password?",
    answer:
      "Use the password recovery option if it is available on the sign-in page. Follow the verification instructions and never share your reset link or verification code with anyone.",
  },
  {
    category: "Account & Security",
    question: "Is ChartWars financial advice?",
    answer:
      "No. ChartWars is intended for educational and simulated trading practice. It does not provide personalized financial advice or guarantee investment outcomes.",
  },
];

function FAQ() {
  const [faqs] = useState(initialFAQs);
  const [activeCategory, setActiveCategory] = useState("All Questions");
  const [search, setSearch] = useState("");
  const [openIndex, setOpenIndex] = useState(0);
  const [feedbackType, setFeedbackType] = useState("suggestion");
  const [feedback, setFeedback] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const filteredFAQs = faqs.filter((faq) => {
    const matchesCategory =
      activeCategory === "All Questions" ||
      faq.category === activeCategory;

    const matchesSearch =
      faq.question.toLowerCase().includes(search.toLowerCase()) ||
      faq.answer.toLowerCase().includes(search.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  function handleFeedbackSubmit(e) {
    e.preventDefault();

    const submission = {
      type: feedbackType,
      message: feedback.trim(),
      email: email.trim(),
      createdAt: new Date().toISOString(),
    };

    if (!submission.message) return;

    // Demo only: this does not send or save feedback to a server.
    console.log("ChartWars FAQ feedback:", submission);

    setSubmitted(true);
    setFeedback("");
    setEmail("");
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
          <a href="/" className="flex items-center gap-3">
            <img src={logo} alt="ChartWars" className="h-10 w-10 object-contain" />
            <span className="text-xl font-bold tracking-tight">
              Chart<span className="text-orange-500">Wars</span>
            </span>
          </a>

          <a
            href="/"
            className="rounded-xl border border-white/10 px-4 py-2 text-sm text-zinc-300 transition hover:border-orange-500/50 hover:text-orange-400"
          >
            Back to Home
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-96 -translate-x-1/2 rounded-full bg-orange-500/10 blur-[120px]" />

        <div className="relative mx-auto max-w-4xl px-5 py-20 text-center sm:px-8 sm:py-24">
          <span className="inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-2 text-sm text-orange-400">
            <CircleHelp size={16} />
            ChartWars Help Center
          </span>

          <h1 className="mt-7 text-4xl font-bold tracking-tight sm:text-6xl">
            Got questions?
            <span className="mt-2 block text-orange-500">
              We've got answers.
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg">
            Find answers about trading practice, chart replay, rooms, friends,
            and your ChartWars account.
          </p>

          <div className="mx-auto mt-9 flex max-w-2xl items-center gap-3 rounded-2xl border border-white/10 bg-zinc-950 px-4 py-4 transition focus-within:border-orange-500/60">
            <Search size={21} className="shrink-0 text-orange-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setOpenIndex(0);
              }}
              placeholder="Search your question..."
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-600 sm:text-base"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="text-sm text-zinc-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          <p className="mt-4 text-xs text-zinc-600">
            Search answers or browse by category below.
          </p>
        </div>
      </section>

      {/* FAQ content */}
      <main className="mx-auto grid max-w-7xl gap-10 px-5 py-16 lg:grid-cols-[260px_1fr] lg:px-8">
        <aside>
          <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
            Browse Categories
          </h2>

          <div className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible">
            {categories.map((category) => {
              const Icon = category.icon;
              const active = activeCategory === category.name;

              return (
                <button
                  key={category.name}
                  onClick={() => {
                    setActiveCategory(category.name);
                    setOpenIndex(0);
                  }}
                  className={`flex shrink-0 items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition ${
                    active
                      ? "border-orange-500/30 bg-orange-500/10 text-orange-400"
                      : "border-transparent text-zinc-400 hover:border-white/10 hover:bg-white/3 hover:text-white"
                  }`}
                >
                  <Icon size={18} />
                  <span>{category.name}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-8 hidden rounded-2xl border border-white/10 bg-zinc-950 p-5 lg:block">
            <MessageCircle size={24} className="text-orange-500" />
            <h3 className="mt-4 font-semibold">Still need help?</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-500">
              Help us improve this page by suggesting a question or reporting
              an unclear answer.
            </p>
            <a
              href="#faq-feedback"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-orange-400 hover:text-orange-300"
            >
              Give feedback <span>→</span>
            </a>
          </div>
        </aside>

        <section>
          <div className="mb-6 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold sm:text-3xl">
                {activeCategory}
              </h2>
              <p className="mt-2 text-sm text-zinc-500">
                {filteredFAQs.length} questions found
              </p>
            </div>
            <span className="hidden rounded-full border border-white/10 px-3 py-1.5 text-xs text-zinc-500 sm:inline-block">
              FAQ
            </span>
          </div>

          <div className="space-y-3">
            {filteredFAQs.map((faq, index) => {
              const isOpen = openIndex === index;

              return (
                <div
                  key={faq.question}
                  className={`overflow-hidden rounded-2xl border transition ${
                    isOpen
                      ? "border-orange-500/30 bg-orange-500/3"
                      : "border-white/10 bg-zinc-950 hover:border-white/20"
                  }`}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? -1 : index)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left sm:px-6"
                    aria-expanded={isOpen}
                  >
                    <span
                      className={`text-sm font-semibold leading-6 sm:text-base ${
                        isOpen ? "text-orange-400" : "text-zinc-200"
                      }`}
                    >
                      {faq.question}
                    </span>
                    <ChevronDown
                      size={20}
                      className={`shrink-0 transition-transform ${
                        isOpen
                          ? "rotate-180 text-orange-500"
                          : "text-zinc-500"
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="border-t border-white/5 px-5 pb-5 pt-4 sm:px-6">
                      <p className="text-sm leading-7 text-zinc-400 sm:text-base">
                        {faq.answer}
                      </p>
                      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                        <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-500">
                          {faq.category}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="mr-1 text-xs text-zinc-600">
                            Helpful?
                          </span>
                          <button
                            onClick={() => {
                              setFeedbackType("answer improvement");
                              setFeedback(
                                `This answer was helpful: "${faq.question}"\n`,
                              );
                              document
                                .getElementById("faq-feedback")
                                ?.scrollIntoView({ behavior: "smooth" });
                            }}
                            aria-label="This answer was helpful"
                            className="rounded-lg border border-white/10 p-2 text-zinc-500 transition hover:border-orange-500/30 hover:text-orange-400"
                          >
                            <ThumbsUp size={15} />
                          </button>
                          <button
                            onClick={() => {
                              setFeedbackType("answer improvement");
                              setFeedback(
                                `Please improve this answer: "${faq.question}"\n`,
                              );
                              document
                                .getElementById("faq-feedback")
                                ?.scrollIntoView({ behavior: "smooth" });
                            }}
                            aria-label="Suggest an improvement to this answer"
                            className="rounded-lg border border-white/10 p-2 text-zinc-500 transition hover:border-orange-500/30 hover:text-orange-400"
                          >
                            <ThumbsDown size={15} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {filteredFAQs.length === 0 && (
              <div className="rounded-2xl border border-white/10 bg-zinc-950 px-6 py-12 text-center">
                <Search size={30} className="mx-auto text-zinc-600" />
                <h3 className="mt-4 text-lg font-semibold">
                  No questions found
                </h3>
                <p className="mt-2 text-sm text-zinc-500">
                  Try a different search or suggest your question below.
                </p>
                <button
                  onClick={() => {
                    setSearch("");
                    setActiveCategory("All Questions");
                  }}
                  className="mt-5 text-sm font-semibold text-orange-400 hover:text-orange-300"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Feedback */}
      <section
        id="faq-feedback"
        className="border-y border-white/10 bg-zinc-950/70"
      >
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 lg:grid-cols-2 lg:px-8 lg:py-20">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1.5 text-xs font-medium text-orange-400">
              <MessageCircle size={14} />
              Your feedback matters
            </span>

            <h2 className="mt-6 text-3xl font-bold leading-tight sm:text-4xl">
              Help us make the
              <span className="text-orange-500"> FAQ better.</span>
            </h2>

            <p className="mt-4 max-w-xl leading-7 text-zinc-400">
              Couldn't find your answer? Want to add a new question or improve
              an existing explanation? Tell us what is missing.
            </p>

            <div className="mt-8 space-y-4">
              {[
                "Suggest a new question",
                "Improve or correct an existing answer",
                "Report outdated or confusing information",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 text-sm text-zinc-300"
                >
                  <CheckCircle2 size={18} className="shrink-0 text-orange-500" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <form
            onSubmit={handleFeedbackSubmit}
            className="rounded-2xl border border-white/10 bg-black p-5 sm:p-7"
          >
            {submitted ? (
              <div className="py-10 text-center">
                <CheckCircle2
                  size={42}
                  className="mx-auto text-orange-500"
                />
                <h3 className="mt-4 text-xl font-bold">
                  Thanks for your feedback!
                </h3>
                <p className="mt-2 text-sm leading-6 text-zinc-500">
                  Your form was handled in this demo. Connect a backend to
                  actually save and review submissions.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-6 rounded-xl border border-white/10 px-4 py-2 text-sm text-zinc-300 hover:border-orange-500/40"
                >
                  Send another suggestion
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold">Share your feedback</h3>
                <p className="mt-2 text-sm text-zinc-500">
                  Help us improve the ChartWars Help Center.
                </p>

                <label className="mt-6 block text-sm font-medium text-zinc-300">
                  What would you like to do?
                </label>
                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                  {[
                    { value: "suggestion", label: "New question" },
                    { value: "answer improvement", label: "Improve answer" },
                    { value: "general feedback", label: "Other feedback" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFeedbackType(option.value)}
                      className={`rounded-xl border px-3 py-3 text-xs font-medium transition ${
                        feedbackType === option.value
                          ? "border-orange-500/40 bg-orange-500/10 text-orange-400"
                          : "border-white/10 text-zinc-400 hover:border-white/20"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>

                <label
                  htmlFor="faq-feedback-message"
                  className="mt-6 block text-sm font-medium text-zinc-300"
                >
                  Your question or feedback *
                </label>
                <textarea
                  id="faq-feedback-message"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  required
                  minLength={5}
                  rows={5}
                  placeholder="Tell us what question we should add or what answer needs improvement..."
                  className="mt-3 w-full resize-y rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-zinc-600 focus:border-orange-500/50"
                />

                <label
                  htmlFor="faq-feedback-email"
                  className="mt-5 block text-sm font-medium text-zinc-300"
                >
                  Email (optional)
                </label>
                <input
                  id="faq-feedback-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="mt-3 w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-orange-500/50"
                />

                <button
                  type="submit"
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3.5 text-sm font-bold text-black transition hover:bg-orange-400"
                >
                  <Send size={17} />
                  Submit Feedback
                </button>

                <p className="mt-4 text-center text-xs leading-5 text-zinc-600">
                  Demo form only. Submissions are not sent to ChartWars until a
                  backend endpoint is connected.
                </p>
              </>
            )}
          </form>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-5 py-16 text-center">
        <div className="mx-auto max-w-2xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-orange-500/20 bg-orange-500/10">
            <MessageCircle size={25} className="text-orange-500" />
          </div>
          <h2 className="mt-5 text-2xl font-bold sm:text-3xl">
            Every great platform listens.
          </h2>
          <p className="mt-3 text-sm leading-7 text-zinc-500 sm:text-base">
            Your suggestions help us build a clearer, more useful trading
            practice experience for everyone.
          </p>
          <a
            href="#faq-feedback"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 font-semibold text-black transition hover:bg-orange-400"
          >
            <Plus size={18} />
            Suggest a Question
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default FAQ;