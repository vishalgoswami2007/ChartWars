import { useState } from "react";
import { Link } from "react-router-dom";
import { Camera, Pencil } from "lucide-react";

import { MODE_LABEL, RATING, RESULT_LABEL, TIER, displayName, formatCW, formatPnl, pnlTone, setAvatar, timeAgo, updateProfile, useAccount } from "../../features/account/accountStore";
import { Avatar } from "../../features/account/avatars";
import AvatarPicker from "../../features/account/AvatarPicker";
import { EmptyState, PageShell, SectionCard, btnGhost, btnPrimary, card, inputClass, useNow } from "../../features/account/ui";

const USERNAME_RE = /^[a-z0-9_]{3,20}$/;

function Stat({ label, value, className = "text-white" }) {
  return (
    <div className={`${card} p-3`}>
      <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">{label}</p>
      <p className={`mt-1.5 text-xl font-semibold tabular-nums ${className}`}>{value}</p>
    </div>
  );
}

export default function ProfilePage() {
  const { profile, stats, wallet, history } = useAccount();
  const now = useNow();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ username: "", fullName: "", bio: "" });
  const [errors, setErrors] = useState({});
  const [picker, setPicker] = useState(false);
  const [status, setStatus] = useState("");

  const name = displayName(profile);
  const games = stats.wins + stats.losses + stats.draws;
  const winRate = games > 0 ? `${Math.round((stats.wins / games) * 100)}%` : "—";
  const recent = history.slice(0, 5);

  const startEdit = () => {
    setForm({ username: profile.username, fullName: profile.fullName, bio: profile.bio });
    setErrors({});
    setStatus("");
    setEditing(true);
  };

  const change = (event) => {
    const { name: field, value } = event.target;
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const save = (event) => {
    event.preventDefault();
    const next = {
      username: form.username.trim().toLowerCase(),
      fullName: form.fullName.trim().replace(/\s+/g, " "),
      bio: form.bio.trim(),
    };
    const found = {};
    if (!USERNAME_RE.test(next.username)) found.username = "Use 3 to 20 lowercase letters, numbers or underscores.";
    if (next.fullName && next.fullName.length < 2) found.fullName = "Enter at least 2 characters, or leave it empty.";
    if (next.fullName.length > 40) found.fullName = "Keep your name under 40 characters.";
    if (next.bio.length > 120) found.bio = "Keep your bio under 120 characters.";
    if (Object.keys(found).length > 0) {
      setErrors(found);
      return;
    }
    const saved = updateProfile(next);
    setEditing(false);
    setStatus(saved ? "Profile saved." : "Saved for this session only. Browser storage is blocked or full.");
  };

  const saveAvatar = (avatar) => {
    const saved = setAvatar(avatar);
    setPicker(false);
    setStatus(saved ? "Avatar updated." : "Avatar changed for this session only. Browser storage is blocked or full.");
  };

  return (
    <PageShell eyebrow="Your account" title="Profile" description="How you appear in the header, in rooms and to friends.">
      <p role="status" aria-live="polite" className="min-h-4 text-xs text-emerald-400">{status}</p>

      <div className="grid gap-4 lg:grid-cols-[340px_minmax(0,1fr)]">
        <SectionCard>
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              <Avatar avatar={profile.avatar} name={name} size={112} />
              <button
                type="button"
                onClick={() => setPicker(true)}
                aria-label="Change avatar"
                className="absolute -bottom-2 -right-2 flex size-9 items-center justify-center rounded-full border border-white/15 bg-[#161616] text-[#f59a55] transition hover:border-[#e87524]/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e87524]/70"
              >
                <Camera size={16} />
              </button>
            </div>

            {editing ? (
              <form onSubmit={save} noValidate className="mt-5 w-full space-y-3 text-left">
                <div>
                  <label htmlFor="pf-name" className="text-xs text-zinc-400">Full name (optional)</label>
                  <input id="pf-name" name="fullName" value={form.fullName} onChange={change} maxLength={40} autoComplete="name" className={`${inputClass} mt-1`} aria-invalid={Boolean(errors.fullName)} />
                  <p className="mt-1 min-h-4 text-[11px] text-red-400">{errors.fullName}</p>
                </div>
                <div>
                  <label htmlFor="pf-user" className="text-xs text-zinc-400">Username</label>
                  <input id="pf-user" name="username" value={form.username} onChange={change} maxLength={20} autoComplete="username" spellCheck={false} className={`${inputClass} mt-1`} aria-invalid={Boolean(errors.username)} />
                  <p className="mt-1 min-h-4 text-[11px] text-red-400">{errors.username}</p>
                </div>
                <div>
                  <label htmlFor="pf-bio" className="text-xs text-zinc-400">Short bio</label>
                  <textarea id="pf-bio" name="bio" value={form.bio} onChange={change} maxLength={120} rows={3} className="mt-1 w-full resize-none rounded-lg border border-white/9 bg-[#080808] px-3 py-2 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-[#e87524]/60" placeholder="Swing trader. Learning risk management." aria-invalid={Boolean(errors.bio)} />
                  <p className="mt-1 flex justify-between text-[11px]"><span className="text-red-400">{errors.bio}</span><span className="text-zinc-600">{form.bio.length}/120</span></p>
                </div>
                <div className="flex gap-2">
                  <button type="submit" className={`${btnPrimary} flex-1`}>Save</button>
                  <button type="button" onClick={() => setEditing(false)} className={`${btnGhost} flex-1`}>Cancel</button>
                </div>
                <p className="text-[11px] leading-4 text-zinc-600">Usernames are saved on this device. They will be checked for uniqueness once accounts live on a server.</p>
              </form>
            ) : (
              <>
                <h2 className="mt-5 text-xl font-semibold text-white">{name}</h2>
                <p className="text-sm text-zinc-500">@{profile.username}</p>
                {profile.bio && <p className="mt-3 max-w-xs text-xs leading-5 text-zinc-400">{profile.bio}</p>}
                <div className="mt-4 flex items-center gap-2 text-xs">
                  <span className="rounded-md border border-[#e87524]/40 bg-[#e87524]/10 px-2 py-1 font-medium text-[#f59a55]">{TIER}</span>
                  <span className="text-zinc-400">CW Rating {formatCW(RATING)}</span>
                </div>
                <p className="mt-1 text-[11px] text-zinc-600">Provisional until ranked matches are available.</p>
                <p className="mt-3 text-[11px] text-zinc-600">Member since {new Date(profile.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                <button type="button" onClick={startEdit} className={`${btnGhost} mt-4`}>
                  <Pencil size={13} />
                  Edit profile
                </button>
              </>
            )}
          </div>
        </SectionCard>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            <Stat label="Matches played" value={stats.matches} />
            <Stat label="Win rate" value={winRate} />
            <Stat label="Wins / losses" value={`${stats.wins} / ${stats.losses}`} />
            <Stat label="Net match P&L" value={formatPnl(stats.netPnl)} className={pnlTone(stats.netPnl)} />
            <Stat label="Wallet" value={`${formatCW(wallet.balance)} CW`} />
            <Stat label="Blind levels passed" value={stats.blindPassed} />
          </div>

          <SectionCard title="Recent matches" description="Your last five results. Full list in Match history.">
            {recent.length === 0 ? (
              <EmptyState title="No matches yet" text="Play a match in any room and it will appear here.">
                <Link to="/dashboard/rooms" className={btnPrimary}>Go to rooms</Link>
              </EmptyState>
            ) : (
              <ul className="divide-y divide-white/6">
                {recent.map((m) => (
                  <li key={m.id} className="flex items-center gap-3 py-2.5 text-xs">
                    <span className="w-20 shrink-0 text-[11px] text-zinc-500">{MODE_LABEL[m.mode]}</span>
                    <span className="min-w-0 flex-1 truncate text-zinc-200">{m.title}</span>
                    <span className="text-zinc-500">{RESULT_LABEL[m.result]}</span>
                    <span className={`w-20 text-right tabular-nums ${m.pnl === null ? "text-zinc-600" : pnlTone(m.pnl)}`}>{m.pnl === null ? "—" : formatPnl(m.pnl)}</span>
                    <span className="hidden w-16 text-right text-[11px] text-zinc-600 sm:block">{timeAgo(m.at, now)}</span>
                  </li>
                ))}
              </ul>
            )}
            {recent.length > 0 && <Link to="/dashboard/history" className="mt-3 inline-block text-xs text-[#f59a55] underline-offset-4 hover:underline">View all history</Link>}
          </SectionCard>
        </div>
      </div>

      {picker && <AvatarPicker current={profile.avatar} name={name} onSave={saveAvatar} onClose={() => setPicker(false)} />}
    </PageShell>
  );
}