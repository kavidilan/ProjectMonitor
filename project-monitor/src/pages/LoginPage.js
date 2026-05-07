import React, { useState } from 'react';

const UDA_LOGO_SRC = '/uda-logo.png';

/* =============================================================
   CREDENTIALS — update these to change logins
   ============================================================= */
const CREDENTIALS = [
  { username: 'admin',       password: 'admin123',      role: 'admin',        department: 'ALL',        label: 'admin',       short: 'admin',  access: 'Full Access — Read & Write' },
  { username: 'pmu',   password: 'pmu123',       role: 'PMU',       department: 'Pmu',   label: 'PMU Officer',            short: 'PMU', access: 'Read & Write' },
  { username: 'user', password: 'user123',   role: 'user', department: 'Urban Dev',  label: 'Urban Development',  short: 'UD',  access: 'Read & Write' },
  { username: 'dg_strategy',    password: 'DG#Ops2026!',        role: 'DG',        department: 'Operations', label: 'Director General Ops',   short: 'DG',  access: 'Full Access — Read & Write' },
  { username: 'pmu_north_hub',  password: 'PMU#North2026',      role: 'PMU',       department: 'North Zone', label: 'PMU North Coordinator',  short: 'PMU', access: 'Read & Write' },
  { username: 'pmu_south_hub',  password: 'PMU#South2026',      role: 'PMU',       department: 'South Zone', label: 'PMU South Coordinator',  short: 'PMU', access: 'Read & Write' },
  { username: 'urban_east_cell',password: 'Urban#East2026',     role: 'DDG_URBAN', department: 'East Urban', label: 'DDG Urban East',         short: 'UD',  access: 'Read & Write' },
  { username: 'urban_west_cell',password: 'Urban#West2026',     role: 'DDG_URBAN', department: 'West Urban', label: 'DDG Urban West',         short: 'UD',  access: 'Read & Write' },  
];

/* Hint data shown on login cards */
const PORTAL_HINTS = [
  { key: 'ADMIN',        icon: '👑', color: '#0ea5e9', gradient: 'linear-gradient(135deg,#0369a1,#0ea5e9)',  title: 'Admin',     desc: 'Full system access — portfolio governance & executive reporting.', badge: 'ADMIN'   },
  { key: 'PMU',       icon: '📋', color: '#7c3aed', gradient: 'linear-gradient(135deg,#6d28d9,#7c3aed)',  title: 'PMU Officer',          desc: 'Planning coordination, reporting quality checks & tracking.',       badge: 'PMU'     },
  { key: 'User', icon: '🏙️', color: '#059669', gradient: 'linear-gradient(135deg,#047857,#10b981)', title: 'Urban Dev',        desc: 'Urban project execution, field updates & milestone control.',       badge: 'USER'    },
];

