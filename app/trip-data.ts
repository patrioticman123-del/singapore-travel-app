export type EventItem = { id: string; time: string; title: string; note: string; location?: string; kind?: "spot" | "food" | "transit" | "rest" };
export type DayPlan = { id: string; date: string; weekday: string; theme: string; subtitle: string; backgroundImage?: string; events: EventItem[] };
export type Expense = { id: string; date: string; category: string; title: string; amount: number };

export const initialDays: DayPlan[] = [
  { id:"day-1", date:"2026-08-26", weekday:"三", theme:"濱海灣初見", subtitle:"抵達・魚尾獅・濱海灣夜景", events:[
    { id:"d1-1", time:"13:55", title:"抵達新加坡樟宜機場", note:"入境、領行李、上網卡；預留約 60–90 分鐘。", location:"Singapore Changi Airport", kind:"transit" },
    { id:"d1-2", time:"15:30–16:20", title:"前往 Hotel Faber Park", note:"建議 Grab／計程車；抵達後寄放行李或入住。", location:"Hotel Faber Park Singapore", kind:"transit" },
    { id:"d1-3", time:"16:20–17:10", title:"房間休息、盥洗", note:"補水，換輕便衣物。", kind:"rest" },
    { id:"d1-4", time:"17:15–17:40", title:"前往魚尾獅公園", note:"Grab 最省時間。", location:"Merlion Park Singapore", kind:"transit" },
    { id:"d1-5", time:"17:40–18:25", title:"魚尾獅公園與濱海灣步道", note:"拍攝 Marina Bay Sands、Esplanade。", location:"Merlion Park Singapore", kind:"spot" },
    { id:"d1-6", time:"18:25–19:20", title:"濱海灣晚餐", note:"Lau Pa Sat、Satay by the Bay 或 Marina Bay 區餐廳；約 S$10–30／人。", location:"Lau Pa Sat Singapore", kind:"food" },
    { id:"d1-7", time:"19:20–21:10", title:"濱海灣花園", note:"Supertree Grove、夜間燈光秀；視票券加入 Cloud Forest／Flower Dome。", location:"Gardens by the Bay", kind:"spot" },
    { id:"d1-8", time:"21:10–21:40", title:"返回飯店", note:"首日不再追加景點。", location:"Hotel Faber Park Singapore", kind:"transit" },
  ]},
  { id:"day-2", date:"2026-08-27", weekday:"四", theme:"聖淘沙", subtitle:"新加坡環球影城全日", events:[
    { id:"d2-1", time:"07:00–07:40", title:"飯店早餐", note:"提早準備，避免入園排隊。", kind:"food" },
    { id:"d2-2", time:"07:45–08:15", title:"前往 Resorts World Sentosa", note:"Grab 最快；也可到 VivoCity 轉 Sentosa Express。", location:"Resorts World Sentosa", kind:"transit" },
    { id:"d2-3", time:"08:15–開園", title:"安檢、排隊、確認表演", note:"依 2026 官方開園時間調整。", location:"Universal Studios Singapore", kind:"spot" },
    { id:"d2-4", time:"開園–12:30", title:"優先熱門設施", note:"Transformers、Battlestar Galactica、Revenge of the Mummy 等依喜好排序。", location:"Universal Studios Singapore", kind:"spot" },
    { id:"d2-5", time:"12:30–13:30", title:"園內午餐＋休息", note:"避開最熱與人潮高峰；約 S$15–30／人。", kind:"food" },
    { id:"d2-6", time:"13:30–17:30", title:"其餘設施與表演", note:"依排隊時間彈性調整。", location:"Universal Studios Singapore", kind:"spot" },
    { id:"d2-7", time:"17:30–19:00", title:"補玩或提早離園", note:"視體力與園區營業時間。", location:"Universal Studios Singapore", kind:"spot" },
    { id:"d2-8", time:"19:00–20:30", title:"VivoCity 晚餐／逛街", note:"Food Republic、松發肉骨茶或 PUTIEN。", location:"VivoCity Singapore", kind:"food" },
    { id:"d2-9", time:"20:30–21:00", title:"返回飯店", note:"整理照片、早點休息。", location:"Hotel Faber Park Singapore", kind:"transit" },
  ]},
  { id:"day-3", date:"2026-08-28", weekday:"五", theme:"萬態野生動物世界", subtitle:"River Wonders・Night Safari", events:[
    { id:"d3-1", time:"08:00–09:00", title:"飯店早餐與休息", note:"今天較晚回飯店，不必過早出發。", kind:"food" },
    { id:"d3-2", time:"09:15–10:00", title:"前往 Mandai Wildlife Reserve", note:"建議 Grab／計程車。", location:"Mandai Wildlife Reserve", kind:"transit" },
    { id:"d3-3", time:"10:00–13:00", title:"River Wonders", note:"依動線參觀淡水生態、熊貓展區等。", location:"River Wonders Singapore", kind:"spot" },
    { id:"d3-4", time:"13:00–14:00", title:"園區午餐", note:"避暑、補水；約 S$15–30／人。", location:"River Wonders Singapore", kind:"food" },
    { id:"d3-5", time:"14:00–16:30", title:"River Wonders 後半段／休息", note:"視園區開放活動調整。", location:"River Wonders Singapore", kind:"spot" },
    { id:"d3-6", time:"16:30–18:00", title:"Mandai 晚餐與休息", note:"不要再往市區來回。", location:"Mandai Wildlife West", kind:"food" },
    { id:"d3-7", time:"18:00–18:45", title:"前往 Night Safari 入場區", note:"依票券時段排隊。", location:"Night Safari Singapore", kind:"transit" },
    { id:"d3-8", time:"19:00–22:00", title:"Night Safari", note:"先看動物表演或先搭遊園車，依預約時段安排。", location:"Night Safari Singapore", kind:"spot" },
    { id:"d3-9", time:"22:00–22:45", title:"Grab 返回飯店", note:"夜間叫車可能等候，預留時間。", location:"Hotel Faber Park Singapore", kind:"transit" },
  ]},
  { id:"day-4", date:"2026-08-29", weekday:"六", theme:"購物自由日", subtitle:"Orchard・Bugis・Haji Lane", events:[
    { id:"d4-1", time:"08:30–09:30", title:"悠閒早餐", note:"今天保留彈性。", kind:"food" },
    { id:"d4-2", time:"10:00–13:00", title:"Orchard Road 購物", note:"ION Orchard、Ngee Ann City、Takashimaya。", location:"Orchard Road Singapore", kind:"spot" },
    { id:"d4-3", time:"13:00–14:00", title:"午餐", note:"Orchard／Somerset 美食街或 Din Tai Fung。", location:"Somerset Singapore", kind:"food" },
    { id:"d4-4", time:"14:00–17:00", title:"Bugis＋Haji Lane＋Kampong Glam", note:"街區拍照、咖啡、特色小店。", location:"Haji Lane Singapore", kind:"spot" },
    { id:"d4-5", time:"17:00–18:00", title:"回飯店休息／放戰利品", note:"避免全天曝曬。", location:"Hotel Faber Park Singapore", kind:"rest" },
    { id:"d4-6", time:"18:30–20:30", title:"晚餐自由選擇", note:"Chinatown、Clarke Quay 或 Marina Bay；名店建議訂位。", location:"Chinatown Singapore", kind:"food" },
    { id:"d4-7", time:"20:30 之後", title:"自由活動", note:"可補看濱海灣夜景或回飯店休息。", kind:"spot" },
  ]},
  { id:"day-5", date:"2026-08-30", weekday:"日", theme:"星耀樟宜", subtitle:"Rain Vortex・返程", events:[
    { id:"d5-1", time:"06:30", title:"起床、最後整理", note:"確認護照、票券、行李重量。", kind:"rest" },
    { id:"d5-2", time:"07:00–07:10", title:"退房並前往樟宜機場", note:"建議 Grab／計程車。", location:"Jewel Changi Airport", kind:"transit" },
    { id:"d5-3", time:"07:45–08:15", title:"抵達星耀樟宜", note:"寄放行李或先辦理報到；依櫃檯開放時間調整。", location:"Jewel Changi Airport", kind:"spot" },
    { id:"d5-4", time:"08:15–09:00", title:"早餐與星耀散步", note:"Ya Kun／Toast Box；商店部分可能尚未開門。", location:"Jewel Changi Airport", kind:"food" },
    { id:"d5-5", time:"09:00–09:30", title:"Rain Vortex 與 Forest Valley", note:"啟動時間以 2026 官方公告為準。", location:"HSBC Rain Vortex", kind:"spot" },
    { id:"d5-6", time:"09:30–10:10", title:"採買伴手禮", note:"不要逛到忘記報到時間。", location:"Jewel Changi Airport", kind:"spot" },
    { id:"d5-7", time:"10:10 前", title:"完成報到與托運", note:"國際線建議起飛前約 3 小時完成。", location:"Singapore Changi Airport", kind:"transit" },
    { id:"d5-8", time:"10:30–12:10", title:"安檢、出境、候機", note:"確認登機門是否需搭 Skytrain。", location:"Singapore Changi Airport", kind:"transit" },
    { id:"d5-9", time:"13:10", title:"班機離開新加坡", note:"旅程結束。", location:"Singapore Changi Airport", kind:"transit" },
  ]},
];
