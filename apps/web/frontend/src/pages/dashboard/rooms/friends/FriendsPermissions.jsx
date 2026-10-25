import { UserX } from "lucide-react";

import { Flag } from "./FriendsVoicePanel";
import { canTrade, isAdmin, roleLabel } from "./friendsData";

function Switch({ checked, disabled, label, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={onChange}
      className={`relative h-5 w-9 shrink-0 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 ${
        checked ? "bg-orange-500" : "bg-zinc-700"
      } ${disabled ? "cursor-not-allowed opacity-40" : ""}`}
    >
      <span className={`absolute top-0.5 size-4 bg-white transition-all ${checked ? "left-4.5" : "left-0.5"}`} />
    </button>
  );
}

export default function PermissionsPanel({ people, meId, onChange, onKick }) {
  const me = people.find((p) => p.id === meId);
  const iAmHost = me?.role === "host";
  const iAmAdmin = me ? isAdmin(me) : false;

  return (
    <div>
      <p className="mb-2 text-[11px] leading-5 text-zinc-500">
        Admins can allow trading and remove members. Only the host can make someone an admin.
      </p>
      <ul className="space-y-2">
        {people.map((p) => {
          const host = p.role === "host";
          const you = p.id === meId;
          return (
            <li key={p.id} className="border border-white/10 bg-black/30 p-2">
              <div className="flex items-center gap-2">
                <Flag code={p.country} className="h-4 w-6" />
                <span className="min-w-0 flex-1 truncate text-xs font-medium text-white">
                  {p.name}
                  {you && <span className="ml-1 text-zinc-500">(you)</span>}
                </span>
                <span className="border border-white/10 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-zinc-400">
                  {roleLabel(p)}
                </span>
                {iAmAdmin && !host && !you && (
                  <button
                    type="button"
                    onClick={() => onKick(p.id)}
                    aria-label={`Remove ${p.name} from the room`}
                    title="Remove from room"
                    className="text-zinc-500 transition hover:text-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
                  >
                    <UserX size={14} />
                  </button>
                )}
              </div>
              <div className="mt-2 flex items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-wider text-zinc-400">
                <label className="flex items-center gap-2">
                  Buy and sell
                  <Switch
                    checked={canTrade(p)}
                    disabled={!iAmAdmin || host || p.perms.admin}
                    label={`Allow ${p.name} to trade`}
                    onChange={() => onChange(p.id, "trade", !p.perms.trade)}
                  />
                </label>
                <label className="flex items-center gap-2">
                  Admin
                  <Switch
                    checked={isAdmin(p)}
                    disabled={!iAmHost || host}
                    label={`Make ${p.name} an admin`}
                    onChange={() => onChange(p.id, "admin", !p.perms.admin)}
                  />
                </label>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}