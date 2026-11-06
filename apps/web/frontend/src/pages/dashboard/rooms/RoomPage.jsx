
import { useEffect, useMemo, useState } from "react";

const INITIAL_TRADERS = 1482;

const REGIONS = [
  { name: "India", code: "in", flag: "🇮🇳", share: 26, city: "Mumbai" },
  { name: "United States", code: "us", flag: "🇺🇸", share: 22, city: "New York" },
  { name: "UAE", code: "ae", flag: "🇦🇪", share: 13, city: "Dubai" },
  { name: "United Kingdom", code: "gb", flag: "🇬🇧", share: 12, city: "London" },
  { name: "Japan", code: "jp", flag: "🇯🇵", share: 15, city: "Tokyo" },
  { name: "Germany", code: "de", flag: "🇩🇪", share: 12, city: "Frankfurt" },
];

const MAP_NODES = [
  { code: "us", name: "USA", x: 24, y: 38 },
  { code: "gb", name: "UK", x: 48, y: 30 },
  { code: "de", name: "GER", x: 53, y: 35 },
  { code: "ae", name: "UAE", x: 62, y: 52 },
  { code: "in", name: "IND", x: 68, y: 55 },
  { code: "jp", name: "JPN", x: 84, y: 43 },
];

const MODES = [
  {
    id: "online",
    number: "01",
    title: "Online Mode",
    subtitle: "GLOBAL MATCHMAKING",
    description: "Enter the global arena. Get matched with active traders instantly.",
    status: "FAST MATCHING",
    color: "orange",
    icon: "◈",
    share: 0.55,
    cta: "LAUNCH",
    meta: "LIVE MATCHMAKING",
  },
  {
    id: "friends",
    number: "02",
    title: "Friends Room",
    subtitle: "PRIVATE BATTLE NETWORK",
    description: "Create a private room, invite your squad and compete together.",
    status: "12 ROOMS OPEN",
    color: "blue",
    icon: "⌘",
    share: 0.15,
    cta: "JOIN ARENA",
    meta: "PRIVATE SESSIONS",
  },
  {
    id: "blind",
    number: "03",
    title: "Blind Room",
    subtitle: "HIGH STAKES TERMINAL",
    description: "Trade without visual hints. Test your instinct and discipline.",
    status: "HIGH RISK / HARD",
    color: "purple",
    icon: "◉",
    share: 0.20,
    cta: "ENTER",
    meta: "EXPERT CHALLENGE",
  },
  {
    id: "bot",
    number: "04",
    title: "VS Bot / Coaches",
    subtitle: "AI TRAINING LAB",
    description: "Challenge intelligent bots and sharpen your trading strategy.",
    status: "AI BOT READY",
    color: "green",
    icon: "⌬",
    share: 0.10,
    cta: "START SESSION",
    meta: "AI ENVIRONMENT",
  },
];

const ACTIVITY = [
  "[MATCHMAKING] 🇮🇳 Trader_Alpha matched vs 🇬🇧 ChartFox in Online Mode",
  "[BLIND TERMINAL] 🇺🇸 BullRunner entered Blind Challenge Matrix",
  "[AI LAB] 🇩🇪 AlphaWolf initialized Coach Arena session",
  "[ARENA] 🇯🇵 TokyoTrader joined a global battle",
  "[PRIVATE ROOM] 🇦🇪 DesertBull created a new squad",
  "[SYSTEM] Global trading network is operational",
];

const formatNumber = (number) =>
  Math.round(number).toLocaleString("en-US");

