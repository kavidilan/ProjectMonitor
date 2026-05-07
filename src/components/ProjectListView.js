import React, { useState, useMemo } from 'react';
import { fmtDMY } from '../utils/data';

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
    const num = Number(getMonthlyValue(proj, month, numKey));
    const den = Number(getMonthlyValue(proj, month, denKey));
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

const progColor = (pv) => pv>=75?'#22c55e':pv>=40?'#f59e0b':'#ef4444';
const progBg    = (pv) => pv>=75?'rgba(34,197,94,0.12)':pv>=40?'rgba(245,158,11,0.12)':'rgba(239,68,68,0.12)';
const progLabel = (pv) => pv>=75?'ON TRACK':pv>=40?'MODERATE':'AT RISK';

const ProjectListView = ({ projects, filter, onOpenModal, onBack, isVO }) => {
  const [aid, setAid] = useState(null);
  const [pf,  setPf]  = useState('ALL');

  const displayedProjects = useMemo(()=>{
    let list = projects;
    if(filter.budgetLine!=='ALL') list=list.filter(p=>p.budgetLine===filter.budgetLine);
    if(filter.type==='COMPLETED') list=list.filter(p=>parseFloat(p.physicalProgress)>=100);
    if(filter.type==='ONGOING')   list=list.filter(p=>parseFloat(p.physicalProgress)<100);
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
        <div className="ft">{displayedProjects.length} project{displayedProjects.length!==1?'s':''} found</div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:ap?'1fr 1fr':'1fr',gap:18,alignItems:'start'}}>

        <div className="card cp">
          <div className="ct2">Projects List</div>
          <div className="cs" style={{marginBottom:14}}>Click to view details · 📋 for project management</div>
          {displayedProjects.length===0&&(
            <div className="ep">
              <div style={{fontSize:32,marginBottom:10}}>📂</div>
              <div style={{fontWeight:600,color:'var(--tx-2)'}}>No projects match this filter</div>
            </div>
          )}
          <div style={{maxHeight:'calc(100vh - 300px)',overflowY:'auto',paddingRight:4}}>
            {displayedProjects.map(proj=>{
              const pv=getPhysicalPct(proj);
              const bc=progColor(pv);
              const msTotal=proj.milestones?.length||0;
              const msDone=proj.milestones?.filter(m=>m.done).length||0;
              const highRisk=proj.risks?.filter(r=>r.severity==='H').length||0;
              const isAct=aid===proj.id;
              return(
                <div key={proj.id} style={{display:'flex',alignItems:'center',gap:6,marginBottom:8}}>
                  <button
                    className={`pi ${isAct?'on':''}`}
                    style={{flex:1,marginBottom:0}}
                    onClick={()=>setAid(isAct?null:proj.id)}
                  >
                    <div style={{flex:1,minWidth:0}}>
                      <div className="pi-n" style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',maxWidth:ap?'200px':'100%'}}>{proj.projectName}</div>
                      <div className="pi-m">{proj.department}</div>
                      <div style={{display:'flex',gap:6,marginTop:5,flexWrap:'wrap',alignItems:'center'}}>
                        {msTotal>0&&<span style={{fontSize:9.5,color:'#16a34a',fontWeight:700}}>✓ {msDone}/{msTotal} milestones</span>}
                        {highRisk>0&&<span style={{fontSize:9.5,color:'#dc2626',fontWeight:700}}>⚠ {highRisk} high risk</span>}
                        {proj.documents?.length>0&&<span style={{fontSize:9.5,color:'var(--acc-2)',fontWeight:700}}>📎 {proj.documents.length} doc{proj.documents.length!==1?'s':''}</span>}
                      </div>
                      {/* Progress bar */}
                      <div style={{display:'flex',alignItems:'center',gap:8,marginTop:7}}>
                        <div style={{flex:1,height:4,background:'var(--panel-2)',borderRadius:99,overflow:'hidden'}}>
                          <div style={{height:'100%',width:`${pv}%`,background:bc,borderRadius:99,boxShadow:`0 0 5px ${bc}66`}}/>
                        </div>
                        <span style={{fontSize:9.5,fontWeight:800,color:bc,fontFamily:'var(--m)',flexShrink:0}}>{pv}%</span>
                        {/* Status badge */}
                        {proj.reasonsForDelays?(
                          <span style={{display:'inline-flex',alignItems:'center',gap:3,padding:'2px 7px',borderRadius:99,fontSize:9,fontWeight:800,background:'rgba(239,68,68,0.15)',color:'#f87171',border:'1px solid rgba(239,68,68,0.3)',letterSpacing:'0.5px',flexShrink:0}}>
                            <span style={{width:5,height:5,borderRadius:'50%',background:'#ef4444',display:'inline-block',animation:'pulseDot 1.4s ease-in-out infinite'}}/>
                            DELAYED
                          </span>
                        ):(
                          <span style={{padding:'2px 7px',borderRadius:99,fontSize:9,fontWeight:800,background:progBg(pv),color:bc,flexShrink:0,letterSpacing:'0.5px'}}>{progLabel(pv)}</span>
                        )}
                      </div>
                    </div>
                  </button>
                  <button
                    title="Project Management"
                    onClick={()=>onOpenModal(proj)}
                    style={{
                      padding:'9px 11px',flexShrink:0,
                      background:'rgba(14,165,233,0.12)',border:'1px solid rgba(14,165,233,0.3)',
                      borderRadius:10,cursor:'pointer',color:'var(--acc-2)',fontSize:15,
                      transition:'background .15s',
                    }}
                    onMouseOver={e=>e.currentTarget.style.background='rgba(14,165,233,0.22)'}
                    onMouseOut={e=>e.currentTarget.style.background='rgba(14,165,233,0.12)'}
                  >📋</button>
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
                background:'linear-gradient(135deg, rgba(14,165,233,0.25) 0%, rgba(14,165,233,0.05) 100%)',
                borderBottom:'1px solid var(--bd)',
              }}>
                <div style={{
                  display:'inline-flex',alignItems:'center',gap:5,padding:'3px 9px',borderRadius:99,
                  background:'rgba(14,165,233,0.18)',border:'1px solid rgba(14,165,233,0.35)',marginBottom:8,
                }}>
                  <span style={{fontSize:9.5,color:'var(--acc-2)',fontWeight:700}}>📋 PROJECT DETAILS</span>
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

              <div style={{margin:'0 14px 14px'}}>
                <button className="bp" style={{width:'100%',justifyContent:'center',fontSize:12}} onClick={()=>onOpenModal(ap)}>
                  📋 Open Project Management
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