import React, { useState, useEffect } from 'react';
import GlobalStyles from './styles/GlobalStyles';
import LoginPage from './pages/LoginPage';
import Dashboard from './components/Dashboard';
import ProjectListView from './components/ProjectListView';
import Analysis from './components/Analysis';
import GanttChart from './components/GanttChart';
import MapView from './components/MapView';
import ProjectSummaryPanel from './components/ProjectSummaryPanel';
import DataEntryTable from './components/DataEntryTable';
import { useToast, ToastContainer } from './components/Toast';
import ThemeToggle from './components/ThemeToggle';
import { ThemeProvider } from './context/ThemeContext';
import { INITIAL_PROJECTS, months, measureTypes } from './utils/data';

const UDA_LOGO_SRC = '/uda-logo.png';

/* ── Sidebar navigation items ── */
const NAV_ITEMS = [
  {
    k: 'dashboard',
    l: 'Dashboard',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/>
        <rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>
      </svg>
    ),
  },
  {
    k: 'analysis',
    l: 'Progress Analysis',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
  },
  {
    k: 'gantt',
    l: 'Timeline',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="3" y="4" width="18" height="3" rx="1"/><rect x="3" y="10" width="12" height="3" rx="1"/>
        <rect x="3" y="16" width="16" height="3" rx="1"/>
      </svg>
    ),
  },
  {
    k: 'map',
    l: 'Map View',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
        <line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/>
      </svg>
    ),
  },
  {
    k: 'table',
    l: 'Data Entry',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18"/>
      </svg>
    ),
  },
];

const PAGE_LABELS = {
  dashboard:   'Dashboard',
  analysis:    'Progress Analysis',
  gantt:       'Timeline',
  map:         'Map View',
  table:       'Data Entry Table',
  projectList: 'Project List',
};



