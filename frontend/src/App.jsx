import { useState, useEffect } from 'react';
import './index.css';
import MetricCard from './components/MetricCard';
import InsightsPanel from './components/InsightsPanel';
import MonthCompare from './components/MonthCompare';
import HealthScore from './components/HealthScore';
import ManagerView from './components/ManagerView';

const METRIC_CONFIGS = [
  { key: 'avg_lead_time_days', title: 'Lead Time', unit: 'd', lowerIsBetter: true, color: '#3b82f6', tooltip: 'Total time from ticket start to production deployment.' },
  { key: 'avg_cycle_time_days', title: 'Cycle Time', unit: 'd', lowerIsBetter: true, color: '#c084fc', tooltip: 'Time spent actively coding and reviewing (excludes wait time).' },
  { key: 'bug_rate_pct', title: 'Bug Rate', unit: '%', lowerIsBetter: true, color: '#ef4444', tooltip: 'Percentage of merged code that resulted in an escaped bug.' },
  { key: 'merged_prs', title: 'PR Throughput', unit: '', lowerIsBetter: false, color: '#10b981', tooltip: 'Total number of Pull Requests merged this month.' },
  { key: 'prod_deployments', title: 'Deployments', unit: '', lowerIsBetter: false, color: '#f59e0b', tooltip: 'Number of times code was successfully pushed to production.' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('ic'); // 'ic' or 'manager'
  const [developers, setDevelopers] = useState([]);
  const [selectedDev, setSelectedDev] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [allMetrics, setAllMetrics] = useState([]);
  const [currentMetrics, setCurrentMetrics] = useState(null);
  const [prevMetrics, setPrevMetrics] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3001/api/developers')
      .then(r => r.json())
      .then(data => { setDevelopers(data); if (data.length > 0) setSelectedDev(data[0].id); });
  }, []);

  useEffect(() => {
    if (!selectedDev) return;
    setLoading(true);
    fetch(`http://localhost:3001/api/metrics/${selectedDev}`)
      .then(r => r.json())
      .then(data => {
        setAllMetrics(data);
        const months = data.map(d => d.month).sort();
        setSelectedMonth(months[months.length - 1]);
        setLoading(false);
      });
  }, [selectedDev]);

  useEffect(() => {
    if (!selectedMonth || allMetrics.length === 0) return;
    const curr = allMetrics.find(m => m.month === selectedMonth);
    const months = allMetrics.map(m => m.month).sort();
    const currIdx = months.indexOf(selectedMonth);
    const prev = currIdx > 0 ? allMetrics.find(m => m.month === months[currIdx - 1]) : null;
    setCurrentMetrics(curr || null);
    setPrevMetrics(prev || null);
  }, [selectedMonth, allMetrics]);

  const devInfo = developers.find(d => d.id === selectedDev);
  const initials = devInfo?.name?.split(' ').map(w => w[0]).join('') || '?';
  const availableMonths = allMetrics.map(m => m.month).sort();

  return (
    <div className="app-container">
      <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0 }}>DevPulse <span style={{ color: '#3b82f6' }}>Enhanced</span></h1>
          <p style={{ color: '#94a3b8', margin: '0.25rem 0 0 0' }}>Developer Productivity & Bottleneck Analysis</p>
        </div>
        <div className="glass-card" style={{ padding: '0.5rem', display: 'flex', gap: '0.5rem' }}>
          <button 
            onClick={() => setActiveTab('ic')}
            style={{ 
              background: activeTab === 'ic' ? '#3b82f6' : 'transparent',
              color: activeTab === 'ic' ? 'white' : '#94a3b8',
              border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600
            }}
          >IC View</button>
          <button 
            onClick={() => setActiveTab('manager')}
            style={{ 
              background: activeTab === 'manager' ? '#3b82f6' : 'transparent',
              color: activeTab === 'manager' ? 'white' : '#94a3b8',
              border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600
            }}
          >Manager View</button>
        </div>
      </header>

      {activeTab === 'ic' ? (
        <>
          <div style={{ marginBottom: '1.5rem' }}>
            <select className="custom-select" value={selectedDev} onChange={e => setSelectedDev(e.target.value)}>
              {developers.map(d => <option key={d.id} value={d.id}>{d.name} — {d.team}</option>)}
            </select>
            <select className="custom-select" value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)}>
              {availableMonths.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          {!loading && currentMetrics && (
            <>
              <div className="glass-card developer-profile" style={{ marginBottom: '1.5rem' }}>
                <div className="avatar">{initials}</div>
                <div className="dev-details">
                  <h2>{devInfo?.name}</h2>
                  <p>{devInfo?.team} &nbsp;·&nbsp; {currentMetrics.month}</p>
                </div>
              </div>

              <div style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid #3b82f6', color: '#60a5fa', padding: '1rem 1.5rem', borderRadius: '8px', marginBottom: '1.5rem', fontWeight: 600, fontSize: '1.1rem', textAlign: 'center' }}>
                💡 {currentMetrics.topSummary}
              </div>

              <div className="dashboard-grid">
                <div>
                  <HealthScore score={currentMetrics.healthScore} />

                  <div className="metrics-grid" style={{ marginBottom: '1.5rem' }}>
                    <div className="glass-card metric-card" style={{ borderTop: `3px solid #ef4444`, gridColumn: 'span 2' }}>
                      <div className="metric-title">🔥 Biggest Bottleneck</div>
                      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem', marginTop: '0.5rem' }}>
                        <div className="metric-value" style={{ color: '#ef4444', fontSize: '1.8rem' }}>
                          {currentMetrics.bottleneck.stage}
                        </div>
                        <div style={{ color: '#fca5a5', fontSize: '0.9rem', marginBottom: '0.3rem' }}>
                          Adds {currentMetrics.bottleneck.timeDays}d ({currentMetrics.bottleneck.impactPct}%) to Lead Time
                        </div>
                      </div>
                    </div>

                    {METRIC_CONFIGS.map(({ key, title, unit, lowerIsBetter, color, tooltip }) => (
                      <MetricCard
                        key={key} title={title} value={currentMetrics[key]} unit={unit}
                        tooltip={tooltip} prevValue={prevMetrics?.[key]} teamAvgValue={currentMetrics.teamAvg?.[key]}
                        lowerIsBetter={lowerIsBetter} accentColor={color}
                      />
                    ))}
                  </div>
                  <MonthCompare current={currentMetrics} previous={prevMetrics} />
                </div>
                
                <InsightsPanel currentMetrics={currentMetrics} />
              </div>
            </>
          )}
        </>
      ) : (
        <ManagerView />
      )}
    </div>
  );
}
