import React, { useState, useEffect } from 'react';

export default function ManagerView() {
  const [managers, setManagers] = useState([]);
  const [selectedManager, setSelectedManager] = useState('');
  const [managerData, setManagerData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/managers')
      .then(r => r.json())
      .then(data => { setManagers(data); if (data.length > 0) setSelectedManager(data[0].id); });
  }, []);

  useEffect(() => {
    if (!selectedManager) return;
    setLoading(true);
    fetch(`/api/managers/${selectedManager}`)
      .then(r => r.json())
      .then(data => { setManagerData(data); setLoading(false); });
  }, [selectedManager]);

  return (
    <div className="manager-view">
      <div style={{ marginBottom: '1.5rem' }}>
        <select className="custom-select" value={selectedManager} onChange={e => setSelectedManager(e.target.value)}>
          {managers.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
      </div>

      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.05)', color: '#94a3b8', fontSize: '0.85rem' }}>
              <th style={{ padding: '1rem' }}>Month</th>
              <th style={{ padding: '1rem' }}>Team Size</th>
              <th style={{ padding: '1rem' }}>Avg Lead Time</th>
              <th style={{ padding: '1rem' }}>Avg Cycle Time</th>
              <th style={{ padding: '1rem' }}>Bug Rate</th>
              <th style={{ padding: '1rem' }}>Signal</th>
            </tr>
          </thead>
          <tbody>
            {managerData.map((row, i) => (
              <tr key={i} style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '1rem', fontWeight: 600 }}>{row.month}</td>
                <td style={{ padding: '1rem' }}>{row.team_size}</td>
                <td style={{ padding: '1rem' }}>{row.avg_lead_time_days}d</td>
                <td style={{ padding: '1rem' }}>{row.avg_cycle_time_days}d</td>
                <td style={{ padding: '1rem' }}>{row.avg_bug_rate_pct}%</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{
                    background: row.signal === 'Healthy flow' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                    color: row.signal === 'Healthy flow' ? '#10b981' : '#f59e0b',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '999px',
                    fontSize: '0.85rem',
                    fontWeight: 600
                  }}>
                    {row.signal}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
