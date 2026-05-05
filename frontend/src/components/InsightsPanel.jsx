import React from 'react';

const severityConfig = {
  'good': { color: '#10b981', label: 'Healthy flow' },
  'warning': { color: '#f59e0b', label: 'Needs Review' },
  'critical': { color: '#ef4444', label: 'Critical Alert' },
};

export default function InsightsPanel({ currentMetrics }) {
  if (!currentMetrics) return null;

  const config = severityConfig[currentMetrics.severity] || severityConfig['good'];
  const { structuredInsight } = currentMetrics;

  return (
    <div className="glass-card insights-panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <span style={{
          background: config.color + '22', color: config.color, border: `1px solid ${config.color}55`,
          padding: '0.4rem 1rem', borderRadius: '999px', fontWeight: 600, fontSize: '0.9rem',
        }}>
          {config.label}
        </span>
        <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
          Confidence: <strong style={{ color: '#e2e8f0' }}>{structuredInsight.confidence}</strong>
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div>
          <h4 style={{ color: '#94a3b8', margin: '0 0 0.25rem 0', fontSize: '0.85rem', textTransform: 'uppercase' }}>Observation</h4>
          <p style={{ margin: 0, fontWeight: 500, color: '#f8fafc', fontSize: '1.05rem' }}>{structuredInsight.observation}</p>
        </div>
        
        <div>
          <h4 style={{ color: '#94a3b8', margin: '0 0 0.25rem 0', fontSize: '0.85rem', textTransform: 'uppercase' }}>Evidence</h4>
          <p style={{ margin: 0, color: '#cbd5e1', fontSize: '0.95rem' }}>{structuredInsight.evidence}</p>
        </div>

        <div>
          <h4 style={{ color: '#94a3b8', margin: '0 0 0.25rem 0', fontSize: '0.85rem', textTransform: 'uppercase' }}>Conclusion</h4>
          <p style={{ margin: 0, color: '#cbd5e1', fontSize: '0.95rem' }}>{structuredInsight.conclusion}</p>
        </div>

        <div style={{ background: 'rgba(59, 130, 246, 0.1)', borderLeft: '4px solid #3b82f6', padding: '1rem', borderRadius: '4px', marginTop: '0.5rem' }}>
          <h4 style={{ color: '#3b82f6', margin: '0 0 0.25rem 0', fontSize: '0.85rem', textTransform: 'uppercase' }}>Actionable Recommendation</h4>
          <p style={{ margin: 0, color: '#f8fafc', fontWeight: 500 }}>{structuredInsight.action}</p>
        </div>
      </div>
    </div>
  );
}
