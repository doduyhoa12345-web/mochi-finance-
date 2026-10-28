'use client';
import {useMemo,useState} from 'react';

const budgets=[
 ['Siêu thị',4200000,6000000],['Ăn trưa',1320000,1500000],['Ăn tối',910000,1500000],
 ['Ăn vặt',280000,500000],['Di chuyển',810000,1000000],['Mua đồ cá nhân',1750000,3000000],
 ['Entertainment / Buy',1280000,1500000],['Kudog',500000,1500000]
];
const days=[
 {d:'28/10',total:960000,items:['Cafe 70k','Ăn trưa 150k','Di chuyển 90k','Mua sắm 650k']},
 {d:'27/10',total:1450000,items:['Siêu thị 1.2m','Ăn tối 250k']},
 {d:'26/10',total:620000,items:['Ăn trưa 120k','Kudog 500k']},
 {d:'25/10',total:380000,items:['Cafe 80k','Ăn uống 300k']}
];
const accounts=[['Tech chính',12320000,'asset'],['Tech tiết kiệm',37120000,'asset'],['Tech tiền nhà',7020000,'asset'],['VietinBank',11500,'asset']];
const credits=[['Tech Credit',6489000,30000000,15],['HSBC Credit',2767000,50000000,22]];
const history=[
 ['May',4.8,5.3],['Jun',5.4,5.3],['Jul',5.1,5.3],['Aug',6.2,5.3],['Sep',5.5,5.3],['Oct',4.2,5.3]
];
const money=n=>new Intl.NumberFormat('vi-VN',{maximumFractionDigits:0}).format(n)+'đ';
function Progress({spent,budget}){const p=Math.round(spent/budget*100);return <div className="prog"><span style={{width:Math.min(p,100)+'%'}} className={p>100?'bad':p>=80?'warn':'good'}/></div>}
function Bars(){return <div className="history">{history.map(([m,a,b])=><div className="hcol" key={m}><div className="bars"><i style={{height:(a/6.5*100)+'%'}}/><em style={{bottom:(b/6.5*100)+'%'}}/></div><small>{m}</small></div>)}</div>}
export default function Home(){
 const [input,setInput]=useState(''); const [toast,setToast]=useState(''); const [open,setOpen]=useState(null);
 const submit=e=>{e.preventDefault();if(!input.trim())return;setToast('✓ Đã ghi giao dịch vào Mochi Finance');setInput('');setTimeout(()=>setToast(''),2600)};
 const totalAsset=useMemo(()=>accounts.reduce((s,a)=>s+a[1],0),[]); const debt=credits.reduce((s,a)=>s+a[1],0);
 return <main>
  <aside><div className="brand">Mochi<span>Finance</span></div><nav><b>Overview</b><span>History</span><span>Budget</span><span>Accounts</span><span>Settings</span></nav><div className="asideFoot">Private finance journal<br/><small>V0.1</small></div></aside>
  <section className="page">
   <header><div><p className="eyebrow">PERSONAL FINANCE</p><h1>October <i>2026</i></h1><p className="muted">01 Oct — 31 Oct</p></div><button className="month">← &nbsp; Month &nbsp; →</button></header>
   <div className="metrics">
    <article><label>Income</label><strong className="green">+45.0m</strong><small>Salary + other income</small></article>
    <article><label>Total Expense</label><strong className="red">−40.9m</strong><small>All money spent</small></article>
    <article><label>Actual Expense</label><strong className="red">−22.4m</strong><small>Excl. housing & giving</small></article>
    <article><label>Saving</label><strong>10.0m</strong><small>Transfer to savings</small></article>
   </div>
   <form className="command" onSubmit={submit}><div><span>✦ MOCHI INPUT</span><input value={input} onChange={e=>setInput(e.target.value)} placeholder="Hôm nay anh chi gì?  cafe 70k, trưa 150k, grab 90k..."/></div><button>Enter ↵</button></form>
   {toast&&<div className="toast">{toast}</div>}
   <div className="grid2">
    <article className="panel"><div className="panelHead"><div><p className="eyebrow">MONTHLY CONTROL</p><h2>Budget</h2></div><span>8 categories</span></div>
     <div className="budgetList">{budgets.map(([n,s,b])=>{const p=Math.round(s/b*100);return <div className="budget" key={n}><div><b>{n}</b><span className={p>=100?'red':p>=80?'yellow':'green'}>{money(s)} / {money(b)}</span></div><Progress spent={s} budget={b}/></div>})}</div>
    </article>
    <article className="panel"><div className="panelHead"><div><p className="eyebrow">SPENDING MIX</p><h2>Expense Breakdown</h2></div><span>Actual expense</span></div>
     <div className="donutWrap"><div className="donut"><div><b>22.4m</b><small>Actual</small></div></div><div className="legend"><p><i/>Ăn uống <b>32%</b></p><p><i/>Mua sắm <b>24%</b></p><p><i/>Di chuyển <b>18%</b></p><p><i/>Entertainment <b>15%</b></p><p><i/>Khác <b>11%</b></p></div></div>
    </article>
   </div>
   <div className="grid2 lower">
    <article className="panel"><div className="panelHead"><div><p className="eyebrow">DAILY LEDGER</p><h2>Chi tiêu theo ngày</h2></div><span>October</span></div>
     <div className="days">{days.map(x=><button key={x.d} onClick={()=>setOpen(open===x.d?null:x.d)}><div><time>{x.d}</time><p>{x.items.join(' · ')}</p>{open===x.d&&<small className="detail">Chi tiết ngày • Sửa • Xóa</small>}</div><b className="red">−{money(x.total)}</b></button>)}</div>
    </article>
    <article className="panel"><div className="panelHead"><div><p className="eyebrow">NET POSITION</p><h2>Accounts</h2></div><span>Net {money(totalAsset-debt)}</span></div>
     <div className="accounts">{accounts.map(a=><p key={a[0]}><span>{a[0]}</span><b>{money(a[1])}</b></p>)}<hr/>{credits.map(c=><div className="credit" key={c[0]}><p><span>{c[0]} <small>Statement {c[3]}</small></span><b className="red">−{money(c[1])}</b></p><Progress spent={c[1]} budget={c[2]}/><small>{money(c[2]-c[1])} available of {money(c[2])}</small></div>)}</div>
    </article>
   </div>
   <article className="panel historyPanel"><div className="panelHead"><div><p className="eyebrow">6 MONTH HISTORY</p><h2>Siêu thị</h2></div><div><span>Actual</span> · <span>Budget 6m</span> · <span>Baseline 5.3m</span></div></div><Bars/><div className="historyLegend"><span>■ Actual</span><span>— Baseline</span><span>Budget: 6.0m / month</span></div></article>
   <footer>Mochi Finance · Your private financial control room</footer>
  </section>
 </main>
}
