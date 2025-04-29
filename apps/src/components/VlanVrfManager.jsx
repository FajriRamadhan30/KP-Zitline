import { useEffect, useState } from 'react';
import { api } from '../api/api';

function VlanVrfManager() {
  const [vlans, setVlans] = useState([]);  // Inisialisasi dengan array kosong
  const [vrfs, setVrfs] = useState([]);    // Inisialisasi dengan array kosong
  const [vlanInput, setVlanInput] = useState({ vlan_id: '', name: '', description: '' });
  const [vrfInput, setVrfInput] = useState({ vrf_name: '', route_distinguisher: '', description: '' });
  const [popup, setPopup] = useState({ show: false, message: '', type: 'success' });

  // Fungsi untuk mengambil data VLAN dan VRF
  const fetchData = () => {
    api.get('/vlanvrf')
      .then(res => {
        console.log("Data VLAN & VRF berhasil diambil:", res.data);  // Debugging
        setVlans(res.data.vlans || []);  // Pastikan selalu berupa array
        setVrfs(res.data.vrfs || []);    // Pastikan selalu berupa array
      })
      .catch(err => {
        console.error("Terjadi kesalahan saat mengambil data:", err);  // Debugging
        showPopup(`❌ ${err.response?.data?.message || err.message}`, 'error');
      });
  };

  useEffect(() => {
    fetchData();  // Panggil fetchData untuk mengambil data saat komponen di-render
  }, []);  // Hanya dipanggil sekali saat pertama kali komponen di-render

  // Fungsi untuk menampilkan popup
  const showPopup = (message, type = 'success') => {
    setPopup({ show: true, message, type });
    setTimeout(() => setPopup({ show: false, message: '', type: 'success' }), 3000);
  };

  // Fungsi untuk menambahkan VLAN
  const handleVLANSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting VLAN data:", vlanInput);  // Debugging
    api.post('/vlanvrf/vlan', vlanInput)
      .then(() => {
        showPopup('✅ VLAN berhasil ditambahkan', 'success');
        setVlanInput({ vlan_id: '', name: '', description: '' });
        fetchData();  // Memperbarui daftar VLAN setelah penambahan
      })
      .catch(err => showPopup(`❌ ${err.response?.data?.message || err.message}`, 'error'));
  };

  // Fungsi untuk menambahkan VRF
  const handleVRFSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting VRF data:", vrfInput);  // Debugging
    api.post('/vlanvrf/vrf', vrfInput)
      .then(() => {
        showPopup('✅ VRF berhasil ditambahkan', 'success');
        setVrfInput({ vrf_name: '', route_distinguisher: '', description: '' });
        fetchData();  // Memperbarui daftar VRF setelah penambahan
      })
      .catch(err => showPopup(`❌ ${err.response?.data?.message || err.message}`, 'error'));
  };

  // Gaya untuk form
  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    width: '100%',
    maxWidth: '300px',
  };

  const inputStyle = {
    padding: '10px',
    fontSize: '16px',
    backgroundColor: '#000',
    color: '#fff',
    border: '1px solid white',
    borderRadius: '4px',
    boxSizing: 'border-box',
    width: '100%',
  };

  const buttonStyle = {
    ...inputStyle,
    backgroundColor: '#fff',
    color: '#000',
    fontWeight: 'bold',
    cursor: 'pointer',
  };

  const popupStyle = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#1a1a1a',
    color: 'red',
    padding: '30px 24px',
    border: '2px solid white',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
    zIndex: 9999,
    fontSize: '16px',
    fontWeight: 'bold',
    textAlign: 'center',
    minWidth: '250px',
  };

  return (
    <div style={{ padding: '20px', color: 'white', backgroundColor: '#222', minHeight: '100vh' }}>
      <h2 style={{ textAlign: 'center' }}>📡 VLAN & VRF Management</h2>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '60px', marginTop: '40px', flexWrap: 'wrap' }}>
        {/* Form untuk menambah VLAN */}
        <form onSubmit={handleVLANSubmit} style={formStyle}>
          <h4>➕ Tambah VLAN</h4>
          <input
            placeholder="VLAN ID"
            value={vlanInput.vlan_id}
            onChange={e => setVlanInput({ ...vlanInput, vlan_id: e.target.value })}
            required
            style={inputStyle}
          />
          <input
            placeholder="Nama VLAN"
            value={vlanInput.name}
            onChange={e => setVlanInput({ ...vlanInput, name: e.target.value })}
            required
            style={inputStyle}
          />
          <textarea
            placeholder="Deskripsi"
            value={vlanInput.description}
            onChange={e => setVlanInput({ ...vlanInput, description: e.target.value })}
            style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
          />
          <button type="submit" style={buttonStyle}>💾 Simpan VLAN</button>
        </form>

        {/* Form untuk menambah VRF */}
        <form onSubmit={handleVRFSubmit} style={formStyle}>
          <h4>➕ Tambah VRF</h4>
          <input
            placeholder="Nama VRF"
            value={vrfInput.vrf_name}
            onChange={e => setVrfInput({ ...vrfInput, vrf_name: e.target.value })}
            required
            style={inputStyle}
          />
          <input
            placeholder="Route Distinguisher"
            value={vrfInput.route_distinguisher}
            onChange={e => setVrfInput({ ...vrfInput, route_distinguisher: e.target.value })}
            required
            style={inputStyle}
          />
          <textarea
            placeholder="Deskripsi"
            value={vrfInput.description}
            onChange={e => setVrfInput({ ...vrfInput, description: e.target.value })}
            style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
          />
          <button type="submit" style={buttonStyle}>💾 Simpan VRF</button>
        </form>
      </div>

      <div style={{ marginTop: '50px', textAlign: 'center' }}>
        <h3>📋 Daftar VLAN</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {vlans.length > 0 ? (
            vlans.map(v => <li key={v.id}>{v.vlan_id} - {v.name}</li>)
          ) : (
            <li>Tidak ada data VLAN</li>
          )}
        </ul>

        <h3 style={{ marginTop: '20px' }}>📋 Daftar VRF</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {vrfs.length > 0 ? (
            vrfs.map(v => <li key={v.id}>{v.vrf_name}</li>)
          ) : (
            <li>Tidak ada data VRF</li>
          )}
        </ul>
      </div>

      {popup.show && (
        <div style={popupStyle}>
          <div style={{
            backgroundColor: '#000',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            border: '2px solid red',
          }}>
            <span style={{ color: 'red', fontSize: '28px', fontWeight: 'bold' }}>✖</span>
          </div>
          {popup.message}
        </div>
      )}
    </div>
  );
}

export default VlanVrfManager;
