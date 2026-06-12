import { useMemo, useState } from "react";
import { COMPANY_LOGO_SRC } from "../../../constants/companyBrand";
import { useAuthStore } from "../../../store/authStore";

const STATIC_BRAND_LOGO = COMPANY_LOGO_SRC;

function ComingSoonCard({ title, body, icon = "hourglass_empty" }) {
  return (
    <section className="glass-card rounded-xl p-10 shadow-ambient text-center">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-container text-tertiary-fixed">
        <span className="material-symbols-outlined text-3xl">{icon}</span>
      </div>
      <p className="mb-2 text-xs font-black uppercase tracking-[0.25em] text-secondary">Coming Soon</p>
      <h3 className="mb-3 text-2xl font-extrabold text-primary">{title}</h3>
      <p className="mx-auto max-w-xl text-sm leading-6 text-on-surface-variant">{body}</p>
    </section>
  );
}

function Toggle({ checked, disabled, onChange }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 rounded-full transition ${
        checked ? "bg-secondary" : "bg-slate-200"
      } ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
          checked ? "left-5" : "left-0.5"
        }`}
      />
    </button>
  );
}

export default function Settings() {
  const user = useAuthStore((s) => s.user);
  const role = useAuthStore((s) => s.role);
  const displayRole = role === "super_admin" ? "Super Admin" : role === "ADMIN" ? "Admin" : "Admin";
  const [activeTab, setActiveTab] = useState("account");
  const [brandLogo, setBrandLogo] = useState(STATIC_BRAND_LOGO);
  const [profile, setProfile] = useState({
    name: user?.name || "Administrator",
    email: user?.email || "",
    role: displayRole,
    workspace: "InTechRoot",
  });
  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" });
  const [notifications, setNotifications] = useState({
    systemAlerts: true,
    applications: true,
    jobPostings: true,
    doNotDisturb: false,
  });

  const initials = useMemo(
    () =>
      String(profile.name || "Admin")
        .split(" ")
        .map((part) => part[0])
        .filter(Boolean)
        .slice(0, 2)
        .join("")
        .toUpperCase(),
    [profile.name],
  );

  const tabs = [
    { id: "account", label: "Account Profile", icon: "person" },
    { id: "billing", label: "Billing & Plans", icon: "credit_card" },
    { id: "security", label: "Security & SSO", icon: "verified_user" },
    { id: "notifications", label: "Notifications", icon: "notifications" },
    { id: "integrations", label: "Integration Logs", icon: "hub" },
  ];

  function handleLogoPick(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setBrandLogo(String(reader.result || STATIC_BRAND_LOGO));
    reader.readAsDataURL(file);
  }

  function setNotification(key, value) {
    setNotifications((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/60 dark:bg-slate-950/60 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between h-16 px-8 ml-64 shadow-sm shadow-slate-200/20">
        <div className="flex items-center flex-1 max-w-xl">
          <div className="relative w-full group">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
            <input
              className="w-full bg-surface-container-low border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-[#4cd7f6]/20 transition-all"
              placeholder="Search settings..."
              type="text"
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <img alt="Brand logo" className="h-9 w-auto rounded bg-white object-contain" src={brandLogo} />
          <span className="text-sm font-bold text-primary">{profile.workspace}</span>
        </div>
      </header>

      <main className="ml-64 p-10 max-w-7xl">
        <div className="mb-12">
          <h2 className="text-4xl font-extrabold font-headline tracking-tighter text-primary mb-2">Global Settings</h2>
          <p className="text-on-surface-variant font-medium">
            Manage account profile, access, notifications, and future workspace modules.
          </p>
        </div>

        <div className="grid grid-cols-12 gap-10">
          <div className="col-span-12 md:col-span-3 space-y-4">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  className={
                    isActive
                      ? "w-full flex items-center justify-between p-4 rounded-lg bg-primary-container text-white shadow-ambient"
                      : "w-full flex items-center justify-between p-4 rounded-lg hover:bg-surface-container-low transition-colors group"
                  }
                  onClick={() => setActiveTab(tab.id)}
                >
                  <span className={isActive ? "font-bold text-sm tracking-tight" : "font-semibold text-sm tracking-tight text-slate-500 group-hover:text-primary"}>
                    {tab.label}
                  </span>
                  <span className={isActive ? "material-symbols-outlined text-sm" : "material-symbols-outlined text-sm text-slate-300 group-hover:text-primary"}>
                    {tab.icon}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="col-span-12 md:col-span-9 space-y-8">
            {activeTab === "account" && (
              <section className="glass-card rounded-xl p-8 shadow-ambient">
                <div className="mb-8 flex items-start justify-between">
                  <div>
                    <h3 className="font-headline font-bold text-xl text-primary mb-1">Account Profile</h3>
                    <p className="text-sm text-on-surface-variant">Current admin identity from the authenticated session.</p>
                  </div>
                  <span className="rounded-full bg-green-100 px-3 py-1 text-[10px] font-black uppercase text-green-700">Active</span>
                </div>

                <div className="mb-10 flex items-center gap-8">
                  <div className="flex h-24 w-24 items-center justify-center rounded-xl bg-primary-container text-2xl font-black text-white shadow-lg">
                    {initials}
                  </div>
                  <div className="grid flex-1 grid-cols-2 gap-6">
                    <label className="space-y-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Full Name</span>
                      <input
                        className="w-full border-b border-slate-200 bg-transparent px-0 py-2 text-sm font-medium focus:border-tertiary-fixed-dim focus:ring-0"
                        value={profile.name}
                        onChange={(event) => setProfile((prev) => ({ ...prev, name: event.target.value }))}
                      />
                    </label>
                    <label className="space-y-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Email Address</span>
                      <input
                        className="w-full border-b border-slate-200 bg-transparent px-0 py-2 text-sm font-medium focus:border-tertiary-fixed-dim focus:ring-0"
                        type="email"
                        value={profile.email}
                        onChange={(event) => setProfile((prev) => ({ ...prev, email: event.target.value }))}
                      />
                    </label>
                    <label className="space-y-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Role</span>
                      <input
                        className="w-full border-b border-slate-200 bg-transparent px-0 py-2 text-sm font-medium text-slate-500 focus:ring-0"
                        readOnly
                        value={profile.role}
                      />
                    </label>
                    <label className="space-y-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Workspace</span>
                      <input
                        className="w-full border-b border-slate-200 bg-transparent px-0 py-2 text-sm font-medium focus:border-tertiary-fixed-dim focus:ring-0"
                        value={profile.workspace}
                        onChange={(event) => setProfile((prev) => ({ ...prev, workspace: event.target.value }))}
                      />
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="rounded-xl border border-outline-variant/10 bg-white p-6 shadow-ambient">
                    <div className="mb-4 flex items-center gap-3">
                      <span className="material-symbols-outlined text-secondary">palette</span>
                      <h4 className="text-sm font-bold text-primary">Brand Logo</h4>
                    </div>
                    <label className="flex h-36 cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-slate-100 transition-colors hover:border-tertiary-fixed-dim">
                      <img alt="Brand logo preview" className="max-h-20 max-w-[220px] object-contain" src={brandLogo} />
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Upload SVG/PNG</span>
                      <input accept="image/*" className="hidden" type="file" onChange={handleLogoPick} />
                    </label>
                  </div>

                  <div className="rounded-xl border border-outline-variant/10 bg-white p-6 shadow-ambient">
                    <div className="mb-4 flex items-center gap-3">
                      <span className="material-symbols-outlined text-secondary">verified_user</span>
                      <h4 className="text-sm font-bold text-primary">Session Source</h4>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between border-b border-slate-100 pb-2">
                        <span className="text-slate-500">User ID</span>
                        <span className="font-mono text-xs text-primary">{user?.id || "-"}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-2">
                        <span className="text-slate-500">Role</span>
                        <span className="font-bold text-primary">{profile.role}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {activeTab === "billing" && (
              <ComingSoonCard
                title="Billing will be enabled later"
                body="Plan details, invoices, usage, and billing controls are not active in this phase."
                icon="credit_card"
              />
            )}

            {activeTab === "security" && (
              <section className="glass-card rounded-xl p-8 shadow-ambient">
                <div className="mb-8">
                  <h3 className="font-headline font-bold text-xl text-primary mb-1">Security & SSO</h3>
                  <p className="text-sm text-on-surface-variant">Password fields are aligned to the current admin account.</p>
                </div>
                <div className="mb-8 grid grid-cols-2 gap-6">
                  {[
                    ["current", "Current Password", "current-password"],
                    ["next", "New Password", "new-password"],
                    ["confirm", "Confirm New Password", "new-password"],
                  ].map(([key, label, autoComplete]) => (
                    <label key={key} className="space-y-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</span>
                      <input
                        className="w-full border-b border-slate-200 bg-transparent px-0 py-2 text-sm font-medium focus:border-tertiary-fixed-dim focus:ring-0"
                        type="password"
                        autoComplete={autoComplete}
                        value={passwords[key]}
                        onChange={(event) => setPasswords((prev) => ({ ...prev, [key]: event.target.value }))}
                      />
                    </label>
                  ))}
                </div>
                <section className="mb-8 rounded-xl border border-outline-variant/10 bg-surface-container-low p-6">
                  <h4 className="mb-4 text-lg font-bold text-primary">Roles</h4>
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        <th className="py-3">Role</th>
                        <th className="py-3">Current User</th>
                        <th className="py-3">Access</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t border-slate-200 text-sm">
                        <td className="py-4 font-bold text-primary">{profile.role}</td>
                        <td className="py-4 text-on-surface-variant">{profile.email || profile.name}</td>
                        <td className="py-4 text-on-surface-variant">Admin console access</td>
                      </tr>
                    </tbody>
                  </table>
                </section>
                <ComingSoonCard
                  title="Activity log is coming soon"
                  body="Security activity history will be connected after the audit-log backend is introduced."
                  icon="history"
                />
              </section>
            )}

            {activeTab === "notifications" && (
              <section className="rounded-xl border border-outline-variant/10 bg-surface-container-low p-8">
                <div className="mb-8">
                  <h3 className="font-headline font-bold text-xl text-primary">Notification Preferences</h3>
                  <p className="text-sm text-on-surface-variant">Keep active notification controls here. Payroll notifications are disabled for this phase.</p>
                </div>
                <div className="space-y-6">
                  {[
                    ["systemAlerts", "System Alerts", "Receive critical platform updates and maintenance notices.", false],
                    ["applications", "Applications", "Notifications for new applications and pipeline movement.", false],
                    ["jobPostings", "Job Postings", "Updates when postings go live or need attention.", false],
                    ["doNotDisturb", "Do Not Disturb", "Pause non-critical notification prompts.", false],
                    ["payroll", "Payroll Processing", "Coming soon in the payroll phase.", true],
                  ].map(([key, title, body, disabled]) => (
                    <div key={key} className={`flex items-center justify-between ${disabled ? "opacity-50" : ""}`}>
                      <div>
                        <p className="text-sm font-bold text-primary">{title}</p>
                        <p className="text-xs text-on-surface-variant">{body}</p>
                      </div>
                      <Toggle
                        checked={Boolean(notifications[key])}
                        disabled={disabled}
                        onChange={(value) => setNotification(key, value)}
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {activeTab === "integrations" && (
              <ComingSoonCard
                title="Integration logs will be added later"
                body="Connector history, sync events, and integration audit trails are planned for a future phase."
                icon="hub"
              />
            )}
          </div>
        </div>
      </main>
    </>
  );
}