export default function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('dashboard');
  const [listFilter, setListFilter] = useState({ type: 'ALL', budgetLine: 'ALL' });
  const cloneInitialProjects = () => JSON.parse(JSON.stringify(INITIAL_PROJECTS));
  const [projects, setProjects] = useState(() => cloneInitialProjects());
  const [loading, setLoading] = useState(false);
  const [bf, setBf] = useState('ALL');
  const [ab, setAb] = useState('');
  const [ap2, setAp2] = useState('');
  const [modalProject, setModalProject] = useState(null);
  const [syncInfo, setSyncInfo] = useState({
    source: 'local-seed',
    status: 'idle',
    code: '',
    message: 'Using local seed until first API load',
    at: '',
  });
  const { toasts, toast, dismiss } = useToast();

  const isVO = user?.username === 'urban_user';
  const vis = projects;
  const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

  const markSync = (partial) => {
    const stamp = new Date().toLocaleTimeString();
    setSyncInfo((prev) => ({ ...prev, ...partial, at: stamp }));
  };

  const readErrorMessage = async (res) => {
    try {
      const payload = await res.json();
      return payload?.message || JSON.stringify(payload);
    } catch {
      try { return await res.text(); } catch { return ''; }
    }
  };

  const reloadProjects = async () => {
    if (!user) return;
    try {
      setLoading(true);
      markSync({ status: 'syncing', message: 'Reloading projects from MongoDB...' });
      const res = await fetch(`${API_BASE}/api/projects`, { headers: { 'x-user-role': user.username } });
      if (!res.ok) {
        const msg = await readErrorMessage(res);
        throw new Error(`Reload failed (${res.status})${msg ? `: ${msg}` : ''}`);
      }
      const data = await res.json();
      if (Array.isArray(data) && data.length) {
        setProjects(data);
        markSync({ source: 'mongodb', status: 'ok', code: String(res.status), message: `Loaded ${data.length} projects from MongoDB` });
      } else {
        setProjects(cloneInitialProjects());
        markSync({ source: 'local-seed', status: 'fallback', code: String(res.status), message: 'MongoDB returned empty list.' });
      }
    } catch (e) {
      toast(`Failed to reload from server. ${e?.message || ''}`, 'warn');
      setProjects(cloneInitialProjects());
      markSync({ source: 'local-seed', status: 'error', code: 'ERR', message: e?.message || 'Reload failed.' });
    } finally {
      setLoading(false);
    }
  };

  const saveProjectsToServer = async (projectsToSave) => {
    if (!user) return;
    markSync({ status: 'syncing', message: 'Saving project changes to MongoDB...' });
    const res = await fetch(`${API_BASE}/api/projects`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-user-role': user.username },
      body: JSON.stringify(projectsToSave),
    });
    if (res.status === 403) {
      const msg = await readErrorMessage(res);
      markSync({ source: 'mongodb', status: 'error', code: '403', message: msg || 'Forbidden.' });
      toast('You are not allowed to save (read-only role).', 'warn');
      return { ok: false, status: 403, message: msg };
    }
    if (!res.ok) {
      const msg = await readErrorMessage(res);
      markSync({ source: 'mongodb', status: 'error', code: String(res.status), message: msg || 'Save failed' });
      throw new Error(`Save failed (${res.status})${msg ? `: ${msg}` : ''}`);
    }
    markSync({ source: 'mongodb', status: 'ok', code: String(res.status), message: 'Changes saved to MongoDB' });
    return { ok: true, status: res.status };
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/api/projects`, { headers: { 'x-user-role': user.username } });
        if (!res.ok) {
          const msg = await readErrorMessage(res);
          throw new Error(`Failed to load projects (${res.status})${msg ? `: ${msg}` : ''}`);
        }
        const data = await res.json();
        if (cancelled) return;
        if (Array.isArray(data) && data.length) {
          setProjects(data);
          markSync({ source: 'mongodb', status: 'ok', code: String(res.status), message: `Loaded ${data.length} projects from MongoDB` });
        } else {
          setProjects(cloneInitialProjects());
          markSync({ source: 'local-seed', status: 'fallback', code: String(res.status), message: 'MongoDB returned empty list.' });
        }
      } catch (e) {
        if (!cancelled) {
          toast(`Failed to load from server. ${e?.message || ''}`, 'warn');
          setProjects(cloneInitialProjects());
          markSync({ source: 'local-seed', status: 'error', code: 'ERR', message: e?.message || 'Load failed.' });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [user, API_BASE, toast]);

  useEffect(() => {
    if (!user || loading) return;
    const delayed = vis.filter(p => p.reasonsForDelays);
    if (delayed.length) setTimeout(() => toast(`⚠ ${delayed.length} project${delayed.length > 1 ? 's are' : ' is'} currently delayed`, 'warn'), 800);
  }, [user, loading, vis, toast]);

  const hpc = (id, f, v) => setProjects(ps => ps.map(p => p.id === id ? { ...p, [f]: v } : p));
  const hmc = (id, k, m, v) => setProjects(ps => ps.map(p => p.id === id ? { ...p, measures: { ...p.measures, [k]: { ...(p.measures?.[k] || {}), [m]: v } } } : p));
  const hdel = (id) => {
    setProjects((ps) => ps.filter((p) => p.id !== id));
    toast('Project row removed. Click Save Changes to persist delete.', 'warn');
  };

  const hadd = () => {
    if (!ab || !ap2) return alert('Select budget line and project.');
    const nm = months.reduce((o, m) => ({ ...o, [m]: '' }), {});
    const ms = measureTypes.reduce((o, k) => ({ ...o, [k]: { ...nm } }), {});
    const allMonths = ['january','february','march','april','may','june','july','august','september','october','november','december'];
    const emptyMonthly = allMonths.reduce((o, m) => ({ ...o, [m]: { pt: '', pp: '', ft: '', fp: '' } }), {});
    setProjects(ps => [...ps, {
      id: Date.now(),
      district: '',
      department: user.department || 'ALL',
      budgetLine: ab,
      projectNumber: ps.length + 1,
      projectName: ap2,
      startDate: '', endDate: '', npd: '', tec: '', awardedSum: '', revisedCost: '',
      physicalProgress: '', financialProgress: '', allocation2026: '',
      kpi: '', output: '', outcome: '', responsibleOfficer: '',
      reasonsForDelays: '', remarks: '',
      milestones: [], risks: [], documents: [],
      measures: ms, monthlyProgress: emptyMonthly,
    }]);
    setAp2(''); toast('New project row added', 'success');
  };

  const handleSaveModal = (updatedProj) => {
    const next = projects.map(p => p.id === updatedProj.id ? updatedProj : p);
    setProjects(next);
    toast('Saving project management data…', 'info');
    (async () => {
      try {
        const r = await saveProjectsToServer(next);
        if (!r?.ok) return;
        toast('Project management data saved', 'success');
        await reloadProjects();
      } catch (e) { toast('Save failed. Please try again.', 'error'); }
    })();
  };

  const handleSave = () => {
    toast('Saving progress data…', 'info');
    (async () => {
      try {
        const r = await saveProjectsToServer(projects);
        if (!r?.ok) return;
        toast('Progress data saved', 'success');
        await reloadProjects();
      } catch (e) { toast('Save failed. Please try again.', 'error'); }
    })();
  };

  /* ── helpers ── */
  const getUserInitials = () => {
    const role = user?.role || '';
    if (role === 'DG') return 'DG';
    if (role === 'PMU') return 'PM';
    if (role === 'DDG_URBAN') return 'DU';
    return role.slice(0, 2).toUpperCase() || 'U';
  };

  const getUserDisplayName = () => {
    if (user?.role === 'DG') return 'Director General';
    if (user?.role === 'PMU') return 'PMU Officer';
    if (user?.role === 'DDG_URBAN') return 'DDG Urban Dev';
    return user?.role || 'User';
  };

  const delayedCount = vis.filter(p => p.reasonsForDelays).length;

  const syncColor = syncInfo.status === 'ok'
    ? '#10b981'
    : syncInfo.status === 'syncing'
      ? '#06b6d4'
      : syncInfo.status === 'error'
        ? '#ef4444'
        : '#94a3b8';

  const syncBg = syncInfo.status === 'ok'
    ? 'rgba(16,185,129,0.1)'
    : syncInfo.status === 'syncing'
      ? 'rgba(6,182,212,0.1)'
      : syncInfo.status === 'error'
        ? 'rgba(239,68,68,0.1)'
        : 'rgba(148,163,184,0.1)';

  const currentView = view === 'projectList' ? 'projectList' : view;

  return (
    <ThemeProvider>
      <GlobalStyles />
      <ToastContainer toasts={toasts} dismiss={dismiss} />

      {!user ? (
        <LoginPage onLogin={setUser} />
      ) : (
        <div className="app">
          {modalProject && (
            <ProjectSummaryPanel
              project={modalProject}
              onClose={() => setModalProject(null)}
              onSave={handleSaveModal}
              isVO={isVO}
            />
          )}

          {/* ══ SIDEBAR ══ */}
          <aside className="sidebar">
            {/* Brand */}
            <div className="sidebar-brand">
              <img
                className="sidebar-logo"
                src={UDA_LOGO_SRC}
                alt="UDA"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const fb = e.currentTarget.nextElementSibling;
                  if (fb) fb.style.display = 'inline-flex';
                }}
              />
              <span className="sidebar-logo-fallback" style={{ display: 'none' }}>UDA</span>
              <div className="sidebar-brand-text">
                <div className="sidebar-app-name">Project Monitor</div>
                <div className="sidebar-app-sub">Annual Action Plan 2026</div>
              </div>
            </div>

            {/* Nav */}
            <nav className="sidebar-nav">
              <div className="sidebar-section-label">Navigation</div>
              {NAV_ITEMS.map(({ k, l, icon }) => (
                <button
                  key={k}
                  className={`sidebar-item ${(view === k || (view === 'projectList' && k === 'dashboard')) ? 'active' : ''}`}
                  onClick={() => setView(k)}
                >
                  <span className="sidebar-icon">{icon}</span>
                  <span className="sidebar-item-label">{l}</span>
                  {k === 'dashboard' && delayedCount > 0 && (
                    <span className="sidebar-badge">{delayedCount}</span>
                  )}
                </button>
              ))}
            </nav>

            {/* Bottom user + logout */}
            <div className="sidebar-bottom">
              <div className="sidebar-user">
                <div className="sidebar-avatar">{getUserInitials()}</div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div className="sidebar-user-name">{getUserDisplayName()}</div>
                  <div className="sidebar-user-role">
                    {user?.department === 'ALL' ? 'All Departments' : user?.department || user?.role}
                  </div>
                </div>
              </div>
              <button className="sidebar-logout" onClick={() => setUser(null)}>
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                Sign Out
              </button>
            </div>
          </aside>

          {/* ══ MAIN AREA ══ */}
          <div className="main-area">

            {/* ── TOP HEADER ── */}
            <header className="tbar">
              <div className="tbar-left">
                <div className="tbar-page-title">
                  {PAGE_LABELS[currentView] || 'Dashboard'}
                </div>
              </div>

              <div className="tbar-right">
                {/* Search */}
                <div className="tbar-search">
                  <svg className="tbar-search-icon" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                  <input
                    className="tbar-search-input"
                    type="text"
                    placeholder="Search projects..."
                    aria-label="Search projects"
                  />
                </div>

                {/* Sync badge */}
                <div
                  className="sync-badge"
                  title={`${syncInfo.message}${syncInfo.code ? ` | Code: ${syncInfo.code}` : ''}${syncInfo.at ? ` | ${syncInfo.at}` : ''}`}
                  style={{ color: syncColor, background: syncBg, border: `1px solid ${syncColor}33` }}
                >
                  {syncInfo.status === 'ok' ? '● DB' : syncInfo.status === 'syncing' ? '⟳ SYNCING' : syncInfo.status === 'error' ? '✕ ERROR' : '◌ LOCAL'}
                </div>

                {/* Alert if delayed */}
                {delayedCount > 0 && (
                  <button onClick={() => setView('dashboard')} className="alert-chip" title="View delayed projects">
                    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                    </svg>
                    {delayedCount} delayed
                  </button>
                )}

                {/* Theme toggle */}
                <ThemeToggle />

                {/* User chip */}
                <div className="tbar-user-chip">
                  <div className="tbar-avatar">{getUserInitials()}</div>
                  <div className="user-meta">
                    <div className="tbar-un">{getUserDisplayName()}</div>
                    <div className="tbar-ud">{user?.role}</div>
                  </div>
                </div>
              </div>
            </header>

            {/* ── CONTENT ── */}
            <div className="cnt">
              {view === 'dashboard'     && <Dashboard projects={vis} onCardClick={(type, budgetLine) => { setListFilter({ type, budgetLine }); setView('projectList'); }} />}
              {view === 'projectList'   && <ProjectListView projects={vis} filter={listFilter} onOpenModal={setModalProject} onBack={() => setView('dashboard')} isVO={isVO} />}
              {view === 'analysis'      && <Analysis projects={vis} />}
              {view === 'gantt'         && <GanttChart projects={vis} />}
              {view === 'map'           && <MapView projects={vis} user={user} isVO={isVO} onReloadProjects={reloadProjects} toast={toast} />}
              {view === 'table'         && (
                <DataEntryTable
                  projects={vis} isVO={isVO} bf={bf} setBf={setBf} ab={ab} setAb={setAb} ap2={ap2} setAp2={setAp2}
                  hadd={hadd} handleSave={handleSave} setModalProject={setModalProject} hpc={hpc} hmc={hmc} hdel={hdel}
                />
              )}
            </div>

            {/* ── FOOTER ── */}
            <footer className="app-footer">
              <div className="app-footer-left">
                <img
                  className="app-footer-logo"
                  src={UDA_LOGO_SRC}
                  alt="UDA"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const fb = e.currentTarget.nextElementSibling;
                    if (fb) fb.style.display = 'inline-flex';
                  }}
                />
                <span className="app-footer-logo-fallback" style={{ display: 'none' }}>UDA</span>
                <div>
                  <div className="app-footer-title">Urban Development Authority</div>
                  <div className="app-footer-sub">Sri Lanka Government Project Monitoring System</div>
                </div>
              </div>
              <div className="app-footer-right">2026 Annual Action Plan</div>
            </footer>
          </div>
        </div>
      )}
    </ThemeProvider>
  );
}