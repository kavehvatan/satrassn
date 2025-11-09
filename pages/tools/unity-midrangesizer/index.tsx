import React, { useMemo, useState } from 'react';
const models=['Unity XT 380','Unity XT 480','Unity XT 680','Unity XT 880'];
const disks={extreme:['400GB','600GB','800GB','1.6TB','1.92TB','3.2TB','3.84TB','7.68TB','15.36TB'],perf:['1.2TB','1.8TB'],cap:['4TB','8TB','10TB','12TB','14TB','16TB','18TB','20TB']};
const raidSets={RAID5:['4+1','8+1','12+1'],RAID6:['4+2','6+2','8+2','12+2','14+2'],RAID10:['1+1','2+2','3+3','4+4']};
function per32(s){return s==='2/32'?2:1;} function parseSet(v){return v.split('+').map(n=>parseInt(n,10));}
function usableTB(lbl){const n=parseFloat(lbl.replace('GB','').replace('TB',''));return /GB$/.test(lbl)?(n/1024):n;}
export default function Page(){
  const [model,setModel]=useState(models[1]);
  const [rows,setRows]=useState([{tier:'Extreme Performance',disk:disks.extreme[0],raid:'RAID5',spare:'1/32',set:'4+1',count:0},
                                 {tier:'Performance',disk:disks.perf[0],raid:'RAID5',spare:'1/32',set:'4+1',count:0},
                                 {tier:'Capacity',disk:disks.cap[0],raid:'RAID5',spare:'1/32',set:'4+1',count:0}]);
  const capByModel={'Unity XT 380':120,'Unity XT 480':120,'Unity XT 680':250,'Unity XT 880':500};
  const maxDisks=capByModel[model]||120;
  const results=useMemo(()=>{const out={};let total=0;rows.forEach(r=>{const [d,p]=parseSet(r.set);const g=d+p;const groups=Math.floor(r.count/g);
    const perGroup=usableTB(r.disk)*d; const spare=per32(r.spare); const usable=Math.max(0,groups*perGroup-(groups*(p*usableTB(r.disk))/spare));
    if(usable>0){out[r.tier]=(out[r.tier]||0)+usable; total+=usable;}}); return {out,total};},[rows]);
  const update=(i,p)=>{const next=[...rows];next[i]={...next[i],...p}; if(p.raid){next[i].set=raidSets[p.raid][0];} setRows(next);};
  return (<main className="max-w-6xl mx-auto p-6">
    <h1 className="text-3xl font-extrabold mb-6">Unity XT RAID Calculator</h1>
    <div className="mb-6"><label className="font-semibold mr-3">Model</label>
      <select className="px-3 py-2 rounded border" value={model} onChange={e=>setModel(e.target.value)}>{models.map(m=><option key={m}>{m}</option>)}</select>
    </div>
    {rows.map((r,idx)=>(<div key={idx} className="grid md:grid-cols-6 grid-cols-2 gap-3 items-center mb-4">
      <div className="font-semibold">{r.tier}</div>
      <select className="px-3 py-2 rounded border" value={r.disk} onChange={e=>update(idx,{disk:e.target.value})}>
        {(idx===0?disks.extreme:idx===1?disks.perf:disks.cap).map(d=><option key={d}>{d}</option>)}</select>
      <select className="px-3 py-2 rounded border" value={r.raid} onChange={e=>update(idx,{raid:e.target.value})}>
        {Object.keys(raidSets).map(rt=><option key={rt}>{rt}</option>)}</select>
      <select className="px-3 py-2 rounded border" value={r.spare} onChange={e=>update(idx,{spare:e.target.value})}>
        <option>1/32</option><option>2/32</option></select>
      <select className="px-3 py-2 rounded border" value={r.set} onChange={e=>update(idx,{set:e.target.value})}>
        {raidSets[r.raid].map(s=><option key={s}>{s}</option>)}</select>
      <input type="number" min={0} max={maxDisks} className="px-3 py-2 rounded border" value={r.count}
        onChange={e=>{const v=Math.max(0,Math.min(maxDisks,parseInt(e.target.value||'0',10))); update(idx,{count:v});}}/>
    </div>))}
    <div className="mt-8"><h2 className="text-xl font-bold mb-2">Results</h2>
      <ul className="list-disc pr-5">{Object.entries(results.out).map(([k,v])=>(<li key={k}><span className="font-semibold">{k}:</span> {v.toFixed(2)} TB</li>))}</ul>
      <div className="mt-3 font-bold">Total: {results.total.toFixed(2)} TB</div></div>
  </main>); }