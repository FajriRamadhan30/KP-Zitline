import { useEffect, useState, useRef } from "react"; // Tambahkan useRef di sini
import { api } from "../api/api";
import "../components/CSS/UserManagement.css";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [ipOptions, setIpOptions] = useState([]);
  const [form, setForm] = useState({ name: "", location: "", os: "", id_ip: "" });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [osFilter, setOsFilter] = useState("");

  // State untuk pop-up konfirmasi delete
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [ipToDelete, setIpToDelete] = useState(null); // Menyimpan objek user yang akan dihapus
  
  // State untuk pop-up sukses delete
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // Buat ref untuk elemen form
  const formRef = useRef(null); 

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
    setError("");
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
    
    // Gunakan ref untuk scroll ke form
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' }); 
    }
  };

  // Fungsi untuk menampilkan pop-up konfirmasi delete
  const handleDelete = (user) => { // Menerima objek user, bukan hanya ID
    setIpToDelete(user);
    setShowConfirmPopup(true);
  };

  // Fungsi untuk mengkonfirmasi penghapusan setelah pop-up
  const confirmDelete = async () => {
    if (ipToDelete) {
      try {
        await api.delete(`/users/${ipToDelete.id}`);
        fetchUsers();
        setShowConfirmPopup(false); // Sembunyikan pop-up konfirmasi
        setShowSuccessPopup(true); // Tampilkan pop-up sukses
        setIpToDelete(null); // Reset IP yang akan dihapus
      } catch (err) {
        console.error("Gagal menghapus user:", err);
        setShowConfirmPopup(false);
      }
    }
  };

  const usedIpIds = users
    .filter(u => !editingId || u.id !== editingId)
    .map(u => u.id_ip);

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (locationFilter === "" || u.location === locationFilter) &&
    (osFilter === "" || u.os === osFilter)
  );

  const uniqueLocations = [...new Set(users.map(u => u.location).filter(Boolean))];
  const uniqueOS = [...new Set(users.map(u => u.os).filter(Boolean))];

  return (
    <div className="user-container">
      <h2 className="user-title">👥 Manajemen Pengguna</h2>

      {/* Search & Filter */}
      <div className="filter-bar">
        <input
          type="text"
          placeholder="🔍 Cari berdasarkan nama..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)}>
          <option value="">📍 Semua Lokasi</option>
          {uniqueLocations.map(loc => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
        <select value={osFilter} onChange={(e) => setOsFilter(e.target.value)}>
          <option value="">💻 Semua OS</option>
          {uniqueOS.map(os => (
            <option key={os} value={os}>{os}</option>
          ))}
        </select>
      </div>

      {/* Form Input */}
      {/* Kaitkan ref ke elemen form di sini */}
      <form onSubmit={handleSubmit} className="user-form" ref={formRef}> 
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

      {error && <p className="user-error">{error}</p>}

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
          {filteredUsers.map(u => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.name}</td>
              <td>{u.location}</td>
              <td>{u.os}</td>
              <td>{u.ipAddress || "-"}</td>
              <td>
                <button className="btn-edit" onClick={() => handleEdit(u)}>✏️ Edit</button>
                <button className="btn-delete" onClick={() => handleDelete(u)}>🗑 Delete</button> {/* Mengirim objek user */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pop-up Konfirmasi Hapus */}
      {showConfirmPopup && ipToDelete && (
        <div className="popup-overlay">
          <div className="popup-content confirm-popup">
            <div className="popup-icon-question">?</div>
            <h3>Konfirmasi</h3>
            <p>Yakin ingin menghapus IP Address: {ipToDelete.ipAddress}?</p>
            <div className="popup-buttons">
              <button className="btn-popup-confirm" onClick={confirmDelete}>Ya, Lanjutkan</button>
              <button className="btn-popup-cancel" onClick={() => setShowConfirmPopup(false)}>Tidak, Batal</button>
            </div>
          </div>
        </div>
      )}

      {/* Pop-up Sukses Hapus */}
      {showSuccessPopup && (
        <div className="popup-overlay">
          <div className="popup-content success-popup">
            <div className="popup-icon-success">✔</div>
            <h3>Sukses</h3>
            <p>Data berhasil dihapus</p>
            <button className="btn-popup-close" onClick={() => setShowSuccessPopup(false)}>Tutup</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserManagement;