import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ── helpers ──────────────────────────────────────────────────────────────────
const pColor = (v) => v >= 75 ? '#22c55e' : v >= 40 ? '#f59e0b' : '#ef4444';
const pBg    = (v) => v >= 75 ? 'rgba(34,197,94,.12)' : v >= 40 ? 'rgba(245,158,11,.12)' : 'rgba(239,68,68,.12)';
const pLabel = (v) => v >= 75 ? 'ON TRACK' : v >= 40 ? 'MODERATE' : 'AT RISK';

// ── StatusBadge ───────────────────────────────────────────────────────────────
const StatusBadge = ({ pv, delayed }) => {
  const d = Boolean(delayed);
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '2px 8px', borderRadius: 99, fontSize: 9, fontWeight: 800,
      letterSpacing: '0.6px', textTransform: 'uppercase', flexShrink: 0,
      background: d ? 'rgba(239,68,68,.15)' : pBg(pv),
      color: d ? '#ef4444' : pColor(pv),
      border: `1px solid ${d ? 'rgba(239,68,68,.3)' : 'transparent'}`,
    }}>
      {d ? (
        <>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#ef4444',
            display: 'inline-block', animation: 'pulseDot 1.4s ease-in-out infinite' }} />
          DELAYED
        </>
      ) : pLabel(pv)}
    </span>
  );
};

