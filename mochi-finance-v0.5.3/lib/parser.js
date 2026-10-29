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
const accountAliases=[
 ['Tech Credit',['tech credit','thẻ tech','the tech','td tech']],
 ['HSBC Credit',['hsbc credit','hsbc','thẻ hsbc','the hsbc','td hsbc']],
 ['Tech tiết kiệm',['tech tiết kiệm','tech tiet kiem','tài khoản tiết kiệm','tai khoan tiet kiem','tiết kiệm','tiet kiem']],
 ['Tech tiền nhà',['tech tiền nhà','tech tien nha','tk tiền nhà','tk tien nha','tài khoản tiền nhà','tai khoan tien nha']],
 ['VietinBank',['vietinbank','vietin']],
 ['Tech chính',['tech chính','tech chinh','tài khoản chính','tai khoan chinh','tk chính','tk chinh','tech main']]
];
function accountInText(s){let q=norm(s);for(const [name,aa] of accountAliases)if(aa.some(a=>q.includes(a)))return name;return null}
function findAccount(s,category){let explicit=accountInText(s);if(explicit)return explicit;if(['Di chuyển','Kudog'].includes(category))return'Tech Credit';if(['Mua sắm cá nhân','Buy Stuff'].includes(category))return'HSBC Credit';return'Tech chính'}
function parseTransferAccounts(text){
 let q=norm(text),from=null,to=null;
 // Prefer explicit Vietnamese transfer grammar: “từ X sang/qua/vào/đến Y”.
 let m=q.match(/(?:chuyển|transfer)?\s*.*?\btừ\s+(.+?)\s+(?:sang|qua|vào|đến|toi|tới)\s+(.+)$/);
 if(m){from=accountInText(m[1]);to=accountInText(m[2]);}
 // Credit-card repayment shorthand: “trả HSBC/Tech Credit từ Tech chính”.
 if(!to && (q.includes('trả')||q.includes('tra ')||q.includes('thanh toán thẻ')||q.includes('thanh toan the'))){
   if(q.includes('hsbc'))to='HSBC Credit'; else if(q.includes('tech credit')||q.includes('thẻ tech')||q.includes('the tech'))to='Tech Credit';
 }
 if(!from){let fm=q.match(/\btừ\s+(.+?)(?:\s+(?:sang|qua|vào|đến|toi|tới)\b|$)/);if(fm)from=accountInText(fm[1]);}
 if(!to){let tm=q.match(/\b(?:sang|qua|vào|đến|toi|tới)\s+(.+)$/);if(tm)to=accountInText(tm[1]);}
 // Natural defaults: if only destination is known, transfer from Tech chính.
 if(!from && to)from='Tech chính';
 return {from,to};
}
export function parseDate(text,baseDate){let base=baseDate?new Date(baseDate+'T12:00:00'):new Date(),q=norm(text),d=new Date(base);
 if(q.includes('hôm kia'))d.setDate(d.getDate()-2);else if(q.includes('hôm qua'))d.setDate(d.getDate()-1);else {
  let m=q.match(/(?:ngày\s*)?(\d{1,2})[\/-](\d{1,2})(?:[\/-](\d{2,4}))?/);if(m){let y=m[3]?Number(m[3]):base.getFullYear();if(y<100)y+=2000;d=new Date(y,Number(m[2])-1,Number(m[1]),12)}
  else {m=q.match(/ngày\s*(\d{1,2})\s*tháng\s*trước/);if(m){d=new Date(base.getFullYear(),base.getMonth()-1,Number(m[1]),12)}}
 }
 return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
export function parseInput(text,{categories=[],baseDate}={}){
 let q=norm(text),date=parseDate(text,baseDate);
 if(/\b(chuyển|transfer)\b|\btrả\s+(hsbc|tech credit|thẻ hsbc|thẻ tech)/.test(q)){
  let {from,to}=parseTransferAccounts(text);
  return[{type:'transfer',amount:parseAmount(text),account:from||'Tech chính',toAccount:to,note:text,date}]
 }
 if(/\b(lương|salary)\b/.test(q))return[{type:'income',incomeType:'salary',amount:parseAmount(text),account:findAccount(text,''),note:text,date}];
 if(/\b(bán|thưởng|thu nhập|income)\b/.test(q))return[{type:'income',incomeType:'other',amount:parseAmount(text),account:findAccount(text,''),note:text,date}];
 if(/trả lại|hoàn tiền|refund|hoàn lại/.test(q))return[{type:'refund',amount:parseAmount(text),account:findAccount(text,''),note:text,date}];
 return text.split(/[,;\n]+/).map(s=>s.trim()).filter(Boolean).map(note=>{let c=findCategory(note,categories);return{type:'expense',amount:parseAmount(note),category:c,account:findAccount(note,c),note,date}}).filter(x=>x.amount>0);
}