export default function LoginPage({ onLogin }) {
  const [step, setStep]         = useState('landing');   // 'landing' | 'login'
  const [selectedRole, setRole] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const handlePortalClick = (roleKey) => {
    setRole(roleKey);
    setUsername('');
    setPassword('');
    setError('');
    setStep('login');
  };

  const handleSubmit = (e) => {       
    e.preventDefault();
    setError('');
    const normalizedUsername = username.trim().toLowerCase();
    const normalizedPassword = password.trim();

    // Authenticate by credentials first, then derive role from the matched account.
    const match = CREDENTIALS.find(
      (c) =>
        c.username.toLowerCase() === normalizedUsername &&
        (c.password === password || c.password === normalizedPassword)
    );

    if (!match) {  
      setError('Invalid username or password. Please try again.');
      return;   
    }

    setLoading(true);   
    setTimeout(() => {  
      // Keep selected portal in sync with the authenticated account role.
      setRole(match.role);
      onLogin({ username: match.username, role: match.role, department: match.department });
      setLoading(false);
    }, 600);
  };

  const portal = PORTAL_HINTS.find((p) => p.key === selectedRole);

  /* ── CSS ── */
  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@600;700;800&display=swap');

    .lp-wrap {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      background:
        radial-gradient(1200px 700px at 10% -20%, rgba(14,165,233,0.22) 0%, transparent 55%),
        radial-gradient(900px 600px at 95% 20%,   rgba(99,102,241,0.16) 0%, transparent 55%),
        radial-gradient(600px 500px at 50% 110%,  rgba(14,165,233,0.10) 0%, transparent 60%),
        linear-gradient(160deg, #eaf3fb 0%, #e2eef8 50%, #d8e9f4 100%);
      font-family: 'Inter', sans-serif;
    }

    /* ── LANDING ── */
    .lp-landing {
      width: min(1060px, 100%);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0;
      animation: lpFadeIn 0.5s ease;
    }

    @keyframes lpFadeIn { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }

    .lp-header {
      text-align: center;   
      margin-bottom: 52px;  
    }

    .lp-logo-ring {   
      width: 100px; height: 100px;
      border-radius: 20px;
      background: #ffffff;
      display: inline-flex; align-items: center; justify-content: center;
      box-shadow: 0 16px 48px rgba(232,93,4,0.3), 0 0 0 4px rgba(232,93,4,0.15);
      margin-bottom: 20px;
      overflow: hidden;
      padding: 6px;
    }
    .lp-logo-ring img,
    .lp-brand-logo img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      display: block;
    }

    .lp-header h1 {
      font-family: 'Space Grotesk', sans-serif;
      font-size: clamp(30px, 4vw, 44px);
      font-weight: 800;
      letter-spacing: -0.8px;
      margin: 0 0 10px;
      background: linear-gradient(135deg, #0d2137, #0c4a6e, #0ea5e9);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .lp-header p {
      color: #4d6478;
      font-size: 15px;
      font-weight: 500;
      margin: 0;
      line-height: 1.6;
    }

    .lp-portals {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 22px;
      width: 100%;
      margin-bottom: 36px;
    }

    .lp-portal-card {
      background: rgba(255,255,255,0.95);
      border: 2px solid rgba(203,215,229,0.8);
      border-radius: 22px;
      padding: 32px 24px 28px;
      cursor: pointer;
      transition: all 0.28s cubic-bezier(0.4,0,0.2,1);
      display: flex; flex-direction: column; align-items: center;
      text-align: center;
      position: relative; overflow: hidden;
      backdrop-filter: blur(12px);
      box-shadow: 0 4px 20px rgba(13,33,55,0.07);
    }
    .lp-portal-card::before {
      content: '';
      position: absolute; top: 0; left: 0; right: 0; height: 4px;
      border-radius: 22px 22px 0 0;
    }
    .lp-portal-card.dg::before    { background: linear-gradient(90deg,#0369a1,#0ea5e9); }
    .lp-portal-card.pmu::before   { background: linear-gradient(90deg,#6d28d9,#8b5cf6); }
    .lp-portal-card.urban::before { background: linear-gradient(90deg,#047857,#10b981); }

    .lp-portal-card:hover {
      transform: translateY(-10px);
      box-shadow: 0 24px 52px rgba(13,33,55,0.16);
      border-color: rgba(14,165,233,0.5);
    }
    .lp-portal-card.dg:hover    { border-color: rgba(3,105,161,0.5); }
    .lp-portal-card.pmu:hover   { border-color: rgba(109,40,217,0.5); }
    .lp-portal-card.urban:hover { border-color: rgba(4,120,87,0.5); }

    .lp-portal-icon-ring {
      width: 68px; height: 68px; border-radius: 18px;
      display: flex; align-items: center; justify-content: center;
      font-size: 32px;
      margin-bottom: 16px;
      position: relative; z-index: 1;
    }
    .lp-portal-card.dg    .lp-portal-icon-ring { background: linear-gradient(135deg,rgba(14,165,233,0.15),rgba(3,105,161,0.10));  box-shadow:0 8px 20px rgba(14,165,233,0.18); }
    .lp-portal-card.pmu   .lp-portal-icon-ring { background: linear-gradient(135deg,rgba(109,40,217,0.15),rgba(99,102,241,0.10)); box-shadow:0 8px 20px rgba(109,40,217,0.18); }
    .lp-portal-card.urban .lp-portal-icon-ring { background: linear-gradient(135deg,rgba(4,120,87,0.15),rgba(16,185,129,0.10));   box-shadow:0 8px 20px rgba(4,120,87,0.18); }

    .lp-portal-badge {
      position: absolute; top: 18px; right: 18px;
      font-size: 9px; font-weight: 900; letter-spacing: 0.8px;
      padding: 3px 8px; border-radius: 999px;
    }
    .lp-portal-card.dg    .lp-portal-badge { background:rgba(14,165,233,0.14); color:#0369a1;  border:1px solid rgba(14,165,233,0.3); }
    .lp-portal-card.pmu   .lp-portal-badge { background:rgba(109,40,217,0.14); color:#6d28d9;  border:1px solid rgba(109,40,217,0.3); }
    .lp-portal-card.urban .lp-portal-badge { background:rgba(4,120,87,0.14);   color:#047857;  border:1px solid rgba(4,120,87,0.3); }

    .lp-portal-card h3 {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 18px; font-weight: 800;
      margin: 0 0 8px; color:#0d2137;
    }

    .lp-portal-card p {
      font-size: 12.5px; color: #4d6478;
      margin: 0 0 22px; line-height: 1.6;
      flex: 1;
    }

    .lp-portal-btn {
      width: 100%; border: none; border-radius: 10px;
      padding: 11px 0; font-size: 13px; font-weight: 800;
      font-family: 'Inter', sans-serif; color: #fff;
      cursor: pointer; transition: all 0.2s;
      letter-spacing: 0.02em;
    }
    .lp-portal-card.dg    .lp-portal-btn { background: linear-gradient(135deg,#0369a1,#0ea5e9); box-shadow:0 6px 16px rgba(14,165,233,0.28); }
    .lp-portal-card.pmu   .lp-portal-btn { background: linear-gradient(135deg,#6d28d9,#8b5cf6); box-shadow:0 6px 16px rgba(109,40,217,0.28); }
    .lp-portal-card.urban .lp-portal-btn { background: linear-gradient(135deg,#047857,#10b981); box-shadow:0 6px 16px rgba(4,120,87,0.28); }
    .lp-portal-btn:hover { transform:translateY(-2px); filter:brightness(1.08); }

    .lp-footer {
      font-size: 11.5px; color:#6b8299; font-weight:500; text-align:center;
    }

    /* ── LOGIN FORM ── */
    .lp-login-wrap {
      width: min(960px, 100%);
      display: grid;
      grid-template-columns: 1.2fr 1fr;
      border-radius: 24px;
      overflow: hidden;
      border: 1.5px solid rgba(203,215,229,0.7);
      box-shadow: 0 32px 80px rgba(13,33,55,0.18);
      background: #fff;
      animation: lpFadeIn 0.45s ease;
      min-height: 580px;
    }

    .lp-brand {
      position: relative;
      padding: 44px 40px;
      display: flex; flex-direction: column; justify-content: space-between;
      color: #fff; overflow: hidden;
    }
    .lp-brand.dg    { background: linear-gradient(155deg,#0c3f6a 0%,#0369a1 40%,#0ea5e9 85%,#38bdf8 100%); }
    .lp-brand.pmu   { background: linear-gradient(155deg,#3b0f8c 0%,#5b21b6 40%,#7c3aed 85%,#a78bfa 100%); }
    .lp-brand.urban { background: linear-gradient(155deg,#022c22 0%,#065f46 40%,#059669 85%,#34d399 100%); }

    .lp-brand-grid {
      position: absolute; inset: 0; opacity:0.12;
      background-image: linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px);
      background-size: 36px 36px;
      pointer-events: none;
    }
    .lp-brand-orb {
      position: absolute; top:-120px; right:-80px;
      width:320px; height:320px; border-radius:50%;
      background: radial-gradient(circle, rgba(255,255,255,0.14), transparent 70%);
      pointer-events: none;
    }

    .lp-brand-top { position:relative; z-index:1; }
    .lp-brand-logo {
      width: 80px; height: 80px; border-radius: 16px;
      background: rgba(255,255,255,0.95);
      border: 2px solid rgba(255,255,255,0.4);
      backdrop-filter: blur(8px);
      display: inline-flex; align-items: center; justify-content: center;
      margin-bottom: 20px;
      overflow: hidden;
      padding: 6px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.25);
    }
    .lp-brand-top h2 {
      font-family:'Space Grotesk',sans-serif;
      font-size:clamp(24px,2.6vw,34px);
      font-weight:800; margin:0 0 10px;
      letter-spacing:-0.5px; line-height:1.1;
    }
    .lp-brand-top p {
      font-size:13.5px; opacity:0.88;
      line-height:1.6; margin:0; max-width:34ch;
    }

    .lp-brand-stats {
      position:relative; z-index:1;
      display:grid; grid-template-columns:repeat(3,1fr);
      gap:10px;
    }
    .lp-brand-stat {
      border:1px solid rgba(255,255,255,0.26);
      border-radius:13px; padding:12px;
      background:rgba(255,255,255,0.12);
      backdrop-filter:blur(6px);
    }
    .lp-brand-stat strong { display:block; font-size:20px; font-family:'Space Grotesk',sans-serif; }
    .lp-brand-stat span   { font-size:10.5px; opacity:0.88; font-weight:600; }

    .lp-form-wrap {
      padding: 44px 40px;
      display: flex; flex-direction: column; justify-content: center;
      background: #f8fbfd;
    }

    .lp-back-btn {
      background:none; border:none; color:#0369a1;
      cursor:pointer; font-size:12px; font-weight:700;
      font-family:'Inter',sans-serif;
      padding:0 0 20px; text-align:left;
      display:inline-flex; align-items:center; gap:5px;
      transition:color 0.18s;
    }
    .lp-back-btn:hover { color:#0ea5e9; }

    .lp-role-badge {
      display:inline-flex; align-items:center; gap:6px;
      padding:4px 12px; border-radius:999px;
      font-size:10px; font-weight:900; letter-spacing:0.8px;
      margin-bottom:8px;
    }
    .lp-login-wrap.dg    .lp-role-badge { background:rgba(14,165,233,0.12); color:#0369a1; border:1px solid rgba(14,165,233,0.28); }
    .lp-login-wrap.pmu   .lp-role-badge { background:rgba(109,40,217,0.12); color:#6d28d9; border:1px solid rgba(109,40,217,0.28); }
    .lp-login-wrap.urban .lp-role-badge { background:rgba(4,120,87,0.12);   color:#047857; border:1px solid rgba(4,120,87,0.28); }

    .lp-form-wrap h2 {
      font-family:'Space Grotesk',sans-serif;
      font-size:26px; font-weight:800;
      margin:0 0 4px; color:#0d2137;
      letter-spacing:-0.4px;
    }
    .lp-form-sub { font-size:13px; color:#4d6478; margin:0 0 26px; }

    .lp-field { margin-bottom:18px; }
    .lp-field label {
      display:block; font-size:11px; font-weight:800;
      color:#2f4f69; margin-bottom:7px;
      letter-spacing:0.6px; text-transform:uppercase;
    }

    .lp-input-wrap { position:relative; }
    .lp-input {
      width:100%; box-sizing:border-box;
      border:1.5px solid #cad8e6; background:#fff;
      border-radius:10px; font-size:13.5px; font-weight:500;
      color:#0d2137; padding:11px 12px;
      font-family:'Inter',sans-serif;
      transition:border-color 0.18s, box-shadow 0.18s;
    }
    .lp-input:focus {
      outline:none; border-color:#0ea5e9;
      box-shadow:0 0 0 3px rgba(14,165,233,0.14);
    }
    .lp-pw-toggle {
      position:absolute; right:10px; top:50%; transform:translateY(-50%);
      background:none; border:none; cursor:pointer;
      color:#6b8299; font-size:16px; padding:0 4px;
      transition:color 0.15s;
    }
    .lp-pw-toggle:hover { color:#0369a1; }

    .lp-error {
      background:rgba(220,38,38,0.08);
      border:1.5px solid rgba(220,38,38,0.28);
      border-radius:9px; padding:10px 13px;
      font-size:12px; font-weight:700; color:#b91c1c;
      margin-bottom:16px;
      display:flex; align-items:center; gap:8px;
    }

    .lp-credentials-hint {
      background: rgba(248,251,253,0.9);
      border: 1px solid #d7e8f4;
      border-radius: 10px;
      padding: 10px 13px;
      margin-bottom: 18px;
      font-size: 11.5px; color: #2f4f69;
    }
    .lp-credentials-hint strong {
      font-size: 10px; font-weight: 900;
      text-transform: uppercase; letter-spacing: 0.6px;
      display: block; margin-bottom: 5px; color: #0369a1;
    }
    .lp-cred-row {
      display: flex; gap: 6px; align-items: center;
      font-family: 'JetBrains Mono', monospace; font-size: 11px;
      color: #344f69; margin-top: 2px;
    }
    .lp-cred-sep { color: #8aaec9; }

    .lp-submit {
      width:100%; border:0; border-radius:11px;
      padding:13px 14px; color:#fff;
      font-weight:800; font-size:13.5px;
      font-family:'Inter',sans-serif;
      cursor:pointer;
      transition:transform 0.18s, box-shadow 0.18s, opacity 0.18s;
      letter-spacing:0.02em;
    }
    .lp-login-wrap.dg    .lp-submit { background:linear-gradient(135deg,#0369a1,#0ea5e9); box-shadow:0 10px 24px rgba(14,165,233,0.28); }
    .lp-login-wrap.pmu   .lp-submit { background:linear-gradient(135deg,#6d28d9,#8b5cf6); box-shadow:0 10px 24px rgba(109,40,217,0.28); }
    .lp-login-wrap.urban .lp-submit { background:linear-gradient(135deg,#047857,#10b981); box-shadow:0 10px 24px rgba(4,120,87,0.28); }
    .lp-submit:hover   { transform:translateY(-2px); filter:brightness(1.08); }
    .lp-submit:disabled { opacity:0.72; cursor:default; transform:none; }

    .lp-form-foot { margin-top:14px; font-size:11.5px; text-align:center; color:#6b8299; }

    /* ── RESPONSIVE ── */
    @media (max-width: 900px) {
      .lp-portals { grid-template-columns: 1fr; }
      .lp-login-wrap { grid-template-columns: 1fr; }
      .lp-brand { min-height:250px; }
      .lp-brand-stats { grid-template-columns:repeat(3,1fr); }
    }

    @media (max-width: 640px) {
      .lp-wrap { padding: 14px; }
      .lp-header { margin-bottom:32px; }
      .lp-form-wrap { padding:28px 22px; }
      .lp-brand { padding:28px 22px; }
    }
  `;

  const roleKey = selectedRole === 'DG' ? 'dg' : selectedRole === 'PMU' ? 'pmu' : selectedRole === 'DDG_URBAN' ? 'urban' : '';
  const cred = CREDENTIALS.find((c) => c.role === selectedRole);

  return (
    <div className="lp-wrap">
      <style>{css}</style>

      {step === 'landing' ? (
        /* ─────────── LANDING ─────────── */
        <div className="lp-landing">
          <div className="lp-header">
            <div className="lp-logo-ring">
              <img src={UDA_LOGO_SRC} alt="Urban Development Authority" />
            </div>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#5a7a94', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
              <span style={{ height: 1, width: 28, background: '#c5d9e8', display: 'inline-block' }} />
              Urban Development Authority
              <span style={{ height: 1, width: 28, background: '#c5d9e8', display: 'inline-block' }} />
            </div>
            <h1>Project Monitor Suite</h1>
            <p>Annual Action Plan 2026<br />Centralized portfolio control for strategic planning &amp; progress oversight.</p>
          </div>

          <div className="lp-portals">  
            {[
              { roleKey: 'DG',        cls: 'dg',    icon: '👑', badge: 'ADMIN',  title: 'Director General',     desc: 'Portfolio governance, executive monitoring, and full system access across all departments.' },
              { roleKey: 'PMU',       cls: 'pmu',   icon: '📋', badge: 'PMU',    title: 'PMU Officer',          desc: 'Planning coordination, reporting quality control, and implementation progress tracking.' },
              { roleKey: 'DDG_URBAN', cls: 'urban', icon: '🏙️', badge: 'USER',   title: 'DDG Urban Development',desc: 'Urban project field execution, progress updates, milestone control & district reporting.' },
            ].map((p) => (
              <div key={p.roleKey} className={`lp-portal-card ${p.cls}`} onClick={() => handlePortalClick(p.roleKey)}>
                <div className="lp-portal-badge">{p.badge}</div>
                <div className="lp-portal-icon-ring"><span>{p.icon}</span></div>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
                <button className="lp-portal-btn" type="button">Sign In →</button>
              </div>
            ))}
          </div>

          <p className="lp-footer">© 2026 Urban Development Authority · Sri Lanka Government · Secure Access Portal</p>
        </div>
      ) : (
        /* ─────────── LOGIN FORM ─────────── */
        <div className={`lp-login-wrap ${roleKey}`}>
          {/* Brand side */}
          <div className={`lp-brand ${roleKey}`}>
            <div className="lp-brand-grid" />
            <div className="lp-brand-orb" />

            <div className="lp-brand-top">
              <div className="lp-brand-logo">
                <img src={UDA_LOGO_SRC} alt="Urban Development Authority" />
              </div>
              <h2>Project Monitor Suite</h2>
              <p>Annual Action Plan 2026 — Centralized control room for portfolio governance and progress visibility.</p>
            </div>

            <div className="lp-brand-stats">
              {[{ v: '3', l: 'Access Roles' }, { v: '12', l: 'Month Tracks' }, { v: '24/7', l: 'Visibility' }].map((s) => (
                <div key={s.l} className="lp-brand-stat">
                  <strong>{s.v}</strong>
                  <span>{s.l}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Form side */}
          <div className="lp-form-wrap">
            <button className="lp-back-btn" type="button" onClick={() => setStep('landing')}>
              ← Back to portals
            </button>

            <div className="lp-role-badge">
              {portal?.icon} {portal?.title}
            </div>
            <h2>Sign In</h2>
            <p className="lp-form-sub">Enter your credentials to access the dashboard.</p>

            {/* Credential hint box */}
            {cred && (
              <div className="lp-credentials-hint">
                <strong>Login Credentials</strong>
                <div className="lp-cred-row"><span>Username:</span><span className="lp-cred-sep">→</span><strong>{cred.username}</strong></div>
                <div className="lp-cred-row"><span>Password:</span><span className="lp-cred-sep">→</span><strong>{cred.password}</strong></div>
              </div>
            )}

            {error && (
              <div className="lp-error">
                <span>⚠</span> {error}   
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="lp-field">
                <label htmlFor="lp-username">Username</label>
                <input
                  id="lp-username"
                  type="text"
                  className="lp-input"   
                  placeholder={cred?.username || 'Enter username'}
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); setError(''); }}
                  autoComplete="username"
                  autoFocus
                />
              </div>

              <div className="lp-field">
                <label htmlFor="lp-password">Password</label>
                <div className="lp-input-wrap">
                  <input
                    id="lp-password"
                    type={showPw ? 'text' : 'password'}
                    className="lp-input"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(''); }}
                    style={{ paddingRight: 38 }}
                    autoComplete="current-password"
                  />
                  <button
                    className="lp-pw-toggle"
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    title={showPw ? 'Hide password' : 'Show password'}
                  >
                    {showPw ? '🙈' : '👁️'}
                  </button>
                </div>  
              </div>

              <button
                type="submit"
                className="lp-submit"
                disabled={loading || !username || !password}
              >
                {loading ? '⏳ Signing in…' : `Sign In as ${portal?.title || 'User'}`}
              </button>
            </form>

            <p className="lp-form-foot">Urban Development Authority · Annual Action Plan 2026</p>
          </div>
        </div>
      )}
    </div>
  );
}


