import { isAdmin } from "../../../../lib/admin-auth";
import { deleteAsset, readAsset } from "../../../../lib/redis-storage";

export async function GET(_request:Request,{params}:{params:Promise<{id:string}>}){
  const {id}=await params,asset=await readAsset(id);if(!asset)return new Response("Not found",{status:404});
  return new Response(Buffer.from(asset.data,"base64"),{headers:{"content-type":asset.contentType,"content-disposition":`inline; filename*=UTF-8''${encodeURIComponent(asset.fileName)}`,"cache-control":"public, max-age=31536000, immutable"}});
}

export async function DELETE(_request:Request,{params}:{params:Promise<{id:string}>}){
  if(!(await isAdmin()))return Response.json({error:"未授權"},{status:401});const {id}=await params;await deleteAsset(id);return Response.json({deleted:true});
}
