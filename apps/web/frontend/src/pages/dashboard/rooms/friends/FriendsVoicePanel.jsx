import { useCallback, useEffect, useRef, useState } from "react";
import { Mic, MicOff, Video, VideoOff } from "lucide-react";

import { DEMO_MODE, roleLabel } from "./friendsData";

export function Flag({ code, className = "h-6 w-9" }) {
  const lower = String(code || "us").toLowerCase();
  return (
    <img
      src={`https://flagcdn.com/w80/${lower}.png`}
      srcSet={`https://flagcdn.com/w160/${lower}.png 2x`}
      alt=""
      className={`rounded-[3px] object-cover ${className}`}
      onError={(event) => {
        event.currentTarget.style.visibility = "hidden";
      }}
    />
  );
}

/** Your own mic and camera (real). Other players are simulated in demo mode. */
// eslint-disable-next-line react-refresh/only-export-components
export function useLocalMedia() {
  const streamRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [state, setState] = useState({ status: "idle", mic: false, cam: false });

  const publish = useCallback((next) => {
    streamRef.current = next;
    setStream(next ? new MediaStream(next.getTracks()) : null);
  }, []);

  const start = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setState({ status: "unsupported", mic: false, cam: false });
      return;
    }
    setState((s) => ({ ...s, status: "asking" }));
    try {
      const s = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      publish(s);
      setState({ status: "on", mic: true, cam: true });
    } catch {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ audio: true });
        publish(s);
        setState({ status: "on", mic: true, cam: false });
      } catch {
        setState({ status: "denied", mic: false, cam: false });
      }
    }
  }, [publish]);

  const toggleMic = useCallback(() => {
    const s = streamRef.current;
    if (!s) return;
    const next = !s.getAudioTracks().every((t) => t.enabled);
    s.getAudioTracks().forEach((t) => {
      t.enabled = next;
    });
    setState((cur) => ({ ...cur, mic: next }));
  }, []);

  const toggleCam = useCallback(async () => {
    const s = streamRef.current;
    if (!s) return;
    const live = s.getVideoTracks();
    if (live.length > 0) {
      live.forEach((t) => {
        t.stop();
        s.removeTrack(t);
      });
      publish(s);
      setState((cur) => ({ ...cur, cam: false }));
      return;
    }
    try {
      const v = await navigator.mediaDevices.getUserMedia({ video: true });
      v.getVideoTracks().forEach((t) => s.addTrack(t));
      publish(s);
      setState((cur) => ({ ...cur, cam: true }));
    } catch {
      setState((cur) => ({ ...cur, cam: false }));
    }
  }, [publish]);

  // Stop the camera and mic when the page closes.
  
  useEffect(() => () => streamRef.current?.getTracks().forEach((t) => t.stop()), []);

  return { ...state, stream, start, toggleMic, toggleCam };
}

/** Demo only: makes a simulated friend look like they are speaking. */
// eslint-disable-next-line react-refresh/only-export-components
export function useDemoSpeaking(people) {
  const [speakingId, setSpeakingId] = useState(null);
  useEffect(() => {
    if (!DEMO_MODE) return undefined;
    const id = setInterval(() => {
      const pool = people.filter((p) => p.id !== "you" && p.mic);
      setSpeakingId(pool.length > 0 && Math.random() < 0.6 ? pool[Math.floor(Math.random() * pool.length)].id : null);
    }, 1400);
    return () => clearInterval(id);
  }, [people]);
  return speakingId;
}

function MediaButton({ on, onClick, label, Icon, OffIcon }) {
  const Show = on ? Icon : OffIcon;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      aria-label={label}
      title={label}
      className={`flex size-7 items-center justify-center border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 ${
        on ? "border-white/20 text-zinc-200 hover:border-orange-500/60" : "border-red-500/60 bg-red-500/15 text-red-300"
      }`}
    >
      <Show size={14} />
    </button>
  );
}

function Tile({ person, isMe, media, speaking, compact }) {
  const videoRef = useRef(null);
  const camOn = isMe && media.cam;
  const micOn = isMe ? media.mic : person.mic;
  const stream = media.stream;

  useEffect(() => {
    const el = videoRef.current;
    if (el) el.srcObject = camOn ? stream : null;
  }, [camOn, stream]);

  const statusText = {
    idle: "Turn on mic and camera",
    asking: "Waiting for permission...",
    denied: "Blocked: you can listen only. Try again",
    unsupported: "Not supported in this browser",
  }[media.status];

  return (
    <div className={`fr-tile ${speaking ? "is-speaking" : ""} ${compact ? "min-h-28" : "min-h-44"}`}>
      {camOn ? (
        <video ref={videoRef} autoPlay muted playsInline className="absolute inset-0 size-full -scale-x-100 object-cover" />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 pb-6">
          <span className="fr-flag-ring">
            <span className="flex h-9 w-12 items-center justify-center bg-[#0b0b0b]">
              <Flag code={person.country} className="h-6 w-9" />
            </span>
          </span>
          {isMe && media.status !== "on" && (
            <button
              type="button"
              disabled={media.status === "asking"}
              onClick={media.start}
              className="border border-orange-500/60 bg-orange-500/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-orange-300 transition hover:bg-orange-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 disabled:opacity-60"
            >
              {statusText}
            </button>
          )}
          {!isMe && DEMO_MODE && <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-600">Demo player</span>}
        </div>
      )}

      <span className="absolute left-2 top-2 border border-white/10 bg-black/60 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-zinc-300">
        {roleLabel(person)}
      </span>

      <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 bg-black/65 px-2 py-1.5">
        <span className="min-w-0 flex-1 truncate text-xs font-medium text-white">{person.name}</span>
        {isMe && media.status === "on" ? (
          <>
            <MediaButton on={media.mic} onClick={media.toggleMic} label={media.mic ? "Mute microphone" : "Unmute microphone"} Icon={Mic} OffIcon={MicOff} />
            <MediaButton on={media.cam} onClick={media.toggleCam} label={media.cam ? "Turn camera off" : "Turn camera on"} Icon={Video} OffIcon={VideoOff} />
          </>
        ) : (
          <span className={micOn ? "text-zinc-300" : "text-red-400"} role="img" aria-label={micOn ? "Microphone on" : "Microphone off"}>
            {micOn ? <Mic size={14} /> : <MicOff size={14} />}
          </span>
        )}
      </div>
    </div>
  );
}

export default function VoicePanel({ people, players, media, speakingId, compact = false }) {
  const slots = Array.from({ length: players }, (_, i) => people[i] ?? null);
  return (
    <div>
      <div className={`grid gap-2 ${players === 2 ? "grid-cols-2" : "grid-cols-2 lg:grid-cols-4"}`}>
        {slots.map((person, i) =>
          person ? (
            <Tile key={person.id} person={person} isMe={person.id === "you"} media={media} speaking={speakingId === person.id} compact={compact} />
          ) : (
            <div key={`empty-${i}`} className={`fr-tile is-empty flex items-center justify-center ${compact ? "min-h-28" : "min-h-44"}`}>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-600">Waiting for a friend</span>
            </div>
          )
        )}
      </div>
      {DEMO_MODE && (
        <p className="mt-1.5 font-mono text-[10px] text-zinc-600">
          Demo: your mic and camera are real. Other players are simulated until the backend is connected.
        </p>
      )}
    </div>
  );
}