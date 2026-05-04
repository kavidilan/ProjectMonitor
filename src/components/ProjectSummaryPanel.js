import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fmtDMY } from '../utils/data';

// ── helpers ──────────────────────────────────────────────────────────────────
const pColor = (v) => v >= 75 ? '#22c55e' : v >= 40 ? '#f59e0b' : '#ef4444';
const pBg    = (v) => v >= 75 ? 'rgba(34,197,94,.14)' : v >= 40 ? 'rgba(245,158,11,.14)' : 'rgba(239,68,68,.14)';
const pLabel = (v) => v >= 75 ? 'ON TRACK' : v >= 40 ? 'MODERATE' : 'AT RISK';

// ── Animated SVG progress ring ────────────────────────────────────────────────
function ProgressRing({ value, size = 72, stroke = 6, color, label }) {
  const R   = (size - stroke) / 2;
  const circ = 2 * Math.PI * R;
  const dash = (value / 100) * circ;

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={R} fill="none"
          stroke="rgba(255,255,255,0.07)" strokeWidth={stroke} />
        <motion.circle
          cx={size/2} cy={size/2} r={R} fill="none"
          stroke={color} strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ - dash }}
          transition={{ duration: 1.1, ease: 'easeOut' }}
          style={{ filter: `drop-shadow(0 0 4px ${color}88)` }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 1,
      }}>
        <span style={{ fontSize: 14, fontWeight: 800, color, fontFamily: "'DM Mono', monospace", lineHeight: 1 }}>
          {value}%
        </span>
        <span style={{ fontSize: 7.5, color: 'rgba(148,163,184,0.6)', fontWeight: 700, letterSpacing: '0.4px', textTransform: 'uppercase' }}>
          {label}
        </span>
      </div>
    </div>
  );
}

// ── Info row ──────────────────────────────────────────────────────────────────
function InfoRow({ label, value, highlight }) {
  if (!value) return null;
  return (
    <div style={{ display: 'flex', gap: 10, marginBottom: 7, alignItems: 'flex-start' }}>
      <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(148,163,184,0.5)', textTransform: 'uppercase', letterSpacing: '0.5px', minWidth: 110, flexShrink: 0, marginTop: 1 }}>
        {label}
      </span>
      <span style={{ fontSize: 11.5, color: highlight || '#e2e8f0', fontWeight: highlight ? 700 : 500, lineHeight: 1.5 }}>
        {value}
      </span>
    </div>
  );
}

// ── Media thumbnail ───────────────────────────────────────────────────────────
function MediaThumb({ item, index, onPreview, onDelete }) {
  const isVideo = item.mediaType === 'video';
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.06, duration: 0.3, ease: 'easeOut' }}
      style={{ position: 'relative', aspectRatio: '1', borderRadius: 10, overflow: 'hidden',
        background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
        cursor: 'pointer', flexShrink: 0,
      }}
      whileHover={{ scale: 1.04, borderColor: 'rgba(99,102,241,0.5)' }}
      onClick={() => onPreview(item)}
    >
      {isVideo ? (
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 4 }}>
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" style={{ color: 'rgba(148,163,184,0.75)' }}>
            <rect x="3" y="6" width="14" height="12" rx="2"/>
            <path d="M17 10l4-2v8l-4-2z"/>
          </svg>
          <div style={{ fontSize: 8.5, color: 'rgba(148,163,184,0.7)', fontWeight: 600, padding: '0 6px', textAlign: 'center',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%' }}>
            {item.name}
          </div>
        </div>
      ) : (
        <img src={item.dataUrl} alt={item.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      )}
      {/* overlay play icon for video */}
      {isVideo && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(99,102,241,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 10, marginLeft: 2 }}>▶</span>
          </div>
        </div>
      )}
      {/* delete btn */}
      <motion.button
        initial={{ opacity: 0 }} whileHover={{ opacity: 1 }}
        style={{ position: 'absolute', top: 4, right: 4, width: 18, height: 18, borderRadius: '50%',
          background: 'rgba(239,68,68,0.85)', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: '#fff' }}
        onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
      >✕</motion.button>
    </motion.div>
  );
}

