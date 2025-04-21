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

  return (
    <div>
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

      {editData && (
        <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '15px' }}>
          <h3>✏️ Edit IP Address</h3>
          <form onSubmit={handleEditSubmit}>
            <div>
              <label>IP Address:</label>
              <input
                type="text"
                name="ipAddress"
                value={editData.ipAddress}
                onChange={e => setEditData({ ...editData, ipAddress: e.target.value })}
                required
              />
            </div>
            <div>
              <label>Subnet:</label>
              <input
                type="text"
                name="subnet"
                value={editData.subnet}
                onChange={e => setEditData({ ...editData, subnet: e.target.value })}
                required
              />
            </div>
            <div>
              <label>Assigned To:</label>
              <input
                type="text"
                name="assignedTo"
                value={editData.assignedTo}
                onChange={e => setEditData({ ...editData, assignedTo: e.target.value })}
              />
            </div>
            <div>
              <label>Description:</label>
              <textarea
                name="description"
                value={editData.description}
                onChange={e => setEditData({ ...editData, description: e.target.value })}
              />
            </div>
            <div>
              <label>Status:</label>
              <select
                name="status"
                value={editData.status}
                onChange={e => setEditData({ ...editData, status: e.target.value })}
                required
              >
                <option value="available">Available</option>
                <option value="assigned">Assigned</option>
                <option value="reserved">Reserved</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <button type="submit">💾 Save Changes</button>
            <button type="button" onClick={() => setEditData(null)} style={{ marginLeft: '10px' }}>❌ Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default IPList;
