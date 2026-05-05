import React from 'react';

export default function HealthScore({ score }) {
  let color = '#10b981';
  if (score < 80) color = '#f59e0b';
  if (score < 50) color = '#ef4444';

  const strokeDasharray = `${score}, 100`;

  return (
    <div className="glass-card" style={{ display: 'flex', alignItems: 'center', padding: '1.5rem', marginBottom: '1.5rem' }}>
      <div style={{ position: 'relative', width: '80px', height: '80px', marginRight: '1.5rem' }}>
        <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%' }}>
          <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" style={{ fill: 'none', stroke: 'rgba(255,255,255,0.1)', strokeWidth: '3' }} />
          <path strokeDasharray={strokeDasharray} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" style={{ fill: 'none', stroke: color, strokeWidth: '3', strokeLinecap: 'round' }} />
          <text x="18" y="20.35" style={{ fill: '#fff', fontSize: '10px', fontWeight: 'bold', textAnchor: 'middle' }}>{score}</text>
        </svg>
      </div>
      <div>
        <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#f8fafc' }}>DevPulse Health Score</h3>
        <p style={{ margin: '0.25rem 0 0 0', color: '#94a3b8', fontSize: '0.9rem' }}>Composite score based on Speed (40%), Quality (40%), and Throughput (20%).</p>
      </div>
    </div>
  );
}
