import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fmtDMY } from '../utils/data';

// ── Responsive hook ──────────────────────────────────────────────────────────
const useResponsive = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return isMobile;
};

// ── helpers ──────────────────────────────────────────────────────────────────
const pColor = (v) => v >= 75 ? '#22c55e' : v >= 40 ? '#f59e0b' : '#ef4444';
const pBg    = (v) => v >= 75 ? 'rgba(34,197,94,.14)' : v >= 40 ? 'rgba(245,158,11,.14)' : 'rgba(239,68,68,.14)';
const pLabel = (v) => v >= 75 ? 'ON TRACK' : v >= 40 ? 'MODERATE' : 'AT RISK';

// ── Animated SVG progress ring ────────────────────────────────────────────────
function ProgressRing({ value, size = 72, stroke = 6, color, label, isMobile }) {
  const finalSize = isMobile ? Math.max(48, size - 16) : size;
  const finalStroke = isMobile ? 4 : stroke;
  const R   = (finalSize - finalStroke) / 2;
  const circ = 2 * Math.PI * R;
  const dash = (value / 100) * circ;

  return (
    <div style={{ position: 'relative', width: finalSize, height: finalSize, flexShrink: 0 }}>
      <svg width={finalSize} height={finalSize} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={finalSize/2} cy={finalSize/2} r={R} fill="none"
          stroke="rgba(255,255,255,0.07)" strokeWidth={finalStroke} />
        <motion.circle
          cx={finalSize/2} cy={finalSize/2} r={R} fill="none"
          stroke={color} strokeWidth={finalStroke}
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
        <span style={{ fontSize: isMobile ? 11 : 14, fontWeight: 800, color, fontFamily: "'DM Mono', monospace", lineHeight: 1 }}>
          {value}%
        </span>
        <span style={{ fontSize: isMobile ? 6 : 7.5, color: 'rgba(148,163,184,0.6)', fontWeight: 700, letterSpacing: '0.4px', textTransform: 'uppercase' }}>
          {label}
        </span>
      </div>
    </div>
  );
}

// ── Info row ──────────────────────────────────────────────────────────────────
function InfoRow({ label, value, highlight, isMobile = false }) {
  if (!value) return null;
  return (
    <div style={{ display: 'flex', gap: 10, marginBottom: 7, alignItems: 'flex-start', flexDirection: isMobile ? 'column' : 'row' }}>
      <span style={{ fontSize: isMobile ? 9 : 10, fontWeight: 700, color: 'rgba(148,163,184,0.5)', textTransform: 'uppercase', letterSpacing: '0.5px', minWidth: isMobile ? 'auto' : 110, flexShrink: 0, marginTop: 1 }}>
        {label}
      </span>
      <span style={{ fontSize: isMobile ? 10.5 : 11.5, color: highlight || '#e2e8f0', fontWeight: highlight ? 700 : 500, lineHeight: 1.5 }}>
        {value}
      </span>
    </div>
  );
}

