import { useEffect, useState } from 'react';
import { api } from '../api/api';

function VlanVrfManager() {
  const [vlans, setVlans] = useState([]);
  const [vrfs, setVrfs] = useState([]);
  const [vlanInput, setVlanInput] = useState({ vlan_id: '', name: '', description: '' });
  const [vrfInput, setVrfInput] = useState({ vrf_name: '', description: '' });
  const [popup, setPopup] = useState({ show: false, message: '', type: 'success' });

  const fetchData = () => {
    api.get('/vlanvrf')
      .then(res => {
        setVlans(res.data.vlans);
        setVrfs(res.data.vrfs);
      })
      .catch(err => showPopup(err.response?.data?.message || err.message, 'error'));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showPopup = (message, type = 'success') => {
    setPopup({ show: true, message, type });
    setTimeout(() => setPopup({ show: false, message: '', type: 'success' }), 3000);
  };

  const handleVLANSubmit = (e) => {
    e.preventDefault();
    api.post('/vlanvrf/vlan', vlanInput)
      .then(() => {
        showPopup('✅ VLAN berhasil ditambahkan', 'success');
        setVlanInput({ vlan_id: '', name: '', description: '' });
        fetchData();
      })
      .catch(err => showPopup(`❌ ${err.response.data.message}`, 'error'));
  };

  const handleVRFSubmit = (e) => {
    e.preventDefault();
    api.post('/vlanvrf/vrf', vrfInput)
      .then(() => {
        showPopup('✅ VRF berhasil ditambahkan', 'success');
        setVrfInput({ vrf_name: '', description: '' });
        fetchData();
      })
      .catch(err => showPopup(`❌ ${err.response.data.message}`, 'error'));
  };

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
    backgroundColor: '#1a1a1a', // dark background
    color: 'red',
    padding: '30px 24px',
    border: '2px solid white', // white border
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

        <form onSubmit={handleVRFSubmit} style={formStyle}>
          <h4>➕ Tambah VRF</h4>
          <input
            placeholder="Nama VRF"
            value={vrfInput.vrf_name}
            onChange={e => setVrfInput({ ...vrfInput, vrf_name: e.target.value })}
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
        <ul style={{ listStyle: 'none', padding: 0 }}>{vlans.map(v => <li key={v.id}>{v.vlan_id} - {v.name}</li>)}</ul>

        <h3 style={{ marginTop: '20px' }}>📋 Daftar VRF</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>{vrfs.map(v => <li key={v.id}>{v.vrf_name}</li>)}</ul>
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
