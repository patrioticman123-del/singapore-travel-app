export type FoodGuide = {id:string;name:string;area:string;icon:string;location:string;feature:string;dishes:string[];price:string;note?:string};

export const foodGuides:FoodGuide[] = [
  {id:"lau-pa-sat",name:"Lau Pa Sat",area:"濱海灣／CBD",icon:"🍢",location:"Lau Pa Sat Singapore",feature:"維多利亞式鑄鐵建築裡的老牌熟食中心，選擇多、座位多，晚上旁邊 Satay Street 氣氛最好。",dishes:["沙嗲拼盤","福建炒蝦麵","炒粿條","甘蔗汁"],price:"約 S$8–25／人"},
  {id:"satay-by-the-bay",name:"Satay by the Bay",area:"濱海灣花園",icon:"🔥",location:"Satay by the Bay Singapore",feature:"靠近濱海灣花園的戶外熟食區，適合看完花園前後用餐，環境較休閒。",dishes:["沙嗲","烤雞翅","海鮮燒烤","椰子水"],price:"約 S$12–30／人"},
  {id:"malaysian-food-street",name:"Malaysian Food Street",area:"聖淘沙名勝世界",icon:"🍜",location:"Malaysian Food Street Resorts World Sentosa",feature:"環球影城外較方便的南洋美食街，適合離園後快速補充體力，選擇比園內集中。",dishes:["福建麵","肉骨茶","椰漿飯","燒臘飯"],price:"約 S$10–22／人"},
  {id:"food-republic-vivo",name:"Food Republic VivoCity",area:"港灣／VivoCity",icon:"🥢",location:"Food Republic VivoCity Singapore",feature:"從聖淘沙回市區時最順路的大型美食廣場，團體可各自選餐再一起用餐。",dishes:["海南雞飯","魚丸麵","印度煎餅","甜品"],price:"約 S$7–18／人"},
  {id:"ulu-ulu",name:"Ulu Ulu Safari Restaurant",area:"Night Safari",icon:"🌙",location:"Ulu Ulu Safari Restaurant Singapore",feature:"位於 Night Safari 入口區，適合入園前吃晚餐，避免夜間行程中途找餐廳。",dishes:["新加坡在地料理","烤物","麵飯主餐","兒童餐"],price:"約 S$18–40／人",note:"營業與菜單依園區當日公告。"},
  {id:"ion-food-opera",name:"Food Opera @ ION Orchard",area:"烏節路",icon:"🍲",location:"Food Opera ION Orchard Singapore",feature:"位在 ION Orchard 的美食廣場，逛街途中最容易安排，從小吃到完整主餐都有。",dishes:["肉骨茶","雞飯","叻沙","煲仔飯"],price:"約 S$8–22／人"},
  {id:"violet-oon",name:"National Kitchen by Violet Oon",area:"市政區",icon:"🌺",location:"National Kitchen by Violet Oon Singapore",feature:"較舒適的餐廳環境，以新加坡與娘惹風味為主，適合想一次認識多種本地料理的人。",dishes:["乾咖哩牛肉 Rendang","乾炒叻沙","黑果雞 Ayam Buah Keluak","班蘭甜點"],price:"約 S$35–70／人",note:"熱門時段建議事先訂位。"},
  {id:"hjh-maimunah",name:"Hjh Maimunah",area:"甘榜格南",icon:"🍛",location:"Hjh Maimunah Restaurant Jalan Pisang Singapore",feature:"老字號馬來／印尼式 Nasi Padang，直接從多樣熟食中搭配白飯，適合在 Haji Lane 行程中吃正餐。",dishes:["仁當牛肉","Ayam Bakar 烤雞","參巴蝦","馬來蔬菜"],price:"約 S$12–28／人"},
  {id:"zam-zam",name:"Singapore Zam Zam",area:"甘榜格南",icon:"🥘",location:"Singapore Zam Zam Restaurant",feature:"靠近蘇丹回教堂的百年印度穆斯林餐館，份量實在、翻桌快，適合多人分享。",dishes:["鹿肉或雞肉 Murtabak","印度煎餅","羊肉 Biryani","拉茶"],price:"約 S$8–25／人"},
  {id:"song-fa",name:"Song Fa Bak Kut Teh",area:"克拉碼頭",icon:"🍖",location:"Song Fa Bak Kut Teh New Bridge Road Singapore",feature:"以胡椒、蒜香明顯的潮州式肉骨茶聞名，湯頭清亮，可免費續湯，適合晚餐或宵夜前段。",dishes:["排骨肉骨茶","油條","滷味拼盤","鹹菜"],price:"約 S$15–30／人"},
  {id:"jumbo",name:"JUMBO Seafood Riverside Point",area:"新加坡河／克拉碼頭",icon:"🦀",location:"JUMBO Seafood Riverside Point Singapore",feature:"河畔海鮮餐廳，適合多人共享新加坡代表性的辣椒螃蟹，景觀與用餐完整度較高。",dishes:["辣椒螃蟹","黑胡椒螃蟹","炸饅頭","麥片蝦"],price:"約 S$60–120／人",note:"螃蟹多依重量計價，點餐前先確認價格；建議訂位。"},
  {id:"tian-tian",name:"天天海南雞飯",area:"牛車水／Maxwell",icon:"🍗",location:"Tian Tian Hainanese Chicken Rice Maxwell Food Centre",feature:"Maxwell Food Centre 的知名雞飯攤，雞肉滑嫩、米飯有雞油與香料香氣，排隊通常較長。",dishes:["白斬雞飯","雞腿飯","多人份雞肉拼盤"],price:"約 S$6–15／人"},
  {id:"hong-lim",name:"Hong Lim Market & Food Centre",area:"牛車水",icon:"🍜",location:"Hong Lim Market and Food Centre Singapore",feature:"在地感較強的熟食中心，可集中品嘗叻沙、肉骨茶與各式麵食，午餐尖峰人潮明顯。",dishes:["Sungei Road Trishaw Laksa","福建式藥材肉骨茶","肉脞麵","雲吞麵"],price:"約 S$5–12／人"},
  {id:"ya-kun-jewel",name:"Ya Kun Kaya Toast",area:"星耀樟宜／機場",icon:"☕",location:"Ya Kun Kaya Toast Jewel Changi Airport",feature:"返程早上最省時間的新加坡式早餐，咖椰吐司配半熟蛋與南洋咖啡是經典組合。",dishes:["咖椰牛油吐司","半熟蛋","Kopi 咖啡","Teh 奶茶"],price:"約 S$6–12／人"},
  {id:"song-fa-jewel",name:"Song Fa Bak Kut Teh @ Jewel",area:"星耀樟宜",icon:"🥣",location:"Song Fa Bak Kut Teh Jewel Changi Airport",feature:"若早餐後還有時間，可在機場吃一餐胡椒肉骨茶，適合作為旅程最後一頓本地料理。",dishes:["排骨肉骨茶","油條","滷豬腳","腐竹"],price:"約 S$18–32／人"}
];
