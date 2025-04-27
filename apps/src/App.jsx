import { useState } from "react";
import IPList from "./components/IPList";
import IPForm from "./components/IPForm";
import IPLogs from "./components/IPLogs";
import SubnetForm from "./components/SubnetForm";
import VlanVrfManager from "./components/VlanVrfManager";
import Dashboard from "./components/Dashboard";
import AdminLogin from "./components/AdminLogin"; // Import AdminLogin dari luar
import "./App.css";

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
        <h1>Zitline IP Management</h1>
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
