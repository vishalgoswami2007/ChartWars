import { useState } from "react";
import { Link } from "react-router-dom";
import Footer from "./Footer";
const ROUTES = {
  home: "/",
  help: "/help",
  contact: "/businessContact",
  privacy: "/privacyPolicy",
  cookies: "/cookies",
  terms: "/terms",
  accessibility: "/accessibility",
};
import logo from "../../../assets/logo.png";

const CONTACT_ENDPOINT = "";

const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black";
const WRAP = "mx-auto w-full max-w-6xl px-5 sm:px-8";
const INPUT =
  "w-full rounded-xl border bg-black/40 px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-orange-500/30";

const TOPICS = ["Support", "Feedback", "Report a bug", "Privacy request", "Something else"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const INITIAL = { name: "", email: "", topic: TOPICS[0], message: "", consent: false, website: "" };

const CHANNELS = [
  { title: "Support", text: "Account, rooms, sign-in or anything that is not working as expected." },
  { title: "Feedback", text: "Ideas, confusing screens and features you would like to see." },
  { title: "Privacy request", text: "Ask to access, correct or delete your personal data." },
];

function validate(v) {
  const e = {};
  if (v.name.trim().length < 2) e.name = "Please enter your name.";
  if (!EMAIL_RE.test(v.email.trim())) e.email = "Please enter a valid email address.";
  if (v.message.trim().length < 20) e.message = "Please write at least 20 characters so we can help.";
  if (!v.consent) e.consent = "Please agree so we can reply to you.";
  return e;
}

async function sendMessage(payload) {
  if (!CONTACT_ENDPOINT) {
    await new Promise((resolve) => setTimeout(resolve, 700));
    return { demo: true };
  }
  const res = await fetch(CONTACT_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Request failed");
  return { demo: false };
}

function Shell({ children }) {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#050505] text-zinc-100 antialiased selection:bg-orange-500/30">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-120 bg-[radial-gradient(ellipse_at_top,rgba(249,115,22,0.16),transparent_65%)]"
      />
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#050505]/80 backdrop-blur">
        <div className={`${WRAP} flex h-16 items-center justify-between`}>
          <Link to={ROUTES.home} className={`flex items-center gap-3 rounded-md ${FOCUS}`} aria-label="ChartWars home">
            <img src={logo} alt="" width={32} height={32} className="h-8 w-8" />
            <span className="text-sm font-semibold tracking-[0.22em]">
              CHART<span className="text-orange-500">WARS</span>
            </span>
          </Link>
          <Link
            to={ROUTES.home}
            className={`rounded-full border border-white/15 px-4 py-2 text-sm text-zinc-300 transition hover:border-orange-500/60 hover:text-white ${FOCUS}`}
          >
            Back to home
          </Link>
        </div>
      </header>
      <main className="relative">{children}</main>
      <Footer />
    </div>
  );
}


function Field({ id, label, error, children }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium text-zinc-200">
        {label}
      </label>
      {children}
      <p id={`${id}-error`} className="min-h-4 text-xs text-red-400">
        {error}
      </p>
    </div>
  );
}

