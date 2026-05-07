import React, { useState, useMemo } from 'react';
import { months } from '../utils/data';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import CustomTooltip from './CustomTooltip';

const DASHBOARD_BUDGET_LINES = [
  'Infrastructure',
  'Transport',
  'Utilities',
  'Housing',
  'Community',
  'Essential Maintenance of Government Housing Schemes',
  'Techcity',
  'Clean Sri Lanka',
  'Tourism Promotion and City Branding',
  'Siyak Nagara',
  'UDA Own Funded Projects',
  'Jaffna Townhall',
  'Solid Waste Management',
  'TechCity',
  'Consultancy Projects',
  '25 Cities',
  '10 Cities',
];

const getMonthlyValue = (proj, month, key) => {
  const monthKey = String(month).toLowerCase();
  const fromMonthlyProgress = proj?.monthlyProgress?.[monthKey]?.[key];
  if (fromMonthlyProgress !== undefined && fromMonthlyProgress !== null && fromMonthlyProgress !== '') {
    return fromMonthlyProgress;
  }

  const measures = proj?.measures || {};
  const measureKey = key === 'pp' ? 'PAC' : key === 'pt' ? 'PTC' : key === 'fp' ? 'FAC' : 'FTC';
  return measures?.[measureKey]?.[monthKey] ?? '';
};

const getProgressFromMonthly = (proj, numKey, denKey, fallbackPct) => {
  const values = [];
  for (const month of months) {
    const num = Number(getMonthlyValue(proj, month, numKey));
    const den = Number(getMonthlyValue(proj, month, denKey));
    if (!Number.isFinite(num) || !Number.isFinite(den) || den <= 0) continue;
    values.push((num / den) * 100);
  }

  if (!values.length) {
    const fallback = Number.parseFloat(fallbackPct);
    return Number.isFinite(fallback) ? fallback : 0;
  }

  const average = values.reduce((sum, value) => sum + value, 0) / values.length;
  return Math.max(0, Math.min(100, Math.round(average * 10) / 10));
};

const getPhysicalPct = (proj) => getProgressFromMonthly(proj, 'pp', 'pt', proj?.physicalProgress);
const getFinancialPct = (proj) => getProgressFromMonthly(proj, 'fp', 'ft', proj?.financialProgress);

const STAT_CONFIG = [
  {
    id:'ALL',       icon:'📊', lbl:'Total Projects',
    color:'#818cf8',
    getVal:(f)=>f.length,
  },
  {
    id:'ONGOING',   icon:'⏳', lbl:'Ongoing',
    color:'#fbbf24',
    getVal:(f)=>f.filter(p=>getPhysicalPct(p)<100).length,
  },
  {
    id:'DELAYED',   icon:'⚠️', lbl:'Delayed',
    color:'#f87171',
    getVal:(f)=>f.filter(p=>p.reasonsForDelays).length,
  },
  {
    id:'COMPLETED', icon:'✅', lbl:'Completed',
    color:'#34d399',
    getVal:(f)=>f.filter(p=>getPhysicalPct(p)>=100).length,
  },
];

const PIE_COLORS = {
  physical:  ['#10b981', 'var(--panel-2)'],
  financial: ['#6366f1', 'var(--panel-2)'],
};

function ProgressPieCard({ title, subtitle, value, palette }) {
  const pct  = Math.max(0, Math.min(100, Number(value) || 0));
  const data = [
    { name: 'Completed', value: pct },
    { name: 'Remaining', value: Math.max(0, 100 - pct) },
  ];

  return (
    <div className="card cp">
      <div className="ct2">{title}</div>
      <div className="cs" style={{ marginBottom: 10 }}>{subtitle}</div>
      <div style={{ position: 'relative' }}>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={58} outerRadius={84} paddingAngle={3} dataKey="value">
              {data.map((_, i) => <Cell key={i} fill={palette[i]} />)}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: 'var(--tx-2)', fontWeight: 700 }} />
          </PieChart>
        </ResponsiveContainer>
        <div className="dc">
          <div className="dc-p">{pct.toFixed(1)}%</div>
          <div className="dc-s">average</div>
        </div>
      </div>
    </div>
  );
}

