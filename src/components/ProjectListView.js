import React, { useState, useMemo } from 'react';
import { fmtDMY } from '../utils/data';

const progColor = (pv) => pv>=75?'#22c55e':pv>=40?'#f59e0b':'#ef4444';
const progBg    = (pv) => pv>=75?'rgba(34,197,94,0.12)':pv>=40?'rgba(245,158,11,0.12)':'rgba(239,68,68,0.12)';
const progLabel = (pv) => pv>=75?'ON TRACK':pv>=40?'MODERATE':'AT RISK';

const iconBtn = {
  width: 14,
  height: 14,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  viewBox: '0 0 24 24',
};

const getMonthlyValue = (proj, month, key) => {
  const monthKey = String(month).toLowerCase();
  const fromMonthlyProgress = proj?.monthlyProgress?.[monthKey]?.[key];
  if (fromMonthlyProgress !== undefined && fromMonthlyProgress !== null && fromMonthlyProgress !== '') {
    return fromMonthlyProgress;
  }

  const measures = proj?.measures || {};
  const measureKey = key === 'pp' ? 'PAC' : key === 'pt' ? 'PTC' : key === 'fp' ? 'FAC' : 'FTC';
  return measures?.[measureKey]?.[monthKey] ?? '';
};

const getProgressPct = (proj, numKey, denKey, fallbackPct) => {
  const months = ['january','february','march','april','may','june','july','august','september','october','november','december'];
  const values = [];
  for (const month of months) {
    // Strip '%' before converting to number
    const numRaw = getMonthlyValue(proj, month, numKey);
    const denRaw = getMonthlyValue(proj, month, denKey);
    if (numRaw === '' || denRaw === '' || numRaw === undefined || denRaw === undefined) continue;
    const numStr = String(numRaw).replace('%', '');
    const denStr = String(denRaw).replace('%', '');
    const num = Number(numStr);
    const den = Number(denStr);
    if (!Number.isFinite(num) || !Number.isFinite(den) || den <= 0) continue;
    values.push((num / den) * 100);
  }

  if (!values.length) {
    const fallback = Number.parseFloat(fallbackPct);
    return Number.isFinite(fallback) ? fallback : 0;
  }

  const average = values.reduce((sum, value) => sum + value, 0) / values.length;
  return Math.max(0, Math.min(100, Math.round(average * 10) / 10));
};

const getPhysicalPct = (proj) => getProgressPct(proj, 'pp', 'pt', proj?.physicalProgress);

