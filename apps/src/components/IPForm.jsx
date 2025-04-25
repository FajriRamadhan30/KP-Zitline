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

  const pageStyle = {
    backgroundColor: '#000',
    minHeight: '100vh',
    padding: '40px 20px',
    color: '#fff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  };

  const formContainerStyle = {
    width: '100%',
    maxWidth: '400px',
    padding: '20px',
    borderRadius: '8px',
    backgroundColor: '#111',
    color: '#fff',
    boxShadow: '0 0 10px rgba(255,255,255,0.1)',
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '5px',
    border: '1px solid #555',
    fontSize: '16px',
    backgroundColor: '#333',
    color: '#fff',
  };

  const buttonStyle = {
    width: '100%',
    padding: '10px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
  };

  const popupStyle = {
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
  };

  return (
    <div style={pageStyle}>
      <div style={formContainerStyle}>
        <h2 style={{ textAlign: 'center' }}>➕ Add New IP</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="ipAddress"
            placeholder="IP Address"
            value={formData.ipAddress}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <input
            type="text"
            name="subnet"
            placeholder="Subnet"
            value={formData.subnet}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <select
            name="assignedTo"
            value={formData.assignedTo}
            onChange={handleChange}
            style={inputStyle}
            required
          >
            <option value="" disabled>Select Assignee</option>
            <option value="Customer">Customer</option>
            <option value="Operator">Operator</option>
            <option value="Office">Office</option>
          </select>
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            style={{ ...inputStyle, resize: 'vertical', minHeight: '80px' }}
          />
          <button type="submit" style={buttonStyle}>Submit</button>
        </form>
      </div>

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
            border: `2px solid ${popup.type === 'success' ? 'green' : 'red'}`, // Border color dynamic
          }}>
            <span style={{ color: popup.type === 'success' ? 'green' : 'red', fontSize: '28px', fontWeight: 'bold' }}>
              {popup.type === 'success' ? '✔' : '❌'} {/* Success (green) or error (red) icon */}
            </span>
          </div>
          {popup.message}
        </div>
      )}
    </div>
  );
}

export default IPForm;