export default function RoomPage({ onLaunch }) {
  const [traders, setTraders] = useState(INITIAL_TRADERS);
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const [selectedMode, setSelectedMode] = useState(null);
  const [activityIndex, setActivityIndex] = useState(0);
  const [clock, setClock] = useState(new Date());

  // Simulated global live trader activity.
  useEffect(() => {
    const interval = setInterval(() => {
      setTraders((previous) => {
        const change = Math.floor(Math.random() * 12) - 5;
        return Math.max(100, previous + change);
      });
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  // Terminal clock.
  useEffect(() => {
    const interval = setInterval(() => {
      setClock(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Activity ticker.
  useEffect(() => {
    const interval = setInterval(() => {
      setActivityIndex((previous) => previous + 1);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // All regional counts are derived from the global counter.
  const regionalStats = useMemo(() => {
    return REGIONS.map((region) => ({
      ...region,
      players: Math.round(traders * region.share / 100),
    }));
  }, [traders]);

  const modeStats = useMemo(() => {
    return MODES.map((mode) => ({
      ...mode,
      players: Math.round(traders * mode.share),
    }));
  }, [traders]);

  const currentRegion = regionalStats.find(
    (region) => region.code === hoveredRegion
  );

  const handleLaunch = (mode) => {
    setSelectedMode(mode.id);

    if (onLaunch) {
      onLaunch(mode.id);
    }
  };

  return (
    <main className="arena-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Rajdhani:wght@400;500;600;700&display=swap');

        .arena-page {
          --arena-bg: #09090b;
          --arena-panel: #0c0c0e;
          --arena-border: #242429;
          --arena-orange: #f97316;
          --arena-blue: #38bdf8;
          --arena-purple: #a78bfa;
          --arena-green: #34d399;
          min-height: 100vh;
          background: var(--arena-bg);
          color: #f4f4f5;
          font-family: 'Rajdhani', sans-serif;
          overflow: hidden;
          position: relative;
        }

        .arena-page * {
          box-sizing: border-box;
        }

        .arena-page button {
          font: inherit;
        }

        .arena-grid {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: .12;
          background-image:
            linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px);
          background-size: 45px 45px;
          mask-image: linear-gradient(to bottom, black, transparent 90%);
        }

        .arena-header {
          min-height: 78px;
          position: relative;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding: 12px 4%;
          border-bottom: 1px solid #242429;
          background: rgba(9,9,11,.94);
        }

        .arena-brand {
          display: flex;
          align-items: center;
          gap: 13px;
          min-width: 0;
        }

        .arena-logo {
          width: 48px;
          height: 48px;
          display: grid;
          place-items: center;
          border-radius: 10px;
          background: linear-gradient(135deg,#ea580c,#f59e0b);
          box-shadow: 0 0 25px rgba(249,115,22,.22);
          color: white;
          font-family: 'Orbitron',sans-serif;
          font-size: 21px;
          font-weight: 900;
          transform: skew(-4deg);
        }

        .arena-brand-name {
          font-family: 'Orbitron',sans-serif;
          font-size: 15px;
          font-weight: 800;
          letter-spacing: 2px;
        }

        .arena-node-address {
          color: #71717a;
          font-family: monospace;
          font-size: 10px;
          letter-spacing: 1px;
          margin-top: 5px;
        }

        .arena-header-center {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          color: #a1a1aa;
          font-size: 12px;
          letter-spacing: 2px;
          font-weight: 700;
        }

        .arena-live-dot {
          width: 8px;
          height: 8px;
          background: #fb453d;
          border-radius: 50%;
          position: relative;
          flex-shrink: 0;
        }

        .arena-live-dot::after {
          content: '';
          position: absolute;
          inset: -5px;
          border: 1px solid #fb453d;
          border-radius: 50%;
          animation: arena-ping 1.5s infinite;
        }

        @keyframes arena-ping {
          0% { transform: scale(.6); opacity: 1; }
          100% { transform: scale(2.4); opacity: 0; }
        }

        .arena-counter {
          font-family: 'Orbitron',sans-serif;
          font-size: 23px;
          color: #fff;
          font-weight: 700;
          letter-spacing: 1px;
          font-variant-numeric: tabular-nums;
          transition: opacity .2s ease;
        }

        .arena-header-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .arena-system-status {
          color: #34d399;
          font-family: monospace;
          font-size: 11px;
          letter-spacing: 1px;
        }

        .arena-clock {
          color: #a1a1aa;
          font-family: monospace;
          font-size: 12px;
          font-variant-numeric: tabular-nums;
        }

        .arena-content {
          position: relative;
          z-index: 1;
          max-width: 1700px;
          margin: auto;
          padding: 30px 4% 20px;
        }

        .arena-heading {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 25px;
        }

        .arena-eyebrow {
          color: var(--arena-orange);
          font-family: monospace;
          font-size: 11px;
          letter-spacing: 3px;
          margin-bottom: 9px;
        }

        .arena-title {
          font-family: 'Orbitron',sans-serif;
          font-size: clamp(25px,3vw,38px);
          font-weight: 800;
          letter-spacing: -1px;
          line-height: 1.2;
        }

        .arena-title span {
          color: var(--arena-orange);
        }

        .arena-description {
          color: #71717a;
          font-size: 15px;
          margin-top: 9px;
        }

        .arena-environment {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 9px 13px;
          border: 1px solid #27272a;
          background: rgba(24,24,27,.65);
          border-radius: 5px;
          color: #a1a1aa;
          font-family: monospace;
          font-size: 10px;
          letter-spacing: 1px;
          white-space: nowrap;
        }

        .arena-environment span {
          color: var(--arena-green);
        }

        .arena-layout {
          display: grid;
          grid-template-columns: minmax(0,7fr) minmax(340px,5fr);
          gap: 22px;
          align-items: stretch;
        }

        .arena-panel {
          background: rgba(12,12,14,.88);
          border: 1px solid var(--arena-border);
          border-radius: 9px;
          overflow: hidden;
          min-width: 0;
        }

        .arena-panel-heading {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          padding: 17px 19px;
          border-bottom: 1px solid #242429;
        }

        .arena-section-title {
          font-family: 'Orbitron',sans-serif;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 1.1px;
        }

        .arena-section-subtitle {
          color: #71717a;
          font-family: monospace;
          font-size: 9px;
          margin-top: 5px;
          letter-spacing: 1px;
        }

        .arena-map-status {
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--arena-green);
          font-family: monospace;
          font-size: 10px;
        }

        .arena-map-viewport {
          min-height: 400px;
          height: 420px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background:
            radial-gradient(ellipse at center,rgba(249,115,22,.09),transparent 52%),
            linear-gradient(180deg,#0b0d11,#09090b);
        }

        .arena-map-viewport::before,
        .arena-map-viewport::after {
          content: '';
          position: absolute;
          width: 330px;
          height: 330px;
          border: 1px solid rgba(249,115,22,.11);
          border-radius: 50%;
        }

        .arena-map-viewport::after {
          width: 260px;
          height: 260px;
          border-style: dashed;
          animation: arena-spin 45s linear infinite;
        }

        @keyframes arena-spin {
          to { transform: rotate(360deg); }
        }

        .arena-radar {
          position: absolute;
          width: 380px;
          height: 380px;
          border-radius: 50%;
          border: 1px solid rgba(249,115,22,.08);
          box-shadow:
            0 0 0 32px rgba(249,115,22,.018),
            0 0 0 64px rgba(249,115,22,.018),
            0 0 0 96px rgba(249,115,22,.012);
        }

        .arena-globe {
          width: min(82%,380px);
          aspect-ratio: 1;
          position: relative;
          border-radius: 50%;
          overflow: hidden;
          border: 1px solid rgba(249,115,22,.32);
          background:
            radial-gradient(circle at 34% 30%,rgba(249,115,22,.13),transparent 44%),
            radial-gradient(circle at 50% 50%,#171411,#09090b 70%);
          box-shadow:
            inset -30px -10px 70px rgba(0,0,0,.95),
            inset 8px 0 35px rgba(249,115,22,.12),
            0 0 40px rgba(249,115,22,.09);
          z-index: 2;
        }

        .arena-globe::before {
          content: '';
          position: absolute;
          inset: -10%;
          border-radius: 50%;
          background:
            repeating-linear-gradient(0deg,transparent 0px,transparent 22px,rgba(249,115,22,.22) 23px,transparent 24px),
            repeating-linear-gradient(90deg,transparent 0px,transparent 24px,rgba(249,115,22,.17) 25px,transparent 26px);
          transform: perspective(350px) rotateY(-20deg) rotateX(12deg);
          animation: arena-globe-rotate 18s linear infinite;
        }

        .arena-globe::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: linear-gradient(90deg,rgba(0,0,0,.7),transparent 35%,transparent 70%,rgba(0,0,0,.55));
          pointer-events: none;
        }

        @keyframes arena-globe-rotate {
          from { transform: perspective(350px) rotateY(0deg) rotateX(12deg); }
          to { transform: perspective(350px) rotateY(360deg) rotateX(12deg); }
        }

        .arena-globe-latitude {
          position: absolute;
          top: 50%;
          left: 5%;
          width: 90%;
          height: 35%;
          transform: translateY(-50%);
          border: 1px solid rgba(249,115,22,.24);
          border-radius: 50%;
          z-index: 1;
        }

        .arena-globe-latitude.second {
          height: 65%;
        }

        .arena-globe-meridian {
          position: absolute;
          left: 50%;
          top: 2%;
          height: 96%;
          width: 35%;
          transform: translateX(-50%);
          border: 1px solid rgba(249,115,22,.2);
          border-radius: 50%;
          z-index: 1;
        }

        .arena-map-node {
          position: absolute;
          z-index: 4;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: var(--arena-orange);
          border: 2px solid #ffedd5;
          box-shadow: 0 0 14px var(--arena-orange);
          cursor: crosshair;
          transform: translate(-50%,-50%);
        }

        .arena-map-node::after {
          content: '';
          position: absolute;
          inset: -7px;
          border: 1px solid var(--arena-orange);
          border-radius: 50%;
          animation: arena-ping 1.8s infinite;
        }

        .arena-map-node.active {
          background: white;
          box-shadow: 0 0 20px white;
          z-index: 6;
        }

        .arena-map-node-label {
          position: absolute;
          left: 13px;
          top: -4px;
          color: #fdba74;
          font-family: monospace;
          font-size: 9px;
          letter-spacing: 1px;
          white-space: nowrap;
          text-shadow: 0 0 8px #000;
        }

        .arena-map-tooltip {
          position: absolute;
          left: 50%;
          bottom: 20px;
          transform: translateX(-50%);
          z-index: 8;
          width: 220px;
          padding: 12px 15px;
          background: rgba(9,9,11,.96);
          border: 1px solid rgba(249,115,22,.45);
          border-radius: 6px;
          box-shadow: 0 10px 35px #000;
          pointer-events: none;
        }

        .arena-tooltip-name {
          font-size: 14px;
          font-weight: 700;
          color: white;
        }

        .arena-tooltip-count {
          font-family: 'Orbitron',sans-serif;
          font-size: 20px;
          color: var(--arena-orange);
          margin-top: 5px;
        }

        .arena-tooltip-label {
          color: #71717a;
          font-family: monospace;
          font-size: 9px;
          margin-top: 3px;
        }

        .arena-map-coordinates {
          position: absolute;
          top: 15px;
          left: 16px;
          color: #52525b;
          font-family: monospace;
          font-size: 9px;
          line-height: 1.9;
          letter-spacing: 1px;
        }

        .arena-map-bottom-label {
          position: absolute;
          bottom: 16px;
          left: 17px;
          color: #52525b;
          font-family: monospace;
          font-size: 9px;
          letter-spacing: 1px;
        }

        .arena-region-area {
          padding: 17px;
        }

        .arena-region-heading {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 13px;
        }

        .arena-region-grid {
          display: grid;
          grid-template-columns: repeat(3,minmax(0,1fr));
          gap: 9px;
        }

        .arena-region-card {
          min-width: 0;
          background: #111114;
          border: 1px solid #25252a;
          padding: 12px;
          border-radius: 5px;
          transition: border-color .2s ease,background .2s ease;
        }

        .arena-region-card:hover {
          border-color: rgba(249,115,22,.5);
          background: #171310;
        }

        .arena-region-top {
          display: flex;
          align-items: center;
          gap: 7px;
          color: #a1a1aa;
          font-size: 12px;
          font-weight: 600;
        }

        .arena-region-count {
          color: white;
          font-family: 'Orbitron',sans-serif;
          font-size: 17px;
          font-weight: 700;
          margin-top: 8px;
          font-variant-numeric: tabular-nums;
        }

        .arena-region-city {
          color: #52525b;
          font-family: monospace;
          font-size: 9px;
          margin-top: 4px;
        }

        .arena-modes {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .arena-mode-card {
          --mode-color: var(--arena-orange);
          position: relative;
          min-height: 170px;
          overflow: hidden;
          padding: 17px 17px 14px 20px;
          background: linear-gradient(110deg,#111114,#0c0c0e);
          border: 1px solid #242429;
          border-radius: 7px;
          transition: border-color .25s ease,box-shadow .25s ease,transform .25s ease,background .25s ease;
          cursor: pointer;
        }

        .arena-mode-card.blue { --mode-color: var(--arena-blue); }
        .arena-mode-card.purple { --mode-color: var(--arena-purple); }
        .arena-mode-card.green { --mode-color: var(--arena-green); }

        .arena-mode-card::before {
          content: '';
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          width: 3px;
          background: var(--mode-color);
          transform: scaleY(0);
          transform-origin: bottom;
          transition: transform .25s ease;
        }

        .arena-mode-card:hover,
        .arena-mode-card.selected {
          border-color: color-mix(in srgb,var(--mode-color) 50%,transparent);
          box-shadow: 0 0 26px color-mix(in srgb,var(--mode-color) 12%,transparent);
          transform: translateY(-2px);
          background: linear-gradient(110deg,#171719,#101012);
        }

        .arena-mode-card:hover::before,
        .arena-mode-card.selected::before {
          transform: scaleY(1);
        }

        .arena-mode-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 10px;
        }

        .arena-mode-identity {
          display: flex;
          align-items: center;
          gap: 11px;
          min-width: 0;
        }

        .arena-mode-icon {
          width: 39px;
          height: 39px;
          flex-shrink: 0;
          display: grid;
          place-items: center;
          border: 1px solid color-mix(in srgb,var(--mode-color) 40%,transparent);
          border-radius: 6px;
          color: var(--mode-color);
          background: color-mix(in srgb,var(--mode-color) 9%,transparent);
          font-size: 22px;
        }

        .arena-mode-number {
          color: #52525b;
          font-family: monospace;
          font-size: 9px;
          letter-spacing: 1px;
          margin-bottom: 3px;
        }

        .arena-mode-title {
          font-family: 'Orbitron',sans-serif;
          font-size: 13px;
          font-weight: 700;
          color: #f4f4f5;
        }

        .arena-mode-status {
          flex-shrink: 0;
          border: 1px solid color-mix(in srgb,var(--mode-color) 35%,transparent);
          padding: 5px 7px;
          border-radius: 3px;
          color: var(--mode-color);
          background: color-mix(in srgb,var(--mode-color) 8%,transparent);
          font-family: monospace;
          font-size: 8px;
          letter-spacing: .4px;
        }

        .arena-mode-subtitle {
          margin-top: 14px;
          color: var(--mode-color);
          font-family: monospace;
          font-size: 9px;
          letter-spacing: 1.4px;
        }

        .arena-mode-description {
          margin-top: 5px;
          color: #85858f;
          font-size: 14px;
          line-height: 1.4;
          max-width: 390px;
        }

        .arena-mode-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-top: 13px;
          padding-top: 11px;
          border-top: 1px solid #242429;
        }

        .arena-mode-players {
          display: flex;
          align-items: center;
          gap: 7px;
          color: #a1a1aa;
          font-size: 12px;
        }

        .arena-mode-players strong {
          color: #fff;
          font-family: 'Orbitron',sans-serif;
          font-size: 13px;
          font-variant-numeric: tabular-nums;
        }

        .arena-mode-cta {
          color: var(--mode-color);
          font-family: 'Orbitron',sans-serif;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: .8px;
          transition: letter-spacing .2s ease;
        }

        .arena-mode-card:hover .arena-mode-cta {
          letter-spacing: 1.8px;
        }

        .arena-mode-progress {
          height: 2px;
          margin-top: 8px;
          border-radius: 5px;
          overflow: hidden;
          background: #27272a;
        }

        .arena-mode-progress span {
          display: block;
          height: 100%;
          background: var(--mode-color);
          transition: width .6s ease;
          box-shadow: 0 0 8px var(--mode-color);
        }

        .arena-terminal-footer {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          gap: 18px;
          margin-top: 23px;
          min-height: 49px;
          overflow: hidden;
          background: #101012;
          border-top: 1px solid #29292e;
          border-bottom: 1px solid #29292e;
        }

        .arena-ticker-badge {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0 18px;
          height: 49px;
          background: rgba(239,68,68,.08);
          border-right: 1px solid #29292e;
          color: #fb5555;
          font-family: monospace;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 1px;
        }

        .arena-ticker-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #ef4444;
          box-shadow: 0 0 10px #ef4444;
          animation: arena-blink 1s infinite;
        }

        @keyframes arena-blink {
          50% { opacity: .2; }
        }

        .arena-ticker-window {
          overflow: hidden;
          flex: 1;
          min-width: 0;
          display: flex;
        }

        .arena-ticker-track {
          display: flex;
          align-items: center;
          flex-shrink: 0;
          gap: 50px;
          width: max-content;
          animation: arena-marquee 38s linear infinite;
        }

        .arena-ticker-track:hover {
          animation-play-state: paused;
        }

        @keyframes arena-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        .arena-ticker-item {
          color: #a1a1aa;
          font-family: monospace;
          font-size: 10px;
          letter-spacing: .4px;
          white-space: nowrap;
        }

        .arena-ticker-item strong {
          color: var(--arena-orange);
          font-weight: 700;
        }

        .arena-bottom-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
          padding: 15px 2px 5px;
          color: #52525b;
          font-family: monospace;
          font-size: 9px;
          letter-spacing: .8px;
        }

        .arena-bottom-info span {
          color: #a1a1aa;
        }

        @media (max-width: 1050px) {
          .arena-layout {
            grid-template-columns: minmax(0,1fr);
          }

          .arena-modes {
            display: grid;
            grid-template-columns: repeat(2,minmax(0,1fr));
          }

          .arena-mode-card {
            min-height: 180px;
          }
        }

        @media (max-width: 640px) {
          .arena-header {
            padding: 12px 4%;
            gap: 8px;
          }

          .arena-logo {
            width: 39px;
            height: 39px;
            font-size: 17px;
          }

          .arena-brand-name {
            font-size: 12px;
          }

          .arena-node-address {
            font-size: 8px;
          }

          .arena-header-center {
            gap: 7px;
            font-size: 9px;
            letter-spacing: .5px;
          }

          .arena-counter {
            font-size: 17px;
          }

          .arena-header-right {
            display: none;
          }

          .arena-content {
            padding: 24px 4% 15px;
          }

          .arena-heading {
            align-items: flex-start;
            flex-direction: column;
          }

          .arena-environment {
            font-size: 9px;
          }

          .arena-map-viewport {
            height: 350px;
            min-height: 350px;
          }

          .arena-globe {
            width: min(78%,300px);
          }

          .arena-radar {
            width: 300px;
            height: 300px;
          }

          .arena-map-viewport::before {
            width: 280px;
            height: 280px;
          }

          .arena-map-viewport::after {
            width: 220px;
            height: 220px;
          }

          .arena-region-grid {
            grid-template-columns: repeat(2,minmax(0,1fr));
          }

          .arena-modes {
            grid-template-columns: minmax(0,1fr);
          }

          .arena-mode-card {
            min-height: 165px;
          }

          .arena-ticker-badge {
            padding: 0 11px;
            font-size: 9px;
          }

          .arena-bottom-info {
            font-size: 8px;
          }

          .arena-bottom-info span:last-child {
            display: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .arena-page *,
          .arena-page *::before,
          .arena-page *::after {
            animation-duration: .01ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
            transition-duration: .01ms !important;
          }
        }
      `}</style>

      <div className="arena-grid" />

      {/* TOP TERMINAL HEADER */}
      <header className="arena-header">
        <div className="arena-brand">
          <div className="arena-logo">CW</div>

          <div>
            <div className="arena-brand-name">CHARTWARS</div>
            <div className="arena-node-address">
              NODE://LIVE_ROOMS_HUB
            </div>
          </div>
        </div>

        <div className="arena-header-center">
          <span className="arena-live-dot" />
          <span>LIVE TRADERS</span>
          <span className="arena-counter">
            {formatNumber(traders)}
          </span>
        </div>

        <div className="arena-header-right">
          <div className="arena-system-status">
            ● SYSTEM ONLINE
          </div>
          <div className="arena-clock">
            {clock.toLocaleTimeString("en-GB", {
              hour12: false,
            })}
          </div>
        </div>
      </header>

      <div className="arena-content">

        {/* PAGE HEADING */}
        <section className="arena-heading">
          <div>
            <div className="arena-eyebrow">
              // GLOBAL COMPETITIVE NETWORK
            </div>

            <h1 className="arena-title">
              THE <span>ARENA</span> TERMINAL
            </h1>

            <p className="arena-description">
              Find your battlefield. Challenge the market. Dominate the arena.
            </p>
          </div>

          <div className="arena-environment">
            <span>●</span> ENVIRONMENT: PRODUCTION SIMULATION
          </div>
        </section>

        {/* MAIN TWO COLUMN LAYOUT */}
        <section className="arena-layout">

          {/* LEFT: GLOBAL GEO HUD */}
          <div className="arena-panel">

            <div className="arena-panel-heading">
              <div>
                <div className="arena-section-title">
                  GLOBAL NETWORK INTELLIGENCE
                </div>
                <div className="arena-section-subtitle">
                  TACTICAL GEO-HUD / REGION ANALYTICS
                </div>
              </div>

              <div className="arena-map-status">
                <span className="arena-live-dot" />
                NETWORK ACTIVE
              </div>
            </div>

            <div className="arena-map-viewport">

              <div className="arena-map-coordinates">
                GEO: 28.6139° N
                <br />
                LONG: 77.2090° E
                <br />
                NETWORK: GLOBAL
              </div>

              <div className="arena-radar" />

              {/* HOLOGRAPHIC GLOBE */}
              <div className="arena-globe">
                <div className="arena-globe-latitude" />
                <div className="arena-globe-latitude second" />
                <div className="arena-globe-meridian" />
              </div>

              {/* INTERACTIVE COUNTRY NODES */}
              {MAP_NODES.map((node) => (
                <button
                  key={node.code}
                  type="button"
                  aria-label={`View ${node.name} player statistics`}
                  className={`arena-map-node ${
                    hoveredRegion === node.code ? "active" : ""
                  }`}
                  style={{
                    left: `${node.x}%`,
                    top: `${node.y}%`,
                  }}
                  onMouseEnter={() => setHoveredRegion(node.code)}
                  onMouseLeave={() => setHoveredRegion(null)}
                  onFocus={() => setHoveredRegion(node.code)}
                  onBlur={() => setHoveredRegion(null)}
                  onClick={() =>
                    setHoveredRegion(
                      hoveredRegion === node.code ? null : node.code
                    )
                  }
                >
                  <span className="arena-map-node-label">
                    {node.name}
                  </span>
                </button>
              ))}

              {/* COUNTRY MICRO HUD */}
              {currentRegion && (
                <div className="arena-map-tooltip">
                  <div className="arena-tooltip-name">
                    {currentRegion.flag} {currentRegion.name}
                  </div>

                  <div className="arena-tooltip-count">
                    {formatNumber(currentRegion.players)}
                  </div>

                  <div className="arena-tooltip-label">
                    LIVE TRADERS / {currentRegion.city.toUpperCase()}
                  </div>
                </div>
              )}

              <div className="arena-map-bottom-label">
                SATELLITE FEED // SIMULATED GEOLOCATION
              </div>
            </div>

            {/* REGIONAL SHARE STATISTICS */}
            <div className="arena-region-area">
              <div className="arena-region-heading">
                <div className="arena-section-title">
                  REGIONAL DISTRIBUTION
                </div>

                <div className="arena-section-subtitle">
                  LIVE SHARE / 06 NODES
                </div>
              </div>

              <div className="arena-region-grid">
                {regionalStats.map((region) => (
                  <div
                    key={region.code}
                    className="arena-region-card"
                  >
                    <div className="arena-region-top">
                      <span>{region.flag}</span>
                      <span>{region.name}</span>
                    </div>

                    <div className="arena-region-count">
                      {formatNumber(region.players)}
                    </div>

                    <div className="arena-region-city">
                      {region.city.toUpperCase()} / {region.share}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: ARENA MODE STACK */}
          <div>
            <div className="arena-panel-heading">
              <div>
                <div className="arena-section-title">
                  SELECT YOUR BATTLEFIELD
                </div>
                <div className="arena-section-subtitle">
                  FOUR COMPETITIVE ENVIRONMENTS
                </div>
              </div>

              <div className="arena-map-status">
                <span className="arena-live-dot" />
                04 MODES
              </div>
            </div>

            <div className="arena-modes">
              {modeStats.map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  className={`arena-mode-card ${mode.color} ${
                    selectedMode === mode.id ? "selected" : ""
                  }`}
                  onClick={() => handleLaunch(mode)}
                  aria-label={`${mode.cta} ${mode.title}`}
                >
                  <div className="arena-mode-top">
                    <div className="arena-mode-identity">
                      <div className="arena-mode-icon">
                        {mode.icon}
                      </div>

                      <div>
                        <div className="arena-mode-number">
                          MODE / {mode.number}
                        </div>

                        <div className="arena-mode-title">
                          {mode.title}
                        </div>
                      </div>
                    </div>

                    <div className="arena-mode-status">
                      {mode.status}
                    </div>
                  </div>

                  <div className="arena-mode-subtitle">
                    {mode.subtitle}
                  </div>

                  <p className="arena-mode-description">
                    {mode.description}
                  </p>

                  <div className="arena-mode-footer">
                    <div className="arena-mode-players">
                      <span>◉</span>
                      <strong>{formatNumber(mode.players)}</strong>
                      <span>PLAYERS</span>
                    </div>

                    <div className="arena-mode-cta">
                      {mode.cta} &gt;
                    </div>
                  </div>

                  <div className="arena-mode-progress">
                    <span
                      style={{
                        width: `${mode.share * 100}%`,
                      }}
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* INFINITE ACTIVITY TICKER */}
      <footer className="arena-terminal-footer">
        <div className="arena-ticker-badge">
          <span className="arena-ticker-dot" />
          LIVE HUD TICKER
        </div>

        <div className="arena-ticker-window">
          <div className="arena-ticker-track">
            {[...ACTIVITY, ...ACTIVITY].map((activity, index) => (
              <div
                className="arena-ticker-item"
                key={`${index}-${activity}`}
              >
                <strong>
                  {activity.split("]")[0]}]
                </strong>
                {activity.split("]").slice(1).join("]")}
              </div>
            ))}
          </div>
        </div>
      </footer>

      <div className="arena-bottom-info">
        <div>
          CHARTWARS TERMINAL <span>V1.0.0</span>
        </div>

        <div>
          ALL SYSTEMS <span>OPERATIONAL</span>
        </div>

        <div>
          EDUCATIONAL TRADING SIMULATION
        </div>
      </div>
    </main>
  );
}