// ── AnimatedProgressBar ───────────────────────────────────────────────────────
const AnimatedProgressBar = ({ pv, selected }) => {
  const color = selected ? '#6366f1' : pColor(pv);
  return (
    <div style={{ width: '100%', height: 3, background: 'rgba(148,163,184,.12)', borderRadius: 99, overflow: 'hidden', marginTop: 8 }}>
      <motion.div
        initial={{ width: 0 }} animate={{ width: `${pv}%` }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        style={{ height: '100%', borderRadius: 99, background: `linear-gradient(90deg, ${color}, ${color}cc)`,
          boxShadow: `0 0 6px ${color}66` }}
      />
    </div>
  );
};

// ── ProjectCard ───────────────────────────────────────────────────────────────
const cardVariants = {
  hidden:  { opacity: 0, y: 14, scale: 0.97 },
  visible: (i) => ({ opacity: 1, y: 0, scale: 1, transition: { delay: i * 0.05, duration: 0.3, ease: 'easeOut' } }),
};

const ProjectCard = ({ proj, index, isSelected, onSelect }) => {
  const pv = parseFloat(proj.physicalProgress) || 0;
  const color = pColor(pv);

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ scale: 1.015, y: -1 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(proj)}
      layout
      style={{
        background: isSelected
          ? 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(99,102,241,0.08))'
          : 'rgba(255,255,255,0.05)',
        border: `1.5px solid ${isSelected ? 'rgba(99,102,241,0.55)' : 'rgba(255,255,255,0.09)'}`,
        borderRadius: 12, padding: '11px 13px', cursor: 'pointer', marginBottom: 7,
        backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
        boxShadow: isSelected
          ? '0 4px 24px rgba(99,102,241,0.2), inset 0 1px 0 rgba(255,255,255,0.06)'
          : '0 2px 10px rgba(0,0,0,0.16)',
        transition: 'border-color 0.15s, background 0.15s, box-shadow 0.15s',
      }}
    >
      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 11.5, fontWeight: 700, lineHeight: 1.4,
            color: isSelected ? '#c7d2fe' : '#f1f5f9',
            overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
            marginBottom: 3,
          }}>
            {proj.projectName}
          </div>
          {proj.budgetLine && (
            <div style={{ fontSize: 9.5, color: 'rgba(148,163,184,0.65)', fontWeight: 500 }}>
              {proj.budgetLine}
            </div>
          )}
        </div>

        {/* Progress circle */}
        <motion.div
          animate={{ borderColor: isSelected ? 'rgba(99,102,241,0.5)' : `${color}44` }}
          style={{
            width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
            background: isSelected ? 'rgba(99,102,241,0.15)' : pBg(pv),
            border: `2px solid ${isSelected ? 'rgba(99,102,241,0.5)' : `${color}44`}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <span style={{ fontSize: 9.5, fontWeight: 800, color: isSelected ? '#a5b4fc' : color, fontFamily: "'DM Mono', monospace" }}>
            {pv}%
          </span>
        </motion.div>
      </div>

      <AnimatedProgressBar pv={pv} selected={isSelected} />

      {/* Bottom row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 7, gap: 6 }}>
        <StatusBadge pv={pv} delayed={proj.reasonsForDelays} />
        {isSelected ? (
          <span style={{ fontSize: 9, color: '#a5b4fc', fontWeight: 700 }}>● Viewing ›</span>
        ) : (
          <span style={{ fontSize: 9, color: 'rgba(148,163,184,0.45)', fontWeight: 500 }}>Click to view ›</span>
        )}
      </div>
    </motion.div>
  );
};

// ── Panel variants ────────────────────────────────────────────────────────────
const panelVariants = {
  hidden:  { opacity: 0, x: 40, scale: 0.97 },
  visible: { opacity: 1, x: 0,  scale: 1, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, x: 40, scale: 0.96, transition: { duration: 0.22, ease: 'easeIn' } },
};

// ── Main Component ────────────────────────────────────────────────────────────
const DistrictPanel = ({ location, projects, onClose, onSelectProject, selectedProject, isCityLevel }) => {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return projects;
    const q = search.toLowerCase();
    return projects.filter(p =>
      p.projectName?.toLowerCase().includes(q) ||
      p.budgetLine?.toLowerCase().includes(q) ||
      p.department?.toLowerCase().includes(q)
    );
  }, [projects, search]);

  if (!location) return null;

  const delayed     = projects.filter(p => p.reasonsForDelays).length;
  const onTrack     = projects.length - delayed;
  const avgProgress = projects.length
    ? Math.round(projects.reduce((s, p) => s + (parseFloat(p.physicalProgress) || 0), 0) / projects.length)
    : 0;

  return (
    <AnimatePresence>
      <motion.div
        key={location}
        variants={panelVariants}
        initial="hidden" animate="visible" exit="exit"
        style={{
          position: 'relative', width: '100%', height: '100%',
          background: 'linear-gradient(145deg, rgba(15,23,42,0.96) 0%, rgba(15,35,55,0.98) 100%)',
          borderRadius: 16, border: '1px solid rgba(99,102,241,0.22)',
          boxShadow: '0 24px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
          backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        {/* Decorative orb */}
        <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)', pointerEvents: 'none' }} />

        {/* ── Header ─────────────────────────────────────────────────── */}
        <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 9px',
                borderRadius: 99, background: 'rgba(99,102,241,0.18)', border: '1px solid rgba(99,102,241,0.35)', marginBottom: 7 }}>
                <span style={{ fontSize: 10, color: '#a5b4fc' }}>
                  {isCityLevel ? '📍 District' : '🗺 Province'}
                </span>
              </div>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.3px', lineHeight: 1.3 }}>
                {location}{!isCityLevel ? ' Province' : ''}
              </div>
              <div style={{ fontSize: 11, color: 'rgba(148,163,184,0.6)', marginTop: 3 }}>
                {projects.length} project{projects.length !== 1 ? 's' : ''} in this area
              </div>
            </div>

            <motion.button whileHover={{ scale: 1.12, rotate: 90 }} whileTap={{ scale: 0.9 }} onClick={onClose}
              style={{ width: 28, height: 28, border: '1px solid rgba(255,255,255,0.14)', borderRadius: '50%',
                background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: 'rgba(148,163,184,0.9)', fontSize: 14, flexShrink: 0 }}>
              ×
            </motion.button>
          </div>

          {/* Mini stats */}
          <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
            {[
              { label: 'Avg Progress', value: `${avgProgress}%`, color: pColor(avgProgress) },
              { label: 'On Track',     value: onTrack,           color: '#22c55e' },
              { label: 'Delayed',      value: delayed,           color: delayed > 0 ? '#ef4444' : 'rgba(148,163,184,0.5)' },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 8, padding: '6px 8px', textAlign: 'center' }}>
                <div style={{ fontSize: 14, fontWeight: 800, color, fontFamily: "'DM Mono', monospace" }}>{value}</div>
                <div style={{ fontSize: 8.5, color: 'rgba(148,163,184,0.5)', marginTop: 1, fontWeight: 600,
                  textTransform: 'uppercase', letterSpacing: '0.4px' }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Search bar */}
          <div style={{ position: 'relative', marginTop: 10 }}>
            <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
              fontSize: 13, pointerEvents: 'none', opacity: 0.45 }}>🔍</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search projects…"
              style={{
                width: '100%', boxSizing: 'border-box',
                padding: '7px 12px 7px 32px',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 9, fontSize: 11.5, color: '#e2e8f0',
                fontFamily: 'var(--f)', outline: 'none',
                transition: 'border-color 0.15s',
              }}
              onFocus={e  => e.target.style.borderColor = 'rgba(99,102,241,0.5)'}
              onBlur={e   => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            />
            {search && (
              <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 8, top: '50%',
                transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer',
                color: 'rgba(148,163,184,0.5)', fontSize: 13 }}>
                ×
              </button>
            )}
          </div>
        </div>

        {/* ── Project list ────────────────────────────────────────────── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '10px 12px 12px' }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(148,163,184,0.4)',
            textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: 8 }}>
            {search ? `${filtered.length} result${filtered.length !== 1 ? 's' : ''}` : 'Projects — click to view details'}
          </div>

          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'rgba(148,163,184,0.4)', fontSize: 12, marginTop: 30 }}>
              {search ? `No projects matching "${search}"` : 'No projects found'}
            </div>
          ) : (
            filtered.map((proj, i) => (
              <ProjectCard
                key={proj.id}
                proj={proj}
                index={i}
                isSelected={selectedProject?.id === proj.id}
                onSelect={onSelectProject}
              />
            ))
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DistrictPanel;
