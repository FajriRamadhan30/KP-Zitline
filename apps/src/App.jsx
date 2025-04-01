import { useState } from 'react';
import IPList from './components/IPList';
import IPForm from './components/IPForm';
import IPLogs from './components/IPLogs';
import './App.css'; // Import CSS untuk Sidebar

function App() {
  const [view, setView] = useState('list');

  return (
    <div className="app-container">
      {/* Sidebar */}
      <nav className="sidebar">
        <h2 className="sidebar-title">Zitline IP</h2>
        <ul>
          <li className={view === 'Dashboard' ? 'active' : ''} onClick={() => setView('Dashboard')}>📊 Dashboard</li>
          <li className={view === 'list' ? 'active' : ''} onClick={() => setView('list')}>📋 View IPs</li>
          <li className={view === 'form' ? 'active' : ''} onClick={() => setView('form')}>➕ Add IP</li>
          <li className={view === 'logs' ? 'active' : ''} onClick={() => setView('logs')}>📝 View Logs</li>
        </ul>
      </nav>

      {/* Content */}
      <div className="content">
        <h1>Zitline IP Management</h1>
        {view === 'Dashboard' && <Dashboard />}
        {view === 'list' && <IPList />}
        {view === 'form' && <IPForm />}
        {view === 'logs' && <IPLogs />}
      </div>
    </div>
  );
}

export default App;