const ProjectListView = ({ projects, filter, onOpenModal, onBack, isVO }) => {
  const [aid, setAid] = useState(null);
  const [pf,  setPf]  = useState('ALL');

  const displayedProjects = useMemo(()=>{
    let list = projects;
    if(filter.budgetLine!=='ALL') list=list.filter(p=>p.budgetLine===filter.budgetLine);
    if(filter.type==='COMPLETED') {
      list=list.filter(p=>getPhysicalPct(p)>=100);
    }
    if(filter.type==='ONGOING')   list=list.filter(p=>getPhysicalPct(p)<100);
    if(filter.type==='DELAYED')   list=list.filter(p=>p.reasonsForDelays&&p.reasonsForDelays.trim()!=='');
    if(pf!=='ALL') list=list.filter(p=>p.projectName===pf);
    return list;
  },[projects,filter,pf]);

  const ap = displayedProjects.find(p=>p.id===aid);

  const title = filter.type==='ALL'?'Total Projects':
                filter.type==='ONGOING'?'Ongoing Projects':
                filter.type==='DELAYED'?'Delayed Projects':'Completed Projects';

  return (
    <div style={{animation:'slideUp 0.22s ease'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20}}>
        <button
          onClick={onBack}
          style={{
            padding:'9px 16px',
            background:'var(--panel)',
            border:'1px solid var(--bd)',
            borderRadius:11,fontSize:13,fontWeight:600,
            color:'var(--tx-2)',cursor:'pointer',
            display:'flex',alignItems:'center',gap:8,
            transition:'background .15s',
          }}
          onMouseOver={e=>e.currentTarget.style.background='var(--panel-2)'}
          onMouseOut={e=>e.currentTarget.style.background='var(--panel)'}
        >
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Back to Dashboard
        </button>
        <div style={{fontSize:18,fontWeight:800,color:'var(--tx-1)',letterSpacing:'-0.4px'}}>
          {title}
          {filter.budgetLine!=='ALL'&&<span style={{fontSize:14,color:'var(--tx-3)',fontWeight:500,marginLeft:8}}>({filter.budgetLine})</span>}
        </div>
      </div>

      <div className="fb" style={{marginBottom:20}}>
        <div className="fg">
          <span className="fl">Search project</span>
          <select className="fs" value={pf} onChange={e=>{setPf(e.target.value);setAid(null);}} style={{minWidth:300}}>
            <option value="ALL">All projects in this list</option>
            {displayedProjects.map(p=><option key={p.id} value={p.projectName}>{p.projectName}</option>)}
          </select>
        </div>
        <div className="ft" style={{display:'inline-flex',alignItems:'center',gap:8,padding:'6px 10px',borderRadius:99,border:'1px solid var(--bd)',background:'var(--panel)'}}>
          <svg {...iconBtn}><path d="M21 21l-4.3-4.3"/><circle cx="10" cy="10" r="7"/></svg>
          {displayedProjects.length} project{displayedProjects.length!==1?'s':''} found
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:ap?'1fr 1fr':'1fr',gap:18,alignItems:'start'}}>

        <div className="card cp">
          <div className="ct2">Projects List</div>
          <div className="cs" style={{marginBottom:14}}>Select a project to view details. Use Manage to open project workspace.</div>
          {displayedProjects.length===0&&(
            <div className="ep">
              <svg width="34" height="34" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" style={{color:'var(--tx-3)',marginBottom:10}}><path d="M3 6h5l2 2h11v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6z"/></svg>
              <div style={{fontWeight:600,color:'var(--tx-2)'}}>No projects match this filter</div>
            </div>
          )}
          <div style={{maxHeight:'calc(100vh - 300px)',overflowY:'auto',paddingRight:4}}>
            {displayedProjects.map(proj=>{
              const pv=parseFloat(proj.physicalProgress)||0;
              const bc=progColor(pv);
              const msTotal=proj.milestones?.length||0;
              const msDone=proj.milestones?.filter(m=>m.done).length||0;
              const highRisk=proj.risks?.filter(r=>r.severity==='H').length||0;
              const isAct=aid===proj.id;
              return(
                <div key={proj.id} style={{display:'flex',alignItems:'stretch',gap:8,marginBottom:10,borderRadius:14,background:isAct?'rgba(14,116,144,0.07)':'var(--panel-2)',border:`1px solid ${isAct?'rgba(14,116,144,0.35)':'var(--bd)'}`,overflow:'hidden',transition:'all .2s'}}>
                  {/* Left accent bar */}
                  <div style={{width:4,background:bc,flexShrink:0,borderRadius:'0 0 0 0'}} />
                  <button
                    className={`pi ${isAct?'on':''}`}
                    style={{flex:1,marginBottom:0,border:'none',background:'transparent',borderRadius:0,textAlign:'left',padding:'10px 4px 10px 8px'}}
                    onClick={()=>setAid(isAct?null:proj.id)}
                  >
                    <div style={{flex:1,minWidth:0}}>
                      <div className="pi-n" style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',maxWidth:ap?'200px':'100%',fontSize:13,fontWeight:700}}>{proj.projectName}</div>
                      <div className="pi-m" style={{marginTop:2}}>{proj.department} {proj.budgetLine && <span style={{opacity:0.6}}>· {proj.budgetLine}</span>}</div>
                      <div style={{display:'flex',gap:6,marginTop:5,flexWrap:'wrap',alignItems:'center'}}>
                        {msTotal>0&&<span style={{fontSize:9.5,color:'#16a34a',fontWeight:700,background:'rgba(22,163,74,0.1)',padding:'1px 6px',borderRadius:99}}>✓ {msDone}/{msTotal} milestones</span>}
                        {highRisk>0&&<span style={{fontSize:9.5,color:'#dc2626',fontWeight:700,background:'rgba(220,38,38,0.1)',padding:'1px 6px',borderRadius:99}}>⚠ {highRisk} high risk</span>}
                        {proj.documents?.length>0&&<span style={{fontSize:9.5,color:'var(--acc-2)',fontWeight:700}}>📎 {proj.documents.length} docs</span>}
                        {proj.media?.length>0&&<span style={{fontSize:9.5,color:'#0f766e',fontWeight:700}}>🖼 {proj.media.length} media</span>}
                      </div>
                      {/* Progress bar */}
                      <div style={{display:'flex',alignItems:'center',gap:8,marginTop:8}}>
                        <div style={{flex:1,height:5,background:'var(--panel-2)',borderRadius:99,overflow:'hidden',border:'1px solid var(--bd)'}}>
                          <div style={{height:'100%',width:`${pv}%`,background:`linear-gradient(90deg, ${bc}, ${bc}cc)`,borderRadius:99,boxShadow:`0 0 6px ${bc}55`,transition:'width .6s ease'}}/>
                        </div>
                        <span style={{fontSize:10,fontWeight:800,color:bc,fontFamily:'var(--m)',flexShrink:0,minWidth:32}}>{pv}%</span>
                        {/* Status badge */}
                        {proj.reasonsForDelays?(
                          <span style={{display:'inline-flex',alignItems:'center',gap:3,padding:'2px 8px',borderRadius:99,fontSize:9,fontWeight:800,background:'rgba(239,68,68,0.15)',color:'#f87171',border:'1px solid rgba(239,68,68,0.3)',letterSpacing:'0.5px',flexShrink:0}}>
                            <span style={{width:5,height:5,borderRadius:'50%',background:'#ef4444',display:'inline-block',animation:'pulseDot 1.4s ease-in-out infinite'}}/>
                            DELAYED
                          </span>
                        ):(
                          <span style={{padding:'2px 8px',borderRadius:99,fontSize:9,fontWeight:800,background:progBg(pv),color:bc,flexShrink:0,letterSpacing:'0.5px'}}>{progLabel(pv)}</span>
                        )}
                      </div>
                    </div>
                  </button>
                  {/* MANAGE button - prominent, always visible */}
                  <button
                    title="Open Project Management Workspace"
                    onClick={()=>onOpenModal(proj)}
                    style={{
                      flexShrink:0,
                      display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:5,
                      padding:'12px 14px',
                      background:'linear-gradient(160deg, rgba(14,116,144,0.18) 0%, rgba(15,118,110,0.22) 100%)',
                      borderLeft:'1px solid rgba(14,116,144,0.3)',
                      border:'none',
                      cursor:'pointer',color:'#0e7490',
                      fontSize:10,fontWeight:800,
                      transition:'all .2s',
                      letterSpacing:'.06em',textTransform:'uppercase',
                      minWidth:64,
                    }}
                    onMouseOver={e=>{ e.currentTarget.style.background='linear-gradient(160deg, rgba(14,116,144,0.32) 0%, rgba(15,118,110,0.38) 100%)'; e.currentTarget.style.color='#22d3ee'; }}
                    onMouseOut={e=>{ e.currentTarget.style.background='linear-gradient(160deg, rgba(14,116,144,0.18) 0%, rgba(15,118,110,0.22) 100%)'; e.currentTarget.style.color='#0e7490'; }}
                  >
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="3"/>
                      <path d="M19.07 4.93A10 10 0 0 1 21 12a10 10 0 0 1-2.07 6.16M4.93 4.93A10 10 0 0 0 3 12a10 10 0 0 0 2.07 6.16"/>
                      <path d="M15.54 8.46a5 5 0 0 1 0 7.07M8.46 8.46a5 5 0 0 0 0 7.07"/>
                    </svg>
                    Manage
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {ap&&(
          <div>
            <div style={{
              background:'var(--panel)',border:'1px solid var(--bd)',
              borderRadius:16,overflow:'hidden',position:'sticky',top:118,
              boxShadow:'0 12px 26px rgba(3, 27, 47, 0.12)',
            }}>
              <div style={{
                padding:'18px 20px',
                background:'linear-gradient(135deg, rgba(14,116,144,0.22) 0%, rgba(15,118,110,0.08) 100%)',
                borderBottom:'1px solid var(--bd)',
              }}>
                <div style={{
                  display:'inline-flex',alignItems:'center',gap:5,padding:'3px 9px',borderRadius:99,
                  background:'rgba(14,116,144,0.15)',border:'1px solid rgba(14,116,144,0.3)',marginBottom:8,
                }}>
                  <span style={{fontSize:9.5,color:'#0e7490',fontWeight:700}}>PROJECT DETAILS</span>
                </div>
                <div style={{fontSize:13.5,fontWeight:700,color:'var(--tx-1)',lineHeight:1.4,marginBottom:5}}>{ap.projectName}</div>
                <div style={{fontSize:10.5,color:'var(--tx-2)'}}>{ap.department} · {ap.budgetLine}</div>
              </div>

              <div style={{padding:'14px 18px'}}>
                {[
                  ['Start Date',fmtDMY(ap.startDate)],['End Date',fmtDMY(ap.endDate)],
                  ['NPD',ap.npd],['TEC (LKR Mn)',ap.tec],['Awarded Sum',ap.awardedSum],
                  ['Revised Cost',ap.revisedCost],['Alloc 2026',ap.allocation2026],
                  ['Physical %',ap.physicalProgress+'%'],['Financial %',ap.financialProgress+'%'],
                  ['KPI',ap.kpi],['Resp. Officer',ap.responsibleOfficer]
                ].map(([k,v])=>(
                  <div key={k} className="dr">
                    <span className="dk">{k}</span>
                    <span className="dv">{v||'—'}</span>
                  </div>
                ))}
              </div>

              {ap.reasonsForDelays&&(
                <div style={{margin:'0 14px 10px',padding:12,background:'rgba(239,68,68,0.1)',borderRadius:11,borderLeft:'3px solid #ef4444'}}>
                  <div style={{fontSize:10.5,fontWeight:800,color:'#dc2626',textTransform:'uppercase',letterSpacing:'.6px',marginBottom:5}}>⚠ Reason for Delay</div>
                  <div style={{fontSize:12,color:'#b91c1c',lineHeight:1.55}}>{ap.reasonsForDelays}</div>
                </div>
              )}

              {ap.remarks&&(
                <div style={{margin:'0 14px 10px',padding:12,background:'var(--panel-2)',borderRadius:11,border:'1px solid var(--bd)'}}>
                  <div style={{fontSize:10.5,fontWeight:700,color:'var(--tx-3)',textTransform:'uppercase',letterSpacing:'.5px',marginBottom:5}}>Status / Remarks</div>
                  <div style={{fontSize:12,color:'var(--tx-2)',lineHeight:1.55}}>{ap.remarks}</div>
                </div>
              )}

              <div style={{margin:'0 14px 10px',padding:12,background:'rgba(15,118,110,0.05)',borderRadius:11,border:'1px solid rgba(15,118,110,0.18)'}}>
                <div style={{fontSize:10.5,fontWeight:700,color:'#0f766e',textTransform:'uppercase',letterSpacing:'.5px',marginBottom:6}}>Progress Workspace</div>
                <div style={{fontSize:11.5,color:'var(--tx-2)',lineHeight:1.55}}>
                  Milestones: {ap.milestones?.filter(m=>m.done).length || 0}/{ap.milestones?.length || 0} completed
                </div>
                <div style={{fontSize:11.5,color:'var(--tx-2)',lineHeight:1.55}}>
                  Media uploads: {ap.media?.length || 0}
                </div>
              </div>

              <div style={{margin:'0 14px 14px'}}>
                <button className="bp" style={{width:'100%',justifyContent:'center',fontSize:12}} onClick={()=>onOpenModal(ap)}>
                  Open Project Management
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectListView;