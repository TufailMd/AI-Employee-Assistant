import { useEffect, useState } from "react";
import { Calendar, DollarSign, Clock, CheckCircle, XCircle } from "lucide-react";
import api from "../api/axios";
import Chatbot from "../components/Chatbot";

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
    } catch (err) {
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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

  if (loading) return <div className="flex justify-center p-8">Loading...</div>;
  if (error) return <div className="text-red-500 p-8 text-center">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome, {data.user.name}</h1>
        <p className="text-gray-500">{data.user.designation} • {data.user.department}</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
            <Calendar size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Annual Leave</p>
            <p className="text-2xl font-bold text-gray-900">{data.user.leaveBalance.annual}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
            <Calendar size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Sick Leave</p>
            <p className="text-2xl font-bold text-gray-900">{data.user.leaveBalance.sick}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-lg flex items-center justify-center">
            <Calendar size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Casual Leave</p>
            <p className="text-2xl font-bold text-gray-900">{data.user.leaveBalance.casual}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Latest Salary</p>
            <p className="text-2xl font-bold text-gray-900">
              {data.latestSalary ? `${data.latestSalary.currency} ${data.latestSalary.basePay}` : "N/A"}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Apply for Leave</h2>
          <form onSubmit={handleApplyLeave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
              <select
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="annual">Annual Leave</option>
                <option value="sick">Sick Leave</option>
                <option value="casual">Casual Leave</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                <input
                  type="date"
                  required
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                <input
                  type="date"
                  required
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
              <textarea
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                rows="3"
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={applying}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-400"
            >
              {applying ? "Submitting..." : "Submit Application"}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Leave History</h2>
          <div className="space-y-4">
            {data.recentLeaves?.length === 0 ? (
              <p className="text-gray-500 text-sm">No recent leave requests.</p>
            ) : (
              data.recentLeaves?.map((leave) => (
                <div key={leave._id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg bg-gray-50">
                  <div>
                    <p className="font-medium text-gray-900 capitalize">{leave.type} Leave</p>
                    <p className="text-sm text-gray-500">
                      {new Date(leave.fromDate).toLocaleDateString()} - {new Date(leave.toDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {leave.status === 'pending' && <span className="flex items-center gap-1 text-yellow-600 text-sm font-medium"><Clock size={16} /> Pending</span>}
                    {leave.status === 'approved' && <span className="flex items-center gap-1 text-green-600 text-sm font-medium"><CheckCircle size={16} /> Approved</span>}
                    {leave.status === 'rejected' && <span className="flex items-center gap-1 text-red-600 text-sm font-medium"><XCircle size={16} /> Rejected</span>}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <Chatbot />
    </div>
  );
};

export default EmployeeDashboard;
