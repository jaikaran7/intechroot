import { useCallback, useMemo, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";

const DEFAULT_AVATAR =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAZAstf2l7nurH0FVNijxz28ssbWt9b_s3mJBDdVKO3Ad-qivVdQaKVYGafaBt-1iXCTWZmzHzItdKbydw_5MfjBeKhx__9rGYrrUL6mkdo-QqrsepFWCHu__iaHk39YK5o2bmxeCdSkgQpEhQ-J84diCG9T2s1pZq0230XCaYRsdppWlWFf-cDn43QaEgPoK71rCBm1I7kqSzWCCCUdfGC2T080UYxqnmTFJqSG4FUjAt82x561bF24mYEb_Qm1MPpx-g70tAOjPNn";

function createInitialSettings() {
  return {
    account: {
      name: "Alexander Sterling",
      email: "alex.sterling@intechroot.com",
      jobTitle: "Chief Technology Officer",
      timezone: "Eastern Standard Time (GMT-5)",
      avatar: DEFAULT_AVATAR,
    },
    company: {
      name: "InTechRoot",
      logo: "",
      industry: "IT Consulting & Staffing",
      location: "New York, NY",
      website: "https://intechroot.com",
      departments: ["Engineering", "People Ops", "Finance"],
      timezone: "Eastern Standard Time (GMT-5)",
      currency: "USD - US Dollar",
      brandingColor: "#4059aa",
    },
    billing: {
      plan: "Pro",
      usage: { seats: 48, apiCalls: "1.2M / mo", storage: "120 GB" },
      invoices: [
        { id: "inv_001", date: "2026-03-01", amount: "$499.00", status: "Paid" },
        { id: "inv_002", date: "2026-02-01", amount: "$499.00", status: "Paid" },
        { id: "inv_003", date: "2026-01-01", amount: "$499.00", status: "Paid" },
      ],
    },
    security: {
      twoFA: false,
      sso: {
        google: false,
        microsoft: false,
      },
      roles: [
        { id: "1", name: "Super Admin", members: 2 },
        { id: "2", name: "HR Manager", members: 5 },
        { id: "3", name: "Payroll Reviewer", members: 8 },
      ],
      activityLogs: [
        { id: "a1", message: "Password changed", when: "2026-03-28 14:12 UTC" },
        { id: "a2", message: "API key rotated", when: "2026-03-20 09:45 UTC" },
        { id: "a3", message: "SSO session revoked (Microsoft)", when: "2026-03-15 18:02 UTC" },
      ],
    },
    notifications: {
      systemAlerts: true,
      applications: true,
      payroll: true,
      jobPostings: true,
    },
    integrations: {
      logs: [
        { id: "l1", event: "Workday sync", status: "Success", timestamp: "2026-04-01T10:15:00Z" },
        { id: "l2", event: "Payroll export", status: "Success", timestamp: "2026-04-01T08:00:00Z" },
        { id: "l3", event: "Slack webhook", status: "Failed", timestamp: "2026-03-31T22:40:00Z" },
        { id: "l4", event: "Azure AD directory", status: "Success", timestamp: "2026-03-31T06:30:00Z" },
      ],
    },
  };
}

const TIMEZONE_OPTIONS = [
  "Eastern Standard Time (GMT-5)",
  "Pacific Standard Time (GMT-8)",
  "Central European Time (GMT+1)",
];

const INDUSTRY_OPTIONS = [
  "IT Consulting & Staffing",
  "Software",
  "Healthcare",
  "Finance",
  "Manufacturing",
];

const CURRENCY_OPTIONS = ["USD - US Dollar", "EUR - Euro", "GBP - Pound Sterling"];

export default function Settings() {
  const [settings, setSettings] = useState(createInitialSettings);
  const [activeTab, setActiveTab] = useState("account");

  const handleChange = useCallback((section, field, value) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  }, []);

  const handleSave = useCallback(() => {
    console.log("Saved settings:", settings);
  }, [settings]);

  const setNotification = useCallback(
    (field, value) => handleChange("notifications", field, value),
    [handleChange],
  );

  const tabButtons = useMemo(
    () => [
      { id: "account", label: "Account Profile", icon: "chevron_right" },
      { id: "company", label: "Company Workspace", icon: "corporate_fare" },
      { id: "billing", label: "Billing & Plans", icon: "credit_card" },
      { id: "security", label: "Security & SSO", icon: "verified_user" },
      { id: "notifications", label: "Notifications", icon: "notifications" },
      { id: "integrations", label: "Integration Logs", icon: "hub" },
    ],
    [],
  );

  return (
    <>
      <AdminSidebar />
      <header className="sticky top-0 z-40 w-full bg-white/60 dark:bg-slate-950/60 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between h-16 px-8 ml-64 shadow-sm shadow-slate-200/20">
        <div className="flex items-center flex-1 max-w-xl">
          <div className="relative w-full group">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
            <input
              className="w-full bg-surface-container-low border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-[#4cd7f6]/20 transition-all"
              placeholder="Search settings, users, or help..."
              type="text"
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-lg transition-all">
            <span className="material-symbols-outlined" data-icon="notifications">
              notifications
            </span>
          </button>
          <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-lg transition-all">
            <span className="material-symbols-outlined" data-icon="help_outline">
              help_outline
            </span>
          </button>
          <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>
          <span className="text-sm font-medium text-primary">InTechRoot</span>
        </div>
      </header>
      <main className="ml-64 p-10 max-w-7xl">
        <div className="mb-12">
          <h2 className="text-4xl font-extrabold font-headline tracking-tighter text-primary mb-2">Global Settings</h2>
          <p className="text-on-surface-variant font-medium">
            Manage your enterprise profile, workforce rules, and platform notifications.
          </p>
        </div>
        <div className="grid grid-cols-12 gap-10">
          <div className="col-span-12 md:col-span-3 space-y-4">
            {tabButtons.map((tab) => {
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
                  <span
                    className={
                      isActive
                        ? "font-bold text-sm tracking-tight"
                        : "font-semibold text-sm tracking-tight text-slate-500 group-hover:text-primary"
                    }
                  >
                    {tab.label}
                  </span>
                  <span
                    className={
                      isActive
                        ? "material-symbols-outlined text-sm"
                        : "material-symbols-outlined text-sm text-slate-300 group-hover:text-primary"
                    }
                  >
                    {tab.icon}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="col-span-12 md:col-span-9 space-y-8">
            {activeTab === "account" && (
              <AccountProfile settings={settings} handleChange={handleChange} handleSave={handleSave} />
            )}
            {activeTab === "company" && (
              <CompanyWorkspace settings={settings} handleChange={handleChange} handleSave={handleSave} />
            )}
            {activeTab === "billing" && <BillingPlans settings={settings} handleSave={handleSave} />}
            {activeTab === "security" && (
              <SecuritySSO settings={settings} handleChange={handleChange} handleSave={handleSave} />
            )}
            {activeTab === "notifications" && (
              <Notifications settings={settings} setNotification={setNotification} handleSave={handleSave} />
            )}
            {activeTab === "integrations" && <IntegrationLogs settings={settings} />}

            <section className="border border-error/20 rounded-xl p-8 bg-error-container/10">
              <div className="flex items-center gap-4 mb-4">
                <span className="material-symbols-outlined text-error">warning</span>
                <h3 className="font-headline font-bold text-xl text-error">Danger Zone</h3>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-primary">Deactivate Account</p>
                  <p className="text-xs text-on-surface-variant">
                    Temporarily disable your administrative access. Data will be retained.
                  </p>
                </div>
                <button className="px-5 py-2.5 border border-error text-error text-xs font-bold rounded-lg hover:bg-error hover:text-white transition-all">
                  Deactivate
                </button>
              </div>
            </section>
          </div>
        </div>
      </main>

      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <svg className="absolute top-0 right-0 w-[800px] h-[800px] opacity-[0.03]" viewBox="0 0 100 100">
          <defs>
            <pattern height="10" id="grid" patternUnits="userSpaceOnUse" width="10">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"></path>
            </pattern>
          </defs>
          <rect fill="url(#grid)" height="100" width="100"></rect>
        </svg>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-secondary/5 to-tertiary-fixed-dim/5 blur-[100px]"></div>
      </div>
    </>
  );
}

function AccountProfile({ settings, handleChange, handleSave }) {
  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" });

  const onAvatarPick = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => handleChange("account", "avatar", String(reader.result || ""));
    reader.readAsDataURL(file);
  };

  return (
    <>
      <section className="glass-card rounded-xl p-8 shadow-ambient relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-secondary/10 to-tertiary-fixed-dim/10 blur-2xl -mr-10 -mt-10"></div>
        <div className="flex items-start justify-between mb-8">
          <div>
            <h3 className="font-headline font-bold text-xl text-primary mb-1">Administrator Profile</h3>
            <p className="text-sm text-on-surface-variant">Update your personal details and system-wide avatar.</p>
          </div>
          <button
            type="button"
            className="px-5 py-2.5 bg-primary-container text-white text-xs font-bold rounded-lg hover:-translate-y-0.5 transition-transform shadow-lg"
            onClick={handleSave}
          >
            Save Changes
          </button>
        </div>
        <div className="flex items-center gap-8 mb-10">
          <div className="relative">
            <img
              alt="Large Profile"
              className="w-24 h-24 rounded-xl object-cover ring-4 ring-white shadow-xl"
              data-alt="close-up professional portrait of a business leader with soft studio lighting and clean executive style"
              src={settings.account.avatar || DEFAULT_AVATAR}
            />
            <label className="absolute -bottom-2 -right-2 bg-white p-2 rounded-lg shadow-md border border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer">
              <span className="material-symbols-outlined text-primary text-sm">photo_camera</span>
              <input accept="image/*" className="hidden" type="file" onChange={onAvatarPick} />
            </label>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Full Name</label>
              <input
                className="w-full border-b border-slate-200 focus:border-tertiary-fixed-dim focus:ring-0 px-0 py-2 text-sm font-medium bg-transparent transition-all"
                type="text"
                value={settings.account.name}
                onChange={(e) => handleChange("account", "name", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Email Address</label>
              <input
                className="w-full border-b border-slate-200 focus:border-tertiary-fixed-dim focus:ring-0 px-0 py-2 text-sm font-medium bg-transparent transition-all"
                type="email"
                value={settings.account.email}
                onChange={(e) => handleChange("account", "email", e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Job Title</label>
            <input
              className="w-full border-b border-slate-200 focus:border-tertiary-fixed-dim focus:ring-0 px-0 py-2 text-sm font-medium bg-transparent transition-all"
              type="text"
              value={settings.account.jobTitle}
              onChange={(e) => handleChange("account", "jobTitle", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Timezone</label>
            <select
              className="w-full border-b border-slate-200 focus:border-tertiary-fixed-dim focus:ring-0 px-0 py-2 text-sm font-medium bg-transparent transition-all"
              value={settings.account.timezone}
              onChange={(e) => handleChange("account", "timezone", e.target.value)}
            >
              {TIMEZONE_OPTIONS.map((tz) => (
                <option key={tz} value={tz}>
                  {tz}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Current Password</label>
            <input
              className="w-full border-b border-slate-200 focus:border-tertiary-fixed-dim focus:ring-0 px-0 py-2 text-sm font-medium bg-transparent transition-all"
              type="password"
              autoComplete="current-password"
              value={passwords.current}
              onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">New Password</label>
            <input
              className="w-full border-b border-slate-200 focus:border-tertiary-fixed-dim focus:ring-0 px-0 py-2 text-sm font-medium bg-transparent transition-all"
              type="password"
              autoComplete="new-password"
              value={passwords.next}
              onChange={(e) => setPasswords((p) => ({ ...p, next: e.target.value }))}
            />
          </div>
          <div className="space-y-1.5 col-span-2 md:col-span-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Confirm New Password</label>
            <input
              className="w-full border-b border-slate-200 focus:border-tertiary-fixed-dim focus:ring-0 px-0 py-2 text-sm font-medium bg-transparent transition-all"
              type="password"
              autoComplete="new-password"
              value={passwords.confirm}
              onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))}
            />
          </div>
        </div>
        <div className="flex items-center justify-between group">
          <div>
            <p className="text-sm font-bold text-primary">Two-factor authentication</p>
            <p className="text-xs text-on-surface-variant">Require a second factor when signing in to the admin console.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              checked={settings.security.twoFA}
              className="sr-only peer"
              type="checkbox"
              onChange={(e) => handleChange("security", "twoFA", e.target.checked)}
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
          </label>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-ambient border border-outline-variant/10">
          <div className="flex items-center gap-3 mb-4">
            <span className="material-symbols-outlined text-secondary">palette</span>
            <h4 className="text-sm font-bold">Brand Logo</h4>
          </div>
          <label className="border-2 border-dashed border-slate-100 rounded-lg h-32 flex flex-col items-center justify-center gap-2 hover:border-tertiary-fixed-dim transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-slate-300">upload_file</span>
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Upload SVG/PNG</p>
            <input
              accept="image/*"
              className="hidden"
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => handleChange("company", "logo", String(reader.result || ""));
                reader.readAsDataURL(file);
              }}
            />
          </label>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-ambient border border-outline-variant/10">
          <div className="flex items-center gap-3 mb-4">
            <span className="material-symbols-outlined text-secondary">domain</span>
            <h4 className="text-sm font-bold">Platform URL</h4>
          </div>
          <div className="space-y-4">
            <div className="relative">
              <input
                className="w-full bg-slate-50 border-none rounded-lg text-sm font-medium py-3 pl-3 pr-10"
                type="text"
                value={settings.company.website}
                onChange={(e) => handleChange("company", "website", e.target.value)}
              />
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 text-sm">
                link
              </span>
            </div>
            <p className="text-[10px] text-on-surface-variant leading-relaxed">
              This is your dedicated workspace address. Changing it will log out all active users.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

function CompanyWorkspace({ settings, handleChange, handleSave }) {
  const onLogoPick = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => handleChange("company", "logo", String(reader.result || ""));
    reader.readAsDataURL(file);
  };

  return (
    <section className="glass-card rounded-xl p-8 shadow-ambient relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-secondary/10 to-tertiary-fixed-dim/10 blur-2xl -mr-10 -mt-10"></div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h3 className="font-headline font-bold text-xl text-primary mb-1">Company Workspace</h3>
          <p className="text-sm text-on-surface-variant">Configure core identity, departments, and regional defaults.</p>
        </div>
        <button
          type="button"
          className="px-5 py-2.5 bg-primary-container text-white text-xs font-bold rounded-lg hover:-translate-y-0.5 transition-transform shadow-lg"
          onClick={handleSave}
        >
          Save Changes
        </button>
      </div>
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Company Name</label>
          <input
            className="w-full border-b border-slate-200 focus:border-tertiary-fixed-dim focus:ring-0 px-0 py-2 text-sm font-medium bg-transparent transition-all"
            type="text"
            value={settings.company.name}
            onChange={(e) => handleChange("company", "name", e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Industry</label>
          <select
            className="w-full border-b border-slate-200 focus:border-tertiary-fixed-dim focus:ring-0 px-0 py-2 text-sm font-medium bg-transparent transition-all"
            value={settings.company.industry}
            onChange={(e) => handleChange("company", "industry", e.target.value)}
          >
            {INDUSTRY_OPTIONS.map((ind) => (
              <option key={ind} value={ind}>
                {ind}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Location</label>
          <input
            className="w-full border-b border-slate-200 focus:border-tertiary-fixed-dim focus:ring-0 px-0 py-2 text-sm font-medium bg-transparent transition-all"
            type="text"
            value={settings.company.location}
            onChange={(e) => handleChange("company", "location", e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Website</label>
          <input
            className="w-full border-b border-slate-200 focus:border-tertiary-fixed-dim focus:ring-0 px-0 py-2 text-sm font-medium bg-transparent transition-all"
            type="url"
            value={settings.company.website}
            onChange={(e) => handleChange("company", "website", e.target.value)}
          />
        </div>
        <div className="space-y-1.5 col-span-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Departments (comma separated)</label>
          <input
            className="w-full border-b border-slate-200 focus:border-tertiary-fixed-dim focus:ring-0 px-0 py-2 text-sm font-medium bg-transparent transition-all"
            type="text"
            value={settings.company.departments.join(", ")}
            onChange={(e) =>
              handleChange(
                "company",
                "departments",
                e.target.value
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean),
              )
            }
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Timezone</label>
          <select
            className="w-full border-b border-slate-200 focus:border-tertiary-fixed-dim focus:ring-0 px-0 py-2 text-sm font-medium bg-transparent transition-all"
            value={settings.company.timezone}
            onChange={(e) => handleChange("company", "timezone", e.target.value)}
          >
            {TIMEZONE_OPTIONS.map((tz) => (
              <option key={tz} value={tz}>
                {tz}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Currency</label>
          <select
            className="w-full border-b border-slate-200 focus:border-tertiary-fixed-dim focus:ring-0 px-0 py-2 text-sm font-medium bg-transparent transition-all"
            value={settings.company.currency}
            onChange={(e) => handleChange("company", "currency", e.target.value)}
          >
            {CURRENCY_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5 col-span-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Branding Color</label>
          <input
            className="w-full border-b border-slate-200 focus:border-tertiary-fixed-dim focus:ring-0 px-0 py-2 text-sm font-medium bg-transparent transition-all"
            type="text"
            value={settings.company.brandingColor}
            onChange={(e) => handleChange("company", "brandingColor", e.target.value)}
          />
        </div>
      </div>
      <div className="bg-white rounded-xl p-6 shadow-ambient border border-outline-variant/10">
        <div className="flex items-center gap-3 mb-4">
          <span className="material-symbols-outlined text-secondary">palette</span>
          <h4 className="text-sm font-bold">Company Logo</h4>
        </div>
        <label className="border-2 border-dashed border-slate-100 rounded-lg h-32 flex flex-col items-center justify-center gap-2 hover:border-tertiary-fixed-dim transition-colors cursor-pointer">
          {settings.company.logo ? (
            <img alt="Company logo preview" className="max-h-24 object-contain" src={settings.company.logo} />
          ) : (
            <>
              <span className="material-symbols-outlined text-slate-300">upload_file</span>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Upload SVG/PNG</p>
            </>
          )}
          <input accept="image/*" className="hidden" type="file" onChange={onLogoPick} />
        </label>
      </div>
    </section>
  );
}

function BillingPlans({ settings, handleSave }) {
  const usageEntries = Object.entries(settings.billing.usage || {});

  return (
    <>
      <section className="glass-card rounded-xl p-8 shadow-ambient relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-secondary/10 to-tertiary-fixed-dim/10 blur-2xl -mr-10 -mt-10"></div>
        <div className="flex items-start justify-between mb-8">
          <div>
            <h3 className="font-headline font-bold text-xl text-primary mb-1">Billing & Plans</h3>
            <p className="text-sm text-on-surface-variant">Review your subscription and resource consumption.</p>
          </div>
          <button
            type="button"
            className="px-5 py-2.5 bg-primary-container text-white text-xs font-bold rounded-lg hover:-translate-y-0.5 transition-transform shadow-lg"
            onClick={handleSave}
          >
            Save Changes
          </button>
        </div>
        <div className="bg-primary-container text-white p-6 rounded-xl mb-8 relative overflow-hidden shadow-ambient">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-on-primary-container mb-2">Current plan</p>
              <p className="text-2xl font-headline font-extrabold">{settings.billing.plan}</p>
            </div>
            <button
              type="button"
              className="px-5 py-2.5 bg-white/10 border border-white/20 text-white text-xs font-bold rounded-lg hover:bg-white/20 transition-all"
            >
              Upgrade plan
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          {usageEntries.map(([key, val]) => (
            <div key={key} className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10">
              <p className="text-xs font-semibold text-outline uppercase tracking-wider mb-2">{key}</p>
              <h3 className="text-2xl font-bold text-primary font-headline">{String(val)}</h3>
            </div>
          ))}
        </div>
      </section>
      <div className="bg-surface-container-lowest rounded-xl shadow-ambient border border-outline-variant/10 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low text-on-surface-variant text-[11px] uppercase tracking-widest font-bold">
              <th className="px-6 py-4">Invoice</th>
              <th className="px-4 py-4">Date</th>
              <th className="px-4 py-4">Amount</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-outline-variant/10">
            {settings.billing.invoices.map((inv) => (
              <tr key={inv.id}>
                <td className="px-6 py-4 font-medium text-primary">{inv.id}</td>
                <td className="px-4 py-4 text-on-surface-variant">{inv.date}</td>
                <td className="px-4 py-4">{inv.amount}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-green-100 text-green-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
                    {inv.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function SecuritySSO({ settings, handleChange, handleSave }) {
  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" });

  return (
    <section className="glass-card rounded-xl p-8 shadow-ambient relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-secondary/10 to-tertiary-fixed-dim/10 blur-2xl -mr-10 -mt-10"></div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h3 className="font-headline font-bold text-xl text-primary mb-1">Security & SSO</h3>
          <p className="text-sm text-on-surface-variant">Manage passwords, two-factor authentication, and single sign-on.</p>
        </div>
        <button
          type="button"
          className="px-5 py-2.5 bg-primary-container text-white text-xs font-bold rounded-lg hover:-translate-y-0.5 transition-transform shadow-lg"
          onClick={handleSave}
        >
          Save Changes
        </button>
      </div>
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Current Password</label>
          <input
            className="w-full border-b border-slate-200 focus:border-tertiary-fixed-dim focus:ring-0 px-0 py-2 text-sm font-medium bg-transparent transition-all"
            type="password"
            autoComplete="current-password"
            value={passwords.current}
            onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">New Password</label>
          <input
            className="w-full border-b border-slate-200 focus:border-tertiary-fixed-dim focus:ring-0 px-0 py-2 text-sm font-medium bg-transparent transition-all"
            type="password"
            autoComplete="new-password"
            value={passwords.next}
            onChange={(e) => setPasswords((p) => ({ ...p, next: e.target.value }))}
          />
        </div>
        <div className="space-y-1.5 col-span-2 md:col-span-1">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Confirm New Password</label>
          <input
            className="w-full border-b border-slate-200 focus:border-tertiary-fixed-dim focus:ring-0 px-0 py-2 text-sm font-medium bg-transparent transition-all"
            type="password"
            autoComplete="new-password"
            value={passwords.confirm}
            onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))}
          />
        </div>
      </div>
      <div className="flex items-center justify-between group mb-8">
        <div>
          <p className="text-sm font-bold text-primary">Two-factor authentication</p>
          <p className="text-xs text-on-surface-variant">Protect privileged actions with a second factor.</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            checked={settings.security.twoFA}
            className="sr-only peer"
            type="checkbox"
            onChange={(e) => handleChange("security", "twoFA", e.target.checked)}
          />
          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
        </label>
      </div>
      <div className="space-y-6 mb-10">
        {[
          { key: "google", label: "Google SSO", description: "Allow sign-in with Google Workspace." },
          { key: "microsoft", label: "Microsoft SSO", description: "Allow sign-in with Microsoft Entra ID." },
        ].map((row) => (
          <div key={row.key} className="flex items-center justify-between group">
            <div>
              <p className="text-sm font-bold text-primary">{row.label}</p>
              <p className="text-xs text-on-surface-variant">{row.description}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                checked={settings.security.sso[row.key]}
                className="sr-only peer"
                type="checkbox"
                onChange={(e) =>
                  handleChange("security", "sso", {
                    ...settings.security.sso,
                    [row.key]: e.target.checked,
                  })
                }
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
            </label>
          </div>
        ))}
      </div>
      <section className="bg-surface-container-low rounded-xl p-8 border border-outline-variant/10 mb-8">
        <h3 className="font-headline font-bold text-xl text-primary mb-6">Roles</h3>
        <div className="space-y-4">
          {settings.security.roles.map((role) => (
            <div key={role.id} className="flex items-center justify-between border-b border-slate-200 pb-4 last:border-0 last:pb-0">
              <p className="text-sm font-bold text-primary">{role.name}</p>
              <p className="text-xs text-on-surface-variant">{role.members} members</p>
            </div>
          ))}
        </div>
      </section>
      <section className="bg-surface-container-low rounded-xl p-8 border border-outline-variant/10">
        <h3 className="font-headline font-bold text-xl text-primary mb-6">Activity log</h3>
        <div className="space-y-4">
          {settings.security.activityLogs.map((entry) => (
            <div key={entry.id} className="flex items-center justify-between group">
              <div>
                <p className="text-sm font-bold text-primary">{entry.message}</p>
                <p className="text-xs text-on-surface-variant">{entry.when}</p>
              </div>
              <span className="material-symbols-outlined text-sm text-slate-300">history</span>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}

function Notifications({ settings, setNotification, handleSave }) {
  const rows = [
    {
      key: "systemAlerts",
      title: "System Alerts",
      body: "Receive critical updates about system maintenance and security.",
    },
    {
      key: "applications",
      title: "Applications",
      body: "Notifications for new applications and pipeline changes.",
    },
    {
      key: "payroll",
      title: "Payroll Processing",
      body: "Get notified when a pay cycle is finalized or requires review.",
    },
    {
      key: "jobPostings",
      title: "Job Postings",
      body: "Updates when postings go live or require approval.",
    },
  ];

  return (
    <section className="bg-surface-container-low rounded-xl p-8 border border-outline-variant/10">
      <div className="flex items-start justify-between mb-8">
        <h3 className="font-headline font-bold text-xl text-primary">Notification Preferences</h3>
        <button
          type="button"
          className="px-5 py-2.5 bg-primary-container text-white text-xs font-bold rounded-lg hover:-translate-y-0.5 transition-transform shadow-lg"
          onClick={handleSave}
        >
          Save Changes
        </button>
      </div>
      <div className="space-y-6">
        {rows.map((row) => (
          <div key={row.key} className="flex items-center justify-between group">
            <div>
              <p className="text-sm font-bold text-primary">{row.title}</p>
              <p className="text-xs text-on-surface-variant">{row.body}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                checked={settings.notifications[row.key]}
                className="sr-only peer"
                type="checkbox"
                onChange={(e) => setNotification(row.key, e.target.checked)}
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
            </label>
          </div>
        ))}
      </div>
    </section>
  );
}

function IntegrationLogs({ settings }) {
  const [statusFilter, setStatusFilter] = useState("All");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return settings.integrations.logs.filter((row) => {
      const okStatus = statusFilter === "All" || row.status === statusFilter;
      const okQ =
        !q || row.event.toLowerCase().includes(q) || row.status.toLowerCase().includes(q) || row.timestamp.toLowerCase().includes(q);
      return okStatus && okQ;
    });
  }, [settings.integrations.logs, statusFilter, query]);

  const formatTs = (iso) => {
    try {
      return new Date(iso).toLocaleString();
    } catch {
      return iso;
    }
  };

  return (
    <>
      <section className="glass-card rounded-xl p-8 shadow-ambient relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-secondary/10 to-tertiary-fixed-dim/10 blur-2xl -mr-10 -mt-10"></div>
        <div className="flex items-start justify-between mb-8">
          <div>
            <h3 className="font-headline font-bold text-xl text-primary mb-1">Integration Logs</h3>
            <p className="text-sm text-on-surface-variant">Audit trail of connector events across your workspace.</p>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/10 mb-8 flex flex-wrap items-center gap-4">
          <div className="relative max-w-[400px] w-full">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline" data-icon="search">
              search
            </span>
            <input
              className="w-full bg-surface-container-low border-none rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-1 focus:ring-tertiary-fixed-dim"
              placeholder="Search events..."
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <select
            className="bg-surface-container-low border-none rounded-lg px-4 py-2.5 text-sm text-on-surface-variant focus:ring-1 focus:ring-tertiary-fixed-dim cursor-pointer"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">Status</option>
            <option value="Success">Success</option>
            <option value="Failed">Failed</option>
          </select>
          <button
            type="button"
            className="px-4 py-2.5 text-sm font-semibold text-secondary hover:bg-secondary-fixed/20 rounded-lg transition-colors"
            onClick={() => {
              setStatusFilter("All");
              setQuery("");
            }}
          >
            Clear Filters
          </button>
        </div>
        <div className="bg-surface-container-lowest rounded-xl shadow-[40px_0_40px_rgba(0,6,21,0.04)] border border-outline-variant/10 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant text-[11px] uppercase tracking-widest font-bold">
                <th className="px-6 py-4">Event</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-6 py-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-outline-variant/10">
              {filtered.map((row) => (
                <tr key={row.id}>
                  <td className="px-6 py-4 font-medium text-primary">{row.event}</td>
                  <td className="px-4 py-4">
                    {row.status === "Success" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-green-100 text-green-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
                        {row.status}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-red-100 text-red-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                        {row.status}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-on-surface-variant">{formatTs(row.timestamp)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
