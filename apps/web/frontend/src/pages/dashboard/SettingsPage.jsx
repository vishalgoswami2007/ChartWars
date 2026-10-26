import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  HISTORY_DAYS,
  START_BALANCE,
  clearHistory,
  deleteAllData,
  displayName,
  exportData,
  formatCW,
  resetWallet,
  updateSettings,
  useAccount,
} from "../../features/account/accountStore";
import { Avatar } from "../../features/account/avatars";
import { ConfirmDialog, PageShell, SectionCard, Toggle, btnDanger, btnGhost, inputClass } from "../../features/account/ui";

const LEGAL = [
  ["Terms of Use", "/termsOfUse"],
  ["Privacy Policy", "/privacyPolicy"],
  ["Cookie settings", "/cookieSetting"],
  ["Accessibility", "/accessibility"],
  ["Help Center", "/helpCenter"],
  ["Contact support", "/contact"],
];

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

export default function SettingsPage() {
  const navigate = useNavigate();
  const account = useAccount();
  const { profile, settings, wallet } = account;
  const [dialog, setDialog] = useState(null); // reset | history | delete | signout
  const [typed, setTyped] = useState("");
  const name = displayName(profile);

  const closeDialog = () => {
    setDialog(null);
    setTyped("");
  };

  const download = () => {
    const url = URL.createObjectURL(new Blob([exportData()], { type: "application/json" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "chartwars-my-data.json";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <PageShell eyebrow="Your account" title="Settings & account" description="Notifications, privacy, your data, legal pages and support.">
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
            <div className="mt-4 border-t border-white/8 pt-1">
              <Row title="Sign in details" text="Email and password sign-in is handled by the login pages. Changing them will be available when accounts are connected to a server." />
            </div>
          </SectionCard>

          <SectionCard title="Notifications" description="Choose what appears in your notification list.">
            <div className="divide-y divide-white/6">
              <Toggle label="Match results" description="A note whenever a match or level ends." checked={settings.notify.match} onChange={(v) => updateSettings("notify", "match", v)} />
              <Toggle label="Room invitations" description="When a friend invites you to a room." checked={settings.notify.invites} onChange={(v) => updateSettings("notify", "invites", v)} />
              <Toggle label="Tips and product updates" description="Occasional ideas for practising better." checked={settings.notify.tips} onChange={(v) => updateSettings("notify", "tips", v)} />
            </div>
          </SectionCard>

          <SectionCard title="Privacy" description="Saved on this device now. These choices are enforced once accounts and friends live on a server.">
            <div className="divide-y divide-white/6">
              <Toggle label="Show my profile to friends" checked={settings.privacy.showProfile} onChange={(v) => updateSettings("privacy", "showProfile", v)} />
              <Toggle label="Appear on leaderboards" checked={settings.privacy.showOnLeaderboard} onChange={(v) => updateSettings("privacy", "showOnLeaderboard", v)} />
              <Toggle label="Let friends invite me to rooms" checked={settings.privacy.allowInvites} onChange={(v) => updateSettings("privacy", "allowInvites", v)} />
            </div>
          </SectionCard>
        </div>

        <div className="space-y-4">
          <SectionCard title="Wallet and data" description="Everything is stored in this browser.">
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
            <Row title="Sign out" text="You will go back to the login page. Your data stays on this device.">
              <button type="button" onClick={() => setDialog("signout")} className={btnGhost}>Sign out</button>
            </Row>
          </SectionCard>

          <SectionCard title="Delete account" description="Permanent. Read this first.">
            <p className="text-xs leading-5 text-zinc-400">
              The button below deletes everything ChartWars stored in this browser: profile, wallet, history, notifications, progress and cookie choices. A server account, once it exists, can only be deleted by a privacy request, which you can send from the Contact page.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" onClick={() => setDialog("delete")} className={btnDanger}>Delete data on this device</button>
              <Link to="/contact" className={btnGhost}>Send a privacy request</Link>
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
          body="You will go back to the login page. Your data stays saved on this device."
          confirmLabel="Sign out"
          onCancel={closeDialog}
          onConfirm={() => navigate("/login")}
        />
      )}
      {dialog === "delete" && (
        <ConfirmDialog
          title="Delete all data on this device?"
          body="This cannot be undone. Type DELETE to confirm."
          confirmLabel="Delete everything"
          danger
          disabled={typed.trim() !== "DELETE"}
          onCancel={closeDialog}
          onConfirm={() => {
            deleteAllData();
            closeDialog();
            navigate("/");
          }}
        >
          <input
            value={typed}
            onChange={(event) => setTyped(event.target.value)}
            aria-label="Type DELETE to confirm"
            placeholder="DELETE"
            autoComplete="off"
            className={`${inputClass} mt-3`}
          />
        </ConfirmDialog>
      )}
    </PageShell>
  );
}