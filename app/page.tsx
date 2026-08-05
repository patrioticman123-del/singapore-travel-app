"use client";

import { ChangeEvent, FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DayPlan, EventItem, Expense, initialDays } from "./trip-data";

type Ticket = { id:string; eventId:string; name:string; number:string; fileName?:string; fileType?:string; fileUrl?:string };
type AppData = { days:DayPlan[]; tickets:Ticket[]; expenses:Expense[]; version:number };
type Tab = "plan" | "expenses" | "edit";

const emptyData:AppData = { days:initialDays, tickets:[], expenses:[], version:0 };
const money = new Intl.NumberFormat("zh-TW", { style:"currency", currency:"SGD" });
const dateLabel = (value:string) => new Intl.DateTimeFormat("zh-TW", { month:"numeric", day:"numeric" }).format(new Date(`${value}T12:00:00`));
const localDateKey = (date = new Date()) => `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`;
const chooseInitialDate = (days:DayPlan[]) => { const today=localDateKey(); return days.find(day=>day.date===today)?.date || days.find(day=>day.date>today)?.date || days.at(-1)?.date || today; };
const getStartMinutes = (time:string) => { const match=time.match(/(\d{1,2}):(\d{2})/); return match ? Number(match[1])*60+Number(match[2]) : 0; };

