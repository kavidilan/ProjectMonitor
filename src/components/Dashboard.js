import React, { useState, useMemo } from 'react';
import { months } from '../utils/data';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import CustomTooltip from './CustomTooltip';

const DASHBOARD_BUDGET_LINES = [
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

const getProgressFromMeasures = (proj, numKey, denKey, fallbackPct) => {
  const measures = proj?.measures || {};
  let vals = [];
  for (const m of months) {
    const numRaw = measures?.[numKey]?.[m];
    const denRaw = measures?.[denKey]?.[m];
    if (numRaw === '' || denRaw === '' || numRaw === undefined || denRaw === undefined) continue;
    const num = Number(numRaw); const den = Number(denRaw);
    if (!Number.isFinite(num) || !Number.isFinite(den) || den === 0) continue;
    const pct = (num / den) * 100;
    if (!Number.isFinite(pct)) continue;
    vals.push(pct);
  }
  if (!vals.length) { const fb = parseFloat(fallbackPct); return Number.isFinite(fb) ? fb : 0; }
  const avg = vals.reduce((a,v)=>a+v,0)/vals.length;
  return Math.round(Math.max(0,Math.min(100,avg))*10)/10;
};

const getPhysicalPct  = (proj) => getProgressFromMeasures(proj,'PAC','PTC',proj?.physicalProgress);
const getFinancialPct = (proj) => getProgressFromMeasures(proj,'FAC','FTC',proj?.financialProgress);

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
    id:'DELAYED',   icon:'⚠️', lbl:'Delayed',
    color:'#dc2626',
    getVal:(f)=>f.filter(p=>p.reasonsForDelays).length,
  },
  {
    id:'COMPLETED', icon:'✅', lbl:'Completed',
    color:'#0f766e',
    getVal:(f)=>f.filter(p=>getPhysicalPct(p)>=100).length,
  },
];

const PIE_COLORS = {
  physical:  ['#10b981', 'var(--panel-2)'],
  financial: ['#0e7490', 'var(--panel-2)'],
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
          background: 'linear-gradient(135deg, #0b1324 0%, #0e3a56 45%, #0f766e 100%)',
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
            <span style={{ fontSize:10, fontWeight:800, letterSpacing:'0.08em', textTransform:'uppercase', padding:'3px 10px', borderRadius:6, background:'rgba(14,116,144,0.2)', border:'1px solid rgba(14,116,144,0.4)', color:'#67e8f9' }}>
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