import { ensureTravelSchema, listTickets, travelEnv } from "../../../db/travel";

export async function GET() {
  await ensureTravelSchema();
  const row=await travelEnv.DB.prepare(`SELECT payload, version FROM app_state WHERE id = ?`).bind(1).first<{payload:string;version:number}>();
  const saved=row?JSON.parse(row.payload):{days:null,expenses:[]};
  return Response.json({ ...saved, tickets:await listTickets(), version:row?.version||0 }, { headers:{"cache-control":"no-store"} });
}

export async function PUT(request:Request) {
  await ensureTravelSchema();
  const body=await request.json() as {days:unknown;expenses:unknown};
  if(!Array.isArray(body.days)||!Array.isArray(body.expenses)) return Response.json({error:"Invalid data"},{status:400});
  const current=await travelEnv.DB.prepare(`SELECT version FROM app_state WHERE id = ?`).bind(1).first<{version:number}>();
  const version=(current?.version||0)+1;
  await travelEnv.DB.prepare(`INSERT INTO app_state (id, payload, version, updated_at) VALUES (?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET payload = excluded.payload, version = excluded.version, updated_at = excluded.updated_at`).bind(1,JSON.stringify({days:body.days,expenses:body.expenses}),version,new Date().toISOString()).run();
  return Response.json({version});
}
