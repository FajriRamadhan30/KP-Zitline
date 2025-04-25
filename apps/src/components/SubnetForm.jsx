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

  const commonStyle = {
    padding: '10px',
    fontSize: '16px',
    width: '100%',
    boxSizing: 'border-box',
    border: '1px solid white',
    borderRadius: '4px',
    backgroundColor: 'transparent',
    color: 'white'
  };

  return (
    <div style={{
      maxWidth: '500px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#222',
      color: 'white'
    }}>
      <h2>➕ Tambah Subnet</h2>
      <form onSubmit={handleSubmit} style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <input
          value={subnet}
          onChange={e => setSubnet(e.target.value)}
          placeholder="Subnet (e.g. 192.168.1.0/24)"
          required
          style={commonStyle}
        />

        <select
          value={type}
          onChange={e => setType(e.target.value)}
          style={{
            ...commonStyle,
            backgroundColor: '#000',
            color: '#fff'
          }}
        >
          <option value="IPv4">IPv4</option>
          <option value="IPv6">IPv6</option>
        </select>

        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Deskripsi subnet"
          style={{
            ...commonStyle,
            minHeight: '80px',
            resize: 'vertical'
          }}
        />

        <button type="submit" style={{
          ...commonStyle,
          cursor: 'pointer',
          backgroundColor: 'white',
          color: '#000',
          fontWeight: 'bold'
        }}>
          💾 Simpan
        </button>
      </form>

      <h3 style={{ marginTop: '30px' }}>📄 Daftar Subnet</h3>
      <ul>
        {list.map(s => (
          <li key={s.id}>{s.subnet} ({s.type}) - {s.description}</li>
        ))}
      </ul>
    </div>
  );
}

export default SubnetForm;
