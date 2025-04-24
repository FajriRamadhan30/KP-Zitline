import { useEffect, useState } from 'react';
import { api } from '../api/api';

function VlanVrfManager() {
  const [vlans, setVlans] = useState([]);
  const [vrfs, setVrfs] = useState([]);
  const [vlanInput, setVlanInput] = useState({ vlan_id: '', name: '', description: '' });
  const [vrfInput, setVrfInput] = useState({ vrf_name: '', description: '' });

  const fetchData = () => {
    api.get('/vlanvrf')
      .then(res => {
        setVlans(res.data.vlans);
        setVrfs(res.data.vrfs);
      })
      .catch(err => alert(`❌ ${err.response?.data?.message || err.message}`));
  };

  useEffect(() => { fetchData(); }, []);

  const handleVLANSubmit = (e) => {
    e.preventDefault();
    api.post('/vlanvrf/vlan', vlanInput)
      .then(() => {
        alert('✅ VLAN berhasil ditambahkan');
        setVlanInput({ vlan_id: '', name: '', description: '' });
        fetchData();
      })
      .catch(err => alert(`❌ ${err.response.data.message}`));
  };

  const handleVRFSubmit = (e) => {
    e.preventDefault();
    api.post('/vlanvrf/vrf', vrfInput)
      .then(() => {
        alert('✅ VRF berhasil ditambahkan');
        setVrfInput({ vrf_name: '', description: '' });
        fetchData();
      })
      .catch(err => alert(`❌ ${err.response.data.message}`));
  };

  return (
    <div>
      <h2>📡 VLAN & VRF Management</h2>

      <div style={{ display: 'flex', gap: '40px' }}>
        <form onSubmit={handleVLANSubmit}>
          <h4>➕ Tambah VLAN</h4>
          <input placeholder="VLAN ID" value={vlanInput.vlan_id} onChange={e => setVlanInput({ ...vlanInput, vlan_id: e.target.value })} required />
          <input placeholder="Nama VLAN" value={vlanInput.name} onChange={e => setVlanInput({ ...vlanInput, name: e.target.value })} required />
          <textarea placeholder="Deskripsi" value={vlanInput.description} onChange={e => setVlanInput({ ...vlanInput, description: e.target.value })} />
          <button type="submit">💾 Simpan VLAN</button>
        </form>

        <form onSubmit={handleVRFSubmit}>
          <h4>➕ Tambah VRF</h4>
          <input placeholder="Nama VRF" value={vrfInput.vrf_name} onChange={e => setVrfInput({ ...vrfInput, vrf_name: e.target.value })} required />
          <textarea placeholder="Deskripsi" value={vrfInput.description} onChange={e => setVrfInput({ ...vrfInput, description: e.target.value })} />
          <button type="submit">💾 Simpan VRF</button>
        </form>
      </div>

      <div style={{ marginTop: '40px' }}>
        <h3>📋 Daftar VLAN</h3>
        <ul>{vlans.map(v => <li key={v.id}>{v.vlan_id} - {v.name}</li>)}</ul>

        <h3 style={{ marginTop: '20px' }}>📋 Daftar VRF</h3>
        <ul>{vrfs.map(v => <li key={v.id}>{v.vrf_name}</li>)}</ul>
      </div>
    </div>
  );    
}

export default VlanVrfManager;
