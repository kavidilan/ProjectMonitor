import React, { useState, useMemo } from 'react';
import { budgetLineConfig, months } from '../utils/data';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import CustomTooltip from './CustomTooltip';

const DASHBOARD_BUDGET_LINES = Object.keys(budgetLineConfig);

/* ─────────────────────────────────────────────────────────
   CORE HELPER: Get the latest cumulative PAC/PTC/FAC/FTC
   for a project. Priority order:
   1. monthlyProgress[month].pp / .pt / .fp / .ft  (Data Entry Table input)
   2. measures.PAC/PTC/FAC/FTC[month]              (legacy measures store)
   For cumulative data: use the LAST month that has a valid value.
   Fallback: use static physicalProgress / financialProgress field.
───────────────────────────────────────────────────────── */
const MONTH_ORDER = [
  'january','february','march','april','may','june',
  'july','august','september','october','november','december'
];

const getLatestCumulativeValue = (proj, progressKey, measuresKey) => {
  // 1. Scan monthlyProgress in reverse order (latest month first)
  const mp = proj?.monthlyProgress || {};
  for (let i = MONTH_ORDER.length - 1; i >= 0; i--) {
    const month = MONTH_ORDER[i];        
    const raw = mp[month]?.[progressKey];
    if (raw !== undefined && raw !== null && raw !== '') {
      const n = parseFloat(String(raw).replace('%', ''));
      if (!isNaN(n)) return n;
    }
  }
  // 2. Fallback: scan measures[measuresKey] in reverse order
  const meas = proj?.measures?.[measuresKey] || {};
  for (let i = MONTH_ORDER.length - 1; i >= 0; i--) {
    const month = MONTH_ORDER[i];
    const raw = meas[month];
    if (raw !== undefined && raw !== null && raw !== '') {
      const n = parseFloat(String(raw).replace('%', ''));
      if (!isNaN(n)) return n;
    }
  }
  return null;
};

// Physical Progress (%) = (PAC ÷ PTC) × 100
// PAC = latest cumulative Physical Achieved, PTC = latest cumulative Physical Target
const getPhysicalProgress = (proj) => {
  const pac = getLatestCumulativeValue(proj, 'pp', 'PAC');
  const ptc = getLatestCumulativeValue(proj, 'pt', 'PTC');

  if (pac !== null && ptc !== null && ptc > 0) {
    return Math.round((pac / ptc) * 100 * 10) / 10;
  }

  // Fallback to static physicalProgress field
  const raw = proj?.physicalProgress;
  if (raw !== undefined && raw !== null && raw !== '') {
    const n = parseFloat(String(raw).replace('%', ''));
    if (!isNaN(n)) return n;
  }
  return 0;
};

// Financial Progress (%) = (FAC ÷ FTC) × 100
// FAC = latest cumulative Financial Achieved, FTC = latest cumulative Financial Target
const getFinancialProgress = (proj) => {
  const fac = getLatestCumulativeValue(proj, 'fp', 'FAC');
  const ftc = getLatestCumulativeValue(proj, 'ft', 'FTC');

  if (fac !== null && ftc !== null && ftc > 0) {
    return Math.round((fac / ftc) * 100 * 10) / 10;
  }

  // Fallback to static financialProgress field
  const raw = proj?.financialProgress;
  if (raw !== undefined && raw !== null && raw !== '') {
    const n = parseFloat(String(raw).replace('%', ''));
    if (!isNaN(n)) return n;
  }
  return 0;
};

// Physical Variance = PAC - PTC (latest cumulative values)
const getPhysicalVariance = (proj) => {
  const pac = getLatestCumulativeValue(proj, 'pp', 'PAC') ?? 0;
  const ptc = getLatestCumulativeValue(proj, 'pt', 'PTC') ?? 0;
  return pac - ptc;
};

// Financial Variance = FTC - FAC (latest cumulative values)
const getFinancialVariance = (proj) => {
  const fac = getLatestCumulativeValue(proj, 'fp', 'FAC') ?? 0;
  const ftc = getLatestCumulativeValue(proj, 'ft', 'FTC') ?? 0;
  return ftc - fac;
};

// Schedule Status: Green if PAC >= PTC (progress 100%+), Red if behind
const getScheduleStatus = (proj) => getPhysicalProgress(proj) >= 100 ? 'green' : 'red';

// Budget Status: Green if FAC <= FTC (progress 100% or less), Red if over budget
const getBudgetStatus = (proj) => getFinancialProgress(proj) <= 100 ? 'green' : 'red';

const getPhysicalPct  = (proj) => getPhysicalProgress(proj);
const getFinancialPct = (proj) => getFinancialProgress(proj);

