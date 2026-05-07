import React, { useState } from 'react';
import { budgetLineConfig } from '../utils/data';

/* ─────────────────────────────────────────────────────────────
   DataEntryTable – 3-level merged header
   Sub-cols per month: PT | PP | FT | FP | IP% (PP/PT×100)
   ───────────────────────────────────────────────────────────── */

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];

const BASE_COLS = 14;
// 5 sub-cols per month: PT | PP | FT | FP | IP%
const PROGRESS_COLSPAN = 2 + MONTHS.length * 5;  // 62
const RIGHT_COLS = 6;

export default function DataEntryTable({
  projects = [],
  isVO,
  bf, setBf,
  ab, setAb,
  ap2, setAp2,
  hadd,
  handleSave,
  setModalProject,
  hpc,
  hmc,
  hdel,
}) {
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  /* ── helpers ── */
  const safeLower = (v) => String(v ?? '').toLowerCase();

  const filteredProjects = projects.filter((p) => {
    const matchesBudget = !bf || bf === 'ALL' || p?.budgetLine === bf;
    const matchesSearch =
      safeLower(p?.projectName).includes(safeLower(searchTerm)) ||
      safeLower(p?.id).includes(safeLower(searchTerm)) ||
      safeLower(p?.department).includes(safeLower(searchTerm)) ||
      safeLower(p?.budgetLine).includes(safeLower(searchTerm)) ||
      safeLower(p?.projectNumber).includes(safeLower(searchTerm));
    const isDelayed = Boolean(p?.reasonsForDelays && String(p.reasonsForDelays).trim());
    const matchesStatus =
      filterStatus === 'ALL' ||
      (filterStatus === 'DELAYED' ? isDelayed : !isDelayed);
    return matchesBudget && matchesSearch && matchesStatus;
  });

  const getRowKey = (p) => p?._id ?? p?.id ?? p?.projectName ?? Math.random();

  const formatDate = (d) => {
    if (!d) return '';
    if (typeof d === 'string') return d.slice(0, 10);
    return new Date(d).toISOString().slice(0, 10);
  };

  /* ── field change handlers ── */
  const onField = (p, field) => (e) => {
    const next = e?.target?.value ?? '';
    if (typeof hpc === 'function') hpc(p?.id, field, next);
  };

  const onMonthly = (p, month, sub) => (e) => {
    const next = e?.target?.value ?? '';
    const monthKey = month.toLowerCase();
    const current = p?.monthlyProgress ?? {};
    const monthData = current[monthKey] ?? {};
    const updated = { ...current, [monthKey]: { ...monthData, [sub]: next } };
    if (typeof hpc === 'function') hpc(p?.id, 'monthlyProgress', updated);
  };

  const getMonthly = (p, month, sub) => {
    const monthKey = month.toLowerCase();
    const fromMonthlyProgress = p?.monthlyProgress?.[monthKey]?.[sub];
    if (fromMonthlyProgress !== undefined && fromMonthlyProgress !== null && fromMonthlyProgress !== '') {
      return fromMonthlyProgress;
    }
    if (sub === 'pt') return p?.measures?.PTC?.[monthKey] ?? '';
    if (sub === 'pp') return p?.measures?.PAC?.[monthKey] ?? '';
    if (sub === 'ft') return p?.measures?.FTC?.[monthKey] ?? '';
    if (sub === 'fp') return p?.measures?.FAC?.[monthKey] ?? '';
    return '';
  };

  const onTextarea = (p, field) => (e) => {
    const next = e?.target?.value ?? '';
    if (typeof hpc === 'function') hpc(p?.id, field, next);
  };

  const totalCols = BASE_COLS + PROGRESS_COLSPAN + RIGHT_COLS;

  const delayedCount = filteredProjects.filter(p => Boolean(p?.reasonsForDelays && String(p.reasonsForDelays).trim())).length;
  const onTrackCount = filteredProjects.length - delayedCount;

  return (
    <div style={{ padding: '0', fontFamily: 'var(--f)' }}>
      {/* ─────────────────── Embedded CSS ─────────────────── */}
      <style>{`
        /* ══ Hide number spinners globally ══ */
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }

        /* ══ DET Wrapper ══ */
        .det-wrapper {
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid var(--bd);
          background: color-mix(in oklab, var(--panel) 96%, transparent);
          box-shadow: 0 20px 50px rgba(3,27,47,0.10), 0 4px 16px rgba(14,165,233,0.06);
        }

        /* ══ Toolbar ══ */
        .det-toolbar {
          padding: 20px 24px 16px;
          background: linear-gradient(135deg,
            color-mix(in oklab, var(--panel) 98%, var(--acc) 2%),
            var(--panel)
          );
          border-bottom: 1px solid var(--bd);
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          align-items: center;
        }

        .det-toolbar-left  { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; flex: 1; }
        .det-toolbar-right { display: flex; gap: 10px; align-items: center; }

        /* ══ Stats row ══ */
        .det-stats {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          align-items: center;
          padding: 10px 24px;
          background: color-mix(in oklab, var(--panel-2) 80%, transparent);
          border-bottom: 1px solid var(--bd);
        }
        .det-stat-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 12px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.03em;
          border: 1px solid transparent;
        }
        .det-stat-total  { background: rgba(14,165,233,0.1);  color: var(--acc-2); border-color: rgba(14,165,233,0.25); }
        .det-stat-ok     { background: rgba(34,197,94,0.1);   color: #15803d;      border-color: rgba(34,197,94,0.25); }
        .det-stat-delay  { background: rgba(239,68,68,0.1);   color: #b91c1c;      border-color: rgba(239,68,68,0.25); }

        .det-stat-dot {
          width: 6px; height: 6px; border-radius: 50%;
          display: inline-block;
        }
        .det-stat-dot.green { background: #22c55e; }
        .det-stat-dot.red   { background: #ef4444; }
        .det-stat-dot.blue  { background: var(--acc); }

        /* ══ Add row panel ══ */
        .det-add-panel {
          padding: 16px 24px;
          background: color-mix(in oklab, var(--panel) 97%, transparent);
          border-bottom: 1px solid var(--bd);
          display: flex;
          gap: 12px;
          align-items: flex-end;
          flex-wrap: wrap;
        }
        .det-add-label {
          font-size: 10px;
          font-weight: 800;
          color: var(--tx-2);
          text-transform: uppercase;
          letter-spacing: 0.6px;
          margin-bottom: 5px;
        }

        /* ══ Inputs ══ */
        .det-input {
          background: var(--panel);
          border: 1.5px solid var(--bd);
          color: var(--tx-1);
          padding: 8px 11px;
          border-radius: 9px;
          font-size: 12px;
          font-family: var(--f);
          font-weight: 600;
          transition: border-color 0.18s, box-shadow 0.18s;
          width: 100%;
          box-sizing: border-box;
          appearance: none;
          -webkit-appearance: none;
        }
        .det-input:focus {
          outline: none;
          border-color: var(--acc);
          box-shadow: 0 0 0 3px rgba(14,165,233,0.12);
          background: color-mix(in oklab, var(--panel) 98%, var(--acc) 2%);
        }
        .det-input::placeholder { color: var(--tx-3); font-weight: 500; }

        /* ══ Tiny inputs (monthly cells) ══ */
        .det-input-tiny {
          background: transparent;
          border: 1.5px solid var(--bd);
          color: var(--tx-1);
          padding: 4px 2px;
          border-radius: 6px;
          font-size: 10px;
          font-family: var(--f);
          font-weight: 700;
          width: 100%;
          text-align: center;
          box-sizing: border-box;
          transition: border-color 0.15s, background 0.15s, box-shadow 0.15s;
          appearance: none;
          -webkit-appearance: none;
        }
        .det-input-tiny:focus {
          outline: none;
          border-color: var(--acc);
          background: color-mix(in oklab, var(--panel) 98%, var(--acc) 2%);
          box-shadow: 0 0 0 2px rgba(14,165,233,0.12);
        }
        .det-input-tiny::placeholder { color: var(--tx-3); font-weight: 400; font-size: 9px; }

        /* ══ Table shell ══ */
        .det-scroll { overflow-x: auto; }
        .det-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 12px;
          table-layout: auto;
        }

        /* ══ Header cells ══ */
        .det-th {
          padding: 10px 8px;
          border: 1px solid var(--bd);
          background: var(--panel-2);
          text-align: center;
          font-weight: 800;
          color: var(--tx-2);
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          white-space: nowrap;
          vertical-align: middle;
          position: sticky;
          top: 0;
          z-index: 2;
        }

        /* Progress super-header */
        .det-th-prog {
          background: linear-gradient(135deg, #0369a1, #0ea5e9 60%, #6366f1);
          color: #fff;
          font-size: 11.5px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-shadow: 0 1px 3px rgba(0,0,0,0.2);
        }

        /* Physical / Financial mid headers */
        .det-th-phys { background: linear-gradient(135deg,rgba(34,197,94,0.2),rgba(22,163,74,0.12)); color: #15803d; }
        .det-th-fin  { background: linear-gradient(135deg,rgba(234,179,8,0.2),rgba(202,138,4,0.12));  color: #854d0e; }

        /* Month header */
        .det-th-month {
          background: linear-gradient(135deg,rgba(14,165,233,0.14),rgba(99,102,241,0.08));
          color: var(--acc-2);
          font-size: 9.5px;
          font-weight: 800;
        }

        /* Sub-headers PT/PP/FT/FP */
        .det-th-sub {
          background: rgba(14,165,233,0.06);
          color: var(--tx-2);
          font-size: 9px;
          font-weight: 800;
          padding: 6px 3px;
          border-top: 2px solid rgba(14,165,233,0.15);
        }
        .det-th-pt { border-top-color: rgba(34,197,94,0.3); }
        .det-th-pp { border-top-color: rgba(34,197,94,0.5); }
        .det-th-ft { border-top-color: rgba(234,179,8,0.3); }
        .det-th-fp { border-top-color: rgba(234,179,8,0.5); }

        /* IP% sub-header */
        .det-th-ip {
          background: linear-gradient(135deg,rgba(99,102,241,0.15),rgba(14,165,233,0.08));
          color: #4338ca;
          font-size: 9px;
          font-weight: 900;
          padding: 6px 3px;
          border-top: 2px solid rgba(99,102,241,0.4);
          letter-spacing: 0.05em;
        }

        /* ══ Data cells ══ */
        .det-td {
          padding: 7px 6px;
          border: 1px solid var(--bd);
          vertical-align: middle;
          transition: background 0.15s;
        }
        .det-table tbody tr { transition: background 0.12s; }
        .det-table tbody tr:hover td { background: color-mix(in oklab, var(--panel-2) 80%, var(--acc) 4%) !important; }
        .det-table tbody tr:nth-child(even) td { background: color-mix(in oklab, var(--panel-2) 40%, transparent); }

        .det-td-num   { text-align: center; font-weight: 800; color: var(--tx-2); width: 36px; background: var(--panel-2); font-size: 11px; }
        .det-td-num:first-child {
          cursor: pointer;
          transition: background 0.15s, color 0.15s;
          user-select: none;
        }
        .det-td-num:first-child:hover { background: color-mix(in oklab, var(--acc) 15%, var(--panel-2)); color: var(--acc-2); }
        .det-td-name  { font-weight: 700; color: var(--tx-1); min-width: 200px; }
        .det-td-meta  { font-size: 11px; color: var(--tx-2); min-width: 100px; max-width: 160px; }
        .det-td-date  { text-align: center; min-width: 115px; }
        .det-td-money { text-align: center; min-width: 90px; }
        .det-td-pct   { text-align: center; min-width: 64px; }
        .det-td-month { padding: 5px 2px; min-width: 42px; }
        .det-td-text  { min-width: 140px; }
        .det-td-ip    {
          padding: 5px 2px;
          min-width: 54px;
          text-align: center;
          background: color-mix(in oklab, var(--panel-2) 70%, transparent);
        }

        /* ══ IP% badge ══ */
        .det-ip-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 44px;
          padding: 3px 5px;
          border-radius: 7px;
          font-size: 9.5px;
          font-weight: 800;
          letter-spacing: 0.02em;
          white-space: nowrap;
          transition: transform 0.15s;
        }
        .det-ip-badge:hover { transform: scale(1.08); }
        .det-ip-green { background: rgba(34,197,94,0.18);  color: #15803d; border: 1.5px solid rgba(34,197,94,0.4); }
        .det-ip-amber { background: rgba(234,179,8,0.18);  color: #854d0e; border: 1.5px solid rgba(234,179,8,0.4); }
        .det-ip-red   { background: rgba(239,68,68,0.18);  color: #b91c1c; border: 1.5px solid rgba(239,68,68,0.4); }
        .det-ip-grey  { background: rgba(100,116,139,0.09); color: var(--tx-3); border: 1.5px solid var(--bd); }

        /* ══ Status badge ══ */
        .det-badge { display: inline-flex; align-items: center; gap: 4px; padding: 3px 8px; border-radius: 999px; font-size: 9.5px; font-weight: 700; white-space: nowrap; }
        .det-badge-ok    { background: rgba(34,197,94,0.14);  color: #15803d; border: 1px solid rgba(34,197,94,0.3); }
        .det-badge-delay { background: rgba(239,68,68,0.14);  color: #b91c1c; border: 1px solid rgba(239,68,68,0.3); }

        /* ══ Buttons ══ */
        .det-btn-save {
          padding: 9px 22px;
          border-radius: 10px;
          border: none;
          background: linear-gradient(135deg, var(--acc), var(--acc-2));
          color: #fff;
          cursor: pointer;
          font-weight: 800;
          font-size: 12px;
          font-family: var(--f);
          transition: transform 0.18s, box-shadow 0.18s;
          box-shadow: 0 6px 16px rgba(14,165,233,0.25);
          display: inline-flex;
          align-items: center;
          gap: 6px;
          white-space: nowrap;
        }
        .det-btn-save:hover { transform: translateY(-2px); box-shadow: 0 10px 24px rgba(14,165,233,0.35); }
        .det-btn-save:active { transform: translateY(0); }

        .det-btn-add {
          padding: 9px 18px;
          border-radius: 10px;
          border: none;
          background: linear-gradient(135deg, #059669, #10b981);
          color: #fff;
          cursor: pointer;
          font-weight: 800;
          font-size: 12px;
          font-family: var(--f);
          transition: transform 0.18s, box-shadow 0.18s;
          box-shadow: 0 6px 16px rgba(16,185,129,0.25);
          display: inline-flex;
          align-items: center;
          gap: 6px;
          white-space: nowrap;
        }
        .det-btn-add:hover { transform: translateY(-2px); box-shadow: 0 10px 24px rgba(16,185,129,0.35); }

        .det-btn-del {
          padding: 5px 11px;
          border-radius: 7px;
          border: 1.5px solid rgba(239,68,68,0.35);
          background: rgba(239,68,68,0.08);
          color: #b91c1c;
          cursor: pointer;
          font-size: 10px;
          font-weight: 700;
          font-family: var(--f);
          transition: all 0.18s;
          white-space: nowrap;
        }
        .det-btn-del:hover { background: rgba(239,68,68,0.16); border-color: rgba(239,68,68,0.6); }
        .det-btn-del:disabled { opacity: 0.45; cursor: not-allowed; }
      `}</style>

      <div className="det-wrapper">

        {/* ─── Toolbar ─── */}
        <div className="det-toolbar">
          <div className="det-toolbar-left">
            {/* Search */}
            <div style={{ position: 'relative', minWidth: 240 }}>
              <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--tx-3)', fontSize: 13, pointerEvents: 'none' }}>🔍</span>
              <input
                className="det-input"
                placeholder="Search project name, ID, dept…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: 30, minWidth: 240 }}
              />
            </div>

            {/* Budget Line filter */}
            <select
              className="det-input"
              value={bf || 'ALL'}
              onChange={(e) => typeof setBf === 'function' && setBf(e.target.value)}
              style={{ minWidth: 220 }}
            >
              <option value="ALL">All Budget Lines</option>
              {Object.keys(budgetLineConfig).map((line) => (
                <option key={line} value={line}>{line}</option>
              ))}
            </select>

            {/* Status filter */}
            <select
              className="det-input"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{ minWidth: 150 }}
            >
              <option value="ALL">All Projects</option>
              <option value="ON_TRACK">On Track</option>
              <option value="DELAYED">Delayed</option>
            </select>
          </div>

          <div className="det-toolbar-right">
            <button className="det-btn-save" onClick={() => typeof handleSave === 'function' && handleSave()}>
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
              </svg>
              Save Changes
            </button>
          </div>
        </div>

        {/* ─── Stats bar ─── */}
        <div className="det-stats">
          <span className="det-stat-chip det-stat-total">
            <span className="det-stat-dot blue" />
            {filteredProjects.length} / {projects.length} shown
          </span>
          <span className="det-stat-chip det-stat-ok">
            <span className="det-stat-dot green" />
            {onTrackCount} on track
          </span>
          {delayedCount > 0 && (
            <span className="det-stat-chip det-stat-delay">
              <span className="det-stat-dot red" />
              {delayedCount} delayed
            </span>
          )}
          {bf && bf !== 'ALL' && (
            <span style={{ fontSize: 11, color: 'var(--tx-2)', fontWeight: 700 }}>
              📁 {bf}
            </span>
          )}
        </div>

        {/* ─── Add Row Panel ─── */}
        <div className="det-add-panel">
          <div style={{ flex: '0 0 220px' }}>
            <div className="det-add-label">Budget Line</div>
            <select
              className="det-input"
              value={ab}
              onChange={(e) => typeof setAb === 'function' && setAb(e.target.value)}
            >
              <option value="">Select budget line…</option>
              {Object.keys(budgetLineConfig).map((line) => (
                <option key={line} value={line}>{line}</option>
              ))}
            </select>
          </div>

          <div style={{ flex: 1, minWidth: 200 }}>
            <div className="det-add-label">Project Name</div>
            <input
              className="det-input"
              placeholder="Enter new project name…"
              value={ap2}
              onChange={(e) => typeof setAp2 === 'function' && setAp2(e.target.value)}
            />
          </div>

          <button
            className="det-btn-add"
            onClick={() => typeof hadd === 'function' && hadd()}
          >
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add New Row
          </button>
        </div>

        {/* ─── Table ─── */}
        <div className="det-scroll">
          <table className="det-table">
            <thead>

              {/* ══ ROW 1 – Main Headers ══ */}
              <tr>
                <th className="det-th" rowSpan={3} style={{ width: 36, zIndex: 3 }}>No</th>
                <th className="det-th" rowSpan={3} style={{ minWidth: 50 }}>Proj #</th>
                <th className="det-th" rowSpan={3} style={{ minWidth: 220, textAlign: 'left' }}>Project Name / Sub Activities</th>
                <th className="det-th" rowSpan={3} style={{ minWidth: 120, textAlign: 'left' }}>Department</th>
                <th className="det-th" rowSpan={3} style={{ minWidth: 110, textAlign: 'left' }}>District</th>
                <th className="det-th" rowSpan={3} style={{ minWidth: 110, textAlign: 'left' }}>Budget Line</th>
                <th className="det-th" rowSpan={3} style={{ minWidth: 110, textAlign: 'left' }}>NPD</th>
                <th className="det-th" rowSpan={3} style={{ minWidth: 115 }}>Start Date</th>
                <th className="det-th" rowSpan={3} style={{ minWidth: 115 }}>End Date</th>
                <th className="det-th" rowSpan={3} style={{ minWidth: 88 }}>TEC<br /><span style={{ fontWeight: 500, fontSize: 9 }}>(Rs.Mn)</span></th>
                <th className="det-th" rowSpan={3} style={{ minWidth: 110 }}>Allocation 2026<br /><span style={{ fontWeight: 500, fontSize: 9 }}>(Rs.Mn)</span></th>
                <th className="det-th" rowSpan={3} style={{ minWidth: 100 }}>Awarded Sum<br /><span style={{ fontWeight: 500, fontSize: 9 }}>(Rs)</span></th>
                <th className="det-th" rowSpan={3} style={{ minWidth: 88 }}>Revised Cost</th>
                <th className="det-th" rowSpan={3} style={{ minWidth: 100, textAlign: 'left' }}>KPI</th>

                {/* Progress super-header */}
                <th className="det-th det-th-prog" colSpan={PROGRESS_COLSPAN}>
                  ◈ Progress Tracking
                </th>

                {/* Right columns */}
                <th className="det-th" rowSpan={3} style={{ minWidth: 140, textAlign: 'left' }}>Output</th>
                <th className="det-th" rowSpan={3} style={{ minWidth: 140, textAlign: 'left' }}>Outcome</th>
                <th className="det-th" rowSpan={3} style={{ minWidth: 160, textAlign: 'left' }}>Responsible Officer</th>
                <th className="det-th" rowSpan={3} style={{ minWidth: 120, textAlign: 'left' }}>Reasons for Delays</th>
                <th className="det-th" rowSpan={3} style={{ minWidth: 140, textAlign: 'left' }}>Remarks</th>
                <th className="det-th" rowSpan={3} style={{ minWidth: 80 }}>Actions</th>
              </tr>

              {/* ══ ROW 2 – Progress sub-groups ══ */}
              <tr>
                <th className="det-th det-th-phys" rowSpan={2} style={{ minWidth: 72 }}>
                  Physical<br /><span style={{ fontWeight: 500, fontSize: 9 }}>(%)</span>
                </th>
                <th className="det-th det-th-fin" rowSpan={2} style={{ minWidth: 72 }}>
                  Financial<br /><span style={{ fontWeight: 500, fontSize: 9 }}>(%)</span>
                </th>
                {MONTHS.map((m) => (
                  <th key={m} className="det-th det-th-month" colSpan={5} style={{ minWidth: 192 }}>
                    {m}
                  </th>
                ))}
              </tr>

              {/* ══ ROW 3 – PT/PP/FT/FP/IP% per month ══ */}
              <tr>
                {MONTHS.map((m) => (
                  <React.Fragment key={m}>
                    <th className="det-th det-th-sub det-th-pt" title="Physical Target">PT</th>
                    <th className="det-th det-th-sub det-th-pp" title="Physical Progress">PP</th>
                    <th className="det-th det-th-sub det-th-ft" title="Financial Target">FT</th>
                    <th className="det-th det-th-sub det-th-fp" title="Financial Progress">FP</th>
                    <th className="det-th det-th-ip" title="In Progress % = PP ÷ PT × 100">IP%</th>
                  </React.Fragment>
                ))}
              </tr>
            </thead>

            <tbody>
              {filteredProjects.map((p, idx) => {
                const key = getRowKey(p);

                return (
                  <tr key={key}>
                    {/* No — click the row number to open detail modal */}
                    <td
                      className="det-td det-td-num"
                      onClick={() => typeof setModalProject === 'function' && setModalProject(p)}
                      style={{ cursor: 'pointer' }}
                      title="Click to open project details"
                    >
                      {idx + 1}
                    </td>

                    {/* Project # */}
                    <td className="det-td det-td-num" onClick={(e) => e.stopPropagation()}>
                      <input
                        className="det-input-tiny"
                        inputMode="numeric"
                        value={p?.projectNumber ?? ''}
                        onChange={onField(p, 'projectNumber')}
                        placeholder="#"
                        style={{ maxWidth: 48 }}
                      />
                    </td>

                    {/* Project Name */}
                    <td className="det-td det-td-name" onClick={(e) => e.stopPropagation()}>
                      <textarea
                        className="det-input"
                        rows={2}
                        value={p?.projectName ?? ''}
                        onChange={onField(p, 'projectName')}
                        placeholder="Project name…"
                        style={{ fontSize: 11, resize: 'vertical', whiteSpace: 'normal' }}
                      />
                    </td>

                    {/* Department */}
                    <td className="det-td det-td-meta" onClick={(e) => e.stopPropagation()}>
                      <textarea
                        className="det-input"
                        rows={2}
                        value={p?.department ?? ''}
                        onChange={onField(p, 'department')}
                        placeholder="Department"
                        style={{ fontSize: 11, resize: 'vertical', whiteSpace: 'normal' }}
                      />
                    </td>

                    {/* District */}
                    <td className="det-td det-td-meta" onClick={(e) => e.stopPropagation()}>
                      <textarea
                        className="det-input"
                        rows={2}
                        value={p?.district ?? ''}
                        onChange={onField(p, 'district')}
                        placeholder="District"
                        style={{ fontSize: 11, resize: 'vertical', whiteSpace: 'normal' }}
                      />
                    </td>

                    {/* Budget Line */}
                    <td className="det-td det-td-meta" onClick={(e) => e.stopPropagation()}>
                      <textarea
                        className="det-input"
                        rows={2}
                        value={p?.budgetLine ?? ''}
                        onChange={onField(p, 'budgetLine')}
                        placeholder="Budget line"
                        style={{ fontSize: 11, resize: 'vertical', whiteSpace: 'normal' }}
                      />
                    </td>

                    {/* NPD */}
                    <td className="det-td det-td-meta" onClick={(e) => e.stopPropagation()}>
                      <textarea
                        className="det-input"
                        rows={2}
                        value={p?.npd ?? ''}
                        onChange={onField(p, 'npd')}
                        placeholder="NPD"
                        style={{ fontSize: 11, resize: 'vertical', whiteSpace: 'normal' }}
                      />
                    </td>

                    {/* Start Date */}
                    <td className="det-td det-td-date" onClick={(e) => e.stopPropagation()}>
                      <textarea
                        className="det-input"
                        rows={1}
                        inputMode="numeric"
                        value={formatDate(p?.startDate)}
                        onChange={onField(p, 'startDate')}
                        placeholder="YYYY-MM-DD"
                        style={{ textAlign: 'center', fontSize: 11, resize: 'vertical' }}
                      />
                    </td>

                    {/* End Date */}
                    <td className="det-td det-td-date" onClick={(e) => e.stopPropagation()}>
                      <textarea
                        className="det-input"
                        rows={1}
                        inputMode="numeric"
                        value={formatDate(p?.endDate)}
                        onChange={onField(p, 'endDate')}
                        placeholder="YYYY-MM-DD"
                        style={{ textAlign: 'center', fontSize: 11, resize: 'vertical' }}
                      />
                    </td>

                    {/* TEC */}
                    <td className="det-td det-td-money" onClick={(e) => e.stopPropagation()}>
                      <textarea
                        className="det-input"
                        rows={1}
                        inputMode="decimal"
                        value={p?.tec ?? ''}
                        onChange={onField(p, 'tec')}
                        placeholder="Rs.Mn"
                        style={{ textAlign: 'center', fontSize: 11, resize: 'vertical' }}
                      />
                    </td>

                    {/* Allocation 2026 */}
                    <td className="det-td det-td-money" onClick={(e) => e.stopPropagation()}>
                      <textarea
                        className="det-input"
                        rows={1}
                        inputMode="decimal"
                        value={p?.allocation2026 ?? ''}
                        onChange={onField(p, 'allocation2026')}
                        placeholder="Rs.Mn"
                        style={{ textAlign: 'center', fontSize: 11, resize: 'vertical' }}
                      />
                    </td>

                    {/* Awarded Sum */}
                    <td className="det-td det-td-money" onClick={(e) => e.stopPropagation()}>
                      <textarea
                        className="det-input"
                        rows={1}
                        inputMode="decimal"
                        value={p?.awardedSum ?? ''}
                        onChange={onField(p, 'awardedSum')}
                        placeholder="Rs"
                        style={{ textAlign: 'center', fontSize: 11, resize: 'vertical' }}
                      />
                    </td>

                    {/* Revised Cost */}
                    <td className="det-td det-td-money" onClick={(e) => e.stopPropagation()}>
                      <textarea
                        className="det-input"
                        rows={1}
                        inputMode="decimal"
                        value={p?.revisedCost ?? ''}
                        onChange={onField(p, 'revisedCost')}
                        placeholder="—"
                        style={{ textAlign: 'center', fontSize: 11, resize: 'vertical' }}
                      />
                    </td>

                    {/* KPI */}
                    <td className="det-td det-td-meta" onClick={(e) => e.stopPropagation()}>
                      <textarea
                        className="det-input"
                        rows={2}
                        value={p?.kpi ?? ''}
                        onChange={onField(p, 'kpi')}
                        placeholder="KPI"
                        style={{ fontSize: 11, resize: 'vertical', whiteSpace: 'normal' }}
                      />
                    </td>

                    {/* Physical Progress % */}
                    <td className="det-td det-td-pct" onClick={(e) => e.stopPropagation()}>
                      <input
                        className="det-input"
                        inputMode="decimal"
                        value={p?.physicalProgress ?? ''}
                        onChange={onField(p, 'physicalProgress')}
                        placeholder="e.g. 39"
                        style={{ textAlign: 'center', fontSize: 11 }}
                      />
                    </td>

                    {/* Financial Progress % */}
                    <td className="det-td det-td-pct" onClick={(e) => e.stopPropagation()}>
                      <input
                        className="det-input"
                        inputMode="decimal"
                        value={p?.financialProgress ?? ''}
                        onChange={onField(p, 'financialProgress')}
                        placeholder="e.g. 38"
                        style={{ textAlign: 'center', fontSize: 11 }}
                      />
                    </td>

                    {/* Monthly PT/PP/FT/FP/IP × 12 */}
                    {MONTHS.map((m) => {
                      const ptRaw = getMonthly(p, m, 'pt');
                      const ppRaw = getMonthly(p, m, 'pp');
                      const pt = parseFloat(ptRaw);
                      const pp = parseFloat(ppRaw);
                      const hasData = !isNaN(pt) && !isNaN(pp) && pt > 0;
                      const ipVal = hasData ? Math.min((pp / pt) * 100, 999) : null;
                      const ipText = hasData ? `${ipVal.toFixed(1)}%` : '—';
                      const ipClass = !hasData
                        ? 'det-ip-grey'
                        : ipVal >= 100
                        ? 'det-ip-green'
                        : ipVal >= 50
                        ? 'det-ip-amber'
                        : 'det-ip-red';

                      return (
                        <React.Fragment key={m}>
                          <td className="det-td det-td-month" onClick={(e) => e.stopPropagation()}>
                            <input
                              className="det-input-tiny"
                              inputMode="decimal"
                              placeholder="PT"
                              value={ptRaw}
                              onChange={onMonthly(p, m, 'pt')}
                              title={`${m} – Physical Target`}
                            />
                          </td>
                          <td className="det-td det-td-month" onClick={(e) => e.stopPropagation()}>
                            <input
                              className="det-input-tiny"
                              inputMode="decimal"
                              placeholder="PP"
                              value={ppRaw}
                              onChange={onMonthly(p, m, 'pp')}
                              title={`${m} – Physical Progress`}
                            />
                          </td>
                          <td className="det-td det-td-month" onClick={(e) => e.stopPropagation()}>
                            <input
                              className="det-input-tiny"
                              inputMode="decimal"
                              placeholder="FT"
                              value={getMonthly(p, m, 'ft')}
                              onChange={onMonthly(p, m, 'ft')}
                              title={`${m} – Financial Target`}
                            />
                          </td>
                          <td className="det-td det-td-month" onClick={(e) => e.stopPropagation()}>
                            <input
                              className="det-input-tiny"
                              inputMode="decimal"
                              placeholder="FP"
                              value={getMonthly(p, m, 'fp')}
                              onChange={onMonthly(p, m, 'fp')}
                              title={`${m} – Financial Progress`}
                            />
                          </td>
                          {/* IP% – auto-calculated, read-only */}
                          <td
                            className="det-td det-td-ip"
                            title={hasData
                              ? `In Progress: ${pp} ÷ ${pt} × 100 = ${ipVal.toFixed(2)}%`
                              : 'Enter PT and PP to calculate'}
                          >
                            <span className={`det-ip-badge ${ipClass}`}>{ipText}</span>
                          </td>
                        </React.Fragment>
                      );
                    })}

                    {/* Output */}
                    <td className="det-td det-td-text" onClick={(e) => e.stopPropagation()}>
                      <textarea
                        className="det-input"
                        rows={2}
                        value={p?.output ?? p?.measures?.output ?? ''}
                        onChange={onTextarea(p, 'output')}
                        placeholder="Output…"
                        style={{ resize: 'vertical', fontSize: 11 }}
                      />
                    </td>

                    {/* Outcome */}
                    <td className="det-td det-td-text" onClick={(e) => e.stopPropagation()}>
                      <textarea
                        className="det-input"
                        rows={2}
                        value={p?.outcome ?? p?.measures?.outcome ?? ''}
                        onChange={onTextarea(p, 'outcome')}
                        placeholder="Outcome…"
                        style={{ resize: 'vertical', fontSize: 11 }}
                      />
                    </td>

                    {/* Responsible Officer */}
                    <td className="det-td det-td-text" onClick={(e) => e.stopPropagation()}>
                      <textarea
                        className="det-input"
                        rows={2}
                        value={p?.responsibleOfficer ?? ''}
                        onChange={onTextarea(p, 'responsibleOfficer')}
                        placeholder="Officer name…"
                        style={{ resize: 'vertical', fontSize: 11 }}
                      />
                    </td>

                    {/* Reasons for Delays */}
                    <td className="det-td det-td-text" onClick={(e) => e.stopPropagation()}>
                      <textarea
                        className="det-input"
                        rows={2}
                        value={p?.reasonsForDelays ?? ''}
                        onChange={onTextarea(p, 'reasonsForDelays')}
                        placeholder="Leave empty if on track…"
                        style={{ resize: 'vertical', fontSize: 11 }}
                      />
                    </td>

                    {/* Remarks */}
                    <td className="det-td det-td-text" onClick={(e) => e.stopPropagation()}>
                      <textarea
                        className="det-input"
                        rows={2}
                        value={p?.remarks ?? ''}
                        onChange={onTextarea(p, 'remarks')}
                        placeholder="Remarks…"
                        style={{ resize: 'vertical', fontSize: 11 }}
                      />
                    </td>

                    {/* Actions */}
                    <td className="det-td" onClick={(e) => e.stopPropagation()} style={{ textAlign: 'center' }}>
                      <button
                        className="det-btn-del"
                        onClick={() => {
                          if (isVO) return;
                          const ok = window.confirm('Delete this row? Click Save Changes to update database.');
                          if (ok && typeof hdel === 'function') hdel(p?.id);
                        }}
                        disabled={isVO}
                        title={isVO ? 'Read-only role cannot delete' : 'Delete this row'}
                        style={{ opacity: isVO ? 0.45 : 1, cursor: isVO ? 'not-allowed' : 'pointer' }}
                      >
                        🗑 Delete
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filteredProjects.length === 0 && (
                <tr>
                  <td
                    colSpan={totalCols}
                    style={{
                      textAlign: 'center',
                      color: 'var(--tx-2)',
                      padding: '48px 28px',
                      fontStyle: 'italic',
                      fontSize: 13,
                      background: 'var(--panel)',
                    }}
                  >
                    <div style={{ fontSize: 32, marginBottom: 12 }}>📋</div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--tx-1)', marginBottom: 4 }}>No projects found</div>
                    <div style={{ fontWeight: 500 }}>Try adjusting your search or filter criteria.</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
