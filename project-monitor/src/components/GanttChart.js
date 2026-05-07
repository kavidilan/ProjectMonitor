import React, { useMemo, useState, useEffect } from 'react';
import { budgetLineConfig, fmtDMY } from '../utils/data';

const DAY_MS      = 24 * 60 * 60 * 1000;
const MONTH_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

/* Parse date strings as LOCAL midnight to avoid UTC timezone drift.
   '2025-09-18' via new Date() becomes UTC 00:00 → local time shifts.
   We parse manually so it always means local midnight. */
const parseDate = (v) => {
  if (!v) return null;
  const s = String(v).trim();
  // YYYY-MM-DD  (ISO date-only) → local midnight
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]), 0, 0, 0, 0);
  // fallback for full ISO strings / other formats
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
};

const parsePct = (v) => {
  const n = parseFloat(String(v ?? '').replace('%', ''));
  return isFinite(n) ? Math.max(0, Math.min(100, n)) : null;
};

const toLocalStr = (d) => {
  const y  = d.getFullYear();
  const m  = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
};

const STATUS_MAP = {
  completed:  { label:'Completed',   color:'#059669' },
  delayed:    { label:'Delayed',     color:'#dc2626' },
  overdue:    { label:'Overdue',     color:'#b91c1c' },
  upcoming:   { label:'Upcoming',    color:'#0284c7' },
  inProgress: { label:'In Progress', color:'#d97706' },
};

/* Progress colour thresholds:
   <45  → red
   45–75 → orange
   >75   → green  */
const pctColor = (v) => {
  if (v >= 75) return { solid: '#16a34a', grad: 'linear-gradient(90deg,#14532d,#16a34a,#4ade80)' };
  if (v >= 45) return { solid: '#d97706', grad: 'linear-gradient(90deg,#92400e,#d97706,#fcd34d)' };
  return           { solid: '#dc2626', grad: 'linear-gradient(90deg,#7f1d1d,#dc2626,#fca5a5)' };
};

const getStatus = (p, now) => {
  const phys  = parsePct(p.physicalProgress);
  const delay = Boolean(String(p.reasonsForDelays || '').trim());
  const start = parseDate(p.startDate);
  const end   = parseDate(p.endDate);
  if (phys !== null && phys >= 100) return 'completed';
  if (delay)  return 'delayed';
  if (start && now < start) return 'upcoming';
  if (end   && now > end)   return 'overdue';
  return 'inProgress';
};

const STATUS_FILTERS = [
  { value:'ALL',          label:'All'          },
  { value:'IN_PROGRESS',  label:'In Progress'  },
  { value:'DELAYED',      label:'Delayed'      },
  { value:'COMPLETED',    label:'Completed'    },
  { value:'UPCOMING',     label:'Upcoming'     },
];

const LEFT_COL = 260;
const BAR_H    = 14;

/* Returns today at local midnight so position calculations are date-accurate */
const todayMidnight = () => {
  const n = new Date();
  return new Date(n.getFullYear(), n.getMonth(), n.getDate(), 0, 0, 0, 0);
};

