import { Redis } from "@upstash/redis";

export const SHARED_STATE_KEY = "singapore-travel:shared-state:v1";
const ASSET_PREFIX = "singapore-travel:asset:";

export type StoredAsset = { contentType:string; fileName:string; data:string };

export function redisClient() {
  const url=process.env.UPSTASH_REDIS_REST_URL||process.env.SINGAPORE_REDIS_KV_REST_API_URL;
  const token=process.env.UPSTASH_REDIS_REST_TOKEN||process.env.SINGAPORE_REDIS_KV_REST_API_TOKEN;
  if(!url||!token)throw new Error("Redis environment variables are missing");
  return new Redis({url,token});
}

export async function saveAsset(bytes:ArrayBuffer|Uint8Array,contentType:string,fileName:string) {
  const id=crypto.randomUUID();
  const data=Buffer.from(bytes instanceof ArrayBuffer?new Uint8Array(bytes):bytes).toString("base64");
  await redisClient().set(`${ASSET_PREFIX}${id}`,{contentType,fileName,data});
  return {id,url:`/api/assets/${id}`};
}

export async function readAsset(id:string) {
  return redisClient().get<StoredAsset>(`${ASSET_PREFIX}${id}`);
}

export async function deleteAsset(id:string) {
  return redisClient().del(`${ASSET_PREFIX}${id}`);
}

export function assetIdFromUrl(value:string) {
  const match=value.match(/\/api\/assets\/([a-zA-Z0-9-]+)$/);
  return match?.[1];
}

type MigratableState={hero?:{backgroundImage?:string};days?:Array<{backgroundImage?:string}>;version?:number;[key:string]:unknown};

export async function migrateBlobImages<T extends MigratableState>(state:T):Promise<T>{
  const migrated=structuredClone(state);const cache=new Map<string,string>();
  async function migrate(url?:string){
    if(!url||!url.includes("blob.vercel-storage.com"))return url;
    if(cache.has(url))return cache.get(url);
    try{const response=await fetch(url);if(!response.ok)return url;const bytes=await response.arrayBuffer();if(bytes.byteLength>4*1024*1024)return url;const saved=await saveAsset(bytes,response.headers.get("content-type")||"image/jpeg","migrated-cover");cache.set(url,saved.url);return saved.url;}catch{return url;}
  }
  if(migrated.hero)migrated.hero.backgroundImage=await migrate(migrated.hero.backgroundImage);
  if(migrated.days)for(const day of migrated.days)day.backgroundImage=await migrate(day.backgroundImage);
  return migrated;
}
