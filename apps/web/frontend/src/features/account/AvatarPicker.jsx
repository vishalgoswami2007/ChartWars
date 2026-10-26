import { useEffect, useState } from "react";
import { ImagePlus, X } from "lucide-react";

import { AVATARS, Avatar } from "./avatars";
import { btnGhost, btnPrimary, card } from "./ui";

const MAX_BYTES = 5 * 1024 * 1024;
const OUTPUT = 256;

/** Reads a photo, crops the centre square and shrinks it so it fits comfortably in browser storage. */
async function photoToAvatar(file) {
  if (!/^image\/(png|jpeg|webp)$/.test(file.type)) throw new Error("Use a PNG, JPG or WebP image.");
  if (file.size > MAX_BYTES) throw new Error("That image is larger than 5 MB.");

  let bitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    throw new Error("That image could not be read. Try another one.");
  }
  const side = Math.min(bitmap.width, bitmap.height);
  const canvas = document.createElement("canvas");
  canvas.width = OUTPUT;
  canvas.height = OUTPUT;
  const context = canvas.getContext("2d");
  context.drawImage(bitmap, (bitmap.width - side) / 2, (bitmap.height - side) / 2, side, side, 0, 0, OUTPUT, OUTPUT);
  bitmap.close?.();
  return { kind: "upload", src: canvas.toDataURL("image/jpeg", 0.85) };
}

export default function AvatarPicker({ current, name, onSave, onClose }) {
  const [tab, setTab] = useState(current?.kind === "upload" ? "photo" : "trading");
  const [picked, setPicked] = useState(current);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const choosePhoto = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      setPicked(await photoToAvatar(file));
    } catch (err) {
      setError(err.message);
    }
    setBusy(false);
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
            <p className="mt-1 text-xs text-zinc-500">Pick a trading avatar, or use a photo from your device.</p>
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
          <div className="mt-4">
            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 px-4 py-8 text-center transition hover:border-[#e87524]/50 focus-within:border-[#e87524]/70">
              <ImagePlus size={22} className="text-[#f59a55]" />
              <span className="text-sm text-zinc-200">{busy ? "Preparing your photo..." : "Choose a photo from your gallery"}</span>
              <span className="text-[11px] text-zinc-500">PNG, JPG or WebP, up to 5 MB. It is cropped to a square and saved on this device.</span>
              <input type="file" accept="image/png,image/jpeg,image/webp" onChange={choosePhoto} disabled={busy} className="sr-only" />
            </label>
            {picked?.kind === "upload" && (
              <button type="button" onClick={() => setPicked({ kind: "preset", id: AVATARS[0].id })} className="mt-3 text-xs text-zinc-400 underline-offset-4 transition hover:text-white hover:underline">
                Remove the photo and use a trading avatar
              </button>
            )}
          </div>
        )}

        <p role="alert" className="mt-3 min-h-4 text-xs text-red-400">{error}</p>

        <div className="mt-2 flex justify-end gap-2">
          <button type="button" onClick={onClose} className={btnGhost}>Cancel</button>
          <button type="button" disabled={busy} onClick={() => onSave(picked)} className={btnPrimary}>Save avatar</button>
        </div>
      </div>
    </div>
  );
}