export default function Home() {
  const [data,setData]=useState<AppData>(emptyData);
  const [selectedDate,setSelectedDate]=useState(chooseInitialDate(initialDays));
  const [tab,setTab]=useState<Tab>("plan");
  const [editingId,setEditingId]=useState<string|null>(null);
  const [dirty,setDirty]=useState(false);
  const [saving,setSaving]=useState(false);
  const [ticketEvent,setTicketEvent]=useState<EventItem|null>(null);
  const [toast,setToast]=useState("");
  const eventRefs=useRef<Record<string,HTMLDetailsElement|null>>({});
  const day=data.days.find(item=>item.date===selectedDate) || data.days[0];
  const today=localDateKey();

  const flash=(message:string)=>{ setToast(message); window.setTimeout(()=>setToast(""),2200); };
  const refresh=useCallback(async(silent=false)=>{
    try { const response=await fetch("/api/state",{cache:"no-store"}); if(!response.ok) throw new Error(); const remote=await response.json() as Partial<AppData>; if(remote.days?.length) setData({days:remote.days,tickets:remote.tickets||[],expenses:remote.expenses||[],version:remote.version||0}); }
    catch { if(!silent) flash("目前使用本機預載行程"); }
  },[]);
  const refreshTickets=useCallback(async()=>{const response=await fetch("/api/tickets",{cache:"no-store"});if(response.ok){const result=await response.json() as {tickets:Ticket[]};setData(current=>({...current,tickets:result.tickets||[]}));}},[]);

  useEffect(()=>{ refresh(); },[refresh]);
  useEffect(()=>{ if(tab==="edit" || dirty) return; const timer=window.setInterval(()=>refresh(true),8000); return()=>window.clearInterval(timer); },[tab,dirty,refresh]);

  const nextEventId=useMemo(()=>{ if(selectedDate!==today) return day?.events[0]?.id; const now=new Date().getHours()*60+new Date().getMinutes(); return day?.events.find(event=>getStartMinutes(event.time)>=now)?.id || day?.events.at(-1)?.id; },[day,selectedDate,today]);
  useEffect(()=>{ if(tab!=="plan"||!nextEventId)return; const timer=window.setTimeout(()=>{const target=eventRefs.current[nextEventId]; if(target){target.open=true;target.scrollIntoView({behavior:"smooth",block:"center"});}},180);return()=>window.clearTimeout(timer);},[selectedDate,tab,nextEventId]);

  function mutateDays(updater:(days:DayPlan[])=>DayPlan[]){setData(current=>({...current,days:updater(current.days)}));setDirty(true);}
  function updateEvent(eventId:string,patch:Partial<EventItem>){mutateDays(days=>days.map(item=>item.date===selectedDate?{...item,events:item.events.map(event=>event.id===eventId?{...event,...patch}:event)}:item));}
  function addEvent(event:Omit<EventItem,"id">){mutateDays(days=>days.map(item=>item.date===selectedDate?{...item,events:[...item.events,{...event,id:crypto.randomUUID()}].sort((a,b)=>getStartMinutes(a.time)-getStartMinutes(b.time))}:item));flash("已加入行程，請記得儲存");}
  function removeEvent(eventId:string){mutateDays(days=>days.map(item=>item.date===selectedDate?{...item,events:item.events.filter(event=>event.id!==eventId)}:item));}
  async function saveAll(){setSaving(true);try{const response=await fetch("/api/state",{method:"PUT",headers:{"content-type":"application/json"},body:JSON.stringify({days:data.days,expenses:data.expenses})});if(!response.ok)throw new Error();const result=await response.json();setData(current=>({...current,version:result.version||current.version+1}));setDirty(false);flash("已儲存，其他人的頁面會自動更新");}catch{flash("儲存失敗，請稍後再試");}finally{setSaving(false);}}

  const dayExpenses=data.expenses.filter(item=>item.date===selectedDate).reduce((sum,item)=>sum+item.amount,0);
  const totalExpenses=data.expenses.reduce((sum,item)=>sum+item.amount,0);

  return <main className="app-shell">
    <header className="hero compact"><div><p className="eyebrow">SINGAPORE · 5 DAYS</p><h1>獅城慢遊</h1></div><div className="trip-meta"><span>26—30 AUG 2026</span><span>Hotel Faber Park</span></div></header>
    <section className="date-section" aria-label="選擇日期"><label htmlFor="date-select">選擇日期</label><select id="date-select" value={selectedDate} onChange={event=>{setSelectedDate(event.target.value);setTab("plan");}}>{data.days.map((item,index)=><option value={item.date} key={item.id}>DAY {index+1} · {dateLabel(item.date)}（{item.weekday}）· {item.theme}{item.date===today?" · 今天":""}</option>)}</select></section>

    {tab==="plan"&&day&&<section className="content plan-view"><div className="section-heading"><div><p>{dateLabel(day.date)} 星期{day.weekday}</p><h2>{day.theme}</h2><span>{day.subtitle}</span></div><div className="weather-mark"><b>28°</b><span>短暫陣雨</span></div></div>
      <div className="status-card"><span className="pulse"/><div><small>{selectedDate===today?"依目前時間":"第一個行程"}</small><strong>{day.events.find(item=>item.id===nextEventId)?.title}</strong></div><button onClick={()=>eventRefs.current[nextEventId||""]?.scrollIntoView({behavior:"smooth",block:"center"})}>前往</button></div>
      <div className="timeline">{day.events.map(event=>{const tickets=data.tickets.filter(ticket=>ticket.eventId===event.id);return <details key={event.id} ref={node=>{eventRefs.current[event.id]=node;}} className={`timeline-item ${event.id===nextEventId?"next":""}`}><summary><time>{event.time}</time><span className={`dot ${event.kind||"spot"}`}/><div><h3>{event.title}</h3><p>{event.note}</p></div><span className="chevron">⌄</span></summary><div className="event-actions">{event.location&&<a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`} target="_blank" rel="noreferrer">↗ Google Maps 導航</a>}<button onClick={()=>setTicketEvent(event)}>▣ 票券{tickets.length?` ${tickets.length}`:""}</button><button onClick={()=>setTab("expenses")}>＋ 記錄花費</button></div></details>;})}</div>
      <aside className="reminder"><b>今日提醒</b><p>{selectedDate==="2026-08-28"?"攜帶防蚊液與輕便雨衣；Night Safari 先確認入場與表演時段。":selectedDate==="2026-08-30"?"Rain Vortex 位於公共區域，完成參觀後再進入出境管制。":"新加坡炎熱潮濕，隨身帶水、折傘與行動電源。"}</p></aside>
    </section>}

    {tab==="expenses"&&<Expenses data={data} setData={setData} selectedDate={selectedDate} dayExpenses={dayExpenses} totalExpenses={totalExpenses} markDirty={()=>setDirty(true)} flash={flash}/>} 
    {tab==="edit"&&day&&<Editor day={day} tickets={data.tickets} editingId={editingId} setEditingId={setEditingId} updateEvent={updateEvent} addEvent={addEvent} removeEvent={removeEvent} mutateDays={mutateDays} refreshTickets={refreshTickets} flash={flash}/>} 

    <nav className="bottom-nav three" aria-label="主要功能"><button className={tab==="plan"?"active":""} onClick={()=>setTab("plan")}><span>◷</span>行程</button><button className={tab==="expenses"?"active":""} onClick={()=>setTab("expenses")}><span>$</span>記帳</button><button className={tab==="edit"?"active":""} onClick={()=>setTab("edit")}><span>✎</span>修改</button></nav>
    {tab==="edit"&&<div className="save-dock"><span>{dirty?"有尚未儲存的修改":"所有修改已同步"}</span><button className="primary" disabled={!dirty||saving} onClick={saveAll}>{saving?"儲存中…":"儲存全部修改"}</button></div>}
    {ticketEvent&&<TicketModal event={ticketEvent} tickets={data.tickets.filter(ticket=>ticket.eventId===ticketEvent.id)} close={()=>setTicketEvent(null)}/>} 
    {toast&&<div className="toast">✓ {toast}</div>}
  </main>;
}

function TicketModal({event,tickets,close}:{event:EventItem;tickets:Ticket[];close:()=>void}){return <div className="modal-backdrop" onClick={close}><section className="ticket-modal" onClick={e=>e.stopPropagation()}><div className="modal-title"><div><small>TICKETS</small><h2>{event.title}</h2></div><button onClick={close}>×</button></div>{tickets.length===0?<div className="empty compact-empty"><span>▣</span><h3>尚未加入票券</h3><p>請到「修改」頁面，選擇這個行程後新增門票或 QR Code。</p></div>:<div className="ticket-list">{tickets.map(ticket=><article className="ticket-card" key={ticket.id}><div className="ticket-top"><span>ADMIT ONE</span></div><h3>{ticket.name}</h3><p>{ticket.number||ticket.fileName||"電子票券"}</p>{ticket.fileUrl&&ticket.fileType?.startsWith("image/")&&<a href={ticket.fileUrl} target="_blank" rel="noreferrer"><img src={ticket.fileUrl} alt={`${ticket.name} QR Code`}/></a>}{ticket.fileUrl&&!ticket.fileType?.startsWith("image/")&&<a className="file-link" href={ticket.fileUrl} target="_blank" rel="noreferrer">開啟 {ticket.fileName}</a>}</article>)}</div>}</section></div>}

function Expenses({data,setData,selectedDate,dayExpenses,totalExpenses,markDirty,flash}:{data:AppData;setData:React.Dispatch<React.SetStateAction<AppData>>;selectedDate:string;dayExpenses:number;totalExpenses:number;markDirty:()=>void;flash:(text:string)=>void}){
  const [draft,setDraft]=useState({title:"",amount:"",category:"餐飲",date:selectedDate});const max=Math.max(1,...data.days.map(day=>data.expenses.filter(item=>item.date===day.date).reduce((sum,item)=>sum+item.amount,0)));
  function save(event:FormEvent){event.preventDefault();const amount=Number(draft.amount);if(!draft.title.trim()||!amount)return flash("請填項目與金額");setData(current=>({...current,expenses:[...current.expenses,{...draft,amount,id:crypto.randomUUID()}]}));setDraft(current=>({...current,title:"",amount:""}));markDirty();flash("已加入，請到修改頁儲存同步");}
  return <section className="content feature-view"><div className="feature-title"><div><p>TRIP SPENDING</p><h2>花費統計</h2><span>幣別：新加坡幣 SGD</span></div></div><div className="money-grid"><article><small>{dateLabel(selectedDate)} 花費</small><strong>{money.format(dayExpenses)}</strong></article><article className="dark"><small>五日總花費</small><strong>{money.format(totalExpenses)}</strong></article></div><div className="panel chart"><h3>每日花費</h3>{data.days.map(day=>{const value=data.expenses.filter(item=>item.date===day.date).reduce((sum,item)=>sum+item.amount,0);return <div className="bar-row" key={day.id}><span>{new Date(`${day.date}T12:00:00`).getDate()} 日</span><div><i style={{width:`${Math.max(value?8:0,value/max*100)}%`}}/></div><b>{money.format(value)}</b></div>;})}</div><form className="panel expense-form" onSubmit={save}><h3>＋ 新增花費</h3><div className="form-grid"><label>日期<select value={draft.date} onChange={e=>setDraft({...draft,date:e.target.value})}>{data.days.map(day=><option key={day.id} value={day.date}>{dateLabel(day.date)}</option>)}</select></label><label>分類<select value={draft.category} onChange={e=>setDraft({...draft,category:e.target.value})}><option>餐飲</option><option>門票</option><option>交通</option><option>購物</option><option>住宿</option><option>其他</option></select></label><label>項目<input value={draft.title} onChange={e=>setDraft({...draft,title:e.target.value})} placeholder="例：晚餐"/></label><label>金額（SGD）<input type="number" inputMode="decimal" min="0" step="0.01" value={draft.amount} onChange={e=>setDraft({...draft,amount:e.target.value})}/></label><button className="primary wide">加入記帳</button></div></form><div className="expense-list">{data.expenses.slice().reverse().map(expense=><article key={expense.id}><span>{expense.category.slice(0,1)}</span><div><h3>{expense.title}</h3><p>{dateLabel(expense.date)} · {expense.category}</p></div><strong>{money.format(expense.amount)}</strong><button onClick={()=>{setData(current=>({...current,expenses:current.expenses.filter(item=>item.id!==expense.id)}));markDirty();}}>×</button></article>)}</div></section>;
}

function Editor({day,tickets,editingId,setEditingId,updateEvent,addEvent,removeEvent,mutateDays,refreshTickets,flash}:{day:DayPlan;tickets:Ticket[];editingId:string|null;setEditingId:(id:string|null)=>void;updateEvent:(id:string,patch:Partial<EventItem>)=>void;addEvent:(event:Omit<EventItem,"id">)=>void;removeEvent:(id:string)=>void;mutateDays:(updater:(days:DayPlan[])=>DayPlan[])=>void;refreshTickets:()=>Promise<void>;flash:(text:string)=>void}){
  const [draft,setDraft]=useState({time:"",title:"",note:"",location:"",kind:"spot" as EventItem["kind"]});
  return <section className="content feature-view edit-view"><div className="feature-title"><div><p>EDIT ITINERARY</p><h2>修改 {dateLabel(day.date)}</h2><span>修改後請按下方「儲存全部修改」</span></div></div><div className="panel day-edit"><label>當日主題<input value={day.theme} onChange={e=>mutateDays(days=>days.map(item=>item.id===day.id?{...item,theme:e.target.value}:item))}/></label><label>副標題<input value={day.subtitle} onChange={e=>mutateDays(days=>days.map(item=>item.id===day.id?{...item,subtitle:e.target.value}:item))}/></label></div>
    <div className="edit-list">{day.events.map(event=>editingId===event.id?<article className="panel edit-card open" key={event.id}><div className="form-grid"><label>時間<input value={event.time} onChange={e=>updateEvent(event.id,{time:e.target.value})}/></label><label>類型<select value={event.kind} onChange={e=>updateEvent(event.id,{kind:e.target.value as EventItem["kind"]})}><option value="spot">景點</option><option value="food">餐廳</option><option value="transit">交通</option><option value="rest">休息</option></select></label><label className="wide">名稱<input value={event.title} onChange={e=>updateEvent(event.id,{title:e.target.value})}/></label><label className="wide">細節<textarea value={event.note} onChange={e=>updateEvent(event.id,{note:e.target.value})}/></label><label className="wide">Google Maps 地點<input value={event.location||""} onChange={e=>updateEvent(event.id,{location:e.target.value})}/></label></div><TicketAdmin event={event} tickets={tickets.filter(ticket=>ticket.eventId===event.id)} refreshTickets={refreshTickets} flash={flash}/><div className="edit-actions"><button className="danger" onClick={()=>{removeEvent(event.id);setEditingId(null);}}>刪除行程</button><button className="primary" onClick={()=>setEditingId(null)}>完成編輯</button></div></article>:<button className="edit-row" key={event.id} onClick={()=>setEditingId(event.id)}><time>{event.time}</time><span>{event.title}<small>{event.kind==="food"?"餐廳":event.kind==="transit"?"交通":event.kind==="rest"?"休息":"景點"}{tickets.some(ticket=>ticket.eventId===event.id)?" · 有票券":""}</small></span><b>›</b></button>)}</div>
    <form className="panel add-form" onSubmit={e=>{e.preventDefault();if(!draft.time||!draft.title)return flash("請填時間與名稱");addEvent({...draft});setDraft({time:"",title:"",note:"",location:"",kind:"spot"});}}><h3>新增景點／餐廳</h3><div className="form-grid"><label>時間<input placeholder="14:30–16:00" value={draft.time} onChange={e=>setDraft({...draft,time:e.target.value})}/></label><label>類型<select value={draft.kind} onChange={e=>setDraft({...draft,kind:e.target.value as EventItem["kind"]})}><option value="spot">景點</option><option value="food">餐廳</option><option value="transit">交通</option><option value="rest">休息</option></select></label><label className="wide">名稱<input value={draft.title} onChange={e=>setDraft({...draft,title:e.target.value})}/></label><label className="wide">細節<textarea value={draft.note} onChange={e=>setDraft({...draft,note:e.target.value})}/></label><label className="wide">Google Maps 地點<input value={draft.location} onChange={e=>setDraft({...draft,location:e.target.value})}/></label><button className="primary wide">＋ 新增到時間軸</button></div></form>
  </section>;
}

function TicketAdmin({event,tickets,refreshTickets,flash}:{event:EventItem;tickets:Ticket[];refreshTickets:()=>Promise<void>;flash:(text:string)=>void}){
  const [name,setName]=useState("");const [number,setNumber]=useState("");const [file,setFile]=useState<File|null>(null);const [uploading,setUploading]=useState(false);
  async function upload(e:FormEvent){e.preventDefault();if(!name.trim()||(!number.trim()&&!file))return flash("請填票券名稱與號碼或檔案");const form=new FormData();form.set("eventId",event.id);form.set("name",name);form.set("number",number);if(file)form.set("file",file);setUploading(true);try{const response=await fetch("/api/tickets",{method:"POST",body:form});if(!response.ok)throw new Error();setName("");setNumber("");setFile(null);await refreshTickets();flash("票券已加入這個行程");}catch{flash("票券上傳失敗");}finally{setUploading(false);}}
  async function remove(id:string){const response=await fetch(`/api/tickets?id=${encodeURIComponent(id)}`,{method:"DELETE"});if(response.ok){await refreshTickets();flash("票券已刪除");}}
  return <div className="ticket-admin"><h3>票券與 QR Code</h3>{tickets.map(ticket=><div className="admin-ticket" key={ticket.id}><span>▣</span><div><b>{ticket.name}</b><small>{ticket.number||ticket.fileName}</small></div><button onClick={()=>remove(ticket.id)}>×</button></div>)}<form onSubmit={upload} className="form-grid"><label className="wide">票券名稱<input value={name} onChange={e=>setName(e.target.value)} placeholder="例：環球影城門票"/></label><label className="wide">票號／訂位代碼<input value={number} onChange={e=>setNumber(e.target.value)}/></label><label className="upload wide"><input type="file" accept="image/*,application/pdf" onChange={(e:ChangeEvent<HTMLInputElement>)=>setFile(e.target.files?.[0]||null)}/><span>{file?`✓ ${file.name}`:"上傳門票、機票、QR Code 圖片或 PDF"}</span></label><button className="secondary wide" disabled={uploading}>{uploading?"上傳中…":"＋ 新增票券檔案"}</button></form></div>;
}