export default function GanttChart({ projects }) {
  // Live today — refreshes every minute so the red line is ALWAYS correct
  const [now, setNow] = useState(todayMidnight);

  useEffect(() => {
    const tick = () => setNow(todayMidnight());
    // Fire at the next midnight, then every 24 h
    const msToMidnight = () => {
      const n = new Date();
      return new Date(n.getFullYear(), n.getMonth(), n.getDate() + 1).getTime() - n.getTime();
    };
    // Also poll every 60 s as a safety net
    const interval = setInterval(tick, 60_000);
    const timeout  = setTimeout(() => { tick(); clearInterval(interval); }, msToMidnight());
    return () => { clearInterval(interval); clearTimeout(timeout); };
  }, []);

  const [statusFilter, setStatusFilter] = useState('ALL');
  const [budgetFilter, setBudgetFilter] = useState('ALL');
  const [search,       setSearch]       = useState('');

  const prepared = useMemo(() => {
    const yearNow = now.getFullYear();
    const rows = projects.map((p) => {
      const start    = parseDate(p.startDate) || new Date(yearNow, 0, 1);
      const rawEnd   = parseDate(p.endDate)   || new Date(yearNow, 11, 31);
      const end      = rawEnd < start ? start : rawEnd;
      const phys     = parsePct(p.physicalProgress) ?? 0;
      const fin      = parsePct(p.financialProgress) ?? 0;
      return {
        id: p.id,
        name: p.projectName || 'Untitled',
        department: p.department || '—',
        budgetLine: p.budgetLine || '—',
        start, end, phys, fin,
        statusKey: getStatus(p, now),
      };
    });

    const allStarts = rows.map(r => r.start.getTime());
    const allEnds   = rows.map(r => r.end.getTime());
    const minYear   = allStarts.length ? new Date(Math.min(...allStarts)).getFullYear() : yearNow;
    const maxYear   = allEnds.length   ? new Date(Math.max(...allEnds)).getFullYear()   : yearNow;

    const boundsStart = new Date(minYear, 0, 1);
    const boundsEnd   = new Date(maxYear, 11, 31);
    const totalDays   = Math.max(1, Math.round((boundsEnd - boundsStart) / DAY_MS));

    const months = [];
    for (let y = minYear; y <= maxYear; y++) {
      for (let m = 0; m < 12; m++) {
        const d    = new Date(y, m, 1);
        const left = ((d - boundsStart) / DAY_MS / totalDays) * 100;
        months.push({ label: MONTH_SHORT[m], year: y, month: m, left: Math.max(0, Math.min(100, left)) });
      }
    }

    const todayLeft = Math.max(0, Math.min(100, ((now - boundsStart) / DAY_MS / totalDays) * 100));

    const withPos = rows.map((r) => ({
      ...r,
      left:     Math.max(0, ((r.start - boundsStart) / DAY_MS / totalDays) * 100),
      width:    Math.max(1.5, ((r.end - r.start) / DAY_MS / totalDays) * 100),
      startStr: fmtDMY(toLocalStr(r.start)),
      endStr:   fmtDMY(toLocalStr(r.end)),
    }));

    const rank = { delayed:0, overdue:1, inProgress:2, upcoming:3, completed:4 };
    withPos.sort((a, b) => (rank[a.statusKey] - rank[b.statusKey]) || (a.end - b.end));

    const yearMap = {};
    months.forEach(m => { if (!yearMap[m.year]) yearMap[m.year] = m.left; });
    const yearGroups = Object.entries(yearMap).map(([y, left]) => ({ year: Number(y), left }));

    return { rows: withPos, months, todayLeft, boundsStart, boundsEnd, yearGroups };
  }, [projects, now]);

  const displayed = useMemo(() => {
    const q = search.trim().toLowerCase();
    return prepared.rows.filter((r) => {
      const mSearch = !q || [r.name, r.department, r.budgetLine].some(v => String(v).toLowerCase().includes(q));
      const mBudget = budgetFilter === 'ALL' || r.budgetLine === budgetFilter;
      const mStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'COMPLETED'   && r.statusKey === 'completed') ||
        (statusFilter === 'DELAYED'     && (r.statusKey === 'delayed' || r.statusKey === 'overdue')) ||
        (statusFilter === 'UPCOMING'    && r.statusKey === 'upcoming') ||
        (statusFilter === 'IN_PROGRESS' && r.statusKey === 'inProgress');
      return mSearch && mBudget && mStatus;
    });
  }, [prepared.rows, search, budgetFilter, statusFilter]);

  const summary = useMemo(() => ({
    total:      displayed.length,
    inProgress: displayed.filter(r => r.statusKey === 'inProgress').length,
    delayed:    displayed.filter(r => r.statusKey === 'delayed' || r.statusKey === 'overdue').length,
    completed:  displayed.filter(r => r.statusKey === 'completed').length,
    upcoming:   displayed.filter(r => r.statusKey === 'upcoming').length,
  }), [displayed]);

  return (
    <div style={{ fontFamily: 'var(--f)' }}>
      <style>{`
        /* No backgrounds — completely flat */
        .gc-flat-wrap { padding: 0; }

        /* ── Top title row ── */
        .gc-flat-head {
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 12px;
          padding: 0 0 16px 0;
          border-bottom: 2px solid var(--bd);
          margin-bottom: 14px;
        }
        .gc-flat-title {
          font-family: var(--fh); font-size: 20px; font-weight: 800;
          color: var(--tx-1); margin: 0; letter-spacing: -0.4px;
        }
        .gc-flat-range {
          font-size: 11px; font-weight: 700; color: var(--tx-3);
        }

        /* ── Legend ── */
        .gc-flat-legend {
          display: flex; align-items: center; gap: 20px;
          flex-wrap: wrap; margin-bottom: 10px;
        }
        .gc-flat-leg-item {
          display: inline-flex; align-items: center; gap: 7px;
          font-size: 11.5px; font-weight: 700; color: var(--tx-2);
        }
        .gc-flat-leg-bar {
          width: 28px; height: 8px; border-radius: 999px;
        }

        /* ── Filter row ── */
        .gc-flat-filters {
          display: flex; gap: 10px; flex-wrap: wrap; align-items: center;
          margin-bottom: 12px;
        }
        .gc-flat-input {
          border: 1.5px solid var(--bd);
          border-radius: 8px;
          background: transparent;
          color: var(--tx-1);
          font-family: var(--f);
          font-size: 12px; font-weight: 500;
          padding: 7px 11px;
          transition: border-color 0.18s;
          appearance: none; -webkit-appearance: none;
          min-width: 180px;
        }
        .gc-flat-input:focus { outline: none; border-color: var(--acc); }
        .gc-flat-input::placeholder { color: var(--tx-3); }

        /* Status pills */
        .gc-flat-pills { display: flex; gap: 6px; flex-wrap: wrap; }
        .gc-flat-pill {
          padding: 4px 12px; border-radius: 999px;
          font-size: 10.5px; font-weight: 800; font-family: var(--f);
          cursor: pointer;
          border: 1.5px solid var(--bd);
          background: transparent; color: var(--tx-2);
          transition: all 0.16s; white-space: nowrap;
        }
        .gc-flat-pill:hover { border-color: var(--acc); color: var(--acc); }
        .gc-flat-pill.on {
          background: linear-gradient(135deg, var(--acc), var(--acc-2));
          color: #fff; border-color: transparent;
        }

        /* ── Summary count ── */
        .gc-flat-summary {
          display: flex; gap: 16px; flex-wrap: wrap;
          margin-bottom: 14px; align-items: center;
        }
        .gc-flat-count {
          font-size: 11px; font-weight: 800; display: flex; align-items: center; gap: 5px;
        }
        .gc-flat-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }

        /* ── Chart scroll ── */
        .gc-flat-scroll { overflow-x: auto; }
        .gc-flat-chart  { min-width: 860px; }

        /* Month ruler */
        .gc-flat-ruler {
          display: flex; height: 40px;
          border-bottom: 1.5px solid var(--bd);
          margin-bottom: 0;
          position: sticky; top: 0; z-index: 5;
          background: var(--bg-soft, var(--panel));
        }
        .gc-flat-ruler-label {
          flex-shrink: 0;
          border-right: 1.5px solid var(--bd);
          display: flex; align-items: flex-end;
          padding: 0 10px 6px;
          font-size: 10px; font-weight: 900; color: var(--tx-3);
          text-transform: uppercase; letter-spacing: 0.6px;
        }
        .gc-flat-ruler-months { flex: 1; position: relative; height: 100%; }

        .gc-flat-ruler-year {
          position: absolute; top: 0; height: 14px;
          padding-left: 5px;
          font-size: 9px; font-weight: 900; color: var(--acc-2);
          letter-spacing: 0.5px; text-transform: uppercase;
          border-left: 2px solid var(--acc);
          display: flex; align-items: center;
          white-space: nowrap; overflow: hidden;
        }
        .gc-flat-ruler-month {
          position: absolute; bottom: 0; top: 14px;
          padding-left: 4px;
          font-size: 10px; font-weight: 800; color: var(--tx-3);
          border-left: 1px solid var(--bd);
          display: flex; align-items: center;
          white-space: nowrap; overflow: hidden;
        }
        .gc-flat-ruler-month.cur { color: var(--acc); border-left-color: var(--acc); font-weight: 900; }
        .gc-flat-ruler-month.q   { color: var(--tx-2); }

        /* ── Row ── */
        .gc-flat-row {
          display: flex; align-items: stretch;
          border-bottom: 1px solid color-mix(in oklab, var(--bd) 55%, transparent);
          transition: background 0.12s;
          min-height: 68px;
        }
        .gc-flat-row:last-child { border-bottom: none; }
        .gc-flat-row:hover { background: color-mix(in oklab, var(--acc) 4%, transparent); }

        /* Name col */
        .gc-flat-name-col {
          flex-shrink: 0;
          border-right: 1px solid var(--bd);
          padding: 8px 12px;
          display: flex; flex-direction: column; justify-content: center;
        }
        .gc-flat-name {
          font-size: 12px; font-weight: 800; color: var(--tx-1);
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          margin-bottom: 2px;
        }
        .gc-flat-dept {
          font-size: 10px; color: var(--tx-3); font-weight: 600;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          margin-bottom: 4px;
        }
        .gc-flat-status {
          font-size: 9.5px; font-weight: 900; letter-spacing: 0.3px;
          display: inline-flex; align-items: center; gap: 4px;
        }

        /* Bars col */
        .gc-flat-bars-col {
          flex: 1; padding: 8px 10px;
          position: relative;
          display: flex; flex-direction: column; justify-content: center; gap: 4px;
        }

        /* Grid lines */
        /* grid lines removed — .gc-flat-vline intentionally hidden */
        .gc-flat-vline { display: none; }

        /* Today line */
        .gc-flat-today {
          position: absolute; top: 0; bottom: 0; width: 2px;
          background: #ef4444;
          box-shadow: 0 0 5px rgba(239,68,68,0.4);
          pointer-events: none; z-index: 4; border-radius: 1px;
        }
        .gc-flat-today-dot {
          position: absolute; top: 2px; left: -4px;
          width: 10px; height: 10px; border-radius: 50%;
          background: #ef4444;
          box-shadow: 0 0 6px rgba(239,68,68,0.6);
          animation: todayPip 1.8s ease-in-out infinite;
        }
        @keyframes todayPip {
          0%,100% { transform: scale(1);   opacity: 0.8; }
          50%      { transform: scale(1.5); opacity: 1;   }
        }

        /* Single bar track */
        .gc-flat-bar-row {
          display: flex; align-items: center; gap: 0; position: relative; z-index: 1;
        }
        .gc-flat-bar-lbl {
          width: 62px; flex-shrink: 0;
          font-size: 9px; font-weight: 900; text-transform: uppercase;
          letter-spacing: 0.4px; text-align: right; padding-right: 8px;
        }
        .gc-flat-bar-track {
          flex: 1; height: ${BAR_H}px; border-radius: 999px;
          background: transparent;
          position: relative; overflow: visible;
        }
        /* span placeholder (shows date extent, subtle) */
        .gc-flat-span {
          position: absolute; top: 0; bottom: 0;
          border-radius: 999px;
          pointer-events: none;
        }
        /* actual fill */
        .gc-flat-fill {
          position: absolute; top: 0; bottom: 0;
          border-radius: 999px;
          display: flex; align-items: center;
          overflow: hidden;
        }
        .gc-flat-fill-text {
          font-size: 9px; font-weight: 900; color: #fff;
          padding: 0 6px; white-space: nowrap;
          text-shadow: 0 1px 2px rgba(0,0,0,0.35);
          position: relative; z-index: 1;
          pointer-events: none;
        }
        .gc-flat-pct {
          width: 36px; flex-shrink: 0;
          font-size: 10px; font-weight: 900;
          padding-left: 7px; white-space: nowrap;
        }

        /* Date strip under bars */
        .gc-flat-dates {
          display: flex; justify-content: space-between;
          padding: 0 0 0 70px;
          font-size: 9px; font-weight: 700; color: var(--tx-3);
          margin-top: 1px;
        }

        /* Empty */
        .gc-flat-empty { padding: 48px 24px; text-align: center; color: var(--tx-3); }
      `}</style>

      <div className="gc-flat-wrap">

        {/* ── Header ── */}
        <div className="gc-flat-head">
          <div>
            <h2 className="gc-flat-title">Project Timeline</h2>
            <div style={{ fontSize: 11.5, color: 'var(--tx-3)', fontWeight: 600, marginTop: 3 }}>
              Physical &amp; Financial dual-track Gantt
            </div>
          </div>
          <span className="gc-flat-range">
            {fmtDMY(toLocalStr(prepared.boundsStart))} – {fmtDMY(toLocalStr(prepared.boundsEnd))}
          </span>
        </div>

        {/* ── Legend ── */}
        <div className="gc-flat-legend">
          <div className="gc-flat-leg-item">
            <span className="gc-flat-leg-bar" style={{ background: 'linear-gradient(90deg,#0369a1,#38bdf8)' }} />
            Physical Progress
          </div>
          <div className="gc-flat-leg-item">
            <span className="gc-flat-leg-bar" style={{ background: 'linear-gradient(90deg,#6d28d9,#a78bfa)' }} />
            Financial Progress
          </div>
          <div className="gc-flat-leg-item">
            <span style={{ width: 2, height: 14, borderRadius: 1, background: '#ef4444', display: 'inline-block', boxShadow: '0 0 4px rgba(239,68,68,0.5)' }} />
            Today
          </div>
          <div className="gc-flat-leg-item" style={{ marginLeft: 8, fontSize: 10, color: 'var(--tx-3)', fontStyle: 'italic', fontWeight: 500 }}>
            Light bar = scheduled span &nbsp;·&nbsp; Bold fill = actual progress
          </div>
        </div>

        {/* ── Filters ── */}
        <div className="gc-flat-filters">
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', fontSize: 12, color: 'var(--tx-3)', pointerEvents: 'none' }}>🔍</span>
            <input
              className="gc-flat-input"
              placeholder="Search project / dept…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: 28 }}
            />
          </div>
          <select className="gc-flat-input" value={budgetFilter} onChange={e => setBudgetFilter(e.target.value)}>
            <option value="ALL">All Budget Lines</option>
            {Object.keys(budgetLineConfig).map(l => <option key={l} value={l}>{l}</option>)}
          </select>
          <div className="gc-flat-pills">
            {STATUS_FILTERS.map(f => (
              <button key={f.value} className={`gc-flat-pill ${statusFilter === f.value ? 'on' : ''}`} onClick={() => setStatusFilter(f.value)}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Summary counts ── */}
        <div className="gc-flat-summary">
          {[
            { label: `${summary.total} Total`,            color: 'var(--tx-2)' },
            { label: `${summary.inProgress} In Progress`, color: '#d97706'     },
            { label: `${summary.delayed} Delayed`,        color: '#dc2626'     },
            { label: `${summary.completed} Completed`,    color: '#059669'     },
            { label: `${summary.upcoming} Upcoming`,      color: '#0284c7'     },
          ].map(c => (
            <span key={c.label} className="gc-flat-count" style={{ color: c.color }}>
              <span className="gc-flat-dot" style={{ background: c.color }} />
              {c.label}
            </span>
          ))}
          <span style={{ marginLeft: 'auto', fontSize: 10.5, color: 'var(--tx-3)', fontWeight: 600 }}>
            {displayed.length} / {prepared.rows.length} shown
          </span>
        </div>

        {/* ── Chart ── */}
        <div className="gc-flat-scroll">
          <div className="gc-flat-chart">

            {/* Ruler */}
            <div className="gc-flat-ruler">
              <div className="gc-flat-ruler-label" style={{ width: LEFT_COL }}>Task</div>
              <div className="gc-flat-ruler-months">
                {/* Years */}
                {prepared.yearGroups.map(({ year, left }, i) => {
                  const nxt = prepared.yearGroups[i + 1]?.left ?? 100;
                  return (
                    <div key={year} className="gc-flat-ruler-year" style={{ left: `${left}%`, width: `${nxt - left}%` }}>
                      {year}
                    </div>
                  );
                })}
                {/* Months */}
                {prepared.months.map((m, i) => {
                  const nxt = prepared.months[i + 1]?.left ?? 100;
                  const isCur = m.month === now.getMonth() && m.year === now.getFullYear();
                  const isQ   = [0, 3, 6, 9].includes(m.month);
                  return (
                    <div key={`m${i}`} className={`gc-flat-ruler-month ${isCur ? 'cur' : isQ ? 'q' : ''}`} style={{ left: `${m.left}%`, width: `${nxt - m.left}%` }}>
                      {m.label}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Empty */}
            {displayed.length === 0 && (
              <div className="gc-flat-empty">
                <div style={{ fontSize: 32, marginBottom: 10 }}>📅</div>
                <div style={{ fontWeight: 800, fontSize: 14, color: 'var(--tx-1)', marginBottom: 4 }}>No projects match filters</div>
                <div style={{ fontSize: 12 }}>Adjust your search or filter criteria.</div>
              </div>
            )}

            {/* Rows */}
            {displayed.map((row) => {
              const st   = STATUS_MAP[row.statusKey];
              const physC = pctColor(row.phys);
              const finC  = pctColor(row.fin);
              return (
                <div key={row.id} className="gc-flat-row">

                  {/* Name */}
                  <div className="gc-flat-name-col" style={{ width: LEFT_COL }}>
                    <div className="gc-flat-name" title={row.name}>{row.name}</div>
                    <div className="gc-flat-dept">{row.department} · {row.budgetLine}</div>
                    <span className="gc-flat-status" style={{ color: st.color }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: st.color, display: 'inline-block' }} />
                      {st.label}
                    </span>
                  </div>

                  {/* Bars */}
                  <div className="gc-flat-bars-col">

                    {/* Grid lines */}
                    {prepared.months.map((m, i) => (
                      <div key={`g${row.id}${i}`} className={`gc-flat-vline ${[0,3,6,9].includes(m.month) ? 'q' : ''}`} style={{ left: `${m.left}%` }} />
                    ))}

                    {/* Today */}
                    <div className="gc-flat-today" style={{ left: `${prepared.todayLeft}%` }}>
                      <div className="gc-flat-today-dot" />
                    </div>

                    {/* Physical bar */}
                    <div className="gc-flat-bar-row">
                      <span className="gc-flat-bar-lbl" style={{ color: physC.solid }}>Physical</span>
                      <div className="gc-flat-bar-track">
                        <div className="gc-flat-span" style={{ left: `${row.left}%`, width: `${row.width}%`, background: `${physC.solid}18`, border: `1.5px solid ${physC.solid}38` }} />
                        <div
                          className="gc-flat-fill"
                          style={{
                            left: `${row.left}%`,
                            width: `${row.width * row.phys / 100}%`,
                            background: physC.grad,
                            boxShadow: `inset 0 1px 0 rgba(255,255,255,0.28), 0 2px 8px ${physC.solid}44`,
                            minWidth: row.phys > 0 ? 4 : 0,
                          }}
                          title={`Physical: ${row.phys.toFixed(0)}%  |  ${row.startStr} → ${row.endStr}`}
                        >
                          {row.width * row.phys / 100 > 5 && (
                            <span className="gc-flat-fill-text">{row.phys >= 100 ? '✓ Done' : `${row.phys.toFixed(0)}%`}</span>
                          )}
                        </div>
                      </div>
                      <span className="gc-flat-pct" style={{ color: physC.solid, fontWeight: 900 }}>{row.phys.toFixed(0)}%</span>
                    </div>

                    {/* Financial bar */}
                    <div className="gc-flat-bar-row">
                      <span className="gc-flat-bar-lbl" style={{ color: finC.solid }}>Financial</span>
                      <div className="gc-flat-bar-track">
                        <div className="gc-flat-span" style={{ left: `${row.left}%`, width: `${row.width}%`, background: `${finC.solid}18`, border: `1.5px solid ${finC.solid}38` }} />
                        <div
                          className="gc-flat-fill"
                          style={{
                            left: `${row.left}%`,
                            width: `${row.width * row.fin / 100}%`,
                            background: finC.grad,
                            boxShadow: `inset 0 1px 0 rgba(255,255,255,0.28), 0 2px 8px ${finC.solid}44`,
                            minWidth: row.fin > 0 ? 4 : 0,
                          }}
                          title={`Financial: ${row.fin.toFixed(0)}%  |  ${row.startStr} → ${row.endStr}`}
                        >
                          {row.width * row.fin / 100 > 5 && (
                            <span className="gc-flat-fill-text">{row.fin >= 100 ? '✓ Done' : `${row.fin.toFixed(0)}%`}</span>
                          )}
                        </div>
                      </div>
                      <span className="gc-flat-pct" style={{ color: finC.solid, fontWeight: 900 }}>{row.fin.toFixed(0)}%</span>
                    </div>

                    {/* Dates */}
                    <div className="gc-flat-dates">
                      <span>{row.startStr}</span>
                      <span>{row.endStr}</span>
                    </div>

                  </div>
                </div>
              );
            })}

          </div>
        </div>

        {/* Footer */}
        <div style={{ paddingTop: 12, borderTop: `1px solid var(--bd)`, marginTop: 4, display: 'flex', justifyContent: 'space-between', fontSize: 10.5, color: 'var(--tx-3)', fontWeight: 600 }}>
          <span>Urban Development Authority · Annual Action Plan 2026</span>
          <span style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', display: 'inline-block' }} />
            Today marked in red
          </span>
        </div>

      </div>
    </div>
  );
}
