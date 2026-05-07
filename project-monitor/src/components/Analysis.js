import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import CustomTooltip from './CustomTooltip';
import { budgetLineConfig } from '../utils/data';

const monthsOrder = ['january','february','march','april','may','june','july','august','september','october','november','december'];

const getProgressFromMeasures = (proj,monthlyNumKey,monthlyDenKey,numKey,denKey,strategy='avg',fallbackPct) => {
  const measures=proj?.measures||{};const monthlyProgress=proj?.monthlyProgress||{};let values=[];
  for(const m of monthsOrder){
    const numRaw=monthlyProgress?.[m]?.[monthlyNumKey] ?? measures?.[numKey]?.[m];const denRaw=monthlyProgress?.[m]?.[monthlyDenKey] ?? measures?.[denKey]?.[m];
    if(numRaw===''||denRaw===''||numRaw===undefined||denRaw===undefined)continue;
    const num=Number(numRaw);const den=Number(denRaw);
    if(!Number.isFinite(num)||!Number.isFinite(den)||den===0)continue;
    const pct=(num/den)*100;if(!Number.isFinite(pct))continue;values.push(pct);
  }
  if(!values.length){const fb=parseFloat(fallbackPct);return Number.isFinite(fb)?fb:0;}
  let val;
  if(strategy==='last-non-empty'){val=values[values.length-1];}
  else{val=values.reduce((a,v)=>a+v,0)/values.length;}
  return Math.round(Math.max(0,Math.min(100,val))*10)/10;
};
const getPhysicalPct=(proj)=>getProgressFromMeasures(proj,'pp','pt','PAC','PTC','avg',proj?.physicalProgress);

const Analysis = ({projects}) => {
  const pp=useMemo(()=>{
    if(!projects.length)return 0;
    const vals=projects.map(getPhysicalPct).filter(v=>!isNaN(v));
    if(!vals.length)return 0;
    return Math.max(0,Math.min(100,vals.reduce((a,v)=>a+v,0)/vals.length));
  },[projects]);
  const yr=useMemo(()=>{
    const v=projects.filter(p=>p.measures?.PTM?.december&&!isNaN(parseFloat(p.measures.PTM.december)));
    return v.length?Math.min(100,v.reduce((a,p)=>a+parseFloat(p.measures.PTM.december),0)/v.length):0;
  },[projects]);
  const bp=useMemo(()=>Object.keys(budgetLineConfig).map(bl=>{
    const ps=projects.filter(p=>p.budgetLine===bl);
    const vals=ps.map(getPhysicalPct).filter(v=>!isNaN(v));
    return{name:bl,count:ps.length,progress:vals.length?Math.round(vals.reduce((a,v)=>a+v,0)/vals.length):0};
  }).filter(d=>d.count>0),[projects]);

  const progressColor = (pct) => pct>=75?'#22c55e':pct>=40?'#f59e0b':'#ef4444';

  return (
    <>
      {/* ── TOP PIE CHARTS ── */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:18,marginBottom:20}}>
        {[
          {title:'Overall Lifecycle Progress',sub:'Cumulative physical completion (PAC/PTC)',data:[{name:'Completed',value:pp},{name:'Remaining',value:100-pp}],colors:['#22c55e','var(--panel-2)'],pct:pp},
          {title:'Year 2026 Target Achievement',sub:'Current year performance (Dec PTM)',data:[{name:'2026 Progress',value:yr},{name:'Remaining',value:100-yr}],colors:['var(--acc-2)','var(--panel-2)'],pct:yr}
        ].map((c,i)=>(
          <div key={i} className="card cp">
            <div className="ct2">{c.title}</div>
            <div className="cs" style={{marginBottom:10}}>{c.sub}</div>
            <div style={{position:'relative'}}>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={c.data} cx="50%" cy="50%" innerRadius={62} outerRadius={90} paddingAngle={3} dataKey="value">
                    {c.data.map((_,j)=><Cell key={j} fill={c.colors[j]}/>)}
                  </Pie>
                  <Tooltip content={<CustomTooltip/>}/>
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{fontSize:11,color:'var(--tx-2)',fontWeight:700}}/>
                </PieChart>
              </ResponsiveContainer>
              <div className="dc"><div className="dc-p">{c.pct.toFixed(1)}%</div><div className="dc-s">average</div></div>
            </div>
          </div>
        ))}
      </div>

      {/* ── BAR CHART ── */}
      <div className="card cp">
        <div className="ct2">Physical Progress by Budget Line</div>
        <div className="cs" style={{marginBottom:18}}>Average physical completion % per budget category</div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={bp} margin={{top:10,right:20,left:0,bottom:90}}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.06)"/>
            <XAxis
              dataKey="name"
              tick={{fontSize:10,fontFamily:'var(--f)',fill:'var(--tx-2)'}}
              angle={-32} textAnchor="end" interval={0}
              axisLine={{stroke:'var(--bd)'}}
              tickLine={false}
            />
            <YAxis
              unit="%" tick={{fontSize:10.5,fontFamily:'var(--f)',fill:'var(--tx-2)'}}
              domain={[0,100]} axisLine={false} tickLine={false}
            />
            <Tooltip content={<CustomTooltip/>}/>
            <Bar dataKey="progress" radius={[6,6,0,0]} barSize={32} name="Avg Progress" unit="%">
              {bp.map((entry,i)=>(
                <Cell key={i} fill={progressColor(entry.progress)}/>
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Legend */}
        <div style={{display:'flex',gap:16,marginTop:12,flexWrap:'wrap'}}>
          {[['#22c55e','≥75% On track'],['#f59e0b','40–74% Moderate'],['#ef4444','<40% At risk']].map(([c,l])=>(
            <div key={l} style={{display:'flex',alignItems:'center',gap:6}}>
              <div style={{width:10,height:10,borderRadius:'50%',background:c,boxShadow:`0 0 5px ${c}88`}}/>
              <span style={{fontSize:11,color:'var(--tx-2)',fontWeight:700}}>{l}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Analysis;