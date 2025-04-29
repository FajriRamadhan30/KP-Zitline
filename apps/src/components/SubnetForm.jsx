import { useState, useEffect } from "react";
import { api } from "../api/api";

function SubnetForm() {
  const [subnet, setSubnet] = useState("");
  const [type, setType] = useState("IPv4");
  const [description, setDescription] = useState("");
  const [list, setList] = useState([]);
  const [popup, setPopup] = useState({ show: false, message: "", type: "success" });

  const fetchSubnets = () => {
    api
      .get("/subnets") // <- sudah diperbaiki endpointnya
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
      .post("/subnets", { subnet, type, description }) // <- sudah diperbaiki endpointnya
      .then(() => {
        showPopup("✅ Subnet berhasil ditambahkan", "success");
        setSubnet("");
        setDescription("");
        fetchSubnets();
      })
      .catch((err) => showPopup(`Gagal tambah subnet: ${err.response?.data?.message || err.message}`, "error"));
  };

  const commonStyle = {
    padding: "10px",
    fontSize: "16px",
    width: "100%",
    boxSizing: "border-box",
    border: "1px solid white",
    borderRadius: "4px",
    backgroundColor: "transparent",
    color: "white",
  };

  const popupStyle = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#1a1a1a",
    color: popup.type === "error" ? "red" : "white",
    padding: "30px 24px",
    border: "2px solid white",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
    zIndex: 9999,
    fontSize: "16px",
    fontWeight: "bold",
    textAlign: "center",
    minWidth: "250px",
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "0 auto",
        padding: "20px",
        backgroundColor: "#222",
        color: "white",
        borderRadius: "10px",
      }}
    >
      <h2>➕ Tambah Subnet</h2>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <input value={subnet} onChange={(e) => setSubnet(e.target.value)} placeholder="Subnet (e.g. 192.168.1.0/24)" required style={commonStyle} />

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          style={{
            ...commonStyle,
            backgroundColor: "#000",
            color: "#fff",
          }}
        >
          <option value="IPv4">IPv4</option>
          <option value="IPv6">IPv6</option>
        </select>

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Deskripsi subnet"
          style={{
            ...commonStyle,
            minHeight: "80px",
            resize: "vertical",
          }}
        />

        <button
          type="submit"
          style={{
            ...commonStyle,
            cursor: "pointer",
            backgroundColor: "white",
            color: "#000",
            fontWeight: "bold",
          }}
        >
          💾 Simpan
        </button>
      </form>

      <h3 style={{ marginTop: "30px" }}>📄 Daftar Subnet</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {list.map((s) => (
          <li
            key={s.id}
            style={{
              padding: "10px",
              marginBottom: "10px",
              borderBottom: "1px solid white",
            }}
          >
            <strong>{s.subnet}</strong> ({s.type})<br />
            <em>{s.description}</em>
          </li>
        ))}
      </ul>

      {popup.show && <div style={popupStyle}>{popup.message}</div>}
    </div>
  );
}

export default SubnetForm;
