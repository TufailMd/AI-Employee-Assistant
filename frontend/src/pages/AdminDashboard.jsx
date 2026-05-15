import { useEffect, useMemo, useState } from "react";
import {
  Bot,
  CheckCircle2,
  CircleDollarSign,
  FileText,
  Sparkles,
  UploadCloud,
  Users,
  XCircle,
} from "lucide-react";
import api from "../api/axios";

const formatDate = (date) =>
  date
    ? new Date(date).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      })
    : "Not set";

const initials = (name = "Employee") =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const UploadCard = ({ accept, file, icon: Icon, label, onChange, onSubmit, uploading, helper, buttonText, disabledText }) => (
  <form className="app-card space-y-4 p-6" onSubmit={onSubmit}>
    <div className="flex items-center gap-3">
      <div className="rounded-lg bg-secondary-container p-2 text-secondary">
        <Icon size={22} />
      </div>
      <div>
        <h3 className="text-xl font-black text-primary">{label}</h3>
        <p className="text-sm text-on-surface-variant">{helper}</p>
      </div>
    </div>
    <label className="flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-outline-variant bg-surface-container-low p-6 text-center transition hover:border-secondary hover:bg-white">
      <UploadCloud className="mb-3 text-outline" size={34} />
      <span className="text-sm font-bold text-on-surface">{file ? file.name : "Click to upload"}</span>
      <span className="mt-1 text-xs font-semibold uppercase tracking-[0.08em] text-outline">{accept.replace(".", "").toUpperCase()} file</span>
      <input accept={accept} className="hidden" onChange={onChange} type="file" />
    </label>
    <button className="secondary-button w-full" disabled={!file || uploading} type="submit">
      {uploading ? disabledText : buttonText}
    </button>
  </form>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalEmployees: 0, pendingLeaves: 0 });
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [salaryFile, setSalaryFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [uploadingSalary, setUploadingSalary] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, leavesRes] = await Promise.all([
        api.get("/admin/dashboard"),
        api.get("/admin/leaves/pending"),
      ]);
      setStats(statsRes.data);
      setPendingLeaves(leavesRes.data);
    } catch (error) {
      console.error("Failed to fetch admin data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDashboardData();
  }, []);

  const handleReviewLeave = async (leaveId, status) => {
    try {
      await api.put(`/admin/leaves/${leaveId}/status`, { status });
      fetchDashboardData();
    } catch {
      alert("Failed to update leave status");
    }
  };

  const handleSalaryUpload = async (e) => {
    e.preventDefault();
    if (!salaryFile) return;

    const formData = new FormData();
    formData.append("file", salaryFile);

    setUploadingSalary(true);
    try {
      const { data } = await api.post("/admin/salary/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert(`Successfully uploaded! Imported ${data.results.filter((r) => r.status === "imported").length} records.`);
      setSalaryFile(null);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to upload salary data");
    } finally {
      setUploadingSalary(false);
    }
  };

  const handleResumeUpload = async (e) => {
    e.preventDefault();
    if (!resumeFile) return;

    const formData = new FormData();
    formData.append("file", resumeFile);

    setUploadingResume(true);
    try {
      const { data } = await api.post("/ai/resume", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert(`Resume parsed successfully!\nName: ${data.parsed?.name}\nEmail: ${data.parsed?.email}`);
      setResumeFile(null);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to parse resume");
    } finally {
      setUploadingResume(false);
    }
  };

  const approvalRate = useMemo(() => {
    const total = stats.totalEmployees || 1;
    const pending = stats.pendingLeaves || 0;
    return Math.max(0, Math.round(((total - pending) / total) * 100));
  }, [stats]);

  if (loading) {
    return (
      <div className="lg:ml-72 flex min-h-screen items-center justify-center px-6 pt-20">
        <div className="app-card px-6 py-4 text-sm font-semibold text-on-surface-variant">Loading admin console...</div>
      </div>
    );
  }

  return (
    <div className="lg:ml-72 min-h-screen px-4 pb-24 pt-24 sm:px-6 lg:pb-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-secondary">Admin Dashboard</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-primary sm:text-4xl">People Operations Command</h1>
            <p className="mt-2 text-base text-on-surface-variant">
              Manage employees, leave approvals, salary uploads, and AI-assisted hiring workflows.
            </p>
          </div>
          <button className="secondary-button w-fit" type="button">
            <Sparkles size={18} />
            Generate HR Insight
          </button>
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="app-card flex min-h-40 flex-col justify-between p-6">
            <div className="flex items-start justify-between">
              <span className="rounded-lg bg-primary-container p-2 text-white">
                <Users size={22} />
              </span>
              <span className="text-xs font-bold text-secondary">Live workforce</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-on-surface-variant">Total Employees</p>
              <p className="mt-1 text-4xl font-black text-primary">{stats.totalEmployees}</p>
            </div>
          </div>

          <div className="app-card flex min-h-40 flex-col justify-between p-6">
            <div className="flex items-start justify-between">
              <span className="rounded-lg bg-error-container p-2 text-error">
                <FileText size={22} />
              </span>
              <span className="text-xs font-bold text-error">Requires attention</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-on-surface-variant">Pending Leaves</p>
              <p className="mt-1 text-4xl font-black text-primary">{stats.pendingLeaves}</p>
            </div>
          </div>

          <div className="glass-panel flex min-h-40 flex-col justify-between rounded-xl p-6 shadow-panel">
            <div className="flex items-start justify-between">
              <span className="rounded-lg bg-secondary p-2 text-white">
                <CircleDollarSign size={22} />
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-secondary">
                <Bot size={14} />
                AI Optimized
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold text-on-surface-variant">Workflow Health</p>
              <p className="mt-1 text-4xl font-black text-primary">{approvalRate}%</p>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-black text-primary">Pending Leave Requests</h2>
              <span className="text-sm font-bold text-secondary">{pendingLeaves.length} open</span>
            </div>
            <div className="app-card overflow-hidden">
              <div className="hidden grid-cols-[1.3fr_0.7fr_1fr_1fr] border-b border-outline-variant bg-surface-container-low px-6 py-4 text-xs font-black uppercase tracking-[0.1em] text-on-surface-variant md:grid">
                <span>Employee</span>
                <span>Type</span>
                <span>Duration</span>
                <span className="text-right">Actions</span>
              </div>
              <div className="divide-y divide-outline-variant">
                {pendingLeaves.length === 0 ? (
                  <div className="p-10 text-center">
                    <CheckCircle2 className="mx-auto mb-3 text-emerald-600" size={34} />
                    <p className="font-bold text-primary">No pending leave requests.</p>
                    <p className="mt-1 text-sm text-on-surface-variant">The queue is clear.</p>
                  </div>
                ) : (
                  pendingLeaves.map((leave) => (
                    <div
                      className="grid gap-4 p-5 transition hover:bg-surface-container-low md:grid-cols-[1.3fr_0.7fr_1fr_1fr] md:items-center md:px-6"
                      key={leave._id}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-sm font-black text-white">
                          {initials(leave.employee?.name)}
                        </div>
                        <div>
                          <p className="font-bold text-primary">{leave.employee?.name || "Employee"}</p>
                          <p className="text-sm text-on-surface-variant">{leave.employee?.email}</p>
                        </div>
                      </div>
                      <div>
                        <span className="rounded-full bg-surface-container px-3 py-1 text-xs font-bold capitalize text-on-surface-variant">
                          {leave.type} Leave
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-on-surface">
                          {formatDate(leave.fromDate)} - {formatDate(leave.toDate)}
                        </p>
                        <p className="text-xs font-semibold text-on-surface-variant">{leave.days} days</p>
                        {leave.reason && <p className="mt-2 line-clamp-2 text-sm text-on-surface-variant">"{leave.reason}"</p>}
                      </div>
                      <div className="flex gap-2 md:justify-end">
                        <button
                          className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-700 transition hover:bg-emerald-100"
                          onClick={() => handleReviewLeave(leave._id, "approved")}
                          type="button"
                        >
                          <CheckCircle2 size={16} />
                          Approve
                        </button>
                        <button
                          className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-bold text-red-700 transition hover:bg-red-100"
                          onClick={() => handleReviewLeave(leave._id, "rejected")}
                          type="button"
                        >
                          <XCircle size={16} />
                          Reject
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4 lg:col-span-4">
            <UploadCard
              accept=".csv"
              buttonText="Upload Salary Data"
              disabledText="Processing..."
              file={salaryFile}
              helper="Update payroll with a monthly CSV report."
              icon={CircleDollarSign}
              label="Salary Data"
              onChange={(e) => setSalaryFile(e.target.files[0])}
              onSubmit={handleSalaryUpload}
              uploading={uploadingSalary}
            />
            <UploadCard
              accept=".pdf"
              buttonText="Parse Resume"
              disabledText="Parsing with AI..."
              file={resumeFile}
              helper="Extract candidate facts from a resume PDF."
              icon={Bot}
              label="AI Resume Parser"
              onChange={(e) => setResumeFile(e.target.files[0])}
              onSubmit={handleResumeUpload}
              uploading={uploadingResume}
            />
            <div className="rounded-xl bg-primary-container p-6 text-white shadow-panel">
              <div className="mb-4 flex items-center gap-2 text-secondary-container">
                <Sparkles size={19} />
                <span className="text-xs font-black uppercase tracking-[0.12em]">HR Insight</span>
              </div>
              <p className="text-sm leading-6 text-slate-300">
                Leave requests and payroll updates are now organized in one command surface. Employee CRUD can plug into this panel when the backend endpoints are ready.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
