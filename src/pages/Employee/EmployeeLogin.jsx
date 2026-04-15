import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { authService } from "../../services/auth.service";
import { useAuthStore } from "../../store/authStore";

export default function EmployeeLogin() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const loginMutation = useMutation({
    mutationFn: ({ email: e, password: p }) => authService.login(e, p),
    onSuccess: (data) => {
      const resolvedEmployeeId =
        data.employee?.id ?? data.employeeId ?? data.user?.employeeId ?? data.user?.id ?? null;
      setAuth({
        user: data.user,
        role: data.user?.role,
        accessToken: data.accessToken,
        employeeId: resolvedEmployeeId,
      });
      navigate("/employee/dashboard", { replace: true });
    },
    onError: () => {
      setError("Invalid email or password.");
    },
  });

  const onSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password) return;
    loginMutation.mutate({ email: email.trim(), password });
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6 font-body text-on-surface">
      <form
        className="w-full max-w-md bg-surface-container-lowest rounded-xl p-8 border border-outline-variant/15 shadow-[0_40px_40px_rgba(0,6,21,0.04)] space-y-6"
        onSubmit={onSubmit}
      >
        <div>
          <h1 className="text-2xl font-headline font-extrabold text-primary tracking-tight">Employee sign in</h1>
          <p className="text-sm text-on-surface-variant mt-2">Sign in with your employee credentials.</p>
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Email</label>
          <input
            className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-[#4cd7f6]/20"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Password</label>
          <input
            className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-[#4cd7f6]/20"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error ? <p className="text-sm text-error">{error}</p> : null}
        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="w-full px-6 py-3 bg-primary-container text-white font-bold text-sm rounded-lg shadow-md hover:translate-y-[-2px] transition-all disabled:opacity-60"
        >
          {loginMutation.isPending ? "Signing in…" : "Continue"}
        </button>
      </form>
    </div>
  );
}
