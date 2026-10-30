import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  HISTORY_DAYS,
  START_BALANCE,
  changePassword,
  clearHistory,
  deleteAccount,
  displayName,
  exportData,
  formatCW,
  resetWallet,
  signOut,
  updateSettings,
  useAccount,
} from "../../features/account/accountStore";
import { Avatar } from "../../features/account/avatars";
import { ConfirmDialog, PageShell, SectionCard, Toggle, btnDanger, btnGhost, btnPrimary, inputClass } from "../../features/account/ui";

const LEGAL = [
  ["Terms of Use", "/termsOfUse"],
  ["Privacy Policy", "/privacyPolicy"],
  ["Cookie settings", "/cookieSetting"],
  ["Accessibility", "/accessibility"],
  ["Help Center", "/helpCenter"],
  ["Contact support", "/contact"],
];

// Backend ke rules jaisa hi, taaki user ko turant batao
function passwordProblem(p) {
  if (p.length < 8) return "Use at least 8 characters.";
  if (!/[a-z]/.test(p)) return "Add a lowercase letter.";
  if (!/[A-Z]/.test(p)) return "Add an uppercase letter.";
  if (!/[0-9]/.test(p)) return "Add a number.";
  if (!/[^a-zA-Z0-9]/.test(p)) return "Add a symbol.";
  return "";
}

function Row({ title, text, children }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 py-3">
      <div className="min-w-0">
        <p className="text-sm font-medium text-zinc-100">{title}</p>
        <p className="mt-0.5 text-xs leading-5 text-zinc-500">{text}</p>
      </div>
      {children}
    </div>
  );
}

function PasswordCard({ hasPassword }) {
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirm: "" });
  const [note, setNote] = useState({ ok: false, text: "" });
  const [busy, setBusy] = useState(false);

  if (!hasPassword) {
    return (
      <SectionCard title="Password">
        <p className="text-xs leading-5 text-zinc-400">
          This account signs in with Google, so there is no password to change. To add one, use Forgot password on the login page.
        </p>
      </SectionCard>
    );
  }

  const change = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
    setNote({ ok: false, text: "" });
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!form.currentPassword) return setNote({ ok: false, text: "Enter your current password." });
    const problem = passwordProblem(form.newPassword);
    if (problem) return setNote({ ok: false, text: problem });
    if (form.newPassword !== form.confirm) return setNote({ ok: false, text: "The new passwords do not match." });

    setBusy(true);
    try {
      await changePassword({ currentPassword: form.currentPassword, newPassword: form.newPassword });
      setForm({ currentPassword: "", newPassword: "", confirm: "" });
      setNote({ ok: true, text: "Password updated. Your other devices were signed out." });
    } catch (err) {
      setNote({ ok: false, text: err.errors?.[0]?.message || err.message });
    }
    setBusy(false);
  };

  return (
    <SectionCard title="Password" description="Changing it signs you out on your other devices.">
      <form onSubmit={submit} noValidate className="space-y-3">
        <div>
          <label htmlFor="pw-current" className="text-xs text-zinc-400">Current password</label>
          <input id="pw-current" name="currentPassword" type="password" value={form.currentPassword} onChange={change} autoComplete="current-password" className={`${inputClass} mt-1`} />
        </div>
        <div>
          <label htmlFor="pw-new" className="text-xs text-zinc-400">New password</label>
          <input id="pw-new" name="newPassword" type="password" value={form.newPassword} onChange={change} autoComplete="new-password" className={`${inputClass} mt-1`} />
        </div>
        <div>
          <label htmlFor="pw-confirm" className="text-xs text-zinc-400">Confirm new password</label>
          <input id="pw-confirm" name="confirm" type="password" value={form.confirm} onChange={change} autoComplete="new-password" className={`${inputClass} mt-1`} />
        </div>
        <p role="status" aria-live="polite" className={`min-h-4 text-xs ${note.ok ? "text-emerald-400" : "text-red-400"}`}>{note.text}</p>
        <button type="submit" disabled={busy} className={btnPrimary}>{busy ? "Updating..." : "Update password"}</button>
      </form>
    </SectionCard>
  );
}

