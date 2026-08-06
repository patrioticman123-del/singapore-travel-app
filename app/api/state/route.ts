import { list } from "@vercel/blob";
import { isAdmin } from "../../../lib/admin-auth";
import { migrateBlobImages, redisClient, SHARED_STATE_KEY } from "../../../lib/redis-storage";

const LEGACY_STATE_PATH="shared/singapore-travel-state.json";
type SharedState={hero:{backgroundImage?:string;[key:string]:unknown};days:Array<{backgroundImage?:string;[key:string]:unknown}>;version:number};

async function legacyState(){
  try{const result=await list({prefix:LEGACY_STATE_PATH,limit:1});if(!result.blobs[0])return null;const response=await fetch(result.blobs[0].url,{cache:"no-store"});return response.ok?await response.json() as SharedState:null;}catch{return null;}
}

export async function GET(){
  try{
    const redis=redisClient();const saved=await redis.get<SharedState>(SHARED_STATE_KEY);
    if(saved)return Response.json(saved,{headers:{"cache-control":"no-store"}});
    const legacy=await legacyState();
    if(!legacy)return Response.json({hero:null,days:null,version:0});
    const migrated=await migrateBlobImages(legacy);await redis.set(SHARED_STATE_KEY,migrated);
    return Response.json(migrated,{headers:{"cache-control":"no-store"}});
  }catch{
    const legacy=await legacyState();return Response.json(legacy||{hero:null,days:null,version:0},{headers:{"cache-control":"no-store"}});
  }
}

export async function PUT(request:Request){
  if(!(await isAdmin()))return Response.json({error:"只有管理者可以發布共用行程"},{status:401});
  const body=await request.json();if(!body.hero||!Array.isArray(body.days))return Response.json({error:"行程格式錯誤"},{status:400});
  const state=await migrateBlobImages({hero:body.hero,days:body.days,version:Date.now()});
  await redisClient().set(SHARED_STATE_KEY,state);
  return Response.json({version:state.version});
}
