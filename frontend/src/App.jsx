import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background text-on-surface">
      {user && <Navbar />}
      <main className={user ? "min-h-screen" : "min-h-screen"}>
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" />} />
          
          <Route element={<ProtectedRoute allowedRoles={["employee", "admin"]} />}>
            <Route path="/employee" element={<EmployeeDashboard />} />
          </Route>
          
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>

          <Route
            path="/"
            element={
              user ? (
                user.role === "admin" ? <Navigate to="/admin" /> : <Navigate to="/employee" />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
