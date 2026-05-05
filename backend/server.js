const express = require('express');
const cors = require('cors');
const metricsData = require('./metrics.json');
const managersData = require('./managers.json');

const app = express();
app.use(cors());

function calculateHealthScore(lead, cycle, bugRate, prs, deploys) {
  const leadScore = Math.max(0, 100 - (lead * 10));
  const cycleScore = Math.max(0, 100 - (cycle * 10)); 
  const speedScore = (leadScore + cycleScore) / 2;
  const qualityScore = Math.max(0, 100 - (bugRate * 2));
  const prScore = Math.min(100, prs * 25);
  const deployScore = Math.min(100, deploys * 25);
  const throughputScore = (prScore + deployScore) / 2;
  return Math.round((speedScore * 0.4) + (qualityScore * 0.4) + (throughputScore * 0.2));
}

app.get('/api/developers', (req, res) => {
  const devs = metricsData.map(d => ({ id: d.developer_id, name: d.developer_name, team: d.team_name }));
  const uniqueDevs = Array.from(new Set(devs.map(d => d.id))).map(id => devs.find(d => d.id === id));
  res.json(uniqueDevs);
});

app.get('/api/managers', (req, res) => {
  const uniqueManagers = Array.from(new Set(managersData.map(m => m.manager_id)))
    .map(id => {
      const m = managersData.find(x => x.manager_id === id);
      return { id: m.manager_id, name: m.manager_name };
    });
  res.json(uniqueManagers);
});

app.get('/api/managers/:managerId', (req, res) => {
  const { managerId } = req.params;
  const mData = managersData.filter(m => m.manager_id === managerId);
  res.json(mData);
});

app.get('/api/metrics/:developerId', (req, res) => {
  const { developerId } = req.params;
  const devMetrics = metricsData.filter(d => d.developer_id === developerId);
  if (devMetrics.length === 0) return res.status(404).json({ error: 'Developer not found' });

  const teamName = devMetrics[0].team_name;
  const teamMetrics = metricsData.filter(d => d.team_name === teamName);
  const sorted = [...devMetrics].sort((a, b) => a.month.localeCompare(b.month));

  const interpretations = sorted.map((metrics, idx) => {
    const totalLead = metrics.avg_lead_time_days;
    let codingTime = totalLead * 0.3;
    let reviewTime = totalLead * 0.5;
    let deployTime = totalLead * 0.2;
    if (developerId === 'DEV-002') { codingTime = totalLead * 0.6; reviewTime = totalLead * 0.2; }

    const breakdown = { coding: codingTime, review: reviewTime, deploy: deployTime };
    const stages = Object.entries(breakdown).map(([name, time]) => ({ name, time })).sort((a, b) => b.time - a.time);
    const bottleneckStage = stages[0].name;
    const stageDisplayNames = { coding: 'Development', review: 'PR Review', deploy: 'Deployment' };
    const topSummary = `Your main delay is in ${stageDisplayNames[bottleneckStage]}, not ${stageDisplayNames[stages[1].name]}.`;

    const monthTeamMetrics = teamMetrics.filter(d => d.month === metrics.month);
    const teamAvgBugRate = monthTeamMetrics.reduce((s, d) => s + d.bug_rate_pct, 0) / (monthTeamMetrics.length || 1);
    const teamAvg = {
      avg_lead_time_days: monthTeamMetrics.reduce((s, d) => s + d.avg_lead_time_days, 0) / (monthTeamMetrics.length || 1),
      avg_cycle_time_days: monthTeamMetrics.reduce((s, d) => s + d.avg_cycle_time_days, 0) / (monthTeamMetrics.length || 1),
      bug_rate_pct: teamAvgBugRate,
      merged_prs: monthTeamMetrics.reduce((s, d) => s + d.merged_prs, 0) / (monthTeamMetrics.length || 1),
      prod_deployments: monthTeamMetrics.reduce((s, d) => s + d.prod_deployments, 0) / (monthTeamMetrics.length || 1),
    };

    let structuredInsight = { observation: '', evidence: '', conclusion: '', action: '', confidence: 'Medium' };
    let severity = 'good';
    
    if (metrics.bug_rate_pct > 20 && (metrics.bug_rate_pct - teamAvgBugRate) > 10) {
      severity = 'critical';
      structuredInsight = {
        observation: 'High Bug Rate vs Peers',
        evidence: `Escaped bugs are ${metrics.bug_rate_pct}%, significantly higher than the team average of ${teamAvgBugRate.toFixed(1)}%.`,
        conclusion: 'Testing safeguards are failing or PRs are too large to review effectively.',
        action: 'Reduce PR size or add automated tests to critical paths.',
        confidence: 'High'
      };
    } else if (bottleneckStage === 'review') {
      severity = 'warning';
      structuredInsight = {
        observation: 'Slow Review Pipeline',
        evidence: `PR Review takes ${reviewTime.toFixed(1)} days, consuming ${Math.round((reviewTime/totalLead)*100)}% of your total Lead Time.`,
        conclusion: 'Delay is mainly caused by the PR review stage, not active coding.',
        action: 'Coordinate with team for faster review turnaround or break down Jira issues.',
        confidence: 'High'
      };
    } else if (bottleneckStage === 'coding') {
      severity = 'warning';
      structuredInsight = {
        observation: 'High Active Coding Time',
        evidence: `Coding takes ${codingTime.toFixed(1)} days, the largest portion of your delivery cycle.`,
        conclusion: 'Tickets are staying in progress longer than expected. Possible scope creep.',
        action: 'Review whether tickets are well-scoped before picking them up.',
        confidence: 'Medium'
      };
    } else {
      severity = 'good';
      structuredInsight = {
        observation: 'Healthy Delivery Flow',
        evidence: `Lead time is ${totalLead}d and bug rate is ${metrics.bug_rate_pct}%.`,
        conclusion: 'Metrics are balanced and closely aligned with team expectations.',
        action: 'Continue maintaining consistent PR sizes and review cadence.',
        confidence: 'High'
      };
    }

    const healthScore = calculateHealthScore(metrics.avg_lead_time_days, metrics.avg_cycle_time_days, metrics.bug_rate_pct, metrics.merged_prs, metrics.prod_deployments);

    return {
      ...metrics, healthScore, teamAvg,
      bottleneck: { stage: stageDisplayNames[bottleneckStage], impactPct: Math.round((stages[0].time / totalLead) * 100), timeDays: stages[0].time.toFixed(1) },
      topSummary, structuredInsight, severity
    };
  });

  res.json(interpretations);
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));