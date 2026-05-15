import { useEffect, useMemo, useState } from "react";
import {
  Banknote,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Download,
  FileText,
  HeartPulse,
  Plane,
  Plus,
  Send,
  Sparkles,
  XCircle,
} from "lucide-react";
import api from "../api/axios";
import Chatbot from "../components/Chatbot";

const formatDate = (date) =>
  date
    ? new Date(date).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Not set";

const statusStyles = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
};

const statusIcons = {
  pending: Clock3,
  approved: CheckCircle2,
  rejected: XCircle,
};

const EmployeeDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [leaveType, setLeaveType] = useState("annual");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reason, setReason] = useState("");
  const [applying, setApplying] = useState(false);

  const fetchDashboard = async () => {
    try {
      const response = await api.get("/employee/dashboard");
      setData(response.data);
    } catch {
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDashboard();
  }, []);

  const handleApplyLeave = async (e) => {
    e.preventDefault();
    setApplying(true);
    try {
      await api.post("/employee/leaves", { type: leaveType, fromDate, toDate, reason });
      fetchDashboard();
      setFromDate("");
      setToDate("");
      setReason("");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to apply for leave");
    } finally {
      setApplying(false);
    }
  };

  const leaveCards = useMemo(() => {
    const balance = data?.user?.leaveBalance || {};
    return [
      { label: "Annual", value: balance.annual ?? 0, icon: Plane, color: "text-secondary", bg: "bg-secondary-container" },
      { label: "Sick", value: balance.sick ?? 0, icon: HeartPulse, color: "text-error", bg: "bg-error-container" },
      { label: "Casual", value: balance.casual ?? 0, icon: CalendarDays, color: "text-sky-700", bg: "bg-tertiary-fixed" },
    ];
  }, [data]);

  if (loading) {
    return (
      <div className="lg:ml-72 flex min-h-screen items-center justify-center px-6 pt-20">
        <div className="app-card px-6 py-4 text-sm font-semibold text-on-surface-variant">Loading workspace...</div>
      </div>
    );
  }

  if (error) {
    return <div className="lg:ml-72 px-6 pt-28 text-center font-semibold text-error">{error}</div>;
  }

  const salary = data.latestSalary;
  const salaryValue = salary ? `${salary.currency} ${salary.netPay ?? salary.basePay}` : "N/A";

  return (
    <div className="lg:ml-72 min-h-screen px-4 pb-24 pt-24 sm:px-6 lg:pb-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-secondary">Employee Dashboard</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-primary sm:text-4xl">
              Good morning, {data.user.name}
            </h1>
            <p className="mt-2 text-base text-on-surface-variant">
              {data.user.designation} / {data.user.department}
            </p>
          </div>
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-surface-container-high px-4 py-2 text-sm font-semibold text-on-surface-variant">
            <span className="h-2 w-2 rounded-full bg-secondary" />
            AI context synced from your HR profile
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-12">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:col-span-8">
            {leaveCards.map((card) => {
              const Icon = card.icon;
              return (
                <div className="app-card flex min-h-40 flex-col justify-between p-6" key={card.label}>
                  <div className="flex items-start justify-between">
                    <span className={`rounded-lg ${card.bg} ${card.color} p-2`}>
                      <Icon size={22} />
                    </span>
                    <span className="text-xs font-bold uppercase tracking-[0.1em] text-outline">Days left</span>
                  </div>
                  <div>
                    <p className="text-4xl font-black text-primary">{card.value}</p>
                    <h3 className="mt-1 text-lg font-bold text-on-surface">{card.label} Leave</h3>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="relative overflow-hidden rounded-xl bg-primary-container p-6 text-white shadow-panel md:col-span-4">
            <div className="relative z-10">
              <h2 className="text-2xl font-black">Quick Actions</h2>
              <p className="mt-2 text-sm text-slate-300">Common HR tasks without digging through menus.</p>
              <div className="mt-6 space-y-3">
                <a className="flex items-center justify-between rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-sm font-bold transition hover:bg-white/20" href="#apply-leave">
                  Apply for Leave
                  <Plus size={18} />
                </a>
                <button className="flex w-full items-center justify-between rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-sm font-bold transition hover:bg-white/20" type="button">
                  Download Paystub
                  <Download size={18} />
                </button>
              </div>
            </div>
            <Sparkles className="absolute -bottom-8 -right-8 text-white/10" size={150} />
          </div>

          <div className="app-card p-6 md:col-span-5">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-black text-primary">Salary Overview</h2>
              <Banknote className="text-secondary" size={24} />
            </div>
            <div className="flex items-center gap-5">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary-container text-secondary">
                <Banknote size={28} />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.12em] text-outline">Latest Pay Stub</p>
                <p className="mt-1 text-3xl font-black text-primary">{salaryValue}</p>
                <p className="text-sm italic text-on-surface-variant">{salary?.payPeriod || "No salary data uploaded yet"}</p>
              </div>
            </div>
            <div className="mt-8 h-2 overflow-hidden rounded-full bg-surface-container">
              <div className="h-full w-3/4 rounded-full bg-secondary" />
            </div>
            <div className="mt-3 flex justify-between text-xs font-bold uppercase tracking-[0.08em] text-outline">
              <span>Base: {salary ? `${salary.currency} ${salary.basePay}` : "N/A"}</span>
              <span>Bonus: {salary ? `${salary.currency} ${salary.bonus || 0}` : "N/A"}</span>
            </div>
          </div>

          <div className="app-card overflow-hidden md:col-span-7">
            <div className="flex items-center justify-between border-b border-outline-variant p-6">
              <h2 className="text-2xl font-black text-primary">Recent Activity</h2>
              <span className="rounded-full bg-surface-container px-3 py-1 text-xs font-bold text-on-surface-variant">Leave</span>
            </div>
            <div className="divide-y divide-outline-variant">
              {data.recentLeaves?.length ? (
                data.recentLeaves.map((leave) => {
                  const Icon = statusIcons[leave.status] || Clock3;
                  return (
                    <div className="flex items-center gap-4 p-5 transition hover:bg-surface-container-low" key={leave._id}>
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-container text-secondary">
                        <Icon size={21} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold capitalize text-on-surface">{leave.type} leave</p>
                        <p className="text-sm text-on-surface-variant">
                          {formatDate(leave.fromDate)} - {formatDate(leave.toDate)}
                        </p>
                      </div>
                      <span className={`rounded-full border px-3 py-1 text-xs font-bold capitalize ${statusStyles[leave.status] || statusStyles.pending}`}>
                        {leave.status}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="p-8 text-center text-sm text-on-surface-variant">No recent leave requests.</div>
              )}
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <div className="app-card p-6 lg:col-span-7" id="apply-leave">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-lg bg-secondary-container p-2 text-secondary">
                <FileText size={22} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-primary">Apply for Leave</h2>
                <p className="text-sm text-on-surface-variant">Submit a request for admin review.</p>
              </div>
            </div>
            <form className="space-y-5" onSubmit={handleApplyLeave}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <label className="field-label" htmlFor="leaveType">Leave Type</label>
                  <select className="field-input" id="leaveType" onChange={(e) => setLeaveType(e.target.value)} value={leaveType}>
                    <option value="annual">Annual Leave</option>
                    <option value="sick">Sick Leave</option>
                    <option value="casual">Casual Leave</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="field-label" htmlFor="fromDate">From Date</label>
                  <input className="field-input" id="fromDate" onChange={(e) => setFromDate(e.target.value)} required type="date" value={fromDate} />
                </div>
                <div className="space-y-2">
                  <label className="field-label" htmlFor="toDate">To Date</label>
                  <input className="field-input" id="toDate" onChange={(e) => setToDate(e.target.value)} required type="date" value={toDate} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="field-label" htmlFor="reason">Reason</label>
                <textarea
                  className="field-input min-h-28 resize-none"
                  id="reason"
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Add a short reason for your manager."
                  required
                  value={reason}
                />
              </div>
              <button className="secondary-button w-full sm:w-auto" disabled={applying} type="submit">
                {applying ? "Submitting..." : "Submit Application"}
                <Send size={17} />
              </button>
            </form>
          </div>

          <div className="rounded-xl border border-secondary/20 bg-secondary-container/40 p-6 shadow-panel lg:col-span-5">
            <div className="mb-4 flex items-center gap-2 text-secondary">
              <Sparkles size={20} />
              <span className="text-xs font-black uppercase tracking-[0.14em]">AI Suggestion</span>
            </div>
            <p className="text-lg font-bold leading-7 text-primary">
              Ask the assistant: "How many leaves do I have?" or "Apply annual leave for tomorrow."
            </p>
            <p className="mt-3 text-sm leading-6 text-on-surface-variant">
              The chat uses your employee profile, salary records, and recent leave history as context.
            </p>
          </div>
        </section>
      </div>
      <Chatbot />
    </div>
  );
};

export default EmployeeDashboard;
