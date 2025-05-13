import { useEffect, useState } from "react";
import { api } from "../api/api";
import "../components/CSS/UserManagement.css";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [ipOptions, setIpOptions] = useState([]);
  const [form, setForm] = useState({ name: "", location: "", os: "", id_ip: "" });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const fetchUsers = () => {
    api.get("/users")
      .then(res => setUsers(res.data))
      .catch(err => console.error("Gagal ambil data users:", err));
  };

  const fetchIPs = () => {
    api.get("/ips")
      .then(res => setIpOptions(res.data))
      .catch(err => console.error("Gagal ambil IP:", err));
  };

  useEffect(() => {
    fetchUsers();
    fetchIPs();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(""); // reset error saat input berubah
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const ipInUse = users.find(
      u => u.id_ip === parseInt(form.id_ip) && u.id !== editingId
    );

    if (ipInUse) {
      setError("❌ IP yang dipilih sudah digunakan oleh user lain.");
      return;
    }

    try {
      if (editingId) {
        await api.put(`/users/${editingId}`, form);
      } else {
        await api.post("/users", form);
      }
      fetchUsers();
      setForm({ name: "", location: "", os: "", id_ip: "" });
      setEditingId(null);
      setError("");
    } catch (err) {
      console.error("Gagal simpan user:", err);
    }
  };

  const handleEdit = (user) => {
    setForm({
      name: user.name,
      location: user.location,
      os: user.os,
      id_ip: ipOptions.find(ip => ip.ipAddress === user.ipAddress)?.id || ""
    });
    setEditingId(user.id);
    setError("");
  };

  const handleDelete = async (id) => {
    if (window.confirm("Yakin hapus user ini?")) {
      await api.delete(`/users/${id}`);
      fetchUsers();
    }
  };

  // Ambil ID IP yang sudah dipakai user lain (kecuali yang sedang diedit)
  const usedIpIds = users
    .filter(u => !editingId || u.id !== editingId)
    .map(u => u.id_ip);

  return (
    <div className="user-container">
      <h2 className="user-title">👥 Manajemen Pengguna</h2>

      <form onSubmit={handleSubmit} className="user-form">
        <input name="name" placeholder="Nama" value={form.name} onChange={handleChange} required />
        <input name="location" placeholder="Lokasi" value={form.location} onChange={handleChange} />
        <input name="os" placeholder="OS" value={form.os} onChange={handleChange} />
        <select name="id_ip" value={form.id_ip} onChange={handleChange} required>
          <option value="">Pilih IP</option>
          {ipOptions.map(ip => {
            const isUsed = usedIpIds.includes(ip.id);
            return (
              <option key={ip.id} value={ip.id} disabled={isUsed}>
                {ip.ipAddress} {isUsed ? "(Sudah digunakan)" : ""}
              </option>
            );
          })}
        </select>
        <button type="submit" className="btn-submit">{editingId ? "💾 Update" : "➕ Tambah"}</button>
        {editingId && (
          <button type="button" onClick={() => {
            setEditingId(null);
            setForm({ name: "", location: "", os: "", id_ip: "" });
          }} className="btn-cancel">
            ❌ Batal
          </button>
        )}
      </form>

      {error && <p style={{ color: 'red', marginBottom: '15px' }}>{error}</p>}

      <table className="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nama</th>
            <th>Lokasi</th>
            <th>OS</th>
            <th>IP Digunakan</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.name}</td>
              <td>{u.location}</td>
              <td>{u.os}</td>
              <td>{u.ipAddress || "-"}</td>
              <td>
                <button className="btn-edit" onClick={() => handleEdit(u)}>✏️</button>
                <button className="btn-delete" onClick={() => handleDelete(u.id)}>🗑</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserManagement;
