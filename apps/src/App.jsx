import { useState } from 'react';
import IPList from './components/IPList';
import IPForm from './components/IPForm';
import IPLogs from './components/IPLogs';

function App() {
  const [view, setView] = useState('list');

  return (
    <div className="container">
      <h1>Zitline IP Management</h1>
      <div className="nav-buttons">
        <button onClick={() => setView('list')}>📋 View IPs</button>
        <button onClick={() => setView('form')}>➕ Add IP</button>
        <button onClick={() => setView('logs')}>📝 View Logs</button>
      </div>
      {view === 'list' && <IPList />}
      {view === 'form' && <IPForm />}
      {view === 'logs' && <IPLogs />}
    </div>
  );
}

export default App;
