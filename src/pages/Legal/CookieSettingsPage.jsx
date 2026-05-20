import { useEffect, useState } from "react";
import LegalPageLayout, { LegalSection } from "../../components/LegalPageLayout";
import { Link } from "react-router-dom";
import { LEGAL_PATHS } from "../../constants/legalRoutes";

const STORAGE_KEY = "intechroot_cookie_prefs";

const DEFAULT_PREFS = { analytics: false };

function loadPrefs() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PREFS };
    return { ...DEFAULT_PREFS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_PREFS };
  }
}

export default function CookieSettingsPage() {
  const [analytics, setAnalytics] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setAnalytics(loadPrefs().analytics);
  }, []);

  function savePrefs(next) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 3000);
  }

  function handleSave() {
    savePrefs({ analytics });
  }

  function acceptAll() {
    setAnalytics(true);
    savePrefs({ analytics: true });
  }

  function essentialOnly() {
    setAnalytics(false);
    savePrefs({ analytics: false });
  }

  return (
    <LegalPageLayout
      title="Cookie Settings"
      intro="Manage how InTechRoot uses cookies and similar technologies on this website. Essential cookies are always active so the site can function."
    >
      <LegalSection title="Essential cookies">
        <p>
          Required for core features such as security, session management, and remembering your cookie choices. These
          cannot be turned off.
        </p>
      </LegalSection>

      <LegalSection title="Analytics cookies">
        <p>
          Help us understand how visitors use the site (for example, which pages are viewed) so we can improve
          performance and content. These are optional.
        </p>
        <label className="flex items-center justify-between gap-4 mt-4 p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 cursor-pointer">
          <span className="font-semibold text-primary">Allow analytics cookies</span>
          <input
            type="checkbox"
            className="h-5 w-5 accent-secondary"
            checked={analytics}
            onChange={(e) => setAnalytics(e.target.checked)}
          />
        </label>
      </LegalSection>

      <LegalSection title="Your choices">
        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-3 rounded-lg bg-primary-container text-white text-sm font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
          >
            Save preferences
          </button>
          <button
            type="button"
            onClick={acceptAll}
            className="px-6 py-3 rounded-lg border border-outline-variant text-primary text-sm font-bold uppercase tracking-wider hover:bg-surface-container-low transition-colors"
          >
            Accept all
          </button>
          <button
            type="button"
            onClick={essentialOnly}
            className="px-6 py-3 rounded-lg border border-outline-variant text-primary text-sm font-bold uppercase tracking-wider hover:bg-surface-container-low transition-colors"
          >
            Essential only
          </button>
        </div>
        {saved ? (
          <p className="text-sm text-secondary font-semibold pt-3" role="status">
            Preferences saved.
          </p>
        ) : null}
      </LegalSection>

      <LegalSection title="More information">
        <p>
          For details on how we handle personal data, see our{" "}
          <Link className="text-secondary hover:underline" to={LEGAL_PATHS.privacy}>
            Privacy Policy
          </Link>
          .
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
