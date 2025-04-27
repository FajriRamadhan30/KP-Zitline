import { useEffect, useState } from 'react';
import { api } from '../api/api';

function IPList() {
  // State management
  const [ips, setIPs] = useState([]);
  const [editData, setEditData] = useState(null);
  const [popup, setPopup] = useState({ 
    show: false, 
    message: '', 
    type: 'info', // 'info'|'success'|'error'|'warning'
    onConfirm: null,
    onCancel: null
  });

  // Fetch IP data
  const fetchIPs = () => {
    api.get('/ips')
      .then(res => setIPs(res.data))
      .catch(err => console.error('Error fetching IPs:', err));
  };

  // Initial data load
  useEffect(() => { fetchIPs(); }, []);

  // Show alert notification
  const showAlert = (message, type = 'success', duration = 3000) => {
    setPopup({ 
      show: true, 
      message, 
      type,
      onConfirm: null,
      onCancel: null
    });
    if (duration > 0) {
      setTimeout(() => setPopup({ ...popup, show: false }), duration);
    }
  };

  // Show confirmation dialog
  const showConfirm = (message, onConfirm, onCancel) => {
    setPopup({ 
      show: true, 
      message, 
      type: 'info',
      onConfirm,
      onCancel
    });
  };

  // Handle delete action
  const handleDelete = (id, ipAddress) => {
    showConfirm(
      `Yakin ingin menghapus IP Address: ${ipAddress}?`,
      async () => {
        try {
          await api.delete(`/ips/${id}`);
          showAlert('✅ Data berhasil dihapus', 'success');
          fetchIPs();
        } catch (err) {
          showAlert(err.response?.data?.message || '❌ Gagal menghapus data', 'error');
        }
      },
      () => {
        showAlert('🟡 Data batal dihapus', 'warning');
      }
    );
  };

  // Handle edit form submission
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/ips/${editData.id}`, editData);
      showAlert('✅ Data berhasil diupdate', 'success');
      setEditData(null);
      fetchIPs();
    } catch (err) {
      showAlert(err.response?.data?.message || '❌ Gagal update data', 'error');
    }
  };

  // Styles
  const styles = {
    container: { padding: '20px', maxWidth: '1200px', margin: '0 auto' },
    table: { width: '100%', borderCollapse: 'collapse', marginTop: '20px' },
    th: { 
      padding: '12px', 
      textAlign: 'left', 
      backgroundColor: '#333', 
      color: 'white',
      border: '1px solid #444'
    },
    td: { 
      padding: '10px', 
      border: '1px solid #444',
      backgroundColor: '#222',
      color: '#eee'
    },
    input: {
      width: '100%',
      padding: '10px',
      borderRadius: '5px',
      border: '1px solid #555',
      fontSize: '16px',
      backgroundColor: '#333',
      color: '#fff',
      boxSizing: 'border-box',
      fontFamily: 'inherit'
    },
    select: {
      width: '100%',
      padding: '10px',
      borderRadius: '5px',
      border: '1px solid #555',
      fontSize: '16px',
      backgroundColor: '#333',
      color: '#fff',
      boxSizing: 'border-box',
      height: '40px',
      appearance: 'none'
    },
    textarea: {
      width: '100%',
      padding: '10px',
      borderRadius: '5px',
      border: '1px solid #555',
      fontSize: '16px',
      backgroundColor: '#333',
      color: '#fff',
      boxSizing: 'border-box',
      minHeight: '100px',
      resize: 'vertical'
    },
    formContainer: {
      backgroundColor: '#222',
      padding: '20px',
      borderRadius: '10px',
      color: '#fff',
      maxWidth: '500px',
      margin: '20px auto',
    },
    formGroup: {
      marginBottom: '15px',
      width: '100%'
    },
    button: (color) => ({
      padding: '8px 16px',
      backgroundColor: color === 'red' ? '#d32f2f' : 
                     color === 'green' ? '#4CAF50' : 
                     color === 'yellow' ? '#ffcc00' : '#757575',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      marginRight: '8px',
      fontWeight: 'bold'
    }),
    popup: {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: '#2a2a2a',
      padding: '25px',
      borderRadius: '10px',
      boxShadow: '0 0 25px rgba(0,0,0,0.7)',
      zIndex: 1000,
      textAlign: 'center',
      minWidth: '350px',
      maxWidth: '90%',
      border: (type) => type === 'info' ? '2px solid #ffcc00' : 
                        type === 'error' ? '2px solid #d32f2f' : 
                        type === 'warning' ? '2px solid #ff9800' : '2px solid #4CAF50'
    },
    iconContainer: {
      backgroundColor: '#000',
      borderRadius: '50%',
      width: '60px',
      height: '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 20px',
      border: (type) => `2px solid ${
        type === 'info' ? '#ffcc00' : 
        type === 'error' ? '#d32f2f' : 
        type === 'warning' ? '#ff9800' : '#4CAF50'
      }`
    },
    icon: (type) => ({
      color: type === 'info' ? '#ffcc00' : 
             type === 'error' ? '#d32f2f' : 
             type === 'warning' ? '#ff9800' : '#4CAF50',
      fontSize: '30px',
      fontWeight: 'bold'
    })
  };

  return (
    <div style={styles.container}>
      {!editData ? (
        <>
          <h2 style={{ color: '#fff' }}>📋 Daftar IP Address</h2>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>IP Address</th>
                <th style={styles.th}>Subnet</th>
                <th style={styles.th}>Assigned To</th>
                <th style={styles.th}>Description</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {ips.map(ip => (
                <tr key={ip.id}>
                  <td style={styles.td}>{ip.id}</td>
                  <td style={styles.td}>{ip.ipAddress}</td>
                  <td style={styles.td}>{ip.subnet}</td>
                  <td style={styles.td}>{ip.assignedTo}</td>
                  <td style={styles.td}>{ip.description}</td>
                  <td style={styles.td}>{ip.status}</td>
                  <td style={styles.td}>
                    <button 
                      onClick={() => setEditData(ip)}
                      style={styles.button('green')}
                    >
                      ✏️ Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(ip.id, ip.ipAddress)}
                      style={styles.button('red')}
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <div style={styles.formContainer}>
          <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>✏️ Edit IP Address</h3>
          <form onSubmit={handleEditSubmit}>
            <div style={styles.formGroup}>
              <input
                type="text"
                name="ipAddress"
                placeholder="IP Address"
                value={editData.ipAddress}
                onChange={e => setEditData({ ...editData, ipAddress: e.target.value })}
                style={styles.input}
                required
              />
            </div>
            
            <div style={styles.formGroup}>
              <input
                type="text"
                name="subnet"
                placeholder="Subnet"
                value={editData.subnet}
                onChange={e => setEditData({ ...editData, subnet: e.target.value })}
                style={styles.input}
                required
              />
            </div>
            
            <div style={styles.formGroup}>
              <select
                name="assignedTo"
                value={editData.assignedTo}
                onChange={e => setEditData({ ...editData, assignedTo: e.target.value })}
                style={styles.select}
                required
              >
                <option value="">Pilih Assignee</option>
                <option value="Customer">Customer</option>
                <option value="Operator">Operator</option>
                <option value="Office">Office</option>
              </select>
            </div>
            
            <div style={styles.formGroup}>
              <textarea
                name="description"
                placeholder="Description"
                value={editData.description}
                onChange={e => setEditData({ ...editData, description: e.target.value })}
                style={styles.textarea}
              />
            </div>
            
            <div style={styles.formGroup}>
              <select
                name="status"
                value={editData.status}
                onChange={e => setEditData({ ...editData, status: e.target.value })}
                style={styles.select}
                required
              >
                <option value="available">Available</option>
                <option value="assigned">Assigned</option>
                <option value="reserved">Reserved</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
              <button 
                type="submit" 
                style={styles.button('green')}
              >
                💾 Simpan
              </button>
              <button
                type="button"
                onClick={() => setEditData(null)}
                style={styles.button('gray')}
              >
                ❌ Batal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Universal Popup Component */}
      {popup.show && (
        <div style={{ ...styles.popup, border: styles.popup.border(popup.type) }}>
          <div style={{ ...styles.iconContainer, border: styles.iconContainer.border(popup.type) }}>
            {popup.type === 'info' ? (
              <span style={{ ...styles.icon(popup.type), fontSize: '40px' }}>?</span>
            ) : (
              <span style={styles.icon(popup.type)}>
                {popup.type === 'success' ? '✔' : 
                 popup.type === 'error' ? '✖' : '⚠'}
              </span>
            )}
          </div>
          
          <h3 style={{ marginBottom: '15px', color: '#fff' }}>
            {popup.type === 'info' ? 'Konfirmasi' : 
             popup.type === 'success' ? 'Sukses' : 
             popup.type === 'error' ? 'Error' : 'Peringatan'}
          </h3>
          
          <p style={{ marginBottom: '20px', color: '#ddd', fontSize: '16px' }}>
            {popup.message}
          </p>

          {popup.type === 'info' ? (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
              <button
                onClick={() => {
                  popup.onConfirm?.();
                  setPopup({ ...popup, show: false });
                }}
                style={styles.button('red')}
              >
                Ya, Lanjutkan
              </button>
              <button
                onClick={() => {
                  popup.onCancel?.();
                  setPopup({ ...popup, show: false });
                }}
                style={styles.button('gray')}
              >
                Tidak, Batal
              </button>
            </div>
          ) : (
            <button
              onClick={() => setPopup({ ...popup, show: false })}
              style={styles.button(
                popup.type === 'success' ? 'green' : 
                popup.type === 'error' ? 'red' : 'yellow'
              )}
            >
              Tutup
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default IPList;
