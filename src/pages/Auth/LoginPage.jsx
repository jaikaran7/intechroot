import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { authService } from "../../services/auth.service";
import { useAuthStore } from "../../store/authStore";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { accessToken, user, employee } = await authService.login(email, password);
      const resolvedEmployeeId = employee?.id ?? user?.employeeId ?? user?.id ?? null;

      if (user.role === "admin" || user.role === "super_admin") {
        setAuth({ user, role: user.role, accessToken });
        const from = location.state?.from?.pathname;
        navigate(from && from.startsWith("/admin") ? from : "/admin", { replace: true });

      } else if (user.role === "employee") {
        setAuth({ user, role: user.role, accessToken, employeeId: resolvedEmployeeId });
        navigate("/employee/dashboard", { replace: true });

      } else {
        setError("You do not have access to this portal.");
      }
    } catch (err) {
      setError(err.response?.data?.error?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-surface font-body text-on-surface flex flex-col min-h-screen selection:bg-tertiary-fixed selection:text-on-tertiary-fixed">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-[#f7f9fc]/60 backdrop-blur-xl shadow-[0_40px_40px_0_rgba(0,6,21,0.04)]">
        <nav className="flex justify-between items-center px-8 h-20 w-full">
          <div className="flex items-center gap-12">
            <Link to="/" className="text-2xl font-extrabold tracking-tighter text-[#000615] font-headline">
              InTechRoot
            </Link>
            <div className="hidden md:flex gap-8">
              <Link to="/careers" className="font-headline font-bold tracking-tight text-[#7587a7] hover:opacity-80 transition-opacity">Careers</Link>
              <Link to="/services" className="font-headline font-bold tracking-tight text-[#7587a7] hover:opacity-80 transition-opacity">Solutions</Link>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <button className="hover:translate-y-[-1px] transition-transform duration-300">
              <span className="material-symbols-outlined text-[#0b1f3a]">help</span>
            </button>
            <button className="hover:translate-y-[-1px] transition-transform duration-300">
              <span className="material-symbols-outlined text-[#0b1f3a]">language</span>
            </button>
          </div>
        </nav>
      </header>

      {/* Main */}
      <main className="flex-grow flex items-center justify-center pt-24 pb-12 relative overflow-hidden bg-primary">
        {/* Background effects */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "radial-gradient(circle at 2px 2px, rgba(76,215,246,0.05) 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-secondary opacity-10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[400px] h-[400px] bg-[#4cd7f6] opacity-10 rounded-full blur-[100px]" />

        <div className="relative z-10 w-full max-w-[1200px] px-8 grid md:grid-cols-2 gap-16 items-center">
          {/* Left hero */}
          <div className="hidden md:block">
            <h1 className="font-headline font-extrabold text-6xl text-white tracking-tighter leading-none mb-8">
              Elevate Your{" "}
              <span className="text-[#4cd7f6]">Professional</span> Trajectory.
            </h1>
            <p className="text-[#7587a7] text-lg max-w-md leading-relaxed mb-12">
              Access exclusive opportunities within the world's most innovative technology
              ecosystems. Your next landmark role begins here.
            </p>
            <div className="flex flex-wrap gap-4">
              <div
                className="px-6 py-4 rounded-xl flex items-center gap-4"
                style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(196,198,206,0.15)", backdropFilter: "blur(16px)" }}
              >
                <span className="material-symbols-outlined text-[#4cd7f6]">verified_user</span>
                <span className="text-white text-sm font-medium">Enterprise Security</span>
              </div>
              <div
                className="px-6 py-4 rounded-xl flex items-center gap-4"
                style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(196,198,206,0.15)", backdropFilter: "blur(16px)" }}
              >
                <span className="material-symbols-outlined text-[#4cd7f6]">public</span>
                <span className="text-white text-sm font-medium">Global Network</span>
              </div>
            </div>
          </div>

          {/* Right form panel */}
          <div
            className="p-10 md:p-12 rounded-xl shadow-[0_40px_80px_-20px_rgba(0,0,0,0.4)]"
            style={{ background: "rgba(255,255,255,0.82)", backdropFilter: "blur(16px)", border: "1px solid rgba(196,198,206,0.15)" }}
          >
            <div className="mb-10">
              <h2 className="font-headline text-3xl font-bold text-primary tracking-tight mb-2">
                Welcome Back
              </h2>
              <p className="text-on-surface-variant font-medium">
                Please enter your details to continue.
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="name@company.com"
                  className="w-full bg-surface-container-low border-none border-b-2 border-transparent focus:border-[#4cd7f6] focus:ring-0 transition-all px-0 py-3 text-primary font-medium placeholder:text-outline-variant"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                    Password
                  </label>
                  <a href="#" className="text-xs font-bold text-secondary hover:text-primary transition-colors">
                    Forgot Password?
                  </a>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full bg-surface-container-low border-none border-b-2 border-transparent focus:border-[#4cd7f6] focus:ring-0 transition-all px-0 py-3 text-primary font-medium placeholder:text-outline-variant"
                />
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-container text-on-primary font-bold py-4 rounded-lg hover:translate-y-[-2px] transition-all shadow-lg shadow-primary/10 flex justify-center items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
              >
                {loading ? "Signing in…" : "Sign In to Apply"}
                {!loading && <span className="material-symbols-outlined text-sm">arrow_forward</span>}
              </button>
            </form>

            <div className="relative my-10">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-outline-variant/30" />
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold text-on-surface-variant">
                <span className="px-4 bg-[#f1f3f6]">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                className="flex items-center justify-center gap-3 py-3 border border-outline-variant/30 rounded-lg hover:bg-surface-container transition-colors"
                onClick={() => setError("Google sign-in coming soon")}
              >
                <svg className="w-5 h-5 opacity-80" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="text-sm font-bold text-primary">Google</span>
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-3 py-3 border border-outline-variant/30 rounded-lg hover:bg-surface-container transition-colors"
                onClick={() => setError("LinkedIn sign-in coming soon")}
              >
                <svg className="w-5 h-5 opacity-80" viewBox="0 0 24 24" fill="#0A66C2">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                <span className="text-sm font-bold text-primary">LinkedIn</span>
              </button>
            </div>

            <div className="mt-10 text-center">
              <p className="text-sm text-on-surface-variant font-medium">
                New to InTechRoot?{" "}
                <Link
                  to="/apply"
                  className="text-primary font-bold hover:underline decoration-[#4cd7f6] decoration-2 underline-offset-4 transition-all"
                >
                  Create an Account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#eceef1] w-full py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col gap-2">
            <span className="font-headline font-bold text-[#000615] text-lg">InTechRoot</span>
            <span className="font-body text-sm text-[#7587a7]">© 2024 InTechRoot. All rights reserved.</span>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            {["Privacy Policy", "Terms of Service", "Security", "Global Support"].map((label) => (
              <a
                key={label}
                href="#"
                className="font-body text-sm text-[#7587a7] hover:text-[#4cd7f6] transition-colors"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
