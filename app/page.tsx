"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from "react";

type EventItem = { id: string; time: string; title: string; note: string; location?: string; kind?: "spot" | "food" | "transit" | "rest" };
type DayPlan = { id: string; date: string; weekday: string; theme: string; subtitle: string; events: EventItem[] };
type Ticket = { id: string; name: string; number: string; date: string; fileName?: string; fileType?: string; fileData?: string };
type Expense = { id: string; date: string; category: string; title: string; amount: number };
type AppData = { days: DayPlan[]; tickets: Ticket[]; expenses: Expense[] };
type Tab = "plan" | "tickets" | "expenses" | "edit";

const initialDays: DayPlan[] = [
  {
    id: "day-1", date: "2026-08-26", weekday: "三", theme: "濱海灣初見", subtitle: "抵達・魚尾獅・濱海灣夜景",
    events: [
      { id: "d1-1", time: "13:55", title: "抵達新加坡樟宜機場", note: "入境、領行李、上網卡；預留約 60–90 分鐘。", location: "Singapore Changi Airport", kind: "transit" },
      { id: "d1-2", time: "15:30–16:20", title: "前往 Hotel Faber Park", note: "建議 Grab／計程車；抵達後寄放行李或入住。", location: "Hotel Faber Park Singapore", kind: "transit" },
      { id: "d1-3", time: "16:20–17:10", title: "房間休息、盥洗", note: "補水，換輕便衣物。", kind: "rest" },
      { id: "d1-4", time: "17:15–17:40", title: "前往魚尾獅公園", note: "Grab 最省時間。", location: "Merlion Park Singapore", kind: "transit" },
      { id: "d1-5", time: "17:40–18:25", title: "魚尾獅公園與濱海灣步道", note: "拍攝 Marina Bay Sands、Esplanade。", location: "Merlion Park Singapore", kind: "spot" },
      { id: "d1-6", time: "18:25–19:20", title: "濱海灣晚餐", note: "Lau Pa Sat、Satay by the Bay 或 Marina Bay 區餐廳；約 S$10–30／人。", location: "Lau Pa Sat Singapore", kind: "food" },
      { id: "d1-7", time: "19:20–21:10", title: "濱海灣花園", note: "Supertree Grove、夜間燈光秀；視票券加入 Cloud Forest／Flower Dome。", location: "Gardens by the Bay", kind: "spot" },
      { id: "d1-8", time: "21:10–21:40", title: "返回飯店", note: "首日不再追加景點。", location: "Hotel Faber Park Singapore", kind: "transit" },
    ],
  },
  {
    id: "day-2", date: "2026-08-27", weekday: "四", theme: "聖淘沙", subtitle: "新加坡環球影城全日",
    events: [
      { id: "d2-1", time: "07:00–07:40", title: "飯店早餐", note: "提早準備，避免入園排隊。", kind: "food" },
      { id: "d2-2", time: "07:45–08:15", title: "前往 Resorts World Sentosa", note: "Grab 最快；也可到 VivoCity 轉 Sentosa Express。", location: "Resorts World Sentosa", kind: "transit" },
      { id: "d2-3", time: "08:15–開園", title: "安檢、排隊、確認表演", note: "依 2026 官方開園時間調整。", location: "Universal Studios Singapore", kind: "spot" },
      { id: "d2-4", time: "開園–12:30", title: "優先熱門設施", note: "Transformers、Battlestar Galactica、Revenge of the Mummy 等依喜好排序。", location: "Universal Studios Singapore", kind: "spot" },
      { id: "d2-5", time: "12:30–13:30", title: "園內午餐＋休息", note: "避開最熱與人潮高峰；約 S$15–30／人。", kind: "food" },
      { id: "d2-6", time: "13:30–17:30", title: "其餘設施與表演", note: "依排隊時間彈性調整。", location: "Universal Studios Singapore", kind: "spot" },
      { id: "d2-7", time: "17:30–19:00", title: "補玩或提早離園", note: "視體力與園區營業時間。", location: "Universal Studios Singapore", kind: "spot" },
      { id: "d2-8", time: "19:00–20:30", title: "VivoCity 晚餐／逛街", note: "Food Republic、松發肉骨茶或 PUTIEN。", location: "VivoCity Singapore", kind: "food" },
      { id: "d2-9", time: "20:30–21:00", title: "返回飯店", note: "整理照片、早點休息。", location: "Hotel Faber Park Singapore", kind: "transit" },
    ],
  },
  {
    id: "day-3", date: "2026-08-28", weekday: "五", theme: "萬態野生動物世界", subtitle: "River Wonders・Night Safari",
    events: [
      { id: "d3-1", time: "08:00–09:00", title: "飯店早餐與休息", note: "今天較晚回飯店，不必過早出發。", kind: "food" },
      { id: "d3-2", time: "09:15–10:00", title: "前往 Mandai Wildlife Reserve", note: "建議 Grab／計程車。", location: "Mandai Wildlife Reserve", kind: "transit" },
      { id: "d3-3", time: "10:00–13:00", title: "River Wonders", note: "依動線參觀淡水生態、熊貓展區等。", location: "River Wonders Singapore", kind: "spot" },
      { id: "d3-4", time: "13:00–14:00", title: "園區午餐", note: "避暑、補水；約 S$15–30／人。", location: "River Wonders Singapore", kind: "food" },
      { id: "d3-5", time: "14:00–16:30", title: "River Wonders 後半段／休息", note: "視園區開放活動調整。", location: "River Wonders Singapore", kind: "spot" },
      { id: "d3-6", time: "16:30–18:00", title: "Mandai 晚餐與休息", note: "不要再往市區來回。", location: "Mandai Wildlife West", kind: "food" },
      { id: "d3-7", time: "18:00–18:45", title: "前往 Night Safari 入場區", note: "依票券時段排隊。", location: "Night Safari Singapore", kind: "transit" },
      { id: "d3-8", time: "19:00–22:00", title: "Night Safari", note: "先看動物表演或先搭遊園車，依預約時段安排。", location: "Night Safari Singapore", kind: "spot" },
      { id: "d3-9", time: "22:00–22:45", title: "Grab 返回飯店", note: "夜間叫車可能等候，預留時間。", location: "Hotel Faber Park Singapore", kind: "transit" },
    ],
  },
  {
    id: "day-4", date: "2026-08-29", weekday: "六", theme: "購物自由日", subtitle: "Orchard・Bugis・Haji Lane",
    events: [
      { id: "d4-1", time: "08:30–09:30", title: "悠閒早餐", note: "今天保留彈性。", kind: "food" },
      { id: "d4-2", time: "10:00–13:00", title: "Orchard Road 購物", note: "ION Orchard、Ngee Ann City、Takashimaya。", location: "Orchard Road Singapore", kind: "spot" },
      { id: "d4-3", time: "13:00–14:00", title: "午餐", note: "Orchard／Somerset 美食街或 Din Tai Fung。", location: "Somerset Singapore", kind: "food" },
      { id: "d4-4", time: "14:00–17:00", title: "Bugis＋Haji Lane＋Kampong Glam", note: "街區拍照、咖啡、特色小店。", location: "Haji Lane Singapore", kind: "spot" },
      { id: "d4-5", time: "17:00–18:00", title: "回飯店休息／放戰利品", note: "避免全天曝曬。", location: "Hotel Faber Park Singapore", kind: "rest" },
      { id: "d4-6", time: "18:30–20:30", title: "晚餐自由選擇", note: "Chinatown、Clarke Quay 或 Marina Bay；名店建議訂位。", location: "Chinatown Singapore", kind: "food" },
      { id: "d4-7", time: "20:30 之後", title: "自由活動", note: "可補看濱海灣夜景或回飯店休息。", kind: "spot" },
    ],
  },
  {
    id: "day-5", date: "2026-08-30", weekday: "日", theme: "星耀樟宜", subtitle: "Rain Vortex・返程",
    events: [
      { id: "d5-1", time: "06:30", title: "起床、最後整理", note: "確認護照、票券、行李重量。", kind: "rest" },
      { id: "d5-2", time: "07:00–07:10", title: "退房並前往樟宜機場", note: "建議 Grab／計程車。", location: "Jewel Changi Airport", kind: "transit" },
      { id: "d5-3", time: "07:45–08:15", title: "抵達星耀樟宜", note: "寄放行李或先辦理報到；依櫃檯開放時間調整。", location: "Jewel Changi Airport", kind: "spot" },
      { id: "d5-4", time: "08:15–09:00", title: "早餐與星耀散步", note: "Ya Kun／Toast Box；商店部分可能尚未開門。", location: "Jewel Changi Airport", kind: "food" },
      { id: "d5-5", time: "09:00–09:30", title: "Rain Vortex 與 Forest Valley", note: "啟動時間以 2026 官方公告為準。", location: "HSBC Rain Vortex", kind: "spot" },
      { id: "d5-6", time: "09:30–10:10", title: "採買伴手禮", note: "不要逛到忘記報到時間。", location: "Jewel Changi Airport", kind: "spot" },
      { id: "d5-7", time: "10:10 前", title: "完成報到與托運", note: "國際線建議起飛前約 3 小時完成。", location: "Singapore Changi Airport", kind: "transit" },
      { id: "d5-8", time: "10:30–12:10", title: "安檢、出境、候機", note: "確認登機門是否需搭 Skytrain。", location: "Singapore Changi Airport", kind: "transit" },
      { id: "d5-9", time: "13:10", title: "班機離開新加坡", note: "旅程結束。", location: "Singapore Changi Airport", kind: "transit" },
    ],
  },
];

