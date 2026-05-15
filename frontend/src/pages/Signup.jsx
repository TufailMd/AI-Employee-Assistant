import { useState } from "react";
import { ArrowRight, Bot, Building2, Lock, Mail, UserRound } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("employee");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register(name, email, password, role);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to register");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-10">
      <div className="absolute inset-0 bg-[linear-gradient(115deg,#f8f9ff_0%,#eff4ff_50%,#dce9ff_100%)]" />
      <div className="absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_50%_0%,rgba(70,72,212,0.12),transparent_58%)]" />

      <main className="relative z-10 w-full max-w-[460px]">
        <div className="mb-8 text-center">
          <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white shadow-soft">
            <Building2 size={24} />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-primary">HR Intellect</h1>
          <p className="mt-2 text-sm leading-6 text-on-surface-variant">
            Create a secure workspace account for your HR assistant.
          </p>
        </div>

        <section className="glass-panel rounded-xl p-6 shadow-soft sm:p-8">
          <div className="mb-8 grid grid-cols-2 border-b border-outline-variant">
            <Link
              className="pb-4 text-center text-lg font-bold text-on-surface-variant transition hover:text-on-surface"
              to="/login"
            >
              Login
            </Link>
            <button className="border-b-2 border-secondary pb-4 text-lg font-bold text-secondary" type="button">
              Signup
            </button>
          </div>

          {error && (
            <div className="mb-5 rounded-lg border border-error/20 bg-error-container px-4 py-3 text-sm font-semibold text-error">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="field-label" htmlFor="name">
                Full Name
              </label>
              <div className="relative">
                <UserRound className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" size={18} />
                <input
                  className="field-input pl-10"
                  id="name"
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Morgan"
                  required
                  type="text"
                  value={name}
                />
              </div>
            </div>

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
              <label className="field-label" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" size={18} />
                <input
                  className="field-input pl-10"
                  id="password"
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  required
                  type="password"
                  value={password}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="field-label" htmlFor="role">
                Workspace Role
              </label>
              <select className="field-input" id="role" onChange={(e) => setRole(e.target.value)} value={role}>
                <option value="employee">Employee</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button className="primary-button w-full py-4" disabled={loading} type="submit">
              {loading ? "Creating account..." : "Create Account"}
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="mt-8 border-t border-outline-variant pt-6">
            <div className="flex gap-4 rounded-xl border border-secondary/20 bg-secondary-container/30 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-white">
                <Bot size={20} />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.12em] text-secondary">Smart onboarding</p>
                <p className="mt-1 text-xs leading-5 text-on-surface-variant">
                  Your account connects dashboards, leave workflows, payroll context, and AI chat history.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Signup;
