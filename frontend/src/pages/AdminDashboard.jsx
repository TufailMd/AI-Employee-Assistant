import { useEffect, useState } from "react";
import { Users, FileText, CheckCircle, XCircle, Upload } from "lucide-react";
import api from "../api/axios";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalEmployees: 0, pendingLeaves: 0 });
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // File upload states
  const [salaryFile, setSalaryFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [uploadingSalary, setUploadingSalary] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, leavesRes] = await Promise.all([
        api.get("/admin/dashboard"),
        api.get("/admin/leaves/pending")
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
    fetchDashboardData();
  }, []);

  const handleReviewLeave = async (leaveId, status) => {
    try {
      await api.put(`/admin/leaves/${leaveId}/status`, { status });
      fetchDashboardData();
    } catch (error) {
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
        headers: { "Content-Type": "multipart/form-data" }
      });
      alert(`Successfully uploaded! Imported ${data.results.filter(r => r.status === 'imported').length} records.`);
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
        headers: { "Content-Type": "multipart/form-data" }
      });
      alert(`Resume parsed successfully!\nName: ${data.parsed?.name}\nEmail: ${data.parsed?.email}`);
      setResumeFile(null);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to parse resume");
    } finally {
      setUploadingResume(false);
    }
  };

  if (loading) return <div className="flex justify-center p-8">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500">Manage employees, leaves, and HR operations.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Employees</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalEmployees}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-lg flex items-center justify-center">
            <FileText size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Pending Leaves</p>
            <p className="text-2xl font-bold text-gray-900">{stats.pendingLeaves}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Bulk Salary Upload</h2>
          <form onSubmit={handleSalaryUpload} className="space-y-4">
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-3 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> CSV file</p>
                  <p className="text-xs text-gray-500">{salaryFile ? salaryFile.name : "No file chosen"}</p>
                </div>
                <input type="file" className="hidden" accept=".csv" onChange={(e) => setSalaryFile(e.target.files[0])} />
              </label>
            </div>
            <button
              type="submit"
              disabled={!salaryFile || uploadingSalary}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
            >
              {uploadingSalary ? "Processing..." : "Upload Salary Data"}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center justify-between">
            AI Resume Parser <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full font-medium">Powered by AI</span>
          </h2>
          <form onSubmit={handleResumeUpload} className="space-y-4">
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-3 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> PDF Resume</p>
                  <p className="text-xs text-gray-500">{resumeFile ? resumeFile.name : "No file chosen"}</p>
                </div>
                <input type="file" className="hidden" accept=".pdf" onChange={(e) => setResumeFile(e.target.files[0])} />
              </label>
            </div>
            <button
              type="submit"
              disabled={!resumeFile || uploadingResume}
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 disabled:bg-purple-400 transition-colors"
            >
              {uploadingResume ? "Parsing with AI..." : "Parse Resume"}
            </button>
          </form>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="text-lg font-bold text-gray-900">Pending Leave Approvals</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {pendingLeaves.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No pending leave requests.</div>
          ) : (
            pendingLeaves.map((leave) => (
              <div key={leave._id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50 transition-colors">
                <div>
                  <h3 className="font-medium text-gray-900">{leave.employee.name}</h3>
                  <p className="text-sm text-gray-500 mb-1">{leave.employee.email}</p>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="capitalize font-medium text-blue-600">{leave.type} Leave</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-600">
                      {new Date(leave.fromDate).toLocaleDateString()} - {new Date(leave.toDate).toLocaleDateString()}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-600">{leave.days} Days</span>
                  </div>
                  {leave.reason && (
                    <p className="text-sm text-gray-600 mt-2 bg-gray-100 p-2 rounded inline-block max-w-xl">
                      "{leave.reason}"
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3 self-start sm:self-center">
                  <button
                    onClick={() => handleReviewLeave(leave._id, 'approved')}
                    className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 rounded-md transition-colors text-sm font-medium border border-green-200"
                  >
                    <CheckCircle size={16} /> Approve
                  </button>
                  <button
                    onClick={() => handleReviewLeave(leave._id, 'rejected')}
                    className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-md transition-colors text-sm font-medium border border-red-200"
                  >
                    <XCircle size={16} /> Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
