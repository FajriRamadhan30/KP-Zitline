import { useEffect, useState } from 'react';
import { api } from '../api/api';

function IPList() {
  const [ips, setIPs] = useState([]);

  useEffect(() => {
    api.get('/ips')
      .then(res => setIPs(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>📋 IP List</h2>
      <table border="1" width="100%">
        <thead>
          <tr>
            <th>ID</th>
            <th>IP Address</th>
            <th>Subnet</th>
            <th>Assigned To</th>
            <th>Description</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {ips.map(ip => (
            <tr key={ip.id}>
              <td>{ip.id}</td>
              <td>{ip.ipAddress}</td>
              <td>{ip.subnet}</td>
              <td>{ip.assignedTo}</td>
              <td>{ip.description}</td>
              <td>{ip.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default IPList;
