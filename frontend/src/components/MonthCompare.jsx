import React from 'react';

export default function MonthCompare({ current, previous }) {
  if (!current || !previous) return null;

  const metrics = [
    { key: 'avg_lead_time_days', label: 'Lead Time', max: 10 },
    { key: 'avg_cycle_time_days', label: 'Cycle Time', max: 10 },
    { key: 'bug_rate_pct', label: 'Bug Rate', max: 100 }
  ];

  return (
    <div className="glass-card" style={{ marginTop: '1.5rem' }}>
      <h3 style={{ marginTop: 0, marginBottom: '1.5rem', color: '#f8fafc' }}>Month over Month</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {metrics.map(m => {
          const currVal = current[m.key];
          const prevVal = previous[m.key];
          const currPct = Math.min(100, (currVal / m.max) * 100);
          const prevPct = Math.min(100, (prevVal / m.max) * 100);

          return (
            <div key={m.key}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                <span style={{ color: '#94a3b8' }}>{m.label}</span>
                <span style={{ color: '#f8fafc' }}>{currVal} vs {prevVal}</span>
              </div>
              <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', background: '#475569', width: `${prevPct}%`, borderRadius: '4px', opacity: 0.5 }}></div>
                <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', background: '#3b82f6', width: `${currPct}%`, borderRadius: '4px' }}></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