const emptyData: AppData = { days: initialDays, tickets: [], expenses: [] };

function localDateKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function chooseInitialDate(days: DayPlan[]) {
  const today = localDateKey();
  return days.find((day) => day.date === today)?.date || days.find((day) => day.date > today)?.date || days.at(-1)?.date || today;
}

function getStartMinutes(time: string) {
  const match = time.match(/(\d{1,2}):(\d{2})/);
  return match ? Number(match[1]) * 60 + Number(match[2]) : 0;
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("singapore-trip", 1);
    request.onupgradeneeded = () => request.result.createObjectStore("app");
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function loadData(): Promise<AppData | null> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const request = db.transaction("app", "readonly").objectStore("app").get("data");
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

async function persistData(data: AppData) {
  const db = await openDb();
  return new Promise<void>((resolve, reject) => {
    const request = db.transaction("app", "readwrite").objectStore("app").put(data, "data");
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

const money = new Intl.NumberFormat("zh-TW", { style: "currency", currency: "SGD" });
const dateLabel = (value: string) => new Intl.DateTimeFormat("zh-TW", { month: "numeric", day: "numeric" }).format(new Date(`${value}T12:00:00`));

export default function Home() {
  const [data, setData] = useState<AppData>(emptyData);
  const [selectedDate, setSelectedDate] = useState(chooseInitialDate(initialDays));
  const [tab, setTab] = useState<Tab>("plan");
  const [ready, setReady] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [toast, setToast] = useState("");
  const eventRefs = useRef<Record<string, HTMLDetailsElement | null>>({});
  const day = data.days.find((item) => item.date === selectedDate) || data.days[0];
  const today = localDateKey();

  useEffect(() => {
    loadData().then((saved) => {
      if (saved) setData(saved);
      setReady(true);
    }).catch(() => setReady(true));
  }, []);

  useEffect(() => {
    if (!ready) return;
    const timer = window.setTimeout(() => persistData(data), 120);
    return () => window.clearTimeout(timer);
  }, [data, ready]);

  const nextEventId = useMemo(() => {
    if (selectedDate !== today) return day?.events[0]?.id;
    const now = new Date().getHours() * 60 + new Date().getMinutes();
    return day?.events.find((event) => getStartMinutes(event.time) >= now)?.id || day?.events.at(-1)?.id;
  }, [day, selectedDate, today]);

  useEffect(() => {
    if (tab !== "plan" || !nextEventId) return;
    const timer = window.setTimeout(() => {
      const target = eventRefs.current[nextEventId];
      if (target) {
        target.open = true;
        target.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 180);
    return () => window.clearTimeout(timer);
  }, [selectedDate, tab, nextEventId]);

  function flash(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2200);
  }

  function updateEvent(eventId: string, patch: Partial<EventItem>) {
    setData((current) => ({ ...current, days: current.days.map((item) => item.date === selectedDate ? { ...item, events: item.events.map((event) => event.id === eventId ? { ...event, ...patch } : event) } : item) }));
  }

  function addEvent(event: Omit<EventItem, "id">) {
    setData((current) => ({ ...current, days: current.days.map((item) => item.date === selectedDate ? { ...item, events: [...item.events, { ...event, id: crypto.randomUUID() }].sort((a, b) => getStartMinutes(a.time) - getStartMinutes(b.time)) } : item) }));
    flash("已加入行程");
  }

  function removeEvent(eventId: string) {
    setData((current) => ({ ...current, days: current.days.map((item) => item.date === selectedDate ? { ...item, events: item.events.filter((event) => event.id !== eventId) } : item) }));
  }

  const dayExpenses = data.expenses.filter((item) => item.date === selectedDate).reduce((sum, item) => sum + item.amount, 0);
  const totalExpenses = data.expenses.reduce((sum, item) => sum + item.amount, 0);

  return (
    <main className="app-shell">
      <header className="hero">
        <div className="hero-top">
          <div>
            <p className="eyebrow">SINGAPORE · 5 DAYS</p>
            <h1>獅城慢遊</h1>
          </div>
          <button className="icon-button" onClick={() => setTab("edit")} aria-label="修改行程">✎</button>
        </div>
        <div className="trip-meta"><span>26—30 AUG 2026</span><span>Hotel Faber Park</span></div>
      </header>

      <section className="date-section" aria-label="選擇日期">
        <label htmlFor="date-select">選擇日期</label>
        <select id="date-select" value={selectedDate} onChange={(event) => { setSelectedDate(event.target.value); setTab("plan"); }}>
          {data.days.map((item, index) => <option value={item.date} key={item.id}>DAY {index + 1} · {dateLabel(item.date)}（{item.weekday}）· {item.theme}</option>)}
        </select>
        <div className="date-strip">
          {data.days.map((item, index) => (
            <button key={item.id} className={item.date === selectedDate ? "date-chip active" : "date-chip"} onClick={() => { setSelectedDate(item.date); setTab("plan"); }}>
              <small>DAY {index + 1}</small><strong>{new Date(`${item.date}T12:00:00`).getDate()}</strong><span>{item.weekday}</span>{item.date === today && <i>今天</i>}
            </button>
          ))}
        </div>
      </section>

      {tab === "plan" && day && (
        <section className="content plan-view">
          <div className="section-heading">
            <div><p>{dateLabel(day.date)} 星期{day.weekday}</p><h2>{day.theme}</h2><span>{day.subtitle}</span></div>
            <div className="weather-mark"><b>28°</b><span>短暫陣雨</span></div>
          </div>
          <div className="status-card"><span className="pulse"/><div><small>{selectedDate === today ? "依目前時間" : "第一個行程"}</small><strong>{day.events.find((item) => item.id === nextEventId)?.title}</strong></div><button onClick={() => eventRefs.current[nextEventId || ""]?.scrollIntoView({ behavior: "smooth", block: "center" })}>前往</button></div>
          <div className="timeline">
            {day.events.map((event) => (
              <details key={event.id} ref={(node) => { eventRefs.current[event.id] = node; }} className={`timeline-item ${event.id === nextEventId ? "next" : ""}`}>
                <summary>
                  <time>{event.time}</time><span className={`dot ${event.kind || "spot"}`}/><div><h3>{event.title}</h3><p>{event.note}</p></div><span className="chevron">⌄</span>
                </summary>
                <div className="event-actions">
                  {event.location && <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`} target="_blank" rel="noreferrer">↗ Google Maps 導航</a>}
                  <button onClick={() => { setTab("expenses"); }}>＋ 記錄花費</button>
                  <button onClick={() => { setEditingId(event.id); setTab("edit"); }}>✎ 修改</button>
                </div>
              </details>
            ))}
          </div>
          <aside className="reminder"><b>今日提醒</b><p>{selectedDate === "2026-08-28" ? "攜帶防蚊液與輕便雨衣；Night Safari 先確認入場與表演時段。" : selectedDate === "2026-08-30" ? "Rain Vortex 位於公共區域，完成參觀後再進入出境管制。" : "新加坡炎熱潮濕，隨身帶水、折傘與行動電源。"}</p></aside>
        </section>
      )}

      {tab === "tickets" && <Tickets data={data} setData={setData} selectedDate={selectedDate} flash={flash} />}
      {tab === "expenses" && <Expenses data={data} setData={setData} selectedDate={selectedDate} dayExpenses={dayExpenses} totalExpenses={totalExpenses} flash={flash} />}
      {tab === "edit" && day && <Editor day={day} editingId={editingId} setEditingId={setEditingId} updateEvent={updateEvent} addEvent={addEvent} removeEvent={removeEvent} setData={setData} flash={flash} />}

      <nav className="bottom-nav" aria-label="主要功能">
        <button className={tab === "plan" ? "active" : ""} onClick={() => setTab("plan")}><span>◷</span>行程</button>
        <button className={tab === "tickets" ? "active" : ""} onClick={() => setTab("tickets")}><span>▣</span>票券</button>
        <button className={tab === "expenses" ? "active" : ""} onClick={() => setTab("expenses")}><span>$</span>記帳</button>
        <button className={tab === "edit" ? "active" : ""} onClick={() => setTab("edit")}><span>✎</span>修改</button>
      </nav>
      {toast && <div className="toast">✓ {toast}</div>}
    </main>
  );
}

function Tickets({ data, setData, selectedDate, flash }: { data: AppData; setData: React.Dispatch<React.SetStateAction<AppData>>; selectedDate: string; flash: (text: string) => void }) {
  const [formOpen, setFormOpen] = useState(false);
  const [draft, setDraft] = useState({ name: "", number: "", date: selectedDate, fileName: "", fileType: "", fileData: "" });

  async function chooseFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) return flash("檔案需小於 8 MB");
    const reader = new FileReader();
    reader.onload = () => setDraft((current) => ({ ...current, fileName: file.name, fileType: file.type, fileData: String(reader.result) }));
    reader.readAsDataURL(file);
  }

  function save(event: FormEvent) {
    event.preventDefault();
    if (!draft.name.trim() || (!draft.number.trim() && !draft.fileData)) return flash("請填票券名稱與號碼或檔案");
    setData((current) => ({ ...current, tickets: [...current.tickets, { ...draft, id: crypto.randomUUID() }] }));
    setDraft({ name: "", number: "", date: selectedDate, fileName: "", fileType: "", fileData: "" }); setFormOpen(false); flash("票券已安全存入本機");
  }

  return <section className="content feature-view">
    <div className="feature-title"><div><p>MY WALLET</p><h2>票券夾</h2><span>{data.tickets.length} 張票券・保存在此裝置</span></div><button className="primary" onClick={() => setFormOpen(!formOpen)}>＋ 存入票券</button></div>
    {formOpen && <form className="panel form-grid" onSubmit={save}>
      <label>票券名稱<input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} placeholder="例：Night Safari" /></label>
      <label>日期<select value={draft.date} onChange={(event) => setDraft({ ...draft, date: event.target.value })}>{data.days.map((day) => <option key={day.id} value={day.date}>{dateLabel(day.date)} · {day.theme}</option>)}</select></label>
      <label className="wide">票號／訂位代碼<input value={draft.number} onChange={(event) => setDraft({ ...draft, number: event.target.value })} placeholder="可輸入多組號碼" /></label>
      <label className="upload wide"><input type="file" accept="image/*,application/pdf" onChange={chooseFile} /><span>{draft.fileName ? `✓ ${draft.fileName}` : "點選上傳 QR Code、門票或機票（圖片／PDF）"}</span></label>
      <button className="primary wide" type="submit">儲存票券</button>
    </form>}
    <div className="ticket-list">
      {data.tickets.length === 0 && <div className="empty"><span>▣</span><h3>把票券收在一起</h3><p>可存門票號碼、QR Code 圖片、PDF 機票；支援多張。</p></div>}
      {data.tickets.map((ticket) => <article className="ticket-card" key={ticket.id}>
        <div className="ticket-top"><span>ADMIT ONE</span><button aria-label="刪除票券" onClick={() => setData((current) => ({ ...current, tickets: current.tickets.filter((item) => item.id !== ticket.id) }))}>×</button></div>
        <h3>{ticket.name}</h3><p>{dateLabel(ticket.date)} · {ticket.number || "電子票券"}</p>
        {ticket.fileData && ticket.fileType?.startsWith("image/") && <img src={ticket.fileData} alt={`${ticket.name} QR Code`} />}
        {ticket.fileData && !ticket.fileType?.startsWith("image/") && <a className="file-link" href={ticket.fileData} download={ticket.fileName}>開啟 {ticket.fileName}</a>}
      </article>)}
    </div>
  </section>;
}

function Expenses({ data, setData, selectedDate, dayExpenses, totalExpenses, flash }: { data: AppData; setData: React.Dispatch<React.SetStateAction<AppData>>; selectedDate: string; dayExpenses: number; totalExpenses: number; flash: (text: string) => void }) {
  const [draft, setDraft] = useState({ title: "", amount: "", category: "餐飲", date: selectedDate });
  const max = Math.max(1, ...data.days.map((day) => data.expenses.filter((item) => item.date === day.date).reduce((sum, item) => sum + item.amount, 0)));
  function save(event: FormEvent) {
    event.preventDefault(); const amount = Number(draft.amount);
    if (!draft.title.trim() || !amount) return flash("請填項目與金額");
    setData((current) => ({ ...current, expenses: [...current.expenses, { ...draft, amount, id: crypto.randomUUID() }] }));
    setDraft((current) => ({ ...current, title: "", amount: "" })); flash("花費已記錄");
  }
  return <section className="content feature-view">
    <div className="feature-title"><div><p>TRIP SPENDING</p><h2>花費統計</h2><span>幣別：新加坡幣 SGD</span></div></div>
    <div className="money-grid"><article><small>{dateLabel(selectedDate)} 花費</small><strong>{money.format(dayExpenses)}</strong></article><article className="dark"><small>五日總花費</small><strong>{money.format(totalExpenses)}</strong></article></div>
    <div className="panel chart"><h3>每日花費</h3>{data.days.map((day) => { const value = data.expenses.filter((item) => item.date === day.date).reduce((sum, item) => sum + item.amount, 0); return <div className="bar-row" key={day.id}><span>{new Date(`${day.date}T12:00:00`).getDate()} 日</span><div><i style={{ width: `${Math.max(value ? 8 : 0, value / max * 100)}%` }}/></div><b>{money.format(value)}</b></div>; })}</div>
    <form className="panel expense-form" onSubmit={save}><h3>＋ 新增花費</h3><div className="form-grid"><label>日期<select value={draft.date} onChange={(event) => setDraft({ ...draft, date: event.target.value })}>{data.days.map((day) => <option key={day.id} value={day.date}>{dateLabel(day.date)}</option>)}</select></label><label>分類<select value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value })}><option>餐飲</option><option>門票</option><option>交通</option><option>購物</option><option>住宿</option><option>其他</option></select></label><label>項目<input placeholder="例：Lau Pa Sat 晚餐" value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} /></label><label>金額（SGD）<input type="number" inputMode="decimal" min="0" step="0.01" placeholder="0.00" value={draft.amount} onChange={(event) => setDraft({ ...draft, amount: event.target.value })} /></label><button className="primary wide">加入記帳</button></div></form>
    <div className="expense-list">{data.expenses.slice().reverse().map((expense) => <article key={expense.id}><span>{expense.category.slice(0, 1)}</span><div><h3>{expense.title}</h3><p>{dateLabel(expense.date)} · {expense.category}</p></div><strong>{money.format(expense.amount)}</strong><button onClick={() => setData((current) => ({ ...current, expenses: current.expenses.filter((item) => item.id !== expense.id) }))}>×</button></article>)}</div>
  </section>;
}

function Editor({ day, editingId, setEditingId, updateEvent, addEvent, removeEvent, setData, flash }: { day: DayPlan; editingId: string | null; setEditingId: (value: string | null) => void; updateEvent: (id: string, patch: Partial<EventItem>) => void; addEvent: (event: Omit<EventItem, "id">) => void; removeEvent: (id: string) => void; setData: React.Dispatch<React.SetStateAction<AppData>>; flash: (text: string) => void }) {
  const [draft, setDraft] = useState({ time: "", title: "", note: "", location: "", kind: "spot" as EventItem["kind"] });
  return <section className="content feature-view">
    <div className="feature-title"><div><p>EDIT ITINERARY</p><h2>修改 {dateLabel(day.date)}</h2><span>點選項目即可直接編輯</span></div></div>
    <div className="panel day-edit"><label>當日主題<input value={day.theme} onChange={(event) => setData((current) => ({ ...current, days: current.days.map((item) => item.id === day.id ? { ...item, theme: event.target.value } : item) }))} /></label><label>副標題<input value={day.subtitle} onChange={(event) => setData((current) => ({ ...current, days: current.days.map((item) => item.id === day.id ? { ...item, subtitle: event.target.value } : item) }))} /></label></div>
    <div className="edit-list">{day.events.map((event) => editingId === event.id ? <article className="panel edit-card open" key={event.id}>
      <div className="form-grid"><label>時間<input value={event.time} onChange={(e) => updateEvent(event.id, { time: e.target.value })} /></label><label>類型<select value={event.kind} onChange={(e) => updateEvent(event.id, { kind: e.target.value as EventItem["kind"] })}><option value="spot">景點</option><option value="food">餐廳</option><option value="transit">交通</option><option value="rest">休息</option></select></label><label className="wide">名稱<input value={event.title} onChange={(e) => updateEvent(event.id, { title: e.target.value })} /></label><label className="wide">細節<textarea value={event.note} onChange={(e) => updateEvent(event.id, { note: e.target.value })} /></label><label className="wide">Google Maps 地點<input value={event.location || ""} onChange={(e) => updateEvent(event.id, { location: e.target.value })} /></label></div>
      <div className="edit-actions"><button className="danger" onClick={() => { removeEvent(event.id); setEditingId(null); }}>刪除</button><button className="primary" onClick={() => { setEditingId(null); flash("修改已儲存"); }}>完成</button></div>
    </article> : <button className="edit-row" key={event.id} onClick={() => setEditingId(event.id)}><time>{event.time}</time><span>{event.title}<small>{event.kind === "food" ? "餐廳" : event.kind === "transit" ? "交通" : event.kind === "rest" ? "休息" : "景點"}</small></span><b>›</b></button>)}</div>
    <form className="panel add-form" onSubmit={(event) => { event.preventDefault(); if (!draft.time || !draft.title) return flash("請填時間與名稱"); addEvent({ ...draft }); setDraft({ time: "", title: "", note: "", location: "", kind: "spot" }); }}><h3>新增景點／餐廳</h3><div className="form-grid"><label>時間<input placeholder="14:30–16:00" value={draft.time} onChange={(e) => setDraft({ ...draft, time: e.target.value })} /></label><label>類型<select value={draft.kind} onChange={(e) => setDraft({ ...draft, kind: e.target.value as EventItem["kind"] })}><option value="spot">景點</option><option value="food">餐廳</option><option value="transit">交通</option><option value="rest">休息</option></select></label><label className="wide">名稱<input placeholder="新增行程名稱" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} /></label><label className="wide">細節<textarea placeholder="交通、預約、注意事項…" value={draft.note} onChange={(e) => setDraft({ ...draft, note: e.target.value })} /></label><label className="wide">Google Maps 地點<input placeholder="輸入英文地點最準確" value={draft.location} onChange={(e) => setDraft({ ...draft, location: e.target.value })} /></label><button className="primary wide">＋ 新增到時間軸</button></div></form>
  </section>;
}
