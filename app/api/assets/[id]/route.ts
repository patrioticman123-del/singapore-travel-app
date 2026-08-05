import { travelEnv } from "../../../../db/travel";

export async function GET(_request:Request,{params}:{params:Promise<{id:string}>}){const {id}=await params;if(!/^[0-9a-f-]{36}$/i.test(id))return new Response("Not found",{status:404});const object=await travelEnv.TICKETS.get(`backgrounds/${id}`);if(!object)return new Response("Not found",{status:404});const headers=new Headers();object.writeHttpMetadata(headers);headers.set("etag",object.httpEtag);headers.set("cache-control","public, max-age=3600");return new Response(object.body,{headers});}
