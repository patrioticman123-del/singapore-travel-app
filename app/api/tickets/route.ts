import { ensureTravelSchema, listTickets, travelEnv } from "../../../db/travel";

export async function GET(){return Response.json({tickets:await listTickets()},{headers:{"cache-control":"no-store"}});}

export async function POST(request:Request){
  await ensureTravelSchema();const form=await request.formData();const eventId=String(form.get("eventId")||"");const name=String(form.get("name")||"");const number=String(form.get("number")||"");const file=form.get("file");
  if(!eventId||!name||(!number&&!(file instanceof File)))return Response.json({error:"Missing ticket details"},{status:400});
  if(file instanceof File&&file.size>10*1024*1024)return Response.json({error:"File too large"},{status:413});
  const id=crypto.randomUUID();let fileKey:string|null=null;let fileName:string|null=null;let fileType:string|null=null;
  if(file instanceof File){fileName=file.name;fileType=file.type||"application/octet-stream";fileKey=`tickets/${id}/${file.name.replace(/[^a-zA-Z0-9._-]/g,"_")}`;await travelEnv.TICKETS.put(fileKey,await file.arrayBuffer(),{httpMetadata:{contentType:fileType}});}
  await travelEnv.DB.prepare(`INSERT INTO tickets (id,event_id,name,number,file_key,file_name,file_type,created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`).bind(id,eventId,name,number,fileKey,fileName,fileType,new Date().toISOString()).run();
  return Response.json({id},{status:201});
}

export async function DELETE(request:Request){
  await ensureTravelSchema();const id=new URL(request.url).searchParams.get("id");if(!id)return Response.json({error:"Missing id"},{status:400});const ticket=await travelEnv.DB.prepare(`SELECT file_key AS fileKey FROM tickets WHERE id = ?`).bind(id).first<{fileKey:string|null}>();if(ticket?.fileKey)await travelEnv.TICKETS.delete(ticket.fileKey);await travelEnv.DB.prepare(`DELETE FROM tickets WHERE id = ?`).bind(id).run();return new Response(null,{status:204});
}