export default function SettingsPage() {
  const navigate = useNavigate();
  const account = useAccount();
  const { profile, settings, wallet } = account;
  const [dialog, setDialog] = useState(null); // reset | history | delete | signout
  const [typed, setTyped] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [busy, setBusy] = useState(false);
  const name = displayName(profile);

  const closeDialog = () => {
    setDialog(null);
    setTyped("");
    setDeletePassword("");
    setDeleteError("");
    setBusy(false);
  };

  const download = () => {
    const url = URL.createObjectURL(new Blob([exportData()], { type: "application/json" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "chartwars-my-data.json";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const confirmDelete = async () => {
    setBusy(true);
    setDeleteError("");
    try {
      await deleteAccount({ password: profile.hasPassword ? deletePassword : undefined });
      navigate("/", { replace: true });
    } catch (err) {
      setDeleteError(err.message);
      setBusy(false);
    }
  };

  return (
    <PageShell eyebrow="Your account" title="Settings & account" description="Password, notifications, privacy, your data, legal pages and support.">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-4">
          <SectionCard title="Account">
            <div className="flex items-center gap-3">
              <Avatar avatar={profile.avatar} name={name} size={48} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white">{name}</p>
                <p className="truncate text-xs text-zinc-500">@{profile.username}</p>
              </div>
              <Link to="/dashboard/profile" className={btnGhost}>Edit profile</Link>
            </div>
            {profile.email && (
              <div className="mt-4 border-t border-white/8 pt-1">
                <Row title="Email" text={profile.email} />
              </div>
            )}
          </SectionCard>

          <PasswordCard hasPassword={profile.hasPassword} />

          <SectionCard title="Notifications" description="Choose what appears in your notification list. Saved on this device.">
            <div className="divide-y divide-white/6">
              <Toggle label="Match results" description="A note whenever a match or level ends." checked={settings.notify.match} onChange={(v) => updateSettings("notify", "match", v)} />
              <Toggle label="Room invitations" description="When a friend invites you to a room." checked={settings.notify.invites} onChange={(v) => updateSettings("notify", "invites", v)} />
              <Toggle label="Tips and product updates" description="Occasional ideas for practising better." checked={settings.notify.tips} onChange={(v) => updateSettings("notify", "tips", v)} />
            </div>
          </SectionCard>

          <SectionCard title="Privacy" description="Saved on this device now. These choices are enforced once friends and leaderboards live on a server.">
            <div className="divide-y divide-white/6">
              <Toggle label="Show my profile to friends" checked={settings.privacy.showProfile} onChange={(v) => updateSettings("privacy", "showProfile", v)} />
              <Toggle label="Appear on leaderboards" checked={settings.privacy.showOnLeaderboard} onChange={(v) => updateSettings("privacy", "showOnLeaderboard", v)} />
              <Toggle label="Let friends invite me to rooms" checked={settings.privacy.allowInvites} onChange={(v) => updateSettings("privacy", "allowInvites", v)} />
            </div>
          </SectionCard>
        </div>

        <div className="space-y-4">
          <SectionCard title="Wallet and data" description="Wallet and match history are stored in this browser for now.">
            <div className="divide-y divide-white/6">
              <Row title="Virtual wallet" text={`Balance ${formatCW(wallet.balance)} CW. Reset to ${formatCW(START_BALANCE)} CW if you want a fresh start.`}>
                <button type="button" onClick={() => setDialog("reset")} className={btnGhost}>Reset wallet</button>
              </Row>
              <Row title="Download my data" text="A JSON file with your profile, stats, history and notifications.">
                <button type="button" onClick={download} className={btnGhost}>Download</button>
              </Row>
              <Row title="Clear match history" text={`Removes the ${HISTORY_DAYS}-day list. Lifetime stats stay.`}>
                <button type="button" onClick={() => setDialog("history")} className={btnGhost}>Clear</button>
              </Row>
            </div>
          </SectionCard>

          <SectionCard title="Legal and support">
            <ul className="grid gap-1 sm:grid-cols-2">
              {LEGAL.map(([label, to]) => (
                <li key={to}>
                  <Link to={to} className="block rounded-lg px-3 py-2.5 text-xs text-zinc-300 transition hover:bg-white/5 hover:text-white focus-visible:bg-white/5 focus-visible:outline-none">{label}</Link>
                </li>
              ))}
            </ul>
          </SectionCard>

          <SectionCard title="Session">
            <Row title="Sign out" text="You will go back to the login page.">
              <button type="button" onClick={() => setDialog("signout")} className={btnGhost}>Sign out</button>
            </Row>
          </SectionCard>

          <SectionCard title="Delete account" description="Permanent. Read this first.">
            <p className="text-xs leading-5 text-zinc-400">
              This deletes your ChartWars account and signs you out everywhere. Your profile and sessions are removed from our server and your data on this device is cleared. Results of matches you played with other people can remain in their history under the name you had then.
            </p>
            <div className="mt-3">
              <button type="button" onClick={() => setDialog("delete")} className={btnDanger}>Delete my account</button>
            </div>
          </SectionCard>
        </div>
      </div>

      {dialog === "reset" && (
        <ConfirmDialog
          title="Reset your wallet?"
          body={`Your balance goes back to ${formatCW(START_BALANCE)} CW. A line is added to the ledger. Your history is not removed.`}
          confirmLabel="Reset wallet"
          onCancel={closeDialog}
          onConfirm={() => {
            resetWallet();
            closeDialog();
          }}
        />
      )}
      {dialog === "history" && (
        <ConfirmDialog
          title="Clear match history?"
          body="This removes the match list. Lifetime stats and the wallet stay as they are."
          confirmLabel="Clear history"
          danger
          onCancel={closeDialog}
          onConfirm={() => {
            clearHistory();
            closeDialog();
          }}
        />
      )}
      {dialog === "signout" && (
        <ConfirmDialog
          title="Sign out?"
          body="You will go back to the login page."
          confirmLabel="Sign out"
          onCancel={closeDialog}
          onConfirm={async () => {
            closeDialog();
            await signOut();
            navigate("/login", { replace: true });
          }}
        />
      )}
      {dialog === "delete" && (
        <ConfirmDialog
          title="Delete your account?"
          body="This cannot be undone. Type DELETE to confirm."
          confirmLabel={busy ? "Deleting..." : "Delete account"}
          danger
          disabled={busy || typed.trim() !== "DELETE" || (profile.hasPassword && !deletePassword)}
          onCancel={closeDialog}
          onConfirm={confirmDelete}
        >
          <input
            value={typed}
            onChange={(event) => setTyped(event.target.value)}
            aria-label="Type DELETE to confirm"
            placeholder="DELETE"
            autoComplete="off"
            className={`${inputClass} mt-3`}
          />
          {profile.hasPassword && (
            <input
              type="password"
              value={deletePassword}
              onChange={(event) => setDeletePassword(event.target.value)}
              aria-label="Your password"
              placeholder="Your password"
              autoComplete="current-password"
              className={`${inputClass} mt-2`}
            />
          )}
          <p role="alert" className="mt-2 min-h-4 text-xs text-red-400">{deleteError}</p>
        </ConfirmDialog>
      )}
    </PageShell>
  );
}