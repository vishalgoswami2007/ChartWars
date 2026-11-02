import { useEffect, useRef, useState } from "react";
import { ImagePlus } from "lucide-react";

import { apiFetch } from "../../pages/auth/AuthProvider";

const SIZE = 256;
const MAX_INPUT = 10 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp"];

// Photo ko beech se square kaat ke 256x256 JPEG banata hai
async function toSquareJpeg(file) {
  let bitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" }); // phone ki photo seedhi rahe
  } catch {
    bitmap = await createImageBitmap(file);
  }

  const side = Math.min(bitmap.width, bitmap.height);
  const canvas = document.createElement("canvas");
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#111214"; // transparent PNG ke peeche
  ctx.fillRect(0, 0, SIZE, SIZE);
  ctx.drawImage(bitmap, (bitmap.width - side) / 2, (bitmap.height - side) / 2, side, side, 0, 0, SIZE, SIZE);
  bitmap.close?.();

  return new Promise((resolve, reject) =>
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Could not process the image"))), "image/jpeg", 0.85)
  );
}

/** Gallery se photo chuno, preview dekho, "Use this photo" dabao. onUploaded na ho to page reload hota hai. */
export default function PhotoUpload({ onUploaded }) {
  const inputRef = useRef(null);
  const [blob, setBlob] = useState(null);
  const [preview, setPreview] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  async function onPick(event) {
    const file = event.target.files?.[0];
    event.target.value = ""; // wahi file dobara chun sake
    if (!file) return;

    setError("");
    if (!ALLOWED.includes(file.type)) {
      setError("Please choose a JPEG, PNG or WebP photo.");
      return;
    }
    if (file.size > MAX_INPUT) {
      setError("That photo is too large. Choose one under 10 MB.");
      return;
    }

    try {
      const out = await toSquareJpeg(file);
      setBlob(out);
      setPreview(URL.createObjectURL(out));
    } catch {
      setError("Could not read that image. Try a different photo.");
    }
  }

  async function upload() {
    if (!blob || busy) return;
    setBusy(true);
    setError("");
    try {
      const res = await apiFetch("/api/v1/avatars/me", {
        method: "PUT",
        headers: { "Content-Type": "image/jpeg" },
        body: blob,
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.message || "Upload failed");
      if (onUploaded) onUploaded(data.avatar);
      else window.location.reload();
    } catch (e) {
      setError(e.message);
      setBusy(false);
    }
  }

  const ghost =
    "rounded-lg border border-white/15 px-4 py-2 text-xs font-medium text-zinc-300 transition hover:border-[#e87524]/50 hover:text-white disabled:opacity-40";

  return (
    <div className="rounded-xl border border-dashed border-white/15 p-4 text-center">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={onPick}
        className="sr-only"
        aria-label="Choose a photo"
      />

      {preview ? (
        <div className="flex flex-col items-center gap-3">
          <img src={preview} alt="Your new avatar" className="h-24 w-24 rounded-xl border border-white/10 object-cover" />
          <div className="flex gap-2">
            <button type="button" disabled={busy} onClick={() => inputRef.current?.click()} className={ghost}>
              Choose another
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={upload}
              className="rounded-lg bg-[#e87524] px-4 py-2 text-xs font-semibold text-black transition hover:bg-[#f28b3f] disabled:opacity-60"
            >
              {busy ? "Uploading..." : "Use this photo"}
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex w-full flex-col items-center gap-2 py-6"
        >
          <ImagePlus size={26} className="text-[#f5a36b]" />
          <span className="text-sm font-medium text-white">Choose a photo from your gallery</span>
          <span className="text-xs text-zinc-500">JPEG, PNG or WebP. It is cropped to a square.</span>
        </button>
      )}

      {error && (
        <p role="alert" className="mt-3 text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}