// ── Media thumbnail ───────────────────────────────────────────────────────────
function MediaThumb({ item, index, onPreview, onDelete }) {
  const isVideo = item.mediaType === 'video';
  const hasPreview = item.dataUrl; // Only if dataUrl exists for preview
  
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
      onClick={() => hasPreview && onPreview(item)}
    >
      {!hasPreview ? (
        // Placeholder when dataUrl is not available
        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'rgba(99,102,241,0.08)' }}>
          <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ color: 'rgba(148,163,184,0.6)' }}>
            {isVideo ? (
              <>
                <rect x="3" y="6" width="14" height="12" rx="2"/>
                <path d="M17 10l4-2v8l-4-2z"/>
              </>
            ) : (
              <>
                <rect x="3" y="4" width="18" height="16" rx="2"/>
                <circle cx="9" cy="9" r="1.5" fill="currentColor"/>
                <path d="M3 16l4-4 3 3 7-7 4 4"/>
              </>
            )}
          </svg>
          <div style={{ fontSize: 9, color: 'rgba(148,163,184,0.5)', fontWeight: 600, textAlign: 'center', padding: '0 6px' }}>
            {item.name || (isVideo ? 'Video' : 'Photo')}
          </div>
          <div style={{ fontSize: 8, color: 'rgba(148,163,184,0.4)' }}>
            {item.date}
          </div>
        </div>
      ) : isVideo ? (
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 4, background: 'rgba(0,0,0,0.3)' }}>
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
      {isVideo && hasPreview && (
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
function MilestoneList({ milestones, onToggle, isReadOnly = false }) {
  if (!milestones?.length) return (
    <div style={{ textAlign: 'center', color: 'rgba(148,163,184,0.4)', fontSize: 12, padding: '32px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
      <svg width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ color: 'rgba(148,163,184,0.3)' }}>
        <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
      </svg>
      <div style={{ fontWeight: 600, fontSize: 12 }}>No milestones defined</div>
      <div style={{ fontSize: 10, color: 'rgba(148,163,184,0.3)' }}>Milestones will appear here once added</div>
    </div>
  );
  const done = milestones.filter(m => m.done).length;
  const pct  = Math.round(done / milestones.length * 100);
  const pCol = pColor(pct);
  return (
    <div>
      {/* Header summary */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, padding: '10px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <div>
          <div style={{ fontSize: 10, color: 'rgba(148,163,184,0.5)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 2 }}>Milestone Progress</div>
          <div style={{ fontSize: 12, color: 'rgba(148,163,184,0.8)', fontWeight: 600 }}>{done} of {milestones.length} completed</div>
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, color: pCol, fontFamily: "'DM Mono', monospace" }}>{pct}%</div>
      </div>
      {/* Progress bar */}
      <div style={{ height: 6, background: 'rgba(255,255,255,0.07)', borderRadius: 99, marginBottom: 16, overflow: 'hidden' }}>
        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          style={{ height: '100%', borderRadius: 99, background: `linear-gradient(90deg, ${pCol}, ${pCol}cc)`, boxShadow: `0 0 8px ${pCol}55` }} />
      </div>
      {/* Milestone items */}
      {milestones.map((ms, i) => {
        const overdue = !ms.done && ms.dueDate && ms.dueDate < new Date().toISOString().slice(0, 10);
        return (
          <motion.div key={ms.id}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, padding: '10px 12px',
              borderRadius: 10,
              background: ms.done ? 'rgba(34,197,94,0.06)' : overdue ? 'rgba(239,68,68,0.04)' : 'rgba(255,255,255,0.02)',
              border: `1px solid ${ms.done ? 'rgba(34,197,94,0.22)' : overdue ? 'rgba(239,68,68,0.22)' : 'rgba(255,255,255,0.07)'}`,
              transition: 'all 0.2s',
            }}
          >
            {/* Checkbox circle */}
            <motion.div
              whileTap={!isReadOnly ? { scale: 0.85 } : {}}
              onClick={() => !isReadOnly && onToggle?.(ms.id)}
              style={{ width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                background: ms.done ? 'linear-gradient(135deg, #22c55e, #16a34a)' : 'rgba(255,255,255,0.05)',
                border: `2px solid ${ms.done ? '#22c55e' : overdue ? '#ef4444' : 'rgba(255,255,255,0.15)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: isReadOnly ? 'default' : 'pointer',
                boxShadow: ms.done ? '0 0 8px rgba(34,197,94,0.4)' : 'none',
              }}>
              {ms.done && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                  style={{ fontSize: 11, color: '#fff', fontWeight: 800 }}>✓</motion.span>
              )}
            </motion.div>
            {/* Name & date */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 11.5, color: ms.done ? 'rgba(148,163,184,0.5)' : '#e2e8f0',
                textDecoration: ms.done ? 'line-through' : 'none', fontWeight: 500, lineHeight: 1.4 }}>
                {ms.name}
              </div>
              {ms.dueDate && (
                <div style={{ fontSize: 9.5, color: overdue ? '#f87171' : ms.done ? 'rgba(148,163,184,0.35)' : 'rgba(148,163,184,0.5)', fontWeight: 600, marginTop: 2 }}>
                  {overdue ? '⚠ Overdue · ' : ms.done ? '✓ ' : '📅 '}{fmtDMY(ms.dueDate)}
                </div>
              )}
            </div>
            {/* Complete/Completed toggle button */}
            {!isReadOnly && (
              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.93 }}
                onClick={() => onToggle?.(ms.id)}
                style={{
                  flexShrink: 0, padding: '4px 10px', borderRadius: 20, fontSize: 9.5, fontWeight: 800,
                  cursor: 'pointer', letterSpacing: '0.04em', textTransform: 'uppercase', border: 'none',
                  background: ms.done
                    ? 'rgba(34,197,94,0.15)'
                    : 'rgba(14,116,144,0.15)',
                  color: ms.done ? '#22c55e' : '#0e7490',
                  border: `1px solid ${ms.done ? 'rgba(34,197,94,0.3)' : 'rgba(14,116,144,0.3)'}`,
                  transition: 'all 0.2s',
                }}
              >
                {ms.done ? '✓ Completed' : 'Complete'}
              </motion.button>
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
  const isMobile = useResponsive();
  const [tab,        setTab]         = useState('summary');
  const [proj,       setProj]        = useState(() => JSON.parse(JSON.stringify(project)));
  const [lightbox,   setLightbox]    = useState(null);
  const [dragging,   setDragging]    = useState(false);
  const fileRef = useRef();

  // ── Progress calculation: PAC ÷ PTC × 100 (Financial: FAC ÷ FTC × 100) ────
  // Uses latest cumulative month value from monthlyProgress, falling back to measures, then static field
  const MONTH_ORDER_SP = ['january','february','march','april','may','june','july','august','september','october','november','december'];
  const getLatestVal = (progressKey, measuresKey) => {
    const mp = proj?.monthlyProgress || {};
    for (let i = MONTH_ORDER_SP.length - 1; i >= 0; i--) {
      const month = MONTH_ORDER_SP[i];
      const raw = mp[month]?.[progressKey];
      if (raw !== undefined && raw !== null && raw !== '') {
        const n = parseFloat(String(raw).replace('%', ''));
        if (!isNaN(n)) return n;
      }
    }
    const meas = proj?.measures?.[measuresKey] || {};
    for (let i = MONTH_ORDER_SP.length - 1; i >= 0; i--) {
      const month = MONTH_ORDER_SP[i];
      const raw = meas[month];
      if (raw !== undefined && raw !== null && raw !== '') {
        const n = parseFloat(String(raw).replace('%', ''));
        if (!isNaN(n)) return n;
      }
    }
    return null;
  };
  const _pac = getLatestVal('pp', 'PAC');
  const _ptc = getLatestVal('pt', 'PTC');
  const _fac = getLatestVal('fp', 'FAC');
  const _ftc = getLatestVal('ft', 'FTC');
  const phys = (_pac !== null && _ptc !== null && _ptc > 0)
    ? Math.round((_pac / _ptc) * 100 * 10) / 10
    : (parseFloat(proj.physicalProgress) || 0);
  const fin  = (_fac !== null && _ftc !== null && _ftc > 0)
    ? Math.round((_fac / _ftc) * 100 * 10) / 10
    : (parseFloat(proj.financialProgress) || 0);
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
    // Strip dataUrl from media before saving (it's too large for backend)
    const projToSave = {
      ...proj,
      media: (proj.media || []).map(m => ({
        id: m.id,
        name: m.name,
        date: m.date,
        mediaType: m.mediaType,
        // dataUrl is NOT saved to backend to avoid size issues
      }))
    };
    onSave?.(projToSave);
    onClose();
  };

  const toggleMilestone = (msId) => {
    setProj(p => ({
      ...p,
      milestones: (p.milestones || []).map(ms => 
        ms.id === msId ? { ...ms, done: !ms.done } : ms
      )
    }));
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
        <div style={{ padding: isMobile ? '12px 14px 0' : '16px 18px 0', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: isMobile ? 'flex-start' : 'flex-start', gap: isMobile ? 8 : 10, marginBottom: 14, flexDirection: isMobile ? 'column' : 'row' }}>
            {/* progress rings */}
            <div style={{ display: 'flex', gap: 8, flexShrink: 0, alignSelf: 'flex-start' }}>
              <ProgressRing value={phys} size={64} stroke={5} color={color} label="Physical" isMobile={isMobile} />
              <ProgressRing value={fin}  size={64} stroke={5} color="#0e7490" label="Financial" isMobile={isMobile} />
            </div>

            {/* title */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '2px 8px',
                borderRadius: 99, background: pBg(phys), border: `1px solid ${color}40`, marginBottom: 5 }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: color,
                  display: 'inline-block', ...(proj.reasonsForDelays ? { animation: 'pulseDot 1.4s ease-in-out infinite' } : {}) }} />
                <span style={{ fontSize: isMobile ? 8 : 9, fontWeight: 800, color, letterSpacing: '0.6px', textTransform: 'uppercase' }}>
                  {proj.reasonsForDelays ? 'DELAYED' : pLabel(phys)}
                </span>
              </div>
              <div style={{ fontSize: isMobile ? 11.5 : 12.5, fontWeight: 800, color: '#f1f5f9', lineHeight: 1.4,
                overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                {proj.projectName}
              </div>
              <div style={{ fontSize: isMobile ? 9 : 10, color: 'rgba(148,163,184,0.6)', marginTop: 4, fontWeight: 500 }}>
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
                style={{ flex: 1, padding: isMobile ? '5px 3px' : '6px 4px', border: tab === k ? `1px solid ${color}30` : '1px solid transparent',
                  borderRadius: 8, fontSize: isMobile ? 9.5 : 10.5, fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s' }}>
                {l}
              </motion.button>
            ))}
          </div>
        </div>

        {/* divider */}
        <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '12px 0 0', flexShrink: 0 }} />

        {/* ── Body ──────────────────────────────────────────────────────── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '12px 12px 14px' : '14px 18px 16px' }}>
          <AnimatePresence mode="wait">

            {/* ── SUMMARY TAB ─────────────────────────────────────────── */}
            {tab === 'summary' && (
              <motion.div key="summary"
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22 }}>

                {/* Section: KPIs / Objectives */}
                {(proj.kpi || proj.output || proj.outcome) && (
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 9, fontWeight: 800, color: 'rgba(103,232,249,0.6)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4 12 14.01l-3-3"/></svg>
                      Objectives & KPIs
                    </div>
                    <div style={{ background: 'linear-gradient(135deg, rgba(14,116,144,0.1), rgba(15,118,110,0.06))', border: '1px solid rgba(14,116,144,0.22)', borderRadius: 12, padding: isMobile ? '10px 12px' : '12px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {proj.kpi && (
                        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                          <span style={{ fontSize: 8.5, fontWeight: 800, color: '#0e7490', textTransform: 'uppercase', letterSpacing: '0.5px', background: 'rgba(14,116,144,0.15)', border: '1px solid rgba(14,116,144,0.3)', padding: '2px 7px', borderRadius: 99, flexShrink: 0, marginTop: 1 }}>KPI</span>
                          <div style={{ fontSize: isMobile ? 10.5 : 11.5, color: '#a5f3fc', fontWeight: 600, lineHeight: 1.5 }}>{proj.kpi}</div>
                        </div>
                      )}
                      {proj.output && (
                        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                          <span style={{ fontSize: 8.5, fontWeight: 800, color: '#0f766e', textTransform: 'uppercase', letterSpacing: '0.5px', background: 'rgba(15,118,110,0.15)', border: '1px solid rgba(15,118,110,0.3)', padding: '2px 7px', borderRadius: 99, flexShrink: 0, marginTop: 1 }}>Output</span>
                          <div style={{ fontSize: isMobile ? 10 : 11, color: '#67e8f9', fontWeight: 500, lineHeight: 1.5 }}>{proj.output}</div>
                        </div>
                      )}
                      {proj.outcome && (
                        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                          <span style={{ fontSize: 8.5, fontWeight: 800, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.5px', background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', padding: '2px 7px', borderRadius: 99, flexShrink: 0, marginTop: 1 }}>Outcome</span>
                          <div style={{ fontSize: isMobile ? 10 : 11, color: '#bae6fd', fontWeight: 500, lineHeight: 1.5 }}>{proj.outcome}</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Section: Financial Data */}
                {[proj.tec, proj.awardedSum, proj.revisedCost, proj.allocation2026].some(Boolean) && (
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 9, fontWeight: 800, color: 'rgba(148,163,184,0.5)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                      Financial Summary (LKR Mn)
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 8 }}>
                      {[
                        { label: 'Total Estimated Cost', value: proj.tec, accent: 'rgba(14,116,144,0.25)', border: 'rgba(14,116,144,0.3)' },
                        { label: 'Awarded Sum', value: proj.awardedSum, accent: 'rgba(99,102,241,0.15)', border: 'rgba(99,102,241,0.25)' },
                        { label: 'Revised Cost', value: proj.revisedCost, accent: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.25)' },
                        { label: 'Allocation 2026', value: proj.allocation2026, accent: 'rgba(15,118,110,0.15)', border: 'rgba(15,118,110,0.3)' },
                      ].filter(r => r.value).map(({ label, value, accent, border }) => (
                        <div key={label} style={{ background: accent, border: `1px solid ${border}`, borderRadius: 10, padding: isMobile ? '8px 10px' : '10px 12px' }}>
                          <div style={{ fontSize: 8.5, fontWeight: 700, color: 'rgba(148,163,184,0.5)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>{label}</div>
                          <div style={{ fontSize: isMobile ? 13 : 15, fontWeight: 800, color: '#f8fafc', fontFamily: "'DM Mono', monospace", letterSpacing: '-0.3px' }}>{value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Details */}
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: isMobile ? '8px 10px' : '10px 12px', marginBottom: 10 }}>
                  <InfoRow label="Start Date"   value={fmtDMY(proj.startDate)} isMobile={isMobile} />
                  <InfoRow label="End Date"     value={fmtDMY(proj.endDate)} isMobile={isMobile} />
                  <InfoRow label="NPD"          value={proj.npd} isMobile={isMobile} />
                  <InfoRow label="Responsible"  value={proj.responsibleOfficer} isMobile={isMobile} />
                  {proj.remarks && <InfoRow label="Remarks" value={proj.remarks} isMobile={isMobile} />}
                </div>

                {/* Delay alert */}
                {proj.reasonsForDelays && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)',
                      borderRadius: 10, padding: isMobile ? '8px 10px' : '10px 12px' }}>
                    <div style={{ fontSize: isMobile ? 8.5 : 9.5, fontWeight: 700, color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>
                      ⚠ Delay Reason
                    </div>
                    <div style={{ fontSize: isMobile ? 10.5 : 11.5, color: '#fca5a5', fontWeight: 500, lineHeight: 1.6 }}>
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
                    style={{ border: '2px dashed rgba(14,116,144,0.25)', borderRadius: 12, padding: isMobile ? '12px 10px' : '16px 12px',
                      textAlign: 'center', cursor: 'pointer', marginBottom: 14, transition: 'all 0.2s' }}
                    onClick={() => fileRef.current?.click()}
                    onDragOver={e => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={e => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
                  >
                    <motion.div animate={{ y: dragging ? -4 : 0 }} style={{ marginBottom: 6, color:'#67e8f9' }}>
                      <svg width={isMobile ? 28 : 32} height={isMobile ? 28 : 32} fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24" style={{display:'block',margin:'0 auto'}}>
                        <path d="M3 8a2 2 0 0 1 2-2h3l1.5-2h5L16 6h3a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8z"/>
                        <circle cx="12" cy="12.5" r="3.5"/>
                      </svg>
                    </motion.div>
                    <div style={{ fontSize: isMobile ? 11 : 12, fontWeight: 700, color: '#67e8f9', marginBottom: 3 }}>
                      {dragging ? 'Drop to upload!' : 'Upload Photos & Videos'}
                    </div>
                    <div style={{ fontSize: isMobile ? 9 : 10, color: 'rgba(148,163,184,0.5)', fontWeight: 500 }}>
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
                      <svg width={isMobile ? 32 : 36} height={isMobile ? 32 : 36} fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24" style={{display:'block',margin:'0 auto'}}>
                        <rect x="3" y="4" width="18" height="16" rx="2"/>
                        <path d="M7 15l3-3 3 3 4-4 2 2"/>
                        <circle cx="9" cy="9" r="1"/>
                      </svg>
                    </div>
                    No media uploaded yet
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', gap: 8 }}>
                    {media.map((item, i) => (
                      <MediaThumb key={item.id} item={item} index={i}
                        onPreview={setLightbox} onDelete={isVO ? () => {} : deleteMedia} />
                    ))}
                  </div>
                )}

                {/* count */}
                {media.length > 0 && (
                  <div style={{ marginTop: 10, fontSize: isMobile ? 9 : 10, color: 'rgba(148,163,184,0.4)', fontWeight: 600, textAlign: 'right' }}>
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
                <MilestoneList milestones={proj.milestones} onToggle={toggleMilestone} isReadOnly={isVO} />
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* ── Footer ────────────────────────────────────────────────────── */}
        <div style={{ padding: isMobile ? '10px 12px' : '12px 18px', borderTop: '1px solid rgba(255,255,255,0.06)', flexShrink: 0,
          display: 'flex', gap: 8, justifyContent: 'space-between', flexDirection: isMobile ? 'column-reverse' : 'row',
          background: 'rgba(0,0,0,0.15)' }}>
          {/* Left: Discard */}
          <motion.button
            whileHover={{ scale: 1.02, background: 'rgba(239,68,68,0.12)' }} whileTap={{ scale: 0.97 }}
            onClick={onClose}
            style={{ padding: isMobile ? '9px 14px' : '8px 18px',
              background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: 9, fontSize: isMobile ? 11 : 12, fontWeight: 700,
              color: 'rgba(239,68,68,0.7)', cursor: 'pointer', flex: isMobile ? 1 : 'unset',
              display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.2s' }}>
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
            {isVO ? 'Close' : 'Discard Changes'}
          </motion.button>
          {/* Right: Save */}
          {!isVO && (
            <motion.button
              whileHover={{ scale: 1.03, boxShadow: '0 6px 20px rgba(14,116,144,0.5)' }} whileTap={{ scale: 0.97 }}
              onClick={handleSaveAndClose}
              style={{ padding: isMobile ? '9px 14px' : '8px 22px',
                background: 'linear-gradient(135deg, #0e7490 0%, #0f766e 100%)',
                border: 'none', borderRadius: 9, fontSize: isMobile ? 11 : 12, fontWeight: 800, color: '#fff',
                cursor: 'pointer', boxShadow: '0 3px 14px rgba(14,116,144,0.4)', flex: isMobile ? 1 : 'unset',
                display: 'flex', alignItems: 'center', gap: 6, letterSpacing: '0.02em', transition: 'all 0.2s' }}>
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                <path d="M17 21v-8H7v8M7 3v5h8"/>
              </svg>
              Save & Close
            </motion.button>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default ProjectSummaryPanel;
