import { useState } from 'react';
import { api } from '../api/api';
import '../components/CSS/IPForm.css'; // Import file CSS di sini

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

  return (
    <div className="ipform-page"> {/* Ganti style={styles.page} dengan className */}
      <div className="ipform-container"> {/* Ganti style={styles.formContainer} dengan className */}
        <h2 className="ipform-title">➕ Add New IP</h2> {/* Ganti style={styles.title} dengan className */}
        <form onSubmit={handleSubmit}>
          <div className="ipform-form-group"> {/* Ganti style={styles.formGroup} dengan className */}
            <input
              type="text"
              name="ipAddress"
              placeholder="IP Address"
              value={formData.ipAddress}
              onChange={handleChange}
              required
              className="ipform-input" // Ganti style={styles.input} dengan className
            />
          </div>
          
          <div className="ipform-form-group">
            <input
              type="text"
              name="subnet"
              placeholder="Subnet"
              value={formData.subnet}
              onChange={handleChange}
              required
              className="ipform-input"
            />
          </div>
          
          <div className="ipform-form-group">
            <select
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleChange}
              required
              className="ipform-select" // Ganti style={styles.select} dengan className
            >
              <option value="" disabled>Select Assignee</option>
              <option value="Customer">Customer</option>
              <option value="Operator">Operator</option>
              <option value="Office">Office</option>
            </select>
          </div>
          
          <div className="ipform-form-group">
            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              className="ipform-textarea" // Ganti style={styles.textarea} dengan className
            />
          </div>
          
          <button type="submit" className="ipform-button">Submit</button> {/* Ganti style={styles.button} dengan className */}
        </form>
      </div>

      {/* Pop-up */}
      {popup.show && (
        <div className="ipform-popup-overlay"> {/* Tambahkan overlay agar pop-up selalu di tengah layar */}
            <div className={`ipform-popup ${popup.type}`}> {/* Ganti style={styles.popup} dan tambahkan class type */}
                {popup.type === 'error' ? (
                    <>
                        <div className={`ipform-popup-icon-container ${popup.type}`}> {/* Tambahkan class type */}
                            <span className="ipform-popup-icon-x">
                                &times;
                            </span>
                        </div>
                        <div className={`ipform-popup-message ${popup.type}`}>
                            {popup.message.replace('❌ ', '')}
                        </div>
                    </>
                ) : (
                    <>
                        <div className={`ipform-popup-icon-container ${popup.type}`}> {/* Tambahkan class type */}
                            <span className="ipform-popup-icon-check">✔</span>
                        </div>
                        <div className={`ipform-popup-message ${popup.type}`}>
                            {popup.message.replace('✅ ', '')}
                        </div>
                    </>
                )}
            </div>
        </div>
      )}
    </div>
  );
}

export default IPForm;