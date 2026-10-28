const aliases=[
 [['cà phê','cafe','coffee','highland','starbucks'], 'Cafe'],
 [['ăn trưa','cơm trưa','bữa trưa','trưa'], 'Ăn trưa'],
 [['ăn tối','cơm tối','bữa tối','tối'], 'Ăn tối'],
 [['ăn vặt','snack','trà sữa','đồ ăn vặt'], 'Ăn vặt'],
 [['grab','taxi','xăng','đổ xăng','be ','be bike','be car','di chuyển','gửi xe','parking'], 'Di chuyển'],
 [['siêu thị','winmart','coopmart','lotte mart','đi chợ'], 'Siêu thị'],
 [['shopee','lazada','tiki','mua đồ','mua sắm','quần áo'], 'Mua sắm cá nhân'],
 [['buy stuff','massage','mát xa'], 'Buy Stuff'],
 [['kudog','nạp game','game'], 'Kudog'],
 [['giải trí'], 'Giải trí khác'],
 [['quà tặng','tặng quà'], 'Quà tặng'],
 [['biếu','cho bố','cho mẹ','cho ba'], 'Biếu'],
 [['thăm người ốm','thăm ốm'], 'Thăm người ốm'],
 [['đám cưới','cưới','mừng cưới'], 'Cưới xin'],
 [['bệnh viện','khám bệnh','đi viện','khám '], 'Bệnh viện'],
 [['thuốc','nhà thuốc'], 'Thuốc'],
 [['công tác'], 'Chi tiêu công tác'],
 [['vé máy bay','vé bay','về hn','về hà nội'], 'Vé máy bay về HN'],
 [['tiền nhà','thuê nhà'], 'Tiền nhà'],
 [['tiền điện','điện'], 'Điện'],
 [['tiền nước','nước'], 'Nước'],
 [['internet','wifi','mạng'], 'Internet'],
 [['ăn uống','ăn ','cơm ','phở','bún','nhậu'], 'Ăn uống']
];
const norm=s=>String(s||'').toLowerCase().normalize('NFC').trim();
export function parseAmount(raw){
 let s=norm(raw).replace(/₫|vnd/g,'').replace(/(\d+)\s*tr\s*(\d+)/g,'$1.$2tr').replace(/(\d+)\s*triệu\s*(\d+)/g,'$1.$2tr');
 let m=s.match(/(\d+(?:[.,]\d+)?)\s*(triệu|tr|m|nghìn|ngàn|k)\b/i);
 if(m){let n=Number(m[1].replace(',','.')); if(/triệu|tr|m/i.test(m[2]))n*=1e6;else n*=1e3;return Math.round(n)}
 m=s.match(/\b(\d{4,})\b/);if(m)return Number(m[1]);
 m=s.match(/\b(\d{1,3})\b/);if(m)return Number(m[1])*1000; // conversational expense: 70 => 70k
 return null;
}
function findCategory(s,categories=[]){let q=norm(s);for(const [aa,c] of aliases)if(aa.some(a=>q.includes(a)))return c;for(const c of categories){if(q.includes(norm(c.name)))return c.name}return null}
function findAccount(s,category){let q=norm(s);if(q.includes('hsbc'))return'HSBC Credit';if(q.includes('tech credit')||q.includes('thẻ tech'))return'Tech Credit';if(q.includes('vietin'))return'VietinBank';if(q.includes('tiết kiệm'))return'Tech tiết kiệm';if(q.includes('tech tiền nhà')||q.includes('tk tiền nhà'))return'Tech tiền nhà';if(['Di chuyển','Kudog'].includes(category))return'Tech Credit';if(['Mua sắm cá nhân','Buy Stuff'].includes(category))return'HSBC Credit';return'Tech chính'}
export function parseDate(text,baseDate){let base=baseDate?new Date(baseDate+'T12:00:00'):new Date(),q=norm(text),d=new Date(base);
 if(q.includes('hôm kia'))d.setDate(d.getDate()-2);else if(q.includes('hôm qua'))d.setDate(d.getDate()-1);else {
  let m=q.match(/(?:ngày\s*)?(\d{1,2})[\/-](\d{1,2})(?:[\/-](\d{2,4}))?/);if(m){let y=m[3]?Number(m[3]):base.getFullYear();if(y<100)y+=2000;d=new Date(y,Number(m[2])-1,Number(m[1]),12)}
  else {m=q.match(/ngày\s*(\d{1,2})\s*tháng\s*trước/);if(m){d=new Date(base.getFullYear(),base.getMonth()-1,Number(m[1]),12)}}
 }
 return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
export function parseInput(text,{categories=[],baseDate}={}){
 let q=norm(text),date=parseDate(text,baseDate);
 if(/\b(chuyển|transfer)\b|trả\s+(hsbc|tech credit)/.test(q)){
  let to=q.includes('hsbc')?'HSBC Credit':q.includes('tech credit')?'Tech Credit':q.includes('tiết kiệm')?'Tech tiết kiệm':q.includes('tiền nhà')?'Tech tiền nhà':q.includes('vietin')?'VietinBank':null;
  let from=q.includes('từ vietin')?'VietinBank':q.includes('từ tiết kiệm')?'Tech tiết kiệm':'Tech chính';
  return[{type:'transfer',amount:parseAmount(text),account:from,toAccount:to,note:text,date}]
 }
 if(/\b(lương|salary)\b/.test(q))return[{type:'income',incomeType:'salary',amount:parseAmount(text),account:findAccount(text,''),note:text,date}];
 if(/\b(bán|thưởng|thu nhập|income)\b/.test(q))return[{type:'income',incomeType:'other',amount:parseAmount(text),account:findAccount(text,''),note:text,date}];
 if(/trả lại|hoàn tiền|refund|hoàn lại/.test(q))return[{type:'refund',amount:parseAmount(text),account:findAccount(text,''),note:text,date}];
 return text.split(/[,;\n]+/).map(s=>s.trim()).filter(Boolean).map(note=>{let c=findCategory(note,categories);return{type:'expense',amount:parseAmount(note),category:c,account:findAccount(note,c),note,date}}).filter(x=>x.amount>0);
}
