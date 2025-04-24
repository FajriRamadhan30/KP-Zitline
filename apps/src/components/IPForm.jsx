import { useState } from 'react';
import { api } from '../api/api';

function IPForm() {
  const [formData, setFormData] = useState({
    ipAddress: '',
    subnet: '',
    assignedTo: '',
    description: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    api.post('/ips', formData)
      .then(() => alert('✅ IP Address added!'))
      .catch(err => alert(`❌ ${err.response?.data?.message || 'Error submitting data'}`));
  };

  const pageStyle = {
    backgroundColor: '#000',
    minHeight: '100vh',
    padding: '40px 20px',
    color: '#fff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
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
    backgroundColor: '#333', // abu-abu gelap
    color: '#fff',           // teks putih
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

  return (
    <div style={pageStyle}>
      <div style={formContainerStyle}>
        <h2 style={{ textAlign: 'center' }}>➕ Add New IP</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="ipAddress"
            placeholder="IP Address"
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <input
            type="text"
            name="subnet"
            placeholder="Subnet"
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <select
            name="assignedTo"
            onChange={handleChange}
            value={formData.assignedTo}
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
            onChange={handleChange}
            style={{ ...inputStyle, resize: 'vertical', minHeight: '80px' }}
          />
          <button type="submit" style={buttonStyle}>Submit</button>
        </form>
      </div>
    </div>
  );
}

export default IPForm;