// Behind Schedule = end date has passed today AND project not yet complete
const isOverdue = (proj) => {
  if (!proj?.endDate) return false;
  const end = new Date(proj.endDate);
  if (isNaN(end.getTime())) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return end < today && getPhysicalPct(proj) < 100;
};


const STAT_CONFIG = [
  {
    id:'ALL',       icon:'📊', lbl:'Total Projects',
    color:'#0e7490',
    getVal:(f)=>f.length,
  },
  {
    id:'ONGOING',   icon:'⏳', lbl:'Ongoing',
    color:'#d97706',
    getVal:(f)=>f.filter(p=>getPhysicalPct(p)<100).length,
  },
  {
    id:'DELAYED',   icon:'⚠️', lbl:'Behind Schedule',
    color:'#dc2626',
    getVal:(f)=>f.filter(p=>isOverdue(p)).length,
  },
  {
    id:'COMPLETED', icon:'', lbl:'Completed',
    color:'#0f766e',
    getVal:(f)=>f.filter(p=>getPhysicalPct(p)>=100).length,
  },
];

const PIE_COLORS = {
  physical:  ['#10b981', 'var(--panel-2)'],
  financial: ['#0e7490', 'var(--panel-2)'],
};

function ProgressPieCard({ title, subtitle, value, palette, variance, status }) {
  const pct  = Math.max(0, Math.min(100, Number(value) || 0));
  // For display: clamp to 100%, but show actual value if over 100%
  const displayPct = Number(value) || 0;
  const isOver100 = displayPct > 100;
  
  const statusColor = status === 'green' ? '#10b981' : status === 'red' ? '#ef4444' : '#6b7280';
  const statusLabel = status === 'green' ? '✓ On Track' : status === 'red' ? '⚠ At Risk' : 'Pending';
  
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
          <div className="dc-p">{isOver100 ? displayPct.toFixed(1) : pct.toFixed(1)}%</div>
          <div className="dc-s">{isOver100 ? 'over target' : 'average'}</div>
        </div>
      </div>
    </div>
  );
}

