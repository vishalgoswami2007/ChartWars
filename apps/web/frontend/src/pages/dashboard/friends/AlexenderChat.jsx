
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Bot,
  CircleHelp,
  LifeBuoy,
  MessageCircle,
  Send,
  Sparkles,
  X,
} from "lucide-react";

const FAQS = [
  {
    label: "Find friends",
    keywords: ["find friends", "discover", "search user", "find people"],
    answer:
      "Open Friends and choose Discover. Search using a member's username when search is connected to the ChartWars user directory.",
  },
  {
    label: "Send a friend request",
    keywords: ["friend request", "add friend", "send request", "request"],
    answer:
      "Open a member's profile and select Add friend. When the account system is connected, they can accept or decline your request from the Requests tab.",
  },
  {
    label: "Open a practice room",
    keywords: ["practice room", "book room", "create room", "join room", "room"],
    answer:
      "Open Rooms from the dashboard navigation and choose an available practice mode. Room creation, joining and booking depend on the room feature being connected.",
  },
  {
    label: "Practice modes",
    keywords: ["practice modes", "solo", "coach", "tournament", "blind room"],
    answer:
      "ChartWars is designed for chart-based practice with different formats, including solo practice, friend challenges and coach-style sessions. Availability depends on which modes are implemented.",
  },
  {
    label: "How do matches and wins work?",
    keywords: ["match", "wins", "losses", "score", "leaderboard", "win rate"],
    answer:
      "Match results and win rate should be calculated from completed practice sessions. Until match tracking is connected, any displayed stats are preview values.",
  },
  {
    label: "Is this real-money trading?",
    keywords: ["real money", "money", "deposit", "withdraw", "investment", "financial advice"],
    answer:
      "ChartWars is intended for educational chart practice, not real-money trading or investment advice. Never send money or share financial credentials through this chat.",
  },
  {
    label: "Profile and settings",
    keywords: ["profile", "settings", "avatar", "bio", "username", "account"],
    answer:
      "Open your profile from the dashboard to review your account details. Editing and saving changes will work once profile persistence is connected.",
  },
  {
    label: "Report a problem",
    keywords: ["report", "problem", "issue", "bug", "help", "support"],
    answer:
      "Describe the issue and include the page where it happened. This preview bot cannot submit a support ticket yet, so use the project's official support channel when one is available.",
  },
];

function makeMessage(text, from = "bot") {
  return {
    id: `${Date.now()}-${Math.random()}`,
    text,
    from,
    time: new Date(),
  };
}

function getAnswer(input) {
  const message = input.toLowerCase().trim();

  if (/^(hi|hello|hey|hii|good morning|good evening)[!. ]*$/.test(message)) {
    return "Hello! 👋 I'm Alexender, your ChartWars helper. What would you like help with?";
  }

  if (message.includes("thank")) {
    return "You're welcome! Pick another topic if you need anything else.";
  }

  const match = FAQS.find((faq) =>
    faq.keywords.some((keyword) => message.includes(keyword)),
  );

  if (match) return match.answer;

  return "I can help with friends, requests, practice rooms, practice modes, match stats, profiles and account safety. Choose a topic below to see a quick answer.";
}

export default function AlexenderChat({ onClose }) {
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState(() => [
    makeMessage(
      "Hello! 👋 I'm Alexender, your ChartWars helper. Choose a topic or ask me a question.",
    ),
  ]);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  function sendMessage(text = draft) {
    const cleanText = text.trim();
    if (!cleanText) return;

    setMessages((current) => [
      ...current,
      makeMessage(cleanText, "user"),
      makeMessage(getAnswer(cleanText)),
    ]);
    setDraft("");
  }

  return (
    <div className="fixed inset-0 z-80 flex items-end justify-end bg-black/60 backdrop-blur-sm sm:p-5">
      <section className="flex h-[min(720px,94dvh)] w-full flex-col overflow-hidden border border-zinc-800 bg-[#0b0b0c] shadow-2xl sm:h-[min(680px,88dvh)] sm:max-w-md sm:rounded-2xl">
        <header className="flex items-center gap-3 border-b border-zinc-800 bg-zinc-950 px-4 py-4">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-orange-900/60 bg-orange-950/40 text-[#E87524]">
            <Bot size={22} />
            <span className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-zinc-950 bg-emerald-500" />
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-semibold text-white">Alexender</h2>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-zinc-500">
              <Sparkles size={12} className="text-[#E87524]" />
              ChartWars help · Fixed FAQ bot
            </p>
          </div>

          <button
            type="button"
            aria-label="Close Alexender chat"
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
          >
            <X size={18} />
          </button>
        </header>

        <div className="flex items-start gap-2 border-b border-zinc-900 bg-orange-950/10 px-4 py-3">
          <CircleHelp size={15} className="mt-0.5 shrink-0 text-[#E87524]" />
          <p className="text-[11px] leading-5 text-zinc-500">
            Alexender uses predefined answers. It cannot access your account or
            contact other users.
          </p>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-4 py-5">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.from === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.from === "bot" && (
                <div className="mr-2 mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-orange-950/50 text-[#E87524]">
                  <Bot size={15} />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-3 ${
                  message.from === "user"
                    ? "rounded-br-md bg-[#E87524] text-white"
                    : "rounded-bl-md border border-zinc-800 bg-zinc-900 text-zinc-300"
                }`}
              >
                <p className="whitespace-pre-wrap text-sm leading-6">
                  {message.text}
                </p>
                <p
                  className={`mt-2 text-[10px] ${
                    message.from === "user"
                      ? "text-orange-100/70"
                      : "text-zinc-600"
                  }`}
                >
                  {message.time.toLocaleTimeString("en", {
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <div className="border-t border-zinc-800 px-3 py-3">
          <p className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-600">
            Quick questions
          </p>
          <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
            {FAQS.slice(0, 4).map((faq) => (
              <button
                key={faq.label}
                type="button"
                onClick={() => sendMessage(faq.label)}
                className="shrink-0 rounded-full border border-zinc-800 px-3 py-2 text-xs text-zinc-400 transition hover:border-orange-900 hover:text-orange-300"
              >
                {faq.label}
              </button>
            ))}
          </div>

          <div className="mb-3 grid grid-cols-2 gap-2">
            {FAQS.slice(4).map((faq) => (
              <button
                key={faq.label}
                type="button"
                onClick={() => sendMessage(faq.label)}
                className="flex items-center justify-between gap-2 rounded-lg bg-zinc-900/70 px-3 py-2.5 text-left text-xs text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-200"
              >
                <span>{faq.label}</span>
                <ArrowRight size={13} className="shrink-0" />
              </button>
            ))}
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              sendMessage();
            }}
            className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950 p-2 focus-within:border-zinc-600"
          >
            <MessageCircle size={17} className="ml-1 shrink-0 text-zinc-600" />
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Ask Alexender..."
              aria-label="Ask Alexender a question"
              className="min-w-0 flex-1 bg-transparent px-1 py-2 text-sm text-white outline-none placeholder:text-zinc-600"
            />
            <button
              type="submit"
              disabled={!draft.trim()}
              aria-label="Send question"
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#E87524] text-white transition hover:bg-orange-500 disabled:opacity-40"
            >
              <Send size={15} />
            </button>
          </form>
          <p className="mt-2 flex items-center justify-center gap-1 text-[10px] text-zinc-600">
            <LifeBuoy size={12} />
            FAQ preview only
          </p>
        </div>
      </section>
    </div>
  );
}
