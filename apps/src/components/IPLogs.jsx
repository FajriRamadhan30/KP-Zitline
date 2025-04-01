import { useEffect, useState } from 'react';
import { api } from '../api/api';
import '../components/CSS/IPLogs.css';

function IPLogs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    api.get('/ips/logs')
      .then(res => setLogs(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="logs-container">
      <h2>📝 Access Logs</h2>
      <table className="logs-table">
        <thead>
          <tr>
            <th>IP Address</th>
            <th>Endpoint</th>
            <th>Date</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {logs.length > 0 ? (
            logs.map(log => {
              const logDate = new Date(log.timestamp);
              const formattedDate = logDate.toLocaleDateString(); // Format: 01/04/2025
              const formattedTime = logDate.toLocaleTimeString(); // Format: 18:34:02

              return (
                <tr key={log.id}>
                  <td>{log.ipAddress}</td>
                  <td>{log.endpoint}</td>
                  <td>{formattedDate}</td>
                  <td>{formattedTime}</td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center', padding: '15px', color: '#bbb' }}>
                No logs available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default IPLogs;
