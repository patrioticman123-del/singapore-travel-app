import { ensureTravelSchema, travelEnv } from "../../../../db/travel";

export async function GET(_request:Request,{params}:{params:Promise<{id:string}>}){
  await ensureTravelSchema();const {id}=await params;const ticket=await travelEnv.DB.prepare(`SELECT file_key AS fileKey, file_name AS fileName, file_type AS fileType FROM tickets WHERE id = ?`).bind(id).first<{fileKey:string|null;fileName:string|null;fileType:string|null}>();if(!ticket?.fileKey)return new Response("Not found",{status:404});const object=await travelEnv.TICKETS.get(ticket.fileKey);if(!object)return new Response("Not found",{status:404});const headers=new Headers();headers.set("content-type",ticket.fileType||"application/octet-stream");headers.set("content-disposition",`inline; filename*=UTF-8''${encodeURIComponent(ticket.fileName||"ticket")}`);headers.set("cache-control","private, max-age=60");return new Response(object.body,{headers});
}
