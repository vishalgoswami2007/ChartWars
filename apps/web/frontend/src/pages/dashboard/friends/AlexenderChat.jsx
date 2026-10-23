
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
    keywords: [
      "practice room",
      "book room",
      "create room",
      "join room",
      "room",
    ],
    answer:
      "Open Rooms from the dashboard navigation and choose an available practice mode. Room creation, joining and booking depend on the room feature being connected.",
  },
  {
    label: "Practice modes",
    keywords: [
      "practice modes",
      "solo",
      "coach",
      "tournament",
      "blind room",
    ],
    answer:
      "ChartWars is designed for chart-based practice with different formats, including solo practice, friend challenges and coach-style sessions. Availability depends on which modes are implemented.",
  },
  {
    label: "Matches and wins",
    keywords: [
      "match",
      "wins",
      "losses",
      "score",
      "leaderboard",
      "win rate",
    ],
    answer:
      "Match results and win rate should be calculated from completed practice sessions. Until match tracking is connected, any displayed stats are preview values.",
  },
  {
    label: "Real-money trading",
    keywords: [
      "real money",
      "money",
      "deposit",
      "withdraw",
      "investment",
      "financial advice",
    ],
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

function MessageTime({ time, from }) {
  return (
    <p
      className={`mt-2 text-right text-xs ${
        from === "user" ? "text-orange-100" : "text-zinc-500"
      }`}
    >
      {time.toLocaleTimeString("en", {
        hour: "numeric",
        minute: "2-digit",
      })}
    </p>
  );
}

export default function AlexenderChat({ onClose }) {
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState(() => [
    makeMessage(
      "Hello! 👋 I'm Alexender, your ChartWars helper. Choose a topic below or ask me a question.",
    ),
  ]);

  const conversationRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const conversation = conversationRef.current;

    if (conversation) {
      conversation.scrollTop = conversation.scrollHeight;
    }
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
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm sm:items-end sm:p-4">
      <section className="flex h-full min-h-0 w-full flex-col overflow-hidden border border-zinc-800 bg-[#0b0b0c] shadow-2xl sm:h-[88vh] sm:max-h-170 sm:max-w-md sm:rounded-2xl">
        <header className="flex shrink-0 items-center gap-3 border-b border-zinc-800 bg-zinc-950 px-4 py-3">
          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-orange-900 bg-orange-950 text-[#E87524]">
            <Bot size={22} />
            <span className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-zinc-950 bg-emerald-500" />
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-semibold text-white">Alexender</h2>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-zinc-400">
              <Sparkles size={12} className="shrink-0 text-[#E87524]" />
              ChartWars help assistant
            </p>
          </div>

          <button
            type="button"
            aria-label="Close Alexender chat"
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
          >
            <X size={19} />
          </button>
        </header>

        <div className="flex shrink-0 items-start gap-2 border-b border-zinc-800 bg-orange-950/20 px-4 py-2">
          <CircleHelp
            size={15}
            className="mt-0.5 shrink-0 text-[#E87524]"
          />
          <p className="text-xs leading-5 text-zinc-400">
            Alexender uses predefined answers. Account access and live support
            are not connected yet.
          </p>
        </div>

        <div
          ref={conversationRef}
          aria-label="Chat conversation"
          aria-live="polite"
          className="min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain px-3 py-5 sm:px-4"
        >
          <div className="mb-2 text-center text-xs text-zinc-600">
            Today · ChartWars support
          </div>

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex w-full items-end gap-2 ${
                message.from === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.from === "bot" && (
                <div className="mb-5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-orange-900/60 bg-orange-950/40 text-[#E87524]">
                  <Bot size={17} />
                </div>
              )}

              <div
                className={`min-w-0 max-w-[86%] rounded-2xl px-4 py-3 ${
                  message.from === "user"
                    ? "rounded-br-md bg-[#E87524] text-white"
                    : "rounded-bl-md border border-zinc-800 bg-zinc-900 text-zinc-200"
                }`}
              >
                <p className="mb-1 text-xs font-semibold">
                  {message.from === "user" ? "You" : "Alexender"}
                </p>

                <p className="whitespace-pre-wrap wrap-break-words text-sm leading-6">
                  {message.text}
                </p>

                <MessageTime time={message.time} from={message.from} />
              </div>
            </div>
          ))}
        </div>

        <footer className="shrink-0 border-t border-zinc-800 bg-[#0b0b0c]">
          <div className="px-3 pb-3 pt-3 sm:px-4">
            <div className="mb-2 flex items-center justify-between gap-3">
              <p className="text-xs font-semibold text-zinc-300">
                Suggested questions
              </p>
              <span className="text-xs text-zinc-600">
                {FAQS.length} topics
              </span>
            </div>

            <div className="flex gap-2 overflow-x-auto overscroll-x-contain pb-2">
              {FAQS.map((faq) => (
                <button
                  key={faq.label}
                  type="button"
                  onClick={() => sendMessage(faq.label)}
                  className="shrink-0 rounded-full border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-zinc-300 transition hover:border-orange-700 hover:text-orange-300"
                >
                  {faq.label}
                </button>
              ))}
            </div>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                sendMessage();
              }}
              className="flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-950 p-2 transition focus-within:border-[#E87524]"
            >
              <MessageCircle
                size={18}
                className="ml-1 shrink-0 text-zinc-500"
              />

              <input
                ref={inputRef}
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Ask Alexender anything..."
                aria-label="Ask Alexender a question"
                className="min-w-0 flex-1 bg-transparent px-1 py-2.5 text-sm text-white outline-none placeholder:text-zinc-500"
              />

              <button
                type="submit"
                disabled={!draft.trim()}
                aria-label="Send message"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#E87524] text-white transition hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Send size={16} />
              </button>
            </form>

            <p className="mt-2 flex items-center justify-center gap-1.5 text-xs text-zinc-500">
              <LifeBuoy size={13} />
              Educational help · FAQ preview
              <ArrowRight size={12} />
            </p>
          </div>
        </footer>
      </section>
    </div>
  );
}
