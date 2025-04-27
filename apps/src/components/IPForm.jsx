import { useState } from 'react';
import { api } from '../api/api';

function IPForm() {
  const [formData, setFormData] = useState({
    ipAddress: '',
    subnet: '',
    assignedTo: '',
    description: '',
  });

  const [popup, setPopup] = useState({ show: false, message: '', type: 'success' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    api.post('/ips', formData)
      .then(() => {
        showPopup('✅ IP Address added!', 'success');
        setFormData({ ipAddress: '', subnet: '', assignedTo: '', description: '' });
      })
      .catch(err => {
        const message = err.response?.data?.message || 'Error submitting data';
        showPopup(`❌ ${message}`, 'error');
      });
  };

  const showPopup = (message, type = 'success') => {
    setPopup({ show: true, message, type });
    setTimeout(() => setPopup({ show: false, message: '', type: 'success' }), 3000);
  };

  // Styles
  const styles = {
    page: {
      backgroundColor: '#000',
      minHeight: '100vh',
      padding: '40px 20px',
      color: '#fff',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
    },
    formContainer: {
      width: '100%',
      maxWidth: '400px',
      padding: '25px',
      borderRadius: '8px',
      backgroundColor: '#111',
      color: '#fff',
      boxShadow: '0 0 10px rgba(255,255,255,0.1)',
    },
    formGroup: {
      marginBottom: '15px',
      width: '100%', // Pastikan semua form group memiliki lebar yang sama
    },
    input: {
      width: '100%',
      padding: '12px',
      borderRadius: '5px',
      border: '1px solid #555',
      fontSize: '16px',
      backgroundColor: '#333',
      color: '#fff',
      boxSizing: 'border-box', // Pastikan padding tidak mempengaruhi lebar total
    },
    select: {
      width: '100%',
      padding: '12px',
      borderRadius: '5px',
      border: '1px solid #555',
      fontSize: '16px',
      backgroundColor: '#333',
      color: '#fff',
      appearance: 'none',
      boxSizing: 'border-box',
    },
    textarea: {
      width: '100%',
      padding: '12px',
      borderRadius: '5px',
      border: '1px solid #555',
      fontSize: '16px',
      backgroundColor: '#333',
      color: '#fff',
      resize: 'vertical',
      minHeight: '100px',
      boxSizing: 'border-box',
      fontFamily: 'inherit', // Sesuaikan dengan font input lainnya
    },
    button: {
      width: '100%',
      padding: '12px',
      backgroundColor: '#4CAF50',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      fontSize: '16px',
      cursor: 'pointer',
      marginTop: '10px',
    },
    popup: {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: '#1a1a1a',
      color: 'red',
      padding: '30px 24px',
      border: '2px solid white',
      borderRadius: '10px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
      zIndex: 9999,
      fontSize: '16px',
      fontWeight: 'bold',
      textAlign: 'center',
      minWidth: '250px',
    },
    popupIcon: {
      backgroundColor: '#000',
      borderRadius: '50%',
      width: '50px',
      height: '50px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 20px',
      border: (type) => `2px solid ${type === 'success' ? 'green' : 'red'}`,
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.formContainer}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>➕ Add New IP</h2>
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <input
              type="text"
              name="ipAddress"
              placeholder="IP Address"
              value={formData.ipAddress}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
          
          <div style={styles.formGroup}>
            <input
              type="text"
              name="subnet"
              placeholder="Subnet"
              value={formData.subnet}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
          
          <div style={styles.formGroup}>
            <select
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleChange}
              required
              style={styles.select}
            >
              <option value="" disabled>Select Assignee</option>
              <option value="Customer">Customer</option>
              <option value="Operator">Operator</option>
              <option value="Office">Office</option>
            </select>
          </div>
          
          <div style={styles.formGroup}>
            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              style={styles.textarea}
            />
          </div>
          
          <button type="submit" style={styles.button}>Submit</button>
        </form>
      </div>

      {popup.show && (
        <div style={styles.popup}>
          <div style={{ ...styles.popupIcon, border: styles.popupIcon.border(popup.type) }}>
            <span style={{ 
              color: popup.type === 'success' ? 'green' : 'red', 
              fontSize: '28px', 
              fontWeight: 'bold' 
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

export default IPForm;
