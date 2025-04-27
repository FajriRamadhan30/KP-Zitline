import { useState, useEffect } from "react";
import { Button } from "./ui/button.jsx"; // Sesuaikan path kalau beda
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const dataUsage = [
  { name: "Used IPs", value: 300 },
  { name: "Available IPs", value: 700 },
];

const subnetData = [
  { name: "Subnet A", count: 120 },
  { name: "Subnet B", count: 80 },
  { name: "Subnet C", count: 200 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

function Dashboard({ onViewLogs }) {
  const [totalIPs, setTotalIPs] = useState(0);
  const [totalSubnets, setTotalSubnets] = useState(0);
  const [totalVlans, setTotalVlans] = useState(0);

  useEffect(() => {
    // Simulasi fetch data
    setTimeout(() => {
      setTotalIPs(1000);
      setTotalSubnets(15);
      setTotalVlans(8);
    }, 500);
  }, []);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">📊 Dashboard IP Management</h1>
        <p className="text-gray-600">Selamat datang di Dashboard Zitline.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <SummaryCard title="Total IPs" value={totalIPs} color="bg-blue-500" />
        <SummaryCard title="Total Subnets" value={totalSubnets} color="bg-green-500" />
        <SummaryCard title="Total VLAN/VRF" value={totalVlans} color="bg-purple-500" />
      </div>

      {/* Button */}
      <div className="mb-10">
        <Button 
          onClick={onViewLogs} 
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg"
        >
          📝 View Logs
        </Button>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-semibold mb-6 text-center">IP Usage</h2>
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

        {/* Bar Chart */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-semibold mb-6 text-center">Subnet Allocation</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={subnetData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ title, value, color }) {
  return (
    <div className={`${color} text-white p-6 rounded-xl shadow-md`}>
      <h3 className="text-xl">{title}</h3>
      <p className="text-4xl font-bold mt-2">{value}</p>
    </div>
  );
}

export default Dashboard;
