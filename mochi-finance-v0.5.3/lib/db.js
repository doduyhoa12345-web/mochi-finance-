import postgres from 'postgres';
let client;
export function sql(){
 if(!process.env.DATABASE_URL) return null;
 if(!client) client=postgres(process.env.DATABASE_URL,{ssl:'require',max:5,prepare:false});
 return client;
}