const Dashboard = ({ projects, onCardClick }) => {
  const [bf, setBf] = useState('ALL');
  const filtered = useMemo(() => projects.filter(p => bf === 'ALL' || p.budgetLine === bf), [projects, bf]);

  const pp = useMemo(() => {
    if (!filtered.length) return 0;
    const vals = filtered.map(getPhysicalPct).filter(v => !isNaN(v));
    if (!vals.length) return 0;
    return Math.max(0, Math.min(100, vals.reduce((a,v)=>a+v,0)/vals.length));
  }, [filtered]);

  const fp = useMemo(() => {
    if (!filtered.length) return 0;
    const vals = filtered.map(getFinancialPct).filter(v => !isNaN(v));
    if (!vals.length) return 0;
    return Math.max(0, Math.min(100, vals.reduce((a,v)=>a+v,0)/vals.length));
  }, [filtered]);

  return (
    <>
      {/* ── Page banner ── */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0d1829 0%, #1e3a5f 45%, #6366f1 100%)',
          borderRadius: 16,
          padding: '28px 28px 22px',
          marginBottom: 24,
          position: 'relative',
          overflow: 'hidden',
          minHeight: 130,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
        }}
      >
        {/* decorative circles */}
        <div style={{ position:'absolute', top:-60, right:-40, width:200, height:200, borderRadius:'50%', background:'rgba(255,255,255,0.04)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:-40, left:60, width:120, height:120, borderRadius:'50%', background:'rgba(99,102,241,0.15)', pointerEvents:'none' }} />
        <div style={{ position:'relative', zIndex:1 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
            <span style={{ fontSize:10, fontWeight:800, letterSpacing:'0.08em', textTransform:'uppercase', padding:'3px 10px', borderRadius:6, background:'rgba(255,255,255,0.12)', border:'1px solid rgba(255,255,255,0.2)', color:'rgba(255,255,255,0.85)' }}>
              2026 Action Plan
            </span>
            <span style={{ fontSize:10, fontWeight:800, letterSpacing:'0.08em', textTransform:'uppercase', padding:'3px 10px', borderRadius:6, background:'rgba(16,185,129,0.22)', border:'1px solid rgba(16,185,129,0.4)', color:'#6ee7b7' }}>
              Live
            </span>
          </div>
          <h1 style={{ fontSize:26, fontFamily:'var(--fh)', fontWeight:800, color:'#fff', margin:0, letterSpacing:'-0.4px' }}>
            Project Health Overview
          </h1>
          <p style={{ color:'rgba(255,255,255,0.6)', fontSize:13, margin:'6px 0 0', fontWeight:500 }}>
            Urban Development Authority — Annual Action Plan portfolio snapshot
          </p>
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div className="dash-stat-grid">
        {STAT_CONFIG.map((s, i) => (
          <button
            key={s.id}
            type="button"
            className="dash-stat-card"
            onClick={() => onCardClick(s.id, bf)}
            style={{ '--tone': s.color, animationDelay: `${i * 70}ms` }}
          >
            <div className="dash-stat-head">
              <div style={{ display:'flex', alignItems:'center', gap:10, minWidth:0 }}>
                <span className="dash-stat-icon">{s.icon}</span>
                <div style={{ minWidth:0 }}>
                  <div className="dash-stat-label">{s.lbl}</div>
                  <div className="dash-stat-cta">Click to view list →</div>
                </div>
              </div>
              <div className="dash-stat-value">{s.getVal(filtered)}</div>
            </div>
          </button>
        ))}
      </div>

      {/* ── Filter row ── */}  
      <div
        className="fb"
        style={{ background:'var(--panel)', borderRadius:12, padding:'14px 16px', border:'1px solid var(--bd)', marginBottom:16 }}
      >
        <div className="fg">
          <span className="fl">Filter by Budget Line</span>
          <select className="fs" value={bf} onChange={e => setBf(e.target.value)} style={{ minWidth:280 }}>
            <option value="ALL">All Budget Lines</option>
            {DASHBOARD_BUDGET_LINES.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
          <button
            className="bp"
            onClick={() => onCardClick('ALL', bf)}
            style={{ whiteSpace:'nowrap' }}
            title="Show all projects for selected budget line"
          >
            Show Projects
          </button>
        </div>
        <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginTop:12 }}>
          <button
            type="button"
            className="bp"
            onClick={() => { setBf('ALL'); onCardClick('ALL', 'ALL'); }}
            style={{ padding:'7px 12px', background: bf === 'ALL' ? 'rgba(14,165,233,0.15)' : undefined }}
          >
            All
          </button>
          {DASHBOARD_BUDGET_LINES.map((line) => {
            const active = bf === line;
            return (
              <button
                key={line}
                type="button"
                className="bp"
                onClick={() => { setBf(line); onCardClick('ALL', line); }}
                style={{
                  padding:'7px 12px',
                  background: active ? 'rgba(14,165,233,0.15)' : undefined,
                  borderColor: active ? 'rgba(14,165,233,0.35)' : undefined,
                }}
                title={`Show projects in ${line}`}
              >
                {line}
              </button>
            );
          })}
        </div>
        {bf !== 'ALL' && (
          <div className="ft" style={{ color:'var(--acc)', fontWeight:700 }}>
            {filtered.length} project{filtered.length !== 1 ? 's' : ''} in {bf}
          </div>
        )}
      </div>

      {/* ── Progress pie charts ── */}
      <div className="cr2" style={{ marginTop:4 }}>
        <ProgressPieCard
          title="Physical Progress"
          subtitle="Average physical completion for current filter"
          value={pp}
          palette={PIE_COLORS.physical}
        />
        <ProgressPieCard
          title="Financial Progress"
          subtitle="Average financial completion for current filter"
          value={fp}
          palette={PIE_COLORS.financial}
        />
      </div>
    </>
  );
};

export default Dashboard;