// ── Lightbox ──────────────────────────────────────────────────────────────────
function Lightbox({ item, onClose }) {
  const isVideo = item.mediaType === 'video';
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', zIndex: 9999,
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }} transition={{ duration: 0.25, ease: [0.22,1,0.36,1] }}
        style={{ maxWidth: '90vw', maxHeight: '85vh', borderRadius: 16, overflow: 'hidden',
          position: 'relative', boxShadow: '0 40px 80px rgba(0,0,0,0.6)' }}
        onClick={e => e.stopPropagation()}
      >
        {isVideo ? (
          <video src={item.dataUrl} controls autoPlay
            style={{ maxWidth: '80vw', maxHeight: '80vh', display: 'block', borderRadius: 12 }} />
        ) : (
          <img src={item.dataUrl} alt={item.name}
            style={{ maxWidth: '80vw', maxHeight: '80vh', display: 'block', borderRadius: 12 }} />
        )}
        <button onClick={onClose} style={{ position: 'absolute', top: 12, right: 12, width: 32, height: 32,
          borderRadius: '50%', background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.2)',
          color: '#fff', fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          ×
        </button>
        <div style={{ position: 'absolute', bottom: 12, left: 12, right: 52,
          fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: 500,
          background: 'rgba(0,0,0,0.5)', borderRadius: 6, padding: '4px 8px', textAlign: 'center' }}>
          {item.name}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Milestone quick view ───────────────────────────────────────────────────────
function MilestoneList({ milestones }) {
  if (!milestones?.length) return (
    <div style={{ textAlign: 'center', color: 'rgba(148,163,184,0.4)', fontSize: 12, padding: '20px 0' }}>
      No milestones defined
    </div>
  );
  const done = milestones.filter(m => m.done).length;
  const pct  = Math.round(done / milestones.length * 100);
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <span style={{ fontSize: 11, color: 'rgba(148,163,184,0.6)', fontWeight: 600 }}>
          {done} / {milestones.length} completed
        </span>
        <span style={{ fontSize: 11, fontWeight: 800, color: pColor(pct), fontFamily: "'DM Mono', monospace" }}>
          {pct}%
        </span>
      </div>
      <div style={{ height: 4, background: 'rgba(255,255,255,0.07)', borderRadius: 99, marginBottom: 14, overflow: 'hidden' }}>
        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ height: '100%', borderRadius: 99, background: pColor(pct) }} />
      </div>
      {milestones.map((ms, i) => {
        const overdue = !ms.done && ms.dueDate && ms.dueDate < new Date().toISOString().slice(0, 10);
        return (
          <motion.div key={ms.id}
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 9, padding: '7px 10px',
              borderRadius: 8, background: ms.done ? 'rgba(34,197,94,0.06)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${ms.done ? 'rgba(34,197,94,0.2)' : overdue ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.07)'}` }}>
            <div style={{ width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
              background: ms.done ? '#22c55e' : 'rgba(255,255,255,0.1)',
              border: `2px solid ${ms.done ? '#22c55e' : overdue ? '#ef4444' : 'rgba(255,255,255,0.2)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {ms.done && <span style={{ fontSize: 9, color: '#fff' }}>✓</span>}
            </div>
            <span style={{ flex: 1, fontSize: 11.5, color: ms.done ? 'rgba(148,163,184,0.6)' : '#e2e8f0',
              textDecoration: ms.done ? 'line-through' : 'none', fontWeight: 500 }}>
              {ms.name}
            </span>
            {ms.dueDate && (
              <span style={{ fontSize: 10, color: overdue ? '#ef4444' : 'rgba(148,163,184,0.5)', fontWeight: 600 }}>
                {overdue ? 'Overdue ' : ''}{fmtDMY(ms.dueDate)}
              </span>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
const TABS = [
  { k: 'summary',    l: 'Summary'    },
  { k: 'media',      l: 'Media'      },
  { k: 'milestones', l: 'Milestones' },
];

const panelVariants = {
  hidden:  { opacity: 0, x: 50, scale: 0.97 },
  visible: { opacity: 1, x: 0,  scale: 1,    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, x: 50, scale: 0.96, transition: { duration: 0.22, ease: 'easeIn' } },
};

const ProjectSummaryPanel = ({ project, onClose, onSave, isVO, fullPage = false }) => {
  const [tab,        setTab]         = useState('summary');
  const [proj,       setProj]        = useState(() => JSON.parse(JSON.stringify(project)));
  const [lightbox,   setLightbox]    = useState(null);
  const [dragging,   setDragging]    = useState(false);
  const fileRef = useRef();

  const phys = parseFloat(proj.physicalProgress) || 0;
  const fin  = parseFloat(proj.financialProgress) || 0;
  const color = pColor(phys);

  // ── Media helpers ────────────────────────────────────────────────────────
  const media = proj.media || [];

  const processFile = useCallback((file) => {
    const maxMB = file.type.startsWith('video') ? 50 : 5;
    if (file.size > maxMB * 1024 * 1024) {
      alert(`File too large. Max ${maxMB}MB for ${file.type.startsWith('video') ? 'videos' : 'images'}.`);
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const newItem = {
        id:        Date.now() + Math.random(),
        name:      file.name,
        mediaType: file.type.startsWith('video') ? 'video' : 'image',
        dataUrl:   e.target.result,
        date:      new Date().toISOString().slice(0, 10),
      };
      setProj(p => ({ ...p, media: [...(p.media || []), newItem] }));
    };
    reader.readAsDataURL(file);
  }, []);

  const handleFiles = useCallback((files) => {
    Array.from(files).forEach(f => {
      if (f.type.startsWith('image/') || f.type.startsWith('video/')) processFile(f);
    });
  }, [processFile]);

  const deleteMedia = useCallback((id) => {
    setProj(p => ({ ...p, media: (p.media || []).filter(m => m.id !== id) }));
  }, []);

  const handleSaveAndClose = () => {
    onSave?.(proj);
    onClose();
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      <AnimatePresence>
        {lightbox && (
          <Lightbox key="lb" item={lightbox} onClose={() => setLightbox(null)} />
        )}
      </AnimatePresence>

      <motion.div
        key={project.id}
        variants={fullPage ? { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.3 } }, exit: { opacity: 0 } } : panelVariants}
        initial="hidden" animate="visible" exit="exit"
        style={{
          position: 'relative', width: '100%', height: '100%',
          background: fullPage ? 'transparent' : 'linear-gradient(160deg, rgba(7,18,34,0.97) 0%, rgba(9,32,54,0.98) 100%)',
          borderRadius: fullPage ? 0 : 16,
          border: fullPage ? 'none' : `1px solid ${color}30`,
          boxShadow: fullPage ? 'none' : `0 28px 64px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06), 0 0 0 1px ${color}10`,
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
          backdropFilter: fullPage ? 'none' : 'blur(24px)', WebkitBackdropFilter: fullPage ? 'none' : 'blur(24px)',
        }}
      >
        {/* decorative glow */}
        <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: '50%',
          background: `radial-gradient(circle, ${color}22 0%, transparent 70%)`, pointerEvents: 'none' }} />

        {/* ── Header ────────────────────────────────────────────────────── */}
        <div style={{ padding: '16px 18px 0', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 14 }}>
            {/* progress rings */}
            <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
              <ProgressRing value={phys} size={64} stroke={5} color={color} label="Physical" />
              <ProgressRing value={fin}  size={64} stroke={5} color="#0e7490" label="Financial" />
            </div>

            {/* title */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '2px 8px',
                borderRadius: 99, background: pBg(phys), border: `1px solid ${color}40`, marginBottom: 5 }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: color,
                  display: 'inline-block', ...(proj.reasonsForDelays ? { animation: 'pulseDot 1.4s ease-in-out infinite' } : {}) }} />
                <span style={{ fontSize: 9, fontWeight: 800, color, letterSpacing: '0.6px', textTransform: 'uppercase' }}>
                  {proj.reasonsForDelays ? 'DELAYED' : pLabel(phys)}
                </span>
              </div>
              <div style={{ fontSize: 12.5, fontWeight: 800, color: '#f1f5f9', lineHeight: 1.4,
                overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                {proj.projectName}
              </div>
              <div style={{ fontSize: 10, color: 'rgba(148,163,184,0.6)', marginTop: 4, fontWeight: 500 }}>
                {proj.department}{proj.budgetLine ? ` · ${proj.budgetLine}` : ''}
              </div>
            </div>

            {/* close btn */}
            {!fullPage && (
              <motion.button whileHover={{ scale: 1.12, rotate: 90 }} whileTap={{ scale: 0.9 }} onClick={onClose}
                style={{ width: 28, height: 28, border: '1px solid rgba(255,255,255,0.15)', borderRadius: '50%',
                  background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: 'rgba(148,163,184,0.9)', fontSize: 14, flexShrink: 0 }}>
                ×
              </motion.button>
            )}
          </div>

          {/* Tab bar */}
          <div style={{ display: 'flex', gap: 2, background: 'rgba(255,255,255,0.04)',
            borderRadius: 10, padding: 3, marginBottom: 0 }}>
            {TABS.map(({ k, l }) => (
                  <motion.button key={k} onClick={() => setTab(k)}
                animate={{ background: tab === k ? `${color}20` : 'transparent', color: tab === k ? color : 'rgba(148,163,184,0.55)' }}
                whileHover={{ color: tab === k ? color : 'rgba(203,213,225,0.8)' }}
                style={{ flex: 1, padding: '6px 4px', border: tab === k ? `1px solid ${color}30` : '1px solid transparent',
                  borderRadius: 8, fontSize: 10.5, fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s' }}>
                {l}
              </motion.button>
            ))}
          </div>
        </div>

        {/* divider */}
        <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '12px 0 0', flexShrink: 0 }} />

        {/* ── Body ──────────────────────────────────────────────────────── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '14px 18px 16px' }}>
          <AnimatePresence mode="wait">

            {/* ── SUMMARY TAB ─────────────────────────────────────────── */}
            {tab === 'summary' && (
              <motion.div key="summary"
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22 }}>

                {/* KPIs row */}
                {(proj.kpi || proj.output || proj.outcome) && (
                  <div style={{ background: 'rgba(14,116,144,0.07)', border: '1px solid rgba(14,116,144,0.2)',
                    borderRadius: 10, padding: '10px 12px', marginBottom: 14 }}>
                    {proj.kpi && (
                      <div style={{ marginBottom: proj.output ? 8 : 0 }}>
                        <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(148,163,184,0.5)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 3 }}>KPI</div>
                        <div style={{ fontSize: 11.5, color: '#a5f3fc', fontWeight: 600 }}>{proj.kpi}</div>
                      </div>
                    )}
                    {proj.output && (
                      <div style={{ marginBottom: proj.outcome ? 8 : 0 }}>
                        <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(148,163,184,0.5)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 3 }}>Output</div>
                        <div style={{ fontSize: 11, color: '#67e8f9', fontWeight: 500 }}>{proj.output}</div>
                      </div>
                    )}
                    {proj.outcome && (
                      <div>
                        <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(148,163,184,0.5)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 3 }}>Outcome</div>
                        <div style={{ fontSize: 11, color: '#bae6fd', fontWeight: 500 }}>{proj.outcome}</div>
                      </div>
                    )}
                  </div>
                )}

                {/* Finance row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
                  {[
                    { label: 'TEC (LKR Mn)', value: proj.tec },
                    { label: 'Awarded Sum', value: proj.awardedSum },
                    { label: 'Revised Cost', value: proj.revisedCost },
                    { label: 'Alloc. 2026', value: proj.allocation2026 },
                  ].filter(r => r.value).map(({ label, value }) => (
                    <div key={label} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
                      borderRadius: 8, padding: '8px 10px' }}>
                      <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(148,163,184,0.45)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 2 }}>{label}</div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: '#f8fafc', fontFamily: "'DM Mono', monospace" }}>{value}</div>
                    </div>
                  ))}
                </div>

                {/* Details */}
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: '10px 12px', marginBottom: 10 }}>
                  <InfoRow label="Start Date"   value={fmtDMY(proj.startDate)} />
                  <InfoRow label="End Date"     value={fmtDMY(proj.endDate)} />
                  <InfoRow label="NPD"          value={proj.npd} />
                  <InfoRow label="Responsible"  value={proj.responsibleOfficer} />
                  {proj.remarks && <InfoRow label="Remarks" value={proj.remarks} />}
                </div>

                {/* Delay alert */}
                {proj.reasonsForDelays && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)',
                      borderRadius: 10, padding: '10px 12px' }}>
                    <div style={{ fontSize: 9.5, fontWeight: 700, color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>
                      ⚠ Delay Reason
                    </div>
                    <div style={{ fontSize: 11.5, color: '#fca5a5', fontWeight: 500, lineHeight: 1.6 }}>
                      {proj.reasonsForDelays}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* ── MEDIA TAB ──────────────────────────────────────────── */}
            {tab === 'media' && (
              <motion.div key="media"
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22 }}>

                {/* Upload zone */}
                {!isVO && (
                    <motion.div
                    animate={{ borderColor: dragging ? '#0e7490' : 'rgba(14,116,144,0.25)', background: dragging ? 'rgba(14,116,144,0.12)' : 'rgba(14,116,144,0.04)' }}
                    style={{ border: '2px dashed rgba(14,116,144,0.25)', borderRadius: 12, padding: '16px 12px',
                      textAlign: 'center', cursor: 'pointer', marginBottom: 14, transition: 'all 0.2s' }}
                    onClick={() => fileRef.current?.click()}
                    onDragOver={e => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={e => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
                  >
                    <motion.div animate={{ y: dragging ? -4 : 0 }} style={{ marginBottom: 6, color:'#67e8f9' }}>
                      <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24" style={{display:'block',margin:'0 auto'}}>
                        <path d="M3 8a2 2 0 0 1 2-2h3l1.5-2h5L16 6h3a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8z"/>
                        <circle cx="12" cy="12.5" r="3.5"/>
                      </svg>
                    </motion.div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#67e8f9', marginBottom: 3 }}>
                      {dragging ? 'Drop to upload!' : 'Upload Photos & Videos'}
                    </div>
                    <div style={{ fontSize: 10, color: 'rgba(148,163,184,0.5)', fontWeight: 500 }}>
                      Click or drag & drop · JPG, PNG, WebP, MP4, MOV · Max 5MB (50MB video)
                    </div>
                    <input ref={fileRef} type="file" multiple accept="image/*,video/*" style={{ display: 'none' }}
                      onChange={e => { handleFiles(e.target.files); e.target.value = ''; }} />
                  </motion.div>
                )}

                {/* Media grid */}
                {media.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '24px 0', color: 'rgba(148,163,184,0.4)', fontSize: 12 }}>
                    <div style={{ marginBottom: 8, color:'rgba(148,163,184,0.55)' }}>
                      <svg width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24" style={{display:'block',margin:'0 auto'}}>
                        <rect x="3" y="4" width="18" height="16" rx="2"/>
                        <path d="M7 15l3-3 3 3 4-4 2 2"/>
                        <circle cx="9" cy="9" r="1"/>
                      </svg>
                    </div>
                    No media uploaded yet
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                    {media.map((item, i) => (
                      <MediaThumb key={item.id} item={item} index={i}
                        onPreview={setLightbox} onDelete={isVO ? () => {} : deleteMedia} />
                    ))}
                  </div>
                )}

                {/* count */}
                {media.length > 0 && (
                  <div style={{ marginTop: 10, fontSize: 10, color: 'rgba(148,163,184,0.4)', fontWeight: 600, textAlign: 'right' }}>
                    {media.filter(m => m.mediaType === 'image').length} photo{media.filter(m => m.mediaType === 'image').length !== 1 ? 's' : ''}
                    {' · '}
                    {media.filter(m => m.mediaType === 'video').length} video{media.filter(m => m.mediaType === 'video').length !== 1 ? 's' : ''}
                  </div>
                )}
              </motion.div>
            )}

            {/* ── MILESTONES TAB ─────────────────────────────────────── */}
            {tab === 'milestones' && (
              <motion.div key="milestones"
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22 }}>
                <MilestoneList milestones={proj.milestones} />
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* ── Footer ────────────────────────────────────────────────────── */}
        {!isVO && (
          <div style={{ padding: '12px 18px', borderTop: '1px solid rgba(255,255,255,0.06)', flexShrink: 0,
            display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button onClick={onClose} style={{ padding: '7px 16px', background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12, fontWeight: 600,
              color: 'rgba(148,163,184,0.8)', cursor: 'pointer' }}>
              Cancel
            </button>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={handleSaveAndClose}
              style={{ padding: '7px 18px', background: 'linear-gradient(135deg, #0e7490, #0f766e)',
                border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 700, color: '#fff',
                cursor: 'pointer', boxShadow: '0 3px 12px rgba(14,116,144,0.35)' }}>
              Save & Close
            </motion.button>
          </div>
        )}
      </motion.div>
    </>
  );
};

export default ProjectSummaryPanel;
