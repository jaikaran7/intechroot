import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { authService } from "../../services/auth.service";
import { useAuthStore } from "../../store/authStore";

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || "/admin";

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { accessToken, user } = await authService.login(email, password);
      if (!["admin", "super_admin"].includes(user.role)) {
        setError("You do not have admin access.");
        setLoading(false);
        return;
      }
      setAuth({ user, role: user.role, accessToken });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.error?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0d14]">
      <div className="w-full max-w-md px-8 py-10 rounded-2xl border border-white/10 bg-white/5 backdrop-blur">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-white tracking-tight">Admin Portal</h1>
          <p className="text-sm text-slate-400 mt-1">InTech Root — Internal Access</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-slate-300 mb-1.5">Email address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full px-4 py-2.5 rounded-lg bg-white/10 border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:border-[#4cd7f6] transition"
              placeholder="admin@intechroot.com"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full px-4 py-2.5 rounded-lg bg-white/10 border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:border-[#4cd7f6] transition"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2.5">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-[#4cd7f6] text-[#0a0d14] font-semibold text-sm hover:bg-[#3bc4e0] transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
