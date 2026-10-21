import { useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../landing/footer/Footer";
import logo from "../../assets/logo.png"     


// Set this to your backend route (for example "/api/contact") when it exists.
// While it is empty the form runs in demo mode: it shows the success message
// but nothing is delivered anywhere.
const CONTACT_ENDPOINT = "";

const TOPICS = ["Partnership", "College or student club", "Community or educator", "Press", "Something else"];

const INITIAL = {
  name: "",
  email: "",
  organisation: "",
  topic: TOPICS[0],
  message: "",
  consent: false,
  website: "", // honeypot, real users never see or fill this
};

const CSS = `
@import url("https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&family=JetBrains+Mono:wght@500&display=swap");
.bz-page{--bg:#050506;--line:#25252b;--text:#e9e9ee;--muted:#8d8f99;--silver:#c9cbd1;position:relative;min-height:100vh;color:var(--text);font-family:"IBM Plex Sans",system-ui,-apple-system,"Segoe UI",sans-serif;line-height:1.5;background:radial-gradient(ellipse at 50% -10%,#1b1b21 0%,transparent 55%),var(--bg)}
.bz-page *,.bz-page *::before,.bz-page *::after{box-sizing:border-box}
.bz-page::before{content:"";position:absolute;inset:0;pointer-events:none;background-image:linear-gradient(#0d0d10 1px,transparent 1px),linear-gradient(90deg,#0d0d10 1px,transparent 1px);background-size:56px 56px}
.bz-page>*{position:relative}
.bz-page a{color:inherit;text-decoration:none}
.bz-page a:focus-visible,.bz-btn:focus-visible,.bz-input:focus-visible{outline:2px solid var(--silver);outline-offset:3px}
.bz-header{display:flex;align-items:center;gap:32px;padding:18px clamp(20px,5vw,80px);border-bottom:1px solid #1c1c21;background:rgba(5,5,6,.85);backdrop-filter:blur(10px)}
.bz-brand{display:flex;align-items:center;gap:10px;font-weight:600;letter-spacing:3px;font-size:15px}
.bz-nav{display:flex;gap:28px;font-size:14px;color:var(--muted)}
.bz-nav a{padding-bottom:4px;border-bottom:1px solid transparent;transition:color .2s}
.bz-nav a:hover{color:var(--text)}
.bz-nav a.is-active{color:var(--text);border-bottom-color:var(--silver)}
.bz-header-actions{margin-left:auto;display:flex;align-items:center;gap:20px;font-size:14px;color:var(--muted)}
.bz-back{padding:20px clamp(20px,5vw,80px) 0;font-size:14px}
.bz-back a{display:inline-flex;align-items:center;gap:8px;color:var(--muted);transition:color .2s}
.bz-back a:hover{color:var(--text)}
.bz-btn{display:inline-flex;align-items:center;justify-content:center;height:48px;padding:0 24px;font-family:inherit;font-size:14px;font-weight:600;border:1px solid transparent;cursor:pointer;transition:transform .15s,border-color .2s}
.bz-btn-silver{background:linear-gradient(180deg,#f4f4f7,#b4b6bf);color:#09090b}
.bz-btn-silver:hover:not(:disabled){transform:translateY(-1px)}
.bz-btn-silver:disabled{opacity:.6;cursor:not-allowed}
.bz-btn-ghost{background:transparent;color:var(--text);border-color:#3a3a42;font-weight:500}
.bz-btn-ghost:hover{border-color:var(--silver)}
.bz-btn-sm{height:38px;padding:0 18px}
.bz-label{font-size:11px;letter-spacing:2px;color:var(--muted);text-transform:uppercase}
.bz-silver{background:linear-gradient(180deg,#f6f6f8 0%,#8d8f99 100%);-webkit-background-clip:text;background-clip:text;color:transparent}
.bz-h1{font-size:clamp(34px,4.6vw,50px);font-weight:600;line-height:1.1;margin:18px 0}
.bz-lead{color:var(--muted);font-size:16px;line-height:1.7;max-width:460px;margin:0}
.bz-contact{display:grid;grid-template-columns:1fr 1.1fr;gap:64px;align-items:start;padding:48px clamp(20px,5vw,80px) 80px}
.bz-info{display:flex;flex-direction:column;gap:16px;margin-top:36px}
.bz-info-card{padding:18px 20px;background:linear-gradient(180deg,#0e0e11,#09090b);border:1px solid var(--line)}
.bz-info-card ul{margin:10px 0 0;padding:0;list-style:none;color:var(--muted);font-size:14px;line-height:1.9}
.bz-form{display:flex;flex-direction:column;gap:18px;padding:32px;background:linear-gradient(180deg,#0e0e11,#09090b);border:1px solid var(--line)}
.bz-form h2{margin:0;font-size:20px;font-weight:600}
.bz-row{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.bz-field{display:flex;flex-direction:column;gap:6px;font-size:13px;color:var(--silver)}
.bz-input{width:100%;padding:12px 14px;background:#09090b;border:1px solid #2f2f36;border-radius:0;color:var(--text);font-family:inherit;font-size:14px;line-height:1.4}
.bz-input::placeholder{color:#6c6e78}
.bz-input:focus{border-color:var(--silver)}
.bz-input[aria-invalid="true"]{border-color:#d9534f}
select.bz-input{appearance:none;background-image:linear-gradient(45deg,transparent 50%,#8d8f99 50%),linear-gradient(135deg,#8d8f99 50%,transparent 50%);background-position:calc(100% - 18px) 50%,calc(100% - 13px) 50%;background-size:5px 5px;background-repeat:no-repeat}
textarea.bz-input{min-height:130px;resize:vertical}
.bz-error{min-height:16px;font-size:12px;color:#ff8a85}
.bz-check{display:flex;align-items:flex-start;gap:10px;font-size:12px;line-height:1.6;color:var(--muted)}
.bz-check input{margin-top:3px;accent-color:#c9cbd1}
.bz-hp{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden}
.bz-alert{padding:14px 16px;font-size:14px;border:1px solid #6b2a28;background:#1a0d0d;color:#ffb4b0}
.bz-submit-row{display:flex;align-items:center;gap:16px}
.bz-success{display:flex;flex-direction:column;align-items:center;gap:14px;padding:40px 16px;text-align:center}
.bz-success h2{margin:0;font-size:24px}
.bz-success p{margin:0;max-width:380px;color:var(--muted);font-size:15px;line-height:1.7}
.bz-success-mark{display:flex;align-items:center;justify-content:center;width:56px;height:56px;border:1px solid var(--silver);color:var(--silver);font-size:24px}
.bz-demo-note{font-size:12px;color:#b59a3c}
.bz-actions{display:flex;flex-wrap:wrap;gap:12px;justify-content:center;margin-top:8px}
.bz-footer{display:flex;flex-wrap:wrap;gap:12px 24px;padding:26px clamp(20px,5vw,80px);border-top:1px solid #1c1c21;font-size:12px;color:var(--muted)}
.bz-footer span:last-child{margin-left:auto}
@media (max-width:960px){.bz-contact{grid-template-columns:1fr;gap:40px}.bz-nav{display:none}}
@media (max-width:560px){.bz-row{grid-template-columns:1fr}.bz-form{padding:22px}.bz-footer span:last-child{margin-left:0}}
`;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(v) {
  const errors = {};
  if (v.name.trim().length < 2) errors.name = "Please enter your full name.";
  if (!EMAIL_RE.test(v.email.trim())) errors.email = "Please enter a valid email address.";
  if (v.message.trim().length < 20) errors.message = "Please write at least 20 characters so we understand your request.";
  if (!v.consent) errors.consent = "Please agree so we can reply to you.";
  return errors;
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

function Logo() {
  return <img src={logo} width="26" height="26" alt="" aria-hidden="true" />;
}


function SiteHeader() {
  return (
    <header className="bz-header">
          <Link to="/" className="bz-brand" aria-label="ChartWars home">
          <Logo />
            CHARTWARS
        </Link>
      <div className="bz-header-actions">
        <Link to="/" className="bz-btn bz-btn-ghost bz-btn-sm">Back to home</Link>
      </div>
    </header>
  );
}


export default function BusinessContact() {
  const [values, setValues] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [demo, setDemo] = useState(false);

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

    // Honeypot filled means a bot: pretend success, send nothing.
    if (values.website) {
      setStatus("sent");
      return;
    }

    setStatus("sending");
    try {
      const result = await sendMessage({
        name: values.name.trim(),
        email: values.email.trim(),
        organisation: values.organisation.trim(),
        topic: values.topic,
        message: values.message.trim(),
        source: "business-contact",
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
    <div className="bz-page">
      <style>{CSS}</style>
      <SiteHeader />

      <div className="bz-back">
        <Link to="/">&larr; Back to home</Link>
      </div>

      <main className="bz-contact">
        <section>
          <span className="bz-label">For Business &middot; Contact</span>
          <h1 className="bz-h1 bz-silver">Talk to the business team.</h1>
          <p className="bz-lead">
            Tell us about your college, community or platform and what you would like to explore.
            A real person reads every message.
          </p>
          <div className="bz-info">
            <div className="bz-info-card">
              <div className="bz-label">What to include</div>
              <ul>
                <li>Who you teach or serve</li>
                <li>Roughly how many people</li>
                <li>What you want to try</li>
              </ul>
            </div>
            <div className="bz-info-card">
              <div className="bz-label">What happens next</div>
              <ul>
                <li>We read your message</li>
                <li>We reply to the email you provide</li>
                <li>We suggest a short intro call if it fits</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="bz-form" aria-live="polite">
          {status === "sent" ? (
            <div className="bz-success" role="status">
              <div className="bz-success-mark" aria-hidden="true">&#10003;</div>
              <h2>Message sent</h2>
              <p>
                Thank you{firstName ? `, ${firstName}` : ""}. We have received your message and will
                reply to {values.email.trim()}.
              </p>
              {demo && (
                <span className="bz-demo-note">
                  Demo mode: the backend is not connected yet, so this message was not delivered.
                </span>
              )}
              <div className="bz-actions">
                <Link to="/" className="bz-btn bz-btn-silver">Back to home</Link>
                <button type="button" className="bz-btn bz-btn-ghost" onClick={reset}>
                  Send another message
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate style={{ display: "contents" }}>
              <h2>Send us a message</h2>

              {status === "error" && (
                <div className="bz-alert" role="alert">
                  Something went wrong and your message was not sent. Please try again.
                </div>
              )}

              <div className="bz-row">
                <div className="bz-field">
                  <label htmlFor="bz-name">Full name</label>
                  <input
                    id="bz-name" name="name" className="bz-input" autoComplete="name"
                    placeholder="Your name" value={values.name} onChange={handleChange}
                    aria-invalid={Boolean(errors.name)} aria-describedby="bz-name-err"
                  />
                  <span id="bz-name-err" className="bz-error">{errors.name}</span>
                </div>
                <div className="bz-field">
                  <label htmlFor="bz-email">Work email</label>
                  <input
                    id="bz-email" name="email" type="email" className="bz-input" autoComplete="email"
                    placeholder="name@college.edu" value={values.email} onChange={handleChange}
                    aria-invalid={Boolean(errors.email)} aria-describedby="bz-email-err"
                  />
                  <span id="bz-email-err" className="bz-error">{errors.email}</span>
                </div>
              </div>

              <div className="bz-row">
                <div className="bz-field">
                  <label htmlFor="bz-org">Organisation (optional)</label>
                  <input
                    id="bz-org" name="organisation" className="bz-input" autoComplete="organization"
                    placeholder="College, club or company" value={values.organisation} onChange={handleChange}
                  />
                </div>
                <div className="bz-field">
                  <label htmlFor="bz-topic">I am contacting about</label>
                  <select id="bz-topic" name="topic" className="bz-input" value={values.topic} onChange={handleChange}>
                    {TOPICS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="bz-field">
                <label htmlFor="bz-message">Message</label>
                <textarea
                  id="bz-message" name="message" className="bz-input"
                  placeholder="Tell us what you would like to explore" value={values.message}
                  onChange={handleChange} aria-invalid={Boolean(errors.message)}
                  aria-describedby="bz-message-err"
                />
                <span id="bz-message-err" className="bz-error">{errors.message}</span>
              </div>

              <div className="bz-hp" aria-hidden="true">
                <label>
                  Leave this field empty
                  <input name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={handleChange} />
                </label>
              </div>

              <div>
                <label className="bz-check">
                  <input type="checkbox" name="consent" checked={values.consent} onChange={handleChange} />
                  <span>I agree that ChartWars may use these details to reply to me. See the Privacy Policy.</span>
                </label>
                <span className="bz-error" style={{ display: "block", marginTop: 6 }}>{errors.consent}</span>
              </div>

              <div className="bz-submit-row">
                <button type="submit" className="bz-btn bz-btn-silver" disabled={status === "sending"}>
                  {status === "sending" ? "Sending..." : "Send message"}
                </button>
              </div>
            </form>
          )}
        </section>
      </main>

      <Footer/>
    </div>
  );
}