const Dashboard = ({ projects, onCardClick, selectedProjectId, onSelectProject }) => {
  const [bf, setBf] = useState('ALL');
  const filtered = useMemo(() => projects.filter(p => bf === 'ALL' || p.budgetLine === bf), [projects, bf]);
  const selectedProject = useMemo(
    () => filtered.find((p) => String(p.id) === String(selectedProjectId)) || null,
    [filtered, selectedProjectId],
  );
  const chartProjects = useMemo(
    () => (selectedProject ? [selectedProject] : filtered),
    [filtered, selectedProject],
  );

  const pp = useMemo(() => {
    if (!chartProjects.length) return 0;
    const vals = chartProjects.map(getPhysicalPct).filter(v => !isNaN(v));
    if (!vals.length) return 0;
    return Math.max(0, Math.min(100, vals.reduce((a,v)=>a+v,0)/vals.length));
  }, [chartProjects]);

  const fp = useMemo(() => {
    if (!chartProjects.length) return 0;
    const vals = chartProjects.map(getFinancialPct).filter(v => !isNaN(v));
    if (!vals.length) return 0;
    return Math.max(0, Math.min(100, vals.reduce((a,v)=>a+v,0)/vals.length));
  }, [chartProjects]);

  return (
    <>
      <div style={{ background: 'linear-gradient(135deg, #0b1324 0%, #0e3a56 45%, #0f766e 100%)', borderRadius: 16, padding: '28px 28px 22px', marginBottom: 24, position: 'relative', overflow: 'hidden', minHeight: 130, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
        <div style={{ position:'absolute', top:-60, right:-40, width:200, height:200, borderRadius:'50%', background:'rgba(255,255,255,0.04)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:-40, left:60, width:120, height:120, borderRadius:'50%', background:'rgba(99,102,241,0.15)', pointerEvents:'none' }} />
        <div style={{ position:'relative', zIndex:1 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
            <span style={{ fontSize:10, fontWeight:800, letterSpacing:'0.08em', textTransform:'uppercase', padding:'3px 10px', borderRadius:6, background:'rgba(255,255,255,0.12)', border:'1px solid rgba(255,255,255,0.2)', color:'rgba(255,255,255,0.85)' }}>2026 Action Plan</span>
            <span style={{ fontSize:10, fontWeight:800, letterSpacing:'0.08em', textTransform:'uppercase', padding:'3px 10px', borderRadius:6, background:'rgba(14,116,144,0.2)', border:'1px solid rgba(14,116,144,0.4)', color:'#67e8f9' }}>Live</span>
          </div>
          <h1 style={{ fontSize:26, fontFamily:'var(--fh)', fontWeight:800, color:'#fff', margin:0, letterSpacing:'-0.4px' }}>Project Health Overview</h1>
        </div>
      </div>

      <div className="dash-stat-grid">
        {STAT_CONFIG.map((s, i) => (
          <button key={s.id} type="button" className="dash-stat-card" onClick={() => onCardClick(s.id, bf)} style={{ '--tone': s.color, animationDelay: `${i * 70}ms` }}>
            <div className="dash-stat-head">
              <div style={{ display:'flex', alignItems:'center', gap:10, minWidth:0 }}>
                <span className="dash-stat-icon">{s.icon}</span>
                <div style={{ minWidth:0 }}>
                  <div className="dash-stat-label">{s.lbl}</div>
                  {s.id !== 'DELAYED' && <div className="dash-stat-cta">Click to view list →</div>}
                </div>
              </div>
              <div className="dash-stat-value">{s.getVal(filtered)}</div>
            </div>
          </button>
        ))}
      </div>

      <div className="fb" style={{ background:'var(--panel)', borderRadius:12, padding:'14px 16px', border:'1px solid var(--bd)', marginBottom:16 }}>
        <div className="fg">
          <span className="fl">Filter by Budget line</span>
          <select className="fs" value={bf} onChange={e => { setBf(e.target.value); onSelectProject?.(''); }} style={{ minWidth:280 }}>
            <option value="ALL">All Budget Lines</option>
            {DASHBOARD_BUDGET_LINES.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
          <button className="bp" onClick={() => onCardClick('ALL', bf)} style={{ whiteSpace:'nowrap' }} title="Show all projects for selected budget line">Show Projects</button>
        </div>
        <div className="fg" style={{ marginTop: 12, flexWrap: 'wrap' }}>
          <span className="fl">Select Project</span>
          <select className="fs" value={selectedProjectId || ''} onChange={(e) => onSelectProject?.(e.target.value)} style={{ minWidth: 360 }}>
            <option value="">All projects in current budget line</option>
            {filtered.map((project) => <option key={project.id} value={project.id}>{project.projectName}</option>)}
          </select>
          {selectedProject && <button type="button" className="bp" onClick={() => onSelectProject?.('')} style={{ whiteSpace: 'nowrap' }}>Clear Project</button>}
        </div>
        <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginTop:12 }}>
          <button type="button" className="bp" onClick={() => { setBf('ALL'); onSelectProject?.(''); onCardClick('ALL', 'ALL'); }} style={{ padding:'7px 12px', background: bf === 'ALL' ? 'rgba(14,165,233,0.15)' : undefined }}>All</button>
          {DASHBOARD_BUDGET_LINES.map((line) => {
            const active = bf === line;
            return (
              <button key={line} type="button" className="bp" onClick={() => { setBf(line); onSelectProject?.(''); onCardClick('ALL', line); }} style={{ padding:'7px 12px', background: active ? 'rgba(14,165,233,0.15)' : undefined, borderColor: active ? 'rgba(14,165,233,0.35)' : undefined }} title={`Show projects in ${line}`}>{line}</button>
            );
          })}
        </div>
        {(bf !== 'ALL' || selectedProject) && (
          <div className="ft" style={{ color:'var(--acc)', fontWeight:700 }}>
            {selectedProject ? `Showing ${selectedProject.projectName}` : `${filtered.length} project${filtered.length !== 1 ? 's' : ''} in ${bf}`}
          </div>
        )}
      </div>

      <div className="cr2" style={{ marginTop:4 }}>
        <ProgressPieCard 
          title="Physical Progress" 
          subtitle={selectedProject ? 'Selected project completion' : 'Average across current filter'} 
          value={pp} 
          variance={selectedProject ? getPhysicalVariance(selectedProject) : filtered.reduce((a, p) => a + getPhysicalVariance(p), 0) / Math.max(1, filtered.length)}
          status={selectedProject ? getScheduleStatus(selectedProject) : (filtered.filter(p => getPhysicalPct(p) >= 100).length > filtered.length / 2 ? 'green' : 'red')}
          palette={PIE_COLORS.physical} 
        />
        <ProgressPieCard 
          title="Financial Progress" 
          subtitle={selectedProject ? 'Selected project spending' : 'Average across current filter'} 
          value={fp} 
          variance={selectedProject ? getFinancialVariance(selectedProject) : filtered.reduce((a, p) => a + getFinancialVariance(p), 0) / Math.max(1, filtered.length)}
          status={selectedProject ? getBudgetStatus(selectedProject) : (filtered.filter(p => getFinancialPct(p) <= 100).length > filtered.length / 2 ? 'green' : 'red')}
          palette={PIE_COLORS.financial} 
        />
      </div>
    </>
  );
};

export default Dashboard;