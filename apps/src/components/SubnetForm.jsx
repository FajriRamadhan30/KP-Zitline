import { useState, useEffect } from "react";
import { api } from "../api/api";
import '../components/CSS/SubnetForm.css';

function SubnetForm() {
  const [subnet, setSubnet] = useState("");
  const [type, setType] = useState("IPv4");
  const [description, setDescription] = useState("");
  const [list, setList] = useState([]);
  const [popup, setPopup] = useState({ show: false, message: "", type: "success" });

  const [showAddForm, setShowAddForm] = useState(true); 

  const fetchSubnets = () => {
    api
      .get("/subnets")
      .then((res) => setList(res.data))
      .catch((err) => showPopup(`Gagal load data: ${err.response?.data?.message || err.message}`, "error"));
  };

  useEffect(() => {
    fetchSubnets();
  }, []);

  const showPopup = (message, type = "success") => {
    setPopup({ show: true, message, type });
    setTimeout(() => setPopup({ show: false, message: "", type: "success" }), 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    api
      .post("/subnets", { subnet, type, description })
      .then(() => {
        showPopup("✅ Subnet berhasil ditambahkan", "success");
        setSubnet("");
        setDescription("");
        fetchSubnets();
      })
      .catch((err) => showPopup(`Gagal tambah subnet: ${err.response?.data?.message || err.message}`, "error"));
  };

  return (
    <div className="subnet-container">
      <div className="subnet-header">
        <h2 className="subnet-title">{showAddForm ? '➕ Tambah Subnet' : '📄 Daftar Subnet'}</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className={`subnet-toggle-button ${showAddForm ? 'show-list' : 'show-form'}`}
        >
          {showAddForm ? 'Lihat Daftar Subnet' : '➕ Tambah Subnet Baru'}
        </button>
      </div>

      {showAddForm ? (
        <form
          onSubmit={handleSubmit}
          className="subnet-form"
        >
          <input
            value={subnet}
            onChange={(e) => setSubnet(e.target.value)}
            placeholder="Subnet (e.g. 192.168.1.0/24)"
            required
            className="subnet-input"
          />

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="subnet-select"
          >
            <option value="IPv4">IPv4</option>
            <option value="IPv6">IPv6</option>
          </select>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Deskripsi subnet"
            className="subnet-textarea"
          />

          <button
            type="submit"
            className="subnet-submit-button"
          >
            💾 Simpan
          </button>
        </form>
      ) : (
        <>
          <ul className="subnet-list">
            {list.length > 0 ? (
              list.map((s) => (
                <li
                  key={s.id}
                  style={{ /* Untuk li, jika tidak ada styling khusus, tetap pakai inline atau buat class terpisah */
                    padding: "10px",
                    marginBottom: "10px",
                    borderBottom: "1px solid white",
                  }}
                >
                  <strong>{s.subnet}</strong> ({s.type})<br />
                  <em>{s.description}</em>
                </li>
              ))
            ) : (
              // Perbaikan di sini: Hapus komentar yang satu baris dengan tag penutup,
              // atau pindahkan komentar ke baris baru.
              <p className="subnet-empty-message">Belum ada subnet yang ditambahkan.</p> 
            )}
          </ul>
        </>
      )}

      {/* Pop-up */}
      {popup.show && (
        <div className="subnet-popup-overlay">
          <div className={`subnet-popup ${popup.type}`}>
            <div className={`subnet-popup-message ${popup.type}`}>
              {popup.message}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SubnetForm;