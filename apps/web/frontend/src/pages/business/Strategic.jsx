import { Link } from "react-router-dom";
import Footer from "../landing/footer/Footer";
import logo from "../../assets/logo.png"


const PARTNERS = [
  { icon: "C", title: "Colleges and finance clubs", text: "Give students a safe place to practise before they risk real money." },
  { icon: "E", title: "Trading educators", text: "Run live practice sessions with your learners on a shared chart." },
  { icon: "M", title: "Communities", text: "Study groups and forums that want hands-on practice, not just discussion." },
  { icon: "P", title: "Publishers and creators", text: "Pair your lessons with practice scenarios your audience can try." },
];

const FORMATS = [
  { tag: "A", title: "Co-hosted practice sessions", text: "Your group practises in private rooms with a host guiding the session." },
  { tag: "B", title: "Custom practice scenarios", text: "Pick market periods that match what you are teaching that week." },
  { tag: "C", title: "Feedback on the product", text: "Your learners test early features and tell us what to fix first." },
];

const STEPS = [
  { no: "01", title: "Intro conversation", text: "Tell us who you teach and what you want them to practise." },
  { no: "02", title: "Small pilot", text: "Try it with one small group and agree what success looks like." },
  { no: "03", title: "Review and decide", text: "Look at what worked, then decide whether to continue together." },
];

const PRINCIPLES = [
  { title: "Virtual funds only", text: "No real money, no payouts." },
  { title: "Educational", text: "Not investment advice." },
  { title: "Honest claims", text: "We show only what is built." },
  { title: "Your data stays yours", text: "Used only to run the service." },
];

const CSS = `
@import url("https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&family=JetBrains+Mono:wght@500&display=swap");
.bz-page{--bg:#050506;--line:#25252b;--text:#e9e9ee;--muted:#8d8f99;--silver:#c9cbd1;position:relative;min-height:100vh;color:var(--text);font-family:"IBM Plex Sans",system-ui,-apple-system,"Segoe UI",sans-serif;line-height:1.5;background:radial-gradient(ellipse at 50% -10%,#1b1b21 0%,transparent 55%),var(--bg)}
.bz-page *,.bz-page *::before,.bz-page *::after{box-sizing:border-box}
.bz-page::before{content:"";position:absolute;inset:0;pointer-events:none;background-image:linear-gradient(#0d0d10 1px,transparent 1px),linear-gradient(90deg,#0d0d10 1px,transparent 1px);background-size:56px 56px}
.bz-page>*{position:relative}
.bz-page a{color:inherit;text-decoration:none}
.bz-page a:focus-visible,.bz-btn:focus-visible{outline:2px solid var(--silver);outline-offset:3px}
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
.bz-btn{display:inline-flex;align-items:center;justify-content:center;height:46px;padding:0 24px;font-family:inherit;font-size:14px;font-weight:600;border:1px solid transparent;cursor:pointer;transition:transform .15s,border-color .2s}
.bz-btn-silver{background:linear-gradient(180deg,#f4f4f7,#b4b6bf);color:#09090b}
.bz-btn-silver:hover{transform:translateY(-1px)}
.bz-btn-ghost{background:transparent;color:var(--text);border-color:#3a3a42;font-weight:500}
.bz-btn-ghost:hover{border-color:var(--silver)}
.bz-btn-sm{height:38px;padding:0 18px}
.bz-label{font-size:11px;letter-spacing:2px;color:var(--muted);text-transform:uppercase}
.bz-silver{background:linear-gradient(180deg,#f6f6f8 0%,#8d8f99 100%);-webkit-background-clip:text;background-clip:text;color:transparent}
.bz-h1{font-size:clamp(36px,5vw,56px);font-weight:600;line-height:1.08;margin:18px 0}
.bz-h2{font-size:clamp(26px,3vw,32px);font-weight:600;margin:10px 0 12px}
.bz-lead{color:var(--muted);font-size:17px;line-height:1.65;max-width:520px;margin:0}
.bz-muted{color:var(--muted)}
.bz-hero{display:grid;grid-template-columns:1.15fr 1fr;gap:56px;align-items:center;padding:56px clamp(20px,5vw,80px) 72px}
.bz-actions{display:flex;flex-wrap:wrap;gap:12px;margin-top:30px}
.bz-section{padding:72px clamp(20px,5vw,80px);border-top:1px solid #1c1c21}
.bz-grid{display:grid;gap:16px;margin-top:28px}
.bz-grid-4{grid-template-columns:repeat(4,1fr)}
.bz-grid-3{grid-template-columns:repeat(3,1fr)}
.bz-card{display:flex;flex-direction:column;gap:10px;padding:24px;background:linear-gradient(180deg,#0e0e11,#09090b);border:1px solid var(--line);transition:border-color .2s}
.bz-card:hover{border-color:#3a3a42}
.bz-card h3{margin:0;font-size:16px;font-weight:600}
.bz-card p{margin:0;color:var(--muted);font-size:14px;line-height:1.6}
.bz-icon{width:40px;height:40px;display:flex;align-items:center;justify-content:center;border:1px solid #3a3a42;color:var(--silver);font-size:15px}
.bz-step{font-family:"JetBrains Mono",monospace;font-size:13px;color:var(--silver);letter-spacing:2px}
.bz-preview{padding:22px;background:linear-gradient(180deg,#0e0e11,#09090b);border:1px solid var(--line)}
.bz-preview-meta{display:flex;gap:18px;margin-top:8px;font-family:"JetBrains Mono",monospace;font-size:11px;color:var(--muted)}
.bz-cta{padding:72px 24px;text-align:center;border-top:1px solid #1c1c21;background:linear-gradient(180deg,#0b0b0e,#050506)}
.bz-footer{display:flex;flex-wrap:wrap;gap:12px 24px;padding:26px clamp(20px,5vw,80px);border-top:1px solid #1c1c21;font-size:12px;color:var(--muted)}
.bz-footer span:last-child{margin-left:auto}
@media (max-width:960px){
  .bz-hero{grid-template-columns:1fr}
  .bz-grid-4{grid-template-columns:repeat(2,1fr)}
  .bz-grid-3{grid-template-columns:1fr}
  .bz-nav{display:none}
}
@media (max-width:560px){.bz-grid-4{grid-template-columns:1fr}.bz-footer span:last-child{margin-left:0}}
`;

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
      <nav className="bz-nav" aria-label="Business">
        <Link to="/strategic" className="is-active">Strategic Partnerships</Link>
        <Link to="/businessContact">Contact Business Team</Link>
      </nav>
      <div className="bz-header-actions">
        <Link to="/businessContact" className="bz-btn bz-btn-ghost">Contact us</Link>
      </div>
    </header>
  );
}



export default function Strategic() {
  return (
    <div className="bz-page">
      <style>{CSS}</style>
      <SiteHeader />

      <div className="bz-back">
        <Link to="/">&larr; Back to home</Link>
      </div>

      <section className="bz-hero">
        <div>
          <span className="bz-label">For Business &middot; Strategic Partnerships</span>
          <h1 className="bz-h1 bz-silver">Build better trading education, together.</h1>
          <p className="bz-lead">
            ChartWars is an early-stage practice platform. We work with colleges, educators and
            communities to shape how people learn to trade, with virtual funds only.
          </p>
          <div className="bz-actions">
            <Link to="/businessContact" className="bz-btn bz-btn-ghost">Start a conversation</Link>
            <a href="/howItsWork" className="bz-btn bz-btn-ghost">See how we work</a>
          </div>
        </div>

        <div className="bz-preview" aria-hidden="true">
          <div className="bz-label" style={{ marginBottom: 14 }}>Example pilot room &middot; concept</div>
          <svg viewBox="0 0 440 220" width="100%" fill="none" strokeWidth="1.5">
            <g stroke="#1f1f25"><path d="M0 40H440M0 100H440M0 160H440" /></g>
            <g stroke="#c9cbd1"><path d="M30 110v60M80 90v60M130 100v50M180 70v60M230 80v50M280 50v60" /></g>
            <g fill="#c9cbd1" stroke="none">
              <rect x="24" y="124" width="12" height="30" />
              <rect x="74" y="104" width="12" height="30" />
              <rect x="174" y="84" width="12" height="30" />
              <rect x="274" y="64" width="12" height="30" />
            </g>
            <g fill="#5a5b64" stroke="none">
              <rect x="124" y="112" width="12" height="26" />
              <rect x="224" y="94" width="12" height="26" />
            </g>
            <rect x="300" y="0" width="140" height="220" fill="#09090b" fillOpacity="0.85" stroke="none" />
            <text x="370" y="114" fill="#8d8f99" fontSize="10" textAnchor="middle" fontFamily="JetBrains Mono" stroke="none">
              HIDDEN UNTIL REVEAL
            </text>
          </svg>
          <div className="bz-preview-meta"><span>1 host</span><span>Up to 4 learners</span><span>Virtual funds</span></div>
        </div>
      </section>

      <section className="bz-section">
        <span className="bz-label">01 &middot; Who we partner with</span>
        <h2 className="bz-h2 bz-silver">Teams that teach markets</h2>
        <div className="bz-grid bz-grid-4">
          {PARTNERS.map((p) => (
            <article className="bz-card" key={p.title}>
              <div className="bz-icon">{p.icon}</div>
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bz-section">
        <span className="bz-label">02 &middot; What a partnership can look like</span>
        <h2 className="bz-h2 bz-silver">Shaped with you, not sold to you</h2>
        <p className="bz-muted" style={{ maxWidth: 640, margin: 0 }}>
          ChartWars is early. These are formats we want to explore with partners, not a finished
          product list.
        </p>
        <div className="bz-grid bz-grid-3">
          {FORMATS.map((f) => (
            <article className="bz-card" key={f.title}>
              <span className="bz-step">{f.tag}</span>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bz-section" id="how-we-work">
        <span className="bz-label">03 &middot; How we work together</span>
        <h2 className="bz-h2 bz-silver">Start small, learn fast</h2>
        <div className="bz-grid bz-grid-3">
          {STEPS.map((s) => (
            <article className="bz-card" key={s.no}>
              <span className="bz-step">{s.no}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bz-section">
        <span className="bz-label">04 &middot; Our principles</span>
        <div className="bz-grid bz-grid-4">
          {PRINCIPLES.map((p) => (
            <article className="bz-card" key={p.title} style={{ padding: 18 }}>
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bz-cta">
        <h2 className="bz-h2 bz-silver" style={{ fontSize: 36, margin: 0 }}>Interested in partnering?</h2>
        <p className="bz-muted" style={{ margin: "10px 0 26px" }}>
          Tell us a little about your group. We will reply to the email you give us.
        </p>
        <Link to="/businessContact" className="bz-btn bz-btn-ghost">Contact the business team</Link>
      </section>

      <Footer/>
    </div>
  );
}