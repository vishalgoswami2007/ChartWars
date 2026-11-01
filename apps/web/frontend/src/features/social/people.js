export const displayName = (u) => u?.name || u?.username || "ChartWars Member";

export const handleOf = (u) => (u?.username ? `@${String(u.username).replace(/^@/, "")}` : "");

export const initialsOf = (u) =>
  displayName(u)
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "U";

// Avatar tabhi image banta hai jab wo URL ho. Warna initials dikhte hain.
export const avatarSrc = (u) =>
  typeof u?.avatar === "string" && /^(https?:|data:|\/)/.test(u.avatar) ? u.avatar : null;