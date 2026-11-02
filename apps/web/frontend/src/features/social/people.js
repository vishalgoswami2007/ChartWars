import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { AVATARS, Avatar } from "../account/avatars";

export const displayName = (u) => u?.name || u?.username || "ChartWars Member";

export const handleOf = (u) => (u?.username ? `@${String(u.username).replace(/^@/, "")}` : "");

export const initialsOf = (u) =>
  displayName(u)
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "U";

// Preset avatar ek baar SVG image banta hai, phir cache me rehta hai
const presetCache = new Map();

function presetSrc(id) {
  if (!AVATARS.some((a) => a.id === id)) return null;
  if (!presetCache.has(id)) {
    const svg = renderToStaticMarkup(createElement(Avatar, { avatar: { kind: "preset", id }, size: 96 })).replace(
      "<svg",
      '<svg xmlns="http://www.w3.org/2000/svg"'
    );
    presetCache.set(id, `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`);
  }
  return presetCache.get(id);
}

// "preset:crown" ho ya photo ka URL, dono ka image src. Kuch na ho to null (initials dikhte hain).
export function avatarSrc(u) {
  const value = u?.avatar;
  if (typeof value !== "string" || !value) return null;
  if (value.startsWith("preset:")) return presetSrc(value.slice("preset:".length));
  return /^(https?:|data:|\/)/.test(value) ? value : null;
}