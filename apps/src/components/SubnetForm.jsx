import { useState, useEffect } from 'react';
import { api } from '../api/api';

function SubnetForm() {
  const [subnet, setSubnet] = useState('');
  const [type, setType] = useState('IPv4');
  const [description, setDescription] = useState('');
  const [list, setList] = useState([]);

  const fetchSubnets = () => {
    api.get('/ips/subnets').then(res => setList(res.data));
  };

  useEffect(() => {
    fetchSubnets();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    api.post('/ips/subnets', { subnet, type, description })
      .then(() => {
        alert('✅ Subnet berhasil ditambahkan');
        setSubnet(''); setDescription('');
        fetchSubnets();
      })
      .catch(err => alert(`❌ ${err.response.data.message}`));
  };

  return (
    <div>
      <h2>➕ Tambah Subnet</h2>
      <form onSubmit={handleSubmit}>
        <input value={subnet} onChange={e => setSubnet(e.target.value)} placeholder="Subnet (e.g. 192.168.1.0/24)" required />
        <select value={type} onChange={e => setType(e.target.value)}>
          <option>IPv4</option>
          <option>IPv6</option>
        </select>
        <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Deskripsi subnet" />
        <button type="submit">💾 Simpan</button>
      </form>

      <h3>📄 Daftar Subnet</h3>
      <ul>
        {list.map(s => (
          <li key={s.id}>{s.subnet} ({s.type}) - {s.description}</li>
        ))}
      </ul>
    </div>
  );
}

export default SubnetForm;
