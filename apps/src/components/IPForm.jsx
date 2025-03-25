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
      .catch(err => alert(`❌ ${err.response.data.message}`));
  };

  return (
    <div>
      <h2>➕ Add New IP</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="ipAddress" placeholder="IP Address" onChange={handleChange} required />
        <input type="text" name="subnet" placeholder="Subnet" onChange={handleChange} required />
        <input type="text" name="assignedTo" placeholder="Assigned To" onChange={handleChange} />
        <textarea name="description" placeholder="Description" onChange={handleChange} />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default IPForm;
