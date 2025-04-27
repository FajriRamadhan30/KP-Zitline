import { useEffect, useState } from 'react';
import { api } from '../api/api';
import '../components/CSS/IPList.css';

function IPList() {
  const [ips, setIPs] = useState([]);
  const [editData, setEditData] = useState(null);
  const [popup, setPopup] = useState({ show: false, message: '', type: 'success' });

  const fetchIPs = () => {
    api.get('/ips')
      .then(res => setIPs(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchIPs();
  }, []);

  const showPopup = (message, type = 'success') => {
    setPopup({ show: true, message, type });
    setTimeout(() => setPopup({ show: false, message: '', type: 'success' }), 3000);
  };

  const handleDelete = (id) => {
    if (window.confirm('Yakin ingin menghapus IP ini?')) {
      api.delete(`/ips/${id}`)
        .then(() => {
          showPopup('✅ Data berhasil dihapus', 'success');
          fetchIPs();
        })
        .catch(err => {
          const message = err.response?.data?.message || '❌ Gagal menghapus data';
          showPopup(message, 'error');
        });
    }
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    api.put(`/ips/${editData.id}`, editData)
      .then(() => {
        showPopup('✅ Data berhasil diupdate', 'success');
        setEditData(null);
        fetchIPs();
      })
      .catch(err => {
        const message = err.response?.data?.message || '❌ Gagal update data';
        showPopup(message, 'error');
      });
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

  const popupStyle = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#1a1a1a',
    color: popup.type === 'success' ? 'green' : 'red',
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

      {/* Pop-up */}
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
            border: `2px solid ${popup.type === 'success' ? 'green' : 'red'}`,
          }}>
            <span style={{ color: popup.type === 'success' ? 'green' : 'red', fontSize: '28px', fontWeight: 'bold' }}>
              {popup.type === 'success' ? '✔' : '✖'}
            </span>
          </div>
          {popup.message}
        </div>
      )}
    </div>
  );
}

export default IPList;
