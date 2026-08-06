import { initialDays } from "./trip-data";

export type AttractionGuide = {
  id:string;
  eventIds:string[];
  date:string;
  time:string;
  title:string;
  icon:string;
  intro:string;
  highlights:string[];
  tips:string[];
  sourceLabel:string;
  sourceUrl:string;
};

const event = (id:string) => initialDays.flatMap(day=>day.events.map(item=>({day,item}))).find(({item})=>item.id===id)!;

function guide(id:string,eventIds:string[],title:string,icon:string,intro:string,highlights:string[],tips:string[],sourceLabel:string,sourceUrl:string):AttractionGuide {
  const first=event(eventIds[0]);
  return {id,eventIds,date:first.day.date,time:first.item.time,title,icon,intro,highlights,tips,sourceLabel,sourceUrl};
}

export const initialGuides:AttractionGuide[] = [
  guide("merlion",["d1-5"],"魚尾獅公園與濱海灣","🦁","魚尾獅以獅頭與魚身象徵「獅城」及新加坡早期漁村歷史。公園正對濱海灣，是第一次到新加坡最適合認識城市天際線的位置。",["魚尾獅正面與側面取景","遠眺濱海灣金沙與藝術科學博物館","沿濱海灣步道散步"],["傍晚光線較柔和，接夜景最順","地面可能濕滑，拍照時留意水花與人潮"],"Visit Singapore 官方介紹","https://www.visitsingapore.com/neighbourhood/featured-neighbourhood/marina-bay/merlion-park/"),
  guide("gardens",["d1-7"],"濱海灣花園","🌳","濱海灣花園把園藝、永續設計與未來感建築放在同一座城市花園中。Supertree Grove 的垂直花園入夜後亮燈，是這晚的重點。",["Supertree Grove","Garden Rhapsody 聲光秀","依票券選擇 Cloud Forest 或 Flower Dome"],["先確認當日聲光秀與溫室入場時間","戶外免費區與付費溫室分開，票券放在對應行程最方便"],"Gardens by the Bay 官方介紹","https://www.gardensbythebay.com.sg/en/learn-with-us/explore-resources/articles/supertree-grove-and-supertree-observatory.html"),
  guide("uss",["d2-3","d2-4","d2-6","d2-7"],"新加坡環球影城","🎬","東南亞的環球影城主題樂園，以電影與動畫主題設施、表演和角色見面為主。熱門設施排隊變化大，適合先確認官方 App 再決定順序。",["Transformers 3D","Battlestar Galactica","Revenge of the Mummy","Minion Land"],["入園先看等待時間與臨時停駛公告","身高限制與表演時刻以當日官方資訊為準","怕排隊可評估 Universal Express"],"Resorts World Sentosa 官方介紹","https://www.rwsentosa.com/en/play/universal-studios-singapore"),
  guide("river-wonders",["d3-3","d3-5"],"River Wonders","🐼","以世界河川與淡水生態為主題的野生動物園，可依河域動線認識水生與陸生動物，並參觀大熊貓與 Amazon Flooded Forest 等展區。",["大熊貓展區","Amazon Flooded Forest","世界河川生態展區","Amazon River Quest（另依現場規定）"],["園區大部分路線有遮蔽，仍建議補水","動物活動與展區開放狀況以當日公告為準","表演座位通常需依官方規則預約"],"Mandai Wildlife Reserve 官方介紹","https://www.mandai.com/en/river-wonders.html"),
  guide("night-safari",["d3-8"],"Night Safari","🦉","以夜行性動物與夜間棲地為主題，可搭乘 Safari Adventure Tram，再依體力走步道觀察不同動物。暗處不強行使用閃光，更容易適應環境。",["Safari Adventure Tram","步行探索路線","Creatures of the Night 動物介紹"],["確認票券入場時段並提早抵達","表演座位可能需在當日透過官方系統預約","夜間拍照避免閃光並降低螢幕亮度"],"Mandai Wildlife Reserve 官方訂位說明","https://www.mandai.com/en/book-presentation-seats.html"),
  guide("kampong-gelam",["d4-4"],"Bugis・Haji Lane・Kampong Glam","🕌","甘榜格南是新加坡歷史悠久的城市街區，傳統商店、蘇丹回教堂、街頭藝術與新式咖啡館並存；Haji Lane 則以壁畫、獨立小店和狹窄街景聞名。",["蘇丹回教堂外觀","Bussorah Street","Haji Lane 壁畫與小店","Arab Street 布料與香氛商店"],["宗教場所請穿著得體並遵守參觀規則","下午較熱，可把咖啡休息排在步行中段","Bugis MRT 進出最方便"],"Visit Singapore 官方介紹","https://www.visitsingapore.com/neighbourhood/featured-neighbourhood/kampong-gelam/"),
  guide("jewel",["d5-3","d5-5","d5-6"],"星耀樟宜與 Rain Vortex","💧","星耀樟宜把機場、購物中心與室內花園結合，核心的 HSBC Rain Vortex 從玻璃穹頂中央落下，周圍則是 Shiseido Forest Valley 的分層步道。",["HSBC Rain Vortex","Shiseido Forest Valley","不同樓層的瀑布視角","最後採買伴手禮"],["瀑布啟動時間可能調整，出發前查看官網","先完成報到或寄放行李，再輕裝參觀","保留足夠時間返回航廈與通關"],"Jewel Changi Airport 官方介紹","https://www.jewelchangiairport.com/en/attractions/hsbc-rain-vortex.html")
];

export function guideForEvent(guides:AttractionGuide[],eventId:string){return guides.find(item=>item.eventIds.includes(eventId));}
