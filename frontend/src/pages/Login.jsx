import { useState } from "react";
import { ArrowRight, Bot, Building2, Eye, Lock, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-10">
      <div className="absolute inset-0 bg-[linear-gradient(115deg,#f8f9ff_0%,#eff4ff_50%,#dce9ff_100%)]" />
      <div className="absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_50%_0%,rgba(70,72,212,0.12),transparent_58%)]" />

      <main className="relative z-10 w-full max-w-[440px]">
        <div className="mb-8 text-center">
          <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white shadow-soft">
            <Building2 size={24} />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-primary">HR Intellect</h1>
          <p className="mt-2 text-sm leading-6 text-on-surface-variant">
            Intelligent human resources management for modern teams.
          </p>
        </div>

        <section className="glass-panel rounded-xl p-6 shadow-soft sm:p-8">
          <div className="mb-8 grid grid-cols-2 border-b border-outline-variant">
            <button className="border-b-2 border-secondary pb-4 text-lg font-bold text-secondary" type="button">
              Login
            </button>
            <Link
              className="pb-4 text-center text-lg font-bold text-on-surface-variant transition hover:text-on-surface"
              to="/signup"
            >
              Signup
            </Link>
          </div>

          {error && (
            <div className="mb-5 rounded-lg border border-error/20 bg-error-container px-4 py-3 text-sm font-semibold text-error">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="field-label" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" size={18} />
                <input
                  className="field-input pl-10"
                  id="email"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  required
                  type="email"
                  value={email}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="field-label" htmlFor="password">
                  Password
                </label>
                <button className="text-xs font-bold text-secondary hover:underline" type="button">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" size={18} />
                <input
                  className="field-input pl-10 pr-11"
                  id="password"
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  type={showPassword ? "text" : "password"}
                  value={password}
                />
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-outline transition hover:text-on-surface"
                  onClick={() => setShowPassword((value) => !value)}
                  type="button"
                >
                  <Eye size={18} />
                </button>
              </div>
            </div>

            <label className="flex cursor-pointer items-center gap-2 text-sm text-on-surface-variant">
              <input className="h-4 w-4 rounded border-outline-variant text-secondary focus:ring-secondary" type="checkbox" />
              Remember me for 30 days
            </label>

            <button className="primary-button w-full py-4" disabled={loading} type="submit">
              {loading ? "Signing in..." : "Sign In"}
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="mt-8 border-t border-outline-variant pt-6">
            <div className="flex gap-4 rounded-xl border border-secondary/20 bg-secondary-container/30 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-white">
                <Bot size={20} />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.12em] text-secondary">AI Powered Access</p>
                <p className="mt-1 text-xs leading-5 text-on-surface-variant">
                  Log in to access personalized HR workflows, leave intelligence, and salary answers.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Login;
