import {NextResponse} from 'next/server';
import {sql} from '../../../lib/db';
import {parseInput} from '../../../lib/parser';
export const dynamic='force-dynamic';
const j=(x,s=200)=>NextResponse.json(x,{status:s});
async function snapshot(db){
 const accounts=await db`select * from accounts where active=true order by created_at`;
 const categories=await db`select * from categories where active=true order by category_group,name`;
 const transactions=await db`select t.*,c.name category,a.name account,ta.name to_account from transactions t left join categories c on c.id=t.category_id left join accounts a on a.id=t.account_id left join accounts ta on ta.id=t.to_account_id order by transaction_date desc,t.created_at desc limit 1000`;
 const budgets=await db`select b.*,c.name category from budgets b join categories c on c.id=b.category_id order by year desc,month desc,c.name`;
 const settings=await db`select * from settings`;
 return {configured:true,accounts,categories,transactions,budgets,settings};
}
export async function GET(){const db=sql();if(!db)return j({configured:false,error:'DATABASE_URL is not configured'},503);try{return j(await snapshot(db))}catch(e){return j({configured:false,error:e.message},500)}}
export async function POST(req){const db=sql();if(!db)return j({error:'DATABASE_URL is not configured'},503);try{const b=await req.json();
 if(b.action==='add'){const items=b.items?.length?b.items:parseInput(b.text||'');let count=0;for(const x of items){if(!x.amount)continue;const [a]=await db`select id from accounts where lower(name)=lower(${x.account}) limit 1`;const [to]=x.toAccount?(await db`select id from accounts where lower(name)=lower(${x.toAccount}) limit 1`):[];const [c]=x.category?(await db`select id from categories where lower(name)=lower(${x.category}) limit 1`):[];if(!a)throw new Error('Không tìm thấy tài khoản: '+x.account);await db`insert into transactions(transaction_date,type,amount,category_id,account_id,to_account_id,note,income_type) values(${b.date||new Date().toISOString().slice(0,10)},${x.type},${x.amount},${c?.id||null},${a.id},${to?.id||null},${x.note||null},${x.incomeType||null})`;count++}return j({ok:true,count,data:await snapshot(db)})}
 if(b.action==='delete'){await db`delete from transactions where id=${b.id}`;return j({ok:true,data:await snapshot(db)})}
 if(b.action==='update'){await db`update transactions set amount=${Number(b.amount)},note=${b.note||null},category_id=${b.categoryId||null},account_id=${b.accountId},to_account_id=${b.toAccountId||null},transaction_date=${b.date} where id=${b.id}`;return j({ok:true,data:await snapshot(db)})}
 if(b.action==='budget'){await db`insert into budgets(category_id,year,month,amount) values(${b.categoryId},${b.year},${b.month},${Number(b.amount)}) on conflict(category_id,year,month) do update set amount=excluded.amount,updated_at=now()`;return j({ok:true,data:await snapshot(db)})}
 if(b.action==='account'){await db`update accounts set opening_balance=${Number(b.openingBalance||0)},credit_limit=${b.creditLimit==null?null:Number(b.creditLimit)},statement_day=${b.statementDay==null?null:Number(b.statementDay)},updated_at=now() where id=${b.id}`;return j({ok:true,data:await snapshot(db)})}
 return j({error:'Unknown action'},400)}catch(e){return j({error:e.message},500)}}
