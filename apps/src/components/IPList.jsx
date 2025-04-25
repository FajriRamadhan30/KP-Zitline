import { useEffect, useState } from 'react';
import { api } from '../api/api';
import '../components/CSS/IPList.css';

function IPList() {
  const [ips, setIPs] = useState([]);
  const [editData, setEditData] = useState(null);

  const fetchIPs = () => {
    api.get('/ips')
      .then(res => setIPs(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchIPs();
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('Yakin ingin menghapus IP ini?')) {
      api.delete(`/ips/${id}`)
        .then(() => {
          alert('✅ Data berhasil dihapus');
          fetchIPs();
        })
        .catch(err => alert(`❌ ${err.response.data.message}`));
    }
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    api.put(`/ips/${editData.id}`, editData)
      .then(() => {
        alert('✅ Data berhasil diupdate');
        setEditData(null);
        fetchIPs();
      })
      .catch(err => alert(`❌ ${err.response.data.message}`));
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '5px',
    border: '1px solid white',
    fontSize: '16px',
    backgroundColor: '#444',
    color: '#fff',
  };

  const formContainerStyle = {
    backgroundColor: '#111',
    padding: '20px',
    borderRadius: '10px',
    color: '#fff',
    maxWidth: '400px',
    margin: '0 auto',
  };

  return (
    <div style={{ padding: '20px' }}>
      {!editData && (
        <>
          <h2>📋 IP List</h2>
          <table border="1" width="100%">
            <thead>
              <tr>
                <th>ID</th>
                <th>IP Address</th>
                <th>Subnet</th>
                <th>Assigned To</th>
                <th>Description</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {ips.map(ip => (
                <tr key={ip.id}>
                  <td>{ip.id}</td>
                  <td>{ip.ipAddress}</td>
                  <td>{ip.subnet}</td>
                  <td>{ip.assignedTo}</td>
                  <td>{ip.description}</td>
                  <td>{ip.status}</td>
                  <td>
                    <button onClick={() => setEditData(ip)}>✏️ Edit</button>
                    <button 
                      onClick={() => handleDelete(ip.id)} 
                      style={{ marginLeft: '8px', color: 'red' }}
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {editData && (
        <div style={formContainerStyle}>
          <h3 style={{ textAlign: 'center' }}>✏️ Edit IP Address</h3>
          <form onSubmit={handleEditSubmit}>
            <input
              type="text"
              name="ipAddress"
              placeholder="IP Address"
              value={editData.ipAddress}
              onChange={e => setEditData({ ...editData, ipAddress: e.target.value })}
              style={inputStyle}
              required
            />
            <input
              type="text"
              name="subnet"
              placeholder="Subnet"
              value={editData.subnet}
              onChange={e => setEditData({ ...editData, subnet: e.target.value })}
              style={inputStyle}
              required
            />
            <select
              name="assignedTo"
              value={editData.assignedTo}
              onChange={e => setEditData({ ...editData, assignedTo: e.target.value })}
              style={inputStyle}
              required
            >
              <option value="">Select Assignee</option>
              <option value="Customer">Customer</option>
              <option value="Operator">Operator</option>
              <option value="Office">Office</option>
            </select>
            <textarea
              name="description"
              placeholder="Description"
              value={editData.description}
              onChange={e => setEditData({ ...editData, description: e.target.value })}
              style={{ ...inputStyle, resize: 'vertical', minHeight: '80px' }}
            />
            <select
              name="status"
              value={editData.status}
              onChange={e => setEditData({ ...editData, status: e.target.value })}
              style={inputStyle}
              required
            >
              <option value="available">Available</option>
              <option value="assigned">Assigned</option>
              <option value="reserved">Reserved</option>
              <option value="inactive">Inactive</option>
            </select>
            <button type="submit" style={{ ...inputStyle, backgroundColor: '#4CAF50', color: 'white' }}>
              💾 Save Changes
            </button>
            <button
              type="button"
              onClick={() => setEditData(null)}
              style={{ ...inputStyle, backgroundColor: '#f44336', color: 'white' }}
            >
              ❌ Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default IPList;