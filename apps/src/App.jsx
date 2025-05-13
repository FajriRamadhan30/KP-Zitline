import { useState, useEffect } from "react";
import IPList from "./components/IPList";
import IPForm from "./components/IPForm";
import IPLogs from "./components/IPLogs";
import SubnetForm from "./components/SubnetForm";
import VlanVrfManager from "./components/VlanVrfManager";
import Dashboard from "./components/Dashboard";
import AdminLogin from "./components/AdminLogin";
import ProfileAdmin from "./components/ProfileAdmin"; // Import Profil Admin
import "./App.css";
import UserManagement from "./components/UserManagement";

function App() {
  // State untuk halaman aktif dan login status
  const [view, setView] = useState("Dashboard");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Menggunakan useEffect untuk memeriksa status login dari localStorage
  useEffect(() => {
    const loggedInStatus = localStorage.getItem("isLoggedIn");
    if (loggedInStatus === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  // Fungsi login untuk mengatur status login
  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", "true"); // Menyimpan status login
  };

  // Fungsi logout untuk menghapus status login
  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn"); // Hapus status login
  };

  // Jika belum login, tampilkan halaman login
  if (!isLoggedIn) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <div className="app-container">
      {/* Sidebar */}
      <nav className="sidebar">
        <div>
          <h2 className="sidebar-title">Zitline IP</h2>
          <ul className="sidebar-menu">
            <li className={view === "Dashboard" ? "active" : ""} onClick={() => setView("Dashboard")}>
              📊 Dashboard
            </li>
            <li className={view === "users" ? "active" : ""} onClick={() => setView("users")}>
              👥 Manajemen User
            </li>
            <li className={view === "list" ? "active" : ""} onClick={() => setView("list")}>
              📋 View IPs
            </li>
            <li className={view === "form" ? "active" : ""} onClick={() => setView("form")}>
              ➕ Add IP
            </li>
            <li className={view === "logs" ? "active" : ""} onClick={() => setView("logs")}>
              📝 View Logs
            </li>
            <li className={view === "subnets" ? "active" : ""} onClick={() => setView("subnets")}>
              🌐 Manage Subnets
            </li>
            <li className={view === "vlanvrf" ? "active" : ""} onClick={() => setView("vlanvrf")}>
              📡 VLAN & VRF
            </li>
          </ul>
        </div>

        {/* Button Profil Admin di paling bawah */}
        <div className="sidebar-bottom">
          <li className={view === "ProfilAdmin" ? "active" : ""} onClick={() => setView("ProfilAdmin")}>
            👤 Profil Admin
          </li>
        </div>
      </nav>

      {/* Content */}
      <div className="content">
        <h1>📊 Zitline IP Management</h1>
        {view === "Dashboard" && <Dashboard onViewLogs={() => setView("logs")} onLogout={handleLogout} />}
        {view === "users" && <UserManagement />}
        {view === "list" && <IPList />}
        {view === "form" && <IPForm />}
        {view === "logs" && <IPLogs />}
        {view === "subnets" && <SubnetForm />}
        {view === "vlanvrf" && <VlanVrfManager />}
        {view === "ProfilAdmin" && <ProfileAdmin />}
      </div>
    </div>
  );
}

export default App;
