import { useEffect } from 'react';

export default function GlobalStyles() {
  useEffect(() => {
    const id = 'pm-global-styles';
    let style = document.getElementById(id);
    if (!style) {
      style = document.createElement('style');
      style.id = id;
      document.head.appendChild(style);
    }

    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Sora:wght@600;700;800&family=JetBrains+Mono:wght@500;600;700&display=swap');

      /* ══════════════════════════════════════════════
         DESIGN TOKENS
      ══════════════════════════════════════════════ */
      :root {
        --f:  'Manrope', 'Segoe UI', sans-serif;
        --fh: 'Sora', 'Segoe UI', sans-serif;
        --m:  'JetBrains Mono', 'Consolas', monospace;

        /* Light palette */
        --bg:         #f0f4f8;
        --bg-soft:    #f8fafc;
        --panel:      #ffffff;
        --panel-2:    #f1f5f9;
        --panel-3:    #e2e8f0;
        --tx-1:       #0f172a;
        --tx-2:       #475569;
        --tx-3:       #94a3b8;
        --bd:         #e2e8f0;
        --bd-2:       #cbd5e1;
        --acc:        #0e7490;
        --acc-2:      #0f766e;
        --acc-3:      #115e59;
        --good:       #10b981;
        --warn:       #f59e0b;
        --bad:        #ef4444;
        --purple:     #0284c7;
        --indigo:     #0e7490;
        --teal:       #14b8a6;
        --cyan:       #06b6d4;

        /* Sidebar tokens */
        --sidebar-bg: #0d1829;
        --sidebar-bg2: #111e35;
        --sidebar-active: #1e3a5f;
        --sidebar-hover: rgba(255,255,255,0.06);
        --sidebar-tx: rgba(255,255,255,0.65);
        --sidebar-tx-active: #ffffff;
        --sidebar-accent: #0e7490;
        --sidebar-w: 220px;

        --shadow-sm:  0 1px 3px rgba(15,23,42,0.06), 0 1px 2px rgba(15,23,42,0.04);
        --shadow-md:  0 4px 12px rgba(15,23,42,0.08), 0 2px 4px rgba(15,23,42,0.04);
        --shadow-lg:  0 10px 30px rgba(15,23,42,0.1), 0 4px 10px rgba(15,23,42,0.05);
        --shadow-xl:  0 20px 50px rgba(15,23,42,0.14), 0 8px 16px rgba(15,23,42,0.06);

        --radius-sm: 8px;
        --radius-md: 12px;
        --radius-lg: 16px;
        --radius-xl: 20px;
      }

      html[data-theme='dark'] {
        --bg:         #060d1a;
        --bg-soft:    #080f1c;
        --panel:      #0d1829;
        --panel-2:    #111e35;
        --panel-3:    #162540;
        --tx-1:       #f1f5f9;
        --tx-2:       #94a3b8;
        --tx-3:       #64748b;
        --bd:         #1e3a5f;
        --bd-2:       #254a78;
        --acc:        #22d3ee;
        --acc-2:      #06b6d4;
        --acc-3:      #0e7490;

        --sidebar-bg: #06101e;
        --sidebar-bg2: #08152a;
        --sidebar-active: #1a3050;
        --sidebar-hover: rgba(255,255,255,0.05);

        --shadow-sm:  0 1px 3px rgba(0,0,0,0.3);
        --shadow-md:  0 4px 12px rgba(0,0,0,0.35);
        --shadow-lg:  0 10px 30px rgba(0,0,0,0.4);
        --shadow-xl:  0 20px 50px rgba(0,0,0,0.48);
      }

      /* ══════════════════════════════════════════════
         RESET & BASE
      ══════════════════════════════════════════════ */
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

      input[type=number]::-webkit-inner-spin-button,
      input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
      input[type=number] { -moz-appearance: textfield; }

      html { scroll-behavior: smooth; }

      body {
        font-family: var(--f);
        font-size: 13px;
        line-height: 1.5;
        color: var(--tx-1);
        background: var(--bg);
        min-height: 100vh;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        overflow-x: hidden;
      }

      #root { min-height: 100vh; }

      /* ══════════════════════════════════════════════
         APP SHELL — SIDEBAR LAYOUT
      ══════════════════════════════════════════════ */
      .app {
        min-height: 100vh;
        display: flex;
        flex-direction: row;
      }

      /* ══════════════════════════════════════════════
         SIDEBAR
      ══════════════════════════════════════════════ */
      .sidebar {
        width: var(--sidebar-w);
        min-height: 100vh;
        background: var(--sidebar-bg);
        display: flex;
        flex-direction: column;
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        z-index: 200;
        overflow: hidden;
        transition: width 0.3s cubic-bezier(0.4,0,0.2,1);
      }

      .sidebar::before {
        content:'';
        position:absolute;
        top:0; left:0; right:0;
        height:300px;
        background: radial-gradient(ellipse 180px 200px at 20% 0%, rgba(99,102,241,0.18), transparent 70%);
        pointer-events:none;
      }

      .sidebar-brand {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 18px 16px 16px;
        border-bottom: 1px solid rgba(255,255,255,0.07);
        position: relative;
        z-index:1;
        min-height: 82px;
        background: rgba(255,255,255,0.02);
      }

      .sidebar-logo {
        width: 52px;
        height: 52px;
        border-radius: 12px;
        object-fit: contain;
        background: #fff;
        flex-shrink: 0;
        box-shadow: 0 4px 16px rgba(0,0,0,0.35), 0 0 0 2px rgba(255,255,255,0.12);
        padding: 3px;
      }

      .sidebar-logo-fallback {
        width: 52px; height: 52px;
        border-radius: 12px;
        display: inline-flex; align-items: center; justify-content: center;
        background: linear-gradient(135deg, #e85d04, #f48c06);
        color: #fff;
        font-size: 13px; font-weight: 900; letter-spacing: 0.06em;
        flex-shrink: 0;
        box-shadow: 0 4px 16px rgba(232,93,4,0.5);
      }

      .sidebar-brand-text {
        min-width: 0;
        flex: 1;
      }

      .sidebar-app-name {
        font-family: var(--fh);
        font-size: 13.5px;
        font-weight: 800;
        color: #fff;
        line-height: 1.2;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        letter-spacing: -0.2px;
      }

      .sidebar-app-sub {
        font-size: 9.5px;
        color: rgba(255,255,255,0.45);
        font-weight: 600;
        margin-top: 3px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        letter-spacing: 0.02em;
      }

      /* ── NAV ITEMS ── */
      .sidebar-nav {
        flex: 1;
        padding: 14px 10px;
        display: flex;
        flex-direction: column;
        gap: 2px;
        overflow-y: auto;
        overflow-x: hidden;
        position: relative;
        z-index:1;
      }

      .sidebar-nav::-webkit-scrollbar { width:4px; }
      .sidebar-nav::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius:99px; }

      .sidebar-section-label {
        font-size: 9.5px;
        font-weight: 700;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: rgba(255,255,255,0.28);
        padding: 14px 10px 6px;
      }

      .sidebar-item {
        display: flex;
        align-items: center;
        gap: 11px;
        padding: 10px 12px;
        border-radius: 10px;
        cursor: pointer;
        border: none;
        background: transparent;
        color: var(--sidebar-tx);
        font-family: var(--f);
        font-size: 13px;
        font-weight: 600;
        width: 100%;
        text-align: left;
        transition: all 0.18s cubic-bezier(0.4,0,0.2,1);
        position: relative;
        white-space: nowrap;
        overflow: hidden;
      }

      .sidebar-item:hover {
        background: var(--sidebar-hover);
        color: rgba(255,255,255,0.88);
      }

      .sidebar-item.active {
        background: var(--sidebar-active);
        color: var(--sidebar-tx-active);
        font-weight: 700;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      }

      .sidebar-item.active::before {
        content:'';
        position: absolute;
        left:0; top:20%; bottom:20%;
        width:3px;
        border-radius:0 3px 3px 0;
        background: var(--sidebar-accent);
      }

      .sidebar-icon {
        width: 20px;
        height: 20px;
        flex-shrink: 0;
        opacity: 0.75;
        transition: opacity 0.18s;
      }

      .sidebar-item:hover .sidebar-icon,
      .sidebar-item.active .sidebar-icon {
        opacity: 1;
      }

      .sidebar-item-label {
        flex: 1;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .sidebar-badge {
        background: rgba(239,68,68,0.9);
        color: #fff;
        font-size: 9px;
        font-weight: 800;
        padding: 2px 6px;
        border-radius: 99px;
        min-width: 18px;
        text-align: center;
        flex-shrink: 0;
      }

      /* ── SIDEBAR BOTTOM ── */
      .sidebar-bottom {
        padding: 10px 10px 16px;
        border-top: 1px solid rgba(255,255,255,0.07);
        position: relative;
        z-index:1;
      }

      .sidebar-user {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 12px;
        border-radius: 10px;
        margin-bottom: 4px;
        background: rgba(255,255,255,0.04);
        border: 1px solid rgba(255,255,255,0.06);
      }

      .sidebar-avatar {
        width: 34px; height: 34px;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--acc), var(--purple));
        display: flex; align-items: center; justify-content: center;
        color: #fff;
        font-size: 12px; font-weight: 800;
        flex-shrink: 0;
      }

      .sidebar-user-name {
        font-size: 12px;
        font-weight: 700;
        color: rgba(255,255,255,0.85);
        line-height: 1.2;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .sidebar-user-role {
        font-size: 10px;
        color: rgba(255,255,255,0.4);
        font-weight: 600;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .sidebar-logout {
        display: flex;
        align-items: center;
        gap: 9px;
        padding: 9px 12px;
        border-radius: 10px;
        cursor: pointer;
        border: none;
        background: transparent;
        color: rgba(239,68,68,0.75);
        font-family: var(--f);
        font-size: 12.5px;
        font-weight: 600;
        width: 100%;
        text-align: left;
        transition: all 0.18s;
        white-space: nowrap;
      }

      .sidebar-logout:hover {
        background: rgba(239,68,68,0.1);
        color: #f87171;
      }

      /* ══════════════════════════════════════════════
         MAIN CONTENT AREA
      ══════════════════════════════════════════════ */
      .main-area {
        margin-left: var(--sidebar-w);
        flex: 1;
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        min-width: 0;
      }

      /* ══════════════════════════════════════════════
         TOP HEADER
      ══════════════════════════════════════════════ */
      .tbar {
        position: sticky;
        top: 0;
        z-index: 100;
        min-height: 64px;
        border-bottom: 1px solid var(--bd);
        background: rgba(255,255,255,0.95);
        backdrop-filter: blur(20px) saturate(200%);
        -webkit-backdrop-filter: blur(20px) saturate(200%);
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        padding: 0 24px;
        box-shadow: 0 1px 0 var(--bd);
      }

      html[data-theme='dark'] .tbar {
        background: rgba(13,24,41,0.95);
      }

      .tbar-left, .tbar-right { display: flex; align-items: center; gap: 10px; }
      .tbar-right { margin-left: auto; }
      .user-meta  { text-align: right; }

      /* Page title in header */
      .tbar-page-title {
        font-family: var(--fh);
        font-size: 18px;
        font-weight: 700;
        color: var(--tx-1);
        letter-spacing: -0.3px;
      }

      /* ── SEARCH BAR ── */
      .tbar-search {
        position: relative;
        display: flex;
        align-items: center;
      }

      .tbar-search-icon {
        position: absolute;
        left: 12px;
        color: var(--tx-3);
        pointer-events: none;
      }

      .tbar-search-input {
        background: var(--panel-2);
        border: 1.5px solid var(--bd);
        border-radius: 10px;
        color: var(--tx-1);
        font-family: var(--f);
        font-size: 12.5px;
        font-weight: 500;
        padding: 8px 14px 8px 36px;
        width: 220px;
        transition: all 0.2s;
        outline: none;
      }

      .tbar-search-input::placeholder { color: var(--tx-3); }

      .tbar-search-input:focus {
        border-color: var(--acc);
        background: var(--panel);
        box-shadow: 0 0 0 3px rgba(14,116,144,0.12);
        width: 270px;
      }

      /* ── HEADER ICON BUTTONS ── */
      .tbar-icon-btn {
        width: 36px; height: 36px;
        border-radius: 9px;
        border: 1.5px solid var(--bd);
        background: var(--panel);
        color: var(--tx-2);
        display: flex; align-items: center; justify-content: center;
        cursor: pointer;
        position: relative;
        transition: all 0.18s;
      }
      .tbar-icon-btn:hover { border-color: var(--acc); color: var(--acc); background: rgba(14,116,144,0.08); }

      .tbar-notif-dot {
        position: absolute;
        top: 6px; right: 6px;
        width: 8px; height: 8px;
        border-radius: 50%;
        background: var(--bad);
        border: 2px solid var(--panel);
      }

      /* ── HEADER USER CHIP ── */
      .tbar-user-chip {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 5px 10px 5px 5px;
        border-radius: 10px;
        border: 1.5px solid var(--bd);
        background: var(--panel);
        cursor: default;
      }

      .tbar-avatar {
        width: 32px; height: 32px;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--acc), var(--purple));
        display: flex; align-items: center; justify-content: center;
        color: #fff;
        font-size: 11px; font-weight: 800;
        flex-shrink: 0;
      }

      .tbar-un { font-size: 12px; font-weight: 700; color: var(--tx-1); line-height: 1.2; }
      .tbar-ud { font-size: 10px; color: var(--tx-3); font-weight: 600; }

      /* Sync badge */
      .sync-badge {
        padding: 5px 10px;
        border-radius: 999px;
        border: 1px solid var(--bd);
        font-size: 10px;
        font-weight: 800;
        letter-spacing: 0.4px;
        white-space: nowrap;
      }

      .alert-chip {
        padding: 6px 11px;
        border: 1.5px solid rgba(239,68,68,0.35);
        border-radius: 10px;
        background: rgba(239,68,68,0.08);
        font-size: 11px; font-weight: 700;
        color: var(--bad);
        cursor: pointer;
        display: inline-flex; align-items: center; gap: 5px;
        transition: all 0.2s;
        animation: pulseAlert 2s infinite;
      }
      .alert-chip:hover { background: rgba(239,68,68,0.16); transform: translateY(-1px); }

      @keyframes pulseAlert {
        0%, 100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.2); }
        50%       { box-shadow: 0 0 0 4px rgba(239,68,68,0.06); }
      }

      /* ── OLD TBAR COMPAT ── */
      .tbar-brand, .tbar-logo-img, .tbar-logo-fallback,
      .tbar-title, .tbar-brand-sub, .tbar-sub, .tbar-div { display: none !important; }

      .tbar-badge {
        background: linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1));
        border: 1px solid rgba(99,102,241,0.3);
        color: var(--acc-2);
        padding: 4px 10px;
        border-radius: 999px;
        font-size: 9.5px;
        font-weight: 800;
        letter-spacing: 0.6px;
        text-transform: uppercase;
      }

      /* ══════════════════════════════════════════════
         NAV BAR (hidden — replaced by sidebar)
      ══════════════════════════════════════════════ */
      .nbar { display: none; }

      /* ══════════════════════════════════════════════
         CONTENT AREA
      ══════════════════════════════════════════════ */
      .cnt { padding: 24px; flex: 1; background: var(--bg); }

      /* ══════════════════════════════════════════════
         PAGE HEADER BANNER (inside content)
      ══════════════════════════════════════════════ */
      .page-banner {
        border-radius: var(--radius-lg);
        padding: 28px 28px 24px;
        margin-bottom: 24px;
        position: relative;
        overflow: hidden;
        color: #fff;
        min-height: 120px;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
      }

      .page-banner::before {
        content:'';
        position: absolute;
        inset:0;
        background: rgba(0,0,0,0.15);
      }

      .page-banner-content { position: relative; z-index:1; }

      .page-banner-tags {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 10px;
      }

      .page-banner-tag {
        font-size: 10px;
        font-weight: 800;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        padding: 3px 10px;
        border-radius: 6px;
        background: rgba(255,255,255,0.15);
        border: 1px solid rgba(255,255,255,0.22);
        backdrop-filter: blur(4px);
      }

      .page-banner-tag.status-active {
        background: rgba(16,185,129,0.25);
        border-color: rgba(16,185,129,0.4);
        color: #6ee7b7;
      }

      .page-banner-tag.status-ongoing {
        background: rgba(245,158,11,0.25);
        border-color: rgba(245,158,11,0.4);
        color: #fcd34d;
      }

      .page-banner-tag.status-delayed {
        background: rgba(239,68,68,0.25);
        border-color: rgba(239,68,68,0.4);
        color: #fca5a5;
      }

      .page-banner h1 {
        font-family: var(--fh);
        font-size: 30px;
        font-weight: 800;
        letter-spacing: -0.5px;
        margin: 0;
        line-height: 1.15;
      }

      .page-banner-action {
        position: absolute;
        right: 28px;
        bottom: 28px;
        z-index:1;
      }

      /* ══════════════════════════════════════════════
         CARD
      ══════════════════════════════════════════════ */
      .card {
        background: var(--panel);
        border: 1px solid var(--bd);
        border-radius: var(--radius-lg);
        padding: 20px;
        box-shadow: var(--shadow-sm);
        transition: box-shadow 0.2s, transform 0.2s;
      }

      .card:hover {
        box-shadow: var(--shadow-md);
        transform: translateY(-2px);
      }

      .cp  { }
      .ct2 { font-size: 15px; font-family: var(--fh); font-weight: 700; margin-bottom: 4px; }
      .cs  { color: var(--tx-2); font-size: 12px; }

      .sr {
        display: flex;
        gap: 14px;
        margin-bottom: 16px;
        overflow-x: auto;
        padding-bottom: 6px;
        scrollbar-width: thin;
        scrollbar-color: var(--bd) transparent;
      }

      .sc {
        display: flex;
        align-items: center;
        gap: 12px;
        border-radius: 14px;
        padding: 14px;
        cursor: pointer;
        transition: all 0.22s;
        min-width: 210px;
        flex: 0 0 210px;
        border: 1.5px solid transparent;
        background: var(--panel);
      }
      .sc:hover { transform: translateY(-3px); box-shadow: var(--shadow-lg); border-color: var(--bd); }
      .si   { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
      .sv2  { font-size: 24px; font-family: var(--fh); font-weight: 800; }
      .sl2  { font-size: 12px; color: var(--tx-2); font-weight: 600; }
      .fb   { display: flex; justify-content: space-between; align-items: center; margin: 12px 0; gap: 10px; flex-wrap: wrap; }
      .fg   { display: flex; align-items: center; gap: 8px; }
      .fl   { font-size: 12px; color: var(--tx-2); font-weight: 700; }

      .fs {
        background: var(--panel);
        border: 1.5px solid var(--bd);
        border-radius: 10px;
        color: var(--tx-1);
        font-family: var(--f);
        font-size: 12px;
        font-weight: 600;
        padding: 8px 10px;
        transition: border-color 0.18s;
        appearance: none;
        outline: none;
      }
      .fs:focus { border-color: var(--acc); box-shadow: 0 0 0 3px rgba(14,116,144,0.1); }

      .ft  { font-size: 12px; color: var(--tx-2); font-weight: 700; }
      .cr2 { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
      .dc  { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; flex-direction: column; }
      .dc-p { font-size: 22px; font-weight: 800; font-family: var(--m); }
      .dc-s { font-size: 11px; color: var(--tx-2); }

      /* ══════════════════════════════════════════════
         RESOURCE / PROJECT CARDS (facilities-style grid)
      ══════════════════════════════════════════════ */
      .resource-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
        gap: 20px;
      }

      .resource-card {
        background: var(--panel);
        border: 1px solid var(--bd);
        border-radius: var(--radius-lg);
        overflow: hidden;
        cursor: pointer;
        transition: all 0.25s cubic-bezier(0.4,0,0.2,1);
        box-shadow: var(--shadow-sm);
      }

      .resource-card:hover {
        transform: translateY(-5px);
        box-shadow: var(--shadow-lg);
        border-color: var(--acc);
      }

      .resource-card-header {
        height: 120px;
        position: relative;
        display: flex;
        align-items: flex-end;
        padding: 12px;
      }

      .resource-card-status {
        position: absolute;
        top: 10px; right: 10px;
        font-size: 9px;
        font-weight: 800;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        padding: 3px 8px;
        border-radius: 5px;
        background: rgba(16,185,129,0.22);
        border: 1px solid rgba(16,185,129,0.4);
        color: #34d399;
      }

      .resource-card-status.delayed {
        background: rgba(239,68,68,0.2);
        border-color: rgba(239,68,68,0.4);
        color: #f87171;
      }

      .resource-card-icon {
        width: 38px; height: 38px;
        border-radius: 10px;
        background: rgba(255,255,255,0.18);
        backdrop-filter: blur(8px);
        border: 1px solid rgba(255,255,255,0.25);
        display: flex; align-items: center; justify-content: center;
        color: #fff;
        font-size: 18px;
      }

      .resource-card-body {
        padding: 14px 16px;
      }

      .resource-card-name {
        font-family: var(--fh);
        font-size: 15px;
        font-weight: 700;
        color: var(--tx-1);
        margin-bottom: 3px;
      }

      .resource-card-type {
        font-size: 10px;
        font-weight: 700;
        color: var(--tx-3);
        letter-spacing: 0.08em;
        text-transform: uppercase;
        margin-bottom: 10px;
      }

      .resource-card-meta {
        display: flex;
        flex-direction: column;
        gap: 5px;
      }

      .resource-card-meta-item {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 11.5px;
        color: var(--tx-2);
        font-weight: 500;
      }

      /* ══════════════════════════════════════════════
         SECTION HEADERS
      ══════════════════════════════════════════════ */
      .section-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        gap: 12px;
        margin-bottom: 20px;
        flex-wrap: wrap;
      }

      .section-kicker {
        font-size: 10px;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.12em;
        color: var(--acc);
        margin-bottom: 4px;
      }

      .section-title {
        font-family: var(--fh);
        font-size: 22px;
        font-weight: 800;
        letter-spacing: -0.03em;
        color: var(--tx-1);
        margin: 0;
      }

      .section-sub {
        margin: 4px 0 0;
        font-size: 13px;
        color: var(--tx-2);
        font-weight: 500;
      }

      /* ══════════════════════════════════════════════
         FILTER BAR (pill-style tabs)
      ══════════════════════════════════════════════ */
      .filter-bar {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 14px 0;
        flex-wrap: wrap;
      }

      .filter-search-wrap {
        position: relative;
        display: flex;
        align-items: center;
        flex: 1;
        max-width: 320px;
        min-width: 180px;
      }

      .filter-search-icon {
        position: absolute;
        left: 12px;
        color: var(--tx-3);
        pointer-events: none;
      }

      .filter-search {
        width: 100%;
        background: var(--panel);
        border: 1.5px solid var(--bd);
        border-radius: 10px;
        color: var(--tx-1);
        font-family: var(--f);
        font-size: 12.5px;
        font-weight: 500;
        padding: 9px 12px 9px 36px;
        outline: none;
        transition: all 0.18s;
      }

      .filter-search:focus { border-color: var(--acc); box-shadow: 0 0 0 3px rgba(14,116,144,0.1); }

      .filter-pill {
        padding: 7px 16px;
        border-radius: 8px;
        border: 1.5px solid var(--bd);
        background: var(--panel);
        color: var(--tx-2);
        font-size: 12px;
        font-weight: 700;
        font-family: var(--f);
        cursor: pointer;
        transition: all 0.18s;
        white-space: nowrap;
      }

      .filter-pill:hover { border-color: var(--acc); color: var(--acc); }

      .filter-pill.active {
        background: var(--tx-1);
        border-color: var(--tx-1);
        color: #fff;
      }

      /* ══════════════════════════════════════════════
         SIGN OUT BUTTON
      ══════════════════════════════════════════════ */
      .lo-btn {
        border: 1.5px solid rgba(239,68,68,0.3);
        color: var(--bad);
        background: rgba(239,68,68,0.06);
        border-radius: 10px;
        padding: 7px 13px;
        cursor: pointer;
        display: inline-flex; align-items: center; gap: 6px;
        font-size: 12px; font-weight: 700; font-family: var(--f);
        transition: all 0.18s;
      }
      .lo-btn:hover {
        background: rgba(239,68,68,0.12);
        border-color: rgba(239,68,68,0.5);
        transform: translateY(-1px);
      }

      /* ══════════════════════════════════════════════
         FOOTER
      ══════════════════════════════════════════════ */
      .app-footer {
        margin-top: auto;
        min-height: 52px;
        border-top: 1px solid var(--bd);
        background: var(--panel);
        display: flex; align-items: center; justify-content: space-between;
        gap: 12px;
        padding: 10px 24px;
      }

      .app-footer-left  { display: flex; align-items: center; gap: 10px; min-width: 0; }

      .app-footer-logo {
        width: 28px; height: 28px;
        object-fit: contain; border-radius: 7px;
        border: 1px solid var(--bd); background: #fff;
        flex-shrink: 0;
      }

      .app-footer-logo-fallback {
        width: 28px; height: 28px; border-radius: 7px;
        display: inline-flex; align-items: center; justify-content: center;
        background: linear-gradient(135deg, var(--acc), var(--acc-2));
        color: #fff; font-size: 10px; font-weight: 800; letter-spacing: 0.05em;
        flex-shrink: 0;
      }

      .app-footer-title { font-size: 12px; color: var(--tx-1); font-weight: 700; line-height: 1.2; }
      .app-footer-sub   { font-size: 10px; color: var(--tx-3); font-weight: 600; }
      .app-footer-right { font-size: 11px; color: var(--tx-3); font-weight: 700; white-space: nowrap; }

      /* ══════════════════════════════════════════════
         TABLES
      ══════════════════════════════════════════════ */
      .pm-table { width: 100%; border-collapse: collapse; }
      .pm-table th, .pm-table td {
        border-bottom: 1px solid var(--bd);
        padding: 9px 10px;
        font-size: 12px;
        text-align: left;
      }
      .pm-table thead th {
        background: var(--panel-2);
        font-weight: 700;
        color: var(--tx-2);
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        position: sticky;
        top: 0;
        z-index: 5;
      }

      /* ══════════════════════════════════════════════
         INPUTS (global)
      ══════════════════════════════════════════════ */
      .pm-input {
        width: 100%;
        box-sizing: border-box;
        background: var(--panel);
        border: 1.5px solid var(--bd);
        border-radius: 10px;
        color: var(--tx-1);
        font-family: var(--f);
        font-size: 13px;
        font-weight: 500;
        padding: 10px 12px;
        transition: border-color 0.18s, box-shadow 0.18s;
        appearance: none;
        -webkit-appearance: none;
        outline: none;
      }
      .pm-input:focus {
        border-color: var(--acc);
        box-shadow: 0 0 0 3px rgba(14,116,144,0.12);
      }

      /* ══════════════════════════════════════════════
         BUTTONS (global)
      ══════════════════════════════════════════════ */
      .bp {
        border: 0;
        border-radius: var(--radius-sm);
        background: linear-gradient(135deg, var(--acc), var(--acc-2));
        color: #fff;
        font-size: 12px; font-weight: 700; font-family: var(--f);
        padding: 9px 16px;
        cursor: pointer;
        display: inline-flex; align-items: center; gap: 6px;
        transition: transform 0.18s, box-shadow 0.18s;
        box-shadow: 0 4px 12px rgba(14,116,144,0.25);
      }
      .bp:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(14,116,144,0.35); }

      .btn-primary {
        width: 100%;
        border: 0;
        border-radius: var(--radius-md);
        background: linear-gradient(135deg, var(--acc), var(--acc-2));
        color: #fff;
        font-family: var(--f);
        font-size: 13px; font-weight: 800;
        padding: 12px 16px;
        cursor: pointer;
        box-shadow: 0 6px 18px rgba(14,116,144,0.25);
        transition: transform 0.18s, box-shadow 0.18s;
        letter-spacing: 0.02em;
        outline: none;
      }
      .btn-primary:hover   { transform: translateY(-2px); box-shadow: 0 12px 26px rgba(14,116,144,0.35); }
      .btn-primary:active  { transform: translateY(0); }

      .btn-secondary {
        background: var(--panel);
        color: var(--tx-1);
        border: 1.5px solid var(--bd);
        border-radius: var(--radius-md);
        padding: 11px 16px;
        font-size: 13px; font-weight: 700; font-family: var(--f);
        cursor: pointer;
        transition: all 0.18s;
        outline: none;
      }
      .btn-secondary:hover { border-color: var(--acc); background: rgba(14,116,144,0.07); }

      /* ══════════════════════════════════════════════
         PAGE WRAP
      ══════════════════════════════════════════════ */
      .page-wrap {
        min-height: 100vh;
        padding: 22px;
        display: grid;
        place-items: center;
      }

      /* ══════════════════════════════════════════════
         LOGIN – LANDING PAGE
      ══════════════════════════════════════════════ */
      .login-landing {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 24px;
        background:
          radial-gradient(1200px 600px at 10% -20%, rgba(99,102,241,0.2), transparent 55%),
          radial-gradient(900px 500px at 90% 10%,  rgba(139,92,246,0.14), transparent 50%),
          radial-gradient(600px 400px at 50% 110%,  rgba(99,102,241,0.08),  transparent 60%),
          linear-gradient(135deg, #f0f4f8 0%, #e8ecf4 100%);
      }

      html[data-theme='dark'] .login-landing {
        background:
          radial-gradient(1200px 600px at 10% -20%, rgba(99,102,241,0.15), transparent 55%),
          radial-gradient(900px 500px at 90% 10%,  rgba(139,92,246,0.10), transparent 50%),
          linear-gradient(135deg, #06101e 0%, #080f1c 100%);
      }

      .login-landing-header {
        display: flex;
        align-items: center;
        gap: 18px;
        margin-bottom: 52px;
        text-align: left;
      }

      .landing-title {
        font-family: var(--fh);
        font-size: 32px;
        font-weight: 800;
        margin: 0;
        letter-spacing: -0.8px;
        background: linear-gradient(135deg, var(--tx-1), var(--acc));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .landing-subtitle {
        color: var(--tx-2);
        font-size: 13.5px;
        margin: 5px 0 0 0;
        font-weight: 600;
      }

      .login-landing-content {
        max-width: 1000px;
        width: 100%;
        text-align: center;
      }

      .login-landing-content h2 {
        font-family: var(--fh);
        font-size: 28px;
        font-weight: 800;
        margin-bottom: 10px;
        letter-spacing: -0.5px;
      }

      .login-landing-content > p {
        color: var(--tx-2);
        font-size: 15px;
        margin-bottom: 38px;
        line-height: 1.6;
      }

      .login-portal-cards {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 24px;
        margin-bottom: 44px;
      }

      .portal-card {
        background: var(--panel);
        border: 2px solid var(--bd);
        border-radius: var(--radius-xl);
        padding: 32px 26px;
        cursor: pointer;
        transition: all 0.28s cubic-bezier(0.4, 0, 0.2, 1);
        display: flex;
        flex-direction: column;
        text-align: center;
        box-shadow: var(--shadow-md);
        position: relative;
        overflow: hidden;
      }

      .portal-card::before {
        content: '';
        position: absolute; inset: 0;
        border-radius: inherit;
        background: linear-gradient(135deg, rgba(255,255,255,0.05), transparent);
        pointer-events: none;
      }

      .portal-card:hover {
        transform: translateY(-8px);
        border-color: var(--acc);
        box-shadow: 0 20px 44px rgba(99,102,241,0.16);
      }

      .portal-icon {
        font-size: 48px;
        margin-bottom: 16px;
        display: flex; align-items: center; justify-content: center;
        height: 64px;
      }

      .portal-card h3 {
        font-family: var(--fh);
        font-size: 20px;
        font-weight: 800;
        margin: 0 0 8px 0;
        letter-spacing: -0.3px;
      }

      .portal-card > p {
        color: var(--tx-2);
        font-size: 13px;
        margin: 0 0 20px 0;
        line-height: 1.6;
      }

      .portal-features {
        list-style: none;
        padding: 0; margin: 0 0 24px 0;
        display: flex; flex-direction: column; gap: 7px;
        align-items: flex-start;
        flex: 1;
      }

      .portal-features li {
        font-size: 12px; color: var(--tx-2); font-weight: 600;
        display: flex; align-items: center; gap: 6px;
      }

      .btn-portal {
        background: linear-gradient(135deg, var(--acc), var(--acc-2));
        color: #fff;
        border: none;
        border-radius: var(--radius-md);
        padding: 11px 24px;
        font-size: 13px; font-weight: 800; font-family: var(--f);
        cursor: pointer;
        transition: all 0.22s;
        box-shadow: 0 6px 16px rgba(99,102,241,0.22);
        letter-spacing: 0.02em;
        outline: none;
      }
      .btn-portal:hover { transform: translateY(-2px); box-shadow: 0 12px 26px rgba(99,102,241,0.32); }

      .login-landing-footer { color: var(--tx-3); font-size: 12px; margin-top: 32px; }

      /* ══════════════════════════════════════════════
         LOGIN – ADMIN PAGE
      ══════════════════════════════════════════════ */
      .admin-login-shell {
        display: grid;
        grid-template-columns: 1.3fr 1fr;
        min-height: 100vh;
      }

      .admin-login-brand {
        background:
          radial-gradient(700px 500px at -10% 50%, rgba(255,255,255,0.08), transparent 60%),
          linear-gradient(145deg, #0d1829 0%, #1a2f5e 40%, #4338ca 80%, #6366f1 100%);
        color: #fff;
        padding: 52px 44px;
        display: flex; flex-direction: column; justify-content: center;
        position: relative; overflow: hidden;
      }

      .brand-accent {
        position: absolute;
        top: -180px; right: -80px;
        width: 420px; height: 420px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(255,255,255,0.1), transparent 70%);
        pointer-events: none;
      }

      .brand-accent-2 {
        position: absolute;
        bottom: -120px; left: -60px;
        width: 300px; height: 300px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(255,255,255,0.06), transparent 70%);
        pointer-events: none;
      }

      .admin-login-brand h1 {
        font-family: var(--fh);
        font-size: 42px; font-weight: 800;
        margin: 0 0 14px 0;
        position: relative; z-index: 1;
        letter-spacing: -0.8px;
        line-height: 1.1;
      }

      .admin-login-brand > p {
        font-size: 16px; margin: 0 0 34px 0;
        opacity: 0.9; line-height: 1.65;
        position: relative; z-index: 1;
      }

      .admin-features {
        display: flex; flex-direction: column;
        gap: 20px; position: relative; z-index: 1;
      }

      .feature-item { display: flex; gap: 14px; align-items: flex-start; }
      .feature-icon { font-size: 26px; min-width: 36px; text-align: center; }

      .feature-item strong {
        font-size: 14px; font-weight: 700;
        display: block; margin-bottom: 3px;
      }

      .feature-item p { font-size: 12px; opacity: 0.85; margin: 0; line-height: 1.5; }

      .admin-login-form {
        padding: 52px 44px;
        display: flex; flex-direction: column; justify-content: center;
        background: var(--panel);
      }

      .back-btn {
        background: none; border: none;
        color: var(--acc); cursor: pointer;
        font-size: 12px; font-weight: 700; font-family: var(--f);
        padding: 0 0 22px 0;
        text-align: left;
        display: inline-flex; align-items: center; gap: 5px;
        transition: color 0.18s;
        outline: none;
      }
      .back-btn:hover { color: var(--acc-2); }

      .admin-login-form h2 {
        font-family: var(--fh);
        font-size: 28px; font-weight: 800;
        margin: 0 0 8px 0; color: var(--tx-1);
        letter-spacing: -0.4px;
      }

      .admin-login-form > p { color: var(--tx-2); font-size: 13.5px; margin: 0 0 28px 0; }

      .form-group   { margin-bottom: 20px; }

      .form-group label {
        display: block; font-size: 12px; font-weight: 700;
        margin-bottom: 7px; color: var(--tx-1);
        text-transform: uppercase; letter-spacing: 0.5px;
      }

      .form-label {
        display: block; margin-bottom: 8px;
        color: var(--tx-2); font-size: 11.5px; font-weight: 700;
        text-transform: uppercase; letter-spacing: 0.5px;
      }

      .form-options {
        display: flex; justify-content: space-between; align-items: center;
        margin-bottom: 18px; gap: 12px;
      }

      .checkbox-label {
        display: flex; align-items: center; gap: 7px;
        cursor: pointer; font-size: 12px; font-weight: 600; color: var(--tx-2);
      }
      .checkbox-label input { width: 16px; height: 16px; cursor: pointer; accent-color: var(--acc); }

      .forgot-pwd {
        font-size: 12px; color: var(--acc);
        text-decoration: none; font-weight: 700; transition: color 0.18s;
      }
      .forgot-pwd:hover { color: var(--acc-2); text-decoration: underline; }

      .login-footer-text {
        font-size: 12px; color: var(--tx-2);
        margin-top: 18px; text-align: center;
      }
      .login-footer-text a {
        color: var(--acc); text-decoration: none; font-weight: 700;
      }
      .login-footer-text a:hover { text-decoration: underline; }

      /* ══════════════════════════════════════════════
         LOGIN – USER PAGE
      ══════════════════════════════════════════════ */
      .user-login-shell {
        display: flex; align-items: center; justify-content: center;
        min-height: 100vh; padding: 24px;
      }

      .user-login-container { width: 100%; max-width: 520px; }

      .user-login-header {
        text-align: center; margin-bottom: 40px;
        display: flex; flex-direction: column; align-items: center; gap: 14px;
      }

      .user-login-header h1 {
        font-family: var(--fh); font-size: 26px; font-weight: 800; margin: 0;
        letter-spacing: -0.4px;
      }

      .user-login-header p {
        color: var(--acc); font-size: 11px; font-weight: 800; margin: 0;
        letter-spacing: 1.2px; text-transform: uppercase;
      }

      .user-login-form {
        background: var(--panel);
        border: 1.5px solid var(--bd);
        border-radius: var(--radius-xl);
        padding: 34px;
        margin-bottom: 22px;
        box-shadow: var(--shadow-lg);
      }

      .user-login-form h2 {
        font-family: var(--fh); font-size: 22px; font-weight: 800;
        margin: 0 0 5px 0; letter-spacing: -0.3px;
      }

      .form-subtitle { color: var(--tx-2); font-size: 13.5px; margin: 0 0 24px 0; }

      .divider {
        display: flex; align-items: center;
        gap: 12px; margin: 20px 0;
        font-size: 12px; color: var(--tx-3); font-weight: 600;
      }
      .divider::before, .divider::after { content: ''; flex: 1; height: 1px; background: var(--bd); }

      .user-login-benefits {
        background: linear-gradient(135deg, rgba(16,185,129,0.08), rgba(52,211,153,0.05));
        border: 1.5px solid rgba(16,185,129,0.2);
        border-radius: var(--radius-lg);
        padding: 20px;
        box-shadow: var(--shadow-sm);
      }

      .user-login-benefits h3 {
        font-size: 12px; font-weight: 800; margin: 0 0 12px 0;
        text-transform: uppercase; letter-spacing: 0.6px; color: var(--good);
      }

      .user-login-benefits ul {
        list-style: none; padding: 0; margin: 0;
        display: flex; flex-direction: column; gap: 8px;
      }

      .user-login-benefits li {
        font-size: 12px; color: var(--tx-2); font-weight: 600;
        display: flex; align-items: center; gap: 7px;
      }

      /* ══════════════════════════════════════════════
         OLD LOGIN SHELL (legacy)
      ══════════════════════════════════════════════ */
      .login-shell {
        width: min(960px, 100%);
        display: grid;
        grid-template-columns: 1.2fr 1fr;
        border: 1.5px solid var(--bd);
        border-radius: var(--radius-xl);
        overflow: hidden;
        background: var(--panel);
        box-shadow: var(--shadow-xl);
      }

      .login-brand {
        padding: 36px; color: #fff;
        background:
          radial-gradient(500px 300px at 10% -20%, rgba(255,255,255,0.18), transparent 70%),
          linear-gradient(145deg, #0d1829, #1a3460 50%, #6366f1);
      }

      .login-brand h1 { margin: 0 0 12px; font-family: var(--fh); font-size: 32px; line-height: 1.1; letter-spacing: -0.5px; font-weight: 800; }
      .login-brand p  { margin: 0; font-size: 14px; opacity: 0.9; max-width: 36ch; line-height: 1.6; }
      .login-points   { margin-top: 22px; display: grid; gap: 12px; }
      .login-point    { font-size: 13px; font-weight: 700; display: flex; align-items: center; gap: 8px; }
      .login-form     { padding: 32px; }
      .login-title    { margin: 0 0 6px; font-family: var(--fh); font-size: 26px; font-weight: 800; }
      .login-sub      { margin: 0 0 18px; color: var(--tx-2); font-size: 13px; font-weight: 600; }

      /* ══════════════════════════════════════════════
         MISC
      ══════════════════════════════════════════════ */
      .ep {
        display: grid; place-items: center;
        border: 1.5px dashed var(--bd);
        border-radius: var(--radius-md);
        background: var(--panel-2);
        min-height: 130px;
      }

      .pi {
        width: 100%; border: 1.5px solid var(--bd);
        background: var(--panel);
        border-radius: 12px; padding: 12px;
        display: flex; align-items: center; gap: 10px;
        text-align: left; cursor: pointer;
        transition: all 0.18s;
      }
      .pi:hover { border-color: var(--acc); box-shadow: 0 4px 12px rgba(14,116,144,0.14); }
      .pi.on {
        border-color: rgba(14,116,144,0.55);
        background: rgba(14,116,144,0.08);
      }
      .pi-n { font-size: 12px; font-weight: 800; color: var(--tx-1); }
      .pi-m { font-size: 11px; color: var(--tx-2); font-weight: 600; }

      .dr { display: flex; justify-content: space-between; gap: 12px; padding: 8px 0; border-bottom: 1px solid var(--bd); }
      .dr:last-child { border-bottom: 0; }
      .dk { font-size: 11px; font-weight: 700; color: var(--tx-2); }
      .dv { font-size: 11px; font-weight: 700; color: var(--tx-1); text-align: right; }

      @keyframes pulseDot {
        0%   { opacity: 0.55; transform: scale(1); }
        50%  { opacity: 1;    transform: scale(1.25); }
        100% { opacity: 0.55; transform: scale(1); }
      }

      /* ══════════════════════════════════════════════
         PROGRESS BARS
      ══════════════════════════════════════════════ */
      .progress-bar-wrap {
        height: 6px;
        border-radius: 99px;
        background: var(--panel-3);
        overflow: hidden;
      }

      .progress-bar-fill {
        height: 100%;
        border-radius: 99px;
        transition: width 0.6s cubic-bezier(0.4,0,0.2,1);
      }

      /* ══════════════════════════════════════════════
         STATUS BADGES
      ══════════════════════════════════════════════ */
      .status-badge {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        padding: 3px 10px;
        border-radius: 6px;
        font-size: 10.5px;
        font-weight: 700;
        letter-spacing: 0.04em;
        text-transform: uppercase;
      }

      .status-badge.active {
        background: rgba(16,185,129,0.12);
        border: 1px solid rgba(16,185,129,0.25);
        color: #059669;
      }

      .status-badge.ongoing {
        background: rgba(245,158,11,0.12);
        border: 1px solid rgba(245,158,11,0.25);
        color: #d97706;
      }

      .status-badge.delayed {
        background: rgba(239,68,68,0.1);
        border: 1px solid rgba(239,68,68,0.25);
        color: #dc2626;
      }

      .status-badge.completed {
        background: rgba(14,116,144,0.1);
        border: 1px solid rgba(14,116,144,0.25);
        color: #0e7490;
      }

      /* ══════════════════════════════════════════════
         DASHBOARD STAT CARDS
      ══════════════════════════════════════════════ */
      .dash-section-head {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        gap: 12px;
        margin-bottom: 16px;
        flex-wrap: wrap;
      }

      .dash-section-kicker {
        font-size: 10px;
        font-weight: 900;
        text-transform: uppercase;
        letter-spacing: 0.14em;
        color: var(--acc);
        margin-bottom: 4px;
      }

      .dash-section-title {
        font-family: var(--fh);
        font-size: 20px;
        font-weight: 800;
        letter-spacing: -0.02em;
        color: var(--tx-1);
        margin: 0;
      }

      .dash-section-sub {
        margin: 4px 0 0;
        font-size: 12.5px;
        color: var(--tx-2);
        font-weight: 500;
      }

      .dash-stat-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 16px;
        margin-bottom: 20px;
      }

      .dash-stat-card {
        position: relative;
        overflow: hidden;
        border-radius: 16px;
        border: 1px solid color-mix(in oklab, var(--tone,#6366f1) 20%, var(--bd));
        background: var(--panel);
        padding: 18px;
        cursor: pointer;
        min-height: 120px;
        text-align: left;
        box-shadow: var(--shadow-sm);
        transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
        animation: dashCardIn 0.5s cubic-bezier(.2,.8,.2,1) both;
      }

      .dash-stat-card::before {
        content: '';
        position: absolute;
        top: 0; left: 0; right: 0; height: 3px;
        background: linear-gradient(90deg, var(--tone,#6366f1), color-mix(in oklab, var(--tone,#6366f1) 60%, transparent));
        border-radius: 16px 16px 0 0;
      }

      .dash-stat-card::after {
        content: '';
        position: absolute;
        top: -20px; right: -10px;
        width: 80px; height: 80px;
        border-radius: 50%;
        background: color-mix(in oklab, var(--tone,#6366f1) 8%, transparent);
      }

      .dash-stat-card:hover {
        transform: translateY(-5px);
        border-color: color-mix(in oklab, var(--tone,#6366f1) 40%, var(--bd));
        box-shadow: 0 14px 32px color-mix(in oklab, var(--tone,#6366f1) 10%, rgba(15,23,42,0.12));
      }

      .dash-stat-head {
        position: relative;
        z-index: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        margin-bottom: 14px;
      }

      .dash-stat-icon {
        width: 42px; height: 42px;
        border-radius: 12px;
        display: inline-flex; align-items: center; justify-content: center;
        font-size: 20px;
        background: color-mix(in oklab, var(--tone,#6366f1) 12%, var(--panel-2));
        border: 1px solid color-mix(in oklab, var(--tone,#6366f1) 25%, transparent);
      }

      .dash-stat-value {
        font-family: var(--fh);
        font-size: clamp(26px, 2vw, 34px);
        line-height: 1;
        font-weight: 800;
        letter-spacing: -0.04em;
        color: var(--tone,#6366f1);
      }

      .dash-stat-label {
        position: relative; z-index:1;
        font-size: 13px; font-weight: 700; color: var(--tx-1);
        margin-bottom: 5px;
      }

      .dash-stat-cta {
        position: relative; z-index:1;
        display: inline-flex; align-items: center; gap: 5px;
        color: var(--tx-3); font-size: 10px; font-weight: 700;
        letter-spacing: 0.08em; text-transform: uppercase;
        transition: color 0.2s, transform 0.2s;
      }

      .dash-stat-card:hover .dash-stat-cta {
        color: var(--tone,#6366f1);
        transform: translateX(2px);
      }

      @keyframes dashCardIn {
        from { opacity: 0; transform: translateY(12px) scale(0.98); }
        to { opacity: 1; transform: translateY(0) scale(1); }
      }

      /* ══════════════════════════════════════════════
         SCROLLBARS
      ══════════════════════════════════════════════ */
      ::-webkit-scrollbar       { width: 6px; height: 6px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb { background: var(--bd-2); border-radius: 999px; }
      ::-webkit-scrollbar-thumb:hover { background: var(--tx-3); }
      scrollbar-width: thin;
      scrollbar-color: var(--bd-2) transparent;

      /* ══════════════════════════════════════════════
         RESPONSIVE
      ══════════════════════════════════════════════ */
      @media (max-width: 1100px) {
        .cr2 { grid-template-columns: 1fr; }
        .admin-login-shell { grid-template-columns: 1fr; }
        .dash-stat-grid { grid-template-columns: repeat(2, 1fr); }
        .resource-grid { grid-template-columns: repeat(2, 1fr); }
      }

      @media (max-width: 900px) {
        :root { --sidebar-w: 200px; }
        .tbar { padding: 0 16px; }
        .cnt  { padding: 16px; }
        .login-portal-cards { grid-template-columns: 1fr; gap: 16px; }
        .admin-login-shell { grid-template-columns: 1fr; }
        .admin-login-brand { padding: 36px 28px; }
        .admin-login-form  { padding: 36px 28px; }
      }

      @media (max-width: 768px) {
        :root { --sidebar-w: 0px; }
        .sidebar { width: 0; overflow: hidden; }
        .main-area { margin-left: 0; }
        .login-shell { grid-template-columns: 1fr; }
        .login-brand { padding: 28px; }
        .login-form  { padding: 28px; }
        .login-landing-header { flex-direction: column; text-align: center; margin-bottom: 32px; }
        .landing-title { font-size: 26px; -webkit-text-fill-color: var(--tx-1); }
        .login-landing-content h2 { font-size: 22px; }
        .portal-card { padding: 24px 18px; }
        .admin-login-brand h1 { font-size: 32px; }
        .user-login-form { padding: 24px; }
        .user-login-header { margin-bottom: 24px; }
        .dash-stat-grid { grid-template-columns: 1fr; }
        .resource-grid { grid-template-columns: 1fr; }
      }
    `;
  }, []);

  return null;
}
