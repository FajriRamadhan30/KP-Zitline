import { useState, useEffect } from "react";
import "../components/CSS/ProfileAdmin.css";

function ProfileAdmin() {
  const [adminInfo, setAdminInfo] = useState({ username: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [popup, setPopup] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/admin/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error('Gagal mengambil data profil');

        const data = await response.json();
        setAdminInfo(data);
      } catch (error) {
        console.error('Error:', error);
        showPopup('❌ Gagal mengambil data profil', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminProfile();
  }, []);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(adminInfo),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message);

      showPopup('✅ Profil berhasil diperbarui', 'success');
      setEditMode(false);
    } catch (error) {
      console.error('Update error:', error);
      showPopup('❌ Gagal memperbarui profil', 'error');
    }
  };

  const showPopup = (message, type = 'success') => {
    setPopup({ show: true, message, type });
    setTimeout(() => setPopup({ show: false, message: '', type: 'success' }), 3000);
  };

  if (loading) return <div style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>Loading...</div>;

  return (
    <div className="profile-admin-container">
      <h2>👤 Admin Profile</h2>

      <div className="profile-card">
        <div className="profile-row">
          <label>Username:</label>
          {editMode ? (
            <input
              type="text"
              value={adminInfo.username}
              onChange={(e) => setAdminInfo({ ...adminInfo, username: e.target.value })}
            />
          ) : (
            <span>{adminInfo.username}</span>
          )}
        </div>

        <div className="profile-row">
          <label>Email:</label>
          {editMode ? (
            <input
              type="email"
              value={adminInfo.email}
              onChange={(e) => setAdminInfo({ ...adminInfo, email: e.target.value })}
            />
          ) : (
            <span>{adminInfo.email || '-'}</span>
          )}
        </div>
      </div>

      {editMode ? (
        <>
          <button onClick={handleSave} className="edit-profile-btn">💾 Simpan</button>
          <button onClick={() => setEditMode(false)} className="edit-profile-btn" style={{ backgroundColor: '#f44336', marginTop: '10px' }}>❌ Batal</button>
        </>
      ) : (
        <button onClick={() => setEditMode(true)} className="edit-profile-btn">✏️ Edit Profil</button>
      )}

      {/* Popup Section */}
      {popup.show && (
        <div style={{
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
          minWidth: '250px'
        }}>
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
            <span style={{
              color: popup.type === 'success' ? 'green' : 'red',
              fontSize: '28px',
              fontWeight: 'bold',
            }}>
              {popup.type === 'success' ? '✔' : '❌'}
            </span>
          </div>
          {popup.message}
        </div>
      )}
    </div>
  );
}

export default ProfileAdmin;
