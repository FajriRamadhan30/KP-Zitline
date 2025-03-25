import { useEffect, useState } from 'react';
import { api } from '../api/api';

function IPLogs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    api.get('/ips/logs')
      .then(res => setLogs(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>📝 Access Logs</h2>
      <ul>
        {logs.map(log => (
          <li key={log.id}>
            <strong>IP:</strong> {log.ipAddress} | <strong>Endpoint:</strong> {log.endpoint} | <strong>Time:</strong> {new Date(log.timestamp).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default IPLogs;
