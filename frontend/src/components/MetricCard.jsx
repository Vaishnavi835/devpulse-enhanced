import React from 'react';

const metricIcons = { 'Lead Time': '🚀', 'Cycle Time': '⏱️', 'PR Throughput': '🔀', 'Deployments': '📦', 'Bug Rate': '🐛' };

function getTrend(value, prevValue, lowerIsBetter = true) {
  if (prevValue === undefined) return null;
  const improved = lowerIsBetter ? value < prevValue : value > prevValue;
  const delta = Math.abs(value - prevValue).toFixed(1);
  return { improved, delta };
}

export default function MetricCard({ title, value, unit, prevValue, teamAvgValue, tooltip, lowerIsBetter = true, accentColor }) {
  const trend = getTrend(value, prevValue, lowerIsBetter);
  const isGood = trend?.improved;
  const trendClass = !trend ? '' : isGood ? 'trend-good' : 'trend-bad';
  const trendArrow = !trend ? '' : isGood ? '▼' : '▲';

  let vsTeamBadge = null;
  if (teamAvgValue !== undefined && teamAvgValue !== null) {
    const isBetter = lowerIsBetter ? value <= teamAvgValue : value >= teamAvgValue;
    let badgeClass = isBetter ? 'trend-good' : 'trend-bad';
    const percentDiff = teamAvgValue > 0 ? Math.round(Math.abs(value - teamAvgValue) / teamAvgValue * 100) : 0;
    
    let text = isBetter ? `🔥 Top Performer` : `⚠️ Below Avg`;
    if (percentDiff > 0) {
      text = isBetter ? `🔥 ${percentDiff}% better than avg` : `⚠️ ${percentDiff}% worse than avg`;
    } else if (value === teamAvgValue) {
       text = '⚖️ Average';
       badgeClass = '';
    }

    vsTeamBadge = (
      <div style={{ fontSize: '0.75rem', marginTop: '0.5rem', fontWeight: 600, color: badgeClass === 'trend-good' ? '#10b981' : badgeClass === 'trend-bad' ? '#ef4444' : '#94a3b8' }}>
        {text}
      </div>
    );
  }

  return (
    <div className="glass-card metric-card" style={{ borderTop: `3px solid ${accentColor}` }}>
      <div className="metric-title" title={tooltip} style={{ cursor: 'help' }}>
        {metricIcons[title] || '📊'} {title} <span style={{fontSize: '0.8rem', opacity: 0.5}}>ⓘ</span>
      </div>
      <div className="metric-value" style={{ color: accentColor }}>
        {value}{unit}
      </div>
      {trend && (
        <div className={`metric-trend ${trendClass}`}>
          {trendArrow} {trend.delta}{unit} vs last month
        </div>
      )}
      {!trend && <div className="metric-trend" style={{ color: '#475569' }}>—</div>}
      {vsTeamBadge}
    </div>
  );
}
