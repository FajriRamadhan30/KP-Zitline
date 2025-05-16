import { useEffect, useState } from "react";
import { api } from "../api/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

function Dashboard({ onViewLogs, onLogout }) {
  const [totalIPs, setTotalIPs] = useState(0);
  const [usedIPs, setUsedIPs] = useState(0);
  const [availableIPs, setAvailableIPs] = useState(0);
  const [userByLocation, setUserByLocation] = useState([]);
  const [userByOS, setUserByOS] = useState([]);

  useEffect(() => {
    api
      .get("/dashboard/stats")
      .then(({ data }) => {
        setTotalIPs(data.totalIPs?.[0]?.count || 0);
        setUsedIPs(data.usedIPs?.[0]?.count || 0);
        setAvailableIPs(data.availableIPs?.[0]?.count || 0);
        setUserByLocation(data.userDistribution || []);
        setUserByOS(data.osDistribution || []);
      })
      .catch((err) => {
        console.error("Gagal ambil data dashboard:", err);
      });
  }, []);

  const dataUsage = [
    { name: "Used IPs", value: usedIPs },
    { name: "Available IPs", value: availableIPs },
  ];

  // Styles
  const styles = {
    container: {
      backgroundColor: "#1e293b", // abu gelap (Tailwind slate-800)
      color: "#e2e8f0", // abu terang (Tailwind slate-200)
      minHeight: "100vh",
      padding: 32,
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    headerButtons: {
      display: "flex",
      justifyContent: "flex-end",
      gap: 16,
      marginBottom: 24,
    },
    btnPrimary: {
      backgroundColor: "#2563eb",
      color: "white",
      fontWeight: "600",
      padding: "10px 24px",
      borderRadius: 10,
      border: "none",
      cursor: "pointer",
      fontSize: 16,
      transition: "background-color 0.2s",
    },
    btnPrimaryHover: {
      backgroundColor: "#1d4ed8",
    },
    btnDanger: {
      backgroundColor: "#dc2626",
      color: "white",
      fontWeight: "600",
      padding: "10px 24px",
      borderRadius: 10,
      border: "none",
      cursor: "pointer",
      fontSize: 16,
      transition: "background-color 0.2s",
    },
    btnDangerHover: {
      backgroundColor: "#b91c1c",
    },
    welcomeText: {
      marginBottom: 32,
      fontSize: 18,
      color: "#cbd5e1", // abu terang
    },
    grid3: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: 24,
      marginBottom: 40,
    },
    grid2: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
      gap: 32,
      marginBottom: 40,
    },
    summaryCard: (bgColor) => ({
      backgroundColor: bgColor,
      color: "white",
      padding: 24,
      borderRadius: 20,
      boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
      textAlign: "center",
    }),
    summaryTitle: {
      fontSize: 20,
      margin: 0,
    },
    summaryValue: {
      fontSize: 36,
      fontWeight: "bold",
      marginTop: 12,
    },
    chartCard: {
      backgroundColor: "#0f172a", // slate-900
      padding: 24,
      borderRadius: 20,
      boxShadow: "0 4px 12px rgba(0,0,0,0.7)",
    },
    chartTitle: {
      fontSize: 22,
      fontWeight: "600",
      marginBottom: 24,
      textAlign: "center",
      color: "#e0e7ff",
    },
  };

  return (
    <div style={styles.container}>
      {/* Buttons di atas */}
      <div style={styles.headerButtons}>
        <button
          style={styles.btnPrimary}
          onMouseEnter={(e) => (e.target.style.backgroundColor = styles.btnPrimaryHover.backgroundColor)}
          onMouseLeave={(e) => (e.target.style.backgroundColor = styles.btnPrimary.backgroundColor)}
          onClick={onViewLogs}
        >
          📝 View Logs
        </button>
        <button
          style={styles.btnDanger}
          onMouseEnter={(e) => (e.target.style.backgroundColor = styles.btnDangerHover.backgroundColor)}
          onMouseLeave={(e) => (e.target.style.backgroundColor = styles.btnDanger.backgroundColor)}
          onClick={onLogout}
        >
          🚪 Logout
        </button>
      </div>

      <div style={styles.welcomeText}>
        <p>Selamat datang di Dashboard Zitline.</p>
      </div>

      {/* Summary Cards */}
      <div style={styles.grid3}>
        <div style={styles.summaryCard("#3b82f6")}>
          <h3 style={styles.summaryTitle}>Total IPs</h3>
          <p style={styles.summaryValue}>{totalIPs}</p>
        </div>
        <div style={styles.summaryCard("#4f46e5")}>
          <h3 style={styles.summaryTitle}>Used IPs</h3>
          <p style={styles.summaryValue}>{usedIPs}</p>
        </div>
        <div style={styles.summaryCard("#16a34a")}>
          <h3 style={styles.summaryTitle}>Available IPs</h3>
          <p style={styles.summaryValue}>{availableIPs}</p>
        </div>
      </div>

      {/* Charts */}
      <div style={styles.grid2}>
        <div style={styles.chartCard}>
          <h2 style={styles.chartTitle}>IP Usage</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={dataUsage}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                dataKey="value"
              >
                {dataUsage.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div style={styles.chartCard}>
          <h2 style={styles.chartTitle}>User by Location</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={userByLocation}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ ...styles.chartCard, maxWidth: 800, margin: "0 auto" }}>
        <h2 style={styles.chartTitle}>User by OS</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={userByOS}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Dashboard;
