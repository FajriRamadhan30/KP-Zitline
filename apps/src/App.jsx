import { useState } from "react";
import IPList from "./components/IPList";
import IPForm from "./components/IPForm";
import IPLogs from "./components/IPLogs";
import SubnetForm from "./components/SubnetForm";
import VlanVrfManager from "./components/VlanVrfManager";
import { Input } from "./components/ui/input"; // path relatif
import { Button } from "./components/ui/button"; // path relatif
import { FaUser, FaLock } from "react-icons/fa";
import Dashboard from "./components/Dashboard"; // Ganti path jika perlu
import "./App.css";


// Komponen Login Admin
function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (username === "admin" && password === "admin123") {
      onLogin();
    } else {
      alert("Username atau password salah!");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-blue-200">
      <div className="w-96 p-6 bg-blue-900 text-white rounded-lg shadow-lg">
        <h2 className="text-center text-2xl mb-4">ADMIN LOGIN</h2>
        <div className="mb-4 relative">
          <Input
            type="text"
            placeholder="Username"
            className="w-full p-3 pl-10 bg-blue-800 text-white border-none rounded-md"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white" />
        </div>
        <div className="mb-4 relative">
          <Input
            type="password"
            placeholder="Password"
            className="w-full p-3 pl-10 bg-blue-800 text-white border-none rounded-md"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white" />
        </div>
        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md" onClick={handleLogin}>
          Login
        </Button>
      </div>
    </div>
  );
}

// Komponen Utama
function App() {
  const [view, setView] = useState("Dashboard");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isLoggedIn) {
    return <AdminLogin onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="app-container">
      {/* Sidebar */}
      <nav className="sidebar">
        <h2 className="sidebar-title">Zitline IP</h2>
        <ul>
          <li className={view === "Dashboard" ? "active" : ""} onClick={() => setView("Dashboard")}>
            📊 Dashboard
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
      </nav>

      {/* Content */}
      <div className="content">
        <h1>📊 Zitline IP Management</h1>
        {view === "Dashboard" && <Dashboard onViewLogs={() => setView("logs")} />}
        {view === "list" && <IPList />}
        {view === "form" && <IPForm />}
        {view === "logs" && <IPLogs />}
        {view === "subnets" && <SubnetForm />}
        {view === "vlanvrf" && <VlanVrfManager />}
      </div>
    </div>
  );
}

export default App;