export default function Contact() {
  const [values, setValues] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [demo, setDemo] = useState(false);

  const border = (name) => (errors[name] ? "border-red-500/70" : "border-white/10 focus:border-orange-500/70");

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setValues((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === "sending") return;

    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    // A filled honeypot means a bot. Pretend it worked and send nothing.
    if (values.website) {
      setStatus("sent");
      return;
    }

    setStatus("sending");
    try {
      const result = await sendMessage({
        name: values.name.trim(),
        email: values.email.trim(),
        topic: values.topic,
        message: values.message.trim(),
        source: "contact",
        sentAt: new Date().toISOString(),
      });
      setDemo(result.demo);
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  const reset = () => {
    setValues(INITIAL);
    setErrors({});
    setStatus("idle");
  };

  const firstName = values.name.trim().split(" ")[0];

  return (
    <Shell>
      <div className={`${WRAP} grid gap-14 pb-24 pt-16 sm:pt-20 lg:grid-cols-[1fr_1.15fr]`}>
        <section>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-500">Contact</p>
          <h1 className="mt-5 text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl">
            Talk to the <span className="text-orange-500">ChartWars</span> team.
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-zinc-400">
            Questions, feedback or a problem to report? Send us a message and a real person will read it.
          </p>
          <ul className="mt-10 space-y-4">
            {CHANNELS.map((c) => (
              <li key={c.title} className="rounded-2xl border border-white/10 bg-white/3 p-5">
                <h2 className="text-sm font-semibold text-white">{c.title}</h2>
                <p className="mt-1 text-sm leading-relaxed text-zinc-400">{c.text}</p>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-zinc-500">
            Looking for quick answers? Try the{" "}
            <Link to={ROUTES.help} className={`rounded text-orange-400 underline-offset-4 hover:underline ${FOCUS}`}>
              Help Center
            </Link>
            .
          </p>
        </section>

        <section aria-live="polite" className="rounded-3xl border border-white/10 bg-white/3 p-6 sm:p-8">
          {status === "sent" ? (
            <div role="status" className="flex flex-col items-center gap-4 px-2 py-10 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full border border-orange-500/50 bg-orange-500/10 text-orange-400">
                <svg viewBox="0 0 20 20" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M4 10.5l4 4 8-9" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <h2 className="text-2xl font-semibold">Message sent</h2>
              <p className="max-w-sm text-sm leading-relaxed text-zinc-400">
                Thank you{firstName ? `, ${firstName}` : ""}. We have received your message and will reply to{" "}
                <span className="text-zinc-200">{values.email.trim()}</span>.
              </p>
              {demo && (
                <p className="text-xs text-amber-400">
                  Demo mode: the backend is not connected yet, so this message was not delivered.
                </p>
              )}
              <div className="mt-2 flex flex-wrap justify-center gap-3">
                <Link to={ROUTES.home} className={`inline-flex h-11 items-center rounded-full bg-orange-500 px-6 text-sm font-semibold text-black transition hover:bg-orange-400 ${FOCUS}`}>
                  Back to home
                </Link>
                <button type="button" onClick={reset} className={`h-11 rounded-full border border-white/15 px-6 text-sm text-zinc-200 transition hover:border-orange-500/60 ${FOCUS}`}>
                  Send another message
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-1">
              <h2 className="text-xl font-semibold">Send us a message</h2>
              <p className="mb-5 mt-1 text-sm text-zinc-500">All fields are required except where marked.</p>

              {status === "error" && (
                <div role="alert" className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  Something went wrong and your message was not sent. Please try again.
                </div>
              )}

              <div className="grid gap-x-4 sm:grid-cols-2">
                <Field id="c-name" label="Full name" error={errors.name}>
                  <input id="c-name" name="name" autoComplete="name" placeholder="Your name" value={values.name} onChange={handleChange}
                    aria-invalid={Boolean(errors.name)} aria-describedby="c-name-error" className={`${INPUT} ${border("name")}`} />
                </Field>
                <Field id="c-email" label="Email" error={errors.email}>
                  <input id="c-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" value={values.email} onChange={handleChange}
                    aria-invalid={Boolean(errors.email)} aria-describedby="c-email-error" className={`${INPUT} ${border("email")}`} />
                </Field>
              </div>

              <Field id="c-topic" label="What is this about?" error="">
                <select id="c-topic" name="topic" value={values.topic} onChange={handleChange} className={`${INPUT} border-white/10 focus:border-orange-500/70`}>
                  {TOPICS.map((t) => (
                    <option key={t} value={t} className="bg-zinc-900">
                      {t}
                    </option>
                  ))}
                </select>
              </Field>

              <Field id="c-message" label="Message" error={errors.message}>
                <textarea id="c-message" name="message" rows={6} placeholder="Tell us what happened or what you would like to know" value={values.message} onChange={handleChange}
                  aria-invalid={Boolean(errors.message)} aria-describedby="c-message-error" className={`${INPUT} resize-y ${border("message")}`} />
              </Field>

              <div aria-hidden="true" className="absolute left-[-9999px] h-px w-px overflow-hidden">
                <label>
                  Leave this field empty
                  <input name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={handleChange} />
                </label>
              </div>

              <label className="flex items-start gap-3 text-xs leading-relaxed text-zinc-400">
                <input type="checkbox" name="consent" checked={values.consent} onChange={handleChange} className="mt-0.5 h-4 w-4 accent-orange-500" />
                <span>
                  I agree that ChartWars may use these details to reply to me. See the{" "}
                  <Link to={ROUTES.privacy} className="text-orange-400 underline-offset-4 hover:underline">
                    Privacy Policy
                  </Link>
                  .
                </span>
              </label>
              <p className="mb-4 min-h-4 text-xs text-red-400">{errors.consent}</p>

              <button type="submit" disabled={status === "sending"} className={`h-12 rounded-full bg-orange-500 text-sm font-semibold text-black transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-60 ${FOCUS}`}>
                {status === "sending" ? "Sending..." : "Send message"}
              </button>
            </form>
          )}
        </section>
      </div>
    </Shell>
    
  );
}