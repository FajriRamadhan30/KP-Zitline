import { useEffect, useState } from 'react';
import { api } from '../api/api';
import '../components/CSS/IPList.css';

function IPList() {
  const [ips, setIPs] = useState([]);
  const [filteredIPs, setFilteredIPs] = useState([]);
  const [editData, setEditData] = useState(null);
  const [popup, setPopup] = useState({ show: false, message: '', type: 'info', onConfirm: null, onCancel: null });
  const [searchTerm, setSearchTerm] = useState('');
  const [assignedToFilter, setAssignedToFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchIPs();
  }, []);

  useEffect(() => {
    const filtered = ips.filter(ip =>
      ip.ipAddress.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (assignedToFilter === '' || ip.assignedTo === assignedToFilter) &&
      (statusFilter === '' || ip.status.toLowerCase() === statusFilter.toLowerCase())
    );
    setFilteredIPs(filtered);
  }, [searchTerm, assignedToFilter, statusFilter, ips]);

  const fetchIPs = () => {
    api.get('/ips')
      .then(res => {
        setIPs(res.data);
        setFilteredIPs(res.data);
      })
      .catch(err => console.error('Error fetching IPs:', err));
  };

  const showAlert = (message, type = 'success', duration = 3000) => {
    setPopup({ show: true, message, type, onConfirm: null, onCancel: null });
    if (duration > 0) {
      setTimeout(() => setPopup({ ...popup, show: false }), duration);
    }
  };

  const showConfirm = (message, onConfirm, onCancel) => {
    setPopup({ show: true, message, type: 'info', onConfirm, onCancel });
  };

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
      () => showAlert('🟡 Data batal dihapus', 'warning')
    );
  };

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

  return (
    <div className="container">
      {!editData ? (
        <>
          <h2 style={{ color: '#fff' }}>📋 Daftar IP Address</h2>

          {/* Filter dan Search */}
          <div className="filters">
            <input
              type="text"
              placeholder="🔍 Cari IP Address"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input"
            />
            <select value={assignedToFilter} onChange={(e) => setAssignedToFilter(e.target.value)} className="select">
              <option value="">-- Filter Assigned To --</option>
              <option value="Customer">Customer</option>
              <option value="Operator">Operator</option>
              <option value="Office">Office</option>
            </select>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="select">
              <option value="">-- Filter Status --</option>
              <option value="available">Available</option>
              <option value="assigned">Assigned</option>
              <option value="reserved">Reserved</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Tabel */}
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>IP Address</th>
                <th>Subnet</th>
                <th>Assigned To</th>
                <th>Description</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredIPs.map(ip => (
                <tr key={ip.id}>
                  <td>{ip.id}</td>
                  <td>{ip.ipAddress}</td>
                  <td>{ip.subnet}</td>
                  <td>{ip.assignedTo}</td>
                  <td>{ip.description}</td>
                  <td>{ip.status}</td>
                  <td>
                    <button onClick={() => setEditData(ip)} className="button green">✏️ Edit</button>
                    <button onClick={() => handleDelete(ip.id, ip.ipAddress)} className="button red">🗑️ Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <div className="form-container">
          <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>✏️ Edit IP Address</h3>
          <form onSubmit={handleEditSubmit}>
            <div className="form-group">
              <input
                type="text"
                name="ipAddress"
                placeholder="IP Address"
                value={editData.ipAddress}
                onChange={e => setEditData({ ...editData, ipAddress: e.target.value })}
                className="input"
                required
              />
            </div>

            <div className="form-group">
              <input
                type="text"
                name="subnet"
                placeholder="Subnet"
                value={editData.subnet}
                onChange={e => setEditData({ ...editData, subnet: e.target.value })}
                className="input"
                required
              />
            </div>

            <div className="form-group">
              <select
                name="assignedTo"
                value={editData.assignedTo}
                onChange={e => setEditData({ ...editData, assignedTo: e.target.value })}
                className="select"
                required
              >
                <option value="">Pilih Assignee</option>
                <option value="Customer">Customer</option>
                <option value="Operator">Operator</option>
                <option value="Office">Office</option>
              </select>
            </div>

            <div className="form-group">
              <textarea
                name="description"
                placeholder="Description"
                value={editData.description}
                onChange={e => setEditData({ ...editData, description: e.target.value })}
                className="textarea"
              />
            </div>

            <div className="form-group">
              <select
                name="status"
                value={editData.status}
                onChange={e => setEditData({ ...editData, status: e.target.value })}
                className="select"
                required
              >
                <option value="available">Available</option>
                <option value="assigned">Assigned</option>
                <option value="reserved">Reserved</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
              <button type="submit" className="button green">💾 Simpan</button>
              <button type="button" onClick={() => setEditData(null)} className="button gray">❌ Batal</button>
            </div>
          </form>
        </div>
      )}

      {/* Popup */}
      {popup.show && (
        <div className={`popup ${popup.type}`}>
          <div className="icon-container">
            <span className={`icon ${popup.type}`}>
              {popup.type === 'info' ? '?' :
               popup.type === 'success' ? '✔' :
               popup.type === 'error' ? '✖' : '⚠'}
            </span>
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
              <button onClick={() => { popup.onConfirm?.(); setPopup({ ...popup, show: false }); }} className="button red">Ya, Lanjutkan</button>
              <button onClick={() => { popup.onCancel?.(); setPopup({ ...popup, show: false }); }} className="button gray">Tidak, Batal</button>
            </div>
          ) : (
            <button onClick={() => setPopup({ ...popup, show: false })} className={`button ${popup.type === 'success' ? 'green' : popup.type === 'error' ? 'red' : 'yellow'}`}>Tutup</button>
          )}
        </div>
      )}
    </div>
  );
}

export default IPList;
