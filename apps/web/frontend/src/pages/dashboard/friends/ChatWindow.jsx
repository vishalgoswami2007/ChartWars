
import { useEffect, useRef, useState } from "react";
import {
  CheckCheck,
  MessageCircle,
  Paperclip,
  Send,
  Smile,
  UserRound,
  X,
} from "lucide-react";

function getInitials(name = "User") {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function formatTime(date) {
  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export default function ChatWindow({ user, onClose, onProfile }) {
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState(() => [
    {
      id: "welcome",
      text: `Hey! This is a preview conversation with ${user?.name || "this user"}.`,
      time: new Date(),
      own: false,
    },
  ]);
  const bottomRef = useRef(null);
  const name = user?.name || "ChartWars Member";
  const initials = getInitials(name);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  function sendMessage(event) {
    event.preventDefault();
    const text = draft.trim();

    if (!text) return;

    setMessages((current) => [
      ...current,
      {
        id: `${Date.now()}-${Math.random()}`,
        text,
        time: new Date(),
        own: true,
      },
    ]);
    setDraft("");
  }

  return (
    <div className="fixed inset-0 z-70 flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-5">
      <section className="flex h-[min(760px,94dvh)] w-full max-w-3xl flex-col overflow-hidden rounded-t-2xl border border-zinc-800 bg-[#0b0b0c] shadow-2xl sm:h-[min(760px,88dvh)] sm:rounded-2xl">
        <header className="flex items-center gap-3 border-b border-zinc-800 px-4 py-4 sm:px-5">
          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-zinc-700 bg-zinc-800 text-sm font-bold text-zinc-200">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={name}
                className="h-full w-full object-cover"
              />
            ) : (
              initials
            )}
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#0b0b0c] bg-zinc-500" />
          </div>

          <button
            type="button"
            onClick={() => onProfile?.(user)}
            className="min-w-0 flex-1 text-left"
          >
            <span className="block truncate text-sm font-semibold text-white">
              {name}
            </span>
            <span className="mt-1 block text-xs text-zinc-500">
              Preview conversation
            </span>
          </button>

          <button
            type="button"
            onClick={() => onProfile?.(user)}
            aria-label="View profile"
            title="View profile"
            className="hidden rounded-lg p-2 text-zinc-400 transition hover:bg-zinc-800 hover:text-white sm:inline-flex"
          >
            <UserRound size={18} />
          </button>
          <button
            type="button"
            aria-label="Close chat"
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
          >
            <X size={19} />
          </button>
        </header>

        <div className="flex items-center gap-2 border-b border-zinc-900 bg-zinc-950/70 px-4 py-2.5 text-xs text-zinc-500 sm:px-5">
          <MessageCircle size={14} className="text-[#E87524]" />
          Messages are stored locally in this preview and are not sent to another user.
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto px-4 py-5 sm:px-6">
          <div className="mx-auto max-w-sm rounded-xl border border-zinc-800/80 bg-zinc-900/50 px-4 py-3 text-center">
            <p className="text-xs leading-5 text-zinc-400">
              This is the beginning of your preview conversation with{" "}
              <span className="font-medium text-zinc-200">{name}</span>.
            </p>
          </div>

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.own ? "justify-end" : "justify-start"}`}
            >
              {!message.own && (
                <div className="mr-2 mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-[10px] font-bold text-zinc-300">
                  {initials}
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[72%] ${
                  message.own ? "items-end" : "items-start"
                } flex flex-col`}
              >
                <div
                  className={`whitespace-pre-wrap wrap-break-words rounded-2xl px-4 py-3 text-sm leading-6 ${
                    message.own
                      ? "rounded-br-md bg-[#E87524] text-white"
                      : "rounded-bl-md border border-zinc-800 bg-zinc-900 text-zinc-200"
                  }`}
                >
                  {message.text}
                </div>
                <div className="mt-1.5 flex items-center gap-1.5 px-1 text-[10px] text-zinc-600">
                  <span>{formatTime(message.time)}</span>
                  {message.own && (
                    <CheckCheck size={13} className="text-[#E87524]" />
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <form
          onSubmit={sendMessage}
          className="border-t border-zinc-800 bg-[#0b0b0c] p-3 sm:p-4"
        >
          <div className="flex items-end gap-2 rounded-xl border border-zinc-800 bg-zinc-950 p-2 focus-within:border-zinc-600">
            <button
              type="button"
              aria-label="Attachment preview"
              title="Attachments will be available later"
              className="hidden rounded-lg p-2 text-zinc-500 sm:inline-flex"
            >
              <Paperclip size={18} />
            </button>
            <textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  event.currentTarget.form?.requestSubmit();
                }
              }}
              rows={1}
              placeholder={`Message ${name}...`}
              aria-label="Write a message"
              className="max-h-28 min-h-10 flex-1 resize-y bg-transparent px-2 py-2 text-sm text-white outline-none placeholder:text-zinc-600"
            />
            <button
              type="button"
              aria-label="Emoji preview"
              title="Emoji picker will be available later"
              className="hidden rounded-lg p-2 text-zinc-500 sm:inline-flex"
            >
              <Smile size={18} />
            </button>
            <button
              type="submit"
              disabled={!draft.trim()}
              aria-label="Send message"
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#E87524] text-white transition hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Send size={17} />
            </button>
          </div>
          <p className="mt-2 px-1 text-[10px] text-zinc-600">
            Enter to send · Shift + Enter for a new line
          </p>
        </form>
      </section>
    </div>
  );
}
