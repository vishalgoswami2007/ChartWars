import { useEffect, useState } from "react";
import { ImagePlus, X } from "lucide-react";

import { AVATARS, Avatar } from "./avatars";
import { btnGhost, btnPrimary, card } from "./ui";

export default function AvatarPicker({ current, name, onSave, onClose }) {
  const [tab, setTab] = useState("trading");
  const [picked, setPicked] = useState(current?.kind === "preset" ? current : { kind: "preset", id: AVATARS[0].id });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const save = async () => {
    setBusy(true);
    setError("");
    try {
      await onSave(picked); // success pe parent picker band kar deta hai
    } catch (err) {
      setError(err.message || "Could not save your avatar. Try again.");
      setBusy(false);
    }
  };

  const tabClass = (active) =>
    `border-b-2 px-1 pb-2 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e87524]/60 ${
      active ? "border-[#e87524] text-white" : "border-transparent text-zinc-500 hover:text-zinc-300"
    }`;

  return (
    <div
      className="fixed inset-0 z-80 flex items-center justify-center bg-black/80 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="avatar-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className={`${card} w-full max-w-lg p-5`}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 id="avatar-title" className="text-base font-semibold text-white">Choose your avatar</h2>
            <p className="mt-1 text-xs text-zinc-500">Pick a trading avatar. Photo upload is coming soon.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded-md p-1.5 text-zinc-500 transition hover:bg-white/5 hover:text-white">
            <X size={16} />
          </button>
        </div>

        <div className="mt-4 flex items-center gap-4 border-b border-white/8 pb-4">
          <Avatar avatar={picked} name={name} size={64} />
          <p className="text-xs leading-5 text-zinc-400">This is how you will look in the header, on your profile and with friends.</p>
        </div>

        <div className="mt-4 flex gap-5" role="tablist">
          <button type="button" role="tab" aria-selected={tab === "trading"} onClick={() => setTab("trading")} className={tabClass(tab === "trading")}>Trading avatars</button>
          <button type="button" role="tab" aria-selected={tab === "photo"} onClick={() => setTab("photo")} className={tabClass(tab === "photo")}>Upload a photo</button>
        </div>

        {tab === "trading" ? (
          <div role="radiogroup" aria-label="Trading avatars" className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-6">
            {AVATARS.map((item) => {
              const active = picked?.kind === "preset" && picked.id === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  aria-label={item.label}
                  title={item.label}
                  onClick={() => setPicked({ kind: "preset", id: item.id })}
                  className={`rounded-xl p-1 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e87524]/70 ${
                    active ? "bg-[#e87524]/20 ring-2 ring-[#e87524]" : "hover:bg-white/5"
                  }`}
                >
                  <Avatar avatar={{ kind: "preset", id: item.id }} size={64} className="w-full" />
                </button>
              );
            })}
          </div>
        ) : (
          <div className="mt-4 flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 px-4 py-8 text-center">
            <ImagePlus size={22} className="text-zinc-500" />
            <span className="text-sm text-zinc-200">Photo upload is coming soon</span>
            <span className="text-[11px] text-zinc-500">For now, pick one of the trading avatars.</span>
          </div>
        )}

        <p role="alert" className="mt-3 min-h-4 text-xs text-red-400">{error}</p>

        <div className="mt-2 flex justify-end gap-2">
          <button type="button" onClick={onClose} className={btnGhost}>Cancel</button>
          <button type="button" disabled={busy} onClick={save} className={btnPrimary}>{busy ? "Saving..." : "Save avatar"}</button>
        </div>
      </div>
    </div>
  );
}